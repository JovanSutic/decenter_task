import { useCustomStore } from "../hooks/store";
import Table from "./Table";
import { useFetchMultiple } from "../hooks/useFetchMultiple";
import Progress from "./Progress";
import { useFetchRate } from "../hooks/useFetchRate";

const List = () => {
  const { currentType, fetchId } = useCustomStore(["currentType", "fetchId"]);
  const { loading, progress, data, error } = useFetchMultiple(
    fetchId,
    currentType
  );
  const { rate } = useFetchRate(currentType);

  if (!currentType || !fetchId) {
    return (
      <div className="mt-6">
        <h4 className="w-full text-center text-sm font-medium text-gray-400 mb-4">
          You need to select collateral type and insert starting CDP position.
        </h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6">
        <h4 className="w-full text-center text-sm font-medium text-red-400 mb-4">
          {error}
        </h4>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {loading ? (
        <div>
          <h4 className="w-full text-center text-sm font-medium text-gray-400 mb-4">
            We are loading your CDP data, please be patient.
          </h4>
          <Progress width={progress} />
        </div>
      ) : (
        <>
          <h3 className="text-sm font-medium mb-4">
            List of 20 closest positions for this collateral type
          </h3>
          <Table data={data} rate={rate || 0} />
        </>
      )}
    </div>
  );
};

export default List;
