import { expect, test, type APIResponse, type Page } from '@playwright/test';
import { z } from 'zod';

const createPageResponseSchema = z.object({
  success: z.boolean().optional(),
  pageId: z.string().optional(),
  error: z.string().optional(),
});

const publishResponseSchema = z.object({
  ok: z.boolean().optional(),
  error: z.string().optional(),
});

const jsonLdRecordSchema = z.object({
  '@type': z.string().optional(),
}).passthrough();

type JsonLdRecord = z.infer<typeof jsonLdRecordSchema>;

interface PageMetadata {
  readonly title: string | null;
  readonly description: string | null;
  readonly ogTitle: string | null;
  readonly twitterTitle: string | null;
  readonly canonical: string | null;
  readonly recordJsonLd: JsonLdRecord | null;
}

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'custom-item-seo';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function basicAuthHeader(): string {
  const username = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
  const password = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
}

async function expectStatus(response: APIResponse, status: number, context: string): Promise<void> {
  if (response.status() === status) return;
  expect(response.status(), `${context}: ${await response.text()}`).toBe(status);
}

async function readPageMetadata(page: Page): Promise<PageMetadata> {
  const values = await page.evaluate(() => {
    const content = (selector: string): string | null =>
      document.querySelector(selector)?.getAttribute('content') ?? null;
    const href = (selector: string): string | null =>
      document.querySelector(selector)?.getAttribute('href') ?? null;
    return {
      title: document.title || null,
      description: content('meta[name="description"]'),
      ogTitle: content('meta[property="og:title"]'),
      twitterTitle: content('meta[name="twitter:title"]'),
      canonical: href('link[rel="canonical"]'),
      jsonLdTexts: Array.from(document.querySelectorAll('main script[type="application/ld+json"]'))
        .map((element) => element.textContent ?? ''),
    };
  });
  return {
    title: values.title,
    description: values.description,
    ogTitle: values.ogTitle,
    twitterTitle: values.twitterTitle,
    canonical: values.canonical,
    recordJsonLd: parseRecordJsonLd(values.jsonLdTexts),
  };
}

function parseRecordJsonLd(texts: readonly string[]): JsonLdRecord | null {
  for (const text of texts) {
    try {
      const parsed: unknown = JSON.parse(text || 'null');
      const result = jsonLdRecordSchema.safeParse(parsed);
      if (!result.success) continue;
      if (result.data['@type'] === 'Article') return result.data;
    } catch (error) {
      if (error instanceof SyntaxError) continue;
      throw error;
    }
  }
  return null;
}

