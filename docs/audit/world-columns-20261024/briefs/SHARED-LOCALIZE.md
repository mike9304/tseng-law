# Task: remove the Korea frame from shared translated columns (minimal edits)

The site's shared columns 007 (divorce Q&A), 008 (severance on dismissal) and 009 (voluntary resignation and severance) were first written for Korean readers and then translated into many languages. Some translations still compare Taiwan with Korea ("unlike some jurisdictions, for example Korea…", "families tied to Korea and Taiwan", "Korean living costs"). For a reader in Poland, Mongolia or Brazil this comparison is irrelevant.

Files: `shared/<locale>/007-*.md`, `008-*.md`, `009-*.md` (copies; you edit these copies in place).

For each assigned locale:
1. Find every sentence, clause, FAQ answer, table cell or caption that mentions Korea / Korean law / Korean nationals / a Korea–Taiwan pairing.
2. Rewrite only that sentence or clause so the Taiwan rule stands on its own, in natural language of that locale. Example (English): "No. Unlike some jurisdictions, for example Korea, Taiwan requires a company to pay severance only when…" → "No. In Taiwan a company must pay severance only when…". "families tied to more than one country or region, such as Korea and Taiwan" → "families tied to Taiwan and another country or region".
3. Preserve exactly every Taiwan legal statement, article number, link, condition, number and exception. Do not touch any other sentence, the frontmatter (except a FAQ answer that contains the Korea comparison), headings without Korea, or formatting. Do not add bold. Do not change dates (published/lastmod stay as they are).
4. If a file has no Korea reference, leave it byte-identical.
5. Append to `shared/CHANGES-<locale>.md`: for each change, file, the exact original text, the replacement, and one line confirming the Taiwan legal meaning is unchanged. If nothing changed in that locale, write "no Korea references".

Do not edit anything outside `shared/<locale>/` and `shared/CHANGES-<locale>.md` for your assigned locales. Do not run git.
