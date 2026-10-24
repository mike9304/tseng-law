# Arabic market 699–703 independent review

Review date: 2026-10-24. Reviewer: `/root/market_review_ar`, an AI editorial reviewer who did not author these five manuscripts. Scope: actual Arabic prose, current consequential Taiwan-law claims, first-two-paragraph deletion tests, three same-locale comparators, original public diff, metadata/FAQ and actual referenced images. No publication or human/native-lawyer review is claimed.

## Final decision — all five PASS, including final-review follow-up

The separate repair author `/root/market_review_ar/repair_ar_market` implemented R1–R8 in700–703. This reviewer reread the actual final diff and affected opening/FAQ/conclusion context, reran the shared CLI independently on all five files, and verified original links, body numeric tokens and every frontmatter value except the authorized lastmod change.699 stayed unchanged. All findings below are resolved; the R1 section is retained as the audit trail.

| Article | Final decision | Final SHA256 | Final CLI evidence |
|---|---|---|---|
|699|PASS|`1c6d5764d793ddeb9b6d3cb4af7d3bce88b227eb9881380a90e25cd8cc9059ac`|44sentences, CV0.517, short0.227, exit0/FAIL0|
|700|PASS|`83f59b9e7226cb0fe1179e61ed7e21da2ca883b4ae72e6345080a6cb183671ec`|40sentences, CV0.481, short0.200, exit0/FAIL0|
|701|PASS|`60ceafe3ad1a8501fbf4e0fb280aedf08d3342b8cb15450035e011497f1465f5`|35sentences, CV0.489, short0.143, exit0/FAIL0|
|702|PASS|`ef2194e02154f5e4abb76df92e183ddd0a31f2a6777da032c705e422865a34de`|42sentences, CV0.452, short0.167, exit0/FAIL0|
|703|PASS|`17a3d3093807398e25fe590ba983a90c956a0e63ca5f69479793204ff2a1ec3f`|42sentences, CV0.466, short0.214, exit0/FAIL0|

Independent execution receipts: `market-ar-variety-r2.json` for the initial locale repair, and `market-ar-final-followup-check.json` for the final701 hash above. Both verify `same_urls=true`, `same_body_numeric_tokens=true`, `same_frontmatter_except_lastmod=true` for the changed texts. The follow-up additionally confirms the other four article hashes are unchanged. Modified700–703 use lastmod2026-10-24; original published/date_display, FAQ metadata, images and internal author remain. The three image byte hashes are unchanged from the visually reviewed assets. `git diff --check -- <five assigned paths>` returned exit0 with no output. No bold or public byline was introduced.

Resolution details:700 now asks for the notice records directly and states Saudi reciprocity uncertainty without a regional-language rebuttal.701 keeps the creditor's viewpoint and removes an empty warning while preserving the exact default-service exception.702 replaces the unnecessary regional-law inference with the document inquiry and fixes the issuing-authority phrase. Its final FAQ answer is `لا يكفي ذلك وحده.`: a natural complete sentence whose demonstrative refers to the property location already stated in the question; the following choice-of-law sentence and Article58 exception remain. The initial longer suggested answer produced CV0.444; it was replaced by this more concise idiomatic answer, with no added filler or unrelated sentence mergers.703 directly gives the four consultation languages and asks to confirm language/translation arrangements without promising Arabic service or an interpreter.

The final manual section5 checks remain satisfied after the reductions: useful short sentences, varied openings, no new repetitive paragraph pattern, preserved sources and legal strength, topic-specific ending documents, no sales guarantee or fabricated experience. This is locale/editorial readiness at the exact hashes above; root's independent final legal review and release/public readback remain separate.

### Final legal-reviewer prose follow-up on701

The independent `/root/final_market_crossborder` reviewer found one further bounded style issue at the then-current701:48/50, hash `1ff5cfa3353bec1a4ea265aa1952dc4faeb562035ccef74948ffb9da1b7f7f71`: `لا يثبت هذا المقال…` was editorial self-commentary, followed by the unasked regional rebuttal `لا تُنقل نتيجة تخص دولة خليجية إلى دولة أخرى.` The separate repair author changed only these two paragraphs to:

