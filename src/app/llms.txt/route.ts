import { getAllColumnPosts } from '@/lib/columns';
import {
  CONSULTATION_EMAIL,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import { siteLocales, type SiteLocale } from '@/lib/locales';
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

function pageUrl(locale: SiteLocale, path: string): string {
  return buildAbsoluteUrl(getLocalizedPath(locale, path));
}

function buildLlmsTxt(): string {
  const columns = getAllColumnPosts('ko');

  const localeLabels: Record<SiteLocale, string> = {
    ko: '한국어 (Korean)',
    'zh-hant': '繁體中文 (Traditional Chinese)',
    en: 'English',
    ja: '日本語 (Japanese)',
  };
  const pageLabels: Record<SiteLocale, readonly string[]> = {
    ko: ['법무법인 호정', '서비스 안내', '증준외(曾雋崴) 대만 변호사', '법률 칼럼', '문의 및 사무소 안내'],
    'zh-hant': ['昊鼎國際法律事務所', '服務領域', '曾雋崴律師', '法律專欄', '聯絡與諮詢'],
    en: ['Hovering International Law Firm', 'Services', 'Attorney Wei Tseng', 'Legal Columns', 'Contact and Offices'],
    ja: ['昊鼎国際法律事務所', '業務分野', '曾雋崴弁護士', '法律コラム', 'お問い合わせ・事務所案内'],
  };
  const mainPagePaths = [
    '',
    '/services',
    '/lawyers/wei-tseng',
    '/columns',
    '/contact',
  ] as const;

  const lines: string[] = [];

  lines.push('# 법무법인 호정 (Hovering International Law Firm / 昊鼎國際法律事務所)');
  lines.push('');
  lines.push(
    '> 타이베이(대만)에 기반을 둔 다국어 법률사무소입니다. 대만 변호사가 회사설립·법인 설립, 소송, 투자 자문, 노동법, 화장품 인허가(PIF), 이민·비자, 상속 등 분야를 한국어·중국어·일본어로 지원합니다. 한국 기업 및 개인의 대만 진출과 분쟁 해결을 전문으로 합니다.'
  );
  lines.push('');

  lines.push('## 주요 페이지 (Main pages)');
  lines.push('');
  for (const locale of siteLocales) {
    lines.push(`### ${localeLabels[locale]}`);
    lines.push('');
    for (const [index, path] of mainPagePaths.entries()) {
      lines.push(`- [${pageLabels[locale][index]}](${pageUrl(locale, path)})`);
    }
    lines.push('');
  }

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
  for (const locale of siteLocales) {
    lines.push(`- ${localeLabels[locale]}: ${pageUrl(locale, '')}`);
  }
  lines.push('');

  lines.push('## 연락처 (Contact)');
  lines.push('');
  lines.push(`- 공식 상담 이메일: ${CONSULTATION_EMAIL}`);
  lines.push(
    `- 상담 신청: [증준외 대만 변호사 이메일 상담](${getConsultationPublicMailto('ko')})`,
  );
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
