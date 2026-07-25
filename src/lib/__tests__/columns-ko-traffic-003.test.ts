import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns/003-taiwan-traffic-accident-procedure.md',
);
const rawBytes = fs.readFileSync(columnPath);
const raw = rawBytes.toString('utf8');
const parsed = matter(raw);

const title = '대만 교통사고 대응 Q&A: 현장조치·과실·합의·손해배상';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-traffic-accident-procedure';
const featuredImage =
  '../images/003-taiwan-traffic-accident-procedure/featured-01.jpg';
const incidentImage =
  '../images/003-taiwan-traffic-accident-procedure/img-01.jpg';
const featuredAlt =
  '대만 교통사고 직후 현장 안전조치와 증거 보존을 설명하는 이미지';
const incidentAlt =
  '교통사고 현장의 차량 위치와 도로 흔적을 기록하는 예시 이미지';

const q6Marker = 'Q6. 사고 책임은 어떻게 인정되나요?';
const q11Marker = 'Q11. 근로 불능 손실 청구 시 주의사항은 무엇인가요?';
const immutablePrefixBytes = 8_652;
const immutablePrefixSha256 =
  '07c63338af189be3c0e2025c84066d4b8f9f06e10affbe7e7be506ef6f56b4f2';
const immutableTailBytes = 9_593;
const immutableTailSha256 =
  '7b41d4ba3199e2044971fdfdfd3b70839f8b9d98ebea940e1ceefb190cbd97ba';

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

const q6ToQ10StaleCopy = [
  '도로교통사고 초기 분석 판단표',
  '"초판표"',
  '과실 비율이 정확히 산출됩니다',
  '거의 뒤집을 여지가 없으며',
  '최종 감정 기관',
  '逢甲',
  '학술 감정',
  '판사는 감정 의견서를 참고해',
  '판사는 간병비를 인정합니다',
  '심지어 친족이 간병하더라도',
  '의료 영수증을 추가로 제출하면 재판 비용을 추가로 지불해야 합니다',
] as const;

const staleCopy = [
  '대만에서 교통사고 발생시',
  '증준외 대만변호사입니다',
  '교통사고 났을경우에',
  '책임 소재가 명확해질 때까지',
  '경찰에 신고하지 않기로 했다면',
  '상대방이 동의한 경우에만 현장을 떠날 수 있습니다',
  '각종 자국',
  '고소 기한은 6개월입니다',
  '기한은 2년입니다',
  '재판 비용을 지불하지 않는 방법',
  '어느 한 쪽이라도 과실이 있으면 과실치상죄가 성립됩니다',
  '100만 원',
  '50만 원',
  '민형사상 책임을 추구하지 않기로',
  '무조건 고소를 철회',
  '더 이상 어떤 청구도 할 수 없습니다',
];

function countOccurrences(value: string, needle: string) {
  return value.split(needle).length - 1;
}

const q6MarkerBytes = Buffer.from(q6Marker, 'utf8');
const q6ByteIndex = rawBytes.indexOf(q6MarkerBytes);
const q6HeadingMarkerBytes = Buffer.from(`## ${q6Marker}`, 'utf8');
const q6HeadingByteIndex = rawBytes.indexOf(q6HeadingMarkerBytes);
const q6CharacterIndex = parsed.content.indexOf(q6Marker);
const q6HeadingCharacterIndex = parsed.content.indexOf(`## ${q6Marker}`);
const q11MarkerBytes = Buffer.from(q11Marker, 'utf8');
const q11ByteIndex = rawBytes.indexOf(q11MarkerBytes);
const q11CharacterIndex = parsed.content.indexOf(q11Marker);
const microSection = parsed.content.slice(0, q6CharacterIndex);
const q6ToQ10Section = parsed.content.slice(q6CharacterIndex, q11CharacterIndex);
const q6ToQ10WithHeadings = parsed.content.slice(
  q6HeadingCharacterIndex,
  q11CharacterIndex,
);

function questionSection(questionNumber: number) {
  const heading = `## Q${questionNumber}.`;
  const sectionSource =
    questionNumber <= 5 ? microSection : q6ToQ10WithHeadings;
  const start = sectionSource.indexOf(heading);
  if (start === -1) return '';

  const next = sectionSource.indexOf('\n## ', start + heading.length);
  return sectionSource.slice(
    start,
    next === -1 ? sectionSource.length : next,
  );
}