> يتطلب تقييم الاعتراف المتبادل في المادة 402 مصادر تخص النظام القانوني والمحكمة المعنيين، وقد يستدعي تقديم نصوص أو سوابق وشرح للقانون الأجنبي. وعند جمع مواد عن تنفيذ الأحكام الأجنبية داخل الإمارات، يلزم بيان صلتها بالاعتراف بالأحكام التايوانية. وتفصل المحكمة التايوانية في الطلب.

I read the final actual diff, the unchanged preceding/following enforcement context, and the FAQ/closing consequences. This keeps the specific UAE legal-system/court inquiry, Article402 reciprocity condition and Taiwan court's decision. It makes no reciprocity finding, treaty requirement, automatic-enforcement promise or foreign-law-service claim. The original Article402 numeric reference remains, all URLs and body numeric tokens match the public baseline, and FAQ/closing text is byte-unchanged. The fresh actualCLI on701 returned exit0/FAIL0; the other four exact hashes remain approved. No filler or unrelated edits were introduced. Locale verdict at the new701 hash is PASS; final reviewer receives this frozen version for its own conclusion.

## R1 decision and exact versions

All paths are under `repo/src/content/columns-ar/`.

| Article | Decision | SHA256 | Reason |
|---|---|---|---|
| 699-uae-importer-taiwan-supplier-advance-refund.md | PASS | `1c6d5764d793ddeb9b6d3cb4af7d3bce88b227eb9881380a90e25cd8cc9059ac` | No material legal or prose issue identified. |
| 700-saudi-arbitral-award-taiwan-assets.md | REQUEST_CHANGES | `02c3dbdd2c6f01803df16717c3f8ad3f4675afd15c5db1e27e1b303cb57405ef` | R1–R2: rhetorical rebuttals add an unnecessary lecturing tone. |
| 701-uae-court-judgment-taiwan-enforcement.md | REQUEST_CHANGES | `792f66668b4be257ac9449fb6ac2edff4ff9f4b2d109f836ce45b4fa43a4c51e` | R3–R4: reader viewpoint changes to advice addressed to another lawyer; empty warning sentence. |
| 702-overseas-heir-taiwan-estate-nationality-documents.md | REQUEST_CHANGES | `fc53ac19ca796b8f39323fc3f440caf1da48c8ac7b7ef17c74c5872f7956b7be` | R5–R7: unnecessary reader-assumption rebuttal, awkward issuing-authority wording and abrupt FAQ answer. |
| 703-uae-resident-taiwan-counsel-arabic-documents.md | REQUEST_CHANGES | `17818fc8f10fb8b811996533e6b57fa9315d55750e29aa62f25c633051c1e3c5` | R8: describe actual available consultation languages directly. |

`git diff 174454bd -- <five assigned paths>` returned no diff before this review. The five starting files are byte-identical to the original published baseline; the integration of the separately reviewed market25 did not change Arabic. Hash and image receipts: `market-ar-baseline-images.json`.

## Bounded repair findings

These are prose corrections, not changes to legal substance. Keep all original source URLs, conditions, uncertainty, three-month and 20-day calculations, published/date_display and internal author. Change lastmod to 2026-10-24 only on modified files. Do not change images. Suggested wording may be polished within the stated bounds; never add filler or combine unrelated sentences to satisfy a metric.

