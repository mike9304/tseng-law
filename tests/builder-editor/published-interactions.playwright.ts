import { expect, test, type APIRequestContext } from '@playwright/test';
import { readHeaderCanvas, readSiteDocument, writeHeaderCanvas, writeSiteDocument } from '@/lib/builder/site/persistence';
import { createDefaultCookieConsent, createDefaultPopup, type BuilderCookieConsent, type BuilderHeaderFooterConfig, type BuilderSiteSettings } from '@/lib/builder/site/types';

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

const baseContainerContent = {
  background: 'transparent',
  borderColor: '#cbd5e1',
  borderStyle: 'solid',
  borderWidth: 0,
  borderRadius: 0,
  padding: 0,
  layoutMode: 'absolute',
};

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'published-interactions';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function waitForRateLimit(response: Awaited<ReturnType<APIRequestContext['post']>>): Promise<boolean> {
  if (response.status() !== 429) return false;
  const retryAfter = Number(response.headers()['retry-after'] || '1');
  const waitMs = Math.max(1000, Math.min(65_000, Number.isFinite(retryAfter) ? retryAfter * 1000 : 1000));
  await new Promise((resolve) => setTimeout(resolve, waitMs));
  return true;
}

function containerNode(
  id: string,
  rect: Record<string, number>,
  className: string,
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    id,
    kind: 'container',
    rect,
    style: { ...baseStyle, borderRadius: 12 },
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      ...baseContainerContent,
      label: id,
      className,
      as: 'div',
      ...extra,
    },
  };
}

function textNode(id: string, parentId: string, y: number, text: string): Record<string, unknown> {
  return {
    id,
    kind: 'text',
    parentId,
    rect: { x: 24, y, width: 640, height: 28 },
    style: baseStyle,
    zIndex: 1,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      text,
      fontSize: 18,
      color: '#0f172a',
      fontWeight: 'medium',
      align: 'left',
      lineHeight: 1.3,
      letterSpacing: 0,
      fontFamily: 'system-ui',
      as: 'p',
    },
  };
}

function makePublishedInteractionDocument(token: string): TestDocument {
  const now = new Date().toISOString();
  const rootId = `interaction-root-${token}`;
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `published-interactions-${token}`,
    stageWidth: 1280,
    stageHeight: 1080,
    nodes: [
      containerNode(rootId, { x: 0, y: 0, width: 1280, height: 900 }, 'section section--light', {
        as: 'main',
      }),
      {
        ...containerNode('home-services-card-0', { x: 80, y: 80, width: 920, height: 170 }, 'services-detail-card', {
          as: 'article',
          htmlId: 'corp',
        }),
        parentId: rootId,
        zIndex: 1,
      },
      {
        ...containerNode('home-services-card-0-toggle', { x: 0, y: 0, width: 920, height: 70 }, 'services-detail-toggle'),
        parentId: 'home-services-card-0',
      },
      textNode('home-services-card-0-title', 'home-services-card-0-toggle', 20, '기업 법무'),
      {
        ...containerNode('home-services-card-0-body', { x: 0, y: 72, width: 920, height: 80 }, 'services-detail-body'),
        parentId: 'home-services-card-0',
      },
      textNode('home-services-card-0-detail', 'home-services-card-0-body', 12, '계약 검토와 분쟁 대응을 한 번에 봅니다.'),
      {
        ...containerNode('home-services-card-1', { x: 80, y: 270, width: 920, height: 170 }, 'services-detail-card', {
          as: 'article',
        }),
        parentId: rootId,
        zIndex: 2,
      },
      {
        ...containerNode('home-services-card-1-toggle', { x: 0, y: 0, width: 920, height: 70 }, 'services-detail-toggle'),
        parentId: 'home-services-card-1',
      },
      textNode('home-services-card-1-title', 'home-services-card-1-toggle', 20, '국제 소송'),
      {
        ...containerNode('home-services-card-1-body', { x: 0, y: 72, width: 920, height: 80 }, 'services-detail-body'),
        parentId: 'home-services-card-1',
      },
      textNode('home-services-card-1-detail', 'home-services-card-1-body', 12, '국경 간 소송 전략을 설계합니다.'),
      {
        ...containerNode('home-faq-item-0', { x: 80, y: 500, width: 920, height: 130 }, 'faq-item', {
          as: 'article',
        }),
        parentId: rootId,
        zIndex: 3,
      },
      {
        ...containerNode('home-faq-item-0-question', { x: 0, y: 0, width: 920, height: 58 }, 'faq-question'),
        parentId: 'home-faq-item-0',
      },
      textNode('home-faq-item-0-question-text', 'home-faq-item-0-question', 18, '상담은 어떻게 예약하나요?'),
      {
        ...containerNode('home-faq-item-0-answer-wrap', { x: 0, y: 58, width: 920, height: 68 }, 'faq-answer-wrap'),
        parentId: 'home-faq-item-0',
      },
      textNode('home-faq-item-0-answer', 'home-faq-item-0-answer-wrap', 12, '전화나 온라인 문의로 예약할 수 있습니다.'),
      {
        id: `published-lightbox-image-${token}`,
        kind: 'image',
        parentId: rootId,
        rect: { x: 80, y: 680, width: 300, height: 190 },
        style: { ...baseStyle, borderRadius: 14 },
        zIndex: 4,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          src: '/images/header-skyline-ratio.webp',
          alt: `Published lightbox image ${token}`,
          fit: 'cover',
          clickAction: 'lightbox',
        },
      },
      {
        id: `published-popup-image-${token}`,
        kind: 'image',
        parentId: rootId,
        rect: { x: 430, y: 680, width: 300, height: 190 },
        style: { ...baseStyle, borderRadius: 14 },
        zIndex: 5,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          src: '/images/header-skyline-ratio.webp',
          alt: `Published popup image ${token}`,
          fit: 'cover',
          clickAction: 'popup',
          hotspots: [{ x: 50, y: 50, label: 'Popup detail stays visible' }],
        },
      },
    ],
  };
}

function buttonNode(
  id: string,
  parentId: string,
  rect: Record<string, number>,
  label: string,
  href: string,
): Record<string, unknown> {
  return {
    id,
    kind: 'button',
    parentId,
    rect,
    style: { ...baseStyle, borderRadius: 8 },
    zIndex: 2,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      label,
      href,
      style: 'primary',
      as: 'a',
    },
  };
}

