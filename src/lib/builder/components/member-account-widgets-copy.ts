import type { Locale } from '@/lib/locales';

export interface MemberProfileFormCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  name: string;
  phone: string;
  save: string;
  saving: string;
  saved: string;
  loading: string;
  guest: string;
  error: string;
  login: string;
  previewName: string;
  previewPhone: string;
  inspector: {
    title: string;
    subtitle: string;
    nameLabel: string;
    phoneLabel: string;
    saveLabel: string;
    savingLabel: string;
    savedLabel: string;
    loginLink: string;
  };
}

export interface MemberBookingsListCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  upcoming: string;
  past: string;
  emptyUpcoming: string;
  emptyPast: string;
  loading: string;
  guest: string;
  error: string;
  login: string;
  staff: string;
  statusLabels: Record<string, string>;
  inspector: {
    title: string;
    subtitle: string;
    upcomingLabel: string;
    showPast: string;
    pastLabel: string;
    loginLink: string;
  };
}

export interface MemberAccountWidgetsCopy {
  profileForm: MemberProfileFormCopy;
  bookingsList: MemberBookingsListCopy;
}

export const MEMBER_PROFILE_FORM_KO_DEFAULTS = {
  title: '회원 프로필',
  subtitle: '회원 이름과 연락처를 직접 수정합니다.',
  nameLabel: '이름',
  phoneLabel: '전화번호',
  saveLabel: '프로필 저장',
  savingLabel: '저장 중...',
  savedLabel: '저장되었습니다.',
  loginLabel: '로그인',
} as const;

export const MEMBER_BOOKINGS_LIST_KO_DEFAULTS = {
  title: '내 예약',
  subtitle: '회원 이메일과 일치하는 상담 예약을 보여줍니다.',
  upcomingLabel: '다가오는 예약',
  pastLabel: '지난 예약',
  emptyUpcomingLabel: '예정된 예약이 없습니다.',
  emptyPastLabel: '지난 예약 내역이 없습니다.',
  loginLabel: '로그인',
} as const;

export function localizedMemberText(value: string | undefined, localized: string, legacyDefault?: string): string {
  const trimmed = value?.trim() ?? '';
  if (!trimmed) return localized;
  if (legacyDefault && trimmed === legacyDefault) return localized;
  return value ?? localized;
}

