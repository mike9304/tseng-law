import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns/007-taiwan-divorce-lawsuit-qna.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const canonicalSlug = 'taiwan-divorce-lawsuit-qna';
const post = getColumnPost(canonicalSlug, 'ko');
const aliasPost = getColumnPost('divorce-qna', 'ko');

const title = '대만 이혼 절차 Q&A: 조정·소송·재산분할·자녀';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-divorce-lawsuit-qna';
const featuredImage =
  '../images/007-taiwan-divorce-lawsuit-qna/featured-01.jpg';
const bodyImage = `![대만 이혼 절차와 국제가사 문제를 설명하는 이미지](${featuredImage})`;
const faq1Answer =
  '대만 민법 제1050조에 따른 협의이혼은 서면으로 합의하고, 두 사람 이상의 증인이 당사자 쌍방의 진정한 이혼 의사를 확인한 뒤 서명하며, 호정기관에 이혼등기를 해야 효력이 생깁니다. 서명된 합의서만으로 이혼이 완성되는 것은 아니며, 외국 요소가 있으면 준거법·문서 인증·번역과 다른 국가 또는 지역에서의 신고도 별도로 확인해야 합니다.';
const faq2Answer =
  '항상 그런 것은 아닙니다. 대만 법원은 가사사건의 성질에 따라 당사자나 법정대리인에게 직접 출석을 명할 수 있고, 정당한 이유 없이 따르지 않으면 가사사건법 제13조와 준용되는 민사소송법 제303조에 따라 최초 3만 대만달러 이하의 과태료가 문제될 수 있습니다. 다만 같은 공간에서 반드시 함께 조정해야 하는지, 분리·안전·대리 또는 다른 절차상 조치가 가능한지는 법원과 사건의 사정을 확인해야 합니다.';
const faq3Answer =
  '현행 민법 제1052조 제2항 단서는 혼인파탄의 중대 사유가 한쪽에게만 책임 있는 경우 원칙적으로 상대방만 이혼을 청구하도록 정합니다. 그러나 대만 헌법재판소 112년 헌판자 제4호(112年憲判字第4號)는 중대 사유가 발생하거나 계속된 상당한 기간을 고려하지 않은 채 유책배우자의 이혼 기회를 완전히 박탈해 개별사건에서 명백히 가혹해지는 범위는 위헌이라고 판단했습니다. 조문은 남아 있으므로 무조건 가능하거나 불가능하다고 단정하지 말고 법원이 판결 취지와 구체적 사실을 어떻게 적용하는지 보아야 합니다.';
const faq4Answer =
  '아닙니다. 주택 등기명의와 매수자금의 출처는 중요한 증거이지만, 소유권·증여·명의신탁·대여·부당이득 같은 개별 청구와 민법 제1030조의1의 잔여재산 차액분배는 서로 다른 문제입니다. 실제 합의, 취득 원인과 시기, 자금 흐름, 채무, 무상취득 여부와 증거를 나누어 검토해야 하며, 혼전 자금으로 일부 비용을 냈거나 한쪽 명의로 등기되었다는 사실만으로 모든 결론이 정해지지 않습니다.';
const faq5Answer =
  '같은 권리가 아닙니다. 민법 제1030조의1의 잔여재산 차액분배청구권, 제1056조의 재판상 이혼 손해배상, 제1057조의 무과실 배우자에 대한 곤궁부양, 미성년 자녀의 양육비는 발생요건과 계산·기간이 다릅니다. 잔여재산 차액분배청구권에는 차액을 안 날부터 2년, 법정재산제 소멸부터 5년의 기간이 적용되지만, 이를 다른 청구에 그대로 옮겨서는 안 됩니다.';
const faq6Answer =
  '대만 민법 제1055조와 제1055조의1에 따라 법원은 미성년 자녀의 최선의 이익을 기준으로 권리·의무의 행사와 부담, 면접교섭 등 자녀 관련 사항을 판단합니다. 자녀의 나이·건강·의사와 발달 필요, 부모의 생활·돌봄 능력과 태도, 자녀와의 정서적 관계, 다른 부모와의 관계를 방해하는지 등 법정 요소와 구체적 자료를 종합하므로, 부모의 소득이나 혼인파탄 책임 하나로 결론을 정할 수 없습니다.';
