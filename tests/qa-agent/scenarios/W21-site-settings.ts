import { expect, type Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { dismissOverlays, canvasEditor, gotoBuilder } from '../helpers';

// 사이트 설정 모달 진입점: 상단바 사이트명 버튼 (title = siteSettingsTitle).
const SETTINGS_TITLE_LABELS = ['사이트 설정', 'Site settings', '網站設定'];

function settingsEntryButton(page: Page) {
  return page
    .locator(
      SETTINGS_TITLE_LABELS.map(
        (label) => `button[title="${label}"]`,
      ).join(', '),
    )
    .first();
}

function modalShell(page: Page) {
  return page.locator('[data-site-settings-modal-shell="true"]');
}

// General 탭의 firmName 입력. fields 배열 첫 항목이 firmName 이며 type 이 명시되지 않아
// input[type="text"] 중 첫 번째가 firmName 이다 (phone=tel, email=email, logo=url 등 제외).
function firmNameInput(page: Page) {
  return modalShell(page).locator('input[type="text"]').first();
}

function saveButton(page: Page) {
  // 저장 버튼은 SiteSettingsModal 이 아니라 ModalShell 의 footer 액션으로 렌더된다.
  // ModalShell 은 children(data-site-settings-modal-shell div) 과 footer 액션을 형제로
  // 두므로, inner shell div 안에서 찾으면 절대 보이지 않는다. 모달 전체(backdrop) 기준.
  return page
    .locator('[data-modal-shell="true"]')
    .locator('button', {
      hasText: /^(저장|Save|儲存)$/,
    })
    .last();
}

// 상단바 브랜드 텍스트 (siteName 표시 영역).
function topbarBrandText(page: Page): Promise<string> {
  return settingsEntryButton(page).innerText().then((t) => t.replace(/\s+/g, ' ').trim());
}

export const W21_siteSettings: CheckpointDefinition = {
  id: 'W21',
  title: '사이트 설정 모달: 사무소 이름 변경 → 저장 → 상단바 브랜드 반영 → 복원',
  verification:
    '상단바 사이트명 클릭 → 설정 모달 오픈 → General 탭 firmName 을 QA값으로 변경 → 저장 → 상단바 브랜드 텍스트 갱신 확인 → 원래값으로 복원',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    // Hard rule 1: 이전 시나리오가 남긴 popover/drawer 정리.
    log('잔여 popover/drawer 정리 (Escape x2)');
    await dismissOverlays(page);

    const findings: CheckpointFinding[] = [];
    const QA_NAME = 'QA설정검증';

    log('상단바 사이트명(설정 진입) 버튼 탐색');
    const entryBtn = settingsEntryButton(page);
    const entryVisible = await entryBtn.isVisible().catch(() => false);
    if (!entryVisible) {
      findings.push({
        severity: 'blocker',
        summary: `상단바 사이트 설정 진입 버튼(title=${SETTINGS_TITLE_LABELS.join('/')})을 찾을 수 없음`,
      });
      await recordEvidence('settings-entry-missing');
      return { findings };
    }
    const originalBrand = await topbarBrandText(page);
    log(`변경 전 상단바 브랜드 텍스트: "${originalBrand}"`);
    await recordEvidence('settings-entry-visible');

    log('설정 모달 오픈');
    await entryBtn.click({ force: true });
    const shellVisible = await modalShell(page)
      .waitFor({ state: 'visible', timeout: 10_000 })
      .then(() => true)
      .catch(() => false);
    if (!shellVisible) {
      findings.push({
        severity: 'blocker',
        summary: '사이트 설정 모달(data-site-settings-modal-shell)이 열리지 않음',
      });
      await recordEvidence('settings-modal-not-open');
      return { findings };
    }
    await recordEvidence('settings-modal-open');

    log('General 탭 firmName 입력 필드 확인');
    const firmInput = firmNameInput(page);
    const firmVisible = await firmInput.waitFor({ state: 'visible', timeout: 8_000 }).then(() => true).catch(() => false);
    if (!firmVisible) {
      findings.push({
        severity: 'blocker',
        summary: 'General 탭의 firmName(사무소 이름) 입력 필드를 찾지 못함',
      });
      await recordEvidence('firm-field-missing');
      return { findings };
    }
    const originalFirm = await firmInput.inputValue().catch(() => '');
    log(`변경 전 firmName: "${originalFirm}"`);

    log(`firmName 을 "${QA_NAME}" 으로 변경`);
    await firmInput.click({ force: true });
    await firmInput.fill(QA_NAME);
    await firmInput.press('Tab');
    await page.waitForTimeout(200);
    await recordEvidence('firm-name-changed');

    log('저장 버튼 클릭 (ModalShell footer 액션)');
    const save = saveButton(page);
    const saveVisible = await save.isVisible().catch(() => false);
    if (!saveVisible) {
      findings.push({
        severity: 'blocker',
        summary: '사이트 설정 모달의 저장 버튼(저장/Save/儲存 — ModalShell footer)을 찾지 못함',
      });
      await recordEvidence('save-button-missing');
      return { findings };
    }
    await save.click({ force: true });
    // handleSave() 는 저장 성공 시 onClose() 로 모달을 닫는다. 모달 닫힘을 저장 완료 신호로 사용.
    await expect
      .poll(async () => modalShell(page).isVisible().catch(() => false), { timeout: 8_000 })
      .toBe(false)
      .catch(() => undefined);
    await page.waitForTimeout(300);

    log('저장 직후 상단바 브랜드 텍스트 확인 (즉시 반영 여부)');
    const afterBrand = await topbarBrandText(page).catch(() => '');
    log(`저장 직후 상단바 브랜드 텍스트: "${afterBrand}"`);
    const immediatelyReflected = afterBrand.includes(QA_NAME);
    await recordEvidence('brand-after-save');

    // 결정적 지속 검증: 상단바 siteName 은 server prop 이라 저장 직후가 아니라
    // reload 후에 갱신된다. reload 하여 브랜드에 QA 이름이 반영됐는지 확인한다.
    log('페이지 reload 후 상단바 브랜드 반영 확인');
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 60_000 });
    await expect(canvasEditor(page)).toBeVisible({ timeout: 30_000 });
    await expect(canvasEditor(page)).toHaveAttribute('data-builder-hydrated', 'true', { timeout: 30_000 });
    await settingsEntryButton(page)
      .waitFor({ state: 'visible', timeout: 20_000 })
      .catch(() => undefined);
    const reloadedBrand = await topbarBrandText(page).catch(() => '');
    log(`reload 후 상단바 브랜드 텍스트: "${reloadedBrand}"`);
    const persistedOnReload = reloadedBrand.includes(QA_NAME);
    await recordEvidence('brand-after-reload');

    if (!persistedOnReload) {
      findings.push({
        severity: 'blocker',
        summary: `reload 후에도 상단바 브랜드에 "${QA_NAME}" 이 반영되지 않음 (현재: "${reloadedBrand}") — 저장 미반영`,
      });
    } else if (!immediatelyReflected) {
      findings.push({
        severity: 'minor',
        summary: `저장은 지속됐으나 상단바 브랜드에 "${QA_NAME}" 이 즉시 반영되지 않고 reload 후에만 반영됨 (저장 직후: "${afterBrand}") — siteName server prop 갱신에 reload 필요`,
      });
    }
    await recordEvidence('firm-name-persisted');

    log('cleanup: firmName 을 원래값으로 복원 + reload');
    await dismissOverlays(page).catch(() => undefined);
    if (await settingsEntryButton(page).isVisible().catch(() => false)) {
      await settingsEntryButton(page).click({ force: true }).catch(() => undefined);
    }
    const reopened = await modalShell(page)
      .waitFor({ state: 'visible', timeout: 8_000 })
      .then(() => true)
      .catch(() => false);
    let restored = false;
    if (reopened) {
      const restoreInput = firmNameInput(page);
      await restoreInput.waitFor({ state: 'visible', timeout: 6_000 }).catch(() => undefined);
      await restoreInput.click({ force: true }).catch(() => undefined);
      await restoreInput.fill(originalFirm);
      await saveButton(page).click({ force: true }).catch(() => undefined);
      await expect
        .poll(async () => modalShell(page).isVisible().catch(() => false), { timeout: 8_000 })
        .toBe(false)
        .catch(() => undefined);
      await page.reload({ waitUntil: 'domcontentloaded', timeout: 60_000 }).catch(() => undefined);
      await expect(canvasEditor(page)).toBeVisible({ timeout: 30_000 }).catch(() => undefined);
      log('복원 저장 + reload 완료');
      restored = true;
    }
    if (!restored) {
      findings.push({
        severity: 'visual',
        summary: 'cleanup 실패(harness concern) — 복원을 위해 설정 모달을 다시 열지 못함',
      });
    }
    await recordEvidence('firm-name-restored');

    return { findings };
  },
};
