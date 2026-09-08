export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-5xl animate-pulse px-4 pb-14 sm:px-6">
      <div className="mt-3 rounded-3xl bg-slate-200/70 px-5 pb-8 pt-8 sm:mt-6 sm:px-10 sm:pb-10 sm:pt-10">
        <div className="mx-auto max-w-2xl">
          <div className="mx-auto h-8 w-3/4 rounded-lg bg-slate-300/70" />
          <div className="mx-auto mt-2 h-4 w-1/2 rounded bg-slate-300/60" />
          <div className="mt-5 h-44 rounded-2xl bg-white/70" />
        </div>
      </div>
      <div className="mx-auto mt-6 grid max-w-3xl gap-3 md:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="h-36 rounded-2xl bg-slate-200/70" />
        ))}
      </div>
    </main>
  );
}
