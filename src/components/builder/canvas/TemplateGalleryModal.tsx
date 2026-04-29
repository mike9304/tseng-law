'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { getAllTemplates } from '@/lib/builder/templates/registry';
import type { PageTemplate } from '@/lib/builder/templates/types';
import TemplateThumbnailPlaceholder from './TemplateThumbnailPlaceholder';
import {
  TEMPLATE_CATEGORIES,
  TEMPLATE_CATEGORY_LABELS,
  type TemplateCategoryKey,
} from './template-categories';

const allTemplates = getAllTemplates();

const backdropStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(15, 23, 42, 0.46)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  zIndex: 10000,
  animation: 'templateGalleryFadeIn 180ms ease',
};

const modalStyle: CSSProperties = {
  width: '90vw',
  height: '88vh',
  maxWidth: 1280,
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 28px 80px rgba(15, 23, 42, 0.26)',
  overflow: 'hidden',
  display: 'grid',
  gridTemplateRows: 'auto minmax(0, 1fr)',
  animation: 'templateGalleryScaleIn 200ms ease',
};

const headerStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  gap: 16,
  alignItems: 'start',
  padding: '22px 24px 18px',
  borderBottom: '1px solid #e2e8f0',
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: '1.25rem',
  fontWeight: 800,
  color: '#0f172a',
};

const subtitleStyle: CSSProperties = {
  margin: '5px 0 0',
  fontSize: '0.82rem',
  color: '#64748b',
};

const closeButtonStyle: CSSProperties = {
  width: 34,
  height: 34,
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  background: '#fff',
  color: '#475569',
  cursor: 'pointer',
  fontSize: '1.15rem',
  lineHeight: 1,
};

const bodyStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '214px minmax(0, 1fr)',
  minHeight: 0,
};

const sidebarStyle: CSSProperties = {
  borderRight: '1px solid #e2e8f0',
  background: '#f8fafc',
  padding: '18px 12px',
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
  fontWeight: 700,
};

const categoryCountStyle: CSSProperties = {
  color: '#94a3b8',
  fontSize: '0.72rem',
  fontWeight: 800,
};

const contentStyle: CSSProperties = {
  minWidth: 0,
  minHeight: 0,
  padding: 22,
  overflowY: 'auto',
  background: '#fff',
};

const searchRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  alignItems: 'center',
  gap: 14,
  marginBottom: 18,
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
  fontWeight: 700,
};

const cardStyle: CSSProperties = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  background: '#fff',
  overflow: 'hidden',
  cursor: 'pointer',
  textAlign: 'left',
  padding: 0,
  transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease',
};

const cardBodyStyle: CSSProperties = {
  display: 'grid',
  gap: 8,
  padding: '14px 15px 15px',
};

const cardTitleStyle: CSSProperties = {
  fontSize: '0.96rem',
  fontWeight: 800,
  color: '#0f172a',
  lineHeight: 1.25,
};

