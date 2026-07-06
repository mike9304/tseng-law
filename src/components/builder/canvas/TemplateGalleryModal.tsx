'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { getAllTemplates } from '@/lib/builder/templates/registry';
import type { Locale } from '@/lib/locales';
import type {
  PageTemplate,
  TemplateDensity,
  TemplatePageType,
  TemplateQualityTier,
  TemplateVisualStyle,
} from '@/lib/builder/templates/types';
import {
  DEFAULT_TEMPLATE_FILTERS,
  TEMPLATE_DENSITY_FILTERS,
  TEMPLATE_PAGE_TYPE_FILTERS,
  TEMPLATE_QUALITY_FILTERS,
  TEMPLATE_STYLE_FILTERS,
  hasActiveTemplateFilters,
  matchesTemplateFilters,
  matchesTemplateSearch,
  normalizeTemplateSearchQuery,
  type TemplateFilterState,
} from '@/lib/builder/templates/filters';
import TemplateThumbnailRenderer from './TemplateThumbnailRenderer';
import ModalShell from './ModalShell';
import {
  TEMPLATE_CATEGORIES,
  TEMPLATE_CATEGORY_LABELS,
  type TemplateCategoryKey,
} from './template-categories';
import {
  getPageTemplateCategoryDisplayLabel,
  getPageTemplateCtaGoalLabel,
  getPageTemplateDensityDisplayLabel,
  getPageTemplatePageTypeDisplayLabel,
  getPageTemplatePreviewDescription,
  getPageTemplatePreviewName,
  getPageTemplatePreviewTags,
  getPageTemplateQualityLabel,
  getPageTemplateQualityTierDisplayLabel,
  getPageTemplateSectionSummary,
  getPageTemplateStyleDisplayLabel,
  pageTemplatePreviewMatchesSearch,
} from './SandboxCatalogPanel.helpers';
import {
  actionRowStyle,
  badgeRowStyle,
  blankCardDescriptionStyle,
  blankCardIconStyle,
  bodyStyle,
  cardBodyStyle,
  cardTitleStyle,
  categoryCountStyle,
  contentStyle,
  descriptionStyle,
  emptyStateStyle,
  featuredTemplateChipStyle,
  filterRowStyle,
  getBlankCardStyle,
  getCategoryButtonStyle,
  getQualityBadgeStyle,
  getTemplateCategoryChipStyle,
  getTemplateActionButtonStyle,
  getTemplateCardFrameStyle,
  getTemplatePreviewButtonStyle,
  metaStyle,
  getPreviewQualityChipStyle,
  getPreviewViewportButtonStyle,
  getPreviewViewportFrameStyle,
  previewCanvasCenterStyle,
  previewCanvasPaneStyle,
  previewDefinitionLabelStyle,
  previewDefinitionListStyle,
  previewDefinitionValueStyle,
  previewDescriptionStyle,
  previewDetailAsideStyle,
  previewPanelBodyStyle,
  previewTagChipStyle,
  previewTitleStyle,
  previewToolbarStyle,
  resetButtonStyle,
  resultCountStyle,
  searchInputStyle,
  searchRowStyle,
  sectionHeaderStyle,
  sectionTitleStyle,
  selectStyle,
  sidebarStyle,
  templateMetaChipStyle,
  toolbarStyle,
} from './TemplateGalleryModal.styles';

const allTemplates = getAllTemplates();

