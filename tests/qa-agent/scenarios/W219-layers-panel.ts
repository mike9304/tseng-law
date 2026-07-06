import type { Locator, Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { canvasEditor, gotoBuilder } from '../helpers';

// W219 — 좌측 레이어 패널에 노드 계층 트리.
// [data-builder-rail-item="layers"] 가 drawer 를 열고 SandboxLayersPanel([data-builder-layers-panel="true"])
// 이 [data-builder-layer-row] 트리 행을 렌더한다. 행 클릭 → onSelect → 해당 노드 선택.
function railItem(page: Page, name: string): Locator {
  return page.locator(`[data-builder-rail-item="${name}"]`);
}

export const W219_layersPanel: CheckpointDefinition = {
  id: 'W219',
  title: '좌측 패널 노드 계층 트리 (Layers)',
  verification: 'Layers rail 오픈 → 트리 행 > 0 → 행 클릭 시 캔버스 노드 선택',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    log('잔여 popover/drawer 정리 (Escape x2)');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    const findings: CheckpointFinding[] = [];

    const layersRail = railItem(page, 'layers');
    const railVisible = await layersRail.isVisible().catch(() => false);
    if (!railVisible) {
      findings.push({
        severity: 'blocker',
        summary: 'Layers rail 진입점([data-builder-rail-item="layers"])이 보이지 않음',
      });
      return { findings };
    }

    log('Layers rail 클릭으로 drawer 오픈');
    await layersRail.click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(450);

    const panel = page.locator('[data-builder-layers-panel="true"]');
    const panelVisible = await panel.isVisible().catch(() => false);
    if (!panelVisible) {
      findings.push({
        severity: 'blocker',
        summary: 'Layers drawer 가 열려도 레이어 패널([data-builder-layers-panel])이 렌더되지 않음',
      });
      await recordEvidence('layers-panel-missing');
      return { findings };
    }

    const rows = panel.locator('[data-builder-layer-row]');
    const rowCount = await rows.count().catch(() => 0);
    log(`레이어 트리 행 수: ${rowCount}`);
    await recordEvidence('layers-tree-rows');
    if (rowCount === 0) {
      findings.push({
        severity: 'blocker',
        summary: '레이어 패널에 트리 행([data-builder-layer-row])이 하나도 렌더되지 않음',
      });
      return { findings };
    }

    // 캔버스 노드 수와 트리 행 수가 같은 차원인지(계층 합산) 확인.
    const canvasNodes = canvasEditor(page).locator('[data-node-id]');
    const canvasCount = await canvasNodes.count().catch(() => 0);
    log(`캔버스 노드 수: ${canvasCount}`);
    if (rowCount > canvasCount + 50) {
      findings.push({
        severity: 'visual',
        summary: `레이어 행 수(${rowCount})가 캔버스 노드 수(${canvasCount}) 대비 비정상적으로 많음`,
      });
    }

    // 행 클릭 → 노드 선택 전파 확인.
    log('첫 번째 트리 행 클릭 → 캔버스 노드 선택 확인');
    const firstRow = rows.first();
    const targetId = await firstRow.getAttribute('data-builder-layer-row').catch(() => null);
    log(`클릭 대상 레이어 id=${targetId}`);

    const selectionMarker = canvasEditor(page).locator('[class*="nodeSelected"]');
    const selectedBefore = await selectionMarker.count().catch(() => 0);
    await firstRow.click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(400);
    const selectedAfter = await selectionMarker.count().catch(() => 0);
    log(`클릭 전 nodeSelected 요소=${selectedBefore}, 클릭 후=${selectedAfter}`);
    await recordEvidence('layers-row-select');

    if (selectedAfter <= selectedBefore && selectedAfter === 0) {
      findings.push({
        severity: 'blocker',
        summary:
          '레이어 행 클릭 후 캔버스에 선택 표시([class*="nodeSelected"])가 나타나지 않음 — 행→선택 전파 안 됨',
      });
    }

    // drawer 정리.
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.waitForTimeout(200);

    return { findings };
  },
};
