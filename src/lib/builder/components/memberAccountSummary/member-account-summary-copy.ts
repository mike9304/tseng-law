import type { Locale } from '@/lib/locales';

export interface MemberAccountSummaryCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  role: string;
  roleLabels: Record<string, string>;
  loading: string;
  guest: string;
  error: string;
  profile: string;
  bookings: string;
  premium: string;
  login: string;
  inspectorTitle: string;
  inspectorDescription: string;
  inspectorProfileLink: string;
  inspectorShowBookings: string;
  inspectorBookingsLink: string;
  inspectorShowPremium: string;
  inspectorPremiumLink: string;
  inspectorLoginLink: string;
}

export const MEMBER_ACCOUNT_SUMMARY_KO_DEFAULTS = {
  title: '내 계정',
  subtitle: '회원 정보와 전용 페이지를 한 곳에서 확인합니다.',
  profileLabel: '프로필',
  bookingsLabel: '예약',
  premiumLabel: '프리미엄',
  loginLabel: '로그인',
} as const;

const MEMBER_ACCOUNT_SUMMARY_COPY: Record<Locale, MemberAccountSummaryCopy> = {
  ko: {
    eyebrow: '회원',
    title: '내 계정',
    subtitle: '회원 정보와 전용 페이지를 한 곳에서 확인합니다.',
    role: '역할',
    roleLabels: {
      free: '무료',
      premium: '프리미엄',
      admin: '관리자',
    },
    loading: '회원 정보를 불러오는 중...',
    guest: '계정 요약을 보려면 로그인해 주세요.',
    error: '회원 정보를 불러오지 못했습니다.',
    profile: '프로필',
    bookings: '예약',
    premium: '프리미엄 영역',
    login: '로그인',
    inspectorTitle: '제목',
    inspectorDescription: '설명',
    inspectorProfileLink: '프로필 링크',
    inspectorShowBookings: '예약 링크 표시',
    inspectorBookingsLink: '예약 링크',
    inspectorShowPremium: '프리미엄 링크 표시',
    inspectorPremiumLink: '프리미엄 링크',
    inspectorLoginLink: '로그인 링크',
  },
  'zh-hant': {
    eyebrow: '會員',
    title: '我的帳戶',
    subtitle: '集中查看會員資料與專屬頁面。',
    role: '角色',
    roleLabels: {
      free: '免費',
      premium: '進階會員',
      admin: '管理員',
    },
    loading: '正在載入會員資料...',
    guest: '請先登入以查看帳戶摘要。',
    error: '無法載入會員資料。',
    profile: '個人資料',
    bookings: '預約',
    premium: '進階會員區',
    login: '登入',
    inspectorTitle: '標題',
    inspectorDescription: '說明',
    inspectorProfileLink: '個人資料連結',
    inspectorShowBookings: '顯示預約連結',
    inspectorBookingsLink: '預約連結',
    inspectorShowPremium: '顯示進階連結',
    inspectorPremiumLink: '進階連結',
    inspectorLoginLink: '登入連結',
  },
  en: {
    eyebrow: 'Members',
    title: 'My account',
    subtitle: 'Review member details and member-only pages in one place.',
    role: 'Role',
    roleLabels: {
      free: 'Free',
      premium: 'Premium',
      admin: 'Admin',
    },
    loading: 'Loading member details...',
    guest: 'Sign in to view your account summary.',
    error: 'Could not load member details.',
    profile: 'Profile',
    bookings: 'Bookings',
    premium: 'Premium area',
    login: 'Sign in',
    inspectorTitle: 'Title',
    inspectorDescription: 'Description',
    inspectorProfileLink: 'Profile link',
    inspectorShowBookings: 'Show bookings link',
    inspectorBookingsLink: 'Bookings link',
    inspectorShowPremium: 'Show premium link',
    inspectorPremiumLink: 'Premium link',
    inspectorLoginLink: 'Login link',
  },
};

export function getMemberAccountSummaryCopy(locale: Locale): MemberAccountSummaryCopy {
  return MEMBER_ACCOUNT_SUMMARY_COPY[locale] ?? MEMBER_ACCOUNT_SUMMARY_COPY.ko;
}
