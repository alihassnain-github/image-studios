import {
  ClerkProvider,
} from '@clerk/nextjs'
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { ToastProvider } from '@/contexts/ToastContext';

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Image Studio - Free Stock Photos & Videos",
  description: "Search and discover millions of free stock photos and videos powered by Pexels API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ToastProvider>
        <html lang="en" data-theme="light">
          <body className={`${lexend.className} antialiased`}>
            {children}
          </body>
        </html>
      </ToastProvider>
    </ClerkProvider>
  );
}
