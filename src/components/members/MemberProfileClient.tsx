'use client';

import { FormEvent, useState } from 'react';
import type { PublicSiteMember } from '@/lib/builder/members/members-engine';
import type { Locale } from '@/lib/locales';
import styles from './MembersArea.module.css';

interface MemberProfileClientProps {
  member: PublicSiteMember;
  locale: Locale;
}

export default function MemberProfileClient({ member, locale }: MemberProfileClientProps) {
  const [current, setCurrent] = useState(member);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const savedLabel = locale === 'ko' ? '저장되었습니다.' : locale === 'zh-hant' ? '已儲存。' : 'Saved.';
  const savingLabel = locale === 'ko' ? '저장 중...' : locale === 'zh-hant' ? '儲存中...' : 'Saving...';
  const saveLabel = locale === 'ko' ? '프로필 저장' : locale === 'zh-hant' ? '儲存個人資料' : 'Save profile';

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/members/me', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: String(form.get('name') ?? ''),
          phone: String(form.get('phone') ?? ''),
        }),
      });
      const json = await response.json();
      if (!response.ok || !json?.ok) throw new Error(json?.error || 'save_failed');
      setCurrent(json.member as PublicSiteMember);
      setMessage(savedLabel);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'save_failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <form className={styles.profileForm} onSubmit={submit} data-member-profile-form="true">
      <div className={styles.memberBadge}>
        <span>{current.role}</span>
        <strong>{current.email}</strong>
      </div>
      <label>
        {locale === 'ko' ? '이름' : locale === 'zh-hant' ? '姓名' : 'Name'}
        <input name="name" defaultValue={current.name} required disabled={pending} />
      </label>
      <label>
        {locale === 'ko' ? '전화번호' : locale === 'zh-hant' ? '電話' : 'Phone'}
        <input name="phone" defaultValue={current.phone ?? ''} disabled={pending} />
      </label>
      <button type="submit" disabled={pending}>{pending ? savingLabel : saveLabel}</button>
      {message ? <p className={styles.message} role="status">{message}</p> : null}
    </form>
  );
}
