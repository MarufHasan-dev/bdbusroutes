import type { Metadata } from "next";
import Link from "next/link";
import ReportForm from "@/components/ReportForm";
import ReportHeading from "@/components/ReportHeading";

export const metadata: Metadata = {
  title: "Report an error · ভুল জানান",
  description:
    "Spotted a wrong stop, missing bus, or incorrect route on BD Bus Routes? Report it and help keep Dhaka bus data accurate.",
  alternates: { canonical: "/report" },
};

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ bus?: string }>;
}) {
  const { bus } = await searchParams;
  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-14 pt-6 sm:px-6">
      <Link href="/" className="text-[13.5px] font-bold text-emerald-700 hover:underline">
        ← <ReportBackLabel />
      </Link>
      <div className="mt-3">
        <ReportHeading />
        <div className="mt-4">
          <ReportForm initialBus={bus ?? ""} />
        </div>
      </div>
    </main>
  );
}

function ReportBackLabel() {
  return <>Home · হোম</>;
}
