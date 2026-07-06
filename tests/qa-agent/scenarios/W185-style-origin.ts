import { type Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { canvasEditor, dismissOverlays, ensureSelected, gotoBuilder } from '../helpers';

const STYLE_TAB_LABELS = ['스타일', 'Style', '樣式'];

function inspector(page: Page) {
  return page.locator('[data-builder-inspector-panel="true"]');
}

function inspectorStyleTab(page: Page) {
  return inspector(page)
    .locator('button')
    .filter({ hasText: new RegExp(STYLE_TAB_LABELS.join('|')) })
    .first();
}

function styleOriginVisualizer(page: Page) {
  return inspector(page).locator('[data-builder-style-origin-visualizer="true"]').first();
}

export const W185_styleOrigin: CheckpointDefinition = {
  id: 'W185',
  title: '스타일 오리진 시각화: 요소 선택 → "이 스타일은 어디서 왔나" origin 정보 렌더 확인',
  verification:
    '캔버스 노드 선택 → 인스펙터 Style 탭 → style origin visualizer(data-builder-style-origin-visualizer) 렌더 → origin chip(theme/variant/manual/default) + hint 정보 확인; 기능 부재 시 honest blocker',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    log('잔여 popover/drawer 정리 (Escape x2)');
    await dismissOverlays(page);

    const findings: CheckpointFinding[] = [];

    // 1) 노드 선택.
    log('캔버스 노드 선택');
    let selected = false;
    try {
      await ensureSelected(page);
      selected = true;
    } catch {
      selected = false;
    }
    if (!selected) {
      findings.push({
        severity: 'blocker',
        summary: '캔버스 노드를 선택하지 못해 인스펙터 Style 탭 검증 불가',
      });
      await recordEvidence('style-origin-select-failed');
      return { findings };
    }
    await canvasEditor(page).waitFor({ state: 'visible' }).catch(() => undefined);
    await recordEvidence('style-origin-node-selected');

    // 2) 인스펙터 Style 탭 진입.
    log('인스펙터 Style 탭 클릭');
    const styleTab = inspectorStyleTab(page);
    const styleTabVisible = await styleTab.isVisible().catch(() => false);
    if (!styleTabVisible) {
      findings.push({
        severity: 'blocker',
        summary: `인스펙터 Style 탭(${STYLE_TAB_LABELS.join('/')}) 버튼을 찾지 못함`,
      });
      await recordEvidence('style-origin-tab-missing');
      return { findings };
    }
    await styleTab.click({ force: true });
    await page.waitForTimeout(400);
    await recordEvidence('style-origin-tab-open');

    // 3) style origin visualizer 렌더 확인.
    log('style origin visualizer 렌더 확인');
    const visualizerVisible = await styleOriginVisualizer(page)
      .waitFor({ state: 'visible', timeout: 8_000 })
      .then(() => true)
      .catch(() => false);
    if (!visualizerVisible) {
      findings.push({
        severity: 'blocker',
        summary:
          '스타일 오리진 시각화(data-builder-style-origin-visualizer)가 Style 탭에 렌더되지 않음 — "이 스타일은 어디서 왔나" 기능이 해당 노드/구성에서 노출되지 않거나 미구현',
        detail:
          'StyleOriginChip + StyleSourceRow 는 StyleTab 상단에 위치해야 함. 기능이 활성화되지 않은 경우 honest blocker.',
      });
      await recordEvidence('style-origin-visualizer-missing');
      return { findings };
    }
    await recordEvidence('style-origin-visualizer-visible');

    // 4) origin chip(theme/variant/manual/default) + source row + hint 존재 확인.
    log('origin chip / source row / hint 확인');
    const visualizer = styleOriginVisualizer(page);
    const originChips = await visualizer
      .locator('[data-builder-style-origin="theme"], [data-builder-style-origin="variant"], [data-builder-style-origin="manual"], [data-builder-style-origin="default"]')
      .count()
      .catch(() => 0);
    const sourceRows = await visualizer.locator('[data-builder-style-source-row]').count().catch(() => 0);
    const hints = await visualizer.locator('[data-builder-style-source-hint]').count().catch(() => 0);
    log(`origin chip 수: ${originChips}, source row 수: ${sourceRows}, hint 수: ${hints}`);

    if (originChips === 0) {
      findings.push({
        severity: 'blocker',
        summary: 'style origin chip(data-builder-style-origin=theme/variant/manual/default)이 하나도 렌더되지 않음',
      });
    }
    if (sourceRows === 0) {
      findings.push({
        severity: 'minor',
        summary: 'style source row(data-builder-style-source-row)가 렌더되지 않음 — 시각화 프레임만 있고 항목이 비었을 수 있음',
      });
    }
    // hint 텍스트 노출 확인 (최소 1개 hint 가 비어있지 않은 텍스트를 가져야 함).
    let hintHasText = false;
    if (hints > 0) {
      const hintText = await visualizer
        .locator('[data-builder-style-source-hint]')
        .first()
        .innerText()
        .catch(() => '');
      hintHasText = hintText.trim().length > 0;
      log(`첫 hint 텍스트: "${hintText.trim().slice(0, 60)}"`);
    }
    if (hints > 0 && !hintHasText) {
      findings.push({
        severity: 'minor',
        summary: 'style source hint 요소는 존재하나 텍스트(origin 정보)가 비어 있음',
      });
    }
    await recordEvidence('style-origin-chips');

    // cleanup: 특별한 영속 변경 없음 (읽기 전용 검증).
    await dismissOverlays(page).catch(() => undefined);

    return { findings };
  },
};
