'use client';

import { useState, useRef, useEffect, type MouseEvent as ReactMouseEvent } from 'react';
import Link from 'next/link';
import type { SiteLocale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import { getAttorneyProfilePath } from '@/data/attorney-profiles';
import { teamContent } from '@/data/team-members';
import SectionLabel from '@/components/SectionLabel';
import HeroMediaBackground from '@/components/HeroMediaBackground';
import { homeHeroTextSurfaceIds } from '@/lib/builder/registry';
import { SurfaceText } from '@/lib/builder/surface-context';
import {
  getConsultationCtaLabel,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import LocaleHomePathNav from '@/components/LocaleHomePathNav';
import HeroTrustStrip from '@/components/HeroTrustStrip';
import styles from './HomeEditorial.module.css';

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
    { label: 'Insights', href: '/en/columns' },
    { label: 'International Team', href: '/en/lawyers' },
    { label: 'FAQ', href: '/en/faq' },
    { label: 'Videos / Channel', href: '/en/videos' },
    { label: 'Contact information', href: '/en/contact' }
  ],
  ja: [
    { label: '取扱業務', href: '/ja/services' },
    { label: 'コラム', href: '/ja/columns' },
    { label: '日本チーム', href: '/ja/lawyers' },
    { label: 'よくある質問', href: '/ja/faq' },
    { label: '動画/チャンネル', href: '/ja/videos' },
    { label: '連絡先', href: '/ja/contact' },
  ],
} as const;

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

const editorialSearchExamples: Record<SiteLocale, string> = {
  ko: '예: 회사 설립',
  'zh-hant': '例如：公司設立',
  en: 'e.g. company setup',
  ja: '例：会社設立',
};

export function handleLegacyZhHeroScroll(event: ReactMouseEvent<HTMLAnchorElement>, locale: SiteLocale): void {
  if (locale !== 'zh-hant' || event.defaultPrevented || event.button !== 0
    || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    || event.currentTarget.getAttribute('href') !== '#insights') return;
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[id="insights"]'));
  const visible = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;
    for (let ancestor: HTMLElement | null = element; ancestor; ancestor = ancestor.parentElement) {
      const style = window.getComputedStyle(ancestor);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
    }
    return true;
  };
  if (targets[0] && visible(targets[0])) return;
  const visibleId = targets.find(visible);
  const parity = Array.from(document.querySelectorAll<HTMLElement>(
    '[data-anchor="mobile-parity-home-insights"]',
  )).find(visible);
  const target = visibleId ?? parity;
  if (!target || target === targets[0]) return;
  const header = Array.from(document.querySelectorAll<HTMLElement>('header.header')).find(visible);
  const headerHeight = header ? header.getBoundingClientRect().height : 0;
  event.preventDefault();
  if (window.location.hash !== '#insights') window.history.pushState(null, '', '#insights');
  window.scrollTo({
    top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - headerHeight),
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  });
}

// Default ja hero titles, split into phrases that must not break internally
// (e.g. 労/務). Builder overrides replace the whole body and are not affected.
const jaHeroTitlePhrases: Record<string, readonly string[]> = {
  '台湾法を、分かりやすく。': ['台湾法を、', '分かりやすく。'],
  // WO-X3 (J11)
  '台湾の会社設立・労務・紛争を、日本語で。': ['台湾の会社設立・', '労務・', '紛争を、', '日本語で。'],
};

function HeroTitleBody({ locale, title }: { locale: SiteLocale; title: string }) {
  const phrases = locale === 'ja' ? jaHeroTitlePhrases[title] : undefined;
  if (!phrases) return <>{title}</>;
  return (
    <>
      {phrases.map((phrase, index) => (
        <span key={phrase}>
          {index > 0 ? <wbr /> : null}
          <span style={{ display: 'inline-block', maxWidth: '100%' }}>{phrase}</span>
        </span>
      ))}
    </>
  );
}

