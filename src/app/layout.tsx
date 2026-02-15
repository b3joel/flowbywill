import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlowState - ADHD Focus Timer",
  description: "A calming, ADHD-friendly productivity timer that respects your flow state. No anxiety-inducing countdowns, just gentle progress tracking.",
  keywords: ["ADHD", "focus", "timer", "productivity", "pomodoro", "flow state", "attention"],
  authors: [{ name: "FlowState Team" }],
  icons: {
    icon: "/icon-512x512.png",
    apple: "/icon-512x512.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "FlowState - ADHD Focus Timer",
    description: "A calming, ADHD-friendly productivity timer that respects your flow state",
    url: "https://flowstate.app",
    siteName: "FlowState",
    type: "website",
    images: [
      {
        url: "/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "FlowState Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "FlowState - ADHD Focus Timer",
    description: "A calming, ADHD-friendly productivity timer that respects your flow state",
    images: ["/icon-512x512.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FlowState",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-512x512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
