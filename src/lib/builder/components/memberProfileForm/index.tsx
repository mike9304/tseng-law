'use client';

import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderMemberProfileFormCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeLocale } from '@/lib/locales';
import { getMemberAccountWidgetsCopy, localizedMemberText, MEMBER_PROFILE_FORM_KO_DEFAULTS } from '../member-account-widgets-copy';

import MemberProfileFormRender from './Render';

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
