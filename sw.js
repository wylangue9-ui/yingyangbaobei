const CACHE_NAME = 'yingyangbaobei-v1';
const ASSETS = [
  './',
  './营养宝贝.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.2.0/dist/tabler-icons.min.css',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;900&display=swap'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(ASSETS);
    }).catch(function(err){
      console.log('Cache addAll error (some external assets may fail):', err);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_NAME; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  e.respondWith(
    caches.match(e.request).then(function(cached){
      if(cached) return cached;
      return fetch(e.request).then(function(response){
        if(!response || response.status !== 200 || response.type === 'opaque'){
          return response;
        }
        var toCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache){
          cache.put(e.request, toCache);
        });
        return response;
      }).catch(function(){
        // offline fallback: return main page
        return caches.match('./营养宝贝.html');
      });
    })
  );
});
