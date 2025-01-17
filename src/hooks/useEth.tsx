import { useEffect, useState } from "react";
import Web3 from "web3";
import { bytesToString } from "../utils/bytes";

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

const ABI = [
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "_getProxyOwner",
    outputs: [{ internalType: "address", name: "userAddr", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_cdpId", type: "uint256" }],
    name: "getCdpInfo",
    outputs: [
      { internalType: "address", name: "urn", type: "address" },
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "userAddr", type: "address" },
      { internalType: "bytes32", name: "ilk", type: "bytes32" },
      { internalType: "uint256", name: "collateral", type: "uint256" },
      { internalType: "uint256", name: "debt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const useEth = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [currentChainId, setCurrentChainId] = useState<string | null>(null);
  const [web3, setWeb3] = useState<any>(null);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          setIsConnected(false);
          setCurrentAccount(null);
        } else {
          setIsConnected(true);
          setCurrentAccount(accounts[0]);
        }
      });

      window.ethereum.on("chainChanged", (chainId: string) => {
        setCurrentChainId(chainId);
      });

      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setIsConnected(true);
            setCurrentAccount(accounts[0]);
          }
        })
        .catch((err) => console.error("Error fetching accounts:", err));

      window.ethereum
        .request({ method: "eth_chainId" })
        .then((chainId: string) => setCurrentChainId(chainId))
        .catch((err) => console.error("Error fetching chain ID:", err));

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener("accountsChanged", () => {});
          window.ethereum.removeListener("chainChanged", () => {});
        }
      };
    } else {
      console.log("Please install MetaMask to use this dApp!");
    }
  }, []);

  return {
    isConnected,
    currentAccount,
    currentChainId,
    web3,
  };
};

const concurrentRequests = new Set();

async function manageConcurrentRequests(promise: Promise<any>) {
  while (concurrentRequests.size >= 5) {
    await Promise.race(Array.from(concurrentRequests));
  }
  const wrappedPromise = promise.finally(() =>
    concurrentRequests.delete(wrappedPromise)
  );
  concurrentRequests.add(wrappedPromise);
  return wrappedPromise;
}

async function getCdpInfo(cdpId: string, web3: any) {
  const contractAddress = "0x68C61AF097b834c68eA6EA5e46aF6c04E8945B2d";
  const cdpManager = new web3.eth.Contract(ABI, contractAddress);
  try {
    return await manageConcurrentRequests(
      cdpManager.methods.getCdpInfo(cdpId).call()
    );
  } catch (error) {
    console.error(`Failed to fetch CDP info for ID ${cdpId}:`, error);
    return null;
  }
}

export const getCDPs = async (web3: any) => {
  const concurrentRequests = new Set();

  async function manageConcurrentRequests(promise: Promise<any>) {
    while (concurrentRequests.size >= 5) {
      await Promise.race(Array.from(concurrentRequests));
    }
    const wrappedPromise = promise.finally(() =>
      concurrentRequests.delete(wrappedPromise)
    );
    concurrentRequests.add(wrappedPromise);
    return wrappedPromise;
  }

  async function getCdpInfo(cdpId: string) {
    const contractAddress = "0x68C61AF097b834c68eA6EA5e46aF6c04E8945B2d";
    const cdpManager = new web3.eth.Contract(ABI, contractAddress);
    try {
      const x = await manageConcurrentRequests(
        cdpManager.methods.getCdpInfo(cdpId).call()
      );

      return x;
    } catch (error) {
      console.error(`Failed to fetch CDP info for ID ${cdpId}:`, error);
      return null;
    }
  }

  async function fetchClosestCDPs(targetId: number, count = 20) {
    const cdps: any[] = [];
    const fetchPromises = [];
    const ILK = "ETH-A";

    for (
      let i = targetId - Math.floor(count / 2);
      i <= targetId + Math.floor(count / 2);
      i++
    ) {
      fetchPromises.push(getCdpInfo(i.toString()));
    }

    const results = await Promise.all(fetchPromises);

    results
      .filter((cdp) => cdp !== null && bytesToString(cdp.ilk) === ILK)
      .sort(
        (a, b) =>
          Math.abs(parseInt(a.id) - targetId) -
          Math.abs(parseInt(b.id) - targetId)
      )
      .slice(0, count)
      .forEach((cdp) => cdps.push(cdp));

    return cdps;
  }

  async function main() {
    const targetCdpId = "12345";
    const closestCDPs = await fetchClosestCDPs(Number(targetCdpId));

    for (const cdp of closestCDPs) {
      console.log(`CDP ID: ${cdp.id}, Details:`, cdp);
    }
  }

  await main();
};
