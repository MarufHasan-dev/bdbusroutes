"use client";

import { useLang } from "./LangContext";

export default function HeroHeading() {
  const { lang } = useLang();
  return (
    <>
      <p className="text-[12.5px] font-bold uppercase tracking-[0.18em] text-emerald-200">
        {lang === "bn" ? "ঢাকা শহর · সংস্করণ ১" : "Dhaka city · v1"}
      </p>
      <h1 className="mt-1.5 text-balance text-[26px] font-black leading-tight tracking-tight sm:text-[34px]">
        {lang === "bn" ? (
          <>কোন বাসে যাবেন? <span className="text-amber-300">এখনই খুঁজুন।</span></>
        ) : (
          <>Which bus goes your way? <span className="text-amber-300">Find it fast.</span></>
        )}
      </h1>
      <p className="mx-auto mt-2 max-w-md text-pretty text-[14.5px] leading-relaxed text-emerald-50/90">
        {lang === "bn"
          ? "শুরু ও গন্তব্য লিখে Enter চাপুন — কোন কোন বাস যায় দেখে নিন।"
          : "Enter From and To, press Enter — see every bus that serves your route."}
      </p>
    </>
  );
}
