import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns/016-taiwan-inheritance-custody-analysis.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('taiwan-inheritance-custody-analysis', 'ko');
const aliasPost = getColumnPost('inheritance-custody', 'ko');

const title = '대만 상속과 친권: 남은 가족을 위한 법률 안내';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-inheritance-custody-analysis';
const featuredImage =
  '../images/016-taiwan-inheritance-custody-analysis/featured-generic.webp';
const faq1Answer =
  '대만 민법 제1138조와 제1144조에 따르면 배우자는 해당 순위의 상속인과 공동상속하고, 직계비속은 법정상속의 제1순위입니다. 유효한 유언이 없고 배우자와 자녀 두 명만 관련 상속인이며, 상속포기·상속결격·대습상속이나 그 밖에 결론을 바꿀 사정이 없다면 세 사람은 통상 각각 3분의 1씩 상속합니다. 이는 설명을 위한 가정일 뿐, 특정 상속사건의 결론이 아닙니다.';
const faq2Answer =
  '아닙니다. 대만 민법 제1030조의1에 따른 부부 잔여재산 분배청구권은 법정 요건이 충족될 때 배우자가 별도로 주장할 수 있는 권리로, 상속분과 구별하여 계산해야 합니다. 혼인 중 취득한 모든 재산이 당연히 계산 대상이 되는 것도 아니고, 생존 배우자가 상속재산의 절반을 반드시 받는 것도 아닙니다. 재산제, 각 재산의 취득 원인과 시기, 채무 및 법정 제외항목을 확인한 뒤 개별적으로 판단해야 합니다.';
const faq3Answer =
  '대만 민법 제1089조에 따라 부모 한쪽이 미성년 자녀에 대한 권리와 의무를 행사할 수 없을 때에는 다른 한쪽이 이를 행사하는 것이 원칙입니다. 따라서 생존 부모가 친권을 유지하고 이에 반하는 법원 재판이 없다면, 그 부모가 통상 계속해서 친권상 권리와 의무를 행사합니다. 다만 기존 재판, 친권 제한·정지 사유, 국제적 요소와 자녀의 최선의 이익 등 구체적인 사정에 따라 법원의 관여가 필요할 수 있습니다.';
const faq4Answer =
  '그렇지 않습니다. 대만 민법 제1087조와 제1088조에 따르면 미성년자가 상속으로 취득한 재산은 자녀의 특유재산이며, 부모나 후견인이 그 재산의 실질적 소유자가 되는 것은 아닙니다. 관리·사용·수익·법정대리·처분은 자녀의 이익을 위해 이루어져야 하고, 이해상충이나 중요한 처분에는 특별대리인 선임 또는 법원의 관여가 문제될 수 있습니다. 부모가 자녀의 상속재산을 제한 없이 일방적으로 사용할 수 있다고 보아서는 안 됩니다.';
