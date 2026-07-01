import type { Metadata, Viewport } from "next";
import { Fira_Sans, Playpen_Sans } from "next/font/google";
import { ScaleManager } from "@/components/ScaleManager";
import "./globals.css";

const firaSans = Fira_Sans({
  variable: "--font-fira-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const playpenSans = Playpen_Sans({
  variable: "--font-playpen-sans",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: "Picky",
  description: "Meal planning for real families",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${firaSans.variable} ${playpenSans.variable}`}>
      <body>
        <ScaleManager />
        <div className="app-frame">
          {children}
        </div>
      </body>
    </html>
  );
}
