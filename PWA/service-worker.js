const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
    'index.html',
    'app.js',
    'styles.css',
    'icons/logo_192.png',
    'icons/logo_512.png'
];

const DATA_CACHE = "data-cache-v1";

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest)
                    .then(response => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type === 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        // Save response data to cache
                        saveResponseToCache(event.request, responseToCache);

                        return response;
                    })
                    .catch(error => {
                        // If fetch fails, try to retrieve data from cache
                        return getResponseFromCache(event.request);
                    });
            });
        })
    );
});

function saveResponseToCache(request, response) {
    // Only cache responses for GET requests
    if (request.method !== 'GET') {
        return;
    }

    return caches.open(DATA_CACHE)
        .then(cache => {
            // Store the response in the cache keyed by the request
            cache.put(request, response.clone());
        });
}

function getResponseFromCache(request) {
    return caches.open(DATA_CACHE)
        .then(cache => {
            // Retrieve the response from the cache for the request
            return cache.match(request)
                .then(response => {
                    if (response) {
                        return response;
                    }
                    
                    return new Response(JSON.stringify({ error: 'Response not found in cache' }), { status: 200, statusText: 'Not Found' });
                });
        });
}

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.filter(cacheName => {
                        // Delete outdated caches
                        return cacheName.startsWith('my-pwa-cache-') && cacheName !== CACHE_NAME;
                    }).map(cacheName => {
                        return caches.delete(cacheName);
                    })
                );
            })
    );
});

self.addEventListener('push', event => {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: 'icons/logo_192.png'
    });
});
