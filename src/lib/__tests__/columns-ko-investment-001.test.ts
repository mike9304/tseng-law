import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns/001-taiwan-company-establishment-basics.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('taiwan-company-establishment-basics', 'ko');

const title =
  '대만 회사 설립 기초: 자회사·지점·대표사무소, 절차와 취업허가';
const entityFaqAnswer =
  '대만 자회사(유한회사·주식회사)는 대만법상 독립된 법인입니다. 외국회사의 대만 지점은 독립된 법인격이 없으며 외국회사의 일부로 대만에서 영업합니다. 대표사무소는 영리활동을 하는 사업장이 아니며 외국회사를 위한 법률행위와 연락 업무로 활동 범위가 제한됩니다. 책임, 세무, 인허가 및 정부조달 참여 자격은 조직 형태와 개별 사안에 따라 확인해야 합니다.';
const residenceFaqAnswer =
  '회사 설립만으로 취업허가나 거류자격을 취득할 수 있는 것은 아닙니다. 대만에서 회사를 관리·운영하는 외국인은 직무, 출자관계, 고용주의 사업실적 등에 관한 취업허가 요건을 충족해야 하며, 허가를 받은 뒤 체류 목적에 맞는 거류증을 별도로 신청해야 합니다.';
const capitalFaqAnswer =
  '회사 설립 자체에 일률적으로 적용되는 법정 최저자본금은 없습니다. 외국인투자사업의 외국 국적 책임자에 관한 취업허가에서는 회사 또는 지점 고용주가 설립 1년 미만이면 납입자본금 또는 대만 내 운영자금 50만 신타이완달러 이상 등 정해진 기준 중 하나가 원칙입니다. 다만 업종별 최저자본금, 사업계획의 합리성, 은행심사와 취업허가상 고용주 요건은 별도로 확인해야 합니다.';
// The body states these facts in their own paragraphs; the FAQ answers are no longer copied verbatim into it.
const capitalHeading = '### 최저자본금과 경영책임자 취업허가의 고용주 요건';
const capitalNoStatutoryMinimumParagraph =
  '최저자본금은 얼마일까요? 회사 설립 자체에 일률적으로 적용되는 법정 최저자본금은 없습니다. 다만 업종별 최저자본금, 사업계획의 합리성, 은행심사, 취업허가상 고용주 요건은 별도 확인이 필요합니다.';
// The employer-requirement figures now sit in two intro paragraphs, each followed by a bullet list.
const foreignManagerEmployerUnderOneYearParagraph =
  '금액 기준은 외국인투자사업의 외국 국적 책임자에 대한 취업허가에서 나옵니다. 대상은 화교 또는 외국인이 보유한 해당 사업의 주식 또는 출자액 합계가 발행주식 총수 또는 자본총액의 3분의 1을 초과하는 회사의 경영책임자(經理人), 외국회사의 대만 지점 경영책임자, 대표사무소 대표자 등입니다. 이 가운데 고용주인 회사 또는 지점이 설립 1년 미만이면 다음 중 하나를 충족하는 것이 원칙입니다.';
const foreignManagerEmployerUnderOneYearCriteria =
  '- 납입자본금 또는 대만 내 운영자금 50만 신타이완달러 이상\n- 매출액 300만 신타이완달러 이상\n- 수출입 실적 50만 미국달러 이상\n- 대리수수료 20만 미국달러 이상';
const foreignManagerEmployerOneYearOrMoreParagraph =
  '설립 1년 이상이면 대만 내 최근 1년 또는 최근 3년 평균을 기준으로 다음 중 하나를 충족하는 것이 원칙입니다.';
const foreignManagerEmployerOneYearOrMoreCriteria =
  '- 매출액 300만 신타이완달러 이상\n- 수출입 실적 50만 미국달러 이상\n- 대리수수료 20만 미국달러 이상';
