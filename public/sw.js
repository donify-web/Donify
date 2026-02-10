self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Donify';
  const options = {
    body: data.body || 'Tu impacto está generando cambios.',
    icon: '/logo.svg',
    badge: '/logo.svg',
    data: { url: data.url || '/app' }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If there is already a window open, focus it
      if (windowClients.length > 0) {
        windowClients[0].focus();
      } else {
        // Otherwise open a new window
        clients.openWindow(event.notification.data.url);
      }
    })
  );
});