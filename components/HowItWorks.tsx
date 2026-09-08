"use client";

import { useLang } from "./LangContext";

const STEPS = [
  {
    n: "১",
    icon: "📍",
    title: { en: "Set From & To", bn: "শুরু ও গন্তব্য লিখুন" },
    desc: {
      en: "Type any stop in English or বাংলা — suggestions appear as you type.",
      bn: "বাংলা বা English — যেকোনো ভাষায় স্টপ লিখুন, টাইপ করলেই সাজেশন আসবে।",
    },
  },
  {
    n: "২",
    icon: "⏎",
    title: { en: "Press Enter", bn: "Enter চাপুন" },
    desc: {
      en: "Hit Enter or tap Find buses — matching buses appear instantly.",
      bn: "Enter চাপুন বা বাস খুঁজুন বোতামে ট্যাপ করুন — সাথে সাথে বাসের তালিকা আসবে।",
    },
  },
  {
    n: "৩",
    icon: "🚌",
    title: { en: "Catch your bus", bn: "বাসে উঠে পড়ুন" },
    desc: {
      en: "Direct buses first. None going your way? We show the best 1-change options.",
      bn: "আগে সরাসরি বাস দেখুন। সরাসরি বাস না থাকলে সেরা ১-বদলের অপশন দেখুন।",
    },
  },
] as const;

export default function HowItWorks() {
  const { lang } = useLang();
  return (
    <section aria-labelledby="how-h" className="mt-8">
      <div className="flex items-baseline justify-between gap-2">
        <h2
          id="how-h"
          className="text-[16px] font-extrabold tracking-tight text-emerald-950"
        >
          {lang === "bn" ? "কীভাবে কাজ করে" : "How it works"}
        </h2>
        <span className="shrink-0 text-[13px] font-semibold text-slate-500">
          {lang === "bn" ? "3টি সহজ ধাপ" : "3 easy steps"}
        </span>
      </div>
      <ol className="mt-3 grid gap-2.5 sm:grid-cols-3">
        {STEPS.map((s) => (
          <li
            key={s.title.en}
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
              {s.title[lang]}
            </p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-slate-600">
              {s.desc[lang]}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
