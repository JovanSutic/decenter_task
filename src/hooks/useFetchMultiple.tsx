import Web3 from "web3";
import { bytesToString } from "../utils/bytes";
import { useCallback, useEffect, useMemo, useState } from "react";
import Bottleneck from "bottleneck";
import { CDP_ABI, cdpManagerAddress } from "../utils/constants";
import { CDPInfo, UseFetchCDPResult } from "../types/cdp.types";
import { useCustomStore } from "./store";
import { IlkType } from "../types/store.types";

export const useFetchMultiple = (
  startPosition: string,
  cdpType: IlkType | undefined,
  count = 20
): UseFetchCDPResult => {
  const { web3 } = useCustomStore("web3");

  const [data, setData] = useState<CDPInfo[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const cdpManager = useMemo(() => {
    return web3 ? new web3.eth.Contract(CDP_ABI, cdpManagerAddress) : null;
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

  const main = useCallback(async () => {
    if (!cdpManager) {
      setError("Web3 not initialized");
      return;
    }

    setLoading(true);
    try {
      const cdps = await fetchClosestCDPs(Number(startPosition));
      setData(cdps.sort((a, b) => a.id - b.id));
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [startPosition, cdpType, cdpManager]);

  useEffect(() => {
    const fetchCDP = async () => {
      await main();
    };

    if (startPosition && cdpType) {
      fetchCDP();
    } else {
      setData([]);
      setError("");
      setProgress(0);
      if (loading) setLoading(false);
    }

    if (error) {
      setError("");
    }
  }, [startPosition, cdpType]);

  return { data, error, loading, progress };
};
