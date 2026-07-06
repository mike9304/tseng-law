'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderMemberBookingsListCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  getMemberAccountWidgetsCopy,
  localizedMemberText,
  MEMBER_BOOKINGS_LIST_KO_DEFAULTS,
} from '../member-account-widgets-copy';

type PortalBooking = {
  bookingId: string;
  serviceName: string;
  startAt: string;
  staffName: string;
  status: string;
  paymentStatus?: string;
  customerTimezone?: string;
};

type BookingsState =
  | { status: 'preview'; upcoming: PortalBooking[]; past: PortalBooking[]; email: string }
  | { status: 'loading'; upcoming: []; past: []; email: '' }
  | { status: 'authenticated'; upcoming: PortalBooking[]; past: PortalBooking[]; email: string }
  | { status: 'guest'; upcoming: []; past: []; email: '' }
  | { status: 'error'; upcoming: []; past: []; email: '' };

function pathOrDefault(value: string, fallback: string): string {
  const trimmed = value.trim();
  return trimmed.startsWith('/') ? trimmed : fallback;
}

function formatBookingDate(value: string, locale: Locale): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const intlLocale = locale === 'zh-hant' ? 'zh-TW' : locale === 'en' ? 'en-US' : 'ko-KR';
  return new Intl.DateTimeFormat(intlLocale, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function previewState(locale: Locale): BookingsState {
  return {
    status: 'preview',
    email: 'member@example.com',
    upcoming: [{
      bookingId: 'BK-preview',
      serviceName: locale === 'ko' ? '상담 예약' : locale === 'zh-hant' ? '諮詢預約' : 'Consultation',
      startAt: new Date(Date.now() + 86400000).toISOString(),
      staffName: locale === 'ko' ? '담당 변호사' : locale === 'zh-hant' ? '負責律師' : 'Assigned attorney',
      status: 'confirmed',
      paymentStatus: 'pending',
    }],
    past: [],
  };
}

function BookingRows({
  bookings,
  empty,
  locale,
  staffLabel,
  statusLabels,
}: {
  bookings: PortalBooking[];
  empty: string;
  locale: Locale;
  staffLabel: string;
  statusLabels: Record<string, string>;
}) {
  if (bookings.length === 0) return <p style={emptyStyle}>{empty}</p>;
  return (
    <div style={rowsStyle}>
      {bookings.slice(0, 3).map((booking) => (
        <article key={booking.bookingId} style={rowStyle} data-builder-member-booking-row={booking.bookingId}>
          <div style={{ minWidth: 0 }}>
            <strong style={rowTitleStyle}>{booking.serviceName}</strong>
            <span style={rowDateStyle}>{formatBookingDate(booking.startAt, locale)}</span>
            <span style={rowMetaStyle}>{staffLabel}: {booking.staffName}</span>
          </div>
          <span style={statusStyle}>{statusLabels[booking.status] ?? booking.status}</span>
        </article>
      ))}
    </div>
  );
}

function MemberBookingsListRender({
  node,
  mode = 'edit',
  locale,
}: {
  node: BuilderMemberBookingsListCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const effectiveLocale = normalizeLocale(locale || 'ko');
  const copy = useMemo(() => getMemberAccountWidgetsCopy(effectiveLocale).bookingsList, [effectiveLocale]);
  const c = node.content;
  const [state, setState] = useState<BookingsState>(() => previewState(effectiveLocale));
  const isPublished = mode === 'published';

  useEffect(() => {
    if (isPublished) return;
    setState(previewState(effectiveLocale));
  }, [effectiveLocale, isPublished]);

  useEffect(() => {
    if (!isPublished) return;
    let canceled = false;
    setState({ status: 'loading', upcoming: [], past: [], email: '' });
    fetch(`/api/members/bookings?locale=${effectiveLocale}`, { credentials: 'same-origin' })
      .then(async (response) => {
        if (response.status === 401) return { status: 'guest' as const };
        const payload = (await response.json().catch(() => ({}))) as {
          ok?: boolean;
          email?: string;
          upcoming?: PortalBooking[];
          past?: PortalBooking[];
        };
        if (!response.ok || !payload.ok) return { status: 'error' as const };
        return {
          status: 'authenticated' as const,
          email: payload.email ?? '',
          upcoming: Array.isArray(payload.upcoming) ? payload.upcoming : [],
          past: Array.isArray(payload.past) ? payload.past : [],
        };
      })
      .then((next) => {
        if (canceled) return;
        if (next.status === 'authenticated') {
          setState({ status: 'authenticated', email: next.email, upcoming: next.upcoming, past: next.past });
          return;
        }
        setState({ status: next.status, upcoming: [], past: [], email: '' });
      })
      .catch(() => {
        if (!canceled) setState({ status: 'error', upcoming: [], past: [], email: '' });
      });
    return () => {
      canceled = true;
    };
  }, [effectiveLocale, isPublished]);

  const loginHref = pathOrDefault(c.loginHref, `/${effectiveLocale}/login?next=/${effectiveLocale}/account/bookings`);

  return (
    <section
      data-builder-member-bookings-list="true"
      data-builder-member-bookings-state={state.status}
      style={panelStyle}
    >
      <div style={introStyle}>
        <span style={eyebrowStyle}>{copy.eyebrow}</span>
        <strong style={titleStyle}>{localizedMemberText(c.title, copy.title, MEMBER_BOOKINGS_LIST_KO_DEFAULTS.title)}</strong>
        <span style={subtitleStyle}>{localizedMemberText(c.subtitle, copy.subtitle, MEMBER_BOOKINGS_LIST_KO_DEFAULTS.subtitle)}</span>
        {state.email ? <span style={emailStyle}>{state.email}</span> : null}
      </div>
      {state.status === 'guest' || state.status === 'error' || state.status === 'loading' ? (
        <div style={noticeStyle}>
          {state.status === 'loading' ? copy.loading : state.status === 'error' ? copy.error : copy.guest}
          {state.status === 'guest' ? (
            <a href={loginHref} style={loginStyle} data-builder-canvas-page-link="true" data-builder-member-bookings-link="login">
              {localizedMemberText(c.loginLabel, copy.login, MEMBER_BOOKINGS_LIST_KO_DEFAULTS.loginLabel)}
            </a>
          ) : null}
        </div>
      ) : (
        <div style={sectionsStyle}>
          <section style={listSectionStyle}>
            <div style={listHeaderStyle}>
              <strong>{localizedMemberText(c.upcomingLabel, copy.upcoming, MEMBER_BOOKINGS_LIST_KO_DEFAULTS.upcomingLabel)}</strong>
              <span>{state.upcoming.length}</span>
            </div>
            <BookingRows
              bookings={state.upcoming}
              empty={localizedMemberText(c.emptyUpcomingLabel, copy.emptyUpcoming, MEMBER_BOOKINGS_LIST_KO_DEFAULTS.emptyUpcomingLabel)}
              locale={effectiveLocale}
              staffLabel={copy.staff}
              statusLabels={copy.statusLabels}
            />
          </section>
          {c.showPast ? (
            <section style={listSectionStyle}>
              <div style={listHeaderStyle}>
                <strong>{localizedMemberText(c.pastLabel, copy.past, MEMBER_BOOKINGS_LIST_KO_DEFAULTS.pastLabel)}</strong>
                <span>{state.past.length}</span>
              </div>
              <BookingRows
                bookings={state.past}
                empty={localizedMemberText(c.emptyPastLabel, copy.emptyPast, MEMBER_BOOKINGS_LIST_KO_DEFAULTS.emptyPastLabel)}
                locale={effectiveLocale}
                staffLabel={copy.staff}
                statusLabels={copy.statusLabels}
              />
            </section>
          ) : null}
        </div>
      )}
    </section>
  );
}

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

const panelStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  display: 'grid',
  alignContent: 'start',
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
const titleStyle: CSSProperties = { fontSize: 24, lineHeight: 1.12 };
const subtitleStyle: CSSProperties = { color: '#64748b', fontSize: 14, lineHeight: 1.4 };
const emailStyle: CSSProperties = { color: '#0f172a', fontSize: 13, fontWeight: 800 };
const sectionsStyle: CSSProperties = { display: 'grid', gap: 12 };
const listSectionStyle: CSSProperties = { display: 'grid', gap: 8 };
const listHeaderStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#0f172a', fontSize: 14 };
const rowsStyle: CSSProperties = { display: 'grid', gap: 8 };

const rowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: 10,
  alignItems: 'center',
  padding: 12,
  border: '1px solid #e2e8f0',
  borderRadius: 16,
  background: '#f8fafc',
};

const rowTitleStyle: CSSProperties = {
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const rowDateStyle: CSSProperties = { display: 'block', color: '#475569', fontSize: 13, marginTop: 3 };
const rowMetaStyle: CSSProperties = { display: 'block', color: '#64748b', fontSize: 12, marginTop: 3 };
const statusStyle: CSSProperties = { padding: '5px 8px', borderRadius: 999, background: '#e0f2fe', color: '#075985', fontSize: 12, fontWeight: 850 };
const emptyStyle: CSSProperties = { margin: 0, padding: 12, border: '1px dashed #cbd5e1', borderRadius: 14, color: '#64748b', background: '#f8fafc', fontSize: 13, fontWeight: 750 };
const noticeStyle: CSSProperties = { display: 'grid', gap: 12, padding: 16, border: '1px dashed #cbd5e1', borderRadius: 16, color: '#64748b', background: '#f8fafc', fontSize: 14, fontWeight: 750 };
const loginStyle: CSSProperties = { justifySelf: 'start', padding: '10px 14px', borderRadius: 14, color: '#ffffff', background: '#116dff', fontSize: 14, fontWeight: 850, textDecoration: 'none' };

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
