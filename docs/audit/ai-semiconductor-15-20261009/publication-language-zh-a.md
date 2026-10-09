# Independent zh-hant publication review A

Review date: 2026-10-08. Reviewer: `tseng-editor-zh-hant`, manually loaded from the saved role. This reviewer authored none of the assigned articles. Manuscripts remained read-only; only this report is owned. Scope: integrated 484, 485, 486 and 488, including frontmatter, body, source framing and reader-facing ending. This is an independent language/editorial review with bounded legal-source checks; the separate final legal review and release checks remain necessary.

Version note: the article sections and original table below document the historical 2026-10-08 freeze. The 2026-10-09 metadata-only addendum and CURRENT PASS table at the end identify the current certified file hashes. No new source-law review is claimed for October 9.

Read in full: publication worktree `AGENTS.md`, `docs/columns/EDITORIAL-VOICE.md`, shared editorial skill and `references/review-criteria.md`.

## Actual same-locale comparators

All three were read in full using `git show 58e184f6:<path>`; no comparator was substituted by an inventory summary. All were published 2026-10-08. No comparator was unavailable.

| Path at 58e184f6 | Opening, structure and ending evidence |
|---|---|
| `src/content/columns-zh/420-taiwan-threats-coercion-messages-evidence.md` | Opens with the concrete evidence problem, 「有人傳訊說要傷害你」, then an immediate-safety paragraph. Headings distinguish the legal questions and usable records. The body ends with existing protection orders and latest messages to supply to authorities; no forced consultation pitch. |
| `src/content/columns-zh/419-taiwan-suspended-sentence-obligations-revocation.md` | Opens with dates/hours/requirements in the judgment annex, then distinguishes the suspended-sentence period from the original prison term. Headings follow eligibility, supervision, revocation and expiration. Ends with separate dates to record; sources follow. |
| `src/content/columns-zh/418-taiwan-sexual-assault-report-evidence-victim-support.md` | Opens with whether medical evidence can be collected before deciding to complain, then immediate safety and available evidence. Headings follow treatment, complaint support, accompaniment and distinct deadlines. Ends with checking complaint status and evidence storage with responsible services. |

The useful shared convention is a concrete decision followed by its conditions, not a mandatory question lead or identical checklist. The assigned business columns are assessed against that convention without importing these criminal-law articles' safety language.

## 485 — PASS

Path: `src/content/columns-zh/485-taiwan-manufacturing-ai-data-trade-secrets.md`  
SHA-256: `df6f8ab1174e1b09fa6bd5244a34f77e40b59abc8afcee1b6de6738bd79a61d9`

Title and summary identify the wafer-data disclosure decision and accurately distinguish confidentiality from removing a customer name. No separate `seoTitle` exists. Metadata retains `author: legal-ai-assistant`, date 2026-10-08 and the zh-hant audience; there is no public AI byline, invented human author, promotional credential or consultation promise. The ending gives a concrete incident response and evidence-preservation next step rather than a sales CTA.

First-two-paragraph deletion test (lines 16 and 18):

| Sentence | Deletion result |
|---|---|
| 「刪掉客戶名稱，不能據此認定晶圓缺陷影像或製程紀錄已可交給外部 AI。」 | Keep: removing it loses the specific erroneous disclosure assumption being corrected. |
| 「如果影像仍附帶批次、機台與製程參數，接收者可能從資料組合辨識未公開的製造條件。」 | Keep: supplies the causal example behind the first sentence; the possibility qualification is appropriate. |
| 「研發部門可在送出前，先確認分析真正需要哪些欄位、誰有權交付，以及服務商可以如何使用。」 | Keep: supplies the responsible department, timing and three distinct scope questions. |
| 「資料是否受營業秘密法保護，須逐項檢查第2條的三個要件：非一般涉及該類資訊之人所知；因秘密性而具有實際或潛在經濟價值；所有人已採取合理保密措施。」 | Keep: defines the legal threshold and prevents treating all manufacturing information as a trade secret. |
| 「標註『機密』本身，不能證明三個要件都已齊備。」 (article uses Chinese double quotation marks) | Keep: separates a label from evidence that all three requirements exist. |

Comparison: like 420, the opening tells the reader which records matter, but centers on permission to disclose rather than preserving a threat message. Unlike 419's chronological post-judgment structure, this article follows authorization, vendor uses, ownership and an incident response. Unlike 418's opening question and safety paragraph, it begins with a narrow proposition and statutory threshold. Its headings and ending fit the manufacturing buyer's actual transaction; no mechanical reuse of the three comparator templates was found.

