# WO-I18N-REV-DATA01 — Review source locale and fail-closed status

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Context

The public review API currently shares one approved list across every locale and
does not record the language in which a review was submitted. Production and
local public review responses were both empty during the 2026-07-24 audit.

## Goal

Record a valid public-site source locale for every new review, allow the public
GET endpoint to return only that locale, and stop treating legacy records with
no status as implicitly approved.

## Allowed files

1. `src/lib/reviews/storage.ts`
2. `src/app/api/reviews/route.ts`
3. `src/app/api/reviews/__tests__/route.test.ts`
4. `src/components/ReviewBoard.tsx`

No other file may be edited. Do not stage, commit, push, deploy, or operate the
development server.

## Storage contract

- Add optional `sourceLocale` to the parsed storage schema using the existing
  `SiteLocale` values: `ko`, `zh-hant`, `en`, `ja`.
- Keep it optional only so historical JSON remains parseable.
- Change a missing `status` default from `approved` to `pending`.
- Do not alter any stored nickname, rating, service, content, or timestamp.

## Public API contract

- POST requires a valid `sourceLocale` and stores it exactly.
- Missing or invalid `sourceLocale` returns status 400 with
  `{ error: 'invalid source locale' }` before any write.
- All new submissions remain `pending`.
- GET accepts `?locale=<SiteLocale>`.
- With a valid locale query, return only records where:
  - `status === 'approved'`
  - `sourceLocale` exactly equals the requested locale.
- A legacy record with no `sourceLocale` is not returned by a locale-filtered
  public GET.
- A missing locale query retains the existing backwards-compatible approved
  list behavior.
- An invalid locale query returns status 400 with
  `{ error: 'invalid source locale' }`.
- Preserve newest-first sorting.

## Current ReviewBoard compatibility

- Keep its current three-locale type and UI unchanged in this workorder.
- Fetch `/api/reviews?locale=${locale}`.
- Send `sourceLocale: locale` in POST JSON.
- No Japanese labels or route changes in this workorder.

## Required tests

- Locale-filtered GET excludes pending, other-locale, and unknown-locale rows,
  and remains newest-first.
- Missing GET locale retains approved-list compatibility.
- Invalid GET locale returns exact 400 error.
- Valid POST stores exact `sourceLocale` and pending status.
- Missing/invalid POST locale returns exact 400 and writes nothing.
- A stored row missing `status` parses as pending and is not publicly returned.
- Existing origin, spam, validation, rate-limit, and corrupt-storage behavior
  remains green; update valid fixtures only with their intended source locale.
- ReviewBoard source assertion or focused component test verifies locale query
  and POST field without changing existing visible copy.
- `npm run typecheck`
- scoped ESLint for the four allowed files
- `git diff --check`

Japanese UI integration and privacy/governance copy are later workorders.
