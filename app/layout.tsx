import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zaref Studio — Creative, AI & Digital Marketing Studio",
  description: "Zaref Studio creates high-impact videos, AI content, social media campaigns, paid ads and WhatsApp automation to help businesses grow online.",
  keywords: ["video production", "AI content", "social media marketing", "digital marketing", "WhatsApp automation", "video editing", "paid ads"],
  openGraph: {
    title: "Zaref Studio — Creative, AI & Digital Marketing Studio",
    description: "Zaref Studio creates high-impact videos, AI content, social media campaigns, paid ads and WhatsApp automation to help businesses grow online.",
    url: "https://studio.zaref.in",
    siteName: "Zaref Studio",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zaref Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zaref Studio — Creative, AI & Digital Marketing Studio",
    description: "Zaref Studio creates high-impact videos, AI content, social media campaigns, paid ads and WhatsApp automation to help businesses grow online.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
