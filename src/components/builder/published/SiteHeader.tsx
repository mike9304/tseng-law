'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import type { BuilderNavItem, BuilderSiteSettings, BuilderTheme } from '@/lib/builder/site/types';
import { buildSitePagePath, comparableSitePath, normalizeSiteHref } from '@/lib/builder/site/paths';
import { resolveBrandLogo } from '@/lib/builder/site/theme';
import { siteContent } from '@/data/site-content';
import SearchOverlay from '@/components/SearchOverlay';
import { buildHeaderMegaPanels, type HeaderMegaPanel } from '@/lib/builder/site/header-mega';

type HeaderNavSpec = {
  key: string;
  slug: string;
  labels: Record<Locale, string>;
};

type HeaderNavItem = HeaderNavSpec & {
  href: string;
  source?: BuilderNavItem;
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
  const indexedItems = HEADER_NAV_SPECS.map((spec, specIndex) => {
    const path = localizedPath(locale, spec.slug);
    const source = navItems.find((item) => (
      comparableSitePath(normalizeSiteHref(item.href, locale), locale) === comparableSitePath(path, locale) ||
      item.id === `nav-${spec.key}`
    ));
    return {
      item: {
        ...spec,
        source,
        href: source ? normalizeSiteHref(source.href, locale) : path,
      },
      sourceIndex: source ? navItems.findIndex((item) => item.id === source.id) : -1,
      specIndex,
    };
  });
  return indexedItems
    .sort((left, right) => {
      const leftIndex = left.sourceIndex >= 0 ? left.sourceIndex : Number.MAX_SAFE_INTEGER + left.specIndex;
      const rightIndex = right.sourceIndex >= 0 ? right.sourceIndex : Number.MAX_SAFE_INTEGER + right.specIndex;
      return leftIndex - rightIndex;
    })
    .map(({ item }) => item);
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
  onRequestAddNavChild,
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
  onRequestAddNavChild?: (parentItemId: string) => void;
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
  const [pinnedMenu, setPinnedMenu] = useState<string | null>(null);
  const [builderEditingMenu, setBuilderEditingMenu] = useState<string | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, visible: false });
  const mainNavRef = useRef<HTMLElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const closeTimeoutRef = useRef<number | null>(null);
  const displayNavItems = useMemo(() => buildHeaderNavItems(navItems, locale), [locale, navItems]);
  const megaPanels = useMemo<HeaderMegaPanel[]>(() => buildHeaderMegaPanels(locale, displayNavItems), [displayNavItems, locale]);
  const megaPanelKeys = useMemo(() => new Set<string>(megaPanels.map((panel) => panel.key)), [megaPanels]);
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
    setPinnedMenu(null);
    setBuilderEditingMenu(null);
    setOpenMenu(null);
  }, [clearCloseTimeout]);

  const scheduleCloseMegaMenu = useCallback(() => {
    clearCloseTimeout();
    if (builderEditable && (pinnedMenu || builderEditingMenu)) return;
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpenMenu(null);
      closeTimeoutRef.current = null;
    }, 300);
  }, [builderEditable, builderEditingMenu, clearCloseTimeout, pinnedMenu]);

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

  useEffect(() => {
    if (builderEditable) return;
    setBuilderEditingMenu(null);
  }, [builderEditable]);

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

  function handleBuilderLocaleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!builderEditable) return;
    event.preventDefault();
    event.stopPropagation();
    closeMegaMenuNow();
  }

  function handleBuilderNavClick(event: React.MouseEvent<HTMLAnchorElement>, item: HeaderNavItem) {
    if (!builderEditable || !item.source) return false;
    event.preventDefault();
    event.stopPropagation();
    if (megaPanelKeys.has(item.key)) {
      clearCloseTimeout();
      setPinnedMenu(item.key);
      setBuilderEditingMenu(item.key);
      setOpenMenu(item.key);
      moveIndicator(item.key, true);
      onRequestEditNavItem?.(item.source.id);
      return true;
    }
    closeMegaMenuNow();
    onRequestEditNavItem?.(item.source.id);
    return true;
  }

  function handleBuilderMegaClick(event: React.MouseEvent<HTMLElement>, item: HeaderMegaPanel['links'][number], panelKey: string) {
    if (!builderEditable || !item.source) return false;
    event.preventDefault();
    event.stopPropagation();
    clearCloseTimeout();
    setPinnedMenu(panelKey);
    setBuilderEditingMenu(panelKey);
    setOpenMenu(panelKey);
    moveIndicator(panelKey, true);
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
                <Link
                  href={localeSwitchPath('ko', currentSlug)}
                  aria-current={locale === 'ko' ? 'page' : undefined}
                  onClick={handleBuilderLocaleClick}
                  onAuxClick={handleBuilderLocaleClick}
                >
                  KO
                </Link>
                <Link
                  href={localeSwitchPath('zh-hant', currentSlug)}
                  aria-current={locale === 'zh-hant' ? 'page' : undefined}
                  onClick={handleBuilderLocaleClick}
                  onAuxClick={handleBuilderLocaleClick}
                >
                  中文
                </Link>
                <Link
                  href={localeSwitchPath('en', currentSlug)}
                  aria-current={locale === 'en' ? 'page' : undefined}
                  onClick={handleBuilderLocaleClick}
                  onAuxClick={handleBuilderLocaleClick}
                >
                  EN
                </Link>
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
                        if (pinnedMenu !== item.key) setPinnedMenu(null);
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
                        data-builder-nav-active={isBuilderActive ? 'true' : undefined}
                        ref={(element) => {
                          linkRefs.current[item.key] = element;
                        }}
                        title={builderEditable && item.source ? `Edit menu item: ${getLabel(item.source, item.labels, locale)}` : undefined}
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
                  {builderEditable && builderEditingMenu === panel.key ? (
                    <div className="builder-mega-editing-chip" data-builder-mega-editing-chip="true">
                      <span>Dropdown editing</span>
                      <strong>{panel.title}</strong>
                    </div>
                  ) : null}
                  {builderEditable ? (() => {
                    const panelSource = displayNavItems.find((item) => item.key === panel.key)?.source;
                    if (!panelSource) return null;
                    return (
                      <div className="builder-mega-actions" data-builder-mega-actions="true">
                        <button
                          type="button"
                          className="builder-mega-action builder-mega-action-primary"
                          data-builder-header-action="mega-edit"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            clearCloseTimeout();
                            setPinnedMenu(panel.key);
                            setBuilderEditingMenu(panel.key);
                            setOpenMenu(panel.key);
                            onRequestEditNavItem?.(panelSource.id);
                          }}
                        >
                          Edit dropdown
                        </button>
                        <button
                          type="button"
                          className="builder-mega-action"
                          data-builder-header-action="mega-add"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            clearCloseTimeout();
                            setPinnedMenu(panel.key);
                            setBuilderEditingMenu(panel.key);
                            setOpenMenu(panel.key);
                            onRequestAddNavChild?.(panelSource.id);
                          }}
                        >
                          Add menu item
                        </button>
                      </div>
                    );
                  })() : null}
                  <h2 className="mega-title">{panel.title}</h2>
                  <ul className="mega-links" onClick={closeMegaMenuNow}>
                    {panel.links.map((link) => (
                      <li key={`${panel.key}-${link.href}`}>
                        <div className={builderEditable ? 'builder-mega-link-row' : undefined}>
                          <a
                            href={link.href}
                            target={link.href.startsWith('http') ? '_blank' : undefined}
                            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            data-builder-nav-item-id={builderEditable && link.source ? link.source.id : undefined}
                            data-builder-nav-item-label={builderEditable && link.source ? link.label : undefined}
                            data-builder-nav-active={builderEditable && link.source?.id === activeBuilderNavItemId ? 'true' : undefined}
                            title={builderEditable && link.source ? `Edit menu item: ${link.label}` : undefined}
                            onClick={(event) => {
                              if (handleBuilderMegaClick(event, link, panel.key)) return;
                              navigate(event, link.href);
                            }}
                          >
                            <span>{link.label}</span>
                            <span className="mega-chevron">›</span>
                          </a>
                          {builderEditable && link.source ? (
                            <button
                              type="button"
                              className="builder-mega-link-edit"
                              data-builder-header-action="mega-link-edit"
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                handleBuilderMegaClick(event, link, panel.key);
                              }}
                            >
                              Edit
                            </button>
                          ) : null}
                        </div>
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
