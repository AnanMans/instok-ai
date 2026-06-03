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
  title: "Instok — حوّل الواتساب إلى متجر حقيقي",
  description: "ارفع صور منتجاتك فقط، وInstok يبني المتجر ويجهز المنتجات تلقائياً.",
  verification: {
    google: 'wm3zYBFjHOfVR91ufjE1xtbZUEC0O7oJzXV4piBi6fE',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ overflowX: 'clip', width: '100%', maxWidth: '100%', margin: 0 }}>{children}</body>
    </html>
  );
}
