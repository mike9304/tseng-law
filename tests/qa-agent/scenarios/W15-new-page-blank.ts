import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { dismissOverlays, gotoBuilder } from '../helpers';
import {
  canvasNodeCount,
  createBlankPage,
  openPagesDrawer,
  pageRowCount,
  waitForStableCanvas,
} from './_builderPageNav';

const ADD_RAIL_SEL =
  '[data-builder-rail-item="add"], button[aria-label*="Add"], button[aria-label*="추가"]';
const ADD_DRAWER_SEL =
  '[data-builder-drawer="add"], [aria-label*="Add panel"], [class*="addPanel"], [class*="AddPanel"]';

async function addRailOpens(page: Page): Promise<boolean> {
  const addBtn = page.locator(ADD_RAIL_SEL).first();
  if (!(await addBtn.isVisible().catch(() => false))) return false;
  await addBtn.click({ force: true }).catch(() => undefined);
  await page.waitForTimeout(450);
  const drawer = page.locator(ADD_DRAWER_SEL).first();
  return drawer.isVisible().catch(() => false);
}

const PAGE_MENU_BTN_SEL =
  '[data-page-menu-trigger], [aria-label*="메뉴"], [aria-label*="menu"], [aria-haspopup]';
const PAGE_DELETE_ITEM_SEL =
  'button:has-text("삭제"), button:has-text("刪除"), button:has-text("Delete")';

async function waitForSettledCount(
  page: Page,
  { timeout = 8000, interval = 300 } = {},
): Promise<number> {
  let prev = -1;
  let stableHits = 0;
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const current = await canvasNodeCount(page);
    if (current === prev) {
      stableHits += 1;
      if (stableHits >= 2) return current;
    } else {
      stableHits = 0;
    }
    prev = current;
    await page.waitForTimeout(interval);
  }
  return Math.max(0, prev);
}

async function cleanupDeletePage(page: Page, slug: string): Promise<boolean> {
  if (!(await openPagesDrawer(page).catch(() => false))) return false;
  const row = page.locator(`[data-builder-page-slug="${slug}"]`).first();
  if (!(await row.isVisible().catch(() => false))) return false;
  await row.scrollIntoViewIfNeeded().catch(() => undefined);
  await row.hover({ force: true }).catch(() => undefined);
  await page.waitForTimeout(200);
  const menuBtn = row.locator(PAGE_MENU_BTN_SEL).first();
  if (!(await menuBtn.isVisible().catch(() => false))) return false;
  await menuBtn.click({ force: true });
  await page.waitForTimeout(300);
  const deleteBtn = page.locator(PAGE_DELETE_ITEM_SEL).last();
  if (!(await deleteBtn.isVisible().catch(() => false))) return false;
  page.once('dialog', (dialog) => {
    void dialog.accept().catch(() => undefined);
  });
  await deleteBtn.click({ force: true });
  await page.waitForTimeout(1000);
  return true;
}

export const W15_newPageBlank: CheckpointDefinition = {
  id: 'W15',
  title: '새 빈 페이지 → 캔버스 비어있음 + Add 패널로 쌓기 진입',
  verification: '새 페이지(빈) 만들기 → 캔버스에 노드 0 → Add(추가) rail 오픈 → 페이지 삭제 cleanup',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    // Hard rule 1: 이전 시나리오가 남긴 popover/drawer 정리.
    log('잔여 popover/drawer 정리 (Escape x2)');
    await dismissOverlays(page);

    const findings: CheckpointFinding[] = [];
    const token = `qa-w15-${Date.now().toString(36)}`;
    const slug = token;

    log('기준(home) 캔버스 노드 수 측정 (lesson 5: 하드코딩 금지)');
    await waitForStableCanvas(page);
    const homeCount = await canvasNodeCount(page);
    log(`home 노드 수: ${homeCount}`);

    log('Pages drawer 상태 확인');
    if (!(await openPagesDrawer(page))) {
      findings.push({ severity: 'blocker', summary: 'Pages drawer 가 열리지 않음' });
      return { findings };
    }
    const pagesBefore = await pageRowCount(page);
    log(`생성 전 페이지 수: ${pagesBefore}`);

    log('새 빈 페이지 생성');
    const created = await createBlankPage(page, slug);
    if (!created.created) {
      findings.push({
        severity: 'blocker',
        summary: `빈 페이지 생성 실패 — ${created.reason ?? '원인 미상'}`,
      });
      await recordEvidence('blank-create-failed');
      return { findings };
    }
    await recordEvidence('blank-created');

    log('생성 후 페이지 목록에 +1 등장 확인');
    await openPagesDrawer(page).catch(() => undefined);
    const pagesAfter = await pageRowCount(page);
    log(`생성 후 페이지 수: ${pagesAfter}`);
    if (pagesAfter !== pagesBefore + 1) {
      findings.push({
        severity: 'blocker',
        summary: `새 페이지 생성 후 목록이 +1 되지 않음 (before=${pagesBefore}, after=${pagesAfter})`,
      });
    }

    log('새 페이지 캔버스 노드 수 측정 (빈 페이지는 0 허용, 2회 연속 동일 = 안정)');
    const blankCount = await waitForSettledCount(page);
    log(`빈 페이지 캔버스 노드 수: ${blankCount}`);
    if (blankCount === 0) {
      log('빈 페이지 캔버스가 비어있음 확인');
    } else if (blankCount <= 2) {
      findings.push({
        severity: 'visual',
        summary: `빈 페이지 캔버스에 노드 ${blankCount}개 존재 — 완전 blank 가 아닐 수 있음`,
      });
    } else {
      findings.push({
        severity: 'blocker',
        summary: `빈 페이지 캔버스에 노드 ${blankCount}개 존재 — blank 페이지가 비어있지 않음`,
      });
    }
    await recordEvidence('blank-canvas-empty');

    log('Add(추가) rail 오픈 확인 (쌓기 진입점)');
    if (!(await addRailOpens(page))) {
      findings.push({
        severity: 'blocker',
        summary: 'Add(추가) rail/drawer 가 열리지 않아 빈 페이지에 쌓을 수 없음',
      });
    }
    await recordEvidence('blank-add-rail-open');
    // Add drawer 닫기
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.waitForTimeout(250);

    log('cleanup: 생성한 페이지 삭제 (hover → kebab 메뉴 → 삭제)');
    const deleted = await cleanupDeletePage(page, slug).catch(() => false);
    if (!deleted) {
      findings.push({
        severity: 'visual',
        summary: `cleanup 실패(harness concern) — 생성한 페이지(/${slug})의 삭제 진입점(hover → kebab 메뉴 → 삭제 항목)을 찾지 못했거나 동작하지 않음`,
      });
    } else {
      await openPagesDrawer(page).catch(() => undefined);
      const pagesFinal = await pageRowCount(page);
      log(`cleanup 후 페이지 수: ${pagesFinal}`);
      if (pagesFinal !== pagesBefore) {
        findings.push({
          severity: 'visual',
          summary: `cleanup 후 페이지 수가 원래로 돌아가지 않음 (before=${pagesBefore}, final=${pagesFinal})`,
        });
      }
    }

    return { findings };
  },
};