| ID / file:line | Exact sentence or necessary span | Why | Proposed bounded repair | Legal meaning preserved? |
|---|---|---|---|---|
| R1 / 700:40 | `هذا السؤال يتطلب ملف تبليغ، لا جوابًا عامًا بأن «الجميع عرف بالقضية».` | After the concrete notice/due-process question, this invents a careless answer from the reader and then rebukes it. The following document list already gives the useful action. | Delete this sentence; retain the question and the following list beginning `تُحفظ إشعارات التعيين`. | Yes. Notice and opportunity to defend remain. |
| R2 / 700:50 | `لا تتضمن هذه القاعدة شهادة مسبقة بوجود المعاملة بالمثل مع السعودية أو بانتفائها.` / `كما لا يصح نقل نتيجة تخص دولة أخرى إلى الحكم السعودي لمجرد اشتراك الدولتين في لغة أو منطقة جغرافية.` | `شهادة مسبقة` is an unnecessarily elaborate metaphor; the final sentence argues against a language/geography inference the reader has not made. Preserve the actual unresolved reciprocity condition. | `لا يُفترض توافر المعاملة بالمثل مع السعودية أو انتفاؤها. يتطلب تقييم هذا الشرط بحثًا قانونيًا محددًا، وقد يحتاج الملف إلى مواد رسمية أو شرح للقانون الأجنبي.` | Yes: neither Saudi reciprocity nor its absence is asserted. |
| R3 / 701:34 | `اختيار المحكمة في العقد معلومة مهمة للفحص، لكن لا يصح تقديمه للعميل على أنه ضمان قبول مسبق في تايوان.` | The column addresses the judgment creditor, but suddenly instructs a professional what to tell a client. | `ويُفحص بند اختيار المحكمة ضمن هذه الوقائع، دون افتراض أنه يكفي وحده للاعتراف بالحكم في تايوان.` | Yes: Taiwan-law jurisdiction scrutiny and no guarantee are preserved. |
| R4 / 701:40 | `لهذه الصياغة حدود محددة.` | Deleting it loses no rule, exception or practical action; the preceding sentence states the precise service exception and the next explains the geographical limit. | Delete only this sentence. | Yes. |
| R5 / 702:28 | `إقامة الوارث في الإمارات أو السعودية لا تختصر هذا البحث، كما أن القراءة بالعربية لا تدل على جنسية أو ديانة. لا يوجد لهذا الملف «قانون ميراث شرق أوسطي» واحد؛ بل تُحدَّد الدولة والقواعد المنطبقة على المتوفى والعلاقة الأسرية المعنية قبل اقتراح توزيع.` | MONOTONY: rebuttal framework — language/religion and an invented single regional law are defended against at length. The first paragraph has already identified the decedent's national law. Tell the overseas heir what records determine the inquiry. | `بالنسبة إلى الوارث المقيم في الإمارات أو السعودية، تُحدَّد الدولة والقواعد المنطبقة على المتوفى والعلاقة الأسرية من وثائق الجنسية والأسرة، قبل اقتراح توزيع للتركة.` The FAQ's residence-alone limitation remains intact. | Yes. No assumption of nationality, religion or a foreign inheritance rule is added. |
| R6 / 702:36 | `وسلطتها التي أصدرتها` | The pronoun creates an unnatural relation: the document has an issuing authority, not “its authority which issued it.” | Replace with `والجهة التي أصدرتها`. | Yes. |
| R7 / 702:62 | `لا وحده.` | The reader can infer that `وحده` refers to `وجود المال`, but the clipped response reads awkwardly in an explanatory legal FAQ. State the limited effect directly. | `لا يكفي وجود المال في تايوان وحده.` Keep the following choice-of-law sentence and Article58 protection. | Yes. |
| R8 / 703:28 | `لغات الاستشارة المعلنة للمكتب هي الإنجليزية والصينية والكورية واليابانية؛ نشر هذا المقال بالعربية لا يَعِد باستشارة عربية أو بمترجم يوفره المكتب.` | The language limitation is important; a statement about what publication “does not promise” makes the passage read like internal compliance instructions. The live contact page confirms four languages and no interpreter commitment. | `تُقدَّم الاستشارات بالإنجليزية والصينية والكورية واليابانية. إذا كنت تفضّل التواصل بالعربية، فتُؤكَّد ترتيبات اللغة والترجمة قبل إرسال أصول المستندات أو تكليف مترجم بالملف كاملًا.` Replace the two-sentence paragraph coherently; do not imply that the firm offers Arabic consultations or supplies an interpreter. | Yes. Service availability and need to confirm arrangements remain. |

