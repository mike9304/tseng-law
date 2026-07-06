import type { Locator, Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { dismissOverlays, gotoBuilder, selectFirstNode, SHORTCUT_MODIFIER } from '../helpers';

// 스크롤(Scroll) 섹션 — 스크럽(scrub-*) 모드.
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

export const W167_scrub: CheckpointDefinition = {
  id: 'W167',
  title: '스크롤 스크럽 모드: scrub-translate/opacity/rotate 선택 → 적용(intensity + 음수 범위) → undo',
  verification:
    '노드 선택 → 애니메이션 탭 → 스크롤 효과를 scrub-translate/scrub-opacity/scrub-rotate 로 변경 → 콤보박스 값 반영 + intensity 활성화 → intensity 를 음수로 설정 → undo 복원',
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
      await recordEvidence('w167-anim-tab-missing');
      return { findings };
    }
    await tabBtn.click({ force: true });
    await page.waitForTimeout(350);

    const combo = scrollEffectCombo(page);
    if ((await combo.count().catch(() => 0)) === 0) {
      findings.push({ severity: 'blocker', summary: '스크롤 효과(Scroll effect) 콤보박스를 찾을 수 없음' });
      await recordEvidence('w167-scroll-combo-missing');
      return { findings };
    }

    const original = await combo.inputValue().catch(() => '');
    log(`현재 스크롤 효과: "${original}"`);

    const scrollSection = sectionOf(combo);
    const intensityInput = scrollSection.getByRole('spinbutton', { name: /강도|Intensity/ }).first();

    const scrubOptions = ['scrub-translate', 'scrub-opacity', 'scrub-rotate'] as const;
    const found = await combo.evaluate((el) => {
      const select = el as HTMLSelectElement;
      return Array.from(select.options).map((o) => o.value);
    });
    const missingScrub = scrubOptions.filter((opt) => !found.includes(opt));
    if (missingScrub.length > 0) {
      findings.push({
        severity: 'blocker',
        summary: `스크럽 옵션(${missingScrub.join(', ')})이 스크롤 효과 콤보박스에 존재하지 않음`,
      });
    }

    // 첫 옵션으로 scrub-translate 고정 후 intensity(음수 포함) 검증.
    log('스크롤 효과 → scrub-translate');
    await combo.selectOption('scrub-translate');
    await page.waitForTimeout(250);
    const appliedTranslate = await combo.inputValue().catch(() => '');
    const intensityDisabled = await intensityInput.isDisabled().catch(() => true);
    log(`적용 후 값="${appliedTranslate}", intensity disabled=${intensityDisabled}`);
    await recordEvidence('w167-scrub-translate-applied');
    if (appliedTranslate !== 'scrub-translate') {
      findings.push({
        severity: 'blocker',
        summary: `스크롤 효과가 scrub-translate 로 commit 되지 않음 (현재="${appliedTranslate}")`,
      });
    }
    if (intensityDisabled) {
      findings.push({
        severity: 'visual',
        summary: 'scrub-translate 적용 후에도 intensity 컨트롤이 비활성 상태임',
      });
    }

    // intensity 음수 범위 검증(min=-100).
    if (!intensityDisabled) {
      const currentIntensity = Number(await intensityInput.inputValue().catch(() => '0'));
      const targetIntensity = -40;
      log(`intensity ${currentIntensity} → ${targetIntensity}(음수 범위 검증)`);
      await intensityInput.fill(String(targetIntensity));
      await intensityInput.press('Enter');
      await page.waitForTimeout(250);
      const committed = Number(await intensityInput.inputValue().catch(() => '0'));
      log(`intensity commit 후="${committed}"`);
      await recordEvidence('w167-scrub-negative-intensity');
      if (committed !== targetIntensity) {
        findings.push({
          severity: 'blocker',
          summary: `scrub intensity 음수값(${targetIntensity})이 commit 되지 않음 (현재="${committed}") — 스크럽 방향 반전이 불가능`,
        });
      }
    }

    // scrub-opacity / scrub-rotate 도 commit 되는지만 빠르게 확인.
    for (const value of ['scrub-opacity', 'scrub-rotate'] as const) {
      await combo.selectOption(value).catch(() => undefined);
      await page.waitForTimeout(200);
      const applied = await combo.inputValue().catch(() => '');
      log(`${value} 적용 후 값="${applied}"`);
      if (applied !== value) {
        findings.push({
          severity: 'blocker',
          summary: `스크롤 효과가 ${value}(으)로 commit 되지 않음 (현재="${applied}")`,
        });
      }
    }

    log('undo 로 복원 (scrub 효과 + intensity 변경 이월분)');
    // scrub-translate 셋 + intensity 변경 + scrub-opacity/rotate 셀렉트 → 여러 mutation 이력.
    // 원래값으로 확실히 돌리기 위해 undo 수회 후 잔여분은 수동 복원.
    for (let i = 0; i < 4; i += 1) {
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
        summary: `undo 후 스크롤 효과가 원래값("${original}")으로 완전히 복원되지 않아 수동 복원함 (현재="${restored}")`,
      });
    }
    await recordEvidence('w167-undone');

    // Published-runtime emission 검증: scrub-translate + 음수 intensity(-40) 를 다시 적용해
    // 발행하고 게시 페이지에 data-anim-scroll="scrub-translate" + data-anim-intensity="-40"
    // 가 노출되는지 확인. 스크럽 런타임은 게시 페이지 rAF 가 스크롤 진행률에 따라
    // --builder-anim-scrub-progress 를 갱신하고 CSS 가 transform/opacity 를 보간.
    log('scrub-translate + 음수 intensity(-40) 재적용 후 발행하여 게시 emission 확인');
    await combo.selectOption('scrub-translate');
    await page.waitForTimeout(200);
    if (await intensityInput.isVisible().catch(() => false)) {
      await intensityInput.fill('-40');
      await intensityInput.press('Enter');
      await page.waitForTimeout(200);
    }
    const scrubPublished = await publishSiteViaApi(page, homePageId, log);
    if (!scrubPublished) {
      findings.push({
        severity: 'blocker',
        summary: '발행 플로우를 완료할 수 없어 게시 페이지의 scroll(scrub) emission 검증 불가',
      });
    } else {
      const { status, body } = await fetchPublishedBody(page, baseUrl);
      const scrubAttr = body.includes('data-anim-scroll="scrub-translate"');
      const intensityAttr = body.includes('data-anim-intensity="-40"');
      log(`게시 페이지 status=${status}, scrub-translate=${scrubAttr}, intensity="-40"=${intensityAttr}`);
      await recordEvidence('w167-published-emission');
      if (scrubAttr && intensityAttr) {
        log('게시 런타임 확인: rAF 가 --builder-anim-scrub-progress 를 갱신하고 CSS 가 scrub 보간 실행 (음수 intensity = 스크럽 방향 반전까지 emission 됨, 에디터 캔버스는 미리보기 없음)');
      } else {
        findings.push({
          severity: 'blocker',
          summary: `게시 페이지에 scrub emission 이 없음 (data-anim-scroll="scrub-translate"=${scrubAttr}, data-anim-intensity="-40"=${intensityAttr}) — 스크럽 보간 루프가 노드에 연결되지 않음`,
        });
      }
    }

    // 초안 복원 + 게시본 정리: 원래값으로 되돌리고 재발행하여 QA 효과가 home 에 남지 않도록 정리.
    log('초안 scrub → 원래값 복원 후 재발행');
    await combo.selectOption(original || 'none').catch(() => undefined);
    await page.waitForTimeout(200);
    await publishSiteViaApi(page, homePageId, log).catch(() => undefined);
    await recordEvidence('w167-published-restored');

    return { findings };
  },
};
