import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns/012-taiwan-overtaking-accident-liability.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const canonicalSlug = 'taiwan-overtaking-accident-liability';
const post = getColumnPost(canonicalSlug, 'ko');
const aliasPost = getColumnPost('overtaking-accident', 'ko');

const title = '대만 추월 사고의 책임은 어떻게 판단하나요?';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-overtaking-accident-liability';
const officialUrl =
  'https://laws.gov.taipei/Law/LawSearch/LawArticleContent/FL012455';
const supplementaryUrl = 'https://gonews.com.tw/car/daily/21934/';
const featuredImage =
  '../images/012-taiwan-overtaking-accident-liability/featured-01.jpg';
const incidentImage =
  '../images/012-taiwan-overtaking-accident-liability/img-01.jpg';
const featuredAlt =
  '대만 추월 사고의 책임 판단과 안전한 추월 절차를 설명하는 이미지';
const incidentAlt =
  '산길에서 오토바이와 앞선 차량 두 대의 추월 경로를 보여 주는 사고 도해';
const officialLabel = '대만 도로교통안전규칙 제101조';
const supplementaryLabel = '추월 규정과 절차 도해';
const headings = [
  '도로교통안전규칙 제101조가 정한 추월 요건',
  '사무소가 처리한 익명 사고 사례',
  '사고 책임을 판단할 때 확인할 사항',
] as const;
const internalLinks = [
  {
    label: '대만 소송 변호사 안내',
    href: '/ko/taiwan-litigation-lawyer',
  },
  {
    label: '한국어 가능한 대만 변호사',
    href: '/ko/korean-lawyer-in-taiwan',
  },
  {
    label: '대만 교통사고 처리 절차',
    href: '/ko/columns/taiwan-traffic-accident-procedure',
  },
] as const;
const disclaimer =
  '이 글은 대만의 추월 규정과 사고 책임 판단에 관한 일반적인 법률정보이며, 특정 사건에 대한 법률자문이나 결과 보장이 아닙니다. 실제 책임은 사고 장소, 차량 움직임, 속도, 신호, 증거, 감정 및 최신 법령에 따라 달라질 수 있으므로 구체적인 사건은 관련 자료를 바탕으로 개별 검토해야 합니다.';

const EXPECTED_VISIBLE_EOJEOL = 586;

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

