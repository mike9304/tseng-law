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
    if (!createResponse) {
      throw new Error('page creation did not return a response');
    }
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as { success?: boolean; pageId?: string };
    expect(created.success).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();
    if (!pageId) {
      throw new Error('page creation did not return pageId');
    }

    const validateRes = await page.request.get(
      `/api/builder/publish/validate?pageId=${encodeURIComponent(pageId)}&locale=ko`,
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

test('/api/builder/publish/validate blocks code slots with missing saved functions', async ({ page }) => {
  test.setTimeout(60_000);

  const token = `code-slot-validate-${Date.now().toString(36)}`;
  const slug = `code-slot-validate-${token}`;
  let pageId: string | null = null;

  await page.setExtraHTTPHeaders(mutationHeaders(token));

  try {
    const createResponse = await page.request.post('/api/builder/site/pages', {
      data: {
        locale: 'ko',
        slug,
        title: `Code slot validate ${token}`,
        document: {
          version: 1,
          locale: 'ko',
          updatedAt: new Date().toISOString(),
          updatedBy: 'publish-validate-code-slot-test',
          stageWidth: 1280,
          stageHeight: 720,
          nodes: [
            {
              id: `code-slot-node-${token}`,
              kind: 'codeBlock',
              rect: { x: 120, y: 120, width: 520, height: 260 },
              zIndex: 1,
              content: {
                title: `Code slot ${token}`,
                language: 'js',
                code: 'ctx.log("validate"); return true;',
                runMode: 'function',
                functionSlug: `missing-code-slot-function-${token}`,
                showLineNumbers: true,
              },
            },
          ],
        },
      },
      headers: mutationHeaders(slug),
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as { success?: boolean; pageId?: string };
    expect(created.success).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();
    if (!pageId) {
      throw new Error('page creation did not return pageId');
    }

    const validateRes = await page.request.get(
      `/api/builder/publish/validate?pageId=${encodeURIComponent(pageId)}&locale=ko`,
    );
    expect(validateRes.status()).toBe(200);
    const payload = (await validateRes.json()) as {
      ok: boolean;
      hasBlocker: boolean;
      blockerCount: number;
      results: Array<{
        id: string;
        severity: string;
        category: string;
        affectedNodeIds?: string[];
      }>;
    };

    expect(payload.ok).toBe(true);
    expect(payload.hasBlocker).toBe(true);
    expect(payload.blockerCount).toBeGreaterThan(0);
    expect(payload.results).toContainEqual(expect.objectContaining({
      id: `code-slot-function-missing-code-slot-node-${token}`,
      severity: 'blocker',
      category: 'dev',
      affectedNodeIds: [`code-slot-node-${token}`],
    }));

    const publishResponse = await page.request.post(
      `/api/builder/site/pages/${encodeURIComponent(pageId)}/publish?locale=ko`,
      {
        headers: mutationHeaders(`publish-${token}`),
        data: {},
      },
    );
    expect(publishResponse.status()).toBe(422);
    const publishPayload = (await publishResponse.json()) as {
      ok?: boolean;
      error?: string;
      errorCode?: string;
      blockers?: Array<{ id?: string; category?: string; severity?: string }>;
    };
    expect(publishPayload.ok).toBe(false);
    expect(publishPayload.errorCode ?? publishPayload.error).toBe('publish_blocked');
    expect(publishPayload.blockers).toContainEqual(expect.objectContaining({
      id: `code-slot-function-missing-code-slot-node-${token}`,
      severity: 'blocker',
      category: 'dev',
    }));
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

test('/api/builder/publish/validate blocks code slots bound to unsafe saved functions', async ({ page }) => {
  test.setTimeout(60_000);

  const token = `unsafe-code-slot-${Date.now().toString(36)}`;
  const slug = `unsafe-code-slot-${token}`;
  const functionSlug = `unsafe-fn-${Date.now().toString(36)}`;
  let pageId: string | null = null;
  let functionId: string | null = null;

  await page.setExtraHTTPHeaders(mutationHeaders(token));

  try {
    const invalidFunctionResponse = await page.request.post('/api/builder/dev/functions', {
      data: {
        name: `Invalid function ${token}`,
        slug: `invalid-fn-${Date.now().toString(36)}`,
        code: 'return ctx.now();\n}',
      },
      headers: mutationHeaders(`invalid-${token}`),
    });
    expect(invalidFunctionResponse.status()).toBe(400);
    const invalidFunctionPayload = (await invalidFunctionResponse.json()) as {
      ok?: boolean;
      issue?: { field?: string; message?: string };
    };
    expect(invalidFunctionPayload.ok).toBe(false);
    expect(invalidFunctionPayload.issue).toEqual(expect.objectContaining({
      field: 'code',
      message: expect.stringContaining('valid JavaScript function body'),
    }));

    const functionResponse = await page.request.post('/api/builder/dev/functions', {
      data: {
        name: `Unsafe function ${token}`,
        slug: functionSlug,
        code: 'const fs = require("fs"); process.exit(1); return fs;',
      },
      headers: mutationHeaders(`create-${token}`),
    });
    expect(functionResponse.status()).toBe(201);
    const functionPayload = (await functionResponse.json()) as {
      ok?: boolean;
      function?: { id?: string; slug?: string };
    };
    expect(functionPayload.ok).toBe(true);
    functionId = functionPayload.function?.id ?? null;
    expect(functionId).toBeTruthy();

    const createResponse = await page.request.post('/api/builder/site/pages', {
      data: {
        locale: 'ko',
        slug,
        title: `Unsafe code slot validate ${token}`,
        document: {
          version: 1,
          locale: 'ko',
          updatedAt: new Date().toISOString(),
          updatedBy: 'publish-validate-unsafe-code-slot-test',
          stageWidth: 1280,
          stageHeight: 720,
          nodes: [
            {
              id: `code-slot-node-${token}`,
              kind: 'codeBlock',
              rect: { x: 120, y: 120, width: 520, height: 260 },
              zIndex: 1,
              content: {
                title: `Unsafe code slot ${token}`,
                language: 'js',
                code: 'ctx.log("validate"); return true;',
                runMode: 'function',
                functionSlug,
                showLineNumbers: true,
              },
            },
          ],
        },
      },
      headers: mutationHeaders(slug),
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as { success?: boolean; pageId?: string };
    expect(created.success).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();
    if (!pageId) {
      throw new Error('page creation did not return pageId');
    }

    const expectedBlockerId = `code-slot-function-banned-api-code-slot-node-${token}`;
    const validateRes = await page.request.get(
      `/api/builder/publish/validate?pageId=${encodeURIComponent(pageId)}&locale=ko`,
    );
    expect(validateRes.status()).toBe(200);
    const payload = (await validateRes.json()) as {
      ok: boolean;
      hasBlocker: boolean;
      results: Array<{
        id: string;
        severity: string;
        category: string;
        message?: string;
        affectedNodeIds?: string[];
      }>;
    };

    expect(payload.ok).toBe(true);
    expect(payload.hasBlocker).toBe(true);
    expect(payload.results).toContainEqual(expect.objectContaining({
      id: expectedBlockerId,
      severity: 'blocker',
      category: 'dev',
      affectedNodeIds: [`code-slot-node-${token}`],
      message: expect.stringContaining('require'),
    }));

    const publishResponse = await page.request.post(
      `/api/builder/site/pages/${encodeURIComponent(pageId)}/publish?locale=ko`,
      {
        headers: mutationHeaders(`publish-${token}`),
        data: {},
      },
    );
    expect(publishResponse.status()).toBe(422);
    const publishPayload = (await publishResponse.json()) as {
      ok?: boolean;
      error?: string;
      errorCode?: string;
      blockers?: Array<{ id?: string; category?: string; severity?: string }>;
    };
    expect(publishPayload.ok).toBe(false);
    expect(publishPayload.errorCode ?? publishPayload.error).toBe('publish_blocked');
    expect(publishPayload.blockers).toContainEqual(expect.objectContaining({
      id: expectedBlockerId,
      severity: 'blocker',
      category: 'dev',
    }));
  } finally {
    if (pageId) {
      await page.request
        .delete(`/api/builder/site/pages/${encodeURIComponent(pageId)}?locale=ko`, {
          headers: mutationHeaders(`cleanup-page-${token}`),
        })
        .catch(() => undefined);
    }
    if (functionId) {
      await page.request
        .delete(`/api/builder/dev/functions/${encodeURIComponent(functionId)}`, {
          headers: mutationHeaders(`cleanup-fn-${token}`),
        })
        .catch(() => undefined);
    }
  }
});
