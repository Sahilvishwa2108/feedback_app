import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mystery Message - Anonymous Feedback PWA',
    short_name: 'Mystery Message',
    description: 'A modern web application that enables anonymous feedback for personal growth and honest communication.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f0f0f',
    theme_color: '#7c3aed',
    orientation: 'portrait',    scope: '/',
    id: 'mystery-message-pwa',
    icons: [
      {
        src: '/icon-72x72.svg',
        sizes: '72x72',
        type: 'image/svg+xml',
        purpose: 'maskable'
      },
      {
        src: '/icon-96x96.svg',
        sizes: '96x96',
        type: 'image/svg+xml',
        purpose: 'maskable'
      },
      {
        src: '/icon-128x128.svg',
        sizes: '128x128',
        type: 'image/svg+xml',
        purpose: 'maskable'
      },
      {
        src: '/icon-144x144.svg',
        sizes: '144x144',
        type: 'image/svg+xml',
        purpose: 'maskable'
      },
      {
        src: '/icon-152x152.svg',
        sizes: '152x152',
        type: 'image/svg+xml',
        purpose: 'maskable'
      },
      {
        src: '/icon-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any'
      },
      {
        src: '/icon-384x384.svg',
        sizes: '384x384',
        type: 'image/svg+xml',
        purpose: 'any'
      },
      {
        src: '/icon-512x512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any'
      }    ],
    categories: ['productivity', 'social', 'communication'],
    lang: 'en'
  }
}
