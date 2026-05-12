import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pulse',
  description: 'Neon pink transcription workspace with Gladia integration scaffolding.',
  applicationName: 'Pulse',
  manifest: '/manifest.webmanifest',
  themeColor: '#ff2da8',
  appleWebApp: {
    capable: true,
    title: 'Pulse'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
