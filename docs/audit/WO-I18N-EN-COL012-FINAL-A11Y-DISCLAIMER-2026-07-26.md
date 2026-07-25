# WO-I18N-EN-COL012-FINAL-A11Y-DISCLAIMER

## Goal

Close the three medium-severity gaps found in the independent final review of
English column 012 without otherwise rewriting the accepted article: accurate
Article 101 return-path wording, meaningful image alternative text, and a
specific-matter disclaimer.

## Evidence and accepted baseline

- Accepted article:
  `src/content/columns-en/012-taiwan-overtaking-accident-liability.md`
- Accepted regression block:
  `src/lib/__tests__/columns-en-content.test.ts`
- Original implementation contract:
  `docs/audit/WO-I18N-EN-COL012-OVERTAKING-LEGAL-COPY-2026-07-25.md`
- Current official consolidated Road Traffic Safety Regulations:
  `https://laws.gov.taipei/Law/LawSearch/LawArticleContent/FL012455`
- The accepted Article 101 explanation remains correct except that
  `original lane` is narrower than the regulation's `原行路線`; use
  `original path of travel`.

## Allowed files

- `src/content/columns-en/012-taiwan-overtaking-accident-liability.md`
- `src/lib/__tests__/columns-en-content.test.ts`

No other file may be edited by the implementation worker.

## Exact content changes

1. Set `lastmod` to `2026-07-26`. Preserve `date_display`,
   the source URL, title/H1, categories, image paths, links, headings, and all
   other accepted prose.
2. Replace the featured image alt with:
   `Illustration of liability analysis and safe passing procedure after an overtaking accident in Taiwan`
3. Replace the incident diagram's empty alt with:
   `Diagram of a motorcycle and two cars during a mountain-road overtaking collision`
4. In the Article 101 passing sequence, replace only `return safely to the
   original lane` with `return safely to the original path of travel`.
5. After the final internal link list, add exactly:

   `This article provides general legal information about Taiwan overtaking rules and how fault may be assessed after an overtaking collision. It is not legal advice for any specific matter and does not guarantee any liability outcome. Actual fault may vary with the location, vehicle movements, speed, signals, evidence, appraisals, and the current regulations. Specific matters should be reviewed against the relevant materials.`

6. Recalculate the loaded public-content English word count using the existing
   test helper. Keep `read_time` at `4 min read` only if the resulting
   `Math.ceil(wordCount / 200)` is 4.

## Exact regression changes

Within the existing column-012 test only:

- expect `lastmod` and the loaded date to be `2026-07-26`, while preserving
  `date_display` as `September 13, 2025`;
- update the exact Article 101 sentence to `original path of travel`;
- assert each exact Markdown image block, including both alt texts and existing
  paths, occurs once;
- assert the exact disclaimer occurs once in raw content and is present in
  loaded public content;
- update the exact rendered word count to the measured value and continue to
  prove it maps to `4 min read`;
- retain all existing column-012 assertions.

## Verification gates

Manager-run from the repository root:

```sh
npx vitest run src/lib/__tests__/columns-en-content.test.ts
npm run -s typecheck
npx eslint src/lib/__tests__/columns-en-content.test.ts
git diff --check -- src/content/columns-en/012-taiwan-overtaking-accident-liability.md src/lib/__tests__/columns-en-content.test.ts
```

Manager-owned browser verification at desktop 1440×1000 and mobile 390×844:

- the canonical route and the `overtaking-accident` legacy alias return the
  accepted English article;
- `lang="en"`, exact H1, canonical link, Article 101 sentence, disclaimer, and
  five accepted links are present;
- no visible CJK or `Korean version` text;
- no horizontal overflow, console error, uncaught page error, or actionable
  failed request.

## Non-goals

- No other locale, column, public surface, embedding, dependency, or
  configuration change.
- No broad editorial rewrite.
- No worker staging, commit, push, deployment, or server management.
