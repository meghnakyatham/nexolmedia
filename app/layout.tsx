import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexol Media — Revenue Engines for Service Businesses",
  description: "We help businesses scale revenue through strategic content, high-performance video editing, and data-driven Meta advertising systems. Trusted by 40+ clients.",
  keywords: "Meta Ads Agency, Content Marketing, Lead Generation, Service Business Marketing, Video Editing",
  openGraph: {
    title: "Nexol Media — Revenue Engines for Service Businesses",
    description: "Strategic content, ads and automation for service businesses. Trusted by 40+ clients.",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700,800,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
