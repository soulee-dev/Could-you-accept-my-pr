import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Could you accept my pr?",
  description: "Please accept my PR!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex flex-col min-h-screens justify-between items-center p-8 md:p-12">
          {children}
        </main>
        <GoogleAnalytics gaId="G-Y1ZMMP4VNW" />
      </body>
    </html>
  );
}
