import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { dismissOverlays, gotoBuilder } from '../helpers';

// W36 — 공개 페이지 반응형: 브라우저 창 리사이즈 → 실제 viewport CSS media query 로 레이아웃 변환.
//
// responsive-stylesheet.ts 가 게시 페이지에 내보내는 media query (이 파일에서만 정의):
//   tablet → @media (min-width: 768px) and (max-width: 1023px)   (TABLET_MAX = 768 + 255 = 1023)
//   mobile → @media (max-width: 767px)                            (MOBILE_MAX = 768 - 1 = 767)
// responsivize.ts 가 모든 home 노드에 responsive.tablet/.mobile rect override 를 부여하므로,
// 게시 홈의 responsive stylesheet 에는 두 media query 모두 `[data-node-id="home-hero"]` rule 이 있다.
const TABLET_MEDIA_QUERY = '@media (min-width: 768px) and (max-width: 1023px)';
const MOBILE_MEDIA_QUERY = '@media (max-width: 767px)';
const SIGNATURE_NODE_ID = 'home-hero';

function publicHomeUrl(baseUrl: string): string {
  return new URL('/ko', baseUrl).toString();
}

// --- 발행(publish) 헬퍼 (패턴 출처: W161-parallax.ts / W168-hover-fx.ts) ---
// UI 발행 모달은 preflight 단계에서 hang 하므로 publish API 로 초안을 직접 발행한다.

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

// 게시 페이지의 responsive stylesheet 텍스트.
async function responsiveStyleText(page: Page): Promise<string> {
  return page
    .locator('style[data-builder-responsive="true"]')
    .first()
    .textContent()
    .then((value) => value ?? '');
}

// 시그니처 노드의 렌더링 폭(boundingBox). 없거나 보이지 않으면 null.
async function signatureWidth(page: Page): Promise<number | null> {
  const node = page.locator(`[data-node-id="${SIGNATURE_NODE_ID}"]`).first();
  const present = await node.waitFor({ state: 'attached', timeout: 20_000 }).then(() => true).catch(() => false);
  if (!present) return null;
  const box = await node.boundingBox().catch(() => null);
  return box?.width ?? null;
}

