"use client";

import Link from "next/link";
import type { DirectResult, TransferResult } from "@/lib/search";
import { DirectCard, TransferCard } from "./RouteCards";
import { t, useLang } from "./LangContext";

interface Props {
  status: "idle" | "same" | "not-found" | "ok";
  direct?: DirectResult[];
  transfers?: TransferResult[];
}

export default function Results({ status, direct = [], transfers = [] }: Props) {
  const { lang } = useLang();

  if (status === "idle") return null;

  if (status === "same") {
    return (
      <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-center">
        <p className="text-[15px] font-bold text-rose-800">{t.sameStop[lang]}</p>
      </div>
    );
  }

  if (status === "not-found") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-3xl" aria-hidden>🔍</p>
        <h2 className="mt-2 text-[17px] font-extrabold text-slate-900">{t.noResult[lang]}</h2>
        <p className="mx-auto mt-1 max-w-md text-[14px] leading-relaxed text-slate-600">
          {t.noResultBody[lang]}
        </p>
        <Link
          href="/buses"
          className="mt-4 inline-block rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-800"
        >
          {t.browseAll[lang]}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {direct.length > 0 ? (
        <section aria-labelledby="direct-h">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="direct-h" className="text-[16px] font-extrabold text-emerald-950">
              {t.directTitle[lang]}
              <span className="ml-2 rounded-full bg-emerald-700 px-2.5 py-0.5 align-middle text-[12px] font-bold text-white">
                {direct.length}
              </span>
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {direct.map((r) => (
              <DirectCard key={r.bus.id} r={r} />
            ))}
          </div>
        </section>
      ) : (
        <div role="status" className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-center text-[14px] font-semibold text-amber-900">
          {t.noDirect[lang]}
        </div>
      )}

      {transfers.length > 0 && (
        <section aria-labelledby="transfer-h">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="transfer-h" className="text-[16px] font-extrabold text-emerald-950">
              {t.transferTitle[lang]}
              <span className="ml-2 rounded-full bg-amber-500 px-2.5 py-0.5 align-middle text-[12px] font-bold text-white">
                {transfers.length}
              </span>
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {transfers.map((r) => (
              <TransferCard
                key={`${r.firstBus.id}-${r.secondBus.id}-${r.interchange.id}`}
                r={r}
              />
            ))}
          </div>
          <p className="mt-2 text-center text-[12.5px] text-slate-500">
            {lang === "bn"
              ? "ইন্টারচেঞ্জে নেমে অন্য বাসে উঠুন। ভাড়া ও সময় যাচাই করে নিন।"
              : "Get off at the interchange and board the second bus. Confirm fare & timing locally."}
          </p>
        </section>
      )}

      {direct.length === 0 && transfers.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-[17px] font-extrabold text-slate-900">{t.noResult[lang]}</h2>
          <p className="mx-auto mt-1 max-w-md text-[14px] text-slate-600">{t.noResultBody[lang]}</p>
          <div className="mt-4 flex justify-center gap-2">
            <Link href="/buses" className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-800">
              {t.browseAll[lang]}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function SearchSummary({ fromName, toName }: { fromName?: string; toName?: string }) {
  if (!fromName || !toName) return null;
  return (
    <p className="text-[13.5px] font-medium text-slate-600">
      <span className="font-bold text-slate-900">{fromName}</span>
      <span aria-hidden className="mx-1.5 text-slate-300">→</span>
      <span className="font-bold text-slate-900">{toName}</span>
    </p>
  );
}
