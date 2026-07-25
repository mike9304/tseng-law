# WO-I18N-COL010-ALL-LOCALES — Gym injury case, four-locale legal rewrite

Date: 2026-07-25 KST
Manager: Codex `/root`
Unit: `010-taiwan-gym-injury-lawsuit`

## Goal

Replace the stale Korean, Traditional Chinese, and Japanese versions with
native legal copy that is semantically aligned with the reviewed English
version. Re-open the English version only for the official judgment amount,
source attribution, Article 7 duty rule, metadata, and regression-test
corrections described below.

The four public articles must explain the same case, legal boundaries,
deadlines, evidence-preservation limits, damage categories, and insurance
qualification. They must not read as literal sentence-by-sentence machine
translations.

## Owned files by lane

Each implementation lane owns only its locale article and the matching focused
test file. Public archive/search/related-card synchronization is a later,
separate lane after all four articles pass.

- EN:
  - `src/content/columns-en/010-taiwan-gym-injury-lawsuit.md`
  - `src/lib/__tests__/columns-en-content.test.ts`
- KO:
  - `src/content/columns/010-taiwan-gym-injury-lawsuit.md`
  - `src/lib/__tests__/columns-ko-litigation-010.test.ts` (new)
- ZH-Hant:
  - `src/content/columns-zh/010-taiwan-gym-injury-lawsuit.md`
  - `src/lib/__tests__/columns-zh-litigation-010.test.ts` (new)
- JA:
  - `src/content/columns-ja/010-taiwan-gym-injury-lawsuit.md`
  - `src/lib/__tests__/columns-ja-litigation-010.test.ts` (new)

## Source hierarchy

1. Official judgment:
   `https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=TCDV,109,%E6%B6%88,7,20220124,1`
2. Consumer Protection Act Article 7:
   `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=7&pcode=J0170001`
3. Criminal Code Article 287:
   `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=287&pcode=C0000001`
4. Code of Criminal Procedure Article 237:
   `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=237&pcode=C0010001`
5. Civil Code Article 197:
   `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=197&pcode=B0000001`
6. Consumer Protection Act Article 51:
   `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=51&pcode=J0170001`
7. Media links already preserved in the article may support the reported
   appeal settlement and their own translated headline labels. They do not
   override the official judgment.

## Canonical facts and attribution

- The official Taichung District Court judgment is
  `109年度消字第7號`, dated 2022-01-24.
- It records a Korean student injured during trainer-led deadlift training at
  a Taichung gym.
- The first-instance order awarded exactly `TWD 1,579,589`, plus the interest
  stated in the judgment. The article need not explain the interest.
- The official judgment also identifies Attorney 曾雋崴 as the plaintiff's
  litigation representative, so first-person representation wording is
  supportable.
- The official judgment does not prove the later appellate disposition.
  Therefore say only that media reports stated that the parties later settled
  on appeal.
- Media captions may retain a translated version of the media outlet's rounded
  `TWD 1.57 million` headline. The article narrative itself must use the exact
  official amount.
- Do not describe the first-instance award as a final appellate judgment.
- Do not state the settlement amount.
- Do not present “largest gym,” “only listed gym brand,” “major reaction across
  the legal community,” or generalized claims about Taiwanese consumers as
  verified facts.

## Exact localized titles and metadata

- KO: `대만 헬스장 부상 손해배상: 1심 사례·청구기한·증거·배상항목`
- ZH-Hant: `台灣健身房受傷求償：一審案例、期限、證據與賠償項目`
- EN: `Taiwan Gym Injury Claims: Case Study, Deadlines, Evidence, and Damages`
- JA: `台湾のジム事故損害賠償：一審事例・期限・証拠・賠償項目`

For every locale:

- Keep the existing source `url`, filename/slug, original `date_display`,
  category meaning, and all image paths.
- Set `lastmod: "2026-07-25"`.
- Calculate `read_time` from the final visible copy using the project's
  locale-appropriate editorial convention; do not copy another locale's
  number.
- Frontmatter title and single H1 must be identical.

## Shared article structure

Every locale must contain the following sections in the same order:

1. Neutral introduction and case identification.
2. Official first-instance result, linked to the official judgment.
3. A sentence attributing the reported appeal settlement to media reports.
4. The same ordered media set:
   - featured image appears in frontmatter and once in the body;
   - ten body media items appear in order (`img-01.jpg` through
     `img-10.jpg`);
   - `img-01.jpg` through `img-10.jpg` each appear once;
   - records `img-02.jpg` through `img-09.jpg` use a standalone localized
     image followed by a localized text link to the unchanged external URL;
   - `img-10.jpg` uses a standalone localized image followed by the same
     localized bold caption;
   - no nested `[![...]](...)` markup.
5. A neutral explanation of why the case is useful, without cultural
   generalizations.
