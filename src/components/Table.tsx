import { useNavigate } from "react-router-dom";
import { CDPInfo } from "../types/cdp.types";
import { bigIntToNum, formatToDecimals } from "../utils/numbers";
import { store } from "../hooks/store";

const Table = ({ data, rate }: { data: CDPInfo[]; rate: number }) => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-x-auto rounded-xl border-[1px] border-gray-200">
      <table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-5 py-3">
              Position
            </th>
            <th scope="col" className="px-5 py-3">
              Collateral
            </th>
            <th scope="col" className="px-5 py-3">
              Debt
            </th>
            <th scope="col" className="text-center">
              Link
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              className={`bg-white ${index < data.length - 1 && "border-b"}`}
              key={item.id}
            >
              <th
                scope="row"
                className="px-5 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {item.id}
              </th>
              <td className="px-5 py-4">
                {bigIntToNum(BigInt(item.collateral))}
              </td>
              <td className="px-5 py-4">
                {formatToDecimals(bigIntToNum(BigInt(item.debt)) * rate)}
              </td>
              <td className="text-center">
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-1.5 text-center inline-flex items-center me-2"
                  onClick={() => {
                    store.setState("currentCDP", (state) => ({
                      ...state,
                      currentCDP: item,
                    }));
                    navigate(`/${item.id}`);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
