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
  description: "Healthcare Reimagined",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen`}>
        {/* The main website content */}
        <div id="main-content">
          {children}
          <Footer />
        </div>
        
        {/* THE UTILITY LAYER: Forced to the top */}
        <div id="utility-layer" className="fixed inset-0 pointer-events-none z-[99999]">
          <div className="absolute inset-0 pointer-events-auto">
            <Chatbot />
            <SocialDock />
          </div>
        </div>
      </body>
    </html>
  );
}