import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { canvasEditor, clickCenter, dismissOverlays, gotoBuilder } from '../helpers';

// W17 — 모바일 전용 오버라이드: 인스펙터 "표시 기기" M 토글(hide on mobile) → 초안 반영 →
// 게시 페이지의 responsive stylesheet 가 display:none 규칙을 내보내고, mobile(375) viewport 에서
// 실제로 숨겨지는지 검증. 검증 후 원복(unhide) + 재발행으로 정리.
//
// 인스펙터 D/T/M 토글(ShowOnDeviceToggles) — sandbox-inspector-layout-tab-copy.ts(ko):
//   visible → aria-label "모바일에서 보임 (클릭하여 토글)", data-visible="true"
//   hidden  → aria-label "모바일에서 숨김 (클릭하여 토글)", data-visible="false"
// M 클릭 시 updateResponsiveOverride(id,'mobile',{hidden:true}) → responsive-stylesheet.ts 가
// mobile media query 내에 `[data-node-id="X"] { display: none !important; }` 를 내보낸다.

const MOBILE_TOGGLE_NAME = /모바일에서 (보임|숨김) \(클릭하여 토글\)|Mobile is (visible|hidden) \(click to toggle\)/i;

function publicHomeUrl(baseUrl: string): string {
  return new URL('/ko', baseUrl).toString();
}

function inspector(page: Page) {
  return page.locator('[data-builder-inspector-panel="true"]');
}

function layoutTabButton(page: Page) {
  return inspector(page).getByRole('button', { name: /^(layout|레이아웃)$/i }).first();
}

function mobileDeviceToggle(page: Page) {
  return inspector(page).getByRole('button', { name: MOBILE_TOGGLE_NAME }).first();
}

// --- 발행(publish) 헬퍼 (패턴 출처: W161-parallax.ts / W168-hover-fx.ts) ---

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

interface DraftNode {
  id: string;
  parentId?: string;
  kind: string;
  visible?: boolean;
  locked?: boolean;
  rect: { x: number; y: number; width: number; height: number };
  responsive?: {
    tablet?: { hidden?: boolean };
    mobile?: { hidden?: boolean; rect?: { width?: number } };
  };
}

async function fetchDraftNodes(page: Page, pageId: string): Promise<DraftNode[]> {
  const res = await page.request.get(
    `/api/builder/site/pages/${encodeURIComponent(pageId)}/draft?locale=ko`,
  );
  if (!res.ok) return [];
  const payload = (await res.json()) as { document?: { nodes?: DraftNode[] } };
  return payload.document?.nodes ?? [];
}

// 숨김 대상 leaf 선정: 보이고, 잠금 해제, 자식 없는 leaf, 충분한 크기(클릭 가능),
// 이미 mobile-hidden 이 아닌 노드. title/subtitle/copy/cta 계열을 우선.
function pickHideCandidate(nodes: DraftNode[]): DraftNode | null {
  const parentIds = new Set(nodes.map((n) => n.parentId).filter((p): p is string => Boolean(p)));
  const leaves = nodes.filter(
    (n) =>
      n.visible !== false &&
      !n.locked &&
      !parentIds.has(n.id) &&
      n.rect &&
      n.rect.width >= 80 &&
      n.rect.height >= 18 &&
      n.responsive?.mobile?.hidden !== true,
  );
  const preferred = leaves.find((n) =>
    /title|subtitle|copy|label|heading|cta|button|btn|text/i.test(n.id),
  );
  return preferred ?? leaves[0] ?? null;
}

async function selectNodeById(page: Page, id: string, log: (step: string) => void): Promise<boolean> {
  const canvas = canvasEditor(page);
  const node = canvas.locator(`[data-node-id="${id}"]:visible`).first();
  const visible = await node
    .waitFor({ state: 'visible', timeout: 10_000 })
    .then(() => true)
    .catch(() => false);
  if (!visible) {
    log(`노드 "${id}" 가 캔버스에서 보이지 않음`);
    return false;
  }
  for (let i = 0; i < 3; i += 1) {
    await clickCenter(node);
    const selected = canvas
      .locator(`[data-node-id="${id}"][class*="nodeSelected"]:visible`)
      .first();
    const ok = await selected
      .waitFor({ state: 'visible', timeout: 3_000 })
      .then(() => true)
      .catch(() => false);
    if (ok) return true;
    await page.waitForTimeout(350);
  }
  log(`노드 "${id}" 선택 3회 실패`);
  return false;
}

// 게시 HTML 에서 responsive stylesheet 내용 추출.
function extractResponsiveCss(html: string): string {
  const match = html.match(/<style[^>]*data-builder-responsive="true"[^>]*>([\s\S]*?)<\/style>/i);
  return match ? match[1] : '';
}

