import { expect, test, type APIRequestContext } from '@playwright/test';
import { openBuilder, openSiteSettings } from './helpers/editor';

type TestDocument = {
  version: 1;
  locale: 'ko';
  updatedAt: string;
  updatedBy: string;
  stageWidth: number;
  stageHeight: number;
  nodes: Array<Record<string, unknown>>;
};

const baseStyle = {
  backgroundColor: '#ffffff',
  borderColor: '#cbd5e1',
  borderStyle: 'solid',
  borderWidth: 1,
  borderRadius: 10,
  shadowX: 0,
  shadowY: 8,
  shadowBlur: 24,
  shadowSpread: 0,
  shadowColor: 'rgba(15, 23, 42, 0.16)',
  opacity: 100,
};

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'motion-runtime';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function waitForRateLimit(response: Awaited<ReturnType<APIRequestContext['post']>>): Promise<boolean> {
  if (response.status() !== 429) return false;
  const retryAfter = Number(response.headers()['retry-after'] || '1');
  const waitMs = Math.max(1000, Math.min(65_000, Number.isFinite(retryAfter) ? retryAfter * 1000 : 1000));
  await new Promise((resolve) => setTimeout(resolve, waitMs));
  return true;
}

function makeMotionDocument(token: string): TestDocument {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `motion-runtime-${token}`,
    stageWidth: 1280,
    stageHeight: 1800,
    nodes: [
      {
        id: `motion-target-${token}`,
        kind: 'text',
        rect: { x: 120, y: 760, width: 520, height: 120 },
        style: baseStyle,
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: `Motion runtime target ${token}`,
          fontSize: 26,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'center',
          lineHeight: 1.3,
          letterSpacing: 0,
          fontFamily: 'system-ui',
          as: 'p',
        },
        animation: {
          entrance: {
            preset: 'expand-in',
            duration: 700,
            delay: 0,
            easing: 'cubic-bezier(0.2, 0, 0, 1)',
            triggerOnce: false,
          },
          scroll: {
            effect: 'scrub-translate',
            intensity: 40,
          },
          hover: {
            preset: 'fade',
            transitionMs: 100,
          },
          click: {
            preset: 'pulse',
            durationMs: 650,
            intensity: 46,
          },
          exit: {
            preset: 'fade-out',
            duration: 450,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          },
          loop: {
            preset: 'float',
            durationMs: 2600,
            intensity: 35,
          },
          timeline: {
            scrollBound: false,
            durationMs: 900,
            keyframes: [
              { offset: 0, transform: 'translateY(0)', opacity: 1 },
              {
                timeOffset: 1,
                properties: { transform: 'scale(1.04)', opacity: 0.82 },
                easing: 'cubic-bezier(0.3, 0, 0.1, 1)',
              },
            ],
          },
        },
      },
      {
        id: `motion-bg-${token}`,
        kind: 'container',
        rect: { x: 720, y: 720, width: 420, height: 260 },
        style: {
          ...baseStyle,
          borderWidth: 0,
          backgroundColor: {
            kind: 'image',
            src: 'data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%20400%20240%22%3E%3Crect%20width=%22400%22%20height=%22240%22%20fill=%22%230f172a%22/%3E%3Cpath%20d=%22M0%20160L80%20110L140%20140L220%2070L400%20160V240H0Z%22%20fill=%22%23d7b46a%22/%3E%3C/svg%3E',
            size: 'cover',
            position: 'center',
            repeat: 'no-repeat',
          },
        },
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Background parallax target',
          background: 'transparent',
          borderColor: '#cbd5e1',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: 0,
          padding: 0,
          layoutMode: 'absolute',
          as: 'div',
        },
        animation: {
          scroll: {
            effect: 'background-parallax',
            intensity: 36,
          },
        },
      },
      {
        id: `motion-spacer-${token}`,
        kind: 'container',
        rect: { x: 0, y: 1500, width: 1280, height: 220 },
        style: { ...baseStyle, backgroundColor: 'transparent', borderWidth: 0, shadowBlur: 0 },
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Motion spacer',
          background: 'transparent',
          borderColor: '#cbd5e1',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: 0,
          padding: 0,
          layoutMode: 'absolute',
          as: 'div',
        },
      },
    ],
  };
}

async function createBuilderPage(
  request: APIRequestContext,
  slug: string,
  title: string,
): Promise<string> {
  let response: Awaited<ReturnType<APIRequestContext['post']>> | null = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await request.post('/api/builder/site/pages', {
      data: { locale: 'ko', slug, title },
      headers: mutationHeaders(slug),
    });
    if (!(await waitForRateLimit(response))) break;
  }
  expect(response).toBeTruthy();
  response = response!;
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  return payload.pageId!;
}

