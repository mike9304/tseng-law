'use client';

import { FormEvent, useMemo, useState } from 'react';
import type { MemberRole, PublicSiteMember } from '@/lib/builder/members/members-engine';
import type { Locale } from '@/lib/locales';
import styles from './MembersAdmin.module.css';

interface MembersAdminClientProps {
  locale: Locale;
  initialMembers: PublicSiteMember[];
}

type RoleFilter = MemberRole | 'all';

const ROLE_LABELS: Record<MemberRole, string> = {
  free: '무료',
  premium: '프리미엄',
  admin: '관리자',
};

function sortMembers(members: PublicSiteMember[]): PublicSiteMember[] {
  return [...members].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export default function MembersAdminClient({ locale, initialMembers }: MembersAdminClientProps) {
  const [members, setMembers] = useState(sortMembers(initialMembers));
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const filteredMembers = useMemo(() => (
    roleFilter === 'all' ? members : members.filter((member) => member.role === roleFilter)
  ), [members, roleFilter]);

  async function createMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage('');
    setError('');
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/builder/members', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: String(form.get('email') ?? ''),
          name: String(form.get('name') ?? ''),
          password: String(form.get('password') ?? ''),
          role: String(form.get('role') ?? 'free'),
          verified: form.get('verified') === 'on',
        }),
      });
      const json = await response.json() as { ok?: boolean; member?: PublicSiteMember; error?: string };
      if (!response.ok || !json.ok || !json.member) throw new Error(json.error || '회원 생성 실패');
      setMembers((current) => sortMembers([json.member as PublicSiteMember, ...current.filter((item) => item.memberId !== json.member?.memberId)]));
      setMessage('회원이 생성되었습니다.');
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원 생성 실패');
    } finally {
      setPending(false);
    }
  }

  async function patchMember(memberId: string, patch: Partial<Pick<PublicSiteMember, 'name' | 'phone' | 'role' | 'verified' | 'blocked'>>) {
    setMessage('');
    setError('');
    try {
      const response = await fetch(`/api/builder/members/${encodeURIComponent(memberId)}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const json = await response.json() as { ok?: boolean; member?: PublicSiteMember; error?: string };
      if (!response.ok || !json.ok || !json.member) throw new Error(json.error || '회원 저장 실패');
      setMembers((current) => current.map((member) => member.memberId === memberId ? json.member as PublicSiteMember : member));
      setMessage('회원 정보가 저장되었습니다.');
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원 저장 실패');
    }
  }

  async function deleteMember(memberId: string) {
    setMessage('');
    setError('');
    try {
      const response = await fetch(`/api/builder/members/${encodeURIComponent(memberId)}`, {
        method: 'DELETE',
      });
      const json = await response.json().catch(() => ({})) as { ok?: boolean; error?: string };
      if (!response.ok || !json.ok) throw new Error(json.error || '회원 삭제 실패');
      setMembers((current) => current.filter((member) => member.memberId !== memberId));
      setMessage('회원이 차단/삭제 처리되었습니다.');
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원 삭제 실패');
    }
  }

  function updateDraft(memberId: string, patch: Partial<PublicSiteMember>) {
    setMembers((current) => current.map((member) => member.memberId === memberId ? { ...member, ...patch } : member));
  }

  const freeCount = members.filter((member) => member.role === 'free').length;
  const premiumCount = members.filter((member) => member.role === 'premium').length;
  const blockedCount = members.filter((member) => member.blocked).length;

  return (
    <main className={styles.root} data-builder-members-admin="true">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Native Members</p>
          <h1>회원 관리</h1>
          <p>회원 가입, 프로필, 차단 상태와 무료/프리미엄/관리자 권한을 관리합니다.</p>
        </div>
        <a className={styles.publicLink} href={`/${locale}/account`} target="_blank" rel="noreferrer">
          공개 계정 페이지 보기
        </a>
      </header>

      <section className={styles.stats} aria-label="회원 요약">
        <div><strong>{members.length}</strong><span>전체</span></div>
        <div><strong>{freeCount}</strong><span>무료</span></div>
        <div><strong>{premiumCount}</strong><span>프리미엄</span></div>
        <div><strong>{blockedCount}</strong><span>차단</span></div>
      </section>

      <section className={styles.layout}>
        <form className={styles.form} onSubmit={createMember} data-builder-members-create-form="true">
          <h2>새 회원</h2>
          <label>
            이름
            <input name="name" required placeholder="홍길동" />
          </label>
          <label>
            이메일
            <input name="email" type="email" required placeholder="member@example.com" />
          </label>
          <label>
            임시 비밀번호
            <input name="password" type="password" required minLength={8} placeholder="8자 이상" />
          </label>
          <div className={styles.twoCols}>
            <label>
              역할
              <select name="role" defaultValue="free">
                <option value="free">무료</option>
                <option value="premium">프리미엄</option>
                <option value="admin">관리자</option>
              </select>
            </label>
            <label className={styles.checkbox}>
              <input name="verified" type="checkbox" defaultChecked />
              인증됨
            </label>
          </div>
          <button type="submit" disabled={pending}>{pending ? '저장 중...' : '회원 생성'}</button>
          {message ? <p className={styles.message} role="status">{message}</p> : null}
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
        </form>

        <section className={styles.list} aria-label="회원 목록">
          <div className={styles.listHeader}>
            <h2>회원</h2>
            <select value={roleFilter} onChange={(event) => setRoleFilter(event.currentTarget.value as RoleFilter)} aria-label="역할 필터">
              <option value="all">전체</option>
              <option value="free">무료</option>
              <option value="premium">프리미엄</option>
              <option value="admin">관리자</option>
            </select>
          </div>

          {filteredMembers.length === 0 ? (
            <div className={styles.empty}>회원이 없습니다.</div>
          ) : (
            <div className={styles.cards}>
              {filteredMembers.map((member) => (
                <article key={member.memberId} className={styles.card} data-builder-member-admin-card={member.memberId}>
                  <div className={styles.cardTop}>
                    <div>
                      <span className={`${styles.badge} ${member.blocked ? styles.badgeBlocked : ''}`}>
                        {member.blocked ? '차단' : ROLE_LABELS[member.role]}
                      </span>
                      <h3>{member.name}</h3>
                      <p>{member.email}</p>
                      <p>가입 {member.createdAt.slice(0, 10)}{member.lastLoginAt ? ` · 최근 로그인 ${member.lastLoginAt.slice(0, 10)}` : ''}</p>
                    </div>
                    <div className={styles.actions}>
                      <a href={`/${locale}/account`} target="_blank" rel="noreferrer">계정 페이지</a>
                      <button
                        type="button"
                        className={styles.dangerButton}
                        onClick={() => {
                          void deleteMember(member.memberId);
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </div>

                  <div className={styles.twoCols}>
                    <label>
                      이름
                      <input
                        value={member.name}
                        onChange={(event) => updateDraft(member.memberId, { name: event.currentTarget.value })}
                      />
                    </label>
                    <label>
                      전화
                      <input
                        value={member.phone ?? ''}
                        onChange={(event) => updateDraft(member.memberId, { phone: event.currentTarget.value })}
                      />
                    </label>
                  </div>

                  <div className={styles.twoCols}>
                    <label>
                      역할
                      <select
                        value={member.role}
                        onChange={(event) => updateDraft(member.memberId, { role: event.currentTarget.value as MemberRole })}
                      >
                        <option value="free">무료</option>
                        <option value="premium">프리미엄</option>
                        <option value="admin">관리자</option>
                      </select>
                    </label>
                    <label className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={member.verified}
                        onChange={(event) => updateDraft(member.memberId, { verified: event.currentTarget.checked })}
                      />
                      인증됨
                    </label>
                  </div>

                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={member.blocked}
                      onChange={(event) => updateDraft(member.memberId, { blocked: event.currentTarget.checked })}
                    />
                    로그인 차단
                  </label>

                  <div className={styles.actions}>
                    <button
                      type="button"
                      onClick={() => {
                        void patchMember(member.memberId, {
                          name: member.name,
                          phone: member.phone ?? '',
                          role: member.role,
                          verified: member.verified,
                          blocked: member.blocked,
                        });
                      }}
                    >
                      저장
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
