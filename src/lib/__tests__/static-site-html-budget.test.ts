import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
// @ts-expect-error -- plain ESM build scripts without type declarations
import { checkHtmlBudget, FOLIO_LOCALES, HTML_BUDGET_BYTES, normalizeBuildNoise } from '../../../scripts/static-site/html-budget.mjs';
import { INTL_DESIGN_LOCALES } from '@/lib/intl-design-locales';

/** Per-page HTML budget of the Folio design (review round 2): the static-build gate and its noise normalisation. */

const dirs: string[] = [];
afterEach(() => {
  for (const dir of dirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

function snapshot(pages: Record<string, string>) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'html-budget-'));
  dirs.push(root);
  for (const [rel, html] of Object.entries(pages)) {
    fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    fs.writeFileSync(path.join(root, rel), html);
  }
  return root;
}

const page = (body: string) => `<!DOCTYPE html><html><head></head><body>${body}</body></html>`;
const pad = (n: number) => 'x'.repeat(n);

describe('static-site HTML budget gate', () => {
  it('covers exactly the Folio locales and allows +40 B per page', () => {
    expect([...FOLIO_LOCALES].sort()).toEqual([...INTL_DESIGN_LOCALES].sort());
    expect(HTML_BUDGET_BYTES).toBe(40);
  });

  it('removes only what differs between two builds of the same source', () => {
    const streamed = page(
      '<main><!--$?--><template id="B:0"></template><!--/$--></main>'
        + '<script>self.__next_f.push([1,"a"])</script><script>self.__next_f.push([1,"b"])</script>'
        + '<script src="/_next/static/chunks/app/page-0123456789abcdef.js"></script>'
        + '<link rel="preload" as="image" href="https://media.tseng-law.com/images/a.webp"/>'
        + '<div hidden id="S:a"><div class="x">content</div></div><script>$RS("S:a","P:a")</script>'
        + '<div hidden id="S:0"><title>t</title></div>'
        + '<script>requestAnimationFrame(function(){$RT=performance.now()});</script>'
        + '<script>$RB=[];$RV=function(a){};$RC=function(a,b){};$RC("B:0","S:0")</script>',
    );
    const inline = page(
      '<main><div class="x">content</div></main>'
        + '<script>self.__next_f.push([1,"ab"])</script>'
        + '<script src="/_next/static/chunks/app/page-fedcba9876543210.js"></script><title>t</title>',
    );
    expect(Buffer.byteLength(normalizeBuildNoise(streamed))).toBe(Buffer.byteLength(normalizeBuildNoise(inline)));
    // Real content is never removed.
    expect(normalizeBuildNoise(page('<p>Résumé</p><img src="/a.webp" alt="a"/>'))).toContain('<p>Résumé</p><img src="/a.webp" alt="a"/>');
  });

  it('passes when Folio homes shrink and every other page grows by 40 B at most', () => {
    const base = snapshot({
      'fr.html': page(pad(500)),
      'fr/about.html': page(pad(500)),
      'th/columns/a.html': page(pad(500)),
      'en.html': page(pad(500)),
      'ko/about.html': page(pad(500)),
    });
    const cand = snapshot({
      'fr.html': page(pad(499)),
      'fr/about.html': page(pad(540)),
      'th/columns/a.html': page(pad(100)),
      'en.html': page(pad(500)),
      'ko/about.html': page(pad(500)),
      'fr/404.html': page('Page introuvable'),
    });
    const result = checkHtmlBudget({ baseDir: base, candDir: cand });
    expect(result.failures).toEqual([]);
    expect(result.ok).toBe(true);
    expect(result.counts.added).toBe(1);
  });

  it('fails a page over budget, a home that does not shrink, a new page and a missing page', () => {
    const base = snapshot({
      'de.html': page(pad(500)),
      'de/faq.html': page(pad(500)),
      'ja.html': page(pad(500)),
      'ko/about.html': page(pad(500)),
    });
    const cand = snapshot({
      'de.html': page(pad(500)),
      'de/faq.html': page(pad(541)),
      'ja.html': page(pad(541)),
      'ko/new.html': page(''),
      'ms/404.html': page(''),
    });
    const result = checkHtmlBudget({ baseDir: base, candDir: cand });
    expect(result.ok).toBe(false);
    const byPage = Object.fromEntries(result.failures.map((failure: { rel: string; rule: string }) => [failure.rel, failure.rule]));
    expect(byPage).toEqual({
      'de.html': 'Folio home must shrink',
      'de/faq.html': 'grows more than 40 B',
      'ja.html': 'grows more than 40 B',
      'ko/new.html': 'new page outside the Folio 404 pages',
      'ms/404.html': 'new page outside the Folio 404 pages',
      'ko/about.html': 'page disappeared',
    });
  });

  it('counts the noise-free bytes, so a streamed copy of the same page passes', () => {
    const base = snapshot({ 'pl/about.html': page('<main><p>Treść</p></main>') });
    const cand = snapshot({
      'pl/about.html': page('<main><!--$?--><template id="B:0"></template><!--/$--></main><div hidden id="S:0"><p>Treść</p></div><script>$RC("B:0","S:0")</script>'),
    });
    const result = checkHtmlBudget({ baseDir: base, candDir: cand });
    expect(result.ok).toBe(true);
    expect(result.rows[0].delta).toBe(0);
    expect(result.rows[0].raw).toBeGreaterThan(40);
  });
});
