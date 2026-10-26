import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { auditBatch } from '/Users/son7/Projects/tseng-law-all-locales-20261025/docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs';

const repo = '/Users/son7/Projects/tseng-law-all-locales-20261025';
const batch = '/Users/son7/tseng-all-language-columns-20261025/batch09';
const target = path.join(batch, 'src/content/columns-sl');
const overlay = path.join(batch, 'checks/sl-overlay-content');
const names = fs.readdirSync(target).filter(n => /^(916|920)-.*\.md$/.test(n)).sort();
if (names.length !== 2) throw new Error(`Expected two changed owned SL articles, found ${names.length}`);
fs.mkdirSync(path.join(overlay, 'columns-sl'), { recursive: true });
for (const dir of fs.readdirSync(path.join(repo, 'src/content'))) {
  if (!dir.startsWith('columns') || dir === 'columns-sl') continue;
  const dest = path.join(overlay, dir);
  if (!fs.existsSync(dest)) fs.symlinkSync(path.join(repo, 'src/content', dir), dest);
}
for (const name of fs.readdirSync(path.join(repo, 'src/content/columns-sl'))) {
  if (names.includes(name)) throw new Error(`Target collides with existing R article: ${name}`);
  const dest = path.join(overlay, 'columns-sl', name);
  if (!fs.existsSync(dest)) fs.symlinkSync(path.join(repo, 'src/content/columns-sl', name), dest);
}
for (const name of names) {
  const dest = path.join(overlay, 'columns-sl', name);
  if (!fs.existsSync(dest)) fs.symlinkSync(path.join(target, name), dest);
}
const groups = [];
for (const sourceLocale of ['zh-hant', 'en']) {
  const selected = names.filter(n => (/^91[56]-/.test(n) ? 'en' : 'zh-hant') === sourceLocale);
  const prefix = sourceLocale === 'en' ? 'en-' : 'zh-';
  const sourceDir = sourceLocale === 'en' ? 'columns-en' : 'columns-zh';
  for (const name of selected) {
    const frozen = fs.readFileSync(path.join(batch, '../batch06/research/canonical-snapshots', prefix + name));
    const current = fs.readFileSync(path.join(repo, 'src/content', sourceDir, name));
    if (!frozen.equals(current)) throw new Error(`Canonical source changed: ${name}`);
  }
  const sourceMap = Object.fromEntries(selected.map(n => [
    `sl:${n.replace(/^\d+-/, '').replace(/\.md$/, '')}`,
    path.join(repo, 'src/content', sourceDir, n),
  ]));
  groups.push(await auditBatch({ repoRoot: repo, contentRoot: overlay,
    files: selected.map(n => path.join(overlay, 'columns-sl', n)), sourceMap,
    sourceLocale, publicationDate: '2026-10-26' }));
}
const result = {
  atUTC: new Date().toISOString(), groups,
  errors: groups.reduce((n, g) => n + g.errors, 0),
  files: names.map(name => ({ path: path.join(target, name), sha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(target, name))).digest('hex') })),
  note: 'Unmodified production checker with explicit frozen mixed-locale source mapping. Structural checks do not certify legal meaning, native authorship, rendering or deployment.',
};
fs.writeFileSync(path.join(batch, 'checks/sl-content-audit-review-r2.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ errors: result.errors, groups: groups.map(g => ({ selectedFiles: g.selectedFiles, sourceLocale: g.policy.sourceLocale, findings: g.files.filter(f => f.errors.length).map(f => ({ file: f.file, errors: f.errors })) })) }, null, 2));
if (result.errors) process.exitCode = 1;
