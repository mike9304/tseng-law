import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-zh/003-taiwan-traffic-accident-procedure.md',
);
const rawBytes = fs.readFileSync(columnPath);
const raw = rawBytes.toString('utf8');
const parsed = matter(raw);

const title = '台灣交通事故應對 Q&A：現場處置、過失、和解與損害賠償';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-traffic-accident-procedure';
const featuredImage =
  '../images/003-taiwan-traffic-accident-procedure/featured-01.jpg';
const incidentImage =
  '../images/003-taiwan-traffic-accident-procedure/img-01.jpg';
const featuredAlt = '說明台灣交通事故後現場安全處置與證據保全的圖片';
const incidentAlt = '記錄交通事故現場車輛位置與道路痕跡的示意圖';

const qHeadings = [
  'Q1. 事故後可以離開現場嗎？',
  'Q2. 應先保留哪些證據？',
  'Q3. 受傷時應確認哪些請求與期限？',
  'Q4. 雙方都有過失時，刑事與民事責任如何判斷？',
  'Q5. 和解書應記載哪些事項？',
] as const;
const sourceHeading = 'Q1–Q5 官方依據';
const q6Marker = 'Q6. 事故責任如何認定？';
const q6ToQ10Headings = [
  q6Marker,
  'Q7. 事故後可以向對方請求哪些損害？',
  'Q8. 治療持續進行時，應如何提出醫療費用資料？',
  'Q9. 專業看護與親屬照護費用應如何證明？',
  'Q10. 治療所需交通費應如何證明？',
] as const;
const q6ToQ10SourceHeading = 'Q6–Q10 官方依據';
const q11Marker = 'Q11. 請求不能工作損失時應注意什麼？';
const q11ToQ15Headings = [
  'Q11. 治療與恢復期間的收入損失應如何證明？',
  'Q12. 勞動能力減損應如何證明？',
  'Q13. 非財產上損害慰撫金如何判斷？',
  'Q14. 工作期間發生事故時，雇主是否也可能負民事責任？',
  'Q15. 應確認哪些汽車保險給付與保障？',
] as const;
const q11ToQ15SourceHeading = 'Q11–Q15 官方依據';
const q16Marker =
  'Q16. 事故發生後，可以把所有事情都交給保險公司處理嗎？';
const immutablePrefixBytes = 7_238;
const immutablePrefixSha256 =
  '4309d3927ff0f3b0fb335d11e24a2b56bd28d3076a1ecd8ad6903a708395abeb';
const immutableQ1ToQ10PrefixBytes = 12_401;
const immutableQ1ToQ10PrefixSha256 =
  '9cec9996afe23177eba0f0aedd9420178bebb77c0bd74ee80a969747985b5448';
const immutableQ16TailBytes = 3_143;
const immutableQ16TailSha256 =
  'c189113fb7068cecc13432944afd541e4ebc40f9857eb6bbfd71dcf7daf418a9';

