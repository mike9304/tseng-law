import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { gotoBuilder } from '../helpers';
import { switchToDifferentPage, waitForStableCanvas } from './_builderPageNav';

// W19 — Header 글로벌 공유 검증.
//
// 근원 원인(라이브 프로브로 확인): 표준(spec 매칭) header 항목(업무분야 등)은 라벨이
// canonical spec 에 고정되어, NavigationEditor 에서 해당 항목을 개명해도 header 에 반영되지
// 않는다(buildHeaderNavItems 가 spec labels 를 우선). 또한 첫 root 항목은 보통 home(nav-home)
// 이라 isHomeNavigationItem 에 의해 header 에서 필터링된다.
// 수정: 표준 항목을 개명하는 대신, 커스텀 항목을 추가+구성(label='QA헤더',
// href='/ko/contact') → 페이지 A header 반영 확인 → 동일 항목을 'QA헤더2' 로 개명 →
// header 라벨 갱신 확인 → 페이지 B 전환 후에도 'QA헤더2' 가 header 에 존재(글로벌 공유 증명).
const NAV_RAIL_SEL =
  '[data-builder-rail-item="nav"], button[aria-label*="내비게이션"], button[aria-label*="Navigation"], button[aria-label*="導覽"]';
const NAV_EDITOR_SEL = '[data-builder-navigation-editor="true"]';
const NAV_ROW_SEL = '[data-builder-nav-item-row][data-depth="root"]';
const ADD_BUTTON_TEXT = ['추가', '新增', 'Add'];
const EDIT_LABELS = ['편집', '編輯', 'Edit'];
const SAVE_LABELS = ['저장', '儲存', 'Save'];
const DELETE_LABELS = ['삭제', '刪除', 'Delete'];

const QA_LABEL_A = 'QA헤더';
const QA_LABEL_B = 'QA헤더2';
const QA_HREF = '/ko/contact';

async function openNavEditor(page: Page): Promise<boolean> {
  const rail = page.locator(NAV_RAIL_SEL).first();
  if (!(await rail.isVisible().catch(() => false))) return false;
  await rail.click({ force: true }).catch(() => undefined);
  await page.waitForTimeout(600);
  return page
    .locator(NAV_EDITOR_SEL)
    .first()
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

async function headerContainsText(page: Page, text: string): Promise<boolean> {
  const header = page.locator('.builder-site-header').first();
  if (!(await header.isVisible().catch(() => false))) return false;
  const hit = header.getByText(text, { exact: false });
  return (await hit.count()) > 0;
}

async function waitForHeaderText(
  page: Page,
  text: string,
  timeout = 7000,
): Promise<boolean> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await headerContainsText(page, text).catch(() => false)) return true;
    await page.waitForTimeout(400);
  }
  return false;
}

function ariaLabelSelector(labels: string[]): string {
  return labels.map((label) => `button[aria-label="${label}"]`).join(', ');
}

/**
 * 추가된 root 항목(rowId)의 편집 폼을 열어 label/href 를 구성하고 저장(PUT).
 * 편집 폼 input 순서: 0=라벨, 1=href.
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
  await page.waitForTimeout(1600);
  return true;
}

/** 편집 폼을 열어 라벨만 새 값으로 변경 후 저장(PUT). href 는 기존 값 유지(pre-fill). */
async function renameNavItemById(
  page: Page,
  rowId: string,
  newLabel: string,
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
  const labelInput = form.locator('input').nth(0);
  await labelInput.fill(newLabel).catch(() => undefined);
  const saveBtn = form
    .locator(`button`, { hasText: new RegExp(SAVE_LABELS.join('|')) })
    .first();
  await saveBtn.click({ force: true }).catch(() => undefined);
  await page.waitForTimeout(1600);
  return true;
}

async function deleteNavItem(page: Page, rowId: string): Promise<boolean> {
  const editor = page.locator(NAV_EDITOR_SEL).first();
  const row = editor.locator(`[data-builder-nav-item-row="${rowId}"]`);
  const deleteBtn = row.locator(ariaLabelSelector(DELETE_LABELS)).first();
  if (!(await deleteBtn.isVisible().catch(() => false))) return false;
  await deleteBtn.click({ force: true }).catch(() => undefined);
  await page.waitForTimeout(1300);
  return true;
}

/** 커스텀 root 항목 추가(추가 버튼) 후 label/href 구성까지 완료. 추가된 row id 반환. */
async function addCustomNavItem(
  page: Page,
  label: string,
  href: string,
): Promise<string | null> {
  const addBtn = page
    .locator(NAV_EDITOR_SEL)
    .locator(`button`, { hasText: new RegExp(ADD_BUTTON_TEXT.join('|')) })
    .first();
  if (!(await addBtn.isVisible().catch(() => false))) return null;
  await addBtn.click({ force: true });
  await page.waitForTimeout(1600);
  const ids = await rootRowIds(page);
  const addedId = ids[ids.length - 1] ?? null;
  if (!addedId) return null;
  const ok = await configureNavItem(page, addedId, label, href);
  return ok ? addedId : null;
}

