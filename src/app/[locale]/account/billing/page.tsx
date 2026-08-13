import type { Metadata } from 'next';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { getMemberPortalEmails } from '@/lib/builder/members/members-engine';
import { listCustomerBillingDocuments } from '@/lib/builder/billing-customer-portal';
import { BillingPortalView } from '@/components/members/BillingPortalView';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const title = locale === 'ko' ? '청구서 포털' : locale === 'zh-hant' ? '帳單入口' : 'Billing portal';
  return {
    title,
    robots: { index: false, follow: false },
  };
}

export default async function LocalizedCustomerBillingPortalPage(
  props: {
    params: Promise<{ locale: Locale }>;
  }
): Promise<JSX.Element> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const member = await getCurrentSiteMember();
  if (!member) {
    return (
      <BillingPortalView
        locale={locale}
        signedOut
        signInHref={`/${locale}/login?next=${encodeURIComponent(`/${locale}/account/billing`)}`}
        documents={[]}
      />
    );
  }

  const documents = await listCustomerBillingDocuments(member.email, { locale }, getMemberPortalEmails(member));
  return <BillingPortalView locale={locale} memberEmail={member.email} documents={documents} />;
}
