const CACHE_NAME = 'silvester-v2';
const assets = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com'
];

// Instalação
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Adicionamos um log para você ver se ele baixou tudo
      console.log('Cacheando arquivos do Silvester...');
      return cache.addAll(assets);
    })
  );
});

// Ativação (limpa caches antigos)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    })
  );
});

// Estratégia: Tenta o Cache primeiro, se não tiver, vai na Rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
          // Se falhar tudo (offline total), tenta retornar o index.html
          return caches.match('./index.html');
      });
    })
  );
});
