/** Preserve an audited next/font build as standalone, per-family CSS + WOFF2.
 * Usage: node scripts/vendor-built-fonts.mjs <distDir>
 * Font source settings are retained in scripts/font-source.ts.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import postcss from 'postcss';
const dist = process.argv[2];
if (!dist) throw new Error('Pass the next/font source build directory');
const output = 'public/fonts';
fs.mkdirSync(output, { recursive: true });
const manifest = {};
for (const file of fs.readdirSync(path.join(dist, 'static/css'))) {
  const root = postcss.parse(fs.readFileSync(path.join(dist, 'static/css', file), 'utf8'));
  const variables = [];
  root.walkDecls(decl => { if (decl.prop.startsWith('--font-noto-')) variables.push(decl); });
  for (const variable of variables) {
    const families = new Set(variable.value.split(',').map(value => value.trim().replace(/^['"]|['"]$/g, '')));
    const sheet = postcss.root();
    root.walkAtRules('font-face', rule => {
      const family = rule.nodes.find(node => node.type === 'decl' && node.prop === 'font-family');
      if (family && families.has(family.value.replace(/^['"]|['"]$/g, ''))) sheet.append(rule.clone());
    });
    const rule = postcss.rule({ selector: '.' + variable.prop });
    rule.append({ prop: variable.prop, value: variable.value });
    sheet.append(rule);
    sheet.walkDecls('src', decl => {
      decl.value = decl.value.replace(/url\(([^)]+)\)/g, (_match, raw) => {
        const name = path.basename(raw.replace(/['"]/g, ''));
        if (!/^[a-f0-9]+-s\.woff2$/.test(name)) throw new Error('Unexpected font asset: ' + name);
        fs.copyFileSync(path.join(dist, 'static/media', name), path.join(output, name));
        return `url(/fonts/${name})`;
      });
    });
    const content = sheet.toString();
    const hash = createHash('sha256').update(content).digest('hex').slice(0, 12);
    const filename = variable.prop.slice(2) + '-' + hash + '.css';
    fs.writeFileSync(path.join(output, filename), content);
    manifest[variable.prop] = '/fonts/' + filename;
  }
}
if (Object.keys(manifest).length !== 17) throw new Error('Expected all 17 Noto families');
fs.writeFileSync('src/data/font-stylesheets.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(`Vendored ${Object.keys(manifest).length} unchanged font families`);
