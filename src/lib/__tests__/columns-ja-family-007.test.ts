import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ColumnContent from '@/components/ColumnContent';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/007-taiwan-divorce-lawsuit-qna.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const canonicalSlug = 'taiwan-divorce-lawsuit-qna';
const post = getColumnPost(canonicalSlug, 'ja');
const aliasPost = getColumnPost('divorce-qna', 'ja');

const title = '台湾の離婚手続Q&A：調停・訴訟・財産分与・子ども';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-divorce-lawsuit-qna';
const featuredImage =
  '../images/007-taiwan-divorce-lawsuit-qna/featured-01.jpg';
const bodyImage = `![台湾の離婚手続と国際家事問題を説明する画像](${featuredImage})`;
const introParagraphs = [
  '台湾の離婚事件では、婚姻関係を終了させる方法だけでなく、戸籍の整理、外国における効力、夫婦財産、損害賠償、離婚後の配偶者扶養、未成年の子に関する判断および養育費を、それぞれ区別して検討する必要があります。同じ事実が複数の請求の資料となり得る場合でも、各権利の要件と効果、立証事項および期間は同じではありません。',
  '特に、韓国と台湾のように二つ以上の国または地域に関係する家族については、いずれか一方の国籍または婚姻届出地だけを見て手続を決めることは困難です。現在の生活の本拠地、既存の裁判手続および登録の状況、文書の作成地、子の居住地ならびに財産の所在地を先に確認することで、不必要な手続の重複や執行の空白を減らすことができます。',
];
const legacyGenericIntro =
  '本稿は、台湾における離婚の経路、戸籍登記、裁判所手続、裁判離婚の事由について、中立的な法律情報として整理するものです。一般的な教育情報であり、個別事案への法的助言ではありません。裁判管轄、準拠法、外国の身分行為や裁判の承認、事実と証拠、既存の合意や裁判所の判断、および現行の公式規則により、結論は異なり得ます。';
const frozenH2BodySha256 =
  '34859b4d0da16b141c8179edd193635e8c15b193eff697419aae8ea14d74a99b';
const responsibleSpousePhrase = '有責配偶者';
const staleResponsibleSpousePhrase = '唯一の有責配偶者';
const frozenNormalizedSection4Sha256 =
  '9fb0c4e46cb78a3ebfa3003abcb3b4d6c48aa5061cf2c7c4a0f79ca6c5c995af';
const frozenSection5OnwardSha256 =
  'b8c8c28df4f4578017332334fa6931119d2267a68f30bc326e65d9a8139c248d';

const faq1Answer =
  '台湾民法第1050条によれば、協議離婚は書面により行い、双方に離婚の真意があることを確認した2名以上の証人が署名し、戸政機関に離婚登記をして初めて効力が生じます。署名済みの合意書だけで離婚が成立するわけではなく、外国的要素がある場合は、準拠法、文書の認証・翻訳および他国・地域での届出も別途確認する必要があります。';
const faq2Answer =
  '必ずしもそうではありません。家事事件法第13条により、裁判所が当事者または法定代理人に本人出頭を命じ、正当な理由なく従わない場合には、民事訴訟法第303条が準用されます。初回の過料は3万台湾元以下であり、再度の適法な通知の後に正当な理由なく出頭しない場合は、反復して制裁が科されることがありますが、拘引はできません。これは、双方が必ず同じ部屋で調停しなければならないという意味ではありません。手続の進め方は、法令と個別事情に基づき裁判所が判断します。';
const faq3Answer =
  '現行民法第1052条第2項ただし書は、婚姻を維持し難い重大な事由について一方の配偶者だけに責任がある場合、原則として他方の配偶者のみが離婚を請求できると定めています。しかし、憲法法廷112年憲判字第4号は、重大な事由が発生し、または継続した相当な期間を考慮しないまま、有責配偶者から離婚の機会を完全に奪い、個別事件で明らかに過酷となる範囲について違憲と判断しました。条文は残っているため、一律に請求できる、またはできないと断定せず、裁判所が判決の趣旨と具体的事実をどのように適用するかを確認する必要があります。';
const faq4Answer =
  '決まりません。住宅の登記名義と購入資金の出所は重要な証拠ですが、所有権、贈与、借名登記、貸付、不当利得などの個別請求と、民法第1030条の1に基づく夫婦残余財産差額分配は別の問題です。実際の合意、取得原因と時期、資金の流れ、債務、無償取得の有無および証拠を分けて検討する必要があり、婚前資金で費用の一部を負担したことや一方の名義で登記したことだけで、すべての結論が決まるわけではありません。';
const faq5Answer =
  '同じ権利ではありません。民法第1030条の1の夫婦残余財産差額分配請求権、第1056条の裁判離婚に伴う損害賠償、第1057条の無過失配偶者に対する困窮扶養および未成年の子の養育費は、発生要件、算定方法および期間が異なります。夫婦残余財産差額分配請求権には、差額を知った時から2年、法定財産制関係が消滅した時から5年という期間が適用されますが、これを他の請求にそのまま当てはめてはなりません。';
const faq6Answer =
  '台湾民法第1055条および第1055条の1によれば、裁判所は未成年の子の最善の利益を基準として、権利義務の行使・負担、面会交流その他の子に関する事項を判断します。子の年齢、健康、意思および発達上の必要、父母の生活状況、監護能力と態度、子との情緒的関係、他方の親との関係を妨げているかなど、法定の要素と具体的資料を総合するため、親の収入や婚姻破綻の責任という一要素だけで結論を決めることはできません。';

