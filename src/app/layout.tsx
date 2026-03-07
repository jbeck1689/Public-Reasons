import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Practical Reasoning",
  description:
    "Learn to spot bad arguments, think under pressure, and reason clearly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
