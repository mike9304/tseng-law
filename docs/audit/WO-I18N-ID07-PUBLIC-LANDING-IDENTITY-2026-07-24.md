# WO-I18N-ID07 — Public landing identity

Date: 2026-07-24 KST
Owner: subcontract coding worker
Reviewer: independent read-only agent
Manager: root

## Objective

Correct the remaining public landing/data references from the incorrect
Traditional Chinese attorney name `曾俊瑋` to the verified canonical name
`曾雋崴`, without rewriting surrounding copy or changing KO/EN naming.

## Allowed files

- `src/data/blog-posts.ts`
- `src/data/firm-introduction.ts`
- `src/data/intent-pages.ts`
- `src/components/IntentLandingPage.tsx`
- `src/data/__tests__/canonical-public-landing-identity.test.ts` (new)

No other product file may be edited.

## Required behavior

1. Replace only attorney-identity occurrences:
   - ZH-Hant public copy and keywords use `曾雋崴律師`.
   - Korean blog author uses `증준외 변호사 (曾雋崴 律師)`.
2. Preserve all other wording, dates, links, route slugs, arrays, and formatting.
3. Preserve KO `증준외` and EN `Wei Tseng`.
4. Add a focused regression test proving:
   - all four allowed product sources contain no `曾俊瑋`;
   - the official name is present in each source;
   - representative runtime data retains KO and EN identity.

## Worker gates

- Focused Vitest for the new test and any directly affected existing tests.
- `npm run typecheck`
- scoped ESLint on the five allowed files
- `git diff --check`
- report exact occurrence counts and changed files

Do not stage, commit, push, deploy, or operate the dev server.

## Manager acceptance

- Independent read-only review confirms the patch is identity-only.
- Manager reruns the worker gates.
- Browser verifies representative ZH-Hant intent landing and KO blog/article
  surface show the official name and contain no incorrect name.
- Commit only the five allowed files plus this work order.
