import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { gotoBuilder } from '../helpers';
import { switchToDifferentPage, waitForStableCanvas } from './_builderPageNav';

const NAV_RAIL_SEL =
  '[data-builder-rail-item="nav"], button[aria-label*="내비게이션"], button[aria-label*="Navigation"], button[aria-label*="導覽"]';
const NAV_EDITOR_SEL = '[data-builder-navigation-editor="true"]';
const NAV_ROW_SEL = '[data-builder-nav-item-row][data-depth="root"]';
const ADD_BUTTON_TEXT = ['추가', '新增', 'Add'];
const EDIT_LABELS = ['편집', '編輯', 'Edit'];
const SAVE_LABELS = ['저장', '儲存', 'Save'];
const DELETE_LABELS = ['삭제', '刪除', 'Delete'];

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

async function lastRootRowId(page: Page): Promise<string | null> {
  const rows = page.locator(`${NAV_EDITOR_SEL} ${NAV_ROW_SEL}`);
  const count = await rows.count();
  if (count === 0) return null;
  return rows.last().getAttribute('data-builder-nav-item-row');
}

async function footerSignature(page: Page): Promise<string | null> {
  const footer = page.locator('footer.site-footer').first();
  if (!(await footer.isVisible().catch(() => false))) return null;
  return (await footer.innerText().catch(() => '')).replace(/\s+/g, ' ').trim().slice(0, 120);
}

async function footerContainsText(page: Page, text: string): Promise<boolean> {
  const footer = page.locator('footer.site-footer').first();
  if (!(await footer.isVisible().catch(() => false))) return false;
  const hit = footer.getByText(text, { exact: false });
  return (await hit.count()) > 0;
}

async function addAndTagNavItem(
  page: Page,
  label: string,
  href: string,
): Promise<{ id: string | null; ok: boolean }> {
  const editor = page.locator(NAV_EDITOR_SEL).first();
  const addBtn = editor
    .locator(`button`, { hasText: new RegExp(ADD_BUTTON_TEXT.join('|')) })
    .first();
  if (!(await addBtn.isVisible().catch(() => false))) return { id: null, ok: false };
  await addBtn.click({ force: true }).catch(() => undefined);
  await page.waitForTimeout(1500);
  const id = await lastRootRowId(page);
  if (!id) return { id: null, ok: false };
  const row = editor.locator(`[data-builder-nav-item-row="${id}"]`);
  const editBtn = row
    .locator(
      `button[aria-label="${EDIT_LABELS[0]}"], button[aria-label="${EDIT_LABELS[1]}"], button[aria-label="${EDIT_LABELS[2]}"]`,
    )
    .first();
  if (!(await editBtn.isVisible().catch(() => false))) return { id, ok: false };
  await editBtn.click({ force: true }).catch(() => undefined);
  await page.waitForTimeout(350);
  const editForm = editor.locator(`[data-builder-nav-edit-id="${id}"]`);
  const inputs = editForm.locator('input');
  await inputs.nth(0).fill(label).catch(() => undefined);
  await inputs.nth(1).fill(href).catch(() => undefined);
  const saveBtn = editForm
    .locator(`button`, { hasText: new RegExp(SAVE_LABELS.join('|')) })
    .first();
  await saveBtn.click({ force: true }).catch(() => undefined);
  await page.waitForTimeout(1500);
  return { id, ok: true };
}

async function deleteNavItem(page: Page, id: string): Promise<void> {
  const editor = page.locator(NAV_EDITOR_SEL).first();
  const row = editor.locator(`[data-builder-nav-item-row="${id}"]`);
  const deleteBtn = row
    .locator(
      `button[aria-label="${DELETE_LABELS[0]}"], button[aria-label="${DELETE_LABELS[1]}"], button[aria-label="${DELETE_LABELS[2]}"]`,
    )
    .first();
  if (await deleteBtn.isVisible().catch(() => false)) {
    await deleteBtn.click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(1200);
  }
}

