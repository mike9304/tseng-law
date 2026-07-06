import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { gotoBuilder } from '../helpers';

// W18 — 네비게이션 에디터: 항목 추가(커스텀 라벨/href 구성) → header 반영 → 이동 → 삭제 복원.
//
// 근원 원인(라이브 프로브로 확인): 방금 추가한 항목은 기본 label='새 항목' + href='/' 이고,
// href '/' 인 항목은 SiteHeader.buildHeaderNavItems 의 isHomeNavigationItem 에 의해
// header 에서 필터링된다(홈은 brand 링크로 렌더되는 것이 설계 의도).
// 따라서 "추가 직후 header +1" 은 기본 항목으로는 절대 통과할 수 없다.
// 수정: 추가 후 해당 row 의 편집(편집→라벨/href→저장) 으로 label='QA메뉴',
// href=non-home path('/ko/contact') 로 구성한 뒤 PUT 이 완료되면 header 반영을 단언한다.
const NAV_RAIL_SEL =
  '[data-builder-rail-item="nav"], button[aria-label*="내비게이션"], button[aria-label*="Navigation"], button[aria-label*="導覽"]';
const NAV_EDITOR_SEL = '[data-builder-navigation-editor="true"]';
const NAV_ROW_SEL = '[data-builder-nav-item-row][data-depth="root"]';
const HEADER_NAV_ITEM_SEL = '.builder-site-header [data-builder-nav-item-id]';

const ADD_BUTTON_TEXT = ['추가', '新增', 'Add'];
const EDIT_LABELS = ['편집', '編輯', 'Edit'];
const SAVE_LABELS = ['저장', '儲存', 'Save'];
const MOVE_UP_LABELS = ['위로', '上移', 'Move up'];
const DELETE_LABELS = ['삭제', '刪除', 'Delete'];

const QA_LABEL = 'QA메뉴';
const QA_HREF = '/ko/contact';

async function openNavEditor(page: Page): Promise<boolean> {
  const rail = page.locator(NAV_RAIL_SEL).first();
  if (!(await rail.isVisible().catch(() => false))) return false;
  await rail.click({ force: true }).catch(() => undefined);
  await page.waitForTimeout(600);
  const editor = page.locator(NAV_EDITOR_SEL).first();
  return editor
    .waitFor({ state: 'visible', timeout: 8000 })
    .then(() => true)
    .catch(() => false);
}

async function rootRowIds(page: Page): Promise<string[]> {
  const editor = page.locator(NAV_EDITOR_SEL).first();
  const rows = editor.locator(NAV_ROW_SEL);
  const count = await rows.count();
  const ids: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const id = await rows.nth(i).getAttribute('data-builder-nav-item-row');
    if (id) ids.push(id);
  }
  return ids;
}

async function headerNavCount(page: Page): Promise<number> {
  return page.locator(HEADER_NAV_ITEM_SEL).count();
}

async function headerHasLabel(page: Page, label: string): Promise<boolean> {
  const header = page.locator('.builder-site-header').first();
  if (!(await header.isVisible().catch(() => false))) return false;
  const hit = header.locator(`[data-builder-nav-item-id]`, { hasText: label });
  return (await hit.count()) > 0;
}

async function waitForHeaderLabel(
  page: Page,
  label: string,
  timeout = 7000,
): Promise<boolean> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await headerHasLabel(page, label).catch(() => false)) return true;
    await page.waitForTimeout(400);
  }
  return false;
}

function ariaLabelSelector(labels: string[]): string {
  return labels.map((label) => `button[aria-label="${label}"]`).join(', ');
}

/**
 * 추가된 root 항목(rowId)의 편집 폼을 열어 label/href 를 구성하고 저장(PUT) 한다.
 * 편집 폼([data-builder-nav-edit-id]) 내 input 순서: 0=라벨, 1=href.
 */
