#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REVEAL_WAIT_MS = 800;
const TAB_LIMIT = 60;
const CINEMATIC_SEEN_KEY = 'hojeong.cinematic.seen';

const CONTEXT_LOCALES = {
  ko: 'ko-KR',
  en: 'en-US',
  ja: 'ja-JP',
  'zh-hant': 'zh-TW',
};

export const DESIGN_REVIEW_STATES = Object.freeze([
  Object.freeze({
    id: 'home-ko-390-body',
    route: '/ko',
    locale: 'ko',
    viewport: Object.freeze({ width: 390, height: 844 }),
    capture: 'viewport',
  }),
  Object.freeze({
    id: 'home-ko-1440-body',
    route: '/ko',
    locale: 'ko',
    viewport: Object.freeze({ width: 1440, height: 1000 }),
    capture: 'viewport',
  }),
  Object.freeze({
    id: 'home-en-390-body',
    route: '/en',
    locale: 'en',
    viewport: Object.freeze({ width: 390, height: 844 }),
    capture: 'viewport',
  }),
  Object.freeze({
    id: 'home-en-1440-body',
    route: '/en',
    locale: 'en',
    viewport: Object.freeze({ width: 1440, height: 1000 }),
    capture: 'viewport',
  }),
  Object.freeze({
    id: 'home-ja-390-body',
    route: '/ja',
    locale: 'ja',
    viewport: Object.freeze({ width: 390, height: 844 }),
    capture: 'viewport',
  }),
  Object.freeze({
    id: 'home-ja-1440-body',
    route: '/ja',
    locale: 'ja',
    viewport: Object.freeze({ width: 1440, height: 1000 }),
    capture: 'viewport',
  }),
  Object.freeze({
    id: 'home-zh-hant-390-body',
    route: '/zh-hant',
    locale: 'zh-hant',
    viewport: Object.freeze({ width: 390, height: 844 }),
    capture: 'viewport',
  }),
  Object.freeze({
    id: 'home-zh-hant-1440-body',
    route: '/zh-hant',
    locale: 'zh-hant',
    viewport: Object.freeze({ width: 1440, height: 1000 }),
    capture: 'viewport',
  }),
  Object.freeze({
    id: 'journey-en-390-services',
    route: '/en/services',
    locale: 'en',
    viewport: Object.freeze({ width: 390, height: 844 }),
    capture: 'viewport',
  }),
  Object.freeze({
    id: 'journey-en-390-profile',
    route: '/en/lawyers/wei-tseng',
    locale: 'en',
    viewport: Object.freeze({ width: 390, height: 844 }),
    capture: 'viewport',
  }),
  Object.freeze({
    id: 'journey-en-390-pricing',
    route: '/en/pricing',
    locale: 'en',
    viewport: Object.freeze({ width: 390, height: 844 }),
    capture: 'viewport',
  }),
  Object.freeze({
    id: 'journey-en-390-contact',
    route: '/en/contact',
    locale: 'en',
    viewport: Object.freeze({ width: 390, height: 844 }),
    capture: 'viewport',
  }),
  Object.freeze({
    id: 'representative-en-390-article',
    route: '/en/columns/taiwan-labor-severance-law',
    locale: 'en',
    viewport: Object.freeze({ width: 390, height: 1000 }),
    capture: 'viewport',
  }),
  Object.freeze({
    id: 'representative-en-390-search',
    route: '/en/search',
    locale: 'en',
    viewport: Object.freeze({ width: 390, height: 1000 }),
    capture: 'viewport',
  }),
  Object.freeze({
    id: 'representative-en-390-checkout',
    route: '/en/store/checkout',
    locale: 'en',
    viewport: Object.freeze({ width: 390, height: 1000 }),
    capture: 'viewport',
  }),
  Object.freeze({
    id: 'representative-ja-1440-services-menu',
    route: '/ja',
    locale: 'ja',
    viewport: Object.freeze({ width: 1440, height: 1000 }),
    capture: 'services-menu',
  }),
  Object.freeze({
    id: 'july-zh-hant-1024-office-0-detail',
    route: '/zh-hant',
    locale: 'zh-hant',
    viewport: Object.freeze({ width: 1024, height: 1000 }),
    capture: 'office-section',
    officeIndex: 0,
  }),
  Object.freeze({
    id: 'july-zh-hant-1024-office-1-detail',
    route: '/zh-hant',
    locale: 'zh-hant',
    viewport: Object.freeze({ width: 1024, height: 1000 }),
    capture: 'office-section',
    officeIndex: 1,
  }),
  Object.freeze({
    id: 'july-zh-hant-1024-office-2-detail',
    route: '/zh-hant',
    locale: 'zh-hant',
    viewport: Object.freeze({ width: 1024, height: 1000 }),
    capture: 'office-section',
    officeIndex: 2,
  }),
  Object.freeze({
    id: 'july-zh-hant-1024-office-3-detail',
    route: '/zh-hant',
    locale: 'zh-hant',
    viewport: Object.freeze({ width: 1024, height: 1000 }),
    capture: 'office-section',
    officeIndex: 3,
  }),
]);

