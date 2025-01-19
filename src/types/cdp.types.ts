export interface CDPInfo {
  id: number;
  ilk: string;
  collateral: bigint;
  debt: bigint;
}

export interface UseFetchCDPResult {
  list: CDPInfo[];
  error: string;
  loading: boolean;
  progress: number;
  ilkRate: number;
}

export interface IlkInfo {
  Art: bigint;
  dust: bigint;
  line: bigint;
  rate: bigint;
  spot: bigint;
}
