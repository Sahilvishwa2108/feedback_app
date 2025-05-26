const CACHE_NAME = 'mystery-message-v1';
const DB_NAME = 'MysteryMessage';
const DB_VERSION = 1;
const DB_STORE_NAME = 'apiStore';

// Assets to cache during installation
const CORE_ASSETS = [
  '/',
  '/dashboard',
  '/about',
  '/sign-in',
  '/sign-up',
  '/offline',
  '/manifest.webmanifest',
  '/icon-192x192.svg',
  '/icon-512x512.svg'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching core assets');
        return cache.addAll(CORE_ASSETS);
      })
      .catch((error) => {
        console.error('Failed to cache core assets:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// IndexedDB functions for API caching
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(DB_STORE_NAME)) {
        db.createObjectStore(DB_STORE_NAME, { keyPath: 'url' });
      }
    };
  });
}

async function cacheAPIResponse(url, data) {
  try {
    const db = await openDB();
    const transaction = db.transaction(DB_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(DB_STORE_NAME);
    
    const cacheData = {
      url,
      data: JSON.stringify(data),
      timestamp: Date.now()
    };
    
    await new Promise((resolve, reject) => {
      const request = store.put(cacheData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to cache API response:', error);
  }
}

async function getCachedAPIResponse(url) {
  try {
    const db = await openDB();
    const transaction = db.transaction(DB_STORE_NAME, 'readonly');
    const store = transaction.objectStore(DB_STORE_NAME);
    
    const result = await new Promise((resolve, reject) => {
      const request = store.get(url);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    if (result && result.data) {
      return JSON.parse(result.data);
    }
    return null;
  } catch (error) {
    console.error('Failed to get cached API response:', error);
    return null;
  }
}

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    const responseClone = networkResponse.clone();
    await cache.put(request, responseClone);
    return networkResponse;
  } catch (error) {
    console.error('Cache-first strategy failed:', error);
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline');
    }
    throw error;
  }
}

// Network-first strategy for API requests
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      const responseData = await responseClone.json();
      await cacheAPIResponse(request.url, responseData);
      return networkResponse;
    }
    
    throw new Error('Network response was not ok');
  } catch (error) {
    console.error('Network-first strategy failed:', error);
    const cachedData = await getCachedAPIResponse(request.url);
    
    if (cachedData) {
      return new Response(JSON.stringify(cachedData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Return appropriate fallback for different API endpoints
    if (request.url.includes('/api/get-messages')) {
      return new Response(JSON.stringify({ success: true, messages: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ success: false, message: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Dynamic caching for other resources
async function dynamicCaching(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const response = await fetch(request);
    const responseClone = response.clone();
    await cache.put(request, responseClone);
    return response;
  } catch (error) {
    console.error('Dynamic caching failed:', error);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Fetch event handler
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request));
  }
  // Handle navigation requests with cache-first strategy
  else if (request.mode === 'navigate') {
    event.respondWith(cacheFirstStrategy(request));
  }
  // Handle static assets with dynamic caching
  else {
    event.respondWith(dynamicCaching(request));
  }
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle offline form submissions here
      console.log('Background sync triggered')
    );
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.svg',
      badge: '/icon-72x72.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'view',
          title: 'View Message',
          icon: '/icon-192x192.svg'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icon-192x192.svg'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Mystery Message', options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
