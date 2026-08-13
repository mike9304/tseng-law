import type { Metadata } from 'next';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import {
  listNotificationEvents,
  listRecoveryCarts,
  loadNotificationSettings,
} from '@/lib/builder/commerce/notifications-engine';
import { requireBuilderPagePermission } from '@/lib/builder/security/page-permission';
import { normalizeLocale, type Locale } from '@/lib/locales';
import NotificationManagerClient from '@/components/builder/commerce/NotificationManagerClient';
import { getNotificationsCopy } from '@/components/builder/commerce/notifications-copy';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const copy = getNotificationsCopy(locale);
  return {
    title: `${copy.title} · Hojeong Builder`,
    description: copy.subtitle,
  };
}

export default async function CommerceNotificationsPage(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  await requireBuilderPagePermission('view-commerce');
  const site = await readSiteDocument(DEFAULT_BUILDER_SITE_ID, locale);
  const [settings, events, recoveries] = await Promise.all([
    loadNotificationSettings(),
    listNotificationEvents({ locale }),
    listRecoveryCarts({ locale }),
  ]);

  return (
    <NotificationManagerClient
      locale={locale}
      siteTitle={site.name}
      initialSettings={settings}
      initialEvents={events}
      initialRecoveries={recoveries}
    />
  );
}
