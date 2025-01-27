import { CDPInfo } from "./cdp.types";


const ilkTypes = ["ETH-A", "WBTC-A", "USDC-A"] as const;
export type IlkType = (typeof ilkTypes)[number];

type Provider = "Metamask" | "Infura";
export interface State {
  currentId: string;
  currentType: IlkType | undefined;
  fetchId: string;
  currentCDP: null | CDPInfo,
  ethRate: number | undefined;
  wbtcRate: number | undefined;
  usdcRate: number | undefined;
  provider: Provider;
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
