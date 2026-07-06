import type { Locale } from '@/lib/locales';

export interface EventsCopy {
  title: string;
  eyebrow: string;
  heading: string;
  description: string;
  publicLink: string;
  statsLabel: string;
  totalLabel: string;
  publishedLabel: string;
  upcomingLabel: string;
  rsvpLabel: string;
  createHeading: string;
  titleLabel: string;
  descriptionLabel: string;
  dateLabel: string;
  timeLabel: string;
  locationLabel: string;
  capacityLabel: string;
  categoryLabel: string;
  statusLabel: string;
  ticketLabel: string;
  priceLabel: string;
  rsvpToggleLabel: string;
  createButton: string;
  creatingButton: string;
  listHeading: string;
  filterLabel: string;
  emptyState: string;
  viewLabel: string;
  toggleToDraftLabel: string;
  toggleToPublishLabel: string;
  statusDraft: string;
  statusCancelled: string;
  statusPublished: string;
  ticketFree: string;
  ticketPaid: string;
  createError: string;
  updateError: string;
  formSubmitSuccess: string;
}

const EVENTS_COPY: Record<Locale, EventsCopy> = {
  ko: {
    title: '이벤트 관리',
    eyebrow: 'Native Events',
    heading: '이벤트 관리',
    description: '세미나, 웨비나, 상담회를 만들고 RSVP와 티켓 기본 정보를 관리합니다.',
    publicLink: '공개 이벤트 보기',
    statsLabel: '이벤트 요약',
    totalLabel: '전체',
    publishedLabel: '공개',
    upcomingLabel: '예정',
    rsvpLabel: '신청',
    createHeading: '새 이벤트',
    titleLabel: '제목',
    descriptionLabel: '설명',
    dateLabel: '날짜',
    timeLabel: '시간',
    locationLabel: '장소',
    capacityLabel: '정원',
    categoryLabel: '카테고리',
    statusLabel: '상태',
    ticketLabel: '티켓',
    priceLabel: '유료 티켓 가격(TWD)',
    rsvpToggleLabel: 'RSVP 받기',
    createButton: '이벤트 생성',
    creatingButton: '저장 중...',
    listHeading: '이벤트',
    filterLabel: '상태 필터',
    emptyState: '이벤트가 없습니다.',
    viewLabel: '보기',
    toggleToDraftLabel: '초안으로',
    toggleToPublishLabel: '공개',
    statusDraft: '초안',
    statusCancelled: '취소',
    statusPublished: '공개',
    ticketFree: '무료',
    ticketPaid: '유료',
    createError: '이벤트 저장 실패',
    updateError: '상태 변경 실패',
    formSubmitSuccess: '이벤트가 생성되었습니다.',
  },
  'zh-hant': {
    title: '活動管理',
    eyebrow: 'Native Events',
    heading: '活動管理',
    description: '建立研討會、線上講座與諮詢活動，並管理 RSVP 與票種資訊。',
    publicLink: '查看公開活動',
    statsLabel: '活動摘要',
    totalLabel: '全部',
    publishedLabel: '公開',
    upcomingLabel: '即將舉行',
    rsvpLabel: '報名',
    createHeading: '新增活動',
    titleLabel: '標題',
    descriptionLabel: '說明',
    dateLabel: '日期',
    timeLabel: '時間',
    locationLabel: '地點',
    capacityLabel: '名額',
    categoryLabel: '類別',
    statusLabel: '狀態',
    ticketLabel: '票種',
    priceLabel: '付費票價格 (TWD)',
    rsvpToggleLabel: '啟用 RSVP',
    createButton: '建立活動',
    creatingButton: '儲存中...',
    listHeading: '活動',
    filterLabel: '狀態篩選',
    emptyState: '目前沒有活動。',
    viewLabel: '查看',
    toggleToDraftLabel: '改為草稿',
    toggleToPublishLabel: '公開',
    statusDraft: '草稿',
    statusCancelled: '取消',
    statusPublished: '公開',
    ticketFree: '免費',
    ticketPaid: '付費',
    createError: '活動儲存失敗',
    updateError: '狀態更新失敗',
    formSubmitSuccess: '活動已建立。',
  },
  en: {
    title: 'Event management',
    eyebrow: 'Native Events',
    heading: 'Event management',
    description: 'Create seminars, webinars, and consultations, then manage RSVP and ticket basics.',
    publicLink: 'View public events',
    statsLabel: 'Event summary',
    totalLabel: 'Total',
    publishedLabel: 'Published',
    upcomingLabel: 'Upcoming',
    rsvpLabel: 'RSVPs',
    createHeading: 'New event',
    titleLabel: 'Title',
    descriptionLabel: 'Description',
    dateLabel: 'Date',
    timeLabel: 'Time',
    locationLabel: 'Location',
    capacityLabel: 'Capacity',
    categoryLabel: 'Category',
    statusLabel: 'Status',
    ticketLabel: 'Ticket',
    priceLabel: 'Paid ticket price (TWD)',
    rsvpToggleLabel: 'Enable RSVP',
    createButton: 'Create event',
    creatingButton: 'Saving...',
    listHeading: 'Events',
    filterLabel: 'Status filter',
    emptyState: 'No events yet.',
    viewLabel: 'View',
    toggleToDraftLabel: 'Move to draft',
    toggleToPublishLabel: 'Publish',
    statusDraft: 'Draft',
    statusCancelled: 'Cancelled',
    statusPublished: 'Published',
    ticketFree: 'Free',
    ticketPaid: 'Paid',
    createError: 'Failed to save event',
    updateError: 'Failed to update status',
    formSubmitSuccess: 'Event created.',
  },
};

export function getEventsCopy(locale: Locale): EventsCopy {
  return EVENTS_COPY[locale] ?? EVENTS_COPY.en;
}
