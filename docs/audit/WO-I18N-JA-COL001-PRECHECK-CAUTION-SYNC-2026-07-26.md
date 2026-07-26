# WO-I18N-JA-COL001-PRECHECK-CAUTION-SYNC — 予備審査通過後の注意文補完

Date: 2026-07-26 KST
Manager: Codex `/root`
Locale: Japanese (`ja-JP`)
Micro-scope: column 001, one precheck caution sentence only

## Goal

確定済みの韓国語版column 001第73行の第2文を、日本語版の手続一覧直後へ
自然で簡潔な日本語1文として忠実に翻訳する。翻訳だけを行い、新たな
法的調査、法的レビュー、解釈、助言または事実追加は行わない。

## Fixed source

- Korean file:
  `src/content/columns/001-taiwan-company-establishment-basics.md`
- finalized commit:
  `fe07b9d9bd304e6a2cd5b80c1728dc9dc4078b0a`
- exact source: line 73, second sentence at that commit

The fixed Korean source is:

`예비심사를 통과했다는 사실은 그 업종에 필요한 별도 허가를 이미 받았거나 예정 장소에서 바로 영업할 수 있다는 뜻이 아닙니다.`

The Japanese sentence must convey only these source meanings:

1. Passing the preliminary review does not mean that a separately required
   permit for the relevant line of business has already been obtained.
2. Passing the preliminary review also does not mean that business may begin
   immediately at the planned location.

## Owned implementation files

1. `src/lib/__tests__/columns-ja-investment-001-precheck-caution-sync.test.ts`
   (new)
2. `src/content/columns-ja/001-taiwan-company-establishment-basics.md`
   - only the empty insertion slice defined below

Do not edit any existing byte, frontmatter, heading, image, list item,
surrounding paragraph, existing test, other locale, shared code,
archive/search data, or embedding. Do not stage, add, commit, push, deploy,
publish, or operate shared servers.

## Exact insertion boundary

Insert content immediately after this exact existing list item:

`10. 輸出入、業種別許認可、就業許可・居留等の追加手続（該当する場合）`

and immediately before this exact immutable tail marker:

`\n\n上記は理解のための概要であり、`

The insertion slice is currently empty. Preserve bytes `0..8247` exactly:

- immutable prefix: `8247` UTF-8 bytes
- SHA-256:
  `d65aa68096453a3e90cef085e963d682260308accf2244cfba6139f12b2171c0`

Preserve the tail marker through EOF exactly:

- immutable tail: `7161` UTF-8 bytes
- SHA-256:
  `641714d4a59529671f1982ca22448230bf8e3a250d1de06810ea33eab477fd5d`

Insert exactly `\n\nS1`, where `S1` is one non-empty Japanese prose sentence.
The mutable slice must begin with exactly two line-feed bytes and end with
`。`, with no trailing newline or whitespace. The preserved tail already
begins with `\n\n`, so the rendered Markdown structure must be:

1. existing item 10
2. one blank line
3. the new one-sentence prose paragraph
4. one blank line
5. the existing paragraph beginning `上記は理解`

Do not add a heading, list item, blockquote, link, image, HTML, citation, or
extra spacer.

## Translation constraints

- Use precise, neutral professional Japanese suitable for an informational
  law-firm article.
- Preserve the source's two distinct cautions: a separately required
  industry permit has not thereby already been obtained, and immediate
  operation at the planned location is not thereby authorized.
- Keep the preliminary-review event as the shared premise for both cautions.
- Do not broaden the sentence to other approvals, locations, registration
  stages, investment review, banking, tax, employment, or residence matters.
- Do not turn the source into an absolute legal conclusion or add a statutory
  reference, recommendation, marketing, greeting, personal name,
  first-person text, or call to action.
- Reject Hangul, U+200B, U+FEFF, U+00A0, carriage returns, trailing
  whitespace, additional line breaks, and invisible characters within the
  insertion.

## Deterministic RED/GREEN test

The focused test must read the Japanese Markdown as raw bytes and use
independently declared constants. It must not use network calls, snapshots,
production-copy imports, loader-derived expectations, or fixtures derived
from the implementation text.

1. Lock bytes `0..8247` to the prefix length and SHA-256 above.
2. Locate the exact tail marker and lock marker-to-EOF to the tail length and
   SHA-256 above.
3. Treat only the bytes between offset `8247` and the tail marker as mutable.
4. Assert the exact `\n\nS1` shape: exactly two leading line feeds followed
   by one non-empty Japanese prose sentence ending in `。`, with no other
   line break or trailing whitespace.
5. Assert the preliminary-review premise and both required cautions with
   bounded Japanese literals or explicit semantic alternatives: the
   separately required industry permit has not already been obtained, and
   immediate operation at the planned location is not established.
6. Assert that concatenating the preserved prefix, mutable slice, and
   preserved tail yields the required list/paragraph/paragraph Markdown
   structure.
7. Reject prohibited structure, additions, Hangul, and invisible characters
   only within the insertion slice.

RED must fail only because the required sentence is absent while both
immutable boundary fixtures pass. GREEN must pass after inserting only the
owned `\n\nS1` slice.

## Roles and gates

1. Terra writes and runs the focused test to demonstrate deterministic RED.
2. Grok drafts only the single Japanese sentence from the fixed Korean
   source; Grok performs no research and edits no files.
3. Terra inserts only the approved `\n\nS1` slice and demonstrates GREEN.
4. An independent Terra reviewer checks source-to-target fidelity and
   confirms that neither caution was omitted, weakened, or supplemented.
5. An independent Grok reviewer checks concise natural Japanese,
   terminology, and absence of translation artifacts.
6. Codex reviews the final scoped diff and reruns the focused and existing
   column 001 tests, typecheck, scoped lint, `git diff --check`, and a clean
   unique build.
7. Codex verifies the rendered Japanese route on desktop and mobile: HTTP
   200, sentence placement and meaning, unchanged surrounding content, no
   console/page errors, and no horizontal overflow.

No push or deploy.
