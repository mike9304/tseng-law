import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns/002-withdraw-capital-taiwan-company.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('withdraw-capital-taiwan-company', 'ko');

const title =
  '대만 회사를 종료할 때 자본금과 회사 재산은 어떻게 처리할까요?';
const exitFaqAnswer =
  '회사를 영구적으로 종료하려면 원칙적으로 해산등기와 청산을 진행하고, 채무와 세무를 처리한 뒤 남은 잔여재산을 주주에게 분배합니다. 회사를 존속시키면서 출자금을 반환하려면 회사 형태에 맞는 감자 등 적법한 절차를 검토해야 합니다. 통상적인 사업비용, 배당, 회사가 실제로 부담하는 차입금의 상환은 각각 별도의 법적·세무상 근거와 절차를 확인해야 합니다.';
const resolutionFaqAnswer =
  '유한회사는 주주 의결권 3분의 2 이상의 동의가 필요합니다. 주식회사는 원칙적으로 발행주식 총수 3분의 2 이상을 대표하는 주주가 출석하고, 출석 주주 의결권 과반수로 결의합니다. 공개발행회사가 위 출석 요건을 충족하지 못한 경우에는 발행주식 총수 과반수를 대표하는 주주가 출석하고, 출석 주주 의결권 3분의 2 이상으로 결의할 수 있습니다. 정관이 더 높은 요건을 정할 수 있습니다. 해산등기는 해산 후 15일 이내에 신청해야 합니다.';
const suspensionFaqAnswer =
  '1개월 이상 휴업하는 회사는 휴업 전 또는 휴업 시작일부터 15일 이내에 휴업등기를 신청해야 하며(이미 영업세법에 따라 세무기관에 휴업을 신고·核備한 경우에는 이 등기가 필요하지 않습니다 — 회사등기방법(公司登記辦法) 제3조 제1항 단서), 1회 휴업 기간은 1년을 넘을 수 없습니다. 다만 휴업한 연도에도 연간 소득세 결산신고 의무가 있으므로 세무신고가 일률적으로 면제되는 것은 아닙니다. 세목, 보유 자산, 근로자와 그 밖의 사정에 따른 의무를 개별적으로 확인해야 합니다.';
const article9Paragraph =
  '대만 「회사법」 제9조는 회사가 납입받아야 할 주금에 관하여 실제로 납입되지 않았는데도 전액 납입된 것으로 표시한 경우, 또는 등기 후 주금을 주주에게 반환하거나 주주가 회수하도록 허용한 경우에 5년 이하의 유기징역·구류 또는 50만 대만달러 이상 250만 대만달러 이하의 벌금을 규정합니다.';
const article9ScopeSentence =
  '이 조항을 회사 계좌에서 이루어지는 모든 지급에 확대해서는 안 됩니다.';
const article90Paragraph =
  '청산인이 회사 채무를 변제하기 전에 회사 재산을 주주에게 분배한 경우에는 「회사법」 제90조에 따라 1년 이하의 유기징역·구류 또는 6만 대만달러 이하의 벌금에 처해질 수 있습니다.';
const insolvencyParagraph =
  '해산 후의 청산은 회사 자산이 부채보다 많은 경우에만 가능한 절차가 아닙니다. 「회사법」 제89조에 따르면 회사 재산으로 채무를 변제하기에 부족한 경우 청산인은 즉시 파산선고를 신청해야 합니다. 핵심은 회사 재산이 채무 변제에 부족한지, 지급기일과 현금 흐름이 어떠한지, 담보와 우선채권이 무엇인지, 청산인이 언제 그 사정을 알았는지를 실제 자료로 판단하는 것입니다. 회사가 보유한 채권의 회수 가능성과 자산 매각비용도 명목 금액이 아니라 현실적인 가치로 검토해야 합니다.';
// FAQ answers now live in the front matter only; the body states the same rules in its own sentences.
const suspensionRuleSentence =
  '1개월 이상 휴업하는 회사는 휴업 전 또는 휴업 시작일부터 15일 이내에 휴업등기를 신청해야 하며(이미 영업세법에 따라 세무기관에 휴업을 신고·核備한 경우에는 이 등기가 필요하지 않습니다 — 회사등기방법(公司登記辦法) 제3조 제1항 단서), 1회 휴업 기간은 1년을 넘을 수 없습니다.';
const suspensionTaxSentence =
  '휴업한 연도에도 연간 소득세 결산신고 의무가 있고, 휴업 전후 거래, 자산 보유·처분, 원천징수, 근로자와 업종에 따라 다른 신고나 납부가 남을 수 있습니다.';
