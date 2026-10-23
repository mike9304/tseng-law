# Arabic independent locale review — 699–703 — r1

Latest status: repair-pass-1 recheck below is `PASS` for all five final hashes. The original r1 findings remain as review history; see the final addendum for the current decision and remaining non-locale limits.

Reviewed on 2026-10-23. Reviewer: independent AI Arabic editorial reviewer (`/root/review_ar`), not the author of any assigned article. This is not a claim of review by a human native speaker or licensed lawyer. Only this report was written; article, code, registry and deployment files were not edited.

Overall result: `REQUEST_CHANGES` for the narrow corrections below. The manuscripts are generally clear professional Modern Standard Arabic. No shared-tool Arabic PASS, browser/RTL-rendering PASS or publication claim is made. The three closing-paragraph findings are editorial repairs, not findings that those articles' legal rules are false.

## Reviewed versions and article decisions

Base path: `/Users/son7/tseng-market-columns-20261023/repo/src/content/columns-ar/`.

| ID / file | SHA-256 | Decision | Bounded reason |
|---|---|---|---|
| 699 `699-uae-importer-taiwan-supplier-advance-refund.md` | `527d2c80320eb001b64c4f9aef0fb2f3a2d8478f8b1626a48aafa2553a68c246` | REQUEST_CHANGES | R4: final sentence is generic disclaimer language instead of the article's concrete closing fact. No material statutory mismatch found in the checked claims. |
| 700 `700-saudi-arbitral-award-taiwan-assets.md` | `5b1a5f4e94ec63c7ead7c225bf25b41c53f9ab1dd0c80ad52af93cffa28d73ed` | REQUEST_CHANGES | R1: definition should expressly say foreign arbitral award; R2: recognition respondent wording needs a natural precise formulation. |
| 701 `701-uae-court-judgment-taiwan-enforcement.md` | `71d9975cadacf8f6601abde4defa31ad05944513a09d95190467b1480dbc43a3` | REQUEST_CHANGES | R3: subject/verb agreement in the sentence assigning the decision to the court. |
| 702 `702-overseas-heir-taiwan-estate-nationality-documents.md` | `a5ed4e810563ac78cf10fc458a963e5f98b727ae8f2994fc3d510c8a0538d90d` | REQUEST_CHANGES | R5: generic last sentence; preserve all nationality, Taiwan-heir proviso and conditional deadline language. |
| 703 `703-uae-resident-taiwan-counsel-arabic-documents.md` | `ed0d77a18eecd1d7a6fe9684a2250dcb6e2db94d52a7fa55f5ef7acf497355ad` | REQUEST_CHANGES | R6: finish with the authority/document decision while retaining the no-engagement/deadline disclaimer. |

Visible-body whitespace word counts independently reproduced, excluding frontmatter and sources, retaining headings/FAQs: 699=685, 700=721, 701=736, 702=731, 703=701. No padding or substantial rewrite is requested.

## Required bounded corrections

The line numbers below refer to the hashes above. Existing Markdown source links must remain in place in replacement sentences. R1 is a scope clarification tied to the official definition; the other changes preserve the existing legal meaning.

