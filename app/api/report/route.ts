import nodemailer from "nodemailer";
import { getBus, resolveStop } from "@/lib/buses";

const CATEGORY_LABELS: Record<string, string> = {
  "wrong-stop": "Wrong stop in a route",
  "missing-stop": "Missing stop",
  "wrong-order": "Stops in wrong order",
  "missing-bus": "Missing bus",
  "wrong-name": "Wrong bus/stop name",
  other: "Something else",
};

function smtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.REPORT_TO
  );
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  const { busId, category, stop, details, contact } = (body ?? {}) as Record<string, unknown>;

  if (typeof details !== "string" || details.trim().length < 10 || details.trim().length > 2000) {
    return Response.json({ ok: false, error: "details-too-short" }, { status: 400 });
  }
  if (category !== undefined && (typeof category !== "string" || !(category in CATEGORY_LABELS))) {
    return Response.json({ ok: false, error: "invalid-category" }, { status: 400 });
  }

  const bus = typeof busId === "string" && busId ? getBus(busId) : undefined;
  if (typeof busId === "string" && busId && !bus) {
    return Response.json({ ok: false, error: "invalid-bus" }, { status: 400 });
  }
  const stopHit = typeof stop === "string" && stop.trim() ? resolveStop(stop) : undefined;

  const subject = `[BD Bus Routes] ${CATEGORY_LABELS[(category as string) ?? "other"] ?? "Report"}${
    bus ? ` — ${bus.nameEn}` : ""
  }`;
  const textLines = [
    `Category: ${CATEGORY_LABELS[(category as string) ?? "other"] ?? category}`,
    `Bus: ${bus ? `${bus.nameEn} (${bus.nameBn}) [${bus.id}]` : "(general)"}`,
    `Stop: ${typeof stop === "string" && stop.trim() ? stop.trim() : "(none)"}${
      stopHit && stopHit.id ? ` [resolved: ${stopHit.id}]` : ""
    }`,
    `Contact: ${typeof contact === "string" && contact.trim() ? contact.trim() : "(none)"}`,
    "",
    "Details:",
    details.trim(),
  ];
  const text = textLines.join("\n");

  if (smtpConfigured()) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({
        from: process.env.REPORT_FROM ?? process.env.SMTP_USER,
        to: process.env.REPORT_TO,
        subject,
        text,
      });
      return Response.json({ ok: true, delivered: true });
    } catch (err) {
      console.error("Report email failed:", err);
      return Response.json({ ok: false, error: "send-failed" }, { status: 502 });
    }
  }

  // SMTP not configured yet (env comes later) — log so nothing is lost.
  console.log("Report received (SMTP not configured):\n" + `Subject: ${subject}\n${text}`);
  return Response.json({ ok: true, delivered: false });
}
