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
const faq1Lead =
  '자동으로 무효는 아닙니다. 대만 근로기준법 제15조의1 제1항이 정한 법정 요건은 둘 중 하나입니다. 사용자가 전문기술 훈련을 실시하고 비용을 부담했거나, 근로자가 최소 근무기간을 지키도록 합리적 보상을 제공했다면 요건을 충족할 수 있습니다. 둘 다 갖출 필요는 없습니다. 그렇다고 한쪽만 형식적으로 적어 두면 약정이 자동으로 유효해지는 것도 아닙니다. 계약서에 어떤 이름을 붙였는지보다 실제로 어느 근거가 있는지가 기준입니다.';
const faq2Lead =
  '대만 노동부의 2026년 6월 5일 지침에 따르면 정례 교육, 일반적인 직무교육, 신입사원의 업무 적응 교육, 법률상 실시해야 하는 의무교육에 든 비용은 최소 근무기간 약정이나 위약금·비용 반환 청구의 근거로 삼을 수 없습니다. 교육의 명칭만 보지 않습니다. 구체적인 과정, 전문·기술적 내용, 기간, 사용자가 실제로 부담한 비용과 증빙을 확인합니다.';
const faq3Lead =
  '받은 돈을 항상 전부 돌려줘야 하는 것은 아닙니다. 계약금·근속보너스나 다른 선급성 급부가 최소 근무기간 약정의 합리적 보상으로 지급되었다면 그 목적이 근로자에게 명확히 고지되어야 합니다. 2026년 6월 5일 노동부 지침은 기간이 끝나기 전에 퇴사하면 반환액을 아직 이행하지 않은 기간에 비례해 계산해야 하고 전액 반환을 요구해서는 안 된다고 설명합니다. 실제 결론은 지급 목적, 약정 내용, 이미 근무한 기간과 종료 사유를 함께 검토해야 나옵니다.';
const faq4Lead =
  '계약이 일찍 끝나도 교육비를 돌려줘야 할까요? 근로자에게 책임을 돌릴 수 없는 사유로 최소 근무기간이 끝나기 전에 근로계약이 종료되었다면, 제15조의1 제4항에 따라 근로자는 최소 근무기간 약정 위반 책임이나 훈련비 반환 책임을 지지 않습니다. 다만 종료 사유와 책임 귀속은 해고 통지, 사직 의사표시, 근로조건 위반 자료 같은 구체적인 증거로 판단합니다.';
