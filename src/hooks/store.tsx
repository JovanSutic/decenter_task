import { useSyncExternalStore } from "react";

export interface State {
  currentId: string;
  currentType: string;
  fetchId: string;
}

type StateKeyOrKeys = keyof State | Array<keyof State>;

interface Store {
  state: State;
  subscribers: Record<keyof State, Function[]>;
  getState: () => State;
  setPartial: (partial: Partial<State>) => void;
  setState: (part: StateKeyOrKeys, newState: State) => void;
  subscribe: (
    part: StateKeyOrKeys,
    subscriber: Function
  ) => void;
  notifySubscribers: (part: StateKeyOrKeys) => void;
}

let timeoutId: ReturnType<typeof setTimeout> | null = null;

export const internalStore: Store = {
  state: {
    currentType: "",
    currentId: "",
    fetchId: "",
  },
  subscribers: {
    currentId: [],
    currentType: [],
    fetchId: [],
  },
  getState() {
    return this.state;
  },
  setPartial(partial: Partial<State>) {
    if (Object.keys(partial).includes("currentId")) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        this.setState("fetchId" as unknown as (keyof State)[], {
          ...this.state,
          fetchId: this.state.currentId,
        });
        timeoutId = null;
      }, 1000);
    }

    this.setState(Object.keys(partial) as unknown as (keyof State)[], {
      ...this.state,
      ...partial,
    });
  },
  setState(part: StateKeyOrKeys, newState: State) {
    this.state = newState;
    this.notifySubscribers(part);
  },
  subscribe(part: StateKeyOrKeys, subscriber: Function) {
    if (Array.isArray(part)) {
      part.forEach((p) => {
        this.subscribers[p].push(subscriber);
      });
    } else {
      this.subscribers[part].push(subscriber);
    }
  },

  notifySubscribers(part: StateKeyOrKeys) {
    if (Array.isArray(part)) {
      part.forEach((p) => {
        this.subscribers[p]?.forEach((subscriber) =>
          subscriber()
        );
      });
    } else {
      this.subscribers[part]?.forEach((subscriber) =>
        subscriber()
      );
    }
  },
};

export function useCustomStore(part: StateKeyOrKeys) {
  const getSnapshot = () => internalStore.getState();
  const subscribe = (callback: () => void) => {
    internalStore.subscribe(part, callback);
    return () => {
      if (Array.isArray(part)) {
        part.forEach((p) => {
          internalStore.subscribers[p] =
            internalStore.subscribers[p].filter(
              (sub) => sub !== callback
            );
        });
      } else {
        internalStore.subscribers[part] =
          internalStore.subscribers[part].filter(
            (sub) => sub !== callback
          );
      }
    };
  };

  return useSyncExternalStore(subscribe, getSnapshot);
}
