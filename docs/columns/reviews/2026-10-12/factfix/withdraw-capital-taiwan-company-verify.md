# verify — fact-withdraw-capital-taiwan-company-1 (round 0)

Column 002 `withdraw-capital-taiwan-company`, languages ko / ja / en / zh-hant. Live text staged from origin/main d117a9328.

## How the sources were read

All official pages below were opened with WebFetch on 2026-10-12. WebFetch answers through a small model that refuses to reproduce more than about 125 characters at once, so every article was requested paragraph by paragraph; each quotation below is one such verbatim return. The two penalty clauses that decide Note 1 were read twice, on the single-article page (`LawSingle.aspx`) and on the full-act page (`LawAll.aspx`), and the two readings are identical.

- law.moj.gov.tw footer on that date: 法規整編資料截止日：民國 115 年 10 月 02 日.
- Headers on the full-act pages: 公司法 修正日期 民國 114 年 12 月 26 日; 所得稅法 修正日期 民國 115 年 09 月 11 日 (the page's not-yet-in-force notice names only 第 43-4 條, not 第 75 條); 公司登記辦法 修正日期 民國 110 年 04 月 23 日, not marked 廢止.
- https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=J0080001 — the two most recent entries (民國 114 年 12 月 26 日: 修正公布第 449 條、增訂第 387-1 條; 民國 110 年 12 月 29 日: 修正公布第 172-2、356-8 條) do not touch any article checked here. The entry before them is the 民國 107 年 8 月 1 日 revision, which WebFetch reports as including 第 9 條.

Not reachable, and what was used instead:

- `https://law.moea.gov.tw/LawContent.aspx?id=FL011312` (the column's own source link for 公司登記辦法) returned HTTP 403 to WebFetch twice. The regulation was read on law.moj.gov.tw (`pcode=J0080020`, Chinese and English pages). A web search restricted to law.moea.gov.tw lists that URL under the title 「經濟部主管法規共用系統-法規內容-公司登記辦法」, so the link points to the regulation its label names. The page body itself was not read. The link is unchanged in every language.
- The English single-article pages (`/ENG/LawClass/LawSingle.aspx?pcode=J0080001&flno=9` and `&flno=90`) came back empty. The English wording was read on the English full-act page instead.
- A raw download with curl was not permitted in this session.

## Summary of verdicts

| Note (triage) | ko | ja | en | zh-hant |
| --- | --- | --- | --- | --- |
| 1 — penalty wording of 公司法 第9條 / 第90條 (拘役; 或科或併科) | CONFIRMED-ERROR | CONFIRMED-ERROR | PARTLY | ORIGINAL-RIGHT |
| 2 — who is punished under 第9條 | PARTLY | PARTLY | PARTLY | ORIGINAL-RIGHT |
| 3 — 第89條 / 第90條 cited directly although they sit in the 無限公司 chapter | ORIGINAL-RIGHT | ORIGINAL-RIGHT | ORIGINAL-RIGHT | ORIGINAL-RIGHT |
| 4 — 45-day and 30-day tax deadlines and their basis | ORIGINAL-RIGHT | ORIGINAL-RIGHT | ORIGINAL-RIGHT | ORIGINAL-RIGHT |
| 6a — start point of the 15-day suspension-registration period | ORIGINAL-RIGHT | ORIGINAL-RIGHT | ORIGINAL-RIGHT | ORIGINAL-RIGHT |
| 6b — name given to 公司登記辦法 vs the source list | ORIGINAL-RIGHT | ORIGINAL-RIGHT | ORIGINAL-RIGHT | ORIGINAL-RIGHT |

No URL was removed, replaced or added in any file, so this file has no REMOVED-URL line.

---

## Note 1 — penalty wording of 公司法 第9條 and 第90條

### Claims in the column

- ko: "…허용한 경우에 5년 이하의 유기징역·구류 또는 50만 대만달러 이상 250만 대만달러 이하의 벌금을 규정합니다."; "「회사법」 제90조에 따라 1년 이하의 유기징역·구류 또는 6만 대만달러 이하의 벌금에 처해질 수 있습니다."
- ja: "定められているのは、5年以下の有期刑、拘留または50万以上250万新台湾ドル（NT$）以下の罰金です。"; "…清算人には、1年以下の有期刑、拘留またはNT$6万以下の罰金が科され得ます（会社法第90条）。"
- en: "The penalty is imprisonment for up to five years, detention, or a fine of between NT$500,000 and NT$2.5 million."; "…faces imprisonment for up to one year, detention, or a fine of up to NT$60,000 (Company Act, Article 90)."
- zh-hant: "公司負責人可能面臨五年以下有期徒刑、拘役，或科或併科新臺幣50萬元以上250萬元以下罰金。"; "可能面臨一年以下有期徒刑、拘役，或科或併科新臺幣6萬元以下罰金。"

No FAQ answer and no summary in any language states these penalties.

### Official text

1. https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=9 — 公司法 第 9 條 第 1 項 至 第 3 項 (retrieved 2026-10-12; the penalty clause from 「公司負責人各處」 to 「罰金。」 read again on https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080001, identical)

   > 公司應收之股款，股東並未實際繳納，而以申請文件表明收足，或股東雖已繳納而於登記後將股款發還股東，或任由股東收回者，公司負責人各處五年以下有期徒刑、拘役或科或併科新臺幣五十萬元以上二百五十萬元以下罰金。
   > 有前項情事時，公司負責人應與各該股東連帶賠償公司或第三人因此所受之損害。
   > 第一項經法院判決有罪確定後，由中央主管機關撤銷或廢止其登記。但判決確定前，已為補正者，不在此限。

2. https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=90 — 公司法 第 90 條 (retrieved 2026-10-12; 第 2 項 read again on the LawAll page, identical)

   > 清算人非清償公司債務後，不得將公司財產分派於各股東。
   > 清算人違反前項規定，分派公司財產時，各處一年以下有期徒刑、拘役或科或併科新臺幣六萬元以下罰金。

3. https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=33 — 中華民國刑法 第 33 條 (retrieved 2026-10-12). 拘役 is one of the principal punishments:

   > 主刑之種類如下：
   > 一、死刑。
   > 二、無期徒刑。
   > 三、有期徒刑：二月以上十五年以下。但遇有加減時，得減至二月未滿，或加至二十年。
   > 四、拘役：一日以上，六十日未滿。但遇有加重時，得加至一百二十日。
   > 五、罰金：新臺幣一千元以上，以百元計算之。

4. https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080067&flno=19 — 社會秩序維護法 第 19 條 (retrieved 2026-10-12). Taiwan law has a different sanction that is actually named 拘留:

   > 處罰之種類如左：
   > 一、拘留：一日以上，三日以下；遇有依法加重時，合計不得逾五日。

   (items 二 to 六 on the page: 勒令歇業、停止營業、罰鍰、沒入、申誡)

5. https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=J0080001 — official English translation of the Company Act, Amended Date 2025-12-26 (retrieved 2026-10-12). Penalty clauses as returned:
   - Art. 9 para. 1: "the responsible persons shall each be punished with imprisonment for a term of not more than five years, detention, or in lieu thereof or in addition thereto a fine in an amount of not less than NT$ 500,000 but not more than NT$ 2,500,0000." (the last figure is printed that way on the English page; the Chinese text says 二百五十萬元)
   - Art. 90 para. 2: "shall be severally subject to imprisonment for a period not exceeding one year, detention or, singularly or in addition thereto, a fine not exceeding NT$60,000."

### Verdict

- ko: CONFIRMED-ERROR, two points.
  - 「구류」. The statute says 拘役, a principal punishment under 刑法 第33條第4款. 구류 is the Korean reading of 拘留, and 拘留 in Taiwan law is a separate sanction under 社會秩序維護法 第19條 (one to three days). The column names a penalty the article does not contain. Correct term: 구역(拘役).
  - 「또는 … 벌금」. The statute says 或科或併科: the fine may be imposed alone or together with 有期徒刑 or 拘役. "A·B 또는 벌금" presents the fine only as an alternative to custody. Correct statement: 유기징역·구역(拘役) 또는 벌금, and the fine may also be imposed together with the custodial penalty.
- ja: CONFIRMED-ERROR, the same two points. 「拘留」 is, character for character, the name of the other Taiwanese sanction; the statute says 拘役. 「または…罰金」 leaves out the 併科. Correct: 拘役, and the fine may be imposed in addition.
  - 「有期刑」 for 有期徒刑 is a rendering question (issues.md note 5, not in the triage list). It names a fixed-term custodial sentence and states nothing false, so it stays.
- en: PARTLY. "detention" is the word the official English translation uses for 拘役, so that word is right and stays. What is wrong is "or a fine": it leaves out that the fine may be imposed in addition to imprisonment or detention ("in lieu thereof or in addition thereto").
- zh-hant: ORIGINAL-RIGHT. Both sentences carry 「有期徒刑、拘役，或科或併科…罰金」 with the statute's amounts. Left unchanged and used as the reference version.
- Terms and amounts in all four versions (5 years; NT$500,000 to NT$2,500,000; 1 year; NT$60,000) match the statute and are unchanged.

---

## Note 2 — who is punished under 第9條

### Claims in the column

- ko: "…허용한 경우에 5년 이하의 … 벌금을 규정합니다." (no person named)
- ja: "…株主による回収を許した場合を処罰します。定められているのは…罰金です。" (no person named)
- en: "It applies when share capital … was returned to shareholders or shareholders were permitted to recover it. The penalty is imprisonment…" (no person named)
- zh-hant: "…公司負責人可能面臨五年以下有期徒刑…"

### Official text

1. 公司法 第 9 條 第 1 項 (URL and full quotation under Note 1): 「…公司負責人各處五年以下有期徒刑…」. 第 2 項 makes the same persons liable for damages jointly with the shareholders concerned (與各該股東連帶賠償).
2. https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=8 — 公司法 第 8 條 第 1 項、第 2 項 (retrieved 2026-10-12), read to see who that is:

   > 本法所稱公司負責人：在無限公司、兩合公司為執行業務或代表公司之股東；在有限公司、股份有限公司為董事。
   > 公司之經理人、清算人或臨時管理人，股份有限公司之發起人、監察人、檢查人、重整人或重整監督人，在執行職務範圍內，亦為公司負責人。

### Verdict

- zh-hant: ORIGINAL-RIGHT. It names 公司負責人. Unchanged; reference version.
- ko, ja, en: PARTLY. Exactly what is wrong: the penalty of Art. 9(1) is stated without the person the article attaches it to. No word in the three sentences is false, but the article punishes 公司負責人 (各處, each of them), and the surrounding paragraphs are written for a shareholder who wants the contribution back. A penalty with no addressee placed next to "returned to shareholders" reads as falling on the shareholder who receives the money, which the article does not say. The three versions also disagree with the zh-hant version on this point.
- Correction: the addressee is added inside the Art. 9 sentence that Note 1 already corrects, with the statute's term in parentheses and the word each version already uses for 負責人 in section 5 (ko 책임자, ja 責任者, en "responsible person"). The Art. 8 definition was not added to the text; it would be a new statement, not a correction.
- Art. 90 needs no such change: every version already says the liquidator (청산인 / 清算人 / "a liquidator") is the one punished, as Art. 90(2) does.
- For the reviewer: if this is judged an addition and not a correction, it can be reverted on its own without touching Note 1 — ko remove "회사 책임자(公司負責人)에 대하여 ", ja "場合に、会社の責任者（公司負責人）を処罰します" back to "場合を処罰します", en "The penalty falls on the company’s responsible persons (公司負責人): imprisonment" back to "The penalty is imprisonment".

---

## Note 3 — 第89條 and 第90條 cited directly

### Claims in the column

- ko: "「회사법」 제89조에 따르면 회사 재산으로 채무를 변제하기에 부족한 경우 청산인은 즉시 파산선고를 신청해야 합니다."; "「회사법」 제90조에 따라…"
- ja: "清算人は、会社財産が債務を弁済するのに不足するとき、直ちに破産宣告を申し立てなければなりません。会社法第89条の定めです。"; "…（会社法第90条）"
- en: "Under Article 89 of the Company Act, if the company’s property is insufficient to pay its debts, the liquidator must immediately apply for a declaration of bankruptcy."; "(Company Act, Article 90)"
- zh-hant: "依《公司法》第89條，公司財產不足以清償債務時，清算人應即聲請宣告破產。"; "依《公司法》第90條…"

The column discusses 有限公司 and 股份有限公司.

### Official text

1. https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=89 — 公司法 第 89 條 (retrieved 2026-10-12)

   > 公司財產不足清償其債務時，清算人應即聲請宣告破產。
   > 清算人移交其事務於破產管理人時，職務即為終了。
   > 清算人違反第一項規定，不即聲請宣告破產者，各處新臺幣二萬元以上十萬元以下罰鍰。

2. 公司法 第 90 條 — quoted under Note 1.
3. https://law.moj.gov.tw/LawClass/LawAllPara.aspx?pcode=J0080001 — chapter list of 公司法 (retrieved 2026-10-12): 「第 二 章 無限公司 § 40」, in it 「第 六 節 清算 § 79」; 「第 三 章 有限公司 § 98」; 「第 五 章 股份有限公司 § 128」, in it 「第 十二 節 清算 § 322」. 第 89 條 and 第 90 條 therefore stand in the 無限公司 chapter, 清算 section.
4. https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=113 — 公司法 第 113 條 (retrieved 2026-10-12)

   > 公司變更章程、合併及解散，應經股東表決權三分之二以上之同意。
   > 除前項規定外，公司變更章程、合併、解散及清算，準用無限公司有關之規定。

5. https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=334 — 公司法 第 334 條 (retrieved 2026-10-12)

   > 第八十三條至第八十六條、第八十七條第三項、第四項、第八十九條及第九十條之規定，於股份有限公司之清算準用之。

### Verdict

- All four languages: ORIGINAL-RIGHT. The reviewer's observation about the structure is correct: Art. 89 and Art. 90 belong to the 無限公司 chapter. They reach the two company types of this column by reference — 有限公司 through Art. 113 para. 2 (清算 準用無限公司有關之規定) and 股份有限公司 through Art. 334, which lists 第八十九條及第九十條 by number. The rule each sentence states is therefore the law for both company types, and the article numbers given are the articles that contain it. Citing the article without the reference route leaves out a step but states nothing wrong. Left unchanged.
- The ko, en and zh-hant versions already show the reference route once, for the six-month period ("제87조 제3항, 주식회사는 제334조, 유한회사는 제113조 제2항에 따라 준용"); 第 87 條 第 3 項 was opened and reads 「清算人應於六個月內完結清算；不能於六個月內完結清算時，清算人得申敘理由，向法院聲請展期。」. The live ja text has no such sentence. That is not among the reported issues and was not touched.

---

## Note 4 — 45-day and 30-day tax deadlines

### Claims in the column (steps 4 and 7 of section 2)

- ko: "주무기관의 해산 승인일부터 45일 이내에 당기 결산신고"; "기간은 주무기관의 승인 공문 발송일(발문일) 다음 날부터 계산합니다"; "청산 종료일부터 30일 이내에 청산소득을 신고"
- ja: "主管機関の解散承認日から45日以内に当期の決算申告"; "この期間は主管機関の承認公文の発送日（発文日）の翌日から計算します"; "清算終了日から30日以内に清算所得を申告"
- en: "within 45 days after the competent authority approves the dissolution"; "Official tax guidance counts the period from the day after the competent authority sends the approval document"; "within 30 days after the liquidation ends"
- zh-hant: "應自主管機關核准解散之日起四十五日內辦理當期決算申報"; "期間自主管機關核准公文的發文日之次日起算"; "應自清算完結之日起三十日內申報清算所得"

### Official text

1. https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=75 — 所得稅法 第 75 條 第 1 項 至 第 3 項 (retrieved 2026-10-12)

   > 營利事業遇有解散、廢止、合併或轉讓情事時，應於截至解散、廢止、合併或轉讓之日止，辦理當期決算，於四十五日內，依規定格式，向該管稽徵機關申報其營利事業所得額及應納稅額，並於提出申報前自行繳納之。
   > 營利事業在清算期間之清算所得，應於清算結束之日起三十日內，依規定格式書表向該管稽徵機關申報，並於申報前依照當年度所適用之營利事業所得稅稅率自行計算繳納。但依其他法律得免除清算程序者，不適用之。
   > 前項所稱清算期間，其屬公司組織者，依公司法規定之期限；屬有限合夥組織者，依有限合夥法規定之期限；非屬公司或有限合夥組織者，為自解散、廢止、合併或轉讓之日起三個月。

2. https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/profit-seeking-enterprise-income-tax/liquidation-procedure/x6mOPan — 財政部稅務入口網「營利事業於年度中有暫停營業、解散、廢止、合併或轉讓情事者，應如何辦理決算申報及清算申報？ (2608)」, 更新日期 107-08-09 (the page the column links; retrieved 2026-10-12). Sentences returned:

   > 營利事業遇有解散、廢止、合併或轉讓情事時，應於主管機關核准解散、廢止、合併、轉讓之日起45日內，辦理當期決算申報
   > 所稱「主管機關核准之日」係指主管機關核准文書發文日。
   > 辦理當期決算申報之時限，應自主管機關核准日之次日起算。
   > 營利事業在清算期間之清算所得，應於清算結束之日起30日內，依規定格式書表向稽徵機關申報
   > 年度中曾暫停營業之營利事業，仍應依規定辦理年度結算申報
   > 但依其他法律得免除清算程序者，如合併、分割或破產而解散者可免辦清算申報。

   The page cites 所得稅法第75條 and three 財政部 rulings (76.1.8 台財稅第7563117號函, 83.8.17 台財稅第831606355號函, 97.1.24 台財稅字第09604136230號函).

3. https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080001 — 公司法 第 24 條 (retrieved 2026-10-12): 「解散之公司除因合併、分割或破產而解散外，應行清算。」

### Verdict

- All four languages: ORIGINAL-RIGHT. 45 days and 30 days are the figures of 所得稅法 第75條 第1項 and 第2項. The start points given (approval by the competent authority, counted from the day after the 發文日 of the approval document; the end of liquidation) are the ones in the official guidance the column links, and the column attributes the 發文日 rule to that guidance, which is accurate. The reviewer's recollection of the basis (所得稅法 第75條) is confirmed, but a missing article citation is not a misstatement, and the linked official page supports every number. Nothing changed; no source was added.
- Also consistent with the same sources and unchanged: the statement that dissolution by merger, split or bankruptcy may be exempt from liquidation (公司法 第24條; 所得稅法 第75條 第2項但書) and the statement that a company still files its annual return for a year in which it suspended business.

---

## Note 6 — suspension registration: start of the 15 days and the name of the regulation

### Claims in the column

- ko (FAQ 3 and section 5): "휴업 전 또는 휴업 시작일부터 15일 이내에 휴업등기를 신청해야 하며(… — 회사등기방법(公司登記辦法) 제3조 제1항 단서), 1회 휴업 기간은 1년을 넘을 수 없습니다"; step 3 "「회사등기방법」(公司登記辦法) 제4조"; source list "대만 경제부 회사등기방법".
- ja FAQ 3: "休業前または休業開始後15日以内に休業登記を申請し（…――会社登記弁法第3条第1項但書）"; section 5: "休業前または休業開始日から15日以内に…（会社登記規則第3条第1項但書）"; step 3 "会社登記規則（公司登記辦法）第4条"; source list "台湾経済部の会社登記規則".
- en (FAQ 3 and section 5): "before the suspension or within 15 days after the suspension begins (… proviso to Article 3, paragraph 1 of the Regulations Governing Company Registration)"; step 3 "Article 4 of the Company Registration Regulations (公司登記辦法)"; source list "Taiwan Ministry of Economic Affairs Company Registration Regulations".
- zh-hant (FAQ 3 and section 5): "應於停業前或停業日起十五日內申請停業登記（但已依加值型及非加值型營業稅法規定申報核備者，不在此限——公司登記辦法第3條第1項但書）"; step 3 "《公司登記辦法》第4條"; source list "經濟部公司登記辦法".

### Official text

1. https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080020&flno=3 — 公司登記辦法 第 3 條 (retrieved 2026-10-12; 第 1 項 as far as 「停業之登記」 and 第 3 項 read again on https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080020, identical)

   > 公司暫停營業一個月以上者，應於停止營業前或停止營業之日起十五日內申請為停業之登記，並於復業前或復業後十五日內申請為復業之登記。但已依加值型及非加值型營業稅法規定申報核備者，不在此限。
   > 公司設立登記後如未於六個月內開始營業者，應於該期限內向主管機關申請延展開業登記。
   > 前二項申請停業或延展開業期間，每次最長不得超過一年。

2. https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080020&flno=4 — 公司登記辦法 第 4 條 (retrieved 2026-10-12)

   > 公司及外國公司登記事項如有變更者，應於變更後十五日內，向主管機關申請為變更之登記。但經目的事業主管機關核准應於特定日期登記者，不在此限。
   > 無限、兩合及有限公司股東死亡者，得於取得繼承證明文件後十五日內，申請變更登記。

3. https://serv.gcis.nat.gov.tw/crm/faqAction.do?id=659&method=faqDetlDetl — 經濟部商業發展署 商工行政服務入口網「停業之申請期限為何？」 (the page the column links; retrieved 2026-10-12)

   > 可在停業前後15日內申請，每次最長不得超過1年。申請書需載明停業之起迄年月日。（公司登記辦法§3#3）

4. https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=J0080020 — official English page of the same regulation (retrieved 2026-10-12): title "Regulations Governing Company Registration", Amended Date 2021-04-23. Art. 3 para. 1 as returned, in consecutive fragments: "Where a company temporarily discontinues its business operation for a period over one month," / "an application for business discontinuation registration shall be filed prior to or within fifteen days" / "starting the date of business discontinuation," / … / "unless otherwise filing for approval and recordation with the competent tax authority" / "has been made pursuant to provisions in Value-added and Non-value-added Business Tax Act."

### Verdict 6a — start point and day count

- All four languages: ORIGINAL-RIGHT. The regulation says 「停止營業前或停止營業之日起十五日內」. One month or more, fifteen days, at most one year per suspension, and the proviso for a suspension already reported under the business-tax act all match Art. 3 paras. 1 and 3. The two ja phrasings the reviewer compared — FAQ 3 「休業開始後15日以内」 and the body 「休業開始日から15日以内」 — both count fifteen days from the day the suspension begins, as does the en "within 15 days after the suspension begins". The wording differs between the ja FAQ and body, but neither gives a start point different from the regulation, so neither was changed.

### Verdict 6b — name of the regulation

- All four languages: ORIGINAL-RIGHT. There is one instrument, 公司登記辦法, and it contains both Art. 3 and Art. 4. Every citation in the column points to it with the right article, paragraph and proviso, and each source-list label names the regulation its link opens.
- What the reviewer saw is real but is not a statute error. The ja version writes the name two ways: FAQ 3 「会社登記弁法」 (弁法 is the Japanese character form of the official 辦法) and the body and source list 「会社登記規則」 (a translated name, given once with 公司登記辦法 in parentheses). The en version does the same: FAQ 3 and section 5 use the official English title "Regulations Governing Company Registration", step 3 and the source list use "Company Registration Regulations". Both names in each language denote the same regulation, and no official text shows either one to be a wrong statement of law. Under this job's rule (correct only what the official text confirms as an error) the names stay as published.
- For the reviewer: making the name uniform is an editorial change, not a fact fix, and was left for a normal edit. If it is wanted, the smallest version is ja FAQ 3 「会社登記弁法第3条第1項但書」 → 「会社登記規則（公司登記辦法）第3条第1項但書」, and en "Company Registration Regulations" → "Regulations Governing Company Registration" in step 3 and the source-list label (link unchanged).

---

## Checks run (2026-10-12)

- `python3 /Users/son7/tseng-rewrite-1006/factfix/factguard.py /Users/son7/tseng-rewrite-1006/factfix/jobs/withdraw-capital-taiwan-company-1 2026-10-12` → FACTGUARD: PASS. Output: ko body characters changed 95 (1.1%); ja 64 (0.7%); en 190 (0.8%); zh-hant unchanged. No FAQ or summary change, no original URL missing, no URL added, no number added or removed.
- `diff orig-<lang>.md draft-<lang>.md`: ko — lastmod and the two penalty sentences; ja — lastmod and the two penalty passages; en — the two penalty passages (lastmod was already "2026-10-12" in the live file); zh-hant — identical.
- `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check` on each orig/draft pair:
  - ja: no FAIL before or after (cv 0.472 → 0.478).
  - en: "OK — no variety limit violated" before and after (cv 0.46 → 0.469).
  - ko: the live file already has 2 FAIL lines and the draft has the same 2, none added: len_cv 0.344 → 0.363 (limit 0.45) and short_share 0.012 → 0.012 (limit 0.08). They come from the published text and were left alone because a fact fix may not rewrite other sentences.
- No bold markup added. ko 합니다체 and ja です・ます kept in the edited sentences. No number, link, heading or image line changed.

Not done here: 구역(拘役) and 拘役 are given without a gloss of their length (刑法 第33條: one day to under sixty days), because that would add a statement the column did not make.

---

## Changes

### ko — draft-ko.md

- Body, section 1 (Art. 9): "…허용한 경우에 5년 이하의 유기징역·구류 또는 50만 대만달러 이상 250만 대만달러 이하의 벌금을 규정합니다." → "…허용한 경우에 회사 책임자(公司負責人)에 대하여 5년 이하의 유기징역·구역(拘役) 또는 50만 대만달러 이상 250만 대만달러 이하의 벌금을 규정합니다. 벌금은 징역이나 구역과 함께 부과(併科)될 수도 있습니다." (Notes 1 and 2)
- Body, section 1 (Art. 90): "…1년 이하의 유기징역·구류 또는 6만 대만달러 이하의 벌금에 처해질 수 있습니다." → "…1년 이하의 유기징역·구역(拘役) 또는 6만 대만달러 이하의 벌금에 처해질 수 있습니다. 이때에도 벌금은 징역이나 구역과 함께 부과될 수 있습니다." (Note 1)
- lastmod: "2026-10-06" → "2026-10-12"
- Notes 3, 4, 6: no change (already correct). FAQ answers: no change (none carried the error).

### ja — draft-ja.md

- Body, section 1 (Art. 9): "…株主による回収を許した場合を処罰します。定められているのは、5年以下の有期刑、拘留または50万以上250万新台湾ドル（NT$）以下の罰金です。" → "…株主による回収を許した場合に、会社の責任者（公司負責人）を処罰します。定められているのは、5年以下の有期刑、拘役または50万以上250万新台湾ドル（NT$）以下の罰金です。罰金は、有期刑や拘役に併科されることもあります。" (Notes 1 and 2)
- Body, section 1 (Art. 90): "…1年以下の有期刑、拘留またはNT$6万以下の罰金が科され得ます（会社法第90条）。" → "…1年以下の有期刑、拘役またはNT$6万以下の罰金が科され得ます（会社法第90条）。ここでも、罰金は有期刑や拘役に併科され得ます。" (Note 1)
- lastmod: "2026-10-06" → "2026-10-12"
- Notes 3, 4, 6: no change (already correct). FAQ answers: no change (none carried the error).

### en — draft-en.md

- Body, section 1 (Art. 9): "The penalty is imprisonment for up to five years, detention, or a fine of between NT$500,000 and NT$2.5 million." → "The penalty falls on the company’s responsible persons (公司負責人): imprisonment for up to five years, detention, or a fine of between NT$500,000 and NT$2.5 million. The fine may also be imposed together with imprisonment or detention." (Notes 1 and 2)
- Body, section 1 (Art. 90): "…detention, or a fine of up to NT$60,000 (Company Act, Article 90)." → "…detention, or a fine of up to NT$60,000, which may likewise be imposed together with imprisonment or detention (Company Act, Article 90)." (Note 1)
- lastmod: no change (the live file already carries "2026-10-12").
- Notes 3, 4, 6: no change (already correct). FAQ answers and summary: no change (none carried the error).

### zh-hant — draft-zh-hant.md

- no change (already correct) on every note. Reference version for Notes 1 and 2. lastmod stays "2026-10-06" because the file was not changed.
