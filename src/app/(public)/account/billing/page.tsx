import type { Metadata } from 'next';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { getMemberPortalEmails } from '@/lib/builder/members/members-engine';
import { listCustomerBillingDocuments } from '@/lib/builder/billing-customer-portal';
import { defaultLocale, normalizeLocale, type Locale } from '@/lib/locales';
import { BillingPortalView } from '@/components/members/BillingPortalView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Billing portal',
  robots: { index: false, follow: false },
};

export default async function CustomerBillingPortalPage(): Promise<JSX.Element> {
  const member = await getCurrentSiteMember();
  const locale = normalizeLocale((member?.locale as Locale | undefined) ?? defaultLocale);
  if (!member) {
    return (
      <BillingPortalView
        locale={locale}
        signedOut
        signInHref={`/${locale}/login?next=${encodeURIComponent('/account/billing')}`}
        documents={[]}
      />
    );
  }

  const documents = await listCustomerBillingDocuments(member.email, { locale }, getMemberPortalEmails(member));
  return <BillingPortalView locale={locale} memberEmail={member.email} documents={documents} />;
}
