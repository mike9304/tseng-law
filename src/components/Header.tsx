'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { SiteLocale } from '@/lib/locales';
import { toBuilderLocale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import LocaleFlagSwitcher from '@/components/LocaleFlagSwitcher';
import SearchOverlay from '@/components/SearchOverlay';
import MobileNavDrawer from '@/components/MobileNavDrawer';
import SmartLink from '@/components/SmartLink';
import {
  captureOverlayScrollSnapshots,
  scheduleOverlayScrollRestore,
} from '@/components/builder/published/overlayFocus';
import type { PublicSiteMember } from '@/lib/builder/members/members-engine';
import { getConsultationPublicMailto } from '@/lib/consultation/public-contact';

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

type MemberNavState = {
  status: 'loading' | 'signed-out' | 'signed-in';
  member?: PublicSiteMember;
};

function buildMainNavItems(locale: SiteLocale): MainNavItem[] {
  if (locale === 'ja') {
    return [
      { key: 'services', label: '取扱業務', href: '/ja/services' },
      { key: 'lawyers', label: '弁護士紹介', href: '/ja/lawyers' },
      { key: 'pricing', label: '費用案内', href: '/ja/pricing' },
      { key: 'insights', label: 'コラム', href: '/ja/columns' },
      { key: 'videos', label: 'メディア', href: '/ja/videos' },
      { key: 'directions', label: 'アクセス', href: '/ja/contact#offices' },
    ];
  }
  if (locale === 'ko') {
    return [
      { key: 'services', label: '업무분야', href: '/ko/services' },
      { key: 'lawyers', label: '변호사소개', href: '/ko/lawyers' },
      { key: 'pricing', label: '비용안내', href: '/ko/pricing' },
      { key: 'insights', label: '호정칼럼', href: '/ko/columns' },
      { key: 'videos', label: '미디어센터', href: '/ko/videos' },
      { key: 'directions', label: '오시는길', href: '/ko/contact#offices' }
    ];
  }

  if (locale === 'zh-hant') {
    return [
      { key: 'services', label: '服務領域', href: '/zh-hant/services' },
      { key: 'lawyers', label: '律師介紹', href: '/zh-hant/lawyers' },
      { key: 'pricing', label: '收費標準', href: '/zh-hant/pricing' },
      { key: 'insights', label: '昊鼎專欄', href: '/zh-hant/columns' },
      { key: 'videos', label: '媒體中心', href: '/zh-hant/videos' },
      { key: 'directions', label: '交通位置', href: '/zh-hant/contact#offices' }
    ];
  }

  return [
    { key: 'services', label: 'Services', href: '/en/services' },
    { key: 'lawyers', label: 'Lawyers', href: '/en/lawyers' },
    { key: 'pricing', label: 'Pricing', href: '/en/pricing' },
    { key: 'insights', label: 'Columns', href: '/en/columns' },
    { key: 'videos', label: 'Media Center', href: '/en/videos' },
    { key: 'directions', label: 'Directions', href: '/en/contact#offices' }
  ];
}

function buildMegaPanels(locale: SiteLocale): MegaPanel[] {
  if (locale === 'ja') {
    return [
      {
        key: 'insights',
        title: 'コラム',
        links: [
          { label: '全コラムを見る', href: '/ja/columns' },
        ],
      },
    ];
  }
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
          { label: '문의하기', href: getConsultationPublicMailto('ko') }
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
          { label: '聯絡我們', href: getConsultationPublicMailto('zh-hant') }
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
        { label: 'Contact Us', href: getConsultationPublicMailto('en') }
      ]
    }
  ];
}

