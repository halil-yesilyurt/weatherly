import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const manrope = Manrope({ variable: '--font-weatherly', subsets: ['latin'], display: 'swap' });

const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = productionHost ? `https://${productionHost}` : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Weatherly | Your daily forecast",
  description: "Explore accurate hourly and 7-day weather forecasts for cities around the world. Save favorite locations and personalize your experience.",
  keywords: "weather, forecast, temperature, climate, weatherly",
  authors: [{ name: "Weatherly Team" }],
  openGraph: { title: "Weatherly — Weather, made simple", description: "Explore the weather around the world with a thoughtfully designed forecast experience.", type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Weatherly weather forecast preview" }] },
  twitter: { card: "summary_large_image", title: "Weatherly — Weather, made simple", images: ["/opengraph-image"] },
  icons: { icon: [{ url: "/weatherly-icon.svg", type: "image/svg+xml" }], shortcut: "/weatherly-icon.svg", apple: "/weatherly-icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} antialiased min-h-screen`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
