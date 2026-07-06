import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { dismissOverlays, gotoBuilder } from '../helpers';

const SEO_PANEL_SEL = '[data-builder-seo-panel-dialog="true"]';
const SEO_TITLE_INPUT_SEL = '#builder-seo-title';

const SAVE_LABELS = ['저장', 'Save', '儲存'];
const PUBLISH_LABELS = ['발행', 'Publish', '發佈'];
const QA_SEO_TITLE = 'QA SEO 제목';

// 상단바 SEO 버튼: <span>SEO</span> 을 포함한 secondary 액션 버튼.
function seoButton(page: Page) {
  return page
    .locator('[data-builder-topbar-secondary="true"]')
    .filter({ hasText: 'SEO' })
    .first();
}

function seoSaveButton(page: Page) {
  return page
    .locator(`${SEO_PANEL_SEL} button`, { hasText: new RegExp(SAVE_LABELS.join('|')) })
    .last();
}

function publishButton(page: Page) {
  return page
    .locator('button', { hasText: new RegExp(PUBLISH_LABELS.join('|')) })
    .first();
}

// SEO 패널 헤더의 publicPathPreview(예: "/ko/" 또는 "/ko/about")에서 공개 경로 추출.
async function publicPathFromPanel(page: Page): Promise<string | null> {
  const help = page.locator(`${SEO_PANEL_SEL} .helpText, ${SEO_PANEL_SEL} span`).first();
  const text = await help.innerText().catch(() => '');
  const match = text.match(/(\/[a-z-]+(?:\/[^ ·]*)?\/?)/i);
  return match ? match[1] : null;
}

async function publicHeadContainsTitle(
  page: Page,
  baseUrl: string,
  publicPath: string,
  needle: string,
): Promise<{ found: boolean; titleText: string; status: number | null }> {
  const url = new URL(publicPath || '/ko', baseUrl).toString();
  let status: number | null = null;
  try {
    const res = await page.request.get(url, { timeout: 30_000 });
    status = res.status();
    const body = await res.text();
    const titleMatch = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const titleText = titleMatch ? titleMatch[1].trim() : '';
    const found = body.includes(needle) || titleText.includes(needle);
    return { found, titleText, status };
  } catch {
    return { found: false, titleText: '', status };
  }
}

