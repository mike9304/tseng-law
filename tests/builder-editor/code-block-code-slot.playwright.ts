import { expect, test, type APIRequestContext } from '@playwright/test';
import { openBuilder } from './helpers/editor';

const baseStyle = {
  backgroundColor: 'transparent',
  borderColor: '#cbd5e1',
  borderStyle: 'solid',
  borderWidth: 0,
  borderRadius: 0,
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowSpread: 0,
  shadowColor: 'rgba(15, 23, 42, 0.16)',
  opacity: 100,
};

type CreatePageResponse = {
  readonly success?: boolean;
  readonly pageId?: string;
  readonly error?: string;
};

type CodeSlotRunResponse = {
  readonly ok?: boolean;
  readonly status?: number;
  readonly errorCode?: string;
  readonly result?: unknown;
  readonly logs?: readonly { readonly message?: string }[];
  readonly error?: string;
};

type DevLogsResponse = {
  readonly ok?: boolean;
  readonly entries?: readonly { readonly message?: string; readonly reference?: string }[];
};

type FunctionCreateResponse = {
  readonly ok?: boolean;
  readonly function?: {
    readonly id?: string;
    readonly slug?: string;
  };
};

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'code-slot';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function createFunction(
  request: APIRequestContext,
  token: string,
  payload: { readonly name: string; readonly slug: string; readonly code: string },
): Promise<{ readonly id: string; readonly slug: string }> {
  const response = await request.post('/api/builder/dev/functions', {
    data: payload,
    headers: mutationHeaders(`fn-create-${token}`),
  });
  expect(response.status()).toBe(201);
  const body: FunctionCreateResponse = await response.json();
  if (!body.function?.id || !body.function.slug) {
    throw new Error('Missing function create payload');
  }
  return { id: body.function.id, slug: body.function.slug };
}

async function deleteFunction(request: APIRequestContext, id: string, token: string): Promise<void> {
  await request.delete(`/api/builder/dev/functions/${id}`, {
    headers: mutationHeaders(`fn-delete-${token}`),
    failOnStatusCode: false,
  });
}

async function createCodeBlockPage(request: APIRequestContext, token: string, message: string): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    data: {
      locale: 'ko',
      slug: `code-slot-${token}`,
      title: `Code slot ${token}`,
      document: {
        version: 1,
        locale: 'ko',
        updatedAt: new Date().toISOString(),
        updatedBy: `code-slot-${token}`,
        stageWidth: 1280,
        stageHeight: 720,
        nodes: [
          {
            id: `code-slot-root-${token}`,
            kind: 'container',
            rect: { x: 0, y: 0, width: 1280, height: 720 },
            style: baseStyle,
            zIndex: 0,
            rotation: 0,
            locked: false,
            visible: true,
            content: {
              label: 'Code slot test root',
              background: '#ffffff',
              borderColor: 'transparent',
              borderStyle: 'solid',
              borderWidth: 0,
              borderRadius: 0,
              padding: 0,
              layoutMode: 'absolute',
              as: 'main',
            },
          },
          {
            id: `code-slot-node-${token}`,
            kind: 'codeBlock',
            parentId: `code-slot-root-${token}`,
            rect: { x: 80, y: 96, width: 560, height: 300 },
            style: baseStyle,
            zIndex: 1,
            rotation: 0,
            locked: false,
            visible: true,
            content: {
              title: `Canvas Slot ${token}`,
              language: 'js',
              code: `ctx.log("${message}"); return { ok: true, token: "${token}" };`,
              runMode: 'inline',
              functionSlug: '',
              showLineNumbers: true,
            },
          },
        ],
      },
    },
    headers: mutationHeaders(token),
  });
  expect(response.status()).toBe(200);
  const payload: CreatePageResponse = await response.json();
  expect(payload.success, payload.error).toBe(true);
  if (!payload.pageId) throw new Error('Missing pageId for code slot page');
  return payload.pageId;
}

