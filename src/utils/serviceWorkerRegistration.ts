// Service Worker Registration Utility
// Uses vite-plugin-pwa for automatic service worker management

import { registerSW } from 'virtual:pwa-register';

type Config = {
  onSuccess?: () => void;
  onUpdate?: () => void;
};

export function register(config?: Config) {
  const updateSW = registerSW({
    onRegistered(registration) {
      console.log('[SW] Service Worker registered:', registration);
    },
    onRegisterError(error) {
      console.error('[SW] Service Worker registration error:', error);
    },
    onNeedRefresh() {
      console.log('[SW] New content available, please refresh.');
      if (config?.onUpdate) {
        config.onUpdate();
      }
    },
    onOfflineReady() {
      console.log('[SW] App is ready to work offline.');
      if (config?.onSuccess) {
        config.onSuccess();
      }
    },
  });

  // Return the update function in case it's needed
  return updateSW;
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        console.log('[SW] Service Worker unregistered');
      })
      .catch((error) => {
        console.error('[SW] Error unregistering service worker:', error);
      });
  }
}
