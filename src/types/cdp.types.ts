import { IlkType } from "./store.types";

export interface CDPInfo {
  id: number;
  ilk: string;
  collateral: bigint;
  debt: bigint;
}

export interface UseFetchCDPResult {
  data: CDPInfo[];
  error: string;
  loading: boolean;
  progress: number;
}

export interface IlkInfo {
  Art: bigint;
  dust: bigint;
  line: bigint;
  rate: bigint;
  spot: bigint;
}

export interface CollateralInfo {
  price: number;
  liquidationRatio: number;
}

export interface CDPDetails {
  maxDebt: number;
  maxWithdraw: number;
  collateralRatio: number;
  liquidationPrice: number;
  debt: number;
  collateral: number;
  ilk: IlkType;
}
