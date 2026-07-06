import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { canvasEditor, gotoBuilder, SHORTCUT_MODIFIER } from '../helpers';

// W221 — 노드 N개 선택 → align 버튼.
// Layers 패널에서 행1 클릭(단일 선택) → 행2 Shift클릭(toggleNodeSelection, 다중 선택).
// SandboxInspectorPanel 다중 선택 분기가 [data-builder-align-action] 버튼들을 렌더.
// align 적용 후 선택 노드 X 좌표가 정렬 기준으로 같아지는지 검증 후 undo.

async function openLayersDrawer(page: Page): Promise<boolean> {
  const rail = page.locator('[data-builder-rail-item="layers"]');
  if (!(await rail.isVisible().catch(() => false))) return false;
  await rail.click({ force: true }).catch(() => undefined);
  await page.waitForTimeout(400);
  return page.locator('[data-builder-layers-panel="true"]').isVisible().catch(() => false);
}

async function readNodeX(page: Page, nodeId: string): Promise<number | null> {
  const el = canvasEditor(page).locator(`[data-node-id="${nodeId}"]:visible`).first();
  const box = await el.boundingBox().catch(() => null);
  return box ? box.x : null;
}

export const W221_multiAlign: CheckpointDefinition = {
  id: 'W221',
  title: '다중 선택 정렬 (align left/center/right)',
  verification: '노드 2개 선택 → 인스펙터 align 버튼 노출 → 좌측 정렬 → X 동일화 → undo',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    log('잔여 popover/drawer 정리 (Escape x2)');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    const findings: CheckpointFinding[] = [];

    log('Layers drawer 오픈');
    if (!(await openLayersDrawer(page))) {
      findings.push({
        severity: 'blocker',
        summary: 'Layers drawer 를 열 수 없어 다중 선택 진입 불가',
      });
      return { findings };
    }

    const rows = page.locator('[data-builder-layers-panel="true"] [data-builder-layer-row]');
    const rowCount = await rows.count().catch(() => 0);
    log(`레이어 행 수: ${rowCount}`);
    if (rowCount < 2) {
      findings.push({
        severity: 'blocker',
        summary: `다중 선택에 필요한 레이어 행이 2개 미만(${rowCount})임`,
      });
      return { findings };
    }

    const idA = await rows.nth(0).getAttribute('data-builder-layer-row').catch(() => null);
    const idB = await rows.nth(1).getAttribute('data-builder-layer-row').catch(() => null);
    log(`선택 대상 idA=${idA}, idB=${idB}`);

    log('행1 클릭(단일 선택) → 행2 Shift클릭(다중 선택 추가)');
    await rows.nth(0).click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(200);
    await rows.nth(1).click({ force: true, modifiers: ['Shift'] }).catch(() => undefined);
    await page.waitForTimeout(400);
    await recordEvidence('multi-align-selected');

    const alignButton = page.locator('[data-builder-align-action="left"]').first();
    const alignVisible = await alignButton.isVisible().catch(() => false);
    log(`align-left 버튼 visible=${alignVisible}`);
    if (!alignVisible) {
      findings.push({
        severity: 'blocker',
        summary:
          '2개 노드 다중 선택 후 인스펙터에 align 버튼([data-builder-align-action])이 노출되지 않음',
      });
      await page.keyboard.press('Escape').catch(() => undefined);
      return { findings };
    }

    // 정렬 기준 좌표 before.
    const xA_before = idA ? await readNodeX(page, idA) : null;
    const xB_before = idB ? await readNodeX(page, idB) : null;
    log(`정렬 전 X: A=${xA_before}, B=${xB_before}`);

    log('align-left 실행');
    await alignButton.click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(400);
    await recordEvidence('multi-align-applied');

    const xA_after = idA ? await readNodeX(page, idA) : null;
    const xB_after = idB ? await readNodeX(page, idB) : null;
    log(`정렬 후 X: A=${xA_after}, B=${xB_after}`);

    let aligned = false;
    if (xA_after !== null && xB_after !== null) {
      aligned = Math.abs(xA_after - xB_after) <= 1;
    }
    if (!aligned) {
      const moved =
        xA_before !== null && xB_before !== null && xA_after !== null && xB_after !== null
          ? xA_after !== xA_before || xB_after !== xB_before
          : false;
      if (moved) {
        findings.push({
          severity: 'visual',
          summary: `align-left 후 X 가 완전히 같아지지 않음 (A=${xA_after}, B=${xB_after})`,
        });
      } else {
        findings.push({
          severity: 'blocker',
          summary: 'align-left 실행 후 선택 노드 위치가 전혀 변하지 않음',
        });
      }
    }

    log('undo 로 원복');
    await page.keyboard.press(`${SHORTCUT_MODIFIER}+z`);
    await page.waitForTimeout(400);
    await recordEvidence('multi-align-undone');

    await page.keyboard.press('Escape').catch(() => undefined);
    await page.waitForTimeout(200);

    return { findings };
  },
};
