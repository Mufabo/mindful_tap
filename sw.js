// Change this to your repository name
var GHPATH = '/mindful_tap';

// Choose a different app prefix name
var APP_PREFIX = 'mft_';

// The version of the cache. Every time you change any of the files
// you need to change this version (version_01, version_02…).
// If you don't change the version, the service worker will give your
// users the old files!
var VERSION = 'version_09';

// The files to make available for offline use. make sure to add
// others to this list
var URLS = [
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/icon.svg`,
  `${GHPATH}/manifest.webmanifest`,
]

var CACHE_NAME = APP_PREFIX + VERSION;

// Install event - cache all specified URLs
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('Installing cache: ' + CACHE_NAME);
      return cache.addAll(URLS);
    })
  );
});

// Activate event - delete every cache of this app except the current version
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key.indexOf(APP_PREFIX) === 0 && key !== CACHE_NAME) {
          console.log('Deleting cache: ' + key);
          return caches.delete(key);
        }
      }));
    })
  );
});

// Fetch event - serve from the current cache, fall back to the network and
// store successful GET responses (e.g. the Tailwind CDN script and Google
// Fonts) so the app also renders correctly offline.
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(e.request).then(function (response) {
        if (response) {
          return response;
        }
        return fetch(e.request).then(function (networkResponse) {
          if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
            cache.put(e.request, networkResponse.clone());
          }
          return networkResponse;
        });
      });
    })
  );
});
