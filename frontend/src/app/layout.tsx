import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import SocialDock from '@/components/SocialDock';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beavers Family Care",
  description: "Healthcare Reimagined in Kajiado County",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}>
        {/* Main Content */}
        <main>{children}</main>
        
        {/* Global Components */}
        <Footer />
        
        {/* Floating Components - Placed at the end to ensure they stay on top */}
        <div className="relative z-[9999]">
          <Chatbot />
          <SocialDock />
        </div>
      </body>
    </html>
  );
}