async function configureNavItem(
  page: Page,
  rowId: string,
  label: string,
  href: string,
): Promise<boolean> {
  const editor = page.locator(NAV_EDITOR_SEL).first();
  const row = editor.locator(`[data-builder-nav-item-row="${rowId}"]`);
  const editBtn = row.locator(ariaLabelSelector(EDIT_LABELS)).first();
  if (!(await editBtn.isVisible().catch(() => false))) return false;
  await editBtn.click({ force: true }).catch(() => undefined);
  await page.waitForTimeout(350);
  const form = editor.locator(`[data-builder-nav-edit-id="${rowId}"]`);
  if (!(await form.waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false))) {
    return false;
  }
  const inputs = form.locator('input');
  if ((await inputs.count().catch(() => 0)) < 2) return false;
  await inputs.nth(0).fill(label).catch(() => undefined);
  await inputs.nth(1).fill(href).catch(() => undefined);
  const saveBtn = form
    .locator(`button`, { hasText: new RegExp(SAVE_LABELS.join('|')) })
    .first();
  await saveBtn.click({ force: true }).catch(() => undefined);
  await page.waitForTimeout(1600); // saveNav(PUT) 완료 대기
  return true;
}

async function deleteNavItem(page: Page, rowId: string): Promise<boolean> {
  const editor = page.locator(NAV_EDITOR_SEL).first();
  const row = editor.locator(`[data-builder-nav-item-row="${rowId}"]`);
  const deleteBtn = row.locator(ariaLabelSelector(DELETE_LABELS)).first();
  if (!(await deleteBtn.isVisible().catch(() => false))) return false;
  await deleteBtn.click({ force: true }).catch(() => undefined);
  await page.waitForTimeout(1300); // saveNav(PUT) 완료 대기
  return true;
}

