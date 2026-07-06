'use client';

import { useCallback, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import {
  COLOR_PREFERENCES,
  INDUSTRIES,
  TONES,
  type ColorPreference,
  type Industry,
  type SiteSpec,
  type Tone,
} from '@/lib/builder/ai-generator/site-spec';
import type { GeneratedSiteDraft } from '@/lib/builder/ai-generator/orchestrator';
import {
  AI_GENERATOR_PROMPT_CHANGELOG,
  AI_GENERATOR_PROMPT_VERSION,
} from '@/lib/builder/ai-generator/prompt-versions';
import {
  scoreDesignerStyleCandidates,
  serializeDesignerScorePayload,
  type DesignerStyleCandidateId,
} from '@/lib/builder/ai-generator/designer-scoring';
import {
  draftToSavedSectionSnapshots,
  type GeneratedSectionSnapshot,
} from '@/lib/builder/ai-generator/canvas-import';
import type { BuilderAssetListItem } from '@/lib/builder/assets';
import type { Locale } from '@/lib/locales';
import styles from './AiGeneratorWizard.module.css';

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;
type DraftCore = Pick<
  GeneratedSiteDraft,
  'spec' | 'blueprint' | 'palette' | 'content' | 'plan'
>;
type DraftVersionMetadata = Partial<Pick<
  GeneratedSiteDraft,
  'generatedAt' | 'promptVersion' | 'blueprintVersion' | 'contentVersion' | 'promptChangelog'
>>;
type Draft = DraftCore & DraftVersionMetadata;
type DraftPreviewFrame = 'desktop' | 'mobile';

interface PromptHistoryEntry {
  id: string;
  createdAt: string;
  spec: SiteSpec;
  draft: Draft;
}

interface DraftResponse {
  ok?: boolean;
  cached?: boolean;
  versionId?: string;
  versionWarning?: string;
  draft?: Draft;
  error?: string;
  message?: string;
}

interface ServerIntakeVersionSummary {
  id: string;
  siteId: string;
  createdAt: string;
  createdBy: string;
  companyName: string;
  industry: SiteSpec['industry'];
  locale: SiteSpec['locale'];
  promptVersion: string;
  pageCount: number;
  sectionCount: number;
  heroHeadline: string;
}

type ServerIntakeDiffValue = string | number | readonly string[] | null;

interface ServerIntakeDiffChange {
  field: string;
  before: ServerIntakeDiffValue;
  after: ServerIntakeDiffValue;
}

interface ServerIntakeVersionDiff {
  isEmpty: boolean;
  specChanges: ServerIntakeDiffChange[];
  draftChanges: ServerIntakeDiffChange[];
}

interface ServerVersionsResponse {
  ok?: boolean;
  versions?: ServerIntakeVersionSummary[];
  error?: string;
  message?: string;
}

interface ServerVersionRestoreResponse {
  ok?: boolean;
  version?: {
    id: string;
    createdAt: string;
    spec: SiteSpec;
    draft: Draft;
  };
  spec?: SiteSpec;
  draft?: Draft;
  error?: string;
  message?: string;
}

interface ServerVersionDiffResponse {
  ok?: boolean;
  leftId?: string;
  rightId?: string;
  diff?: ServerIntakeVersionDiff;
  error?: string;
  message?: string;
}

interface ServerVersionDiffState {
  leftId: string;
  rightId: string;
  diff: ServerIntakeVersionDiff;
}

interface ApplyResponse {
  ok?: boolean;
  scope?: 'single' | 'sitemap';
  pageId?: string;
  slug?: string;
  pages?: ApplyCreatedPage[];
  skippedPages?: ApplySkippedPage[];
  navigationAdded?: string[];
  error?: string;
  message?: string;
}

interface ApplyCreatedPage {
  pageId: string;
  slug: string;
  title?: string;
  nodeCount?: number;
}

interface ApplySkippedPage {
  title: string;
  slug: string;
  reason: string;
}

interface BuilderSitePageSummary {
  pageId: string;
  slug: string;
  title?: Record<string, string>;
  publishedAt?: string;
  publishedRevisionId?: string;
}

interface PagesResponse {
  pages?: BuilderSitePageSummary[];
  error?: string;
  message?: string;
}

interface BuilderNavigationItemSummary {
  id: string;
  label?: string | Record<string, string>;
  pageId?: string;
  href?: string;
  children?: BuilderNavigationItemSummary[];
}

interface NavigationResponse {
  navigation?: BuilderNavigationItemSummary[];
  error?: string;
  message?: string;
}

interface PublishCreatedPageResponse {
  ok?: boolean;
  slug?: string;
  publishedRevisionId?: string;
  publishedSavedAt?: string;
  error?: string;
  message?: string;
}

type PublishPreflightStatus = 'idle' | 'checking' | 'ready' | 'blocked' | 'error';

interface PublishPreflightSummary {
  status: PublishPreflightStatus;
  blockerCount: number;
  warningCount: number;
  infoCount: number;
  checkedAt?: string;
  message?: string;
  firstIssue?: string;
}

interface PublishCheckResultSummary {
  severity?: 'blocker' | 'warning' | 'info';
  category?: string;
  message?: string;
}

interface PublishCheckSuiteSummary {
  results?: PublishCheckResultSummary[];
  hasBlocker?: boolean;
  warningCount?: number;
  blockerCount?: number;
  infoCount?: number;
  checkedAt?: string;
}

interface PublishChecksResponse {
  ok?: boolean;
  suite?: PublishCheckSuiteSummary;
  error?: string;
  message?: string;
}

interface ScheduledPublishJobSummary {
  jobId: string;
  scheduledAt: string;
  status: 'scheduled' | 'publishing' | 'published' | 'failed' | 'cancelled';
  expectedDraftRevision?: number;
}

interface ScheduledPublishResponse {
  ok?: boolean;
  job?: ScheduledPublishJobSummary | null;
  error?: string;
  message?: string;
}

interface CancelScheduledPublishResponse {
  ok?: boolean;
  cancelled?: number;
  error?: string;
  message?: string;
}

interface SaveSectionResponse {
  ok?: boolean;
  section?: {
    sectionId: string;
    name: string;
  };
  error?: string;
  message?: string;
}

interface AssetsResponse {
  ok?: boolean;
  assets?: BuilderAssetListItem[];
  error?: string;
  message?: string;
}

interface ImageGenerationResponse {
  ok?: boolean;
  model?: string;
  asset?: BuilderAssetListItem;
  error?: string;
  message?: string;
}

type DesignerServerScoreStatus = 'idle' | 'checking' | 'synced' | 'mismatch' | 'error';

interface DesignerServerScoreResult {
  id: string;
  rank: number;
  score: number;
  layoutFit: number;
  paletteFit: number;
}

interface DesignerServerScoreResponse {
  ok?: boolean;
  top?: DesignerServerScoreResult | null;
  scores?: DesignerServerScoreResult[];
  payload?: string;
  error?: string;
  message?: string;
}

interface HeroAssetSelection {
  assetId?: string;
  url: string;
  filename: string;
  contentType?: string;
  uploadedAt?: string;
  locale?: Locale;
  pathname?: string;
  alt?: string;
}

interface GeneratedDraftComparison {
  selected: Draft;
  current: Draft;
  comparedAt: string;
}

interface DesignerStyleSuggestion {
  id: DesignerStyleCandidateId;
  label: string;
  description: string;
  treatment: string;
  composition: string;
  palette: Draft['palette'];
  score: number;
  rank: number;
  scoreReasons: string[];
  layoutFit: number;
  paletteFit: number;
  fitPreview: string;
  designPoolProfile: string;
  designPoolFit: number;
  designPoolSignals: string[];
}

interface DraftVisualDiffMetrics {
  paletteTokens: number;
  sectionOrder: number;
  copyLength: number;
  visualGuidance: number;
}

interface SitemapTreeDiffRow {
  slug: string;
  title: string;
  path: string;
  depth: number;
  parentLabel: string;
  hierarchyPath: string;
  generatedIndex: number;
  currentIndex: number;
  targetIndex: number;
  state: 'home' | 'not_selected' | 'will_create' | 'will_add_nav' | 'will_skip_existing' | 'created_draft';
}

interface ApplySectionDiffRow {
  pageSlug: string;
  pageTitle: string;
  pageIndex: number;
  sectionId: string;
  sectionTitle: string;
  sectionIndex: number;
  state: 'will_insert';
}

interface ApplyVisualDiffRow {
  pageSlug: string;
  pageTitle: string;
  beforeState: 'new_draft';
  afterSectionCount: number;
  afterSectionSummary: string;
}

interface ApplyResponsiveReviewRow {
  pageSlug: string;
  pageTitle: string;
  breakpoint: 'mobile';
  breakpoints: 'mobile,tablet';
  issueCount: number;
  mobileIssueCount: number;
  tabletIssueCount: number;
  status: 'review' | 'ready';
  primaryIssue: string;
  issueSummary: string;
}

interface NavigationTreeEntry {
  slug: string;
  href: string;
  depth: number;
  indexPath: string;
  label: string;
  pageId?: string;
}

interface SitemapNavigationDiffRow {
  slug: string;
  title: string;
  path: string;
  state:
    | 'home'
    | 'not_selected'
    | 'current_public'
    | 'current_hidden_draft'
    | 'will_append_hidden_until_publish'
    | 'queued_hidden_until_publish'
    | 'public_after_publish'
    | 'page_exists_not_in_nav'
    | 'draft_only';
  depth: number;
  indexPath: string;
}

interface Props {
  locale: Locale;
  siteId: string;
}

const STEPS: Array<{ id: WizardStep; label: string; kicker: string }> = [
  { id: 1, label: '업종', kicker: 'Industry' },
  { id: 2, label: '브랜드', kicker: 'Brand' },
  { id: 3, label: '목표·페이지', kicker: 'Plan' },
  { id: 4, label: '제약', kicker: 'Rules' },
  { id: 5, label: '스타일', kicker: 'Design' },
  { id: 6, label: '생성안', kicker: 'Draft' },
];

const COLOR_SWATCHES: Record<ColorPreference, string[]> = {
  cool: ['#0f172a', '#2563eb', '#f8fafc'],
  warm: ['#7c2d12', '#d97706', '#fefce8'],
  neutral: ['#111827', '#64748b', '#ffffff'],
  'high-contrast': ['#000000', '#dc2626', '#ffffff'],
  pastel: ['#5b21b6', '#a78bfa', '#faf5ff'],
};

function aiGeneratorHistoryKey(locale: Locale): string {
  return `builder-ai-generator-history:${locale}`;
}

function isPromptHistoryEntry(value: unknown): value is PromptHistoryEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Partial<PromptHistoryEntry>;
  return typeof entry.id === 'string'
    && typeof entry.createdAt === 'string'
    && Boolean(entry.spec)
    && Boolean(entry.draft?.blueprint?.heroHeadlineHint)
    && Boolean(entry.draft?.content?.hero?.headline)
    && Array.isArray(entry.draft?.plan?.sitemap);
}

function splitList(value: string): string[] | undefined {
  const items = value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 10);
  return items.length > 0 ? items : undefined;
}

function suggestDraftSlug(): string {
  return `ai-site-${Date.now().toString(36)}`;
}

function validateDraftSlug(slug: string): string {
  const normalized = slug.trim().replace(/^\/+|\/+$/g, '');
  if (!normalized) return 'slug를 입력해 주세요.';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
    return '소문자 영문, 숫자, 하이픈만 사용할 수 있습니다.';
  }
  if (['admin', 'admin-builder', 'api', 'builder', 'home'].includes(normalized)) {
    return '예약된 slug는 사용할 수 없습니다.';
  }
  return '';
}

function normalizePlanSlug(slug: string): string {
  const normalized = slug.trim().replace(/^\/+|\/+$/g, '');
  return normalized || '/';
}

function displayPlanPath(slug: string): string {
  const normalized = normalizePlanSlug(slug);
  return normalized === '/' ? '/' : `/${normalized}`;
}

function planHierarchyFromTitle(title: string): { depth: number; parentLabel: string; hierarchyPath: string } {
  const segments = title
    .split(/\s*(?:\/|>)\s*/g)
    .map((segment) => segment.trim())
    .filter(Boolean);
  if (segments.length <= 1) {
    return { depth: 0, parentLabel: '', hierarchyPath: title };
  }
  return {
    depth: segments.length - 1,
    parentLabel: segments.slice(0, -1).join(' / '),
    hierarchyPath: segments.join(' / '),
  };
}

function selectableSitemapSlugs(draft: Draft): string[] {
  return draft.plan.sitemap
    .map((page) => normalizePlanSlug(page.slug))
    .filter((slug) => slug !== '/');
}

function formatPageStatusLabel(status: string): string {
  if (status === 'created') return 'Created';
  if (status === 'planned') return 'Ready';
  if (status === 'not_selected') return 'Skipped';
  if (status === 'home') return 'Home';
  if (status === 'existing_page') return 'Exists';
  if (status === 'duplicate_slug') return 'Exists';
  if (status === 'invalid_slug') return 'Invalid';
  if (status === 'reserved_slug') return 'Reserved';
  return status.replace(/_/g, ' ');
}

function formatSitemapTreeDiffState(state: SitemapTreeDiffRow['state']): string {
  if (state === 'will_add_nav') return 'New + nav';
  if (state === 'will_create') return 'New draft';
  if (state === 'will_skip_existing') return 'Existing slug';
  if (state === 'created_draft') return 'Draft created';
  if (state === 'not_selected') return 'Skipped';
  return 'Home';
}

function formatNavigationDiffState(state: SitemapNavigationDiffRow['state']): string {
  if (state === 'current_public') return 'Current public nav';
  if (state === 'current_hidden_draft') return 'Current hidden draft nav';
  if (state === 'will_append_hidden_until_publish') return 'Will append hidden';
  if (state === 'queued_hidden_until_publish') return 'Queued hidden';
  if (state === 'public_after_publish') return 'Public after publish';
  if (state === 'page_exists_not_in_nav') return 'Page exists, no nav';
  if (state === 'draft_only') return 'Draft only';
  if (state === 'not_selected') return 'Skipped';
  return 'Home';
}

function navigationHrefToSlug(href: string | undefined, locale: Locale): string {
  const rawPath = (href ?? '').split('#')[0]?.split('?')[0] ?? '';
  const localePrefix = `/${locale}`;
  const withoutLocale = rawPath === localePrefix
    ? ''
    : rawPath.startsWith(`${localePrefix}/`)
      ? rawPath.slice(localePrefix.length)
      : rawPath;
  return normalizePlanSlug(withoutLocale);
}

function navigationLabelText(label: BuilderNavigationItemSummary['label'], locale: Locale): string {
  if (typeof label === 'string') return label;
  if (label && typeof label === 'object') return label[locale] ?? Object.values(label)[0] ?? 'Untitled';
  return 'Untitled';
}

function flattenNavigationEntries(
  items: BuilderNavigationItemSummary[],
  locale: Locale,
  depth = 0,
  prefix: number[] = [],
): NavigationTreeEntry[] {
  return items.flatMap((item, index) => {
    const indexPathParts = [...prefix, index + 1];
    const entry: NavigationTreeEntry = {
      slug: navigationHrefToSlug(item.href, locale),
      href: item.href ?? '',
      depth,
      indexPath: indexPathParts.join('.'),
      label: navigationLabelText(item.label, locale),
      pageId: item.pageId,
    };
    return [entry, ...flattenNavigationEntries(item.children ?? [], locale, depth + 1, indexPathParts)];
  });
}

function formatPublishPreflight(summary?: PublishPreflightSummary): string {
  if (!summary || summary.status === 'idle') return 'Preflight pending';
  if (summary.status === 'checking') return 'Checking publish gate';
  if (summary.status === 'error') return 'Preflight unavailable';
  if (summary.status === 'blocked') return `${summary.blockerCount} blockers`;
  if (summary.warningCount > 0) return `Publish ready · ${summary.warningCount} warnings`;
  return 'Publish ready';
}

function formatScheduledPublishTime(value?: string): string {
  if (!value) return 'Not scheduled';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatDatetimeLocalValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-') + `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function defaultScheduledPublishInput(): string {
  return formatDatetimeLocalValue(new Date(Date.now() + 24 * 60 * 60 * 1000));
}

function formatHistoryDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatServerDiffValue(value: ServerIntakeDiffValue): string {
  if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : 'empty';
  if (value === null) return 'empty';
  return String(value);
}

function serverDiffChangeCount(diff: ServerIntakeVersionDiff): number {
  return diff.specChanges.length + diff.draftChanges.length;
}

function persistPromptHistory(locale: Locale, entries: PromptHistoryEntry[]): void {
  try {
    window.localStorage.setItem(aiGeneratorHistoryKey(locale), JSON.stringify(entries));
  } catch (error) {
    if (!(error instanceof Error)) throw error;
  }
}

function visualBriefForUi(draft: Draft) {
  return draft.plan.visualBrief ?? {
    direction: draft.spec.visualDirection ?? draft.plan.brandBrief.constraints,
    imagePrompt: `Create a polished website hero image for ${draft.spec.companyName}. ${draft.spec.visualDirection ?? draft.spec.industry}`,
    treatment: 'professional split hero with layered media card, proof cards, and accent chips',
    composition: 'mobile-safe stacked hero with reusable content cards',
  };
}

function assetAltFromFilename(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim()
    .slice(0, 120) || 'Selected hero image';
}

function builderAssetIdFromUrl(url: string): string {
  const match = /^\/api\/builder\/assets\/(ko|en|zh-hant)\/([A-Za-z0-9._-]+\.(?:jpe?g|png|webp|gif|svg))$/i.exec(url.trim());
  return match ? `builder/assets/${match[1]}/${match[2]}` : '';
}

function builderAssetUrlFromId(assetId: string): string {
  const match = /^builder\/assets\/(ko|en|zh-hant)\/([A-Za-z0-9._-]+\.(?:jpe?g|png|webp|gif|svg))$/i.exec(assetId.trim());
  return match ? `/api/builder/assets/${match[1]}/${match[2]}` : '';
}

function builderAssetIdForSelection(asset: HeroAssetSelection): string {
  if (asset.assetId?.startsWith('builder/assets/')) return asset.assetId;
  if (asset.pathname?.startsWith('builder/assets/')) return asset.pathname;
  return builderAssetIdFromUrl(asset.url);
}

function draftHistorySignature(value: Draft): string {
  return [
    value.spec.companyName,
    value.content.hero.headline,
    value.plan.sitemap.map((page) => page.slug).join('|'),
  ].join('::');
}

function promptVersionEntry(version: string) {
  return AI_GENERATOR_PROMPT_CHANGELOG.find((entry) => entry.version === version)
    ?? AI_GENERATOR_PROMPT_CHANGELOG[0];
}

function draftSectionCount(value: Draft): number {
  return 1 + value.content.sections.length;
}

function draftPaletteSignature(value: Draft): string {
  return [value.palette.primary, value.palette.secondary, value.palette.accent, value.palette.background].join(' / ');
}

function draftSitemapSignature(value: Draft): string {
  return value.plan.sitemap.map((page) => normalizePlanSlug(page.slug)).join(' / ');
}