const chipStyle: CSSProperties = {
  width: 'fit-content',
  borderRadius: 999,
  background: '#eff6ff',
  color: '#123b63',
  padding: '3px 8px',
  fontSize: '0.7rem',
  fontWeight: 800,
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

const actionPillStyle: CSSProperties = {
  position: 'absolute',
  right: 12,
  top: 112,
  borderRadius: 999,
  background: '#123b63',
  color: '#fff',
  padding: '7px 11px',
  fontSize: '0.74rem',
  fontWeight: 800,
  boxShadow: '0 12px 24px rgba(18, 59, 99, 0.24)',
  transition: 'opacity 140ms ease, transform 140ms ease',
};

const emptyStateStyle: CSSProperties = {
  padding: 36,
  border: '1px dashed #cbd5e1',
  borderRadius: 12,
  background: '#f8fafc',
  color: '#64748b',
  textAlign: 'center',
  fontSize: '0.9rem',
};

const blankCardStyle: CSSProperties = {
  ...cardStyle,
  minHeight: 286,
  justifyContent: 'center',
  alignItems: 'center',
  gap: 12,
  padding: 22,
  background: '#f8fafc',
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
  const haystack = [
    template.id,
    template.name,
    template.description,
    template.category,
    categoryLabel,
    template.subcategory,
  ].join(' ').toLowerCase();
  return haystack.includes(query);
}

export default function TemplateGalleryModal({
  onSelect,
  onClose,
}: {
  onSelect: (document: BuilderCanvasDocument | null) => void;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<TemplateCategoryKey>('all');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearchQuery(searchInput.trim().toLowerCase());
    }, 200);
    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const filteredTemplates = useMemo(() => {
    return allTemplates.filter((template) => {
      const categoryMatches = activeCategory === 'all' || template.category === activeCategory;
      return categoryMatches && matchesSearch(template, searchQuery);
    });
  }, [activeCategory, searchQuery]);

  const showBlankCard = activeCategory === 'all' && searchQuery.length === 0;

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) onClose();
    },
    [onClose],
  );

  const selectTemplate = (template: PageTemplate) => {
    onSelect(cloneTemplateDocument(template.document));
  };

  return (
    <div style={backdropStyle} onClick={handleBackdropClick}>
      <style>{`
        @keyframes templateGalleryFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes templateGalleryScaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .template-gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }
        @media (min-width: 1320px) {
          .template-gallery-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
        @media (max-width: 1023px) {
          .template-gallery-grid {
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
          .template-gallery-grid {
            grid-template-columns: minmax(0, 1fr);
          }
          .template-gallery-search-row {
            grid-template-columns: minmax(0, 1fr) !important;
          }
        }
      `}</style>
      <div
        ref={modalRef}
        style={modalStyle}
        role="dialog"
        aria-modal="true"
        aria-label="템플릿 갤러리"
      >
        <header style={headerStyle}>
          <div>
            <h2 style={titleStyle}>템플릿 갤러리</h2>
            <p style={subtitleStyle}>카테고리와 검색으로 페이지 템플릿을 선택하세요.</p>
          </div>
          <button type="button" style={closeButtonStyle} onClick={onClose} title="닫기">
            ×
          </button>
        </header>

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
            <div className="template-gallery-search-row" style={searchRowStyle}>
              <input
                type="search"
                value={searchInput}
                placeholder="템플릿 검색..."
                style={searchInputStyle}
                onChange={(event) => setSearchInput(event.target.value)}
                autoFocus
              />
              <div style={resultCountStyle}>{filteredTemplates.length}개 템플릿</div>
            </div>

            {filteredTemplates.length === 0 && !showBlankCard ? (
              <div style={emptyStateStyle}>조건에 맞는 템플릿이 없습니다</div>
            ) : (
              <div className="template-gallery-grid">
                {showBlankCard ? (
                  <button
                    type="button"
                    style={{
                      ...blankCardStyle,
                      borderColor: hoveredId === 'blank' ? '#123b63' : '#e2e8f0',
                      boxShadow: hoveredId === 'blank' ? '0 18px 38px rgba(15, 23, 42, 0.12)' : 'none',
                      transform: hoveredId === 'blank' ? 'translateY(-2px) scale(1.01)' : 'none',
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

                {filteredTemplates.map((template) => {
                  const hovered = hoveredId === template.id;
                  const categoryLabel = TEMPLATE_CATEGORY_LABELS[template.category] ?? template.category;
                  return (
                    <button
                      key={template.id}
                      type="button"
                      style={{
                        ...cardStyle,
                        borderColor: hovered ? '#123b63' : '#e2e8f0',
                        boxShadow: hovered ? '0 18px 38px rgba(15, 23, 42, 0.14)' : 'none',
                        transform: hovered ? 'translateY(-2px) scale(1.02)' : 'none',
                      }}
                      onMouseEnter={() => setHoveredId(template.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => selectTemplate(template)}
                    >
                      <div style={{ height: 160, background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <TemplateThumbnailPlaceholder template={template} width={240} height={160} />
                      </div>
                      <span
                        style={{
                          ...actionPillStyle,
                          opacity: hovered ? 1 : 0,
                          transform: hovered ? 'translateY(0)' : 'translateY(6px)',
                        }}
                      >
                        이 템플릿 사용
                      </span>
                      <span style={cardBodyStyle}>
                        <span style={chipStyle}>{categoryLabel}</span>
                        <span style={cardTitleStyle}>{template.name}</span>
                        <span style={descriptionStyle}>{template.description}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