export const W17_mobileOverride: CheckpointDefinition = {
  id: 'W17',
  title: '모바일 전용 오버라이드(hide on mobile, per-device 위치/크기) → 공개 페이지 반영',
  verification:
    'leaf 노드 선택 → 인스펙터 레이아웃 탭 → 표시 기기 M 토글 끔(hide on mobile) → 초안 responsive.mobile.hidden 반영 + 게시 페이지 display:none 규칙 emission + mobile(375) viewport 에서 숨김 → 원복',
  async run({ page, baseUrl, recordEvidence, log }) {
    const findings: CheckpointFinding[] = [];

    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);
    log('잔여 overlay 정리 (Escape x2)');
    await dismissOverlays(page);

    const homePageId = await resolveHomePageId(page);
    log(`home pageId 해결: "${homePageId}"`);
    if (!homePageId) {
      findings.push({ severity: 'blocker', summary: 'home pageId 를 해결하지 못해 검증 불가' });
      await recordEvidence('w17-home-pageid-missing');
      return { findings };
    }

    // 숨김 대상 leaf 선정.
    const draftNodes = await fetchDraftNodes(page, homePageId);
    const candidate = pickHideCandidate(draftNodes);
    if (!candidate) {
      findings.push({
        severity: 'blocker',
        summary: 'hide-on-mobile 검증용 편집 가능 leaf 노드를 찾지 못함 (draft nodes 미충족)',
      });
      await recordEvidence('w17-no-leaf-candidate');
      return { findings };
    }
    const targetId = candidate.id;
    log(`hide-on-mobile 대상 leaf: "${targetId}" (kind=${candidate.kind})`);

    // 노드 선택.
    const selected = await selectNodeById(page, targetId, log);
    if (!selected) {
      findings.push({
        severity: 'blocker',
        summary: `대상 leaf "${targetId}" 를 캔버스에서 선택하지 못함`,
      });
      await recordEvidence('w17-select-failed');
      return { findings };
    }

    // 레이아웃 탭 진입.
    const tabBtn = layoutTabButton(page);
    if (!(await tabBtn.isVisible().catch(() => false))) {
      findings.push({ severity: 'blocker', summary: '인스펙터에 레이아웃(Layout) 탭 버튼이 보이지 않음' });
      await recordEvidence('w17-layout-tab-missing');
      return { findings };
    }
    await tabBtn.click({ force: true });
    await page.waitForTimeout(350);

    // 표시 기기 M 토글 탐지.
    const mobileToggle = mobileDeviceToggle(page);
    if ((await mobileToggle.count().catch(() => 0)) === 0) {
      findings.push({
        severity: 'blocker',
        summary: '레이아웃 탭에 표시 기기(D/T/M) M 토글이 없음 — ShowOnDeviceToggles 미렌더링',
      });
      await recordEvidence('w17-mobile-toggle-missing');
      return { findings };
    }
    const visibleBefore = await mobileToggle.getAttribute('data-visible').catch(() => null);
    log(`M 토글 변경 전 data-visible="${visibleBefore}"`);
    if (visibleBefore !== 'true') {
      findings.push({
        severity: 'blocker',
        summary: `대상 노드가 이미 mobile-hidden 상태거나 M 토글 상태 읽기 실패(data-visible="${visibleBefore}")`,
      });
      // 원본 상태이므로 복구 불필요.
      return { findings };
    }

    // --- hide on mobile 적용 ---
    let hidApplied = false;
    let published = false;
    const publicPage = await page.context().newPage();
    try {
      await mobileToggle.click({ force: true });
      await page.waitForTimeout(300);

      const visibleAfter = await mobileToggle.getAttribute('data-visible').catch(() => null);
      log(`M 토글 변경 후 data-visible="${visibleAfter}"`);
      if (visibleAfter !== 'false') {
        findings.push({
          severity: 'blocker',
          summary: `M 토글 끔 후 data-visible 이 "false" 가 아님(data-visible="${visibleAfter}")`,
        });
      } else {
        hidApplied = true;
      }

      const overrideNote = page.locator('[data-builder-viewport-hidden-override="true"]').first();
      const noteVisible = await overrideNote.isVisible().catch(() => false);
      log(`mobile 숨김 오버라이드 노트 표시=${noteVisible}`);
      if (hidApplied && !noteVisible) {
        findings.push({
          severity: 'visual',
          summary: 'mobile hidden 오버라이드 안내(data-builder-viewport-hidden-override)가 표시되지 않음',
        });
      }
      await recordEvidence('w17-mobile-hide-applied');

      // 초안에 responsive.mobile.hidden 반영 확인(autosave flush 후).
      const flushed = await waitForDraftSaved(page);
      log(`autosave flush=${flushed}`);
      const updatedNodes = await fetchDraftNodes(page, homePageId);
      const updated = updatedNodes.find((n) => n.id === targetId);
      const draftHidden = updated?.responsive?.mobile?.hidden === true;
      log(`초안 responsive.mobile.hidden=${draftHidden}`);
      if (hidApplied && !draftHidden) {
        findings.push({
          severity: 'blocker',
          summary: `초안에 ${targetId} 의 responsive.mobile.hidden 이 반영되지 않음`,
        });
      }

      // 발행.
      published = await publishSiteViaApi(page, homePageId, log);
      if (!published) {
        findings.push({
          severity: 'blocker',
          summary: '발행(publish API) 실패 — 게시 페이지 display:none emission 검증 불가',
        });
      } else {
        // 게시 HTML 의 responsive stylesheet 가 display:none 규칙을 내보내는지 확인.
        const res = await page.request.get(publicHomeUrl(baseUrl), { timeout: 30_000 });
        const html = res.ok() ? await res.text() : '';
        const css = extractResponsiveCss(html);
        const ruleForNode = css.includes(`[data-node-id="${targetId}"]`);
        const hasDisplayNone = /display:\s*none/.test(css);
        log(`게시 responsive CSS: 노드 규칙=${ruleForNode}, display:none 존재=${hasDisplayNone}`);
        await recordEvidence('w17-published-css-emission');
        if (!ruleForNode) {
          findings.push({
            severity: 'blocker',
            summary: `게시 responsive stylesheet 에 ${targetId} 노드 규칙이 없음 — mobile-hidden emission 누락`,
            detail: css.slice(0, 400),
          });
        }
        if (!hasDisplayNone) {
          findings.push({
            severity: 'blocker',
            summary: '게시 responsive stylesheet 에 display:none 선언이 없음',
          });
        }

        // 게시 페이지를 실제 렌더링하여 mobile(375) 에서 숨겨지는지, desktop(1280) 에서는 보이는지 확인.
        await publicPage.setViewportSize({ width: 1280, height: 900 });
        await publicPage.goto(publicHomeUrl(baseUrl), { waitUntil: 'networkidle', timeout: 60_000 });
        await publicPage.locator('[data-node-id]').first().waitFor({ state: 'attached', timeout: 20_000 });
        const desktopVisible = await publicPage
          .locator(`[data-node-id="${targetId}"]`)
          .first()
          .isVisible()
          .catch(() => false);
        log(`게시 desktop(1280) 노드 보임=${desktopVisible}`);
        await recordEvidence('w17-public-desktop-visible', publicPage);

        await publicPage.setViewportSize({ width: 375, height: 900 });
        await publicPage.waitForTimeout(500);
        const mobileVisible = await publicPage
          .locator(`[data-node-id="${targetId}"]`)
          .first()
          .isVisible()
          .catch(() => false);
        log(`게시 mobile(375) 노드 보임=${mobileVisible}`);
        await recordEvidence('w17-public-mobile-hidden', publicPage);

        if (desktopVisible !== true) {
          findings.push({
            severity: 'visual',
            summary: `desktop(1280) 에서 대상 노드가 보이지 않음 — mobile-only hidden 이 아님 (desktopVisible=${desktopVisible})`,
          });
        }
        if (mobileVisible !== false) {
          findings.push({
            severity: 'blocker',
            summary: `mobile(375) viewport 에서 대상 노드가 숨겨지지 않음 (mobileVisible=${mobileVisible}) — display:none 미적용`,
          });
        }
      }

      // --- 원복(unhide) + 재발행 --- (정리: QA 효과가 home 게시본에 남지 않도록)
      log('원복: M 토글 재클릭으로 unhide');
      await mobileToggle.click({ force: true }).catch(() => undefined);
      await page.waitForTimeout(300);
      const restoredVisible = await mobileToggle.getAttribute('data-visible').catch(() => null);
      log(`원복 후 data-visible="${restoredVisible}"`);
      if (restoredVisible !== 'true') {
        findings.push({
          severity: 'minor',
          summary: `원복 후 M 토글 data-visible 이 "true" 가 아님("${restoredVisible}") — 수동 확인 필요`,
        });
      }
      const republished = await publishSiteViaApi(page, homePageId, log).catch(() => false);
      log(`원복 재발행=${republished}`);
      await recordEvidence('w17-restored-republished');

      const restoredNodes = await fetchDraftNodes(page, homePageId);
      const restored = restoredNodes.find((n) => n.id === targetId);
      const stillHidden = restored?.responsive?.mobile?.hidden === true;
      if (stillHidden) {
        findings.push({
          severity: 'visual',
          summary: `원복 후에도 초안에 ${targetId} mobile.hidden 이 남아있음 — 게시본 정리 의심`,
        });
      }
    } finally {
      await publicPage.close().catch(() => undefined);
      // 발행 전 실패로 게시본이 hidden 상태로 남았을 수 있으므로, 최후의 보루로 한 번 더 원복 발행 시도.
      if (hidApplied && !published) {
        log('예외 경로: 게시 미완료 상태 — 원본 상태 복구 발행 시도');
        await publishSiteViaApi(page, homePageId, log).catch(() => undefined);
      }
    }

    return { findings };
  },
};
