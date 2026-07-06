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

function sortMembers(members: PublicSiteMember[]): PublicSiteMember[] {
  return [...members].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export default function MembersAdminClient({ locale, initialMembers }: MembersAdminClientProps) {
  const copy = getMembersAdminCopy(locale);
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
      const response = await fetch(`/api/builder/members?locale=${locale}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: String(form.get('email') ?? ''),
          name: String(form.get('name') ?? ''),
          password: String(form.get('password') ?? ''),
          role: String(form.get('role') ?? 'free'),
          verified: form.get('verified') === 'on',
          locale,
        }),
      });
      const json = await response.json() as { ok?: boolean; member?: PublicSiteMember; error?: string };
      if (!response.ok || !json.ok || !json.member) throw new Error(json.error || copy.createFailedLabel);
      setMembers((current) => sortMembers([json.member as PublicSiteMember, ...current.filter((item) => item.memberId !== json.member?.memberId)]));
      setMessage(copy.createdLabel);
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.createFailedLabel);
    } finally {
      setPending(false);
    }
  }

  async function patchMember(memberId: string, patch: Partial<Pick<PublicSiteMember, 'name' | 'phone' | 'role' | 'verified' | 'blocked'>>) {
    setMessage('');
    setError('');
    try {
      const response = await fetch(`/api/builder/members/${encodeURIComponent(memberId)}?locale=${locale}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...patch, locale }),
      });
      const json = await response.json() as { ok?: boolean; member?: PublicSiteMember; error?: string };
      if (!response.ok || !json.ok || !json.member) throw new Error(json.error || copy.saveFailedLabel);
      setMembers((current) => current.map((member) => member.memberId === memberId ? json.member as PublicSiteMember : member));
      setMessage(copy.saveLabel);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.saveFailedLabel);
    }
  }

  async function deleteMember(memberId: string) {
    setMessage('');
    setError('');
    try {
      const response = await fetch(`/api/builder/members/${encodeURIComponent(memberId)}?locale=${locale}`, {
        method: 'DELETE',
      });
      const json = await response.json().catch(() => ({})) as { ok?: boolean; error?: string };
      if (!response.ok || !json.ok) throw new Error(json.error || copy.deleteFailedLabel);
      setMembers((current) => current.filter((member) => member.memberId !== memberId));
      setMessage(copy.deletedLabel);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.deleteFailedLabel);
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
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </div>
        <a className={styles.publicLink} href={`/${locale}/account`} target="_blank" rel="noreferrer">
          {copy.publicAccountLinkLabel}
        </a>
      </header>

      <section className={styles.stats} aria-label={copy.summaryLabel}>
        <div><strong>{members.length}</strong><span>{copy.allLabel}</span></div>
        <div><strong>{freeCount}</strong><span>{copy.freeLabel}</span></div>
        <div><strong>{premiumCount}</strong><span>{copy.premiumLabel}</span></div>
        <div><strong>{blockedCount}</strong><span>{copy.blockedLabel}</span></div>
      </section>

      <section className={styles.layout}>
        <form className={styles.form} onSubmit={createMember} data-builder-members-create-form="true">
          <h2>{copy.createTitle}</h2>
          <label>
            {copy.nameLabel}
            <input name="name" required placeholder={copy.namePlaceholder} />
          </label>
          <label>
            {copy.emailLabel}
            <input name="email" type="email" required placeholder={copy.emailPlaceholder} />
          </label>
          <label>
            {copy.passwordLabel}
            <input name="password" type="password" required minLength={8} placeholder={copy.passwordPlaceholder} />
          </label>
          <div className={styles.twoCols}>
            <label>
              {copy.roleLabel}
              <select name="role" defaultValue="free">
                <option value="free">{copy.freeLabel}</option>
                <option value="premium">{copy.premiumLabel}</option>
                <option value="admin">{copy.adminLabel}</option>
              </select>
            </label>
            <label className={styles.checkbox}>
              <input name="verified" type="checkbox" defaultChecked />
              {copy.verifiedLabel}
            </label>
          </div>
          <button type="submit" disabled={pending}>{pending ? copy.savingLabel : copy.createButtonLabel}</button>
          {message ? <p className={styles.message} role="status">{message}</p> : null}
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
        </form>

        <section className={styles.list} aria-label={copy.listLabel}>
          <div className={styles.listHeader}>
            <h2>{copy.membersTitle}</h2>
            <select value={roleFilter} onChange={(event) => setRoleFilter(event.currentTarget.value as RoleFilter)} aria-label={copy.roleFilterLabel}>
              <option value="all">{copy.allLabel}</option>
              <option value="free">{copy.freeLabel}</option>
              <option value="premium">{copy.premiumLabel}</option>
              <option value="admin">{copy.adminLabel}</option>
            </select>
          </div>

          {filteredMembers.length === 0 ? (
            <div className={styles.empty}>{copy.emptyLabel}</div>
          ) : (
            <div className={styles.cards}>
              {filteredMembers.map((member) => (
                <article key={member.memberId} className={styles.card} data-builder-member-admin-card={member.memberId}>
                  <div className={styles.cardTop}>
                    <div>
                      <span className={`${styles.badge} ${member.blocked ? styles.badgeBlocked : ''}`}>
                        {member.blocked ? copy.blockedLabel : copy.roleLabels[member.role]}
                      </span>
                      <h3>{member.name}</h3>
                      <p>{member.email}</p>
                      <p>{copy.joinedLabel} {member.createdAt.slice(0, 10)}{member.lastLoginAt ? ` · ${copy.lastLoginLabel} ${member.lastLoginAt.slice(0, 10)}` : ''}</p>
                    </div>
                    <div className={styles.actions}>
                      <a href={`/${locale}/account`} target="_blank" rel="noreferrer">{copy.accountPageLabel}</a>
                      <button
                        type="button"
                        className={styles.dangerButton}
                        onClick={() => {
                          void deleteMember(member.memberId);
                        }}
                      >
                        {copy.deleteLabel}
                      </button>
                    </div>
                  </div>

                  <div className={styles.twoCols}>
                    <label>
                      {copy.nameLabel}
                      <input
                        value={member.name}
                        onChange={(event) => updateDraft(member.memberId, { name: event.currentTarget.value })}
                      />
                    </label>
                    <label>
                      {copy.phoneLabel}
                      <input
                        value={member.phone ?? ''}
                        onChange={(event) => updateDraft(member.memberId, { phone: event.currentTarget.value })}
                      />
                    </label>
                  </div>

                  <div className={styles.twoCols}>
                    <label>
                      {copy.roleLabel}
                      <select
                        value={member.role}
                        onChange={(event) => updateDraft(member.memberId, { role: event.currentTarget.value as MemberRole })}
                      >
                        <option value="free">{copy.freeLabel}</option>
                        <option value="premium">{copy.premiumLabel}</option>
                        <option value="admin">{copy.adminLabel}</option>
                      </select>
                    </label>
                    <label className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={member.verified}
                        onChange={(event) => updateDraft(member.memberId, { verified: event.currentTarget.checked })}
                      />
                      {copy.verifiedLabel}
                    </label>
                  </div>

                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={member.blocked}
                      onChange={(event) => updateDraft(member.memberId, { blocked: event.currentTarget.checked })}
                    />
                    {copy.blockLoginLabel}
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
                      {copy.saveLabel}
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

function getMembersAdminCopy(locale: Locale) {
  return {
    title: locale === 'ko' ? '회원 관리' : locale === 'zh-hant' ? '會員管理' : 'Members admin',
    description:
      locale === 'ko'
        ? '회원 가입, 프로필, 차단 상태와 무료/프리미엄/관리자 권한을 관리합니다.'
        : locale === 'zh-hant'
          ? '管理會員註冊、個人資料、封鎖狀態與免費/付費/管理員權限。'
          : 'Manage signups, profiles, blocked status, and free/premium/admin roles.',
    publicAccountLinkLabel:
      locale === 'ko' ? '공개 계정 페이지 보기' : locale === 'zh-hant' ? '查看公開帳戶頁' : 'View public account page',
    summaryLabel: locale === 'ko' ? '회원 요약' : locale === 'zh-hant' ? '會員摘要' : 'Member summary',
    listLabel: locale === 'ko' ? '회원 목록' : locale === 'zh-hant' ? '會員清單' : 'Member list',
    createTitle: locale === 'ko' ? '새 회원' : locale === 'zh-hant' ? '新增會員' : 'New member',
    membersTitle: locale === 'ko' ? '회원' : locale === 'zh-hant' ? '會員' : 'Members',
    nameLabel: locale === 'ko' ? '이름' : locale === 'zh-hant' ? '姓名' : 'Name',
    emailLabel: locale === 'ko' ? '이메일' : locale === 'zh-hant' ? '電子郵件' : 'Email',
    passwordLabel: locale === 'ko' ? '임시 비밀번호' : locale === 'zh-hant' ? '臨時密碼' : 'Temporary password',
    roleLabel: locale === 'ko' ? '역할' : locale === 'zh-hant' ? '角色' : 'Role',
    verifiedLabel: locale === 'ko' ? '인증됨' : locale === 'zh-hant' ? '已驗證' : 'Verified',
    savingLabel: locale === 'ko' ? '저장 중...' : locale === 'zh-hant' ? '儲存中...' : 'Saving...',
    createButtonLabel: locale === 'ko' ? '회원 생성' : locale === 'zh-hant' ? '建立會員' : 'Create member',
    roleFilterLabel: locale === 'ko' ? '역할 필터' : locale === 'zh-hant' ? '角色篩選' : 'Role filter',
    allLabel: locale === 'ko' ? '전체' : locale === 'zh-hant' ? '全部' : 'All',
    freeLabel: locale === 'ko' ? '무료' : locale === 'zh-hant' ? '免費' : 'Free',
    premiumLabel: locale === 'ko' ? '프리미엄' : locale === 'zh-hant' ? '付費' : 'Premium',
    adminLabel: locale === 'ko' ? '관리자' : locale === 'zh-hant' ? '管理員' : 'Admin',
    roleLabels: {
      free: locale === 'ko' ? '무료' : locale === 'zh-hant' ? '免費' : 'Free',
      premium: locale === 'ko' ? '프리미엄' : locale === 'zh-hant' ? '付費' : 'Premium',
      admin: locale === 'ko' ? '관리자' : locale === 'zh-hant' ? '管理員' : 'Admin',
    } as const,
    blockedLabel: locale === 'ko' ? '차단' : locale === 'zh-hant' ? '已封鎖' : 'Blocked',
    emptyLabel: locale === 'ko' ? '회원이 없습니다.' : locale === 'zh-hant' ? '沒有會員。' : 'No members.',
    joinedLabel: locale === 'ko' ? '가입' : locale === 'zh-hant' ? '加入' : 'Joined',
    lastLoginLabel: locale === 'ko' ? '최근 로그인' : locale === 'zh-hant' ? '最近登入' : 'Last login',
    accountPageLabel: locale === 'ko' ? '계정 페이지' : locale === 'zh-hant' ? '帳戶頁' : 'Account page',
    phoneLabel: locale === 'ko' ? '전화' : locale === 'zh-hant' ? '電話' : 'Phone',
    blockLoginLabel: locale === 'ko' ? '로그인 차단' : locale === 'zh-hant' ? '封鎖登入' : 'Block login',
    saveLabel: locale === 'ko' ? '저장' : locale === 'zh-hant' ? '儲存' : 'Save',
    createdLabel: locale === 'ko' ? '회원이 생성되었습니다.' : locale === 'zh-hant' ? '會員已建立。' : 'Member created.',
    saveFailedLabel: locale === 'ko' ? '회원 저장 실패' : locale === 'zh-hant' ? '會員儲存失敗' : 'Member save failed',
    createFailedLabel: locale === 'ko' ? '회원 생성 실패' : locale === 'zh-hant' ? '會員建立失敗' : 'Member create failed',
    deleteFailedLabel: locale === 'ko' ? '회원 삭제 실패' : locale === 'zh-hant' ? '會員刪除失敗' : 'Member delete failed',
    deletedLabel: locale === 'ko' ? '회원이 차단/삭제 처리되었습니다.' : locale === 'zh-hant' ? '會員已封鎖/刪除處理。' : 'Member blocked/deleted.',
    deleteLabel: locale === 'ko' ? '삭제' : locale === 'zh-hant' ? '刪除' : 'Delete',
    namePlaceholder: locale === 'ko' ? '홍길동' : locale === 'zh-hant' ? '王大明' : 'Jane Doe',
    emailPlaceholder: locale === 'ko' ? 'member@example.com' : locale === 'zh-hant' ? 'member@example.com' : 'member@example.com',
    passwordPlaceholder: locale === 'ko' ? '8자 이상' : locale === 'zh-hant' ? '至少 8 字元' : '8+ characters',
  } as const;
}
