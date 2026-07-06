import { readFile } from 'node:fs/promises';
import { expect, test, type APIRequestContext } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safe = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'dev-fn';
  return { 'x-forwarded-for': `pw-${safe}` };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

async function createFunction(
  request: APIRequestContext,
  scope: string,
  payload: { name: string; slug: string; code: string },
): Promise<string> {
  const response = await request.post('/api/builder/dev/functions', {
    headers: mutationHeaders(`dev-fn-create-${scope}`),
    data: payload,
  });
  expect(response.status(), `create status (${response.status()})`).toBe(201);
  const body: unknown = await response.json();
  if (!isRecord(body) || !isRecord(body.function) || typeof body.function.id !== 'string') {
    throw new Error('Unexpected function create response');
  }
  return body.function.id;
}

async function deleteFunction(request: APIRequestContext, id: string, scope: string): Promise<void> {
  await request.delete(`/api/builder/dev/functions/${id}`, {
    headers: mutationHeaders(`dev-fn-delete-${scope}`),
    failOnStatusCode: false,
  });
}

test('function logs can be filtered and exported from the admin surface', async ({ page }) => {
  const token = Date.now().toString(36);
  const slug = `pw-logs-${token}`;
  const infoMessage = `alpha-export-${token}`;
  const warnMessage = `beta-export-${token}`;
  let createdId: string | null = null;

  try {
    createdId = await createFunction(page.request, token, {
      name: `Logs ${token}`,
      slug,
      code: `ctx.log("${infoMessage}"); ctx.warn("${warnMessage}"); return true;`,
    });

    const invokeResponse = await page.request.post(
      `/api/builder/dev/functions/${createdId}/invoke`,
      { headers: mutationHeaders(`dev-fn-logs-${token}`) },
    );
    expect(invokeResponse.status()).toBe(200);

    await page.goto('/ko/admin-builder/_dev/functions');
    await expect(page.locator('[data-builder-dev-functions-admin="true"]')).toBeVisible();
    await page.locator(`[data-builder-dev-function-row="${slug}"]`).click();
    await expect(page.locator('[data-builder-dev-function-logs="true"]')).toContainText(infoMessage);
    await expect(page.locator('[data-builder-dev-function-logs="true"]')).toContainText(warnMessage);

    await page.locator('[data-builder-dev-log-level-filter="true"]').selectOption('warn');
    await page.locator('[data-builder-dev-log-search="true"]').fill(warnMessage);
    await expect(page.locator('[data-builder-dev-function-logs="true"]')).toContainText(warnMessage);
    await expect(page.locator('[data-builder-dev-function-logs="true"]')).not.toContainText(infoMessage);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('[data-builder-dev-log-export="true"]').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(`dev-logs-function-warn-${warnMessage}.json`);
    const downloadedPath = await download.path();
    if (!downloadedPath) throw new Error('Expected Playwright to expose downloaded log export path');

    const raw = await readFile(downloadedPath, 'utf8');
    const exportBody: unknown = JSON.parse(raw);
    if (!isRecord(exportBody) || !Array.isArray(exportBody.entries) || !isRecord(exportBody.filters)) {
      throw new Error('Unexpected logs export payload');
    }
    expect(exportBody.source).toBe('function');
    expect(exportBody.filters.level).toBe('warn');
    expect(exportBody.filters.query).toBe(warnMessage);
    expect(exportBody.entries).toHaveLength(1);
    const firstEntry = exportBody.entries[0];
    if (!isRecord(firstEntry)) throw new Error('Unexpected log entry payload');
    expect(firstEntry.message).toContain(warnMessage);
    await expect(page.locator('[data-builder-dev-log-export-status="true"]')).toContainText('로그 1개');

    const serverExportParams = new URLSearchParams({
      source: 'function',
      format: 'jsonl',
      level: 'warn',
      query: warnMessage,
      limit: '20',
    });
    const serverExportResponse = await page.request.get(`/api/builder/dev/logs?${serverExportParams.toString()}`);
    expect(serverExportResponse.status()).toBe(200);
    expect(serverExportResponse.headers()['content-disposition']).toBe(
      `attachment; filename="dev-logs-function-warn-${warnMessage}.jsonl"`,
    );
    const serverRaw = await serverExportResponse.text();
    const serverEntries = serverRaw.trim().split('\n').map((line) => JSON.parse(line));
    expect(serverEntries).toHaveLength(1);
    const serverFirstEntry = serverEntries[0];
    if (!isRecord(serverFirstEntry)) throw new Error('Unexpected server log export entry');
    expect(serverFirstEntry.message).toContain(warnMessage);
    expect(serverFirstEntry.level).toBe('warn');

    const pruneParams = new URLSearchParams({
      source: 'function',
      before: '2999-01-01T00:00:00.000Z',
    });
    const pruneResponse = await page.request.delete(`/api/builder/dev/logs?${pruneParams.toString()}`, {
      headers: mutationHeaders(`dev-fn-logs-prune-${token}`),
    });
    expect(pruneResponse.status()).toBe(200);
    const pruneBody: unknown = await pruneResponse.json();
    if (!isRecord(pruneBody) || !isRecord(pruneBody.retention)) {
      throw new Error('Unexpected log prune response');
    }
    expect(pruneBody.source).toBe('function');
    expect(pruneBody.retention.deleted).toBeGreaterThan(0);

    const afterPruneResponse = await page.request.get(`/api/builder/dev/logs?${serverExportParams.toString()}`);
    expect(afterPruneResponse.status()).toBe(200);
    expect((await afterPruneResponse.text()).trim()).toBe('');
  } finally {
    if (createdId) await deleteFunction(page.request, createdId, token);
  }
});