const USAGE =
  'usage: node scripts/capture-design-review.mjs --base-url http://127.0.0.1:PORT --out DIR [--only id,id] [--dry-run]';

function takeValue(argv, index, flag) {
  const value = argv[index + 1];
  if (value == null || value.startsWith('--')) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

export function parseArgs(argv) {
  const options = {
    baseUrl: null,
    out: null,
    only: null,
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (arg === '--base-url') {
      options.baseUrl = takeValue(argv, i, arg);
      i += 1;
      continue;
    }
    if (arg.startsWith('--base-url=')) {
      options.baseUrl = arg.slice('--base-url='.length);
      continue;
    }
    if (arg === '--out') {
      options.out = takeValue(argv, i, arg);
      i += 1;
      continue;
    }
    if (arg.startsWith('--out=')) {
      options.out = arg.slice('--out='.length);
      continue;
    }
    if (arg === '--only') {
      options.only = takeValue(argv, i, arg)
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);
      i += 1;
      continue;
    }
    if (arg.startsWith('--only=')) {
      options.only = arg
        .slice('--only='.length)
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);
      continue;
    }
    throw new Error(`unknown argument: ${arg}`);
  }

  if (!options.baseUrl) throw new Error('--base-url is required');
  if (!options.out) throw new Error('--out is required');

  let parsed;
  try {
    parsed = new URL(options.baseUrl);
  } catch {
    throw new Error(`invalid --base-url: ${options.baseUrl}`);
  }
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) {
    throw new Error(`invalid --base-url: ${options.baseUrl}`);
  }
  options.baseUrl = parsed.origin;
  options.out = path.resolve(options.out);
  if (options.only && options.only.length === 0) {
    throw new Error('--only requires at least one id');
  }
  return options;
}

export function selectStates(states, only) {
  if (!only) return [...states];
  const byId = new Map(states.map((state) => [state.id, state]));
  return only.map((id) => {
    const state = byId.get(id);
    if (!state) throw new Error(`unknown state id: ${id}`);
    return state;
  });
}

export function classifyBlockedRequest(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) return null;

  const host = parsed.hostname.toLowerCase();
  const pathname = parsed.pathname.toLowerCase();
  const hostEnds = (suffix) => host === suffix || host.endsWith(`.${suffix}`);

  if (
    hostEnds('youtube.com') ||
    hostEnds('youtube-nocookie.com') ||
    hostEnds('youtu.be') ||
    hostEnds('ytimg.com') ||
    hostEnds('googlevideo.com') ||
    hostEnds('vimeo.com') ||
    hostEnds('vimeocdn.com')
  ) {
    return 'video';
  }

  if (
    hostEnds('maps.google.com') ||
    hostEnds('maps.gstatic.com') ||
    hostEnds('maps.googleapis.com') ||
    ((host === 'google.com' || hostEnds('google.com')) &&
      (pathname === '/maps' || pathname.startsWith('/maps/')))
  ) {
    return 'map';
  }

  return null;
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function dryRunReport(options, states) {
  return {
    dryRun: true,
    baseUrl: options.baseUrl,
    out: options.out,
    count: states.length,
    states: states.map((state) => ({
      id: state.id,
      route: state.route,
      locale: state.locale,
      viewport: { ...state.viewport },
      capture: state.capture,
      ...(state.officeIndex == null ? {} : { officeIndex: state.officeIndex }),
    })),
  };
}

