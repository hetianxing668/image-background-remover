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
  title: "BG Remover — Free AI Background Removal",
  description:
    "Remove image backgrounds instantly with AI. Upload any photo and get a transparent PNG in seconds. No signup required. Free to use.",
  keywords: ["background removal", "remove background", "transparent png", "AI", "image editing"],
  openGraph: {
    title: "BG Remover — Free AI Background Removal",
    description:
      "Remove image backgrounds instantly with AI. Upload any photo and get a transparent PNG in seconds.",
    type: "website",
  },
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
      <body className="h-full">{children}</body>
    </html>
  );
}
