import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import TaiwanCompanySetupGuidePage from '../page';
import { guideContent } from '../content';

describe('company setup guide comparison tables', () => {
  it.each(['ko', 'en', 'ja', 'zh-hant'] as const)(
    'gives %s readers named keyboard-scrollable regions without losing table data',
    async (locale) => {
      const html = renderToStaticMarkup(
        await TaiwanCompanySetupGuidePage({ params: Promise.resolve({ locale }) }),
      );
      const content = guideContent[locale];
      const expectedTables = [
        {
          title: content.comparisonHeading,
          columns: content.comparisonColumns,
          rows: content.comparisonRows.map((row) => [row.form, ...row.values]),
        },
        {
          title: content.costHeading,
          columns: content.costColumns,
          rows: content.costRows.map((row) => [row.item, ...row.values]),
        },
      ];
      const tables = [...html.matchAll(/<table\b[^>]*>[\s\S]*?<\/table>/g)].map(([table]) => table);
      const regions = [...html.matchAll(/<div\b[^>]*role="region"[^>]*>/g)].map(([region]) => region);
      expect(tables).toHaveLength(expectedTables.length);
      expect(regions).toHaveLength(expectedTables.length);
      tables.forEach((table, index) => {
        const region = regions[index];
        expect(region).toContain('tabindex="0"');
        const headingId = /aria-labelledby="([^"]+)"/.exec(region)?.[1];
        const hintId = /aria-describedby="([^"]+)"/.exec(region)?.[1];
        expect(headingId).toBeTruthy();
        expect(hintId).toBeTruthy();
        const heading = new RegExp(`<h2[^>]*id="${headingId}"[^>]*>(.*?)<\\/h2>`).exec(html)?.[1];
        expect(heading).toBe(renderToStaticMarkup(<>{expectedTables[index].title}</>));
        expect(html).toMatch(new RegExp(`<p[^>]*id="${hintId}"[^>]*>[^<]+<\\/p>`));
        const header = /<thead>([\s\S]*?)<\/thead>/.exec(table)?.[1] ?? '';
        const body = /<tbody>([\s\S]*?)<\/tbody>/.exec(table)?.[1] ?? '';
        expect((header.match(/scope="col"/g) ?? []).length).toBe(expectedTables[index].columns.length);
        expect((body.match(/scope="row"/g) ?? []).length).toBe(expectedTables[index].rows.length);
        expect((body.match(/<tr>/g) ?? []).length).toBe(expectedTables[index].rows.length);
        expectedTables[index].columns.forEach((value) => expect(header).toContain(renderToStaticMarkup(<>{value}</>)));
        expectedTables[index].rows.flat().forEach((value) => expect(body).toContain(renderToStaticMarkup(<>{value}</>)));
      });
    },
  );
});
