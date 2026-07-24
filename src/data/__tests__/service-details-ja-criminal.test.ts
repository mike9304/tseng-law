import { describe, expect, it } from 'vitest';

import {
  getJapaneseServiceDetail,
  japaneseServiceDetails,
} from '@/data/service-details-ja';

const expectedCriminal = {
  title: '台湾の刑事事件・刑事弁護',
  subtitle: '捜査対応、被疑者・被告人の弁護、被害者の告訴手続を日本語で支援',
  intro:
    '昊鼎国際法律事務所は、台湾の刑事事件について、警察・検察による捜査への対応、弁護人による接見、被疑者・被告人の弁護、被害者の代理および告訴手続を日本語で支援します。また、会社の株金、交通事故、外国人の就労などに伴う刑事・行政上のリスクを、事実関係、証拠、適用法令および手続期限に基づいて整理し、対応方針を検討します。',
  keyPoints: [
    '台湾の刑事手続では、当事者の立場と手続段階に応じた初動が重要です。刑事訴訟法第27条により、被告人（台湾法上の「被告」）はいつでも弁護人を選任でき、司法警察官または司法警察による取調べを受ける被疑者（同「犯罪嫌疑人」）も同様です。被告人の取調べ前には、被疑事実とすべての罪名、黙秘できること、弁護人を選任できること、有利な証拠の取調べを請求できることなどが告知されます。聴覚・言語に障害がある場合または言語が通じない場合には通訳を付すこととされているため、外国人事件では通訳の確保、供述内容および証拠を早期に確認します。',
    '6か月の告訴期間は、すべての刑事事件に共通する期限ではありません。刑事訴訟法第237条では、告訴を訴追の条件とする犯罪（告訴乃論之罪）について、告訴権者が犯人を知った時から6か月以内に告訴することとされています。告訴を要しない犯罪、告訴権者、起算点、告訴の撤回可否および民事請求の期間はそれぞれ別に確認し、6か月を過ぎれば一律に民事手続しか利用できないとは扱いません。',
    '台湾会社法第9条の刑事責任は、会社が受け取るべき株金について、実際には払い込まれていないのに申請書類上は全額払込済みと表示した場合、または株主が実際に払い込んだ株金を、登記後に会社責任者が株主へ返還し、もしくは株主による回収を許した場合に問題となります。会社責任者には5年以下の有期刑、拘役（台湾法上の短期自由刑）または50万以上250万新台湾ドル以下の罰金が科され得ますが、通常の適法な会社資金の使用一般を処罰する規定ではありません。',
    '台湾刑法第185条の4では、自動車などの動力交通手段（台湾法上の「動力交通工具」）の運転者が交通事故を起こし、人を負傷させた後に逃走した場合は6か月以上5年以下の有期刑、人を死亡させ、または重傷を負わせた後に逃走した場合は1年以上7年以下の有期刑とされています。事故による死傷について運転者に過失がない場合には刑を減軽または免除できる旨も定められており、同条の適用は、死傷結果、事故後の行動、現場を離れた経緯などを個別に確認して判断する必要があります。',
    '就業サービス法第43条（就業服務法第43條）は、同法に別段の定めがある場合を除き、外国人が雇用主による許可申請を経ずに台湾で就労することを禁止しています。入出国及び移民法第18条（入出國及移民法第18條）では、過去に不法就労または在留期間超過等があった外国人について、移民署が入国を禁止できるとされ、同条第1項第12号による入国禁止期間は出国日の翌日から少なくとも1年、最長7年です。一律に3年間入国できない、または無許可就労が常に刑事責任を生じさせるとは断定せず、就労内容、許可・在留状況および具体的な処分を確認します。',
  ],
};

describe('Japanese criminal service-detail content', () => {
  it('preserves the reviewed title, subtitle, intro, and five ordered points exactly', () => {
    expect(getJapaneseServiceDetail('criminal')).toEqual(expectedCriminal);
    expect(getJapaneseServiceDetail('criminal')?.keyPoints).toHaveLength(5);
  });

  it('contains five substantial Japanese points without fallback copy', () => {
    const criminal = getJapaneseServiceDetail('criminal');
    const serialized = JSON.stringify(criminal);

    expect(criminal?.keyPoints).toHaveLength(5);
    for (const point of criminal?.keyPoints ?? []) {
      expect(point.length).toBeGreaterThan(120);
    }

    expect(serialized).not.toMatch(/[\u3131-\u318e\uac00-\ud7a3]/u);
    expect(serialized).not.toMatch(
      /Criminal Defense|Criminal Cases|Hovering supports|법무법인 호정/i,
    );
  });

  it('retains every reviewed legal distinction and qualifier', () => {
    const serialized = JSON.stringify(getJapaneseServiceDetail('criminal'));

    for (const required of [
      '刑事訴訟法第27条',
      '刑事訴訟法第237条',
      '黙秘できること',
      '有利な証拠',
      '通訳',
      '告訴乃論之罪',
      '犯人を知った時から6か月以内',
      '一律に民事手続しか利用できないとは扱いません',
      '台湾会社法第9条',
      '全額払込済み',
      '登記後',
      '5年以下の有期刑',
      '50万以上250万新台湾ドル以下',
      '通常の適法な会社資金の使用一般',
      '6か月以上5年以下',
      '1年以上7年以下',
      '減軽または免除',
      '就業服務法第43條',
      '入出國及移民法第18條',
      '少なくとも1年',
      '最長7年',
      '常に刑事責任を生じさせるとは断定せず',
    ]) {
      expect(serialized).toContain(required);
    }
  });

  it('excludes overbroad deadlines, penalties, fallback, and outcome copy', () => {
    const serialized = JSON.stringify(getJapaneseServiceDetail('criminal'));

    for (const forbidden of [
      '刑事告訴期限は6か月',
      'すべて6か月以内',
      '6か月を過ぎると民事のみ',
      '民事しかできない',
      '会社資金を引き出すと5年',
      '会社資金の不正払戻し',
      'ひき逃げは1年以上7年以下',
      '3年間入国禁止',
      '3年内禁止入境',
      '無許可就労は犯罪',
      '必ず刑事責任',
      '曾俊瑋',
      '법무법인 호정',
      '保証します',
      '必ず不起訴',
      '必ず無罪',
    ]) {
      expect(serialized).not.toContain(forbidden);
    }

    expect(serialized).not.toMatch(/[\u3131-\u318e\uac00-\ud7a3]/u);
    expect(serialized).not.toMatch(
      /Criminal Defense|Criminal Cases|Hovering supports/i,
    );
  });

  it('keeps the approved record and lookup prototype-safe', () => {
    expect(japaneseServiceDetails.criminal).toEqual(expectedCriminal);
    expect(getJapaneseServiceDetail('__proto__')).toBeUndefined();
    expect(getJapaneseServiceDetail('constructor')).toBeUndefined();
  });
});
