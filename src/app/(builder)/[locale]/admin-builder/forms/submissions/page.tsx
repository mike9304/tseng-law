import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  listSubmissionFormIds,
  listSubmissions,
  type FormSubmission,
} from '@/lib/builder/forms/form-engine';
import SubmissionsListView from '@/components/builder/forms/SubmissionsListView';
import { getFormsCopy } from '@/components/builder/forms/forms-copy';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const copy = getFormsCopy(params.locale);
  return {
    title: copy.list.title,
    description: copy.list.description,
    robots: 'noindex,nofollow',
  };
}

export default async function FormSubmissionsPage(
  props: {
    params: Promise<{ locale: Locale }>;
    searchParams?: Promise<{ formId?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
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
      locale={params.locale}
    />
  );
}
