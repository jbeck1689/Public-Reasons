import type { Metadata } from "next";
import Providers from "@/components/auth/Providers";
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
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-700 focus:text-stone-100 focus:rounded"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
