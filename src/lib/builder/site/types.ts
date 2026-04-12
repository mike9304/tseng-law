/**
 * Phase 4 — Site-level data model.
 *
 * A site is a collection of pages, each with its own canvas document.
 * The global header/footer and navigation are shared across all pages.
 * This replaces the Phase 1 single-page sandbox model with a real
 * multi-page architecture.
 */

import type { Locale } from '@/lib/locales';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';

export interface BuilderNavItem {
  id: string;
  label: string;
  pageId: string;
  href: string;
  children?: BuilderNavItem[];
}

export interface BuilderPageMeta {
  pageId: string;
  slug: string;
  title: Record<Locale, string>;
  locale: Locale;
  seo?: BuilderSeoMetadata;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  isHomePage?: boolean;
}

export interface BuilderSeoMetadata {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

export interface BuilderTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
    muted: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  radii: {
    sm: number;
    md: number;
    lg: number;
  };
}

export interface BuilderSiteDocument {
  version: 1;
  siteId: string;
  name: string;
  locale: Locale;
  navigation: BuilderNavItem[];
  theme: BuilderTheme;
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
  fonts: {
    heading: 'system-ui, sans-serif',
    body: 'system-ui, sans-serif',
  },
  radii: { sm: 4, md: 8, lg: 16 },
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isHomePage: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
