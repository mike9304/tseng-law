import { expect, test, type Page, type Locator, type APIRequestContext } from '@playwright/test';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import {
  createFixtureDocument,
  resolveFixturePath,
  validateFixtureDocument,
} from '../support/fixture-document';
import { JOURNEY_ENTRIES, type JourneyId } from '../support/journey-manifest';
import {
  makePlaywrightPointerPort,
  realClick,
  runReadinessGate,
} from '../support/real-pointer';

function entry(id: JourneyId) {
  const found = JOURNEY_ENTRIES.find((e) => e.id === id);
  if (!found) throw new Error(`Journey entry not found: ${id}`);
  return found;
}

const REPO_ROOT = path.resolve(__dirname, '../../../..');

function isContained(parent: string, child: string): boolean {
  const relative = path.relative(parent, child);
  return (
    relative !== '' &&
    relative !== '..' &&
    !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative)
  );
}

function assertQaFixture() {
  const isolationRootEnv = process.env.BUILDER_QA_ISOLATION_ROOT;
  const runtimeDataRootEnv = process.env.BUILDER_RUNTIME_DATA_ROOT;
  const siteRootEnv = process.env.BUILDER_SITE_ROOT;
  if (!isolationRootEnv) throw new Error('BUILDER_QA_ISOLATION_ROOT required');
  if (!runtimeDataRootEnv) throw new Error('BUILDER_RUNTIME_DATA_ROOT required');
  if (!siteRootEnv) throw new Error('BUILDER_SITE_ROOT required');

  const isolationRoot = path.resolve(isolationRootEnv);
  const runtimeDataRoot = path.resolve(runtimeDataRootEnv);
  const siteRoot = path.resolve(siteRootEnv);

  const fixture = validateFixtureDocument(
    createFixtureDocument({
      isolationRoot,
      ownershipToken: 'wb-r07-j16-j20-fixture',
    }),
  );

  if (!isContained(isolationRoot, runtimeDataRoot)) {
    throw new Error('BUILDER_RUNTIME_DATA_ROOT must be contained within isolation root');
  }
  if (!isContained(isolationRoot, siteRoot)) {
    throw new Error('BUILDER_SITE_ROOT must be contained within isolation root');
  }

  resolveFixturePath(fixture, path.relative(isolationRoot, runtimeDataRoot));
  resolveFixturePath(fixture, path.relative(isolationRoot, siteRoot));

  const canonicalRuntime = path.resolve(REPO_ROOT, 'runtime-data');
  if (
    isolationRoot === canonicalRuntime ||
    isContained(canonicalRuntime, isolationRoot) ||
    isContained(isolationRoot, canonicalRuntime)
  ) {
    throw new Error(
      'repo canonical runtime-data must not be equal/ancestor of isolation root',
    );
  }

  return fixture;
}

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => {
    errors.push(err.message);
  });
  return errors;
}

async function routeExternalFonts(page: Page): Promise<void> {
  await page.route('https://fonts.googleapis.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/css', body: '' }),
  );
  await page.route('https://fonts.gstatic.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'font/woff2', body: '' }),
  );
}

async function openBuilder(page: Page, relative: string) {
  await page.goto(relative, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
  const shell = page.locator('[data-editor-shell]');
  await expect(shell).toBeVisible();
  await expect(shell).toHaveAttribute('data-editor-ready', 'true');
}

async function observeTopHit(
  page: Page,
  locator: Locator,
  id: JourneyId,
  selector: string,
) {
  const { evidence } = await runReadinessGate(makePlaywrightPointerPort(page, locator), {
    journeyId: id,
    action: 'click',
    target: { selector },
  });
  expect(evidence.reason).toBe('ok');
  expect(evidence.journeyId).toBe(id);
  expect(evidence.timestampUtc).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/u);
  return evidence.point;
}

async function readScrollRoot(page: Page): Promise<{ top: number; left: number }> {
  return page.locator('[data-builder-canvas-scroll-root="true"]').evaluate((el) => ({
    top: el.scrollTop,
    left: el.scrollLeft,
  }));
}

