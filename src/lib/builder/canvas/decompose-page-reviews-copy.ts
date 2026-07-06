import type { Locale } from '@/lib/locales';

export type ReviewPageCopy = {
  readonly formTitle: string;
  readonly moderationNote: string;
  readonly nickname: string;
  readonly nicknamePh: string;
  readonly rating: string;
  readonly service: string;
  readonly servicePh: string;
  readonly content: string;
  readonly contentPh: string;
  readonly submit: string;
  readonly reviewsTitle: string;
  readonly noReviews: string;
};

export const reviewCopy = {
  ko: {
    formTitle: '후기 작성',
    moderationNote: '후기는 검토 후 공개됩니다. 개인정보, 사건번호, 외부 링크는 제외해 주세요.',
    nickname: '닉네임',
    nicknamePh: '이름 또는 닉네임',
    rating: '별점',
    service: '이용 서비스',
    servicePh: '선택해 주세요',
    content: '후기 내용',
    contentPh: '서비스 이용 후기를 자유롭게 작성해 주세요.',
    submit: '후기 등록',
    reviewsTitle: '고객 후기',
    noReviews: '아직 등록된 후기가 없습니다. 첫 번째 후기를 남겨 주세요!',
  },
  'zh-hant': {
    formTitle: '撰寫評價',
    moderationNote: '評價送出後會先審核再公開。請勿填寫個資、案件編號或外部連結。',
    nickname: '暱稱',
    nicknamePh: '您的名字或暱稱',
    rating: '評分',
    service: '使用服務',
    servicePh: '請選擇',
    content: '評價內容',
    contentPh: '請自由撰寫您的服務體驗。',
    submit: '提交評價',
    reviewsTitle: '客戶評價',
    noReviews: '目前尚無評價，歡迎成為第一位！',
  },
  en: {
    formTitle: 'Write a Review',
    moderationNote: 'Reviews are published after moderation. Please omit private details, case numbers, and external links.',
    nickname: 'Nickname',
    nicknamePh: 'Your name or nickname',
    rating: 'Rating',
    service: 'Service Used',
    servicePh: 'Select a service',
    content: 'Review',
    contentPh: 'Share your experience with our services.',
    submit: 'Submit Review',
    reviewsTitle: 'Client Reviews',
    noReviews: 'No reviews yet. Be the first to share your experience!',
  },
} as const satisfies Record<Locale, ReviewPageCopy>;
