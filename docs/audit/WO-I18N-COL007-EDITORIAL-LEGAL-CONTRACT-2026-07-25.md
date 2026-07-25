# COL007 Editorial and Legal Contract — Taiwan Divorce Q&A

Date: 2026-07-25 KST
Manager: Codex `/root`

## Decision

Keep the public slug and original source URL, but replace all four legacy
articles with a current, primary-source-based guide to Taiwan divorce,
cross-border registration, matrimonial property, support, parental
responsibility, child support, contact, and relocation.

This is a complete legal and editorial rewrite. It is not a sentence-level
translation or a shortening pass.

The current KO, ZH-Hant, EN, and JA files repeat the same twenty-five questions
and share material defects:

- a court divorce registration period is described from receipt of a judgment
  or record instead of finality of the judgment or establishment of mediation
  or settlement;
- a marriage or divorce completed abroad is treated as if local law alone
  resolved Taiwan registration, recognition, jurisdiction, and applicable-law
  questions;
- house title, premarital funds, gift, and nominee-registration theories are
  collapsed into a prediction that ownership can or cannot be recovered;
- matrimonial residual-property distribution and post-divorce support are
  incorrectly given the same five-year period;
- average monthly consumption is presented as if it were the controlling
  formula for spousal support;
- the Article 1052 proviso is described as an absolute bar against an at-fault
  spouse even after Constitutional Court Judgment 112-Hsien-Pan-4;
- fault, damages, post-divorce support, residual-property distribution, and
  parental responsibility are incorrectly blended;
- a police missing-person report and a prior cohabitation-performance action
  are presented as mandatory preconditions to divorce;
- several months away from home is treated as a divorce ground without the
  statutory analysis of malicious desertion or another serious cause;
- child-support modification is described too narrowly;
- contact enforcement is presented as a single automatic remedy rather than a
  child-best-interests decision involving direct or indirect methods and
  possible interim measures;
- relocation to Korea and Korean living costs are treated as deciding child
  support;
- the Japanese article ends with three Korean routes;
- the English text is heavily translated, and all locales retain emotional or
  promotional legacy copy instead of a neutral legal-information voice;
- the article has no dedicated four-locale legal-content regression suite;
- archive, related-card, search, and embedding copy are not synchronized with
  one canonical public title and summary.

The replacement must preserve the breadth of the twenty-five legacy questions.
Writers may consolidate duplicate questions into the common architecture
below, but may not omit any topic listed in the coverage matrix.

## Stable route and source contract

Preserve:

- canonical slug: `taiwan-divorce-lawsuit-qna`;
- legacy alias: `divorce-qna`;
- frontmatter source URL:
  `https://www.wei-wei-lawyer.com/post/taiwan-divorce-lawsuit-qna`;
- public canonical routes:
  - `/ko/columns/taiwan-divorce-lawsuit-qna`;
  - `/zh-hant/columns/taiwan-divorce-lawsuit-qna`;
  - `/en/columns/taiwan-divorce-lawsuit-qna`;
  - `/ja/columns/taiwan-divorce-lawsuit-qna`;
- the existing featured-image asset family.

Use `lastmod: "2026-07-25"` in all four files. Preserve the original
locale-formatted display date for September 13, 2025. Calculate `read_time`
from each final visible body using the repository's established locale
convention; do not copy a read time from another language.

Do not change redirects, route policy, sitemap behavior, shared page
components, the builder, or the consultation schema in a locale-writing unit.

## Canonical four-locale titles

- KO:
  `대만 이혼 절차 Q&A: 조정·소송·재산분할·자녀`
- ZH-Hant:
  `台灣離婚程序 Q&A：調解、訴訟、財產分配與子女`
- EN:
  `Taiwan Divorce Q&A: Mediation, Litigation, Property, and Children`
- JA:
  `台湾の離婚手続Q&A：調停・訴訟・財産分与・子ども`

The frontmatter title and the sole raw Markdown H1 must match
character-for-character within each locale.

