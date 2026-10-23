import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const root = '/Users/son7/tseng-arc-visas-20261024';
const repo = path.join(root, 'repo');
const require = createRequire(path.join(repo, 'package.json'));
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const matter = require('gray-matter');
const { default: ReactMarkdown } = await import(pathToFileURL(require.resolve('react-markdown')).href);
const { default: remarkGfm } = await import(pathToFileURL(require.resolve('remark-gfm')).href);
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'work/checks/content-audit.json'), 'utf8')).articles;
const bodies = manifest.map(entry => {
  const { content } = matter(fs.readFileSync(path.join(repo, entry.path), 'utf8'));
  return { path: entry.path, route: entry.route, html: renderToStaticMarkup(React.createElement(ReactMarkdown, { children: content, remarkPlugins: [remarkGfm] })) };
});
fs.writeFileSync(path.join(root, 'work/checks/source-body-html.json'), JSON.stringify(bodies, null, 2) + '\n');
console.log(JSON.stringify({ rawSourceBodies: bodies.length, note: 'Markdown with GFM table syntax; does not use application attribution stripping or article components' }));
