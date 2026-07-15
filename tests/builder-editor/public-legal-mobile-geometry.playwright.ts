import { expect, test, type Page } from '@playwright/test';

type LegalRoute = {
  readonly path:
    | '/ko/privacy'
    | '/ko/disclaimer'
    | '/zh-hant/privacy'
    | '/zh-hant/disclaimer';
  readonly prefix: 'page-privacy' | 'page-disclaimer';
  readonly cardCount: number;
};

type RectMetric = {
  readonly nodeId: string;
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly bottom: number;
  readonly width: number;
  readonly height: number;
};

type TextCollision = {
  readonly leftNodeId: string;
  readonly rightNodeId: string;
  readonly leftText: string;
  readonly rightText: string;
  readonly overlapWidth: number;
  readonly overlapHeight: number;
};

type LegalGeometryReport = {
  readonly cards: readonly RectMetric[];
  readonly articleOverflow: readonly {
    readonly nodeId: string;
    readonly scrollHeight: number;
    readonly clientHeight: number;
    readonly scrollWidth: number;
    readonly clientWidth: number;
  }[];
  readonly documentOverflow: number;
  readonly textFragmentCount: number;
  readonly materiallyClippedTextFragmentCount: number;
  readonly collisions: readonly TextCollision[];
};

const KOREAN_LEGAL_ROUTES: readonly LegalRoute[] = [
  { path: '/ko/privacy', prefix: 'page-privacy', cardCount: 4 },
  { path: '/ko/disclaimer', prefix: 'page-disclaimer', cardCount: 3 },
];

const MOBILE_LEGAL_ROUTES: readonly LegalRoute[] = [
  ...KOREAN_LEGAL_ROUTES,
  { path: '/zh-hant/privacy', prefix: 'page-privacy', cardCount: 4 },
  { path: '/zh-hant/disclaimer', prefix: 'page-disclaimer', cardCount: 3 },
];

const MOBILE_VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 360, height: 800 },
] as const;

const ROUNDING_TOLERANCE_PX = 2;
const MATERIAL_OVERLAP_PX = 2;

function cardSelector(prefix: LegalRoute['prefix']): string {
  return `[data-parent-node-id="${prefix}-legal-grid"][data-node-id^="${prefix}-card-"]`;
}

async function openSettledLegalPage(page: Page, route: LegalRoute): Promise<void> {
  const response = await page.goto(route.path, { waitUntil: 'load' });
  expect(response?.status()).toBe(200);

  const grid = page.locator(`[data-node-id="${route.prefix}-legal-grid"]`);
  const cards = page.locator(cardSelector(route.prefix));
  await expect(grid).toBeVisible();
  await expect(cards).toHaveCount(route.cardCount);

  await page.evaluate(async () => {
    await document.fonts?.ready;
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  });
  await page.addStyleTag({
    content: `
      [data-node-id="${route.prefix}-legal-grid"],
      [data-node-id="${route.prefix}-legal-grid"] * {
        animation: none !important;
        transition: none !important;
        opacity: 1 !important;
        transform: none !important;
        clip-path: none !important;
      }
    `,
  });
  await page.evaluate(() => new Promise<void>((resolve) => (
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  )));
}

