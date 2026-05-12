/**
 * Phase 4 — Site-level data model.
 *
 * A site is a collection of pages, each with its own canvas document.
 * The global header/footer and navigation are shared across all pages.
 * This replaces the Phase 1 single-page sandbox model with a real
 * multi-page architecture.
 */

import type { Locale } from '@/lib/locales';
import type { TranslationEntry } from '@/lib/builder/translations/types';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeBuilderSiteId } from '@/lib/builder/site/identity';
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
  publishedRevisionId?: string;
  publishedRevision?: number;
  publishedSavedAt?: string;
  lastPublishedDraftRevision?: number;
  isHomePage?: boolean;
  noIndex?: boolean;
  password?: string;
}

export interface BuilderSeoMetadata {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  additionalMetaTags?: BuilderSeoAdditionalMetaTag[];
  structuredData?: BuilderSeoStructuredDataSettings;
  overrideState?: BuilderSeoOverrideState;
  focusKeyword?: string;
  structuredDataBlocks?: BuilderStructuredDataBlock[];
}

export interface BuilderSeoAdditionalMetaTag {
  id: string;
  name: string;
  content: string;
}

export type BuilderSeoOverrideField =
  | 'title'
  | 'description'
  | 'ogTitle'
  | 'ogDescription'
  | 'ogImage'
  | 'twitterTitle'
  | 'twitterDescription'
  | 'twitterImage'
  | 'canonical'
  | 'robots'
  | 'structuredData'
  | 'additionalMetaTags';

export type BuilderSeoOverrideState = Partial<Record<BuilderSeoOverrideField, boolean>>;

export interface BuilderSeoStructuredDataSettings {
  legalService?: boolean;
  organization?: boolean;
  localBusiness?: boolean;
  faqPage?: 'auto' | 'off';
  breadcrumbList?: boolean;
}

export type BuilderStructuredDataBlockType =
  | 'LegalService'
  | 'Organization'
  | 'LocalBusiness'
  | 'FAQPage'
  | 'BreadcrumbList'
  | 'Custom';

export interface BuilderStructuredDataBlock {
  id: string;
  type: BuilderStructuredDataBlockType;
  label?: string;
  enabled: boolean;
  json?: string;
}

export interface BuilderSeoPatternSettings {
  titleTemplate?: string;
  descriptionTemplate?: string;
  ogTitleTemplate?: string;
  ogDescriptionTemplate?: string;
  twitterTitleTemplate?: string;
  twitterDescriptionTemplate?: string;
}

export interface BuilderSeoDefaults {
  patterns?: BuilderSeoPatternSettings;
  twitterCard?: 'summary' | 'summary_large_image';
  noIndex?: boolean;
  noFollow?: boolean;
  additionalMetaTags?: BuilderSeoAdditionalMetaTag[];
  structuredData?: BuilderSeoStructuredDataSettings;
  structuredDataBlocks?: BuilderStructuredDataBlock[];
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
  effects?: {
    radiusPreset?: 'sharp' | 'medium' | 'soft';
    shadowPreset?: 'none' | 'soft' | 'medium' | 'strong';
  };
  themeTextPresets?: ThemeTextPresets;
  // Phase 23 — Typography scale ratio (W184). Heading sizes are derived as
  // baseSize * ratio^level where level = 0 for body, +1/+2/... for h6..h1.
  typographyScale?: {
    baseSize: number;        // default 16
    ratio: 1.125 | 1.2 | 1.25 | 1.333 | 1.414 | 1.5;
  };
}

// P4-18: locale 별 Header/Footer 캔버스 ID
export interface BuilderHeaderFooterConfig {
  headerCanvasId?: string | Partial<Record<Locale, string>>;
  footerCanvasId?: string | Partial<Record<Locale, string>>;
  /**
   * M07 Phase 2 lock:
   * mobile header behavior belongs to the global header schema, not to each
   * menu widget. Runtime/UI support lands in M09/M10.
   */
  mobileSticky?: boolean;
  mobileHamburger?: 'auto' | 'off' | 'force';
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
  seoChecklist?: BuilderSeoChecklistSettings;
  seoDefaults?: BuilderSeoDefaults;
  robotsTxt?: string;
  // Phase 22 W172 — page transition preset.
  pageTransition?: 'none' | 'fade' | 'slide-up' | 'slide-left' | 'scale';
  pageTransitionDurationMs?: number;
  // PR #14 — public live chat widget toggle.
  liveChatWidgetEnabled?: boolean;
}

export interface BuilderSeoChecklistSettings {
  businessName?: string;
  keywords?: string[];
  serviceMode?: 'physical' | 'online' | 'both';
}

