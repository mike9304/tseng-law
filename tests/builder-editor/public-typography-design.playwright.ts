import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Focused public typography + design-system regression.
 * Asserts: semantic font tokens active, no Times body fallback, locale families,
 * closed serif allowlist (every visible H2/H3 sans), about composite-flow geometry.
 */

const EVIDENCE_DIR = path.join(
  process.cwd(),
  '.omo',
  'evidence',
  'typography-20260722',
);

type Rect = {
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
  height: number;
};

type HeadingSample = {
  readonly tag: string;
  readonly className: string;
  readonly text: string;
  readonly fontFamily: string;
};

type FontProbe = {
  readonly tokens: {
    body: string;
    heading: string;
    display: string;
    mono: string;
    sansKrLoaded: string;
    sansTcLoaded: string;
    serifKrLoaded: string;
    serifTcLoaded: string;
  };
  readonly bodyFamily: string;
  readonly sampleFamilies: Record<string, string>;
  readonly serifRoles: Record<string, string>;
  readonly sansRoles: Record<string, string>;
  /** Every visible public h2/h3 with computed family — full enumeration, not first-only. */
  readonly visibleH2H3: readonly HeadingSample[];
  readonly serifH2H3: readonly HeadingSample[];
  readonly documentOverflowX: number;
  readonly sectionPaddingTop: number | null;
  readonly about?: {
    readonly builderDomPresent: boolean;
    readonly root: Rect | null;
    readonly composite: Rect | null;
    readonly lastSection: Rect | null;
    readonly builderMain: Rect | null;
    readonly footer: Rect | null;
    readonly rootHeight: number | null;
    readonly compositeHeight: number | null;
    readonly lastSectionOverlapsFooter: boolean;
    readonly rootCollapsed: boolean;
  };
};

function ensureEvidenceDir(): void {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

async function settlePublicPage(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await document.fonts?.ready;
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
  });
}

