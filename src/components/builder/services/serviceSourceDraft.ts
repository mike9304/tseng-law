import type { ServiceAreaSourceRecord } from '@/lib/builder/services/source';
import type { Locale } from '@/lib/locales';

export type ServiceSourceDraft = {
  readonly slug: string;
  readonly title: string;
  readonly subtitle: string;
  readonly intro: string;
  readonly keyPoints: string;
  readonly columnSlugs: readonly string[];
};

export function formStateFromRecord(
  record: ServiceAreaSourceRecord | undefined,
  locale: Locale,
): ServiceSourceDraft {
  return {
    slug: record?.slug ?? '',
    title: record?.title[locale] ?? '',
    subtitle: record?.subtitle[locale] ?? '',
    intro: record?.intro[locale] ?? '',
    keyPoints: record?.keyPoints[locale].join('\n') ?? '',
    columnSlugs: record?.columnSlugs ?? [],
  };
}

export function splitKeyPoints(value: string): string[] | undefined {
  const items = readListDraft(value);
  return items.length ? items : undefined;
}

function readListDraft(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}
