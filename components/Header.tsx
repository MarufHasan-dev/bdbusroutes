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
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p className="text-[13px] font-semibold text-slate-700">
          BD Bus Routes{" "}
          <span className="font-normal text-slate-400">· Dhaka city · v1</span>
        </p>
        <p className="text-[12.5px] text-slate-500">
          © 2026 Maruf Hasan. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