async function waitForFontsAndReveal(page) {
  await page.evaluate(() => document.fonts.ready.then(() => true));
  await page.waitForTimeout(REVEAL_WAIT_MS);
}

async function dismissCinematicOpening(page) {
  const intro = page.locator('.cinematic-opening__scroll');
  if (await intro.isVisible().catch(() => false)) {
    await intro.click({ timeout: 8_000 });
    await page.locator('.cinematic-opening').waitFor({ state: 'hidden', timeout: 10_000 });
  }
}

async function openServicesMegaMenu(page) {
  const trigger = page.locator('.main-nav a[href="/ja/services"]');
  await trigger.waitFor({ state: 'attached', timeout: 10_000 });

  let focused = await trigger.evaluate((el) => document.activeElement === el);
  for (let step = 0; step < TAB_LIMIT && !focused; step += 1) {
    await page.keyboard.press('Tab');
    focused = await trigger.evaluate((el) => document.activeElement === el);
  }
  if (!focused) {
    throw new Error(
      'keyboard Tab did not reach 取扱業務 (.main-nav a[href="/ja/services"]) within 60 steps',
    );
  }

  const expanded = await trigger.getAttribute('aria-expanded');
  if (expanded !== 'true') {
    await page.keyboard.press('Enter');
  }

  await page.waitForFunction(() => {
    const el = document.querySelector('.main-nav a[href="/ja/services"]');
    return el?.getAttribute('aria-expanded') === 'true' && document.activeElement === el;
  }, null, { timeout: 5_000 });

  const controls = await trigger.getAttribute('aria-controls');
  const panel = page.locator(controls ? `#${controls}` : '#mega-panel-services');
  await panel.waitFor({ state: 'visible', timeout: 5_000 });

  const pathname = new URL(page.url()).pathname;
  if (pathname !== '/ja' && pathname !== '/ja/') {
    throw new Error(`services mega open navigated away to ${page.url()}`);
  }
}

async function officeRootLocator(page) {
  const july = page.locator(
    '.builder-pub-main[data-home-editorial="july"] [data-node-id="home-offices-root"]',
  );
  if ((await july.count()) === 1) return july;
  const generic = page.locator('[data-node-id="home-offices-root"]');
  if ((await generic.count()) < 1) {
    throw new Error('office section [data-node-id="home-offices-root"] not found on /zh-hant');
  }
  return generic.first();
}

async function selectOfficeTab(page, root, officeIndex) {
  const byId = root.locator(`[data-node-id="home-offices-tab-${officeIndex}"]`);
  const tab = (await byId.count()) > 0 ? byId.first() : root.locator('[role="tab"]').nth(officeIndex);
  await tab.scrollIntoViewIfNeeded();
  await tab.click({ timeout: 8_000 });
  await page.waitForFunction(
    (index) => {
      const rootEl = document.querySelector('[data-node-id="home-offices-root"]');
      if (!rootEl) return false;
      const named = rootEl.querySelector(`[data-node-id="home-offices-tab-${index}"]`);
      if (named) return named.getAttribute('aria-selected') === 'true';
      return rootEl.querySelectorAll('[role="tab"]')[index]?.getAttribute('aria-selected') === 'true';
    },
    officeIndex,
    { timeout: 8_000 },
  );
}