const faq = [
  {
    q: '台湾の協議離婚は、合意書に署名すれば直ちに効力が生じますか？',
    a: faq1Answer,
  },
  {
    q: '裁判所の調停では、必ず双方が同じ場に出頭しなければなりませんか？',
    a: faq2Answer,
  },
  {
    q: '婚姻破綻について有責な配偶者は、裁判離婚を請求できますか？',
    a: faq3Answer,
  },
  {
    q: '住宅の購入資金を負担したことや登記名義だけで、所有権や夫婦残余財産差額分配は決まりますか？',
    a: faq4Answer,
  },
  {
    q: '夫婦残余財産差額分配、離婚に伴う損害賠償、配偶者扶養および養育費は同じ請求ですか？',
    a: faq5Answer,
  },
  {
    q: '台湾の裁判所は、未成年の子に関する事項をどのように判断しますか？',
    a: faq6Answer,
  },
];

const headings = [
  '1. 3つの離婚手続と、まず確認すべき渉外上の論点',
  '2. 協議離婚と戸籍登記',
  '3. 裁判所の調停・訴訟、出頭および不服申立て',
  '4. 裁判離婚の事由と有責配偶者に関するただし書',
  '5. 外国での婚姻・離婚と台湾における戸籍手続',
  '6. 不動産の名義、婚前資金および夫婦残余財産差額分配請求権',
  '7. 損害賠償、離婚後の扶養、未婚の同居および第三者',
  '8. 未成年の子に対する権利義務の行使・負担と最善の利益',
  '9. 子の養育費、面会交流、執行および暫定的保護',
  '10. 子を伴う国境を越えた転居',
  '11. 証拠と実務上の準備',
  '12. 公式資料',
  '13. 関連するご案内',
];

const officialLinks = [
  '[台湾全国法規資料庫：民法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000001)',
  '[台湾法務部法規検索システム：民法（英語版）](https://mojlaw.moj.gov.tw/ENG/LawContentE.aspx?LSID=FL001351)',
  '[台湾全国法規資料庫：家事事件法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0010048)',
  '[台湾全国法規資料庫：民事訴訟法第303条](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=303&pcode=B0010001)',
  '[台湾全国法規資料庫：家事非訟事件の暫定処分に関する規則（原題：家事非訟事件暫時処分辦法）](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0010056)',
  '[台湾全国法規資料庫：戸籍法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0030006)',
  '[内政部戸政司：離婚登記申請案内](https://www.ris.gov.tw/documents/html/2/3/1/384.html)',
  '[台湾全国法規資料庫：渉外民事法律適用法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000007)',
  '[台湾憲法法廷：112年憲判字第4号](https://cons.judicial.gov.tw/docdata.aspx?fid=52&id=310013)',
  '[台湾憲法法廷：112年憲判字第4号（英語版）](https://cons.judicial.gov.tw/en/docdata.aspx?fid=5534&id=352234)',
];
const officialUrls = officialLinks.map(
  (link) => link.match(/\((https?:\/\/[^)]+)\)$/)?.[1] ?? '',
);
const internalLinks = [
  '[台湾の家事事件サービス](/ja/services/family)',
  '[台湾訴訟弁護士ガイド](/ja/taiwan-litigation-lawyer)',
  '[お問い合わせ](/ja/contact)',
];

const staleDisclaimer =
  '本稿は、台湾の離婚手続、夫婦財産制、離婚後の請求および未成年の子に関する家事法について、一般的な教育情報を提供するものです。個別の離婚事件または家事事件に関する法的助言ではありません。管轄、準拠法、外国裁判の承認、事実と証拠、既存の合意や裁判所の判断、および現行の公式規則により結果は異なり得ます。期限を計算し、又は手続を開始する前に、正しい起算事由に基づく期限と最新の公式資料を個別事情に即して確認してください。';
const disclaimer =
  '本稿は、台湾における離婚、国際家事、夫婦財産および未成年の子に関する制度を一般的に解説することを目的とした教育資料であり、個別の事案に対する法的助言ではありません。管轄、準拠法、外国裁判の承認、婚姻・戸籍上の状態、夫婦財産制、子に関する既存の合意または裁判、事実関係および証拠、ならびに最新の公式規則により、手続および結果が異なる場合があります。登記、不服申立て、請求および執行の各期限については、行動を起こす前に、それぞれの権利および手続の正確な起算点を基準として個別にご確認ください。';
const author = '**曾雋崴弁護士（Wei Tseng）**';
const exactEnding = `- ${internalLinks[2]}

${disclaimer}

${author}`;

const frozenVisibleJapaneseCount = 12_231;
const frozenVisibleKanaCount = 5_417;
const frozenCalculatedMinutes = 25;
const frozenSourceSha256 =
  '21755d96ab6b7bd186d7342b4c44bbc7c6de14b6e3fc72cdeefac50fd9b7ed02';

function countOccurrences(value: string, needle: string) {
  return value.split(needle).length - 1;
}

function firstParagraphAfter(content: string, heading: string) {
  return content.split(`${heading}\n\n`)[1]?.split('\n\n')[0];
}

function sectionBody(content: string, heading: string) {
  const sectionStart = content.indexOf(`## ${heading}`);
  const nextSection = content.indexOf('\n## ', sectionStart + 1);
  return content.slice(
    sectionStart,
    nextSection === -1 ? content.length : nextSection,
  );
}

