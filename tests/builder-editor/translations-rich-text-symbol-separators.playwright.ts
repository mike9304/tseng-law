import { expect, test } from '@playwright/test';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import {
  inlineRichText,
  saveRichTextTranslationAndReadDoc,
  SITE_ID,
  SOURCE_LOCALE,
} from './helpers/translations-rich-text';

test.describe('/api/builder/translations/edit symbol separator rich text persistence', () => {
  test.describe.configure({ mode: 'serial' });

  let originalSite: Awaited<ReturnType<typeof readSiteDocument>> | null = null;

  test.beforeEach(async () => {
    originalSite = await readSiteDocument(SITE_ID, SOURCE_LOCALE);
  });

  test('preserves translated ampersand separators outside adjacent rich text marks', async ({ request }) => {
    const token = `translation-rich-ampersand-${Date.now().toString(36)}`;
    const nodeId = `translation-rich-ampersand-node-${token}`;
    const richTextDoc = await saveRichTextTranslationAndReadDoc({
      request,
      token,
      nodeId,
      sourceText: '안녕세계',
      sourceRichText: inlineRichText('안녕', '세계'),
      targetText: 'Visit & Again',
      originalSite,
    });

    expect(richTextDoc?.content?.[0]?.content).toEqual([
      { type: 'text', text: 'Visit', marks: [{ type: 'bold' }] },
      { type: 'text', text: ' & ' },
      { type: 'text', text: 'Again', marks: [{ type: 'italic' }] },
    ]);
  });
});
