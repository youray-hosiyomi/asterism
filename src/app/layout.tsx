import Provider from "@/providers/provider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YOURAY HOSIYOMI🌠",
  description: "yourayのホームページ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" data-theme="light">
      <body className={inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
