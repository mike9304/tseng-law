import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import {
  listNotificationEvents,
  listRecoveryCarts,
  loadNotificationSettings,
} from '@/lib/builder/commerce/notifications-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import NotificationManagerClient from '@/components/builder/commerce/NotificationManagerClient';

export const dynamic = 'force-dynamic';

export default async function CommerceNotificationsPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
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
