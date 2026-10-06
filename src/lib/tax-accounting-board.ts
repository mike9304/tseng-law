/**
 * Tax & accounting board for /{locale}/tax-accounting.
 *
 * Client-safe (no `fs`). Inclusion never reads titles or bodies:
 *   1. a column whose frontmatter `tags` contain `tax-accounting` is a board
 *      column (written for the board);
 *   2. a column in the reviewed legacy slug list is a related column — it was
 *      published before the board existed, so its file is left untouched.
 * Only the locale's own files are listed; a locale never shows another
 * language's text. Authoring contract: docs/columns/TAX-ACCOUNTING-BOARD.md.
 */
import { isInternalColumnPost } from './builder/columns/public-post-filter';
import { getColumnPublicationDate, type ColumnPost } from './column-post';
import { normalizeColumnTags } from './column-tags';
import { COLUMN_TOPIC_LABELS } from './column-topics';
import type { SiteLocale } from './locales';

export const TAX_ACCOUNTING_BOARD_PATH = '/tax-accounting';
export const TAX_ACCOUNTING_TAG = 'tax-accounting';

/** Corporate tax columns published before the board; each was read before listing. */
export const LEGACY_TAX_ACCOUNTING_SLUGS = [
  'taiwan-company-subsidiary-vs-branch',
  'withdraw-capital-taiwan-company',
  'taiwan-vat-foreign-digital-services-registration',
  'us-taiwan-double-taxation-semiconductor-expansion',
  'japan-taiwan-tax-agreement-semiconductor-expatriates',
  'korea-taiwan-tax-agreement-dispatched-engineers-permanent-establishment',
  'taiwan-cfc-overseas-subsidiary-tax',
  'taiwan-employee-stock-award-tax-deferral-industrial-innovation-act-19-1',
  'taiwan-income-tax-residency',
  'taiwan-stocks-direct-investment-tax',
] as const;

const LEGACY_SLUGS: ReadonlySet<string> = new Set(LEGACY_TAX_ACCOUNTING_SLUGS);

export function isTaxAccountingBoardColumn(post: Pick<ColumnPost, 'tags'>): boolean {
  return normalizeColumnTags(post.tags).includes(TAX_ACCOUNTING_TAG);
}

/** Newest publication date first; same day → higher file number first. */
function newestFirst(a: ColumnPost, b: ColumnPost): number {
  return getColumnPublicationDate(b).localeCompare(getColumnPublicationDate(a))
    || (b.columnNumber ?? 0) - (a.columnNumber ?? 0)
    || a.slug.localeCompare(b.slug);
}

export type TaxAccountingBoardLists = {
  /** Columns tagged for the board. */
  board: ColumnPost[];
  /** Earlier corporate tax columns in the same locale. */
  related: ColumnPost[];
};

/** Splits one locale's column files into board and related lists. */
export function selectTaxAccountingColumns(posts: readonly ColumnPost[]): TaxAccountingBoardLists {
  const board: ColumnPost[] = [];
  const related: ColumnPost[] = [];
  const seen = new Set<string>();
  for (const post of posts) {
    if (seen.has(post.slug) || isInternalColumnPost(post)) continue;
    if (isTaxAccountingBoardColumn(post)) board.push(post);
    else if (LEGACY_SLUGS.has(post.slug)) related.push(post);
    else continue;
    seen.add(post.slug);
  }
  return { board: board.sort(newestFirst), related: related.sort(newestFirst) };
}

export function taxAccountingColumnBadge(post: ColumnPost, locale: SiteLocale): string {
  return (post.topic && COLUMN_TOPIC_LABELS[locale]?.[post.topic]) || taxAccountingBoardCopy[locale].kicker;
}

export const taxAccountingBoardCopy: Record<
  SiteLocale,
  {
    kicker: string;
    title: string;
    description: string;
    boardHeading: string;
    relatedHeading: string;
    readMore: string;
    contactTitle: string;
    contactText: string;
    contactBtn: string;
    emailBtn: string;
    metaTitle: string;
    keywords: string[];
  }
