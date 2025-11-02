import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Header from "@/components/layout/header";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Suq | Free Youth-Centric B2B Marketplace",
    template: "%s | Suq",
  },
  description:
    "Suq is a youth-centric online B2B marketplace with zero additional fees. Buy and sell freely, connect directly, and grow your business with Suq.",
  keywords: [
    "Suq",
    "B2B marketplace",
    "youth marketplace",
    "Ethiopia startups",
    "sell online",
    "buy wholesale",
    "no fees platform",
  ],
  authors: [{ name: "Suq Team", url: "https://suq.et" }],
  metadataBase: new URL("https://suq.et"), // change to your real domain later
  openGraph: {
    title: "Suq | Free Youth-Centric B2B Marketplace",
    description:
      "Join Suq — the next-gen B2B platform where youth can buy and sell freely with zero extra fees.",
    url: "https://suq.et",
    siteName: "Suq",
    images: [
      {
        url: "/og-image.jpg", // place an image in public/
        width: 1200,
        height: 630,
        alt: "Suq - Free B2B Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Suq | Free Youth-Centric B2B Marketplace",
    description:
      "Suq is a zero-fee online B2B marketplace for the youth. Connect, sell, and grow.",
    images: ["/og-image.jpg"],
    creator: "@suq", // if you have a Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  alternates: {
    canonical: "https://suq.et",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${oswald.variable} antialiased min-h-screen bg-linear-to-br from-gray-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800`}
      >
        <ThemeProvider
          attribute="class"
          enableSystem
          defaultTheme="system"
          disableTransitionOnChange
        >
          <Header />
          <Toaster />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
