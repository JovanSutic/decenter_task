import { useEffect } from "react";
import { getCDPs, useEth } from "../hooks/useEth";

const MetaMaskStatus = () => {
  const { isConnected, currentChainId, currentAccount, web3 } = useEth();

  useEffect(() => {
    const start = async () => {
      await getCDPs(web3);
    };
    if (web3) {
      start();
    }
  }, [web3]);

  return (
    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
      <div className="col-span-1">
        <img
          src={`/metamask.webp`}
          alt="metamask logo"
          className="w-[70px] mx-auto max-w-[70px]"
        />
      </div>
      <div className="col-span-3 md:col-span-5">
        <h2 className="text-[16px] font-bold">MetaMask Connection Status</h2>
        <div className="flex flex-row gap-2 md:gap-6 mt-1">
          <p className="text-[15px]">
            <span className="font-bold">Status:</span>{" "}
            {isConnected ? "Connected" : "Not Connected"}
          </p>
          <p className="text-[15px]">
            <span className="font-bold">Current Chain ID:</span>{" "}
            {currentChainId || "Unknown"}
          </p>
        </div>

        <p className="text-[15px]">
          <span className="font-bold">Current Account:</span>{" "}
          {currentAccount || "Not connected"}
        </p>
      </div>
    </div>
  );
};

export default MetaMaskStatus;
