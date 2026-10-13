# G7 fact and voice check (Grok 4.7)

Slug: `taiwan-summons-defendant-witness-warrant-wanted-notice`. Drafts read: `drafts/G7/ko.md`, `ja.md`, `en.md`, `zh-hant.md`. No column file was edited. Statutes re-opened on law.moj.gov.tw on 2026-10-12. The live text matches `research/G7-statutes.md` and the drafts' 2026-10-07 check date. No judgment is cited. No statistic, private-party name, invented case, or Korean/Japanese/US rule stated as law. The mailbox scene in Korean is marked `가상의 상황입니다`. Lint: ko 1083, ja 1134, zh-hant 909, en 521 words, all OK. Variety checker: OK on all four (no FAIL line). Self-check items 2–7 are not missed twice in any language, so there is no MONOTONY fail. English has one unmade-contrast opening; that is a voice fix below, not a second miss.

## FACTS

MUST VERIFY 1: CONFIRMED — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=178 and https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=175 and https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=71 — Art. 178 still reads `得科以新臺幣三萬元以下之罰鍰，並得拘提之`. Art. 175 item 4 is `無正當理由不到場者，得處罰鍰及命拘提`. Art. 71 item 4 is `無正當理由不到場者，得命拘提` (compulsion only, no fine). All four drafts keep that split and the NT$30,000 ceiling. The ceiling itself stays. What must be fixed is the missing “as of” date and the dropped limbs listed below, not the amount or the split.

MUST VERIFY 2: CONFIRMED — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=76 — The article is `犯罪嫌疑重大` plus `必要時` plus `下列情形之一` (items 1–4 are alternatives). The drafts join the four with `거나` / `または` / `or` / `或`, after serious suspicion. That structure is right. KO and JA drop `必要時`. All four narrow items 2 and 3. See item 3.

1. ko, ja, en, zh-hant → KO `여기에 응하지 않으면 경찰이 검사에게 拘票 발부를 요청할 수 있습니다` / JA `応じなかったときは、警察が検察官に拘票の発付を求められます` / EN `If the police sent a notice to attend instead of a prosecutor, they may ask a prosecutor for that warrant` / ZH `警察發的是通知書時，不到場可以報請檢察官核發拘票` → Art. 71-1 authorizes a report to the prosecutor only after a lawful notice and only if the person does not appear without a justified reason (`經合法通知，無正當理由不到場者，得報請檢察官核發拘票`). KO, JA, and ZH keep non-appearance and drop both `合法通知` and `無正當理由`. EN drops non-appearance as well: the “if” is only who sent the paper. facts.md G7-06 has the unjustified absence and still omits `經合法通知`. → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=71-1 → Restore `經合法通知` and `無正當理由不到場` in all four. In English, tie the warrant request to that absence, not to the mere sending of a notice.

2. ko, ja, en → KO `소환에 정당한 이유 없이 응하지 않으면 拘提할 수 있습니다` and `정당한 이유 없이 나오지 않으면 3만 대만달러 이하의 과태료를 물릴 수 있고` / JA `正当な理由なく呼出しに応じなければ、拘提できます` and `正当な理由なく出頭しなければ、3万台湾ドル以下の過料を科し` / EN `A summoned defendant who stays away without a justified reason may be taken in by compulsory production` → Art. 75 and Art. 178 both require `經合法傳喚`, not any summons. ZH keeps `經合法傳喚` in both places. EN keeps “lawful summons” for the witness fine and drops it for the defendant. KO and JA drop it for both. → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=75 and https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=178 → Add lawful summons (`合法傳喚`) to the defendant sentence in ko, ja, and en, and to the witness-fine sentence in ko and ja.

