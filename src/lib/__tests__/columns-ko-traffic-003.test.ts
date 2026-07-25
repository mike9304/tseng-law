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
const immutableTailBytes = 13_981;
const immutableTailSha256 =
  'e0f7bd71741056292adce098892f5a549b70162dc2062dc490447019ae6c32fa';

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
const q6Tail = rawBytes.subarray(q6ByteIndex);
const q6CharacterIndex = parsed.content.indexOf(q6Marker);
const microSection = parsed.content.slice(0, q6CharacterIndex);

function questionSection(questionNumber: number) {
  const heading = `## Q${questionNumber}.`;
  const start = microSection.indexOf(heading);
  if (start === -1) return '';

  const next = microSection.indexOf('\n## ', start + heading.length);
  return microSection.slice(start, next === -1 ? microSection.length : next);
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

  it('preserves Q6–Q20 byte-for-byte from the immutable boundary', () => {
    expect(q6ByteIndex).toBeGreaterThan(0);
    expect(q6Tail.byteLength).toBe(immutableTailBytes);
    expect(crypto.createHash('sha256').update(q6Tail).digest('hex')).toBe(
      immutableTailSha256,
    );
    expect(q6Tail.toString('utf8').startsWith(q6Marker)).toBe(true);
  });
});
