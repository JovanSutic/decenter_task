/* eslint-disable react-hooks/exhaustive-deps */
import { stringToBytes } from "../utils/bytes";
import { useCallback, useEffect, useState } from "react";
import { ilkRateMap } from "../utils/constants";
import { IlkInfo } from "../types/cdp.types";
import {  store } from "./store";
import { IlkType, StateKey } from "../types/store.types";
import Web3Singleton from "../utils/web3Instance";

export const useFetchRate = (
  cdpType: IlkType | undefined
): { rate: number | undefined; loading: boolean; error: string;  } => {
  const [rate, setRate] = useState<number | undefined>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const rateManager = Web3Singleton.getRateManager();

  const getIlkInfo = useCallback(async () => {
    if (!rateManager || !cdpType) return null;
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
  }, [cdpType]);

  return { rate, loading, error };
};
