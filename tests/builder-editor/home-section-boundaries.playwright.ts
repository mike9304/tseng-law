import { expect, test, type Locator, type Page } from '@playwright/test';

const HOME_SECTIONS = [
  { selector: '#hero', label: 'hero' },
  { selector: '#insights', label: 'insights' },
  { selector: '#practice', label: 'practice' },
  { selector: '#about', label: 'about' },
  { selector: '#results', label: 'results' },
  { selector: '#stats', label: 'stats' },
  { selector: '#faq', label: 'faq' },
  { selector: '#offices', label: 'offices' },
  { selector: '#contact', label: 'contact' },
] as const;

const YEAR_END_POPUP_HIDE_UNTIL_KEY = 'hojeong-year-end-event-hide-until';

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  await expect.poll(async () => page.evaluate(() => (
    document.documentElement.scrollWidth <= window.innerWidth + 1
  ))).toBe(true);
}

async function expectHomeSectionsDoNotOverlap(page: Page): Promise<void> {
  await expect.poll(async () => page.evaluate((sections) => {
    const boxes = sections.map((section) => {
      const element = document.querySelector(section.selector);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return {
        ...section,
        top: rect.top,
        bottom: rect.bottom,
      };
    });

    const missingIndex = boxes.findIndex((box) => !box);
    if (missingIndex !== -1) return `missing ${sections[missingIndex].label}`;
    const presentBoxes = boxes.filter((box): box is NonNullable<typeof box> => Boolean(box));

    for (let index = 1; index < presentBoxes.length; index += 1) {
      const previous = presentBoxes[index - 1];
      const current = presentBoxes[index];
      if (current.top < previous.bottom - 1) {
        return `${current.label} overlaps ${previous.label}`;
      }
    }

    return 'ok';
  }, HOME_SECTIONS), { timeout: 5_000 }).toBe('ok');
}

async function expectLocatorBelow(upper: Locator, lower: Locator, minGap = -1): Promise<void> {
  await expect.poll(async () => {
    const upperBox = await upper.boundingBox();
    const lowerBox = await lower.boundingBox();
    if (!upperBox || !lowerBox) return 'missing';
    return lowerBox.y >= upperBox.y + upperBox.height + minGap ? 'ok' : 'overlap';
  }, { timeout: 5_000 }).toBe('ok');
}

async function expectReceivesPointerAtCenter(locator: Locator, label: string): Promise<void> {
  await locator.scrollIntoViewIfNeeded();
  await expect(locator, label).toBeVisible();
  await expect.poll(async () => {
    const box = await locator.boundingBox();
    if (!box) return 'missing';
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    const receivesPointer = await locator.evaluate((element, point) => {
      const hit = document.elementFromPoint(point.x, point.y);
      return Boolean(hit && (hit === element || element.contains(hit)));
    }, { x, y });
    return receivesPointer ? 'ok' : 'covered';
  }, { timeout: 5_000 }).toBe('ok');
}

async function expectMinTouchTarget(locator: Locator, label: string): Promise<void> {
  await locator.scrollIntoViewIfNeeded();
  await expect(locator, label).toBeVisible();
  await expect.poll(async () => {
    const box = await locator.boundingBox();
    if (!box) return 'missing';
    return box.width >= 43.5 && box.height >= 43.5 ? 'ok' : `${Math.round(box.width)}x${Math.round(box.height)}`;
  }, { timeout: 5_000 }).toBe('ok');
}

async function expectHomeBoundaryControls(page: Page): Promise<void> {
  await expectReceivesPointerAtCenter(page.locator('.hero-search-input').first(), 'hero search input');
  await expectReceivesPointerAtCenter(page.locator('.hero-search-btn').first(), 'hero search button');

  const insights = page.locator('#insights').first();
  const viewAll = page.locator('#insights a.button--outline[href="/ko/columns"]').first();
  await expectReceivesPointerAtCenter(viewAll, 'insights view all link');
  await expectLocatorBelow(insights, page.locator('#practice').first(), -1);
}

