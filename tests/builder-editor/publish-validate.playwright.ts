import { expect, test, type APIRequestContext } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'publish-validate';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function waitForRateLimit(response: Awaited<ReturnType<APIRequestContext['post']>>): Promise<boolean> {
  if (response.status() !== 429) return false;
  const retryAfter = Number(response.headers()['retry-after'] || '1');
  await new Promise((resolve) => setTimeout(resolve, Math.max(1000, retryAfter * 1000)));
  return true;
}

test('/api/builder/publish/validate returns the publish gate suite for a draft page', async ({ page }) => {
  test.setTimeout(60_000);

  const token = `validate-${Date.now().toString(36)}`;
  const slug = `validate-${token}`;
  let pageId: string | null = null;

  await page.setExtraHTTPHeaders(mutationHeaders(token));

  try {
    let createResponse = null as Awaited<ReturnType<APIRequestContext['post']>> | null;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      createResponse = await page.request.post('/api/builder/site/pages', {
        data: {
          locale: 'ko',
          slug,
          title: `Validate ${token}`,
          document: {
            version: 1,
            locale: 'ko',
            updatedAt: new Date().toISOString(),
            updatedBy: 'publish-validate-test',
            stageWidth: 1280,
            stageHeight: 720,
            nodes: [],
          },
        },
        headers: mutationHeaders(slug),
      });
      if (!(await waitForRateLimit(createResponse))) break;
    }
    expect(createResponse).toBeTruthy();
    expect(createResponse!.status()).toBe(200);
    const created = (await createResponse!.json()) as { success?: boolean; pageId?: string };
    expect(created.success).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();

    const validateRes = await page.request.get(
      `/api/builder/publish/validate?pageId=${encodeURIComponent(pageId!)}&locale=ko`,
    );
    expect(validateRes.status()).toBe(200);
    const payload = (await validateRes.json()) as {
      ok: boolean;
      pageId: string;
      hasBlocker: boolean;
      blockerCount: number;
      warningCount: number;
      results: Array<{ severity: string; kind: string }>;
    };
    expect(payload.ok).toBe(true);
    expect(payload.pageId).toBe(pageId);
    expect(typeof payload.hasBlocker).toBe('boolean');
    expect(Array.isArray(payload.results)).toBe(true);
    // Empty canvas should produce at least one blocker (empty content check)
    expect(payload.blockerCount + payload.warningCount).toBeGreaterThan(0);
  } finally {
    if (pageId) {
      await page.request
        .delete(`/api/builder/site/pages/${encodeURIComponent(pageId)}?locale=ko`, {
          headers: mutationHeaders(`cleanup-${token}`),
        })
        .catch(() => undefined);
    }
  }
});
