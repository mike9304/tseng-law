import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { describe, expect, it } from 'vitest';

import { faqContent } from '@/data/faq-content';
import { insightsArchive } from '@/data/insights-archive';
import { serviceAreas } from '@/data/service-details';
import { siteContent } from '@/data/site-content';
import { getSearchIndex } from '@/lib/search';

const slug = 'taiwan-mandatory-employment-period';
const archiveId = 'mandatory-employment';
const locales = ['ko', 'zh-hant', 'en'] as const;
const siteLocales = [...locales, 'ja'] as const;

const expectedTitles = {
  ko: '대만 최소 근무기간 약정: 효력·교육비·위약금 판단 기준',
  'zh-hant': '台灣最低服務年限約定：效力、培訓費用與違約金判斷',
  en: 'Taiwan Minimum Service Period Clauses: Validity, Training Costs, and Repayment',
  ja: '台湾の最低勤務期間条項：有効性・研修費用・返還義務',
} as const;

const expectedArchiveRecords = {
  ko: {
    title: expectedTitles.ko,
    summary:
      '두 가지 선택적 법정 요건과 별도의 합리성 심사를 설명하고, 훈련비와 선급성 급부의 반환을 구분하며, 계약 종료 사유의 책임 귀속이 제15조의1 제4항상 훈련비 반환 책임에 미치는 영향을 살펴봅니다.',
    href: '/ko/insights/taiwan-mandatory-employment-period',
    keywords: ['최소 근무기간', '교육비 반환', '선급성 급부', '책임 귀속'],
  },
  'zh-hant': {
    title: expectedTitles['zh-hant'],
    summary:
      '說明兩項擇一的法定基礎及另行的合理範圍審查，區分培訓費用與預付性給付的返還，並說明契約終止的可歸責性對第15條之1第4項培訓費用返還責任的影響。',
    href: '/zh-hant/insights/taiwan-mandatory-employment-period',
    keywords: ['最低服務年限', '培訓費用', '預付性給付', '責任歸屬'],
  },
  en: {
    title: expectedTitles.en,
    summary:
      'Explains the two alternative statutory bases and the separate reasonable-scope review, distinguishes reimbursement of training expenses from repayment of prepaid benefits, and explains how attribution for the end of employment affects training-expense liability under Article 15-1(4).',
    href: '/en/insights/taiwan-mandatory-employment-period',
    keywords: ['minimum service period', 'training-cost repayment', 'prepaid benefit', 'attribution'],
  },
} as const;

const expectedServiceIntros = {
  ko: '대만의 퇴직금(資遣費) 제도는 한국과 적용 사유와 산정 방식이 다릅니다. 계약 종료의 법적 근거, 신제와 구제(舊制)가 적용되는 근속기간, 예고와 기간 제한을 구분해 검토해야 하며, 법무법인 호정은 한국 기업과 한국인 근로자 양측에 해고·퇴직금·근로계약 분쟁 자문을 제공합니다.',
  'zh-hant':
    '台灣資遣費制度與韓國在適用事由及計算方式上不同，應依契約終止的法定依據、新舊制年資、預告與期間限制分別檢視。昊鼎協助韓國企業及韓籍勞工處理解僱、資遣費與勞動契約爭議。',
  en: 'Taiwan’s severance rules differ from Korea’s in both qualifying grounds and calculation methods. The legal basis for ending the contract, service under the new and old systems, notice requirements, and statutory time limits must be reviewed separately. We advise Korean employers and employees on dismissal, severance, and employment-contract disputes in Taiwan.',
} as const;

const expectedSiteDetails = {
  ko: [
    '퇴직금 신제·구제 적용기간별 산정 및 법정 상한 검토',
    '근로자 측 계약 종료 시 제14조 법정 사유·기간 제한 및 퇴직금 검토',
  ],
  'zh-hant': [
    '依新舊制年資分段計算資遣費並檢視法定上限',
    '勞工依第14條終止契約：法定事由、期間限制與資遣費',
  ],
  en: [
    'Severance calculations under Taiwan’s new and old systems',
    'Worker-initiated termination under Article 14: statutory grounds, time limits, and severance',
  ],
} as const;