async function captureState(browser, options, state) {
  const blockedRequests = [];
  const consoleErrors = [];
  const context = await browser.newContext({
    viewport: { width: state.viewport.width, height: state.viewport.height },
    deviceScaleFactor: 1,
    locale: CONTEXT_LOCALES[state.locale] ?? state.locale,
    serviceWorkers: 'block',
  });

  await context.addInitScript((key) => {
    try {
      sessionStorage.setItem(key, '1');
    } catch {
      /* ignore */
    }
  }, CINEMATIC_SEEN_KEY);

  await context.route('**/*', (route) => {
    const request = route.request();
    const reason = classifyBlockedRequest(request.url());
    if (!reason) return route.continue();
    blockedRequests.push({
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType(),
      reason,
    });
    return route.abort('blockedbyclient');
  });

  const page = await context.newPage();
  page.setDefaultTimeout(15_000);
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push({ type: 'console', text: message.text() });
    }
  });
  page.on('pageerror', (error) => {
    consoleErrors.push({
      type: 'pageerror',
      text: error instanceof Error ? error.message : String(error),
    });
  });

  const target = `${options.baseUrl}${state.route}`;
  try {
    const response = await page.goto(target, { waitUntil: 'load', timeout: 45_000 });
    const status = response?.status() ?? 0;
    if (status && status >= 400) {
      throw new Error(`${state.id} HTTP ${status} for ${target}`);
    }

    await dismissCinematicOpening(page);
    await page.locator('main').first().waitFor({ state: 'visible', timeout: 15_000 });
    await page.evaluate(() => window.scrollTo(0, 0));

    if (state.capture === 'services-menu') {
      await openServicesMegaMenu(page);
      await waitForFontsAndReveal(page);
      await page.screenshot({
        path: path.join(options.out, `${state.id}.png`),
        fullPage: false,
        type: 'png',
        animations: 'allow',
        caret: 'initial',
      });
    } else if (state.capture === 'office-section') {
      const root = await officeRootLocator(page);
      await selectOfficeTab(page, root, state.officeIndex);
      await waitForFontsAndReveal(page);
      await root.screenshot({
        path: path.join(options.out, `${state.id}.png`),
        type: 'png',
        animations: 'allow',
        caret: 'initial',
      });
    } else {
      await waitForFontsAndReveal(page);
      await page.screenshot({
        path: path.join(options.out, `${state.id}.png`),
        fullPage: false,
        type: 'png',
        animations: 'allow',
        caret: 'initial',
      });
    }

    const pngPath = path.join(options.out, `${state.id}.png`);
    const bytes = await readFile(pngPath);
    const info = await stat(pngPath);
    return {
      id: state.id,
      route: state.route,
      viewport: { ...state.viewport },
      bytes: info.size,
      sha256: sha256(bytes),
      blockedRequests,
      consoleErrors,
    };
  } finally {
    await context.close();
  }
}

export async function run(argv, io = process) {
  const options = parseArgs(argv);
  const selected = selectStates(DESIGN_REVIEW_STATES, options.only);

  if (options.dryRun) {
    io.stdout.write(`${JSON.stringify(dryRunReport(options, selected), null, 2)}\n`);
    return 0;
  }

  await mkdir(options.out, { recursive: true });
  const { chromium } = await import('@playwright/test');
  const browser = await chromium.launch({ headless: true });
  const states = [];
  try {
    for (const state of selected) {
      io.stderr.write(`capture ${state.id} ${state.route} ${state.viewport.width}x${state.viewport.height}\n`);
      states.push(await captureState(browser, options, state));
    }
  } finally {
    await browser.close();
  }

  const index = {
    baseUrl: options.baseUrl,
    out: options.out,
    capturedAt: new Date().toISOString(),
    count: states.length,
    states,
  };
  await writeFile(path.join(options.out, 'index.json'), `${JSON.stringify(index, null, 2)}\n`);
  io.stdout.write(`${JSON.stringify(index, null, 2)}\n`);
  return 0;
}

const isDirect =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirect) {
  run(process.argv.slice(2)).then(
    (code) => {
      process.exitCode = code;
    },
    (error) => {
      process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n${USAGE}\n`);
      process.exitCode = 1;
    },
  );
}