| Finding / file:line | Exact sentence or smallest affected span | Reason and evidence | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| R1 — 700:26 | `الحكم الأجنبي بأنه حكم صادر خارج تايوان، أو صادر داخلها وفق قانون أجنبي.` | In a definition, `الحكم الأجنبي` can include a foreign court judgment. Article 47 defines a foreign arbitral award specifically. This matters because 701 correctly uses a different route for a UAE court judgment. [Official Arbitration Law, art.47](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=I0020001). | `تعرّف [المادة 47 من قانون التحكيم التايواني](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0020001&flno=47) الحكم التحكيمي الأجنبي بأنه حكم تحكيم صادر خارج تايوان، أو صادر داخلها وفق قانون أجنبي.` | Clarifies the intended statutory category; it narrows the literally overbroad noun. Treat as a source-backed scope correction, not a claim that every foreign judgment follows art.47. |
| R2 — 700:42 | `للمطلوب الاعتراف ضده طلب الرفض خلال 20 يومًا من استلام تبليغ طلب الاعتراف` | `المطلوب الاعتراف ضده` is an awkward calque: the recognition concerns an award in a party's face, not recognition of/against that person. The 20-day clock and receiving party must remain clear. [Art.50](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=I0020001). | Replace the first sentence of this paragraph with: `يجوز للطرف المطلوب الاعتراف بالحكم في مواجهته أن يطلب رفض الاعتراف، لأحد الأسباب الواردة في [المادة 50](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=I0020001)، خلال 20 يومًا من تسلّمه تبليغ طلب الاعتراف.` Keep the following grounds and the start-date clarification. | Yes. Same respondent, grounds, 20 days and notice-receipt trigger; no new creditor filing deadline. |
| R3 — 701:50 | `أما تقدير النتيجة في الطلب التايواني فتبقى للمحكمة.` | `تقدير` is masculine, so `فتبقى` has no agreeing subject. This is an actual grammar error, not a preference for a different legal conclusion. | `أما القرار في الطلب التايواني فيبقى للمحكمة.` | Yes. The court still decides; reciprocity is neither established nor rejected in advance. |
| R4 — 699:68 | `هذه معلومات عامة عن مطالبة تجارية، وليست قبولًا للتوكيل أو تقييمًا لاستحقاق دفعتك.` | `MONOTONY: §5(7) closing — generic disclaimer after a long intake sentence — retain the disclaimer but finish on the contract/payment/default evidence for this purchaser's refund claim.` The useful body ends at 52, then the present final sentence returns to a general formula. | Replace only that last sentence with: `لا تحسم هذه المعلومات العامة استحقاق دفعتك ولا تنشئ توكيلًا؛ وتبدأ مراجعة المطالبة بمطابقة العقد والتحويل وموعد التسليم ودليل الإنذار.` | Yes. General-information/no-entitlement/no-retainer limits remain. The evidence list already appears in the article; no new legal prerequisite is asserted. |
| R5 — 702:72 | `هذا بيان عام وليس تحديدًا لحصتك أو قبولًا للتوكيل.` | `MONOTONY: §5(7) closing — generic share/retainer disclaimer — end with the nationality/family/assets evidence that this overseas-heir article actually adds.` | `لا يحدّد هذا البيان العام حصتك ولا يعني قبول التوكيل؛ ويبدأ ملف التركة بوثائق جنسية المتوفى عند الوفاة، وما يثبت القرابة، وقائمة الأصول والديون.` | Yes. No inheritance shares, assumed nationality or new deadline; the existing conditional art.1174 text stays untouched. |
| R6 — 703:76 | `هذا شرح عام؛ إرسال الرسالة لا يثبت قبول التوكيل أو الالتزام بإجراء قبل موعدك.` | `MONOTONY: §5(7) closing — generic email/engagement ending — preserve this useful warning, then tie the last sentence to the scope of the signed mandate.` | `هذا شرح عام، وإرسال الرسالة لا يثبت قبول التوكيل أو الالتزام بإجراء قبل موعدك. وعند إعداد الوكالة، تُربط كل صلاحية بالإجراء الذي تريد من المحامي أن يتولاه.` | Yes. No no-travel or deadline-service guarantee; no automatic acceptance. The authority scope is already the article's central subject. |

These are one local repair pass. They do not justify rewriting sound legal passages, adding foreign-law advice or varying legal modal verbs merely for style.

## Optional style notes — not additional release blockers

| File:line | Exact span | Observation | Optional replacement / preservation |
|---|---|---|---|
| 702:28 | `لا يوجد لهذا الملف «قانون ميراث شرق أوسطي» واحد؛ بل` | The article properly avoids treating the region as one jurisdiction, but this clause rebuts a proposition the reader did not expressly make. The preceding sentence already separates residence, language, nationality and religion. | Start the second sentence with `تُحدَّد الدولة والقواعد المنطبقة على المتوفى والعلاقة الأسرية المعنية قبل اقتراح توزيع.` It preserves the actual-country inquiry and removes only the abstract rebuttal. |
| 703:48 | `تقدير صحة المحرر الرسمي الأجنبي` | Understandable legal Arabic, though `صحة` can suggest validity/content truth. Art.356 concerns authenticity (`真偽`). | If revising, use `تقدير أصالة المحرر الرسمي الأجنبي`. Do not change it to a claim that authentication proves the truth of every statement or every substantive legal effect. |

