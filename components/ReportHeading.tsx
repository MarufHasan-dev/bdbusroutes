"use client";

import { t, useLang } from "./LangContext";

export default function ReportHeading() {
  const { lang } = useLang();
  return (
    <div>
      <h1 className="text-[22px] font-black tracking-tight text-slate-900">
        {t.reportError[lang]}
      </h1>
      <p className="mt-1 text-[14px] leading-relaxed text-slate-600">
        {t.reportBlurb[lang]}
      </p>
    </div>
  );
}
