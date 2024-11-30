"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNavigation from "@/components/BottomNavigation";
import PWAPrompt from "@/components/PWAPrompt";
import OneSignal from "react-onesignal";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  useEffect(() => {
    const initOneSignal = async () => {
      try {
        await OneSignal.init({
          appId: "a9308328-24d7-479b-b830-65530fa31331", // Replace with your OneSignal App ID
          allowLocalhostAsSecureOrigin: true, // Remove this in production
          notifyButton: {
            enable: true,
          },
          serviceWorker: {
            path: "/onesignal/", // This will look for OneSignal's service worker in /public/onesignal/
          },
        });

        // Prompt user for notification permissions
        OneSignal.showSlidedownPrompt();
      } catch (error) {
        console.error("OneSignal initialization error:", error);
      }
    };

    initOneSignal();
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Driver App" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="onesignal" content="wordpress-plugin" />
      </head>
      <body className={inter.className}>
        <main className="pb-16">{children}</main>
        <BottomNavigation />
        <PWAPrompt />
      </body>
    </html>
  );
}
