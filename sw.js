// Change this to your repository name
var GHPATH = '/mindful_tap';

// Choose a different app prefix name
var APP_PREFIX = 'mft_';

// The version of the cache. Every time you change any of the files
// you need to change this version (version_01, version_02…).
// If you don't change the version, the service worker will give your
// users the old files!
var VERSION = 'version_06';

// The files to make available for offline use. make sure to add
// others to this list
var URLS = [
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/icon.svg`,
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

// Activate event - clean up old caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX) === 0;
      });
      cacheWhitelist.push(CACHE_NAME);

      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('Deleting cache: ' + key);
          return caches.delete(key);
        }
      }));
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      if (response) {
        console.log('Serving from cache: ' + e.request.url);
        return response;
      }
      console.log('Fetching from network: ' + e.request.url);
      return fetch(e.request);
    })
  );
});
