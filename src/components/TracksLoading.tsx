export default function TracksLoading() {
  //array with numbers from 1 to 22
  const loadingNumbers = Array.from(Array(22).keys());
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center gap-10 px-20 text-center">
        <h1 className="font-bold sm:text-xl md:text-3xl lg:text-6xl">Tracks</h1>
        <div className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center sm:text-xl md:text-xs lg:text-lg">
          <table className="table md:text-[8px] lg:w-3/4 lg:text-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 ">Order</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Length</th>
                <th className="px-4 py-2">Country</th>
              </tr>
            </thead>
            <tbody>
              {loadingNumbers.map((load) => (
                <tr key={load}>
                  <td className="animate-pulse px-4 py-2 text-slate-400 opacity-20 blur-sm">
                    {load + 1}
                  </td>
                  <td className="animate-pulse px-4 py-2 text-slate-400 opacity-20 blur-sm ">
                    Track
                  </td>
                  <td className="animate-pulse px-4 py-2 text-slate-400 opacity-20 blur-sm">
                    1000m
                  </td>
                  <td className="flex animate-pulse justify-between px-4 py-2 text-slate-400 opacity-20 blur-sm">
                    Country
                    <div className="h-8 w-8 animate-pulse rounded-full bg-slate-400 opacity-20 blur-sm"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
