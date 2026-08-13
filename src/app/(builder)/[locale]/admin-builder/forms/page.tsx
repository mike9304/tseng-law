import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { listSubmissions, type FormSubmission } from '@/lib/builder/forms/form-engine';
import FormSubmissionsDashboard from '@/components/builder/forms/FormSubmissionsDashboard';
import { getFormsCopy } from '@/components/builder/forms/forms-copy';

export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const copy = getFormsCopy(params.locale);
  return {
    title: copy.dashboard.title,
    description: copy.dashboard.description,
    robots: 'noindex,nofollow',
  };
}

export default async function FormsAdminPage(
  props: {
    params: Promise<{ locale: Locale }>;
    searchParams?: Promise<{ formId?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  normalizeLocale(params.locale); // validate locale
  const formId = searchParams?.formId || 'default-contact';

  let initialSubmissions: FormSubmission[];
  try {
    initialSubmissions = await listSubmissions(formId, 50);
  } catch {
    initialSubmissions = [];
  }

  return (
    <FormSubmissionsDashboard
      initialSubmissions={initialSubmissions}
      formId={formId}
      locale={params.locale}
    />
  );
}
