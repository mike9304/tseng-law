import { describe, expect, it } from 'vitest';
import { siteContent } from '@/data/site-content';
import { siteLocales, type SiteLocale } from '@/lib/locales';

type ReviewedAchievement = Pick<
  (typeof siteContent)[SiteLocale]['achievements']['items'][number],
  'title' | 'amount' | 'summary' | 'tag'
>;

const expectedAchievements = {
  ko: [
    {
      title: '헬스장 부상 손해배상',
      amount: '1심 157만 TWD',
      summary: '1심에서 157만 TWD 배상 판결 후 항소심에서 화해로 종결된 사례.',
      tag: '민사',
    },
    {
      title: '의료분쟁 손해배상',
      amount: '300만 TWD',
      summary: '의료분쟁 피해자 가족이 대학병원으로부터 300만 TWD 손해배상을 받은 사례.',
      tag: '의료',
    },
    {
      title: '마이너스 유가 선물 분쟁',
      amount: '수백만 TWD',
      summary: '2020년 마이너스 유가 선물 사건에서 여러 투자자가 수백만 TWD 규모의 보상을 받은 사례.',
      tag: '금융',
    },
    {
      title: '교통사고 손해배상',
      amount: '290만 TWD',
      summary: '교통사고 피해자가 290만 TWD 손해배상을 받은 사례.',
      tag: '교통사고',
    },
    {
      title: '부부 잔여재산 분배',
      amount: '600만 TWD',
      summary: '일본인 배우자가 전 배우자로부터 600만 TWD의 부부 잔여재산 분배금을 받은 사례.',
      tag: '가사',
    },
    {
      title: '제3자 상대 위자료',
      amount: '30만 TWD',
      summary: '일본인 배우자가 제3자로부터 30만 TWD의 위자료를 받은 사례.',
      tag: '가사',
    },
  ],
  'zh-hant': [
    {
      title: '健身房受傷求償',
      amount: '一審157萬 TWD',
      summary: '一審判賠157萬 TWD，其後於二審和解結案。',
      tag: '民事',
    },
    {
      title: '醫療糾紛求償',
      amount: '300萬 TWD',
      summary: '醫療糾紛被害家屬獲大學醫院賠償300萬 TWD。',
      tag: '醫療',
    },
    {
      title: '負油價期貨爭議',
      amount: '數百萬 TWD',
      summary: '2020年負油價期貨事件中，多名投資人取得數百萬 TWD補償。',
      tag: '金融',
    },
    {
      title: '交通事故求償',
      amount: '290萬 TWD',
      summary: '交通事故被害人取得290萬 TWD損害賠償。',
      tag: '交通',
    },
    {
      title: '夫妻剩餘財產分配',
      amount: '600萬 TWD',
      summary: '日本籍配偶自前配偶取得600萬 TWD夫妻剩餘財產分配。',
      tag: '家事',
    },
    {
      title: '對第三人慰撫金請求',
      amount: '30萬 TWD',
      summary: '日本籍配偶向第三人取得30萬 TWD慰撫金。',
      tag: '家事',
    },
  ],
  en: [
    {
      title: 'Gym Injury Damages',
      amount: 'TWD 1.57M · First Instance',
      summary: 'A TWD 1.57M damages ruling was issued at first instance; the matter later settled on appeal.',
      tag: 'Civil',
    },
    {
      title: 'Medical Dispute Damages',
      amount: 'TWD 3M',
      summary: 'A victim’s family received TWD 3M in damages from a university hospital.',
      tag: 'Medical',
    },
    {
      title: 'Negative-Price Oil Futures',
      amount: 'Multi-Million TWD',
      summary: 'Multiple investors received multi-million-TWD compensation in the 2020 negative-price oil futures matter.',
      tag: 'Finance',
    },
    {
      title: 'Traffic Accident Damages',
      amount: 'TWD 2.9M',
      summary: 'A traffic accident victim received TWD 2.9M in damages.',
      tag: 'Traffic',
    },
    {
      title: 'Marital Residual-Property Distribution',
      amount: 'TWD 6M',
      summary: 'A Japanese spouse received TWD 6M in marital residual-property distribution from a former spouse.',
      tag: 'Family',
    },
    {
      title: 'Third-Party Non-Pecuniary Damages',
      amount: 'TWD 0.3M',
      summary: 'A Japanese spouse received TWD 0.3M in non-pecuniary damages from a third party.',
      tag: 'Family',
    },
  ],
  ja: [
    {
      title: 'ジム負傷の損害賠償',
      amount: '一審157万TWD',
      summary: '一審で157万TWDの損害賠償を認める判決後、控訴審で和解により終結した事例。',
      tag: '民事',
    },
    {
      title: '医療紛争の損害賠償',
      amount: '300万TWD',
      summary: '医療紛争の被害者家族が大学病院から300万TWDの損害賠償を受けた事例。',
      tag: '医療',
    },
    {
      title: '原油先物価格マイナス事件',
      amount: '数百万TWD',
      summary: '2020年の原油先物価格マイナス事件で、複数の投資家が数百万TWDの補償を受けた事例。',
      tag: '金融',
    },
    {
      title: '交通事故の損害賠償',
      amount: '290万TWD',
      summary: '交通事故の被害者が290万TWDの損害賠償を受けた事例。',
      tag: '交通事故',
    },
    {
      title: '夫婦残余財産の分配',
      amount: '600万TWD',
      summary: '日本人配偶者が元配偶者から600万TWDの夫婦残余財産分配を受けた事例。',
      tag: '家事',
    },
    {
      title: '第三者への慰謝料請求',
      amount: '30万TWD',
      summary: '日本人配偶者が第三者から30万TWDの慰謝料を受けた事例。',
      tag: '家事',
    },
  ],
} satisfies Record<SiteLocale, ReviewedAchievement[]>;

