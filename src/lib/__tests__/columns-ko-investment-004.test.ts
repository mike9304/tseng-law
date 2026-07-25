import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns/004-taiwan-company-subsidiary-vs-branch.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('taiwan-company-subsidiary-vs-branch', 'ko');
const aliasPost = getColumnPost('subsidiary-vs-branch', 'ko');

const title = '대만 진출: 자회사와 지점의 차이';
const featuredImage =
  '../images/004-taiwan-company-subsidiary-vs-branch/featured-01.jpg';
const inlineImage =
  '../images/004-taiwan-company-subsidiary-vs-branch/img-01.jpg';
const faq1Answer =
  '지점은 외국회사의 일부이므로 지점 자체에 주주는 존재하지 않습니다. 제3자와 대만 사업에 공동 출자하려면 대만 자회사를 설립하여 주주 구성을 정하는 방법 등을 검토해야 합니다. 책임, 의결권, 자금조달, 인허가와 세무는 출자관계와 사업계획에 따라 확인해야 합니다.';
const faq2Answer =
  '자회사와 지점은 일반적으로 영업세 5%와 영리사업소득세 20%의 적용을 받습니다. 대만 자회사가 국외 모회사에 배당할 때 대만 국내법상 원천징수율은 21%이나, 대만–한국 소득세협정의 적용요건을 충족하면 상한세율은 10%입니다. 외국회사의 대만 지점이 세후 이익을 본점에 송금하는 것은 배당이 아니므로 원칙적으로 추가 원천징수가 없습니다. 본점이 대만 밖에 있는 영리사업자는 미분배이익에 대한 5% 추가세액의 신고대상에서 제외됩니다.';
const faq3Answer =
  '지점은 독립된 발행회사가 아니므로 대만에서 상장 주체가 될 수 없습니다. 자회사가 상장하려면 회사법과 증권거래소의 소정 요건을 충족해야 합니다. 세제 혜택은 조직 형태만으로 일률적으로 결정되지 않습니다. 「산업혁신조례」 제10조의1의 투자세액공제 등은 대상 투자, 신청기한, 공제방법, 중복 적용과 세액 한도를 개별적으로 확인해야 합니다.';
const disclaimer =
  '이 글은 대만 자회사와 외국회사 지점의 일반적인 차이를 설명하기 위한 교육 목적의 자료이며, 개별 사안에 대한 법률·세무 자문이 아닙니다. 적용되는 법령과 세무처리는 투자자와 본점의 소재지, 사업 내용, 거래와 자금 흐름, 협정 적용요건 및 주무기관의 최신 실무에 따라 달라질 수 있으므로, 설립·투자·계약·배당 또는 송금을 실행하기 전에 최신 공식 자료와 개별 사정을 확인하시기 바랍니다.';
const author = '**증준외 변호사(曾雋崴, Wei Tseng)**';

const faq = [
  {
    q: '대만 지점에 대만인이나 대만 법인을 주주로 참여시킬 수 있나요?',
    a: faq1Answer,
  },
  {
    q: '대만 자회사와 대만 지점의 세금 부담은 어떻게 다른가요?',
    a: faq2Answer,
  },
  {
    q: '대만에서 상장하거나 투자세액공제를 받으려면 자회사와 지점 중 어떤 형태를 선택해야 하나요?',
    a: faq3Answer,
  },
];

