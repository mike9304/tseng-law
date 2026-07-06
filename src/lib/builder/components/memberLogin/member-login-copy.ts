import type { Locale } from '@/lib/locales';

export interface MemberLoginCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  login: string;
  signup: string;
  email: string;
  name: string;
  password: string;
  loading: string;
  error: string;
  authModeAriaLabel: string;
  inspectorTitle: string;
  inspectorSubtitle: string;
  inspectorNextPath: string;
  inspectorShowSignup: string;
  inspectorDefaultTab: string;
  inspectorLoginLabel: string;
  inspectorSignupLabel: string;
  inspectorModeLogin: string;
  inspectorModeSignup: string;
}

export const MEMBER_LOGIN_KO_DEFAULTS = {
  title: '회원 로그인',
  subtitle: '로그인하거나 계정을 만들어 회원 전용 콘텐츠로 이동합니다.',
  loginLabel: '로그인',
  signupLabel: '회원가입',
} as const;

const MEMBER_LOGIN_COPY: Record<Locale, MemberLoginCopy> = {
  ko: {
    eyebrow: '회원',
    title: '회원 로그인',
    subtitle: '로그인하거나 계정을 만들어 회원 전용 콘텐츠로 이동합니다.',
    login: '로그인',
    signup: '회원가입',
    email: '이메일',
    name: '이름',
    password: '비밀번호',
    loading: '처리 중...',
    error: '로그인에 실패했습니다. 입력값을 확인해 주세요.',
    authModeAriaLabel: '회원 인증 모드',
    inspectorTitle: '제목',
    inspectorSubtitle: '설명',
    inspectorNextPath: '로그인 후 이동 경로',
    inspectorShowSignup: '회원가입 탭 표시',
    inspectorDefaultTab: '기본 탭',
    inspectorLoginLabel: '로그인 버튼 라벨',
    inspectorSignupLabel: '회원가입 버튼 라벨',
    inspectorModeLogin: '로그인',
    inspectorModeSignup: '회원가입',
  },
  'zh-hant': {
    eyebrow: '會員',
    title: '會員登入',
    subtitle: '登入或建立帳戶以進入會員專屬內容。',
    login: '登入',
    signup: '建立帳戶',
    email: 'Email',
    name: '姓名',
    password: '密碼',
    loading: '處理中...',
    error: '登入失敗，請確認資料後再試一次。',
    authModeAriaLabel: '會員驗證模式',
    inspectorTitle: '標題',
    inspectorSubtitle: '說明',
    inspectorNextPath: '登入後前往路徑',
    inspectorShowSignup: '顯示註冊分頁',
    inspectorDefaultTab: '預設分頁',
    inspectorLoginLabel: '登入按鈕標籤',
    inspectorSignupLabel: '註冊按鈕標籤',
    inspectorModeLogin: '登入',
    inspectorModeSignup: '註冊',
  },
  en: {
    eyebrow: 'Members',
    title: 'Member sign in',
    subtitle: 'Sign in or create an account to continue to member-only content.',
    login: 'Sign in',
    signup: 'Create account',
    email: 'Email',
    name: 'Name',
    password: 'Password',
    loading: 'Working...',
    error: 'Authentication failed. Check your details and try again.',
    authModeAriaLabel: 'Member auth mode',
    inspectorTitle: 'Title',
    inspectorSubtitle: 'Subtitle',
    inspectorNextPath: 'Post-login path',
    inspectorShowSignup: 'Show signup tab',
    inspectorDefaultTab: 'Default tab',
    inspectorLoginLabel: 'Login button label',
    inspectorSignupLabel: 'Signup button label',
    inspectorModeLogin: 'Login',
    inspectorModeSignup: 'Signup',
  },
};

export function getMemberLoginCopy(locale: Locale): MemberLoginCopy {
  return MEMBER_LOGIN_COPY[locale] ?? MEMBER_LOGIN_COPY.ko;
}