async function prepareRealPointerTarget(locator: Locator): Promise<void> {
  await locator.scrollIntoViewIfNeeded();
  await expect(locator).toBeVisible();
  await expect(locator).toBeInViewport({ ratio: 0.98 });
}

test.beforeEach(async ({ page }) => {
  await routeExternalFonts(page);
});

test(entry('J16').line, async ({ page }) => {
  assertQaFixture();
  const errors = collectErrors(page);

  await openBuilder(page, '/ko/admin-builder?wbR07=J16');

  const scrollRoot = page.locator('[data-builder-canvas-scroll-root="true"]');
  await expect(scrollRoot).toBeVisible();
  const scrollPoint = await observeTopHit(
    page,
    scrollRoot,
    'J16',
    '[data-builder-canvas-scroll-root="true"]',
  );
  await page.mouse.move(scrollPoint.x, scrollPoint.y);
  await page.mouse.wheel(0, 8);
  await expect.poll(async () => (await readScrollRoot(page)).top).toBeGreaterThan(0);

  const searchButton = page
    .locator('.builder-site-header [data-builder-header-action="search"]')
    .first();
  await prepareRealPointerTarget(searchButton);

  const before = await readScrollRoot(page);
  expect(before.top).toBeGreaterThan(0);

  await realClick(page, searchButton, {
    journeyId: 'J16',
    target: { selector: '.builder-site-header [data-builder-header-action="search"]' },
  });

  const overlay = page.locator('.search-overlay[data-open="true"]');
  await expect(overlay).toHaveRole('dialog');
  await expect(overlay).toBeVisible();
  await observeTopHit(page, overlay, 'J16', '.search-overlay[data-open="true"]');

  const mid = await readScrollRoot(page);
  expect(mid).toEqual(before);

  const closeButton = page.locator('.search-overlay[data-open="true"] .icon-button');
  await realClick(page, closeButton, {
    journeyId: 'J16',
    target: { selector: '.search-overlay[data-open="true"] .icon-button' },
  });

  await expect(page.locator('.search-overlay[data-open="true"]')).toHaveCount(0);
  const after = await readScrollRoot(page);
  expect(after).toEqual(before);

  expect(errors).toEqual([]);
});

test(entry('J17').line, async ({ page }) => {
  assertQaFixture();
  const errors = collectErrors(page);

  await page.goto('/ko?wbR07=J17', { waitUntil: 'domcontentloaded' });

  const searchButtonSelector = '.header .header-search-btn';
  const searchButton = page.locator(searchButtonSelector).first();
  await realClick(page, searchButton, {
    journeyId: 'J17',
    target: { selector: searchButtonSelector },
  });

  const overlay = page.locator('.search-overlay[data-open="true"]');
  await expect(overlay).toBeVisible();
  await observeTopHit(page, overlay, 'J17', '.search-overlay[data-open="true"]');

  const closeButton = page.locator('.search-overlay[data-open="true"] .icon-button');
  await realClick(page, closeButton, {
    journeyId: 'J17',
    target: { selector: '.search-overlay[data-open="true"] .icon-button' },
  });

  await expect(page.locator('.search-overlay[data-open="true"]')).toHaveCount(0);

  expect(errors).toEqual([]);
});

test(entry('J18').line, async ({ page }) => {
  assertQaFixture();
  const errors = collectErrors(page);

  await page.goto('/ko/about?wbR07=J18', { waitUntil: 'domcontentloaded' });

  const dialog = page.locator('.floating-ai-chat');
  await expect(dialog).toHaveCount(0);

  const launcher = page.locator('.quick-contact-toggle');
  await expect(launcher).toBeVisible();

  const ctaSelector = 'header.header .header-actions > .nav-cta:visible';
  const cta = page.locator(ctaSelector).first();
  await expect(cta).toBeVisible();
  await observeTopHit(page, cta, 'J18', ctaSelector);

  await realClick(page, launcher, {
    journeyId: 'J18',
    target: { selector: '.quick-contact-toggle' },
  });
  await expect(dialog).toBeVisible();
  await observeTopHit(page, dialog, 'J18', '.floating-ai-chat');

  const close = page.locator('.floating-ai-chat-close');
  await realClick(page, close, {
    journeyId: 'J18',
    target: { selector: '.floating-ai-chat-close' },
  });

  await expect(dialog).toHaveCount(0);
  await expect(launcher).toBeVisible();

  expect(errors).toEqual([]);
});

