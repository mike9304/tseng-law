import { describe, expect, it } from 'vitest';
import {
  PUBLIC_LANGUAGE_AUTONYMS,
  PUBLIC_LOCALES_8,
  RTL_PUBLIC_LOCALES,
  isRtlPublicLocale,
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
    values.push(entry.autonym, entry.englishName);
  }
  return values;
}

describe('public language registry', () => {
  it('lists each public locale once with matching autonyms', () => {
    const locales = PUBLIC_LANGUAGE_REGISTRY.map((entry) => entry.locale);
    expect(locales).toHaveLength(PUBLIC_LOCALES_8.length);
    expect(new Set(locales).size).toBe(PUBLIC_LOCALES_8.length);
    expect([...locales].sort()).toEqual([...PUBLIC_LOCALES_8].sort());

    for (const entry of PUBLIC_LANGUAGE_REGISTRY) {
      expect(entry.autonym).toBe(PUBLIC_LANGUAGE_AUTONYMS[entry.locale]);
      expect(entry.autonym.length).toBeGreaterThan(0);
      expect(entry.englishName.length).toBeGreaterThan(0);
      expect(LANGUAGE_REGION_ORDER).toContain(entry.region);
      expect('regionLabel' in entry).toBe(false);
      expect('rtl' in entry).toBe(false);
    }

    expect(
      PUBLIC_LANGUAGE_REGISTRY.filter((entry) => isRtlPublicLocale(entry.locale)).map(
        (entry) => entry.locale,
      ),
    ).toEqual([...RTL_PUBLIC_LOCALES]);
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

    const occupiedRegions = LANGUAGE_REGION_ORDER.filter(
      (region) => (byRegion.get(region) ?? []).length > 0,
    );
    expect(occupiedRegions.length).toBeGreaterThan(0);
    for (const region of LANGUAGE_REGION_ORDER) {
      const locales = byRegion.get(region) ?? [];
      expect(new Set(locales).size).toBe(locales.length);
    }
    expect(occupiedRegions.every((region) => (byRegion.get(region) ?? []).length > 0)).toBe(true);

    const grouped = groupedPublicLanguages('ko');
    expect(grouped.every((group) => group.entries.length > 0)).toBe(true);
    expect(grouped.map((group) => group.region)).toEqual(occupiedRegions);
    expect(grouped.map((group) => group.region)).toEqual(
      LANGUAGE_REGION_ORDER.filter((region) => occupiedRegions.includes(region)),
    );

    const groupedLocales = grouped.flatMap((group) => group.entries.map((entry) => entry.locale));
    expect(new Set(groupedLocales).size).toBe(groupedLocales.length);
    expect(groupedLocales).toHaveLength(PUBLIC_LOCALES_8.length);
  });

  it('does not imply consultation language or make advertising claims', () => {
    const blob = everyCopyString().join('\n');
    expect(blob).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