export type BuilderMobileBottomBarActionKind = 'phone' | 'booking' | 'custom';

export interface BuilderMobileBottomBarAction {
  id: string;
  label: string;
  href: string;
  kind: BuilderMobileBottomBarActionKind;
}

export interface BuilderMobileBottomBar {
  enabled: boolean;
  actions: BuilderMobileBottomBarAction[];
}

// Lightbox/Modal builder — separate entity from pages.
// Each lightbox has its own canvas document. Trigger from a button via
// `href: lightbox:<slug>` which is intercepted on the published page.
export interface BuilderLightbox {
  id: string;
  name: string;
  slug: string; // English alphanumeric, used as `lightbox:<slug>` trigger key
  locale: Locale;
  sizeMode: 'auto' | 'fixed';
  width?: number;
  height?: number;
  closeOnOutsideClick: boolean;
  closeOnEsc: boolean;
  dismissable: boolean; // show close (X) button
  backdropOpacity: number; // 0~100, default 60
  createdAt: string;
  updatedAt: string;
}

// Phase 15 — Popup (auto-trigger or button-trigger modal).
// Trigger types:
//   - 'manual':         button with `href: popup:<slug>` opens it
//   - 'on-load':        opens on first page view (after delayMs)
//   - 'on-exit-intent': desktop mouseleave to top edge
//   - 'on-scroll':      after scrollPercent of page height
// Stored as a list under `popups` on the site doc. Each popup has its own
// canvas document under page id `popup:<id>`.
export type BuilderPopupTrigger = 'manual' | 'on-load' | 'on-exit-intent' | 'on-scroll';

