import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(
  new URL('./qa-site-remediation.mjs', import.meta.url),
  'utf8',
);

test('site remediation QA crosses the cinematic opening before testing chrome and popup', () => {
  assert.match(
    source,
    /async function revealHomepageAfterCinematicOpening\(page, locale\)/,
  );
  assert.match(
    source,
    /data-cinematic-intro-visible'\) === 'false'/,
  );
  assert.match(
    source,
    /header should become visible after the cinematic opening/,
  );
  assert.match(source, /page\.mouse\.wheel\(0, 4\)/);
  assert.match(
    source,
    /should replace the opening with the first homepage scene in one gesture/,
  );
  assert.match(
    source,
    /event popup should be deferred while the cinematic opening is visible/,
  );
});

test('lazy image hydration restores the caller scroll position', () => {
  assert.match(
    source,
    /const restoreScrollY = await page\.evaluate\(\(\) => window\.scrollY\)/,
  );
  assert.match(
    source,
    /window\.scrollTo\(\{ top: scrollY, behavior: 'auto' \}\)/,
  );
});

test('the Korean event popup remains required while other locales are optional', () => {
  assert.match(source, /if \(locale === 'ko'\)/);
  assert.match(
    source,
    /page\.locator\('\.year-end-popup-backdrop:visible'\)/,
  );
  assert.match(source, /if \(await popupBackdrop\.count\(\) > 0\)/);
});

test('site remediation QA keeps the Taichung courthouse v2 hero media contract', () => {
  const currentHeroMedia = [
    '/images/editorial/taichung-courthouse-civic-daylight-v2.webp',
    '/videos/taichung-courthouse-civic-daylight-v2.webm',
    '/videos/taichung-courthouse-civic-daylight-v2.mp4',
    '/images/editorial/taichung-courthouse-civic-daylight-v2-mobile.webp',
    '/videos/taichung-courthouse-civic-daylight-v2-mobile.webm',
    '/videos/taichung-courthouse-civic-daylight-v2-mobile.mp4',
  ];

  for (const mediaPath of currentHeroMedia) {
    assert.ok(
      source.includes(mediaPath),
      `QA must retain the current Taichung courthouse media path: ${mediaPath}`,
    );
  }

  assert.match(
    source,
    /image\.getAttribute\('src'\) \?\? image\.currentSrc[\s\S]*?includes\(expectedPoster\)[\s\S]*?currentHeroMedia\.poster/,
  );
  assert.doesNotMatch(source, /hero-taiwan-modern-city-opening\.webp/);
});
