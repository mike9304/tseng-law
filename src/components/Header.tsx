'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/locales';
import { buildLocalePath } from '@/lib/path-utils';
import { siteContent } from '@/data/site-content';
import SearchOverlay from '@/components/SearchOverlay';
import MobileNavDrawer from '@/components/MobileNavDrawer';
import SmartLink from '@/components/SmartLink';

type MegaLink = {
  label: string;
  href: string;
};

type MegaPanel = {
  key: string;
  title: string;
  links: MegaLink[];
};

type MainNavItem = {
  key: string;
  label: string;
  href: string;
};

function buildMainNavItems(locale: Locale): MainNavItem[] {
  if (locale === 'ko') {
    return [
      { key: 'services', label: '업무분야', href: '/ko/services' },
      { key: 'lawyers', label: '변호사소개', href: '/ko/lawyers' },
      { key: 'pricing', label: '비용안내', href: '/ko/pricing' },
      { key: 'insights', label: '호정칼럼', href: '/ko/columns' },
      { key: 'videos', label: '미디어센터', href: '/ko/videos' },
      { key: 'reviews', label: '고객후기', href: '/ko/reviews' }
    ];
  }

  if (locale === 'zh-hant') {
    return [
      { key: 'services', label: '服務領域', href: '/zh-hant/services' },
      { key: 'lawyers', label: '律師介紹', href: '/zh-hant/lawyers' },
      { key: 'pricing', label: '收費標準', href: '/zh-hant/pricing' },
      { key: 'insights', label: '昊鼎專欄', href: '/zh-hant/columns' },
      { key: 'videos', label: '媒體中心', href: '/zh-hant/videos' },
      { key: 'reviews', label: '客戶評價', href: '/zh-hant/reviews' }
    ];
  }

  return [
    { key: 'services', label: 'Services', href: '/en/services' },
    { key: 'lawyers', label: 'Lawyers', href: '/en/lawyers' },
    { key: 'pricing', label: 'Pricing', href: '/en/pricing' },
    { key: 'insights', label: 'Columns', href: '/en/columns' },
    { key: 'videos', label: 'Media Center', href: '/en/videos' },
    { key: 'reviews', label: 'Reviews', href: '/en/reviews' }
  ];
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
          { label: '전체 보기', href: '/ko/services' }
        ]
      },
      {
        key: 'videos',
        title: '미디어센터',
        links: [
          { label: 'YouTube @weilawyer', href: 'https://www.youtube.com/@weilawyer' },
          { label: '네이버 블로그', href: 'https://blog.naver.com/wei_lawyer/223461663913' },
          { label: '영상/채널 페이지', href: '/ko/videos' }
        ]
      },
      {
        key: 'about',
        title: '법인소개',
        links: [
          { label: '법인 개요', href: '/ko/about' },
          { label: '변호사 소개', href: '/ko/lawyers' },
          { label: '오시는 길', href: '/ko/contact#offices' },
          { label: '문의하기', href: '/ko/contact' }
        ]
      }
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
          { label: '查看全部', href: '/zh-hant/services' }
        ]
      },
      {
        key: 'videos',
        title: '媒體中心',
        links: [
          { label: 'YouTube @weilawyer', href: 'https://www.youtube.com/@weilawyer' },
          { label: 'Naver 部落格', href: 'https://blog.naver.com/wei_lawyer/223461663913' },
          { label: '影音頁面', href: '/zh-hant/videos' }
        ]
      },
      {
        key: 'about',
        title: '事務所介紹',
        links: [
          { label: '事務所概覽', href: '/zh-hant/about' },
          { label: '律師介紹', href: '/zh-hant/lawyers' },
          { label: '據點資訊', href: '/zh-hant/contact#offices' },
          { label: '聯絡我們', href: '/zh-hant/contact' }
        ]
      }
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
        { label: 'View All', href: '/en/services' }
      ]
    },
    {
      key: 'videos',
      title: 'Media Center',
      links: [
        { label: 'YouTube @weilawyer', href: 'https://www.youtube.com/@weilawyer' },
        { label: 'Naver Blog', href: 'https://blog.naver.com/wei_lawyer/223461663913' },
        { label: 'Videos / Channels', href: '/en/videos' }
      ]
    },
    {
      key: 'about',
      title: 'About',
      links: [
        { label: 'Firm Overview', href: '/en/about' },
        { label: 'Lawyers', href: '/en/lawyers' },
        { label: 'Office Locations', href: '/en/contact#offices' },
        { label: 'Contact Us', href: '/en/contact' }
      ]
    }
  ];
}

