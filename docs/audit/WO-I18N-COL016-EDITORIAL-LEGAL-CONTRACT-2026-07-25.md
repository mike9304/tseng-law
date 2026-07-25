# COL016 Editorial and Legal Contract — Anonymized Taiwan Family Guide

Date: 2026-07-25 KST
Manager: Codex `/root`

## Decision

Keep the public slug but replace the named celebrity-family analysis with a
general, source-backed Taiwan inheritance and parental-rights guide.

The existing article identifies living adults, discusses two minor children,
speculates about estate composition, and predicts family litigation. A
read-only public-fact and privacy review recommended anonymization rather than
retaining the names or unpublishing the route. A separate current-Taiwan-law
review found material overstatements concerning inheritance, matrimonial
residual property, parental rights, guardianship, and a minor’s property.

This is a publication-safety correction, not a translation of the legacy copy.

## Stable route contract

Preserve:

- slug: `taiwan-inheritance-custody-analysis`;
- legacy frontmatter source URL:
  `https://www.wei-wei-lawyer.com/post/taiwan-inheritance-custody-analysis`;
- public routes:
  - `/ko/columns/taiwan-inheritance-custody-analysis`;
  - `/zh-hant/columns/taiwan-inheritance-custody-analysis`;
  - `/en/columns/taiwan-inheritance-custody-analysis`;
  - `/ja/columns/taiwan-inheritance-custody-analysis`;
- the existing `inheritance-custody` alias redirects for KO, ZH-Hant, and EN;
- family-service related-column linkage.

`next.config.mjs` currently generates legacy column aliases only for KO,
ZH-Hant, and EN. The JA canonical route must remain available, but adding a new
JA legacy alias is outside the locale-source units and will be considered in
the final global route-parity audit.

Use `lastmod: "2026-07-25"` in every rewritten locale. Preserve each locale’s
display date for the original publication date.

## Locale titles

- KO:
  `대만 상속과 친권: 남은 가족을 위한 법률 안내`
- ZH-Hant:
  `台灣繼承與親權：遺屬法律指南`
- EN:
  `Taiwan Inheritance and Parental Rights: A Guide for Surviving Families`
- JA:
  `台湾の相続と親権：遺された家族のための法律ガイド`

The frontmatter title and the sole H1 must be identical within each locale.

## Image and privacy contract

Stop using the four person-specific images in the article:

- `featured-01.jpg`;
- `img-01.jpg`;
- `img-02.jpg`;
- `img-03.jpg`.

Do not delete the legacy assets in this unit. They may be retained as
unreferenced archival files until a later asset-cleanup decision.

Use exactly one new, non-identifying image immediately after H1:

`../images/016-taiwan-inheritance-custody-analysis/featured-generic.webp`

The generated image contains no recognizable person, child, celebrity, logo,
flag, readable document, or watermark. Its repository copies are:

- `public/images/016-taiwan-inheritance-custody-analysis/featured-generic.webp`;
- `public/images/blog/016-taiwan-inheritance-custody-analysis/featured-generic.webp`.

Use a natural localized alt describing Taiwan inheritance planning and a
minor’s property protection. Do not mention the former named parties.

## Identity and prohibited-content contract

The rewritten source, frontmatter, rendered metadata, FAQ, JSON-LD, source
labels, internal links, and alt text must not contain any of these strings or
their ordinary variants:

- `구준엽`, `서희원`, `왕소비`, `서희제`;
- `具俊曄`, `徐熙媛`, `汪小菲`, `徐熙娣`;
- `Koo Jun-yup`, `Barbie Hsu`, `Wang Xiaofei`, `Dee Hsu`;
- `クー・ジュンヨプ`;
- `大S`;
- `SBS`, `SBS News`, `SBS뉴스`, `SBS新聞`, `SBSニュース`;
- `Harlem Yu`.

Also prohibit:

- any estate-value or estate-composition estimate;
- any inference about a named or identifiable person’s premarital or
  post-marital property;
