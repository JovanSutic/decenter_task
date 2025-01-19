import { useSyncExternalStore } from "react";
import { State, StateKeyOrKeys, Store } from "../types/store.types";

export const store: Store = {
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
  setState(part: StateKeyOrKeys, updateFunc: (state: State) => State) {
    const newState = updateFunc(this.state);
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
        this.subscribers[p]?.forEach((subscriber) => subscriber());
      });
    } else {
      this.subscribers[part]?.forEach((subscriber) => subscriber());
    }
  },
};

export function useCustomStore(part: StateKeyOrKeys) {
  const getSnapshot = () => store.getState();
  const subscribe = (callback: () => void) => {
    store.subscribe(part, callback);
    return () => {
      if (Array.isArray(part)) {
        part.forEach((p) => {
          store.subscribers[p] = store.subscribers[p].filter(
            (sub) => sub !== callback
          );
        });
      } else {
        store.subscribers[part] = store.subscribers[
          part
        ].filter((sub) => sub !== callback);
      }
    };
  };

  return useSyncExternalStore(subscribe, getSnapshot);
}
