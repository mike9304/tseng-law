import { expect, test } from '@playwright/test';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import {
  blockRichText,
  emptyBlockRichText,
  expectNestedOrderedListDoc,
  inlineRichText,
  listRichText,
  mixedHardBreakBlockRichText,
  mixedBlockRichText,
  nestedOrderedListRichText,
  SITE_ID,
  SOURCE_LOCALE,
  saveRichTextTranslationAndReadDoc,
} from './helpers/translations-rich-text';
import { linkedHyphenUnderlineRichText } from './helpers/translations-rich-text-separator-fixtures';

test.describe('/api/builder/translations/edit rich text persistence', () => {
  test.describe.configure({ mode: 'serial' });

  let originalSite: Awaited<ReturnType<typeof readSiteDocument>> | null = null;

  test.beforeEach(async () => {
    originalSite = await readSiteDocument(SITE_ID, SOURCE_LOCALE);
  });

  test('preserves adjacent inline marks in the target draft', async ({ request }) => {
    const token = `translation-rich-text-${Date.now().toString(36)}`;
    const nodeId = `translation-rich-node-${token}`;
    const richTextDoc = await saveRichTextTranslationAndReadDoc({
      request,
      token,
      nodeId,
      sourceText: '안녕세계',
      sourceRichText: inlineRichText('안녕', '세계'),
      targetText: 'HelloWorld',
      originalSite,
    });

    expect(richTextDoc?.content?.[0]?.content).toEqual([
      { type: 'text', text: 'Hello', marks: [{ type: 'bold' }] },
      { type: 'text', text: 'World', marks: [{ type: 'italic' }] },
    ]);
  });

  test('preserves marked paragraph blocks in the target draft', async ({ request }) => {
    const token = `translation-rich-blocks-${Date.now().toString(36)}`;
    const nodeId = `translation-rich-block-node-${token}`;
    const richTextDoc = await saveRichTextTranslationAndReadDoc({
      request,
      token,
      nodeId,
      sourceText: '안녕\n세계',
      sourceRichText: blockRichText('안녕', '세계'),
      targetText: 'Hello\nWorld',
      originalSite,
    });

    expect(richTextDoc?.content).toEqual([
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Hello', marks: [{ type: 'bold' }] }],
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'World', marks: [{ type: 'italic' }] }],
      },
    ]);
  });

  test('preserves multiple marked runs inside paragraph blocks in the target draft', async ({ request }) => {
    const token = `translation-rich-mixed-blocks-${Date.now().toString(36)}`;
    const nodeId = `translation-rich-mixed-block-node-${token}`;
    const richTextDoc = await saveRichTextTranslationAndReadDoc({
      request,
      token,
      nodeId,
      sourceText: '안녕세계\n방문하기',
      sourceRichText: mixedBlockRichText(),
      targetText: 'HelloWorld\nVisitAgain',
      originalSite,
    });

    expect(richTextDoc?.content).toEqual([
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Hello', marks: [{ type: 'bold' }] },
          { type: 'text', text: 'World', marks: [{ type: 'italic' }] },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Visit',
            marks: [{ type: 'link', attrs: { href: 'https://example.com', target: '_blank' } }],
          },
          { type: 'text', text: 'Again', marks: [{ type: 'underline' }] },
        ],
      },
    ]);
  });

  test('preserves empty paragraph blocks between marked translated blocks', async ({ request }) => {
    const token = `translation-rich-empty-blocks-${Date.now().toString(36)}`;
    const nodeId = `translation-rich-empty-block-node-${token}`;
    const richTextDoc = await saveRichTextTranslationAndReadDoc({
      request,
      token,
      nodeId,
      sourceText: '안녕\n\n세계',
      sourceRichText: emptyBlockRichText(),
      targetText: 'Hello\n\nWorld',
      originalSite,
    });

    expect(richTextDoc?.content).toEqual([
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Hello', marks: [{ type: 'bold' }] }],
      },
      { type: 'paragraph' },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'World', marks: [{ type: 'italic' }] }],
      },
    ]);
  });

  test('preserves hard breaks and following paragraph blocks together', async ({ request }) => {
    const token = `translation-rich-hardbreak-blocks-${Date.now().toString(36)}`;
    const nodeId = `translation-rich-hardbreak-block-node-${token}`;
    const richTextDoc = await saveRichTextTranslationAndReadDoc({
      request,
      token,
      nodeId,
      sourceText: '안녕\n세계\n방문',
      sourceRichText: mixedHardBreakBlockRichText(),
      targetText: 'Hello\nWorld\nVisit',
      originalSite,
    });

    expect(richTextDoc?.content).toEqual([
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Hello', marks: [{ type: 'bold' }] },
          { type: 'hardBreak' },
          { type: 'text', text: 'World', marks: [{ type: 'italic' }] },
        ],
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Visit', marks: [{ type: 'underline' }] }],
      },
    ]);
  });

  test('preserves marked bullet list item blocks in the target draft', async ({ request }) => {
    const token = `translation-rich-list-blocks-${Date.now().toString(36)}`;
    const nodeId = `translation-rich-list-block-node-${token}`;
    const richTextDoc = await saveRichTextTranslationAndReadDoc({
      request,
      token,
      nodeId,
      sourceText: '안녕\n세계',
      sourceRichText: listRichText(),
      targetText: 'Hello\nWorld',
      originalSite,
    });

    expect(richTextDoc?.content).toEqual([
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Hello', marks: [{ type: 'bold' }] }],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'World', marks: [{ type: 'italic' }] }],
              },
            ],
          },
        ],
      },
    ]);
  });

  test('preserves ordered list attrs and nested list blocks in the target draft', async ({ request }) => {
    const token = `translation-rich-nested-list-${Date.now().toString(36)}`;
    const nodeId = `translation-rich-nested-list-node-${token}`;
    const richTextDoc = await saveRichTextTranslationAndReadDoc({
      request,
      token,
      nodeId,
      sourceText: '첫째\n둘째\n하위',
      sourceRichText: nestedOrderedListRichText(),
      targetText: 'First\nSecond\nNested',
      originalSite,
    });

    expectNestedOrderedListDoc(richTextDoc);
  });

  test('preserves translated en dash separators outside adjacent rich text marks', async ({ request }) => {
    const token = `translation-rich-en-dash-${Date.now().toString(36)}`;
    const nodeId = `translation-rich-en-dash-node-${token}`;
    const richTextDoc = await saveRichTextTranslationAndReadDoc({
      request,
      token,
      nodeId,
      sourceText: '방문-하기',
      sourceRichText: linkedHyphenUnderlineRichText(),
      targetText: 'Visit–Again',
      originalSite,
    });

    expect(richTextDoc?.content?.[0]?.content).toEqual([
      {
        type: 'text',
        text: 'Visit',
        marks: [{ type: 'link', attrs: { href: 'https://example.com', target: '_blank' } }],
      },
      { type: 'text', text: '–' },
      { type: 'text', text: 'Again', marks: [{ type: 'underline' }] },
    ]);
  });
});
