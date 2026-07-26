import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-en/003-taiwan-traffic-accident-procedure.md',
);
const rawBytes = fs.readFileSync(columnPath);
const raw = rawBytes.toString('utf8');
const parsed = matter(raw);

const title =
  'Taiwan Traffic Accident Q&A: Scene Safety, Fault, Settlement, and Compensation';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-traffic-accident-procedure';
const featuredImage =
  '../images/003-taiwan-traffic-accident-procedure/featured-01.jpg';
const incidentImage =
  '../images/003-taiwan-traffic-accident-procedure/img-01.jpg';
const immutablePrefixBytes = 1_075;
const immutablePrefixSha256 =
  '8d75e7d46d3e958d227128ddbdf4a3544a53488204ca7d0d06d73f49e8e0b955';
const immutableQ1ToQ5PrefixBytes = 8_316;
const immutableQ1ToQ5PrefixSha256 =
  '274271d5547c07a50e343368319568a6fe866b5b3d05954865d954ce8eaea481';
const q11Marker =
  'Q11. What should you watch for when claiming loss from inability to work?';
const immutableQ11TailBytes = 9_193;
const immutableQ11TailSha256 =
  'b38aac06db7e6a17dff81b705a4870d0eccaf4b84d828d28aa2ff644a801f370';

const q1Heading = '## Q1. Can I leave the scene after an accident?';
const q2Heading = '## Q2. What evidence should I preserve first?';
const q3Heading =
  '## Q3. If I was injured, what claims and deadlines should I check?';
const q4Heading =
  '## Q4. If both sides were at fault, how are criminal and civil liability assessed?';
const q5Heading = '## Q5. What should a settlement agreement include?';
const sourceHeading = '### Q1–Q5 Official Sources';
const contractedHeadings = [
  q1Heading,
  q2Heading,
  q3Heading,
  q4Heading,
  q5Heading,
] as const;

const q6Heading = '## Q6. How is responsibility for the accident determined?';
const q7Heading = '## Q7. What losses can I claim after an accident?';
const q8Heading =
  '## Q8. How should I submit medical-expense records while treatment continues?';
const q9Heading =
  '## Q9. How can I prove professional-care and family-care expenses?';
const q10Heading = '## Q10. How can I prove travel expenses for treatment?';
const q6ToQ10SourceHeading = '### Q6–Q10 Official Sources';
const q6ToQ10ContractedHeadings = [
  q6Heading,
  q7Heading,
  q8Heading,
  q9Heading,
  q10Heading,
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
  'the liability analysis process is as follows',
  'Academic appraisal result',
  'Feng Chia University',
  'fault ratios are calculated precisely',
  'almost no room to overturn',
  'judges generally respect',
  'you will need to pay additional court costs',
  'the judge will recognize nursing care expenses',
  'judges still recognize claims',
  'taxi receipts are even better',
] as const;

const legacyNineLineNumberedLabels = [
  '1. Medical expenses',
  '2. Nursing care expenses',
  '3. Additional living expenses necessitated by the injury',
  '4. Loss of working capacity (temporary inability to work)',
  '5. Loss of labor capacity',
  '6. Funeral expenses',
  '7. Support expenses',
  '8. Solatium (mental consolation money)',
  '9. Property loss',
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
  'you may leave the scene only if the other party agrees',
  'remain at the scene until',
  'responsibility becomes clear',
  'the complaint period is 6 months',
  'the period is 2 years',
  'so that court costs need not be paid',
  'if either party has negligence, the offense',
  'the other party only needs to compensate',
  'both parties promise not to pursue further civil or criminal liability',
  'the complaint must be withdrawn',
  'you can no longer make any claim',
  'sequelae develop',
] as const;