export const W20_globalFooterDeep: CheckpointDefinition = {
  id: 'W20',
  title: 'Footer 글로벌 공유 — 편집이 다른 페이지 footer 에도 동일 반영',
  verification: 'footer(nav 추가링크) 편집 → 페이지 A footer 반영 → B 전환 → 동일 반영 → 복원',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입 (페이지 A)');
    await gotoBuilder(page, baseUrl);

    const findings: CheckpointFinding[] = [];
    const token = Date.now().toString(36);
    const marker = `QAFOOT${token}`;
    const hashHref = `#qa-footer-${token}`;

    log('페이지 A 글로벌 footer 시그니처 캡처');
    const sigA = await footerSignature(page);
    if (!sigA) {
      findings.push({
        severity: 'blocker',
        summary: '글로벌 footer(footer.site-footer)를 찾을 수 없음',
      });
      await recordEvidence('footer-missing-a');
      return { findings };
    }
    await recordEvidence('footer-page-a-before');

    log('Navigation 에디터 열기 + footer 추가 링크로 들어갈 항목 추가(label/href 편집)');
    if (!(await openNavEditor(page))) {
      findings.push({
        severity: 'blocker',
        summary: 'Navigation 에디터가 열리지 않아 footer 연결 항목 추가를 수행할 수 없음',
      });
      await recordEvidence('nav-editor-missing');
      return { findings };
    }
    await page.waitForTimeout(8000);

    const added = await addAndTagNavItem(page, marker, hashHref);
    if (!added.ok) {
      findings.push({
        severity: 'blocker',
        summary: 'Navigation 항목 추가/편집(추가→라벨·href 저장) 동작을 완료하지 못함',
      });
      await recordEvidence('footer-edit-failed');
      // cleanup 시도 없이 종료
      return { findings };
    }

    log('페이지 A footer 에 marker 반영 확인');
    await page.waitForTimeout(800);
    const reflectedA = await footerContainsText(page, marker);
    if (!reflectedA) {
      findings.push({
        severity: 'blocker',
        summary: `추가한 footer 링크("${marker}")가 페이지 A footer 에 반영되지 않음`,
      });
    }
    await recordEvidence('footer-page-a-edited');

    log('페이지 B 로 전환 (lesson 1-2)');
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.waitForTimeout(300);
    const result = await switchToDifferentPage(page);
    if (result.pageCount > 0 && result.pageCount < 2) {
      findings.push({
        severity: 'visual',
        summary: '페이지가 1개뿐이라 페이지 간 footer 비교 불가 (fixture 제약)',
      });
    } else if (!result.switched) {
      findings.push({
        severity: 'blocker',
        summary: `다른 페이지로 전환 실패 — ${result.reason ?? ''}`,
      });
      await recordEvidence('footer-switch-failed');
    } else {
      await waitForStableCanvas(page);
      log('페이지 B footer 에 동일 marker 반영 확인 (글로벌 증명)');
      const reflectedB = await footerContainsText(page, marker);
      if (!reflectedB) {
        findings.push({
          severity: 'blocker',
          summary: `편집한 footer 값("${marker}")이 페이지 B footer 에 반영되지 않음 — footer 가 글로벌 공유 아님`,
        });
      }
      const sigB = await footerSignature(page);
      if (sigB && sigA !== sigB && !reflectedB) {
        findings.push({
          severity: 'visual',
          summary: '페이지마다 footer 시그니처가 다름',
        });
      }
      await recordEvidence('footer-page-b-edited');
    }

    log('복원: 추가한 항목 삭제');
    await openNavEditor(page).catch(() => undefined);
    await page.waitForTimeout(2000);
    if (added.id) {
      await deleteNavItem(page, added.id).catch(() => undefined);
    }
    await recordEvidence('footer-restored');

    return { findings };
  },
};
