# C4 cross-review + native-voice pass — taiwan-account-provider-scam-victim-civil-damages

Reviewer: separate Claude Opus 5.5 session (did not write the draft), Mac Studio, 2026-10-19. This is a model review. It is not a review by a lawyer or a native speaker.
Edited in place: drafts/C4/ko.md, ja.md, en.md, zh-hant.md, facts.md. Pre-edit copies: reviews/C4/xreview-orig/.
Read in full: brief-BATCH.md (incl. precision rules A–G and the voice note), brief-EDITORIAL-VOICE.md, COLUMN-VOICE-RULE.md, topics/C4.md, topics/LINKS.md, research/C4-statutes.md, drafts/C4/facts.md, the four judgment texts (TNHV-112-金簡易-108-20240529 / -20240626, PCDV-113-簡上-499, TPDV-114-簡上-137), SENTENCE-VARIETY-RULE.md, LESSONS.md. The canonical ~/agent-library/knowledge/editorial-voice.md does not exist at that path on this machine, so I used the batch copy brief-EDITORIAL-VOICE.md, which carries the same rule text.
No article outside research/C4-statutes.md was cited or needed. fetch-law.py was not run.

Source URLs used below:
- §182 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=182
- §184 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=184
- §185 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=185
- §197 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=197
- §273 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=273
- 刑訴 §487 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=487
- J1 https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=TNHV%2c112%2c%e9%87%91%e7%b0%a1%e6%98%93%2c108%2c20240529%2c2
- J2 https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=TNHV%2c112%2c%e9%87%91%e7%b0%a1%e6%98%93%2c108%2c20240626%2c3
- J3 https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=PCDV%2c113%2c%e7%b0%a1%e4%b8%8a%2c499%2c20250520%2c1
- J4 https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=TPDV%2c114%2c%e7%b0%a1%e4%b8%8a%2c137%2c20250702%2c2

## What I checked and found correct (all four versions, before my edits)
Court names, case numbers, dates and outcomes of J1–J4 match the saved texts. So do the amounts (NT$149,967 in three transfers, NT$500,000 claimed, NT$28,985, NT$100,000 plus interest, NT$178,952 owed by the mule), the dates (March 29, 2022; September 2020; October 2020; the report on 2022-10-20; suit in 2024), the "district court appeal panel" level of J3/J4, §185 para 1/2, §273 para 1, 得/應 strength, and the internal links (all present in topics/LINKS.md for that language). No private names, scammer aliases or account numbers appear. No bold, no phone number, no lawyer-review claim. Contact blocks match rule 5.
Openings do not repeat within the batch per language: ko quote (C1 scene, C2/C3 number), ja scene (C1 result, C2 question, C3 quote), en number (C1 message, C2 result, C3 reader situation), zh result (C1/C2 quote, C3 question). I kept them.

