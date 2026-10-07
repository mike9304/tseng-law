# Reviewer A — candidate 3 narrow addendum

Date: 2026-10-08. Decision: PASS for this copy change and the preserved prior content scope. No additional content/legal/editorial blocker.

Candidate 3 SHA-256: `0e09b8e27485175b24050193ba5f6d517258767d7686f53a97603327caffa467`.

I independently compared candidates 2 and 3, checked the working-tree files, and read LocaleSuggestion.tsx plus the actual link-resolution and dismissal helpers. Candidate 3 contains 68 files. All 67 candidate 2 entries retain exactly the same SHA-256; the sole added entry is `src/components/LocaleSuggestion.tsx`, SHA-256 `5786de766687c27bbd3409a0661cf0ec0dd1c7aa29575d9dd888cb7e2d978e34`. Current identity proof is [first40-candidate3-verification.json](first40-candidate3-verification.json).

## Copy and destination

[LocaleSuggestion.tsx:22](/Users/son7/Projects/tseng-law-criminal-coverage-20261008/src/components/LocaleSuggestion.tsx:22) changes only the English text/link labels:

- Previous: “These columns are also available in English.” / “Read in English”.
- Current: “Browse our English-language articles.” / “English articles”.

The previous wording could imply an English counterpart to the article currently being read. The new wording accurately describes the English archive fallback without claiming identical content or a translation.

The existing expression at line 58 chooses a published English article link when the current article's index supplies one; otherwise it chooses `/en/columns`. I traced this through PublicColumnLanguageLinksContext.tsx:39–41 to public-guidance.ts:633–642, which returns links from the indexed published-language cluster. It does not manufacture the same-slug English article when the index lacks one. The new plural wording is also acceptable when a real English article link exists; it does not promise a false target.

The rendered Link at lines 98–100 uses `target.href` and the matching `hrefLang`. No navigation logic changed, and the suggestion does not automatically redirect.

## Dismissal and visibility

The Close control remains a separate `type="button"` with the English accessible label “Close”. Its click handler calls dismissLocaleSuggestion and sets the target to null; it does not activate or replace the article/archive link. The helper in reading-signals.ts:177–190 records dismissal in localStorage when available and tolerates storage errors. The component checks that stored dismissal before selecting a suggestion. If storage is unavailable, the immediate state-based dismissal still occurs; persistence across future mounts cannot be guaranteed in that case.

The existing first-screen/intro visibility guard and path check are unchanged. This is a static inspection of the actual implementation, not a claim that I exercised those states in a browser.

## Decision continuity and exclusions

The [candidate 2 content/source/editorial review](first40-final-review.md) carries forward unchanged to candidate 3 because all content hashes are identical. This addendum also passes the narrow English copy-to-link and dismissal relationship.

No new implementation or test was written. I inspected the existing language-link test source but did not rerun it or perform a browser/build run for this addendum. Root's reported QA/build/browser results remain root's evidence; this addendum does not independently certify them. The known broader-builder smoke failure is not called a pass here.

I did not read other reviewers' opinions. Broad five-country coverage, deferred legacy reclassification, and publication/technical gates remain outside completion. No second-batch work was started.

