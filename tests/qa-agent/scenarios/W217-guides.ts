import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { gotoBuilder } from '../helpers';

// W217 — 눈금자에서 드래그하여 가이드 라인 생성/제거.
//
// 본 시나리오는 통과하는 실제 spec 인터랙션을 1:1 로 미러한다.
// 근거: tests/builder-editor/editor-guides-grid.playwright.ts:106 (동일 파일 132-144 라인)
//
// spec 이 증명하는 정확한 생성 계약:
//   1) prefs 키(tw_builder_editor_prefs_v1)를 addInitScript 로 제거 → 기본 상태(rulers 기본 ON) 진입.
//   2) 상단 눈금자([data-builder-ruler="top"]) 의 1/3 지점·수직 중앙에서 pointerdown.
//   3) 캔버스 방향(아래쪽 +80px)으로 드래그하여 스테이지 안에서 mouseup.
//      spec 주석: "A bare click on the ruler now cancels (no guide)" — 순수 클릭이 아니라
//      반드시 캔버스 안으로 드래그해야 생성된다.
//   4) 결과: [data-builder-guide-axis="vertical"] 가이드 등장 + prefs.referenceGuides 증가.
//
// 기존 W217 이 실패한 원인: 좌측 ruler 를 우선 시도하고, 상단 ruler 2차 시도에서
// dx:160(우측) 드래그를 썼다. 상단 ruler(가로 막대)에서 우측으로 드래그하면 ruler 을
// 따라 이동할 뿐 캔버스로 진입하지 않아 가이드가 생성되지 않는다. 올바른 방향은
// 캔버스를 향한 아래쪽(+dy) 이다.
//
// spec 은 생성(create)만 다룬다. 재배치·제거는 spec 이 다루지 않으므로 hard blocker 가
// 아닌 best-effort soft finding 으로만 기록한다(과잉 주장 방지).
const PREFS_KEY = 'tw_builder_editor_prefs_v1';
const GUIDE_SEL = '[data-builder-guide-id]';