const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 760;
const FEATURE_IMAGE_SRC =
  '/images/blog/001-taiwan-company-establishment-basics/featured-01.jpg';
const PUBLISH_PAGES_ENDPOINT = '/api/builder/site/pages';

type TestDocument = {
  readonly version: 1;
  readonly locale: 'ko';
  readonly updatedAt: string;
  readonly updatedBy: string;
  readonly stageWidth: number;
  readonly stageHeight: number;
  readonly nodes: readonly Record<string, unknown>[];
};

type CreatePagePayload = {
  readonly success?: boolean;
  readonly pageId?: string;
  readonly error?: string;
};

interface PublishFixtureCreated {
  pageId: string;
  slug: string;
  title: string;
  imageAlt: string;
  imageNodeId: string;
  ctaNodeId: string;
  ctaLabel: string;
  ctaHref: string;
}

interface PublishNetworkEvidence {
  method: string;
  pathname: string;
  status: number;
  publicHref: string;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sanitizeForwardedFor(scope: string): string {
  const safe = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'wb-r07-publish';
  return `pw-${safe}`;
}

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

function buildKoPublishDocument(opts: {
  token: string;
  title: string;
  imageAlt: string;
  ctaLabel: string;
  ctaHref: string;
  updatedBy: string;
}): { document: TestDocument; imageNodeId: string; ctaNodeId: string } {
  const rootId = `root-${opts.token}`;
  const titleId = `title-${opts.token}`;
  const imageId = `image-${opts.token}`;
  const buttonId = `button-${opts.token}`;

  const doc: TestDocument = {
    version: 1,
    locale: 'ko',
    updatedAt: new Date().toISOString(),
    updatedBy: opts.updatedBy,
    stageWidth: STAGE_WIDTH,
    stageHeight: STAGE_HEIGHT,
    nodes: [
      {
        id: rootId,
        kind: 'container',
        rect: { x: 0, y: 0, width: STAGE_WIDTH, height: STAGE_HEIGHT },
        style: { ...baseStyle },
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: `WB-R07 publish root ${opts.token}`,
          background: '#fff',
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
        id: titleId,
        parentId: rootId,
        kind: 'text',
        rect: { x: 80, y: 72, width: 1120, height: 120 },
        style: { ...baseStyle },
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: opts.title,
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
        id: imageId,
        parentId: rootId,
        kind: 'image',
        rect: { x: 80, y: 240, width: 1120, height: 360 },
        style: { ...baseStyle },
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          src: FEATURE_IMAGE_SRC,
          alt: opts.imageAlt,
          fit: 'cover',
        },
      },
      {
        id: buttonId,
        parentId: rootId,
        kind: 'button',
        rect: { x: 80, y: 640, width: 260, height: 64 },
        style: { ...baseStyle },
        zIndex: 3,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: opts.ctaLabel,
          href: opts.ctaHref,
          style: 'primary-solid',
          as: 'a',
        },
      },
    ],
  };

  return { document: doc, imageNodeId: imageId, ctaNodeId: buttonId };
}

async function createPublishFixture(
  request: APIRequestContext,
  token: string,
  journeyId: 'J19' | 'J20',
): Promise<PublishFixtureCreated> {
  const slug = token.toLowerCase();
  const title = `${journeyId} 발행 픽스처 ${token}`;
  const imageAlt = `${journeyId} 히어로 이미지 ${token}`;
  const ctaLabel = `${journeyId} 문의하기 ${token}`;
  const ctaHref = `/ko/contact?wbR07=${token}`;
  const updatedBy = `wb-r07-${journeyId.toLowerCase()}-${token}`;
  const built = buildKoPublishDocument({
    token,
    title,
    imageAlt,
    ctaLabel,
    ctaHref,
    updatedBy,
  });

  const response = await request.post(PUBLISH_PAGES_ENDPOINT, {
    headers: {
      'x-forwarded-for': sanitizeForwardedFor(`${journeyId}-${token}`),
    },
    data: {
      locale: 'ko',
      slug,
      title,
      addToNavigation: false,
      document: built.document,
    },
  });

  expect(response.status()).toBe(200);
  const payload: CreatePagePayload = await response.json();
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  if (!payload.pageId) {
    throw new Error('Expected created page id');
  }

  return {
    pageId: payload.pageId,
    slug,
    title,
    imageAlt,
    imageNodeId: built.imageNodeId,
    ctaNodeId: built.ctaNodeId,
    ctaLabel,
    ctaHref,
  };
}

