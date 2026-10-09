# Independent review of the two SEO title repairs

Overall: PASS. The two metadata-only repairs preserve the articles' meaning and meet the source-defined title-length limit. No further editorial repair is requested.

Reviewer: `/root/sg_final_review`, independent of all three authors and the integrator; this reviewer did not change the articles. Completed 10 October 2026, 06:46 Asia/Taipei. Only this new report was written in this follow-up. This is an AI editorial result, not a human lawyer's opinion, publication confirmation or a claim that release tests have passed.

## Scope and exact changes

The authorised repair changes only line 3 (`seoTitle`) of two files under `/Users/son7/Documents/Codex/2026-10-09/new-chat/work/sg-release/repo/src/content/columns-en/`. Display titles, summaries, dates, body, citations, links, image paths, alt text, captions and internal provenance must remain unchanged.

| File:line | Previous exact text | Repaired exact text | Assessment, evidence and proposed action | Legal meaning preserved? |
|---|---|---|---|---|
| `499-singapore-arbitration-clause-taiwan-supply-contract.md:3` | `seoTitle: "Singapore Arbitration Clauses for Taiwan Supply Contracts"` | `seoTitle: "Singapore Arbitration for Taiwan Contracts"` | PASS. The shorter search title still identifies Singapore arbitration and its Taiwan-contract setting. It does not claim automatic enforcement or supply a universal clause. The unchanged display title specifically names a Taiwan supply contract, and the unchanged summary/body retain the contracting-party, assets, law-selection and recognition limits. Retain the repaired text. | Yes; no substantive conclusion changes. |
| `501-singapore-goods-taiwan-astep-origin.md:3` | `seoTitle: "ASTEP Origin Rules for Singapore Goods Sold to Taiwan"` | `seoTitle: "ASTEP Origin: Singapore Goods Sold to Taiwan"` | PASS. The shorter search title retains ASTEP origin, the Singapore seller/export setting and Taiwan destination. It makes no statement that all Singapore shipments qualify. The unchanged summary and opening expressly require origin verification and preserve possible refusal of tariff preference. Retain the repaired text. | Yes; no substantive conclusion changes. |

No new legal claim, licence, guarantee, byline or image-provenance statement was introduced. Current-law, locale, image and CTA conclusions from the earlier reports remain applicable because their underlying text and assets are unchanged.

## Independent byte verification and current seal

I read the actual current files and recomputed their SHA-256 values. In memory, I replaced the single new line 3 with the exact previous line. Each resulting full-file hash equals the earlier independently sealed hash. This proves that the SEO line is the sole byte change in each article; it does not rely on the integrator's assertion or a body-only comparison.

| Article | Previous full-file SHA-256 recovered by reverse substitution | Current SHA-256 | Current file modification time, Asia/Taipei | Result |
|---|---|---|---|---|
| 499 | `5198e9d36a01deae3f93702ed12d8b532a680e88efb1c17e578c4b65816594fc` | `7ba5cadc66c2cbab4a58741d9d9bf6ba25ebabdbdbd5388dff7ef708d4cd2f03` | 2026-10-10 06:46:15.499741 +08:00 | PASS |
| 500 | No change | `264409b0d0862ffdf478b060e6531b0e90f5b44841816b17a22e99063e1b3b64` | Earlier seal remains applicable | PASS, unchanged |
| 501 | `72122495bbb7cc26804b0d263c1b60fc38c24ecbf97f3edec83914295c4b7846` | `c0b3019db90b003bf8f176a893998d9c34a730b651cf1e0e1537652c3ab0cff4` | 2026-10-10 06:46:15.500019 +08:00 | PASS |

The refreshed `work/sg-release/integration-freeze.json`, frozen at 2026-10-10 06:46:27 +08:00, records these exact hashes; its SHA-256 is `d6ac0fa0ce8a66c58b4f899ad0758421bc2866b025ff75290702ed0ea4d5b0d7`. The current integration manifest SHA-256 is `140aa96c3a002d5cdebb05fc686c4f2da9d32ba5b8d1790a0fd75f86c313bf54`. These records were read as coordination evidence, not as substitutes for the direct byte check.

The historical `work/sg-release/integrated-final-review.md` remains untouched at SHA-256 `e0e93d06ac70a7a4b0f15119aaf9aa832d1ff756f73c526c7251aca56e5bae5b`. This report supplements its version seal for 499 and 501; it does not rewrite historical evidence or imply that the earlier hashes identify the repaired versions.

I also recomputed all three production image hashes. They still match the viewed versions in the earlier review: arbitration `fb9b9900ed64bac8958cd395d44b1cf142ecdb73869e4dc0a6eaf7975f31f712`; investment `6de65f0b068845440b280267600eefbb6451f8165c54bfa4a5dca8d409cc3249`; ASTEP `a9ba840b9c846d8e219e9fd42ee840a6ecba8641f12495190ffec120a7999258`.

## Actual title-length rule

The independent read-only helper `publication_image_surface` inspected the current renderer and test, and separately calculated the lengths with Node. English titles receive the exact 15-character suffix ` | Hovering Law` (`src/lib/seo.ts:142–145`, `src/app/[locale]/layout.tsx:94`). The column metadata selects `post.seoTitle` (`src/app/[locale]/columns/[slug]/page.tsx:123`). The corpus gate requires a SEO title of at least 30 characters and a rendered title no longer than 60 (`src/lib/__tests__/column-seo-title-frontmatter.test.ts:128–134`).

| Article | New SEO title characters | Including brand suffix | Gate |
|---|---:|---:|---|
| 499 | 42 | 57 | PASS, within 60 |
| 501 | 44 | 59 | PASS, within 60 |

These are direct source-rule and arithmetic checks, not a claim of a fresh test execution. The release QA lane owns rerunning the affected test and the broader required checks.

## Limits

No legal research, full locale review or image inspection was repeated because the precise preserved bytes and image hashes tie this narrow repair to the prior completed reviews. This is a bounded first repair pass with no unresolved mandatory finding. Build/test results, rendered desktop/mobile metadata and captions, deployment, final commit and public readback remain separate release evidence. Any further article or asset change requires review of the affected version.
