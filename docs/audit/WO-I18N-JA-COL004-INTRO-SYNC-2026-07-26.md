# WO-I18N-JA-COL004-INTRO-SYNC — 子会社・支店比較の導入部

Date: 2026-07-26 KST
Manager: Codex `/root`
Locale: Japanese (`ja-JP`)
Micro-scope: column 004 introduction only

## Goal

確定済みの韓国語版column 004導入部を、簡潔で自然な日本語3段落へ
忠実に翻訳する。これは翻訳だけの作業であり、新たな法的調査、
法的レビュー、事実追加は行わない。

## Owned implementation files

1. `src/lib/__tests__/columns-ja-investment-004-intro-sync.test.ts` (new)
2. `src/content/columns-ja/004-taiwan-company-subsidiary-vs-branch.md`
   - only the current introduction slice described below

Do not edit frontmatter, H1, the featured image, the immutable prefix or tail,
existing tests, other locales, shared code, archive/search data, or embeddings.
Do not stage, add, commit, push, deploy, publish, or operate shared servers.

## Exact byte boundary

Preserve every byte before the current marker:

`台湾に事業拠点を設ける際、外国企業が検討する代表的な形態に台湾子会社と台湾支店があります。`

- immutable prefix: `2274` UTF-8 bytes
- SHA-256:
  `ca0ceb7801a6df1447cd6a1d819fcaca7df7d181f4eebd5c87647f10549db283`

Replace only the slice from that marker through immediately before:

`## 1. 法人格と出資関係`

Preserve that H2 marker and every following byte.

- immutable tail: `10174` UTF-8 bytes
- SHA-256:
  `a6a59ae4a040317215fdd6c62d733d16acdcf6fe825dd4414ddcc01acd283a83`

The replacement must end with exactly `\n\n`, so the immutable H2 follows
without an inserted heading, spacer, or other content.

## Exact introduction structure

The replacement must contain exactly three non-empty Japanese prose
paragraphs and exactly this unchanged image line:

`![](../images/004-taiwan-company-subsidiary-vs-branch/img-01.jpg)`

Use this exact order and spacing:

1. paragraph 1
2. one blank line
3. the exact image line
4. one blank line
5. paragraph 2
6. one blank line
7. paragraph 3
8. one blank line
9. immutable `## 1. 法人格と出資関係`

In compact form, the slice is `P1\n\nIMAGE\n\nP2\n\nP3\n\n`. Do not move,
rename, duplicate, add alt text to, or otherwise change the image line.

## Translation contract

Translate all concepts in the three finalized Korean introduction paragraphs,
without adding facts or advice.

1. Explain that foreign companies planning continuous business in Taiwan
   commonly compare a Taiwan subsidiary with a Taiwan branch of a foreign
   company. Although both establish a Taiwan business base, they differ as to
   the contracting party, bearer of liabilities, ability to receive a third
   party's investment, and procedures for transferring profits abroad.
   Comparing only convenience at establishment can create unexpected
   liability or tax issues during operation, so the entire business lifecycle
   must be considered.
2. Define a Taiwan subsidiary as an independent legal entity established
   under Taiwan law. A foreign parent company may be its shareholder, but the
   subsidiary is a rights-and-obligations subject distinct from that parent.
   Define the Taiwan branch of a foreign company as part of the foreign head
   office and a business base without separate legal personality. Mention
   `支社` only as an everyday alternative, then state that this article uses
   `支店` to make the legal relationship clear.
3. Explain that the suitable form depends on the industry, investor
   composition, contract structure, Taiwan permits, staffing, financing,
   use and recovery of profits, future admission of partners or listing, and
   plans to discontinue the business. For a Korean parent entering Taiwan,
   Taiwan law must be reviewed together with Korea-side accounting, tax, and
   overseas-investment procedures. End with the article roadmap: legal
   personality, tax, liability, financing, investment tax credits, the income
   tax agreement, and exit/withdrawal.

Use the Korean source solely as the finalized translation source. Do not
perform or imply a fresh legal review of its propositions.

## Prohibited content

Within the replacement slice, reject:

- greetings, the lawyer's name, personal introductions, first-person copy,
  video announcements, calls to action, and marketing language;
- Hangul;
- added headings, blockquotes, lists, links, HTML, or images;
- U+200B, U+FEFF, U+00A0, carriage returns, trailing whitespace, and invisible
  or whitespace-only lines.

In particular, remove and do not paraphrase the stale greeting
`こんにちは。台湾弁護士の曾雋崴（Wei Tseng）です。`.

## Deterministic RED/GREEN test

The new focused test must read the Japanese Markdown file as raw bytes, use
independently declared constants, and make no network calls, snapshots,
production-copy imports, loader-derived expectations, or self-derived
fixtures.

1. Lock bytes `0..2274` to the prefix length and SHA-256 above.
2. Locate the exact immutable H2 marker and lock marker-to-EOF to the tail
   length and SHA-256 above.
3. Treat only bytes between offset `2274` and that H2 marker as the
   replaceable introduction slice.
4. Assert the exact `P1\n\nIMAGE\n\nP2\n\nP3\n\n` structure, exactly three
   non-empty prose paragraphs, and exactly one unchanged image line.
5. Assert every concept in the translation contract with bounded,
   independently written Japanese literals or explicit semantic
   alternatives, including continuous business and lifecycle comparison,
   both legal definitions and terminology, individualized selection factors,
   Korea-side accounting/tax/overseas-investment review, and the complete
   article roadmap.
6. Reject the stale greeting, lawyer name, `動画`, personal/marketing copy,
   Hangul, U+200B, U+FEFF, U+00A0, CRLF/carriage returns, trailing whitespace,
   and invisible or whitespace-only lines only within the intro slice.

RED must fail only on the stale introduction contract while both immutable
boundary fixtures pass. GREEN must pass after changing only the owned
introduction slice.

## Execution and independent review gates

1. Terra writes and runs the focused test to demonstrate deterministic RED.
2. Grok drafts only the three Japanese paragraphs from the finalized Korean
   introduction; Grok performs no research and edits no files.
3. Terra implements only the approved introduction slice and demonstrates
   GREEN.
4. A Terra reviewer independent of the implementer checks the Korean source
   against the Japanese result line by line and confirms that no concept was
   omitted, weakened, or added.
5. A Grok reviewer independent of the drafter reviews concision, natural
   professional Japanese, terminology, and absence of translation artifacts.
6. Codex reviews the final scoped diff and reruns the focused test, the
   existing `src/lib/__tests__/columns-ja-investment-004.test.ts`, typecheck,
   scoped lint, `git diff --check`, and a clean unique build.
7. Codex verifies the rendered Japanese column on desktop and mobile: HTTP
   200, exact three-paragraph/image structure, unchanged H2 and tail, no
   Hangul or stale copy, no console/page errors, and no horizontal overflow.

No push or deploy.
