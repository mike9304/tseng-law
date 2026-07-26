import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/003-taiwan-traffic-accident-procedure.md',
);
const rawBytes = fs.readFileSync(columnPath);
const raw = rawBytes.toString('utf8');

const immutablePrefixBytes = 1_170;
const immutablePrefixSha256 =
  '52de958b4ea59b3f08f8356fcabfaf26c6fbee8797e5d22965c755a51f6b24c4';
const immutableQ1ToQ5PrefixBytes = 9_308;
const immutableQ1ToQ5PrefixSha256 =
  '46c9e6a90b38f2244144c1773a8130e3bbe0d1ae9572cc9f6b0bf5cd04589888';
const immutableQ1ToQ10PrefixBytes = 15_708;
const immutableQ1ToQ10PrefixSha256 =
  'd093db3695586b80f5e8a0e14add27597fee4dc8222f8e9955c8cd4c43ff84c2';
const q6ByteIndex = immutableQ1ToQ5PrefixBytes;
const q11ByteIndex = immutableQ1ToQ10PrefixBytes;
const q16Marker =
  'Q16. 事故発生後、保険会社にすべてを任せられますか？';
const immutableQ16ToQ20TailBytes = 4_511;
const immutableQ16ToQ20TailSha256 =
  'ffb2588ec61e6a544ba1f1fd1d9f60d39460bac89367e6dacdf88aa0ba8dc0ad';
const localizedPrefixBytes = rawBytes.subarray(0, immutablePrefixBytes);
const localizedPrefix = localizedPrefixBytes.toString('utf8');
const parsedPrefix = matter(localizedPrefix);
const bodyPrefix = parsedPrefix.content;
const q1ToQ5 =
  q6ByteIndex <= immutablePrefixBytes
    ? ''
    : rawBytes.subarray(immutablePrefixBytes, q6ByteIndex).toString('utf8');

const expectedTitle = '台湾交通事故対応Q&A：現場対応・過失・示談・損害賠償';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-traffic-accident-procedure';
const featuredImage =
  '../images/003-taiwan-traffic-accident-procedure/featured-01.jpg';
const incidentImage =
  '../images/003-taiwan-traffic-accident-procedure/img-01.jpg';

const q1Heading = '## Q1. 事故後に現場を離れてもよいですか？';
const q2Heading = '## Q2. まずどのような証拠を保全すべきですか？';
const q3Heading =
  '## Q3. 負傷した場合、どのような請求と期限を確認すべきですか？';
const q4Heading =
  '## Q4. 双方に過失がある場合、刑事責任と民事責任はどのように判断されますか？';
const q5Heading = '## Q5. 示談書には何を記載すべきですか？';
const sourceHeading = '### Q1–Q5 公式資料';
const contractedHeadings = [
  q1Heading,
  q2Heading,
  q3Heading,
  q4Heading,
  q5Heading,
] as const;

const q6Heading = '## Q6. 事故責任はどのように認定されますか？';
const q7Heading = '## Q7. 事故後、どのような損害を請求できますか？';
const q8Heading =
  '## Q8. 治療が続いている場合、医療費資料はどのように提出しますか？';
const q9Heading =
  '## Q9. 専門職による介護費と家族による介護費は、どのように立証しますか？';
const q10Heading =
  '## Q10. 治療のための交通費は、どのように立証しますか？';
const q6ToQ10SourceHeading = '### Q6–Q10 公式資料';
const q6ToQ10ContractedHeadings = [
  q6Heading,
  q7Heading,
  q8Heading,
  q9Heading,
  q10Heading,
] as const;

const q11Heading =
  '## Q11. 治療・回復期間中の逸失収入は、どのように立証しますか？';
const q12Heading =
  '## Q12. 労働能力低下による損害は、どのように立証しますか？';
const q13Heading =
  '## Q13. 非財産的損害に対する慰謝料は、どのように判断されますか？';
const q14Heading =
  '## Q14. 業務中の事故では、使用者にも民事責任を問えますか？';
const q15Heading =
  '## Q15. どのような自動車保険の給付・補償を確認すべきですか？';
const q11ToQ15SourceHeading = '### Q11–Q15 公式資料';
const q11ToQ15ContractedHeadings = [
  q11Heading,
  q12Heading,
  q13Heading,
  q14Heading,
  q15Heading,
] as const;

const q11ToQ15OfficialSourceUrls = [
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=193&pcode=B0000001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=216&pcode=B0000001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=217&pcode=B0000001',
  'https://data.judicial.gov.tw/opendl/JDocFile/TPHV/109%2C%E4%B8%8A%E6%98%93%2C644%2C20220215%2C1.pdf',
  'https://data.judicial.gov.tw/opendl/JDocFile/TPHV/109%2C%E4%B8%8A%E6%98%93%2C477%2C20211229%2C1.pdf',
  'https://gdgt.judicial.gov.tw/judtool/wkc/GDGT03.htm',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=195&pcode=B0000001',
  'https://data.judicial.gov.tw/opendl/JDocFile/CLEV/112%2C%E5%A3%A2%E7%B0%A1%2C236%2C20231116%2C1.pdf',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=188&pcode=B0000001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=284&pcode=C0000001',
  'https://law.fsc.gov.tw/LawContent.aspx?id=FL006889',
  'https://law.fsc.gov.tw/LawContent.aspx?id=FL006901&kw=1200',
  'https://law.fsc.gov.tw/LawContent.aspx?id=FL047990',
] as const;

const prohibitedQ11ToQ15Copy = [
  '裁判官は請求を認めません',
  '最も大きな比重を占めます',
  '私は弁護士として',
  '必ず請求するよう勧めています',
  'すべての給与の10%',
  '退職年齢に至るまで',
  '65歳になるまで',
  '用いる必要があります',
  '1,693,928',
  '鑑定費用が高くない',
  '1〜2万元',
  '通常原告が想像するより少ない',
  '数十万元が一般的な金額',
  '数百万円の慰謝料を期待しない方がよい',
  '会社は雇用責任を負うことになります',
  '会社は通常加害者より多くの資産',
  '会社も併せて訴えるのがよい',
  '加害者本人に対してのみ可能',
  'すべての人が加入しなければならない',
  '失踪または死亡',
  '200万元',
  '残りの部分を補償します',
  '自車運転者の負傷は保障しません',
] as const;

const q6ToQ10OfficialSourceUrls = [
  'https://mojlaw.moj.gov.tw/LawContentExtent.aspx?LSID=FL025820&LawNo=3',
  'https://mojlaw.moj.gov.tw/LawContent.aspx?TypeSort=2&lawNumber=11&lsid=FL025820&media=print',
  'https://www.mvdis.gov.tw/files/m3/vil/cac/cacApply2.pdf',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=184&pcode=B0000001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=192&pcode=B0000001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=193&pcode=B0000001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=194&pcode=B0000001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=195&pcode=B0000001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=196&pcode=B0000001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=216&pcode=B0000001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=504&pcode=C0010001',
  'https://www.judicial.gov.tw/tw/dl-251103-0e248a7b9e4248d7ae31fcdeda58ac07.html',
  'https://data.judicial.gov.tw/opendl/JDocFile/CYEV/111%2C%E5%98%89%E7%B0%A1%2C850%2C20230111%2C1.pdf',
  'https://data.judicial.gov.tw/opendl/JDocFile/TNEV/110%2C%E5%8D%97%E7%B0%A1%2C1212%2C20220210%2C1.pdf',
] as const;

