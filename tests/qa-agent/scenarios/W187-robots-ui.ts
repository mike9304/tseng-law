import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';

const SEO_DASHBOARD_PATH = '/ko/admin-builder/seo';
const TOOLS_TAB_LABELS = ['도구', 'Tools', '工具'];
const ROBOTS_TEXTAREA_SEL = 'textarea[aria-label*="robots.txt" i]';
const SAVE_ROBOTS_LABELS = ['Robots 저장', 'Save robots', '儲存 Robots'];
const MARKER_PATH_PREFIX = '/tseng-qa-robots-marker';

function toolsTabButton(page: Page) {
  return page
    .locator('nav')
    .locator('button', { hasText: new RegExp(TOOLS_TAB_LABELS.join('|')) })
    .first();
}

function robotsTextarea(page: Page) {
  return page.locator(ROBOTS_TEXTAREA_SEL).first();
}

function saveRobotsButton(page: Page) {
  return page
    .locator('main')
    .locator('button', { hasText: new RegExp(SAVE_ROBOTS_LABELS.join('|')) })
    .first();
}

async function fetchRobotsTxt(page: Page, baseUrl: string): Promise<{ status: number; body: string }> {
  const url = new URL('/robots.txt', baseUrl).toString();
  try {
    const res = await page.request.get(url, { timeout: 30_000 });
    const body = await res.text();
    return { status: res.status(), body };
  } catch {
    return { status: 0, body: '' };
  }
}

async function openToolsTab(page: Page, baseUrl: string): Promise<boolean> {
  await page.goto(new URL(SEO_DASHBOARD_PATH, baseUrl).toString(), {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });
  const toolsBtn = toolsTabButton(page);
  const toolsVisible = await toolsBtn.isVisible().catch(() => false);
  if (!toolsVisible) return false;
  await toolsBtn.click({ force: true });
  await page.waitForTimeout(500);
  return true;
}

export const W187_robotsUi: CheckpointDefinition = {
  id: 'W187',
  title: 'robots.txt 편집 UI: robots 규칙 저장 → GET /robots.txt 반영 → 원래값 복원',
  verification:
    'SEO 대시보드 도구 탭 → robots textarea 에 Disallow 규칙 추가 후 저장 → GET /robots.txt 에 규칙 반영 확인 → 원래값으로 복원',
  async run({ page, baseUrl, recordEvidence, log }) {
    const findings: CheckpointFinding[] = [];

    log('도구(Tools) 탭 클릭');
    const toolsReady = await openToolsTab(page, baseUrl);
    if (!toolsReady) {
      findings.push({
        severity: 'blocker',
        summary: 'SEO 대시보드 도구 탭 버튼(도구/Tools/工具)을 찾을 수 없음',
      });
      await recordEvidence('robots-tools-tab-missing');
      return { findings };
    }

    log('robots textarea 확인');
    const textarea = robotsTextarea(page);
    const taVisible = await textarea
      .waitFor({ state: 'visible', timeout: 8_000 })
      .then(() => true)
      .catch(() => false);
    if (!taVisible) {
      findings.push({
        severity: 'blocker',
        summary: 'robots textarea(aria-label*="robots.txt")를 찾지 못함 — 도구 탭 미구현 가능',
      });
      await recordEvidence('robots-textarea-missing');
      return { findings };
    }
    const original = await textarea.inputValue().catch(() => '');
    log(`변경 전 robots 값 길이: ${original.length}`);

    const markerPath = `${MARKER_PATH_PREFIX}-${Date.now()}`;
    const markerDirective = `Disallow: ${markerPath}`;

    log('robots 에 QA Disallow 규칙 추가 후 저장');
    await textarea.click({ force: true });
    const separator = original.trimEnd().length > 0 ? '\n' : '';
    const next = `${original.trimEnd()}${separator}${markerDirective}\n`;
    await textarea.fill(next);
    await page.waitForTimeout(200);

    const saveBtn = saveRobotsButton(page);
    const saveVisible = await saveBtn.isVisible().catch(() => false);
    if (!saveVisible) {
      findings.push({
        severity: 'blocker',
        summary: 'robots 저장 버튼(Robots 저장/Save robots/儲存 Robots)을 찾지 못함',
      });
      await recordEvidence('robots-save-button-missing');
      await textarea.fill(original).catch(() => undefined);
      return { findings };
    }
    await saveBtn.click({ force: true });
    await page.waitForTimeout(1500);
    await recordEvidence('robots-saved');

    log('GET /robots.txt Disallow 규칙 반영 여부');
    const robots = await fetchRobotsTxt(page, baseUrl);
    const reflected = robots.body.includes(markerPath);
    log(`status=${robots.status}, markerPath포함=${reflected}`);
    if (robots.status === 200) {
      await page.goto(new URL('/robots.txt', baseUrl).toString(), {
        waitUntil: 'domcontentloaded',
        timeout: 30_000,
      });
    }
    await recordEvidence('robots-txt-after-save');

    if (robots.status !== 200) {
      findings.push({
        severity: 'blocker',
        summary: `GET /robots.txt 가 200 이 아님 (status=${robots.status})`,
      });
    } else if (!reflected) {
      findings.push({
        severity: 'blocker',
        summary:
          `robots 저장은 완료됐으나 /robots.txt 에 Disallow 규칙이 반영되지 않음 (${markerPath})`,
      });
    }

    log('cleanup: robots 원래값으로 복원');
    await openToolsTab(page, baseUrl).catch(() => false);
    const cleanupTextarea = robotsTextarea(page);
    await cleanupTextarea.click({ force: true }).catch(() => undefined);
    await cleanupTextarea.fill(original).catch(() => undefined);
    await saveRobotsButton(page).click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(1200);
    await recordEvidence('robots-restored');

    return { findings };
  },
};
