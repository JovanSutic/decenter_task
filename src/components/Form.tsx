import { useEffect, useRef } from "react";
import { useCustomStore, store } from "../hooks/store";

const Form = () => {
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const { currentId, currentType } = useCustomStore([
    "currentId",
    "currentType",
  ]);

  useEffect(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      store.setState(["fetchId"], (state) => ({
        ...state,
        fetchId: state.currentId,
      }));
      timeoutId.current = null;
    }, 1000);

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }
    };
  }, [currentId]);

  return (
    <div className="pb-4 border-b-[1px] border-gray-300 mb-6">
      <form className="w-full">
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
              store.setState(
                ["currentType", "currentId", "fetchId"],
                (state) => ({
                  ...state,
                  currentType: event.target.value,
                  currentId: "",
                  fetchId: "",
                })
              )
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
            Insert CDP position
          </label>
          <input
            type="text"
            id="cpdId"
            placeholder="Enter only numbers"
            disabled={!currentType}
            value={currentId}
            onChange={(event: any) =>
              store.setState("currentId", (state) => ({
                ...state,
                currentId: event.target.value.replace(/[^0-9]/g, ""),
              }))
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100 disabled:cursor-no-drop"
          ></input>
        </div>
      </form>
    </div>
  );
};

export default Form;
