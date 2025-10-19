import {
  ClerkProvider,
} from '@clerk/nextjs'
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ToastContainer } from 'react-toastify';
import NextTopLoader from 'nextjs-toploader';

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Image Studios - Free Stock Photos & Videos",
  description: "Search and discover millions of free stock photos and videos powered by Pexels API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="light">
        <body className={`${lexend.className} antialiased`}>
          <NextTopLoader
            color="#5B4FE5"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #5B4FE5,0 0 5px #5B4FE5"
          />
          {children}
          <SpeedInsights />
        </body>
      </html>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </ClerkProvider>
  );
}
