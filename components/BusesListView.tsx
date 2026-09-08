"use client";

import Link from "next/link";
import { buses, busLabel, getStop, stopLabel } from "@/lib/buses";
import { useLang, t } from "./LangContext";

export default function BusesListView() {
  const { lang } = useLang();
  return (
    <div className="mt-3">
      <h1 className="text-[22px] font-black text-slate-900">
        {t.allBuses[lang]} <span className="text-slate-400">· {buses.length}</span>
      </h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {buses.map((b) => (
          <Link
            key={b.id}
            href={`/buses/${b.id}`}
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
    </div>
  );
}
