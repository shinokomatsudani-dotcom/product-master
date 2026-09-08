import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { DevPanel } from "@/components/dev-panel";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "商品マスタ管理",
  description: "在庫担当者向けの商品マスタ管理画面",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/gen-interface-jp@latest/cdn/400.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/gen-interface-jp@latest/cdn/500.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/gen-interface-jp@latest/cdn/700.css"
        />
      </head>
      <body className="flex h-full min-h-screen flex-col overflow-y-auto bg-muted/30">
        {children}
        <Toaster />
        {process.env.NODE_ENV !== "production" && <DevPanel />}
      </body>
    </html>
  );
}
