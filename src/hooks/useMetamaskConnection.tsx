import { useEffect, useState } from "react";

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
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isMetamask, setIsMetamask] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setIsMetamask(true);
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          setIsConnected(false);
        } else {
          setIsConnected(true);
        }
      });

      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setIsConnected(true);
          }
        })
        .catch((err) => console.error("Error fetching accounts:", err));

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener("accountsChanged", () => {});
          window.ethereum.removeListener("chainChanged", () => {});
        }
      };
    } else {
      setIsMetamask(false);
      console.log("Metamask not detected!");
    }
  }, []);

  return {
    isConnected,
    isMetamask,
  };
};
