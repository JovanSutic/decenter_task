import React, { useMemo, useState } from "react";
import { CDPInfo } from "../types/cdp.types";
import { useCustomStore } from "../hooks/store";

const CDPSignature = ({ data }: { data: CDPInfo }) => {
  const { web3, isMetamaskConnected: isConnected } = useCustomStore([
    "web3",
    "isMetamaskConnected",
  ]);

  const [signature, setSignature] = useState("");
  const [error, setError] = useState(null);

  const handleSign = useMemo(() => {
    return async () => {
      if (!web3) return null;
      try {
        const account = (await web3.eth.getAccounts())[0];
        const sig = await web3.eth.personal.sign(data.toString(), account, "");
        setSignature(sig);
      } catch (err: any) {
        setError(err?.message);
      }
    };
  }, [web3, data]);

  if (isConnected) {
    return (
      <div className="w-full mt-6 flex flex-col items-center">
        <button
          onClick={handleSign}
          disabled={signature !== ""}
          className="px-4 py-1.5 bg-blue-500 text-sm text-white rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out disabled:bg-gray-300 disabled:cursor-no-drop"
        >
          Sign CDP
        </button>
        <div className="w-full mt-2">
          {signature && (
            <>
              <p className="text-base font-medium mb-2">This is my CDP</p>
              <p className="w-full break-words text-sm text-center p-2 bg-gray-100">
                {signature}
              </p>
            </>
          )}
        </div>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
      </div>
    );
  }

  return null;
};

export default CDPSignature;
