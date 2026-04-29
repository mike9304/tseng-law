/**
 * Phase 4 — Site-level data model.
 *
 * A site is a collection of pages, each with its own canvas document.
 * The global header/footer and navigation are shared across all pages.
 * This replaces the Phase 1 single-page sandbox model with a real
 * multi-page architecture.
 */

import type { Locale } from '@/lib/locales';
import {
  DEFAULT_DARK_THEME_COLORS,
  DEFAULT_THEME_TEXT_PRESETS,
  type ThemeTextPresets,
} from '@/lib/builder/site/theme';
// BuilderCanvasDocument used by persistence.ts, not directly here

export type BuilderPageDocumentFamily =
  | 'section-snapshot-v1'
  | 'scene-promotable-v1'
  | 'canvas-sandbox-v1';

export interface BuilderPageLifecycleMeta {
  activeDocumentFamily: BuilderPageDocumentFamily;
  publishBackend: 'builder-snapshot';
  sceneStatus: 'derived-only' | 'seeded' | 'promoted';
}

// P4-17: nav label 은 locale 별 다국어 지원
export interface BuilderNavItem {
  id: string;
  label: string | Record<Locale, string>;
  pageId: string;
  href: string;
  children?: BuilderNavItem[];
}

// P4-15: linkedPageIds 로 다국어 페이지 연결
export interface BuilderPageMeta {
  pageId: string;
  slug: string;
  title: Record<Locale, string>;
  locale: Locale;
  documentKind?: 'section-snapshot-v1' | 'canvas-scene-vnext';
  lifecycle?: BuilderPageLifecycleMeta;
  linkedPageIds?: Partial<Record<Locale, string>>;
  seo?: BuilderSeoMetadata;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  isHomePage?: boolean;
  noIndex?: boolean;
  password?: string;
}

export interface BuilderSeoMetadata {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

export interface BuilderThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
  muted: string;
}

export interface BuilderTheme {
  colors: BuilderThemeColors;
  darkColors?: BuilderThemeColors;
  fonts: {
    heading: string;
    body: string;
  };
  radii: {
    sm: number;
    md: number;
    lg: number;
  };
  themeTextPresets?: ThemeTextPresets;
}

// P4-18: locale 별 Header/Footer 캔버스 ID
export interface BuilderHeaderFooterConfig {
  headerCanvasId?: string | Partial<Record<Locale, string>>;
  footerCanvasId?: string | Partial<Record<Locale, string>>;
}

// P4-19: Favicon + 사이트 기본 정보
export interface BuilderSiteSettings {
  favicon?: string;
  logo?: string;
  logoDark?: string;
  firmName?: string;
  phone?: string;
  email?: string;
  address?: string;
  businessHours?: string;
  businessRegNumber?: string;
}

export interface BuilderSiteDocument {
  version: 1;
  siteId: string;
  name: string;
  locale: Locale;
  locales?: Locale[];
  navigation: BuilderNavItem[];
  theme: BuilderTheme;
  headerFooter?: BuilderHeaderFooterConfig;
  settings?: BuilderSiteSettings;
  pages: BuilderPageMeta[];
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_THEME: BuilderTheme = {
  colors: {
    primary: '#123b63',
    secondary: '#1e5a96',
    accent: '#e8a838',
    text: '#1f2937',
    background: '#ffffff',
    muted: '#f3f4f6',
  },
  darkColors: DEFAULT_DARK_THEME_COLORS,
  fonts: {
    heading: 'system-ui, sans-serif',
    body: 'system-ui, sans-serif',
  },
  radii: { sm: 4, md: 8, lg: 16 },
  themeTextPresets: DEFAULT_THEME_TEXT_PRESETS,
};

let pageIdCounter = 0;
export function generatePageId(): string {
  pageIdCounter += 1;
  return `page-${Date.now()}-${pageIdCounter}`;
}

export function createDefaultSiteDocument(locale: Locale): BuilderSiteDocument {
  const homePageId = generatePageId();
  return {
    version: 1,
    siteId: 'default',
    name: '호정국제',
    locale,
    navigation: [
      { id: 'nav-home', label: '홈', pageId: homePageId, href: '/' },
    ],
    theme: DEFAULT_THEME,
    pages: [
      {
        pageId: homePageId,
        slug: '',
        title: { ko: '홈', 'zh-hant': '首頁', en: 'Home' },
        locale,
        documentKind: 'section-snapshot-v1',
        lifecycle: {
          activeDocumentFamily: 'section-snapshot-v1',
          publishBackend: 'builder-snapshot',
          sceneStatus: 'derived-only',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isHomePage: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