## Image contract

Use exactly one body image, immediately after H1:

`../images/007-taiwan-divorce-lawsuit-qna/featured-01.jpg`

Use a native, neutral alt describing a Taiwan divorce procedure and family-law
consultation. Do not claim the image depicts an actual client, case, court
hearing, spouse, or child. Remove `img-01.jpg` and every other body-image
reference from all four rewritten Markdown files. Do not delete the underlying
legacy assets in this unit.

## Legal terminology contract

Use terms that reflect Taiwan law instead of importing the reader's home-law
labels as if they were equivalent.

- `兩願離婚`:
  mutual-consent divorce / 협의이혼 / 協議離婚 / 協議離婚
- `裁判離婚`:
  judicial divorce / 재판상 이혼 / 裁判離婚 / 裁判離婚
- `未成年子女權利義務之行使或負擔`:
  exercise and assumption of rights and duties regarding a minor child.
  A native shorthand such as custody, 친권, 親權, or 親権 may be used only
  after explaining that it is shorthand and not a complete translation of the
  Taiwan-law concept.
- `會面交往`:
  contact or visitation / 면접교섭 / 會面交往 / 面会交流.
- `夫妻剩餘財產差額分配請求權`:
  claim for distribution of the difference in residual matrimonial property.
- `贍養費` under Civil Code Article 1057:
  post-divorce support for the qualifying spouse. Do not confuse it with child
  support, general marital support, damages, or property distribution.

Every locale must distinguish:

1. the validity and registration of divorce;
2. jurisdiction and applicable law in a cross-border matter;
3. the grounds for judicial divorce;
4. matrimonial-property ownership and residual-property distribution;
5. damages under Article 1056;
6. post-divorce support under Article 1057;
7. parental rights and duties regarding a minor child;
8. child support;
9. contact or visitation;
10. recognition, registration, enforcement, and relocation.

## Required legal propositions

### 1. Three divorce paths and separate cross-border questions

Explain mutual-consent divorce, court mediation or settlement, and judicial
divorce as legally distinct paths.

For a cross-border family, separate:

- whether a Taiwan court or authority may handle the matter;
- which jurisdiction's law applies to divorce, matrimonial property, and child
  issues;
- whether a foreign divorce or judgment is recognized or effective in Taiwan;
- which Taiwan household-registration step and authenticated documents are
  required; and
- what additional registration or recognition is required in the other
  relevant jurisdiction.

Never say that being Taiwanese, being a foreigner, registering the marriage in
one country, or applying one country's local law by itself resolves all five
questions.

### 2. Mutual-consent divorce and household registration

Under Civil Code Article 1050, Taiwan mutual-consent divorce must be in
writing, signed by at least two witnesses, and registered with the household
registration authority. The witnesses must have perceived and confirmed the
parties' genuine mutual intent to divorce; their signatures are not a merely
formal later addition.

Registration is constitutive for a Taiwan mutual-consent divorce. Do not say
that a signed private agreement alone completes it.

Use the current Ministry of the Interior registration guide for applicants,
documents, authenticated foreign documents, Chinese translations, and
permitted representation. Do not freeze a document checklist without telling
the reader to check the current official guide and the responsible office.

For a Taiwan court judgment, mediation, or settlement, describe the general
registration application period from finality or establishment of the court
result. State that the household registration office may directly register a
qualifying Taiwan court result after notice if no party applies. Do not imply
that missing the online or application period reverses the divorce.

### 3. Court mediation, litigation, appearance, and review

Explain that family matters covered by the Family Act ordinarily pass through
court mediation before adjudication, subject to the Act and the case.

Under Family Act Article 13, when the court orders a party or legal
representative to appear in person and that person fails to comply without
just cause, Civil Procedure Code Article 303 applies mutatis mutandis, except
that compulsory appearance by arrest is unavailable. The first fine under
Article 303 is up to NTD 30,000; the Family Act also permits repeated
sanctions after another lawful notice and another unjustified failure to
appear. Do not convert this into a rule that both spouses must always sit in
the same room or that remote, separate, representative, or safety arrangements
are automatically available. The court controls procedure based on law and
the circumstances.

