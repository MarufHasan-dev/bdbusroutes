"use client";

import Link from "next/link";
import { useLang, t } from "./LangContext";

export default function Header() {
  const { lang, setLang } = useLang();
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-950/10 bg-[#006A4E]/95 text-white backdrop-blur supports-[backdrop-filter]:bg-[#006A4E]/90">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-lg font-black text-emerald-800"
          >
            বাস
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[15px] font-extrabold tracking-tight">
              BD Bus Routes
            </span>
            <span className="block truncate text-[11.5px] font-medium text-emerald-100">
              {t.tagline[lang]} · ঢাকা
            </span>
          </span>
        </Link>
        <nav className="flex shrink-0 items-center gap-2">
          <Link
            href="/buses"
            className="hidden rounded-full px-3 py-1.5 text-[13px] font-bold text-emerald-50 transition hover:bg-white/15 sm:block"
          >
            {t.allBuses[lang]}
          </Link>
          <Link
            href="/report"
            className="hidden rounded-full px-3 py-1.5 text-[13px] font-bold text-emerald-50 transition hover:bg-white/15 sm:block"
          >
            {t.report[lang]}
          </Link>
          <div
            role="group"
            aria-label={lang === "bn" ? "ভাষা" : "Language"}
            className="flex rounded-full bg-black/20 p-1 text-[13px] font-bold"
          >
            {(["en", "bn"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`rounded-full px-3 py-1 transition ${
                  lang === l
                    ? "bg-white text-emerald-900 shadow"
                    : "text-emerald-50 hover:bg-white/10"
                }`}
              >
                {l === "en" ? "EN" : "বাং"}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  const { lang } = useLang();
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div>
          <p className="text-[13px] font-semibold text-slate-700">
            BD Bus Routes{" "}
            <span className="font-normal text-slate-400">
              · {lang === "bn" ? "ঢাকা শহর" : "Dhaka city"}
            </span>
          </p>
          <p className="mt-1 text-[12.5px] text-slate-500">
            © 2026 Maruf Hasan.{" "}
            {lang === "bn" ? "সর্বস্বত্ব সংরক্ষিত।" : "All rights reserved."}
          </p>
        </div>
        <nav
          aria-label={lang === "bn" ? "ফুটার" : "Footer"}
          className="flex items-center justify-center gap-2 text-[13px] font-bold"
        >
          <Link
            href="/buses"
            className="rounded-full bg-slate-100 px-3.5 py-1.5 text-slate-700 transition hover:bg-slate-200"
          >
            {t.allBuses[lang]}
          </Link>
          <Link
            href="/report"
            className="rounded-full bg-emerald-700 px-3.5 py-1.5 text-white transition hover:bg-emerald-800"
          >
            {t.reportError[lang]}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
