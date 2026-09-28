import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HomeCaseResultsSplit from '../HomeCaseResultsSplit';
import { siteContent } from '@/data/site-content';
import { createCaseResultsDecomposedNodes } from '@/lib/builder/canvas/decompose-case-results';
import { locales, siteLocales, type Locale, type SiteLocale } from '@/lib/locales';

const reviewedCopy = {
  ko: {
    label: '사례 분석',
    title: '한국 유학생 헬스장 부상 사건\n1심 승소·항소심 화해',
    description:
      '대만 헬스장에서 트레이너의 지도를 받아 운동하던 중 다친 한국인 대학생이 손해배상을 청구한 사건입니다. 1심에서 손해배상을 인정받아 승소했고, 이후 항소심에서 당사자 간 화해로 종결되었습니다.',
    summary:
      '사건 결과는 구체적인 사실관계와 증거에 따라 달라질 수 있으며, 이 사례는 과거 한 사건의 진행 경과를 소개합니다.',
    cta: '소송사례 분석 보기',
  },
  'zh-hant': {
    label: '案例解析',
    title: '韓國留學生健身房受傷案\n一審勝訴，二審和解',
    description:
      '韓國大學生在台灣健身房接受教練指導運動時受傷，提起損害賠償訴訟。一審原告勝訴，其後雙方於二審和解。',
    summary:
      '個案結果因具體事實與證據而異；本案例僅說明過往個案的處理經過。',
    cta: '查看訴訟案例',
  },
  // WO-X1 (EN-03/J01): nationality removed from the headline and body.
  en: {
    label: 'CASE STUDY',
    title: 'Gym Injury Claim —\nWon at First Instance, Settled on Appeal',
    description:
      'A university student sought damages after being injured while training under an instructor’s supervision at a Taiwan gym. The first-instance court ruled in the student’s favor and awarded damages; the case later concluded through a settlement on appeal.',
    summary:
      'Outcomes depend on the specific facts and evidence; this case study describes the course of one past matter.',
    cta: 'Read the case write-up',
  },
  ja: {
    label: '事例紹介',
    title: 'ジムでの負傷事故 —\n一審勝訴、控訴審で和解',
    description:
      '台湾のジムでトレーナーの指導を受けて運動中に負傷した大学生が、損害賠償を請求した事例です。一審で損害賠償が認められて勝訴し、その後、控訴審で当事者間の和解により終結しました。',
    summary:
      '結果は具体的な事実関係や証拠により異なります。本事例は、過去の一案件の経過を紹介するものです。',
    cta: '事例の解説を読む',
  },
} as const satisfies Record<
  SiteLocale,
  {
    label: string;
    title: string;
    description: string;
    summary: string;
    cta: string;
  }
>;

// User decision 2026-09-28 (1A, Taiwan attorney-advertising ethics): the
// case block states that the claim was won at first instance and later
// settled on appeal. It carries no award amount in any locale.
const stageMarkers: Record<SiteLocale, [string, string]> = {
  ko: ['1심에서 손해배상을 인정받아 승소', '항소심에서 당사자 간 화해'],
  'zh-hant': ['一審原告勝訴', '雙方於二審和解'],
  en: ['first-instance court ruled in the student’s favor', 'settlement on appeal'],
  ja: ['一審で損害賠償が認められて勝訴', '控訴審で当事者間の和解'],
};

/** Any award amount or currency: the figure, its rounded forms, the unit. */
const awardAmountPatterns = [
  /\d{2,}/,
  /\d[.,]\d/,
  /TWD|NT\$/i,
  /新台幣|新臺幣|대만달러|新台湾ドル/,
  /[0-9]\s*(?:萬|万|만)/,
] as const;

const forbiddenClaims = [
  'First-Instance Win',
  /\bwin\b/i,
  /\bvictory\b/i,
  /success rate/i,
  /guarantee/i,
  /same result/i,
  // The only win the copy may state is the first-instance one.
  /항소심[^。.]*승소/,
  /二審[^。.]*勝訴/,
  /won on appeal|appeal (?:win|victory)/i,
  /控訴審[^。]*勝訴/,
  /157|1\.57|1,579,589/,
] as const;

function expectNoForbiddenClaims(serialized: string) {
  for (const forbidden of forbiddenClaims) {
    expect(serialized).not.toMatch(forbidden);
  }
}

