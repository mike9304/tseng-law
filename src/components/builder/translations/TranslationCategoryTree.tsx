'use client';

import type { TranslationCategorySummary } from '@/lib/builder/translations/types';
import type { Locale } from '@/lib/locales';
import { getTranslationCopy } from './translation-copy';
import styles from './TranslationManager.module.css';

export default function TranslationCategoryTree({
  categories,
  selectedCategory,
  onSelectCategory,
  locale,
}: {
  categories: TranslationCategorySummary[];
  selectedCategory: TranslationCategorySummary['key'];
  onSelectCategory: (category: TranslationCategorySummary['key']) => void;
  locale?: Locale;
}) {
  const copy = getTranslationCopy(locale ?? 'ko');
  return (
    <nav className={styles.categoryList} aria-label={copy.categoryTreeLabel}>
      {categories.map((category) => (
        <button
          className={[
            styles.categoryButton,
            selectedCategory === category.key ? styles.categoryButtonActive : '',
          ].join(' ')}
          key={category.key}
          type="button"
          aria-pressed={selectedCategory === category.key}
          data-translation-category={category.key}
          onClick={() => onSelectCategory(category.key)}
        >
          <span>
            <span className={styles.categoryLabel}>{category.label}</span>
            <span className={styles.categoryStats}>
              {category.total} {copy.managerStrings}
            </span>
          </span>
          <span className={styles.categoryStats}>
            {category.missing + category.outdated}
          </span>
        </button>
      ))}
    </nav>
  );
}
