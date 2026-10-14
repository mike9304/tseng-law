# C4 final review — Astra R1

Verdict: FIX. None of the four versions is approved for publication as supplied. Automatic checks pass, but legal qualifications, citation coverage and native prose require changes. No column file was edited.

Review date: 2026-10-13. Slug: `taiwan-tenant-early-lease-termination-notice-penalty`.

## Scope checked

Read in full: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C4.md`, all four `drafts/C4/{ko,ja,en,zh-hant}.md`, `drafts/C4/facts.md`, and `research/C4-statutes.md`. Read the shared sentence-variety rule, including sections 5–6, and skimmed the recurring reviewer lessons. Read `~/tseng-col-0930-work/COLUMN-VOICE-RULE.md` as well.

The referenced `~/agent-library/knowledge/editorial-voice.md` does not exist here. The full supplied editorial brief and `/Users/son7/Projects/tseng-law-columns-20261013/docs/columns/EDITORIAL-VOICE.md` were opened and used instead. This did not prevent review.

Independently fetched with curl the [Executive Yuan page](https://www.ey.gov.tw/Page/DFB720D019CCCB0A/478917df-7599-418f-8715-fd2716b623b4) and its [official PDF](https://www.ey.gov.tw/File/43BC094940995CFC?A=C). Read the relevant text, including points 5, 8, 9, 14, 15, 18, 20 and prohibited point 8. Visually inspected rendered PDF pages 4 and 6 containing the central termination/notice provisions.

Independently fetched the current full [Civil Code](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000001), [Rental Housing Act](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0060125), [Consumer Protection Act](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0170001), and [official English Rental Housing Act](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0060125). All 26 statutory excerpts in the research file match the fetched text after whitespace normalization. Article 4, absent from that excerpt set, was independently opened and checked. Civil Code Article 95 and CPA Articles 11, 15–17 were also read for the issues below.

The Civil Code page really shows ROC 115-08-17. Its pending-provision notice concerns Articles 166-1 and 1223, not the cited rental provisions. The Rental Housing Act page shows ROC 112-02-08. The Executive Yuan page/PDF confirm announcement No. 1140113583, amendment of point 18 on 2025-04-18, effective that day. No error found in those amendment/effective-date statements. The Act's English name is correct.

No judgments are cited, and `research/judgments/` contains no `.txt` files. No judgment holding was inferred. Hypothetical remaining months are scenario assumptions; there is no numerical calculation to recompute.

Checked `topics/LINKS.md`, ran the existence-checking lint, and opened the Japanese deposit column to assess the non-duplication requirement. Compared opening/headings/ending samples from the three latest prior dated columns in each locale: KO 535/530/526, JA 529/525/516, EN 531/515/507, ZH 539/538/537. Inspected available C1–C5 opening paragraphs; C6 was not present, so the complete six-column opening distribution cannot be certified.

Viewed `images/C4.jpg` with the image viewing tool. The requested `images/C4.webp` is missing. Downloaded sources, rendered pages, reviewed draft copies and check outputs are retained in `reviews/C4/evidence-astra-r1/`.

## 1. Law and facts

### L1 — ZH: dispatch is substituted for notice; MAJOR

Original (`zh-hant.md:74`): “書面要在三十日前送出，並附事證。”

→ Problem & reason: Point 18 requires written notice to the landlord thirty days before termination; it does not make posting thirty days beforehand sufficient. [Civil Code Article 95](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=95) generally makes a non-conversational declaration effective when notice reaches the other party. Point 20's first-mailing-date presumption is conditional on an unreported address change preventing delivery. This wording can cause late notice. The other versions say notify, not merely dispatch.

→ Fix (required): Correct “送出” to an accurate notice formulation. If discussing posting, distinguish proof of dispatch from arrival, cite Article 95, and retain point 20's actual conditions.

→ Facts preserved: Thirty days, written form, supporting evidence, urgent-danger exception and conditional address-change presumption. Not applied: this changes legal meaning.

### L2 — All four: repair-access safeguards omitted; MAJOR

Original: KO `:74` “필요한 수리 행위를 임차인이 거절하지 못하게 합니다”; JA `:76` “必要な修繕行為を借主が拒むことを禁じています”; EN `:76` “the tenant may not refuse acts needed to preserve the property”; ZH `:78` “修繕的必要行為不得拒絕”.

→ Problem & reason: These echo the general statutes but present an unqualified practical prohibition in an article expressly applying the mandatory residential terms. [Point 9, paragraph 3](https://www.ey.gov.tw/File/43BC094940995CFC?A=C), PDF page 3, additionally requires reasonable advance notice and prohibits refusal without a justifiable reason: “應於相當期間先期通知，承租人無正當理由不得拒絕”. The omitted safeguards matter to whether a tenant must accept a particular repair visit.

→ Fix (required): Add those qualifications beside the non-refusal statement, or remove the ancillary absolute access claim while retaining the repair-duty explanation. Cite point 9 at the claim.

→ Facts preserved: Landlord's repair duty, necessary work, contractual/customary and tenant-fault qualifications, and tenant remedies. Necessary access must not become unrestricted entry.

### L3 — JA: ending merges statutory termination with the checkbox/penalty route; MAJOR

Original (`ja.md:102`): “先の雨漏りで、催告の期間が過ぎても約定した居住に合わないなら、…第1項第2号の終了が問題になります。欄が得なら…第14点の1か月通知があり…不得なら、その上限の数字はその点にありません。”

→ Problem & reason: The example first satisfies the failed-repair/unfitness route, then directs that same tenant to 得/不得 and penalty analysis without separating the legal bases. [Act Article 11](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060125&flno=11) and point 18 permit qualifying termination without landlord compensation; point 14 expressly excludes point 18 termination from the checkbox rule. The conclusion can therefore suggest a penalty or contractual bar despite qualifying statutory grounds.

→ Fix (required): Finish the leak example on Article 11/point 18: qualifying conditions, thirty-day written notice with evidence and no compensation, with the separately defined urgent-danger exception where relevant. If retaining point 14 as an alternative, explicitly call it another route, not a condition of statutory termination.

→ Facts preserved: Hypothetical label, unfitness plus repair necessity, reasonable demand period and non-repair, 30 days versus one month, and no compensation. The checkbox remains relevant to at-will termination.

### L4 — All four: categorical invalidity of shorter-notice clauses is not established; MAJOR unsupported inference

Original: KO `:48` “한 달보다 짧은 통지만으로 끝낼 수 있다고 적은 정형화 조항은…무효”; JA `:50` “1か月より短い通知だけで終了できると書いた定型約款は…無効”; EN `:50` “A standard clause that allows shorter notice … is void under Article 17”; ZH `:52` “通知短於一個月的定型化契約條款…無效”.

→ Problem & reason: Point 14 states the one-month requirement, and [CPA Article 17](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0170001&flno=17) states the effect of violating an announcement. These do not independently establish this unqualified conclusion about every shorter-notice provision without identifying whose burden is shortened and the actual agreement. The fact sheet admits that this is an inference. The separately checked [Executive Yuan interpretation on Articles 15 and 17](https://www.ey.gov.tw/Page/24C4B877E850ED4E/bb0b79ed-17a8-4419-91d4-1422904abeee) illustrates why negotiated terms and consumer protection require attention; it concerns presale contracts and is not itself a ruling on residential short-notice clauses.

→ Fix (required): Remove this categorical sentence, retaining the verified point 14 notice rule and Article 17's general effect. To retain a broader invalidity proposition, obtain directly applicable official support and state its limits. This reviewer is not replacing it with a categorical claim that all shorter-notice terms are valid.

→ Facts preserved: Published one-month requirement, cap for the specified notice breach, invalidity of violating standard terms, and incorporation of mandatory terms.

### L5 — All four, especially ZH: subletting guidance leaves conflicting instructions unresolved; MAJOR

Original: KO `:80`, JA `:82`, EN `:82`, ZH `:84` require written consent for all or part under Article 9, then recite Article 443's partial-house exception. ZH adds: “這兩項規定如何適用、何者優先，本文不判斷。”

→ Problem & reason: The statutes are individually quoted accurately, but readers receive both “written consent required” and “part may be sublet unless prohibited” for the same described lease. The explicit refusal to identify the applicable instruction defeats the requested practical answer. [Act Article 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060125&flno=9) covers the whole or part; mandatory point 8 also requires consent and a written subletting consent document. The article already excludes Article 4 cases from its scope.

→ Fix (required): Make clear that the leases covered here require written consent, including partial subletting. If retaining [Civil Code Article 443](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=443), explain that its general partial-house wording is not permission to disregard the residential requirement. Remove the unresolved-conflict disclaimer. Finding a replacement is still distinct from release from the original lease.

→ Facts preserved: Whole/part distinction, written consent, accurate general Civil Code wording and no automatic release upon finding a replacement.

### L6 — ZH: incorrect numbered source for penalty set-off/shortfall; MAJOR

Original (`zh-hant.md:52`): “押金得抵承租人應賠的這筆違約金，不足再向承租人請求，出處是第5點。”

→ Problem & reason: The specific penalty set-off and shortfall rule is point 14, paragraph 3. It refers to the deposit specified in point 5, paragraph 1. Point 5 is not the source of this complete rule.

→ Fix (required): Attribute it to point 14(3), explaining the reference to the point 5 deposit, and attach the official source. Update the source-list point inventory where needed.

→ Facts preserved: Same penalty, deposit and shortfall; correct attribution. Not applied because citation changes exceed minor-wording authority.

### L7 — ZH/JA: narrow the scope of two general statements; required

Original: ZH heading `:30` “期限屆滿，租賃關係才消滅” and summary “期限屆滿才消滅”; JA `:34` “この規定で通知義務を負うのは貸主です”; ZH `:34` “負通知義務的是出租人”.

→ Problem & reason: ZH's “才” makes expiry sound exclusive despite the article's early-termination grounds. JA/ZH also fail to specify that the calendar-period proviso, not advance notice generally, names the landlord. KO says “이 단서” and EN says “The proviso”, correctly limiting that observation. Articles 450(3) and 453 do not eliminate the tenant's relevant notice duties.

→ Fix (required): State the ordinary expiry rule without “only”. Limit the landlord-specific observation to the calendar-period proviso and retain the tenant's applicable contractual/statutory notice obligations.

→ Facts preserved: Fixed versus indefinite terms, early-termination exceptions and landlord-specific calendar periods.

## 2. Citations and scope

### C1 — All four: central legal paragraphs lack inline official links; MAJOR hard-rule failure

Original: KO `:40,44–48,68–70,90–92`; JA `:42,46–50,70–72,92–94`; EN `:42,46–50,70–72,92–94`; ZH `:46,48–52,72–74,94–96` explain the amendment and points 14/18/20 without an accompanying source link. Some point 18 paragraphs link only Civil Code Article 424.

→ Problem & reason: An introductory document link and a distant source list do not meet the requirement for inline links immediately after claims. Article 424 does not establish point 18's thirty-day procedure or urgent exception. These uncited passages contain the column's decisive amounts, periods and procedures.

→ Fix (required): Link each coherent legal claim group to its correct article or the official mandatory-terms page, identifying the point/paragraph. Link the amendment/effective-date claim too. Make follow-up statutory claims and the final EN application traceable at their location.

→ Facts preserved: All amounts, deadlines, conditions and exceptions. Citation grouping must not leave claims unsupported.

### C2 — KO/JA/EN: Article 443 omitted from final sources; required hard-rule correction

Original: Civil Code Article 443 is in the subletting paragraph but absent from those three final lists. ZH includes it.

→ Problem & reason: Sources must list every source used. A body-versus-sources URL comparison confirms this omission.

→ Fix (required): Add the existing [Article 443 URL](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=443) to each affected list; add any newly used provisions too.

→ Facts preserved: Body content and article URL; no legal change.

### C3 — All four: required urgent-exception quotation absent; required scope correction

Original: KO `:70`, JA `:72`, EN `:72`, ZH `:74` paraphrase the exception. The substantial direct contract quotation is instead point 14's opening.

→ Problem & reason: `topics/C4.md` explicitly requires a quotation from the official PDF. Page 6 says “但前項第三款前段其情況危急者，得不先期通知。”

→ Fix (required): Include the short exact quotation, official citation and natural local-language explanation. Preserve the reference to the first part of item 3; do not exempt every repair dispute from advance notice.

→ Facts preserved: Urgency plus safety/health danger, ordinary thirty-day notice/evidence, and heirs' provision.

### C4 — All four: certified-letter assertion lacks official support; required

Original: KO `:92` “흔히 이용하는 우편”; JA `:94` “よく使われる郵便”; EN `:94` “a common way to keep a record of posting”; ZH `:96` “常拿來留下寄出紀錄”.

→ Problem & reason: This is within the intended topic, but the fact sheet admits no official source was checked for the usage claim. The disclaimer about legal effect does not support the factual assertion. JA's internal link is not an official source.

→ Fix (required): Open and cite a relevant official postal/government explanation for the narrow description. Omit unsupported popularity language. Do not imply that posting proves receipt or validates defective termination.

→ Facts preserved: Limited evidentiary purpose and distinction between dispatch, arrival and termination effect.

### C5 — JA: required differentiation from the deposit column not met; required

Original: JA `:64–66` repeats all four Article 11 grounds/notice; `:76–78` gives another full repair-and-deduct treatment and then says the details are left to the earlier article.

→ Problem & reason: The opened `266-taiwan-rental-deposit-refund-two-months.md` already covers those grounds, thirty-day notice and repair-and-deduct. The topic explicitly says to build on that discussion rather than repeat it. Linking after repetition does not satisfy this instruction.

→ Fix (required): Compress the already-covered Japanese material into an accurately linked bridge, preserving the conditions needed for the new point 18 discussion and leak example. Prioritize the checkbox, 不得, notice proof and hand-back. Also make job loss explicitly one of the non-listed grounds where KO/JA/ZH currently mention transfers/change of job/departure without plainly stating that required example.

→ Facts preserved: Operative conditions remain in the new explanation; statutory termination must not become dependent on 得.

## 3. Other rules and frontmatter

Passed in all four: `author: "legal-ai-assistant"`; correct audience/topic/categories; publication/lastmod 2026-10-13; localized dates/read-time formats; literal NNN image path; matching H1/title; three FAQs; no bold, private-party names, phone/hotline numbers, street addresses or messaging IDs; one firm/email paragraph; no lawyer/native-review claim; labeled hypothetical examples; no outcome guarantees. Read-time estimates are plausible for the source-heavy prose.

The foreign-law paragraph states no substantive Korean/Japanese/U.S. rule and directs the reader to local rules. No unsupported foreign court practice is claimed. It should remain general.

EN: title 52 characters, so the distinct 39-character seoTitle is required and valid; summary exactly 160 characters, with no prohibited characters. All source sections have the requested check date. Existing single-article links have correct pcode/flno. Internal links: KO 2, JA 3, EN 3, ZH 2; all exist in that language and none links to this batch.

## 4. Voice and sentence variety

### V1 — All four: substantial translationese/research-note prose; required rewrite

| Original | Problem & reason | Fix (required, not applied) | Facts preserved |
|---|---|---|---|
| KO “앞의 주재원에게 다섯 달은 … 사유가 아닙니다.” | The number of months is made the subject of the statutory ground; the relevant event is recall/transfer. | Make recall the subject, retaining five remaining months in the hypothetical. | Five months, invented label, statutory list. |
| KO “임대의 목적에 닿지 못할 때”, “행정원 核定” | Literal phrasing/unexplained Chinese term. | Natural Korean for inability to achieve the lease's purpose and Executive Yuan approval. | Purpose test and approving authority. |
| JA “次の借主は、残りの期間を代わりに終えません”, “その道とあわせて終了を書いています” | A tenant does not literally end another person's remaining period; “writes an ending” is not natural legal exposition. | Name the continuing lease obligation and statutory termination option directly. | No automatic release and repair/termination conditions. |
| JA “応記載事項”, “先に開くのは修繕の記録と、契約書の欄です” | Repeated hybrid terminology and literal records/box metaphor. | Define the Taiwanese term once in Japanese; identify the relevant evidence/choice plainly. | Document identity, checkbox, repair evidence. |
| EN “Months remain on the one-year flat”, “Does the school's letter end the flat?”, “The page to open is the box.” | A flat does not have a contractual term; the page/box metaphor is unnatural. | Use “lease” and identify its early-termination clause directly. | One year, remaining months, teacher example and invented label. |
| EN “Landlords and tenants on a lease count as a consumer relationship”, “Announced matters … still form the contract if the paper omits them.” | Literal source-text paraphrase obscures the subject and incorporation rule. | State that the Act treats their relationship as a consumer relationship and mandatory terms form part of the contract even when omitted. | Article 5/CPA Article 17 scope and effect. |
| ZH “這是照清單讀的，法院對調職案件怎麼看，本文的資料沒有”, “那封信的效力，這裡不說” | Internal research limitations are narrated to the public instead of explaining the verified scope. | State the verified statutory point without a research diary; do not invent case law or postal effects. | Statutory list and no fabricated holding. |
| ZH “人還是搬走，屬於不履行，後面的錢看契約文字”, “金額由這份文件定” | Abrupt fragments obscure the legal act and agreed settlement terms. | Name unauthorized early termination and the negotiated termination/settlement agreement precisely. | 不得 context, contract consequences, agreed terms, Article 252 discretion. |
| All: “앞 조문이 정합니다” / “前条が定めます” / “The preceding article governs…” / “依前條定之” | The source's cross-reference is copied without naming Article 16 or explaining its effect. | Omit the non-explanation while retaining the verified Article 17 rules, or identify/source the intended provision if actually explained. | Invalidity/incorporation; do not imply every invalid term voids the entire contract. |

All four largely copy the same subheading order, short fillers and research disclaimers. Changing the hypothetical's nationality is insufficient to meet the native-writing requirement. Rework the prose while preserving the verified legal core; this exceeds a few minor corrections.

First-two-paragraph deletion check: KO's quotation carries real information; the subsequent “1년짜리 임대차에는 제1항이 적용됩니다” repeats the fixed-term classification. JA's specific opening question can remain, but “先に見るのは契約書の欄です” repeats the following paragraph. EN's “Notice and any sum turn on a box…” is vague and repeated by the actual provision; retain the actual conditions instead. ZH's first paragraph repeats the title as a question without answering it; replace that framing with the substantive condition. Preserve the second paragraph's source and quotation. No deletions applied.

### Executed checks

For every language, ran:

```text
python3 /Users/son7/tseng-col-1013-work/lint.py /Users/son7/tseng-col-1013-work/drafts/C4/<lang>.md <lang> taiwan-tenant-early-lease-termination-notice-penalty
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1013-work/drafts/C4/<lang>.md
```

| Locale | Lint | Length | Variety | CV | Very short sentences |
|---|---|---|---|---|---|
| KO | OK, exit 0 | 3,499 characters | 0 FAIL; ending WARN | 0.482 | 11 |
| JA | OK, exit 0 | 4,060 characters | 0 FAIL; ending WARN | 0.542 | 14 |
| EN | OK, exit 0 | 1,586 words | 0 FAIL | 0.488 | 18 |
| ZH | OK, exit 0 | 2,698 characters | 0 FAIL | 0.454 | 13 |

KO WARN: 95% 니다 endings. JA WARN: 96% desu-masu endings. These are warnings, not checker failures or register-mixing findings.

Manual sections 5–6:

- No stock hypothetical opener. KO opens on an official quotation; JA/ZH use specific questions; EN states a lease consequence. Hypotheticals later remain labeled.
- At least two very short sentences in each. No disqualifying three-paragraph claim–citation–caveat run identified. Each has citation-free hypothetical/practical paragraphs; uncited legal paragraphs still fail C1.
- One strict manual item is unmet in EN: three paragraphs begin with “The”. The checker allows a larger allowance for long articles, explaining its zero-FAIL output.
- MONOTONY: EN repeated paragraph opener — “The Act does not apply…”, “The one-month rent cap applies…”, “The tenant's penalty may come out…” — vary one opening, preserving the one-month figure, conditions and citations. One unmet item alone does not meet the two-item monotony-rejection threshold.
- No more-than-three contrast-template issue established. The job-loss/list distinction answers the reader's actual question; it is not an invented adversarial premise.
- Endings return to the particular exit/hand-back situation, after the contact paragraph. They are not generic disclaimer/sales closings. JA's legally ambiguous ending nevertheless fails L3.
- KO/JA maintain polite registers. No invented first-person professional experience. No fact, number, citation or hypothetical loss through edits: none were made.
- Prior-column samples do not establish a repeated C4 opening–headings–ending package. Full batch distribution remains unverified because C6 is absent; that is not fabricated into a MONOTONY FAIL.

No automatic or two-item manual MONOTONY FAIL is asserted. FIX independently follows from the legal, citation, scope, prose and delivery findings. The single EN opener issue still needs correction under the batch rule.

## 5. Minor edits applied

None. All four originals remain byte-for-byte unchanged. Changes to legal qualifications, numbered citations, source coverage and substantial prose are returned to the author.

Reviewed SHA-256:

```text
ko       12f88503fdd319a790150e8a6f08184cf8046dd177ead429ed0750fd66613e58
ja       a5b89e61de083c86ff75831a62b44aa91d29ff22218908d72d6e21861ac0c367
en       5a137e51213c9eb5ce7e73a80f29c25f5709a72f5e449e257d56730a6d3ffd32
zh-hant  526eeb4a470cdc1722cd25c3139bc4653a695b3d5fd382b8a80ab6e2a23e5a3b
```

## 6. Image verdict

Image: REDO — missing delivery file, not a request to redesign the scene.

Original: `images/C4.webp` is absent; `images/C4.jpg` exists and was actually viewed.

→ Problem & reason: The specified publication asset cannot be approved as supplied. The available JPEG shows a generic apartment entrance with blank moving boxes, a rolled mat, plant and slippers. It fits early move-out, is respectful, and has no people/faces, text, logos, flags, readable documents or identifying location. Visible content is OK for the fictional/unidentifiable illustration requirement.

→ Fix (required): Supply the intended WebP using this acceptable scene, then verify the actual publication file. New image generation is not required on visual grounds. The coordinator may inspect the export separately; this log does not claim to have viewed a nonexistent WebP.

→ Facts preserved: Same generic moving-out scene and absence of identifying elements.

VERDICT: FIX