Explain the distinct effects of a successful court mediation or settlement
and a final judgment. Preserve the legacy topics of expected duration,
documents, and review or appeal, but do not promise a timetable or state one
universal review deadline. The correct route and period depend on the type of
decision, service, finality, and procedural posture.

### 4. Judicial-divorce grounds and the Article 1052 proviso

Civil Code Article 1052 has:

- ten grounds in paragraph 1; and
- a general paragraph 2 ground where another serious cause makes continuation
  of the marriage difficult.

Translate the current statutory grounds accurately. Do not modernize a
statutory term into a broader or narrower colloquial ground. A short,
reader-friendly explanation may follow the accurate legal proposition.

The Article 1052 paragraph 2 proviso concerning the responsible spouse remains
in the current statutory text as of 2026-07-25. Constitutional Court Judgment
112-Hsien-Pan-4 held that the restriction is generally constitutional but
becomes unconstitutional to the extent that, without considering whether a
serious cause arose or continued for a considerable period, it completely
deprives the solely responsible spouse of any opportunity to divorce and is
manifestly harsh. The two-year legislative period has elapsed without removal
of the current text, so courts must apply the judgment's reasoning in such
cases.

Never say:

- an at-fault spouse can never petition;
- an at-fault spouse may always petition;
- adultery automatically grants or bars divorce;
- the constitutional judgment itself repealed the proviso;
- the legislature has already replaced the provision; or
- assigning fault mechanically decides damages, property distribution,
  parental responsibility, or child support.

For a missing or absent spouse, distinguish:

- life or death unknown for more than three years under Article 1052
  paragraph 1;
- malicious desertion continuing under Article 1052 paragraph 1; and
- another serious cause under Article 1052 paragraph 2.

A police missing-person report may be important evidence, but the statute does
not make it a universal mandatory precondition. A prior action demanding
cohabitation is not a universal statutory precondition either. Months away
from home do not alone establish a ground.

### 5. Foreign marriage, foreign divorce, and Taiwan records

Do not offer the legacy two-option rule of first registering a foreign
marriage in Taiwan or filing a Taiwan lawsuit.

The article must explain that nationality, domicile or habitual residence,
place of marriage or divorce, current household records, an existing foreign
judgment or certificate, service and procedural fairness, and the requested
Taiwan legal effect must be identified first.

Foreign documents may require Taiwan overseas-mission or other authorized
authentication and a Chinese translation authenticated or notarized as the
official household-registration guide specifies. The treatment of documents
from Mainland China, Hong Kong, and Macau follows separate verification rules.
Do not state that every foreign divorce needs the same documents or procedure.

### 6. House title, premarital funds, and residual-property distribution

Separate three questions:

1. who owns a particular asset;
2. whether a gift, nominee-registration, loan, trust, unjust enrichment, or
   another claim can be established from the parties' real agreement and
   evidence; and
3. whether the asset or its value enters a residual matrimonial-property
   calculation.

A down payment or loan installment from premarital savings does not by itself
transfer registered title. Registration in one spouse's name does not by
itself resolve every contractual, beneficial, reimbursement, or matrimonial
property claim. Do not promise that ownership can or cannot be recovered.

Explain Civil Code Article 1017's premarital/postmarital classification and
statutory presumption cautiously. Preserve the practical value of transfer
records, purchase contracts, loan records, receipts, messages, tax and
registration materials, but do not state that one document decides the claim.

Under Article 1030-1, when the statutory matrimonial-property regime ends, the
statutory calculation generally distributes the difference between qualifying
net residual property equally. Inherited or otherwise gratuitously acquired
property and consolation damages are excluded as the statute provides. The
court may adjust or exempt distribution where an equal result would be
manifestly unfair after considering the statutory circumstances.

Do not say:

