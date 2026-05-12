'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { SectionTemplateCard } from '@/components/builder/sections/SectionTemplateCard';
import {
  BUILT_IN_SECTION_CATEGORIES,
  builtInSectionTemplateMatchesQuery,
  getBuiltInSectionsByCategory,
  getBuiltInSectionSearchResults,
  type BuiltInSectionCategory,
  type BuiltInSectionTemplate,
} from '@/lib/builder/sections/templates';

const CATEGORY_LABELS: Record<BuiltInSectionCategory, string> = {
  hero: 'Hero',
  features: 'Features',
  testimonials: 'Testimonials',
  cta: 'CTA',
  footer: 'Footer',
  legal: 'Legal',
  stats: 'Stats',
  pricing: 'Pricing',
  team: 'Team',
  gallery: 'Gallery',
  faq: 'FAQ',
  services: 'Services',
  contact: 'Contact',
};

const rootStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const categoryStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 7,
};

const categoryHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '2px 0',
};

const categoryLabelStyle: CSSProperties = {
  margin: 0,
  fontSize: '0.7rem',
  color: '#64748b',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 0.4,
};

const categoryCountStyle: CSSProperties = {
  fontSize: '0.68rem',
  color: '#94a3b8',
  fontWeight: 600,
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 8,
};

const marketHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 10,
  padding: '10px 10px 8px',
  border: '1px solid #dbe4ee',
  borderRadius: 10,
  background: '#f8fafc',
};

const marketTitleStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

const marketEyebrowStyle: CSSProperties = {
  fontSize: '0.62rem',
  fontWeight: 800,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
};

const marketNameStyle: CSSProperties = {
  fontSize: '0.86rem',
  fontWeight: 800,
  color: '#0f172a',
};

const marketCountStyle: CSSProperties = {
  padding: '3px 7px',
  borderRadius: 999,
  background: '#e0f2fe',
  color: '#075985',
  fontSize: '0.67rem',
  fontWeight: 800,
  whiteSpace: 'nowrap',
};

const filterGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 6,
};

const filterButtonStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 6,
  padding: '6px 8px',
  border: '1px solid #dbe4ee',
  borderRadius: 8,
  background: '#ffffff',
  color: '#334155',
  cursor: 'pointer',
  fontSize: '0.68rem',
  fontWeight: 750,
};

const activeFilterButtonStyle: CSSProperties = {
  ...filterButtonStyle,
  borderColor: '#2563eb',
  background: '#eff6ff',
  color: '#1d4ed8',
};

const emptyStyle: CSSProperties = {
  padding: '10px',
  border: '1px dashed #cbd5e1',
  borderRadius: 10,
  color: '#64748b',
  fontSize: '0.72rem',
  lineHeight: 1.4,
};

function normalizePanelQuery(value: string | undefined): string {
  return (value ?? '').trim().toLocaleLowerCase('ko-KR');
}

export function BuiltInSectionsPanel({
  onInsert,
  query,
}: {
  onInsert: (template: BuiltInSectionTemplate) => void;
  query?: string;
}) {
  const normalizedQuery = normalizePanelQuery(query);
  const [activeCategory, setActiveCategory] = useState<BuiltInSectionCategory | 'all'>('all');
  const allByCategory = useMemo(() => getBuiltInSectionsByCategory(), []);
  const filteredTemplates = useMemo(
    () => getBuiltInSectionSearchResults(normalizedQuery),
    [normalizedQuery],
  );
  const filteredByCategory = useMemo(() => {
    const buckets = Object.fromEntries(
      BUILT_IN_SECTION_CATEGORIES.map((category) => [category, [] as BuiltInSectionTemplate[]]),
    ) as Record<BuiltInSectionCategory, BuiltInSectionTemplate[]>;

    for (const template of filteredTemplates) {
      buckets[template.category].push(template);
    }

    return buckets;
  }, [filteredTemplates]);
  const visibleCategories = activeCategory === 'all'
    ? BUILT_IN_SECTION_CATEGORIES
    : [activeCategory];
  const visibleTotal = activeCategory === 'all'
    ? filteredTemplates.length
    : filteredByCategory[activeCategory]?.length ?? 0;

  useEffect(() => {
    setActiveCategory('all');
  }, [normalizedQuery]);

  return (
    <div style={rootStyle} data-builder-built-in-section-library="true">
      <div style={marketHeaderStyle}>
        <span style={marketTitleStyle}>
          <span style={marketEyebrowStyle}>Design packs</span>
          <strong style={marketNameStyle}>Section template market</strong>
        </span>
        <span style={marketCountStyle} data-builder-built-in-section-result-count="true">
          {visibleTotal}/{filteredTemplates.length || 0}
        </span>
      </div>

      <div style={filterGridStyle} aria-label="Section template categories">
        <button
          type="button"
          style={activeCategory === 'all' ? activeFilterButtonStyle : filterButtonStyle}
          data-builder-section-template-category-filter="all"
          aria-pressed={activeCategory === 'all'}
          onClick={() => setActiveCategory('all')}
        >
          <span>All packs</span>
          <strong>{filteredTemplates.length}</strong>
        </button>
        {BUILT_IN_SECTION_CATEGORIES.map((category) => {
          const count = filteredByCategory[category]?.length ?? 0;
          return (
            <button
              key={category}
              type="button"
              style={activeCategory === category ? activeFilterButtonStyle : filterButtonStyle}
              data-builder-section-template-category-filter={category}
              aria-pressed={activeCategory === category}
              disabled={count === 0}
              onClick={() => setActiveCategory(category)}
            >
              <span>{CATEGORY_LABELS[category]}</span>
              <strong>{count}</strong>
            </button>
          );
        })}
      </div>

      {visibleTotal === 0 ? (
        <div style={emptyStyle} data-builder-section-template-empty="true">
          검색어와 맞는 섹션 템플릿이 없습니다.
        </div>
      ) : null}

      {visibleCategories.map((category) => {
        const sourceItems = normalizedQuery ? filteredByCategory[category] : allByCategory[category];
        const items = sourceItems.filter((template) => (
          activeCategory === 'all' || template.category === activeCategory
        ));
        if (items.length === 0) return null;

        return (
          <section key={category} style={categoryStyle}>
            <div style={categoryHeaderStyle}>
              <h4 style={categoryLabelStyle}>{CATEGORY_LABELS[category]}</h4>
              <span style={categoryCountStyle}>{items.length}</span>
            </div>
            <div style={gridStyle}>
              {items.filter((template) => builtInSectionTemplateMatchesQuery(template, normalizedQuery)).map((template) => (
                <SectionTemplateCard
                  key={template.id}
                  template={template}
                  onClick={() => onInsert(template)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