const headings = [
  '최소 근무기간 약정은 언제 효력이 있나',
  '전문기술 훈련과 비용 부담',
  '계약금과 근속보너스는 합리적 보상이 되는가',
  '약정기간이 합리적인지 보는 네 가지 요소',
  '신입 적응교육과 법정 의무교육은 근거가 되지 못합니다',
  '조기 퇴사와 계약금·근속보너스 반환',
  '근로자 책임이 아닌 사유로 계약이 끝난 경우',
  '퇴사 예고기간은 약정과 따로 봅니다',
  '교육·지급·근무·종료 자료는 시간순으로 정리합니다',
  '관련 안내',
  '공식 자료',
];
const officialLinks = [
  '[대만 전국법규자료고: 근로기준법 제15조의1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=15-1&pcode=N0030001)',
  '[대만 전국법규자료고: 근로기준법 제15조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=15&pcode=N0030001)',
  '[대만 전국법규자료고: 근로기준법 제16조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=16&pcode=N0030001)',
  '[대만 노동부: 2026년 6월 5일 최소 근무기간·위약금 반환 지침](https://laws.mol.gov.tw/FLAW/FLAWDOC03.aspx?datatype=etype&N2=1150141814&cnt=1&now=1&lnabndn=1&recordno=1)',
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
const author = '증준외 변호사(曾雋崴, Wei Tseng)';
const exactEnding = `- ${officialLinks[3]}

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
      lastmod: '2026-10-12',
      date_display: '2025년 9월 13일',
      read_time: '12분 분량',
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
    ).toEqual(['사용자 쪽 자료', '근로자 쪽 자료']);
  });

  it('keeps every FAQ answer once in the frontmatter and carries it in its assigned H2 first paragraph', () => {
    const assignments = [
      [`## ${headings[0]}`, faq1Answer, faq1Lead],
      [`## ${headings[4]}`, faq2Answer, faq2Lead],
      [`## ${headings[5]}`, faq3Answer, faq3Lead],
      [`## ${headings[6]}`, faq4Answer, faq4Lead],
    ];

    for (const [heading, answer, lead] of assignments) {
      expect(firstParagraphAfter(parsed.content, heading)).toBe(lead);
      expect(firstParagraphAfter(post?.content ?? '', heading)).toBe(lead);
      expect(raw.split(answer)).toHaveLength(2);
    }
  });

  it('distinguishes repayment duties from a separate penalty claim in the four-question introduction', () => {
    const introduction = parsed.content.slice(
      parsed.content.indexOf(bodyImage) + bodyImage.length,
      parsed.content.indexOf(`## ${headings[0]}`),
    );
    const orderedQuestions = [
      '약정이 제15조의1의 법정 요건을 충족하는지',
      '약정기간과 근로자의 부담이 합리적인 범위인지',
      '계약이 끝난 사유가 누구에게 귀속되는지',
      '퇴사 예고와 반환 범위를 어떻게 판단하는지',
    ];

    expect(introduction).toContain(
      '조기 퇴사 때 훈련비·계약금·근속보너스를 반환할 의무와 별도의 위약금 청구 가능 여부까지 함께 정해 둡니다.',
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
      '대만 근로기준법 제15조의1 제1항이 정한 법정 요건은 둘 중 하나입니다.',
      '사용자가 전문기술 훈련을 실시하고 비용을 부담했거나, 근로자가 최소 근무기간을 지키도록 합리적 보상을 제공했다면 요건을 충족할 수 있습니다.',
      '둘 다 갖출 필요는 없습니다. 그렇다고 한쪽만 형식적으로 적어 두면 약정이 자동으로 유효해지는 것도 아닙니다.',
      '심사는 거기서 끝나지 않습니다. 제2항은 약정기간과 책임 범위가 합리적인지를 따로 심사하도록 정합니다.',
      '제1항의 법정 요건이나 제2항의 합리성 기준을 어긴 약정은 제3항에 따라 무효입니다.',
      '서명은 합의가 있었다는 자료가 될 수 있습니다. 법정 요건을 대신하지는 못합니다.',
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
      '사용자가 그 근로자에게 전문기술 훈련을 실제로 제공하고 비용을 부담해야 합니다.',
      '교육의 주제, 직무에 필요한 전문성·기술성, 구체적인 기간, 이수 여부, 실제 비용 지출',
      '외부 강사비, 교육기관 수강료, 교재·장비 사용료',
      '통상적인 감독이나 업무 인수인계와 무엇이 다른지',
      '과정표, 교육 일정, 출석부, 평가 결과, 수료증, 청구서, 영수증',
      '내부교육이라고 일률적으로 배제해서는 안 되고, 고액·장기 과정이라는 이유만으로 법정 요건 충족을 인정해서도 안 됩니다.',
    ];
    const compensationPhrases = [
      '통상임금이나 이미 지급해야 할 근로의 대가와는 목적·구조가 구별되어야 합니다.',
      '지급명세에 계약금, 근속보너스, 선급성 급부라고 적혀 있다는 이유만으로 법적 성격이 정해지지는 않습니다.',
      '지급일, 금액, 귀속 시점, 근속기간과의 연결, 반환 사유와 산식',
      '그 역할을 명확히 고지해야 한다고 설명합니다.',
      '보상이 있다고 해서 어떤 길이의 근속기간이든, 어떤 액수의 반환책임이든 제한 없이 허용되지는 않습니다.',
    ];

    for (const phrase of trainingPhrases) expect(trainingSection).toContain(phrase);
    for (const phrase of compensationPhrases) {
      expect(compensationSection).toContain(phrase);
    }
  });

  it('locks all four statutory scope factors and the required proportionality review', () => {
    const section = sectionBody(parsed.content, headings[3]);
    const orderedFactors = [
      '전문기술 훈련의 기간과 비용',
      '동일·유사 직무 근로자의 대체 가능성',
      '보상의 금액과 범위',
      '그 밖에 합리성에 영향을 미치는 사정',
    ];
    let previousIndex = -1;
    for (const factor of orderedFactors) {
      const index = section.indexOf(factor);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    for (const phrase of [
      '항목별 증빙, 근로자별 귀속액',
      '동일하거나 유사한 직무의 인력을 구할 수 있는지',
      '중도에 끝났을 때 이미 이행한 기간이 반영되는지',
      '그 밖의 사정에는 약정을 맺은 경위, 업무의 성격, 당사자에게 설명된 내용, 실제 근무기간, 종료 사유 등이 들어가기도 합니다. 요소마다 중요도는 사안에 따라 달라지고, 고려할 사정이 이 예시에 한정되지도 않습니다. 기록에 나타난 관련 사실은 빠뜨리지 않고 검토합니다.',
      '고려할 사정이 이 예시에 한정되지도 않습니다.',
      '결국 필요한 것은 비례관계입니다. 약정기간, 사용자가 실제로 들인 투자, 대체 난이도, 근로자가 받은 보상, 반환 부담이 서로 납득할 만한 비율을 이루어야 합니다.',
      '직종만으로 효력을 미리 정할 수는 없습니다. 다른 사건의 결론을 그대로 가져와서도 안 됩니다.',
    ]) {
      expect(section).toContain(phrase);
    }
  });

  it('locks excluded routine training and the 2026 guidance without overgeneralizing internal courses', () => {
    const section = sectionBody(parsed.content, headings[4]);
    const requiredPhrases = [
      '勞動關2字第1150141814號 지침',
      '정기적으로 실시하는 교육, 통상적인 직무상 훈련, 신입사원이 업무환경과 절차에 익숙해지도록 하는 교육, 법률에 따라 사용자가 실시해야 하는 교육',
      '사업 운영이나 법정 의무 이행에 따르는 일입니다.',
      '사용자가 원래 부담할 일반적인 채용·관리 비용이나 인수인계 비용에 별도의 투자라는 이름을 붙여 반환 대상으로 정할 수는 없습니다.',
      '그렇다고 사내 교육이 언제나 빠지는 것은 아닙니다.',
      '과정별 주제, 시간, 비용, 법정 의무 여부를 나누어 살펴야 합니다.',
    ];
    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it('locks clear disclosure, unserved-period proportionality, and separate repayment questions', () => {
    const section = sectionBody(parsed.content, headings[5]);
    const requiredPhrases = [
      '근로자가 계약을 맺고 돈을 받는 시점에 알 수 있어야 합니다.',
      '약정의 시작일과 종료일, 실제 근무일, 반환 산정의 기준액',
      '이미 이행한 기간을 전혀 반영하지 않는 고정액',
      '확인하는 순서는 약정의 효력, 지급된 돈의 법적 성격, 이미 근무한 기간, 종료 사유, 반환 산식입니다. 계약서에 ‘위약금’이라는 표현이 있어도 청구액은 확정되지 않습니다.',
      '전액 반환 문구, 실제 손실과 무관한 고정 위약금, 급여에서 일방적으로 공제하는 방식',
      '훈련비 반환과 선급성 급부 반환도 나누어 봅니다.',
      '비용이 중복 계산되지 않았는지',
    ];
    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it('locks protection for non-attributable termination and evidence-based attribution', () => {
    const section = sectionBody(parsed.content, headings[6]);
    const requiredPhrases = [
      '누가 어떤 의사표시를 했는지, 계약이 끝난 법적 근거가 무엇인지',
      '해고 통지서, 사직서, 합의 종료 문서, 전자우편과 메신저 기록, 근로조건 변경 자료, 출근·업무 기록',
      '건강이나 업무 사정이 언급되어 있어도 그 표현만으로 결과를 단정하지 않습니다.',
      '해고, 합의 종료, 근로조건 위반 주장은 검토할 사정의 예일 뿐입니다. 근로자에게 책임을 돌릴 수 없는 사유를 한정해 열거한 것이 아닙니다.',
      '귀속 문제가 먼저입니다. 산식은 그다음입니다.',
      '선급성 급부나 그 밖의 별도 청구가 함께 있다면 각 청구의 법적 성격과 근거를 구분',
    ];
    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it('distinguishes resignation from liability and locks Articles 15 and 16 notice rules', () => {
    const section = sectionBody(parsed.content, headings[7]);
    const orderedRules = [
      '기간의 정함이 없는 근로계약을 근로자가 끝낼 때는 대만 근로기준법 제15조에 따라 제16조 제1항의 예고기간이 준용됩니다.',
      '3개월 이상 1년 미만은 10일입니다.',
      '1년 이상 3년 미만은 20일입니다.',
      '3년 이상은 30일입니다.',
      '특정 업무를 위한 기간제 근로계약의 계약기간이 3년을 초과하면 제15조에 정한 별도 규정이 적용됩니다.',
      '근로자는 3년간 근무한 뒤 30일 전에 사용자에게 예고하고 계약을 끝낼 수 있습니다.',
    ];
    let previousIndex = -1;
    for (const rule of orderedRules) {
      const index = section.indexOf(rule);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    for (const phrase of [
      '최소 근무기간 약정은 퇴사를 물리적으로든 법적으로든 막지 못합니다.',
      '제16조는 사용자가 계약을 끝내는 경우에 관한 조항이고, 근로자의 사직에는 제15조를 거쳐 같은 예고기간이 적용됩니다.',
      '3개월 미만의 계속근로, 다른 유형의 정기계약, 법률상 즉시종료 사유',
      '약정의 유효성, 퇴사가 효력을 내는 시점, 훈련비나 선급성 급부의 반환, 별도로 주장되는 손해',
    ]) {
      expect(section).toContain(phrase);
    }
  });

  it('locks the employer and worker evidence checklists and their required separation', () => {
    const section = sectionBody(parsed.content, headings[8]);
    const employerItems = [
      '사용자는 어느 법정 요건에 기대는지부터 특정합니다.',
      '과정표, 일정, 이수기록, 청구서, 영수증, 비용 부담자 자료를 보존하고 외부비용과 내부비용의 근거를 나누어 적습니다.',
      '일반교육·정례교육·법정 의무교육은 실제 내용, 기간, 목적에 따라 전문기술 훈련과 구분합니다.',
      '목적, 지급일, 금액, 귀속 조건, 근로자에게 한 고지, 미이행 기간 반환 산식',
      '약정기간을 정한 근거, 동일·유사 직무의 대체인력 가능성',
      '약정기간과 반환액이 훈련비나 보상의 범위에 비례하는지',
      '종료 원인과 책임 귀속부터 가립니다. 그 뒤에 실제 종료일과 이행·미이행 기간을 계산합니다.',
      '급여에서 공제하거나 반환을 요구하기 전에는 계약, 지급자료, 급여명세, 당사자 통신, 요구서, 공제 기록',
    ];
    const workerItems = [
      '서명한 근로계약서와 변경합의 원본부터 모읍니다. 채용 때 받은 설명자료, 교육자료·과정표·일정·이수기록도 같이 둡니다.',
      '교육이 전문·기술적 내용인지 일반 적응교육이나 법정 의무교육인지, 청구서·영수증의 금액과 실제 비용 부담자가 누구인지도 확인합니다.',
      '계약금·근속보너스 같은 선급성 급부는 지급자료, 보상 목적에 관한 고지, 지급일, 귀속 조건, 반환 산식을 확보합니다.',
      '약정기간의 산정 근거, 이미 근무한 기간, 남은 기간, 사용자가 주장하는 대체인력 가능성은 구분해 기록합니다.',
      '퇴사 통지, 해고 통지, 합의 종료 문서와 전자우편·메신저 같은 송달 증거도 보존합니다.',
      '실제 종료 원인과 경위는 시간순으로 정리하고, 사용자의 반환 요구서, 급여명세, 당사자 통신, 공제 기록을 함께 살핍니다.',
      '서명했다는 사실이나 사용자가 일정 금액을 요구했다는 사실만으로 책임을 인정해서는 안 됩니다.',
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

    expect(markdownLinks).toEqual([...internalLinks, ...officialLinks]);
    expect(externalTargets).toEqual(officialUrls);
    expect(markdownInternalTargets).toEqual(internalTargets);
    expect(allExternalUrls).toEqual(officialUrls);
    expect(allLocalePaths).toEqual(internalTargets);
    for (const url of officialUrls) expect(parsed.content.split(url)).toHaveLength(2);
    for (const link of [...officialLinks, ...internalLinks]) {
      expect(raw.split(link)).toHaveLength(2);
    }
  });

  it('locks the last official link through the exact disclaimer and author at EOF', () => {
    expect(raw.trimEnd().slice(raw.lastIndexOf(`- ${officialLinks[3]}`))).toBe(
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
    expect(visibleEojeolCount).toBe(2_132);
    expect(calculatedMinutes).toBe(12);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}분 분량`);
    expect(post?.readTime).toBe(`${calculatedMinutes}분 분량`);
  });

  it('exposes source metadata, FAQ, featured image, and full renderer content', () => {
    expect(post).toMatchObject({
      slug: canonicalSlug,
      title,
      date: '2026-10-12',
      dateDisplay: '2025년 9월 13일',
      readTime: '12분 분량',
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
    expect(post?.content).toBe(expectedRendererContent.replace(author, '').trim());
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
