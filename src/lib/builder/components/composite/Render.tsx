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
import ZhHantFaqShell from '@/components/zh-hant-faq/ZhHantFaqShell';
import EnFaqShell, { EnFaqGlance } from '@/components/en-design/EnFaqShell';
import { orderEnFaq } from '@/components/en-design/en-design-data';
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
import type { ColumnListItem } from '@/components/ColumnsGrid';
import { insightsArchive } from '@/data/insights-archive';
import { faqContent } from '@/data/faq-content';
import { pageCopy } from '@/data/page-copy';
import {
  DEFAULT_FAQ_CATEGORIES,
  getFaqCategoryLabel,
  sortFaqItems,
  slugifyFaqQuestion,
  type BuilderFaqCategory,
  type BuilderFaqItem,
} from '@/lib/builder/faq/faq-shared';
import { BuilderSurfaceProvider } from '@/lib/builder/surface-context';
import dynamic from 'next/dynamic';
import { useBuilderDatasetPreviewTargets } from '@/components/builder/canvas/BuilderDatasetPreviewContext';
import type { BuilderDataBindingPreviewTarget } from '@/lib/builder/datasets';

// Editor state must never enter the published page's initial client bundle.
const CompositeEditSurface = dynamic(() => import('./EditSurface'));

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
  topic?: ColumnListItem['topic'];
  publicationDate?: string;
  audience?: string[];
  aiAuthored?: boolean;
  columnNumber?: number;
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

function mapColumnListItemsToInsightsPosts(posts: readonly ColumnListItem[]): InsightsSectionPost[] {
  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    dateDisplay: post.dateDisplay || post.date,
    readTime: post.readTime,
    categoryLabel: post.categoryLabel,
    featuredImage: post.featuredImage,
    summary: post.summary,
    topic: post.topic,
    publicationDate: post.publicationDate,
    audience: post.audience,
    aiAuthored: post.aiAuthored,
      columnNumber: post.columnNumber,
  }));
}

