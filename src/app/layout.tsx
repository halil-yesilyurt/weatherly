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
  title: "Weatherly - Beautiful Weather App",
  description: "A clean and modern weather app providing real-time weather data and forecasts",
  keywords: "weather, forecast, temperature, climate, weatherly",
  authors: [{ name: "Weatherly Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
