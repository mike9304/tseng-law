'use client';

import { FormEvent, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderMemberProfileFormCanvasNode } from '@/lib/builder/canvas/types';
import type { PublicSiteMember } from '@/lib/builder/members/members-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  getMemberAccountWidgetsCopy,
  localizedMemberText,
  MEMBER_PROFILE_FORM_KO_DEFAULTS,
} from '../member-account-widgets-copy';

type ProfileState =
  | { status: 'preview'; member: PublicSiteMember }
  | { status: 'loading'; member: null }
  | { status: 'authenticated'; member: PublicSiteMember }
  | { status: 'guest'; member: null }
  | { status: 'error'; member: null };

function pathOrDefault(value: string, fallback: string): string {
  const trimmed = value.trim();
  return trimmed.startsWith('/') ? trimmed : fallback;
}

function MemberProfileFormRender({
  node,
  mode = 'edit',
  locale,
}: {
  node: BuilderMemberProfileFormCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const effectiveLocale = normalizeLocale(locale || 'ko');
  const copy = useMemo(() => getMemberAccountWidgetsCopy(effectiveLocale).profileForm, [effectiveLocale]);
  const c = node.content;
  const previewMember = useMemo<PublicSiteMember>(() => ({
    memberId: 'builder-profile-preview',
    email: 'member@example.com',
    name: copy.previewName,
    phone: copy.previewPhone,
    role: 'free',
    verified: true,
    blocked: false,
    createdAt: new Date(0).toISOString(),
  }), [copy.previewName, copy.previewPhone]);
  const [state, setState] = useState<ProfileState>({ status: 'preview', member: previewMember });
  const [form, setForm] = useState({ name: previewMember.name, phone: previewMember.phone ?? '' });
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const isPublished = mode === 'published';

  useEffect(() => {
    if (isPublished) return;
    setState({ status: 'preview', member: previewMember });
    setForm({ name: previewMember.name, phone: previewMember.phone ?? '' });
    setMessage('');
    setPending(false);
  }, [isPublished, previewMember]);

  useEffect(() => {
    if (!isPublished) return;
    let canceled = false;
    setState({ status: 'loading', member: null });
    setMessage('');
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
          setForm({ name: next.member.name, phone: next.member.phone ?? '' });
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
  }, [effectiveLocale, isPublished]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isPublished || pending || !state.member) return;
    setPending(true);
    setMessage('');
    try {
      const response = await fetch(`/api/members/me?locale=${effectiveLocale}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          locale: effectiveLocale,
          name: form.name,
          phone: form.phone,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string; member?: PublicSiteMember };
      if (!response.ok || !payload.ok || !payload.member) throw new Error(payload.error || copy.error);
      setState({ status: 'authenticated', member: payload.member });
      setForm({ name: payload.member.name, phone: payload.member.phone ?? '' });
      setMessage(localizedMemberText(c.savedLabel, copy.saved, MEMBER_PROFILE_FORM_KO_DEFAULTS.savedLabel));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.error);
    } finally {
      setPending(false);
    }
  }

  const member = state.member;
  const canEdit = isPublished && Boolean(member) && !pending;
  const loginHref = pathOrDefault(c.loginHref, `/${effectiveLocale}/login?next=/${effectiveLocale}/account`);

  return (
    <section
      data-builder-member-profile-form="true"
      data-builder-member-profile-state={state.status}
      style={panelStyle}
    >
      <div style={introStyle}>
        <span style={eyebrowStyle}>{copy.eyebrow}</span>
        <strong style={titleStyle}>{localizedMemberText(c.title, copy.title, MEMBER_PROFILE_FORM_KO_DEFAULTS.title)}</strong>
        <span style={subtitleStyle}>{localizedMemberText(c.subtitle, copy.subtitle, MEMBER_PROFILE_FORM_KO_DEFAULTS.subtitle)}</span>
      </div>
      {member ? (
        <form onSubmit={submit} style={formStyle}>
          <div style={identityStyle}>
            <span style={avatarStyle}>{member.name.slice(0, 1).toUpperCase()}</span>
            <div style={{ minWidth: 0 }}>
              <strong style={memberNameStyle}>{member.name}</strong>
              <span style={memberEmailStyle}>{member.email}</span>
            </div>
          </div>
          <div style={fieldGridStyle}>
            <label style={fieldStyle}>
              <span>{localizedMemberText(c.nameLabel, copy.name, MEMBER_PROFILE_FORM_KO_DEFAULTS.nameLabel)}</span>
              <input
                name="name"
                value={form.name}
                required
                disabled={!canEdit}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                style={inputStyle}
              />
            </label>
            <label style={fieldStyle}>
              <span>{localizedMemberText(c.phoneLabel, copy.phone, MEMBER_PROFILE_FORM_KO_DEFAULTS.phoneLabel)}</span>
              <input
                name="phone"
                value={form.phone}
                disabled={!canEdit}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                style={inputStyle}
              />
            </label>
          </div>
          <button type="submit" disabled={!canEdit} style={submitStyle(!canEdit)}>
            {pending
              ? localizedMemberText(c.savingLabel, copy.saving, MEMBER_PROFILE_FORM_KO_DEFAULTS.savingLabel)
              : localizedMemberText(c.saveLabel, copy.save, MEMBER_PROFILE_FORM_KO_DEFAULTS.saveLabel)}
          </button>
          {message ? <p role="status" style={messageStyle}>{message}</p> : null}
        </form>
      ) : (
        <div style={emptyStyle}>
          {state.status === 'loading' ? copy.loading : state.status === 'error' ? copy.error : copy.guest}
          {state.status === 'guest' ? (
            <a href={loginHref} style={loginStyle} data-builder-canvas-page-link="true" data-builder-member-profile-link="login">
              {localizedMemberText(c.loginLabel, copy.login, MEMBER_PROFILE_FORM_KO_DEFAULTS.loginLabel)}
            </a>
          ) : null}
        </div>
      )}
    </section>
  );
}

function MemberProfileFormInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const profileNode = node as BuilderMemberProfileFormCanvasNode;
  const c = profileNode.content;
  const effectiveLocale = normalizeLocale(locale);
  const copy = getMemberAccountWidgetsCopy(effectiveLocale).profileForm;
  const title = localizedMemberText(c.title, copy.title, MEMBER_PROFILE_FORM_KO_DEFAULTS.title);
  const subtitle = localizedMemberText(c.subtitle, copy.subtitle, MEMBER_PROFILE_FORM_KO_DEFAULTS.subtitle);
  const nameLabel = localizedMemberText(c.nameLabel, copy.name, MEMBER_PROFILE_FORM_KO_DEFAULTS.nameLabel);
  const phoneLabel = localizedMemberText(c.phoneLabel, copy.phone, MEMBER_PROFILE_FORM_KO_DEFAULTS.phoneLabel);
  const saveLabel = localizedMemberText(c.saveLabel, copy.save, MEMBER_PROFILE_FORM_KO_DEFAULTS.saveLabel);
  const savingLabel = localizedMemberText(c.savingLabel, copy.saving, MEMBER_PROFILE_FORM_KO_DEFAULTS.savingLabel);
  const savedLabel = localizedMemberText(c.savedLabel, copy.saved, MEMBER_PROFILE_FORM_KO_DEFAULTS.savedLabel);
  const loginHrefPlaceholder = `/${effectiveLocale}/login?next=/${effectiveLocale}/account`;
  return (
    <>
      <label>
        <span>{copy.inspector.title}</span>
        <input type="text" value={title} disabled={disabled} onChange={(event) => onUpdate({ title: event.target.value })} />
      </label>
      <label>
        <span>{copy.inspector.subtitle}</span>
        <textarea value={subtitle} disabled={disabled} onChange={(event) => onUpdate({ subtitle: event.target.value })} />
      </label>
      <label>
        <span>{copy.inspector.nameLabel}</span>
        <input type="text" value={nameLabel} disabled={disabled} onChange={(event) => onUpdate({ nameLabel: event.target.value })} />
      </label>
      <label>
        <span>{copy.inspector.phoneLabel}</span>
        <input type="text" value={phoneLabel} disabled={disabled} onChange={(event) => onUpdate({ phoneLabel: event.target.value })} />
      </label>
      <label>
        <span>{copy.inspector.saveLabel}</span>
        <input type="text" value={saveLabel} disabled={disabled} onChange={(event) => onUpdate({ saveLabel: event.target.value })} />
      </label>
      <label>
        <span>{copy.inspector.savingLabel}</span>
        <input type="text" value={savingLabel} disabled={disabled} onChange={(event) => onUpdate({ savingLabel: event.target.value })} />
      </label>
      <label>
        <span>{copy.inspector.savedLabel}</span>
        <input type="text" value={savedLabel} disabled={disabled} onChange={(event) => onUpdate({ savedLabel: event.target.value })} />
      </label>
      <label>
        <span>{copy.inspector.loginLink}</span>
        <input type="text" value={c.loginHref} placeholder={loginHrefPlaceholder} disabled={disabled} onChange={(event) => onUpdate({ loginHref: event.target.value })} />
      </label>
    </>
  );
}

const panelStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  display: 'grid',
  gap: 14,
  padding: 24,
  background: '#ffffff',
  border: '1px solid #dbeafe',
  borderRadius: 24,
  boxShadow: '0 18px 42px rgba(15, 23, 42, 0.12)',
  color: '#0f172a',
  overflow: 'hidden',
};

const introStyle: CSSProperties = { display: 'grid', gap: 5 };
const eyebrowStyle: CSSProperties = { color: '#116dff', fontSize: 12, fontWeight: 850, letterSpacing: 1.2, textTransform: 'uppercase' };
const titleStyle: CSSProperties = { fontSize: 23, lineHeight: 1.12 };
const subtitleStyle: CSSProperties = { color: '#64748b', fontSize: 14, lineHeight: 1.4 };
const formStyle: CSSProperties = { display: 'grid', gap: 12 };

const identityStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '44px 1fr',
  gap: 12,
  alignItems: 'center',
  padding: 12,
  border: '1px solid #e2e8f0',
  borderRadius: 16,
  background: '#f8fafc',
};

const avatarStyle: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  display: 'grid',
  placeItems: 'center',
  background: '#0f172a',
  color: '#ffffff',
  fontSize: 17,
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

const fieldGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 10,
};

const fieldStyle: CSSProperties = {
  display: 'grid',
  gap: 6,
  color: '#334155',
  fontSize: 13,
  fontWeight: 800,
};

const inputStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  border: '1px solid #cbd5e1',
  borderRadius: 12,
  padding: '10px 11px',
  fontSize: 14,
  color: '#0f172a',
  background: '#ffffff',
};

function submitStyle(disabled: boolean): CSSProperties {
  return {
    border: 0,
    borderRadius: 14,
    background: disabled ? '#94a3b8' : '#116dff',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 850,
    padding: '12px 14px',
    cursor: disabled ? 'default' : 'pointer',
  };
}

const messageStyle: CSSProperties = {
  margin: 0,
  color: '#047857',
  fontSize: 13,
  fontWeight: 750,
};

const emptyStyle: CSSProperties = {
  display: 'grid',
  gap: 12,
  padding: 16,
  border: '1px dashed #cbd5e1',
  borderRadius: 16,
  color: '#64748b',
  background: '#f8fafc',
  fontSize: 14,
  fontWeight: 750,
};

const loginStyle: CSSProperties = {
  justifySelf: 'start',
  padding: '10px 14px',
  borderRadius: 14,
  color: '#ffffff',
  background: '#116dff',
  fontSize: 14,
  fontWeight: 850,
  textDecoration: 'none',
};

export default defineComponent({
  kind: 'member-profile-form',
  displayName: '회원 프로필 폼',
  category: 'domain',
  icon: 'P',
  defaultContent: {
    title: MEMBER_PROFILE_FORM_KO_DEFAULTS.title,
    subtitle: MEMBER_PROFILE_FORM_KO_DEFAULTS.subtitle,
    nameLabel: MEMBER_PROFILE_FORM_KO_DEFAULTS.nameLabel,
    phoneLabel: MEMBER_PROFILE_FORM_KO_DEFAULTS.phoneLabel,
    saveLabel: MEMBER_PROFILE_FORM_KO_DEFAULTS.saveLabel,
    savingLabel: MEMBER_PROFILE_FORM_KO_DEFAULTS.savingLabel,
    savedLabel: MEMBER_PROFILE_FORM_KO_DEFAULTS.savedLabel,
    loginLabel: MEMBER_PROFILE_FORM_KO_DEFAULTS.loginLabel,
    loginHref: '',
  },
  defaultStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 24,
  },
  defaultRect: { width: 500, height: 340 },
  Render: MemberProfileFormRender,
  Inspector: MemberProfileFormInspector,
});