async function expectHeroQuickMenuIsLocalized(page: Page, locale: 'ko' | 'zh-hant'): Promise<void> {
  const searchInput = page.locator('.hero-search-input').first();
  await searchInput.focus();
  await expect(page.locator('.hero-quick-menu')).toBeVisible();
  const faqLabel = locale === 'ko' ? '자주 묻는 질문' : '常見問題';
  await expect(page.locator('.hero-quick-menu-item', { hasText: faqLabel })).toBeVisible();
  await expect(page.locator('.hero-quick-menu-item')).toHaveCount(6);
  await searchInput.press('Escape').catch(() => {});
}

async function expectLocalizedFaqSectionLabel(page: Page, locale: 'ko' | 'zh-hant'): Promise<void> {
  const faqLabel = locale === 'ko' ? '자주 묻는 질문' : '常見問題';
  await expect(page.locator('#faq .section-label').first()).toContainText(faqLabel);
}

async function closeHomePopupIfPresent(page: Page): Promise<void> {
  const popup = page.locator('.year-end-popup-backdrop').first();
  if (await popup.isVisible().catch(() => false)) {
    await expect(popup.locator('.year-end-popup-badge')).toBeVisible();
    await popup.getByRole('button', { name: '닫기' }).click();
    await expect(popup).toBeHidden();
  }
}

async function expectAllServiceAccordions(page: Page): Promise<void> {
  const services = page.locator('#practice .services-detail-card');
  const count = await services.count();
  expect(count).toBeGreaterThan(1);

  for (let index = 0; index < count; index += 1) {
    const card = services.nth(index);
    const body = card.locator('.services-detail-body');
    await card.locator('.services-detail-toggle').click();
    await expect(body).toHaveClass(/is-open/);

    if (index > 0) {
      await expect(services.nth(index - 1).locator('.services-detail-body')).not.toHaveClass(/is-open/);
    }
    if (index + 1 < count) {
      await expectLocatorBelow(card, services.nth(index + 1), -1);
    }
    await expectHomeSectionsDoNotOverlap(page);
    await expectNoHorizontalOverflow(page);
  }
}

async function expectAllFaqAccordions(page: Page): Promise<void> {
  const faqItems = page.locator('#faq .faq-item');
  const count = await faqItems.count();
  expect(count).toBeGreaterThan(1);

  for (let index = 0; index < count; index += 1) {
    const item = faqItems.nth(index);
    const answer = item.locator('.faq-answer-wrap');
    await item.locator('.faq-question button').click();
    await expect(answer).toHaveClass(/is-open/);

    if (index > 0) {
      await expect(faqItems.nth(index - 1).locator('.faq-answer-wrap')).not.toHaveClass(/is-open/);
    }
    if (index + 1 < count) {
      await expectLocatorBelow(item, faqItems.nth(index + 1), -1);
    }
    await expectLocatorBelow(page.locator('#faq').first(), page.locator('#offices').first(), -1);
    await expectLocatorBelow(page.locator('#offices').first(), page.locator('#contact').first(), -1);
    await expectHomeSectionsDoNotOverlap(page);
    await expectNoHorizontalOverflow(page);
  }
}

async function expectOfficeAndContactSectionsAreSeparated(page: Page): Promise<void> {
  await expect.poll(async () => page.evaluate(() => {
    const offices = document.querySelector('#offices');
    const contact = document.querySelector('#contact');
    const layout = document.querySelector('#offices .office-layout');
    const map = document.querySelector('#offices .office-map-wrap');
    const card = document.querySelector('#offices .office-card');
    if (!offices || !contact || !layout || !map || !card) return 'missing';

    const viewportWidth = window.innerWidth;
    const officesBox = offices.getBoundingClientRect();
    const contactBox = contact.getBoundingClientRect();
    const mapBox = map.getBoundingClientRect();
    const cardBox = card.getBoundingClientRect();

    if (contactBox.top < officesBox.bottom - 1) return 'contact overlaps offices';
    if (mapBox.left < officesBox.left - 1 || mapBox.right > officesBox.right + 1) return 'map escapes offices';
    if (cardBox.left < officesBox.left - 1 || cardBox.right > officesBox.right + 1) return 'card escapes offices';

    const compact = viewportWidth <= 900;
    if (compact && cardBox.top < mapBox.bottom - 1) return 'compact card overlaps map';
    if (!compact && mapBox.right > cardBox.left + 1 && cardBox.right > mapBox.left + 1) return 'desktop card overlaps map';

    return 'ok';
  }), { timeout: 5_000 }).toBe('ok');
}

