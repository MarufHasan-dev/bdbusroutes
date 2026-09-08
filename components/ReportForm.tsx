"use client";

import { useMemo, useState } from "react";
import { buses, busLabel, stops } from "@/lib/buses";
import { t, useLang } from "./LangContext";

const CATEGORIES = [
  { id: "wrong-stop", en: "Wrong stop in a route", bn: "রুটে ভুল স্টপ" },
  { id: "missing-stop", en: "Missing stop", bn: "বাদ পড়া স্টপ" },
  { id: "wrong-order", en: "Stops in wrong order", bn: "ভুল ক্রমে স্টপ" },
  { id: "missing-bus", en: "Missing bus", bn: "বাদ পড়া বাস" },
  { id: "wrong-name", en: "Wrong bus/stop name", bn: "ভুল বাস/স্টপের নাম" },
  { id: "other", en: "Something else", bn: "অন্য কিছু" },
] as const;

export default function ReportForm({ initialBus = "" }: { initialBus?: string }) {
  const { lang } = useLang();
  const [busId, setBusId] = useState(initialBus);
  const [category, setCategory] = useState<string>("wrong-stop");
  const [stopText, setStopText] = useState("");
  const [details, setDetails] = useState("");
  const [contact, setContact] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const stopOptions = useMemo(() => stops, []);
  const L = (en: string, bn: string) => (lang === "bn" ? bn : en);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (details.trim().length < 10) {
      setErrorMsg(
        L("Please describe the issue in a little more detail (min 10 characters).", "সমস্যাটি একটু বিস্তারিত লিখুন (কমপক্ষে ১০ অক্ষর)।")
      );
      setState("error");
      return;
    }
    setState("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ busId, category, stop: stopText.trim(), details: details.trim(), contact: contact.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "send-failed");
      setState("sent");
    } catch {
      setErrorMsg(L("Could not send the report. Please try again.", "রিপোর্ট পাঠানো যায়নি। আবার চেষ্টা করুন।"));
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p aria-hidden className="text-4xl">✅</p>
        <h2 className="mt-2 text-[17px] font-extrabold text-emerald-900">
          {L("Report received — thank you!", "রিপোর্ট পেয়েছি — ধন্যবাদ!")}
        </h2>
        <p className="mx-auto mt-1 max-w-md text-[14px] text-emerald-800">
          {L("We'll review it and fix the route data soon.", "আমরা যাচাই করে রুটের তথ্য শিগগিরই ঠিক করে দেবো।")}
        </p>
      </div>
    );
  }

  const inputCls =
    "h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-[16px] text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/15";
  const labelCls = "mb-1.5 block text-[13px] font-bold text-slate-800";

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div>
        <label htmlFor="rep-bus" className={labelCls}>
          {L("Which bus is this about? (optional)", "কোন বাস সম্পর্কে? (ঐচ্ছিক)")}
        </label>
        <select id="rep-bus" value={busId} onChange={(e) => setBusId(e.target.value)} className={inputCls}>
          <option value="">{L("General / not about one bus", "সাধারণ / কোনো নির্দিষ্ট বাস নয়")}</option>
          {buses.map((b) => (
            <option key={b.id} value={b.id}>
              {busLabel(b, lang)} · {busLabel(b, lang === "bn" ? "en" : "bn")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="rep-cat" className={labelCls}>
          {L("What kind of issue?", "কী ধরনের সমস্যা?")}
        </label>
        <select id="rep-cat" value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c[lang]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="rep-stop" className={labelCls}>
          {L("Related stop (optional)", "সংশ্লিষ্ট স্টপ (ঐচ্ছিক)")}
        </label>
        <input
          id="rep-stop"
          list="rep-stop-list"
          value={stopText}
          onChange={(e) => setStopText(e.target.value)}
          placeholder={L("e.g. Shahbag / শাহবাগ", "যেমন: শাহবাগ")}
          autoComplete="off"
          className={inputCls}
        />
        <datalist id="rep-stop-list">
          {stopOptions.map((s) => (
            <option key={s.id} value={lang === "bn" ? s.nameBn : s.nameEn} />
          ))}
        </datalist>
      </div>

      <div>
        <label htmlFor="rep-details" className={labelCls}>
          {L("Describe the issue *", "সমস্যাটি বর্ণনা করুন *")}
        </label>
        <textarea
          id="rep-details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={4}
          required
          minLength={10}
          maxLength={2000}
          placeholder={L("e.g. Bus 8 No. no longer stops at Kawran Bazar…", "যেমন: ৮ নং বাস এখন কাওরান বাজারে থামে না…")}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[16px] text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/15"
        />
      </div>

      <div>
        <label htmlFor="rep-contact" className={labelCls}>
          {L("Your contact (optional)", "আপনার যোগাযোগ (ঐচ্ছিক)")}
        </label>
        <input
          id="rep-contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder={L("Phone or email — only if we may follow up", "ফোন বা ইমেইল — প্রয়োজনে যোগাযোগের জন্য")}
          autoComplete="off"
          maxLength={120}
          className={inputCls}
        />
      </div>

      {state === "error" && errorMsg && (
        <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="min-h-[52px] w-full rounded-xl bg-emerald-700 py-3.5 text-[16px] font-bold text-white shadow-lg shadow-emerald-700/25 transition hover:bg-emerald-800 active:scale-[0.99] disabled:opacity-50"
      >
        {state === "sending" ? L("Sending…", "পাঠানো হচ্ছে…") : `${t.reportError[lang]} →`}
      </button>
    </form>
  );
}
