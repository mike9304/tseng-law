'use client';

import { useEffect, useState } from 'react';

const copyByLocale = {
  ko: {
    brand: '법무법인 호정',
    title: '페이지를 표시할 수 없습니다',
    description: '일시적인 오류가 발생했습니다. 다시 시도하거나 홈으로 이동해 주세요.',
    retry: '다시 시도',
    home: '홈으로 이동',
    locale: 'ko',
  },
  'zh-hant': {
    brand: '昊鼎國際法律事務所',
    title: '目前無法顯示頁面',
    description: '發生暫時性錯誤。請再試一次或返回首頁。',
    retry: '再試一次',
    home: '返回首頁',
    locale: 'zh-Hant',
  },
  en: {
    brand: 'Hovering International Law Firm',
    title: 'We could not display this page',
    description: 'A temporary error occurred. Please try again or return to the home page.',
    retry: 'Try again',
    home: 'Return home',
    locale: 'en',
  },
} as const;

type ErrorLocale = keyof typeof copyByLocale;

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [locale, setLocale] = useState<ErrorLocale>('ko');

  useEffect(() => {
    const pathLocale = window.location.pathname.split('/').filter(Boolean)[0];
    setLocale(pathLocale === 'zh-hant' || pathLocale === 'en' ? pathLocale : 'ko');
  }, []);

  const copy = copyByLocale[locale];

  return (
    <html lang={copy.locale}>
      <body>
        <div className="global-error-shell">
          <header className="global-error-header">
            <a href={`/${locale}`}>{copy.brand}</a>
          </header>
          <main className="global-error-main" aria-labelledby="global-error-title">
            <p className="not-found-code" aria-hidden="true">500</p>
            <h1 id="global-error-title">{copy.title}</h1>
            <p>{copy.description}</p>
            <div className="not-found-actions">
              <button className="button" type="button" onClick={reset}>{copy.retry}</button>
              <a className="button button--outline" href={`/${locale}`}>{copy.home}</a>
            </div>
          </main>
          <footer className="global-error-footer">{copy.brand}</footer>
        </div>
      </body>
    </html>
  );
}
