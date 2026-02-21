/* eslint-disable @next/next/no-page-custom-font */
import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: {
    default: '법무법인 호정 (昊鼎國際法律事務所)',
    template: '%s | Hovering Law International'
  },
  description: 'A multilingual law firm site built for editorial clarity and global trust.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
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
