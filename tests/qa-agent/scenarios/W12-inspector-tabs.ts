import { expect, type Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { gotoBuilder, selectFirstNode, SHORTCUT_MODIFIER } from '../helpers';

function inspector(page: Page) {
  return page.locator('[data-builder-inspector-panel="true"]');
}

function inspectorTab(page: Page, labels: string[]) {
  return inspector(page)
    .locator('button')
    .filter({ hasText: new RegExp(labels.join('|')) })
    .first();
}

// tab-specific editing control 존재 확인 (각 탭이 최소 1개 편집 필드를 렌더하는지).
async function tabHasEditableControl(page: Page): Promise<number> {
  const controls = inspector(page).locator(
    'input, select, textarea, [role="slider"], .insp-number-stepper',
  );
  return controls.count();
}

export const W12_inspectorTabs: CheckpointDefinition = {
  id: 'W12',
  title: '인스펙터 탭 3개 + 각 필드 편집 (Content/Style/Layout)',
  verification: '노드 선택 → 우측에 탭 3개 + 각 탭 필드 렌더 → Layout 값 편집 → undo',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    // Hard rule 1: 이전 시나리오가 남긴 popover/drawer 정리.
    log('잔여 popover/drawer 정리 (Escape x2)');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    const findings: CheckpointFinding[] = [];

    log('노드 선택');
    await selectFirstNode(page);
    await expect(inspector(page)).toBeVisible({ timeout: 10_000 });
    await recordEvidence('inspector-visible');

    const LAYOUT_LABELS = ['레이아웃', '版面配置', 'Layout'];
    const STYLE_LABELS = ['스타일', '樣式', 'Style'];
    const CONTENT_LABELS = ['콘텐츠', '內容', 'Content'];

    log('탭 3개 존재 확인');
    for (const [name, labels] of [
      ['Layout', LAYOUT_LABELS],
      ['Style', STYLE_LABELS],
      ['Content', CONTENT_LABELS],
    ] as const) {
      const tab = inspectorTab(page, [...labels]);
      const visible = await tab.isVisible().catch(() => false);
      if (!visible) {
        findings.push({
          severity: 'blocker',
          summary: `인스펙터 ${name} 탭(${labels.join('/')}) 버튼이 보이지 않음`,
        });
      }
    }
    await recordEvidence('inspector-tabs-present');
    if (findings.some((f) => f.severity === 'blocker')) {
      return { findings };
    }

    log('각 탭 전환 + 편집 필드 렌더 확인');
    for (const [name, labels] of [
      ['Style', STYLE_LABELS],
      ['Content', CONTENT_LABELS],
      ['Layout', LAYOUT_LABELS],
    ] as const) {
      const tab = inspectorTab(page, [...labels]);
      await tab.click({ force: true }).catch(() => undefined);
      await page.waitForTimeout(400);
      const controlCount = await tabHasEditableControl(page);
      log(`${name} 탭 편집 컨트롤 수: ${controlCount}`);
      if (controlCount === 0) {
        findings.push({
          severity: 'blocker',
          summary: `${name} 탭에 편집 필드(input/select/slider/stepper)가 하나도 렌더되지 않음`,
        });
      }
      await recordEvidence(`inspector-tab-${name.toLowerCase()}`);
    }

    log('Layout 탭 선택 후 X 좌표(+10) 편집');
    await inspectorTab(page, [...LAYOUT_LABELS]).click({ force: true });
    await page.waitForTimeout(300);

    let edited = false;
    let originalValue: number | null = null;
    const steppers = inspector(page).locator('.insp-number-stepper input');
    const stepperCount = await steppers.count();
    log(`Layout NumberStepper input 수: ${stepperCount}`);
    for (let i = 0; i < stepperCount; i += 1) {
      const input = steppers.nth(i);
      if (await input.isDisabled().catch(() => true)) continue;
      const raw = await input.inputValue().catch(() => '');
      const v = Number(raw);
      if (!Number.isFinite(v)) continue;
      originalValue = v;
      const next = v + 10;
      await input.click({ force: true }).catch(() => undefined);
      await input.fill(String(next));
      await input.press('Enter');
      await page.waitForTimeout(350);
      const committedRaw = await input.inputValue().catch(() => '');
      const committed = Number(committedRaw);
      log(`stepper#${i} ${raw} → ${committedRaw} (기대 ${next})`);
      if (Number.isFinite(committed) && committed !== v) {
        edited = true;
        if (committed !== next) {
          findings.push({
            severity: 'visual',
            summary: `Layout 값 편집이 clamp 등으로 ${v}→${committed} 로 제한됨 (기대 ${next})`,
          });
        }
        break;
      }
    }
    if (!edited) {
      findings.push({
        severity: 'blocker',
        summary:
          'Layout 탭에서 편집 가능한 NumberStepper 값을 변경하지 못함 (모두 비활성화이거나 commit 반영 안됨)',
      });
    }
    await recordEvidence('inspector-layout-edited');

    if (edited && originalValue !== null) {
      log('undo 로 Layout 값 복원');
      await page.keyboard.press(`${SHORTCUT_MODIFIER}+z`);
      await page.waitForTimeout(500);
      const restored = await steppers
        .first()
        .inputValue()
        .catch(() => '');
      log(`undo 후 첫 stepper 값: ${restored} (기대 ${originalValue})`);
      await recordEvidence('inspector-layout-undone');
    }

    return { findings };
  },
};
