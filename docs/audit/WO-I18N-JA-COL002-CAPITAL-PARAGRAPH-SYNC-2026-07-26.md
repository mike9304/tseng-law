# WO-I18N-JA-COL002-CAPITAL-PARAGRAPH-SYNC — 資本金説明の補完

Date: 2026-07-26 KST
Manager: Codex `/root`
Locale: Japanese (`ja-JP`)
Micro-scope: column 002, one capital paragraph only

## Goal

確定済みの韓国語版column 002第39行を、日本語本文の指定位置へ
自然で簡潔な1段落として忠実に翻訳する。翻訳だけを行い、新たな
法的調査、法的レビュー、解釈、助言または事実追加は行わない。

## Fixed source

- Korean file:
  `src/content/columns/002-withdraw-capital-taiwan-company.md`
- finalized commit:
  `0ac2a7c963750fdb9bb983870e06f5039a9f956b`
- exact source: line 39 at that commit
- source work order:
  `docs/audit/WO-I18N-KO-COL002-COMPANY-EXIT-2026-07-25.md`

The Japanese paragraph must convey only these source meanings:

1. Capital is an accounting equity item representing amounts contributed by
   shareholders upon incorporation or a capital increase.
2. It does not necessarily equal the current balance of the company's bank
   account.
3. The term capital does not include or represent all assets acquired or all
   liabilities incurred while the company operates.
4. At closure, assess the actual assets and liabilities, receivables and
   payables, taxes, contingent liabilities, and liquidation costs together,
   rather than looking only at the book amount of capital.

## Owned implementation files

1. `src/lib/__tests__/columns-ja-investment-002-capital-paragraph-sync.test.ts`
   (new)
2. `src/content/columns-ja/002-withdraw-capital-taiwan-company.md`
   - only the empty insertion slice defined below

Do not edit any existing byte, frontmatter, heading, image, surrounding
paragraph, existing test, other locale, shared code, archive/search data, or
embedding. Do not stage, add, commit, push, deploy, publish, or operate shared
servers.

## Exact insertion boundary

Insert content immediately after this exact heading and blank line:

`## 払込金の返還と会社財産の分配\n\n`

and immediately before this exact immutable tail marker:

`会社法（公司法）第9条は、会社が受け取るべき払込金（股款）について、`

The insertion slice is currently empty. Preserve bytes `0..5051` exactly:

- immutable prefix: `5051` UTF-8 bytes
- SHA-256:
  `948995afb691258eb6dc3637e938c5cdcfc2c2372c6a731a37caa31ea42ec208`

Preserve the tail marker through EOF exactly:

- immutable tail: `6728` UTF-8 bytes
- SHA-256:
  `adf97fe2db6b6273283b7234682e55e0ad67f8ccafd67a46a87f852158fb69f9`

Insert exactly one non-empty Japanese prose paragraph followed by exactly one
blank line: `P1\n\n`. Do not add a heading, list, blockquote, link, image,
HTML, citation, or spacer.

## Translation constraints

- Use precise, neutral professional Japanese suitable for an informational
  law-firm article.
- Preserve the distinction between the accounting equity item, current bank
  balance, assets, and liabilities.
- Preserve every closure-check category: actual assets, liabilities,
  receivables, payables, taxes, contingent liabilities, and liquidation costs.
- Do not overstate the source as saying capital is cash kept in the account,
  all company property, or the amount distributable to shareholders.
- Do not add legal conclusions, statutory references, recommendations,
  marketing, greetings, personal names, first-person text, or calls to action.
- Reject Hangul, U+200B, U+FEFF, U+00A0, carriage returns, trailing
  whitespace, and invisible or whitespace-only lines in the insertion.

## Deterministic RED/GREEN test

The focused test must read the Japanese Markdown as raw bytes and use
independently declared constants. It must not use network calls, snapshots,
production-copy imports, loader-derived expectations, or fixtures derived
from the implementation text.

1. Lock bytes `0..5051` to the prefix length and SHA-256 above.
2. Locate the exact tail marker and lock marker-to-EOF to the tail length and
   SHA-256 above.
3. Treat only the bytes between offset `5051` and the tail marker as mutable.
4. Assert the exact `P1\n\n` shape and exactly one non-empty prose paragraph.
5. Assert all four source meanings and every named closure-check category
   with bounded Japanese literals or explicit semantic alternatives.
6. Reject prohibited structure, additions, Hangul, and invisible characters
   only within the insertion slice.

RED must fail only because the required paragraph is absent while both
immutable boundary fixtures pass. GREEN must pass after changing only the
owned insertion slice.

## Roles and gates

1. Terra writes and runs the focused test to demonstrate deterministic RED.
2. Grok drafts only the single Japanese paragraph from the fixed Korean
   source; Grok performs no research and edits no files.
3. Terra inserts only the approved `P1\n\n` slice and demonstrates GREEN.
4. An independent Terra reviewer checks source-to-target fidelity and confirms
   that no meaning was omitted, weakened, or added.
5. An independent Grok reviewer checks concise natural Japanese, terminology,
   and absence of translation artifacts.
6. Codex reviews the final scoped diff and reruns the focused and existing
   column 002 tests, typecheck, scoped lint, `git diff --check`, and a clean
   unique build.
7. Codex verifies the rendered Japanese route on desktop and mobile: HTTP
   200, paragraph placement and meaning, unchanged surrounding content, no
   console/page errors, and no horizontal overflow.

No push or deploy.