- all property acquired during marriage is divided in half;
- common property and residual-property distribution are the same;
- a spouse who committed adultery automatically loses or receives less;
- title alone determines the calculation; or
- a foreign spouse receives a different statutory calculation merely because
  of nationality.

The Article 1030-1 claim is extinguished if not exercised within two years from
knowledge of the residual-property difference, and in any event within five
years from termination of the statutory regime. Do not use this period for
damages, post-divorce support, child support, ownership, or another claim.

### 7. Damages, post-divorce support, unmarried partners, and third parties

Distinguish:

- Article 1056 damages arising from judicial divorce and its fault
  requirements;
- non-pecuniary damages under the statutory requirements;
- Article 1057 support where a spouse without fault falls into financial
  hardship because of judicial divorce;
- ongoing parent-child support;
- ordinary support duties under other Civil Code provisions;
- residual-property distribution; and
- a separately pleaded tort or property claim against a third party.

Do not state that the other spouse's fault determines a fixed support amount.
Do not present government average consumption statistics as a binding
formula. Explain that the applicable entitlement and amount depend on the
specific statutory right and evidence.

An unmarried couple does not receive divorce rights merely because they lived
together, but an actual co-owned asset, loan, contract, nominee registration,
trust, unjust enrichment, or tort may raise a separate claim. Do not promise
recovery or treat every cohabiting couple as married.

Article 1057 support is between the qualifying former spouses. A claim against
an in-law or another third party requires a separate legal basis; serious
interference or insults do not automatically create damages.

Do not assign one five-year period to all rights. Each claim's accrual,
knowledge, event, procedural status, and limitation rule must be checked
separately.

### 8. Minor children, parental rights, and best interests

Use Civil Code Articles 1055 and 1055-1.

Explain that parents may agree on the exercise and assumption of rights and
duties regarding a minor child, but the court may decide or change the
arrangement when agreement is absent, fails, or is adverse to the child.
The child's best interests govern, using the statutory factors and the actual
evidence. The court may hear the child and seek information from competent
authorities or child-welfare professionals as the law provides.

Do not imply that:

- a child-related arrangement is a prize or punishment for marital fault;
- one parent's higher income decides the result;
- a signed divorce agreement prevents later court review;
- every agreed change is only a household-registration formality; or
- the words custody or parental rights fully describe every Taiwan-law right
  and duty without explanation.

The spouses may complete a divorce while other issues remain disputed only if
the chosen divorce path's requirements are satisfied. Do not recommend
“divorce first, resolve the child later” as a universal shortcut. Identify
which child and property issues remain legally open, which need an agreement
or court order, and what interim protection may be necessary.

### 9. Child support, contact, enforcement, and interim protection

Under Civil Code Article 1116-2, parents' duty to support their minor child
continues after divorce. Child support is distinct from Article 1057
post-divorce spousal support.

Do not say modification is available only for events the parties could not
foresee. Explain that a requested change requires review of the child's current
needs, the parents' resources and circumstances, the existing agreement or
order, and the child's best interests.

If contact or visitation is obstructed, explain that a party may seek a court
determination, change, enforcement, or appropriate interim measure depending
on the existing instrument and facts. Under Family Act Article 194,
enforcement methods must be selected in the child's best interests and may
involve direct or indirect compulsion. Do not promise automatic handover,
immediate force, a change of parental responsibility, or punishment.

Preserve evidence guidance: the current order or agreement, communications,
attempted contact, school and medical schedules, expenses, payment history,
and facts affecting the child's safety and stability.

### 10. Cross-border relocation with a child

Do not say that agreement to live in Korea automatically establishes child
support at Korean living-cost levels.

Separate:

- authority to decide the child's residence and travel;
- the other parent's agreement or an applicable court order;
- the child's best interests and effect on continuing contact;
- passport, entry, exit, immigration, and registration requirements;
- enforceability of an existing order in each relevant jurisdiction;
- actual child expenses and both parents' resources; and
- urgent protective or interim measures where flight, retention, or safety is
  genuinely in issue.

