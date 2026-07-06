'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import type { BuilderNavItem, BuilderSiteSettings, BuilderTheme } from '@/lib/builder/site/types';
import { buildSitePagePath, comparableSitePath, normalizeSiteHref } from '@/lib/builder/site/paths';
import { filterNavigationForLocale } from '@/lib/builder/site/navigation';
import { resolveBrandLogo } from '@/lib/builder/site/theme';
import { siteContent } from '@/data/site-content';
import SearchOverlay from '@/components/SearchOverlay';
import { buildHeaderMegaPanels, type HeaderMegaPanel } from '@/lib/builder/site/header-mega';
import {
  captureOverlayScrollSnapshots,
  scheduleOverlayScrollRestore,
  usePublishedOverlayFocus,
} from '@/components/builder/published/overlayFocus';
import { getPublishedSiteHeaderCopy } from '@/components/builder/published/published-site-header-copy';
import type { PublicSiteMember } from '@/lib/builder/members/members-engine';

type HeaderNavSpec = {
  key: string;
  slug: string;
  labels: Record<Locale, string>;
};

export type HeaderNavItem = HeaderNavSpec & {
  href: string;
  source?: BuilderNavItem;
  canonicalLabel?: boolean;
};

type MemberNavState = {
  authenticated: boolean;
  member?: Pick<PublicSiteMember, 'name' | 'role'>;
};

type NavigationMoveDirection = 'up' | 'down';
type NavigationLabelDraft = Record<Locale, string>;

export type SiteHeaderMemberNavPreview = MemberNavState;

const HEADER_NAV_SPECS: HeaderNavSpec[] = [
  { key: 'services', slug: 'services', labels: { ko: '업무분야', 'zh-hant': '服務領域', en: 'Services' } },
  { key: 'lawyers', slug: 'lawyers', labels: { ko: '변호사소개', 'zh-hant': '律師介紹', en: 'Lawyers' } },
  { key: 'pricing', slug: 'pricing', labels: { ko: '비용안내', 'zh-hant': '收費標準', en: 'Pricing' } },
  { key: 'columns', slug: 'columns', labels: { ko: '호정칼럼', 'zh-hant': '昊鼎專欄', en: 'Columns' } },
  { key: 'videos', slug: 'videos', labels: { ko: '미디어센터', 'zh-hant': '媒體中心', en: 'Media Center' } },
  { key: 'reviews', slug: 'reviews', labels: { ko: '고객후기', 'zh-hant': '客戶評價', en: 'Reviews' } },
];

const STANDARD_NON_HEADER_SLUGS = ['about', 'contact', 'faq', 'privacy', 'disclaimer'] as const;

function getLabel(item: BuilderNavItem | undefined, fallback: Record<Locale, string>, locale: Locale): string {
  if (!item) return fallback[locale];
  if (typeof item.label === 'string') return item.label;
  return item.label[locale] || item.label.ko || item.label.en || item.label['zh-hant'] || fallback[locale];
}