test('custom CMS dynamic item page exposes per-record SEO metadata when published', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const collectionId = `recipes-seo-${token}`;
  const pageSlug = `custom-item-seo-${token}`;
  const firstSlug = `alpha-seo-${token}`;
  const secondSlug = `beta-seo-${token}`;
  const apiHeaders = {
    ...mutationHeaders(collectionId),
    authorization: basicAuthHeader(),
  };
  let pageId: string | null = null;

  try {
    await createCollection(page, collectionId, token, apiHeaders);
    await createRecord(page, collectionId, apiHeaders, {
      author: 'SEO Author Alpha',
      publishedAt: '2026-06-01',
      recordId: `alpha-record-${token}`,
      slug: firstSlug,
      summary: `Alpha custom CMS summary ${token}`,
      title: `Alpha Custom SEO ${token}`,
    });
    await createRecord(page, collectionId, apiHeaders, {
      author: 'SEO Author Beta',
      publishedAt: '2026-06-02',
      recordId: `beta-record-${token}`,
      slug: secondSlug,
      summary: `Beta custom CMS summary ${token}`,
      title: `Beta Custom SEO ${token}`,
    });

    const createPageResponse = await page.request.post('/api/builder/site/pages?locale=ko', {
      headers: apiHeaders,
      data: {
        siteId: 'default',
        locale: 'ko',
        slug: pageSlug,
        title: `Custom item SEO ${token}`,
        addToNavigation: false,
        dynamicItemCmsCollectionId: collectionId,
        dynamicItemRecordSlug: firstSlug,
      },
    });
    await expectStatus(createPageResponse, 200, 'create custom CMS dynamic item SEO page');
    const created = createPageResponseSchema.parse(await createPageResponse.json());
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: apiHeaders,
    });
    await expectStatus(publishResponse, 200, 'publish custom CMS dynamic item SEO page');
    expect(publishResponseSchema.parse(await publishResponse.json()).ok).toBe(true);

    await page.goto(`/ko/${pageSlug}/${firstSlug}`, { waitUntil: 'domcontentloaded' });
    const firstMetadata = await readPageMetadata(page);
    expect(firstMetadata.title).toContain(`Alpha Custom SEO ${token}`);
    expect(firstMetadata.description).toBe(`Alpha custom CMS summary ${token}`);
    expect(firstMetadata.ogTitle).toContain(`Alpha Custom SEO ${token}`);
    expect(firstMetadata.twitterTitle).toContain(`Alpha Custom SEO ${token}`);
    expect(firstMetadata.canonical).toBe(`https://tseng-law.com/ko/${pageSlug}/${firstSlug}`);
    expect(firstMetadata.recordJsonLd).toMatchObject({
      '@type': 'Article',
      headline: `Alpha Custom SEO ${token}`,
      description: `Alpha custom CMS summary ${token}`,
      datePublished: '2026-06-01',
      url: `https://tseng-law.com/ko/${pageSlug}/${firstSlug}`,
      author: { '@type': 'Person', name: 'SEO Author Alpha' },
    });

    await page.goto(`/ko/${pageSlug}/${secondSlug}`, { waitUntil: 'domcontentloaded' });
    const secondMetadata = await readPageMetadata(page);
    expect(secondMetadata.title).toContain(`Beta Custom SEO ${token}`);
    expect(secondMetadata.description).toBe(`Beta custom CMS summary ${token}`);
    expect(secondMetadata.title).not.toBe(firstMetadata.title);
    expect(secondMetadata.canonical).toBe(`https://tseng-law.com/ko/${pageSlug}/${secondSlug}`);
    expect(secondMetadata.recordJsonLd).toMatchObject({
      '@type': 'Article',
      headline: `Beta Custom SEO ${token}`,
      description: `Beta custom CMS summary ${token}`,
      datePublished: '2026-06-02',
      url: `https://tseng-law.com/ko/${pageSlug}/${secondSlug}`,
      author: { '@type': 'Person', name: 'SEO Author Beta' },
    });
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: apiHeaders,
        failOnStatusCode: false,
      });
    }
    await page.request.delete(`/api/builder/sites/default/collections/${collectionId}?locale=ko`, {
      headers: apiHeaders,
      failOnStatusCode: false,
    });
  }
});

async function createCollection(
  page: Page,
  collectionId: string,
  token: string,
  apiHeaders: Record<string, string>,
): Promise<void> {
  await expectStatus(
    await page.request.post('/api/builder/sites/default/collections?locale=ko', {
      headers: apiHeaders,
      data: {
        collectionId,
        name: `Recipe SEO ${token}`,
        slug: collectionId,
        description: 'Custom CMS SEO browser proof.',
        localized: false,
        fields: [
          { fieldId: 'f-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
          { fieldId: 'f-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true, unique: true },
          { fieldId: 'f-summary', key: 'summary', label: 'Summary', type: 'rich-text', localized: false, repeated: false, required: false },
          { fieldId: 'f-hero', key: 'heroImage', label: 'Hero image', type: 'image', localized: false, repeated: false, required: false },
          { fieldId: 'f-date', key: 'publishedAt', label: 'Published at', type: 'date', localized: false, repeated: false, required: false },
          { fieldId: 'f-author', key: 'author', label: 'Author', type: 'text', localized: false, repeated: false, required: false },
        ],
        indexes: [],
        permissions: { read: ['public'], create: ['admin'], update: ['admin'], delete: ['admin'] },
      },
    }),
    201,
    'create custom SEO CMS collection',
  );
}

async function createRecord(
  page: Page,
  collectionId: string,
  apiHeaders: Record<string, string>,
  record: {
    readonly author: string;
    readonly publishedAt: string;
    readonly recordId: string;
    readonly slug: string;
    readonly summary: string;
    readonly title: string;
  },
): Promise<void> {
  await expectStatus(
    await page.request.post(`/api/builder/sites/default/collections/${collectionId}/records?locale=ko`, {
      headers: apiHeaders,
      data: {
        recordId: record.recordId,
        status: 'published',
        locale: 'ko',
        fields: {
          title: record.title,
          slug: record.slug,
          summary: `<p>${record.summary}</p>`,
          heroImage: `https://example.com/${record.slug}.jpg`,
          publishedAt: record.publishedAt,
          author: record.author,
        },
      },
    }),
    201,
    `create custom SEO CMS record ${record.slug}`,
  );
}