Do not state or imply that the 1980 Hague Child Abduction Convention
automatically governs Taiwan. Cross-border removal and return questions require
advice in every relevant jurisdiction and cannot be reduced to a treaty label.

### 11. Evidence and practical preparation

The article must provide an ordered, non-adversarial checklist covering at
least:

1. marriage and household-registration records, nationality, domicile,
   habitual residence, and current addresses;
2. any written divorce agreement, witness circumstances, court papers,
   service records, mediation record, settlement, judgment, and finality
   certificate;
3. foreign marriage or divorce records, authentication, translation, and
   recognition status;
4. the applicable matrimonial-property agreement and complete asset,
   liability, title, acquisition-source, transfer, loan, tax, and valuation
   records;
5. alleged divorce-ground events, chronology, communications, medical or
   police material where lawfully available, and preservation of originals;
6. each child's age, health, education, residence, care history, views where
   appropriate, relationship with each parent, and safety or stability needs;
7. current child-related agreements or orders, support payments, expenses,
   contact history, travel documents, and proposed relocation plan;
8. every relevant filing, registration, appeal, limitation, or enforcement
   date calculated from the correct triggering event; and
9. privacy-safe handling of a spouse's and child's identifiers and records.

Do not encourage unlawful surveillance, account access, device intrusion,
tracking, recording, disclosure of a child's private information, retaliation,
asset concealment, or removal of a child contrary to an agreement or order.

## Required thirteen-H2 architecture

Every locale must use exactly these thirteen conceptual H2 sections, localized
natively and kept in this order:

1. three divorce paths and the first cross-border checks;
2. mutual-consent divorce and household registration;
3. court mediation, litigation, appearance, and review;
4. judicial-divorce grounds and the responsible-spouse proviso;
5. foreign marriage, foreign divorce, and Taiwan records;
6. house title, premarital funds, and residual-property distribution;
7. damages, post-divorce support, unmarried partners, and third parties;
8. minor children, parental rights, and the best-interests standard;
9. child support, contact, enforcement, and interim protection;
10. cross-border relocation with a child;
11. evidence and practical preparation;
12. official sources;
13. related guidance.

H3 subsections are allowed only where they improve navigation and do not
change this semantic order.

## Required six-FAQ contract

Each locale must use exactly six native frontmatter FAQs. Each answer must be
substantive, qualified, and repeated character-for-character as the first
paragraph of its assigned H2. Each answer must therefore occur exactly twice
in the raw source.

FAQ roles and assignments:

1. H2 2 — What makes a Taiwan mutual-consent divorce effective?
2. H2 3 — Must both spouses always appear together in court mediation?
3. H2 4 — Can the spouse responsible for marital breakdown petition for
   judicial divorce?
4. H2 6 — Does paying for a house or holding title decide ownership and
   residual-property distribution?
5. H2 7 — Are residual-property distribution, divorce damages, and
   post-divorce support the same claim or subject to one five-year period?
6. H2 8 — How does a Taiwan court decide issues concerning a minor child?

Locale-specific work orders must provide the six exact native questions and
answers. The master contract locks their legal role, not literal translation.

## Legacy twenty-five-question coverage matrix

The rewritten architecture must preserve the following subjects:

