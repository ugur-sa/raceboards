export default function TimesLoading() {
  const loadingNumbers = Array.from(Array(10).keys());
  return (
    <>
      <div className="flex flex-col items-center justify-center py-2">
        <div className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <table className="table">
            <thead>
              <tr>
                <th className="px-4 py-2">Track</th>
                <th className="px-4 py-2">Country</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {loadingNumbers?.map((load) => (
                <tr key={load}>
                  <td className="animate-pulse px-4 py-2 text-slate-400 opacity-20 blur-sm">
                    Track
                  </td>
                  <td className="animate-pulse px-4 py-2 text-slate-400 opacity-20 blur-sm">
                    Country
                  </td>
                  <td className="animate-pulse px-4 py-2 text-slate-400 opacity-20 blur-sm">
                    1:00.000
                  </td>
                  <td className="animate-pulse px-4 py-2 text-slate-400 opacity-20 blur-sm">
                    <button className="rounded bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
