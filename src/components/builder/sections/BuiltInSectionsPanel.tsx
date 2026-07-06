'use client';

import { useEffect, useMemo, useState } from 'react';
import { SectionTemplateCard } from '@/components/builder/sections/SectionTemplateCard';
import type { Locale } from '@/lib/locales';
import {
  BUILT_IN_SECTION_CATEGORIES,
  builtInSectionTemplateMatchesQuery,
  getBuiltInSectionsByCategory,
  type BuiltInSectionCategory,
  type BuiltInSectionTemplate,
} from '@/lib/builder/sections/templates';
import {
  builtInSectionTemplateDisplayMatchesQuery,
  getBuiltInSectionsPanelCopy,
} from './section-panel-copy';
import styles from './SectionLibraryPanel.module.css';

function normalizePanelQuery(value: string | undefined): string {
  return (value ?? '').trim().toLocaleLowerCase('ko-KR');
}

export function BuiltInSectionsPanel({
  locale = 'ko',
  onInsert,
  query,
}: {
  locale?: Locale;
  onInsert: (template: BuiltInSectionTemplate) => void;
  query?: string;
}) {
  const normalizedQuery = normalizePanelQuery(query);
  const copy = getBuiltInSectionsPanelCopy(locale);
  const [activeCategory, setActiveCategory] = useState<BuiltInSectionCategory | 'all'>('all');
  const allByCategory = useMemo(() => getBuiltInSectionsByCategory(), []);
  const allTemplates = useMemo(
    () => BUILT_IN_SECTION_CATEGORIES.flatMap((category) => allByCategory[category]),
    [allByCategory],
  );
  const filteredTemplates = useMemo(
    () => (normalizedQuery
      ? allTemplates.filter((template) => (
        builtInSectionTemplateMatchesQuery(template, normalizedQuery)
        || builtInSectionTemplateDisplayMatchesQuery(template, locale, normalizedQuery)
      ))
      : allTemplates),
    [allTemplates, locale, normalizedQuery],
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
    <div className={styles.panelRoot} data-builder-built-in-section-library="true">
      <div className={styles.marketHeader}>
        <span className={styles.marketTitle}>
          <span className={styles.marketEyebrow}>{copy.marketEyebrow}</span>
          <strong className={styles.marketName}>{copy.marketName}</strong>
        </span>
        <span className={styles.marketCount} data-builder-built-in-section-result-count="true">
          {visibleTotal}/{filteredTemplates.length || 0}
        </span>
      </div>

      <div className={styles.filterGrid} aria-label={copy.categoryFilterAriaLabel}>
        <button
          type="button"
          className={styles.filterButton}
          data-builder-section-template-category-filter="all"
          data-active={activeCategory === 'all' ? 'true' : undefined}
          aria-pressed={activeCategory === 'all'}
          onClick={() => setActiveCategory('all')}
        >
          <span>{copy.allPacks}</span>
          <strong>{filteredTemplates.length}</strong>
        </button>
        {BUILT_IN_SECTION_CATEGORIES.map((category) => {
          const count = filteredByCategory[category]?.length ?? 0;
          return (
            <button
              key={category}
              type="button"
              className={styles.filterButton}
              data-builder-section-template-category-filter={category}
              data-active={activeCategory === category ? 'true' : undefined}
              aria-pressed={activeCategory === category}
              disabled={count === 0}
              onClick={() => setActiveCategory(category)}
            >
              <span>{copy.categoryLabels[category]}</span>
              <strong>{count}</strong>
            </button>
          );
        })}
      </div>

      {visibleTotal === 0 ? (
        <div className={styles.emptyState} data-builder-section-template-empty="true">
          {copy.emptyState}
        </div>
      ) : null}

      {visibleCategories.map((category) => {
        const sourceItems = normalizedQuery ? filteredByCategory[category] : allByCategory[category];
        const items = sourceItems.filter((template) => (
          activeCategory === 'all' || template.category === activeCategory
        ));
        if (items.length === 0) return null;

        return (
          <section key={category} className={styles.categorySection}>
            <div className={styles.categoryHeader}>
              <h4 className={styles.categoryLabel}>{copy.categoryLabels[category]}</h4>
              <span className={styles.categoryCount}>{items.length}</span>
            </div>
            <div className={styles.templateGrid}>
              {items.map((template) => (
                <SectionTemplateCard
                  key={template.id}
                  template={template}
                  locale={locale}
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
