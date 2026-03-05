importScripts("https://cdn.jsdelivr.net/gh/Destroyed12121/Staticsj@main/JS/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadSW();
const sw = new ScramjetServiceWorker();

self.addEventListener("fetch", (event) => {
  if (sw.route(event)) {
    event.respondWith(sw.fetch(event));
  }
});
