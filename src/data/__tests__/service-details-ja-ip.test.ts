import { describe, expect, it } from 'vitest';

import {
  getJapaneseServiceDetail,
  japaneseServiceDetails,
} from '@/data/service-details-ja';

const expectedIp = {
  title: '台湾の知的財産・金融紛争',
  subtitle:
    '商標・特許・著作権の保護と、金融商品・投資契約をめぐる民事紛争への対応を日本語で支援',
  intro:
    '昊鼎国際法律事務所は、台湾における商標・特許・著作権の取得・管理および侵害対応、金融商品・投資契約をめぐる民事紛争について、日本語で支援します。対象となる権利・契約、当事者の立場、適用される制度および利用できる手続は案件ごとに異なるため、出願・取引・紛争の各段階で資料と証拠を確認し、対応方針を整理します。',
  keyPoints: [
    '台湾における商標権は登録によって発生し、原則として先願主義と属地主義が採用されています。韓国その他の国・地域で登録された商標も、その登録だけで台湾における商標権が生じるものではありません。台湾で使用を予定する名称・ロゴと指定商品・役務を整理し、先行商標の調査、出願する区分、使用時期および登録可能性を検討します。出願後は、台湾の経済部智慧財産局による方式・実体審査を経るため、補正や意見書が必要となる場合もあります。',
    '台湾商標法第69条に基づき、商標権者は侵害の停止・予防を請求でき、故意または過失による侵害について損害賠償を請求できる場合があります。侵害品等の廃棄請求や、同法第72条・第75条に基づく税関における輸出入の差止めには、それぞれ要件、担保、通知、期限その他の手続があります。警告書、行政手続、民事・刑事手続または税関措置のどれを用いるかは、登録範囲、使用態様、混同のおそれ、証拠および事業への影響を確認して判断し、差止めや損害賠償が当然に認められるものではありません。',
    '特許は商標・著作権とは別の制度です。台湾特許法第31条では、同一の発明について複数の特許出願がある場合、優先権に関する規定等を前提に、原則として最先の出願人のみが特許を受けることができます。公開・販売・共同開発の前に、発明者・出願人、権利帰属、先行技術、出願時期、優先権および秘密保持を確認し、侵害が疑われる場合には、特許請求の範囲、対象製品・方法、実施行為、特許の有効性および技術資料を個別に検討します。',
    '台湾著作権法第10条では、著作者は著作物の完成時に著作権を取得し、登録を権利発生の要件としていません。ただし、同法第10条の1により保護は表現に及び、基礎となる思想、手順、工程、システム、操作方法、概念、原理または発見には及びません。著作者・権利者、制作過程、契約上の帰属、利用許諾の範囲および原稿、制作データその他の資料を確認し、要件を満たす場合には、同法第84条の侵害停止・予防、第88条の損害賠償、または第90条の1の税関措置を検討します。',
    '金融商品・投資契約をめぐる紛争では、まず当事者と取引の性質を区別します。金融消費者保護法上の金融消費者と金融サービス事業者との間の、金融商品・サービスをめぐる民事紛争に該当する場合には、勧誘・広告、適合性の確認、重要事項とリスクの説明、契約内容および損害を確認し、原則として金融サービス事業者に対する苦情申立てを先に行ったうえで、要件と期限に応じて金融消費者紛争を扱う評議機関への評議申立てを検討します。一般の投資契約や事業者間取引はこの手続の対象外となる場合があるため、契約条項、資金の流れ、履行状況、損害、交渉・訴訟その他の手段を個別に整理します。',
  ],
};

describe('Japanese IP and financial-disputes service-detail content', () => {
  it('preserves the reviewed title, subtitle, intro, and five ordered points exactly', () => {
    expect(getJapaneseServiceDetail('ip')).toEqual(expectedIp);
    expect(getJapaneseServiceDetail('ip')?.keyPoints).toHaveLength(5);
  });

  it('contains five substantial Japanese points without fallback copy', () => {
    const ip = getJapaneseServiceDetail('ip');
    const serialized = JSON.stringify(ip);

    expect(ip?.keyPoints).toHaveLength(5);
    for (const point of ip?.keyPoints ?? []) {
      expect(point.length).toBeGreaterThan(120);
    }

    expect(serialized).not.toMatch(/[\u3131-\u318e\uac00-\ud7a3]/u);
    expect(serialized).not.toMatch(
      /IP & Financial Disputes|Intellectual Property|Hovering supports|법무법인 호정/i,
    );
  });

  it('retains the reviewed trademark and customs qualifications', () => {
    const serialized = JSON.stringify(getJapaneseServiceDetail('ip'));

    for (const required of [
      '先願主義',
      '属地主義',
      'その登録だけで台湾における商標権が生じるものではありません',
      '経済部智慧財産局による方式・実体審査',
      '台湾商標法第69条',
      '故意または過失',
      '第72条・第75条',
      '担保',
      '期限',
      '差止めや損害賠償が当然に認められるものではありません',
    ]) {
      expect(serialized).toContain(required);
    }
  });

  it('retains the reviewed patent and copyright distinctions', () => {
    const serialized = JSON.stringify(getJapaneseServiceDetail('ip'));

    for (const required of [
      '特許は商標・著作権とは別の制度です',
      '台湾特許法第31条',
      '同一の発明',
      '優先権に関する規定等を前提に',
      '最先の出願人',
      '台湾著作権法第10条',
      '著作物の完成時',
      '登録を権利発生の要件としていません',
      '第10条の1',
      '保護は表現に及び',
      '思想',
      '操作方法',
      '第84条',
      '第88条',
      '第90条の1',
    ]) {
      expect(serialized).toContain(required);
    }
  });

  it('qualifies financial-consumer procedures and ordinary investments', () => {
    const serialized = JSON.stringify(getJapaneseServiceDetail('ip'));

    for (const required of [
      '金融消費者保護法上の金融消費者',
      '金融サービス事業者との間',
      '民事紛争に該当する場合',
      '勧誘・広告',
      '適合性の確認',
      '重要事項とリスクの説明',
      '苦情申立てを先に行ったうえで',
      '評議機関への評議申立て',
      '一般の投資契約や事業者間取引はこの手続の対象外となる場合',
    ]) {
      expect(serialized).toContain(required);
    }
  });

  it('excludes automatic, overbroad, guaranteed, fallback, and wrong-identity copy', () => {
    const serialized = JSON.stringify(getJapaneseServiceDetail('ip'));

    for (const forbidden of [
      '外国登録だけで台湾でも自動的に保護',
      '韓国の商標登録は台湾でも有効',
      '商標を出願すれば必ず登録',
      '必ず差止めできます',
      '損害賠償が自動的に認められます',
      'すべての金融紛争',
      'あらゆる投資紛争',
      '株主支配権',
      'ワンストップで解決',
      '結果を保証',
      '必ず勝訴',
      '曾俊瑋',
      'Tseng Jun-Wei',
      '법무법인 호정',
    ]) {
      expect(serialized).not.toContain(forbidden);
    }

    expect(serialized).not.toMatch(/[\u3131-\u318e\uac00-\ud7a3]/u);
    expect(serialized).not.toMatch(
      /IP & Financial Disputes|Intellectual Property|Hovering supports/i,
    );
  });

  it('keeps the approved record and lookup prototype-safe', () => {
    expect(japaneseServiceDetails.ip).toEqual(expectedIp);
    expect(getJapaneseServiceDetail('__proto__')).toBeUndefined();
    expect(getJapaneseServiceDetail('constructor')).toBeUndefined();
  });
});
