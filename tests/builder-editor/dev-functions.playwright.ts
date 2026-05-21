import { expect, test, type APIRequestContext } from '@playwright/test';

const LOCALE = 'ko';

function mutationHeaders(scope: string): Record<string, string> {
  const safe = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'dev-fn';
  return { 'x-forwarded-for': `pw-${safe}` };
}

async function createFunction(request: APIRequestContext, scope: string, payload: { name: string; slug: string; code: string }) {
  const response = await request.post('/api/builder/dev/functions', {
    headers: mutationHeaders(`dev-fn-create-${scope}`),
    data: payload,
  });
  expect(response.status(), `create status (${response.status()})`).toBe(201);
  return (await response.json()) as { ok: boolean; function: { id: string; slug: string } };
}

async function deleteFunction(request: APIRequestContext, id: string, scope: string) {
  await request.delete(`/api/builder/dev/functions/${id}`, {
    headers: mutationHeaders(`dev-fn-delete-${scope}`),
    failOnStatusCode: false,
  });
}

test('admin can create, invoke, and see logs for a stub function', async ({ page }) => {
  const token = Date.now().toString(36);
  const slug = `pw-fn-${token}`;
  let createdId: string | null = null;
  try {
    const created = await createFunction(page.request, token, {
      name: `Playwright ${token}`,
      slug,
      code: 'ctx.log("hello from fn"); return 2 + 2;',
    });
    createdId = created.function.id;
    expect(created.function.slug).toBe(slug);

    const invokeResponse = await page.request.post(
      `/api/builder/dev/functions/${createdId}/invoke`,
      { headers: mutationHeaders(`dev-fn-invoke-${token}`) },
    );
    expect(invokeResponse.status()).toBe(200);
    const invokeJson = (await invokeResponse.json()) as {
      ok: boolean;
      result: unknown;
      logs: Array<{ level: string; message: string }>;
    };
    expect(invokeJson.ok).toBe(true);
    expect(invokeJson.result).toBe(4);
    expect(invokeJson.logs.some((entry) => entry.message.includes('hello from fn'))).toBe(true);

    const logsResponse = await page.request.get(`/api/builder/dev/logs?source=function`);
    expect(logsResponse.status()).toBe(200);
    const logsJson = (await logsResponse.json()) as {
      entries: Array<{ message: string; reference?: string }>;
    };
    expect(logsJson.entries.some((entry) => entry.reference === slug && entry.message.includes('hello from fn'))).toBe(true);
  } finally {
    if (createdId) await deleteFunction(page.request, createdId, token);
  }
});