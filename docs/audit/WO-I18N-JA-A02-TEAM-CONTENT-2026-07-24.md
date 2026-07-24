# WO-I18N-JA-A02 — Japanese team content

Date: 2026-07-24 KST
Owner: Japanese translation worker
Reviewer: independent Japanese-language reviewer
Manager: root

## Objective

Add complete Japanese content for the About page's five-member team section.
This work order prepares data only; it does not wire `/ja/about`, alter
components, or change metadata/sitemap.

## Allowed files

- `src/data/team-members.ts`
- `src/data/__tests__/team-members-ja.test.ts` (new)

No other file may be edited.

## Source and translation rules

1. Change `teamContent` to `Record<SiteLocale, TeamContent>` and add a native
   `ja` branch. Preserve existing KO/ZH-Hant/EN objects byte-for-byte.
2. Preserve the five member IDs, order, profile slug, emails, photo paths, and
   source URLs exactly.
3. Use Traditional Chinese characters for names without verified Japanese
   readings. Do not invent kana readings.
4. Canonical lead identity:
   - name: `曾雋崴弁護士`
   - role: `台湾弁護士・代表弁護士`
   - reuse credential wording from the existing Japanese attorney profile
     where possible.
5. Other role guidance:
   - `張容瑄`: `台湾弁護士`
   - `張芳瑀`: `パラリーガル`
   - `孫貞旻`: `韓国事務長`
   - `黃勝平`: `提携会計士` (do not imply a Japanese CPA license)
6. Translate every top-level label/story and every intro, education, and
   experience item. Use concise professional Japanese; avoid Korean syntax,
   unexplained Hangul, invented credentials, and exaggerated claims.
7. Preserve credential-sensitive facts, including the 157万TWD first-instance
   judgment, degree levels, exchange-study institutions, and prior employers.

## Required test contract

- `teamContent.ja` has the same five IDs/order as ZH-Hant.
- IDs, slug, emails, photos, and source URLs match the canonical records.
- Exact Japanese name/role mapping is asserted.
- Intro/education/experience counts match their source records.
- Every Japanese content field is non-empty and contains no Hangul.
- `曾俊瑋` and invented kana names are absent.
- Lead email/photo/profile slug and the blank `son-jungmin` email are preserved.
- Existing KO/ZH-Hant/EN representative content remains unchanged.

## Worker gates

- Focused Vitest including the new test, canonical identity test, and existing
  content regression test.
- `npm run typecheck`
- scoped ESLint on the two allowed files
- `git diff --check`
- report any uncertain proper-name or credential wording

Do not stage, commit, push, deploy, or operate the dev server.

## Manager acceptance

- Independent Japanese reviewer checks all member text for meaning,
  credential accuracy, names, professional tone, naturalness, and omissions.
- Worker applies concrete review corrections within the same two files.
- Manager reruns all gates and verifies the data contract.
- Commit only the two allowed files plus this work order.