`النزول عن الميراث` in 702 is formal but intelligible and consistent with existing Arabic 016. It is not necessary to replace it with `التخارج`, which may imply a different transaction. The writing explicitly describes a written renunciation before the court, so no terminology-only rewrite is required.

## First-two-paragraph deletion test

I read each sentence of the first two body paragraphs with it mentally removed, rather than accepting the author report's result. The following records the information retained or the bounded repair suggested. Link labels below represent the rendered text.

| Article | Paragraph 1 test | Paragraph 2 test |
|---|---|---|
| 699 | `إيصال التحويل من بنك في الإمارات يثبت دفع المال` identifies payment evidence versus the actual seller; the next sentence supplies the seller/invoice/payee/delivery-date matching task; `قد يختلف الاسم التجاري عن الاسم القانوني.` adds the trade-name/legal-name explanation. Removing any one loses a concrete reason or task. Retain. | The first sentence blocks seller-location-only governing-law inference; art.20 supplies party choice and closest connection; the forum clause remains a separate decision; `الشرح التالي لفسخ العقد يفترض انطباق القانون التايواني.` expressly limits all ensuing rescission analysis. Retain the conditional scope. |
| 700 | The definition is necessary but requires R1. `لهذا يبدأ ملف الدائن السعودي` connects award place, agreement and procedure to actual records. The institution-name sentence prevents identifying the award place by institutional branding. Retain all three after R1. | Recognition/final-judgment effect and the separate asset-enforcement step are both needed. `ثم يبدأ التنفيذ على الأصول.` is short and purposeful. The final sentence supplies the bank-delivery and New York Convention limits. No generic article-plan sentence to delete. |
| 701 | `حصلتَ على حكم مالي في الإمارات` is a direct reader scenario and question, not a claimed client case. The statute sentence adds cumulative finality/non-refusal/Taiwan-permission requirements. The case-file sentence identifies the immediate documentary action. Retain. | Exact issuing court, emirate, case number and later decisions are needed. The next sentence excludes interim orders and awards from the court-money-judgment scope. Removing it would invite the 700/701 procedure confusion. Retain. |
| 702 | `جنسية المتوفى وقت الوفاة` fixes the legally relevant person and time; art.58 adds the Taiwan-national-heir/Taiwan-assets proviso; the Taiwan-bank sentence makes clear that asset location alone does not select inheritance shares. Retain. | Residence and Arabic language are expressly separated from citizenship/religion. The second sentence's operative country/family-rule inquiry is useful; the quoted regional-law rebuttal is removable without loss (optional note above). |
| 703 | `عبارة «متابعة القضية»` makes the authority issue concrete. Art.70 supplies the special-power rule and examples. `تُراجع هذه الأفعال في نص الوكالة وترجمته قبل التوقيع.` adds an actual original/translation comparison. Retain. | The four available consultation languages are essential. The next sentence places communication arrangements before translation expense or sensitive originals. This limitation is proportionate and must not be softened into a promise of Arabic service. |

No opening uses an unlabelled invented client narrative or claims professional experience. The five openings use payment evidence, a statutory category, a reader's procedural question, a governing-law fact, and a mandate phrase. The two legal-rule openings are 2/5, not a majority.

## Actual same-locale comparisons

I inspected these three source articles' openings, headings and endings, and their available date fields. They lack `published`; their dates below are display date and `lastmod`, not newly verified public publication dates. Fresh live publication order could not be established in this review. This is an explicit limit, not an invented third comparator.

