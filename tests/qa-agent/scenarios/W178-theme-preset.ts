import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { dismissOverlays, gotoBuilder } from '../helpers';

// 상단바 사이트명 버튼(title = siteSettingsTitle) → 사이트 설정 모달 진입.
const SETTINGS_TITLE_LABELS = ['사이트 설정', 'Site settings', '網站設定'];
const PRESETS_TAB_LABELS = ['프리셋', 'Presets', '預設'];
const GENERAL_TAB_LABELS = ['일반', 'General', '一般'];
const SAVE_THEME_BUTTON_LABELS = ['내 테마로 저장', 'Save as My Theme', '儲存為我的主題'];
const APPLY_MY_THEME_LABELS = ['내 테마 적용', 'Apply My Theme', '套用我的主題'];
const DELETE_LABELS = ['삭제', 'Delete', '刪除'];

// preset name 은 사용자 입력이 아니라 copy.modal.myThemeName(firmName) = `${firmName} My Theme`
// 로 자동 생성된다 (SiteSettingsModal.tsx saveCurrentThemePreset). 따라서 'QA테마' 라는 이름을
// 붙이려면 먼저 General 탭의 firmName 을 'QA테마' 로 설정해야 preset 이름이 'QA테마 My Theme' 가 된다.
const QA_FIRM_NAME = 'QA테마';

function settingsEntryButton(page: Page) {
  return page
    .locator(
      SETTINGS_TITLE_LABELS.map((label) => `button[title="${label}"]`).join(', '),
    )
    .first();
}

function modalShell(page: Page) {
  return page.locator('[data-site-settings-modal-shell="true"]');
}

function tabButton(page: Page, labels: string[]) {
  return modalShell(page)
    .locator('button')
    .filter({ hasText: new RegExp(labels.join('|')) })
    .first();
}

// General 탭 firmName 입력 (input[type="text"] 중 첫 번째 — W21 과 동일 가정).
function firmNameInput(page: Page) {
  return modalShell(page).locator('input[type="text"]').first();
}

function customPresetCardByName(page: Page, nameNeedle: string) {
  return modalShell(page)
    .locator('[data-custom-theme-preset]')
    .filter({ hasText: nameNeedle });
}

// Presets 탭 radius 카드는 `theme.effects.radiusPreset` 를 `data-active` 로 반영한다
// (SiteSettingsPresetsTab.tsx). 커스텀 테마 적용(applyCustomThemePreset)은
// setTheme(normalizeDesignTokenTheme(preset.theme)) 로 theme.effects 까지 복원하므로,
// "내 테마 적용" 후 radius active 마커가 저장 시점(baseline)으로 돌아가는지로
// 적용 성공 여부를 판정한다 (토스트 알림 의존 제거).
const RADIUS_PRESET_KEYS = ['sharp', 'medium', 'soft'] as const;

function activeRadiusPresetKey(page: Page): Promise<string | null> {
  return modalShell(page)
    .locator('[data-theme-radius-preset][data-active="true"]')
    .first()
    .getAttribute('data-theme-radius-preset')
    .catch(() => null);
}

