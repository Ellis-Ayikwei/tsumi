import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Errands & Delivery in Ghana | Tsumi",
  description:
    "Request errands, track live, and pay securely via escrow. Tsumi connects you with verified agents across Ghana.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Tsumi - Premium Errands & Delivery in Ghana",
    description:
      "Get errands done with verified agents. Real-time tracking and escrow payments.",
    type: "website",
  },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tsumi - Send Me. Safely.",
    template: "%s | Tsumi",
  },
  description: "Premium errand and delivery platform built for trust and speed",
  keywords: [
    "delivery",
    "errands",
    "Ghana",
    "trusted delivery",
    "courier",
    "errand runner",
    "escrow",
    "parcel",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Tsumi - Send Me. Safely.",
    description:
      "Premium errand and delivery platform built for trust and speed",
    siteName: "Tsumi",
    images: [
      {
        url:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Tsumi - Errand & Delivery",
      },
    ],
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    site: "@tsumi",
    creator: "@tsumi",
    title: "Tsumi - Send Me. Safely.",
    description:
      "Premium errand and delivery platform built for trust and speed",
    images: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  category: "business",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


