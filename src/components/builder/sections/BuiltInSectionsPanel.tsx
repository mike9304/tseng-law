'use client';

import type { CSSProperties } from 'react';
import { SectionTemplateCard } from '@/components/builder/sections/SectionTemplateCard';
import {
  BUILT_IN_SECTION_CATEGORIES,
  getBuiltInSectionsByCategory,
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

export function BuiltInSectionsPanel({
  onInsert,
}: {
  onInsert: (template: BuiltInSectionTemplate) => void;
}) {
  const byCategory = getBuiltInSectionsByCategory();

  return (
    <div style={rootStyle}>
      {BUILT_IN_SECTION_CATEGORIES.map((category) => {
        const items = byCategory[category];
        if (items.length === 0) return null;

        return (
          <section key={category} style={categoryStyle}>
            <div style={categoryHeaderStyle}>
              <h4 style={categoryLabelStyle}>{CATEGORY_LABELS[category]}</h4>
              <span style={categoryCountStyle}>{items.length}</span>
            </div>
            <div style={gridStyle}>
              {items.map((template) => (
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
