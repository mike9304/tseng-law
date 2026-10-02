'use client';

import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderMemberAccountSummaryCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeLocale } from '@/lib/locales';
import { getMemberAccountSummaryCopy, MEMBER_ACCOUNT_SUMMARY_KO_DEFAULTS } from './member-account-summary-copy';
import { localizedMemberText } from '../member-account-widgets-copy';

import MemberAccountSummaryRender from './Render';

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
