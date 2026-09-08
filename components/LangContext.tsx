"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export type Lang = "en" | "bn";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "en",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    try {
      const saved = window.localStorage.getItem("bdbr-lang");
      return saved === "bn" ? "bn" : "en";
    } catch {
      return "en";
    }
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem("bdbr-lang", l);
    } catch {}
    try {
      document.documentElement.lang = l === "bn" ? "bn" : "en";
    } catch {}
  }, []);

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

export const t = {
  tagline: { en: "Find your bus across Dhaka", bn: "ঢাকায় আপনার বাস খুঁজুন" },
  from: { en: "From", bn: "কোথা থেকে" },
  to: { en: "To", bn: "কোথায় যাবেন" },
  fromPlaceholder: { en: "e.g. Shahbag", bn: "যেমন: শাহবাগ" },
  toPlaceholder: { en: "e.g. Gabtoli", bn: "যেমন: গাবতলি" },
  search: { en: "Find buses", bn: "বাস খুঁজুন" },
  swap: { en: "Swap from and to", bn: "উল্টে দিন" },
  directTitle: { en: "Direct buses", bn: "সরাসরি বাস" },
  transferTitle: { en: "With 1 change", bn: "১ বার বদল করে" },
  noDirect: {
    en: "No direct bus on this route — try a 1-change option below.",
    bn: "এই রুটে সরাসরি বাস নেই — নিচে ১ বার বদলের অপশন দেখুন।",
  },
  noResult: { en: "No route found", bn: "কোনো রুট পাওয়া যায়নি" },
  noResultBody: {
    en: "No direct or 1-change route connects these stops yet. Try nearby stops, swap direction, or browse all buses.",
    bn: "এই স্টপগুলোর মধ্যে এখনো সরাসরি বা ১-বদলের রুট নেই। কাছের স্টপ চেষ্টা করুন, দিক বদলান, অথবা সব বাস দেখুন।",
  },
  sameStop: {
    en: "From and To are the same — pick two different stops.",
    bn: "শুরু ও গন্তব্য একই — দুটি আলাদা স্টপ বেছে নিন।",
  },
  stopsBetween: { en: "stops in between", bn: "টি মাঝের স্টপ" },
  toward: { en: "Toward", bn: "দিকে" },
  changeAt: { en: "Change at", bn: "বদল করুন" },
  viewRoute: { en: "View full route", bn: "পুরো রুট দেখুন" },
  allBuses: { en: "All buses", bn: "সব বাস" },
  browseAll: { en: "Browse all buses", bn: "সব বাস দেখুন" },
  popular: { en: "Try popular routes", bn: "জনপ্রিয় রুট চেষ্টা করুন" },
  stopsCount: { en: "stops", bn: "টি স্টপ" },
  home: { en: "Home", bn: "হোম" },
} as const;
