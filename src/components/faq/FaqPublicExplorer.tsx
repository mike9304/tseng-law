'use client';

import { useEffect, useMemo, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { BuilderFaqCategory, BuilderFaqItem } from '@/lib/builder/faq/faq-shared';
import type { SiteLocale } from '@/lib/locales';
import {
  buildHref,
  categoryLabel,
  decodeHash,
  faqPublicExplorerCopy,
  filterFaqItems,
} from './FaqPublicExplorer.logic';
import styles from './FaqPublicExplorer.module.css';

interface FaqPublicExplorerProps {
  locale: SiteLocale;
  categories: BuilderFaqCategory[];
  items: BuilderFaqItem[];
  initialCategory?: string;
  initialQuery?: string;
}

export default function FaqPublicExplorer({
  locale,
  categories,
  items,
  initialCategory = 'all',
  initialQuery = '',
}: FaqPublicExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [query, setQuery] = useState(initialQuery || '');
  const [openId, setOpenId] = useState<string | null>(items[0]?.faqId ?? null);
  const [currentHash, setCurrentHash] = useState<string | null>(null);
  const text = faqPublicExplorerCopy[locale];
  const categoryRailLabel =
    locale === 'ko' ? 'FAQ 분류' : locale === 'zh-hant' ? 'FAQ 分類' : locale === 'ja' ? 'FAQ 分類' : 'FAQ categories';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncFromHash = () => {
      const hash = decodeHash(window.location.hash);
      setCurrentHash(hash || null);
      if (!hash) return;
      const match = items.find((item) => item.slug === hash || item.faqId === hash);
      if (match) setOpenId(match.faqId);
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => {
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, [items, query, selectedCategory]);

  const filteredItems = useMemo(
    () => filterFaqItems(items, categories, locale, selectedCategory, query),
    [categories, items, locale, query, selectedCategory],
  );

  function resolveVisibleHash(nextCategory: string, nextQuery: string): string | null {
    if (!currentHash) return null;
    const nextItems = filterFaqItems(items, categories, locale, nextCategory, nextQuery);
    return nextItems.some((item) => item.slug === currentHash || item.faqId === currentHash) ? currentHash : null;
  }

  function clearFilters() {
    setSelectedCategory('all');
    setQuery('');
    setOpenId(items[0]?.faqId ?? null);
    replaceVisitorUrl(buildHref(pathname, new URLSearchParams(), currentHash));
  }

  function replaceVisitorUrl(href: string) {
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', href);
    }
    router.replace(href, { scroll: false });
  }

  function setVisitorQuery(nextCategory: string, nextQuery: string, nextHash: string | null = currentHash) {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    params.delete('page');
    if (nextCategory && nextCategory !== 'all') params.set('category', nextCategory);
    else params.delete('category');
    if (nextQuery.trim()) params.set('q', nextQuery.trim());
    else params.delete('q');
    replaceVisitorUrl(buildHref(pathname, params, nextHash));
  }

  function currentFilterParams(): URLSearchParams {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    params.delete('page');
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    else params.delete('category');
    if (query.trim()) params.set('q', query.trim());
    else params.delete('q');
    return params;
  }

  function handleCategoryClick(nextCategory: string) {
    const nextHash = resolveVisibleHash(nextCategory, query);
    const nextItems = filterFaqItems(items, categories, locale, nextCategory, query);
    setSelectedCategory(nextCategory);
    setOpenId(nextItems.find((item) => item.slug === nextHash || item.faqId === nextHash)?.faqId ?? nextItems[0]?.faqId ?? null);
    setVisitorQuery(nextCategory, query, nextHash);
    setCurrentHash(nextHash);
  }

  function handleQueryChange(nextQuery: string) {
    const nextHash = resolveVisibleHash(selectedCategory, nextQuery);
    const nextItems = filterFaqItems(items, categories, locale, selectedCategory, nextQuery);
    setQuery(nextQuery);
    setOpenId(nextItems.find((item) => item.slug === nextHash || item.faqId === nextHash)?.faqId ?? nextItems[0]?.faqId ?? null);
    setVisitorQuery(selectedCategory, nextQuery, nextHash);
    setCurrentHash(nextHash);
  }

  function handleQuestionToggle(item: BuilderFaqItem) {
    const nextOpenId = openId === item.faqId ? null : item.faqId;
    setOpenId(nextOpenId);
    setCurrentHash(nextOpenId ? item.slug : null);
    if (typeof window !== 'undefined') {
      const currentParams = currentFilterParams();
      const nextHref = buildHref(pathname, currentParams, nextOpenId ? item.slug : null);
      window.history.replaceState(null, '', nextHref);
    }
  }

  function handleCategoryLinkClick(event: ReactMouseEvent<HTMLAnchorElement>, nextCategory: string) {
    event.preventDefault();
    handleCategoryClick(nextCategory);
  }

  function handleClearLinkClick(event: ReactMouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    clearFilters();
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
            onChange={(event) => handleQueryChange(event.currentTarget.value)}
          />
        </label>
        <div className={styles.count} role="status">{text.count(filteredItems.length)}</div>
      </div>

      <div className={styles.categoryRail} role="group" aria-label={categoryRailLabel}>
        <a
          href={buildHref(pathname, (() => {
            const params = new URLSearchParams(searchParams?.toString() ?? '');
            params.delete('page');
            params.delete('category');
            params.delete('q');
            return params;
          })(), currentHash)}
          className={selectedCategory === 'all' ? styles.categoryActive : styles.category}
          aria-current={selectedCategory === 'all' ? 'page' : undefined}
          onClick={(event) => handleCategoryLinkClick(event, 'all')}
        >
          {text.all}
        </a>
        {categories.map((category) => (
          <a
            href={buildHref(pathname, (() => {
              const params = new URLSearchParams(searchParams?.toString() ?? '');
              params.delete('page');
              if (category.categoryId !== 'all') params.set('category', category.categoryId);
              else params.delete('category');
              return params;
            })(), currentHash)}
            key={category.categoryId}
            className={selectedCategory === category.categoryId ? styles.categoryActive : styles.category}
            aria-current={selectedCategory === category.categoryId ? 'page' : undefined}
            onClick={(event) => handleCategoryLinkClick(event, category.categoryId)}
          >
            {category.label[locale]}
          </a>
        ))}
        {(selectedCategory !== 'all' || query) ? (
          <a
            href={buildHref(pathname, new URLSearchParams(), currentHash)}
            className={styles.clear}
            onClick={handleClearLinkClick}
          >
            {text.clear}
          </a>
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
                <h3 className={styles.heading}>
                  <button
                    id={buttonId}
                    type="button"
                    className={styles.question}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => handleQuestionToggle(item)}
                  >
                    <span>
                      <small>{categoryLabel(categories, item.categoryId, locale)}</small>
                      {item.question}
                    </span>
                    <span aria-hidden className={styles.arrow}>{isOpen ? '-' : '+'}</span>
                  </button>
                </h3>
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
