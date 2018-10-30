/*const staticCacheName = "";
const urlsToCache = [
    '/',
    '/index.html',
    'imgs/img1.jpg',
    'css/index.css',
    'js/app.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(staticCacheName)
        .then((cache) => cache.addAll(urlsToCache))
    )
});
  
self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.filter((cacheName) => {
            return cacheName.startsWith('currency-converter-') &&
              cacheName !== staticCacheName;
          }).map(cacheName => caches.delete(cacheName))
        );
      })
    );
});
  
self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          const fetchRequest = event.request.clone();
  
          return fetch(fetchRequest).then(
            (response) => {
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                }); 
              return response;
            }
          )
        })
    )
});
  
self.addEventListener('message', (event) => {
    if (event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
});*/