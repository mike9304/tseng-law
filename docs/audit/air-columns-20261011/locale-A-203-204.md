# Independent Traditional Chinese locale review — A-203 / A-204

Review date: 2026-10-11 (Asia/Taipei). Reviewer: independent AI editorial reviewer `/root/review_a_zh34`; not the author, a human native speaker, or a licensed-lawyer reviewer. Manuscripts were read-only throughout this review. The author confirmed an initial freeze and then a bounded-repair freeze; the reviewer independently recomputed both final SHA-256 values below.

## Reviewed versions and disposition

| Article | SHA-256 | Result |
|---|---|---|
| `src/content/columns-zh/516-coowned-house-court-partition-taiwan.md` | `cfa2bafe1f96496236b5f8a803d05d3fa88f3abe025c8ee8084a845af30d1065` | PASS |
| `src/content/columns-zh/517-custom-goods-online-seven-day-cancellation-taiwan.md` | `6ebe71a5d85f7293287092c9245dad09360834ea002cd01d33ec5e554a78820a` | PASS — repair R1 independently checked |

Initial 517 SHA-256 `6d036e8d7cac15e01993f96800da9c624ed228caa712d0ac63221fee3debbd12` received REQUEST_CHANGES for the three opening edits preserved below as review history. All three were resolved in repair R1; the final disposition above supersedes that initial request. 516 is unchanged.

Rules read: `/Users/son7/tseng-air-1011/RULES.md`, repository `AGENTS.md`, full `docs/columns/EDITORIAL-VOICE.md`, `docs/columns/FRONTMATTER.md`, tseng-law-editorial `SKILL.md` and `references/review-criteria.md`. This review does not authorize shipping; the lane's Claude Code review remains required.

## Required editorial repair — resolved in R1

No material legal error was found in the reviewed text. The following deletions were required by the explicit opening-deletion rule, rather than a change to statutory scope. File/line references in this findings table identify the initial frozen text. Each finding is now resolved.

| File:line | Exact sentence | Reason and evidence | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| `517-custom-goods-online-seven-day-cancellation-taiwan.md:18` | 網購商品標上「客製化」，不會單憑這個名稱就排除七日解除權。 | The next sentence already gives the two substantive requirements. Removing this sentence leaves the decision, conditions and context intact; it also avoids repeating the title's question. | Delete this sentence and revise the remaining sentence to: `[通訊交易解除權合理例外情事適用準則第2條](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0170012)將「依消費者要求所為之客製化給付」列為七日解除權的例外，但也要求業者已告知消費者排除這項權利。` | Yes. Actual customization and disclosure remain cumulative conditions; the quoted statutory term and source remain. |
| `517-custom-goods-online-seven-day-cancellation-taiwan.md:18` | 實際製作內容與告知，兩者都要成立。 | Repeats the immediately preceding sentence's express 「而且」 condition. No distinct fact, qualification or practical consequence is lost by deletion. | Delete after preserving the two conditions in the preceding sentence. | Yes; neither condition is relaxed. |
| `517-custom-goods-online-seven-day-cancellation-taiwan.md:20` | [消費者保護法第2條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0170001&flno=2)的當事人與交易條件，仍是判斷起點。 | The preceding two sentences already explain the covered parties, transaction conditions and limits. 「仍是判斷起點」 adds an abstract signpost, not a new rule. Its source link must be retained. | Attach the same Art. 2 link to the paragraph's actual definition sentence and delete this final sentence. Suggested definition: `[消費者保護法第2條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0170001&flno=2)所指的通訊交易，是消費者以消費為目的，在未能檢視商品的情況下與企業經營者訂立的契約。` Retain the next sentence's qualified exclusions. | Yes. Consumer purpose, business counterparty, inability to inspect and the qualified exclusions remain. This article is expressly about goods. |

No manuscript edit was made by the reviewer. No substantive correction was required. The author independently identified the first-paragraph redundancy while preparing its source note; the independent review confirmed the issue rather than accepting an author PASS. The orchestrator authorized the repair and the author applied it.

## First two paragraphs: sentence-by-sentence deletion test

The test below uses the initial frozen versions, with Markdown destinations omitted from quotations for readability. Each sentence was considered separately, not merely each paragraph as a block.

### 516