| Existing source | Available dates | Concrete comparison with the new batch |
|---|---|---|
| `repo/src/content/columns-ar/016-taiwan-inheritance-custody-analysis.md` | Display 13 September 2025; lastmod 2026-10-11 | Opens `عندما يتوفى أحد أفراد الأسرة لا يبدأ إجراء واحد فقط.` and then enumerates inheritance, marital property, minors and guardianship. Eleven numbered sections and a long generic end disclaimer. New 702 is substantially narrower: nationality at death, documentary proof, bank/land handling and the conditional renunciation deadline. It does not reproduce heir-share tables or the broad custody explanation. R5 prevents copying the old generic closing rhythm. |
| `repo/src/content/columns-ar/017-taiwan-logistics-business-setup.md` | Display 13 September 2025; lastmod 2026-10-07 | Opens with broad logistics/licensing distinctions; second paragraph announces `يميّز هذا المقال بين ...`. Numbered licensing/acquisition/outsourcing sections. The new 699–703 avoid an article-plan paragraph and numbered checklist headings, and begin at a specific dispute or authority decision. |
| `repo/src/content/columns-ar/018-taiwan-semiconductor-market-entry.md` | Display 17 September 2026; lastmod 2026-10-07 | Opens with multiple operating requests and a company-formation question, followed by a broad scenario disclaimer. Long numbered headings and two intake paragraphs end the article. The new articles use short issue-specific headings and one inquiry paragraph each. New 700/701 end in the actual judgment/service records; 699/702/703 require the short closing repairs above. |

The old 016/017 raw source bylines are not copied into the new articles. Their public stripping/rendering is outside this assigned content review. The old articles were not otherwise certified or edited.

## Section 5 sentence-variety recheck

1. Executed the required shared CLI independently on all five frozen files. It auto-selected `[ko]` for Arabic. Every command returned exit 1; the output below is an unsupported-language diagnostic, not a native-language failure or an Arabic PASS. No shared code was changed, no wrong `--lang` was passed to obtain a pass, and no prose change is requested merely to satisfy Korean character metrics.
2. Opening types are varied as recorded above. No stock `Suppose`-type opener or fabricated anecdote.
3. Meaningful short sentences exist in each: 699 `الإيصال جزء من الدليل.`; 700 `يحفظ الدائن هذه السلسلة كاملة.`; 701 `لهذه الصياغة حدود محددة.`; 702 `قد يحمل المتوفى أكثر من جنسية.`; 703 `وتبقى النسخة الأصلية محفوظة إلى جانب الترجمة.` The independent diagnostic below found more than two short sentences in every article. The long statutory conditions were not fragmented so far that their logic was lost.
4. Paragraph first words were read vertically. No normalized first word occurs more than twice; Arabic conjunction-prefix variation was read for meaning, not used as a mechanical evasion. In 701, two consecutive `لا` paragraphs address distinct reciprocity issues; they are not a three-paragraph repeated opener.
5. No three consecutive claim/citation/caveat paragraphs. Uncited documentary-preparation paragraphs occur in each article; consequential legal propositions retain source links.
6. Necessary legal distinctions remain (party/forum, court judgment/award, recognition/enforcement, procedural power/document authentication). No generic contrast formula dominates. 702's regional-law rebuttal is an optional shortening; it is not a warrant to erase jurisdiction differences.
7. 700 and 701 already finish with their actual judgment/service-file evidence. 699, 702 and 703 need R4–R6. This is the substantive manual MONOTONY finding; it is independent of the unusable Korean CLI score.
8. Professional MSA is maintained. No bold, fictitious lawyer first person, public byline or imperative checklist heading. R2/R3 are the concrete language repairs. There is no claim of review by a human Arabic speaker.
9. No draft was edited during review. Proposed rewrites preserve sources, clocks, amounts, conditional law application, may/must distinctions and the real consultation limits. R1's narrower defined category is explicitly marked as a source-backed scope clarification.

### Required CLI evidence