const TEMPLATE_GALLERY_COPY: Record<Locale, {
  title: string;
  subtitle: string;
  allCategory: string;
  previewAriaLabel: (name: string) => string;
  previewAction: string;
  useAction: string;
  closeAction: string;
  useTemplateAction: string;
  searchPlaceholder: string;
  resultCount: (count: number) => string;
  styleFilterAria: string;
  densityFilterAria: string;
  pageTypeFilterAria: string;
  qualityFilterAria: string;
  allStyles: string;
  allDensities: string;
  allPages: string;
  allQuality: string;
  resetFilters: string;
  featuredSectionLabel: string;
  featuredTitle: string;
  featuredSummary: string;
  emptyState: string;
  allTemplatesTitle: string;
  blankPageTitle: string;
  blankPageDescription: string;
  featuredBadge: string;
  viewportLabels: Record<'desktop' | 'tablet' | 'mobile', string>;
  styleDetail: string;
  ctaDetail: string;
  sectionsDetail: string;
}> = {
  ko: {
    title: '프리미엄 템플릿 쇼룸',
    subtitle: '업종, 스타일, 밀도, 페이지 타입으로 고르고 데스크톱/태블릿/모바일 첫인상을 확인하세요.',
    allCategory: '전체',
    previewAriaLabel: (name) => `${name} 미리보기`,
    previewAction: '미리보기',
    useAction: '사용',
    closeAction: '닫기',
    useTemplateAction: '이 템플릿 사용',
    searchPlaceholder: '템플릿, 업종, CTA, 스타일 검색...',
    resultCount: (count) => `${count}개 템플릿`,
    styleFilterAria: '스타일 필터',
    densityFilterAria: '밀도 필터',
    pageTypeFilterAria: '페이지 타입 필터',
    qualityFilterAria: '품질 필터',
    allStyles: '모든 스타일',
    allDensities: '모든 밀도',
    allPages: '모든 페이지',
    allQuality: '모든 품질',
    resetFilters: '필터 초기화',
    featuredSectionLabel: '추천 프리미엄 템플릿',
    featuredTitle: '추천 프리미엄 쇼케이스',
    featuredSummary: 'Wix급 첫인상 기준으로 우선 개선할 5개',
    emptyState: '조건에 맞는 템플릿이 없습니다. 필터를 줄이거나 전체 템플릿을 확인하세요.',
    allTemplatesTitle: '전체 템플릿',
    blankPageTitle: '빈 페이지',
    blankPageDescription: '자유 캔버스에서 새 페이지를 시작합니다.',
    featuredBadge: '추천',
    viewportLabels: { desktop: '데스크톱', tablet: '태블릿', mobile: '모바일' },
    styleDetail: '스타일',
    ctaDetail: 'CTA 목적',
    sectionsDetail: '섹션',
  },
  'zh-hant': {
    title: '精選頁面範本展示',
    subtitle: '依產業、風格、密度與頁面類型挑選，並檢查桌面、平板與手機第一印象。',
    allCategory: '全部',
    previewAriaLabel: (name) => `預覽「${name}」`,
    previewAction: '預覽',
    useAction: '使用',
    closeAction: '關閉',
    useTemplateAction: '使用此範本',
    searchPlaceholder: '搜尋範本、產業、CTA 或風格...',
    resultCount: (count) => `${count} 個範本`,
    styleFilterAria: '風格篩選',
    densityFilterAria: '密度篩選',
    pageTypeFilterAria: '頁面類型篩選',
    qualityFilterAria: '品質篩選',
    allStyles: '所有風格',
    allDensities: '所有密度',
    allPages: '所有頁面',
    allQuality: '所有品質',
    resetFilters: '重設篩選',
    featuredSectionLabel: '推薦精選範本',
    featuredTitle: '推薦精選展示',
    featuredSummary: '依 Wix 級第一印象優先檢查的 5 個範本',
    emptyState: '沒有符合條件的範本。請減少篩選或查看全部範本。',
    allTemplatesTitle: '全部範本',
    blankPageTitle: '空白頁面',
    blankPageDescription: '從自由畫布開始建立新頁面。',
    featuredBadge: '推薦',
    viewportLabels: { desktop: '桌面', tablet: '平板', mobile: '手機' },
    styleDetail: '風格',
    ctaDetail: 'CTA 目標',
    sectionsDetail: '區段',
  },
  en: {
    title: 'Premium Template Showroom',
    subtitle: 'Choose by industry, style, density, and page type, then check the desktop, tablet, and mobile first impression.',
    allCategory: 'All',
    previewAriaLabel: (name) => `Preview ${name}`,
    previewAction: 'Preview',
    useAction: 'Use',
    closeAction: 'Close',
    useTemplateAction: 'Use this template',
    searchPlaceholder: 'Search templates, industry, CTA, or style...',
    resultCount: (count) => `${count} ${count === 1 ? 'template' : 'templates'}`,
    styleFilterAria: 'Style filter',
    densityFilterAria: 'Density filter',
    pageTypeFilterAria: 'Page type filter',
    qualityFilterAria: 'Quality filter',
    allStyles: 'All styles',
    allDensities: 'All densities',
    allPages: 'All pages',
    allQuality: 'All quality',
    resetFilters: 'Reset filters',
    featuredSectionLabel: 'Featured premium templates',
    featuredTitle: 'Featured premium showcase',
    featuredSummary: 'Five templates prioritized for Wix-level first impression QA',
    emptyState: 'No templates match these filters. Reduce filters or view all templates.',
    allTemplatesTitle: 'All templates',
    blankPageTitle: 'Blank page',
    blankPageDescription: 'Start a new page from a free canvas.',
    featuredBadge: 'Featured',
    viewportLabels: { desktop: 'Desktop', tablet: 'Tablet', mobile: 'Mobile' },
    styleDetail: 'Style',
    ctaDetail: 'CTA goal',
    sectionsDetail: 'Sections',
  },
};

