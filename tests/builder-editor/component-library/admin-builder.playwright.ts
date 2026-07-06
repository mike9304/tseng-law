import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { z } from 'zod';
import { openBuilder, openCatalogDrawer } from '../helpers/editor';

const PREFS_KEY = 'tw_builder_editor_prefs_v1';
const createPageResponseSchema = z.object({
  success: z.boolean().optional(),
  pageId: z.string().optional(),
  error: z.string().optional(),
});
const storedComponentLibraryEntrySchema = z.object({
  name: z.string().optional(),
  nodeJson: z.string().optional(),
  versions: z.array(z.object({ label: z.string().optional() })).optional(),
});
const storedComponentLibraryPrefsSchema = z.object({
  componentLibrary: z.array(storedComponentLibraryEntrySchema).optional(),
});

type StoredComponentLibraryEntry = z.infer<typeof storedComponentLibraryEntrySchema>;

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'component-library';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function defaultNodeStyle() {
  return {
    backgroundColor: 'transparent',
    borderColor: '#cbd5e1',
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

async function createComponentLibraryPage(request: APIRequestContext, token: string): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    data: {
      locale: 'ko',
      slug: `g-editor-component-library-${token}`,
      title: `Component Library ${token}`,
      document: {
        version: 1,
        locale: 'ko',
        updatedAt: new Date().toISOString(),
        updatedBy: 'playwright-component-library',
        stageWidth: 1280,
        stageHeight: 720,
        nodes: [
          {
            id: 'home-hero-title',
            kind: 'text',
            rect: { x: 96, y: 96, width: 520, height: 96 },
            style: defaultNodeStyle(),
            zIndex: 1,
            rotation: 0,
            locked: false,
            visible: true,
            content: {
              text: 'Component library UI',
              fontSize: 40,
              color: '#0f172a',
              fontWeight: 'bold',
              align: 'left',
              lineHeight: 1.2,
              letterSpacing: 0,
              fontFamily: 'system-ui',
            },
          },
          {
            id: 'home-update-title',
            kind: 'text',
            rect: { x: 520, y: 240, width: 520, height: 64 },
            style: defaultNodeStyle(),
            zIndex: 2,
            rotation: 0,
            locked: false,
            visible: true,
            content: {
              text: 'Updated reusable source',
              fontSize: 32,
              color: '#1d4ed8',
              fontWeight: 'bold',
              align: 'left',
              lineHeight: 1.2,
              letterSpacing: 0,
              fontFamily: 'system-ui',
            },
          },
          {
            id: 'home-archive-title',
            kind: 'text',
            rect: { x: 520, y: 336, width: 520, height: 64 },
            style: defaultNodeStyle(),
            zIndex: 3,
            rotation: 0,
            locked: false,
            visible: true,
            content: {
              text: 'Archived reusable source',
              fontSize: 32,
              color: '#047857',
              fontWeight: 'bold',
              align: 'left',
              lineHeight: 1.2,
              letterSpacing: 0,
              fontFamily: 'system-ui',
            },
          },
        ],
      },
    },
    headers: mutationHeaders(token),
  });
  expect(response.status()).toBe(200);
  const payload = createPageResponseSchema.parse(await response.json());
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  if (!payload.pageId) throw new Error(payload.error ?? 'Component library fixture pageId missing');
  return payload.pageId;
}

async function deleteComponentLibraryPage(request: APIRequestContext, pageId: string, token: string): Promise<void> {
  try {
    await request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
      headers: mutationHeaders(`${token}-cleanup`),
    });
  } catch (error) {
    if (error instanceof Error) return;
    throw error;
  }
}

async function readStoredComponentLibraryEntry(
  page: Page,
  name: string,
): Promise<StoredComponentLibraryEntry | null> {
  const raw = await page.evaluate((key) => window.localStorage.getItem(key), PREFS_KEY);
  if (!raw) return null;
  const prefs = storedComponentLibraryPrefsSchema.parse(JSON.parse(raw));
  return prefs.componentLibrary?.find((entry) => entry.name === name) ?? null;
}

