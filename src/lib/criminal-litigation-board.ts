import { isInternalColumnPost } from './builder/columns/public-post-filter';
import { getColumnPublicationDate, type ColumnPost } from './column-post';
import { normalizeColumnTags } from './column-tags';

export const CRIMINAL_BOARD_PATH = '/criminal-litigation';
export const CRIMINAL_BOARD_TAG = 'criminal-litigation';
export const CRIMINAL_BOARD_LOCALES = ['ko', 'zh-hant', 'en', 'ja', 'vi'] as const;
export type CriminalBoardLocale = (typeof CRIMINAL_BOARD_LOCALES)[number];

export function isCriminalBoardLocale(locale: string): locale is CriminalBoardLocale {
  return (CRIMINAL_BOARD_LOCALES as readonly string[]).includes(locale);
}

/** Call with only one locale's public posts; membership is explicit, never inferred from titles. */
export function selectCriminalColumns(posts: readonly ColumnPost[]): ColumnPost[] {
  const seen = new Set<string>();
  return posts.filter((post) => {
    if (seen.has(post.slug) || isInternalColumnPost(post)
      || !normalizeColumnTags(post.tags).includes(CRIMINAL_BOARD_TAG)) return false;
    seen.add(post.slug);
    return true;
  }).sort((a, b) => getColumnPublicationDate(b).localeCompare(getColumnPublicationDate(a))
    || (b.columnNumber ?? 0) - (a.columnNumber ?? 0)
    || a.slug.localeCompare(b.slug));
}

export const criminalBoardCopy = {
  ko: {
    title: '대만 형사소송 칼럼',
    description: '증인 소환장, 형사합의와 고소취소, 불기소 재의, 압수물 반환을 대만 법령으로 설명합니다. 출석과 제출 기한, 신청할 기관, 필요한 문서를 각 글에서 확인할 수 있습니다.',
    columns: '전체 칼럼', service: '형사소송 업무 안내', read: '칼럼 읽기', language: '칼럼 언어',
  },
  'zh-hant': {
    title: '刑事訴訟專欄',
    description: '從證人傳票、和解撤告、不起訴再議到扣押物發還，依台灣法規說明出庭與提出書狀的期限、受理機關，以及需保留的文件。各篇附官方資料與查核日期。',
    columns: '所有專欄', service: '刑事訴訟服務', read: '閱讀專欄', language: '專欄語言',
  },
  en: {
    title: 'Taiwan Criminal Litigation Columns',
    description: 'Taiwan procedures for witness summonses, settlement and complaint withdrawal, reconsideration of non-prosecution, and return of seized property. Each column identifies the relevant authority, documents and deadlines, with official sources.',
    columns: 'All columns', service: 'Criminal litigation services', read: 'Read column', language: 'Column language',
  },
  ja: {
    title: '台湾の刑事訴訟コラム',
    description: '証人の召喚状、示談と告訴取消し、不起訴処分への再議、押収物の還付を台湾の法令に基づいて説明します。出頭や書面提出の期限、提出先、保管する書類を各コラムで確認できます。',
    columns: 'すべてのコラム', service: '刑事訴訟の業務案内', read: 'コラムを読む', language: 'コラムの言語',
  },
  vi: {
    title: 'Bài viết về tố tụng hình sự Đài Loan',
    description: 'Giấy triệu tập làm chứng, thỏa thuận và rút yêu cầu xử lý, xem xét lại quyết định không truy tố, trả lại vật bị thu giữ: các bài giải thích cơ quan giải quyết, giấy tờ và thời hạn theo luật Đài Loan, kèm nguồn chính thức.',
    columns: 'Tất cả bài viết', service: 'Thông tin dịch vụ pháp lý', read: 'Đọc bài', language: 'Ngôn ngữ bài viết',
  },
} satisfies Record<CriminalBoardLocale, { title: string; description: string; columns: string; service: string; read: string; language: string }>;
