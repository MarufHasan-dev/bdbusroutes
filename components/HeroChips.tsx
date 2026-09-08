"use client";

import { useRef } from "react";
import Link from "next/link";
import { getStop, stopLabel } from "@/lib/buses";
import { useLang } from "./LangContext";

const QUICK: [string, string][] = [
  ["shahbag", "gabtoli"],
  ["sadarghat", "mohakhali"],
  ["paltan", "airport"],
  ["shyamoli", "sadarghat"],
  ["jashimuddin-uttara", "motijheel"],
  ["mirpur-10", "gulistan"],
  ["mohammadpur", "gulshan-1"],
  ["farmgate", "jatrabari"],
];

/** Copies of the set for scroll buffer; copy 0 stays the interactive one. */
const COPIES = 3;

function Chip({ from, to, hidden }: { from: string; to: string; hidden?: boolean }) {
  const { lang } = useLang();
  const fromStop = getStop(from)!;
  const toStop = getStop(to)!;
  return (
    <Link
      href={`/?from=${from}&to=${to}#results`}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      draggable={false}
      className="mr-2 shrink-0 select-none rounded-full border border-white/20 bg-white/15 px-3.5 py-2 text-[13px] font-semibold text-white backdrop-blur transition hover:bg-white/25 active:scale-95"
    >
      {stopLabel(fromStop, lang)}
      <span aria-hidden className="mx-1.5 opacity-60">
        →
      </span>
      {stopLabel(toStop, lang)}
    </Link>
  );
}

export default function HeroChips() {
  const { lang } = useLang();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; scroll: number } | null>(null);

  return (
    <div className="mt-4">
      <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-emerald-200">
        {lang === "bn" ? "জনপ্রিয় রুট" : "Popular routes"}
      </p>
      {/* Outer = manual scroll (swipe on touch, drag on mouse).
          Inner = CSS drift (pauses on hover / focus / press). Both shift by
          whole identical sets only, so neither can visibly jump or end. */}
      <div
        ref={scrollerRef}
        className="group/chips chips-mask mt-2 cursor-grab overflow-x-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        onScroll={() => {
          // Fold manual scrolls back by whole sets — invisible, never ends.
          const el = scrollerRef.current;
          if (!el) return;
          const w = el.scrollWidth / COPIES;
          if (w <= 0) return;
          while (el.scrollLeft >= w) el.scrollLeft -= w;
        }}
        onPointerDown={(e) => {
          // Mouse drag-to-scroll (touch uses native swipe scrolling).
          if (e.pointerType !== "mouse" || e.button !== 0) return;
          const el = scrollerRef.current;
          if (!el) return;
          dragRef.current = { x: e.clientX, scroll: el.scrollLeft };
          el.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const drag = dragRef.current;
          const el = scrollerRef.current;
          if (!drag || !el) return;
          el.scrollLeft = drag.scroll - (e.clientX - drag.x);
        }}
        onPointerUp={() => {
          dragRef.current = null;
        }}
        onPointerCancel={() => {
          dragRef.current = null;
        }}
      >
        <div className="animate-chips flex w-max group-focus-within/chips:[animation-play-state:paused] group-hover/chips:[animation-play-state:paused] group-active/chips:[animation-play-state:paused]">
          {Array.from({ length: COPIES }, (_, copy) =>
            QUICK.map(([f, tt]) => (
              <Chip
                key={`${copy}-${f}-${tt}`}
                from={f}
                to={tt}
                hidden={copy !== 0}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
