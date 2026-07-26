# WO-I18N-EN-COL003-INTRO — Taiwan traffic guide metadata and introduction

Date: 2026-07-26 KST
Manager: Codex `/root`
Locale: English (`en`)
Column: `003-taiwan-traffic-accident-procedure`
Micro-scope: frontmatter, H1, two image descriptions, and introduction only

## Goal

Replace the stale personal blog opening with a concise English localization of
the reviewed Korean title and introduction. This is intentionally smaller than
one Q&A block. Q1 through the end of the file remain immutable.

Immutable tail:

- marker:
  `Q1. In what situations after an accident can you leave the scene without being treated as a hit-and-run?`
- UTF-8 bytes: `17650`
- SHA-256:
  `033d0f355302b1038d965d3ca35b340d15c388e29a0c9e6f5b8eb9f4cebe37df`

## Owned files

- `src/content/columns-en/003-taiwan-traffic-accident-procedure.md`
  - only byte zero through immediately before the exact current Q1 marker
- `src/lib/__tests__/columns-en-traffic-003.test.ts`
  - new focused boundary and introduction contract

Do not edit Q1 onward, Korean, Traditional Chinese, Japanese, archive/search
data, embeddings, loaders, aliases, or unrelated tests.

## Exact contract

- Frontmatter:
  - `title: "Taiwan Traffic Accident Q&A: Scene Safety, Fault, Settlement, and Compensation"`
  - preserve the existing `url`
  - `lastmod: "2026-07-26"`
  - preserve `date_display: "September 13, 2025"`
  - preserve `read_time: "8 min read"`
  - exact YAML category array:
    ```yaml
    categories:
      - "Taiwan Legal Information"
    ```
  - preserve the exact featured-image path
- Use one H1 matching the title exactly.
- In the localized body prefix, use exactly two Markdown image nodes:
  - featured image: scene safety and evidence preservation after a Taiwan
    traffic accident;
  - second image: recording vehicle positions and road evidence at the scene.
- The featured-image path must occur once in frontmatter and once in
  `parsed.content` (`2` raw occurrences). The second-image path must occur once
  in `parsed.content` (`1` raw occurrence).
- The introduction must state, in natural English:
  - first secure safety, make the appropriate report/notification, and
    preserve evidence;
  - then examine claim deadlines, fault, and the scope of settlement;
  - the guide gives a general sequence based on Taiwan law and official
    guidance;
  - responsibility and procedure depend on the facts of the accident.
- Remove the greeting, personal self-introduction, case-volume claim,
  first-person commentary, efficiency claim, and U+200B spacer-only lines.
- Stop before the exact legacy Q1 marker and preserve Q1 onward byte-for-byte.
  The localized prefix must end exactly with `\n\n`; no characters, including
  heading markers, may be inserted between the introduction and the Q1 marker.

## Regression-test contract

Create a deterministic test that:

1. locks the immutable Q1–end tail at `17650` bytes and the specified SHA;
2. asserts the exact frontmatter fields, sole H1, and two image paths;
3. asserts the four introduction concepts without importing production text;
4. rejects `Hello`, `I am Wei Tseng`, `I have handled many`, `share my views`,
   `Today I would like`, `Q&A format`, `efficiently`, Hangul, Han script,
   Japanese kana, and U+200B spacer-only lines only within the localized
   prefix; reject first-person singular tokens with the case-insensitive word
   boundary pattern `\b(?:I|me|my|mine|myself)\b` only in visible prefix prose,
   excluding frontmatter URLs and image paths;
5. declares expected literals independently in the test and does not import or
   derive them from the production Markdown or loader output; uses no network
   calls, snapshots, or secrets.

## Gates

1. independent Terra plan review;
2. focused test is RED only for the new prefix contract while the tail fixture
   passes;
3. Grok drafts only the prefix;
4. Terra implements only the prefix;
5. focused test, TypeScript, scoped ESLint, `git diff --check`, clean build,
   Grok language review, Terra fidelity review, and Codex browser review pass;
6. no push or deploy.
