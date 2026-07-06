'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type {
  BuilderSeoAdditionalMetaTag,
  BuilderSeoMetadata,
  BuilderStructuredDataBlock,
  BuilderStructuredDataBlockType,
} from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';
import type { BuilderSeoAssistantTask } from '@/lib/builder/seo/assistant';
import { SeoPanelAdvancedTab } from './SeoPanelAdvancedTab';
import { SeoPanelAssistantTab } from './SeoPanelAssistantTab';
import { SeoPanelBasicsTab } from './SeoPanelBasicsTab';
import {
  SeoPanelHreflangTab,
  type HreflangAlternateResponse,
  type SiblingPageResponse,
} from './SeoPanelHreflangTab';
import {
  SeoPanelSocialTab,
  type SeoSocialTextField,
} from './SeoPanelSocialTab';
import {
  SEO_DESCRIPTION_MAX,
  SEO_TITLE_MAX,
  type BuilderSeoValidationIssue,
  normalizeStructuredDataSettings,
  validateBuilderPageSeo,
} from '@/lib/builder/seo/validation';
import styles from './SeoPanel.module.css';
import { getSeoPanelCopy } from './seo-panel-copy';

interface SeoFormState {
  slug: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: 'summary' | 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  canonical: string;
  noIndex: boolean;
  noFollow: boolean;
  additionalMetaTags: BuilderSeoAdditionalMetaTag[];
  focusKeyword: string;
  structuredDataBlocks: BuilderStructuredDataBlock[];
  structuredData: {
    legalService: boolean;
    organization: boolean;
    localBusiness: boolean;
    faqPage: 'auto' | 'off';
    breadcrumbList: boolean;
  };
}

const EMPTY_SEO: SeoFormState = {
  slug: '',
  title: '',
  description: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  twitterCard: 'summary_large_image',
  twitterTitle: '',
  twitterDescription: '',
  twitterImage: '',
  canonical: '',
  noIndex: false,
  noFollow: false,
  additionalMetaTags: [],
  focusKeyword: '',
  structuredDataBlocks: [],
  structuredData: {
    legalService: true,
    organization: false,
    localBusiness: false,
    faqPage: 'auto',
    breadcrumbList: true,
  },
};

const STRUCTURED_DATA_BLOCK_TEMPLATES: Record<BuilderStructuredDataBlockType, { label: string; json: string }> = {
  Article: {
    label: 'Article JSON-LD',
    json: '{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "칼럼 제목",\n  "description": "칼럼 요약",\n  "datePublished": "2026-05-12",\n  "dateModified": "2026-05-12",\n  "author": {\n    "@type": "Organization",\n    "name": "호정국제 법률사무소"\n  }\n}',
  },
  FAQPage: {
    label: 'FAQPage JSON-LD',
    json: '{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [\n    {\n      "@type": "Question",\n      "name": "질문을 입력하세요",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "답변을 입력하세요"\n      }\n    }\n  ]\n}',
  },
  LegalService: {
    label: 'LegalService JSON-LD',
    json: '{\n  "@context": "https://schema.org",\n  "@type": "LegalService",\n  "name": "호정국제 법률사무소",\n  "url": "https://tseng-law.com"\n}',
  },
  Organization: {
    label: 'Organization JSON-LD',
    json: '{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "호정국제 법률사무소",\n  "url": "https://tseng-law.com"\n}',
  },
  LocalBusiness: {
    label: 'LocalBusiness JSON-LD',
    json: '{\n  "@context": "https://schema.org",\n  "@type": "LocalBusiness",\n  "name": "호정국제 법률사무소",\n  "url": "https://tseng-law.com"\n}',
  },
  BreadcrumbList: {
    label: 'BreadcrumbList JSON-LD',
    json: '{\n  "@context": "https://schema.org",\n  "@type": "BreadcrumbList",\n  "itemListElement": []\n}',
  },
  Custom: {
    label: 'Custom JSON-LD',
    json: '{\n  "@context": "https://schema.org",\n  "@type": "Organization"\n}',
  },
};

function isStarterStructuredDataJson(json: string | undefined): boolean {
  const normalized = (json ?? '').trim();
  if (!normalized) return true;
  return Object.values(STRUCTURED_DATA_BLOCK_TEMPLATES).some((template) => template.json.trim() === normalized);
}