const prohibitedStaleCopy = [
  'Hello',
  'I am Wei Tseng',
  'I have handled many',
  'share my views',
  'Today I would like',
  'Q&A format',
  'efficiently',
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

function containsOrderedLinePrefixes(
  value: string,
  prefixes: readonly string[],
) {
  let offset = 0;
  for (const prefix of prefixes) {
    const match = new RegExp(
      `^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*$`,
      'm',
    ).exec(value.slice(offset));
    if (!match || match.index === undefined) {
      return false;
    }
    offset += match.index + match[0].length;
  }
  return true;
}

const rawPrefixBytes = rawBytes.subarray(0, immutablePrefixBytes);
const rawPrefix = rawPrefixBytes.toString('utf8');
const bodyPrefix = matter(rawPrefix).content;
const q6ByteIndex = immutableQ1ToQ5PrefixBytes;
const q1ToQ5 =
  q6ByteIndex <= immutablePrefixBytes
    ? ''
    : rawBytes.subarray(immutablePrefixBytes, q6ByteIndex).toString('utf8');
const q1 = sectionBetween(q1Heading, q2Heading);
const q2 = sectionBetween(q2Heading, q3Heading);
const q3 = sectionBetween(q3Heading, q4Heading);
const q4 = sectionBetween(q4Heading, q5Heading);
const q5 = sectionBetween(q5Heading, sourceHeading);
const sources =
  q1ToQ5.indexOf(sourceHeading) === -1
    ? ''
    : q1ToQ5.slice(q1ToQ5.indexOf(sourceHeading));
const q11ByteIndex = rawBytes.indexOf(Buffer.from(q11Marker, 'utf8'));
const q6ToQ10 =
  q11ByteIndex <= q6ByteIndex
    ? ''
    : rawBytes.subarray(q6ByteIndex, q11ByteIndex).toString('utf8');
const q6 = q6ToQ10SectionBetween(q6Heading, q7Heading);
const q7 = q6ToQ10SectionBetween(q7Heading, q8Heading);
const q8 = q6ToQ10SectionBetween(q8Heading, q9Heading);
const q9 = q6ToQ10SectionBetween(q9Heading, q10Heading);
const q10 = q6ToQ10SectionBetween(q10Heading, q6ToQ10SourceHeading);
const q6ToQ10Sources =
  q6ToQ10.indexOf(q6ToQ10SourceHeading) === -1
    ? ''
    : q6ToQ10.slice(q6ToQ10.indexOf(q6ToQ10SourceHeading));
const imageNodes = Array.from(
  bodyPrefix.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g),
  (match) => ({ alt: match[1], src: match[2] }),
);
const visiblePrefixProse = bodyPrefix
  .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
  .replace(/^#{1,6}\s+.*$/gm, '');
const secondImageEnd = bodyPrefix.indexOf(
  imageNodes[1] ? `![${imageNodes[1].alt}](${imageNodes[1].src})` : '',
);
const introduction =
  imageNodes.length !== 2 || secondImageEnd === -1
    ? ''
    : bodyPrefix.slice(
        secondImageEnd +
          `![${imageNodes[1].alt}](${imageNodes[1].src})`.length,
      );

describe('English traffic column 003 — metadata and introduction localization boundary', () => {
  it('preserves the immutable introduction and completed Q1–Q5 prefixes byte-for-byte', () => {
    expect(rawPrefixBytes.byteLength).toBe(immutablePrefixBytes);
    expect(
      crypto.createHash('sha256').update(rawPrefixBytes).digest('hex'),
    ).toBe(immutablePrefixSha256);

    const immutableQ1ToQ5Prefix = rawBytes.subarray(
      0,
      immutableQ1ToQ5PrefixBytes,
    );
    expect(immutableQ1ToQ5Prefix.byteLength).toBe(immutableQ1ToQ5PrefixBytes);
    expect(
      crypto.createHash('sha256').update(immutableQ1ToQ5Prefix).digest('hex'),
    ).toBe(immutableQ1ToQ5PrefixSha256);
    expect(q6ByteIndex).toBeGreaterThan(immutablePrefixBytes);
  });

  it('preserves the immutable Q11 tail byte-for-byte', () => {
    expect(q11ByteIndex).toBeGreaterThan(q6ByteIndex);

    const immutableQ11Tail = rawBytes.subarray(q11ByteIndex);
    expect(immutableQ11Tail.toString('utf8').startsWith(q11Marker)).toBe(true);
    expect(immutableQ11Tail.byteLength).toBe(immutableQ11TailBytes);
    expect(
      crypto.createHash('sha256').update(immutableQ11Tail).digest('hex'),
    ).toBe(immutableQ11TailSha256);
  });

  it('ends the localized prefix with exactly the required blank-line boundary', () => {
    expect(rawBytes.subarray(immutablePrefixBytes).byteLength).toBeGreaterThan(
      0,
    );
    expect(rawPrefix.endsWith('\n\n')).toBe(true);
    expect(bodyPrefix.endsWith('\n\n')).toBe(true);
  });

  it('uses the exact contracted frontmatter and sole matching H1', () => {
    expect(parsed.data).toEqual({
      title,
      url: sourceUrl,
      lastmod: '2026-07-26',
      date_display: 'September 13, 2025',
      read_time: '8 min read',
      categories: ['Taiwan Legal Information'],
      featured_image: featuredImage,
    });
    expect(
      Array.from(bodyPrefix.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
  });

  it('uses exactly two descriptive prefix images with the contracted paths', () => {
    expect(imageNodes.map(({ src }) => src)).toEqual([
      featuredImage,
      incidentImage,
    ]);
    expect(imageNodes[0]?.alt).toMatch(
      /(?:scene|site).{0,30}safety.{0,50}(?:evidence|proof).{0,20}(?:preservation|preserving)/i,
    );
    expect(imageNodes[0]?.alt).toMatch(/Taiwan.{0,20}traffic accident/i);
    expect(imageNodes[1]?.alt).toMatch(
      /(?:recording|documenting).{0,30}(?:vehicle|car).{0,20}positions?/i,
    );
    expect(imageNodes[1]?.alt).toMatch(
      /(?:road|scene).{0,20}(?:evidence|marks?|traces?)/i,
    );
    expect(countOccurrences(raw, featuredImage)).toBe(2);
    expect(countOccurrences(raw, incidentImage)).toBe(1);
  });

  it('introduces the contracted response sequence and fact-dependent caveat', () => {
    expect(introduction).toMatch(
      /(?:first|initially).{0,60}(?:secure|ensure|protect).{0,20}safety/is,
    );
    expect(introduction).toMatch(
      /(?:report|notification|notify).{0,80}(?:preserve|document|record).{0,25}evidence/is,
    );

    const sequence = [
      /(?:claim|filing).{0,20}(?:deadline|time limit|limitation)/i,
      /fault/i,
      /(?:scope|terms|extent).{0,20}(?:settlement|settling)|settlement.{0,20}(?:scope|terms|extent)/i,
    ];
    const positions = sequence.map((pattern) => introduction.search(pattern));
    for (const position of positions) {
      expect(position).toBeGreaterThanOrEqual(0);
    }
    expect(positions).toEqual([...positions].sort((a, b) => a - b));

    expect(introduction).toMatch(
      /(?:general|overall).{0,30}(?:sequence|order|steps|process).{0,50}Taiwan(?:ese)?.{0,10}law.{0,50}(?:official|government|public).{0,20}(?:guidance|information)/is,
    );
    expect(introduction).toMatch(
      /(?:responsibility|liability).{0,30}(?:procedure|process).{0,60}(?:depend|vary).{0,30}(?:facts|circumstances)/is,
    );
  });

  it('removes stale personal copy, foreign scripts, first-person prose, and invisible spacer lines', () => {
    for (const phrase of prohibitedStaleCopy) {
      expect(bodyPrefix).not.toContain(phrase);
    }
    expect(bodyPrefix).not.toMatch(/\p{Script=Hangul}/u);
    expect(bodyPrefix).not.toMatch(/\p{Script=Han}/u);
    expect(bodyPrefix).not.toMatch(
      /[\p{Script=Hiragana}\p{Script=Katakana}]/u,
    );
    expect(bodyPrefix).not.toMatch(/^[\t ]*\u200b+[\t ]*$/m);
    expect(visiblePrefixProse).not.toMatch(
      /\b(?:I|me|my|mine|myself)\b/i,
    );
  });
});

describe('English traffic column 003 — Q1–Q5 translation contract', () => {
  it('starts the exact five H2s at the locked byte boundary and places the source H3 after Q5', () => {
    expect(rawBytes.subarray(immutablePrefixBytes).toString('utf8')).toMatch(
      /^## Q1\. Can I leave the scene after an accident\?\n/,
    );
    expect(
      Array.from(q1ToQ5.matchAll(/^## Q[1-5]\. .+$/gm), (match) => match[0]),
    ).toEqual(contractedHeadings);
    expect(q1ToQ5.indexOf(sourceHeading)).toBeGreaterThan(
      q1ToQ5.indexOf(q5Heading),
    );
    expect(countOccurrences(q1ToQ5, sourceHeading)).toBe(1);
  });

  it('states the injury/death duties, limited vehicle-movement exception, property-only rule, and Article 185-4 caveat in Q1', () => {
    expect(q1).toMatch(
      /(?:injury|death).{0,100}(?:provide|render).{0,20}(?:aid|assistance).{0,80}(?:notify|report).{0,30}police.{0,80}preserv.{0,30}(?:vehicles?|scene evidence)/is,
    );
    expect(q1).toMatch(
      /(?:informal consent|agreement).{0,40}(?:recording|recorded).{0,80}(?:does not|cannot).{0,40}(?:replace|substitute).{0,30}(?:required|statutory).{0,20}(?:measures|duties)/is,
    );
    expect(q1).toMatch(
      /injury accident.{0,120}all parties agree.{0,120}(?:record|document).{0,40}(?:positions?|scene marks?).{0,100}(?:move|moved).{0,80}(?:obstructing|obstruction).{0,20}traffic/is,
    );
    expect(q1).toMatch(
      /(?:aid|assistance).{0,30}(?:and|\/).{0,20}(?:reporting|notification).{0,30}(?:remain|continue|still appl)/is,
    );
    expect(q1).toMatch(
      /property damage only.{0,120}(?:record|document).{0,50}(?:positions?|marks?).{0,60}(?:photographs?|photos?|video).{0,100}move.{0,30}(?:safety|safe)/is,
    );
    expect(q1).toMatch(
      /(?:leav|depart).{0,50}(?:without|required measures).{0,70}administrative sanction/is,
    );
    expect(q1).toMatch(
      /Article 185-4.{0,120}(?:injury|death).{0,120}(?:depend|fact).{0,60}(?:measures|steps|actions) taken/is,
    );
  });

  it('puts safety first and preserves the complete evidence and police-document sequence in Q2', () => {
    expect(q2).toMatch(
      /(?:safety|secure the scene).{0,50}(?:warning|warn).{0,50}(?:first|before)/is,
    );
    expect(q2).toMatch(/(?:injury|rescue).{0,30}119/is);
    expect(q2).toMatch(
      /(?:crime|urgent public safety).{0,50}(?:110.{0,10}112|112.{0,10}110)/is,
    );
    expect(q2).toMatch(
      /(?:appropriate|proper).{0,20}(?:police report|report.{0,20}police).{0,30}traffic accident/is,
    );
    expect(q2).toMatch(
      /(?:wide|overview).{0,20}(?:and|\/).{0,20}(?:close|detail).{0,30}(?:photographs?|photos?).{0,100}(?:vehicle positions?|damage).{0,100}(?:road markings?|signals?).{0,80}weather/is,
    );
    expect(q2).toMatch(
      /witness.{0,30}(?:contacts?|details?).{0,80}(?:CCTV|dashcam).{0,60}(?:party|driver|parties[’'] identifying details).{0,30}(?:vehicle|insurance).{0,80}medical records/is,
    );
    expect(q2).toMatch(
      /personal recording.{0,80}(?:does not|cannot).{0,30}(?:replace|substitute).{0,40}police.{0,50}(?:injury|death)/is,
    );
    expect(q2).toMatch(
      /(?:registration|contact) form.{0,40}(?:at the scene|on-site).{0,80}(?:scene diagram|diagram).{0,30}(?:photos?|photographs?).{0,40}(?:day 7|seven days).{0,80}preliminary analysis.{0,40}(?:day 30|thirty days)/is,
    );
    expect(q2).toMatch(
      /(?:confirm|check).{0,40}(?:availability|available).{0,30}(?:requirements?|conditions?).{0,50}(?:competent|responsible|relevant).{0,20}police/is,
    );
  });

  it('distinguishes the criminal complaint, civil limitation, attached-action timing, and cost caveats in Q3', () => {
    expect(q3).toMatch(
      /(?:(?:Articles? 284.{0,20}(?:and|,).{0,20}287.{0,100}(?:negligent injury|serious injury))|(?:Article 284.{0,30}defines.{0,80}(?:negligent injury|serious injury).{0,50}Article 287.{0,30}makes.{0,30}(?:those )?offenses?)).{0,100}complaint-based/is,
    );
    expect(q3).toMatch(
      /Article 237.{0,100}(?:ordinary|general).{0,30}(?:complaint period|period.{0,20}complaint).{0,30}six months.{0,80}(?:learn|know).{0,30}(?:offender.{0,20}identity|identity.{0,20}offender)/is,
    );
    expect(q3).toMatch(
      /Article 197.{0,100}two years.{0,80}(?:knowledge|learn).{0,30}damage.{0,40}(?:person|party).{0,20}liable.{0,100}ten years.{0,60}tort/is,
    );
    expect(q3).toMatch(
      /Articles? 487.{0,20}(?:and|,).{0,20}488.{0,100}(?:crime victim|victim).{0,80}attached civil action.{0,80}(?:criminal case|proceedings).{0,30}pending.{0,100}(?:close|conclusion).{0,30}second-instance oral argument/is,
    );
    expect(q3).toMatch(
      /(?:ordinary|usual|generally).{0,30}(?:filing-fee|court-fee|filing fee|court fee).{0,30}(?:advantage|benefit)/is,
    );
    expect(q3).toMatch(
      /Article 503.{0,100}(?:dismiss).{0,60}(?:transfer|transferred).{0,50}(?:plaintiff.{0,20}request|request.{0,20}plaintiff).{0,100}(?:cost|fee)/is,
    );
    expect(q3).toMatch(/Article 504.{0,100}(?:transfer|procedure)/is);
    expect(q3).toMatch(
      /(?:interruption|interrupt).{0,30}(?:limitation|period).{0,80}defendants?.{0,50}evidence.{0,50}insurance.{0,50}venue/is,
    );
    expect(q3).toMatch(
      /(?:no|not).{0,30}(?:universally|always).{0,30}best (?:route|procedure|option)/is,
    );
  });

  it('keeps criminal negligence individual and the civil comparative-fault example conditional in Q4', () => {
    expect(q4).toMatch(
      /criminal liability.{0,100}(?:each|individual).{0,20}(?:person|party).{0,60}(?:breach|violation).{0,30}duty of care.{0,80}caus.{0,40}(?:other person|other party).{0,30}injury/is,
    );
    expect(q4).toMatch(
      /fault on both sides.{0,80}(?:does not|doesn't).{0,40}automatically.{0,40}(?:establish|constitute).{0,30}negligent injury/is,
    );
    expect(q4).toMatch(
      /Article 217.{0,100}(?:(?:reduce|reduction).{0,30}(?:or|and).{0,20}(?:exempt|exemption)|reduce.{0,50}or relieve the liable party of liability).{0,80}injured (?:person|party).{0,30}fault.{0,70}(?:caus|increas).{0,30}damage/is,
    );
    expect(q4).toMatch(
      /TWD 1,000,000.{0,30}one million New Taiwan dollars.{0,80}50%.{0,50}injured-party fault.{0,100}(?:may|could).{0,30}reduc.{0,30}TWD 500,000.{0,60}before other adjustments/is,
    );
    expect(q4).toMatch(
      /(?:appraisal|preliminary analysis).{0,100}(?:important|relevant).{0,100}(?:does not|cannot).{0,40}(?:mechanically|automatically).{0,30}bind.{0,30}court.{0,80}(?:whole|entire).{0,20}record/is,
    );
  });

  it('preserves the settlement scope, limited waiver, and complaint-withdrawal distinctions in Q5', () => {
    expect(q5).toMatch(
      /accident date.{0,30}(?:and|\/).{0,20}place.{0,50}parties.{0,80}amount.{0,30}(?:timing|due date|payment date).{0,80}insurance/is,
    );
    expect(q5).toMatch(
      /(?:included|covered) claims.{0,50}(?:reserved|excluded) claims.{0,80}future treatment.{0,80}(?:later-discovered|later discovered).{0,30}injury.{0,80}document delivery/is,
    );
    expect(q5).toMatch(
      /(?:payment|paying).{0,80}complaint withdrawal|complaint withdrawal.{0,80}(?:payment|paying)/is,
    );
    expect(q5).toMatch(
      /Articles? 736.{0,20}(?:and|,).{0,20}737.{0,100}mutual concession.{0,100}(?:extinguish|waiv).{0,80}(?:limited|only).{0,50}(?:wording|terms)/is,
    );
    expect(q5).toMatch(
      /(?:does not|not).{0,50}(?:every|all).{0,30}future claims?.{0,30}(?:disappear|extinguish|waive)/is,
    );
    expect(q5).toMatch(
      /Article 238.{0,100}(?:withdraw|withdrawal).{0,80}(?:before|by).{0,40}(?:close|conclusion).{0,30}first-instance oral argument.{0,100}(?:cannot|may not).{0,30}(?:refile|filed again)/is,
    );
    expect(q5).toMatch(
      /private settlement.{0,100}(?:does not|cannot).{0,40}automatically.{0,40}(?:terminate|end).{0,30}prosecution.{0,60}non-complaint offense/is,
    );
    expect(q5).toMatch(
      /settlement.{0,80}(?:does not|need not|not invariably).{0,50}(?:require|mean).{0,30}(?:complaint )?withdrawal/is,
    );
  });

  it('uses all 17 official URLs exactly once, in order, only as descriptive Markdown-link destinations', () => {
    const markdownLinks = Array.from(
      sources.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g),
      (match) => ({ label: match[1], url: match[2], full: match[0] }),
    );
    expect(markdownLinks.map(({ url }) => url)).toEqual(officialSourceUrls);

    for (const { label, url } of markdownLinks) {
      expect(label).toMatch(/[A-Za-z]/);
      expect(label).not.toContain('http');
      expect(label).not.toMatch(
        /[\p{Script=Hangul}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u,
      );
      expect(countOccurrences(q1ToQ5, url)).toBe(1);
    }

    const withoutMarkdownLinks = markdownLinks.reduce(
      (value, { full }) => value.replace(full, ''),
      q1ToQ5,
    );
    for (const url of officialSourceUrls) {
      expect(withoutMarkdownLinks).not.toContain(url);
      expect(q1ToQ5).not.toContain(`<${url}>`);
    }
  });

  it('removes stale, foreign-script, and invisible-spacer copy only within Q1–Q5', () => {
    for (const phrase of prohibitedQ1ToQ5Copy) {
      expect(q1ToQ5.toLowerCase()).not.toContain(phrase.toLowerCase());
    }
    expect(q1ToQ5).not.toMatch(/\p{Script=Hangul}/u);
    expect(q1ToQ5).not.toMatch(/\p{Script=Han}/u);
    expect(q1ToQ5).not.toMatch(
      /[\p{Script=Hiragana}\p{Script=Katakana}]/u,
    );
    expect(q1ToQ5).not.toMatch(/^[\t ]*\u200b+[\t ]*$/m);
  });
});

describe('English traffic column 003 — Q6–Q10 translation contract', () => {
  it('starts the exact five H2s at byte 8316 and places the source H3 after Q10 before Q11', () => {
    expect(rawBytes.subarray(q6ByteIndex).toString('utf8')).toMatch(
      /^## Q6\. How is responsibility for the accident determined\?\n/,
    );
    expect(
      Array.from(
        q6ToQ10.matchAll(/^## Q(?:6|7|8|9|10)\. .+$/gm),
        (match) => match[0],
      ),
    ).toEqual(q6ToQ10ContractedHeadings);
    expect(q6ToQ10.indexOf(q6ToQ10SourceHeading)).toBeGreaterThan(
      q6ToQ10.indexOf(q10Heading),
    );
    expect(countOccurrences(q6ToQ10, q6ToQ10SourceHeading)).toBe(1);
    expect(q6ToQ10).not.toContain(q11Marker);
  });

  it('keeps the preliminary analysis non-binding and states the complete appraisal and review procedure in Q6', () => {
    expect(q6).toMatch(
      /Road Traffic Accident Preliminary Analysis Determination Form.{0,160}(?:preliminary police analysis|police.{0,30}preliminary analysis).{0,120}(?:not|neither).{0,30}(?:court judgment|judgment)/is,
    );
    expect(q6).toMatch(
      /(?:does not|neither|nor).{0,60}(?:bind|binding).{0,30}court.{0,100}(?:does not|neither|nor).{0,60}(?:fix|determine|set).{0,30}(?:fault )?(?:percentage|ratio)/is,
    );
    expect(q6).toMatch(
      /(?:not|never).{0,30}(?:automatic|mandatory).{0,30}(?:ladder|sequence|progression|series)/is,
    );
    expect(q6).toMatch(
      /eligible party.{0,80}(?:apply|application).{0,80}(?:handling|competent|responsible) authority.{0,80}refer.{0,100}judicial authority.{0,80}commission/is,
    );
    expect(q6).toMatch(
      /(?:party application|application by (?:a|the) party|party.{0,30}apply).{0,100}(?:within|no later than).{0,30}six months.{0,60}(?:after|from).{0,30}(?:accident|date of the accident)/is,
    );
    expect(q6).toMatch(
      /(?:investigation|trial).{0,80}(?:pending|underway).{0,120}(?:judicial|court|prosecutorial).{0,30}commission.{0,120}(?:rather than|instead of).{0,80}(?:new )?direct application/is,
    );
    expect(q6).toMatch(
      /(?:dissatisfied|disagree).{0,60}(?:seek|request|apply for).{0,30}review.{0,100}(?:only one|one review|limited to one|once only)/is,
    );
    expect(q6).toMatch(
      /(?:appraisal|review) opinions?.{0,80}(?:evidence|reference material).{0,120}court.{0,80}independent(?:ly)? evaluat/is,
    );
    expect(q6).toMatch(
      /statements?.{0,80}video.{0,80}scene (?:records?|materials?|evidence).{0,100}(?:record as a whole|whole record|entire record)/is,
    );
  });

  it('makes every Q7 damages category conditional under Articles 184 and 216', () => {
    expect(q7).toMatch(
      /Article 184.{0,160}unlawful infringement.{0,100}causation.{0,100}(?:proof|prove).{0,40}damage/is,
    );
    expect(q7).toMatch(
      /(?:accident|collision).{0,80}(?:alone|by itself).{0,80}(?:does not|cannot).{0,50}automatically.{0,80}(?:every|all).{0,30}(?:listed )?(?:loss|damage)/is,
    );
    expect(q7).toMatch(
      /Article 216.{0,120}actual loss.{0,80}(?:lost profit|profit that would ordinarily have been expected)/is,
    );
    expect(q7).toMatch(
      /(?:injury|personal injury).{0,120}Article 193.{0,120}(?:necessary )?medical.{0,70}care.{0,80}(?:treatment[- ]travel|travel.{0,30}treatment).{0,100}assistive device.{0,100}(?:increased need|increased-need)/is,
    );
    expect(q7).toMatch(
      /(?:temporary income loss|lost income).{0,100}loss of earning capacity.{0,100}Article 195.{0,80}non-pecuniary damage/is,
    );
    expect(q7).toMatch(
      /(?:death|fatal).{0,100}Article 192.{0,140}(?:pre-death|before death).{0,50}medical.{0,100}funeral expenses.{0,100}(?:loss of support|support).{0,100}(?:legally entitled|legal entitlement)/is,
    );
    expect(q7).toMatch(
      /Article 194.{0,100}non-pecuniary damage.{0,100}(?:qualifying|eligible|specified).{0,30}relatives/is,
    );
    expect(q7).toMatch(
      /(?:property|property damage).{0,100}Article 196.{0,100}(?:proven|proof of).{0,40}actual property damage.{0,120}repair.{0,100}diminution in value/is,
    );
  });

  it('distinguishes Q8 evidence supplementation from changing a claim and narrows the Article 504 fee caveat', () => {
    expect(q8).toMatch(
      /(?:preserve|keep).{0,80}receipts.{0,80}diagnosis certificates?.{0,80}medical records/is,
    );
    expect(q8).toMatch(
      /medical necessity.{0,80}causation.{0,50}(?:accident|collision)/is,
    );
    expect(q8).toMatch(
      /continuing treatment.{0,140}supplement.{0,50}evidence.{0,100}procedural schedule.{0,100}existing claim/is,
    );
    expect(q8).toMatch(
      /(?:late material|late evidence|submitted late|expanded claim).{0,120}(?:not guaranteed|no guarantee|may not be accepted)/is,
    );
    expect(q8).toMatch(
      /supplementing.{0,50}(?:medical )?evidence.{0,100}(?:distinguish|different|separate).{0,100}(?:changing|increasing|expanding).{0,80}(?:amount|scope).{0,30}(?:claim|claimed)/is,
    );
    expect(q8).toMatch(
      /(?:adding|submitting).{0,60}medical receipts?.{0,100}attached civil action.{0,120}(?:does not|will not).{0,40}(?:by itself|automatically).{0,80}(?:court fee|filing fee)/is,
    );
    expect(q8).toMatch(
      /Article 504.{0,140}transfer.{0,100}(?:change|addition|increase|expansion).{0,100}(?:beyond|exceed).{0,80}pre-transfer claim.{0,120}(?:court-fee|court fee|filing-fee|filing fee).{0,80}excess/is,
    );
    expect(q8).toMatch(
      /(?:confirm|check|consider).{0,80}transfer stage.{0,80}filing time.{0,80}claim scope.{0,80}(?:case by case|individual case)/is,
    );
  });

  it('requires complete Q9 care proof and treats unpaid family care as non-automatic', () => {
    expect(q9).toMatch(
      /(?:diagnosis certificate|medical opinion).{0,100}(?:useful|relevant).{0,40}evidence.{0,100}(?:not|neither).{0,50}(?:conclusive|decisive|sufficient).{0,30}(?:by itself|alone)/is,
    );
    expect(q9).toMatch(
      /(?:accident )?causation.{0,80}need for care.{0,80}actual(?:ly)? (?:provided|provision).{0,80}duration.{0,80}reasonable amount/is,
    );
    expect(q9).toMatch(
      /unpaid care.{0,100}(?:relative|family member).{0,100}(?:may|can).{0,60}(?:valued|recognized|assessed).{0,50}(?:damage|loss).{0,120}(?:not|does not).{0,50}automatically/is,
    );
    expect(q9).toMatch(
      /(?:nature|type).{0,40}(?:of (?:the )?care)?.{0,80}duration.{0,80}(?:customary|reasonable|market).{0,30}cost/is,
    );
  });

  it('connects Q10 travel proof to treatment and rejects automatic taxi-receipt sufficiency', () => {
    expect(q10).toMatch(
      /travel records?.{0,100}treatment.{0,100}accident-related injury/is,
    );
    expect(q10).toMatch(
      /route.{0,80}(?:visit dates?|dates? of visits?).{0,80}(?:number of visits|visit count).{0,80}(?:transport method|mode of transport).{0,80}fare.{0,80}necessity.{0,80}reasonableness/is,
    );
    expect(q10).toMatch(
      /receipts?.{0,80}fare records?.{0,80}route records?.{0,80}treatment records?.{0,80}(?:evidence|proof)/is,
    );
    expect(q10).toMatch(
      /taxi receipt.{0,80}(?:neither|not).{0,50}(?:only|sole).{0,30}(?:proof|evidence).{0,100}(?:nor|not).{0,50}automatically sufficient/is,
    );
  });

  it('uses all 14 Q6–Q10 official URLs exactly once and in order only as descriptive Markdown-link destinations', () => {
    const markdownLinks = Array.from(
      q6ToQ10Sources.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g),
      (match) => ({ label: match[1], url: match[2], full: match[0] }),
    );
    expect(markdownLinks.map(({ url }) => url)).toEqual(
      q6ToQ10OfficialSourceUrls,
    );

    for (const { label, url } of markdownLinks) {
      expect(label).toMatch(/[A-Za-z]/);
      expect(label.trim()).not.toBe('');
      expect(label).not.toContain('http');
      expect(label).not.toMatch(
        /[\p{Script=Hangul}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u,
      );
      expect(countOccurrences(q6ToQ10, url)).toBe(1);
    }

    const withoutMarkdownLinks = markdownLinks.reduce(
      (value, { full }) => value.replace(full, ''),
      q6ToQ10,
    );
    for (const url of q6ToQ10OfficialSourceUrls) {
      expect(withoutMarkdownLinks).not.toContain(url);
      expect(q6ToQ10).not.toContain(`<${url}>`);
    }
  });

  it('removes only the contracted stale sequence, foreign scripts, and spacer lines within Q6–Q10', () => {
    for (const phrase of prohibitedQ6ToQ10Copy) {
      expect(q6ToQ10.toLowerCase()).not.toContain(phrase.toLowerCase());
    }
    expect(
      containsOrderedLinePrefixes(q6ToQ10, legacyNineLineNumberedLabels),
    ).toBe(false);
    expect(q6ToQ10).not.toMatch(/\p{Script=Hangul}/u);
    expect(q6ToQ10).not.toMatch(/\p{Script=Han}/u);
    expect(q6ToQ10).not.toMatch(/[\p{Script=Hiragana}\p{Script=Katakana}]/u);
    expect(q6ToQ10).not.toMatch(/^[\t ]*\u200b+[\t ]*$/m);
  });
});