type TemplateGalleryCopy = (typeof TEMPLATE_GALLERY_COPY)[Locale];

function getCategoryCount(category: TemplateCategoryKey): number {
  if (category === 'all') return allTemplates.length;
  return allTemplates.filter((template) => template.category === category).length;
}

function cloneTemplateDocument(document: BuilderCanvasDocument): BuilderCanvasDocument {
  return JSON.parse(JSON.stringify(document)) as BuilderCanvasDocument;
}

function matchesSearch(template: PageTemplate, locale: Locale, query: string): boolean {
  if (!query) return true;
  const categoryLabel = TEMPLATE_CATEGORY_LABELS[template.category] ?? template.category;
  return matchesTemplateSearch(template, query, categoryLabel)
    || pageTemplatePreviewMatchesSearch(template, locale, query);
}

function formatTemplateMeta(template: PageTemplate, locale: Locale): string {
  const style = template.visualStyle ? getPageTemplateStyleDisplayLabel(template.visualStyle, locale) : null;
  const pageType = template.pageType ? getPageTemplatePageTypeDisplayLabel(template.pageType, locale) : null;
  return [style, pageType].filter(Boolean).join(' / ');
}

function getTemplateQualityDisplayLabel(template: PageTemplate, locale: Locale): string {
  const score = template.qaScore ? ` ${template.qaScore}` : '';
  return `${getPageTemplateQualityLabel(template, locale)}${score}`;
}

