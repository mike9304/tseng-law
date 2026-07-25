import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns/014-taiwan-mandatory-employment-period.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const canonicalSlug = 'taiwan-mandatory-employment-period';
const post = getColumnPost(canonicalSlug, 'ko');
const aliasPost = getColumnPost('mandatory-employment', 'ko');

const title = '대만 최소 근무기간 약정: 효력·교육비·위약금 판단 기준';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-mandatory-employment-period';
const featuredImage =
  '../images/014-taiwan-mandatory-employment-period/featured-01.jpg';
const bodyImage = `![근로계약의 최소 근무기간과 비용 반환 문제를 설명하는 이미지](${featuredImage})`;
const faq1Answer =
  '아닙니다. 대만 근로기준법 제15조의1에 따르면 사용자가 전문기술 훈련을 실시하고 비용을 부담했거나, 근로자가 최소 근무기간을 지키도록 합리적 보상을 제공한 경우에는 최소 근무기간 약정의 법정 요건을 충족할 수 있습니다. 두 요건을 모두 갖추어야 하는 것은 아니지만, 어느 한 요건이 있더라도 훈련 기간과 비용, 대체인력 가능성, 보상의 금액과 범위 등 전체 사정에 비추어 약정이 합리적 범위를 넘지 않아야 합니다.';
const faq2Answer =
  '대만 노동부의 2026년 6월 5일 지침에 따르면 정례 교육, 일반적인 직무교육, 신입사원의 업무 적응 교육과 법률상 실시해야 하는 의무교육의 비용은 최소 근무기간 약정이나 위약금·비용 반환 청구의 근거로 삼을 수 없습니다. 교육의 명칭만 볼 것이 아니라 구체적인 과정, 전문·기술적 내용, 기간, 사용자가 실제 부담한 비용과 증빙을 확인해야 합니다.';
const faq3Answer =
  '항상 전액을 반환하는 것은 아닙니다. 계약금·근속보너스 또는 다른 선급성 급부가 최소 근무기간 약정의 합리적 보상으로 지급되었다면 그 목적이 근로자에게 명확히 고지되어야 합니다. 대만 노동부의 2026년 6월 5일 지침은 기간 만료 전 퇴사 시 반환액을 아직 이행하지 않은 기간에 비례하여 계산해야 하고 전액 반환을 요구해서는 안 된다고 설명합니다. 실제 결론은 지급 목적, 약정 내용, 이미 근무한 기간과 종료 사유를 함께 검토해야 합니다.';
const faq4Answer =
  '대만 근로기준법 제15조의1 제4항은 근로자에게 책임을 돌릴 수 없는 사유로 최소 근무기간이 끝나기 전에 근로계약이 종료된 경우, 근로자가 최소 근무기간 약정 위반 책임이나 훈련비 반환 책임을 부담하지 않는다고 정합니다. 다만 종료 사유와 책임 귀속은 해고 통지, 사직 의사표시, 근로조건 위반 자료 등 구체적인 증거를 바탕으로 판단해야 합니다.';
