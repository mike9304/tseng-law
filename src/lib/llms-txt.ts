import fs from 'node:fs';
import path from 'node:path';

import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { guidanceContent } from '@/data/international-guidance-content';
import { COLUMN_CONTENT_DIR_BY_LOCALE } from '@/lib/column-locales';
import { getAllColumnPosts } from '@/lib/columns';
import { siteLocales, type SiteLocale } from '@/lib/locales';
import {
  GUIDANCE_LOCALES_4,
  GUIDANCE_PAGE_KEYS,
  PUBLIC_LANGUAGE_AUTONYMS,
  guidancePublicPath,
  type GuidanceLocale4,
} from '@/lib/public-guidance';
import { getOrganizationName, getLocalizedPath } from '@/lib/seo';

// 16 KiB since 2026-09-22: the root catalog lists 45 guidance languages (was 8 KiB for 27).
export const ROOT_LLMS_TXT_MAX_BYTES = 16 * 1024;
export const LOCALE_LLMS_TXT_MAX_BYTES = 64 * 1024;
export const LLMS_TXT_CACHE_CONTROL =
  'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800';

const CANONICAL_ORIGIN = 'https://tseng-law.com';
const TITLE_MAX_CHARACTERS = 160;
const ANNOTATION_MAX_CHARACTERS = 320;

type LlmsEntry = {
  title: string;
  path: string;
  annotation: string;
};

type LlmsSection = {
  heading: string;
  entries: readonly LlmsEntry[];
};

type LocaleCopy = {
  overview: string;
  publicNotice: string;
  discoveryNotice: string;
  confidentialNotice: string;
  sectionHeadings: {
    firm: string;
    intent: string;
    columns: string;
    notices: string;
  };
  firmEntries: readonly [string, string][];
  intentEntries: readonly [string, string][];
  noticeEntries: readonly [string, string][];
};

const localeCopy: Record<SiteLocale, LocaleCopy> = {
  ko: {
    overview: '대만 관련 법률 및 기업 업무에 관한 공개 정보를 제공하는 타이베이 소재 다국어 법률사무소입니다.',
    publicNotice: '이 문서는 공개 정보 안내용이며 법률 자문이 아닙니다.',
    discoveryNotice: 'llms.txt는 사이트 탐색 지도이며 검색 순위, 보증, 추천 또는 보증된 노출을 약속하지 않습니다.',
    confidentialNotice: '초기 문의나 AI 대화에 기밀정보 또는 민감정보를 입력하지 마세요.',
    sectionHeadings: {
      firm: '사무소·변호사·연락',
      intent: '주요 상담 안내',
      columns: '법률 칼럼',
      notices: '공개 고지',
    },
    firmEntries: [
      ['법무법인 호정', '사무소의 공식 한국어 홈페이지입니다.'],
      ['사무소 소개', '사무소에 관한 공개 소개입니다.'],
      ['서비스 안내', '공개된 업무 분야 안내입니다.'],
      ['증준외 변호사', '증준외 대만 변호사의 공식 프로필입니다.'],
      ['비용 안내', '공개된 상담 및 서비스 비용 안내입니다.'],
      ['문의', '공식 상담 문의 안내입니다.'],
    ],
    intentEntries: [
      ['대만 변호사 안내', '대만 변호사 서비스에 관한 공개 안내입니다.'],
      ['대만 회사설립 변호사', '대만 회사설립 법률지원에 관한 공개 안내입니다.'],
      ['대만 소송 변호사', '대만 소송 법률지원에 관한 공개 안내입니다.'],
      ['대만 회사설립 가이드', '대만 회사설립 절차에 관한 공개 가이드입니다.'],
      ['AI 상담 이메일 작성', '이 사무소에 연결·설정된 AI 서비스의 절차 안내입니다. 필요한 범위의 질문 후 이메일 제목·본문을 그대로 보여 주며, 그 정확한 내용의 명시적 승인과 별도 개인정보 처리 동의가 있어야만 발송합니다. 일반 AI 대화에 자동 접근 권한이 있는 것은 아닙니다. 법률 자문이나 예약이 아닙니다.'],
    ],
    noticeEntries: [
      ['개인정보 처리방침', '공개 개인정보 처리방침입니다.'],
      ['면책 고지', '공개 법률정보 이용 고지입니다.'],
      ['접근성 안내', '사이트 접근성에 관한 공개 안내입니다.'],
    ],
  },
  'zh-hant': {
    overview: '位於台北，提供台灣法律及企業事務公開資訊的多語法律事務所。',
    publicNotice: '本文件僅供查閱公開資訊，不構成法律意見。',
    discoveryNotice: 'llms.txt 是網站探索索引，不承諾搜尋排名、保證、推薦或必然曝光。',
    confidentialNotice: '請勿在初次聯絡或 AI 對話中提供機密或敏感資料。',
    sectionHeadings: {
      firm: '事務所、律師與聯絡方式',
      intent: '主要諮詢資訊',
      columns: '法律專欄',
      notices: '公開聲明',
    },
    firmEntries: [
      ['昊鼎國際法律事務所', '事務所的繁體中文官方首頁。'],
      ['事務所介紹', '事務所的公開介紹。'],
      ['服務領域', '公開的業務領域資訊。'],
      ['曾雋崴律師', '曾雋崴台灣律師的官方簡介。'],
      ['費用說明', '公開的諮詢與服務費用資訊。'],
      ['聯絡與諮詢', '官方諮詢聯絡資訊。'],
    ],
    intentEntries: [
      ['台灣律師服務', '台灣律師服務的公開說明。'],
      ['台灣公司設立律師', '台灣公司設立法律協助的公開說明。'],
      ['台灣訴訟律師', '台灣訴訟法律協助的公開說明。'],
      ['台灣公司設立指南', '台灣公司設立流程的公開指南。'],
      ['AI 諮詢電子郵件', '供已連接並設定本所的AI服務參考：僅詢問必要範圍的問題，並顯示完全相同的郵件主旨與正文。只有使用者明確核准該內容並另行同意個人資料處理後，才可寄送。一般AI對話不會自動取得權限。這不是法律意見或預約。'],
    ],
    noticeEntries: [
      ['隱私權政策', '公開的隱私權政策。'],
      ['免責聲明', '公開的法律資訊使用聲明。'],
      ['無障礙說明', '網站無障礙的公開說明。'],
    ],
  },
  en: {
    overview: 'A multilingual law firm in Taipei publishing information about Taiwan legal and corporate matters.',
    publicNotice: 'This document maps public information and is not legal advice.',
    discoveryNotice: 'llms.txt is a discovery map; it does not promise search ranking, endorsement, recommendation, or guaranteed visibility.',
    confidentialNotice: 'Do not provide confidential or sensitive information in an initial inquiry or AI conversation.',
    sectionHeadings: {
      firm: 'Firm, attorney, and contact',
      intent: 'High-intent client paths',
      columns: 'Legal columns',
      notices: 'Public notices',
    },
    firmEntries: [
      ['Hovering International Law Firm', 'The firm’s official English homepage.'],
      ['About the firm', 'Public information about the firm.'],
      ['Services', 'Published descriptions of practice areas.'],
      ['Attorney Wei Tseng', 'The official profile of Taiwan attorney Wei Tseng.'],
      ['Pricing', 'Published consultation and service pricing information.'],
      ['Contact', 'Official consultation contact information.'],
    ],
    intentEntries: [
      ['Taiwan lawyer', 'Public information about Taiwan lawyer services.'],
      ['Taiwan company setup lawyer', 'Public information about legal support for Taiwan company setup.'],
      ['Taiwan litigation lawyer', 'Public information about legal support for Taiwan litigation.'],
      ['Taiwan company setup guide', 'A public guide to the Taiwan company setup process.'],
      ['AI consultation email', 'Guide for an AI service configured with this firm: bounded questions and an exact email subject/body preview. Sending requires explicit approval of that exact content and separate privacy consent. General AI chats do not automatically have access. Not legal advice or booking.'],
    ],
    noticeEntries: [
      ['Privacy policy', 'The public privacy policy.'],
      ['Disclaimer', 'The public legal-information disclaimer.'],
      ['Accessibility', 'Public information about site accessibility.'],
    ],
  },
  ja: {
    overview: '台湾の法律・企業業務に関する公開情報を提供する、台北所在の多言語法律事務所です。',
    publicNotice: 'この文書は公開情報の案内であり、法律上の助言ではありません。',
    discoveryNotice: 'llms.txt はサイト発見用の案内であり、検索順位、保証、推薦または必ず表示されることを約束するものではありません。',
    confidentialNotice: '初回のお問い合わせや AI との会話には、秘密情報や機微情報を入力しないでください。',
    sectionHeadings: {
      firm: '事務所・弁護士・お問い合わせ',
      intent: '主な相談案内',
      columns: '法律コラム',
      notices: '公開方針',
    },
    firmEntries: [
      ['昊鼎国際法律事務所', '事務所の日本語公式ホームページです。'],
      ['事務所紹介', '事務所に関する公開情報です。'],
      ['業務分野', '公開されている業務分野の案内です。'],
      ['曾雋崴弁護士', '曾雋崴台湾弁護士の公式プロフィールです。'],
      ['費用案内', '公開されている相談・サービス費用の案内です。'],
      ['お問い合わせ', '公式の相談窓口案内です。'],
    ],
    intentEntries: [
      ['台湾の弁護士', '台湾の弁護士サービスに関する公開案内です。'],
      ['台湾会社設立弁護士', '台湾会社設立の法的支援に関する公開案内です。'],
      ['台湾訴訟弁護士', '台湾での訴訟支援に関する公開案内です。'],
      ['台湾会社設立ガイド', '台湾会社設立手続に関する公開ガイドです。'],
      ['AI 相談メール作成', 'この事務所に接続・設定されたAIサービスの手順です。必要な範囲の質問と正確なメール件名・本文のプレビューを示し、その内容の明示的承認と個人情報の取扱いへの別個の同意後にのみ送信します。一般のAIチャットから自動利用はできません。法律助言や予約ではありません。'],
    ],
    noticeEntries: [
      ['プライバシーポリシー', '公開されているプライバシーポリシーです。'],
      ['免責事項', '公開されている法律情報の利用案内です。'],
      ['アクセシビリティ', 'サイトのアクセシビリティに関する公開案内です。'],
    ],
  },
};

