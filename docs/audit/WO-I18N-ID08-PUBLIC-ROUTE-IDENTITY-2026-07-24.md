# WO-I18N-ID08 — Public route identity

Date: 2026-07-24 KST
Owner: subcontract coding worker
Reviewer: independent read-only agent
Manager: root

## Objective

Remove the remaining incorrect Traditional Chinese attorney name `曾俊瑋`
from scoped public guide, landing, legacy metadata, and service metadata route
sources. Use the verified canonical name `曾雋崴` while preserving every other
word and route behavior.

## Allowed files

- `src/app/[locale]/guides/taiwan-company-setup/content.ts`
- `src/app/[locale]/korean-lawyer-in-taiwan/content.ts`
- `src/app/[locale]/(legacy)/lawyers-legacy.tsx`
- `src/app/[locale]/(legacy)/about-legacy.tsx`
- `src/app/[locale]/services/[slug]/page.tsx`
- `src/app/[locale]/__tests__/canonical-public-route-identity.test.ts` (new)

No other product file may be edited.

## Required behavior

1. Replace exactly the scoped attorney-identity characters:
   - `曾俊瑋律師` becomes `曾雋崴律師`.
   - `曾俊瑋 律師` becomes `曾雋崴 律師`, preserving existing spacing.
2. Preserve surrounding copy, locale branching, metadata shape, links,
   slugs, arrays, and formatting.
3. Preserve KO `증준외` and EN `Wei Tseng`.
4. Add a focused regression test proving:
   - all five allowed product sources contain no `曾俊瑋`;
   - canonical `曾雋崴` is present in each source;
   - representative KO/EN runtime content remains present.

## Worker gates

- Focused Vitest for the new test and directly affected content tests.
- `npm run typecheck`
- scoped ESLint on the six allowed files
- `git diff --check`
- exact old/canonical occurrence counts

Do not stage, commit, push, deploy, or operate the dev server.

## Manager acceptance

- Independent read-only review proves the patch is identity-only.
- Manager reruns all worker gates.
- Browser verifies representative ZH-Hant guide/landing/service pages and
  metadata contain the canonical identity, not the incorrect one.
- Commit only the six allowed files plus this work order.
