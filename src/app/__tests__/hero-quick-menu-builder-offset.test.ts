import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');

/**
 * The published zh-hant home renders the decomposed hero, which wraps the quick
 * menu in an absolutely-positioned builder node and forces the nav itself to
 * `position: relative` inline. The base rule's `top: 100%` then resolves against
 * the wrapper's height instead of docking under the search bar, dropping the
 * menu onto the next section (live: 1045px vs ko's 739px).
 */
describe('hero quick menu under the builder-decomposed hero', () => {
  it('keeps the base rule absolutely positioned below the search bar', () => {
    const base = css.match(/\n\.hero-quick-menu \{([^}]*)\}/);
    expect(base).not.toBeNull();
    expect(base![1]).toMatch(/position:\s*absolute/);
    expect(base![1]).toMatch(/top:\s*100%/);
  });

  it('zeroes the offset for the builder variant, which its wrapper already carries', () => {
    const variant = css.match(/\.hero-quick-menu\.builder-hero-quick-menu \{([^}]*)\}/);
    expect(variant).not.toBeNull();
    expect(variant![1]).toMatch(/(^|\s)top:\s*0\s*;/);
    expect(variant![1]).toMatch(/margin-top:\s*0\s*;/);
    // It must not re-introduce an offset of its own.
    expect(variant![1]).not.toMatch(/top:\s*100%/);
  });

  it('still emits the builder class the override hangs on', () => {
    const decompose = readFileSync(
      path.join(process.cwd(), 'src/lib/builder/canvas/decompose-hero.ts'),
      'utf8',
    );
    expect(decompose).toContain("className: 'hero-quick-menu builder-hero-quick-menu'");
  });
});