| Legacy Q | Required destination |
| --- | --- |
| 1 consensual divorce | H2 1–2 |
| 2 foreign spouse / foreign registration | H2 1 and 5 |
| 3 house paid by foreign spouse | H2 6 |
| 4 mediation appearance | H2 3 |
| 5 support and property calculation | H2 6–7 |
| 6 property evidence and strategy | H2 6 and 11 |
| 7 property distribution versus support | H2 7 |
| 8 divorce while child/property disputes remain | H2 8 |
| 9 required registration documents | H2 2 and 5 |
| 10 expected duration | H2 3 |
| 11 judicial-divorce grounds | H2 4 |
| 12 responsible spouse petition | H2 4 |
| 13 mediation versus litigation | H2 3 |
| 14 amount of post-divorce support | H2 7 |
| 15 unmarried partners | H2 7 |
| 16 changing child arrangements | H2 8 |
| 17 changing child support | H2 9 |
| 18 blocked contact or visitation | H2 9 |
| 19 review or appeal | H2 3 and 11 |
| 20 adultery and property distribution | H2 6 |
| 21 adultery and responsible-spouse petition | H2 4 |
| 22 in-laws, support, and separate tort claims | H2 7 |
| 23 life or death unknown / missing spouse | H2 4 |
| 24 months away from home | H2 4 |
| 25 relocation to Korea and child support | H2 10 |

Dedicated tests must lock at least one exact proposition for every row rather
than merely checking that the destination heading exists.

## Official primary-source contract

Every locale must use exactly these ten official URLs once each, under the
localized `Official Sources` H2, in this order and with native labels:

1. Taiwan Civil Code:
   `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000001`
2. Official English translation of the Taiwan Civil Code:
   `https://mojlaw.moj.gov.tw/ENG/LawContentE.aspx?LSID=FL001351`
3. Family Act:
   `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0010048`
4. Civil Procedure Code Article 303:
   `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=303&pcode=B0010001`
5. Regulations Governing Family Non-Contentious Matter Interim Measures:
   `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0010056`
6. Household Registration Act:
   `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0030006`
7. Ministry of the Interior Household Registration Department divorce
   registration guide:
   `https://www.ris.gov.tw/documents/html/2/3/1/384.html`
8. Act Governing the Choice of Law in Civil Matters Involving Foreign
   Elements:
   `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000007`
9. Constitutional Court Judgment 112-Hsien-Pan-4:
   `https://cons.judicial.gov.tw/docdata.aspx?fid=52&id=310013`
10. Official English Constitutional Court judgment:
   `https://cons.judicial.gov.tw/en/docdata.aspx?fid=5534&id=352234`

Do not cite blogs, law-firm articles, news reports, social media, generated
summaries, or a foreign jurisdiction's unsourced explainer as authority.

The article may state that the official sources were checked on 2026-07-25,
but must not promise that no later amendment, decision, or administrative
change can affect an individual matter.

## Related-guidance links

Use exactly three native links under the final H2 and no other internal links:

- KO:
  - `[대만 가사소송 서비스](/ko/services/family)`
  - `[대만 소송 변호사 안내](/ko/taiwan-litigation-lawyer)`
  - `[상담 문의](/ko/contact)`
- ZH-Hant:
  - `[台灣家事法律服務](/zh-hant/services/family)`
  - `[台灣訴訟律師指南](/zh-hant/taiwan-litigation-lawyer)`
  - `[聯絡諮詢](/zh-hant/contact)`
- EN:
  - `[Taiwan Family Law Services](/en/services/family)`
  - `[Taiwan Litigation Lawyer Guide](/en/taiwan-litigation-lawyer)`
  - `[Contact Us](/en/contact)`
- JA:
  - `[台湾の家事事件サービス](/ja/services/family)`
  - `[台湾訴訟弁護士ガイド](/ja/taiwan-litigation-lawyer)`
  - `[お問い合わせ](/ja/contact)`

Do not allow `/ko/` in ZH-Hant, EN, or JA. Locale tests must assert the exact
three targets and reject the other three locale prefixes.

## Voice, identity, privacy, and disclaimer

Use a neutral educational voice. Remove:

- emotional statements about not wanting to let a spouse go;
- moral judgment about adultery or marital fault;
- advice to gain an advantage or make the other side pay;
- promises that a lawyer can protect all rights or achieve a favorable split;
- comment, direct-message, rapid-response, urgency, or result-guarantee calls
  to action;
- hypothetical details that could be read as a confidential client story; and
- gendered assumptions such as wife, husband, mother, or father when spouse or
  parent is sufficient.

