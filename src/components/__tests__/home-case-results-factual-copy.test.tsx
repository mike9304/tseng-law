import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HomeCaseResultsSplit from '../HomeCaseResultsSplit';
import { siteContent } from '@/data/site-content';
import { createCaseResultsDecomposedNodes } from '@/lib/builder/canvas/decompose-case-results';
import { locales, siteLocales, type Locale, type SiteLocale } from '@/lib/locales';

const reviewedCopy = {
  ko: {
    label: '사례 분석',
    title: '한국 유학생 헬스장 부상 사건\n1심 157만 TWD 판결·항소심 화해',
    description:
      '대만 헬스장에서 트레이너의 지도를 받아 운동하던 중 다친 한국인 대학생이 손해배상을 청구한 사건입니다. 1심에서 157만 TWD의 배상을 인정하는 판결이 내려졌고, 이후 항소심에서 당사자 간 화해로 종결되었습니다.',
    summary:
      '사건 결과는 구체적인 사실관계와 증거에 따라 달라질 수 있으며, 이 사례는 과거 한 사건의 진행 경과를 소개합니다.',
    cta: '소송사례 분석 보기',
  },
  'zh-hant': {
    label: '案例解析',
    title: '韓國留學生健身房受傷案\n一審判賠157萬TWD，二審和解',
    description:
      '韓國大學生在台灣健身房接受教練指導運動時受傷，因而提起損害賠償請求。一審判決賠償157萬TWD，其後於二審由雙方和解結案。',
    summary:
      '案件結果會因具體事實與證據而異；本案例僅說明一件過往案件的處理經過。',
    cta: '查看訴訟案例',
  },
  en: {
    label: 'CASE STUDY',
    title: 'Korean Student Gym Injury Case\nTWD 1.57M Ruling, Then Appeal Settlement',
    description:
      'A Korean university student sought damages after being injured while training under an instructor’s supervision at a Taiwan gym. The first-instance court issued a TWD 1.57 million damages ruling; the case later concluded through a settlement on appeal.',
    summary:
      'Outcomes depend on the specific facts and evidence; this case study describes the course of one past matter.',
    cta: 'View Case Studies',
  },
  ja: {
    label: '事例紹介',
    title: '韓国人留学生のジム負傷事件\n一審157万TWD判決後、控訴審で和解',
    description:
      '台湾のジムでトレーナーの指導を受けて運動中に負傷した韓国人大学生が、損害賠償を請求した事例です。一審では157万TWDの損害賠償を認める判決が出され、その後、控訴審で当事者間の和解により終結しました。',
    summary:
      '結果は具体的な事実関係や証拠により異なります。本事例は、過去の一案件の経過を紹介するものです。',
    cta: '取扱事例を見る',
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

const stageMarkers: Record<SiteLocale, [string, string]> = {
  ko: ['1심 157만 TWD', '항소심에서 당사자 간 화해'],
  'zh-hant': ['一審判決賠償157萬TWD', '二審由雙方和解'],
  en: ['first-instance court issued a TWD 1.57 million', 'settlement on appeal'],
  ja: ['一審では157万TWD', '控訴審で当事者間の和解'],
};

const forbiddenClaims = [
  '승소',
  '勝訴',
  'First-Instance Win',
  /\bwin\b/i,
  /\bvictory\b/i,
  /success rate/i,
  /guarantee/i,
  /same result/i,
  /항소심[^。.]*157만/,
  /二審[^。.]*157萬/,
  /appeal[^.;]*1\.57/i,
  /控訴審[^。]*157万/,
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
    expect(html).toContain(`href="/${locale}/columns"`);
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
    expect(cta?.content).toHaveProperty('href', `/${locale}/columns`);
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
