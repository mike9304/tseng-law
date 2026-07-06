import { expect, test } from '@playwright/test';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import {
  saveRichTextTranslationAndReadDoc,
  SITE_ID,
  SOURCE_LOCALE,
} from './helpers/translations-rich-text';
import { linkedSplitSlashUnderlineRichText } from './helpers/translations-rich-text-separator-fixtures';

test.describe('/api/builder/translations/edit split source compact separator rich text persistence', () => {
  test.describe.configure({ mode: 'serial' });

  let originalSite: Awaited<ReturnType<typeof readSiteDocument>> | null = null;

  test.beforeEach(async () => {
    originalSite = await readSiteDocument(SITE_ID, SOURCE_LOCALE);
  });

  test('collapses split source separators when the target uses compact separators', async ({ request }) => {
    const token = `translation-rich-split-compact-${Date.now().toString(36)}`;
    const nodeId = `translation-rich-split-compact-node-${token}`;
    const richTextDoc = await saveRichTextTranslationAndReadDoc({
      request,
      token,
      nodeId,
      sourceText: '방문 / 하기',
      sourceRichText: linkedSplitSlashUnderlineRichText(),
      targetText: 'Visit/Again',
      originalSite,
    });

    expect(richTextDoc?.content?.[0]?.content).toEqual([
      {
        type: 'text',
        text: 'Visit',
        marks: [{ type: 'link', attrs: { href: 'https://example.com', target: '_blank' } }],
      },
      { type: 'text', text: '/' },
      { type: 'text', text: 'Again', marks: [{ type: 'underline' }] },
    ]);
  });

  test('collapses split source separators for compact targets shorter than the source text nodes', async ({ request }) => {
    const token = `translation-rich-split-short-${Date.now().toString(36)}`;
    const nodeId = `translation-rich-split-short-node-${token}`;
    const richTextDoc = await saveRichTextTranslationAndReadDoc({
      request,
      token,
      nodeId,
      sourceText: '방문 / 하기',
      sourceRichText: linkedSplitSlashUnderlineRichText(),
      targetText: 'A/B',
      originalSite,
    });

    expect(richTextDoc?.content?.[0]?.content).toEqual([
      {
        type: 'text',
        text: 'A',
        marks: [{ type: 'link', attrs: { href: 'https://example.com', target: '_blank' } }],
      },
      { type: 'text', text: '/' },
      { type: 'text', text: 'B', marks: [{ type: 'underline' }] },
    ]);
  });
});
