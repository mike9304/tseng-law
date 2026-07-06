'use client';

// allow: SIZE_OK - pre-existing composite dispatcher; videos parity only registers legacy-page-videos.
import type { BuilderCompositeCanvasNode } from '@/lib/builder/canvas/types';
import PageHeader from '@/components/PageHeader';
import HeroSearch from '@/components/HeroSearch';
import ServicesBento from '@/components/ServicesBento';
import HomeContactCta from '@/components/HomeContactCta';
import InsightsArchiveSection from '@/components/InsightsArchiveSection';
import HomeAttorneySplit from '@/components/HomeAttorneySplit';
import HomeCaseResultsSplit from '@/components/HomeCaseResultsSplit';
import HomeStatsSection from '@/components/HomeStatsSection';
import FAQAccordion from '@/components/FAQAccordion';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import FaqPublicExplorer from '@/components/faq/FaqPublicExplorer';
import {
  AboutLegacyPageBody,
  ServicesLegacyPageBody,
  ContactLegacyPageBody,
  LawyersLegacyPageBody,
  PricingLegacyPageBody,
  ReviewsLegacyPageBody,
  ColumnsLegacyPageBody,
  VideosLegacyPageBody,
  PrivacyLegacyPageBody,
  DisclaimerLegacyPageBody,
} from '@/app/[locale]/(legacy)/legacy-page-bodies';
import type { Locale } from '@/lib/locales';
import type { ColumnPost } from '@/lib/columns';
import { insightsArchive } from '@/data/insights-archive';
import { faqContent } from '@/data/faq-content';
import { pageCopy } from '@/data/page-copy';
import {
  DEFAULT_FAQ_CATEGORIES,
  getFaqCategoryLabel,
  sortFaqItems,
  type BuilderFaqCategory,
  type BuilderFaqItem,
} from '@/lib/builder/faq/faq-shared';
import { BuilderSurfaceProvider } from '@/lib/builder/surface-context';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import { useEffect, useRef } from 'react';
import { useBuilderDatasetPreviewTargets } from '@/components/builder/canvas/BuilderDatasetPreviewContext';
import type { BuilderDataBindingPreviewTarget } from '@/lib/builder/datasets';

type DatasetPreviewTargets = readonly BuilderDataBindingPreviewTarget[];

type InsightsSectionPost = {
  slug: string;
  title: string;
  date: string;
  dateDisplay: string;
  readTime: string;
  categoryLabel: string;
  featuredImage: string;
  summary: string;
};

function resolveLocale(config: Record<string, unknown> | undefined): Locale {
  const raw = config?.locale;
  if (raw === 'ko' || raw === 'zh-hant' || raw === 'en') return raw;
  return 'ko';
}

function resolveInsightsPreviewPosts(
  targets: DatasetPreviewTargets,
): InsightsSectionPost[] {
  const target = targets.find((candidate) => candidate.targetId === 'home.insights.feed');
  if (!target?.records.length) return [];

  return target.records.flatMap((record) => {
    const fields = record.fieldValues;
    const slug = fields.slug || record.recordId;
    const title = fields.title || record.primaryLabel;
    const featuredImage = fields.featuredImage || fields.image || fields.src;
    if (!slug || !title || !featuredImage) return [];

    return [{
      slug,
      title,
      date: fields.date ?? '',
      dateDisplay: fields.dateDisplay || fields.date || '',
      readTime: fields.readTime ?? '',
      categoryLabel: fields.categoryLabel ?? '',
      featuredImage,
      summary: fields.summary || record.secondaryLabel || '',
    }];
  });
}

function mapColumnPostsToInsightsPosts(posts: readonly ColumnPost[]): InsightsSectionPost[] {
  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    dateDisplay: post.dateDisplay || post.date,
    readTime: post.readTime,
    categoryLabel: post.categoryLabel,
    featuredImage: post.featuredImage,
    summary: post.summary,
  }));
}

