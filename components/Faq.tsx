"use client";

import { useLang } from "./LangContext";

const FAQS = [
  {
    q: {
      en: "How do I find which bus goes my way?",
      bn: "কোন বাসে যাবো, কীভাবে খুঁজবো?",
    },
    a: {
      en: "Type your starting stop in From and your destination in To, then press Enter. The site lists every bus that serves that route, with the stops in between highlighted.",
      bn: "From ঘরে শুরুর স্টপ আর To ঘরে গন্তব্যের স্টপ লিখে Enter চাপুন। ওই রুটে চলা সব বাসের তালিকা মাঝের স্টপসহ দেখা যাবে।",
    },
  },
  {
    q: {
      en: "What if there is no direct bus?",
      bn: "সরাসরি বাস না থাকলে কী হবে?",
    },
    a: {
      en: "You will see the best 1-change options: take the first bus, get off at the interchange stop, and board the second bus to your destination.",
      bn: "সেরা ১-বদলের অপশন দেখানো হবে: প্রথম বাসে উঠে ইন্টারচেঞ্জ স্টপে নেমে গন্তব্যের দ্বিতীয় বাসে উঠুন।",
    },
  },
  {
    q: {
      en: "Which areas are covered?",
      bn: "কোন কোন এলাকা আছে?",
    },
    a: {
      en: "Dhaka city, with 156 bus routes and 259 stops so far — from Uttara and Tongi to Sadarghat, Savar to Demra. More routes are added regularly.",
      bn: "ঢাকা শহর — এখন পর্যন্ত ১৫৬টি বাস রুট ও ২৫৯টি স্টপ: উত্তরা-টঙ্গী থেকে সদরঘাট, সাভার থেকে ডেমরা। নতুন রুট নিয়মিত যোগ হচ্ছে।",
    },
  },
  {
    q: {
      en: "Is the route information accurate?",
      bn: "রুটের তথ্য কি সঠিক?",
    },
    a: {
      en: "Routes are community-collected and may change with road conditions. Confirm fare and timing with the bus staff before travelling.",
      bn: "রুটগুলো সবার সহযোগিতায় সংগ্রহ করা, রাস্তার অবস্থার সাথে বদলাতে পারে। ভ্রমণের আগে ভাড়া ও সময় বাস কর্মীদের কাছে যাচাই করে নিন।",
    },
  },
] as const;

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.flatMap((f) => [
    {
      "@type": "Question",
      name: f.q.en,
      acceptedAnswer: { "@type": "Answer", text: f.a.en },
    },
    {
      "@type": "Question",
      name: f.q.bn,
      acceptedAnswer: { "@type": "Answer", text: f.a.bn },
    },
  ]),
};

export default function Faq() {
  const { lang } = useLang();
  return (
    <section aria-labelledby="faq-h" className="mt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h2
        id="faq-h"
        className="text-[16px] font-extrabold tracking-tight text-emerald-950"
      >
        {lang === "bn" ? "প্রশ্নোত্তর" : "Questions"}
      </h2>
      <div className="mt-3 space-y-2">
        {FAQS.map((f) => (
          <details
            key={f.q.en}
            className="group rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          >
            <summary className="cursor-pointer list-none text-[14.5px] font-bold text-slate-900 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-3">
                <span>{f.q[lang]}</span>
                <span
                  aria-hidden
                  className="shrink-0 text-emerald-700 transition group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="pt-2 text-[13.5px] leading-relaxed text-slate-600">
              {f.a[lang]}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