const expectedImages = [
  '/images/feature-1.svg',
  '/images/feature-2.svg',
  '/images/feature-3.svg',
  '/images/feature-2.svg',
  '/images/feature-1.svg',
  '/images/feature-3.svg',
];

const expectedHeadings: Record<SiteLocale, { label: string; title: string }> = {
  ko: { label: 'RESULTS', title: '주요 실적' },
  'zh-hant': { label: 'RESULTS', title: '主要實績' },
  en: { label: 'RESULTS', title: 'Representative Outcomes' },
  ja: { label: 'RESULTS', title: '代表的な成果' },
};

const firstInstanceAndAppealTerms: Record<SiteLocale, readonly [string, string]> = {
  ko: ['1심', '항소심에서 화해'],
  'zh-hant': ['一審', '二審和解'],
  en: ['first instance', 'settled on appeal'],
  ja: ['一審', '控訴審で和解'],
};

const trafficTerms: Record<SiteLocale, string> = {
  ko: '교통사고',
  'zh-hant': '交通事故',
  en: 'traffic accident',
  ja: '交通事故',
};

const thirdPartyDamagesTerms: Record<SiteLocale, readonly [string, string]> = {
  ko: ['제3자', '위자료'],
  'zh-hant': ['第三人', '慰撫金'],
  en: ['third party', 'non-pecuniary damages'],
  ja: ['第三者', '慰謝料'],
};

const prohibitedAchievementFraming = [
  /\bwin\b/i,
  /\bvictory\b/i,
  /승소/i,
  /勝訴/i,
  /\bguarantee(?:d|s)?\b/i,
  /보장/i,
  /保證/i,
  /保証/i,
  /success[- ]?rate/i,
  /성공률/i,
  /成功率/i,
];

describe('homepage achievement factual claims', () => {
  it.each(siteLocales)('matches the reviewed six-card contract for %s', (locale) => {
    const { label, title, items } = siteContent[locale].achievements;
    const reviewedItems = items.map(({ title: itemTitle, amount, summary, tag }) => ({
      title: itemTitle,
      amount,
      summary,
      tag,
    }));

    expect({ label, title }).toEqual(expectedHeadings[locale]);
    expect(reviewedItems).toEqual(expectedAchievements[locale]);
    expect(items).toHaveLength(6);
  });

  it.each(siteLocales)('preserves ordered images and the localized archive href for %s', (locale) => {
    const items = siteContent[locale].achievements.items;

    expect(items.map(({ image }) => image)).toEqual(expectedImages);
    expect(items.map(({ href }) => href)).toEqual(Array(6).fill(`/${locale}/columns`));
  });

  it.each(siteLocales)('qualifies the gym amount as first-instance before appeal settlement for %s', (locale) => {
    const card = siteContent[locale].achievements.items[0];
    const combinedCopy = `${card.amount} ${card.summary}`.toLocaleLowerCase(locale);
    const [firstInstanceTerm, appealSettlementTerm] = firstInstanceAndAppealTerms[locale];
    const normalizedAppealSettlementTerm = appealSettlementTerm.toLocaleLowerCase(locale);
    const copyAfterAppealSettlement = combinedCopy.slice(
      combinedCopy.indexOf(normalizedAppealSettlementTerm) + normalizedAppealSettlementTerm.length,
    );

    expect(combinedCopy).toContain(firstInstanceTerm.toLocaleLowerCase(locale));
    expect(combinedCopy).toContain(normalizedAppealSettlementTerm);
    expect(copyAfterAppealSettlement).not.toMatch(/\d/);
  });

  it.each(siteLocales)('maps TWD 2.9 million only to traffic-accident damages for %s', (locale) => {
    const card = siteContent[locale].achievements.items[3];
    const serializedCard = JSON.stringify(card).toLocaleLowerCase(locale);

    expect(serializedCard).toContain(trafficTerms[locale].toLocaleLowerCase(locale));
    expect(serializedCard).not.toMatch(/의료과실|醫療過失|medical (?:malpractice|negligence)|医療過誤/i);
  });

  it.each(siteLocales)('maps TWD 0.3 million only to third-party damages for %s', (locale) => {
    const card = siteContent[locale].achievements.items[5];
    const serializedCard = JSON.stringify(card).toLocaleLowerCase(locale);
    const [thirdPartyTerm, damagesTerm] = thirdPartyDamagesTerms[locale];

    expect(serializedCard).toContain(thirdPartyTerm.toLocaleLowerCase(locale));
    expect(serializedCard).toContain(damagesTerm.toLocaleLowerCase(locale));
    expect(serializedCard).not.toMatch(/화장품|化妝品|cosmetics?|化粧品|trade|거래|交易|取引/i);
  });

  it.each(siteLocales)('excludes prohibited outcome framing from %s achievements', (locale) => {
    const serializedAchievements = JSON.stringify(siteContent[locale].achievements);

    for (const phrase of prohibitedAchievementFraming) {
      expect(serializedAchievements).not.toMatch(phrase);
    }
  });
});
