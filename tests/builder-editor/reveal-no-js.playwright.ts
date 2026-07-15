import { expect, test } from '@playwright/test';

test.use({ javaScriptEnabled: false });

test('keeps meaningful accessibility content visible and interactable without JavaScript', async ({ page }) => {
  const response = await page.goto('/ko/accessibility', { waitUntil: 'load' });
  expect(response?.ok()).toBe(true);

  const reveal = page.locator('.reveal').filter({
    has: page.locator('.legal-page-section'),
  });
  await expect(reveal).toHaveCount(1);

  const expectedStyle = {
    opacity: '1',
    pointerEvents: 'auto',
    transform: 'none',
    transitionDuration: '0s',
  };

  const readVisibility = (element: Element) => {
    const style = getComputedStyle(element);
    return {
      opacity: style.opacity,
      pointerEvents: style.pointerEvents,
      transform: style.transform,
      transitionDuration: style.transitionDuration,
    };
  };

  const revealStyle = await reveal.evaluate(readVisibility);
  expect(revealStyle).toEqual(expectedStyle);

  const cards = reveal.locator('.reveal-stagger > .legal-card');
  const cardCount = await cards.count();
  expect(cardCount).toBe(2);

  for (let index = 0; index < cardCount; index += 1) {
    const card = cards.nth(index);

    await expect(card.locator('h2')).toHaveText(/\S/);
    await expect(card).toBeVisible();

    const cardStyle = await card.evaluate(readVisibility);
    expect(cardStyle).toEqual(expectedStyle);

    await card.scrollIntoViewIfNeeded();
    const hitTargetIsCard = await card.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const hit = document.elementFromPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      );
      return Boolean(hit && (hit === element || element.contains(hit)));
    });
    expect(hitTargetIsCard).toBe(true);
  }
});
