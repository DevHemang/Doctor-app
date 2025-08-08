import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import HomePage from "./page";
import { Lato } from "next/font/google";
import Footer from "./components/Footer";


const geistSans = Geist({
  variable: "--Lato, sans-serif",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--Lato, sans-serif",
  subsets: ["latin"],
});

export const lato = Lato({
  subsets: ['latin'],
  variable: '--font-lato', 
  weight: ['400', '700'],  
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Find your Doctor",
  description: "Get appointments at your fingertips at your desired time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable}`}>
      <Header />
        {children}
        <Footer />
       
      </body>
    </html>
  );
}
