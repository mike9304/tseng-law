import type { Locator, Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { dismissOverlays, gotoBuilder, selectFirstNode, SHORTCUT_MODIFIER } from '../helpers';

// 애니메이션 파라미터 — 등장(Entrance) 섹션의 delay / duration / triggerOnce.
const ENTRANCE_PRESET_LABELS = ['등장 프리셋', 'Entrance preset', '進場預設'];

function inspector(page: Page) {
  return page.locator('[data-builder-inspector-panel="true"]');
}

function animationsTabButton(page: Page) {
  return inspector(page).getByRole('button', { name: /^(animations|애니메이션|動畫)$/i }).first();
}

function entrancePresetCombo(page: Page) {
  return inspector(page).getByRole('combobox', { name: new RegExp(ENTRANCE_PRESET_LABELS.join('|')) }).first();
}

function sectionOf(locator: Locator): Locator {
  return locator.locator('xpath=ancestor::section[1]');
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export const W175_animParams: CheckpointDefinition = {
  id: 'W175',
  title: '애니메이션 파라미터: delay / duration / triggerOnce 설정 → 적용 → 복원',
  verification:
    '노드 선택 → 애니메이션 탭 → 등장 섹션의 duration(시간 ms) / delay(지연 ms) / triggerOnce(한 번만 실행) 값을 변경 → 각 컨트롤에 commit 반영 확인 → 원래값으로 복원',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);
    log('잔여 overlay 정리 (Escape x2)');
    await dismissOverlays(page);

    const findings: CheckpointFinding[] = [];

    log('노드 선택');
    await selectFirstNode(page);

    log('애니메이션 탭 진입');
    const tabBtn = animationsTabButton(page);
    if (!(await tabBtn.isVisible().catch(() => false))) {
      findings.push({ severity: 'blocker', summary: '인스펙터에 애니메이션(Animations) 탭 버튼이 보이지 않음' });
      await recordEvidence('w175-anim-tab-missing');
      return { findings };
    }
    await tabBtn.click({ force: true });
    await page.waitForTimeout(350);

    const entranceCombo = entrancePresetCombo(page);
    if ((await entranceCombo.count().catch(() => 0)) === 0) {
      findings.push({ severity: 'blocker', summary: '등장 프리셋(Entrance preset) 콤보박스를 찾을 수 없음' });
      await recordEvidence('w175-entrance-combo-missing');
      return { findings };
    }

    const entranceSection = sectionOf(entranceCombo);
    const durationInput = entranceSection.getByRole('spinbutton', { name: /시간 \(ms\)|Duration \(ms\)/ }).first();
    const delayInput = entranceSection.getByRole('spinbutton', { name: /지연 \(ms\)|Delay \(ms\)/ }).first();
    const triggerCheckbox = entranceSection.getByRole('checkbox').first();

    // ----- duration (100..3000) -----
    if ((await durationInput.count().catch(() => 0)) === 0) {
      findings.push({ severity: 'blocker', summary: '등장 duration(시간 ms) 입력을 찾을 수 없음' });
    } else {
      const origDuration = Number(await durationInput.inputValue().catch(() => '600'));
      const targetDuration = origDuration >= 2500 ? clamp(origDuration - 200, 100, 3000) : clamp(origDuration + 200, 100, 3000);
      log(`duration ${origDuration} → ${targetDuration}`);
      await durationInput.fill(String(targetDuration));
      await durationInput.press('Enter');
      await page.waitForTimeout(250);
      const committed = Number(await durationInput.inputValue().catch(() => '0'));
      log(`duration commit 후="${committed}"`);
      await recordEvidence('w175-duration-set');
      if (committed !== targetDuration) {
        findings.push({
          severity: 'blocker',
          summary: `등장 duration(${targetDuration})이 commit 되지 않음 (현재="${committed}")`,
        });
      }
    }

    // ----- delay (0..3000) -----
    if ((await delayInput.count().catch(() => 0)) === 0) {
      findings.push({ severity: 'blocker', summary: '등장 delay(지연 ms) 입력을 찾을 수 없음' });
    } else {
      const origDelay = Number(await delayInput.inputValue().catch(() => '0'));
      const targetDelay = origDelay >= 2500 ? clamp(origDelay - 200, 0, 3000) : clamp(origDelay + 200, 0, 3000);
      log(`delay ${origDelay} → ${targetDelay}`);
      await delayInput.fill(String(targetDelay));
      await delayInput.press('Enter');
      await page.waitForTimeout(250);
      const committed = Number(await delayInput.inputValue().catch(() => '0'));
      log(`delay commit 후="${committed}"`);
      await recordEvidence('w175-delay-set');
      if (committed !== targetDelay) {
        findings.push({
          severity: 'blocker',
          summary: `등장 delay(${targetDelay})가 commit 되지 않음 (현재="${committed}")`,
        });
      }
    }

    // ----- triggerOnce (체크박스 토글) -----
    if ((await triggerCheckbox.count().catch(() => 0)) === 0) {
      findings.push({ severity: 'blocker', summary: '등장 triggerOnce(한 번만 실행) 체크박스를 찾을 수 없음' });
    } else {
      const origChecked = await triggerCheckbox.isChecked().catch(() => false);
      log(`triggerOnce 현재="${origChecked}" → 토글`);
      await triggerCheckbox.setChecked(!origChecked).catch(() => undefined);
      await page.waitForTimeout(250);
      const flipped = await triggerCheckbox.isChecked().catch(() => origChecked);
      log(`triggerOnce 토글 후="${flipped}"`);
      await recordEvidence('w175-trigger-toggled');
      if (flipped === origChecked) {
        findings.push({
          severity: 'blocker',
          summary: `triggerOnce 체크박스 토글이 반영되지 않음 (변경 전후 동일="${origChecked}")`,
        });
      }
    }

    log('cleanup: undo 로 변경 이력을 되돌림 + 수동 복원 보정');
    // duration / delay / trigger 변경(최대 3 mutation) → undo 3회.
    for (let i = 0; i < 3; i += 1) {
      await page.keyboard.press(`${SHORTCUT_MODIFIER}+z`);
      await page.waitForTimeout(150);
    }
    await recordEvidence('w175-restored');

    return { findings };
  },
};
