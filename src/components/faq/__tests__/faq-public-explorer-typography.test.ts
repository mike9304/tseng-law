import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const root = process.cwd();
const cssPath = path.join(root, 'src/components/faq/FaqPublicExplorer.module.css');
const tsxPath = path.join(root, 'src/components/faq/FaqPublicExplorer.tsx');

describe('FaqPublicExplorer public typography contract', () => {
  const css = readFileSync(cssPath, 'utf8');
  const tsx = readFileSync(tsxPath, 'utf8');

  it('anchors the explorer to the site sans token', () => {
    expect(css).toContain('font-family: var(--font-sans, var(--font-body));');
  });

  it('does not request unloaded ultra-bold weights (800/850/900)', () => {
    expect(css).not.toMatch(/font-weight:\s*800\b/);
    expect(css).not.toMatch(/font-weight:\s*850\b/);
    expect(css).not.toMatch(/font-weight:\s*900\b/);
  });

  it('sets question weight 600 and answer weight 500', () => {
    // Question control
    expect(css).toMatch(/\.question\s*\{[^}]*font-weight:\s*600/s);
    // Answer panel body
    expect(css).toMatch(/\.panel\s*\{[^}]*font-weight:\s*500/s);
  });

  it('removes pill radii and floating-card shadow', () => {
    expect(css).not.toContain('border-radius: 999px');
    expect(css).not.toContain('0 14px 38px');
  });

  it('provides an accessible focus-visible outline', () => {
    expect(css).toMatch(/:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--purple\)/s);
    expect(css).toMatch(/outline-offset:\s*2px/);
  });

  it('uses a CSS module heading class instead of inline font shorthand on FAQ h3', () => {
    expect(tsx).toContain('className={styles.heading}');
    expect(tsx).not.toMatch(/font:\s*['"]inherit['"]/);
    expect(tsx).not.toMatch(/style=\{\{\s*margin:\s*0,\s*font:\s*['"]inherit['"]/);
    expect(css).toMatch(/\.heading\s*\{/);
  });
});