function TemplateCard({
  template,
  locale,
  copy,
  hovered,
  onHover,
  onPreview,
  onSelect,
}: {
  template: PageTemplate;
  locale: Locale;
  copy: TemplateGalleryCopy;
  hovered: boolean;
  onHover: (id: string | null) => void;
  onPreview: (template: PageTemplate, trigger: HTMLElement) => void;
  onSelect: (template: PageTemplate) => void;
}) {
  const styleLabel = template.visualStyle ? getPageTemplateStyleDisplayLabel(template.visualStyle, locale) : null;
  const densityLabel = template.density ? getPageTemplateDensityDisplayLabel(template.density, locale) : null;
  const categoryLabel = getPageTemplateCategoryDisplayLabel(template.category, locale);
  const previewName = getPageTemplatePreviewName(template, locale);
  const previewDescription = getPageTemplatePreviewDescription(template, locale);
  const previewTags = getPageTemplatePreviewTags(template, locale);
  const primaryTag = previewTags[0] ?? categoryLabel;
  const templateMetaLabel = formatTemplateMeta(template, locale);

  return (
    <article
      style={getTemplateCardFrameStyle(template, hovered)}
      onMouseEnter={() => onHover(template.id)}
      onMouseLeave={() => onHover(null)}
    >
      <button
        type="button"
        style={getTemplatePreviewButtonStyle(template)}
        onClick={(event) => onPreview(template, event.currentTarget)}
        aria-label={copy.previewAriaLabel(previewName)}
      >
        <TemplateThumbnailRenderer template={template} width={320} height={190} locale={locale} />
      </button>
      <div style={cardBodyStyle}>
        <div style={badgeRowStyle}>
          <span style={getQualityBadgeStyle(template)}>{getTemplateQualityDisplayLabel(template, locale)}</span>
          <span style={getTemplateCategoryChipStyle(template)}>{categoryLabel}</span>
          {template.featured ? <span style={featuredTemplateChipStyle}>{copy.featuredBadge}</span> : null}
        </div>
        <div style={cardTitleStyle}>{previewName}</div>
        <div style={descriptionStyle}>{previewDescription}</div>
        <div style={metaStyle}>
          {styleLabel ? <span>{styleLabel}</span> : null}
          {densityLabel ? <span>{densityLabel}</span> : null}
          <span>{getPageTemplateCtaGoalLabel(template, locale)}</span>
        </div>
        <div style={badgeRowStyle}>
          <span style={templateMetaChipStyle}>{primaryTag}</span>
          {templateMetaLabel ? (
            <span style={templateMetaChipStyle}>{templateMetaLabel}</span>
          ) : null}
        </div>
      </div>
      <div style={actionRowStyle}>
        <button
          type="button"
          style={getTemplateActionButtonStyle(template, 'preview')}
          onClick={(event) => onPreview(template, event.currentTarget)}
        >
          {copy.previewAction}
        </button>
        <button
          type="button"
          style={getTemplateActionButtonStyle(template, 'use')}
          onClick={() => onSelect(template)}
        >
          {copy.useAction}
        </button>
      </div>
    </article>
  );
}

function PreviewPanel({
  template,
  locale,
  copy,
  onClose,
  onSelect,
}: {
  template: PageTemplate;
  locale: Locale;
  copy: TemplateGalleryCopy;
  onClose: () => void;
  onSelect: (template: PageTemplate) => void;
}) {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const previewName = getPageTemplatePreviewName(template, locale);
  const previewDescription = getPageTemplatePreviewDescription(template, locale);
  const previewTags = getPageTemplatePreviewTags(template, locale);
  const previewSize = viewport === 'desktop'
    ? { width: 720, height: 450 }
    : viewport === 'tablet'
      ? { width: 420, height: 560 }
      : { width: 260, height: 560 };

  return (
    <ModalShell
      open
      nested
      bodyFlush
      size="xl"
      onClose={onClose}
      title={previewName}
      subtitle={getTemplateQualityDisplayLabel(template, locale)}
      toolbar={(
        <div className="template-gallery-preview-toolbar" style={previewToolbarStyle}>
          {(['desktop', 'tablet', 'mobile'] as const).map((item) => (
            <button
              key={item}
              type="button"
              style={getPreviewViewportButtonStyle(template, viewport === item)}
              onClick={() => setViewport(item)}
            >
              {copy.viewportLabels[item]}
            </button>
          ))}
        </div>
      )}
      actions={[
        { label: copy.closeAction, variant: 'secondary', onClick: onClose },
        { label: copy.useTemplateAction, variant: 'primary', onClick: () => onSelect(template) },
      ]}
    >
      <div className="template-gallery-preview-body" style={previewPanelBodyStyle}>
        <div className="template-gallery-preview-canvas" style={previewCanvasPaneStyle}>
          <div style={previewCanvasCenterStyle}>
            <div className="template-gallery-preview-frame" style={getPreviewViewportFrameStyle(previewSize)}>
              <TemplateThumbnailRenderer
                template={template}
                width={previewSize.width}
                height={previewSize.height}
                locale={locale}
              />
            </div>
          </div>
        </div>
        <aside className="template-gallery-preview-detail" style={previewDetailAsideStyle}>
          <div>
            <div style={getPreviewQualityChipStyle(template)}>
              {getTemplateQualityDisplayLabel(template, locale)}
            </div>
            <h3 style={previewTitleStyle}>{previewName}</h3>
            <p style={previewDescriptionStyle}>
              {previewDescription}
            </p>
          </div>
          <dl style={previewDefinitionListStyle}>
            <div>
              <dt style={previewDefinitionLabelStyle}>{copy.styleDetail}</dt>
              <dd style={previewDefinitionValueStyle}>{formatTemplateMeta(template, locale) || getPageTemplateQualityLabel(template, locale)}</dd>
            </div>
            <div>
              <dt style={previewDefinitionLabelStyle}>{copy.ctaDetail}</dt>
              <dd style={previewDefinitionValueStyle}>{getPageTemplateCtaGoalLabel(template, locale)}</dd>
            </div>
            <div>
              <dt style={previewDefinitionLabelStyle}>{copy.sectionsDetail}</dt>
              <dd style={previewDefinitionValueStyle}>{getPageTemplateSectionSummary(template, locale)}</dd>
            </div>
          </dl>
          <div style={badgeRowStyle}>
            {previewTags.slice(0, 5).map((tag) => (
              <span key={tag} style={previewTagChipStyle}>{tag}</span>
            ))}
          </div>
        </aside>
      </div>
    </ModalShell>
  );
}