async function probeTypography(page: Page, includeAbout: boolean): Promise<FontProbe> {
  return page.evaluate((withAbout) => {
    const cs = getComputedStyle(document.documentElement);
    const bodyCs = getComputedStyle(document.body);

    const familyOf = (selector: string): string => {
      const el = document.querySelector(selector);
      if (!(el instanceof HTMLElement)) return '';
      return getComputedStyle(el).fontFamily;
    };

    const rectOf = (selector: string): Rect | null => {
      const el = document.querySelector(selector);
      if (!(el instanceof HTMLElement)) return null;
      const r = el.getBoundingClientRect();
      return {
        top: r.top,
        bottom: r.bottom,
        left: r.left,
        right: r.right,
        width: r.width,
        height: r.height,
      };
    };

    const looksLikeSerif = (family: string): boolean => {
      const f = family.toLowerCase();
      if (!f) return false;
      // Explicit sans wins even if "serif" appears in a fallback list token
      if (f.includes('sans')) return false;
      return (
        f.includes('serif')
        || f.includes('nanum')
        || f.includes('myeongjo')
        || f.includes('songti')
        || f.includes('times')
        || f.includes('georgia')
        || f.includes('garamond')
        || f.includes('cormorant')
      );
    };

    const section = document.querySelector('.section');
    const sectionPaddingTop = section instanceof HTMLElement
      ? Number.parseFloat(getComputedStyle(section).paddingTop)
      : null;

    // Full public H2/H3 enumeration (not first-element probe)
    const siteRoot = document.querySelector('.site') ?? document.body;
    const headingEls = Array.from(siteRoot.querySelectorAll('h2, h3')).filter(
      (el): el is HTMLElement => el instanceof HTMLElement,
    );
    const visibleH2H3: HeadingSample[] = [];
    for (const el of headingEls) {
      const r = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) {
        continue;
      }
      if (r.width < 1 || r.height < 1) continue;
      const text = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);
      visibleH2H3.push({
        tag: el.tagName.toLowerCase(),
        className: typeof el.className === 'string' ? el.className : '',
        text,
        fontFamily: style.fontFamily,
      });
    }
    const serifH2H3 = visibleH2H3.filter((h) => looksLikeSerif(h.fontFamily));

    const about = withAbout
      ? (() => {
          const rootEl = document.querySelector(
            ".builder-pub-node[data-node-id='about-page-root'], [data-node-id='about-page-root']",
          );
          const compositeEl = document.querySelector(
            ".builder-pub-node[data-node-id='about-page-root-composite'], [data-node-id='about-page-root-composite']",
          );
          const builderDomPresent = Boolean(rootEl || compositeEl);

          const root = rectOf(".builder-pub-node[data-node-id='about-page-root']")
            ?? rectOf("[data-node-id='about-page-root']");
          const composite = rectOf(".builder-pub-node[data-node-id='about-page-root-composite']")
            ?? rectOf("[data-node-id='about-page-root-composite']");
          const builderMain = rectOf('.builder-pub-main')
            ?? rectOf("main.builder-layout-absolute")
            ?? rectOf('main');
          const footer = rectOf('footer')
            ?? rectOf('.site-footer')
            ?? rectOf('.footer');

          // Last section / content block inside about root (not the dead page-about-contact-root id)
          let lastSection: Rect | null = null;
          if (rootEl instanceof HTMLElement) {
            const sections = Array.from(
              rootEl.querySelectorAll('section, .section, [data-builder-section], [class*="section"]'),
            ).filter((el): el is HTMLElement => el instanceof HTMLElement);
            const last = sections.length > 0 ? sections[sections.length - 1] : null;
            if (last) {
              const r = last.getBoundingClientRect();
              lastSection = {
                top: r.top,
                bottom: r.bottom,
                left: r.left,
                right: r.right,
                width: r.width,
                height: r.height,
              };
            } else if (compositeEl instanceof HTMLElement) {
              // Fall back to composite content bottom as last content edge
              const kids = Array.from(compositeEl.querySelectorAll('*')).filter(
                (el): el is HTMLElement => el instanceof HTMLElement,
              );
              let maxBottom = 0;
              let maxEl: HTMLElement | null = null;
              for (const el of kids) {
                const r = el.getBoundingClientRect();
                if (r.height > 8 && r.bottom > maxBottom) {
                  maxBottom = r.bottom;
                  maxEl = el;
                }
              }
              if (maxEl) {
                const r = maxEl.getBoundingClientRect();
                lastSection = {
                  top: r.top,
                  bottom: r.bottom,
                  left: r.left,
                  right: r.right,
                  width: r.width,
                  height: r.height,
                };
              }
            }
          }

          const lastSectionOverlapsFooter = Boolean(
            lastSection
            && footer
            && lastSection.bottom > footer.top + 4
            && lastSection.top < footer.bottom - 4,
          );
          const rootCollapsed = Boolean(root && root.height < 8);

          return {
            builderDomPresent,
            root,
            composite,
            lastSection,
            builderMain,
            footer,
            rootHeight: root?.height ?? null,
            compositeHeight: composite?.height ?? null,
            lastSectionOverlapsFooter,
            rootCollapsed,
          };
        })()
      : undefined;

    return {
      tokens: {
        body: cs.getPropertyValue('--font-body').trim(),
        heading: cs.getPropertyValue('--font-heading').trim(),
        display: cs.getPropertyValue('--font-display').trim(),
        mono: cs.getPropertyValue('--font-mono').trim(),
        sansKrLoaded: cs.getPropertyValue('--font-noto-sans-kr-loaded').trim(),
        sansTcLoaded: cs.getPropertyValue('--font-noto-sans-tc-loaded').trim(),
        serifKrLoaded: cs.getPropertyValue('--font-noto-serif-kr-loaded').trim(),
        serifTcLoaded: cs.getPropertyValue('--font-noto-serif-tc-loaded').trim(),
      },
      bodyFamily: bodyCs.fontFamily,
      sampleFamilies: {
        h2: familyOf('h2'),
        h3: familyOf('h3'),
        nav: familyOf('.site-header a, .site-header .nav-link, nav a'),
        button: familyOf('.button, a.button, button.button'),
        card: familyOf('.card, .card-title, .services-detail-title'),
      },
      serifRoles: {
        heroTitle: familyOf('.hero-title'),
        pageHeaderTitle: familyOf('.page-header-title'),
        blogHeroTitle: familyOf('h1.blog-hero-title'),
        svcHeroTitle: familyOf('h1.svc-hero-title'),
      },
      sansRoles: {
        sectionTitle: familyOf('.section-title, h2.section-title'),
        blogHeading: familyOf('.blog-heading, h2.blog-heading'),
      },
      visibleH2H3,
      serifH2H3,
      documentOverflowX: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
      sectionPaddingTop,
      about,
    };
  }, includeAbout);
}

function familyLooksLikeTimes(family: string): boolean {
  const f = family.toLowerCase();
  return f.includes('times') || f.includes('times new roman');
}

function familyLooksLikeSerifDisplay(family: string): boolean {
  const f = family.toLowerCase();
  if (!f) return false;
  if (f.includes('sans')) return false;
  return (
    f.includes('serif')
    || f.includes('nanum')
    || f.includes('myeongjo')
    || f.includes('songti')
    || f.includes('georgia')
    || f.includes('garamond')
    || f.includes('cormorant')
  );
}

