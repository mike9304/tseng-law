'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import Link from 'next/link';
import { siteContent } from '@/data/site-content';
import type { Locale } from '@/lib/locales';
import SmartLink from '@/components/SmartLink';
import { filterSearchIndex, getSearchIndex, type SearchCategory } from '@/lib/search';
import {
  resolvePublishedOverlayOpener,
  usePublishedOverlayFocus,
} from '@/components/builder/published/overlayFocus';

export default function SearchOverlay({
  open,
  onClose,
  locale
}: {
  open: boolean;
  onClose: () => void;
  locale: Locale;
}) {
  const content = siteContent[locale].search;
  const [activeTab, setActiveTab] = useState(content.tabs[0].id);
  const [query, setQuery] = useState('');
  const tabPanelId = `${locale}-search-overlay-panel`;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const index = useMemo(() => getSearchIndex(locale), [locale]);
  const activeCategory = activeTab as SearchCategory;
  const results = useMemo(
    () => filterSearchIndex(index, query, activeCategory).slice(0, 6),
    [index, query, activeCategory]
  );

  useEffect(() => {
    if (!open) return;
    openerRef.current = resolvePublishedOverlayOpener();
    setActiveTab(content.tabs[0].id);
    setQuery('');
  }, [open, content.tabs]);

  usePublishedOverlayFocus({
    open,
    overlayRef,
    initialFocusRef: inputRef,
    openerRef,
  });

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', handler, true);
    return () => document.removeEventListener('keydown', handler, true);
  }, [open, onClose]);

  const activateTab = useCallback((tabId: string, shouldFocus = false) => {
    setActiveTab(tabId);
    if (shouldFocus) {
      window.requestAnimationFrame(() => {
        tabRefs.current[tabId]?.focus();
      });
    }
  }, []);

  const handleTabKeyDown = useCallback((event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (index + 1) % content.tabs.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (index - 1 + content.tabs.length) % content.tabs.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = content.tabs.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    activateTab(content.tabs[nextIndex].id, true);
  }, [activateTab, content.tabs]);

  if (!open) return null;

  const closeLabel = locale === 'ko' ? '닫기' : locale === 'zh-hant' ? '關閉' : 'Close';
  const popularLabel = locale === 'ko' ? '추천 주제' : locale === 'zh-hant' ? '推薦主題' : 'Suggested Topics';
  const emptyLabel = locale === 'ko' ? '검색 결과가 없습니다.' : locale === 'zh-hant' ? '沒有搜尋結果。' : 'No search results found.';
  const tabListLabel = locale === 'ko' ? '검색 카테고리' : locale === 'zh-hant' ? '搜尋分類' : 'Search categories';
  const suggestionItems = content.suggestions.length ? content.suggestions : siteContent[locale].hero.keywords;
  const tabLabel =
    content.tabs.find((tab) => tab.id === activeTab)?.label ?? content.tabs[0]?.label ?? '';

  return (
    <div
      ref={overlayRef}
      className="search-overlay"
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-label={content.title}
      onClick={onClose}
    >
      <div className="search-panel" onClick={(event) => event.stopPropagation()}>
        <header>
          <strong>{content.title}</strong>
          <button className="icon-button" type="button" onClick={onClose} aria-label={closeLabel}>
            {closeLabel}
          </button>
        </header>
        <form className="search-bar" action={`/${locale}/search`} method="get">
          <input
            ref={inputRef}
            className="search-input"
            type="search"
            name="q"
            placeholder={content.placeholder}
            aria-label={content.placeholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <input type="hidden" name="tab" value={activeTab} />
          <button className="search-submit" type="submit">
            {content.title}
          </button>
        </form>
        <div className="search-tabs" role="tablist" aria-label={tabListLabel}>
          {content.tabs.map((tab, index) => (
            <button
              key={tab.id}
              id={`${locale}-search-overlay-tab-${tab.id}`}
              ref={(element) => {
                tabRefs.current[tab.id] = element;
              }}
              type="button"
              className={activeTab === tab.id ? 'active' : ''}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={tabPanelId}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => activateTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {query ? (
          <div
            className="search-suggestions"
            role="tabpanel"
            id={tabPanelId}
            aria-labelledby={`${locale}-search-overlay-tab-${activeTab}`}
            aria-live="polite"
          >
            {results.length ? (
              results.map((item) => (
                <SmartLink key={item.id} className="search-result" href={item.href}>
                  <span>{item.title}</span>
                  <span className="search-result-meta">{tabLabel}</span>
                </SmartLink>
              ))
            ) : (
              <div className="search-empty">{emptyLabel}</div>
            )}
          </div>
        ) : (
          <div role="tabpanel" id={tabPanelId} aria-labelledby={`${locale}-search-overlay-tab-${activeTab}`}>
            <div className="section-label">{popularLabel}</div>
            <div className="chip-group">
              {suggestionItems.map((item) => (
                <Link key={item} href={`/${locale}/search?q=${encodeURIComponent(item)}&tab=${activeTab}`} className="chip">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
