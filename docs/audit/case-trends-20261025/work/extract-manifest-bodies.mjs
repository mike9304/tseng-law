import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const [repoArg, inventoryPath, outputPath, countArg] = process.argv.slice(2);
if (!repoArg || !inventoryPath || !outputPath || !countArg) throw new Error('Usage: repo inventory output expected-count');
const repo = path.resolve(repoArg);
const require = createRequire(path.join(repo, 'package.json'));
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const matter = require('gray-matter');
const { default: ReactMarkdown } = await import(pathToFileURL(require.resolve('react-markdown')).href);
const { default: remarkGfm } = await import(pathToFileURL(require.resolve('remark-gfm')).href);
const records = JSON.parse(fs.readFileSync(inventoryPath, 'utf8')).records.filter(x => x.included_in_codex_scope);
if (records.length !== Number(countArg) || new Set(records.map(x => x.route)).size !== records.length) throw new Error('Unexpected inventory count or duplicate routes');
const bodies = records.map(entry => {
  const file = path.resolve(repo, entry.source_path);
  if (!file.startsWith(repo + path.sep)) throw new Error('Path escapes repository');
  const raw = fs.readFileSync(file);
  const { content } = matter(raw.toString('utf8'));
  return { path: entry.source_path, route: entry.route, sha256: crypto.createHash('sha256').update(raw).digest('hex'), html: renderToStaticMarkup(React.createElement(ReactMarkdown, {children: content, remarkPlugins: [remarkGfm]})) };
});
fs.writeFileSync(outputPath, JSON.stringify(bodies, null, 2) + '\n');
console.log(JSON.stringify({count: bodies.length, output: outputPath}));
