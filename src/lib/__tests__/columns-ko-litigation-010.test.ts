import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns/010-taiwan-gym-injury-lawsuit.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const canonicalSlug = 'taiwan-gym-injury-lawsuit';
const post = getColumnPost(canonicalSlug, 'ko');
const aliasPost = getColumnPost('gym-injury-lawsuit', 'ko');

const title =
  '대만 헬스장 부상 손해배상: 1심 사례·청구기한·증거·배상항목';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-gym-injury-lawsuit';
const featuredImage =
  '../images/010-taiwan-gym-injury-lawsuit/featured-01.jpg';
const imagePrefix = '../images/010-taiwan-gym-injury-lawsuit/';
const judgmentUrl =
  'https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=TCDV,109,%E6%B6%88,7,20220124,1';
const officialAmount = '1,579,589 대만달러';

const lawUrls = [
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=7&pcode=J0170001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=287&pcode=C0000001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=237&pcode=C0010001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=197&pcode=B0000001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=51&pcode=J0170001',
];

const mediaRecords = [
  {
    image: 'img-02.jpg',
    caption:
      '남자 대학생, 90kg 데드리프트 뒤 추간판 파열…헬스장에 손해배상 청구',
    url: 'https://tw.news.yahoo.com/%E7%94%B7%E5%A4%A7%E7%94%9F%E7%A1%AC%E8%88%8990%E5%85%AC%E6%96%A4-%E6%A4%8E%E9%96%93%E7%9B%A4%E7%A0%B4%E8%A3%82-%E6%80%92%E5%91%8A%E5%81%A5%E8%BA%AB%E6%88%BF%E6%B1%82%E5%84%9F-095800997.html',
  },
  {
    image: 'img-03.jpg',
    caption:
      '한국인 남자 대학생, 90kg 데드리프트 중 추간판 파열…1심에서 157만 대만달러 배상·항소심 합의 보도',
    url: 'https://www.ettoday.net/amp/amp_news.php7?news_id=2475272&ref=mw&from=google.com',
  },
  {
    image: 'img-04.jpg',
    caption:
      '한국인 남자 대학생, 90kg 데드리프트 중 부상…1심 157만 대만달러 배상·항소심 합의 보도',
    url: 'https://tw.news.yahoo.com/%E9%9F%93%E7%94%B7%E5%A4%A7%E7%94%9F-%E7%A1%AC%E8%88%8990%E5%85%AC%E6%96%A4-%E9%87%80%E5%82%B7%E7%8D%B2%E8%B3%A0157%E8%90%AC-%E5%81%A5%E8%BA%AB%E5%B7%A5%E5%BB%A0%E4%BA%8C%E5%AF%A9%E4%BD%8E%E8%AA%BF%E5%92%8C%E8%A7%A3-013448072.html',
  },
  {
    image: 'img-05.jpg',
    caption:
      '남자 대학생, 90kg 데드리프트 뒤 추간판 파열…헬스장에 손해배상 청구',
    url: 'https://news.ebc.net.tw/news/living/362075',
  },
  {
    image: 'img-06.jpg',
    caption:
      'PTT 게시글: 한국인 남자 대학생, 90kg 데드리프트 중 추간판 파열…1심, 헬스장 측에 157만 대만달러 배상 명령',
    url: 'https://www.ptt.cc/bbs/MuscleBeach/M.1680935985.A.BF6.html',
  },
  {
    image: 'img-07.jpg',
    caption:
      '블로그: 체중 70kg인 한국인 대학생의 90kg 데드리프트 부상과 100만 대만달러를 넘는 배상…헬스장에 잘못이 있었나? 운동하는 사람의 자세는?',
    url: 'https://blog.udn.com/blackjack/179081715',
  },
  {
    image: 'img-08.jpg',
    caption:
      '법률 해설: 남자 대학생, 데드리프트 중 추간판 파열…1심, 유명 헬스장 측에 157만 대만달러 배상 명령',
    url: 'https://lawdb.tw/2023/04/12/%E7%94%B7%E5%A4%A7%E7%94%9F%E7%B7%B4%E7%A1%AC%E8%88%89%E6%A4%8E%E9%96%93%E7%9B%A4%E7%A0%B4%E8%A3%82%EF%BC%8C%E7%9F%A5%E5%90%8D%E5%81%A5%E8%BA%AB%E6%88%BF%E5%88%A4%E8%B3%A0%EF%BC%91%EF%BC%95%EF%BC%97/',
  },
  {
    image: 'img-09.jpg',
    caption:
      '판결 읽기: 헬스장 초보자에게 90kg 데드리프트를 지시해 급성 추간판 파열이 발생한 사건',
    url: 'https://www.instagram.com/p/Crp4vJag7v3/',
  },
] as const;