End each article with a native educational-purpose disclaimer followed by the
exact canonical author identity and nothing else:

- KO: `**증준외 변호사(曾雋崴, Wei Tseng)**`
- ZH-Hant: `**曾雋崴律師（Wei Tseng）**`
- EN: `**Wei Tseng (曾雋崴), Attorney-at-Law**`
- JA: `**曾雋崴弁護士（Wei Tseng）**`

The disclaimer must state that the article is general information, not advice;
that jurisdiction, applicable law, recognition, facts, evidence, existing
orders, and current official rules can change the result; and that individual
deadlines must be calculated from the correct triggering event before action.

## Forbidden legacy strings and claims

Locale tests must prohibit the relevant native equivalent of:

- both residual-property distribution and spousal support must be claimed
  within five years of divorce;
- all matrimonial property is divided half and half;
- average monthly consumption decides spousal support;
- a house can definitely be recovered because premarital funds paid for it;
- title conclusively defeats every ownership or reimbursement claim;
- foreign marriage or divorce is handled only under local law;
- first register the marriage in Taiwan or file a lawsuit are the only two
  choices;
- receipt of a judgment or mediation record starts every thirty-day period;
- the responsible or adulterous spouse cannot petition before legislation is
  amended;
- the constitutional judgment has already repealed Article 1052's proviso;
- a responsible spouse necessarily loses parental responsibility or must pay
  child support as punishment;
- a police missing-person report is always a prerequisite;
- an action demanding cohabitation is always a prerequisite;
- several months away from home is itself a divorce ground;
- child-support modification requires an unforeseeable event;
- blocked contact automatically permits force or a change of parental
  responsibility;
- Korean cost of living by itself controls child support;
- the Hague Child Abduction Convention automatically governs Taiwan;
- `댓글`, `私訊`, `DM`, `reply promptly`, `お気軽にコメント`;
- a non-KO article's `/ko/` route;
- another locale's visible prose except a necessary official Chinese legal
  title paired with a native explanation; and
- the wrong attorney character form `曾俊瑋`.

## Locale sequencing and ownership

Complete one locale at a time:

1. KO;
2. ZH-Hant;
3. EN;
4. JA;
5. synchronize public archive, related cards, service references, search
   surfaces, and KO/ZH-Hant/EN consultation embeddings.

For each locale:

- create a locale-specific work order containing exact title, six FAQ pairs,
  thirteen H2s, image alt, official-source labels, internal links, disclaimer,
  author, length/read-time formula, required phrases, and forbidden phrases;
- obtain an executable-plan review before editing;
- assign one writer ownership of only the locale Markdown file and one new
  dedicated locale test;
- do not let the writer edit another locale, shared data, the master contract,
  embeddings, public surfaces, builder data, route code, or another test;
- obtain one independent current-Taiwan-law review and one independent native
  language/editorial review;
- send every correction to the same writer and repeat both reviews until both
  pass;
- run the dedicated test plus generic locale corpus tests, alias/loader tests,
  typecheck, scoped ESLint, and `git diff --check`;
- render and inspect desktop and mobile;
- click all four mobile flag controls and verify target path and `html lang`;
- make one manager-owned exact local commit only after all gates pass.

Writers and reviewers must not stage, commit, push, deploy, publish, or operate
a server. Only the manager may make the approved local commit. Push and
deployment require separate user approval.

## Dedicated test minimums

Each locale-specific test must verify:

- exact complete frontmatter and six ordered FAQs;
- sole H1 equal to title;
- exactly one contracted image and no `img-01.jpg`;
- exactly thirteen ordered H2s;
- every FAQ answer exactly twice and as the assigned H2's first paragraph;
- at least one exact proposition for every legacy coverage-matrix row;
- Article 1050 elements;
- Article 1052 paragraph 1/2 structure and the qualified constitutional
  judgment rule;
