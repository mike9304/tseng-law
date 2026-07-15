import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');

describe('editor outline view color', () => {
  it('draws structure outlines without desaturating the page', () => {
    const rule = css.match(/html\[data-builder-outline='true'\] \.builder-pub-node,[\s\S]*?\n\}/)?.[0] ?? '';

    expect(rule).toContain('outline: 1px dashed');
    expect(rule).not.toContain('grayscale');
  });
});
