import type { Locator, Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { canvasEditor, gotoBuilder, SHORTCUT_MODIFIER } from '../helpers';

const SELECTION_COUNT_RE = /^\d+개 선택됨$/;
const DISTRIBUTE_TARGET_IDS = [
  'home-services-card-0-icon',
  'home-services-card-0-title',
  'home-services-card-0-chevron',
] as const;
const DISTRIBUTE_LAYER_EXPAND_CHAIN = [
  'home-services-root',
  'home-services-container',
  'home-services-list',
  'home-services-card-0',
  'home-services-card-0-toggle',
  'home-services-card-0-header',
] as const;

interface NodeRectSnapshot {
  x: number;
  y: number;
  width: number;
  height: number;
}

async function openLayersDrawer(page: Page): Promise<boolean> {
  const rail = page.locator('[data-builder-rail-item="layers"]');
  if (!(await rail.isVisible().catch(() => false))) return false;
  await rail.click({ force: true }).catch(() => undefined);
  await page.waitForTimeout(400);
  return page.locator('[data-builder-layers-panel="true"]').isVisible().catch(() => false);
}

function layerRow(page: Page, nodeId: string): Locator {
  return page
    .locator(`[data-builder-layers-panel="true"] [data-builder-layer-row="${nodeId}"]`)
    .first();
}

async function expandLayerRow(page: Page, nodeId: string): Promise<void> {
  const row = layerRow(page, nodeId);
  const toggle = row.locator('button[title="하위 레이어 펼치기"]').first();
  if (!(await toggle.isVisible().catch(() => false))) return;
  await toggle.click({ force: true }).catch(() => undefined);
  await page.waitForTimeout(120);
}

async function ensureDistributeTargetRows(page: Page): Promise<boolean> {
  for (const nodeId of DISTRIBUTE_LAYER_EXPAND_CHAIN) {
    await expandLayerRow(page, nodeId);
  }
  await layerRow(page, DISTRIBUTE_TARGET_IDS[1]).scrollIntoViewIfNeeded().catch(() => undefined);
  await page.waitForTimeout(250);
  for (const nodeId of DISTRIBUTE_TARGET_IDS) {
    if (!(await layerRow(page, nodeId).isVisible().catch(() => false))) return false;
  }
  return true;
}

async function readNodeRect(page: Page, nodeId: string): Promise<NodeRectSnapshot | null> {
  const el = canvasEditor(page).locator(`[data-node-id="${nodeId}"]:visible`).first();
  return el
    .evaluate((node): NodeRectSnapshot | null => {
      const element = node as HTMLElement;
      const rect = {
        x: Number.parseFloat(element.style.left),
        y: Number.parseFloat(element.style.top),
        width: Number.parseFloat(element.style.width),
        height: Number.parseFloat(element.style.height),
      };
      return Object.values(rect).every(Number.isFinite) ? rect : null;
    })
    .catch(() => null);
}

async function readNodeX(page: Page, nodeId: string): Promise<number | null> {
  return (await readNodeRect(page, nodeId))?.x ?? null;
}

async function readSelectionCount(page: Page): Promise<number | null> {
  const matches = page.getByText(SELECTION_COUNT_RE, { exact: true });
  const n = await matches.count().catch(() => 0);
  for (let i = 0; i < n; i += 1) {
    const text = await matches.nth(i).innerText().catch(() => '');
    const m = text.match(/(\d+)개/);
    if (m) return Number(m[1]);
  }
  return null;
}

function pickMiddleIndex(xs: Array<number | null>): number {
  const indexed = xs
    .map((x, i) => ({ x, i }))
    .filter((entry): entry is { x: number; i: number } => entry.x !== null);
  if (indexed.length < 3) return indexed.length > 0 ? indexed[0]!.i : -1;
  indexed.sort((a, b) => a.x - b.x);
  return indexed[1]!.i;
}

function horizontalGapsAreEven(rects: Array<NodeRectSnapshot | null>): boolean {
  const valid = rects.filter((rect): rect is NodeRectSnapshot => rect !== null);
  if (valid.length < 3) return false;
  const sorted = [...valid].sort((a, b) => a.x - b.x);
  const gaps: number[] = [];
  for (let i = 1; i < sorted.length; i += 1) {
    const previous = sorted[i - 1]!;
    const current = sorted[i]!;
    gaps.push(current.x - (previous.x + previous.width));
  }
  if (gaps.length === 0) return false;
  const firstGap = gaps[0]!;
  return gaps.every((gap) => Math.abs(gap - firstGap) <= 1);
}

export const W222_distribute: CheckpointDefinition = {
  id: 'W222',
  title: '다중 선택 분배 (distribute horizontal/vertical)',
  verification: '가운데 노드 미리 밀기 → 3개 선택(단언) → distribute → 가운데 이동 확인 → undo x2',
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

    const initialRowCount = await page
      .locator('[data-builder-layers-panel="true"] [data-builder-layer-row]')
      .count()
      .catch(() => 0);
    log(`초기 레이어 행 수: ${initialRowCount}`);
    if (initialRowCount < 3) {
      findings.push({
        severity: 'blocker',
        summary: `분배에 필요한 레이어 행이 3개 미만(${initialRowCount})임`,
      });
      return { findings };
    }

    log('서비스 카드 내부 분배 대상 레이어 확장');
    if (!(await ensureDistributeTargetRows(page))) {
      findings.push({
        severity: 'blocker',
        summary: `분배 대상 레이어(${DISTRIBUTE_TARGET_IDS.join(', ')})를 확장/노출하지 못함`,
      });
      return { findings };
    }

    const ids = [...DISTRIBUTE_TARGET_IDS];
    log(`선택 대상 ids=${ids.join(', ')}`);

    const xsBaseline = await Promise.all(
      ids.map((id) => (id ? readNodeX(page, id) : Promise.resolve(null))),
    );
    const middleIdx = pickMiddleIndex(xsBaseline);
    const middleId = ids[middleIdx] ?? DISTRIBUTE_TARGET_IDS[1];
    const xMiddleBaseline = middleIdx >= 0 ? xsBaseline[middleIdx] : null;
    log(
      `baseline X=${xsBaseline.join(',')} → 공간상 가운데 노드=레이어행#${middleIdx} (${middleId}) X=${xMiddleBaseline}`,
    );

    log('가운데 노드 단독 선택 후 ArrowRight 1회로 미리 밀기(간격 어긋내기)');
    if (middleIdx >= 0) {
      await layerRow(page, middleId).click({ force: true }).catch(() => undefined);
    }
    await page.waitForTimeout(250);
    await page.keyboard.press('ArrowRight').catch(() => undefined);
    await page.waitForTimeout(200);
    const xMiddleNudged = await readNodeX(page, middleId);
    log(`nudge 후 가운데 X=${xMiddleNudged} (baseline=${xMiddleBaseline})`);
    if (
      xMiddleNudged === null ||
      (xMiddleBaseline !== null && xMiddleNudged === xMiddleBaseline)
    ) {
      findings.push({
        severity: 'visual',
        summary: '가운데 노드 nudge 후 X 변화가 관측되지 않음 (스냅/잠금 가능) — 분배 이동 단언이 약해짐',
      });
    }

    log('분배 대상 3개 레이어 클릭/Shift클릭(다중 선택)');
    await layerRow(page, ids[0]).click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(150);
    await layerRow(page, ids[1]).click({ force: true, modifiers: ['Shift'] }).catch(() => undefined);
    await page.waitForTimeout(150);
    await layerRow(page, ids[2]).click({ force: true, modifiers: ['Shift'] }).catch(() => undefined);
    await page.waitForTimeout(400);
    await recordEvidence('distribute-selected');

    const count = await readSelectionCount(page);
    log(`초기 선택 카운트=${count}`);

    if (count === null || count < 3) {
      findings.push({
        severity: 'blocker',
        summary: `다중 선택이 3개에 도달하지 않음(현재=${count}) — distributeSelectedNodes 가 selectedNodeIds<3 에서 no-op 하므로 검증 불가`,
      });
      await page.keyboard.press('Escape').catch(() => undefined);
      return { findings };
    }

    const distButton = page.locator('[data-builder-distribute-action="horizontal"]').first();
    const distVisible = await distButton.isVisible().catch(() => false);
    log(`distribute-horizontal 버튼 visible=${distVisible}`);
    if (!distVisible) {
      findings.push({
        severity: 'blocker',
        summary:
          '3개 노드 다중 선택 후 인스펙터에 distribute 버튼([data-builder-distribute-action])이 노출되지 않음',
      });
      await page.keyboard.press('Escape').catch(() => undefined);
      return { findings };
    }

    log('distribute-horizontal 실행');
    await distButton.click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(450);
    await recordEvidence('distribute-applied');

    const xMiddleDistributed = await readNodeX(page, middleId);
    log(`분배 후 가운데 X=${xMiddleDistributed} (nudge 후=${xMiddleNudged})`);

    const middleMoved = xMiddleNudged !== null && xMiddleDistributed !== null
      && Math.abs(xMiddleDistributed - xMiddleNudged) > 0.5;

    const rectsAfter = await Promise.all(ids.map((id) => readNodeRect(page, id)));
    const xsAfter = rectsAfter.map((rect) => rect?.x ?? null);
    const evenGap = horizontalGapsAreEven(rectsAfter);

    if (!middleMoved) {
      findings.push({
        severity: 'blocker',
        summary:
          'distribute-horizontal 실행 후 가운데 노드 위치가 전혀 변하지 않음 — 분배가 적용되지 않음',
      });
    } else if (!evenGap) {
      findings.push({
        severity: 'visual',
        summary: `분배 후 간격이 완전히 균일하지 않음 (X=${xsAfter.join(', ')})`,
      });
    }

    log('undo x2 로 원복 (distribute + nudge)');
    await page.keyboard.press(`${SHORTCUT_MODIFIER}+z`).catch(() => undefined);
    await page.waitForTimeout(300);
    await page.keyboard.press(`${SHORTCUT_MODIFIER}+z`).catch(() => undefined);
    await page.waitForTimeout(400);
    await recordEvidence('distribute-undone');

    const xMiddleFinal = await readNodeX(page, middleId);
    log(`undo 후 가운데 X=${xMiddleFinal} (baseline=${xMiddleBaseline})`);
    if (
      xMiddleBaseline !== null &&
      xMiddleFinal !== null &&
      Math.abs(xMiddleFinal - xMiddleBaseline) > 1
    ) {
      findings.push({
        severity: 'visual',
        summary: 'undo x2 후 가운데 노드가 baseline 위치로 완전히 복원되지 않음',
      });
    }

    await page.keyboard.press('Escape').catch(() => undefined);
    await page.waitForTimeout(200);

    return { findings };
  },
};