export const W19_globalHeaderDeep: CheckpointDefinition = {
  id: 'W19',
  title: 'Header 글로벌 공유 — 커스텀 항목 편집이 다른 페이지 header 에도 동일 반영',
  verification: '커스텀 항목 추가+구성 → 페이지 A header 반영 → 개명 → 페이지 B header 동일 반영 → 복원',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입 (페이지 A)');
    await gotoBuilder(page, baseUrl);

    log('잔여 popover/drawer 정리 (Escape x2)');
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.waitForTimeout(200);

    const findings: CheckpointFinding[] = [];

    log('Navigation 에디터 열기');
    if (!(await openNavEditor(page))) {
      findings.push({
        severity: 'blocker',
        summary: 'Navigation 에디터가 열리지 않아 header 편집(=nav 라벨)을 수행할 수 없음',
      });
      await recordEvidence('nav-editor-missing');
      return { findings };
    }
    await page.waitForTimeout(8000);
    const editorBefore = await rootRowIds(page);
    log(`에디터 root 항목 수: ${editorBefore.length}`);
    await recordEvidence('header-page-a-before');

    log(`커스텀 항목 추가+구성 (label="${QA_LABEL_A}", href="${QA_HREF}")`);
    const addedId = await addCustomNavItem(page, QA_LABEL_A, QA_HREF);
    if (!addedId) {
      findings.push({
        severity: 'blocker',
        summary: '커스텀 네비게이션 항목 추가/구성(추가→편집→저장) 흐름을 완료하지 못함',
      });
      await recordEvidence('header-add-failed');
      return { findings };
    }

    log('페이지 A header 에 커스텀 항목 반영 확인');
    const reflectedA = await waitForHeaderText(page, QA_LABEL_A);
    if (!reflectedA) {
      findings.push({
        severity: 'blocker',
        summary: `추가한 커스텀 항목("${QA_LABEL_A}")이 페이지 A header 에 반영되지 않음`,
      });
    }
    await recordEvidence('header-page-a-added');

    log(`동일 항목을 "${QA_LABEL_B}" 로 개명 → header 라벨 갱신 확인`);
    const renamed = await renameNavItemById(page, addedId, QA_LABEL_B);
    if (!renamed) {
      findings.push({
        severity: 'blocker',
        summary: '커스텀 항목 개명(편집→라벨→저장) 흐름을 완료하지 못함',
      });
    } else {
      const reflectedRename = await waitForHeaderText(page, QA_LABEL_B);
      if (!reflectedRename) {
        findings.push({
          severity: 'blocker',
          summary: `개명한 라벨("${QA_LABEL_B}")이 페이지 A header 에 반영되지 않음`,
        });
      }
    }
    await recordEvidence('header-page-a-renamed');

    log('페이지 B 로 전환 (글로벌 공유 증명)');
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.waitForTimeout(300);
    const result = await switchToDifferentPage(page);
    if (result.pageCount > 0 && result.pageCount < 2) {
      findings.push({
        severity: 'visual',
        summary: '페이지가 1개뿐이라 페이지 간 header 비교 불가 (fixture 제약)',
      });
    } else if (!result.switched) {
      findings.push({
        severity: 'blocker',
        summary: `다른 페이지로 전환 실패 — ${result.reason ?? ''}`,
      });
      await recordEvidence('header-switch-failed');
    } else {
      await waitForStableCanvas(page);
      log('페이지 B header 에 동일 라벨 반영 확인 (글로벌 증명)');
      const reflectedB = await waitForHeaderText(page, QA_LABEL_B, 7000);
      if (!reflectedB) {
        findings.push({
          severity: 'blocker',
          summary: `개명한 header 값("${QA_LABEL_B}")이 페이지 B header 에 반영되지 않음 — header 가 글로벌 공유 아님`,
        });
      }
      await recordEvidence('header-page-b-renamed');
    }

    log('복원: 추가한 커스텀 항목 삭제');
    await openNavEditor(page).catch(() => undefined);
    await page.waitForTimeout(2000);
    const deleted = await deleteNavItem(page, addedId);
    if (!deleted) {
      findings.push({
        severity: 'visual',
        summary: '추가 항목 삭제 버튼이 노출되지 않아 복원(삭제) 검증 생략',
      });
    } else {
      const editorAfter = await rootRowIds(page);
      if (editorAfter.length !== editorBefore.length) {
        findings.push({
          severity: 'visual',
          summary: `삭제 후 에디터 항목 수가 원래로 돌아가지 않음 (before=${editorBefore.length}, after=${editorAfter.length})`,
        });
      }
    }
    await recordEvidence('header-restored');

    return { findings };
  },
};
