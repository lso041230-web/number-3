export function LoadingCards() {
  return (
    <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div
          key={idx}
          className="min-h-56 animate-pulse rounded-3xl border border-slate-200 bg-white p-6"
          aria-hidden
        >
          <div className="h-4 w-28 rounded bg-slate-200" />
          <div className="mt-6 space-y-3">
            <div className="h-4 w-full rounded bg-slate-200" />
            <div className="h-4 w-11/12 rounded bg-slate-200" />
            <div className="h-4 w-9/12 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
