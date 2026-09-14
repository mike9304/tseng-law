// Actual Grok recipe; local Node parser/async bindings documented in receipt.
import { describe, expect, it } from 'vitest';

type PublicListState = 'empty' | 'filtered-empty';

const PUBLIC_LIST_STATE_COPY = {
  en: {
    empty: 'No items available.',
    noMatches: 'No matching items.',
    clearFilters: 'Clear filters',
  },
  ko: {
    empty: '표시할 항목이 없습니다.',
    noMatches: '현재 필터에 맞는 항목이 없습니다.',
    clearFilters: '필터 지우기',
  },
  'zh-hant': {
    empty: '沒有可顯示的項目。',
    noMatches: '沒有符合目前篩選條件的項目。',
    clearFilters: '清除篩選',
  },
} as const;

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, '&');
}

function visibleTextFromHtml(html: string): string {
  return decodeEntities(html.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function hrefForLinkWithExactText(html: string, linkText: string): string | null {
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    if (visibleTextFromHtml(match[2]) === linkText) return decodeEntities(match[1]);
  }
  return null;
}

export function createPublicListStateRenderTests(
  render: (locale: string, state: PublicListState) => Promise<string>,
  expectedResetHref: (locale: string) => string,
): void {
  describe('public searchable list state copy', () => {
    const locales = ['en', 'ko', 'zh-hant'] as const;

    for (const locale of locales) {
      const copy = PUBLIC_LIST_STATE_COPY[locale];

      it(`renders visible empty copy for ${locale}`, async () => {
        const html = await render(locale, 'empty');
        const visible = visibleTextFromHtml(html);
        expect(visible).toContain(copy.empty);
        expect(visible).not.toContain(copy.noMatches);
        expect(visible).not.toContain(copy.clearFilters);
      });

      it(`renders visible filtered-empty copy for ${locale} and keeps reset href`, async () => {
        const html = await render(locale, 'filtered-empty');
        const visible = visibleTextFromHtml(html);
        expect(visible).toContain(copy.noMatches);
        expect(visible).toContain(copy.clearFilters);
        expect(visible).not.toContain(copy.empty);
        expect(hrefForLinkWithExactText(html, copy.clearFilters)).toBe(expectedResetHref(locale));
      });
    }
  });
}
