import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { dismissOverlays, gotoBuilder } from '../helpers';

// SEO 패널(SeoPanel, data-builder-seo-panel-dialog) 의 "소셜 공유(Social)" 탭.
// 실제 마크업 출처:
//   - 탭 버튼 라벨 = copy.tabs.social (SeoPanel.tsx tabBar) → ko '소셜 공유' / en 'Social share' / zh '社群分享'
//   - 섹션 = <section data-active="true|false"> (SeoPanelSocialTab). 비활성시 display:none.
//   - OG 제목 입력 = #builder-seo-og-title
//   - 미리보기 영역 제목(h4) = copy.preview → ko 'OG 이미지 미리보기' / en 'OG image preview' / zh 'OG 圖片預覽'
//   - 미리보기 카드 본문 = socialPreviewTitle div (socialTitle 표시).
//     socialTitle = ogTitle.trim() || title.trim() || untitled (SeoPanel.tsx).
//   즉 미리보기 카드 자체에 data-* 속성이 없으므로, 활성 소셜 섹션 + 미리보기 제목(h4) 으로
//   카드 렌더를 확인하고, socialPreviewTitle 에 OG 제목이 파생되는지 검증한다.
const SEO_PANEL_SEL = '[data-builder-seo-panel-dialog="true"]';
// copy.tabs.social
const SOCIAL_TAB_LABELS = ['소셜 공유', 'Social share', '社群分享'];
// copy.preview (미리보기 영역 h4)
const PREVIEW_HEADING_LABELS = ['OG 이미지 미리보기', 'OG image preview', 'OG 圖片預覽'];
const QA_OG_TITLE = 'QA OG 미리보기 제목';

function seoButton(page: Page) {
  return page
    .locator('[data-builder-topbar-secondary="true"]')
    .filter({ hasText: 'SEO' })
    .first();
}

// 패널 tabBar 내 소셜 탭 버튼. 탭 버튼은 항상 렌더되므로 패널 내 button 중 라벨 매칭.
// (소셜 섹션엔 button 이 없고 헤더/풋터 버튼은 소셜 라벨을含지 않아 충돌 없음.)
function socialTabButton(page: Page) {
  return page
    .locator(`${SEO_PANEL_SEL} button`)
    .filter({ hasText: new RegExp(SOCIAL_TAB_LABELS.join('|')) })
    .first();
}

// 폼 로딩 완료 대기 — 기본 탭의 제목 입력(#builder-seo-title) 이 보이면 fetchSeo 완료.
async function waitForSeoFormLoaded(page: Page): Promise<boolean> {
  return page
    .locator('#builder-seo-title')
    .first()
    .waitFor({ state: 'visible', timeout: 12_000 })
    .then(() => true)
    .catch(() => false);
}

