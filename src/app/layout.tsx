import type { Metadata } from "next";
import { Cormorant_Garamond, Italianno, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const sans = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const script = Italianno({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luma Handmade | Ръчно изработени находки",
  description:
    "Мек минималистичен магазин за ръчно изработени бижута, керамика и малки предмети за дома.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bg"
      className={`${display.variable} ${sans.variable} ${script.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
