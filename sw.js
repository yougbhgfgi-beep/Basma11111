const CACHE_NAME = 'basma-design-v3';

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.map(function(name) { return caches.delete(name); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).then(function(fetchRes) {
      if (fetchRes && fetchRes.status === 200) {
        var clone = fetchRes.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, clone);
        });
      }
      return fetchRes;
    }).catch(function() {
      return caches.match(event.request);
    })
  );
});
