const Progress = ({ width }: { width: number }) => {
  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 rounded-full">
        <div
          className="bg-blue-600 text-xs font-medium text-white text-center p-0.5 leading-none rounded-full transition-width duration-300 ease-in-out"
          style={{ width: `${width}%` }}
        >{`${width}%`}</div>
      </div>
      <p className="text-[14px] text-center text-gray-400 mt-1">Progress</p>
    </div>
  );
};

export default Progress;
