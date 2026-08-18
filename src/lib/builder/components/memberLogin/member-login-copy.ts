import type { Locale } from '@/lib/locales';

export interface MemberLoginCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  login: string;
  email: string;
  password: string;
  loading: string;
  error: string;
  inspectorTitle: string;
  inspectorSubtitle: string;
  inspectorNextPath: string;
  inspectorPublicSignupNotice: string;
  inspectorLoginLabel: string;
}

export const MEMBER_LOGIN_KO_DEFAULTS = {
  title: '회원 로그인',
  subtitle: '회원 계정은 담당자가 확인 후 발급합니다. 기존 회원은 로그인해 주세요.',
  loginLabel: '로그인',
  signupLabel: '',
} as const;

const LEGACY_PUBLIC_SIGNUP_SUBTITLES = new Set([
  '로그인하거나 계정을 만들어 회원 전용 콘텐츠로 이동합니다.',
  '회원 전용 계정 페이지로 이동하기 전에 로그인 또는 회원가입을 완료합니다.',
  '登入或建立帳戶以進入會員專屬內容。',
  '前往會員專屬帳戶頁前，請先登入或建立帳戶。',
  'Sign in or create an account to continue to member-only content.',
  'Sign in or create an account before continuing to member-only account pages.',
]);

export function localizedMemberLoginSubtitle(value: string | undefined, localized: string): string {
  const trimmed = value?.trim() ?? '';
  if (!trimmed || trimmed === MEMBER_LOGIN_KO_DEFAULTS.subtitle || LEGACY_PUBLIC_SIGNUP_SUBTITLES.has(trimmed)) {
    return localized;
  }
  return value ?? localized;
}

const MEMBER_LOGIN_COPY: Record<Locale, MemberLoginCopy> = {
  ko: {
    eyebrow: '회원',
    title: '회원 로그인',
    subtitle: '회원 계정은 담당자가 확인 후 발급합니다. 기존 회원은 로그인해 주세요.',
    login: '로그인',
    email: '이메일',
    password: '비밀번호',
    loading: '처리 중...',
    error: '로그인에 실패했습니다. 입력값을 확인해 주세요.',
    inspectorTitle: '제목',
    inspectorSubtitle: '설명',
    inspectorNextPath: '로그인 후 이동 경로',
    inspectorPublicSignupNotice: '공개 회원가입은 비활성화되어 있습니다. 회원 계정은 회원 관리 화면에서 발급하세요.',
    inspectorLoginLabel: '로그인 버튼 라벨',
  },
  'zh-hant': {
    eyebrow: '會員',
    title: '會員登入',
    subtitle: '會員帳戶由事務所確認後建立。既有會員請登入。',
    login: '登入',
    email: 'Email',
    password: '密碼',
    loading: '處理中...',
    error: '登入失敗，請確認資料後再試一次。',
    inspectorTitle: '標題',
    inspectorSubtitle: '說明',
    inspectorNextPath: '登入後前往路徑',
    inspectorPublicSignupNotice: '公開註冊已停用。請在會員管理頁面建立會員帳戶。',
    inspectorLoginLabel: '登入按鈕標籤',
  },
  en: {
    eyebrow: 'Members',
    title: 'Member sign in',
    subtitle: 'Member accounts are issued by the firm after review. Existing members can sign in.',
    login: 'Sign in',
    email: 'Email',
    password: 'Password',
    loading: 'Working...',
    error: 'Authentication failed. Check your details and try again.',
    inspectorTitle: 'Title',
    inspectorSubtitle: 'Subtitle',
    inspectorNextPath: 'Post-login path',
    inspectorPublicSignupNotice: 'Public signup is disabled. Create member accounts from member management.',
    inspectorLoginLabel: 'Login button label',
  },
};

export function getMemberLoginCopy(locale: Locale): MemberLoginCopy {
  return MEMBER_LOGIN_COPY[locale] ?? MEMBER_LOGIN_COPY.ko;
}
