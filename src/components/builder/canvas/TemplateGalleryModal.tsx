'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { getAllTemplates } from '@/lib/builder/templates/registry';
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
  buildTemplateSearchText,
  hasActiveTemplateFilters,
  matchesTemplateFilters,
  type TemplateFilterState,
} from '@/lib/builder/templates/filters';
import {
  TEMPLATE_DENSITY_LABELS,
  TEMPLATE_PAGE_TYPE_LABELS,
  TEMPLATE_QUALITY_LABELS,
  TEMPLATE_STYLE_LABELS,
  getTemplatePalette,
} from '@/lib/builder/templates/design-system';
import TemplateThumbnailRenderer from './TemplateThumbnailRenderer';
import ModalShell from './ModalShell';
import {
  TEMPLATE_CATEGORIES,
  TEMPLATE_CATEGORY_LABELS,
  type TemplateCategoryKey,
} from './template-categories';

const allTemplates = getAllTemplates();

const bodyStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '230px minmax(0, 1fr)',
  flex: 1,
  minHeight: 0,
};

const sidebarStyle: CSSProperties = {
  borderRight: '1px solid #dbe3ef',
  background: '#ffffff',
  padding: '16px 12px',
  overflowY: 'auto',
};

const categoryButtonBase: CSSProperties = {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '26px minmax(0, 1fr) auto',
  alignItems: 'center',
  gap: 8,
  border: '1px solid transparent',
  borderLeft: '4px solid transparent',
  borderRadius: 8,
  background: 'transparent',
  color: '#475569',
  padding: '8px 9px 8px 7px',
  cursor: 'pointer',
  textAlign: 'left',
  fontSize: '0.82rem',
  fontWeight: 750,
};

const categoryCountStyle: CSSProperties = {
  color: '#94a3b8',
  fontSize: '0.72rem',
  fontWeight: 850,
};

const contentStyle: CSSProperties = {
  minWidth: 0,
  minHeight: 0,
  padding: 22,
  overflowY: 'auto',
};

const toolbarStyle: CSSProperties = {
  display: 'grid',
  gap: 12,
  marginBottom: 18,
};

const searchRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  alignItems: 'center',
  gap: 14,
};

const searchInputStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  border: '1px solid #cbd5e1',
  borderRadius: 10,
  padding: '11px 13px',
  color: '#0f172a',
  fontSize: '0.92rem',
  outline: 'none',
  background: '#fff',
};

const resultCountStyle: CSSProperties = {
  whiteSpace: 'nowrap',
  fontSize: '0.78rem',
  color: '#64748b',
  fontWeight: 750,
};

const filterRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  alignItems: 'center',
};

const selectStyle: CSSProperties = {
  minWidth: 132,
  height: 36,
  border: '1px solid #cbd5e1',
  borderRadius: 9,
  background: '#ffffff',
  color: '#172033',
  fontSize: '0.78rem',
  fontWeight: 750,
  padding: '0 10px',
};

const resetButtonStyle: CSSProperties = {
  height: 36,
  border: '1px solid #dbe3ef',
  borderRadius: 9,
  background: '#ffffff',
  color: '#475569',
  cursor: 'pointer',
  fontSize: '0.78rem',
  fontWeight: 800,
  padding: '0 12px',
};

const sectionHeaderStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 16,
  margin: '0 0 12px',
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  color: '#0f172a',
  fontSize: '0.98rem',
  fontWeight: 850,
};

const cardStyle: CSSProperties = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  border: '1px solid #dbe3ef',
  borderRadius: 12,
  background: '#fff',
  overflow: 'hidden',
  textAlign: 'left',
  transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease',
};

const cardBodyStyle: CSSProperties = {
  display: 'grid',
  gap: 8,
  padding: '13px 14px 14px',
};

const cardTitleStyle: CSSProperties = {
  fontSize: '0.96rem',
  fontWeight: 850,
  color: '#0f172a',
  lineHeight: 1.25,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const descriptionStyle: CSSProperties = {
  color: '#64748b',
  fontSize: '0.78rem',
  lineHeight: 1.45,
  minHeight: 36,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

const badgeRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 5,
  alignItems: 'center',
};

const chipStyle: CSSProperties = {
  width: 'fit-content',
  borderRadius: 999,
  background: '#eff6ff',
  color: '#123b63',
  padding: '3px 8px',
  fontSize: '0.68rem',
  fontWeight: 850,
};

const metaStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  color: '#64748b',
  fontSize: '0.7rem',
  fontWeight: 750,
};

const actionRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 8,
  padding: '0 14px 14px',
};

const actionButtonBase: CSSProperties = {
  minHeight: 36,
  borderRadius: 9,
  cursor: 'pointer',
  fontSize: '0.75rem',
  fontWeight: 850,
};

const emptyStateStyle: CSSProperties = {
  padding: 36,
  border: '1px dashed #cbd5e1',
  borderRadius: 12,
  background: '#fff',
  color: '#64748b',
  textAlign: 'center',
  fontSize: '0.9rem',
};

const blankCardStyle: CSSProperties = {
  ...cardStyle,
  minHeight: 304,
  justifyContent: 'center',
  alignItems: 'center',
  gap: 12,
  padding: 22,
  background: '#ffffff',
};

function getCategoryCount(category: TemplateCategoryKey): number {
  if (category === 'all') return allTemplates.length;
  return allTemplates.filter((template) => template.category === category).length;
}

function cloneTemplateDocument(document: BuilderCanvasDocument): BuilderCanvasDocument {
  return JSON.parse(JSON.stringify(document)) as BuilderCanvasDocument;
}

function matchesSearch(template: PageTemplate, query: string): boolean {
  if (!query) return true;
  const categoryLabel = TEMPLATE_CATEGORY_LABELS[template.category] ?? template.category;
  return buildTemplateSearchText(template, categoryLabel).includes(query);
}

function formatTemplateMeta(template: PageTemplate): string {
  const style = template.visualStyle ? TEMPLATE_STYLE_LABELS[template.visualStyle] : null;
  const pageType = template.pageType ? TEMPLATE_PAGE_TYPE_LABELS[template.pageType] : null;
  return [style, pageType].filter(Boolean).join(' / ');
}

function getQualityBadgeStyle(template: PageTemplate): CSSProperties {
  if (template.qualityTier === 'premium') {
    const palette = getTemplatePalette(template.paletteKey);
    return { ...chipStyle, background: palette.ink, color: palette.inverse };
  }
  if (template.qualityTier === 'under-review') return { ...chipStyle, background: '#fff7ed', color: '#9a3412' };
  if (template.qualityTier === 'draft') return { ...chipStyle, background: '#f1f5f9', color: '#64748b' };
  return { ...chipStyle, background: '#f8fafc', color: '#475569' };
}

function getTemplateQualityLabel(template: PageTemplate): string {
  if (!template.qualityTier) return 'Standard';
  const score = template.qaScore ? ` ${template.qaScore}` : '';
  return `${TEMPLATE_QUALITY_LABELS[template.qualityTier]}${score}`;
}

