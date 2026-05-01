'use client';

import type { TranslationCategorySummary } from '@/lib/builder/translations/types';
import styles from './TranslationManager.module.css';

export default function TranslationCategoryTree({
  categories,
  selectedCategory,
  onSelectCategory,
}: {
  categories: TranslationCategorySummary[];
  selectedCategory: TranslationCategorySummary['key'];
  onSelectCategory: (category: TranslationCategorySummary['key']) => void;
}) {
  return (
    <nav className={styles.categoryList} aria-label="Translation categories">
      {categories.map((category) => (
        <button
          className={[
            styles.categoryButton,
            selectedCategory === category.key ? styles.categoryButtonActive : '',
          ].join(' ')}
          key={category.key}
          type="button"
          onClick={() => onSelectCategory(category.key)}
        >
          <span>
            <span className={styles.categoryLabel}>{category.label}</span>
            <span className={styles.categoryStats}>
              {category.total} strings
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