function stripUrlsAndAssetPaths(value: string) {
  return value
    .replace(/https?:\/\/[^\s)"']+/g, ' ')
    .replace(/\.\.\/images\/[^\s)"']+/g, ' ')
    .replace(/\/images\/blog\/[^\s)"']+/g, ' ')
    .replace(/\/ko\/[^\s)"']+/g, ' ');
}

describe('Korean traffic column 012 — overtaking accident liability', () => {
  it('publishes the exact frontmatter, sole H1, dates, category, and featured image', () => {
    expect(parsed.data).toEqual({
      title,
      url: sourceUrl,
      lastmod: '2026-07-26',
      date_display: '2025년 9월 13일',
      read_time: '4분 분량',
      categories: ['대만 법률정보'],
      featured_image: featuredImage,
    });
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(raw).toContain(
      `# ${title}\n\n![${featuredAlt}](${featuredImage})`,
    );
    expect(countOccurrences(raw, sourceUrl)).toBe(1);
    expect(countOccurrences(raw, featuredImage)).toBe(2);
  });

  it('derives read_time from the exact visible Korean eojeol count at 180 per minute', () => {
    const visibleText = extractVisibleText(parsed.content);
    const visibleEojeolCount = visibleText.split(/\s+/).filter(Boolean).length;
    const calculatedMinutes = Math.ceil(visibleEojeolCount / 180);

    expect(visibleEojeolCount).toBe(EXPECTED_VISIBLE_EOJEOL);
    expect(calculatedMinutes).toBe(4);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}분 분량`);
    expect(post?.readTime).toBe(`${calculatedMinutes}분 분량`);
  });

  it('uses the three contracted H2 headings in the required order', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual([...headings]);
    expect(parsed.content.indexOf(`## ${headings[0]}`)).toBeLessThan(
      parsed.content.indexOf(`## ${headings[1]}`),
    );
    expect(parsed.content.indexOf(`## ${headings[1]}`)).toBeLessThan(
      parsed.content.indexOf(`## ${headings[2]}`),
    );
  });

  it('states every current Article 101 proposition with the official regulation URL once', () => {
    expect(countOccurrences(raw, officialUrl)).toBe(1);
    expect(raw).toContain(`[${officialLabel}](${officialUrl})`);
    expect(post?.content).toContain(`(${officialUrl})`);

    const article101Rules = [
      '제101조는 굽은 도로, 급경사, 좁은 다리, 터널, 교차로를 알리는 표지가 있는 구간과 철도 건널목, 공사장에서는 추월을 금지합니다.',
      '또한 학교나 병원 표지가 있는 장소나 구간, 그 밖의 추월 금지 표지 또는 표시가 있는 곳, 마주 오는 차량이 접근하는 경우, 앞쪽에 두 대 이상의 차량이 연속해 달리고 있는 경우에도 추월할 수 없습니다.',
      '같은 차로에서 앞 차량을 앞지르려면 뒤 차량 운전자는 먼저 경적을 짧게 두 번 울리거나 전조등을 한 번 깜빡여야 합니다.',
      '앞 차량이 양보하도록 강요하기 위해 경적이나 전조등을 반복적으로 사용해서는 안 됩니다.',
      '뒤 차량은 앞 차량이 속도를 줄이고 옆으로 비켜 주거나, 수신호 또는 우측 방향지시등으로 양보 의사를 표시한 뒤에야 추월할 수 있습니다.',
      '그다음 추월 차량은 좌측 방향지시등을 켜고, 앞 차량과 적어도 0.5미터의 간격을 유지한 채 좌측으로 지나가며, 안전한 거리를 확보한 뒤 우측 방향지시등을 켜고 원래 차로로 안전하게 복귀해야 합니다.',
      '이 같은 차로에서의 신호·양보 순서는 금지된 장소나 조건에서도 추월을 허용한다는 뜻이 아닙니다.',
    ];
    for (const rule of article101Rules) {
      expect(raw).toContain(rule);
      expect(post?.content).toContain(rule);
    }
  });

  it('keeps the anonymized matter fact-specific and rejects a universal one-signal fault rule', () => {
    const requiredCaseFacts = [
      '이 사무소가 처리한 익명 사건에서, 오토바이 운전자 A는 동승자 B를 태우고 산길을 달리고 있었습니다.',
      '앞에는 승용차 두 대가 있었고, 가장 앞의 1호 차량이 천천히 움직여 2호 차량과 오토바이도 함께 느린 속도로 진행하고 있었습니다.',
      'A는 두 차량을 모두 앞지르려고 반대 차로에 들어가 가속했습니다.',
      '방향지시등을 켠 뒤 1초도 되지 않아 반대 차로로 진입했습니다.',
      '오토바이는 제동할 여유가 부족해 2호 차량과 충돌했습니다.',
      'B는 심각한 두부 손상을 입고 현장에서 사망했고, A는 의식을 잃은 채 병원으로 옮겨졌습니다.',
      'A와 B의 가족들은 처음에 2호 차량의 급격한 차로 변경이 충돌의 주된 원인이라고 보았습니다.',
      '사건은 소송으로 이어졌고, 그 과정에서 사고에 관한 감정 평가가 여러 차례 진행되었습니다.',
      '감정 결과에 따르면 이 충돌의 주된 책임은 A에게 있다고 판단되었습니다.',
      '그 결론은 이 사건의 사실관계에 한정된 것이었습니다.',
      '감정에서는 A가 연속해 진행하던 앞선 차량 두 대를 추월하려 한 점, 반대 차로로 진입한 점, 제동할 여유를 확보하기 어려운 속도로 주행한 점, 규정된 경적·전조등 신호를 하지 않았던 점, 2호 차량의 차로 변경 동작, 도로·차로 구조와 그 밖에 확보된 증거를 함께 고려했습니다.',
      '규정된 신호를 한 번 빠뜨리면 언제나 책임이 정해진다는 뜻은 아닙니다.',
    ];
    for (const fact of requiredCaseFacts) {
      expect(raw).toContain(fact);
      expect(post?.content).toContain(fact);
    }

    expect(raw).not.toContain('앞 차의 동의');
    expect(raw).not.toContain('동의를 얻어야');
    expect(raw).not.toContain('보편적인 책임 원인');
    expect(raw).not.toContain('자동으로 책임이');
  });

  it('uses the contracted featured and incident images with exact Korean alts and drops the legacy graphic', () => {
    const imageBlocks = Array.from(
      parsed.content.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g),
      (match) => ({ alt: match[1], src: match[2] }),
    );
    expect(imageBlocks).toEqual([
      { alt: featuredAlt, src: featuredImage },
      { alt: incidentAlt, src: incidentImage },
    ]);
    expect(countOccurrences(raw, incidentImage)).toBe(1);
    expect(raw).not.toContain('img-02.jpg');
    expect(raw).not.toContain('한국어버전');
    expect(raw).not.toContain('한국어 버전');
    expect(raw).not.toContain('圖解超車法規和步驟');
  });

  it('preserves the secondary reading link and the three Korean internal links once each', () => {
    expect(countOccurrences(raw, supplementaryUrl)).toBe(1);
    expect(raw).toContain(`[${supplementaryLabel}](${supplementaryUrl})`);
    expect(raw).toContain('이차 자료이므로');
    expect(raw).toContain('현행 공식 규정');
    expect(post?.content).toContain(`(${supplementaryUrl})`);

    const markdownInternalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[1],
    );
    expect(markdownInternalTargets).toEqual(
      internalLinks.map(({ href }) => href),
    );
    for (const { label, href } of internalLinks) {
      expect(countOccurrences(raw, href)).toBe(1);
      expect(raw).toContain(`[${label}](${href})`);
      expect(post?.content).toContain(`(${href})`);
    }
  });

  it('loads the accepted slug and title through the canonical and overtaking-accident alias loaders', () => {
    expect(post).toMatchObject({
      slug: canonicalSlug,
      title,
      date: '2026-07-26',
      dateDisplay: '2025년 9월 13일',
      readTime: '4분 분량',
      category: 'legal',
      categoryLabel: '법률정보',
      featuredImage:
        '/images/blog/012-taiwan-overtaking-accident-liability/featured-01.jpg',
    });
    expect(post?.faq).toBeUndefined();

    expect(aliasPost).toBeDefined();
    expect(aliasPost?.slug).toBe(canonicalSlug);
    expect(aliasPost?.title).toBe(title);
    expect(aliasPost?.date).toBe(post?.date);
    expect(aliasPost?.content).toBe(post?.content);
  });

  it('ends with the exact non-promissory disclaimer and removes former guarantee language', () => {
    expect(raw.trimEnd().endsWith(disclaimer)).toBe(true);
    expect(countOccurrences(raw, disclaimer)).toBe(1);
    expect(post?.content).toContain(disclaimer);

    const forbiddenLegacyClaims = [
      '보험을 높게 들어',
      '경제적으로 큰 피해는 없었지만',
      '영원히 괴롭히',
      '과도한 사고 책임을 회피',
      '신체 후유증과 친구를 잃은 아픔',
      '추가 지식',
      '모두 추월할 때 조심하세요',
      'img-02.jpg',
      '\u200B',
      '\uFEFF',
      '\u00A0',
    ];
    for (const claim of forbiddenLegacyClaims) {
      expect(raw).not.toContain(claim);
    }
    expect(raw).not.toMatch(/과도한\s*사고\s*책임/);
    expect(raw).not.toMatch(/보험/);
  });

  it('keeps visible labels and prose free of Han-script leakage outside URLs and asset paths', () => {
    const visibleLabelsAndProse = stripUrlsAndAssetPaths(
      extractVisibleText(parsed.content),
    );
    const loadedPublicProse = stripUrlsAndAssetPaths(
      extractVisibleText(`${post?.title ?? ''}\n${post?.content ?? ''}`),
    );

    expect(visibleLabelsAndProse).not.toMatch(/[\u3400-\u4dbf\u4e00-\u9fff]/);
    expect(loadedPublicProse).not.toMatch(/[\u3400-\u4dbf\u4e00-\u9fff]/);
    expect(visibleLabelsAndProse).toContain(officialLabel);
    expect(visibleLabelsAndProse).toContain(supplementaryLabel);
    expect(visibleLabelsAndProse).toContain(featuredAlt);
    expect(visibleLabelsAndProse).toContain(incidentAlt);
  });
});
