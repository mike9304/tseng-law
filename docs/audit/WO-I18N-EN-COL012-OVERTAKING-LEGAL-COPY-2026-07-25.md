# WO-I18N-EN-COL012-OVERTAKING-LEGAL-COPY-2026-07-25

## Goal

Publish a complete, natural-English version of column 012 without Chinese or
Korean leakage, while narrowing its legal claims to the current text of Taiwan
Road Traffic Safety Regulations Article 101 and presenting the accident account
as a fact-specific, anonymized matter.

## Inputs and evidence

- Current English source:
  `src/content/columns-en/012-taiwan-overtaking-accident-liability.md`
- Current official text of the Road Traffic Safety Regulations:
  `https://laws.gov.taipei/Law/LawSearch/LawArticleContent/FL012455`
  - The current consolidated entry was revised on June 26, 2026.
  - Article 101 sets out prohibited overtaking locations and conditions.
  - For overtaking a vehicle in the same lane, it requires two short horn
    signals or one headlight flash, prohibits repeated forcing signals, and
    allows the rear vehicle to pass only after the front vehicle slows, moves
    aside, or indicates that it is yielding.
  - The passing vehicle must signal left, keep at least 0.5 metres from the
    vehicle being passed, establish a safe distance, signal right, and return
    to its original line of travel.
- Government explanatory page:
  `https://www.chiayi.gov.tw/News_Content.aspx?n=455&s=779889`
- Existing secondary illustrated guide, retained only as supplementary reading:
  `https://gonews.com.tw/car/daily/21934/`

## Findings to correct

1. The title and heading end with three question marks.
2. A Chinese-language link label is visible on the English route.
3. The page says that a Korean version of the graphic was prepared, despite
   appearing on the English route. The associated `img-02.jpg` is a 147-by-98
   Korean-language graphic. Although the public column loader currently strips
   inline images, retaining it would create a future localization regression.
4. “Consent” and “warning” are used too broadly. Article 101's horn/light and
   yielding sequence should be described in its same-lane overtaking context.
5. The article omits several conditions in which Article 101 prohibits
   overtaking, including an oncoming vehicle and two or more vehicles travelling
   continuously ahead.
6. The anonymized account treats one omitted warning as the general legal cause
   of fault. Its result must instead be identified as the conclusion reached in
   that matter after accident appraisals.
7. Insurance, permanent emotional consequences, and the promise that compliance
   will prevent an excessive liability share are unsupported and must be
   removed.

## Allowed files

- `src/content/columns-en/012-taiwan-overtaking-accident-liability.md`
- `src/lib/__tests__/columns-en-content.test.ts`

No other file may be edited in this work order.

## Implementation requirements

- Use the title and H1 `Who Is Liable in an Overtaking Accident?`.
- Preserve the source URL, publication date, featured image, `img-01.jpg`, the
  supplementary article URL, and all three existing internal links.
- Remove the Korean-language `img-02.jpg` reference and its Korean-translation
  sentence from the English source. Do not replace them with a claim that an
  English graphic exists.
- Link the legal explanation to the current official consolidated regulations.
- State Article 101's scope and sequence precisely, including:
  - prohibited signed locations and roadwork;
  - school/hospital or no-overtaking signs or markings;
  - oncoming traffic or two or more vehicles continuously ahead;
  - two short horn signals or one headlight flash for a vehicle in the same lane;
  - no repeated signals to force yielding;
  - passing only after the vehicle ahead yields;
  - left signal, at least 0.5 metres of clearance, safe distance, right signal,
    and return to the original path.
- Present the incident as an anonymized account handled by the firm. Attribute
  the “main cause” conclusion to the appraisals in that matter and identify the
  combined circumstances considered rather than announcing a universal rule.
- Replace sensational, absolute, and guarantee-like language with neutral,
  practical guidance.
- Translate the supplementary link label into English and do not claim that the
  unavailable reference graphic was translated into English.
- Keep all public-facing prose free of Han, Hangul, Hiragana, and Katakana.
- Recalculate the displayed reading time from the finished English word count.
- Do not update embeddings in this work order. They will be regenerated once the
  source-content correction pass is complete.

## Regression requirements

Add an exact column-012 test that verifies:

- exact title/H1 and reading time;
- no CJK scripts in the raw or loaded public content;
- the current official regulations link and the specific Article 101 rules;
- translated supplementary link text and absence of “Korean version”;
- source URL, featured/incident image paths, supplementary URL, internal-link
  preservation, and removal of the Korean-language graphic reference;
- fact-specific appraisal wording;
- absence of the former insurance, permanent-torment, and liability-guarantee
  claims.

## Verification gates

1. Independent current-law review.
2. Independent native-English editorial review.
3. Work-order/plan review before implementation.
4. Manager-run static gates from the repository root:
   - `npx vitest run src/lib/__tests__/columns-en-content.test.ts`
     must pass all tests;
   - `npm run -s typecheck` must exit zero;
   - `npx eslint src/lib/__tests__/columns-en-content.test.ts`
     must exit zero (Markdown is not part of the ESLint input);
   - `git diff --check -- src/content/columns-en/012-taiwan-overtaking-accident-liability.md src/lib/__tests__/columns-en-content.test.ts docs/audit/WO-I18N-EN-COL012-OVERTAKING-LEGAL-COPY-2026-07-25.md`
     must report no whitespace errors.
5. Manager-owned Playwright verification against the existing local server at
   `http://127.0.0.1:3765/en/columns/taiwan-overtaking-accident-liability`:
   - desktop viewport: 1440 by 1000;
   - mobile viewport: 390 by 844;
   - both loads return HTTP 200 and use `lang="en"`;
   - the exact title, Article 101 explanation, official/supplementary/internal
     links, and fact-specific case qualification are present;
   - no visible CJK text or `Korean version` text;
   - no console errors or uncaught page errors;
   - `document.documentElement.scrollWidth` is no greater than the viewport
     width.
6. Independent post-implementation legal, native-English, and rendered-content
   reviews must each return PASS with no unresolved high- or medium-severity
   finding.

## Non-goals

- Rewriting the Korean, Traditional Chinese, or Japanese sibling columns.
- Verifying or publishing a specific traffic-appraisal report that is not in the
  repository.
- Promising any legal outcome.
- Regenerating embeddings.
- Staging, committing, pushing, deploying, or restarting a server from a worker
  lane.
