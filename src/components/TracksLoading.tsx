export default function TracksLoading() {
  return (
    <main className="flex min-h-0 flex-grow flex-col items-center">
      <div className="w-50 flex h-44 animate-pulse flex-col items-center justify-center gap-2 opacity-100">
        <div className="h-10 w-10 rounded-full bg-slate-600"></div>
        <div className="h-6 w-24 bg-slate-600"></div>
        <div className="h-6 w-56 bg-slate-600"></div>
      </div>
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-10 xl:flex-row xl:items-start">
        <div className="flex h-full w-5/6 flex-col rounded-lg bg-slate-700 pb-10 shadow-2xl xl:h-[600px] xl:w-[800px]">
          <div className="ml-5 mt-5 h-8 w-56 animate-pulse bg-slate-600 opacity-100"></div>
          <div className="relative animate-pulse overflow-x-auto opacity-100">
            <div className="mt-5 h-96 w-full bg-slate-600"></div>
          </div>
        </div>
        <div className="flex flex-col gap-5 rounded-lg bg-slate-700 pt-5 pl-5 shadow-2xl xl:h-[800px] xl:w-[400px]">
          <div className="min-h-6 inline-block w-56 animate-pulse bg-slate-600 opacity-100"></div>
          <div>
            <div className="min-h-6 inline-block w-56 animate-pulse bg-slate-600 opacity-100"></div>
            <div className="min-h-6 inline-block w-52 animate-pulse bg-slate-600 opacity-100"></div>
          </div>
          <div>
            <div className="min-h-6 inline-block w-56 animate-pulse bg-slate-600 opacity-100"></div>
            <div className="min-h-6 inline-block w-52 animate-pulse bg-slate-600 opacity-100"></div>
          </div>
          <div>
            <div className="min-h-6 inline-block w-56 animate-pulse bg-slate-600 opacity-100"></div>
            <div className="min-h-6 inline-block w-52 animate-pulse bg-slate-600 opacity-100"></div>
          </div>

          <div>
            <div className="min-h-6 inline-block w-56 animate-pulse bg-slate-600 opacity-100"></div>
            <div className="min-h-6 inline-block w-52 animate-pulse bg-slate-600 opacity-100"></div>
          </div>
          <div>
            <div className="min-h-6 inline-block w-56 animate-pulse bg-slate-600 opacity-100"></div>
            <div className="min-h-6 inline-block w-52 animate-pulse bg-slate-600 opacity-100"></div>
          </div>
          <div className="flex animate-pulse flex-col opacity-100">
            <div className="min-h-6 inline-block w-56 bg-slate-600"></div>
            <div className="mt-3 h-64 w-[22.5rem] bg-slate-600"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
