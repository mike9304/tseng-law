import type { Metadata } from 'next';
import EventsAdminClient from '@/components/builder/events/EventsAdminClient';
import { listEvents } from '@/lib/builder/events/events-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: 'Builder Events Admin',
    description: '이벤트와 RSVP를 관리하는 화면입니다.',
    path: '/admin-builder/events',
    noindex: true,
  });
}

export default async function BuilderEventsAdminPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const events = (await listEvents()).filter((event) => event.locale === locale);

  return <EventsAdminClient locale={locale} initialEvents={events} />;
}
