import { expect, test, type APIRequestContext } from '@playwright/test';
import { getCodeAssistantCopy } from '@/components/builder/dev/code-assistant-copy';
import { getSdkDocSections } from '@/lib/builder/dev/sdk-docs';

const LOCALE = 'ko';
const LOCALES = [
  { locale: 'ko', shellTitle: '함수 관리', pageTitle: 'Builder SDK', docsTitle: 'Builder SDK', sdkKeyTypes: '주요 타입', sdkExample: '예시', openSdkDocs: 'SDK 문서 열기' },
  { locale: 'zh-hant', shellTitle: '函數管理', pageTitle: 'Builder SDK', docsTitle: 'Builder SDK', sdkKeyTypes: '主要型別', sdkExample: '範例', openSdkDocs: '開啟 SDK 文件' },
] as const;

function titlePattern(expected: string): RegExp {
  return new RegExp(`.*${expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*`);
}

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
      `/api/builder/dev/functions/${slug}/invoke`,
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

    await expect.poll(async () => {
      const logsResponse = await page.request.get(`/api/builder/dev/logs?source=function`);
      expect(logsResponse.status()).toBe(200);
      const logsJson = (await logsResponse.json()) as {
        entries: Array<{ message: string; reference?: string }>;
      };
      return logsJson.entries.some((entry) => entry.reference === slug && entry.message.includes('hello from fn'));
    }, { timeout: 10_000 }).toBe(true);
  } finally {
    if (createdId) await deleteFunction(page.request, createdId, token);
  }
});

