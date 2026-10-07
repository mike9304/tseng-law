# Reviewer C — candidate 3 scoped addendum

Date: 2026-10-08 (Asia/Seoul).

Decision: APPROVE the candidate 3 content/copy delta. My [candidate 2 independent content decision](./FINAL-REVIEW-CANDIDATE2.md) remains applicable to its unchanged scope. No new content or static-navigation blocker was found.

Candidate 3 manifest SHA-256: 0e09b8e27485175b24050193ba5f6d517258767d7686f53a97603327caffa467. I independently compared the manifests and checked the live repository: 68/68 files match; all original 67 hashes are identical; there are no removed files or changed common hashes. The added file is src/components/LocaleSuggestion.tsx, SHA-256 5786de766687c27bbd3409a0661cf0ec0dd1c7aa29575d9dd888cb7e2d978e34. Evidence: [candidate3-continuity.json](./candidate3-continuity.json), [manifest](./candidate3-manifest.json), [exact diff](./candidate3-delta.diff), and candidate3-snapshot/.

I read the whole LocaleSuggestion component, its language-link context, the path-to-published-language resolver and dismissal storage functions.

- Line 22 changes only the English text/link labels from “These columns are also available in English.” / “Read in English” to “Browse our English-language articles.” / “English articles”. “Close” is unchanged. This removes an exact-translation implication without altering the site's English-content offer.
- Lines 58–59 use the published article link when present and otherwise use /en/columns for an English suggestion. The resolver in public-guidance.ts:633–642 returns only indexed published-language cluster links. The new wording is appropriate for either destination.
- Lines 98–100 still render the chosen href and hrefLang. Lines 101–107 retain the labelled button, dismissal storage call and immediate setTarget(null). Storage failure is caught by the helper; immediate dismissal is independent of successful persistence.
- Target eligibility, browser-language handling, hero visibility, hydration timing and observer cleanup are unchanged by this delta. There is no added redirect, legal statement or claim of human review.

No article text, sources, dates, AI attribution or board membership changed. Accordingly, the prior 62-text legal/editorial review and exact content hashes remain valid. A two-string interface-copy correction does not require re-running article sentence metrics or legal-source research.

The primary agent reports that the second pristine production build and final built/public flow checks are underway. I did not execute those checks and do not mark them passed here. I read the prior release's docs/audit/criminal-20261007/preflight.md, which documents the retired homepage-marker assertion at tests/builder-editor/admin-builder.playwright.ts:440. The parent reports the same broad-builder smoke failure now; it remains a failed/unfinished broad smoke, not a passing gate or proof that later builder stages ran. I did not read the referenced other-reviewer report.

This addendum approves only the unchanged content scope plus the inspected interface-copy delta. It does not declare broad criminal coverage complete or certify publication. The primary agent retains the final release decision and production verification.

