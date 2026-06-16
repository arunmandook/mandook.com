import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Arun Mandook — IT & IT Services Professional",
  description:
    "Portfolio of Arun Mandook, an IT professional with 15+ years of experience in information technology and IT services — cloud, software, DevOps, security, and managed IT.",
  keywords: [
    "IT services",
    "information technology",
    "cloud",
    "DevOps",
    "software development",
    "IT consulting",
    "Arun Mandook",
  ],
  openGraph: {
    title: "Arun Mandook — IT & IT Services Professional",
    description:
      "15+ years delivering software, cloud, and managed IT services. Get in touch for your next project.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