export const W36_publicResponsive: CheckpointDefinition = {
  id: 'W36',
  title: '공개 페이지가 실제 viewport 기반 CSS media query 로 반응',
  verification:
    '공개 페이지 브라우저 창 리사이즈 → responsive CSS media query 적용 → hero/layout 폭이 1280 → 768 → 375 viewport 로 변환됨',
  async run({ page, baseUrl, recordEvidence, log }) {
    const findings: CheckpointFinding[] = [];

    // 1) 에디터 진입 후 현재 home 초안을 발행(publish API) — 게시 페이지가 최신 초안을 반영하도록.
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);
    log('잔여 overlay 정리 (Escape x2)');
    await dismissOverlays(page);

    const homePageId = await resolveHomePageId(page);
    log(`home pageId 해결: "${homePageId}"`);
    if (!homePageId) {
      findings.push({
        severity: 'blocker',
        summary: 'home pageId 를 해결하지 못해 발행/검증 불가',
      });
      await recordEvidence('w36-home-pageid-missing');
      return { findings };
    }

    const published = await publishSiteViaApi(page, homePageId, log);
    if (!published) {
      findings.push({
        severity: 'blocker',
        summary: 'home 발행(publish API) 실패 — 게시 페이지 responsive 검증 불가',
      });
      await recordEvidence('w36-publish-failed');
      return { findings };
    }

    // 2) 게시 홈을 별도 페이지(동일 context 의 newPage)로 1280 폭에서 로드.
    //    에디터 페이지의 builder 상태/스토리지가 게시 페이지 측정에 간섭하지 않도록 분리.
    const publicPage = await page.context().newPage();
    try {
      log('게시 홈 데스크톱(1280) viewport 로드');
      await publicPage.setViewportSize({ width: 1280, height: 900 });
      await publicPage.goto(publicHomeUrl(baseUrl), { waitUntil: 'networkidle', timeout: 60_000 });
      await publicPage
        .locator('[data-node-id]')
        .first()
        .waitFor({ state: 'attached', timeout: 20_000 });

      // 3) responsive stylesheet 가 게시 페이지에 실제 media query 를 내보내는지 확인.
      //    (responsive-stylesheet.ts 의 TABLET/MOBILE media query 문자열 + home-hero rule)
      const css = await responsiveStyleText(publicPage);
      log(
        `responsive stylesheet 길이=${css.length}, tablet query=${css.includes(TABLET_MEDIA_QUERY)}, ` +
          `mobile query=${css.includes(MOBILE_MEDIA_QUERY)}, home-hero rule=${css.includes(`[data-node-id="${SIGNATURE_NODE_ID}"]`)}`,
      );
      if (!css) {
        findings.push({
          severity: 'blocker',
          summary: '게시 홈에 responsive stylesheet(style[data-builder-responsive="true"])가 주입되지 않음',
        });
      } else {
        if (!css.includes(MOBILE_MEDIA_QUERY)) {
          findings.push({
            severity: 'blocker',
            summary: `게시 responsive stylesheet 에 mobile media query("${MOBILE_MEDIA_QUERY}")가 없음`,
            detail: css.slice(0, 400),
          });
        }
        if (!css.includes(TABLET_MEDIA_QUERY)) {
          findings.push({
            severity: 'blocker',
            summary: `게시 responsive stylesheet 에 tablet media query("${TABLET_MEDIA_QUERY}")가 없음`,
            detail: css.slice(0, 400),
          });
        }
        if (!css.includes(`[data-node-id="${SIGNATURE_NODE_ID}"]`)) {
          findings.push({
            severity: 'blocker',
            summary: `responsive stylesheet 에 ${SIGNATURE_NODE_ID} 노드 규칙이 없음 — responsivize 미적용 의심`,
            detail: css.slice(0, 400),
          });
        }
      }

      const desktopWidth = await signatureWidth(publicPage);
      log(`데스크톱 ${SIGNATURE_NODE_ID} 폭=${desktopWidth ?? 'null'}`);
      if (!desktopWidth || desktopWidth < 1000) {
        findings.push({
          severity: 'blocker',
          summary: `데스크톱 ${SIGNATURE_NODE_ID} 폭 측정 실패/비정상(width=${desktopWidth ?? 'null'})`,
        });
      }
      await recordEvidence('w36-public-desktop-1280', publicPage);

      // 4) tablet(768) viewport 로 resize 후 시그니처 측정.
      log('게시 홈 tablet(768) viewport 로 resize');
      await publicPage.setViewportSize({ width: 768, height: 900 });
      await publicPage.waitForTimeout(500);
      const tabletWidth = await signatureWidth(publicPage);
      log(`tablet ${SIGNATURE_NODE_ID} 폭=${tabletWidth ?? 'null'}`);
      if (!tabletWidth || tabletWidth > 820) {
        findings.push({
          severity: 'visual',
          summary: `tablet viewport 에서 ${SIGNATURE_NODE_ID} 폭이 768 대역으로 줄지 않음(width=${tabletWidth ?? 'null'})`,
        });
      }
      await recordEvidence('w36-public-tablet-768', publicPage);

      // 5) mobile(375) viewport 로 resize 후 시그니처 측정 — media query 가 레이아웃을 변환했는지.
      log('게시 홈 mobile(375) viewport 로 resize');
      await publicPage.setViewportSize({ width: 375, height: 900 });
      await publicPage.waitForTimeout(500);
      const mobileWidth = await signatureWidth(publicPage);
      log(`mobile ${SIGNATURE_NODE_ID} 폭=${mobileWidth ?? 'null'}`);
      if (!mobileWidth || mobileWidth > 400) {
        findings.push({
          severity: 'blocker',
          summary: `mobile viewport 에서 ${SIGNATURE_NODE_ID} 폭이 375 대역으로 줄지 않음(width=${mobileWidth ?? 'null'})`,
        });
      }
      await recordEvidence('w36-public-mobile-375', publicPage);

      // 6) 시그니처가 viewport 축소에 따라 실제로 변환했는지(반응형 레이아웃 전환) 확인.
      if (desktopWidth && mobileWidth && desktopWidth - mobileWidth < 500) {
        findings.push({
          severity: 'blocker',
          summary: `리사이즈 후 ${SIGNATURE_NODE_ID} 폭 변화가 부족해 반응형 전환 미확인(desktop=${desktopWidth}, mobile=${mobileWidth})`,
        });
      }
      if (desktopWidth && tabletWidth && mobileWidth) {
        log(
          `반응형 시그니처 변환: desktop=${desktopWidth} → tablet=${tabletWidth} → mobile=${mobileWidth}`,
        );
      }
    } finally {
      await publicPage.close().catch(() => undefined);
    }

    return { findings };
  },
};
