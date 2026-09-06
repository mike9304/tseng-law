'use client';

import Link from 'next/link';
import type { SiteLocale } from '@/lib/locales';
import styles from './Breadcrumbs.module.css';

export default function Breadcrumbs({ locale, current }: { locale: SiteLocale; current: string }) {
  const homeLabel =
    locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : locale === 'ja' ? 'ホーム' : 'Home';
  const navLabel =
    locale === 'ko' ? '현재 위치' : locale === 'zh-hant' ? '目前位置' : locale === 'ja' ? '現在位置' : 'Current location';

  return (
    <nav className={`breadcrumb ${styles.trail}`} aria-label={navLabel}>
      <Link href={`/${locale}`} className={`breadcrumb-link ${styles.home}`}>
        {homeLabel}
      </Link>
      <span aria-hidden className={styles.separator}>/</span>
      <span aria-current="page" className={`breadcrumb-current ${styles.current}`}>
        {current}
      </span>
    </nav>
  );
}
