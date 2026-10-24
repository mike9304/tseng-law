# zh-hans repair, round 1 (response to reviews/codex-zh-hans-r1.md)

All four findings were checked against the live statute text with `python3 tools/law.py <PCODE> <art>` on 24 October 2026. All four are correct; none was rebutted. The one SHOULD was also clearly correct and small, so it was applied. Only the three draft files were edited; frontmatter was updated where the summary was affected.

## 804 M1 — ACCEPTED (施行细则第60条 proviso and paragraph 2)

Statute checked (Q0010002 art. 60): 「……應於向被繼承人住所地之法院為繼承表示之日起二個月內，準用遺產及贈與稅法第二十六條規定申請延長申報期限。但該繼承案件有大陸地區以外之納稅義務人者，仍應由大陸地區以外之納稅義務人依遺產及贈與稅法規定辦理申報。前項應申報遺產稅之財產，業由大陸地區以外之納稅義務人申報或經稽徵機關逕行核定者，免再辦理申報。」

Old: 大陆继承人有正当理由赶不上的，按施行细则第60条，要在向法院表示继承之日起二个月内申请延长。

New: 大陆继承人有正当理由不能按期申报的，应在向法院表示继承之日起二个月内，准用遗产及赠与税法第26条申请延长；但案件有大陆地区以外的纳税义务人的，仍由该人依税法申报。相关财产已由大陆地区以外的纳税义务人申报或经稽征机关核定的，免再申报（施行细则第60条）。

Link and the two-month starting point kept. FAQ and summary of 804 do not mention estate tax, so no change there.

## 804 M2 — ACCEPTED (遗产及赠与税法第23条第1项 proviso)

Statute checked (G0340072 art. 23(1)): 「……應於被繼承人死亡之次日起算六個月內，向戶籍所在地主管稽徵機關依本法規定辦理遺產稅申報。但依第六條第二項規定由稽徵機關聲請法院選任遺產管理人，自法院選任遺產管理人之次日起算。」 Art. 6(2): 「應選定遺產管理人之案件，於死亡發生之次日起算六個月內未經選定呈報法院者，或因特定原因不能選定者，稽徵機關得依家事事件法之規定，聲請法院選任遺產管理人。」

Old: 遗产及赠与税法第23条第1项把遗产税的申报期限定为死亡次日起六个月。

New: 遗产税通常须在被继承人死亡次日起六个月内申报；但由稽征机关依第6条第2项声请法院选任遗产管理人的，自法院选任遗产管理人次日起算六个月（遗产及赠与税法第23条第1项、第6条第2项）。

Art. 6 is now linked inline and added to the Sources list as 遗产及赠与税法：第6条、第23条. The six-month period and original link were kept.

## 805 M1 — ACCEPTED (许可办法第15条第1项, ban period and the extra 得)

Statute checked (Q0060003 art. 15(1)): 「……有下列情形之一者，得不予許可；已許可者，得撤銷或廢止其許可，並自不予許可、撤銷或廢止許可之翌日起算一年以上、五年以下之一定期間，不許可其再申請：……三、有事實足認其無正當理由未與依親對象共同居住，或有關婚姻真實性之說詞、證據不符。」 The 得 attaches to the decision to refuse, revoke or cancel; the ban period follows from that decision, runs from the day after it, and carries no separate 得.

Old: 主管机关得不予许可；已许可的，得撤销或废止，并得在一年以上五年以下的期间内不许可再申请。

New: 主管机关可以不予许可；已许可的，可以撤销或废止，并自不予许可、撤销或废止许可次日起，在一年以上五年以下的一定期间内不许可再次申请。

The following sentence “得”是可以，不是一定 and the sentence that the text lists no examples of 正当理由 were kept. The premise (有事实足认无正当理由未与依亲对象共同居住，或有关婚姻真实性的说词、证据不符) is unchanged. The 805 FAQ and summary do not mention art. 15.

## 806 M1 — ACCEPTED (条例第74条第1项 versus 第2项)

Statute checked (Q0010001 art. 74): 「在大陸地區作成之民事確定裁判、民事仲裁判斷，不違背臺灣地區公共秩序或善良風俗者，得聲請法院裁定認可。前項經法院裁定認可之裁判或判斷，以給付為內容者，得為執行名義。……」 Recognition in paragraph 1 is not limited to performance judgments; the performance condition is in paragraph 2 and concerns enforcement titles.

Old: 判决和仲裁裁决并列，申请时都要说清主文要求对方给付什么，因为只有以给付为内容的，才谈得上成为执行名义。

New: 两类文书都可以声请认可，认可本身不限于给付内容；条例明定可作为执行名义的，是经认可且以给付为内容的（第74条第2项）。想据此强制执行的，要先看主文有没有给付内容。

Frontmatter summary also narrowed as the reviewer asked:
- Old: 大陆地区作成的民事确定裁判或民事仲裁判断要在台湾使用，须先向台湾法院声请裁定认可；条件是不违背台湾地区公共秩序或善良风俗，并以台湾裁判在大陆可声请认可或执行为前提。……
- New: 大陆地区作成的民事确定裁判或民事仲裁判断，不违背台湾地区公共秩序或善良风俗的，得声请台湾法院裁定认可；经认可且以给付为内容的，才可作为执行名义，并以台湾裁判在大陆可声请认可或执行为前提。……（130 characters, still inside 110–170）

Checked for consistency: the opening paragraph, FAQ 1 and the closing section already state the two-step structure (recognition, then execution title for performance orders), so they were left as they are.

## 806 S1 — ACCEPTED (SEF verification conditions)

Source checked: https://www.sef.org.tw/article-1-29-389 (“若二者相符，申請目的或內容無明顯違反法令、國家利益……且無待查證之疑點，經驗證屬實者，即發給證明”; “馬上辦”一小时内完成 only “如當事人提出申請時，公證書副本已寄達本會”) and https://www.sef.org.tw/article-1-61-1081 (「正、副本核驗相符且合於發證要件者，本會得依「馬上辦」作業，原則上於1個小時內發給證明」).

Old: 副本已到的，海基会称可依“马上办”一小时内完成，未到的，副本寄达后7个工作天内完成（海基会常见问答，更新于2026年6月4日）。

New: 正副本相符、符合发证要件且无待查证疑点时，副本已到的，海基会称可依“马上办”原则上一小时内完成；副本未到的，副本寄达后7个工作天内完成（海基会常见问答，更新于2026年6月4日；发证要件见申请文书验证手续）。

The second link was already in the Sources list. The later paragraph on 疑案查证 is unchanged.

## Re-checks after the edits

- `variety_metrics.py check --lang zh-hant` (proxy; no zh-hans mode): 0 FAIL on all three (804 cite_end 0.27, short 0.108; 805 cite_end 0.278, short 0.083; 806 cite_end 0.081, short 0.108).
- Characters (links reduced to anchor text, non-whitespace): 804 body 1,861 / with Sources 2,118; 805 body 1,799 / 1,939; 806 body 1,718 / 1,957. All inside 1,600–2,600.
- The claim tables in work/zh-hans-author.md were written before this round and were not edited. Their rows for 施行细则第60条, 遗产及赠与税法第23条, 许可办法第15条, 条例第74条 and the SEF turnaround are superseded by the new wording above.
