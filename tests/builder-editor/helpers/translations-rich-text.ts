import { expect, type APIRequestContext } from '@playwright/test';
import { z } from 'zod';
import type { BuilderCanvasDocument, BuilderTextCanvasNode } from '@/lib/builder/canvas/types';
import { sanitizeTipTapDoc, type SafeTipTapNode } from '@/lib/builder/rich-text/sanitize';
import type { BuilderRichText } from '@/lib/builder/rich-text/types';
import {
  readPageCanvas,
  readSiteDocument,
  writeSiteDocument,
} from '@/lib/builder/site/persistence';
import {
  SITE_ID,
  SOURCE_LOCALE,
  TARGET_LOCALE,
  translationDocument,
  type TestLocale,
} from './translations-rich-text-fixtures';

export {
  blockRichText,
  emptyBlockRichText,
  inlineRichText,
  listRichText,
  mixedHardBreakBlockRichText,
  mixedBlockRichText,
  nestedOrderedListRichText,
  SITE_ID,
  SOURCE_LOCALE,
  TARGET_LOCALE,
  type TestLocale,
} from './translations-rich-text-fixtures';

export const editResponseSchema = z.object({
  ok: z.boolean().optional(),
  nodeUpdates: z.object({ appliedCount: z.number().optional() }).nullable().optional(),
});

const createPageResponseSchema = z.object({
  success: z.boolean().optional(),
  pageId: z.string().optional(),
  error: z.string().optional(),
});

export function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'translation-rich-text';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

export interface LinkedRichTextPages {
  readonly headers: Record<string, string>;
  readonly sourcePageId: string;
  readonly targetPageId: string;
}

export async function createLinkedRichTextPages(options: {
  readonly request: APIRequestContext;
  readonly token: string;
  readonly nodeId: string;
  readonly sourceText: string;
  readonly sourceRichText: BuilderRichText;
}): Promise<LinkedRichTextPages> {
  const headers = mutationHeaders(options.token);
  const sourcePageId = await createBuilderPage(
    options.request,
    SOURCE_LOCALE,
    `translation-rich-source-${options.token}`,
    `리치 텍스트 번역 ${options.token}`,
    translationDocument({
      token: options.token,
      locale: SOURCE_LOCALE,
      nodeId: options.nodeId,
      text: options.sourceText,
      richText: options.sourceRichText,
    }),
    options.token,
  );
  const targetPageId = await createBuilderPage(
    options.request,
    TARGET_LOCALE,
    `translation-rich-target-${options.token}`,
    `Rich text translation ${options.token}`,
    translationDocument({ token: options.token, locale: TARGET_LOCALE, nodeId: options.nodeId, text: '' }),
    options.token,
  );
  await linkTranslationPages(sourcePageId, targetPageId);
  return { headers, sourcePageId, targetPageId };
}

export async function deleteBuilderPage(
  request: APIRequestContext,
  pageId: string,
  locale: TestLocale,
  headers: Record<string, string>,
): Promise<void> {
  await request.delete(`/api/builder/site/pages/${pageId}?locale=${locale}`, {
    headers,
    failOnStatusCode: false,
  });
}

export async function readTargetTextNode(
  targetPageId: string,
  nodeId: string,
): Promise<BuilderTextCanvasNode> {
  const targetDraft = await readPageCanvas(SITE_ID, targetPageId, 'draft');
  const targetNode = targetDraft?.nodes.find(
    (candidate): candidate is BuilderTextCanvasNode => candidate.kind === 'text' && candidate.id === nodeId,
  );
  if (!targetNode) throw new Error('Missing persisted target text node');
  return targetNode;
}

export async function saveRichTextTranslationAndReadDoc(options: {
  readonly request: APIRequestContext;
  readonly token: string;
  readonly nodeId: string;
  readonly sourceText: string;
  readonly sourceRichText: BuilderRichText;
  readonly targetText: string;
  readonly originalSite: Awaited<ReturnType<typeof readSiteDocument>> | null;
}): Promise<SafeTipTapNode | null> {
  const pages = await createLinkedRichTextPages(options);

  try {
    const response = await options.request.post('/api/builder/translations/edit', {
      headers: pages.headers,
      data: {
        siteId: SITE_ID,
        pageId: pages.sourcePageId,
        sourceLocale: SOURCE_LOCALE,
        targetLocale: TARGET_LOCALE,
        nodeUpdates: { [options.nodeId]: { text: options.targetText, path: 'content.text' } },
      },
    });
    expect(response.status()).toBe(200);
    const payload = editResponseSchema.parse(await response.json());
    expect(payload.ok).toBe(true);
    expect(payload.nodeUpdates?.appliedCount).toBe(1);

    const targetNode = await readTargetTextNode(pages.targetPageId, options.nodeId);
    return sanitizeTipTapDoc(targetNode.content.richText?.doc);
  } finally {
    await deleteBuilderPage(options.request, pages.sourcePageId, SOURCE_LOCALE, pages.headers);
    await deleteBuilderPage(options.request, pages.targetPageId, TARGET_LOCALE, pages.headers);
    if (options.originalSite) {
      await writeSiteDocument(options.originalSite, { preserveNavigation: true });
    }
  }
}

export function expectNestedOrderedListDoc(richTextDoc: SafeTipTapNode | null): void {
  expect(richTextDoc?.content).toEqual([
    {
      type: 'orderedList',
      attrs: { start: 3 },
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'First', marks: [{ type: 'bold' }] }],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Second', marks: [{ type: 'italic' }] }],
            },
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Nested', marks: [{ type: 'underline' }] }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ]);
}

export async function createBuilderPage(
  request: APIRequestContext,
  locale: TestLocale,
  slug: string,
  title: string,
  document: BuilderCanvasDocument,
  scope: string,
): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    headers: mutationHeaders(scope),
    data: { locale, slug, title, document },
  });
  expect(response.status()).toBe(200);
  const payload = createPageResponseSchema.parse(await response.json());
  expect(payload.success, payload.error).toBe(true);
  if (typeof payload.pageId !== 'string') throw new Error('Missing created page id');
  return payload.pageId;
}

export async function linkTranslationPages(
  sourcePageId: string,
  targetPageId: string,
): Promise<void> {
  const site = await readSiteDocument(SITE_ID, SOURCE_LOCALE);
  const sourcePage = site.pages.find((candidate) => candidate.pageId === sourcePageId);
  const targetPage = site.pages.find((candidate) => candidate.pageId === targetPageId);
  if (!sourcePage || !targetPage) throw new Error('Missing seeded translation pages');
  sourcePage.linkedPageIds = { ...(sourcePage.linkedPageIds ?? {}), [TARGET_LOCALE]: targetPageId };
  targetPage.linkedPageIds = { ...(targetPage.linkedPageIds ?? {}), [SOURCE_LOCALE]: sourcePageId };
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site, { preserveNavigation: true });
}
