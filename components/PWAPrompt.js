"use client";
import { useState, useEffect } from "react";

export default function PWAPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker
          .register("/sw.js")
          .then(function (registration) {
            console.log("ServiceWorker registration successful");
          })
          .catch(function (err) {
            console.log("ServiceWorker registration failed: ", err);
          });
      });
    }

    // Handle PWA install prompt
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    });
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;

    setShowPrompt(false);
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      }
      setDeferredPrompt(null);
    });
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Install App</h3>
          <p className="text-sm text-gray-600">
            Add to your home screen for quick access
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowPrompt(false)}
            className="px-3 py-1.5 text-sm text-gray-600"
          >
            Later
          </button>
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
