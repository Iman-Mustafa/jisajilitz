import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "THE PEACE - Jisajili",
  description: "Fomu salama ya usajili na wasimamizi wawili.",
  icons: {
    icon: "/jisajili.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sw" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="icon" href="/jisajili.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