const expectedSeveranceFaqRecords = {
  ko: {
    question: '대만에서 근로계약이 종료되면 퇴직금(資遣費)을 항상 지급해야 하나요?',
    answer:
      '항상 그런 것은 아닙니다. 사용자가 대만 노동기준법 제11조, 제13조 단서 또는 제20조 등에 따라 근로계약을 종료하거나, 근로자가 제14조의 법정 사유에 따라 계약을 종료하는 경우에는 원칙적으로 퇴직금(資遣費)을 지급해야 합니다. 반면 제12조에 따른 징계해고에는 원칙적으로 퇴직금이 발생하지 않고, 통상적인 자진 퇴사도 곧바로 지급 대상이 되지는 않습니다. 종료 사유, 예고, 지급기한과 신제·구제 적용을 개별적으로 확인해야 합니다.',
  },
  'zh-hant': {
    question: '在台灣終止勞動契約時，一定要給付資遣費嗎？',
    answer:
      '不一定。雇主依《勞動基準法》第11條、第13條但書或第20條等規定終止契約，或勞工依第14條法定事由終止契約時，原則上應給付資遣費。依第12條懲戒解僱時原則上無須給付，通常的自願離職也不會當然產生資遣費。仍應就終止事由、預告、給付期限及新舊制年資分別確認。',
  },
  en: {
    question: 'Is severance always required when an employment contract ends in Taiwan?',
    answer:
      'Not always. Severance is generally required when an employer terminates under Article 11, the proviso to Article 13, Article 20, or another qualifying provision, and when a worker terminates on a statutory ground under Article 14. It is generally not required for a disciplinary termination under Article 12, and an ordinary voluntary resignation does not automatically trigger severance. The legal ground, notice, payment deadline, and service under the new and old systems must be reviewed separately.',
  },
} as const;

const expectedFaqRecords = {
  ko: {
    question: '대만 근로계약의 최소 근무기간 약정은 자동으로 무효인가요?',
    answer:
      '아닙니다. 대만 근로기준법 제15조의1에 따르면 사용자가 전문기술 훈련을 실시하고 비용을 부담했거나, 근로자가 최소 근무기간을 지키도록 합리적 보상을 제공한 경우에는 최소 근무기간 약정의 법정 요건을 충족할 수 있습니다. 두 요건을 모두 갖추어야 하는 것은 아니지만, 어느 한 요건이 있더라도 훈련 기간과 비용, 대체인력 가능성, 보상의 금액과 범위 등 전체 사정에 비추어 약정이 합리적 범위를 넘지 않아야 합니다.',
  },
  'zh-hant': {
    question: '台灣勞動契約中的最低服務年限約定，是否一律無效？',
    answer:
      '不是。依《勞動基準法》第15條之1，雇主為勞工進行專業技術培訓並負擔其費用，或為使勞工遵守最低服務年限約定而提供合理補償時，約定才可能具備法定基礎。兩者不必同時具備；即使符合其中一項，仍須綜合培訓期間及成本、人力替補可能性、補償額度及範圍等因素，確認約定未逾合理範圍。',
  },
  en: {
    question: 'Is a minimum-service-period clause in Taiwan automatically void?',
    answer:
      "No. Under Article 15-1 of Taiwan's Labor Standards Act, a clause may satisfy the statutory threshold if the employer either provides professional skills training at its own expense or provides reasonable compensation for the worker's commitment to the minimum service period. The two grounds are alternatives, not cumulative requirements. Even if one exists, the period and burden must remain within a reasonable scope under the four statutory factors.",
  },
} as const;

function getRelatedColumn(locale: (typeof siteLocales)[number]) {
  return siteContent[locale].services.items
    .flatMap((item) => item.relatedColumns ?? [])
    .find((column) => column.slug === slug);
}

function getArchiveRecord(locale: (typeof locales)[number]) {
  return insightsArchive[locale].posts.find((post) => post.id === archiveId);
}

function getMinimumServiceFaq(locale: (typeof locales)[number]) {
  return faqContent[locale].find(({ question }) => {
    if (locale === 'ko') return question.includes('최소 근무기간');
    if (locale === 'zh-hant') return question.includes('最低服務年限');
    return question.includes('minimum-service-period');
  });
}

function getSeveranceFaq(locale: (typeof locales)[number]) {
  const minimumServiceIndex = faqContent[locale].findIndex(
    (item) => item === getMinimumServiceFaq(locale),
  );
  return faqContent[locale][minimumServiceIndex - 1];
}

