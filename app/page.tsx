import dynamic from "next/dynamic";
import SearchForm from "@/components/SearchForm";
import { PopularRoutes, BusListPreview } from "@/components/HomeExtras";
import HeroHeading from "@/components/HeroHeading";
import HeroChips from "@/components/HeroChips";
import HowItWorks from "@/components/HowItWorks";
import Faq from "@/components/Faq";
import { resolveStop, stopLabel, buses, stops } from "@/lib/buses";
import { findDirect, findTransfers } from "@/lib/search";

// Results UI is below the fold and only needed after a search — split it
// into its own JS chunk so the initial page load stays light.
const Results = dynamic(() => import("@/components/Results"), {
  ssr: true,
  loading: () => (
    <div aria-hidden className="grid animate-pulse gap-3 md:grid-cols-2">
      {[0, 1].map((i) => (
        <div key={i} className="h-44 rounded-2xl bg-slate-200/70" />
      ))}
    </div>
  ),
});

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
        transfers =
          direct.length > 0 ? [] : findTransfers(fromStop.id, toStop.id, 5);
        status = "ok";
      }
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-14 sm:px-6">
      {/* Hero — no overflow-hidden here so the search suggestions can
          spill over the section edge. Decorative glows are clipped by an
          inner wrapper instead. */}
      <section className="relative mt-3 rounded-3xl bg-linear-to-b from-[#007a5c] via-brand to-[#004e39] px-5 pb-8 pt-8 text-white shadow-xl shadow-emerald-950/20 sm:mt-6 sm:px-10 sm:pb-10 sm:pt-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-amber-300/15 blur-3xl" />
          <div
            className="absolute inset-x-0 bottom-0 h-16 opacity-[0.07]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, #fff 0 2px, transparent 2px 14px)",
            }}
          />
        </div>
        <div className="relative mx-auto max-w-2xl text-center">
          <HeroHeading />
          <div className="mt-5 text-left">
            <SearchForm
              initialFrom={fromStop?.id ?? ""}
              initialTo={toStop?.id ?? ""}
            />
          </div>
          <HeroChips />
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[12.5px] font-medium text-emerald-100">
            <span className="rounded-full bg-white/15 px-3 py-1">
              {stops.length} stops
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1">
              {buses.length} buses · Dhaka
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1">EN + বাং</span>
          </div>
        </div>
      </section>

      {/* Results */}
      {status !== "idle" && (
        <section
          id="results"
          aria-live="polite"
          className="mx-auto mt-6 max-w-3xl scroll-mt-20"
        >
          {fromStop && toStop && status === "ok" && (
            <p className="mb-3 text-center text-[14px] text-slate-600">
              <span className="font-bold text-slate-900">
                {stopLabel(fromStop, "en")} ({fromStop.nameBn})
              </span>
              <span aria-hidden className="mx-2 text-slate-300">
                →
              </span>
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
        <Faq />
      </div>
    </main>
  );
}