function resolveInsightsPosts(
  locale: Locale,
  previewTargets: DatasetPreviewTargets,
  columnPosts: readonly ColumnListItem[],
  _mode: 'edit' | 'preview' | 'published',
): InsightsSectionPost[] {
  if (columnPosts.length > 0) {
    return mapColumnListItemsToInsightsPosts(columnPosts);
  }

  const previewPosts = resolveInsightsPreviewPosts(previewTargets);
  if (previewPosts.length > 0) return previewPosts;

  // Public published mode must not invent date-less archive cards.
  // Edit/preview may fall back to locale-correct archive data only.
  if (_mode === 'published') {
    return [];
  }

  const archive = insightsArchive[locale];
  if (!archive) return [];
  return archive.posts
    .filter((post) => Boolean(post.date))
    .map((post) => ({
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

function fallbackFaqItems(locale: Locale): BuilderFaqItem[] {
  return sortFaqItems(faqContent[locale].map((item, index) => {
    const category = DEFAULT_FAQ_CATEGORIES[index] ?? DEFAULT_FAQ_CATEGORIES[DEFAULT_FAQ_CATEGORIES.length - 1];
    const categoryId = category?.categoryId ?? 'consultation';
    return {
      faqId: `fallback-${locale}-${index + 1}`,
      slug: slugifyFaqQuestion(item.question),
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
  columnCount = columnPosts.length,
  faqCategories = DEFAULT_FAQ_CATEGORIES,
  faqItems,
  searchParams,
  mode = 'edit',
  homeEditorialPresentation,
  publishedSurfaceOverrides,
  publishedHeroQuickMenus,
}: {
  node: BuilderCompositeCanvasNode;
  datasetPreviewTargets?: DatasetPreviewTargets;
  columnPosts?: ColumnListItem[];
  columnCount?: number;
  faqCategories?: BuilderFaqCategory[];
  faqItems?: BuilderFaqItem[];
  searchParams?: Record<string, string | string[] | undefined>;
  mode?: 'edit' | 'preview' | 'published';
  homeEditorialPresentation?: 'editorial';
  publishedSurfaceOverrides?: Record<string, string>;
  publishedHeroQuickMenus?: ReadonlyArray<{ label: string; href: string }>;
}) {
  const { componentKey, config } = node.content;
  const locale = resolveLocale(config);
  const contextDatasetPreviewTargets = useBuilderDatasetPreviewTargets();
  const effectiveDatasetPreviewTargets = datasetPreviewTargets ?? contextDatasetPreviewTargets;
  const fallbackCopy = compositeFallbackCopy(locale);
  const publishEditorial = mode === 'published' && homeEditorialPresentation === 'editorial';
  // Desktop zh-hant roots already emit these landmark ids. The mobile-parity
  // overlays stay in the document for the narrow layout, but they must not
  // repeat the id. Services and case results are the opposite: the desktop
  // roots are hidden and the overlay is the visible owner of the id.
  const suppressDuplicateLandmarkId = mode === 'published'
    && typeof node.anchorName === 'string'
    && node.anchorName.startsWith('mobile-parity-home-')
    && node.anchorName !== 'mobile-parity-home-services'
    && node.anchorName !== 'mobile-parity-home-case-results';

  const body = (() => {
    switch (componentKey) {
      case 'hero-search':
        return (
          <HeroSearch
            locale={locale}
            scrollHref={mode === 'edit' ? `/${locale}#insights` : undefined}
            // The granular desktop hero is display:none while this mobile
            // variant is visible. Each responsive variant needs its own H1.
            headingLevel={1}
            presentation={publishEditorial ? 'editorial' : undefined}
            quickMenus={publishedHeroQuickMenus}
            omitLandmarkId={suppressDuplicateLandmarkId}
          />
        );
      case 'services-bento':
        return (
          <ServicesBento
            locale={locale}
            id="practice"
            presentation={publishEditorial ? 'editorial' : undefined}
          />
        );
      case 'home-contact-cta':
        return <HomeContactCta locale={locale} omitLandmarkId={suppressDuplicateLandmarkId} />;
      case 'insights-archive': {
        const posts = resolveInsightsPosts(locale, effectiveDatasetPreviewTargets, columnPosts, mode);
        if (posts.length === 0) {
          return (
            <div style={{ padding: 24, color: '#94a3b8', fontSize: 13 }}>
              {fallbackCopy.insightsUnavailable}
            </div>
          );
        }
        return (
          <InsightsArchiveSection
            locale={locale}
            posts={posts}
            presentation={publishEditorial ? 'editorial' : undefined}
            omitLandmarkId={suppressDuplicateLandmarkId}
          />
        );
      }
      case 'home-attorney':
        return (
          <HomeAttorneySplit
            locale={locale}
            presentation={publishEditorial ? 'editorial' : undefined}
            omitLandmarkId={suppressDuplicateLandmarkId}
          />
        );
      case 'home-case-results':
        return <HomeCaseResultsSplit locale={locale} />;
      case 'home-stats':
        return <HomeStatsSection locale={locale} omitLandmarkId={suppressDuplicateLandmarkId} />;
      case 'faq-accordion':
        return (
          <FAQAccordion
            locale={locale}
            items={faqContent[locale]}
            id={suppressDuplicateLandmarkId ? undefined : 'faq'}
            sectionClassName="section section--gray"
          />
        );
      case 'office-map-tabs':
        return (
          <OfficeMapTabs
            locale={locale}
            id={suppressDuplicateLandmarkId ? '' : 'offices'}
            sectionClassName="section section--light"
            presentation={publishEditorial ? 'editorial' : undefined}
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
        const faqList = faqItems ?? fallbackFaqItems(locale);
        // en: consultation, work, family and criminal questions first (display order only).
        const shownFaq = locale === 'en' ? orderEnFaq(faqCategories, faqList) : { categories: faqCategories, items: faqList };
        const faqBody = (
          <>
            <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description}>
              {locale === 'en' ? <EnFaqGlance count={faqList.length} /> : null}
            </PageHeader>
            <FaqPublicExplorer
              locale={locale}
              categories={shownFaq.categories}
              items={shownFaq.items}
              initialCategory={typeof searchParams?.category === 'string' ? searchParams.category : undefined}
              initialQuery={typeof searchParams?.q === 'string' ? searchParams.q : undefined}
            />
          </>
        );
        // zh-hant and (since 2026-10-06) ko: the Apple FAQ shell.
        if (locale === 'zh-hant' || locale === 'ko') return <ZhHantFaqShell locale={locale}>{faqBody}</ZhHantFaqShell>;
        return locale === 'en' ? <EnFaqShell>{faqBody}</EnFaqShell> : faqBody;
      }
      case 'legacy-page-pricing':
        return <PricingLegacyPageBody locale={locale} />;
      case 'legacy-page-reviews':
        return <ReviewsLegacyPageBody locale={locale} />;
      case 'legacy-page-columns':
        return <ColumnsLegacyPageBody locale={locale} posts={columnPosts} searchParams={searchParams} />;
      case 'legacy-page-videos':
        return <VideosLegacyPageBody locale={locale} columnCount={columnCount} />;
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
    minHeight: publishEditorial ? 0 : '100%',
    overflow: 'visible',
    position: 'relative',
  };

  const configOverrides =
    (config?.overrides as Record<string, string> | undefined) ?? {};
  const overrides = {
    ...(publishedSurfaceOverrides ?? {}),
    ...configOverrides,
  };
  if (mode === 'edit') {
    return <CompositeEditSurface node={node} overrides={overrides} wrapperStyle={wrapperStyle}>{body}</CompositeEditSurface>;
  }
  return (
    <BuilderSurfaceProvider nodeId={node.id} mode={mode} overrides={overrides} selectedSurfaceKey={null}>
      <div style={wrapperStyle}>{body}</div>
    </BuilderSurfaceProvider>
  );
}
