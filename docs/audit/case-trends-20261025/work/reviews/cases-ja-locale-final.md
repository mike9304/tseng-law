# Japanese independent locale review — final

Status: PASS. Review date: 2026-10-25. Reviewer: `/root/review_ja_case_trends`, an AI editorial reviewer independent of the author. All four repaired manuscripts were read in full, including metadata, FAQs, captions and source lists. This records locale review of the exact versions below; it does not claim human-native, attorney or publication review. The reviewer did not modify manuscripts.

## Reviewed versions

Base: `/Users/son7/tseng-case-trends-20261025/repo/src/content/columns-ja/`.

| Article path under base | SHA-256 | Result |
| --- | --- | --- |
| 910-japanese-expat-allowances-bonuses-taiwan-judgment.md | f69468d34cca87a34174a82fb848e0b67ba9e949e8850b5772bc5b061a3ca1f3 | PASS |
| 911-japan-taiwan-distributor-competing-products-judgment.md | d547c2590dcfa791e530ed44373ef3b648e6b1c90752cb02de5a807381e2b51e | PASS |
| 912-taiwan-oem-mold-return-inventory-claim-japan.md | d6bb453d3f9eacab5e0afba1a944ae782e8131a59f47ab3d53373d282ea400f9 | PASS |
| 913-japanese-genuine-goods-taiwan-trademark-exhaustion.md | a477776e89a9cd0e29cf3b9dde1485ae4607aaf31b9a187a43ebc231eb5e9b1b | PASS |

Author freeze, pre-CLI hash, post-CLI hash and saved final-text snapshot agree for every article. `cases-ja-locale-final-variety.json` contains the real commands and complete outputs; `cases-ja-locale-final-snapshots.json` preserves the reviewed text and image hashes. The original requests, exact original sentences and proposed rewrites remain in `cases-ja-locale-r1.md`. One author repair pass resolved the findings.

## Resolution of required findings

| ID / final file:line | Exact final sentence or deletion evidence | Reason for acceptance / further rewrite | Meaning check |
| --- | --- | --- | --- |
| J1 / 910:59 | 「会社に条件の成就を不当に妨げる意図があったことを示す証拠も、従業員からは提出されていません。」 | The employee is now explicitly the person who did not produce the evidence. The preceding sentence retains that dismissal validity was not contested in this action. No further rewrite. | Clarifies the actor without adjudicating dismissal validity or deleting improper prevention. |
| J2 / 911:2,25,27,63 | 「販売会社の報酬は手数料です。」 | The case actor is consistently 販売会社; the prospective relationship uses 販売パートナー. The misleading purchaser-like 販売先 reference is gone. No further rewrite. | Preserves commission-based promotion and does not classify every intermediary as statutory 代辦商. |
| J3 / 912:33 | 「発注者は金型の開発・維持費を別に支払い、契約には金型と関連する知的財産権が発注者に帰属すると定めていました。」 | The redundant 「所有権の約束がありました。」 is deleted. Network equipment and peripherals remain in the preceding sentence. No further rewrite. | Payment, express ownership and IP allocation, and the warning against payment-only ownership inference all remain. |
| J4 / 912:35 | 「日本の調達担当者が同様の取引で金型の返還を求める場合も、契約先の会社名と、金型が置かれている場所が一致しているとは限りません。」 | The action now concerns seeking return from the actual holder, not deciding the return destination. No further rewrite. | Meaning preserved and direction clarified. |
| J5 / 913:57 | 「共通の商標戦略が消費者の混同を招きやすく、権利者もそれを認識すべきでありながら、その戦略を採用しているという事情です。」 | Restores consumer confusion and normative awareness in the official TIPO reproduction. The following sentence retains quality/use-state control and the importing rights holder's goodwill. No further rewrite. | Substantive precision correction, explicitly referred to final legal review. The final legal reviewer separately confirmed this exact repaired passage. |
| J6 / 911:33 | 「裁判所は、契約書と更新時の付属合意を読み合わせました。」 followed directly by the actual hospital-bidding/contracting allocation | Empty repetition 「業務は分担されていました。」 is deleted; operative facts remain. No further rewrite. | Preserved. |
| J7 / 912:49 | 「裁判所は、一通のメールへの無回答だけを承諾としたのではありません。」 followed by the combined-evidence evaluation | Empty preview 「メールと証言がつながっていました。」 is deleted. The call, corrective email and later oral-assent testimony remain at line 47. No further rewrite. | Preserved; no silence-equals-assent inference. |