test('function editor exposes SDK quick docs and canonical SDK route', async ({ page }) => {
  const token = Date.now().toString(36);
  const slug = `pw-docs-${token}`;
  let createdId: string | null = null;
  try {
    await page.setExtraHTTPHeaders(mutationHeaders(`dev-fn-docs-ui-${token}`));
    const created = await createFunction(page.request, token, {
      name: `Docs ${token}`,
      slug,
      code: 'ctx.log("docs"); return true;',
    });
    createdId = created.function.id;

    const sdkResponse = await page.request.get('/api/builder/dev/sdk');
    expect(sdkResponse.status()).toBe(200);
    const sdkJson = (await sdkResponse.json()) as {
      ok: boolean;
      sections: Array<{ id: string; example: string; types: string[] }>;
    };
    const functionSection = sdkJson.sections.find((section) => section.id === 'functions');
    expect(functionSection?.example).toContain('/api/builder/dev/functions/{slug-or-id}/invoke');
    expect(functionSection?.types.join('\n')).toContain('BuilderFunctionInvocationResult');

    await page.goto('/ko/admin-builder/_dev/functions');
    await expect(page.locator('[data-builder-dev-functions-admin="true"]')).toBeVisible();
    await page.locator(`[data-builder-dev-function-row="${slug}"]`).click();
    await expect(page.locator('[data-builder-dev-function-docs="true"]')).toBeVisible();
    await expect(page.locator('[data-builder-dev-function-invoke-path="true"]')).toContainText(
      `/api/builder/dev/functions/${slug}/invoke`,
    );
    await expect(page.locator('[data-builder-dev-function-curl="true"]')).toContainText('curl -X POST');
    await page.locator('[data-builder-dev-function-sdk-link="true"]').click();
    await expect(page).toHaveURL(/\/ko\/admin-builder\/_dev\/sdk#functions$/);
    await expect(page.locator('[data-builder-sdk-docs="true"]')).toBeVisible();
    await expect(page.locator('[data-builder-sdk-section="functions"]')).toContainText(
      getSdkDocSections('ko').find((section) => section.id === 'functions')?.title ?? '함수 API',
    );
    await expect(page.locator('[data-builder-sdk-section="functions"]')).toContainText('worker-vm');
  } finally {
    if (createdId) await deleteFunction(page.request, createdId, token);
  }
});

test('function admin shell and SDK docs localize for ko and zh-hant', async ({ page }) => {
  for (const copy of LOCALES) {
    const token = `${copy.locale}-${Date.now().toString(36)}`;
    const slug = `pw-docs-${token}`;
    let createdId: string | null = null;
    const assistantCopy = getCodeAssistantCopy(copy.locale);
    const sdkCopy = getSdkDocSections(copy.locale);
    try {
      const created = await createFunction(page.request, token, {
        name: `Docs ${token}`,
        slug,
        code: 'ctx.log("docs"); return true;',
      });
      createdId = created.function.id;

      await page.goto(`/${copy.locale}/admin-builder/_dev/functions`);
      await expect(page).toHaveTitle(titlePattern(copy.pageTitle));
      await expect(page.locator('[data-builder-dev-functions-admin="true"]')).toBeVisible();
      await expect(page.getByRole('heading', { name: copy.shellTitle })).toBeVisible();
      await expect(page.getByRole('link', { name: copy.openSdkDocs })).toBeVisible();

      await page.locator(`[data-builder-dev-function-row="${slug}"]`).click();
      await expect(page.locator('[data-builder-dev-function-docs="true"]')).toBeVisible();
      await expect(page.locator('[data-builder-dev-function-invoke-path="true"]')).toContainText(
        `/api/builder/dev/functions/${slug}/invoke`,
      );
      await page.locator('[data-builder-ai-code-open="true"]').click();
      await expect(page.getByRole('dialog', { name: assistantCopy.title })).toBeVisible();
      await expect(page.getByRole('radiogroup', { name: assistantCopy.actionGroupLabel })).toBeVisible();
      await expect(page.locator('[data-builder-ai-code-panel="true"]')).toContainText(assistantCopy.contextLabel);
      await expect(page.locator('[data-builder-ai-code-panel="true"]')).toContainText(assistantCopy.run);
      await page.getByRole('button', { name: assistantCopy.closeLabel }).click();
      await expect(page.getByRole('link', { name: copy.openSdkDocs })).toBeVisible();
      await page.getByRole('link', { name: copy.openSdkDocs }).click();

      await expect(page).toHaveURL(new RegExp(`/${copy.locale}/admin-builder/_dev/sdk#functions$`));
      await expect(page).toHaveTitle(titlePattern(copy.docsTitle));
      await expect(page.locator('[data-builder-sdk-docs="true"]')).toBeVisible();
      await expect(page.locator('h1')).toContainText(copy.docsTitle);
      await expect(page.locator('[data-builder-sdk-section="functions"]').getByRole('heading', { name: copy.sdkKeyTypes })).toBeVisible();
      await expect(page.locator('[data-builder-sdk-section="functions"]').getByRole('heading', { name: copy.sdkExample })).toBeVisible();
      await expect(page.locator('[data-builder-sdk-section="functions"]')).toContainText(
        sdkCopy.find((section) => section.id === 'functions')?.title ?? 'Functions API',
      );
      await expect(page.locator('[data-builder-sdk-section="functions"]')).toContainText('worker-vm');
    } finally {
      if (createdId) await deleteFunction(page.request, createdId, token);
    }
  }
});

test('function invoke sandbox times out runaway async code', async ({ page }) => {
  const token = Date.now().toString(36);
  const slug = `pw-timeout-${token}`;
  let createdId: string | null = null;
  try {
    const created = await createFunction(page.request, token, {
      name: `Timeout ${token}`,
      slug,
      code: 'ctx.log("before hang"); await new Promise(() => {});',
    });
    createdId = created.function.id;

    const invokeResponse = await page.request.post(
      `/api/builder/dev/functions/${createdId}/invoke`,
      { headers: mutationHeaders(`dev-fn-timeout-${token}`) },
    );
    expect(invokeResponse.status()).toBe(408);
    const invokeJson = (await invokeResponse.json()) as {
      ok: boolean;
      error?: string;
      timedOut?: boolean;
      runtime?: string;
      logs: Array<{ level: string; message: string }>;
    };
    expect(invokeJson.ok).toBe(false);
    expect(invokeJson.timedOut).toBe(true);
    expect(invokeJson.runtime).toBe('worker-vm');
    expect(invokeJson.error).toContain('timeout');
    expect(invokeJson.logs.some((entry) => entry.message.includes('before hang'))).toBe(true);

    await expect.poll(async () => {
      const logsResponse = await page.request.get(`/api/builder/dev/logs?source=function`);
      expect(logsResponse.status()).toBe(200);
      const logsJson = (await logsResponse.json()) as {
        entries: Array<{ level: string; message: string; reference?: string }>;
      };
      return logsJson.entries.some((entry) => (
        entry.reference === slug
        && entry.level === 'error'
        && entry.message.includes('timeout')
      ));
    }, { timeout: 10_000 }).toBe(true);
  } finally {
    if (createdId) await deleteFunction(page.request, createdId, token);
  }
});

test('function editor applies an AI code assistant fix and saves it', async ({ page }) => {
  const token = Date.now().toString(36);
  const slug = `pw-ai-fn-${token}`;
  let createdId: string | null = null;
  const assistantCopy = getCodeAssistantCopy('ko');
  const fixedCode = 'ctx.log("fixed by AI"); return 2;';
  try {
    await page.setExtraHTTPHeaders(mutationHeaders(`dev-fn-ai-ui-${token}`));
    const created = await createFunction(page.request, token, {
      name: `AI function ${token}`,
      slug,
      code: 'return 1;',
    });
    createdId = created.function.id;

    await page.route('**/api/builder/ai-generator/code', async (route) => {
      const requestBody = route.request().postDataJSON() as {
        code?: string;
        action?: string;
        context?: string;
      };
      expect(requestBody.code).toBe('return 1;');
      expect(requestBody.action).toBe('fix');
      expect(requestBody.context).toContain(slug);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          model: 'mock-code-model',
          action: 'fix',
          language: 'ts',
          result: 'Return value was corrected.',
          fixedCode,
          diff: '--- a/function.ts\n+++ b/function.ts\n@@ -1,1 +1,1 @@\n-return 1;\n+ctx.log("fixed by AI"); return 2;',
        }),
      });
    });

    await page.goto('/ko/admin-builder/_dev/functions');
    await expect(page.locator('[data-builder-dev-functions-admin="true"]')).toBeVisible();
    await page.locator(`[data-builder-dev-function-row="${slug}"]`).click();
    const codeEditor = page.locator('[data-builder-dev-function-code="true"]');
    await expect(codeEditor).toHaveValue('return 1;');

    await page.locator('[data-builder-ai-code-open="true"]').click();
    await expect(page.locator('[data-builder-ai-code-panel="true"]')).toBeVisible();
    await expect(page.getByRole('dialog', { name: assistantCopy.title })).toBeVisible();
    await expect(page.getByRole('radiogroup', { name: assistantCopy.actionGroupLabel })).toBeVisible();
    await page.getByRole('radio', { name: assistantCopy.actionLabels.fix }).click();
    await page.getByRole('button', { name: assistantCopy.run, exact: true }).click();
    await expect(page.locator('[data-builder-ai-code-panel="true"]')).toContainText('Return value was corrected.');
    await expect(page.locator('[data-builder-ai-code-review="true"]')).toBeVisible();
    await expect(page.getByRole('button', { name: assistantCopy.diff })).toBeVisible();
    await expect(page.locator('[data-builder-ai-code-diff-summary="true"]')).toContainText(assistantCopy.diffSummary(1, 1));
    await page.locator('[data-builder-ai-code-review-mode="current"]').click();
    await expect(page.locator('[data-builder-ai-code-review-text="true"]')).toContainText('return 1;');
    await page.locator('[data-builder-ai-code-review-mode="suggested"]').click();
    await expect(page.locator('[data-builder-ai-code-review-text="true"]')).toContainText(fixedCode);
    await page.locator('[data-builder-ai-code-review-mode="diff"]').click();
    await expect(page.locator('[data-builder-ai-code-review-text="true"]')).toContainText('-return 1;');
    await page.locator('[data-builder-ai-code-apply="true"]').click();
    await expect(codeEditor).toHaveValue(fixedCode);
    await expect(page.locator('[data-builder-dev-function-undo-ai="true"]')).toBeVisible();
    await page.locator('[data-builder-dev-function-undo-ai="true"]').click();
    await expect(codeEditor).toHaveValue('return 1;');

    await page.locator('[data-builder-ai-code-open="true"]').click();
    await expect(page.locator('[data-builder-ai-code-panel="true"]')).toBeVisible();
    await page.getByRole('radio', { name: assistantCopy.actionLabels.fix }).click();
    await page.getByRole('button', { name: assistantCopy.run, exact: true }).click();
    await expect(page.locator('[data-builder-ai-code-review="true"]')).toBeVisible();
    await page.locator('[data-builder-ai-code-apply="true"]').click();
    await expect(codeEditor).toHaveValue(fixedCode);

    await page.locator('[data-builder-dev-function-save="true"]').click();
    await expect(page.locator('[data-builder-dev-function-status="true"]')).toContainText('함수를 저장했습니다.');

    const listResponse = await page.request.get('/api/builder/dev/functions');
    expect(listResponse.status()).toBe(200);
    const listJson = (await listResponse.json()) as {
      functions: Array<{ id: string; code: string }>;
    };
    expect(listJson.functions.find((entry) => entry.id === createdId)?.code).toBe(fixedCode);
  } finally {
    await page.unroute('**/api/builder/ai-generator/code').catch(() => undefined);
    if (createdId) await deleteFunction(page.request, createdId, token);
  }
});