export function localizedUntitledPage(locale: Locale): string {
  if (locale === 'ko') return '제목 없음 페이지';
  if (locale === 'zh-hant') return '未命名頁面';
  return 'Untitled page';
}

interface SeoPageResponseMeta {
  pageId: string;
  slug: string;
  title: Record<string, string>;
  locale: string;
  isHomePage?: boolean;
  linkedPageIds?: Record<string, string>;
  noIndex?: boolean;
}

interface SeoResponse {
  ok?: boolean;
  page?: SeoPageResponseMeta;
  seo?: BuilderSeoMetadata;
  defaultSeo?: BuilderSeoMetadata;
  defaults?: {
    publicPath?: string;
    canonical?: string;
  };
  hreflang?: HreflangAlternateResponse[];
  siblings?: SiblingPageResponse[];
  missingLocales?: string[];
  sitemapIncluded?: boolean;
  validation?: BuilderSeoValidationIssue[];
  redirectCreated?: boolean;
  redirectWarnings?: Array<{
    from: string;
    to: string;
    message: string;
  }>;
  error?: string;
}

type SeoPanelTab = 'basics' | 'social' | 'advanced' | 'hreflang' | 'assistant';

interface SeoAssistantResponse {
  ok?: boolean;
  focusKeyword?: string;
  tasks?: BuilderSeoAssistantTask[];
  error?: string;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function truncatePreview(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, Math.max(0, max - 1)).trimEnd()}...`;
}

function trimText(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function textFromNode(node: BuilderCanvasNode): string {
  const content = (node.content ?? {}) as Record<string, unknown>;
  return [
    content.text,
    content.title,
    content.headline,
    content.subtitle,
    content.description,
    content.label,
  ].map(trimText).filter(Boolean).join(' ');
}

function collectPageText(document?: BuilderCanvasDocument): string[] {
  if (!document) return [];
  return document.nodes
    .filter((node) => node.visible !== false)
    .map(textFromNode)
    .filter(Boolean);
}

function findPrimaryHeading(document?: BuilderCanvasDocument): string {
  if (!document) return '';
  const h1 = document.nodes.find((node) => {
    const content = (node.content ?? {}) as Record<string, unknown>;
    return node.visible !== false && (
      (node.kind === 'heading' && content.level === 1)
      || (node.kind === 'text' && content.as === 'h1')
    );
  });
  return h1 ? textFromNode(h1) : '';
}

function fitText(value: string, max: number): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : clean.slice(0, max - 1).trimEnd();
}

function buildRecommendation(input: {
  form: SeoFormState;
  page?: SeoPageResponseMeta | null;
  document?: BuilderCanvasDocument;
  siteName?: string;
  locale: Locale;
}): Pick<SeoFormState, 'title' | 'description' | 'ogTitle' | 'ogDescription' | 'twitterTitle' | 'twitterDescription'> {
  const copy = getSeoPanelCopy(input.locale);
  const pageTitle = input.page?.title[input.locale] || input.page?.title.ko || input.form.slug || copy.pageTitleFallback;
  const heading = findPrimaryHeading(input.document) || pageTitle;
  const siteName = input.siteName || copy.recommendationSiteNameFallback;
  const texts = collectPageText(input.document);
  const body = texts.filter((item) => item !== heading).join(' ');
  const baseTitle = fitText(`${heading} | ${siteName}`, SEO_TITLE_MAX);
  const descriptionSource = body || copy.recommendationDescription(heading, siteName);
  const description = fitText(descriptionSource, SEO_DESCRIPTION_MAX);

  return {
    title: baseTitle,
    description,
    ogTitle: baseTitle,
    ogDescription: description,
    twitterTitle: baseTitle,
    twitterDescription: description,
  };
}

function seoPayloadFromForm(form: SeoFormState): BuilderSeoMetadata {
  return {
    title: form.title,
    description: form.description,
    ogTitle: form.ogTitle,
    ogDescription: form.ogDescription,
    ogImage: form.ogImage,
    twitterCard: form.twitterCard,
    twitterTitle: form.twitterTitle,
    twitterDescription: form.twitterDescription,
    twitterImage: form.twitterImage,
    canonical: form.canonical,
    noIndex: form.noIndex,
    noFollow: form.noFollow,
    focusKeyword: form.focusKeyword,
    additionalMetaTags: form.additionalMetaTags
      .map((tag) => ({
        id: tag.id,
        name: tag.name.trim(),
        content: tag.content.trim(),
      }))
      .filter((tag) => tag.name && tag.content),
    structuredDataBlocks: form.structuredDataBlocks
      .map((block) => ({
        ...block,
        label: block.label?.trim() || undefined,
        json: block.json?.trim() || undefined,
      }))
      .filter((block) => block.enabled || block.json),
    structuredData: form.structuredData,
  };
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => (
    !element.hidden &&
    !element.closest('[hidden]') &&
    element.getAttribute('aria-hidden') !== 'true' &&
    element.getClientRects().length > 0
  ));
}

export default function SeoPanel({
  open,
  pageId,
  locale,
  document: canvasDocument,
  siteName,
  onSaved,
  onClose,
}: {
  open: boolean;
  pageId: string;
  locale: Locale;
  document?: BuilderCanvasDocument;
  siteName?: string;
  onSaved?: (page: SeoPageResponseMeta) => void;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<SeoPanelTab>('basics');
  const [form, setForm] = useState<SeoFormState>(EMPTY_SEO);
  const [page, setPage] = useState<SeoPageResponseMeta | null>(null);
  const [defaults, setDefaults] = useState<SeoResponse['defaults']>({});
  const [serverIssues, setServerIssues] = useState<BuilderSeoValidationIssue[]>([]);
  const [assistantTasks, setAssistantTasks] = useState<BuilderSeoAssistantTask[]>([]);
  const [assistantStatus, setAssistantStatus] = useState('');
  const [createRedirect, setCreateRedirect] = useState(true);
  const [hreflangAlternates, setHreflangAlternates] = useState<HreflangAlternateResponse[]>([]);
  const [siblings, setSiblings] = useState<SiblingPageResponse[]>([]);
  const [missingLocales, setMissingLocales] = useState<string[]>([]);
  const [sitemapIncluded, setSitemapIncluded] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectWarning, setRedirectWarning] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const closingRef = useRef(false);
  const copy = useMemo(() => getSeoPanelCopy(locale), [locale]);

  const closePanel = useCallback(() => {
    closingRef.current = true;
    onClose();
  }, [onClose]);

  const fetchAssistant = useCallback(async () => {
    if (!pageId) return;
    try {
      const response = await fetch(
        `/api/builder/site/pages/${pageId}/seo-assistant?locale=${encodeURIComponent(locale)}`,
        { credentials: 'same-origin' },
      );
      const payload = (await response.json().catch(() => ({}))) as SeoAssistantResponse;
      if (response.ok && payload.tasks) {
        setAssistantTasks(payload.tasks);
      }
    } catch {
      setAssistantTasks([]);
    }
  }, [locale, pageId]);

  const fetchSeo = useCallback(async () => {
    if (!pageId) {
      setForm(EMPTY_SEO);
      setError(copy.noPageSelected);
      setRedirectWarning(null);
      return;
    }

    setLoading(true);
    setError(null);
    setRedirectWarning(null);

    try {
      const response = await fetch(
        `/api/builder/site/pages/${pageId}/seo?locale=${encodeURIComponent(locale)}`,
        { credentials: 'same-origin' },
      );
      const payload = (await response.json().catch(() => ({}))) as SeoResponse;

      if (!response.ok) {
        setError(payload.error || copy.loadError);
        return;
      }

      const structuredData = normalizeStructuredDataSettings(payload.seo?.structuredData);
      setPage(payload.page ?? null);
      setDefaults(payload.defaults ?? {});
      setServerIssues(payload.validation ?? []);
      setHreflangAlternates(payload.hreflang ?? []);
      setSiblings(payload.siblings ?? []);
      setMissingLocales(payload.missingLocales ?? []);
      setSitemapIncluded(payload.sitemapIncluded ?? !Boolean(payload.seo?.noIndex));
      setForm({
        slug: payload.page?.slug ?? '',
        title: payload.seo?.title ?? '',
        description: payload.seo?.description ?? '',
        ogTitle: payload.seo?.ogTitle ?? '',
        ogDescription: payload.seo?.ogDescription ?? '',
        ogImage: payload.seo?.ogImage ?? '',
        twitterCard: payload.seo?.twitterCard ?? 'summary_large_image',
        twitterTitle: payload.seo?.twitterTitle ?? '',
        twitterDescription: payload.seo?.twitterDescription ?? '',
        twitterImage: payload.seo?.twitterImage ?? '',
        canonical: payload.seo?.canonical ?? '',
        noIndex: Boolean(payload.seo?.noIndex),
        noFollow: Boolean(payload.seo?.noFollow),
        focusKeyword: payload.seo?.focusKeyword ?? '',
        additionalMetaTags: payload.seo?.additionalMetaTags ?? [],
        structuredDataBlocks: payload.seo?.structuredDataBlocks ?? [],
        structuredData,
      });
      setCreateRedirect(true);
      void fetchAssistant();
    } catch {
      setError(copy.loadError);
    } finally {
      setLoading(false);
    }
  }, [copy.loadError, copy.noPageSelected, fetchAssistant, locale, pageId]);

  useEffect(() => {
    if (open) void fetchSeo();
  }, [fetchSeo, open]);

  useLayoutEffect(() => {
    if (!open) {
      if (closingRef.current) {
        const restoreTarget = restoreFocusRef.current;
        window.setTimeout(() => {
          if (restoreTarget?.isConnected) restoreTarget.focus({ preventScroll: true });
          restoreFocusRef.current = null;
          closingRef.current = false;
        }, 0);
      } else {
        restoreFocusRef.current = null;
      }
      return undefined;
    }

    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closingRef.current = false;
    const panel = panelRef.current;
    if (!panel) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    const focusFrame = window.requestAnimationFrame(() => {
      const focusable = getFocusableElements(panel);
      (focusable[0] ?? panel).focus({ preventScroll: true });
    });
    const handleFocusIn = (event: FocusEvent) => {
      if (panel.contains(event.target as Node | null)) return;
      const focusable = getFocusableElements(panel);
      (focusable[0] ?? panel).focus({ preventScroll: true });
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('focusin', handleFocusIn);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousBodyOverflow;
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, [open]);

  const handlePanelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closePanel();
      return;
    }
    if (event.key !== 'Tab') return;

    const panel = panelRef.current;
    if (!panel) return;
    const focusable = getFocusableElements(panel);
    if (focusable.length === 0) {
      event.preventDefault();
      panel.focus({ preventScroll: true });
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus({ preventScroll: true });
      return;
    }
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  };

  const localIssues = useMemo(() => {
    if (!page) return serverIssues;
    return validateBuilderPageSeo({
      page: {
        ...page,
        slug: form.slug,
        title: page.title as Record<Locale, string>,
        seo: seoPayloadFromForm(form),
        createdAt: '',
        updatedAt: '',
        locale: page.locale as Locale,
      },
      seo: seoPayloadFromForm(form),
      slug: form.slug,
    });
  }, [form, page, serverIssues]);

  const updateField = <K extends keyof SeoFormState>(key: K, value: SeoFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateStructuredField = <K extends keyof SeoFormState['structuredData']>(
    key: K,
    value: SeoFormState['structuredData'][K],
  ) => {
    setForm((current) => ({
      ...current,
      structuredData: {
        ...current.structuredData,
        [key]: value,
      },
    }));
  };

  const updateAdditionalMetaTag = (
    id: string,
    key: keyof Pick<BuilderSeoAdditionalMetaTag, 'name' | 'content'>,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      additionalMetaTags: current.additionalMetaTags.map((tag) => (
        tag.id === id ? { ...tag, [key]: value } : tag
      )),
    }));
  };

  const addAdditionalMetaTag = () => {
    setForm((current) => ({
      ...current,
      additionalMetaTags: [
        ...current.additionalMetaTags,
        { id: `meta-${Date.now().toString(36)}`, name: '', content: '' },
      ],
    }));
  };

  const removeAdditionalMetaTag = (id: string) => {
    setForm((current) => ({
      ...current,
      additionalMetaTags: current.additionalMetaTags.filter((tag) => tag.id !== id),
    }));
  };

  const addStructuredDataBlock = (type: BuilderStructuredDataBlockType = 'Article') => {
    const template = STRUCTURED_DATA_BLOCK_TEMPLATES[type];
    setForm((current) => ({
      ...current,
      structuredDataBlocks: [
        ...current.structuredDataBlocks,
        {
          id: `schema-${Date.now().toString(36)}`,
          type,
          label: template.label,
          enabled: true,
          json: template.json,
        },
      ],
    }));
  };

  const changeStructuredDataBlockType = (id: string, type: BuilderStructuredDataBlockType) => {
    const template = STRUCTURED_DATA_BLOCK_TEMPLATES[type];
    setForm((current) => ({
      ...current,
      structuredDataBlocks: current.structuredDataBlocks.map((block) => {
        if (block.id !== id) return block;
        return {
          ...block,
          type,
          label: block.label?.trim() ? block.label : template.label,
          json: isStarterStructuredDataJson(block.json) ? template.json : block.json,
        };
      }),
    }));
  };

  const updateStructuredDataBlock = (
    id: string,
    patch: Partial<BuilderStructuredDataBlock>,
  ) => {
    setForm((current) => ({
      ...current,
      structuredDataBlocks: current.structuredDataBlocks.map((block) => (
        block.id === id ? { ...block, ...patch } : block
      )),
    }));
  };

  const removeStructuredDataBlock = (id: string) => {
    setForm((current) => ({
      ...current,
      structuredDataBlocks: current.structuredDataBlocks.filter((block) => block.id !== id),
    }));
  };

  const applyRecommendation = () => {
    const recommendation = buildRecommendation({ form, page, document: canvasDocument, siteName, locale });
    setForm((current) => ({ ...current, ...recommendation }));
  };

  const saveFocusKeyword = async () => {
    if (!pageId) return;
    setAssistantStatus(copy.assistantSaving);
    try {
      const response = await fetch(
        `/api/builder/site/pages/${pageId}/seo-assistant?locale=${encodeURIComponent(locale)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ focusKeyword: form.focusKeyword }),
        },
      );
      const payload = (await response.json().catch(() => ({}))) as SeoAssistantResponse;
      if (!response.ok) {
        setAssistantStatus(payload.error || copy.assistantSaveFailed);
        return;
      }
      setAssistantTasks(payload.tasks ?? []);
      setAssistantStatus(copy.assistantSaved);
    } catch {
      setAssistantStatus(copy.assistantSaveFailed);
    }
  };

  const handleSave = async () => {
    if (!pageId) {
      setError(copy.noPageSelected);
      return;
    }

    setSaving(true);
    setError(null);
    setRedirectWarning(null);

    try {
      const response = await fetch(
        `/api/builder/site/pages/${pageId}/seo?locale=${encodeURIComponent(locale)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            slug: form.slug,
            seo: seoPayloadFromForm(form),
            createRedirect,
          }),
        },
      );
      const payload = (await response.json().catch(() => ({}))) as SeoResponse;

      if (!response.ok) {
        setServerIssues(payload.validation ?? []);
        setError(payload.error || copy.saveError);
        return;
      }

      setPage(payload.page ?? page);
      setDefaults(payload.defaults ?? defaults);
      setServerIssues(payload.validation ?? []);
      if (payload.page) onSaved?.(payload.page);
      if (payload.redirectWarnings?.length) {
        const warning = payload.redirectWarnings[0];
        setRedirectWarning(copy.redirectWarning(warning.from, warning.message));
        setActiveTab('basics');
        return;
      }
      closePanel();
    } catch {
      setError(copy.saveError);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const canonicalPreview = form.canonical.trim() || defaults?.canonical || `/${locale}/${form.slug}`;
  const publicPathPreview = defaults?.publicPath || `/${locale}${form.slug ? `/${form.slug}` : ''}`;
  const searchTitle = truncatePreview(form.title.trim() || page?.title[locale] || page?.title.ko || copy.pageTitleFallback, 62);
  const searchDescription = truncatePreview(form.description.trim() || copy.searchDescriptionFallback, 160);
  const socialTitle = truncatePreview(form.ogTitle.trim() || form.title.trim() || localizedUntitledPage(locale), 80);
  const socialDescription = truncatePreview(form.ogDescription.trim() || form.description.trim() || copy.socialDescriptionFallback, 150);
  const socialImage = form.ogImage.trim() || form.twitterImage.trim();
  const blockers = localIssues.filter((issue) => issue.severity === 'blocker').length;
  const warnings = localIssues.filter((issue) => issue.severity === 'warning').length;

  return (
    <div
      className={styles.backdrop}
      onClick={(event) => {
        if (event.target === event.currentTarget) closePanel();
      }}
    >
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={copy.dialogLabel}
        tabIndex={-1}
        data-builder-seo-panel-dialog="true"
        onKeyDownCapture={handlePanelKeyDown}
      >
        <div className={styles.header}>
          <div className={styles.headerText}>
            <strong className={styles.title}>{copy.title}</strong>
            <span className={styles.helpText}>
              {publicPathPreview} · {copy.summary(blockers, warnings)}
            </span>
          </div>
          <div className={styles.headerActions}>
            <button type="button" className={styles.ghostButton} onClick={applyRecommendation}>
              {copy.applyRecommendation}
            </button>
            <button type="button" className={styles.ghostButton} onClick={closePanel}>
              {copy.close}
            </button>
          </div>
        </div>

        <div className={styles.tabBar}>
          {[
            ['basics', copy.tabs.basics],
            ['social', copy.tabs.social],
            ['advanced', copy.tabs.advanced],
            ['hreflang', copy.tabs.hreflang],
            ['assistant', copy.tabs.assistant],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={styles.tabButton}
              data-active={activeTab === key ? 'true' : undefined}
              onClick={() => setActiveTab(key as SeoPanelTab)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.form}>
          {loading ? (
            <div className={styles.loading}>
              {copy.loading}
            </div>
          ) : (
            <>
              <SeoPanelBasicsTab
                active={activeTab === 'basics'}
                locale={locale}
                page={page}
                defaults={defaults}
                slug={form.slug}
                canonical={form.canonical}
                title={form.title}
                description={form.description}
                noIndex={form.noIndex}
                noFollow={form.noFollow}
                createRedirect={createRedirect}
                canonicalPreview={canonicalPreview}
                searchTitle={searchTitle}
                searchDescription={searchDescription}
                onChangeTextField={(key, value) => updateField(key, value)}
                onChangeBooleanField={(key, value) => updateField(key, value)}
                onChangeCreateRedirect={setCreateRedirect}
              />

              <SeoPanelSocialTab
                active={activeTab === 'social'}
                locale={locale}
                ogTitle={form.ogTitle}
                ogImage={form.ogImage}
                ogDescription={form.ogDescription}
                twitterCard={form.twitterCard}
                twitterImage={form.twitterImage}
                twitterTitle={form.twitterTitle}
                twitterDescription={form.twitterDescription}
                socialImage={socialImage}
                socialTitle={socialTitle}
                socialDescription={socialDescription}
                onChangeTextField={(key: SeoSocialTextField, value) => updateField(key, value)}
                onChangeTwitterCard={(value) => updateField('twitterCard', value)}
              />

              <SeoPanelAdvancedTab
                active={activeTab === 'advanced'}
                locale={locale}
                additionalMetaTags={form.additionalMetaTags}
                structuredData={form.structuredData}
                structuredDataBlocks={form.structuredDataBlocks}
                onAddAdditionalMetaTag={addAdditionalMetaTag}
                onUpdateAdditionalMetaTag={updateAdditionalMetaTag}
                onRemoveAdditionalMetaTag={removeAdditionalMetaTag}
                onUpdateStructuredField={updateStructuredField}
                onAddStructuredDataBlock={addStructuredDataBlock}
                onChangeStructuredDataBlockType={changeStructuredDataBlockType}
                onUpdateStructuredDataBlock={updateStructuredDataBlock}
                onRemoveStructuredDataBlock={removeStructuredDataBlock}
              />

              <SeoPanelHreflangTab
                active={activeTab === 'hreflang'}
                locale={locale}
                hreflangAlternates={hreflangAlternates}
                siblings={siblings}
                missingLocales={missingLocales}
                sitemapIncluded={sitemapIncluded}
              />

              <SeoPanelAssistantTab
                active={activeTab === 'assistant'}
                locale={locale}
                focusKeyword={form.focusKeyword}
                assistantStatus={assistantStatus}
                assistantTasks={assistantTasks}
                localIssues={localIssues}
                onChangeFocusKeyword={(value) => updateField('focusKeyword', value)}
                onSaveFocusKeyword={saveFocusKeyword}
              />
            </>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.footerStatus}>
            <span className={styles.errorText}>{error ?? ''}</span>
            {redirectWarning ? (
              <span
                role="status"
                aria-live="polite"
                className={styles.warningText}
              >
                {redirectWarning}
              </span>
            ) : null}
          </div>
          <div className={styles.footerActions}>
            <button type="button" className={styles.ghostButton} onClick={closePanel}>
              {copy.cancel}
            </button>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleSave}
              disabled={saving || loading || !pageId}
            >
              {saving ? copy.saving : copy.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