6. General-information disclaimer.
7. Five numbered FAQ sections:
   - legal routes and the fact-dependent liability boundary;
   - applicable time limits;
   - practical evidence-preservation steps;
   - possible damage categories;
   - why liability insurance does not itself decide liability or payment.
8. Neutral conclusion and three locale-correct internal links.

## Legal content contract

### Liability

- Explain that Article 7 requires a business operator providing services to
  ensure the service meets the safety reasonably expected under the
  professional or technical standard at the time.
- Do not imply that every gym injury establishes liability.
- State that the applicable duty, breach, causation, damage, defenses, and
  evidence depend on the facts.
- A criminal complaint for negligent injury is a possible route only if its
  legal elements are met.
- A civil damages claim is also a possible route; contract, tort, and consumer
  protection bases depend on the facts.

### Time limits

- Under Criminal Code Article 287, negligent injury under Article 284 is
  prosecutable only upon complaint.
- Under Code of Criminal Procedure Article 237, the complaint generally must
  be filed within six months after the entitled complainant learns the
  offender's identity.
- Under Civil Code Article 197, a tort damages claim generally expires if not
  exercised within two years after the claimant learns both of the injury and
  the person liable; a ten-year longstop runs from the wrongful act.
- Never cite Civil Code Article 198 for this limitation rule.
- Say that other causes of action and rules affecting a period depend on the
  facts, and prompt case-specific advice is prudent.

### Evidence

- Relevant evidence may include CCTV, medical records, receipts,
  communications, witness accounts, and training records.
- A formal written preservation request or counsel's letter is a practical
  step. It documents what was requested and when.
- Do not say that the request compels preservation, prevents deletion, or
  automatically creates an adverse inference.
- If the facts may involve a criminal offense, a prompt report allows
  investigators to decide whether lawful grounds exist to obtain or preserve
  footage.
- Do not promise that police will obtain CCTV.

### Damages

The article may identify:

1. medical expenses;
2. necessary nursing or care expenses;
3. necessary transportation expenses;
4. loss of earning capacity, if lasting impairment and supporting evidence
   are established;
5. documented earnings lost during recovery;
6. non-pecuniary damages assessed from case-specific circumstances;
7. punitive damages under Consumer Protection Act Article 51, only with the
   statutory `up to 5x / 3x / 1x` framework and an express applicability and
   court-assessment caveat.

Do not promise recovery, calculate loss through retirement automatically, or
state that an impairment rating fixes the award.

### Insurance and closing

- Coverage, exclusions, causation, and valuation can be disputed.
- Insurance does not by itself establish legal liability or the amount
  payable.
- Do not claim that Taiwanese gyms are usually insured or that insurers
  routinely refuse payment.
- Do not instruct every injured reader to sue. Recommend medical care,
  evidence preservation, and timely case-specific advice; list negotiation,
  consumer complaint/mediation, criminal complaint, and civil claim only as
  fact-dependent possibilities.

## Language quality

- KO: native Korean legal prose; no Chinese fragments in captions; use
  `대만달러` or `TWD` consistently and identify the exact official amount.
- ZH-Hant: native Taiwan Traditional Chinese; no Simplified Chinese; use
  Taiwan legal terms such as `侵權行為`, `告訴乃論`, `消費者保護法`.
- EN: native professional English; no CJK visible text; the source URL paths
  remain unchanged.
- JA: native Japanese legal explanatory prose; no Korean or untranslated
  Chinese captions; use Japanese legal explanations while preserving Taiwan
  statute names and links.
- External outlet URLs remain byte-for-byte unchanged. Visible media labels
  are localized and clearly function as linked report titles, not independent
  factual assertions by the firm.

## Regression-test contract

Each locale test must load the public column and assert:

- exact localized title and `lastmod`;
- exact official judgment amount in the narrative;
- official judgment, Articles 7, 287, 237, 197, and 51 URLs exactly once;
- first-instance wording and media-attributed appeal settlement;
- absence of Civil Code Article 198;
- absence of guaranteed CCTV/police/adverse-inference wording;
- five FAQ headings;
- identical image path set and safe non-nested media markup;
- exactly three locale-correct internal links;
- no wrong-locale leakage in visible article prose, using exact localized
  caption assertions, explicit old-leak forbidden strings, and
  locale-appropriate script checks rather than a blanket ban on Han
  characters;
- no old cultural generalizations or mandatory-litigation language.

## Gates

Each locale is accepted only after:

1. focused unit tests pass;
2. independent legal review passes;
3. independent native-copy/contract review passes;
4. TypeScript typecheck and `git diff --check` pass;
5. real-browser desktop and mobile checks show:
   - HTTP 200;
   - correct `html lang` and canonical URL;
   - expected title and exact result;
   - 🇰🇷 KR, 🇯🇵 JP, 🇹🇼 TW, 🇺🇸 EN switchers;
   - no horizontal overflow;
   - no console, page, or request failures.

Do not push or deploy. Commit each accepted locale separately.