function resolveInsightsPosts(
  locale: Locale,
  previewTargets: DatasetPreviewTargets,
  columnPosts: readonly ColumnPost[],
  _mode: 'edit' | 'preview' | 'published',
): InsightsSectionPost[] {
  if (columnPosts.length > 0) {
    return mapColumnPostsToInsightsPosts(columnPosts);
  }

  const previewPosts = resolveInsightsPreviewPosts(previewTargets);
  if (previewPosts.length > 0) return previewPosts;

  const archive = insightsArchive[locale === 'en' ? 'ko' : locale];
  if (!archive) return [];
  return archive.posts.map((post) => ({
    slug: post.id,
    title: post.title,
    date: post.date ?? '',
    dateDisplay: post.date ?? '',
    readTime: post.readTime ?? '',
    categoryLabel: archive.categories[post.category] ?? '',
    featuredImage: post.image,
    summary: post.summary,
  }));
}

function slugifyFallbackFaqQuestion(question: string): string {
  const slug = question
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9가-힣一-龥ぁ-んァ-ン]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return slug || 'faq';
}

function fallbackFaqItems(locale: Locale): BuilderFaqItem[] {
  return sortFaqItems(faqContent[locale].map((item, index) => {
    const category = DEFAULT_FAQ_CATEGORIES[index] ?? DEFAULT_FAQ_CATEGORIES[DEFAULT_FAQ_CATEGORIES.length - 1];
    const categoryId = category?.categoryId ?? 'consultation';
    return {
      faqId: `fallback-${locale}-${index + 1}`,
      slug: slugifyFallbackFaqQuestion(item.question),
      locale,
      question: item.question,
      answer: item.answer,
      categoryId,
      tags: [getFaqCategoryLabel(categoryId, locale)],
      status: 'published',
      sortOrder: (index + 1) * 10,
      schemaEnabled: true,
      createdAt: '2026-05-20T00:00:00.000Z',
      updatedAt: '2026-05-20T00:00:00.000Z',
    };
  }));
}

export function compositeFallbackCopy(locale: Locale): {
  insightsUnavailable: string;
  missingTitle: string;
  missingDescription: string;
} {
  if (locale === 'zh-hant') {
    return {
      insightsUnavailable: '無法載入專欄資料。',
      missingTitle: 'Composite registry 未註冊',
      missingDescription: '新的 composite kind 必須加入 components/composite/Render.tsx 的 switch。',
    };
  }
  if (locale === 'en') {
    return {
      insightsUnavailable: 'Insights data unavailable.',
      missingTitle: 'Composite registry missing',
      missingDescription: 'Add the new composite kind to the switch in components/composite/Render.tsx.',
    };
  }
  return {
    insightsUnavailable: '칼럼 데이터를 불러올 수 없습니다.',
    missingTitle: 'Composite registry 누락',
    missingDescription: '새 composite kind가 components/composite/Render.tsx switch에 추가되어야 합니다.',
  };
}

