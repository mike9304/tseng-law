import type { FormSubmission } from '@/lib/builder/forms/form-engine';

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

/** Pure CSV body for admin submission export. Download/Blob stays in the view. */
export function serializeSubmissionsCsv(submissions: FormSubmission[]): string {
  const keys = Array.from(new Set(submissions.flatMap((submission) => Object.keys(submission.data))));
  const rows = [
    ['submissionId', 'formId', 'submittedAt', 'read', ...keys],
    ...submissions.map((submission) => [
      submission.submissionId,
      submission.formId,
      submission.submittedAt,
      submission.read ? 'read' : 'unread',
      ...keys.map((key) => String(submission.data[key] ?? '')),
    ]),
  ];
  return rows.map((row) => row.map(csvCell).join(',')).join('\n');
}
