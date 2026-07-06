import type { Locator, Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { dismissOverlays, gotoBuilder, selectFirstNode, SHORTCUT_MODIFIER } from '../helpers';

// 반복(Loop) 섹션 — float / bounce / sway / wiggle(shake 계열) 프리셋.
const LOOP_PRESET_LABELS = ['반복 프리셋', 'Loop preset', '循環預設'];

function inspector(page: Page) {
  return page.locator('[data-builder-inspector-panel="true"]');
}

function animationsTabButton(page: Page) {
  return inspector(page).getByRole('button', { name: /^(animations|애니메이션|動畫)$/i }).first();
}

function loopPresetCombo(page: Page) {
  return inspector(page).getByRole('combobox', { name: new RegExp(LOOP_PRESET_LABELS.join('|')) }).first();
}

function sectionOf(locator: Locator): Locator {
  return locator.locator('xpath=ancestor::section[1]');
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

export const W171_loopFloat: CheckpointDefinition = {
  id: 'W171',
  title: '반복(Loop) 애니메이션 - float/bounce/shake: 선택 → 적용(duration/intensity 활성화) → undo',
  verification:
    '노드 선택 → 애니메이션 탭 → 반복 프리셋을 float/bounce/sway/wiggle 로 순회 변경 → 콤보박스 값 반영 + duration/intensity 활성화(preset=none 게이트 해제) 확인 → undo 복원',
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
      await recordEvidence('w171-anim-tab-missing');
      return { findings };
    }
    await tabBtn.click({ force: true });
    await page.waitForTimeout(350);

    const combo = loopPresetCombo(page);
    if ((await combo.count().catch(() => 0)) === 0) {
      findings.push({ severity: 'blocker', summary: '반복 프리셋(Loop preset) 콤보박스를 찾을 수 없음' });
      await recordEvidence('w171-loop-combo-missing');
      return { findings };
    }

    const original = await combo.inputValue().catch(() => '');
    log(`현재 반복 프리셋: "${original}"`);

    const loopSection = sectionOf(combo);
    const durationInput = loopSection.getByRole('spinbutton', { name: /시간 \(ms\)|Duration \(ms\)/ }).first();
    const intensityInput = loopSection.getByRole('spinbutton', { name: /강도|Intensity/ }).first();

    // float(플로트), bounce(바운스), sway(스웨이), wiggle(위글=shake 계열) 순회.
    const presets = ['float', 'bounce', 'sway', 'wiggle'] as const;
    for (const value of presets) {
      log(`반복 프리셋 → ${value}`);
      await combo.selectOption(value);
      await page.waitForTimeout(220);
      const applied = await combo.inputValue().catch(() => '');
      const durationDisabled = await durationInput.isDisabled().catch(() => true);
      const intensityDisabled = await intensityInput.isDisabled().catch(() => true);
      log(`적용 후 값="${applied}", duration disabled=${durationDisabled}, intensity disabled=${intensityDisabled}`);
      await recordEvidence(`w171-${value}-applied`);
      if (applied !== value) {
        findings.push({
          severity: 'blocker',
          summary: `반복 프리셋이 ${value}(으)로 commit 되지 않음 (현재="${applied}")`,
        });
      }
      if (durationDisabled) {
        findings.push({
          severity: 'visual',
          summary: `${value} 적용 후에도 반복 duration 컨트롤이 비활성 상태임`,
        });
      }
      if (intensityDisabled) {
        findings.push({
          severity: 'visual',
          summary: `${value} 적용 후에도 반복 intensity 컨트롤이 비활성 상태임`,
        });
      }
    }

    log('undo 로 복원');
    // preset 변경 4회 누적 → undo 4회 + 수동 보정.
    for (let i = 0; i < presets.length; i += 1) {
      await page.keyboard.press(`${SHORTCUT_MODIFIER}+z`);
      await page.waitForTimeout(150);
    }
    await combo.selectOption(original || 'none').catch(() => undefined);
    await page.waitForTimeout(200);
    const restored = await combo.inputValue().catch(() => '');
    log(`복원 후 값="${restored}" (기대 "${original}")`);
    if (restored !== original) {
      findings.push({
        severity: 'minor',
        summary: `undo 후 반복 프리셋이 원래값("${original}")으로 완전히 복원되지 않아 수동 복원함 (현재="${restored}")`,
      });
    }
    await recordEvidence('w171-undone');

    // Published-runtime emission 검증: float 프리셋을 다시 적용해 발행하고 게시 페이지에
    // data-anim-loop="float" 가 노출되는지 확인. 루프 런타임은 @keyframes builder-loop-float
    // (globals.css) + AnimationsRoot 가 주입하는 --builder-anim-loop-float-y CSS var 로 실행됨.
    log('float 재적용 후 발행하여 게시 emission 확인');
    await combo.selectOption('float');
    await page.waitForTimeout(220);
    const floatPublished = await publishSiteViaApi(page, homePageId, log);
    if (!floatPublished) {
      findings.push({
        severity: 'blocker',
        summary: '발행 플로우를 완료할 수 없어 게시 페이지의 loop(float) emission 검증 불가',
      });
    } else {
      const { status, body } = await fetchPublishedBody(page, baseUrl);
      const loopAttr = body.includes('data-anim-loop="float"');
      log(`게시 페이지 status=${status}, data-anim-loop="float"=${loopAttr}`);
      await recordEvidence('w171-published-emission');
      if (loopAttr) {
        log('게시 런타임 확인: @keyframes builder-loop-float + AnimationsRoot CSS var 로 float 루프 실행 (에디터 캔버스는 루프 미리보기 없음)');
      } else {
        findings.push({
          severity: 'blocker',
          summary: '게시 페이지에 float loop emission(data-anim-loop="float")이 없음 — @keyframes builder-loop-float 가 노드에 연결되지 않음',
        });
      }
    }

    // 초안 복원 + 게시본 정리: 원래값으로 되돌리고 재발행하여 QA 효과가 home 에 남지 않도록 정리.
    log('초안 float → 원래값 복원 후 재발행');
    await combo.selectOption(original || 'none').catch(() => undefined);
    await page.waitForTimeout(200);
    await publishSiteViaApi(page, homePageId, log).catch(() => undefined);
    await recordEvidence('w171-published-restored');

    return { findings };
  },
};