const firmPaths = [
  '',
  '/about',
  '/services',
  `/lawyers/${primaryAttorneySlug}`,
  '/pricing',
  '/contact',
] as const;

const intentPaths = [
  '/taiwan-lawyer',
  '/taiwan-company-setup-lawyer',
  '/taiwan-litigation-lawyer',
  '/guides/taiwan-company-setup',
  '/ai-intake',
] as const;

const noticePaths = ['/privacy', '/disclaimer', '/accessibility'] as const;

/**
 * Strip line breaks, bidi controls, raw-HTML delimiters, and Markdown link or
 * heading delimiters from loader-sourced text before it enters llms.txt.
 */
export function sanitizeLlmsText(value: string, maxCharacters = ANNOTATION_MAX_CHARACTERS): string {
  const withoutControls = value
    .normalize('NFC')
    .replace(/https?:\/\/[^\s]+/giu, ' ')
    .replace(/[\p{Cc}\p{Cf}]/gu, ' ')
    .replace(/[\[\]()<>`#|\\]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();

  return Array.from(withoutControls).slice(0, maxCharacters).join('').trim();
}

export function buildCanonicalLlmsUrl(path: string): string {
  const url = new URL(path || '/', `${CANONICAL_ORIGIN}/`);
  if (url.origin !== CANONICAL_ORIGIN || url.protocol !== 'https:') {
    throw new Error(`llms.txt URL must use the canonical origin: ${path}`);
  }
  return url.toString();
}

export function buildLlmsFileListBullet(entry: LlmsEntry): string {
  const title = sanitizeLlmsText(entry.title, TITLE_MAX_CHARACTERS);
  const annotation = sanitizeLlmsText(entry.annotation, ANNOTATION_MAX_CHARACTERS);
  if (!title || !annotation) {
    throw new Error('llms.txt file-list entries require a title and annotation');
  }

  return `- [${title}](${buildCanonicalLlmsUrl(entry.path)}): ${annotation}`;
}

function renderSections(sections: readonly LlmsSection[]): string[] {
  const seenUrls = new Set<string>();
  const lines: string[] = [];

  for (const section of sections) {
    const heading = sanitizeLlmsText(section.heading, TITLE_MAX_CHARACTERS);
    if (!heading) {
      throw new Error('llms.txt sections require a heading');
    }

    const bullets: string[] = [];
    for (const entry of section.entries) {
      const url = buildCanonicalLlmsUrl(entry.path);
      if (seenUrls.has(url)) continue;
      seenUrls.add(url);
      bullets.push(buildLlmsFileListBullet({ ...entry, path: url }));
    }

    if (bullets.length === 0) {
      throw new Error(`llms.txt section has no unique files: ${heading}`);
    }

    if (lines.length > 0) lines.push('');
    lines.push(`## ${heading}`, '', ...bullets);
  }

  return lines;
}

export function validateLlmsTxt(body: string, maxBytes: number): void {
  if (body.startsWith('\ufeff') || body.includes('\r')) {
    throw new Error('llms.txt must use UTF-8 text with LF line endings and no BOM');
  }
  if (!body.endsWith('\n') || body.endsWith('\n\n')) {
    throw new Error('llms.txt must have exactly one trailing newline');
  }
  if (new TextEncoder().encode(body).byteLength > maxBytes) {
    throw new Error(`llms.txt exceeds its ${maxBytes}-byte limit`);
  }
  if (/^###/mu.test(body) || /^\|/mu.test(body) || body.includes('```') || /<[^>\n]+>/u.test(body)) {
    throw new Error('llms.txt contains unsupported Markdown or raw HTML');
  }
  const hasDisallowedControl = body
    .split('\n')
    .some((line) => /\p{Cc}/u.test(line));
  if (/\p{Cf}/u.test(body) || hasDisallowedControl) {
    throw new Error('llms.txt contains control or bidi formatting characters');
  }

  const lines = body.slice(0, -1).split('\n');
  if (!/^# [^#\n]+$/u.test(lines[0] ?? '')) {
    throw new Error('llms.txt must begin with one H1');
  }
  if (lines[1] !== '' || !/^> [^\n]+$/u.test(lines[2] ?? '')) {
    throw new Error('llms.txt H1 must be followed by a one-line blockquote');
  }
  if (lines.filter((line) => line.startsWith('# ')).length !== 1) {
    throw new Error('llms.txt must contain exactly one H1');
  }

  let inSection = false;
  let sectionEntryCount = 0;
  let sectionCount = 0;
  const bulletPattern = /^- \[[^\]\r\n]+\]\(https:\/\/tseng-law\.com(?:\/[^)\s]*)?\): [^\r\n]+$/u;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (inSection && sectionEntryCount === 0) {
        throw new Error('llms.txt H2 sections cannot be empty');
      }
      inSection = true;
      sectionEntryCount = 0;
      sectionCount += 1;
      continue;
    }
    if (!inSection || line === '') continue;
    if (!bulletPattern.test(line)) {
      throw new Error(`llms.txt H2 sections may contain only annotated file-list bullets: ${line}`);
    }
    sectionEntryCount += 1;
  }

  if (sectionCount === 0 || sectionEntryCount === 0) {
    throw new Error('llms.txt requires at least one non-empty H2 section');
  }
}

