#!/usr/bin/env node
/**
 * visual-capture.mjs — reusable multi-page / multi-viewport screenshot harness.
 *
 * Purpose: ground-truth VISUAL fidelity of the builder + published output, the
 * project's repeatedly self-identified #1 gap ("true screenshot/pixel design matching").
 * Used to verify design work in the WIX-PERFECT push (see WIX-PERFECT-PLAN-2026-05-29.md).
 *
 * Usage:
 *   BASE_URL=http://localhost:3001 node scripts/visual-capture.mjs [outDir]
 *   VIEWPORTS=desktop,mobile node scripts/visual-capture.mjs
 *
 * Auth: uses BUILDER_SMOKE_USERNAME/PASSWORD (defaults admin / local-review-2026!).
 * Output: PNG per (target × viewport) under outDir (default: qa-reports/visual-<ts>).
 */
import { chromium } from '@playwright/test';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://localhost:3001';
const USER = process.env.BUILDER_SMOKE_USERNAME ?? 'admin';
const PASS = process.env.BUILDER_SMOKE_PASSWORD ?? 'local-review-2026!';
const OUT = process.argv[2] ?? path.resolve('qa-reports', `visual-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}`);

const VIEWPORT_DEFS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 834, height: 1112 },
  mobile: { width: 390, height: 844 },
};
const VIEWPORTS = (process.env.VIEWPORTS ?? 'desktop,mobile').split(',').map((v) => v.trim()).filter((v) => VIEWPORT_DEFS[v]);

// [name, path, needsAuth, fullPage]
const TARGETS = [
  ['public-home-ko', '/ko', false, true],
  ['public-home-en', '/en', false, true],
  ['admin-builder', '/ko/admin-builder', true, false],
  ['editor-home', '/ko/builder/home', true, false],
  ['admin-cms', '/ko/admin-builder/cms', true, false],
  ['admin-commerce', '/ko/admin-builder/commerce', true, false],
  ['admin-bookings', '/ko/admin-builder/bookings', true, false],
  ['admin-ai', '/ko/admin-builder/ai-generator', true, false],
];

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const results = [];
  for (const vp of VIEWPORTS) {
    for (const [name, urlPath, needsAuth, fullPage] of TARGETS) {
      const ctx = await browser.newContext({
        httpCredentials: needsAuth ? { username: USER, password: PASS } : undefined,
        viewport: VIEWPORT_DEFS[vp],
        deviceScaleFactor: 2,
      });
      const page = await ctx.newPage();
      const file = path.join(OUT, `${name}.${vp}.png`);
      try {
        const resp = await page.goto(`${BASE}${urlPath}`, { waitUntil: 'networkidle', timeout: 45000 });
        await page.waitForTimeout(1200);
        await page.screenshot({ path: file, fullPage });
        results.push({ name, vp, status: resp?.status() ?? 0, file });
        console.log(`OK  ${name} [${vp}] ${resp?.status() ?? '?'}`);
      } catch (e) {
        results.push({ name, vp, status: 'ERR', error: String(e?.message ?? e) });
        console.log(`ERR ${name} [${vp}]: ${e?.message ?? e}`);
      }
      await ctx.close();
    }
  }
  await browser.close();
  await fs.writeFile(path.join(OUT, 'index.json'), JSON.stringify({ base: BASE, ts: new Date().toISOString(), results }, null, 2));
  console.log(`\nWrote ${results.length} captures to ${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
