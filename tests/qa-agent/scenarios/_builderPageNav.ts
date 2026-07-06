import { expect, type Locator, type Page } from '@playwright/test';
import { canvasEditor } from '../helpers';

/**
 * 공유 페이지 전환 / 페이지 CRUD 헬퍼.
 * Hard-won lessons baked in:
 *  1. 페이지 전환 후 대상 페이지 draft 가 완전히 로드될 때까지 캔버스 노드 수를
 *     300ms 간격으로 폴링 — 2회 연속 동일 && >0 이 되어야 안정으로 간주 (최대 8s).
 *  2. 페이지 선택은 Pages drawer row 중 index 1(0은 보통 활성 home)부터 시도하고,
 *     전환 후 캔버스 fingerprint(노드 수 | 첫 data-node-id)가 바뀌었는지 검증.
 *     바뀌지 않으면 다음 row 후보(최대 3개)로 재시도.
 *  5. isolated 서버는 home 을 9-node composite 또는 수백 node decomposed 문서로
 *     serve 할 수 있으므로 노드 수를 하드코딩하지 않는다.
 */

const PAGES_RAIL_SEL =
  '[data-builder-rail-item="pages"], button[aria-label*="Pages"], button[aria-label*="페이지"]';
const PAGES_DRAWER_SEL =
  '[data-builder-drawer="pages"], [data-page-switcher="true"]';
const PAGE_ROW_SEL = '[data-builder-page-row]';
const MODAL_SHELL_SEL = '[data-modal-shell="true"]';
const SLUG_PROMPT_SEL = '[data-builder-slug-prompt-dialog="true"]';

export async function canvasNodeCount(page: Page): Promise<number> {
  return canvasEditor(page).locator('[data-node-id]').count();
}

export async function canvasFingerprint(page: Page): Promise<string> {
  const nodes = canvasEditor(page).locator('[data-node-id]');
  const count = await nodes.count();
  const firstId =
    count > 0 ? (await nodes.first().getAttribute('data-node-id')) ?? '' : '';
  return `${count}|${firstId}`;
}

/**
 * 캔버스 노드 수가 안정될 때까지 대기 (lesson 1).
 * 300ms 간격으로 폴링하여 2회 연속 동일한 값이 관측되고 0보다 크면 종료.
 */
export async function waitForStableCanvas(
  page: Page,
  { timeout = 8000, interval = 300 } = {},
): Promise<{ stable: boolean; count: number }> {
  let prev = -1;
  let stableHits = 0;
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const current = await canvasNodeCount(page);
    if (current > 0 && current === prev) {
      stableHits += 1;
      if (stableHits >= 2) return { stable: true, count: current };
    } else {
      stableHits = 0;
    }
    prev = current;
    await page.waitForTimeout(interval);
  }
  return { stable: false, count: Math.max(0, prev) };
}

export function pagesDrawer(page: Page): Locator {
  return page.locator(PAGES_DRAWER_SEL).first();
}

/** drawer 가 닫혀 있으면 rail 클릭으로 열고, 이미 열려 있으면 아무것도 하지 않는다 (멱등). */
export async function openPagesDrawer(page: Page): Promise<boolean> {
  const drawer = pagesDrawer(page);
  if (await drawer.isVisible().catch(() => false)) return true;
  const rail = page.locator(PAGES_RAIL_SEL).first();
  if (!(await rail.isVisible().catch(() => false))) return false;
  await rail.click({ force: true }).catch(() => undefined);
  await page.waitForTimeout(500);
  return drawer.isVisible().catch(() => false);
}

export async function closePagesDrawer(page: Page): Promise<void> {
  const drawer = pagesDrawer(page);
  if (!(await drawer.isVisible().catch(() => false))) return;
  await page.keyboard.press('Escape').catch(() => undefined);
  await page.waitForTimeout(250);
}

export async function pageRowCount(page: Page): Promise<number> {
  const drawer = pagesDrawer(page);
  if (!(await drawer.isVisible().catch(() => false))) return 0;
  return drawer.locator(PAGE_ROW_SEL).count();
}