const faq = [
  {
    q: '대만에서 협의이혼은 합의서에 서명하면 바로 효력이 생기나요?',
    a: faq1Answer,
  },
  {
    q: '대만 법원의 이혼 조정에는 부부가 반드시 함께 출석해야 하나요?',
    a: faq2Answer,
  },
  {
    q: '혼인파탄에 책임이 있는 배우자도 대만에서 재판상 이혼을 청구할 수 있나요?',
    a: faq3Answer,
  },
  {
    q: '혼전 자금으로 집값을 냈거나 한쪽 명의로 등기하면 소유권과 재산분할이 결정되나요?',
    a: faq4Answer,
  },
  {
    q: '잔여재산 분배, 이혼 손해배상, 배우자 부양과 양육비는 같은 청구인가요?',
    a: faq5Answer,
  },
  {
    q: '대만 법원은 미성년 자녀에 관한 사항을 어떤 기준으로 판단하나요?',
    a: faq6Answer,
  },
];
const headings = [
  '1. 대만 이혼의 세 가지 경로와 국제사건의 첫 확인사항',
  '2. 협의이혼 요건과 호정기관 등록',
  '3. 법원 조정·소송, 출석과 불복절차',
  '4. 재판상 이혼사유와 유책배우자 제한',
  '5. 외국 혼인·외국 이혼과 대만 호적',
  '6. 주택 명의·혼전 자금과 잔여재산 분배',
  '7. 이혼 손해배상·배우자 부양·미혼 동거와 제3자',
  '8. 미성년 자녀의 권리·의무와 최선의 이익',
  '9. 양육비·면접교섭·강제집행과 임시처분',
  '10. 자녀와 함께하는 국제이주',
  '11. 증거와 실무 준비',
  '12. 공식 자료',
  '13. 관련 안내',
];
const officialLinks = [
  '[대만 전국법규자료고: 민법](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000001)',
  '[대만 법무부: 민법 영문본](https://mojlaw.moj.gov.tw/ENG/LawContentE.aspx?LSID=FL001351)',
  '[대만 전국법규자료고: 가사사건법](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0010048)',
  '[대만 전국법규자료고: 민사소송법 제303조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=303&pcode=B0010001)',
  '[대만 전국법규자료고: 가사비송사건 임시처분 관련 규정](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0010056)',
  '[대만 전국법규자료고: 호적법](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0030006)',
  '[대만 내정부 호정사: 이혼등기 안내](https://www.ris.gov.tw/documents/html/2/3/1/384.html)',
  '[대만 전국법규자료고: 섭외민사법률적용법](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000007)',
  '[대만 헌법재판소: 112년 헌판자 제4호(112年憲判字第4號)](https://cons.judicial.gov.tw/docdata.aspx?fid=52&id=310013)',
  '[대만 헌법재판소: 112년 헌판자 제4호 영문본](https://cons.judicial.gov.tw/en/docdata.aspx?fid=5534&id=352234)',
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
  '이 글은 대만의 이혼, 국제가사, 부부재산 및 미성년 자녀 제도를 일반적으로 설명하기 위한 교육 목적의 자료이며, 개별 사건에 대한 법률 자문이 아닙니다. 관할, 준거법, 외국 재판의 승인, 혼인·호적 상태, 재산제, 자녀에 관한 기존 합의나 재판, 사실관계와 증거 및 최신 공식 규정에 따라 절차와 결과가 달라질 수 있습니다. 등록·불복·청구·집행 기한은 행동하기 전에 각 권리와 절차의 정확한 기산점을 기준으로 개별적으로 확인하시기 바랍니다.';
const author = '**증준외 변호사(曾雋崴, Wei Tseng)**';
const exactEnding = `- ${internalLinks[2]}

---

${disclaimer}

${author}`;

function countOccurrences(value: string, needle: string) {
  return value.split(needle).length - 1;
}

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

describe('Korean family column 007 — Taiwan divorce procedure Q&A', () => {
  it('publishes the exact complete frontmatter and loaded article identity', () => {
    expect(parsed.data).toEqual({
      title,
      url: sourceUrl,
      lastmod: '2026-07-25',
      date_display: '2025년 9월 13일',
      read_time: '18분 분량',
      categories: ['대만 법률정보'],
      featured_image: featuredImage,
      faq,
    });
    expect(parsed.data.faq).toHaveLength(6);
    expect(post).toMatchObject({
      slug: canonicalSlug,
      title,
      date: '2026-07-25',
      dateDisplay: '2025년 9월 13일',
      readTime: '18분 분량',
      category: 'legal',
      categoryLabel: '법률정보',
      featuredImage:
        '/images/blog/007-taiwan-divorce-lawsuit-qna/featured-01.jpg',
      faq,
    });
  });

  it('uses the sole exact H1 followed immediately by the sole contracted image', () => {
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(parsed.content).toMatch(
      new RegExp(
        `^\\n# ${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\n${bodyImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\n`,
      ),
    );
    expect(
      Array.from(
        parsed.content.matchAll(/!\[[^\]]*\]\([^)]+\)/g),
        (match) => match[0],
      ),
    ).toEqual([bodyImage]);
    expect(countOccurrences(raw, featuredImage)).toBe(2);
    expect(post?.content).not.toMatch(/!\[[^\]]*\]\([^)]+\)/);
    expect(raw).not.toContain('img-01.jpg');
  });

  it('uses exactly the thirteen contracted H2 sections in order', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(headings);
    expect(parsed.content).not.toMatch(/^### /m);
  });

  it('repeats each exact FAQ answer twice and starts its assigned section with it', () => {
    const assignments = [
      [`## ${headings[1]}`, faq1Answer],
      [`## ${headings[2]}`, faq2Answer],
      [`## ${headings[3]}`, faq3Answer],
      [`## ${headings[5]}`, faq4Answer],
      [`## ${headings[6]}`, faq5Answer],
      [`## ${headings[7]}`, faq6Answer],
    ];

    for (const [heading, answer] of assignments) {
      expect(firstParagraphAfter(parsed.content, heading)).toBe(answer);
      expect(firstParagraphAfter(post?.content ?? '', heading)).toBe(answer);
      expect(countOccurrences(raw, answer)).toBe(2);
    }
  });

  it('locks one exact substantive proposition in its assigned section for all twenty-five legacy topics', () => {
    const legacyCoverage = [
      {
        number: 1,
        heading: headings[0],
        phrase:
          '첫째, 당사자가 서면·증인·호정기관 등록 요건을 갖추는 협의이혼입니다.',
      },
      {
        number: 2,
        heading: headings[4],
        phrase:
          '외국의 현지법에 따라 이혼이 성립했다는 설명이나 외국 이혼증명서 하나만으로 모든 대만 절차가 끝나지는 않습니다.',
      },
      {
        number: 3,
        heading: headings[5],
        phrase:
          '혼전 저축으로 계약금이나 대출금을 냈다는 사실만으로 등기명의가 이전되는 것은 아니며, 한쪽 명의의 등기만으로 모든 계약·수익권·상환·부부재산 문제가 끝나는 것도 아닙니다.',
      },
      { number: 4, heading: headings[2], phrase: faq2Answer },
      {
        number: 5,
        heading: headings[6],
        phrase:
          '정부 통계상의 평균 소비액이나 상대방의 잘못만을 구속력 있는 산식으로 삼을 수 없습니다.',
      },
      {
        number: 6,
        heading: headings[5],
        phrase:
          '이체내역, 매매계약서, 대출계약과 상환내역, 영수증, 당사자 간 메시지, 세금자료, 등기자료, 취득 원인과 시기를 함께 연결해야 실제 법률관계가 드러납니다.',
      },
      { number: 7, heading: headings[6], phrase: faq5Answer },
      {
        number: 8,
        heading: headings[7],
        phrase:
          '그러나 이를 모든 사건에서 권할 수 있는 지름길로 보아서는 안 됩니다.',
      },
      {
        number: 9,
        heading: headings[1],
        phrase:
          '신청인, 대리 가능 여부, 신분증명과 호적 자료, 이혼서면 등 실제 준비서류는 신청 당시 대만 내정부 호정사의 이혼등기 안내와 담당 호정사무소의 확인을 기준으로 준비해야 합니다.',
      },
      {
        number: 10,
        heading: headings[2],
        phrase:
          '사건 기간은 송달, 조정 횟수, 다투는 사실과 증거, 감정·조사, 자녀 쟁점, 국제송달 및 심급에 따라 달라지므로 고정된 완료 시점을 제시할 수 없습니다.',
      },
      {
        number: 11,
        heading: headings[3],
        phrase:
          '민법 제1052조 제1항은 상대방에게 다음 사유가 있을 때 재판상 이혼을 청구할 수 있도록 열 가지 사유를 열거합니다.',
      },
      { number: 12, heading: headings[3], phrase: faq3Answer },
      {
        number: 13,
        heading: headings[2],
        phrase:
          '가사사건법이 정한 가사사건은 원칙적으로 재판에 앞서 법원 조정을 거칩니다.',
      },
      {
        number: 14,
        heading: headings[6],
        phrase:
          '협의이혼인지 재판상 이혼인지, 청구인에게 과실이 없는지, 이혼 때문에 실제 곤궁 상태에 놓였는지를 먼저 확인하고, 필요와 자력 등 구체적인 자료로 범위를 판단해야 합니다.',
      },
      {
        number: 15,
        heading: headings[6],
        phrase:
          '혼인하지 않은 동거 당사자는 함께 살았다는 사실만으로 이혼 또는 배우자 부양과 같은 혼인상 권리를 취득하지 않습니다.',
      },
      {
        number: 16,
        heading: headings[7],
        phrase:
          '기존 결정 뒤 사정과 자녀의 이익에 비추어 변경이 필요한 경우에도 법원 심사가 문제될 수 있습니다.',
      },
      {
        number: 17,
        heading: headings[8],
        phrase:
          '모든 변경에 당사자가 전혀 예측할 수 없던 사건이 반드시 있어야 한다고 제한할 수는 없습니다.',
      },
      {
        number: 18,
        heading: headings[8],
        phrase:
          '면접교섭이 방해되는 경우에는 기존 합의나 재판의 내용과 집행 가능성, 방해 경위, 자녀의 의사·안전·생활일정에 따라 법원에 내용의 결정 또는 변경, 집행이나 적절한 임시처분을 구할 수 있는지 검토합니다.',
      },
      {
        number: 19,
        heading: headings[2],
        phrase:
          '판결에 대한 항소인지, 결정에 대한 항고인지, 조정·화해의 성립 또는 효력을 다투는 별도 절차인지에 따라 경로와 기간이 달라집니다.',
      },
      {
        number: 20,
        heading: headings[5],
        phrase:
          '배우자 외 사람과의 성관계나 혼인파탄 책임 자체가 잔여재산 차액분배청구권을 당연히 배제하거나 감액하지는 않습니다.',
      },
      {
        number: 21,
        heading: headings[3],
        phrase:
          '조문은 남아 있으므로 무조건 가능하거나 불가능하다고 단정하지 말고 법원이 판결 취지와 구체적 사실을 어떻게 적용하는지 보아야 합니다.',
      },
      {
        number: 22,
        heading: headings[6],
        phrase:
          '시가족이나 처가족 등 배우자의 친족은 민법 제1057조가 정한 이혼 후 배우자 부양의 의무자가 아닙니다.',
      },
      {
        number: 23,
        heading: headings[3],
        phrase:
          '경찰의 실종신고는 소재와 경과를 보여주는 증거가 될 수 있지만 모든 이혼청구의 필수 선행요건은 아닙니다.',
      },
      {
        number: 24,
        heading: headings[3],
        phrase:
          '몇 달간 집을 떠났다는 사실만으로 어느 사유가 성립하는 것도 아니며, 이탈의 이유, 정당한 별거 사유, 연락과 부양, 지속성 등 구체적 사실을 살펴야 합니다.',
      },
      {
        number: 25,
        heading: headings[9],
        phrase:
          '자녀가 한국에서 살기로 했다는 합의만으로 한국 생활비 수준이 양육비의 독립된 산식이 되지는 않습니다.',
      },
    ];

    expect(legacyCoverage.map(({ number }) => number)).toEqual(
      Array.from({ length: 25 }, (_, index) => index + 1),
    );
    for (const { heading, phrase } of legacyCoverage) {
      expect(sectionBody(parsed.content, heading)).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks the three paths and five separate cross-border questions', () => {
    const section = sectionBody(parsed.content, headings[0]);
    const requiredPhrases = [
      '둘째, 법원에서 당사자의 합의가 성립하여 조정조서 또는 화해조서에 따라 혼인관계가 소멸하는 법원 조정·화해에 의한 이혼입니다.',
      '셋째, 법정 이혼사유를 주장하고 증명하여 법원의 판결을 받는 재판상 이혼입니다.',
      '대만 법원이나 행정기관에 관할 또는 처리 권한이 있는지, 이혼·부부재산·자녀 문제에 어느 법이 준거법으로 적용되는지, 외국 이혼이나 재판이 대만에서 승인되거나 어떤 효력을 갖는지, 대만 호적에는 어떤 절차와 인증 문서가 필요한지, 다른 관련 국가 또는 지역에서는 별도의 신고·승인·집행이 필요한지를 각각 확인합니다.',
      '당사자의 국적, 외국인 여부 또는 혼인 장소 하나가 이 다섯 문제를 모두 결정하지 않습니다.',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Article 1050 elements and the qualified court-result registration rule', () => {
    const section = sectionBody(parsed.content, headings[1]);
    const requiredPhrases = [
      '서면 작성, 두 사람 이상 증인의 서명, 호정기관의 이혼등기는 각각 독립된 요건입니다.',
      '증인은 단순히 이미 작성된 문서에 이름을 보태는 사람이 아니라 당사자 쌍방에게 진정한 이혼 의사가 있음을 인식하고 확인한 뒤 서명해야 합니다.',
      '그것만으로 대만 협의이혼의 신분상 효력을 발생시키지는 않습니다.',
      '외국에서 작성된 문서는 문서의 종류와 작성지에 따라 대만 재외공관 또는 권한 있는 기관의 인증이 필요할 수 있고, 공식 안내가 요구하는 경우 인증 또는 공증된 중국어 번역문을 함께 내야 합니다.',
      '대만 법원의 이혼판결이 확정되거나 법원 조정·화해가 성립하여 혼인관계가 소멸한 경우에는 원칙적으로 당사자 어느 한쪽이 호정기관에 이혼등기를 할 수 있습니다.',
      '호적법 제48조에 따른 일반 호적등록 신청기간은 대만 이혼판결의 확정 또는 법원 조정·화해의 성립일부터 30일입니다.',
      '판결문이나 조서를 송달·수령한 날은 모든 사건의 공통 기산점이 아닙니다.',
      '신청기간이 지난 뒤의 신청도 호정사무소가 수리해야 하며, 서면 통지 후에도 아무도 신청하지 않으면 호정기관이 호적법 제48조의2에 따라 요건을 갖춘 법원 결과를 직권으로 등록합니다.',
      '신청기간을 놓쳤다는 사실이 이미 효력이 생긴 이혼을 되돌리지는 않습니다.',
      '온라인 신청은 법정 신청기간 안에서만 이용할 수 있지만, 그 30일을 온라인 신청 전용 기한으로 설명해서는 안 됩니다.',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Family Act Article 13 and the type-specific effects and review routes', () => {
    const section = sectionBody(parsed.content, headings[2]);
    const requiredPhrases = [
      '가사사건법 제13조의 제재는 법원이 당사자 또는 법정대리인 본인에게 출석을 명한 경우에만 문제됩니다.',
      '민사소송법 제303조가 준용되어 최초 3만 대만달러 이하의 과태료가 부과될 수 있지만, 이 준용을 근거로 구인할 수는 없습니다.',
      '이후 법원이 다시 적법하게 통지했는데도 정당한 이유 없이 출석하지 않으면 연속하여 제재할 수 있습니다.',
      '분리된 장소, 화상 방식, 대리인만의 참석 또는 안전조치가 특정 사건에서 허용된다고 미리 약속할 수도 없으므로',
      '조정이나 화해가 성립하면 법이 정한 방식으로 혼인관계가 소멸하고, 확정재판과 같은 효력이 생깁니다.',
      '판결에 의한 이혼은 판결 확정이 핵심입니다.',
      '송달일, 확정 여부와 절차상 지위를 확인한 뒤 해당 유형의 기한을 계산해야 하며',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Article 1052 paragraph 1 grounds, paragraph 2, and the constitutional qualification', () => {
    const section = sectionBody(parsed.content, headings[3]);
    const grounds = [
      '1. 중혼',
      '2. 배우자 외의 사람과 합의하여 성관계를 한 경우',
      '3. 공동생활을 견디기 어려울 정도로 상대방을 학대한 경우',
      '4. 상대방이 자신의 직계친족을 학대하거나, 상대방의 직계친족이 자신을 학대하여 공동생활을 견디기 어려운 경우',
      '5. 상대방을 악의로 유기한 상태가 계속되는 경우',
      '6. 상대방을 살해하려는 의도가 있었던 경우',
      '7. 치유할 수 없는 중대한 질병이 있는 경우',
      '8. 중대한 불치의 정신질환이 있는 경우',
      '9. 생사가 3년 넘게 불명인 경우',
      '10. 고의범죄로 6개월을 초과하는 유기징역의 확정판결을 받은 경우',
    ];
    const requiredPhrases = [
      '제2항은 위 열 가지 이외의 중대 사유로 혼인을 유지하기 어려운 경우를 별도의 일반 사유로 둡니다.',
      '2026년 7월 25일 현재 단서 문언 자체가 삭제된 것은 아니며, 법원은 개별사건에서 판결의 위헌 판단 취지를 적용해야 합니다.',
      '생사가 3년 넘게 불명인 제1항 사유, 악의의 유기가 계속되는 제1항 사유, 그 밖의 중대 사유로 혼인을 유지하기 어려운 제2항 사유는 서로 다릅니다.',
      '먼저 동거의무 이행소송을 제기해야만 악의의 유기나 중대 사유를 주장할 수 있다는 보편적 요건도 없습니다.',
      '그 사실이 있다고 해서 재판상 이혼, 제1056조 손해배상, 잔여재산 차액분배, 제1057조 배우자 부양, 미성년 자녀에 대한 권리·의무 또는 양육비의 결론이 일괄적으로 정해지는 것은 아닙니다.',
    ];

    let previousIndex = -1;
    for (const ground of grounds) {
      const index = section.indexOf(ground);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks foreign-record connecting factors, authentication, translation, and regional verification', () => {
    const section = sectionBody(parsed.content, headings[4]);
    const requiredPhrases = [
      '대만에 혼인을 먼저 등록하거나 대만에서 이혼소송을 하는 것만이 선택지라고 볼 수 없습니다.',
      '당사자 각각의 국적, 주소와 상거소, 혼인 또는 이혼이 이루어진 장소와 방식, 현재 대만 호적과 외국 가족관계 기록, 기존 외국 판결·조정조서·이혼증명서의 존재를 확인합니다.',
      '상대방에게 적법한 송달과 방어 기회가 있었는지 등 절차적 공정성도 살펴야 합니다.',
      '마지막으로 대만에서 혼인관계 소멸, 호적 변경, 재산판단 또는 집행 가운데 어떤 효력을 원하는지를 특정해야 합니다.',
      '반대로 모든 외국 이혼에 똑같은 승인소송이나 똑같은 서류가 필요한 것도 아닙니다.',
      '외국 문서에는 대만 재외공관이나 그 밖의 권한 있는 기관의 인증이 요구될 수 있고, 문서별 공식 지침에 따라 인증 또는 공증된 중국어 번역문이 필요할 수 있습니다.',
      '중국대륙에서 작성된 문서와 홍콩·마카오에서 작성된 문서는 일반 외국 문서와 구별되는 별도의 검증 규칙을 따르므로',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Article 1017 and Article 1030-1 classification, exclusions, adjustment, and claim-specific periods', () => {
    const section = sectionBody(parsed.content, headings[5]);
    const requiredPhrases = [
      '주택 문제는 세 층으로 나누어야 합니다.',
      '먼저 등기와 취득 원인에 따라 특정 재산을 누가 소유하는지를 봅니다.',
      '다음으로 실제 합의와 자금 제공의 성격에 따라 증여, 명의신탁, 대여, 신탁, 부당이득, 비용상환 또는 다른 계약상 청구가 성립하는지를 봅니다.',
      '마지막으로 그 재산이나 가치와 관련 채무가 법정재산제 종료 시 잔여재산 차액분배 계산에 들어가는지를 따로 봅니다.',
      '민법 제1017조는 혼전재산과 혼인 후 재산을 구분하고 어느 때 취득했는지 증명하기 어려운 재산을 혼인 후 재산으로 추정하는 규율을 둡니다.',
      '민법 제1030조의1은 법정재산제가 소멸할 때 각 배우자의 요건을 갖춘 혼인 후 순재산을 계산하여 그 차액을 원칙적으로 균등하게 분배하는 제도입니다.',
      '상속 또는 그 밖의 무상취득 재산과 위자료는 법이 정한 계산에서 제외되며',
      '균등한 차액분배 결과가 법정 사정에 비추어 현저히 불공평하면 법원은 분배액을 조정하거나 면제할 수 있습니다.',
      '이 청구권은 잔여재산의 차액이 있음을 안 날부터 2년, 어떤 경우에도 법정재산제가 소멸한 때부터 5년 안에 행사하지 않으면 소멸합니다.',
      '이 두 기간은 제1030조의1 청구에만 연결해야 하며, 소유권, 대여금, 손해배상, 이혼 후 배우자 부양이나 양육비의 기간으로 사용해서는 안 됩니다.',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('separates Articles 1056 and 1057, child support, property, cohabitation, and third-party claims', () => {
    const section = sectionBody(parsed.content, headings[6]);
    const requiredPhrases = [
      '민법 제1056조의 손해배상은 재판상 이혼에서 책임 있는 상대방을 상대로 한 재산상 손해와 법정 요건을 갖춘 비재산상 손해를 구분하여 검토하는 권리입니다.',
      '민법 제1057조의 이혼 후 배우자 부양은 재판상 이혼으로 과실 없는 배우자가 생활의 곤궁에 빠진 경우를 전제로 합니다.',
      '미성년 자녀에 대한 부양은 부모와 자녀 사이의 권리·의무이고, 제1057조의 전 배우자 사이 부양과 다릅니다.',
      '제1030조의1 잔여재산 차액분배도 혼인재산제의 정산이며 손해배상이나 부양을 대신하지 않습니다.',
      '배우자 외 사람에 대한 불법행위청구, 특정 재산의 반환, 대여금 또는 계약상 청구가 있다면 그 법적 근거와 당사자, 손해와 기한을 별도로 특정해야 합니다.',
      '모든 권리에 이혼일부터 하나의 5년 기간을 붙일 수 없고, 각 청구의 발생, 인식, 사건, 절차 상태와 시효 규칙을 따로 확인해야 합니다.',
      '실제 공유재산, 대여, 계약, 명의신탁, 신탁, 부당이득이나 불법행위가 있다면 혼인 여부와 별개인 재산·채권 관계로 분석할 수 있습니다.',
      '제3자를 상대로 한 청구에는 불법행위 또는 재산법상 별도의 법적 근거, 위법행위, 고의·과실, 손해와 인과관계 등 해당 요건과 증거가 필요합니다.',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Articles 1055 and 1055-1, the full Taiwan concept, review, and unresolved issues', () => {
    const section = sectionBody(parsed.content, headings[7]);
    const requiredPhrases = [
      '대만법의 정확한 개념은 미성년 자녀에 대한 권리·의무의 행사와 부담입니다.',
      '편의상 친권이나 양육권이라고 줄여 부를 수 있지만, 그 한 단어가 대만법상 권리와 의무 전체를 완전하게 번역한다고 보아서는 안 됩니다.',
      '민법 제1055조에 따라 부모는 이혼 후 누가 이러한 권리·의무를 행사하고 부담할지 합의할 수 있습니다.',
      '합의가 없거나 합의가 이루어지지 않으면 법원이 정할 수 있고, 합의가 자녀에게 불리하면 법원이 고치거나 필요한 결정을 할 수 있습니다.',
      '서명된 이혼합의서가 이후의 최선의 이익 심사를 차단하지 않으며, 합의 변경을 단순한 호적서식 제출만의 문제로 취급할 수 없습니다.',
      '민법 제1055조의1에 따른 심사에서는 자녀의 나이·성별·수와 건강, 자녀의 의사와 인격 발달 필요',
      '법원은 법이 정한 방식으로 자녀의 의견을 듣고, 관계 기관이나 아동복지 전문가의 조사와 의견을 참고할 수 있습니다.',
      '미해결 재산의 보전과 정산, 자녀의 거소·돌봄·의료·교육, 양육비와 면접교섭에 관해 어떤 합의나 법원 결정이 필요한지, 분쟁 중 안전과 생활의 연속성을 위한 임시처분이 필요한지 함께 점검해야 합니다.',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Article 1116-2 support and Family Act Article 194 contact and enforcement qualifications', () => {
    const section = sectionBody(parsed.content, headings[8]);
    const requiredPhrases = [
      '민법 제1116조의2에 따라 부모의 미성년 자녀 부양의무는 이혼 뒤에도 계속됩니다.',
      '이는 민법 제1057조의 전 배우자에 대한 이혼 후 부양과 다른 권리입니다.',
      '자녀의 현재 필요, 두 부모의 현재 자원과 생활사정, 기존 문서의 내용과 형식, 지급 경과 및 자녀의 최선의 이익을 함께 심사해야 합니다.',
      '가사사건법 제194조에 따른 집행에서도 방법은 자녀의 최선의 이익에 맞게 선택되어야 하며, 사건에 따라 직접강제 또는 간접강제 방식이 문제될 수 있습니다.',
      '접촉이 방해되었다는 사실만으로 즉시 물리력을 사용하거나 자녀를 인도하고, 상대방을 처벌하거나 미성년 자녀에 대한 권리·의무의 행사를 변경하는 결과가 보장되지는 않습니다.',
      '현재 합의·재판, 연락 기록, 실제 만남을 시도한 일시와 장소, 학교·의료 일정, 안전과 안정에 영향을 주는 사실을 정리해야 합니다.',
      '기존 집행권원의 문언, 지급기일, 미지급액과 지급내역이 중요하고',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks the seven relocation questions, non-treaty shortcut, and no unauthorized removal', () => {
    const section = sectionBody(parsed.content, headings[9]);
    const requiredPhrases = [
      '실제 주거·교육·의료·이동 비용과 자녀의 필요, 두 부모의 소득·재산과 돌봄 부담, 기존 합의나 재판을 함께 검토해야 합니다.',
      '누가 자녀의 거소와 여행을 결정할 권한을 갖는지, 다른 부모의 동의나 적용 가능한 법원 명령이 있는지를 먼저 확인합니다.',
      '이주가 자녀의 최선의 이익에 맞는지, 교육·의료와 생활의 연속성 및 남은 부모와의 지속적인 면접교섭에 어떤 영향을 주는지를 살핍니다.',
      '여권 발급과 사용, 대만과 목적지의 입국·출국, 체류·이민 및 가족관계 등록 요건은 친권에 관한 민사 결정과 구별됩니다.',
      '기존 자녀 재판이나 합의가 대만과 목적지에서 각각 승인·집행될 수 있는지도 확인해야 합니다.',
      '이탈이나 귀환 거부, 안전 위험이 구체적으로 우려되면 출국 전 또는 긴급 상황에서 어떤 보전조치나 임시처분을 신청할 수 있는지 관련 관할별로 검토해야 합니다.',
      '1980년 헤이그 국제아동탈취협약이 대만에 당연히 적용된다고 전제해서는 안 됩니다.',
      '기존 합의나 명령에 반하여 자녀를 데려가거나 돌려보내지 않는 행동은 권하지 않으며',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('uses the exact ordered nine-category evidence checklist and privacy prohibitions', () => {
    const section = sectionBody(parsed.content, headings[10]);
    const checklistStarts = [
      '1. 혼인증명과 대만 호적 자료, 각 당사자의 국적·주소지·상거소·현재 주소',
      '2. 서면 이혼합의서와 증인이 진정한 이혼 의사를 확인한 경위, 법원 서류, 송달기록, 조정조서·화해조서·판결 및 확정증명 자료',
      '3. 외국 혼인·이혼 기록과 외국 재판 또는 증명서, 대만 재외공관이나 권한 있는 기관의 인증, 중국어 번역과 인증·공증 여부, 대만에서의 승인·효력 및 등록 상태',
      '4. 적용되는 부부재산계약과 재산제, 자산·채무·등기명의·취득 원인과 시기, 자금 이체·처분·대출·상환·세금·평가 자료',
      '5. 주장하는 이혼사유의 사건과 시간을 중립적인 연표로 만들고, 적법하게 확보한 통신, 의료·경찰 자료와 그 밖의 증거',
      '6. 각 자녀의 나이·건강·교육·거주, 과거와 현재의 돌봄 경과, 발달 정도에 맞는 의사, 각 부모와의 관계 및 안전·안정에 관한 자료',
      '7. 현재 자녀 관련 합의·재판, 양육비 지급과 실제 비용, 면접교섭 경과, 여행문서, 이동 일정과 구체적인 국제이주 계획',
      '8. 신청·등록·항소·항고·청구권 행사·집행의 모든 날짜를 각각의 정확한 기산 사건과 연결합니다.',
      '9. 배우자와 자녀의 신분번호, 주소, 의료·교육·금융자료는 필요한 사람과 기관에 필요한 범위로만 전달하고',
    ];

    let previousIndex = -1;
    for (const item of checklistStarts) {
      const index = section.indexOf(item);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    expect(section).toContain(
      '불법 감시, 계정 접속, 휴대전화나 컴퓨터 침입, 위치추적, 법에 위반되는 녹음, 자녀의 사적 정보 공개를 증거수집 방법으로 삼아서는 안 됩니다.',
    );
    expect(section).toContain(
      '상대방에 대한 보복, 재산 은닉이나 허위 이전, 합의나 재판에 반한 자녀 이동도 사건과 자녀에게 추가 위험을 만들 수 있습니다.',
    );
  });

  it('uses exactly the ten official and three Korean internal body links once and in order', () => {
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
      expect(countOccurrences(parsed.content, url)).toBe(1);
    }
    for (const link of [...officialLinks, ...internalLinks]) {
      expect(countOccurrences(raw, link)).toBe(1);
    }
    expect(parsed.content).not.toMatch(/\]\(\/(?:zh-hant|en|ja)(?:\/|\))/);
  });

  it('ends with the exact disclaimer and author and nothing else', () => {
    expect(raw.trimEnd().endsWith(exactEnding)).toBe(true);
    expect(raw.trimEnd()).toMatch(
      /확인하시기 바랍니다\.\n\n\*\*증준외 변호사\(曾雋崴, Wei Tseng\)\*\*$/,
    );
    expect(countOccurrences(raw, disclaimer)).toBe(1);
    expect(countOccurrences(raw, author)).toBe(1);
  });

  it('freezes the final visible Korean eojeol count and calculated read time', () => {
    const publicText = extractPublicText(parsed.content);
    const visibleEojeolCount = publicText.split(/\s+/).filter(Boolean).length;
    const calculatedMinutes = Math.ceil(visibleEojeolCount / 180);

    expect(visibleEojeolCount).toBeGreaterThanOrEqual(2_300);
    expect(visibleEojeolCount).toBeLessThanOrEqual(3_600);
    expect(visibleEojeolCount).toBe(3_086);
    expect(calculatedMinutes).toBe(18);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}분 분량`);
    expect(post?.readTime).toBe(`${calculatedMinutes}분 분량`);
  });

  it('resolves the canonical and legacy alias to the identical complete Korean article', () => {
    expect(post).toBeDefined();
    expect(aliasPost).toBeDefined();
    expect(aliasPost?.slug).toBe(canonicalSlug);
    expect(aliasPost?.title).toBe(title);
    expect(aliasPost?.content).toBe(post?.content);
    expect(aliasPost?.faq).toEqual(faq);
    expect(post?.content).toContain(`## ${headings[0]}`);
    expect(post?.content).toContain(`## ${headings[12]}`);
    expect(post?.content).toContain(disclaimer);
    expect(post?.content).toContain(author);
    expect(post?.content).not.toContain(`# ${title}`);
    expect(post?.content).not.toContain(bodyImage);
  });

  it('rejects exact legacy wording, semantic overclaims, promotional copy, and wrong identity', () => {
    const serialized = JSON.stringify({
      raw,
      parsedContent: parsed.content,
      postTitle: post?.title,
      postContent: post?.content,
      postFaq: post?.faq,
    });
    const forbiddenLiterals = [
      '부양비와 재산 분할 청구권 모두 이혼일로부터 5년',
      '평균 월 소비 지출에 따라',
      '외국에서 결혼하고 외국에서 이혼하고자 한다면',
      '대만에서 이혼하려면 두 가지 방법',
      '집의 소유권을 회수할 수 없습니다',
      '집의 소유권을 회수할 가능성이 있습니다',
      '외도한 쪽은 이혼 소송을 제기할 수 없습니다',
      '현재 법 개정은 이루어지지 않았으므로',
      '먼저 경찰서에 실종 신고',
      '먼저 법원에 동거 의무 이행을 청구',
      '한국의 물가 수준에 맞춰 양육비',
      '법원에 강제 집행을 요청할 수 있습니다',
      '댓글이나 연락주세요',
      '부****양****비',
      '증준외 대만변호사입니다',
      '曾俊瑋',
      'img-01.jpg',
      '댓글',
      '私訊',
      'reply promptly',
      'お気軽にコメント',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(serialized).not.toContain(forbidden);
    }
    expect(raw).not.toMatch(/(?:모든|전부)[^.。\n]*재산[^.。\n]*절반/);
    expect(raw).not.toMatch(
      /혼전[^.。\n]*자금[^.。\n]*(?:소유권|집)[^.。\n]*(?:반드시|확실히|당연히)[^.。\n]*(?:회수|취득)/,
    );
    expect(raw).not.toMatch(
      /등기명의[^.。\n]*(?:모든|일체)[^.。\n]*(?:청구|권리)[^.。\n]*(?:배제|소멸|결정)/,
    );
    expect(raw).not.toMatch(
      /(?:판결문|조정조서)[^.。\n]*(?:받은|수령)[^.。\n]*30일/,
    );
    expect(raw).not.toContain(
      '공식 안내의 30일 제한은 해당 법원 사건이 확정된 뒤 이용할 수 있는 온라인 신청 채널의 기간',
    );
    expect(raw).not.toMatch(
      /30일[^.。\n]*(?:온라인 신청 채널|온라인 신청기간)[^.。\n]*(?:오프라인|일반 기한)/,
    );
    expect(raw).not.toMatch(
      /(?:유책|외도)[^.。\n]*(?:배우자|쪽)[^.。\n]*(?:언제나|절대|무조건)[^.。\n]*(?:이혼[^.。\n]*청구|청구[^.。\n]*이혼)/,
    );
    expect(raw).not.toMatch(
      /헌법재판소[^.。\n]*(?:제1052조|단서)[^.。\n]*(?:삭제|폐지|개정)(?:했|되었|됐다|한 것으로)/,
    );
    expect(raw).not.toMatch(
      /(?:실종신고|동거의무 이행소송)[^.。\n]*(?:반드시|필수)[^.。\n]*(?:먼저|선행)[^.。\n]*(?:입니다|이다|해야)/,
    );
    expect(raw).not.toMatch(
      /몇 달[^.。\n]*(?:집|가정)[^.。\n]*(?:떠나|부재)[^.。\n]*이혼사유[^.。\n]*(?:됩니다|성립)/,
    );
    expect(raw).not.toMatch(
      /양육비[^.。\n]*변경[^.。\n]*(?:예측할 수 없|예견할 수 없)[^.。\n]*(?:경우에만|때만|필수)/,
    );
    expect(raw).not.toMatch(
      /면접교섭[^.。\n]*(?:방해|차단)[^.。\n]*(?:즉시|바로|당연히)[^.。\n]*(?:강제|인도|친권 변경|양육권 변경|처벌)/,
    );
    expect(raw).not.toMatch(
      /한국[^.。\n]*(?:물가|생활비)[^.。\n]*(?:그대로|만으로|기준으로)[^.。\n]*양육비[^.。\n]*(?:결정|산정)/,
    );
    expect(raw).not.toMatch(
      /헤이그[^.。\n]*협약[^.。\n]*대만[^.。\n]*(?:당연히|자동으로|그대로)\s*적용(?:(?:됩니다|된다)[.。]|되는 것이 원칙입니다)/,
    );
    expect(raw).not.toMatch(
      /(?:변호사|법률사무소)[^.。\n]*(?:모든 권리|유리한 결과|승소|최대한)[^.。\n]*(?:보장|보호|달성)/,
    );
  });

  it('contains no invisible characters, cross-locale routes, or visible script leakage', () => {
    expect(raw).not.toContain('\uFEFF');
    expect(raw).not.toContain('\u00A0');
    expect(raw).not.toContain('\u200B');
    expect(raw).not.toMatch(/\]\(\/(?:zh-hant|en|ja)(?:\/|\))/);
    expect(parsed.content).not.toMatch(/[\u3040-\u30ff]/);
    expect(parsed.content).not.toMatch(
      /(?:reply promptly|お気軽にコメント|Taiwan Divorce Q&A)/,
    );
  });
});
