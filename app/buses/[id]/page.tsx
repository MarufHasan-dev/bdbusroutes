import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buses, getBus, getStop } from "@/lib/buses";
import BusDetailView from "@/components/BusDetailView";

export function generateStaticParams() {
  return buses.map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const bus = getBus(id);
  if (!bus) return { title: "Bus not found" };
  const first = getStop(bus.stopIds[0])!;
  const last = getStop(bus.stopIds[bus.stopIds.length - 1])!;
  return {
    title: `${bus.nameEn} (${bus.nameBn}) — ${first.nameEn} to ${last.nameEn}`,
    description: `${bus.nameEn} route: ${bus.stopIds.map((s) => getStop(s)?.nameEn).join(" → ")}`,
  };
}

export default async function BusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bus = getBus(id);
  if (!bus) notFound();
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-14 pt-6 sm:px-6">
      <Link href="/" className="text-[13.5px] font-bold text-emerald-700 hover:underline">
        ← Home · হোম
      </Link>
      <BusDetailView busId={bus.id} />
    </main>
  );
}
