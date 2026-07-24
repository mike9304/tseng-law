import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

const css = readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');

function extractBlocks(source: string, header: string): string[] {
  const blocks: string[] = [];
  let searchFrom = 0;

  while (searchFrom < source.length) {
    const start = source.indexOf(header, searchFrom);
    if (start === -1) break;

    const openingBrace = source.indexOf('{', start + header.length);
    if (openingBrace === -1) break;

    let depth = 0;
    for (let index = openingBrace; index < source.length; index += 1) {
      if (source[index] === '{') depth += 1;
      if (source[index] === '}') depth -= 1;

      if (depth === 0) {
        blocks.push(source.slice(start, index + 1));
        searchFrom = index + 1;
        break;
      }
    }

    if (depth !== 0) throw new Error(`Unclosed CSS block for ${header}`);
  }

  return blocks;
}

function ruleBody(source: string, selector: string): string {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return source.match(new RegExp(`${escapedSelector}\\s*\\{([^{}]*)\\}`))?.[1] ?? '';
}

describe('service detail mobile overflow contract', () => {
  test('constrains the stacked grid track without overflow clipping', () => {
    const mediaBlocks = extractBlocks(css, '@media (max-width: 900px)');
    const targetBlocks = mediaBlocks.filter((block) => block.includes('.svc-container'));

    expect(targetBlocks).toHaveLength(1);

    const target = targetBlocks[0] ?? '';
    const containerRule = ruleBody(target, '.svc-container');

    expect(containerRule).toContain('grid-template-columns: minmax(0, 1fr)');
    expect(containerRule).not.toMatch(/grid-template-columns:\s*1fr\s*;/);
    expect(ruleBody(target, '.svc-sidebar')).toContain('position: static');
    expect(target).not.toMatch(/overflow-x:\s*(?:hidden|clip)\b/);
  });
});
