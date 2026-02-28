import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Our new Navbar

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// The custom title for your project
export const metadata: Metadata = {
  title: "Hyperlocal Blood Donor Network",
  description: "Find blood donors nearby in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* The Navbar goes inside the body, above your page content */}
        <Navbar />
        
        {/* The rest of your pages will render inside this main tag */}
        <main>{children}</main>
      </body>
    </html>
  );
}