# Column frontmatter: audience and author

Each locale file (`src/content/columns*/NNN-slug.md`) can carry two fields
that drive recommendations and the byline. Add them inside the frontmatter
block (between the `---` lines).

## `audience` (per-locale recommendations)

Who this language version was written for.

```yaml
audience: ["ja"]          # written for Japanese readers
audience: ["en"]          # English-speaking readers (US/UK/other)
audience: ["global"]      # shared: meant for readers of every locale
audience: ["vi", "global"]
```

Values (case-insensitive):

| value | meaning | accepted aliases |
|---|---|---|
| `ko` | Korean readers | `KR` |
| `en` | English-speaking readers | `US`, `GB`, `UK` |
| `ja` | Japanese readers | `JP` |
| `zh-hant` | Taiwan / Traditional Chinese readers | `TW`, `zh-TW` |
| `zh-hans` | Simplified Chinese readers | `CN`, `zh-CN` |
| `vi` | Vietnamese readers | `VN` |
| `id` | Indonesian readers | |
| `th` | Thai readers | |
| `fil` | Filipino readers | `PH`, `tl` |
| any other site locale code (`de`, `es`, …) | readers of that locale | |
| `global` | every locale (shared column) | `all`, `shared`, `international` |

The rule (src/lib/column-audience.ts) applies on the home archive, the columns
index ("recommended" section) and the "recommended for you" fallback:

1. columns whose `audience` contains the page locale, newest first
   (`published`, else `lastmod`; same day → higher column number first)
2. columns whose `audience` contains `global`, newest first
3. all other columns in the usual order (topic mix / topic groups)

Only the locale's own files are used, so a locale never shows another
language's text. A new column appears at the top of its locale automatically
once its file carries the field; nothing else needs to change.

## `author` (AI-written columns)

```yaml
author: "legal-ai-assistant"
```

Marks a column as written by AI: no attorney byline or review claim, the
"Legal AI Assistant" author box is added at the end, and the Article JSON-LD
author is the Legal AI Assistant. Columns without the field keep the attorney
byline (019–040 are also listed in src/lib/ai-authored-columns.ts).

## Example (daily column routine)

```yaml
---
title: "…"
summary: "…"
published: "2026-10-01"
lastmod: "2026-10-01"
topic: "labor"
featured_image: "../images/041-some-slug/featured-01.webp"
audience: ["ja"]
author: "legal-ai-assistant"
---
```