const prohibitedQ6ToQ10Copy = [
  '事故発生後の責任分析手続きは次のとおりです',
  '学術鑑定結果',
  '逢甲大学',
  '過失割合が正確に算出されます',
  'ほぼ覆す余地はなく',
  '裁判官は一般に最終鑑定機関の判断を尊重します',
  '医療領収書を追加提出すると、裁判費用を追加で支払う必要があります',
  '裁判官は介護費を認めます',
  '親族が介護し実際の金銭支出がなくても、裁判官は介護費請求を認めます',
  'タクシー領収書があればなお良いです',
] as const;

const legacyNineItemLabels = [
  '1. 医療費',
  '2. 介護費',
  '3. 生活に必要な追加費用',
  '4. 就労不能損失',
  '5. 労働力喪失損害',
  '6. 葬儀費',
  '7. 扶養費',
  '8. 精神的慰謝料',
  '9. 財産損失',
] as const;

const officialSourceUrls = [
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=62&pcode=K0040012',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=185-4&pcode=C0000001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=284&pcode=C0000001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=287&pcode=C0000001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=237&pcode=C0010001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=238&pcode=C0010001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=487&pcode=C0010001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=488&pcode=C0010001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=503&pcode=C0010001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=504&pcode=C0010001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=197&pcode=B0000001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=217&pcode=B0000001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=736&pcode=B0000001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=737&pcode=B0000001',
  'https://168.motc.gov.tw/theme/car/post/2002211806152',
  'https://www.npa.gov.tw/ch/app/data/view?id=2306&module=wg076&serno=ea678c1a-5035-49bf-8fa3-d0926bb3a889',
  'https://wwwcdn.npa.gov.tw/ch/app/faq/view?id=2144&module=faq&serno=A1084129',
] as const;

const prohibitedQ1ToQ5Copy = [
  '救急車と警察が現場に到着するまでその場にいる必要があります',
  '責任の所在が明確になるまで待たなければなりません',
  'もし警察に通報しないことにした場合',
  '相手方が同意した場合に限り現場を離れる',
  '直ちに携帯電話を取り出し',
  '警察の漏れに備え',
  '告訴期限は6か月です',
  '期限は2年です',
  '裁判費用を支払わない方法',
  '弁護士はまず刑事告訴を提起',
  'いずれか一方にでも過失があれば過失致傷罪が成立します',
  '100万元',
  '50万元',
  '双方が再び民刑事上の責任を追及しない',
  '必ず告訴を撤回',
  'これ以上いかなる請求もできなくなります',
  '相手方にこれ以上請求できません',
] as const;

const imageNodes = Array.from(
  bodyPrefix.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g),
  (match) => ({ alt: match[1], src: match[2] }),
);
const visiblePrefixProse = bodyPrefix.replace(/!\[[^\]]*\]\([^)]+\)/g, '');
const secondImageNode = imageNodes[1]
  ? `![${imageNodes[1].alt}](${imageNodes[1].src})`
  : '';
const secondImageEnd =
  secondImageNode === '' ? -1 : bodyPrefix.indexOf(secondImageNode);
const introduction =
  secondImageEnd === -1
    ? ''
    : bodyPrefix.slice(secondImageEnd + secondImageNode.length);

const prohibitedStaleCopy = [
  'こんにちは',
  '台湾弁護士の曾雋崴',
  '多くの交通事故事件を扱った経験',
  '知見を共有したい',
  '本日は',
  'Q&A形式',
  '効率的に',
] as const;

function countOccurrences(value: string, needle: string) {
  return value.split(needle).length - 1;
}

function sectionBetween(startHeading: string, endHeading: string) {
  const start = q1ToQ5.indexOf(startHeading);
  const end = q1ToQ5.indexOf(endHeading);
  return start === -1 || end === -1 || end <= start
    ? ''
    : q1ToQ5.slice(start, end);
}

function q6ToQ10SectionBetween(startHeading: string, endHeading: string) {
  const start = q6ToQ10.indexOf(startHeading);
  const end = q6ToQ10.indexOf(endHeading);
  return start === -1 || end === -1 || end <= start
    ? ''
    : q6ToQ10.slice(start, end);
}

function q11ToQ15SectionBetween(startHeading: string, endHeading: string) {
  const start = q11ToQ15.indexOf(startHeading);
  const end = q11ToQ15.indexOf(endHeading);
  return start === -1 || end === -1 || end <= start
    ? ''
    : q11ToQ15.slice(start, end);
}

