/* eslint-disable react-hooks/exhaustive-deps */
import { stringToBytes } from "../utils/bytes";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RATE_ABI, ilkRateAddress, ilkRateMap } from "../utils/constants";
import { IlkInfo } from "../types/cdp.types";
import { useCustomStore, store } from "./store";
import { IlkType, StateKey } from "../types/store.types";

export const useFetchRate = (
  cdpType: IlkType | undefined
): { rate: number | undefined; loading: boolean; error: string;  } => {
  const { web3 } = useCustomStore(["web3", "ethRate"]);
  const [rate, setRate] = useState<number | undefined>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const rateManager = useMemo(() => {
    return web3 ? new web3.eth.Contract(RATE_ABI, ilkRateAddress) : null;
  }, [web3]);

  const getIlkInfo = useCallback(async () => {
    if (!web3 || !rateManager || !cdpType) return null;
    try {
      const ilkBytes32 = stringToBytes(cdpType);

      const result: IlkInfo = await rateManager.methods.ilks(ilkBytes32).call();
      const numRate = Number(BigInt(result.rate)) / Number(BigInt(10 ** 27));
      store.setState([ilkRateMap[cdpType] as StateKey], (state) => ({
        ...state,
        [ilkRateMap[cdpType] as StateKey]: numRate,
      }));
      setRate(numRate);
    } catch (error) {
      setError("Error fetching ilk info.");
    }
  }, [cdpType, rateManager]);

  useEffect(() => {
    const fetchIlk = async () => {
      await getIlkInfo();
    };

    if (cdpType) {
      setLoading(true);
      const key = ilkRateMap[cdpType];
      store.getStateValue(key as StateKey);
      const possibleRate = store.getStateValue(key as StateKey);
      if (!possibleRate) {
        fetchIlk();
      } else {
        setRate(possibleRate);
      }
      setLoading(false);
    }

    if (error) {
      setError("");
    }
  }, [cdpType, web3]);

  return { rate, loading, error };
};
