import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ColumnContent from '@/components/ColumnContent';
import type { SiteLocale } from '@/lib/locales';

const locales: SiteLocale[] = ['ko', 'zh-hant', 'en', 'ja'];

const TABLE_SCROLL_HINTS: Record<SiteLocale, string> = {
  ko: '표가 화면보다 넓으면 좌우로 스크롤해 보세요.',
  'zh-hant': '若表格超出畫面，請左右捲動檢視。',
  en: 'If the table extends beyond the screen, scroll horizontally to see the rest.',
  ja: '表が画面より広い場合は、左右にスクロールしてご覧ください。',
};

const MULTI_TABLE_MARKDOWN = `Intro

| Item | Scope | Deadline | Note | Fee |
| --- | --- | --- | --- | --- |
| Setup | Company | Two weeks | Details | Quote |
| Bank | Account | One week | In person | Extra |

| 項目 | 内容 | 期限 | 備考 | 費用 |
| --- | --- | --- | --- | --- |
| 設立 | 会社 | 二週間 | 詳細 | 見積 |
| 登記 | 手続 | 三週間 | 必要 | 相談 |
`;

describe('column markdown table accessibility', () => {
  it.each(locales)('keeps native table semantics and a focusable named region for %s', (locale) => {
    const html = renderToStaticMarkup(
      <ColumnContent content={MULTI_TABLE_MARKDOWN} locale={locale} />,
    );
    const hint = TABLE_SCROLL_HINTS[locale];

    expect(html.match(/<table>/g)?.length).toBe(2);
    expect(html.match(/<thead>/g)?.length).toBe(2);
    expect(html).toContain('<th>');
    expect(html).toContain('<tbody>');
    expect(html).toContain('<td>');
    expect(html).toContain('Item');
    expect(html).toContain('Setup');
    expect(html).toContain('項目');
    expect(html).toContain('設立');
    expect(html.match(/role="region"/g)?.length).toBe(2);
    expect(html.match(/tabindex="0"/g)?.length).toBe(2);
    expect(html.match(/aria-label="/g)?.length).toBe(2);
    expect(html).toContain(`aria-label="${hint}"`);
    expect(html).toContain(hint);
    expect(html).not.toMatch(/id="column-table/);
    expect(html).toContain('class="column-table-wrap"');
    expect(html).toContain('class="column-table-scroll-hint"');
  });

  it('defaults the table region copy to Korean when locale is omitted', () => {
    const html = renderToStaticMarkup(<ColumnContent content={MULTI_TABLE_MARKDOWN} />);
    expect(html).toContain(TABLE_SCROLL_HINTS.ko);
    expect(html).not.toContain(TABLE_SCROLL_HINTS.en);
  });

  it('keeps overflow inside the table wrap with a readable native cell minimum width', () => {
    const css = readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');
    const start = css.indexOf('/* ===== COLUMN MARKDOWN ===== */');
    expect(start).toBeGreaterThan(-1);
    const columnCss = css.slice(start, start + 1800);

    expect(columnCss).toMatch(/\.column-table-wrap\s*\{[^}]*overflow-x:\s*auto/);
    expect(columnCss).toMatch(/\.column-table-wrap\s*\{[^}]*max-width:\s*100%/);
    expect(columnCss).toMatch(/\.column-table-wrap\s*\{[^}]*min-width:\s*0/);
    expect(columnCss).toMatch(/\.column-table-wrap table\s*\{[^}]*width:\s*100%/);
    expect(columnCss).toMatch(
      /\.column-table-wrap th,\s*\.column-table-wrap td\s*\{[^}]*min-width:\s*9rem/,
    );
    expect(columnCss).toMatch(
      /\.column-table-wrap th,\s*\.column-table-wrap td\s*\{[^}]*white-space:\s*normal/,
    );
    expect(columnCss).not.toContain('overflow-x: hidden');
    expect(columnCss).not.toContain('word-break: break-all');
  });
});