3. ko, ja, en, zh-hant → KO `범죄 혐의가 무겁고, 주거가 일정하지 않거나 도주할 우려가 있거나 증거를 없앨 우려가 있거나 사형·무기징역 또는 최저형이 징역 5년 이상인 죄를 지은 경우입니다` / JA `犯罪の嫌疑が重く、住居が一定しない、逃亡のおそれがある、証拠隠滅のおそれがある、または死刑、無期懲役、もしくは法定刑の下限が懲役5年以上の罪を犯した場合です` / EN `A defendant under serious suspicion can be taken in directly, when necessary, if the defendant has no fixed residence, is a flight risk, may destroy evidence or collude with accomplices or witnesses, or is charged with an offense punishable by death, life imprisonment or a minimum of five years or more` / ZH `被告犯罪嫌疑重大，而且無一定住居所、有逃亡之虞、有湮滅證據或勾串共犯證人之虞，或所犯是死刑、無期徒刑或最輕本刑五年以上有期徒刑之罪，必要時可以直接拘提` → The four-way “or” is right, and EN/ZH keep `必要時`. KO/JA omit `必要時`. Item 2 in the statute is actual flight or facts sufficient to believe a risk of flight (`逃亡或有事實足認為有逃亡之虞`); every draft keeps only the risk. Item 3 is facts sufficient to believe destruction, forgery, or alteration of evidence, or collusion with an accomplice or a witness. KO/JA keep only destruction. EN/ZH add collusion and still drop forgery and alteration (`偽造、變造`) and the “facts sufficient” threshold. KO/JA `죄를 지은` / `罪を犯した` and EN `is charged with` are stronger or narrower than `所犯為` (the offense in question is one whose lightest principal punishment is that level). ZH `所犯是` matches. facts.md G7-07 already has “if necessary,” actual flight, forgery, and collusion; the drafts narrowed that sheet. → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=76 → Restore the full gate in every language: serious suspicion, one of the four, and `必要時`. Item 2 must include flight itself. Item 3 must include destruction, forgery, alteration, and collusion, each on facts sufficient to support the fear. Item 4 must stay “the offense is one punishable by death, life imprisonment, or a minimum of five years,” not “the person committed it” and not “charged” alone.

4. ko, ja → KO body `도망하거나 숨은 피고인은 通緝 대상이 됩니다` and summary `불출석 시 拘提가, 증인용이면 3만 대만달러 이하의 과태료와 拘提가 따릅니다` / JA body `逃亡または潜伏した被告は、通緝の対象になります` and summary `不出頭に拘提が、証人用なら3万台湾ドル以下の過料と拘提が付きます` → Art. 84 is `得通緝之` (may), not a status that follows automatically. The KO summary and the JA summary use `수 있습니다` / `ことがあります` for the wanted notice, which is right, then the bodies upgrade it. The KO/JA summaries use `따릅니다` / `付きます` for 拘提 and the fine, which upgrades `得` in Arts. 75 and 178. EN `risks` and ZH `得通緝` / `記載…得命拘提` do not make the same upgrade. → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=84 and https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=75 and https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=178 → In Korean and Japanese, write the wanted notice and the non-appearance consequences as “may,” matching the FAQ. Replace `대상이 됩니다`, `따릅니다`, `対象になります`, and `付きます` for these `得` powers.

5. ko, ja, en, zh-hant → KO `검사와 사법경찰이 拘提하거나 곧바로 체포할 수 있고, 이해관계인도 체포해 넘길 수 있습니다. 사유가 없어지면 취소해야 합니다` / JA `検察官と司法警察官は拘提し、または直ちに逮捕できます。利害関係人も逮捕して引き渡せます。理由がなくなれば取り消さなければなりません` / EN `Once a notice is announced, prosecutors and judicial police may take the person in or arrest on the spot, and an interested party may arrest and hand the person over. It has to be withdrawn when the reason ends or it is clearly unnecessary` / ZH `檢察官、司法警察官得拘提被告或逕行逮捕；利害關係人也可以逕行逮捕通緝的被告，送交檢察官或司法警察官。通緝的原因消滅或顯無必要時，應即撤銷` → Art. 87 para. 1 names `檢察官、司法警察官` only, not `司法警察`. Korean `사법경찰` and English `judicial police` are the other rank. JA and ZH name `司法警察官`, which is right. Para. 2 allows an interested person to arrest and deliver the defendant, or to ask a prosecutor or judicial police officer to arrest. All four keep the arrest-and-deliver limb and drop `或請求…逮捕之`. Withdrawal is mandatory immediately when the reason ends or the notice is clearly unnecessary (`應即撤銷`). KO/JA keep only “the reason ends.” EN keeps both triggers and drops `即` and `通知` (`經通知或公告`, not announcement alone). ZH matches the triggers and `應即`, and still drops the request-to-arrest alternative. facts.md G7-09 says “judicial police,” which is the same looseness as the English draft, and it does include both the request alternative and “clearly unnecessary.” → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=87 → KO: `사법경찰관`. EN: judicial police officer, and `notified or announced`. All four: add the request-to-arrest alternative. KO/JA: add “or it is clearly no longer necessary” and “immediately.” EN: add “immediately.”

