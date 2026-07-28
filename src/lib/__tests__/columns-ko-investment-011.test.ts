import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost(
  'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
  'ko',
);

function extractBodyContracts(content: string) {
  return Array.from(
    content.matchAll(/^## \d+\. (.+)\n\n([^\n]+)$/gm),
    (match) => ({
      heading: match[1],
      answer: match[2],
    }),
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

const title =
  '대만 화장품 시장 진출: 수입 주체 선택, 제품등록, PIF 작성·보관과 광고 규제';

const faq = [
  {
    q: '대만에서 화장품을 판매하려면 자회사나 지점을 반드시 설립해야 하나요?',
    a: '반드시 설립해야 하는 것은 아닙니다. 대만 수입업자(판매대리점을 겸하는 경우 포함)에게 수입·판매를 맡기는 방식도 가능합니다. 직접 대만 사업을 운영하려면 대만 자회사와 외국회사 지점의 설립·등기, 책임과 세무 구조가 서로 다르고, 외국인투자 허가와 회사·지점 등기에 필요한 기간도 사건과 보정 여부에 따라 달라집니다. 먼저 사업모델과 화장품 제조·수입업자로서 책임을 맡을 주체를 정해야 합니다.',
  },
  {
    q: 'PIF는 무엇이며 TFDA 제품등록과 같은 절차인가요?',
    a: '같은 절차가 아닙니다. 제품등록은 TFDA 화장품 제품등록 플랫폼에서 진행하는 별도의 절차입니다. PIF는 품질, 안전성, 조성, 표방 기능, 제조방법, 시험결과와 안전성 평가 등에 관한 자료를 모아 화장품 제조·수입업자가 작성·갱신·보관하는 파일이며, PIF 자체를 TFDA에 사전 제출하는 제도는 아닙니다. 2026년 7월 1일부터 원칙적으로 모든 화장품이 PIF 제도의 적용대상이 되며, 공장등록이 면제되는 제조장소에서 제조한 고형 수제비누는 예외입니다.',
  },
  {
    q: '대만 화장품 광고에서는 어떤 표현을 주의해야 하나요?',
    a: '광고는 문구뿐 아니라 명칭, 문자, 이미지, 기호, 음성 등 전체 표현을 기준으로 판단합니다. 허위·과대 표현과 의료적 효능 표방은 금지되며, 여드름 치료, 항염, 살균 등 의료적 표현에 특히 유의해야 합니다. 행정상 과태료는 허위·과대광고의 경우 4만~20만 신타이완달러, 의료적 효능 표방의 경우 60만~500만 신타이완달러입니다. 인플루언서 등의 게시물도 실질이 광고라면 같은 기준으로 검토해야 합니다.',
  },
];

const bodyContracts = [
  {
    heading: '대만 진출 형태와 수입 주체의 선택',
    answer: faq[0].a,
  },
  {
    heading: '제품등록과 PIF는 별개의 제도',
    answer: faq[1].a,
  },
  {
    heading: '표시·홍보·광고 규제',
    answer: faq[2].a,
  },
];

describe('Korean investment column 011 — cosmetics registration, PIF, and advertising', () => {
  it('publishes the contracted frontmatter, H1, and exactly three exact FAQs', () => {
    expect(parsed.data.title).toBe(title);
    expect(parsed.data.url).toBe(
      'https://www.wei-wei-lawyer.com/post/taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
    );
    expect(parsed.data.lastmod).toBe('2026-07-25');
    expect(parsed.data.date_display).toBe('2026년 2월 4일');
    expect(parsed.data.read_time).toBe('9분 분량');
    expect(parsed.data.categories).toEqual(['대만 법인설립']);
    expect(parsed.data.featured_image).toBe(
      '../images/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide/featured-01.jpg',
    );
    expect(parsed.content).toContain(`# ${title}`);
    expect(parsed.data.faq).toHaveLength(3);
    expect(parsed.data.faq).toEqual(faq);

    expect(post?.slug).toBe(
      'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
    );
    expect(post?.title).toBe(title);
    expect(post?.date).toBe('2026-07-25');
    expect(post?.dateDisplay).toBe('2026년 2월 4일');
    expect(post?.readTime).toBe('9분 분량');
    expect(post?.category).toBe('formation');
    expect(post?.categoryLabel).toBe('법인설립');
    expect(post?.faq).toEqual(faq);
  });

  it('keeps all three numbered headings and immediate answers identical to the FAQs', () => {
    expect(extractBodyContracts(raw)).toEqual(bodyContracts);
    expect(extractBodyContracts(post?.content ?? '')).toEqual(bodyContracts);
  });

  it('distinguishes the importer, subsidiary, branch, current agency, and statutory actor', () => {
    const requiredPhrases = [
      '대만 수입업자 또는 판매대리점이 수입과 판매를 담당한다면 외국 브랜드가 자체 대만 자회사나 지점을 두지 않는 구조도 가능합니다.',
      '계약상 명칭만으로 법적 책임의 귀속이 결정되는 것은 아닙니다.',
      '대만 자회사와 외국회사 지점은 동일한 조직이 아닙니다.',
      '법인격과 본점의 책임, 회계·세무 처리, 이익 이전, 대표권',
      '경제부 투자심의사(經濟部投資審議司)',
      '특정한 고정 기간을 전제로 출시일을 확정',
      '화장품 제조·수입업자',
      '계약상 업무분담과 법령상 책임주체',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('separates TFDA product registration from PIF and locks registration timing and validity', () => {
    const requiredPhrases = [
      '제품등록은 TFDA 화장품 제품등록 플랫폼에서 진행하는 별도의 절차입니다.',
      '대상 제품을 공급·판매·증정·공개 전시하거나 소비자에게 시험 사용으로 제공하기 전에 제품등록을 완료',
      '제품등록의 유효기간은 3년입니다.',
      '유효기간이 끝나기 전 3개월 이내에 연장을 신청',
      '등록 완료가 PIF에 필요한 자료가 모두 갖추어졌다는 확인을 뜻하지 않으며',
      '제품 표시나 광고가 적법하다는 판단도 아닙니다.',
      'PIF 자체를 TFDA에 사전 제출하는 제도는 아닙니다.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('states the 16 PIF categories, full phase-in, limited soap exception, and retained responsibility', () => {
    const requiredPhrases = [
      '품질, 안전성, 조성, 표방 기능, 제조방법, 시험결과와 안전성 평가',
      '필요한 자료를 16개 범주로 구성',
      '2026년 7월 1일부터 남은 화장품도 적용대상에 포함되어 원칙적으로 모든 화장품에 적용',
      '공장등록이 면제되는 제조장소에서 제조한 고형 수제비누',
      '수제품이거나 비누라는 명칭을 사용한다는 이유만으로 제외되는 것은 아니며',
      '필요한 자격과 역량을 갖춘 제3자가 지원',
      '제3자의 작성 지원이나 자료 보관 서비스를 이용하더라도 화장품 제조·수입업자의 법적 책임은 유지',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks Article 7 retention, Article 8 storage address, retrieval, and change control', () => {
    const requiredPhrases = [
      '「화장품 제품정보파일 관리방법」 제7조에 따라 해당 제품을 시장에 마지막으로 공급한 날의 다음 날부터 최소 5년',
      '보관 장소는 같은 규정 제8조에 따라 「화장품위생안전관리법」 제7조 제1항 제7호에서 정한 화장품 제조·수입업자의 표시 주소',
      '기간을 정하는 조문과 장소를 정하는 조문을 구별',
      '원제조자가 원본을 보유하거나 안전한 전자 또는 클라우드 저장소를 이용',
      '완전한 자료에 접근',
      '자료를 신속히 검색·제시',
      '접근권한, 백업, 버전관리',
      '계약이 끝난 뒤에도 법정 보관기간 동안 자료가 유지',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('qualifies inspection notice and distinguishes false information, correction, and recall', () => {
    const requiredPhrases = [
      '원칙적으로 검사일 7일 전까지',
      '법정 예외에 해당하면 이러한 사전통지 없이 검사',
      '제품등록에 허위정보를 신고하거나 PIF에 허위정보를 기재',
      '1만~100만 신타이완달러의 행정상 과태료',
      '기한을 정해 시정을 명하고, 그 기한 안에 시정하지 않을 때 과태료',
      '회수나 폐기는 모든 PIF 자료 불비에 자동으로 뒤따르는 조치가 아닙니다.',
      '제품 안전성, 위반의 내용, 시정 상황과 각 조치에 적용되는 법정요건',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('states the whole-advertising test, medical examples, fine ranges, and influencer limit', () => {
    const requiredPhrases = [
      '상품명, 문장, 이미지, 기호, 음성, 앞뒤 맥락과 소비자가 받는 전체 인상',
      '여드름을 치료한다거나 항염 효과 또는 살균 작용',
      '허위·과대광고에 대한 행정상 과태료는 4만~20만 신타이완달러',
      '의료적 효능 표방에 대한 행정상 과태료는 60만~500만 신타이완달러',
      '내용과 상업적 맥락에 따라 실질이 광고로 판단될 수 있습니다.',
      '모든 개인 게시물이 자동으로 브랜드의 광고가 되는 것은 아니며',
      '게시자와 브랜드의 관계, 구체적인 내용과 브랜드의 관여 정도',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('keeps the six-step readiness order', () => {
    const readinessSection =
      parsed.content.split('### 판매 준비 확인 순서')[1]?.split('회사와 지점의 기본 구조')[0] ??
      '';
    const sequence = [
      '대만 자회사·지점을 직접 둘지 현지 수입업자에게',
      '화장품 제조·수입업자로서 법적 책임',
      '제품등록을 완료',
      '제품별 PIF를 작성',
      '전체 표현 기준으로 검토',
      '검사와 시정요구',
    ];
    const positions = sequence.map((step) => readinessSection.indexOf(step));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('uses all 13 official sources and exactly the three contracted Korean internal links', () => {
    const officialSources = [
      'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0030013',
      'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0030097',
      'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0030098',
      'https://www.fda.gov.tw/tc/newsContent.aspx?cid=3&id=30612',
      'https://www.fda.gov.tw/tc/newsContent.aspx?cid=3&id=30614',
      'https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f639179794512621908&iid=13384',
      'https://www.fda.gov.tw/TC/siteContent.aspx?sid=3435',
      'https://www.fda.gov.tw/TC/site.aspx?sid=12523',
      'https://law.moj.gov.tw/LawClass/LawAll.aspx?PCODE=L0030099',
      'https://law.moj.gov.tw/LawClass/LawGetFile.ashx?FileId=0000249593&lan=C',
      'https://www.mohw.gov.tw/cp-4256-48110-1.html',
      'https://investtaiwan.nat.gov.tw/showPage?lang=jpn&search=InvestmentStatus01',
      'https://mnscdn.moea.gov.tw/Mns/dir/content/Content.aspx?menu_id=42879',
    ];
    for (const source of officialSources) {
      expect(raw).toContain(source);
    }

    const internalLinks = Array.from(
      raw.matchAll(/\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[0],
    );
    expect(internalLinks).toEqual([
      '[대만 회사 설립 기초](/ko/columns/taiwan-company-establishment-basics)',
      '[대만 투자·회사설립 서비스](/ko/services#investment)',
      '[증준외 변호사 프로필](/ko/lawyers/wei-tseng)',
    ]);
  });

  it('preserves both images, exact ending, identity, and substantial Korean copy', () => {
    for (const imagePath of [
      '../images/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide/featured-01.jpg',
      '../images/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide/img-01.jpg',
    ]) {
      expect(raw).toContain(imagePath);
    }
    expect(parsed.content).toContain(
      '![대만 화장품 시장 진출에 필요한 제품 자료와 규제 검토](../images/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide/featured-01.jpg)',
    );
    expect(parsed.content).toContain(
      '![](../images/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide/img-01.jpg)',
    );
    expect(post?.featuredImage).toBe(
      '/images/blog/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide/featured-01.jpg',
    );
    expect(raw.trimEnd()).toMatch(
      /이 글은 대만의 화장품 시장 진출 관련 제도를 일반적으로 설명하기 위한 교육 목적의 자료이며, 개별 제품이나 광고에 대한 법률 의견, 허가·등록, 판매 가능성 또는 처리기간을 보장하지 않습니다\. 진출 형태, 제품 자료, 표시·광고 내용과 주무기관의 최신 실무를 개별 사안별로 확인하시기 바랍니다\.\n\n\*\*증준외 변호사\(曾雋崴, Wei Tseng\)\*\*$/,
    );
    expect(raw.match(/[\uac00-\ud7af]/g)?.length ?? 0).toBeGreaterThan(3_000);
    expect(raw.length).toBeGreaterThan(8_000);
    expect(post?.content.length).toBeGreaterThan(6_000);
  });

  it('derives read_time from the exact visible public eojeol count at 180 per minute', () => {
    const publicText = extractPublicText(parsed.content);
    const eojeolCount = publicText.split(/\s+/).filter(Boolean).length;
    const calculatedMinutes = Math.ceil(eojeolCount / 180);

    expect(eojeolCount).toBe(1_464);
    expect(calculatedMinutes).toBe(9);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}분 분량`);
    expect(post?.readTime).toBe(`${calculatedMinutes}분 분량`);
  });

  it('removes stale actors, prohibited PIF claims, unsafe promises, and locale leakage', () => {
    const forbiddenLiterals = [
      'PIF 등록',
      'PIF를 등록',
      'PIF 업로드',
      'PIF 승인',
      'PIF 인증',
      '시장 판매 자격을 증명',
      '제품 등록자',
      '국내 책임자',
      '투자심의위원회',
      '투자심사위원회',
      '투심위',
      '약 3개월',
      '벌금',
      '제품 하차',
      '신분증',
      '건강검진 보고서',
      '완벽한 계약',
      '빠른 진출',
      '브랜드 장악',
      '마케팅 지뢰',
      '수업료',
      '신속 응답',
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
    expect(raw).not.toMatch(/PIF[^.。\n]*(?:업로드|승인|인증)/);
    expect(raw).not.toMatch(
      /(?:수제비누|수제 비누)[^.。\n]*(?:모두|전부|일률적으로)[^.。\n]*(?:예외|제외)/,
    );
    expect(raw).not.toMatch(
      /(?:모든|전부의) (?:인플루언서|개인)[^.。\n]*게시물[^.。\n]*(?:자동으로|반드시) (?:브랜드의 )?광고(?:입니다|가 됩니다)/,
    );
    expect(raw).not.toMatch(
      /PIF[^.。\n]*(?:불비|누락|불완전)[^.。\n]*(?:모두|전부|반드시|자동으로)[^.。\n]*(?:회수|폐기)/,
    );
    expect(raw).not.toMatch(/[\u3040-\u30ff]/);
  });

  it('resolves canonical and cosmetics-market-entry alias slugs in Korean', () => {
    expect(post?.slug).toBe(
      'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
    );
    expect(getColumnPost('cosmetics-market-entry', 'ko')?.slug).toBe(
      'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
    );
  });
});
