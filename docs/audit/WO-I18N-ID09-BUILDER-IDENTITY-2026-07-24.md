# WO-I18N-ID09 — Builder identity

Date: 2026-07-24 KST
Owner: subcontract coding worker
Reviewer: independent read-only agent
Manager: root

## Objective

Align remaining builder canvas previews, decomposition seeds, and their test
fixtures with the verified attorney identity `曾雋崴` and official portrait
path `/images/team/wei-tseng-official.png`.

## Allowed files

- `src/lib/builder/canvas/decompose-attorney.ts`
- `src/lib/builder/canvas/decompose-insights.ts`
- `src/lib/builder/canvas/seed-home.ts`
- `src/components/builder/canvas/CanvasInsightsPreview.tsx`
- `src/lib/builder/canvas/__tests__/seed-home-layout.test.ts`
- `src/components/builder/canvas/__tests__/site-header-responsive-contract.test.ts`
- `src/lib/builder/__tests__/dataset-field-binding.test.ts`
- `src/lib/builder/canvas/__tests__/canonical-builder-attorney-identity.test.ts` (new)

No other product file may be edited. `seed-home.ts` was added during the
manager gate after the focused seed test exposed its URL-encoded hardcoded
legacy portrait override.

## Required behavior

1. ZH-Hant builder copy uses `曾雋崴律師`, `曾雋崴律師審閱`, and
   `曾雋崴 · 代表律師` as appropriate.
2. The localized test fixture label uses `曾雋崴(준외)`.
3. The dataset image binding expectation uses the official portrait path.
4. Preserve KO and EN builder copy, IDs, component structure, and behavior.
5. Add a regression test scanning the four builder product sources and
   relevant fixtures for absence of `曾俊瑋` and `tseng-junwei.png`, while
   asserting canonical name/portrait presence.

## Worker gates

- Focused builder/canvas Vitest suites affected by the change.
- `npm run typecheck`
- scoped ESLint on the eight allowed files
- `git diff --check`
- exact occurrence counts

Do not stage, commit, push, deploy, or operate the dev server.

## Manager acceptance

- Independent review confirms builder-only, identity-only changes.
- Manager reruns gates.
- Manager performs a representative builder-preview render/test assertion;
  public browser surfaces are not changed by this work order.
- Commit only the eight allowed files plus this work order.
