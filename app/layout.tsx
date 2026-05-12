import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pulse',
  description: 'High-end neon transcription PWA with decentralized user-owned connections.',
  applicationName: 'Pulse',
  manifest: '/manifest.webmanifest',
  themeColor: '#ff2da8',
  appleWebApp: {
    capable: true,
    title: 'Pulse',
    statusBarStyle: 'black-translucent'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
