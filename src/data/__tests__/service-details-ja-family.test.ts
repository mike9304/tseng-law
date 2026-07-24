import { describe, expect, it } from 'vitest';

import {
  getJapaneseServiceDetail,
  japaneseServiceDetails,
} from '@/data/service-details-ja';

const expectedFamily = {
  title: '台湾の家事事件・国際家族法務',
  subtitle: '離婚、未成年の子、夫婦財産、相続をめぐる国際家事事件を日本語で支援',
  intro:
    '昊鼎国際法律事務所は、台湾に関係する国際結婚に伴う離婚、未成年の子をめぐる取決め、夫婦財産、相続その他の家事事件について、事実関係を整理するとともに、関係する国・地域を特定し、戸政手続、交渉、調停・訴訟まで日本語で支援します。適用法、国際裁判管轄、外国で成立した離婚や外国裁判所の判断の台湾における取扱い、必要書類は事案ごとに異なるため、婚姻・居住・国籍・財産・子の生活状況を確認したうえで方針を検討します。',
  keyPoints: [
    '台湾法上の協議離婚（両願離婚）は、書面による合意、2人以上の証人の署名および戸政機関での離婚登記が必要です。合意が成立しない場合や裁判所の関与が必要な場合には、裁判所の調停または裁判上の離婚を検討します。家事事件では、法律上の例外を除き、裁判による解決を求める前に裁判所の調停を経ることとされているため、利用できる手続とその成立要件を個別に確認します。',
    '国際結婚を含む案件では、台湾の裁判所に国際裁判管轄があるかという問題と、離婚、夫婦財産、未成年子または相続にどの国・地域の法が適用されるかという問題とを分けて検討する必要があります。当事者の国籍、住所・常居所、婚姻・離婚の登録状況、外国での裁判手続の状況や裁判所の判断の有無、送達方法ならびに外国文書の認証・翻訳などを確認し、台湾および案件に関係するその他の国・地域で必要となる手続を整理します。',
    '離婚後の未成年の子については、一般に「親権」と呼ばれる未成年子の権利義務の行使・負担を、父母の一方が単独で担うか、双方が共同で担うかを協議します。協議が成立しない場合または協議内容が子に不利益となる場合、裁判所は子の最善の利益を基準に、子の年齢・健康・意思・人格の発達上の必要性、父母の生活状況、監護・養育の意欲および態度、子との情緒的結び付き、父母の一方が他方による未成年子に関する権利義務の行使・負担を妨げているかなどを総合して判断します。生活の継続性や安定性も考慮要素となり得ますが、いわゆる「最小変動原則」のみで結論が決まるものではありません。',
    '台湾の法定財産制が適用される場合、法定財産制が終了した時に、夫婦それぞれの現存する婚姻後財産から婚姻中の債務を控除し、残余財産の差額を原則として平均分配します。ただし、相続その他の無償取得財産および慰謝料は除外され、平均分配が公平を欠く場合には、裁判所が家事労働、子の養育、家庭への貢献、共同生活・別居の期間、経済力などを考慮し、分配額を調整し、または分配を免除することがあります。残余財産差額分配請求権は、請求権者が残余財産の差額の存在を知った時から2年間行使しなかった場合、または法定財産制が終了した時から5年を経過した場合に消滅するため、適用法、財産制、起算点および対象財産を早期に確認する必要があります。',
    '台湾法上、配偶者は相続人となり、配偶者以外の相続人は、直系血族の卑属（直系血親卑親屬）、父母、兄弟姉妹、祖父母の順に定められます。配偶者が第1順位の相続人と共同相続する場合、その法定相続分は各相続人と均等ですが、第2または第3順位の相続人と共同相続する場合は遺産の2分の1、第4順位の相続人と共同相続する場合は3分の2となり、これらの相続人がいない場合は遺産の全部となります。遺言、特留分（日本法上の遺留分に相当する制度）、相続放棄、債務、夫婦財産の清算、複数の国・地域に所在する資産の取扱いについては、個別に確認する必要があります。',
  ],
};

describe('Japanese family service-detail content', () => {
  it('preserves the reviewed title, subtitle, intro, and five ordered points exactly', () => {
    expect(getJapaneseServiceDetail('family')).toEqual(expectedFamily);
    expect(getJapaneseServiceDetail('family')?.keyPoints).toHaveLength(5);
  });

  it('contains five substantial Japanese points without fallback copy', () => {
    const family = getJapaneseServiceDetail('family');
    const serialized = JSON.stringify(family);

    expect(family?.keyPoints).toHaveLength(5);
    for (const point of family?.keyPoints ?? []) {
      expect(point.length).toBeGreaterThan(120);
    }

    expect(serialized).not.toMatch(/[\u3131-\u318e\uac00-\ud7a3]/u);
    expect(serialized).not.toMatch(
      /Family Law|International family legal support|Hovering supports|법무법인 호정/i,
    );
  });

  it('retains every reviewed legal distinction and qualifier', () => {
    const serialized = JSON.stringify(getJapaneseServiceDetail('family'));

    for (const required of [
      '書面による合意',
      '2人以上の証人の署名',
      '戸政機関での離婚登記',
      '法律上の例外を除き',
      '裁判所の調停',
      '国際裁判管轄',
      'どの国・地域の法が適用されるか',
      '未成年子の権利義務の行使・負担',
      '子の最善の利益',
      'いわゆる「最小変動原則」のみで結論が決まるものではありません',
      '相続その他の無償取得財産および慰謝料は除外',
      '分配額を調整し、または分配を免除',
      '知った時から2年間行使しなかった',
      '終了した時から5年を経過',
      '直系血族の卑属（直系血親卑親屬）、父母、兄弟姉妹、祖父母',
      '第2または第3順位',
      '2分の1',
      '第4順位',
      '3分の2',
      '特留分（日本法上の遺留分に相当する制度）',
    ]) {
      expect(serialized).toContain(required);
    }
  });

  it('excludes unsupported outcomes, overbroad procedures, and unrelated services', () => {
    const serialized = JSON.stringify(getJapaneseServiceDetail('family'));

    for (const forbidden of [
      '時効は5年です',
      '請求期限は5年のみ',
      '配偶者と子は常に均等',
      'すべての相続人が均等',
      '最小変動原則により決まります',
      '調停に出席しなければ3,000',
      '3,000TWD',
      '判決後30日以内に',
      '必ず台湾法が適用',
      '必ず親権を獲得',
      '必ず相続できます',
      '保証します',
      '最低勤務期間',
      '資遣費',
      '刑事告訴期限は6か月',
      '曾俊瑋',
      '법무법인 호정',
    ]) {
      expect(serialized).not.toContain(forbidden);
    }

    expect(serialized).not.toMatch(/[\u3131-\u318e\uac00-\ud7a3]/u);
    expect(serialized).not.toMatch(
      /Family Law|International family legal support|Hovering supports/i,
    );
  });

  it('keeps the approved record and lookup prototype-safe', () => {
    expect(japaneseServiceDetails.family).toEqual(expectedFamily);
    expect(getJapaneseServiceDetail('__proto__')).toBeUndefined();
    expect(getJapaneseServiceDetail('constructor')).toBeUndefined();
  });
});
