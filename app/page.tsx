import dynamic from "next/dynamic";
import SearchForm from "@/components/SearchForm";
import { PopularRoutes, BusListPreview } from "@/components/HomeExtras";
import HeroHeading from "@/components/HeroHeading";
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
      {/* Hero */}
      <section className="mt-3 overflow-hidden rounded-3xl bg-brand px-5 pb-8 pt-8 text-white sm:mt-6 sm:px-10 sm:pb-10 sm:pt-10">
        <div className="mx-auto max-w-2xl text-center">
          <HeroHeading />
          <div className="mt-5 text-left">
            <SearchForm
              initialFrom={fromStop?.id ?? ""}
              initialTo={toStop?.id ?? ""}
            />
          </div>
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

const FAQS = [
  {
    q: "How do I find which bus goes my way?",
    qBn: "কোন বাসে যাবো, কীভাবে খুঁজবো?",
    a: "Type your starting stop in From and your destination in To, then press Enter. The site lists every bus that serves that route, with the stops in between highlighted.",
  },
  {
    q: "What if there is no direct bus?",
    qBn: "সরাসরি বাস না থাকলে কী হবে?",
    a: "You will see the best 1-change options: take the first bus, get off at the interchange stop, and board the second bus to your destination.",
  },
  {
    q: "Which areas are covered?",
    qBn: "কোন কোন এলাকা আছে?",
    a: "Dhaka city, with 156 bus routes and 259 stops so far — from Uttara and Tongi to Sadarghat, Savar to Demra. More routes are added regularly.",
  },
  {
    q: "Is the route information accurate?",
    qBn: "রুটের তথ্য কি সঠিক?",
    a: "Routes are community-collected and may change with road conditions. Confirm fare and timing with the bus staff before travelling.",
  },
];

function Faq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <section aria-labelledby="faq-h" className="mt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2
        id="faq-h"
        className="text-[16px] font-extrabold tracking-tight text-emerald-950"
      >
        Questions <span className="font-semibold text-slate-500">· প্রশ্নোত্তর</span>
      </h2>
      <div className="mt-3 space-y-2">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="group rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          >
            <summary className="cursor-pointer list-none text-[14.5px] font-bold text-slate-900 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-3">
                <span>
                  {f.q}
                  <span className="block text-[12.5px] font-semibold text-emerald-700">
                    {f.qBn}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="shrink-0 text-emerald-700 transition group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="pt-2 text-[13.5px] leading-relaxed text-slate-600">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "১",
      icon: "📍",
      title: "Set From & To",
      bn: "শুরু ও গন্তব্য লিখুন",
      desc: "Type any stop in English or বাংলা suggestions appear as you type.",
    },
    {
      n: "২",
      icon: "⏎",
      title: "Press Enter",
      bn: "Enter চাপুন",
      desc: "Hit Enter or tap Find buses matching buses appear instantly.",
    },
    {
      n: "৩",
      icon: "🚌",
      title: "Catch your bus",
      bn: "বাসে উঠে পড়ুন",
      desc: "Direct buses first. None going your way? We show the best 1-change options.",
    },
  ];
  return (
    <section aria-label="How it works" className="mt-8">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-[16px] font-extrabold tracking-tight text-emerald-950">
          How it works
        </h2>
        <span className="shrink-0 text-[13px] font-semibold text-slate-500">
          কীভাবে কাজ করে
        </span>
      </div>
      <ol className="mt-3 grid gap-2.5 sm:grid-cols-3">
        {steps.map((s) => (
          <li
            key={s.title}
            className="relative overflow-hidden rounded-2xl border border-emerald-950/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -right-2 -top-4 select-none text-[64px] font-black leading-none text-emerald-700/10"
            >
              {s.n}
            </span>
            <div className="flex items-center justify-between">
              <span
                aria-hidden
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-[15px] font-black text-white shadow-md shadow-emerald-700/30"
              >
                {s.n}
              </span>
              <span aria-hidden className="text-[26px] leading-none">
                {s.icon}
              </span>
            </div>
            <p className="mt-3 text-[15px] font-extrabold text-slate-900">
              {s.title}
            </p>
            <p className="text-[13px] font-bold text-emerald-700">{s.bn}</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-slate-600">
              {s.desc}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