function generatedDraftDelta(selected: Draft, current: Draft): string[] {
  const changes: string[] = [];
  if (selected.content.hero.headline !== current.content.hero.headline) {
    changes.push('Hero headline differs between selected and current draft.');
  }
  if (draftSectionCount(selected) !== draftSectionCount(current)) {
    changes.push(`Section count differs: selected ${draftSectionCount(selected)} vs current ${draftSectionCount(current)}.`);
  }
  if (draftSitemapSignature(selected) !== draftSitemapSignature(current)) {
    changes.push('Sitemap slug set differs between selected and current draft.');
  }
  if (draftPaletteSignature(selected) !== draftPaletteSignature(current)) {
    changes.push('Palette differs between selected and current draft.');
  }
  if (selected.plan.visualBrief.treatment !== current.plan.visualBrief.treatment) {
    changes.push('Visual treatment differs between selected and current prompt behavior.');
  }
  if (selected.plan.visualBrief.composition !== current.plan.visualBrief.composition) {
    changes.push('Responsive composition guidance differs between selected and current prompt behavior.');
  }
  return changes.length > 0
    ? changes
    : ['No generated content/design difference detected yet; the selected rollback currently changes metadata/cache isolation only.'];
}

function compactResponsiveText(value: string, maxLength: number): string {
  const compact = value.replace(/\s+/g, ' ').trim();
  if (compact.length <= maxLength) return compact;
  const clipped = compact.slice(0, Math.max(0, maxLength - 1)).trim();
  const lastSpace = clipped.lastIndexOf(' ');
  return `${(lastSpace > 48 ? clipped.slice(0, lastSpace) : clipped).trim()}…`;
}

function responsiveFixedDraft(source: Draft): Draft {
  return {
    ...source,
    content: {
      ...source.content,
      hero: {
        ...source.content.hero,
        body: compactResponsiveText(source.content.hero.body, 150),
        ctaLabel: source.content.hero.ctaLabel || '문의하기',
      },
      sections: source.content.sections.map((section) => ({
        ...section,
        body: compactResponsiveText(section.body, 165),
      })),
    },
    plan: {
      ...source.plan,
      visualBrief: {
        ...source.plan.visualBrief,
        treatment: source.plan.visualBrief.treatment.includes('mobile-safe CTA spacing')
          ? source.plan.visualBrief.treatment
          : `${source.plan.visualBrief.treatment}; mobile-safe CTA spacing; tablet sections balance`,
        composition: source.plan.visualBrief.composition.includes('Responsive auto-fix applied')
          ? source.plan.visualBrief.composition
          : `${source.plan.visualBrief.composition} Responsive auto-fix applied: stack proof cards before CTA, reserve tap-safe spacing, and balance two-column tablet sections.`,
      },
    },
  };
}

function isResponsiveAutoFixed(value: Draft): boolean {
  return value.plan.visualBrief.treatment.includes('mobile-safe CTA spacing')
    && value.plan.visualBrief.composition.includes('Responsive auto-fix applied');
}

function responsiveBreakpointIssues(
  sectionIds: string[],
  sectionCopyById: Map<string, string>,
  autoFixed: boolean,
  breakpoint: 'mobile' | 'tablet' = 'mobile',
): string[] {
  const issues: string[] = [];
  const normalizedSectionIds = sectionIds.map((sectionId) => sectionId.toLowerCase());
  if (breakpoint === 'tablet') {
    if (sectionIds.length >= 4) {
      issues.push('Tablet two-column balance');
    }
    return autoFixed ? [] : issues;
  }
  if (sectionIds.length >= 4) {
    issues.push('Dense mobile section stack');
  }
  if (!autoFixed && normalizedSectionIds.some((sectionId) => (
    sectionId.includes('cta')
    || sectionId.includes('contact')
    || sectionId.includes('newsletter')
  ))) {
    issues.push('CTA tap target spacing');
  }
  if (!autoFixed && sectionIds.some((sectionId) => (sectionCopyById.get(sectionId)?.length ?? 0) > 165)) {
    issues.push('Long copy compaction');
  }
  return issues;
}

function designerStyleSuggestions(source: Draft): DesignerStyleSuggestion[] {
  const candidates: Array<Omit<
    DesignerStyleSuggestion,
    | 'rank'
    | 'score'
    | 'scoreReasons'
    | 'layoutFit'
    | 'paletteFit'
    | 'fitPreview'
    | 'designPoolProfile'
    | 'designPoolFit'
    | 'designPoolSignals'
  >> = [
    {
      id: 'editorial-trust',
      label: 'Editorial trust',
      description: '자격·근거·상담 CTA가 차분하게 이어지는 법률형 편집 시스템',
      treatment: 'editorial trust system with credential rails, measured dividers, and concise proof chips',
      composition: 'place credentials beside the hero, then alternate proof cards and article-style section rhythm',
      palette: {
        ...source.palette,
        primary: '#102a43',
        secondary: '#0f766e',
        accent: '#d6a84f',
        background: '#f6faf9',
      },
    },
    {
      id: 'conversion-clarity',
      label: 'Conversion clarity',
      description: '상담 버튼·신뢰 수치·핵심 업무를 빠르게 스캔하는 전환형 레이아웃',
      treatment: 'conversion clarity system with CTA dock, compact service cards, and high-contrast trust metrics',
      composition: 'pin the primary CTA near proof metrics, then stack service cards with generous tap targets',
      palette: {
        ...source.palette,
        primary: '#111827',
        secondary: '#2563eb',
        accent: '#dc6b21',
        background: '#f8fafc',
      },
    },
    {
      id: 'boutique-premium',
      label: 'Boutique premium',
      description: '고급 사무소 느낌의 여백, 얇은 라인, restrained accent 중심 비주얼',
      treatment: 'boutique premium system with slim editorial lines, soft media depth, and restrained accent moments',
      composition: 'lead with spacious hero typography, then use two-column proof/editorial blocks on desktop and clean stacks on mobile',
      palette: {
        ...source.palette,
        primary: '#1f2937',
        secondary: '#4f46e5',
        accent: '#b7791f',
        background: '#fbfbf7',
      },
    },
  ];
  const scoringById = new Map(
    scoreDesignerStyleCandidates(source.spec).map((score) => [score.id, score]),
  );
  return candidates
    .map((suggestion) => {
      const scoring = scoringById.get(suggestion.id);
      return {
        ...suggestion,
        score: scoring?.score ?? 70,
        rank: scoring?.rank ?? 99,
        scoreReasons: scoring?.reasons ?? ['balanced baseline'],
        layoutFit: scoring?.layoutFit ?? 78,
        paletteFit: scoring?.paletteFit ?? 76,
        fitPreview: scoring?.fitPreview ?? 'Balanced page rhythm',
        designPoolProfile: scoring?.designPoolProfile ?? 'balanced-builder-system',
        designPoolFit: scoring?.designPoolFit ?? 76,
        designPoolSignals: scoring?.designPoolSignals ?? ['balanced rhythm'],
      };
    })
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label))
    .map((suggestion) => suggestion);
}

function replaceOrAppendBriefNote(value: string, label: string, replacement: string): string {
  const pattern = new RegExp(`${label}[^.]+\\.?`, 'i');
  if (pattern.test(value)) {
    return value.replace(pattern, `${label}${replacement}.`);
  }
  return `${value} ${label}${replacement}.`;
}

function designerPolishedDraft(source: Draft, suggestion: DesignerStyleSuggestion): Draft {
  return {
    ...source,
    palette: suggestion.palette,
    plan: {
      ...source.plan,
      visualBrief: {
        ...source.plan.visualBrief,
        treatment: replaceOrAppendBriefNote(
          source.plan.visualBrief.treatment,
          'Designer polish: ',
          suggestion.treatment,
        ),
        composition: replaceOrAppendBriefNote(
          source.plan.visualBrief.composition,
          'Designer polish layout: ',
          suggestion.composition,
        ),
      },
    },
  };
}

function draftCopyLength(value: Draft): number {
  return [
    value.content.hero.headline,
    value.content.hero.body,
    ...value.content.sections.flatMap((section) => [section.headline, section.body]),
  ].join(' ').length;
}

function draftVisualSectionSignature(value: Draft): string[] {
  return ['hero', ...value.content.sections.map((section) => section.sectionId)];
}

function fullPageVisualDiffMetrics(selected: Draft, current: Draft): DraftVisualDiffMetrics {
  const paletteKeys: Array<keyof Draft['palette']> = ['primary', 'secondary', 'accent', 'background'];
  const selectedSections = draftVisualSectionSignature(selected);
  const currentSections = draftVisualSectionSignature(current);
  const longestSectionCount = Math.max(selectedSections.length, currentSections.length);
  return {
    paletteTokens: paletteKeys.filter((key) => selected.palette[key] !== current.palette[key]).length,
    sectionOrder: Array.from({ length: longestSectionCount }).filter((_, index) => (
      selectedSections[index] !== currentSections[index]
    )).length,
    copyLength: Math.abs(draftCopyLength(current) - draftCopyLength(selected)),
    visualGuidance: [
      selected.plan.visualBrief.treatment !== current.plan.visualBrief.treatment,
      selected.plan.visualBrief.composition !== current.plan.visualBrief.composition,
    ].filter(Boolean).length,
  };
}

function renderDraftPageStrip(draftValue: Draft, label: string, dataAttribute: string): ReactNode {
  const blocks = [
    {
      id: 'hero',
      label: draftValue.content.hero.headline,
      detail: draftValue.content.hero.body,
      size: 'large',
    },
    ...draftValue.content.sections.map((section) => ({
      id: section.sectionId,
      label: section.headline,
      detail: section.body,
      size: 'regular',
    })),
  ];
  return (
    <article
      className={styles.generatedPageVisualStrip}
      style={{ background: draftValue.palette.background }}
      data-ai-generator-page-visual-strip={dataAttribute}
    >
      <div className={styles.generatedPageVisualStripHead}>
        <span>{label}</span>
        <strong>{draftValue.promptVersion ?? 'unknown'}</strong>
      </div>
      <div className={styles.generatedPageVisualBlocks}>
        {blocks.map((block) => (
          <i
            key={block.id}
            className={block.size === 'large' ? styles.generatedPageVisualBlockHero : styles.generatedPageVisualBlock}
            style={{
              borderColor: block.size === 'large' ? draftValue.palette.accent : draftValue.palette.secondary,
              color: block.size === 'large' ? draftValue.palette.primary : draftValue.palette.secondary,
            }}
            title={block.detail}
          >
            {block.label}
          </i>
        ))}
      </div>
    </article>
  );
}