const sourceTargets = [
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

const q6ToQ10SourceTargets = [
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

const q11ToQ15SourceTargets = [
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

const prohibitedQ6ToQ10Copy = [
  '責任分析程序如下',
  '→',
  '學術中心鑑定結果',
  '逢甲大學',
  '會精確計算出過失比例',
  '幾乎沒有翻案的空間',
  '法官通常會尊重最終鑑定機構',
  '追加提出醫療收據，則需要額外繳納裁判費',
  '法官會認定看護費用',
  '即使由親屬看護',
  '法官仍會認定',
  '如果有計程車收據更好',
] as const;

const prohibitedQ11ToQ15Copy = [
  '診斷證明書載明休養期間',
  '即可請求損失的薪資',
  '法官不會認定此項請求',
  '佔比最大的項目',
  '身為律師，我都會建議當事人一定要申請勞動能力減損鑑定',
  '至退休年齡為止',
  '65歲',
  '月薪為100萬元',
  '1,693,928元',
  '鑑定費用不高',
  '2萬元以內',
  '數十萬元是一般的金額',
  '不要期待數百萬元',
  '公司須負僱用人責任',
  '公司通常比肇事者擁有更多資產',
  '一併告公司會比較好',
  '只能對肇事者本人提出',
  '這是法律規定每個人都必須投保的保險',
  '失蹤或死亡',
  '死亡定額給付最高200萬元',
  '負責理賠超出的部分',
] as const;

const prohibitedStaleCopy = [
  '大家好',
  '我是台灣律師',
  '豐富的交通事故案件處理經驗',
  '有效率地',
  '釐清責任歸屬後才能離開',
  '如果雙方決定不報警',
  '只有在對方同意',
  '告訴期限為6個月',
  '時效為2年',
  '如此便不需繳納裁判費',
  '只要任何一方有過失',
  '就構成過失傷害罪',
  '承諾不再追究民刑事責任',
  '必須約定撤回告訴',
  '不能再就該事故提出任何請求',
  '無法再向對方請求',
] as const;

const prohibitedOutcomeGuarantees = [
  '保證勝訴',
  '保證獲賠',
  '一定會獲賠',
  '必然獲賠',
  '法院一定會認定',
  '法院必然會認定',
  '一定構成過失傷害罪',
  '必然構成過失傷害罪',
  '一律構成過失傷害罪',
  '不需負擔任何費用',
  '一定不需繳納任何費用',
] as const;

type ConceptRule = {
  label: string;
  pattern: RegExp;
};

function countOccurrences(value: string, needle: string) {
  return value.split(needle).length - 1;
}

function expectConcepts(section: string, rules: readonly ConceptRule[]) {
  for (const { label, pattern } of rules) {
    expect(section, `missing contracted concept: ${label}`).toMatch(pattern);
  }
}

function sectionForQuestion(questionNumber: number) {
  const heading = `## ${qHeadings[questionNumber - 1]}`;
  const start = localizedPrefix.indexOf(heading);
  if (start === -1) return '';

  const next = localizedPrefix.indexOf('\n## ', start + heading.length);
  return localizedPrefix.slice(
    start,
    next === -1 ? localizedPrefix.length : next,
  );
}

function q6ToQ10SectionForQuestion(questionNumber: number) {
  const heading = `## ${q6ToQ10Headings[questionNumber - 6]}`;
  const start = q6ToQ10Section.indexOf(heading);
  if (start === -1) return '';

  const next = q6ToQ10Section.indexOf('\n## ', start + heading.length);
  return q6ToQ10Section.slice(
    start,
    next === -1 ? q6ToQ10Section.length : next,
  );
}

function q11ToQ15SectionForQuestion(questionNumber: number) {
  const heading = `## ${q11ToQ15Headings[questionNumber - 11]}`;
  const start = q11ToQ15Section.indexOf(heading);
  if (start === -1) return '';

  const next = q11ToQ15Section.indexOf('\n## ', start + heading.length);
  return q11ToQ15Section.slice(
    start,
    next === -1 ? q11ToQ15Section.length : next,
  );
}

const q6MarkerBytes = Buffer.from(q6Marker, 'utf8');
const q6ByteIndex = rawBytes.indexOf(q6MarkerBytes);
const q6HeadingByteIndex = rawBytes.indexOf(
  Buffer.from(`## ${q6Marker}`, 'utf8'),
);
const q6CharacterIndex = parsed.content.indexOf(q6Marker);
const q6HeadingCharacterIndex = parsed.content.indexOf(`## ${q6Marker}`);
const q11MarkerBytes = Buffer.from(q11Marker, 'utf8');
const legacyQ11ByteIndex = rawBytes.indexOf(q11MarkerBytes);
const legacyQ11CharacterIndex = parsed.content.indexOf(q11Marker);
const q11HeadingBytes = Buffer.from(`## ${q11ToQ15Headings[0]}`, 'utf8');
const q11HeadingByteIndex = rawBytes.indexOf(q11HeadingBytes);
const q11HeadingCharacterIndex = parsed.content.indexOf(
  `## ${q11ToQ15Headings[0]}`,
);
const q11ByteIndex =
  q11HeadingByteIndex === -1 ? legacyQ11ByteIndex : q11HeadingByteIndex;
const q11CharacterIndex =
  q11HeadingCharacterIndex === -1
    ? legacyQ11CharacterIndex
    : q11HeadingCharacterIndex;
const q16MarkerBytes = Buffer.from(q16Marker, 'utf8');
const q16ByteIndex = rawBytes.indexOf(q16MarkerBytes);
const q16CharacterIndex = parsed.content.indexOf(q16Marker);
const localizedPrefix =
  q6CharacterIndex === -1
    ? parsed.content
    : parsed.content.slice(0, q6CharacterIndex);
const sourceBlockStart = localizedPrefix.indexOf(`### ${sourceHeading}`);
const sourceBlock =
  sourceBlockStart === -1 ? '' : localizedPrefix.slice(sourceBlockStart);
const q6ToQ10Start =
  q6HeadingCharacterIndex === -1
    ? q6CharacterIndex
    : q6HeadingCharacterIndex;
const q6ToQ10Section =
  q6ToQ10Start === -1 || q11CharacterIndex === -1
    ? ''
    : parsed.content.slice(q6ToQ10Start, q11CharacterIndex);
const q6ToQ10SourceBlockStart = q6ToQ10Section.indexOf(
  `### ${q6ToQ10SourceHeading}`,
);
const q6ToQ10SourceBlock =
  q6ToQ10SourceBlockStart === -1
    ? ''
    : q6ToQ10Section.slice(q6ToQ10SourceBlockStart);
const q11ToQ15Start =
  q11HeadingCharacterIndex === -1
    ? legacyQ11CharacterIndex
    : q11HeadingCharacterIndex;
const q11ToQ15Section =
  q11ToQ15Start === -1 || q16CharacterIndex === -1
    ? ''
    : parsed.content.slice(q11ToQ15Start, q16CharacterIndex);
const q11ToQ15SourceBlockStart = q11ToQ15Section.indexOf(
  `### ${q11ToQ15SourceHeading}`,
);
const q11ToQ15SourceBlock =
  q11ToQ15SourceBlockStart === -1
    ? ''
    : q11ToQ15Section.slice(q11ToQ15SourceBlockStart);

describe('Traditional Chinese traffic column 003 — Q1–Q5 localization boundary', () => {
  it('preserves the immutable Q1–Q10 prefix and Q16–Q20 tail byte-for-byte', () => {
    const immutablePrefix = rawBytes.subarray(0, immutablePrefixBytes);
    const immutableQ1ToQ10Prefix = rawBytes.subarray(
      0,
      immutableQ1ToQ10PrefixBytes,
    );
    const immutableQ16Tail = rawBytes.subarray(q16ByteIndex);

    expect(immutablePrefix.byteLength).toBe(immutablePrefixBytes);
    expect(
      crypto.createHash('sha256').update(immutablePrefix).digest('hex'),
    ).toBe(immutablePrefixSha256);
    expect(immutableQ1ToQ10Prefix.byteLength).toBe(
      immutableQ1ToQ10PrefixBytes,
    );
    expect(
      crypto
        .createHash('sha256')
        .update(immutableQ1ToQ10Prefix)
        .digest('hex'),
    ).toBe(immutableQ1ToQ10PrefixSha256);
    expect(q11ByteIndex).toBe(immutableQ1ToQ10PrefixBytes);
    expect(immutableQ16Tail.toString('utf8').startsWith(q16Marker)).toBe(true);
    expect(immutableQ16Tail.byteLength).toBe(immutableQ16TailBytes);
    expect(
      crypto.createHash('sha256').update(immutableQ16Tail).digest('hex'),
    ).toBe(immutableQ16TailSha256);
  });

  it('uses the exact frontmatter, sole H1, and two contracted images', () => {
    expect(parsed.data).toEqual({
      title,
      url: sourceUrl,
      lastmod: '2026-07-26',
      date_display: '2025年9月13日',
      read_time: '閱讀時間約 8 分鐘',
      categories: ['台灣法律資訊'],
      featured_image: featuredImage,
    });
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(
      Array.from(
        parsed.content.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g),
        (match) => ({ alt: match[1], src: match[2] }),
      ),
    ).toEqual([
      { alt: featuredAlt, src: featuredImage },
      { alt: incidentAlt, src: incidentImage },
    ]);
    expect(countOccurrences(raw, sourceUrl)).toBe(1);
    expect(countOccurrences(raw, featuredImage)).toBe(2);
    expect(countOccurrences(raw, incidentImage)).toBe(1);
  });

  it('isolates exactly Q1–Q5 and places the source H3 after Q5', () => {
    expect(q6CharacterIndex).toBeGreaterThan(0);
    expect(
      Array.from(
        localizedPrefix.matchAll(/^## (Q\d+\..+)$/gm),
        (match) => match[1],
      ),
    ).toEqual([...qHeadings]);
    expect(localizedPrefix).toContain(`### ${sourceHeading}`);
    expect(sourceBlockStart).toBeGreaterThan(
      localizedPrefix.indexOf(`## ${qHeadings[4]}`),
    );
  });

  it('introduces the safety, reporting, evidence, deadline, fault, and settlement sequence with a factual caveat', () => {
    const incidentMarkdown = `![${incidentAlt}](${incidentImage})`;
    const imageEnd = localizedPrefix.indexOf(incidentMarkdown);
    const q1Start = localizedPrefix.indexOf(`## ${qHeadings[0]}`);
    const introduction =
      imageEnd === -1 || q1Start === -1
        ? ''
        : localizedPrefix.slice(imageEnd + incidentMarkdown.length, q1Start);
    const sequence = ['安全', '報警', '證據', '期限', '過失', '和解'];
    const positions = sequence.map((term) => introduction.indexOf(term));

    for (const position of positions) {
      expect(position).toBeGreaterThanOrEqual(0);
    }
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(introduction).toMatch(/(?:結果|判斷|責任).{0,24}(?:事實|情形).{0,12}(?:而異|不同)/s);
  });

  it('locks Q1 injury-or-death duties, vehicle movement rules, and Article 185-4 limits', () => {
    expectConcepts(sectionForQuestion(1), [
      { label: 'injury', pattern: /受傷|傷害/ },
      { label: 'death', pattern: /死亡/ },
      { label: 'immediate aid', pattern: /立即.{0,18}(?:救護|救助|救治|協助傷者)/s },
      { label: 'police notice', pattern: /(?:通知警察|通知警方|報警)/ },
      { label: 'preserve vehicle and scene evidence', pattern: /(?:保留|保全).{0,24}車輛.{0,24}(?:現場|證據)/s },
      { label: 'informal consent', pattern: /(?:口頭|非正式).{0,12}同意/s },
      { label: 'recording is not a substitute', pattern: /(?:錄音|錄影|錄影紀錄).{0,30}(?:不能|不得|無法).{0,12}(?:取代|代替)/s },
      { label: 'both parties agree to move', pattern: /雙方.{0,18}同意.{0,30}(?:移動|移置)車輛/s },
      { label: 'mark position and traces first', pattern: /(?:標記|標示|標繪).{0,18}(?:位置|車輛位置).{0,24}(?:痕跡|現場)/s },
      { label: 'avoid obstructing traffic', pattern: /(?:避免|免於).{0,10}(?:妨礙|阻礙)交通/s },
      { label: 'moving is distinct from leaving', pattern: /(?:移動|移置)車輛.{0,32}(?:不等於|不同於|並非).{0,12}離開現場/s },
      { label: 'property-only damage', pattern: /僅.{0,12}(?:財物|財產).{0,8}(?:損害|損失)/s },
      { label: 'movable vehicle', pattern: /車輛.{0,12}(?:可以|能夠|尚可)移動/s },
      { label: 'record then move to safety', pattern: /(?:標記|標示|拍照|錄影|記錄).{0,40}(?:移至|移往|移動到).{0,12}安全/s },
      { label: 'administrative consequences', pattern: /行政.{0,8}(?:處罰|裁罰|處分|責任|制裁)/s },
      { label: 'Criminal Code Article 185-4', pattern: /刑法第\s*185\s*條之\s*4/ },
      { label: 'Article 185-4 fact-specific analysis', pattern: /第\s*185\s*條之\s*4.{0,100}(?:個案|具體事實|實際情形).{0,20}(?:判斷|分析)/s },
    ]);
  });

  it('locks Q2 safety-first preservation and the scene/7-day/30-day police timetable', () => {
    expectConcepts(sectionForQuestion(2), [
      { label: 'personal safety first', pattern: /(?:先|優先).{0,18}(?:人身|自身|個人|現場)安全/s },
      { label: 'warning measures', pattern: /警示.{0,8}(?:措施|標誌|設備)|設置.{0,8}警告標誌/ },
      { label: '119 rescue', pattern: /119.{0,18}(?:受傷|救護|救援)|(?:受傷|救護|救援).{0,18}119/s },
      { label: '110 police', pattern: /110.{0,18}(?:警察|警方|報警|犯罪)|(?:警察|警方|報警|犯罪).{0,18}110/s },
      { label: '112 emergency police', pattern: /112.{0,18}(?:緊急|警察|警方|報警|犯罪)|(?:緊急|警察|警方|報警|犯罪).{0,18}112/s },
      { label: 'traffic-accident police report', pattern: /交通事故.{0,20}(?:報警|報案|警察機關)/s },
      { label: 'wide and close photographs', pattern: /(?:全景|廣角|遠景|大範圍).{0,18}(?:近照|特寫|近距離)/s },
      { label: 'vehicle position and damage', pattern: /車輛.{0,10}位置.{0,24}(?:損壞|受損|毀損)/s },
      { label: 'road markings', pattern: /道路.{0,6}(?:標線|標誌)/s },
      { label: 'signals and weather', pattern: /號誌.{0,18}天候|天候.{0,18}號誌/s },
      { label: 'witness contacts', pattern: /目擊者.{0,16}(?:聯絡|聯繫).{0,6}(?:方式|資料|資訊)/s },
      { label: 'CCTV preservation', pattern: /(?:監視器|CCTV).{0,24}(?:保存|保全|留存)/s },
      { label: 'dashcam preservation', pattern: /行車紀錄器.{0,24}(?:保存|保全|留存)/s },
      { label: 'party, vehicle, and insurance data', pattern: /當事人.{0,24}車輛.{0,24}保險.{0,12}(?:資料|資訊)/s },
      { label: 'medical records', pattern: /(?:病歷|診療紀錄|就醫紀錄|醫療紀錄)/ },
      { label: 'private photos do not replace police handling', pattern: /(?:自行|私人|個人).{0,12}(?:拍照|照片|影像).{0,30}(?:不能|不得|無法).{0,12}(?:取代|代替).{0,18}(?:警察|警方)/s },
      { label: 'registration/contact form at scene', pattern: /(?:(?:當事人登記聯單|當事人登記聯絡資料|登記聯絡表).{0,24}(?:現場|當場)|(?:現場|當場).{0,24}(?:當事人登記聯單|當事人登記聯絡資料|登記聯絡表))/s },
      { label: 'scene diagram and photos after seven days', pattern: /(?:(?:現場圖|事故現場圖).{0,18}(?:現場照片|事故照片|照片).{0,30}7\s*日|7\s*日.{0,30}(?:現場圖|事故現場圖).{0,18}(?:現場照片|事故照片|照片))/s },
      { label: 'preliminary analysis after thirty days', pattern: /(?:(?:初步分析研判表|初判表).{0,30}30\s*日|30\s*日.{0,30}(?:初步分析研判表|初判表))/s },
      { label: 'confirm current agency requirements', pattern: /確認.{0,80}(?:申請|提供).{0,24}(?:條件|要求|方式|規定)|(?:申請|提供).{0,24}(?:條件|要求|方式|規定).{0,80}確認/s },
      { label: 'competent police agency', pattern: /(?:主管|管轄|承辦).{0,10}(?:警察機關|警察單位|警方)/s },
    ]);
  });

  it('locks Q3 criminal/civil periods and criminal-attached civil-action cost caveats', () => {
    expectConcepts(sectionForQuestion(3), [
      { label: 'Criminal Code Article 284', pattern: /刑法第\s*284\s*條/ },
      { label: 'negligent injury and serious injury', pattern: /過失.{0,8}傷害.{0,18}(?:重傷|致重傷)/s },
      { label: 'Criminal Code Article 287 complaint basis', pattern: /刑法第\s*287\s*條.{0,40}(?:告訴乃論|須告訴)/s },
      { label: 'Criminal Procedure Article 237', pattern: /刑事訴訟法第\s*237\s*條/ },
      { label: 'six months after identity is known', pattern: /知悉.{0,18}(?:犯人|行為人|加害人|對方).{0,24}6\s*個?月/s },
      { label: 'Civil Code Article 197', pattern: /民法第\s*197\s*條/ },
      { label: 'two years after damage and liable person are known', pattern: /知悉.{0,20}損害.{0,24}(?:賠償義務人|應負責任之人|責任人).{0,24}2\s*年/s },
      { label: 'ten years after the tort', pattern: /侵權行為.{0,24}10\s*年/s },
      { label: 'Criminal Procedure Articles 487 and 488', pattern: /刑事訴訟法第\s*487\s*條.{0,80}第\s*488\s*條/s },
      { label: 'pending criminal matter', pattern: /刑事.{0,16}(?:案件|程序).{0,18}(?:繫屬|進行|審理)/s },
      { label: 'through second-instance oral argument', pattern: /第二審.{0,18}言詞辯論.{0,8}終結/s },
      { label: 'ordinarily no separate advance court fee', pattern: /通常.{0,30}(?:不必|無須|免).{0,12}(?:預先|另行).{0,12}(?:繳納|支付).{0,8}裁判費/s },
      { label: 'not every outcome is cost-free', pattern: /(?:並非|不代表|不等於).{0,30}(?:所有|任何|全程).{0,18}(?:費用|成本).{0,12}(?:免除|不用|為零|不存在)/s },
      { label: 'Articles 503 and 504', pattern: /第\s*503\s*條.{0,80}第\s*504\s*條/s },
      { label: 'transfer and costs', pattern: /移送.{0,40}(?:費用|裁判費|訴訟費用)/s },
      { label: 'limitation interruption', pattern: /時效.{0,8}(?:中斷|中止|不完成)/s },
      { label: 'defendants, evidence, insurance, jurisdiction', pattern: /被告.{0,20}證據.{0,20}保險.{0,20}管轄/s },
      { label: 'no universally best route', pattern: /(?:沒有|並無|不存在).{0,70}(?:一律|永遠|所有案件).{0,70}(?:最佳|最好)|(?:沒有|並無|不存在).{0,70}(?:最佳|最好).{0,70}(?:一律|永遠|所有案件)/s },
    ]);
  });

  it('locks Q4 individualized criminal negligence, civil comparative fault, and exact TWD figures', () => {
    const section = sectionForQuestion(4);
    expectConcepts(section, [
      { label: 'each person duty-of-care breach', pattern: /各自.{0,18}注意義務.{0,12}違反/s },
      { label: 'causation of the other party injury', pattern: /(?:對方|他方).{0,12}(?:受傷|傷害).{0,18}因果關係|因果關係.{0,18}(?:對方|他方).{0,12}(?:受傷|傷害)/s },
      { label: 'mutual fault is not automatically criminal', pattern: /雙方.{0,10}過失.{0,30}(?:不當然|不必然|並非自動).{0,18}(?:過失傷害|刑事責任)/s },
      { label: 'Civil Code Article 217', pattern: /民法第\s*217\s*條/ },
      { label: 'court may reduce or exempt damages', pattern: /法院.{0,18}(?:減輕|減少).{0,12}(?:或|、).{0,8}免除.{0,12}賠償/s },
      { label: 'accepted damage', pattern: /認定.{0,12}損害.{0,12}新臺幣 1,000,000 元/s },
      { label: 'fifty-percent claimant fault', pattern: /(?:請求權人|被害人|受害人).{0,12}過失.{0,8}50%/s },
      { label: 'pre-adjustment award', pattern: /(?:新臺幣 500,000 元.{0,30}(?:其他調整|其餘調整|其他因素).{0,12}(?:前|之前)|(?:其他調整|其餘調整|其他因素).{0,12}(?:前|之前).{0,30}新臺幣 500,000 元)/s },
      { label: 'appraisal evidence', pattern: /(?:鑑定|鑑定意見).{0,40}(?:重要|有力).{0,8}證據|(?:重要|有力).{0,8}證據.{0,40}(?:鑑定|鑑定意見)/s },
      { label: 'preliminary-analysis evidence', pattern: /(?:初步分析研判表|初判表).{0,40}(?:重要|有力).{0,8}證據|(?:重要|有力).{0,8}證據.{0,40}(?:初步分析研判表|初判表)/s },
      { label: 'evidence does not mechanically bind court', pattern: /(?:不能|不會|並不|並非).{0,18}(?:機械地|機械性|當然).{0,12}(?:拘束|約束).{0,8}法院/s },
    ]);
    expect(section).toContain('新臺幣 1,000,000 元');
    expect(section).toContain('新臺幣 500,000 元');
  });

  it('locks Q5 settlement scope, Articles 736–737, and complaint-withdrawal limits', () => {
    expectConcepts(sectionForQuestion(5), [
      { label: 'accident time and place', pattern: /事故.{0,8}(?:時間|日期).{0,12}地點/s },
      { label: 'parties', pattern: /當事人/ },
      { label: 'payment amount and timing', pattern: /(?:付款|支付|給付).{0,12}金額.{0,12}(?:時間|期限|日期|方式)/s },
      { label: 'insurance handling', pattern: /保險.{0,12}(?:處理|理賠|給付)/s },
      { label: 'included and reserved claims', pattern: /包含.{0,12}(?:請求|項目).{0,24}(?:保留|不包含).{0,12}(?:請求|項目)/s },
      { label: 'future treatment and later-discovered injury', pattern: /後續.{0,8}治療.{0,24}(?:日後|後來).{0,12}(?:發現|出現).{0,8}(?:傷勢|傷害|症狀)/s },
      { label: 'document delivery', pattern: /文件.{0,8}(?:交付|提供|移交)|(?:交付|提供|移交).{0,8}文件/s },
      { label: 'payment and complaint withdrawal relationship', pattern: /(?:付款|支付|給付).{0,30}(?:撤回告訴|告訴撤回)|(?:撤回告訴|告訴撤回).{0,30}(?:付款|支付|給付)/s },
      { label: 'Civil Code Articles 736 and 737', pattern: /民法第\s*736\s*條.{0,80}第\s*737\s*條/s },
      { label: 'mutual-concession contract', pattern: /互相讓步|相互讓步/ },
      { label: 'extinguished rights depend on relinquished scope', pattern: /(?:權利|請求).{0,12}(?:消滅|拋棄|放棄).{0,40}(?:約定|讓步|拋棄|放棄).{0,12}範圍|(?:消滅|拋棄|放棄).{0,18}(?:權利|請求).{0,40}(?:約定|讓步|拋棄|放棄).{0,12}範圍/s },
      { label: 'future claims do not all automatically disappear', pattern: /(?:未來|日後).{0,18}(?:請求|權利).{0,30}(?:不當然|不一定|並非自動).{0,12}(?:消滅|喪失|失效)/s },
      { label: 'Criminal Procedure Article 238', pattern: /刑事訴訟法第\s*238\s*條/ },
      { label: 'withdrawal before first-instance oral argument ends', pattern: /第一審.{0,18}言詞辯論.{0,8}終結.{0,18}(?:前|以前).{0,18}(?:撤回告訴|撤回)/s },
      { label: 'no refiling after withdrawal', pattern: /撤回.{0,30}(?:不得|不能).{0,12}(?:再行告訴|再次提出告訴|再提出告訴|重新告訴)/s },
      { label: 'private settlement does not end non-complaint prosecution', pattern: /非告訴乃論.{0,40}(?:私人|私下)?和解.{0,40}(?:不當然|不會自動|並不會自動).{0,18}(?:公訴|追訴|刑事程序)/s },
      { label: 'settlement does not always compel withdrawal', pattern: /和解.{0,30}(?:不代表|並非|不當然).{0,18}(?:必須|一定要).{0,8}撤回告訴/s },
    ]);
  });

  it('uses all 17 official URLs exactly once, in order, with Traditional Chinese link labels and no raw URL', () => {
    const markdownLinks = Array.from(
      sourceBlock.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g),
      (match) => ({ label: match[1], url: match[2] }),
    );

    expect(markdownLinks.map(({ url }) => url)).toEqual(sourceTargets);
    for (const { label } of markdownLinks) {
      expect(label).toMatch(/\p{Script=Han}/u);
      expect(label).not.toMatch(/\p{Script=Hangul}/u);
      expect(label).not.toMatch(
        /[\p{Script=Hiragana}\p{Script=Katakana}]/u,
      );
    }
    for (const target of sourceTargets) {
      expect(countOccurrences(localizedPrefix, target)).toBe(1);
    }
    expect(sourceBlock).not.toMatch(/(?<!\]\()https?:\/\//);
  });

  it('rejects stale copy, foreign scripts, simplified-only variants, invisible spacers, and outcome guarantees only in Q1–Q5', () => {
    for (const phrase of prohibitedStaleCopy) {
      expect(localizedPrefix).not.toContain(phrase);
    }
    for (const phrase of prohibitedOutcomeGuarantees) {
      expect(localizedPrefix).not.toContain(phrase);
    }

    expect(localizedPrefix).not.toMatch(/\p{Script=Hangul}/u);
    expect(localizedPrefix).not.toMatch(
      /[\p{Script=Hiragana}\p{Script=Katakana}]/u,
    );
    expect(localizedPrefix).not.toMatch(
      /[这为个过发应实与后还会当从对请诉证赔伤条时场车报务处]/,
    );
    expect(localizedPrefix).not.toMatch(/^[\t ]*\u200b+[\t ]*$/m);
    expect(localizedPrefix).not.toMatch(/^(?:大家好|各位好|您好)[，。！!]?/m);
    expect(localizedPrefix).not.toMatch(/(?:歡迎|請).{0,12}(?:留言|評論)/s);
    expect(localizedPrefix).not.toMatch(
      /(?:我|本人|本律師).{0,30}(?:處理|承辦|經驗).{0,30}(?:案件|事故)/s,
    );
    expect(localizedPrefix).not.toMatch(/(?:律師|作者).{0,8}(?:敬上|謹上)/);
    expect(localizedPrefix).not.toMatch(
      /(?<!不)(?:一定|必然|必定|保證|一律).{0,20}(?:勝訴|獲賠|認定|成立|構成|免除|無須繳費|不用繳費)/s,
    );
    expect(localizedPrefix).not.toMatch(/(?:韓元|원)/);
  });
});

describe('Traditional Chinese traffic column 003 — Q6–Q10 localization boundary', () => {
  it('starts the new Q6 H2 at byte 7238 and isolates exactly Q6–Q10 before the immutable Q11 marker', () => {
    expect(q6HeadingByteIndex).toBe(immutablePrefixBytes);
    expect(q6ByteIndex).toBe(immutablePrefixBytes + 3);
    expect(q11CharacterIndex).toBeGreaterThan(q6HeadingCharacterIndex);
    expect(
      Array.from(
        q6ToQ10Section.matchAll(/^## (Q\d+\..+)$/gm),
        (match) => match[1],
      ),
    ).toEqual([...q6ToQ10Headings]);
    expect(q6ToQ10Section).toContain(`### ${q6ToQ10SourceHeading}`);
    expect(q6ToQ10SourceBlockStart).toBeGreaterThan(
      q6ToQ10Section.indexOf(`## ${q6ToQ10Headings[4]}`),
    );
    expect(q6ToQ10Section).not.toContain(`## ${q11Marker}`);
  });

  it('locks Q6 preliminary analysis, appraisal, commissioning, one review, and independent evaluation', () => {
    expectConcepts(q6ToQ10SectionForQuestion(6), [
      {
        label: 'preliminary police analysis',
        pattern:
          /(?:道路交通事故初步分析研判表|初判表).{0,40}(?:警方|警察).{0,20}(?:初步|初步分析)|(?:警方|警察).{0,20}(?:初步|初步分析).{0,40}(?:道路交通事故初步分析研判表|初判表)/s,
      },
      {
        label: 'not a court judgment',
        pattern:
          /(?:道路交通事故初步分析研判表|初判表).{0,40}(?:不是|並非|不等於).{0,12}(?:法院|法庭).{0,8}(?:判決|裁判)/s,
      },
      {
        label: 'does not bind court',
        pattern:
          /(?:道路交通事故初步分析研判表|初判表).{0,60}(?:不會|不能|不當然|並不|並非).{0,18}(?:拘束|約束).{0,8}法院/s,
      },
      {
        label: 'does not fix fault percentage',
        pattern:
          /(?:道路交通事故初步分析研判表|初判表).{0,60}(?:不會|不能|不當然|並不|並非).{0,18}(?:確定|決定|固定).{0,12}過失比例/s,
      },
      {
        label: 'no automatic or mandatory ladder',
        pattern:
          /(?:並非|不是|不屬於).{0,32}(?:自動|強制|必經|必須依序).{0,16}(?:程序|階段|順序|流程)|(?:自動|強制|必經|必須依序).{0,16}(?:程序|階段|順序|流程).{0,32}(?:並非|不是|不屬於)/s,
      },
      {
        label: 'eligible party application',
        pattern:
          /(?:符合資格|有申請資格|得申請).{0,18}(?:當事人|一方).{0,30}(?:申請|聲請).{0,12}(?:車輛行車事故)?鑑定|(?:當事人|一方).{0,18}(?:符合資格|有申請資格).{0,30}(?:申請|聲請).{0,12}(?:車輛行車事故)?鑑定/s,
      },
      {
        label: 'handling-authority transfer',
        pattern: /(?:處理|承辦).{0,10}機關.{0,20}(?:移送|轉送).{0,16}鑑定/s,
      },
      {
        label: 'judicial commissioning',
        pattern: /(?:司法機關|法院|檢察機關).{0,24}(?:囑託|委託).{0,12}鑑定/s,
      },
      {
        label: 'six-month party-application period',
        pattern: /(?:事故發生|事故).{0,24}6\s*個?月.{0,30}(?:申請|聲請)/s,
      },
      {
        label: 'pending investigation or trial',
        pattern: /(?:偵查|調查).{0,12}(?:或|、).{0,8}(?:審判|審理).{0,24}(?:繫屬|進行中)/s,
      },
      {
        label: 'commission instead of a new direct application',
        pattern:
          /(?:司法機關|法院|檢察機關).{0,24}(?:囑託|委託).{0,40}(?:不是|而非|不再|不得).{0,24}(?:直接|自行).{0,8}(?:申請|聲請)|(?:不是|而非|不再|不得).{0,24}(?:直接|自行).{0,8}(?:申請|聲請).{0,40}(?:司法機關|法院|檢察機關).{0,24}(?:囑託|委託)/s,
      },
      {
        label: 'review limited to one time',
        pattern: /(?:覆議|複議|審查).{0,20}(?:一次|1\s*次).{0,12}(?:為限|僅限|只能)/s,
      },
      {
        label: 'opinions are evidence or reference',
        pattern:
          /(?:鑑定|覆議).{0,12}意見.{0,24}(?:證據|參考資料|參考依據)/s,
      },
      {
        label: 'independent whole-record evaluation',
        pattern:
          /法院.{0,20}獨立.{0,12}(?:判斷|評價|審酌).{0,40}(?:陳述|說明).{0,20}(?:影像|影片|錄影).{0,20}(?:現場紀錄|現場資料).{0,24}(?:全部|全案|整體).{0,8}(?:卷證|資料|紀錄)/s,
      },
    ]);
  });

  it('locks Q7 conditional injury, death, and property damage categories under Articles 184 and 192–196/216', () => {
    const section = q6ToQ10SectionForQuestion(7);
    expectConcepts(section, [
      { label: 'Civil Code Article 184', pattern: /民法第\s*184\s*條/ },
      { label: 'unlawful infringement', pattern: /不法侵害|違法侵害/ },
      { label: 'causation', pattern: /因果關係/ },
      { label: 'proof of damage', pattern: /損害.{0,12}(?:證明|舉證)|(?:證明|舉證).{0,12}損害/s },
      {
        label: 'accident does not automatically establish every item',
        pattern:
          /事故.{0,30}(?:不當然|不會自動|並非自動).{0,24}(?:全部|所有|每一).{0,12}(?:損害|項目|請求)/s,
      },
      { label: 'Civil Code Article 216', pattern: /民法第\s*216\s*條/ },
      {
        label: 'actual loss and lost profit',
        pattern: /(?:所受損害|實際損失).{0,18}(?:所失利益|可得利益)/s,
      },
      { label: 'Civil Code Article 193', pattern: /民法第\s*193\s*條/ },
      {
        label: 'injury expenses',
        pattern:
          /(?:醫療|治療).{0,16}(?:看護|照護).{0,16}交通.{0,20}(?:輔具|輔助器具)/s,
      },
      {
        label: 'temporary lost income',
        pattern: /(?:暫時|治療期間).{0,18}(?:不能工作|工作能力).{0,18}(?:收入|薪資|所得).{0,12}(?:損失|減少)/s,
      },
      {
        label: 'loss of earning capacity',
        pattern: /勞動能力.{0,8}(?:減損|喪失)|工作能力.{0,8}(?:減損|喪失)/,
      },
      { label: 'Civil Code Article 195', pattern: /民法第\s*195\s*條/ },
      {
        label: 'injury non-pecuniary damage',
        pattern: /(?:非財產上損害|精神慰撫金)/,
      },
      { label: 'Civil Code Article 192', pattern: /民法第\s*192\s*條/ },
      {
        label: 'death expenses and support',
        pattern:
          /(?:死亡前|生前).{0,20}(?:醫療|治療).{0,24}殯葬.{0,24}(?:扶養|扶養利益)/s,
      },
      { label: 'Civil Code Article 194', pattern: /民法第\s*194\s*條/ },
      {
        label: 'qualifying relatives non-pecuniary damage',
        pattern:
          /(?:特定|法定|符合資格).{0,12}親屬.{0,24}(?:非財產上損害|精神慰撫金)/s,
      },
      { label: 'Civil Code Article 196', pattern: /民法第\s*196\s*條/ },
      {
        label: 'proven property damage',
        pattern:
          /(?:財物|財產).{0,12}(?:實際|具體).{0,8}損害.{0,20}(?:證明|舉證)|(?:證明|舉證).{0,20}(?:財物|財產).{0,12}(?:實際|具體).{0,8}損害/s,
      },
      {
        label: 'repair or diminution in value',
        pattern: /修理費|修復費|維修費/,
      },
      {
        label: 'diminution in value',
        pattern: /價值減損|交易價值.{0,8}(?:減少|貶損)/,
      },
    ]);
  });

  it('locks Q8 medical evidence supplementation, claim changes, and the narrow Article 504 fee caveat', () => {
    expectConcepts(q6ToQ10SectionForQuestion(8), [
      {
        label: 'receipts, diagnosis certificates, and medical records',
        pattern: /收據.{0,18}診斷證明.{0,18}(?:病歷|醫療紀錄|診療紀錄)/s,
      },
      {
        label: 'medical necessity and accident causation',
        pattern:
          /醫療.{0,8}必要性.{0,20}(?:事故|傷勢).{0,12}因果關係|(?:事故|傷勢).{0,12}因果關係.{0,20}醫療.{0,8}必要性/s,
      },
      {
        label: 'continuing-treatment evidence may supplement',
        pattern:
          /(?:持續|後續).{0,8}治療.{0,24}(?:資料|紀錄|收據).{0,24}(?:補充|補提出).{0,12}證據/s,
      },
      {
        label: 'procedural schedule and existing claim',
        pattern:
          /程序.{0,8}(?:期程|進度|時程).{0,24}(?:原有|既有).{0,8}(?:請求|主張)/s,
      },
      {
        label: 'late evidence or expanded claim not guaranteed accepted',
        pattern:
          /(?:逾期|遲延|晚提出).{0,18}(?:資料|證據).{0,24}(?:擴張|增加|變更).{0,12}(?:請求|範圍).{0,30}(?:不保證|未必|不一定).{0,12}(?:准許|接受|採納)/s,
      },
      {
        label: 'evidence supplementation differs from claim changes',
        pattern:
          /補充.{0,12}(?:醫療)?證據.{0,30}(?:不等於|不同於|有別於|應區分).{0,20}(?:變更|增加|擴張).{0,16}(?:金額|範圍|請求)/s,
      },
      {
        label: 'receipt addition does not itself create a fee',
        pattern:
          /追加.{0,12}(?:醫療)?收據.{0,30}(?:不當然|不會自動|並非僅因).{0,24}(?:裁判費|法院費用)/s,
      },
      {
        label: 'Criminal Procedure Article 504',
        pattern: /刑事訴訟法第\s*504\s*條/,
      },
      {
        label: 'transfer to civil division',
        pattern: /移送.{0,16}民事庭|移送.{0,16}民事法院/,
      },
      {
        label: 'excess beyond pre-transfer claim',
        pattern:
          /移送前.{0,18}(?:請求|範圍).{0,24}(?:變更|追加|增加|擴張).{0,18}(?:超過|超出).{0,12}(?:部分|範圍)|(?:變更|追加|增加|擴張).{0,18}請求.{0,18}(?:超過|超出).{0,18}移送前.{0,18}(?:請求|範圍).{0,18}(?:超過|超出).{0,8}部分/s,
      },
      {
        label: 'fee issue only for excess',
        pattern:
          /(?:超過|超出|超額).{0,8}部分.{0,24}(?:裁判費|法院費用).{0,12}(?:問題|負擔|繳納)/s,
      },
      {
        label: 'case-specific stage, timing, and scope',
        pattern:
          /移送.{0,8}階段.{0,16}(?:提出|聲明|申請).{0,8}(?:時間|時點).{0,16}(?:請求|聲明).{0,8}範圍.{0,24}(?:個案|具體).{0,8}(?:確認|判斷)/s,
      },
    ]);
  });

  it('locks Q9 care need, actual provision, duration, reasonable value, and non-automatic family care', () => {
    expectConcepts(q6ToQ10SectionForQuestion(9), [
      {
        label: 'diagnosis or medical opinion is useful but not conclusive',
        pattern:
          /(?:診斷證明|醫療意見|醫師意見).{0,24}(?:有用|重要|可作為).{0,12}證據.{0,30}(?:不是|並非|不當然).{0,12}(?:決定性|唯一|充分)/s,
      },
      {
        label: 'accident causation',
        pattern: /事故.{0,12}因果關係|因果關係.{0,12}事故/s,
      },
      { label: 'care need', pattern: /看護.{0,8}必要性|照護.{0,8}必要性/ },
      {
        label: 'actual provision',
        pattern: /實際.{0,8}(?:提供|進行).{0,8}(?:看護|照護)/s,
      },
      { label: 'duration', pattern: /(?:看護|照護).{0,8}(?:期間|時數|時間)/ },
      {
        label: 'reasonable amount',
        pattern: /(?:合理|相當).{0,8}(?:金額|費用|數額)/,
      },
      {
        label: 'unpaid relative care may be valued',
        pattern:
          /親屬.{0,20}(?:無償|未實際支付|沒有金錢支出).{0,30}(?:得|可以|可能).{0,12}(?:評價|認列|計算).{0,12}(?:損害|費用)/s,
      },
      {
        label: 'relative care is not automatic',
        pattern:
          /親屬.{0,16}(?:看護|照護).{0,30}(?:不當然|不會自動|並非自動).{0,16}(?:認定|准許|賠償)/s,
      },
      {
        label: 'nature, duration, and customary cost',
        pattern:
          /(?:看護|照護).{0,8}性質.{0,16}(?:期間|時間).{0,16}(?:通常|一般|市場|慣常).{0,8}(?:費用|價格|成本)/s,
      },
    ]);
  });

  it('locks Q10 treatment-linked travel proof and the non-exclusive, non-sufficient taxi-receipt caveat', () => {
    expectConcepts(q6ToQ10SectionForQuestion(10), [
      {
        label: 'travel linked to treatment and accident injury',
        pattern:
          /交通.{0,12}(?:紀錄|費用).{0,24}治療.{0,24}事故.{0,12}(?:傷勢|受傷|傷害)|事故.{0,12}(?:傷勢|受傷|傷害).{0,24}治療.{0,24}交通.{0,12}(?:紀錄|費用)/s,
      },
      {
        label: 'route and visit count/date',
        pattern:
          /路線.{0,16}(?:就醫|回診|治療).{0,8}次數.{0,12}(?:日期|時間)/s,
      },
      {
        label: 'transport method and fare',
        pattern: /交通工具|運輸方式|搭乘方式/,
      },
      { label: 'fare', pattern: /車資|費用|票價/ },
      {
        label: 'necessity and reasonableness',
        pattern: /必要性.{0,18}合理性|合理性.{0,18}必要性/s,
      },
      {
        label: 'possible evidence',
        pattern:
          /收據.{0,14}(?:車資|票價|費用).{0,8}紀錄.{0,14}路線.{0,8}紀錄.{0,14}(?:治療|就醫).{0,8}紀錄/s,
      },
      {
        label: 'taxi receipt is not the only proof',
        pattern:
          /計程車收據.{0,24}(?:不是|並非|不屬於).{0,12}(?:唯一|僅有).{0,8}(?:證據|證明)/s,
      },
      {
        label: 'taxi receipt is not automatically sufficient',
        pattern:
          /計程車收據.{0,24}(?:不當然|不會自動|並非自動).{0,12}(?:足夠|充分|成立)/s,
      },
    ]);
  });

  it('uses all 14 Q6–Q10 official URLs exactly once and in order with Traditional Chinese labels', () => {
    const markdownLinks = Array.from(
      q6ToQ10SourceBlock.matchAll(
        /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      ),
      (match) => ({ label: match[1], url: match[2] }),
    );

    expect(markdownLinks.map(({ url }) => url)).toEqual(
      q6ToQ10SourceTargets,
    );
    for (const { label } of markdownLinks) {
      expect(label).toMatch(/\p{Script=Han}/u);
      expect(label).not.toMatch(/\p{Script=Hangul}/u);
      expect(label).not.toMatch(
        /[\p{Script=Hiragana}\p{Script=Katakana}]/u,
      );
    }
    for (const target of q6ToQ10SourceTargets) {
      expect(countOccurrences(q6ToQ10Section, target)).toBe(1);
    }
    expect(q6ToQ10SourceBlock).not.toMatch(/(?<!\]\()https?:\/\//);
  });

  it('rejects stale Q6–Q10 copy, bare damage-label lists, foreign scripts, simplified variants, and invisible spacers', () => {
    for (const phrase of prohibitedQ6ToQ10Copy) {
      expect(q6ToQ10Section).not.toContain(phrase);
    }

    const bareDamageLabels = q6ToQ10Section.match(
      /^\s*[1-9][.、]\s*(?:醫療費用|看護費用|生活上增加的必要費用|不能工作的損失|勞動能力減損|喪葬費用|扶養費|精神慰撫金|財產損失)\s*$/gm,
    );
    expect(bareDamageLabels ?? []).toHaveLength(0);
    expect(q6ToQ10Section).not.toMatch(/\p{Script=Hangul}/u);
    expect(q6ToQ10Section).not.toMatch(
      /[\p{Script=Hiragana}\p{Script=Katakana}]/u,
    );
    expect(q6ToQ10Section).not.toMatch(
      /[这为个过发应实与后还会当从对请诉证赔伤条时场车报务处]/,
    );
    expect(q6ToQ10Section).not.toMatch(/^[\t ]*\u200b+[\t ]*$/m);
  });
});

describe('Traditional Chinese traffic column 003 — Q11–Q15 localization boundary', () => {
  it('starts the new Q11 H2 at byte 12401 and isolates exactly Q11–Q15 before the immutable Q16 marker', () => {
    expect(q11HeadingByteIndex).toBe(immutableQ1ToQ10PrefixBytes);
    expect(q16CharacterIndex).toBeGreaterThan(q11HeadingCharacterIndex);
    expect(
      Array.from(
        q11ToQ15Section.matchAll(/^## (Q\d+\..+)$/gm),
        (match) => match[1],
      ),
    ).toEqual([...q11ToQ15Headings]);
    expect(q11ToQ15Section).toContain(`### ${q11ToQ15SourceHeading}`);
    expect(q11ToQ15SourceBlockStart).toBeGreaterThan(
      q11ToQ15Section.indexOf(`## ${q11ToQ15Headings[4]}`),
    );
    expect(q11ToQ15Section).not.toContain(`## ${q16Marker}`);
  });

  it('locks Q11 temporary income loss, proof categories, and the separate Q12 issue', () => {
    expectConcepts(q11ToQ15SectionForQuestion(11), [
      {
        label: 'accident-related injury',
        pattern:
          /(?:事故.{0,16}(?:受傷|傷害).{0,24}(?:所致|造成|因果關係))|(?:(?:受傷|傷害).{0,16}(?:事故|因果關係))/s,
      },
      {
        label: 'whole or partial inability to work',
        pattern:
          /(?:全部|完全).{0,8}(?:或|、).{0,8}部分.{0,12}(?:不能|無法).{0,8}工作|(?:不能|無法).{0,8}(?:全部|完全).{0,8}(?:或|、).{0,8}部分.{0,8}工作/s,
      },
      {
        label: 'supported treatment or recovery period',
        pattern:
          /(?:治療|療養).{0,8}(?:或|、).{0,8}(?:恢復|休養)期間.{0,30}(?:資料|紀錄|證據|證明|佐證|支持)|(?:資料|紀錄|證據|證明|佐證|支持).{0,30}(?:治療|療養).{0,8}(?:或|、).{0,8}(?:恢復|休養)期間/s,
      },
      {
        label: 'actual income reduction',
        pattern: /實際.{0,10}(?:收入|所得|薪資).{0,8}(?:減少|損失)/s,
      },
      {
        label: 'diagnosis or rest advice is important but not conclusive',
        pattern:
          /(?:診斷證明|休養建議|醫囑).{0,30}(?:重要|有力|可作為).{0,12}證據.{0,30}(?:不是|並非|不當然).{0,12}(?:充分|決定性|唯一|當然成立)/s,
      },
      {
        label: 'treatment records',
        pattern: /(?:治療|就醫|病歷|醫療).{0,8}(?:紀錄|資料)/,
      },
      {
        label: 'attendance or leave records',
        pattern: /(?:出勤|考勤).{0,8}(?:或|、).{0,8}(?:請假|休假).{0,8}(?:紀錄|資料)/s,
      },
      {
        label: 'payroll and tax material',
        pattern:
          /(?:薪資單|工資單|薪資資料|工資資料|薪資紀錄|工資紀錄).{0,20}(?:報稅|稅務|所得稅|扣繳).{0,8}(?:資料|紀錄|憑單)|(?:報稅|稅務|所得稅|扣繳).{0,8}(?:資料|紀錄|憑單).{0,20}(?:薪資單|工資單|薪資資料|工資資料|薪資紀錄|工資紀錄)/s,
      },
      {
        label: 'employer confirmation',
        pattern: /雇主.{0,8}(?:證明|確認|說明)/,
      },
      {
        label: 'self-employed business records',
        pattern:
          /(?:自營業者|自營工作者|自行執業者).{0,24}(?:帳冊|帳簿|發票|營業紀錄|業務紀錄|營業資料|業務資料|營業憑證)/s,
      },
      {
        label: 'continued work or unchanged pay is relevant',
        pattern:
          /(?:(?:繼續|持續).{0,8}工作|(?:薪資|收入|所得).{0,8}(?:未變|沒有變|未減少|相同)).{0,24}(?:相關|考量|判斷)/s,
      },
      {
        label: 'temporary loss does not itself decide lasting capacity',
        pattern:
          /(?:繼續|持續).{0,8}工作|(?:薪資|收入|所得).{0,8}(?:未變|沒有變|未減少|相同)/,
      },
      {
        label: 'separate lasting earning-capacity issue',
        pattern:
          /(?:不當然|不會自動|不能單憑|不足以).{0,24}(?:決定|排除|否定).{0,24}(?:勞動能力|工作能力).{0,8}(?:減損|喪失)|(?:勞動能力|工作能力).{0,8}(?:減損|喪失).{0,24}(?:另行|分別|不同).{0,8}(?:判斷|認定|問題)/s,
      },
    ]);
  });

  it('locks Q12 lasting earning-capacity proof, adjustments, discounting, and secured periodic payments', () => {
    expectConcepts(q11ToQ15SectionForQuestion(12), [
      {
        label: 'distinct from temporary actual income loss',
        pattern:
          /(?:暫時|治療期間|恢復期間).{0,18}(?:實際)?(?:收入|所得|薪資).{0,8}(?:減少|損失).{0,30}(?:不同|有別|區分)|(?:不同|有別|區分).{0,30}(?:暫時|治療期間|恢復期間).{0,18}(?:實際)?(?:收入|所得|薪資).{0,8}(?:減少|損失)/s,
      },
      {
        label: 'Civil Code Articles 193 and 216',
        pattern: /民法第\s*193\s*條.{0,80}第\s*216\s*條/s,
      },
      { label: 'accident causation', pattern: /事故.{0,16}因果關係|因果關係.{0,16}事故/s },
      {
        label: 'lasting functional impairment',
        pattern:
          /(?:持續|永久|長期).{0,12}(?:功能|身體機能|勞動能力|工作能力).{0,12}(?:障礙|減損|受限)/s,
      },
      {
        label: 'occupation and ability',
        pattern:
          /(?:職業|工作內容).{0,16}(?:能力|工作能力|勞動能力)|(?:能力|工作能力|勞動能力).{0,16}(?:職業|工作內容)/s,
      },
      {
        label: 'ordinarily expected income',
        pattern:
          /(?:通常|一般|正常情形).{0,8}(?:可得|預期|預計).{0,8}(?:收入|所得|利益)/s,
      },
      {
        label: 'supported working life',
        pattern:
          /(?:有證據|依證據|證據支持|可支持|合理).{0,20}(?:工作年限|勞動年限|可工作期間|工作期間)|(?:工作年限|勞動年限|可工作期間|工作期間).{0,20}(?:證據|佐證|合理)/s,
      },
      {
        label: 'unchanged current pay does not eliminate the claim',
        pattern:
          /(?:目前|現有|現時)?(?:薪資|收入|所得).{0,8}(?:未變|未減少|相同).{0,24}(?:不當然|不會自動|不足以).{0,18}(?:排除|否定|消滅).{0,12}(?:請求|損害|減損)/s,
      },
      {
        label: 'impairment percentage is not mechanically decisive',
        pattern:
          /(?:減損|失能|障礙).{0,8}比例.{0,24}(?:不會|不能|不應|並非).{0,12}(?:機械|直接|單獨).{0,12}(?:決定|計算|認定)/s,
      },
      {
        label: 'current pay is not mechanically decisive',
        pattern:
          /(?:目前|現有|現時)?(?:薪資|收入|所得).{0,24}(?:不會|不能|不應|並非).{0,12}(?:機械|直接|單獨).{0,12}(?:決定|計算|認定)/s,
      },
      {
        label: 'medical appraisal is useful when genuinely disputed but not mandatory',
        pattern:
          /(?:持續|永久|長期).{0,12}(?:障礙|減損|受限).{0,18}(?:確有|實際|真正|具體).{0,8}爭議.{0,30}(?:醫療|醫學|專業).{0,8}鑑定.{0,24}(?:有助|有用|可協助).{0,30}(?:不是|並非|不必|無須).{0,16}(?:每案|所有案件|一律|必須)/s,
      },
      {
        label: 'Article 217 comparative fault and adjustments',
        pattern:
          /民法第\s*217\s*條.{0,24}(?:與有過失|過失相抵).{0,24}(?:其他|其餘).{0,12}(?:調整|扣減|因素)/s,
      },
      {
        label: 'lump-sum intermediate-interest discount',
        pattern:
          /(?:一次|一次性).{0,8}(?:給付|支付|賠償).{0,24}(?:中間利息|利息).{0,12}(?:扣除|折現|折算)/s,
      },
      {
        label: 'Hoffman calculator is only an aid',
        pattern:
          /(?:司法院)?.{0,8}霍夫曼.{0,12}(?:計算機|計算工具).{0,24}(?:僅|只是).{0,8}(?:輔助|工具|參考).{0,30}(?:不是|並非|不代表).{0,18}(?:強制|必須|保證|結果)/s,
      },
      {
        label: 'Article 193 secured periodic payments on application',
        pattern:
          /民法第\s*193\s*條.{0,40}(?:當事人|一方).{0,8}(?:聲請|申請).{0,40}法院.{0,12}(?:命|得命).{0,36}(?:(?:定期金|定期給付).{0,24}(?:擔保|提供擔保)|(?:擔保|提供擔保).{0,24}(?:定期金|定期給付))/s,
      },
    ]);
  });

  it('locks Q13 Article 195 and individualized non-pecuniary-damage factors', () => {
    expectConcepts(q11ToQ15SectionForQuestion(13), [
      { label: 'Civil Code Article 195', pattern: /民法第\s*195\s*條/ },
      {
        label: 'unlawful infringement of body or health',
        pattern: /不法侵害.{0,12}(?:身體|健康).{0,8}(?:或|、).{0,8}(?:健康|身體)/s,
      },
      {
        label: 'appropriate non-pecuniary amount',
        pattern:
          /(?:非財產上損害|慰撫金).{0,24}(?:相當|適當|合理).{0,8}(?:金額|數額|賠償)/s,
      },
      {
        label: 'injury and treatment',
        pattern: /傷勢.{0,12}(?:治療|療程)|(?:治療|療程).{0,12}傷勢/s,
      },
      {
        label: 'lasting effects',
        pattern: /後遺症|持續影響|長期影響/,
      },
      {
        label: 'pain and life impact',
        pattern:
          /(?:疼痛|痛苦).{0,16}(?:生活|日常生活).{0,8}(?:影響|不便)|(?:生活|日常生活).{0,8}(?:影響|不便).{0,16}(?:疼痛|痛苦)/s,
      },
      {
        label: 'age and status',
        pattern: /年齡.{0,12}(?:身分|地位)|(?:身分|地位).{0,12}年齡/s,
      },
      {
        label: 'social and economic circumstances',
        pattern: /社會.{0,8}(?:及|與|、).{0,8}經濟.{0,8}(?:情況|狀況|條件)/s,
      },
      {
        label: 'parties evidence',
        pattern: /雙方.{0,8}(?:提出|提供).{0,8}證據|當事人.{0,12}證據/s,
      },
      {
        label: 'individualized assessment',
        pattern: /個案.{0,8}(?:判斷|審酌|認定)|依個別.{0,8}(?:情形|因素)/,
      },
    ]);
  });

  it('locks Q14 possible employer civil liability and separate individual criminal responsibility', () => {
    expectConcepts(q11ToQ15SectionForQuestion(14), [
      { label: 'Civil Code Article 188', pattern: /民法第\s*188\s*條/ },
      {
        label: 'employee unlawfully injures while performing duties',
        pattern:
          /受僱人.{0,18}(?:執行職務|職務執行).{0,24}(?:不法|違法).{0,8}侵害.{0,12}(?:他人|第三人)/s,
      },
      {
        label: 'work hours alone do not establish duty connection',
        pattern:
          /(?:上班|工作).{0,8}時間.{0,24}(?:不當然|不會自動|不足以).{0,24}(?:職務關聯|執行職務|職務上關係)/s,
      },
      {
        label: 'possible joint civil liability',
        pattern:
          /(?:雇主|僱用人).{0,20}(?:可能|得).{0,8}(?:連帶|共同).{0,8}(?:負|承擔).{0,8}民事責任/s,
      },
      {
        label: 'selection and supervision defense',
        pattern:
          /(?:選任|選擇).{0,8}(?:及|與|、).{0,8}(?:監督|監管).{0,24}(?:相當注意|合理注意|已盡注意)/s,
      },
      {
        label: 'unavoidable-loss defense',
        pattern:
          /(?:即使|縱使|即便).{0,16}(?:相當注意|合理注意|已盡注意).{0,20}(?:仍|也).{0,8}(?:不能避免|無法避免)/s,
      },
      {
        label: 'paragraph 2 victim relief',
        pattern:
          /第\s*188\s*條第\s*2\s*項.{0,30}(?:未獲|不能獲得|無法獲得).{0,8}(?:賠償|補償).{0,24}(?:法院|損害).{0,18}(?:斟酌|命|適當)/s,
      },
      {
        label: 'employer recourse after payment',
        pattern:
          /(?:雇主|僱用人).{0,18}(?:賠償|給付|支付).{0,18}(?:後|之後).{0,18}(?:向受僱人|對受僱人).{0,12}(?:求償|追償)/s,
      },
      {
        label: 'civil and criminal distinction',
        pattern:
          /(?:民事|民事責任).{0,16}(?:刑事|刑事責任).{0,12}(?:不同|區分|分別)|(?:刑事|刑事責任).{0,16}(?:民事|民事責任).{0,12}(?:不同|區分|分別)/s,
      },
      { label: 'Criminal Code Article 284', pattern: /刑法第\s*284\s*條/ },
      {
        label: 'individual duty breach and causation',
        pattern:
          /(?:各|每一).{0,8}(?:自然人|行為人|個人).{0,18}(?:違反|違背).{0,8}(?:注意義務|義務).{0,18}因果關係/s,
      },
    ]);
  });

  it('locks Q15 compulsory-cover scope, current limits, and contract-specific voluntary cover', () => {
    const section = q11ToQ15SectionForQuestion(15);

    expectConcepts(section, [
      {
        label: 'Article 6 owner and specified user or manager duty',
        pattern:
          /強制汽車責任保險法第\s*6\s*條.{0,40}(?:所有人|車主).{0,30}(?:使用人|管理人)/s,
      },
      {
        label: 'no-fault benefit structure',
        pattern:
          /(?:無過失|不論過失|不以過失).{0,24}(?:給付|請求|補償)/s,
      },
      {
        label: 'passenger and outside third-person scope',
        pattern:
          /乘客.{0,24}(?:車外|車輛外).{0,12}(?:第三人|之人)|(?:車外|車輛外).{0,12}(?:第三人|之人).{0,24}乘客/s,
      },
      {
        label: 'single-vehicle driver generally outside own compulsory cover',
        pattern:
          /單一車輛.{0,16}(?:事故|車禍).{0,24}駕駛人.{0,24}(?:原則|通常).{0,16}(?:不在|不屬|不受).{0,12}(?:強制險|強制汽車責任保險).{0,12}(?:保障|給付|範圍)/s,
      },
      {
        label: 'multi-vehicle driver may claim against another vehicle insurer',
        pattern:
          /多車.{0,16}(?:事故|車禍).{0,24}駕駛人.{0,24}(?:得|可以|可能).{0,12}(?:向|對).{0,12}(?:其他|另一).{0,8}車輛.{0,16}(?:強制險|保險人|保險公司).{0,12}(?:請求|申請)/s,
      },
      {
        label: 'amendment and effective accident dates',
        pattern:
          /2026-05-29.{0,30}(?:修正|發布).{0,30}2026-07-01.{0,24}(?:事故|發生)/s,
      },
      {
        label: 'earlier accidents may use earlier standard',
        pattern:
          /2026-07-01.{0,24}(?:以前|前).{0,16}(?:事故|發生).{0,24}(?:先前|舊|原).{0,8}(?:標準|規定)/s,
      },
      {
        label: 'necessary and reasonable medical expense',
        pattern:
          /(?:必要|必需).{0,8}(?:且|並|、).{0,8}合理.{0,12}(?:傷害)?醫療費用/s,
      },
      {
        label: '15 statutory disability grades',
        pattern:
          /(?:失能|殘廢).{0,12}(?:15\s*(?:個|級|等級)|十五\s*(?:個|級|等級))|(?:15|十五)\s*(?:個|級|等級).{0,12}(?:失能|殘廢)/s,
      },
      {
        label: 'third-party liability voluntary product',
        pattern:
          /第三人責任險.{0,24}(?:任意|自願|契約).{0,8}(?:保險|商品)/s,
      },
      {
        label: 'driver injury voluntary product',
        pattern:
          /駕駛人傷害險.{0,24}(?:任意|自願|契約).{0,8}(?:保險|商品)/s,
      },
      {
        label: 'own-damage voluntary product',
        pattern:
          /車體損失險.{0,24}(?:任意|自願|契約).{0,8}(?:保險|商品)/s,
      },
      {
        label: 'policy-specific conditions',
        pattern:
          /被保險人.{0,12}(?:保額|限額).{0,12}自負額.{0,12}除外.{0,12}過失.{0,16}(?:條款|條件)/s,
      },
    ]);

    expect(section).toContain('新臺幣 TWD 200,000');
    expect(section).toContain('TWD 80,000–3,000,000');
    expect(section).toContain('TWD 3,000,000');
    expect(section).toContain('TWD 3,200,000');
  });

  it('uses all 13 Q11–Q15 official URLs exactly once and in order with Traditional Chinese labels', () => {
    const markdownLinks = Array.from(
      q11ToQ15SourceBlock.matchAll(
        /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      ),
      (match) => ({ label: match[1], url: match[2] }),
    );

    expect(markdownLinks.map(({ url }) => url)).toEqual(
      q11ToQ15SourceTargets,
    );
    for (const { label } of markdownLinks) {
      expect(label).toMatch(/\p{Script=Han}/u);
      expect(label).not.toMatch(/\p{Script=Hangul}/u);
      expect(label).not.toMatch(
        /[\p{Script=Hiragana}\p{Script=Katakana}]/u,
      );
    }
    for (const target of q11ToQ15SourceTargets) {
      expect(countOccurrences(q11ToQ15Section, target)).toBe(1);
    }
    expect(q11ToQ15SourceBlock).not.toMatch(/(?<!\]\()https?:\/\//);
  });

  it('rejects stale Q11–Q15 copy, foreign scripts, simplified variants, and invisible spacer-only lines', () => {
    for (const phrase of prohibitedQ11ToQ15Copy) {
      expect(q11ToQ15Section).not.toContain(phrase);
    }

    expect(q11ToQ15Section).not.toMatch(/\p{Script=Hangul}/u);
    expect(q11ToQ15Section).not.toMatch(
      /[\p{Script=Hiragana}\p{Script=Katakana}]/u,
    );
    expect(q11ToQ15Section).not.toMatch(
      /[这为个过发应实与后还会当从对请诉证赔伤条时场车报务处]/,
    );
    expect(q11ToQ15Section).not.toMatch(/^[\t ]*\u200b+[\t ]*$/m);
  });
});
