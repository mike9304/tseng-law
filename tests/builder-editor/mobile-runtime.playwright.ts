import { expect, test, type APIRequestContext } from '@playwright/test';
import { openBuilder, openPreviewModalMobile, openSiteSettings } from './helpers/editor';

type TestDocument = {
  version: 1;
  locale: 'ko';
  updatedAt: string;
  updatedBy: string;
  stageWidth: number;
  stageHeight: number;
  nodes: Array<Record<string, unknown>>;
};

type SettingsPayload = {
  ok?: boolean;
  headerFooter?: {
    mobileSticky?: boolean;
    mobileHamburger?: 'auto' | 'off' | 'force';
  };
  mobileBottomBar?: {
    enabled?: boolean;
    actions?: Array<{
      id: string;
      label: string;
      href: string;
      kind: 'phone' | 'booking' | 'custom';
    }>;
  };
};

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

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'm10-mobile';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeM10Document(token: string): TestDocument {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `m10-mobile-${token}`,
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      {
        id: `m10-root-${token}`,
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 720 },
        style: { ...baseStyle, backgroundColor: '#ffffff' },
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'M10 mobile runtime root',
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
        id: `m10-title-${token}`,
        kind: 'text',
        parentId: `m10-root-${token}`,
        rect: { x: 80, y: 88, width: 720, height: 96 },
        style: { ...baseStyle, borderRadius: 8 },
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: `M10 mobile runtime ${token}`,
          fontSize: 42,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.2,
          letterSpacing: 0,
          fontFamily: 'system-ui',
          verticalAlign: 'top',
          textTransform: 'none',
          as: 'h1',
        },
      },
      {
        id: `m10-mobile-hidden-${token}`,
        kind: 'text',
        parentId: `m10-root-${token}`,
        rect: { x: 80, y: 220, width: 520, height: 58 },
        style: { ...baseStyle, borderRadius: 8 },
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        responsive: {
          mobile: {
            hidden: true,
          },
        },
        content: {
          text: `mobile hidden ${token}`,
          fontSize: 24,
          color: '#b91c1c',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.2,
          letterSpacing: 0,
          fontFamily: 'system-ui',
          verticalAlign: 'top',
          textTransform: 'none',
        },
      },
    ],
  };
}

function makeEmptyGlobalHeaderDocument(): TestDocument {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: 'm10-mobile-empty-header',
    stageWidth: 1280,
    stageHeight: 0,
    nodes: [],
  };
}

async function createBuilderPage(
  request: APIRequestContext,
  slug: string,
  title: string,
  document: TestDocument,
): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    data: { locale: 'ko', slug, title, document },
    headers: mutationHeaders(slug),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  return payload.pageId!;
}