6. ko, ja, en → KO `拘提에는 拘票가 필요하고 사법경찰이 집행합니다` / JA `拘提には拘票が要り、司法警察が執行します` / EN `carried out by judicial police under a warrant` → Art. 77 `應用拘票` is right. Art. 78 execution is `司法警察或司法警察官`, not judicial police alone. ZH already says both. → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=77 and https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=78 → Name both ranks in ko, ja, and en. Keep this separate from Art. 87, where only `司法警察官` appears.

7. ko, ja, en → KO `출석한 피고인에게 다음 기일과 장소, 불출석하면 拘提할 수 있다는 점을 말로 알리고 조서에 적으면 송달과 같습니다` / JA `出頭した被告に、次の期日と場所、来なければ拘提できることを口頭で告げ、調書に記載すれば、送達と同じです` / EN `a defendant who is present and is told orally the next date, time and place, and that absence may mean compulsory production, with the minutes recording it, is treated as served` → Art. 72 has two routes with the same effect as service. The drafts keep the oral notice to a defendant who is already present. They drop `被告經以書狀陳明屆期到場者，亦同`. ZH keeps the written-submission route. The oral notice must include day, hour, and place (`日、時、處所`). EN and ZH include the hour. KO `기일과 장소` and JA `期日と場所` drop `時`. → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=72 → Add the written-submission route to ko, ja, and en. Add the hour to ko and ja. ZH’s Art. 176 sentence (`證人的傳喚準用這個規定`) correctly quasi-applies Art. 72. Art. 176 also quasi-applies Art. 73 (notice to the head of the prison or detention center). Add that clause in zh-hant or leave it; do not delete the Art. 72 point. https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=176 and https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=73

8. ko, ja, en → KO `傳票는 늦어도 출석 24시간 전까지 송달해야 하고(급박한 경우는 예외), 일당과 여비도 청구할 수 있습니다` / JA `傳票は遅くとも出頭の24時間前までに送達しなければならず（急迫の場合を除く）、日当と旅費も請求できます` / EN `A witness summons must be served at least 24 hours before the date, urgent cases aside, and the witness may claim daily and travel expenses (Art. 175).` → The 24-hour rule and the urgent-case exception match Art. 175’s last paragraph, and item 5 requires the summons to state `證人得請求日費及旅費`. ZH says the summons must record that request and links Art. 175. KO and JA state a present right to be paid and give this paragraph no link. EN states the same right with a bare article number. The payment rule, which these three sentences actually assert, is Art. 194: `證人得請求法定之日費及旅費。但被拘提或無正當理由，拒絕具結或證言者，不在此限。` The request is made to the court within ten days after the examination ends, and travel expenses may be advanced (`應於訊問完畢後十日內，向法院為之。但旅費得請求預行酌給`). → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=175 and https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=194 → Preferred short fix: say only that the witness summons must state the right to request daily and travel fees, and link Art. 175, as zh-hant already does. If the sentence stays as a present right to be paid, cite Art. 194 and keep the exception, the ten-day request to the court, and the advance travel fee. Do not leave the unqualified right.

