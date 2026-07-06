import { expect, test, type Locator } from '@playwright/test';
import { openBuilder } from './helpers/editor';

async function computedNumber(locator: Locator, property: string) {
  return locator.evaluate((element, cssProperty) => (
    Number.parseFloat(getComputedStyle(element).getPropertyValue(cssProperty))
  ), property);
}

async function expectVerticalGap(upper: Locator, lower: Locator, minGap: number) {
  const upperBox = await upper.boundingBox();
  const lowerBox = await lower.boundingBox();
  expect(upperBox).not.toBeNull();
  expect(lowerBox).not.toBeNull();
  if (!upperBox || !lowerBox) throw new Error('Missing node bounds.');
  expect(lowerBox.y).toBeGreaterThanOrEqual(upperBox.y + upperBox.height + minGap);
}

test('/ko/admin-builder responsive viewport sizes the canvas stage to the active breakpoint', async ({ page }) => {
  await openBuilder(page, `/ko/admin-builder?responsiveStage=${Date.now().toString(36)}`);

  const canvasStage = page.getByRole('application', { name: 'Canvas editor' });
  await expect(canvasStage).toBeVisible();

  await page.locator('[data-builder-topbar-viewport="tablet"]').click();
  await expect(page.locator('[data-builder-topbar-viewport="tablet"]')).toHaveAttribute('aria-pressed', 'true');

  await expect.poll(() => canvasStage.evaluate((element) => (
    Number.parseFloat(getComputedStyle(element).width)
  ))).toBe(768);

  const heroRootNode = page.locator('[data-node-id="home-hero-root"]').first();
  const heroMediaNode = page.locator('[data-node-id="home-hero-media"]').first();
  const heroInnerNode = page.locator('[data-node-id="home-hero-inner"]').first();
  const heroTitleNode = page.locator('[data-node-id="home-hero-title"]').first();
  const heroTitleText = heroTitleNode.locator('.hero-title').first();
  const heroSearchWrapper = page.locator('[data-node-id="home-hero-search-wrapper"]').first();
  await expect(heroTitleText).toBeVisible();

  await expect.poll(() => heroRootNode.evaluate((element) => (
    Number.parseFloat(getComputedStyle(element).minHeight)
  ))).toBe(680);

  await expect.poll(() => heroMediaNode.evaluate((element) => (
    Number.parseFloat(getComputedStyle(element).left)
  ))).toBe(16);

  await expect.poll(() => heroMediaNode.evaluate((element) => (
    Number.parseFloat(getComputedStyle(element).width)
  ))).toBe(736);

  await expect.poll(() => heroTitleNode.evaluate((element) => (
    Number.parseFloat(getComputedStyle(element).width)
  ))).toBe(675);

  await expect.poll(() => heroInnerNode.evaluate((element) => (
    Number.parseFloat(getComputedStyle(element).left)
  ))).toBe(47);

  await expect.poll(() => heroTitleText.evaluate((element) => (
    Number.parseFloat(getComputedStyle(element).fontSize)
  ))).toBeCloseTo(44.8, 1);

  await expect.poll(() => heroTitleText.evaluate((element) => (
    element.getBoundingClientRect().height
  ))).toBeLessThan(70);

  await expect.poll(() => heroSearchWrapper.evaluate((element) => (
    Number.parseFloat(getComputedStyle(element).left)
  ))).toBe(30);

  await expect.poll(() => heroSearchWrapper.evaluate((element) => (
    Number.parseFloat(getComputedStyle(element).width)
  ))).toBe(709);

  const insightsRoot = page.locator('[data-node-id="home-insights-root"]').first();
  const insightsContainer = page.locator('[data-node-id="home-insights-container"]').first();
  const insightsGrid = page.locator('[data-node-id="home-insights-grid"]').first();
  const insightsFeatured = page.locator('[data-node-id="home-insights-featured"]').first();
  const insightsListWrap = page.locator('[data-node-id="home-insights-list-wrap"]').first();
  const servicesRoot = page.locator('[data-node-id="home-services-root"]').first();
  const servicesContainer = page.locator('[data-node-id="home-services-container"]').first();
  const servicesList = page.locator('[data-node-id="home-services-list"]').first();
  const servicesFirstCard = page.locator('[data-node-id="home-services-card-0"]').first();
  const servicesFirstTitle = page.locator('[data-node-id="home-services-card-0-title"]').first();
  const servicesFirstBody = page.locator('[data-node-id="home-services-card-0-body"]').first();
  const servicesFirstDetail = page.locator('[data-node-id="home-services-card-0-detail-0"]').first();
  const servicesFirstLastDetail = page.locator('[data-node-id="home-services-card-0-detail-5"]').first();
  const servicesFirstColumns = page.locator('[data-node-id="home-services-card-0-columns"]').first();
  const servicesFirstColumn = page.locator('[data-node-id="home-services-card-0-column-0"]').first();
  const servicesFirstLastColumn = page.locator('[data-node-id="home-services-card-0-column-3"]').first();
  const servicesFirstFinalColumn = page.locator('[data-node-id="home-services-card-0-column-7"]').first();
  const servicesFirstMore = page.locator('[data-node-id="home-services-card-0-more"]').first();
  const caseResultsRoot = page.locator('[data-node-id="home-case-results-root"]').first();
  const statsRoot = page.locator('[data-node-id="home-stats-root"]').first();
  const faqRoot = page.locator('[data-node-id="home-faq-root"]').first();
  const faqList = page.locator('[data-node-id="home-faq-list"]').first();
  const faqFirstQuestion = page.locator('[data-node-id="home-faq-item-0-question-text"]').first();
  const faqFirstAnswerWrap = page.locator('[data-node-id="home-faq-item-0-answer-wrap"]').first();
  const faqFirstAnswer = page.locator('[data-node-id="home-faq-item-0-answer"]').first();
  const officesRoot = page.locator('[data-node-id="home-offices-root"]').first();
  const contactRoot = page.locator('[data-node-id="home-contact-root"]').first();
  const contactContainer = page.locator('[data-node-id="home-contact-container"]').first();

  await expect.poll(() => computedNumber(insightsRoot, 'min-height')).toBe(1680);
  await expect.poll(() => computedNumber(insightsContainer, 'left')).toBe(31);
  await expect.poll(() => computedNumber(insightsContainer, 'width')).toBe(675);
  await expect.poll(() => computedNumber(insightsGrid, 'top')).toBe(229);
  await expect.poll(() => computedNumber(insightsGrid, 'width')).toBe(675);
  await expect.poll(() => computedNumber(insightsFeatured, 'top')).toBe(20);
  await expect.poll(() => computedNumber(insightsFeatured, 'width')).toBe(675);
  await expect.poll(() => computedNumber(insightsListWrap, 'top')).toBe(704);
  await expect.poll(() => computedNumber(insightsListWrap, 'width')).toBe(675);

  await expect.poll(() => computedNumber(servicesRoot, 'min-height')).toBe(1166);
  await expect.poll(() => computedNumber(servicesContainer, 'width')).toBe(675);
  await expect.poll(() => computedNumber(servicesList, 'top')).toBe(229);
  await expect.poll(() => computedNumber(servicesList, 'width')).toBe(675);
  await expect.poll(() => computedNumber(servicesFirstCard, 'width')).toBe(675);
  await expect.poll(() => computedNumber(servicesFirstCard, 'height')).toBe(98);

  await expect.poll(() => computedNumber(faqRoot, 'min-height')).toBe(1250);
  await expect.poll(() => computedNumber(faqList, 'width')).toBe(675);
  await expect.poll(() => computedNumber(contactRoot, 'min-height')).toBe(419);
  await expect.poll(() => computedNumber(contactContainer, 'width')).toBe(675);

  await page.locator('[data-builder-topbar-viewport="mobile"]').click();
  await expect(page.locator('[data-builder-topbar-viewport="mobile"]')).toHaveAttribute('aria-pressed', 'true');

  await expect.poll(() => canvasStage.evaluate((element) => (
    Number.parseFloat(getComputedStyle(element).width)
  ))).toBe(375);

  await expect.poll(() => canvasStage.evaluate((element) => {
    const parent = element.parentElement;
    if (!parent) return 0;
    const transform = getComputedStyle(parent).transform;
    const matrixScale = /^matrix\(([^,]+)/.exec(transform)?.[1];
    return matrixScale ? Number(matrixScale) : 1;
  })).toBeGreaterThan(0.85);

  await expect.poll(() => heroRootNode.evaluate((element) => (
    Number.parseFloat(getComputedStyle(element).minHeight)
  ))).toBe(680);

  await expect.poll(() => heroMediaNode.evaluate((element) => (
    Number.parseFloat(getComputedStyle(element).left)
  ))).toBe(16);

  await expect.poll(() => heroMediaNode.evaluate((element) => (
    Number.parseFloat(getComputedStyle(element).width)
  ))).toBe(343);

  await expect.poll(() => heroTitleNode.evaluate((element) => (
    Number.parseFloat(getComputedStyle(element).width)
  ))).toBeGreaterThan(300);

  await expect.poll(() => heroInnerNode.evaluate((element) => (
    Number.parseFloat(getComputedStyle(element).left)
  ))).toBe(34);

  await expect.poll(() => heroTitleText.evaluate((element) => (
    Number.parseFloat(getComputedStyle(element).fontSize)
  ))).toBeCloseTo(31.5, 1);

  await expect.poll(() => heroTitleText.evaluate((element) => (
    element.getBoundingClientRect().height
  ))).toBeLessThan(90);

  await expect.poll(() => computedNumber(insightsRoot, 'min-height')).toBe(2283);
  await expect.poll(() => computedNumber(insightsContainer, 'left')).toBe(34);
  await expect.poll(() => computedNumber(insightsContainer, 'width')).toBe(308);
  await expect.poll(() => computedNumber(insightsGrid, 'top')).toBe(244);
  await expect.poll(() => computedNumber(insightsGrid, 'width')).toBe(308);
  await expect.poll(() => computedNumber(insightsFeatured, 'top')).toBe(20);
  await expect.poll(() => computedNumber(insightsFeatured, 'width')).toBe(308);
  await expect.poll(() => computedNumber(insightsListWrap, 'top')).toBe(532);
  await expect.poll(() => computedNumber(insightsListWrap, 'width')).toBe(308);

  await expect.poll(() => computedNumber(servicesRoot, 'min-height')).toBe(1285);
  await expect.poll(() => computedNumber(servicesContainer, 'width')).toBe(308);
  await expect.poll(() => computedNumber(servicesList, 'top')).toBe(244);
  await expect.poll(() => computedNumber(servicesList, 'width')).toBe(308);
  await expect.poll(() => computedNumber(servicesFirstCard, 'width')).toBe(308);
  await expect.poll(() => computedNumber(servicesFirstCard, 'height')).toBe(130);

  await expect.poll(() => computedNumber(caseResultsRoot, 'min-height')).toBe(545);
  await expect.poll(() => computedNumber(statsRoot, 'min-height')).toBe(773);
  await expect.poll(() => computedNumber(faqRoot, 'min-height')).toBe(1644);
  await expect.poll(() => computedNumber(faqList, 'width')).toBe(308);
  await expect.poll(() => computedNumber(officesRoot, 'min-height')).toBe(918);
  await expect.poll(() => computedNumber(contactRoot, 'min-height')).toBe(435);
  await expect.poll(() => computedNumber(contactContainer, 'width')).toBe(308);

  await servicesFirstTitle.scrollIntoViewIfNeeded();
  await servicesFirstTitle.click({ position: { x: 12, y: 12 }, force: true });
  await expect(servicesFirstDetail).toBeVisible();
  await expect(servicesFirstColumn).toBeVisible();
  await expect(servicesFirstFinalColumn).toBeVisible();
  await expect(servicesFirstMore).toBeVisible();
  await expect.poll(() => computedNumber(servicesFirstCard, 'height')).toBe(850);
  await expect.poll(() => computedNumber(servicesFirstBody, 'height')).toBe(700);
  await expect.poll(() => computedNumber(servicesFirstDetail, 'width')).toBe(260);
  await expect.poll(() => computedNumber(servicesFirstColumn, 'height')).toBe(30);
  await expectVerticalGap(servicesFirstLastDetail, servicesFirstColumns, 8);
  await expectVerticalGap(servicesFirstLastColumn, servicesFirstFinalColumn, 4);
  await expectVerticalGap(servicesFirstLastColumn, servicesFirstMore, 8);
  await expectVerticalGap(servicesFirstFinalColumn, servicesFirstMore, 8);

  await faqFirstQuestion.scrollIntoViewIfNeeded();
  await faqFirstQuestion.click({ position: { x: 12, y: 12 }, force: true });
  await expect(faqFirstAnswer).toBeVisible();
  await expect.poll(() => computedNumber(faqFirstAnswerWrap, 'height')).toBe(122);
  await expect.poll(() => computedNumber(faqFirstAnswer, 'height')).toBe(96);
});

test('/ko/admin-builder tablet services accordion preview lays out detail content', async ({ page }) => {
  await openBuilder(page, `/ko/admin-builder?tabletServicesPreview=${Date.now().toString(36)}`);

  const canvasStage = page.getByRole('application', { name: 'Canvas editor' });
  await expect(canvasStage).toBeVisible();

  await page.locator('[data-builder-topbar-viewport="tablet"]').click();
  await expect(page.locator('[data-builder-topbar-viewport="tablet"]')).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => canvasStage.evaluate((element) => (
    Number.parseFloat(getComputedStyle(element).width)
  ))).toBe(768);

  const servicesFirstTitle = page.locator('[data-node-id="home-services-card-0-title"]').first();
  const servicesFirstBody = page.locator('[data-node-id="home-services-card-0-body"]').first();
  const servicesFirstDetail = page.locator('[data-node-id="home-services-card-0-detail-0"]').first();
  const servicesFirstLastDetail = page.locator('[data-node-id="home-services-card-0-detail-5"]').first();
  const servicesFirstColumns = page.locator('[data-node-id="home-services-card-0-columns"]').first();
  const servicesFirstColumn = page.locator('[data-node-id="home-services-card-0-column-0"]').first();
  const servicesFirstLastColumn = page.locator('[data-node-id="home-services-card-0-column-3"]').first();
  const servicesFirstFinalColumn = page.locator('[data-node-id="home-services-card-0-column-7"]').first();
  const servicesFirstMore = page.locator('[data-node-id="home-services-card-0-more"]').first();

  await servicesFirstTitle.scrollIntoViewIfNeeded();
  await servicesFirstTitle.click({ position: { x: 12, y: 12 }, force: true });
  await expect(servicesFirstDetail).toBeVisible();
  await expect(servicesFirstColumn).toBeVisible();
  await expect(servicesFirstFinalColumn).toBeVisible();
  await expect(servicesFirstMore).toBeVisible();

  await expect.poll(() => computedNumber(servicesFirstBody, 'height')).toBe(700);
  await expect.poll(() => computedNumber(servicesFirstDetail, 'width')).toBeGreaterThan(280);
  await expect.poll(() => computedNumber(servicesFirstColumn, 'width')).toBeGreaterThan(260);
  await expect.poll(() => computedNumber(servicesFirstFinalColumn, 'width')).toBeGreaterThan(260);
  await expect.poll(() => computedNumber(servicesFirstMore, 'height')).toBe(36);
  await expectVerticalGap(servicesFirstLastDetail, servicesFirstColumns, 8);
  await expectVerticalGap(servicesFirstLastColumn, servicesFirstFinalColumn, 4);
  await expectVerticalGap(servicesFirstLastColumn, servicesFirstMore, 8);
  await expectVerticalGap(servicesFirstFinalColumn, servicesFirstMore, 8);
});
