import type { Locator, Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { dismissOverlays, gotoBuilder, selectFirstNode, SHORTCUT_MODIFIER } from '../helpers';

// 스크롤(Scroll) 섹션 — 패럴랙스 효과.
const SCROLL_EFFECT_LABELS = ['스크롤 효과', 'Scroll effect', '捲動效果'];

function inspector(page: Page) {
  return page.locator('[data-builder-inspector-panel="true"]');
}

function animationsTabButton(page: Page) {
  return inspector(page).getByRole('button', { name: /^(animations|애니메이션|動畫)$/i }).first();
}

function scrollEffectCombo(page: Page) {
  return inspector(page).getByRole('combobox', { name: new RegExp(SCROLL_EFFECT_LABELS.join('|')) }).first();
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

export const W161_parallax: CheckpointDefinition = {
  id: 'W161',
  title: '스크롤 패럴랙스: parallax-y / background-parallax 선택 → 적용(intensity 활성화) → undo',
  verification:
    '노드 선택 → 애니메이션 탭 → 스크롤 효과를 parallax-y / background-parallax 로 변경 → 콤보박스 값 반영 + intensity 컨트롤 활성화(effect=none 게이트 해제) 확인 → undo 복원',
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
      await recordEvidence('w161-anim-tab-missing');
      return { findings };
    }
    await tabBtn.click({ force: true });
    await page.waitForTimeout(350);

    const combo = scrollEffectCombo(page);
    if ((await combo.count().catch(() => 0)) === 0) {
      findings.push({ severity: 'blocker', summary: '스크롤 효과(Scroll effect) 콤보박스를 찾을 수 없음' });
      await recordEvidence('w161-scroll-combo-missing');
      return { findings };
    }

    const original = await combo.inputValue().catch(() => '');
    log(`현재 스크롤 효과: "${original}"`);

    const scrollSection = sectionOf(combo);
    const intensityInput = scrollSection.getByRole('spinbutton', { name: /강도|Intensity/ }).first();

    const intensityGateBefore = await intensityInput.isDisabled().catch(() => true);
    log(`intensity disabled(변경 전, none 게이트): ${intensityGateBefore}`);

    for (const value of ['parallax-y', 'background-parallax'] as const) {
      log(`스크롤 효과 → ${value}`);
      await combo.selectOption(value);
      await page.waitForTimeout(250);
      const applied = await combo.inputValue().catch(() => '');
      const intensityDisabled = await intensityInput.isDisabled().catch(() => true);
      log(`적용 후 값="${applied}", intensity disabled=${intensityDisabled}`);
      await recordEvidence(`w161-${value}-applied`);
      if (applied !== value) {
        findings.push({
          severity: 'blocker',
          summary: `스크롤 효과가 ${value}(으)로 commit 되지 않음 (현재="${applied}")`,
        });
      }
      if (intensityDisabled) {
        findings.push({
          severity: 'visual',
          summary: `${value} 적용 후에도 intensity 컨트롤이 비활성 상태임 (effect=none 게이트가 풀리지 않음)`,
        });
      }

      log('undo 로 복원');
      await page.keyboard.press(`${SHORTCUT_MODIFIER}+z`);
      await page.waitForTimeout(400);
      const restored = await combo.inputValue().catch(() => '');
      log(`undo 후 값="${restored}" (기대 "${original}")`);
      if (restored !== original) {
        await combo.selectOption(original || 'none').catch(() => undefined);
        await page.waitForTimeout(200);
        findings.push({
          severity: 'minor',
          summary: `undo 가 ${value} 를 원래값("${original}")으로 되돌리지 못해 수동 복원함`,
        });
      }
    }

    // Published-runtime emission 검증: parallax-y 를 다시 적용해 발행하고 게시 페이지에
    // data-anim-scroll="parallax-y" 가 노출되는지 확인. 패럴랙스 런타임은 게시 페이지의
    // rAF 루프(AnimationsRoot)에서 --builder-scroll-transform 를 보간해 실행됨.
    log('parallax-y 재적용 후 발행하여 게시 emission 확인');
    await combo.selectOption('parallax-y');
    await page.waitForTimeout(250);
    const parallaxPublished = await publishSiteViaApi(page, homePageId, log);
    if (!parallaxPublished) {
      findings.push({
        severity: 'blocker',
        summary: '발행 플로우를 완료할 수 없어 게시 페이지의 scroll(parallax-y) emission 검증 불가',
      });
    } else {
      const { status, body } = await fetchPublishedBody(page, baseUrl);
      const scrollAttr = body.includes('data-anim-scroll="parallax-y"');
      log(`게시 페이지 status=${status}, data-anim-scroll="parallax-y"=${scrollAttr}`);
      await recordEvidence('w161-published-emission');
      if (scrollAttr) {
        log('게시 런타임 확인: rAF 루프(AnimationsRoot)가 --builder-scroll-transform 를 보간해 parallax-y 실행 (에디터 캔버스는 미리보기 없음, background-parallax 는 노드가 이미지 배경일 때만 가시)');
      } else {
        findings.push({
          severity: 'blocker',
          summary: '게시 페이지에 parallax scroll emission(data-anim-scroll="parallax-y")이 없음 — rAF 보간 루프가 노드에 연결되지 않음',
        });
      }
    }

    // 초안 복원 + 게시본 정리: 원래값으로 되돌리고 재발행하여 QA 효과가 home 에 남지 않도록 정리.
    log('초안 parallax → 원래값 복원 후 재발행');
    await combo.selectOption(original || 'none').catch(() => undefined);
    await page.waitForTimeout(200);
    await publishSiteViaApi(page, homePageId, log).catch(() => undefined);
    await recordEvidence('w161-published-restored');

    return { findings };
  },
};