export interface BuilderPopup {
  id: string;
  name: string;
  slug: string; // English alphanumeric, `popup:<slug>` trigger key
  locale: Locale;
  trigger: BuilderPopupTrigger;
  /** Delay before auto-open (ms), used by `on-load` trigger. */
  delayMs: number;
  /** Scroll percent (0~100), used by `on-scroll` trigger. */
  scrollPercent: number;
  /** Show at most once per visitor (uses localStorage fingerprint). */
  oncePerVisitor: boolean;
  width?: number;
  height?: number;
  closeOnOutsideClick: boolean;
  closeOnEsc: boolean;
  dismissable: boolean;
  backdropOpacity: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Phase 15 — Cookie consent (site-level banner).
// Exactly one config per site (singleton). Storage key in visitor localStorage
// is derived from `version` so bumping the version re-prompts.
export type CookieConsentLayout = 'bar-bottom' | 'bar-top' | 'modal-center' | 'card-corner';

export interface BuilderCookieConsent {
  enabled: boolean;
  version: string; // Bump to re-prompt all visitors (e.g. '2026-05-11')
  layout: CookieConsentLayout;
  locale: Locale;
  title: string;
  description: string;
  acceptLabel: string;
  declineLabel: string;
  manageLabel: string;
  policyUrl?: string;
  /** Categories shown in the manage panel. */
  categories: Array<{
    key: string;
    label: string;
    description: string;
    /** required:true → toggle disabled & always on. */
    required: boolean;
    defaultEnabled: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Saved section library — Wix Studio "Saved Sections" parity.
// A user designs a container + descendants once and reuses across pages.
export type SavedSectionCategory =
  | 'hero'
  | 'features'
  | 'testimonials'
  | 'cta'
  | 'footer'
  | 'custom';

export const SAVED_SECTION_CATEGORIES: SavedSectionCategory[] = [
  'hero',
  'features',
  'testimonials',
  'cta',
  'footer',
  'custom',
];

export interface SavedSection {
  sectionId: string;
  name: string;
  description?: string;
  category?: SavedSectionCategory;
  /** Optional inline SVG markup or data URL — clients may render a wireframe instead. */
  thumbnail?: string;
  /** Root node id (must exist within `nodes`). Root is typically a container. */
  rootNodeId: string;
  /** Snapshot: root + all descendants. */
  nodes: BuilderCanvasNode[];
  createdAt: string;
  updatedAt: string;
  /** Number of times the section was inserted onto a canvas. */
  usage: number;
}

// SEO maturity — site-level redirect rules. Persisted inside the site doc so
// they ride along with the rest of the site config and can be consumed by the
// edge middleware on every public request via @vercel/blob.
export type SiteRedirectStatus = 301 | 302 | 307 | 308;

export interface SiteRedirect {
  redirectId: string;
  from: string;          // Source path, must start with `/` (e.g. "/old-services")
  to: string;            // Destination path or absolute URL
  type: SiteRedirectStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  note?: string;
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
  mobileBottomBar?: BuilderMobileBottomBar;
  pages: BuilderPageMeta[];
  lightboxes?: BuilderLightbox[];
  popups?: BuilderPopup[];
  cookieConsent?: BuilderCookieConsent;
  translations?: TranslationEntry[];
  sectionLibrary?: SavedSection[];
  redirects?: SiteRedirect[];
  createdAt: string;
  updatedAt: string;
}

let savedSectionIdCounter = 0;
export function generateSavedSectionId(): string {
  savedSectionIdCounter += 1;
  return `section-${Date.now()}-${savedSectionIdCounter}`;
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
  effects: { radiusPreset: 'medium', shadowPreset: 'soft' },
  themeTextPresets: DEFAULT_THEME_TEXT_PRESETS,
};

let pageIdCounter = 0;
export function generatePageId(): string {
  pageIdCounter += 1;
  return `page-${Date.now()}-${pageIdCounter}`;
}

let lightboxIdCounter = 0;
export function generateLightboxId(): string {
  lightboxIdCounter += 1;
  return `lightbox-${Date.now()}-${lightboxIdCounter}`;
}

let popupIdCounter = 0;
export function generatePopupId(): string {
  popupIdCounter += 1;
  return `popup-${Date.now()}-${popupIdCounter}`;
}

export function createDefaultPopup(
  locale: Locale,
  slug: string,
  name: string,
): BuilderPopup {
  const now = new Date().toISOString();
  return {
    id: generatePopupId(),
    name,
    slug,
    locale,
    trigger: 'manual',
    delayMs: 2000,
    scrollPercent: 40,
    oncePerVisitor: true,
    width: 520,
    height: 360,
    closeOnOutsideClick: true,
    closeOnEsc: true,
    dismissable: true,
    backdropOpacity: 60,
    active: true,
    createdAt: now,
    updatedAt: now,
  };
}

export function createDefaultCookieConsent(locale: Locale): BuilderCookieConsent {
  const now = new Date().toISOString();
  return {
    enabled: false,
    version: now.slice(0, 10),
    layout: 'bar-bottom',
    locale,
    title: '쿠키 사용 안내',
    description: '본 사이트는 서비스 개선을 위해 쿠키를 사용합니다. 자세한 내용은 정책 페이지를 참고해 주세요.',
    acceptLabel: '모두 동의',
    declineLabel: '필수만 허용',
    manageLabel: '설정',
    categories: [
      {
        key: 'necessary',
        label: '필수',
        description: '사이트 동작에 반드시 필요한 쿠키입니다.',
        required: true,
        defaultEnabled: true,
      },
      {
        key: 'analytics',
        label: '분석',
        description: '방문 통계 및 개선을 위한 쿠키입니다.',
        required: false,
        defaultEnabled: false,
      },
      {
        key: 'marketing',
        label: '마케팅',
        description: '맞춤형 안내·캠페인 측정에 사용됩니다.',
        required: false,
        defaultEnabled: false,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
}

export function createDefaultLightbox(
  locale: Locale,
  slug: string,
  name: string,
): BuilderLightbox {
  const now = new Date().toISOString();
  return {
    id: generateLightboxId(),
    name,
    slug,
    locale,
    sizeMode: 'auto',
    width: 600,
    height: 400,
    closeOnOutsideClick: true,
    closeOnEsc: true,
    dismissable: true,
    backdropOpacity: 60,
    createdAt: now,
    updatedAt: now,
  };
}

export function createDefaultSiteDocument(
  locale: Locale,
  siteId: string | null | undefined,
): BuilderSiteDocument {
  const homePageId = generatePageId();
  const normalizedSiteId = normalizeBuilderSiteId(siteId);
  return {
    version: 1,
    siteId: normalizedSiteId,
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

export interface PageCanvasRecord {
  revision: number;
  savedAt: string;
  updatedBy?: string;
  document: import('@/lib/builder/canvas/types').BuilderCanvasDocument;
}

// Wave 3 / E3 — brand-kit assets and public dark mode runtime.
// Appended via interface merging to keep existing exported shapes stable.
export interface BrandKitAssets {
  logoLightAssetId?: string;
  logoDarkAssetId?: string;
  faviconAssetId?: string;
  ogImageAssetId?: string;
}

export interface DarkModeConfig {
  defaultMode?: 'light' | 'dark' | 'auto';
  allowVisitorToggle?: boolean;
}

export interface BuilderSiteSettings {
  ogImage?: string;
  assets?: BrandKitAssets;
}

export interface BuilderSiteDocument {
  darkMode?: DarkModeConfig;
}