Meaningful value compared with preserved draft `outputs/taiwan-ai-semiconductor-series/02-manufacturing-data-trade-secrets.zh-hant.md`: integrated lines 20–24 add a usable separation between employee access and the customer's authorization to disclose, plus an engineering/data-manager approval sequence; line 30 distinguishes transient reading, a retained query database and parameter training; line 46 adds dependencies and licenses needed for continued use after handover. Line 52 now separates the two National Security Act connections instead of leaving them under one generic phrase. These are operationally useful additions, not padding.

Language and legal-strength audit: Taiwan usage of 製程、委託、營業秘密、授權、重製 and 保密契約 is consistent. The article labels procurement practices as recommendations (lines 24 and 32) rather than newly invented statutory obligations. 「可能」「仍須」「不當然」 preserve causation, conditions and uncertainty. Article numbers, the 42-item list, its 2026-02-13 effective date, and the 2026-10-08 check date remain distinct. No amounts or fictional deadlines appear. No bold markup or ornamental slogan was found.

Bounded live legal check on 2026-10-08: [MOEA Trade Secrets Act](https://law.moea.gov.tw/LawContent.aspx?id=FL011321) supports the three cumulative requirements, commissioned-development default and criminal-intent qualifications; [National Security Act Article 3](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=A0030028) supports the distinction between its paragraphs 1 and 2; [NSTC current-list page](https://law.nstc.gov.tw/LawContent.aspx?id=GL000594) expressly states commencement on 2026-02-13 and [TIPO notice](https://www.tipo.gov.tw/tw/tradesecrets/888-80830.html) confirms 42 items. The source is an effective list, not a draft. No material discrepancy was identified.

| File:line | Exact sentence | Reason and evidence | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| — | — | No material language, metadata, factual or legal-strength finding in the reviewed version. | None required. | No manuscript change. |

## 484 — PASS

Path: `src/content/columns-zh/484-taiwan-ai-basic-act-semiconductor-factory-governance.md`  
SHA-256: `f121a3e3d67f952b4846f6685ff07115392b19c3c939a9a973899ff2ef84e010`

Metadata/body review: the title identifies the decision-maker and extent of system control rather than promising compliance from buying a product. The summary's trial, launch, update and abnormal-operation scope is covered by the body. No separate `seoTitle` exists. Date fields, zh-hant audience and internal author are correct for this version; no bold, public AI attribution, fabricated credentials or consultation CTA appears. The final body paragraph identifies practical change triggers and the responsible person's accept/retest/pause decision.

First-two-paragraph sentence deletion test (lines 16 and 18):

| Sentence | Deletion result |
|---|---|
| 「晶圓廠讓 AI 標出疑似瑕疵，再由工程師判讀，與讓系統直接決定產品放行或設備停機，需要處理的風險不同。」 | Keep: identifies two different authority/impact configurations, without which the next sentence becomes a generic procurement list. |
| 「採購前可先畫清楚權限：系統讀取哪些資料、能下達哪些指令，哪些結果必須經人員確認。」 | Keep: gives timing and the actual permissions to map. |
| 「台灣《人工智慧基本法》於2026年1月14日公布，現已生效；數位發展部於同年7月7日公告《人工智慧風險分類框架》，並載明自即日生效。」 | Keep: identifies which enacted law/framework is under discussion and distinguishes publication from present effectiveness. |
| 「企業仍須依實際用途、主管機關認定及適用產業規範，確認具體義務。」 | Keep: preserves the conditions preventing the framework from being read as a uniform private-company duty. |

Comparator result: 420's concrete-evidence opening becomes a permissions/controls decision here, not a copied safety introduction. 419's careful distinction among dates and duties is reflected in separate statutory and contract recommendations, without imitating its post-judgment chronology. 418 begins with an immediate personal choice; 484 instead uses an operational contrast, and ends with version acceptance and retriggered review rather than a request for professional help. Headings organize risk characterization, real-line testing, acceptance and reconstructing decisions; they fit this topic.

Value compared with preserved draft `outputs/taiwan-ai-semiconductor-series/01-ai-basic-act-factory-governance.zh-hant.md`: lines 28–32 add the important actual-environment-testing distinction and concrete stop/restoration/retest allocation; lines 38–40 turn accuracy claims into data, threshold, environment and version questions; lines 44–46 add records and triggers that allow staff to identify the authorized version. These details help a buyer write and operate a trial agreement. The opening does not equate every reader with a chip maker: this particular article expressly and consistently addresses a wafer-factory purchaser.

Legal-strength/date check: 「可」「宜」 mark contract advice; lines 22, 30, 32 and 40 explicitly limit what the statute/framework itself imposes. The two-year period is not treated as a suspension of existing law. The 2026-01-14 date is stated as promulgation, not a claimed exact first effective day. Live [AI Basic Act Articles 5, 16–18 and 20](https://law.nstc.gov.tw/LawContent.aspx?id=GL000592), the [MODA July 7 announcement](https://moda.gov.tw/press/bulletin/20086) and [framework section 2.1 / section 3](https://www-api.moda.gov.tw/File/Get/moda/zh-tw/UieEfux5Yv0iJuR) support these bounded statements. Article 17's research exclusion and its actual-environment/product-service exceptions survive intact in line 30. No amounts, invented deadlines or material terminology errors were found.

| File:line | Exact sentence | Reason and evidence | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| — | — | No material finding in the reviewed version. | None required. | No manuscript change. |

## 486 — PASS

Path: `src/content/columns-zh/486-taiwan-ai-development-model-data-code-rights.md`  
SHA-256: `1f65b6d8af46440b70ef8c512f42fbdb777ef6e6ed22e799b4f025a947cb7038`

Metadata/body review: title and summary focus on the practical inability to redeploy or replace a maintenance supplier despite an ownership clause. The first body paragraph immediately makes clear that 「成果歸公司」 refers to the contractual claim, not a blanket statutory ownership default. No separate `seoTitle` exists. Internal author and dates are preserved. No bold, public AI attribution, invented experience or sales CTA appears. The ending provides continued-use, subscription and transition-cost questions without promising a legal outcome.

First-two-paragraph sentence deletion test (lines 16 and 18):

| Sentence | Deletion result |
|---|---|
| 「晶圓廠付費開發檢測 AI，契約寫了『成果歸客戶所有』，仍可能在移往另一廠區、用新影像再訓練，或更換維護商時遇到限制。」 (article uses Chinese double quotation marks) | Keep: gives the specific misleading clause and the three commercial uses it may fail to secure. |
| 「簽約時可直接列出這些預定用途，再逐項確認模型、資料與程式碼由誰提供，以及客戶能取得哪些檔案和權限。」 | Keep: identifies the action before signing and distinguishes tangible delivery from permission. |
| 「對受著作權保護、且非屬受雇人職務著作的委託成果，著作權法第12條容許約定著作人及著作財產權歸屬；未約定時，原則上以受聘人為著作人，著作財產權也歸受聘人，出資人得在出資目的範圍內利用。」 | Keep: provides both applicability limits and the relevant unagreed default; deleting it removes why an express agreement matters. |
| 「這項規則無法替開發商取得第三方模型的權利，也不能保證每一項 AI 交付物本身都有著作權。」 | Keep: prevents the default rule from being enlarged into ownership of third-party or unprotectable material. |

Comparator result: like 420, this article identifies the insufficient item of evidence (here, an ownership clause) before listing useful materials; its transaction and vocabulary are distinct. Unlike 419, it does not follow a sequence of legal deadlines but separates technical layers and downstream permissions. Unlike 418, it uses no question lead or safety sequence. Its final handover test and continued-use terms are specific to technical procurement and do not repeat the comparators' support/referral endings.

Value compared with preserved draft `outputs/taiwan-ai-semiconductor-series/03-ai-development-ip-ownership.zh-hant.md`: line 26 distinguishes another site within the same entity, a group company and an external maintenance provider; line 30 ties annotation/revision records to reproducing training; line 34 limits vendor permission to the factory's own customer authorization; line 46 turns handover into an actual launch test and deficiency remedy. The commissioned-work introduction now expressly excludes employee works and avoids treating every AI deliverable as copyrightable. No mechanical translation or imported foreign-law default is present.

Legal/terminology check: 著作人、著作財產權、授權 and 讓與 retain separate meanings. Base-model licenses, weights, raw data/annotations, human code and generated material stay separate. Weight and AI-output copyrightability remain conditional, and training is not declared automatically unlawful or automatically fair use. [TIPO Article 12](https://www.tipo.gov.tw/tw/copyright/694-17729.html) and [TIPO email 951212a](https://www.tipo.gov.tw/tw/copyright/692-12637.html) were opened live; their applicability/default and funding-purpose limitation match the introduction. TIPO explanations are attributed as administrative explanations rather than invented case holdings. No numerical amount or fixed legal deadline has been added; contractual cure/transition periods are left for agreement.

| File:line | Exact sentence | Reason and evidence | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| — | — | No material finding in the reviewed version. | None required. | No manuscript change. |

## 488 — PASS

Path: `src/content/columns-zh/488-taiwan-factory-vision-ai-worker-personal-data.md`  
SHA-256: `8bc36ab649ce34019604404d85e90a0d5c320e8f246bdd1d53d0c2aae2e8d9a9`

Metadata/body review: title now names the change from safety monitoring to performance evaluation; the summary's legal basis, purpose change, outsourcing, correction and retention are all developed in the body. No separate `seoTitle` exists. The labor topic and broad factory readership match the content without presuming all employers manufacture chips. No bold, public AI attribution, invented experience, named client or sales CTA appears. The last paragraph assigns a specific pre-activation review shared by HR and IT.

First-two-paragraph sentence deletion test (lines 16 and 18):

| Sentence | Deletion result |
|---|---|
| 「原本用來偵測危險區域闖入的工廠鏡頭，若增加離席時間統計、績效評分或供應商模型訓練功能，啟用前就要重新確認資料用途。」 | Keep: identifies the feature-change trigger, three different uses and the relevant pre-activation timing. |
| 「即使影像已刪除姓名，只要能與工號、班表或其他資料連結而識別員工，仍可能是個人資料。」 | Keep: preserves indirect identifiability and corrects a specific misconception. |
| 「工廠可先沿著資料流向盤點：相機拍到什麼、系統產生哪些紀錄、誰能查詢，以及影像是否送往外部平台。」 | Keep: defines the inventory's concrete object and outward transfer; it is more than a promise to explain later. |

Comparator result: like 420, it begins from a concrete act and records, but here the act is activating a new feature and the records include generated employee scores. Like 419, it separates distinct legal conditions rather than collapsing them; its organizing sequence is purposes, processors, corrections and retention rather than criminal-case dates. Unlike 418's initial question and immediate-safety advice, it opens with a business change and finishes with a feature-activation record. Headings remain meaningful to employer/HR/IT readers.

Value compared with preserved draft `outputs/taiwan-ai-semiconductor-series/05-factory-vision-personal-data.zh-hant.md`: the opening moves the reader from a definition of identifiable images into a real change-of-use decision. Lines 24 and 36 add consent evidence and actual outsourced-platform settings; lines 38–42 materially expand the previously brief review suggestion into a correctness-dispute workflow, including stopping further use when legally required and distinguishing wrong facts from disagreement with a scoring standard. Retention now includes backups and separate data products. This improves usefulness without inventing a universal camera retention period.

Legal-strength/date check: the explanation distinguishes legitimate purposes, statutory obligations and practical implementation choices. It preserves the conditional collection grounds, separate consent for outside-purpose use, statutory special-category list and outsourcing oversight. In line 40, the exception requires either necessary official/business use or written consent, together with a recorded dispute; line 42 does not substitute a vendor ticket for stopping use when the law requires it. The [current PDPA page](https://law.pdpc.gov.tw/LawContent.aspx?id=FL010627) was opened live and supports Article 11 and the uncommenced-amendment markings. The [prior applicable Article 27 text](https://law.pdpc.gov.tw/LawContentHistory.aspx?hid=1&id=FL010627) and [Enforcement Rules Articles 3, 5, 8 and 12](https://law.pdpc.gov.tw/LawContent.aspx?id=FL010628) were also checked. The 2025-11-11 amendment date is not mistaken for commencement. No imported 72-hour duty, invented amount or unsupported blanket biometric category appears.

| File:line | Exact sentence | Reason and evidence | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| — | — | No material finding in the reviewed version. | None required. | No manuscript change. |

## HISTORICAL review table — 2026-10-08 freeze

| Repo-relative target path | SHA-256 | Result |
|---|---|---|
| `src/content/columns-zh/484-taiwan-ai-basic-act-semiconductor-factory-governance.md` | `f121a3e3d67f952b4846f6685ff07115392b19c3c939a9a973899ff2ef84e010` | PASS |
| `src/content/columns-zh/485-taiwan-manufacturing-ai-data-trade-secrets.md` | `df6f8ab1174e1b09fa6bd5244a34f77e40b59abc8afcee1b6de6738bd79a61d9` | PASS |
| `src/content/columns-zh/486-taiwan-ai-development-model-data-code-rights.md` | `1f65b6d8af46440b70ef8c512f42fbdb777ef6e6ed22e799b4f025a947cb7038` | PASS |
| `src/content/columns-zh/488-taiwan-factory-vision-ai-worker-personal-data.md` | `8bc36ab649ce34019604404d85e90a0d5c320e8f246bdd1d53d0c2aae2e8d9a9` | PASS |

All four full-file hashes were recalculated from the integrated targets after reading and match the frozen versions above. No article repairs were requested or performed, and no preference-only changes are being imposed.

Unresolved material editorial findings: none. Evidence limits: this report independently checks language, reader value, legal-strength preservation and the named live sources, rather than purporting to replace the separate final review of every legal proposition. Official consolidated-law pages may lag new announcements; 488 appropriately attributes the pending-commencement statement to the agency page as of this check. Next bounded step: give these exact versions and this report to the independent final legal reviewer, then carry forward the already-required rendering/release checks. Re-review only affected passages if later changes alter a reviewed hash. Nothing here certifies deployment or current public rendering.

## 2026-10-09 addendum — metadata-only freeze verification

Result: PASS for all four assigned current versions. The current integrated files were read directly and checked against both `work/publication-date-adjustment.json` and `work/publication-integration-manifest.json`. This was a bounded verification of the date change; no article was edited and the full editorial/legal review was not repeated.

Verified changes are confined to these three frontmatter values: `published: "2026-10-09"`, `lastmod: "2026-10-09"`, and `date_display: "2026年10月9日"`. For each file, replacing only those three header values in memory with their October 8 values exactly reproduced the historical full-file review hash above. The reconstructed bytes were not written to the manuscript. Current full-file hashes also match both manifests, and body hashes match their preserved values. Thus the body, sources, October 8 legal-information check date, title, summary, internal author and all other metadata remain unchanged.

| Target number | Reconstructed historical full SHA-256 | Unchanged body SHA-256 | Verification |
|---|---|---|---|
| 484 | `f121a3e3d67f952b4846f6685ff07115392b19c3c939a9a973899ff2ef84e010` | `acfb244196a61d093e3357bbaad2a73ab9cb57bcf02f69301b3ccf13f86d4af1` | PASS |
| 485 | `df6f8ab1174e1b09fa6bd5244a34f77e40b59abc8afcee1b6de6738bd79a61d9` | `7597eb9990602899fd5ed94929b721d9ce9cc20220ff96cae3bbac7cdad7e08c` | PASS |
| 486 | `1f65b6d8af46440b70ef8c512f42fbdb777ef6e6ed22e799b4f025a947cb7038` | `3c1d7007b63f0437d7eb1528a36805cdcb0a36b4f70bfdea782edeef43578a93` | PASS |
| 488 | `8bc36ab649ce34019604404d85e90a0d5c320e8f246bdd1d53d0c2aae2e8d9a9` | `a55bd04be3d139106624715108e422d242314074c720ea94bbaa7c1c30742a8e` | PASS |

## CURRENT PASS table — 2026-10-09 freeze

| Repo-relative target path | SHA-256 | Result |
|---|---|---|
| `src/content/columns-zh/484-taiwan-ai-basic-act-semiconductor-factory-governance.md` | `7aa2bfed1cef35921500ebf031334f8708bf81a6d1364108d779c3b32b1ac435` | PASS |
| `src/content/columns-zh/485-taiwan-manufacturing-ai-data-trade-secrets.md` | `f0fb222731c7d6b8c8b2989a698a7a50e10966afba84be393ae3595b16ff469a` | PASS |
| `src/content/columns-zh/486-taiwan-ai-development-model-data-code-rights.md` | `7cca19b41a3f81178fe56c5210db7dcb6615f447cb9b8a3f58b1e07889c66b84` | PASS |
| `src/content/columns-zh/488-taiwan-factory-vision-ai-worker-personal-data.md` | `d19ed53401a13fcc5d9458612c95324c4fc6d46c29f875045fdca341a13451b7` | PASS |

Unresolved issues from this date-only change: none. Earlier substantive findings and evidence limits remain as recorded. Next bounded step: final review/release coordination must use this CURRENT table rather than the historical hashes. This addendum does not claim a new legal-source check or publication.
