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
      amount: '1심 승소',
      summary: '1심에서 승소한 뒤 항소심에서 화해로 종결된 사례.',
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
      amount: '손해배상 확보',
      summary: '교통사고 피해자가 손해배상을 받은 사례.',
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
      amount: '一審勝訴',
      summary: '一審勝訴，二審和解結案。',
      tag: '民事',
    },
    {
      title: '醫療糾紛求償',
      amount: '新台幣300萬元',
      summary: '醫療糾紛被害人家屬獲大學附設醫院賠償新台幣300萬元。',
      tag: '醫療',
    },
    {
      title: '負油價期貨爭議',
      amount: '新台幣數百萬元',
      summary: '2020年負油價期貨事件中，多名投資人獲得新台幣數百萬元補償。',
      tag: '金融',
    },
    {
      title: '交通事故求償',
      amount: '取得損害賠償',
      summary: '交通事故被害人取得損害賠償。',
      tag: '交通',
    },
    {
      title: '夫妻剩餘財產分配',
      amount: '新台幣600萬元',
      summary: '日本籍配偶向前配偶請求夫妻剩餘財產分配，獲得新台幣600萬元。',
      tag: '家事',
    },
    {
      title: '向第三人請求慰撫金',
      amount: '新台幣30萬元',
      summary: '日本籍配偶向第三人請求慰撫金，獲賠新台幣30萬元。',
      tag: '家事',
    },
  ],
  en: [
    {
      title: 'Gym Injury Damages',
      amount: 'First-instance win',
      summary: 'Won at first instance; the matter later settled on appeal.',
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
      amount: 'Damages recovered',
      summary: 'A traffic accident victim recovered damages.',
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
      amount: '一審勝訴',
      summary: '一審で勝訴した後、控訴審で和解により終結した事例。',
      tag: '民事',
    },
    {
      title: '医療紛争の損害賠償',
      amount: '300万TWD',
      summary: '医療紛争の被害者家族が大学病院からNT$300万の損害賠償を受けた事例。',
      tag: '医療',
    },
    {
      title: '原油先物価格マイナス事件',
      amount: '数百万TWD',
      summary: '2020年の原油先物価格マイナス事件で、複数の投資家がNT$数百万の補償を受けた事例。',
      tag: '金融',
    },
    {
      title: '交通事故の損害賠償',
      amount: '損害賠償を獲得',
      summary: '交通事故の被害者が損害賠償を受けた事例。',
      tag: '交通事故',
    },
    {
      title: '夫婦残余財産の分配',
      amount: '600万TWD',
      summary: '日本人配偶者が元配偶者からNT$600万の夫婦残余財産分配を受けた事例。',
      tag: '家事',
    },
    {
      title: '第三者への慰謝料請求',
      amount: '30万TWD',
      summary: '日本人配偶者が第三者からNT$30万の慰謝料を受けた事例。',
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

/**
 * User decision 2026-09-28 (1A, Taiwan attorney-advertising ethics): the gym
 * card drops its award amount and says only that the claim was won at first
 * instance and later settled on appeal. These are the only win phrases the
 * achievements may carry; every other win framing stays prohibited.
 */
const approvedFirstInstanceWinPhrases: Record<SiteLocale, readonly string[]> = {
  ko: ['1심에서 승소', '1심 승소'],
  'zh-hant': ['一審勝訴'],
  en: ['First-instance win', 'Won at first instance'],
  ja: ['一審で勝訴', '一審勝訴'],
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

  it.each(siteLocales)('describes the gym case as a first-instance win settled on appeal, without an award amount, for %s', (locale) => {
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
    expect(JSON.stringify(card)).not.toMatch(/\d{2,}|\d[.,]\d|TWD|NT\$|[0-9]\s*(?:萬|万|만)/i);
    expect(approvedFirstInstanceWinPhrases[locale].some((phrase) => combinedCopy.includes(
      phrase.toLocaleLowerCase(locale),
    ))).toBe(true);
  });

  it.each(siteLocales)('keeps the approved first-instance win phrase on the gym card only for %s', (locale) => {
    const [gymCard, ...otherCards] = siteContent[locale].achievements.items;
    const phrases = approvedFirstInstanceWinPhrases[locale];

    expect(phrases.some((phrase) => JSON.stringify(gymCard).includes(phrase))).toBe(true);
    for (const card of otherCards) {
      for (const phrase of phrases) {
        expect(JSON.stringify(card)).not.toContain(phrase);
      }
    }
  });

  it.each(siteLocales)('keeps the traffic-accident damages card without an award amount for %s', (locale) => {
    const card = siteContent[locale].achievements.items[3];
    const serializedCard = JSON.stringify(card).toLocaleLowerCase(locale);

    // User decision 2026-09-28 (2A): no award amount on this card, only the description.
    expect(serializedCard).not.toMatch(/290|2\.9|\d+\s*(?:만|萬|万|m\b|million)/i);

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
    // Checked before the approved phrases are stripped, so "1심 승소율" cannot hide as "율".
    expect(JSON.stringify(siteContent[locale].achievements)).not.toMatch(/승소율|勝訴率|勝率|win rate/i);
    const serializedAchievements = approvedFirstInstanceWinPhrases[locale].reduce(
      (serialized, phrase) => serialized.split(phrase).join(''),
      JSON.stringify(siteContent[locale].achievements),
    );

    for (const phrase of prohibitedAchievementFraming) {
      expect(serializedAchievements).not.toMatch(phrase);
    }
  });
});
