// patch-site-firmname-2026-07-22.test.mjs — pure planner unit tests (node:test)
// 실행: node --test scripts/patch-site-firmname-2026-07-22.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  OLD_BRAND_MARKER,
  NEW_FIRM_NAME,
  collectBrandFindings,
  planFirmNamePatch,
  formatPatchPlan,
  parseArgs,
} from './patch-site-firmname-2026-07-22.mjs';

function siteDoc(overrides = {}) {
  return {
    siteId: 'tseng-law-main-site',
    name: 'Hojeong',
    updatedAt: '2026-01-01T00:00:00.000Z',
    settings: { firmName: '호정국제', phone: '02-000-0000' },
    pages: [],
    ...overrides,
  };
}

test('replaces settings.firmName when it holds the old brand', () => {
  const plan = planFirmNamePatch(siteDoc(), { now: '2026-07-22T00:00:00.000Z' });
  assert.equal(plan.ok, true);
  assert.equal(plan.changes.length, 1);
  assert.equal(plan.changes[0].path, 'settings.firmName');
  assert.equal(plan.changes[0].oldValue, OLD_BRAND_MARKER);
  assert.equal(plan.changes[0].newValue, NEW_FIRM_NAME);
  assert.equal(plan.document.settings.firmName, NEW_FIRM_NAME);
  assert.equal(plan.document.updatedAt, '2026-07-22T00:00:00.000Z');
});

test('does not mutate the input document', () => {
  const input = siteDoc();
  planFirmNamePatch(input);
  assert.equal(input.settings.firmName, OLD_BRAND_MARKER, 'input must be untouched');
});

test('no change when firmName is already correct', () => {
  const plan = planFirmNamePatch(siteDoc({ settings: { firmName: NEW_FIRM_NAME } }));
  assert.equal(plan.changes.length, 0);
});

test('empty-backend default (firmName missing) makes zero changes but reports site.name', () => {
  // createDefaultSiteDocument sets name:"호정국제" and no settings.firmName.
  const plan = planFirmNamePatch(siteDoc({ name: '호정국제', settings: {} }));
  assert.equal(plan.changes.length, 0, 'no firmName write on empty backend');
  const nameFinding = plan.brandFindings.find((f) => f.path === 'name');
  assert.ok(nameFinding, 'site.name old-brand must be reported');
  assert.ok(plan.warnings.length >= 1, 'a fallback warning is emitted');
});

test('firmName set to an unrelated value is left untouched', () => {
  const plan = planFirmNamePatch(siteDoc({ settings: { firmName: 'Some Other Firm' } }));
  assert.equal(plan.changes.length, 0);
});

test('brand scan finds nested localized overrides and businessName', () => {
  const doc = siteDoc({
    settings: {
      firmName: '호정국제',
      seoChecklist: { businessName: '호정국제법률사무소' },
      localizedOverrides: { ko: { firmName: '호정국제' }, 'zh-hant': { firmName: '昊鼎國際法律事務所' } },
    },
  });
  const findings = collectBrandFindings(doc);
  const paths = findings.map((f) => f.path).sort();
  assert.ok(paths.includes('settings.firmName'));
  assert.ok(paths.includes('settings.seoChecklist.businessName'));
  assert.ok(paths.includes('settings.localizedOverrides.ko.firmName'));
  assert.ok(!paths.includes('settings.localizedOverrides.zh-hant.firmName'), 'correct zh brand not flagged');
});

test('only settings.firmName is changed even when other old-brand fields exist', () => {
  const doc = siteDoc({
    name: '호정국제',
    settings: { firmName: '호정국제', seoChecklist: { businessName: '호정국제' } },
  });
  const plan = planFirmNamePatch(doc);
  assert.equal(plan.changes.length, 1);
  assert.equal(plan.changes[0].path, 'settings.firmName');
  // other old-brand fields remain, only reported
  assert.equal(plan.document.name, '호정국제');
  assert.equal(plan.document.settings.seoChecklist.businessName, '호정국제');
  assert.ok(plan.brandFindings.length >= 3);
});

test('formatPatchPlan renders dry-run summary with findings', () => {
  const plan = planFirmNamePatch(siteDoc());
  const text = formatPatchPlan(plan, 'dry-run');
  assert.match(text, /DRY RUN/);
  assert.match(text, /settings\.firmName/);
  assert.match(text, /Dry-run complete/);
});

test('parseArgs handles flags and rejects unsafe site ids', () => {
  assert.equal(parseArgs(['--apply']).apply, true);
  assert.equal(parseArgs([]).apply, false);
  assert.equal(parseArgs(['--site=my-site']).siteId, 'my-site');
  assert.throws(() => parseArgs(['--site=../evil']), /safe builder site id/);
  assert.throws(() => parseArgs(['--nope']), /Unknown argument/);
});