test.describe('M10 mobile runtime controls', () => {
  test('renders preview iframe, mobile sticky CTA settings, and touch long press context menu', async ({ page }) => {
    test.setTimeout(90_000);

    const token = Date.now().toString(36);
    const slug = `g-editor-m10-mobile-${token}`;
    let pageId: string | null = null;
    let originalHeaderDocument: unknown | null = null;
    const originalResponse = await page.request.get('/api/builder/site/settings?locale=ko');
    expect(originalResponse.status()).toBe(200);
    const original = (await originalResponse.json()) as SettingsPayload;
    const originalHeaderResponse = await page.request.get('/api/builder/site/header/draft?locale=ko', {
      failOnStatusCode: false,
    });
    if (originalHeaderResponse.status() === 200) {
      const payload = (await originalHeaderResponse.json()) as { document?: unknown };
      originalHeaderDocument = payload.document ?? null;
    }

    try {
      await page.request.put('/api/builder/site/header/draft?locale=ko', {
        data: {
          document: makeEmptyGlobalHeaderDocument(),
        },
      }).then((response) => expect(response.status()).toBe(200));
      const saveResponse = await page.request.put('/api/builder/site/settings?locale=ko', {
        data: {
          headerFooter: {
            mobileSticky: true,
            mobileHamburger: 'force',
          },
          mobileBottomBar: {
            enabled: true,
            actions: [
              { id: 'call', label: '전화', href: 'tel:+886227515255', kind: 'phone' },
              { id: 'consultation', label: '상담 예약', href: '#contact', kind: 'booking' },
            ],
          },
        },
      });
      expect(saveResponse.status()).toBe(200);
      pageId = await createBuilderPage(page.request, slug, `M10 Mobile ${token}`, makeM10Document(token));
      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish`, {
        data: {},
        headers: mutationHeaders(slug),
      });
      expect(publishResponse.status()).toBe(200);

      await page.setViewportSize({ width: 390, height: 780 });
      await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });
      const header = page.locator('header.builder-site-header, header[data-builder-global-section="header"]').first();
      await expect(header).toHaveAttribute('data-builder-mobile-sticky', 'true');
      await expect(page.locator('[data-builder-mobile-bottom-bar="true"]')).toBeVisible();
      await expect(page.locator(`[data-node-id="m10-mobile-hidden-${token}"]`)).toBeHidden();

      await page.setViewportSize({ width: 1440, height: 1000 });
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}`);
      const settingsModal = await openSiteSettings(page);
      await settingsModal.getByRole('button', { name: /Mobile/ }).click();
      await expect(settingsModal.getByText('Sticky mobile header')).toBeVisible();
      await expect(settingsModal.getByText('Show fixed bottom action bar')).toBeVisible();
      await settingsModal.getByRole('button', { name: 'Close' }).click();

      const shortcutModifier = process.platform === 'darwin' ? 'Meta' : 'Control';
      const editableNode = page.locator(`[data-node-id="m10-title-${token}"]`).first();
      await expect(editableNode).toBeVisible();
      await editableNode.click({ position: { x: 24, y: 24 }, force: true });
      await page.keyboard.press(`${shortcutModifier}+D`);
      await expect(page.getByText('Duplicated')).toBeVisible();
      await page.locator('[data-builder-topbar-viewport="mobile"]').click();
      await expect(page.locator('[data-builder-topbar-viewport="mobile"]')).toHaveAttribute('aria-pressed', 'true');
      await page.keyboard.press(`${shortcutModifier}+Z`);
      await expect(page.getByText(/Undid:/).first()).toBeVisible();
      await page.locator('[data-builder-topbar-viewport="desktop"]').click();
      await expect(page.locator('[data-builder-topbar-viewport="desktop"]')).toHaveAttribute('aria-pressed', 'true');

      const previewModal = await openPreviewModalMobile(page);
      await expect(previewModal.getByText(/390 × 780px/)).toBeVisible();
      await expect(previewModal.locator('iframe[title="Preview Mobile"]')).toHaveAttribute('src', new RegExp(`/ko/${slug}(?:$|\\?)`));
      await previewModal.getByRole('button', { name: '미리보기 닫기' }).click();

      const node = editableNode;
      await expect(node).toBeVisible();
      await node.scrollIntoViewIfNeeded();
      await node.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        element.dispatchEvent(new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          pointerId: 71,
          pointerType: 'touch',
          button: 0,
          buttons: 1,
          clientX: rect.left + 18,
          clientY: rect.top + 18,
        }));
      });
      await expect(page.getByRole('menu').last()).toBeVisible({ timeout: 2_000 });
      await node.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        element.dispatchEvent(new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 71,
          pointerType: 'touch',
          button: 0,
          buttons: 0,
          clientX: rect.left + 18,
          clientY: rect.top + 18,
        }));
      });
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(`${slug}-cleanup`),
          failOnStatusCode: false,
        });
      }
      await page.request.put('/api/builder/site/header/draft?locale=ko', {
        data: {
          document: originalHeaderDocument ?? makeEmptyGlobalHeaderDocument(),
        },
        failOnStatusCode: false,
      });
      await page.request.put('/api/builder/site/settings?locale=ko', {
        data: {
          headerFooter: {
            mobileSticky: original.headerFooter?.mobileSticky === true,
            mobileHamburger: original.headerFooter?.mobileHamburger ?? 'auto',
          },
          mobileBottomBar: original.mobileBottomBar ?? {
            enabled: false,
            actions: [
              { id: 'call', label: '전화', href: 'tel:+886227515255', kind: 'phone' },
              { id: 'consultation', label: '상담 예약', href: '#contact', kind: 'booking' },
            ],
          },
        },
        failOnStatusCode: false,
      });
    }
  });
});
