import type { Metadata } from "next";
import "@equos/react/dist/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Equos.ai Next.js Example",
  description: "Start a conversation with an Equos character.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