function makePublishedOverlayTriggerDocument(token: string, lightboxSlug: string, popupSlug: string): TestDocument {
  const now = new Date().toISOString();
  const rootId = `overlay-root-${token}`;
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `published-overlays-${token}`,
    stageWidth: 1280,
    stageHeight: 760,
    nodes: [
      containerNode(rootId, { x: 0, y: 0, width: 1280, height: 760 }, 'section section--light', {
        as: 'main',
      }),
      textNode(`overlay-title-${token}`, rootId, 72, `Published overlay keyboard ${token}`),
      buttonNode(
        `published-lightbox-trigger-${token}`,
        rootId,
        { x: 80, y: 160, width: 260, height: 56 },
        'Open site lightbox',
        `lightbox:${lightboxSlug}`,
      ),
      buttonNode(
        `published-popup-trigger-${token}`,
        rootId,
        { x: 380, y: 160, width: 260, height: 56 },
        'Open site popup',
        `popup:${popupSlug}`,
      ),
    ],
  };
}

function makePublishedCookieConsentDocument(token: string): TestDocument {
  const now = new Date().toISOString();
  const rootId = `cookie-root-${token}`;
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `published-cookie-${token}`,
    stageWidth: 1280,
    stageHeight: 640,
    nodes: [
      containerNode(rootId, { x: 0, y: 0, width: 1280, height: 640 }, 'section section--light', {
        as: 'main',
      }),
      textNode(`cookie-title-${token}`, rootId, 72, `Published cookie consent ${token}`),
      buttonNode(
        `published-cookie-trigger-${token}`,
        rootId,
        { x: 80, y: 160, width: 280, height: 56 },
        'Open cookie settings',
        'cookie-consent:open',
      ),
    ],
  };
}

function makePublishedGalleryDocument(token: string): TestDocument {
  const now = new Date().toISOString();
  const rootId = `gallery-root-${token}`;
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `published-gallery-${token}`,
    stageWidth: 1280,
    stageHeight: 760,
    nodes: [
      containerNode(rootId, { x: 0, y: 0, width: 1280, height: 760 }, 'section section--light', {
        as: 'main',
      }),
      textNode(`gallery-title-${token}`, rootId, 72, `Published gallery lightbox ${token}`),
      {
        id: `published-gallery-${token}`,
        kind: 'gallery',
        parentId: rootId,
        rect: { x: 80, y: 160, width: 620, height: 320 },
        style: { ...baseStyle, borderRadius: 12 },
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          images: [
            {
              src: '/images/header-skyline-ratio.webp',
              alt: `Gallery focus one ${token}`,
              caption: 'Gallery one',
              tags: ['office'],
            },
            {
              src: '/images/header-skyline-buildings.webp',
              alt: `Gallery focus two ${token}`,
              caption: 'Gallery two',
              tags: ['office'],
            },
          ],
          layout: 'grid',
          columns: 2,
          gap: 12,
          showCaptions: true,
          captionMode: 'overlay',
          activeFilter: 'all',
          autoplay: false,
          interval: 4000,
          thumbnailPosition: 'bottom',
          proStyle: 'clean',
        },
      },
    ],
  };
}

function makePublishedHeaderDrawerDocument(token: string): TestDocument {
  const now = new Date().toISOString();
  const rootId = `mobile-header-root-${token}`;
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `published-mobile-header-${token}`,
    stageWidth: 1280,
    stageHeight: 520,
    nodes: [
      containerNode(rootId, { x: 0, y: 0, width: 1280, height: 520 }, 'section section--light', {
        as: 'main',
      }),
      textNode(`mobile-header-title-${token}`, rootId, 80, `Published mobile header ${token}`),
    ],
  };
}

function makePublishedMenuBarDocument(token: string): TestDocument {
  const now = new Date().toISOString();
  const rootId = `menu-bar-root-${token}`;
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `published-menu-bar-${token}`,
    stageWidth: 1280,
    stageHeight: 560,
    nodes: [
      containerNode(rootId, { x: 0, y: 0, width: 1280, height: 560 }, 'section section--light', {
        as: 'main',
      }),
      textNode(`menu-bar-title-${token}`, rootId, 72, `Published menu bar ${token}`),
      {
        id: `published-menu-bar-${token}`,
        kind: 'menu-bar',
        parentId: rootId,
        rect: { x: 80, y: 150, width: 620, height: 180 },
        style: { ...baseStyle, borderRadius: 8 },
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          items: [
            {
              label: '서비스',
              href: '#services',
              children: [
                { label: '기업법무', href: '#corporate', description: 'Corporate counsel' },
                { label: '분쟁대응', href: '#disputes', description: 'Dispute response' },
              ],
            },
            { label: '변호사', href: '#lawyers' },
            { label: '문의', href: '#contact' },
          ],
          orientation: 'horizontal',
          variant: 'dropdown',
          activeHref: '#services',
          showMobileHamburger: true,
        },
      },
    ],
  };
}

function makePublishedSiteSearchDocument(token: string): TestDocument {
  const now = new Date().toISOString();
  const rootId = `site-search-root-${token}`;
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `published-site-search-${token}`,
    stageWidth: 1280,
    stageHeight: 560,
    nodes: [
      containerNode(rootId, { x: 0, y: 0, width: 1280, height: 560 }, 'section section--light', {
        as: 'main',
      }),
      textNode(`site-search-title-${token}`, rootId, 72, `Published site search ${token}`),
      {
        id: `published-site-search-${token}`,
        kind: 'site-search',
        parentId: rootId,
        rect: { x: 80, y: 150, width: 520, height: 72 },
        style: { ...baseStyle, borderRadius: 8 },
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          placeholder: '사이트 검색어',
          submitLabel: '검색',
          showResultsInline: true,
          kinds: [],
          locale: 'ko',
          maxResults: 4,
        },
      },
    ],
  };
}