async function deletePublishFixture(
  request: APIRequestContext,
  pageId: string,
  scope: string,
): Promise<void> {
  await request.delete(
    `${PUBLISH_PAGES_ENDPOINT}/${encodeURIComponent(pageId)}?locale=ko`,
    {
      headers: { 'x-forwarded-for': sanitizeForwardedFor(scope) },
      failOnStatusCode: false,
    },
  );
}

async function acknowledgePublishReview(
  page: Page,
  dialog: Locator,
  id: JourneyId,
): Promise<void> {
  const translationAck = dialog.locator(
    '[data-builder-publish-site-translation-acknowledge="true"]',
  );
  if (await translationAck.first().isVisible()) {
    const translationAckButton = translationAck.first();
    await prepareRealPointerTarget(translationAckButton);
    await realClick(page, translationAckButton, {
      journeyId: id,
      target: {
        selector: '[data-builder-publish-site-translation-acknowledge="true"]',
      },
    });
    const translationReviewed = dialog.locator(
      '[data-builder-publish-site-translation-review="true"]',
    );
    await expect(translationReviewed.first()).toHaveAttribute(
      'data-builder-publish-site-translation-acknowledged',
      'true',
    );
  }

  const warningOverride = dialog.getByRole('button', {
    name: /^(경고 무시하고 발행|Publish anyway)$/,
  });
  if (await warningOverride.first().isVisible()) {
    const warningOverrideButton = warningOverride.first();
    await prepareRealPointerTarget(warningOverrideButton);
    await realClick(page, warningOverrideButton, {
      journeyId: id,
      target: { selector: 'button' },
    });
    const overrideReviewed = dialog.locator(
      '[data-builder-publish-warning-override-review]',
    );
    await expect(overrideReviewed.first()).toHaveAttribute(
      'data-builder-publish-warning-override-review',
      'acknowledged',
    );
  }
}

async function publishFixtureViaUi(
  page: Page,
  created: PublishFixtureCreated,
  id: JourneyId,
): Promise<PublishNetworkEvidence> {
  const encodedPageId = encodeURIComponent(created.pageId);
  await openBuilder(
    page,
    `/ko/admin-builder?pageId=${encodedPageId}&wbR07=${id}`,
  );

  const topPublishSelector = '[title="현재 페이지 발행"]';
  const topPublishButton = page.locator(topPublishSelector).first();
  await realClick(page, topPublishButton, {
    journeyId: id,
    target: { selector: topPublishSelector },
  });

  const dialog = page.getByRole('dialog', { name: /(페이지 발행|Publish Page)/ });
  await expect(dialog).toBeVisible();

  const preflight = dialog.locator('[data-builder-publish-preflight-item]').first();
  await expect(preflight).toBeVisible();

  await observeTopHit(page, dialog, id, '[role="dialog"]');

  await acknowledgePublishReview(page, dialog, id);

  const publishEndpoint = `${PUBLISH_PAGES_ENDPOINT}/${encodedPageId}/publish`;
  const finalButtonSelector = 'button[data-enabled="true"]';
  const finalButton = dialog.locator(finalButtonSelector).last();
  await prepareRealPointerTarget(finalButton);
  await expect(finalButton).toBeEnabled();

  const [publishResponse] = await Promise.all([
    page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        let url: URL;
        try {
          url = new URL(response.url());
        } catch {
          return false;
        }
        return url.pathname === publishEndpoint;
      },
      { timeout: 60_000 },
    ),
    realClick(page, finalButton, {
      journeyId: id,
      target: { selector: finalButtonSelector },
    }),
  ]);
  const publishUrl = new URL(publishResponse.url());
  const pageOrigin = new URL(page.url()).origin;

  expect(publishResponse.request().method()).toBe('POST');
  expect(publishResponse.status()).toBe(200);
  expect(publishUrl.origin).toBe(pageOrigin);
  expect(publishUrl.pathname).toBe(publishEndpoint);

  await expect(dialog.getByText('발행 완료!')).toBeVisible();
  const successLink = dialog.getByRole('link', {
    name: new RegExp(escapeRegex(`/ko/${created.slug}`)),
  });
  await expect(successLink).toBeVisible();
  const publicHref = await successLink.getAttribute('href');
  expect(publicHref).toBe(`/ko/${created.slug}`);

  return {
    method: publishResponse.request().method(),
    pathname: publishUrl.pathname,
    status: publishResponse.status(),
    publicHref: publicHref ?? '',
  };
}