const faq = [
  {
    q: '유언이 없고 배우자와 자녀 두 명만 상속인이라면 상속분은 어떻게 되나요?',
    a: faq1Answer,
  },
  {
    q: '배우자의 잔여재산 분배청구권은 상속분과 같은 권리인가요?',
    a: faq2Answer,
  },
  {
    q: '부모 한 명이 사망하면 생존 부모의 친권은 어떻게 되나요?',
    a: faq3Answer,
  },
  {
    q: '생존 부모는 미성년 자녀가 상속받은 재산을 자유롭게 사용할 수 있나요?',
    a: faq4Answer,
  },
];
const headings = [
  '1. 법정상속인과 상속분',
  '2. 유언과 상속재산의 확정',
  '3. 배우자의 잔여재산 분배청구권',
  '4. 상속채무와 상속포기',
  '5. 생존 부모의 친권상 권리와 의무',
  '6. 후견인 지정과 법원의 관여',
  '7. 미성년자의 상속재산 보호',
  '8. 국제가족의 준거법과 절차',
  '9. 실무 준비 체크리스트',
  '10. 공식 자료',
  '11. 관련 안내',
];
const officialLinks = [
  '[대만 전국법규자료고: 민법](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000001)',
  '[대만 법무부 법규검색시스템: 민법 영문본](https://mojlaw.moj.gov.tw/ENG/LawContentE.aspx?LSID=FL001351)',
  '[대만 전국법규자료고: 섭외민사법률적용법](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000007)',
  '[대만 사법원: 미성년자 후견인 선임 신청서 서식](https://www.judicial.gov.tw/tw/cp-1369-4219-da7e1-1.html)',
  '[대만 재정부 세무포털: 상속사건 신청 절차와 준비서류](https://www.etax.nat.gov.tw/etwmain/tax-info/house-land-transfer-taxtation-calculation-area/inheritance/file-process)',
];
const officialUrls = officialLinks.map(
  (link) => link.match(/\((https?:\/\/[^)]+)\)$/)?.[1] ?? '',
);
const internalLinks = [
  '[대만 가사소송 서비스](/ko/services/family)',
  '[대만 소송 변호사 안내](/ko/taiwan-litigation-lawyer)',
  '[상담 문의](/ko/contact)',
];
const disclaimer =
  '이 글은 대만의 상속, 부부재산제, 친권과 미성년후견 제도를 일반적으로 설명하기 위한 교육 목적의 자료이며, 개별 상속·가사 사건에 대한 법률 자문이 아닙니다. 상속인의 범위, 유언, 재산과 채무, 혼인재산제, 기존 법원 재판 및 국제적 요소에 따라 적용 법률, 절차와 결과가 달라질 수 있습니다. 상속포기·세무신고 등 기한을 계산하거나 재산을 처분하기 전에 최신 공식 자료와 개별 사정을 확인하시기 바랍니다.';
const author = '**증준외 변호사(曾雋崴, Wei Tseng)**';

