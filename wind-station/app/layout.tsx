import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weather Station - Dashboard",
  description: "IoT Weather Monitoring Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Sidebar />
        <div id="overlay"></div>
        <main className="lg:ml-64 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}