"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Autocomplete from "./Autocomplete";
import { getStop, type Stop } from "@/lib/buses";
import { t, useLang } from "./LangContext";

interface Props {
  initialFrom?: string;
  initialTo?: string;
}

export default function SearchForm({ initialFrom = "", initialTo = "" }: Props) {
  const router = useRouter();
  const { lang } = useLang();

  const fromStop = initialFrom ? getStop(initialFrom) : undefined;
  const toStop = initialTo ? getStop(initialTo) : undefined;

  const [fromId, setFromId] = useState(initialFrom);
  const [toId, setToId] = useState(initialTo);
  const [fromText, setFromText] = useState(
    fromStop ? (lang === "bn" ? fromStop.nameBn : fromStop.nameEn) : ""
  );
  const [toText, setToText] = useState(
    toStop ? (lang === "bn" ? toStop.nameBn : toStop.nameEn) : ""
  );
  const [error, setError] = useState<string | null>(null);

  // When a stop is picked, always display its name in the active language.
  // Free-typed text passes through untouched. Pure derivation (no effects),
  // so toggling EN/বাং instantly re-renders picked stops with no mismatch.
  const shownText = (pickedId: string, text: string): string => {
    if (!pickedId) return text;
    const picked: Stop | undefined = getStop(pickedId);
    if (!picked) return text;
    if (text === picked.nameEn || text === picked.nameBn) {
      return lang === "bn" ? picked.nameBn : picked.nameEn;
    }
    return text;
  };
  const shownFrom = shownText(fromId, fromText);
  const shownTo = shownText(toId, toText);

  const canSubmit = useMemo(() => fromText.trim() !== "" && toText.trim() !== "", [fromText, toText]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    // Resolve text -> id if user typed without picking (match handled server-side too)
    const params = new URLSearchParams();
    if (fromId) params.set("from", fromId);
    else if (fromText.trim()) params.set("from", fromText.trim());
    if (toId) params.set("to", toId);
    else if (toText.trim()) params.set("to", toText.trim());
    if (!fromText.trim() || !toText.trim()) {
      return;
    }
    if ((fromId && fromId === toId) || (!fromId && !toId && fromText.trim() === toText.trim())) {
      setError(t.sameStop[lang]);
      return;
    }
    setError(null);
    router.push(`/?${params.toString()}#results`);
  };

  const swap = () => {
    setFromId(toId);
    setToId(fromId);
    setFromText(toText);
    setToText(fromText);
    setError(null);
  };

  return (
    <form
      onSubmit={submit}
      role="search"
      aria-label={lang === "bn" ? "বাস রুট খুঁজুন" : "Search bus routes"}
      className="relative z-10 w-full rounded-2xl border border-emerald-950/10 bg-white/95 p-4 shadow-xl shadow-emerald-950/10 backdrop-blur sm:p-5"
    >
      <div className="grid gap-3">
        <Autocomplete
          label={t.from[lang]}
          placeholder={t.fromPlaceholder[lang]}
          value={fromId}
          displayValue={shownFrom}
          icon="from"
          onPick={(s, text) => {
            setFromId(s ? s.id : "");
            setFromText(text);
          }}
        />
        <div className="relative flex items-center">
          <div aria-hidden className="h-px flex-1 bg-slate-200" />
          <button
            type="button"
            onClick={swap}
            aria-label={t.swap[lang]}
            className="mx-2 inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-full border border-emerald-800/20 bg-emerald-50 px-3 text-sm font-bold text-emerald-800 transition active:scale-95 hover:bg-emerald-100"
          >
            <span aria-hidden className="text-base leading-none">⇅</span>
            <span className="hidden sm:inline">{lang === "bn" ? "বদলান" : "Swap"}</span>
          </button>
          <div aria-hidden className="h-px flex-1 bg-slate-200" />
        </div>
        <Autocomplete
          label={t.to[lang]}
          placeholder={t.toPlaceholder[lang]}
          value={toId}
          displayValue={shownTo}
          icon="to"
          onPick={(s, text) => {
            setToId(s ? s.id : "");
            setToText(text);
          }}
        />
      </div>

      {error && error !== "" && (
        <p role="alert" className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-4 min-h-[52px] w-full rounded-xl bg-emerald-700 py-3.5 text-[16px] font-bold text-white shadow-lg shadow-emerald-700/25 transition hover:bg-emerald-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
      >
        {t.search[lang]} →
      </button>
      <p className="mt-2 text-center text-xs text-slate-500">
        {lang === "bn" ? "Enter চাপলেও খোঁজা যাবে" : "Press Enter to search"}
      </p>
    </form>
  );
}
