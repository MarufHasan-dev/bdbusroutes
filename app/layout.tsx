import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Header, { Footer } from "@/components/Header";
import { LangProvider } from "@/components/LangContext";
import { siteUrl } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const bengali = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-bengali",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BD Bus Routes — Dhaka Bus Route Search | ঢাকা বাস রুট",
    template: "%s · BD Bus Routes",
  },
  description:
    "Find which Dhaka city bus goes from your stop to your destination. Search 156+ bus routes — Savar Paribahan, BRTC, Azmeri Glory & more — in English and বাংলা। Enter From & To, press Enter.",
  keywords: [
    "Dhaka bus",
    "Dhaka bus route",
    "BD bus routes",
    "Savar Paribahan",
    "BRTC bus",
    "Azmeri Glory",
    "which bus goes",
    "ঢাকা বাস",
    "বাস রুট",
    "ঢাকা বাস রুট",
    "কোন বাস",
  ],
  authors: [{ name: "BD Bus Routes" }],
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "BD Bus Routes — Dhaka Bus Route Search",
    description:
      "From → To → Enter. Find every bus that serves your Dhaka route, in English and বাংলা।",
    url: "/",
    siteName: "BD Bus Routes",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BD Bus Routes — Dhaka Bus Route Search",
    description:
      "From → To → Enter. Find every bus that serves your Dhaka route.",
  },
  robots: { index: true, follow: true },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "BD Bus Routes",
  alternateName: "ঢাকা বাস রুট",
  url: siteUrl,
  inLanguage: ["en", "bn"],
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/?from={from}&to={to}`,
    "query-input": "required name=from; required name=to",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#006A4E",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${bengali.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        <LangProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </LangProvider>
        <Analytics />
      </body>
    </html>
  );
}