test('function editor can apply a selected AI code diff hunk', async ({ page }) => {
  const token = Date.now().toString(36);
  const slug = `pw-ai-hunk-${token}`;
  let createdId: string | null = null;
  const assistantCopy = getCodeAssistantCopy('ko');
  const originalCode = [
    'const base = 1;',
    'ctx.log("line 2");',
    'const keep3 = base + 3;',
    'const keep4 = keep3 + 1;',
    'const keep5 = keep4 + 1;',
    'const keep6 = keep5 + 1;',
    'const keep7 = keep6 + 1;',
    'const keep8 = keep7 + 1;',
    'const keep9 = keep8 + 1;',
    'return base;',
  ].join('\n');
  const fixedCode = [
    'const base = 2;',
    'ctx.log("line 2");',
    'const keep3 = base + 3;',
    'const keep4 = keep3 + 1;',
    'const keep5 = keep4 + 1;',
    'const keep6 = keep5 + 1;',
    'const keep7 = keep6 + 1;',
    'const keep8 = keep7 + 1;',
    'const keep9 = keep8 + 1;',
    'return base + 1;',
  ].join('\n');
  const partialCode = [
    'const base = 1;',
    'ctx.log("line 2");',
    'const keep3 = base + 3;',
    'const keep4 = keep3 + 1;',
    'const keep5 = keep4 + 1;',
    'const keep6 = keep5 + 1;',
    'const keep7 = keep6 + 1;',
    'const keep8 = keep7 + 1;',
    'const keep9 = keep8 + 1;',
    'return base + 1;',
  ].join('\n');

  try {
    await page.setExtraHTTPHeaders(mutationHeaders(`dev-fn-ai-hunk-ui-${token}`));
    const created = await createFunction(page.request, token, {
      name: `AI hunk function ${token}`,
      slug,
      code: originalCode,
    });
    createdId = created.function.id;

    await page.route('**/api/builder/ai-generator/code', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          model: 'mock-code-model',
          action: 'fix',
          language: 'ts',
          result: 'Two independent fixes are available.',
          fixedCode,
          diff: [
            '--- a/function.ts',
            '+++ b/function.ts',
            '@@ -1,3 +1,3 @@',
            '-const base = 1;',
            '+const base = 2;',
            ' ctx.log("line 2");',
            ' const keep3 = base + 3;',
            '@@ -8,3 +8,3 @@',
            ' const keep8 = keep7 + 1;',
            ' const keep9 = keep8 + 1;',
            '-return base;',
            '+return base + 1;',
          ].join('\n'),
          diffHunks: [
            {
              id: 'hunk-1-1-1',
              oldStart: 1,
              oldCount: 3,
              newStart: 1,
              newCount: 3,
              lines: [
                { type: 'delete', text: 'const base = 1;' },
                { type: 'insert', text: 'const base = 2;' },
                { type: 'context', text: 'ctx.log("line 2");' },
                { type: 'context', text: 'const keep3 = base + 3;' },
              ],
            },
            {
              id: 'hunk-2-8-8',
              oldStart: 8,
              oldCount: 3,
              newStart: 8,
              newCount: 3,
              lines: [
                { type: 'context', text: 'const keep8 = keep7 + 1;' },
                { type: 'context', text: 'const keep9 = keep8 + 1;' },
                { type: 'delete', text: 'return base;' },
                { type: 'insert', text: 'return base + 1;' },
              ],
            },
          ],
        }),
      });
    });

    await page.goto('/ko/admin-builder/_dev/functions');
    await expect(page.locator('[data-builder-dev-functions-admin="true"]')).toBeVisible();
    await page.locator(`[data-builder-dev-function-row="${slug}"]`).click();
    const codeEditor = page.locator('[data-builder-dev-function-code="true"]');
    await expect(codeEditor).toHaveValue(originalCode);

    await page.locator('[data-builder-ai-code-open="true"]').click();
    await expect(page.getByRole('dialog', { name: assistantCopy.title })).toBeVisible();
    await expect(page.getByRole('radiogroup', { name: assistantCopy.actionGroupLabel })).toBeVisible();
    await page.getByRole('radio', { name: assistantCopy.actionLabels.fix }).click();
    await page.getByRole('button', { name: assistantCopy.run, exact: true }).click();
    await expect(page.locator('[data-builder-ai-code-hunks="true"]')).toBeVisible();
    await expect(page.getByRole('button', { name: assistantCopy.diff })).toBeVisible();
    await expect(page.locator('[data-builder-ai-code-hunks="true"]')).toContainText(assistantCopy.selectedDiffLabel);
    await expect(page.locator('[data-builder-ai-code-hunks="true"]')).toContainText(assistantCopy.hunkLabel(1, 1, 1, 1));
    await expect(page.locator('[data-builder-ai-code-hunk-summary="true"]')).toContainText(assistantCopy.hunksSummary(2, 2));
    await page.locator('[data-builder-ai-code-hunk-toggle="hunk-1-1-1"]').uncheck();
    await expect(page.locator('[data-builder-ai-code-hunk-summary="true"]')).toContainText(assistantCopy.hunksSummary(1, 2));
    await expect(page.locator('[data-builder-ai-code-apply="true"]')).toContainText(assistantCopy.applySelected);
    await page.locator('[data-builder-ai-code-apply="true"]').click();
    await expect(codeEditor).toHaveValue(partialCode);

    await page.locator('[data-builder-dev-function-save="true"]').click();
    await expect(page.locator('[data-builder-dev-function-status="true"]')).toContainText('함수를 저장했습니다.');

    const listResponse = await page.request.get('/api/builder/dev/functions');
    expect(listResponse.status()).toBe(200);
    const listJson = (await listResponse.json()) as {
      functions: Array<{ id: string; code: string }>;
    };
    expect(listJson.functions.find((entry) => entry.id === createdId)?.code).toBe(partialCode);
  } finally {
    await page.unroute('**/api/builder/ai-generator/code').catch(() => undefined);
    if (createdId) await deleteFunction(page.request, createdId, token);
  }
});
