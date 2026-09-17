'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toBuilderLocale } from '@/lib/locales';
import { isGuidanceLocale4, type PublicLocale8 } from '@/lib/public-guidance';
import {
  chromeSiteLocale,
  guidanceChromeLabels,
  guidanceHeaderNavItems,
  guidanceSearchLink,
  guidanceUtilityLinks,
  publicSiteContent,
} from '@/lib/public-site-chrome';
import LocaleFlagSwitcher from '@/components/LocaleFlagSwitcher';
import SearchOverlay from '@/components/SearchOverlay';
import MobileNavDrawer from '@/components/MobileNavDrawer';
import SmartLink from '@/components/SmartLink';
import styles from './PublicChrome.module.css';
import { installResponsiveHeaderFocus } from './responsive-header-focus';
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
  description: string;
  viewAll?: MegaLink;
  links: MegaLink[];
};

type MegaIntroKey = 'services' | 'insights' | 'videos' | 'about';

function megaIndexHref(locale: PublicLocale8, key: string): string {
  if (key === 'insights') return `/${locale}/columns`;
  if (key === 'about') return `/${locale}/about`;
  if (key === 'directions') return `/${locale}/contact#offices`;
  return `/${locale}/${key}`;
}

function withMegaIntro(
  locale: PublicLocale8,
  panel: { key: string; title: string; links: MegaLink[] },
): MegaPanel {
  const intro = isGuidanceLocale4(locale)
    ? undefined
    : publicSiteContent(locale).nav.mega[panel.key as MegaIntroKey];
  const indexHref = megaIndexHref(locale, panel.key);
  const hasViewAll = panel.links.some((link) => link.href === indexHref);
  return {
    ...panel,
    description: intro?.description ?? '',
    viewAll: intro && !hasViewAll ? { label: intro.viewAllLabel, href: indexHref } : undefined,
  };
}

type MainNavItem = {
  key: string;
  label: string;
  href: string;
};

type MemberNavState = {
  status: 'loading' | 'signed-out' | 'signed-in';
  member?: PublicSiteMember;
};

// The public header can wrap when text is enlarged. Share its real height with
// the existing main, hero and anchor offsets; CMS headers keep their own layout.
export function installPublicHeaderOffset(header: HTMLElement): () => void {
  const site = header.closest<HTMLElement>('.site[data-locale]');
  if (!site) return () => {};

  const style = header.ownerDocument.documentElement.style;
  const property = '--header-offset-desktop';
  const previousValue = style.getPropertyValue(property);
  const previousPriority = style.getPropertyPriority(property);
  let writtenValue = '';
  let frame: number | null = null;
  let disposed = false;

  const release = () => {
    if (writtenValue && style.getPropertyValue(property) === writtenValue) {
      if (previousValue) style.setProperty(property, previousValue, previousPriority);
      else style.removeProperty(property);
    }
    writtenValue = '';
    site.removeAttribute('data-public-header-measured');
  };
  const measure = () => {
    frame = null;
    if (disposed) return;
    const height = header.getBoundingClientRect().height;
    if (!Number.isFinite(height) || height <= 0) {
      release();
      return;
    }
    const value = `${Math.ceil(height)}px`;
    if (value === writtenValue) return;
    style.setProperty(property, value);
    writtenValue = value;
    site.setAttribute('data-public-header-measured', 'true');
  };
  const scheduleMeasure = () => {
    if (!disposed && frame === null) frame = window.requestAnimationFrame(measure);
  };
  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleMeasure);
  observer?.observe(header);
  window.addEventListener('resize', scheduleMeasure);
  measure();

  return () => {
    disposed = true;
    observer?.disconnect();
    window.removeEventListener('resize', scheduleMeasure);
    if (frame !== null) window.cancelAnimationFrame(frame);
    release();
  };
}

