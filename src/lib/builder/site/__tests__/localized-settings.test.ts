import { describe, expect, it } from 'vitest';
import {
  resolveBuilderSiteSettings,
  setLocalizedBuilderSiteSeoChecklistOverride,
  setLocalizedBuilderSiteSettingOverride,
} from '@/lib/builder/site/localized-settings';
import type { BuilderSiteSettings } from '@/lib/builder/site/types';

describe('localized site settings', () => {
  it('resolves locale-specific text and SEO pattern overrides', () => {
    const settings: BuilderSiteSettings = {
      firmName: '호정국제',
      robotsTxt: 'User-agent: *',
      seoDefaults: {
        patterns: {
          titleTemplate: '{{pageName}} | 호정국제',
          descriptionTemplate: '{{pageName}} 소개',
        },
      },
      localizedOverrides: {
        en: {
          firmName: 'Tseng Law',
          seoDefaults: {
            patterns: {
              titleTemplate: '{{pageName}} | Tseng Law',
            },
          },
        },
      },
    };

    expect(resolveBuilderSiteSettings(settings, 'en')).toMatchObject({
      firmName: 'Tseng Law',
      robotsTxt: 'User-agent: *',
      seoDefaults: {
        patterns: {
          titleTemplate: '{{pageName}} | Tseng Law',
          descriptionTemplate: '{{pageName}} 소개',
        },
      },
    });
    expect(resolveBuilderSiteSettings(settings, 'ko')).toMatchObject({
      firmName: '호정국제',
      seoDefaults: {
        patterns: {
          titleTemplate: '{{pageName}} | 호정국제',
        },
      },
    });
  });

  it('writes and removes locale overrides without touching the source values', () => {
    const settings: BuilderSiteSettings = {
      firmName: '호정국제',
      seoDefaults: {
        patterns: {
          titleTemplate: '{{pageName}} | 호정국제',
        },
      },
    };

    expect(setLocalizedBuilderSiteSettingOverride(settings, 'en', 'settings.firmName', 'Tseng Law')).toBe(true);
    expect(setLocalizedBuilderSiteSettingOverride(
      settings,
      'en',
      'settings.seoDefaults.patterns.titleTemplate',
      '{{pageName}} | Tseng Law',
    )).toBe(true);
    expect(resolveBuilderSiteSettings(settings, 'en')).toMatchObject({
      firmName: 'Tseng Law',
      seoDefaults: {
        patterns: {
          titleTemplate: '{{pageName}} | Tseng Law',
        },
      },
    });

    expect(setLocalizedBuilderSiteSettingOverride(settings, 'en', 'settings.firmName', '')).toBe(true);
    expect(setLocalizedBuilderSiteSettingOverride(
      settings,
      'en',
      'settings.seoDefaults.patterns.titleTemplate',
      '',
    )).toBe(true);
    expect(settings.localizedOverrides?.en).toBeUndefined();
    expect(resolveBuilderSiteSettings(settings, 'en')).toMatchObject({
      firmName: '호정국제',
      seoDefaults: {
        patterns: {
          titleTemplate: '{{pageName}} | 호정국제',
        },
      },
    });
  });

  it('resolves locale-specific seoChecklist overrides', () => {
    const settings: BuilderSiteSettings = {
      seoChecklist: {
        businessName: '호정국제',
        keywords: ['국제 법률'],
        serviceMode: 'both',
      },
      localizedOverrides: {
        en: {
          seoChecklist: {
            businessName: 'Tseng Law',
            keywords: ['international law'],
            serviceMode: 'online',
          },
        },
      },
    };

    expect(resolveBuilderSiteSettings(settings, 'en')).toMatchObject({
      seoChecklist: {
        businessName: 'Tseng Law',
        keywords: ['international law'],
        serviceMode: 'online',
      },
    });
    expect(resolveBuilderSiteSettings(settings, 'ko')).toMatchObject({
      seoChecklist: {
        businessName: '호정국제',
        keywords: ['국제 법률'],
        serviceMode: 'both',
      },
    });
  });

  it('writes and removes locale seoChecklist overrides', () => {
    const settings: BuilderSiteSettings = {
      seoChecklist: {
        businessName: '호정국제',
        keywords: ['국제 법률'],
        serviceMode: 'both',
      },
    };

    expect(setLocalizedBuilderSiteSeoChecklistOverride(settings, 'en', {
      businessName: 'Tseng Law',
      keywords: ['international law'],
      serviceMode: 'online',
    })).toBe(true);
    expect(resolveBuilderSiteSettings(settings, 'en')).toMatchObject({
      seoChecklist: {
        businessName: 'Tseng Law',
        keywords: ['international law'],
        serviceMode: 'online',
      },
    });

    expect(setLocalizedBuilderSiteSeoChecklistOverride(settings, 'en', undefined)).toBe(true);
    expect(settings.localizedOverrides?.en).toBeUndefined();
    expect(resolveBuilderSiteSettings(settings, 'en')).toMatchObject({
      seoChecklist: {
        businessName: '호정국제',
        keywords: ['국제 법률'],
        serviceMode: 'both',
      },
    });
  });
});
