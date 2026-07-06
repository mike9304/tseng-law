import type { Locator, Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { dismissOverlays, gotoBuilder, selectFirstNode, SHORTCUT_MODIFIER } from '../helpers';

// 모션 타임라인(Motion timeline) 섹션 — 키프레임 트랙 편집기.
const TIMELINE_SECTION_LABELS = ['모션 타임라인', 'Motion timeline', '動態時間軸'];
const REMOVE_TIMELINE_LABELS = ['타임라인 제거', 'Remove timeline', '移除時間軸'];

function inspector(page: Page) {
  return page.locator('[data-builder-inspector-panel="true"]');
}

function animationsTabButton(page: Page) {
  return inspector(page).getByRole('button', { name: /^(animations|애니메이션|動畫)$/i }).first();
}

function timelineSection(page: Page) {
  return inspector(page).locator('section').filter({ hasText: new RegExp(TIMELINE_SECTION_LABELS.join('|')) }).first();
}

function timelineTrack(section: Locator): Locator {
  // 트랙 div: role="presentation" + 키프레임 추가 안내 title.
  return section
    .locator('[role="presentation"][title*="키프레임"], [role="presentation"][title*="keyframe"], [role="presentation"][title*="關鍵影格"]')
    .first();
}

function keyframeRowCount(section: Locator): Locator {
  // 각 키프레임의 opacity spinbutton 으로 row 수를 센다(aria-label = "키프레임 N 투명도" / "Opacity keyframe N").
  return section.getByRole('spinbutton', { name: /키프레임 \d 투명도|Opacity keyframe \d|關鍵影格 \d 不透明度/ });
}

function keyframeOffsetInput(section: Locator, index: number): Locator {
  return section
    .getByRole('spinbutton', { name: new RegExp(`키프레임 ${index} 오프셋|Offset keyframe ${index}|關鍵影格 ${index} 位移`) })
    .first();
}

function keyframeMarker(section: Locator, index: number): Locator {
  return section.locator(`[data-builder-motion-keyframe-marker="${index}"]`).first();
}

function keyframeEasingSelect(section: Locator, index: number): Locator {
  return section
    .getByRole('combobox', { name: new RegExp(`키프레임 ${index} 이징|Easing keyframe ${index}|關鍵影格 ${index} 緩動`) })
    .first();
}

// --- 발행(publish) → 게시 페이지 런타임 emission 검증 헬퍼 ---
// NOTE: UI 발행 모달은 preflight acknowledgement 단계에서 ~92s hang 하여, 그 사이
// runtime-emission 검증이 stale 게시본을 보는 문제가 있었다. 대신 publish API 로
// 초안을 직접 발행한다. (패턴 출처: tests/builder-editor/atomic-publish-*.playwright.ts)

// 실제 home pageId 해결 — UI 발행 없이 API 로 발행하려면 pageId 가 필요.
// (W26-version-history.ts 의 해결 방식 재사용: GET /api/builder/site/pages)
async function resolveHomePageId(page: Page): Promise<string> {
  return page.evaluate(async () => {
    try {
      const res = await fetch('/api/builder/site/pages?locale=ko', { credentials: 'same-origin' });
      if (!res.ok) return '';
      const data = (await res.json()) as {
        pages?: Array<{ pageId: string; slug?: string; isHomePage?: boolean }>;
      };
      const pages = data.pages ?? [];
      const home =
        pages.find((p) => p.isHomePage) ??
        pages.find((p) => (p.slug ?? '') === '') ??
        pages[0];
      return home?.pageId ?? '';
    } catch {
      return '';
    }
  });
}

// 편집 후 autosave(debounce 1000ms) 가 초안을 서버에 flush 할 때까지 대기.
// UI 발행 플로우는 발행 전에 PUT /draft 로 초안을 명시적으로 flush 하므로, API 직접
// 발행으로 교체할 때도 flush 를 보장해야 게시본이 최신 초안을 반영한다.
// data-builder-save-status 칩이 'saved' 가 되면 flush 완료.
async function waitForDraftSaved(page: Page, timeout = 10_000): Promise<boolean> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const status = await page
      .evaluate(
        () =>
          document
            .querySelector('[data-builder-save-status]')
            ?.getAttribute('data-builder-save-status') ?? null,
      )
      .catch(() => null);
    if (status === 'saved') return true;
    if (status === 'error') return false;
    await page.waitForTimeout(150);
  }
  return false;
}

