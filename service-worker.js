const CACHE = "gbcontrol-v1";

const archivos = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./dashboard.js",
    "./pcs.js",
    "./tiempo.js",
    "./socket.js",
    "./reloj.js"
];

self.addEventListener("install", evento => {
    evento.waitUntil(
        caches.open(CACHE)
        .then(cache => cache.addAll(archivos))
    );
});


self.addEventListener("fetch", evento => {

    evento.respondWith(
        caches.match(evento.request)
        .then(respuesta => respuesta || fetch(evento.request))
    );

});