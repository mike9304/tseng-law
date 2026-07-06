import { expect, type Page, test } from '@playwright/test';
import type { BuilderTheme } from '@/lib/builder/site/types';
import { openBuilder, openSiteSettings } from './helpers/editor';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'scope';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

type JsonValue = string | number | boolean | null | readonly JsonValue[] | { readonly [key: string]: JsonValue };

interface SiteSettingsSnapshot {
  ok: boolean;
  settings: JsonValue;
  theme: BuilderTheme;
  darkMode: JsonValue;
  headerFooter: JsonValue;
  mobileBottomBar: JsonValue;
}

async function readSettingsSnapshot(page: Page): Promise<SiteSettingsSnapshot> {
  const response = await page.request.get('/api/builder/site/settings?locale=ko');
  expect(response.status()).toBe(200);
  return response.json();
}

async function restoreSettingsSnapshot(page: Page, snapshot: SiteSettingsSnapshot, scope: string): Promise<void> {
  const response = await page.request.put('/api/builder/site/settings?locale=ko', {
    data: {
      settings: snapshot.settings,
      theme: snapshot.theme,
      darkMode: snapshot.darkMode,
      headerFooter: snapshot.headerFooter,
      mobileBottomBar: snapshot.mobileBottomBar,
    },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(scope) },
  });
  expect(response.status()).toBe(200);
}

test('site settings AI theme suggestion applies and persists from the builder UI', async ({ page }) => {
  test.setTimeout(120_000);
  const token = `theme-ui-${Date.now().toString(36)}`;
  await page.setExtraHTTPHeaders(mutationHeaders(token));
  const before = await readSettingsSnapshot(page);

  try {
    await openBuilder(page);
    const modal = await openSiteSettings(page);
    await modal.getByRole('button', { name: '프리셋' }).click();

    const panel = modal.getByTestId('theme-suggestions-panel');
    await expect(panel).toBeVisible();
    await panel.getByLabel('브랜드 설명').fill('luxury international law firm with premium gold accents');
    await panel.getByRole('button', { name: '테마 제안' }).click();
    await expect(panel.locator('[data-theme-suggestion-vibe="luxury"]')).toBeVisible();
    await expect(panel.locator('[data-theme-suggestion-color="primary"]')).toHaveCSS('background-color', 'rgb(161, 98, 7)');

    await panel.getByRole('button', { name: '현재 테마에 적용' }).click();
    await modal.getByRole('button', { name: '저장', exact: true }).click();
    await expect(modal).toBeHidden({ timeout: 30_000 });

    const after = await readSettingsSnapshot(page);
    expect(after.theme.colors.primary).toBe('#a16207');
    expect(after.theme.radii).toEqual({ sm: 2, md: 6, lg: 12 });
    expect(after.theme.effects).toEqual({ radiusPreset: 'medium', shadowPreset: 'strong' });
    expect(after.theme.typographyScale).toEqual({ baseSize: 17, ratio: 1.333 });
  } finally {
    await restoreSettingsSnapshot(page, before, `${token}-restore`);
  }
});
