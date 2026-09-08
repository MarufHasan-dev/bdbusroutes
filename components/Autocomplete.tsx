"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { filterStops, stopLabel, stopSubLabel, type Stop } from "@/lib/buses";
import { useLang } from "./LangContext";

interface Props {
  id?: string;
  label: string;
  placeholder?: string;
  value: string; // stop id
  displayValue: string; // free text shown
  onPick: (stop: Stop | null, text: string) => void;
  icon: "from" | "to";
}

/** Bolds the typed substring inside a suggestion (EN case-insensitive, BN raw). */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-transparent font-extrabold text-emerald-800">
        {text.slice(i, i + query.length)}
      </mark>
      {text.slice(i + query.length)}
    </>
  );
}

export default function Autocomplete({ label, placeholder, value, displayValue, onPick, icon }: Props) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const results = useMemo(() => filterStops(displayValue, 8), [displayValue]);
  const boxRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const commit = (s: Stop | null, text: string) => {
    onPick(s, text);
    setOpen(false);
  };

  const query = displayValue.trim();
  return (
    <div ref={boxRef} className="relative">
      <label
        htmlFor={listId}
        className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold tracking-wide text-emerald-950"
      >
        <span
          aria-hidden
          className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white ${
            icon === "from" ? "bg-emerald-700" : "bg-rose-600"
          }`}
        >
          {icon === "from" ? "A" : "B"}
        </span>
        {label}
      </label>
      <input
        id={listId}
        role="combobox"
        aria-expanded={open}
        aria-controls={`${listId}-listbox`}
        aria-autocomplete="list"
        autoComplete="off"
        inputMode="search"
        placeholder={placeholder}
        value={displayValue}
        onChange={(e) => {
          commit(null, e.target.value);
          setHighlight(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setHighlight((h) => Math.min(h + 1, results.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlight((h) => Math.max(h - 1, 0));
          } else if (e.key === "Enter" && open && results[highlight]) {
            // Pick highlighted option; form submit (server fuzzy-resolves text too)
            const s = results[highlight];
            if (displayValue.trim() !== stopLabel(s, "en") && displayValue.trim() !== s.nameBn) {
              e.preventDefault();
              commit(s, lang === "bn" ? s.nameBn : s.nameEn);
              setOpen(false);
            }
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        className="h-12 w-full rounded-xl border border-emerald-950/15 bg-white px-4 text-[16px] font-medium text-slate-900 shadow-sm outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/15"
      />
      {open && results.length > 0 && (
        <ul
          id={`${listId}-listbox`}
          role="listbox"
          className="absolute inset-x-0 top-full z-30 mt-2 max-h-72 animate-pop-in overflow-auto overscroll-contain rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-emerald-950/10"
        >
          {results.map((s, i) => (
            <li key={s.id} role="option" aria-selected={s.id === value}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  commit(s, lang === "bn" ? s.nameBn : s.nameEn);
                }}
                onMouseEnter={() => setHighlight(i)}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                  i === highlight ? "bg-emerald-50" : "bg-white"
                } active:bg-emerald-100`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-semibold text-slate-900">
                    <Highlight text={stopLabel(s, lang)} query={query} />
                  </span>
                  <span className="block truncate text-[13px] text-slate-500">
                    <Highlight text={stopSubLabel(s, lang)} query={query} />
                  </span>
                </span>
                {s.id === value && (
                  <span aria-hidden className="shrink-0 text-emerald-700">
                    ✓
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
