/* eslint-disable @next/next/no-page-custom-font */
import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { normalizeLocale } from '@/lib/locales';
import { getSiteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: 'Tseng Law',
  title: {
    default: '법무법인 호정',
    template: '%s | Tseng Law',
  },
  description:
    '대만 회사설립, 대만 소송, 대만 투자 법률 자문을 한국어·중문·영문으로 안내하는 법무법인 호정 공식 사이트.',
  authors: [{ name: '법무법인 호정' }],
  creator: 'Tseng Law',
  publisher: 'Tseng Law',
  category: 'legal services',
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  icons: {
    icon: '/images/brand/hovering-logo-ko.png',
    apple: '/images/brand/hovering-logo-ko.png',
  },
};

export default function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params?: { locale?: string };
}) {
  const locale = normalizeLocale(params?.locale);
  const htmlLang = locale === 'zh-hant' ? 'zh-Hant' : locale;

  return (
    <html lang={htmlLang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Pretendard — Korean body text (modern, clean) */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        {/* Nanum Myeongjo — Korean serif headings (authoritative, traditional) */}
        {/* Cormorant Garamond — English headings | Noto Serif TC + Noto Sans TC — Traditional Chinese */}
        <link
          href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Noto+Serif+TC:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
