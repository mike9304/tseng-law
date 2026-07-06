import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { dismissOverlays, gotoBuilder } from '../helpers';

const SETTINGS_TITLE_LABELS = ['사이트 설정', 'Site settings', '網站設定'];
const TYPOGRAPHY_TAB_LABELS = ['타이포그래피', 'Typography', '字體排版'];

// typography-scale.ts TYPOGRAPHY_SCALE_RATIOS. option value 는 ratio 숫자 문자열.
const RATIO_OPTIONS = ['1.5', '1.414', '1.333', '1.25', '1.2', '1.125'];

const PREVIEW_H1_SEL = '[data-builder-typography-scale-preview-row="h1"]';

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

function ratioSelect(page: Page) {
  // aria-label="비율"(ko) / "Ratio"(en) 인 select. 폴백: 타이포그래피 탭 내 첫 select.
  return modalShell(page)
    .locator('select[aria-label="비율"], select[aria-label="Ratio"]')
    .first();
}

async function readH1PreviewPx(page: Page): Promise<number | null> {
  const text = await modalShell(page)
    .locator(PREVIEW_H1_SEL)
    .first()
    .innerText()
    .catch(() => '');
  const match = text.match(/(\d+(?:\.\d+)?)\s*px/i);
  if (!match) return null;
  const v = Number(match[1]);
  return Number.isFinite(v) ? v : null;
}

export const W184_typographyScale: CheckpointDefinition = {
  id: 'W184',
  title: '타이포그래피 스케일: 비율(1.125x/1.5x 등) 변경 → 헤딩 크기 시프트 → 복원',
  verification:
    '사이트 설정 → 타이포그래피 탭 → 비율 콤보박스 변경 → h1 미리보기 px 시프트 확인 → 원래 비율로 복원',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    log('잔여 popover/drawer 정리 (Escape x2)');
    await dismissOverlays(page);

    const findings: CheckpointFinding[] = [];

    log('상단바 사이트 설정 진입');
    const entryBtn = settingsEntryButton(page);
    const entryVisible = await entryBtn.isVisible().catch(() => false);
    if (!entryVisible) {
      findings.push({
        severity: 'blocker',
        summary: `상단바 사이트 설정 진입 버튼(title=${SETTINGS_TITLE_LABELS.join('/')})을 찾을 수 없음`,
      });
      await recordEvidence('typography-entry-missing');
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
      await recordEvidence('typography-modal-not-open');
      return { findings };
    }

    log('타이포그래피 탭 이동');
    await tabButton(page, TYPOGRAPHY_TAB_LABELS).click({ force: true });
    await page.waitForTimeout(300);
    await recordEvidence('typography-tab-open');

    // 1) 비율 콤보박스 + 미리보기 블록 존재 확인.
    log('비율 콤보박스 / 미리보기 확인');
    const select = ratioSelect(page);
    const selectVisible = await select.waitFor({ state: 'visible', timeout: 8_000 }).then(() => true).catch(() => false);
    if (!selectVisible) {
      findings.push({
        severity: 'blocker',
        summary: '타이포그래피 비율 콤보박스(select[aria-label="비율"/"Ratio"])를 찾지 못함',
      });
      await recordEvidence('typography-ratio-select-missing');
      return { findings };
    }
    const previewVisible = await modalShell(page)
      .locator('[data-builder-typography-scale-preview="true"]')
      .first()
      .isVisible()
      .catch(() => false);
    if (!previewVisible) {
      findings.push({
        severity: 'blocker',
        summary: '타이포그래피 스케일 미리보기 블록(data-builder-typography-scale-preview)이 렌더되지 않음',
      });
      await recordEvidence('typography-preview-missing');
      return { findings };
    }

    // 2) 현재 비율 + h1 px 캡처.
    const originalRatio = await select.inputValue().catch(() => '');
    const originalH1 = await readH1PreviewPx(page);
    log(`현재 비율: "${originalRatio}", h1 미리보기 px: ${originalH1}`);

    // 3) 다른 비율(큰 값 우선)로 변경 → h1 px 시프트 확인.
    const targetRatio = RATIO_OPTIONS.find((opt) => opt !== originalRatio) ?? '1.5';
    log(`비율을 "${targetRatio}"(으)로 변경`);
    await select.selectOption(targetRatio);
    await page.waitForTimeout(350);
    const changedH1 = await readH1PreviewPx(page);
    log(`변경 후 h1 미리보기 px: ${changedH1}`);
    await recordEvidence('typography-ratio-changed');

    const shifted = changedH1 !== null && originalH1 !== null && changedH1 !== originalH1;
    if (!shifted) {
      findings.push({
        severity: 'blocker',
        summary: `비율을 "${targetRatio}" 로 변경한 후 h1 미리보기 px 가 시프트하지 않음 (전=${originalH1}, 후=${changedH1}) — 스케일 반영 안됨`,
      });
    }

    // 4) 복원.
    log('cleanup: 비율 원래값으로 복원');
    if (originalRatio) {
      await select.selectOption(originalRatio).catch(() => undefined);
      await page.waitForTimeout(300);
      const restoredH1 = await readH1PreviewPx(page);
      log(`복원 후 h1 미리보기 px: ${restoredH1} (기대 ${originalH1})`);
      if (restoredH1 !== originalH1) {
        findings.push({
          severity: 'minor',
          summary: `복원 후 h1 px 가 원래값(${originalH1})으로 돌아가지 않음 (현재=${restoredH1})`,
        });
      }
    }
    await recordEvidence('typography-ratio-restored');

    // 모달 취소 — 타이포그래피 변경은 로컬 theme state 만 바꿨으므로 취소 시 폐기됨.
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.waitForTimeout(200);

    return { findings };
  },
};