export function installPublicHeaderContentFit(header: HTMLElement): () => void {
  const probe = header.querySelector<HTMLElement>('[data-header-content-fit-probe]');
  const slot = header.querySelector<HTMLElement>('[data-header-content-fit-slot]');
  if (!probe || !slot) return () => {};

  const doc = header.ownerDocument;
  const toggleSelector = 'button.mobile-toggle';
  const drawerSelector = '#public-mobile-nav-drawer';
  const hiddenDesktopControls =
    '.main-nav .nav-link, .header-actions .nav-cta, .header-utility a, .header-utility button';
  const primaryLinkCandidates = [
    '.main-nav .nav-link[aria-current="page"]',
    '.main-nav .nav-link:not([aria-haspopup])',
    '.main-nav .nav-link',
  ];

  const isElement = (node: unknown): node is HTMLElement =>
    !!node && typeof (node as HTMLElement).matches === 'function';

  const focusTarget = (target: HTMLElement | null) => {
    if (!target || typeof target.focus !== 'function') return;
    target.focus({ preventScroll: true });
  };

  const moveFocusForCompact = (active: Element | null) => {
    if (!isElement(active) || typeof header.contains !== 'function' || !header.contains(active)) return;
    if (typeof probe.contains === 'function' && probe.contains(active)) return;
    const drawer = header.querySelector(drawerSelector);
    if (drawer && typeof drawer.contains === 'function' && drawer.contains(active)) return;
    if (!active.matches(hiddenDesktopControls)) return;
    const toggle = header.querySelector<HTMLElement>(toggleSelector);
    if (!toggle || typeof toggle.getAttribute !== 'function' || toggle.getAttribute('aria-expanded') === 'true') {
      return;
    }
    focusTarget(toggle);
  };

  const moveFocusForDesktop = (active: Element | null) => {
    const toggle = header.querySelector<HTMLElement>(toggleSelector);
    if (!toggle || active !== toggle) return;
    if (typeof toggle.getAttribute === 'function' && toggle.getAttribute('aria-expanded') === 'true') return;
    for (const selector of primaryLinkCandidates) {
      const link = header.querySelector<HTMLElement>(selector);
      if (link) {
        focusTarget(link);
        return;
      }
    }
  };

  const media = typeof window.matchMedia === 'function' ? window.matchMedia('(min-width: 75rem)') : null;
  const property = 'data-header-content-fit';
  let frame: number | null = null;
  let disposed = false;
  let writtenValue = '';

  const release = () => {
    if (writtenValue && header.getAttribute(property) === writtenValue) {
      header.removeAttribute(property);
    }
    writtenValue = '';
  };

  const measure = () => {
    frame = null;
    if (disposed) return;
    const active = doc?.activeElement ?? null;
    if (!media?.matches) {
      release();
      return;
    }

    const needed = probe.scrollWidth;
    const available = slot.clientWidth;
    if (!Number.isFinite(needed) || !Number.isFinite(available) || available <= 0) {
      return;
    }

    // Hidden compact nav can report scrollWidth 0; that is not a fit.
    // Only a measurable desktop candidate may restore the full header.
    if (needed <= 0) {
      return;
    }

    const nextValue = needed > available ? 'compact' : '';
    if (nextValue === writtenValue) return;
    if (nextValue) {
      header.setAttribute(property, nextValue);
      writtenValue = nextValue;
      moveFocusForCompact(active);
      return;
    }
    release();
    moveFocusForDesktop(active);
  };

  const scheduleMeasure = () => {
    if (!disposed && frame === null) frame = window.requestAnimationFrame(measure);
  };

  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleMeasure);
  observer?.observe(probe);
  observer?.observe(slot);
  window.addEventListener('resize', scheduleMeasure);
  media?.addEventListener('change', scheduleMeasure);

  const fonts = header.ownerDocument?.fonts;
  fonts?.addEventListener?.('loadingdone', scheduleMeasure);
  void fonts?.ready?.then(() => {
    if (!disposed) scheduleMeasure();
  });

  measure();

  return () => {
    disposed = true;
    observer?.disconnect();
    window.removeEventListener('resize', scheduleMeasure);
    media?.removeEventListener('change', scheduleMeasure);
    fonts?.removeEventListener?.('loadingdone', scheduleMeasure);
    if (frame !== null) window.cancelAnimationFrame(frame);
    release();
  };
}

