import { useMetamaskConnection } from "../hooks/useMetamaskConnection";

const Header = () => {
  const { isConnected, isMetamask } = useMetamaskConnection();

  return (
    <header className="bg-white">
      <div className="flex flex-row items-center justify-between shadow-sm p-2 mb-2">
        <div className="flex items-center gap-1">
          <img
            src={isMetamask ? "/metamask.webp" : "/infura.webp"}
            alt="connection logo"
            className="w-[20px] h-[20px]"
          />
          <p className="text-sm font-semibold text-gray-700">{`Web3 via ${
            isMetamask ? "Metamask" : "Infura"
          }`}</p>
        </div>
        {isMetamask && (
          <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-800">
            <span className="font-bold">Wallet:</span>{" "}
            <span className={isConnected ? "text-green-600" : "text-red-600"}>
              {isConnected ? "Connected" : "Not Connected"}
            </span>
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