function getBuilderNodeText(
  locale: Locale,
  nodeId: string,
  field: 'text' | 'label',
) {
  const node = createCaseResultsDecomposedNodes(0, locale, 0).find(
    ({ id }) => id === nodeId,
  );

  expect(node).toBeDefined();
  expect(node?.content).toHaveProperty(field);

  return (node?.content as Record<string, unknown>)[field];
}

describe('homepage gym case factual copy', () => {
  it.each(siteLocales)('matches reviewed site data for %s', (locale) => {
    const expected = reviewedCopy[locale];

    expect(siteContent[locale].homeResults).toEqual({
      label: expected.label,
      title: expected.title,
      description: expected.description,
      summary: expected.summary,
      ctaLabel: expected.cta,
    });
  });

  it.each(siteLocales)('renders reviewed component copy and href for %s', (locale) => {
    const expected = reviewedCopy[locale];
    const html = renderToStaticMarkup(<HomeCaseResultsSplit locale={locale} />);

    expect(html).toContain(expected.label);
    for (const line of expected.title.split('\n')) {
      expect(html).toContain(line);
    }
    expect(html).toContain(expected.description);
    expect(html).toContain(expected.summary);
    expect(html).toContain(`${expected.cta} →`);
    // WO-X1 (EN-16): EN/JA open the write-up of this case; ko/zh-hant the archive.
    expect(html).toContain(
      locale === 'en' || locale === 'ja'
        ? `href="/${locale}/columns/taiwan-gym-injury-lawsuit"`
        : `href="/${locale}/columns"`,
    );
  });

  it.each(siteLocales)('separates first-instance and appeal stages for %s', (locale) => {
    const copy = reviewedCopy[locale];
    const combined = `${copy.title} ${copy.description}`;
    const [firstInstance, appealSettlement] = stageMarkers[locale];

    expect(combined).toContain(firstInstance);
    expect(combined).toContain(appealSettlement);
    expect(combined.indexOf(firstInstance)).toBeLessThan(
      combined.lastIndexOf(appealSettlement),
    );
  });

  it.each(siteLocales)('states no award amount in the %s case copy', (locale) => {
    const copy = reviewedCopy[locale];
    const surfaces = [
      `${copy.title} ${copy.description} ${copy.summary}`,
      JSON.stringify(siteContent[locale].homeResults),
    ];
    if ((locales as readonly string[]).includes(locale)) {
      surfaces.push(
        String(getBuilderNodeText(locale as Locale, 'home-case-results-title', 'text')),
        String(getBuilderNodeText(locale as Locale, 'home-case-results-desc', 'text')),
      );
    }
    for (const surface of surfaces) {
      for (const pattern of awardAmountPatterns) {
        expect(surface, `${locale}: ${pattern}`).not.toMatch(pattern);
      }
    }
  });

  it.each(locales)('keeps builder copy synchronized for %s', (locale) => {
    const expected = reviewedCopy[locale];

    expect(getBuilderNodeText(locale, 'home-case-results-label', 'text')).toBe(
      expected.label,
    );
    expect(getBuilderNodeText(locale, 'home-case-results-title', 'text')).toBe(
      expected.title,
    );
    expect(getBuilderNodeText(locale, 'home-case-results-desc', 'text')).toBe(
      expected.description,
    );
    expect(getBuilderNodeText(locale, 'home-case-results-summary', 'text')).toBe(
      expected.summary,
    );
    expect(getBuilderNodeText(locale, 'home-case-results-cta', 'label')).toBe(
      `${expected.cta} →`,
    );

    const cta = createCaseResultsDecomposedNodes(0, locale, 0).find(
      ({ id }) => id === 'home-case-results-cta',
    );
    expect(cta?.content).toHaveProperty(
      'href',
      locale === 'en' ? '/en/columns/taiwan-gym-injury-lawsuit' : `/${locale}/columns`,
    );
  });

  it('keeps Japanese public-only and excludes unsupported outcome claims', () => {
    expect(locales).toEqual(['ko', 'zh-hant', 'en']);
    expect(locales).not.toContain('ja');

    const publicCopy = siteLocales.flatMap((locale) => {
      const copy = reviewedCopy[locale];
      const data = siteContent[locale].homeResults;
      const html = renderToStaticMarkup(<HomeCaseResultsSplit locale={locale} />);
      return [JSON.stringify(copy), JSON.stringify(data), html];
    });
    const builderCopy = locales.map((locale) =>
      JSON.stringify(createCaseResultsDecomposedNodes(0, locale, 0)),
    );

    expectNoForbiddenClaims([...publicCopy, ...builderCopy].join('\n'));
  });
});