async function createBuilderPage(
  request: APIRequestContext,
  slug: string,
  title: string,
  document: TestDocument,
): Promise<string> {
  let response: Awaited<ReturnType<APIRequestContext['post']>> | null = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await request.post('/api/builder/site/pages', {
      data: { locale: 'ko', slug, title, document },
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

test.describe('/ko published builder interactions', () => {
  test('opens site lightbox and popup overlays from keyboard triggers with focus restore', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-published-overlays-${token}`;
    const lightboxSlug = `keyboard-lightbox-${token}`;
    const popupSlug = `keyboard-popup-${token}`;
    let pageId: string | null = null;
    let popupId: string | null = null;
    let lightboxId: string | null = null;

    try {
      pageId = await createBuilderPage(
        page.request,
        slug,
        `Published Overlays ${token}`,
        makePublishedOverlayTriggerDocument(token, lightboxSlug, popupSlug),
      );

      const lightboxResponse = await page.request.post('/api/builder/site/lightboxes', {
        headers: mutationHeaders(`${slug}-lightbox`),
        data: { locale: 'ko', slug: lightboxSlug, name: `Keyboard Lightbox ${token}` },
      });
      expect(lightboxResponse.status()).toBe(200);
      const lightboxPayload = (await lightboxResponse.json()) as { ok?: boolean; lightbox?: { id: string } };
      expect(lightboxPayload.ok).toBe(true);
      expect(lightboxPayload.lightbox?.id).toBeTruthy();
      lightboxId = lightboxPayload.lightbox!.id;

      const site = await readSiteDocument('default', 'ko');
      const popup = {
        ...createDefaultPopup('ko', popupSlug, `Keyboard Popup ${token}`),
        oncePerVisitor: false,
        delayMs: 0,
      };
      popupId = popup.id;
      await writeSiteDocument({
        ...site,
        popups: [...(site.popups ?? []).filter((item) => item.slug !== popupSlug), popup],
        updatedAt: new Date().toISOString(),
      });

      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish`, {
        headers: mutationHeaders(slug),
        data: {},
      });
      const publishPayload = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
      expect(publishResponse.status(), JSON.stringify(publishPayload)).toBe(200);
      expect(publishPayload.ok, publishPayload.error).toBe(true);
      expect(publishPayload.slug).toBe(slug);

      const latestSite = await readSiteDocument('default', 'ko');
      const publishedPage = latestSite.pages.find((entry) => entry.pageId === pageId);
      expect(publishedPage?.publishedAt).toBeTruthy();
      expect(latestSite.lightboxes?.some((item) => item.id === lightboxId && item.slug === lightboxSlug)).toBe(true);
      expect(latestSite.popups?.some((item) => item.id === popupId && item.slug === popupSlug)).toBe(true);

      const htmlResponse = await page.request.get(`/ko/${slug}`);
      expect(htmlResponse.status()).toBe(200);
      const html = await htmlResponse.text();
      expect(html).toContain(`published-lightbox-trigger-${token}`);
      expect(html).toContain(`published-popup-trigger-${token}`);

      await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle');

      const lightboxWrapper = page.locator(`[data-node-id="published-lightbox-trigger-${token}"]`);
      await expect(lightboxWrapper).toHaveAttribute('role', 'button');
      await lightboxWrapper.focus();
      await expect(lightboxWrapper).toBeFocused();
      await lightboxWrapper.press('Enter');
      const lightboxDialog = page.locator(`[data-lightbox-overlay="${lightboxSlug}"]`);
      await expect(lightboxDialog).toBeVisible();
      const lightboxClose = lightboxDialog.getByRole('button', { name: 'Close' });
      await expect(lightboxClose).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(lightboxDialog).toHaveCount(0);
      await expect(lightboxWrapper).toBeFocused();

      await lightboxWrapper.press('Space');
      await expect(lightboxDialog).toBeVisible();
      await expect(lightboxClose).toBeFocused();
      await lightboxClose.click();
      await expect(lightboxDialog).toHaveCount(0);
      await expect(lightboxWrapper).toBeFocused();

      const popupTrigger = page.getByRole('link', { name: 'Open site popup' });
      await popupTrigger.focus();
      await expect(popupTrigger).toBeFocused();
      await popupTrigger.press('Space');
      const popupDialog = page.locator(`[data-popup-overlay="${popupSlug}"]`);
      await expect(popupDialog).toBeVisible();
      const popupClose = popupDialog.getByRole('button', { name: 'Close' });
      await expect(popupClose).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(popupDialog).toHaveCount(0);
      await expect(popupTrigger).toBeFocused();
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
      if (lightboxId) {
        await page.request.delete(`/api/builder/site/lightboxes/${lightboxId}?locale=ko`, {
          headers: mutationHeaders(`${slug}-lightbox`),
          failOnStatusCode: false,
        });
      }
      if (popupId) {
        const latestSite = await readSiteDocument('default', 'ko');
        await writeSiteDocument({
          ...latestSite,
          popups: (latestSite.popups ?? []).filter((item) => item.id !== popupId),
          updatedAt: new Date().toISOString(),
        });
      }
    }
  });

  test('restores focus for hash lightbox and automatic popup opens', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-published-auto-overlay-${token}`;
    const lightboxSlug = `hash-lightbox-${token}`;
    const popupSlug = `autoload-popup-${token}`;
    let pageId: string | null = null;
    let lightboxId: string | null = null;
    let popupId: string | null = null;

    try {
      pageId = await createBuilderPage(
        page.request,
        slug,
        `Published Auto Overlay ${token}`,
        makePublishedOverlayTriggerDocument(token, lightboxSlug, popupSlug),
      );

      const lightboxResponse = await page.request.post('/api/builder/site/lightboxes', {
        headers: mutationHeaders(`${slug}-lightbox`),
        data: { locale: 'ko', slug: lightboxSlug, name: `Hash Lightbox ${token}` },
      });
      expect(lightboxResponse.status()).toBe(200);
      const lightboxPayload = (await lightboxResponse.json()) as { ok?: boolean; lightbox?: { id: string } };
      expect(lightboxPayload.ok).toBe(true);
      expect(lightboxPayload.lightbox?.id).toBeTruthy();
      lightboxId = lightboxPayload.lightbox!.id;

      const site = await readSiteDocument('default', 'ko');
      const popup = {
        ...createDefaultPopup('ko', popupSlug, `Autoload Popup ${token}`),
        trigger: 'on-load' as const,
        oncePerVisitor: false,
        delayMs: 5000,
      };
      popupId = popup.id;
      await writeSiteDocument({
        ...site,
        popups: [...(site.popups ?? []).filter((item) => item.slug !== popupSlug), popup],
        updatedAt: new Date().toISOString(),
      });

      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish`, {
        headers: mutationHeaders(slug),
        data: {},
      });
      const publishPayload = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
      expect(publishResponse.status(), JSON.stringify(publishPayload)).toBe(200);
      expect(publishPayload.ok, publishPayload.error).toBe(true);

      await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle');

      const lightboxWrapper = page.locator(`[data-node-id="published-lightbox-trigger-${token}"]`);
      await expect(lightboxWrapper).toHaveAttribute('role', 'button');
      await lightboxWrapper.focus();
      await expect(lightboxWrapper).toBeFocused();
      await page.evaluate((targetSlug) => {
        window.location.hash = `lb-${targetSlug}`;
      }, lightboxSlug);
      const lightboxDialog = page.locator(`[data-lightbox-overlay="${lightboxSlug}"]`);
      await expect(lightboxDialog).toBeVisible();
      await expect(lightboxDialog.getByRole('button', { name: 'Close' })).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(lightboxDialog).toHaveCount(0);
      await expect(lightboxWrapper).toBeFocused();

      const popupTrigger = page.getByRole('link', { name: 'Open site popup' });
      await popupTrigger.focus();
      await expect(popupTrigger).toBeFocused();
      const popupDialog = page.locator(`[data-popup-overlay="${popupSlug}"]`);
      await expect(popupDialog).toBeVisible({ timeout: 5000 });
      await expect(popupDialog.getByRole('button', { name: 'Close' })).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(popupDialog).toHaveCount(0);
      await expect(popupTrigger).toBeFocused();
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
      if (lightboxId) {
        await page.request.delete(`/api/builder/site/lightboxes/${lightboxId}?locale=ko`, {
          headers: mutationHeaders(`${slug}-lightbox`),
          failOnStatusCode: false,
        });
      }
      if (popupId) {
        const latestSite = await readSiteDocument('default', 'ko');
        await writeSiteDocument({
          ...latestSite,
          popups: (latestSite.popups ?? []).filter((item) => item.id !== popupId),
          updatedAt: new Date().toISOString(),
        });
      }
    }
  });

  test('traps focus in the modal cookie consent banner and keyboard trigger', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-published-cookie-${token}`;
    let pageId: string | null = null;
    let originalCookieConsent: BuilderCookieConsent | undefined;

    try {
      pageId = await createBuilderPage(
        page.request,
        slug,
        `Published Cookie Consent ${token}`,
        makePublishedCookieConsentDocument(token),
      );

      const site = await readSiteDocument('default', 'ko');
      originalCookieConsent = site.cookieConsent;
      await writeSiteDocument({
        ...site,
        cookieConsent: {
          ...createDefaultCookieConsent('ko'),
          enabled: true,
          version: `playwright-${token}`,
          layout: 'modal-center',
          title: `Cookie consent ${token}`,
          description: '쿠키 동의 모달 포커스 검증입니다.',
          manageLabel: 'Manage cookies',
          acceptLabel: 'Accept all',
          declineLabel: 'Reject optional',
          categories: [
            {
              key: 'necessary',
              label: 'Necessary',
              description: 'Required site cookies',
              required: true,
              defaultEnabled: true,
            },
            {
              key: 'analytics',
              label: 'Analytics',
              description: 'Usage analytics',
              required: false,
              defaultEnabled: false,
            },
          ],
        },
        updatedAt: new Date().toISOString(),
      });

      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish`, {
        headers: mutationHeaders(slug),
        data: {},
      });
      const publishPayload = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
      expect(publishResponse.status(), JSON.stringify(publishPayload)).toBe(200);
      expect(publishPayload.ok, publishPayload.error).toBe(true);

      await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });

      const dialog = page.getByRole('dialog', { name: 'cookie consent' });
      await expect(dialog).toBeVisible();
      const manageButton = dialog.getByRole('button', { name: 'Manage cookies' });
      await expect(manageButton).toBeFocused();
      await page.keyboard.press('Shift+Tab');
      await expect(dialog.getByRole('button', { name: 'Accept all' })).toBeFocused();

      await page.evaluate(() => {
        const probe = document.createElement('button');
        probe.type = 'button';
        probe.textContent = 'outside cookie focus probe';
        probe.setAttribute('data-cookie-focus-probe', 'true');
        document.body.appendChild(probe);
        probe.focus();
      });
      await expect.poll(async () => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);

      await dialog.getByRole('button', { name: 'Accept all' }).click();
      await expect(dialog).toHaveCount(0);

      const trigger = page.getByRole('link', { name: 'Open cookie settings' });
      await trigger.focus();
      await expect(trigger).toBeFocused();
      await page.keyboard.press('Space');
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute('data-builder-cookie-managing', 'true');
      await expect.poll(async () => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
      await dialog.getByRole('button', { name: '저장' }).click();
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
      const latestSite = await readSiteDocument('default', 'ko');
      const restoredSite = { ...latestSite, updatedAt: new Date().toISOString() };
      if (originalCookieConsent) {
        await writeSiteDocument({ ...restoredSite, cookieConsent: originalCookieConsent });
      } else {
        const { cookieConsent: _cookieConsent, ...withoutCookieConsent } = restoredSite;
        void _cookieConsent;
        await writeSiteDocument(withoutCookieConsent);
      }
    }
  });

  test('traps focus in the published gallery lightbox', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-published-gallery-${token}`;
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(
        page.request,
        slug,
        `Published Gallery ${token}`,
        makePublishedGalleryDocument(token),
      );

      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish`, {
        headers: mutationHeaders(slug),
        data: {},
      });
      const publishPayload = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
      expect(publishResponse.status(), JSON.stringify(publishPayload)).toBe(200);
      expect(publishPayload.ok, publishPayload.error).toBe(true);

      await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });

      const galleryItem = page
        .locator(`[data-node-id="published-gallery-${token}"] [data-builder-gallery-item="true"]`)
        .first();
      await expect(galleryItem).toBeVisible();
      await galleryItem.click();

      await expect(page.getByRole('dialog', { name: `Gallery focus one ${token}` })).toBeVisible();
      const dialog = page.locator('.builder-gallery-lightbox');
      await expect(dialog).toBeVisible();
      const closeButton = dialog.getByRole('button', { name: 'Close' });
      await expect(closeButton).toBeFocused();
      await page.keyboard.press('ArrowRight');
      await expect(dialog.locator('.builder-gallery-lightbox-counter')).toContainText('2 / 2');
      await page.keyboard.press('ArrowLeft');
      await expect(dialog.locator('.builder-gallery-lightbox-counter')).toContainText('1 / 2');

      await dialog.locator('.builder-gallery-lightbox-image').click();
      await expect(dialog).toBeVisible();
      await page.evaluate(() => {
        const probe = document.createElement('button');
        probe.type = 'button';
        probe.textContent = 'outside gallery focus probe';
        probe.setAttribute('data-gallery-focus-probe', 'true');
        document.body.appendChild(probe);
        probe.focus();
      });
      await expect(closeButton).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(galleryItem).toBeFocused();
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
    }
  });

  test('traps focus in the fallback mobile site header drawer', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-mobile-header-${token}`;
    let pageId: string | null = null;
    let originalHeaderCanvas: Awaited<ReturnType<typeof readHeaderCanvas>> = null;
    let originalHeaderFooter: BuilderHeaderFooterConfig | undefined;
    let touchedHeaderCanvas = false;
    let touchedHeaderFooter = false;

    try {
      pageId = await createBuilderPage(
        page.request,
        slug,
        `Published Mobile Header ${token}`,
        makePublishedHeaderDrawerDocument(token),
      );

      originalHeaderCanvas = await readHeaderCanvas('default');
      touchedHeaderCanvas = true;
      await writeHeaderCanvas('default', {
        version: 1,
        locale: 'ko',
        updatedAt: new Date().toISOString(),
        updatedBy: `published-mobile-header-${token}`,
        stageWidth: 1280,
        stageHeight: 96,
        nodes: [],
      });

      const site = await readSiteDocument('default', 'ko');
      originalHeaderFooter = site.headerFooter;
      touchedHeaderFooter = true;
      await writeSiteDocument({
        ...site,
        headerFooter: {
          ...(site.headerFooter ?? {}),
          mobileHamburger: 'force',
        },
        updatedAt: new Date().toISOString(),
      });

      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish`, {
        headers: mutationHeaders(slug),
        data: {},
      });
      const publishPayload = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
      expect(publishResponse.status(), JSON.stringify(publishPayload)).toBe(200);
      expect(publishPayload.ok, publishPayload.error).toBe(true);

      await page.setViewportSize({ width: 390, height: 760 });
      await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle');

      const toggle = page.locator('[data-builder-mobile-hamburger="true"]').first();
      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await toggle.focus();
      await expect(toggle).toBeFocused();
      await toggle.press('Enter');

      const drawer = page.locator('#site-mobile-nav-drawer');
      const dialog = page.getByRole('dialog', { name: 'Mobile menu' });
      await expect(drawer).toHaveAttribute('data-builder-mobile-drawer', 'open');
      await expect(dialog).toBeVisible();
      const closeButton = dialog.getByRole('button', { name: 'Close' });
      await expect(closeButton).toBeFocused();

      await page.keyboard.press('Shift+Tab');
      await expect(dialog.locator('.site-mobile-nav-utility a').last()).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(closeButton).toBeFocused();

      await page.evaluate(() => {
        const probe = document.createElement('button');
        probe.type = 'button';
        probe.textContent = 'outside mobile menu focus probe';
        probe.setAttribute('data-mobile-header-focus-probe', 'true');
        document.body.appendChild(probe);
        probe.focus();
      });
      await expect(closeButton).toBeFocused();

      await page.keyboard.press('Escape');
      await expect(drawer).toHaveAttribute('data-builder-mobile-drawer', 'closed');
      await expect(dialog).toBeHidden();
      await expect(toggle).toBeFocused();

      await toggle.press('Space');
      await expect(drawer).toHaveAttribute('data-builder-mobile-drawer', 'open');
      await expect(closeButton).toBeFocused();
      await drawer.click({ position: { x: 8, y: 8 } });
      await expect(drawer).toHaveAttribute('data-builder-mobile-drawer', 'closed');
      await expect(toggle).toBeFocused();
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
      if (touchedHeaderCanvas && originalHeaderCanvas) {
        await writeHeaderCanvas('default', originalHeaderCanvas);
      }
      if (touchedHeaderFooter) {
        const latestSite = await readSiteDocument('default', 'ko');
        const restoredSite = { ...latestSite, updatedAt: new Date().toISOString() };
        if (originalHeaderFooter) {
          restoredSite.headerFooter = originalHeaderFooter;
        } else {
          delete restoredSite.headerFooter;
        }
        await writeSiteDocument(restoredSite);
      }
    }
  });

  test('traps focus in the published header search overlay', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-header-search-${token}`;
    let pageId: string | null = null;
    let originalHeaderCanvas: Awaited<ReturnType<typeof readHeaderCanvas>> = null;
    let touchedHeaderCanvas = false;

    try {
      pageId = await createBuilderPage(
        page.request,
        slug,
        `Published Header Search ${token}`,
        makePublishedHeaderDrawerDocument(token),
      );

      originalHeaderCanvas = await readHeaderCanvas('default');
      touchedHeaderCanvas = true;
      await writeHeaderCanvas('default', {
        version: 1,
        locale: 'ko',
        updatedAt: new Date().toISOString(),
        updatedBy: `published-header-search-${token}`,
        stageWidth: 1280,
        stageHeight: 96,
        nodes: [],
      });

      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish`, {
        headers: mutationHeaders(slug),
        data: {},
      });
      const publishPayload = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
      expect(publishResponse.status(), JSON.stringify(publishPayload)).toBe(200);
      expect(publishPayload.ok, publishPayload.error).toBe(true);

      await page.setViewportSize({ width: 1024, height: 760 });
      await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle');

      const searchButton = page.locator('[data-builder-header-action="search"]').first();
      await expect(searchButton).toBeVisible();
      await searchButton.focus();
      await expect(searchButton).toBeFocused();
      await searchButton.press('Enter');

      const dialog = page.getByRole('dialog', { name: '검색' });
      await expect(dialog).toBeVisible();
      const input = dialog.getByRole('searchbox', { name: '어떻게 도와드릴까요?' });
      await expect(input).toBeFocused();

      const closeButton = dialog.getByRole('button', { name: '닫기' });
      await closeButton.focus();
      await page.keyboard.press('Shift+Tab');
      await expect(dialog.getByRole('link', { name: '노사 분쟁' })).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(closeButton).toBeFocused();

      await page.evaluate(() => {
        const probe = document.createElement('button');
        probe.type = 'button';
        probe.textContent = 'outside search overlay focus probe';
        probe.setAttribute('data-header-search-focus-probe', 'true');
        document.body.appendChild(probe);
        probe.focus();
      });
      await expect(input).toBeFocused();

      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(searchButton).toBeFocused();
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
      if (touchedHeaderCanvas && originalHeaderCanvas) {
        await writeHeaderCanvas('default', originalHeaderCanvas);
      }
    }
  });

  test('traps focus in the public live chat widget', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-live-chat-${token}`;
    let pageId: string | null = null;
    let originalSettings: BuilderSiteSettings | undefined;
    let touchedSettings = false;

    try {
      pageId = await createBuilderPage(
        page.request,
        slug,
        `Published Live Chat ${token}`,
        makePublishedHeaderDrawerDocument(token),
      );

      const site = await readSiteDocument('default', 'ko');
      originalSettings = site.settings;
      touchedSettings = true;
      await writeSiteDocument({
        ...site,
        settings: {
          ...(site.settings ?? {}),
          liveChatWidgetEnabled: true,
        },
        updatedAt: new Date().toISOString(),
      });

      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish`, {
        headers: mutationHeaders(slug),
        data: {},
      });
      const publishPayload = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
      expect(publishResponse.status(), JSON.stringify(publishPayload)).toBe(200);
      expect(publishPayload.ok, publishPayload.error).toBe(true);

      await page.addInitScript(() => window.localStorage.removeItem('tw_live_chat_session_v1'));
      await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle');

      const trigger = page.getByRole('button', { name: '실시간 상담 열기' });
      await expect(trigger).toBeVisible();
      await trigger.focus();
      await expect(trigger).toBeFocused();
      await trigger.press('Enter');

      const dialog = page.getByRole('dialog', { name: '호정국제 상담' });
      await expect(dialog).toBeVisible();
      const draftInput = dialog.getByPlaceholder('문의 내용을 입력하세요');
      await expect(draftInput).toBeFocused();

      const closeButton = dialog.getByRole('button', { name: '닫기' });
      await closeButton.focus();
      await page.keyboard.press('Shift+Tab');
      await expect(draftInput).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(closeButton).toBeFocused();

      await page.evaluate(() => {
        const probe = document.createElement('button');
        probe.type = 'button';
        probe.textContent = 'outside live chat focus probe';
        probe.setAttribute('data-live-chat-focus-probe', 'true');
        document.body.appendChild(probe);
        probe.focus();
      });
      await expect(draftInput).toBeFocused();

      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
      if (touchedSettings) {
        const latestSite = await readSiteDocument('default', 'ko');
        const restoredSite = { ...latestSite, updatedAt: new Date().toISOString() };
        if (originalSettings) {
          restoredSite.settings = originalSettings;
        } else {
          delete restoredSite.settings;
        }
        await writeSiteDocument(restoredSite);
      }
    }
  });

  test('keeps the public AI chat keyboard path stable', async ({ page }) => {
    try {
      await page.addInitScript(() => {
        window.localStorage.setItem('hojeong-ai-chat-collapsed', 'true');
        window.localStorage.setItem('hojeong-year-end-event-hide-until', String(Date.now() + 24 * 60 * 60 * 1000));
      });
      await page.goto('/ko', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle');

      const trigger = page.getByRole('button', { name: '빠른 상담 열기' });
      await expect(trigger).toBeVisible();
      await trigger.focus();
      await expect(trigger).toBeFocused();
      await trigger.press('Enter');

      const dialog = page.getByRole('dialog', { name: 'AI 상담사' });
      await expect(dialog).toBeVisible();
      const input = dialog.getByPlaceholder('질문을 입력해 주세요...');
      await expect(input).toBeFocused();

      const closeButton = dialog.getByRole('button', { name: '닫기' });
      await closeButton.focus();
      await page.keyboard.press('Shift+Tab');
      await expect(input).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(closeButton).toBeFocused();

      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
    } finally {
      await page.evaluate(() => {
        window.localStorage.removeItem('hojeong-ai-chat-collapsed');
        window.localStorage.removeItem('hojeong-year-end-event-hide-until');
      }).catch(() => undefined);
    }
  });

  test('traps focus in the public mobile navigation drawer', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('hojeong-ai-chat-collapsed', 'true');
      window.localStorage.setItem('hojeong-year-end-event-hide-until', String(Date.now() + 24 * 60 * 60 * 1000));
    });

    try {
      await page.setViewportSize({ width: 390, height: 760 });
      await page.goto('/ko', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle');

      const toggle = page.locator('header .mobile-toggle').first();
      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveAttribute('aria-label', '메뉴 열기');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(toggle).toHaveAttribute('aria-controls', 'public-mobile-nav-drawer');
      await toggle.focus();
      await expect(toggle).toBeFocused();
      await toggle.press('Enter');

      const dialog = page.getByRole('dialog', { name: '모바일 메뉴' });
      await expect(dialog).toBeVisible();
      await expect(toggle).toHaveAttribute('aria-label', '메뉴 닫기');
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      const closeButton = dialog.getByRole('button', { name: '닫기' });
      await expect(closeButton).toBeFocused();

      const firstLink = dialog.locator('.drawer-brand');
      const lastLink = dialog.locator('.drawer-footer .button');
      await lastLink.focus();
      await page.keyboard.press('Tab');
      await expect(firstLink).toBeFocused();
      await page.keyboard.press('Shift+Tab');
      await expect(lastLink).toBeFocused();

      await page.evaluate(() => {
        const probe = document.createElement('button');
        probe.type = 'button';
        probe.textContent = 'outside public mobile nav focus probe';
        probe.setAttribute('data-public-mobile-nav-focus-probe', 'true');
        document.body.appendChild(probe);
        probe.focus();
      });
      await expect(closeButton).toBeFocused();

      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(toggle).toHaveAttribute('aria-label', '메뉴 열기');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(toggle).toBeFocused();

      await toggle.press('Space');
      await expect(dialog).toBeVisible();
      await expect(closeButton).toBeFocused();
      await closeButton.click();
      await expect(dialog).toHaveCount(0);
      await expect(toggle).toBeFocused();
    } finally {
      await page.evaluate(() => {
        window.localStorage.removeItem('hojeong-ai-chat-collapsed');
        window.localStorage.removeItem('hojeong-year-end-event-hide-until');
      }).catch(() => undefined);
    }
  });

  test('traps focus in the public year-end event popup', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('hojeong-ai-chat-collapsed', 'true');
      window.localStorage.removeItem('hojeong-year-end-event-hide-until');
    });

    try {
      await page.goto('/ko', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle');

      const dialog = page.getByRole('dialog', { name: '2026년 기념 리뷰 이벤트' });
      await expect(dialog).toBeVisible();
      const closeButton = dialog.getByRole('button', { name: '닫기' });
      const hideButton = dialog.getByRole('button', { name: '오늘 하루 보지 않기' });
      await expect(closeButton).toBeFocused();

      await page.keyboard.press('Shift+Tab');
      await expect(hideButton).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(closeButton).toBeFocused();

      await page.evaluate(() => {
        const probe = document.createElement('button');
        probe.type = 'button';
        probe.textContent = 'outside year-end popup focus probe';
        probe.setAttribute('data-year-end-popup-focus-probe', 'true');
        document.body.appendChild(probe);
        probe.focus();
      });
      await expect(closeButton).toBeFocused();

      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
    } finally {
      await page.evaluate(() => {
        window.localStorage.removeItem('hojeong-ai-chat-collapsed');
        window.localStorage.removeItem('hojeong-year-end-event-hide-until');
      }).catch(() => undefined);
    }
  });

  test('navigates published inline site-search results from keyboard', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-site-search-${token}`;
    let pageId: string | null = null;

    try {
      await page.route('**/api/search?**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            hits: [
              {
                id: `search-hit-1-${token}`,
                kind: 'page',
                title: '기업법무 상담',
                url: '/ko/services/corporate',
                summary: '계약 검토와 기업 자문',
              },
              {
                id: `search-hit-2-${token}`,
                kind: 'faq',
                title: '법무 상담 비용',
                url: '/ko/pricing',
                summary: '상담 비용 안내',
              },
            ],
          }),
        });
      });

      pageId = await createBuilderPage(
        page.request,
        slug,
        `Published Site Search ${token}`,
        makePublishedSiteSearchDocument(token),
      );

      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish`, {
        headers: mutationHeaders(slug),
        data: {},
      });
      const publishPayload = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
      expect(publishResponse.status(), JSON.stringify(publishPayload)).toBe(200);
      expect(publishPayload.ok, publishPayload.error).toBe(true);

      await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle');

      const form = page.locator(`[data-node-id="published-site-search-${token}"] [data-builder-site-search="true"]`);
      const input = form.getByRole('searchbox', { name: '사이트 검색어' });
      const results = form.locator('[data-builder-site-search-results="true"]');
      await expect(input).toHaveAttribute('aria-expanded', 'false');

      await input.fill('법무');
      const firstOption = form.getByRole('option', { name: /기업법무 상담/ });
      const secondOption = form.getByRole('option', { name: /법무 상담 비용/ });
      await expect(firstOption).toBeVisible();
      await expect(secondOption).toBeVisible();
      await expect(input).toHaveAttribute('aria-expanded', 'true');

      await input.press('ArrowDown');
      await expect(firstOption).toBeFocused();
      await page.keyboard.press('ArrowDown');
      await expect(secondOption).toBeFocused();
      await page.keyboard.press('ArrowUp');
      await expect(firstOption).toBeFocused();
      await page.keyboard.press('End');
      await expect(secondOption).toBeFocused();
      await page.keyboard.press('Home');
      await expect(firstOption).toBeFocused();

      await page.keyboard.press('Escape');
      await expect(results).toBeHidden();
      await expect(input).toBeFocused();
      await expect(input).toHaveAttribute('aria-expanded', 'false');
      await expect(input).not.toHaveAttribute('aria-activedescendant', /.*/);
    } finally {
      await page.unroute('**/api/search?**').catch(() => undefined);
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
    }
  });

  test('opens the published menu bar dropdown and mobile menu from keyboard', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-menu-bar-${token}`;
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(
        page.request,
        slug,
        `Published Menu Bar ${token}`,
        makePublishedMenuBarDocument(token),
      );

      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish`, {
        headers: mutationHeaders(slug),
        data: {},
      });
      const publishPayload = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
      expect(publishResponse.status(), JSON.stringify(publishPayload)).toBe(200);
      expect(publishPayload.ok, publishPayload.error).toBe(true);

      await page.setViewportSize({ width: 1024, height: 760 });
      await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle');

      const widget = page.locator(`[data-node-id="published-menu-bar-${token}"] [data-builder-nav-widget="menu-bar"]`);
      await expect(widget).toBeVisible();
      const servicesLink = widget.getByRole('link', { name: '서비스' });
      await servicesLink.focus();
      await expect(servicesLink).toBeFocused();
      const dropdown = widget.locator('.builder-nav-menu-dropdown');
      await expect(dropdown).toBeVisible();
      await expect(servicesLink).toHaveAttribute('aria-expanded', 'true');
      await servicesLink.press('ArrowDown');
      await expect(widget.getByRole('link', { name: '기업법무' })).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(dropdown).toHaveCount(0);
      await expect(servicesLink).toBeFocused();
      await expect(servicesLink).toHaveAttribute('aria-expanded', 'false');

      await page.setViewportSize({ width: 390, height: 760 });
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle');

      const mobileWidget = page.locator(`[data-node-id="published-menu-bar-${token}"] [data-builder-nav-widget="menu-bar"]`);
      const hamburger = mobileWidget.getByRole('button', { name: 'open menu' });
      const mobilePanel = mobileWidget.locator('[data-builder-menu-mobile-panel="true"]');
      await expect(hamburger).toBeVisible();
      await expect(mobilePanel).toHaveAttribute('data-builder-menu-mobile-open', 'false');
      await hamburger.focus();
      await hamburger.press('Enter');
      await expect(mobilePanel).toHaveAttribute('data-builder-menu-mobile-open', 'true');
      const mobileServicesLink = mobileWidget.getByRole('link', { name: '서비스' });
      await expect(mobileServicesLink).toBeFocused();
      await mobileServicesLink.press('ArrowDown');
      await expect(mobileWidget.getByRole('link', { name: '기업법무' })).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(mobileServicesLink).toBeFocused();
      await expect(mobileWidget.locator('.builder-nav-menu-dropdown')).toHaveCount(0);
      await page.keyboard.press('Escape');
      await expect(mobilePanel).toHaveAttribute('data-builder-menu-mobile-open', 'false');
      await expect(hamburger).toBeFocused();
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
    }
  });

  test('keeps services and FAQ sections interactive after publish', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-published-interactions-${token}`;
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(
        page.request,
        slug,
        `Published Interactions ${token}`,
        makePublishedInteractionDocument(token),
      );

      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish`, {
        headers: mutationHeaders(slug),
        data: {},
      });
      expect(publishResponse.status()).toBe(200);

      const htmlResponse = await page.request.get(`/ko/${slug}`);
      expect(htmlResponse.status()).toBe(200);
      const html = await htmlResponse.text();
      expect(html).toContain('home-services-card-0');
      expect(html).toContain('home-faq-item-0');

      await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });

      const service0 = page.locator('[data-node-id="home-services-card-0"]').first();
      const service1 = page.locator('[data-node-id="home-services-card-1"]').first();
      const service0Toggle = service0.locator('.services-detail-toggle');
      const service0Body = service0.locator('.services-detail-body');
      const service1Toggle = service1.locator('.services-detail-toggle');
      const service1Body = service1.locator('.services-detail-body');
      await expect(service0Toggle).toHaveAttribute('role', 'button');
      await expect(service0Toggle).toHaveAttribute('tabindex', '0');
      await expect(service0Toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(service0Toggle).toHaveAttribute('aria-controls', await service0Body.getAttribute('id') ?? '');
      await expect(service0Body).not.toHaveClass(/is-open/);
      await expect(service0Body).toHaveAttribute('aria-hidden', 'true');
      await service0Toggle.focus();
      await service0Toggle.press('Enter');
      await expect(service0Body).toHaveClass(/is-open/);
      await expect(service0Body).toHaveAttribute('aria-hidden', 'false');
      await expect(service0Toggle).toHaveAttribute('aria-expanded', 'true');
      await service1Toggle.focus();
      await service1Toggle.press('Space');
      await expect(service1Body).toHaveClass(/is-open/);
      await expect(service1Body).toHaveAttribute('aria-hidden', 'false');
      await expect(service0Body).not.toHaveClass(/is-open/);
      await expect(service0Body).toHaveAttribute('aria-hidden', 'true');

      const faq = page.locator('[data-node-id="home-faq-item-0"]').first();
      const faqQuestion = faq.locator('.faq-question');
      const faqAnswer = faq.locator('.faq-answer-wrap');
      await expect(faqQuestion).toHaveAttribute('role', 'button');
      await expect(faqQuestion).toHaveAttribute('tabindex', '0');
      await expect(faqQuestion).toHaveAttribute('aria-controls', await faqAnswer.getAttribute('id') ?? '');
      await expect(faqAnswer).not.toHaveClass(/is-open/);
      await expect(faqAnswer).toHaveAttribute('aria-hidden', 'true');
      await faqQuestion.focus();
      await faqQuestion.press('Enter');
      await expect(faqAnswer).toHaveClass(/is-open/);
      await expect(faqAnswer).toHaveAttribute('aria-hidden', 'false');
      await expect(faqQuestion).toHaveAttribute('aria-expanded', 'true');
      await faqQuestion.press('Space');
      await expect(faqAnswer).not.toHaveClass(/is-open/);
      await expect(faqAnswer).toHaveAttribute('aria-hidden', 'true');

      const lightboxTrigger = page.locator(`[data-node-id="published-lightbox-image-${token}"] .builder-media-click-frame`);
      await expect(lightboxTrigger).toBeVisible();
      await lightboxTrigger.click();
      const lightboxDialog = page.getByRole('dialog', { name: `Published lightbox image ${token}` });
      await expect(lightboxDialog).toBeVisible();
      const lightboxClose = lightboxDialog.getByRole('button', { name: 'Close lightbox' });
      await expect(lightboxClose).toBeFocused();
      await lightboxDialog.locator('.builder-media-modal-image').click();
      await expect(lightboxDialog).toBeVisible();
      await page.evaluate(() => {
        const probe = document.createElement('button');
        probe.type = 'button';
        probe.dataset.publishedMediaOutsideFocusProbe = 'lightbox';
        probe.textContent = 'outside media focus probe';
        document.body.appendChild(probe);
        probe.focus();
      });
      await expect(lightboxClose).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(lightboxDialog).toHaveCount(0);
      await expect(lightboxTrigger).toBeFocused();

      const popupTrigger = page.locator(`[data-node-id="published-popup-image-${token}"] .builder-media-click-frame`);
      await expect(popupTrigger).toBeVisible();
      await popupTrigger.click();
      const popupDialog = page.getByRole('dialog', { name: `Published popup image ${token} popup` });
      await expect(popupDialog).toBeVisible();
      const popupClose = popupDialog.getByRole('button', { name: 'Close popup' });
      await expect(popupClose).toBeFocused();
      await page.evaluate(() => {
        const probe = document.createElement('button');
        probe.type = 'button';
        probe.dataset.publishedMediaOutsideFocusProbe = 'popup';
        probe.textContent = 'outside popup focus probe';
        document.body.appendChild(probe);
        probe.focus();
      });
      await expect(popupClose).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(popupDialog).toHaveCount(0);
      await expect(popupTrigger).toBeFocused();
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
    }
  });
});
