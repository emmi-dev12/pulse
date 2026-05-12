import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pulse',
    short_name: 'Pulse',
    description: 'Decentralized neon transcription cockpit with user-owned connections.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#050005',
    theme_color: '#ff2da8',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml'
      }
    ]
  };
}
