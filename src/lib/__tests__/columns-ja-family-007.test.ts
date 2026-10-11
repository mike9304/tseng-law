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

// Column 275 now carries the property, damages and support sections and column 307 the
// children, support and relocation sections that 007 used to hold.
const propertySlug = 'taiwan-divorce-property-damages-support';
const propertyRaw = fs.readFileSync(
  path.join(
    process.cwd(),
    'src/content/columns-ja/275-taiwan-divorce-property-damages-support.md',
  ),
  'utf8',
);
const propertyParsed = matter(propertyRaw);
const propertyPost = getColumnPost(propertySlug, 'ja');
const childrenSlug = 'taiwan-divorce-children-custody-support-visitation';
const childrenRaw = fs.readFileSync(
  path.join(
    process.cwd(),
    'src/content/columns-ja/307-taiwan-divorce-children-custody-support-visitation.md',
  ),
  'utf8',
);
const childrenParsed = matter(childrenRaw);
const childrenPost = getColumnPost(childrenSlug, 'ja');
const hubHref = `/ja/columns/${canonicalSlug}`;
const propertyHref = `/ja/columns/${propertySlug}`;
const childrenHref = `/ja/columns/${childrenSlug}`;

const title = '台湾の離婚手続Q&A：調停・訴訟・財産分与・子ども';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-divorce-lawsuit-qna';
const featuredImage =
  '../images/007-taiwan-divorce-lawsuit-qna/featured-01.jpg';
const bodyImage = `![台湾の離婚手続と国際家事問題を説明する画像](${featuredImage})`;
const introParagraphs = [
  '台湾の離婚では、婚姻を終わらせる手続のほかに、戸籍の整理、外国での効力、夫婦財産、損害賠償、離婚後の配偶者扶養、未成年の子に関する判断、養育費を、それぞれ分けて検討します。同じ事実が複数の請求の材料になることはあります。それでも、権利ごとに要件と効果、立証すべき事項、期間は違います。',
  '日本と台湾のように二つ以上の国・地域にまたがる家族では、いずれか一方の国籍や婚姻届出地だけを見て手続を決めるのは困難です。先に確認したいのは、現在の生活の本拠地、すでに進んでいる裁判手続と登録の状況、文書を作成した場所、子の居住地、財産の所在地です。ここを押さえておくと、手続の重複や執行の空白を減らせます。',
];
const legacyGenericIntro =
  '本稿は、台湾における離婚の経路、戸籍登記、裁判所手続、裁判離婚の事由について、中立的な法律情報として整理するものです。一般的な教育情報であり、個別事案への法的助言ではありません。裁判管轄、準拠法、外国の身分行為や裁判の承認、事実と証拠、既存の合意や裁判所の判断、および現行の公式規則により、結論は異なり得ます。';
const responsibleSpousePhrase = '有責配偶者';
const staleResponsibleSpousePhrase = '唯一の有責配偶者';

const faq1Answer =
  '台湾民法第1050条によれば、協議離婚は書面により行い、双方に離婚の真意があることを確認した2名以上の証人が署名し、戸政機関に離婚登記をして初めて効力が生じます。署名済みの合意書だけで離婚が成立するわけではなく、外国的要素がある場合は、準拠法、文書の認証・翻訳および他国・地域での届出も別途確認する必要があります。';
const faq2Answer =
  '必ずしもそうではありません。家事事件法第13条により、裁判所が当事者または法定代理人に本人出頭を命じ、正当な理由なく従わない場合には、民事訴訟法第303条が準用されます。初回の過料は3万台湾元以下であり、再度の適法な通知の後に正当な理由なく出頭しない場合は、反復して制裁が科されることがありますが、拘引はできません。これは、双方が必ず同じ部屋で調停しなければならないという意味ではありません。手続の進め方は、法令と個別事情に基づき裁判所が判断します。';
const faq3Answer =
  '現行民法第1052条第2項ただし書は、婚姻を維持し難い重大な事由について一方の配偶者だけに責任がある場合、原則として他方の配偶者のみが離婚を請求できると定めています。しかし、憲法法廷112年憲判字第4号は、重大な事由が発生し、または継続した相当な期間を考慮しないまま、有責配偶者から離婚の機会を完全に奪い、個別事件で明らかに過酷となる範囲について違憲と判断しました。条文は残っているため、一律に請求できる、またはできないと断定せず、裁判所が判決の趣旨と具体的事実をどのように適用するかを確認する必要があります。';
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
];
// FAQ 4 and 5 of the former six moved to column 275 and FAQ 6 to column 307 with their sections.
const propertyFaqHouseAnswer =
  '決まりません。住宅の登記名義と購入資金の出所は重要な証拠ですが、所有権、贈与、借名登記、貸付、不当利得などの個別請求と、民法第1030条の1に基づく夫婦残余財産差額分配は別の問題です。実際の合意、取得原因と時期、資金の流れ、債務、無償取得の有無および証拠を分けて検討する必要があり、婚前資金で費用の一部を負担したことや一方の名義で登記したことだけで、すべての結論が決まるわけではありません。';
const propertyFaqClaimsAnswer =
  '同じ権利ではありません。民法第1030条の1の夫婦残余財産差額分配請求権、第1056条の裁判離婚に伴う損害賠償、第1057条の無過失配偶者に対する困窮扶養および未成年の子の養育費は、発生要件、算定方法および期間が異なります。夫婦残余財産差額分配請求権には、差額を知った時から2年、法定財産制関係が消滅した時から5年という期間が適用されますが、これを他の請求にそのまま当てはめてはなりません。';
const propertyFaq = [
  {
    q: '住宅の購入資金を負担したことや登記名義だけで、所有権や夫婦残余財産差額分配は決まりますか？',
    a: propertyFaqHouseAnswer,
  },
  {
    q: '夫婦残余財産差額分配、離婚に伴う損害賠償、配偶者扶養および養育費は同じ請求ですか？',
    a: propertyFaqClaimsAnswer,
  },
];
const childrenFaqAnswer =
  '台湾民法第1055条および第1055条の1によれば、裁判所は未成年の子の最善の利益を基準として、権利義務の行使・負担、面会交流その他の子に関する事項を判断します。子の年齢、健康、意思および発達上の必要、父母の生活状況、監護能力と態度、子との情緒的関係、他方の親との関係を妨げているかなど、法定の要素と具体的資料を総合するため、親の収入や婚姻破綻の責任という一要素だけで結論を決めることはできません。';
const childrenFaq = [
  {
    q: '台湾の裁判所は、未成年の子に関する事項をどのように判断しますか？',
    a: childrenFaqAnswer,
  },
];