function finalizeLlmsTxt(lines: readonly string[], maxBytes: number): string {
  const body = `${lines.join('\n')}\n`;
  validateLlmsTxt(body, maxBytes);
  return body;
}

/**
 * Root-file annotations for the guidance-language catalogs.
 *
 * The guidance languages are a reading surface only: every line restates, in
 * the root file's own English, that consultations run in English, Chinese,
 * Japanese and Korean. Never widen this to imply vi/id/th/fil/ar consultation.
 *
 * These are English exonyms on purpose — the root `llms.txt` is written in
 * English, so the annotation reads "Public Arabic-language guidance catalog".
 * The autonym (`العربية`) belongs to `PUBLIC_LANGUAGE_AUTONYMS`, which supplies
 * the entry title on the line above.
 */
const GUIDANCE_CATALOG_LANGUAGE_NAMES: Record<GuidanceLocale4, string> = {
  vi: 'Vietnamese',
  id: 'Indonesian',
  th: 'Thai',
  fil: 'Filipino',
  ar: 'Arabic',
  de: 'German',
  es: 'Spanish',
  fr: 'French',
  pt: 'Portuguese',
  'zh-hans': 'Simplified Chinese',
  ms: 'Malay',
  ru: 'Russian',
  tr: 'Turkish',
  it: 'Italian',
  nl: 'Dutch',
  pl: 'Polish',
  hi: 'Hindi',
  sv: 'Swedish',
  da: 'Danish',
  nb: 'Norwegian',
  fi: 'Finnish',
  cs: 'Czech',
  hu: 'Hungarian',
  ro: 'Romanian',
  uk: 'Ukrainian',
  el: 'Greek',
  he: 'Hebrew',
  bn: 'Bengali',
  ur: 'Urdu',
  fa: 'Persian',
  my: 'Burmese',
  ta: 'Tamil',
  ne: 'Nepali',
  km: 'Khmer',
  mn: 'Mongolian',
  sk: 'Slovak',
  bg: 'Bulgarian',
  hr: 'Croatian',
  sr: 'Serbian',
  sl: 'Slovenian',
  lt: 'Lithuanian',
  lv: 'Latvian',
  et: 'Estonian',
  ca: 'Catalan',
  is: 'Icelandic',
};

export function buildRootLlmsTxt(): string {
  const localeEntries = siteLocales.map((locale) => ({
    title: `${getOrganizationName(locale)} — ${locale} catalog`,
    path: getLocalizedPath(locale, '/llms.txt'),
    annotation: `Public ${locale} site and legal-column discovery catalog.`,
  }));

  const guidanceEntries = GUIDANCE_LOCALES_4.map((locale) => ({
    title: `${PUBLIC_LANGUAGE_AUTONYMS[locale]} — ${locale} guidance catalog`,
    path: `/${locale}/llms.txt`,
    annotation: `Public ${GUIDANCE_CATALOG_LANGUAGE_NAMES[locale]}-language guidance catalog. Consultations are conducted only in English, Chinese, Japanese, and Korean.`,
  }));

  // Derived, not literal: the guidance set grows (ar is next) and a hard-coded
  // "4" here would silently throw the whole root manifest the day it does.
  if (localeEntries.length !== siteLocales.length || guidanceEntries.length !== GUIDANCE_LOCALES_4.length) {
    throw new Error(
      `Root llms.txt requires ${siteLocales.length} site locale catalogs and ${GUIDANCE_LOCALES_4.length} guidance catalogs`,
    );
  }

  const sections: LlmsSection[] = [
    {
      heading: 'Locale catalogs',
      entries: [...localeEntries, ...guidanceEntries],
    },
    {
      heading: 'Public AI consultation interfaces',
      entries: [
        {
          title: 'OpenAPI consultation interface',
          path: '/api/ai/openapi.json',
          annotation: 'Public interface schema; deployment, provider configuration, and provider registration may still be required.',
        },
        {
          title: 'MCP consultation interface',
          path: '/api/ai/mcp',
          annotation: 'Public Streamable HTTP endpoint; deployment, provider configuration, and provider registration may still be required.',
        },
      ],
    },
  ];

  return finalizeLlmsTxt([
    '# 법무법인 호정 · 昊鼎國際法律事務所 · Hovering International Law Firm · 昊鼎国際法律事務所',
    '',
    '> Multilingual public information about Taiwan legal and corporate matters from a Taipei law firm.',
    '',
    'This file maps public information and is not legal advice.',
    'llms.txt is a discovery map; it does not promise search ranking, endorsement, AI recommendation, or guaranteed visibility.',
    'Do not provide confidential or sensitive information in an initial inquiry or AI conversation.',
    '',
    ...renderSections(sections),
  ], ROOT_LLMS_TXT_MAX_BYTES);
}

function buildLocalizedEntries(
  locale: SiteLocale,
  paths: readonly string[],
  copyEntries: readonly [string, string][],
): LlmsEntry[] {
  if (paths.length !== copyEntries.length) {
    throw new Error(`Missing localized llms.txt entry copy for ${locale}`);
  }

  return paths.map((path, index) => ({
    title: copyEntries[index][0],
    path: getLocalizedPath(locale, path),
    annotation: copyEntries[index][1],
  }));
}

export function buildLocaleLlmsTxt(locale: SiteLocale): string {
  const copy = localeCopy[locale];
  const attorney = getAttorneyProfile(locale, primaryAttorneySlug);
  if (!copy || !attorney) {
    throw new Error(`Missing required llms.txt locale data: ${locale}`);
  }

  const columns = getAllColumnPosts(locale);
  if (columns.length === 0) {
    throw new Error(`Missing legal columns for llms.txt locale: ${locale}`);
  }

  // Preserve the deterministic order returned by the file-backed column loader.
  const columnEntries = columns.map((column) => {
    if (!column.slug || !column.title || !column.summary) {
      throw new Error(`Incomplete legal column metadata for llms.txt locale: ${locale}`);
    }
    return {
      title: column.title,
      path: getLocalizedPath(locale, `/columns/${column.slug}`),
      annotation: column.summary,
    };
  });
  const uniqueColumnUrls = new Set(columnEntries.map((entry) => buildCanonicalLlmsUrl(entry.path)));
  if (uniqueColumnUrls.size !== columns.length) {
    throw new Error(`Duplicate legal column URL for llms.txt locale: ${locale}`);
  }

  const firmEntries = buildLocalizedEntries(locale, firmPaths, copy.firmEntries);
  firmEntries[3] = {
    ...firmEntries[3],
    title: attorney.name,
  };

  const intentEntries = buildLocalizedEntries(locale, intentPaths, copy.intentEntries);

  const sections: LlmsSection[] = [
    { heading: copy.sectionHeadings.firm, entries: firmEntries },
    { heading: copy.sectionHeadings.intent, entries: intentEntries },
    { heading: copy.sectionHeadings.columns, entries: columnEntries },
    {
      heading: copy.sectionHeadings.notices,
      entries: buildLocalizedEntries(locale, noticePaths, copy.noticeEntries),
    },
  ];

  return finalizeLlmsTxt([
    `# ${getOrganizationName(locale)}`,
    '',
    `> ${copy.overview}`,
    '',
    copy.publicNotice,
    copy.discoveryNotice,
    copy.confidentialNotice,
    '',
    ...renderSections(sections),
  ], LOCALE_LLMS_TXT_MAX_BYTES);
}

