import { isInternalColumnPost } from './builder/columns/public-post-filter';
import { getColumnPublicationDate, type ColumnPost } from './column-post';
import { normalizeColumnTags } from './column-tags';
import columnUiVi from '@/data/column-ui-vi.json';

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
    description: '대만에서 범죄 피해를 신고하거나 수사·재판을 받을 때 필요한 절차를 다룹니다. 사건별 증거와 고소, 체포와 구속, 판결에 대한 불복, 피해 회복과 형의 집행을 공식 자료와 함께 설명합니다.',
    columns: '전체 칼럼', service: '형사소송 업무 안내', read: '칼럼 읽기', language: '칼럼 언어',
    count: (value: number) => `총 ${value}편`,
    search: '형사소송 칼럼 검색', placeholder: '사건이나 절차로 검색', submit: '검색', reset: '전체 글 보기',
    empty: '검색어에 맞는 글이 없습니다.', results: (n: number) => `검색 결과 ${n}편`,
  },
  'zh-hant': {
    title: '刑事訴訟專欄',
    description: '依台灣法規說明報案與蒐證、偵查與羈押、刑事審判與救濟，以及求償和刑罰執行。從各篇確認受理機關、期限、所需文件與例外，並可查閱引用的官方資料。',
    columns: '所有專欄', service: '刑事訴訟服務', read: '閱讀專欄', language: '專欄語言',
    count: (value: number) => `共 ${value} 篇`,
    search: '搜尋刑事訴訟專欄', placeholder: '輸入案件或程序', submit: '搜尋', reset: '查看全部文章',
    empty: '沒有符合關鍵字的文章。', results: (n: number) => `找到 ${n} 篇文章`,
  },
  en: {
    title: 'Taiwan Criminal Litigation Columns',
    description: 'Taiwan criminal cases from reporting and investigation through detention, trial, appeals and sentencing. Find the relevant authority, evidence, deadlines and routes to compensation, with links to official sources.',
    columns: 'All columns', service: 'Criminal litigation services', read: 'Read column', language: 'Column language',
    count: (value: number) => `${value} ${value === 1 ? 'article' : 'articles'}`,
    search: 'Search criminal law articles', placeholder: 'Search an offense or procedure', submit: 'Search', reset: 'View all articles',
    empty: 'No articles match your search.', results: (n: number) => `${n} search ${n === 1 ? 'result' : 'results'}`,
  },
  ja: {
    title: '台湾の刑事訴訟コラム',
    description: '台湾での被害申告や証拠の保存から、取調べ、勾留、裁判、不服申立て、損害賠償と刑の執行までを扱います。提出先や期限、必要な書類と例外を、台湾の公的資料とともに説明します。',
    columns: 'すべてのコラム', service: '刑事訴訟の業務案内', read: 'コラムを読む', language: 'コラムの言語',
    count: (value: number) => `全${value}件`,
    search: '刑事訴訟コラムを検索', placeholder: '事件や手続で検索', submit: '検索', reset: 'すべての記事を表示',
    empty: '検索語に一致する記事はありません。', results: (n: number) => `検索結果 ${n}件`,
  },
  vi: {
    title: 'Bài viết về tố tụng hình sự Đài Loan',
    description: 'Từ trình báo và lưu giữ chứng cứ đến điều tra, tạm giam, xét xử, kháng cáo và thi hành án tại Đài Loan. Các bài giải thích cơ quan tiếp nhận, thời hạn, giấy tờ và cách yêu cầu bồi thường, kèm nguồn chính thức.',
    columns: 'Tất cả bài viết', service: 'Thông tin dịch vụ pháp lý', read: 'Đọc bài', language: 'Ngôn ngữ bài viết',
    count: (value: number) => `${value} bài viết`,
    search: columnUiVi.search.label, placeholder: columnUiVi.search.placeholder, submit: columnUiVi.search.submit,
    reset: columnUiVi.search.reset, empty: columnUiVi.search.noMatches,
    results: (n: number) => columnUiVi.search.resultCount.replace('{n}', String(n)),
  },
} satisfies Record<CriminalBoardLocale, {
  title: string; description: string; columns: string; service: string; read: string; language: string;
  count: (value: number) => string; search: string; placeholder: string; submit: string; reset: string;
  empty: string; results: (value: number) => string;
}>;