async function currentDraftRevision(request: APIRequestContext, pageId: string): Promise<number> {
  const response = await request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`);
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { draft?: { revision?: number } };
  expect(typeof payload.draft?.revision).toBe('number');
  return payload.draft!.revision!;
}

async function selectLayerNode(page: import('@playwright/test').Page, nodeId: string, kind: string): Promise<void> {
  await page.getByRole('button', { name: 'Layers', exact: true }).click({ force: true });
  const drawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Layers' }).first();
  await expect(drawer.getByText('Layers').first()).toBeVisible();
  const row = drawer.locator(`[title="${kind} ${nodeId}"]`).first();
  await expect(row).toBeVisible({ timeout: 10_000 });
  await row.click();
  await expect(page.locator(`[data-node-id="${nodeId}"][class*="nodeSelected"]`).first()).toBeVisible({
    timeout: 10_000,
  });
}

async function putDraft(
  request: APIRequestContext,
  pageId: string,
  expectedRevision: number,
  document: TestDocument,
): Promise<number> {
  const response = await request.put(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
    headers: mutationHeaders(pageId),
    data: { expectedRevision, document },
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { ok?: boolean; draft?: { revision?: number }; error?: string };
  expect(payload.ok, payload.error).toBe(true);
  expect(typeof payload.draft?.revision).toBe('number');
  return payload.draft!.revision!;
}

test.describe('/ko published motion runtime', () => {
  test('shows M22 motion controls in the inspector', async ({ page }) => {
    await openBuilder(page, `/ko/admin-builder?motionInspector=${Date.now().toString(36)}`);

    await selectLayerNode(page, 'home-hero-title', 'text');

    const inspector = page.locator('[data-builder-inspector-panel="true"]').first();
    await expect(inspector).toContainText('home-hero-title');
    await inspector.getByRole('button', { name: 'animations', exact: true }).click();
    await expect(page.getByText('Entrance', { exact: true })).toBeVisible();
    await expect(page.getByText('Exit', { exact: true })).toBeVisible();
    await expect(page.getByText('Loop', { exact: true })).toBeVisible();
    await expect(page.getByText('Click', { exact: true })).toBeVisible();
    await expect(page.getByText('Motion timeline', { exact: true })).toBeVisible();

    const exitPreset = page.getByRole('combobox', { name: 'Exit preset' });
    await exitPreset.selectOption('fade-out');
    const exitSection = exitPreset.locator('xpath=ancestor::section[1]');
    await exitSection.getByRole('combobox', { name: 'Easing' }).selectOption('custom');
    const exitCustomEasing = exitSection.getByPlaceholder('cubic-bezier(0.34, 1.56, 0.64, 1)');
    await expect(exitCustomEasing).toBeEnabled();
    await exitSection.getByRole('combobox', { name: 'Easing' }).selectOption('elastic');
    await expect(exitCustomEasing).toBeDisabled();
    await page.waitForTimeout(150);

    const loopPreset = page.getByRole('combobox', { name: 'Loop preset' });
    await expect(loopPreset).toBeEnabled();
    await loopPreset.selectOption('float');
    const loopSection = loopPreset.locator('xpath=ancestor::section[1]');
    await expect(loopSection.getByRole('spinbutton', { name: 'Intensity' })).toBeEnabled();

    const scrollEffect = page.getByRole('combobox', { name: 'Scroll effect' });
    await expect(scrollEffect).toBeEnabled();
    await scrollEffect.selectOption('background-parallax');
    await page.waitForTimeout(150);
    await scrollEffect.selectOption('scrub-translate');
    const scrollSection = scrollEffect.locator('xpath=ancestor::section[1]');
    await expect(scrollSection.getByRole('spinbutton', { name: 'Intensity' })).toBeEnabled();

    const clickPreset = page.getByRole('combobox', { name: 'Click preset' });
    await expect(clickPreset).toBeEnabled();
    await clickPreset.selectOption('pulse');
    const clickSection = clickPreset.locator('xpath=ancestor::section[1]');
    await expect(clickSection.getByRole('spinbutton', { name: 'Intensity' })).toBeEnabled();

    const settingsModal = await openSiteSettings(page);
    await settingsModal.getByRole('button', { name: 'Advanced' }).click();
    await settingsModal.getByRole('combobox', { name: 'Page transition' }).selectOption('slide-up');
    await expect(settingsModal.getByRole('spinbutton', { name: 'Page transition duration' })).toBeEnabled();
    await settingsModal.getByRole('button', { name: '취소' }).click();
  });

  test('publishes M22 exit, loop, scrub, hover fade, click, timeline, and page transition runtime attrs', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-motion-runtime-${token}`;
    let pageId: string | null = null;
    let originalPageTransition: string | undefined;
    let originalPageTransitionDurationMs: number | undefined;

    try {
      const settingsResponse = await page.request.get('/api/builder/site/settings?locale=ko');
      expect(settingsResponse.status()).toBe(200);
      const settingsPayload = (await settingsResponse.json()) as {
        settings?: {
          pageTransition?: string;
          pageTransitionDurationMs?: number;
        };
      };
      originalPageTransition = settingsPayload.settings?.pageTransition;
      originalPageTransitionDurationMs = settingsPayload.settings?.pageTransitionDurationMs;
      const transitionResponse = await page.request.put('/api/builder/site/settings?locale=ko', {
        headers: mutationHeaders(`settings-${slug}`),
        data: {
          settings: {
            pageTransition: 'slide-up',
            pageTransitionDurationMs: 360,
          },
        },
      });
      expect(transitionResponse.status()).toBe(200);

      pageId = await createBuilderPage(
        page.request,
        slug,
        `Motion Runtime ${token}`,
      );
      let revision = await currentDraftRevision(page.request, pageId);
      revision = await putDraft(page.request, pageId, revision, makeMotionDocument(token));

      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish`, {
        headers: mutationHeaders(slug),
        data: { expectedDraftRevision: revision },
      });
      expect(publishResponse.status()).toBe(200);

      const htmlResponse = await page.request.get(`/ko/${slug}`);
      expect(htmlResponse.status()).toBe(200);
      const html = await htmlResponse.text();
      expect(html).toContain('data-anim-entrance="expand-in"');
      expect(html).toContain('data-anim-exit="fade-out"');
      expect(html).toContain('data-anim-loop="float"');
      expect(html).toContain('data-anim-scroll="scrub-translate"');
      expect(html).toContain('data-anim-hover="fade"');
      expect(html).toContain('data-anim-click="pulse"');
      expect(html).toContain('data-anim-timeline-mode="time"');
      expect(html).toContain('data-anim-scroll="background-parallax"');

      await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });

      const transitionWrapper = page.locator('[data-page-transition="slide-up"]').first();
      await expect(transitionWrapper).toBeVisible();
      await expect(transitionWrapper).toHaveAttribute('data-page-transition-state', 'visible');
      await expect.poll(() => transitionWrapper.evaluate((element) => (
        window.getComputedStyle(element).transitionDuration
      ))).toContain('0.36s');

      const target = page.locator(`[data-node-id="motion-target-${token}"]`).first();
      await expect(target).toBeVisible();
      await expect(target).toHaveAttribute('data-anim-exit-easing', 'cubic-bezier(0.4, 0, 0.2, 1)');
      await expect(target).toHaveAttribute('data-anim-loop-duration', '2600');

      const handle = await target.elementHandle();
      expect(handle).toBeTruthy();
      await page.waitForFunction(
        (element) => getComputedStyle(element as HTMLElement).getPropertyValue('--builder-anim-loop-duration').trim() === '2600ms',
        handle,
      );
      await expect(target).toHaveCSS('animation-name', /builder-loop-float/);

      await page.evaluate(() => window.scrollTo(0, 520));
      await page.waitForFunction(
        (element) => {
          const node = element as HTMLElement;
          return node.style.getPropertyValue('--builder-anim-scrub-progress').trim().length > 0
            && node.style.getPropertyValue('--builder-scroll-transform').includes('translateY');
        },
        handle,
      );

      const backgroundTarget = page.locator(`[data-node-id="motion-bg-${token}"]`).first();
      await expect(backgroundTarget).toHaveAttribute('data-anim-scroll', 'background-parallax');
      const backgroundHandle = await backgroundTarget.elementHandle();
      expect(backgroundHandle).toBeTruthy();
      await page.waitForFunction(
        (element) => {
          const node = element as HTMLElement;
          return node.style.getPropertyValue('--builder-bg-parallax-position').includes('calc(50% +');
        },
        backgroundHandle,
      );

      await target.hover();
      await expect(target).toHaveCSS('opacity', /0\.7|0\.75|0\.8/);

      await target.click();
      await expect(target).toHaveAttribute('data-anim-click-state', 'active');
      await expect(target).toHaveCSS('animation-name', /builder-click-pulse|builder-loop-float/);

      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForFunction(
        () => window.scrollY > 900,
      );
      await page.waitForFunction(
        (element) => {
          const node = element as HTMLElement;
          const rect = node.getBoundingClientRect();
          return rect.bottom < 0 && node.dataset.animExitState === 'leaving';
        },
        handle,
      );
      await expect(target).toHaveAttribute('data-anim-exit-state', 'leaving');
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
      await page.request.put('/api/builder/site/settings?locale=ko', {
        headers: mutationHeaders(`settings-restore-${slug}`),
        data: {
          settings: {
            pageTransition: originalPageTransition ?? 'none',
            pageTransitionDurationMs: originalPageTransitionDurationMs ?? 280,
          },
        },
        failOnStatusCode: false,
      });
    }
  });
});
