import { describe, expect, it } from 'vitest';

import { getServiceArea } from '@/data/service-details';
import {
  PREVIOUS_EN_SERVICE_DEFAULTS,
  projectInternationalPublicCopy,
  type LocalizedServiceCopy,
} from '@/lib/services/international-public-copy';

function recordFromArea(slug: string, locale: 'en' | 'ko' | 'zh-hant' = 'en'): LocalizedServiceCopy {
  const area = getServiceArea(slug);
  if (!area) {
    throw new Error(`Missing service area ${slug}`);
  }
  return {
    slug: area.slug,
    title: area.title[locale],
    subtitle: area.subtitle[locale],
    intro: area.intro[locale],
    keyPoints: [...area.keyPoints[locale]],
    columnSlugs: [...area.columnSlugs],
  };
}

function previousInvestmentRecord(overrides: Partial<LocalizedServiceCopy> = {}): LocalizedServiceCopy {
  const current = recordFromArea('investment');
  return {
    ...current,
    subtitle: PREVIOUS_EN_SERVICE_DEFAULTS.investment.subtitle,
    intro: PREVIOUS_EN_SERVICE_DEFAULTS.investment.intro,
    keyPoints: [...PREVIOUS_EN_SERVICE_DEFAULTS.investment.keyPoints],
    ...overrides,
  };
}

describe('international public copy projection', () => {
  it('projects previous EN investment defaults to the current getServiceArea copy', () => {
    const current = getServiceArea('investment')!;
    const result = projectInternationalPublicCopy('en', previousInvestmentRecord());

    expect(result.subtitle).toBe(current.subtitle.en);
    expect(result.intro).toBe(current.intro.en);
    expect(result.keyPoints).toEqual(current.keyPoints.en);
    expect(result.subtitle).toContain('overseas companies and investors');
    expect(result.keyPoints).toHaveLength(6);
    expect(result.keyPoints.join('\n')).not.toMatch(/10 steps|3 months|TWD 500,000|PIF registration is mandatory|TWD 25M|5 years/);
  });

  it('projects previous EN labor and IP intros only', () => {
    const labor = recordFromArea('labor');
    labor.intro = PREVIOUS_EN_SERVICE_DEFAULTS.labor.intro;
    const ip = recordFromArea('ip');
    ip.intro = PREVIOUS_EN_SERVICE_DEFAULTS.ip.intro;

    expect(projectInternationalPublicCopy('en', labor).intro).toBe(getServiceArea('labor')!.intro.en);
    expect(projectInternationalPublicCopy('en', ip).intro).toBe(getServiceArea('ip')!.intro.en);
    expect(projectInternationalPublicCopy('en', labor).intro).not.toMatch(/Korea/);
    expect(projectInternationalPublicCopy('en', ip).intro).toContain('international businesses');
  });

  it('preserves custom EN fields and a non-matching investment key-point array', () => {
    const custom = previousInvestmentRecord({
      subtitle: 'Custom investment subtitle',
      intro: 'Custom investment intro',
      keyPoints: ['Custom point 1', 'Custom point 2'],
    });
    const mixed = previousInvestmentRecord({
      keyPoints: [...PREVIOUS_EN_SERVICE_DEFAULTS.investment.keyPoints, 'Extra custom point'],
    });
    const current = getServiceArea('investment')!;

    expect(projectInternationalPublicCopy('en', custom)).toEqual(custom);
    expect(projectInternationalPublicCopy('en', mixed).subtitle).toBe(current.subtitle.en);
    expect(projectInternationalPublicCopy('en', mixed).intro).toBe(current.intro.en);
    expect(projectInternationalPublicCopy('en', mixed).keyPoints).toEqual(mixed.keyPoints);
  });

  it('does not mutate a frozen previous-default input', () => {
    const input = Object.freeze(previousInvestmentRecord({
      keyPoints: Object.freeze([...PREVIOUS_EN_SERVICE_DEFAULTS.investment.keyPoints]) as string[],
      columnSlugs: Object.freeze([...recordFromArea('investment').columnSlugs]) as string[],
    }));
    const snapshot = {
      ...input,
      keyPoints: [...input.keyPoints],
      columnSlugs: [...input.columnSlugs],
    };

    const result = projectInternationalPublicCopy('en', input);

    expect(input.subtitle).toBe(snapshot.subtitle);
    expect(input.intro).toBe(snapshot.intro);
    expect([...input.keyPoints]).toEqual(snapshot.keyPoints);
    expect(result).not.toBe(input);
    expect(result.intro).toBe(getServiceArea('investment')!.intro.en);
  });

  it('leaves current EN copy, other locales, and unrelated slugs unchanged', () => {
    const currentInvestment = recordFromArea('investment');
    const koInvestment = recordFromArea('investment', 'ko');
    const zhLabor = recordFromArea('labor', 'zh-hant');
    const civil = recordFromArea('civil');
    const previousOnKorean = previousInvestmentRecord();
    previousOnKorean.title = koInvestment.title;
    previousOnKorean.intro = PREVIOUS_EN_SERVICE_DEFAULTS.investment.intro;

    expect(projectInternationalPublicCopy('en', currentInvestment)).toBe(currentInvestment);
    expect(projectInternationalPublicCopy('ko', koInvestment)).toBe(koInvestment);
    expect(projectInternationalPublicCopy('ja', currentInvestment)).toBe(currentInvestment);
    expect(projectInternationalPublicCopy('zh-hant', zhLabor)).toBe(zhLabor);
    expect(projectInternationalPublicCopy('en', civil)).toBe(civil);
    expect(projectInternationalPublicCopy('ko', previousOnKorean)).toBe(previousOnKorean);
    expect(koInvestment.intro).toContain('한국 기업');
    expect(getServiceArea('investment')!.intro.ko).toContain('한국 기업');
    expect(getServiceArea('investment')!.intro['zh-hant']).toContain('韓國企業');
  });
});
