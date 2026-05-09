import { describe, expect, it } from 'vitest';
import {
  MOBILE_SCHEMA_LOCKED_AT,
  normalizeHeaderFooterMobileConfig,
  normalizeMobileBottomBar,
  normalizeMobileSchemaForSiteDocument,
} from '@/lib/builder/site/mobile-schema';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';

function site(overrides: Partial<BuilderSiteDocument> = {}): BuilderSiteDocument {
  return {
    version: 1,
    siteId: 'tseng-law-main-site',
    name: '호정국제',
    locale: 'ko',
    navigation: [],
    theme: {
      colors: {
        primary: '#123b63',
        secondary: '#1e5a96',
        accent: '#e8a838',
        text: '#1f2937',
        background: '#ffffff',
        muted: '#f3f4f6',
      },
      fonts: { heading: 'system-ui', body: 'system-ui' },
      radii: { sm: 4, md: 8, lg: 16 },
    },
    pages: [],
    createdAt: '2026-05-10T00:00:00.000Z',
    updatedAt: '2026-05-10T00:00:00.000Z',
    ...overrides,
  };
}

describe('M07 mobile schema lock', () => {
  it('documents the lock timestamp used by migration docs', () => {
    expect(MOBILE_SCHEMA_LOCKED_AT).toBe('2026-05-10T03:00:00+09:00');
  });

  it('defaults global header mobile behavior at site normalization time', () => {
    expect(normalizeHeaderFooterMobileConfig(undefined)).toMatchObject({
      mobileSticky: false,
      mobileHamburger: 'auto',
    });
  });

  it('preserves explicit global header mobile behavior', () => {
    expect(normalizeHeaderFooterMobileConfig({
      headerCanvasId: 'global-header',
      mobileSticky: true,
      mobileHamburger: 'force',
    })).toMatchObject({
      headerCanvasId: 'global-header',
      mobileSticky: true,
      mobileHamburger: 'force',
    });
  });

  it('normalizes site-level mobile bottom bar without enabling it by default', () => {
    const normalized = normalizeMobileBottomBar(undefined, {
      phone: '+886 2 2751 5255',
    });

    expect(normalized.enabled).toBe(false);
    expect(normalized.actions).toEqual([
      { id: 'call', label: '전화', href: 'tel:+886227515255', kind: 'phone' },
      { id: 'consultation', label: '상담 예약', href: '#contact', kind: 'booking' },
    ]);
  });

  it('fills legacy site documents with mobile schema defaults', () => {
    const normalized = normalizeMobileSchemaForSiteDocument(site());

    expect(normalized.headerFooter).toMatchObject({
      mobileSticky: false,
      mobileHamburger: 'auto',
    });
    expect(normalized.mobileBottomBar).toMatchObject({
      enabled: false,
      actions: [
        { id: 'call', kind: 'phone' },
        { id: 'consultation', kind: 'booking' },
      ],
    });
  });
});
