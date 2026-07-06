import { expect, type APIRequestContext } from '@playwright/test';
import { createHomePageCanvasDocument } from '@/lib/builder/canvas/seed-home';

type ApiResponse = Awaited<ReturnType<APIRequestContext['post']>>;

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'home-composite-fidelity';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function waitForRateLimit(response: ApiResponse): Promise<boolean> {
  if (response.status() !== 429) return false;
  const retryAfter = Number(response.headers()['retry-after'] || '1');
  const waitMs = Math.max(1000, Math.min(65_000, Number.isFinite(retryAfter) ? retryAfter * 1000 : 1000));
  await new Promise((resolve) => setTimeout(resolve, waitMs));
  return true;
}

export async function createPublishedCompositeHomeTestPage(
  request: APIRequestContext,
  slug: string,
  title: string,
): Promise<string> {
  const document = {
    ...createHomePageCanvasDocument('ko'),
    updatedAt: new Date().toISOString(),
    updatedBy: `home-composite-fidelity-${slug}`,
  };

  let response: ApiResponse | null = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await request.post('/api/builder/site/pages', {
      data: { locale: 'ko', slug, title, document },
      headers: mutationHeaders(slug),
    });
    if (!(await waitForRateLimit(response))) break;
  }
  expect(response).toBeTruthy();
  response = response!;
  const createPayload = await response.json() as { success?: boolean; pageId?: string; error?: string };
  expect(response.status(), JSON.stringify(createPayload)).toBe(200);
  expect(createPayload.success, createPayload.error).toBe(true);
  expect(createPayload.pageId).toBeTruthy();

  const pageId = createPayload.pageId!;
  const publishResponse = await request.post(`/api/builder/site/pages/${pageId}/publish`, {
    data: {},
    headers: mutationHeaders(`${slug}-publish`),
  });
  const publishPayload = await publishResponse.json() as { ok?: boolean; error?: string };
  expect(publishResponse.status(), JSON.stringify(publishPayload)).toBe(200);
  expect(publishPayload.ok, publishPayload.error).toBe(true);

  return pageId;
}

export async function deleteBuilderTestPage(
  request: APIRequestContext,
  pageId: string | null,
): Promise<void> {
  if (!pageId) return;
  await request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
    headers: mutationHeaders(`${pageId}-delete`),
    failOnStatusCode: false,
  });
}
