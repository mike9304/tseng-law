import { expect, test } from '@playwright/test';
import { BUILDER_RICH_TEXT_FORMAT, type BuilderRichText } from '@/lib/builder/rich-text/types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  createLinkedRichTextPages,
  deleteBuilderPage,
  SITE_ID,
  SOURCE_LOCALE,
  TARGET_LOCALE,
  type LinkedRichTextPages,
} from './helpers/translations-rich-text';

function richTextReviewFixture(sourceText: string): BuilderRichText {
  const [firstLine = '', secondLine = ''] = sourceText.split(/\r\n?|\n/g);
  return {
    format: BUILDER_RICH_TEXT_FORMAT,
    plainText: sourceText,
    doc: {
      type: 'doc',
      content: [
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: firstLine, marks: [{ type: 'bold' }] }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: secondLine,
                      marks: [{ type: 'link', attrs: { href: 'https://example.com', target: '_blank' } }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  };
}

test('/ko/admin-builder/translations segment review aligns target line count', async ({ page }) => {
  test.setTimeout(120_000);
  const originalSite = await readSiteDocument(SITE_ID, SOURCE_LOCALE);
  const token = `translation-segments-${Date.now().toString(36)}`;

  const nodeId = `translation-segment-node-${token}`;
  const sourceText = `원본 첫 줄 ${token}\n원본 둘째 줄 ${token}`;
  const targetText = `English first ${token}\nEnglish second ${token}`;
  let linkedPages: LinkedRichTextPages | null = null;

  try {
    linkedPages = await createLinkedRichTextPages({
      request: page.request,
      token,
      nodeId,
      sourceText,
      sourceRichText: richTextReviewFixture(sourceText),
    });
    await page.setExtraHTTPHeaders(linkedPages.headers);

    await page.goto(`/${SOURCE_LOCALE}/admin-builder/translations/${linkedPages.sourcePageId}?source=ko&target=en`, {
      waitUntil: 'domcontentloaded',
    });

    const review = page.locator(`[data-translation-segment-review="${nodeId}"]`);
    const richTextReview = page.locator(`[data-translation-rich-text-review="${nodeId}"]`);
    const input = page.locator(`[data-translation-node-target-input="${nodeId}"]`);
    await expect(review).toBeVisible();
    await expect(richTextReview).toBeVisible();
    await expect(richTextReview).toHaveAttribute('data-translation-rich-text-list-depth', '1');
    await expect(richTextReview).toContainText('Format structure review');
    await expect(richTextReview.locator('[data-translation-rich-text-signal="bold"]')).toBeVisible();
    await expect(richTextReview.locator('[data-translation-rich-text-signal="link"]')).toBeVisible();
    await expect(richTextReview.locator('[data-translation-rich-text-signal="bulletList"]')).toBeVisible();
    await richTextReview.screenshot({ path: '/private/tmp/translation-rich-text-review-panel.png' });
    await expect(page.locator(`[data-translation-segment-source-signals="${nodeId}-1"]`)).toHaveAttribute(
      'data-translation-segment-source-list-depth',
      '1',
    );
    await expect(page.locator(`[data-translation-segment-source-signal="${nodeId}-1-bold"]`)).toBeVisible();
    await expect(page.locator(`[data-translation-segment-source-signal="${nodeId}-1-bulletList"]`)).toBeVisible();
    await expect(page.locator(`[data-translation-segment-source-signals="${nodeId}-2"]`)).toHaveAttribute(
      'data-translation-segment-source-list-depth',
      '1',
    );
    await expect(page.locator(`[data-translation-segment-source-signal="${nodeId}-2-link"]`)).toBeVisible();
    await expect(page.locator(`[data-translation-segment-source-signal="${nodeId}-2-bulletList"]`)).toBeVisible();
    await review.screenshot({ path: '/private/tmp/translation-segment-source-signals.png' });
    await expect(review).toHaveAttribute('data-translation-segment-status', 'needs-review');
    await expect(review).toContainText('Source 2 lines / target 1 lines');

    await input.fill(`English first ${token}`);
    await page.locator(`[data-translation-segment-align="${nodeId}"]`).click();
    await expect(input).toHaveValue(`English first ${token}\n`);
    await expect(review).toContainText('Source 2 lines / target 2 lines');

    const firstSegmentInput = page.locator(`[data-translation-segment-target-input="${nodeId}-1"]`);
    await page.locator(`[data-translation-segment-remap-source="${nodeId}-1"]`).selectOption('1');
    await expect(firstSegmentInput).toHaveValue(`원본 둘째 줄 ${token}`);
    await expect(input).toHaveValue(`원본 둘째 줄 ${token}\n`);
    await input.fill(`English first ${token}\n`);
    await page.locator(`[data-translation-segment-append-source="${nodeId}-1"]`).selectOption('1');
    await expect(firstSegmentInput).toHaveValue(`English first ${token} 원본 둘째 줄 ${token}`);
    await expect(input).toHaveValue(`English first ${token} 원본 둘째 줄 ${token}\n`);
    await input.fill(`English first ${token}\n`);
    await page.locator(`[data-translation-segment-split-target="${nodeId}-1"]`).click();
    await expect(input).toHaveValue(`English first ${token}\n\n`);
    await expect(review).toContainText('Source 2 lines / target 3 lines');
    await page.locator(`[data-translation-segment-delete-target="${nodeId}-2"]`).click();
    await expect(input).toHaveValue(`English first ${token}\n`);
    await expect(review).toContainText('Source 2 lines / target 2 lines');
    const secondSegmentInput = page.locator(`[data-translation-segment-target-input="${nodeId}-2"]`);
    await input.fill(targetText);
    await expect(firstSegmentInput).toHaveValue(`English first ${token}`);
    await expect(secondSegmentInput).toHaveValue(`English second ${token}`);
    await page.locator(`[data-translation-segment-move-target-down="${nodeId}-1"]`).click();
    await expect(input).toHaveValue(`English second ${token}\nEnglish first ${token}`);
    await page.locator(`[data-translation-segment-move-target-up="${nodeId}-2"]`).click();
    await expect(input).toHaveValue(targetText);
    await page.locator(`[data-translation-segment-merge-target-down="${nodeId}-1"]`).click();
    await expect(input).toHaveValue(`English first ${token} English second ${token}\n`);
    await expect(review).toContainText('Source 2 lines / target 2 lines');
    await input.fill(`English first ${token}\n`);

    await expect(secondSegmentInput).toHaveValue('');
    await page.locator(`[data-translation-segment-copy-source="${nodeId}-2"]`).click();
    await expect(secondSegmentInput).toHaveValue(`원본 둘째 줄 ${token}`);
    await expect(input).toHaveValue(`English first ${token}\n원본 둘째 줄 ${token}`);
    await secondSegmentInput.fill(`English second ${token}`);
    await expect(input).toHaveValue(targetText);
    await expect(review).toHaveAttribute('data-translation-segment-status', 'aligned');
    await review.screenshot({ path: '/private/tmp/translation-segment-row-controls.png' });
    await page.getByRole('button', { name: 'Save translation' }).click();
    await expect(page.getByText('Translation saved. (1 nodes).')).toBeVisible();

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator(`[data-translation-node-target-input="${nodeId}"]`)).toHaveValue(targetText);
    await expect(page.locator(`[data-translation-segment-review="${nodeId}"]`)).toHaveAttribute(
      'data-translation-segment-status',
      'aligned',
    );
  } finally {
    if (linkedPages) {
      await deleteBuilderPage(page.request, linkedPages.sourcePageId, SOURCE_LOCALE, linkedPages.headers);
      await deleteBuilderPage(page.request, linkedPages.targetPageId, TARGET_LOCALE, linkedPages.headers);
    }
    await writeSiteDocument(originalSite, { preserveNavigation: true });
  }
});