test.describe('component library panel', () => {
  test.setTimeout(120_000);

  test('saves, renames, duplicates, searches, sorts, and re-inserts a reusable selection', async ({ page }) => {
    await page.addInitScript((key) => {
      window.localStorage.setItem(
        key,
        JSON.stringify({
          componentLibrary: [
            {
              id: 'broken-component',
              name: 'Broken component',
              nodeJson: '{"id":"missing-kind"}',
              createdAt: '2026-06-01T00:00:00.000Z',
            },
          ],
        }),
      );
    }, PREFS_KEY);
    const token = Date.now().toString(36);
    let pageId: string | null = null;

    try {
      pageId = await createComponentLibraryPage(page.request, token);
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&componentLibrary=${token}`);

      const heroTitle = page.locator('[data-node-id="home-hero-title"]').first();
      await expect(heroTitle).toBeVisible();
      await heroTitle.click({ position: { x: 16, y: 16 }, force: true });
      await expect(heroTitle).toHaveAttribute('data-selected', 'true');

      const drawer = await openCatalogDrawer(page);
      const componentLibraryShortcut = drawer.locator('[data-builder-component-library-shortcut="true"]');
      await expect(componentLibraryShortcut).toBeVisible();
      await expect(componentLibraryShortcut).toContainText('내 디자인 바로가기');
      await expect(componentLibraryShortcut).toContainText('저장된 컴포넌트 1개를 바로 열기');
      await expect(componentLibraryShortcut.locator('[data-builder-component-library-shortcut-tray="true"]')).toHaveCount(0);
      await expect(componentLibraryShortcut.locator('[data-builder-component-library-shortcut-invalid="true"]')).toContainText(
        '저장 데이터 확인이 필요한 항목 1개는 전체 라이브러리에서 확인하세요.',
      );
      await componentLibraryShortcut.locator('[data-builder-component-library-shortcut-open="true"]').click();

      const componentLibrary = drawer.locator('[data-builder-component-library="true"]');
      await expect(componentLibrary).toBeVisible();
      await expect(componentLibrary.locator('[data-builder-component-library-view-toggle="grid"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await componentLibrary.locator('[data-builder-component-library-view-toggle="list"]').click();
      await expect(componentLibrary.locator('[data-builder-component-library-view-toggle="list"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await expect(componentLibrary.locator('[data-builder-component-library-view]')).toHaveAttribute(
        'data-builder-component-library-view',
        'list',
      );
      await componentLibrary.locator('[data-builder-component-library-view-toggle="grid"]').click();
      await expect(componentLibrary.locator('[data-builder-component-library-view-toggle="grid"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await expect(componentLibrary.locator('[data-builder-component-library-view]')).toHaveAttribute(
        'data-builder-component-library-view',
        'grid',
      );
      await expect(componentLibrary.getByText('저장 데이터 확인 필요')).toBeVisible();
      await expect(componentLibrary.locator('[data-builder-component-library-insert="broken-component"]')).toBeDisabled();

      await componentLibrary.locator('[data-builder-component-library-name="true"]').fill('Hero title reuse');
      await expect(componentLibrary.locator('[data-builder-component-library-save="true"]')).toBeEnabled();
      await componentLibrary.locator('[data-builder-component-library-save="true"]').click();
      await expect(componentLibrary.getByText('Hero title reuse')).toBeVisible();
      await expect(componentLibrary.getByText('텍스트 · 1개 요소')).toBeVisible();

      await componentLibraryShortcut.scrollIntoViewIfNeeded();
      const quickInsert = componentLibraryShortcut.locator('[data-builder-component-library-shortcut-insert]').first();
      await expect(componentLibraryShortcut.locator('[data-builder-component-library-shortcut-tray="true"]')).toBeVisible();
      await expect(componentLibraryShortcut).toContainText('최근 내 디자인');
      await expect(componentLibraryShortcut.locator('[data-builder-component-library-shortcut-section="recent"]')).toBeVisible();
      await expect(quickInsert).toHaveAttribute(
        'aria-label',
        '"Hero title reuse" 바로 삽입',
      );
      await quickInsert.click();
      await expect(page.locator('[data-node-id*="-lib-"]').filter({ hasText: 'Component library UI' })).toBeVisible({
        timeout: 10_000,
      });
      await componentLibrary.scrollIntoViewIfNeeded();

      await componentLibrary.getByRole('button', { name: '"Hero title reuse" 이름 변경' }).click();
      await componentLibrary.locator('[data-builder-component-library-rename-input]').fill('Hero title renamed');
      await componentLibrary.locator('[data-builder-component-library-rename-save]').click();
      await expect(componentLibrary.getByText('Hero title renamed')).toBeVisible();
      await expect(componentLibrary.getByText('Hero title reuse')).toHaveCount(0);

      await componentLibrary.getByRole('button', { name: '"Hero title renamed" 복제' }).click();
      await expect(componentLibrary.getByText('Hero title renamed 복사본')).toBeVisible();
      await expect(componentLibrary.getByText('표시 3/3')).toBeVisible();
      await expect(componentLibrary.getByText('텍스트 · 1개 요소')).toHaveCount(2);

      const updateSource = page.locator('[data-node-id="home-update-title"]').first();
      await expect(updateSource).toBeVisible();
      await updateSource.click();
      await expect(updateSource).toHaveAttribute('data-selected', 'true');
      await componentLibrary.getByRole('button', { name: '"Hero title renamed 복사본" 현재 선택으로 업데이트' }).click();
      await expect(componentLibrary.locator('[data-builder-component-library-update-review="true"]')).toBeVisible();
      await expect(componentLibrary.getByText('업데이트 확인')).toBeVisible();
      await expect(componentLibrary.locator('[data-builder-component-library-update-review-summary="saved"]')).toContainText(
        '텍스트 · 1개 요소',
      );
      await expect(componentLibrary.locator('[data-builder-component-library-update-review-summary="current"]')).toContainText(
        '텍스트 · 1개 요소',
      );
      await expect(componentLibrary.locator('[data-builder-component-library-update-review-previews="true"]')).toBeVisible();
      await expect(
        componentLibrary.locator('[data-builder-component-library-update-review-preview="saved"]'),
      ).toContainText('Component library UI');
      await expect(
        componentLibrary.locator('[data-builder-component-library-update-review-preview="current"]'),
      ).toContainText('Updated reusable source');
      await expect(componentLibrary.locator('[data-builder-component-library-update-review-diff="true"]')).toContainText(
        '구조 변경',
      );
      await expect(componentLibrary.locator('[data-builder-component-library-update-review-diff="true"]')).toContainText(
        '텍스트 변경',
      );
      await componentLibrary
        .locator('[data-builder-component-library-update-review-snapshot-label="true"]')
        .fill('Original hero snapshot');
      await componentLibrary.locator('[data-builder-component-library-update-review-confirm="true"]').click();
      await expect(componentLibrary.locator('[data-builder-component-library-update-review="true"]')).toHaveCount(0);
      await expect(componentLibrary.getByText('업데이트됨')).toBeVisible();
      await expect(componentLibrary.getByText('이전 버전 1')).toBeVisible();

      const updatedStoredEntry = await readStoredComponentLibraryEntry(page, 'Hero title renamed 복사본');
      expect(updatedStoredEntry?.versions?.map((version) => version.label)).toEqual(['Original hero snapshot']);

      const updatedInsertCount = await page
        .locator('[data-node-id*="-lib-"]')
        .filter({ hasText: 'Updated reusable source' })
        .count();
      await componentLibrary.getByRole('button', { name: '"Hero title renamed 복사본" 삽입' }).click();
      await expect(page.locator('[data-node-id*="-lib-"]').filter({ hasText: 'Updated reusable source' })).toHaveCount(
        updatedInsertCount + 1,
        { timeout: 10_000 },
      );

      const archiveSource = page.locator('[data-node-id="home-archive-title"]').first();
      await expect(archiveSource).toBeVisible();
      await archiveSource.click();
      await expect(archiveSource).toHaveAttribute('data-selected', 'true');
      await componentLibrary.getByRole('button', { name: '"Hero title renamed 복사본" 현재 선택으로 업데이트' }).click();
      await expect(componentLibrary.locator('[data-builder-component-library-update-review="true"]')).toBeVisible();
      await componentLibrary
        .locator('[data-builder-component-library-update-review-snapshot-label="true"]')
        .fill('Updated hero snapshot');
      await componentLibrary.locator('[data-builder-component-library-update-review-confirm="true"]').click();
      await expect(componentLibrary.locator('[data-builder-component-library-update-review="true"]')).toHaveCount(0);
      await expect(componentLibrary.getByText('이전 버전 2')).toBeVisible();

      const archivedStoredEntry = await readStoredComponentLibraryEntry(page, 'Hero title renamed 복사본');
      expect(archivedStoredEntry?.versions?.map((version) => version.label)).toEqual([
        'Updated hero snapshot',
        'Original hero snapshot',
      ]);

      await componentLibrary.getByRole('button', { name: '"Hero title renamed 복사본" 이전 버전 복원' }).click();
      await expect(componentLibrary.locator('[data-builder-component-library-restore-review="true"]')).toBeVisible();
      await expect(componentLibrary.getByText('복원 확인')).toBeVisible();
      await expect(componentLibrary.locator('[data-builder-component-library-restore-review-summary="current"]')).toContainText(
        '텍스트 · 1개 요소',
      );
      await expect(componentLibrary.locator('[data-builder-component-library-restore-review-summary="previous"]')).toContainText(
        '텍스트 · 1개 요소',
      );
      await expect(componentLibrary.locator('[data-builder-component-library-restore-review-previews="true"]')).toBeVisible();
      await expect(
        componentLibrary.locator('[data-builder-component-library-restore-review-preview="current"]'),
      ).toContainText('Archived reusable source');
      await expect(
        componentLibrary.locator('[data-builder-component-library-restore-review-preview="previous"]'),
      ).toContainText('Updated reusable source');
      await expect(componentLibrary.locator('[data-builder-component-library-restore-review-diff="true"]')).toContainText(
        '구조 변경',
      );
      await expect(componentLibrary.locator('[data-builder-component-library-restore-review-diff="true"]')).toContainText(
        '텍스트 변경',
      );
      await expect(componentLibrary.locator('[data-builder-component-library-restore-review-version]')).toHaveCount(2);
      await expect(componentLibrary.locator('[data-builder-component-library-restore-review-version="0"]')).toContainText(
        'Updated hero snapshot',
      );
      await expect(componentLibrary.locator('[data-builder-component-library-restore-review-version="1"]')).toContainText(
        'Original hero snapshot',
      );
      await expect(componentLibrary.locator('[data-builder-component-library-restore-review-version="0"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await componentLibrary
        .locator('[data-builder-component-library-restore-review-snapshot-label="true"]')
        .fill('Updated hero archived');
      await componentLibrary.locator('[data-builder-component-library-restore-review-snapshot-save="true"]').click();
      await expect(componentLibrary.locator('[data-builder-component-library-restore-review-version="0"]')).toContainText(
        'Updated hero archived',
      );
      const renamedVersionEntry = await readStoredComponentLibraryEntry(page, 'Hero title renamed 복사본');
      expect(renamedVersionEntry?.versions?.map((version) => version.label)).toEqual([
        'Updated hero archived',
        'Original hero snapshot',
      ]);

      await componentLibrary.locator('[data-builder-component-library-restore-review-snapshot-delete="true"]').click();
      await expect(componentLibrary.locator('[data-builder-component-library-restore-review-version]')).toHaveCount(1);
      await expect(componentLibrary.locator('[data-builder-component-library-restore-review-version="0"]')).toContainText(
        'Original hero snapshot',
      );
      await expect(componentLibrary.locator('[data-builder-component-library-restore-review-version="0"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await expect(
        componentLibrary.locator('[data-builder-component-library-restore-review-preview="current"]'),
      ).toContainText('Archived reusable source');
      await expect(
        componentLibrary.locator('[data-builder-component-library-restore-review-preview="previous"]'),
      ).toContainText('Component library UI');
      const deletedVersionEntry = await readStoredComponentLibraryEntry(page, 'Hero title renamed 복사본');
      expect(deletedVersionEntry?.versions?.map((version) => version.label)).toEqual(['Original hero snapshot']);

      await componentLibrary.locator('[data-builder-component-library-restore-review-confirm="true"]').click();
      await expect(componentLibrary.locator('[data-builder-component-library-restore-review="true"]')).toHaveCount(0);
      await expect(componentLibrary.getByText('이전 버전 1')).toBeVisible();

      const restoredStoredEntry = await readStoredComponentLibraryEntry(page, 'Hero title renamed 복사본');
      const restoredStoredPayload = restoredStoredEntry?.nodeJson ?? '';
      expect(restoredStoredPayload).toContain('Component library UI');
      expect(restoredStoredPayload).not.toContain('Updated reusable source');
      expect(restoredStoredPayload).not.toContain('Archived reusable source');

      await componentLibrary.getByRole('button', { name: '"Hero title renamed 복사본" 고정' }).click();
      await expect(componentLibrary.getByText('고정됨')).toBeVisible();
      await expect(componentLibrary.getByRole('button', { name: '"Hero title renamed 복사본" 고정 해제' })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await componentLibraryShortcut.scrollIntoViewIfNeeded();
      await expect(componentLibraryShortcut.locator('[data-builder-component-library-shortcut-section="pinned"]')).toContainText(
        '고정한 디자인',
      );
      await expect(componentLibraryShortcut.getByLabel('"Hero title renamed 복사본" 바로 삽입')).toBeVisible();
      await componentLibrary.scrollIntoViewIfNeeded();
      await componentLibrary.getByRole('button', { name: '"Hero title renamed 복사본" 고정 해제' }).click();
      await expect(componentLibrary.getByText('고정됨')).toHaveCount(0);
      await expect(componentLibrary.getByRole('button', { name: '"Hero title renamed 복사본" 고정' })).toHaveAttribute(
        'aria-pressed',
        'false',
      );

      const searchInput = componentLibrary.locator('input[type="search"]').first();
      await searchInput.fill('복사본');
      await expect(componentLibrary.getByText('표시 1/3')).toBeVisible();

      const sortSelect = componentLibrary.locator('select').first();
      await sortSelect.selectOption('name');
      await expect(sortSelect).toHaveValue('name');

      const restoredInsertCount = await page
        .locator('[data-node-id*="-lib-"]')
        .filter({ hasText: 'Component library UI' })
        .count();
      await componentLibrary.locator('[data-builder-component-library-insert]').first().click();
      await expect(page.locator('[data-node-id*="-lib-"]').filter({ hasText: 'Component library UI' })).toHaveCount(
        restoredInsertCount + 1,
        { timeout: 10_000 },
      );
    } finally {
      if (pageId) await deleteComponentLibraryPage(page.request, pageId, token);
    }
  });
});
