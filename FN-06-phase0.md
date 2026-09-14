WO-FN-06 Phase 0 — listSubmissions consumers
Worktree: /Users/son7/Projects/tseng-law-function-20260907 @ 5eb435b9 + FN-01..04 diffs
listSubmissions: src/lib/builder/forms/form-engine.ts export async function listSubmissions
Does not use prisma (blob/local JSON). No consumer filters rejected/duplicate on FormSubmission rows.

| Consumer | Path | Exported name | Notes |
|---|---|---|---|
| admin dashboard SSR | src/app/(builder)/[locale]/admin-builder/forms/page.tsx | default FormsAdminPage | listSubmissions(formId, 50) → FormSubmissionsDashboard.initialSubmissions |
| submissions list SSR | src/app/(builder)/[locale]/admin-builder/forms/submissions/page.tsx | default FormSubmissionsPage | listSubmissions(activeFormId, 100) → SubmissionsListView.initialSubmissions |
| GET /api/builder/forms/submissions | src/app/api/builder/forms/submissions/route.ts | GET | JSON { submissions, formId }; catch → { submissions: [] } |
| PATCH mark-read | same file | PATCH | saveSubmission({ ...body, read: true }) |
| CSV export | src/components/builder/forms/SubmissionsListView.tsx | default SubmissionsListView; inner exportCsv not exported | Client-only; filtered = all rows when query empty; no rejected filter |

No Phase 0 consumer already filters duplicates. Expectation table stands. UI files will not be edited.
