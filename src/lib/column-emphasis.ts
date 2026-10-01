import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { Root, RootContent } from 'mdast';

const parser = unified().use(remarkParse).use(remarkGfm);

/** Remove prose emphasis without reserializing Markdown or changing code/URLs. */
export function removeColumnBoldEmphasis(markdown: string): string {
  if (!/\*\*|__|<\/?(?:strong|b)\b/i.test(markdown)) return markdown;
  const ranges: [number, number][] = [];
  let htmlCodeDepth = 0;
  function collectText(start: number, end: number): void {
    // CommonMark can leave emphasis next to CJK punctuation as literal text.
    const source = markdown.slice(start, end);
    const urls = [...source.matchAll(/https?:\/\/[^\s<>"']+/gi)];
    for (const match of source.matchAll(/(?<!\\)(\*\*)(?=\S)([\s\S]*?\S)(?<!\\)\1/g)) {
      const open = match.index;
      const close = open + match[0].length - 2;
      if (urls.some((url) => [open, close].some((offset) => offset >= url.index && offset < url.index + url[0].length))) continue;
      ranges.push([start + open, start + open + 2], [start + close, start + close + 2]);
    }
  }
  function visit(node: Root | RootContent): void {
    const start = node.position?.start.offset;
    const end = node.position?.end.offset;
    if (start === undefined || end === undefined) return;
    if (node.type === 'code' || node.type === 'inlineCode') return;
    if (node.type === 'link' && !markdown.slice(start, end).startsWith('[')) return;
    if (node.type === 'html') {
      // Consume complete tags, including quoted attributes, before finding wrappers.
      const tags = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\/?([a-z][\w:-]*)\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi;
      let textStart = start;
      for (const match of markdown.slice(start, end).matchAll(tags)) {
        if (htmlCodeDepth === 0) collectText(textStart, start + match.index);
        textStart = start + match.index + match[0].length;
        const tag = match[1]?.toLowerCase();
        if (!tag) continue;
        if (['pre', 'code', 'script', 'style'].includes(tag)) {
          htmlCodeDepth = Math.max(0, htmlCodeDepth + (match[0].startsWith('</') ? -1 : 1));
        } else if (htmlCodeDepth === 0 && (tag === 'strong' || tag === 'b')) {
          ranges.push([start + match.index, start + match.index + match[0].length]);
        }
      }
      if (htmlCodeDepth === 0) collectText(textStart, end);
      return;
    }
    if (htmlCodeDepth > 0) return;
    if (node.type === 'strong') {
      ranges.push([start, start + 2], [end - 2, end]);
    } else if (node.type === 'text') {
      collectText(start, end);
    }
    if ('children' in node) node.children.forEach(visit);
  }
  visit(parser.parse(markdown));
  let output = '';
  let cursor = 0;
  for (const [start, end] of ranges.sort((a, b) => a[0] - b[0])) {
    if (start > cursor) output += markdown.slice(cursor, start);
    cursor = Math.max(cursor, end);
  }
  return output + markdown.slice(cursor);
}
