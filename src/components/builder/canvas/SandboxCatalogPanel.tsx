'use client';

import { useMemo, useState } from 'react';
import { listComponents } from '@/lib/builder/components/registry';
import type { BuilderComponentCategory, BuilderComponentDefinition } from '@/lib/builder/components/define';
import {
  createCanvasNodeTemplate,
  useBuilderCanvasStore,
} from '@/lib/builder/canvas/store';
import type { BuilderCanvasNodeKind } from '@/lib/builder/canvas/types';
import { insertSectionSnapshot } from '@/lib/builder/sections/insertSection';
import type { BuiltInSectionTemplate } from '@/lib/builder/sections/templates';
import { BuiltInSectionsPanel } from '@/components/builder/sections/BuiltInSectionsPanel';
import SavedSectionsPanel from '@/components/builder/sections/SavedSectionsPanel';
import type { Locale } from '@/lib/locales';
import styles from './SandboxPage.module.css';

const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 880;

const CATEGORY_ORDER: BuilderComponentCategory[] = ['basic', 'media', 'layout', 'domain'];
const CATEGORY_LABELS: Record<BuilderComponentCategory, string> = {
  basic: 'Basic',
  media: 'Media',
  layout: 'Layout',
  domain: 'Domain',
  advanced: 'Advanced',
};
const CATEGORY_SUBLABELS: Record<BuilderComponentCategory, string> = {
  basic: 'text, button, heading',
  media: 'image, gallery, video',
  layout: 'container, section',
  domain: 'composite, domain blocks',
  advanced: 'embed, spacer, divider',
};
const CATEGORY_ICONS: Record<BuilderComponentCategory, string> = {
  basic: 'Aa',
  media: '◩',
  layout: '▦',
  domain: '◈',
  advanced: '⋯',
};

const KIND_PRIORITY: Partial<Record<BuilderComponentCategory, string[]>> = {
  basic: ['text', 'button', 'heading'],
  media: ['image'],
  layout: ['container', 'section'],
  domain: [
    'composite',
    'form',
    'form-input',
    'form-textarea',
    'form-select',
    'form-radio',
    'form-checkbox',
    'form-date',
    'form-file',
    'form-submit',
  ],
};

const FEATURED_KINDS: BuilderCanvasNodeKind[] = ['text', 'button', 'image', 'container', 'form'];

const sectionGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 10,
};

const categorySectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  padding: '10px 0 4px',
  borderTop: '1px solid #e2e8f0',
};

const categoryButtonStyle = (open: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #dbe4ee',
  borderRadius: 10,
  background: open ? '#f8fbff' : '#fff',
  color: '#0f172a',
  cursor: 'pointer',
  textAlign: 'left',
});

const categoryMetaStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};

const categoryIconStyle: React.CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: 10,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#e2e8f0',
  color: '#0f172a',
  fontSize: '0.82rem',
  fontWeight: 700,
};

const categoryTitleStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const categoryNameStyle: React.CSSProperties = {
  fontSize: '0.83rem',
  fontWeight: 700,
  color: '#0f172a',
};

const categoryHintStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  color: '#64748b',
};

const cardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 10,
  border: '1px solid #dbe4ee',
  borderRadius: 12,
  background: '#fff',
  boxShadow: '0 6px 18px rgba(15, 23, 42, 0.05)',
};

const dragButtonStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 8,
  width: '100%',
  padding: 0,
  border: 'none',
  background: 'transparent',
  cursor: 'grab',
  textAlign: 'left',
};

const cardIconStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 10,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#eff6ff',
  color: '#123b63',
  fontSize: '1rem',
  fontWeight: 700,
};

const cardNameStyle: React.CSSProperties = {
  fontSize: '0.82rem',
  fontWeight: 700,
  color: '#0f172a',
};

const cardMetaStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  color: '#64748b',
};

const quickAddButtonStyle: React.CSSProperties = {
  padding: '6px 10px',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  background: '#fff',
  color: '#334155',
  fontSize: '0.76rem',
  fontWeight: 600,
  cursor: 'pointer',
};

function resolveCenteredNode(
  kind: BuilderCanvasNodeKind,
  existingCount: number,
) {
  const seed = createCanvasNodeTemplate(kind, 0, 0, existingCount);
  const cascadeOffset = (existingCount % 6) * 18;
  return {
    ...seed,
    rect: {
      ...seed.rect,
      x: Math.round((STAGE_WIDTH - seed.rect.width) / 2 + cascadeOffset),
      y: Math.round((STAGE_HEIGHT - seed.rect.height) / 2 + cascadeOffset),
    },
  };
}

function getDisplayCategory(component: BuilderComponentDefinition): BuilderComponentCategory {
  if (component.kind === 'image') return 'media';
  return component.category;
}

