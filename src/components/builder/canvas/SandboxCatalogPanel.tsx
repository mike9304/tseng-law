'use client';

import { useMemo, useState } from 'react';
import { listComponents } from '@/lib/builder/components/registry';
import type { BuilderComponentCategory, BuilderComponentDefinition } from '@/lib/builder/components/define';
import {
  createCanvasNodeTemplate,
  useBuilderCanvasStore,
} from '@/lib/builder/canvas/store';
import type { BuilderCanvasNodeKind } from '@/lib/builder/canvas/types';
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
  domain: ['composite'],
};

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

export default function SandboxCatalogPanel() {
  const { document, addNode } = useBuilderCanvasStore();
  const [open, setOpen] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState<Record<string, boolean>>({});
  const nodes = document?.nodes ?? [];
  const components = listComponents();

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
      .map((category) => ({
        category,
        components: [...(buckets.get(category) ?? [])].sort((left, right) =>
          compareByCategoryPriority(category, left, right)),
      }));
  }, [components]);

  return (
    <section className={styles.panelSection}>
      <header className={styles.panelSectionHeader}>
        <div>
          <span>Catalog</span>
          <strong>{components.length} components</strong>
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
                    <div key={component.kind} style={cardStyle}>
                      <button
                        type="button"
                        style={dragButtonStyle}
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
                        onClick={() => {
                          addNode(resolveCenteredNode(component.kind as BuilderCanvasNodeKind, nodes.length));
                        }}
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
      </div>
    </section>
  );
}
