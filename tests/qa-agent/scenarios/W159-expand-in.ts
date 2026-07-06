import type { Locator, Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { dismissOverlays, gotoBuilder, selectFirstNode, SHORTCUT_MODIFIER } from '../helpers';

// 애니메이션 탭 / 등장 프리셋 라벨 (ko/en/zh 폴백).
const ENTRANCE_PRESET_LABELS = ['등장 프리셋', 'Entrance preset', '進場預設'];
const PREVIEW_BUTTON_LABELS = ['미리보기 재생', 'Play preview', '播放預覽'];

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

export const W159_expandIn: CheckpointDefinition = {
  id: 'W159',
  title: '등장(Entrance) 애니메이션: expand/scale 계열 선택 → 적용(미리보기 버튼 활성화) → undo',
  verification:
    '노드 선택 → 애니메이션 탭 → 등장 프리셋을 expand-in(확장) / zoom-in(스케일)로 변경 → 콤보박스 값 반영 + 미리보기 재생 버튼 활성화(preset=none 게이트 해제) 확인 → undo 복원',
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
      await recordEvidence('w159-anim-tab-missing');
      return { findings };
    }
    await tabBtn.click({ force: true });
    await page.waitForTimeout(350);

    const combo = entrancePresetCombo(page);
    if ((await combo.count().catch(() => 0)) === 0) {
      findings.push({ severity: 'blocker', summary: '등장 프리셋(Entrance preset) 콤보박스를 찾을 수 없음' });
      await recordEvidence('w159-entrance-combo-missing');
      return { findings };
    }

    const original = await combo.inputValue().catch(() => '');
    log(`현재 등장 프리셋: "${original}"`);
    const previewBtn = sectionOf(combo)
      .getByRole('button', { name: new RegExp(PREVIEW_BUTTON_LABELS.join('|')) })
      .first();

    // preset=none 일 때 preview 버튼은 disabled 여야 함(게이트 동작 확인).
    const previewGateBefore = await previewBtn.isDisabled().catch(() => false);
    log(`preview disabled(변경 전, none 게이트): ${previewGateBefore}`);

    // expand 계열 → 적용 → undo 사이클
    for (const value of ['expand-in', 'zoom-in'] as const) {
      log(`등장 프리셋 → ${value}`);
      await combo.selectOption(value);
      await page.waitForTimeout(250);
      const applied = await combo.inputValue().catch(() => '');
      const previewDisabled = await previewBtn.isDisabled().catch(() => true);
      log(`적용 후 값="${applied}", preview disabled=${previewDisabled}`);
      await recordEvidence(`w159-${value}-applied`);
      if (applied !== value) {
        findings.push({
          severity: 'blocker',
          summary: `등장 프리셋이 ${value}(으)로 commit 되지 않음 (현재="${applied}")`,
        });
      }
      // preset != none 이면 preview 버튼이 활성화되어야 함(강력한 적용 신호).
      if (previewDisabled) {
        findings.push({
          severity: 'visual',
          summary: `${value} 적용 후에도 미리보기 재생 버튼이 비활성 상태임 (preset=none 게이트가 풀리지 않음)`,
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
    await recordEvidence('w159-undone');

    return { findings };
  },
};
