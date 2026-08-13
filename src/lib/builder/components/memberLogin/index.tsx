'use client';

import React, { FormEvent, useMemo, useState, type CSSProperties } from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderMemberLoginCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  getMemberLoginCopy,
  localizedMemberLoginSubtitle,
  MEMBER_LOGIN_KO_DEFAULTS,
} from './member-login-copy';
import { localizedMemberText } from '../member-account-widgets-copy';

function MemberLoginRender({
  node,
  mode = 'edit',
  locale,
}: {
  node: BuilderMemberLoginCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const effectiveLocale = normalizeLocale(locale || 'ko');
  const copy = useMemo(() => getMemberLoginCopy(effectiveLocale), [effectiveLocale]);
  const content = node.content;
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const isPublished = mode === 'published';
  const nextPath = content.nextPath || `/${effectiveLocale}/account`;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isPublished || pending) return;
    setPending(true);
    setMessage('');
    const form = new FormData(event.currentTarget);
    const payload = {
      email: String(form.get('email') ?? ''),
      password: String(form.get('password') ?? ''),
      locale: effectiveLocale,
    };
    try {
      const response = await fetch('/api/members/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!response.ok || !json.ok) throw new Error(json.error || copy.error);
      window.location.assign(nextPath);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.error);
    } finally {
      setPending(false);
    }
  }

  return (
    <section
      data-builder-member-login-widget="true"
      data-builder-member-login-mode="login"
      data-public-signup-enabled="false"
      style={panelStyle}
    >
      <div style={introStyle}>
        <span style={eyebrowStyle}>{copy.eyebrow}</span>
        <strong style={titleStyle}>{localizedMemberText(content.title, copy.title, MEMBER_LOGIN_KO_DEFAULTS.title)}</strong>
        <span style={subtitleStyle}>{localizedMemberLoginSubtitle(content.subtitle, copy.subtitle)}</span>
      </div>
      <form onSubmit={submit} style={formStyle}>
        <label style={fieldStyle}>
          <span>{copy.email}</span>
          <input name="email" type="email" autoComplete="email" required disabled={!isPublished || pending} style={inputStyle} />
        </label>
        <label style={fieldStyle}>
          <span>{copy.password}</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            disabled={!isPublished || pending}
            style={inputStyle}
          />
        </label>
        <button
          type="submit"
          disabled={!isPublished || pending}
          data-builder-member-login-submit="true"
          style={submitStyle(!isPublished || pending)}
        >
          {pending
            ? copy.loading
            : localizedMemberText(content.loginLabel, copy.login, MEMBER_LOGIN_KO_DEFAULTS.loginLabel)}
        </button>
        {message ? <p role="alert" style={errorStyle}>{message}</p> : null}
      </form>
    </section>
  );
}

function MemberLoginInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const memberNode = node as BuilderMemberLoginCanvasNode;
  const c = memberNode.content;
  const effectiveLocale = normalizeLocale(locale);
  const copy = getMemberLoginCopy(effectiveLocale);
  const title = localizedMemberText(c.title, copy.title, MEMBER_LOGIN_KO_DEFAULTS.title);
  const subtitle = localizedMemberLoginSubtitle(c.subtitle, copy.subtitle);
  const loginLabel = localizedMemberText(c.loginLabel, copy.login, MEMBER_LOGIN_KO_DEFAULTS.loginLabel);
  const nextPathPlaceholder = `/${effectiveLocale}/account`;
  return (
    <>
      <label>
        <span>{copy.inspectorTitle}</span>
        <input type="text" value={title} disabled={disabled} onChange={(event) => onUpdate({ title: event.target.value })} />
      </label>
      <label>
        <span>{copy.inspectorSubtitle}</span>
        <textarea value={subtitle} disabled={disabled} onChange={(event) => onUpdate({ subtitle: event.target.value })} />
      </label>
      <label>
        <span>{copy.inspectorNextPath}</span>
        <input type="text" value={c.nextPath} placeholder={nextPathPlaceholder} disabled={disabled} onChange={(event) => onUpdate({ nextPath: event.target.value })} />
      </label>
      <p role="note">{copy.inspectorPublicSignupNotice}</p>
      <label>
        <span>{copy.inspectorLoginLabel}</span>
        <input type="text" value={loginLabel} disabled={disabled} onChange={(event) => onUpdate({ loginLabel: event.target.value })} />
      </label>
    </>
  );
}

const panelStyle: CSSProperties = {
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

const introStyle: CSSProperties = {
  display: 'grid',
  gap: 6,
};

const eyebrowStyle: CSSProperties = {
  color: '#116dff',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 1.2,
  textTransform: 'uppercase',
};

const titleStyle: CSSProperties = {
  fontSize: 24,
  lineHeight: 1.15,
};

const subtitleStyle: CSSProperties = {
  color: '#64748b',
  fontSize: 14,
  lineHeight: 1.45,
};

const formStyle: CSSProperties = {
  display: 'grid',
  gap: 12,
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
  padding: '11px 12px',
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
    fontSize: 15,
    fontWeight: 850,
    padding: '13px 16px',
    cursor: disabled ? 'default' : 'pointer',
  };
}

const errorStyle: CSSProperties = {
  margin: 0,
  color: '#b91c1c',
  fontSize: 13,
  fontWeight: 700,
};

export default defineComponent({
  kind: 'member-login',
  displayName: '회원 로그인',
  category: 'domain',
  icon: 'M',
  defaultContent: {
    title: MEMBER_LOGIN_KO_DEFAULTS.title,
    subtitle: MEMBER_LOGIN_KO_DEFAULTS.subtitle,
    defaultMode: 'login',
    showSignup: false,
    nextPath: '',
    loginLabel: MEMBER_LOGIN_KO_DEFAULTS.loginLabel,
    signupLabel: MEMBER_LOGIN_KO_DEFAULTS.signupLabel,
  },
  defaultStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 24,
  },
  defaultRect: { width: 420, height: 390 },
  Render: MemberLoginRender,
  Inspector: MemberLoginInspector,
});