const finalMedia = {
  image: 'img-10.jpg',
  caption:
    '한국인 남자 대학생이 개인 트레이닝 중 90kg 데드리프트를 하다 추간판이 파열됐나?',
} as const;

const faqHeadings = [
  '1. 대만 헬스장 부상에는 어떤 법적 절차를 검토할 수 있나요?',
  '2. 형사 고소와 민사 손해배상에는 어떤 기한이 적용되나요?',
  '3. 사고 직후 어떤 증거를 어떻게 보존해야 하나요?',
  '4. 헬스장에 어떤 손해항목을 청구할 수 있나요?',
  '5. 헬스장에 책임보험이 있어도 배상 여부나 금액이 다투어질 수 있나요?',
];

const internalLinks = [
  '/ko/taiwan-litigation-lawyer',
  '/ko/korean-lawyer-in-taiwan',
  '/ko/taiwan-lawyer',
];

function countOccurrences(value: string, needle: string) {
  return value.split(needle).length - 1;
}

/**
 * Reproduce the Korean editorial read-time convention used by this corpus:
 * turn Markdown into visible labels, normalize whitespace, count eojeol
 * (whitespace-separated units), then round `eojeol / 180` up to a minute.
 */
function extractVisibleText(content: string) {
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

describe('Korean litigation column 010 — gym injury damages', () => {
  it('publishes the exact metadata, title, sole H1, and five FAQ sections', () => {
    expect(parsed.data).toEqual({
      title,
      url: sourceUrl,
      lastmod: '2026-07-25',
      date_display: '2025년 9월 13일',
      read_time: '7분 분량',
      categories: ['소송사례 분석'],
      featured_image: featuredImage,
    });
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(faqHeadings);
    expect(raw).toContain(
      `# ${title}\n\n![대표 이미지](${featuredImage})`,
    );
  });

  it('derives the seven-minute read time from the exact visible Korean eojeol count', () => {
    const visibleText = extractVisibleText(parsed.content);
    const visibleEojeolCount = visibleText.split(/\s+/).filter(Boolean).length;
    const calculatedMinutes = Math.ceil(visibleEojeolCount / 180);

    expect(visibleEojeolCount).toBe(1_234);
    expect(calculatedMinutes).toBe(7);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}분 분량`);
    expect(post?.readTime).toBe(`${calculatedMinutes}분 분량`);
  });

  it('attributes the exact official first-instance result and later appeal settlement correctly', () => {
    expect(countOccurrences(raw, sourceUrl)).toBe(1);
    expect(countOccurrences(raw, judgmentUrl)).toBe(1);
    expect(countOccurrences(raw, officialAmount)).toBe(1);
    expect(raw).toContain(`[${officialAmount}](${judgmentUrl})`);
    expect(raw).toContain('이용자의 운동 경험과 건강 상태');
    expect(raw).toContain(
      `타이중 지방법원은 2022년 1월 24일 109년도 소비자 사건 제7호에 관한 1심 판결에서 피고가 [${officialAmount}](${judgmentUrl})와 판결에 기재된 이자를 지급하도록 명했습니다.`,
    );
    expect(raw).toContain(
      '그 뒤 항소심에서 당사자들이 합의했다는 내용은 언론 보도로 알려졌습니다.',
    );
    expect(raw).toContain(
      '공식 1심 판결만으로는 항소심의 처리 결과나 합의금액을 확인할 수 없으므로',
    );
    expect(raw).not.toContain('1심 판결이 확정되었습니다');
    expect(raw).not.toContain('항소심에서 합의했습니다');
    expect(raw).not.toMatch(/합의금(?:은|액은|으로|액:)\s*[\d,]+/);
  });

  it('links every controlling provision once and locks its fact-dependent limits', () => {
    for (const url of lawUrls) {
      expect(countOccurrences(raw, url)).toBe(1);
      expect(post?.content).toContain(`(${url})`);
    }

    const requiredRules = [
      '서비스가 제공 당시의 전문적 또는 기술적 기준에 비추어 합리적으로 기대되는 안전성을 갖추도록 해야 한다고 정합니다.',
      '헬스장에서 부상이 발생할 때마다 사업자나 트레이너의 책임이 인정되는 것은 아닙니다.',
      '구체적으로 어떠한 주의의무가 있었는지, 그 의무를 위반했는지, 위반과 부상 사이에 인과관계가 있는지, 실제 손해가 발생했는지, 상대방에게 어떤 항변이 있는지, 각 주장과 항변을 뒷받침할 증거가 있는지를 사건별로 판단해야 합니다.',
      '과실상해죄의 법정 요건이 충족된다면 형사 고소를 검토할 수 있습니다.',
      '민사상 손해배상청구도 검토할 수 있지만, 계약책임·불법행위책임·소비자보호책임 가운데 어떤 근거가 적용되는지와 책임 범위는 구체적인 사실관계에 따라 달라집니다.',
      '형법 제284조의 과실상해죄는 고소가 있어야 공소를 제기할 수 있는 범죄입니다.',
      '고소권자는 원칙적으로 범인을 안 날부터 6개월 안에 고소해야 합니다.',
      '피해자가 손해와 배상의무자를 모두 안 때부터 원칙적으로 2년 동안 행사하지 않으면 소멸하고, 불법행위가 있은 때부터 10년이 지나도 소멸합니다.',
      '다른 청구원인이 문제 되거나 기산점·기간의 진행·중단 등에 관한 다른 규정이 적용되는지는 사실관계에 따라 달라질 수 있습니다.',
    ];
    for (const rule of requiredRules) {
      expect(raw).toContain(rule);
      expect(post?.content).toContain(rule);
    }
  });

  it('qualifies evidence-preservation steps without promising compulsion or police recovery', () => {
    const requiredEvidenceRules = [
      'CCTV 영상뿐 아니라 진료기록과 진단서, 의료비·교통비·간병비 영수증, 헬스장 및 트레이너와 주고받은 메시지, 목격자의 진술, 수업 예약과 출석기록, 운동계획표와 훈련기록',
      '내용증명이나 변호사 명의의 서면으로 헬스장에 보존을 요청하는 방법을 검토할 수 있습니다.',
      '무엇을 언제 요청했는지를 기록하는 실무적 조치입니다.',
      '그 자체로 상대방에게 영상을 보존할 법적 의무를 새로 부과하거나 삭제를 막는 것은 아니며',
      '영상이 남지 않았다는 사정만으로 법원이 자동으로 불리한 판단을 하는 것도 아닙니다.',
      '수사기관이 적법한 확보 또는 보전의 근거가 있는지 판단하도록 할 수 있습니다.',
      '경찰이나 검찰이 반드시 CCTV를 확보해 준다는 뜻은 아니므로',
    ];
    for (const rule of requiredEvidenceRules) {
      expect(raw).toContain(rule);
    }

    const forbiddenPromises = [
      '헬스장이 이를 파기하지 못하도록',
      '헬스장이 증거를 파기하면 소송에서 불리하게 작용합니다',
      '경찰이 헬스장에서 CCTV를 확보하도록 합니다',
      '내용증명서나 변호사 서신을 보내면 법적 조치를 취하겠다는 의사를 표시하게 되어 헬스장이 압박을 느끼고',
      '보존 요청을 받으면 삭제할 수 없습니다',
      '법원이 반드시 불리하게 판단합니다',
    ];
    for (const promise of forbiddenPromises) {
      expect(raw).not.toContain(promise);
    }
  });

  it('covers all permitted damage categories and the qualified Article 51 multipliers', () => {
    const requiredDamageRules = [
      '**의료비**',
      '**간병비 또는 돌봄비용**',
      '**교통비**',
      '**노동능력 상실에 따른 손해**',
      '**회복기간 중 일실수입**',
      '**비재산적 손해**',
      '**징벌적 손해배상**',
      '청구를 검토할 수 있는 손해 항목은 다음과 같습니다.',
      '진료·검사·치료·약제·재활에 실제로 지출한 비용은 영수증과 진료기록으로 입증합니다.',
      '치료 경과에 비추어 간병이 필요했는지',
      '치료를 위해 의료기관을 오가는 데 필요한 비용은 이동기록과 영수증 등으로 입증합니다.',
      '장해율 하나만으로 배상액이 확정되거나 손실이 은퇴 시점까지 자동 계산되는 것은 아닙니다.',
      '고의로 손해가 발생한 경우에는 실제 손해의 최대 5배, 중대한 과실이면 최대 3배, 과실이면 실제 손해액의 최대 1배까지',
      '해당 사건에 적용되는지와 실제 배상 여부·금액은 구체적인 요건과 증거에 대한 법원의 판단에 따릅니다.',
    ];
    for (const rule of requiredDamageRules) {
      expect(raw).toContain(rule);
    }
  });

  it('keeps insurance, available procedures, and the closing advice properly qualified', () => {
    const requiredQualifications = [
      '그 자체로 헬스장이나 트레이너의 법적 책임을 인정하거나 지급액을 확정하지는 않습니다.',
      '보험계약의 보상한도와 면책·제외조항, 사고와 부상 사이의 인과관계, 손해항목별 필요성과 금액',
      '보험자가 제시한 금액이나 피해자가 요구한 금액이 곧 법원의 인정액이 되는 것은 아니며, 장해평가 결과도 배상액을 자동으로 결정하지 않습니다.',
      '우선 필요한 진료를 받고, 확보 가능한 자료가 사라지기 전에 보존하며, 사건에 적용될 수 있는 기한과 절차에 관해 조기에 개별 자문을 받는 것이 중요합니다.',
      '협상, 소비자 민원이나 조정, 형사 고소, 민사 손해배상청구는 모두 사건에 따라 선택할 수 있는 수단이며, 언제나 전부 진행해야 하는 절차는 아닙니다.',
    ];
    for (const qualification of requiredQualifications) {
      expect(raw).toContain(qualification);
    }
  });

  it('preserves every image and media URL in order with safe standalone markup', () => {
    const imagePaths = Array.from(
      raw.matchAll(
        /!\[[^\]]*\]\((\.\.\/images\/010-taiwan-gym-injury-lawsuit\/[^)]+)\)/g,
      ),
      (match) => match[1],
    );
    expect(imagePaths).toEqual([
      featuredImage,
      `${imagePrefix}img-01.jpg`,
      ...Array.from(
        { length: 9 },
        (_, index) => `${imagePrefix}img-${String(index + 2).padStart(2, '0')}.jpg`,
      ),
    ]);
    expect(countOccurrences(raw, featuredImage)).toBe(2);
    for (let imageNumber = 1; imageNumber <= 10; imageNumber += 1) {
      expect(
        countOccurrences(
          raw,
          `img-${String(imageNumber).padStart(2, '0')}.jpg`,
        ),
      ).toBe(1);
    }

    const expectedCaptionOccurrences = new Map<string, number>();
    for (const { image, caption, url } of mediaRecords) {
      const mediaBlock = `![${caption}](${imagePrefix}${image})\n\n[${caption}](${url})`;
      expect(raw).toContain(mediaBlock);
      expect(countOccurrences(raw, url)).toBe(1);
      expect(post?.content).toContain(`[${caption}](${url})`);
      expectedCaptionOccurrences.set(
        caption,
        (expectedCaptionOccurrences.get(caption) ?? 0) + 2,
      );
    }
    for (const [caption, occurrences] of expectedCaptionOccurrences) {
      expect(countOccurrences(raw, caption)).toBe(occurrences);
    }

    const finalMediaBlock = `![${finalMedia.caption}](${imagePrefix}${finalMedia.image})\n\n**${finalMedia.caption}**`;
    expect(raw).toContain(finalMediaBlock);
    expect(countOccurrences(raw, finalMedia.caption)).toBe(2);
    expect(raw).not.toContain('[![');
    expect(raw).not.toMatch(/\[https?:\/\/[^\]]+\]\(https?:\/\/[^)]+\)/);

    const visibleMediaCaptions = [
      ...mediaRecords.map(({ caption }) => caption),
      finalMedia.caption,
    ].join('\n');
    expect(visibleMediaCaptions).not.toMatch(/[\u3400-\u4dbf\u4e00-\u9fff]/);
  });

  it('uses only the approved external URLs and exactly three Korean internal links', () => {
    const allExternalUrls =
      raw.match(/https?:\/\/[^\s)"']+/g) ?? [];
    expect(allExternalUrls).toEqual([
      sourceUrl,
      judgmentUrl,
      ...mediaRecords.map(({ url }) => url),
      ...lawUrls,
    ]);

    const markdownInternalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[1],
    );
    expect(markdownInternalTargets).toEqual(internalLinks);
    expect(
      parsed.content.match(/\/(?:ko|zh-hant|en|ja)(?:\/[^\s)]*)?/g),
    ).toEqual(internalLinks);
    for (const link of internalLinks) {
      expect(countOccurrences(raw, link)).toBe(1);
      expect(post?.content).toContain(`(${link})`);
    }
  });

  it('loads the complete Korean article through the public column API and legacy alias', () => {
    expect(post).toMatchObject({
      slug: canonicalSlug,
      title,
      date: '2026-07-25',
      dateDisplay: '2025년 9월 13일',
      readTime: '7분 분량',
      category: 'case',
      categoryLabel: '소송사례',
      featuredImage:
        '/images/blog/010-taiwan-gym-injury-lawsuit/featured-01.jpg',
    });
    expect(post?.faq).toBeUndefined();

    const expectedRendererContent = parsed.content
      .replace(/\(\.\.\/images\/([^)]+)\)/g, '(/images/blog/$1)')
      .trimStart()
      .replace(/^#\s+.+\n*/, '')
      .replace(/^\s*!\[[^\]]*\]\([^)]+\)\s*\n*/, '')
      .trimStart()
      .replace(/\n?\s*!\[[^\]]*\]\([^)]+\)\s*\n?/g, '\n\n')
      .trim();
    expect(post?.content).toBe(expectedRendererContent);
    expect(post?.content).not.toMatch(/!\[[^\]]*\]\([^)]+\)/);
    expect(post?.content).toContain(`[${officialAmount}](${judgmentUrl})`);
    expect(post?.content).toContain(`## ${faqHeadings[0]}`);
    expect(post?.content).toContain(`## ${faqHeadings.at(-1)}`);

    expect(aliasPost).toBeDefined();
    expect(aliasPost?.slug).toBe(canonicalSlug);
    expect(aliasPost?.title).toBe(post?.title);
    expect(aliasPost?.date).toBe(post?.date);
    expect(aliasPost?.content).toBe(post?.content);
  });

  it('removes the old legal error, cultural claims, guarantees, and mandatory-suit language', () => {
    const forbiddenLegacyClaims = [
      '민법 제198조',
      'flno=198',
      '안녕하세요. 대만 변호사 증준외입니다.',
      '운동자의 경험과 건강상태',
      '109年度消字第7號',
      '한국 분들은 운동을 매우 좋아',
      '대만 소비자들의 의식이 약',
      '대만 사람들은 매우 놀라워',
      '대만 최대의 헬스장',
      '유일한 상장 헬스 브랜드',
      '대만 헬스계, 체육계, 대만 변호사계, 법률계에서 큰 화제',
      '헬스장에는 보통 CCTV가 설치',
      '헬스장은 CCTV 화면이 불리하므로',
      '대만 헬스장은 보통 보험에 가입',
      '대만 보험사는',
      '원고가 은퇴할 때까지의 모든',
      '꼭 소송을 제기해',
      '자신의 권리를 적극적으로 주장해야',
      '추가 질문이 있다면 언제든지',
      '대만 변호사의 중요한 노하우',
      '/zh-hant/',
      '/en/',
      '/ja/',
      '\uFEFF',
      '\u00A0',
    ];
    for (const claim of forbiddenLegacyClaims) {
      expect(raw).not.toContain(claim);
    }
    expect(raw).not.toMatch(/(?:반드시|무조건)\s*소송(?:을)?\s*(?:제기|진행)/);
  });
});
