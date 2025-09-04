"use client";

import { useEffect } from "react";
import { toast } from "sonner";

// Type for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Register service worker
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("ServiceWorker registered:", registration);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute

          // Listen for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  toast.info("New version available! Refresh to update.", {
                    duration: 10000,
                    action: {
                      label: "Refresh",
                      onClick: () => window.location.reload(),
                    },
                  });
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("ServiceWorker registration failed:", error);
        });

      // Handle offline/online events
      window.addEventListener("online", () => {
        toast.success("You're back online!");
      });

      window.addEventListener("offline", () => {
        toast.error("You're offline. Data will sync when connection is restored.");
      });

      // Handle app install prompt
      let deferredPrompt: BeforeInstallPromptEvent | null = null;
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredPrompt = e as BeforeInstallPromptEvent;
        
        // Show install button/banner after 30 seconds
        setTimeout(() => {
          if (deferredPrompt) {
            toast.info("Install Expense Tracker for quick access!", {
              duration: 10000,
              action: {
                label: "Install",
                onClick: async () => {
                  if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    if (outcome === "accepted") {
                      toast.success("App installed successfully!");
                    }
                    deferredPrompt = null;
                  }
                },
              },
            });
          }
        }, 30000);
      });

      // Handle app installed event
      window.addEventListener("appinstalled", () => {
        toast.success("Expense Tracker has been installed!");
        deferredPrompt = null;
      });
    }
  }, []);

  return null;
}