export const W178_themePreset: CheckpointDefinition = {
  id: 'W178',
  title: '테마 프리셋: 현재 스타일을 "QA테마" 로 저장 → 목록 등장 → 불러오기(theme 효과 검증) → 삭제(cleanup)',
  verification:
    '사이트 설정 → (General firmName=QA테마) → Presets 탭 "내 테마로 저장" → QA테마 카드 등장 → radius active 마커(baseline) 캡처 → radius 변경 → "내 테마 적용" → radius 마커가 baseline 로 복원되어 적용 효과 확인 → cleanup: 삭제',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    log('잔여 popover/drawer 정리 (Escape x2)');
    await dismissOverlays(page);

    const findings: CheckpointFinding[] = [];

    log('상단바 사이트 설정 진입 버튼 탐색');
    const entryBtn = settingsEntryButton(page);
    const entryVisible = await entryBtn.isVisible().catch(() => false);
    if (!entryVisible) {
      findings.push({
        severity: 'blocker',
        summary: `상단바 사이트 설정 진입 버튼(title=${SETTINGS_TITLE_LABELS.join('/')})을 찾을 수 없음`,
      });
      await recordEvidence('theme-preset-entry-missing');
      return { findings };
    }
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
      await recordEvidence('theme-preset-modal-not-open');
      return { findings };
    }
    await recordEvidence('theme-preset-modal-open');

    // 1) General 탭에서 firmName 을 QA_FIRM_NAME 으로 설정 (preset 이름을 'QA테마 My Theme' 로 만들기 위해).
    log('General 탭 이동 → firmName 캡처/설정');
    await tabButton(page, GENERAL_TAB_LABELS).click({ force: true });
    await page.waitForTimeout(250);
    const firmInput = firmNameInput(page);
    const firmVisible = await firmInput.waitFor({ state: 'visible', timeout: 8_000 }).then(() => true).catch(() => false);
    if (!firmVisible) {
      findings.push({
        severity: 'blocker',
        summary: 'General 탭의 firmName 입력 필드를 찾지 못함 (preset 이름 제어 불가)',
      });
      await recordEvidence('theme-preset-firm-field-missing');
      return { findings };
    }
    const originalFirm = await firmInput.inputValue().catch(() => '');
    log(`변경 전 firmName: "${originalFirm}"`);
    await firmInput.click({ force: true });
    await firmInput.fill(QA_FIRM_NAME);
    await firmInput.press('Tab');
    await page.waitForTimeout(150);

    // 2) Presets 탭 이동 → "내 테마로 저장" 클릭.
    log('Presets 탭 이동');
    await tabButton(page, PRESETS_TAB_LABELS).click({ force: true });
    await page.waitForTimeout(250);
    await recordEvidence('theme-preset-presets-tab');

    // 미리 존재할 수 있는 동일 이름 카드 정리(중복 방지) — 저장 전 제거 시도.
    const preExisting = customPresetCardByName(page, QA_FIRM_NAME);
    if ((await preExisting.count().catch(() => 0)) > 0) {
      log('이전 실행 잔류 QA테마 프리셋 사전 삭제');
      await preExisting
        .first()
        .locator('button', { hasText: new RegExp(DELETE_LABELS.join('|')) })
        .click({ force: true })
        .catch(() => undefined);
      await page.waitForTimeout(200);
    }

    const saveThemeBtn = modalShell(page)
      .locator('button', { hasText: new RegExp(SAVE_THEME_BUTTON_LABELS.join('|')) })
      .first();
    const saveThemeVisible = await saveThemeBtn.isVisible().catch(() => false);
    if (!saveThemeVisible) {
      findings.push({
        severity: 'blocker',
        summary: `"내 테마로 저장" 버튼(${SAVE_THEME_BUTTON_LABELS.join('/')})을 찾지 못함`,
      });
      await recordEvidence('theme-preset-save-button-missing');
      return { findings };
    }
    log('"내 테마로 저장" 클릭');
    await saveThemeBtn.click({ force: true });
    await page.waitForTimeout(350);
    await recordEvidence('theme-preset-saved');

    // 3) QA테마 프리셋 카드가 목록에 등장했는지 확인.
    log(`"${QA_FIRM_NAME}" 이름의 커스텀 프리셋 카드 등장 확인`);
    const qaCard = customPresetCardByName(page, QA_FIRM_NAME);
    const cardCount = await qaCard.count().catch(() => 0);
    log(`QA테마 프리셋 카드 수: ${cardCount}`);
    if (cardCount === 0) {
      findings.push({
        severity: 'blocker',
        summary: `"내 테마로 저장" 후 "${QA_FIRM_NAME}" 이름의 프리셋 카드(data-custom-theme-preset)가 목록에 등장하지 않음`,
        detail:
          'preset 이름은 copy.modal.myThemeName(firmName)="${firmName} My Theme" 로 자동 생성됨. firmName 미반영 시 이름 매칭 실패 가능.',
      });
      await recordEvidence('theme-preset-card-not-listed');
      return { findings };
    }
    await recordEvidence('theme-preset-card-listed');

    // 4) 적용 효과 검증 준비: 현재 radius active 마커(baseline) 캡처.
    //    저장된 커스텀 테마는 baseline theme.effects 를 그대로 담고 있으므로,
    //    적용 후 이 마커가 복원되어야 한다.
    const baselineRadius = await activeRadiusPresetKey(page);
    log(`baseline radius active 마커: "${baselineRadius}"`);

    // 5) theme state 를 의도적으로 변경 — baseline 과 다른 radius 프리셋 적용.
    //    active 마커가 이동하여 theme.effects.radiusPreset 관측 채널이 살아있음을 확인.
    const differentRadius =
      RADIUS_PRESET_KEYS.find((key) => key !== baselineRadius) ?? 'sharp';
    const differentRadiusBtn = modalShell(page).locator(
      `[data-theme-radius-preset="${differentRadius}"] button`,
    );
    if ((await differentRadiusBtn.count().catch(() => 0)) > 0) {
      await differentRadiusBtn.first().click({ force: true });
      await page.waitForTimeout(250);
      const movedKey = await activeRadiusPresetKey(page);
      log(`radius "${differentRadius}" 적용 후 active 마커: "${movedKey}"`);
      if (movedKey !== differentRadius) {
        findings.push({
          severity: 'minor',
          summary: `radius 프리셋("${differentRadius}") 적용 후 active 마커가 이동하지 않음 (현재="${movedKey}") — theme.effects 관측 채널 불안정`,
        });
      }
    } else {
      findings.push({
        severity: 'minor',
        summary: `baseline 과 다른 radius 프리셋 버튼("${differentRadius}")을 찾지 못해 theme state 변경 단계를 건너뜀`,
      });
    }

    // 6) "내 테마 적용" 클릭 → 토스트 알림이 아닌 실제 효과(radius 마커 복원)로 판정.
    log('"내 테마 적용" 클릭 → radius 마커 복원으로 적용 효과 검증');
    const applyBtn = qaCard
      .first()
      .locator('button', { hasText: new RegExp(APPLY_MY_THEME_LABELS.join('|')) })
      .first();
    const applyVisible = await applyBtn.isVisible().catch(() => false);
    if (!applyVisible) {
      findings.push({
        severity: 'blocker',
        summary: `QA테마 프리셋 카드의 "내 테마 적용" 버튼(${APPLY_MY_THEME_LABELS.join('/')})을 찾지 못함`,
      });
    } else {
      await applyBtn.click({ force: true });
      await page.waitForTimeout(350);
      const restoredRadius = await activeRadiusPresetKey(page);
      log(`"내 테마 적용" 후 radius active 마커: "${restoredRadius}" (기대 baseline="${baselineRadius}")`);
      // 핵심 효과 단언: 저장된 테마 적용 → baseline radius 로 복원.
      if (baselineRadius && restoredRadius === baselineRadius) {
        log('적용 효과 확인: radius 마커가 baseline 로 복원됨');
      } else if (baselineRadius) {
        findings.push({
          severity: 'minor',
          summary: `"내 테마 적용" 후 radius active 마커가 baseline("${baselineRadius}")으로 복원되지 않음 (현재="${restoredRadius}") — applyCustomThemePreset 이 theme.effects 를 완전 복원하지 못했을 수 있음`,
        });
      } else {
        findings.push({
          severity: 'minor',
          summary: 'baseline radius 마커를 캡처하지 못해 적용 복원 효과를 단언할 수 없음 (적용 동작 자체는 실행됨)',
        });
      }
    }
    await recordEvidence('theme-preset-applied');

    // 5) cleanup: QA테마 프리셋 삭제.
    log('cleanup: QA테마 프리셋 삭제');
    const cardForDelete = customPresetCardByName(page, QA_FIRM_NAME);
    const remaining = await cardForDelete.count().catch(() => 0);
    let deleted = false;
    if (remaining > 0) {
      await cardForDelete
        .first()
        .locator('button', { hasText: new RegExp(DELETE_LABELS.join('|')) })
        .click({ force: true })
        .catch(() => undefined);
      await page.waitForTimeout(300);
      const afterDelete = await customPresetCardByName(page, QA_FIRM_NAME).count().catch(() => 0);
      deleted = afterDelete === 0;
      log(`삭제 후 QA테마 프리셋 카드 수: ${afterDelete}`);
    }
    if (!deleted) {
      findings.push({
        severity: 'visual',
        summary: 'cleanup 실패(harness concern) — QA테마 커스텀 프리셋 삭제를 확인하지 못함 (localStorage 잔류 가능)',
      });
    }

    // 모달 취소 → firmName 변경은 서버에 저장하지 않았으므로 자동 폐기됨.
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.waitForTimeout(200);
    await recordEvidence('theme-preset-cleaned-up');

    return { findings };
  },
};
