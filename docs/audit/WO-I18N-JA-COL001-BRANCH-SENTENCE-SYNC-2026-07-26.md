# WO-I18N-JA-COL001-BRANCH-SENTENCE-SYNC — 支店取引説明の補完

Date: 2026-07-26 KST
Manager: Codex `/root`
Locale: Japanese (`ja-JP`)
Micro-scope: column 001, one branch sentence only

## Goal

確定済みの韓国語版column 001の支店詳細段落末尾の1文を、日本語本文の
指定された既存段落末尾へ自然で簡潔な日本語1文として忠実に翻訳する。
翻訳だけを行い、新たな法的調査、法的レビュー、解釈、助言または事実
追加は行わない。

## Fixed source

- Korean file:
  `src/content/columns/001-taiwan-company-establishment-basics.md`
- finalized commit:
  `fe07b9d9bd304e6a2cd5b80c1728dc9dc4078b0a`
- exact source: the final sentence of the detailed branch paragraph
  (currently line 37), beginning
  `본점과 대만 지점 사이의 자금 이동이나 이익 송금`

The Japanese sentence must convey only this source meaning:

1. Do not presume that fund transfers or profit remittances between the head
   office and its Taiwan branch, or their accounting and tax treatment, are
   the same as a subsidiary dividend structure.

## Owned implementation files

1. `src/lib/__tests__/columns-ja-investment-001-branch-sentence-sync.test.ts`
   (new)
2. `src/content/columns-ja/001-taiwan-company-establishment-basics.md`
   - only the empty insertion slice defined below

Do not edit any existing byte, frontmatter, heading, image, surrounding
sentence or paragraph, existing test, other locale, shared code,
archive/search data, or embedding. Do not stage, add, commit, push, deploy,
publish, or operate shared servers.

## Exact insertion boundary

Insert content immediately after this exact existing sentence:

`外国会社の台湾支店は独立した法人格を持たず、外国会社の一部として台湾で営業します。支店自体に株主を置く形態ではなく、本店がその債務・責任を負います。`

and immediately before this exact immutable tail marker:

`\n\n**3. 代表者事務所：**`

The insertion slice is currently empty. Preserve bytes `0..6238` exactly:

- immutable prefix: `6238` UTF-8 bytes
- SHA-256:
  `3112d55cc2c08dfddf29c5b429b1b23a70bbc1c2b35ed78216f2bb1d7c04d241`

Preserve the tail marker through EOF exactly:

- immutable tail: `8711` UTF-8 bytes
- SHA-256:
  `955a891444ba81096203fe0dbbe815e42416200ddbfd2aa365b11c09440d9072`

Insert exactly one non-empty Japanese prose sentence `S1`, with no leading
whitespace and no newline inside or after the mutable slice. The preserved
tail supplies the existing `\n\n` paragraph separator, so `S1` remains in
the same branch paragraph. Do not add a heading, new paragraph, list,
blockquote, link, image, HTML, citation, or spacer.

## Translation constraints

- Use precise, neutral professional Japanese suitable for an informational
  law-firm article.
- Preserve all four transaction or treatment categories: fund transfers
  between the head office and Taiwan branch, profit remittances, accounting
  treatment, and tax treatment.
- Preserve the source's caution that these must not be presumed to be the
  same as a subsidiary dividend structure.
- Do not broaden the comparison to unrelated transactions, turn the caution
  into an absolute legal conclusion, or add a statutory reference,
  recommendation, marketing, greeting, personal name, first-person text, or
  call to action.
- Reject Hangul, U+200B, U+FEFF, U+00A0, carriage returns, line breaks,
  leading or trailing whitespace, and invisible characters within the
  insertion.

## Deterministic RED/GREEN test

The focused test must read the Japanese Markdown as raw bytes and use
independently declared constants. It must not use network calls, snapshots,
production-copy imports, loader-derived expectations, or fixtures derived
from the implementation text.

1. Lock bytes `0..6238` to the prefix length and SHA-256 above.
2. Locate the exact immutable tail marker at offset `6238` in RED; after
   insertion, locate it as the first bytes following the mutable sentence and
   lock the full marker-to-EOF length and SHA-256 above.
3. Treat only the bytes between offset `6238` and the immutable tail as
   mutable.
4. Assert the exact single-sentence `S1` shape: one non-empty Japanese prose
   sentence ending in `。`, with no leading whitespace, internal or trailing
   newline, or trailing whitespace.
5. Assert the head-office/Taiwan-branch relationship, all four required
   categories, the subsidiary dividend structure comparison, and the
   prohibition on presuming equivalence with bounded Japanese literals or
   explicit semantic alternatives.
6. Reject prohibited structure, additions, Hangul, and invisible characters
   only within the insertion slice.

RED must fail only because the required sentence is absent while both
immutable boundary fixtures pass. GREEN must pass after inserting only the
owned sentence slice.

## Roles and gates

1. Terra writes and runs the focused test to demonstrate deterministic RED.
2. Grok drafts only the single Japanese sentence from the fixed Korean
   source; Grok performs no research and edits no files.
3. Terra inserts only the approved `S1` slice and demonstrates GREEN.
4. An independent Terra reviewer checks source-to-target fidelity and confirms
   that no meaning was omitted, weakened, or added.
5. An independent Grok reviewer checks concise natural Japanese, terminology,
   and absence of translation artifacts.
6. Codex reviews the final scoped diff and reruns the focused and existing
   column 001 tests, typecheck, scoped lint, `git diff --check`, and a clean
   unique build.
7. Codex verifies the rendered Japanese route on desktop and mobile: HTTP
   200, sentence placement and meaning, unchanged surrounding content, no
   console/page errors, and no horizontal overflow.

No push or deploy.