export const W27_pageSeoPanel: CheckpointDefinition = {
  id: 'W27',
  title: '페이지 SEO 패널: SEO 제목 입력 → 저장 → 공개 페이지 head 반영(또는 발행 후 반영) 확인',
  verification:
    '상단바 SEO 버튼 → 패널 오픈 → 제목 입력 → 저장 → 공개 페이지 head 에서 제목 확인 (저장만으로 미반영 시 발행 후 재확인 및 명시)',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    // Hard rule 1: 이전 시나리오가 남긴 popover/drawer 정리.
    log('잔여 popover/drawer 정리 (Escape x2)');
    await dismissOverlays(page);

    const findings: CheckpointFinding[] = [];

    log('상단바 SEO 버튼 클릭');
    const seoBtn = seoButton(page);
    const seoBtnVisible = await seoBtn.isVisible().catch(() => false);
    if (!seoBtnVisible) {
      findings.push({
        severity: 'blocker',
        summary: '상단바 SEO 버튼(<span>SEO</span>)을 찾을 수 없거나 비활성화됨',
      });
      await recordEvidence('seo-button-missing');
      return { findings };
    }
    const enabled = await seoBtn.isEnabled().catch(() => false);
    if (!enabled) {
      findings.push({
        severity: 'blocker',
        summary: '상단바 SEO 버튼이 비활성화됨(canOpenSeo=false) — 페이지 미선택 등',
      });
      await recordEvidence('seo-button-disabled');
      return { findings };
    }
    await seoBtn.click({ force: true });
    const panelVisible = await page
      .locator(SEO_PANEL_SEL)
      .first()
      .waitFor({ state: 'visible', timeout: 10_000 })
      .then(() => true)
      .catch(() => false);
    if (!panelVisible) {
      findings.push({
        severity: 'blocker',
        summary: '페이지 SEO 패널(data-builder-seo-panel-dialog)이 열리지 않음',
      });
      await recordEvidence('seo-panel-not-open');
      return { findings };
    }
    await recordEvidence('seo-panel-open');

    log('SEO 제목 입력');
    const titleInput = page.locator(SEO_TITLE_INPUT_SEL).first();
    const titleVisible = await titleInput.waitFor({ state: 'visible', timeout: 8_000 }).then(() => true).catch(() => false);
    if (!titleVisible) {
      findings.push({
        severity: 'blocker',
        summary: 'SEO 패널 기본 탭의 제목 입력(#builder-seo-title)을 찾지 못함',
      });
      await recordEvidence('seo-title-input-missing');
      return { findings };
    }
    const originalTitle = await titleInput.inputValue().catch(() => '');
    log(`변경 전 SEO 제목: "${originalTitle}"`);
    await titleInput.click({ force: true });
    await titleInput.fill(QA_SEO_TITLE);
    await page.waitForTimeout(200);
    await recordEvidence('seo-title-entered');

    log('SEO 저장 버튼 클릭');
    const save = seoSaveButton(page);
    const saveVisible = await save.isVisible().catch(() => false);
    if (!saveVisible) {
      findings.push({
        severity: 'blocker',
        summary: 'SEO 패널의 저장 버튼(저장/Save/儲存)을 찾지 못함',
      });
      await recordEvidence('seo-save-button-missing');
      return { findings };
    }
    await save.click({ force: true });
    await page.waitForTimeout(1500);
    await recordEvidence('seo-saved');

    const publicPath = (await publicPathFromPanel(page)) ?? '/ko';
    log(`공개 페이지 경로: ${publicPath}`);

    log('저장 직후 공개 페이지 head 확인');
    const checkAfterSave = await publicHeadContainsTitle(page, baseUrl, publicPath, QA_SEO_TITLE);
    log(`저장 후 head 검색 결과: found=${checkAfterSave.found}, status=${checkAfterSave.status}, title="${checkAfterSave.titleText}"`);
    await recordEvidence('head-after-save');

    let appliedOnPublish = false;
    if (!checkAfterSave.found) {
      log('저장만으로 head 미반영 → 발행(publish) 시도 후 재확인');
      // 패널 닫기.
      await page.keyboard.press('Escape').catch(() => undefined);
      await page.waitForTimeout(300);
      const pubBtn = publishButton(page);
      const pubVisible = await pubBtn.isVisible().catch(() => false);
      if (pubVisible) {
        await pubBtn.click({ force: true }).catch(() => undefined);
        // 발행 플로우 완료 대기 (최대 20s).
        await page.waitForTimeout(6000);
        await recordEvidence('publish-attempted');
        const checkAfterPublish = await publicHeadContainsTitle(page, baseUrl, publicPath, QA_SEO_TITLE);
        log(`발행 후 head 검색 결과: found=${checkAfterPublish.found}, status=${checkAfterPublish.status}, title="${checkAfterPublish.titleText}"`);
        appliedOnPublish = checkAfterPublish.found;
        if (!appliedOnPublish) {
          findings.push({
            severity: 'blocker',
            summary: `발행 후에도 공개 페이지 head 에 SEO 제목("${QA_SEO_TITLE}")이 반영되지 않음 (path=${publicPath}, title="${checkAfterPublish.titleText}")`,
          });
        }
      } else {
        findings.push({
          severity: 'blocker',
          summary: '발행 버튼을 찾지 못해 발행 후 head 반영을 검증하지 못함',
        });
      }
    }

    if (checkAfterSave.found) {
      log('저장 직후 공개 head 에 반영됨 확인');
    } else if (appliedOnPublish) {
      findings.push({
        severity: 'visual',
        summary: 'SEO 제목은 발행(publish) 시에만 공개 페이지에 반영됨 — 저장 직후에는 head 미반영 (by design)',
      });
    }

    log('cleanup: SEO 제목을 원래값으로 복원');
    await seoBtn.click({ force: true }).catch(() => undefined);
    await page
      .locator(SEO_PANEL_SEL)
      .first()
      .waitFor({ state: 'visible', timeout: 8_000 })
      .catch(() => undefined);
    const reopened = await page.locator(SEO_PANEL_SEL).first().isVisible().catch(() => false);
    if (reopened) {
      await titleInput.click({ force: true }).catch(() => undefined);
      await titleInput.fill(originalTitle).catch(() => undefined);
      await seoSaveButton(page).click({ force: true }).catch(() => undefined);
      await page.waitForTimeout(1200);
      log('복원 저장 완료');
    } else {
      findings.push({
        severity: 'visual',
        summary: 'cleanup 실패(harness concern) — 복원을 위해 SEO 패널을 다시 열지 못함',
      });
    }
    await recordEvidence('seo-title-restored');

    return { findings };
  },
};