const officialLinks = [
  '[대만 법무부 법령정보 — 회사법](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080001)',
  '[대만 법무부 법령정보 — 영업세법 제10조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=10&pcode=G0340080)',
  '[대만 법무부 법령정보 — 소득세법](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=G0340003)',
  '[대만 재정부 — 국외 주주 배당 원천징수 안내](https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/individual-income-tax/withheld-rule/rule/3AmWR0R)',
  '[대만 재정부 — 외국회사 지점이익 관련 해석](https://law-out.mof.gov.tw/LawContent.aspx?id=GL002917)',
  '[대만 재정부 — 미분배이익 신고 제외 안내](https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/profit-seeking-enterprise-income-tax/undistributed-surplus-earnings/om7pAeL)',
  '[대만 재정부 — 대만–한국 소득세협정 안내](https://www.mof.gov.tw/singlehtml/384fb3077bb349ea973e7fc6f13b6974?cntId=127fffb302f24987b0bbf1eff78ff9c9)',
  '[대만 법무부 법령정보 — 산업혁신조례 제10조의1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=10-1&pcode=J0040051)',
  '[대만증권거래소 — 상장기준](https://www.twse.com.tw/zh/listed/method/standars.html)',
  '[Invest Taiwan — 외국회사 지점 투자·등기 절차](https://investtaiwan.nat.gov.tw/showPageengInvestmentStatus01?lang=eng&menuNum=7&search=InvestmentStatus01)',
];
const internalLinks = [
  '[대만 투자·회사설립 서비스](/ko/services#investment)',
  '[대만 회사 설립 기초](/ko/columns/taiwan-company-establishment-basics)',
  '[상담 문의](/ko/contact)',
];
const nativeReviewCorrections = [
  '이자, 사용료, 서비스 대가, 자산 대금 또는 제3자에 대한 지급이 섞여 있다면 각 지급의 실질과 원천징수 의무를 따로 판단해야 합니다.',
  '지점은 대만 영업에 귀속되는 수익과 비용을 구분하고 본점 공통 비용의 배분 근거를 마련해야 합니다. 본점과 지점 간 내부거래의 회계 표시와 세무상 귀속도 검토해야 합니다.',
  '인감과 전자서명 권한, 지출 승인, 고객 확인, 세액 계산과 신고, 규제 보고, 사고 발생 시 보고 체계를 명확히 하면 조직 형태가 제공하는 법적 구분을 실제 운영에서도 유지하기 쉽습니다.',
  '계약서, 세무 증빙, 지급 증빙, 자산 명세, 기술 내용, 사용 계획과 신청 서류가 법정 범위와 절차에 맞는지 개별적으로 점검해야 합니다.',
  '장소, 기간, 인력, 계약 협상과 체결 권한, 재고나 설비, 고객 등 거래 상대방에게 드러나는 영업 형태를 모두 확인해야 합니다.',
  '자회사와 지점 중 어느 하나가 모든 대만 진출에 우월한 것은 아닙니다. 독립된 대만 법인과 현지 주주 구조가 필요한 사업이라면 자회사가 적합할 수 있고, 외국회사가 대만 영업을 직접 수행하면서 본점의 통제를 유지하려는 사업이라면 지점 구조가 적합할 수 있습니다. 다만 설립이 가능하다는 판단과 영업·세무·철수까지 고려할 때 효율적인 구조인지에 관한 판단은 구별해야 합니다.',
  '대만 진출 초기에는 예상 매출이 적고 인력과 계약 건수가 많지 않더라도 향후 계획을 함께 반영해야 합니다.',
  '분쟁 가능성이 있는 계약과 보증, 세무조사 가능 기간, 기록 보존 의무도 확인해야 합니다.',
  '청산 담당자의 선임, 채권자 통지, 신고와 잔여자금 처리도 최신 절차에 맞추어야 합니다.',
];

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