export const W192_ogPreview: CheckpointDefinition = {
  id: 'W192',
  title: 'OG/Twitter 미리보기 카드: SEO 패널 소셜 탭 → 미리보기 카드 렌더 + OG 제목 반영',
  verification:
    '상단바 SEO → 패널 → 소셜 공유 탭 → OG 미리보기 카드(미리보기 영역 h4) 렌더 확인 → OG 제목 입력 → 미리보기(socialPreviewTitle)에 즉시 반영 확인 → 저장 없이 닫기',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    log('잔여 popover/drawer 정리 (Escape x2)');
    await dismissOverlays(page);

    const findings: CheckpointFinding[] = [];

    log('상단바 SEO 버튼 클릭');
    const seoBtn = seoButton(page);
    if (!(await seoBtn.isVisible().catch(() => false)) || !(await seoBtn.isEnabled().catch(() => false))) {
      findings.push({ severity: 'blocker', summary: '상단바 SEO 버튼을 찾을 수 없거나 비활성화됨' });
      await recordEvidence('seo-button-missing');
      return { findings };
    }
    await seoBtn.click({ force: true });
    const panelOpen = await page
      .locator(SEO_PANEL_SEL)
      .first()
      .waitFor({ state: 'visible', timeout: 10_000 })
      .then(() => true)
      .catch(() => false);
    if (!panelOpen) {
      findings.push({ severity: 'blocker', summary: 'SEO 패널이 열리지 않음' });
      await recordEvidence('seo-panel-not-open');
      return { findings };
    }
    await recordEvidence('seo-panel-open');

    log('SEO 폼 로딩 완료 대기 (#builder-seo-title visible)');
    const loaded = await waitForSeoFormLoaded(page);
    if (!loaded) {
      findings.push({ severity: 'blocker', summary: 'SEO 폼 로딩이 완료되지 않음 (#builder-seo-title 미노출)' });
      await recordEvidence('seo-form-not-loaded');
      await page.keyboard.press('Escape').catch(() => undefined);
      return { findings };
    }

    log('소셜 공유(Social) 탭 클릭');
    const socialTab = socialTabButton(page);
    const socialVisible = await socialTab.waitFor({ state: 'visible', timeout: 8_000 }).then(() => true).catch(() => false);
    if (!socialVisible) {
      findings.push({
        severity: 'blocker',
        summary: 'SEO 패널의 소셜 공유 탭(소셜 공유/Social share/社群分享)을 찾지 못함',
      });
      await recordEvidence('social-tab-missing');
      await page.keyboard.press('Escape').catch(() => undefined);
      return { findings };
    }
    await socialTab.click({ force: true });
    await page.waitForTimeout(300);

    log('OG 입력(#builder-seo-og-title) 확인 — 소셜 섹션 활성화 확인');
    const ogTitleInput = page.locator('#builder-seo-og-title').first();
    const ogVisible = await ogTitleInput.waitFor({ state: 'visible', timeout: 8_000 }).then(() => true).catch(() => false);
    if (!ogVisible) {
      findings.push({ severity: 'blocker', summary: 'OG 제목 입력(#builder-seo-og-title)을 찾지 못함 — 소셜 탭 활성화 미반영 가능' });
      await recordEvidence('og-input-missing');
      await page.keyboard.press('Escape').catch(() => undefined);
      return { findings };
    }

    log('미리보기 카드(미리보기 영역 h4) 렌더 확인');
    const previewHeading = page
      .locator(SEO_PANEL_SEL)
      .getByText(new RegExp(PREVIEW_HEADING_LABELS.join('|')))
      .first();
    const previewVisible = await previewHeading.isVisible().catch(() => false);
    if (!previewVisible) {
      findings.push({
        severity: 'blocker',
        summary: '소셜 탭에 OG 미리보기 영역(OG 이미지 미리보기/OG image preview/OG 圖片預覽 h4)이 렌더되지 않음',
      });
      await recordEvidence('og-preview-missing');
      await page.keyboard.press('Escape').catch(() => undefined);
      return { findings };
    }
    await recordEvidence('og-preview-renders');

    log('OG 제목 입력 → 미리보기 즉시 반영 확인');
    await ogTitleInput.click({ force: true });
    await ogTitleInput.fill(QA_OG_TITLE);
    await page.waitForTimeout(300);
    // socialPreviewTitle div 가 socialTitle(=ogTitle) 을 표시. 입력값(value) 은 text content 가
    // 아니므로 getByText 는 입력 자체가 아닌 미리보기 카드의 텍스트와 매칭된다.
    const reflected = await page
      .locator(SEO_PANEL_SEL)
      .getByText(QA_OG_TITLE)
      .first()
      .isVisible()
      .catch(() => false);
    log(`미리보기에 OG 제목 반영: ${reflected}`);
    await recordEvidence('og-preview-reflects-input');
    if (!reflected) {
      findings.push({
        severity: 'visual',
        summary: 'OG 제목 입력 후 미리보기 카드(socialPreviewTitle)에 제목이 즉시 반영되지 않음 (socialTitle 파생 누락 가능)',
      });
    }

    log('저장 없이 패널 닫기 (Escape)');
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.waitForTimeout(400);
    await recordEvidence('og-panel-closed-no-save');

    return { findings };
  },
};
