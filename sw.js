const CACHE_NAME = 'mairfim-cache-v3';
// Adiciona os arquivos essenciais do "app shell" para serem cacheados
const urlsToCache = [
  '/',
  '/index.html',
  '/icon.svg',
  '/manifest.json'
  // Arquivos TSX e outros assets são carregados pelo script do módulo,
  // o manipulador 'fetch' irá cacheá-los na primeira vez que forem carregados.
];

self.addEventListener('install', event => {
  // Executa os passos de instalação
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retorna a resposta do cache
        if (response) {
          return response;
        }

        // Clona a requisição para usá-la tanto no cache quanto para o navegador
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Verifica se recebemos uma resposta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona a resposta para usá-la tanto no cache quanto para o navegador
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Deletando caches antigos
          }
        })
      );
    })
  );
});