describe('Korean traffic column 003 — Q1–Q5 rewrite boundary', () => {
  it('uses the contracted frontmatter, sole H1, and two descriptive images', () => {
    expect(parsed.data).toEqual({
      title,
      url: sourceUrl,
      lastmod: '2026-07-26',
      date_display: '2025년 9월 13일',
      read_time: '8분 분량',
      categories: ['대만 법률정보'],
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

  it('isolates the rewritten introduction through Q5 and creates no Q6 content', () => {
    expect(q6CharacterIndex).toBeGreaterThan(0);
    expect(q6ByteIndex).toBeGreaterThan(0);
    expect(microSection).toContain('즉시 안전');
    expect(microSection).toContain('신고');
    expect(microSection).toContain('증거');
    expect(microSection).toContain('기한');
    expect(microSection).toContain('과실');
    expect(microSection).toContain('합의');

    expect(
      Array.from(microSection.matchAll(/^## (Q\d+)\./gm), (match) => match[1]),
    ).toEqual(['Q1', 'Q2', 'Q3', 'Q4', 'Q5']);
    expect(microSection).not.toMatch(/^## Q6\./m);
    expect(microSection).toContain('### Q1–Q5 공식 근거');
    expect(microSection.indexOf('### Q1–Q5 공식 근거')).toBeGreaterThan(
      microSection.indexOf('## Q5.'),
    );
  });

  it('locks Q1 injury-or-death duties, property-only handling, and Article 185-4', () => {
    const section = questionSection(1);
    const requiredPhrases = [
      '부상 또는 사망',
      '부상 사고에서 당사자 모두가 동의하면',
      '구호',
      '경찰',
      '차량과 현장 증거',
      '현장을 떠나',
      '상대방의 비공식적인 동의',
      '차량 위치와 현장 흔적',
      '표시한 뒤',
      '교통을 방해하지 않는 곳',
      '재산상 손해만',
      '차량을 움직일 수 있는 경우',
      '사진 또는 영상',
      '안전한 곳으로',
      '행정상 제재',
      '형법 제185조의4',
      '부상이나 사망을 초래한 교통사고',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Q2 safety-first evidence preservation and the 0/7/30-day police timetable', () => {
    const section = questionSection(2);
    const requiredPhrases = [
      '개인 안전과 경고표지',
      '110',
      '119',
      '112',
      '넓은 범위와 근접 사진',
      '차량 위치와 파손',
      '도로 표시, 신호, 날씨',
      '목격자 연락처',
      'CCTV와 블랙박스',
      '보험 정보',
      '진료기록',
      '교통사고 당사자 등록연락서',
      '사고 현장에서',
      '사고 발생일부터 7일',
      '현장도',
      '현장사진',
      '사고 발생일부터 30일',
      '도로교통사고 초보분석판정표',
      '개인 촬영은',
      '경찰 처리를 대체하지',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Q3 criminal and civil limitation rules and the incidental-action cost caveat', () => {
    const section = questionSection(3);
    const requiredPhrases = [
      '형법 제284조',
      '과실치상',
      '과실중상',
      '형법 제287조',
      '고소할 수 있는 범죄',
      '형사소송법 제237조',
      '가해자를 안 날부터 6개월',
      '민법 제197조',
      '손해와 배상의무자를 안 날부터 2년',
      '불법행위가 있은 날부터 10년',
      '형사소송법 제488조',
      '형사소송법 제503조',
      '소송비용을 부담',
      '시효 중단',
      '피고',
      '보험',
      '관할',
      '일률적으로 가장 좋은 절차',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Q4 individual criminal negligence, civil comparative negligence, and the TWD illustration', () => {
    const section = questionSection(4);
    const requiredPhrases = [
      '각자의 주의의무 위반',
      '인과관계',
      '민법 제217조',
      '손해배상액을 감경하거나 면제',
      '신대만달러',
      'TWD 1,000,000',
      'TWD 500,000',
      '감정 또는 초보분석판정표',
      '법원을 기계적으로 구속하지',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Q5 settlement scope, Civil Code Articles 736–737, and complaint-withdrawal limits', () => {
    const section = questionSection(5);
    const requiredPhrases = [
      '사고',
      '당사자',
      '지급 금액과 시기',
      '보험금',
      '포함되는 청구',
      '유보하는 청구',
      '향후 치료',
      '나중에 발견된 부상',
      '서류 교부',
      '고소 취하',
      '민법 제736조',
      '민법 제737조',
      '상호 양보',
      '포기한 범위에서만',
      '형사소송법 제238조',
      '제1심 변론 종결 전',
      '다시 고소할 수 없',
      '비친고죄',
      '자동으로 공소가 종료',
      '무조건 고소를 취하해야 하는 것은 아닙니다',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('uses every authoritative Q1–Q5 source target once, in order, with Korean labels', () => {
    const sourceHeading = '### Q1–Q5 공식 근거';
    const sourceBlock = microSection.slice(microSection.indexOf(sourceHeading));
    const markdownLinks = Array.from(
      sourceBlock.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g),
      (match) => ({ label: match[1], url: match[2] }),
    );

    expect(markdownLinks.map(({ url }) => url)).toEqual(sourceTargets);
    for (const { label } of markdownLinks) {
      expect(label).toMatch(/[\uac00-\ud7af]/);
    }
    for (const target of sourceTargets) {
      expect(countOccurrences(microSection, target)).toBe(1);
    }
    expect(sourceBlock).not.toMatch(/(?<!\]\()https?:\/\//);
  });

  it('rejects stale claims, greeting copy, invisible spacer-only paragraphs, and comment invitations from Q1–Q5', () => {
    for (const phrase of staleCopy) {
      expect(microSection).not.toContain(phrase);
    }
    expect(microSection).not.toMatch(/^\s*\u200b\s*$/m);
    expect(microSection).not.toMatch(/댓글로\s*남겨/);
    expect(microSection).not.toMatch(/안녕하세요|변호사입니다/);
  });

  it('preserves the immutable Q1–Q5 prefix and Q11–Q20 tail byte-for-byte', () => {
    const immutablePrefix = rawBytes.subarray(0, immutablePrefixBytes);
    const immutableTail = rawBytes.subarray(q11ByteIndex);

    expect(q6HeadingByteIndex).toBe(immutablePrefixBytes);
    expect(immutablePrefix.byteLength).toBe(immutablePrefixBytes);
    expect(crypto.createHash('sha256').update(immutablePrefix).digest('hex')).toBe(
      immutablePrefixSha256,
    );
    expect(q11ByteIndex).toBeGreaterThan(immutablePrefixBytes);
    expect(immutableTail.byteLength).toBe(immutableTailBytes);
    expect(crypto.createHash('sha256').update(immutableTail).digest('hex')).toBe(
      immutableTailSha256,
    );
    expect(immutableTail.toString('utf8').startsWith(q11Marker)).toBe(true);
  });

  it('isolates Q6–Q10 with one H2 for each question before the immutable Q11 boundary', () => {
    expect(q6CharacterIndex).toBeGreaterThan(0);
    expect(q11CharacterIndex).toBeGreaterThan(q6CharacterIndex);
    expect(q6ToQ10Section.startsWith(q6Marker)).toBe(true);
    expect(q6HeadingCharacterIndex).toBe(q6CharacterIndex - 3);
    expect(
      Array.from(
        q6ToQ10WithHeadings.matchAll(/^## (Q\d+)\./gm),
        (match) => match[1],
      ),
    ).toEqual(['Q6', 'Q7', 'Q8', 'Q9', 'Q10']);
    expect(q6ToQ10WithHeadings).not.toMatch(/^## Q11\./m);
    expect(q6ToQ10Section).toContain('### Q6–Q10 공식 근거');
    expect(q6ToQ10Section).not.toMatch(/^\s*\u200b\s*$/m);
  });

  it('locks Q6 preliminary analysis, statutory appraisal, review, and non-binding caveats', () => {
    const section = questionSection(6);
    const requiredPhrases = [
      '도로교통사고 초보분석판정표',
      '예비 분석',
      '법원의 판결',
      '구속하지',
      '과실 비율',
      '당사자',
      '처리기관',
      '사법기관',
      '6개월',
      '수사 또는 재판',
      '촉탁',
      '한 번',
      '재심의',
      '전체 기록',
      '독립적으로',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
    expect(section).not.toContain('→');
    expect(section).toMatch(/(?:자동|필수|일률적).*(?:절차|단계).*(?:아니|않)/);
  });

  it('locks Q7 conditional injury, death, and property losses with their Civil Code anchors', () => {
    const section = questionSection(7);
    const requiredPhrases = [
      '민법 제184조',
      '위법한 권리 침해',
      '인과관계',
      '입증',
      '부상',
      '사망',
      '재산',
      '민법 제192조',
      '민법 제193조',
      '민법 제194조',
      '민법 제195조',
      '민법 제196조',
      '민법 제216조',
      '실제 손해',
      '잃게 된 이익',
      '의료비',
      '간병',
      '통원',
      '일실수입',
      '장례비',
      '부양',
      '수리비',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
    expect(section).not.toMatch(/^\s*1\. 의료비$/m);
  });

  it('locks Q8 evidence-versus-claim handling and the narrow Article 504 excess-scope fee caveat', () => {
    const section = questionSection(8);
    const requiredPhrases = [
      '영수증',
      '진단서',
      '진료기록',
      '의학적 필요성',
      '사고와의 인과관계',
      '증거를 보완',
      '청구금액을 변경하거나 증액',
      '절차 일정',
      '청구 내용',
      '형사소송법 제504조',
      '민사부',
      '이송 전 청구 범위',
      '초과 부분',
      '재판 비용',
      '사건별',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
    expect(section).toMatch(/(?:받아들여|허용).*(?:보장|않)/);
  });

  it('locks Q9 care proof and non-automatic treatment of family care', () => {
    const section = questionSection(9);
    const requiredPhrases = [
      '사고와의 인과관계',
      '간병 필요성',
      '실제 제공',
      '기간',
      '합리적인 금액',
      '친족',
      '무상',
      '자동으로 인정',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
    expect(section).toMatch(/(?:진단서|의학적 소견).*(?:유용|도움).*(?:결정적|단독).*(?:아니|않|아닙)/);
  });

  it('locks Q10 treatment-linked, necessary, reasonable travel proof and the non-automatic taxi caveat', () => {
    const section = questionSection(10);
    const requiredPhrases = [
      '치료기록',
      '사고 관련 부상',
      '경로',
      '방문 횟수',
      '방문 날짜',
      '교통수단',
      '요금',
      '필요성',
      '합리성',
      '영수증',
      '운임 기록',
      '경로 기록',
      '택시 영수증',
      '유일',
      '자동으로 충분',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('uses every authoritative Q6–Q10 source target once, in order, with Korean labels and no raw URLs', () => {
    const sourceHeading = '### Q6–Q10 공식 근거';
    const sourceBlock = q6ToQ10Section.slice(
      q6ToQ10Section.indexOf(sourceHeading),
    );
    const markdownLinks = Array.from(
      sourceBlock.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g),
      (match) => ({ label: match[1], url: match[2] }),
    );

    expect(markdownLinks.map(({ url }) => url)).toEqual(q6ToQ10SourceTargets);
    for (const { label } of markdownLinks) {
      expect(label).toMatch(/[\uac00-\ud7af]/);
    }
    for (const target of q6ToQ10SourceTargets) {
      expect(countOccurrences(q6ToQ10Section, target)).toBe(1);
    }
    expect(q6ToQ10Section).not.toMatch(/(?<!\]\()https?:\/\//);
  });

  it('rejects stale Q6–Q10 claims and unqualified automatic-entitlement language', () => {
    for (const phrase of q6ToQ10StaleCopy) {
      expect(q6ToQ10Section).not.toContain(phrase);
    }
    expect(q6ToQ10Section).not.toContain('→');
    expect(q6ToQ10Section).not.toMatch(/(?:항상|무조건)\s*(?:인정|청구|배상)/);
    expect(q6ToQ10Section).not.toMatch(/반드시\s+인정됩니다/);
  });
});
