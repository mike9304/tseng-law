import './globals.css';
import './consultation-ai.css';
import '@/lib/builder/components/_shared/widget-tokens.css';
import '@/lib/builder/components/_shared/hover-states.css';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import { getSearchEngineVerification, getSiteUrl } from '@/lib/seo';
import { getLocaleFontClassName, type DocumentLanguage } from './fonts';

const searchEngineVerification = getSearchEngineVerification();

export function resolveDocumentLanguage(pathname: string | null): DocumentLanguage {
  const locale = pathname?.split('/').filter(Boolean)[0]?.toLowerCase();
  if (locale === 'zh-hant') return 'zh-Hant';
  if (locale === 'en') return 'en';
  return 'ko';
}

function getRequestPathname(): string | null {
  return headers().get('x-tseng-pathname');
}

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
  ...(searchEngineVerification ? { verification: searchEngineVerification } : {}),
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
  const language = resolveDocumentLanguage(getRequestPathname());
  // next/font variables must live on <html> so :root semantic tokens resolve.
  const fontClassName = getLocaleFontClassName(language);

  return (
    <html lang={language} className={fontClassName} suppressHydrationWarning>
      <head>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<style>.reveal,.reveal-stagger > *{opacity:1;transform:none;pointer-events:auto;transition:none}</style>`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