const resolutionStep =
  '2. 회사 형태에 맞는 해산 결의를 합니다. 유한회사는 「회사법」 제113조에 따라 주주 의결권 3분의 2 이상의 동의가 필요합니다. 주식회사는 「회사법」 제316조에 따라 원칙적으로 발행주식 총수 3분의 2 이상을 대표하는 주주가 출석하고, 출석 주주 의결권 과반수로 결의합니다. 공개발행회사가 그 출석 요건에 미달한 때에는 발행주식 총수 과반수를 대표하는 주주가 출석하고 출석 주주 의결권 3분의 2 이상으로 결의할 수 있습니다. 정관이 출석 주식 수나 의결권 수에 관하여 더 높은 요건을 두면 그 정관도 따라야 합니다.';
const registrationStep =
  '3. 기한 안에 해산 변경등기를 신청합니다. 「회사등기방법」(公司登記辦法) 제4조에 따라 회사 등기사항이 변경되면 변경 후 15일 이내에 변경등기를 신청하는 것이 원칙입니다. 따라서 해산 후 15일 이내에 회사 형태와 해산 원인에 맞는 해산 변경등기를 준비합니다. 해산등기와 세적 정리, 영업세 관련 절차, 인허가의 폐지나 반납은 담당 기관과 법적 효과가 서로 다를 수 있으므로 하나의 신고로 모두 끝났다고 보아서는 안 됩니다.';
const liquidationPeriodSentence =
  '청산 소요기간은 이런 사실에 따라 달라지지만, 청산인은 6개월 안에 청산을 끝내야 하고(회사법 제87조 제3항, 주식회사는 제334조, 유한회사는 제113조 제2항에 따라 준용), 그 안에 끝내지 못하면 사유를 밝혀 법원에 연장을 신청할 수 있습니다.';
const disclaimer =
  '이 글은 대만 회사의 종료와 회사 재산 처리에 관한 일반적인 법률정보 및 교육 자료이며, 특정 사안에 대한 법률의견이 아닙니다. 적절한 해산·청산·감자·휴업 절차와 세무신고는 회사 형태, 정관, 재무상태, 채권자, 외국인투자 및 개별 거래에 따라 달라질 수 있으므로 실제 결의나 자금 이동 전에 해당 사안을 별도로 확인해야 합니다.';
const author = '증준외 변호사(Wei Tseng)';