9. ko, ja, en, zh-hant → KO `과태료는 법원이 재판으로 정하고, 검사가 소환했다면 법원에 신청합니다` / JA `過料を決めるのは裁判所です。検察官が呼び出した場合は、裁判所に申し立てます` / EN `leaves the fine to the court, on the prosecutor's application if the prosecutor issued the summons` / ZH `罰鍰由法院裁定，檢察官傳喚的，要聲請法院裁定` → Those sentences match Art. 178 paras. 1–2, including `應聲請`. Para. 3 gives an interlocutory appeal against that ruling (`得提起抗告`). Para. 4 says witness 拘提 quasi-applies Arts. 77–83 and 89–91, so a witness warrant is also a `拘票`. The column states the warrant rule only for a defendant. → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=178 → Add one clause: the fine ruling may be challenged by `抗告`, and witness 拘提 also needs a `拘票` under the Art. 77 quasi-application. Do not drop the court-ruling point.

10. ko, ja, en, zh-hant → KO body `3만 대만달러 이하의 과태료` / JA body `3万台湾ドル以下の過料` / EN body `NT$30,000` / ZH body `新臺幣三萬元以下罰鍰` → The figure matches `三萬元以下` on the live Art. 178 page. The body sentence does not carry the as-of date the lane requires for an amount. The FAQ and the source-check line do (`2026년 10월` / `2026年10月時点` / `as of October 2026` / `2026年10月`). → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=178 → Put “as of October 2026” (each language’s required phrase) on the body sentence that states the ceiling. Keep the number.

