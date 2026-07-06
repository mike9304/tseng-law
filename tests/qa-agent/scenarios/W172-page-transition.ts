import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { dismissOverlays, gotoBuilder } from '../helpers';

// 페이지 전환(Page transition) 은 인스펙터가 아니라 사이트 설정 → 고급(Advanced) 탭에 있음(사이트 레벨 설정).
const SETTINGS_TITLE_LABELS = ['사이트 설정', 'Site settings', '網站設定'];
const ADVANCED_TAB_LABELS = ['고급', 'Advanced', '進階'];
const PAGE_TRANSITION_LABELS = ['페이지 전환', 'Page transition', '頁面轉場'];
const DURATION_LABELS = ['지속 시간', 'Duration', '持續時間'];

function settingsEntryButton(page: Page) {
  return page
    .locator(SETTINGS_TITLE_LABELS.map((label) => `button[title="${label}"]`).join(', '))
    .first();
}

function modalShell(page: Page) {
  return page.locator('[data-site-settings-modal-shell="true"]');
}

function advancedTabButton(page: Page) {
  return modalShell(page)
    .locator('button')
    .filter({ hasText: new RegExp(ADVANCED_TAB_LABELS.join('|')) })
    .first();
}

function pageTransitionCombo(page: Page) {
  return modalShell(page).getByRole('combobox', { name: new RegExp(PAGE_TRANSITION_LABELS.join('|')) }).first();
}

function durationInput(page: Page) {
  return modalShell(page).getByRole('spinbutton', { name: new RegExp(DURATION_LABELS.join('|')) }).first();
}

export const W172_pageTransition: CheckpointDefinition = {
  id: 'W172',
  title: '페이지 전환(Page transition): 사이트 설정 → 고급 → fade/slide-up/scale 선택 → 적용(duration 활성화) → 복원',
  verification:
    '사이트 설정 모달 → 고급 탭 → 페이지 전환을 fade/slide-up/scale 로 변경 → 콤보박스 값 반영 + 지속 시간 컨트롤 활성화(preset=none 게이트 해제) + 지속 시간 값 설정 → 원래값 복원',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);
    log('잔여 overlay 정리 (Escape x2)');
    await dismissOverlays(page);

    const findings: CheckpointFinding[] = [];

    log('상단바 사이트 설정 진입');
    const entryBtn = settingsEntryButton(page);
    if (!(await entryBtn.isVisible().catch(() => false))) {
      findings.push({
        severity: 'blocker',
        summary: `상단바 사이트 설정 진입 버튼(title=${SETTINGS_TITLE_LABELS.join('/')})을 찾을 수 없음`,
      });
      await recordEvidence('w172-settings-entry-missing');
      return { findings };
    }
    await entryBtn.click({ force: true });
    const shellVisible = await modalShell(page)
      .waitFor({ state: 'visible', timeout: 10_000 })
      .then(() => true)
      .catch(() => false);
    if (!shellVisible) {
      findings.push({ severity: 'blocker', summary: '사이트 설정 모달(data-site-settings-modal-shell)이 열리지 않음' });
      await recordEvidence('w172-settings-modal-not-open');
      return { findings };
    }

    log('고급(Advanced) 탭 진입');
    await advancedTabButton(page).click({ force: true });
    await page.waitForTimeout(250);

    const combo = pageTransitionCombo(page);
    if ((await combo.count().catch(() => 0)) === 0) {
      findings.push({
        severity: 'blocker',
        summary: '페이지 전환(Page transition) 콤보박스를 찾을 수 없음 — 고급 탭에 Motion 섹션이 없을 수 있음',
      });
      await recordEvidence('w172-page-transition-combo-missing');
      await page.keyboard.press('Escape').catch(() => undefined);
      return { findings };
    }

    const original = await combo.inputValue().catch(() => '');
    log(`현재 페이지 전환: "${original}"`);

    const durInput = durationInput(page);
    const durationGateBefore = await durInput.isDisabled().catch(() => true);
    log(`지속 시간 disabled(변경 전, none 게이트): ${durationGateBefore}`);

    for (const value of ['fade', 'slide-up', 'scale'] as const) {
      log(`페이지 전환 → ${value}`);
      await combo.selectOption(value);
      await page.waitForTimeout(220);
      const applied = await combo.inputValue().catch(() => '');
      const durationDisabled = await durInput.isDisabled().catch(() => true);
      log(`적용 후 값="${applied}", 지속 시간 disabled=${durationDisabled}`);
      await recordEvidence(`w172-${value}-applied`);
      if (applied !== value) {
        findings.push({
          severity: 'blocker',
          summary: `페이지 전환이 ${value}(으)로 commit 되지 않음 (현재="${applied}")`,
        });
      }
      if (durationDisabled) {
        findings.push({
          severity: 'visual',
          summary: `${value} 적용 후에도 지속 시간(Duration) 컨트롤이 비활성 상태임 (preset=none 게이트가 풀리지 않음)`,
        });
      }
    }

    // 지속 시간 값 설정(적용) 검증.
    if (!(await durInput.isDisabled().catch(() => true))) {
      const target = 360;
      const before = Number(await durInput.inputValue().catch(() => '0'));
      log(`지속 시간 ${before} → ${target}`);
      await durInput.fill(String(target));
      await durInput.press('Enter');
      await page.waitForTimeout(220);
      const committed = Number(await durInput.inputValue().catch(() => '0'));
      log(`지속 시간 commit 후="${committed}"`);
      await recordEvidence('w172-duration-set');
      if (committed !== target) {
        findings.push({
          severity: 'blocker',
          summary: `페이지 전환 지속 시간(${target}ms)이 commit 되지 않음 (현재="${committed}")`,
        });
      }
    }

    log('cleanup: 원래 페이지 전환값으로 복원');
    await combo.selectOption(original || 'none').catch(() => undefined);
    await page.waitForTimeout(200);
    const restored = await combo.inputValue().catch(() => '');
    log(`복원 후 값="${restored}" (기대 "${original}")`);
    if (restored !== original) {
      findings.push({
        severity: 'minor',
        summary: `페이지 전환이 원래값("${original}")으로 복원되지 않음 (현재="${restored}")`,
      });
    }
    await recordEvidence('w172-restored');

    // 모달 닫기(취소/폐기).
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.waitForTimeout(200);

    return { findings };
  },
};
