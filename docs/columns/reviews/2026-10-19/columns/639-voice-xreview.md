# C1 cross-review and native-voice pass — taiwan-rental-holding-deposit-dingjin (2026-10-19)

Reviewer: Claude Opus 5.5 (claude-opus-5-5), separate session from the writer, Mac Studio. This is a model's legal cross-check and voice edit. It is not a lawyer's review and not a native speaker's review.

Read before editing: brief-BATCH.md (including the 10/14–10/15 precision rules and the user's voice note), brief-EDITORIAL-VOICE.md, COLUMN-VOICE-RULE.md, topics/C1.md, topics/LINKS.md, research/C1-statutes.md (民法 §§166, 245-1, 248, 249, 422), drafts/C1/facts.md, the full texts of research/judgments/TPDV-113-簡上-219.txt and research/judgments/KLDV-114-基小-407.txt, SENTENCE-VARIETY-RULE.md and LESSONS.md. No new article was needed; fetch-law.py was not run.

Sources referred to below:
- 民法 §249: https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=249
- 民法 §248: https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=248
- 民法 §166: https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=166
- 民法 §245-1: https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=245-1
- TPDV 113 簡上 219 (2026-01-21): https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=TPDV%2c113%2c%e7%b0%a1%e4%b8%8a%2c219%2c20260121%2c1
- KLDV 114 基小 407 (2025-04-29): https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=KLDV%2c114%2c%e5%9f%ba%e5%b0%8f%2c407%2c20250429%2c1

## What checked out without change

The writer's draft already had the facts right in every language. I checked each of these against the saved texts:
- Taipei: court, case number, date, three-judge appeal panel of the Taipei District Court on a 簡易 case from the 臺北簡易庭, appeal dismissed, 「本判決不得上訴」.
- Taipei facts: NT$88,000 = one month's rent; two months' 押金; agreed notarisation; keys handed over; painting and woodwork; the 12/12 message; NT$88,000 refunded.
- Taipei holding: §166 → lease not formed; 預約 formed; 立約定金; §249 item 3 by analogy (citing 93台上441); 176,000 − 88,000 = 88,000; the side agreement not proven; the 12/11 entry defence rejected; §245-1 para 1 item 3 → NT$7,500.
- Keelung: court, case number, date, small-claims ruling of the 基隆簡易庭. The NT$6,000 was transferred at 7:39 the morning after the viewing, and the draft lease was requested at 9:29. On the guarantor: the landlord's message, the agent's replies and the court's finding of no consensus. The two-branch holding refused double return. The court cited 96台上2565, costs of NT$1,000 were put on the tenant, and an appeal is open within 20 days.
- §249 four items with 「除當事人另有訂定外」 and 應/不得 kept mandatory in every table.
- §245-1 kept both conditions (conduct clearly contrary to good faith; a claimant without negligence) and the two-year lapse.
- No party, agent, contractor or judge name appears in any column. Names appear only inside quoted passages in the internal facts.md.
- No bold, no phone numbers, and the address and email are in the exact rule-5 form. The en text has "English-speaking lawyer in Taipei". Internal links exist in each language and there are no links to this batch.

## Legal fixes applied in all four languages (same change, same source)

L1. The intro paragraph stated the three outcomes and "who caused it" with no source in the paragraph. It also used loose wording (사정 / 事情 / caused) where the law says 可歸責 (attributable).
- ko before: 「대만에서 집을 잡아 두려고 보낸 定金은, 계약서를 쓰기 전에 일이 틀어지면 그대로 돌아오거나 집주인에게 남거나 두 배가 되어 돌아옵니다. 무엇이 그 차이를 만들까요? 계약이 누구 사정으로 무산됐는지, 그리고 두 사람이 따로 정한 것이 있는지입니다.」
- ko after: 「집을 잡아 두려고 보낸 定金은 계약서를 쓰기 전에 일이 틀어지면 그대로 돌아오기도, 집주인에게 남기도, 두 배가 되어 돌아오기도 합니다. 타이베이와 지룽의 법원은 이런 돈에도 [민법 제249조](…)를 유추 적용했고, 계약이 어느 쪽에 책임 있는 사유로 무산됐는지에서 결론이 갈렸습니다. 따로 정한 약정이 있으면 그것이 먼저입니다.」
- ja/en/zh-hant: the same structure, with the §249 link added in that paragraph. en now reads "whether the collapse was attributable to the landlord, the tenant, or neither"; zh reads 「是可歸責於哪一方，還是雙方都不可歸責；雙方另有約定的，先依約定」.
- Source: §249 (opening words and items 2–4). The analogy comes from TPDV 「本約如未成立，定金之效力仍應類推適用該條文之規定」 and KLDV 「倘契約未成立，解釋上，該立約定金之效力應仍有同條規定之類推適用」.

L2. A court's finding was written as a general rule, and the citation that followed it did not support it. All four said, in effect, "money paid before notarisation and signing is a 立約定金", followed by a §248 link. §248 says nothing about 立約定金.
- ko before: 「공증과 서명 전에 보낸 돈은 본계약의 성립을 담보하는 입약정금(立約定金)이 됩니다([판결문], [민법 제248조]).」
- ko after: 「법원은 공증하고 본계약을 맺기 전에 건넨 돈이라는 점을 들어, 본계약의 성립을 담보하는 입약정금(立約定金)으로 성질을 정했습니다([판결문]).」 The §248 link was moved to the sentence where the tenant relies on §248: 「타이베이 사건의 세입자 쪽은 [제248조]를 근거 가운데 하나로 들었습니다.」 The tenant relied on §§248, 249 item 3 and 245-1, so "one of the grounds" is the accurate wording.
- ja: 「…というのが裁判所の見方です（[判決文]、[民法第248条]）」 → 「裁判所は、公証して本契約を結ぶ前に渡されたお金であることから、本契約の成立を担保する「立約定金」にあたると判断しています（[判決文]）。」
- en: "Money paid before notarization and signing was a deposit securing the conclusion of the lease, a 立約定金 ([judgment]; [Article 248])." → "The court classified it by when it was paid: money handed over before notarization and signing was a 立約定金, a deposit securing the conclusion of the lease ([judgment])."
- zh: 「公證、簽本約前交付的錢，就是擔保本約成立的「立約定金」（[判決全文]、[民法第248條]）」 → 「法院則認為，這筆錢是在辦理公證、簽訂本約前交付的，性質上屬於擔保本約成立的「立約定金」（[判決全文]）。」
- Source: TPDV 「被上訴人於辦理公證簽訂本約前交付上訴人88,000元，核其性質，應屬立約定金。」

L3. The drafts said the court "looked at when the money was paid rather than what it was called". The judgment never discusses the label. That sentence is replaced by the court's actual reason (L2).
- ko 「법원이 본 것은 이름보다 돈이 오간 시점이었습니다」, ja 「裁判所が見たのは呼び名よりも、お金が動いた時期です」, en "The court looked at when it was paid", zh 「法院看的卻是付款時點」 → the L2 sentence. Source: TPDV, as in L2.

L4. The NT$95,500 total was given without the default interest the court also awarded.
- ko 「집주인이 더 낼 돈은 모두 NT$95,500이 됐습니다」 → 「집주인이 더 내야 할 돈은 NT$95,500으로 늘었고, 여기에 연 5%의 지연이자가 붙었습니다.」
- ja: 「合計NT$95,500になりました」 → 「NT$95,500となり、これに年5%の遅延利息が付いています」.
- en: "bringing the landlord's total to NT$95,500" → "The landlord now owed NT$95,500 in all, plus 5% annual interest for late payment".
- zh: 「房東合計要再付95,500元」 → 「房東合計要再付95,500元，另加週年利率5%的遲延利息」.
- Source: TPDV 「合計給付95,500元，及自112年12月15日……起至清償日止，按週年利率百分之5計算之遲延利息」. The start date is not used.

L5. The entry defence was missing the court's key timing finding. Without it, the opening ("keys handed over, work started, then the message") can be read as if workers were inside on 12/12, but the keys had already been returned. I added in each language that the "sign and notarise first, then start work" messages were exchanged only on 12/8, after the keys had been returned.
- ko: 「서명·공증 뒤에 공사하자는 메시지는 열쇠를 돌려준 12월 8일에야 오갔고, 다시 들어갔다는 증거도 없었습니다」.
- ja: 「「署名と公証を済ませてから工事を」というメッセージが交わされたのは鍵を返した12月8日になってからで…」.
- en: "The messages asking to hold off until the lease was signed and notarized came on December 8, after the keys had gone back…".
- zh: 「「簽約公證後再施工」的訊息，是12月8日交還鑰匙後才傳的」.
- Source: TPDV 「上訴人提出之上開訊息截圖均係111年12月8日被上訴人交還系爭房屋鑰匙後……2人於111年12月8日始傳送訊息約定待簽約公證再進入施工」.

L6. FAQ 1 read as though §249 item 3 applied directly before any lease existed. I now state the claim, then name item 3 as applied by analogy in the Taipei judgment.
- ko 「…민법 제249조 제3호에 따라 받은 定金의 두 배를 청구할 수 있습니다. 타이베이지방법원 … 판결은 … 이 조문을 유추 적용해…」 → 「…두 배를 청구할 수 있습니다. 타이베이지방법원 113년도 簡上字 제219호 판결은 계약서 작성 전에 낸 定金에 민법 제249조 제3호를 유추 적용해…」. The same change was made in ja, en and zh.
- Source: §249 and TPDV, as in L1.

L7. FAQ 3 (fit-out costs) now says that the NT$7,500 award came in a case where the failure was attributable to the landlord. This is the court's own reasoning for §245-1.
- ko adds 「타이베이 판결은 집주인 쪽에 책임 있는 사유로 계약이 무산된 사안에서…」; ja 「家主側の責めに帰すべき事由で契約が流れた事案で」; en "Where the lease failed for a reason attributable to the landlord, the Taipei court awarded…"; zh 「在可歸責於房東而沒簽成的臺北案件中」.
- Source: TPDV 「查兩造未能簽立系爭房屋之租賃本約，係因可歸責於上訴人之事由，已如前述，上訴人對於被上訴人於準備及商議階段非因過失而信賴本約能成立所支出之費用，自應負賠償之責。」 and §245-1.

L8. The visa / job-change section said only that the point "can be disputed". I added that neither judgment decided it, so no reader takes the two cases as answering it.
- ko 「두 판결은 이 문제까지 판단하지 않았습니다.」; ja 「二つの判決は、この点までは判断していません。」; en "Neither judgment decided it."; zh 「兩件判決都沒有處理」.
- Source: KLDV (the claim was only for double return under item 3) and TPDV (the failure was attributable to the landlord). facts.md D6 and C5.

L9. The Supreme Court judgments were not opened. 96台上2565 was presented as if its own text had been read ("the Supreme Court judgment cited by Keelung is more direct: …"). It is now attributed to the Keelung court citing it.
- ko: 「지룽 판결이 인용한 최고법원 96년도 台上字 제2565호 판결은 더 직접적입니다.」 → 「지룽 판결은 최고법원 96년도 台上字 제2565호 판결의 취지를 인용해 더 구체적으로 적었습니다.」
- ja: 「…が引用する最高法院96年度台上字第2565号判決は、もっと端的です」 → 「基隆の判決は、最高法院96年度台上字第2565号判決の趣旨を引いて、もっと端的に述べています」.
- en: "The Keelung judgment quotes Supreme Court judgment 96 Tai-Shang No. 2565 more bluntly" → "The Keelung judgment, citing Supreme Court judgment 96 Tai-Shang No. 2565, puts it more bluntly".
- zh: already 「基隆的判決引用…判決，說得更直接」; no change needed.
- Source: KLDV 「（最高法院96年度台上字第2565號判決意旨參照）」.

L10. The closing line of the visa section said the 12/12 message "decided the outcome". It now says what the court actually did: it found responsibility on the basis of that message.
- ko 「타이베이 사건의 결론을 정한 것도 12월 12일에 온 메시지 한 통이었습니다」 → 「타이베이 법원이 책임을 가린 근거도 12월 12일에 온 메시지 한 통이었습니다」.
- ja 「結論を左右したのは…」 → 「台北の裁判所が責任の所在を判断した根拠も…」.
- en "the outcome turned on a single message" → "The Taipei court, too, settled responsibility on the strength of one message sent on December 12."
- zh 「最後也是12月12日的一則訊息定了結論」 → 「臺北法院認定責任歸屬，憑的也是12月12日那一則訊息」.
- Source: TPDV 「堪認兩造未能簽立系爭房屋之租賃本約，係因上開訊息所述，屬可歸責於上訴人之事由」.

## Language-specific legal fixes

ko
- 「[타이베이지방법원 … 판결]은 같은 금액을 한 번 더 내라고 했습니다」 → 「집주인은 같은 금액을 한 번 더 내야 했습니다. 간이사건 1심 판결에 대한 집주인의 항소를 같은 지방법원 합의부가 [113년도 簡上字 제219호 판결]로 2026년 1월 21일 기각했고…」. The payment order came from the first instance; the appeal panel dismissed the appeal. Source: TPDV header 「上訴人對於中華民國112年12月28日本院臺北簡易庭111年度北簡字第17842號第一審判決提起上訴」, 「主文 上訴駁回」.
- §249 table and hypothetical: 「낸 쪽 책임 있는 사유」 → 「낸 쪽에 책임 있는 사유」, and 「세입자 쪽 책임이면」 → 「세입자 쪽에 책임 있는 사유였다면」. This keeps 可歸責 wording rather than plain "fault". Source: §249.

ja
- 「契約の一方が相手方から定金を受け取ったときは」 → 「契約当事者の一方が…」. Source: §248 「訂約當事人之一方」.
- 「家族の側の事由なら」, 「払った側の事由（第2号）」 → 「…の責めに帰すべき事由」. Source: §249 「可歸責於付定金當事人之事由」.
- 「仲介業者は、変更点は署名の日に話し合えばよいと応じています」 → 「仲介業者は家主に、…」. The agent gave this reply to the landlord. Source: KLDV 「仲介王晨龍回覆「沒關係如後續雙方還有要更改的項目當天簽約時在雙方協議」」, quoted here only as evidence for this review.

en
- Summary: "Unless otherwise agreed, Taiwan courts return, forfeit or double a holding deposit paid before a lease according to which side, if either, was responsible." → "Two Taiwan district courts applied Article 249 to a deposit paid before a lease: unless agreed otherwise, who was responsible decided refund, loss or double" (156 chars). The old summary turned two district-court rulings into a general statement about "Taiwan courts", and courts do not "return" a deposit. Source: TPDV, KLDV, §249.
- "the court found that no lease had been formed" → "the court could not find that a lease had been formed". This keeps 難認 and the §166 presumption. Source: TPDV 「難認租賃契約已成立」.
- "whoever was at fault" → "whichever side was responsible". Source: TPDV 「不論是否得歸責於一方」.
- "the payer's responsibility (item 2) or nobody's (item 4)" → "a reason attributable to the payer (item 2) or to neither side (item 4)". Source: §249.
- "the agent said changes could be settled on the signing day" → "the agent told the landlord that any changes could be settled on the signing day". Source: KLDV, as above.

zh-hant
- 「法院仍判房東再付88,000元。這是[判決]，由臺北地院合議庭審理簡易事件的第二審，2026年1月21日駁回房東上訴」 → 「臺北簡易庭判房東再付88,000元，房東上訴到臺北地院合議庭，2026年1月21日被駁回（[判決]）。判決書載明不得上訴。」 This states the first instance explicitly. Source: TPDV header.
- 「仲介回說簽約當天再談」 → 「仲介則回覆房東，要更改的項目簽約當天再協議」. Source: KLDV.

## Main voice rewrites (problem → change; facts, numbers, links and hypothetical labels kept)

ko
- The link sat on a single word inside the sentence: 「집주인 아내에게서 [메시지](판결 URL)가 왔습니다」 → a plain sentence with 「([판결문])」 at the end of the paragraph.
- Rhetorical question-and-answer template: 「무엇이 그 차이를 만들까요? …입니다.」 → replaced by the sourced statement in L1.
- Tangled subject: 「定金에 적용할 규칙은 [민법 제249조]가 넷으로 나눕니다」 → 「당사자가 따로 정한 것이 없으면 定金은 [민법 제249조]의 네 가지 규칙을 따릅니다」.
- Stock hypothetical opener: 「가령 월세 NT$18,000인 집에…」 → 「워킹홀리데이로 대만에 온 사람이 월세 NT$18,000짜리 방을 잡으려고…(가상의 예입니다)」. This speaks to the Korean reader, keeps the label, and the arithmetic is unchanged (36,000 − 18,000 = 18,000).
- Heading 「타이베이 사건, 메시지 한 통이 가른 책임」 → 「타이베이 법원이 집주인 쪽 사유로 본 메시지」. The old heading echoed the section-closing line word for word.
- 「반론은 두 가지였습니다. 첫째는… 둘째는…」 → 「집주인의 반론은 두 가지였습니다. 하나는… 다른 하나는…」. This names who raised the arguments and drops the numbered-list rhythm.
- The lawyer paragraph had three parallel endings (「맡길 수 있습니다 / 변호사가 합니다 / 맡길 수 있습니다」). It now has a human subject and varied sentences: 「변호사는 … 가립니다. … 정리하고 … 보낼 수 있습니다. … 법정에 나가는 일도 맡길 수 있습니다. 결론은 증거와 법원의 판단에 달려 있습니다.」

ja
- Generic intro plus a question template: 「台湾で部屋を押さえるために定金を払えば、…同じ問いに向き合うことになります。定金はそのまま返るのか、…倍になって返るのか。分かれ目は…」 → 「部屋を押さえるために払った定金は、契約書を交わす前に話が流れると、そのまま返ることもあれば、家主の手元に残ることも、倍になって返ることもあります。台北と基隆の裁判所は…」.
- Subject switch mid-sentence: 「家主の妻から鍵を受け取り、内装業者が壁の塗装と木工を始めます」 → 「家主の妻から鍵を受け取り、内装業者に壁の塗装と木工を始めてもらっています」. The message link moved from the word 「メッセージ」 to the end of the paragraph.
- Hedged attribution tag: 「…にあたる、というのが裁判所の見方です」 → 「…にあたると判断しています」 (see L2).
- Heading 「台北の事案：一通のメッセージで決まった責任」 → 「台北の事案：家族が使うという一通のメッセージ」.
- Lawyer paragraph: 「…確かめる作業を任せられます。…送ることも弁護士の仕事です。」 → 「弁護士には、…確かめてもらえます。…まとめたうえで、…存證信函を送ることもできます。」 and 「結果は証拠と裁判所の判断によります」 → 「結果がどうなるかは、残っている証拠と裁判所の判断次第です」.

en
- Generic lead: "Anyone who pays a 定金 to hold an apartment in Taiwan faces three possible outcomes… It turns on which side caused the collapse…" → "When a deal collapses before signing, a 定金 paid to hold a place can come back as it was, stay with the landlord, or come back doubled. The courts in Taipei and Keelung applied…" (see L1).
- "It was not enough." → "It did not end the matter." The old line read as a value judgment on the refund.
- Vague: "The court looked at when it was paid." → the classification sentence in L2.
- Lawyer paragraph: "…are also part of the work. The result depends on the evidence and on the court." → "The lawyer can also negotiate with the landlord or agent, and draft the filing and appear for you in a small-claims or simplified case. How it ends depends on the evidence and on the court."
- Tightened: "an appeal panel…, hearing the second instance of a simplified-procedure case, left in place an order…" → "an appeal panel of the Taipei District Court left in place a simplified-procedure order to pay another NT$88,000, dismissing the landlord's appeal on January 21, 2026."

zh-hant
- Self-asked question template: 「差別在哪裡？看租約是因哪一方的事由沒簽成，以及雙方有沒有另外約定。」 → the sourced sentence in L1.
- Official-document tone: 「這是[判決]，由臺北地院合議庭審理簡易事件的第二審，…駁回房東上訴」 → 「臺北簡易庭判房東再付88,000元，房東上訴到臺北地院合議庭，2026年1月21日被駁回」.
- Statute-like phrasing: 「定金除當事人另有訂定外，[民法第249條]分成下列情形處理：」 → 「雙方沒有另外約定時，[民法第249條]把定金分成四種情形處理：」.
- Hypothetical: 「（虛構情境）：來台工作的外籍同事先匯12,000元定金…」 left the reader asking whose colleague. → 「一位來台工作的外籍工程師先匯了12,000元定金…（虛構情境）」. The label is kept and the arithmetic is unchanged (24,000 − 12,000 = 12,000).
- 「抗辯有兩項。第一，收款時雙方曾特約…」 → 「兩項抗辯都沒有被採納。第一，房東說收款時雙方曾特約…」. This puts the result first, names who raised the argument, and fixed the checker's FAIL for three paragraphs opening with 「房東」. 「這項抗辯同樣不採」 → 「這項主張同樣不成立」.
- Visa section: the opening statute-premise sentence was folded into the argument, so the paragraph starts from the reader's situation (「簽證沒下來或工作調動，房客因此放棄承租時，算[第249條]第2款…還是第4款…」).

## Final checks (run 2026-10-19 after the last edit)

- `python3 lint.py drafts/C1/<lang>.md <lang> taiwan-rental-holding-deposit-dingjin` printed OK for all four: ko 3,444 chars, ja 3,986 chars, en 1,489 words, zh-hant 2,630 chars.
- `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check` returned no FAIL in any language:
  - ko: cv 0.488, short 0.099. One WARN: 76% 니다 endings.
  - ja: cv 0.485, short 0.097. One WARN: 78% です・ます endings.
  - en: cv 0.551, short 0.174. OK.
  - zh-hant: cv 0.619, short 0.154. OK. The earlier FAIL (top_opener_n=3) is fixed.
- Self-check items 2–7: met in every language.
  - Opening types differ across the four versions: ko a scene with the keys, ja a result, en a date and the message, zh a quoted line from the judgment. None is a stock hypothetical opener.
  - Every version has at least two very short sentences. Contrast templates are 0 everywhere.
  - Each version ends on the reader's transfer records and messages.
- facts.md is updated to match the final text: the timing note under B2, the interest wording under B9, the per-language hypotheticals under E, and a new section H.

## Not resolved, or left for the final reviewer

- Length: every version passes lint, but three sit above the brief's suggested middle. ko is 3,444 (middle 2,800–3,100; ceiling 3,500), zh-hant 2,630 (middle 2,100–2,400; ceiling 2,700) and en 1,489 words (middle 1,250–1,400). The extra length carries two judgments and all four §249 items, each with its source. I did not cut conditions or the Keelung scope limit to reach the middle. If a later fix round has to add text to ko or zh-hant, something else will need to come out first.
- The Supreme Court judgments 93台上441 and 96台上2565 were not opened. They appear only as cited inside the two saved district-court judgments, and the text says so.
- English article wording is a plain rendering of the Chinese text, not the MOJ English translation (facts.md notes that the official English page returned an empty body).
- In each language the only paragraph without a citation is the contact paragraph. Every body paragraph states a rule, a holding or a judgment fact and so keeps its link (precision rule A). This meets self-check item 5 literally.
- The ja checker counts q=0 because the body's question ends in 「のでしょうか。」 rather than ？. This is not a FAIL.

VOICE ko: OK
VOICE ja: OK
VOICE en: OK
VOICE zh-hant: OK
