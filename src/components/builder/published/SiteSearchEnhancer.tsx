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

      async function runQuery(value: string): Promise<void> {
        if (!inline) return;
        if (abortController) abortController.abort();
        abortController = new AbortController();
        if (!value.trim()) {
          resultsBox.hidden = true;
          resultsBox.innerHTML = '';
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
            resultsBox.hidden = false;
            resultsBox.innerHTML = '<div class="builder-site-search-empty">결과 없음</div>';
            return;
          }
          resultsBox.hidden = false;
          resultsBox.innerHTML = hits
            .map((hit) => {
              const summary = hit.highlights?.[0] || hit.summary || '';
              return `<a class="builder-site-search-hit" href="${hit.url}"><strong>${hit.title}</strong><small>${summary}</small></a>`;
            })
            .join('');
        } catch (err) {
          // AbortError is normal; ignore.
          if ((err as { name?: string } | null)?.name !== 'AbortError') {
            resultsBox.hidden = true;
          }
        }
      }

      const handler = (): void => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => runQuery(input.value), 200);
      };
      input.addEventListener('input', handler);
      cleanups.push(() => {
        input.removeEventListener('input', handler);
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
