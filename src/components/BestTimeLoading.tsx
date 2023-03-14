const BestTimeLoading = () => {
  const loadingArray = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22,
  ];

  const topThree = [1, 2, 3];
  return (
    <div className="grid w-full gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:w-4/5">
      {loadingArray.map((loading) => (
        <div
          key={loading}
          className="grid h-28 grid-cols-12 place-items-center rounded-lg border border-gray-600 bg-gray-800 p-4 shadow-lg"
        >
          <p className="animate-pulse text-3xl font-bold text-slate-400 opacity-20 blur-sm">
            {loading}
          </p>
          <div className="col-span-10 flex flex-col  items-start justify-center place-self-start pl-10">
            <h1 className="animate-pulse text-xl font-bold text-slate-400 opacity-20 blur-sm">
              Track
            </h1>
            {topThree.map((top) => (
              <div key={top}>
                <p className="animate-pulse text-sm font-bold text-slate-400 opacity-20 blur-sm">
                  1:30.000 - Username
                </p>
              </div>
            ))}
          </div>
          <div className="">
            <div className="h-12 w-12 animate-pulse rounded-full bg-slate-400 opacity-20 blur-sm"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BestTimeLoading;