type GuidanceLlmsNotices = {
  /**
   * The page language is not a consultation language. Copied verbatim from the
   * published FAQ answer of the same locale, so the file cannot drift from what
   * the site itself says.
   */
  consultationNotice: string;
  /** No ranking, endorsement, or visibility is promised by this file. */
  discoveryNotice: string;
  /** Copied verbatim from the published privacy page of the same locale. */
  confidentialNotice: string;
};

/**
 * Notice lines for the guidance locales, in the page's own language.
 * `consultationNotice` and `confidentialNotice` are verbatim sentences already
 * published in `guidanceContent`; only `discoveryNotice` (which describes this
 * file itself) is new, and it mirrors the existing wording of the other
 * guidance locales.
 */
export const GUIDANCE_LLMS_NOTICES: Record<GuidanceLocale4, GuidanceLlmsNotices> = {
  vi: {
    consultationNotice:
      'Phần hướng dẫn này được viết bằng tiếng Việt, nhưng việc tư vấn với luật sư chỉ được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
    discoveryNotice:
      'Tệp llms.txt này chỉ là bản đồ tra cứu các trang công khai; nó không hứa hẹn thứ hạng trên công cụ tìm kiếm, sự bảo trợ, khuyến nghị của trí tuệ nhân tạo hay việc bảo đảm được hiển thị.',
    confidentialNotice:
      'Vì nội dung gốc được lưu giữ, xin đừng viết những thông tin chưa cần thiết ở bước đầu, chẳng hạn số hộ chiếu, số giấy tờ tùy thân hay thông tin tài khoản ngân hàng.',
  },
  id: {
    consultationNotice:
      'Panduan ini ditulis dalam bahasa Indonesia, tetapi konsultasi dengan advokat hanya dilayani dalam bahasa Inggris, bahasa Mandarin (中文), bahasa Jepang, dan bahasa Korea.',
    discoveryNotice:
      'Berkas llms.txt ini hanya peta penelusuran halaman publik; berkas ini tidak menjanjikan peringkat pencarian, pengesahan, rekomendasi AI, atau jaminan untuk ditampilkan.',
    confidentialNotice:
      'Karena teks asli disimpan, mohon jangan menuliskan hal yang belum diperlukan pada tahap awal, seperti nomor paspor, nomor identitas, atau data rekening bank.',
  },
  th: {
    consultationNotice:
      'ข้อมูลแนะนำส่วนนี้จัดทำเป็นภาษาไทย แต่การปรึกษากับทนายความดำเนินการเฉพาะภาษาอังกฤษ ภาษาจีน (中文) ภาษาญี่ปุ่น และภาษาเกาหลี',
    discoveryNotice:
      'ไฟล์ llms.txt นี้เป็นเพียงแผนผังสำหรับค้นหน้าเว็บสาธารณะ ไม่ได้รับประกันอันดับในผลการค้นหา การรับรองสนับสนุน การแนะนำโดย AI หรือการแสดงผลในหน้าใด',
    confidentialNotice:
      'เนื่องจากข้อความต้นฉบับถูกเก็บไว้ จึงขอความกรุณาอย่าเขียนข้อมูลที่ยังไม่จำเป็นในขั้นแรก เช่น เลขหนังสือเดินทาง เลขบัตรประจำตัว หรือข้อมูลบัญชีธนาคาร',
  },
  fil: {
    consultationNotice:
      'Nakasulat sa Filipino ang gabay na ito, ngunit ang konsultasyon sa abogado ay isinasagawa lamang sa Ingles, Tsino, Hapon, at Koreano.',
    discoveryNotice:
      'Mapa lamang ng mga pampublikong pahina ang llms.txt na ito; hindi ito nangangako ng ranggo sa paghahanap, pag-endorso, rekomendasyon ng AI, o garantisadong paglabas.',
    confidentialNotice:
      'Dahil iniingatan ang orihinal na teksto, huwag munang isulat ang mga bagay na hindi pa kailangan sa unang yugto, gaya ng numero ng pasaporte, numero ng ID, o detalye ng bank account.',
  },
  ar: {
    // Verbatim from the published `faq` answer to "is the session held in the
    // language of this page?", minus its leading "لا. " — the same clause the
    // other guidance locales quote.
    consultationNotice:
      'هذه الصفحة الإرشادية مكتوبة بالعربية. الاستشارات تُقدَّم بالإنجليزية أو الصينية أو اليابانية أو الكورية، ولا نلتزم بتوفير ترجمة فورية.',
    discoveryNotice:
      'ملف llms.txt هذا ليس إلا خريطة للاستدلال على الصفحات العامة؛ وهو لا يَعِد بترتيب في نتائج البحث ولا بتزكية، ولا بترشيح من الذكاء الاصطناعي، ولا بإعلان.',
    // The published privacy-page sentence, with its leading connective dropped
    // so the line stands alone; the proposition is unchanged.
    confidentialNotice:
      'لأن النص الأصلي محفوظ، يُرجى عدم كتابة معلومات لا حاجة إليها في المرحلة الأولى، مثل رقم جواز السفر أو رقم الهوية أو بيانات الحساب المصرفي.',
  },
  de: {
    consultationNotice:
      'Diese Hinweise sind auf Deutsch geschrieben, aber die Beratung durch eine Anwältin oder einen Anwalt erfolgt nur auf Englisch, Chinesisch (中文), Japanisch und Koreanisch.',
    discoveryNotice:
      'Die Datei llms.txt ist nur eine Suchkarte öffentlicher Seiten; sie verspricht keine Suchplatzierung, keine Empfehlung, keine KI-Empfehlung und keine Anzeige.',
    confidentialNotice:
      'Weil der Originaltext gespeichert wird, schreiben Sie in der Anfangsphase bitte nichts, das noch nicht nötig ist, etwa Passnummer, Ausweisnummer oder Kontodaten.',
  },
  es: {
    consultationNotice:
      'Esta orientación está escrita en español, pero la consulta con un abogado se realiza únicamente en inglés, chino (中文), japonés y coreano.',
    discoveryNotice:
      'El archivo llms.txt es solo un mapa para localizar páginas públicas; no promete posicionamiento en buscadores, respaldo, recomendación por parte de una inteligencia artificial ni visibilidad garantizada.',
    confidentialNotice:
      'Como el texto original se guarda, no escriba en esta primera fase datos que aún no hacen falta, como el número de pasaporte, el número de identidad o datos de una cuenta bancaria.',
  },
  fr: {
    consultationNotice:
      'Ces indications sont rédigées en français, mais la consultation avec une avocate ou un avocat a lieu seulement en anglais, en chinois (中文), en japonais et en coréen.',
    discoveryNotice:
      'Le fichier llms.txt n’est qu’une carte pour trouver les pages publiques ; il ne promet ni classement dans les moteurs de recherche, ni approbation, ni recommandation par une intelligence artificielle, ni insertion publicitaire.',
    confidentialNotice:
      'Parce que le texte original est conservé, n’écrivez pas, à ce premier stade, ce qui n’est pas encore nécessaire, par exemple un numéro de passeport, un numéro d’identité ou des données de compte.',
  },
  pt: {
    consultationNotice:
      'Esta orientação está escrita em português, mas a consulta com uma advogada ou um advogado realiza-se apenas em inglês, chinês (中文), japonês e coreano.',
    discoveryNotice:
      'O ficheiro llms.txt é apenas um mapa para localizar páginas públicas; não promete posicionamento em motores de busca, recomendação, recomendação por inteligência artificial nem inserção publicitária.',
    confidentialNotice:
      'Como o texto original se guarda, não escreva nesta primeira fase dados que ainda não fazem falta, como o número de passaporte, o número de identidade ou dados de uma conta bancária.',
  },
  'zh-hans': {
    consultationNotice:
      '律师咨询以英语、中文、日语和韩语进行。本页面以简体中文撰写，咨询时使用的中文包括普通话与书面中文。',
    discoveryNotice:
      '本 llms.txt 文件只是公开页面的检索地图；它不承诺搜索排名、背书、人工智能推荐或展示。',
    confidentialNotice:
      '因为原文会被保存，初期请不要写下尚不需要的内容，例如护照号码、身份证号或银行账户信息。',
  },
  ms: {
    consultationNotice:
      'Maklumat ini ditulis dalam bahasa Melayu, tetapi perundingan dengan peguam hanya dijalankan dalam bahasa Inggeris, Cina (中文), Jepun dan Korea.',
    discoveryNotice:
      'Fail llms.txt ini hanyalah peta untuk mencari halaman awam; ia tidak menjanjikan kedudukan carian, pengendorsan, cadangan AI atau paparan.',
    confidentialNotice:
      'Kerana teks asal disimpan, pada peringkat awal jangan tulis apa yang belum diperlukan, misalnya nombor pasport, nombor pengenalan atau data akaun.',
  },
  ru: {
    consultationNotice:
      'Эти сведения написаны на русском языке, но консультация с адвокатом проводится только на английском, китайском (中文), японском и корейском языках.',
    discoveryNotice:
      'Файл llms.txt — лишь карта для поиска открытых страниц; он не обещает места в поиске, поддержки, рекомендации искусственного интеллекта или показа.',
    confidentialNotice:
      'Поскольку исходный текст сохраняется, на первом этапе не пишите то, что ещё не нужно: номер паспорта, номер удостоверения или данные счёта.',
  },
  tr: {
    consultationNotice:
      'Bu bilgiler Türkçe yazılmıştır; ancak avukatla görüşme yalnızca İngilizce, Çince (中文), Japonca ve Korece yapılır.',
    discoveryNotice:
      'llms.txt dosyası yalnızca kamuya açık sayfaları bulmak için bir haritadır; arama sıralaması, tavsiye, yapay zekâ önerisi veya reklam vaat etmez.',
    confidentialNotice:
      'Özgün metin saklandığı için ilk aşamada henüz gerekmeyen şeyleri yazmayın; örneğin pasaport numarası, kimlik numarası veya hesap bilgileri.',
  },
  it: {
    consultationNotice:
      'Queste indicazioni sono scritte in italiano, ma la consulenza con un’avvocata o un avvocato si svolge soltanto in inglese, cinese (中文), giapponese e coreano.',
    discoveryNotice:
      'Il file llms.txt è soltanto una mappa per trovare le pagine pubbliche; non promette collocazione nei motori di ricerca, avallo, raccomandazione da intelligenza artificiale né inserzione pubblicitaria.',
    confidentialNotice:
      'Poiché il testo originale viene conservato, nella fase iniziale non scriva ciò che non è ancora necessario, ad esempio il numero di passaporto, il numero di documento o i dati di un conto.',
  },
  nl: {
    consultationNotice:
      'Deze toelichting is in het Nederlands geschreven, maar het gesprek met een advocaat vindt alleen plaats in het Engels, Chinees (中文), Japans en Koreaans.',
    discoveryNotice:
      'Het bestand llms.txt is slechts een kaart om openbare pagina’s te vinden; het belooft geen plaats in zoekresultaten, geen aanbeveling, geen vermelding door kunstmatige intelligentie en geen weergave.',
    confidentialNotice:
      'Omdat de oorspronkelijke tekst wordt bewaard, schrijf in deze eerste fase niets wat nog niet nodig is, zoals een paspoortnummer, een identiteitsnummer of rekeninggegevens.',
  },
  pl: {
    consultationNotice:
      'Te informacje są napisane po polsku, ale konsultacja z adwokatem odbywa się wyłącznie w języku angielskim, chińskim (中文), japońskim i koreańskim.',
    discoveryNotice:
      'Plik llms.txt jest jedynie mapą do znajdowania stron publicznych; nie obiecuje miejsca w wyszukiwaniu, poparcia, rekomendacji sztucznej inteligencji ani wyświetlenia.',
    confidentialNotice:
      'Ponieważ oryginalny tekst jest zapisywany, na pierwszym etapie nie należy wpisywać tego, co jeszcze nie jest potrzebne, na przykład numeru paszportu, numeru dokumentu tożsamości ani danych rachunku.',
  },
  hi: {
    consultationNotice:
      'ये पृष्ठ हिंदी में लिखे गए हैं, लेकिन अधिवक्ता से परामर्श केवल अंग्रेज़ी, चीनी (中文), जापानी और कोरियाई में होता है।',
    discoveryNotice:
      'llms.txt फ़ाइल केवल सार्वजनिक पृष्ठ खोजने का मानचित्र है; यह खोज क्रम, समर्थन, कृत्रिम बुद्धि की अनुशंसा या दृश्यता का वादा नहीं करती।',
    confidentialNotice:
      'क्योंकि मूल पाठ रखा जाता है, आरंभिक चरण में वह न लिखें जिसकी अभी आवश्यकता नहीं, जैसे पासपोर्ट संख्या, पहचान संख्या या खाता विवरण।',
  },
  sv: {
    consultationNotice:
      'Den här vägledningen är skriven på svenska, men rådgivningen med en advokat sker endast på engelska, kinesiska (中文), japanska och koreanska.',
    discoveryNotice:
      'Filen llms.txt är bara en karta för att hitta offentliga sidor; den lovar inte sökplacering, stöd, rekommendation från artificiell intelligens eller synlighet.',
    confidentialNotice:
      'Eftersom originaltexten sparas, skriv i inledningen inget som ännu inte behövs, till exempel passnummer, identitetsnummer eller kontouppgifter.',
  },
  da: {
    consultationNotice:
      'Disse vejledninger er skrevet på dansk, men rådgivningen med en advokat foregår kun på engelsk, kinesisk (中文), japansk og koreansk.',
    discoveryNotice:
      'Filen llms.txt er kun et kort til at finde offentlige sider; den lover ikke søgeplacering, støtte, anbefaling fra kunstig intelligens eller synlighed.',
    confidentialNotice:
      'Fordi originalteksten gemmes, skriv i begyndelsen ikke noget, der endnu ikke er nødvendigt, for eksempel pasnummer, identitetsnummer eller kontooplysninger.',
  },
  nb: {
    consultationNotice:
      'Disse veiledningene er skrevet på norsk, men rådgivningen med en advokat foregår bare på engelsk, kinesisk (中文), japansk og koreansk.',
    discoveryNotice:
      'Filen llms.txt er bare et kart for å finne offentlige sider; den lover ingen plassering i søkeresultater, ingen anbefaling, ingen anbefaling fra kunstig intelligens og ingen synlighet.',
    confidentialNotice:
      'Fordi originalteksten lagres, bør du i begynnelsen ikke skrive noe som ennå ikke trengs, for eksempel passnummer, identitetsnummer eller kontoopplysninger.',
  },
  fi: {
    consultationNotice:
      'Nämä ohjeet on kirjoitettu suomeksi, mutta neuvonta asianajajan kanssa tapahtuu vain englanniksi, kiinaksi (中文), japaniksi ja koreaksi.',
    discoveryNotice:
      'Tiedosto llms.txt on vain kartta julkisten sivujen löytämiseen; se ei lupaa hakusijaa, tukea, tekoälyn suositusta eikä näkyvyyttä.',
    confidentialNotice:
      'Koska alkuperäinen teksti säilytetään, älkää alkuvaiheessa kirjoittako sellaista, mitä ei vielä tarvita, esimerkiksi passinumeroa, henkilötunnusta tai tilitietoja.',
  },
  cs: {
    consultationNotice:
      'Tyto informace jsou psány česky, ale porada s advokátkou nebo advokátem probíhá pouze anglicky, čínsky (中文), japonsky a korejsky.',
    discoveryNotice:
      'Soubor llms.txt je pouze mapou pro nalezení veřejných stránek; neslibuje pořadí ve vyhledávání, podporu, doporučení umělé inteligence ani viditelnost.',
    confidentialNotice:
      'Protože se původní text uchovává, nepište v počáteční fázi to, co zatím není potřebné, například číslo pasu, číslo dokladu nebo údaje o účtu.',
  },
  hu: {
    consultationNotice:
      'Ez a tájékoztatás magyarul készült, de az ügyvéddel folytatott tanácsadás kizárólag angolul, kínaiul (中文), japánul és koreaiul zajlik.',
    discoveryNotice:
      'Az llms.txt fájl csak térkép a nyilvános oldalak megtalálásához; nem ígér keresési helyezést, támogatást, mesterséges intelligencia általi ajánlást és láthatóságot sem.',
    confidentialNotice:
      'Mivel az eredeti szöveget megőrizzük, a kezdeti szakaszban ne írja le azt, ami még nem szükséges, például az útlevélszámot, az okmányszámot vagy a számlaadatokat.',
  },
  ro: {
    consultationNotice:
      'Aceste informații sunt scrise în limba română, dar consultanța cu un avocat se desfășoară numai în engleză, chineză (中文), japoneză și coreeană.',
    discoveryNotice:
      'Fișierul llms.txt este doar o hartă pentru găsirea paginilor publice; nu promite poziție în căutare, susținere, recomandare din partea inteligenței artificiale și nici vizibilitate.',
    confidentialNotice:
      'Întrucât textul original se păstrează, în faza inițială nu scrieți ceea ce nu este încă necesar, de pildă numărul de pașaport, numărul actului de identitate sau datele unui cont.',
  },
  uk: {
    consultationNotice:
      'Ці відомості написано українською, але консультація з адвокатом відбувається лише англійською, китайською (中文), японською та корейською.',
    discoveryNotice:
      'Файл llms.txt — це лише мапа для пошуку публічних сторінок; він не обіцяє місця в пошуку, підтримки, рекомендації штучного інтелекту чи видимості.',
    confidentialNotice:
      'Оскільки первинний текст зберігається, на початковому етапі не пишіть того, що ще не потрібне, наприклад номера паспорта, номера документа чи даних рахунку.',
  },
  el: {
    consultationNotice:
      'Οι πληροφορίες αυτές είναι γραμμένες στα ελληνικά, αλλά η συμβουλευτική με δικηγόρο διεξάγεται μόνο στα αγγλικά, κινεζικά (中文), ιαπωνικά και κορεατικά.',
    discoveryNotice:
      'Το αρχείο llms.txt είναι μόνο χάρτης για την εύρεση των δημόσιων σελίδων· δεν υπόσχεται θέση στην αναζήτηση, υποστήριξη, σύσταση από τεχνητή νοημοσύνη ούτε προβολή.',
    confidentialNotice:
      'Επειδή το πρωτότυπο κείμενο διατηρείται, στο αρχικό στάδιο μη γράφετε ό,τι δεν είναι ακόμη απαραίτητο, για παράδειγμα τον αριθμό διαβατηρίου, τον αριθμό ταυτότητας ή στοιχεία λογαριασμού.',
  },
  he: {
    consultationNotice:
      'מידע זה כתוב בעברית, אך הייעוץ עם עורכת דין או עורך דין מתקיים רק באנגלית, בסינית (中文), ביפנית ובקוריאנית.',
    discoveryNotice:
      'הקובץ llms.txt הוא מפה בלבד לאיתור העמודים הפומביים; אין בו הבטחה לדירוג בחיפוש, לתמיכה, להמלצה של בינה מלאכותית או לחשיפה.',
    confidentialNotice:
      'מאחר שהטקסט המקורי נשמר, אל תכתבו בשלב הראשון את מה שאינו נדרש עדיין, למשל מספר דרכון, מספר תעודה או פרטי חשבון.',
  },
  bn: {
    consultationNotice:
      'এই পাতাগুলো বাংলায় লেখা, কিন্তু আইনজীবীর পরামর্শ কেবল ইংরেজি, চীনা (中文), জাপানি ও কোরীয় ভাষায় হয়।',
    discoveryNotice:
      'llms.txt ফাইল কেবল সর্বজনীন পাতা খুঁজে পাওয়ার মানচিত্র; এটি অনুসন্ধান ক্রম, সমর্থন, কৃত্রিম বুদ্ধিমত্তার সুপারিশ বা দৃশ্যমানতার প্রতিশ্রুতি দেয় না।',
    confidentialNotice:
      'মূল পাঠ্য রাখা হয় বলে শুরুর ধাপে যা এখন দরকার নয় তা লিখবেন না, যেমন পাসপোর্ট নম্বর, পরিচয় নম্বর বা হিসাবের তথ্য।',
  },
  ur: {
    consultationNotice:
      'یہ صفحات اردو میں لکھے گئے ہیں، مگر وکیل سے مشورہ صرف انگریزی، چینی (中文)، جاپانی اور کوریائی میں ہوتا ہے۔',
    discoveryNotice:
      'llms.txt فائل صرف عوامی صفحات تلاش کرنے کا نقشہ ہے؛ یہ تلاش میں جگہ، سفارش، مصنوعی ذہانت کی سفارش یا اشتہار کا وعدہ نہیں کرتی۔',
    confidentialNotice:
      'چونکہ اصل متن رکھا جاتا ہے، ابتدائی مرحلے میں وہ نہ لکھیں جس کی ابھی ضرورت نہیں، جیسے پاسپورٹ نمبر، شناختی نمبر یا اکاؤنٹ کی تفصیل۔',
  },
  fa: {
    // Verbatim from the published `faq` answer to "is the session held in the
    // language of this page?", minus its leading "خیر. " — the same clause the
    // other guidance locales quote.
    consultationNotice:
      'این صفحهٔ راهنما به فارسی نوشته شده است. مشاوره فقط به انگلیسی، چینی (中文)، ژاپنی و کره‌ای انجام می‌شود و مترجم شفاهی فراهم نمی‌کنیم.',
    discoveryNotice:
      'فایل llms.txt فقط نقشه‌ای برای پیدا کردن صفحه‌های عمومی است؛ رتبه‌ای در نتایج جست‌وجو، توصیه‌ای، پیشنهاد هوش مصنوعی یا آگهی را وعده نمی‌دهد.',
    // The published privacy-page sentence, with its leading connective dropped
    // so the line stands alone; the proposition is unchanged.
    confidentialNotice:
      'متن اصلی ذخیره می‌شود، لطفاً در مرحلهٔ نخست اطلاعاتی را که هنوز لازم نیست ننویسید، مانند شمارهٔ گذرنامه یا شمارهٔ شناسنامه یا داده‌های حساب بانکی.',
  },
  my: {
    consultationNotice:
      'ဤလမ်းညွှန်ချက်များကို မြန်မာဘာသာဖြင့် ရေးထားသော်လည်း ရှေ့နေနှင့် တိုင်ပင်ဆွေးနွေးမှုကို အင်္ဂလိပ်၊ တရုတ် (中文)၊ ဂျပန်နှင့် ကိုရီးယားဖြင့်သာ ဆောင်ရွက်သည်။',
    discoveryNotice:
      'llms.txt ဖိုင်သည် အများပြည်သူ စာမျက်နှာများကို ရှာရန် မြေပုံသာ ဖြစ်သည်။ ရှာဖွေမှုရလဒ်ထဲက အဆင့်၊ အကြံပြုချက်၊ ဉာဏ်ရည်တု၏ အကြံပြုချက် သို့မဟုတ် ကြော်ငြာကို အာမမခံပါ။',
    confidentialNotice:
      'မူရင်းစာသားကို သိမ်းဆည်းသောကြောင့် အစောပိုင်းအဆင့်တွင် မလိုအပ်သေးသော အချက်များ — နိုင်ငံကူးလက်မှတ်နံပါတ်၊ ကိုယ်ပိုင်အထောက်အထားနံပါတ် သို့မဟုတ် ဘဏ်အကောင့်အချက်အလက် — ကို မရေးပါနှင့်။',
  },
  ta: {
    consultationNotice:
      'இந்தப் பக்கங்கள் தமிழில் எழுதப்பட்டுள்ளன; ஆனால் வழக்கறிஞரின் ஆலோசனை ஆங்கிலம், சீனம் (中文), ஜப்பானியம் மற்றும் கொரிய மொழி ஆகியவற்றிலேயே நடைபெறும்.',
    discoveryNotice:
      'llms.txt கோப்பு பொதுப் பக்கங்களைக் கண்டறிய உதவும் வரைபடம் மட்டுமே; தேடல் வரிசை, ஆதரவு, செயற்கை நுண்ணறிவு பரிந்துரை அல்லது காட்சிப்படுத்தலை வாக்குறுதி அளிக்காது.',
    confidentialNotice:
      'மூல உரை வைக்கப்படுவதால், தொடக்கக் கட்டத்தில் இப்போது தேவையில்லாதவற்றை எழுதாதீர்கள் — கடவுச்சீட்டு எண், அடையாள எண் அல்லது கணக்கு விவரங்கள் போன்றவை.',
  },
  ne: {
    consultationNotice:
      'यी पृष्ठ नेपालीमा लेखिएका छन्, तर अधिवक्तासँगको परामर्श अङ्ग्रेजी, चिनियाँ (中文), जापानी र कोरियालीमा मात्र हुन्छ।',
    discoveryNotice:
      'llms.txt फाइल सार्वजनिक पृष्ठ खोज्ने नक्सा मात्र हो; यो खोज क्रम, समर्थन, कृत्रिम बुद्धिको सिफारिस वा दृश्यताको वाचा गर्दैन।',
    confidentialNotice:
      'मूल पाठ राखिने हुँदा सुरुआती चरणमा अझै नचाहिने कुरा नलेख्नुहोस्, जस्तै पासपोर्ट नम्बर, परिचय नम्बर वा खाता विवरण।',
  },
  km: {
    consultationNotice:
      'សេចក្ដីណែនាំនេះសរសេរជាភាសាខ្មែរ ប៉ុន្ដែការពិគ្រោះយោបល់ជាមួយមេធាវីធ្វើឡើងតែជាភាសាអង់គ្លេស ភាសាចិន (中文) ភាសាជប៉ុន និងភាសាកូរ៉េ',
    discoveryNotice:
      'ឯកសារ llms.txt នេះគ្រាន់តែជាផែនទីសម្រាប់រកទំព័រសាធារណៈ។ វាមិនធានាលំដាប់ក្នុងលទ្ធផលស្វែងរក ការណែនាំឱ្យប្រើ ការណែនាំដោយ AI ឬការចុះផ្សាយពាណិជ្ជនៅទំព័រណាមួយឡើយ។',
    confidentialNotice:
      'ដោយអត្ថបទដើមត្រូវបានរក្សាទុក សូមកុំសរសេរព័ត៌មានដែលមិនទាន់ចាំបាច់នៅដំណាក់កាលដំបូង ដូចជាលេខលិខិតឆ្លងដែន លេខអត្ដសញ្ញាណប័ណ្ណ ឬទិន្នន័យគណនីធនាគារ។',
  },
  mn: {
    consultationNotice:
      'Эдгээр мэдээллийг монгол хэлээр бичсэн боловч өмгөөлөгчийн зөвлөгөө зөвхөн англи, хятад (中文), япон, солонгос хэлээр явагдана.',
    discoveryNotice:
      'llms.txt файл нь зөвхөн нээлттэй хуудсыг олоход зориулсан газрын зураг юм; энэ нь хайлтын байр, дэмжлэг, хиймэл оюуны зөвлөмж, харагдах байдлыг амлахгүй.',
    confidentialNotice:
      'Эх бичвэрийг хадгалдаг тул эхний шатанд одоо хэрэггүй зүйл, тухайлбал паспортын дугаар, үнэмлэхийн дугаар эсвэл дансны мэдээлэл бичихгүй байгаарай.',
  },
  sk: {
    consultationNotice:
      'Tieto informácie sú napísané po slovensky, ale porada s advokátkou alebo advokátom prebieha iba anglicky, čínsky (中文), japonsky a kórejsky.',
    discoveryNotice:
      'Súbor llms.txt je iba mapou na nájdenie verejných stránok; nesľubuje poradie vo vyhľadávaní, podporu, odporúčanie umelej inteligencie ani viditeľnosť.',
    confidentialNotice:
      'Pretože sa pôvodný text uchováva, nepíšte v počiatočnej fáze to, čo zatiaľ nie je potrebné, napríklad číslo pasu, číslo dokladu alebo údaje o účte.',
  },
  bg: {
    consultationNotice:
      'Тези сведения са написани на български, но консултацията с адвокатка или адвокат се провежда само на английски, китайски (中文), японски и корейски.',
    discoveryNotice:
      'Файлът llms.txt е само карта за намиране на открити страници; той не обещава място в търсенето, поддръжка, препоръка на изкуствен интелект или показване.',
    confidentialNotice:
      'Тъй като изходният текст се запазва, на първия етап не пишете това, което още не е нужно: номер на паспорт, номер на документ за самоличност или данни за сметка.',
  },
  hr: {
    consultationNotice:
      'Ove su informacije napisane na hrvatskom, ali savjetovanje s odvjetnicom ili odvjetnikom odvija se samo na engleskom, kineskom (中文), japanskom i korejskom.',
    discoveryNotice:
      'Datoteka llms.txt samo je karta za pronalaženje javnih stranica; ne obećava poredak u pretraživanju, podršku, preporuku umjetne inteligencije ni vidljivost.',
    confidentialNotice:
      'Budući da se izvorni tekst čuva, u početnoj fazi nemojte pisati ono što još nije potrebno, primjerice broj putovnice, broj isprave ili podatke o računu.',
  },
  sr: {
    consultationNotice:
      'Ove informacije napisane su na srpskom, ali konsultacija sa advokatkinjom ili advokatom odvija se samo na engleskom, kineskom (中文), japanskom i korejskom.',
    discoveryNotice:
      'Datoteka llms.txt samo je mapa za pronalaženje javnih stranica; ne obećava redosled u pretrazi, podršku, preporuku veštačke inteligencije niti vidljivost.',
    confidentialNotice:
      'Budući da se izvorni tekst čuva, u početnoj fazi ne pišite ono što još nije potrebno, na primer broj pasoša, broj isprave ili podatke o računu.',
  },
  sl: {
    consultationNotice:
      'Ti napotki so napisani v slovenščini, vendar posvet z odvetnico ali odvetnikom poteka samo v angleščini, kitajščini (中文), japonščini in korejščini.',
    discoveryNotice:
      'Datoteka llms.txt je le zemljevid za iskanje javnih strani; ne obljublja vrstnega reda v iskanju, podpore, priporočila umetne inteligence niti vidnosti.',
    confidentialNotice:
      'Ker se izvirno besedilo shranjuje, v začetni fazi ne pišite tistega, kar še ni potrebno, na primer številke potnega lista, številke osebnega dokumenta ali podatkov o računu.',
  },
  lt: {
    consultationNotice:
      'Ši informacija parašyta lietuviškai, bet konsultacija su advokate arba advokatu vyksta tik anglų, kinų (中文), japonų ir korėjiečių kalbomis.',
    discoveryNotice:
      'Failas llms.txt yra tik viešųjų puslapių radimo žemėlapis; jis nežada vietos paieškoje, palaikymo, dirbtinio intelekto rekomendacijos ar matomumo.',
    confidentialNotice:
      'Kadangi originalus tekstas išsaugomas, pradiniame etape nerašykite to, ko dar nereikia, pavyzdžiui, paso numerio, dokumento numerio ar sąskaitos duomenų.',
  },
  lv: {
    consultationNotice:
      'Šī informācija ir rakstīta latviešu valodā, bet konsultācija ar advokāti vai advokātu notiek tikai angļu, ķīniešu (中文), japāņu un korejiešu valodā.',
    discoveryNotice:
      'Fails llms.txt ir tikai karte publisko lapu atrašanai; tas nesola vietu meklēšanā, atbalstu, mākslīgā intelekta ieteikumu un redzamību.',
    confidentialNotice:
      'Tā kā sākotnējais teksts tiek saglabāts, sākumposmā nerakstiet to, kas vēl nav vajadzīgs, piemēram, pases numuru, personas dokumenta numuru vai konta datus.',
  },
  et: {
    consultationNotice:
      'Need juhised on kirjutatud eesti keeles, kuid nõustamine advokaadiga toimub ainult inglise, hiina (中文), jaapani ja korea keeles.',
    discoveryNotice:
      'Fail llms.txt on üksnes kaart avalike lehtede leidmiseks; see ei luba kohta otsingutulemustes, tuge, tehisintellekti soovitust ega nähtavust.',
    confidentialNotice:
      'Kuna algtekst säilitatakse, ärge kirjutage algfaasis seda, mida veel vaja ei ole, näiteks passinumbrit, isikutunnistuse numbrit ega kontonumbreid.',
  },
  ca: {
    consultationNotice:
      'Aquesta orientació està escrita en català, però la consulta amb una advocada o un advocat es fa únicament en anglès, xinès (中文), japonès i coreà.',
    discoveryNotice:
      'El fitxer llms.txt és només un mapa per localitzar pàgines públiques; no promet posicionament en cercadors, aval, recomanació per part d’una intel·ligència artificial ni visibilitat garantida.',
    confidentialNotice:
      'Com que el text original es guarda, no escrigui en aquesta primera fase dades que encara no calen, com el número de passaport, el número d’identitat o dades d’un compte bancari.',
  },
  is: {
    consultationNotice:
      'Þessar leiðbeiningar eru skrifaðar á íslensku, en ráðgjöf við lögmann fer einungis fram á ensku, kínversku (中文), japönsku og kóresku.',
    discoveryNotice:
      'Skráin llms.txt er aðeins kort til að finna opinberar síður; hún heitir ekki sæti í leitarvélum, stuðningi, tillögu gervigreindar né sýnileika.',
    confidentialNotice:
      'Vegna þess að frumtextinn er vistaður skaltu í upphafi ekki skrifa það sem enn er óþarft, til dæmis vegabréfsnúmer, kennitölu eða reikningsupplýsingar.',
  },
};

