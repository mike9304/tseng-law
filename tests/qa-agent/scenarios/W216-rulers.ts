import { expect } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { gotoBuilder } from '../helpers';

// W216 — 에디터 상단/좌측에 픽셀 눈금자 렌더.
// CanvasRulers 는 editorPrefs.rulers.enabled 일 때 [data-builder-ruler="top"|"left"] 와
// 40px 간격 숫자 눈금(.rulerMark span, 0/40/80/...) 을 렌더한다.
export const W216_rulers: CheckpointDefinition = {
  id: 'W216',
  title: '에디터 상단/좌측에 픽셀 눈금자 (rulers)',
  verification: '빌더 진입 → 상단/좌측 눈금자 요소 존재 + 40px 간격 숫자 눈금 라벨 존재',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    // Hard rule 1: 이전 시나리오가 남긴 popover/drawer 정리.
    log('잔여 popover/drawer 정리 (Escape x2)');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    const findings: CheckpointFinding[] = [];

    const topRuler = page.locator('[data-builder-ruler="top"]');
    const leftRuler = page.locator('[data-builder-ruler="left"]');

    const topVisible = await topRuler.isVisible().catch(() => false);
    const leftVisible = await leftRuler.isVisible().catch(() => false);
    log(`top ruler visible=${topVisible}, left ruler visible=${leftVisible}`);

    if (!topVisible) {
      findings.push({
        severity: 'blocker',
        summary: '상단 눈금자([data-builder-ruler="top"])가 렌더되지 않음',
      });
    }
    if (!leftVisible) {
      findings.push({
        severity: 'blocker',
        summary: '좌측 눈금자([data-builder-ruler="left"])가 렌더되지 않음',
      });
    }
    await recordEvidence('rulers-present');

    if (findings.some((f) => f.severity === 'blocker')) {
      return { findings };
    }

    log('숫자 눈금 라벨 존재 확인 (0/40/80/...)');
    for (const [axis, ruler] of [
      ['top', topRuler],
      ['left', leftRuler],
    ] as const) {
      const marks = ruler.locator('span');
      const markCount = await marks.count().catch(() => 0);
      const texts = await marks.allTextContents().catch(() => [] as string[]);
      const numericTexts = texts.filter((t) => /^\d+$/.test((t ?? '').trim()));
      log(`${axis} ruler 눈금 수=${markCount}, 숫자 라벨 수=${numericTexts.length}`);
      if (markCount === 0) {
        findings.push({
          severity: 'blocker',
          summary: `${axis} 눈금자에 눈금 요소(span)가 하나도 없음`,
        });
      } else if (numericTexts.length === 0) {
        findings.push({
          severity: 'blocker',
          summary: `${axis} 눈금자에 숫자 라벨(0/40/80/...)이 하나도 없음`,
        });
      }
    }

    // 눈금자가 캔버스 영역을 따라 배치되어 있는지(상단은 가로, 좌측은 세로) 방향성 확인.
    const topBox = await topRuler.boundingBox().catch(() => null);
    const leftBox = await leftRuler.boundingBox().catch(() => null);
    if (topBox && leftBox) {
      log(`top ruler box w=${Math.round(topBox.width)} h=${Math.round(topBox.height)}`);
      log(`left ruler box w=${Math.round(leftBox.width)} h=${Math.round(leftBox.height)}`);
      if (topBox.width <= topBox.height) {
        findings.push({
          severity: 'visual',
          summary: `상단 눈금자가 가로형이 아님 (w=${Math.round(topBox.width)} ≤ h=${Math.round(topBox.height)})`,
        });
      }
      if (leftBox.height <= leftBox.width) {
        findings.push({
          severity: 'visual',
          summary: `좌측 눈금자가 세로형이 아님 (h=${Math.round(leftBox.height)} ≤ w=${Math.round(leftBox.width)})`,
        });
      }
    }

    await recordEvidence('rulers-tick-labels');
    await expect(topRuler).toBeVisible();
    await expect(leftRuler).toBeVisible();

    return { findings };
  },
};
