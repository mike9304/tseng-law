import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { canvasEditor, gotoBuilder, selectFirstNode } from '../helpers';

async function openHistoryDrawer(page: Page): Promise<boolean> {
  const timeline = page.locator('[data-builder-undo-timeline="true"]');
  if (await timeline.isVisible().catch(() => false)) return true;
  const rail = page.locator('[data-builder-rail-item="history"]');
  if (!(await rail.isVisible().catch(() => false))) return false;
  await rail.click({ force: true }).catch(() => undefined);
  await page.waitForTimeout(450);
  return timeline.isVisible().catch(() => false);
}

async function readNodeX(page: Page, nodeId: string | null): Promise<number | null> {
  if (!nodeId) return null;
  const el = canvasEditor(page).locator(`[data-node-id="${nodeId}"]:visible`).first();
  return el
    .evaluate((node) => {
      const leftDeclaration = node.getAttribute('style')?.match(/(?:^|;)\s*left\s*:\s*([^;]+)/)?.[1] ?? '';
      const left = Number.parseFloat(leftDeclaration);
      return Number.isFinite(left) ? left : null;
    })
    .catch(() => null);
}

export const W225_undoTimeline: CheckpointDefinition = {
  id: 'W225',
  title: '히스토리 타임라인 (세이브 포인트 목록 + 복원)',
  verification: 'History drawer → 타임라인 렌더 → 편집 시 새 항목 추가 → undo 복원',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    log('잔여 popover/drawer 정리 (Escape x2)');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    const findings: CheckpointFinding[] = [];

    log('편집 전 기준 노드 선택 + 위치 기록');
    const node = await selectFirstNode(page);
    const nodeId = await node.getAttribute('data-node-id').catch(() => null);
    const xBefore = await readNodeX(page, nodeId);
    log(`기준 노드 id=${nodeId}, x=${xBefore}`);

    log('History drawer 오픈');
    if (!(await openHistoryDrawer(page))) {
      findings.push({
        severity: 'blocker',
        summary: 'History drawer / UndoStackTimeline([data-builder-undo-timeline])이 렌더되지 않음',
      });
      return { findings };
    }

    const timeline = page.locator('[data-builder-undo-timeline="true"]');
    const snapshots = timeline.locator('[data-builder-undo-snapshot]');
    const countBefore = await snapshots.count().catch(() => 0);
    log(`편집 전 스냅샷 수: ${countBefore}`);
    await recordEvidence('undo-timeline-initial');
    if (countBefore === 0) {
      findings.push({
        severity: 'blocker',
        summary: '히스토리 타임라인에 스냅샷 항목([data-builder-undo-snapshot])이 하나도 없음',
      });
      return { findings };
    }

    // 항목에 이름/라벨이 있는지 확인.
    const firstTitle = await snapshots.first().textContent().catch(() => '');
    log(`첫 스냅샷 텍스트(일부): ${(firstTitle ?? '').slice(0, 60)}`);
    if ((firstTitle ?? '').trim().length === 0) {
      findings.push({
        severity: 'visual',
        summary: '히스토리 스냅샷 항목에 라벨/이름 텍스트가 비어있음',
      });
    }

    log('History drawer 닫고 캔버스 노드에 포커스 복원');
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.waitForTimeout(200);
    if (nodeId) {
      await canvasEditor(page).locator(`[data-node-id="${nodeId}"]:visible`).first().click({ force: true }).catch(() => undefined);
    } else {
      await selectFirstNode(page);
    }

    log('편집 수행: Shift+ArrowRight (nudge +10px)');
    await page.keyboard.press('Shift+ArrowRight');
    await page.waitForTimeout(450);

    log('History drawer 재오픈');
    if (!(await openHistoryDrawer(page))) {
      findings.push({
        severity: 'blocker',
        summary: '편집 후 History drawer / UndoStackTimeline 재오픈 실패',
      });
      return { findings };
    }

    const countAfter = await snapshots.count().catch(() => 0);
    log(`편집 후 스냅샷 수: ${countAfter}`);
    await recordEvidence('undo-timeline-after-edit');
    if (countAfter <= countBefore) {
      findings.push({
        severity: 'blocker',
        summary: `편집 후 타임라인에 새 스냅샷이 추가되지 않음 (before=${countBefore}, after=${countAfter})`,
      });
    }

    const xAfterEdit = await readNodeX(page, nodeId);
    log(`편집 후 노드 x=${xAfterEdit}`);

    log('현재 스냅샷에 명시적 이름 저장');
    const snapshotName = 'W225 QA named savepoint';
    const nameInput = timeline.locator('[data-builder-undo-name-input="true"]').first();
    const saveNameButton = timeline.locator('[data-builder-undo-name-save="true"]').first();
    if (!(await nameInput.isVisible().catch(() => false))) {
      findings.push({
        severity: 'blocker',
        summary: '스냅샷 이름 입력([data-builder-undo-name-input])이 보이지 않음',
      });
    } else {
      await nameInput.fill(snapshotName);
      await saveNameButton.click({ force: true }).catch(() => undefined);
      await page.waitForTimeout(250);
    }

    const namedSnapshot = timeline.locator('[data-builder-undo-snapshot]').filter({ hasText: snapshotName }).first();
    const namedSnapshotVisible = await namedSnapshot.isVisible().catch(() => false);
    await recordEvidence('undo-timeline-named-savepoint');
    if (!namedSnapshotVisible) {
      findings.push({
        severity: 'blocker',
        summary: '저장한 스냅샷 이름이 타임라인 항목에 표시되지 않음',
      });
    }

    log('undo 버튼([data-builder-undo-action="undo"])으로 복원');
    const undoBtn = timeline.locator('[data-builder-undo-action="undo"]');
    const undoDisabled = await undoBtn.first().isDisabled().catch(() => true);
    if (undoDisabled) {
      findings.push({
        severity: 'blocker',
        summary: 'undo 버튼이 비활성화되어 있어 타임라인 복원 불가',
      });
    } else {
      await undoBtn.first().click({ force: true }).catch(() => undefined);
      await page.waitForTimeout(450);
    }
    await recordEvidence('undo-timeline-after-undo');

    const xAfterUndo = await readNodeX(page, nodeId);
    log(`undo 후 노드 x=${xAfterUndo}`);
    if (xBefore !== null && xAfterUndo !== null && xAfterUndo !== xBefore) {
      findings.push({
        severity: 'visual',
        summary: `undo 후 노드 위치가 기준으로 완전 복원되지 않음 (기준=${xBefore}, 복원=${xAfterUndo})`,
      });
    }

    log('이름이 저장된 스냅샷 행 클릭 복원 지원 여부 확인');
    const savedSnapshotVisible = await namedSnapshot.isVisible().catch(() => false);
    if (!savedSnapshotVisible) {
      findings.push({
        severity: 'minor',
        summary: '직접 복원할 이름 저장 스냅샷 행이 보이지 않음',
      });
    } else {
      const rowRestoreBefore = await readNodeX(page, nodeId);
      // 행 클릭 → <button onClick={jumpToHistorySnapshot(index)}> 가 발화하여
      // history cursor 가 해당 스냅샷으로 이동해야 한다.
      await namedSnapshot.click({ force: true });
      await page.waitForTimeout(300);

      // 1차 신호(결정적): 클릭한 행이 이제 활성 스냅샷(data-active="true",
      // data-builder-undo-snapshot="current")이 되었는지. drawer 가림이나
      // flow 노드 여부와 무관하게 cursor jump 를 직접 검증.
      const activeAfter = await namedSnapshot.getAttribute('data-active').catch(() => null);
      const markerAfter = await namedSnapshot
        .getAttribute('data-builder-undo-snapshot')
        .catch(() => null);
      if (activeAfter !== 'true' && markerAfter !== 'current') {
        findings.push({
          severity: 'minor',
          summary: '타임라인 스냅샷 행 클릭으로 커서가 해당 스냅샷으로 이동하지 않음 (data-active 미전환)',
        });
      }

      // 2차 신호(보조): 캔버스 노드 left 값이 편집 위치로 복원되었는지.
      // drawer 가림/flow 노드면 null 이므로 null 가드 필수.
      const rowRestoreAfter = await readNodeX(page, nodeId);
      if (
        xAfterEdit !== null
        && rowRestoreBefore !== null
        && rowRestoreAfter !== null
        && rowRestoreAfter !== xAfterEdit
      ) {
        findings.push({
          severity: 'visual',
          summary: `이름 저장 스냅샷 행 클릭 후 편집 위치로 복원되지 않음 (편집=${xAfterEdit}, 복원=${rowRestoreAfter})`,
        });
      }
    }

    // drawer 정리.
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.waitForTimeout(200);

    return { findings };
  },
};
