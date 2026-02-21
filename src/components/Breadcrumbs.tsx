'use client';

import Link from 'next/link';
import type { Locale } from '@/lib/locales';

export default function Breadcrumbs({ locale, current }: { locale: Locale; current: string }) {
  const homeLabel = locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : 'Home';
  const navLabel = locale === 'ko' ? '현재 위치' : locale === 'zh-hant' ? '目前位置' : 'Current location';

  return (
    <nav className="breadcrumb" aria-label={navLabel}>
      <Link href={`/${locale}`} className="breadcrumb-link">
        {homeLabel}
      </Link>
      <span aria-hidden>/</span>
      <span aria-current="page" className="breadcrumb-current">
        {current}
      </span>
    </nav>
  );
}