export default function TemplateGalleryModal({
  locale = 'ko',
  initialSearch = '',
  onSearchChange,
  onSelect,
  onClose,
}: {
  locale?: Locale;
  initialSearch?: string;
  onSearchChange?: (query: string) => void;
  onSelect: (document: BuilderCanvasDocument | null, templateName?: string) => void;
  onClose: () => void;
}) {
  const copy = TEMPLATE_GALLERY_COPY[locale];
  const [activeCategory, setActiveCategory] = useState<TemplateCategoryKey>('all');
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [searchQuery, setSearchQuery] = useState(normalizeTemplateSearchQuery(initialSearch));
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [filters, setFilters] = useState<TemplateFilterState>(DEFAULT_TEMPLATE_FILTERS);
  const [previewTemplate, setPreviewTemplate] = useState<PageTemplate | null>(null);
  const previewReturnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const normalizedInitialSearch = initialSearch.trim();
    setSearchInput(normalizedInitialSearch);
    setSearchQuery(normalizeTemplateSearchQuery(normalizedInitialSearch));
    setActiveCategory('all');
    onSearchChange?.(normalizedInitialSearch);
  }, [initialSearch, onSearchChange]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const normalizedSearch = searchInput.trim();
      setSearchQuery(normalizeTemplateSearchQuery(normalizedSearch));
      onSearchChange?.(normalizedSearch);
    }, 200);
    return () => window.clearTimeout(timeoutId);
  }, [onSearchChange, searchInput]);

  const filteredTemplates = useMemo(() => {
    return allTemplates.filter((template) => {
      const categoryMatches = activeCategory === 'all' || template.category === activeCategory;
      return categoryMatches && matchesSearch(template, locale, searchQuery) && matchesTemplateFilters(template, filters);
    });
  }, [activeCategory, filters, locale, searchQuery]);

  const featuredTemplates = useMemo(() => {
    return allTemplates.filter((template) => template.featured || template.qualityTier === 'premium').slice(0, 5);
  }, []);

  const hasFilters = hasActiveTemplateFilters(filters);
  const showBlankCard = activeCategory === 'all' && searchQuery.length === 0 && !hasFilters;
  const showFeatured = activeCategory === 'all' && searchQuery.length === 0 && !hasFilters;

  const selectTemplate = (template: PageTemplate) => {
    onSelect(cloneTemplateDocument(template.document), template.name);
  };

  const openPreview = (template: PageTemplate, trigger: HTMLElement) => {
    previewReturnFocusRef.current = trigger;
    setPreviewTemplate(template);
  };

  const closePreview = () => {
    const restoreTarget = previewReturnFocusRef.current;
    setPreviewTemplate(null);
    window.setTimeout(() => {
      if (restoreTarget?.isConnected) restoreTarget.focus({ preventScroll: true });
      previewReturnFocusRef.current = null;
    }, 0);
  };

  const updateFilter = <K extends keyof TemplateFilterState>(key: K, value: TemplateFilterState[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <>
      <ModalShell
        open
        onClose={onClose}
        title={copy.title}
        subtitle={copy.subtitle}
        fullViewport
        bodyFlush
        tone="neutral"
        dismissable={!previewTemplate}
      >
      <style>{`
        .template-gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }
        .template-gallery-featured {
          display: grid;
          grid-template-columns: repeat(5, minmax(180px, 1fr));
          gap: 12px;
          margin-bottom: 22px;
        }
        @media (min-width: 1380px) {
          .template-gallery-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
        @media (max-width: 1120px) {
          .template-gallery-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .template-gallery-featured {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 760px) {
          .template-gallery-modal-body {
            grid-template-columns: minmax(0, 1fr) !important;
          }
          .template-gallery-sidebar {
            display: none;
          }
          .template-gallery-grid,
          .template-gallery-featured {
            grid-template-columns: minmax(0, 1fr);
          }
          .template-gallery-search-row {
            grid-template-columns: minmax(0, 1fr) !important;
          }
          .template-gallery-content {
            padding: 16px !important;
          }
          .template-gallery-filter-select,
          .template-gallery-reset-button {
            width: 100% !important;
            min-width: 0 !important;
          }
        }
        @media (max-width: 900px) {
          .template-gallery-preview-body {
            grid-template-columns: minmax(0, 1fr) !important;
            overflow: auto !important;
          }
          .template-gallery-preview-canvas {
            padding: 16px !important;
          }
          .template-gallery-preview-detail {
            border-left: 0 !important;
            border-top: 1px solid #e2e8f0 !important;
          }
          .template-gallery-preview-toolbar {
            justify-content: flex-start !important;
            overflow-x: auto;
          }
        }
        .template-gallery-search-input:focus,
        .template-gallery-filter-select:focus,
        .template-gallery-reset-button:focus-visible {
          border-color: #123b63 !important;
          box-shadow: 0 0 0 3px rgba(18, 59, 99, 0.12) !important;
        }
        .template-gallery-reset-button:hover {
          background: #eff6ff !important;
          border-color: #9cc3ed !important;
        }
      `}</style>
        <div className="template-gallery-modal-body" style={bodyStyle}>
          <aside className="template-gallery-sidebar" style={sidebarStyle}>
            {TEMPLATE_CATEGORIES.map((category) => {
              const active = activeCategory === category.key;
              const count = getCategoryCount(category.key);
              const label = category.key === 'all'
                ? copy.allCategory
                : getPageTemplateCategoryDisplayLabel(category.key, locale);
              return (
                <button
                  key={category.key}
                  type="button"
                  style={getCategoryButtonStyle(active)}
                  onClick={() => setActiveCategory(category.key)}
                >
                  <span aria-hidden>{category.icon}</span>
                  <span>{label}</span>
                  <span style={categoryCountStyle}>{count}</span>
                </button>
              );
            })}
          </aside>

          <main className="template-gallery-content" style={contentStyle}>
            <div style={toolbarStyle}>
              <div className="template-gallery-search-row" style={searchRowStyle}>
                <input
                  className="template-gallery-search-input"
                  type="search"
                  value={searchInput}
                  placeholder={copy.searchPlaceholder}
                  style={searchInputStyle}
                  onChange={(event) => setSearchInput(event.target.value)}
                  autoFocus
                />
                <div style={resultCountStyle}>{copy.resultCount(filteredTemplates.length)}</div>
              </div>
              <div style={filterRowStyle}>
                <select
                  className="template-gallery-filter-select"
                  value={filters.style}
                  style={selectStyle}
                  onChange={(event) => updateFilter('style', event.target.value as TemplateVisualStyle | 'all')}
                  aria-label={copy.styleFilterAria}
                >
                  <option value="all">{copy.allStyles}</option>
                  {TEMPLATE_STYLE_FILTERS.map((filter) => (
                    <option key={filter.key} value={filter.key}>{getPageTemplateStyleDisplayLabel(filter.key, locale)}</option>
                  ))}
                </select>
                <select
                  className="template-gallery-filter-select"
                  value={filters.density}
                  style={selectStyle}
                  onChange={(event) => updateFilter('density', event.target.value as TemplateDensity | 'all')}
                  aria-label={copy.densityFilterAria}
                >
                  <option value="all">{copy.allDensities}</option>
                  {TEMPLATE_DENSITY_FILTERS.map((filter) => (
                    <option key={filter.key} value={filter.key}>{getPageTemplateDensityDisplayLabel(filter.key, locale)}</option>
                  ))}
                </select>
                <select
                  className="template-gallery-filter-select"
                  value={filters.pageType}
                  style={selectStyle}
                  onChange={(event) => updateFilter('pageType', event.target.value as TemplatePageType | 'all')}
                  aria-label={copy.pageTypeFilterAria}
                >
                  <option value="all">{copy.allPages}</option>
                  {TEMPLATE_PAGE_TYPE_FILTERS.map((filter) => (
                    <option key={filter.key} value={filter.key}>{getPageTemplatePageTypeDisplayLabel(filter.key, locale)}</option>
                  ))}
                </select>
                <select
                  className="template-gallery-filter-select"
                  value={filters.quality}
                  style={selectStyle}
                  onChange={(event) => updateFilter('quality', event.target.value as TemplateQualityTier | 'all')}
                  aria-label={copy.qualityFilterAria}
                >
                  <option value="all">{copy.allQuality}</option>
                  {TEMPLATE_QUALITY_FILTERS.map((filter) => (
                    <option key={filter.key} value={filter.key}>{getPageTemplateQualityTierDisplayLabel(filter.key, locale)}</option>
                  ))}
                </select>
                {hasFilters ? (
                  <button
                    className="template-gallery-reset-button"
                    type="button"
                    style={resetButtonStyle}
                    onClick={() => setFilters(DEFAULT_TEMPLATE_FILTERS)}
                  >
                    {copy.resetFilters}
                  </button>
                ) : null}
              </div>
            </div>

            {showFeatured ? (
              <section aria-label={copy.featuredSectionLabel}>
                <div style={sectionHeaderStyle}>
                  <h3 style={sectionTitleStyle}>{copy.featuredTitle}</h3>
                  <span style={resultCountStyle}>{copy.featuredSummary}</span>
                </div>
                <div className="template-gallery-featured">
                  {featuredTemplates.map((template) => (
                    <TemplateCard
                      key={`featured-${template.id}`}
                      template={template}
                      locale={locale}
                      copy={copy}
                      hovered={hoveredId === `featured-${template.id}`}
                      onHover={(id) => setHoveredId(id ? `featured-${id}` : null)}
                      onPreview={openPreview}
                      onSelect={selectTemplate}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {filteredTemplates.length === 0 && !showBlankCard ? (
              <div style={emptyStateStyle}>{copy.emptyState}</div>
            ) : (
              <>
                <div style={sectionHeaderStyle}>
                  <h3 style={sectionTitleStyle}>{copy.allTemplatesTitle}</h3>
                </div>
                <div className="template-gallery-grid">
                  {showBlankCard ? (
                    <button
                      type="button"
                      style={getBlankCardStyle(hoveredId === 'blank')}
                      onMouseEnter={() => setHoveredId('blank')}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => onSelect(null)}
                    >
                      <span style={blankCardIconStyle}>+</span>
                      <span style={cardTitleStyle}>{copy.blankPageTitle}</span>
                      <span style={blankCardDescriptionStyle}>
                        {copy.blankPageDescription}
                      </span>
                    </button>
                  ) : null}

                  {filteredTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      locale={locale}
                      copy={copy}
                      hovered={hoveredId === template.id}
                      onHover={setHoveredId}
                      onPreview={openPreview}
                      onSelect={selectTemplate}
                    />
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </ModalShell>
      {previewTemplate ? (
        <PreviewPanel
          template={previewTemplate}
          locale={locale}
          copy={copy}
          onClose={closePreview}
          onSelect={selectTemplate}
        />
      ) : null}
    </>
  );
}
