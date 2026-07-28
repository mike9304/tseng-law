import type { Metadata } from 'next';
import EventsAdminClient from '@/components/builder/events/EventsAdminClient';
import { listEvents } from '@/lib/builder/events/events-engine';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';
import { getEventsCopy } from '@/components/builder/events/events-copy';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const copy = getEventsCopy(locale);
  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/admin-builder/events',
    alternateLocales: locales,
    noindex: true,
  });
}

export default async function BuilderEventsAdminPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const events = (await listEvents()).filter((event) => event.locale === locale);

  return <EventsAdminClient locale={locale} initialEvents={events} />;
}
