import { useCustomStore } from "../hooks/store";
import Table from "./Table";
import { useFetchCDP } from "../hooks/useFetchCDP";
import Progress from "./Progress";

const List = () => {
  const { currentType, fetchId } = useCustomStore(["currentType", "fetchId"]);
  const { loading, progress, list, error, ilkRate } = useFetchCDP(fetchId, currentType);

  if (!currentType || !fetchId) {
    return (
      <div className="mt-6">
        <h4 className="w-full text-[16px] text-center font-semibold text-gray-600 mb-4">
          You need to select collateral type and insert starting CDP position.
        </h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6">
        <h4 className="w-full text-[16px] text-center font-semibold text-red-400 mb-4">
          {error}
        </h4>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {loading ? (
        <div>
          <h4 className="w-full text-[16px] text-center font-semibold text-gray-600 mb-4">
            We are loading your CDP data, please be patient.
          </h4>
          <Progress width={progress} />
        </div>
      ) : (
        <>
          <h3 className="text-[16px] font-semibold text-gray-600 mb-4">
            List of 20 closest positions for this collateral type
          </h3>
          <Table list={list} rate={ilkRate} />
        </>
      )}
    </div>
  );
};

export default List;