const faq = [
  {
    q: '대만 근로계약의 최소 근무기간 약정은 자동으로 무효인가요?',
    a: faq1Answer,
  },
  {
    q: '신입사원 교육이나 법정 의무교육도 전문기술 훈련에 해당하나요?',
    a: faq2Answer,
  },
  {
    q: '조기 퇴사하면 계약금이나 근속보너스를 전액 돌려줘야 하나요?',
    a: faq3Answer,
  },
  {
    q: '근로자에게 책임을 돌릴 수 없는 사유로 계약이 일찍 끝나도 교육비를 반환해야 하나요?',
    a: faq4Answer,
  },
];
const headings = [
  '1. 최소 근무기간 약정은 언제 효력이 있나',
  '2. 첫 번째 법정 요건: 전문기술 훈련과 비용 부담',
  '3. 두 번째 법정 요건: 합리적 보상',
  '4. 합리적 범위와 네 가지 심사요소',
  '5. 약정의 근거가 될 수 없는 교육',
  '6. 보너스 반환과 조기 퇴사',
  '7. 근로자에게 책임을 돌릴 수 없는 사유로 계약이 종료된 경우',
  '8. 퇴사 예고는 별개의 문제',
  '9. 사용자·근로자 점검표',
  '10. 공식 자료',
  '11. 관련 안내',
];
const officialLinks = [
  '[대만 전국법규자료고: 근로기준법 제15조의1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=15-1&pcode=N0030001)',
  '[대만 전국법규자료고: 근로기준법 제15조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=15&pcode=N0030001)',
  '[대만 전국법규자료고: 근로기준법 제16조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=16&pcode=N0030001)',
  '[대만 노동부: 2026년 6월 5일 최소 근무기간·위약금 반환 지침](https://laws.mol.gov.tw/FLAW/FLAWDOC03.aspx?cnt=926&datatype=etype&edate=99991231&lnabndn=1&now=1&recordno=10&sdate=20180000)',
];
const officialUrls = officialLinks.map(
  (link) => link.match(/\((https?:\/\/[^)]+)\)$/)?.[1] ?? '',
);
const internalLinks = [
  '[대만 노동법 서비스](/ko/services/labor)',
  '[자진퇴사와 퇴직금 예외 안내](/ko/columns/taiwan-voluntary-resignation-severance)',
  '[상담 문의](/ko/contact)',
];
const internalTargets = [
  '/ko/services/labor',
  '/ko/columns/taiwan-voluntary-resignation-severance',
  '/ko/contact',
];
const disclaimer =
  '이 글은 대만의 최소 근무기간 약정, 훈련비와 선급성 급부의 반환 및 퇴사 예고를 일반적으로 설명하기 위한 교육 목적의 자료이며, 개별 노동사건에 대한 법률 자문이 아닙니다. 계약 유형과 문구, 실제 교육과 비용, 보상의 목적과 고지, 근무기간, 종료 원인과 증거에 따라 약정의 효력과 책임 범위가 달라질 수 있습니다. 퇴사 의사표시, 급여 공제, 반환 합의 또는 분쟁 대응 전에 최신 공식 자료와 개별 사정을 확인하시기 바랍니다.';
