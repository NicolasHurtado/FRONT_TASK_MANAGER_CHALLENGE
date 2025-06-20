import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Providers
import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Task Manager - Organize Your Work",
  description: "A modern task management application built with Next.js and FastAPI",
  keywords: ["task manager", "productivity", "todo", "organization"],
  authors: [{ name: "Task Manager Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
