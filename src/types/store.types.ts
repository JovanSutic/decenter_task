export interface State {
  currentId: string;
  currentType: string;
  fetchId: string;
}

export type StateKeyOrKeys = keyof State | Array<keyof State>;

export interface Store {
  state: State;
  subscribers: Record<keyof State, Function[]>;
  getState: () => State;
  setState: (part: StateKeyOrKeys, updateFunc: (state: State) => State) => void;
  subscribe: (part: StateKeyOrKeys, subscriber: Function) => void;
  notifySubscribers: (part: StateKeyOrKeys) => void;
}