Optional edits were also satisfactory: 912's title now says 「台湾のOEM先から」; 913's redundant 「登録は失われません。」 was removed while the distinction between registration and exhaustion remains. No metric-only filler was substituted for these deleted sentences.

## Additional legal-review amendments reread

- 910:29 and 78: 「後の…訴訟費用に関する裁定には、この判決が確定したと記されています。」 accurately attributes finality to 臺北115年度司他字277號裁定, dated 2026-06-08. The saved indexed official short order was read. This is not an assertion that this reviewer obtained a finality certificate or inspected the complete appeal chain.
- 911:27: 「競合商品の容器の製造を別の会社に依頼し」 limits the outsourcing fact to containers. At 51, 「商品表示や公平交易法に関する争点」 replaces unverified patent/copyright issue enumeration. The separate warning against treating the noncompete outcome as permission to use another's secrets or IP remains appropriately general.
- 911:55–59: 民法562's permission condition and unlimited-liability membership limb remain, as does 558's requirement to act in the commissioning firm's name. 「無限責任社員」 is used in its company-law sense. No Japanese employment noncompete rule is imported into Taiwan B2B contracts.
- 912:29: 「ほかの反訴は調停で解決済みです。」 explains the remaining finished-inventory counterclaim. Saved official indexed text records mediation of the other counterclaim portions on 2022-11-23. The article does not claim the appellate judgment newly ordered all molds returned.
- 913:55–59: common source of rights, economic/legal ties, possible control of quality and trademark use, goodwill and the confusion/awareness passage remain connected. The article does not turn group affiliation, similar logos or any trading relationship into automatic consent.

## Opening two-paragraph deletion test

| Article | What would be lost by deleting the opening | Decision |
| --- | --- | --- |
| 910:27–29 | Opposite wage outcomes, actual Beijing posting, 資遣費 claim, NT$258,312 award plus interest, first-instance date and attributed later finality. | Retain. The concrete split result is the reader's question; these paragraphs contain no generic preview. |
| 911:27–29 | Manufacturer delivery/invoicing, commission recipient's role, container-production conduct, disinfectant-drug context, rejection of an added noncompete and the appeal/finality limit. | Retain. These facts explain why the contract classification matters. |
| 912:27–29 | USD70,020, the finished-inventory basis, rejection, remaining counterclaim scope, mediated portions and the date/finality qualification. | Retain. Removing the scope paragraph would invite a false mold-return-order reading. |
| 913:27–29 | Japanese purchaser's actual cross-border-rights question, official corporate-site evidence, online sale and damages dispute, appeal dismissal. | Retain. This is the only question-led opening in the four; its evidence focus is specific. |

## Recent Japanese comparators

All three were read in full and have `published: "2026-10-24"`. None was unavailable.

1. `/Users/son7/tseng-case-trends-20261025/repo/src/content/columns-ja/718-taiwan-customer-reorganization-bankruptcy-japanese-supplier-claims.md`: opens with the shortest ten-day claim period, proceeds by insolvency procedure and closes on invoice/shipment/receipt records. The new openings concern split wage outcomes, commission-role allocation, an inventory claim and evidence of common trademark rights. They do not repeat this procedure-guide outline.
2. `/Users/son7/tseng-case-trends-20261025/repo/src/content/columns-ja/719-taiwan-promissory-note-security-court-ruling-enforcement-japanese.md`: begins with an expressly fictional NT$5 million note-security scenario, then follows instrument validity, signatory liability, execution and limitation. The four new articles are actual-case analyses; 912's later call/email evidence is distinct from an instrument checklist.
3. `/Users/son7/tseng-case-trends-20261025/repo/src/content/columns-ja/720-taiwan-supplement-health-food-advertising-rules-japanese-brands.md`: begins with a concrete advertising phrase and fine range, with classification/approval sections. 911 concerns contract duties in a disinfectant transaction; 913 preserves separate product regulation. Neither copies the comparator's approval-guide structure.

The articles' shared source/date/FAQ apparatus and brief contact options do not make their arguments interchangeable. The four narrative endings return respectively to payment-specific records, contractual role allocation, later order-cancellation agreements and the rights relationships between a purchase receipt and a Taiwan registration. Cross-locale batch duplication is outside this four-file review.

## Actual CLI and manual rule 5 review