- any prediction that relatives will litigate or oppose one another;
- any assertion that a living person abused parental rights, misused a
  child’s property, or intended to do so;
- any description of a minor’s residence, school, travel, wishes, or private
  family circumstances;
- `automatically becomes the sole holder`;
- `no lawsuit is required`;
- `the family cannot oppose`;
- `can freely manage the child’s property`;
- `a will has no effect`;
- an unqualified exact inheritance share presented as the outcome of a real
  family matter.

## Required legal propositions

Every locale must explain the following with native, qualified prose:

1. **Intestate order and spouse**
   - Under Civil Code Articles 1138 and 1144, the surviving spouse inherits
     concurrently with the applicable ranked heirs.
   - Descendants are first in the statutory order.
   - If the only relevant heirs are one spouse and two children, and no will,
     waiver, disqualification, representation, or other material fact changes
     the result, each ordinarily receives one equal share.
   - This is a hypothetical example, not a conclusion about any actual estate.

2. **Will, reserved portions, and estate identification**
   - A valid will may change the distribution subject to mandatory rules,
     including reserved portions.
   - Identify the estate, debts, ownership, beneficiary designations, trusts,
     prior transfers, and governing law before calculating any share.

3. **Matrimonial residual-property claim**
   - A surviving spouse may separately assert a residual-property
     distribution claim under Civil Code Article 1030-1 if the statutory
     conditions are met.
   - The claim is not an inheritance share and must be analyzed separately.
   - Do not assume that every asset acquired during marriage is included or
     that the surviving spouse will necessarily receive half of an estate.

4. **Inherited debts and waiver**
   - Under Article 1148, an heir’s liability for inherited debt is generally
     limited to the value of inherited property, subject to statutory rules
     and exceptions.
   - Under Article 1174, an heir who wishes to waive inheritance must submit a
     written waiver to the court within three months after learning of the
     inheritance.
   - Inventory, creditor, preservation, and court procedures may require
     separate advice.

5. **Surviving parent**
   - Under Article 1089, when one parent cannot exercise parental rights and
     duties, the other ordinarily exercises them.
   - Use this qualified formulation:
     if the surviving parent retains parental rights and no contrary court
     order exists, that parent ordinarily continues to exercise parental
     rights and duties.
   - Do not call this an automatic custody award or imply that courts have no
     role.

6. **Guardian and court**
   - Guardianship under Article 1091 becomes relevant when there is no parent
     or both parents cannot exercise parental rights and duties.
   - A parent exercising parental rights may appoint a guardian by will under
     Article 1093.
   - Statutory and court appointment rules, including Articles 1094 and
     1094-1, remain subject to the minor’s best interests and the actual facts.
   - Relatives and other authorized persons may seek court intervention where
     statutory grounds exist.

7. **Minor’s inherited property**
   - Under Articles 1087 and 1088, property acquired by a minor through
     inheritance is the minor’s separate property.
   - A parent or guardian does not become the beneficial owner.
   - Management, use, earnings, representation, disposition, conflicts of
     interest, and court controls must be handled for the child’s interests.
   - Do not imply unrestricted unilateral use.

8. **Cross-border and practical caution**
   - Nationality, domicile, habitual residence, asset location, a foreign
     marriage or divorce, prior parental-rights orders, and other foreign
     elements can change the governing-law and procedure analysis.
   - Do not apply Taiwan rules to a cross-border family without checking the
     Act Governing the Choice of Law in Civil Matters Involving Foreign
     Elements and any other applicable regime.
   - The official inheritance process includes tax, household-registration,
     property-registration, and court steps. The process and deadlines depend
     on the facts.

## Official-source contract

Every locale must use exactly these five official source URLs once each under
a localized `Official Sources` H2, with native labels:

