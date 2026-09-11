"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { buses, busLabel, getStop, normalize, stopLabel } from "@/lib/buses";
import { useLang, t } from "./LangContext";

type SortKey = "name" | "most" | "fewest";

export default function BusesListView() {
  const { lang } = useLang();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("name");

  const L = (en: string, bn: string) => (lang === "bn" ? bn : en);

  const results = useMemo(() => {
    const q = normalize(query);
    const filtered = q
      ? buses.filter(
          (b) =>
            normalize(b.nameEn).includes(q) ||
            b.nameBn.includes(query.trim()) ||
            normalize(busLabel(b, "en")).includes(q)
        )
      : [...buses];
    switch (sort) {
      case "most":
        filtered.sort((a, b) => b.stopIds.length - a.stopIds.length);
        break;
      case "fewest":
        filtered.sort((a, b) => a.stopIds.length - b.stopIds.length);
        break;
      default:
        filtered.sort((a, b) =>
          busLabel(a, lang).localeCompare(busLabel(b, lang), lang === "bn" ? "bn" : "en")
        );
    }
    return filtered;
  }, [query, sort, lang]);

  return (
    <div className="mt-3">
      <h1 className="text-[22px] font-black text-slate-900">
        {t.allBuses[lang]} <span className="text-slate-400">· {buses.length}</span>
      </h1>

      <div className="mt-4 space-y-2.5 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm sm:p-4">
        <div className="relative">
          <span aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
          <input
            type="search"
            role="searchbox"
            aria-label={L("Search buses", "বাস খুঁজুন")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={L("Search buses… e.g. BRTC / বিআরটিসি", "বাস খুঁজুন… যেমন: বিআরটিসি")}
            autoComplete="off"
            className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-10 text-[16px] text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/15"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={L("Clear search", "মুছে ফেলুন")}
              className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-500 transition hover:bg-slate-200"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
            <span aria-hidden>⇅</span>
            <span className="sr-only">{L("Sort buses", "বাস সাজান")}</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-10 rounded-lg border border-slate-300 bg-white px-2.5 text-[13.5px] font-bold text-slate-800 outline-none transition focus:border-emerald-600"
            >
              <option value="name">{L("Name A–Z", "নাম অ–হ")}</option>
              <option value="most">{L("Most stops", "বেশি স্টপ")}</option>
              <option value="fewest">{L("Fewest stops", "কম স্টপ")}</option>
            </select>
          </label>
          <p aria-live="polite" className="text-[13px] font-semibold text-slate-500">
            {query ? (
              <>
                {results.length} {L("of", "টি /")} {buses.length}
              </>
            ) : (
              <>
                {buses.length} {L("buses", "টি বাস")}
              </>
            )}
          </p>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p aria-hidden className="text-3xl">🚌</p>
          <p className="mt-2 text-[15px] font-extrabold text-slate-900">
            {L("No buses match your search", "কোনো বাস পাওয়া যায়নি")}
          </p>
          <p className="mt-1 text-[13.5px] text-slate-500">
            {L("Try a different spelling, or browse the full list.", "অন্য বানান চেষ্টা করুন।")}
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-4 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 active:scale-[0.99]"
          >
            {L("Clear search", "মুছে ফেলুন")}
          </button>
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {results.map((b) => (
            <Link
              key={b.id}
              href={`/buses/${b.id}`}
              prefetch={false}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-600 hover:shadow-md"
            >
              <p className="text-[16px] font-extrabold text-slate-900">{busLabel(b, lang)}</p>
              <p className="text-[13.5px] text-slate-500">{busLabel(b, lang === "bn" ? "en" : "bn")}</p>
              <p className="mt-2 text-[14px] font-medium text-slate-700">
                {stopLabel(getStop(b.stopIds[0])!, lang)}
                <span aria-hidden className="mx-1.5 text-slate-300">↔</span>
                {stopLabel(getStop(b.stopIds[b.stopIds.length - 1])!, lang)}
              </p>
              <p className="mt-1 text-[13px] text-slate-500">
                {b.stopIds.length} {t.stopsCount[lang]} · {t.viewRoute[lang]} →
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
