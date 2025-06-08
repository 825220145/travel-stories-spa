const CACHE_NAME = 'app-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/styles.css',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  '/src/app.js',
  '/src/router.js',
  '/src/components/Header.js',
  '/src/components/Footer.js',
  // Tambahkan file lain yang perlu di-cache
];

// Install event - caching files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching app shell');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Activate event - remove old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve files from cache or network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});

// Push event - receive and display push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/icon-512x512.png'
  };

  event.waitUntil(
    self.registration.showNotification('New Notification', options)
  );
});
