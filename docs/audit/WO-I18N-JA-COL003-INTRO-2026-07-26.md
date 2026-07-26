# WO-I18N-JA-COL003-INTRO — 台湾交通事故ガイドのメタデータと導入部

Date: 2026-07-26 KST
Manager: Codex `/root`
Locale: Japanese (`ja-JP`)
Column: `003-taiwan-traffic-accident-procedure`
Micro-scope: frontmatter, H1, two image descriptions, and introduction only

## Goal

古い個人ブログ調の導入部を、検討済み韓国語版のタイトルと導入部に
忠実な、簡潔で自然な日本語へ置き換える。Q1以降はこのレーンでは
一切変更しない。

Immutable tail:

- marker:
  `Q1. 事故発生後、どのような状況なら現場を離れてもひき逃げとみなされないのでしょうか？`
- UTF-8 bytes: `18103`
- SHA-256:
  `f3c149195c4ccae60f936a725c16ecb7c0930c996b5d0870c7fc258d7cb2e3a0`

The localized prefix must end immediately before the marker, which currently
begins at byte `943`.

## Owned files

- `src/content/columns-ja/003-taiwan-traffic-accident-procedure.md`
  - only byte zero through immediately before the exact current Q1 marker
- `src/lib/__tests__/columns-ja-traffic-003.test.ts`
  - new focused boundary and introduction contract

Do not edit Q1 onward, Korean, Traditional Chinese, English, archive/search
data, embeddings, loaders, aliases, or unrelated tests.

## Exact contract

- Frontmatter:
  - `title: "台湾交通事故対応Q&A：現場対応・過失・示談・損害賠償"`
  - preserve the existing `url`
  - `lastmod: "2026-07-26"`
  - preserve `date_display: "2025年9月13日"`
  - preserve `read_time: "約8分"`
  - preserve the exact YAML category:
    ```yaml
    categories:
      - "台湾法律情報"
    ```
  - preserve the exact featured-image path
- Use one H1 matching the title exactly.
- In the localized body prefix, use exactly two Markdown image nodes:
  - featured image alt text must describe immediate scene safety and evidence
    preservation after a traffic accident in Taiwan;
  - second image alt text must describe recording vehicle positions and road
    traces at the accident scene.
- The featured-image path must occur once in frontmatter and once in body
  content. The second-image path must occur once in body content.
- The introduction must state in natural Japanese:
  - first secure safety, make the appropriate report or notification, and
    preserve evidence;
  - then examine claim deadlines, fault, and the scope of settlement;
  - the guide provides a general sequence based on Taiwan law and official
    public guidance;
  - specific responsibility and procedure can vary with the facts of the
    accident.
- Use professional Japanese suitable for a Taiwan law-firm website.
- Remove the greeting, personal self-introduction, case-volume claim,
  first-person commentary, efficiency claim, and U+200B spacer-only lines.
- Stop before the exact legacy Q1 marker and preserve Q1 onward byte-for-byte.
  The localized prefix must end with exactly `\n\n`; insert nothing between
  the introduction and Q1 marker.

## Regression-test contract

Create a deterministic focused test that:

1. locks the immutable Q1–end tail at `18103` bytes and the specified SHA;
2. asserts the exact frontmatter fields, sole matching H1, and two descriptive
   image nodes and paths;
3. asserts the four introduction concepts using independently declared
   Japanese literals or bounded semantic alternatives;
4. rejects only within the localized prefix:
   - `こんにちは`
   - `台湾弁護士の曾雋崴`
   - `多くの交通事故事件を扱った経験`
   - `知見を共有したい`
   - `本日は`
   - `Q&A形式`
   - `効率的に`
   - Hangul and U+200B spacer-only lines;
5. rejects first-person tokens `私`, `私たち`, `我々`, and `当事務所` only in
   visible prefix prose after removing frontmatter and image nodes;
6. declares expected literals independently and uses no production-copy
   imports, network calls, snapshots, or secrets.

## Gates

1. independent Terra plan review;
2. focused test is RED only for the new prefix contract while the immutable
   Q1 tail fixture passes;
3. Grok drafts only this prefix;
4. Terra implements only this prefix;
5. focused test, Japanese content test, TypeScript, scoped ESLint,
   `git diff --check`, and a clean unique build pass;
6. Grok Japanese language review, Terra Korean-source fidelity review, and
   Codex final diff/source/browser verdict pass;
7. no push or deploy.
