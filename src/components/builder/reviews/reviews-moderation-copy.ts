import type { Locale } from '@/lib/locales';
import type { Review } from '@/lib/reviews/storage';

export type ReviewsModerationCopy = {
  title: string;
  subtitle: string;
  all: string;
  pending: string;
  approved: string;
  approve: string;
  moveToPending: string;
  delete: string;
  deleteConfirm: string;
  empty: string;
  error: string;
  search: string;
  columns: {
    customer: string;
    rating: string;
    service: string;
    content: string;
    date: string;
    status: string;
    actions: string;
  };
};

export type ReviewStatusFilter = 'all' | Review['status'];

export const reviewsModerationCopy: Record<Locale, ReviewsModerationCopy> = {
  ko: {
    title: '후기 관리',
    subtitle: '공개 리뷰 보드에 노출될 고객 후기를 검토하고 승인합니다.',
    all: '전체',
    pending: '대기',
    approved: '승인',
    approve: '승인',
    moveToPending: '대기로',
    delete: '삭제',
    deleteConfirm: '이 후기를 삭제할까요?',
    empty: '표시할 후기가 없습니다.',
    error: '후기 상태를 저장하지 못했습니다.',
    search: '닉네임, 서비스, 내용 검색',
    columns: {
      customer: '고객',
      rating: '평점',
      service: '서비스',
      content: '내용',
      date: '작성일',
      status: '상태',
      actions: '작업',
    },
  },
  'zh-hant': {
    title: '評價管理',
    subtitle: '審核並發布顯示在公開評價看板上的客戶評價。',
    all: '全部',
    pending: '待審核',
    approved: '已發布',
    approve: '發布',
    moveToPending: '移回待審',
    delete: '刪除',
    deleteConfirm: '要刪除此評價嗎？',
    empty: '沒有可顯示的評價。',
    error: '無法儲存評價狀態。',
    search: '搜尋暱稱、服務或內容',
    columns: {
      customer: '客戶',
      rating: '評分',
      service: '服務',
      content: '內容',
      date: '日期',
      status: '狀態',
      actions: '操作',
    },
  },
  en: {
    title: 'Review Moderation',
    subtitle: 'Review and approve client feedback before it appears on the public board.',
    all: 'All',
    pending: 'Pending',
    approved: 'Approved',
    approve: 'Approve',
    moveToPending: 'Move to pending',
    delete: 'Delete',
    deleteConfirm: 'Delete this review?',
    empty: 'No reviews to show.',
    error: 'Could not save the review status.',
    search: 'Search nickname, service, or content',
    columns: {
      customer: 'Customer',
      rating: 'Rating',
      service: 'Service',
      content: 'Content',
      date: 'Date',
      status: 'Status',
      actions: 'Actions',
    },
  },
};
