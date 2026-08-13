import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { SiteLocale } from '@/lib/locales';
import MemberAuthClient from '../MemberAuthClient';

const localizedExpectations: Array<{
  locale: SiteLocale;
  login: string;
  notice: string;
  forbiddenSignupCopy: string;
}> = [
  {
    locale: 'ko',
    login: '로그인',
    notice: '회원 계정은 담당자가 확인 후 발급합니다. 기존 회원은 로그인해 주세요.',
    forbiddenSignupCopy: '회원가입',
  },
  {
    locale: 'zh-hant',
    login: '登入',
    notice: '會員帳戶由事務所確認後建立。既有會員請登入。',
    forbiddenSignupCopy: '建立帳戶',
  },
  {
    locale: 'en',
    login: 'Sign in',
    notice: 'Member accounts are issued by the firm after review. Existing members can sign in.',
    forbiddenSignupCopy: 'Create account',
  },
  {
    locale: 'ja',
    login: 'ログイン',
    notice: '会員アカウントは事務所での確認後に発行されます。既存の会員はログインしてください。',
    forbiddenSignupCopy: 'アカウント作成',
  },
];

describe('public member authentication UI', () => {
  it.each(localizedExpectations)(
    'renders $locale as an existing-member login-only surface',
    ({ locale, login, notice, forbiddenSignupCopy }) => {
      const html = renderToStaticMarkup(
        <MemberAuthClient locale={locale} nextPath={`/${locale}/account`} />,
      );

      expect(html).toContain('data-member-login-page="true"');
      expect(html).toContain('data-public-signup-enabled="false"');
      expect(html).toContain(notice);
      expect(html).toContain(`>${login}</button>`);
      expect(html).toContain('autoComplete="current-password"');
      expect(html).not.toContain(forbiddenSignupCopy);
      expect(html).not.toContain('name="name"');
      expect(html).not.toContain('role="tablist"');
    },
  );
});
