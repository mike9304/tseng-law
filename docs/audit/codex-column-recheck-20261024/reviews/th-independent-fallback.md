# TH704 — independent review of the minimal fallback

Verdict: **PASS for the specifically bounded image metadata and legal-condition change**, at source SHA-256 `674844f1ddfeb2322fee8ab41cf43ba990a5b8e6bbbec9be63c14ca558a12afa`. The unchanged variety CLI returns exit 0, no FAIL, with a genuinely new independently approved sentence map. This is **not a full-style PASS** or a claim that the user's criticism of the published Thai prose has been resolved. The substantive rewrite remains held with its recorded CV failure.

Reviewer: `/root/review_rev2_th`, independent AI Thai editorial reviewer. Root constructed this candidate. I did not edit the manuscript, original review evidence, checker, profile or thresholds. No human native-speaker or lawyer certification, public-rendering result or publication outcome is claimed.

## Three distinct versions

| Version | SHA-256 | Status |
|---|---|---|
| Original published manuscript, baseline `174454bd4bb8d9e05627d71f9ef0af646540b3e4` | `680b7c2e7e9d8653f15c8b0e8ec46392ca122c270a73dbd1a952eea3bb3b18f0` | Existing published prose; actual baseline CLI rerun exit 0. |
| Held substantive rewrite r3 | `02b683edd2ca82768aa766fbcf299529d943eaa9f1646f1e72bf1a57b564f7d7` | REQUEST_CHANGES remains: CV 0.434 < 0.45, actual exit 1. Preserved at `work/held/704-th-rewrite-r3-not-published.md`. |
| Current minimal fallback | `674844f1ddfeb2322fee8ab41cf43ba990a5b8e6bbbec9be63c14ca558a12afa` | Bounded PASS: three image fields and one legal qualifier; actual exit 0. |

Source path: `repo/src/content/columns-th/704-taiwan-arc-first-application.md` under `/Users/son7/tseng-arc-revision-20261024`.

`work/reviews/th-independent.md`, the r3 boundary approval/maps and `th-boundaries/independent-cli-r3.json` were not overwritten. This fallback result does not convert the failed rewrite into a PASS. 705/706 were not changed or newly reviewed as part of this fallback task.

## Exact scope verified

I read the complete baseline diff and current frontmatter/FAQ. Byte reconstruction proves that removing the three `featured_image`, `featured_image_alt` and `featured_image_caption` lines and reversing one phrase replacement reproduces the original published source bytes exactly. There are no other title, summary, FAQ, heading, date, source, body or route changes.

At current line 53, `ชาวไต้หวันที่มีทะเบียนราษฎรในไต้หวัน` becomes `ชาวไต้หวันที่พำนักและมีทะเบียนราษฎรในไต้หวัน`. The Taiwanese spouse must therefore reside in Taiwan as well as have household registration there. The first sentence still requires marriage registration evidence. The next sentence retains the Taiwanese spouse's first-application attendance and the one-year first card. The foreign-spouse sentence remains unchanged. The added Thai qualifier is grammatical and does not introduce a new procedural promise.

I independently verified both residence and household registration on 2026-10-24 in [NIA 0902, Required Documents 3(1)(d)(i)](https://www.immigration.gov.tw/5475/5478/141465/141808/141970), and [the residence regulation Article 12(1)(4)](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129). This is a substantive completion of the condition, not a cosmetic synonym change. The successful full-regulation read is distinct from the direct-article URL that failed earlier.

The three image fields are byte-identical to the independently inspected held revision. The referenced WebP is `/images/columns/taiwan-arc-first-application-20261024-v2.webp`, previously visually reviewed as an illustrated still life with a blank travel booklet, document folder/papers, plain card and pen, and Taipei through a window. The Thai alt describes those principal objects and the caption clearly identifies illustration rather than an actual card/application. No duplicate inline image or public author/reviewer claim was introduced.

All 16 unique linked URLs remain. No Arabic numeral token is lost; the only addition is `20261024` in the image filename. The single body insertion contains no number, so all existing Thai-written numbers and other body bytes are preserved. `git diff --check` returns exit 0. Exact scope reconstruction and preservation evidence are in `th-boundaries/fallback/independent-scope-verification.json` and `independent-preservation.json`.

## Original evidence located, then new independent approval

The actual original approved map was found at:

`/Users/son7/tseng-arc-visas-20261024/repo/docs/audit/variety-segments/680b7c2e7e9d8653f15c8b0e8ec46392ca122c270a73dbd1a952eea3bb3b18f0.json`

Its approval manifest and immutable original independent/author report hashes all match. I read all 21 paragraph rows and 57 sentence slices, plus the original review's 704 reasoning. Old content approval was not treated as proof that the user's later style concern was addressed.

Only measured paragraph P9 changes in the fallback. `พำนักและ` joins two attributes inside its existing first sentence; splitting there would sever a relative clause. The remaining two P9 sentences and every other original boundary are unchanged. I approved this new exact source independently using method `independent_review`, with zero unresolved boundaries. Historical author adjudication is identified as historical evidence; no new author approval was fabricated.

Current approved map:

`work/reviews/th-boundaries/fallback/704-fallback.sentences.json`

- Map SHA-256: `fed3b8ef0a11aa3b8d73f98a3df389f51b103289f74884c347bb34b7e05afd01`
- Canonical paragraphs SHA-256: `2a27a608474eabf241d5fc95b70eb528525ec108612ea63f14aebb6746c90c8b`
- Approval manifest: `th-boundaries/fallback/independent-approval.json`
- Manifest SHA-256: `9b81ae3d5dd65b7680973c3d5a0cfb9d64ff26daeac9a6a7e564e619a1e817bb`

The fallback directory includes the exact original approval dependencies, new independent boundary report and root-scope snapshot. Preserve the directory's relative binding chain when integrating it. A subsequent source change invalidates this approval.

## Actual unchanged CLI, baseline and candidate

For each exact source:

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <source> --sentences <corresponding approved map>`

| Version | Sentences | CV | Short share | Even runs | Citation endings | Contrast | Exit |
|---|---:|---:|---:|---:|---:|---:|---:|
| Published baseline | 57 | 0.530 | 0.088 | 0.055 | 0.000 | 3 | 0 |
| Minimal fallback | 57 | 0.530 | 0.088 | 0.055 | 0.000 | 3 | 0 |

Both actual commands print `OK — no variety limit violated`. Exact command arrays, stdout, stderr, source/map hashes are saved in `th-boundaries/fallback/independent-cli.json`. Equal displayed metrics are the checker's rounded output; they do not imply that the legal insertion changed no words. The approved boundary count is unchanged.

The result clears the limited image/legal correction. The existing directive rhythm and checklist-style material remain because the body otherwise matches the published original. The held rewrite's failure and the remaining full-style task must stay visible in the root disposition; neither is resolved by this fallback PASS.
