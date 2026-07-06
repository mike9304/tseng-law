import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { openBuilder } from './helpers/editor';

const TARGET_TEXT_NODE_ID = 'home-hero-title';
const TARGET_BUTTON_NODE_ID = 'home-hero-cta';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'inspector-click-audit';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function defaultNodeStyle() {
  return {
    backgroundColor: 'transparent',
    borderColor: '#cbd5e1',
    borderStyle: 'solid',
    borderWidth: 0,
    borderRadius: 14,
    shadowX: 0,
    shadowY: 0,
    shadowBlur: 0,
    shadowSpread: 0,
    shadowColor: 'rgba(15, 23, 42, 0.16)',
    opacity: 100,
  };
}

function createInspectorAuditDocument(locale = 'ko') {
  return {
    version: 1,
    locale,
    updatedAt: new Date().toISOString(),
    updatedBy: 'playwright-inspector-click-audit',
    stageWidth: 1280,
    stageHeight: 760,
    nodes: [
      {
        id: TARGET_TEXT_NODE_ID,
        kind: 'text',
        rect: { x: 96, y: 96, width: 520, height: 112 },
        style: defaultNodeStyle(),
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: 'Inspector audit title',
          fontSize: 42,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.15,
          letterSpacing: 0,
          fontFamily: 'system-ui',
        },
      },
      {
        id: TARGET_BUTTON_NODE_ID,
        kind: 'button',
        rect: { x: 96, y: 260, width: 220, height: 56 },
        style: {
          ...defaultNodeStyle(),
          borderRadius: 999,
        },
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Book consult',
          href: '/ko/contact',
          link: { type: 'page', href: '/ko/contact' },
          style: 'primary-solid',
        },
      },
    ],
  };
}

async function createInspectorAuditPage(request: APIRequestContext, token: string): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    data: {
      locale: 'ko',
      slug: `g-inspector-click-audit-${token}`,
      title: `Inspector Click Audit ${token}`,
      document: createInspectorAuditDocument('ko'),
    },
    headers: mutationHeaders(token),
  });
  expect(response.status()).toBe(200);
  const payload = await response.json() as { success?: boolean; pageId?: string; error?: string };
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  return payload.pageId!;
}

function collectCriticalBrowserErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => {
    errors.push(`pageerror: ${error.message}`);
  });
  return errors;
}

async function selectNode(page: Page, nodeId: string) {
  const node = page.locator(`[data-node-id="${nodeId}"]`).first();
  await expect(node).toBeVisible();
  await node.scrollIntoViewIfNeeded();
  await node.click({ position: { x: 18, y: 18 }, force: true });
  await expect(page.getByRole('toolbar', { name: '요소 빠른 작업' })).toBeVisible();
  await expect(page.locator('[data-builder-inspector-panel="true"]')).toBeVisible();
  return node;
}

async function assertFastDirectMovePreview(page: Page) {
  const node = await selectNode(page, TARGET_TEXT_NODE_ID);
  const box = await node.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error(`Missing bounds for ${TARGET_TEXT_NODE_ID}`);

  const start = {
    x: box.x + Math.min(48, box.width / 2),
    y: box.y + Math.min(36, box.height / 2),
  };
  const startedAt = Date.now();
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x + 42, start.y + 24, { steps: 6 });
  await expect(page.locator(`[data-node-id="${TARGET_TEXT_NODE_ID}"][data-builder-direct-move-preview="true"]`)).toBeVisible();
  const dragMs = Date.now() - startedAt;
  expect(dragMs).toBeLessThan(2500);
  await page.mouse.up();
  await expect(page.locator('[data-builder-direct-move-preview="true"]')).toHaveCount(0);
}

async function addElementComment(page: Page, nodeId: string, body: string) {
  const commentsPanel = page.locator(`[data-builder-element-comments="${nodeId}"]`);
  await expect(commentsPanel).toBeVisible();
  await commentsPanel.locator('[data-builder-comment-input="true"]').fill(body);
  await expect(commentsPanel.locator('[data-builder-comment-submit="true"]')).toBeEnabled();
  await commentsPanel.locator('[data-builder-comment-submit="true"]').click();
  await expect(commentsPanel.getByText(body)).toBeVisible();
}

