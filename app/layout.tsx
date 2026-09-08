import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Header, { Footer } from "@/components/Header";
import { LangProvider } from "@/components/LangContext";

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
  title: {
    default: "BD Bus Routes - Dhaka Bus Route Search | ঢাকা বাস রুট",
    template: "%s · BD Bus Routes",
  },
  description:
    "Find direct Dhaka city buses from your location to destination. Search Savar Paribahan, Azmeri Glory & more — in English and বাংলা।",
  keywords: [
    "Dhaka bus",
    "BD bus routes",
    "Savar Paribahan",
    "Azmeri Glory",
    "ঢাকা বাস",
    "বাস রুট",
  ],
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "BD Bus Routes — Dhaka Bus Route Search",
    description:
      "From → To → Enter. Find every bus that serves your Dhaka route.",
    type: "website",
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
