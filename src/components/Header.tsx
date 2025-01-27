import { useCustomStore } from "../hooks/store";
import { connectToMetamask } from "../utils/metamask";

const Header = () => {
  const {provider, isMetamaskConnected: isConnected} = useCustomStore('isMetamaskConnected');

  return (
    <header className="bg-white">
      <div className="flex flex-row items-center justify-between shadow-sm p-2 mb-2">
        <div className="flex items-center gap-1">
          <img
            src={provider === "Metamask" ? "/metamask.webp" : "/infura.webp"}
            alt="connection logo"
            className="w-[20px] h-[20px]"
          />
          <p className="text-sm font-semibold text-gray-700">{`Web3 via ${
            provider
          }`}</p>
        </div>
        {provider === "Metamask" && (
          <div>
            {isConnected ? (
              <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-800">
                <span className="font-bold">Wallet:</span>{" "}
                <span className="text-green-600">Connected</span>
              </div>
            ) : (
              <button
                onClick={connectToMetamask}
                className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-800"
              >
                Connect you wallet
              </button>
            )}
          </div>
        )}
      </div>
      <h1 className="text-[16px] font-mono text-center font-bold text-blue-600 mb-2">
        MakerDAO POSITION DISPLAY
      </h1>
    </header>
  );
};

export default Header;