test('/ko/admin-builder inspector and selection toolbar click audit stays responsive', async ({ page }) => {
  test.setTimeout(120_000);
  const browserErrors = collectCriticalBrowserErrors(page);
  const token = Date.now().toString(36);
  let pageId: string | null = null;

  try {
    pageId = await createInspectorAuditPage(page.request, token);
    await page.setViewportSize({ width: 1440, height: 950 });
    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&inspectorAudit=${token}`);

    await assertFastDirectMovePreview(page);

    const textNode = await selectNode(page, TARGET_TEXT_NODE_ID);
    const inspector = page.locator('[data-builder-inspector-panel="true"]').first();
    await inspector.getByRole('button', { name: /^(?:레이아웃|Layout)$/ }).click();
    const widthInput = inspector.getByLabel('너비 값').first();
    await expect(widthInput).toBeVisible();
    await widthInput.fill('548');
    await widthInput.press('Enter');
    await expect(widthInput).toHaveValue('548');

    await inspector.getByRole('button', { name: /^(?:스타일|Style)$/ }).click();
    await expect(inspector.locator('[data-builder-style-origin-visualizer="true"]')).toBeVisible();
    const colorTrigger = inspector.locator('[data-color-picker-advanced]').first().locator('button').first();
    await colorTrigger.click();
    await expect(page.locator('[data-builder-color-picker-dialog="true"]')).toBeVisible();
    await colorTrigger.click();
    await expect(page.locator('[data-builder-color-picker-dialog="true"]')).toBeHidden();

    await selectNode(page, TARGET_TEXT_NODE_ID);
    await inspector.getByRole('button', { name: /^(?:콘텐츠|Content)$/ }).click();
    await expect(inspector.locator('[data-inspector-content-adapter="true"]')).toBeVisible();
    const textArea = inspector.locator('[data-inspector-content-adapter="true"] textarea').first();
    await expect(textArea).toBeVisible();
    await textArea.fill('Inspector audit title updated');
    await expect(textNode).toContainText('Inspector audit title updated');

    await inspector.getByRole('button', { name: /^(?:애니메이션|Animations)$/ }).click();
    const entranceSelect = inspector.getByLabel(/등장|Entrance animation/i).first();
    await expect(entranceSelect).toBeVisible();
    await entranceSelect.selectOption('fade-in');
    await expect(entranceSelect).toHaveValue('fade-in');

    await inspector.getByRole('button', { name: /^(?:접근성|A11y)$/ }).click();
    await expect(inspector.locator('[class*="passCard"], [class*="issueCard"]').first()).toBeVisible();

    await addElementComment(page, TARGET_TEXT_NODE_ID, `Inspector QA ${token}`);

    await selectNode(page, TARGET_TEXT_NODE_ID);
    const textNodeCountBeforeDuplicate = await page.locator('[data-node-id^="text-"]').count();
    await page.getByRole('toolbar', { name: '요소 빠른 작업' }).getByRole('button', { name: '복제' }).click();
    await expect.poll(() => page.locator('[data-node-id^="text-"]').count()).toBe(textNodeCountBeforeDuplicate + 1);

    await selectNode(page, TARGET_BUTTON_NODE_ID);
    await page.getByRole('toolbar', { name: '요소 빠른 작업' }).getByRole('button', { name: /링크 추가|\/ko\/contact/ }).click();
    const linkPopover = page.getByRole('dialog', { name: /링크|Link/i });
    await expect(linkPopover).toBeVisible();
    const hrefInput = linkPopover.locator('[data-builder-href-input="true"]').first();
    await expect(hrefInput).toHaveValue('/ko/contact');
    await hrefInput.fill('/ko/services');
    await hrefInput.press('Enter');
    await expect(hrefInput).toHaveValue('/ko/services');

    await expect(page.locator('[data-editor-shell]')).toHaveAttribute('data-editor-ready', 'true');
    expect(browserErrors).toEqual([]);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(token),
        failOnStatusCode: false,
      });
    }
  }
});
