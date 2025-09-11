import type { Metadata } from "next";
import { Funnel_Display, Funnel_Sans } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import { Header } from "@/components/header";
import { cn } from "@/lib/utils";

const funnel = Funnel_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-funnel",
});

const funnelSans = Funnel_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-funnel-sans",
});

export const metadata: Metadata = {
  title: "Equos.ai Nextjs Examples",
  description: "Give a face to your AI agents with Equos.ai.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(funnel.variable, funnelSans.variable, "antialiased")}>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