export default function Header({ locale }: { locale: Locale }) {
  const content = siteContent[locale];
  const brandText = locale === 'ko' ? '법무법인 호정' : locale === 'zh-hant' ? '昊鼎國際法律事務所' : 'Hovering International Law Firm';
  const brandLogo = locale === 'zh-hant' ? '/images/brand/hovering-logo-zh.png' : '/images/brand/hovering-logo-ko.png';
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number; visible: boolean }>({
    left: 0,
    width: 0,
    visible: false
  });
  const mainNavRef = useRef<HTMLElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const closeTimeoutRef = useRef<number | null>(null);
  const menuLabel = locale === 'ko' ? '메뉴' : locale === 'zh-hant' ? '選單' : 'Menu';
  const searchLabel = locale === 'ko' ? '검색 열기' : locale === 'zh-hant' ? '開啟搜尋' : 'Open search';
  const skipLabel = locale === 'ko' ? '본문 바로가기' : locale === 'zh-hant' ? '跳到主要內容' : 'Skip to main content';
  const utilityLinks =
    locale === 'ko'
      ? [
          { label: '연락처', href: '/ko/contact' },
          { label: '오시는 길', href: '/ko/contact#offices' }
        ]
      : locale === 'zh-hant'
        ? [
            { label: '聯絡', href: '/zh-hant/contact' },
            { label: '據點', href: '/zh-hant/contact#offices' }
          ]
        : [
            { label: 'Contact', href: '/en/contact' },
            { label: 'Offices', href: '/en/contact#offices' }
          ];

  const mainNavItems = useMemo(() => buildMainNavItems(locale), [locale]);
  const megaPanels = useMemo(() => buildMegaPanels(locale), [locale]);
  const megaPanelKeys = useMemo(() => new Set(megaPanels.map((p) => p.key)), [megaPanels]);
  const hasMegaPanel = useCallback((key: string) => megaPanelKeys.has(key), [megaPanelKeys]);
  const isCurrentPath = useCallback((href: string) => {
    const current = pathname ?? '';
    return current === href || current.startsWith(`${href}/`) || current.startsWith(`${href}#`);
  }, [pathname]);

  const activeNavKey = useMemo(() => {
    const found = mainNavItems.find((item) => isCurrentPath(item.href));
    return found?.key ?? null;
  }, [isCurrentPath, mainNavItems]);

  const { koPath, zhPath, enPath } = useMemo(() => {
    const current = pathname ?? '';
    return {
      koPath: buildLocalePath(current, 'ko'),
      zhPath: buildLocalePath(current, 'zh-hant'),
      enPath: buildLocalePath(current, 'en')
    };
  }, [pathname]);

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
      setIndicatorStyle((prev) => ({ ...prev, visible: false }));
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
      visible
    });
  }, []);

  useEffect(() => {
    if (openMenu) {
      moveIndicator(openMenu, true);
      return;
    }
    if (activeNavKey) {
      moveIndicator(activeNavKey, true);
      return;
    }
    setIndicatorStyle((prev) => ({ ...prev, visible: false }));
  }, [activeNavKey, moveIndicator, openMenu, pathname]);

  useEffect(() => {
    if (searchOpen || drawerOpen) {
      closeMegaMenuNow();
    }
  }, [closeMegaMenuNow, drawerOpen, searchOpen]);

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && openMenu) {
        closeMegaMenuNow();
      }
    };
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, [closeMegaMenuNow, openMenu]);

  return (
    <header className={`header scrolled${openMenu ? ' mega-open' : ''}`}>
      <a className="skip-link" href="#main">
        {skipLabel}
      </a>
      <div className="header-utility">
        <div className="container">
          <nav className="utility-nav" aria-label={locale === 'ko' ? '보조 메뉴' : locale === 'zh-hant' ? '輔助選單' : 'Utility menu'}>
            {utilityLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <div className="utility-lang">
              <Link href={koPath} aria-current={locale === 'ko' ? 'page' : undefined}>
                KO
              </Link>
              <Link href={zhPath} aria-current={locale === 'zh-hant' ? 'page' : undefined}>
                中文
              </Link>
              <Link href={enPath} aria-current={locale === 'en' ? 'page' : undefined}>
                EN
              </Link>
            </div>
          </nav>
        </div>
      </div>

      <div className="header-main">
        <div className="container header-main-inner">
          <Link className="header-logo" href={`/${locale}`} aria-label="Home">
            <span className="logo-mark" aria-hidden>
              <Image src={brandLogo} alt="" width={508} height={80} priority />
            </span>
            <span className="logo-kr">{brandText}</span>
          </Link>

          <nav
            className={`main-nav${openMenu ? ' menu-open' : ''}`}
            id="mainNav"
            aria-label="Main"
            ref={mainNavRef}
            onMouseEnter={clearCloseTimeout}
            onMouseLeave={scheduleCloseMegaMenu}
          >
            <div
              className="nav-indicator"
              id="navIndicator"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.visible ? 1 : 0
              }}
            />
            <ul className="nav-list">
              {mainNavItems.map((item) => (
                <li
                  key={item.key}
                  className={`nav-item${openMenu === item.key ? ' active' : ''}`}
                  data-menu={item.key}
                  onMouseEnter={() => {
                    if (!hasMegaPanel(item.key)) return;
                    clearCloseTimeout();
                    moveIndicator(item.key, true);
                    setOpenMenu(item.key);
                  }}
                  onMouseLeave={() => {
                    if (!hasMegaPanel(item.key)) return;
                    scheduleCloseMegaMenu();
                  }}
                >
                  <Link
                    href={item.href}
                    className="nav-link"
                    aria-current={isCurrentPath(item.href) ? 'page' : undefined}
                    ref={(element) => {
                      linkRefs.current[item.key] = element;
                    }}
                    onFocus={() => {
                      if (!hasMegaPanel(item.key)) return;
                      clearCloseTimeout();
                      moveIndicator(item.key, true);
                      setOpenMenu(item.key);
                    }}
                    onClick={(event) => {
                      if (!hasMegaPanel(item.key)) {
                        closeMegaMenuNow();
                        return;
                      }
                      const isModifiedClick =
                        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
                      if (isModifiedClick) {
                        closeMegaMenuNow();
                        return;
                      }
                      if (openMenu !== item.key) {
                        event.preventDefault();
                        clearCloseTimeout();
                        moveIndicator(item.key, true);
                        setOpenMenu(item.key);
                        return;
                      }
                      closeMegaMenuNow();
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <button className="header-search-btn" type="button" onClick={() => setSearchOpen(true)} aria-label={searchLabel}>
              <svg className="header-search-icon" viewBox="0 0 24 24" aria-hidden>
                <circle cx="11" cy="11" r="7.2" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" />
              </svg>
            </button>
            <Link className="button nav-cta" href={content.nav.cta.href}>
              {content.nav.cta.label}
            </Link>
            <button
              className="icon-button mobile-toggle"
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label={menuLabel}
            >
              {menuLabel}
            </button>
          </div>
        </div>
        <div className="header-accent-line" />
      </div>

      <div
        className={`mega-menu${openMenu ? ' open' : ''}`}
        id="megaMenu"
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

      <div className={`mega-overlay${openMenu ? ' visible' : ''}`} id="megaOverlay" onClick={closeMegaMenuNow} />

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} locale={locale} />
      <MobileNavDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSearch={() => {
          setDrawerOpen(false);
          setSearchOpen(true);
        }}
        locale={locale}
      />
    </header>
  );
}
