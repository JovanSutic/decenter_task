import { store } from "../hooks/store";
import Bottleneck from "bottleneck";

declare global {
    interface Window {
      ethereum?: {
        isMetaMask: boolean;
        on: (...args: any[]) => void;
        removeListener: (...args: any[]) => void;
        request: (args: { method: string; params?: any[] }) => Promise<any>;
      };
    }
  }

const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 0,
  });

export const connectToMetamask = async () => {
    if (window.ethereum) {
      try {
        await limiter.schedule(() =>
          window.ethereum!.request({ method: "eth_requestAccounts" })
        );
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        store.setState("isMetamaskConnected", (state) => ({
          ...state,
          isMetamaskConnected: accounts.length > 0,
        }));
      } catch (err: any) {
        if (err.code === -32002) {
          console.log("Please wait for previous account request to finish.");
        } else {
          console.error("Error connecting to MetaMask:", err);
          store.setState("isMetamaskConnected", (state) => ({
            ...state,
            isMetamaskConnected: false,
          }));
        }
      } finally {
      }
    } else {
      console.log("Already connecting or connected to MetaMask.");
    }
  };