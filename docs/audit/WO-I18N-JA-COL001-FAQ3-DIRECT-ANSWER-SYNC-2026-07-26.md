# WO-I18N-JA-COL001-FAQ3-DIRECT-ANSWER-SYNC — 最低資本金FAQの直接回答

Date: 2026-07-26 KST
Manager: Codex `/root`
Locale: Japanese (`ja-JP`)
Micro-scope: column 001, FAQ 3 answer opening, two sentences only

## Goal

確定済みの韓国語版column 001 FAQ 3回答冒頭の2文を、日本語版FAQ 3の
回答冒頭へ、既に検収済みの日本語本文と同じ2文で同期する。翻訳と既存
訳文の再利用だけを行い、新たな法的調査、法的レビュー、解釈、助言
または事実追加は行わない。

## Fixed source

- Korean file:
  `src/content/columns/001-taiwan-company-establishment-basics.md`
- finalized commit:
  `fe07b9d9bd304e6a2cd5b80c1728dc9dc4078b0a`
- exact source: FAQ 3 answer's first two sentences at that commit

The fixed Korean source is:

`회사 설립 자체에 일률적으로 적용되는 법정 최저자본금은 없습니다. 다만 업종별 최저자본금, 사업계획의 합리성, 은행심사와 취업허가상 고용주 요건은 별도로 확인해야 합니다.`

The required, already reviewed Japanese target is:

`会社設立自体について一律の法定最低資本金があるわけではありません。ただし、業種別の最低資本額、事業計画の合理性、銀行審査および就業許可上の雇用主要件は別途確認が必要です。`

The same Japanese two-sentence text already appears in the article body under
`**5. 最低資本金の制限はありますか？**`. The FAQ insertion must repeat it
exactly; do not retranslate, paraphrase, or revise either occurrence.

## Owned implementation files

1. `src/lib/__tests__/columns-ja-investment-001-faq3-direct-answer-sync.test.ts`
   (new)
2. `src/content/columns-ja/001-taiwan-company-establishment-basics.md`
   - only the empty FAQ 3 insertion slice defined below

Do not edit any existing byte, the body occurrence, frontmatter outside the
empty insertion slice, heading, image, surrounding answer text, existing test,
other locale, shared code, archive/search data, or embedding. Do not stage,
add, commit, push, deploy, publish, or operate shared servers.

## Exact insertion boundary

Insert the required two Japanese sentences immediately after the opening
double quote in the exact FAQ 3 scalar prefix:

`    a: "`

and immediately before this exact immutable tail marker:

`外国投資事業の外国籍主管に関する就業許可では、`

The relevant opening quote is the one directly beneath:

`  - q: "就業許可証と居留証を取得するには最低資本金が必要ですか？"`

The insertion slice is currently empty. Preserve bytes `0..1484` exactly:

- immutable prefix: `1484` UTF-8 bytes
- SHA-256:
  `49594f72459770639bc2f1e68cb82a6130c1e5c6448230586ad4d954173da665`

Preserve the tail marker through EOF exactly:

- immutable tail: `13669` UTF-8 bytes
- SHA-256:
  `7d96596aebe30170142c1dd51bc914e5ffe021269e30c58b08a9e77adbecb08b`

Insert exactly the fixed Japanese target above as one continuous YAML
double-quoted scalar fragment. The mutable slice must contain exactly two
non-empty Japanese prose sentences, with no leading or trailing space and no
newline. The first existing character of the preserved tail must immediately
follow the inserted `。`.

## Translation constraints

- Reuse the fixed, already reviewed Japanese target verbatim.
- Preserve the direct answer that company establishment itself has no
  uniformly applicable statutory minimum capital.
- Preserve all four separately checked considerations: industry-specific
  minimum capital, business-plan reasonableness, bank review, and employer
  requirements for work permits.
- Preserve the distinction between company-establishment capital and the
  work-permit employer requirements explained by the following existing FAQ
  text.
- Do not alter the existing body repetition or following FAQ explanation.
- Do not add or remove a space at either insertion boundary.
- Do not add legal conclusions, statutory references, recommendations,
  marketing, greetings, personal names, first-person text, or calls to action.
- Reject Hangul, U+200B, U+FEFF, U+00A0, carriage returns, line breaks,
  leading or trailing whitespace, and invisible characters within the
  insertion.

## Deterministic RED/GREEN test

The focused test must read the Japanese Markdown as raw bytes and use
independently declared constants. It must not use network calls, snapshots,
production-copy imports, loader-derived expectations, or fixtures derived
from the implementation text.

1. Lock bytes `0..1484` to the prefix length and SHA-256 above.
2. Locate the exact tail marker and lock marker-to-EOF to the tail length and
   SHA-256 above.
3. Treat only the bytes between offset `1484` and the tail marker as mutable.
4. Assert that the mutable slice equals the fixed Japanese two-sentence target
   exactly, with no leading or trailing whitespace or newline.
5. Assert the two-sentence shape and the required meanings with bounded
   Japanese literals: no uniform statutory minimum capital, plus
   industry-specific minimum capital, business-plan reasonableness, bank
   review, and work-permit employer requirements.
6. Assert that the same fixed two-sentence target occurs exactly twice in the
   complete file: once in FAQ 3 and once in the existing body.
7. Reject prohibited additions, Hangul, and invisible characters only within
   the insertion slice.

RED must fail only because the required FAQ opening is absent while both
immutable boundary fixtures and the single existing body occurrence pass.
GREEN must pass after changing only the owned FAQ insertion slice.

## Roles and gates

1. Terra writes and runs the focused test to demonstrate deterministic RED.
2. Grok verifies the fixed two-sentence Japanese text for concise natural
   Japanese only; Grok performs no research and edits no files.
3. Terra inserts only the approved two-sentence scalar fragment and
   demonstrates GREEN.
4. An independent Terra reviewer checks source-to-target fidelity and exact
   FAQ/body repetition, without conducting new legal review.
5. An independent Grok reviewer checks natural Japanese, terminology, and
   absence of translation artifacts.
6. Codex reviews the final scoped diff and reruns the focused and existing
   column 001 tests, typecheck, scoped lint, `git diff --check`, and a clean
   unique build.
7. Codex verifies the rendered Japanese route on desktop and mobile: HTTP
   200, FAQ 3 direct-answer placement and text, unchanged following answer and
   article body, no console/page errors, and no horizontal overflow.

No push or deploy.
