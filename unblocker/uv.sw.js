importScripts('https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet@2.6.3/dist/uv.bundle.js');
importScripts('https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet@2.6.3/dist/uv.handler.js');
importScripts('/Math-notes/unblocker/uv.config.js');

const sw = new UVServiceWorker();

self.addEventListener('fetch', event => {
  event.respondWith(
    (async () => {
      if (sw.route(event)) {
        try {
          return await sw.fetch(event);
        } catch (e) {
          return new Response('Proxy error: ' + e.message, { status: 500 });
        }
      }
      return fetch(event.request);
    })()
  );
});
