# WO-I18N-JA-COL001-SUBSIDIARY-PARAGRAPH-SYNC — 子会社説明の同期

Date: 2026-07-26 KST
Manager: Codex `/root`
Locale: Japanese (`ja-JP`)
Micro-scope: column 001, one subsidiary paragraph only

## Goal

確定済みの韓国語版column 001の子会社詳細段落を、日本語本文の指定された
既存段落1つと置き換える。自然で簡潔な日本語として忠実に翻訳する
ことだけを目的とし、新たな法的調査、法的レビュー、解釈、助言または
事実追加は行わない。

## Fixed source

- Korean file:
  `src/content/columns/001-taiwan-company-establishment-basics.md`
- finalized commit:
  `fe07b9d9bd304e6a2cd5b80c1728dc9dc4078b0a`
- exact source: the detailed subsidiary paragraph beginning
  `대만 자회사(有限公司·股份有限公司)는 본점과 구별되는 독립 법인으로서`
  (currently line 37), within
  `## 1. 대만 진출 형태: 자회사·지점·대표사무소`

The Japanese paragraph must convey only these source meanings:

1. A Taiwan subsidiary (`有限公司` or `股份有限公司`) is a legal entity
   independent and distinct from the head office; it enters contracts in its
   own name and is itself the holder of rights and obligations.
2. The choice between `有限公司` and `股份有限公司` requires consideration
   of the equity or share structure, corporate organs, decision-making method,
   and financing plan.
3. Separate legal personality does not by itself mean that every liability is
   always limited to the subsidiary; guarantees, security interests,
   contracts with the parent company, directors' liability, and the relevant
   individual relationships must also be examined.

## Owned implementation files

1. `src/lib/__tests__/columns-ja-investment-001-subsidiary-paragraph-sync.test.ts`
   (new)
2. `src/content/columns-ja/001-taiwan-company-establishment-basics.md`
   - only the existing 288-byte paragraph slice defined below

Do not edit any other byte, frontmatter, heading, image, surrounding paragraph,
existing test, other locale, shared code, archive/search data, or embedding.
Do not stage, add, commit, push, deploy, publish, or operate shared servers.

## Exact replacement boundary

The target paragraph appears immediately after this exact label and blank
line:

`**1. 台湾子会社（有限公司・股份有限公司）：**\n\n`

Replace only the existing Japanese prose bytes at offsets `4551..4839`.
The separator and next bold tax-treaty paragraph belong to the immutable tail.

Preserve bytes `0..4551` exactly:

- immutable prefix: `4551` UTF-8 bytes
- SHA-256:
  `c93292788f5e6fed1bfe8063c3df5c0f786a2c0e5b202c3946c1b495aacf422c`

The current replaceable target is:

- existing target: `288` UTF-8 bytes
- SHA-256:
  `2945ff5a83f93c296673a11c0f5427240d9b2d35e0cfdde3b9e93401ba872464`

Preserve bytes `4839..EOF` exactly. The immutable tail begins with:

`\n\n**台湾・韓国所得税協定は2023年12月27日に発効し、`

- immutable tail: `9705` UTF-8 bytes
- SHA-256:
  `96dd220b7373f4c36fb03c3b2a9f4bc40ac55cf0b02b9786985dfa8d30b323f4`

The replacement must be exactly one non-empty Japanese prose paragraph
`P1`, with no newline inside or after the mutable slice. The preserved tail
supplies the required `\n\n` paragraph separator. Do not add a heading, list,
blockquote, link, image, HTML, citation, or spacer.

## Translation constraints

- Use precise, neutral professional Japanese suitable for an informational
  law-firm article.
- Preserve the distinction between the subsidiary and the head office, the
  subsidiary's own contractual capacity, and its status as the holder of
  rights and obligations.
- Preserve both company-form alternatives and all four selection factors:
  equity/share structure, corporate organs, decision-making, and financing.
- Preserve all separately reviewed relationships: guarantees, security
  interests, parent-company contracts, and directors' liability.
- Do not turn the source's fact-specific caution into an absolute rule or add
  a legal conclusion, statutory reference, recommendation, marketing,
  greeting, personal name, first-person text, or call to action.
- Reject Hangul, U+200B, U+FEFF, U+00A0, carriage returns, line breaks,
  trailing whitespace, and invisible characters within the replacement.

## Deterministic RED/GREEN test

The focused test must read the Japanese Markdown as raw bytes and use
independently declared constants. It must not use network calls, snapshots,
production-copy imports, loader-derived expectations, or fixtures derived
from the implementation text.

1. Lock bytes `0..4551` to the prefix length and SHA-256 above.
2. In RED, lock the current 288-byte target and its SHA-256 to demonstrate
   that the expected old paragraph is the only replaceable slice.
3. Locate the exact immutable tail at offset `4839` in RED; after replacement,
   locate it as the first bytes following the mutable paragraph and lock the
   full marker-to-EOF length and SHA-256 above.
4. Treat only the bytes between offset `4551` and the immutable tail as
   mutable.
5. Assert the exact single-paragraph `P1` shape with no newline in the mutable
   slice.
6. Assert all three source meanings and every listed selection factor and
   separately reviewed relationship with bounded Japanese literals or
   explicit semantic alternatives.
7. Reject prohibited structure, additions, Hangul, and invisible characters
   only within the replacement slice.

RED must fail only because the current paragraph lacks the complete required
source meaning while both immutable boundary fixtures pass. GREEN must pass
after replacing only the owned paragraph slice.

## Roles and gates

1. Terra writes and runs the focused test to demonstrate deterministic RED.
2. Grok drafts only the single Japanese paragraph from the fixed Korean
   source; Grok performs no research and edits no files.
3. Terra replaces only the approved paragraph slice and demonstrates GREEN.
4. An independent Terra reviewer checks source-to-target fidelity and confirms
   that no meaning was omitted, weakened, or added.
5. An independent Grok reviewer checks concise natural Japanese, terminology,
   and absence of translation artifacts.
6. Codex reviews the final scoped diff and reruns the focused and existing
   column 001 tests, typecheck, scoped lint, `git diff --check`, and a clean
   unique build.
7. Codex verifies the rendered Japanese route on desktop and mobile: HTTP
   200, paragraph placement and meaning, unchanged surrounding content, no
   console/page errors, and no horizontal overflow.

No push or deploy.