async function expectOfficeAndContactControls(page: Page): Promise<void> {
  const tabs = page.locator('#offices .office-tabs .tab-button');
  const tabCount = await tabs.count();
  expect(tabCount).toBeGreaterThan(1);

  for (let index = 0; index < tabCount; index += 1) {
    const tab = tabs.nth(index);
    const tabLabel = (await tab.textContent())?.trim() ?? '';
    await expectMinTouchTarget(tab, `office tab ${index + 1}`);
    await expectReceivesPointerAtCenter(tab, `office tab ${index + 1}`);
    await tab.click();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#offices .office-card .card-title').first()).toHaveText(tabLabel);
    await expect(page.locator('#offices .office-map-wrap iframe').first()).toBeVisible();
    await expectOfficeAndContactSectionsAreSeparated(page);
    await expectNoHorizontalOverflow(page);
  }

  const officeMapLink = page.locator('#offices .office-map-link').first();
  await expectMinTouchTarget(officeMapLink, 'office Google map link');
  await expectReceivesPointerAtCenter(officeMapLink, 'office Google map link');

  const contactButtons = page.locator('#contact .home-contact-actions .button');
  const contactButtonCount = await contactButtons.count();
  expect(contactButtonCount).toBeGreaterThan(1);
  for (let index = 0; index < contactButtonCount; index += 1) {
    await expectMinTouchTarget(contactButtons.nth(index), `contact CTA button ${index + 1}`);
    await expectReceivesPointerAtCenter(contactButtons.nth(index), `contact CTA button ${index + 1}`);
  }

  await expectLocatorBelow(page.locator('#offices').first(), page.locator('#contact').first(), -1);
}

test.describe('/ko live home section boundaries', () => {
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 1000 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    test(`keeps live home sections and accordions separated on ${viewport.name}`, async ({ page }) => {
      test.setTimeout(120_000);

      await page.addInitScript((key) => {
        window.localStorage.setItem(key, String(Date.now() + 24 * 60 * 60 * 1000));
      }, YEAR_END_POPUP_HIDE_UNTIL_KEY);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/ko', { waitUntil: 'domcontentloaded' });
      await closeHomePopupIfPresent(page);

      await expectHomeSectionsDoNotOverlap(page);
      await expectNoHorizontalOverflow(page);
      await expectHomeBoundaryControls(page);
      await expectHeroQuickMenuIsLocalized(page, 'ko');
      await expectLocalizedFaqSectionLabel(page, 'ko');
      await expectAllServiceAccordions(page);
      await expectAllFaqAccordions(page);
      await expectOfficeAndContactControls(page);
    });
  }

});

for (const { locale, path, label } of [
  { locale: 'ko', path: '/ko', label: '자주 묻는 질문' },
  { locale: 'zh-hant', path: '/zh-hant', label: '常見問題' },
] as const) {
  test.describe(`localized hero quick menu ${locale}`, () => {
    test(`shows the localized FAQ quick menu label`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await page.locator('.hero-search-input').first().focus();
      await expect(page.locator('.hero-quick-menu')).toBeVisible();
      await expect(page.locator('.hero-quick-menu-item', { hasText: label })).toBeVisible();
    });
  });
}

for (const { locale, path } of [
  { locale: 'ko', path: '/ko' },
  { locale: 'zh-hant', path: '/zh-hant' },
] as const) {
  test.describe(`localized homepage FAQ section label ${locale}`, () => {
    test(`shows the localized FAQ section label`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await expectLocalizedFaqSectionLabel(page, locale);
    });
  });
}