function localizedPath(locale: Locale, slug: string): string {
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

function fallbackNavLabel(label: BuilderNavItem['label'], locale: Locale): string {
  if (typeof label === 'string') return label;
  return label[locale] || label.ko || label.en || label['zh-hant'] || 'Menu';
}

function labelsFromNavItem(item: BuilderNavItem, locale: Locale): Record<Locale, string> {
  const fallback = fallbackNavLabel(item.label, locale);
  if (typeof item.label === 'string') {
    return { ko: fallback, 'zh-hant': fallback, en: fallback };
  }
  return {
    ko: item.label.ko || fallback,
    'zh-hant': item.label['zh-hant'] || fallback,
    en: item.label.en || fallback,
  };
}

function emptyNavigationLabelDraft(): NavigationLabelDraft {
  return { ko: '', 'zh-hant': '', en: '' };
}

function normalizedNavigationLabelDraft(labels: NavigationLabelDraft, fallbackUntitled: string): NavigationLabelDraft {
  const fallback = labels.ko.trim() || labels.en.trim() || labels['zh-hant'].trim() || fallbackUntitled;
  return {
    ko: labels.ko.trim() || fallback,
    'zh-hant': labels['zh-hant'].trim() || fallback,
    en: labels.en.trim() || fallback,
  };
}

function navigationTranslationManagerHref(locale: Locale, navItemId: string, targetLocale?: Locale): string {
  const params = new URLSearchParams({
    sourceLocale: 'ko',
    category: 'navigation',
    search: `nav:${navItemId}:label`,
  });
  if (targetLocale && targetLocale !== 'ko') {
    params.set('target', targetLocale);
  }
  return `/${locale}/admin-builder/translations?${params.toString()}`;
}

function resetBuilderCanvasHorizontalScroll(opener: HTMLElement): void {
  const scrollRoot = opener.closest('[data-builder-canvas-scroll-root="true"]');
  if (scrollRoot instanceof HTMLElement) {
    scrollRoot.scrollLeft = 0;
  }
}

function matchingHeaderSpec(item: BuilderNavItem, locale: Locale): HeaderNavSpec | null {
  return HEADER_NAV_SPECS.find((spec) => {
    const path = localizedPath(locale, spec.slug);
    return comparableSitePath(normalizeSiteHref(item.href, locale), locale) === comparableSitePath(path, locale)
      || item.id === `nav-${spec.key}`;
  }) ?? null;
}

function isStandardNonHeaderNavigationItem(item: BuilderNavItem, locale: Locale): boolean {
  const path = comparableSitePath(normalizeSiteHref(item.href, locale), locale);
  return STANDARD_NON_HEADER_SLUGS.some((slug) => (
    path === comparableSitePath(localizedPath(locale, slug), locale)
  ));
}

function isHomeNavigationItem(item: BuilderNavItem, locale: Locale): boolean {
  return item.id === 'nav-home'
    || comparableSitePath(normalizeSiteHref(item.href, locale), locale) === comparableSitePath(localizedPath(locale, ''), locale);
}

function localeSwitchPath(targetLocale: Locale, currentSlug: string): string {
  return currentSlug ? `/${targetLocale}/${currentSlug}` : `/${targetLocale}`;
}

export function buildHeaderNavItems(
  navItems: BuilderNavItem[],
  locale: Locale,
  options: { canonicalStandardNav?: boolean } = {},
): HeaderNavItem[] {
  const visibleNavItems = filterNavigationForLocale(navItems, locale);
  const usedSpecKeys = new Set<string>();
  const indexedItems: Array<{ item: HeaderNavItem; sourceIndex: number; specIndex: number }> = [];
  const canonicalStandardNav = options.canonicalStandardNav === true;

  visibleNavItems.forEach((source, sourceIndex) => {
    if (isHomeNavigationItem(source, locale)) return;
    const spec = matchingHeaderSpec(source, locale);
    if (spec) {
      if (usedSpecKeys.has(spec.key)) return;
      usedSpecKeys.add(spec.key);
      indexedItems.push({
        item: {
          ...spec,
          source,
          href: canonicalStandardNav ? localizedPath(locale, spec.slug) : normalizeSiteHref(source.href, locale),
          canonicalLabel: canonicalStandardNav,
        },
        sourceIndex,
        specIndex: HEADER_NAV_SPECS.findIndex((candidate) => candidate.key === spec.key),
      });
      return;
    }

    if (canonicalStandardNav && isStandardNonHeaderNavigationItem(source, locale)) return;

    indexedItems.push({
      item: {
        key: source.id,
        slug: '',
        labels: labelsFromNavItem(source, locale),
        source,
        href: normalizeSiteHref(source.href, locale),
      },
      sourceIndex,
      specIndex: HEADER_NAV_SPECS.length + sourceIndex,
    });
  });

  HEADER_NAV_SPECS.forEach((spec, specIndex) => {
    if (usedSpecKeys.has(spec.key)) return;
    indexedItems.push({
      item: {
        ...spec,
        href: localizedPath(locale, spec.slug),
      },
      sourceIndex: Number.MAX_SAFE_INTEGER,
      specIndex,
    });
  });

  return indexedItems
    .sort((left, right) => {
      if (canonicalStandardNav) return left.specIndex - right.specIndex;

      const leftIndex = left.sourceIndex < Number.MAX_SAFE_INTEGER ? left.sourceIndex : Number.MAX_SAFE_INTEGER + left.specIndex;
      const rightIndex = right.sourceIndex < Number.MAX_SAFE_INTEGER ? right.sourceIndex : Number.MAX_SAFE_INTEGER + right.specIndex;
      return leftIndex - rightIndex;
    })
    .map(({ item }) => item);
}

export function getHeaderNavItemLabel(item: HeaderNavItem, locale: Locale): string {
  return item.canonicalLabel ? item.labels[locale] : getLabel(item.source, item.labels, locale);
}

export default function SiteHeader({
  settings,
  navItems,
  locale,
  currentSlug,
  onNavigate,
  mobileMode = false,
  mobileSticky = false,
  mobileHamburger = 'auto',
  canonicalStandardNav = false,
  builderEditable = false,
  activeBuilderNavItemId,
  onRequestEditNavItem,
  onRequestRenameNavItem,
  onRequestAddNavChild,
  onRequestMoveNavItem,
  onRequestEditSiteBrand,
  onRequestOpenMobileMenu,
  memberNavPreview,
}: {
  siteName: string;
  settings?: BuilderSiteSettings;
  theme?: BuilderTheme;
  navItems: BuilderNavItem[];
  locale: Locale;
  currentSlug: string;
  onNavigate?: (href: string) => void;
  mobileMode?: boolean;
  mobileSticky?: boolean;
  mobileHamburger?: 'auto' | 'off' | 'force';
  canonicalStandardNav?: boolean;
  builderEditable?: boolean;
  activeBuilderNavItemId?: string | null;
  onRequestEditNavItem?: (itemId: string) => void;
  onRequestRenameNavItem?: (itemId: string, labels: NavigationLabelDraft) => boolean | void | Promise<boolean | void>;
  onRequestAddNavChild?: (parentItemId: string) => void;
  onRequestMoveNavItem?: (itemId: string, direction: NavigationMoveDirection) => void;
  onRequestEditSiteBrand?: () => void;
  onRequestOpenMobileMenu?: () => void;
  memberNavPreview?: SiteHeaderMemberNavPreview;
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pinnedMenu, setPinnedMenu] = useState<string | null>(null);
  const [builderEditingMenu, setBuilderEditingMenu] = useState<string | null>(null);
  const [builderMobileRenamingId, setBuilderMobileRenamingId] = useState<string | null>(null);
  const [builderMobileRenameValues, setBuilderMobileRenameValues] = useState<NavigationLabelDraft>(() => emptyNavigationLabelDraft());
  const [builderMobileRenameSaving, setBuilderMobileRenameSaving] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, visible: false });
  const [memberNav, setMemberNav] = useState<MemberNavState>({ authenticated: false });
  const mainNavRef = useRef<HTMLElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const closeTimeoutRef = useRef<number | null>(null);
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);
  const mobileCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuOpenerRef = useRef<HTMLElement | null>(null);
  const builderMobileRenameInputRef = useRef<HTMLInputElement | null>(null);
  const displayNavItems = useMemo(
    () => buildHeaderNavItems(navItems, locale, { canonicalStandardNav }),
    [canonicalStandardNav, locale, navItems],
  );
  const megaPanels = useMemo<HeaderMegaPanel[]>(() => buildHeaderMegaPanels(locale, displayNavItems), [displayNavItems, locale]);
  const megaPanelKeys = useMemo(() => new Set<string>(megaPanels.map((panel) => panel.key)), [megaPanels]);
  const currentPath = buildSitePagePath(locale, currentSlug);
  const searchLabel = locale === 'ko' ? '검색 열기' : locale === 'zh-hant' ? '開啟搜尋' : 'Open search';
  const mobileEditLabel = locale === 'ko' ? '편집' : locale === 'zh-hant' ? '編輯' : 'Edit';
  const mobileRenameLabel = locale === 'ko' ? '이름' : locale === 'zh-hant' ? '命名' : 'Rename';
  const mobileRenameInputLabel = locale === 'ko' ? '메뉴 이름' : locale === 'zh-hant' ? '選單名稱' : 'Menu name';
  const mobileRenameSaveLabel = locale === 'ko' ? '저장' : locale === 'zh-hant' ? '儲存' : 'Save';
  const mobileRenameCancelLabel = locale === 'ko' ? '취소' : locale === 'zh-hant' ? '取消' : 'Cancel';
  const mobileTranslationManagerLabel = locale === 'ko' ? '번역 관리' : locale === 'zh-hant' ? '翻譯管理' : 'Translations';
  const mobileAddLabel = locale === 'ko' ? '하위 추가' : locale === 'zh-hant' ? '新增子項' : 'Add sub';
  const mobileMoveUpLabel = locale === 'ko' ? '위로' : locale === 'zh-hant' ? '上移' : 'Move up';
  const mobileMoveDownLabel = locale === 'ko' ? '아래로' : locale === 'zh-hant' ? '下移' : 'Move down';
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
  const forceMobileNavigation = mobileMode || mobileHamburger === 'force';
  const suppressMobileNavigation = mobileHamburger === 'off';
  const accountLabel = locale === 'ko' ? '내 계정' : locale === 'zh-hant' ? '我的帳戶' : 'Account';
  const loginLabel = locale === 'ko' ? '로그인' : locale === 'zh-hant' ? '登入' : 'Sign in';
  const premiumLabel = locale === 'ko' ? '프리미엄' : locale === 'zh-hant' ? '進階會員' : 'Premium';
  const logoutLabel = locale === 'ko' ? '로그아웃' : locale === 'zh-hant' ? '登出' : 'Sign out';
  const homeLabel = locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : 'Home';
  const publishedCopy = useMemo(() => getPublishedSiteHeaderCopy(locale), [locale]);
  const mainNavLabel = publishedCopy.mainNavLabel;
  const mobileDrawerLabel = locale === 'ko' ? '모바일 메뉴' : locale === 'zh-hant' ? '行動選單' : 'Mobile menu';
  const mobileNavLabel = locale === 'ko' ? '모바일 주요 메뉴' : locale === 'zh-hant' ? '行動主要選單' : 'Mobile main menu';
  const mobileCloseLabel = locale === 'ko' ? '닫기' : locale === 'zh-hant' ? '關閉' : 'Close';
  const memberCanSeePremium = memberNav.member?.role === 'premium' || memberNav.member?.role === 'admin';

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
    if (searchOpen) setMobileMenuOpen(false);
  }, [closeMegaMenuNow, searchOpen]);

  const openSearchFromHeader = useCallback((opener: HTMLElement) => {
    if (builderEditable) resetBuilderCanvasHorizontalScroll(opener);
    const scrollSnapshots = captureOverlayScrollSnapshots(opener);
    setSearchOpen(true);
    scheduleOverlayScrollRestore(scrollSnapshots);
  }, [builderEditable]);

  usePublishedOverlayFocus({
    open: mobileMenuOpen,
    overlayRef: mobilePanelRef,
    initialFocusRef: mobileCloseButtonRef,
    openerRef: mobileMenuOpenerRef,
  });

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      if (builderMobileRenamingId) {
        setBuilderMobileRenamingId(null);
        setBuilderMobileRenameValues(emptyNavigationLabelDraft());
        setBuilderMobileRenameSaving(false);
        return;
      }
      setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [builderMobileRenamingId, mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      setBuilderMobileRenamingId(null);
      setBuilderMobileRenameValues(emptyNavigationLabelDraft());
      setBuilderMobileRenameSaving(false);
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!builderMobileRenamingId || !mobileMenuOpen) return;
    const timer = window.setTimeout(() => {
      builderMobileRenameInputRef.current?.focus();
      builderMobileRenameInputRef.current?.select();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [builderMobileRenamingId, mobileMenuOpen]);

  useEffect(() => {
    if (builderEditable) return;
    setBuilderEditingMenu(null);
  }, [builderEditable]);

  useEffect(() => {
    if (!builderEditable) return;
    if (memberNavPreview) {
      setMemberNav(memberNavPreview);
      return;
    }
    setMemberNav({ authenticated: false });
  }, [builderEditable, memberNavPreview]);

  useEffect(() => {
    if (builderEditable) return undefined;
    let cancelled = false;
    fetch(`/api/members/me?locale=${locale}`, { credentials: 'same-origin' })
      .then((response) => response.ok ? response.json() : null)
      .then((json) => {
        if (cancelled) return;
        if (json?.ok && json.member) {
          setMemberNav({
            authenticated: true,
            member: { name: json.member.name, role: json.member.role },
          });
          return;
        }
        setMemberNav({ authenticated: false });
      })
      .catch(() => {
        if (!cancelled) setMemberNav({ authenticated: false });
      });
    return () => {
      cancelled = true;
    };
  }, [builderEditable, locale]);

  useEffect(() => () => clearCloseTimeout(), [clearCloseTimeout]);

  function navigate(event: React.MouseEvent<HTMLElement>, href: string) {
    if (!onNavigate || /^(https?:|mailto:|tel:|#)/.test(href)) return;
    event.preventDefault();
    closeMegaMenuNow();
    setMobileMenuOpen(false);
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
    if (!megaPanelKeys.has(item.key)) return false;
    if (!(event.altKey || event.metaKey)) return false;
    event.preventDefault();
    event.stopPropagation();
    clearCloseTimeout();
    setPinnedMenu(item.key);
    setBuilderEditingMenu(item.key);
    setOpenMenu(item.key);
    moveIndicator(item.key, true);
    onRequestEditNavItem?.(item.source.id);
    return true;
  }

  function handleBuilderMegaClick(event: React.MouseEvent<HTMLElement>, item: HeaderMegaPanel['links'][number], panelKey: string) {
    if (!builderEditable || !item.source) return false;
    if (!(event.altKey || event.metaKey)) return false;
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

  function handleBuilderMegaEdit(event: React.MouseEvent<HTMLElement>, item: HeaderMegaPanel['links'][number], panelKey: string) {
    if (!builderEditable || !item.source) return;
    event.preventDefault();
    event.stopPropagation();
    clearCloseTimeout();
    setPinnedMenu(panelKey);
    setBuilderEditingMenu(panelKey);
    setOpenMenu(panelKey);
    moveIndicator(panelKey, true);
    onRequestEditNavItem?.(item.source.id);
  }

  function handleBuilderMobileNavClick(
    event: React.MouseEvent<HTMLElement>,
    source?: BuilderNavItem,
    forceEdit = false,
  ) {
    if (!builderEditable || !source) return false;
    if (!forceEdit && !(event.altKey || event.metaKey)) return false;
    event.preventDefault();
    event.stopPropagation();
    setMobileMenuOpen(false);
    closeMegaMenuNow();
    onRequestEditNavItem?.(source.id);
    return true;
  }

  function handleBuilderMobileStartRename(
    event: React.MouseEvent<HTMLElement>,
    source: BuilderNavItem | undefined,
  ) {
    if (!builderEditable || !source) return false;
    event.preventDefault();
    event.stopPropagation();
    closeMegaMenuNow();
    setBuilderMobileRenamingId(source.id);
    setBuilderMobileRenameValues(labelsFromNavItem(source, locale));
    return true;
  }

  function handleBuilderMobileCancelRename(event?: React.MouseEvent<HTMLElement>) {
    event?.preventDefault();
    event?.stopPropagation();
    setBuilderMobileRenamingId(null);
    setBuilderMobileRenameValues(emptyNavigationLabelDraft());
    setBuilderMobileRenameSaving(false);
  }

  async function handleBuilderMobileCommitRename(event?: React.MouseEvent<HTMLElement>) {
    event?.preventDefault();
    event?.stopPropagation();
    if (!builderEditable || !builderMobileRenamingId || !onRequestRenameNavItem) return false;
    const nextLabels = normalizedNavigationLabelDraft(builderMobileRenameValues, publishedCopy.untitled);
    setBuilderMobileRenameSaving(true);
    try {
      const result = await onRequestRenameNavItem(builderMobileRenamingId, nextLabels);
      if (result === false) return false;
      setBuilderMobileRenamingId(null);
      setBuilderMobileRenameValues(emptyNavigationLabelDraft());
      return true;
    } catch {
      return false;
    } finally {
      setBuilderMobileRenameSaving(false);
    }
  }

  function handleBuilderMobileRenameKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      void handleBuilderMobileCommitRename();
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      setBuilderMobileRenamingId(null);
      setBuilderMobileRenameValues(emptyNavigationLabelDraft());
      setBuilderMobileRenameSaving(false);
    }
  }

  function handleBuilderMobileAddChild(event: React.MouseEvent<HTMLElement>, source?: BuilderNavItem) {
    if (!builderEditable || !source) return false;
    event.preventDefault();
    event.stopPropagation();
    setMobileMenuOpen(false);
    closeMegaMenuNow();
    onRequestAddNavChild?.(source.id);
    return true;
  }

  function handleBuilderMobileMoveNavItem(
    event: React.MouseEvent<HTMLElement>,
    source: BuilderNavItem | undefined,
    direction: NavigationMoveDirection,
  ) {
    if (!builderEditable || !source) return false;
    event.preventDefault();
    event.stopPropagation();
    closeMegaMenuNow();
    onRequestMoveNavItem?.(source.id, direction);
    return true;
  }

  function renderBuilderMobileRenameForm(source: BuilderNavItem, itemKey: string, itemLabel: string) {
    const localeInputs: Array<{ locale: Locale; label: string }> = [
      { locale: 'ko', label: 'KO' },
      { locale: 'zh-hant', label: '中文' },
      { locale: 'en', label: 'EN' },
    ];
    const translationTargetLinks: Array<{ locale: Locale; label: string }> = [
      { locale: 'zh-hant', label: '中文' },
      { locale: 'en', label: 'EN' },
    ];
    return (
      <span
        className="builder-mobile-nav-rename-form"
        data-builder-mobile-nav-rename-form={itemKey}
        data-builder-nav-item-id={source.id}
      >
        <span className="builder-mobile-nav-rename-fields">
          {localeInputs.map((entry, index) => (
            <label key={entry.locale} className="builder-mobile-nav-rename-label">
              <span>{entry.label}</span>
              <input
                ref={index === 0 ? builderMobileRenameInputRef : undefined}
                type="text"
                value={builderMobileRenameValues[entry.locale]}
                data-builder-mobile-nav-rename-input={entry.locale}
                aria-label={`${mobileRenameInputLabel} ${entry.label} ${itemLabel}`}
                disabled={builderMobileRenameSaving}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setBuilderMobileRenameValues((current) => ({
                    ...current,
                    [entry.locale]: nextValue,
                  }));
                }}
                onKeyDown={handleBuilderMobileRenameKeyDown}
              />
            </label>
          ))}
        </span>
        <span className="builder-mobile-nav-rename-footer">
          <Link
            className="builder-mobile-nav-translation-link"
            href={navigationTranslationManagerHref(locale, source.id)}
            data-builder-header-action="true"
            data-builder-mobile-nav-translation-link={itemKey}
            data-builder-nav-item-id={source.id}
            aria-label={`${mobileTranslationManagerLabel} ${itemLabel}`}
            onClick={(event) => {
              event.stopPropagation();
              setMobileMenuOpen(false);
            }}
          >
            {mobileTranslationManagerLabel}
          </Link>
          <span className="builder-mobile-nav-translation-targets" aria-label={`${mobileTranslationManagerLabel} ${itemLabel} target locales`}>
            {translationTargetLinks.map((entry) => (
              <Link
                key={entry.locale}
                className="builder-mobile-nav-translation-target"
                href={navigationTranslationManagerHref(locale, source.id, entry.locale)}
                data-builder-header-action="true"
                data-builder-mobile-nav-translation-target={entry.locale}
                data-builder-nav-item-id={source.id}
                aria-label={`${mobileTranslationManagerLabel} ${entry.label} ${itemLabel}`}
                onClick={(event) => {
                  event.stopPropagation();
                  setMobileMenuOpen(false);
                }}
              >
                {entry.label}
              </Link>
            ))}
          </span>
          <span className="builder-mobile-nav-rename-buttons">
            <button
              type="button"
              className="builder-mobile-nav-rename-save"
              data-builder-mobile-nav-rename-save={itemKey}
              disabled={builderMobileRenameSaving}
              onClick={(event) => {
                void handleBuilderMobileCommitRename(event);
              }}
            >
              {mobileRenameSaveLabel}
            </button>
            <button
              type="button"
              className="builder-mobile-nav-rename-cancel"
              data-builder-mobile-nav-rename-cancel={itemKey}
              disabled={builderMobileRenameSaving}
              onClick={handleBuilderMobileCancelRename}
            >
              {mobileRenameCancelLabel}
            </button>
          </span>
        </span>
      </span>
    );
  }

  async function logoutMember() {
    await fetch('/api/members/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => undefined);
    window.location.assign(buildSitePagePath(locale, 'login'));
  }

  function handleMemberLogoutClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (builderEditable && onNavigate) {
      event.preventDefault();
      event.stopPropagation();
      closeMegaMenuNow();
      setMobileMenuOpen(false);
      onNavigate(buildSitePagePath(locale, 'login'));
      return;
    }
    void logoutMember();
  }

  return (
    <>
      <header
        className={`header scrolled${openMenu ? ' mega-open' : ''}${forceMobileNavigation ? ' mobile-nav-forced' : ''}${suppressMobileNavigation ? ' mobile-hamburger-off' : ''}${mobileSticky ? ' mobile-sticky-enabled' : ''}${mobileMenuOpen ? ' mobile-drawer-open' : ''} builder-site-header`}
        data-builder-mobile-header={forceMobileNavigation ? 'true' : undefined}
        data-builder-mobile-sticky={mobileSticky ? 'true' : undefined}
        data-builder-mobile-hamburger-mode={mobileHamburger}
      >
        <div className="header-utility">
          <div className="container">
            <nav className="utility-nav" aria-label={locale === 'ko' ? '보조 메뉴' : locale === 'zh-hant' ? '輔助選單' : 'Utility menu'}>
              {utilityLinks.map((item) => (
                <a key={item.href} href={item.href} onClick={(event) => navigate(event, item.href)}>
                  {item.label}
                </a>
              ))}
              <span className="utility-member-nav" data-member-nav-state={memberNav.authenticated ? 'signed-in' : 'signed-out'}>
                {memberNav.authenticated ? (
                  <>
                    <a href={`/${locale}/account`} data-member-role-link="account" onClick={(event) => navigate(event, `/${locale}/account`)}>
                      {accountLabel}
                    </a>
                    {memberCanSeePremium ? (
                      <a href={`/${locale}/account/premium`} data-member-role-link="premium" onClick={(event) => navigate(event, `/${locale}/account/premium`)}>
                        {premiumLabel}
                      </a>
                    ) : null}
                    <button type="button" data-member-role-link="logout" onClick={handleMemberLogoutClick}>{logoutLabel}</button>
                  </>
                ) : (
                  <a href={`/${locale}/login`} data-member-role-link="login" onClick={(event) => navigate(event, `/${locale}/login`)}>
                    {loginLabel}
                  </a>
                )}
              </span>
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
              aria-label={homeLabel}
              data-builder-site-brand={builderEditable ? 'true' : undefined}
              onClick={(event) => {
                if (handleBuilderBrandClick(event)) return;
                navigate(event, buildSitePagePath(locale, ''));
              }}
            >
              <span className="logo-mark" aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="site-header-logo-light" src={logo} alt="" width={508} height={80} />
              </span>
              <strong className="logo-kr">{brandText}</strong>
            </a>

            <button
              type="button"
              className="mobile-toggle site-header-hamburger"
              data-builder-mobile-hamburger="true"
              aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={mobileMenuOpen}
              aria-controls="site-mobile-nav-drawer"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                closeMegaMenuNow();
                const opener = event.currentTarget;
                setMobileMenuOpen((current) => {
                  const nextOpen = !current;
                  if (nextOpen) {
                    mobileMenuOpenerRef.current = opener;
                    onRequestOpenMobileMenu?.();
                  }
                  return nextOpen;
                });
              }}
            >
              <span aria-hidden />
              <span aria-hidden />
              <span aria-hidden />
            </button>

            <nav
              className={`main-nav${openMenu ? ' menu-open' : ''}`}
              aria-label={mainNavLabel}
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
                        data-builder-nav-item-label={builderEditable && item.source ? getHeaderNavItemLabel(item, locale) : undefined}
                        data-builder-nav-active={isBuilderActive ? 'true' : undefined}
                        ref={(element) => {
                          linkRefs.current[item.key] = element;
                        }}
                        title={builderEditable && item.source ? `Edit menu item: ${getHeaderNavItemLabel(item, locale)}` : undefined}
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
                        {getHeaderNavItemLabel(item, locale)}
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
                  openSearchFromHeader(event.currentTarget);
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
          id="site-mobile-nav-drawer"
          className={`site-mobile-nav-drawer${mobileMenuOpen ? ' open' : ''}`}
          data-builder-mobile-drawer={mobileMenuOpen ? 'open' : 'closed'}
          aria-hidden={mobileMenuOpen ? 'false' : 'true'}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            ref={mobilePanelRef}
            className="site-mobile-nav-panel"
            role="dialog"
            aria-modal={mobileMenuOpen ? 'true' : undefined}
            aria-hidden={mobileMenuOpen ? undefined : 'true'}
            aria-label={mobileDrawerLabel}
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="site-mobile-nav-header">
              <strong>{brandText}</strong>
              <button ref={mobileCloseButtonRef} type="button" onClick={() => setMobileMenuOpen(false)}>
                {mobileCloseLabel}
              </button>
            </div>
            <nav aria-label={mobileNavLabel}>
              <ul className="site-mobile-nav-list">
                {displayNavItems.map((item) => {
                  const panel = megaPanels.find((candidate) => candidate.key === item.key);
                  const itemLabel = getHeaderNavItemLabel(item, locale);
                  const isBuilderMobileRenaming = builderEditable
                    && !!item.source
                    && builderMobileRenamingId === item.source.id;
                  return (
                    <li key={item.key}>
                      <div className={builderEditable && item.source ? 'builder-mobile-nav-row' : undefined}>
                        {isBuilderMobileRenaming && item.source ? (
                          renderBuilderMobileRenameForm(item.source, item.key, itemLabel)
                        ) : (
                          <>
                            <a
                              href={item.href}
                              data-builder-mobile-nav-link={builderEditable ? item.key : undefined}
                              data-builder-nav-item-id={builderEditable && item.source ? item.source.id : undefined}
                              data-builder-nav-active={builderEditable && item.source?.id === activeBuilderNavItemId ? 'true' : undefined}
                              onClick={(event) => {
                                if (panel && handleBuilderMobileNavClick(event, item.source)) return;
                                setMobileMenuOpen(false);
                                navigate(event, item.href);
                              }}
                            >
                              {itemLabel}
                            </a>
                            {builderEditable && item.source ? (
                              <span className="builder-mobile-nav-actions">
                                <button
                                  type="button"
                                  className="builder-mobile-nav-edit builder-mobile-nav-rename"
                                  data-builder-mobile-nav-rename={item.key}
                                  data-builder-nav-item-id={item.source.id}
                                  aria-label={`${mobileRenameLabel} ${itemLabel}`}
                                  onClick={(event) => {
                                    handleBuilderMobileStartRename(event, item.source);
                                  }}
                                >
                                  {mobileRenameLabel}
                                </button>
                                <button
                                  type="button"
                                  className="builder-mobile-nav-edit"
                                  data-builder-mobile-nav-edit={item.key}
                                  data-builder-nav-item-id={item.source.id}
                                  aria-label={`${mobileEditLabel} ${itemLabel}`}
                                  onClick={(event) => {
                                    handleBuilderMobileNavClick(event, item.source, true);
                                  }}
                                >
                                  {mobileEditLabel}
                                </button>
                                <button
                                  type="button"
                                  className="builder-mobile-nav-edit builder-mobile-nav-add"
                                  data-builder-mobile-nav-add={item.key}
                                  data-builder-nav-item-id={item.source.id}
                                  aria-label={`${mobileAddLabel} ${itemLabel}`}
                                  onClick={(event) => {
                                    handleBuilderMobileAddChild(event, item.source);
                                  }}
                                >
                                  {mobileAddLabel}
                                </button>
                                <button
                                  type="button"
                                  className="builder-mobile-nav-edit builder-mobile-nav-move"
                                  data-builder-mobile-nav-move={`${item.key}:up`}
                                  data-builder-nav-item-id={item.source.id}
                                  aria-label={`${mobileMoveUpLabel} ${itemLabel}`}
                                  title={`${mobileMoveUpLabel} ${itemLabel}`}
                                  onClick={(event) => {
                                    handleBuilderMobileMoveNavItem(event, item.source, 'up');
                                  }}
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  className="builder-mobile-nav-edit builder-mobile-nav-move"
                                  data-builder-mobile-nav-move={`${item.key}:down`}
                                  data-builder-nav-item-id={item.source.id}
                                  aria-label={`${mobileMoveDownLabel} ${itemLabel}`}
                                  title={`${mobileMoveDownLabel} ${itemLabel}`}
                                  onClick={(event) => {
                                    handleBuilderMobileMoveNavItem(event, item.source, 'down');
                                  }}
                                >
                                  ↓
                                </button>
                              </span>
                            ) : null}
                          </>
                        )}
                      </div>
                      {panel ? (
                        <ul>
                          {panel.links.map((link) => {
                            const isBuilderMobileChildRenaming = builderEditable
                              && !!link.source
                              && builderMobileRenamingId === link.source.id;
                            return (
                              <li key={`${panel.key}-mobile-${link.href}`}>
                                <div className={builderEditable && link.source ? 'builder-mobile-nav-row builder-mobile-nav-row-child' : undefined}>
                                  {isBuilderMobileChildRenaming && link.source ? (
                                    renderBuilderMobileRenameForm(link.source, `${panel.key}-child`, link.label)
                                  ) : (
                                    <>
                                      <a
                                        href={link.href}
                                        target={link.href.startsWith('http') ? '_blank' : undefined}
                                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        data-builder-mobile-nav-link={builderEditable ? `${panel.key}-child` : undefined}
                                        data-builder-nav-item-id={builderEditable && link.source ? link.source.id : undefined}
                                        data-builder-nav-active={builderEditable && link.source?.id === activeBuilderNavItemId ? 'true' : undefined}
                                        onClick={(event) => {
                                          if (handleBuilderMobileNavClick(event, link.source)) return;
                                          setMobileMenuOpen(false);
                                          navigate(event, link.href);
                                        }}
                                      >
                                        {link.label}
                                      </a>
                                      {builderEditable && link.source ? (
                                        <span className="builder-mobile-nav-actions">
                                          <button
                                            type="button"
                                            className="builder-mobile-nav-edit builder-mobile-nav-rename"
                                            data-builder-mobile-nav-rename={`${panel.key}-child`}
                                            data-builder-nav-item-id={link.source.id}
                                            aria-label={`${mobileRenameLabel} ${link.label}`}
                                            onClick={(event) => {
                                              handleBuilderMobileStartRename(event, link.source);
                                            }}
                                          >
                                            {mobileRenameLabel}
                                          </button>
                                          <button
                                            type="button"
                                            className="builder-mobile-nav-edit"
                                            data-builder-mobile-nav-edit={`${panel.key}-child`}
                                            data-builder-nav-item-id={link.source.id}
                                            aria-label={`${mobileEditLabel} ${link.label}`}
                                            onClick={(event) => {
                                              handleBuilderMobileNavClick(event, link.source, true);
                                            }}
                                          >
                                            {mobileEditLabel}
                                          </button>
                                          <button
                                            type="button"
                                            className="builder-mobile-nav-edit builder-mobile-nav-move"
                                            data-builder-mobile-nav-move={`${panel.key}-child:up`}
                                            data-builder-nav-item-id={link.source.id}
                                            aria-label={`${mobileMoveUpLabel} ${link.label}`}
                                            title={`${mobileMoveUpLabel} ${link.label}`}
                                            onClick={(event) => {
                                              handleBuilderMobileMoveNavItem(event, link.source, 'up');
                                            }}
                                          >
                                            ↑
                                          </button>
                                          <button
                                            type="button"
                                            className="builder-mobile-nav-edit builder-mobile-nav-move"
                                            data-builder-mobile-nav-move={`${panel.key}-child:down`}
                                            data-builder-nav-item-id={link.source.id}
                                            aria-label={`${mobileMoveDownLabel} ${link.label}`}
                                            title={`${mobileMoveDownLabel} ${link.label}`}
                                            onClick={(event) => {
                                              handleBuilderMobileMoveNavItem(event, link.source, 'down');
                                            }}
                                          >
                                            ↓
                                          </button>
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="site-mobile-nav-utility">
              <button
                type="button"
                data-builder-mobile-nav-search="true"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setMobileMenuOpen(false);
                  openSearchFromHeader(event.currentTarget);
                }}
                aria-label={searchLabel}
              >
                {content.nav.searchLabel}
              </button>
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
                繁中
              </Link>
              <Link
                href={localeSwitchPath('en', currentSlug)}
                aria-current={locale === 'en' ? 'page' : undefined}
                onClick={handleBuilderLocaleClick}
                onAuxClick={handleBuilderLocaleClick}
              >
                EN
              </Link>
              {utilityLinks.map((item) => (
                <a key={`mobile-${item.href}`} href={item.href} onClick={(event) => {
                  setMobileMenuOpen(false);
                  navigate(event, item.href);
                }}>
                  {item.label}
                </a>
              ))}
              {memberNav.authenticated ? (
                <>
                  <a href={`/${locale}/account`} data-member-role-link="account-mobile" onClick={(event) => {
                    setMobileMenuOpen(false);
                    navigate(event, `/${locale}/account`);
                  }}>
                    {accountLabel}
                  </a>
                  {memberCanSeePremium ? (
                    <a href={`/${locale}/account/premium`} data-member-role-link="premium-mobile" onClick={(event) => {
                      setMobileMenuOpen(false);
                      navigate(event, `/${locale}/account/premium`);
                    }}>
                      {premiumLabel}
                    </a>
                  ) : null}
                  <button type="button" data-member-role-link="logout-mobile" onClick={(event) => {
                    setMobileMenuOpen(false);
                    handleMemberLogoutClick(event);
                  }}>{logoutLabel}</button>
                </>
              ) : (
                <a href={`/${locale}/login`} data-member-role-link="login-mobile" onClick={(event) => {
                  setMobileMenuOpen(false);
                  navigate(event, `/${locale}/login`);
                }}>
                  {loginLabel}
                </a>
              )}
            </div>
          </div>
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
                              onClick={(event) => handleBuilderMegaEdit(event, link, panel.key)}
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
