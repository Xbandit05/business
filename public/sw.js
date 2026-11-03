/**
 * AgriBridge Rwanda - Offline Service Worker
 * Ensures the entire application shell, farming knowledge base, and offline AI interface
 * remain 100% accessible even when farmers have no internet connection.
 */

const CACHE_NAME = 'agribridge-offline-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
];

// Install Event: Precaches essential application shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Cleans up obsolete caches and claims clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Stale-While-Revalidate for app shell & scripts; Network-First with offline fallback for APIs
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignore non-GET requests or WebSocket requests
  if (event.request.method !== 'GET') return;
  if (url.protocol.startsWith('ws')) return;

  // For API calls (e.g. /api/chat, /api/tts): Network first, if offline return a friendly JSON response
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({
            offline: true,
            message: 'You are currently offline. AgriBridge Local Knowledge Base is answering your request.',
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // For Google Fonts or static assets: Cache First with Background Refresh
  if (url.hostname.includes('googleapis') || url.hostname.includes('gstatic')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return (
          cached ||
          fetch(event.request).then((response) => {
            if (response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return response;
          })
        );
      })
    );
    return;
  }

  // For HTML navigation: Network first, fallback to cached index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // Standard static asset handling: Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