test(entry('J19').line, async ({ page, request }) => {
  assertQaFixture();
  const errors = collectErrors(page);
  const token = `j19-${Date.now().toString(36)}-${randomUUID().slice(0, 8)}`;

  const created = await createPublishFixture(request, token, 'J19');
  try {
    const evidence = await publishFixtureViaUi(page, created, 'J19');
    expect(evidence).toMatchObject({
      method: 'POST',
      status: 200,
    });
    expect(evidence.pathname).toBe(
      `${PUBLISH_PAGES_ENDPOINT}/${encodeURIComponent(created.pageId)}/publish`,
    );
    expect(evidence.publicHref).toBe(`/ko/${created.slug}`);
    expect(errors).toEqual([]);
  } finally {
    await deletePublishFixture(request, created.pageId, `j19-cleanup-${token}`);
  }
});

test(entry('J20').line, async ({ page, request }) => {
  assertQaFixture();
  const errors = collectErrors(page);
  const token = `j20-${Date.now().toString(36)}-${randomUUID().slice(0, 8)}`;

  const created = await createPublishFixture(request, token, 'J20');
  try {
    const evidence = await publishFixtureViaUi(page, created, 'J20');
    expect(evidence).toMatchObject({ method: 'POST', status: 200 });
    expect(evidence.publicHref).toBe(`/ko/${created.slug}`);

    await page.goto(`${evidence.publicHref}?publishedJourney=J20`, {
      waitUntil: 'domcontentloaded',
    });

    const publishedMarker = page.locator('[data-builder-published-page="true"]');
    await expect(publishedMarker).toHaveCount(1);

    await expect(page.getByText(created.title)).toBeVisible();

    const imageSelector = `[data-node-id="${created.imageNodeId}"] img`;
    const image = page.locator(imageSelector);
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute('alt', created.imageAlt);
    const imageLoaded = await image.evaluate((img) => {
      const el = img as HTMLImageElement;
      return el.complete && el.naturalWidth > 0;
    });
    expect(imageLoaded).toBe(true);

    const ctaSelector = `[data-node-id="${created.ctaNodeId}"] a`;
    const cta = page.locator(ctaSelector);
    await expect(cta).toBeVisible();
    await expect(cta).toHaveText(created.ctaLabel);
    await prepareRealPointerTarget(cta);

    const localOrigin = new URL(page.url()).origin;
    await Promise.all([
      page.waitForURL(
        (url) =>
          url.origin === localOrigin &&
          url.pathname === '/ko/contact' &&
          url.searchParams.get('wbR07') === token,
        { timeout: 60_000 },
      ),
      realClick(page, cta, {
        journeyId: 'J20',
        target: { selector: ctaSelector },
      }),
    ]);

    const finalUrl = new URL(page.url());
    expect(finalUrl.pathname).toBe('/ko/contact');
    expect(finalUrl.searchParams.get('wbR07')).toBe(token);
    expect(errors).toEqual([]);
  } finally {
    await deletePublishFixture(request, created.pageId, `j20-cleanup-${token}`);
  }
});
