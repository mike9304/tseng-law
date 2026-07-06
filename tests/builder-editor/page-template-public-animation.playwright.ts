import { expect, test, type Page } from '@playwright/test';
import { getTemplateById } from '@/lib/builder/templates/registry';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'page-template-animation';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function createLawTemplatePage(page: Page, slug: string): Promise<string> {
  const template = getTemplateById('law-home');
  if (!template) throw new Error('law-home template not found.');

  const response = await page.request.post('/api/builder/site/pages', {
    headers: mutationHeaders(slug),
    timeout: 60_000,
    data: {
      locale: 'ko',
      slug,
      title: `Public animation ${slug}`,
      document: structuredClone(template.document),
    },
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { pageId?: string; success?: boolean; error?: string };
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  return payload.pageId!;
}

async function deletePage(page: Page, pageId: string, slug: string): Promise<void> {
  await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
    headers: mutationHeaders(slug),
    failOnStatusCode: false,
  });
}

async function expectSecondaryHeroCtaToFillFrame(page: Page): Promise<void> {
  const cta = page.locator('[data-node-id="law-home-hero-cta2"]');
  await expect(cta).toContainText('업무 분야 보기');
  await expect.poll(async () => cta.evaluate((node) => {
    const wrapperRect = node.getBoundingClientRect();
    const child = node.firstElementChild;
    if (!(child instanceof HTMLElement)) {
      return {
        childHeight: 0,
        wrapperHeight: wrapperRect.height,
        border: '',
        boxShadow: '',
      };
    }

    const childRect = child.getBoundingClientRect();
    const childStyle = getComputedStyle(child);
    return {
      childHeight: childRect.height,
      wrapperHeight: wrapperRect.height,
      border: childStyle.border,
      boxShadow: childStyle.boxShadow,
    };
  }), { timeout: 10_000 }).toMatchObject({
    childHeight: 56,
    wrapperHeight: 56,
    border: '1px solid rgba(0, 0, 0, 0)',
    boxShadow: 'none',
  });
}

test('publishes page-template hero copy in a visible animation state', async ({ browser, page }) => {
  const token = Date.now().toString(36);
  const slug = `pub-template-anim-${token}`;
  let pageId: string | null = null;

  try {
    pageId = await createLawTemplatePage(page, slug);

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
      timeout: 60_000,
      data: {},
    });
    expect(publishResponse.status()).toBe(200);

    await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });

    const heroTitle = page.locator('[data-node-id="law-home-hero-title"]');
    await expect(heroTitle).toContainText('신뢰할 수 있는');
    await expect(heroTitle).toContainText('법률 파트너');
    await expect(heroTitle).toHaveAttribute('data-anim-state', 'visible', { timeout: 15_000 });
    await expect.poll(async () => (
      Number(await heroTitle.evaluate((node) => getComputedStyle(node).opacity))
    ), { timeout: 15_000 }).toBeGreaterThan(0.8);
    await expectSecondaryHeroCtaToFillFrame(page);

    const noScriptContext = await browser.newContext({
      baseURL: process.env.BASE_URL ?? 'http://127.0.0.1:3000',
      httpCredentials: {
        username: process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin',
        password: process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!',
      },
      javaScriptEnabled: false,
      viewport: { width: 1440, height: 1000 },
    });
    const noScriptPage = await noScriptContext.newPage();
    try {
      await noScriptPage.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });
      const noScriptHeroTitle = noScriptPage.locator('[data-node-id="law-home-hero-title"]');
      await expect(noScriptHeroTitle).toContainText('신뢰할 수 있는');
      await expect(noScriptHeroTitle).toContainText('법률 파트너');
      await expect.poll(async () => (
        Number(await noScriptHeroTitle.evaluate((node) => getComputedStyle(node).opacity))
      ), { timeout: 5_000 }).toBeGreaterThan(0.8);
      await expectSecondaryHeroCtaToFillFrame(noScriptPage);
    } finally {
      await noScriptContext.close();
    }
  } finally {
    if (pageId) await deletePage(page, pageId, slug);
  }
});
