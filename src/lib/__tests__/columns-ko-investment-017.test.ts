import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns/017-taiwan-logistics-business-setup.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('taiwan-logistics-business-setup', 'ko');

function extractBodySections(content: string) {
  return Array.from(
    content.matchAll(/^## \d+\. (.+)\n\n([^\n]+)$/gm),
    (match) => ({
      heading: match[1],
      a: match[2],
    }),
  );
}

function extractPublicText(content: string) {
  return content
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^---$/gm, '')
    .replace(/[“”‘’*_`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const faq = [
  {
    q: '대만에서 물류 관련 사업을 하면 반드시 자동차 화물운송업(汽車貨運業) 허가를 받아야 하나요?',
    a: '반드시 그런 것은 아닙니다. ‘물류’는 폭넓은 실무 용어이므로 회사명이나 회사등기상 영업항목만으로 허가 필요 여부가 결정되지는 않습니다. 회사가 대가를 받고 화물자동차로 타인의 화물을 운송하는 경우에는 자동차 화물운송업에 해당할 수 있습니다. 반면 창고 보관, 포장, 시스템 운영, 화주로서의 발송, 운송주선 등은 계약관계, 운송책임, 보수의 내용 및 차량 운행 실태를 토대로 개별적으로 판단해야 합니다.',
  },
  {
    q: '일반 자동차 화물운송업을 신설하려면 자본금·차량 요건과 절차가 어떻게 되나요?',
    a: '일반 자동차 화물운송업은 최저 자본금 2,500만 신타이완달러와 신차 화물자동차 20대 이상이 원칙입니다. 다만 이사 운송만을 전문으로 하는 사업은 1,000만 신타이완달러와 8대 이상, 진먼·롄장(마쭈) 지역에서 영위하는 사업은 1,000만 신타이완달러와 5대 이상이 기준이며, 후자에는 영업지역 제한이 따릅니다. 개인이 영위하는 소형 화물차 운송업에는 본인 소유의 소형 화물차 1대, 차령 2년 이내, 소형차 직업운전면허, 관할구역 내 호적 등 별도의 제한적인 예외가 있습니다. 외국인투자, 교통부 승인, 설립준비 허가(籌設許可), 회사·상업등기, 차량·시설 준비, 영업면허, 업종별 조합(同業公會) 가입을 각각 구분해 확인해야 합니다.',
  },
  {
    q: '허가를 보유한 회사를 인수하면 자동차 화물운송업 영업면허도 자동으로 취득하나요?',
    a: '아닙니다. 주식 취득의 경우 면허를 취득하거나 이전받는 것이 아니라, 허가의 주체인 대상회사가 동일 법인으로 존속하면서 면허를 계속 보유합니다. 사업·자산 양수의 경우에는 대상회사의 면허가 양수인에게 당연히 이전되지 않습니다. 영업면허의 유효성과 허가 업종 범위, 차량·영업용 번호판, 주차시설, 업종별 조합 가입, 위반·미납, 보험, 담보, 계약상 지배권 변경 조항 등을 확인하고, 외국인투자 승인과 필요한 도로 주무기관의 승인·변경 절차를 밟아야 합니다.',
  },
  {
    q: '허가를 보유한 대만 사업자에게 실제 운송을 맡기면 자사에는 자동차 화물운송업 허가와 취업허가가 모두 필요 없나요?',
    a: '일률적으로 판단할 수 없습니다. 위탁자가 화주 또는 운송주선인인지, 아니면 운송계약상 운송인으로서 직접 대가를 받는지에 따라 판단이 달라집니다. 상대방의 영업면허와 영업용 차량을 확인하고, 면허 명의대여나 무허가 운송이 되지 않도록 계약상 역할과 실제 운영을 일치시켜야 합니다. 또한 주주·투자자라는 이유만으로 대만에서 일할 권리가 생기는 것은 아닙니다. 실제로 근무하거나 경영관리를 수행하는 외국인은 업무를 시작하기 전에 취업허가 필요 여부와 체류자격을 별도로 확인해야 합니다.',
  },
];

const bodySections = [
  {
    heading: '물류사업과 자동차 화물운송업(汽車貨運業)의 범위',
    a: faq[0].a,
  },
  {
    heading: '자동차 화물운송업을 신설하는 경우',
    a: faq[1].a,
  },
  {
    heading: '기존 사업자를 인수하는 경우',
    a: faq[2].a,
  },
  {
    heading: '운송·배송을 위탁하는 경우와 외국인의 취업',
    a: faq[3].a,
  },
];

describe('Korean investment column 017 — logistics and motor freight', () => {
  it('publishes the contracted frontmatter and exactly four exact FAQs', () => {
    expect(parsed.data.title).toBe(
      '대만 물류사업과 자동차 화물운송업(汽車貨運業) 허가: 신설·인수·위탁',
    );
    expect(parsed.data.url).toBe(
      'https://www.wei-wei-lawyer.com/post/taiwan-logistics-business-setup',
    );
    expect(parsed.data.lastmod).toBe('2026-07-25');
    expect(parsed.data.date_display).toBe('2025년 9월 13일');
    expect(parsed.data.read_time).toBe('9분 분량');
    expect(parsed.data.categories).toEqual(['대만 법인설립']);
    expect(parsed.data.featured_image).toBe(
      '../images/017-taiwan-logistics-business-setup/featured-01.jpg',
    );
    expect(parsed.content).toContain(
      '# 대만 물류사업과 자동차 화물운송업(汽車貨運業) 허가: 신설·인수·위탁',
    );
    expect(parsed.data.faq).toHaveLength(4);
    expect(parsed.data.faq).toEqual(faq);

    expect(post?.slug).toBe('taiwan-logistics-business-setup');
    expect(post?.title).toBe(parsed.data.title);
    expect(post?.date).toBe('2026-07-25');
    expect(post?.dateDisplay).toBe('2025년 9월 13일');
    expect(post?.readTime).toBe('9분 분량');
    expect(post?.category).toBe('formation');
    expect(post?.categoryLabel).toBe('법인설립');
    expect(post?.faq).toEqual(faq);
  });

  it('keeps the four ordered body headings and immediate answers aligned with the FAQs', () => {
    expect(extractBodySections(raw)).toEqual(bodySections);
    expect(extractBodySections(post?.content ?? '')).toEqual(bodySections);
  });

  it('distinguishes broad logistics services from regulated carriage', () => {
    const requiredPhrases = [
      '창고 보관, 포장, 물류 시스템, 운송주선, 자사 상품의 발송',
      '대가를 받고 타인의 화물을 자동차로 운송하는 사업',
      '계약 문구뿐 아니라 요금 수령 방식, 화물사고에 대한 책임, 배차',
      '화주와 운송계약을 체결하는 자와 운임 또는 물류 서비스 대가를 받는 자',
      '차량, 영업용 번호판, 운전자, 배차 및 운행을 누가 관리하는지',
      '「공로법」 제3조가 정한 중앙 주무기관은 교통부입니다.',
      '교통부 공로국(交通部公路局)과 그 소속 기관이 담당',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('states all thresholds, alternatives, and the exact plate restriction', () => {
    const requiredPhrases = [
      '최저 자본금 2,500만 신타이완달러와 신차 20대 이상',
      '최저 자본금 1,000만 신타이완달러와 신차 8대 이상',
      '최저 자본금 1,000만 신타이완달러와 신차 5대 이상',
      '허가받은 지역에 따른 영업범위 제한',
      '관할구역 안에 호적을 두고 소형차 직업운전면허를 보유',
      '본인 소유이면서 차령 2년 이내인 소형 화물차 1대',
      '외국법인이 자동차 화물운송업에 진입할 때 이용하는 일반적인 경로가 아닙니다.',
      '신설 자동차 운수사업자에게 발급된 영업용 차량번호판(車輛牌照)은 발급일부터 1년간 반납에 따른 말소(繳銷) 또는 차량등록상 명의이전·양도(過戶轉讓)를 할 수 없습니다.',
      '영업용 차량번호판의 반납에 따른 말소와 차량등록상 명의이전·양도',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('states Article 35, the current agency, qualified routes, and the ordered setup flow', () => {
    const requiredPhrases = [
      '「공로법」 제35조',
      '같은 법이 정한 중앙 주무기관인 교통부의 승인을 먼저 받아야 합니다.',
      '경제부 투자심의사(經濟部投資審議司)',
      '모든 외국인 투자가 동일한 창구와 절차를 따르는 것은 아닙니다.',
      '상장·장외 증권에 대한 투자',
      '외국회사 지점',
      '과학단지·산업단지 관할 기관',
      '중국 대륙으로부터의 투자',
    ];
    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }

    const setupSection = parsed.content.slice(
      parsed.content.indexOf('### 신설 절차의 순서'),
      parsed.content.indexOf('## 3.'),
    );
    const sequence = [
      '사업 범위를 확정',
      '외국인투자 승인',
      '설립준비 허가(籌設許可)를 신청',
      '회사·상업등기를 마치고',
      '영업면허를 신청',
    ];
    const positions = sequence.map((step) => setupSection.indexOf(step));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('covers facilities, representative documents, and qualified timing', () => {
    const requiredPhrases = [
      '소유권이나 사용권을 증명하는 자료',
      '모든 사업자가 자사 전용 주차장을 반드시 임차해야 한다고 일률적으로 단정할 수는 없습니다.',
      '회사 정관, 주주명부, 주차시설 승인자료',
      '정비계약, 차량 구매증빙과 차량목록',
      '현행 점검표',
      '원칙적으로 6개월 이내',
      '추가로 최장 6개월',
      '원칙적으로 1개월 이내에 영업을 시작하고, 해당 업종 동업공회(同業公會)가 발급한 유효 회원증 사본을 첨부하여 관할 도로 주무기관에 신고합니다.',
      '전체 절차의 완료 시점을 보장할 수 없습니다.',
      '자동차 화물운송업 신설 전체에 걸리는 기간을 뜻하지 않습니다.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('distinguishes share acquisition, asset transfer, diligence, and Article 23 changes', () => {
    const requiredPhrases = [
      '주식 취득에 따른 송금액은 자본금이 아니라 주식 양수대금',
      '경제부의 사전승인',
      '송금 후 투자액 심사확정(投資額審定)',
      '사업이나 자산을 양수하더라도 양도인의 영업면허가 양수인에게 당연히 승계되는 것은 아닙니다.',
      '「자동차 운수업 관리규칙」 제23조',
      '사업 양도, 조직, 명칭, 주소, 책임자, 자본·자산 및 주차시설 등의 변경',
      '영업면허의 유효성, 허가 업종·지역·조건',
      '행정처분, 세금·수수료·과태료 등의 미납 여부',
      '보험, 담보권, 리스 및 금융',
      '중요계약과 지배권 변경 조항',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('qualifies outsourcing risks and separates investment, work, and residence', () => {
    const requiredPhrases = [
      '허가를 보유한 대만 자동차 화물운송업자에게 실제 운송을 맡기는 방식',
      '위탁자가 단순한 화주나 운송주선인인지, 스스로 운송계약상 운송인이 되어 운임을 받는지',
      '영업면허 명의대여나 무허가 사업자의 실제 운송을 허용해서는 안 됩니다.',
      '허가 사업자에 대한 의존도, 서비스 수준, 화물의 멸실·훼손·지연, 보험, 개인정보·물류데이터, 재위탁, 손해배상',
      '계약 종료 시 데이터·화물·고객 대응의 인계 절차와 관련 위험',
      '주주나 투자자가 되더라도 그 사실만으로 대만에서 취업할 권리나 체류자격을 얻지는 않습니다.',
      '업무를 시작하기 전에 실제 직무에 맞는 취업허가가 필요한지',
      '행정상 과태료와 출국조치가 적용될 수 있습니다.',
      '일반적으로 3년의 입국금지 기간',
      '면제 또는 기간 단축 요건',
      '단순히 제3자의 신고가 있었다는 사실만으로 결과가 기계적으로 결정되는 것은 아니며',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses every official source and only the three contracted Korean internal links', () => {
    const officialSources = [
      'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0040001',
      'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0040004',
      'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0040003',
      'https://www.thb.gov.tw/cp.aspx?n=392',
      'https://www.thb.gov.tw/cp.aspx?n=507',
      'https://cyi2.thb.gov.tw/cp.aspx?n=1962',
      'https://www.thb.gov.tw/cl.aspx?n=259',
      'https://www.thb.gov.tw/cp.aspx?n=356',
      'https://www.mvdis.gov.tw/webMvdisLaw/Download.aspx?ID=22746&type=Law',
      'https://law.moea.gov.tw/LawContent.aspx?id=FL011158&media=print',
      'https://mnscdn.moea.gov.tw/Mns/dir/content/Content.aspx?menu_id=42885',
      'https://www.moea.gov.tw/Mns/dir/investment/wHandDirApply_File.ashx?file_id=49',
      'https://laws.mol.gov.tw/FLAW/FLAWDOC01.aspx?flno=43&id=FL015128',
      'https://laws.mol.gov.tw/flaw/FLAWDOC01.aspx?flno=68&id=FL015128',
      'https://www.immigration.gov.tw/5475/5478/141478/141482/148796/cp',
    ];
    for (const source of officialSources) {
      expect(raw).toContain(source);
    }

    const internalLinks = Array.from(
      raw.matchAll(/\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[0],
    );
    expect(internalLinks).toEqual([
      '[대만 투자·회사설립 서비스](/ko/services#investment)',
      '[증준외 변호사 프로필](/ko/lawyers/wei-tseng)',
      '[상담 문의](/ko/contact)',
    ]);
  });

  it('preserves identity, both image paths, substantial Korean copy, and both slugs', () => {
    expect(raw).toContain('증준외 변호사(曾雋崴, Wei Tseng)');
    expect(raw).not.toContain('曾俊瑋');
    for (const imagePath of [
      '../images/017-taiwan-logistics-business-setup/featured-01.jpg',
      '../images/017-taiwan-logistics-business-setup/img-01.jpg',
    ]) {
      expect(raw).toContain(imagePath);
    }
    expect(post?.featuredImage).toBe(
      '/images/blog/017-taiwan-logistics-business-setup/featured-01.jpg',
    );

    const hangul = /[\uac00-\ud7af]/g;
    expect(raw.match(hangul)?.length ?? 0).toBeGreaterThan(3_000);
    expect(raw.length).toBeGreaterThan(8_000);
    expect(post?.content.length).toBeGreaterThan(6_000);
    expect(getColumnPost('logistics-business', 'ko')?.slug).toBe(
      'taiwan-logistics-business-setup',
    );
  });

  it('derives the reading-time label from the exact public Korean eojeol count', () => {
    const publicText = extractPublicText(post?.content ?? '');
    const eojeolCount = publicText.split(/\s+/).filter(Boolean).length;
    const koreanLegalEojeolPerMinute = 180;
    const calculatedMinutes = Math.ceil(
      eojeolCount / koreanLegalEojeolPerMinute,
    );

    expect(eojeolCount).toBe(1_454);
    expect(calculatedMinutes).toBe(9);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}분 분량`);
    expect(post?.readTime).toBe(`${calculatedMinutes}분 분량`);
  });

  it('removes every forbidden claim, wrong-locale link, and wrong identity', () => {
    const forbiddenLiterals = [
      "물류회사를 설립하려면 '자동차화물운송업",
      '모든 외국인 투자가 거쳐야',
      '투자심사위원회',
      '새 화물차 20대를 구입해야 하며 1년간 보유',
      '1년간 보유해야 하고 처분할 수 없습니다',
      '라이선스 취득의 고민이 없습니다',
      '자본금 송금',
      '취득하는 것이 안전합니다',
      '신고당할 경우 3년간',
      '투자가 가장 적고 위험이 가장 작은',
      '쿠팡 물량',
      '완벽하게 작성',
      '회사의 체질',
      '대만 시장을 삼키',
      '/ja/',
      '/zh-hant/',
      '/en/',
      '曾俊瑋',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(raw).not.toContain(forbidden);
    }
    expect(raw).not.toMatch(/면허.*(?:회사|사업).*자동.*이전/);
  });
});
