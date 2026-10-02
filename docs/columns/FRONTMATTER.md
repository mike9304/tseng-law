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

If a column is later edited/published through the builder, the published copy
keeps `audience`, `author` and the file number from the .md file (see
src/lib/consultation/columns-blob-reader.ts), so the rule still applies.

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

## Representative image descriptions

```yaml
featured_image: "/images/columns/example.webp"
featured_image_alt: "A concise description in the article's language."
featured_image_caption: "Disclose generated illustrations and their limits here."
social_image: "/images/columns/example.jpg"
```

These optional fields supply the hero and list image alt, a visible caption
below the hero, and an alternate rendition for Open Graph and Twitter cards.
The social rendition must show the same image. Its alt uses
`featured_image_alt`. File-derived builder records retain these descriptions
only while their representative image matches the file image; a different CMS
image does not inherit an old caption or social rendition. Without these fields,
existing rendering is preserved.
Generated editorial images must not be described as actual client photos,
evidence, or reconstructions of cited judgments. The caption is separate from
any Blender diagram's hypothetical assumptions.

## `diagram_video` (animated traffic diagrams)

```yaml
diagram_video: "<id>"                               # id in src/data/traffic-diagrams.ts (hypothetical scenes only; never a real case without consent)
diagram_video_after: "기존 칼럼에 소개된 익명 사고 사례"  # optional: exact `##` heading text
```

The loader strips inline markdown images, so looping Blender diagrams are
attached through frontmatter. The column page renders `TrafficDiagramFigure`
(poster first; `<video autoplay muted loop playsinline preload="metadata">`
mounted near the viewport, never under `prefers-reduced-motion` or Save-Data)
after the first paragraph of the named section, or before the body when no
heading is given or found. Captions, including the illustrative-assumption
note, live in the registry per locale (ko, zh-hant, en, ja). Builder/Blob copies
keep the field from the .md file.

A native-only column may register copy only for its own locale; the figure
renders nothing in a locale without reviewed copy. Shared hub illustrations
still require all four locales. `lane-change-hypothetical` is a Taiwan-only
example and is not added to the existing traffic hub. Its actual dimensions
set a 40:27 desktop frame and a 4:5 mobile frame. Optional `stills` plus
`copy.stages` provide four expandable static views, also available when motion
or data saving disables video. For these figures the playback button sits
below the media so it cannot obscure embedded labels.

## 칼럼별 Blender 도해

교통사고 허브의 각 칼럼은 해당 글을 설명하는 도해를 하나씩 연결한다. 특정 사건의 미동의 재현물을 재사용하지 않는다. 본문 Markdown 이미지를 전역 허용하는 방식도 사용하지 않는다.

```yaml
diagram: "police-documents-3d"
diagram_after: "경찰 자료별 신청 시점"
```

`diagram_after`는 해당 언어의 실제 H2와 일치해야 한다. `src/data/traffic-still-diagrams.ts`에서 새 WebP와 4개 언어의 설명을 등록한다. 정적 도해는 이미지로만 로딩하며, 기존 영상용 `diagram_video` 키도 계속 지원한다. 렌더 원본은 `scripts/blender/column-diagrams.py`; 생성 명령은 파일 머리말에 있다. 서류 양식이나 차량 배치를 실제 사건의 자료로 오인하지 않도록 필요한 설명을 붙인다.

`src/lib/__tests__/traffic-diagrams.test.tsx`는 허브에 연결한 모든 교통사고 칼럼의 4개 언어 도해와 삽입 위치를 검사한다. 새 글을 추가할 때도 이 검사를 통과해야 한다.
