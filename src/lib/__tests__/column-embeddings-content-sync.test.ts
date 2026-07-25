import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getAllColumnPosts } from '@/lib/columns';
import type { Locale } from '@/lib/locales';

const SUPPORTED_LOCALES = ['ko', 'zh-hant', 'en'] as const satisfies readonly Locale[];
const EXPECTED_RECORDS_PER_LOCALE = 17;
const EXPECTED_VECTOR_DIMENSION = 1536;
const GYM_INJURY_SLUG = 'taiwan-gym-injury-lawsuit';

interface StoredColumnEmbedding {
  slug: string;
  locale: Locale;
  title: string;
  snippet: string;
  vector: unknown[];
}

interface ColumnEmbeddingsFile {
  version: number;
  model: string;
  dim: number;
  builtAt: string;
  embeddings: StoredColumnEmbedding[];
}

const embeddingsPath = path.join(
  process.cwd(),
  'src/content/column-embeddings.json',
);
const embeddingsFile = JSON.parse(
  fs.readFileSync(embeddingsPath, 'utf8'),
) as ColumnEmbeddingsFile;

const gymInjuryExpectations: Record<
  Locale,
  { title: string; snippetAnchors: readonly string[] }
> = {
  ko: {
    title: '대만 헬스장 부상 손해배상: 1심 사례·청구기한·증거·배상항목',
    snippetAnchors: [
      '헬스장에서 트레이너의 지도를 받던 한국인 대학생',
      '법적 절차와 청구기한, 증거보전 방법, 배상항목',
    ],
  },
  'zh-hant': {
    title: '台灣健身房受傷求償：一審案例、期限、證據與賠償項目',
    snippetAnchors: [
      '韓國大學生在台灣健身房接受教練指導時受傷',
      '法律途徑、期間限制、證據保存與損害項目',
    ],
  },
  en: {
    title:
      'Taiwan Gym Injury Claims: Case Study, Deadlines, Evidence, and Damages',
    snippetAnchors: [
      'Attorney Wei Tseng, a Taiwan lawyer',
      'gym-injury damages case involving a Korean univ',
    ],
  },
};

describe('generated column embeddings content synchronization', () => {
  it('uses the accepted schema, model, dimension, and ISO build timestamp', () => {
    expect(embeddingsFile.version).toBe(1);
    expect(embeddingsFile.model).toBe('text-embedding-3-small');
    expect(embeddingsFile.dim).toBe(EXPECTED_VECTOR_DIMENSION);

    const builtAt = new Date(embeddingsFile.builtAt);
    expect(Number.isNaN(builtAt.getTime())).toBe(false);
    expect(builtAt.toISOString()).toBe(embeddingsFile.builtAt);
  });

  it('contains exactly 51 unique records and 17 records per supported locale', () => {
    expect(embeddingsFile.embeddings).toHaveLength(
      SUPPORTED_LOCALES.length * EXPECTED_RECORDS_PER_LOCALE,
    );

    const recordKeys = embeddingsFile.embeddings.map(
      ({ locale, slug }) => `${locale}:${slug}`,
    );
    expect(new Set(recordKeys).size).toBe(recordKeys.length);

    for (const locale of SUPPORTED_LOCALES) {
      expect(
        embeddingsFile.embeddings.filter((record) => record.locale === locale),
      ).toHaveLength(EXPECTED_RECORDS_PER_LOCALE);
    }

    expect(
      new Set(embeddingsFile.embeddings.map(({ locale }) => locale)),
    ).toEqual(new Set(SUPPORTED_LOCALES));
  });

  it('matches every current column slug and title in each supported locale', () => {
    for (const locale of SUPPORTED_LOCALES) {
      const expected = getAllColumnPosts(locale)
        .map(({ slug, title }) => [slug, title] as const)
        .sort(([left], [right]) => left.localeCompare(right));
      const actual = embeddingsFile.embeddings
        .filter((record) => record.locale === locale)
        .map(({ slug, title }) => [slug, title] as const)
        .sort(([left], [right]) => left.localeCompare(right));

      expect(actual).toEqual(expected);
    }
  });

  it('stores a complete finite 1536-number vector for every record', () => {
    for (const record of embeddingsFile.embeddings) {
      expect(record.vector, `${record.locale}:${record.slug}`).toHaveLength(
        EXPECTED_VECTOR_DIMENSION,
      );
      expect(
        record.vector.every(
          (value) => typeof value === 'number' && Number.isFinite(value),
        ),
        `${record.locale}:${record.slug}`,
      ).toBe(true);
    }
  });

  it('keeps column 010 titles and snippets synchronized to the accepted rewrites', () => {
    for (const locale of SUPPORTED_LOCALES) {
      const record = embeddingsFile.embeddings.find(
        (entry) =>
          entry.locale === locale && entry.slug === GYM_INJURY_SLUG,
      );
      const expected = gymInjuryExpectations[locale];

      expect(record).toBeDefined();
      expect(record?.title).toBe(expected.title);
      for (const anchor of expected.snippetAnchors) {
        expect(record?.snippet).toContain(anchor);
      }
    }
  });

  it('rejects stale column 010 titles, snippets, and former identity leakage', () => {
    const gymInjuryText = embeddingsFile.embeddings
      .filter(({ slug }) => slug === GYM_INJURY_SLUG)
      .map(({ title, snippet }) => `${title}\n${snippet}`)
      .join('\n');

    for (const staleText of [
      '대만 헬스장 부상 소송',
      '台灣健身房受傷訴訟',
      'Taiwan Gym Injury Lawsuit',
      '증준외 대만 변호사입니다',
      '曾俊瑋',
      'A Korean student injury case that won TWD 1.57M at first instance before settlement on appeal.',
    ]) {
      expect(gymInjuryText).not.toContain(staleText);
    }
  });
});