1. `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000001`
2. `https://mojlaw.moj.gov.tw/ENG/LawContentE.aspx?LSID=FL001351`
3. `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000007`
4. `https://www.judicial.gov.tw/tw/cp-1369-4219-da7e1-1.html`
5. `https://www.etax.nat.gov.tw/etwmain/tax-info/house-land-transfer-taxtation-calculation-area/inheritance/file-process`

The fifth source was updated by the Ministry of Finance on 2026-06-25 and
states the general inheritance-process sequence, three-month court periods for
inventory/waiver, and the six-month estate-tax filing period. Do not turn these
general periods into individualized deadline advice.

Do not cite news, entertainment media, social media, blogs, law-firm
aggregators, or the former SBS interview in the replacement article.

## Required article structure

Use exactly these eleven conceptual H2 sections, localized natively:

1. statutory heirs and shares;
2. wills and identifying the estate;
3. the spouse’s residual-property claim;
4. inherited debts and waiver;
5. the surviving parent’s rights and duties;
6. guardian designation and court involvement;
7. protection of a minor’s inherited property;
8. cross-border family issues;
9. practical planning checklist;
10. official sources;
11. related services.

The numbering above contains nine substantive sections plus `Official
Sources` and `Related Services`, for exactly eleven raw Markdown H2s in each
source file. The article page component renders one additional localized FAQ
`<h2>` from frontmatter; that rendered component heading is expected and does
not change the raw-source H2 contract.

Use four frontmatter FAQs, each repeated character-for-character as the first
paragraph after its assigned H2:

1. spouse and two children in an intestate hypothetical;
2. residual-property claim versus inheritance;
3. what happens when one parent dies;
4. whether a surviving parent may freely use a minor’s inherited property.

Each answer must occur exactly twice in the raw source.

## Locale sequencing and ownership

Complete one locale at a time:

1. KO;
2. ZH-Hant;
3. EN;
4. JA;
5. synchronize the four related-column titles in `src/data/site-content.ts`
   and update the existing listing tests.

For each locale:

- create a locale-specific work order with exact title, FAQ, H2, source labels,
  internal links, disclaimer, author, length, and test contracts;
- obtain an executable-plan review before writing;
- use one writer with ownership of only the locale source and its new dedicated
  test;
- obtain independent native-language and current-Taiwan-law reviews;
- send every correction back to the same writer and repeat until both pass;
- rerun focused and cross-locale tests, typecheck, ESLint, and diff-check;
- inspect desktop and mobile screenshots;
- click all four mobile flag controls and verify the target route and
  `html lang`;
- commit only the approved unit locally.

Do not push or deploy.

## Final related-title synchronization

After all four source articles pass, update only the four family-service
related-column titles for this slug:

- KO:
  `대만 상속과 친권: 남은 가족을 위한 법률 안내`
- ZH-Hant:
  `台灣繼承與親權：遺屬法律指南`
- EN:
  `Taiwan Inheritance and Parental Rights: A Guide for Surviving Families`
- JA:
  `台湾の相続と親権：遺された家族のための法律ガイド`

Add or update tests so each service listing title matches the locale article
title. Preserve the slug and family-service link.

## Final acceptance gates

The four-locale unit is complete only when:

1. no named-party, media, estate-speculation, or minor-private-detail string
   remains in the four sources or related listing titles;
2. all four sources use only the generic image;
3. every required legal proposition and official source is locked by
   dedicated per-locale tests;
4. native-language and Taiwan-law reviewers pass each final source hash;
5. all locale, route, listing, FAQ, metadata, type, lint, and build tests pass;
6. desktop and mobile browser checks pass on all four routes;
7. flag navigation reaches KO, JA, ZH-Hant, and EN correctly;
8. `src/content/column-embeddings.json` is not edited or regenerated during
   any locale-source unit; at the final whole-site stage, if `OPENAI_API_KEY`
   and network access are available, the manager may invoke the supported
   development endpoint `POST /api/consultation/build-embeddings` and verify
   its result;
9. no push or deployment occurs without explicit user authorization.