/**
 * Per-locale llms.txt for the guidance languages (vi / id / th / fil / ar).
 *
 * Same shape as {@link buildLocaleLlmsTxt}: one H1, a one-line blockquote, the
 * notice block, then annotated file-list bullets — here the ten guidance core
 * pages, titled and annotated with the locale's own published copy. Consultation
 * languages are never widened: the notice block states in the page language that
 * consultations run only in English, Chinese, Japanese and Korean.
 */
export function buildGuidanceLlmsTxt(locale: GuidanceLocale4): string {
  const pack = guidanceContent[locale];
  const notices = GUIDANCE_LLMS_NOTICES[locale];
  if (!pack || !notices) {
    throw new Error(`Missing required llms.txt guidance data: ${locale}`);
  }

  const entries: LlmsEntry[] = GUIDANCE_PAGE_KEYS.map((pageKey) => {
    const page = pack.pages[pageKey];
    if (!page?.title || !page?.description) {
      throw new Error(`Incomplete guidance page metadata for llms.txt: ${locale}/${pageKey}`);
    }
    return {
      title: page.title,
      path: guidancePublicPath(locale, pageKey),
      annotation: page.description,
    };
  });

  if (entries.length !== GUIDANCE_PAGE_KEYS.length) {
    throw new Error(`Guidance llms.txt requires all ${GUIDANCE_PAGE_KEYS.length} core pages: ${locale}`);
  }

  /*
   * The seventeen translated columns belong in the discovery map too.
   * Guidance locales publish the same seventeen the other four do — the live
   * checker counts them as vi:17, id:17, th:17, fil:17 — but this catalog
   * listed only the ten guidance pages, so sixty-eight real pages were absent
   * from the surface AI clients read. Titles and summaries are the columns'
   * own reviewed frontmatter; nothing is written here.
   *
   * A guidance locale whose translations have not been written yet has no
   * `src/content/columns-<locale>` directory at all — `getColumnsDir` returns
   * null for guidance locales instead of throwing, and `ar` shipped in exactly
   * that state (WO-M3B; the Arabic column pipeline is phase 2). Its catalog is
   * the ten core pages and nothing else. The loud failure is kept for the case
   * that actually loses published pages: a directory that exists but yields no
   * post.
   */
  const columns = getAllColumnPosts(locale);
  const columnsDir = path.join(process.cwd(), COLUMN_CONTENT_DIR_BY_LOCALE[locale]);
  const hasMarkdown =
    fs.existsSync(columnsDir)
    && fs.readdirSync(columnsDir).some((name) => name.endsWith('.md'));
  // Empty dirs (gitkeep only) are "no translations yet", same as a missing dir.
  if (columns.length === 0 && hasMarkdown) {
    throw new Error(`Missing legal columns for guidance llms.txt locale: ${locale}`);
  }
  const columnEntries: LlmsEntry[] = columns.map((column) => {
    if (!column.slug || !column.title || !column.summary) {
      throw new Error(`Incomplete legal column metadata for guidance llms.txt: ${locale}`);
    }
    return {
      title: column.title,
      path: `/${locale}/columns/${column.slug}`,
      annotation: column.summary,
    };
  });
  const uniqueColumnUrls = new Set(columnEntries.map((entry) => buildCanonicalLlmsUrl(entry.path)));
  if (uniqueColumnUrls.size !== columnEntries.length) {
    throw new Error(`Duplicate legal column URL for guidance llms.txt locale: ${locale}`);
  }

  return finalizeLlmsTxt([
    `# ${getOrganizationName('en')} — ${pack.languageName}`,
    '',
    `> ${pack.pages.home.description}`,
    '',
    pack.footerNotice,
    notices.consultationNotice,
    notices.discoveryNotice,
    notices.confidentialNotice,
    '',
    ...renderSections([
      { heading: pack.menuLabel, entries },
      ...(columnEntries.length > 0
        ? [{ heading: pack.nav.columns, entries: columnEntries }]
        : []),
    ]),
  ], LOCALE_LLMS_TXT_MAX_BYTES);
}
