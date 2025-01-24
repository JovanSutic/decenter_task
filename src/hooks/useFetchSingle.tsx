import { useCallback, useEffect, useState } from "react";
import { CDPInfo } from "../types/cdp.types";
import { store } from "./store";
import Web3Singleton from "../utils/web3Instance";

export const useFetchSingle = (startPosition: string): any => {
  const [data, setData] = useState<CDPInfo>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const cdpManager = Web3Singleton.getCdpManager();

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

    if (startPosition) {
      const currentCDP = store.getStateValue("currentCDP");
      if (currentCDP) {
        setData(currentCDP);
      } else {
        fetchCDP();
      }
    }
  }, [startPosition]);

  return { data, error, loading };
};
