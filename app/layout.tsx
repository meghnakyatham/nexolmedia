import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexol Media — Revenue Engines for Service Businesses",
  description: "We help businesses scale revenue through strategic content, high-performance video editing, and data-driven Meta advertising systems.",
  keywords: "Meta Ads Agency, Content Marketing, Lead Generation, Service Business Marketing, Video Editing",
  openGraph: {
    title: "Nexol Media — Revenue Engines for Service Businesses",
    description: "Strategic content, ads & automation for service businesses. Trusted by 40+ clients.",
    url: "https://nexolmedia.com",
    siteName: "Nexol Media",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexol Media — Revenue Engines for Service Businesses",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}