import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const manrope = Manrope({ variable: '--font-weatherly', subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: "Weatherly | Your daily forecast",
  description: "Explore accurate hourly and 7-day weather forecasts for cities around the world. Save favorite locations and personalize your experience.",
  keywords: "weather, forecast, temperature, climate, weatherly",
  authors: [{ name: "Weatherly Team" }],
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