export async function clickPageRow(page: Page, idx: number): Promise<void> {
  const drawer = pagesDrawer(page);
  const row = drawer.locator(PAGE_ROW_SEL).nth(idx);
  const selectBtn = row
    .locator(
      'button:not([data-builder-page-drag-handle]):not([data-page-menu-trigger])',
    )
    .first();
  if (await selectBtn.isVisible().catch(() => false)) {
    await selectBtn.click({ force: true }).catch(() => undefined);
    return;
  }
  await row.click({ force: true }).catch(() => undefined);
}

export interface SwitchResult {
  switched: boolean;
  pageCount: number;
  targetIndex?: number;
  reason?: string;
}

/**
 * 다른 페이지로 전환 (lesson 2).
 * row index 1(비활성)부터 시도 → fingerprint 변경 확인 → 안정 대기 → 재확인.
 * 변경이 없으면 다음 후보(최대 3개 + 마지막 row)로 재시도.
 */
export async function switchToDifferentPage(page: Page): Promise<SwitchResult> {
  const beforeFp = await canvasFingerprint(page);
  if (!(await openPagesDrawer(page))) {
    return { switched: false, pageCount: 0, reason: 'Pages drawer가 열리지 않음' };
  }
  const rowCount = await pageRowCount(page);
  if (rowCount < 2) {
    await closePagesDrawer(page);
    return {
      switched: false,
      pageCount: rowCount,
      reason: `페이지가 ${rowCount}개뿐`,
    };
  }

  const candidateSet = [1, 2, 3, rowCount - 1];
  const seen = new Set<number>();
  for (const rawIdx of candidateSet) {
    if (rawIdx < 0 || rawIdx >= rowCount || seen.has(rawIdx)) continue;
    seen.add(rawIdx);
    if (seen.size > 4) break;
    await openPagesDrawer(page).catch(() => undefined);
    await clickPageRow(page, rawIdx);
    await page.waitForTimeout(700);
    const fp = await canvasFingerprint(page);
    if (fp === beforeFp) continue;
    // fingerprint 가 바뀌었다면 새 페이지가 렌더를 시작한 것 — 완전히 안정될 때까지 대기.
    await waitForStableCanvas(page);
    const fpAfter = await canvasFingerprint(page);
    if (fpAfter !== beforeFp) {
      await closePagesDrawer(page).catch(() => undefined);
      return { switched: true, pageCount: rowCount, targetIndex: rawIdx };
    }
  }
  await closePagesDrawer(page);
  return {
    switched: false,
    pageCount: rowCount,
    reason: '후보 row 전환 후 캔버스 fingerprint 변화 없음',
  };
}

/* ----------------------------- 페이지 생성 (blank) ----------------------------- */

const NEW_PAGE_BUTTON_SEL =
  'button:has-text("+ 새 페이지"), button:has-text("+ 新增"), button:has-text("+ New")';
const BLANK_CARD_SEL =
  `${MODAL_SHELL_SEL} button:has-text("빈 페이지"), ` +
  `${MODAL_SHELL_SEL} button:has-text("空白頁面"), ` +
  `${MODAL_SHELL_SEL} button:has-text("Blank page")`;
const SLUG_CREATE_BUTTON_SEL =
  `${SLUG_PROMPT_SEL} button:has-text("생성"), ` +
  `${SLUG_PROMPT_SEL} button:has-text("建立"), ` +
  `${SLUG_PROMPT_SEL} button:has-text("Create")`;

export async function openNewPageGallery(page: Page): Promise<boolean> {
  if (!(await openPagesDrawer(page))) return false;
  const addBtn = pagesDrawer(page).locator(NEW_PAGE_BUTTON_SEL).first();
  if (!(await addBtn.isVisible().catch(() => false))) return false;
  await addBtn.click({ force: true });
  await page.waitForTimeout(600);
  return page.locator(MODAL_SHELL_SEL).first().isVisible().catch(() => false);
}

export async function chooseBlankTemplate(page: Page): Promise<boolean> {
  const blank = page.locator(BLANK_CARD_SEL).first();
  const ok = await blank
    .waitFor({ state: 'visible', timeout: 6000 })
    .then(() => true)
    .catch(() => false);
  if (!ok) return false;
  await blank.click({ force: true });
  await page.waitForTimeout(500);
  return page.locator(SLUG_PROMPT_SEL).first().isVisible().catch(() => false);
}

