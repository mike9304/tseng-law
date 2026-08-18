'use client';

import { FormEvent, useMemo, useState } from 'react';
import type { SiteLocale } from '@/lib/locales';
import styles from './MembersArea.module.css';

interface MemberAuthClientProps {
  locale: SiteLocale;
  nextPath: string;
}

function copy(locale: SiteLocale) {
  if (locale === 'zh-hant') {
    return {
      title: '會員登入',
      subtitle: '會員帳戶由事務所確認後建立。既有會員請登入。',
      login: '登入',
      email: 'Email',
      password: '密碼',
      loading: '處理中...',
    };
  }
  if (locale === 'en') {
    return {
      title: 'Member sign in',
      subtitle: 'Member accounts are issued by the firm after review. Existing members can sign in.',
      login: 'Sign in',
      email: 'Email',
      password: 'Password',
      loading: 'Working...',
    };
  }
  if (locale === 'ja') {
    return {
      title: '会員ログイン',
      subtitle: '会員アカウントは事務所での確認後に発行されます。既存の会員はログインしてください。',
      login: 'ログイン',
      email: 'メールアドレス',
      password: 'パスワード',
      loading: '処理中...',
    };
  }
  return {
    title: '회원 로그인',
    subtitle: '회원 계정은 담당자가 확인 후 발급합니다. 기존 회원은 로그인해 주세요.',
    login: '로그인',
    email: '이메일',
    password: '비밀번호',
    loading: '처리 중...',
  };
}

export default function MemberAuthClient({ locale, nextPath }: MemberAuthClientProps) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const t = useMemo(() => copy(locale), [locale]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage('');
    const form = new FormData(event.currentTarget);
    const payload = {
      email: String(form.get('email') ?? ''),
      password: String(form.get('password') ?? ''),
      locale,
    };
    try {
      const response = await fetch('/api/members/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (!response.ok || !json?.ok) throw new Error(json?.error || 'auth_failed');
      window.location.assign(nextPath || `/${locale}/account`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'auth_failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <main
      className={styles.authPage}
      data-member-login-page="true"
      data-public-signup-enabled="false"
    >
      <section className={styles.authPanel}>
        <div className={styles.authIntro}>
          <p>Members</p>
          <h1>{t.title}</h1>
          <span>{t.subtitle}</span>
        </div>
        <form className={styles.authForm} onSubmit={submit}>
          <label>
            {t.email}
            <input name="email" type="email" autoComplete="email" required disabled={pending} />
          </label>
          <label>
            {t.password}
            <input name="password" type="password" autoComplete="current-password" required minLength={8} disabled={pending} />
          </label>
          <button type="submit" disabled={pending}>
            {pending ? t.loading : t.login}
          </button>
          {message ? <p className={styles.error} role="alert">{message}</p> : null}
        </form>
      </section>
    </main>
  );
}
