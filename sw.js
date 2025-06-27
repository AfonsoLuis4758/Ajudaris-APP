const CACHE_STATIC_NAME = "static-v1";
const CACHE_DYNAMIC_NAME = "dynamic-v1";


self.addEventListener("install", function (e) {
    e.waitUntil(
        caches.open(CACHE_STATIC_NAME).then(function (cache) {
            return cache.addAll([
                "/offline.html",
                "/index.css",
                "assets/Ajudaris.png",
                "assets/file-earmark.svg",
                "assets/file-image.svg",
                "assets/file-refresh.svg",
                "assets/gear-fill.svg",
                "assets/house.svg",
                "assets/icon512_maskable.png",
                "assets/icon512_rounded.png",
                "assets/image-refresh.svg",
                "assets/pencil.svg",
                "assets/person.svg",
                "assets/shield.svg",
                "assets/trash.svg",
                "assets/upload.svg"
            ]);
        })
    );
});

self.addEventListener("fetch", function (e) {
    async function handleNavigationRequest(request) {
        try {
            const networkResponse = await fetch(request);
            return networkResponse;
        } catch (error) {
            console.log("Fetch failed; returning offline page instead.", error);

            const cache = await caches.open(CACHE_STATIC_NAME);
            const cachedResponse = await cache.match(OFFLINE_URL);
            return cachedResponse;
        }
    }

    if (e.request.mode === "navigate") {
        e.respondWith(handleNavigationRequest(e.request));
    } else {
        e.respondWith(
            caches.match(e.request).then(function (response) {
                if (response) {
                    return response;
                } else {
                    return fetch(e.request)
                        .then(function (res) {
                            return caches.open(CACHE_DYNAMIC_NAME).then(function (cache) {
                                cache.put(e.request.url, res.clone());
                                return res;
                            });
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                }
            })
        );
    }
});