const headings = [
  '離婚の3つの道筋',
  '協議離婚と戸籍登記',
  '調停から訴訟へ、出頭と不服申立て',
  '裁判離婚の事由と、有責配偶者のただし書',
  '外国での婚姻・離婚と台湾の戸籍手続',
  '不動産の名義、残余財産差額分配、損害賠償、離婚後の扶養',
  '未成年の子の権利義務・養育費・面会交流',
  '証拠と資料の整理',
  '公式資料',
  '関連資料',
];
const propertyHeadings = [
  '1. 不動産の名義、婚前資金および夫婦残余財産差額分配請求権',
  '2. 損害賠償、離婚後の扶養、未婚の同居および第三者',
  '3. 証拠と実務上の準備',
  '4. 公式資料',
  '5. 関連するご案内',
];
const childrenHeadings = [
  '1. 未成年の子に対する権利義務の行使・負担と最善の利益',
  '2. 子の養育費、面会交流、執行および暫定的保護',
  '3. 子を伴う国境を越えた転居',
  '4. 証拠と実務上の準備',
  '5. 公式資料',
  '6. 関連するご案内',
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
const inlineColumnLinks = [
  '[台湾人配偶者との協議離婚：署名の前に整理したい書面と登録の段取り](/ja/columns/taiwanese-spouse-divorce-agreement-registration)',
  '[日本で協議離婚した後、台湾の戸籍に離婚を反映するには](/ja/columns/japan-kyogi-rikon-recognition-taiwan)',
  '[日本に住みながら台湾人配偶者との離婚を考える方へ：最初の相談で整理すること](/ja/columns/taiwanese-spouse-divorce-from-abroad)',
  '[台湾の離婚と不動産の名義・夫婦残余財産差額分配・損害賠償・離婚後の扶養](/ja/columns/taiwan-divorce-property-damages-support)',
  '[台湾の離婚と子ども：親権・養育費・面会交流・国境を越える転居](/ja/columns/taiwan-divorce-children-custody-support-visitation)',
];
const propertyTitle =
  '台湾の離婚と不動産の名義・夫婦残余財産差額分配・損害賠償・離婚後の扶養';
const childrenTitle =
  '台湾の離婚と子ども：親権・養育費・面会交流・国境を越える転居';

const staleDisclaimer =
  '本稿は、台湾の離婚手続、夫婦財産制、離婚後の請求および未成年の子に関する家事法について、一般的な教育情報を提供するものです。個別の離婚事件または家事事件に関する法的助言ではありません。管轄、準拠法、外国裁判の承認、事実と証拠、既存の合意や裁判所の判断、および現行の公式規則により結果は異なり得ます。期限を計算し、又は手続を開始する前に、正しい起算事由に基づく期限と最新の公式資料を個別事情に即して確認してください。';
const disclaimer =
  '本稿は、台湾における離婚、国際家事、夫婦財産および未成年の子に関する制度を一般的に解説する教育資料であり、個別の事案に対する法的助言ではありません。';
const propertyDisclaimer =
  '本稿は、台湾における離婚、国際家事、夫婦財産および離婚に伴う財産・金銭の請求を一般的に解説することを目的とした教育資料であり、個別の事案に対する法的助言ではありません。';
const childrenDisclaimer =
  '本稿は、台湾における離婚、国際家事および未成年の子に関する制度を一般的に解説することを目的とした教育資料であり、個別の事案に対する法的助言ではありません。';
const author = '曾雋崴弁護士（Wei Tseng）';
const exactEnding = `- ${internalLinks[2]}

${disclaimer}

${author}`;

// The 2026-10-12 rewrite turned the numbered six-item evidence list into six prose paragraphs.
// Each entry is the opening of one paragraph, in the order the categories appear.
const evidenceCategoryStarts = [
  'まず身分と戸籍の資料です。',
  '裁判と送達の資料には、',
  '外国の文書は、',
  '離婚事由については、日付順の経緯をまとめます。',
  '各期限は、権利や手続ごとに正しい起算事由から数えます。',
  '配偶者と子の識別情報は安全に保管し、',
];

// Re-frozen after the 2026-10-12 style rewrite of the whole hub body (same legal content, new wording).
const frozenH2BodySha256 =
  '978beec9ce5555dd816d43ab29133e41e1f91982d26fe7716a202abf0079eed2';
const frozenNormalizedSection4Sha256 =
  '2ac287cc7e75df8aab30c6dc21655460e428d85e1c5e739e2ef388f21ddd66d0';
const frozenSection5OnwardSha256 =
  'cd39dbed698b11eb2308689c64e427b3e731e77945d84a3295f6cb6a3c6ad5b4';
const frozenResponsibleSpouseCount = 3;
const frozenVisibleJapaneseCount = 4_921;
const frozenVisibleKanaCount = 2_208;
const frozenSourceSha256 =
  '940dba373db72fe58afeca2a57ea8bead215cf90912b9b9534ea2432f2ef7da3';

function countOccurrences(value: string, needle: string) {
  return value.split(needle).length - 1;
}

function paragraphAfter(content: string, heading: string, index: number) {
  return content.split(`${heading}\n\n`)[1]?.split('\n\n')[index];
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

function countVisibleJapanese(content: string) {
  return (
    extractPublicText(content).match(
      /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu,
    )?.length ?? 0
  );
}

// Lane policy 2026-10-06: ja read_time is an approximation at about 600 characters per minute,
// so it must stay within one minute of the visible-character estimate rather than match an exact ceiling.
function expectApproximateJapaneseReadTime(readTime: unknown, content: string) {
  expect(readTime).toMatch(/^約\d+分$/);
  const minutes = Number(String(readTime).match(/約(\d+)分/)?.[1]);
  const estimatedMinutes = countVisibleJapanese(content) / 600;

  expect(Math.abs(minutes - estimatedMinutes)).toBeLessThanOrEqual(1);
}

describe('Japanese family column 007 — Taiwan divorce procedure Q&A', () => {
  it('publishes the exact complete frontmatter and loaded article identity', () => {
    expect(parsed.data).toEqual({
      title,
      url: sourceUrl,
      lastmod: '2026-10-12',
      date_display: '2025年9月13日',
      read_time: '約8分',
      categories: ['台湾法律情報'],
      featured_image: featuredImage,
      faq,
    });
    expect(parsed.data.faq).toHaveLength(3);
    expect(post).toMatchObject({
      slug: canonicalSlug,
      title,
      date: '2026-10-12',
      dateDisplay: '2025年9月13日',
      readTime: '約8分',
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

  it('replaces the generic disclaimer intro with the exact two-paragraph source meaning while freezing every H2 section', () => {
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

  it('uses exactly the ten contracted H2 sections in order', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(headings);
  });

  it('keeps each exact FAQ answer once in the frontmatter and the loader, and moves FAQ 4 to 6 to columns 275 and 307', () => {
    for (const { q, a } of faq) {
      expect(countOccurrences(raw, a), q).toBe(1);
      expect(post?.faq?.map((item) => item.a), q).toContain(a);
      expect(post?.content, q).not.toContain(a);
    }
    expect(post?.faq).toHaveLength(3);

    for (const { q, a } of propertyFaq) {
      expect(raw, q).not.toContain(q);
      expect(raw, q).not.toContain(a);
      expect(countOccurrences(propertyRaw, a), q).toBe(1);
      expect(propertyPost?.faq?.map((item) => item.a), q).toContain(a);
    }
    for (const { q, a } of childrenFaq) {
      expect(raw, q).not.toContain(q);
      expect(raw, q).not.toContain(a);
      expect(countOccurrences(childrenRaw, a), q).toBe(1);
      expect(childrenPost?.faq?.map((item) => item.a), q).toContain(a);
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
        .find((paragraph) => paragraph.startsWith('同判決が違憲としたのは、')) ??
      '';

    expect(parsed.data.faq[2]?.a).toBe(faq3Answer);
    expect(detailedParagraph).toContain(
      '同判決が違憲としたのは、重大な事由が発生し、または継続した相当な期間を考慮しないまま、婚姻破綻について専ら責任を負う配偶者から離婚の機会を完全に奪い、個別事件で明らかに過酷となる範囲です。',
    );
    expect(countOccurrences(raw, responsibleSpousePhrase)).toBe(
      frozenResponsibleSpouseCount,
    );
    expect(countOccurrences(raw, staleResponsibleSpousePhrase)).toBe(0);
    expect(
      crypto.createHash('sha256').update(normalizedSection4).digest('hex'),
    ).toBe(frozenNormalizedSection4Sha256);
    expect(
      crypto.createHash('sha256').update(section5Onward).digest('hex'),
    ).toBe(frozenSection5OnwardSha256);
  });

  it('locks one exact substantive proposition in its assigned section for the twenty-four surviving legacy topics', () => {
    // Legacy topic 10 (case-duration guidance) was dropped from the hub on 2026-10-06 (hub trim)
    // and has no counterpart in columns 007, 275 or 307. Topics marked `column` now live in the
    // split-out part. Topics 2, 4, 7, 12, 17 and 21 are re-anchored to the sentence that now
    // carries the same proposition. The 2026-10-12 rewrite renamed the hub headings and reworded
    // every hub sentence, so the hub topics (1, 2, 4, 7, 8, 9, 11, 12, 13, 19, 21, 23, 24) are
    // anchored to the rewritten sentences; topic 8 moved from the court section to the children section.
    const removedLegacyTopics = [10];
    const legacyCoverage: Array<{
      number: number;
      heading: string;
      phrase: string;
      column?: 'property' | 'children';
    }> = [
      {
        number: 1,
        heading: headings[0],
        phrase:
          '協議離婚は、民法第1050条が定める書面、証人、戸政機関への登記の3つがそろって初めて効力を生じる身分行為です。合意書に署名しただけでは完了しません。',
      },
      {
        number: 2,
        heading: headings[4],
        phrase:
          '外国の離婚または裁判が台湾で承認され、または効力を持つかという問題と、台湾の戸政機関が特定の身分記録を登載できるかという問題は、同一ではありません。',
      },
      {
        number: 3,
        heading: propertyHeadings[0],
        column: 'property',
        phrase:
          '婚前の貯蓄による頭金やローン返済は、資金の出所に関する重要な証拠となり得ます。しかし、それだけで登記名義が移転し、又は後のすべての請求が決まるわけではありません。',
      },
      {
        number: 4,
        heading: headings[2],
        phrase:
          '本人出頭命令があっても、双方が常に対面で同じ部屋にそろって調停することになるわけではありません。',
      },
      {
        number: 5,
        heading: propertyHeadings[1],
        column: 'property',
        phrase:
          '行政機関が公表する平均消費支出は、参考資料となり得ても、第1057条の額を自動的に決める拘束的な固定算式ではありません。',
      },
      {
        number: 6,
        heading: propertyHeadings[0],
        column: 'property',
        phrase:
          '振込記録、購入契約、ローン資料、領収書、通信記録、税務・登記資料などは実務上重要ですが、どの理論についても一通の書類だけで結論が決まるとは限りません。',
      },
      {
        number: 7,
        heading: headings[5],
        phrase:
          '民法第1030条の1の夫婦残余財産差額分配請求権、第1056条の裁判離婚に伴う損害賠償、第1057条の無過失配偶者に対する困窮扶養、未成年の子の養育費は、発生要件も算定方法も期間も違います。',
      },
      {
        number: 8,
        heading: headings[6],
        phrase:
          'だからといって、「先に離婚して、子の問題は後で片づければよい」という一律の近道として勧めるわけではありません。',
      },
      {
        number: 9,
        heading: headings[1],
        phrase:
          '申請者、代理の可否、身分証明・戸籍資料、離婚書面といった実際の必要書類は、申請時点の内政部戸政司の離婚登記案内と、担当の戸政事務所への確認に基づいて準備します。',
      },
      {
        number: 11,
        heading: headings[3],
        phrase:
          '民法第1052条第1項は、裁判離婚の具体的な事由を次の10個定めています。',
      },
      {
        number: 12,
        heading: headings[3],
        phrase:
          '同項ただし書は、その事由が一方の配偶者に帰責し得るときは、他方の配偶者だけが請求できるとしています。',
      },
      {
        number: 13,
        heading: headings[2],
        phrase:
          '家事事件法の対象になる事件では、原則として、裁判所の調停が先に行われます。ただし、法令や事件の性質、手続上の地位によっては、例外や別の進み方があり得ます。すべての家事事件が動かせない一本の道を通る、とは言えません。',
      },
      {
        number: 14,
        heading: propertyHeadings[1],
        column: 'property',
        phrase:
          '民法第1057条は、無過失の配偶者が裁判離婚により生活困難となる場合の離婚後の扶養を規律します。',
      },
      {
        number: 15,
        heading: propertyHeadings[1],
        column: 'property',
        phrase:
          '未婚の同居だけでは、離婚に伴う権利、第1056条の損害賠償、第1057条の離婚後扶養は生じません。',
      },
      {
        number: 16,
        heading: childrenHeadings[0],
        column: 'children',
        phrase:
          '離婚合意書があるからといって、法定の要件を満たす後の裁判所の審理が当然に封じられるわけではありません。',
      },
      {
        number: 17,
        heading: childrenHeadings[1],
        column: 'children',
        phrase:
          '確定した養育費の裁判や、裁判所で成立した和解のうち、まだ履行されていない部分は、その後の事情の変更により元の内容どおりでは著しく不公平になる場合に、裁判所に変更を申し立てることができます（家事事件法第102条第1項、第107条第2項）。',
      },
      {
        number: 18,
        heading: childrenHeadings[1],
        column: 'children',
        phrase:
          '面会妨害があったという一事だけで、即時引渡し、実力行使、権利義務の自動変更、又は相手方の処罰が保証されるわけではありません。',
      },
      {
        number: 19,
        heading: headings[2],
        phrase:
          'すべての家事裁判に共通する単一の期限はありません。実際に出された文書に基づいて、正しい経路と期間を確かめます。',
      },
      {
        number: 20,
        heading: propertyHeadings[0],
        column: 'property',
        phrase:
          '不貞その他の婚姻破綻の責任が、所有権を自動的に奪い、又は差額分配の法定計算を機械的に書き換えるわけではありません。',
      },
      {
        number: 21,
        heading: headings[3],
        phrase:
          '有責配偶者の離婚を自動的に認める結論も、一律に禁じる結論も出していません。',
      },
      {
        number: 22,
        heading: propertyHeadings[1],
        column: 'property',
        phrase:
          '深刻な干渉や侮辱があったという一事だけでは、第三者に対する第1057条義務や離婚損害賠償が自動的に成立するわけではありません。',
      },
      {
        number: 23,
        heading: headings[3],
        phrase:
          '警察への行方不明届は重要な証拠になり得ますが、普遍的な法定前提ではありません。',
      },
      {
        number: 24,
        heading: headings[3],
        phrase:
          '数か月の別居だけでは、当然の離婚事由になりません。',
      },
      {
        number: 25,
        heading: childrenHeadings[2],
        column: 'children',
        phrase:
          '特定国で生活することに合意しただけでは、その国の物価水準だけで養育費が決まるわけではありません。',
      },
    ];

    expect(legacyCoverage.map(({ number }) => number)).toEqual(
      Array.from({ length: 25 }, (_, index) => index + 1).filter(
        (number) => !removedLegacyTopics.includes(number),
      ),
    );
    for (const { heading, phrase, column } of legacyCoverage) {
      const owner =
        column === 'property'
          ? { content: propertyParsed.content, loaded: propertyPost?.content }
          : column === 'children'
            ? { content: childrenParsed.content, loaded: childrenPost?.content }
            : { content: parsed.content, loaded: post?.content };
      expect(sectionBody(owner.content, heading)).toContain(phrase);
      expect(owner.loaded).toContain(phrase);
    }
  });

  it('locks the three paths and five separate cross-border questions', () => {
    const section = sectionBody(parsed.content, headings[0]);
    const requiredPhrases = [
      '協議離婚は、民法第1050条が定める書面、証人、戸政機関への登記の3つがそろって初めて効力を生じる身分行為です。',
      '裁判所の調停や和解による離婚は、調停または和解が成立した時点で婚姻関係が終わります。',
      '裁判離婚は、民法第1052条の定める事由があるときに、裁判所が判決で離婚を認める道です。',
      '求められている手続について、台湾の裁判所または行政機関に管轄・権限があるか。',
      '離婚、夫婦財産、子に関する事項に、どの法域の準拠法が適用されるか。',
      '外国の身分行為や裁判が、台湾で承認され、または効力を持つか。',
      '台湾の戸籍手続として、どのような登記と認証書類などが必要か。',
      '他国・地域で、さらにどのような登記、承認、執行の手続が必要か。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Article 1050 elements, foreign-document authentication and the qualified court-result registration rule', () => {
    const section = sectionBody(parsed.content, headings[1]);
    const requiredPhrases = [
      '民法第1050条は、協議離婚の要件として書面、証人、登記の3つを別々に求めています。',
      '協議離婚は書面で行わなければなりません。',
      '署名する証人は2名以上で、双方に離婚の真意があることを直接見聞きして確認した人でなければなりません。',
      '真意を確認していない人が後から形式的に署名するだけでは足りません。',
      '登記は効力発生の要件です。',
      'これがなければ、私的な書面だけでは台湾の協議離婚は完成しません。',
      '外国で作成された文書は、種類と作成地によっては、台湾の在外機関などの権限ある機関による認証が必要になる場合があります。公式案内が求めるときは、認証または公証を受けた中国語訳も併せて提出しなければなりません。',
      '申請期間は、一般に30日です（戸籍法第48条）。数え始めるのは、台湾の離婚判決が確定した日、または調停・和解が成立した日です。',
      '判決書や調停調書を受け取った日が、確定や成立より前だというだけなら、その日を一律に起算日にしてはいけません。',
      '期限を過ぎた申請も受理されます。',
      '遅れたこと自体が、すでに効力を生じた裁判所の離婚を失効させることはありません。',
      '書面で催告しても誰も申請しなければ、戸政機関は戸籍法第48条の2に基づき、要件を満たす裁判所の結果を職権で登記します。',
      'オンライン申請が使えるのは、法定の申請期間内だけです。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Family Act Article 13 and the type-specific effects and review routes', () => {
    const section = sectionBody(parsed.content, headings[2]);
    const requiredPhrases = [
      '家事事件法の対象になる事件では、原則として、裁判所の調停が先に行われます。',
      'すべての家事事件が動かせない一本の道を通る、とは言えません。',
      '家事事件法第13条が問題になるのは、裁判所が当事者または法定代理人に本人出頭を命じた場合に限られます。',
      '初回の過料は3万台湾元以下です。',
      '拘引はできません',
      '遠隔参加、手続の分離、代理人、安全上の配慮は、法令と個別事情に基づいて裁判所が判断します。当然に認められる権利でも、当然に禁じられる措置でもありません。',
      '不服申立てや上訴の経路と期間は、文書の種類、送達の有無と時期、確定したかどうか、手続上の地位によって変わります。',
      'すべての家事裁判に共通する単一の期限はありません。実際に出された文書に基づいて、正しい経路と期間を確かめます。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
    // The rewrite opens this subsection with a reader question; the Article 13 paragraph follows it.
    expect(paragraphAfter(parsed.content, '### 本人出頭', 0)).toBe(
      '調停では、必ず相手と同じ部屋に座らなければならないのでしょうか？',
    );
    expect(paragraphAfter(parsed.content, '### 本人出頭', 1)).toContain(
      '家事事件法第13条が問題になるのは、裁判所が当事者または法定代理人に本人出頭を命じた場合に限られます。',
    );
  });

  it('locks Article 1052 paragraph 1 grounds, including the 悪疾 wording, paragraph 2, and the constitutional qualification', () => {
    const section = sectionBody(parsed.content, headings[3]);
    const grounds = [
      '1. 重婚。',
      '2. 配偶者以外の者との合意による性交。',
      '3. 配偶者の一方による、他方への同居に耐え難い虐待。',
      '4. 配偶者の一方が他方の直系親族を虐待し、または配偶者一方の直系親族が他方を虐待して、共同生活に耐え難いこと。',
      '5. 配偶者の一方が悪意で他方を遺棄し、その状態が継続していること。',
      '6. 配偶者の一方が他方の殺害を企てたこと。',
      '7. 治癒不能の悪疾（法文は「有不治之惡疾」）。',
      '8. 重大で治癒不能の精神疾患。',
      '9. 生死不明が3年を超えること。',
      '10. 故意の犯罪により、6か月を超える有期懲役の確定判決を受けたこと。',
    ];
    const requiredPhrases = [
      '法文の古い疾病表現であり、人格や道徳上の評価ではありません。',
      '同条第2項は、この10事由とは別の規定です。',
      'この点を定めるただし書は、現行条文に残っています（2026年10月6日時点）。',
      '憲法法廷112年憲判字第4号は、ただし書を全面削除したわけではなく',
      '有責配偶者の離婚を自動的に認める結論も、一律に禁じる結論も出していません。',
      '同判決が違憲としたのは、重大な事由が発生し、または継続した相当な期間を考慮しないまま、婚姻破綻について専ら責任を負う配偶者から離婚の機会を完全に奪い、個別事件で明らかに過酷となる範囲です。',
      '第1項の各事由を書き換えたわけではありません。',
      '警察への行方不明届は重要な証拠になり得ますが、普遍的な法定前提ではありません。',
      '先に同居義務の履行を求める請求も、すべての事件に必須の法定前提とは限りません。',
      '数か月の別居だけでは、当然の離婚事由になりません。',
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
    expect(section).not.toContain('治癒不能の重い疾病');
    expect(raw).not.toContain('治癒不能の重い疾病');
  });

  it('locks foreign-record separation of questions, regional verification, and the recognition-versus-registration distinction', () => {
    const section = sectionBody(parsed.content, headings[4]);
    const requiredPhrases = [
      '外国での婚姻や離婚は、台湾の単一の手続にまとめられません。',
      '成立地が外国かどうか、台湾での承認や効力を求めるかどうか、台湾の戸籍手続として何が必要か、他国・地域にさらにどんな手続が残るかの4点は、それぞれ独立した問題として整理します。',
      '中国大陸、香港、マカオの文書には、通常の外国文書の認証とは別の確認制度が適用されます。',
      '外国の離婚または裁判が台湾で承認され、または効力を持つかという問題と、台湾の戸政機関が特定の身分記録を登載できるかという問題は、同一ではありません。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('keeps only the property and children summaries in the hub and links to columns 275 and 307', () => {
    const propertySection = sectionBody(parsed.content, headings[5]);
    const childrenSection = sectionBody(parsed.content, headings[6]);

    expect(propertySection).toContain(
      '民法第1030条の1の夫婦残余財産差額分配請求権、第1056条の裁判離婚に伴う損害賠償、第1057条の無過失配偶者に対する困窮扶養、未成年の子の養育費は、発生要件も算定方法も期間も違います。',
    );
    expect(propertySection).toContain(
      `財産、損害賠償、扶養は、${inlineColumnLinks[3]}で扱っています。`,
    );
    expect(childrenSection).toContain(
      '台湾民法第1055条と第1055条の1により、裁判所は未成年の子の最善の利益を基準として、権利義務の行使・負担、面会交流など子に関する事項を判断します。',
    );
    expect(childrenSection).toContain(
      '民法第1116条の2によれば、父母が未成年の子を扶養する義務は、離婚後も続きます。',
    );
    expect(childrenSection).toContain(
      `子どもの権利義務、養育費、面会交流、国境を越えた転居は、${inlineColumnLinks[4]}で扱っています。`,
    );
    expect(inlineColumnLinks[3]).toContain(`](${propertyHref})`);
    expect(inlineColumnLinks[4]).toContain(`](${childrenHref})`);
    expect(countOccurrences(raw, `](${propertyHref})`)).toBe(1);
    expect(countOccurrences(raw, `](${childrenHref})`)).toBe(1);
    expect(propertyPost?.slug).toBe(propertySlug);
    expect(childrenPost?.slug).toBe(childrenSlug);
    // Detailed Article 1017/1030-1 and Family Act Article 194 text now lives only in the parts.
    expect(parsed.content).not.toContain('第1017条');
    expect(parsed.content).not.toContain('慰撫金');
    expect(parsed.content).not.toContain('第194条');
    expect(parsed.content).not.toContain('著しく不公平');
  });

  it('keeps the six evidence categories in order, now as prose paragraphs, and the privacy prohibitions', () => {
    const section = sectionBody(parsed.content, headings[7]);

    let previousIndex = -1;
    for (const item of evidenceCategoryStarts) {
      const index = section.indexOf(item);
      expect(index, item).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    // Every category opens its own paragraph.
    const paragraphs = section.split('\n\n');
    for (const item of evidenceCategoryStarts) {
      expect(
        paragraphs.filter((paragraph) => paragraph.startsWith(item)),
        item,
      ).toHaveLength(1);
    }
    expect(section).toContain(
      '証拠を整えるときに見るのは、真正性、完全性、取得の経緯、関連性です。',
    );
    expect(section).toContain(
      '何が必要かは、請求、抗弁、管轄、準拠法、承認、期限のどれが問題になるかで変わります。',
    );
    expect(section).toContain('違法に証拠を作り出してはいけません。');
    expect(section).toContain(
      '都合のよい非公式な日付を起算日にしてはいけません。',
    );
    expect(section).toContain(
      '違法な監視、アカウントや端末への侵入、追跡、違法な録音、子の私生活の公開、報復、財産隠し、合意や裁判に反する子の連れ去りは勧められません。',
    );
  });

  it('uses exactly the five inline Japanese column links, ten official links and three Japanese internal links once and in order', () => {
    const markdownLinks = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g),
      (match) => match[0],
    );
    const externalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((https?:\/\/[^)]+)\)/g),
      (match) => match[1],
    );

    expect(markdownLinks).toEqual([
      ...inlineColumnLinks,
      ...officialLinks,
      ...internalLinks,
    ]);
    expect(externalTargets).toEqual(officialUrls);
    for (const url of officialUrls) {
      expect(countOccurrences(parsed.content, url)).toBe(1);
    }
    for (const link of [
      ...inlineColumnLinks,
      ...officialLinks,
      ...internalLinks,
    ]) {
      expect(countOccurrences(raw, link)).toBe(1);
    }
    expect(parsed.content).not.toMatch(/\]\(\/(?:ko|zh-hant|en)(?:\/|\))/);
  });

  it('links the hub to columns 275 and 307, and every inline Japanese column link resolves to a published Japanese column', () => {
    expect(raw).toContain(`](${propertyHref})`);
    expect(raw).toContain(`](${childrenHref})`);
    expect(propertyRaw).toContain(`](${hubHref})`);
    expect(childrenRaw).toContain(`](${hubHref})`);

    for (const link of inlineColumnLinks) {
      const linkedSlug = link.match(/\(\/ja\/columns\/([^)]+)\)$/)?.[1] ?? '';
      expect(getColumnPost(linkedSlug, 'ja'), link).toBeDefined();
    }
  });

  it('ends with the exact disclaimer and author and nothing else', () => {
    expect(raw.trimEnd().endsWith(exactEnding)).toBe(true);
    expect(raw.trimEnd()).toMatch(
      /個別の事案に対する法的助言ではありません。\n\n曾雋崴弁護士（Wei Tseng）$/,
    );
    expect(countOccurrences(raw, disclaimer)).toBe(1);
    expect(raw).not.toContain(staleDisclaimer);
    expect(countOccurrences(raw, author)).toBe(1);
  });

  it('freezes the exact visible Japanese character counts, calculated read time, and source digest', () => {
    const visibleJapaneseCount = countVisibleJapanese(parsed.content);
    const visibleKanaCount =
      extractPublicText(parsed.content).match(
        /[\p{Script=Hiragana}\p{Script=Katakana}]/gu,
      )?.length ?? 0;
    const sourceSha256 = crypto
      .createHash('sha256')
      .update(raw)
      .digest('hex');

    expect(visibleJapaneseCount).toBe(frozenVisibleJapaneseCount);
    expect(visibleKanaCount).toBe(frozenVisibleKanaCount);
    expect(parsed.data.read_time).toBe('約8分');
    expect(post?.readTime).toBe('約8分');
    expectApproximateJapaneseReadTime(parsed.data.read_time, parsed.content);
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
    expect(post?.content).toContain(`## ${headings[9]}`);
    expect(post?.content).toContain(disclaimer);
    expect(post?.content).toContain(author);
    expect(post?.content).not.toContain(`# ${title}`);
    expect(post?.content).not.toContain(bodyImage);
    expect(post?.category).toBe('legal');
    expect(post?.featuredImage).toBe(
      '/images/blog/007-taiwan-divorce-lawsuit-qna/featured-01.jpg',
    );
  });

  it('rejects exact legacy wording, semantic overclaims, promotional copy, and wrong identity in the hub and both parts', () => {
    const serialized = JSON.stringify({
      raw,
      parsedContent: parsed.content,
      postTitle: post?.title,
      postContent: post?.content,
      postFaq: post?.faq,
      propertyRaw,
      propertyPostContent: propertyPost?.content,
      propertyPostFaq: propertyPost?.faq,
      childrenRaw,
      childrenPostContent: childrenPost?.content,
      childrenPostFaq: childrenPost?.faq,
    });
    const allRaw = `${raw}\n${propertyRaw}\n${childrenRaw}`;
    const forbiddenLiterals = [
      '判決書または調停調書を受け取った日から30日以内に登記を完了しなければなりません',
      '現地法に従って処理すれば足ります',
      '台湾で婚姻を追加登記してから離婚する方法',
      '扶養費と財産分割の請求権はいずれも離婚日から5年以内に請求しなければなりません',
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
    expect(allRaw).not.toContain('受領した日をすべての30日期間の起算日とする');
    expect(allRaw).not.toContain('30日をオンライン申請だけの期間とし');
    expect(allRaw).not.toContain('期限徒過で離婚が失効');
    expect(allRaw).not.toContain('婚姻中財産を一律折半');
    expect(allRaw).not.toContain('平均消費支出が離婚後扶養を決める');
    expect(allRaw).not.toContain('ハーグ条約が台湾に当然適用される。');
    expect(allRaw).not.toContain('予見不能');
    expect(childrenRaw).toContain(
      '1980年のハーグ条約（国際的な子の奪取の民事上の側面に関する条約）は、台湾に当然適用されるわけではありません。',
    );
    expect(childrenRaw).toContain(
      '面会妨害があったという一事だけで、即時引渡し、実力行使、権利義務の自動変更、又は相手方の処罰が保証されるわけではありません。',
    );
  });

  it('contains no invisible characters, cross-locale routes, WIP markers, or Hangul leakage in the hub and both parts', () => {
    for (const [name, text, content] of [
      ['007', raw, parsed.content],
      ['275', propertyRaw, propertyParsed.content],
      ['307', childrenRaw, childrenParsed.content],
    ] as const) {
      expect(text, name).not.toContain('﻿');
      expect(text, name).not.toContain(' ');
      expect(text, name).not.toContain('​');
      expect(text, name).not.toContain('WIP');
      expect(content, name).not.toMatch(/\]\(\/(?:ko|zh-hant|en)(?:\/|\))/);
      expect(content, name).not.toMatch(/[가-힯]/);
      expect(content, name).toContain('曾雋崴');
      expect(content, name).not.toContain('曾俊瑋');
      expect(content, name).not.toMatch(
        /(?:reply promptly|お気軽にコメント|대만 이혼|台灣離婚程序)/,
      );

      // Reject residual English prose (5+ space-separated words). Allow short tokens
      // such as Q&A and the contracted author English name Wei Tseng.
      const publicTextWithoutAuthorEnglish = extractPublicText(content)
        .split('Wei Tseng')
        .join(' ');
      expect(publicTextWithoutAuthorEnglish, name).not.toMatch(
        /\b[A-Za-z]+(?:\s+[A-Za-z]+){4,}\b/,
      );
    }
  });

  it('retains title, FAQ, source URL, and complete body through loader and parse', () => {
    expect(post?.title).toBe(title);
    expect(post?.faq).toEqual(faq);
    expect(raw).toContain(sourceUrl);
    expect(post?.content).toContain(`## ${headings[0]}`);
    expect(post?.content).toContain(`## ${headings[9]}`);
    expect(post?.faq?.map((item) => item.a)).toContain(faq1Answer);
    expect(post?.faq?.map((item) => item.a)).toContain(faq3Answer);
    expect(post?.content).toContain(disclaimer);
    expect(post?.content).toContain(author);
    for (const link of inlineColumnLinks) {
      expect(post?.content).toContain(link);
    }
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

    expect(normalizedHtml).toContain(headings[0]);
    expect(normalizedHtml).toContain(headings[9]);
    expect(normalizedHtml).toContain(
      '申請期間は、一般に30日です（戸籍法第48条）。',
    );
    expect(normalizedHtml).toContain('曾雋崴');

    for (const link of [
      ...inlineColumnLinks,
      ...officialLinks,
      ...internalLinks,
    ]) {
      const match = link.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      expect(match).not.toBeNull();
      const [, label, url] = match!;
      expect(normalizedHtml).toContain(label);
      expect(normalizedHtml).toContain(url);
    }
  });
});

describe('Japanese family column 275 — property, damages and support moved out of column 007', () => {
  const propertyImage =
    '../images/275-taiwan-divorce-property-damages-support/featured-01.webp';
  const propertyImageAlt =
    '木のテーブルに置かれた家の鍵と、二つに分けて重ねた白紙の束';
  const propertyBodyImage = `![${propertyImageAlt}](${propertyImage})`;
  const propertyInlineLinks = [
    '[日台夫婦の財産はどちらの法律で決まるか：法定財産制と剰余財産の分配](/ja/columns/japan-taiwan-couple-marital-property-governing-law)',
    `[${childrenTitle}](${childrenHref})`,
    `[${title}](${hubHref})`,
  ];
  const article1017Paragraph =
    '民法第1017条は、夫婦の財産を婚前財産と婚後財産に区分しています。婚前の財産か婚後の財産かを証明できない財産は婚後財産と、夫婦のどちらの財産かを証明できない財産は夫婦の共有と推定されます。これらは財産制の分析に有用ですが、所有権の帰属、借名登記や贈与の成否、夫婦残余財産差額分配の最終結論を、単独で自動決定するものではありません。振込記録、購入契約、ローン資料、領収書、通信記録、税務・登記資料などは実務上重要ですが、どの理論についても一通の書類だけで結論が決まるとは限りません。';
  const adjustmentParagraph =
    '夫婦の一方に婚姻生活への貢献または協力がなかった場合や、その他の事情があって均等に分配すると不公平になる場合には、裁判所は分配額を調整し、または免除することができます。裁判所はこの判断にあたり、家事労働、子の養育、家庭に対する全体的な協力の状況、共同生活および別居の期間、婚姻後の財産を取得した時期、双方の経済力などを総合して考慮します。不貞その他の婚姻破綻の責任が、所有権を自動的に奪い、又は差額分配の法定計算を機械的に書き換えるわけではありません。外国人配偶者であるという理由だけで、異なる法定算式が適用されるわけでもありません。';

  it('publishes the exact complete frontmatter, the moved FAQ pair and the loaded identity', () => {
    expect(propertyParsed.data).toEqual({
      title: propertyTitle,
      summary:
        '民法第1030条の1の夫婦残余財産差額分配請求権、第1056条の裁判離婚に伴う損害賠償、第1057条の無過失配偶者に対する困窮扶養および未成年の子の養育費は、発生要件、算定方法および期間が異なります。',
      published: '2026-10-06',
      lastmod: '2026-10-06',
      date_display: '2026年10月6日',
      read_time: '約5分',
      categories: ['台湾法律情報'],
      topic: 'family',
      featured_image: propertyImage,
      featured_image_alt: propertyImageAlt,
      featured_image_caption:
        'AIで生成した架空の情景です。実在の企業、施設、人物を写したものではありません。',
      faq: propertyFaq,
      audience: ['ja'],
    });
    expect(propertyPost).toMatchObject({
      slug: propertySlug,
      title: propertyTitle,
      readTime: '約5分',
      category: 'legal',
      faq: propertyFaq,
      featuredImage:
        '/images/blog/275-taiwan-divorce-property-damages-support/featured-01.webp',
    });
    expect(
      fs.existsSync(
        path.join(
          process.cwd(),
          'public/images/blog/275-taiwan-divorce-property-damages-support/featured-01.webp',
        ),
      ),
    ).toBe(true);
    expectApproximateJapaneseReadTime(
      propertyParsed.data.read_time,
      propertyParsed.content,
    );
  });

  it('uses the sole exact H1 followed immediately by the sole contracted image and the five contracted H2 sections', () => {
    expect(
      Array.from(
        propertyParsed.content.matchAll(/^# (.+)$/gm),
        (match) => match[1],
      ),
    ).toEqual([propertyTitle]);
    expect(propertyParsed.content).toMatch(
      new RegExp(
        `^\\n# ${propertyTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\n${propertyBodyImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\n`,
      ),
    );
    expect(
      Array.from(
        propertyParsed.content.matchAll(/!\[[^\]]*\]\([^)]+\)/g),
        (match) => match[0],
      ),
    ).toEqual([propertyBodyImage]);
    expect(propertyPost?.content).not.toMatch(/!\[[^\]]*\]\([^)]+\)/);
    expect(
      Array.from(
        propertyParsed.content.matchAll(/^## (.+)$/gm),
        (match) => match[1],
      ),
    ).toEqual(propertyHeadings);
  });

  it('locks Article 1017 and Article 1030-1 classification, exclusions, adjustment, and claim-specific periods', () => {
    const section = sectionBody(propertyParsed.content, propertyHeadings[0]);
    const requiredPhrases = [
      '住宅その他の特定財産については、少なくとも次の3点を分けます。',
      article1017Paragraph,
      '各配偶者の婚姻中に取得した財産について、法定の除外と関係債務を踏まえた純残余額を算定し、その差額を原則として均等に分配します。',
      '相続その他無償で取得した財産および慰撫金は、法令の定めるところにより除外されます。',
      '婚姻中に取得したすべての財産を一律に折半する制度ではなく',
      adjustmentParagraph,
      '残余財産の差額を知った時から2年、法定財産制関係が消滅した時から5年の行使期間により制限されます。',
      'この2年・5年の規律を、損害賠償、離婚後の扶養、子の養育費、所有権その他の請求に一律適用してはなりません。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
      expect(propertyPost?.content).toContain(phrase);
    }
    // Article 1017 states both presumptions; Article 1030-1 uses the current fairness test, not 著しく不公平.
    expect(article1017Paragraph).toContain(
      '婚前の財産か婚後の財産かを証明できない財産は婚後財産と、夫婦のどちらの財産かを証明できない財産は夫婦の共有と推定されます。',
    );
    expect(propertyRaw).not.toContain('著しく不公平');
    expect(propertyPost?.content).not.toContain('著しく不公平');
    expect(propertyRaw).not.toContain('財産の隠匿・処分');
  });

  it('separates Articles 1056 and 1057, child support, property, cohabitation, and third-party claims', () => {
    const section = sectionBody(propertyParsed.content, propertyHeadings[1]);
    const requiredPhrases = [
      '民法第1056条の損害賠償は、裁判離婚について責任を負う相手方に対する財産上の損害と、法定要件（同条第2項但書：請求者に過失がないこと）を満たす非財産上の損害とを区別して検討する権利です。',
      '民法第1057条は、無過失の配偶者が裁判離婚により生活困難となる場合の離婚後の扶養を規律します。',
      '民法第1116条の2は、離婚後も父母が未成年の子に対して扶養義務を負い続けることを明らかにします。',
      '子の養育費は、第1057条の離婚後扶養とは別の義務です。',
      '行政機関が公表する平均消費支出は、参考資料となり得ても、第1057条の額を自動的に決める拘束的な固定算式ではありません。',
      '未婚の同居だけでは、離婚に伴う権利、第1056条の損害賠償、第1057条の離婚後扶養は生じません。',
      '姻族その他の第三者は、当然に第1057条の義務や離婚損害賠償責任を負いません。',
      'すべての請求を「離婚から5年」という単一の期間で一括処理してはなりません。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
      expect(propertyPost?.content).toContain(phrase);
    }
  });

  it('keeps the property and debt evidence paragraph that left the hub checklist', () => {
    const section = sectionBody(propertyParsed.content, propertyHeadings[2]);

    expect(section).toContain(
      '財産・債務資料：夫婦財産契約の有無、資産・負債の一覧、登記名義、取得原因、譲渡・ローン・税務・評価資料、贈与、借名、返還その他の理論を裏付ける資料を集めます。特定財産の所有権に関する請求と、夫婦残余財産差額分配の計算資料を区別します。',
    );
  });

  it('links back to the hub and column 307, keeps its two official links, and ends with the exact disclaimer and author', () => {
    const markdownLinks = Array.from(
      propertyParsed.content.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g),
      (match) => match[0],
    );

    expect(markdownLinks).toEqual([
      ...propertyInlineLinks,
      officialLinks[0],
      officialLinks[1],
      internalLinks[0],
      internalLinks[2],
    ]);
    expect(propertyInlineLinks[1]).toContain(`](${childrenHref})`);
    expect(propertyInlineLinks[2]).toContain(`](${hubHref})`);
    expect(countOccurrences(propertyRaw, `](${hubHref})`)).toBe(1);
    expect(countOccurrences(propertyRaw, `](${childrenHref})`)).toBe(1);
    for (const link of propertyInlineLinks) {
      const linkedSlug = link.match(/\(\/ja\/columns\/([^)]+)\)$/)?.[1] ?? '';
      expect(getColumnPost(linkedSlug, 'ja'), link).toBeDefined();
    }
    expect(propertyRaw.trimEnd().endsWith(`- ${internalLinks[2]}

${propertyDisclaimer}

${author}`)).toBe(true);
    expect(countOccurrences(propertyRaw, propertyDisclaimer)).toBe(1);
    expect(countOccurrences(propertyRaw, author)).toBe(1);
  });
});

describe('Japanese family column 307 — children, support and relocation moved out of column 007', () => {
  const childrenImage =
    '../images/307-taiwan-divorce-children-custody-support-visitation/featured-01.webp';
  const childrenImageAlt =
    '木のベンチのそばに置かれた子ども用の靴とキャンバス地のリュック、閉じたノート';
  const childrenBodyImage = `![${childrenImageAlt}](${childrenImage})`;
  const childrenInlineLinks = [
    '[台湾民法第1055条](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1055)',
    '[第1055条の1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1055-1)',
    `[${title}](${hubHref})`,
    `[${propertyTitle}](${propertyHref})`,
    '[台湾人配偶者との離婚後、子どもと日本で暮らす計画：住まい・面会・費用の整理](/ja/columns/taiwanese-spouse-divorce-cross-border-parenting)',
    '[ハーグ条約が使えない台湾へ子どもが連れて行かれたとき、家事法庭でできること](/ja/columns/child-abduction-taiwan-non-hague-japan)',
  ];

  it('publishes the exact complete frontmatter, the moved FAQ and the loaded identity', () => {
    expect(childrenParsed.data).toEqual({
      title: childrenTitle,
      summary:
        '台湾民法第1055条および第1055条の1によれば、裁判所は未成年の子の最善の利益を基準として、権利義務の行使・負担、面会交流その他の子に関する事項を判断します。民法第1116条の2によれば、父母の未成年の子に対する扶養義務は、離婚後も継続します。',
      published: '2026-10-06',
      lastmod: '2026-10-06',
      date_display: '2026年10月6日',
      read_time: '約6分',
      categories: ['台湾法律情報'],
      topic: 'family',
      featured_image: childrenImage,
      featured_image_alt: childrenImageAlt,
      featured_image_caption:
        'AIで生成した架空の場面です。実在の家庭や人物を撮影・再現した画像ではありません。',
      faq: childrenFaq,
      audience: ['ja'],
    });
    expect(childrenPost).toMatchObject({
      slug: childrenSlug,
      title: childrenTitle,
      readTime: '約6分',
      category: 'legal',
      faq: childrenFaq,
      featuredImage:
        '/images/blog/307-taiwan-divorce-children-custody-support-visitation/featured-01.webp',
    });
    expect(
      fs.existsSync(
        path.join(
          process.cwd(),
          'public/images/blog/307-taiwan-divorce-children-custody-support-visitation/featured-01.webp',
        ),
      ),
    ).toBe(true);
    expectApproximateJapaneseReadTime(
      childrenParsed.data.read_time,
      childrenParsed.content,
    );
  });

  it('uses the sole exact H1 followed immediately by the sole contracted image and the six contracted H2 sections', () => {
    expect(
      Array.from(
        childrenParsed.content.matchAll(/^# (.+)$/gm),
        (match) => match[1],
      ),
    ).toEqual([childrenTitle]);
    expect(childrenParsed.content).toMatch(
      new RegExp(
        `^\\n# ${childrenTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\n${childrenBodyImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\n`,
      ),
    );
    expect(
      Array.from(
        childrenParsed.content.matchAll(/!\[[^\]]*\]\([^)]+\)/g),
        (match) => match[0],
      ),
    ).toEqual([childrenBodyImage]);
    expect(childrenPost?.content).not.toMatch(/!\[[^\]]*\]\([^)]+\)/);
    expect(
      Array.from(
        childrenParsed.content.matchAll(/^## (.+)$/gm),
        (match) => match[1],
      ),
    ).toEqual(childrenHeadings);
  });

  it('locks Articles 1055 and 1055-1, the full Taiwan concept, review, and unresolved issues', () => {
    const section = sectionBody(childrenParsed.content, childrenHeadings[0]);
    const requiredPhrases = [
      '台湾法が中心に置くのは、未成年の子に対する権利義務の行使または負担です。',
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
      expect(childrenPost?.content).toContain(phrase);
    }
  });

  it('locks Article 1116-2 support, Family Act Articles 102 and 107 modification, and Article 194 enforcement qualifications', () => {
    const section = sectionBody(childrenParsed.content, childrenHeadings[1]);
    const requiredPhrases = [
      '民法第1116条の2によれば、父母の未成年の子に対する扶養義務は、離婚後も継続します。',
      '子の養育費は親子間の義務であり、民法第1057条に基づく元配偶者に対する離婚後の扶養とは別です。',
      '子の生活費、教育費、医療費および特別な必要、父母それぞれの収入、財産、扶養能力および実際の監護分担',
      '確定した養育費の裁判や、裁判所で成立した和解のうち、まだ履行されていない部分は、その後の事情の変更により元の内容どおりでは著しく不公平になる場合に、裁判所に変更を申し立てることができます（家事事件法第102条第1項、第107条第2項）。',
      '家事事件法第194条に基づく直接強制または間接強制も、子の最善の利益に従って方法を選びます。',
      '面会妨害があったという一事だけで、即時引渡し、実力行使、権利義務の自動変更、又は相手方の処罰が保証されるわけではありません。',
      '養育費の不払いを理由に面会を私的に拒絶したり、面会妨害を理由に養育費の支払を一方的に停止したりするなどの自力救済は、勧められません。',
      '緊急の安全問題がある場合には、事件類型と要件に応じて、適切な保全措置または暫定的措置の利用可能性を個別に確認します。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
      expect(childrenPost?.content).toContain(phrase);
    }
    // The modification rule is limited to final rulings and court settlements and is not a foreseeability test.
    expect(childrenRaw).not.toContain('予見不能');
    expect(childrenRaw).not.toContain('唯一の要件');
  });

  it('locks the seven relocation questions, non-treaty shortcut, and no unauthorized removal', () => {
    const section = sectionBody(childrenParsed.content, childrenHeadings[2]);
    const requiredPhrases = [
      '子を伴う国境を越えた転居は、一国の物価水準、単一の国籍、又は条約の名称だけで決まる問題ではありません。',
      '1. 居所および旅行を決める権限。',
      '2. 他方の親の同意または裁判所の判断。',
      '3. 子の最善の利益と継続的な面会交流。',
      '4. 旅券、出入国、移民および各法域での手続。',
      '5. 承認および執行。',
      '6. 実際の移動・面会費用と双方の資力。',
      '7. 緊急保護。',
      '特定国で生活することに合意しただけでは、その国の物価水準だけで養育費が決まるわけではありません。',
      '1980年のハーグ条約（国際的な子の奪取の民事上の側面に関する条約）は、台湾に当然適用されるわけではありません。',
      '国境を越えた移動や返還の問題を、条約の名称や一国の費用表だけに還元してはなりません。',
      '既存の合意または裁判に反して子を連れ去り、または帰還させない行為は勧められません。',
      '国籍や旅券の所持だけで、転居権限が自動的に決まるわけではありません。',
    ];

    let previousIndex = -1;
    for (const phrase of requiredPhrases.filter((item) => /^\d\. /.test(item))) {
      const index = section.indexOf(phrase);
      expect(index, phrase).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
      expect(childrenPost?.content).toContain(phrase);
    }
  });

  it('keeps the child and support evidence items that left the hub checklist', () => {
    const section = sectionBody(childrenParsed.content, childrenHeadings[3]);

    expect(section).toContain(
      '1. 子の状況。 年齢、健康、教育、居所、養育実績、適切な範囲での意向、各親との関係、安全または安定上の必要を整理します。識別情報や学校・医療情報は、プライバシーに配慮して扱います。',
    );
    expect(section).toContain(
      '2. 養育費・面会交流資料。 現行の合意または裁判、支払履歴、支出記録、面会交流の経緯、渡航関係書類、転居案とその実務的根拠を残します。',
    );
  });

  it('links back to the hub and column 275, keeps its four official links, and ends with the exact disclaimer and author', () => {
    const markdownLinks = Array.from(
      childrenParsed.content.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g),
      (match) => match[0],
    );

    expect(markdownLinks).toEqual([
      ...childrenInlineLinks,
      officialLinks[0],
      officialLinks[1],
      officialLinks[2],
      officialLinks[4],
      internalLinks[0],
      internalLinks[2],
    ]);
    expect(childrenInlineLinks[2]).toContain(`](${hubHref})`);
    expect(childrenInlineLinks[3]).toContain(`](${propertyHref})`);
    expect(countOccurrences(childrenRaw, `](${hubHref})`)).toBe(1);
    expect(countOccurrences(childrenRaw, `](${propertyHref})`)).toBe(1);
    for (const link of childrenInlineLinks.filter((item) =>
      item.includes('(/ja/columns/'),
    )) {
      const linkedSlug = link.match(/\(\/ja\/columns\/([^)]+)\)$/)?.[1] ?? '';
      expect(getColumnPost(linkedSlug, 'ja'), link).toBeDefined();
    }
    expect(childrenRaw.trimEnd().endsWith(`- ${internalLinks[2]}

${childrenDisclaimer}

${author}`)).toBe(true);
    expect(countOccurrences(childrenRaw, childrenDisclaimer)).toBe(1);
    expect(countOccurrences(childrenRaw, author)).toBe(1);
  });
});