| Sentence | Result of deleting it | Decision |
|---|---|---|
| 房屋為分別共有時，依民法第823條，各共有人原則上「得隨時請求分割共有物」。 | Loses the affirmative right, the separate co-ownership scope and the opening's source anchor. The next sentence qualifies that right and benefits from its explicit premise. | Retain. |
| 能否立即請求分割，仍受法令、房屋使用目的與不分割約定限制；方法談不攏，可請法院決定，但不保證一定能按持分換回現金。 | Leaves the quoted at-any-time right without its immediate limitations and removes the practical distinction between seeking partition and obtaining cash. Later sections expand these conditions rather than replacing the opening's bounded premise. | Retain. |
| 登記持有房屋二分之一，表示對整棟房屋的權利比例，不是已經分到某一層或某幾間房。 | Removes the concrete explanation of a fractional interest versus a physically allocated room or floor. | Retain. |
| 這是民法第817條所說的應有部分；目前由誰居住，也不能直接代替分割方案。 | Removes the statutory name/source for the fractional right and the distinct limit on treating current occupation as an agreed partition. | Retain. |

### 517

| Sentence | Result of deleting it | Decision |
|---|---|---|
| 網購商品標上「客製化」，不會單憑這個名稱就排除七日解除權。 | The next sentence still states the actual requirements; no separate condition or context disappears. | Delete as recorded above. |
| 通訊交易解除權合理例外情事適用準則第2條要求的是「依消費者要求所為之客製化給付」，而且業者已告知消費者將排除這項權利。 | Removes the precise quoted category, cumulative disclosure condition and official source. | Retain the substance in one direct sentence. |
| 實際製作內容與告知，兩者都要成立。 | The previous sentence already says both must apply. | Delete. |
| 這套規則適用於消費者以消費為目的，未能檢視商品就與企業經營者訂立的通訊交易。 | Removes the transaction and party boundaries needed to understand who has the right. | Retain; integrate the Art. 2 source here. |
| 一般店面購買、營業採購或個人間轉售，不能只因曾用網路聯絡就一律套用。 | Removes practical limits relevant to readers who may equate all online contact with a covered consumer transaction. 「不能…一律」 preserves fact-dependent application instead of declaring all sales by individuals exempt. | Retain. |
| 消費者保護法第2條的當事人與交易條件，仍是判斷起點。 | No new legal information is lost once the link moves to the actual definition. | Delete, preserve its source. |

### R1 recheck of the actual final 517 opening

| Final sentence | Fresh deletion result and meaning check |
|---|---|
| 通訊交易解除權合理例外情事適用準則第2條將「依消費者要求所為之客製化給付」列為七日解除權的例外，但也要求業者已告知消費者排除這項權利。 | Retain. It now states the answer once: exact statutory customization category plus notice of exclusion. Removing it loses both the operative exception rule and its source. The quote, source and AND condition are unchanged. |
| 依消費者保護法第2條，這套規則適用於消費者以消費為目的，未能檢視商品就與企業經營者訂立的通訊交易。 | Retain. Identifies purpose, counterparty and inability-to-inspect conditions; the Art. 2 link was moved here as requested. Removing it loses the rule's scope. |
| 一般店面購買、營業採購或個人間轉售，不能只因曾用網路聯絡就一律套用。 | Retain. Gives the practical applicability limit without categorically exempting every individual seller. It does not repeat either preceding sentence. |

The reviewer reread the complete repaired 517 file. The later disclosure timing, seven-day and four-month rules, dispatch rule, nonconformity distinction, disclaimer, metadata and image text remain as reviewed. 516's hash is unchanged. There is no open repair request.

## Live official-source check

The reviewer opened the following MOJ pages during this run. The law database displayed an editorial consolidation cutoff of 2026-10-02; the live-access date is 2026-10-11. This distinction is an evidence limit, not a claim that later unlisted changes were independently checked in all official gazettes.