// publish API 로 직접 발행. atomic publish 는 pageIds 초안을 단일 트랜잭션으로 발행하며
// preflight 모달을 거치지 않는다. 발행 전 autosave flush 보장 후 200 ok 를 확인한다.
async function publishSiteViaApi(
  page: Page,
  pageId: string,
  log: (step: string) => void,
): Promise<boolean> {
  if (!pageId) {
    log('home pageId 없음 — 발행 API 호출 불가');
    return false;
  }
  log('초안 autosave flush 대기 (data-builder-save-status=saved)');
  const flushed = await waitForDraftSaved(page);
  if (!flushed) {
    log('autosave flush 미확인 — 발행은 계속, 게시본이 초안을 못 따를 수 있음');
  }
  log('publish API 호출: POST /api/builder/publish/atomic');
  try {
    const res = await page.request.post('/api/builder/publish/atomic', {
      data: { pageIds: [pageId], cmsCollectionIds: [], locale: 'ko' },
      timeout: 60_000,
    });
    const status = res.status();
    const payload = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    log(
      `publish API 응답: status=${status}, ok=${payload.ok ?? false}${
        payload.error ? `, error=${payload.error}` : ''
      }`,
    );
    return status === 200 && payload.ok === true;
  } catch (err) {
    log(`publish API 예외: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
}

async function fetchPublishedBody(
  page: Page,
  baseUrl: string,
): Promise<{ status: number | null; body: string }> {
  const url = new URL('/ko', baseUrl).toString();
  try {
    const res = await page.request.get(url, { timeout: 30_000 });
    return { status: res.status(), body: await res.text() };
  } catch {
    return { status: null, body: '' };
  }
}

export const W173_timelineEditor: CheckpointDefinition = {
  id: 'W173',
  title: '모션 타임라인 편집기: 렌더 + 키프레임 추가/드래그/이징/삭제 → cleanup',
  verification:
    '노드 선택 → 애니메이션 탭 → 모션 타임라인 섹션/트랙 렌더 확인 → 트랙 클릭으로 키프레임 추가 → marker drag/transform/opacity/easing 편집 → 키프레임 삭제 → undo 로 cleanup',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);
    log('잔여 overlay 정리 (Escape x2)');
    await dismissOverlays(page);

    // UI 발행 모달 없이 publish API 로 직접 발행하기 위해 home pageId 를 미리 해결.
    const homePageId = await resolveHomePageId(page);
    log(`home pageId 해결: "${homePageId}"`);

    const findings: CheckpointFinding[] = [];

    log('노드 선택');
    await selectFirstNode(page);

    log('애니메이션 탭 진입');
    const tabBtn = animationsTabButton(page);
    if (!(await tabBtn.isVisible().catch(() => false))) {
      findings.push({ severity: 'blocker', summary: '인스펙터에 애니메이션(Animations) 탭 버튼이 보이지 않음' });
      await recordEvidence('w173-anim-tab-missing');
      return { findings };
    }
    await tabBtn.click({ force: true });
    await page.waitForTimeout(350);

    const section = timelineSection(page);
    const sectionVisible = await section.isVisible().catch(() => false);
    if (!sectionVisible) {
      findings.push({
        severity: 'blocker',
        summary: `모션 타임라인(Motion timeline) 섹션이 렌더되지 않음 — 타임라인 편집기 UI 가 없음`,
      });
      await recordEvidence('w173-timeline-section-missing');
      return { findings };
    }

    const track = timelineTrack(section);
    const trackVisible = await track.isVisible().catch(() => false);
    if (!trackVisible) {
      findings.push({
        severity: 'blocker',
        summary: '모션 타임라인 트랙(role=presentation, 키프레임 추가 title)이 렌더되지 않음',
      });
      await recordEvidence('w173-timeline-track-missing');
      return { findings };
    }
    log('타임라인 섹션 + 트랙 렌더 확인');
    await recordEvidence('w173-timeline-rendered');

    const initialRows = await keyframeRowCount(section).count().catch(() => 0);
    log(`초기 키프레임 row 수: ${initialRows}`);

    // 키프레임 추가: 트랙 중앙 클릭.
    log('트랙 클릭 → 키프레임 추가');
    await track.click({ force: true });
    await page.waitForTimeout(250);
    const afterAdd = await keyframeRowCount(section).count().catch(() => 0);
    log(`추가 후 키프레임 row 수: ${afterAdd}`);
    await recordEvidence('w173-keyframe-added');
    if (afterAdd <= initialRows) {
      findings.push({
        severity: 'blocker',
        summary: '트랙 클릭으로 키프레임이 추가되지 않음 (row 수 변화 없음)',
      });
    }

    // 키프레임 편집: transform 텍스트 + opacity 값.
    if (afterAdd > initialRows) {
      const offsetInput = keyframeOffsetInput(section, 1);
      const transformInput = section.locator('input[placeholder*="translateY"]').first();
      const opacityInput = section
        .getByRole('spinbutton', { name: /키프레임 1 투명도|Opacity keyframe 1|關鍵影格 1 不透明度/ })
        .first();
      const easingSelect = keyframeEasingSelect(section, 1);

      if ((await offsetInput.count().catch(() => 0)) > 0 && (await keyframeMarker(section, 1).count().catch(() => 0)) > 0) {
        const marker = keyframeMarker(section, 1);
        const beforeOffset = Number(await offsetInput.inputValue().catch(() => '0'));
        const markerBox = await marker.boundingBox();
        const trackBox = await track.boundingBox();
        if (markerBox && trackBox) {
          log(`marker drag 시작: offset=${beforeOffset}`);
          await page.mouse.move(markerBox.x + markerBox.width / 2, markerBox.y + markerBox.height / 2);
          await page.mouse.down();
          await page.mouse.move(trackBox.x + trackBox.width * 0.78, markerBox.y + markerBox.height / 2, { steps: 8 });
          await page.mouse.up();
          await page.waitForTimeout(250);
          const afterDragOffset = Number(await offsetInput.inputValue().catch(() => '0'));
          log(`marker drag 후 offset=${afterDragOffset}`);
          await recordEvidence('w173-keyframe-marker-dragged');
          if (!(afterDragOffset > beforeOffset + 0.05)) {
            findings.push({
              severity: 'visual',
              summary: `키프레임 marker drag 후 offset 이 증가하지 않음 (before=${beforeOffset}, after=${afterDragOffset})`,
            });
          }
        } else {
          findings.push({ severity: 'visual', summary: '키프레임 marker 또는 track bounding box 를 읽지 못함' });
        }
      } else {
        findings.push({ severity: 'visual', summary: '키프레임 marker drag 대상 또는 offset 입력 필드를 찾지 못함' });
      }

      if ((await transformInput.count().catch(() => 0)) > 0) {
        const tfValue = 'translateY(-12px) scale(1.04)';
        log(`transform 입력: ${tfValue}`);
        await transformInput.fill(tfValue);
        await transformInput.press('Tab');
        await page.waitForTimeout(200);
        await recordEvidence('w173-keyframe-transform-set');
      } else {
        findings.push({ severity: 'visual', summary: '키프레임 transform 입력 필드를 찾지 못함' });
      }

      if ((await opacityInput.count().catch(() => 0)) > 0) {
        const opacityTarget = 0.8;
        log(`opacity 입력: ${opacityTarget}`);
        await opacityInput.fill(String(opacityTarget));
        await opacityInput.press('Enter');
        await page.waitForTimeout(200);
        const committed = Number(await opacityInput.inputValue().catch(() => '1'));
        log(`opacity commit 후="${committed}"`);
        await recordEvidence('w173-keyframe-opacity-set');
        if (committed !== opacityTarget) {
          findings.push({
            severity: 'visual',
            summary: `키프레임 opacity(${opacityTarget})가 commit 되지 않음 (현재="${committed}")`,
          });
        }
      } else {
        findings.push({ severity: 'visual', summary: '키프레임 opacity 입력 필드를 찾지 못함' });
      }

      if ((await easingSelect.count().catch(() => 0)) > 0) {
        log('easing 선택: ease-in');
        await easingSelect.selectOption('ease-in');
        await page.waitForTimeout(200);
        const committedEasing = await easingSelect.inputValue().catch(() => '');
        log(`easing commit 후="${committedEasing}"`);
        await recordEvidence('w173-keyframe-easing-set');
        if (committedEasing !== 'ease-in') {
          findings.push({
            severity: 'visual',
            summary: `키프레임 easing(ease-in)이 commit 되지 않음 (현재="${committedEasing}")`,
          });
        }
      } else {
        findings.push({ severity: 'visual', summary: '키프레임 easing select 를 찾지 못함' });
      }

      // Published-runtime emission 검증: 키프레임이 존재하는 상태에서 발행하여 게시 페이지에
      // data-anim-timeline(키프레임 JSON) + data-anim-timeline-mode + data-anim-timeline-duration
      // 가 노출되는지 확인. 타임라인 런타임은 게시 페이지 rAF(AnimationsRoot tickTimeline)가
      // time/scroll 진행률에 따라 --builder-anim-timeline-transform/opacity 를 보간.
      log('키프레임 존재 상태에서 발행하여 게시 timeline emission 확인');
      const timelinePublished = await publishSiteViaApi(page, homePageId, log);
      if (!timelinePublished) {
        findings.push({
          severity: 'blocker',
          summary: '발행 플로우를 완료할 수 없어 게시 페이지의 timeline emission 검증 불가',
        });
      } else {
        const { status, body } = await fetchPublishedBody(page, baseUrl);
        const modeAttr = body.includes('data-anim-timeline-mode="');
        const durationAttr = body.includes('data-anim-timeline-duration="');
        const easingAttr = body.includes('ease-in');
        log(`게시 페이지 status=${status}, timeline-mode=${modeAttr}, timeline-duration=${durationAttr}, easing=${easingAttr}`);
        await recordEvidence('w173-published-emission');
        if (modeAttr && durationAttr && easingAttr) {
          log('게시 런타임 확인: rAF(tickTimeline)가 --builder-anim-timeline-transform/opacity 를 보간 실행 (에디터 캔버스는 보간 재생 없음)');
        } else {
          findings.push({
            severity: 'blocker',
            summary: `게시 페이지에 timeline emission 이 없음 (mode=${modeAttr}, duration=${durationAttr}, easing=${easingAttr}) — rAF 보간 루프가 노드에 연결되지 않음`,
          });
        }
      }

      // 키프레임 삭제: × 버튼(aria-label "키프레임 1 제거" / "Remove keyframe 1").
      const removeKfBtn = section
        .getByRole('button', { name: /키프레임 1 제거|Remove keyframe 1|移除關鍵影格 1/ })
        .first();
      if ((await removeKfBtn.count().catch(() => 0)) > 0) {
        log('키프레임 × 버튼으로 삭제');
        await removeKfBtn.click({ force: true });
        await page.waitForTimeout(200);
        const afterRemove = await keyframeRowCount(section).count().catch(() => 0);
        log(`삭제 후 키프레임 row 수: ${afterRemove}`);
        await recordEvidence('w173-keyframe-removed');
        if (afterRemove >= afterAdd) {
          findings.push({ severity: 'visual', summary: '× 버튼 클릭 후에도 키프레임이 삭제되지 않음' });
        }
      } else {
        findings.push({ severity: 'visual', summary: '키프레임 삭제(×) 버튼을 찾지 못함' });
      }
    }

    log('cleanup: undo 로 타임라인 잔여 변경을 폐기');
    // 키프레임 추가/편집/삭제 변경 이력을 undo 로 되돌림. 잔여 타임라인 객체가 남으면 "타임라인 제거" 로 최종 폐기.
    for (let i = 0; i < 4; i += 1) {
      await page.keyboard.press(`${SHORTCUT_MODIFIER}+z`);
      await page.waitForTimeout(150);
    }
    const removeTimelineBtn = section
      .getByRole('button', { name: new RegExp(REMOVE_TIMELINE_LABELS.join('|')) })
      .first();
    if (await removeTimelineBtn.isVisible().catch(() => false)) {
      log('잔여 타임라인 객체 폐기(타임라인 제거)');
      await removeTimelineBtn.click({ force: true });
      await page.waitForTimeout(200);
    }
    const finalRows = await keyframeRowCount(section).count().catch(() => 0);
    log(`cleanup 후 키프레임 row 수: ${finalRows}`);
    if (finalRows > initialRows) {
      findings.push({
        severity: 'minor',
        summary: `cleanup 후에도 키프레임 ${finalRows - initialRows}개가 잔존함`,
      });
    }
    await recordEvidence('w173-cleaned');

    // 게시본 정리: cleanup 으로 타임라인을 제거한 초안을 재발행하여 QA 효과가 home 에 남지 않도록 정리.
    log('초안 타임라인 제거 상태로 재발행');
    await publishSiteViaApi(page, homePageId, log).catch(() => undefined);
    await recordEvidence('w173-published-restored');

    return { findings };
  },
};
