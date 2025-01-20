import Web3 from "web3";
import { CDPInfo } from "./cdp.types";


const ilkTypes = ["ETH-A", "WBTC-A", "USDC-A"] as const;
export type IlkType = (typeof ilkTypes)[number];
export interface State {
  currentId: string;
  currentType: IlkType | undefined;
  fetchId: string;
  currentCDP: null | CDPInfo,
  web3: Web3 | null;
  ethRate: number | undefined;
  wbtcRate: number | undefined;
  usdcRate: number | undefined;
  isMetamaskConnected: boolean;
}

export type StateKey = keyof State;
export type StateKeyOrKeys = StateKey | Array<StateKey>;

export interface Store {
  state: State;
  subscribers: Record<keyof State, Function[]>;
  getState: () => State;
  getStateValue: (value: StateKey) => any;
  setState: (part: StateKeyOrKeys, updateFunc: (state: State) => State) => void;
  subscribe: (part: StateKeyOrKeys, subscriber: Function) => void;
  notifySubscribers: (part: StateKeyOrKeys) => void;
}