export default function CompositeRender({
  node,
  datasetPreviewTargets,
  columnPosts = [],
  faqCategories = DEFAULT_FAQ_CATEGORIES,
  faqItems,
  searchParams,
  mode = 'edit',
}: {
  node: BuilderCompositeCanvasNode;
  datasetPreviewTargets?: DatasetPreviewTargets;
  columnPosts?: ColumnPost[];
  faqCategories?: BuilderFaqCategory[];
  faqItems?: BuilderFaqItem[];
  searchParams?: Record<string, string | string[] | undefined>;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const { componentKey, config } = node.content;
  const locale = resolveLocale(config);
  const contextDatasetPreviewTargets = useBuilderDatasetPreviewTargets();
  const effectiveDatasetPreviewTargets = datasetPreviewTargets ?? contextDatasetPreviewTargets;
  const interactive = mode !== 'edit';
  const fallbackCopy = compositeFallbackCopy(locale);

  const body = (() => {
    switch (componentKey) {
      case 'hero-search':
        return <HeroSearch locale={locale} scrollHref={mode === 'edit' ? `/${locale}#insights` : undefined} />;
      case 'services-bento':
        return <ServicesBento locale={locale} id="practice" />;
      case 'home-contact-cta':
        return <HomeContactCta locale={locale} />;
      case 'insights-archive': {
        const posts = resolveInsightsPosts(locale, effectiveDatasetPreviewTargets, columnPosts, mode);
        if (posts.length === 0) {
          return (
            <div style={{ padding: 24, color: '#94a3b8', fontSize: 13 }}>
              {fallbackCopy.insightsUnavailable}
            </div>
          );
        }
        return <InsightsArchiveSection locale={locale} posts={posts} />;
      }
      case 'home-attorney':
        return <HomeAttorneySplit locale={locale} />;
      case 'home-case-results':
        return <HomeCaseResultsSplit locale={locale} />;
      case 'home-stats':
        return <HomeStatsSection locale={locale} />;
      case 'faq-accordion':
        return (
          <FAQAccordion
            locale={locale}
            items={faqContent[locale]}
            id="faq"
            sectionClassName="section section--gray"
          />
        );
      case 'office-map-tabs':
        return (
          <OfficeMapTabs
            locale={locale}
            id="offices"
            sectionClassName="section section--light"
          />
        );
      case 'legacy-page-about':
        return <AboutLegacyPageBody locale={locale} />;
      case 'legacy-page-services':
        return <ServicesLegacyPageBody locale={locale} />;
      case 'legacy-page-contact':
        return <ContactLegacyPageBody locale={locale} />;
      case 'legacy-page-lawyers':
        return <LawyersLegacyPageBody locale={locale} />;
      case 'legacy-page-faq': {
        const copy = pageCopy[locale].faq;
        return (
          <>
            <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
            <FaqPublicExplorer
              locale={locale}
              categories={faqCategories}
              items={faqItems ?? fallbackFaqItems(locale)}
              initialCategory={typeof searchParams?.category === 'string' ? searchParams.category : undefined}
              initialQuery={typeof searchParams?.q === 'string' ? searchParams.q : undefined}
            />
          </>
        );
      }
      case 'legacy-page-pricing':
        return <PricingLegacyPageBody locale={locale} />;
      case 'legacy-page-reviews':
        return <ReviewsLegacyPageBody locale={locale} />;
      case 'legacy-page-columns':
        return <ColumnsLegacyPageBody locale={locale} posts={columnPosts} searchParams={searchParams} />;
      case 'legacy-page-videos':
        return <VideosLegacyPageBody locale={locale} columnCount={columnPosts.length} />;
      case 'legacy-page-privacy':
        return <PrivacyLegacyPageBody locale={locale} />;
      case 'legacy-page-disclaimer':
        return <DisclaimerLegacyPageBody locale={locale} />;
      default:
        // Visible diagnostic so a designer notices the missing wiring; the
        // canvas error boundary keeps siblings rendering.
        return (
          <div
            role="alert"
            style={{
              padding: 24,
              color: '#b91c1c',
              fontSize: 12,
              border: '1.5px dashed #f87171',
              background: 'rgba(254, 226, 226, 0.45)',
              borderRadius: 8,
            }}
          >
            <strong>{fallbackCopy.missingTitle}</strong>
            <div style={{ marginTop: 4, fontFamily: 'ui-monospace, Menlo, monospace' }}>{componentKey}</div>
            <div style={{ marginTop: 4, color: '#7f1d1d' }}>
              {fallbackCopy.missingDescription}
            </div>
          </div>
        );
    }
  })();

  const wrapperStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '100%',
    overflow: 'visible',
    position: 'relative',
  };

  const overrides =
    (config?.overrides as Record<string, string> | undefined) ?? {};
  const selectedNodeId = useBuilderCanvasStore((s) => s.selectedNodeId);
  const selectedSurfaceKey = useBuilderCanvasStore((s) => s.selectedSurfaceKey);
  const setSelectedSurfaceKey = useBuilderCanvasStore((s) => s.setSelectedSurfaceKey);
  const isCompositeSelected = selectedNodeId === node.id;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode !== 'edit') return;
    const root = containerRef.current;
    if (!root) return;
    const previouslyOutlined = root.querySelectorAll<HTMLElement>(
      '[data-builder-surface-outline="true"]',
    );
    previouslyOutlined.forEach((el) => {
      el.style.outline = '';
      el.style.outlineOffset = '';
      el.removeAttribute('data-builder-surface-outline');
    });
    if (!isCompositeSelected || !selectedSurfaceKey) return;
    const target = root.querySelector<HTMLElement>(
      `[data-builder-surface-key="${CSS.escape(selectedSurfaceKey)}"]`,
    );
    if (target) {
      target.style.outline = '2px solid #2563eb';
      target.style.outlineOffset = '2px';
      target.setAttribute('data-builder-surface-outline', 'true');
    }
  }, [mode, isCompositeSelected, selectedSurfaceKey, body]);

  useEffect(() => {
    if (mode !== 'edit' || !isCompositeSelected || !selectedSurfaceKey) return;
    const root = containerRef.current;
    if (!root) return;
    const target = root.querySelector<HTMLElement>(
      `[data-builder-surface-key="${CSS.escape(selectedSurfaceKey)}"]`,
    );
    if (!target) return;

    const originalText = target.textContent ?? '';
    let committed = false;
    target.setAttribute('contenteditable', 'plaintext-only');
    target.setAttribute('data-builder-surface-editing', 'true');
    target.style.cursor = 'text';
    target.focus();
    const range = document.createRange();
    range.selectNodeContents(target);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);

    const commit = () => {
      if (committed) return;
      committed = true;
      const newText = (target.textContent ?? '').trim();
      cleanup();
      if (newText === originalText.trim()) return;
      const store = useBuilderCanvasStore.getState();
      const currentNode = store.document?.nodes.find((n) => n.id === node.id);
      if (!currentNode || currentNode.kind !== 'composite') return;
      const content = currentNode.content as { componentKey: string; config?: Record<string, unknown> };
      const nextConfig = { ...(content.config ?? {}) };
      const nextOverrides = { ...((nextConfig.overrides as Record<string, string> | undefined) ?? {}) };
      if (newText === '') {
        delete nextOverrides[selectedSurfaceKey];
      } else {
        nextOverrides[selectedSurfaceKey] = newText;
      }
      nextConfig.overrides = nextOverrides;
      store.updateNodeContent(node.id, {
        componentKey: content.componentKey,
        config: nextConfig,
      });
    };

    const revert = () => {
      if (committed) return;
      committed = true;
      target.textContent = originalText;
      cleanup();
    };

    const cleanup = () => {
      target.removeAttribute('contenteditable');
      target.removeAttribute('data-builder-surface-editing');
      target.style.cursor = '';
      target.removeEventListener('blur', commit);
      target.removeEventListener('keydown', keyHandler);
    };

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        commit();
        target.blur();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        revert();
        target.blur();
      }
    };

    target.addEventListener('blur', commit);
    target.addEventListener('keydown', keyHandler);

    return () => {
      if (!committed) commit();
    };
  }, [mode, isCompositeSelected, selectedSurfaceKey, node.id]);

  const handleWrapperClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'edit' || !isCompositeSelected) return;
    const elements = document.elementsFromPoint(event.clientX, event.clientY);
    const surfaceEl = elements.find((el) =>
      el instanceof HTMLElement && el.hasAttribute('data-builder-surface-key'),
    ) as HTMLElement | undefined;
    if (!surfaceEl) {
      if (selectedSurfaceKey) setSelectedSurfaceKey(null);
      return;
    }
    const key = surfaceEl.getAttribute('data-builder-surface-key');
    if (!key) return;
    if (key === selectedSurfaceKey) return; // already editing this surface
    event.stopPropagation();
    event.preventDefault();
    setSelectedSurfaceKey(key);
  };

  return (
    <BuilderSurfaceProvider
      nodeId={node.id}
      mode={mode}
      overrides={overrides}
      selectedSurfaceKey={isCompositeSelected ? selectedSurfaceKey : null}
    >
      <div ref={containerRef} style={wrapperStyle} onClickCapture={handleWrapperClick}>
        {body}
        {!interactive && (
          <div
            data-composite-edit-overlay="true"
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              cursor: isCompositeSelected ? 'default' : 'move',
              background: 'transparent',
              pointerEvents: isCompositeSelected ? 'none' : 'auto',
            }}
          />
        )}
      </div>
    </BuilderSurfaceProvider>
  );
}
