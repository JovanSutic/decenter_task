/* eslint-disable react-hooks/exhaustive-deps */
import Web3 from "web3";
import { bytesToString } from "../utils/bytes";
import { useCallback, useEffect, useMemo, useState } from "react";
import Bottleneck from "bottleneck";
import { ABI, RATE_ABI } from "../utils/abi";
import { CDPInfo, IlkInfo, UseFetchCDPResult } from "../types/cdp.types";

export const useFetchCDP = (
  startPosition: string,
  cdpType: string,
  count = 20
): UseFetchCDPResult => {
  const cdpManagerAddress = "0x68C61AF097b834c68eA6EA5e46aF6c04E8945B2d";
  const ilkRateAddress = "0x35d1b3f3d7966a1dfe207aa4514c12a259a0492b";
  const infuraUrl = `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;
  const concurrentRequests = new Set<Promise<any>>();

  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [ilkRate, setIlkRate] = useState<number>(1);
  const [list, setList] = useState<CDPInfo[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const newWeb3 = new Web3(window.ethereum);
      setWeb3(newWeb3);
    } else {
      const newWeb3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));
      setWeb3(newWeb3);
    }
  }, []);

  const cdpManager = useMemo(() => {
    return web3 ? new web3.eth.Contract(ABI, cdpManagerAddress) : null;
  }, [web3]);

  const rateManager = useMemo(() => {
    return web3 ? new web3.eth.Contract(RATE_ABI, ilkRateAddress) : null;
  }, [web3]);

  const limiter = useMemo(() => {
    return new Bottleneck({
      maxConcurrent: 5, // Adjust based on your needs
      minTime:
        web3 && web3.currentProvider instanceof Web3.providers.HttpProvider
          ? 300
          : 0,
    });
  }, [web3]);

  const makeInfuraCall = useCallback(
    async (call: () => Promise<any>) => {
      return limiter.schedule(call);
    },
    [limiter]
  );

  const getCdpInfo = useCallback(
    async (cdpId: string): Promise<CDPInfo | null> => {
      if (!cdpManager) return null;
      try {
        const info: any = await makeInfuraCall(() =>
          cdpManager.methods.getCdpInfo(cdpId).call()
        );
        return { ...info, id: Number(cdpId) };
      } catch (error) {
        console.error(`Failed to fetch CDP info for ID ${cdpId}:`, error);
        return null;
      }
    },
    [cdpManager, makeInfuraCall]
  );

  const fetchClosestCDPs = useCallback(
    async (targetId: number): Promise<CDPInfo[]> => {
      const cdps: CDPInfo[] = [];
      let fetchPromises: Promise<CDPInfo | null>[] = [];
      let positions: number[] = [];
      let diff = 0;

      while (cdps.length < count && diff < 500) {
        if (diff === 0) {
          fetchPromises.push(getCdpInfo(targetId.toString()));
          positions.push(targetId);
        } else {
          const low = targetId - diff;
          const high = targetId + diff;

          if (low > 0) {
            fetchPromises.push(
              getCdpInfo(low.toString()),
              getCdpInfo(high.toString())
            );
            positions.push(low, high);
          } else {
            fetchPromises.push(getCdpInfo(high.toString()));
            positions.push(high);
          }
        }

        const limit = Math.min(4, count - cdps.length);

        if (fetchPromises.length >= limit) {
          const results = await Promise.all(fetchPromises);
          results
            .filter(
              (cdp): cdp is CDPInfo =>
                cdp !== null && bytesToString(cdp.ilk) === cdpType
            )
            .forEach((cdp) => {
              if (cdps.length < count) {
                cdps.push(cdp);
              }
            });

          fetchPromises = [];
          positions = [];
        }

        setProgress(Math.floor((cdps.length / count) * 100));

        diff++;
      }

      if (diff > 499 && cdps.length < count) {
        setError(
          "Not enough data around this position. Please try with a different CDP position or collateral type."
        );
      }

      return cdps;
    },
    [getCdpInfo, cdpType]
  );

  const getIlkInfo = useCallback(async () => {
    if (!web3 || !rateManager || !cdpType) return null;
    try {
      const ilkBytes32 = web3.utils.padRight(
        web3.utils.asciiToHex(cdpType),
        64
      );

      const result: IlkInfo = await rateManager.methods.ilks(ilkBytes32).call();
      setIlkRate(Number(BigInt(result.rate)) / Number(BigInt(10 ** 27)));
    } catch (error) {
      setError("Error fetching ilk info.");
    }
  }, [cdpType, rateManager]);

  const main = useCallback(async () => {
    if (!cdpManager) {
      setError("Web3 not initialized");
      return;
    }

    setLoading(true);
    try {
      const cdps = await fetchClosestCDPs(Number(startPosition));
      setList(cdps.sort((a, b) => a.id - b.id));
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [startPosition, cdpType, cdpManager]);

  useEffect(() => {
    let isMounted = true;

    const fetchCDP = async () => {
      if (isMounted) {
        await main();
      }
    };

    const fetchIlk = async () => {
      if (isMounted) {
        await getIlkInfo();
      }
    };

    if (startPosition && cdpType) {
      fetchCDP();
    } else {
      setList([]);
      setError("");
      setProgress(0);
      if (loading) setLoading(false);
    }

    if (cdpType && !startPosition) {
      fetchIlk();
    }

    if (error) {
      setError("");
    }

    return () => {
      isMounted = false;
      concurrentRequests.forEach((promise) => promise.catch(() => {}));
    };
  }, [startPosition, cdpType]);

  return { list, error, loading, progress, ilkRate };
};