export default function Header({ locale }: { locale: SiteLocale }) {
  const content = siteContent[locale];
  const brandText =
    locale === 'ko'
      ? '법무법인 호정'
      : locale === 'zh-hant'
        ? '昊鼎國際法律事務所'
        : locale === 'ja'
          ? '昊鼎国際法律事務所'
          : 'Hovering International Law Firm';
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [memberNav, setMemberNav] = useState<MemberNavState>({ status: 'loading' });
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number; visible: boolean }>({
    left: 0,
    width: 0,
    visible: false
  });
  const mainNavRef = useRef<HTMLElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const closeTimeoutRef = useRef<number | null>(null);
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);
  const restoreMobileToggleOnCloseRef = useRef(false);
  const menuLabel = locale === 'ko' ? '메뉴' : locale === 'zh-hant' ? '選單' : locale === 'ja' ? 'メニュー' : 'Menu';
  const openMenuLabel = locale === 'ko' ? '메뉴 열기' : locale === 'zh-hant' ? '開啟選單' : locale === 'ja' ? 'メニューを開く' : 'Open menu';
  const closeMenuLabel = locale === 'ko' ? '메뉴 닫기' : locale === 'zh-hant' ? '關閉選單' : locale === 'ja' ? 'メニューを閉じる' : 'Close menu';
  const searchLabel = locale === 'ko' ? '검색 열기' : locale === 'zh-hant' ? '開啟搜尋' : locale === 'ja' ? '検索を開く' : 'Open search';
  const skipLabel = locale === 'ko' ? '본문 바로가기' : locale === 'zh-hant' ? '跳到主要內容' : locale === 'ja' ? '本文へ' : 'Skip to main content';
  const homeLabel = locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : locale === 'ja' ? 'ホーム' : 'Home';
  const mainNavLabel = locale === 'ko' ? '주요 메뉴' : locale === 'zh-hant' ? '主要選單' : locale === 'ja' ? 'メインメニュー' : 'Main';
  const memberLabels =
    locale === 'ko'
      ? { login: '로그인', account: '내 계정', premium: '프리미엄', logout: '로그아웃' }
      : locale === 'zh-hant'
        ? { login: '登入', account: '我的帳戶', premium: '進階內容', logout: '登出' }
        : locale === 'ja'
          ? { login: 'ログイン', account: 'アカウント', premium: 'プレミアム', logout: 'ログアウト' }
        : { login: 'Log in', account: 'My account', premium: 'Premium', logout: 'Log out' };
  const utilityLinks =
    locale === 'ko'
      ? [
          { label: '연락처', href: '/ko/contact' },
          { label: '오시는 길', href: '/ko/contact#offices' }
        ]
      : locale === 'zh-hant'
        ? [
            { label: '聯絡方式', href: '/zh-hant/contact' },
            { label: '據點', href: '/zh-hant/contact#offices' }
          ]
        : locale === 'ja'
          ? [
              { label: '連絡先', href: '/ja/contact' },
              { label: 'アクセス', href: '/ja/contact#offices' }
            ]
          : [
              { label: 'Contact information', href: '/en/contact' },
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

  const currentPath = pathname ?? `/${locale}`;
  const memberLoginHref = `/${locale}/login?next=${encodeURIComponent(currentPath || `/${locale}/account`)}`;
  const canSeePremium = memberNav.member?.role === 'premium' || memberNav.member?.role === 'admin';

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

  const openMobileDrawer = useCallback(() => {
    restoreMobileToggleOnCloseRef.current = false;
    setDrawerOpen(true);
  }, []);

  const closeMobileDrawer = useCallback(() => {
    restoreMobileToggleOnCloseRef.current = true;
    setDrawerOpen(false);
  }, []);

  const openSearchFromMobileDrawer = useCallback(() => {
    restoreMobileToggleOnCloseRef.current = false;
    setDrawerOpen(false);
    setSearchOpen(true);
  }, []);

  const openSearchFromHeader = useCallback((opener: HTMLElement) => {
    const scrollSnapshots = captureOverlayScrollSnapshots(opener);
    setSearchOpen(true);
    scheduleOverlayScrollRestore(scrollSnapshots);
  }, []);

  const handleMemberLogout = useCallback(async () => {
    try {
      await fetch('/api/members/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } finally {
      setMemberNav({ status: 'signed-out' });
      if ((pathname ?? '').startsWith(`/${locale}/account`)) {
        window.location.assign(`/${locale}/login`);
      }
    }
  }, [locale, pathname]);

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
    if (locale === 'ja') {
      setMemberNav({ status: 'signed-out' });
      return;
    }

    let active = true;
    setMemberNav({ status: 'loading' });

    const loadMember = async () => {
      try {
        const response = await fetch(`/api/members/me?locale=${locale}`, {
          cache: 'no-store',
          credentials: 'include'
        });

        if (!active) return;

        if (!response.ok) {
          setMemberNav({ status: 'signed-out' });
          return;
        }

        const data = (await response.json()) as { member?: PublicSiteMember };
        setMemberNav(data.member ? { status: 'signed-in', member: data.member } : { status: 'signed-out' });
      } catch {
        if (active) {
          setMemberNav({ status: 'signed-out' });
        }
      }
    };

    void loadMember();

    return () => {
      active = false;
    };
  }, [locale, pathname]);

  useEffect(() => {
    if (drawerOpen || !restoreMobileToggleOnCloseRef.current) return;
    restoreMobileToggleOnCloseRef.current = false;
    const frame = window.requestAnimationFrame(() => {
      mobileToggleRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [drawerOpen]);

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
          <nav
            className="utility-nav"
            aria-label={
              locale === 'ko'
                ? '보조 메뉴'
                : locale === 'zh-hant'
                  ? '輔助選單'
                  : locale === 'ja'
                    ? '補助メニュー'
                    : 'Utility menu'
            }
          >
            {utilityLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            {locale !== 'ja' ? (
              <div className="utility-member-nav" data-member-nav-state={memberNav.status}>
                {memberNav.status === 'signed-in' ? (
                  <>
                    <Link href={`/${locale}/account`} data-member-role-link="account">
                      {memberLabels.account}
                    </Link>
                    {canSeePremium ? (
                      <Link href={`/${locale}/account/premium`} data-member-role-link="premium">
                        {memberLabels.premium}
                      </Link>
                    ) : null}
                    <button type="button" onClick={handleMemberLogout} data-member-role-link="logout">
                      {memberLabels.logout}
                    </button>
                  </>
                ) : (
                  <Link href={memberLoginHref} data-member-role-link="login">
                    {memberLabels.login}
                  </Link>
                )}
              </div>
            ) : null}
            <LocaleFlagSwitcher locale={locale} className="utility-lang" />
          </nav>
        </div>
      </div>

      <div className="header-main">
        <div className="container header-main-inner">
          <Link className="header-logo" href={`/${locale}`} aria-label={homeLabel}>
            <span className="logo-mark" aria-hidden>
              <Image src="/images/brand/hovering-seal-official.png" alt="" width={40} height={40} />
            </span>
            <span className="logo-kr">{brandText}</span>
          </Link>

          <nav
            className={`main-nav${openMenu ? ' menu-open' : ''}`}
            id="mainNav"
            aria-label={mainNavLabel}
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
                    aria-haspopup={hasMegaPanel(item.key) ? 'true' : undefined}
                    aria-expanded={hasMegaPanel(item.key) ? openMenu === item.key : undefined}
                    aria-controls={hasMegaPanel(item.key) ? `mega-panel-${item.key}` : undefined}
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
                      // Always let the click navigate to the parent page.
                      // Mega menus open on hover/focus already; intercepting
                      // the first click to just open the menu confused
                      // visitors who expected the link to take them to the
                      // overview page.
                      void event;
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
            {locale === 'ja' ? (
              <Link className="header-search-btn" href={`/${locale}/search`} aria-label={searchLabel}>
                <svg className="header-search-icon" viewBox="0 0 24 24" aria-hidden>
                  <circle cx="11" cy="11" r="7.2" />
                  <line x1="16.5" y1="16.5" x2="21" y2="21" />
                </svg>
              </Link>
            ) : (
              <button
                className="header-search-btn"
                type="button"
                onClick={(event) => openSearchFromHeader(event.currentTarget)}
                aria-label={searchLabel}
              >
                <svg className="header-search-icon" viewBox="0 0 24 24" aria-hidden>
                  <circle cx="11" cy="11" r="7.2" />
                  <line x1="16.5" y1="16.5" x2="21" y2="21" />
                </svg>
              </button>
            )}
            <Link className="button nav-cta" href={content.nav.cta.href}>
              {content.nav.cta.label}
            </Link>
            <button
              className="icon-button mobile-toggle"
              type="button"
              ref={mobileToggleRef}
              onClick={openMobileDrawer}
              aria-label={drawerOpen ? closeMenuLabel : openMenuLabel}
              aria-expanded={drawerOpen}
              aria-controls="public-mobile-nav-drawer"
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
          <div
            key={panel.key}
            id={`mega-panel-${panel.key}`}
            className={`mega-panel${openMenu === panel.key ? ' active' : ''}`}
            data-panel={panel.key}
          >
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

      {locale !== 'ja' ? (
        <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} locale={toBuilderLocale(locale)} />
      ) : null}
      <MobileNavDrawer
        open={drawerOpen}
        onClose={closeMobileDrawer}
        onSearch={openSearchFromMobileDrawer}
        locale={locale}
        memberNav={memberNav}
        memberLabels={memberLabels}
        memberLoginHref={memberLoginHref}
        onMemberLogout={handleMemberLogout}
      />
    </header>
  );
}
