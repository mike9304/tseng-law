import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { listSubmissions, type FormSubmission } from '@/lib/builder/forms/form-engine';
import FormSubmissionsDashboard from '@/components/builder/forms/FormSubmissionsDashboard';

export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  return {
    title: 'Form Submissions',
    description: 'Review form submissions.',
    robots: 'noindex,nofollow',
  };
}

export default async function FormsAdminPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams?: { formId?: string };
}) {
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
    />
  );
}
