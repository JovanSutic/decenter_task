import { useCallback, useEffect, useMemo, useState } from "react";
import { CDP_ABI, cdpManagerAddress } from "../utils/constants";
import { CDPInfo } from "../types/cdp.types";
import { store, useCustomStore } from "./store";

export const useFetchSingle = (startPosition: string): any => {
  const { web3 } = useCustomStore("web3");

  const [data, setData] = useState<CDPInfo>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const cdpManager = useMemo(() => {
    return web3 ? new web3.eth.Contract(CDP_ABI, cdpManagerAddress) : null;
  }, [web3]);

  const getCdpInfo = useCallback(
    async (cdpId: string): Promise<CDPInfo | null> => {
      if (!cdpManager) return null;
      try {
        const info: any = await cdpManager.methods.getCdpInfo(cdpId).call();
        return { ...info, id: Number(cdpId) };
      } catch (error) {
        console.error(`Failed to fetch CDP info for ID ${cdpId}:`, error);
        return null;
      }
    },
    [cdpManager]
  );

  const main = useCallback(async () => {
    if (!cdpManager) {
      setError("Web3 not initialized");
      return;
    }

    setLoading(true);
    try {
      const cdp = await getCdpInfo(startPosition);
      setData(cdp!);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [startPosition, cdpManager]);

  useEffect(() => {
    const fetchCDP = async () => {
      await main();
    };

    if (startPosition && web3) {
      const currentCDP = store.getStateValue("currentCDP");
      if (currentCDP) {
        setData(currentCDP);
      } else {
        fetchCDP();
      }
    }
  }, [startPosition, web3]);

  return { data, error, loading };
};
