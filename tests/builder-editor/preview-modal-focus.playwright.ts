import { expect, test } from '@playwright/test';
import { openBuilder } from './helpers/editor';

test.describe('M82 preview modal focus trap', () => {
  test('traps focus in preview modal and restores focus to the preview trigger', async ({ page }) => {
    try {
      await openBuilder(page);

      const previewTrigger = page.getByRole('button', { name: 'Preview', exact: true });
      await previewTrigger.focus();
      await expect(previewTrigger).toBeFocused();
      await page.keyboard.press('Enter');

      const previewDialog = page.getByRole('dialog', { name: '페이지 미리보기' });
      const desktopButton = previewDialog.getByRole('button', { name: /Desktop/ });
      const closeButton = previewDialog.getByRole('button', { name: '미리보기 닫기' });

      await expect(previewDialog).toBeVisible();
      await expect(desktopButton).toBeFocused();

      await page.keyboard.press('Shift+Tab');
      await expect(closeButton).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(desktopButton).toBeFocused();

      await page.evaluate(() => {
        const outsideButton = document.createElement('button');
        outsideButton.type = 'button';
        outsideButton.dataset.builderPreviewOutsideFocusProbe = 'true';
        outsideButton.textContent = 'outside focus probe';
        document.body.appendChild(outsideButton);
        outsideButton.focus();
      });
      await expect(desktopButton).toBeFocused();

      await page.keyboard.press('ControlOrMeta+R');
      await expect(previewDialog).toBeVisible();

      await page.keyboard.press('Escape');
      await expect(previewDialog).toBeHidden();
      await expect(previewTrigger).toBeFocused();
    } finally {
      await page.evaluate(() => {
        document.querySelector('[data-builder-preview-outside-focus-probe="true"]')?.remove();
      }).catch(() => undefined);
    }
  });
});