Command executed once per exact file in the version table:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-market-columns-20261023/repo/src/content/columns-ar/<exact-file-name>
```

| ID | Language selected | Exit | Actual metric line / FAIL items |
|---|---|---|---|
| 699 | ko | 1 | `sentences=16 mean=204.1 cv=0.339 short=0.0 run3=0.143 opener_rep=0.0 cite_end=0.0 cite_para=0.312 contrast=0 caveat=0 q=0`; FAIL `len_cv=0.339`, `short_share=0.0` |
| 700 | ko | 1 | `sentences=17 mean=201.9 cv=0.385 short=0.0 run3=0.333 opener_rep=0.0 cite_end=0.0 cite_para=0.294 contrast=0 caveat=0 q=0`; FAIL `len_cv=0.385`, `short_share=0.0`, `even_run3=0.333` |
| 701 | ko | 1 | `sentences=17 mean=210.4 cv=0.32 short=0.0 run3=0.333 opener_rep=0.118 cite_end=0.0 cite_para=0.118 contrast=0 caveat=0 q=0`; FAIL `len_cv=0.32`, `short_share=0.0`, `even_run3=0.333` |
| 702 | ko | 1 | `sentences=17 mean=199.9 cv=0.375 short=0.0 run3=0.0 opener_rep=0.059 cite_end=0.0 cite_para=0.294 contrast=0 caveat=0 q=0`; FAIL `len_cv=0.375`, `short_share=0.0` |
| 703 | ko | 1 | `sentences=17 mean=185.1 cv=0.455 short=0.0 run3=0.2 opener_rep=0.059 cite_end=0.0 cite_para=0.353 contrast=0 caveat=0 q=0`; FAIL `short_share=0.0` |

Independent Arabic-readable diagnostic: strip frontmatter/source tail, replace Markdown links with visible labels, exclude headings/list items from prose paragraphs, split at `.`, `؟`, `!`, and count whitespace words. These are descriptive measurements, not calibrated Arabic thresholds and not a replacement for the actual reading.

| ID | Prose sentences | Mean words | Word-length CV | Sentences at most 8 words |
|---|---:|---:|---:|---:|
| 699 | 44 | 14.55 | 0.508 | 10 |
| 700 | 42 | 15.93 | 0.457 | 8 |
| 701 | 39 | 17.64 | 0.495 | 6 |
| 702 | 43 | 15.63 | 0.447 | 7 |
| 703 | 41 | 14.93 | 0.447 | 8 |

The Arabic word-count diagnostic is not interchangeable with Korean character CV or with the author's slightly different tokenization. In particular, the unsupported CLI's claimed zero short sentences is contradicted by the visible short Arabic sentences; that does not authorize a fabricated shared-tool PASS.

## Targeted source/meaning checks

Official text was opened through the web research tool on 2026-10-23. This is documentary source checking, not browser UI or a fresh local-origin HTTP/deployment check. The Chinese database pages displayed a compilation cutoff of 2026-10-16; a review date must not be described as proof that every law changed that day.

- 699: [choice-of-law art.20](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=B0000007), [Civil Code 254](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=254), [259](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=259), [CPC 523](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=523) and [526](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=526) support the bounded account. UAE purchaser/supplier roles remain correct. No invented cure-day count, security ratio, automatic fraud or automatic freeze appears.
- 700: the [official Arbitration Law](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=I0020001), arts47–51, supports the separate recognition route, Chinese translations, respondent's notice-based 20 days, mandatory public-order/nonarbitrability grounds and discretionary reciprocity ground. R1 fixes the defined noun. Saudi reciprocity is expressly unproved. No New York Convention shortcut is promised. The compressed art.51 discussion does not promise a stay; a final legal reviewer may retain its short conditional framing without adding a new foreign-law procedure.
- 701: [CPC402](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=402) and [Enforcement Act4-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010004&flno=4-1) match the four grounds, narrow default-service exception, permission judgment and venue. The actual court/emirate is requested, and UAE reciprocity is not invented. R3 is grammar only.
- 702: [foreign-elements law arts2/5/38/58/60/61](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=B0000007), [Land Act18](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060001&flno=18) and [Civil Code1174](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1174) preserve the applicable-law sequence and conditional three-month rule. The Taiwan-national-heir proviso and successor-heir notice/impossibility exception remain. The Civil Code page expressly flags the 2026-08-17 art.1223 amendment as commencing six months after promulgation; this article contains no future forced-share table. No UAE/Saudi land-reciprocity finding or assumed religion is supplied.
- 703: [CPC69](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=69), [70](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=70), [132](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=132), [203](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=203), [207](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=207), [356](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=356) and [BOCA's foreign-document guidance](https://www.boca.gov.tw/fp-208-459-2e385-2.html) were opened. General/special powers, each-instance rule and notarized exception, service, possible personal attendance, interpretation and authentication remain distinct. No UAE-specific chain, automatic apostille acceptance, guaranteed remote completion or firm-provided Arabic interpreter is asserted. BOCA guidance is dated 2017-08-10, not a new 2026 rule.

English single-article URLs for CPC69/70 failed in the web tool; the Chinese official single-article pages opened successfully. No inaccessible URL was treated as verified merely because its shape looked plausible.

## FAQ, CTA, images and source/RTL hygiene

- Each article contains three frontmatter FAQs and three visible FAQ questions. Their answers are consistent with the body's limits. In 701 the third visible FAQ concerns the case file while the third frontmatter FAQ concerns reciprocity; both are supported by the body, so this is not a contradictory legal answer.
- Every article uses a same-locale contact link and one email address. The inquiry asks for a non-sensitive summary/party identity, Taiwan connection and actual deadlines; the whole Arabic file is not demanded immediately. Actual EN/ZH/JA/KO consultation limits remain, with Arabic communication to be arranged. No Arabic service or overseas licensure is claimed.
- Independently viewed all three reused local images. 699/703 accurately describe blank paper/pen/wooden tray; 700/701 accurately describe an empty stone colonnade; 702 accurately describes a folder, pen, wooden figures, schematic family lines and Taipei skyline. The captions identify illustrations and do not claim real case documents, a specific court or client family.
- Read-only source scan: all five have 0 directional override/isolate characters, 0 prohibited bold markers and equal inline-official-source/end-source URL sets. English email and Western numerals are logically correct in source. This does not prove line wrapping, link order, numeral direction or keyboard behavior in the rendered RTL layout. Browser use was not attempted because root reported the admin-policy denial.
- Internal `author: legal-ai-assistant`, Arabic audience, dates and source-check headings are retained. No public author/footer was added.

## Narrow UI-copy request from root

Proposed string `مقالات مقترحة للقراء بالعربية` is understandable but has an awkward attachment of `بالعربية`. Recommended: `مقالات مقترحة باللغة العربية` (recommended articles in Arabic). If reader wording is essential, `مقالات مقترحة لقرّاء العربية` is also natural. Neither describes the Middle East as a single jurisdiction. Root owns the code change; this report does not certify that it was implemented or rendered.

## Handoff

Author/root should apply R1–R6 in one bounded repair, preserve all cited links and substantive conditions, then return the exact changed files for hash-based recheck. Optional notes do not require a broader rewrite. The independent legal/final reviewer should retain the documented foreign-reciprocity, document-authentication and current-law boundaries. Compiled route checks, PC/mobile RTL appearance, final legal review and actual publication remain outside this locale-review result.

## Repair-pass-1 recheck / r2 — current locale decision

Rechecked on 2026-10-23 by the same independent reviewer, still not the author. Result: `PASS` for 699–703 at the exact hashes below. R1–R6 are resolved. No unresolved material Arabic-language or claim-scope finding remains in this assigned locale review. The optional notes above were not applied and remain optional; they do not reopen the completed bounded repair.

| Article | Final SHA-256 | Current decision |
|---|---|---|
| 699 `699-uae-importer-taiwan-supplier-advance-refund.md` | `1c6d5764d793ddeb9b6d3cb4af7d3bce88b227eb9881380a90e25cd8cc9059ac` | PASS |
| 700 `700-saudi-arbitral-award-taiwan-assets.md` | `02c3dbdd2c6f01803df16717c3f8ad3f4675afd15c5db1e27e1b303cb57405ef` | PASS |
| 701 `701-uae-court-judgment-taiwan-enforcement.md` | `792f66668b4be257ac9449fb6ac2edff4ff9f4b2d109f836ce45b4fa43a4c51e` | PASS |
| 702 `702-overseas-heir-taiwan-estate-nationality-documents.md` | `fc53ac19ca796b8f39323fc3f440caf1da48c8ac7b7ef17c74c5872f7956b7be` | PASS |
| 703 `703-uae-resident-taiwan-counsel-arabic-documents.md` | `17818fc8f10fb8b811996533e6b57fa9315d55750e29aa62f25c633051c1e3c5` | PASS |

### Direct repair verification

- R1/700:26 now defines `الحكم التحكيمي الأجنبي` and repeats `حكم تحكيم` in the definition. This matches the previously opened art.47 and keeps court judgments outside the arbitral-award definition. The following recognition/effect/enforcement paragraph remains coherent with that express antecedent.
- R2/700:42 now uses `الطرف المطلوب الاعتراف بالحكم في مواجهته`. The party, enumerated grounds, `20 يومًا` and receipt-of-petition-notice trigger are preserved. I reread the following grounds, severability paragraph and Saudi-reciprocity limitation; no new automatic recognition or creditor filing deadline was introduced.
- R3/701:50 now reads `أما القرار في الطلب التايواني فيبقى للمحكمة.` The grammar is correct. The surrounding reciprocity discussion, narrow default-service exception and art.4-1 permission/venue conclusions are unchanged.
- R4/699:68 now ends with contract, transfer, delivery-date and notice evidence. It retains general-information, no-entitlement and no-engagement limits. I reread the neighboring FAQs: governing-law/default conditions and nonautomatic attachment remain intact. This is preparation guidance, not a claim that the listed documents alone prove entitlement.
- R5/702:72 now ends with nationality-at-death, kinship and assets/debts evidence. It adds no fixed shares or nationality-specific conclusion. The neighboring art.1174 paragraph and FAQ still condition the three-month rule on its applicability and keep the knowledge-of-entitlement trigger and notice exception.
- R6/703:76 preserves the no-engagement/no-deadline-service warning and ends with matching each mandate power to the intended procedure. The personal-appearance/interpreter section and FAQs still reject a no-travel guarantee. The real consultation-language boundary remains unchanged.

Independent integrity check: for each current file, I reversed the exact reported replacement(s) in memory only, then computed SHA-256. All five reconstructed hashes exactly matched the r1 hashes in this report (`exact_requested_changes_only=True` for all five; replacement counts 1,2,1,1,1). Thus the six requested replacements are the entire content change since my r1 review; no frontmatter, official URL, deadline, FAQ, image, attribution or other passage changed. No manuscript was written by this reviewer.

### Recheck evidence and limits

I reran the required shared CLI for all five final paths. It still selected `[ko]` and returned exit 1 for every Arabic article: 699 CV0.357/short0; 700 CV0.394/short0/run3 0.333; 701 CV0.320/short0/run3 0.333; 702 CV0.400/short0; 703 short0. These are the same unsupported-language categories documented in r1, not a new Arabic-language finding. This manual locale PASS is explicitly not a shared-CLI Arabic PASS.

A fresh read-only source scan on the final hashes found equal inline/end official-source URL sets, zero prohibited bold markers and zero directional override/isolate characters in each file. The corrected opening and final sentences were read in context; the earlier three-comparator/deletion analysis remains applicable because the reverse-hash check confirmed no other prose changed. The manual §5(7) closing findings are resolved.

Actual desktop/mobile RTL visual verification remains incomplete. This report still does not certify rendered direction, line wrapping, keyboard behavior, source-link HTTP availability, final independent legal clearance, build, deployment or publication. Root and `/root/final_iberia_arabic` should use the final hash table above, not the historical r1 REQUEST_CHANGES table.
