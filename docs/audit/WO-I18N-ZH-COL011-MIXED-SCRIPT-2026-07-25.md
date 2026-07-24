# WO-I18N-ZH-COL011-MIXED-SCRIPT — Remove one Korean glyph

Date: 2026-07-25 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Correct the single Korean glyph leaked into the Traditional Chinese FAQ answer
for column 011, and add a corpus-level regression that rejects Hangul from
loaded ZH-Hant titles, bodies and FAQ text.

## Allowed files

1. `src/content/columns-zh/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md`
2. `src/lib/__tests__/columns-zh-content.test.ts`

No other file may be modified.

## Exact content correction

At frontmatter FAQ answer line 14, replace exactly:

```text
產品登록者
```

with:

```text
產品登錄者
```

This is a one-character substitution: Korean `록` becomes Traditional Chinese
`錄`. Preserve the rest of the FAQ answer, frontmatter, article body, URLs,
images and formatting byte-for-byte; normalizing the redundant extra blank
line at EOF is allowed if required by the patch tool.

The corrected term must match the already-correct `產品登錄者` used in the body.

## Regression requirements

Strengthen `columns-zh-content.test.ts` so every loaded ZH-Hant post proves:

1. `title` contains no Hangul;
2. public `content` contains no Hangul;
3. every FAQ question and answer contains no Hangul;
4. column 011's parsed second FAQ answer contains `產品登錄者` and excludes
   `產品登록者`.

Do not scan raw frontmatter URLs for Hangul: two historical first-party source
URLs intentionally contain Korean URL slugs, while the public title/body/FAQ
copy must remain Traditional Chinese.

## Copy boundaries

- Do not change Taiwan terminology such as `化粧品`, `產品登錄`,
  `國內負責人` or `罰鍰`.
- Preserve technical acronyms and terms including `PIF`,
  `Product Information File`, `TFDA` and `DNA`.
- Do not rewrite facts, deadlines, fines, company setup claims or calls to
  action in this typo-only unit.

## Forbidden scope

- Any other ZH-Hant, KO, EN or JA column file
- Source URLs, image paths, headings, dates, categories or body prose
- Column loader, route, UI, SEO, JSON-LD, CSS or assets
- `column-embeddings.json`; regenerate embeddings only after all source-text
  corrections are complete
- Stage, commit, push, deploy or server operation by the worker

## Required automated gates

```bash
npx vitest run src/lib/__tests__/columns-zh-content.test.ts
npm run -s typecheck
npx eslint src/lib/__tests__/columns-zh-content.test.ts
git diff --check
git status --short
```

The manager owns browser verification of
`http://127.0.0.1:3765/zh-hant/columns/taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide`
at desktop `1440 × 1000` and mobile `390 × 844`: HTTP 200, exact corrected
FAQ text, no `登록`, no console/page errors and no horizontal overflow.