Executed separately on every file:

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <absolute article path> --lang ja`

| Article | Exit | FAIL | Sentences | CV | Short share | Three-same-length run share |
| --- | --- | --- | --- | --- | --- | --- |
| 910 | 0 | 0 | 67 | .457 | .179 | .046 |
| 911 | 0 | 0 | 60 | .459 | .150 | .017 |
| 912 | 0 | 0 | 63 | .456 | .159 | .098 |
| 913 | 0 | 0 | 62 | .452 | .081 | .067 |

Each has a です・ます concentration WARN (98%, 90%, 97%, 95%). This is not a mixed-register FAIL. Manual review checked the actual rhythm and did not recommend inserting plain-form sentences to suppress the warning.

1. All four real CLI checks have FAIL 0 and agree with the frozen hashes.
2. No stock hypothetical opening. The four types differ: split result, business-role scene, amount/outcome, concrete rights question.
3. At least two meaningful short sentences occur in each: 910 「派遣先は北京でした。」「推定は覆せます。」; 911 「販売会社の報酬は手数料です。」「相手は専売を約束していません。」; 912 「協議は2019年7月です。」「対象は未出荷の注文です。」; 913 「上告は棄却されました。」「公開ページは変わります。」 Longer explanations are interspersed with facts, outcomes and questions. Deleted repetition was not needed to attain this result.
4. Paragraph openings were read vertically. No repeated opener creates a three-paragraph formula; there is no repeated 「台湾では」 setup.
5. No three consecutive statute-claim/caveat paragraphs. Each has numerous citation-free case-scene or evidence paragraphs, e.g. 910:33–35, 911:33–41, 912:45–53, 913:45–51.
6. CLI contrast-template counts are 0/1/2/3, within the limit. The contrasts answer plausible errors raised by the particular holding: payment name versus substance, expectation versus contract, quantity versus liability, genuine purchase versus rights relationship.
7. The narrative endings, before the source lists and separate review-date/scope footers, return to the column's own facts. No copied sales ending replaces the analysis. Scope footers are specific to the respective employment, distribution, mold or product question.
8. です・ます is consistent in narrative prose; interrogative fragments are deliberate buyer questions. No bold markup, invented first-person practice anecdote, human-review assertion, stereotyped Japanese-buyer claim or imperative checklist heading. Taiwan terms 工資・資遣費・代辦商 are introduced and distinguished from Japanese labels.
9. Article numbers, dates, currency units, qualifications, source links and 「架空の情景」 captions survive the repairs. 910's award is NT$258,312; 912's USD70,020 is the rejected claim, not an awarded amount. No unverified deadline or interest rate was introduced. Conditional entitlement is not rewritten as guaranteed recovery.

## Images, sources and service boundaries

All actual `910/911/912/913-case-trends-20261025.webp` images were directly viewed. Their visible desk/travel, sample-bottle, mold/transport-case and shipment/fabric scenes match their Japanese alt text. Every caption is 「架空の情景」. No recognizable case party, readable case document, brand logo, flag or actual-case-photo assertion appears. Final snapshots record the image SHA-256 values.

`cases-ja-locale-source-check.json` records the official law, law-history, market and firm pages actually reopened on 2026-10-25, plus the exact court-access limits. Operative MOJ texts read include 労基法2/29, 労働事件法37, 民法98/101/148/511/558/562/597, 涉外20 and 商標36. The trademark amendment relevant to current36 took effect 2024-05-01; unrelated pending provisions were not treated as effective rules.

Direct fresh court retrieval for C1–C3 timed out. Review used retained official extracts and indexed official text, including the later costs order and the extended C3 evidence passages. It does not claim a fresh complete-original retrieval. 911 and 912 retain unverified later appeal/finality status. 910's updated finality statement is expressly attributed to the later order.

For 913, the five-page official TIPO reproduction was freshly opened; the article calls it 主文・判決要旨 and labels the source as 公的再録資料. It does not claim that the full original court-host judgment was obtained. The final legal reviewer independently checked the amended confusion/knowledge passage and reported no remaining issue.

The four dated market observations were checked against JETRO or Japan–Taiwan Exchange Association primary pages. They supply current buyer context, not proof that the litigants were Japanese customers or that a dispute trend/contract conclusion occurred. The 912 JETRO check covers its landing abstract, not all 36 report pages. Firm Japanese service/contact pages support the modest Taiwan-law next steps and `wei@hoveringlaw.com.tw`; the articles invent neither a Japan office nor Japanese legal qualification. Internal `author: "legal-ai-assistant"` values remain; no public human attribution is added.

## Unresolved issues and next step

No unresolved locale findings on the four recorded versions. Source-access limitations remain explicitly bounded above and in the manuscripts. Next step: the independent final reviewer may bind its conclusion to these same hashes, then the orchestrator handles integration and publication. Any subsequent manuscript or image change requires review of the affected version; this PASS alone is not evidence of deployment.