- Article 1030-1 exclusions, adjustment, and two-year/five-year rule;
- Article 1056 versus Article 1057 versus child support;
- Articles 1055 and 1055-1 and the child's best interests;
- Article 1116-2 continuing child-support duty;
- Family Act Articles 13 and 194 and Civil Procedure Code Article 303
  qualifications;
- foreign-document authentication and translation qualification;
- no treaty-application shortcut;
- exactly ten official links in order and once each;
- exactly three same-locale internal links in order and once each;
- exact disclaimer and author ending;
- forbidden legacy claims and wrong identity absent;
- no wrong-locale route or visible script leakage;
- canonical and alias loader behavior;
- visible-length count and calculated locale read time; and
- no accidental loss of title, FAQ, source, or body during rendering.

Tests must use exact assertions for contracted propositions. A keyword-only
test, snapshot without semantic assertions, or a test that merely reproduces
the implementation is not sufficient.

## Public-surface synchronization after all four articles pass

Do not perform this work in a locale-writing commit.

The bounded public-sync unit must update and test:

- the four family-service related-column titles in `src/data/site-content.ts`;
- KO, ZH-Hant, and EN `divorce-qna` archive titles, summaries, keywords, and
  read-time presentation in `src/data/insights-archive.ts`;
- any separate service-detail references to this slug;
- any public search fixture or source that duplicates the title or summary;
- metadata/JSON-LD expectations generated from the article;
- the `divorce-qna` alias and canonical routes;
- sitemap parity;
- search results for native divorce terms in KO, ZH-Hant, and EN; and
- whether Japanese archive/search product exposure remains intentionally
  unavailable or requires a separately approved architecture unit.

Use the canonical article titles above. Public summaries must state that the
guide covers Taiwan divorce routes, cross-border records, matrimonial
property, post-divorce rights, and minor children without promising an
outcome.

Add a dedicated cross-surface regression test that compares the public title
and slug references against the four approved sources.

## Consultation embeddings after public synchronization

Do not hand-edit vectors.

After KO, ZH-Hant, and EN public copy is synchronized:

1. call the official local build-embeddings API;
2. require a complete result with no skipped expected document;
3. verify that each of the three 007 entries contains its exact canonical title
   and a current localized body snippet;
4. verify model, dimension, finite values, unique keys, locale counts, and
   local/private-Blob byte equality where the configured endpoint writes both;
5. run the dedicated embedding-content-sync test and consultation regressions;
6. make a separate manager-owned local commit.

Japanese is not part of the current consultation embedding schema because the
public Japanese site does not expose that product. Do not widen the schema
inside this unit. If Japanese search or consultation becomes public, create a
separate architecture and product-copy work order.

## Browser and release gates

Use the already running local site or start one manager-controlled server on a
known port. Writers and reviewers do not operate it.

For each locale, at desktop and mobile widths, verify:

- canonical 007 route loads;
- exact localized title and expected H2/FAQ content are visible;
- `html lang`, canonical, alternate links, Article JSON-LD, FAQ JSON-LD, and
  breadcrumb JSON-LD are locale-correct;
- the image loads and its alt is native;
- official and internal links are correct;
- there is no horizontal overflow at document, article, table, source list,
  or profile/sidebar level;
- no wrong-locale text or route appears;
- no console error, page error, failed request, or bad response occurs; and
- mobile flag controls display and navigate as:
  - `🇰🇷 KR` → `/ko/...`;
  - `🇯🇵 JP` → `/ja/...`;
  - `🇹🇼 TW` → `/zh-hant/...`;
  - `🇺🇸 EN` → `/en/...`.

After the four locale commits, public sync, and embeddings pass:

- run all focused 007 tests;
- run generic four-locale column and content tests;
- run public archive, services, route, sitemap, SEO, search, consultation, and
  flag-switcher regressions;
- run typecheck;
- run scoped ESLint for every touched source and test;
- run `git diff --check`;
- run a clean production build;
- repeat the desktop/mobile four-locale browser matrix; and
- obtain one final independent cross-locale legal review and one final
  implementation review.

Do not push or deploy.
