/* eslint-disable no-restricted-globals */

// Cache names (bumped to v2 to clear any broken cached states)
const CACHE_NAME = "gospel-audio-cache-v2";
const APP_SHELL_CACHE = "app-shell-cache-v2";

// 1. Add your sample MP3 path here so it downloads automatically on install
const APP_SHELL_FILES = [
  "/",
  "/index.html",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-192-maskable.png",
  "/icons/icon-512-maskable.png",
  // Example: "/audio/sample.mp3" (Update this with your actual sample filename/path)
];

const AUDIO_FILE_EXTENSION = ".mp3";

// -------------------------------------------------------
// INSTALL: Pre-cache app shell and sample audio
// -------------------------------------------------------
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Install v2");
  event.waitUntil(
    caches
      .open(APP_SHELL_CACHE)
      .then((cache) => {
        console.log("[Service Worker] Pre-caching app shell & assets");
        return cache.addAll(APP_SHELL_FILES);
      })
      .then(() => self.skipWaiting())
  );
});

// -------------------------------------------------------
// MESSAGE: Skip waiting on prompt
// -------------------------------------------------------
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// -------------------------------------------------------
// ACTIVATE: Clean up older v1 caches
// -------------------------------------------------------
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activate");
  const validCaches = [CACHE_NAME, APP_SHELL_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((name) => {
            if (!validCaches.includes(name)) {
              console.log("[Service Worker] Deleting old cache:", name);
              return caches.delete(name);
            }
            return null;
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// -------------------------------------------------------
// AUDIO RANGE HANDLER (Handles Android Chrome 206 Streaming)
// -------------------------------------------------------
async function handleAudioFetch(request) {
  const cache = await caches.open(CACHE_NAME);
  const url = request.url;

  // Check if we have the full audio in cache
  let cachedResponse = await cache.match(url);

  if (!cachedResponse) {
    try {
      // Fetch cleanly WITHOUT Range headers so server returns 200 OK (cacheable)
      const cleanRequest = new Request(url, { headers: {} });
      const networkResponse = await fetch(cleanRequest);

      if (networkResponse.status === 200) {
        await cache.put(url, networkResponse.clone());
        cachedResponse = networkResponse;
      } else {
        return networkResponse;
      }
    } catch (err) {
      console.error("[Service Worker] Offline & audio not in cache:", err);
      return new Response("Audio unavailable offline", { status: 503 });
    }
  }

  // Handle byte-range slicing required by mobile browsers
  const rangeHeader = request.headers.get("range");
  if (!rangeHeader) {
    return cachedResponse;
  }

  const arrayBuffer = await cachedResponse.arrayBuffer();
  const total = arrayBuffer.byteLength;

  // Parse "bytes=start-end"
  const parts = rangeHeader.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : total - 1;

  const chunk = arrayBuffer.slice(start, end + 1);

  return new Response(chunk, {
    status: 206,
    statusText: "Partial Content",
    headers: [
      ["Content-Type", "audio/mpeg"],
      ["Content-Range", `bytes ${start}-${end}/${total}`],
      ["Content-Length", chunk.byteLength],
      ["Accept-Ranges", "bytes"],
    ],
  });
}

// -------------------------------------------------------
// FETCH ROUTING
// -------------------------------------------------------
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Audio requests (MP3s)
  if (url.pathname.endsWith(AUDIO_FILE_EXTENSION)) {
    event.respondWith(handleAudioFetch(request));
    return;
  }

  // 2. HTML navigation
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/index.html"))
    );
    return;
  }

  // 3. Static assets (JS, CSS, icons, images)
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
        return (
          cachedResponse ||
          fetch(request).then((networkResponse) =>
            caches.open(APP_SHELL_CACHE).then((cache) => {
              cache.put(request, networkResponse.clone());
              return networkResponse;
            })
          )
        );
      })
    );
    return;
  }

  // 4. Default: Network only
});
