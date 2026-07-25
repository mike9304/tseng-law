import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getAllColumnPosts } from '@/lib/columns';
import type { Locale } from '@/lib/locales';

const SUPPORTED_LOCALES = ['ko', 'zh-hant', 'en'] as const satisfies readonly Locale[];
const EXPECTED_RECORDS_PER_LOCALE = 17;
const EXPECTED_VECTOR_DIMENSION = 1536;
const GYM_INJURY_SLUG = 'taiwan-gym-injury-lawsuit';
const DIVORCE_QNA_SLUG = 'taiwan-divorce-lawsuit-qna';
const OVERTAKING_ACCIDENT_SLUG = 'taiwan-overtaking-accident-liability';

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

const divorceQnaExpectations: Record<
  Locale,
  { title: string; snippetAnchors: readonly string[] }
> = {
  ko: {
    title: '대만 이혼 절차 Q&A: 조정·소송·재산분할·자녀',
    snippetAnchors: [
      '대만 이혼사건에서는 혼인관계를 끝내는 방식뿐 아니라',
      '부부재산, 손해배상, 이혼 후 배우자 부양',
    ],
  },
  'zh-hant': {
    title: '台灣離婚程序 Q&A：調解、訴訟、財產分配與子女',
    snippetAnchors: [
      '處理台灣離婚事件時，除了結束婚姻關係本身',
      '夫妻財產、損害賠償、離婚後贍養費',
    ],
  },
  en: {
    title: 'Taiwan Divorce Q&A: Mediation, Litigation, Property, and Children',
    snippetAnchors: [
      'This guide explains Taiwan divorce routes',
      'household registration, court procedure, and judicial-divorce grounds',
    ],
  },
};

const overtakingAccidentExpectations: Record<
  Locale,
  { title: string; snippetAnchors: readonly string[] }
> = {
  ko: {
    title: '대만 추월 사고의 책임은 어떻게 판단하나요?',
    snippetAnchors: [
      '앞차가 느리게 달리면 추월이 흔한 선택',
      '상당한 위험이 따르는 운전 행위',
    ],
  },
  'zh-hant': {
    title: '台灣超車事故的責任如何判斷？',
    snippetAnchors: [
      '前方車輛行駛緩慢時，超車常被視為平常的選擇',
      '這項操作本身伴隨相當風險',
    ],
  },
  en: {
    title: 'Who Is Liable in an Overtaking Accident?',
    snippetAnchors: [
      'Overtaking can appear routine when a vehicle ahead is moving slowly',
      'it creates substantial risk',
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

  it('keeps column 007 titles and snippets synchronized to the accepted rewrites', () => {
    for (const locale of SUPPORTED_LOCALES) {
      const record = embeddingsFile.embeddings.find(
        (entry) =>
          entry.locale === locale && entry.slug === DIVORCE_QNA_SLUG,
      );
      const expected = divorceQnaExpectations[locale];

      expect(record).toBeDefined();
      expect(record?.title).toBe(expected.title);
      for (const anchor of expected.snippetAnchors) {
        expect(record?.snippet).toContain(anchor);
      }
      expect(record?.vector, `${locale}:${DIVORCE_QNA_SLUG}`).toHaveLength(
        EXPECTED_VECTOR_DIMENSION,
      );
      expect(
        record?.vector.every(
          (value) => typeof value === 'number' && Number.isFinite(value),
        ),
        `${locale}:${DIVORCE_QNA_SLUG}`,
      ).toBe(true);
    }
  });

  it('rejects stale column 007 titles and summaries', () => {
    const divorceQnaText = embeddingsFile.embeddings
      .filter(({ slug }) => slug === DIVORCE_QNA_SLUG)
      .map(({ title, snippet }) => `${title}\n${snippet}`)
      .join('\n');

    for (const staleText of [
      '이혼 조정·소송 Q&A',
      '離婚調解訴訟 Q&A',
      'Taiwan Divorce Litigation Q&A',
      '台湾の離婚調停・訴訟Q&A',
      '대만 이혼 조정, 소송 Q&A',
      '국제결혼 증가 상황에서 대만 이혼 조정·소송 절차를 Q&A로 설명합니다.',
      '台灣離婚調解與訴訟 Q&A',
      '以實務問答整理離婚調解與訴訟流程。',
      'Taiwan Divorce Mediation & Litigation Q&A',
      'A practical Q&A guide to mediation and litigation in Taiwan divorce matters.',
    ]) {
      expect(divorceQnaText).not.toContain(staleText);
    }
  });

  it('keeps column 012 titles, snippets, and vectors synchronized to the accepted rewrites', () => {
    for (const locale of SUPPORTED_LOCALES) {
      const record = embeddingsFile.embeddings.find(
        (entry) =>
          entry.locale === locale && entry.slug === OVERTAKING_ACCIDENT_SLUG,
      );
      const expected = overtakingAccidentExpectations[locale];

      expect(record).toBeDefined();
      expect(record?.title).toBe(expected.title);
      for (const anchor of expected.snippetAnchors) {
        expect(record?.snippet).toContain(anchor);
      }
      expect(
        record?.vector,
        `${locale}:${OVERTAKING_ACCIDENT_SLUG}`,
      ).toHaveLength(EXPECTED_VECTOR_DIMENSION);
      expect(
        record?.vector.every(
          (value) => typeof value === 'number' && Number.isFinite(value),
        ),
        `${locale}:${OVERTAKING_ACCIDENT_SLUG}`,
      ).toBe(true);
    }
  });

  it('rejects stale column 012 titles and snippets', () => {
    const overtakingAccidentText = embeddingsFile.embeddings
      .filter(({ slug }) => slug === OVERTAKING_ACCIDENT_SLUG)
      .map(({ title, snippet }) => `${title}\n${snippet}`)
      .join('\n');

    for (const staleText of [
      '추월 하다 사고나면 누구 책임???',
      '추월하다 사고 나면 누구 책임?',
      '추월 사고 책임 분석',
      '超車發生事故，究竟是誰的責任？',
      '超車事故責任如何判斷',
      '超車事故責任分析',
      'Overtaking Accident Liability',
      '대만 추월 규칙과 사고 발생 시 과실·책임 판단 기준을 정리했습니다.',
      '整理台灣超車規則與事故責任判斷實務。',
      'Practical standards for overtaking rules and fault allocation in Taiwan traffic accidents.',
    ]) {
      expect(overtakingAccidentText).not.toContain(staleText);
    }
  });
});