| Source | Verified proposition and article fit |
|---|---|
| [Civil Code Art. 817](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=817) | Co-owners hold rights by their fractional interests in one thing. 516 correctly distinguishes a one-half interest from ownership of particular physical rooms. |
| [Civil Code Art. 823](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=823) | Right to request partition and its legal, purpose-based and contractual limits. Five-year default contractual cap, thirty-year cap for immovable property with a management agreement, reduction of excessive terms, and the major-reason exception are preserved. The draft expressly says these are not filing deadlines. |
| [Civil Code Art. 824](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=824) | Agreement-first rule; inability to agree or refusal after completed prescription; in-kind allocation, allocation to some co-owners where allocation to all is manifestly difficult, cash compensation, justified continued co-ownership of part, conditional sale or mixed allocation, and equal-terms priority purchase with the co-owner-buyer exception and lottery are accurately bounded. No guaranteed forced buyout or immediate auction is promised. |
| [Civil Code history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001) | The current pending-effect notice concerns Arts. 166-1 and 1223, not the assigned 817/823/824 propositions. History identifies the 2009 amendments including 823/824 and their six-month commencement rule. |
| [Consumer Protection Act Art. 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0170001&flno=2) | Consumer purpose, business operator and the inability-to-inspect communication transaction are consistent with 517. The text does not categorically exempt every individual seller merely because the seller is an individual. |
| [Consumer Protection Act Art. 18](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0170001&flno=18) | Clear written information at contracting, including withdrawal method/period and statutory exclusion; online disclosure must permit complete viewing and storage. The draft appropriately distinguishes a post-delivery reply from evidence of notice at contracting. |
| [Consumer Protection Act Art. 19](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0170001&flno=19) | Seven-day no-reason withdrawal by returning goods or writing; no fee or consideration; dispatch within time suffices. The next-day restart after supplying omitted Art. 18(1)(3) information and the four-month outer limit retain their correct trigger. Unlawful contractual restrictions are invalid. The text does not turn four months into a universal custom-order return period. |
| [Consumer Protection Act history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=J0170001) | Current revision listed as 2015-06-17; Art. 2(10)/(11) and Arts. 18–19-2 commenced on 2016-01-01 by the listed Executive Yuan order. No pending-effect status for these provisions was shown. |
| [Reasonable Exceptions Regulation Arts. 2–4](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0170012) | Art. 2 requires both a listed exception and notice; its customization category matches the retained quotation. Art. 3 preserves applicable withdrawal provisions in announced mandatory/prohibited standard terms. Art. 4 states commencement on 2016-01-01. 517 does not equate the exception with a waiver of all nonconformity remedies. |

The article uses illustrations of possible documents and order terms, not purported court findings. Neither reviewed draft cites a judgment, invented client or claimed outcome. No foreign legal rule is imported.

## Three recent same-locale comparisons

Dates below are the local comparator frontmatter dates, not independent confirmation that their current versions are publicly deployed. All three list both `published` and `lastmod` as 2026-10-10. Openings, headings and endings were read directly.

| Comparator | Concrete comparison with 516 | Concrete comparison with 517 |
|---|---|---|
| `src/content/columns-zh/502-limited-company-shareholder-exit-transfer-taiwan.md` — 公司繼續營業，股東想退出：出資轉讓的價款、同意與交接 | 502 opens with a shareholder's exit transaction and a hypothetical incomplete exit agreement. 516 instead opens with partition entitlement and explains a fractional right before the available methods. Both distinguish an ownership interest from an automatic cash entitlement, but concern different parties, assets and statutes. 502's headings follow consent, price, closing and guarantees; 516 follows non-partition limits, allocation and sale. | 502 has a two-paragraph situation setup. After the proposed deletions, 517 starts with one operative exception rule and one transaction-scope paragraph, followed by order proof, notice timing and distinct remedies. It does not copy 502's transaction sequence. |
| `src/content/columns-zh/503-parent-capacity-guardianship-assistance-authority-taiwan.md` — 父母難以表達意思時，子女能代簽哪些文件？ | 503 begins by rejecting possession of seals/passbooks as general agency authority, then distinguishes capacity from diagnosis. 516 addresses registered co-ownership and partition; its references to residence do not become an agency issue. Its ending identifies existing agreements and proposed division, rather than reusing 503's medical/authority preparation and contact paragraph. | Both clarify that an everyday label or circumstance does not itself settle a legal question. 517's edited opening gives the exception rule directly, without imitating 503's inventory of family documents or repeated negatives. Its ending distinguishes nonconformity from withdrawal and contains no copied consultation invitation. |
| `src/content/columns-zh/504-ai-product-open-source-license-delivery-taiwan.md` — AI 產品要交付了，開源套件的授權文件誰來準備？ | 504 opens with software components and a delivery-document gap, then assigns contractual responsibility. 516 uses a rights-based opening and property-allocation alternatives; it does not reuse 504's component list or delivery/update headings. | 504's question is which supplier prepares version-linked license material; 517's is whether a seller can establish individualized performance plus notice. The document-evidence theme is common professional subject matter, but proof sought, actors, legal rules and section sequence differ. 517 does not reproduce 504's source-list and consultation close. |