const faq = [
  {
    q: '대만 회사의 자금을 주주에게 돌려주려면 반드시 해산·청산이 필요한가요?',
    a: exitFaqAnswer,
  },
  {
    q: '회사 해산의 결의 요건과 등기 기한은 어떻게 되나요?',
    a: resolutionFaqAnswer,
  },
  {
    q: '곧바로 해산하지 않고 회사를 휴업할 수 있나요?',
    a: suspensionFaqAnswer,
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

describe('Korean investment column 002 — company exit and capital return', () => {
  it('publishes the contracted metadata, H1, and exactly three FAQs', () => {
    expect(parsed.data.title).toBe(title);
    expect(parsed.data.url).toBe(
      'https://www.wei-wei-lawyer.com/post/withdraw-capital-taiwan-company',
    );
    expect(parsed.data.lastmod).toBe('2026-10-06');
    expect(parsed.data.date_display).toBe('2025년 9월 13일');
    expect(parsed.data.categories).toEqual(['대만 법인설립']);
    expect(parsed.data.featured_image).toBe(
      '../images/002-withdraw-capital-taiwan-company/featured-01.png',
    );
    expect(parsed.content).toContain(`# ${title}`);
    expect(parsed.data.faq).toEqual(faq);
    expect(parsed.data.faq).toHaveLength(3);

    expect(post?.slug).toBe('withdraw-capital-taiwan-company');
    expect(post?.title).toBe(title);
    expect(post?.date).toBe('2026-10-06');
    expect(post?.dateDisplay).toBe('2025년 9월 13일');
    expect(post?.category).toBe('formation');
    expect(post?.categoryLabel).toBe('법인설립');
    expect(post?.featuredImage).toBe(
      '/images/blog/002-withdraw-capital-taiwan-company/featured-01.png',
    );
    expect(post?.faq).toEqual(faq);
  });

  it('keeps each FAQ answer in the front matter only, with its rules stated in the body', () => {
    for (const answer of [exitFaqAnswer, resolutionFaqAnswer, suspensionFaqAnswer]) {
      expect(parsed.content).not.toContain(answer);
      expect(post?.content ?? '').not.toContain(answer);
    }

    const suspensionSection = '## 5. 당장 종료하지 않는 경우의 휴업';
    for (const content of [parsed.content, post?.content ?? '']) {
      expect(firstParagraphAfter(content, suspensionSection)).toContain(
        suspensionRuleSentence,
      );
      expect(content.split('\n\n')).toContain(resolutionStep);
      expect(content.split('\n\n')).toContain(registrationStep);
      expect(content).toContain(suspensionTaxSentence);
    }
  });

  it('uses exactly the seven ordered H2 sections', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual([
      '1. 회사 재산과 주주 출자금은 구분해야 합니다',
      '2. 회사를 영구적으로 종료하는 절차',
      '3. 채무초과 또는 지급불능인 경우',
      '4. 회사를 존속시키는 경우의 감자',
      '5. 당장 종료하지 않는 경우의 휴업',
      '공식 자료',
      '관련 안내',
    ]);
  });

  it('preserves both images with the contracted alt treatment', () => {
    expect(parsed.content).toMatch(
      /!\[[^\]]*[\uac00-\ud7af][^\]]*\]\(\.\.\/images\/002-withdraw-capital-taiwan-company\/featured-01\.png\)/,
    );
    expect(parsed.content).toContain(
      '![](../images/002-withdraw-capital-taiwan-company/img-01.png)',
    );
    expect(
      raw.match(
        /\.\.\/images\/002-withdraw-capital-taiwan-company\/featured-01\.png/g,
      ),
    ).toHaveLength(2);
    expect(
      raw.match(
        /\.\.\/images\/002-withdraw-capital-taiwan-company\/img-01\.png/g,
      ),
    ).toHaveLength(1);
  });

  it('distinguishes company property, paid-in capital, and fact-specific liability', () => {
    const requiredPhrases = [
      '회사 재산은 회사에 귀속되고 주주의 개인 재산이 아닙니다.',
      '출자했다는 이유만으로 회사 예금이나 자산을 자유롭게 인출할 수 없습니다.',
      article9Paragraph,
      article9ScopeSentence,
      article90Paragraph,
      '민사·형사·세무상 책임은 자금 이동의 목적, 권한, 증빙, 회계 처리 및 당사자 관계 등 구체적 사실에 따라 달라집니다.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('covers the qualified dissolution, registration, liquidation, and tax sequence', () => {
    const requiredPhrases = [
      '「회사법」 제113조',
      '「회사법」 제316조',
      '「회사등기방법」(公司登記辦法) 제4조',
      '해산 후 15일 이내',
      '주무기관의 해산 승인일부터 45일 이내에 당기 결산신고',
      '실제 기준일을 다시 확인해야 합니다.',
      '청산인을 선임하거나 법정 청산인을 확인',
      '필요한 사항을 법원에 신고',
      '재산목록과 대차대조표',
      '현존 사무를 종결',
      '채권을 회수',
      '채무와 세금을 변제',
      '채권자 보호 절차',
      '남은 잔여재산만',
      '청산 종료일부터 30일 이내에 청산소득을 신고',
      '법원에 필요한 청산종결 보고',
      '합병·분할·파산에 따른 해산은 통상 청산 절차가 면제될 수 있습니다.',
      liquidationPeriodSentence,
      '청산인은 6개월 안에 청산을 끝내야 하고',
      '그 안에 끝내지 못하면 사유를 밝혀 법원에 연장을 신청할 수 있습니다.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('covers insolvency, capital reduction, and suspension with proper qualifications', () => {
    const requiredPhrases = [
      insolvencyParagraph,
      '재무상태가 불분명하다면 주주에게 돌아갈 금액을 먼저 계산해서는 안 됩니다.',
      '회사를 존속시키면서 출자의 일부를 반환하는 적법한 방법으로 감자를 검토',
      '비공식 인출 수단이 아니며 항상 가능한 것도 아닙니다.',
      '회사 형태에 맞는 결의, 채권자 보호, 자본 검증·회계 처리, 외국인투자, 세무, 송금 및 변경등기',
      '서로 다른 법률·세무 범주입니다.',
      suspensionRuleSentence,
      '소재지, 책임자, 정관, 자본액',
      '필요한 변경등기',
      '차량이나 건물 등 보유 자산',
      '계약, 근로자, 인허가, 은행계좌와 장부 보존',
      '휴업은 회사의 존재를 끝내는 절차가 아닙니다.',
      '회사가 소멸하거나 기존 권리·의무가 일괄 정리되는 효과는 없습니다.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('keeps every native-review terminology and sentence correction', () => {
    const correctedPhrases = [
      '예를 들어 실제 영업을 위한 임차료, 급여, 공급대금이나 세금의 지급은 주금을 실제로 납입하지 않은 가장납입이나 등기 후 주금 반환과 구별해야 합니다.',
      '세액 계산·신고 자료',
      '세무·회계 장부',
      '해산은 회사의 통상적인 영업을 끝내고 청산 단계로 전환하는 법률상 절차이며, 청산은 그 뒤 회사에 남은 사무와 재산관계를 정리하는 절차입니다.',
      '공식 세무 안내에 따르면 기간은 주무기관의 승인 공문 발송일(발문일) 다음 날부터 계산합니다. 다만 회사가 받은 문서의 종류와 해산 원인에 따라 실제 기준일을 다시 확인해야 합니다.',
      '정관이나 주주 결의에 따라 청산인을 선임하거나 법정 청산인을 확인한 뒤, 필요한 사항을 법원에 신고합니다.',
      '임금·퇴직금 등 근로관계 채무',
      '다음 순서는 일반적인 점검 틀입니다.',
      '회사 계좌에 현금이 있다는 사실만으로 배당 가능한 이익이 있는 것은 아니므로 결손금, 법정적립금과 미처분이익잉여금을 확인해야 합니다.',
    ];

    for (const phrase of correctedPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses each inline column link, official source and contracted internal link exactly once in order', () => {
    const officialLinks = [
      '[대만 회사법](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080001)',
      '[대만 경제부 회사등기방법](https://law.moea.gov.tw/LawContent.aspx?id=FL011312)',
      '[대만 재정부 결산·청산·휴업 세무 안내](https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/profit-seeking-enterprise-income-tax/liquidation-procedure/x6mOPan)',
      '[대만 경제부 휴업 신청 기한 안내](https://serv.gcis.nat.gov.tw/crm/faqAction.do?id=659&method=faqDetlDetl)',
      '[대만 회사법 제87조(청산 기간)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=87)',
    ];
    const inlineColumnLinks = [
      '[대만 자회사 해산등기 뒤에도 청산은 남습니다](/ko/columns/taiwan-company-dissolution-liquidation)',
    ];
    const internalLinks = [
      '[대만 투자·회사설립 서비스](/ko/services/investment)',
      '[대만 회사설립 기초](/ko/columns/taiwan-company-establishment-basics)',
      '[문의하기](/ko/contact)',
    ];
    const markdownLinks = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g),
      (match) => match[0],
    );

    expect(markdownLinks).toEqual([
      ...inlineColumnLinks,
      ...officialLinks,
      ...internalLinks,
    ]);
    for (const link of [...inlineColumnLinks, ...officialLinks, ...internalLinks]) {
      expect(raw.split(link)).toHaveLength(2);
    }
  });

  it('ends with the exact disclaimer and official author', () => {
    expect(parsed.content).toContain(disclaimer);
    expect(raw.trimEnd()).toMatch(
      new RegExp(
        `${disclaimer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\n${author.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
      ),
    );
    expect(raw.trimEnd()).toMatch(/증준외 변호사\(Wei Tseng\)$/);
  });

  it('derives read_time from the exact visible public eojeol count at 180 per minute', () => {
    const publicText = extractPublicText(post?.content ?? '');
    const eojeolCount = publicText.split(/\s+/).filter(Boolean).length;
    const calculatedMinutes = Math.ceil(eojeolCount / 180);

    expect(eojeolCount).toBeGreaterThanOrEqual(1_000);
    expect(eojeolCount).toBe(1_803);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}분 분량`);
    expect(post?.readTime).toBe(`${calculatedMinutes}분 분량`);
  });

  it('resolves the canonical and alias slugs in Korean', () => {
    expect(post?.slug).toBe('withdraw-capital-taiwan-company');
    expect(getColumnPost('withdraw-capital', 'ko')?.slug).toBe(
      'withdraw-capital-taiwan-company',
    );
  });

  it('removes stale claims, wrong locale links, promises, and invisible characters', () => {
    const forbiddenLiterals = [
      '잔여재산(자본금)',
      '자본금(잔여재산)',
      '직접 빼돌리면',
      '회사등록법 제4조',
      '다음 기에는 세무 신고를 하지 않아도 됩니다',
      '영업정지 처분',
      '빠른 답변',
      '빠르게 처리',
      '상담을 권',
      '曾俊瑋',
      '/ja/',
      '/zh-hant/',
      '/en/',
      '\uFEFF',
      '\u00A0',
      '\u200B',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(raw).not.toContain(forbidden);
    }
    expect(raw).not.toMatch(
      /배임죄(?:가|는)? (?:당연히|자동으로) 성립합니다/,
    );
    expect(raw).not.toMatch(/자산[^.。\n]*부채[^.。\n]*(?:때만|경우에만)[^.。\n]*청산/);
    expect(raw).not.toMatch(/복수의 채권자[^.。\n]*(?:두 가지|2개|2가지) 요건/);
    expect(raw).not.toMatch(/청산[^.。\n]*(?:약|대략|통상)\s*\d+\s*(?:개월|년)/);
    expect(raw).not.toMatch(/(?:승인|송금|결과)[^.。\n]*(?:보장|확실)/);
    expect(raw).not.toMatch(/고객[^.。\n]*(?:대화|성공 사례)/);
  });
});
