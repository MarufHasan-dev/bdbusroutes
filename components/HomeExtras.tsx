"use client";

import Link from "next/link";
import { buses, busLabel, getStop, stopLabel } from "@/lib/buses";
import { t, useLang } from "./LangContext";

const POPULAR: [string, string][] = [
  ["shahbag", "gabtoli"],
  ["sadarghat", "mohakhali"],
  ["paltan", "airport"],
  ["shyamoli", "sadarghat"],
  ["jashimuddin-uttara", "motijheel"],
  ["mirpur-10", "gulistan"],
  ["mohammadpur", "gulshan-1"],
  ["farmgate", "jatrabari"],
];

export function PopularRoutes() {
  const { lang } = useLang();
  return (
    <section aria-labelledby="popular-h" className="mt-8">
      <h2 id="popular-h" className="text-[15px] font-extrabold text-emerald-950">
        {t.popular[lang]}
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {POPULAR.map(([f, tt]) => {
          const from = getStop(f)!;
          const to = getStop(tt)!;
          return (
            <Link
              key={`${f}-${tt}`}
              href={`/?from=${f}&to=${tt}#results`}
              className="group flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[14px] font-semibold text-slate-800 shadow-sm transition hover:border-emerald-600 hover:shadow active:scale-[0.99]"
            >
              <span className="truncate">
                {stopLabel(from, lang)}
                <span aria-hidden className="mx-1.5 text-slate-300">→</span>
                {stopLabel(to, lang)}
              </span>
              <span aria-hidden className="shrink-0 text-emerald-700 transition group-hover:translate-x-0.5">→</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function BusListPreview() {
  const { lang } = useLang();
  const previewCount = 6;
  const preview = buses.slice(0, previewCount);
  return (
    <section aria-labelledby="buses-h" className="mt-8">
      <div className="flex items-center justify-between">
        <h2 id="buses-h" className="text-[15px] font-extrabold text-emerald-950">
          {t.allBuses[lang]}
          <span className="ml-2 rounded-full bg-slate-900 px-2 py-0.5 align-middle text-[11px] font-bold text-white">
            {buses.length}
          </span>
        </h2>
        <Link
          href="/buses"
          className="rounded-lg bg-emerald-700 px-3 py-1.5 text-[13px] font-bold text-white transition hover:bg-emerald-800 active:scale-[0.99]"
        >
          {lang === "bn" ? "সব দেখুন" : "View all"} →
        </Link>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {preview.map((b) => (
          <Link
            key={b.id}
            href={`/buses/${b.id}`}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-600 hover:shadow"
          >
            <p className="text-[15px] font-bold text-slate-900">{busLabel(b, lang)}</p>
            <p className="text-[13px] text-slate-500">{busLabel(b, lang === "bn" ? "en" : "bn")}</p>
            <p className="mt-1.5 truncate text-[13px] text-slate-600">
              {stopLabel(getStop(b.stopIds[0])!, lang)}
              <span aria-hidden className="mx-1 text-slate-300">↔</span>
              {stopLabel(getStop(b.stopIds[b.stopIds.length - 1])!, lang)}
              {" · "}
              {b.stopIds.length} {t.stopsCount[lang]}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
