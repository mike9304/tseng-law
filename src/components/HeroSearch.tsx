'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import SectionLabel from '@/components/SectionLabel';
import HeroMediaBackground from '@/components/HeroMediaBackground';

const quickMenus = {
  ko: [
    { label: '업무분야', href: '/ko/services' },
    { label: '칼럼', href: '/ko/columns' },
    { label: '변호사', href: '/ko/lawyers' },
    { label: 'FAQ', href: '/ko/faq' },
    { label: '영상/채널', href: '/ko/videos' },
    { label: '연락처', href: '/ko/contact' },
  ],
  'zh-hant': [
    { label: '服務領域', href: '/zh-hant/services' },
    { label: '專欄', href: '/zh-hant/columns' },
    { label: '律師', href: '/zh-hant/lawyers' },
    { label: 'FAQ', href: '/zh-hant/faq' },
    { label: '影音/頻道', href: '/zh-hant/videos' },
    { label: '聯絡', href: '/zh-hant/contact' },
  ],
  en: [
    { label: 'Services', href: '/en/services' },
    { label: 'Columns', href: '/en/columns' },
    { label: 'Lawyers', href: '/en/lawyers' },
    { label: 'FAQ', href: '/en/faq' },
    { label: 'Videos / Channel', href: '/en/videos' },
    { label: 'Contact', href: '/en/contact' }
  ]
} as const;

export default function HeroSearch({ locale }: { locale: Locale }) {
  const hero = siteContent[locale].hero;
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const menus = quickMenus[locale];

  return (
    <section className="hero" id="hero" data-tone="dark">
      <HeroMediaBackground />
      <div className="container hero-inner">
        <div className="hero-copy">
          <SectionLabel>{hero.label}</SectionLabel>
          <h1 className="hero-title">{hero.title}</h1>
          <p className="hero-subtitle">{hero.subtitle}</p>
          <div className="hero-links-minimal">
            <Link href={`/${locale}/columns`} className="link-underline">
              {locale === 'ko' ? '호정칼럼 보기' : locale === 'zh-hant' ? '查看專欄內容' : 'View Columns'}
            </Link>
          </div>
        </div>
      </div>
      <div className="hero-search-wrapper">
        <div className="container">
          <div ref={wrapRef} className="hero-search-dropdown-wrap">
            <form className="hero-search-bar overlap" action={`/${locale}/search`} method="get">
              <input
                className="search-input hero-search-input"
                type="search"
                name="q"
                placeholder={hero.searchPlaceholder}
                aria-label={hero.searchPlaceholder}
                onFocus={() => setFocused(true)}
              />
              <button className="hero-search-btn" type="submit" aria-label={hero.searchButton}>
                <svg viewBox="0 0 24 24" aria-hidden>
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </form>
            {focused && (
              <nav className="hero-quick-menu">
                {menus.map((item) => (
                  <Link key={item.href} href={item.href} className="hero-quick-menu-item" onClick={() => setFocused(false)}>
                    <svg viewBox="0 0 24 24" className="hero-quick-menu-icon" aria-hidden>
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
      <div className="hero-bottom-crop" />
      <a
        href="#insights"
        className="hero-scroll-arrow"
        aria-label={locale === 'ko' ? '아래로 스크롤' : locale === 'zh-hant' ? '向下滾動' : 'Scroll down'}
      >
        <svg viewBox="0 0 28 28" aria-hidden>
          <polyline points="6,10 14,18 22,10" />
        </svg>
      </a>
    </section>
  );
}
