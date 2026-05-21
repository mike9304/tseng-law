'use client';

import { FormEvent, useMemo, useState } from 'react';
import type { Locale } from '@/lib/locales';
import styles from './MembersArea.module.css';

type AuthMode = 'login' | 'signup';

interface MemberAuthClientProps {
  locale: Locale;
  nextPath: string;
}

function copy(locale: Locale) {
  if (locale === 'zh-hant') {
    return {
      title: '會員登入',
      subtitle: '登入後可查看帳戶頁面與限定內容。',
      login: '登入',
      signup: '建立帳戶',
      email: 'Email',
      name: '姓名',
      password: '密碼',
      submitLogin: '登入',
      submitSignup: '建立帳戶',
      loading: '處理中...',
    };
  }
  if (locale === 'en') {
    return {
      title: 'Member sign in',
      subtitle: 'Access account pages and member-only content.',
      login: 'Sign in',
      signup: 'Create account',
      email: 'Email',
      name: 'Name',
      password: 'Password',
      submitLogin: 'Sign in',
      submitSignup: 'Create account',
      loading: 'Working...',
    };
  }
  return {
    title: '회원 로그인',
    subtitle: '로그인하면 계정 페이지와 회원 전용 콘텐츠를 볼 수 있습니다.',
    login: '로그인',
    signup: '회원가입',
    email: '이메일',
    name: '이름',
    password: '비밀번호',
    submitLogin: '로그인',
    submitSignup: '회원가입',
    loading: '처리 중...',
  };
}

export default function MemberAuthClient({ locale, nextPath }: MemberAuthClientProps) {
  const [mode, setMode] = useState<AuthMode>('login');
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
      ...(mode === 'signup' ? { name: String(form.get('name') ?? '') } : {}),
    };
    try {
      const response = await fetch(mode === 'signup' ? '/api/members/signup' : '/api/members/login', {
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
    <main className={styles.authPage} data-member-login-page="true">
      <section className={styles.authPanel}>
        <div className={styles.authIntro}>
          <p>Members</p>
          <h1>{t.title}</h1>
          <span>{t.subtitle}</span>
        </div>
        <div className={styles.tabs} role="tablist" aria-label="Member auth mode">
          <button type="button" className={mode === 'login' ? styles.activeTab : ''} onClick={() => setMode('login')}>
            {t.login}
          </button>
          <button type="button" className={mode === 'signup' ? styles.activeTab : ''} onClick={() => setMode('signup')}>
            {t.signup}
          </button>
        </div>
        <form className={styles.authForm} onSubmit={submit}>
          {mode === 'signup' ? (
            <label>
              {t.name}
              <input name="name" autoComplete="name" required disabled={pending} />
            </label>
          ) : null}
          <label>
            {t.email}
            <input name="email" type="email" autoComplete="email" required disabled={pending} />
          </label>
          <label>
            {t.password}
            <input name="password" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} required minLength={8} disabled={pending} />
          </label>
          <button type="submit" disabled={pending}>
            {pending ? t.loading : mode === 'signup' ? t.submitSignup : t.submitLogin}
          </button>
          {message ? <p className={styles.error} role="alert">{message}</p> : null}
        </form>
      </section>
    </main>
  );
}