function extractPublicText(content: string) {
  return content
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^---$/gm, '')
    .replace(/[「」『』“”‘’*_`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

describe('Japanese family column 007 — Taiwan divorce procedure Q&A', () => {
  it('publishes the exact complete frontmatter and loaded article identity', () => {
    expect(parsed.data).toEqual({
      title,
      url: sourceUrl,
      lastmod: '2026-07-25',
      date_display: '2025年9月13日',
      read_time: '約25分',
      categories: ['台湾法律情報'],
      featured_image: featuredImage,
      faq,
    });
    expect(parsed.data.faq).toHaveLength(6);
    expect(post).toMatchObject({
      slug: canonicalSlug,
      title,
      date: '2026-07-25',
      dateDisplay: '2025年9月13日',
      readTime: '約25分',
      category: 'legal',
      categoryLabel: '台湾法律情報',
      featuredImage:
        '/images/blog/007-taiwan-divorce-lawsuit-qna/featured-01.jpg',
      faq,
    });
    expect(parsed.data.url).toBe(sourceUrl);
    expect(raw).toContain(sourceUrl);
    expect(post?.title).toBe(title);
    expect(post?.faq).toEqual(faq);
    expect(post?.content).toContain(`## ${headings[0]}`);
    expect(post?.content).toContain(disclaimer);
  });

  it('uses the sole exact H1 followed immediately by the sole contracted image', () => {
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(parsed.content).toMatch(
      new RegExp(
        `^\\n# ${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\n${bodyImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\n`,
      ),
    );
    expect(
      Array.from(
        parsed.content.matchAll(/!\[[^\]]*\]\([^)]+\)/g),
        (match) => match[0],
      ),
    ).toEqual([bodyImage]);
    expect(countOccurrences(raw, featuredImage)).toBe(2);
    expect(post?.content).not.toMatch(/!\[[^\]]*\]\([^)]+\)/);
    expect(raw).not.toContain('img-01.jpg');
  });

  it('replaces the generic disclaimer intro with the exact two-paragraph Korean-source meaning while freezing every H2 section', () => {
    const firstHeading = `## ${headings[0]}`;
    const afterImage = parsed.content.split(`${bodyImage}\n\n`)[1];

    expect(afterImage).toBeDefined();
    const [intro, ...h2Parts] = afterImage!.split(`\n\n${firstHeading}`);
    const h2Body = `${firstHeading}${h2Parts.join(`\n\n${firstHeading}`)}`;

    expect(intro.split('\n\n')).toEqual(introParagraphs);
    expect(intro).toBe(introParagraphs.join('\n\n'));
    expect(parsed.content).not.toContain(legacyGenericIntro);
    expect(post?.content).toContain(introParagraphs.join('\n\n'));
    expect(
      crypto.createHash('sha256').update(h2Body).digest('hex'),
    ).toBe(frozenH2BodySha256);
  });

  it('uses exactly the thirteen contracted H2 sections in order', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(headings);
  });

  it('repeats each exact FAQ answer twice and starts its assigned section with it', () => {
    const assignments = [
      [`## ${headings[1]}`, faq1Answer],
      [`## ${headings[2]}`, faq2Answer],
      [`## ${headings[3]}`, faq3Answer],
      [`## ${headings[5]}`, faq4Answer],
      [`## ${headings[6]}`, faq5Answer],
      [`## ${headings[7]}`, faq6Answer],
    ];

    for (const [heading, answer] of assignments) {
      expect(firstParagraphAfter(parsed.content, heading)).toBe(answer);
      expect(firstParagraphAfter(post?.content ?? '', heading)).toBe(answer);
      expect(countOccurrences(raw, answer)).toBe(2);
    }
  });

  it('uses the exact responsible-spouse terminology in FAQ 3 and Section 4 while freezing all other downstream text', () => {
    const section4 = sectionBody(parsed.content, headings[3]);
    const section5Start = parsed.content.indexOf(`## ${headings[4]}`);
    const section5Onward = parsed.content.slice(section5Start);
    const normalizedSection4 = section4
      .split(responsibleSpousePhrase)
      .join('<RESPONSIBLE_SPOUSE>')
      .split(staleResponsibleSpousePhrase)
      .join('<RESPONSIBLE_SPOUSE>');
    const detailedParagraph =
      section4
        .split('\n\n')
        .find((paragraph) =>
          paragraph.startsWith(
            'このただし書は、2026年7月25日時点の現行条文に残っています。',
          ),
        ) ?? '';

    expect(parsed.data.faq[2]?.a).toBe(faq3Answer);
    expect(firstParagraphAfter(parsed.content, `## ${headings[3]}`)).toBe(
      faq3Answer,
    );
    expect(detailedParagraph).toContain(
      '重大な事由が発生し、または継続した相当な期間を考慮しないまま、婚姻破綻について専ら責任を負う配偶者から離婚の機会を完全に奪い、個別事件で明らかに過酷となる範囲について違憲と判断しました。',
    );
    expect(countOccurrences(raw, responsibleSpousePhrase)).toBe(5);
    expect(countOccurrences(raw, staleResponsibleSpousePhrase)).toBe(0);
    expect(
      crypto.createHash('sha256').update(normalizedSection4).digest('hex'),
    ).toBe(frozenNormalizedSection4Sha256);
    expect(
      crypto.createHash('sha256').update(section5Onward).digest('hex'),
    ).toBe(frozenSection5OnwardSha256);
  });

  it('locks one exact substantive proposition in its assigned section for all twenty-five legacy topics', () => {
    const legacyCoverage = [
      {
        number: 1,
        heading: headings[0],
        phrase:
          '**協議離婚**は、民法第1050条の書面、証人および戸政機関への登記という要件をすべて満たして初めて効力を生じる身分行為です。私的な合意書に署名しただけでは完了しません。',
      },
      {
        number: 2,
        heading: headings[4],
        phrase:
          '外国の現地法に従って離婚しただけでは、台湾の戸籍登記が完了し、又は台湾での承認・効力が自動的に証明されるわけではありません。',
      },
      {
        number: 3,
        heading: headings[5],
        phrase:
          '婚前の貯蓄による頭金やローン返済は、資金の出所に関する重要な証拠となり得ます。しかし、それだけで登記名義が移転し、又は後のすべての請求が決まるわけではありません。',
      },
      { number: 4, heading: headings[2], phrase: faq2Answer },
      {
        number: 5,
        heading: headings[6],
        phrase:
          '行政機関が公表する平均消費支出は、参考資料となり得ても、第1057条の額を自動的に決める拘束的な固定算式ではありません。',
      },
      {
        number: 6,
        heading: headings[5],
        phrase:
          '振込記録、購入契約、ローン資料、領収書、通信記録、税務・登記資料などは実務上重要ですが、どの理論についても一通の書類だけで結論が決まるとは限りません。',
      },
      { number: 7, heading: headings[6], phrase: faq5Answer },
      {
        number: 8,
        heading: headings[7],
        phrase:
          'もっとも、「まず離婚し、子の問題は後で処理すればよい」という普遍的な近道として勧めるものではありません。',
      },
      {
        number: 9,
        heading: headings[1],
        phrase:
          '申請者、代理の可否、身分証明・戸籍資料、離婚書面などの実際の必要書類は、申請時における内政部戸政司の離婚登記案内と担当戸政事務所の確認に基づいて準備する必要があります。',
      },
      {
        number: 10,
        heading: headings[2],
        phrase:
          '所要期間は、争点、送達、証拠、暫定的な申立て、裁判所の負担などにより異なります。固定の処理日数を法律上の保証として述べることはできません。',
      },
      {
        number: 11,
        heading: headings[3],
        phrase:
          '民法第1052条第1項は、裁判離婚の具体的事由として次の10を定めます。',
      },
      { number: 12, heading: headings[3], phrase: faq3Answer },
      {
        number: 13,
        heading: headings[2],
        phrase:
          '家事事件法の対象となる事件では、原則として裁判所の調停が先行します。ただし、法令と個別の事件の性質・手続上の地位により例外や異なる進行があり得るため、すべての家事事件に変更不能な単一路線だけがあるとはいえません。',
      },
      {
        number: 14,
        heading: headings[6],
        phrase:
          '**民法第1057条**は、無過失の配偶者が裁判離婚により生活困難となる場合の離婚後の扶養を規律します。',
      },
      {
        number: 15,
        heading: headings[6],
        phrase:
          '未婚の同居だけでは、離婚に伴う権利、第1056条の損害賠償、第1057条の離婚後扶養は生じません。',
      },
      {
        number: 16,
        heading: headings[7],
        phrase:
          '離婚合意書があるからといって、法定の要件を満たす後の裁判所の審理が当然に封じられるわけではありません。',
      },
      {
        number: 17,
        heading: headings[8],
        phrase:
          '「予見不能な事情変更」だけを唯一の要件とするわけではありません。',
      },
      {
        number: 18,
        heading: headings[8],
        phrase:
          '面会妨害があったという一事だけで、即時引渡し、実力行使、権利義務の自動変更、又は相手方の処罰が保証されるわけではありません。',
      },
      {
        number: 19,
        heading: headings[2],
        phrase:
          'あらゆる家事裁判に共通する単一の不服申立て期限があるわけではないため、実際に発せられた文書に基づき、正しい経路と期間を確認する必要があります。',
      },
      {
        number: 20,
        heading: headings[5],
        phrase:
          '不貞その他の婚姻破綻の責任が、所有権を自動的に奪い、又は差額分配の法定計算を機械的に書き換えるわけではありません。',
      },
      {
        number: 21,
        heading: headings[3],
        phrase:
          '有責配偶者が絶対に請求できない、又は常に請求できる、という固定結論を述べてはなりません。',
      },
      {
        number: 22,
        heading: headings[6],
        phrase:
          '深刻な干渉や侮辱があったという一事だけでは、第三者に対する第1057条義務や離婚損害賠償が自動的に成立するわけではありません。',
      },
      {
        number: 23,
        heading: headings[3],
        phrase:
          '警察への行方不明届は重要な証拠となり得ますが、普遍的な法定前提ではありません。',
      },
      {
        number: 24,
        heading: headings[3],
        phrase:
          '数か月の別居それ自体は、当然の離婚事由にはなりません。',
      },
      {
        number: 25,
        heading: headings[9],
        phrase:
          '特定国で生活することに合意しただけでは、その国の物価水準だけで養育費が決まるわけではありません。',
      },
    ];

    expect(legacyCoverage.map(({ number }) => number)).toEqual(
      Array.from({ length: 25 }, (_, index) => index + 1),
    );
    for (const { heading, phrase } of legacyCoverage) {
      expect(sectionBody(parsed.content, heading)).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks the three paths and five separate cross-border questions', () => {
    const section = sectionBody(parsed.content, headings[0]);
    const requiredPhrases = [
      '**協議離婚**は、民法第1050条の書面、証人および戸政機関への登記という要件をすべて満たして初めて効力を生じる身分行為です。',
      '**裁判所の調停または和解による離婚**は、調停または和解が成立した時点で婚姻関係が終了し',
      '**裁判離婚**は、民法第1052条に定める事由に基づき、裁判所の判決により離婚を認める経路です。',
      '台湾の裁判所または行政機関が、求められている手続について裁判管轄または行政権限を有するか。',
      '離婚、夫婦財産および子に関する事項について、どの法域の準拠法が適用されるか。',
      '外国の身分行為または裁判が、台湾において承認され、又は効力を有するか。',
      '台湾の戸籍手続として、どのような登記と認証書類等が必要か。',
      '他国・地域において、さらにどのような登記、承認または執行の手続が必要か。',
      '国籍のみ、婚姻登記地のみ、あるいは一国の現地法のみをもって、上記5点のすべてが解決するわけではありません。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Article 1050 elements and the qualified court-result registration rule', () => {
    const section = sectionBody(parsed.content, headings[1]);
    const requiredPhrases = [
      faq1Answer,
      '民法第1050条は、次の要件を別個に要求します。',
      '**書面。** 協議離婚は書面により行わなければなりません。',
      '双方に離婚の真意があることを直接見聞きして確認した2名以上の証人が署名する必要があります。',
      '真意を確認していない者が後から形式的に署名するだけでは足りません。',
      '戸政機関への登記は効力発生の要件です。',
      '登記がなければ、私的な書面だけでは台湾の協議離婚は完成しません。',
      '**台湾の離婚判決の確定日、または裁判所の調停・和解の成立日から30日**',
      '判決書や調停調書を受領した日が、確定または成立に先立つだけの場合には、その受領日を一律の起算日としてはなりません。',
      '期限後の申請も受理されます。',
      '申請が遅れたこと自体が、すでに効力を生じた裁判所の離婚を失効させるわけではありません。',
      '書面による催告後も誰も申請しない場合、戸政機関は、戸籍法第48条の2に基づき、要件を満たす裁判所の結果を職権で登記します。',
      'オンライン申請は法定の申請期間内に限り利用できますが、この30日をオンライン申請だけに適用される期限として説明してはなりません。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Family Act Article 13 and the type-specific effects and review routes', () => {
    const section = sectionBody(parsed.content, headings[2]);
    const requiredPhrases = [
      faq2Answer,
      '家事事件法の対象となる事件では、原則として裁判所の調停が先行します。',
      'すべての家事事件に変更不能な単一路線だけがあるとはいえません。',
      '家事事件法第13条は、裁判所が当事者または法定代理人に本人出頭を命じた場合に限り問題となります。',
      '初回の過料は3万台湾元以下',
      '拘引はできません',
      '遠隔参加、分離手続、代理人、安全上の配慮などは、法令と個別事情に基づき裁判所が判断するものであり、自動的な権利でも自動的な禁止でもありません。',
      '調停調書、和解調書、決定、判決は、不服申立ての観点からは同一ではありません。',
      'あらゆる家事裁判に共通する単一の不服申立て期限があるわけではないため、実際に発せられた文書に基づき、正しい経路と期間を確認する必要があります。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Article 1052 paragraph 1 grounds, paragraph 2, and the constitutional qualification', () => {
    const section = sectionBody(parsed.content, headings[3]);
    const grounds = [
      '1. **重婚。**',
      '2. **配偶者以外の者との合意による性交。**',
      '3. **配偶者の一方による他方への同居に耐え難い虐待。**',
      '4. **配偶者の一方が他方の直系親族を虐待し、または配偶者一方の直系親族が他方を虐待して、共同生活に耐え難いこと。**',
      '5. **配偶者の一方が悪意で他方を遺棄し、その状態が継続していること。**',
      '6. **配偶者の一方が他方の殺害を企てたこと。**',
      '7. **治癒不能の重い疾病。**',
      '8. **重大で治癒不能の精神疾患。**',
      '9. **生死不明が3年を超えること。**',
      '10. **故意の犯罪により6か月を超える有期懲役の確定判決を受けたこと。**',
    ];
    const requiredPhrases = [
      faq3Answer,
      '行為者と被害者を曖昧にしてはなりません。',
      '配偶者の一方が他方の直系親族を虐待する場合と、配偶者一方の直系親族が他方を虐待する場合の双方が含まれ',
      'これは法文の古い疾病表現であり、人格または道徳上の評価ではありません。',
      '第2項は上記10事由とは別です。',
      'このただし書は、2026年7月25日時点の現行条文に残っています。',
      '憲法法廷112年憲判字第4号は、ただし書を全面削除したわけではなく',
      '有責配偶者に対して離婚を自動的に許可し、又は一律に禁止する結論を定めたわけでもありません。',
      '重大な事由が発生し、または継続した相当な期間を考慮しないまま、婚姻破綻について専ら責任を負う配偶者から離婚の機会を完全に奪い、個別事件で明らかに過酷となる範囲について違憲と判断しました。',
      '第1項の各事由をすべて書き換えているわけではありません。',
      '警察への行方不明届は重要な証拠となり得ますが、普遍的な法定前提ではありません。',
      '先行する同居義務履行請求も、すべての事件に必須の法定前提ではありません。',
      '数か月の別居それ自体は、当然の離婚事由にはなりません。',
    ];

    let previousIndex = -1;
    for (const ground of grounds) {
      const index = section.indexOf(ground);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks foreign-record connecting factors, authentication, translation, and regional verification', () => {
    const section = sectionBody(parsed.content, headings[4]);
    const requiredPhrases = [
      '外国での婚姻または離婚は、台湾における単一の手続に要約できません。',
      '「外国で結婚し、外国で離婚すれば現地法だけで足りる」と断定することはできません。',
      'また、外国での婚姻をまず台湾に追加登記するか、台湾で訴訟するかという二択だけが唯一の道でもありません。',
      '原本のほか、台湾の在外機関その他の権限ある経路による認証または確認、および行政実務または裁判実務が求める形式での中国語訳が必要となることが少なくありません。',
      '中国大陸、香港およびマカオの文書については、通常の外国文書の認証とは異なる確認制度が適用されます。',
      '外国の離婚または裁判が台湾で承認され、又は効力を有するかという問題と、台湾の戸政機関が特定の身分記録を登載できるかという問題は同一ではありません。',
      '裁判所での訴訟・調停・和解と、戸政機関での行政登記は、目的も要件も異なります。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Article 1017 and Article 1030-1 classification, exclusions, adjustment, and claim-specific periods', () => {
    const section = sectionBody(parsed.content, headings[5]);
    const requiredPhrases = [
      faq4Answer,
      '住宅その他の特定財産については、少なくとも次の3点を分けます。',
      '民法第1017条は、婚前財産と婚後財産の区分および推定に関する枠組みを与えます。',
      'これらは財産制の分析に有用ですが、所有権の帰属、借名登記や贈与の成否、夫婦残余財産差額分配の最終結論を、単独で自動決定するものではありません。',
      '各配偶者の婚姻中に取得した財産について、法定の除外と関係債務を踏まえた純残余額を算定し、その差額を原則として均等に分配します。',
      '相続その他無償で取得した財産および慰撫金は、法令の定めるところにより除外されます。',
      '婚姻中に取得したすべての財産を一律に折半する制度ではなく',
      '差額の均等分配が著しく不公平となる場合、裁判所は、財産の隠匿・処分、家事労働や子の養育への貢献、共同生活と財産取得の全般的事情など、法定の事情を考慮して分配を調整し、又は免除することができます。',
      '不貞その他の婚姻破綻の責任が、所有権を自動的に奪い、又は差額分配の法定計算を機械的に書き換えるわけではありません。',
      '外国人配偶者であるという理由だけで、異なる法定算式が適用されるわけでもありません。',
      '残余財産の差額を知った時から2年、法定財産制関係が消滅した時から5年の行使期間により制限されます。',
      'この2年・5年の規律を、損害賠償、離婚後の扶養、子の養育費、所有権その他の請求に一律適用してはなりません。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('separates Articles 1056 and 1057, child support, property, cohabitation, and third-party claims', () => {
    const section = sectionBody(parsed.content, headings[6]);
    const requiredPhrases = [
      faq5Answer,
      '**民法第1056条**の損害賠償は、裁判離婚について責任を負う相手方に対する財産上の損害と、法定要件を満たす非財産上の損害とを区別して検討する権利です。',
      '**民法第1057条**は、無過失の配偶者が裁判離婚により生活困難となる場合の離婚後の扶養を規律します。',
      '**民法第1116条の2**は、離婚後も父母が未成年の子に対して扶養義務を負い続けることを明らかにします。',
      '子の養育費は、第1057条の離婚後扶養とは別の義務です。',
      '行政機関が公表する平均消費支出は、参考資料となり得ても、第1057条の額を自動的に決める拘束的な固定算式ではありません。',
      '未婚の同居だけでは、離婚に伴う権利、第1056条の損害賠償、第1057条の離婚後扶養は生じません。',
      '姻族その他の第三者は、当然に第1057条の義務や離婚損害賠償責任を負いません。',
      'すべての請求を「離婚から5年」という単一の期間で一括処理してはなりません。',
      '差額を知った時から2年、法定財産制関係が消滅した時から5年',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Articles 1055 and 1055-1, the full Taiwan concept, review, and unresolved issues', () => {
    const section = sectionBody(parsed.content, headings[7]);
    const requiredPhrases = [
      faq6Answer,
      '台湾法が中心に置くのは、**未成年の子に対する権利義務の行使または負担**です。',
      'これには、居所、日常の監護、教育・医療上の決定、財産管理、法定代理など、複数の内容が含まれ得ます。',
      '日常語としての「親権」や「監護権」は便宜的な略称として用いられることがありますが、その一語が台湾法上の権利義務全体を完全に表すものと理解してはなりません。',
      '離婚合意書があるからといって、法定の要件を満たす後の裁判所の審理が当然に封じられるわけではありません。',
      '民法第1055条の1に基づく審査では、子の年齢、性別、人数および健康、子の意思と人格発達上の必要、父母の年齢、職業、品行、健康、経済力および生活状況、監護・教育に関する意思と態度、父母と子の情緒的関係、他方の親と子の関係を妨げた事情などを総合します。',
      '裁判所は、法定の方法により子の意見を聴き、関係機関または児童福祉の専門家による調査・意見を参考にすることができます。',
      '親の収入や婚姻破綻の責任は、複数の事実の一つとなり得るにすぎず、単独の決定基準または賞罰ではありません。',
      'もっとも、「まず離婚し、子の問題は後で処理すればよい」という普遍的な近道として勧めるものではありません。',
      '選択した離婚経路の要件が満たされる場合であっても、離婚手続の完了後に子に関する事項の一部が未解決のまま残ることがあります。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Article 1116-2 support and Family Act Article 194 contact and enforcement qualifications', () => {
    const section = sectionBody(parsed.content, headings[8]);
    const requiredPhrases = [
      '民法第1116条の2によれば、父母の未成年の子に対する扶養義務は、離婚後も継続します。',
      '子の養育費は親子間の義務であり、民法第1057条に基づく元配偶者に対する離婚後の扶養とは別です。',
      '「予見不能な事情変更」だけを唯一の要件とするわけではありません。',
      '子の生活費、教育費、医療費および特別な必要、父母それぞれの収入、財産、扶養能力および実際の監護分担',
      '家事事件法第194条に基づく直接強制または間接強制も、子の最善の利益に従って方法を選びます。',
      '面会妨害があったという一事だけで、即時引渡し、実力行使、権利義務の自動変更、又は相手方の処罰が保証されるわけではありません。',
      '養育費の不払いを理由に面会を私的に拒絶したり、面会妨害を理由に養育費の支払を一方的に停止したりするなどの自力救済は、勧められません。',
      '緊急の安全問題がある場合には、事件類型と要件に応じて、適切な保全措置または暫定的措置の利用可能性を個別に確認します。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks the seven relocation questions, non-treaty shortcut, and no unauthorized removal', () => {
    const section = sectionBody(parsed.content, headings[9]);
    const requiredPhrases = [
      '子を伴う国境を越えた転居は、一国の物価水準、単一の国籍、又は条約の名称だけで決まる問題ではありません。',
      '**居所および旅行を決める権限。**',
      '**他方の親の同意または裁判所の判断。**',
      '**子の最善の利益と継続的な面会交流。**',
      '**旅券、出入国、移民および各法域での手続。**',
      '**承認および執行。**',
      '**実際の移動・面会費用と双方の資力。**',
      '**緊急保護。**',
      '特定国で生活することに合意しただけでは、その国の物価水準だけで養育費が決まるわけではありません。',
      '1980年のハーグ条約（国際的な子の奪取の民事上の側面に関する条約）が、台湾に当然適用されると述べることはできません。',
      '国境を越えた移動や返還の問題を、条約の名称や一国の費用表だけに還元してはなりません。',
      '既存の合意または裁判に反して子を連れ去り、または帰還させない行為は勧められません。',
      '国籍や旅券の所持だけで、転居権限が自動的に決まるわけではありません。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('uses the exact ordered nine-category evidence checklist and privacy prohibitions', () => {
    const section = sectionBody(parsed.content, headings[10]);
    const checklistStarts = [
      '1. **婚姻・戸籍・身分資料。**',
      '2. **裁判・送達資料。**',
      '3. **外国文書の認証・翻訳。**',
      '4. **財産・債務資料。**',
      '5. **離婚事由の時系列。**',
      '6. **子の状況。**',
      '7. **養育費・面会交流資料。**',
      '8. **正しい起算事由に基づく各期限。**',
      '9. **プライバシーに配慮した資料管理。**',
    ];

    let previousIndex = -1;
    for (const item of checklistStarts) {
      const index = section.indexOf(item);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    expect(section).toContain(
      '証拠は、真正性、完全性、取得経緯および関連性を重視して準備します。都合のよい断片だけに依存してはなりません。',
    );
    expect(section).toContain(
      '必要な証拠は、請求、抗弁、管轄、準拠法、承認、期限ごとに異なります。',
    );
    expect(section).toContain(
      '個人情報および子に関する資料は、必要な範囲で安全に保管・共有してください。',
    );
    expect(section).toContain(
      '中国大陸、香港、マカオの文書は、通常の外国文書とは異なる確認制度に従って扱います。',
    );
    expect(section).toContain(
      '違法な手段で証拠を作り出してはなりません。',
    );
    expect(section).toContain(
      '都合のよい非公式な日付を起算日にしてはなりません。',
    );
    expect(section).toContain(
      '違法な監視、アカウントや端末への侵入、追跡、違法録音、子の私生活の公開、報復、財産隠し、合意または裁判に反する子の連れ去りは勧められません。',
    );
  });

  it('uses exactly the ten official and three Japanese internal body links once and in order', () => {
    const markdownLinks = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g),
      (match) => match[0],
    );
    const externalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((https?:\/\/[^)]+)\)/g),
      (match) => match[1],
    );

    expect(markdownLinks).toEqual([...officialLinks, ...internalLinks]);
    expect(externalTargets).toEqual(officialUrls);
    for (const url of officialUrls) {
      expect(countOccurrences(parsed.content, url)).toBe(1);
    }
    for (const link of [...officialLinks, ...internalLinks]) {
      expect(countOccurrences(raw, link)).toBe(1);
    }
    expect(parsed.content).not.toMatch(/\]\(\/(?:ko|zh-hant|en)(?:\/|\))/);
  });

  it('ends with the exact disclaimer and author and nothing else', () => {
    expect(raw.trimEnd().endsWith(exactEnding)).toBe(true);
    expect(raw.trimEnd()).toMatch(
      /それぞれの権利および手続の正確な起算点を基準として個別にご確認ください。\n\n\*\*曾雋崴弁護士（Wei Tseng）\*\*$/,
    );
    expect(countOccurrences(raw, disclaimer)).toBe(1);
    expect(raw).not.toContain(staleDisclaimer);
    expect(countOccurrences(raw, author)).toBe(1);
  });

  it('freezes the exact visible Japanese character counts, calculated read time, and source digest', () => {
    const publicText = extractPublicText(parsed.content);
    const visibleJapaneseCount =
      publicText.match(
        /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu,
      )?.length ?? 0;
    const visibleKanaCount =
      publicText.match(
        /[\p{Script=Hiragana}\p{Script=Katakana}]/gu,
      )?.length ?? 0;
    const calculatedMinutes = Math.ceil(visibleJapaneseCount / 500);
    const sourceSha256 = crypto
      .createHash('sha256')
      .update(raw)
      .digest('hex');

    expect(visibleJapaneseCount).toBe(frozenVisibleJapaneseCount);
    expect(visibleKanaCount).toBe(frozenVisibleKanaCount);
    expect(calculatedMinutes).toBe(frozenCalculatedMinutes);
    expect(parsed.data.read_time).toBe(`約${calculatedMinutes}分`);
    expect(post?.readTime).toBe(`約${calculatedMinutes}分`);
    expect(sourceSha256).toBe(frozenSourceSha256);
  });

  it('resolves the canonical and legacy alias to the identical complete Japanese article', () => {
    expect(post).toBeDefined();
    expect(aliasPost).toBeDefined();
    expect(aliasPost?.slug).toBe(canonicalSlug);
    expect(aliasPost?.title).toBe(title);
    expect(aliasPost?.content).toBe(post?.content);
    expect(aliasPost?.faq).toEqual(faq);
    expect(aliasPost?.date).toBe(post?.date);
    expect(aliasPost?.dateDisplay).toBe(post?.dateDisplay);
    expect(aliasPost?.readTime).toBe(post?.readTime);
    expect(aliasPost?.category).toBe(post?.category);
    expect(aliasPost?.categoryLabel).toBe(post?.categoryLabel);
    expect(aliasPost?.featuredImage).toBe(post?.featuredImage);
    expect(post?.content).toContain(`## ${headings[0]}`);
    expect(post?.content).toContain(`## ${headings[12]}`);
    expect(post?.content).toContain(disclaimer);
    expect(post?.content).toContain(author);
    expect(post?.content).not.toContain(`# ${title}`);
    expect(post?.content).not.toContain(bodyImage);
    expect(post?.category).toBe('legal');
    expect(post?.featuredImage).toBe(
      '/images/blog/007-taiwan-divorce-lawsuit-qna/featured-01.jpg',
    );
  });

  it('rejects exact legacy wording, semantic overclaims, promotional copy, and wrong identity', () => {
    const serialized = JSON.stringify({
      raw,
      parsedContent: parsed.content,
      postTitle: post?.title,
      postContent: post?.content,
      postFaq: post?.faq,
    });
    const forbiddenLiterals = [
      '判決書または調停調書を受け取った日から**30日**以内に登記を完了しなければなりません',
      '現地法に従って処理すれば足ります',
      '台湾で婚姻を追加登記してから離婚する方法',
      '扶養費と財産分割の請求権はいずれも離婚日から**5年**以内に請求しなければなりません',
      '過ちのある側は離婚訴訟を提起できません',
      'こんにちは、台湾弁護士の曾雋崴です',
      'コメントやご連絡ください',
      'お気軽にコメント',
      '曾俊瑋',
      'img-01.jpg',
      'WIP: JA007',
      'reply promptly',
      '私訊',
      '댓글',
      '대만 이혼',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(serialized).not.toContain(forbidden);
    }
    expect(raw).not.toContain(
      '受領した日をすべての30日期間の起算日とする',
    );
    expect(raw).not.toContain(
      '30日をオンライン申請だけの期間とし',
    );
    expect(raw).not.toContain(
      '期限徒過で離婚が失効',
    );
    expect(raw).not.toContain(
      '婚姻中財産を一律折半',
    );
    expect(raw).not.toContain(
      '平均消費支出が離婚後扶養を決める',
    );
    expect(raw).not.toContain(
      'ハーグ条約が台湾に当然適用される。',
    );
    expect(raw).toContain(
      '1980年のハーグ条約（国際的な子の奪取の民事上の側面に関する条約）が、台湾に当然適用されると述べることはできません。',
    );
    expect(raw).toContain(
      '面会妨害があったという一事だけで、即時引渡し、実力行使、権利義務の自動変更、又は相手方の処罰が保証されるわけではありません。',
    );
  });

  it('contains no invisible characters, cross-locale routes, WIP markers, or Hangul leakage', () => {
    expect(raw).not.toContain('\uFEFF');
    expect(raw).not.toContain('\u00A0');
    expect(raw).not.toContain('\u200B');
    expect(raw).not.toContain('WIP');
    expect(parsed.content).not.toMatch(/\]\(\/(?:ko|zh-hant|en)(?:\/|\))/);
    expect(parsed.content).not.toMatch(/[\uac00-\ud7af]/);
    expect(parsed.content).toContain('曾雋崴');
    expect(parsed.content).not.toContain('曾俊瑋');
    expect(parsed.content).not.toMatch(
      /(?:reply promptly|お気軽にコメント|대만 이혼|台灣離婚程序)/,
    );

    // Reject residual English prose (5+ space-separated words). Allow short tokens
    // such as Q&A and the contracted author English name Wei Tseng.
    const publicTextWithoutAuthorEnglish = extractPublicText(parsed.content)
      .split('Wei Tseng')
      .join(' ');
    expect(publicTextWithoutAuthorEnglish).not.toMatch(
      /\b[A-Za-z]+(?:\s+[A-Za-z]+){4,}\b/,
    );
  });

  it('retains title, FAQ, source URL, and complete body through loader and parse', () => {
    expect(post?.title).toBe(title);
    expect(post?.faq).toEqual(faq);
    expect(raw).toContain(sourceUrl);
    expect(post?.content).toContain(`## ${headings[0]}`);
    expect(post?.content).toContain(`## ${headings[12]}`);
    expect(post?.content).toContain(faq1Answer);
    expect(post?.content).toContain(faq6Answer);
    expect(post?.content).toContain(disclaimer);
    expect(post?.content).toContain(author);
    for (const link of officialLinks) {
      expect(post?.content).toContain(link);
    }
    for (const link of internalLinks) {
      expect(post?.content).toContain(link);
    }
  });

  it('retains representative visible output through ColumnContent server render', () => {
    const html = renderToStaticMarkup(
      createElement(ColumnContent, { content: post?.content ?? '' }),
    );
    const normalizedHtml = html.split('&amp;').join('&');
    const faqAnswers = [
      faq1Answer,
      faq2Answer,
      faq3Answer,
      faq4Answer,
      faq5Answer,
      faq6Answer,
    ];

    expect(normalizedHtml).toContain(headings[0]);
    expect(normalizedHtml).toContain(headings[12]);
    expect(normalizedHtml).toContain(
      '台湾の離婚判決の確定日、または裁判所の調停・和解の成立日から30日',
    );
    expect(normalizedHtml).toContain('曾雋崴');

    for (const answer of faqAnswers) {
      expect(normalizedHtml).toContain(answer);
    }

    for (const link of officialLinks) {
      const match = link.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      expect(match).not.toBeNull();
      const [, label, url] = match!;
      expect(normalizedHtml).toContain(label);
      expect(normalizedHtml).toContain(url);
    }

    for (const link of internalLinks) {
      const match = link.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      expect(match).not.toBeNull();
      const [, label, url] = match!;
      expect(normalizedHtml).toContain(label);
      expect(normalizedHtml).toContain(url);
    }
  });
});
