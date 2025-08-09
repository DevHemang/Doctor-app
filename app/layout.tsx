import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import HomePage from "./page";

import Footer from "./components/Footer";


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
      <body>
      <Header />
        {children}
        <Footer />
       
      </body>
    </html>
  );
}
