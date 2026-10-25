# Independent publication review

Read `work/AUTHOR-BRIEF.md`, the editorial skill and `references/review-criteria.md`, repo AGENTS and complete editorial voice/variety/LESSONS. You did not author the assigned articles. Preserve manuscript files: report findings; author applies bounded repairs. You are not alone; own only your assigned review records.

## Locale reviewer

Read the actual complete assigned articles, metadata/FAQ/caption, corresponding research and author evidence. Compare three actual recent same-language articles and record paths/dates and concrete differences. Delete each of the first two paragraphs mentally and identify information lost or removable padding. Examine every paragraph for natural register, legal terminology, repeated shape, rhetorical filler, forced contrast, false country assumptions, numbers, qualifiers, publication dates and actual consultation-language boundaries. All bold markup is prohibited. If something would require a factual change, flag it with the exact sentence and source; do not silently make legal changes for style.

Actually inspect both assigned image files. Evaluate relevance, fictional/non-identifying scene, absence of readable documents/logos/faces/flags, localized alt and caption. Record the final image SHA. Run the original shared variety checker for supported locales and record real output. For fil/he/nl/pl/cs/lt, run the original to preserve the unsupported result and await root's independently reviewed task-local extension; never call unsupported exit 2 a PASS. §5 self-check is substantive, not just a metric.

Return PASS only when no material issue remains. If REQUEST_CHANGES, use `file:line | exact sentence | reason/evidence | proposed rewrite | legal meaning preserved?`. Monotony findings use MONOTONY format. Send findings directly to the author and root. Author repairs; you re-read the changed passages and affected conclusions. At most two unsuccessful repair rounds, then preserve and report. Record final full-source SHA including metadata and dates.

## Final legal/factual reviewer

Fresh independent role, different from authors and locale reviewers. Read exact source files, source ledgers and actual locale reports. Open official current law and history/commencement for consequential claims. Check jurisdiction, company/work category, AND/OR conditions, legal burden, tax treaty exceptions, time triggers and periods, money/currency, factual market statements, CTA and service scope, internal links, omission of public authorship, duplication and image caption/alt. Research or locale PASS does not replace your review. Source access failures/alternative official records must be disclosed; an official search snippet alone must not support a consequential legal conclusion.

Final PASS must bind current article SHA and locale review report SHA, with no unresolved material findings. No claims of licensed lawyer/human native-speaker review. Use same bounded repair loop with authors and affected locale reviewer; author revisions may require renewed locale PASS.

## Machine-readable report shape

Write human-readable `<locale>-locale.md` / `<group>-final.md` and matching JSON under `work/reviews/`. These are internal evidence, not reader content.

```json
{
  "reviewer": "canonical agent name",
  "role": "locale or final",
  "independentOfAuthor": true,
  "checkedAt": "actual ISO date/time",
  "records": [
    {
      "source_path": "src/content/columns-xx/NNN-slug.md",
      "sha256": "full-file SHA-256",
      "verdict": "PASS or REQUEST_CHANGES",
      "findings": [],
      "locale_report": "work/reviews/xx-locale.json",
      "locale_report_sha256": "required for final PASS",
      "image_sha256": "actual WebP SHA",
      "variety_command": "actual command",
      "variety_exit_code": 0,
      "limitations": []
    }
  ],
  "limitations": []
}
```

Omit locale_report fields for locale review. Reports may add evidence but retain these names. Do not put PASS into records before the current version has actually been reviewed. Review does not authorize a new publication; root already has user authorization and will validate actual deployment separately.
