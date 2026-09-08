import type { Metadata } from "next";
import Link from "next/link";
import BusesListView from "@/components/BusesListView";

export const metadata: Metadata = {
  title: "All Dhaka buses",
  description: "Browse all Dhaka city buses on BD Bus Routes.",
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
