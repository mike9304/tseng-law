'use client';

import { useEffect } from 'react';

interface SearchHit {
  id: string;
  kind: string;
  title: string;
  url: string;
  summary?: string;
  highlights?: string[];
}

/**
 * PR #5 follow-up — Live-search enhancement for the public `site-search`
 * widget. Looks up every `[data-builder-site-search]` form in the DOM and
 * wires the input to /api/search with a 200ms debounce. The form's default
 * submit still works as a no-JS fallback.
 */
export default function SiteSearchEnhancer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const forms = Array.from(document.querySelectorAll<HTMLFormElement>('[data-builder-site-search="true"]'));
    if (forms.length === 0) return;

    const cleanups: Array<() => void> = [];

    for (const form of forms) {
      const inputRef = form.querySelector<HTMLInputElement>('[data-builder-site-search-input="true"]');
      const resultsBoxRef = form.querySelector<HTMLDivElement>('[data-builder-site-search-results="true"]');
      if (!inputRef || !resultsBoxRef) continue;
      const input: HTMLInputElement = inputRef;
      const resultsBox: HTMLDivElement = resultsBoxRef;
      const kinds = form.dataset.builderSiteSearchKinds ?? '';
      const localeOverride = form.dataset.builderSiteSearchLocale ?? '';
      const max = Number(form.dataset.builderSiteSearchMax) || 8;
      const inline = form.dataset.builderSiteSearchInline === 'true';
      const locale = localeOverride || document.documentElement.lang?.toLowerCase() || 'ko';

      let timer: ReturnType<typeof setTimeout> | null = null;
      let abortController: AbortController | null = null;
      let activeIndex = -1;

      function getHits(): HTMLAnchorElement[] {
        return Array.from(resultsBox.querySelectorAll<HTMLAnchorElement>('.builder-site-search-hit'));
      }

      function updateExpanded(expanded: boolean): void {
        input.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        if (!expanded) input.removeAttribute('aria-activedescendant');
      }

      function hideResults(): void {
        resultsBox.hidden = true;
        activeIndex = -1;
        updateExpanded(false);
      }

      function focusHit(index: number): void {
        const hits = getHits();
        if (hits.length === 0) return;
        const nextIndex = ((index % hits.length) + hits.length) % hits.length;
        activeIndex = nextIndex;
        const hit = hits[nextIndex];
        input.setAttribute('aria-activedescendant', hit.id);
        hit.focus();
      }

      function showEmpty(): void {
        resultsBox.hidden = false;
        updateExpanded(true);
        resultsBox.innerHTML = '';
        const empty = document.createElement('div');
        empty.className = 'builder-site-search-empty';
        empty.setAttribute('role', 'status');
        empty.textContent = '결과 없음';
        resultsBox.appendChild(empty);
      }

      async function runQuery(value: string): Promise<void> {
        if (!inline) return;
        if (abortController) abortController.abort();
        abortController = new AbortController();
        if (!value.trim()) {
          resultsBox.innerHTML = '';
          hideResults();
          return;
        }
        const params = new URLSearchParams({ q: value, locale, limit: String(max) });
        if (kinds) params.set('kinds', kinds);
        try {
          const res = await fetch(`/api/search?${params.toString()}`, { signal: abortController.signal });
          if (!res.ok) return;
          const payload = (await res.json()) as { hits?: SearchHit[] };
          const hits = payload.hits ?? [];
          if (hits.length === 0) {
            showEmpty();
            return;
          }
          resultsBox.hidden = false;
          updateExpanded(true);
          // Render via DOM creation so titles/summaries are auto-escaped and
          // a malicious title can't inject HTML.
          resultsBox.innerHTML = '';
          activeIndex = -1;
          hits.forEach((hit, index) => {
            const anchor = document.createElement('a');
            anchor.className = 'builder-site-search-hit';
            anchor.id = `${resultsBox.id || 'builder-site-search-results'}-option-${index}`;
            anchor.setAttribute('role', 'option');
            anchor.setAttribute('tabindex', '-1');
            // Only accept internal paths so a poisoned index can't ship a
            // javascript: URL into the live DOM.
            const safeUrl = typeof hit.url === 'string' && hit.url.startsWith('/') ? hit.url : '#';
            anchor.setAttribute('href', safeUrl);
            const titleEl = document.createElement('strong');
            titleEl.textContent = hit.title;
            const summaryEl = document.createElement('small');
            summaryEl.textContent = hit.highlights?.[0] || hit.summary || '';
            anchor.append(titleEl, summaryEl);
            resultsBox.appendChild(anchor);
          });
        } catch (err) {
          // AbortError is normal; ignore.
          if ((err as { name?: string } | null)?.name !== 'AbortError') {
            hideResults();
          }
        }
      }

      const handler = (): void => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => runQuery(input.value), 200);
      };
      const keydownHandler = (event: KeyboardEvent): void => {
        if (!inline) return;
        const hits = getHits();
        if (event.key === 'Escape') {
          if (!resultsBox.hidden) {
            event.preventDefault();
            hideResults();
            input.focus();
          }
          return;
        }
        if (event.key === 'ArrowDown') {
          if (resultsBox.hidden || hits.length === 0) return;
          event.preventDefault();
          const current = document.activeElement instanceof HTMLAnchorElement
            ? hits.indexOf(document.activeElement)
            : activeIndex;
          focusHit(current + 1);
          return;
        }
        if (event.key === 'ArrowUp') {
          if (resultsBox.hidden || hits.length === 0) return;
          event.preventDefault();
          const current = document.activeElement instanceof HTMLAnchorElement
            ? hits.indexOf(document.activeElement)
            : activeIndex >= 0 ? activeIndex : hits.length;
          focusHit(current - 1);
          return;
        }
        if (event.key === 'Home' && document.activeElement !== input && hits.length > 0) {
          event.preventDefault();
          focusHit(0);
          return;
        }
        if (event.key === 'End' && document.activeElement !== input && hits.length > 0) {
          event.preventDefault();
          focusHit(hits.length - 1);
        }
      };
      input.addEventListener('input', handler);
      input.addEventListener('keydown', keydownHandler);
      resultsBox.addEventListener('keydown', keydownHandler);
      cleanups.push(() => {
        input.removeEventListener('input', handler);
        input.removeEventListener('keydown', keydownHandler);
        resultsBox.removeEventListener('keydown', keydownHandler);
        if (timer) clearTimeout(timer);
        if (abortController) abortController.abort();
      });
    }
    return () => {
      for (const fn of cleanups) fn();
    };
  }, []);

  return null;
}
