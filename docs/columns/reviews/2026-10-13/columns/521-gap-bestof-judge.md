# G7 ko best-of-2 judgment

X = drafts/G7/ko.md, Y = drafts/G7/alt/ko.md. I did not edit either file. I compared both against research/G7-statutes.md (official article text).

| Axis | X | Y |
| --- | --- | --- |
| accuracy | 8 | 6 |
| voice | 8 | 6 |
| variety | 7 | 8 |
| hook | 7 | 6 |
| total | 30 | 26 |

Y's accuracy is below 8, so Y cannot win. X leads by 4 points.

## Accuracy

Front matter, FAQ, the 13 inline links, the source list, the 확인일 line and the closing notice are identical in both. Both carry the "(가상의 상황입니다)" label. Both state the two MUST VERIFY items the same way:
- Art. 178 fine: "3만 대만달러 이하". Defendants get 拘提 only (Art. 71 item 4, Art. 75). Witnesses get a fine plus 拘提 (Art. 175 item 4, Art. 178).
- Art. 76: the four conditions are joined with "거나", so they read as alternatives after "범죄 혐의가 무겁고".

Facts Y lost or blurred relative to X:
- Art. 176-1 duty to testify (G7-03). Y has only "다른 사람의 사건에서 증인이 되는 일은, 법에 다른 규정이 없는 한 누구에게나 있습니다(제176조의1)." Standing alone, that says becoming a witness can happen to anyone. The statute says everyone has a duty (有為證人之義務). X has the same sentence, but it follows "증인이라면 의무가 따릅니다." So X keeps the duty and Y does not.
- Art. 75 scope. Y's sentence "정당한 이유 없이 소환에 응하지 않으면 拘提가 가능합니다(제75조)." sits right after the witness paragraph (24-hour service, expenses). It names no 피고인, so a reader can take it as applying to witnesses. That blurs the defendant/witness split the column is built on. X writes "피고인이라면 순서가 다릅니다. 소환에 정당한 이유 없이 응하지 않으면 拘提할 수 있습니다(제75조)."

Facts X lost or blurred relative to Y:
- "증인에게도 보호는 있습니다. 傳票는 늦어도 출석 24시간 전까지 송달해야 하고(급박한 경우는 예외), 일당과 여비도 청구할 수 있습니다." has no inline citation. The source is Art. 175 paras. 2–3. The Art. 175 link appears earlier in X and in the source list, but this claim has no adjacent source. Y attaches [제175조] to the same claim. This is a source-placement flaw, not a changed fact.

Omissions both versions share, because they use the same wording. None is a misstatement, but a lawyer would notice them:
- "합법적 소환/통지" (經合法傳喚/經合法通知) is missing from Arts. 75, 178 and 71-1.
- Art. 76 omits 必要時, actual flight ("도주했거나") and the 위조·변조 / 공범·증인 말맞춤 detail.
- Art. 87 omits the interested party's option to ask for arrest (請求…逮捕之) and the 已顯無必要 ground for withdrawal.
- Art. 72 omits the written-statement route (以書狀陳明).
- Art. 84 says "대상이 됩니다" for 得通緝之 ("may").

I did not use these shared simplifications to disqualify either version. If a strict reading counts them against both, both would fall below 8 and the result would be TIE. I judged them as shortening, not changing the legal meaning, so the differences above decide it.

## Voice

X:
- It opens with a scene and a plain next step: "대만 지방검찰서에서 온 소환장이 한국 집 우편함에 들어 있습니다(가상의 상황입니다). 먼저 읽을 곳은 나오지 않으면 어떻게 되는지를 적은 줄입니다."
- Its transitions carry the defendant/witness split: "증인이라면 의무가 따릅니다." "증인에게도 보호는 있습니다." "피고인이라면 순서가 다릅니다."
- There is no bold, no invented first person and no generic intro.
- The weak spot is the long 피고인 paragraph (about 9 sentences, with the Art. 76 sentence running very long).

Y:
- It has three paragraph openers that are bare fragments with no referent: "3만 대만달러 이하입니다." "출석 24시간 전입니다." "통지·공고 뒤입니다." Each answers a question nobody asked, and each is followed by "제N조에 따르면". The device repeats three times and reads as engineered to raise the short-sentence count.
- The draft is cut into about 17 one-to-three-sentence paragraphs, which reads like annotated statute notes.
- "증인 쪽은 피고인과는 다릅니다" says nothing yet.
- The opening line "먼저 읽을 곳은 나오지 않으면 어떻게 되는지를 적은 줄입니다." comes before the summons is introduced in the next paragraph.
- Credits: the "~지요" endings are natural, and the ending (what could not be confirmed, plus the link to the 24-hour column) follows rule 2-7 better than X's contact-line ending.

## Variety

Checker output:

| | X | Y |
| --- | --- | --- |
| cv | 0.503 | 0.523 |
| short sentences | 0.217 | 0.229 |
| cite_end | 0.348 | 0.143 |
| run3 | 0.0 | 0.182 |
| opener_rep | 0.125 | 0.0 |
| question in body | none | one |

Both pass. On section 2, Y does better:
- It puts the citation in the subject or opening position (2-2).
- It has a body question (2-5).
- Its citation-ending rate is lower.

X's sentences are long (mean 37.8) and mostly end on a citation, but never more than two in a row, and its paragraph lengths vary. Y's paragraph rhythm is uniform, and the "fragment. 제N조에 따르면…" frame repeats. I give Y 8 and X 7.

## Hook

- X: it puts the reader in the situation (a Taiwan summons in a Korean mailbox) and says where to look first. 7.
- Y: the question "피고인 소환장과 증인 소환장, 불출석의 결과가 같습니까?" is a real reader question, but the second sentence ("증인 쪽은 피고인과는 다릅니다.") gives no answer. The scene then arrives after the "먼저 읽을 곳은…" line that depends on it. 6.

WINNER: X