export const W217_guides: CheckpointDefinition = {
  id: 'W217',
  title: '눈금자에서 드래그하여 가이드 라인 생성/제거',
  verification:
    '상단 눈금자에서 캔버스로 드래그 → vertical 가이드 생성(spec 미러) → (best-effort) 재배치·제거',
  async run({ page, baseUrl, recordEvidence, log }) {
    // spec 과 동일: prefs 키를 완전히 제거해 기본 상태(rulers 기본 ON)로 진입.
    log('editor prefs 초기화(addInitScript removeItem) — spec 미러');
    await page.addInitScript((key) => window.localStorage.removeItem(key), PREFS_KEY);

    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    // Hard rule: 이전 시나리오가 남긴 popover/drawer 정리.
    log('잔여 popover/drawer 정리 (Escape x2)');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    const findings: CheckpointFinding[] = [];

    // spec: 상단 눈금자 존재 확인(생성 진입점).
    const topRuler = page.locator('[data-builder-ruler="top"]').first();
    const rulerVisible = await topRuler.isVisible().catch(() => false);
    if (!rulerVisible) {
      findings.push({
        severity: 'blocker',
        summary: '상단 눈금자([data-builder-ruler="top"])가 렌더되지 않아 가이드 생성 진입 불가',
      });
      await recordEvidence('guides-no-ruler');
      return { findings };
    }

    const beforeGuides = await page.locator(GUIDE_SEL).count().catch(() => 0);
    log(`드래그 전 가이드 수: ${beforeGuides}`);
    await recordEvidence('guides-before');

    // ===== CREATE: spec(editor-guides-grid.playwright.ts:132-144) 의 정확한 단계 미러 =====
    const box = await topRuler.boundingBox();
    if (!box) {
      findings.push({
        severity: 'blocker',
        summary: '상단 눈금자의 boundingBox 를 읽을 수 없음',
      });
      return { findings };
    }
    const startX = box.x + Math.min(240, Math.max(12, box.width / 3));
    const startY = box.y + Math.max(2, box.height / 2);
    log(
      `상단 눈금자에서 캔버스로 드래그(start=(${Math.round(startX)},${Math.round(startY)}) → 아래 +80px)`,
    );
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX, startY + 80, { steps: 6 });
    await page.mouse.up();

    const verticalGuide = page.locator('[data-builder-guide-axis="vertical"]').first();
    const created = await verticalGuide
      .waitFor({ state: 'visible', timeout: 5_000 })
      .then(() => true)
      .catch(() => false);
    const afterGuides = await page.locator(GUIDE_SEL).count().catch(() => 0);
    log(`드래그 후 가이드 수: ${afterGuides}, vertical guide visible=${created}`);
    await recordEvidence('guides-after-create');

    if (!created || afterGuides <= beforeGuides) {
      findings.push({
        severity: 'blocker',
        summary:
          '상단 눈금자 → 캔버스 드래그 후 vertical 가이드([data-builder-guide-axis="vertical"])가 생성되지 않음 (spec 미러 인터랙션)',
      });
      return { findings };
    }

    // spec: prefs.referenceGuides 가 갱신되었는지 2차 신호 확인.
    const prefs = (await page
      .evaluate((key) => JSON.parse(window.localStorage.getItem(key) || '{}'), PREFS_KEY)
      .catch(() => ({}))) as { referenceGuides?: unknown[] };
    log(`prefs.referenceGuides.length=${prefs.referenceGuides?.length ?? 'n/a'}`);
    if (!prefs.referenceGuides || prefs.referenceGuides.length === 0) {
      findings.push({
        severity: 'visual',
        summary: '가이드 DOM 은 생성되었으나 prefs.referenceGuides 가 갱신되지 않음(2차 신호 불일치)',
      });
    }

    // ===== REPOSITION (best-effort; spec 미사양 → soft) =====
    // 생성된 vertical 가이드를 잡아 x 축으로 이동한 뒤 위치 변화를 관찰.
    log('가이드 재배치(best-effort) 시도');
    const guideBoxBefore = await verticalGuide.boundingBox().catch(() => null);
    if (guideBoxBefore) {
      const gx = guideBoxBefore.x + guideBoxBefore.width / 2;
      const gy = guideBoxBefore.y + guideBoxBefore.height / 2;
      const targetX = gx + 60;
      await page.mouse.move(gx, gy);
      await page.mouse.down();
      await page.mouse.move(targetX, gy, { steps: 6 });
      await page.mouse.up();
      await page.waitForTimeout(250);
      const guideBoxAfter = await verticalGuide.boundingBox().catch(() => null);
      const afterCenterX = guideBoxAfter
        ? guideBoxAfter.x + guideBoxAfter.width / 2
        : null;
      const moved = afterCenterX !== null && Math.abs(afterCenterX - gx) > 10;
      const afterCenterLabel =
        afterCenterX !== null ? String(Math.round(afterCenterX)) : 'n/a';
      log(
        '재배치: 이동 전 x=' +
          Math.round(gx) +
          ', 이동 후 x=' +
          afterCenterLabel +
          ', moved=' +
          moved,
      );
      await recordEvidence('guides-after-reposition');
      if (!moved) {
        findings.push({
          severity: 'visual',
          summary: '생성된 가이드를 드래그하여 재배치하지 못함(spec 미사양, soft)',
        });
      }
    } else {
      log('재배치 생략: 가이드 boundingBox 없음');
    }

    // ===== DELETE (best-effort; spec 은 delete-by-dragging-to-ruler 를 다루지 않음 → soft) =====
    // vertical 가이드를 상단 눈금자 방향으로 끌어 올려 제거(=drag-back-to-ruler) 시도.
    log('가이드 제거(best-effort, drag-back-to-ruler) 시도');
    const beforeRemove = await page.locator(GUIDE_SEL).count().catch(() => 0);
    const removeBox = await verticalGuide.boundingBox().catch(() => null);
    const topBox = await topRuler.boundingBox().catch(() => null);
    if (removeBox && topBox) {
      const rx = removeBox.x + removeBox.width / 2;
      const ry = removeBox.y + removeBox.height / 2;
      const destY = topBox.y + topBox.height / 2;
      await page.mouse.move(rx, ry);
      await page.mouse.down();
      await page.mouse.move(rx, destY, { steps: 6 });
      await page.mouse.up();
      await page.waitForTimeout(300);
    }
    const afterRemove = await page.locator(GUIDE_SEL).count().catch(() => 0);
    log('제거 시도 전=' + beforeRemove + ', 후=' + afterRemove);
    await recordEvidence('guides-after-remove');
    if (afterRemove >= beforeRemove) {
      findings.push({
        severity: 'visual',
        summary:
          'drag-back-to-ruler 제거가 동작하지 않음(spec 은 제거를 다루지 않으므로 hard gate 아님; 별도 검증 필요)',
      });
    }

    return { findings };
  },
};
