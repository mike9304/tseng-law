import { describe, expect, it } from 'vitest';
import { siteContent } from '@/data/site-content';
import { siteLocales, type SiteLocale } from '@/lib/locales';

const expectedStats = {
  ko: {
    title: '공식 프로필로 확인하는 국제 업무 기반',
    description:
      '대만 4개 사무소와 중국어·한국어·일본어 실무 대응, 7개 주요 업무 분야, TOPIK 6급·JLPT N1 자격을 기준으로 정리했습니다.',
    highlightWords: [
      '대만 4개 사무소',
      '중국어',
      '한국어',
      '일본어',
      '7개 주요 업무 분야',
      'TOPIK 6급',
      'JLPT N1',
    ],
    items: [
      { target: 4, label: '대만 사무소' },
      { target: 3, label: '실무 대응 언어' },
      { target: 7, label: '주요 업무 분야' },
      { target: 2, label: '최상위급 어학 자격' },
    ],
  },
  'zh-hant': {
    title: '從官方資料看跨境服務基礎',
    description:
      '依官方律師簡介整理：4個台灣辦公據點、中文／韓文／日文3種業務溝通語言、7項主要執業領域，以及TOPIK 6級與JLPT N1兩項最高級別語言資格。',
    highlightWords: [
      '4個台灣辦公據點',
      '中文',
      '韓文',
      '日文',
      '7項主要執業領域',
      'TOPIK 6級',
      'JLPT N1',
    ],
    items: [
      { target: 4, label: '台灣辦公據點' },
      { target: 3, label: '業務溝通語言' },
      { target: 7, label: '主要執業領域' },
      { target: 2, label: '最高級別語言資格' },
    ],
  },
  en: {
    title: 'Cross-Border Practice at a Glance',
    description:
      'Based on the official attorney profile: four Taiwan offices, three working languages—Chinese, Korean, and Japanese—seven principal practice areas, and two top-level language qualifications, TOPIK Level 6 and JLPT N1.',
    highlightWords: [
      'four Taiwan offices',
      'three working languages',
      'Chinese',
      'Korean',
      'Japanese',
      'seven principal practice areas',
      'TOPIK Level 6',
      'JLPT N1',
    ],
    items: [
      { target: 4, label: 'Taiwan Offices' },
      { target: 3, label: 'Working Languages' },
      { target: 7, label: 'Principal Practice Areas' },
      { target: 2, label: 'Top-Level Language Qualifications' },
    ],
  },
  ja: {
    title: '公式プロフィールで見る国際業務の基盤',
    description:
      '公式弁護士プロフィールに基づき、台湾4拠点、中国語・韓国語・日本語の3言語、7つの主要取扱分野、TOPIK 6級・JLPT N1の2つの最上位級資格をまとめています。',
    highlightWords: [
      '台湾4拠点',
      '中国語',
      '韓国語',
      '日本語',
      '7つの主要取扱分野',
      'TOPIK 6級',
      'JLPT N1',
    ],
    items: [
      { target: 4, label: '台湾の事務所' },
      { target: 3, label: '業務対応言語' },
      { target: 7, label: '主要取扱分野' },
      { target: 2, label: '最上位級の語学資格' },
    ],
  },
} satisfies Record<
  SiteLocale,
  Pick<(typeof siteContent)[SiteLocale]['stats'], 'title' | 'description' | 'highlightWords' | 'items'>
>;

const requiredDescriptionTerms: Record<SiteLocale, readonly string[]> = {
  ko: ['대만 4개 사무소', '중국어', '한국어', '일본어', '7개 주요 업무 분야', 'TOPIK 6급', 'JLPT N1'],
  'zh-hant': ['4個台灣辦公據點', '中文', '韓文', '日文', '7項主要執業領域', 'TOPIK 6級', 'JLPT N1'],
  en: [
    'four Taiwan offices',
    'three working languages',
    'Chinese',
    'Korean',
    'Japanese',
    'seven principal practice areas',
    'TOPIK Level 6',
    'JLPT N1',
  ],
  ja: ['台湾4拠点', '中国語', '韓国語', '日本語', '7つの主要取扱分野', 'TOPIK 6級', 'JLPT N1'],
};

const unsupportedClaims = [
  /10\+/i,
  /500\+/i,
  /"target":10\b/i,
  /"target":500\b/i,
  /five offices/i,
  /5 Office Locations/i,
  /5 辦公據點/i,
  /5 オフィス/i,
  /four languages/i,
  /4 Languages/i,
  /4 語言/i,
  /4 対応言語/i,
  /원스톱/i,
  /一站式/i,
  /one-stop/i,
  /ワンストップ/i,
  /success rate/i,
  /성공률/i,
  /成功率/i,
  /outcome/i,
  /case count/i,
  /response time/i,
  /승소/i,
  /사건 수/i,
  /응답 시간/i,
  /勝訴/i,
  /案件數/i,
  /回覆時間/i,
  /案件数/i,
  /対応時間/i,
  /guarantee/i,
  /보장/i,
  /保證/i,
  /保証/i,
  /matters handled/i,
  /처리 사건/i,
  /處理案件/i,
  /取扱案件/i,
];

describe('homepage stats factual claims', () => {
  it.each(siteLocales)('matches the reviewed exact contract for %s', (locale) => {
    const { label, ...stats } = siteContent[locale].stats;

    expect(label).toBe('ABOUT');
    expect(stats).toEqual(expectedStats[locale]);
  });

  it.each(siteLocales)('uses four distinct unsuffixed factual counters for %s', (locale) => {
    const items = siteContent[locale].stats.items;

    expect(items.map(({ target }) => target)).toEqual([4, 3, 7, 2]);
    expect(items.every((item) => !('suffix' in item))).toBe(true);
    expect(new Set(items.map(({ label }) => label)).size).toBe(items.length);
  });

  it.each(siteLocales)('states the factual basis explicitly in the %s description', (locale) => {
    const { description } = siteContent[locale].stats;

    for (const term of requiredDescriptionTerms[locale]) {
      expect(description).toContain(term);
    }
  });

  it.each(siteLocales)('excludes unsupported claims from the %s stats record', (locale) => {
    const serializedStats = JSON.stringify(siteContent[locale].stats);

    for (const claim of unsupportedClaims) {
      expect(serializedStats).not.toMatch(claim);
    }
  });
});