## Opening deletion tests

- 699:26: The receipt/contract/beneficiary comparison is a concrete evidential problem. First sentence supports the next action and stays. The legal-vs-trade name sentence gives a distinct reason for checking names. 699:28 preserves applicable-law and forum separation; the Taiwan-law assumption is necessary, not a disposable “this article explains” introduction.
- 700:26: Statutory foreign-award definition is needed to identify the relevant procedure; institution/place distinction belongs to this question. 700:28 distinguishes recognition from enforcement. Both paragraphs retain useful facts after sentence-by-sentence deletion testing.
- 701:26: Second-person question is a generic reader situation, not a purported real case. Taiwan permission-to-enforce rule is immediate. 701:28 identifies exactly which court order is covered and keeps arbitral/interim documents outside this article. No material opening omission requested.
- 702:26: Nationality at death, protected Taiwanese heir, and Taiwan-located estate are distinct necessary propositions. 702:28 adds only the overseas-reader frame after deletion of the regional-law/language rebuttal; R5 preserves that useful frame.
- 703:26: “Following up the case” versus concrete special powers is an immediately relevant agency question. 703:28 adds real service-language information; retain its function with R8's direct wording.

## Same-locale comparison

Inspected opening two paragraphs, headings and final substantive/disclaimer paragraphs in three nearby existing Arabic articles. These are actual source files, not newly invented samples:

| Comparator | Source date metadata | Concrete comparison |
|---|---|---|
| `016-taiwan-inheritance-custody-analysis.md` | date_display 13 September2025; lastmod 2026-10-11 | Long “distinguish these many matters” introduction; numbered broad family-law sections; long generic disclaimer.702 is usefully narrower: nationality/documents before distribution, not another general share/custody overview. Do not copy the old source byline into the new article. |
| `017-taiwan-logistics-business-setup.md` | date_display 13 September2025; lastmod 2026-10-07 | Opens with label-versus-actual-operations distinction and a paragraph forecasting the article. Current699/703 give concrete documents/powers sooner and do not copy the numbered-section pattern. |
| `018-taiwan-semiconductor-market-entry.md` | date_display 17 September2026; lastmod 2026-10-07 | Opens with several operational requests and a reader question, then instructs internal structuring; the close is a longer consultation preparation passage. Current701 has a narrower enforcement question; R3 removes a stray professional-to-professional voice. |

The sources' old publication dates do not establish their Arabic translation/release dates; no such release-date claim is made here. The five current openings are not one repeated formula: document proof, statutory definition, concrete enforcement question, applicable-law rule, and agency wording. The two rule-led openings are2/5, below half of the batch.

## Current official-source verification

Opened the following official live pages on 2026-10-24. This review verifies the claims in these articles, not an exhaustive UAE/Saudi law opinion or an assertion that reciprocal recognition is available. The Taiwan statute database displayed its consolidated-data cutoff as 2026-10-16. The CivilCode site flags future/noncommenced provisions166-1/1223, which are not the provisions relied on here.