describe('Korean investment column 004 — subsidiary versus branch', () => {
  it('publishes the exact frontmatter, H1, and three FAQs', () => {
    expect(parsed.data).toEqual({
      title,
      url: 'https://www.wei-wei-lawyer.com/post/taiwan-company-subsidiary-vs-branch',
      lastmod: '2026-07-25',
      date_display: '2025년 9월 13일',
      read_time: '18분 분량',
      categories: ['대만 법인설립'],
      featured_image: featuredImage,
      faq,
    });
    expect(parsed.data.faq).toHaveLength(3);
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);

    expect(post).toMatchObject({
      slug: 'taiwan-company-subsidiary-vs-branch',
      title,
      date: '2026-07-25',
      dateDisplay: '2025년 9월 13일',
      readTime: '18분 분량',
      category: 'formation',
      categoryLabel: '법인설립',
      featuredImage:
        '/images/blog/004-taiwan-company-subsidiary-vs-branch/featured-01.jpg',
      faq,
    });
  });

  it('preserves both images with the exact alt treatment', () => {
    expect(parsed.content).toContain(
      `![대만 자회사와 외국회사 지점을 비교하는 대표 이미지](${featuredImage})`,
    );
    expect(parsed.content).toContain(`![](${inlineImage})`);
    expect(raw.split(featuredImage)).toHaveLength(3);
    expect(raw.split(inlineImage)).toHaveLength(2);
  });

  it('repeats each exact FAQ answer as the first paragraph after its assigned H2', () => {
    const headingAnswers = [
      ['## 1. 법인격과 출자 구조', faq1Answer],
      ['## 2. 세무와 이익 송금', faq2Answer],
      ['## 4. 자금조달과 대만 상장', faq3Answer],
    ];

    for (const [heading, answer] of headingAnswers) {
      expect(firstParagraphAfter(parsed.content, heading)).toBe(answer);
      expect(firstParagraphAfter(post?.content ?? '', heading)).toBe(answer);
      expect(raw.split(answer)).toHaveLength(3);
    }
  });

  it('uses exactly the nine ordered H2 sections', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual([
      '1. 법인격과 출자 구조',
      '2. 세무와 이익 송금',
      '3. 채무와 법적 책임',
      '4. 자금조달과 대만 상장',
      '5. 투자세액공제',
      '6. 대만–한국 소득세협정과 고정사업장(PE)',
      '7. 어떤 형태를 선택할 것인가',
      '공식 자료',
      '관련 안내',
    ]);
  });

  it('locks the company-law identity, capital, liability, and branch-exit rules', () => {
    const requiredPhrases = [
      '대만 회사법 제1조는 회사법에 따라 조직·등기·설립되고 영리를 목적으로 하는 법인을 회사로 정합니다.',
      '유한회사 주주는 회사법 제99조 제1항에 따라 원칙적으로 출자액을 한도로 회사에 대한 책임을 부담합니다.',
      '제99조 제2항은 주주가 법인격을 남용하여 회사가 특정 채무를 변제하기 어렵게 하고 그 남용이 중대할 때 필요한 범위에서 책임을 부담할 수 있는 예외를 둡니다.',
      '회사법 제371조에 따르면 외국회사는 지점등기를 하지 않고 외국회사 명의로 대만에서 영업할 수 없습니다.',
      '제372조에 따라 외국회사는 대만 지점의 영업에 전용할 자금을 배정하고 대만 내 책임자를 지정해야 합니다.',
      '지점은 외국회사와 별도 법인이 아니므로 대만 지점의 채무는 외국회사의 채무입니다.',
      '모회사 보증',
      '이사, 관리자와 대만 책임자의 의무',
      '회사법 제378조에 따라 지점등기 말소를 신청해야 합니다.',
      '회사법 제379조에 따르면 지점등기의 말소는 채권자의 권리와 외국회사의 의무에 영향을 주지 않습니다.',
      '회사법 제380조에 따라 대만 내 영업과 지점에서 발생한 권리·의무를 청산해야 합니다.',
      '청산 뒤에도 갚지 못한 채무는 외국회사가 계속 부담합니다.',
      '대만 자회사는 독립 법인이므로 외국회사 지점의 등기 말소가 아니라 회사법상 해산·청산 절차를 밟습니다.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks the qualified tax rates, remittance, undistributed-profit, and cross-border analysis', () => {
    const requiredPhrases = [
      '일반세율은 5%이고 통상 2개월을 한 과세기간으로 신고합니다.',
      '과세소득이 법정 기준금액을 넘는 경우 일반세율은 20%입니다.',
      '국외 주주에 지급하는 배당의 원천징수율은 21%입니다.',
      '협정상 상한세율 10%를 검토할 수 있습니다.',
      '협정세율은 수령인이 한국에 있다는 사실만으로 자동 적용되는 것이 아닙니다.',
      '거주자증명서, 수익적 소유자 판단',
      '세후 지점이익을 본점에 송금하는 행위는 배당과 구별되고, 지점 단계에서는 원칙적으로 추가 배당 원천징수가 없습니다.',
      '대만 자회사가 이익을 유보하면 소득세법 제66조의9에 따른 5% 미분배이익 추가세액이 문제될 수 있습니다.',
      '본점이 대만 밖에 있는 영리사업자는 해당 미분배이익 신고대상에서 제외됩니다.',
      '본점과 지점 간 내부거래의 회계 표시와 세무상 귀속',
      '이전가격 원칙',
      '외국납부세액공제',
      '지점을 선택하면 한국 모회사의 세부담이 줄어든다고 미리 결론 내릴 수 없습니다.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks the financing, listing, and investment-tax-credit qualifications', () => {
    const requiredPhrases = [
      '지점에는 자체 주식이나 지분이 없으므로 이를 제3자에게 발행하여 지점의 주주로 참여시킬 수 없습니다.',
      '지분을 발행할 수 없다는 사실을 모든 형태의 자금조달이 불가능하다는 의미로 확대해서는 안 됩니다.',
      '대만 자회사가 존재한다는 이유만으로 상장자격이 자동으로 생기는 것도 아닙니다.',
      '설립기간, 자본, 수익성, 주식분산, 기업지배구조, 내부통제, 회계감사와 정보공개',
      '2025년 1월 1일부터 2029년 12월 31일까지',
      '100만 대만달러 이상 20억 대만달러 이하',
      '신품 스마트기계, 5G 시스템, 사이버보안 제품이나 서비스, 인공지능 제품이나 서비스, 에너지절감·탄소감축 관련 하드웨어, 소프트웨어, 기술 또는 기술서비스',
      '해당 연도 투자액의 최대 5%',
      '투자액의 최대 3%를 3년 동안 매년 공제',
      '해당 연도 영리사업소득세액의 30%가 한도',
      '제10조의 연구개발 관련 공제와 제10조의1의 특정 설비·기술 투자 공제를 혼동하면',
      '단순히 자회사라는 이유만으로 혜택이 보장되지 않고, 지점이라는 이유만으로 모든 세제 지원에서 배제된다고 단정할 수도 없습니다.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks the treaty dates, rates, PE categories, and separate tests', () => {
    const requiredPhrases = [
      '2021년 11월 17일 서명',
      '2023년 12월 27일 발효',
      '2024년 1월 1일부터 적용',
      '협정상 배당, 이자와 사용료의 상한세율은 각각 10%입니다.',
      '상대방 지역에 협정상 고정사업장(PE)을 두지 않은 경우 원칙적으로 상대방 지역에서 면세됩니다.',
      '관리장소, 지점, 사무소 등 고정시설',
      '6개월을 초과하면 공사 고정사업장',
      '어느 12개월 기간에 합계 183일을 초과하여 용역을 제공하면',
      '계약체결권을 반복적으로 행사하는 대리인',
      '대만의 고정시설 고정사업장에 해당하므로 지점의 대만 사업이익이 당연히 면세된다고 볼 수 없습니다.',
      '각 기준은 서로 다른 활동유형을 다룹니다.',
      '자회사와 고정사업장도 같은 개념이 아닙니다.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses each exact official and internal link once in the contracted order', () => {
    const markdownLinks = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g),
      (match) => match[0],
    );

    expect(markdownLinks).toEqual([...officialLinks, ...internalLinks]);
    for (const link of [...officialLinks, ...internalLinks]) {
      expect(raw.split(link)).toHaveLength(2);
    }
  });

  it('ends with the exact disclaimer and author, with nothing after the author', () => {
    expect(parsed.content).toContain(disclaimer);
    expect(raw.trimEnd()).toBe(
      `${raw.slice(0, raw.indexOf(disclaimer))}${disclaimer}\n\n${author}`,
    );
    expect(raw.trimEnd()).toMatch(
      /확인하시기 바랍니다\.\n\n\*\*증준외 변호사\(曾雋崴, Wei Tseng\)\*\*$/,
    );
  });

  it('freezes the visible Korean eojeol count and calculated read time', () => {
    const publicText = extractPublicText(parsed.content);
    const visibleEojeolCount = publicText.split(/\s+/).filter(Boolean).length;
    const calculatedMinutes = Math.ceil(visibleEojeolCount / 180);

    expect(visibleEojeolCount).toBeGreaterThanOrEqual(1_800);
    expect(visibleEojeolCount).toBe(3_199);
    expect(calculatedMinutes).toBe(18);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}분 분량`);
    expect(post?.readTime).toBe(`${calculatedMinutes}분 분량`);
  });

  it('resolves the canonical and alias slugs to identical Korean content', () => {
    expect(aliasPost).toBeDefined();
    expect(aliasPost?.slug).toBe(post?.slug);
    expect(aliasPost?.title).toBe(post?.title);
    expect(aliasPost?.content).toBe(post?.content);
    expect(aliasPost?.faq).toEqual(post?.faq);
  });

  it('removes stale claims, wrong locales, promises, and invisible characters', () => {
    const forbiddenLiterals = [
      '대만 회사설립 자화사 VS 지사',
      '자화사',
      '한국 기업이 100% 소유',
      '지사의 주주가 될 수 없다',
      '외국인소득세',
      '추가 세금이 전혀 없다',
      '혁신적 R&D 지출이면 자동으로 세액의 30%를 공제',
      '2023년 12월 2일',
      '댓글이나 DM',
      '빠르게 답변',
      '曾俊瑋',
      '/ja/',
      '/zh-hant/',
      '/en/',
      '\uFEFF',
      '\u00A0',
      '\u200B',
      '포를 보시죠',
      '서비스대가, 자산대금 또는 제3자 지급',
      '본점 공통비용의 배분근거',
      '본지점 간 내부거래의 회계표시',
      '고객확인, 세금계산과 신고',
      '세금계산 자료, 지급증빙, 자산명세',
      '고객 상대방에게 보이는 영업형태',
      '지점의 특징이 맞을 수 있습니다',
      '예상 매출, 인력과 계약 수가 작더라도',
      '세금조사 기간, 기록 보존의무',
      '필요한 청산 담당자, 채권자 통지, 신고와 잔여자금의 처리',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(raw).not.toContain(forbidden);
    }
    for (const correction of nativeReviewCorrections) {
      expect(raw).toContain(correction);
      expect(post?.content).toContain(correction);
    }

    expect(raw).not.toMatch(/지점[^.。\n]*(?:100% 소유|대만인[^.。\n]*주주가 될 수 없)/);
    expect(raw).not.toMatch(/(?:자회사|지점)[^.。\n]*(?:항상|반드시)[^.。\n]*(?:세금|세부담)[^.。\n]*(?:높|낮|줄)/);
    expect(raw).not.toMatch(
      /자회사[^.。\n]*모든[^.。\n]*(?:책임|위험)[^.。\n]*(?:차단|제거)(?:됩니다|할 수 있습니다)/,
    );
    expect(raw).not.toMatch(/(?:183일|12개월)[^.。\n]*(?:하나|만으로)[^.。\n]*PE/);
    expect(raw.match(/지사/g)).toHaveLength(1);
  });
});
