'use client';

import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderMemberLoginCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeLocale } from '@/lib/locales';
import { getMemberLoginCopy, localizedMemberLoginSubtitle, MEMBER_LOGIN_KO_DEFAULTS } from './member-login-copy';
import { localizedMemberText } from '../member-account-widgets-copy';

import MemberLoginRender from './Render';

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
