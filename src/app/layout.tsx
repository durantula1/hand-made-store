import type { Metadata } from "next";
import { Cormorant_Garamond, Italianno, Source_Sans_3 } from "next/font/google";
import { ShopShell } from "@/components/shop-shell";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
  weight: ["400", "500"],
  display: "swap",
});

const sans = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600"],
  display: "swap",
});

const script = Italianno({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luméa Handmade | Ръчно изработени бижута",
  description:
    "Ръчно изработени гривни, гердани, обеци, пръстени и ключодържатели в злато или сребро.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bg"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} ${script.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        {/* The shell lives in the root layout so header, cart and footer persist across navigations. */}
        <ShopShell>{children}</ShopShell>
      </body>
    </html>
  );
}
