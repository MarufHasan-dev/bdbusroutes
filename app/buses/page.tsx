import type { Metadata } from "next";
import Link from "next/link";
import BusesListView from "@/components/BusesListView";

export const metadata: Metadata = {
  title: "All Dhaka buses · সব বাস",
  description:
    "Browse all 156 Dhaka city bus routes on BD Bus Routes — Savar Paribahan, BRTC, Azmeri Glory and more, in English and বাংলা।",
  alternates: { canonical: "/buses" },
};

export default function BusesPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-14 pt-6 sm:px-6">
      <Link href="/" className="text-[13.5px] font-bold text-emerald-700 hover:underline">
        ← Home · হোম
      </Link>
      <BusesListView />
    </main>
  );
}
