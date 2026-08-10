import type { Metadata } from "next";
import { DM_Sans, Fraunces, Noto_Sans_SC } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const chinese = Noto_Sans_SC({
  variable: "--font-chinese",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Travel Chinese — Practical Mandarin for travelers",
    template: "%s · Travel Chinese",
  },
  description:
    "Learn essential Chinese travel phrases with pinyin, English translations, and pronunciation. Free trial, one-time unlock.",
  openGraph: {
    title: "Travel Chinese",
    description:
      "Airport, hotel, restaurant, and more — Mandarin phrases travelers actually use.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${chinese.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
