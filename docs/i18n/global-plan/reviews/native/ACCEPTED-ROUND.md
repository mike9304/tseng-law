# ACCEPTED-ROUND — standing supervisor decisions for the multi-round native-quality campaign (Fable 5.1, 2026-09-22)

Applies to every locale and every round of the campaign (rounds r1–r5, all 45 guidance locales). The fixer applies every P1 and P2 row of the round's review files unless a row falls under a skip rule below; P3 rows when cheap. RULEBOOK-FIX.md (R1–R17) applies in full.

## Rows to SKIP (rules of the product or of the checker — do not "fix" these)
- Frontmatter `url:` containing Hangul → skip (canonical source metadata, never rendered).
- The pinned bio figure "TWD 1.57M" → keep byte-identical (a test pins it).
- Requests for space thousands separators ("500 000"), lakh/crore grouping, or adding a Gregorian year next to a Republic-of-China year → skip (the checker cannot parse them); write the ROC year per R13 instead.
- Requests to merge/split paragraphs, headings, list items or table rows, to add new headings, or to change image paths, external links, numbers or dates → rephrase inside the existing block instead.
- Requests to add statements about the law of the reader's country → R2 neutral generalization instead.
- Requests to make a consultation-language / interpreter / reply-time / free-consultation / result sentence positive → never; only its wording may be made more natural.
- Requests to change the team member names, firm names, university names or Chinese glosses → skip (proper names); only fix a wrong or missing gloss.
- Requests to translate the four consultation language names differently from the locale's own established form → keep one consistent form across the pack and columns.

## Always
- One consistent formal register per locale; feminine forms for attorney Wei Tseng where the language marks gender; the male manager (008) and male client (010) stay male.
- Systemic patterns listed in a review's verdict are swept across all 18 columns and the pack, not only the quoted instance.
- After editing, run the checker and the tests named in the work order; if a number/date format change breaks the checker, keep the previous form for that item and note it in the log.

## llms.txt notice block (added after round 2, ar/zh-hans gate failures)
- `GUIDANCE_LLMS_NOTICES.<loc>.discoveryNotice` must keep the literal token `llms.txt` (a test pins it); rephrase around it.
- `consultationNotice` must remain a verbatim substring of one FAQ answer of the pack, and `confidentialNotice` a verbatim substring of a privacy-page paragraph. If you rewrite the FAQ/privacy sentence, rewrite the notice identically (or leave both).
- Page `description` strings (home/services/about/lawyers/pricing/contact/faq/privacy/disclaimer/columns) and the lawyers/answers descriptions must not contain parentheses, brackets, `#`, `|`, backticks or angle brackets — the llms.txt catalog strips them and a test compares the bullet with the description verbatim. Write "socio auditor, Partner CPA," not "socio auditor (Partner CPA)".
- Disclosure parity: if you reword a sentence that carries a disclosure element (contact "feasible method only", columns "not the consultation step", privacy/disclaimer notices …), update your locale's regex line in `src/data/__tests__/guidance-disclosure-parity.test.ts` in the same edit and re-run that test — it pins one regex per locale per element.
