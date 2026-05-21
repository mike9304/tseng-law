#!/usr/bin/env node
import { chromium } from 'playwright';

const BASE_URL = 'http://127.0.0.1:3000';
const USER = 'admin';
const PASS = 'local-review-2026!';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  httpCredentials: { username: USER, password: PASS },
});
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto(new URL('/ko/admin-builder', BASE_URL).toString(), { waitUntil: 'domcontentloaded' });
await page.waitForLoadState('networkidle').catch(() => undefined);
await page.waitForTimeout(2000);

const publishBtn = page.locator('button:has-text("발행")').first();
await publishBtn.waitFor({ state: 'visible', timeout: 15_000 });

const state = await publishBtn.evaluate((el) => ({
  disabled: el.hasAttribute('disabled'),
  ariaDisabled: el.getAttribute('aria-disabled'),
  title: el.getAttribute('title'),
  text: el.textContent?.trim(),
  className: el.className,
}));
console.log('=== 발행 버튼 상태 ===');
console.log(JSON.stringify(state, null, 2));

// 클릭해서 모달 열어보기
console.log('\n=== 발행 버튼 클릭 → 모달 ===');
await publishBtn.click({ force: true });
await page.waitForTimeout(1500);

const modal = page.locator('[role="dialog"], [data-builder-publish-modal]').first();
const modalOpen = await modal.isVisible().catch(() => false);
console.log(`modal visible: ${modalOpen}`);

if (modalOpen) {
  // 모달 안 "발행" CTA 버튼
  const cta = modal.locator('button:has-text("발행"), button:has-text("Publish")').last();
  const ctaState = await cta.evaluate((el) => ({
    disabled: el.hasAttribute('disabled'),
    text: el.textContent?.trim(),
  })).catch(() => ({ error: 'cta not found' }));
  console.log('modal CTA state:', JSON.stringify(ctaState));

  // preflight 카운트
  const blockers = await modal.locator('[data-tone="blocker"], [class*="blocker"]').count();
  const warnings = await modal.locator('[data-tone="warning"], [class*="warning"]').count();
  console.log(`modal blockers visible: ${blockers}, warnings: ${warnings}`);

  // 텍스트 dump (preflight checklist)
  const txt = await modal.textContent();
  const linkLine = txt?.match(/Links[\s\S]{0,80}/)?.[0];
  console.log(`links section: ${linkLine}`);
}

await page.screenshot({ path: '/tmp/publish-verify.png', fullPage: false });
console.log('screenshot: /tmp/publish-verify.png');

if (errors.length) {
  console.log('\nconsole errors:', errors.slice(0, 3));
}

await browser.close();