const representativeOfficeAndArticle38Paragraph =
  '대표사무소는 설립 1년 이상인 경우 대만 내 업무실적이 필요합니다. 설립 1년 미만은 면제됩니다. 대만 경제 발전에 실질적으로 기여하거나 사정이 특별한 경우에는 특별 인정의 여지도 있습니다. [외국인 취업 자격·심사표준 제38조 제2항](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090031&flno=38)에 따르면, 같은 고용주가 이 경로로 2명 이상을 채용할 때 외국인과 고용주의 자격은 일반 기준(심사표준 제2장)에 따라 심사합니다.';

const faq = [
  {
    q: '대만에서 회사를 설립할 때 자회사·지점·대표사무소는 어떻게 다른가요?',
    a: entityFaqAnswer,
  },
  {
    q: '회사를 설립하면 대만 취업허가나 거류자격을 받을 수 있나요?',
    a: residenceFaqAnswer,
  },
  {
    q: '취업허가와 거류증을 받으려면 최소 자본금이 필요한가요?',
    a: capitalFaqAnswer,
  },
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

describe('Korean investment column 001 — company-establishment basics', () => {
  it('publishes the contracted frontmatter, H1, and exactly three FAQs', () => {
    expect(parsed.data.title).toBe(title);
    expect(parsed.data.url).toBe(
      'https://www.wei-wei-lawyer.com/post/taiwan-company-establishment-basics',
    );
    expect(parsed.data.lastmod).toBe('2026-10-12');
    expect(parsed.data.date_display).toBe('2025년 9월 13일');
    expect(parsed.data.categories).toEqual(['대만 법인설립']);
    expect(parsed.data.featured_image).toBe(
      '../images/001-taiwan-company-establishment-basics/featured-01.jpg',
    );
    expect(parsed.content).toContain(`# ${title}`);
    expect(parsed.data.faq).toEqual(faq);
    expect(parsed.data.faq).toHaveLength(3);

    expect(post?.slug).toBe('taiwan-company-establishment-basics');
    expect(post?.title).toBe(title);
    expect(post?.date).toBe('2026-10-12');
    expect(post?.dateDisplay).toBe('2025년 9월 13일');
    expect(post?.category).toBe('formation');
    expect(post?.categoryLabel).toBe('법인설립');
    expect(post?.featuredImage).toBe(
      '/images/blog/001-taiwan-company-establishment-basics/featured-01.jpg',
    );
    expect(post?.faq).toEqual(faq);
  });

  it('keeps each FAQ answer in the front matter only, with its facts stated in the body', () => {
    for (const answer of [entityFaqAnswer, residenceFaqAnswer, capitalFaqAnswer]) {
      expect(parsed.content).not.toContain(answer);
      expect(post?.content ?? '').not.toContain(answer);
    }

    const bodyParagraphs = [
      capitalNoStatutoryMinimumParagraph,
      foreignManagerEmployerUnderOneYearParagraph,
      foreignManagerEmployerUnderOneYearCriteria,
      foreignManagerEmployerOneYearOrMoreParagraph,
      foreignManagerEmployerOneYearOrMoreCriteria,
      representativeOfficeAndArticle38Paragraph,
    ];
    for (const paragraph of bodyParagraphs) {
      expect(parsed.content.split('\n\n')).toContain(paragraph);
      expect((post?.content ?? '').split('\n\n')).toContain(paragraph);
    }
    expect(firstParagraphAfter(parsed.content, capitalHeading)).toBe(
      capitalNoStatutoryMinimumParagraph,
    );
    expect(firstParagraphAfter(post?.content ?? '', capitalHeading)).toBe(
      capitalNoStatutoryMinimumParagraph,
    );
  });

  it('uses five ordered sections, the official-sources section, and the ten-item qualified establishment overview', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual([
      '자회사, 지점, 대표사무소의 차이',
      '자회사 설립 절차: 예비심사에서 세적등록까지',
      '업종 인허가와 영업장소',
      '취업허가, 거류증, 자본금',
      '세금과 대만–한국 소득세협정',
      '공식 자료',
    ]);

    const processSection = parsed.content
      .split('## 자회사 설립 절차: 예비심사에서 세적등록까지')[1]
      ?.split('## 업종 인허가와 영업장소')[0] ?? '';
    expect(
      Array.from(processSection.matchAll(/^(\d+)\. (.+)$/gm), (match) => [
        match[1],
        match[2],
      ]),
    ).toEqual([
      ['1', '회사 중문명과 영업항목 예비심사'],
      [
        '2',
        '위임장 등 외국문서의 공증·인증 및 필요한 경우 대만 재외기관 인증',
      ],
      [
        '3',
        '경제부 투자심의사(經濟部投資審議司) 투자 신청(해당하는 경우)',
      ],
      ['4', '회사설립 준비계좌 개설'],
      ['5', '국외 투자자금 송금'],
      ['6', '투자액 심사확정(投資額審定)'],
      ['7', '회사설립등기'],
      ['8', '세적등록'],
      ['9', '준비계좌의 정식계좌 전환'],
      [
        '10',
        '수출입·업종별 인허가·취업허가·거류 등 추가절차(해당하는 경우)',
      ],
    ]);
    expect(processSection).toContain(
      '순서·필요성·기간은 조직 형태, 투자액, 업종, 심사 내용, 은행 절차의 진행 상황과 보정 여부에 따라 달라집니다.',
    );
    expect(processSection).toContain(
      '조직 형태, 투자액, 업종, 심사 내용, 은행 절차의 진행 상황과 보정',
    );
    expect(processSection).toContain(
      '투자자의 국적과 개인·법인 여부에 따라',
    );
  });

  it('states the entity, treaty, PE, work, residence, address, and tax qualifications', () => {
    const requiredPhrases = [
      '대만 자회사(有限公司·股份有限公司)는 본점과 구별되는 독립 법인',
      '지점에는 주주를 두지 않습니다.',
      '지점의 채무와 책임은 본점이 부담합니다.',
      '판매나 용역 제공 같은 영업활동은 대만에서 할 수 없습니다.',
      '2023년 12월 27일 발효되었습니다. 적용은 2024년 1월 1일부터입니다.',
      '배당·이자·사용료에 대한 원천지국 상한세율은 각각 10%',
      '관리장소·지점·사무소 등 고정 시설',
      '6개월을 초과하는 공사',
      '어느 12개월 중 합산 183일을 초과하는 용역',
      '계약체결 권한을 반복적으로 행사하는 대리인',
      '183일이라는 숫자 하나만으로는 고정사업장이 성립하는지, 사업이익이 과세되는지를 판단해서는 안 됩니다.',
      '외국투자가 가능한 업종은 많지만',
      '그 업종에 필요한 별도 허가를 이미 받았다는 뜻도, 예정 장소에서 바로 영업할 수 있다는 뜻도 아닙니다.',
      '회사명과 영업항목 예비심사, 회사설립등기, 세적등록, 업종별 인허가는 목적이 각각 다릅니다.',
      '토지사용구분, 건축관리, 임대차 조건, 세적등록 적합성',
      '타이베이시는 적용 대상인 회사·상업등기에 대해 [영업장소 사전조회(營業場所預先查詢) 제도](/ko/columns/taiwan-company-setup-pitch-location)',
      '학생도 투자와 회사설립을 신청할 수 있습니다.',
      '투자자나 주주가 되었다고 해서 현재의 체류자격으로 대만에서 일하거나 회사를 경영할 수 있는 것은 아닙니다.',
      '외국 국적 경영책임자 취업허가를 위한 고용주 요건',
      '이 기준을 채웠다고 취업허가가 자동으로 나오지는 않습니다.',
      '배우자와 미성년 자녀는 요건을 갖추면 의친거류를 따로 신청할 수 있고',
      '가족 거류자격은 자동이 아닙니다.',
      '5년 연속 합법적으로 거류하고 매년 183일 이상 체류',
      '외국전문인력 등에는 다른 산정기준',
      '품행, 자산·기능 등 다른 법정요건',
      '영업세의 일반세율은 5%입니다. 신고는 통상 2개월마다 합니다.',
      '영리사업소득세의 일반세율은 20%',
      '비거주자에게 지급하는 배당에 대한 대만 국내법상 원천징수율은 21%',
      '협정의 적용 요건을 충족하면 배당·이자·사용료에 대한 원천지국 상한세율은 각각 10%입니다.',
      '같은 고용주가 이 경로로 2명 이상을 채용할 때 외국인과 고용주의 자격은 일반 기준(심사표준 제2장)에 따라 심사합니다',
      '[외국인 취업 자격·심사표준 제38조 제2항](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090031&flno=38)',
      '대표사무소는 설립 1년 이상인 경우 대만 내 업무실적이 필요합니다. 설립 1년 미만은 면제됩니다.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }

    // The treaty facts are stated once, in section 5, and the dividend-withholding source keeps its label.
    expect(parsed.content.match(/2023년 12월 27일/g)).toHaveLength(1);
    expect(parsed.content.match(/고정사업장\(PE\)/g)).toHaveLength(1);
    expect(
      parsed.content
        .split('## 세금과 대만–한국 소득세협정')[1]
        ?.split('## 공식 자료')[0],
    ).toContain('2023년 12월 27일 발효되었습니다. 적용은 2024년 1월 1일부터입니다.');
    expect(raw).toContain(
      '[비거주자 배당 원천징수율 관련 규정](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340028&flno=3)',
    );
  });

  it('uses all twelve official sources and only the six contracted internal links', () => {
    const officialSources = [
      'https://law.moea.gov.tw/EngLawContent.aspx?id=10484&lan=E',
      'https://mnscdn.moea.gov.tw/Mns/dir/content/Content.aspx?menu_id=42885',
      'https://gcis.nat.gov.tw/mainNew/English/index.jsp',
      'https://ws.wda.gov.tw/Download.ashx?n=VGhlIERpcmVjdG9yIG9yIE1hbmFnZXIgb2YgYW4gQXBwcm92ZWQgQnVzaW5lc3MgSW52ZXN0ZWQgb3IgRXN0YWJsaXNoZWQgYnkgT3ZlcnNlYXMgQ2hpbmVzZSBvciBGb3JlaWduZXIocykoU09QIE1hbnVhbCkucGRm&u=LzAwMS9VcGxvYWQvMzIxL3JlbGZpbGUvMC8yNTE1LzUzMWMyZTM0LTI1NmYtNGI5MC1iMzAzLTEzNWI4MTQxYTk5MC5wZGY%3D',
      'https://www.mof.gov.tw/eng/singlehtml/f48d641f159a4866b1d31c0916fbcc71?cntId=e1e57a4211474ff9b5d63a83b30dcf10',
      'https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340028&flno=3',
      'https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/business-tax/collection-prcedure/oVL9pwM',
      'https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/profit-seeking-enterprise-income-tax/file-payment/62nOrYR',
      'https://www.etax.nat.gov.tw/etwmain/alien-tax-service/alien-tax-faq/KK9Y76o',
      'https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090031&flno=38',
      'https://www.immigration.gov.tw/5475/5478/141465/141808/411648/cp_news',
      'https://www.businesslocationinfo.gov.taipei/BLBQS/Home/Notice',
    ];
    for (const source of officialSources) {
      expect(raw).toContain(source);
    }

    const internalLinks = Array.from(
      raw.matchAll(/\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[0],
    );
    expect(internalLinks).toEqual([
      '[조직 형태를 비교할 때에는](/ko/columns/taiwan-company-subsidiary-vs-branch)',
      '[영업장소 사전조회(營業場所預先查詢) 제도](/ko/columns/taiwan-company-setup-pitch-location)',
      '[영구거류를 신청하려면](/ko/columns/taiwan-permanent-residence-aprc)',
      '[대만 투자·회사설립 서비스](/ko/services/investment)',
      '[증준외 변호사 프로필](/ko/lawyers/wei-tseng)',
      '[상담 문의](/ko/contact)',
    ]);
  });

  it('preserves all five images, the disclaimer and author, and substantial Korean copy', () => {
    for (const imagePath of [
      '../images/001-taiwan-company-establishment-basics/featured-01.jpg',
      '../images/001-taiwan-company-establishment-basics/img-01.jpg',
      '../images/001-taiwan-company-establishment-basics/img-02.jpg',
      '../images/001-taiwan-company-establishment-basics/img-03.jpg',
      '../images/001-taiwan-company-establishment-basics/img-04.jpg',
    ]) {
      expect(raw).toContain(imagePath);
    }

    expect(raw).toContain(
      '이 글은 대만 회사 설립과 관련 제도를 일반적으로 설명하는 교육 목적의 자료이며, 개별 사안에 대한 법률·세무 자문이 아닙니다. 투자 구조, 업종, 신청인의 국적·체류자격, 주무기관의 최신 실무에 따라 필요한 절차와 결과가 달라질 수 있습니다. 투자·계약·고용을 실행하기 전에 최신 공식 자료와 개별 사정을 확인하시기 바랍니다.',
    );
    expect(raw.trimEnd()).toMatch(
      /확인하시기 바랍니다\.\n\n증준외 변호사\(曾雋崴, Wei Tseng\)$/,
    );
    expect(raw.match(/[\uac00-\ud7af]/g)?.length ?? 0).toBeGreaterThan(3_000);
    expect(raw.length).toBeGreaterThan(8_000);
    expect(post?.content.length).toBeGreaterThan(6_000);
  });

  it('derives read_time from the exact visible public eojeol count at 180 per minute', () => {
    const publicText = extractPublicText(post?.content ?? '');
    const eojeolCount = publicText.split(/\s+/).filter(Boolean).length;
    const calculatedMinutes = Math.ceil(eojeolCount / 180);

    expect(eojeolCount).toBe(1_296);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}분 분량`);
    expect(post?.readTime).toBe(`${calculatedMinutes}분 분량`);
  });

  it('resolves the canonical and alias slugs in Korean', () => {
    expect(post?.slug).toBe('taiwan-company-establishment-basics');
    expect(getColumnPost('company-basics', 'ko')?.slug).toBe(
      'taiwan-company-establishment-basics',
    );
  });

  it('removes stale claims, unsafe promises, wrong locale links, and invisible spaces', () => {
    const forbiddenLiterals = [
      'KOTRA',
      '107개',
      '교역 순위',
      '29억',
      '17억',
      '간장게장',
      '한국 카페',
      '한복',
      '😁',
      '투자심사위원회',
      '투자심의위원회',
      '투심위',
      '10단계가 있습니다',
      '3개월',
      '1대만 달러로도 가능',
      '단일 주주 기준 최소 50만',
      '대만 파트너가 있으면',
      '약 17만',
      '한국 기업이 100% 소유해야',
      '2023년 12월 2일',
      '배우자와 미성년 자녀는 가족으로 대만에 거주할 수 있습니다.',
      '댓글',
      'DM',
      '빠르게 답변',
      '曾俊瑋',
      '/ja/',
      '/zh-hant/',
      '/en/',
      '\uFEFF',
      '\u00A0',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(raw).not.toContain(forbidden);
    }
    expect(raw).not.toMatch(/183일[^.。\n]*(?:영업이익|사업이익)[^.。\n]*면세/);
    expect(raw).not.toMatch(/회사\s*설립[^.。\n]*(?:비자|거류)[^.。\n]*(?:자동|가능합니다)/);
    expect(raw).not.toMatch(/5년[^.。\n]*자동[^.。\n]*(?:영주|영구거류)/);
    expect(raw).not.toMatch(/거류증[^.。\n]*취업허가[^.。\n]*같은 기간/);
    expect(raw).not.toMatch(/개인소득세[^.。\n]*5%부터/);
  });
});
