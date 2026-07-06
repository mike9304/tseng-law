import type { Locator, Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { dismissOverlays, gotoBuilder, selectFirstNode, SHORTCUT_MODIFIER } from '../helpers';

// 이징(Easing) 커브 컨트롤 — 등장(Entrance) 섹션의 easing select + custom cubic-bezier.
const ENTRANCE_PRESET_LABELS = ['등장 프리셋', 'Entrance preset', '進場預設'];
const EASING_LABELS = ['이징', 'Easing'];

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

export const W174_easing: CheckpointDefinition = {
  id: 'W174',
  title: '이징(Easing) 커브: ease-in/out/elastic + custom cubic-bezier 선택 → 적용 → 복원',
  verification:
    '노드 선택 → 애니메이션 탭 → 등장 섹션 easing 을 ease-in/ease-out/elastic 변경(콤보박스 값 반영) → custom 모드에서 cubic-bezier 입력 활성화 확인 → 유효 bezier 입력 → 원래 easing 으로 복원',
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
      await recordEvidence('w174-anim-tab-missing');
      return { findings };
    }
    await tabBtn.click({ force: true });
    await page.waitForTimeout(350);

    const entranceCombo = entrancePresetCombo(page);
    if ((await entranceCombo.count().catch(() => 0)) === 0) {
      findings.push({ severity: 'blocker', summary: '등장 프리셋(Entrance preset) 콤보박스를 찾을 수 없음' });
      await recordEvidence('w174-entrance-combo-missing');
      return { findings };
    }

    const entranceSection = sectionOf(entranceCombo);
    const easingCombo = entranceSection
      .getByRole('combobox', { name: new RegExp(`^(${EASING_LABELS.join('|')})$`) })
      .first();
    if ((await easingCombo.count().catch(() => 0)) === 0) {
      findings.push({ severity: 'blocker', summary: '등장 섹션에서 easing 콤보박스를 찾을 수 없음' });
      await recordEvidence('w174-easing-combo-missing');
      return { findings };
    }

    // custom bezier 텍스트 필드(placeholder 에 항상 "cubic-bezier(0.34, 1.56, 0.64, 1)").
    const customField = entranceSection.locator('input[placeholder*="cubic-bezier"]').first();

    const original = await easingCombo.inputValue().catch(() => '');
    log(`현재 easing: "${original}"`);

    // 1) 프리셋 easing 변경 — ease-in / ease-out / elastic.
    for (const value of ['ease-in', 'ease-out', 'elastic'] as const) {
      log(`easing → ${value}`);
      await easingCombo.selectOption(value);
      await page.waitForTimeout(200);
      const applied = await easingCombo.inputValue().catch(() => '');
      log(`적용 후 값="${applied}"`);
      await recordEvidence(`w174-${value}-applied`);
      if (applied !== value) {
        findings.push({
          severity: 'blocker',
          summary: `easing 이 ${value}(으)로 commit 되지 않음 (현재="${applied}")`,
        });
      }
      // 프리셋 easing 선택 시 custom 필드는 비활성이어야 함.
      const customDisabled = await customField.isDisabled().catch(() => true);
      if (!customDisabled) {
        findings.push({
          severity: 'visual',
          summary: `프리셋 easing(${value}) 선택 중인데 custom bezier 필드가 활성 상태임(비활성이어야 함)`,
        });
      }
    }

    // 2) custom 모드 — cubic-bezier.
    log('easing → custom');
    await easingCombo.selectOption('custom');
    await page.waitForTimeout(220);
    const customMode = await easingCombo.inputValue().catch(() => '');
    const customDisabled = await customField.isDisabled().catch(() => true);
    log(`custom 선택 후 콤보박스 값="${customMode}", custom 필드 disabled=${customDisabled}`);
    await recordEvidence('w174-custom-enabled');
    if (customMode !== 'custom') {
      findings.push({
        severity: 'blocker',
        summary: `easing 콤보박스가 custom 모드로 전환되지 않음 (현재="${customMode}")`,
      });
    }
    if (customDisabled) {
      findings.push({
        severity: 'blocker',
        summary: 'custom easing 선택 후에도 cubic-bezier 입력 필드가 비활성 상태임',
      });
    }

    // 3) 유효 cubic-bezier 입력(정규식 통과 시 commit).
    if (!customDisabled) {
      const bezier = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
      log(`custom bezier 입력: ${bezier}`);
      await customField.fill(bezier);
      await customField.press('Enter');
      await page.waitForTimeout(220);
      // custom 필드는 비제어(defaultValue)라 DOM 값으로 commit 여부를 증명할 수 없음.
      // 콤보박스가 계속 'custom' 모드면 비-프리셋 값이 저장된 것으로 간주(정직한 간접 증거).
      const stillCustom = await easingCombo.inputValue().catch(() => '');
      log(`bezier 입력 후 콤보박스 값="${stillCustom}"`);
      await recordEvidence('w174-custom-bezier-entered');
      if (stillCustom !== 'custom') {
        findings.push({
          severity: 'visual',
          summary: 'custom bezier 입력 후 easing 콤보박스가 custom 모드를 유지하지 못함',
        });
      }
    }

    log('cleanup: 원래 easing 으로 복원');
    if (original && original !== 'custom') {
      await easingCombo.selectOption(original).catch(() => undefined);
    } else {
      // 원래값이 custom 이거나 빈 경우 기본 'ease' 로 복원 + undo 보정.
      await easingCombo.selectOption('ease').catch(() => undefined);
    }
    await page.keyboard.press(`${SHORTCUT_MODIFIER}+z`).catch(() => undefined);
    await page.waitForTimeout(200);
    const restored = await easingCombo.inputValue().catch(() => '');
    log(`복원 후 값="${restored}" (기대 "${original || 'ease'}")`);
    await recordEvidence('w174-restored');

    return { findings };
  },
};
