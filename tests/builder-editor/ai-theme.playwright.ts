import { expect, test } from '@playwright/test';
import type { BuilderTheme } from '@/lib/builder/site/types';

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

async function readSettingsSnapshot(page: import('@playwright/test').Page): Promise<SiteSettingsSnapshot> {
  const response = await page.request.get('/api/builder/site/settings?locale=ko');
  expect(response.status()).toBe(200);
  return response.json();
}

async function restoreSettingsSnapshot(
  page: import('@playwright/test').Page,
  snapshot: SiteSettingsSnapshot,
  scope: string,
): Promise<void> {
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

test('POST /api/builder/ai-generator/theme suggest returns a palette', async ({ page }) => {
  test.setTimeout(60_000);
  const token = `theme-sug-${Date.now().toString(36)}`;
  await page.setExtraHTTPHeaders(mutationHeaders(token));

  const res = await page.request.post('/api/builder/ai-generator/theme', {
    data: { action: 'suggest', prompt: 'modern minimal law firm with calm blue accents' },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
  });
  expect(res.status()).toBe(200);
  const body = (await res.json()) as {
    ok: boolean;
    suggestion: {
      colors: { primary: string; secondary: string; accent: string; background: string; text: string; muted: string };
      radii: { sm: number; md: number; lg: number };
      effects: { radiusPreset: string; shadowPreset: string };
      typographyScale: { baseSize: number; ratio: number };
    };
  };
  expect(body.ok).toBe(true);
  expect(typeof body.suggestion.colors.primary).toBe('string');
  expect(typeof body.suggestion.colors.accent).toBe('string');
  expect(body.suggestion.radii.md).toBeGreaterThan(0);
  expect(body.suggestion.effects.radiusPreset).toBeTruthy();
  expect(body.suggestion.typographyScale.ratio).toBeGreaterThan(1);
});

test('POST /api/builder/ai-generator/theme analyze returns issues array', async ({ page }) => {
  const token = `theme-ana-${Date.now().toString(36)}`;
  await page.setExtraHTTPHeaders(mutationHeaders(token));
  const res = await page.request.post('/api/builder/ai-generator/theme', {
    data: {
      action: 'analyze',
      theme: {
        colors: {
          primary: '#ffffff',
          secondary: '#eeeeee',
          accent: '#dddddd',
          background: '#ffffff',
          text: '#f0f0f0',
          muted: '#fafafa',
        },
      },
    },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
  });
  expect(res.status()).toBe(200);
  const body = (await res.json()) as { ok: boolean; issues: Array<{ severity?: string }> };
  expect(body.ok).toBe(true);
  expect(Array.isArray(body.issues)).toBe(true);
  // Low-contrast palette should produce at least one issue.
  expect(body.issues.length).toBeGreaterThan(0);
});

test('POST /api/builder/ai-generator/theme apply persists suggestion to site settings', async ({ page }) => {
  test.setTimeout(60_000);
  const token = `theme-apply-${Date.now().toString(36)}`;
  await page.setExtraHTTPHeaders(mutationHeaders(token));
  const before = await readSettingsSnapshot(page);

  try {
    const suggest = await page.request.post('/api/builder/ai-generator/theme', {
      data: { action: 'suggest', prompt: 'luxury international law firm with premium gold accents' },
      headers: { 'Content-Type': 'application/json', ...mutationHeaders(`${token}-suggest`) },
    });
    expect(suggest.status()).toBe(200);
    const suggested = (await suggest.json()) as {
      ok: boolean;
      suggestion: {
        vibe: string;
        colors: BuilderTheme['colors'];
        fonts: BuilderTheme['fonts'];
        radii: BuilderTheme['radii'];
        effects: NonNullable<BuilderTheme['effects']>;
        typographyScale: NonNullable<BuilderTheme['typographyScale']>;
      };
    };
    expect(suggested.ok).toBe(true);

    const apply = await page.request.post('/api/builder/ai-generator/theme?locale=ko', {
      data: { action: 'apply', suggestion: suggested.suggestion },
      headers: { 'Content-Type': 'application/json', ...mutationHeaders(`${token}-apply`) },
    });
    expect(apply.status()).toBe(200);
    const applied = (await apply.json()) as { ok: boolean; theme: BuilderTheme };
    expect(applied.ok).toBe(true);
    expect(applied.theme.colors.primary).toBe('#a16207');
    expect(applied.theme.radii).toEqual({ sm: 2, md: 6, lg: 12 });
    expect(applied.theme.effects).toEqual({ radiusPreset: 'medium', shadowPreset: 'strong' });

    const after = await readSettingsSnapshot(page);
    expect(after.theme.colors.primary).toBe('#a16207');
    expect(after.theme.fonts.heading).toContain('Playfair');
    expect(after.theme.typographyScale).toEqual({ baseSize: 17, ratio: 1.333 });
  } finally {
    await restoreSettingsSnapshot(page, before, `${token}-restore`);
  }
});
