import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buses, getBus, getStop } from "@/lib/buses";
import { siteUrl } from "@/lib/site";
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
  const route = bus.stopIds.map((s) => getStop(s)?.nameEn).join(" → ");
  return {
    title: `${bus.nameEn} (${bus.nameBn}) — ${first.nameEn} to ${last.nameEn}`,
    description: `${bus.nameEn} (${bus.nameBn}) bus route in Dhaka: ${route}. Find all stops and connecting buses.`,
    alternates: { canonical: `/buses/${bus.id}` },
    openGraph: {
      title: `${bus.nameEn} — ${first.nameEn} to ${last.nameEn}`,
      description: `Full route: ${route}`,
      url: `/buses/${bus.id}`,
      type: "article",
    },
  };
}

export default async function BusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bus = getBus(id);
  if (!bus) notFound();
  const first = getStop(bus.stopIds[0])!;
  const last = getStop(bus.stopIds[bus.stopIds.length - 1])!;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BusTrip",
    name: `${bus.nameEn} (${bus.nameBn})`,
    url: `${siteUrl}/buses/${bus.id}`,
    provider: { "@type": "Organization", name: bus.nameEn },
    departureBusStop: { "@type": "BusStop", name: first.nameEn },
    arrivalBusStop: { "@type": "BusStop", name: last.nameEn },
    itinerary: {
      "@type": "ItemList",
      numberOfItems: bus.stopIds.length,
      itemListElement: bus.stopIds.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: getStop(s)?.nameEn,
      })),
    },
  };
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-14 pt-6 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/" className="text-[13.5px] font-bold text-emerald-700 hover:underline">
        ← Home · হোম
      </Link>
      <BusDetailView busId={bus.id} />
    </main>
  );
}
