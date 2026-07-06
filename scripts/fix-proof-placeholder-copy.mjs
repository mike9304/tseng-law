#!/usr/bin/env node
/**
 * fix-proof-placeholder-copy.mjs — replace leaked dev/English placeholder copy in templates.
 *
 * The "Wix-grade proof system" enrichment (WIX-PERFECT backlog #3) added real sections to ~170
 * template pages, but several of its strings are dev-facing placeholders that leaked into
 * USER-VISIBLE Korean template content (e.g. "Visual proof area", "Wix-grade proof system").
 * The layout/height is fine; only this copy is wrong. This script replaces those exact strings
 * with neutral, professional Korean — anchored on the full quoted value, so it can ONLY touch
 * text:/label: content values and never className motion hints (e.g. 'section-label').
 *
 * Usage: node scripts/fix-proof-placeholder-copy.mjs
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const TPL = path.join(ROOT, 'src/lib/builder/templates');

// Exact full string (the value inside quotes) → replacement. Matched as 'STRING' (single-quoted)
// so we never hit a className or partial token.
const REPLACEMENTS = [
  ['Wix-grade proof system', '신뢰를 더하는 구성'],
  ['Visual proof area', '대표 비주얼 영역'],
  ['Visual story', '브랜드 스토리'],
  ['CTA, proof, showcase 접점을 반복 배치', '핵심 메시지와 행동 유도를 흐름에 맞춰 배치했습니다'],
  ['방문자가 빠르게 이해하고 비교하고 행동할 수 있도록 hero, proof, showcase, CTA를 한 흐름으로 구성했습니다.',
   '방문자가 빠르게 이해하고 비교하고 행동할 수 있도록 핵심 정보를 한 흐름으로 구성했습니다.'],
];

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(p));
    else if (e.name.endsWith('.ts') && !e.name.endsWith('.test.ts')) out.push(p);
  }
  return out;
}

function replaceExact(src, from, to) {
  // Replace only when the string appears as a single-quoted value: 'from'
  const needle = `'${from}'`;
  const repl = `'${to}'`;
  let count = 0;
  let idx = 0;
  let result = '';
  while (true) {
    const at = src.indexOf(needle, idx);
    if (at < 0) { result += src.slice(idx); break; }
    result += src.slice(idx, at) + repl;
    idx = at + needle.length;
    count++;
  }
  return { result, count };
}

async function main() {
  const files = await walk(TPL);
  let filesChanged = 0;
  const totals = Object.fromEntries(REPLACEMENTS.map(([f]) => [f, 0]));
  for (const file of files) {
    let src = await fs.readFile(file, 'utf8');
    let changed = false;
    for (const [from, to] of REPLACEMENTS) {
      const { result, count } = replaceExact(src, from, to);
      if (count > 0) { src = result; totals[from] += count; changed = true; }
    }
    if (changed) { await fs.writeFile(file, src); filesChanged++; }
  }
  console.log(`files changed: ${filesChanged}`);
  for (const [from, n] of Object.entries(totals)) console.log(`  "${from}" → ${n} replaced`);
  // verify none remain
  let remaining = 0;
  for (const file of files) {
    const src = await fs.readFile(file, 'utf8');
    for (const [from] of REPLACEMENTS) if (src.includes(`'${from}'`)) { remaining++; console.error(`STILL PRESENT: ${from} in ${path.relative(ROOT, file)}`); }
  }
  console.log(remaining === 0 ? 'ALL leaked placeholder strings replaced ✓' : `${remaining} STILL PRESENT ✗`);
  process.exit(remaining === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
