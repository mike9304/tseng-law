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
import {
  SEO_DESCRIPTION_MAX,
  SEO_DESCRIPTION_MIN,
  SEO_TITLE_MAX,
  SEO_TITLE_MIN,
  type BuilderSeoValidationIssue,
  normalizeStructuredDataSettings,
  validateBuilderPageSeo,
} from '@/lib/builder/seo/validation';

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

const STRUCTURED_DATA_BLOCK_TYPES: Array<{ type: BuilderStructuredDataBlockType; label: string }> = [
  { type: 'Article', label: 'Article' },
  { type: 'FAQPage', label: 'FAQPage' },
  { type: 'LegalService', label: 'LegalService' },
  { type: 'Organization', label: 'Organization' },
  { type: 'LocalBusiness', label: 'LocalBusiness' },
  { type: 'BreadcrumbList', label: 'BreadcrumbList' },
  { type: 'Custom', label: 'Custom' },
];

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

interface SeoPageResponseMeta {
  pageId: string;
  slug: string;
  title: Record<string, string>;
  locale: string;
  isHomePage?: boolean;
  linkedPageIds?: Record<string, string>;
  noIndex?: boolean;
}

interface HreflangAlternateResponse {
  hreflang: string;
  locale: string;
  href: string;
}

interface SiblingPageResponse {
  locale: string;
  pageId: string;
  slug: string;
  hreflang: string;
  noIndex: boolean;
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

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 21000,
  background: 'rgba(15, 23, 42, 0.45)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const panelStyle: React.CSSProperties = {
  width: 760,
  maxWidth: '94vw',
  maxHeight: '88vh',
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 24px 64px rgba(15, 23, 42, 0.18)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  padding: '16px 20px',
  borderBottom: '1px solid #e2e8f0',
};

const formStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '16px 20px',
  display: 'grid',
  gap: 14,
};

const sectionStyle: React.CSSProperties = {
  display: 'grid',
  gap: 12,
  padding: 14,
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  background: '#fff',
};

const twoColumnStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  gap: 12,
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.77rem',
  fontWeight: 700,
  color: '#334155',
};

const helpTextStyle: React.CSSProperties = {
  fontSize: '0.73rem',
  color: '#64748b',
  lineHeight: 1.45,
};

const inputStyle: React.CSSProperties = {
  padding: '8px 10px',
  border: '1px solid #dbe2ea',
  borderRadius: 8,
  fontSize: '0.84rem',
  color: '#0f172a',
  outline: 'none',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: 86,
  resize: 'vertical',
  fontFamily: 'inherit',
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '0.86rem',
  fontWeight: 800,
  color: '#0f172a',
};

const footerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '12px 20px',
  borderTop: '1px solid #e2e8f0',
};

const ghostButtonStyle: React.CSSProperties = {
  padding: '8px 14px',
  fontSize: '0.82rem',
  fontWeight: 700,
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  background: '#fff',
  color: '#334155',
  cursor: 'pointer',
};

const primaryButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  fontSize: '0.82rem',
  fontWeight: 800,
  border: 'none',
  borderRadius: 8,
  background: '#123b63',
  color: '#fff',
  cursor: 'pointer',
};

const previewCardStyle: React.CSSProperties = {
  display: 'grid',
  gap: 8,
  padding: 12,
  border: '1px solid #dbe2ea',
  borderRadius: 8,
  background: '#f8fafc',
};

const checkboxGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
  gap: 8,
};

const checkboxRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 8,
  padding: '9px 10px',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  background: '#f8fafc',
  fontSize: '0.78rem',
  color: '#334155',
};

const formActionsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 8,
  alignItems: 'center',
};

const tabBarStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  padding: '10px 20px',
  borderBottom: '1px solid #e2e8f0',
  background: '#f8fafc',
};

const tabButtonStyle = (active: boolean): React.CSSProperties => ({
  border: '1px solid',
  borderColor: active ? '#123b63' : '#cbd5e1',
  borderRadius: 8,
  background: active ? '#123b63' : '#fff',
  color: active ? '#fff' : '#334155',
  cursor: 'pointer',
  fontSize: '0.78rem',
  fontWeight: 800,
  padding: '7px 10px',
});