> = {
  ko: {
    kicker: '세무·회계 칼럼',
    title: '대만에 법인이나 지점을 둔 외국 기업의 세무와 회계',
    description:
      '대만 자회사·지점의 법인세 신고 일정, 배당 송금 원천징수, 외국 본사에 지급하는 대가의 과세, 이전가격 문서, 회계감사 기준을 대만 법령과 재정부 공개 자료로 설명합니다. 한국·일본·미국·베트남 기업에 적용되는 조세협정의 차이도 다룹니다. 각 칼럼에 자료 확인일을 적었습니다.',
    boardHeading: '세무·회계 칼럼',
    relatedHeading: '함께 읽을 기존 칼럼',
    readMore: '칼럼 보기 →',
    contactTitle: '기업 세무 법률 문의',
    contactText:
      '회사명, 본사 소재국, 대만 거점 형태(자회사·지점·미설립), 문의할 거래나 신고 항목을 적어 보내 주세요. 계약서·재무자료 같은 기밀자료는 이해충돌 확인 후 따로 받습니다.',
    contactBtn: '공식 문의 페이지',
    emailBtn: '이메일 문의',
    metaTitle: '대만 세무·회계 칼럼 | 외국 기업의 법인세·원천징수',
    keywords: ['대만 세무', '대만 법인세', '대만 원천징수', '대만 이전가격', '대만 회계감사'],
  },
  'zh-hant': {
    kicker: '稅務會計專欄',
    title: '外國企業在台子公司與分公司的稅務會計',
    description:
      '說明外商在台子公司、分公司常遇到的稅務會計問題：營利事業所得稅申報時程、股利匯出扣繳、支付國外總公司款項的課稅、移轉訂價文據與會計師查核門檻，並比較美、日、韓、越企業適用租稅協定的差別。內容依台灣法規與財政部公開資料撰寫，各篇註明資料查核日期。',
    boardHeading: '稅務會計專欄',
    relatedHeading: '相關專欄',
    readMore: '閱讀專欄 →',
    contactTitle: '企業稅務法律諮詢',
    contactText:
      '初次聯繫時，請提供公司名稱、總公司所在國家、在台據點型態（子公司、分公司或尚未設立），以及想詢問的交易或申報項目。合約、財務資料等機密文件，請待確認有無利益衝突後再提供。',
    contactBtn: '聯絡頁面',
    emailBtn: '電子郵件諮詢',
    metaTitle: '稅務會計專欄 | 外商在台營所稅、扣繳與移轉訂價',
    keywords: ['外商稅務', '營利事業所得稅', '股利扣繳', '移轉訂價', '租稅協定'],
  },
  en: {
    kicker: 'Tax & accounting',
    title: 'Tax and accounting for foreign companies with a Taiwan subsidiary or branch',
    description:
      'Columns on the Taiwan corporate tax calendar, withholding on dividends and on payments to a foreign head office, transfer pricing documents and audit thresholds, written from Taiwan statutes and Ministry of Finance materials. Where US, Japanese, Korean and Vietnamese companies are treated differently under tax agreements, the columns say so. Each column shows the date its sources were checked.',
    boardHeading: 'Tax & accounting columns',
    relatedHeading: 'Earlier related columns',
    readMore: 'Open column →',
    contactTitle: 'Corporate tax inquiries',
    contactText:
      'In the first message, send the company name, head-office country, your Taiwan setup (subsidiary, branch or not yet set up) and the transaction or filing you are asking about. Send contracts and financial records only after a conflict check.',
    contactBtn: 'Contact page',
    emailBtn: 'Email inquiry',
    metaTitle: 'Taiwan Tax & Accounting for Foreign Companies',
    keywords: ['Taiwan corporate tax', 'Taiwan withholding tax', 'Taiwan transfer pricing', 'Taiwan tax treaty', 'Taiwan audit'],
  },
  ja: {
    kicker: '税務・会計コラム',
    title: '台湾に子会社・支店を持つ外国企業の税務と会計',
    description:
      '台湾子会社・支店の法人税申告スケジュール、配当送金の源泉徴収、外国本社への支払いにかかる課税、移転価格文書、会計士監査の基準を、台湾の法令と財政部の公表資料に基づいて説明します。日本・韓国・米国・ベトナムの企業で異なる租税取決め・協定の扱いも取り上げます。各コラムに資料の確認日を記載しています。',
    boardHeading: '税務・会計コラム',
    relatedHeading: 'これまでの関連コラム',
    readMore: 'コラムを読む →',
    contactTitle: '企業の税務に関するご相談',
    contactText:
      '初回のお問い合わせでは、会社名、本社所在国、台湾拠点の形態（子会社・支店・未設立）、ご相談の取引や申告の内容をお知らせください。契約書や財務資料などの機密資料は、利益相反の確認後に別途お送りください。',
    contactBtn: '公式お問い合わせ',
    emailBtn: 'メール相談',
    metaTitle: '台湾 税務・会計コラム | 法人税・源泉徴収・移転価格',
    keywords: ['台湾 税務', '台湾 法人税', '台湾 源泉徴収', '台湾 移転価格', '日台租税取決め'],
  },
};
