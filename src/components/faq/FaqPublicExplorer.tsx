'use client';

import { useMemo, useState } from 'react';
import type { BuilderFaqCategory, BuilderFaqItem } from '@/lib/builder/faq/faq-shared';
import type { Locale } from '@/lib/locales';
import styles from './FaqPublicExplorer.module.css';

interface FaqPublicExplorerProps {
  locale: Locale;
  categories: BuilderFaqCategory[];
  items: BuilderFaqItem[];
  initialCategory?: string;
}

const copy: Record<Locale, {
  all: string;
  search: string;
  clear: string;
  count: (count: number) => string;
  empty: string;
}> = {
  ko: {
    all: '전체',
    search: 'FAQ 검색',
    clear: '초기화',
    count: (count) => `${count}개 질문`,
    empty: '조건에 맞는 질문이 없습니다.',
  },
  'zh-hant': {
    all: '全部',
    search: '搜尋 FAQ',
    clear: '清除',
    count: (count) => `${count} 個問題`,
    empty: '沒有符合條件的問題。',
  },
  en: {
    all: 'All',
    search: 'Search FAQ',
    clear: 'Clear',
    count: (count) => `${count} questions`,
    empty: 'No questions match these filters.',
  },
};

function categoryLabel(categories: BuilderFaqCategory[], categoryId: string, locale: Locale): string {
  return categories.find((category) => category.categoryId === categoryId)?.label[locale] ?? categoryId;
}

export default function FaqPublicExplorer({
  locale,
  categories,
  items,
  initialCategory = 'all',
}: FaqPublicExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(items[0]?.faqId ?? null);
  const text = copy[locale];

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;
      return [
        item.question,
        item.answer,
        categoryLabel(categories, item.categoryId, locale),
        ...item.tags,
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [categories, items, locale, query, selectedCategory]);

  function clearFilters() {
    setSelectedCategory('all');
    setQuery('');
    setOpenId(items[0]?.faqId ?? null);
  }

  return (
    <section className={styles.root} data-public-faq-explorer="true" aria-label={text.search}>
      <div className={styles.controls}>
        <label className={styles.searchLabel}>
          <span>{text.search}</span>
          <input
            type="search"
            value={query}
            placeholder={text.search}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </label>
        <div className={styles.count} role="status">{text.count(filteredItems.length)}</div>
      </div>

      <div className={styles.categoryRail} aria-label="FAQ categories">
        <button
          type="button"
          className={selectedCategory === 'all' ? styles.categoryActive : styles.category}
          aria-pressed={selectedCategory === 'all'}
          onClick={() => setSelectedCategory('all')}
        >
          {text.all}
        </button>
        {categories.map((category) => (
          <button
            key={category.categoryId}
            type="button"
            className={selectedCategory === category.categoryId ? styles.categoryActive : styles.category}
            aria-pressed={selectedCategory === category.categoryId}
            onClick={() => setSelectedCategory(category.categoryId)}
          >
            {category.label[locale]}
          </button>
        ))}
        {(selectedCategory !== 'all' || query) ? (
          <button type="button" className={styles.clear} onClick={clearFilters}>
            {text.clear}
          </button>
        ) : null}
      </div>

      {filteredItems.length === 0 ? (
        <div className={styles.empty}>{text.empty}</div>
      ) : (
        <div className={styles.list}>
          {filteredItems.map((item, index) => {
            const isOpen = openId === item.faqId;
            const buttonId = `faq-app-${item.faqId}-button`;
            const panelId = `faq-app-${item.faqId}-panel`;
            return (
              <article
                key={item.faqId}
                id={item.slug}
                className={styles.item}
                data-public-faq-item={item.faqId}
                data-public-faq-category={item.categoryId}
              >
                <button
                  id={buttonId}
                  type="button"
                  className={styles.question}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : item.faqId)}
                >
                  <span>
                    <small>{categoryLabel(categories, item.categoryId, locale)}</small>
                    {item.question}
                  </span>
                  <span aria-hidden className={styles.arrow}>{isOpen ? '-' : '+'}</span>
                </button>
                <div
                  id={panelId}
                  className={styles.panel}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                >
                  <p>{item.answer}</p>
                </div>
                {index < filteredItems.length - 1 ? <span className={styles.divider} /> : null}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
