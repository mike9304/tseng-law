import { describe, expect, it } from 'vitest';
import {
  WIX_FALLBACK_TARGET,
  WIX_REDIRECT_ENTRIES,
  isWixLegacyHost,
  resolveWixRedirectTarget,
} from '../wix-redirect-map';

describe('isWixLegacyHost', () => {
  it('matches the apex and www legacy hosts case/port-insensitively', () => {
    expect(isWixLegacyHost('wei-wei-lawyer.com')).toBe(true);
    expect(isWixLegacyHost('www.wei-wei-lawyer.com')).toBe(true);
    expect(isWixLegacyHost('WWW.WEI-WEI-LAWYER.COM')).toBe(true);
    expect(isWixLegacyHost('wei-wei-lawyer.com:3000')).toBe(true);
    expect(isWixLegacyHost('www.wei-wei-lawyer.com:443')).toBe(true);
  });

  it('rejects unrelated hosts and empty input', () => {
    expect(isWixLegacyHost('tseng-law.com')).toBe(false);
    expect(isWixLegacyHost('localhost')).toBe(false);
    expect(isWixLegacyHost('')).toBe(false);
    expect(isWixLegacyHost(null)).toBe(false);
    expect(isWixLegacyHost(undefined)).toBe(false);
  });
});

describe('resolveWixRedirectTarget', () => {
  it('maps an exact column slug to its canonical URL', () => {
    expect(resolveWixRedirectTarget('/post/taiwan-company-establishment-basics')).toBe(
      'https://tseng-law.com/ko/columns/taiwan-company-establishment-basics',
    );
  });

  it('maps a suggested blog-category path to the columns index', () => {
    expect(resolveWixRedirectTarget('/blog/categories/대만-법인설립')).toBe(
      'https://tseng-law.com/ko/columns',
    );
  });

  it('maps the legacy home to the Korean home', () => {
    expect(resolveWixRedirectTarget('/')).toBe('https://tseng-law.com/ko');
  });

  it('falls back to the Korean home for any unmapped path', () => {
    expect(resolveWixRedirectTarget('/totally-unknown-page')).toBe(WIX_FALLBACK_TARGET);
    expect(resolveWixRedirectTarget('/totally-unknown-page')).toBe('https://tseng-law.com/ko');
    expect(resolveWixRedirectTarget('/some/deep/unmapped/path')).toBe('https://tseng-law.com/ko');
  });

  it('matches a Korean exact path whether it arrives decoded or percent-encoded', () => {
    const decoded = '/post/대만-노동법：대만에서-퇴직금-받기-어렵다고';
    const encoded = encodeURIComponent(decoded);

    expect(resolveWixRedirectTarget(decoded)).toBe(
      'https://tseng-law.com/ko/columns/taiwan-labor-severance-law',
    );
    expect(resolveWixRedirectTarget(encoded)).toBe(
      'https://tseng-law.com/ko/columns/taiwan-labor-severance-law',
    );
  });

  it('matches the second Korean exact path (voluntary resignation severance)', () => {
    const decoded = '/post/직원이-자발적으로-퇴사해도-퇴직금을-받을-수-있는-예외';
    expect(resolveWixRedirectTarget(encodeURIComponent(decoded))).toBe(
      'https://tseng-law.com/ko/columns/taiwan-voluntary-resignation-severance',
    );
  });
});

describe('redirect table integrity', () => {
  it('covers all 33 CSV rows (18 exact + 15 suggested)', () => {
    const exact = WIX_REDIRECT_ENTRIES.filter((e) => e.type === 'exact').length;
    const suggested = WIX_REDIRECT_ENTRIES.filter((e) => e.type === 'suggested').length;
    expect(WIX_REDIRECT_ENTRIES.length).toBe(33);
    expect(exact).toBe(18);
    expect(suggested).toBe(15);
  });

  it('has unique from-paths and only absolute https targets', () => {
    const paths = WIX_REDIRECT_ENTRIES.map((e) => e.fromPath);
    expect(new Set(paths).size).toBe(paths.length);
    for (const entry of WIX_REDIRECT_ENTRIES) {
      expect(entry.toUrl.startsWith('https://tseng-law.com')).toBe(true);
    }
  });
});