function TemplateCard({
  template,
  hovered,
  onHover,
  onPreview,
  onSelect,
}: {
  template: PageTemplate;
  hovered: boolean;
  onHover: (id: string | null) => void;
  onPreview: (template: PageTemplate) => void;
  onSelect: (template: PageTemplate) => void;
}) {
  const palette = getTemplatePalette(template.paletteKey);
  const styleLabel = template.visualStyle ? TEMPLATE_STYLE_LABELS[template.visualStyle] : null;
  const densityLabel = template.density ? TEMPLATE_DENSITY_LABELS[template.density] : null;
  const categoryLabel = TEMPLATE_CATEGORY_LABELS[template.category] ?? template.category;
  const primaryTag = template.tags?.[0] ?? categoryLabel;

  return (
    <article
      style={{
        ...cardStyle,
        borderColor: hovered ? palette.accent : '#dbe3ef',
        boxShadow: hovered ? `0 18px 40px ${palette.ink}22` : '0 1px 2px rgba(15, 23, 42, 0.04)',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
      onMouseEnter={() => onHover(template.id)}
      onMouseLeave={() => onHover(null)}
    >
      <button
        type="button"
        style={{
          display: 'block',
          width: '100%',
          height: 168,
          border: 0,
          padding: 0,
          background: palette.canvas,
          cursor: 'pointer',
          borderBottom: '1px solid #dbe3ef',
        }}
        onClick={() => onPreview(template)}
        aria-label={`${template.name} 미리보기`}
      >
        <TemplateThumbnailRenderer template={template} width={320} height={190} />
      </button>
      <div style={cardBodyStyle}>
        <div style={badgeRowStyle}>
          <span style={getQualityBadgeStyle(template)}>{getTemplateQualityLabel(template)}</span>
          <span style={{ ...chipStyle, background: palette.accentSoft, color: palette.ink }}>{categoryLabel}</span>
          {template.featured ? <span style={{ ...chipStyle, background: '#ecfeff', color: '#0e7490' }}>Featured</span> : null}
        </div>
        <div style={cardTitleStyle}>{template.name}</div>
        <div style={descriptionStyle}>{template.description}</div>
        <div style={metaStyle}>
          {styleLabel ? <span>{styleLabel}</span> : null}
          {densityLabel ? <span>{densityLabel}</span> : null}
          {template.ctaGoal ? <span>{template.ctaGoal}</span> : null}
        </div>
        <div style={badgeRowStyle}>
          <span style={{ ...chipStyle, background: '#f8fafc', color: '#475569' }}>{primaryTag}</span>
          {formatTemplateMeta(template) ? (
            <span style={{ ...chipStyle, background: '#f8fafc', color: '#475569' }}>{formatTemplateMeta(template)}</span>
          ) : null}
        </div>
      </div>
      <div style={actionRowStyle}>
        <button
          type="button"
          style={{
            ...actionButtonBase,
            border: '1px solid #dbe3ef',
            background: '#ffffff',
            color: '#334155',
          }}
          onClick={() => onPreview(template)}
        >
          미리보기
        </button>
        <button
          type="button"
          style={{
            ...actionButtonBase,
            border: `1px solid ${palette.ink}`,
            background: palette.ink,
            color: palette.inverse,
          }}
          onClick={() => onSelect(template)}
        >
          사용
        </button>
      </div>
    </article>
  );
}

function PreviewPanel({
  template,
  onClose,
  onSelect,
}: {
  template: PageTemplate;
  onClose: () => void;
  onSelect: (template: PageTemplate) => void;
}) {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const palette = getTemplatePalette(template.paletteKey);
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
      title={template.name}
      subtitle={getTemplateQualityLabel(template)}
      toolbar={(
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, padding: 12 }}>
          {(['desktop', 'tablet', 'mobile'] as const).map((item) => (
            <button
              key={item}
              type="button"
              style={{
                minHeight: 34,
                border: `1px solid ${viewport === item ? palette.ink : '#dbe3ef'}`,
                borderRadius: 8,
                background: viewport === item ? palette.ink : '#ffffff',
                color: viewport === item ? palette.inverse : '#475569',
                cursor: 'pointer',
                fontSize: '0.72rem',
                fontWeight: 850,
                padding: '0 12px',
              }}
              onClick={() => setViewport(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
      actions={[
        { label: '닫기', variant: 'secondary', onClick: onClose },
        { label: '이 템플릿 사용', variant: 'primary', onClick: () => onSelect(template) },
      ]}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 300px',
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <div style={{ minWidth: 0, padding: 24, background: '#eef2f7', overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: previewSize.width,
                maxWidth: '100%',
                height: previewSize.height,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 18px 40px rgba(15, 23, 42, 0.14)',
              }}
            >
              <TemplateThumbnailRenderer template={template} width={previewSize.width} height={previewSize.height} />
            </div>
          </div>
        </div>
        <aside style={{ padding: 20, display: 'grid', alignContent: 'start', gap: 14 }}>
          <div>
            <div style={{ ...chipStyle, background: palette.accentSoft, color: palette.ink, marginBottom: 8 }}>
              {getTemplateQualityLabel(template)}
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', lineHeight: 1.25 }}>{template.name}</h3>
            <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '0.82rem', lineHeight: 1.5 }}>
              {template.description}
            </p>
          </div>
          <dl style={{ display: 'grid', gap: 8, margin: 0, color: '#475569', fontSize: '0.78rem' }}>
            <div><dt style={{ fontWeight: 850 }}>스타일</dt><dd style={{ margin: 0 }}>{formatTemplateMeta(template) || 'Standard'}</dd></div>
            <div><dt style={{ fontWeight: 850 }}>CTA 목적</dt><dd style={{ margin: 0 }}>{template.ctaGoal ?? '문의 전환'}</dd></div>
            <div><dt style={{ fontWeight: 850 }}>섹션</dt><dd style={{ margin: 0 }}>{template.sections?.join(', ') ?? '템플릿 섹션'}</dd></div>
          </dl>
          <div style={badgeRowStyle}>
            {(template.tags ?? []).slice(0, 5).map((tag) => (
              <span key={tag} style={{ ...chipStyle, background: '#f8fafc', color: '#475569' }}>{tag}</span>
            ))}
          </div>
        </aside>
      </div>
    </ModalShell>
  );
}

export default function TemplateGalleryModal({
  onSelect,
  onClose,
}: {
  onSelect: (document: BuilderCanvasDocument | null) => void;
  onClose: () => void;
}) {
  const [activeCategory, setActiveCategory] = useState<TemplateCategoryKey>('all');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [filters, setFilters] = useState<TemplateFilterState>(DEFAULT_TEMPLATE_FILTERS);
  const [previewTemplate, setPreviewTemplate] = useState<PageTemplate | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearchQuery(searchInput.trim().toLowerCase());
    }, 200);
    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const modalShells = Array.from(document.querySelectorAll('[data-modal-shell="true"]'));
        const topmostShell = modalShells[modalShells.length - 1] ?? null;
        if (topmostShell?.getAttribute('data-modal-nested') === 'true') return;
        if (previewTemplate) return;
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, previewTemplate]);

  const filteredTemplates = useMemo(() => {
    return allTemplates.filter((template) => {
      const categoryMatches = activeCategory === 'all' || template.category === activeCategory;
      return categoryMatches && matchesSearch(template, searchQuery) && matchesTemplateFilters(template, filters);
    });
  }, [activeCategory, filters, searchQuery]);

  const featuredTemplates = useMemo(() => {
    return allTemplates.filter((template) => template.featured || template.qualityTier === 'premium').slice(0, 5);
  }, []);

  const hasFilters = hasActiveTemplateFilters(filters);
  const showBlankCard = activeCategory === 'all' && searchQuery.length === 0 && !hasFilters;
  const showFeatured = activeCategory === 'all' && searchQuery.length === 0 && !hasFilters;

  const selectTemplate = (template: PageTemplate) => {
    onSelect(cloneTemplateDocument(template.document));
  };

  const updateFilter = <K extends keyof TemplateFilterState>(key: K, value: TemplateFilterState[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <>
      <ModalShell
        open
        onClose={onClose}
        title="프리미엄 템플릿 쇼룸"
        subtitle="업종, 스타일, 밀도, 페이지 타입으로 고르고 desktop/tablet/mobile 첫인상을 확인하세요."
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
        }
      `}</style>
        <div className="template-gallery-modal-body" style={bodyStyle}>
          <aside className="template-gallery-sidebar" style={sidebarStyle}>
            {TEMPLATE_CATEGORIES.map((category) => {
              const active = activeCategory === category.key;
              const count = getCategoryCount(category.key);
              return (
                <button
                  key={category.key}
                  type="button"
                  style={{
                    ...categoryButtonBase,
                    borderColor: active ? '#bfdbfe' : 'transparent',
                    borderLeftColor: active ? '#123b63' : 'transparent',
                    background: active ? '#eff6ff' : 'transparent',
                    color: active ? '#123b63' : '#475569',
                  }}
                  onClick={() => setActiveCategory(category.key)}
                >
                  <span aria-hidden>{category.icon}</span>
                  <span>{category.label}</span>
                  <span style={categoryCountStyle}>{count}</span>
                </button>
              );
            })}
          </aside>

          <main style={contentStyle}>
            <div style={toolbarStyle}>
              <div className="template-gallery-search-row" style={searchRowStyle}>
                <input
                  type="search"
                  value={searchInput}
                  placeholder="템플릿, 업종, CTA, 스타일 검색..."
                  style={searchInputStyle}
                  onChange={(event) => setSearchInput(event.target.value)}
                  autoFocus
                />
                <div style={resultCountStyle}>{filteredTemplates.length}개 템플릿</div>
              </div>
              <div style={filterRowStyle}>
                <select
                  value={filters.style}
                  style={selectStyle}
                  onChange={(event) => updateFilter('style', event.target.value as TemplateVisualStyle | 'all')}
                  aria-label="스타일 필터"
                >
                  <option value="all">모든 스타일</option>
                  {TEMPLATE_STYLE_FILTERS.map((filter) => (
                    <option key={filter.key} value={filter.key}>{filter.label}</option>
                  ))}
                </select>
                <select
                  value={filters.density}
                  style={selectStyle}
                  onChange={(event) => updateFilter('density', event.target.value as TemplateDensity | 'all')}
                  aria-label="밀도 필터"
                >
                  <option value="all">모든 밀도</option>
                  {TEMPLATE_DENSITY_FILTERS.map((filter) => (
                    <option key={filter.key} value={filter.key}>{filter.label}</option>
                  ))}
                </select>
                <select
                  value={filters.pageType}
                  style={selectStyle}
                  onChange={(event) => updateFilter('pageType', event.target.value as TemplatePageType | 'all')}
                  aria-label="페이지 타입 필터"
                >
                  <option value="all">모든 페이지</option>
                  {TEMPLATE_PAGE_TYPE_FILTERS.map((filter) => (
                    <option key={filter.key} value={filter.key}>{filter.label}</option>
                  ))}
                </select>
                <select
                  value={filters.quality}
                  style={selectStyle}
                  onChange={(event) => updateFilter('quality', event.target.value as TemplateQualityTier | 'all')}
                  aria-label="품질 필터"
                >
                  <option value="all">모든 품질</option>
                  {TEMPLATE_QUALITY_FILTERS.map((filter) => (
                    <option key={filter.key} value={filter.key}>{filter.label}</option>
                  ))}
                </select>
                {hasFilters ? (
                  <button type="button" style={resetButtonStyle} onClick={() => setFilters(DEFAULT_TEMPLATE_FILTERS)}>
                    필터 초기화
                  </button>
                ) : null}
              </div>
            </div>

            {showFeatured ? (
              <section aria-label="추천 프리미엄 템플릿">
                <div style={sectionHeaderStyle}>
                  <h3 style={sectionTitleStyle}>추천 프리미엄 쇼케이스</h3>
                  <span style={resultCountStyle}>Wix급 첫인상 기준으로 우선 개선할 5개</span>
                </div>
                <div className="template-gallery-featured">
                  {featuredTemplates.map((template) => (
                    <TemplateCard
                      key={`featured-${template.id}`}
                      template={template}
                      hovered={hoveredId === `featured-${template.id}`}
                      onHover={(id) => setHoveredId(id ? `featured-${id}` : null)}
                      onPreview={setPreviewTemplate}
                      onSelect={selectTemplate}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {filteredTemplates.length === 0 && !showBlankCard ? (
              <div style={emptyStateStyle}>조건에 맞는 템플릿이 없습니다. 필터를 줄이거나 전체 템플릿을 확인하세요.</div>
            ) : (
              <>
                <div style={sectionHeaderStyle}>
                  <h3 style={sectionTitleStyle}>전체 템플릿</h3>
                </div>
                <div className="template-gallery-grid">
                  {showBlankCard ? (
                    <button
                      type="button"
                      style={{
                        ...blankCardStyle,
                        borderColor: hoveredId === 'blank' ? '#123b63' : '#dbe3ef',
                        boxShadow: hoveredId === 'blank' ? '0 18px 38px rgba(15, 23, 42, 0.12)' : 'none',
                        transform: hoveredId === 'blank' ? 'translateY(-2px)' : 'none',
                      }}
                      onMouseEnter={() => setHoveredId('blank')}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => onSelect(null)}
                    >
                      <span style={{ fontSize: '2rem', color: '#123b63', lineHeight: 1 }}>+</span>
                      <span style={cardTitleStyle}>빈 페이지</span>
                      <span style={{ ...descriptionStyle, textAlign: 'center', minHeight: 0 }}>
                        자유 캔버스에서 새 페이지를 시작합니다.
                      </span>
                    </button>
                  ) : null}

                  {filteredTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      hovered={hoveredId === template.id}
                      onHover={setHoveredId}
                      onPreview={setPreviewTemplate}
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
          onClose={() => setPreviewTemplate(null)}
          onSelect={selectTemplate}
        />
      ) : null}
    </>
  );
}
