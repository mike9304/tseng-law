import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { openBuilder, openSiteSettings } from './helpers/editor';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'design-system-m23';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function waitForRateLimit(response: Awaited<ReturnType<APIRequestContext['put']>>): Promise<boolean> {
  if (response.status() !== 429) return false;
  const retryAfter = Number(response.headers()['retry-after'] || '1');
  const waitMs = Math.max(1000, Math.min(65_000, Number.isFinite(retryAfter) ? retryAfter * 1000 : 1000));
  await new Promise((resolve) => setTimeout(resolve, waitMs));
  return true;
}

async function putSettingsTheme(
  request: APIRequestContext,
  theme: Record<string, unknown>,
  scope: string,
): Promise<Record<string, unknown>> {
  let response: Awaited<ReturnType<APIRequestContext['put']>> | null = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await request.put('/api/builder/site/settings?locale=ko', {
      headers: mutationHeaders(scope),
      data: { theme },
    });
    if (!(await waitForRateLimit(response))) break;
  }
  expect(response).toBeTruthy();
  response = response!;
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { ok?: boolean; theme?: Record<string, unknown>; error?: string };
  expect(payload.ok, payload.error).toBe(true);
  expect(payload.theme).toBeTruthy();
  return payload.theme!;
}

async function selectCanvasNode(page: Page, nodeId: string): Promise<void> {
  const row = page.locator(`[data-node-id="${nodeId}"]:visible`).first();
  await expect(row).toBeVisible({ timeout: 10_000 });
  await row.scrollIntoViewIfNeeded().catch(() => undefined);
  await row.click({ position: { x: 12, y: 12 }, force: true });
  await expect(page.locator(`[data-node-id="${nodeId}"][class*="nodeSelected"]`).first()).toBeVisible({
    timeout: 10_000,
  });
}

test.describe('M23 design system parity', () => {
  test('persists typography scale and exposes style source chips in the inspector', async ({ page }) => {
    const token = Date.now().toString(36);
    const settingsResponse = await page.request.get('/api/builder/site/settings?locale=ko');
    expect(settingsResponse.status()).toBe(200);
    const settingsPayload = (await settingsResponse.json()) as {
      theme?: Record<string, unknown>;
    };
    const originalTheme = settingsPayload.theme;
    expect(originalTheme).toBeTruthy();
    if (!originalTheme) throw new Error('Missing builder theme');

    try {
      const scaledTheme = await putSettingsTheme(
        page.request,
        {
          ...originalTheme,
          typographyScale: { baseSize: 17, ratio: 1.333 },
        },
        `m23-scale-${token}`,
      );
      expect(scaledTheme.typographyScale).toEqual({ baseSize: 17, ratio: 1.333 });
      expect((scaledTheme.themeTextPresets as Record<string, { fontSize: number }>).body.fontSize).toBe(17);
      expect((scaledTheme.themeTextPresets as Record<string, { fontSize: number }>).title1.fontSize).toBe(95);

      await openBuilder(page, `/ko/admin-builder?m23=${token}`);

      const settingsModal = await openSiteSettings(page);
      await settingsModal.getByRole('button', { name: 'Typography' }).click();
      await expect(settingsModal.getByRole('spinbutton', { name: 'Typography base size' })).toHaveValue('17');
      await expect(settingsModal.getByRole('combobox', { name: 'Typography scale ratio' })).toHaveValue('1.333');
      const typographyPreview = settingsModal.locator('[data-builder-typography-scale-preview="true"]');
      await expect(typographyPreview).toBeVisible();
      await expect(typographyPreview.locator('[data-builder-typography-scale-preview-row="h1"]')).toContainText('95px');
      await expect(typographyPreview.locator('[data-builder-typography-scale-preview-row="body"]')).toContainText('17px');
      await settingsModal.getByRole('button', { name: '취소' }).click();

      await selectCanvasNode(page, 'home-hero-title');
      const inspector = page.locator('[data-builder-inspector-panel="true"]').first();
      await inspector.getByRole('button', { name: 'style', exact: true }).click();
      const visualizer = inspector.locator('[data-builder-style-origin-visualizer="true"]').first();
      await expect(visualizer).toBeVisible();
      await expect(visualizer).toContainText('Style sources');
      await expect(visualizer.locator('[data-builder-style-source-row="background"]')).toBeVisible();
      await expect(visualizer.locator('[data-builder-style-source-hint="background"]')).toContainText('기본값');
      await expect(visualizer.locator('[data-builder-style-origin="default"]').first()).toBeVisible();

      await selectCanvasNode(page, 'home-hero-search-button');
      await inspector.getByRole('button', { name: 'style', exact: true }).click();
      const buttonVisualizer = inspector.locator('[data-builder-style-origin-visualizer="true"]').first();
      await expect(buttonVisualizer.locator('[data-builder-style-source-row="variant"]')).toBeVisible();
      await expect(buttonVisualizer.locator('[data-builder-style-source-hint="variant"]')).toContainText('variant:');
      await expect(buttonVisualizer.locator('[data-builder-style-origin="variant"]').first()).toBeVisible();
    } finally {
      if (originalTheme) {
        await page.request.put('/api/builder/site/settings?locale=ko', {
          headers: mutationHeaders(`m23-restore-${token}`),
          data: { theme: originalTheme },
          failOnStatusCode: false,
        });
      }
    }
  });
});
