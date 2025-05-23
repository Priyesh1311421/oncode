import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from './components/auth/SessionProviderWrapper'; // Adjust path if needed
import Navbar from './components/layout/Navbar'; // Adjust path if needed

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 antialiased`}
      >
        <SessionProviderWrapper>
          <Navbar />
          <main className="container mx-auto p-4">
            {children}
          </main>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
