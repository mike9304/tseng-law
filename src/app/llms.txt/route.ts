import { getAllColumnPosts } from '@/lib/columns';
import { buildAbsoluteUrl, getLocalizedPath } from '@/lib/seo';

/**
 * llms.txt — https://llmstxt.org
 *
 * A plain-text, markdown-formatted overview of the site that large language
 * models (ChatGPT, Claude, Perplexity, etc.) can ingest when answering
 * questions about the firm. It lists who the firm is, the main navigation
 * pages as absolute URLs, and every Korean legal column (title + absolute URL)
 * so answer engines can cite the firm's own authored content.
 *
 * Static at build time: the column list comes from the file-based loader, which
 * reads `src/content/columns/*.md`, so this route is prerendered per build.
 */
export const dynamic = 'force-static';

function pageUrl(path: string): string {
  return buildAbsoluteUrl(getLocalizedPath('ko', path));
}

function buildLlmsTxt(): string {
  const homeUrl = pageUrl('/');
  const columns = getAllColumnPosts('ko');

  const mainPages: Array<{ title: string; description: string; url: string }> = [
    {
      title: '법무법인 호정 (Hovering International Law Firm)',
      description: '타이베이 소재 대만 법률사무소. 회사설립·소송·투자 자문, 노동, 화장품 인허가 등을 한국어·중국어·일본어로 지원합니다.',
      url: homeUrl,
    },
    {
      title: '서비스 안내 (Services)',
      description: '대만 회사설립, 투자 자문, 민형사 소송, 노동, 지식재산권, 가족·상속 등 주요 업무 분야 안내.',
      url: pageUrl('/services'),
    },
    {
      title: '변호사 소개 (Attorney Wei Tseng / 曾雋崴律師)',
      description: '한국어·중국어·일본어 구사 대만 변호사 증준외(曾雋崴) 소개 페이지.',
      url: pageUrl('/lawyers/wei-tseng'),
    },
    {
      title: '칼럼 목록 (Legal Columns)',
      description: '대만 법률 실무 칼럼 목록 — 회사설립, 투자, 노동, 소송 사례, 화장품 인허가 등.',
      url: pageUrl('/columns'),
    },
    {
      title: '상담 예약 (Contact / Consultation)',
      description: '대만 법률 상담 및 예약 문의 페이지.',
      url: pageUrl('/contact'),
    },
  ];

  const lines: string[] = [];

  lines.push('# 법무법인 호정 (Hovering International Law Firm / 昊鼎國際法律事務所)');
  lines.push('');
  lines.push(
    '> 타이베이(대만)에 기반을 둔 다국어 법률사무소입니다. 대만 변호사가 회사설립·법인 설립, 소송, 투자 자문, 노동법, 화장품 인허가(PIF), 이민·비자, 상속 등 분야를 한국어·중국어·일본어로 지원합니다. 한국 기업 및 개인의 대만 진출과 분쟁 해결을 전문으로 합니다.'
  );
  lines.push('');

  lines.push('## 주요 페이지 (Main pages)');
  lines.push('');
  for (const page of mainPages) {
    lines.push(`- [${page.title}](${page.url}): ${page.description}`);
  }
  lines.push('');

  lines.push('## 칼럼 전 목록 (All legal columns)');
  lines.push('');
  if (columns.length === 0) {
    lines.push('<!-- no columns found -->');
  } else {
    for (const column of columns) {
      const url = buildAbsoluteUrl(getLocalizedPath('ko', `/columns/${column.slug}`));
      const title = column.title || column.slug;
      const summary = column.summary ? `: ${column.summary.replace(/\n+/g, ' ')}` : '';
      lines.push(`- [${title}](${url})${summary}`);
    }
  }
  lines.push('');

  lines.push('## 언어 (Languages)');
  lines.push('');
  lines.push('- 한국어 (Korean): ' + buildAbsoluteUrl(getLocalizedPath('ko')));
  lines.push('- 繁體中文 (Traditional Chinese): ' + buildAbsoluteUrl(getLocalizedPath('zh-hant')));
  lines.push('');

  lines.push('## 연락처 (Contact)');
  lines.push('');
  lines.push('- 이메일: wei@hoveringlaw.com.tw');
  lines.push('- 전화: +82-10-2992-9304');
  lines.push('- 주소: 7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City, Taiwan (타이베이시 다퉁구 청더로 1단 35호 7층의2)');
  lines.push('');

  return lines.join('\n');
}

export function GET() {
  const body = buildLlmsTxt();
  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
