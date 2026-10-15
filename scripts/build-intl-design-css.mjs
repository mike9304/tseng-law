#!/usr/bin/env node
// Folio stylesheet (id, th and the 27 European locales): the Folio font faces (intl-type-<hash>.css, committed) followed
// by src/components/intl-design/folio.css → public/fonts/intl-2026-10/intl-folio-<hash>.css, the one sheet
// src/app/fonts.ts links on the Folio locales (one link instead of two on 822 pages).
//
//   node scripts/build-intl-design-css.mjs          write the hashed sheet (removes older ones) and print its URL
//   node scripts/build-intl-design-css.mjs --check  exit 1 when the committed sheet is not the current output
//
// Why not a CSS module: imported by the shared layout shell, the Folio CSS joined Next's CSS chunking for every
// locale, which re-grouped and re-ordered the other locales' CSS (406 module-order inversions, the Japanese home
// rendered differently; review round 1, 2026-10-15). Out of webpack, other locales get exactly the CSS they had.
// The steps match Next's own production CSS for this repo (no postcss config, no browserslist): postcss-flexbugs-fixes,
// postcss-preset-env (stage 3, autoprefixer without 2009 flexbox, custom properties untouched, Next's modern
// browser targets), then cssnano-simple with colormin off.
import crypto from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const postcss = require('postcss');
const flexbugsFixes = require('next/dist/compiled/postcss-flexbugs-fixes');
const presetEnv = require('next/dist/compiled/postcss-preset-env');
const cssnanoSimple = require('next/dist/compiled/cssnano-simple');
const MODERN_BROWSERSLIST_TARGET = require('next/dist/shared/lib/modern-browserslist-target');

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const INTL_DESIGN_SOURCE = path.join(REPO_ROOT, 'src/components/intl-design/folio.css');
const OUT_DIR = path.join(REPO_ROOT, 'public/fonts/intl-2026-10');
const PREFIX = 'intl-folio-';
/** The Folio @font-face sheet (renamed OFL subsets); its own hash is checked by folio-design.test. */
export const INTL_TYPE_SOURCE = path.join(OUT_DIR, 'intl-type-fea253f38e9e.css');

/** Processed, minified CSS and its public URL. */
export async function buildIntlDesignCss(source = fs.readFileSync(INTL_DESIGN_SOURCE, 'utf8')) {
  const prepared = await postcss([
    flexbugsFixes,
    presetEnv({
      browsers: MODERN_BROWSERSLIST_TARGET,
      autoprefixer: { flexbox: 'no-2009' },
      stage: 3,
      features: { 'custom-properties': false },
    }),
  ]).process(source, { from: INTL_DESIGN_SOURCE });
  const minified = await postcss([cssnanoSimple({ colormin: false }, postcss)]).process(prepared.css, { from: undefined });
  const css = `${fs.readFileSync(INTL_TYPE_SOURCE, 'utf8').trimEnd()}\n${minified.css.trim()}\n`;
  const hash = crypto.createHash('sha256').update(css).digest('hex').slice(0, 12);
  return { css, file: `${PREFIX}${hash}.css`, href: `/fonts/intl-2026-10/${PREFIX}${hash}.css` };
}

async function main() {
  const { css, file, href } = await buildIntlDesignCss();
  const target = path.join(OUT_DIR, file);
  if (process.argv.includes('--check')) {
    const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
    if (current !== css) {
      console.error(`${href} is missing or stale; run node scripts/build-intl-design-css.mjs`);
      process.exit(1);
    }
    console.log(`${href} is current`);
    return;
  }
  for (const old of fs.readdirSync(OUT_DIR).filter((name) => /^intl-(folio|design)-[0-9a-f]{12}\.css$/.test(name) && name !== file)) {
    fs.rmSync(path.join(OUT_DIR, old));
  }
  fs.writeFileSync(target, css);
  console.log(`${href} (${Buffer.byteLength(css)} B); set INTL_FOLIO_STYLESHEET in src/app/fonts.ts to this URL`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
