# WO-I18N-JA-COL001-INTRO-SYNC — 会社設立ガイド導入部

Date: 2026-07-26 KST
Manager: Codex `/root`
Locale: Japanese (`ja-JP`)
Micro-scope: column 001 introduction only

## Goal

確定済みの韓国語版導入部を、簡潔で自然な日本語3段落へ忠実に翻訳する。
これは翻訳だけの作業であり、新たな法的レビューや調査は行わない。

## Owned implementation files

1. `src/lib/__tests__/columns-ja-investment-001-intro-sync.test.ts` (new)
2. `src/content/columns-ja/001-taiwan-company-establishment-basics.md`
   - only the current introduction slice described below

Do not edit frontmatter, H1, images, the immutable prefix or tail, existing
tests, other locales, shared code, archive/search data, or embeddings. Do not
stage, commit, push, deploy, or operate shared servers.

## Exact byte boundary

Preserve every byte before the current marker
`こんにちは。台湾弁護士の曾雋崴（Wei Tseng）です。`.

- immutable prefix: `2870` UTF-8 bytes
- SHA-256:
  `7b9ba687afe25b5077611c11cba9396394b2ebb3431268bd70e7923ba1707497`

Replace only the slice from that marker through immediately before:

`> まず事業拠点の組織形態を決める必要があります。`

Preserve that marker and every following byte.

- immutable tail: `10393` UTF-8 bytes
- SHA-256:
  `44c0f6cca8e6de0379a240fcc3674b3131273b143be8f4a458484b180fab749d`

The replacement must end with exactly `\n\n`, so the tail marker follows
without an inserted heading, spacer, or other content.

## Translation contract

Write exactly three concise prose paragraphs in professional, natural
Japanese. Together they must faithfully cover every concept in the finalized
Korean introduction:

1. Entry methods vary with the business. The contracts used, entity earning
   the revenue, and people performing work locally affect the required legal
   setup.
2. Incorporation, foreign investment, banking, tax, premises, work permits,
   and residence are connected but distinct. Registration alone neither
   completes investment review or industry permits nor authorizes a
   shareholder or manager to work immediately.
3. Review the business model, locations of the investor and head office,
   expected transactions, fund flows, staffing, and premises together from
   the outset. Then give the article roadmap: entity form, subsidiary process,
   industry and location checks, work/residence and capital issues, and major
   taxes.

Do not add facts or advice beyond those Korean source concepts. Prohibit the
old greeting, video announcement, personal introduction, first-person or
marketing copy, Hangul, and invisible spacer-only lines, including U+200B,
U+FEFF, U+00A0, or whitespace-only lines inside the three-paragraph slice.

## Deterministic RED/GREEN test

The new focused test must read raw bytes only, use independently declared
constants, and make no network calls, snapshots, production-copy imports, or
loader-derived expectations.

1. Lock bytes `0..2870` to the prefix length and SHA above.
2. Locate the exact immutable tail marker; lock marker-to-EOF to the tail
   length and SHA above.
3. Treat only bytes between offset `2870` and the tail marker as the intro.
4. Assert exactly three non-empty Japanese prose paragraphs separated by one
   blank line and a final `\n\n`.
5. Assert all concepts in the translation contract with bounded,
   independently written Japanese literals or semantic alternatives.
6. Reject the old greeting and marker, `動画`, personal/marketing copy,
   Hangul, U+200B, U+FEFF, U+00A0, and invisible or whitespace-only spacer
   lines only within the intro slice.

RED must fail only on the stale intro contract while both immutable boundary
fixtures pass. GREEN must pass after changing only the intro slice.

## Execution and review gates

1. Terra writes and runs the focused test to demonstrate deterministic RED.
2. Grok drafts only the three Japanese paragraphs from the finalized Korean
   introduction; no research or file edits.
3. Terra implements only the approved intro slice and demonstrates GREEN.
4. An independent Terra reviewer checks line-by-line Korean-source fidelity
   and confirms that no concept was omitted or added.
5. Grok performs an independent Japanese language review for concision,
   naturalness, professional tone, and absence of translation artifacts.
6. Codex reviews the final scoped diff and reruns the focused test, existing
   Japanese column 001 test, typecheck, scoped lint, `git diff --check`, and a
   clean unique build.
7. Codex verifies the rendered Japanese column on desktop and mobile: HTTP
   200, exact three-paragraph intro, unchanged first blockquote/tail, no Hangul
   or stale copy, no console/page errors, and no horizontal overflow.

No push or deploy.
