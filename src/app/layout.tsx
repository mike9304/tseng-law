/* eslint-disable @next/next/no-page-custom-font */
import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getSiteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: '법무법인 호정',
  title: {
    default: '법무법인 호정',
    template: '%s | 법무법인 호정',
  },
  description:
    '대만 회사설립, 대만 소송, 대만 투자 법률 자문을 한국어·중문·영문으로 안내하는 법무법인 호정 공식 사이트.',
  authors: [{ name: '법무법인 호정' }],
  creator: '법무법인 호정',
  publisher: '법무법인 호정',
  category: 'legal services',
  manifest: '/manifest.webmanifest',
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/images/brand/hovering-seal-red-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/brand/hovering-seal-red-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@300;400;500;600;700&family=Noto+Serif+KR:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Noto+Serif+TC:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
