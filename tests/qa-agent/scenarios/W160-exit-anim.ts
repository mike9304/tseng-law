import type { Locator, Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { dismissOverlays, gotoBuilder, selectFirstNode, SHORTCUT_MODIFIER } from '../helpers';

// 퇴장(Exit) 섹션 라벨.
const EXIT_PRESET_LABELS = ['퇴장 프리셋', 'Exit preset', '離場預設'];
const EASING_LABELS = ['이징', 'Easing'];

function inspector(page: Page) {
  return page.locator('[data-builder-inspector-panel="true"]');
}

function animationsTabButton(page: Page) {
  return inspector(page).getByRole('button', { name: /^(animations|애니메이션|動畫)$/i }).first();
}

function exitPresetCombo(page: Page) {
  return inspector(page).getByRole('combobox', { name: new RegExp(EXIT_PRESET_LABELS.join('|')) }).first();
}

function sectionOf(locator: Locator): Locator {
  return locator.locator('xpath=ancestor::section[1]');
}

export const W160_exitAnim: CheckpointDefinition = {
  id: 'W160',
  title: '퇴장(Exit) 애니메이션: exit 프리셋 선택 → 적용(duration/easing 활성화) → undo',
  verification:
    '노드 선택 → 애니메이션 탭 → 퇴장 프리셋을 fade-out/collapse 등으로 변경 → 콤보박스 값 반영 + duration/easing 컨트롤 활성화(preset=none 게이트 해제) 확인 → undo 복원',
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
      await recordEvidence('w160-anim-tab-missing');
      return { findings };
    }
    await tabBtn.click({ force: true });
    await page.waitForTimeout(350);

    const combo = exitPresetCombo(page);
    if ((await combo.count().catch(() => 0)) === 0) {
      findings.push({ severity: 'blocker', summary: '퇴장 프리셋(Exit preset) 콤보박스를 찾을 수 없음' });
      await recordEvidence('w160-exit-combo-missing');
      return { findings };
    }

    const original = await combo.inputValue().catch(() => '');
    log(`현재 퇴장 프리셋: "${original}"`);

    const exitSection = sectionOf(combo);
    const durationInput = exitSection.getByRole('spinbutton', { name: /시간 \(ms\)|Duration \(ms\)/ }).first();
    const easingCombo = exitSection.getByRole('combobox', { name: new RegExp(EASING_LABELS.join('|')) }).first();

    // preset=none 일 때 duration/easing 은 disabled 여야 함.
    const durationGateBefore = await durationInput.isDisabled().catch(() => true);
    const easingGateBefore = await easingCombo.isDisabled().catch(() => true);
    log(`duration/easing disabled(변경 전, none 게이트): ${durationGateBefore} / ${easingGateBefore}`);

    for (const value of ['fade-out', 'collapse'] as const) {
      log(`퇴장 프리셋 → ${value}`);
      await combo.selectOption(value);
      await page.waitForTimeout(250);
      const applied = await combo.inputValue().catch(() => '');
      const durationDisabled = await durationInput.isDisabled().catch(() => true);
      const easingDisabled = await easingCombo.isDisabled().catch(() => true);
      log(`적용 후 값="${applied}", duration disabled=${durationDisabled}, easing disabled=${easingDisabled}`);
      await recordEvidence(`w160-${value}-applied`);
      if (applied !== value) {
        findings.push({
          severity: 'blocker',
          summary: `퇴장 프리셋이 ${value}(으)로 commit 되지 않음 (현재="${applied}")`,
        });
      }
      if (durationDisabled) {
        findings.push({
          severity: 'visual',
          summary: `${value} 적용 후에도 퇴장 duration 컨트롤이 비활성 상태임 (preset=none 게이트가 풀리지 않음)`,
        });
      }
      if (easingDisabled) {
        findings.push({
          severity: 'visual',
          summary: `${value} 적용 후에도 퇴장 easing 컨트롤이 비활성 상태임`,
        });
      }

      log('undo 로 복원');
      await page.keyboard.press(`${SHORTCUT_MODIFIER}+z`);
      await page.waitForTimeout(400);
      const restored = await combo.inputValue().catch(() => '');
      log(`undo 후 값="${restored}" (기대 "${original}")`);
      if (restored !== original) {
        await combo.selectOption(original || 'none').catch(() => undefined);
        await page.waitForTimeout(200);
        findings.push({
          severity: 'minor',
          summary: `undo 가 ${value} 를 원래값("${original}")으로 되돌리지 못해 수동 복원함`,
        });
      }
    }
    await recordEvidence('w160-undone');

    return { findings };
  },
};
