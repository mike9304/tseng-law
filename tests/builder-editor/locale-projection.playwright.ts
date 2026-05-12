import { expect, test } from '@playwright/test';
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

function makeLocaleGuardDocument(token: string, text: string) {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'zh-hant' as const,
    updatedAt: now,
    updatedBy: `m45-locale-guard-${token}`,
    stageWidth: 1280,
    stageHeight: 420,
    nodes: [
      {
        id: `locale-guard-root-${token}`,
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 420 },
        style: baseStyle,
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: `locale guard root ${token}`,
          layoutMode: 'absolute',
          as: 'main',
        },
      },
      {
        id: `locale-guard-title-${token}`,
        kind: 'text',
        parentId: `locale-guard-root-${token}`,
        rect: { x: 80, y: 80, width: 760, height: 90 },
        style: { ...baseStyle, borderRadius: 12 },
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text,
          fontSize: 44,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.15,
          letterSpacing: 0,
          fontFamily: 'system-ui',
          verticalAlign: 'top',
          as: 'h1',
        },
      },
    ],
  };
}

test.describe('/admin-builder locale projection', () => {
  test('does not let a Traditional Chinese editor view contaminate the Korean home draft', async ({ page }) => {
    test.setTimeout(90_000);

    await openBuilder(page, `/zh-hant/admin-builder?localeProjection=${Date.now().toString(36)}`);
    const zhHeroTitle = page
      .getByRole('application', { name: 'Canvas editor' })
      .locator('[data-node-id="home-hero-title"]:visible')
      .first();
    await expect(zhHeroTitle).toContainText('以韓語清楚說明台灣法律。');

    await openBuilder(page, `/ko/admin-builder?localeProjection=${Date.now().toString(36)}`);
    const koHeroTitle = page
      .getByRole('application', { name: 'Canvas editor' })
      .locator('[data-node-id="home-hero-title"]:visible')
      .first();
    await expect(koHeroTitle).toContainText('대만 법률을 한국어로 명확하게.');
    await expect(koHeroTitle).not.toContainText('以韓語清楚說明台灣法律。');

    const publicKoResponse = await page.goto(`/ko?localeProjectionPublic=${Date.now().toString(36)}`, {
      waitUntil: 'domcontentloaded',
    });
    expect(publicKoResponse?.status()).toBeLessThan(400);
    await expect(page.locator('body')).toContainText('대만 법률을 한국어로 명확하게.');
    await expect(page.locator('body')).not.toContainText('以韓語清楚說明台灣法律。');
  });

  test('does not open a Traditional Chinese page id inside the Korean editor route', async ({ page }) => {
    test.setTimeout(90_000);

    const token = Date.now().toString(36);
    const slug = `m45-locale-guard-${token}`;
    const zhTitle = `繁中頁面防混 ${token}`;
    let pageId: string | null = null;

    try {
      const createResponse = await page.request.post('/api/builder/site/pages', {
        data: {
          locale: 'zh-hant',
          slug,
          title: zhTitle,
          document: makeLocaleGuardDocument(token, zhTitle),
        },
      });
      expect(createResponse.status()).toBe(200);
      const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
      expect(created.success, created.error).toBe(true);
      pageId = created.pageId ?? null;
      expect(pageId).toBeTruthy();

      const koPagesResponse = await page.request.get('/api/builder/site/pages?locale=ko');
      expect(koPagesResponse.status()).toBe(200);
      const koPages = (await koPagesResponse.json()) as { pages?: Array<{ pageId: string }> };
      expect(koPages.pages?.some((entry) => entry.pageId === pageId)).toBe(false);

      const zhPagesResponse = await page.request.get('/api/builder/site/pages?locale=zh-hant');
      expect(zhPagesResponse.status()).toBe(200);
      const zhPages = (await zhPagesResponse.json()) as { pages?: Array<{ pageId: string }> };
      expect(zhPages.pages?.some((entry) => entry.pageId === pageId)).toBe(true);

      const mismatchResponse = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`);
      expect(mismatchResponse.status()).toBe(409);

      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId!)}&localeGuard=${token}`);
      await expect(page.locator(`[data-node-id="locale-guard-title-${token}"]`)).toHaveCount(0);
      await expect(page.getByRole('application', { name: 'Canvas editor' })).not.toContainText(zhTitle);
      await expect(page.getByRole('application', { name: 'Canvas editor' })).toContainText('대만 법률을 한국어로 명확하게.');
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=zh-hant`).catch(() => undefined);
      }
    }
  });
});