async function auditLegalGeometry(page: Page, route: LegalRoute): Promise<LegalGeometryReport> {
  return page.evaluate(({ prefix, materialOverlapPx }) => {
    type VisibleTextFragment = {
      readonly ownerId: string;
      readonly text: string;
      readonly left: number;
      readonly right: number;
      readonly top: number;
      readonly bottom: number;
    };

    const grid = document.querySelector(`[data-node-id="${prefix}-legal-grid"]`);
    if (!(grid instanceof HTMLElement)) {
      throw new Error(`Missing published legal grid for ${prefix}.`);
    }

    const cardQuery = `[data-parent-node-id="${prefix}-legal-grid"][data-node-id^="${prefix}-card-"]`;
    const cardElements = Array.from(document.querySelectorAll(cardQuery)).filter(
      (element): element is HTMLElement => element instanceof HTMLElement,
    );

    const cards = cardElements.map((card) => {
      const rect = card.getBoundingClientRect();
      return {
        nodeId: card.dataset.nodeId ?? '',
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      };
    });

    const articleOverflow = cardElements.map((card) => {
      const article = card.querySelector(':scope > article');
      if (!(article instanceof HTMLElement)) {
        throw new Error(`Legal card ${card.dataset.nodeId ?? '(unknown)'} is missing its inner article.`);
      }
      return {
        nodeId: card.dataset.nodeId ?? '',
        scrollHeight: article.scrollHeight,
        clientHeight: article.clientHeight,
        scrollWidth: article.scrollWidth,
        clientWidth: article.clientWidth,
      };
    });

    const isPainted = (element: Element): boolean => {
      for (let current: Element | null = element; current; current = current.parentElement) {
        const style = window.getComputedStyle(current);
        if (
          style.display === 'none'
          || style.visibility === 'hidden'
          || style.visibility === 'collapse'
          || Number.parseFloat(style.opacity || '1') <= 0.01
        ) {
          return false;
        }
        if (current === grid) break;
      }
      return true;
    };

    const clipRangeRect = (rangeRect: DOMRect, parent: Element): VisibleTextFragment | null => {
      let left = rangeRect.left;
      let right = rangeRect.right;
      let top = rangeRect.top;
      let bottom = rangeRect.bottom;

      for (let current: Element | null = parent; current; current = current.parentElement) {
        if (!(current instanceof HTMLElement)) continue;
        const style = window.getComputedStyle(current);
        const clipsX = /^(auto|hidden|clip|scroll)$/.test(style.overflowX);
        const clipsY = /^(auto|hidden|clip|scroll)$/.test(style.overflowY);
        if (clipsX || clipsY) {
          const bounds = current.getBoundingClientRect();
          const clipLeft = bounds.left + current.clientLeft;
          const clipTop = bounds.top + current.clientTop;
          const clipRight = clipLeft + current.clientWidth;
          const clipBottom = clipTop + current.clientHeight;
          if (clipsX) {
            left = Math.max(left, clipLeft);
            right = Math.min(right, clipRight);
          }
          if (clipsY) {
            top = Math.max(top, clipTop);
            bottom = Math.min(bottom, clipBottom);
          }
        }
        if (current === grid) break;
      }

      if (right - left <= 0.5 || bottom - top <= 0.5) return null;
      return { ownerId: '', text: '', left, right, top, bottom };
    };

    const fragments: VisibleTextFragment[] = [];
    let materiallyClippedTextFragmentCount = 0;
    const walker = document.createTreeWalker(grid, NodeFilter.SHOW_TEXT);
    for (let textNode = walker.nextNode(); textNode; textNode = walker.nextNode()) {
      const rawText = textNode.textContent ?? '';
      const firstCharacter = rawText.search(/\S/);
      if (firstCharacter < 0) continue;
      const lastCharacter = rawText.search(/\s*$/);
      const parent = textNode.parentElement;
      if (!parent || !isPainted(parent) || parent.closest('[aria-hidden="true"]')) continue;

      const owner = parent.closest('[data-node-id]');
      const ownerId = owner?.getAttribute('data-node-id') ?? '';
      if (!ownerId) continue;

      const range = document.createRange();
      range.setStart(textNode, firstCharacter);
      range.setEnd(textNode, Math.max(firstCharacter + 1, lastCharacter));
      for (const rangeRect of Array.from(range.getClientRects())) {
        const clipped = clipRangeRect(rangeRect, parent);
        if (!clipped) {
          materiallyClippedTextFragmentCount += 1;
          continue;
        }
        const clippedWidth = clipped.right - clipped.left;
        const clippedHeight = clipped.bottom - clipped.top;
        if (
          rangeRect.width - clippedWidth > materialOverlapPx
          || rangeRect.height - clippedHeight > materialOverlapPx
        ) {
          materiallyClippedTextFragmentCount += 1;
        }
        fragments.push({
          ...clipped,
          ownerId,
          text: rawText.trim().replace(/\s+/g, ' ').slice(0, 80),
        });
      }
    }

    const collisions: TextCollision[] = [];
    const seenPairs = new Set<string>();
    for (let leftIndex = 0; leftIndex < fragments.length; leftIndex += 1) {
      const leftFragment = fragments[leftIndex];
      if (!leftFragment) continue;
      for (let rightIndex = leftIndex + 1; rightIndex < fragments.length; rightIndex += 1) {
        const rightFragment = fragments[rightIndex];
        if (!rightFragment || leftFragment.ownerId === rightFragment.ownerId) continue;

        const overlapWidth = Math.min(leftFragment.right, rightFragment.right)
          - Math.max(leftFragment.left, rightFragment.left);
        const overlapHeight = Math.min(leftFragment.bottom, rightFragment.bottom)
          - Math.max(leftFragment.top, rightFragment.top);
        if (overlapWidth <= materialOverlapPx || overlapHeight <= materialOverlapPx) continue;

        const pairKey = [leftFragment.ownerId, rightFragment.ownerId].sort().join('::');
        if (seenPairs.has(pairKey)) continue;
        seenPairs.add(pairKey);
        collisions.push({
          leftNodeId: leftFragment.ownerId,
          rightNodeId: rightFragment.ownerId,
          leftText: leftFragment.text,
          rightText: rightFragment.text,
          overlapWidth: Math.round(overlapWidth * 10) / 10,
          overlapHeight: Math.round(overlapHeight * 10) / 10,
        });
      }
    }

    return {
      cards,
      articleOverflow,
      documentOverflow: Math.max(
        document.documentElement.scrollWidth,
        document.body?.scrollWidth ?? 0,
      ) - document.documentElement.clientWidth,
      textFragmentCount: fragments.length,
      materiallyClippedTextFragmentCount,
      collisions,
    };
  }, { prefix: route.prefix, materialOverlapPx: MATERIAL_OVERLAP_PX });
}