function familyLooksLikeSans(family: string): boolean {
  const f = family.toLowerCase();
  if (!f) return false;
  if (familyLooksLikeTimes(f)) return false;
  return (
    f.includes('sans')
    || f.includes('noto sans')
    || f.includes('apple sd gothic')
    || f.includes('pingfang')
    || f.includes('system-ui')
    || f.includes('ui-sans')
  );
}

function assertNoSerifH2H3(probe: FontProbe, routeLabel: string): void {
  expect(
    probe.serifH2H3,
    `${routeLabel}: expected 0 serif H2/H3, found ${probe.serifH2H3.length}: ${
      probe.serifH2H3
        .slice(0, 8)
        .map((h) => `${h.tag}.${h.className.split(/\s+/)[0] || '(no-class)'}="${h.text}" → ${h.fontFamily}`)
        .join('; ')
    }`,
  ).toEqual([]);
}

const ROUTES_FOR_H2H3_AUDIT = [
  '/ko',
  '/en',
  '/zh-hant',
  '/ko/about',
  '/ko/services',
  '/ko/lawyers',
  '/ko/columns',
  '/ko/guides/taiwan-company-setup',
] as const;

test.describe('public typography design system', () => {
  test('ko home activates KR tokens, sans UI, serif hero H1, no Times', async ({ page }) => {
    ensureEvidenceDir();
    await page.setViewportSize({ width: 1280, height: 800 });
    const response = await page.goto('/ko', { waitUntil: 'load' });
    expect(response?.status()).toBe(200);
    await settlePublicPage(page);

    const probe = await probeTypography(page, false);
    fs.writeFileSync(
      path.join(EVIDENCE_DIR, 'ko-home-1280.json'),
      `${JSON.stringify(probe, null, 2)}\n`,
    );

    expect(probe.tokens.body.length).toBeGreaterThan(0);
    expect(probe.tokens.sansKrLoaded.length).toBeGreaterThan(0);
    expect(probe.tokens.serifKrLoaded.length).toBeGreaterThan(0);
    expect(probe.tokens.sansTcLoaded).toBe('');
    expect(probe.tokens.serifTcLoaded).toBe('');
    expect(familyLooksLikeTimes(probe.bodyFamily)).toBe(false);
    expect(familyLooksLikeSans(probe.bodyFamily)).toBe(true);

    if (probe.serifRoles.heroTitle) {
      expect(familyLooksLikeSerifDisplay(probe.serifRoles.heroTitle)).toBe(true);
    }
    assertNoSerifH2H3(probe, '/ko');
    expect(probe.documentOverflowX).toBeLessThanOrEqual(2);

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, 'ko-home-1280.png'),
      fullPage: false,
    });
  });

  test('all audited public routes: every visible H2/H3 is sans', async ({ page }) => {
    ensureEvidenceDir();
    await page.setViewportSize({ width: 1280, height: 800 });

    const summary: Record<string, { h2h3: number; serif: number; samples: HeadingSample[] }> = {};

    for (const route of ROUTES_FOR_H2H3_AUDIT) {
      const response = await page.goto(route, { waitUntil: 'load' });
      // Guide may 404 in some seeds — soft-skip only that route if missing
      if (response?.status() === 404 && route.includes('/guides/')) {
        summary[route] = { h2h3: 0, serif: 0, samples: [] };
        continue;
      }
      expect(response?.status(), route).toBe(200);
      await settlePublicPage(page);

      const probe = await probeTypography(page, false);
      summary[route] = {
        h2h3: probe.visibleH2H3.length,
        serif: probe.serifH2H3.length,
        samples: probe.serifH2H3.slice(0, 12),
      };
      assertNoSerifH2H3(probe, route);
    }

    fs.writeFileSync(
      path.join(EVIDENCE_DIR, 'h2h3-serif-audit-1280.json'),
      `${JSON.stringify(summary, null, 2)}\n`,
    );
  });

  test('zh-hant loads TC pair and not KR next/font variables', async ({ page }) => {
    ensureEvidenceDir();
    await page.setViewportSize({ width: 1280, height: 800 });
    const response = await page.goto('/zh-hant', { waitUntil: 'load' });
    expect(response?.status()).toBe(200);
    await settlePublicPage(page);

    const probe = await probeTypography(page, false);
    fs.writeFileSync(
      path.join(EVIDENCE_DIR, 'zh-hant-home-1280.json'),
      `${JSON.stringify(probe, null, 2)}\n`,
    );

    expect(probe.tokens.sansTcLoaded.length).toBeGreaterThan(0);
    expect(probe.tokens.serifTcLoaded.length).toBeGreaterThan(0);
    expect(probe.tokens.sansKrLoaded).toBe('');
    expect(probe.tokens.serifKrLoaded).toBe('');
    expect(familyLooksLikeTimes(probe.bodyFamily)).toBe(false);
    assertNoSerifH2H3(probe, '/zh-hant');
  });

  test('en uses KR pair (cohesion) and no Times body', async ({ page }) => {
    ensureEvidenceDir();
    await page.setViewportSize({ width: 1280, height: 800 });
    const response = await page.goto('/en', { waitUntil: 'load' });
    expect(response?.status()).toBe(200);
    await settlePublicPage(page);

    const probe = await probeTypography(page, false);
    fs.writeFileSync(
      path.join(EVIDENCE_DIR, 'en-home-1280.json'),
      `${JSON.stringify(probe, null, 2)}\n`,
    );

    expect(probe.tokens.sansKrLoaded.length).toBeGreaterThan(0);
    expect(probe.tokens.serifKrLoaded.length).toBeGreaterThan(0);
    expect(probe.tokens.sansTcLoaded).toBe('');
    expect(familyLooksLikeTimes(probe.bodyFamily)).toBe(false);
    assertNoSerifH2H3(probe, '/en');
  });

  test('about root/composite/footer geometry at 1280, 768, 390', async ({ page }) => {
    ensureEvidenceDir();

    for (const viewport of [
      { width: 1280, height: 800, tag: '1280' },
      { width: 768, height: 900, tag: '768' },
      { width: 390, height: 844, tag: '390' },
    ] as const) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const response = await page.goto('/ko/about', { waitUntil: 'load' });
      expect(response?.status()).toBe(200);
      await settlePublicPage(page);

      const probe = await probeTypography(page, true);
      fs.writeFileSync(
        path.join(EVIDENCE_DIR, `ko-about-${viewport.tag}.json`),
        `${JSON.stringify(probe, null, 2)}\n`,
      );

      expect(probe.documentOverflowX).toBeLessThanOrEqual(2);
      assertNoSerifH2H3(probe, `/ko/about@${viewport.tag}`);

      expect(probe.about, `about probe missing @${viewport.tag}`).toBeTruthy();
      const about = probe.about!;

      // When Builder DOM is present, root + composite are required (no vacuous pass)
      if (about.builderDomPresent) {
        expect(about.root, `about-page-root missing @${viewport.tag}`).toBeTruthy();
        expect(about.composite, `about-page-root-composite missing @${viewport.tag}`).toBeTruthy();
        expect(about.rootCollapsed, `about-page-root collapsed to ~0 @${viewport.tag}`).toBe(false);
        expect(about.rootHeight ?? 0, `about root height @${viewport.tag}`).toBeGreaterThan(100);
        expect(about.compositeHeight ?? 0, `about composite height @${viewport.tag}`).toBeGreaterThan(100);
        expect(about.footer, `footer missing @${viewport.tag}`).toBeTruthy();
        expect(
          about.lastSectionOverlapsFooter,
          `last about section overlaps footer @${viewport.tag}`,
        ).toBe(false);
      }

      await page.screenshot({
        path: path.join(EVIDENCE_DIR, `ko-about-${viewport.tag}.png`),
        fullPage: false,
      });
    }
  });

  test('article/blog hero H1 is serif; all visible H2/H3 stay sans', async ({ page }) => {
    ensureEvidenceDir();
    await page.setViewportSize({ width: 1280, height: 800 });

    const list = await page.goto('/ko/columns', { waitUntil: 'load' });
    expect(list?.status()).toBe(200);
    await settlePublicPage(page);

    const articleHref = await page.locator('a[href*="/ko/columns/"]').first().getAttribute('href');
    test.skip(!articleHref, 'No column article link found on /ko/columns');

    const response = await page.goto(articleHref!, { waitUntil: 'load' });
    expect(response?.status()).toBe(200);
    await settlePublicPage(page);

    const probe = await probeTypography(page, false);
    fs.writeFileSync(
      path.join(EVIDENCE_DIR, 'ko-article-1280.json'),
      `${JSON.stringify(probe, null, 2)}\n`,
    );

    if (probe.serifRoles.blogHeroTitle) {
      expect(familyLooksLikeSerifDisplay(probe.serifRoles.blogHeroTitle)).toBe(true);
    }
    assertNoSerifH2H3(probe, articleHref!);
    expect(familyLooksLikeTimes(probe.bodyFamily)).toBe(false);
  });
});
