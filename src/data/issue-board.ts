import type { IssueBoardLocale } from '@/lib/columns';

/**
 * Copy for the issue-column board (/[locale]/columns/issues), kept apart from
 * the expertise columns (/[locale]/columns). Labels follow
 * OPUS-ISSUE-BOARD-ADVICE.md (2026-09-30) and may be renamed by the owner.
 */
export type IssueBoardCopy = {
  /** Board name (tab label, page header label). */
  label: string;
  title: string;
  description: string;
  /** Tab label that leads back to the expertise columns. */
  expertTab: string;
  /** Heading of the locale-first list section on the board. */
  sectionTitle: string;
  /** Teaser heading shown on the expertise columns index. */
  teaserTitle: string;
  viewAll: string;
  home: string;
  columns: string;
  backLabel: string;
  faqHeading: string;
  tocLabel: string;
  consultationTitle: string;
  consultationText: string;
  consultationButton: string;
  relatedTitle: string;
  prevLabel: string;
  nextLabel: string;
  /** Shown above each issue article: news-based, check the date. */
  dateNote: string;
};

export const issueBoardCopy: Record<IssueBoardLocale, IssueBoardCopy> = {
  ko: {
    label: '이슈 칼럼',
    title: '이슈 칼럼',
    description: '최근 뉴스를 계기로 한국 독자가 알아 두면 좋은 대만 법률을 짧게 정리합니다. 각 글은 발행일 기준 정보입니다.',
    expertTab: '전문 칼럼',
    sectionTitle: '한국 독자를 위한 최신 이슈',
    teaserTitle: '최신 이슈 칼럼',
    viewAll: '이슈 칼럼 전체 보기',
    home: '홈',
    columns: '칼럼',
    backLabel: '← 이슈 칼럼 목록으로',
    faqHeading: '자주 묻는 질문',
    tocLabel: '이 글의 목차',
    consultationTitle: '상담 예약',
    consultationText: '대만 법률 관련 궁금한 점이 있으시면 언제든 문의해 주세요.',
    consultationButton: '문의하기',
    relatedTitle: '함께 보는 주제',
    prevLabel: '← 이전 이슈',
    nextLabel: '다음 이슈 →',
    dateNote: '뉴스를 계기로 쓴 글입니다. 발행일 이후 사정이나 법령이 바뀌었을 수 있습니다.',
  },
  'zh-hant': {
    label: '時事法律解析',
    title: '時事法律解析',
    description: '從近期新聞切入，簡要說明相關的台灣法律實務重點。各文內容以發布日當時的資訊為準。',
    expertTab: '專業專欄',
    sectionTitle: '最新時事解析',
    teaserTitle: '最新時事法律解析',
    viewAll: '查看全部時事法律解析',
    home: '首頁',
    columns: '專欄',
    backLabel: '← 返回時事法律解析',
    faqHeading: '常見問題',
    tocLabel: '本文目錄',
    consultationTitle: '預約諮詢',
    consultationText: '如有任何台灣法律相關問題，歡迎隨時聯繫我們。',
    consultationButton: '聯絡我們',
    relatedTitle: '延伸主題',
    prevLabel: '← 上一篇',
    nextLabel: '下一篇 →',
    dateNote: '本文以新聞事件為引，發布日之後情況或法令可能已有變動。',
  },
  en: {
    label: 'Taiwan Law in the News',
    title: 'Taiwan Law in the News',
    description: 'Short explainers that start from a recent news story and set out the Taiwan law behind it. Each article reflects the reports and law as of its publication date.',
    expertTab: 'Insights',
    sectionTitle: 'Latest for English-speaking readers',
    teaserTitle: 'Latest: Taiwan Law in the News',
    viewAll: 'See all news explainers',
    home: 'Home',
    columns: 'Insights',
    backLabel: '← Back to Taiwan Law in the News',
    faqHeading: 'Frequently Asked Questions',
    tocLabel: 'In this article',
    consultationTitle: 'Book Consultation',
    consultationText: 'If you have any questions about Taiwan law, feel free to contact us.',
    consultationButton: 'Contact Us',
    relatedTitle: 'Related Topics',
    prevLabel: '← Previous',
    nextLabel: 'Next →',
    dateNote: 'Written in response to a news report. Facts and law may have changed since the publication date.',
  },
  ja: {
    label: '時事解説コラム',
    title: '時事解説コラム',
    description: '最近のニュースを手がかりに、日本の読者に関わる台湾法のポイントを簡潔に解説します。各記事は公開日時点の情報に基づきます。',
    expertTab: '専門コラム',
    sectionTitle: '日本の読者向けの最新解説',
    teaserTitle: '最新の時事解説コラム',
    viewAll: '時事解説コラムをすべて見る',
    home: 'ホーム',
    columns: 'コラム',
    backLabel: '← 時事解説コラム一覧へ',
    faqHeading: 'よくある質問',
    tocLabel: 'この記事の目次',
    consultationTitle: '相談予約',
    consultationText: '台湾法務についてご不明点があれば、お気軽にお問い合わせください。',
    consultationButton: 'お問い合わせ',
    relatedTitle: '関連トピック',
    prevLabel: '← 前の記事',
    nextLabel: '次の記事 →',
    dateNote: 'ニュースをきっかけに執筆した記事です。公開日以降に状況や法令が変わっている可能性があります。',
  },
  vi: {
    label: 'Pháp luật Đài Loan qua tin tức',
    title: 'Pháp luật Đài Loan qua tin tức',
    description: 'Các bài viết ngắn bắt đầu từ một tin tức gần đây và giải thích quy định pháp luật Đài Loan liên quan. Mỗi bài phản ánh thông tin tại thời điểm đăng.',
    expertTab: 'Bài viết',
    sectionTitle: 'Bài mới nhất cho bạn đọc Việt Nam',
    teaserTitle: 'Mới nhất: Pháp luật Đài Loan qua tin tức',
    viewAll: 'Xem tất cả bài theo tin tức',
    home: 'Trang chủ',
    columns: 'Bài viết',
    backLabel: '← Pháp luật Đài Loan qua tin tức',
    faqHeading: 'Câu hỏi thường gặp',
    tocLabel: 'Nội dung bài viết',
    consultationTitle: 'Tư vấn pháp lý',
    consultationText: 'Nếu bạn có câu hỏi về pháp luật Đài Loan, hãy liên hệ với chúng tôi.',
    consultationButton: 'Gửi yêu cầu tư vấn',
    relatedTitle: 'Chủ đề liên quan',
    prevLabel: '← Bài trước',
    nextLabel: 'Bài sau →',
    dateNote: 'Bài viết dựa trên một tin tức. Tình hình hoặc quy định có thể đã thay đổi sau ngày đăng.',
  },
};

export function issueBoardPath(locale: IssueBoardLocale): string {
  return `/${locale}/columns/issues`;
}
