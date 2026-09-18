import { describe, expect, it } from 'vitest';
import {
  PUBLIC_LANGUAGE_AUTONYMS,
  PUBLIC_LOCALES_8,
} from '@/lib/public-guidance';
import {
  groupedPublicLanguages,
  LANGUAGE_PICKER_COPY,
  LANGUAGE_REGION_LABELS,
  LANGUAGE_REGION_ORDER,
  PUBLIC_LANGUAGE_REGISTRY,
  type LanguageRegion,
} from '@/lib/public-language-registry';

const FORBIDDEN_CLAIMS =
  /승소율|성공률|勝訴|상담 언어|consultation language|win[\s-]*rate|success[\s-]*rate|\b최고\b|\bbest\b|\bno\.?\s*1\b/i;

function everyCopyString(): string[] {
  const values: string[] = [];
  for (const locale of PUBLIC_LOCALES_8) {
    const copy = LANGUAGE_PICKER_COPY[locale];
    values.push(copy.open, copy.title, copy.close, copy.current);
    for (const region of LANGUAGE_REGION_ORDER) {
      values.push(LANGUAGE_REGION_LABELS[locale][region]);
    }
  }
  for (const entry of PUBLIC_LANGUAGE_REGISTRY) {
    values.push(entry.autonym, entry.englishName, entry.regionLabel);
  }
  return values;
}

describe('public language registry', () => {
  it('lists each of the eleven locales once with matching autonyms', () => {
    const locales = PUBLIC_LANGUAGE_REGISTRY.map((entry) => entry.locale);
    expect(locales).toHaveLength(11);
    expect(new Set(locales).size).toBe(11);
    expect(locales.sort()).toEqual([...PUBLIC_LOCALES_8].sort());

    for (const entry of PUBLIC_LANGUAGE_REGISTRY) {
      expect(entry.autonym).toBe(PUBLIC_LANGUAGE_AUTONYMS[entry.locale]);
      expect(entry.autonym.length).toBeGreaterThan(0);
      expect(entry.englishName.length).toBeGreaterThan(0);
      expect(entry.regionLabel.length).toBeGreaterThan(0);
      expect(LANGUAGE_REGION_ORDER).toContain(entry.region);
    }

    expect(PUBLIC_LANGUAGE_REGISTRY.filter((entry) => entry.rtl).map((entry) => entry.locale)).toEqual(
      ['ar'],
    );
    expect(PUBLIC_LANGUAGE_REGISTRY.find((entry) => entry.locale === 'ar')?.rtl).toBe(true);
  });

  it('ships region labels and picker copy for every public locale without empty strings', () => {
    for (const locale of PUBLIC_LOCALES_8) {
      expect(LANGUAGE_PICKER_COPY[locale]).toEqual({
        open: expect.stringMatching(/\S/),
        title: expect.stringMatching(/\S/),
        close: expect.stringMatching(/\S/),
        current: expect.stringMatching(/\S/),
      });
      for (const region of LANGUAGE_REGION_ORDER) {
        expect(LANGUAGE_REGION_LABELS[locale][region]).toMatch(/\S/);
      }
    }
    expect(everyCopyString().some((value) => value.trim() === '')).toBe(false);
  });

  it('keeps one language in one region and skips empty groups', () => {
    const byRegion = new Map<LanguageRegion, string[]>();
    for (const region of LANGUAGE_REGION_ORDER) {
      byRegion.set(region, []);
    }
    for (const entry of PUBLIC_LANGUAGE_REGISTRY) {
      byRegion.get(entry.region)?.push(entry.locale);
    }
    expect(byRegion.get('asia-pacific')).toEqual(['ko', 'zh-hant', 'ja', 'vi', 'id', 'th', 'fil']);
    expect(byRegion.get('middle-east')).toEqual(['ar']);
    expect(byRegion.get('europe')).toEqual(['de', 'es']);
    expect(byRegion.get('americas')).toEqual(['en']);
    expect(groupedPublicLanguages('ko').map((group) => group.region)).toEqual([...LANGUAGE_REGION_ORDER]);
  });

  it('does not imply consultation language or make advertising claims', () => {
    const blob = everyCopyString().join('\n');
    expect(blob).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
