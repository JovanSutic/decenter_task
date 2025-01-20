import { useEffect, useState } from "react";
import { store } from "./store";
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

export const useMetamaskConnection = () => {
  const [isMetamask, setIsMetamask] = useState<boolean>(false);

  const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 0,
  });

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setIsMetamask(true);

      const handleAccountsChanged = (accounts: string[]) => {
        store.setState("isMetamaskConnected", (state) => ({
          ...state,
          isMetamaskConnected: accounts.length > 0,
        }));
      };

      const handleChainChanged = () => {
        store.setState("isMetamaskConnected", (state) => ({
          ...state,
          isMetamaskConnected: false,
        }));
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    } else {
      setIsMetamask(false);
      console.log("MetaMask not detected!");
    }
  }, []);

  const connectToMetamask = async () => {
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

  return {
    isMetamask,
    connectToMetamask,
  };
};
