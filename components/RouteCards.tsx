"use client";

import Link from "next/link";
import { busLabel, stopLabel } from "@/lib/buses";
import type { DirectResult, TransferResult } from "@/lib/search";
import { t, useLang } from "./LangContext";

export function DirectCard({ r }: { r: DirectResult }) {
  const { lang } = useLang();
  return (
    <article className="overflow-hidden rounded-2xl border border-emerald-950/10 bg-white shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3 p-4 pb-3">
        <div className="min-w-0">
          <h3 className="truncate text-[16px] font-bold text-slate-900">
            {busLabel(r.bus, lang)}
          </h3>
          <p className="mt-0.5 text-[13px] text-slate-500">
            {lang === "bn" ? busLabel(r.bus, "en") : busLabel(r.bus, "bn")} · {r.bus.stopIds.length}{" "}
            {t.stopsCount[lang]}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-700 px-3 py-1 text-[12px] font-bold text-white">
          {lang === "bn" ? "সরাসরি" : "Direct"}
        </span>
      </div>

      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 text-[14px] font-semibold">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-[11px] text-white">A</span>
          <span className="truncate text-slate-900">{stopLabel(r.from, lang)}</span>
          <span aria-hidden className="text-slate-300">→</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-[11px] text-white">B</span>
          <span className="truncate text-slate-900">{stopLabel(r.to, lang)}</span>
        </div>
        <p className="mt-1.5 text-[13px] text-slate-600">
          {r.stopsBetween === 0
            ? lang === "bn"
              ? "পাশাপাশি স্টপ — মাঝে কোনো স্টপ নেই"
              : "Adjacent stops — nothing in between"
            : `${r.stopsBetween} ${t.stopsBetween[lang]}`}
          {" · "}
          {t.toward[lang]} {stopLabel(r.toward, lang)}
        </p>
      </div>

      {/* Segment strip */}
      <div className="border-t border-dashed border-slate-200 bg-slate-50/70 px-4 py-3">
        <ol className="flex flex-wrap items-center gap-1.5 text-[12.5px] font-medium text-slate-700">
          {r.segment.map((s, i) => (
            <li key={s.id} className="flex items-center gap-1.5">
              {i > 0 && (
                <span aria-hidden className="text-slate-300">
                  →
                </span>
              )}
              <span
                className={`rounded-full px-2 py-0.5 ${
                  i === 0 || i === r.segment.length - 1
                    ? "bg-emerald-700 font-bold text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200"
                }`}
              >
                {stopLabel(s, lang)}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="p-3">
        <Link
          href={`/buses/${r.bus.id}`}
          className="block rounded-xl bg-emerald-50 py-2.5 text-center text-sm font-bold text-emerald-800 transition hover:bg-emerald-100 active:scale-[0.99]"
        >
          {t.viewRoute[lang]}
        </Link>
      </div>
    </article>
  );
}

export function TransferCard({ r }: { r: TransferResult }) {
  const { lang } = useLang();
  return (
    <article className="overflow-hidden rounded-2xl border border-amber-900/15 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 p-4 pb-3">
        <p className="text-[14px] font-bold text-slate-900">
          {busLabel(r.firstBus, lang)}
          <span className="mx-1.5 font-normal text-slate-400">+</span>
          {busLabel(r.secondBus, lang)}
        </p>
        <span className="shrink-0 rounded-full bg-amber-500 px-3 py-1 text-[12px] font-bold text-white">
          {lang === "bn" ? "১ বদল" : "1 change"}
        </span>
      </div>
      <div className="space-y-3 p-4 text-[14px]">
        <div className="flex gap-3">
          <div aria-hidden className="flex flex-col items-center">
            <span className="h-3 w-3 rounded-full bg-emerald-700" />
            <span className="w-px flex-1 bg-slate-200" />
            <span className="h-3 w-3 rounded-full bg-amber-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900">
              {stopLabel(r.from, lang)} → {stopLabel(r.interchange, lang)}
            </p>
            <p className="text-[13px] text-slate-500">
              {busLabel(r.firstBus, lang)} · {r.firstLeg.length - 1}{" "}
              {t.stopsCount[lang]}
            </p>
          </div>
        </div>
        <p className="ml-6 rounded-lg bg-amber-50 px-3 py-1.5 text-[13px] font-bold text-amber-900">
          ⇄ {t.changeAt[lang]}: {stopLabel(r.interchange, lang)}
        </p>
        <div className="flex gap-3">
          <div aria-hidden className="flex flex-col items-center">
            <span className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="w-px flex-1 bg-slate-200" />
            <span className="h-3 w-3 rounded-full bg-rose-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900">
              {stopLabel(r.interchange, lang)} → {stopLabel(r.to, lang)}
            </p>
            <p className="text-[13px] text-slate-500">
              {busLabel(r.secondBus, lang)} · {r.secondLeg.length - 1}{" "}
              {t.stopsCount[lang]}
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2 p-3 pt-0">
        <Link
          href={`/buses/${r.firstBus.id}`}
          className="flex-1 rounded-xl bg-slate-100 py-2.5 text-center text-[13px] font-bold text-slate-700 hover:bg-slate-200"
        >
          {busLabel(r.firstBus, lang)}
        </Link>
        <Link
          href={`/buses/${r.secondBus.id}`}
          className="flex-1 rounded-xl bg-slate-100 py-2.5 text-center text-[13px] font-bold text-slate-700 hover:bg-slate-200"
        >
          {busLabel(r.secondBus, lang)}
        </Link>
      </div>
    </article>
  );
}