Held, do not cut: Art. 71 item 4 versus Art. 175 item 4; the NT$30,000 ceiling; Art. 176-1’s duty with the statutory exception; Art. 84’s flight-or-hiding ground; Art. 85’s signatures (`檢察總長或檢察長` during investigation, `法院院長` at trial); the witness-only 24-hour service rule and its urgent-case exception; the statement that service and enforcement abroad, and whether leaving Taiwan is flight, were not confirmed; the link to published column 259, which on the live Korean page does cover the 24 hours from 拘提 or arrest and the separate exit restriction (https://tseng-law.com/ko/columns/taken-taiwan-police-station-first-24-hours-not-release). The amendment line is right: the history page’s latest entry is 13 May 2026, Art. 101-1 only, and it does not touch the articles cited here (https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=C0010001). Calling an investigation-stage person a `被告` on a prosecutor’s 傳票 matches Art. 71 para. 4; the police paper stays a `通知書` under Art. 71-1.

## VOICE

Variety: `variety_metrics.py check` returned OK for ko (cv 0.503, short 0.217), ja (cv 0.495, short 0.276), en (cv 0.582, short 0.208), and zh-hant (cv 0.641, short 0.208). No stock `가령` / `例えば…とします` / `Suppose` / `假設` opener. The Korean scene is labeled after the picture, which section 2-4 allows, and it is not the opening type repeated across this batch. At least two very short sentences in each file. No three paragraphs share a first word. No three claim-then-caveat paragraphs. Contrast-template count is 0. Closings are the required contact line and the required general-information line after the sources. Korean stays 합니다체. Japanese stays です・ます. No bold, no emoji, no checklist heading. No MONOTONY item.

### ko

The mailbox opening and the three short bridges (`증인이라면 의무가 따릅니다`, `증인에게도 보호는 있습니다`, `피고인이라면 순서가 다릅니다`) read as Korean and keep the defendant/witness split. The title names the actual split. Two spots do not.

Original: `피고인(수사 단계의 피의자 포함)에게 보내는 傳票에는 사건의 案由를 적고, 정당한 이유 없이 나오지 않으면 拘提를 명할 수 있다고 적게 되어 있습니다`

Problem: `案由` is left as an unglossed statute word in a sentence a Korean reader is asked to picture on a form.

Suggested rewrite: `피고인에게 보내는 傳票에는 사건명(案由)과, 정당한 이유 없이 나오지 않으면 拘提를 명할 수 있다는 문구를 적게 되어 있습니다` (keep the investigation-stage gloss and the Art. 71 link; apply FACTS items 2 and 10 in the witness sentence, not by deleting them here).

Original: `피고인이라면 순서가 다릅니다. 소환에 정당한 이유 없이 응하지 않으면 拘提할 수 있습니다([제75조](...)). 拘提에는 拘票가 필요하고 사법경찰이 집행합니다([제77조](...), [제78조](...)). 傳票를 송달하지 않아도 같은 효력이 생기는 경우가 있습니다. ... 경찰의 통지서는 따로 봅니다. ... 소환 없이 곧바로 拘提하는 길도 있습니다. ...`

Problem: one paragraph runs six rules in a row (Arts. 75, 77, 78, 72, 71-1, 76). It reads as a statute stack, not as a next step.

Suggested rewrite: end the paragraph after the oral-notice sentence, then start the next with the police notice, then a third with direct 拘提. Keep every rule, link, and the FACTS corrections in items 1, 3, 6, and 7. Do not add a new legal conclusion while breaking the paragraph.

### ja

The question in the first sentence is natural です・ます, and the title states the defendant/witness split without `解説します`. The same stack as Korean is the problem.

Original: `被告の場合は順序が違います。正当な理由なく呼出しに応じなければ、拘提できます（[第75条](...)）。拘提には拘票が要り、司法警察が執行します（[第77条](...)、[第78条](...)）。傳票を送達していなくても、同じ効力が生じる場合があります。... 警察の出頭通知は別です。... 呼出しを経ずに拘提する道もあります。...`

Problem: the paragraph is a translation-shaped list of six rules. A Japanese reader gets the split from `順序が違います` and then loses it in the chain.

Suggested rewrite: close the first defendant paragraph at the oral notice, then one paragraph for the police notice, then one for direct 拘提. Keep です・ます, the links, and FACTS items 1, 3, 6, and 7. `証人には義務があります` and `証人にも保護はあります` can stay; they are short and not である.

`秘密でない概要から昊鼎国際法律事務所（wei@hoveringlaw.com.tw）にご相談いただけます` is a step more like a consultation pitch than the Korean “you may send an outline.” Suggested rewrite, same contact facts: `受け取った書面の種類と日付を整理し、秘密でない概要を昊鼎国際法律事務所（wei@hoveringlaw.com.tw）に送ってもらえます。`

### en

Most of the body is plain and active. `Witnesses owe their attendance.` is a real short sentence. Two openings are not.

Original: `A Taiwan summons is not one document with one meaning.`

Problem: it rebuts a claim the reader has not made, and it delays the line on the paper that the rest of the column is about.

Suggested rewrite: `The warning printed on a Taiwan summons is either compulsory production alone, or a fine plus compulsory production. Which one it is depends on whether the paper calls you a defendant or a witness.`

Original: `Short notice is limited too.`

Problem: the sentence does not say what is limited. The next sentence is the actual rule.

Suggested rewrite: delete it and keep `A witness summons must be served at least 24 hours before the date, urgent cases aside`, with the Art. 175 link and the FACTS item 8 choice on fees.

The title `What Ignoring It Means for a Defendant and for a Witness` is specific enough to keep. It is not a “here’s what you need to know” heading.

### zh-hant

The body reads as Taiwan prose. `拿到傳票，先看自己是被告，還是證人。` `有些情形連傳喚都免了。` `本文沒有查證。` No simplified characters and no mainland terms (`罰鍰`, `地檢署`, `筆錄`, `聲請`, `拘票` are the local words). 應 and 得 are kept in the sentences that quote the articles. Two lines are the exception.

Original: `收到地檢署傳票：被告和證人不到場的後果不同，通緝又是什麼`

Problem: `通緝又是什麼` is an explainer tail. The article already says what a wanted notice is for.

Suggested rewrite: `收到地檢署傳票：被告不到場得拘提，證人不到場還有罰鍰` (same split; `通緝` remains in the body under Art. 84).

Original: `傳票也不是非有不可。`

Problem: the double negative is stiff, and it sounds broader than Art. 72. The next sentence is the real rule (oral notice, or a written promise to appear, has the same effect as service).

Suggested rewrite: `人已經到過的話，下一次不一定要再送一張傳票。` Then keep the Art. 72 sentence, including `書狀陳明屆期到場`, and the Art. 176 cross-reference.

FACTS: FIX
VOICE ko: FIX
VOICE ja: FIX
VOICE en: FIX
VOICE zh-hant: FIX