function expectNoOverflowOrTextCollisions(report: LegalGeometryReport): void {
  expect(report.documentOverflow).toBe(0);
  expect(report.textFragmentCount).toBeGreaterThan(0);
  expect(report.materiallyClippedTextFragmentCount).toBe(0);
  expect(report.collisions).toEqual([]);
  expect(report.articleOverflow).not.toHaveLength(0);
  for (const article of report.articleOverflow) {
    expect(
      article.scrollHeight,
      `${article.nodeId} inner article must not clip vertically`,
    ).toBeLessThanOrEqual(article.clientHeight + ROUNDING_TOLERANCE_PX);
    expect(
      article.scrollWidth,
      `${article.nodeId} inner article must not clip horizontally`,
    ).toBeLessThanOrEqual(article.clientWidth + ROUNDING_TOLERANCE_PX);
  }
}

function expectSingleColumn(cards: readonly RectMetric[]): void {
  expect(cards.length).toBeGreaterThan(1);
  const first = cards[0];
  expect(first).toBeDefined();
  if (!first) return;

  for (let index = 0; index < cards.length; index += 1) {
    const card = cards[index];
    if (!card) continue;
    expect(Math.abs(card.left - first.left), `${card.nodeId} must share the mobile column`).toBeLessThanOrEqual(2);
    expect(Math.abs(card.width - first.width), `${card.nodeId} must keep the mobile column width`).toBeLessThanOrEqual(2);
    if (index > 0) {
      const previous = cards[index - 1];
      expect(previous).toBeDefined();
      if (previous) {
        expect(card.top, `${card.nodeId} must render below ${previous.nodeId}`).toBeGreaterThanOrEqual(
          previous.bottom - ROUNDING_TOLERANCE_PX,
        );
      }
    }
  }
}

function expectTwoDesktopColumns(cards: readonly RectMetric[]): void {
  expect(cards.length).toBeGreaterThanOrEqual(3);
  const first = cards[0];
  const second = cards[1];
  const third = cards[2];
  expect(first).toBeDefined();
  expect(second).toBeDefined();
  expect(third).toBeDefined();
  if (!first || !second || !third) return;

  expect(Math.abs(first.top - second.top), 'the first desktop card row must align').toBeLessThanOrEqual(2);
  expect(second.left, 'the desktop cards must occupy two distinct columns').toBeGreaterThan(first.right);
  expect(Math.abs(third.left - first.left), 'the next desktop row must return to column one').toBeLessThanOrEqual(2);
  expect(third.top, 'the next desktop row must clear the first row').toBeGreaterThanOrEqual(
    Math.max(first.bottom, second.bottom) - ROUNDING_TOLERANCE_PX,
  );

  for (let leftIndex = 0; leftIndex < cards.length; leftIndex += 1) {
    const left = cards[leftIndex];
    if (!left) continue;
    for (let rightIndex = leftIndex + 1; rightIndex < cards.length; rightIndex += 1) {
      const right = cards[rightIndex];
      if (!right) continue;
      const overlapWidth = Math.min(left.right, right.right) - Math.max(left.left, right.left);
      const overlapHeight = Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top);
      expect(
        overlapWidth > ROUNDING_TOLERANCE_PX && overlapHeight > ROUNDING_TOLERANCE_PX,
        `${left.nodeId} must not overlap ${right.nodeId}`,
      ).toBe(false);
    }
  }
}

test.describe('published legal page geometry', () => {
  for (const route of MOBILE_LEGAL_ROUTES) {
    for (const viewport of MOBILE_VIEWPORTS) {
      test(`${route.path} is a non-clipping single column at ${viewport.width}x${viewport.height}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await openSettledLegalPage(page, route);

        const report = await auditLegalGeometry(page, route);
        expect(report.cards).toHaveLength(route.cardCount);
        expectSingleColumn(report.cards);
        expectNoOverflowOrTextCollisions(report);
      });
    }
  }

  for (const route of KOREAN_LEGAL_ROUTES) {
    test(`${route.path} keeps two non-clipping columns at 1440px`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await openSettledLegalPage(page, route);

      const report = await auditLegalGeometry(page, route);
      expect(report.cards).toHaveLength(route.cardCount);
      expectTwoDesktopColumns(report.cards);
      expectNoOverflowOrTextCollisions(report);
    });
  }
});
