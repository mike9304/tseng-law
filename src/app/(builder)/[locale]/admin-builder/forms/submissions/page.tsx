import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  listSubmissionFormIds,
  listSubmissions,
  type FormSubmission,
} from '@/lib/builder/forms/form-engine';
import SubmissionsListView from '@/components/builder/forms/SubmissionsListView';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return {
    title: 'Form Submissions',
    description: 'Review builder form submissions.',
    robots: 'noindex,nofollow',
  };
}

export default async function FormSubmissionsPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams?: { formId?: string };
}) {
  normalizeLocale(params.locale);
  const formIds = await listSubmissionFormIds();
  const activeFormId = searchParams?.formId || formIds[0] || 'default-contact';
  let initialSubmissions: FormSubmission[] = [];
  try {
    initialSubmissions = await listSubmissions(activeFormId, 100);
  } catch {
    initialSubmissions = [];
  }

  return (
    <SubmissionsListView
      formIds={formIds}
      initialFormId={activeFormId}
      initialSubmissions={initialSubmissions}
    />
  );
}
