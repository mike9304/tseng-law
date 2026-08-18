'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { SiteLocale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import SectionLabel from '@/components/SectionLabel';
import HeroMediaBackground from '@/components/HeroMediaBackground';
import {
  homeHeroButtonSurfaceIds,
  homeHeroTextSurfaceIds,
} from '@/lib/builder/registry';
import { SurfaceText } from '@/lib/builder/surface-context';
import {
  getConsultationCtaLabel,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';

export const heroQuickMenus = {
  ko: [
    { label: '업무분야', href: '/ko/services' },
    { label: '칼럼', href: '/ko/columns' },
    { label: '변호사', href: '/ko/lawyers' },
    { label: '자주 묻는 질문', href: '/ko/faq' },
    { label: '영상/채널', href: '/ko/videos' },
    { label: '연락처 정보', href: '/ko/contact' },
  ],
  'zh-hant': [
    { label: '服務領域', href: '/zh-hant/services' },
    { label: '專欄', href: '/zh-hant/columns' },
    { label: '律師', href: '/zh-hant/lawyers' },
    { label: '常見問題', href: '/zh-hant/faq' },
    { label: '影音/頻道', href: '/zh-hant/videos' },
    { label: '聯絡資訊', href: '/zh-hant/contact' },
  ],
  en: [
    { label: 'Services', href: '/en/services' },
    { label: 'Columns', href: '/en/columns' },
    { label: 'Lawyers', href: '/en/lawyers' },
    { label: 'FAQ', href: '/en/faq' },
    { label: 'Videos / Channel', href: '/en/videos' },
    { label: 'Contact information', href: '/en/contact' }
  ],
  ja: [
    { label: '取扱業務', href: '/ja/services' },
    { label: 'コラム', href: '/ja/columns' },
    { label: '弁護士', href: '/ja/lawyers' },
    { label: 'よくある質問', href: '/ja/faq' },
    { label: '動画/チャンネル', href: '/ja/videos' },
    { label: '連絡先', href: '/ja/contact' },
  ],
} as const;

const columnCtaLabels: Record<SiteLocale, string> = {
  ko: '호정칼럼 보기',
  'zh-hant': '查看專欄內容',
  en: 'View Columns',
  ja: 'コラムを見る',
};

const emailConsultationCtaLabels: Record<SiteLocale, string> = {
  ko: '이메일 상담 신청',
  'zh-hant': '申請電子郵件諮詢',
  en: 'Request an Email Consultation',
  ja: 'メール相談を申し込む',
};

const scrollArrowLabels: Record<SiteLocale, string> = {
  ko: '아래로 스크롤',
  'zh-hant': '向下滾動',
  en: 'Scroll down',
  ja: '下へスクロール',
};

export default function HeroSearch({
  locale,
  scrollHref = '#insights',
  headingLevel = 1,
}: {
  locale: SiteLocale;
  scrollHref?: string;
  headingLevel?: 1 | 2;
}) {
  const hero = siteContent[locale].hero;
  const HeroHeading = headingLevel === 2 ? 'h2' : 'h1';
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!focused) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setFocused(false);
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [focused]);

  const menus = heroQuickMenus[locale];

  return (
    <section className="hero" id="hero" data-tone="dark">
      <HeroMediaBackground locale={locale} />
      <div className="container hero-inner">
        <div className="hero-copy" data-builder-node-key="copy">
          <SectionLabel data-builder-surface-key={homeHeroTextSurfaceIds[0]}>
            <SurfaceText surfaceKey={homeHeroTextSurfaceIds[0]}>{hero.label}</SurfaceText>
          </SectionLabel>
          <HeroHeading
            className="hero-title"
            data-builder-surface-key={homeHeroTextSurfaceIds[1]}
          >
            <SurfaceText surfaceKey={homeHeroTextSurfaceIds[1]}>{hero.title}</SurfaceText>
          </HeroHeading>
          <p className="hero-subtitle" data-builder-surface-key={homeHeroTextSurfaceIds[2]}>
            <SurfaceText surfaceKey={homeHeroTextSurfaceIds[2]}>{hero.subtitle}</SurfaceText>
          </p>
          <div className="hero-links-minimal hero-cta-actions">
            <a
              href={getConsultationPublicMailto(locale)}
              className="button hero-cta-primary"
              aria-label={`${emailConsultationCtaLabels[locale]} — ${getConsultationCtaLabel(locale)}`}
            >
              {emailConsultationCtaLabels[locale]}
            </a>
            <Link
              href={`/${locale}/columns`}
              className="button hero-cta-secondary"
              data-builder-surface-key={homeHeroButtonSurfaceIds[0]}
            >
              <SurfaceText surfaceKey={homeHeroButtonSurfaceIds[0]}>
                {columnCtaLabels[locale]}
              </SurfaceText>
            </Link>
          </div>
        </div>
      </div>
      <div className="hero-search-wrapper">
        <div className="container">
          <div ref={wrapRef} className="hero-search-dropdown-wrap">
          <div data-builder-node-key="search" style={{ display: 'contents' }}>
            <form className="hero-search-bar overlap" action={`/${locale}/search`} method="get">
              <input
                ref={inputRef}
                className="search-input hero-search-input"
                type="search"
                name="q"
                placeholder={hero.searchPlaceholder}
                aria-label={hero.searchPlaceholder}
                suppressHydrationWarning
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
      </div>
      <div className="hero-bottom-crop" />
      <a
        href={scrollHref}
        className="hero-scroll-arrow"
        aria-label={scrollArrowLabels[locale]}
      >
        <svg viewBox="0 0 28 28" aria-hidden>
          <polyline points="6,10 14,18 22,10" />
        </svg>
      </a>
    </section>
  );
}
