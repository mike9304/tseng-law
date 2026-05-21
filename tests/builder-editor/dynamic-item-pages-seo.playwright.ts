import { expect, test, type Page } from '@playwright/test';

type DynamicRouteRecord = {
  recordId: string;
  primaryLabel: string;
  seo?: {
    title?: string;
    description?: string;
    canonicalPath?: string;
    image?: string;
    noIndex?: boolean;
  };
};

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'dynamic-item-seo';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function readPageMetadata(page: Page): Promise<{
  title: string | null;
  description: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterTitle: string | null;
  canonical: string | null;
  robots: string | null;
}> {
  return page.evaluate(() => {
    const meta = (selector: string): string | null => {
      const element = document.querySelector(selector) as HTMLMetaElement | null;
      return element?.content ?? null;
    };
    const link = (rel: string): string | null => {
      const element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      return element?.href ?? null;
    };
    return {
      title: document.title || null,
      description: meta('meta[name="description"]'),
      ogTitle: meta('meta[property="og:title"]'),
      ogDescription: meta('meta[property="og:description"]'),
      ogImage: meta('meta[property="og:image"]'),
      twitterTitle: meta('meta[name="twitter:title"]'),
      canonical: link('canonical'),
      robots: meta('meta[name="robots"]'),
    };
  });
}

test('CMS dynamic item page exposes per-record SEO metadata when published', async ({ page }) => {
  test.setTimeout(120_000);

  const routeResponse = await page.request.get('/api/builder/sites/default/dynamic-routes/columns.item?locale=ko');
  expect(routeResponse.status()).toBe(200);
  const routePayload = (await routeResponse.json()) as { detail?: { sampleRecords?: DynamicRouteRecord[] } };
  const records = routePayload.detail?.sampleRecords ?? [];
  expect(records.length).toBeGreaterThan(1);
  const firstRecord = records[0]!;
  const secondRecord = records.find((record) => record.recordId !== firstRecord.recordId) ?? records[1]!;

  const token = `seo-${Date.now().toString(36)}`;
  const slug = `dynamic-item-seo-${token}`;
  let pageId: string | null = null;
  try {
    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers: mutationHeaders(slug),
      data: {
        locale: 'ko',
        slug,
        title: `Dynamic SEO ${token}`,
        addToNavigation: false,
        dynamicItemCollectionId: 'columns',
        dynamicItemRecordSlug: firstRecord.recordId,
      },
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);
    expect((await publishResponse.json()) as { ok?: boolean }).toMatchObject({ ok: true });

    await page.goto(`/ko/${slug}/${firstRecord.recordId}`, { waitUntil: 'domcontentloaded' });
    const firstMetadata = await readPageMetadata(page);
    expect(firstMetadata.title).toBeTruthy();
    expect(firstMetadata.title).toContain(firstRecord.primaryLabel);
    expect(firstMetadata.description).toBeTruthy();
    expect(firstMetadata.ogTitle).toContain(firstRecord.primaryLabel);
    expect(firstMetadata.canonical?.endsWith(`/ko/columns/${firstRecord.recordId}`)).toBe(true);

    // Navigating to a different record on the same template page must yield
    // distinct per-record metadata — proves the SEO override is record-driven.
    await page.goto(`/ko/${slug}/${secondRecord.recordId}`, { waitUntil: 'domcontentloaded' });
    const secondMetadata = await readPageMetadata(page);
    expect(secondMetadata.title).toContain(secondRecord.primaryLabel);
    expect(secondMetadata.title).not.toBe(firstMetadata.title);
    expect(secondMetadata.canonical?.endsWith(`/ko/columns/${secondRecord.recordId}`)).toBe(true);
    expect(secondMetadata.description).not.toBe(firstMetadata.description);
  } finally {
    if (pageId) {
      await page.request
        .delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
        })
        .catch(() => undefined);
    }
  }
});