export const W18_navMenuDeep: CheckpointDefinition = {
  id: 'W18',
  title: '네비게이션 에디터 — 항목 추가/이동 → header 에 반영 (end-to-end)',
  verification: 'Navigation 패널 → 항목 추가 + 커스텀 라벨/href 구성 → header 반영 → 위로 이동 → 삭제 복원',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    log('잔여 popover/drawer 정리 (Escape x2)');
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.waitForTimeout(200);

    const findings: CheckpointFinding[] = [];

    log('Navigation 패널 열기');
    if (!(await openNavEditor(page))) {
      findings.push({
        severity: 'blocker',
        summary: 'Navigation rail/drawer/에디터가 열리지 않음',
      });
      await recordEvidence('nav-editor-missing');
      return { findings };
    }
    await page.waitForTimeout(8000); // NavigationEditor 가 API 에서 항목을 로드할 시간 부여
    await recordEvidence('nav-editor-open');

    const editorBefore = await rootRowIds(page);
    const headerBefore = await headerNavCount(page);
    log(`에디터 root 항목: ${editorBefore.length} / header nav 항목: ${headerBefore}`);

    log('항목 추가(추가 버튼)');
    const addBtn = page
      .locator(NAV_EDITOR_SEL)
      .locator(`button`, { hasText: new RegExp(ADD_BUTTON_TEXT.join('|')) })
      .first();
    if (!(await addBtn.isVisible().catch(() => false))) {
      findings.push({
        severity: 'blocker',
        summary: 'NavigationEditor 의 추가(추가/Add) 버튼이 보이지 않음',
      });
      return { findings };
    }
    await addBtn.click({ force: true });
    await page.waitForTimeout(1600); // saveNav(PUT) 완료 대기
    await recordEvidence('nav-item-added');

    const editorAfterAdd = await rootRowIds(page);
    const addedId = editorAfterAdd[editorAfterAdd.length - 1] ?? null;
    log(`추가 후 에디터 항목: ${editorAfterAdd.length} (addedId=${addedId})`);

    if (editorAfterAdd.length !== editorBefore.length + 1) {
      findings.push({
        severity: 'blocker',
        summary: `항목 추가 후 에디터 리스트가 +1 되지 않음 (before=${editorBefore.length}, after=${editorAfterAdd.length})`,
      });
    }
    if (!addedId) {
      findings.push({
        severity: 'blocker',
        summary: '추가된 네비게이션 항목의 row id 를 읽지 못함',
      });
      return { findings };
    }

    log(`추가 항목 구성: label="${QA_LABEL}", href="${QA_HREF}" (home 필터 회피)`);
    const configured = await configureNavItem(page, addedId, QA_LABEL, QA_HREF);
    if (!configured) {
      findings.push({
        severity: 'blocker',
        summary: '추가한 항목의 편집(편집→라벨/href→저장) 흐름을 완료하지 못해 header 반영 검증 불가',
      });
      await recordEvidence('nav-item-configure-failed');
      await deleteNavItem(page, addedId).catch(() => undefined);
      return { findings };
    }
    await recordEvidence('nav-item-configured');

    log('header 에 구성한 커스텀 항목 반영 확인 (home 필터 통과)');
    const headerConfigured = await headerNavCount(page);
    const reflected = await waitForHeaderLabel(page, QA_LABEL);
    log(`구성 후 header 항목: ${headerConfigured} / "${QA_LABEL}" 반영=${reflected}`);
    if (!reflected) {
      findings.push({
        severity: 'blocker',
        summary:
          '커스텀 항목(label/href 구성 완료) 이 렌더된 header(.builder-site-header)에 반영되지 않음 — 글로벌 header 연동 누락',
      });
    }
    if (headerConfigured <= headerBefore && !reflected) {
      findings.push({
        severity: 'blocker',
        summary: `header nav 항목 수가 증가하지 않음 (before=${headerBefore}, after=${headerConfigured})`,
      });
    }
    await recordEvidence('nav-header-reflection');

    log('추가한 항목을 위로 이동 → 순서 변화 확인');
    if (editorAfterAdd.length >= 2) {
      const addedRow = page.locator(
        `${NAV_EDITOR_SEL} [data-builder-nav-item-row="${addedId}"]`,
      );
      const moveUp = addedRow.locator(ariaLabelSelector(MOVE_UP_LABELS)).first();
      const idxBefore = editorAfterAdd.indexOf(addedId);
      if (await moveUp.isVisible().catch(() => false)) {
        await moveUp.click({ force: true }).catch(() => undefined);
        await page.waitForTimeout(1300);
        const editorAfterMove = await rootRowIds(page);
        const idxAfter = editorAfterMove.indexOf(addedId);
        log(`이동 전 index=${idxBefore} → 이동 후 index=${idxAfter}`);
        if (idxAfter >= idxBefore) {
          findings.push({
            severity: 'blocker',
            summary: '위로 이동 후 항목 순서가 앞으로 바뀌지 않음',
          });
        }
      } else {
        findings.push({
          severity: 'visual',
          summary: '추가한 항목의 위로(move up) 버튼이 노출되지 않아 이동 검증 생략',
        });
      }
      await recordEvidence('nav-item-moved');
    } else {
      log('항목이 1개뿐이라 이동 검증 생략');
    }

    log('추가한 항목 삭제로 복원');
    const deleted = await deleteNavItem(page, addedId);
    if (!deleted) {
      findings.push({
        severity: 'visual',
        summary: '추가한 항목의 삭제 버튼이 노출되지 않아 복원(삭제) 검증 생략',
      });
    } else {
      const editorRestored = await rootRowIds(page);
      const headerRestored = await headerNavCount(page);
      log(`삭제 후 에디터 항목: ${editorRestored.length} (기대 ${editorBefore.length}) / header: ${headerRestored}`);
      if (editorRestored.length !== editorBefore.length) {
        findings.push({
          severity: 'visual',
          summary: '추가 항목 삭제 후 에디터 항목 수가 원래로 돌아가지 않음',
        });
      }
      if (headerRestored !== headerBefore) {
        findings.push({
          severity: 'visual',
          summary: `추가 항목 삭제 후 header 항목 수가 원래로 돌아가지 않음 (before=${headerBefore}, after=${headerRestored})`,
        });
      }
    }
    await recordEvidence('nav-item-removed');

    return { findings };
  },
};
