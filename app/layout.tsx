import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import dynamic from "next/dynamic";
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
  title: "Shrey's Palace",
  description: "Built by Shreyaj Yadav",
};

const HelloSplash = dynamic(() => import("@/components/hellosplash"), { ssr: true });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HelloSplash step={160} hold={600}>
          {children}
        </HelloSplash>
        <Toaster richColors closeButton position="bottom-right" />
      </body>
    </html>
  );
}
