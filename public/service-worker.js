/* eslint-disable no-restricted-globals */

// Cache names (APP_SHELL_CACHE bumped to v2 to clear stale/stuck index.html & JS bundles)
const CACHE_NAME = "gospel-audio-cache-v1";
const OFFLINE_LIBRARY_CACHE = "offline-audio-v1";
const APP_SHELL_CACHE = "app-shell-cache-v1.0.4";

// App shell files to pre-cache for offline support
const APP_SHELL_FILES = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/favicon.ico",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-192-maskable.png",
  "/icons/icon-512-maskable.png",
];

// Audio file extension to cache
const AUDIO_FILE_EXTENSION = ".mp3";

/**
 * Build a proper 206 Partial Content (or 200 OK) response for mobile browsers
 * (iOS Safari and Android Chrome require byte-range responses for <audio>).
 */
async function buildAudioResponse(request, response) {
  if (!response) return response;

  const rangeHeader = request.headers.get("range");
  if (!rangeHeader) {
    return response;
  }

  try {
    const arrayBuffer = await response.clone().arrayBuffer();
    const total = arrayBuffer.byteLength;
    const bytesMatch = /^bytes=(\d+)-(\d+)?$/i.exec(rangeHeader.trim());

    if (!bytesMatch || total === 0) {
      return response;
    }

    const start = parseInt(bytesMatch[1], 10);
    const end = bytesMatch[2]
      ? Math.min(parseInt(bytesMatch[2], 10), total - 1)
      : total - 1;

    if (start >= total || start > end) {
      return new Response(null, {
        status: 416,
        statusText: "Requested Range Not Satisfiable",
        headers: {
          "Content-Range": `bytes */${total}`,
        },
      });
    }

    const sliced = arrayBuffer.slice(start, end + 1);
    return new Response(sliced, {
      status: 206,
      statusText: "Partial Content",
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "audio/mpeg",
        "Content-Length": String(sliced.byteLength),
        "Content-Range": `bytes ${start}-${end}/${total}`,
        "Accept-Ranges": "bytes",
      },
    });
  } catch (err) {
    console.warn("[Service Worker] Range slice failed, returning full response:", err);
    return response;
  }
}

/**
 * Look up an audio request across both the My Library cache and the general audio cache.
 */
async function findCachedAudio(request, url) {
  const cachesToSearch = [OFFLINE_LIBRARY_CACHE, CACHE_NAME];
  for (const name of cachesToSearch) {
    const cache = await caches.open(name);
    const matchByUrl =
      (await cache.match(request.url, { ignoreSearch: true })) ||
      (await cache.match(url.pathname, { ignoreSearch: true }));
    if (matchByUrl) {
      const contentType = matchByUrl.headers.get("content-type") || "";
      if (!contentType.toLowerCase().includes("text/html")) {
        return matchByUrl;
      }
    }
  }
  return null;
}

// -------------------------------------------------------
// INSTALL: pre-cache the app shell for offline support
// -------------------------------------------------------
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Install");
  event.waitUntil(
    caches
      .open(APP_SHELL_CACHE)
      .then(async (cache) => {
        console.log("[Service Worker] Pre-caching app shell");
        // Fetch fresh copies bypassing browser HTTP cache so stale index.html is never installed
        await Promise.allSettled(
          APP_SHELL_FILES.map(async (fileUrl) => {
            const res = await fetch(fileUrl, { cache: "reload" });
            if (res.ok) {
              await cache.put(fileUrl, res);
            }
          })
        );

        // Also pre-cache built JS/CSS bundles from asset-manifest.json so offline works after first visit
        try {
          const manifestResponse = await fetch("/asset-manifest.json", {
            cache: "reload",
          });
          if (manifestResponse.ok) {
            const manifest = await manifestResponse.json();
            const assetUrls = Object.values(manifest.files || {}).filter(
              (fileUrl) =>
                typeof fileUrl === "string" &&
                !fileUrl.endsWith(".map") &&
                !APP_SHELL_FILES.includes(fileUrl)
            );
            await Promise.allSettled(
              assetUrls.map(async (assetUrl) => {
                const res = await fetch(assetUrl, { cache: "reload" });
                const ct = res.headers.get("content-type") || "";
                if (res.ok && !ct.toLowerCase().includes("text/html")) {
                  await cache.put(assetUrl, res);
                }
              })
            );
          }
        } catch (e) {
          console.warn("[Service Worker] Could not pre-cache asset-manifest:", e);
        }
      })
      .then(() => self.skipWaiting())
  );
});

// Listen for skip waiting message from the app
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// -------------------------------------------------------
// ACTIVATE: clean up old caches (preserving offline-audio-v1!)
// -------------------------------------------------------
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activate");
  const validCaches = [CACHE_NAME, OFFLINE_LIBRARY_CACHE, APP_SHELL_CACHE];
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

  // 1. Audio files: Cache-first strategy with mobile Range (206) support
  if (url.pathname.endsWith(AUDIO_FILE_EXTENSION)) {
    event.respondWith(
      (async () => {
        try {
          const cachedResponse = await findCachedAudio(request, url);
          if (cachedResponse) {
            console.log("[Service Worker] Serving audio from cache:", request.url);
            return await buildAudioResponse(request, cachedResponse);
          }

          console.log("[Service Worker] Fetching audio from network:", request.url);
          // Fetch without Range header so we get a 200 OK full response that Cache API accepts
          const networkResponse = await fetch(request.url);

          const contentType = networkResponse.headers.get("content-type") || "";
          if (
            networkResponse.ok &&
            networkResponse.status === 200 &&
            !contentType.toLowerCase().includes("text/html")
          ) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request.url, networkResponse.clone());
          }

          return await buildAudioResponse(request, networkResponse);
        } catch (err) {
          console.error("[Service Worker] Error fetching audio:", err);
          return new Response("Offline - audio not available in cache", {
            status: 503,
            statusText: "Service Unavailable",
          });
        }
      })()
    );
    return;
  }

  // 2. HTML navigation requests: Network-first, updating cached index.html when online
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(APP_SHELL_CACHE).then((cache) => {
              cache.put("/index.html", responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          console.log("[Service Worker] Offline - serving cached index.html");
          return caches.match("/index.html");
        })
    );
    return;
  }

  // 3. App shell assets (JS, CSS, icons): Cache-first, guarding against SPA HTML fallback poisoning
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
        if (cachedResponse) {
          const cachedCt = cachedResponse.headers.get("content-type") || "";
          if (!cachedCt.toLowerCase().includes("text/html")) {
            return cachedResponse;
          }
        }
        return fetch(request).then((networkResponse) => {
          const netCt = networkResponse.headers.get("content-type") || "";
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            !netCt.toLowerCase().includes("text/html")
          ) {
            const responseClone = networkResponse.clone();
            caches.open(APP_SHELL_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 4. Everything else: network only (API calls, Firebase, etc.)
  // Just let the browser handle it normally
});
