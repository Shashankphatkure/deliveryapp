import { Inter } from "next/font/google";
import "./globals.css";
import BottomNavigation from "@/components/BottomNavigation";
import PWAPrompt from "@/components/PWAPrompt";
import { Viewport } from "next";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
  themeColor: "#000000", // Adjust color as needed
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export const metadata = {
  title: "Driver App",
  description: "Delivery Driver Application",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Driver App",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    shortcut: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Driver App" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={inter.className}>
        <main className="pb-16">{children}</main>
        <BottomNavigation />
        <PWAPrompt />
      </body>
    </html>
  );
}