## Fixes common to all four versions (legal / precision)
1. Gender of private parties. The judgments never state the gender of the student, the J2/J3/J4 account holders, the J4 online contact or the victims; the drafts inferred it from names ("she/her", "he/his", 「她」「他」, 「女性」「男性」「彼」「彼女」, "an adult woman", 「성인 여성」). In every version I now write "the student / the holder / this holder / the contact / the victim" (ko 학생·명의인·상대, ja 留学生・名義人・相手, zh 僑生・持有人・對方). The J3 counterpart stays a woman because the court calls her 「外籍女子」. Sources: J1–J4.
2. App names. facts.md forbids app names, but all four drafts named LINE (en "her LINE messages", ko "LINE 기록", ja 「LINEのやり取り」, zh 「她的LINE紀錄」), and zh also had 「超商交貨便」, a 7-ELEVEN service name. I replaced them with "chat messages with the 'company'" / 「'회사'와 나눈 대화 기록」 / 「『会社』とのチャットのやり取り」 / 「僑生和『公司』的對話紀錄」, and zh now has 「卡片從超商寄出」. Source: J1.
3. Negligence standard is a tort rule, not a "civil" rule. en "Civil negligence is measured against the care of a prudent manager, and even slight negligence in that abstract sense is enough" → "In tort, negligence means falling short of the care of a prudent manager (善良管理人), and this 'abstract light negligence' is enough". ko 「민사상 과실은 선량한 관리자의 주의를 게을리했는지로 판단하고 가벼운 추상적 과실로도 충분하다」 → 「불법행위의 과실은 선량한 관리자의 주의를 게을리했는지로 판단하며 추상적 경과실만으로도 성립한다」. ja 「民事の過失は…抽象的軽過失で足りる」 → 「不法行為の過失は…抽象的軽過失があれば成立する」. zh 「過失以是否怠於善良管理人的注意為斷」 → 「侵權行為的過失，以是否怠於善良管理人的注意義務為斷」. Source: J3 (「在侵權行為方面，過失之有無…行為人僅須有抽象輕過失，即可成立」).
4. §182 para 1 relief had dropped "or repay the value". en "is released from returning it" → "need not return it or pay its value"; ko 「반환 책임을 면하게 합니다」 → 「반환이나 가액 상환 책임을 면합니다」; ja 「返還の責任を免れる」 → 「返還や価額償還の責任を免れる」; zh now quotes the article's own wording 「免負返還或償還價額之責任」. Source: §182.
5. §182 para 2 had dropped which benefit must be returned. en "shall return the benefit with interest and compensate any damage" → "must repay what was obtained at receipt or what still remained on learning, with interest, and compensate any damage"; ko 「이익에 이자를 붙여 돌려주고」 → 「받을 때 얻은 이익이나 알게 된 때 남은 이익에 이자를 붙여 돌려주어야 하고」; ja 「利益に利息を付けて返し」 → 「受け取ったときの利益か、知った時点で残っていた利益に利息を付けて返し」; zh 「依第2項應附加利息返還」 → 「依第2項應將受領時所得的利益，或知道時現存的利益，附加利息償還」. Source: §182 (「應將受領時所得之利益，或知無法律上之原因時所現存之利益，附加利息，一併償還」).
6. §197 para 1 had dropped "if not exercised" (不行使) in en/ko/ja, body and FAQ 3. en "the claim lapses two years after the victim knows…" → "the claim lapses if not exercised within two years from when the victim knows of the damage and of the person liable, and also lapses ten years after the wrongful act". ko 「안 때부터 2년, …10년이 지나면 소멸합니다」 → 「안 때부터 2년간 행사하지 않으면 소멸하고, …10년이 지나도 소멸합니다」. ja 「知った時から2年、…10年を経過すると消滅します」 → 「知った時から2年間行使しないと消滅し、…10年を経過したときも同じです」. zh FAQ 「自被害人知有損害」 → 「自請求權人知有損害」 (the article's subject). Source: §197.
7. §197 para 2 removed from body and FAQ 3 in all four. Every draft stated it without the article's condition 「致被害人受損害」: en "a liable person who gained a benefit from the wrongful act", ko 「불법행위로 이익을 얻은 사람」, ja 「不法行為によって利益を受けた人」, zh 「因侵權行為受有利益的人」. The topic brief asks for §197 para 1 only and caps limitation at one paragraph. So I removed the sentence rather than enlarge it. facts.md A4 records this. Source: §197, topics/C4.md.
8. §184 para 1 first sentence. en body and FAQ 1 said only "paragraph 1"; ko/ja FAQ 1 said 「제184조 제1항」 / 「第184条第1項」 and rephrased the rule as 「고의뿐 아니라 과실로…경우에도」 / 「故意だけでなく過失によって…場合にも」. All now say first sentence / 앞부분 / 前段, with the article's own "intent or negligence" wording. Source: §184.
9. Source in the same paragraph (rule A). The zh and en §487 paragraphs described J1's procedure ("the victim had to pay the court fee", 「被害人補繳了裁判費」) with only the §487 link. I added the J1 link to both. In all four I also stated the J1 step the drafts skipped: the claim against the student did not meet §487 para 1, and the fee payment cured that defect. en now reads "…so the claim against the student did not meet that paragraph's requirements. After the case moved to the civil division, the victim cured the defect by paying the court fee". zh: 「這部分不符要件；案件移送民事庭後，被害人繳了裁判費，補正這項欠缺」. Sources: §487, J1 (「雖不符刑事訴訟法第487條第1項規定之要件…自已補正起訴程式之欠缺」).
10. J3 public-warning sentence: keep the OR (未經合理查證「或」無正當理由). ja 「確認も正当な理由もなく」 (reads as AND) → 「合理的な確認をしないまま、あるいは正当な理由なく」. ko 「확인 없이 계좌를 함부로 넘기지 말라」 (dropped the second limb) → 「합리적으로 확인하지 않았거나 정당한 이유가 없다면 계좌를 함부로 넘기지 말라」. en "without checking or a proper reason" → "without reasonable checks, or without a proper reason". zh already quoted it verbatim. Source: J3.
11. J3 non-prosecution scope. J3 shows non-prosecution decisions only in other victims' files and says nothing about this victim's report. en "None of the three had been charged" → "Prosecutors had declined to charge all three", and "Prosecutors declined to charge him over other victims' transfers" → "Prosecutors had declined to charge the holder over other victims' transfers". ko 「세 사람은 모두 불기소였습니다」 → 「세 사람은 모두 불기소 처분을 받았습니다」. ja and zh were already worded this way. Source: J3 (「其他被害人遭詐騙後將款項匯入系爭帳戶之部分，均經…不起訴處分書確定」).
12. Out-of-scope at most one sentence, with no rule stated. ko had two sentences, ending with the rule-like 「형사책임은 민사 배상과 따로 판단됩니다」. It is now one sentence: 「계좌 제공의 형사책임은 별개의 문제이고, …에서 다루었습니다」. ja carried an unsourced general rule, 「民事の賠償は、刑事とは切り離して判断されます」, which I deleted. en and zh were already one sentence. Source: topics/C4.md OUT OF SCOPE.

## ko
Legal fixes (besides 1–12)
- 「방조자로 묶이려면 그 사람에게도 고의나 과실과 상당인과관계가 있어야 합니다」 (ambiguous: "과실과 상당인과관계") → 「방조자로 묶이려면 그 사람에게도 고의나 과실이 있어야 하고, 그 행위와 결과 사이에 상당인과관계가 있어야 합니다」. Source: J3.
- 「방조 자금세탁죄 유죄가 확정됐고」 → 「자금세탁방조죄 유죄가 확정됐고」 (the offence name; J2: 幫助洗錢罪). Source: J2.
- Body case numbers 「112년도 금간이자 제108호」「113년도 간상자 제499호」 were transliterations no Korean reader would recognise. They are now 「112년도 金簡易字 제108호」 in the body, J3/J4 link as 「판결」, and the sources list gives the original numbers (112年度金簡易字第108號 etc.), the same practice as C1/C3 ko. Source: J1, J3, J4.
- Opening quotation: its Chinese source is now made explicit as a translation inside the sentence (see voice). Source: J3.
Voice rewrites
- 「…가 검찰에서 불기소된 계좌 명의인에게 배상을 명하면서 쓴 문장입니다(판결문 중국어를 옮겼습니다).」 (note-like parenthesis) → 「불기소된 계좌 명의인에게 배상을 명한 신베이지방법원 항소부 판결문의 한 대목을 우리말로 옮겼습니다.」
- 「과실 판단은 이렇습니다. 학생은 … 제한적이었고, … 잘 알지 못했다는 것입니다.」 (summary connector 「~했다는 것입니다」, flagged in the user's voice note) → 「과실 부분은 꽤 구체적으로 적었습니다. 학생은 대만에 온 지 2년 남짓이었지만 직장이 아닌 단순한 캠퍼스에서 지내 사회 경험과 판단력이 제한적이었습니다. 외국인이라 대만의 법과 사회 현실, 구직 함정, 사기 수법도 잘 몰랐습니다.」
- 「…경찰이 확인하기 전에는 명의인을 알기 어려웠다는 판단입니다. 시효 항변은 배척됐습니다.」 → 「경찰이 확인하기 전에는 피해자가 배상의무자를 알았다고 보기 어렵고, 명의인도 반대 증거를 내지 못했습니다. 시효 항변은 배척됐습니다.」 (also adds J3's point that the holder offered no proof)
- 「신뢰로 무상으로 빌려주었고, 자신도 속았습니다.」 (double 「~로」) → 「믿음에서 대가 없이 빌려준 경우였고, 명의인 자신도 속은 사람이었습니다.」
- FAQ 3 q 「몇 년 전에 넘긴 계좌인데 지금 소송이 와도 되나요?」 (reads as "is it OK for a suit to come") → 「몇 년 전에 넘긴 계좌 때문에 이제 와서 소송을 당할 수도 있나요?」
- Heading 「세 명의 계좌 명의인, 세 가지 결론」 (template parallel) → 「같은 불기소, 갈린 민사 판결」.
- 「아버지 명의의 주택담보대출용 계좌를 관리하던 여성이」 → 「명의인은 주택 대출용으로 만든 아버지 명의 계좌를 관리하다가」; 「남성은 아들이 아프고…」 → 「상대는 아들이 아프고 태국 사업이 어려워 직원 급여를 도와 달라고 했습니다.」
- Sources list 「법무부 전국법규자료고」 → 「대만 법무부 전국법규데이터베이스」.
First-two-paragraph deletion test: deleting the quote paragraph would lose J3's key holding, which nothing else in the opening states. Deleting paragraph 2 would lose the J1 facts. Both stay.

## ja
Legal fixes (besides 1–12)
- 「裁判所は、名義人が財産上の損害を生じうることを知り、または知り得たことを被害者が立証しなければならない」 (what could cause loss was missing) → 「口座の情報を渡せば他人に財産上の損害が生じうることを名義人が知り、または知り得たことを、被害者が立証しなければならない」. Source: J4 (「明知或可得而知提供帳戶資料行為可能造成他人財產損害」).
- 「被害者は、別の人の刑事事件の第二審で附帯民事訴訟を起こし」 → 「ある刑事事件の第二審の手続で附帯民事訴訟を起こし」. J1 says only 「於第二審刑事訴訟程序」. Source: J1.
- FAQ 2 「連帯責任を負わせたのは自分の口座に…に限り」 → 「その名義人の口座に振り込まれた28,985台湾ドルの部分に限って引き出し役との連帯責任を認めました」 (names the co-debtor, as the 主文 does). Source: J2.
Voice rewrites
- Title and H1 「台湾で渡した口座に詐欺の被害金が入ったとき、名義人は民事で賠償するのか」 (「賠償するのか」 sounds off) → 「台湾で渡した口座に詐欺の被害金が入ったら、名義人も賠償しなければならないのか」.
- Heading 「三人の名義人と三つの結論」 → 「同じ不起訴でも、民事の結論は分かれた」.
- 「…警察が調べるまで名義人を知るのは難しかったという判断です。」 (summary connector) → 「振込書類には英字の口座名しかありませんでした。警察が調べるまで被害者が賠償義務者を知っていたとはいいがたく、名義人もそれより前に知っていた証拠を出していません。時効の主張は退けられました。」
- 「留学生は職場ではなく単純な環境のキャンパスで学んでおり」 (direct rendering of 環境單純之校園) → 「留学生は職場で働いていたわけではなく、環境の単純なキャンパスで学んでいたため」.
- 「女性は早い段階で詐欺ではないかと疑いを口にし、警察から連絡を受けたあとは」 → 「名義人は早い段階で詐欺ではないかと不安を口にし、警察から事情を聴かれたあとは」 (J4: 經警方約詢).
- The reader question 「それでも被害者に賠償しなければならないのでしょうか」 now ends in 「？」, so the variety checker counts it (q 0 → 1).
First-two-paragraph deletion test: paragraph 1 holds the J1 facts and paragraph 2 the attached claim and amount. Neither can go.

## en
Legal fixes (besides 1–12)
- "Her share was narrow: the NT$28,985" ("share" suggests apportionment, but J2 orders joint liability for that sum) → "treated this holder as a joint actor liable jointly with the cash mule, but only for the NT$28,985 paid into the holder's own account". Source: J2.
- "filed it inside another defendant's criminal appeal" → "attached to a criminal appeal in which the student was not a defendant". J1 shows only that the claim was filed in second-instance criminal proceedings where she was not a defendant, not whose appeal it was. Source: J1.
- FAQ 1 "Other rulings found account holders who had not been charged not liable either" (ambiguous "either") → "In two other rulings, account holders whom prosecutors had declined to charge were also found not liable in the civil case." Source: J1, J4.
Voice rewrites
- "New Taipei went the opposite way (…), in a district court ruling at the second instance." (tacked-on clause) → "In New Taipei, a district court appeal panel went the other way (…)."
- "On July 2, 2025, the Taipei District Court's appeal panel, also a district court at the second instance, sided with the holder" → "On July 2, 2025, a district court appeal panel in Taipei sided with the holder".
- "That ruling was reversed." (passive, no actor) → "The appeal panel reversed."
- Heading "Three account holders, three results" (template) → "Two cleared, one ordered to pay".
- "She said she had reported the scam to the police once she realized it." → "The student told the court of going to the police after realizing it was a scam."
- Lawyer section "Settlement talks, representation …, and coordination … are also part of the work. Nobody can promise the result." → "A lawyer can also negotiate a settlement with the victim's side, represent you in the civil court or the attached proceedings, and work with your criminal defence counsel if a criminal case is still open. No one can promise how a court will weigh your facts."
- CTA "Please include the complaint…" → "It helps to attach the complaint, the date you handed over the card or login, and any non-prosecution decision."
First-two-paragraph deletion test: paragraph 1 carries the NT$149,967 hook and the facts behind the student's handover. Paragraph 2 carries the non-prosecution and the NT$500,000 attached claim. Both stay.

## zh-hant
Legal fixes (besides 1–12)
- Court level: 「新北地方法院（地方法院二審）」 / FAQ 「新北地方法院民事庭於2025年5月20日的二審判決」 → 「新北地方法院在2025年5月20日的簡易事件二審判決」 / FAQ 「新北地方法院合議庭2025年5月20日的簡易事件二審判決」. Source: J3 (appeal from 板橋簡易庭 113年度板簡字第1241號).
- J4 outcome 「故意或過失都沒有被證明」 → 「被害人無法證明持有人有故意或過失」. This keeps J4's point that the burden was the victim's and was not met (「尚難認上訴人已為適當之舉證」). Source: J4.
- J2 「全部損失由車手負責」 (could read as the mule alone paying everything, including the 28,985 owed jointly) → 「車手則要對全部損失負責」. Source: J2 主文.
- FAQ 2 「對認定有不確定故意而提供帳戶的人，也只就匯入她自己帳戶的28,985元」 → 「雖認定另一名提供帳戶的人有不確定故意，也只就匯入其本人帳戶的28,985元」. Source: J2.
Voice rewrites
- Opening 「被害人要一位馬來西亞籍僑生連帶賠償50萬元，法院最後判她不用賠。另一位把帳戶交給網友的男子也獲不起訴，民事上卻被判賠10萬元。」 (「也」 has no antecedent, since the student's non-prosecution had not been mentioned yet) → 「兩個人都把帳戶交了出去，也都沒被起訴。被害人要一位馬來西亞籍僑生連帶賠償50萬元，法院判僑生不用賠；另一名持有人把帳戶交給交友軟體上認識的女子，民事上卻被判賠10萬元。」
- 「二審改判。他碩士畢業，做過物流，也自行創業；未經合理查證或無正當理由不應輕易交出帳戶，政府和媒體早已廣為宣導。」 (two of the court's reasons glued together like notes) → 「二審改判。法院指出，持有人碩士畢業，做過物流，也自己創過業；未經合理查證或無正當理由，不應輕易把帳戶交給別人，政府和媒體早已廣為宣導。」
- 「請她把提款卡寄到公司。她用超商交貨便寄出卡片，也給了密碼。」 → 「提款卡寄到公司就好。卡片從超商寄出，密碼也給了。」
- Heading 「三位帳戶持有人，三種結果」 → 「三位持有人，兩人免賠、一人要賠」.
- Rules paragraph: the §185 paragraphs moved into parentheses after each quoted clause (「…連帶負損害賠償責任（第1項）；造意人及幫助人，視為共同行為人（第2項）」). This shortens the paragraph and keeps both 項 numbers.
First-two-paragraph deletion test: paragraph 1 is the result-first opening with both J1 and J3 links, and paragraph 2 the J1 facts. Neither can go.

## Checks run on the final files (2026-10-19)
- python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check:
  - ko: cv=0.467 short=0.101 run3=0.026 cite_end=0.013 contrast=1 q=1 → no FAIL (1 WARN: 86% 「니다.」, inherent to 합니다체)
  - ja: cv=0.471 short=0.136 run3=0.089 cite_end=0.012 contrast=1 q=1 → no FAIL (1 WARN: 86% です・ます, inherent)
  - en: cv=0.515 short=0.149 run3=0.097 cite_end=0.0 contrast=2 q=1 → OK
  - zh-hant: cv=0.605 short=0.133 run3=0.0 cite_end=0.0 contrast=0 q=2 → OK
- Paragraph openers: no word opens more than 2 paragraphs in any version (en "Prosecutors"/"On"/"The" ×2; ko 「대만」×2; ja 「口座」×2; zh 「新北」×2).
- python3 lint.py … taiwan-account-provider-scam-victim-civil-damages: ko OK [3480 chars], ja OK [4066 chars], en OK [1547 words], zh-hant OK [2661 chars].
- Self-check items 2–9 (SENTENCE-VARIETY-RULE §5): met. No stock hypothetical opener, ≥2 very short sentences, a citation-free paragraph in each version, contrast ≤3, the last paragraph ends on documents to send, register uniform, no bold, no fact or link lost.

## Not resolved / for the final reviewer
- Length. All four are above the brief's "aim" band but inside the hard range: en 1,547 words (aim 1,250–1,400), ko 3,480 (aim 2,800–3,100; ceiling 3,500), ja 4,066 (aim 3,500–3,900), zh 2,661 (aim 2,100–2,400; ceiling 2,700). The column carries four judgments and six articles, all fetched and on-topic. Further cuts would drop sourced facts. ko and zh are close to their ceilings, so any addition in a fix round needs an offsetting cut.
- Lawyer tasks: "obtain the police and prosecution papers" (ko 「경찰·검찰 기록…확보」, ja 「取り寄せる」, zh 「取得警詢、偵查相關資料」) comes from the topic brief. No procedural article on file access was fetched, so the text states no rule about how or whether those files can be obtained.
- J3 and J4 have an appellant with the same name in the saved texts. I did not use this, because it would add a private detail and the texts do not confirm it is one person.
- The ages of the student and of the J2 holder are redacted in J1/J2, and no version states them.
- Naturalness was judged by a model, not by a native speaker in each language.

VOICE ko: OK
VOICE ja: OK
VOICE en: OK
VOICE zh-hant: OK
