import { describe, expect, it } from 'vitest';
import { resolveBuilderSiteName } from '../site-name';
import type { BuilderSiteDocument } from '../types';

function siteWith(partial: Partial<BuilderSiteDocument>): Pick<BuilderSiteDocument, 'name' | 'settings'> {
  return {
    name: partial.name ?? '호정국제',
    settings: partial.settings,
  };
}

describe('resolveBuilderSiteName (builder top bar siteName derivation)', () => {
  it('prefers the saved settings firmName over the document name', () => {
    const site = siteWith({ name: '호정국제', settings: { firmName: '태양 법률' } });
    expect(resolveBuilderSiteName(site, 'ko')).toBe('태양 법률');
  });

  it('falls back to the document name when settings are unset', () => {
    expect(resolveBuilderSiteName(siteWith({ settings: undefined }), 'ko')).toBe('호정국제');
  });

  it('falls back to the document name when firmName is empty', () => {
    const site = siteWith({ name: '호정국제', settings: { firmName: '' } });
    expect(resolveBuilderSiteName(site, 'ko')).toBe('호정국제');
  });

  it('resolves locale-specific firmName overrides', () => {
    const site = siteWith({
      name: '호정국제',
      settings: {
        firmName: '호정국제',
        localizedOverrides: {
          en: { firmName: 'Tseng Law' },
        },
      },
    });
    expect(resolveBuilderSiteName(site, 'en')).toBe('Tseng Law');
    expect(resolveBuilderSiteName(site, 'ko')).toBe('호정국제');
  });
});