describe('column 014 public reference synchronization', () => {
  it('uses the four exact related-column titles', () => {
    for (const locale of siteLocales) {
      expect(getRelatedColumn(locale), locale).toEqual({
        slug,
        title: expectedTitles[locale],
      });
    }
  });

  it('uses exact localized archive titles, summaries, keywords, and canonical insights hrefs', () => {
    for (const locale of locales) {
      expect(getArchiveRecord(locale), locale).toMatchObject(expectedArchiveRecords[locale]);
    }
  });

  it('propagates exact archive copy and canonical column hrefs to search', () => {
    for (const locale of locales) {
      const result = getSearchIndex(locale).find(
        (item) => item.id === 'insight-post-mandatory-employment',
      );

      expect(result, locale).toMatchObject({
        title: expectedArchiveRecords[locale].title,
        description: expectedArchiveRecords[locale].summary,
        href: `/${locale}/columns/${slug}`,
        tags: expect.arrayContaining([...expectedArchiveRecords[locale].keywords]),
      });
    }
  });

  it('uses the exact article FAQ contract and keeps the two bases alternative', () => {
    for (const locale of locales) {
      expect(getMinimumServiceFaq(locale), locale).toEqual(expectedFaqRecords[locale]);
    }

    expect(expectedFaqRecords.ko.answer).toContain('두 요건을 모두 갖추어야 하는 것은 아니지만');
    expect(expectedFaqRecords['zh-hant'].answer).toContain('兩者不必同時具備');
    expect(expectedFaqRecords.en.answer).toContain('alternatives, not cumulative requirements');

    for (const locale of locales) {
      const answer = getMinimumServiceFaq(locale)?.answer ?? '';
      expect(answer, locale).toMatch(/합리적 범위|合理範圍|reasonable scope/);
      expect(answer, locale).toMatch(/대체인력 가능성|人力替補可能性|four statutory factors/);
    }
  });

  it('uses the corrected labor intros, service details, and severance FAQ contract', () => {
    const labor = serviceAreas.find((area) => area.slug === 'labor');
    expect(labor).toBeDefined();

    for (const locale of locales) {
      expect(labor?.intro[locale], locale).toBe(expectedServiceIntros[locale]);
      const siteLabor = siteContent[locale].services.items.find((item) =>
        item.href.endsWith('#labor'),
      );
      expect(siteLabor?.details?.slice(0, 2), locale).toEqual(expectedSiteDetails[locale]);
      expect(getSeveranceFaq(locale), locale).toEqual(expectedSeveranceFaqRecords[locale]);
    }
  });

  it('provides six aligned labor-law points with the required legal distinctions', () => {
    const labor = serviceAreas.find((area) => area.slug === 'labor');
    expect(labor).toBeDefined();

    for (const locale of locales) {
      expect(labor?.keyPoints[locale], locale).toHaveLength(6);
    }

    const ko = labor?.keyPoints.ko.join('\n') ?? '';
    expect(ko).toMatch(/제11조[\s\S]*제12조[\s\S]*제14조[\s\S]*기간제 계약 만료/);
    expect(ko).toMatch(/신제·구제[\s\S]*0\.5개월분[\s\S]*1개월분/);
    expect(ko).toContain('30일의 기간 제한은 제1항 제1호와 제6호에만 적용됩니다.');
    expect(ko).toContain('두 경우 모두 해당 사정을 안 날부터 30일 이내에 행사해야 하고');
    expect(ko).toContain('그 결과를 안 날부터 30일 이내에도 행사할 수 있으므로');
    expect(ko).toMatch(/전문기술 훈련[\s\S]*비용을 부담했거나[\s\S]*합리적 보상/);
    expect(ko).toMatch(/원본 형식으로 적법하게 보존[\s\S]*녹음은 언제나 적법하거나 증거로 채택되는 것이 아니/);
    expect(ko).toMatch(/3개월 이상 1년 미만은 10일[\s\S]*1년 이상 3년 미만은 20일[\s\S]*3년 이상은 30일/);

    const zh = labor?.keyPoints['zh-hant'].join('\n') ?? '';
    expect(zh).toMatch(/第11條[\s\S]*第12條[\s\S]*第14條[\s\S]*定期契約期滿/);
    expect(zh).toMatch(/新制、舊制[\s\S]*二分之一個月[\s\S]*一個月平均工資/);
    expect(zh).toMatch(/30日期間限制僅適用於第1項第1款及第6款/);
    expect(zh).toContain('兩款均應自知悉該情形之日起30日內行使');
    expect(zh).toContain('另得自知悉該結果之日起30日內行使');
    expect(zh).toMatch(/專業技術培訓[\s\S]*負擔費用[\s\S]*或[\s\S]*合理補償/);
    expect(zh).toMatch(/合法原始格式[\s\S]*錄音並非在任何情況都合法/);
    expect(zh).toMatch(/滿3個月未滿1年者應於10日前[\s\S]*滿1年未滿3年者於20日前[\s\S]*滿3年以上者於30日前/);

    const en = labor?.keyPoints.en.join('\n') ?? '';
    expect(en).toMatch(/Article 11[\s\S]*Article 12[\s\S]*Article 14[\s\S]*fixed-term contract/);
    expect(en).toMatch(/new and old systems[\s\S]*one-half month[\s\S]*one month/);
    expect(en).toMatch(/30-day limit applies only to paragraph 1, subparagraphs 1 and 6/);
    expect(en).toContain('In both cases, the period runs from knowledge of the relevant circumstances');
    expect(en).toContain('may also terminate within 30 days after learning of that result');
    expect(en).toMatch(/employer-funded professional skills training or reasonable compensation/);
    expect(en).toMatch(/original form[\s\S]*Recording is not invariably lawful or admissible/);
    expect(en).toMatch(/10 days’ notice[\s\S]*20 days’ notice[\s\S]*30 days’ notice/);

    for (const copy of [ko, zh, en]) {
      expect(copy).toMatch(/무효|無效|void/);
      expect(copy).toMatch(/책임을 돌릴 수 없는|不可歸責|not attributable/);
      expect(copy).toMatch(/훈련비 반환 책임|返還培訓費用之責任|reimbursement of training expenses/);
    }
  });

  it('keeps permanent column and insights aliases in every public locale', async () => {
    const configPath = path.join(process.cwd(), 'next.config.mjs');
    const configModule = await import(pathToFileURL(configPath).href);
    const redirects = await configModule.default.redirects();

    for (const locale of siteLocales) {
      expect(redirects).toContainEqual({
        source: `/${locale}/columns/mandatory-employment`,
        destination: `/${locale}/columns/${slug}`,
        permanent: true,
      });
      expect(redirects).toContainEqual({
        source: `/${locale}/insights/mandatory-employment`,
        destination: `/${locale}/columns/${slug}`,
        permanent: true,
      });
    }
  });

  it('removes stale titles, figures, cumulative rules, and mandatory-recording advice', () => {
    const runtimeFiles = [
      'src/data/service-details.ts',
      'src/data/site-content.ts',
      'src/data/faq-content.ts',
      'src/data/insights-archive.ts',
    ].map((file) => fs.readFileSync(path.join(process.cwd(), file), 'utf8'));
    const synchronizedRuntime = runtimeFiles.join('\n');

    for (const staleLiteral of [
      "'의무재직 약정 문제'",
      "'대만 의무재직 약정 문제'",
      "'最低服務年限爭議'",
      "'台灣最低服務年限條款爭議'",
      "'Mandatory Employment Term Issues'",
      "'Disputes Over Mandatory Employment Period Clauses in Taiwan'",
      "'台湾の最低勤務期間条項'",
      '2024',
      '183 TWD',
      '183TWD',
      '27,470',
      '거의 항상 무효',
      '幾乎一律無效',
      'strict legal conditions',
      '반드시 녹음',
      '務必錄音',
      '대만의 퇴직금 제도는 한국과 근본적으로 다릅니다.',
      '台灣資遣費制度與韓國根本不同。',
      'Taiwan severance rules differ significantly from Korea.',
      '해고 시 자산비(資遣費) 지급이 원칙',
      '資遣時原則上需支付資遣費',
      'severance pay is generally required upon termination',
    ]) {
      expect(synchronizedRuntime).not.toContain(staleLiteral);
    }

    expect(synchronizedRuntime).not.toMatch(
      /전문(?:기술| 직업)훈련[^.\n]{0,80}(?:\+|그리고|및)[^.\n]{0,80}합리적 보상[^.\n]{0,80}(?:모두|동시)/,
    );
    expect(synchronizedRuntime).not.toMatch(
      /專業技術?(?:培訓|訓練)[^。\n]{0,80}(?:及|並且|與)[^。\n]{0,80}合理(?:補償|對價)[^。\n]{0,80}(?:同時|均須)/,
    );
  });
});
