'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import type { BuilderNavItem, BuilderSiteSettings, BuilderTheme } from '@/lib/builder/site/types';
import { buildSitePagePath, comparableSitePath, normalizeSiteHref } from '@/lib/builder/site/paths';
import { resolveBrandLogo } from '@/lib/builder/site/theme';
import { siteContent } from '@/data/site-content';
import SearchOverlay from '@/components/SearchOverlay';
import SmartLink from '@/components/SmartLink';

type HeaderNavSpec = {
  key: string;
  slug: string;
  labels: Record<Locale, string>;
};

type HeaderNavItem = HeaderNavSpec & {
  href: string;
  source?: BuilderNavItem;
};

type MegaPanel = {
  key: string;
  title: string;
  links: Array<{ label: string; href: string }>;
};

const HEADER_NAV_SPECS: HeaderNavSpec[] = [
  { key: 'services', slug: 'services', labels: { ko: '업무분야', 'zh-hant': '服務領域', en: 'Services' } },
  { key: 'lawyers', slug: 'lawyers', labels: { ko: '변호사소개', 'zh-hant': '律師介紹', en: 'Lawyers' } },
  { key: 'pricing', slug: 'pricing', labels: { ko: '비용안내', 'zh-hant': '收費標準', en: 'Pricing' } },
  { key: 'columns', slug: 'columns', labels: { ko: '호정칼럼', 'zh-hant': '昊鼎專欄', en: 'Columns' } },
  { key: 'videos', slug: 'videos', labels: { ko: '미디어센터', 'zh-hant': '媒體中心', en: 'Media Center' } },
  { key: 'reviews', slug: 'reviews', labels: { ko: '고객후기', 'zh-hant': '客戶評價', en: 'Reviews' } },
];

function getLabel(item: BuilderNavItem | undefined, fallback: Record<Locale, string>, locale: Locale): string {
  if (!item) return fallback[locale];
  if (typeof item.label === 'string') return item.label;
  return item.label[locale] || item.label.ko || item.label.en || item.label['zh-hant'] || fallback[locale];
}

