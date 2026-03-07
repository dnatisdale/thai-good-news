/* eslint-disable no-restricted-globals */

// Cache names
const CACHE_NAME = "gospel-audio-cache-v1";
const APP_SHELL_CACHE = "app-shell-cache-v1";

// App shell files to pre-cache for offline support
const APP_SHELL_FILES = [
  "/",
  "/index.html",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-192-maskable.png",
  "/icons/icon-512-maskable.png",
];

// Audio file extension to cache
const AUDIO_FILE_EXTENSION = ".mp3";

// -------------------------------------------------------
// INSTALL: pre-cache the app shell for offline support
// -------------------------------------------------------
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Install");
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => {
      console.log("[Service Worker] Pre-caching app shell");
      return cache.addAll(APP_SHELL_FILES);
    }).then(() => self.skipWaiting())
  );
});

// Listen for skip waiting message from the app
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// -------------------------------------------------------
// ACTIVATE: clean up old caches
// -------------------------------------------------------
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activate");
  const validCaches = [CACHE_NAME, APP_SHELL_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!validCaches.includes(cacheName)) {
              console.log("[Service Worker] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// -------------------------------------------------------
// FETCH: strategy depends on request type
// -------------------------------------------------------
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Audio files: Cache-first strategy
  if (url.pathname.endsWith(AUDIO_FILE_EXTENSION)) {
    console.log("[Service Worker] Fetching audio:", request.url);
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log("[Service Worker] Serving audio from cache:", request.url);
            return cachedResponse;
          }
          console.log("[Service Worker] Fetching audio from network:", request.url);
          return fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          }).catch((err) => {
            console.error("[Service Worker] Error fetching audio:", err);
          });
        });
      })
    );
    return;
  }

  // 2. HTML navigation requests: Network-first with offline fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => {
        console.log("[Service Worker] Offline - serving cached index.html");
        return caches.match("/index.html");
      })
    );
    return;
  }

  // 3. App shell assets (JS, CSS, icons): Cache-first
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith("/static/") ||
      url.pathname.startsWith("/icons/") ||
      url.pathname.endsWith(".js") ||
      url.pathname.endsWith(".css") ||
      url.pathname.endsWith(".png") ||
      url.pathname.endsWith(".ico"))
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return cachedResponse || fetch(request).then((networkResponse) => {
          return caches.open(APP_SHELL_CACHE).then((cache) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // 4. Everything else: network only (API calls, Firebase, etc.)
  // Just let the browser handle it normally
});
