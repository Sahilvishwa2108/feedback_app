'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Register service worker for PWA functionality
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, inform the user
                  console.log('New content is available; please refresh.');
                  
                  // You could show a toast notification here
                  if (confirm('New version available! Refresh to update?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });

      // Listen for app install prompt
      let deferredPrompt: any;
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        
        // You can show a custom install button here
        console.log('PWA install prompt available');
      });

      // Handle app installation
      window.addEventListener('appinstalled', (evt) => {
        console.log('PWA was installed successfully');
      });
    }
  }, []);

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}