function buildMainNavItems(locale: PublicLocale8): MainNavItem[] {
  if (isGuidanceLocale4(locale)) {
    return guidanceHeaderNavItems(locale);
  }
  if (locale === 'ja') {
    return [
      { key: 'services', label: '取扱業務', href: '/ja/services' },
      { key: 'lawyers', label: '日本チーム', href: '/ja/lawyers' },
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
    { key: 'lawyers', label: 'Our Team', href: '/en/lawyers' },
    { key: 'pricing', label: 'Pricing', href: '/en/pricing' },
    { key: 'insights', label: 'Insights', href: '/en/columns' },
    { key: 'videos', label: 'Media Center', href: '/en/videos' },
    { key: 'directions', label: 'Locations', href: '/en/contact#offices' }
  ];
}

function buildMegaPanels(locale: PublicLocale8): MegaPanel[] {
  // Guidance locales publish exactly ten core pages; there is no deeper tree to
  // reveal, so the mega menu stays empty (the nav links navigate directly).
  if (isGuidanceLocale4(locale)) return [];
  if (locale === 'ja') {
    return [
      withMegaIntro(locale, {
        key: 'services',
        title: '取扱業務',
        links: [
          { label: '投資・会社設立', href: '/ja/services/investment' },
          { label: '民事訴訟・損害賠償', href: '/ja/services/civil' },
          { label: '家事事件', href: '/ja/services/family' },
          { label: '労働・雇用', href: '/ja/services/labor' },
          { label: '刑事事件', href: '/ja/services/criminal' },
          { label: '知財・金融紛争', href: '/ja/services/ip' },
          { label: 'すべて見る', href: '/ja/services' },
        ],
      }),
      withMegaIntro(locale, {
        key: 'insights',
        title: 'コラム',
        links: [
          { label: '全コラムを見る', href: '/ja/columns' },
        ],
      }),
    ];
  }
  if (locale === 'ko') {
    return [
      withMegaIntro(locale, {
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
      }),
      withMegaIntro(locale, {
        key: 'videos',
        title: '미디어센터',
        links: [
          { label: 'YouTube @weilawyer', href: 'https://www.youtube.com/@weilawyer' },
          { label: '네이버 블로그', href: 'https://blog.naver.com/wei_lawyer/223461663913' },
          { label: '영상/채널 페이지', href: '/ko/videos' }
        ]
      }),
      withMegaIntro(locale, {
        key: 'about',
        title: '법인소개',
        links: [
          { label: '법인 개요', href: '/ko/about' },
          { label: '변호사 소개', href: '/ko/lawyers' },
          { label: '오시는 길', href: '/ko/contact#offices' },
          { label: '문의하기', href: getConsultationPublicMailto('ko') }
        ]
      })
    ];
  }

  if (locale === 'zh-hant') {
    return [
      withMegaIntro(locale, {
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
      }),
      withMegaIntro(locale, {
        key: 'videos',
        title: '媒體中心',
        links: [
          { label: 'YouTube @weilawyer', href: 'https://www.youtube.com/@weilawyer' },
          { label: 'Naver 部落格', href: 'https://blog.naver.com/wei_lawyer/223461663913' },
          { label: '影音頁面', href: '/zh-hant/videos' }
        ]
      }),
      withMegaIntro(locale, {
        key: 'about',
        title: '事務所介紹',
        links: [
          { label: '事務所概覽', href: '/zh-hant/about' },
          { label: '律師介紹', href: '/zh-hant/lawyers' },
          { label: '據點資訊', href: '/zh-hant/contact#offices' },
          { label: '聯絡我們', href: getConsultationPublicMailto('zh-hant') }
        ]
      })
    ];
  }

  return [
    withMegaIntro(locale, {
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
    }),
    withMegaIntro(locale, {
      key: 'videos',
      title: 'Media Center',
      links: [
        { label: 'YouTube @weilawyer', href: 'https://www.youtube.com/@weilawyer' },
        { label: 'Naver Blog', href: 'https://blog.naver.com/wei_lawyer/223461663913' },
        { label: 'Videos / Channels', href: '/en/videos' }
      ]
    }),
    withMegaIntro(locale, {
      key: 'about',
      title: 'About',
      links: [
        { label: 'Firm Overview', href: '/en/about' },
        { label: 'International Team', href: '/en/lawyers' },
        { label: 'Office Locations', href: '/en/contact#offices' },
        { label: 'Contact Us', href: getConsultationPublicMailto('en') }
      ]
    })
  ];
}

export default function Header({ locale }: { locale: PublicLocale8 }) {
  const content = publicSiteContent(locale);
  const isGuidance = isGuidanceLocale4(locale);
  const chromeLocale = chromeSiteLocale(locale);
  const guidanceSearch = guidanceSearchLink(locale);
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
  const headerRef = useRef<HTMLElement | null>(null);
  const mainNavRef = useRef<HTMLElement | null>(null);
  const megaTriggerRowRef = useRef<HTMLDivElement | null>(null);
  const megaPanelRef = useRef<HTMLDivElement | null>(null);
  const focusExitFrameRef = useRef<number | null>(null);
  const restoringMegaTriggerFocusRef = useRef(false);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const closeTimeoutRef = useRef<number | null>(null);
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);
  const restoreMobileToggleOnCloseRef = useRef(false);
  useEffect(() => {
    if (!headerRef.current) return;
    return installPublicHeaderOffset(headerRef.current);
  }, []);
  useLayoutEffect(() => {
    if (!headerRef.current) return;
    const header = headerRef.current;
    const cleanupFit = installPublicHeaderContentFit(header);
    const cleanupFocus = installResponsiveHeaderFocus(header, {
      desktopControlSelector: '.main-nav .nav-link, .header-actions .nav-cta, .header-utility a, .header-utility button',
      desktopRestoreSelector: '.main-nav a.nav-link',
      toggleSelector: 'button.mobile-toggle',
      drawerSelector: '#public-mobile-nav-drawer',
    });
    return () => {
      cleanupFocus();
      cleanupFit();
    };
  }, [locale]);
  // vi/id/th/fil publish their own skip-link and menu labels; the ko/zh/ja
  // ladder below would otherwise drop them to English.
  const guidanceLabels = guidanceChromeLabels(locale);
  const menuLabel = guidanceLabels
    ? guidanceLabels.menuLabel
    : locale === 'ko' ? '메뉴' : locale === 'zh-hant' ? '選單' : locale === 'ja' ? 'メニュー' : 'Menu';
  const openMenuLabel = guidanceLabels
    ? menuLabel
    : locale === 'ko' ? '메뉴 열기' : locale === 'zh-hant' ? '開啟選單' : locale === 'ja' ? 'メニューを開く' : 'Open menu';
  const closeMenuLabel = guidanceLabels
    ? menuLabel
    : locale === 'ko' ? '메뉴 닫기' : locale === 'zh-hant' ? '關閉選單' : locale === 'ja' ? 'メニューを閉じる' : 'Close menu';
  const searchLabel = locale === 'ko' ? '검색 열기' : locale === 'zh-hant' ? '開啟搜尋' : locale === 'ja' ? '検索を開く' : 'Open search';
  const skipLabel = guidanceLabels
    ? guidanceLabels.skipLink
    : locale === 'ko' ? '본문 바로가기' : locale === 'zh-hant' ? '跳到主要內容' : locale === 'ja' ? '本文へ' : 'Skip to main content';
  const homeLabel = locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : locale === 'ja' ? 'ホーム' : 'Home';
  const mainNavLabel = locale === 'ko' ? '주요 메뉴' : locale === 'zh-hant' ? '主要選單' : locale === 'ja' ? 'メインメニュー' : 'Main menu';
  const memberLabels =
    locale === 'ko'
      ? { login: '로그인', account: '내 계정', premium: '프리미엄', logout: '로그아웃' }
      : locale === 'zh-hant'
        ? { login: '登入', account: '我的帳戶', premium: '進階內容', logout: '登出' }
        : locale === 'ja'
          ? { login: 'ログイン', account: 'アカウント', premium: 'プレミアム', logout: 'ログアウト' }
        : { login: 'Log in', account: 'My account', premium: 'Premium', logout: 'Log out' };
  const utilityLinks = isGuidance
    ? guidanceUtilityLinks(locale)
    : locale === 'ko'
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

  const currentPath = pathname ?? `/${locale}`;
  const memberLoginHref = `/${locale}/login?next=${encodeURIComponent(currentPath || `/${locale}/account`)}`;
  const canSeePremium = memberNav.member?.role === 'premium' || memberNav.member?.role === 'admin';

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const cancelFocusExitCheck = useCallback(() => {
    if (focusExitFrameRef.current !== null) {
      window.cancelAnimationFrame(focusExitFrameRef.current);
      focusExitFrameRef.current = null;
    }
  }, []);

  const closeMegaMenuNow = useCallback(() => {
    cancelFocusExitCheck();
    clearCloseTimeout();
    setOpenMenu(null);
  }, [cancelFocusExitCheck, clearCloseTimeout]);

  const containsMegaFocus = useCallback((target: EventTarget | null) =>
    target instanceof Node && Boolean(megaTriggerRowRef.current?.contains(target) || megaPanelRef.current?.contains(target)), []);

  const handleMegaFocus = useCallback(() => {
    cancelFocusExitCheck();
    clearCloseTimeout();
  }, [cancelFocusExitCheck, clearCloseTimeout]);

  // Generic Grok pointer provenance, locally bound to the existing row/panel.
  // Escape restoration remains in the existing Header keydown handler.
  useEffect(() => {
    if (!openMenu) return;
    let inRegionPointer = false;
    // This Header close is idempotent; no external callback needs a once guard.
    const dismiss = () => {
      inRegionPointer = false;
      closeMegaMenuNow();
    };

    let raf = 0;
    const cancelPendingPointerEnd = () => {
      window.cancelAnimationFrame(raf);
      raf = 0;
    };

    const clearPointerIntent = () => {
      cancelPendingPointerEnd();
      inRegionPointer = false;
    };

    const inRegion = (node: EventTarget | null) =>
      containsMegaFocus(node);

    const endInRegionPointer = () => {
      // Drop the flag after this frame so a focusout that still belongs to
      // this gesture (relatedTarget === null) can see it. rAF is not a
      // linger-timeout: keyboard / outside intent clears immediately, and
      // the next genuine focus exit is unmasked even in this same frame.
      cancelPendingPointerEnd();
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        inRegionPointer = false;
      });
    };

    const onPointerDown = (event: PointerEvent) => {
      cancelPendingPointerEnd();
      if (inRegion(event.target)) {
        inRegionPointer = true;
        return;
      }
      inRegionPointer = false;
      dismiss();
    };

    const onFocusOut = (event: FocusEvent) => {
      if (!inRegion(event.target)) return;
      if (inRegion(event.relatedTarget)) return;

      // Click/tap on non-focusable interior: relatedTarget is null, but
      // this is not a leave. Tab to chrome / other window: also null,
      // with no in-region pointer → dismiss.
      if (event.relatedTarget == null && inRegionPointer) return;

      dismiss();
    };

    const onDocumentFocusIn = (event: FocusEvent) => {
      if (inRegion(event.target)) return;
      dismiss();
    };

    const onKeyDown = () => {
      // Do not assume a frame has elapsed. Tab / Escape after pointerup
      // in the same frame is keyboard intent, not an interior click.
      clearPointerIntent();
    };

    // Capture so an interior stopPropagation cannot hide outside pointerdown
    // or a region focusout. Containment always reads live region refs (portals
    // / late-mounted panels). Do not snapshot nodes at effect start.
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("pointerup", endInRegionPointer, true);
    document.addEventListener("pointercancel", endInRegionPointer, true);
    document.addEventListener("focusout", onFocusOut, true);
    document.addEventListener("focusin", onDocumentFocusIn);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelPendingPointerEnd();
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("pointerup", endInRegionPointer, true);
      document.removeEventListener("pointercancel", endInRegionPointer, true);
      document.removeEventListener("focusout", onFocusOut, true);
      document.removeEventListener("focusin", onDocumentFocusIn);
      document.removeEventListener("keydown", onKeyDown);
      inRegionPointer = false;
    };
  }, [openMenu, closeMegaMenuNow, containsMegaFocus]);

  useEffect(() => () => {
    cancelFocusExitCheck();
    clearCloseTimeout();
  }, [cancelFocusExitCheck, clearCloseTimeout]);

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
    if (locale === 'ja' || isGuidanceLocale4(locale)) {
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
        const restoreTrigger = megaPanelRef.current?.contains(document.activeElement)
          ? linkRefs.current[openMenu]
          : null;
        closeMegaMenuNow();
        if (restoreTrigger) {
          restoringMegaTriggerFocusRef.current = true;
          try {
            restoreTrigger.focus({ preventScroll: true });
          } finally {
            restoringMegaTriggerFocusRef.current = false;
          }
        }
      }
    };
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, [closeMegaMenuNow, openMenu]);

  return (
    <header ref={headerRef} data-public-site-header className={`header scrolled${openMenu ? ' mega-open' : ''} ${styles.header}`}>
      <a className="skip-link" href="#main">
        {skipLabel}
      </a>
      <div className={`header-utility ${styles.headerUtility}`}>
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
            {locale !== 'ja' && !isGuidance ? (
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

      <div className={`header-main ${styles.headerMain}`}>
        <div
          ref={megaTriggerRowRef}
          className={`container header-main-inner ${styles.headerMainInner}`}
          data-header-content-fit-slot
          onFocusCapture={handleMegaFocus}
        >
          <div className={styles.contentFitProbe} data-header-content-fit-probe aria-hidden="true">
            <span className={styles.contentFitProbeLogo}>
              <span className={styles.contentFitProbeMark} />
              {locale === 'en' ? (
                <span className={styles.contentFitProbeBrand}>
                  <span className={styles.brandLine}>Hovering International</span>
                  {' '}
                  <span className={styles.brandLine}>Law Firm</span>
                </span>
              ) : (
                <span className={styles.contentFitProbeBrand}>{brandText}</span>
              )}
            </span>
            <span className={styles.contentFitProbeNav}>
              {mainNavItems.map((item) => (
                <span key={item.key} className="nav-link">{item.label}</span>
              ))}
            </span>
            <span className={styles.contentFitProbeActions}>
              <span className={styles.contentFitProbeSearch} />
              <span className="button nav-cta">{content.nav.cta.label}</span>
            </span>
          </div>
          <Link className={`header-logo ${styles.headerLogo}`} href={`/${locale}`} aria-label={homeLabel}>
            <span className={`logo-mark ${styles.logoMark}`} aria-hidden>
              <Image src="/images/brand/hovering-seal-official.png" alt="" width={40} height={40} />
            </span>
            {locale === 'en' ? (
              <span className={`logo-kr ${styles.brandText} ${styles.brandTextEn}`}>
                <span className={styles.brandLine}>Hovering International</span>
                {' '}
                <span className={styles.brandLine}>Law Firm</span>
              </span>
            ) : (
              <span className={`logo-kr ${styles.brandText}`}>{brandText}</span>
            )}
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
                      if (restoringMegaTriggerFocusRef.current || !hasMegaPanel(item.key)) return;
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

          <div className={`header-actions ${styles.headerActions}`}>
            {locale === 'ja' || isGuidance ? (
              <Link
                className="header-search-btn"
                href={guidanceSearch ? guidanceSearch.href : `/${locale}/search`}
                aria-label={guidanceSearch ? guidanceSearch.label : searchLabel}
              >
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
              className={`icon-button mobile-toggle ${styles.menuToggle}`}
              type="button"
              ref={mobileToggleRef}
              onClick={openMobileDrawer}
              aria-label={drawerOpen ? closeMenuLabel : openMenuLabel}
              aria-expanded={drawerOpen}
              aria-controls="public-mobile-nav-drawer"
            >
              <svg className={styles.menuIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </button>
          </div>
        </div>
        <div className="header-accent-line" />
      </div>

      <div
        className={`mega-menu${openMenu ? ' open' : ''}`}
        id="megaMenu"
        onFocusCapture={handleMegaFocus}
        aria-hidden={openMenu ? 'false' : 'true'}
        onMouseEnter={clearCloseTimeout}
        onMouseLeave={scheduleCloseMegaMenu}
      >
        {megaPanels.map((panel) => (
          <div
            key={panel.key}
            id={`mega-panel-${panel.key}`}
            ref={openMenu === panel.key ? megaPanelRef : undefined}
            className={`mega-panel${openMenu === panel.key ? ' active' : ''}`}
            data-panel={panel.key}
            aria-hidden={openMenu === panel.key ? undefined : true}
            {...{ inert: openMenu !== panel.key }}
          >
            <div className="container">
              <div className="mega-layout">
                <div className="mega-intro">
                  <h2 className="mega-title">{panel.title}</h2>
                  {panel.description ? <p className="mega-description">{panel.description}</p> : null}
                  {panel.viewAll ? (
                    <span onClick={closeMegaMenuNow}>
                      <SmartLink className="mega-view-all" href={panel.viewAll.href}>
                        {panel.viewAll.label}
                      </SmartLink>
                    </span>
                  ) : null}
                </div>
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

      {locale !== 'ja' && !isGuidance ? (
        <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} locale={toBuilderLocale(chromeLocale)} />
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