- 699: [choice-of-law Act20](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=B0000007) — party choice and fallback to most closely connected law. [CivilCode254](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=254) — demand with reasonable performance period and subsequent rescission on nonperformance. [CivilCode259](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=259) — restitution subject to statutory/contractual variation and interest from receipt. [CPC523](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=523) and [526](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=526) — risk to execution, prima-facie showing and security. Foreign buyer residence alone is not equated with foreign execution; the special matrimonial security cap is not misapplied to this commercial claim.
- 700: [ArbitrationAct47–51, full current text](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=I0020001) — foreign-award definition, recognition effect, documents and Chinese translation/certification, mandatory versus discretionary refusal,20days from notification, severable excess, and possible stay when annulment/suspension is sought. The article does not assert Saudi reciprocal recognition or bypass recognition through the NewYorkConvention.
- 701: [CPC402](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=402) and [CompulsoryEnforcementAct4-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010004&flno=4-1) — four recognition objections, exact default-service exception, Taiwan judgment permitting execution, debtor-domicile court and property/execution-place fallback when no Taiwan domicile. No UAE-specific reciprocity or finality result is invented.
- 702: [choice-of-law Act2/5/60/61](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=B0000007), [58 Chinese](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=58) and [38](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=38) — multiple-nationality closest connection, subnational/personal-law determination, national law at death and protected Taiwanese heir, distinct will-form/effect rules, situs principle. [LandAct18](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060001&flno=18) — reciprocity condition, without asserting any Gulf nationality's eligibility. [CivilCode1174](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1174) — written renunciation to court within3months of knowing entitlement, subsequent written notice with inability exception. Article appropriately conditions this on Taiwan-law applicability.
- 703: CPC [69](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=69), [70](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=70), [132](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=132), [203](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=203), [207](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=207), [356](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=356) — written authority/each instance and notarized exception, special authority and limits, service on counsel, personal appearance and foreign-document translation, hearing interpretation, foreign public-document authenticity. [BOCA guidance](https://www.boca.gov.tw/fp-208-459-2e385-2.html) supports routing authentication by document-origin country without a blanket legalization rule.

The live [Arabic contact page](https://tseng-law.com/ar/contact) could not be retrieved by the web tool, then was successfully retrieved by curl with a fresh command-local DoH address and normal TLS verification (exit0,114231bytes). It confirms English/Chinese/Japanese/Korean consultations and `wei@hoveringlaw.com.tw`. Raw readback: `market-ar-contact.html`. Repository corroboration: `src/data/international-inquiry-copy.ts:511` and `src/data/international-guidance-content.ts:2500`. No Arabic consultation, interpreter provision, foreign licensure or outcome promise was added to these manuscripts.

## Images and alt/captions

All three actual WebP assets were opened visually, covering all five references. There are no missing assigned heroes. Reuse is explicit:699/703 share one asset;700/701 share another. These are illustrative images, not article-specific actual court or case photographs.

| Articles | Image actually seen | Alt/caption judgment |
|---|---|---|
| 699/703 | Blank paper and pen inside a wooden tray on a wooden table, harbor/boats through a window | Both localized alt descriptions accurately describe the scene. Captions correctly avoid presenting a contract or usable POA form. |
| 700/701 | Empty stone colonnade and court-like open terrace with long soft light/shadows | Both alt descriptions fit. Captions explicitly avoid identifying an actual relevant court/tribunal. |
| 702 | Closed dark folder, pen, two wooden human shapes, anonymous family-relationship diagram, Taipei101 outside | Alt/caption fit the image. No real-family/document claim; no identifying text. |

Image paths, byte sizes and exactSHA256 are in `market-ar-baseline-images.json`. Images were not edited. Visual source inspection is not browser/mobile layout QA.

## Variety and section5 manual review

Actual command on each file: `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <file> --lang ar`.

| Article | Sentences | CV | Short fraction | Similar-length run3 | Exit / FAIL |
|---|---:|---:|---:|---:|---|
|699|44|0.517|0.227|0.000|0 /0|
|700|42|0.469|0.190|0.050|0 /0|
|701|39|0.505|0.154|0.108|0 /0|
|702|43|0.451|0.163|0.049|0 /0|
|703|42|0.452|0.190|0.050|0 /0|

Full output and source hashes: `market-ar-variety-r1.json`. Manual review confirms at least two genuine short sentences per article, different opening types, no sustained repeated paragraph opener, no three consecutive claim/citation/caveat paragraphs, and uncited practical/document paragraphs. Each close returns to documents central to its topic; contact/language/no-retainer boundaries are true rather than promotional. No bold emphasis, fabricated first-person event, public AI/human byline, unsupported foreign credentials, or new numerical/legal condition was found. R1/R2/R4/R5 show why metric PASS does not by itself approve prose. Article702/703 have thin CV margin, but the repairer must preserve readable connected prose, not add empty metric-padding sentences.

## Limits and next step

R1's requested repairs are now completed and independently rechecked in the FinalR2 section above. Root arranges independent final legal review and the publication path; this report is not release evidence.
