import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { guidanceContent } from '@/data/international-guidance-content';
import { getAllColumnPosts } from '@/lib/columns';
import { siteLocales, type SiteLocale } from '@/lib/locales';
import {
  GUIDANCE_PAGE_KEYS,
  guidancePublicPath,
  type GuidanceLocale4,
} from '@/lib/public-guidance';
import { getOrganizationName, getLocalizedPath } from '@/lib/seo';

export const ROOT_LLMS_TXT_MAX_BYTES = 8 * 1024;
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

export function buildRootLlmsTxt(): string {
  const localeEntries = siteLocales.map((locale) => ({
    title: `${getOrganizationName(locale)} — ${locale} catalog`,
    path: getLocalizedPath(locale, '/llms.txt'),
    annotation: `Public ${locale} site and legal-column discovery catalog.`,
  }));

  if (localeEntries.length !== 4) {
    throw new Error('Root llms.txt requires exactly four locale catalogs');
  }

  const sections: LlmsSection[] = [
    {
      heading: 'Locale catalogs',
      entries: localeEntries,
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
 * Notice lines for the four guidance locales, in the page's own language.
 * `consultationNotice` and `confidentialNotice` are verbatim sentences already
 * published in `guidanceContent`; only `discoveryNotice` (which describes this
 * file itself) is new, and it mirrors the existing four-locale wording.
 */
export const GUIDANCE_LLMS_NOTICES: Record<GuidanceLocale4, GuidanceLlmsNotices> = {
  vi: {
    consultationNotice:
      'Phần hướng dẫn này được viết bằng tiếng Việt, nhưng việc tư vấn với luật sư chỉ được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
    discoveryNotice:
      'Tệp llms.txt này chỉ là bản đồ tra cứu các trang công khai; nó không hứa hẹn thứ hạng tìm kiếm, sự chứng thực, khuyến nghị của AI hay việc được hiển thị.',
    confidentialNotice:
      'Vì nội dung gốc được lưu giữ, xin đừng viết những thông tin chưa cần thiết ở bước đầu, chẳng hạn số hộ chiếu, số giấy tờ tùy thân hay thông tin tài khoản ngân hàng.',
  },
  id: {
    consultationNotice:
      'Panduan ini ditulis dalam bahasa Indonesia, tetapi konsultasi dengan advokat hanya dilayani dalam bahasa Inggris, Tionghoa, Jepang, dan Korea.',
    discoveryNotice:
      'Berkas llms.txt ini hanya peta penelusuran halaman publik; berkas ini tidak menjanjikan peringkat pencarian, dukungan, rekomendasi AI, atau jaminan untuk ditampilkan.',
    confidentialNotice:
      'Karena teks asli disimpan, mohon jangan menuliskan hal yang belum diperlukan pada tahap awal, seperti nomor paspor, nomor identitas, atau data rekening bank.',
  },
  th: {
    consultationNotice:
      'ข้อมูลแนะนำส่วนนี้จัดทำเป็นภาษาไทย แต่การปรึกษากับทนายความดำเนินการเฉพาะภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี',
    discoveryNotice:
      'ไฟล์ llms.txt นี้เป็นเพียงแผนผังสำหรับค้นหน้าเว็บสาธารณะ ไม่ได้รับประกันอันดับการค้นหา การรับรอง การแนะนำโดย AI หรือการแสดงผล',
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
};

/**
 * Per-locale llms.txt for the four guidance languages (vi / id / th / fil).
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
    ...renderSections([{ heading: pack.menuLabel, entries }]),
  ], LOCALE_LLMS_TXT_MAX_BYTES);
}