export default function AiGeneratorWizard({ locale, siteId }: Props) {
  const [step, setStep] = useState<WizardStep>(1);
  const [industry, setIndustry] = useState<Industry>('law');
  const [companyName, setCompanyName] = useState('호정국제법률사무소');
  const [slogan, setSlogan] = useState('');
  const [audience, setAudience] = useState('대만 진출을 준비하는 한국 기업과 개인 고객');
  const [goalsText, setGoalsText] = useState('상담 문의 증가\n전문성 신뢰 확보\n칼럼 기반 검색 유입');
  const [pagesText, setPagesText] = useState('홈\n업무분야\n변호사\n칼럼\nFAQ\n문의');
  const [brandKeywordsText, setBrandKeywordsText] = useState('대만 법률\n한국어 상담\n국제 사건');
  const [constraints, setConstraints] = useState('모바일에서 상담 CTA와 전화 문의 동선이 먼저 보여야 함');
  const [visualDirection, setVisualDirection] = useState('타이베이 도시감, 차분한 법률 사무소, 선명한 인물 없는 상담 장면, 신뢰 중심의 편집형 히어로');
  const [tone, setTone] = useState<Tone>('professional');
  const [colorPreference, setColorPreference] = useState<ColorPreference>('cool');
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [appliedPageId, setAppliedPageId] = useState<string | null>(null);
  const [appliedSlug, setAppliedSlug] = useState<string | null>(null);
  const [appliedPages, setAppliedPages] = useState<ApplyCreatedPage[]>([]);
  const [skippedApplyPages, setSkippedApplyPages] = useState<ApplySkippedPage[]>([]);
  const [applyScope, setApplyScope] = useState<'single' | 'sitemap'>('single');
  const [selectedSitemapPageSlugs, setSelectedSitemapPageSlugs] = useState<string[]>([]);
  const [includeNavigation, setIncludeNavigation] = useState(false);
  const [navigationAddedSlugs, setNavigationAddedSlugs] = useState<string[]>([]);
  const [discarding, setDiscarding] = useState(false);
  const [discardNotice, setDiscardNotice] = useState('');
  const [sitePages, setSitePages] = useState<BuilderSitePageSummary[]>([]);
  const [sitePagesLoading, setSitePagesLoading] = useState(false);
  const [sitePagesError, setSitePagesError] = useState('');
  const [siteNavigation, setSiteNavigation] = useState<BuilderNavigationItemSummary[]>([]);
  const [siteNavigationLoading, setSiteNavigationLoading] = useState(false);
  const [siteNavigationError, setSiteNavigationError] = useState('');
  const [publishingPageId, setPublishingPageId] = useState<string | null>(null);
  const [publishedPageIds, setPublishedPageIds] = useState<string[]>([]);
  const [publishPreflightByPageId, setPublishPreflightByPageId] = useState<Record<string, PublishPreflightSummary>>({});
  const [schedulingPageId, setSchedulingPageId] = useState<string | null>(null);
  const [cancellingScheduledPageId, setCancellingScheduledPageId] = useState<string | null>(null);
  const [scheduledPublishByPageId, setScheduledPublishByPageId] = useState<Record<string, ScheduledPublishJobSummary>>({});
  const [scheduledPublishInputByPageId, setScheduledPublishInputByPageId] = useState<Record<string, string>>({});
  const [publishWarningAcknowledgedByPageId, setPublishWarningAcknowledgedByPageId] = useState<Record<string, boolean>>({});
  const [publishNotice, setPublishNotice] = useState('');
  const [publishError, setPublishError] = useState('');
  const [savingSectionRootId, setSavingSectionRootId] = useState<string | null>(null);
  const [savedSectionIds, setSavedSectionIds] = useState<Record<string, string>>({});
  const [sectionSaveNotice, setSectionSaveNotice] = useState('');
  const [draftSlug, setDraftSlug] = useState(suggestDraftSlug);
  const [history, setHistory] = useState<PromptHistoryEntry[]>([]);
  const [historyNotice, setHistoryNotice] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [assetLibrary, setAssetLibrary] = useState<HeroAssetSelection[]>([]);
  const [assetLoading, setAssetLoading] = useState(false);
  const [assetError, setAssetError] = useState('');
  const [selectedHeroAsset, setSelectedHeroAsset] = useState<HeroAssetSelection | null>(null);
  const [imageGenerating, setImageGenerating] = useState(false);
  const [imageGenerationNotice, setImageGenerationNotice] = useState('');
  const [draftPreviewFrame, setDraftPreviewFrame] = useState<DraftPreviewFrame>('desktop');
  const [selectedPromptVersion, setSelectedPromptVersion] = useState(AI_GENERATOR_PROMPT_VERSION);
  const [comparingDrafts, setComparingDrafts] = useState(false);
  const [generatedDraftComparison, setGeneratedDraftComparison] = useState<GeneratedDraftComparison | null>(null);
  const [responsiveFixSnapshot, setResponsiveFixSnapshot] = useState<Draft | null>(null);
  const [responsiveFixNotice, setResponsiveFixNotice] = useState('');
  const [designerSuggestionSnapshot, setDesignerSuggestionSnapshot] = useState<Draft | null>(null);
  const [designerSuggestionNotice, setDesignerSuggestionNotice] = useState('');
  const [appliedDesignerSuggestionId, setAppliedDesignerSuggestionId] = useState('');
  const [designerServerScoreStatus, setDesignerServerScoreStatus] = useState<DesignerServerScoreStatus>('idle');
  const [designerServerScorePayload, setDesignerServerScorePayload] = useState('');
  const [designerServerScoreTop, setDesignerServerScoreTop] = useState('none');
  const [designerServerScoreCount, setDesignerServerScoreCount] = useState(0);
  const [designerServerScoreNotice, setDesignerServerScoreNotice] = useState('');
  const [serverVersions, setServerVersions] = useState<ServerIntakeVersionSummary[]>([]);
  const [serverVersionsLoading, setServerVersionsLoading] = useState(false);
  const [serverVersionsError, setServerVersionsError] = useState('');
  const [serverVersionNotice, setServerVersionNotice] = useState('');
  const [serverVersionDiff, setServerVersionDiff] = useState<ServerVersionDiffState | null>(null);
  const [serverVersionDiffLoadingId, setServerVersionDiffLoadingId] = useState<string | null>(null);
  const [serverVersionRestoringId, setServerVersionRestoringId] = useState<string | null>(null);
  const promptVersionComparison = useMemo(() => {
    const selected = promptVersionEntry(selectedPromptVersion);
    const current = promptVersionEntry(AI_GENERATOR_PROMPT_VERSION);
    const selectedChanges = new Set(selected.changes);
    const currentChanges = new Set(current.changes);
    return {
      selected,
      current,
      isCurrent: selected.version === current.version,
      selectedOnly: selected.changes.filter((change) => !currentChanges.has(change)),
      currentOnly: current.changes.filter((change) => !selectedChanges.has(change)),
    };
  }, [selectedPromptVersion]);

  useEffect(() => {
    setHydrated(true);
    try {
      const stored = window.localStorage.getItem(aiGeneratorHistoryKey(locale));
      const parsed = stored ? JSON.parse(stored) : [];
      setHistory(Array.isArray(parsed) ? parsed.filter(isPromptHistoryEntry).slice(0, 6) : []);
    } catch {
      setHistory([]);
    }
  }, [locale]);

  const refreshServerVersions = useCallback(async (
    options: { silent?: boolean; notice?: string } = {},
  ): Promise<ServerIntakeVersionSummary[]> => {
    if (!options.silent) setServerVersionsLoading(true);
    setServerVersionsError('');
    try {
      const response = await fetch(
        `/api/builder/ai-generator/versions?siteId=${encodeURIComponent(siteId)}&locale=${encodeURIComponent(locale)}`,
        {
          credentials: 'same-origin',
        },
      );
      const payload = (await response.json().catch(() => ({}))) as ServerVersionsResponse;
      if (!response.ok || !Array.isArray(payload.versions)) {
        setServerVersions([]);
        setServerVersionsError(payload.message ?? payload.error ?? '서버 생성 기록을 불러오지 못했습니다.');
        return [];
      }
      setServerVersions(payload.versions);
      if (options.notice) setServerVersionNotice(options.notice);
      return payload.versions;
    } catch (error) {
      setServerVersions([]);
      setServerVersionsError(error instanceof Error ? error.message : '서버 생성 기록을 불러오지 못했습니다.');
      return [];
    } finally {
      if (!options.silent) setServerVersionsLoading(false);
    }
  }, [locale, siteId]);

  const refreshSitePages = useCallback(async (
    options: { silent?: boolean } = {},
  ): Promise<BuilderSitePageSummary[]> => {
    if (!options.silent) setSitePagesLoading(true);
    setSitePagesError('');
    try {
      const response = await fetch(`/api/builder/site/pages?locale=${encodeURIComponent(locale)}`, {
        credentials: 'same-origin',
      });
      const payload = (await response.json().catch(() => ({}))) as PagesResponse;
      if (!response.ok || !Array.isArray(payload.pages)) {
        setSitePages([]);
        setSitePagesError(payload.message ?? payload.error ?? '현재 page tree를 불러오지 못했습니다.');
        return [];
      }
      setSitePages(payload.pages);
      return payload.pages;
    } catch {
      setSitePages([]);
      setSitePagesError('현재 page tree를 불러오지 못했습니다.');
      return [];
    } finally {
      if (!options.silent) setSitePagesLoading(false);
    }
  }, [locale]);

  const refreshSiteNavigation = useCallback(async (
    options: { silent?: boolean } = {},
  ): Promise<BuilderNavigationItemSummary[]> => {
    if (!options.silent) setSiteNavigationLoading(true);
    setSiteNavigationError('');
    try {
      const response = await fetch(`/api/builder/site/navigation?locale=${encodeURIComponent(locale)}`, {
        credentials: 'same-origin',
      });
      const payload = (await response.json().catch(() => ({}))) as NavigationResponse;
      if (!response.ok || !Array.isArray(payload.navigation)) {
        setSiteNavigation([]);
        setSiteNavigationError(payload.message ?? payload.error ?? '현재 Navigation tree를 불러오지 못했습니다.');
        return [];
      }
      setSiteNavigation(payload.navigation);
      return payload.navigation;
    } catch {
      setSiteNavigation([]);
      setSiteNavigationError('현재 Navigation tree를 불러오지 못했습니다.');
      return [];
    } finally {
      if (!options.silent) setSiteNavigationLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    void refreshSitePages();
    void refreshSiteNavigation();
  }, [refreshSiteNavigation, refreshSitePages]);

  useEffect(() => {
    void refreshServerVersions({ silent: true });
  }, [refreshServerVersions]);

  useEffect(() => {
    let active = true;
    setAssetLoading(true);
    setAssetError('');
    fetch(`/api/builder/assets?locale=${encodeURIComponent(locale)}&limit=8`, {
      credentials: 'same-origin',
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as AssetsResponse;
        if (!active) return;
        if (!response.ok || !payload.ok || !Array.isArray(payload.assets)) {
          setAssetLibrary([]);
          setAssetError(payload.message ?? payload.error ?? '이미지 에셋을 불러오지 못했습니다.');
          return;
        }
        setAssetLibrary(payload.assets.map((asset) => ({
          assetId: asset.pathname,
          url: asset.url,
          filename: asset.filename,
          contentType: asset.contentType,
          uploadedAt: asset.uploadedAt,
          locale: asset.locale,
          pathname: asset.pathname,
        })));
      })
      .catch(() => {
        if (!active) return;
        setAssetLibrary([]);
        setAssetError('이미지 에셋을 불러오지 못했습니다.');
      })
      .finally(() => {
        if (active) setAssetLoading(false);
      });
    return () => {
      active = false;
    };
  }, [locale]);

  function buildSpec(): SiteSpec {
    const heroAssetId = selectedHeroAsset ? builderAssetIdForSelection(selectedHeroAsset) : '';
    return {
      industry,
      companyName: companyName.trim(),
      slogan: slogan.trim() || undefined,
      audience: audience.trim() || undefined,
      goals: splitList(goalsText),
      desiredPages: splitList(pagesText),
      brandKeywords: splitList(brandKeywordsText),
      constraints: constraints.trim() || undefined,
      visualDirection: visualDirection.trim() || undefined,
      heroImageAsset: selectedHeroAsset && heroAssetId
        ? {
            assetId: heroAssetId,
            filename: selectedHeroAsset.filename,
            alt: selectedHeroAsset.alt || assetAltFromFilename(selectedHeroAsset.filename),
          }
        : undefined,
      tone,
      colorPreference,
      locale,
    };
  }

  async function apply() {
    if (!draft) return;
    const slug = draftSlug.trim().replace(/^\/+|\/+$/g, '');
    const slugError = applyScope === 'single' ? validateDraftSlug(slug) : '';
    if (slugError) {
      setError(slugError);
      return;
    }
    if (applyScope === 'sitemap' && selectedSitemapPageSlugs.length === 0) {
      setError('생성할 sitemap page를 하나 이상 선택해 주세요.');
      return;
    }
    setApplying(true);
    setError('');
    setAppliedPageId(null);
    setAppliedSlug(null);
    setAppliedPages([]);
    setSkippedApplyPages([]);
    setNavigationAddedSlugs([]);
    setPublishedPageIds([]);
    setPublishPreflightByPageId({});
    setScheduledPublishByPageId({});
    setScheduledPublishInputByPageId({});
    setPublishWarningAcknowledgedByPageId({});
    setCancellingScheduledPageId(null);
    setPublishNotice('');
    setPublishError('');
    setDiscardNotice('');
    try {
      const res = await fetch('/api/builder/ai-generator/apply', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spec: draft.spec,
          scope: applyScope,
          slug: applyScope === 'single' ? slug : undefined,
          pageSlugs: applyScope === 'sitemap' ? selectedSitemapPageSlugs : undefined,
          addToNavigation: applyScope === 'sitemap' ? includeNavigation : false,
          promptVersion: draft.promptVersion,
          title: companyName.trim(),
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as ApplyResponse;
      const nextPages = payload.pages && payload.pages.length > 0
        ? payload.pages
        : payload.pageId
          ? [{ pageId: payload.pageId, slug: payload.slug ?? slug, title: companyName.trim() }]
          : [];
      if (!res.ok || nextPages.length === 0) {
        setError(payload.message ?? payload.error ?? '적용 실패');
        setSkippedApplyPages(payload.skippedPages ?? []);
        return;
      }
      setAppliedPages(nextPages);
      setSkippedApplyPages(payload.skippedPages ?? []);
      setNavigationAddedSlugs(payload.navigationAdded ?? []);
      setAppliedPageId(nextPages[0]?.pageId ?? null);
      setAppliedSlug(nextPages[0]?.slug ?? null);
      setDiscardNotice('');
      void refreshSitePages({ silent: true });
      void refreshSiteNavigation({ silent: true });
      void Promise.all(nextPages.map((pageEntry) => loadPublishPreflight(pageEntry)));
      if (applyScope === 'single') setDraftSlug(suggestDraftSlug());
    } finally {
      setApplying(false);
    }
  }

  async function discardAppliedDraft() {
    const pagesToDiscard = appliedPages.length > 0
      ? appliedPages
      : appliedPageId
        ? [{ pageId: appliedPageId, slug: appliedSlug ?? '' }]
        : [];
    if (pagesToDiscard.length === 0) return;
    setDiscarding(true);
    setError('');
    setDiscardNotice('');
    try {
      const results = await Promise.all(pagesToDiscard.map(async (pageEntry) => {
        const res = await fetch(`/api/builder/site/pages/${encodeURIComponent(pageEntry.pageId)}?locale=${locale}`, {
          method: 'DELETE',
          credentials: 'same-origin',
        });
        return { res, pageEntry };
      }));
      const failed = results.find((result) => !result.res.ok && result.res.status !== 404);
      if (failed) {
        const payload = (await failed.res.json().catch(() => ({}))) as ApplyResponse;
        setError(payload.message ?? payload.error ?? `${failed.pageEntry.slug || failed.pageEntry.pageId} draft 폐기 실패`);
        return;
      }
      setAppliedPageId(null);
      setAppliedSlug(null);
      setAppliedPages([]);
      setSkippedApplyPages([]);
      setNavigationAddedSlugs([]);
      setPublishedPageIds([]);
      setPublishPreflightByPageId({});
      setScheduledPublishByPageId({});
      setScheduledPublishInputByPageId({});
      setPublishWarningAcknowledgedByPageId({});
      setCancellingScheduledPageId(null);
      setPublishNotice('');
      setPublishError('');
      void refreshSitePages({ silent: true });
      void refreshSiteNavigation({ silent: true });
      const hadMissing = results.some((result) => result.res.status === 404);
      setDiscardNotice(hadMissing
        ? '이미 삭제된 draft로 표시를 정리했습니다.'
        : `${pagesToDiscard.length}개 draft를 폐기했습니다.`);
    } finally {
      setDiscarding(false);
    }
  }

  async function loadPublishPreflight(pageEntry: ApplyCreatedPage) {
    if (!pageEntry.pageId) return;
    setPublishPreflightByPageId((current) => ({
      ...current,
      [pageEntry.pageId]: {
        status: 'checking',
        blockerCount: 0,
        warningCount: 0,
        infoCount: 0,
      },
    }));
    try {
      const res = await fetch('/api/builder/site/publish-checks', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: 'default',
          pageId: pageEntry.pageId,
          locale,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as PublishChecksResponse;
      if (!res.ok || !payload.ok || !payload.suite) {
        setPublishPreflightByPageId((current) => ({
          ...current,
          [pageEntry.pageId]: {
            status: 'error',
            blockerCount: 0,
            warningCount: 0,
            infoCount: 0,
            message: payload.message ?? payload.error ?? 'Publish preflight failed.',
          },
        }));
        return;
      }
      const firstIssue = payload.suite.results?.find((result) => result.severity === 'blocker' || result.severity === 'warning');
      setPublishPreflightByPageId((current) => ({
        ...current,
        [pageEntry.pageId]: {
          status: payload.suite?.hasBlocker ? 'blocked' : 'ready',
          blockerCount: payload.suite?.blockerCount ?? 0,
          warningCount: payload.suite?.warningCount ?? 0,
          infoCount: payload.suite?.infoCount ?? 0,
          checkedAt: payload.suite?.checkedAt,
          firstIssue: firstIssue?.message,
        },
      }));
    } catch {
      setPublishPreflightByPageId((current) => ({
        ...current,
        [pageEntry.pageId]: {
          status: 'error',
          blockerCount: 0,
          warningCount: 0,
          infoCount: 0,
          message: 'Publish preflight network error.',
        },
      }));
    }
  }

  async function publishCreatedPage(pageEntry: ApplyCreatedPage) {
    if (!pageEntry.pageId) return;
    const preflight = publishPreflightByPageId[pageEntry.pageId];
    if (preflight?.status === 'blocked') {
      setPublishError(preflight.firstIssue ?? 'Publish blockers must be fixed before publishing.');
      return;
    }
    if ((preflight?.warningCount ?? 0) > 0 && !publishWarningAcknowledgedByPageId[pageEntry.pageId]) {
      setPublishError('Publish warnings must be acknowledged before publishing.');
      return;
    }
    setPublishingPageId(pageEntry.pageId);
    setPublishError('');
    setPublishNotice('');
    try {
      const res = await fetch(`/api/builder/site/pages/${encodeURIComponent(pageEntry.pageId)}/publish`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const payload = (await res.json().catch(() => ({}))) as PublishCreatedPageResponse;
      if (!res.ok || !payload.ok) {
        setPublishError(payload.message ?? payload.error ?? `${pageEntry.slug || pageEntry.pageId} 발행 실패`);
        return;
      }
      setPublishedPageIds((current) => Array.from(new Set([...current, pageEntry.pageId])));
      setPublishNotice(`${displayPlanPath(payload.slug ?? pageEntry.slug)} published · 공개 header 반영 준비 완료`);
      void refreshSitePages({ silent: true });
      void refreshSiteNavigation({ silent: true });
    } catch {
      setPublishError(`${pageEntry.slug || pageEntry.pageId} 발행 중 네트워크 오류가 발생했습니다.`);
    } finally {
      setPublishingPageId(null);
    }
  }

  async function scheduleCreatedPagePublish(pageEntry: ApplyCreatedPage) {
    if (!pageEntry.pageId) return;
    const preflight = publishPreflightByPageId[pageEntry.pageId];
    if (preflight?.status === 'blocked') {
      setPublishError(preflight.firstIssue ?? 'Publish blockers must be fixed before scheduling.');
      return;
    }
    if ((preflight?.warningCount ?? 0) > 0 && !publishWarningAcknowledgedByPageId[pageEntry.pageId]) {
      setPublishError('Publish warnings must be acknowledged before scheduling.');
      return;
    }
    setSchedulingPageId(pageEntry.pageId);
    setPublishError('');
    setPublishNotice('');
    try {
      const scheduledAtInput = scheduledPublishInputByPageId[pageEntry.pageId]?.trim() || defaultScheduledPublishInput();
      const scheduledAtDate = new Date(scheduledAtInput);
      if (Number.isNaN(scheduledAtDate.getTime()) || scheduledAtDate.getTime() <= Date.now()) {
        setPublishError('미래 예약 시간을 선택해 주세요.');
        return;
      }
      const scheduledAt = scheduledAtDate.toISOString();
      const res = await fetch(`/api/builder/site/pages/${encodeURIComponent(pageEntry.pageId)}/scheduled-publish?locale=${encodeURIComponent(locale)}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          scheduledAt,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as ScheduledPublishResponse;
      if (!res.ok || !payload.ok || !payload.job) {
        setPublishError(payload.message ?? payload.error ?? `${pageEntry.slug || pageEntry.pageId} 예약 발행 실패`);
        return;
      }
      setScheduledPublishByPageId((current) => ({
        ...current,
        [pageEntry.pageId]: payload.job as ScheduledPublishJobSummary,
      }));
      setScheduledPublishInputByPageId((current) => ({
        ...current,
        [pageEntry.pageId]: formatDatetimeLocalValue(new Date(payload.job?.scheduledAt ?? scheduledAt)),
      }));
      setPublishNotice(`${displayPlanPath(pageEntry.slug)} scheduled · ${formatScheduledPublishTime(payload.job.scheduledAt)}`);
    } catch {
      setPublishError(`${pageEntry.slug || pageEntry.pageId} 예약 발행 중 네트워크 오류가 발생했습니다.`);
    } finally {
      setSchedulingPageId(null);
    }
  }

  async function cancelCreatedPageSchedule(pageEntry: ApplyCreatedPage) {
    if (!pageEntry.pageId) return;
    setCancellingScheduledPageId(pageEntry.pageId);
    setPublishError('');
    setPublishNotice('');
    try {
      const res = await fetch(`/api/builder/site/pages/${encodeURIComponent(pageEntry.pageId)}/scheduled-publish?locale=${encodeURIComponent(locale)}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      const payload = (await res.json().catch(() => ({}))) as CancelScheduledPublishResponse;
      if (!res.ok || !payload.ok) {
        setPublishError(payload.message ?? payload.error ?? `${pageEntry.slug || pageEntry.pageId} 예약 취소 실패`);
        return;
      }
      setScheduledPublishByPageId((current) => {
        const next = { ...current };
        delete next[pageEntry.pageId];
        return next;
      });
      setPublishNotice(`${displayPlanPath(pageEntry.slug)} schedule cancelled · ${payload.cancelled ?? 0} job`);
    } catch {
      setPublishError(`${pageEntry.slug || pageEntry.pageId} 예약 취소 중 네트워크 오류가 발생했습니다.`);
    } finally {
      setCancellingScheduledPageId(null);
    }
  }

  function rememberDraft(nextDraft: Draft) {
    const entry: PromptHistoryEntry = {
      id: `history-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      spec: nextDraft.spec,
      draft: nextDraft,
    };
    setHistory((current) => {
      const next = [entry, ...current].slice(0, 6);
      persistPromptHistory(locale, next);
      return next;
    });
    setHistoryNotice('생성 기록에 저장했습니다.');
  }

  function updateStoredDraftHistory(previousDraft: Draft, nextDraft: Draft) {
    const previousSignature = draftHistorySignature(previousDraft);
    setHistory((current) => {
      const next = current.map((entry) => (
        entry.draft === previousDraft || draftHistorySignature(entry.draft) === previousSignature
          ? { ...entry, spec: nextDraft.spec, draft: nextDraft }
          : entry
      ));
      persistPromptHistory(locale, next);
      return next;
    });
  }

  function restoreDraftEntry(entry: PromptHistoryEntry, notice: string) {
    setIndustry(entry.spec.industry);
    setCompanyName(entry.spec.companyName);
    setSlogan(entry.spec.slogan ?? '');
    setAudience(entry.spec.audience ?? '');
    setGoalsText((entry.spec.goals ?? []).join('\n'));
    setPagesText((entry.spec.desiredPages ?? []).join('\n'));
    setBrandKeywordsText((entry.spec.brandKeywords ?? []).join('\n'));
    setConstraints(entry.spec.constraints ?? '');
    setVisualDirection(entry.spec.visualDirection ?? '');
    setSelectedHeroAsset(entry.spec.heroImageAsset
      ? {
          assetId: entry.spec.heroImageAsset.assetId,
          url: builderAssetUrlFromId(entry.spec.heroImageAsset.assetId),
          filename: entry.spec.heroImageAsset.filename,
          alt: entry.spec.heroImageAsset.alt,
        }
      : null);
    setTone(entry.spec.tone);
    setColorPreference(entry.spec.colorPreference);
    setSelectedPromptVersion(entry.draft.promptVersion ?? AI_GENERATOR_PROMPT_VERSION);
    setDraft(entry.draft);
    setAppliedPageId(null);
    setAppliedSlug(null);
    setAppliedPages([]);
    setSkippedApplyPages([]);
    setNavigationAddedSlugs([]);
    setPublishedPageIds([]);
    setPublishPreflightByPageId({});
    setScheduledPublishByPageId({});
    setScheduledPublishInputByPageId({});
    setPublishWarningAcknowledgedByPageId({});
    setCancellingScheduledPageId(null);
    setPublishNotice('');
    setPublishError('');
    setSelectedSitemapPageSlugs(selectableSitemapSlugs(entry.draft));
    setDiscardNotice('');
    setSavedSectionIds({});
    setSectionSaveNotice('');
    setResponsiveFixSnapshot(null);
    setResponsiveFixNotice('');
    setDesignerSuggestionSnapshot(null);
    setDesignerSuggestionNotice('');
    setAppliedDesignerSuggestionId('');
    setDraftSlug(suggestDraftSlug());
    setDraftPreviewFrame('desktop');
    setError('');
    setHistoryNotice(notice);
    setStep(6);
  }

  function restoreHistory(entry: PromptHistoryEntry) {
    restoreDraftEntry(entry, '이전 생성안을 복원했습니다.');
  }

  function removeHistoryEntry(entryId: string) {
    setHistory((current) => {
      const next = current.filter((entry) => entry.id !== entryId);
      persistPromptHistory(locale, next);
      return next;
    });
    setHistoryNotice('생성 기록을 삭제했습니다.');
  }

  async function compareServerVersionWithPrevious(version: ServerIntakeVersionSummary, previous?: ServerIntakeVersionSummary) {
    if (!previous) {
      setServerVersionNotice('비교할 이전 서버 버전이 없습니다.');
      return;
    }
    setServerVersionDiffLoadingId(version.id);
    setServerVersionsError('');
    setServerVersionNotice('');
    try {
      const response = await fetch(
        `/api/builder/ai-generator/versions/${encodeURIComponent(previous.id)}/diff/${encodeURIComponent(version.id)}?siteId=${encodeURIComponent(siteId)}`,
        { credentials: 'same-origin' },
      );
      const payload = (await response.json().catch(() => ({}))) as ServerVersionDiffResponse;
      if (!response.ok || !payload.diff || !payload.leftId || !payload.rightId) {
        setServerVersionsError(payload.message ?? payload.error ?? '서버 버전 비교를 불러오지 못했습니다.');
        return;
      }
      setServerVersionDiff({
        leftId: payload.leftId,
        rightId: payload.rightId,
        diff: payload.diff,
      });
      setServerVersionNotice(`${serverDiffChangeCount(payload.diff)}개 변경점을 비교했습니다.`);
    } catch (error) {
      setServerVersionsError(error instanceof Error ? error.message : '서버 버전 비교를 불러오지 못했습니다.');
    } finally {
      setServerVersionDiffLoadingId(null);
    }
  }

  async function restoreServerVersion(version: ServerIntakeVersionSummary) {
    setServerVersionRestoringId(version.id);
    setServerVersionsError('');
    setServerVersionNotice('');
    try {
      const response = await fetch(
        `/api/builder/ai-generator/versions/${encodeURIComponent(version.id)}/restore?siteId=${encodeURIComponent(siteId)}`,
        {
          method: 'POST',
          credentials: 'same-origin',
        },
      );
      const payload = (await response.json().catch(() => ({}))) as ServerVersionRestoreResponse;
      const restoredSpec = payload.spec ?? payload.version?.spec;
      const restoredDraft = payload.draft ?? payload.version?.draft;
      if (!response.ok || !restoredSpec || !restoredDraft) {
        setServerVersionsError(payload.message ?? payload.error ?? '서버 버전 복원에 실패했습니다.');
        return;
      }
      restoreDraftEntry({
        id: `server-${version.id}`,
        createdAt: payload.version?.createdAt ?? version.createdAt,
        spec: restoredSpec,
        draft: restoredDraft,
      }, '서버 생성 버전을 현재 draft로 복원했습니다.');
      setServerVersionNotice(`${version.companyName} 서버 버전을 복원했습니다.`);
    } catch (error) {
      setServerVersionsError(error instanceof Error ? error.message : '서버 버전 복원에 실패했습니다.');
    } finally {
      setServerVersionRestoringId(null);
    }
  }

  async function generate() {
    if (!companyName.trim()) {
      setError('회사명을 입력해 주세요.');
      setStep(2);
      return;
    }
    setBusy(true);
    setError('');
    setAppliedPageId(null);
    setAppliedSlug(null);
    setAppliedPages([]);
    setSkippedApplyPages([]);
    setNavigationAddedSlugs([]);
    setPublishedPageIds([]);
    setPublishPreflightByPageId({});
    setScheduledPublishByPageId({});
    setScheduledPublishInputByPageId({});
    setPublishWarningAcknowledgedByPageId({});
    setCancellingScheduledPageId(null);
    setPublishNotice('');
    setPublishError('');
    setDiscardNotice('');
    setSavedSectionIds({});
    setSectionSaveNotice('');
    setResponsiveFixSnapshot(null);
    setResponsiveFixNotice('');
    setDesignerSuggestionSnapshot(null);
    setDesignerSuggestionNotice('');
    setAppliedDesignerSuggestionId('');
    try {
      const res = await fetch(`/api/builder/ai-generator?siteId=${encodeURIComponent(siteId)}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spec: buildSpec(),
          promptVersion: selectedPromptVersion,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as DraftResponse;
      if (!res.ok || !payload.draft) {
        setError(payload.message ?? payload.error ?? '생성 실패');
        return;
      }
      setDraft(payload.draft);
      setSelectedSitemapPageSlugs(selectableSitemapSlugs(payload.draft));
      rememberDraft(payload.draft);
      if (payload.versionId) {
        void refreshServerVersions({ silent: true, notice: '서버 버전 ledger에 저장했습니다.' });
      } else if (payload.versionWarning) {
        setServerVersionNotice('생성은 완료됐지만 서버 버전 ledger 저장은 건너뛰었습니다.');
      }
      setDraftSlug(suggestDraftSlug());
      setDraftPreviewFrame('desktop');
      setStep(6);
    } finally {
      setBusy(false);
    }
  }

  async function requestDraftForPromptVersion(promptVersion: string): Promise<Draft> {
    const res = await fetch(`/api/builder/ai-generator?siteId=${encodeURIComponent(siteId)}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        spec: buildSpec(),
        promptVersion,
      }),
    });
    const payload = (await res.json().catch(() => ({}))) as DraftResponse;
    if (!res.ok || !payload.draft) {
      throw new Error(payload.message ?? payload.error ?? '비교 생성 실패');
    }
    return payload.draft;
  }

  async function comparePromptDrafts() {
    if (promptVersionComparison.isCurrent) {
      setError('Rollback 프롬프트 버전을 선택한 뒤 두 draft를 비교해 주세요.');
      return;
    }
    if (!companyName.trim()) {
      setError('회사명을 입력해 주세요.');
      setStep(2);
      return;
    }
    setComparingDrafts(true);
    setError('');
    setGeneratedDraftComparison(null);
    try {
      const [selected, current] = await Promise.all([
        requestDraftForPromptVersion(promptVersionComparison.selected.version),
        requestDraftForPromptVersion(promptVersionComparison.current.version),
      ]);
      setGeneratedDraftComparison({
        selected,
        current,
        comparedAt: new Date().toISOString(),
      });
      void refreshServerVersions({ silent: true });
    } catch (comparisonError) {
      setError(comparisonError instanceof Error ? comparisonError.message : '비교 생성 실패');
    } finally {
      setComparingDrafts(false);
    }
  }

  function applyComparedDraft(nextDraft: Draft) {
    setSelectedPromptVersion(nextDraft.promptVersion ?? AI_GENERATOR_PROMPT_VERSION);
    setDraft(nextDraft);
    setSelectedSitemapPageSlugs(selectableSitemapSlugs(nextDraft));
    rememberDraft(nextDraft);
    setAppliedPageId(null);
    setAppliedSlug(null);
    setAppliedPages([]);
    setSkippedApplyPages([]);
    setNavigationAddedSlugs([]);
    setPublishedPageIds([]);
    setPublishPreflightByPageId({});
    setScheduledPublishByPageId({});
    setScheduledPublishInputByPageId({});
    setPublishWarningAcknowledgedByPageId({});
    setCancellingScheduledPageId(null);
    setPublishNotice('');
    setPublishError('');
    setDiscardNotice('');
    setSavedSectionIds({});
    setSectionSaveNotice('');
    setResponsiveFixSnapshot(null);
    setResponsiveFixNotice('');
    setDesignerSuggestionSnapshot(null);
    setDesignerSuggestionNotice('');
    setAppliedDesignerSuggestionId('');
    setDraftSlug(suggestDraftSlug());
    setDraftPreviewFrame('desktop');
    setStep(6);
  }

  function applyResponsiveDraftFix() {
    if (!draft) return;
    const nextDraft = responsiveFixedDraft(draft);
    setResponsiveFixSnapshot(draft);
    setDraft(nextDraft);
    updateStoredDraftHistory(draft, nextDraft);
    setDraftPreviewFrame('mobile');
    setResponsiveFixNotice('모바일 CTA 간격, 긴 문장, 태블릿 2열 균형을 자동 보정했습니다.');
    setError('');
  }

  function undoResponsiveDraftFix() {
    if (!draft || !responsiveFixSnapshot) return;
    updateStoredDraftHistory(draft, responsiveFixSnapshot);
    setDraft(responsiveFixSnapshot);
    setResponsiveFixSnapshot(null);
    setDraftPreviewFrame('desktop');
    setResponsiveFixNotice('반응형 자동 보정을 되돌렸습니다.');
  }

  function applyDesignerStyleSuggestion(suggestion: DesignerStyleSuggestion) {
    if (!draft) return;
    const nextDraft = designerPolishedDraft(draft, suggestion);
    setDesignerSuggestionSnapshot(draft);
    setDraft(nextDraft);
    updateStoredDraftHistory(draft, nextDraft);
    setAppliedDesignerSuggestionId(suggestion.id);
    setDesignerSuggestionNotice(`${suggestion.label} 디자인 시스템을 적용했습니다.`);
    setError('');
  }

  function undoDesignerStyleSuggestion() {
    if (!draft || !designerSuggestionSnapshot) return;
    updateStoredDraftHistory(draft, designerSuggestionSnapshot);
    setDraft(designerSuggestionSnapshot);
    setDesignerSuggestionSnapshot(null);
    setAppliedDesignerSuggestionId('');
    setDesignerSuggestionNotice('디자이너 스타일 제안을 되돌렸습니다.');
  }

  function moveSelectedSitemapSlug(slug: string, direction: -1 | 1) {
    setSelectedSitemapPageSlugs((current) => {
      const index = current.indexOf(slug);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
    setError('');
  }

  async function saveGeneratedSection(snapshot: GeneratedSectionSnapshot) {
    setSavingSectionRootId(snapshot.rootNodeId);
    setError('');
    setSectionSaveNotice('');
    try {
      const res = await fetch('/api/builder/site/section-library', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: snapshot.name,
          description: snapshot.description,
          category: snapshot.category,
          rootNodeId: snapshot.rootNodeId,
          nodes: snapshot.nodes,
          locale,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as SaveSectionResponse;
      if (!res.ok || !payload.section) {
        setError(payload.message ?? payload.error ?? '섹션 저장 실패');
        return;
      }
      const savedSection = payload.section;
      setSavedSectionIds((current) => ({
        ...current,
        [snapshot.rootNodeId]: savedSection.sectionId,
      }));
      setSectionSaveNotice(`Saved Sections에 추가됨: ${savedSection.name}`);
      window.dispatchEvent(new CustomEvent('builder:saved-section-changed'));
    } finally {
      setSavingSectionRootId(null);
    }
  }

  async function generateHeroImageForDraft() {
    if (!draft) return;
    const visualBrief = visualBriefForUi(draft);
    setImageGenerating(true);
    setImageGenerationNotice('');
    setError('');
    try {
      const res = await fetch('/api/builder/ai-generator/image', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          prompt: visualBrief.imagePrompt,
          size: '1536x1024',
          quality: 'medium',
          outputFormat: 'webp',
          outputCompression: 82,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as ImageGenerationResponse;
      if (!res.ok || !payload.ok || !payload.asset) {
        setError(payload.message ?? payload.error ?? 'Image 2.0 생성 실패');
        return;
      }
      const asset: HeroAssetSelection = {
        assetId: payload.asset.pathname,
        url: payload.asset.url,
        filename: payload.asset.filename,
        contentType: payload.asset.contentType,
        uploadedAt: payload.asset.uploadedAt,
        locale: payload.asset.locale,
        pathname: payload.asset.pathname,
        alt: `${draft.spec.companyName} AI hero image`,
      };
      const nextDraft: Draft = {
        ...draft,
        spec: {
          ...draft.spec,
          heroImageAsset: {
            assetId: payload.asset.pathname,
            filename: payload.asset.filename,
            alt: asset.alt,
          },
        },
      };
      setSelectedHeroAsset(asset);
      setDraft(nextDraft);
      updateStoredDraftHistory(draft, nextDraft);
      setAssetLibrary((current) => {
        if (current.some((item) => item.url === asset.url)) return current;
        return [asset, ...current].slice(0, 8);
      });
      setImageGenerationNotice(`Image 2.0 생성됨: ${payload.asset.filename}`);
    } finally {
      setImageGenerating(false);
    }
  }

  const goalList = splitList(goalsText) ?? [];
  const pageList = splitList(pagesText) ?? [];
  const keywordList = splitList(brandKeywordsText) ?? [];
  const draftSlugError = validateDraftSlug(draftSlug);
  const activeDraftSlugError = applyScope === 'single' ? draftSlugError : '';
  const sitemapDraftCount = draft?.plan.sitemap.filter((page) => page.slug !== '/').length ?? 0;
  const selectedSitemapCount = selectedSitemapPageSlugs.length;
  const selectedSitemapPageSlugSet = useMemo(
    () => new Set(selectedSitemapPageSlugs),
    [selectedSitemapPageSlugs],
  );
  const appliedPageSlugs = useMemo(
    () => new Set(appliedPages.map((page) => normalizePlanSlug(page.slug))),
    [appliedPages],
  );
  const skippedPageReasons = useMemo(
    () => new Map(skippedApplyPages.map((page) => [normalizePlanSlug(page.slug), page.reason])),
    [skippedApplyPages],
  );
  const navigationAddedSlugSet = useMemo(
    () => new Set(navigationAddedSlugs.map((slug) => normalizePlanSlug(slug))),
    [navigationAddedSlugs],
  );
  const sitePageBySlug = useMemo(() => {
    const entries = sitePages.map((page) => [normalizePlanSlug(page.slug), page] as const);
    return new Map(entries);
  }, [sitePages]);
  const navigationEntries = useMemo(
    () => flattenNavigationEntries(siteNavigation, locale),
    [locale, siteNavigation],
  );
  const navigationEntryBySlug = useMemo(() => {
    const entries = navigationEntries.map((entry) => [entry.slug, entry] as const);
    return new Map(entries);
  }, [navigationEntries]);
  const publishedCreatedPageIdSet = useMemo(() => {
    const ids = new Set(publishedPageIds);
    for (const page of sitePages) {
      if (page.publishedAt || page.publishedRevisionId) ids.add(page.pageId);
    }
    return ids;
  }, [publishedPageIds, sitePages]);
  const sitemapTreeDiffRows = useMemo<SitemapTreeDiffRow[]>(() => {
    if (!draft) return [];
    return draft.plan.sitemap.map((page, generatedIndex) => {
      const slug = normalizePlanSlug(page.slug);
      const currentIndex = sitePages.findIndex((sitePage) => normalizePlanSlug(sitePage.slug) === slug);
      const targetIndex = selectedSitemapPageSlugs.findIndex((selectedSlug) => normalizePlanSlug(selectedSlug) === slug);
      const state: SitemapTreeDiffRow['state'] = slug === '/'
        ? 'home'
        : appliedPageSlugs.has(slug)
          ? 'created_draft'
          : targetIndex < 0
            ? 'not_selected'
            : currentIndex >= 0
              ? 'will_skip_existing'
              : includeNavigation
                ? 'will_add_nav'
                : 'will_create';
      return {
        slug,
        title: page.title,
        path: displayPlanPath(slug),
        ...planHierarchyFromTitle(page.title),
        generatedIndex,
        currentIndex,
        targetIndex,
        state,
      };
    });
  }, [appliedPageSlugs, draft, includeNavigation, selectedSitemapPageSlugs, sitePages]);
  const sitemapTreeDiffStats = useMemo(() => ({
    newPages: sitemapTreeDiffRows.filter((row) => row.state === 'will_create' || row.state === 'will_add_nav').length,
    existingPages: sitemapTreeDiffRows.filter((row) => row.state === 'will_skip_existing').length,
    navigationAdds: sitemapTreeDiffRows.filter((row) => row.state === 'will_add_nav').length,
    selectedPages: sitemapTreeDiffRows.filter((row) => row.targetIndex >= 0).length,
    nestedPages: sitemapTreeDiffRows.filter((row) => row.depth > 0).length,
  }), [sitemapTreeDiffRows]);
  const sitemapNavigationDiffRows = useMemo<SitemapNavigationDiffRow[]>(() => {
    if (!draft) return [];
    return draft.plan.sitemap.map((page) => {
      const slug = normalizePlanSlug(page.slug);
      const navEntry = navigationEntryBySlug.get(slug);
      const sitePage = sitePageBySlug.get(slug);
      const isPublished = Boolean(sitePage?.publishedAt || sitePage?.publishedRevisionId)
        || appliedPages.some((entry) => normalizePlanSlug(entry.slug) === slug && publishedCreatedPageIdSet.has(entry.pageId));
      const isSelected = selectedSitemapPageSlugSet.has(slug);
      const wasNavigationAdded = navigationAddedSlugSet.has(slug);
      const willAppend = includeNavigation && isSelected && !navEntry && !sitePage;
      const state: SitemapNavigationDiffRow['state'] = slug === '/'
        ? 'home'
        : wasNavigationAdded
          ? isPublished
            ? 'public_after_publish'
            : 'queued_hidden_until_publish'
          : navEntry
            ? isPublished
              ? 'current_public'
              : 'current_hidden_draft'
            : !isSelected
              ? 'not_selected'
              : willAppend
                ? 'will_append_hidden_until_publish'
                : sitePage
                  ? 'page_exists_not_in_nav'
                  : 'draft_only';
      return {
        slug,
        title: page.title,
        path: displayPlanPath(slug),
        state,
        depth: navEntry?.depth ?? 0,
        indexPath: navEntry?.indexPath ?? (willAppend ? `${navigationEntries.length + 1}` : '-'),
      };
    });
  }, [
    appliedPages,
    draft,
    includeNavigation,
    navigationAddedSlugSet,
    navigationEntries.length,
    navigationEntryBySlug,
    publishedCreatedPageIdSet,
    selectedSitemapPageSlugSet,
    sitePageBySlug,
  ]);
  const sitemapNavigationDiffStats = useMemo(() => ({
    current: sitemapNavigationDiffRows.filter((row) => row.state === 'current_public' || row.state === 'current_hidden_draft').length,
    appending: sitemapNavigationDiffRows.filter((row) => row.state === 'will_append_hidden_until_publish' || row.state === 'queued_hidden_until_publish').length,
    publicAfterPublish: sitemapNavigationDiffRows.filter((row) => row.state === 'public_after_publish').length,
    hiddenUntilPublish: sitemapNavigationDiffRows.filter((row) => row.state === 'will_append_hidden_until_publish' || row.state === 'queued_hidden_until_publish' || row.state === 'current_hidden_draft').length,
  }), [sitemapNavigationDiffRows]);
  const generatedSectionSnapshots = useMemo(
    () => (draft
      ? draftToSavedSectionSnapshots({ draft, locale, pageId: 'ai-section-library-preview' })
      : []),
    [draft, locale],
  );
  const activeVisualBrief = draft ? visualBriefForUi(draft) : null;
  const designerSuggestions = useMemo(() => (draft ? designerStyleSuggestions(draft) : []), [draft]);
  const designerScoreExportPayload = useMemo(
    () => serializeDesignerScorePayload(designerSuggestions),
    [designerSuggestions],
  );
  const designerServerScoreRequest = useMemo(() => (draft ? {
    industry: draft.spec.industry,
    tone: draft.spec.tone,
    colorPreference: draft.spec.colorPreference,
    goals: draft.spec.goals ?? [],
    brandKeywords: draft.spec.brandKeywords ?? [],
    constraints: draft.spec.constraints,
    audience: draft.spec.audience,
  } : null), [draft]);
  useEffect(() => {
    if (!designerServerScoreRequest) {
      setDesignerServerScoreStatus('idle');
      setDesignerServerScorePayload('');
      setDesignerServerScoreTop('none');
      setDesignerServerScoreCount(0);
      setDesignerServerScoreNotice('');
      return undefined;
    }

    let active = true;
    setDesignerServerScoreStatus('checking');
    setDesignerServerScoreNotice('Server score checking');
    fetch('/api/builder/ai-generator/style-score', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(designerServerScoreRequest),
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as DesignerServerScoreResponse;
        if (!active) return;
        if (!response.ok || !payload.ok || !payload.payload) {
          setDesignerServerScoreStatus('error');
          setDesignerServerScorePayload('');
          setDesignerServerScoreTop('none');
          setDesignerServerScoreCount(0);
          setDesignerServerScoreNotice(payload.message ?? payload.error ?? 'Server score unavailable');
          return;
        }
        const status: DesignerServerScoreStatus = payload.payload === designerScoreExportPayload
          ? 'synced'
          : 'mismatch';
        setDesignerServerScoreStatus(status);
        setDesignerServerScorePayload(payload.payload);
        setDesignerServerScoreTop(payload.top?.id ?? 'none');
        setDesignerServerScoreCount(payload.scores?.length ?? 0);
        setDesignerServerScoreNotice(status === 'synced' ? 'Server score synced' : 'Server score differs');
      })
      .catch(() => {
        if (!active) return;
        setDesignerServerScoreStatus('error');
        setDesignerServerScorePayload('');
        setDesignerServerScoreTop('none');
        setDesignerServerScoreCount(0);
        setDesignerServerScoreNotice('Server score unavailable');
      });

    return () => {
      active = false;
    };
  }, [designerServerScoreRequest, designerScoreExportPayload]);
  const generatedPageVisualDiff = useMemo(() => (
    generatedDraftComparison
      ? fullPageVisualDiffMetrics(generatedDraftComparison.selected, generatedDraftComparison.current)
      : null
  ), [generatedDraftComparison]);
  const activePromptVersion = draft?.promptVersion ?? 'legacy-local-draft';
  const activeBlueprintVersion = draft?.blueprintVersion ?? 'unknown-blueprint';
  const activePromptChange = draft?.promptChangelog?.find((entry) => entry.version === activePromptVersion)
    ?? draft?.promptChangelog?.[0]
    ?? null;
  const applyReviewPages = useMemo(() => {
    if (!draft) return [];
    if (applyScope === 'single') {
      const slug = normalizePlanSlug(draftSlug);
      return [{
        title: `${draft.spec.companyName || companyName || 'AI site'} draft`,
        slug,
        sections: ['hero', ...draft.content.sections.map((section) => section.sectionId)],
      }];
    }
    const pagesBySlug = new Map(draft.plan.sitemap.map((page) => [normalizePlanSlug(page.slug), page]));
    return selectedSitemapPageSlugs
      .map((slug) => pagesBySlug.get(normalizePlanSlug(slug)))
      .filter((page): page is NonNullable<typeof page> => Boolean(page))
      .map((page) => ({
        title: page.title,
        slug: normalizePlanSlug(page.slug),
        sections: page.sections,
      }));
  }, [applyScope, companyName, draft, draftSlug, selectedSitemapPageSlugs]);
  const applyReviewSectionCount = useMemo(
    () => applyReviewPages.reduce((total, page) => total + page.sections.length, 0),
    [applyReviewPages],
  );
  const applySectionDiffRows = useMemo<ApplySectionDiffRow[]>(() => {
    if (!draft) return [];
    const sectionTitleById = new Map<string, string>([
      ['hero', draft.content.hero.headline],
      ...draft.plan.contentPlan.map((item) => [item.sectionId, item.title] as const),
      ...draft.content.sections.map((section) => [section.sectionId, section.headline] as const),
    ]);
    return applyReviewPages.flatMap((page, pageIndex) => (
      page.sections.map((sectionId, sectionIndex) => ({
        pageSlug: page.slug,
        pageTitle: page.title,
        pageIndex,
        sectionId,
        sectionTitle: sectionTitleById.get(sectionId) ?? sectionId.replace(/-/g, ' '),
        sectionIndex,
        state: 'will_insert' as const,
      }))
    ));
  }, [applyReviewPages, draft]);
  const applySectionDiffStats = useMemo(() => ({
    sectionCount: applySectionDiffRows.length,
    uniqueSectionCount: new Set(applySectionDiffRows.map((row) => row.sectionId)).size,
  }), [applySectionDiffRows]);
  const applyVisualDiffRows = useMemo<ApplyVisualDiffRow[]>(() => (
    applyReviewPages.map((page) => ({
      pageSlug: page.slug,
      pageTitle: page.title,
      beforeState: 'new_draft',
      afterSectionCount: page.sections.length,
      afterSectionSummary: page.sections.slice(0, 4).join(' / '),
    }))
  ), [applyReviewPages]);
  const applyVisualDiffSectionCount = useMemo(
    () => applyVisualDiffRows.reduce((total, row) => total + row.afterSectionCount, 0),
    [applyVisualDiffRows],
  );
  const applyResponsiveReviewRows = useMemo<ApplyResponsiveReviewRow[]>(() => {
    if (!draft) return [];
    const autoFixed = isResponsiveAutoFixed(draft);
    const sectionCopyById = new Map<string, string>([
      ['hero', `${draft.content.hero.headline} ${draft.content.hero.body}`],
      ...draft.content.sections.map((section) => (
        [section.sectionId, `${section.headline} ${section.body}`] as const
      )),
    ]);
    return applyReviewPages.map((page) => {
      const mobileIssues = responsiveBreakpointIssues(page.sections, sectionCopyById, autoFixed, 'mobile');
      const tabletIssues = responsiveBreakpointIssues(page.sections, sectionCopyById, autoFixed, 'tablet');
      const issues = [...mobileIssues, ...tabletIssues];
      return {
        pageSlug: page.slug,
        pageTitle: page.title,
        breakpoint: 'mobile' as const,
        breakpoints: 'mobile,tablet' as const,
        issueCount: issues.length,
        mobileIssueCount: mobileIssues.length,
        tabletIssueCount: tabletIssues.length,
        status: issues.length > 0 ? 'review' : 'ready',
        primaryIssue: issues[0] ?? 'Ready',
        issueSummary: issues.length > 0
          ? [
            mobileIssues.length > 0 ? `Mobile: ${mobileIssues.join(' / ')}` : '',
            tabletIssues.length > 0 ? `Tablet: ${tabletIssues.join(' / ')}` : '',
          ].filter(Boolean).join(' · ')
          : 'Mobile/tablet breakpoints ready',
      };
    });
  }, [applyReviewPages, draft]);
  const applyResponsiveReviewIssueCount = useMemo(
    () => applyResponsiveReviewRows.reduce((total, row) => total + row.issueCount, 0),
    [applyResponsiveReviewRows],
  );
  const applyResponsiveReviewReadyCount = useMemo(
    () => applyResponsiveReviewRows.filter((row) => row.status === 'ready').length,
    [applyResponsiveReviewRows],
  );
  const applyResponsiveReviewMobileIssueCount = useMemo(
    () => applyResponsiveReviewRows.reduce((total, row) => total + row.mobileIssueCount, 0),
    [applyResponsiveReviewRows],
  );
  const applyResponsiveReviewTabletIssueCount = useMemo(
    () => applyResponsiveReviewRows.reduce((total, row) => total + row.tabletIssueCount, 0),
    [applyResponsiveReviewRows],
  );
  const createdDraftPageEntries = useMemo<ApplyCreatedPage[]>(() => {
    if (appliedPages.length > 0) return appliedPages;
    if (!appliedPageId) return [];
    return [{ pageId: appliedPageId, slug: appliedSlug ?? '', title: appliedSlug ?? undefined }];
  }, [appliedPageId, appliedPages, appliedSlug]);
  const createdDraftPublishedCount = useMemo(
    () => createdDraftPageEntries.filter((page) => publishedCreatedPageIdSet.has(page.pageId)).length,
    [createdDraftPageEntries, publishedCreatedPageIdSet],
  );

  return (
    <div className={styles.shell} data-ai-generator data-ai-generator-ready={hydrated ? 'true' : 'false'}>
      <aside className={styles.rail} aria-label="AI generator steps">
        <div className={styles.railHeader}>
          <span>AI Site Builder</span>
          <strong>{companyName || 'Untitled'}</strong>
        </div>
        <nav className={styles.stepList}>
          {STEPS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStep(item.id)}
              disabled={!hydrated || (item.id === 6 && !draft)}
              className={`${styles.stepButton} ${step === item.id ? styles.stepButtonActive : ''}`}
            >
              <span>{item.kicker}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </nav>
        <div className={styles.briefCard}>
          <span className={styles.eyebrow}>Brief</span>
          <dl>
            <div>
              <dt>업종</dt>
              <dd>{industry}</dd>
            </div>
            <div>
              <dt>톤</dt>
              <dd>{tone}</dd>
            </div>
            <div>
              <dt>페이지</dt>
              <dd>{pageList.length || 0}</dd>
            </div>
            <div>
              <dt>키워드</dt>
              <dd>{keywordList.length || 0}</dd>
            </div>
          </dl>
        </div>
        <div className={styles.historyCard} data-ai-generator-history>
          <div className={styles.historyHeader}>
            <span className={styles.eyebrow}>Prompt History</span>
            <strong>{history.length} saved</strong>
          </div>
          {historyNotice ? <p className={styles.noticeText}>{historyNotice}</p> : null}
          {history.length > 0 ? (
            <div className={styles.historyList}>
              {history.map((entry) => (
                <article key={entry.id} className={styles.historyItem}>
                  <div className={styles.historyItemMeta}>
                    <strong>{entry.spec.companyName}</strong>
                    <span>{formatHistoryDate(entry.createdAt)} · {entry.spec.tone}</span>
                    <small>{entry.draft.plan.sitemap.length} pages · {entry.draft.content.hero.headline}</small>
                  </div>
                  <div className={styles.historyItemActions}>
                    <button
                      type="button"
                      className={styles.ghostButton}
                      onClick={() => restoreHistory(entry)}
                      data-ai-generator-history-restore
                    >
                      복원
                    </button>
                    <button
                      type="button"
                      className={styles.dangerButton}
                      onClick={() => removeHistoryEntry(entry.id)}
                      aria-label={`${entry.spec.companyName} 생성 기록 삭제`}
                    >
                      삭제
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className={styles.historyEmpty}>생성하면 최근 6개 프롬프트와 드래프트가 여기에 저장됩니다.</p>
          )}
        </div>
        <div className={styles.historyCard} data-ai-generator-server-versions>
          <div className={styles.historyHeader}>
            <span className={styles.eyebrow}>Server Versions</span>
            <div className={styles.serverHistoryActions}>
              <strong>{serverVersionsLoading ? 'loading' : `${serverVersions.length} saved`}</strong>
              <button
                type="button"
                className={styles.ghostButton}
                onClick={() => void refreshServerVersions({ notice: '서버 버전 ledger를 새로고침했습니다.' })}
                disabled={serverVersionsLoading}
                data-ai-generator-server-versions-refresh
              >
                새로고침
              </button>
            </div>
          </div>
          {serverVersionNotice ? <p className={styles.noticeText}>{serverVersionNotice}</p> : null}
          {serverVersionsError ? <p className={styles.errorText}>{serverVersionsError}</p> : null}
          {serverVersions.length > 0 ? (
            <div className={styles.historyList}>
              {serverVersions.map((version, index) => {
                const previous = serverVersions[index + 1];
                return (
                  <article key={version.id} className={styles.historyItem} data-ai-generator-server-version-id={version.id}>
                    <div className={styles.historyItemMeta}>
                      <strong>{version.companyName}</strong>
                      <span>{formatHistoryDate(version.createdAt)} · {version.createdBy}</span>
                      <small>{version.pageCount} pages · {version.heroHeadline}</small>
                    </div>
                    <div className={styles.serverVersionMeta}>
                      <span>{version.promptVersion}</span>
                      <span>{version.sectionCount + 1} sections</span>
                    </div>
                    <div className={styles.historyItemActions}>
                      <button
                        type="button"
                        className={styles.ghostButton}
                        onClick={() => void compareServerVersionWithPrevious(version, previous)}
                        disabled={!previous || serverVersionDiffLoadingId === version.id}
                        data-ai-generator-server-version-diff={version.id}
                      >
                        {serverVersionDiffLoadingId === version.id ? '비교 중' : '이전 비교'}
                      </button>
                      <button
                        type="button"
                        className={styles.ghostButton}
                        onClick={() => void restoreServerVersion(version)}
                        disabled={serverVersionRestoringId === version.id}
                        data-ai-generator-server-version-restore={version.id}
                      >
                        {serverVersionRestoringId === version.id ? '복원 중' : '복원'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className={styles.historyEmpty}>생성하면 서버에 최근 24개 spec·draft 버전이 보관됩니다.</p>
          )}
          {serverVersionDiff ? (
            <div className={styles.serverVersionDiff} data-ai-generator-server-version-diff-panel>
              <div className={styles.serverVersionDiffHead}>
                <span>Diff</span>
                <strong>{serverDiffChangeCount(serverVersionDiff.diff)} changes</strong>
              </div>
              {serverVersionDiff.diff.isEmpty ? (
                <p>No spec or draft summary changes.</p>
              ) : (
                <ul>
                  {[
                    ...serverVersionDiff.diff.specChanges.map((change) => ({ group: 'Spec', change })),
                    ...serverVersionDiff.diff.draftChanges.map((change) => ({ group: 'Draft', change })),
                  ].slice(0, 6).map(({ group, change }) => (
                    <li key={`${group}-${change.field}`}>
                      <b>{group} · {change.field}</b>
                      <span>{formatServerDiffValue(change.before)} -&gt; {formatServerDiffValue(change.after)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </div>
      </aside>

      <section className={styles.workspace}>
        {step === 1 ? (
          <Panel
            kicker="Industry"
            title="업종 선택"
            description="생성할 사이트의 기본 정보 구조와 섹션 조합을 결정합니다."
            footer={<StepFooter next={() => setStep(2)} />}
          >
            <div className={styles.industryGrid}>
              {INDUSTRIES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setIndustry(value)}
                  className={`${styles.choiceButton} ${industry === value ? styles.choiceButtonActive : ''}`}
                >
                  {value}
                </button>
              ))}
            </div>
          </Panel>
        ) : null}

        {step === 2 ? (
          <Panel
            kicker="Brand"
            title="브랜드 기본값"
            description="회사명, 한 줄 포지셔닝, 주요 고객군을 생성 프롬프트에 반영합니다."
            footer={<StepFooter previous={() => setStep(1)} next={() => setStep(3)} nextDisabled={!companyName.trim()} />}
          >
            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span>회사명</span>
                <input value={companyName} onChange={(event) => setCompanyName(event.target.value)} placeholder="사이트에 표시할 사무소/회사명 · 예: 호정국제법률사무소" />
              </label>
              <label className={styles.field}>
                <span>슬로건</span>
                <input value={slogan} onChange={(event) => setSlogan(event.target.value)} placeholder="선택 · 한 줄 슬로건 · 예: 대만 최초 한국어 법률사무소" />
              </label>
              <label className={`${styles.field} ${styles.fieldWide}`}>
                <span>주요 고객</span>
                <input
                  value={audience}
                  onChange={(event) => setAudience(event.target.value)}
                  placeholder="핵심 고객 · 예: 대만 진출을 준비하는 한국 기업"
                />
              </label>
            </div>
          </Panel>
        ) : null}

        {step === 3 ? (
          <Panel
            kicker="Plan"
            title="목표와 페이지"
            description="Wix처럼 페이지 트리와 초기 콘텐츠 계획을 먼저 만든 뒤 드래프트를 생성합니다."
            footer={<StepFooter previous={() => setStep(2)} next={() => setStep(4)} />}
          >
            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span>비즈니스 목표</span>
                <textarea
                  data-ai-generator-goals
                  rows={7}
                  value={goalsText}
                  onChange={(event) => setGoalsText(event.target.value)}
                />
              </label>
              <label className={styles.field}>
                <span>필요 페이지</span>
                <textarea
                  data-ai-generator-pages
                  rows={7}
                  value={pagesText}
                  onChange={(event) => setPagesText(event.target.value)}
                />
              </label>
            </div>
            <div className={styles.tokenRow}>
              {goalList.map((goal) => (
                <span key={goal}>{goal}</span>
              ))}
            </div>
          </Panel>
        ) : null}

        {step === 4 ? (
          <Panel
            kicker="Rules"
            title="브랜드 키워드와 제약"
            description="디자이너가 놓치면 안 되는 언어, 법적 고지, 모바일 우선 조건을 고정합니다."
            footer={<StepFooter previous={() => setStep(3)} next={() => setStep(5)} />}
          >
            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span>브랜드 키워드</span>
                <textarea
                  data-ai-generator-brand-keywords
                  rows={7}
                  value={brandKeywordsText}
                  onChange={(event) => setBrandKeywordsText(event.target.value)}
                />
              </label>
              <label className={styles.field}>
                <span>제약 / 필수 조건</span>
                <textarea
                  data-ai-generator-constraints
                  rows={7}
                  value={constraints}
                  onChange={(event) => setConstraints(event.target.value)}
                />
              </label>
            </div>
          </Panel>
        ) : null}

        {step === 5 ? (
          <Panel
            kicker="Design"
            title="톤과 컬러"
            description="산업 템플릿, 카피 톤, 팔레트가 함께 적용됩니다."
            footer={
              <StepFooter
                previous={() => setStep(4)}
                primaryLabel={busy ? 'AI 생성 중...' : '생성하기'}
                next={generate}
                nextDisabled={busy}
                nextDataAttr="data-ai-generator-generate"
              />
            }
          >
            <div className={styles.selectorBlock}>
              <span className={styles.selectorLabel}>톤</span>
              <div className={styles.segmented}>
                {TONES.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTone(value)}
                    className={`${styles.segmentButton} ${tone === value ? styles.segmentButtonActive : ''}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.paletteGrid}>
              {COLOR_PREFERENCES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setColorPreference(value)}
                  className={`${styles.paletteCard} ${colorPreference === value ? styles.paletteCardActive : ''}`}
                >
                  <span>{value}</span>
                  <strong>
                    {COLOR_SWATCHES[value].map((color) => (
                      <i key={color} style={{ background: color }} />
                    ))}
                  </strong>
                </button>
              ))}
            </div>
            <label className={`${styles.field} ${styles.visualDirectionBlock}`}>
              <span>이미지 / 비주얼 방향</span>
              <textarea
                data-ai-generator-visual-direction
                rows={5}
                value={visualDirection}
                onChange={(event) => setVisualDirection(event.target.value)}
                placeholder="디자인 방향 · 색상·분위기·이미지 톤 · 예: 타이베이 도시감, 차분한 법률 사무소 톤, 인물 없는 상담 장면"
              />
            </label>
            <div className={styles.promptSelectorBlock} data-ai-generator-prompt-selector>
              <div className={styles.promptSelectorHead}>
                <span>Prompt version</span>
                <p>생성 전 프롬프트 프로필을 선택해 새 draft와 캐시를 분리합니다.</p>
              </div>
              <div className={styles.promptSelectorList}>
                {AI_GENERATOR_PROMPT_CHANGELOG.map((entry) => {
                  const selected = selectedPromptVersion === entry.version;
                  return (
                    <button
                      key={entry.version}
                      type="button"
                      className={selected ? styles.promptSelectorOptionActive : styles.promptSelectorOption}
                      onClick={() => {
                        setSelectedPromptVersion(entry.version);
                        setGeneratedDraftComparison(null);
                      }}
                      data-ai-generator-prompt-option={entry.version}
                      data-ai-generator-prompt-selected={selected ? 'true' : 'false'}
                    >
                      <strong>{entry.label}</strong>
                      <small>{entry.version}</small>
                      <p>{entry.summary}</p>
                    </button>
                  );
                })}
              </div>
              <div
                className={styles.promptComparisonPanel}
                data-ai-generator-prompt-comparison
                data-ai-generator-prompt-comparison-mode={promptVersionComparison.isCurrent ? 'current' : 'rollback'}
                data-ai-generator-prompt-current={promptVersionComparison.current.version}
                data-ai-generator-prompt-selected={promptVersionComparison.selected.version}
              >
                <div className={styles.promptComparisonHead}>
                  <span>Version comparison</span>
                  <strong>
                    {promptVersionComparison.isCurrent ? 'Current profile' : 'Rollback profile selected'}
                  </strong>
                </div>
                <div className={styles.promptComparisonProfiles}>
                  <article>
                    <span>Selected</span>
                    <strong>{promptVersionComparison.selected.label}</strong>
                    <small>{promptVersionComparison.selected.version}</small>
                  </article>
                  <article>
                    <span>Current</span>
                    <strong>{promptVersionComparison.current.label}</strong>
                    <small>{promptVersionComparison.current.version}</small>
                  </article>
                </div>
                <div className={styles.promptDiffGrid}>
                  <div data-ai-generator-prompt-diff-selected>
                    <span>Selected-only</span>
                    {promptVersionComparison.selectedOnly.length > 0 ? (
                      <ul>
                        {promptVersionComparison.selectedOnly.map((change) => <li key={change}>{change}</li>)}
                      </ul>
                    ) : (
                      <p>{promptVersionComparison.isCurrent ? '현재 기본 버전과 동일합니다.' : 'Rollback baseline has no extra current-only behavior.'}</p>
                    )}
                  </div>
                  <div data-ai-generator-prompt-diff-current>
                    <span>Current-only</span>
                    {promptVersionComparison.currentOnly.length > 0 ? (
                      <ul>
                        {promptVersionComparison.currentOnly.map((change) => <li key={change}>{change}</li>)}
                      </ul>
                    ) : (
                      <p>{promptVersionComparison.isCurrent ? '선택 버전과 차이가 없습니다.' : 'No newer current changes detected.'}</p>
                    )}
                  </div>
                </div>
                <div className={styles.promptComparisonActions}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={comparePromptDrafts}
                    disabled={comparingDrafts || promptVersionComparison.isCurrent}
                    data-ai-generator-compare-drafts
                  >
                    {comparingDrafts ? '두 draft 비교 중...' : '두 버전 draft 비교'}
                  </button>
                  <p>
                    {promptVersionComparison.isCurrent
                      ? 'Rollback 버전을 선택하면 실제 draft 두 개를 생성해 비교합니다.'
                      : '선택 버전과 현재 버전을 같은 입력값으로 생성해 콘텐츠와 디자인 차이를 확인합니다.'}
                  </p>
                </div>
              </div>
              {generatedDraftComparison ? (
                <div
                  className={styles.generatedDraftComparisonPanel}
                  data-ai-generator-draft-comparison
                  data-ai-generator-draft-comparison-selected={generatedDraftComparison.selected.promptVersion ?? ''}
                  data-ai-generator-draft-comparison-current={generatedDraftComparison.current.promptVersion ?? ''}
                >
                  <div className={styles.generatedDraftComparisonHead}>
                    <span>Generated A/B draft comparison</span>
                    <strong>{formatHistoryDate(generatedDraftComparison.comparedAt)}</strong>
                  </div>
                  <div className={styles.generatedDraftComparisonGrid}>
                    <article data-ai-generator-draft-comparison-selected-card>
                      <span>Selected draft</span>
                      <strong>{generatedDraftComparison.selected.content.hero.headline}</strong>
                      <p>{generatedDraftComparison.selected.content.hero.body}</p>
                      <div
                        className={styles.generatedDraftVisualPreview}
                        style={{ background: generatedDraftComparison.selected.palette.background }}
                        data-ai-generator-draft-visual-selected
                      >
                        <div className={styles.generatedDraftVisualBrowser}>
                          <span style={{ color: generatedDraftComparison.selected.palette.accent }}>
                            {generatedDraftComparison.selected.spec.industry}
                          </span>
                          <strong style={{ color: generatedDraftComparison.selected.palette.primary }}>
                            {generatedDraftComparison.selected.content.hero.headline}
                          </strong>
                          <p>{generatedDraftComparison.selected.content.hero.body}</p>
                          <div className={styles.generatedDraftVisualSections}>
                            {generatedDraftComparison.selected.content.sections.slice(0, 2).map((section) => (
                              <i
                                key={section.sectionId}
                                style={{ borderColor: generatedDraftComparison.selected.palette.secondary }}
                              >
                                {section.headline}
                              </i>
                            ))}
                          </div>
                        </div>
                      </div>
                      <dl>
                        <div>
                          <dt>Version</dt>
                          <dd>{generatedDraftComparison.selected.promptVersion}</dd>
                        </div>
                        <div>
                          <dt>Pages</dt>
                          <dd>{generatedDraftComparison.selected.plan.sitemap.length}</dd>
                        </div>
                        <div>
                          <dt>Sections</dt>
                          <dd>{draftSectionCount(generatedDraftComparison.selected)}</dd>
                        </div>
                      </dl>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={() => applyComparedDraft(generatedDraftComparison.selected)}
                        data-ai-generator-use-selected-comparison-draft
                      >
                        선택 버전 사용
                      </button>
                    </article>
                    <article data-ai-generator-draft-comparison-current-card>
                      <span>Current draft</span>
                      <strong>{generatedDraftComparison.current.content.hero.headline}</strong>
                      <p>{generatedDraftComparison.current.content.hero.body}</p>
                      <div
                        className={styles.generatedDraftVisualPreview}
                        style={{ background: generatedDraftComparison.current.palette.background }}
                        data-ai-generator-draft-visual-current
                      >
                        <div className={styles.generatedDraftVisualBrowser}>
                          <span style={{ color: generatedDraftComparison.current.palette.accent }}>
                            {generatedDraftComparison.current.spec.industry}
                          </span>
                          <strong style={{ color: generatedDraftComparison.current.palette.primary }}>
                            {generatedDraftComparison.current.content.hero.headline}
                          </strong>
                          <p>{generatedDraftComparison.current.content.hero.body}</p>
                          <div className={styles.generatedDraftVisualSections}>
                            {generatedDraftComparison.current.content.sections.slice(0, 2).map((section) => (
                              <i
                                key={section.sectionId}
                                style={{ borderColor: generatedDraftComparison.current.palette.secondary }}
                              >
                                {section.headline}
                              </i>
                            ))}
                          </div>
                        </div>
                      </div>
                      <dl>
                        <div>
                          <dt>Version</dt>
                          <dd>{generatedDraftComparison.current.promptVersion}</dd>
                        </div>
                        <div>
                          <dt>Pages</dt>
                          <dd>{generatedDraftComparison.current.plan.sitemap.length}</dd>
                        </div>
                        <div>
                          <dt>Sections</dt>
                          <dd>{draftSectionCount(generatedDraftComparison.current)}</dd>
                        </div>
                      </dl>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={() => applyComparedDraft(generatedDraftComparison.current)}
                        data-ai-generator-use-current-comparison-draft
                      >
                        현재 버전 사용
                      </button>
                    </article>
                  </div>
                  {generatedPageVisualDiff ? (
                    <div
                      className={styles.generatedPageVisualDiff}
                      data-ai-generator-page-visual-diff
                      data-ai-generator-page-visual-diff-palette={generatedPageVisualDiff.paletteTokens}
                      data-ai-generator-page-visual-diff-sections={generatedPageVisualDiff.sectionOrder}
                      data-ai-generator-page-visual-diff-copy={generatedPageVisualDiff.copyLength}
                      data-ai-generator-page-visual-diff-guidance={generatedPageVisualDiff.visualGuidance}
                    >
                      <div className={styles.generatedPageVisualDiffHead}>
                        <span>Full-page visual diff</span>
                        <strong>전체 페이지 흐름 기준 preview map</strong>
                      </div>
                      <div className={styles.generatedPageVisualDiffStats}>
                        <span>Palette tokens <strong>{generatedPageVisualDiff.paletteTokens}</strong></span>
                        <span>Section order <strong>{generatedPageVisualDiff.sectionOrder}</strong></span>
                        <span>Copy delta <strong>{generatedPageVisualDiff.copyLength}</strong></span>
                        <span>Visual guidance <strong>{generatedPageVisualDiff.visualGuidance}</strong></span>
                      </div>
                      <div className={styles.generatedPageVisualDiffGrid}>
                        {renderDraftPageStrip(generatedDraftComparison.selected, 'Selected page', 'selected')}
                        {renderDraftPageStrip(generatedDraftComparison.current, 'Current page', 'current')}
                      </div>
                    </div>
                  ) : null}
                  <div className={styles.generatedDraftDelta} data-ai-generator-draft-comparison-delta>
                    <span>Generated delta</span>
                    <ul>
                      {generatedDraftDelta(generatedDraftComparison.selected, generatedDraftComparison.current).map((change) => (
                        <li key={change}>{change}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
            <div className={styles.assetPickerBlock} data-ai-generator-asset-picker>
              <div className={styles.assetPickerHead}>
                <div>
                  <span>Hero 이미지 에셋</span>
                  <p>이미 업로드한 이미지를 선택하면 AI 드래프트의 히어로 이미지로 바로 적용됩니다.</p>
                </div>
                {selectedHeroAsset ? (
                  <button
                    type="button"
                    className={styles.ghostButton}
                    onClick={() => setSelectedHeroAsset(null)}
                    data-ai-generator-clear-hero-asset
                  >
                    선택 해제
                  </button>
                ) : null}
              </div>
              {assetLoading ? <p className={styles.assetEmpty}>이미지 에셋을 불러오는 중입니다.</p> : null}
              {!assetLoading && assetLibrary.length > 0 ? (
                <div className={styles.assetGrid}>
                  <button
                    type="button"
                    className={`${styles.assetCard} ${!selectedHeroAsset ? styles.assetCardActive : ''}`}
                    onClick={() => setSelectedHeroAsset(null)}
                    data-ai-generator-use-auto-image
                    data-ai-generator-asset-selected={!selectedHeroAsset ? 'true' : 'false'}
                  >
                    <i className={styles.assetAutoThumb}>AI</i>
                    <span>
                      <strong data-ai-generator-asset-name>Image 2.0 방향 사용</strong>
                      <small>{!selectedHeroAsset ? '선택됨' : '자동 이미지'}</small>
                    </span>
                  </button>
                  {assetLibrary.map((asset) => {
                    const selected = selectedHeroAsset?.url === asset.url;
                    const assetId = builderAssetIdForSelection(asset);
                    return (
                      <button
                        key={asset.url}
                        type="button"
                        className={`${styles.assetCard} ${selected ? styles.assetCardActive : ''}`}
                        onClick={() => setSelectedHeroAsset(asset)}
                        data-ai-generator-asset-card
                        data-ai-generator-asset-id={assetId}
                        data-ai-generator-asset-option={asset.filename}
                        data-ai-generator-asset-selected={selected ? 'true' : 'false'}
                      >
                        <img src={asset.url} alt="" data-ai-generator-asset-thumbnail />
                        <span>
                          <strong data-ai-generator-asset-name>{asset.filename}</strong>
                          <small>{selected ? '선택됨' : asset.contentType ?? 'image'}</small>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
              {!assetLoading && assetLibrary.length === 0 ? (
                <p className={styles.assetEmpty} data-ai-generator-asset-empty>
                  업로드된 이미지가 없습니다. 기본 히어로 이미지를 사용합니다.
                </p>
              ) : null}
              {assetError ? <p className={styles.assetError}>{assetError}</p> : null}
            </div>
            {error ? <p className={styles.errorText}>{error}</p> : null}
          </Panel>
        ) : null}

        {step === 6 && draft ? (
          <div className={styles.resultGrid}>
            <section className={styles.previewPanel}>
              <div className={styles.panelHead}>
                <span className={styles.eyebrow}>Draft</span>
                <h2>{draft.content.hero.headline}</h2>
                <p>{draft.content.hero.body}</p>
              </div>
              <div className={styles.swatchRow}>
                {(['primary', 'secondary', 'accent', 'background'] as const).map((key) => (
                  <span key={key}>
                    <i style={{ background: draft.palette[key] }} />
                    {draft.palette[key]}
                  </span>
                ))}
              </div>
              {activeVisualBrief ? (
                <div className={styles.visualBriefCard} data-ai-generator-visual-brief>
                  <span className={styles.eyebrow}>Visual Brief</span>
                  <strong data-ai-generator-design-treatment>{activeVisualBrief.treatment}</strong>
                  <p data-ai-generator-image-prompt>{activeVisualBrief.imagePrompt}</p>
                  <small data-ai-generator-prompt-version>
                    Prompt version: {activePromptVersion} · {activeBlueprintVersion}
                  </small>
                  {activePromptChange ? (
                    <div className={styles.promptVersionCard} data-ai-generator-prompt-changelog>
                      <strong>{activePromptChange.label}</strong>
                      <p>{activePromptChange.summary}</p>
                      <div>
                        {activePromptChange.changes.slice(0, 3).map((change) => (
                          <span key={change}>{change}</span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {draft.spec.heroImageAsset ? (
                    <small data-ai-generator-selected-hero-asset>
                      Hero asset: {draft.spec.heroImageAsset.filename}
                    </small>
                  ) : null}
                  <div className={styles.visualBriefActions}>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      disabled={imageGenerating}
                      onClick={() => { void generateHeroImageForDraft(); }}
                      data-ai-generator-generate-hero-image
                    >
                      {imageGenerating ? 'Image 2.0 생성 중...' : 'Image 2.0 hero 생성'}
                    </button>
                    <span>1536x1024 · medium · WebP asset</span>
                  </div>
                  <div
                    className={styles.responsiveFixCard}
                    data-ai-generator-responsive-fix
                    data-ai-generator-responsive-fix-state={responsiveFixSnapshot ? 'applied' : 'ready'}
                    data-ai-generator-responsive-fix-breakpoints="mobile,tablet"
                    data-ai-generator-responsive-fix-mode="copy_cta_tablet_balance"
                  >
                    <div>
                      <strong>Responsive AI fix</strong>
                      <p>모바일 긴 문장·CTA 간격과 태블릿 2열 균형을 함께 보정합니다.</p>
                    </div>
                    <div className={styles.responsiveFixActions}>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={applyResponsiveDraftFix}
                        data-ai-generator-apply-responsive-fix
                      >
                        반응형 보정 적용
                      </button>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={undoResponsiveDraftFix}
                        disabled={!responsiveFixSnapshot}
                        data-ai-generator-undo-responsive-fix
                      >
                        되돌리기
                      </button>
                    </div>
                    {responsiveFixNotice ? (
                      <small data-ai-generator-responsive-fix-status>{responsiveFixNotice}</small>
                    ) : null}
                  </div>
                  <div
                    className={styles.designerSuggestionCard}
                    data-ai-generator-designer-suggestions
                    data-ai-generator-designer-suggestion-active={appliedDesignerSuggestionId || 'none'}
                    data-ai-generator-designer-suggestion-top={designerSuggestions[0]?.id ?? 'none'}
                    data-ai-generator-designer-suggestion-top-score={designerSuggestions[0]?.score ?? 0}
                    data-ai-generator-designer-suggestion-top-layout-fit={designerSuggestions[0]?.layoutFit ?? 0}
                    data-ai-generator-designer-suggestion-top-palette-fit={designerSuggestions[0]?.paletteFit ?? 0}
                  >
                    <div>
                      <strong>Designer polish</strong>
                      <p>Wix Builder처럼 바로 적용 가능한 전문가형 컬러·레이아웃 시스템을 제안합니다.</p>
                    </div>
                    <div className={styles.designerSuggestionGrid}>
                      {designerSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          type="button"
                          className={
                            appliedDesignerSuggestionId === suggestion.id
                              ? styles.designerSuggestionButtonActive
                              : styles.designerSuggestionButton
                          }
                          onClick={() => applyDesignerStyleSuggestion(suggestion)}
                          data-ai-generator-designer-suggestion={suggestion.id}
                          data-ai-generator-designer-suggestion-rank={suggestion.rank}
                          data-ai-generator-designer-suggestion-score={suggestion.score}
                          data-ai-generator-designer-suggestion-layout-fit={suggestion.layoutFit}
                          data-ai-generator-designer-suggestion-palette-fit={suggestion.paletteFit}
                          data-ai-generator-designer-suggestion-design-pool-profile={suggestion.designPoolProfile}
                          data-ai-generator-designer-suggestion-design-pool-fit={suggestion.designPoolFit}
                          data-ai-generator-designer-suggestion-selected={
                            appliedDesignerSuggestionId === suggestion.id ? 'true' : 'false'
                          }
                        >
                          <span className={styles.designerSuggestionSwatches} aria-hidden="true">
                            <i style={{ background: suggestion.palette.primary }} />
                            <i style={{ background: suggestion.palette.secondary }} />
                            <i style={{ background: suggestion.palette.accent }} />
                            <i style={{ background: suggestion.palette.background }} />
                          </span>
                          <span className={styles.designerSuggestionScore}>
                            <em>#{suggestion.rank}</em>
                            <em>{suggestion.score}% match</em>
                          </span>
                          <span
                            className={styles.designerSuggestionFitPreview}
                            data-ai-generator-designer-suggestion-fit-preview={suggestion.id}
                          >
                            <i style={{ '--fit': `${suggestion.layoutFit}%` } as CSSProperties} />
                            <i style={{ '--fit': `${suggestion.paletteFit}%` } as CSSProperties} />
                            <em>Layout {suggestion.layoutFit}</em>
                            <em>Palette {suggestion.paletteFit}</em>
                          </span>
                          <strong>{suggestion.label}</strong>
                          <small>{suggestion.description}</small>
                          <small>{suggestion.fitPreview}</small>
                          <span
                            className={styles.designerDesignPoolMatch}
                            data-ai-generator-designer-design-pool-match={suggestion.id}
                            data-ai-generator-designer-design-pool-profile={suggestion.designPoolProfile}
                            data-ai-generator-designer-design-pool-fit={suggestion.designPoolFit}
                          >
                            <strong>{suggestion.designPoolFit}% design-pool</strong>
                            <small>{suggestion.designPoolProfile}</small>
                            {suggestion.designPoolSignals.map((signal) => (
                              <i key={signal}>{signal}</i>
                            ))}
                          </span>
                          <span className={styles.designerSuggestionReasons}>
                            {suggestion.scoreReasons.map((reason) => (
                              <i key={reason}>{reason}</i>
                            ))}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div
                      className={styles.designerScoreExport}
                      data-ai-generator-designer-score-export
                      data-ai-generator-designer-score-export-count={designerSuggestions.length}
                      data-ai-generator-designer-score-export-top={designerSuggestions[0]?.id ?? 'none'}
                      data-ai-generator-designer-score-export-payload={designerScoreExportPayload}
                    >
                      <div>
                        <span>Scoring payload</span>
                        <strong>
                          {designerSuggestions[0]
                            ? `${designerSuggestions[0].label} · ${designerSuggestions[0].score}%`
                            : 'No suggestions'}
                        </strong>
                      </div>
                      <div className={styles.designerScoreExportRows}>
                        {designerSuggestions.map((suggestion) => (
                          <span
                            key={suggestion.id}
                            data-ai-generator-designer-score-export-row={suggestion.id}
                            data-ai-generator-designer-score-export-row-rank={suggestion.rank}
                            data-ai-generator-designer-score-export-row-score={suggestion.score}
                            data-ai-generator-designer-score-export-row-layout-fit={suggestion.layoutFit}
                            data-ai-generator-designer-score-export-row-palette-fit={suggestion.paletteFit}
                          >
                            <strong>{suggestion.rank}. {suggestion.label}</strong>
                            <small>{suggestion.score}% · L{suggestion.layoutFit} · P{suggestion.paletteFit}</small>
                          </span>
                        ))}
                      </div>
                      <div
                        className={styles.designerServerScore}
                        data-ai-generator-designer-server-score
                        data-ai-generator-designer-server-score-status={designerServerScoreStatus}
                        data-ai-generator-designer-server-score-top={designerServerScoreTop}
                        data-ai-generator-designer-server-score-count={designerServerScoreCount}
                        data-ai-generator-designer-server-score-payload={designerServerScorePayload}
                        data-ai-generator-designer-server-score-match={
                          designerServerScorePayload === designerScoreExportPayload ? 'true' : 'false'
                        }
                      >
                        <span>Server score check</span>
                        <strong>{designerServerScoreNotice || 'Waiting for server score'}</strong>
                        <small>{designerServerScorePayload || designerScoreExportPayload}</small>
                      </div>
                    </div>
                    <div className={styles.designerSuggestionActions}>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={undoDesignerStyleSuggestion}
                        disabled={!designerSuggestionSnapshot}
                        data-ai-generator-undo-designer-suggestion
                      >
                        디자인 되돌리기
                      </button>
                      {designerSuggestionNotice ? (
                        <small data-ai-generator-designer-suggestion-status>{designerSuggestionNotice}</small>
                      ) : null}
                    </div>
                  </div>
                  {imageGenerationNotice ? (
                    <small data-ai-generator-image-generation-status>{imageGenerationNotice}</small>
                  ) : null}
                </div>
              ) : null}
              <div className={styles.draftPreviewControls} data-ai-generator-draft-preview-controls>
                <span>Preview frame</span>
                <div aria-label="AI generated draft preview frame">
                  {(['desktop', 'mobile'] as DraftPreviewFrame[]).map((frame) => (
                    <button
                      key={frame}
                      type="button"
                      className={draftPreviewFrame === frame ? styles.previewFrameButtonActive : styles.previewFrameButton}
                      data-ai-generator-draft-preview-mode-button={frame}
                      onClick={() => setDraftPreviewFrame(frame)}
                    >
                      {frame === 'desktop' ? 'Desktop' : 'Mobile'}
                    </button>
                  ))}
                </div>
              </div>
              <div
                className={`${styles.canvasPreview} ${draftPreviewFrame === 'mobile' ? styles.canvasPreviewMobile : ''}`}
                style={{ background: draft.palette.background }}
                data-ai-generator-draft-preview-mode={draftPreviewFrame}
              >
                <div className={styles.previewBrowser}>
                  <div className={styles.previewHero}>
                    <span style={{ color: draft.palette.accent }}>{draft.spec.industry}</span>
                    <h3 style={{ color: draft.palette.primary }}>{draft.content.hero.headline}</h3>
                    <p>{draft.content.hero.body}</p>
                    {draft.content.hero.ctaLabel ? (
                      <button type="button" style={{ background: draft.palette.accent }}>
                        {draft.content.hero.ctaLabel}
                      </button>
                    ) : null}
                  </div>
                  <div className={styles.previewSections}>
                    {draft.content.sections.slice(0, 4).map((section) => (
                      <article key={section.sectionId}>
                        <strong style={{ color: draft.palette.secondary }}>{section.headline}</strong>
                        <p>{section.body}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.applyPanel} data-ai-generator-apply-panel>
                <div className={styles.scopeGroup} data-ai-generator-page-scope>
                  <label className={applyScope === 'single' ? styles.scopeOptionActive : styles.scopeOption}>
                    <input
                      type="radio"
                      name="ai-generator-apply-scope"
                      value="single"
	                      checked={applyScope === 'single'}
	                      onChange={() => {
	                        setApplyScope('single');
	                        setNavigationAddedSlugs([]);
	                        setError('');
	                      }}
                      data-ai-generator-page-option="single"
                    />
                    <span>
                      <strong>Home draft만 생성</strong>
                      <small>slug 하나로 편집 가능한 단일 draft page를 생성</small>
                    </span>
                  </label>
                  <label className={applyScope === 'sitemap' ? styles.scopeOptionActive : styles.scopeOption}>
                    <input
                      type="radio"
                      name="ai-generator-apply-scope"
                      value="sitemap"
	                      checked={applyScope === 'sitemap'}
	                      onChange={() => {
	                        setApplyScope('sitemap');
	                        setNavigationAddedSlugs([]);
	                        setError('');
	                      }}
                      data-ai-generator-page-option="sitemap"
                    />
                    <span>
                      <strong>전체 sitemap draft 생성</strong>
                      <small>{selectedSitemapCount}/{sitemapDraftCount}개 보조 페이지 선택 · 기존 slug는 건너뜀</small>
                    </span>
                  </label>
                </div>
                <label className={styles.slugField}>
                  <span>Draft page slug</span>
                  <input
                    data-ai-generator-slug
                    value={draftSlug}
                    disabled={applyScope === 'sitemap'}
                    onChange={(event) => {
                      setDraftSlug(event.target.value);
                      setError('');
                    }}
                    placeholder="영문 소문자·숫자·하이픈 · 예: ai-site-draft (admin, api 등 예약어 불가)"
                    autoCapitalize="none"
                    spellCheck={false}
                  />
                </label>
                <p className={activeDraftSlugError ? styles.slugHintError : styles.slugHint}>
                  {activeDraftSlugError || (applyScope === 'sitemap'
                    ? '선택한 sitemap slug만 draft pages로 생성합니다. 공개 반영은 각 페이지 publish 후 진행됩니다.'
                    : `생성 위치: /${locale}/admin-builder?pageId=(new) · 공개 반영은 별도 publish 후 진행`)}
                </p>
	                {applyScope === 'sitemap' && draft ? (
	                  <div className={styles.sitemapSelectPanel} data-ai-generator-sitemap-select-panel>
                    <div>
                      <span>Pages to create</span>
                      <strong data-ai-generator-selected-count>{selectedSitemapCount}/{sitemapDraftCount}</strong>
                    </div>
                    <div className={styles.sitemapSelectActions}>
                      <button
                        type="button"
                        className={styles.ghostButton}
                        onClick={() => {
                          setSelectedSitemapPageSlugs(selectableSitemapSlugs(draft));
                          setError('');
                        }}
                        data-ai-generator-select-all-pages
                      >
                        전체 선택
                      </button>
                      <button
                        type="button"
                        className={styles.ghostButton}
                        onClick={() => {
                          setSelectedSitemapPageSlugs([]);
                          setError('');
                        }}
                        data-ai-generator-clear-selected-pages
                      >
                        선택 해제
                      </button>
                    </div>
                    {applyReviewPages.length > 0 ? (
                      <div
                        className={styles.sitemapTreeOrder}
                        data-ai-generator-sitemap-tree-order
                        data-ai-generator-sitemap-tree-order-count={applyReviewPages.length}
                      >
                        <span>Page tree order</span>
                        {applyReviewPages.map((page, index) => (
                          <div
                            key={page.slug}
                            data-ai-generator-sitemap-order-row={page.slug}
                            data-ai-generator-sitemap-order-index={index}
                          >
                            <strong>{index + 1}. {page.title}</strong>
                            <small>{displayPlanPath(page.slug)}</small>
                            <button
                              type="button"
                              className={styles.ghostButton}
                              onClick={() => moveSelectedSitemapSlug(page.slug, -1)}
                              disabled={index === 0 || applying}
                              data-ai-generator-sitemap-order-up={page.slug}
                            >
                              Up
                            </button>
                            <button
                              type="button"
                              className={styles.ghostButton}
                              onClick={() => moveSelectedSitemapSlug(page.slug, 1)}
                              disabled={index === applyReviewPages.length - 1 || applying}
                              data-ai-generator-sitemap-order-down={page.slug}
                            >
                              Down
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <div
                      className={styles.sitemapTreeDiff}
                      data-ai-generator-sitemap-tree-diff
                      data-ai-generator-sitemap-tree-new-count={sitemapTreeDiffStats.newPages}
                      data-ai-generator-sitemap-tree-existing-count={sitemapTreeDiffStats.existingPages}
                      data-ai-generator-sitemap-tree-navigation-count={sitemapTreeDiffStats.navigationAdds}
                      data-ai-generator-sitemap-tree-selected-count={sitemapTreeDiffStats.selectedPages}
                      data-ai-generator-sitemap-tree-hierarchy-count={sitemapTreeDiffStats.nestedPages}
                    >
                      <div className={styles.sitemapTreeDiffHead}>
                        <span>Page tree diff</span>
                        <strong>{sitePagesLoading ? 'Loading current tree' : `${sitemapTreeDiffStats.newPages} new · ${sitemapTreeDiffStats.existingPages} existing`}</strong>
                      </div>
                      <div className={styles.sitemapTreeDiffStats}>
                        <span>
                          <strong>{sitemapTreeDiffStats.selectedPages}</strong>
                          Selected
                        </span>
                        <span>
                          <strong>{sitemapTreeDiffStats.navigationAdds}</strong>
                          Nav adds
                        </span>
                        <span>
                          <strong>{sitePages.length}</strong>
                          Current pages
                        </span>
                        <span>
                          <strong>{sitemapTreeDiffStats.nestedPages}</strong>
                          Nested intents
                        </span>
                      </div>
                      {sitePagesError ? (
                        <p className={styles.treeDiffError}>{sitePagesError}</p>
                      ) : null}
                      <div className={styles.sitemapTreeDiffRows}>
                        {sitemapTreeDiffRows.map((row) => (
                          <div
                            key={row.slug}
                            data-ai-generator-sitemap-tree-diff-row={row.slug}
                            data-ai-generator-sitemap-tree-diff-state={row.state}
                            data-ai-generator-sitemap-tree-depth={row.depth}
                            data-ai-generator-sitemap-tree-parent={row.parentLabel}
                            data-ai-generator-sitemap-tree-hierarchy={row.hierarchyPath}
                            data-ai-generator-sitemap-current-index={row.currentIndex}
                            data-ai-generator-sitemap-target-index={row.targetIndex}
                          >
                            <span>{row.generatedIndex + 1}</span>
                            <strong>{row.depth > 0 ? row.hierarchyPath : row.title}</strong>
                            <small>{row.path}</small>
                            {row.depth > 0 ? <small>Parent: {row.parentLabel}</small> : null}
                            <em>{formatSitemapTreeDiffState(row.state)}</em>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div
                      className={styles.sitemapNavigationDiff}
                      data-ai-generator-sitemap-navigation-diff
                      data-ai-generator-sitemap-navigation-diff-current-count={sitemapNavigationDiffStats.current}
                      data-ai-generator-sitemap-navigation-diff-append-count={sitemapNavigationDiffStats.appending}
                      data-ai-generator-sitemap-navigation-diff-public-count={sitemapNavigationDiffStats.publicAfterPublish}
                      data-ai-generator-sitemap-navigation-diff-hidden-count={sitemapNavigationDiffStats.hiddenUntilPublish}
                    >
                      <div className={styles.sitemapTreeDiffHead}>
                        <span>Navigation tree diff</span>
                        <strong>{siteNavigationLoading ? 'Loading Navigation' : `${sitemapNavigationDiffStats.appending} append · ${sitemapNavigationDiffStats.hiddenUntilPublish} hidden`}</strong>
                      </div>
                      <div className={styles.sitemapTreeDiffStats}>
                        <span>
                          <strong>{sitemapNavigationDiffStats.current}</strong>
                          Current nav
                        </span>
                        <span>
                          <strong>{sitemapNavigationDiffStats.appending}</strong>
                          Append
                        </span>
                        <span>
                          <strong>{sitemapNavigationDiffStats.publicAfterPublish}</strong>
                          Public
                        </span>
                      </div>
                      {siteNavigationError ? (
                        <p className={styles.treeDiffError}>{siteNavigationError}</p>
                      ) : null}
                      <div className={styles.sitemapNavigationDiffRows}>
                        {sitemapNavigationDiffRows.map((row) => (
                          <div
                            key={row.slug}
                            data-ai-generator-sitemap-navigation-diff-row={row.slug}
                            data-ai-generator-sitemap-navigation-diff-state={row.state}
                            data-ai-generator-sitemap-navigation-diff-depth={row.depth}
                            data-ai-generator-sitemap-navigation-diff-index={row.indexPath}
                          >
                            <span>{row.indexPath}</span>
                            <strong>{row.title}</strong>
                            <small>{row.path}</small>
                            <em>{formatNavigationDiffState(row.state)}</em>
                          </div>
                        ))}
                      </div>
                    </div>
	                  </div>
	                ) : null}
	                {applyScope === 'sitemap' ? (
	                  <label
	                    className={includeNavigation ? styles.navigationOptionActive : styles.navigationOption}
	                    data-ai-generator-include-navigation
	                    data-ai-generator-navigation-status={includeNavigation ? 'enabled' : 'disabled'}
	                  >
	                    <input
	                      type="checkbox"
	                      checked={includeNavigation}
	                      onChange={(event) => {
	                        setIncludeNavigation(event.target.checked);
	                        setNavigationAddedSlugs([]);
	                        setError('');
	                      }}
	                      data-ai-generator-include-navigation-toggle
	                    />
	                    <span>
	                      <strong>Navigation에 추가</strong>
	                      <small data-ai-generator-navigation-helper>
	                        {includeNavigation
	                          ? '선택한 draft pages를 메뉴 끝에 추가합니다. 미공개 page는 공개 header에서 숨깁니다.'
	                          : '페이지 draft만 만들고 메뉴 구조는 건드리지 않습니다.'}
	                      </small>
	                    </span>
	                    <em>{includeNavigation ? 'Nav on' : 'Draft only'}</em>
	                  </label>
	                ) : null}
                <div
                  className={styles.applyReviewCard}
                  data-ai-generator-apply-review
                  data-ai-generator-apply-review-scope={applyScope}
                  data-ai-generator-apply-review-page-count={applyReviewPages.length}
                  data-ai-generator-apply-review-section-count={applyReviewSectionCount}
                  data-ai-generator-apply-review-navigation={applyScope === 'sitemap' && includeNavigation ? 'enabled' : 'disabled'}
                >
                  <div className={styles.applyReviewHeader}>
                    <span>Apply review</span>
                    <strong>
                      {applyScope === 'sitemap'
                        ? `${applyReviewPages.length} draft pages`
                        : `${displayPlanPath(draftSlug)} draft`}
                    </strong>
                  </div>
                  <div className={styles.applyReviewStats}>
                    <span>
                      <strong>{applyReviewPages.length}</strong>
                      Pages
                    </span>
                    <span>
                      <strong>{applyReviewSectionCount}</strong>
                      Sections
                    </span>
                    <span>
                      <strong>{applyScope === 'sitemap' && includeNavigation ? 'On' : 'Off'}</strong>
                      Navigation
                    </span>
                  </div>
                  {applyReviewPages.length > 0 ? (
                    <div className={styles.applyReviewPageList}>
                      {applyReviewPages.slice(0, 4).map((page) => (
                        <span
                          key={page.slug}
                          data-ai-generator-apply-review-page
                          data-ai-generator-apply-review-page-slug={page.slug}
                        >
                          <strong>{page.title}</strong>
                          <small>{displayPlanPath(page.slug)} · {page.sections.slice(0, 4).join(' / ')}</small>
                        </span>
                      ))}
                      {applyReviewPages.length > 4 ? (
                        <em>+{applyReviewPages.length - 4} more</em>
                      ) : null}
                    </div>
                  ) : (
                    <p>선택된 생성 대상이 없습니다.</p>
                  )}
                  <div
                    className={styles.applySectionDiff}
                    data-ai-generator-apply-section-diff
                    data-ai-generator-apply-section-diff-mode="create_draft"
                    data-ai-generator-apply-section-diff-scope={applyScope}
                    data-ai-generator-apply-section-diff-page-count={applyReviewPages.length}
                    data-ai-generator-apply-section-diff-section-count={applySectionDiffStats.sectionCount}
                    data-ai-generator-apply-section-diff-unique-count={applySectionDiffStats.uniqueSectionCount}
                  >
                    <div className={styles.applySectionDiffHead}>
                      <span>Section transaction diff</span>
                      <strong>{applySectionDiffStats.sectionCount} inserts · {applySectionDiffStats.uniqueSectionCount} unique</strong>
                    </div>
                    <div className={styles.applySectionDiffRows}>
                      {applySectionDiffRows.slice(0, 8).map((row) => (
                        <span
                          key={`${row.pageSlug}-${row.sectionId}-${row.sectionIndex}`}
                          data-ai-generator-apply-section-diff-row={`${row.pageSlug}:${row.sectionId}:${row.sectionIndex}`}
                          data-ai-generator-apply-section-diff-page={row.pageSlug}
                          data-ai-generator-apply-section-diff-page-index={row.pageIndex}
                          data-ai-generator-apply-section-diff-section={row.sectionId}
                          data-ai-generator-apply-section-diff-section-index={row.sectionIndex}
                          data-ai-generator-apply-section-diff-state={row.state}
                        >
                          <strong>{row.sectionTitle}</strong>
                          <small>{displayPlanPath(row.pageSlug)} · {row.sectionId}</small>
                          <em>Will insert</em>
                        </span>
                      ))}
                      {applySectionDiffRows.length > 8 ? (
                        <em>+{applySectionDiffRows.length - 8} more inserts</em>
                      ) : null}
                    </div>
                  </div>
                  <div
                    className={styles.applyVisualDiff}
                    data-ai-generator-apply-visual-diff
                    data-ai-generator-apply-visual-diff-mode="before_after"
                    data-ai-generator-apply-visual-diff-before="new_draft"
                    data-ai-generator-apply-visual-diff-after="generated_draft"
                    data-ai-generator-apply-visual-diff-page-count={applyVisualDiffRows.length}
                    data-ai-generator-apply-visual-diff-after-section-count={applyVisualDiffSectionCount}
                  >
                    <div className={styles.applyVisualDiffHead}>
                      <span>Visual before/after</span>
                      <strong>{applyVisualDiffRows.length} pages · {applyVisualDiffSectionCount} sections</strong>
                    </div>
                    <div className={styles.applyVisualDiffFrames}>
                      <span>
                        <strong>Before</strong>
                        <small>New draft targets are empty until apply.</small>
                      </span>
                      <span>
                        <strong>After</strong>
                        <small>Generated sections are inserted as editable canvas blocks.</small>
                      </span>
                    </div>
                    <div className={styles.applyVisualDiffRows}>
                      {applyVisualDiffRows.slice(0, 4).map((row) => (
                        <span
                          key={row.pageSlug}
                          data-ai-generator-apply-visual-diff-row={row.pageSlug}
                          data-ai-generator-apply-visual-diff-row-before={row.beforeState}
                          data-ai-generator-apply-visual-diff-row-after-sections={row.afterSectionCount}
                        >
                          <strong>{row.pageTitle}</strong>
                          <small>{displayPlanPath(row.pageSlug)} · {row.afterSectionSummary}</small>
                          <em>{row.afterSectionCount} sections</em>
                        </span>
                      ))}
                      {applyVisualDiffRows.length > 4 ? (
                        <em>+{applyVisualDiffRows.length - 4} more pages</em>
                      ) : null}
                    </div>
                  </div>
                  <div
                    className={styles.applyResponsiveReview}
                    data-ai-generator-apply-responsive-review
                    data-ai-generator-apply-responsive-review-mode="breakpoint_review"
                    data-ai-generator-apply-responsive-review-breakpoint="mobile"
                    data-ai-generator-apply-responsive-review-breakpoints="mobile,tablet"
                    data-ai-generator-apply-responsive-review-page-count={applyResponsiveReviewRows.length}
                    data-ai-generator-apply-responsive-review-issue-count={applyResponsiveReviewIssueCount}
                    data-ai-generator-apply-responsive-review-mobile-issue-count={applyResponsiveReviewMobileIssueCount}
                    data-ai-generator-apply-responsive-review-tablet-issue-count={applyResponsiveReviewTabletIssueCount}
                    data-ai-generator-apply-responsive-review-ready-count={applyResponsiveReviewReadyCount}
                  >
                    <div className={styles.applyResponsiveReviewHead}>
                      <span>Responsive breakpoint review</span>
                      <strong>{applyResponsiveReviewIssueCount} responsive checks</strong>
                    </div>
                    <div className={styles.applyResponsiveReviewRows}>
                      {applyResponsiveReviewRows.slice(0, 4).map((row) => (
                        <span
                          key={row.pageSlug}
                          data-ai-generator-apply-responsive-review-row={row.pageSlug}
                          data-ai-generator-apply-responsive-review-row-breakpoint={row.breakpoint}
                          data-ai-generator-apply-responsive-review-row-breakpoints={row.breakpoints}
                          data-ai-generator-apply-responsive-review-row-issues={row.issueCount}
                          data-ai-generator-apply-responsive-review-row-mobile-issues={row.mobileIssueCount}
                          data-ai-generator-apply-responsive-review-row-tablet-issues={row.tabletIssueCount}
                          data-ai-generator-apply-responsive-review-row-status={row.status}
                          data-ai-generator-apply-responsive-review-row-primary={row.primaryIssue}
                        >
                          <strong>{row.pageTitle}</strong>
                          <small>{displayPlanPath(row.pageSlug)} · {row.issueSummary}</small>
                          <em>{row.status === 'ready' ? 'Ready' : `${row.issueCount} checks`}</em>
                        </span>
                      ))}
                      {applyResponsiveReviewRows.length > 4 ? (
                        <em>+{applyResponsiveReviewRows.length - 4} more pages</em>
                      ) : null}
                    </div>
                  </div>
                  <p>
                    {applyScope === 'sitemap'
                      ? '선택한 slug만 draft로 생성하고, 기존 slug는 서버 검증 후 건너뜁니다.'
                      : '현재 사이트를 덮어쓰지 않고 새 draft page로 생성합니다.'}
                  </p>
                </div>
                <div className={styles.actionRowCompact}>
                  <button type="button" className={styles.secondaryButton} onClick={() => setStep(5)}>
                    다시 생성
                  </button>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    disabled={applying || Boolean(activeDraftSlugError) || (applyScope === 'sitemap' && selectedSitemapCount === 0)}
                    onClick={apply}
                    data-ai-generator-create-draft
                    data-ai-generator-create-selected-drafts
                  >
                    {applying
                      ? '생성 중...'
                      : applyScope === 'sitemap'
                        ? `선택한 ${selectedSitemapCount}개 draft 생성`
                        : 'Draft page 생성'}
                  </button>
                </div>
                {error ? <p className={styles.errorText}>{error}</p> : null}
                {skippedApplyPages.length > 0 ? (
                  <div className={styles.skippedList} data-ai-generator-skipped-pages>
                    {skippedApplyPages.map((page) => (
                      <span key={`${page.slug}-${page.reason}`}>
                        {page.title} · {page.slug} · {page.reason}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              {appliedPageId ? (
                <div
                  className={styles.successCard}
                  data-ai-generator-created-page
                  data-ai-generator-created-page-id={appliedPageId}
                  data-ai-generator-created-page-slug={appliedSlug ?? ''}
                  data-ai-generator-created-page-count={appliedPages.length || 1}
                  data-ai-generator-created-page-published-count={createdDraftPublishedCount}
                >
	                  <p className={styles.successText}>
	                    새 draft page {appliedPages.length || 1}개 생성됨
	                  </p>
	                  {applyScope === 'sitemap' ? (
	                    <p
	                      className={styles.navigationResultText}
	                      data-ai-generator-created-navigation-status
	                    >
	                      {navigationAddedSlugs.length > 0
	                        ? `Navigation updated · ${navigationAddedSlugs.length} pages added`
	                        : 'Navigation skipped · draft only'}
	                    </p>
	                  ) : null}
	                  <div className={styles.createdPageList} data-ai-generator-created-page-list>
                    {createdDraftPageEntries.map((pageEntry) => {
                      const isPublished = publishedCreatedPageIdSet.has(pageEntry.pageId);
                      const preflight = publishPreflightByPageId[pageEntry.pageId];
                      const scheduledJob = scheduledPublishByPageId[pageEntry.pageId];
                      const scheduledInputValue = scheduledPublishInputByPageId[pageEntry.pageId] ?? defaultScheduledPublishInput();
                      const preflightStatus = preflight?.status ?? 'idle';
                      const hasPublishWarnings = (preflight?.warningCount ?? 0) > 0;
                      const publishWarningsAcknowledged = !!publishWarningAcknowledgedByPageId[pageEntry.pageId];
                      const warningOverrideStatus = hasPublishWarnings
                        ? publishWarningsAcknowledged
                          ? 'acknowledged'
                          : 'required'
                        : 'not_required';
                      const normalizedCreatedSlug = normalizePlanSlug(pageEntry.slug);
                      const createdPath = normalizedCreatedSlug === '/'
                        ? `/${locale}`
                        : `/${locale}/${normalizedCreatedSlug}`;
                      const navigationTransactionStatus = navigationAddedSlugSet.has(normalizedCreatedSlug)
                        ? isPublished
                          ? 'public_after_publish'
                          : 'queued_hidden_until_publish'
                        : 'not_requested';
                      const transactionStatus = isPublished
                        ? 'published'
                        : hasPublishWarnings && !publishWarningsAcknowledged
                          ? 'warning_review'
                        : preflightStatus === 'blocked'
                          ? 'blocked'
                          : preflightStatus === 'checking'
                            ? 'checking'
                            : 'ready';
                      const publishDisabled = isPublished
                        || publishingPageId === pageEntry.pageId
                        || preflightStatus === 'checking'
                        || preflightStatus === 'blocked'
                        || (hasPublishWarnings && !publishWarningsAcknowledged);
                      const scheduleTransactionStatus = isPublished
                        ? 'published'
                        : cancellingScheduledPageId === pageEntry.pageId
                          ? 'cancelling'
                        : hasPublishWarnings && !publishWarningsAcknowledged
                          ? 'warning_review'
                        : schedulingPageId === pageEntry.pageId
                          ? 'scheduling'
                          : scheduledJob?.status === 'scheduled'
                            ? 'scheduled'
                            : preflightStatus === 'blocked'
                              ? 'blocked'
                              : preflightStatus === 'checking'
                                ? 'checking'
                                : 'ready';
                      const scheduleAction = scheduledJob?.status === 'scheduled' ? 'cancel' : 'schedule';
                      const scheduleDisabled = isPublished
                        || schedulingPageId === pageEntry.pageId
                        || cancellingScheduledPageId === pageEntry.pageId
                        || (scheduleAction === 'schedule' && (
                          preflightStatus === 'checking'
                          || preflightStatus === 'blocked'
                          || (hasPublishWarnings && !publishWarningsAcknowledged)
                        ));
                      return (
                        <div
                          key={pageEntry.pageId}
                          className={styles.createdPagePublishRow}
                          data-ai-generator-created-page-publish-control
                          data-ai-generator-created-page-publish-status={isPublished ? 'published' : 'draft'}
                          data-ai-generator-created-page-publish-id={pageEntry.pageId}
                          data-ai-generator-created-page-publish-slug={pageEntry.slug}
                        >
                          <a
                            href={`/${locale}/admin-builder?pageId=${encodeURIComponent(pageEntry.pageId)}`}
                            data-ai-generator-created-page-link
                            data-ai-generator-created-page-link-id={pageEntry.pageId}
                            data-ai-generator-created-page-link-slug={pageEntry.slug}
                          >
                            <strong>{pageEntry.title ?? pageEntry.slug}</strong>
                            <span>/{pageEntry.slug}</span>
                          </a>
                          <span
                            className={styles.createdPagePreflight}
                            data-ai-generator-created-page-preflight
                            data-ai-generator-created-page-preflight-status={preflightStatus}
                            data-ai-generator-created-page-preflight-blockers={preflight?.blockerCount ?? 0}
                            data-ai-generator-created-page-preflight-warnings={preflight?.warningCount ?? 0}
                            data-ai-generator-created-page-preflight-infos={preflight?.infoCount ?? 0}
                          >
                            <strong>Publish preflight</strong>
                            <em>{formatPublishPreflight(preflight)}</em>
                            {preflight?.firstIssue || preflight?.message ? (
                              <small>{preflight.firstIssue ?? preflight.message}</small>
                            ) : (
                              <small>SEO, links, images, forms, data checks</small>
                            )}
                          </span>
                          <label
                            className={styles.createdPageWarningOverride}
                            data-ai-generator-created-page-warning-override
                            data-ai-generator-created-page-warning-override-status={warningOverrideStatus}
                            data-ai-generator-created-page-warning-override-warnings={preflight?.warningCount ?? 0}
                          >
                            <input
                              type="checkbox"
                              checked={publishWarningsAcknowledged}
                              disabled={!hasPublishWarnings || isPublished}
                              onChange={(event) => {
                                const checked = event.currentTarget.checked;
                                setPublishWarningAcknowledgedByPageId((current) => ({
                                  ...current,
                                  [pageEntry.pageId]: checked,
                                }));
                              }}
                              data-ai-generator-created-page-warning-override-toggle={pageEntry.pageId}
                            />
                            <span>
                              <strong>Warning override</strong>
                              <em>{hasPublishWarnings
                                ? publishWarningsAcknowledged
                                  ? 'Warnings acknowledged'
                                  : `${preflight?.warningCount ?? 0} warnings need review`
                                : 'No warnings'}</em>
                            </span>
                          </label>
                          <button
                            type="button"
                            className={styles.secondaryButton}
                            disabled={publishDisabled}
                            onClick={() => { void publishCreatedPage(pageEntry); }}
                            data-ai-generator-created-page-publish={pageEntry.pageId}
                          >
                            {isPublished
                              ? 'Published'
                              : publishingPageId === pageEntry.pageId
                                ? 'Publishing...'
                                : 'Publish'}
                          </button>
                          <label className={styles.createdPageScheduleInput}>
                            <span>Schedule time</span>
                            <input
                              type="datetime-local"
                              value={scheduledInputValue}
                              disabled={isPublished || schedulingPageId === pageEntry.pageId || scheduledJob?.status === 'scheduled'}
                              onChange={(event) => {
                                const nextValue = event.currentTarget.value;
                                setScheduledPublishInputByPageId((current) => ({
                                  ...current,
                                  [pageEntry.pageId]: nextValue,
                                }));
                              }}
                              data-ai-generator-created-page-schedule-input={pageEntry.pageId}
                            />
                          </label>
                          <button
                            type="button"
                            className={styles.secondaryButton}
                            disabled={scheduleDisabled}
                            onClick={() => {
                              if (scheduleAction === 'cancel') {
                                void cancelCreatedPageSchedule(pageEntry);
                              } else {
                                void scheduleCreatedPagePublish(pageEntry);
                              }
                            }}
                            data-ai-generator-created-page-schedule={pageEntry.pageId}
                            data-ai-generator-created-page-schedule-action={scheduleAction}
                          >
                            {isPublished
                              ? 'Published'
                              : cancellingScheduledPageId === pageEntry.pageId
                                ? 'Cancelling...'
                              : scheduleAction === 'cancel'
                                ? 'Cancel schedule'
                                : schedulingPageId === pageEntry.pageId
                                  ? 'Scheduling...'
                                  : 'Schedule +24h'}
                          </button>
                          <span
                            className={styles.createdPageTransaction}
                            data-ai-generator-created-page-publish-transaction
                            data-ai-generator-created-page-publish-transaction-status={transactionStatus}
                            data-ai-generator-created-page-publish-transaction-mode="immediate"
                            data-ai-generator-created-page-publish-transaction-navigation={navigationTransactionStatus}
                            data-ai-generator-created-page-publish-transaction-route={createdPath}
                          >
                            <strong>Immediate publish transaction</strong>
                            <small>
                              <em>{createdPath}</em>
                              <em>{navigationTransactionStatus === 'public_after_publish'
                                ? 'Navigation public'
                                : navigationTransactionStatus === 'queued_hidden_until_publish'
                                  ? 'Navigation hidden until publish'
                                  : 'Navigation unchanged'}</em>
                              <em>{preflight?.blockerCount ?? 0} blockers</em>
                              <em>{preflight?.warningCount ?? 0} warnings</em>
                            </small>
                          </span>
                          <span
                            className={`${styles.createdPageTransaction} ${styles.createdPageScheduleTransaction}`}
                            data-ai-generator-created-page-schedule-transaction
                            data-ai-generator-created-page-schedule-status={scheduleTransactionStatus}
                            data-ai-generator-created-page-schedule-mode="scheduled"
                            data-ai-generator-created-page-schedule-at={scheduledJob?.scheduledAt ?? ''}
                            data-ai-generator-created-page-schedule-route={createdPath}
                          >
                            <strong>Scheduled publish transaction</strong>
                            <small>
                              <em>{createdPath}</em>
                              <em>{scheduledJob?.status === 'scheduled'
                                ? formatScheduledPublishTime(scheduledJob.scheduledAt)
                                : isPublished
                                  ? 'Already published'
                                  : scheduleTransactionStatus === 'blocked'
                                    ? 'Preflight blocked'
                                    : 'Ready for +24h schedule'}</em>
                              <em>{preflight?.blockerCount ?? 0} blockers</em>
                              <em>{preflight?.warningCount ?? 0} warnings</em>
                            </small>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {publishNotice ? (
                    <p className={styles.successText} data-ai-generator-publish-notice>
                      {publishNotice}
                    </p>
                  ) : null}
                  {publishError ? (
                    <p className={styles.errorText} data-ai-generator-publish-error>
                      {publishError}
                    </p>
                  ) : null}
                  <div className={styles.successActions}>
                    <a href={`/${locale}/admin-builder?pageId=${encodeURIComponent(appliedPageId)}`}>
                      첫 페이지 열기
                    </a>
                    <button
                      type="button"
                      className={styles.dangerButton}
                      disabled={discarding}
                      onClick={discardAppliedDraft}
                      data-ai-generator-discard-draft
                    >
                      {discarding ? '폐기 중...' : 'Draft 폐기'}
                    </button>
                  </div>
                </div>
              ) : null}
              {discardNotice ? (
                <p className={styles.successText} data-ai-generator-discard-notice>
                  {discardNotice}
                </p>
              ) : null}
            </section>

            <aside className={styles.planPanel}>
              <section className={styles.planSection} data-ai-generator-sitemap>
                <span className={styles.eyebrow}>Sitemap</span>
                <div className={styles.sitemapList}>
                  {draft.plan.sitemap.map((page) => {
                    const planSlug = normalizePlanSlug(page.slug);
	                    const skippedReason = skippedPageReasons.get(planSlug);
	                    const isCreated = appliedPageSlugs.has(planSlug);
	                    const isNavigationAdded = navigationAddedSlugSet.has(planSlug);
	                    const isHomePage = planSlug === '/';
                    const isExistingPage = sitePageBySlug.has(planSlug);
                    const isSelected = selectedSitemapPageSlugSet.has(planSlug);
                    const status = isCreated
                      ? 'created'
                      : skippedReason
                        ? skippedReason
                        : isHomePage
                          ? 'home'
                          : !isSelected
                            ? 'not_selected'
                            : isExistingPage
                              ? 'existing_page'
                              : 'planned';
                    const statusClassName = [
                      styles.pageStatus,
                      isCreated
                        ? styles.pageStatusCreated
                        : skippedReason
                          ? styles.pageStatusSkipped
                          : styles.pageStatusPlanned,
                    ].join(' ');
                    return (
                      <article
                        key={page.slug}
                        data-ai-generator-sitemap-page
                        data-ai-generator-sitemap-page-slug={planSlug}
                      >
                        <div className={styles.sitemapCardTop}>
                          <label className={styles.sitemapSelectRow}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={isHomePage || isCreated || applying}
                              onChange={(event) => {
                                const checked = event.target.checked;
                                setSelectedSitemapPageSlugs((current) => {
                                  if (checked) return Array.from(new Set([...current, planSlug]));
                                  return current.filter((slug) => slug !== planSlug);
                                });
                                setError('');
                              }}
                              data-ai-generator-sitemap-page-checkbox={planSlug}
                            />
                            <span className={styles.sitemapCardTitle}>
                              <strong>{page.title}</strong>
                              <span className={styles.pageSlug}>{page.slug}</span>
                            </span>
                          </label>
	                          <span className={statusClassName} data-ai-generator-page-status={status}>
	                            {formatPageStatusLabel(status)}
	                          </span>
	                        </div>
	                        {isNavigationAdded ? (
	                          <span
	                            className={styles.navigationStatusChip}
	                            data-ai-generator-sitemap-navigation-status="added"
	                          >
	                            Navigation added
	                          </span>
	                        ) : null}
	                        <p>{page.purpose}</p>
                        <small>{page.sections.join(' / ')}</small>
                      </article>
                    );
                  })}
                </div>
              </section>

              <section className={styles.planSection} data-ai-generator-section-library>
                <span className={styles.eyebrow}>Reusable Sections</span>
                <div className={styles.generatedSectionList}>
                  {generatedSectionSnapshots.slice(0, 6).map((snapshot) => {
                    const savedSectionId = savedSectionIds[snapshot.rootNodeId] ?? '';
                    const saving = savingSectionRootId === snapshot.rootNodeId;
                    return (
                      <article
                        key={snapshot.sectionKey}
                        className={styles.generatedSectionCard}
                        data-ai-generator-section-card
                        data-ai-generator-section-root-id={snapshot.rootNodeId}
                        data-ai-generator-saved-section-id={savedSectionId}
                      >
                        <div>
                          <strong>{snapshot.name.replace(/^AI\s+/, '')}</strong>
                          <span>{snapshot.category}</span>
                        </div>
                        <p>{snapshot.description}</p>
                        <button
                          type="button"
                          className={styles.secondaryButton}
                          disabled={saving || Boolean(savedSectionId)}
                          onClick={() => { void saveGeneratedSection(snapshot); }}
                          data-ai-generator-save-section
                        >
                          {savedSectionId ? '저장됨' : saving ? '저장 중...' : 'Saved Sections에 저장'}
                        </button>
                      </article>
                    );
                  })}
                </div>
                {sectionSaveNotice ? (
                  <p className={styles.successText} data-ai-generator-section-save-notice>
                    {sectionSaveNotice}
                  </p>
                ) : null}
              </section>

              <section className={styles.planSection} data-ai-generator-content-plan>
                <span className={styles.eyebrow}>Content Plan</span>
                <div className={styles.contentPlanList}>
                  {draft.plan.contentPlan.map((item) => (
                    <article key={item.sectionId}>
                      <strong>{item.title}</strong>
                      <span>{item.intent}</span>
                    </article>
                  ))}
                </div>
              </section>

              <section className={styles.planSection}>
                <span className={styles.eyebrow}>Brand Brief</span>
                <dl className={styles.brandBrief}>
                  <div>
                    <dt>고객</dt>
                    <dd>{draft.plan.brandBrief.audience}</dd>
                  </div>
                  <div>
                    <dt>목표</dt>
                    <dd>{draft.plan.brandBrief.goals.join(', ')}</dd>
                  </div>
                  <div>
                    <dt>키워드</dt>
                    <dd>{draft.plan.brandBrief.keywords.join(', ')}</dd>
                  </div>
                  <div>
                    <dt>제약</dt>
                    <dd>{draft.plan.brandBrief.constraints}</dd>
                  </div>
                </dl>
              </section>
            </aside>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function Panel({
  kicker,
  title,
  description,
  children,
  footer,
}: {
  kicker: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <article className={styles.panel}>
      <div className={styles.panelHead}>
        <span className={styles.eyebrow}>{kicker}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className={styles.panelBody}>{children}</div>
      {footer}
    </article>
  );
}

function StepFooter({
  previous,
  next,
  primaryLabel = '다음',
  nextDisabled,
  nextDataAttr,
}: {
  previous?: () => void;
  next?: () => void;
  primaryLabel?: string;
  nextDisabled?: boolean;
  nextDataAttr?: string;
}) {
  const dataAttrs = nextDataAttr ? { [nextDataAttr]: true } : {};
  return (
    <div className={styles.actionRow}>
      {previous ? (
        <button type="button" className={styles.secondaryButton} onClick={previous}>
          이전
        </button>
      ) : <span />}
      <button
        type="button"
        className={styles.primaryButton}
        disabled={nextDisabled}
        onClick={next}
        {...dataAttrs}
      >
        {primaryLabel}
      </button>
    </div>
  );
}