function firstParagraphAfter(content: string, heading: string) {
  return content.split(`${heading}\n\n`)[1]?.split('\n\n')[0];
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

describe('Korean family column 016 — anonymized inheritance and parental-rights guide', () => {
  it('publishes the exact frontmatter, sole H1, and four ordered FAQs', () => {
    expect(parsed.data).toEqual({
      title,
      url: sourceUrl,
      lastmod: '2026-07-25',
      date_display: '2025년 9월 13일',
      read_time: '13분 분량',
      categories: ['대만 법률정보'],
      featured_image: featuredImage,
      faq,
    });
    expect(parsed.data.faq).toHaveLength(4);
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(post).toMatchObject({
      slug: 'taiwan-inheritance-custody-analysis',
      title,
      date: '2026-07-25',
      dateDisplay: '2025년 9월 13일',
      readTime: '13분 분량',
      category: 'legal',
      categoryLabel: '법률정보',
      featuredImage:
        '/images/blog/016-taiwan-inheritance-custody-analysis/featured-generic.webp',
      faq,
    });
  });

  it('uses only the contracted generic image and removes every legacy image path', () => {
    const bodyImages = Array.from(
      parsed.content.matchAll(/!\[[^\]]*\]\([^)]+\)/g),
      (match) => match[0],
    );

    expect(bodyImages).toEqual([
      `![대만 상속 계획과 미성년자 재산 보호를 상징하는 이미지](${featuredImage})`,
    ]);
    expect(raw.split(featuredImage)).toHaveLength(3);
    for (const legacyImage of [
      'featured-01.jpg',
      'img-01.jpg',
      'img-02.jpg',
      'img-03.jpg',
    ]) {
      expect(raw).not.toContain(legacyImage);
    }
  });

  it('repeats every FAQ answer exactly twice and as the assigned H2 first paragraph', () => {
    const headingAnswers = [
      ['## 1. 법정상속인과 상속분', faq1Answer],
      ['## 3. 배우자의 잔여재산 분배청구권', faq2Answer],
      ['## 5. 생존 부모의 친권상 권리와 의무', faq3Answer],
      ['## 7. 미성년자의 상속재산 보호', faq4Answer],
    ];

    for (const [heading, answer] of headingAnswers) {
      expect(firstParagraphAfter(parsed.content, heading)).toBe(answer);
      expect(firstParagraphAfter(post?.content ?? '', heading)).toBe(answer);
      expect(raw.split(answer)).toHaveLength(3);
    }
    expect(raw.match(/3분의 1/g)).toHaveLength(2);
  });

  it('uses exactly the eleven contracted H2 sections in order', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(headings);
  });

  it('locks the intestate, will, estate-identification, and spouse-claim rules', () => {
    const requiredPhrases = [
      '민법 제1138조는 배우자 외 법정상속인의 순위를 직계비속, 부모, 형제자매, 조부모의 순서로 정합니다.',
      '생존 배우자는 민법 제1138조가 정한 친족 상속순위에 속하는 후순위 상속인이 아니라, 민법 제1144조에 따라 실제로 적용되는 순위의 상속인과 공동상속합니다.',
      '유효한 유언은 법정상속과 다른 분배 방법을 정할 수 있습니다.',
      '유류분을 비롯한 강행규정의 제한도 함께 검토해야 합니다.',
      '실질 소유관계, 공동명의의 지분, 제3자의 권리와 담보 설정도 조사해야 합니다.',
      '보험금이나 퇴직급여처럼 수익자가 별도로 지정된 급부',
      '신탁재산은 신탁계약의 구조와 수익권을 확인해야 하고, 생전 증여나 재산 이전',
      '이 청구권은 법정재산제가 종료될 때 부부 각자의 혼인 후 재산 증가를 법정 기준에 따라 비교하는 제도입니다.',
      '상속이나 증여로 취득한 재산과 위자료 등 법정 제외항목이 있을 수 있고, 혼인 중 발생한 채무도 고려해야 합니다.',
      '민법 제1030조의1은 균등 분배의 결과가 현저히 불공평한 경우 법원이 분배액을 조정할 수 있도록 정하고 있습니다.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks inherited-debt limits, waiver formalities, and qualified public deadlines', () => {
    const requiredPhrases = [
      '상속채무에 대한 책임은 원칙적으로 상속으로 취득한 재산의 가액을 한도로 합니다.',
      '민법 제1174조에 따라 상속권을 안 날부터 3개월 안에 관할 법원에 서면으로 의사를 표시해야 합니다.',
      '재산목록 작성, 채권자에 대한 공고와 변제, 상속재산 보전',
      '2026년 6월 25일 갱신되었으며, 재산목록 제출과 상속포기에 관한 법원 절차의 일반적인 3개월 기간 및 상속세 신고의 일반적인 6개월 기간',
      '이를 개인별 마감일 계산으로 사용해서는 안 됩니다.',
      '법원에 제출하는 상속포기 서류와 세무기관의 상속세 신고를 같은 절차로 생각해서는 안 됩니다.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks the surviving-parent, guardianship, and court-involvement rules', () => {
    const requiredPhrases = [
      '친권상 권리와 의무에는 미성년 자녀의 보호·교양, 거소에 관한 결정, 법정대리와 재산관리 등 여러 내용이 포함될 수 있습니다.',
      '친권과 상속은 법적으로 별개의 문제입니다.',
      '대만 민법 제1091조에 따른 미성년후견은 미성년자에게 부모가 없거나 부모 모두가 친권상 권리와 의무를 행사할 수 없는 때 문제됩니다.',
      '민법 제1093조에 따르면 마지막으로 친권상 권리와 의무를 행사하는 부모는 유언으로 미성년후견인을 지정할 수 있습니다.',
      '민법 제1094조의 법정 순위와 제1094조의1의 법원 선임 규율',
      '자녀의 최선의 이익을 심사합니다.',
      '친족과 그 밖에 법률이 정한 신청권자는 법정 사유가 있으면 법원에 후견인의 선임·변경 또는 그 밖에 필요한 처분을 구할 수 있습니다.',
      '후견인은 친권을 행사하는 부모와 같은 개념이 아니며',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks ownership, conflicts, special representation, and supervision of a minor’s property', () => {
    const requiredPhrases = [
      '특유재산은 미성년자 본인에게 귀속하는 재산을 뜻합니다.',
      '부모 또는 후견인이 관리 업무를 맡더라도 그 재산의 실질적 소유자가 되는 것은 아니며',
      '민법 제1088조에 따른 관리·사용·수익과 처분 권한은 자녀의 이익을 위한 목적에 묶여 있습니다.',
      '민법 제1086조의 특별대리인 제도를 검토하고',
      '미성년후견인이 재산을 관리하는 경우에는 재산목록 작성, 증빙 보관, 수입과 지출의 분리, 법원에 대한 보고와 감독 규율이 적용될 수 있습니다.',
      '재산관리자의 편의를 자녀의 이익보다 앞세워서는 안 됩니다.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks cross-border connecting factors and the ordered practical checklist', () => {
    const requiredPhrases = [
      '당사자의 국적, 주소와 상거소, 사망 당시의 생활 근거지, 재산의 소재지, 외국에서 성립한 혼인이나 이혼, 기존 친권 재판',
      '대만 「섭외민사법률적용법」은 외국 요소가 있는 민사관계의 준거법을 정하는 출발점입니다.',
      '법원의 국제재판관할, 외국 재판의 승인과 집행, 조약이나 상대국 법률',
      '대만의 상속세 신고와 외국의 상속·증여세, 해외금융계좌 신고, 부동산 이전세',
    ];
    const orderedChecklistStarts = [
      '1. 사망진단서와 사망신고 자료, 가족관계와 대만 호적 자료',
      '2. 부동산, 예금, 투자자산, 사업 지분과 동산, 채권',
      '3. 유언 원본과 작성 방식, 유언능력',
      '4. 법정상속분과 부부 잔여재산 분배청구권을 분리하여 계산합니다.',
      '5. 미성년자에게 귀속되는 재산을 식별하고 법정대리권',
      '6. 법원의 상속포기·재산목록·후견·특별대리인 절차',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    let previousIndex = -1;
    for (const item of orderedChecklistStarts) {
      const index = parsed.content.indexOf(item);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
  });

  it('uses only the five official and three internal links, once each and in order', () => {
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
      expect(parsed.content.split(url)).toHaveLength(2);
    }
    for (const link of [...officialLinks, ...internalLinks]) {
      expect(raw.split(link)).toHaveLength(2);
    }
  });

  it('ends with the exact disclaimer and author and nothing else', () => {
    expect(raw.trimEnd()).toBe(
      `${raw.slice(0, raw.indexOf(disclaimer))}${disclaimer}\n\n${author}`,
    );
    expect(raw.trimEnd()).toMatch(
      /확인하시기 바랍니다\.\n\n\*\*증준외 변호사\(曾雋崴, Wei Tseng\)\*\*$/,
    );
  });

  it('freezes the visible eojeol count and calculated read time', () => {
    const publicText = extractPublicText(parsed.content);
    const visibleEojeolCount = publicText.split(/\s+/).filter(Boolean).length;
    const calculatedMinutes = Math.ceil(visibleEojeolCount / 180);

    expect(visibleEojeolCount).toBeGreaterThanOrEqual(1_200);
    expect(visibleEojeolCount).toBe(2_227);
    expect(calculatedMinutes).toBe(13);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}분 분량`);
    expect(post?.readTime).toBe(`${calculatedMinutes}분 분량`);
  });

  it('resolves the canonical and legacy alias slugs to identical Korean content', () => {
    expect(post).toBeDefined();
    expect(aliasPost).toBeDefined();
    expect(aliasPost?.slug).toBe(post?.slug);
    expect(aliasPost?.title).toBe(post?.title);
    expect(aliasPost?.content).toBe(post?.content);
    expect(aliasPost?.faq).toEqual(post?.faq);
  });

  it('removes named-party, media, speculative, private-detail, and overstatement language', () => {
    const serialized = JSON.stringify({
      raw,
      parsedContent: parsed.content,
      postTitle: post?.title,
      postContent: post?.content,
      postFaq: post?.faq,
    });
    const forbiddenLiterals = [
      '구준엽',
      '서희원',
      '왕소비',
      '서희제',
      '具俊曄',
      '徐熙媛',
      '汪小菲',
      '徐熙娣',
      'Koo Jun-yup',
      'Barbie Hsu',
      'Wang Xiaofei',
      'Dee Hsu',
      'クー・ジュンヨプ',
      '大S',
      'SBS',
      'SBS News',
      'SBS뉴스',
      'SBS新聞',
      'SBSニュース',
      'Harlem Yu',
      '합리적으로 추측',
      '유산은 대부분',
      '앞으로 두 가지 측면의 소송',
      '반대 소송',
      '유산을 횡령',
      '유산을 독차지',
      '두 자녀',
      '두 아이',
      '전학',
      '대만을 떠나',
      '미성년 자녀의 의사',
      '최소 변동의 원칙',
      '자동으로',
      '어떤 소송 절차도 필요 없이',
      '소송이 필요 없습니다',
      '법원의 관여가 필요 없습니다',
      '유일한 친권자',
      '단독 친권자',
      '가족은 반대할 수 없습니다',
      '반대 소송을 할 수 없습니다',
      '단독으로 자녀의 재산을 관리',
      '유언은 효력이 없습니다',
      '유언장이 효력이 없습니다',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(serialized).not.toContain(forbidden);
    }
    expect(serialized).not.toMatch(
      /구[\s·-]*준엽|서[\s·-]*희원|왕[\s·-]*소비|서[\s·-]*희제/u,
    );
    expect(serialized).not.toMatch(
      /Koo\s+Jun[-\s]?yup|Barbie\s+Hsu|Wang\s+Xiaofei|Dee\s+Hsu|Harlem\s+Yu/i,
    );
    expect(serialized).not.toMatch(
      /(?:^|[^A-Za-z])SBS(?:\s*News|뉴스|新聞|ニュース)?(?:[^A-Za-z]|$)/i,
    );
    expect(raw).not.toMatch(
      /(?:상속재산|유산)[^.。\n]*(?:약\s*)?\d[\d,.]*\s*(?:억|만|원|달러|신타이완달러)/,
    );
    expect(raw).not.toMatch(
      /(?:상속재산|유산)[^.。\n]*(?:대부분|혼인 전|혼인 후)[^.。\n]*(?:추정|추측|것으로 보|일 것)/,
    );
    expect(raw).not.toMatch(
      /(?:가족|친족|배우자|부모|자녀)[^.。\n]*(?:소송|분쟁|재판)[^.。\n]*(?:예상|예측|전망|가능성이 높|것으로 보)/,
    );
    expect(raw).not.toMatch(
      /(?:친권|양육권|양육자|친권자)[^.。\n]*(?:자동|소송[^.。\n]*필요\s*(?:없|않)|법원[^.。\n]*관여[^.。\n]*필요\s*(?:없|않))/,
    );
    expect(raw).not.toMatch(/유언[^.。\n]*(?:효력(?:이)?\s*없|무효)/);
    expect(raw).not.toMatch(
      /(?:부모|후견인)[^.。\n]*(?:자녀|미성년자)[^.。\n]*(?:재산|상속재산)[^.。\n]*(?:자유롭게|임의로|제한 없이|단독으로)[^.。\n]*(?:관리|사용|처분)할 수 (?:있습니다|있다|있음)(?:[.。!?]|$|\s)/,
    );
  });

  it('contains no invisible characters, wrong author, or cross-locale internal links', () => {
    expect(raw).not.toContain('\uFEFF');
    expect(raw).not.toContain('\u00A0');
    expect(raw).not.toContain('曾俊瑋');
    expect(raw).not.toMatch(/\]\(\/(?:ja|zh-hant|en)(?:\/|\))/);
  });
});
