# review-r1 — fact-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide-2 (round 1, Claude Fable)

Review date: 2026-10-12. Reviewer did not write the drafts. Every URL below was opened independently with WebFetch on 2026-10-12; no memory used.

## Verdict

PASS. The single in-scope item (triage: FACTUAL 1) is a source-link language-version error, not a statute fact. verify.md cites no law.moj.gov.tw URL because none is involved; the official source is the Invest Taiwan portal itself, and I opened every URL verify.md cites. The fixer's verdict (PARTLY: ja ORIGINAL-RIGHT, ko/en/zh-hant CONFIRMED-ERROR) is correct. The corrections are supported, minimal, and consistent across languages. No blocking issues.

## Issue 1 — Invest Taiwan source link opened the Japanese-language page in ko, en, zh-hant

### URLs opened and what each page shows (2026-10-12)

1. https://investtaiwan.nat.gov.tw/showPage?lang=jpn&search=InvestmentStatus01
   - Body language: Japanese. Title 「投資臺灣入口網 Invest Taiwan_投資の設立_投資のフローチャート_外国人の出資者」. Breadcrumb 「ホーム > 投資の設立 > 投資のフローチャート > 外国人の出資者」. Heading 「外国人の出資者」. Sections 「ビジネスのタイプ」「投資申請プロセス」「ワンストップサービス」. Names 「經濟部投資審議司」 in the 投資許可 step.
   - Matches verify.md item 1.
2. https://investtaiwan.nat.gov.tw/showPage?lang=cht&search=InvestmentStatus01
   - Body language: 正體中文. Title 「投資臺灣入口網 Invest Taiwan_投資設立_投資程序_僑外商」. Breadcrumb 「首頁 > 投資設立 > 投資程序 > 僑外商」. Heading 「僑外商」. Sections 「經商型態」「投資申辦流程」(設立公司／設立商業／設立分公司／設立辦事處／一站式線上申請). Names 經濟部投資審議司 in the 投資許可 step. Language switcher: 正體中文 / English / 日文.
   - Matches verify.md item 2.
3. https://investtaiwan.nat.gov.tw/showPage?lang=eng&search=InvestmentStatus01
   - Body language: English. Heading "Overseas Chinese and Foreign Investment". Breadcrumb "Home > Business in Taiwan > How to Invest > Overseas Chinese and Foreign Investment". Sections "Business Type" (incl. "Comparison of a Subsidiary, a Branch Office and a Representative Office"), "Investing Procedures", "One Stop Online Application". Names the Department of Investment Review, MOEA. Language switcher: 中文 / English / 日文.
   - Matches verify.md item 3.
4. https://investtaiwan.nat.gov.tw/showPage?lang=kor&search=InvestmentStatus01
   - Serves the 正體中文 page (heading 「僑外商」, breadcrumb 「首頁 > 投資設立 > 投資程序 > 僑外商」). No Korean version exists in the language switcher (正體中文 / English / 日文 only).
   - Matches verify.md item 4.

Sentence checked against each page: the entry is cited for the business-form comparison (subsidiary / branch / representative office) and the foreign-investment application procedure before 經濟部投資審議司. All three language versions carry that content under the same page id (InvestmentStatus01); only the body language differs. The labels in all four columns are the column's own description, not a quoted page title, so they remain accurate after the URL change.

### Per-language result

- ko — CONFIRMED-ERROR, correctly fixed. Live: `lang=jpn` under a Korean label. Draft: `lang=cht`. The site has no Korean version; the 正體中文 original is what the portal itself serves for an unsupported language code, every other entry in the ko sources list opens a Chinese-language official page, and the ko body quotes 經濟部投資審議司 in parentheses, which appears verbatim on the cht page. `lang=eng` would also have been defensible; choosing cht is not an over-correction. Label 「Invest Taiwan 외국인투자 개요」 unchanged. lastmod was already "2026-10-12" in the live file and stays so.
- ja — ORIGINAL-RIGHT. `lang=jpn` opens the Japanese page for a Japanese column. Draft identical to live (diff empty). lastmod stays "2026-10-06". Correct to leave untouched.
- en — CONFIRMED-ERROR, correctly fixed. Draft: `lang=eng`, which opens the English page "Overseas Chinese and Foreign Investment". Label "Invest Taiwan Overview of Foreign Investment" unchanged. lastmod "2026-07-25" → "2026-10-12".
- zh-hant — CONFIRMED-ERROR, correctly fixed. Draft: `lang=cht`, which opens 「僑外商」. Label 「投資台灣入口網外國人投資說明」 unchanged. lastmod "2026-07-25" → "2026-10-12".

### REMOVED-URL accounting

Three REMOVED-URL lines in verify.md (ko, en, zh-hant), each naming the old `lang=jpn` URL, its replacement and the reason. The same page (InvestmentStatus01) is still cited in all four languages; the sources list keeps 13 entries in every language. No entry dropped.

## Correctness (check 2)

No statute text is quoted or paraphrased by this fix. Nothing in the body, FAQ, summary, headings, numbers or article references changed in any language (confirmed by diff). Consistency across languages: all four columns now cite the same portal page in the language the site offers for that column (ja→jpn, en→eng, zh-hant→cht, ko→cht as the fallback the site itself uses).

## Scope (check 3)

`diff -u orig-*.md draft-*.md` per language:

- ko: one line changed (sources list URL `lang=jpn` → `lang=cht`). Nothing else.
- ja: no difference.
- en: two lines changed (frontmatter lastmod; sources list URL `lang=jpn` → `lang=eng`). Nothing else.
- zh-hant: two lines changed (frontmatter lastmod; sources list URL `lang=jpn` → `lang=cht`). Nothing else.

factguard re-run by me on 2026-10-12: body characters changed 3 / 3 / 3 (ko / en / zh-hant), ja unchanged, FACTGUARD: PASS. No new facts introduced.

## Language (check 4)

No prose sentence was edited in any language, so there is nothing to assess for register or translationese. Labels unchanged and already native (ko 합니다체 body intact, ja です・ます intact, zh-hant Taiwan usage intact, en plain).

## Tests (check 5)

tests.patch touches only the three pinned-text tests of this column:

- columns-en-investment-011.test.ts: officialLinks entry URL `lang=jpn` → `lang=eng`; `lastmod` and `date` "2026-07-25" → "2026-10-12".
- columns-ko-investment-011.test.ts: officialSources entry URL `lang=jpn` → `lang=cht`. ko lastmod assertion untouched because the live ko file already carried "2026-10-12".
- columns-zh-investment-011.test.ts: officialSources entry URL `lang=jpn` → `lang=cht`; `lastmod` and `date` "2026-07-25" → "2026-10-12".

The URL arrays still lock the exact corrected link (the assertion loops over every source and checks presence), so the fact remains locked. No `.skip` / `.only` (grep: no matches). ja test untouched, consistent with the unchanged ja draft. vitest-1.log: Test Files 79 passed (79), Tests 1377 passed (1377).

Tests verdict: PASS.

## Blocking issues

None.

## Tiny edits made by reviewer

None. No draft file was modified in this review.

## Out of scope, noted for the record (not blocking)

- issues.md items not marked FACTUAL by triage (read_time 9분 vs computed 8분, sources-section house format, stock disclaimer paragraph, legal numbers carried over without re-verification) were not touched by the fixer and were not re-verified here, matching the triage scope.
- The ko body already uses 2026-10-12 as lastmod, so this fix does not change the ko date; that is consistent with the ko test and the live file.

VERDICT: PASS
