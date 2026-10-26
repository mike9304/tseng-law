import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL, fileURLToPath} from 'node:url';
import crypto from 'node:crypto';
const work = path.dirname(fileURLToPath(import.meta.url));
const repoIndex = process.argv.indexOf('--repository');
if (repoIndex < 0 || !process.argv[repoIndex + 1]) throw new Error('Explicit --repository required');
const repo = path.resolve(process.argv[repoIndex + 1]);
const freeze = JSON.parse(fs.readFileSync(path.join(work, 'INPUT-FREEZE.json'), 'utf8'));
if (repo !== freeze.R) throw new Error('Repository differs from frozen provenance');
const require = createRequire(path.join(repo, 'package.json'));
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
const {default: Markdown} = await import(pathToFileURL(require.resolve('react-markdown')));
const {default: remarkGfm} = await import(pathToFileURL(require.resolve('remark-gfm')));
const fixtures = JSON.parse(fs.readFileSync(path.join(work, 'neutral-fixtures.json'), 'utf8'));
const decode = html => html.replace(/<[^>]*>/g, '').replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#([0-9]+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&(?:amp|lt|gt|quot);/g, x => ({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"'}[x]));
const rows = fixtures.visible_text.map(c => {
  const html = renderToStaticMarkup(React.createElement(Markdown, {remarkPlugins:[remarkGfm]}, c.input));
  const renderedText = decode(html);
  return {id:c.id, input:c.input, html, renderedText, expected:c.expected, passed:renderedText === c.expected};
});
for (const c of fixtures.sentences.filter(c => c.expected_list_count !== undefined)) {
  const html = renderToStaticMarkup(React.createElement(Markdown, {remarkPlugins:[remarkGfm]}, c.input));
  rows.push({id:c.id, input:c.input, html, paragraphs:(html.match(/<p>/g)||[]).length,
    lists:(html.match(/<ol(?: |>)|<ul>/g)||[]).length,
    passed:(html.match(/<p>/g)||[]).length === c.expected_paragraph_count &&
      (html.match(/<ol(?: |>)|<ul>/g)||[]).length === c.expected_list_count});
}
const report = {node:process.version, repository:repo,
  componentSHA256:crypto.createHash('sha256').update(fs.readFileSync(path.join(repo,'src/components/ColumnContent.tsx'))).digest('hex'),
  scope:'Installed ReactMarkdown + remarkGfm neutral rendering; not a whole component/build/public-page claim.', rows};
fs.writeFileSync(path.join(work,'render-neutral.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({cases:rows.length,passed:rows.filter(x=>x.passed).length,failed:rows.filter(x=>!x.passed).map(x=>x.id)}));
process.exitCode = rows.every(x=>x.passed) ? 0 : 1;