function compareByCategoryPriority(
  category: BuilderComponentCategory,
  left: BuilderComponentDefinition,
  right: BuilderComponentDefinition,
): number {
  const priority = KIND_PRIORITY[category] ?? [];
  const leftIndex = priority.indexOf(left.kind);
  const rightIndex = priority.indexOf(right.kind);

  if (leftIndex !== -1 || rightIndex !== -1) {
    if (leftIndex === -1) return 1;
    if (rightIndex === -1) return -1;
    return leftIndex - rightIndex;
  }

  return left.displayName.localeCompare(right.displayName, 'ko');
}

function normalizeSearchTerm(value: string): string {
  return value.trim().toLocaleLowerCase('ko-KR');
}

function componentMatchesSearch(component: BuilderComponentDefinition, query: string): boolean {
  if (!query) return true;
  return [
    component.displayName,
    component.kind,
    component.category,
    getDisplayCategory(component),
  ].some((value) => String(value).toLocaleLowerCase('ko-KR').includes(query));
}

export default function SandboxCatalogPanel({ locale }: { locale?: Locale }) {
  const { document, addNode, addNodes, setDraftSaveState } = useBuilderCanvasStore();
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [categoryOpen, setCategoryOpen] = useState<Record<string, boolean>>({
    'built-in-sections': true,
    'saved-sections': true,
  });
  const nodes = document?.nodes ?? [];
  const components = listComponents();
  const effectiveLocale: Locale = locale ?? (document?.locale as Locale) ?? 'ko';
  const normalizedQuery = normalizeSearchTerm(query);

  const featuredComponents = useMemo(() => (
    FEATURED_KINDS
      .map((kind) => components.find((component) => component.kind === kind))
      .filter((component): component is BuilderComponentDefinition => Boolean(component))
  ), [components]);

  const groupedCategories = useMemo(() => {
    const buckets = new Map<BuilderComponentCategory, BuilderComponentDefinition[]>();

    for (const component of components) {
      const category = getDisplayCategory(component);
      const current = buckets.get(category) ?? [];
      current.push(component);
      buckets.set(category, current);
    }

    const remainingCategories = [...buckets.keys()].filter(
      (category) => !CATEGORY_ORDER.includes(category),
    );

    return [...CATEGORY_ORDER, ...remainingCategories]
      .filter((category) => (buckets.get(category) ?? []).length > 0)
      .map((category) => {
        const filteredComponents = [...(buckets.get(category) ?? [])]
          .filter((component) => componentMatchesSearch(component, normalizedQuery))
          .sort((left, right) => compareByCategoryPriority(category, left, right));

        return {
          category,
          components: filteredComponents,
        };
      })
      .filter(({ components: categoryComponents }) => categoryComponents.length > 0);
  }, [components, normalizedQuery]);

  const visibleComponentCount = groupedCategories.reduce(
    (count, group) => count + group.components.length,
    0,
  );

  function handleQuickAdd(kind: BuilderCanvasNodeKind) {
    addNode(resolveCenteredNode(kind, nodes.length));
    setDraftSaveState('saving');
  }

  function handleInsertBuiltInSection(template: BuiltInSectionTemplate) {
    if (!document) return;
    const result = insertSectionSnapshot(template.nodes, template.rootNodeId);
    if (result.nodes.length === 0) return;
    addNodes(result.nodes, result.rootNodeId);
    setDraftSaveState('saving');
  }

  return (
    <section className={styles.panelSection}>
      <header className={styles.panelSectionHeader}>
        <div>
          <span>Catalog</span>
          <strong>
            {normalizedQuery ? `${visibleComponentCount}/${components.length}` : components.length} components
          </strong>
        </div>
        <button
          type="button"
          className={styles.panelHeaderButton}
          title={open ? '카탈로그 접기' : '카탈로그 열기'}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? 'Hide' : 'Show'}
        </button>
      </header>
      <div className={`${styles.panelBody} ${!open ? styles.panelBodyCollapsed : ''}`}>
        <p className={styles.panelCopy}>
          registry 컴포넌트를 카테고리별로 묶었습니다. drag 로 캔버스에 추가하거나 quick-add 로 중앙에 바로 생성합니다.
        </p>

        <label className={styles.catalogSearchLabel}>
          <span>Search elements</span>
          <input
            type="search"
            aria-label="Search add elements"
            className={styles.catalogSearchInput}
            placeholder="Text, button, image..."
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </label>

        <div className={styles.catalogQuickStrip} aria-label="Popular add elements">
          {featuredComponents.map((component) => (
            <button
              key={component.kind}
              type="button"
              className={styles.catalogQuickButton}
              data-builder-add-quick-kind={component.kind}
              onClick={() => handleQuickAdd(component.kind as BuilderCanvasNodeKind)}
            >
              <span>{component.icon}</span>
              <strong>{component.displayName}</strong>
            </button>
          ))}
        </div>

        {normalizedQuery ? (
          <div className={styles.catalogResultMeta} aria-live="polite">
            Showing {visibleComponentCount} result{visibleComponentCount === 1 ? '' : 's'} for “{query.trim()}”
          </div>
        ) : null}

        {/* Built-in section templates — normalized section snapshots. */}
        {!normalizedQuery ? (
          <div style={categorySectionStyle}>
            <button
              type="button"
              style={categoryButtonStyle(categoryOpen['built-in-sections'] ?? true)}
              onClick={() => {
                setCategoryOpen((current) => ({
                  ...current,
                  'built-in-sections': !(current['built-in-sections'] ?? true),
                }));
              }}
            >
              <span style={categoryMetaStyle}>
                <span style={categoryIconStyle}>▤</span>
                <span style={categoryTitleStyle}>
                  <span style={categoryNameStyle}>Section templates</span>
                  <span style={categoryHintStyle}>
                    바로 삽입 가능한 기본 섹션
                  </span>
                </span>
              </span>
              <span style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 700 }}>
                {(categoryOpen['built-in-sections'] ?? true) ? '−' : '+'}
              </span>
            </button>

            {(categoryOpen['built-in-sections'] ?? true) ? (
              <BuiltInSectionsPanel onInsert={handleInsertBuiltInSection} />
            ) : null}
          </div>
        ) : null}

        {/* Saved sections — Wix Studio "Saved Sections" parity. */}
        {!normalizedQuery ? (
          <div style={categorySectionStyle}>
            <button
              type="button"
              style={categoryButtonStyle(categoryOpen['saved-sections'] ?? true)}
              onClick={() => {
                setCategoryOpen((current) => ({
                  ...current,
                  'saved-sections': !(current['saved-sections'] ?? true),
                }));
              }}
            >
              <span style={categoryMetaStyle}>
                <span style={categoryIconStyle}>★</span>
                <span style={categoryTitleStyle}>
                  <span style={categoryNameStyle}>Saved sections</span>
                  <span style={categoryHintStyle}>
                    내가 저장한 섹션 라이브러리
                  </span>
                </span>
              </span>
              <span style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 700 }}>
                {(categoryOpen['saved-sections'] ?? true) ? '−' : '+'}
              </span>
            </button>

            {(categoryOpen['saved-sections'] ?? true) ? (
              <SavedSectionsPanel locale={effectiveLocale} />
            ) : null}
          </div>
        ) : null}

        {groupedCategories.map(({ category, components: categoryComponents }) => {
          const isOpen = categoryOpen[category] ?? true;
          return (
            <div key={category} style={categorySectionStyle}>
              <button
                type="button"
                style={categoryButtonStyle(isOpen)}
                onClick={() => {
                  setCategoryOpen((current) => ({
                    ...current,
                    [category]: !isOpen,
                  }));
                }}
              >
                <span style={categoryMetaStyle}>
                  <span style={categoryIconStyle}>{CATEGORY_ICONS[category]}</span>
                  <span style={categoryTitleStyle}>
                    <span style={categoryNameStyle}>{CATEGORY_LABELS[category]}</span>
                    <span style={categoryHintStyle}>
                      {CATEGORY_SUBLABELS[category]} · {categoryComponents.length}
                    </span>
                  </span>
                </span>
                <span style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 700 }}>
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {isOpen ? (
                <div style={sectionGridStyle}>
                  {categoryComponents.map((component) => (
                    <div key={component.kind} style={cardStyle} data-builder-add-card={component.kind}>
                      <button
                        type="button"
                        style={dragButtonStyle}
                        data-builder-add-card-kind={component.kind}
                        title={`${component.displayName} — 캔버스로 드래그하여 추가`}
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.setData('application/x-builder-node-kind', component.kind);
                          event.dataTransfer.effectAllowed = 'copy';
                        }}
                      >
                        <span style={cardIconStyle}>{component.icon}</span>
                        <span style={cardNameStyle}>{component.displayName}</span>
                        <span style={cardMetaStyle}>{component.kind} · drag to canvas</span>
                      </button>

                      <button
                        type="button"
                        style={quickAddButtonStyle}
                        title={`${component.displayName} 캔버스 중앙에 추가`}
                        onClick={() => handleQuickAdd(component.kind as BuilderCanvasNodeKind)}
                      >
                        Quick add
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}

        {normalizedQuery && visibleComponentCount === 0 ? (
          <div className={styles.catalogEmptyState}>
            <strong>No matching elements</strong>
            <span>Try text, image, button, form, section.</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