const MEMBER_ACCOUNT_WIDGETS_COPY: Record<Locale, MemberAccountWidgetsCopy> = {
  ko: {
    profileForm: {
      eyebrow: '프로필',
      title: '회원 프로필',
      subtitle: '회원 이름과 연락처를 직접 수정합니다.',
      name: '이름',
      phone: '전화번호',
      save: '프로필 저장',
      saving: '저장 중...',
      saved: '저장되었습니다.',
      loading: '회원 정보를 불러오는 중...',
      guest: '프로필을 수정하려면 로그인해 주세요.',
      error: '회원 정보를 불러오지 못했습니다.',
      login: '로그인',
      previewName: '회원 미리보기',
      previewPhone: '010-0000-0000',
      inspector: {
        title: '제목',
        subtitle: '설명',
        nameLabel: '이름 라벨',
        phoneLabel: '전화번호 라벨',
        saveLabel: '저장 버튼',
        savingLabel: '저장 중 라벨',
        savedLabel: '저장 완료 메시지',
        loginLink: '로그인 링크',
      },
    },
    bookingsList: {
      eyebrow: '예약',
      title: '내 예약',
      subtitle: '회원 이메일과 일치하는 상담 예약을 보여줍니다.',
      upcoming: '다가오는 예약',
      past: '지난 예약',
      emptyUpcoming: '예정된 예약이 없습니다.',
      emptyPast: '지난 예약 내역이 없습니다.',
      loading: '예약을 불러오는 중...',
      guest: '예약을 보려면 로그인해 주세요.',
      error: '예약을 불러오지 못했습니다.',
      login: '로그인',
      staff: '담당',
      statusLabels: {
        pending: '대기 중',
        confirmed: '확인됨',
        cancelled: '취소됨',
        completed: '완료됨',
        'no-show': '노쇼',
      },
      inspector: {
        title: '제목',
        subtitle: '설명',
        upcomingLabel: '다가오는 예약 라벨',
        showPast: '지난 예약 표시',
        pastLabel: '지난 예약 라벨',
        loginLink: '로그인 링크',
      },
    },
  },
  'zh-hant': {
    profileForm: {
      eyebrow: '個人資料',
      title: '會員個人資料',
      subtitle: '更新會員姓名與聯絡電話。',
      name: '姓名',
      phone: '電話',
      save: '儲存個人資料',
      saving: '儲存中...',
      saved: '已儲存。',
      loading: '正在載入會員資料...',
      guest: '請先登入以編輯個人資料。',
      error: '無法載入會員資料。',
      login: '登入',
      previewName: '會員預覽',
      previewPhone: '+886 900 000 000',
      inspector: {
        title: '標題',
        subtitle: '說明',
        nameLabel: '姓名標籤',
        phoneLabel: '電話標籤',
        saveLabel: '儲存按鈕',
        savingLabel: '儲存中標籤',
        savedLabel: '儲存完成訊息',
        loginLink: '登入連結',
      },
    },
    bookingsList: {
      eyebrow: '預約',
      title: '我的預約',
      subtitle: '顯示與會員信箱相符的諮詢預約。',
      upcoming: '即將到來',
      past: '過去預約',
      emptyUpcoming: '目前沒有即將到來的預約。',
      emptyPast: '目前沒有過去預約。',
      loading: '正在載入預約...',
      guest: '請先登入以查看預約。',
      error: '無法載入預約。',
      login: '登入',
      staff: '負責人',
      statusLabels: {
        pending: '待確認',
        confirmed: '已確認',
        cancelled: '已取消',
        completed: '已完成',
        'no-show': '未出席',
      },
      inspector: {
        title: '標題',
        subtitle: '說明',
        upcomingLabel: '即將到來標籤',
        showPast: '顯示過去預約',
        pastLabel: '過去預約標籤',
        loginLink: '登入連結',
      },
    },
  },
  en: {
    profileForm: {
      eyebrow: 'Profile',
      title: 'Member profile',
      subtitle: 'Update the member name and contact phone.',
      name: 'Name',
      phone: 'Phone',
      save: 'Save profile',
      saving: 'Saving...',
      saved: 'Saved.',
      loading: 'Loading member details...',
      guest: 'Sign in to edit your profile.',
      error: 'Could not load member details.',
      login: 'Sign in',
      previewName: 'Member Preview',
      previewPhone: '+1 555 0100',
      inspector: {
        title: 'Title',
        subtitle: 'Description',
        nameLabel: 'Name label',
        phoneLabel: 'Phone label',
        saveLabel: 'Save button',
        savingLabel: 'Saving label',
        savedLabel: 'Saved message',
        loginLink: 'Login link',
      },
    },
    bookingsList: {
      eyebrow: 'Bookings',
      title: 'My bookings',
      subtitle: 'Shows consultations matching the member email.',
      upcoming: 'Upcoming',
      past: 'Past',
      emptyUpcoming: 'No upcoming bookings.',
      emptyPast: 'No past bookings yet.',
      loading: 'Loading bookings...',
      guest: 'Sign in to view your bookings.',
      error: 'Could not load bookings.',
      login: 'Sign in',
      staff: 'Staff',
      statusLabels: {
        pending: 'Pending',
        confirmed: 'Confirmed',
        cancelled: 'Cancelled',
        completed: 'Completed',
        'no-show': 'No-show',
      },
      inspector: {
        title: 'Title',
        subtitle: 'Description',
        upcomingLabel: 'Upcoming label',
        showPast: 'Show past bookings',
        pastLabel: 'Past label',
        loginLink: 'Login link',
      },
    },
  },
};

export function getMemberAccountWidgetsCopy(locale: Locale): MemberAccountWidgetsCopy {
  return MEMBER_ACCOUNT_WIDGETS_COPY[locale] ?? MEMBER_ACCOUNT_WIDGETS_COPY.ko;
}
