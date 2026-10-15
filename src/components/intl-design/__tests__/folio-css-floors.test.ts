import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(path.join(process.cwd(), 'src/components/intl-design/folio.css'), 'utf8')
  // keep offsets stable while dropping comments
  .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' '));

type Rule = { selector: string; body: string };
const rules: Rule[] = [...css.matchAll(/([^{};]+)\{([^{}]*)\}/g)].map((m) => ({
  selector: m[1].trim().replace(/\s+/g, ' '),
  body: m[2],
}));

/**
 * Elements without Thai glyphs keep their tight leading: wordmark, numerals, counters, and the list of Korean
 * source-language titles on the column index.
 */
const LATIN_ONLY = [/\.logo-kr\b/, /\.footer-main-brand\b/, /\.stat-number\b/, /li::before/, /data-columns-original-language/];

/** Thai counterpart of a rule: same selector with `.intl-folio` → `.intl-folio:lang(th)`, holding a line-height ≥ floor. */
function thaiOverride(selector: string, floor: number): boolean {
  const variants = selector.split(/,\s*/).map((part) => part.replace(/^\.intl-folio/, '.intl-folio:lang(th)'));
  return variants.every((variant) =>
    rules.some((rule) => {
      if (!rule.selector.split(/,\s*/).includes(variant)) return false;
      const value = Number(/line-height:\s*([\d.]+)/.exec(rule.body)?.[1]);
      return value >= floor;
    }),
  );
}

describe('Folio Thai line-height floors (review round 1)', () => {
  it('defines the floors: 0 by default, 1.5 / 1.8 on Thai pages', () => {
    const base = rules.find((rule) => rule.selector === '.intl-folio' && /--f-th-head/.test(rule.body));
    const thai = rules.find((rule) => rule.selector === '.intl-folio:lang(th)' && /--f-th-head/.test(rule.body));
    expect(base?.body).toMatch(/--f-th-head:\s*0;/);
    expect(base?.body).toMatch(/--f-th-text:\s*0;/);
    expect(thai?.body).toMatch(/--f-th-head:\s*1\.5;/);
    expect(thai?.body).toMatch(/--f-th-text:\s*1\.8;/);
  });

  it('every literal line-height below 1.8 outside :lang(th) rules is Thai-aware, a token, or Latin-only', () => {
    const offenders: string[] = [];
    for (const rule of rules) {
      if (rule.selector.includes(':lang(th)')) continue;
      for (const [, value] of rule.body.matchAll(/line-height:\s*([^;]+);/g)) {
        const v = value.replace(/!important/, '').trim();
        if (v.startsWith('var(--f-') || v === 'inherit') continue; // tokens carry their own :lang(th) values
        if (/^max\([\d.]+, var\(--f-th-(head|text)\)\)$/.test(v)) continue;
        const n = Number(v);
        if (Number.isFinite(n) && n >= 1.8) continue;
        if (LATIN_ONLY.some((pattern) => pattern.test(rule.selector))) continue;
        const runningText = /(-copy|summary|note|address|-text|lede)\b|\bp\b|\bli\b/.test(rule.selector);
        // 1.5 already meets the title/UI floor; only running text needs more.
        if (Number.isFinite(n) && n >= 1.5 && !runningText) continue;
        if (thaiOverride(rule.selector, runningText ? 1.8 : 1.5)) continue;
        offenders.push(`${rule.selector.slice(0, 120)} → ${v}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('running-text rules use the 1.8 floor, titles and UI the 1.5 floor', () => {
    const floors = rules.flatMap((rule) =>
      [...rule.body.matchAll(/line-height:\s*max\(([\d.]+), var\(--f-th-(head|text)\)\)/g)].map((m) => ({
        selector: rule.selector,
        kind: m[2],
      })),
    );
    expect(floors.length).toBeGreaterThanOrEqual(24);
    for (const { selector, kind } of floors) {
      const text = /(-copy\)? p|summary|note|address|services-bento|sidebar-text|card-copy)/.test(selector);
      expect(`${selector} ${kind}`).toBe(`${selector} ${text ? 'text' : 'head'}`);
    }
  });

  it('lifts the shared parts the Folio rules do not restyle on Thai pages', () => {
    const ui = rules.find((rule) => rule.selector.includes('.columns-filter-btn') && rule.selector.includes(':lang(th)'));
    expect(ui?.body).toMatch(/line-height:\s*1\.5 !important/);
    for (const hook of ['.attorney-group-title', '.locale-flag-switcher-link', '#international-inquiry', '.column-post-nav', '.office-map-fallback-panel']) {
      expect(ui?.selector).toContain(hook);
    }
    const text = rules.find((rule) => rule.selector.includes('#international-inquiry p') && rule.selector.includes(':lang(th)'));
    expect(text?.body).toMatch(/line-height:\s*1\.8 !important/);
  });
});

describe('Folio footer touch targets (review round 1)', () => {
  it('keeps the shared 44px minimum on footer links', () => {
    const link = rules.find((rule) => rule.selector === '.intl-folio .site-footer .footer-link-list a');
    expect(link?.body).toMatch(/min-height:\s*44px;/);
    expect(link?.body).toMatch(/align-items:\s*center;/);
    expect(link?.body).not.toMatch(/min-height:\s*0/);
  });
});
