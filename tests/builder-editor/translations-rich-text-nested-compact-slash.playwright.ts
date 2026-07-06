import { expect, test } from '@playwright/test';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import {
  saveRichTextTranslationAndReadDoc,
  SITE_ID,
  SOURCE_LOCALE,
} from './helpers/translations-rich-text';
import { nestedMarkedRunListRichText } from './helpers/translations-rich-text-nested-fixtures';

test.describe('/api/builder/translations/edit nested compact slash rich text persistence', () => {
  test.describe.configure({ mode: 'serial' });

  let originalSite: Awaited<ReturnType<typeof readSiteDocument>> | null = null;

  test.beforeEach(async () => {
    originalSite = await readSiteDocument(SITE_ID, SOURCE_LOCALE);
  });

  test('preserves compact slash separators inside nested marked list items', async ({ request }) => {
    const token = `translation-rich-nested-slash-${Date.now().toString(36)}`;
    const nodeId = `translation-rich-nested-slash-node-${token}`;
    const richTextDoc = await saveRichTextTranslationAndReadDoc({
      request,
      token,
      nodeId,
      sourceText: '첫째\n방문하기',
      sourceRichText: nestedMarkedRunListRichText(),
      targetText: 'First\nVisit/Again',
      originalSite,
    });

    expect(richTextDoc?.content?.[0]).toMatchObject({
      type: 'orderedList',
      attrs: { start: 3 },
    });
    expect(
      richTextDoc?.content?.[0]?.content?.[1]?.content?.[0]?.content?.[0]?.content?.[0]?.content,
    ).toEqual([
      {
        type: 'text',
        text: 'Visit',
        marks: [{ type: 'link', attrs: { href: 'https://example.com', target: '_blank' } }],
      },
      { type: 'text', text: '/' },
      { type: 'text', text: 'Again', marks: [{ type: 'underline' }] },
    ]);
  });
});