function containsOrderedLinePrefixes(
  value: string,
  prefixes: readonly string[],
) {
  let offset = 0;
  for (const prefix of prefixes) {
    const match = new RegExp(
      `^${escapeRegExp(prefix)}.*$`,
      'm',
    ).exec(value.slice(offset));
    if (!match || match.index === undefined) {
      return false;
    }
    offset += match.index + match[0].length;
  }
  return true;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const q1 = sectionBetween(q1Heading, q2Heading);
const q2 = sectionBetween(q2Heading, q3Heading);
const q3 = sectionBetween(q3Heading, q4Heading);
const q4 = sectionBetween(q4Heading, q5Heading);
const q5 = sectionBetween(q5Heading, sourceHeading);
const sourceBlockStart = q1ToQ5.indexOf(sourceHeading);
const sourceBlock =
  sourceBlockStart === -1 ? '' : q1ToQ5.slice(sourceBlockStart);
const q6ToQ10 =
  q11ByteIndex <= q6ByteIndex
    ? ''
    : rawBytes.subarray(q6ByteIndex, q11ByteIndex).toString('utf8');
const q6 = q6ToQ10SectionBetween(q6Heading, q7Heading);
const q7 = q6ToQ10SectionBetween(q7Heading, q8Heading);
const q8 = q6ToQ10SectionBetween(q8Heading, q9Heading);
const q9 = q6ToQ10SectionBetween(q9Heading, q10Heading);
const q10 = q6ToQ10SectionBetween(q10Heading, q6ToQ10SourceHeading);
const q6ToQ10SourceBlockStart = q6ToQ10.indexOf(q6ToQ10SourceHeading);
const q6ToQ10SourceBlock =
  q6ToQ10SourceBlockStart === -1
    ? ''
    : q6ToQ10.slice(q6ToQ10SourceBlockStart);
const q16ByteIndex = rawBytes.indexOf(Buffer.from(q16Marker, 'utf8'));
const q11ToQ15 =
  q16ByteIndex <= q11ByteIndex
    ? ''
    : rawBytes.subarray(q11ByteIndex, q16ByteIndex).toString('utf8');
const q11 = q11ToQ15SectionBetween(q11Heading, q12Heading);
const q12 = q11ToQ15SectionBetween(q12Heading, q13Heading);
const q13 = q11ToQ15SectionBetween(q13Heading, q14Heading);
const q14 = q11ToQ15SectionBetween(q14Heading, q15Heading);
const q15 = q11ToQ15SectionBetween(q15Heading, q11ToQ15SourceHeading);
const q11ToQ15SourceBlockStart = q11ToQ15.indexOf(
  q11ToQ15SourceHeading,
);
const q11ToQ15SourceBlock =
  q11ToQ15SourceBlockStart === -1
    ? ''
    : q11ToQ15.slice(q11ToQ15SourceBlockStart);

describe('Japanese traffic column 003 — metadata and introduction localization boundary', () => {
  it('preserves the completed introduction and Q1–Q10 prefixes plus the exact Q16-to-Q20 tail byte-for-byte', () => {
    expect(localizedPrefixBytes.byteLength).toBe(immutablePrefixBytes);
    expect(
      crypto.createHash('sha256').update(localizedPrefixBytes).digest('hex'),
    ).toBe(immutablePrefixSha256);

    const immutableQ1ToQ5Prefix = rawBytes.subarray(
      0,
      immutableQ1ToQ5PrefixBytes,
    );
    expect(q6ByteIndex).toBeGreaterThan(immutablePrefixBytes);
    expect(immutableQ1ToQ5Prefix.byteLength).toBe(
      immutableQ1ToQ5PrefixBytes,
    );
    expect(
      crypto
        .createHash('sha256')
        .update(immutableQ1ToQ5Prefix)
        .digest('hex'),
    ).toBe(immutableQ1ToQ5PrefixSha256);

    const immutableQ1ToQ10Prefix = rawBytes.subarray(
      0,
      immutableQ1ToQ10PrefixBytes,
    );
    expect(q11ByteIndex).toBeGreaterThan(q6ByteIndex);
    expect(immutableQ1ToQ10Prefix.byteLength).toBe(
      immutableQ1ToQ10PrefixBytes,
    );
    expect(
      crypto
        .createHash('sha256')
        .update(immutableQ1ToQ10Prefix)
        .digest('hex'),
    ).toBe(immutableQ1ToQ10PrefixSha256);

    expect(q16ByteIndex).toBeGreaterThan(q11ByteIndex);
    const immutableQ16ToQ20Tail = rawBytes.subarray(q16ByteIndex);
    expect(immutableQ16ToQ20Tail.toString('utf8').startsWith(q16Marker)).toBe(
      true,
    );
    expect(immutableQ16ToQ20Tail.byteLength).toBe(
      immutableQ16ToQ20TailBytes,
    );
    expect(
      crypto
        .createHash('sha256')
        .update(immutableQ16ToQ20Tail)
        .digest('hex'),
    ).toBe(immutableQ16ToQ20TailSha256);
  });

  it('ends the localized prefix at the exact blank-line boundary before Q1', () => {
    expect(localizedPrefixBytes.byteLength).toBeGreaterThan(0);
    expect(localizedPrefix.endsWith('\n\n')).toBe(true);
    expect(localizedPrefix.endsWith('\n\n\n')).toBe(false);
    expect(rawBytes.subarray(immutablePrefixBytes).toString('utf8')).toMatch(
      /^(?:## )?Q1\./,
    );
  });

  it('uses the exact contracted frontmatter and one matching H1', () => {
    expect(parsedPrefix.data).toEqual({
      title: expectedTitle,
      url: sourceUrl,
      lastmod: '2026-07-26',
      date_display: '2025年9月13日',
      read_time: '約8分',
      categories: ['台湾法律情報'],
      featured_image: featuredImage,
    });
    expect(
      Array.from(bodyPrefix.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([expectedTitle]);
  });

  it('uses exactly two descriptive image nodes with the contracted paths', () => {
    expect(imageNodes.map(({ src }) => src)).toEqual([
      featuredImage,
      incidentImage,
    ]);
    expect(imageNodes[0]?.alt).toMatch(
      /台湾.{0,20}交通事故.{0,20}(?:直後|発生後).{0,30}(?:現場の)?安全.{0,40}証拠.{0,15}(?:保全|保存)/u,
    );
    expect(imageNodes[1]?.alt).toMatch(
      /事故現場.{0,30}車両.{0,15}位置.{0,30}(?:道路|路面).{0,15}(?:痕跡|形跡)/u,
    );
    expect(countOccurrences(raw, featuredImage)).toBe(2);
    expect(countOccurrences(raw, incidentImage)).toBe(1);
  });

  it('states the contracted response sequence and fact-dependent caveat', () => {
    expect(introduction).toMatch(
      /まず.{0,50}安全.{0,50}(?:適切な)?(?:通報|届出|連絡).{0,50}証拠.{0,15}(?:保全|保存)/su,
    );

    const followUpSequence = [
      /(?:その後|次に)/u,
      /(?:請求|申立て).{0,12}(?:期限|期間|時効)/u,
      /過失/u,
      /示談.{0,10}(?:範囲|対象|内容)|(?:範囲|対象|内容).{0,10}示談/u,
    ];
    const positions = followUpSequence.map((pattern) =>
      introduction.search(pattern),
    );
    for (const position of positions) {
      expect(position).toBeGreaterThanOrEqual(0);
    }
    expect(positions).toEqual([...positions].sort((a, b) => a - b));

    expect(introduction).toMatch(
      /台湾法.{0,40}(?:公的機関|行政機関|関係機関|政府).{0,25}(?:案内|指針|情報).{0,50}(?:一般的|基本的).{0,15}(?:流れ|手順|順序)/su,
    );
    expect(introduction).toMatch(
      /(?:具体的な)?(?:責任|責任関係).{0,30}(?:手続|対応).{0,50}(?:事故|事案).{0,20}(?:事実関係|事情|状況).{0,30}(?:異な|変わ)/su,
    );
  });

  it('removes stale personal copy, first-person prose, Hangul, and spacer-only lines', () => {
    for (const phrase of prohibitedStaleCopy) {
      expect(bodyPrefix).not.toContain(phrase);
    }
    expect(bodyPrefix).not.toMatch(/\p{Script=Hangul}/u);
    expect(bodyPrefix).not.toMatch(/^[\t ]*\u200b+[\t ]*$/mu);
    expect(visiblePrefixProse).not.toMatch(/(?:私たち|我々|当事務所|私)/u);
  });
});

describe('Japanese traffic column 003 — Q1–Q5 translation contract', () => {
  it('starts the exact five-H2 segment at byte 1170 and places the source H3 after Q5', () => {
    expect(rawBytes.subarray(immutablePrefixBytes).toString('utf8')).toMatch(
      /^## Q1\. 事故後に現場を離れてもよいですか？/u,
    );
    expect(
      Array.from(
        q1ToQ5.matchAll(/^## (Q\d+\..+)$/gm),
        (match) => `## ${match[1]}`,
      ),
    ).toEqual([...contractedHeadings]);
    expect(countOccurrences(q1ToQ5, sourceHeading)).toBe(1);
    expect(sourceBlockStart).toBeGreaterThan(q1ToQ5.indexOf(q5Heading));
    expect(sourceBlock).not.toMatch(/^## /m);
  });

  it('states the contracted scene duties and both lawful vehicle-movement distinctions in Q1', () => {
    expect(q1).toMatch(/(?:負傷|傷害|死傷)/u);
    expect(q1).toMatch(/(?:死亡|死傷)/u);
    expect(q1).toMatch(/(?:直ちに|速やかに).{0,25}(?:救護|救助|応急手当)/su);
    expect(q1).toMatch(/(?:警察|警察機関).{0,20}(?:通報|届出|報告)/su);
    expect(q1).toMatch(
      /(?:車両|自動車).{0,25}(?:現場|事故現場).{0,35}(?:証拠|痕跡).{0,20}(?:保全|保存)/su,
    );
    expect(q1).toMatch(
      /(?:(?:口頭|非公式).{0,20}(?:同意|承諾)|(?:録音|録画|記録)).{0,45}(?:必要な措置|法定の措置|義務).{0,20}(?:代わり|代替).{0,8}(?:にはなら|できな)/su,
    );
    expect(q1).toMatch(
      /双方.{0,20}(?:同意|合意).{0,45}(?:位置|痕跡).{0,20}(?:表示|標示|記録).{0,50}(?:交通|通行).{0,20}(?:妨げ|支障|阻害).{0,35}(?:移動|動か)/su,
    );
    expect(q1).toMatch(
      /物損.{0,35}(?:走行|移動).{0,25}(?:可能|できる).{0,45}(?:表示|標示|記録).{0,45}(?:安全な場所|安全な地点).{0,20}(?:移動|退避)/su,
    );
    expect(q1).toMatch(/行政.{0,12}(?:処分|責任|罰|上の不利益)/u);
    expect(q1).toMatch(
      /刑法.{0,8}185条の4.{0,80}(?:負傷|傷害|死亡|死傷).{0,70}(?:個別|具体的).{0,20}(?:判断|検討|分析)/su,
    );
  });

  it('puts safety first and covers reporting, preservation, and police-document timing in Q2', () => {
    const q2Body = q2.slice(q2Heading.length);
    const safetyIndex = q2Body.search(/安全/u);
    const evidenceIndex = q2Body.search(/(?:写真|撮影|証拠)/u);
    expect(safetyIndex).toBeGreaterThanOrEqual(0);
    expect(evidenceIndex).toBeGreaterThan(safetyIndex);
    expect(q2).toMatch(/(?:警告|注意喚起|後続車|三角表示板|ハザード)/u);
    expect(q2).toMatch(
      /(?:119.{0,35}(?:負傷|けが|救護|救助)|(?:負傷|けが|救護|救助).{0,35}119)/su,
    );
    expect(q2).toMatch(
      /(?:(?:110.{0,15}112|112.{0,15}110).{0,50}(?:犯罪|緊急).{0,30}(?:警察|通報)|(?:犯罪|緊急).{0,30}(?:警察|通報).{0,50}(?:110.{0,15}112|112.{0,15}110))/su,
    );
    expect(q2).toMatch(
      /交通事故.{0,25}(?:警察|所轄).{0,20}(?:通報|届出|届け出|報告)/su,
    );
    expect(q2).toMatch(
      /(?:全景|広角|遠景).{0,25}(?:近接|接写|詳細).{0,55}車両.{0,20}位置.{0,35}(?:損傷|破損)/su,
    );
    expect(q2).toMatch(
      /(?:道路標示|路面標示|車線).{0,25}(?:信号|信号機).{0,25}(?:天候|気象)/su,
    );
    expect(q2).toMatch(
      /目撃者.{0,20}(?:連絡先|連絡方法).{0,45}CCTV.{0,30}(?:ドライブレコーダー|車載カメラ).{0,25}(?:保存|保全)/su,
    );
    expect(q2).toMatch(
      /(?:当事者|相手方).{0,20}(?:車両|自動車).{0,25}(?:保険|保険会社).{0,35}(?:診療|医療).{0,20}(?:記録|資料)/su,
    );
    expect(q2).toMatch(
      /(?:私的|自分で撮影した|個人の).{0,20}(?:写真|撮影).{0,50}(?:警察の対応|警察による処理|必要な警察による処理|必要な警察手続).{0,20}(?:代わり|代替).{0,8}(?:にはなら|にはなり|できな)/su,
    );
    expect(q2).toMatch(
      /(?:当事者登録|当事者情報).{0,15}(?:連絡票|登録票|フォーム).{0,35}(?:現場|その場)/su,
    );
    expect(q2).toMatch(
      /事故.{0,12}7日.{0,35}(?:現場図|事故現場図).{0,15}写真.{0,50}30日.{0,35}(?:初期分析|初歩分析|初判表)/su,
    );
    expect(q2).toMatch(
      /(?:(?:管轄|所轄|担当|所管)[^。\n]{0,15}警察[^。\n]{0,80}(?:利用|交付|取得)[^。\n]{0,15}(?:可否|状況)[^。\n]{0,25}(?:申請|請求)[^。\n]{0,15}(?:要件|条件|方法)[^。\n]{0,20}(?:確認|照会)|(?:利用|交付|取得)[^。\n]{0,15}(?:可否|状況)[^。\n]{0,25}(?:申請|請求)[^。\n]{0,15}(?:要件|条件|方法)[^。\n]{0,40}(?:管轄|所轄|担当|所管)[^。\n]{0,15}警察[^。\n]{0,20}(?:確認|照会))/u,
    );
  });

  it('states the complaint, limitation, and criminal-attached civil-action rules in Q3', () => {
    expect(q3).toMatch(
      /刑法.{0,8}284条.{0,25}(?:過失傷害|過失致傷).{0,20}(?:重傷|重傷害)/su,
    );
    expect(q3).toMatch(
      /刑法.{0,8}287条.{0,30}(?:親告罪|告訴を要する|告訴が必要)/su,
    );
    expect(q3).toMatch(
      /刑事訴訟法.{0,10}237条.{0,35}(?:犯人|加害者).{0,15}(?:知った|判明).{0,35}6か月/su,
    );
    expect(q3).toMatch(
      /民法.{0,8}197条.{0,35}(?:損害|被害).{0,15}(?:賠償義務者|加害者|責任を負う者).{0,25}(?:知った|判明).{0,25}2年.{0,40}(?:不法行為|行為時).{0,25}10年/su,
    );
    expect(q3).toMatch(
      /刑事訴訟法.{0,12}487条.{0,15}488条.{0,45}(?:第二審|第2審).{0,20}(?:口頭弁論|弁論).{0,25}(?:終結|終了).{0,35}(?:係属|継続)/su,
    );
    expect(q3).toMatch(
      /(?:別途|独立した).{0,20}(?:裁判費用|訴訟費用).{0,20}(?:前納|予納|先に納付).{0,20}(?:通常|原則).{0,12}(?:不要|要しない|免れ)/su,
    );
    expect(q3).toMatch(
      /(?:刑事訴訟法.{0,10}503条.{0,15}504条.{0,45}(?:移送|移付|移行).{0,25}(?:費用|裁判費用|訴訟費用)|(?:移送|移付|移行)[^。\n]{0,35}(?:刑事訴訟法)?第?503条[^。\n]{0,30}(?:費用|裁判費用|訴訟費用)[^。\n]*。[^。\n]{0,20}第?504条[^。\n]{0,30}(?:移送|移付|移行)[^。\n]{0,20}手続)/u,
    );
    expect(q3).toMatch(
      /(?:時効|期間).{0,15}(?:中断|更新|完成猶予).{0,35}(?:被告|相手方).{0,25}証拠.{0,25}保険.{0,25}(?:管轄|裁判管轄)/su,
    );
    expect(q3).not.toMatch(/(?:常に|必ず|一律に).{0,20}(?:最善|最良|有利)/u);
  });

  it('separates criminal causation from civil comparative fault and preserves the Q4 example', () => {
    expect(q4).toMatch(
      /刑事.{0,35}(?:注意義務|注意義務違反).{0,35}(?:因果関係|原因).{0,35}(?:相手方|他方).{0,15}(?:負傷|傷害)/su,
    );
    expect(q4).toMatch(
      /双方.{0,15}過失.{0,35}(?:直ちに|当然に|自動的に).{0,25}(?:過失傷害|過失致傷).{0,20}(?:成立しない|成立するものではない)/su,
    );
    expect(q4).toMatch(
      /民法.{0,8}217条.{0,40}(?:被害者|損害を受けた者).{0,15}過失.{0,35}(?:発生|拡大).{0,40}(?:減額|減少).{0,15}(?:免除|免責)/su,
    );
    expect(q4).toContain('新台湾ドル（TWD）1,000,000');
    expect(q4).toMatch(
      /新台湾ドル（TWD）1,000,000.{0,45}50[％%].{0,45}新台湾ドル（TWD）500,000.{0,30}(?:調整|控除).{0,15}(?:前|以前)/su,
    );
    expect(q4).toMatch(
      /(?:(?:鑑定|事故鑑定).{0,25}(?:初期分析|初歩分析|初判表)|(?:初期分析|初歩分析|初判表).{0,25}(?:鑑定|事故鑑定)).{0,35}(?:重要|有力).{0,15}証拠.{0,45}(?:裁判所|裁判官).{0,30}(?:拘束しない|機械的に従わない|独自に判断)/su,
    );
  });

  it('defines the settlement scope, reserved claims, and complaint-withdrawal limits in Q5', () => {
    expect(q5).toMatch(
      /事故.{0,10}(?:日時|時間).{0,12}(?:場所|地点).{0,20}(?:当事者|当事者名)/su,
    );
    expect(q5).toMatch(
      /(?:支払|賠償).{0,15}金額.{0,15}(?:時期|期限|期日).{0,25}保険.{0,20}(?:対応|処理|取扱い)/su,
    );
    expect(q5).toMatch(
      /(?:含まれる|対象とする).{0,15}(?:請求|権利).{0,25}(?:留保|除外).{0,15}(?:請求|権利)/su,
    );
    expect(q5).toMatch(
      /(?:将来|今後).{0,15}(?:治療|診療).{0,25}(?:後から|後日|後に).{0,15}(?:判明|発見).{0,15}(?:傷害|症状|損害)/su,
    );
    expect(q5).toMatch(
      /(?:書類|資料).{0,15}(?:交付|引渡し|提出).{0,30}(?:支払|弁済).{0,20}(?:告訴|告訴の取下げ|告訴取消)/su,
    );
    expect(q5).toMatch(
      /民法.{0,8}736条.{0,15}737条.{0,35}(?:互譲|互いに譲歩).{0,20}(?:契約|和解).{0,50}(?:放棄|譲歩).{0,15}(?:範囲|対象)/su,
    );
    expect(q5).toMatch(
      /刑事訴訟法.{0,10}238条.{0,40}(?:第一審|第1審).{0,20}(?:口頭弁論|弁論).{0,25}(?:終結|終了).{0,35}(?:取り下げ|取消し|撤回).{0,35}(?:再度|再び).{0,12}(?:告訴できない|告訴することができない)/su,
    );
    expect(q5).toMatch(
      /(?:非親告罪|告訴を要しない犯罪).{0,45}(?:私的|当事者間).{0,15}示談.{0,35}(?:公訴|訴追|刑事手続).{0,20}(?:当然|自動的).{0,12}(?:終了しない|終わらない)/su,
    );
    expect(q5).toMatch(
      /(?:示談.{0,35}(?:すべて|あらゆる|常に|必ず|一律に).{0,20}(?:告訴|告訴の取下げ|告訴取消).{0,20}(?:義務|強制).{0,15}(?:ではない|しない|されない)|示談したからといって[^。\n]{0,20}必ず[^。\n]{0,20}告訴[^。\n]{0,20}(?:取り下げ|取消し|撤回)[^。\n]{0,25}(?:なければならないわけでは|必要はない))/u,
    );
  });

  it('uses all 17 official URLs exactly once, in order, as descriptive Japanese Markdown links', () => {
    expect(sourceBlock).toMatch(
      new RegExp(`^${escapeRegExp(sourceHeading)}$`, 'm'),
    );

    let previousIndex = -1;
    for (const url of officialSourceUrls) {
      expect(countOccurrences(q1ToQ5, url), url).toBe(1);

      const linkPattern = new RegExp(
        `\\[[^\\]\\r\\n]*[\\p{Script=Hiragana}\\p{Script=Katakana}\\p{Script=Han}][^\\]\\r\\n]*\\]\\(${escapeRegExp(url)}\\)`,
        'u',
      );
      const match = sourceBlock.match(linkPattern);
      expect(
        match,
        `missing descriptive Japanese Markdown link: ${url}`,
      ).not.toBeNull();

      const sourceIndex = sourceBlock.indexOf(url);
      expect(sourceIndex, `source order: ${url}`).toBeGreaterThan(
        previousIndex,
      );
      previousIndex = sourceIndex;
    }
  });

  it('removes only the contracted stale, Hangul, and invisible spacer copy from Q1–Q5', () => {
    for (const phrase of prohibitedQ1ToQ5Copy) {
      expect(q1ToQ5).not.toContain(phrase);
    }
    expect(q1ToQ5).not.toMatch(/\p{Script=Hangul}/u);
    expect(q1ToQ5).not.toMatch(/^[\t ]*\u200b+[\t ]*$/mu);
  });
});

describe('Japanese traffic column 003 — Q6–Q10 translation contract', () => {
  it('starts the exact five H2s at byte 9308 and places the source H3 after Q10 before Q11', () => {
    expect(rawBytes.subarray(q6ByteIndex).toString('utf8')).toMatch(
      /^## Q6\. 事故責任はどのように認定されますか？\n/u,
    );
    expect(
      Array.from(
        q6ToQ10.matchAll(/^## Q(?:6|7|8|9|10)\. .+$/gm),
        (match) => match[0],
      ),
    ).toEqual([...q6ToQ10ContractedHeadings]);
    expect(q6ToQ10SourceBlockStart).toBeGreaterThan(
      q6ToQ10.indexOf(q10Heading),
    );
    expect(countOccurrences(q6ToQ10, q6ToQ10SourceHeading)).toBe(1);
    expect(q6ToQ10).not.toContain('Q11.');
  });

  it('keeps the preliminary analysis non-binding and states the complete appraisal and review procedure in Q6', () => {
    expect(q6).toMatch(
      /(?:(?:道路交通事故初期分析研判表.{0,100}(?:警察|警察機関))|(?:(?:警察|警察機関).{0,10}道路交通事故初期分析判断表)).{0,60}(?:予備的|初期).{0,20}分析.{0,80}(?:裁判所の)?判決.{0,20}(?:ではない|ではなく|に当たらない)/su,
    );
    expect(q6).toMatch(
      /(?:裁判所|裁判官).{0,30}(?:拘束しない|拘束せず|拘束するものではない).{0,80}過失割合.{0,30}(?:確定しない|確定しません|定めない|決定しない)/su,
    );
    expect(q6).toMatch(
      /(?:初期分析表|初期分析|鑑定|覆議).{0,100}(?:(?:自動的|必須).{0,30}(?:段階|手順|順序).{0,30}(?:ではない|にならない)|自動的.{0,10}手続.{0,10}ではなく.{0,20}必須.{0,10}段階.{0,10}でもありません)/su,
    );
    expect(q6).toMatch(
      /(?:適格|資格).{0,20}(?:当事者|申請者).{0,50}(?:鑑定を)?申請.{0,100}(?:処理機関|担当機関).{0,40}(?:移送|付託).{0,100}司法機関.{0,40}(?:嘱託|委託)/su,
    );
    expect(q6).toMatch(
      /(?:当事者|本人).{0,30}申請.{0,60}(?:事故発生日|事故日).{0,30}(?:から|起算).{0,20}6か月以内/su,
    );
    expect(q6).toMatch(
      /(?:捜査|調査).{0,20}(?:または|若しくは|・).{0,20}裁判.{0,60}(?:進行中|係属中).{0,100}(?:司法機関.{0,40}(?:嘱託|委託).{0,100}(?:直接申請|新たな申請).{0,30}(?:ではなく|によらず)|(?:直接申請|新たな申請).{0,30}(?:ではなく|によらず).{0,100}司法機関.{0,40}(?:嘱託|委託))/su,
    );
    expect(q6).toMatch(
      /(?:異議|不服).{0,50}(?:覆議|再審議).{0,50}(?:1回|一回|一度).{0,25}(?:限り|限られ|限定)/su,
    );
    expect(q6).toMatch(
      /(?:鑑定|覆議).{0,30}(?:意見|見解).{0,50}(?:証拠|参考資料).{0,100}(?:裁判所|裁判官).{0,50}(?:独立して|独自に).{0,30}(?:評価|判断)/su,
    );
    expect(q6).toMatch(
      /(?:供述|陳述).{0,50}(?:映像|動画).{0,50}(?:現場記録|現場資料).{0,80}(?:記録全体|証拠全体|資料全体)/su,
    );
  });

  it('makes every Q7 damages category conditional under Civil Code Articles 184 and 216', () => {
    expect(q7).toMatch(
      /民法.{0,8}(?:第)?184条.{0,80}(?:違法|不法).{0,20}(?:権利侵害|侵害).{0,60}因果関係.{0,60}(?:損害|損失).{0,20}(?:立証|証明)/su,
    );
    expect(q7).toMatch(
      /事故.{0,50}(?:事実だけ|だけ).{0,80}(?:(?:すべて|全て).{0,25}(?:項目|損害)|(?:項目|損害).{0,25}(?:すべて|全て)).{0,30}(?:自動的|当然).{0,20}(?:認められない|認定されない|認められるわけでは(?:ない|ありません))/su,
    );
    expect(q7).toMatch(
      /民法.{0,8}(?:第)?216条.{0,60}(?:現実に生じた損害|実際の損害).{0,60}(?:逸失利益|失われた利益)/su,
    );
    expect(q7).toMatch(
      /(?:負傷|傷害).{0,80}(?:第)?193条.{0,80}(?:医療費|治療費).{0,40}介護費.{0,40}(?:通院交通費|交通費).{0,50}(?:補助器具|補助具).{0,60}(?:生活上の必要増加費用|必要な生活費の増加)/su,
    );
    expect(q7).toMatch(
      /(?:就労不能|働けない).{0,40}(?:収入減少|所得減少|逸失収入).{0,60}(?:労働能力|稼働能力).{0,20}(?:減少|喪失).{0,60}(?:第)?195条.{0,40}非財産的損害/su,
    );
    expect(q7).toMatch(
      /死亡.{0,80}(?:第)?192条.{0,100}(?:死亡前|亡くなる前).{0,40}(?:医療費|治療費).{0,80}葬儀費.{0,80}(?:(?:扶養利益|扶養を受ける利益).{0,60}(?:法律上|法的に).{0,30}(?:権利|資格)|(?:法律上|法的に).{0,30}(?:権利|資格).{0,60}(?:扶養利益|扶養を受ける利益))/su,
    );
    expect(q7).toMatch(
      /(?:第)?194条.{0,50}(?:一定|所定|特定).{0,20}(?:親族|家族).{0,50}非財産的損害/su,
    );
    expect(q7).toMatch(
      /(?:財産|物的損害).{0,60}(?:第)?196条.{0,50}(?:(?:立証|証明).{0,30}(?:実損害|実際の損害).{0,70}修理費.{0,60}(?:価値減少|価値の減少)|修理費.{0,60}(?:価値減少|価値の減少).{0,60}(?:立証|証明).{0,30}(?:実際の財産損害|財産の実損害))/su,
    );
  });

  it('distinguishes Q8 medical-evidence supplementation from changing a claim and narrows the Article 504 fee caveat', () => {
    expect(q8).toMatch(
      /(?:(?:保管|保存).{0,40}領収書.{0,40}診断書.{0,40}(?:診療記録|医療記録)|領収書.{0,40}診断書.{0,40}(?:診療記録|医療記録).{0,20}(?:保管|保存))/su,
    );
    expect(q8).toMatch(
      /(?:医学的必要性|医療上の必要性).{0,60}事故.{0,30}因果関係/su,
    );
    expect(q8).toMatch(
      /(?:(?:継続治療|治療が続).{0,100}(?:証拠|資料).{0,20}(?:補充|追加).{0,80}(?:手続日程|訴訟日程).{0,80}(?:既存|従前).{0,20}請求|(?:継続治療|治療が続).{0,30}資料.{0,60}(?:手続日程|訴訟日程).{0,60}(?:既に提出|既存|従前).{0,30}請求.{0,40}証拠.{0,20}(?:補充|追加))/su,
    );
    expect(q8).toMatch(
      /(?:遅れて提出|提出が遅れ).{0,50}(?:資料|証拠).{0,60}(?:拡張|増額).{0,30}請求.{0,80}(?:保証されない|保証はありません|必ずしも認められない|採用されるとは限らない)/su,
    );
    expect(q8).toMatch(
      /(?:医療証拠|医療資料).{0,30}(?:補充|追加).{0,80}(?:(?:区別|異なる).{0,80}(?:請求額|請求金額|請求範囲).{0,30}(?:変更|増額|拡張)|(?:請求額|請求金額|請求範囲).{0,30}(?:変更|増額|拡張).{0,50}区別.{0,20}必要)/su,
    );
    expect(q8).toMatch(
      /刑事附帯民事訴訟.{0,100}(?:医療)?領収書.{0,40}(?:追加|提出).{0,100}(?:(?:自動的|それ自体).{0,30}(?:裁判費用|訴訟費用).{0,25}(?:生じない|発生しない)|(?:裁判費用|訴訟費用).{0,25}(?:自動的|それ自体).{0,25}(?:生じない|発生しない|生じるわけではありません))/su,
    );
    expect(q8).toMatch(
      /刑事訴訟法.{0,10}(?:第)?504条.{0,80}民事部.{0,30}移送.{0,100}移送前.{0,30}(?:範囲|請求).{0,50}(?:変更|追加|拡張|増額).{0,60}超過部分.{0,40}(?:裁判費用|訴訟費用)/su,
    );
    expect(q8).toMatch(
      /(?:移送段階|移送の段階).{0,40}(?:提出時期|提出の時期).{0,40}(?:請求範囲|請求の範囲).{0,50}(?:個別|事案ごと|事件ごと).{0,20}(?:確認|検討)/su,
    );
  });

  it('requires complete Q9 care proof and treats unpaid family care as non-automatic', () => {
    expect(q9).toMatch(
      /(?:診断書|医学的意見).{0,60}(?:有用|役立つ).{0,30}証拠.{0,80}(?:それだけ|単独).{0,30}(?:決定的|十分).{0,20}(?:ではない|とは限らない|にはなりません|にはならない)/su,
    );
    expect(q9).toMatch(
      /事故.{0,20}因果関係.{0,50}介護.{0,20}必要性.{0,50}(?:実際の提供|実際に提供).{0,50}期間.{0,50}(?:合理的|相当).{0,20}(?:金額|額)/su,
    );
    expect(q9).toMatch(
      /(?:親族|家族).{0,30}無償.{0,50}(?:実際に)?介護.{0,80}(?:損害|損失).{0,20}(?:評価|認定).{0,30}(?:得る|得ます|可能性).{0,100}(?:自動的|当然).{0,25}(?:認められない|認定されない|認められるわけでは(?:なく|ない))/su,
    );
    expect(q9).toMatch(
      /介護.{0,20}(?:内容|性質).{0,40}期間.{0,60}(?:通常|一般的|相当).{0,20}(?:費用水準|費用|相場)/su,
    );
  });

  it('connects Q10 travel proof to treatment and rejects automatic taxi-receipt sufficiency', () => {
    expect(q10).toMatch(
      /交通費.{0,30}(?:記録|資料).{0,60}治療記録.{0,60}事故.{0,20}(?:負傷|傷害)/su,
    );
    expect(q10).toMatch(
      /経路.{0,40}(?:通院日|受診日).{0,25}(?:回数|通院回数).{0,40}(?:交通手段|移動手段).{0,40}(?:料金|運賃).{0,40}必要性.{0,40}合理性/su,
    );
    expect(q10).toMatch(
      /領収書.{0,40}(?:運賃記録|料金記録).{0,40}経路記録.{0,40}(?:診療資料|治療記録|医療資料).{0,50}証拠/su,
    );
    expect(q10).toMatch(
      /タクシー領収書.{0,60}(?:唯一|唯一の).{0,30}(?:立証方法|証拠).{0,30}(?:ではなく|ではない).{0,80}(?:自動的|それだけで).{0,30}(?:十分|足りる).{0,20}(?:わけではない|とは限らない|となるものでもありません)/su,
    );
  });

  it('uses all 14 official URLs exactly once and in order only as descriptive Japanese Markdown-link destinations', () => {
    const markdownLinks = Array.from(
      q6ToQ10SourceBlock.matchAll(
        /\[([^\]\r\n]+)\]\((https?:\/\/[^)\s]+)\)/g,
      ),
      (match) => ({ label: match[1], url: match[2], full: match[0] }),
    );
    expect(markdownLinks.map(({ url }) => url)).toEqual([
      ...q6ToQ10OfficialSourceUrls,
    ]);

    for (const { label, url } of markdownLinks) {
      expect(label).toMatch(
        /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u,
      );
      expect(label.trim()).not.toBe('');
      expect(label).not.toContain('http');
      expect(countOccurrences(q6ToQ10, url), url).toBe(1);
    }

    const withoutMarkdownLinks = markdownLinks.reduce(
      (value, { full }) => value.replace(full, ''),
      q6ToQ10,
    );
    expect(withoutMarkdownLinks).not.toMatch(/https?:\/\//);
    for (const url of q6ToQ10OfficialSourceUrls) {
      expect(q6ToQ10).not.toContain(`<${url}>`);
    }
  });

  it('removes only the contracted stale, legacy-list, Hangul, and invisible spacer copy from Q6–Q10', () => {
    for (const phrase of prohibitedQ6ToQ10Copy) {
      expect(q6ToQ10).not.toContain(phrase);
    }
    expect(containsOrderedLinePrefixes(q6ToQ10, legacyNineItemLabels)).toBe(
      false,
    );
    expect(q6ToQ10).not.toMatch(/\p{Script=Hangul}/u);
    expect(q6ToQ10).not.toMatch(/^[\t ]*\u200b+[\t ]*$/mu);
  });
});

describe('Japanese traffic column 003 — Q11–Q15 translation contract', () => {
  it('starts the exact five H2s at byte 15708 and places the source H3 after Q15 before Q16', () => {
    expect(rawBytes.subarray(q11ByteIndex).toString('utf8')).toMatch(
      /^## Q11\. 治療・回復期間中の逸失収入は、どのように立証しますか？\n/u,
    );
    expect(
      Array.from(
        q11ToQ15.matchAll(/^## Q1[1-5]\. .+$/gm),
        (match) => match[0],
      ),
    ).toEqual([...q11ToQ15ContractedHeadings]);
    expect(q11ToQ15SourceBlockStart).toBeGreaterThan(
      q11ToQ15.indexOf(q15Heading),
    );
    expect(countOccurrences(q11ToQ15, q11ToQ15SourceHeading)).toBe(1);
    expect(q11ToQ15).not.toContain(q16Marker);
  });

  it('requires accident-caused inability and actual income reduction while preserving Q12 as a separate issue', () => {
    expect(q11).toMatch(
      /事故.{0,25}(?:負傷|傷害).{0,100}(?:全部|完全).{0,20}(?:または|若しくは|・).{0,20}(?:一部|部分).{0,50}(?:就労|働くこと).{0,30}(?:不能|できな)/su,
    );
    expect(q11).toMatch(
      /(?:資料|証拠).{0,20}(?:裏付け|立証).{0,30}治療.{0,10}回復期間.{0,100}(?:現実|実際).{0,20}(?:収入|所得).{0,15}(?:減少|低下)/su,
    );
    expect(q11).toMatch(
      /(?:診断書|休養の勧告).{0,100}(?:関連|有用|重要).{0,50}(?:それだけ|単独).{0,40}(?:決まら|十分では|結論にはなら)/su,
    );
    expect(q11).toMatch(/(?:診療|治療|医療).{0,10}記録/u);
    expect(q11).toMatch(/(?:出勤|勤怠).{0,10}(?:休暇|休業).{0,10}記録/u);
    expect(q11).toMatch(/(?:給与|賃金).{0,12}(?:税務|納税).{0,10}資料/su);
    expect(q11).toMatch(/使用者.{0,12}(?:確認書|証明)/u);
    expect(q11).toMatch(/自営業/u);
    expect(q11).toMatch(
      /(?:就労を継続|働き続け).{0,80}(?:給与|賃金).{0,20}(?:変わらず|同額).{0,100}(?:一時的|回復期間中).{0,30}(?:逸失収入|収入減少).{0,30}(?:判断|検討).{0,25}(?:関係|考慮)/su,
    );
    expect(q11).toMatch(
      /(?:それだけ|直ちに|当然に).{0,70}(?:持続的|恒久的).{0,30}労働能力.{0,15}(?:低下|減少).{0,30}(?:決まら|否定され|排除され)/su,
    );
  });

  it('treats lasting earning-capacity loss as individualized rather than mechanically fixed in Q12', () => {
    expect(q12).toMatch(
      /(?:Q11|一時的|回復期間中).{0,80}(?:現実|実際).{0,20}(?:収入|所得).{0,15}(?:減少|低下).{0,70}(?:区別|別個|異なる)/su,
    );
    expect(q12).toMatch(
      /民法.{0,8}(?:第)?193条.{0,25}(?:第)?216条/su,
    );
    expect(q12).toMatch(
      /(?:事故との)?因果関係.{0,50}(?:持続的|永続的).{0,20}(?:機能障害|障害).{0,60}(?:職業|職種).{0,30}(?:能力|技能).{0,70}(?:通常|通常期待).{0,20}(?:収入|所得).{0,80}(?:就労可能期間|稼働期間)/su,
    );
    expect(q12).toMatch(
      /(?:現在の)?給与.{0,30}(?:変わらない|同じ|維持).{0,70}(?:当然|自動的|直ちに).{0,30}(?:排除|否定).{0,20}(?:されない|するものではない)/su,
    );
    expect(q12).toMatch(
      /(?:障害率|機能障害率).{0,60}(?:現在の)?給与.{0,70}(?:機械的|自動的).{0,35}(?:決まら|算定され)/su,
    );
    expect(q12).toMatch(
      /医学的鑑定.{0,80}(?:有用|役立つ).{0,80}(?:争い|争われ).{0,80}(?:すべて|全て).{0,25}(?:必須|必要).{0,20}(?:ではない|とは限らない)/su,
    );
    expect(q12).toMatch(
      /民法.{0,8}(?:第)?217条.{0,70}(?:過失相殺|過失).{0,50}(?:調整|考慮)/su,
    );
    expect(q12).toMatch(
      /一時金.{0,80}中間利息.{0,25}(?:控除|差引).{0,40}(?:考慮|可能)/su,
    );
    expect(q12).toMatch(
      /ホフマン.{0,40}(?:計算機|計算).{0,50}(?:補助|参考).{0,100}(?:必須|義務).{0,30}(?:ではない|でもなく).{0,60}(?:保証|確約).{0,20}(?:しない|ではない)/su,
    );
    expect(q12).toMatch(
      /民法.{0,8}(?:第)?193条.{0,100}(?:当事者|申立て).{0,50}裁判所.{0,60}担保.{0,50}定期金/su,
    );
  });

  it('bases Q13 non-pecuniary damages on Article 195 and individualized evidence', () => {
    expect(q13).toMatch(
      /民法.{0,8}(?:第)?195条.{0,100}(?:身体|健康).{0,50}(?:違法|不法).{0,20}(?:侵害|侵された).{0,80}(?:相当|適切).{0,20}(?:慰謝料|金額)/su,
    );
    expect(q13).toMatch(
      /(?:負傷|傷害).{0,30}治療.{0,50}(?:持続的|後遺).{0,25}(?:影響|症状).{0,50}(?:苦痛|痛み).{0,50}(?:生活|日常生活).{0,20}(?:影響|支障)/su,
    );
    expect(q13).toMatch(
      /年齢.{0,30}(?:身分|地位).{0,60}社会的.{0,15}経済的.{0,20}(?:事情|状況).{0,70}(?:当事者|双方).{0,20}証拠/su,
    );
  });

  it('states the complete Article 188 employer-liability framework and separates Article 284 criminal liability in Q14', () => {
    expect(q14).toMatch(
      /民法.{0,8}(?:第)?188条.{0,80}被用者.{0,50}(?:職務|業務).{0,20}(?:執行|遂行).{0,50}(?:違法|不法).{0,20}(?:損害|侵害)/su,
    );
    expect(q14).toMatch(
      /勤務時間中.{0,80}(?:だけ|のみ).{0,50}(?:当然|自動的).{0,35}(?:職務関連性|業務関連性).{0,30}(?:認められない|成立しない|証明されない)/su,
    );
    expect(q14).toMatch(
      /(?:共同|連帯).{0,15}民事責任.{0,100}(?:選任|選択).{0,25}監督.{0,90}(?:相当な注意|必要な注意).{0,100}(?:不可避|避けられな)/su,
    );
    expect(q14).toMatch(
      /第2項.{0,100}(?:賠償|補償).{0,30}(?:受けられない|得られない).{0,30}被害者.{0,80}(?:救済|補償)/su,
    );
    expect(q14).toMatch(
      /使用者.{0,60}(?:支払|賠償).{0,50}(?:被用者|従業員).{0,40}(?:求償|償還)/su,
    );
    expect(q14).toMatch(
      /(?:民事上|民事).{0,20}(?:請求相手|被告|責任).{0,70}(?:刑事責任|刑事上).{0,30}(?:区別|別個)/su,
    );
    expect(q14).toMatch(
      /刑法.{0,8}(?:第)?284条.{0,80}(?:各|それぞれ).{0,20}自然人.{0,80}(?:自身|本人).{0,25}注意義務違反.{0,50}因果関係/su,
    );
  });

  it('states the current compulsory benefits and treats all three other Q15 products as policy-dependent', () => {
    expect(q15).toMatch(
      /強制汽車責任保險法.{0,20}(?:第)?6条.{0,100}(?:車両|自動車).{0,25}所有者.{0,80}(?:使用者|利用者).{0,20}(?:または|若しくは|・).{0,20}管理者/su,
    );
    expect(q15).toMatch(
      /(?:無過失|過失の有無を問わず).{0,100}(?:負傷|傷害).{0,25}(?:死亡|死者).{0,100}同乗者.{0,80}(?:車外|車両外).{0,20}(?:第三者|第三者である者)/su,
    );
    expect(q15).toMatch(
      /単独車両事故.{0,100}運転者.{0,80}(?:当該|その|自分の).{0,25}車両.{0,30}強制保険.{0,35}(?:対象外|補償されない)/su,
    );
    expect(q15).toMatch(
      /複数車両事故.{0,100}運転者.{0,100}(?:他|別).{0,20}(?:関係|事故関係|関与).{0,20}車両.{0,50}(?:強制保険者|保険会社).{0,40}(?:請求|給付)/su,
    );
    expect(q15).toMatch(
      /2026-05-29.{0,80}(?:改正|改定).{0,100}2026-07-01.{0,50}(?:以後|以降|後).{0,25}(?:発生|起きた).{0,15}事故/su,
    );
    expect(q15).toMatch(
      /(?:それ以前|より前|以前).{0,30}(?:事故|発生).{0,70}(?:旧|従前).{0,15}基準/su,
    );
    expect(q15).toContain('TWD 200,000');
    expect(q15).toContain('TWD 80,000–3,000,000');
    expect(q15).toMatch(/法定.{0,12}15等級/u);
    expect(q15).toContain('TWD 3,000,000');
    expect(q15).toContain('TWD 3,200,000');
    expect(q15).toMatch(
      /対人賠償責任保険.{0,60}運転者傷害保険.{0,60}車両損害保険.{0,100}(?:任意|契約)/su,
    );
    expect(q15).toMatch(
      /(?:実際の)?(?:補償|給付).{0,70}被保険者.{0,40}(?:限度額|保険金額).{0,40}免責金額.{0,40}免責事由.{0,40}過失.{0,50}(?:約款|契約条件)/su,
    );
  });

  it('uses all 13 Q11–Q15 official URLs exactly once and in order only as descriptive Japanese Markdown-link destinations', () => {
    const markdownLinks = Array.from(
      q11ToQ15SourceBlock.matchAll(
        /\[([^\]\r\n]+)\]\((https?:\/\/[^)\s]+)\)/g,
      ),
      (match) => ({ label: match[1], url: match[2], full: match[0] }),
    );
    expect(markdownLinks.map(({ url }) => url)).toEqual([
      ...q11ToQ15OfficialSourceUrls,
    ]);

    for (const { label, url } of markdownLinks) {
      expect(label).toMatch(
        /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u,
      );
      expect(label.trim()).not.toBe('');
      expect(label).not.toContain('http');
      expect(countOccurrences(q11ToQ15, url), url).toBe(1);
    }

    const withoutMarkdownLinks = markdownLinks.reduce(
      (value, { full }) => value.replace(full, ''),
      q11ToQ15,
    );
    for (const url of q11ToQ15OfficialSourceUrls) {
      expect(withoutMarkdownLinks).not.toContain(url);
      expect(q11ToQ15).not.toContain(`<${url}>`);
    }
  });

  it('removes only the contracted stale, first-person recommendation, guarantee, Hangul, and spacer copy within Q11–Q15', () => {
    for (const phrase of prohibitedQ11ToQ15Copy) {
      expect(q11ToQ15).not.toContain(phrase);
    }
    expect(q11ToQ15).not.toMatch(/\p{Script=Hangul}/u);
    expect(q11ToQ15).not.toMatch(/^[\t ]*\u200b+[\t ]*$/mu);
    expect(q11ToQ15).not.toMatch(
      /(?:私|当事務所).{0,40}(?:勧め|推奨|助言)/su,
    );
    expect(q11ToQ15).not.toMatch(
      /(?:必ず|絶対に|自動的に認められ).{0,40}(?:請求|回収|賠償|補償)/su,
    );
  });
});
