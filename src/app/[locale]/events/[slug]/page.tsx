import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EventRsvpElement from '@/lib/builder/components/eventRsvp/Element';
import type { BuilderEventRsvpCanvasNode } from '@/lib/builder/canvas/types';
import { findEventBySlug } from '@/lib/builder/events/events-engine';
import { normalizeLocale, locales, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';
import styles from '../EventsPublic.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { locale: Locale; slug: string } }): Promise<Metadata> {
  const locale = normalizeLocale(params.locale);
  const event = await findEventBySlug(locale, params.slug);
  if (!event || event.status !== 'published') return {};
  return buildSeoMetadata({
    locale,
    title: event.title,
    description: event.description,
    path: `/events/${event.slug}`,
    images: event.imageUrl,
    type: 'article',
    noindex: locale === 'en',
    alternateLocales: locales,
  });
}

export default async function EventDetailPage({ params }: { params: { locale: Locale; slug: string } }) {
  const locale = normalizeLocale(params.locale);
  const event = await findEventBySlug(locale, params.slug);
  if (!event || event.status !== 'published') return notFound();
  const backLabel = locale === 'ko' ? '이벤트 목록으로' : locale === 'zh-hant' ? '返回活動列表' : 'Back to events';
  const eyebrow = locale === 'ko' ? '이벤트' : locale === 'zh-hant' ? '活動' : 'Event';
  const rsvpTitle = locale === 'ko' ? '이벤트 신청' : locale === 'zh-hant' ? '活動報名' : 'RSVP';
  const rsvpSuccessMessage = locale === 'ko'
    ? '신청이 접수되었습니다. 확인 메일을 기다려 주세요.'
    : locale === 'zh-hant'
      ? '報名已送出。請等待確認信。'
      : 'Your RSVP has been received.';

  const rsvpNode: BuilderEventRsvpCanvasNode = {
    id: `event-rsvp-${event.eventId}`,
    kind: 'event-rsvp',
    rect: { x: 0, y: 0, width: 520, height: 560 },
    style: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 0,
      shadowX: 0,
      shadowY: 0,
      shadowBlur: 0,
      shadowSpread: 0,
      shadowColor: 'rgba(15, 23, 42, 0.16)',
      opacity: 100,
    },
    zIndex: 1,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      eventId: event.eventId,
      title: rsvpTitle,
      showTicketInfo: true,
      successMessage: rsvpSuccessMessage,
    },
  };

  return (
    <main className={styles.page} data-public-event-detail="true">
      <section className={styles.hero}>
        <div className={styles.inner}>
          <Link className={styles.back} href={`/${locale}/events`}>
            {backLabel}
          </Link>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>{event.title}</h1>
          <p>{event.date} {event.time} · {event.location}</p>
        </div>
      </section>
      <section className={`${styles.inner} ${styles.detail}`}>
        <article className={styles.detailCard}>
          <div className={styles.detailMeta}>
            <strong>{event.ticketType === 'free' ? '무료' : `${event.ticketCurrency} ${event.ticketPriceTwd.toLocaleString()}`}</strong>
            {' · '}
            <span>{event.registeredCount}/{event.capacity} RSVP</span>
          </div>
          <div className={styles.detailBody}>{event.description}</div>
        </article>
        <aside className={styles.rsvpWrap}>
          <EventRsvpElement node={rsvpNode} mode="published" locale={locale} />
        </aside>
      </section>
    </main>
  );
}