All three comparators include a contact invitation. Neither reviewed draft forces one into its short treatment. This complies with the editorial rule that a factual article may stop when its useful information ends. There is no asserted service, fee, foreign license or named attorney credential to validate in these two texts.

## Duplication, length, terminology and media

- 516 is ordinary separate co-ownership partition, not the inherited-property registration deadline covered by column 230. Its final scope paragraph expressly excludes undivided estates, condominium common parts, agricultural special rules and execution procedure.
- `src/content/columns-ja/348-taiwan-cross-border-ecommerce-consumer-protection-japanese-sellers.md` (published/lastmod 2026-10-07) was read as the closest cross-locale overlap. It is a broad Japanese-seller guide covering jurisdiction, seven exception categories, standard terms, labeling, customs and complaints. 517 develops a Taiwan consumer's evidence question: requested design/size, confirmed order version, contracting-time notice and separating nonconformity from no-reason withdrawal. Shared citations to Arts. 18/19 and the regulation do not make the new article a duplicate or a translation. The specialized order-proof question is not developed in 348.
- A targeted Traditional Chinese corpus search for 七日解除／七天鑑賞／客製化／共有物分割／裁判分割／分割共有 found the assigned drafts plus generic customization mentions in tax columns 303 and 306. These tax mentions do not answer either draft's legal decision. The lane's separate overlap audit also identifies unordered-delivery 157 and gym-prepayment 163 as distinct adjacent topics. This locale review does not claim a semantic audit of every historical article in every language.
- On the final files, substantive reader-visible nonspace body length is 1,023 characters for 516 and 956 for repaired 517. Counting excludes frontmatter, headings, link destinations and the final dated disclaimer; punctuation/digits count. Han-only figures are 910 and 861, respectively. Both fit the comparable 900–1,400-character short-column range measured as visible body characters. Initial 517 measured 1,009 nonspace / 907 Han characters; no filler was added after deleting repetition. Counts and absence of bold were independently rechecked on the final files.
- Traditional Chinese terms are natural Taiwan usage: 分別共有、應有部分、原物分配、金錢補償、優先承買、消滅時效、通訊交易、解除權、定型化契約、企業經營者. No Simplified Chinese, imported legal category, ornamental four-character padding or compulsory checklist structure was found. The modality distinguishes 得／可, conditional results and actual disclosure duties.
- Both frontmatters retain `audience: ["zh-hant"]`, `author: "legal-ai-assistant"`, source-review date, and image captions disclosing generated illustrative media. No public AI-author footer or human-review claim appears. No bold markers, emoji, unpublished internal instruction or office-address claim appears in either draft.
- The reviewer opened both final WebP files. 516 shows cropped anonymous participants, a house model and plan on a table; 517 shows cropped hands holding a patterned cup with samples and packaging. Both match their alt text. Neither depicts an identifiable person, prominent readable text or logo. The captions correctly deny evidentiary status and, for 517, avoid treating the image as proof of legal customization. Image-generation provenance itself belongs to the lane's separate image evidence record.

## Evidence limits and bounded next step

Neither article has an unresolved locale or material legal finding in this scope. 517's one bounded repair pass is complete and independently checked against its final hash. The next step is the separately assigned final review and the lane's required Claude Code shipping review; this PASS does not replace either gate.

This is an AI manuscript/source/asset review, not human-native-speaker or licensed-attorney certification. It does not certify a rendered desktop/mobile page, full build, test suite, live publication or the final Claude Code shipping gate. The completed source note `/Users/son7/tseng-air-1011/lanes/columns/work/A-203-204.md` was read after repair R1 and matches the final hashes. The legal checks above were independently performed against live MOJ text before relying on the author's note. The note discloses a failed regulation-history endpoint; the successfully read official full-text regulation supplies publication and commencement dates directly, so no claim in this review depends on the failed endpoint.
