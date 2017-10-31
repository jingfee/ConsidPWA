var CACHE = 'BraCache';
var urlsToCache = [
    '/stylesheet.css',
    '/main.js',
    '/images/logo48.png',
    '/images/logo72.png',
    '/images/logo96.png',
    '/images/logo144.png',
    '/images/logo192.png'
];

self.addEventListener('intall', function(evt) {
    console.log('The service worker is being installed');

    evt.waitUntil(precache());
});

self.addEventListener('fetch', function(evt) {
    if(evt.request.url.includes('browser-sync')) {
        evt.respondWith(fetch(evt.request));
        return;
    }

    console.log(`The service worker is serving the asset: ${evt.request.url}`);

    evt.respondWith(fromCache(evt.request));
    evt.waitUntil(update(evt.request));
});

function precache() {
    return caches.open(CACHE).then(function(cache) {
        return cache.addAll(urlsToCache);
    });
}

function fromCache(request) {
    return caches.open(CACHE).then(function(cache) {
        return cache.match(request).then(function(matching) {
            if(!matching) {
                return Promise.reject('no-match');
            }
            
            console.log(`Found in cache: ${request.url}`);
            return matching;
        });
    });
}

function update(request) {
    return caches.open(CACHE).then(function(cache) {
        return fetch(request).then(function(response) {
            return cache.put(request, response);
        });
    });
}

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  
    const title = 'Push Codelab';
    const options = {
        body: event.data.text(),
        icon: 'images/logo48.png',
        badge: 'images/logo72.png'
    };
  
    event.waitUntil(self.registration.showNotification(title, options));
});