"use client";

import Link from "next/link";
import { getBus, getStop, stopLabel, busLabel } from "@/lib/buses";
import { useLang, t } from "./LangContext";

export default function BusDetailView({ busId }: { busId: string }) {
  const { lang } = useLang();
  const bus = getBus(busId)!;
  const first = getStop(bus.stopIds[0])!;
  const last = getStop(bus.stopIds[bus.stopIds.length - 1])!;

  return (
    <article className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-brand p-5 text-white sm:p-6">
        <h1 className="text-[20px] font-black leading-tight sm:text-[24px]">
          {busLabel(bus, lang)}
        </h1>
        <p className="mt-0.5 text-[14px] text-emerald-100">
          {busLabel(bus, lang === "bn" ? "en" : "bn")}
        </p>
        <p className="mt-2 inline-flex flex-wrap items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[13px] font-semibold">
          {stopLabel(first, lang)} <span aria-hidden>↔</span>{" "}
          {stopLabel(last, lang)}
          <span aria-hidden className="opacity-50">
            ·
          </span>{" "}
          {bus.stopIds.length} {t.stopsCount[lang]}
        </p>
      </div>
      <ol className="p-4 sm:p-5">
        {bus.stopIds.map((id, i) => {
          const s = getStop(id)!;
          const isFirst = i === 0;
          const isLast = i === bus.stopIds.length - 1;
          return (
            <li key={id} className="flex gap-3">
              <div aria-hidden className="flex flex-col items-center">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold text-white ${
                    isFirst
                      ? "bg-emerald-700"
                      : isLast
                        ? "bg-rose-600"
                        : "bg-slate-400"
                  }`}
                >
                  {i + 1}
                </span>
                {!isLast && <span className="w-0.5 flex-1 bg-slate-200" />}
              </div>
              <div className={`min-w-0 flex-1 ${isLast ? "" : "pb-4"}`}>
                <p className="text-[15px] font-bold text-slate-900">
                  {stopLabel(s, lang)}
                </p>
                <p className="text-[13px] text-slate-500">
                  {lang === "bn" ? s.nameEn : s.nameBn}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="border-t border-slate-100 p-4">
        <Link
          href="/"
          className="block rounded-xl bg-emerald-700 py-3 text-center text-[15px] font-bold text-white hover:bg-emerald-800"
        >
          {t.search[lang]} →
        </Link>
      </div>
    </article>
  );
}