function localizedPath(locale: Locale, slug: string): string {
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

function localeSwitchPath(targetLocale: Locale, currentSlug: string): string {
  return currentSlug ? `/${targetLocale}/${currentSlug}` : `/${targetLocale}`;
}

function buildHeaderNavItems(navItems: BuilderNavItem[], locale: Locale): HeaderNavItem[] {
  return HEADER_NAV_SPECS.map((spec) => {
    const path = localizedPath(locale, spec.slug);
    const source = navItems.find((item) => (
      comparableSitePath(normalizeSiteHref(item.href, locale), locale) === comparableSitePath(path, locale) ||
      item.id === `nav-${spec.key}`
    ));
    return {
      ...spec,
      source,
      href: source ? normalizeSiteHref(source.href, locale) : path,
    };
  });
}

function buildMegaPanels(locale: Locale): MegaPanel[] {
  if (locale === 'ko') {
    return [
      {
        key: 'services',
        title: '업무분야',
        links: [
          { label: '투자·법인설립', href: '/ko/services/investment' },
          { label: '민사소송·손해배상', href: '/ko/services/civil' },
          { label: '가사소송', href: '/ko/services/family' },
          { label: '노동법·고용분쟁', href: '/ko/services/labor' },
          { label: '형사소송', href: '/ko/services/criminal' },
          { label: '지적재산·금융분쟁', href: '/ko/services/ip' },
          { label: '전체 보기', href: '/ko/services' },
        ],
      },
      {
        key: 'videos',
        title: '미디어센터',
        links: [
          { label: 'YouTube @weilawyer', href: 'https://www.youtube.com/@weilawyer' },
          { label: '네이버 블로그', href: 'https://blog.naver.com/wei_lawyer/223461663913' },
          { label: '영상/채널 페이지', href: '/ko/videos' },
        ],
      },
    ];
  }

  if (locale === 'zh-hant') {
    return [
      {
        key: 'services',
        title: '服務領域',
        links: [
          { label: '投資·公司設立', href: '/zh-hant/services/investment' },
          { label: '民事訴訟·損害賠償', href: '/zh-hant/services/civil' },
          { label: '家事訴訟', href: '/zh-hant/services/family' },
          { label: '勞動法·僱傭爭議', href: '/zh-hant/services/labor' },
          { label: '刑事訴訟', href: '/zh-hant/services/criminal' },
          { label: '智慧財產·金融爭議', href: '/zh-hant/services/ip' },
          { label: '查看全部', href: '/zh-hant/services' },
        ],
      },
      {
        key: 'videos',
        title: '媒體中心',
        links: [
          { label: 'YouTube @weilawyer', href: 'https://www.youtube.com/@weilawyer' },
          { label: 'Naver 部落格', href: 'https://blog.naver.com/wei_lawyer/223461663913' },
          { label: '影音頁面', href: '/zh-hant/videos' },
        ],
      },
    ];
  }

  return [
    {
      key: 'services',
      title: 'Services',
      links: [
        { label: 'Investment & Company Setup', href: '/en/services/investment' },
        { label: 'Civil Litigation & Damages', href: '/en/services/civil' },
        { label: 'Family Litigation', href: '/en/services/family' },
        { label: 'Labor & Employment', href: '/en/services/labor' },
        { label: 'Criminal Litigation', href: '/en/services/criminal' },
        { label: 'IP & Financial Disputes', href: '/en/services/ip' },
        { label: 'View All', href: '/en/services' },
      ],
    },
    {
      key: 'videos',
      title: 'Media Center',
      links: [
        { label: 'YouTube @weilawyer', href: 'https://www.youtube.com/@weilawyer' },
        { label: 'Naver Blog', href: 'https://blog.naver.com/wei_lawyer/223461663913' },
        { label: 'Videos / Channels', href: '/en/videos' },
      ],
    },
  ];
}

export default function SiteHeader({
  settings,
  navItems,
  locale,
  currentSlug,
  onNavigate,
  builderEditable = false,
  activeBuilderNavItemId,
  onRequestEditNavItem,
  onRequestEditSiteBrand,
}: {
  siteName: string;
  settings?: BuilderSiteSettings;
  theme?: BuilderTheme;
  navItems: BuilderNavItem[];
  locale: Locale;
  currentSlug: string;
  onNavigate?: (href: string) => void;
  builderEditable?: boolean;
  activeBuilderNavItemId?: string | null;
  onRequestEditNavItem?: (itemId: string) => void;
  onRequestEditSiteBrand?: () => void;
}) {
  const content = siteContent[locale];
  const brandText = settings?.firmName || (locale === 'ko'
    ? '법무법인 호정'
    : locale === 'zh-hant'
      ? '昊鼎國際法律事務所'
      : 'Hovering International Law Firm');
  const defaultLogo = locale === 'zh-hant'
    ? '/images/brand/hovering-logo-zh.png'
    : '/images/brand/hovering-logo-ko.png';
  const logo = resolveBrandLogo({
    logoLight: settings?.logo,
    logoDark: settings?.logoDark,
    assets: settings?.assets,
  }, 'light') || defaultLogo;
  const [searchOpen, setSearchOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, visible: false });
  const mainNavRef = useRef<HTMLElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const closeTimeoutRef = useRef<number | null>(null);
  const displayNavItems = useMemo(() => buildHeaderNavItems(navItems, locale), [locale, navItems]);
  const megaPanels = useMemo(() => buildMegaPanels(locale), [locale]);
  const megaPanelKeys = useMemo(() => new Set(megaPanels.map((panel) => panel.key)), [megaPanels]);
  const currentPath = buildSitePagePath(locale, currentSlug);
  const searchLabel = locale === 'ko' ? '검색 열기' : locale === 'zh-hant' ? '開啟搜尋' : 'Open search';
  const utilityLinks = locale === 'ko'
    ? [
        { label: '연락처', href: '/ko/contact' },
        { label: '오시는 길', href: '/ko/contact#offices' },
      ]
    : locale === 'zh-hant'
      ? [
          { label: '聯絡', href: '/zh-hant/contact' },
          { label: '據點', href: '/zh-hant/contact#offices' },
        ]
      : [
          { label: 'Contact', href: '/en/contact' },
          { label: 'Offices', href: '/en/contact#offices' },
        ];

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const closeMegaMenuNow = useCallback(() => {
    clearCloseTimeout();
    setOpenMenu(null);
  }, [clearCloseTimeout]);

  const scheduleCloseMegaMenu = useCallback(() => {
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpenMenu(null);
      closeTimeoutRef.current = null;
    }, 300);
  }, [clearCloseTimeout]);

  const moveIndicator = useCallback((key: string | null, visible = true) => {
    if (!key) {
      setIndicatorStyle((previous) => ({ ...previous, visible: false }));
      return;
    }
    const link = linkRefs.current[key];
    const nav = mainNavRef.current;
    if (!link || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    setIndicatorStyle({
      left: linkRect.left - navRect.left,
      width: linkRect.width,
      visible,
    });
  }, []);

  const activeNavKey = useMemo(() => {
    const found = displayNavItems.find((item) => (
      comparableSitePath(item.href, locale) === comparableSitePath(currentPath, locale)
    ));
    return found?.key ?? null;
  }, [currentPath, displayNavItems, locale]);

  useEffect(() => {
    if (openMenu) {
      moveIndicator(openMenu, true);
      return;
    }
    if (activeNavKey) {
      moveIndicator(activeNavKey, true);
      return;
    }
    setIndicatorStyle((previous) => ({ ...previous, visible: false }));
  }, [activeNavKey, moveIndicator, openMenu]);

  useEffect(() => {
    if (searchOpen) closeMegaMenuNow();
  }, [closeMegaMenuNow, searchOpen]);

  useEffect(() => () => clearCloseTimeout(), [clearCloseTimeout]);

  function navigate(event: React.MouseEvent<HTMLElement>, href: string) {
    if (!onNavigate || /^(https?:|mailto:|tel:|#)/.test(href)) return;
    event.preventDefault();
    closeMegaMenuNow();
    onNavigate(href);
  }

  function handleBuilderBrandClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!builderEditable) return false;
    event.preventDefault();
    event.stopPropagation();
    onRequestEditSiteBrand?.();
    return true;
  }

  function handleBuilderNavClick(event: React.MouseEvent<HTMLAnchorElement>, item: HeaderNavItem) {
    if (!builderEditable || !item.source) return false;
    event.preventDefault();
    event.stopPropagation();
    closeMegaMenuNow();
    onRequestEditNavItem?.(item.source.id);
    return true;
  }

  return (
    <>
      <header className={`header scrolled${openMenu ? ' mega-open' : ''} builder-site-header`}>
        <div className="header-utility">
          <div className="container">
            <nav className="utility-nav" aria-label={locale === 'ko' ? '보조 메뉴' : locale === 'zh-hant' ? '輔助選單' : 'Utility menu'}>
              {utilityLinks.map((item) => (
                <a key={item.href} href={item.href} onClick={(event) => navigate(event, item.href)}>
                  {item.label}
                </a>
              ))}
              <div className="utility-lang">
                <Link href={localeSwitchPath('ko', currentSlug)} aria-current={locale === 'ko' ? 'page' : undefined}>KO</Link>
                <Link href={localeSwitchPath('zh-hant', currentSlug)} aria-current={locale === 'zh-hant' ? 'page' : undefined}>中文</Link>
                <Link href={localeSwitchPath('en', currentSlug)} aria-current={locale === 'en' ? 'page' : undefined}>EN</Link>
              </div>
            </nav>
          </div>
        </div>

        <div className="header-main">
          <div className="container header-main-inner">
            <a
              className="header-logo"
              href={buildSitePagePath(locale, '')}
              aria-label="Home"
              data-builder-site-brand={builderEditable ? 'true' : undefined}
              onClick={(event) => {
                if (handleBuilderBrandClick(event)) return;
                navigate(event, buildSitePagePath(locale, ''));
              }}
            >
              <span className="logo-mark" aria-hidden>
                <img className="site-header-logo-light" src={logo} alt="" width={508} height={80} />
              </span>
              <strong className="logo-kr">{brandText}</strong>
            </a>

            <nav
              className={`main-nav${openMenu ? ' menu-open' : ''}`}
              aria-label="Main"
              ref={mainNavRef}
              onMouseEnter={clearCloseTimeout}
              onMouseLeave={scheduleCloseMegaMenu}
            >
              <div
                className="nav-indicator"
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                  opacity: indicatorStyle.visible ? 1 : 0,
                }}
              />
              <ul className="nav-list">
                {displayNavItems.map((item) => {
                  const isActive = comparableSitePath(item.href, locale) === comparableSitePath(currentPath, locale);
                  const isBuilderActive = builderEditable && item.source?.id === activeBuilderNavItemId;
                  const hasMegaPanel = megaPanelKeys.has(item.key);
                  return (
                    <li
                      key={item.key}
                      className={`nav-item${openMenu === item.key || isActive ? ' active' : ''}`}
                      onMouseEnter={() => {
                        if (!hasMegaPanel) return;
                        clearCloseTimeout();
                        moveIndicator(item.key, true);
                        setOpenMenu(item.key);
                      }}
                      onMouseLeave={() => {
                        if (hasMegaPanel) scheduleCloseMegaMenu();
                      }}
                    >
                      <a
                        href={item.href}
                        className="nav-link"
                        aria-current={isActive ? 'page' : undefined}
                        data-builder-nav-item-id={builderEditable && item.source ? item.source.id : undefined}
                        data-builder-nav-item-label={builderEditable && item.source ? getLabel(item.source, item.labels, locale) : undefined}
                        ref={(element) => {
                          linkRefs.current[item.key] = element;
                        }}
                        title={builderEditable && item.source ? `Edit menu item: ${getLabel(item.source, item.labels, locale)}` : undefined}
                        style={{
                          outline: isBuilderActive ? '2px solid #116dff' : undefined,
                          outlineOffset: isBuilderActive ? 3 : undefined,
                        }}
                        onFocus={() => {
                          if (!hasMegaPanel) return;
                          clearCloseTimeout();
                          moveIndicator(item.key, true);
                          setOpenMenu(item.key);
                        }}
                        onClick={(event) => {
                          if (handleBuilderNavClick(event, item)) return;
                          navigate(event, item.href);
                        }}
                      >
                        {getLabel(item.source, item.labels, locale)}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="header-actions">
              <button
                className="header-search-btn"
                type="button"
                data-builder-header-action="search"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setSearchOpen(true);
                }}
                aria-label={searchLabel}
              >
                <svg className="header-search-icon" viewBox="0 0 24 24" aria-hidden>
                  <circle cx="11" cy="11" r="7.2" />
                  <line x1="16.5" y1="16.5" x2="21" y2="21" />
                </svg>
              </button>
              <a
                className="button nav-cta"
                href={content.nav.cta.href}
                onClick={(event) => navigate(event, content.nav.cta.href)}
              >
                {content.nav.cta.label}
              </a>
            </div>
          </div>
          <div className="header-accent-line" />
        </div>

        <div
          className={`mega-menu${openMenu ? ' open' : ''}`}
          aria-hidden={openMenu ? 'false' : 'true'}
          onMouseEnter={clearCloseTimeout}
          onMouseLeave={scheduleCloseMegaMenu}
        >
          {megaPanels.map((panel) => (
            <div key={panel.key} className={`mega-panel${openMenu === panel.key ? ' active' : ''}`} data-panel={panel.key}>
              <div className="container">
                <div className="mega-layout">
                  <h2 className="mega-title">{panel.title}</h2>
                  <ul className="mega-links" onClick={closeMegaMenuNow}>
                    {panel.links.map((link) => (
                      <li key={`${panel.key}-${link.href}`}>
                        <SmartLink href={link.href}>
                          <span>{link.label}</span>
                          <span className="mega-chevron">›</span>
                        </SmartLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </header>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} locale={locale} />
    </>
  );
}