export default function HeroSearch({
  locale,
  scrollHref = '#insights',
  headingLevel = 1,
  presentation,
  quickMenus,
  omitLandmarkId = false,
}: {
  locale: SiteLocale;
  scrollHref?: string;
  headingLevel?: 1 | 2;
  presentation?: 'editorial';
  quickMenus?: ReadonlyArray<{ label: string; href: string }>;
  omitLandmarkId?: boolean;
}) {
  const hero = siteContent[locale].hero;
  const HeroHeading = headingLevel === 2 ? 'h2' : 'h1';
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editorial = presentation === 'editorial';
  const menus = quickMenus ?? heroQuickMenus[locale];
  const lead = teamContent[locale].members[0];
  const profilePath = getAttorneyProfilePath(locale);
  const searchInputId = `hero-search-${locale}`;

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

  const titleSurface = (
    <HeroHeading
      className="hero-title"
      data-builder-surface-key={homeHeroTextSurfaceIds[1]}
    >
      <SurfaceText surfaceKey={homeHeroTextSurfaceIds[1]}>
        <HeroTitleBody locale={locale} title={hero.title} />
      </SurfaceText>
    </HeroHeading>
  );

  const searchForm = (overlap: boolean) => (
    <form
      className={overlap ? 'hero-search-bar overlap' : `hero-search-bar ${styles.searchBar}`}
      action={`/${locale}/search`}
      method="get"
    >
      <input
        id={editorial ? searchInputId : undefined}
        ref={inputRef}
        className="search-input hero-search-input"
        type="search"
        name="q"
        placeholder={editorial ? editorialSearchExamples[locale] : hero.searchPlaceholder}
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
  );

  // WO-X3b (EN-09 · J10): one solid primary first, the two path buttons as
  // outlined secondaries, the guide as a text link. Services and columns are
  // left to the header navigation and the sections directly below the hero.
  const ctaGroup = (tone: 'dark' | 'light') => (
    <div className="hero-cta-group">
      <div className="hero-links-minimal hero-cta-actions">
        <a
          href={getConsultationPublicMailto(locale)}
          className="button hero-cta-primary"
          aria-label={`${emailConsultationCtaLabels[locale]} — ${getConsultationCtaLabel(locale)}`}
        >
          {emailConsultationCtaLabels[locale]}
        </a>
      </div>
      <LocaleHomePathNav locale={locale} tone={tone} />
    </div>
  );

  const quickMenu = focused ? (
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
  ) : null;

  const scrollAffordance = (
    <a
      href={scrollHref}
      className={editorial ? `hero-scroll-arrow ${styles.scrollArrow}` : 'hero-scroll-arrow'}
      onClick={(event) => { setFocused(false); handleLegacyZhHeroScroll(event, locale); }}
      aria-label={scrollArrowLabels[locale]}
    >
      <svg viewBox="0 0 28 28" aria-hidden>
        <polyline points="6,10 14,18 22,10" />
      </svg>
    </a>
  );

  if (editorial) {
    return (
      <section className={`hero ${styles.heroEditorial}`} id={omitLandmarkId ? undefined : 'hero'} data-tone="light" data-presentation="editorial">
        <div className={`container hero-inner ${styles.heroInner}`}>
          <div className={`hero-copy ${styles.heroCopy}`} data-builder-node-key="copy">
            <SectionLabel data-builder-surface-key={homeHeroTextSurfaceIds[0]}>
              <SurfaceText surfaceKey={homeHeroTextSurfaceIds[0]}>{hero.label}</SurfaceText>
            </SectionLabel>
            {titleSurface}
            <p className="hero-subtitle" data-builder-surface-key={homeHeroTextSurfaceIds[2]}>
              <SurfaceText surfaceKey={homeHeroTextSurfaceIds[2]}>{hero.subtitle}</SurfaceText>
            </p>
            {lead ? (
              <Link href={profilePath} className={styles.byline}>
                <strong>{lead.name}</strong> · {lead.role}
              </Link>
            ) : null}
            {ctaGroup('light')}
            <HeroTrustStrip locale={locale} tone="light" />
          </div>
          <div className={styles.heroMediaFrame}>
            <HeroMediaBackground locale={locale} />
          </div>
        </div>
        <div className={`hero-search-wrapper ${styles.searchBand}`}>
          <div className="container">
            <div ref={wrapRef} className={`hero-search-dropdown-wrap ${styles.searchDropdown}`}>
              <div data-builder-node-key="search" style={{ display: 'contents' }}>
                <label htmlFor={searchInputId} className={styles.searchLabel}>
                  {hero.searchPlaceholder}
                </label>
                {searchForm(false)}
                {quickMenu}
              </div>
              {scrollAffordance}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero" id={omitLandmarkId ? undefined : 'hero'} data-tone="dark">
      <HeroMediaBackground locale={locale} />
      <div className="container hero-inner">
        <div className="hero-copy" data-builder-node-key="copy">
          <SectionLabel data-builder-surface-key={homeHeroTextSurfaceIds[0]}>
            <SurfaceText surfaceKey={homeHeroTextSurfaceIds[0]}>{hero.label}</SurfaceText>
          </SectionLabel>
          {titleSurface}
          <p className="hero-subtitle" data-builder-surface-key={homeHeroTextSurfaceIds[2]}>
            <SurfaceText surfaceKey={homeHeroTextSurfaceIds[2]}>{hero.subtitle}</SurfaceText>
          </p>
          {ctaGroup('dark')}
          <HeroTrustStrip locale={locale} tone="dark" />
        </div>
      </div>
      <div className="hero-search-wrapper">
        <div className="container">
          <div ref={wrapRef} className="hero-search-dropdown-wrap">
          <div data-builder-node-key="search" style={{ display: 'contents' }}>
            {searchForm(true)}
            {quickMenu}
          </div>
          </div>
        </div>
      </div>
      <div className="hero-bottom-crop" />
      {scrollAffordance}
    </section>
  );
}
