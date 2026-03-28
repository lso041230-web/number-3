export function LoadingState() {
  return (
    <section className="mt-5 space-y-3" aria-live="polite" aria-label="로딩 중">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div key={idx} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4">
          <div className="h-3 w-16 rounded bg-slate-200" />
          <div className="mt-3 h-5 w-3/5 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-full rounded bg-slate-200" />
        </div>
      ))}
    </section>
  );
}
