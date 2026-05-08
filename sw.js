const CACHE_NAME = "medical-openclaw-demo-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./js/data/mock.js",
  "./js/core/config.js",
  "./js/core/http.js",
  "./js/domain/patientStats.js",
  "./js/services/patientService.js",
  "./js/viewModels/patientViewModel.js",
  "./js/ai/contextBuilder.js",
  "./js/ai/skillResultMapper.js",
  "./js/services/openclawService.js",
  "./js/presentation/app.js",
  "./js/presentation/shell.js",
  "./manifest.webmanifest",
  "./assets/app-icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => caches.match("./index.html"));
    })
  );
});
