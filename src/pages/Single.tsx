import { Link, useParams } from "react-router";
import { useFetchSingle } from "../hooks/useFetchSingle";
import { formatCurrencyIntl, getCDPDetails } from "../utils/numbers";
import { bytesToString } from "../utils/bytes";
import { IlkType } from "../types/store.types";
import { useFetchRate } from "../hooks/useFetchRate";
import { useMemo } from "react";
import { CDPDetails } from "../types/cdp.types";
import CDPSignature from "../components/Signature";

const Single = () => {
  let { id } = useParams();
  const { data } = useFetchSingle(id || "");
  const { rate } = useFetchRate(
    data ? (bytesToString(data?.ilk) as IlkType) : undefined
  );
  const details: null | CDPDetails = useMemo(() => {
    if (rate && data) {
      return getCDPDetails(data, rate);
    }
    return null;
  }, [data?.debt, rate]);

  return (
    <div className="bg-white rounded-lg p-2 w-full">
      <div className="flex flex-row justify-between items-center border-b border-gray-300 mb-4 pb-2">
        <h2 className="text-sm font-mono text-gray-600">
          {`Details for CDP ${id}`}
        </h2>
        <Link type="" className="text-sm text-blue-500 hover:underline p-0 leading-3" to="/">
          Back to home
        </Link>
      </div>
      {details === null ? (
        <div>
          {" "}
          <h4 className="w-full text-center text-sm font-medium text-gray-400 mb-4">
            We are loading your CDP data, please be patient.
          </h4>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 mb-4">
              <p className="text-sm font-medium mb-2">Owner Address</p>
              <p className="text-sm md:text-base bg-gray-100 p-2 rounded text-gray-800">
                {data?.owner}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Collateral</p>
              <p className="bg-gray-100 p-2 rounded text-gray-800">
                {`${details.collateral} ${details.ilk}`}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Debt</p>
              <p className="bg-gray-100 p-2 rounded text-gray-800">
                {`${details.debt} DAI`}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">
                Collateralization Ratio
              </p>
              <p className="bg-gray-100 p-2 rounded text-gray-800">
                {`${details.collateralRatio}%`}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Liquidation Price</p>
              <p className="bg-gray-100 p-2 rounded text-gray-800">
                {formatCurrencyIntl(details.liquidationPrice)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Available to withdraw</p>
              <p className="bg-gray-100 p-2 rounded text-gray-800">
                {`${details.maxWithdraw} ${details.ilk}`}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Available to generate</p>
              <p className="bg-gray-100 p-2 rounded text-gray-800">
                {`${details.maxDebt} DAI`}
              </p>
            </div>
          </div>
          <CDPSignature data={data} />
        </div>
      )}
    </div>
  );
};

export default Single;
