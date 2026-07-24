import { describe, expect, it } from 'vitest';

import {
  getJapaneseServiceDetail,
  japaneseServiceDetails,
} from '@/data/service-details-ja';

const expectedCivil = {
  title: '台湾の民事訴訟・損害賠償',
  subtitle: '契約紛争、損害賠償、消費者トラブルなど、台湾の民事案件を日本語で支援',
  intro:
    '昊鼎国際法律事務所は、台湾における契約紛争、損害賠償、消費者トラブルなどの民事案件について、事実関係の整理、交渉、訴訟対応まで日本語で支援します。請求できる損害の範囲や手続期限は事案ごとに異なるため、初動での証拠確保と法的見通しの確認が重要です。',
  keyPoints: [
    '民法上の不法行為では、故意または過失による違法な権利侵害、損害および因果関係などが争点になります。損害項目としては、医療費、介護費、交通費、休業損害、逸失利益、慰謝料などが問題となり、請求の可否と範囲は受傷内容、治療経過および証拠によって異なります。',
    '交通事故では、現場写真・映像、相手方情報、診断書、領収書などを早期に保存することが重要です。台湾の「道路交通事故処理規則」（道路交通事故處理辦法）では、当事者または利害関係人は、警察機関に対し、事故発生日の7日後から現場図・現場写真の交付を、30日後から「道路交通事故初期分析判断表」（道路交通事故初步分析研判表）の交付を申請できます。同表は初期的な分析資料であり、責任の最終確定を直接意味するものではありません。',
    '消費者保護法に基づく訴訟では、事業者の故意による損害については損害額の5倍以下、重大な過失については3倍以下、過失については1倍以下の懲罰的損害賠償を請求できる場合があります。適用を受けるには、当該紛争に同法が適用されることなど、所定の要件を満たす必要があります。',
    '同一の事案について、刑事告訴と民事請求を併せて検討する場合もあります。ただし、告訴の可否と期間制限、民事請求の消滅時効、刑事付帯民事訴訟（刑事附帶民事訴訟）の利用可否および費用負担は、請求原因と手続段階に応じて個別に確認する必要があります。',
    '示談・和解は、当事者が互いに譲歩し、紛争を終結させ、またはその発生を防止するための契約です。署名前に、対象となる請求、権利放棄の範囲、支払条件および違反時の対応を確認し、治療継続中の傷害については、将来発生し得る損害も検討する必要があります。',
  ],
};

describe('Japanese civil service-detail content', () => {
  it('preserves the reviewed title, subtitle, intro, and five ordered points exactly', () => {
    expect(getJapaneseServiceDetail('civil')).toEqual(expectedCivil);
    expect(getJapaneseServiceDetail('civil')?.keyPoints).toHaveLength(5);
  });

  it('contains five substantial Japanese points without fallback copy', () => {
    const civil = getJapaneseServiceDetail('civil');
    const serialized = JSON.stringify(civil);

    expect(civil?.keyPoints).toHaveLength(5);
    for (const point of civil?.keyPoints ?? []) {
      expect(point.length).toBeGreaterThan(80);
    }

    expect(serialized).not.toMatch(/[\u3131-\u318e\uac00-\ud7a3]/u);
    expect(serialized).not.toMatch(
      /Civil Litigation|Legal support for civil disputes|Hovering supports|법무법인 호정/i,
    );
  });

  it('retains every reviewed legal distinction and qualifier', () => {
    const serialized = JSON.stringify(getJapaneseServiceDetail('civil'));

    for (const required of [
      '故意または過失による違法な権利侵害',
      '損害および因果関係',
      '7日後',
      '30日後',
      '初步分析研判表',
      '責任の最終確定を直接意味するものではありません',
      '5倍以下',
      '3倍以下',
      '1倍以下',
      '当該紛争に同法が適用されること',
      '所定の要件',
      '請求原因と手続段階に応じて個別に確認',
      '刑事付帯民事訴訟（刑事附帶民事訴訟）',
      '当事者が互いに譲歩し、紛争を終結',
      '権利放棄の範囲',
      '治療継続中',
    ]) {
      expect(serialized).toContain(required);
    }
  });

  it('excludes unsupported outcomes, overbroad procedures, and unrelated services', () => {
    const serialized = JSON.stringify(getJapaneseServiceDetail('civil'));

    for (const forbidden of [
      '157万',
      '1.57M',
      '4段階',
      '実質的な最終判断',
      '刑事告訴期限は6か月',
      '告訴期限は6か月',
      '裁判費用を支払う必要がありません',
      '裁判費用は免除',
      '必ず請求できます',
      '必ず勝訴',
      '保証します',
      '最低勤務期間',
      '残余財産差額分配請求',
      '親権',
      '相続',
      '曾俊瑋',
      '법무법인 호정',
    ]) {
      expect(serialized).not.toContain(forbidden);
    }
  });

  it('keeps the approved record and lookup prototype-safe', () => {
    expect(japaneseServiceDetails.civil).toEqual(expectedCivil);
    expect(getJapaneseServiceDetail('__proto__')).toBeUndefined();
    expect(getJapaneseServiceDetail('constructor')).toBeUndefined();
  });
});
