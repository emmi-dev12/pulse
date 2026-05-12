import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pulse',
    short_name: 'Pulse',
    description: 'Neon transcription cockpit with Composio-ready audio workflows.',
    start_url: '/',
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
