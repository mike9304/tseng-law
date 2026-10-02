'use client';

import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderMemberBookingsListCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeLocale } from '@/lib/locales';
import { getMemberAccountWidgetsCopy, localizedMemberText, MEMBER_BOOKINGS_LIST_KO_DEFAULTS } from '../member-account-widgets-copy';

import MemberBookingsListRender from './Render';

function MemberBookingsListInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const bookingsNode = node as BuilderMemberBookingsListCanvasNode;
  const c = bookingsNode.content;
  const effectiveLocale = normalizeLocale(locale);
  const copy = getMemberAccountWidgetsCopy(effectiveLocale).bookingsList;
  const title = localizedMemberText(c.title, copy.title, MEMBER_BOOKINGS_LIST_KO_DEFAULTS.title);
  const subtitle = localizedMemberText(c.subtitle, copy.subtitle, MEMBER_BOOKINGS_LIST_KO_DEFAULTS.subtitle);
  const upcomingLabel = localizedMemberText(c.upcomingLabel, copy.upcoming, MEMBER_BOOKINGS_LIST_KO_DEFAULTS.upcomingLabel);
  const pastLabel = localizedMemberText(c.pastLabel, copy.past, MEMBER_BOOKINGS_LIST_KO_DEFAULTS.pastLabel);
  const loginHrefPlaceholder = `/${effectiveLocale}/login?next=/${effectiveLocale}/account/bookings`;
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
        <span>{copy.inspector.upcomingLabel}</span>
        <input type="text" value={upcomingLabel} disabled={disabled} onChange={(event) => onUpdate({ upcomingLabel: event.target.value })} />
      </label>
      <label>
        <span>{copy.inspector.showPast}</span>
        <input type="checkbox" checked={c.showPast} disabled={disabled} onChange={(event) => onUpdate({ showPast: event.target.checked })} />
      </label>
      <label>
        <span>{copy.inspector.pastLabel}</span>
        <input type="text" value={pastLabel} disabled={disabled || !c.showPast} onChange={(event) => onUpdate({ pastLabel: event.target.value })} />
      </label>
      <label>
        <span>{copy.inspector.loginLink}</span>
        <input type="text" value={c.loginHref} placeholder={loginHrefPlaceholder} disabled={disabled} onChange={(event) => onUpdate({ loginHref: event.target.value })} />
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'member-bookings-list',
  displayName: '회원 예약 목록',
  category: 'domain',
  icon: 'B',
  defaultContent: {
    title: MEMBER_BOOKINGS_LIST_KO_DEFAULTS.title,
    subtitle: MEMBER_BOOKINGS_LIST_KO_DEFAULTS.subtitle,
    upcomingLabel: MEMBER_BOOKINGS_LIST_KO_DEFAULTS.upcomingLabel,
    pastLabel: MEMBER_BOOKINGS_LIST_KO_DEFAULTS.pastLabel,
    emptyUpcomingLabel: MEMBER_BOOKINGS_LIST_KO_DEFAULTS.emptyUpcomingLabel,
    emptyPastLabel: MEMBER_BOOKINGS_LIST_KO_DEFAULTS.emptyPastLabel,
    loginLabel: MEMBER_BOOKINGS_LIST_KO_DEFAULTS.loginLabel,
    loginHref: '',
    showPast: true,
  },
  defaultStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 24,
  },
  defaultRect: { width: 520, height: 430 },
  Render: MemberBookingsListRender,
  Inspector: MemberBookingsListInspector,
});
