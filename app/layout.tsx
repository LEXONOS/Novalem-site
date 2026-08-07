import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { NoiseOverlay } from "@/components/ui";
import "./globals.css";

/**
 * Fraunces en variable font.
 * SOFT et WONK sont chargés pour pouvoir régler le caractère des titres
 * depuis globals.css (font-variation-settings). Si next/font refuse un axe
 * sur ta version, retire-le du tableau : le reste du système ne bouge pas.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NOVALEM — Design system",
  description:
    "Tokens, échelle typographique et primitives du site NOVALEM.",
};

export const viewport: Viewport = {
  themeColor: "#FFFDF9",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-xs focus:bg-encre-900 focus:px-4 focus:py-3 focus:text-caption focus:text-porcelaine-000"
        >
          Aller au contenu
        </a>
        <SmoothScroll>{children}</SmoothScroll>
        <NoiseOverlay />
      </body>
    </html>
  );
}
