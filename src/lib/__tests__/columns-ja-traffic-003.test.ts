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
const q6Marker = 'Q6. 事故責任はどのように認定されますか？';
const q6ByteIndex = rawBytes.indexOf(Buffer.from(q6Marker, 'utf8'));
const immutableQ6ToQ20Tail =
  q6ByteIndex === -1 ? Buffer.alloc(0) : rawBytes.subarray(q6ByteIndex);
const immutableQ6ToQ20TailBytes = 13_792;
const immutableQ6ToQ20TailSha256 =
  '15255c3950dee9ff3cfaa550aa1fd6f7314f0d57ab3eae7e64955f17c18751e6';
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

describe('Japanese traffic column 003 — metadata and introduction localization boundary', () => {
  it('preserves the completed introduction prefix and exact Q6-to-Q20 tail byte-for-byte', () => {
    expect(localizedPrefixBytes.byteLength).toBe(immutablePrefixBytes);
    expect(
      crypto.createHash('sha256').update(localizedPrefixBytes).digest('hex'),
    ).toBe(immutablePrefixSha256);

    expect(q6ByteIndex).toBeGreaterThan(immutablePrefixBytes);
    expect(immutableQ6ToQ20Tail.toString('utf8').startsWith(q6Marker)).toBe(
      true,
    );
    expect(immutableQ6ToQ20Tail.byteLength).toBe(immutableQ6ToQ20TailBytes);
    expect(
      crypto.createHash('sha256').update(immutableQ6ToQ20Tail).digest('hex'),
    ).toBe(immutableQ6ToQ20TailSha256);
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
    const safetyIndex = q2.search(/安全/u);
    const evidenceIndex = q2.search(/(?:写真|撮影|証拠)/u);
    expect(safetyIndex).toBeGreaterThanOrEqual(0);
    expect(evidenceIndex).toBeGreaterThan(safetyIndex);
    expect(q2).toMatch(/(?:警告|注意喚起|後続車|三角表示板|ハザード)/u);
    expect(q2).toMatch(/119.{0,35}(?:負傷|けが|救護|救助)/su);
    expect(q2).toMatch(
      /(?:110.{0,15}112|112.{0,15}110).{0,50}(?:犯罪|緊急).{0,30}(?:警察|通報)/su,
    );
    expect(q2).toMatch(
      /交通事故.{0,25}(?:警察|所轄).{0,20}(?:通報|届出|報告)/su,
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
      /(?:私的|自分で撮影した|個人の).{0,20}(?:写真|撮影).{0,50}(?:警察の対応|警察による処理|必要な警察手続).{0,20}(?:代わり|代替).{0,8}(?:にはなら|できな)/su,
    );
    expect(q2).toMatch(
      /(?:当事者登録|当事者情報).{0,15}(?:連絡票|登録票|フォーム).{0,35}(?:現場|その場)/su,
    );
    expect(q2).toMatch(
      /事故.{0,12}7日.{0,35}(?:現場図|事故現場図).{0,15}写真.{0,50}30日.{0,35}(?:初期分析|初歩分析|初判表)/su,
    );
    expect(q2).toMatch(
      /(?:管轄|所轄|担当).{0,15}警察.{0,35}(?:利用|交付|取得).{0,15}(?:可否|状況).{0,25}(?:申請|請求).{0,15}(?:要件|条件|方法).{0,20}(?:確認|照会)/su,
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
      /刑事訴訟法.{0,10}503条.{0,15}504条.{0,45}(?:移送|移付|移行).{0,25}(?:費用|裁判費用|訴訟費用)/su,
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
      /示談.{0,35}(?:すべて|あらゆる|常に|必ず|一律に).{0,20}(?:告訴|告訴の取下げ|告訴取消).{0,20}(?:義務|強制).{0,15}(?:ではない|しない|されない)/su,
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
