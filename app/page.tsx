import SearchForm from "@/components/SearchForm";
import Results from "@/components/Results";
import { PopularRoutes, BusListPreview } from "@/components/HomeExtras";
import HeroHeading from "@/components/HeroHeading";
import { resolveStop, stopLabel } from "@/lib/buses";
import { findDirect, findTransfers } from "@/lib/search";

interface PageProps {
  searchParams: Promise<{ from?: string; to?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { from: fromRaw, to: toRaw } = await searchParams;
  const fromStop = resolveStop(fromRaw);
  const toStop = resolveStop(toRaw);

  const hasQuery = Boolean((fromRaw ?? "").trim() || (toRaw ?? "").trim());
  let status: "idle" | "same" | "not-found" | "ok" = "idle";
  let direct: ReturnType<typeof findDirect> = [];
  let transfers: ReturnType<typeof findTransfers> = [];

  if (hasQuery) {
    if (fromRaw?.trim() && toRaw?.trim() && !fromStop) {
      status = "not-found";
    } else if (fromRaw?.trim() && toRaw?.trim() && !toStop) {
      status = "not-found";
    } else if (fromStop && toStop) {
      if (fromStop.id === toStop.id) status = "same";
      else {
        direct = findDirect(fromStop.id, toStop.id);
        transfers = direct.length > 0 ? [] : findTransfers(fromStop.id, toStop.id, 5);
        status = "ok";
      }
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-14 sm:px-6">
      {/* Hero */}
      <section className="overflow-hidden rounded-b-3xl bg-[#006A4E] px-5 pb-8 pt-8 text-white sm:rounded-3xl sm:mt-6 sm:px-10 sm:pb-10 sm:pt-10">
        <div className="mx-auto max-w-2xl text-center">
          <HeroHeading />
          <div className="mt-5 text-left">
            <SearchForm
              initialFrom={fromStop?.id ?? ""}
              initialTo={toStop?.id ?? ""}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[12.5px] font-medium text-emerald-100">
            <span className="rounded-full bg-white/15 px-3 py-1">55 stops</span>
            <span className="rounded-full bg-white/15 px-3 py-1">2 buses · Dhaka</span>
            <span className="rounded-full bg-white/15 px-3 py-1">EN + বাং</span>
          </div>
        </div>
      </section>

      {/* Results */}
      {status !== "idle" && (
        <section id="results" aria-live="polite" className="mx-auto mt-6 max-w-3xl scroll-mt-20">
          {fromStop && toStop && status === "ok" && (
            <p className="mb-3 text-center text-[14px] text-slate-600">
              <span className="font-bold text-slate-900">
                {stopLabel(fromStop, "en")} ({fromStop.nameBn})
              </span>
              <span aria-hidden className="mx-2 text-slate-300">→</span>
              <span className="font-bold text-slate-900">
                {stopLabel(toStop, "en")} ({toStop.nameBn})
              </span>
            </p>
          )}
          <Results status={status} direct={direct} transfers={transfers} />
        </section>
      )}

      <div className="mx-auto max-w-3xl">
        <PopularRoutes />
        <BusListPreview />
        <HowItWorks />
      </div>
    </main>
  );
}

function HowItWorks() {
  return (
    <section aria-label="How it works" className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-[15px] font-extrabold text-slate-900">How it works · কীভাবে কাজ করে</h2>
      <ol className="mt-3 space-y-2.5 text-[14px] leading-relaxed text-slate-600">
        <li className="flex gap-2.5"><span aria-hidden className="font-bold text-emerald-700">1.</span> Type your starting point in <b>From</b> — English or বাংলা both work.</li>
        <li className="flex gap-2.5"><span aria-hidden className="font-bold text-emerald-700">2.</span> Type your destination in <b>To</b>, then press <b>Enter</b> or tap Find buses.</li>
        <li className="flex gap-2.5"><span aria-hidden className="font-bold text-emerald-700">3.</span> See every direct bus. If none exists, we suggest the best 1-change options.</li>
      </ol>
    </section>
  );
}

export function generateMetadata() {
  return {};
}
