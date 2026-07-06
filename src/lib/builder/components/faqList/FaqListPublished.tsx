'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { BuilderFaqCategory, BuilderFaqItem } from '@/lib/builder/faq/faq-shared';
import { DEFAULT_FAQ_CATEGORIES } from '@/lib/builder/faq/faq-shared';
import type { Locale } from '@/lib/locales';
import { getFaqListCopy } from './faq-list-copy';
import styles from './FaqList.module.css';

export interface FaqItem {
  faqId?: string;
  question: string;
  answer: string;
  categoryId?: string;
  tags?: string[];
}

export interface FaqListContent {
  source?: 'static' | 'app';
  items?: FaqItem[];
  categoryId?: string;
  showSearch?: boolean;
  showCategoryFilter?: boolean;
  expandFirst?: boolean;
  schemaEnabled?: boolean;
  limit?: number;
}

function itemId(item: FaqItem | BuilderFaqItem, index: number): string {
  return ('faqId' in item && item.faqId) ? item.faqId : `static-${index}`;
}

function categoryLabel(categories: BuilderFaqCategory[], categoryId: string | undefined, locale: Locale): string {
  if (!categoryId) return '';
  return categories.find((category) => category.categoryId === categoryId)?.label[locale] ?? categoryId;
}

function normalizeStaticItem(item: FaqItem, index: number): BuilderFaqItem {
  const now = '2026-05-20T00:00:00.000Z';
  return {
    faqId: item.faqId ?? `static-${index}`,
    slug: item.faqId ?? `static-${index}`,
    locale: 'ko',
    question: item.question,
    answer: item.answer,
    categoryId: item.categoryId ?? 'static',
    tags: item.tags ?? [],
    status: 'published',
    sortOrder: index,
    schemaEnabled: true,
    createdAt: now,
    updatedAt: now,
  };
}

function readSearchParam(searchParams: ReturnType<typeof useSearchParams>, key: string): string {
  return searchParams?.get(key)?.trim() ?? '';
}

function buildWidgetHref(pathname: string, params: URLSearchParams): string {
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export default function FaqListPublished({
  node,
  locale = 'ko',
}: {
  node: { id?: string; content: FaqListContent };
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const content = node.content ?? {};
  const source = content.source ?? 'static';
  const useAppSource = source === 'app';
  const staticItems = useMemo(() => (content.items ?? []).map(normalizeStaticItem), [content.items]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlCategory = useAppSource ? readSearchParam(searchParams, 'category') : '';
  const urlQuery = useAppSource ? readSearchParam(searchParams, 'q') : '';
  const initialCategory = urlCategory || content.categoryId || 'all';
  const [appItems, setAppItems] = useState<BuilderFaqItem[]>([]);
  const [categories, setCategories] = useState<BuilderFaqCategory[]>(DEFAULT_FAQ_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [query, setQuery] = useState(urlQuery);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const copy = getFaqListCopy(locale);

  useEffect(() => {
    setSelectedCategory(urlCategory || content.categoryId || 'all');
  }, [content.categoryId, urlCategory]);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    if (!useAppSource) return;
    const controller = new AbortController();
    setLoading(true);
    const limit = Math.max(1, Math.min(100, Number(content.limit) || 50));
    fetch(`/api/faq?locale=${encodeURIComponent(locale)}&limit=${limit}`, {
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json?.ok) return;
        setAppItems(Array.isArray(json.items) ? json.items : []);
        setCategories(
          Array.isArray(json.categories) && json.categories.length > 0
            ? json.categories
            : DEFAULT_FAQ_CATEGORIES,
        );
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [content.limit, locale, useAppSource]);

  function replaceWidgetUrl(nextCategory: string, nextQuery: string) {
    if (!useAppSource) return;
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    params.delete('page');
    const trimmedQuery = nextQuery.trim();
    if (nextCategory && nextCategory !== 'all') params.set('category', nextCategory);
    else params.delete('category');
    if (trimmedQuery) params.set('q', trimmedQuery);
    else params.delete('q');

    const href = buildWidgetHref(pathname, params);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', href);
    }
    router.replace(href, { scroll: false });
  }

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    replaceWidgetUrl(selectedCategory, nextQuery);
  }

  function handleCategoryChange(nextCategory: string) {
    setSelectedCategory(nextCategory);
    replaceWidgetUrl(nextCategory, query);
  }

  const sourceItems = useAppSource ? appItems : staticItems;
  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return sourceItems.filter((item) => {
      if (selectedCategory && selectedCategory !== 'all' && item.categoryId !== selectedCategory) return false;
      if (!normalizedQuery) return true;
      return [
        item.question,
        item.answer,
        categoryLabel(categories, item.categoryId, locale),
        ...item.tags,
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [categories, locale, query, selectedCategory, sourceItems]);

  useEffect(() => {
    if (content.expandFirst === false) {
      setOpenId(null);
      return;
    }
    setOpenId((current) => {
      if (current && visibleItems.some((item, index) => itemId(item, index) === current)) return current;
      return visibleItems[0] ? itemId(visibleItems[0], 0) : null;
    });
  }, [content.expandFirst, visibleItems]);

  return (
    <div className={styles.root} data-builder-faq-widget="true" data-faq-source={source}>
      {(content.showSearch || (useAppSource && content.showSearch !== false)) ? (
        <label className={styles.search}>
          <span>{copy.searchLabel}</span>
          <input
            type="search"
            value={query}
            placeholder={copy.searchPlaceholder}
            onChange={(event) => handleQueryChange(event.currentTarget.value)}
          />
        </label>
      ) : null}

      {useAppSource && content.showCategoryFilter !== false && categories.length > 0 ? (
        <div className={styles.categories} aria-label={copy.categoriesLabel}>
          <button
            type="button"
            className={selectedCategory === 'all' ? styles.categoryActive : styles.category}
            aria-pressed={selectedCategory === 'all'}
            onClick={() => handleCategoryChange('all')}
          >
            {copy.all}
          </button>
          {categories.map((category) => (
            <button
              key={category.categoryId}
              type="button"
              className={selectedCategory === category.categoryId ? styles.categoryActive : styles.category}
              aria-pressed={selectedCategory === category.categoryId}
              data-builder-faq-category-filter={category.categoryId}
              onClick={() => handleCategoryChange(category.categoryId)}
            >
              {category.label[locale]}
            </button>
          ))}
        </div>
      ) : null}

      <div className={styles.list} aria-live="polite">
        {sourceItems.length === 0 ? (
          <div className={styles.empty} role="status">
            {loading ? copy.loading : copy.emptyState}
          </div>
        ) : visibleItems.length === 0 ? (
          <div className={styles.empty}>{copy.noResults}</div>
        ) : visibleItems.map((item, i) => {
          const id = itemId(item, i);
          const isOpen = openId === id;
          const buttonId = `${node.id ?? 'faq-list'}-${id}-button`;
          const panelId = `${node.id ?? 'faq-list'}-${id}-panel`;
          return (
            <div key={id} className={styles.item} data-builder-faq-item={id}>
              <button
                id={buttonId}
                type="button"
                onClick={() => setOpenId(isOpen ? null : id)}
                className={`${styles.question} builder-widget-focusable`}
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span>
                  {useAppSource ? <small>{categoryLabel(categories, item.categoryId, locale)}</small> : null}
                  {item.question}
                </span>
                <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} aria-hidden>
                  +
                </span>
              </button>
              <div
                id={panelId}
                className={styles.answer}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
              >
                {item.answer}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