function counterColor(length: number, min: number, max: number): string {
  if (length === 0) return '#dc2626';
  if (length < min || length > max) return '#d97706';
  return '#16a34a';
}

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
  locale: string;
}): Pick<SeoFormState, 'title' | 'description' | 'ogTitle' | 'ogDescription' | 'twitterTitle' | 'twitterDescription'> {
  const pageTitle = input.page?.title[input.locale] || input.page?.title.ko || input.form.slug || 'Page';
  const heading = findPrimaryHeading(input.document) || pageTitle;
  const siteName = input.siteName || '호정국제';
  const texts = collectPageText(input.document);
  const body = texts.filter((item) => item !== heading).join(' ');
  const baseTitle = fitText(`${heading} | ${siteName}`, SEO_TITLE_MAX);
  const descriptionSource = body || `${heading} 페이지입니다. ${siteName}의 주요 서비스와 상담 정보를 확인할 수 있습니다.`;
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

function fieldCounter(value: string, min: number, max: number) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: '0.72rem' }}>
      <span style={helpTextStyle}>권장 {min}-{max}자</span>
      <strong style={{ color: counterColor(value.trim().length, min, max) }}>
        {value.trim().length}/{max}
      </strong>
    </div>
  );
}

function issueTone(issue: BuilderSeoValidationIssue): React.CSSProperties {
  if (issue.severity === 'blocker') return { color: '#dc2626', borderColor: '#fecaca', background: '#fef2f2' };
  if (issue.severity === 'warning') return { color: '#b45309', borderColor: '#fed7aa', background: '#fff7ed' };
  return { color: '#0369a1', borderColor: '#bae6fd', background: '#f0f9ff' };
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
  locale: string;
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
  const panelRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const closingRef = useRef(false);

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
      setError('현재 선택된 페이지가 없습니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/builder/site/pages/${pageId}/seo?locale=${encodeURIComponent(locale)}`,
        { credentials: 'same-origin' },
      );
      const payload = (await response.json().catch(() => ({}))) as SeoResponse;

      if (!response.ok) {
        setError(payload.error || 'SEO 메타데이터를 불러오지 못했습니다.');
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
      setError('SEO 메타데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [fetchAssistant, locale, pageId]);

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
    setAssistantStatus('저장 중...');
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
        setAssistantStatus(payload.error || 'Assistant 저장 실패');
        return;
      }
      setAssistantTasks(payload.tasks ?? []);
      setAssistantStatus('저장됨');
    } catch {
      setAssistantStatus('Assistant 저장 실패');
    }
  };

  const handleSave = async () => {
    if (!pageId) {
      setError('현재 선택된 페이지가 없습니다.');
      return;
    }

    setSaving(true);
    setError(null);

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
        setError(payload.error || 'SEO 메타데이터를 저장하지 못했습니다.');
        return;
      }

      setPage(payload.page ?? page);
      setDefaults(payload.defaults ?? defaults);
      setServerIssues(payload.validation ?? []);
      if (payload.page) onSaved?.(payload.page);
      closePanel();
    } catch {
      setError('SEO 메타데이터를 저장하지 못했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const canonicalPreview = form.canonical.trim() || defaults?.canonical || `/${locale}/${form.slug}`;
  const publicPathPreview = defaults?.publicPath || `/${locale}${form.slug ? `/${form.slug}` : ''}`;
  const searchTitle = truncatePreview(form.title.trim() || page?.title[locale] || page?.title.ko || '페이지 제목', 62);
  const searchDescription = truncatePreview(form.description.trim() || '검색 결과에 표시될 페이지 설명을 입력하세요.', 160);
  const socialTitle = truncatePreview(form.ogTitle.trim() || form.title.trim() || 'Untitled page', 80);
  const socialDescription = truncatePreview(form.ogDescription.trim() || form.description.trim() || '소셜 공유 설명을 입력하세요.', 150);
  const socialImage = form.ogImage.trim() || form.twitterImage.trim();
  const blockers = localIssues.filter((issue) => issue.severity === 'blocker').length;
  const warnings = localIssues.filter((issue) => issue.severity === 'warning').length;

  return (
    <div
      style={backdropStyle}
      onClick={(event) => {
        if (event.target === event.currentTarget) closePanel();
      }}
    >
      <div
        ref={panelRef}
        style={panelStyle}
        role="dialog"
        aria-modal="true"
        aria-label="페이지 SEO"
        tabIndex={-1}
        data-builder-seo-panel-dialog="true"
        onKeyDownCapture={handlePanelKeyDown}
      >
        <div style={headerStyle}>
          <div style={{ display: 'grid', gap: 3, minWidth: 0 }}>
            <strong style={{ fontSize: '1rem', color: '#0f172a' }}>페이지 SEO</strong>
            <span style={helpTextStyle}>
              {publicPathPreview} · blocker {blockers} · warning {warnings}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" style={ghostButtonStyle} onClick={applyRecommendation}>
              추천 적용
            </button>
            <button type="button" style={ghostButtonStyle} onClick={closePanel}>
              닫기
            </button>
          </div>
        </div>

        <div style={tabBarStyle}>
          {[
            ['basics', 'Basics'],
            ['social', 'Social share'],
            ['advanced', 'Advanced'],
            ['hreflang', 'Hreflang & Sitemap'],
            ['assistant', 'Assistant'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              style={tabButtonStyle(activeTab === key)}
              onClick={() => setActiveTab(key as SeoPanelTab)}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={formStyle}>
          {loading ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#64748b', fontSize: '0.86rem' }}>
              로딩 중...
            </div>
          ) : (
            <>
              <section style={{ ...sectionStyle, display: activeTab === 'basics' ? 'grid' : 'none' }}>
                <h3 style={sectionTitleStyle}>기본 검색 설정</h3>
                <div style={twoColumnStyle}>
                  <div style={fieldStyle}>
                    <label style={labelStyle} htmlFor="builder-seo-slug">Slug</label>
                    <input
                      id="builder-seo-slug"
                      type="text"
                      value={form.slug}
                      disabled={Boolean(page?.isHomePage)}
                      placeholder="page-slug"
                      style={inputStyle}
                      onChange={(event) => updateField('slug', event.target.value)}
                    />
                    <span style={helpTextStyle}>최종 public URL은 /{locale}/{form.slug || ''} 입니다.</span>
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle} htmlFor="builder-seo-canonical">Canonical URL</label>
                    <input
                      id="builder-seo-canonical"
                      type="url"
                      value={form.canonical}
                      placeholder={defaults?.canonical || 'https://example.com/page'}
                      style={inputStyle}
                      onChange={(event) => updateField('canonical', event.target.value)}
                    />
                    <span style={helpTextStyle}>비우면 기본 public URL을 canonical로 사용합니다.</span>
                  </div>
                </div>
                {!page?.isHomePage && page && page.slug !== form.slug ? (
                  <label style={checkboxRowStyle}>
                    <input
                      type="checkbox"
                      checked={createRedirect}
                      onChange={(event) => setCreateRedirect(event.target.checked)}
                    />
                    <span><strong>301 redirect 생성</strong><br />저장 시 기존 URL /{locale}/{page.slug}에서 새 URL로 이동 규칙을 추가합니다.</span>
                  </label>
                ) : null}

                <div style={fieldStyle}>
                  <label style={labelStyle} htmlFor="builder-seo-title">SEO title</label>
                  <input
                    id="builder-seo-title"
                    type="text"
                    value={form.title}
                    placeholder="예: 국제 소송 전문 로펌 | 호정국제"
                    style={inputStyle}
                    onChange={(event) => updateField('title', event.target.value)}
                  />
                  {fieldCounter(form.title, SEO_TITLE_MIN, SEO_TITLE_MAX)}
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle} htmlFor="builder-seo-description">Meta description</label>
                  <textarea
                    id="builder-seo-description"
                    value={form.description}
                    placeholder="검색 결과에 노출할 페이지 설명을 입력하세요."
                    style={textareaStyle}
                    onChange={(event) => updateField('description', event.target.value)}
                  />
                  {fieldCounter(form.description, SEO_DESCRIPTION_MIN, SEO_DESCRIPTION_MAX)}
                </div>

                <div style={checkboxGridStyle}>
                  <label style={checkboxRowStyle}>
                    <input
                      type="checkbox"
                      checked={form.noIndex}
                      onChange={(event) => updateField('noIndex', event.target.checked)}
                    />
                    <span><strong>noindex</strong><br />검색 결과에서 제외합니다.</span>
                  </label>
                  <label style={checkboxRowStyle}>
                    <input
                      type="checkbox"
                      checked={form.noFollow}
                      onChange={(event) => updateField('noFollow', event.target.checked)}
                    />
                    <span><strong>nofollow</strong><br />페이지 링크 신호 전달을 막습니다.</span>
                  </label>
                </div>
              </section>

              <section style={{ ...sectionStyle, display: activeTab === 'basics' ? 'grid' : 'none' }}>
                <h3 style={sectionTitleStyle}>Google preview</h3>
                <div style={previewCardStyle}>
                  <div style={{ color: '#202124', fontSize: '0.74rem', wordBreak: 'break-all' }}>{canonicalPreview}</div>
                  <div style={{ color: '#1a0dab', fontSize: '1rem', lineHeight: 1.3 }}>{searchTitle}</div>
                  <div style={{ color: '#4d5156', fontSize: '0.8rem', lineHeight: 1.45 }}>{searchDescription}</div>
                </div>
              </section>

              <section style={{ ...sectionStyle, display: activeTab === 'social' ? 'grid' : 'none' }}>
                <h3 style={sectionTitleStyle}>소셜 공유 설정</h3>
                <div style={twoColumnStyle}>
                  <div style={fieldStyle}>
                    <label style={labelStyle} htmlFor="builder-seo-og-title">OG title</label>
                    <input
                      id="builder-seo-og-title"
                      type="text"
                      value={form.ogTitle}
                      placeholder="비우면 SEO title 사용"
                      style={inputStyle}
                      onChange={(event) => updateField('ogTitle', event.target.value)}
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle} htmlFor="builder-seo-og-image">OG image URL</label>
                    <input
                      id="builder-seo-og-image"
                      type="url"
                      value={form.ogImage}
                      placeholder="https://example.com/og-image.png"
                      style={inputStyle}
                      onChange={(event) => updateField('ogImage', event.target.value)}
                    />
                  </div>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle} htmlFor="builder-seo-og-description">OG description</label>
                  <textarea
                    id="builder-seo-og-description"
                    value={form.ogDescription}
                    placeholder="비우면 meta description 사용"
                    style={textareaStyle}
                    onChange={(event) => updateField('ogDescription', event.target.value)}
                  />
                </div>

                <div style={twoColumnStyle}>
                  <div style={fieldStyle}>
                    <label style={labelStyle} htmlFor="builder-seo-twitter-card">Twitter card</label>
                    <select
                      id="builder-seo-twitter-card"
                      value={form.twitterCard}
                      style={inputStyle}
                      onChange={(event) => updateField('twitterCard', event.target.value as SeoFormState['twitterCard'])}
                    >
                      <option value="summary_large_image">summary_large_image</option>
                      <option value="summary">summary</option>
                    </select>
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle} htmlFor="builder-seo-twitter-image">Twitter image URL</label>
                    <input
                      id="builder-seo-twitter-image"
                      type="url"
                      value={form.twitterImage}
                      placeholder="비우면 OG image 사용"
                      style={inputStyle}
                      onChange={(event) => updateField('twitterImage', event.target.value)}
                    />
                  </div>
                </div>
                <div style={twoColumnStyle}>
                  <div style={fieldStyle}>
                    <label style={labelStyle} htmlFor="builder-seo-twitter-title">Twitter title</label>
                    <input
                      id="builder-seo-twitter-title"
                      type="text"
                      value={form.twitterTitle}
                      placeholder="비우면 OG/SEO title 사용"
                      style={inputStyle}
                      onChange={(event) => updateField('twitterTitle', event.target.value)}
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle} htmlFor="builder-seo-twitter-description">Twitter description</label>
                    <input
                      id="builder-seo-twitter-description"
                      type="text"
                      value={form.twitterDescription}
                      placeholder="비우면 OG/meta description 사용"
                      style={inputStyle}
                      onChange={(event) => updateField('twitterDescription', event.target.value)}
                    />
                  </div>
                </div>

                <h4 style={{ ...sectionTitleStyle, fontSize: '0.78rem' }}>OG image preview</h4>
                <div style={previewCardStyle}>
                  <div style={{ display: 'grid', gridTemplateColumns: '160px minmax(0, 1fr)', gap: 12, alignItems: 'center' }}>
                    <div style={{ height: 84, borderRadius: 8, background: '#e2e8f0', overflow: 'hidden', display: 'grid', placeItems: 'center', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>
                      {socialImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={socialImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        'No image'
                      )}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>{socialTitle}</div>
                      <div style={{ ...helpTextStyle, marginTop: 5 }}>{socialDescription}</div>
                    </div>
                  </div>
                </div>
              </section>

              <section style={{ ...sectionStyle, display: activeTab === 'advanced' ? 'grid' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <div>
                    <h3 style={sectionTitleStyle}>Advanced SEO meta tags</h3>
                    <span style={helpTextStyle}>Wix Advanced SEO의 additional meta tags에 해당합니다. name/content meta tag로 public head에 반영됩니다.</span>
                  </div>
                  <button type="button" style={ghostButtonStyle} onClick={addAdditionalMetaTag}>
                    + Meta
                  </button>
                </div>
                {form.additionalMetaTags.length === 0 ? (
                  <div style={{ ...previewCardStyle, color: '#64748b', fontSize: '0.78rem' }}>
                    Additional meta tag가 없습니다.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 8 }}>
                    {form.additionalMetaTags.map((tag) => (
                      <div
                        key={tag.id}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'minmax(120px, 0.8fr) minmax(180px, 1.2fr) auto',
                          gap: 8,
                          alignItems: 'center',
                        }}
                      >
                        <input
                          type="text"
                          value={tag.name}
                          placeholder="meta name"
                          style={inputStyle}
                          onChange={(event) => updateAdditionalMetaTag(tag.id, 'name', event.target.value)}
                        />
                        <input
                          type="text"
                          value={tag.content}
                          placeholder="meta content"
                          style={inputStyle}
                          onChange={(event) => updateAdditionalMetaTag(tag.id, 'content', event.target.value)}
                        />
                        <button type="button" style={ghostButtonStyle} onClick={() => removeAdditionalMetaTag(tag.id)}>
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section style={{ ...sectionStyle, display: activeTab === 'advanced' ? 'grid' : 'none' }}>
                <h3 style={sectionTitleStyle}>구조화 데이터</h3>
                <div style={checkboxGridStyle}>
                  <label style={checkboxRowStyle}>
                    <input
                      type="checkbox"
                      checked={form.structuredData.legalService}
                      onChange={(event) => updateStructuredField('legalService', event.target.checked)}
                    />
                    <span>LegalService</span>
                  </label>
                  <label style={checkboxRowStyle}>
                    <input
                      type="checkbox"
                      checked={form.structuredData.organization}
                      onChange={(event) => updateStructuredField('organization', event.target.checked)}
                    />
                    <span>Organization</span>
                  </label>
                  <label style={checkboxRowStyle}>
                    <input
                      type="checkbox"
                      checked={form.structuredData.localBusiness}
                      onChange={(event) => updateStructuredField('localBusiness', event.target.checked)}
                    />
                    <span>LocalBusiness</span>
                  </label>
                  <label style={checkboxRowStyle}>
                    <input
                      type="checkbox"
                      checked={form.structuredData.breadcrumbList}
                      onChange={(event) => updateStructuredField('breadcrumbList', event.target.checked)}
                    />
                    <span>BreadcrumbList</span>
                  </label>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle} htmlFor="builder-seo-faq-schema">FAQPage</label>
                  <select
                    id="builder-seo-faq-schema"
                    value={form.structuredData.faqPage}
                    style={inputStyle}
                    onChange={(event) => updateStructuredField('faqPage', event.target.value as 'auto' | 'off')}
                  >
                    <option value="auto">FAQ widgets에서 자동 생성</option>
                    <option value="off">끄기</option>
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <div>
                    <h4 style={{ ...sectionTitleStyle, fontSize: '0.78rem' }}>JSON-LD blocks</h4>
                    <span style={helpTextStyle}>Article, FAQPage 같은 schema.org 블록을 페이지별로 저장합니다.</span>
                  </div>
                  <button type="button" style={ghostButtonStyle} onClick={() => addStructuredDataBlock('Article')}>
                    + Article
                  </button>
                </div>
                {form.structuredDataBlocks.length === 0 ? (
                  <div style={{ ...previewCardStyle, color: '#64748b', fontSize: '0.78rem' }}>
                    추가 JSON-LD 블록이 없습니다.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 8 }}>
                    {form.structuredDataBlocks.map((block) => (
                      <div key={block.id} style={previewCardStyle}>
                        <div style={twoColumnStyle}>
                          <label style={fieldStyle}>
                            <span style={labelStyle}>Type</span>
                            <select
                              value={block.type}
                              style={inputStyle}
                              onChange={(event) => changeStructuredDataBlockType(
                                block.id,
                                event.target.value as BuilderStructuredDataBlockType,
                              )}
                            >
                              {STRUCTURED_DATA_BLOCK_TYPES.map((option) => (
                                <option key={option.type} value={option.type}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label style={fieldStyle}>
                            <span style={labelStyle}>Label</span>
                            <input
                              type="text"
                              value={block.label ?? ''}
                              style={inputStyle}
                              onChange={(event) => updateStructuredDataBlock(block.id, { label: event.target.value })}
                            />
                          </label>
                        </div>
                        <textarea
                          value={block.json ?? ''}
                          style={textareaStyle}
                          rows={5}
                          onChange={(event) => updateStructuredDataBlock(block.id, { json: event.target.value })}
                        />
                        <div style={formActionsStyle}>
                          <label style={{ ...checkboxRowStyle, marginRight: 'auto' }}>
                            <input
                              type="checkbox"
                              checked={block.enabled}
                              onChange={(event) => updateStructuredDataBlock(block.id, { enabled: event.target.checked })}
                            />
                            <span>사용</span>
                          </label>
                          <span style={helpTextStyle}>{block.type}</span>
                          <button type="button" style={ghostButtonStyle} onClick={() => removeStructuredDataBlock(block.id)}>
                            삭제
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section style={{ ...sectionStyle, display: activeTab === 'hreflang' ? 'grid' : 'none' }}>
                <div>
                  <h3 style={sectionTitleStyle}>Hreflang 대체 링크</h3>
                  <span style={helpTextStyle}>
                    Google에 노출되는 alternate-language URL 세트입니다. linkedPageIds(다국어 연결) 기반으로 생성되며,
                    x-default 항목은 기본 로케일을 가리킵니다.
                  </span>
                </div>
                {hreflangAlternates.length === 0 ? (
                  <div style={{ ...previewCardStyle, color: '#64748b' }}>
                    아직 발행되지 않았거나 hreflang 데이터가 비어 있습니다.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 6 }}>
                    {hreflangAlternates.map((alt) => (
                      <div
                        key={`${alt.hreflang}:${alt.href}`}
                        style={{
                          ...previewCardStyle,
                          display: 'grid',
                          gridTemplateColumns: '90px 1fr',
                          alignItems: 'center',
                          gap: 8,
                          fontSize: '0.78rem',
                        }}
                      >
                        <strong
                          style={{
                            color: alt.hreflang === 'x-default' ? '#0f766e' : '#0f172a',
                            fontFamily: 'ui-monospace, Menlo, monospace',
                          }}
                        >
                          {alt.hreflang}
                        </strong>
                        <span style={{ color: '#334155', wordBreak: 'break-all' }}>{alt.href}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: 8 }}>
                  <h3 style={sectionTitleStyle}>다국어 연결 페이지</h3>
                  <span style={helpTextStyle}>
                    BuilderPageMeta.linkedPageIds 에 등록된 형제 페이지입니다. 누락된 로케일은 페이지 설정에서 연결을 추가하세요.
                  </span>
                </div>
                {siblings.length === 0 ? (
                  <div style={{ ...previewCardStyle, color: '#64748b' }}>
                    연결된 다국어 페이지가 없습니다.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 6 }}>
                    {siblings.map((sibling) => (
                      <div
                        key={sibling.pageId}
                        style={{
                          ...previewCardStyle,
                          display: 'grid',
                          gridTemplateColumns: '90px 1fr auto',
                          alignItems: 'center',
                          gap: 8,
                          fontSize: '0.78rem',
                        }}
                      >
                        <strong style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{sibling.hreflang}</strong>
                        <span style={{ color: '#334155' }}>/{sibling.locale}/{sibling.slug || ''}</span>
                        <span
                          style={{
                            ...helpTextStyle,
                            color: sibling.noIndex ? '#b45309' : '#15803d',
                            fontWeight: 700,
                          }}
                        >
                          {sibling.noIndex ? 'noindex' : 'indexed'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {missingLocales.length > 0 ? (
                  <div
                    style={{
                      ...previewCardStyle,
                      background: '#fef3c7',
                      borderColor: '#fcd34d',
                      color: '#92400e',
                      fontSize: '0.78rem',
                    }}
                  >
                    <strong>누락된 로케일: </strong>
                    {missingLocales.join(', ')} — 페이지 설정에서 해당 로케일 페이지를 연결하세요.
                  </div>
                ) : null}

                <div style={{ marginTop: 8 }}>
                  <h3 style={sectionTitleStyle}>Sitemap 포함 상태</h3>
                  <span style={helpTextStyle}>
                    /sitemap.xml 에 이 페이지가 포함되는지 여부입니다. noIndex 설정 시 sitemap 에서도 제외됩니다.
                  </span>
                </div>
                <div
                  style={{
                    ...previewCardStyle,
                    color: sitemapIncluded ? '#065f46' : '#7c2d12',
                    background: sitemapIncluded ? '#ecfdf5' : '#fef2f2',
                    borderColor: sitemapIncluded ? '#a7f3d0' : '#fecaca',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  <strong>{sitemapIncluded ? 'Sitemap 포함됨' : 'Sitemap 제외'}</strong>
                  <span style={helpTextStyle}>
                    {sitemapIncluded ? '검색엔진 크롤 가능' : 'noIndex로 인해 색인 차단'}
                  </span>
                </div>
              </section>

              <section style={{ ...sectionStyle, display: activeTab === 'assistant' ? 'grid' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <div>
                    <h3 style={sectionTitleStyle}>SEO Assistant</h3>
                    <span style={helpTextStyle}>포커스 키워드와 자동 점검 항목을 관리합니다.</span>
                  </div>
                  <button type="button" style={ghostButtonStyle} onClick={saveFocusKeyword}>
                    키워드 저장
                  </button>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle} htmlFor="builder-seo-focus-keyword">Focus keyword</label>
                  <input
                    id="builder-seo-focus-keyword"
                    type="text"
                    value={form.focusKeyword}
                    style={inputStyle}
                    onChange={(event) => updateField('focusKeyword', event.target.value)}
                  />
                </div>
                {assistantStatus ? (
                  <div style={{ ...helpTextStyle, color: assistantStatus.includes('실패') ? '#dc2626' : '#15803d' }}>
                    {assistantStatus}
                  </div>
                ) : null}
                {assistantTasks.length === 0 ? (
                  <div style={{ ...previewCardStyle, color: '#64748b', fontSize: '0.78rem' }}>
                    Assistant 점검 항목이 없습니다.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 8 }}>
                    {assistantTasks.map((task) => (
                      <div key={task.id} style={previewCardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                          <strong style={{ color: '#0f172a', fontSize: '0.82rem' }}>{task.label}</strong>
                          <span style={helpTextStyle}>{task.severity} · {task.status}</span>
                        </div>
                        <div style={helpTextStyle}>{task.field}: {task.detail}</div>
                        {task.applyHint ? <div style={helpTextStyle}>{task.applyHint}</div> : null}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section style={{ ...sectionStyle, display: activeTab === 'assistant' ? 'grid' : 'none' }}>
                <h3 style={sectionTitleStyle}>검증</h3>
                {localIssues.length === 0 ? (
                  <div style={{ ...previewCardStyle, color: '#15803d', fontWeight: 800 }}>
                    SEO 검사 통과
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 8 }}>
                    {localIssues.map((issue) => (
                      <div
                        key={issue.id}
                        style={{
                          ...issueTone(issue),
                          border: '1px solid',
                          borderRadius: 8,
                          padding: '9px 10px',
                          fontSize: '0.78rem',
                          lineHeight: 1.45,
                        }}
                      >
                        <strong>{issue.severity.toUpperCase()} · {issue.field}</strong>
                        <div>{issue.message}</div>
                        {issue.fixHint ? <div>{issue.fixHint}</div> : null}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>

        <div style={footerStyle}>
          <span style={{ minHeight: 18, color: '#dc2626', fontSize: '0.78rem' }}>{error ?? ''}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" style={ghostButtonStyle} onClick={closePanel}>
              취소
            </button>
            <button
              type="button"
              style={primaryButtonStyle}
              onClick={handleSave}
              disabled={saving || loading || !pageId}
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
