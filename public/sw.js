// Service Worker for Weather Forecast App
// Enables full offline support including page refreshes

const CACHE_VERSION = 'v2';
const STATIC_CACHE = `weather-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `weather-dynamic-${CACHE_VERSION}`;

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.error('[SW] Failed to cache some static assets:', err);
        // Don't fail installation if some assets fail
      });
    })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== STATIC_CACHE &&
            cacheName !== DYNAMIC_CACHE
          ) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  return self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Skip Vite dev server requests (HMR, WebSocket, etc.)
  if (
    url.pathname.includes('@vite') ||
    url.pathname.includes('@react-refresh') ||
    url.pathname.includes('node_modules') ||
    url.pathname === '/client' ||
    url.pathname.endsWith('.tsx') ||
    url.pathname.endsWith('.ts')
  ) {
    return;
  }

  // Skip API requests - let them fail naturally so app can handle offline mode
  // The app uses localStorage for data caching with proper timestamps
  if (url.pathname.includes('/forecasts/')) {
    return;
  }

  // Static assets - Cache first, network fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log('[SW] Serving from cache:', url.pathname || url.href);
        return cachedResponse;
      }

      // Not in cache, fetch from network
      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses or errors
          if (!response || response.status !== 200) {
            return response;
          }

          // Cache both same-origin (basic) and cross-origin (cors/opaque) responses
          // This allows caching Google Fonts and other CDN resources
          const responseToCache = response.clone();

          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        })
        .catch((err) => {
          console.error('[SW] Fetch failed:', url.pathname || url.href, err);

          // Return cached index.html for navigation requests
          if (request.destination === 'document') {
            return caches.match('/index.html');
          }

          // For fonts that fail, return an empty response to prevent layout issues
          if (request.destination === 'font') {
            return new Response('', { status: 200, statusText: 'OK' });
          }

          // For stylesheets (like Google Fonts CSS), return empty CSS
          if (request.destination === 'style') {
            return new Response('', {
              status: 200,
              headers: { 'Content-Type': 'text/css' },
            });
          }

          throw err;
        });
    })
  );
});

// Listen for skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
