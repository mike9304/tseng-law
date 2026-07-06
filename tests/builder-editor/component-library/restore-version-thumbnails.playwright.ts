import { expect, test } from '@playwright/test';
import { openBuilder, openCatalogDrawer } from '../helpers/editor';

const PREFS_KEY = 'tw_builder_editor_prefs_v1';

interface ComponentFixtureBinding {
  readonly targetId: string;
  readonly fieldId: string;
}

function defaultNodeStyle(color: string) {
  return {
    backgroundColor: 'transparent',
    borderColor: color,
    borderStyle: 'solid',
    borderWidth: 0,
    borderRadius: 14,
    shadowX: 0,
    shadowY: 0,
    shadowBlur: 0,
    shadowSpread: 0,
    shadowColor: 'rgba(15, 23, 42, 0.16)',
    opacity: 100,
  };
}

function textNode(id: string, text: string, color: string, binding: ComponentFixtureBinding) {
  return {
    id,
    kind: 'text',
    rect: { x: 0, y: 0, width: 520, height: 86 },
    style: defaultNodeStyle(color),
    zIndex: 1,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      text,
      fontSize: 32,
      color,
      fontWeight: 'bold',
      align: 'left',
      lineHeight: 1.2,
      letterSpacing: 0,
      fontFamily: 'system-ui',
    },
    dataBinding: {
      targetId: binding.targetId,
      recordIndex: 0,
      fields: {
        text: binding.fieldId,
      },
    },
  };
}

function componentPayload(id: string, text: string, color: string, binding: ComponentFixtureBinding): string {
  return JSON.stringify(textNode(id, text, color, binding));
}

const componentLibraryFixture = [
  {
    id: 'restore-thumbnail-entry',
    name: 'Restore thumbnail visual',
    nodeJson: componentPayload('current-archived-title', 'Archived reusable source', '#047857', {
      targetId: 'home.insights.feed',
      fieldId: 'title',
    }),
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-06-03T00:00:00.000Z',
    versions: [
      {
        nodeJson: componentPayload('previous-updated-title', 'Updated reusable source', '#1d4ed8', {
          targetId: 'home.services.list',
          fieldId: 'description',
        }),
        savedAt: '2026-06-02T00:00:00.000Z',
        label: 'Updated hero snapshot',
      },
      {
        nodeJson: componentPayload('previous-original-title', 'Original reusable source', '#0f172a', {
          targetId: 'home.attorney.profile',
          fieldId: 'title',
        }),
        savedAt: '2026-06-01T00:00:00.000Z',
        label: 'Original hero snapshot',
      },
    ],
  },
] as const;

test('component library restore browser renders thumbnails for every saved snapshot', async ({ page }) => {
  await page.addInitScript(({ key, entries }) => {
    window.localStorage.setItem(
      key,
      JSON.stringify({
        componentLibrary: entries,
      }),
    );
  }, { key: PREFS_KEY, entries: componentLibraryFixture });

  await openBuilder(page, '/ko/admin-builder?componentLibrary=restore-thumbnails');
  const drawer = await openCatalogDrawer(page);
  await drawer.locator('[data-builder-component-library-shortcut-open="true"]').click();

  const componentLibrary = drawer.locator('[data-builder-component-library="true"]');
  await componentLibrary.locator('[data-builder-component-library-restore="restore-thumbnail-entry"]').click();
  const review = componentLibrary.locator('[data-builder-component-library-restore-review="true"]');
  await expect(review).toBeVisible();
  const diffDetails = review.locator('[data-builder-component-library-review-diff-details="true"]');

  await expect(review.locator('[data-builder-component-library-restore-review-version-preview="0"]')).toContainText(
    'Updated reusable source',
  );
  await expect(review.locator('[data-builder-component-library-restore-review-version-preview="1"]')).toContainText(
    'Original reusable source',
  );
  await expect(diffDetails).toContainText('텍스트: Archived reusable source → Updated reusable source');
  await expect(diffDetails).toContainText(
    '연결: home.insights.feed · text:title → home.services.list · text:description',
  );

  await review.locator('[data-builder-component-library-restore-review-version="1"]').click();
  await expect(review.locator('[data-builder-component-library-restore-review-version="1"]')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(review.locator('[data-builder-component-library-restore-review-preview="previous"]')).toContainText(
    'Original reusable source',
  );
  await expect(diffDetails).toContainText('텍스트: Archived reusable source → Original reusable source');
  await expect(diffDetails).toContainText('연결: home.insights.feed · text:title → home.attorney.profile · text:title');
});