export async function fillSlugPromptAndCreate(
  page: Page,
  slug: string,
): Promise<boolean> {
  const prompt = page.locator(SLUG_PROMPT_SEL).first();
  if (!(await prompt.isVisible().catch(() => false))) return false;
  const slugInput = prompt.locator('input[type="text"]').first();
  await slugInput.fill(slug);
  const createBtn = page.locator(SLUG_CREATE_BUTTON_SEL).first();
  await createBtn.click({ force: true });
  // 생성 후 slug prompt 가 닫히고 새 페이지로 전환된다.
  await expect
    .poll(async () => prompt.isVisible().catch(() => false), { timeout: 8000 })
    .toBe(false)
    .catch(() => undefined);
  await waitForStableCanvas(page);
  return true;
}

export interface CreateBlankResult {
  created: boolean;
  slug: string;
  reason?: string;
}

/** Pages drawer → + 새 페이지 → 빈 페이지 → slug 입력 → 생성. slug 는 고유 토큰 권장. */
export async function createBlankPage(
  page: Page,
  slug: string,
): Promise<CreateBlankResult> {
  if (!(await openNewPageGallery(page))) {
    return { created: false, slug, reason: 'template gallery 가 열리지 않음' };
  }
  if (!(await chooseBlankTemplate(page))) {
    return { created: false, slug, reason: '빈 페이지(blank) 옵션을 찾지 못함' };
  }
  await fillSlugPromptAndCreate(page, slug);
  return { created: true, slug };
}

/* ----------------------------- row 메뉴 (rename / delete) ----------------------------- */

export function pageRowBySlug(page: Page, slug: string): Locator {
  return page.locator(`[data-builder-page-slug="${slug}"]`).first();
}

export async function openPageMenu(page: Page, slug: string): Promise<boolean> {
  const row = pageRowBySlug(page, slug);
  if (!(await row.isVisible().catch(() => false))) return false;
  await row.scrollIntoViewIfNeeded().catch(() => undefined);
  await row.hover({ force: true }).catch(() => undefined);
  await page.waitForTimeout(180);
  const more = row.locator(`[data-page-menu-trigger]`).first();
  if (!(await more.isVisible().catch(() => false))) return false;
  await more.click({ force: true });
  await page.waitForTimeout(280);
  return true;
}

const RENAME_MENU_SEL =
  'button:has-text("이름 변경"), button:has-text("重新命名"), button:has-text("Rename")';
const DELETE_MENU_SEL =
  'button:has-text("삭제"), button:has-text("刪除"), button:has-text("Delete")';

export async function renamePageViaMenu(
  page: Page,
  slug: string,
  newTitle: string,
): Promise<boolean> {
  if (!(await openPageMenu(page, slug))) return false;
  const row = pageRowBySlug(page, slug);
  const renameBtn = row.locator(RENAME_MENU_SEL).first();
  if (!(await renameBtn.isVisible().catch(() => false))) return false;
  await renameBtn.click({ force: true });
  await page.waitForTimeout(300);
  const titleInput = row
    .locator(
      'input[aria-label="페이지 이름"], input[aria-label="頁面名稱"], input[aria-label="Page name"]',
    )
    .first();
  if (!(await titleInput.isVisible().catch(() => false))) return false;
  await titleInput.fill(newTitle);
  await titleInput.press('Enter');
  await page.waitForTimeout(900);
  return true;
}

export async function deletePageBySlug(page: Page, slug: string): Promise<boolean> {
  if (!(await openPageMenu(page, slug))) return false;
  const row = pageRowBySlug(page, slug);
  const deleteBtn = row.locator(DELETE_MENU_SEL).last();
  if (!(await deleteBtn.isVisible().catch(() => false))) return false;
  // handleDelete 가 window.confirm(copy.deleteConfirm) 호출 → 자동 수락.
  page.once('dialog', (dialog) => {
    void dialog.accept().catch(() => undefined);
  });
  await deleteBtn.click({ force: true });
  await page.waitForTimeout(1000);
  await waitForStableCanvas(page);
  return true;
}

export async function rowText(page: Page, slug: string): Promise<string> {
  const row = pageRowBySlug(page, slug);
  if (!(await row.isVisible().catch(() => false))) return '';
  return (await row.innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
}