const author = '**증준외 변호사(曾雋崴, Wei Tseng)**';
const exactEnding = `- ${internalLinks[2]}

---

${disclaimer}

${author}`;

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
    .replace(/[“”‘’*_`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

describe('Korean labor column 014 — minimum-service-period clauses', () => {
  it('publishes the exact complete frontmatter, sole H1, and four ordered FAQs', () => {
    expect(parsed.data).toEqual({
      title,
      url: sourceUrl,
      lastmod: '2026-07-25',
      date_display: '2025년 9월 13일',
      read_time: '14분 분량',
      categories: ['대만 법률정보'],
      featured_image: featuredImage,
      faq,
    });
    expect(parsed.data.faq).toHaveLength(4);
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(parsed.content).toMatch(
      new RegExp(`^\\n# ${title}\\n\\n${bodyImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\n`),
    );
  });

  it('uses only the contracted body image and removes the legacy image stack', () => {
    const images = Array.from(
      parsed.content.matchAll(/!\[[^\]]*\]\([^)]+\)/g),
      (match) => match[0],
    );

    expect(images).toEqual([bodyImage]);
    expect(raw.split(featuredImage)).toHaveLength(3);
    expect(raw).not.toContain('img-01.jpg');
    expect(post?.featuredImage).toBe(
      '/images/blog/014-taiwan-mandatory-employment-period/featured-01.jpg',
    );
    expect(post?.content).not.toMatch(/!\[[^\]]*\]\([^)]+\)/);
  });

  it('uses exactly the eleven contracted H2 sections and two ordered checklist H3s', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(headings);
    expect(
      Array.from(parsed.content.matchAll(/^### (.+)$/gm), (match) => match[1]),
    ).toEqual(['사용자가 확인할 사항', '근로자가 확인할 사항']);
  });

  it('repeats every FAQ answer exactly twice and as its assigned H2 first paragraph', () => {
    const assignments = [
      ['## 1. 최소 근무기간 약정은 언제 효력이 있나', faq1Answer],
      ['## 5. 약정의 근거가 될 수 없는 교육', faq2Answer],
      ['## 6. 보너스 반환과 조기 퇴사', faq3Answer],
      [
        '## 7. 근로자에게 책임을 돌릴 수 없는 사유로 계약이 종료된 경우',
        faq4Answer,
      ],
    ];

    for (const [heading, answer] of assignments) {
      expect(firstParagraphAfter(parsed.content, heading)).toBe(answer);
      expect(firstParagraphAfter(post?.content ?? '', heading)).toBe(answer);
      expect(raw.split(answer)).toHaveLength(3);
    }
  });

  it('distinguishes repayment duties from a separate penalty claim in the four-question introduction', () => {
    const introduction = parsed.content.slice(
      parsed.content.indexOf(bodyImage) + bodyImage.length,
      parsed.content.indexOf(`## ${headings[0]}`),
    );
    const orderedQuestions = [
      '1. 약정 자체가 제15조의1의 법정 요건을 충족하는가',
      '2. 약정기간과 근로자 부담이 합리적인 범위인가',
      '3. 근로계약 종료 사유가 누구에게 귀속되는가',
      '4. 퇴사 예고와 반환 범위는 어떻게 판단하는가',
    ];

    expect(introduction).toContain(
      '조기 퇴사 시 훈련비·계약금·근속보너스를 반환할 의무가 있는지와 별도의 위약금 청구가 가능한지를 정하는 형태로 사용됩니다.',
    );
    expect(introduction).not.toContain('위약금의 반환');
    let previousIndex = -1;
    for (const question of orderedQuestions) {
      const index = introduction.indexOf(question);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
  });

  it('separates the two alternative threshold bases, reasonableness, and invalidity', () => {
    const section = sectionBody(parsed.content, headings[0]);
    const requiredPhrases = [
      '제15조의1 제1항은 두 가지 법정 요건을 선택적으로 규정합니다.',
      '첫째는 사용자가 근로자에게 전문기술 훈련을 제공하고 그 비용을 부담한 경우이고, 둘째는 최소 근무기간 준수의 대가로 합리적 보상을 제공한 경우입니다.',
      '제15조의1은 두 법정 요건 중 하나와 별도의 합리성 심사를 요구합니다. 전문기술 훈련과 합리적 보상을 언제나 동시에 제공해야 한다는 뜻도 아니고, 둘 중 하나만 형식적으로 적어 두면 약정 전체가 자동으로 유효해진다는 뜻도 아닙니다.',
      '제1항의 법정 요건 또는 제2항의 합리성 기준을 위반한 약정은 제3항에 따라 무효입니다.',
      '근로자가 계약서에 서명했다는 사정은 합의의 존재를 확인하는 자료가 될 수 있지만 법정 요건을 대신하지 못합니다.',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks the professional-training proof and compensation-disclosure analyses', () => {
    const trainingSection = sectionBody(parsed.content, headings[1]);
    const compensationSection = sectionBody(parsed.content, headings[2]);
    const trainingPhrases = [
      '사용자가 해당 근로자에게 전문기술 훈련을 실제로 제공하고 그 비용을 부담해야 합니다.',
      '교육의 주제, 직무에 필요한 전문성·기술성, 구체적인 기간, 이수 여부와 실제 비용 지출',
      '외부 강사비, 교육기관 수강료, 교재·장비 사용료',
      '통상적인 감독이나 업무 인수인계와 어떻게 다른지',
      '과정표, 교육 일정, 출석부, 평가 결과, 수료증, 청구서와 영수증',
      '모든 내부교육을 일률적으로 배제하거나, 고액·장기 과정이라는 이유만으로 법정 요건을 충족한다고 인정해서는 안 됩니다.',
    ];
    const compensationPhrases = [
      '통상임금이나 이미 제공해야 할 근로의 대가와 구별되는 목적과 구조',
      '지급명세에 계약금, 근속보너스 또는 선급성 급부라고 표시했다는 이유만으로 법적 성격이 결정되지는 않습니다.',
      '지급일, 금액, 귀속 시점, 근속기간과의 연결, 반환 사유와 산식',
      '그 역할을 명확히 고지해야 한다고 설명합니다.',
      '보상이 존재하더라도 어떠한 길이의 근속기간이나 어떠한 액수의 반환책임도 제한 없이 허용되는 것은 아닙니다.',
    ];

    for (const phrase of trainingPhrases) expect(trainingSection).toContain(phrase);
    for (const phrase of compensationPhrases) {
      expect(compensationSection).toContain(phrase);
    }
  });

  it('locks all four statutory scope factors and the required proportionality review', () => {
    const section = sectionBody(parsed.content, headings[3]);
    const orderedFactors = [
      '1. 전문기술 훈련의 기간과 비용',
      '2. 동일·유사 직무 근로자의 대체 가능성',
      '3. 보상의 금액과 범위',
      '4. 그 밖에 합리성에 영향을 미치는 사정',
    ];
    let previousIndex = -1;
    for (const factor of orderedFactors) {
      const index = section.indexOf(factor);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    for (const phrase of [
      '항목별 증빙과 근로자별 귀속액',
      '동일하거나 유사한 직무의 인력을 구할 수 있는지',
      '중도 종료 시 이미 이행한 기간이 반영되는지',
      '넷째 요소에는 약정 체결 경위, 업무의 성격, 당사자에게 설명된 내용, 실제 근무기간, 종료 사유 등 합리성에 영향을 미치는 여러 사정이 포함될 수 있습니다. 각 요소의 중요도는 사안에 따라 달라질 수 있으며, 고려할 사정도 위 예시에 한정되지 않습니다. 따라서 기록에 나타난 관련 사실을 빠뜨리지 않고 검토해야 합니다.',
      '고려할 사정도 위 예시에 한정되지 않습니다.',
      '약정기간, 사용자의 실제 투자, 대체 난이도, 근로자가 받은 보상과 반환 부담 사이에는 납득할 수 있는 비례관계가 필요합니다.',
      '특정 직종이라는 이유만으로 효력을 미리 정하거나 다른 사건의 결론을 그대로 적용해서는 안 됩니다.',
    ]) {
      expect(section).toContain(phrase);
    }
  });

  it('locks excluded routine training and the 2026 guidance without overgeneralizing internal courses', () => {
    const section = sectionBody(parsed.content, headings[4]);
    const requiredPhrases = [
      '勞動關2字第1150141814號 지침',
      '정기적으로 실시하는 교육, 통상적인 직무상 훈련, 신입사원이 업무환경과 절차에 익숙해지도록 하는 교육, 법률에 따라 사용자가 실시해야 하는 교육',
      '사업 운영이나 법정 의무 이행에 수반되는 것',
      '일반적인 채용·관리 비용이나 인수인계 비용을 별도의 투자라고 이름 붙여 반환 대상으로 정할 수 있는 것은 아닙니다.',
      '교육이 사내에서 이루어졌다는 이유만으로 항상 배제되는 것도 아닙니다.',
      '과정별 주제, 시간, 비용과 법정 의무 여부를 나누어 확인해야 합니다.',
    ];
    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it('locks clear disclosure, unserved-period proportionality, and separate repayment questions', () => {
    const section = sectionBody(parsed.content, headings[5]);
    const requiredPhrases = [
      '계약 체결과 지급 시점에 알 수 있어야 합니다.',
      '약정의 시작일과 종료일, 실제 근무일, 반환 산정의 기준액',
      '이미 이행한 기간을 전혀 반영하지 않는 고정액',
      '반환 문제는 약정의 효력, 지급된 금원의 법적 성격, 이미 근무한 기간, 종료 사유와 반환 산식을 차례로 확인해야 하며, 계약서에 ‘위약금’이라는 표현이 있다는 이유만으로 청구액이 확정되는 것은 아닙니다.',
      '전액 반환 문구, 실제 손실과 무관한 고정 위약금, 급여에서 일방적으로 공제하는 방식',
      '훈련비 반환과 선급성 급부 반환도 구별해야 합니다.',
      '비용이 중복 계산되지 않았는지',
    ];
    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it('locks protection for non-attributable termination and evidence-based attribution', () => {
    const section = sectionBody(parsed.content, headings[6]);
    const requiredPhrases = [
      '누가 어떤 의사표시를 했는지, 계약이 종료된 법적 근거는 무엇인지',
      '해고 통지서, 사직서, 합의 종료 문서, 전자우편과 메신저 기록, 근로조건 변경 자료, 출근·업무 기록',
      '건강이나 업무 사정이 언급된 경우에도 그 표현만으로 결과를 단정하지 않고',
      '해고, 합의 종료, 근로조건 위반 주장 등은 검토할 사정의 예일 뿐, 근로자에게 책임을 돌릴 수 없는 사유를 한정적으로 열거한 것은 아닙니다.',
      '산식 계산 전에 귀속 문제를 먼저 확인해야 합니다.',
      '선급성 급부와 그 밖의 별도 청구가 함께 있다면 각 청구의 법적 성격과 근거를 구분',
    ];
    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it('distinguishes resignation from liability and locks Articles 15 and 16 notice rules', () => {
    const section = sectionBody(parsed.content, headings[7]);
    const orderedRules = [
      '기간의 정함이 없는 근로계약을 근로자가 종료할 때에는 대만 근로기준법 제15조에 따라 제16조 제1항의 예고기간이 준용됩니다.',
      '1. 3개월 이상 1년 미만이면 10일',
      '2. 1년 이상 3년 미만이면 20일',
      '3. 3년 이상이면 30일',
      '특정 업무를 위한 기간제 근로계약의 계약기간이 3년을 초과하는 경우에는 제15조의 별도 규정이 적용됩니다.',
      '근로자는 3년간 근무한 뒤 30일 전에 사용자에게 예고하고 계약을 종료할 수 있습니다.',
    ];
    let previousIndex = -1;
    for (const rule of orderedRules) {
      const index = section.indexOf(rule);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    for (const phrase of [
      '최소 근무기간 약정은 근로자의 퇴사를 물리적 또는 법적으로 막는 장치가 아닙니다.',
      '제16조는 사용자의 계약 종료에 관한 조항이고, 근로자의 사직에는 제15조를 통하여 그 예고기간이 적용됩니다.',
      '3개월 미만의 계속근로, 다른 유형의 정기계약, 법률상 즉시종료 사유',
      '퇴사가 유효하게 이루어지는 시점, 최소 근무기간 약정의 유효성, 훈련비나 선급성 급부의 반환, 별도로 주장되는 손해',
    ]) {
      expect(section).toContain(phrase);
    }
  });

  it('locks the employer and worker evidence checklists and their required separation', () => {
    const section = sectionBody(parsed.content, headings[8]);
    const employerItems = [
      '1. 전문기술 훈련을 제공하고 비용을 부담했는지, 또는 근속 약속에 대한 합리적 보상을 제공했는지 법정 요건을 먼저 특정합니다.',
      '2. 일반교육·정례교육·법정 의무교육과 전문기술 훈련을 과정의 실제 내용, 기간과 목적에 따라 구분합니다.',
      '3. 교육 과정표, 일정, 이수기록, 청구서, 영수증과 비용 부담자 자료를 보존',
      '4. 보상 목적, 지급일, 금액, 귀속 조건, 근로자에게 한 고지와 미이행 기간 반환 산식',
      '5. 약정기간 산정 근거, 동일·유사 직무의 대체인력 가능성',
      '6. 약정기간과 반환액이 훈련비 또는 보상의 범위에 비례하는지',
      '7. 종료 원인과 책임 귀속을 개별적으로 확인한 뒤 실제 종료일, 이행 기간과 미이행 기간을 계산합니다.',
      '8. 급여에서 공제하거나 반환을 요구하기 전에 계약, 지급자료, 급여명세, 당사자 통신, 요구서와 공제 기록',
    ];
    const workerItems = [
      '1. 서명한 근로계약서와 변경합의 원본, 채용 당시 설명자료, 교육자료·과정표·일정·이수기록',
      '2. 교육의 전문·기술적 내용, 일반 적응교육인지 법정 의무교육인지, 청구서·영수증상 금액과 실제 비용 부담자',
      '3. 계약금·근속보너스 등 선급성 급부의 지급자료, 보상 목적에 관한 고지, 지급일, 귀속 조건과 반환 산식',
      '4. 약정기간의 산정 근거, 이미 근무한 기간, 남은 기간과 사용자가 주장하는 대체인력 가능성',
      '5. 퇴사 통지, 해고 통지 또는 합의 종료 문서와 전자우편·메신저 등 송달 증거',
      '6. 실제 종료 원인과 경위를 시간순으로 정리하고, 사용자의 반환 요구서, 급여명세, 당사자 통신과 공제 기록',
      '7. 최소 근무기간 약정의 효력, 퇴사 의사표시와 예고, 훈련비·선급성 급부 반환, 별도로 주장되는 손해',
      '8. 서명했다거나 사용자가 일정 금액을 요구했다는 사실만으로 책임을 인정하지 말고',
    ];
    let previousIndex = -1;
    for (const item of [...employerItems, ...workerItems]) {
      const index = section.indexOf(item);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
  });

  it('uses only the four official and three Korean internal links, URLs, and locale paths in order', () => {
    const markdownLinks = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g),
      (match) => match[0],
    );
    const externalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((https?:\/\/[^)]+)\)/g),
      (match) => match[1],
    );
    const markdownInternalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[1],
    );
    const allExternalUrls =
      parsed.content.match(/https?:\/\/[^\s)]+/g) ?? [];
    const allLocalePaths =
      parsed.content.match(/\/(?:ko|zh-hant|en|ja)(?:\/[^\s)]*)?/g) ?? [];

    expect(markdownLinks).toEqual([...officialLinks, ...internalLinks]);
    expect(externalTargets).toEqual(officialUrls);
    expect(markdownInternalTargets).toEqual(internalTargets);
    expect(allExternalUrls).toEqual(officialUrls);
    expect(allLocalePaths).toEqual(internalTargets);
    for (const url of officialUrls) expect(parsed.content.split(url)).toHaveLength(2);
    for (const link of [...officialLinks, ...internalLinks]) {
      expect(raw.split(link)).toHaveLength(2);
    }
  });

  it('locks the last internal link through the exact disclaimer and author at EOF', () => {
    expect(raw.trimEnd().slice(raw.lastIndexOf(`- ${internalLinks[2]}`))).toBe(
      exactEnding,
    );
    expect(parsed.content.trimEnd().endsWith(exactEnding)).toBe(true);
    expect(raw.trimEnd().endsWith(author)).toBe(true);
  });

  it('allows only the official letter number and author name as visible Han strings', () => {
    const hanStrings = Array.from(
      parsed.content.matchAll(
        /[\u3400-\u4dbf\u4e00-\u9fff][0-9\u3400-\u4dbf\u4e00-\u9fff]*/g,
      ),
      (match) => match[0],
    );
    expect(hanStrings).toEqual(['勞動關2字第1150141814號', '曾雋崴']);
  });

  it('freezes the exact visible eojeol count and derived read time', () => {
    const publicText = extractPublicText(parsed.content);
    const visibleEojeolCount = publicText.split(/\s+/).filter(Boolean).length;
    const calculatedMinutes = Math.ceil(visibleEojeolCount / 180);

    expect(visibleEojeolCount).toBeGreaterThanOrEqual(1_200);
    expect(visibleEojeolCount).toBe(2_343);
    expect(calculatedMinutes).toBe(14);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}분 분량`);
    expect(post?.readTime).toBe(`${calculatedMinutes}분 분량`);
  });

  it('exposes source metadata, FAQ, featured image, and full renderer content', () => {
    expect(post).toMatchObject({
      slug: canonicalSlug,
      title,
      date: '2026-07-25',
      dateDisplay: '2025년 9월 13일',
      readTime: '14분 분량',
      category: 'legal',
      categoryLabel: '법률정보',
      featuredImage:
        '/images/blog/014-taiwan-mandatory-employment-period/featured-01.jpg',
      faq,
    });

    const expectedRendererContent = parsed.content
      .replace(/\(\.\.\/images\/([^)]+)\)/g, '(/images/blog/$1)')
      .trimStart()
      .replace(/^#\s+.+\n*/, '')
      .replace(/^\s*!\[[^\]]*\]\([^)]+\)\s*\n*/, '')
      .trim();
    expect(post?.content).toBe(expectedRendererContent);
    expect(post?.content).toContain(`## ${headings[0]}`);
    expect(post?.content).toContain(`## ${headings.at(-1)}`);
  });

  it('resolves the canonical and legacy alias slugs to identical Korean posts', () => {
    expect(post).toBeDefined();
    expect(aliasPost).toBeDefined();
    expect(aliasPost?.slug).toBe(canonicalSlug);
    expect(aliasPost?.title).toBe(post?.title);
    expect(aliasPost?.date).toBe(post?.date);
    expect(aliasPost?.featuredImage).toBe(post?.featuredImage);
    expect(aliasPost?.faq).toEqual(post?.faq);
    expect(aliasPost?.content).toBe(post?.content);
  });

  it('removes every forbidden legacy claim, figure, overpromise, and locale leak', () => {
    const forbiddenLiterals = [
      '거의 불법',
      '거의 무효',
      '세 가지 요건을 모두',
      '모두 충족해야',
      '183대만달러',
      '27,470대만달러',
      '1만 30원',
      '209만 6,270원',
      '500만 대만달러',
      '20년 근무',
      '파일럿',
      '걱정하지 마세요',
      '높은 확률로 불법',
      '시간외 수당이나 출장비 등은 인정되지 않습니다',
      '/zh-hant/',
      '/en/',
      '/ja/',
      '모든 약정이 무효',
      '서명했으므로 유효',
      '퇴사할 수 없습니다',
      '출발 요건',
      '진입요건',
      '법정요건',
      '무기계약',
      '특정성 정기계약',
      '퇴직 의사표시',
      '근로자에게 책임 없는',
      '\uFEFF',
      '\u00A0',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(raw).not.toContain(forbidden);
    }
    expect(raw).not.toMatch(/(?:세|3) 가지 (?:요건|조건)[^.。\n]*모두/);
    expect(raw).not.toMatch(/(?:거의|높은 확률로)[^.。\n]*(?:불법|무효)/);
    expect(raw).not.toMatch(/(?:최소 근무기간|의무재직)[^.。\n]*(?:퇴사|사직)[^.。\n]*(?:금지|불가능|할 수 없)/);
    expect(raw).not.toMatch(/[\u3040-\u30ff]/);
  });
});
