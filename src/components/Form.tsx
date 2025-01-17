import { State, useCustomStore, internalStore } from "../hooks/store";

const Form = () => {
  const { currentId, currentType } = useCustomStore([
    "currentId",
    "currentType",
  ] as unknown as (keyof State)[]);
  return (
    <form className="w-full pt-4">
      <div className="mb-4">
        <label
          htmlFor="collateral"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Select collateral type
        </label>
        <select
          id="collateral"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 max-w-full"
          value={currentType}
          onChange={(event: any) =>
            internalStore.setPartial({ currentType: event.target.value })
          }
        >
          <option value="">Select collateral type</option>
          <option value="ETH-A">ETH-A</option>
          <option value="WBTC-A">WBTC-A</option>
          <option value="USDC-A">USDC-A</option>
        </select>
      </div>
      <div className="mb-4">
        <label
          htmlFor="cpdId"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          CDP ID
        </label>
        <input
          type="text"
          id="cpdId"
          placeholder="Insert CDP ID"
          value={currentId}
          onChange={(event: any) =>
            internalStore.setPartial({ currentId: event.target.value })
          }
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700"
        ></input>
      </div>
    </form>
  );
};

export default Form;
