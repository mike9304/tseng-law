import { expect, type Locator, type Page } from '@playwright/test';

export const SHORTCUT_MODIFIER = 'ControlOrMeta';

export function canvasEditor(page: Page): Locator {
  return page.getByRole('application', { name: 'Canvas editor' });
}

export async function firstVisibleNode(page: Page): Promise<Locator> {
  const canvas = canvasEditor(page);
  await expect(canvas).toBeVisible({ timeout: 20_000 });
  const candidates = [
    canvas.locator('[data-node-id="home-hero-subtitle"]:visible').first(),
    canvas.locator('[data-node-id*="subtitle"]:visible').first(),
    canvas.locator('[data-node-id*="title"]:visible').first(),
    canvas.locator('[data-node-id*="copy"]:visible').first(),
    canvas.locator('[data-node-id]:visible').first(),
  ];
  for (const candidate of candidates) {
    if ((await candidate.count()) > 0) {
      await expect(candidate).toBeVisible();
      return candidate;
    }
  }
  const fallback = canvas.locator('[data-node-id]:visible').first();
  await expect(fallback).toBeVisible();
  return fallback;
}

export async function clickCenter(node: Locator): Promise<void> {
  const box = await node.boundingBox();
  await node.click({
    position: box
      ? {
          x: Math.max(1, Math.min(box.width - 1, box.width / 2)),
          y: Math.max(1, Math.min(box.height - 1, box.height / 2)),
        }
      : { x: 12, y: 12 },
    force: true,
  });
}

export async function ensureSelected(page: Page, attempts = 3): Promise<Locator> {
  const canvas = canvasEditor(page);
  for (let i = 0; i < attempts; i += 1) {
    const node = await firstVisibleNode(page);
    await clickCenter(node);
    const selected = canvas
      .locator('[class*="nodeSelected"][data-node-id]:visible')
      .filter({ has: page.locator('[class*="rotationHandle"]') })
      .last();
    const ok = await selected
      .waitFor({ state: 'visible', timeout: 4_000 })
      .then(() => true)
      .catch(() => false);
    if (ok) return selected;
    await page.waitForTimeout(400);
  }
  throw new Error(`ensureSelected: ${attempts}회 시도 후에도 nodeSelected 상태에 도달하지 못함`);
}

export async function selectFirstNode(page: Page): Promise<Locator> {
  return ensureSelected(page);
}

export async function gotoBuilder(page: Page, baseUrl: string): Promise<void> {
  const target = new URL('/ko/admin-builder', baseUrl).toString();
  await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  const canvas = canvasEditor(page);
  await expect(canvas).toBeVisible({ timeout: 30_000 });
  await expect(canvas).toHaveAttribute('data-builder-hydrated', 'true', { timeout: 30_000 });
  await page
    .locator('[data-node-id]:visible')
    .first()
    .waitFor({ state: 'visible', timeout: 30_000 });
}

export async function pickLeafNode(
  page: Page,
  excludeIds: string[] = [],
  options: { minWidth?: number; minHeight?: number } = {},
): Promise<{ id: string; locator: Locator } | null> {
  const { minWidth = 0, minHeight = 0 } = options;
  const all = canvasEditor(page).locator('[data-node-id]:visible');
  const total = await all.count().catch(() => 0);
  const leaves: string[] = [];
  for (let i = 0; i < total; i += 1) {
    const node = all.nth(i);
    const id = (await node.getAttribute('data-node-id')) ?? '';
    if (!id) continue;
    const childCount = await node.locator('[data-node-id]').count();
    if (childCount !== 0) continue;
    if (minWidth > 0 || minHeight > 0) {
      const box = await node.boundingBox().catch(() => null);
      if (!box || box.width < minWidth || box.height < minHeight) continue;
    }
    leaves.push(id);
  }
  if (leaves.length === 0) return null;
  const pool = leaves.filter((id) => !excludeIds.includes(id));
  const chosenPool = pool.length > 0 ? pool : leaves;
  const preferred =
    chosenPool.find((id) =>
      /title|subtitle|copy|label|text|heading|cta|button|btn/i.test(id),
    ) ?? chosenPool[0];
  const locator = canvasEditor(page)
    .locator(`[data-node-id="${preferred}"]:visible`)
    .first();
  return { id: preferred, locator };
}

export async function dismissOverlays(page: Page): Promise<void> {
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
}
