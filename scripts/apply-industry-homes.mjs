#!/usr/bin/env node
/**
 * apply-industry-homes.mjs — write thin buildIndustryHome() template files from generated configs.
 *
 * Input: a JSON file shaped { results: [ { industry: {id, category, ko}, cfg: IndustryHomeConfig } ] }
 * (the track-c-industry-homes workflow output). For each entry it writes
 * src/lib/builder/templates/<category>/<id>.ts as a thin wrapper calling buildIndustryHome.
 *
 * Image filenames in cfg are bare (no /images/ prefix); we prefix here and verify each exists
 * on disk, falling back to a safe existing image if an agent picked a nonexistent one.
 *
 * Usage: node scripts/apply-industry-homes.mjs <configsJsonPath>
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const TPL = path.join(ROOT, 'src/lib/builder/templates');
const IMG_DIR = path.join(ROOT, 'public/images');
const FALLBACK_IMG = 'placeholder-hero.jpg';

const configsPath = process.argv[2];
if (!configsPath) { console.error('usage: apply-industry-homes.mjs <configsJson>'); process.exit(1); }

// Normalize a literal "\n" (backslash + n, as agents emit) into a real newline,
// then JSON.stringify so it serializes back to a proper "\n" escape in the TS source.
function q(s) { return JSON.stringify(String(s ?? '').replace(/\\n/g, '\n')); }

async function imgExists(name) {
  const bare = String(name || '').replace(/^\/images\//, '');
  try { await fs.access(path.join(IMG_DIR, bare)); return bare; } catch { return null; }
}

async function resolveImg(name) {
  return (await imgExists(name)) ?? FALLBACK_IMG;
}

function arrLit(items, indent, render) {
  return '[\n' + items.map((it) => `${indent}  ${render(it)},`).join('\n') + `\n${indent}]`;
}

async function buildFile(industry, cfg) {
  const heroImage = await resolveImg(cfg.heroImage);
  const featureImage = await resolveImg(cfg.featureImage);
  const services = [];
  for (const s of cfg.services) services.push({ ...s, image: await resolveImg(s.image) });

  const varName = industry.id.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/-/g, '') + 'Template';

  return `import { buildIndustryHome } from '../_shared/industry-home';

/**
 * ${industry.ko} home — rebuilt from the shared industry-home builder (WIX-PERFECT backlog #7).
 * Replaces a 714-line, zero-image lorem skeleton with a distinct, image-rich, palette-driven
 * Wix-grade home page (hero + stats + service cards + feature split + process + testimonial + CTA).
 */
export const ${varName} = buildIndustryHome({
  id: ${q(industry.id)},
  name: ${q(cfg.heroEyebrow && industry.ko ? industry.ko + ' 홈' : industry.ko + ' 홈')},
  category: ${q(industry.category)},
  description: ${q(cfg.heroSubtitle)},
  palette: {
    base: ${q(cfg.palette.base)},
    surface: ${q(cfg.palette.surface)},
    surfaceAlt: ${q(cfg.palette.surfaceAlt)},
    ink: ${q(cfg.palette.ink)},
    mutedInk: ${q(cfg.palette.mutedInk)},
    accent: ${q(cfg.palette.accent)},
    onAccent: ${q(cfg.palette.onAccent)},
    line: ${q(cfg.palette.line)},
  },
  heroImage: ${q('/images/' + heroImage)},
  heroImageAlt: ${q(cfg.heroImageAlt)},
  heroEyebrow: ${q(cfg.heroEyebrow)},
  heroTitle: ${q(cfg.heroTitle)},
  heroSubtitle: ${q(cfg.heroSubtitle)},
  heroPrimaryCta: ${q(cfg.heroPrimaryCta)},
  heroSecondaryCta: ${q(cfg.heroSecondaryCta)},
  stats: ${arrLit(cfg.stats, '  ', (s) => `{ value: ${q(s.value)}, label: ${q(s.label)} }`)},
  servicesTitle: ${q(cfg.servicesTitle)},
  servicesSubtitle: ${q(cfg.servicesSubtitle)},
  services: ${arrLit(services, '  ', (s) => `{ title: ${q(s.title)}, desc: ${q(s.desc)}, image: ${q('/images/' + s.image)}, imageAlt: ${q(s.imageAlt)} }`)},
  featureTitle: ${q(cfg.featureTitle)},
  featureBody: ${q(cfg.featureBody)},
  featureBullets: ${arrLit(cfg.featureBullets, '  ', (b) => q(b))},
  featureImage: ${q('/images/' + featureImage)},
  featureImageAlt: ${q(cfg.featureImageAlt)},
  processTitle: ${q(cfg.processTitle)},
  process: ${arrLit(cfg.process, '  ', (p) => `{ step: ${q(p.step)}, title: ${q(p.title)}, desc: ${q(p.desc)} }`)},
  testimonialQuote: ${q(cfg.testimonialQuote)},
  testimonialAuthor: ${q(cfg.testimonialAuthor)},
  testimonialRole: ${q(cfg.testimonialRole)},
  ctaTitle: ${q(cfg.ctaTitle)},
  ctaSubtitle: ${q(cfg.ctaSubtitle)},
  ctaButton: ${q(cfg.ctaButton)},
});
`;
}

async function main() {
  const raw = JSON.parse(await fs.readFile(configsPath, 'utf8'));
  const results = raw.results || raw;
  let written = 0;
  const expectedVar = [];
  for (const { industry, cfg } of results) {
    if (!industry || !cfg) { console.error('skip malformed entry'); continue; }
    const file = path.join(TPL, industry.category, `${industry.id}.ts`);
    const code = await buildFile(industry, cfg);
    await fs.writeFile(file, code);
    written++;
    const varName = industry.id.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/-/g, '') + 'Template';
    expectedVar.push(`${industry.id} -> ${varName} (${industry.category}/${industry.id}.ts)`);
    console.log(`wrote ${industry.category}/${industry.id}.ts`);
  }
  console.log(`\n${written} files written.`);
  console.log('Export names (must match registry import):\n' + expectedVar.join('\n'));
}

main().catch((e) => { console.error(e); process.exit(1); });
