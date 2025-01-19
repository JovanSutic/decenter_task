import { useEth } from "../hooks/useEth";

const AppHeader = () => {
  const { isConnected, isMetamask } = useEth();

  return (
    <div className="w-full pb-4 border-b-[1px] border-gray-300 mb-6">
      <h2 className="text-[22px] font-bold text-center mb-4">
        MakerDAO Position Display
      </h2>
      <div className="flex flex-row gap-2 justify-center mb-2">
        <div>
          <img
            src={isMetamask ? "/metamask.webp" : "/infura.webp"}
            alt="metamask logo"
            className="w-[24px] mx-auto max-w-[24px]"
          />
        </div>
        <div>
          <p className="text-[15px] font-semibold">{`Web3 connection through ${
            isMetamask ? "Metamask" : "Infura"
          }`}</p>
        </div>
      </div>{" "}
      {isMetamask && (
        <div className="flex flex-row gap-2 justify-center">
          <p className="text-[15px]">
            <span className="font-bold">Wallet:</span>{" "}
            {isConnected ? "Connected" : "Not Connected"}
          </p>
        </div>
      )}
    </div>
  );
};

export default AppHeader;
