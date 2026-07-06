'use client';

import React, { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderMemberAccountSummaryCanvasNode } from '@/lib/builder/canvas/types';
import type { PublicSiteMember } from '@/lib/builder/members/members-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { getMemberAccountSummaryCopy, MEMBER_ACCOUNT_SUMMARY_KO_DEFAULTS } from './member-account-summary-copy';
import { localizedMemberText } from '../member-account-widgets-copy';

type MemberState =
  | { status: 'preview'; member: PublicSiteMember }
  | { status: 'loading'; member: null }
  | { status: 'authenticated'; member: PublicSiteMember }
  | { status: 'guest'; member: null }
  | { status: 'error'; member: null };

function pathOrDefault(value: string, fallback: string): string {
  const trimmed = value.trim();
  return trimmed.startsWith('/') ? trimmed : fallback;
}

function MemberAccountSummaryRender({
  node,
  mode = 'edit',
  locale,
}: {
  node: BuilderMemberAccountSummaryCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const effectiveLocale = normalizeLocale(locale || 'ko');
  const copy = useMemo(() => getMemberAccountSummaryCopy(effectiveLocale), [effectiveLocale]);
  const c = node.content;
  const [state, setState] = useState<MemberState>({
    status: 'preview',
    member: {
      memberId: 'builder-member-preview',
      email: 'member@example.com',
      name: effectiveLocale === 'ko' ? '회원 미리보기' : effectiveLocale === 'zh-hant' ? '會員預覽' : 'Member Preview',
      role: 'premium',
      verified: true,
      blocked: false,
      createdAt: new Date(0).toISOString(),
    },
  });

  useEffect(() => {
    if (mode !== 'published') return;
    let canceled = false;
    setState({ status: 'loading', member: null });
    fetch(`/api/members/me?locale=${effectiveLocale}`, { credentials: 'same-origin' })
      .then(async (response) => {
        if (response.status === 401) return { status: 'guest' as const };
        const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; member?: PublicSiteMember };
        if (response.ok && payload.ok && !payload.member) return { status: 'guest' as const };
        if (!response.ok || !payload.ok || !payload.member) return { status: 'error' as const };
        return { status: 'authenticated' as const, member: payload.member };
      })
      .then((next) => {
        if (canceled) return;
        if (next.status === 'authenticated') {
          setState({ status: 'authenticated', member: next.member });
          return;
        }
        setState({ status: next.status, member: null });
      })
      .catch(() => {
        if (!canceled) setState({ status: 'error', member: null });
      });
    return () => {
      canceled = true;
    };
  }, [effectiveLocale, mode]);

  const profileHref = pathOrDefault(c.profileHref, `/${effectiveLocale}/account/profile`);
  const bookingsHref = pathOrDefault(c.bookingsHref, `/${effectiveLocale}/account/bookings`);
  const premiumHref = pathOrDefault(c.premiumHref, `/${effectiveLocale}/account/premium`);
  const loginHref = pathOrDefault(c.loginHref, `/${effectiveLocale}/login?next=${encodeURIComponent(`/${effectiveLocale}/account`)}`);
  const member = state.member;

  return (
    <section
      data-builder-member-account-summary="true"
      data-builder-member-account-state={state.status}
      style={shellStyle}
    >
      <div style={headerStyle}>
        <span style={eyebrowStyle}>{copy.eyebrow}</span>
        <strong style={titleStyle}>{localizedMemberText(c.title, copy.title, MEMBER_ACCOUNT_SUMMARY_KO_DEFAULTS.title)}</strong>
        <span style={subtitleStyle}>{localizedMemberText(c.subtitle, copy.subtitle, MEMBER_ACCOUNT_SUMMARY_KO_DEFAULTS.subtitle)}</span>
      </div>
      {member ? (
        <div style={memberCardStyle}>
          <span style={avatarStyle}>{member.name.slice(0, 1).toUpperCase()}</span>
          <div style={{ minWidth: 0 }}>
            <strong style={memberNameStyle}>{member.name}</strong>
            <span style={memberEmailStyle}>{member.email}</span>
          </div>
          <span style={roleStyle}>{copy.role}: {copy.roleLabels[member.role] ?? member.role}</span>
        </div>
      ) : (
        <div style={emptyStyle}>
          {state.status === 'loading' ? copy.loading : state.status === 'error' ? copy.error : copy.guest}
        </div>
      )}
      <div style={linksStyle}>
        {member ? (
          <>
            <a href={profileHref} style={linkStyle} data-builder-canvas-page-link="true" data-builder-member-account-link="profile">{localizedMemberText(c.profileLabel, copy.profile, MEMBER_ACCOUNT_SUMMARY_KO_DEFAULTS.profileLabel)}</a>
            {c.showBookings ? <a href={bookingsHref} style={linkStyle} data-builder-canvas-page-link="true" data-builder-member-account-link="bookings">{localizedMemberText(c.bookingsLabel, copy.bookings, MEMBER_ACCOUNT_SUMMARY_KO_DEFAULTS.bookingsLabel)}</a> : null}
            {c.showPremium ? <a href={premiumHref} style={linkStyle} data-builder-canvas-page-link="true" data-builder-member-account-link="premium">{localizedMemberText(c.premiumLabel, copy.premium, MEMBER_ACCOUNT_SUMMARY_KO_DEFAULTS.premiumLabel)}</a> : null}
          </>
        ) : (
          <a href={loginHref} style={primaryLinkStyle} data-builder-canvas-page-link="true" data-builder-member-account-link="login">{localizedMemberText(c.loginLabel, copy.login, MEMBER_ACCOUNT_SUMMARY_KO_DEFAULTS.loginLabel)}</a>
        )}
      </div>
    </section>
  );
}

function MemberAccountSummaryInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const accountNode = node as BuilderMemberAccountSummaryCanvasNode;
  const c = accountNode.content;
  const effectiveLocale = normalizeLocale(locale);
  const copy = getMemberAccountSummaryCopy(effectiveLocale);
  const title = localizedMemberText(c.title, copy.title, MEMBER_ACCOUNT_SUMMARY_KO_DEFAULTS.title);
  const subtitle = localizedMemberText(c.subtitle, copy.subtitle, MEMBER_ACCOUNT_SUMMARY_KO_DEFAULTS.subtitle);
  const profileHrefPlaceholder = `/${effectiveLocale}/account/profile`;
  const bookingsHrefPlaceholder = `/${effectiveLocale}/account/bookings`;
  const premiumHrefPlaceholder = `/${effectiveLocale}/account/premium`;
  const loginHrefPlaceholder = `/${effectiveLocale}/login?next=/${effectiveLocale}/account`;
  return (
    <>
      <label>
        <span>{copy.inspectorTitle}</span>
        <input type="text" value={title} disabled={disabled} onChange={(event) => onUpdate({ title: event.target.value })} />
      </label>
      <label>
        <span>{copy.inspectorDescription}</span>
        <textarea value={subtitle} disabled={disabled} onChange={(event) => onUpdate({ subtitle: event.target.value })} />
      </label>
      <label>
        <span>{copy.inspectorProfileLink}</span>
        <input type="text" value={c.profileHref} placeholder={profileHrefPlaceholder} disabled={disabled} onChange={(event) => onUpdate({ profileHref: event.target.value })} />
      </label>
      <label>
        <span>{copy.inspectorShowBookings}</span>
        <input type="checkbox" checked={c.showBookings} disabled={disabled} onChange={(event) => onUpdate({ showBookings: event.target.checked })} />
      </label>
      <label>
        <span>{copy.inspectorBookingsLink}</span>
        <input type="text" value={c.bookingsHref} placeholder={bookingsHrefPlaceholder} disabled={disabled} onChange={(event) => onUpdate({ bookingsHref: event.target.value })} />
      </label>
      <label>
        <span>{copy.inspectorShowPremium}</span>
        <input type="checkbox" checked={c.showPremium} disabled={disabled} onChange={(event) => onUpdate({ showPremium: event.target.checked })} />
      </label>
      <label>
        <span>{copy.inspectorPremiumLink}</span>
        <input type="text" value={c.premiumHref} placeholder={premiumHrefPlaceholder} disabled={disabled} onChange={(event) => onUpdate({ premiumHref: event.target.value })} />
      </label>
      <label>
        <span>{copy.inspectorLoginLink}</span>
        <input type="text" value={c.loginHref} placeholder={loginHrefPlaceholder} disabled={disabled} onChange={(event) => onUpdate({ loginHref: event.target.value })} />
      </label>
    </>
  );
}

const shellStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  display: 'grid',
  gap: 16,
  padding: 26,
  background: '#ffffff',
  border: '1px solid #dbeafe',
  borderRadius: 24,
  boxShadow: '0 18px 42px rgba(15, 23, 42, 0.12)',
  color: '#0f172a',
  overflow: 'hidden',
};

const headerStyle: CSSProperties = { display: 'grid', gap: 6 };
const eyebrowStyle: CSSProperties = { color: '#116dff', fontSize: 12, fontWeight: 850, letterSpacing: 1.2, textTransform: 'uppercase' };
const titleStyle: CSSProperties = { fontSize: 24, lineHeight: 1.15 };
const subtitleStyle: CSSProperties = { color: '#64748b', fontSize: 14, lineHeight: 1.45 };

const memberCardStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '48px 1fr',
  gap: 12,
  alignItems: 'center',
  padding: 14,
  border: '1px solid #e2e8f0',
  borderRadius: 18,
  background: '#f8fafc',
};

const avatarStyle: CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: '50%',
  display: 'grid',
  placeItems: 'center',
  background: '#116dff',
  color: '#ffffff',
  fontSize: 18,
  fontWeight: 900,
};

const memberNameStyle: CSSProperties = {
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const memberEmailStyle: CSSProperties = {
  display: 'block',
  color: '#64748b',
  fontSize: 13,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const roleStyle: CSSProperties = {
  gridColumn: '1 / -1',
  justifySelf: 'start',
  padding: '5px 9px',
  borderRadius: 999,
  background: '#e0f2fe',
  color: '#075985',
  fontSize: 12,
  fontWeight: 850,
};

const emptyStyle: CSSProperties = {
  padding: 16,
  border: '1px dashed #cbd5e1',
  borderRadius: 16,
  color: '#64748b',
  background: '#f8fafc',
  fontSize: 14,
  fontWeight: 750,
};

const linksStyle: CSSProperties = { display: 'grid', gap: 10 };

const linkStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '11px 12px',
  border: '1px solid #dbeafe',
  borderRadius: 14,
  color: '#0f172a',
  background: '#ffffff',
  fontSize: 14,
  fontWeight: 850,
  textDecoration: 'none',
};

const primaryLinkStyle: CSSProperties = {
  ...linkStyle,
  justifyContent: 'center',
  color: '#ffffff',
  background: '#116dff',
  borderColor: '#116dff',
};

export default defineComponent({
  kind: 'member-account-summary',
  displayName: '회원 계정 요약',
  category: 'domain',
  icon: 'A',
  defaultContent: {
    title: MEMBER_ACCOUNT_SUMMARY_KO_DEFAULTS.title,
    subtitle: MEMBER_ACCOUNT_SUMMARY_KO_DEFAULTS.subtitle,
    profileLabel: MEMBER_ACCOUNT_SUMMARY_KO_DEFAULTS.profileLabel,
    bookingsLabel: MEMBER_ACCOUNT_SUMMARY_KO_DEFAULTS.bookingsLabel,
    premiumLabel: MEMBER_ACCOUNT_SUMMARY_KO_DEFAULTS.premiumLabel,
    loginLabel: MEMBER_ACCOUNT_SUMMARY_KO_DEFAULTS.loginLabel,
    profileHref: '',
    bookingsHref: '',
    premiumHref: '',
    loginHref: '',
    showBookings: true,
    showPremium: true,
  },
  defaultStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 24,
  },
  defaultRect: { width: 430, height: 390 },
  Render: MemberAccountSummaryRender,
  Inspector: MemberAccountSummaryInspector,
});
