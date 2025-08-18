import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";



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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Ensure <html> has either "light" or "dark" BEFORE hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  try {
    var saved = localStorage.getItem('theme'); // 'dark' | 'light' | null
    var sysDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = saved ? saved : (sysDark ? 'dark' : 'light');
    var root = document.documentElement;
    root.classList.remove('dark','light');
    root.classList.add(theme);
  } catch (e) {}
})();
            `,
          }}
        />
        <link rel="icon" href="/favicon.jpg" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        value={{ light: "light", dark: "dark" }} // ← important
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>

        <Toaster richColors closeButton position="bottom-right" />
      </body>
    </html>
  );
}