test('canvas code block slot runs through the sandbox API and inspector surface', async ({ page }) => {
  const token = Date.now().toString(36);
  const apiMessage = `api-code-slot-${token}`;
  const uiMessage = `ui-code-slot-${token}`;
  const functionMessage = `function-code-slot-${token}`;
  const functionSlug = `pw-code-slot-${token}`;
  let pageId: string | null = null;
  let functionId: string | null = null;

  try {
    const storedFunction = await createFunction(page.request, token, {
      name: `Canvas code slot ${token}`,
      slug: functionSlug,
      code: `ctx.log("${functionMessage}"); return { bound: true, slug: "${functionSlug}" };`,
    });
    functionId = storedFunction.id;

    const apiResponse = await page.request.post('/api/builder/dev/code-slots/run', {
      headers: mutationHeaders(`api-${token}`),
      data: {
        mode: 'inline',
        title: `API Slot ${token}`,
        language: 'js',
        code: `ctx.log("${apiMessage}"); return "done";`,
      },
    });
    expect(apiResponse.status()).toBe(200);
    const apiBody: CodeSlotRunResponse = await apiResponse.json();
    expect(apiBody.ok).toBe(true);
    expect(apiBody.result).toBe('done');
    expect(apiBody.logs?.[0]?.message).toBe(apiMessage);

    const escapeResponse = await page.request.post('/api/builder/dev/code-slots/run', {
      headers: mutationHeaders(`api-escape-${token}`),
      data: {
        mode: 'inline',
        title: `Escape Slot ${token}`,
        language: 'js',
        code: [
          'const fromCtx = ctx.log.constructor.constructor(\'return typeof process === "undefined" ? "blocked" : process.versions.node\')();',
          'const fromConsole = console.warn.constructor.constructor(\'return typeof process === "undefined" ? "blocked" : process.versions.node\')();',
          'return `${fromCtx}:${fromConsole}`;',
        ].join('\n'),
      },
    });
    expect(escapeResponse.status()).toBe(200);
    const escapeBody: CodeSlotRunResponse = await escapeResponse.json();
    expect(escapeBody.ok).toBe(true);
    expect(escapeBody.result).toBe('blocked:blocked');

    const apiLogsResponse = await page.request.get(
      `/api/builder/dev/logs?source=function&limit=4&reference=${encodeURIComponent(`canvas-code-block:API Slot ${token}`)}`,
    );
    expect(apiLogsResponse.status()).toBe(200);
    const apiLogsBody: DevLogsResponse = await apiLogsResponse.json();
    expect(apiLogsBody.ok).toBe(true);
    expect(apiLogsBody.entries?.some((entry) => entry.message === apiMessage)).toBe(true);

    const functionApiResponse = await page.request.post('/api/builder/dev/code-slots/run', {
      headers: mutationHeaders(`api-function-${token}`),
      data: {
        mode: 'function',
        title: `Function Slot ${token}`,
        functionSlug,
      },
    });
    expect(functionApiResponse.status()).toBe(200);
    const functionApiBody: CodeSlotRunResponse = await functionApiResponse.json();
    expect(functionApiBody.ok).toBe(true);
    expect(functionApiBody.result).toMatchObject({ bound: true, slug: functionSlug });
    expect(functionApiBody.logs?.[0]?.message).toBe(functionMessage);

    pageId = await createCodeBlockPage(page.request, token, uiMessage);
    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&codeSlot=${token}`);
    await page.keyboard.press('Escape');

    const codeBlock = page.locator(`[data-node-id="code-slot-node-${token}"]`).first();
    await expect(codeBlock).toBeVisible();
    await codeBlock.click({ position: { x: 24, y: 24 }, force: true });
    const inspector = page.locator('[data-builder-inspector-panel="true"]');
    await inspector.getByRole('button', { name: /^(?:콘텐츠|Content|內容)$/ }).click();

    const codeInspector = page.locator('[data-builder-code-block-inspector="true"]');
    await expect(codeInspector).toBeVisible();
    await codeInspector.locator('[data-builder-code-slot-run="true"]').click();
    await expect(codeInspector.locator('[data-builder-code-slot-result="true"]')).toContainText('ok');
    await expect(codeInspector.locator('[data-builder-code-slot-logs="true"]')).toContainText(uiMessage);
    await expect(codeInspector.locator('[data-builder-code-slot-history="true"]')).toContainText(uiMessage);

    await codeInspector.locator('[data-builder-code-slot-mode="true"]').selectOption('function');
    const functionSelect = codeInspector.locator('[data-builder-code-slot-function="true"]');
    await expect(functionSelect).toBeVisible();
    await expect.poll(async () => functionSelect.locator(`option[value="${functionSlug}"]`).count())
      .toBeGreaterThan(0);
    await functionSelect.selectOption(functionSlug);
    await codeInspector.locator('[data-builder-code-slot-run="true"]').click();
    await expect(codeInspector.locator('[data-builder-code-slot-result="true"]')).toContainText('bound');
    await expect(codeInspector.locator('[data-builder-code-slot-logs="true"]')).toContainText(functionMessage);
    await expect(codeInspector.locator('[data-builder-code-slot-history="true"]')).toContainText(functionMessage);
  } finally {
    if (functionId) {
      await deleteFunction(page.request, functionId, token);
    }
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(`delete-${token}`),
        failOnStatusCode: false,
      });
    }
  }
});
