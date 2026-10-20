# A3 facts — claim → source (checked 2026-10-20 KST)

Statutes fetched from law.moj.gov.tw LawSingle pages on 2026-10-20 (research/law/). Korean and Japanese articles fetched from law.go.kr (DRF XML, 시행 2026-03-17) and e-Gov API. Judgments opened in the Judicial Yuan database on 2026-10-20 (research/jud/).

## Taiwan statutes
- 民法 (B0000001; LawAll 修正 115-08-17 changed only Art. 1223)
  - Art. 1148 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1148 — 「繼承人自繼承開始時，除本法另有規定外，承受被繼承人財產上之一切權利、義務。…繼承人對於被繼承人之債務，以因繼承所得遺產為限，負清償責任。」
  - Art. 1151 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1151 — 「繼承人有數人時，在分割遺產前，各繼承人對於遺產全部為公同共有。」
  - Art. 1163 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1163 — 三款: 隱匿遺產情節重大／在遺產清冊為虛偽之記載情節重大／意圖詐害被繼承人之債權人之權利而為遺產之處分.
  - Art. 1174 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1174 — 「前項拋棄，應於知悉其得繼承之時起三個月內，以書面向法院為之。」
  - Art. 1175 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1175 — 「繼承之拋棄，溯及於繼承開始時發生效力。」
  - Art. 550 (checked, not cited): 委任關係因當事人一方死亡…而消滅。但…因委任事務之性質不能消滅者，不在此限。 (basis of the Taoyuan court's narrow exception; drafts describe the exception only as the court's reasoning)
  - "No deemed-acceptance rule in the succession book" (ko/ja): keyword scan of 民法 第五編 for 處分/承認/視為 (research/bin/lawall.py) → only 1148-1, 1156, 1159, 1162-1, 1163, 1176, 1178, 1179, 1187, 1216; none deems acceptance on disposal. Drafts say disposal appears as a ground for losing limited liability in Art. 1163 (ko/ja wording limited to that).
- 中華民國刑法 (C0000001)
  - Art. 210 — 「偽造、變造私文書，足以生損害於公眾或他人者，處五年以下有期徒刑。」
  - Art. 216 — 行使第210條至第215條之文書者，依偽造…之規定處斷。
  - Art. 339-2 — 「意圖為自己或第三人不法之所有，以不正方法由自動付款設備取得他人之物者，處三年以下有期徒刑、拘役或三十萬元以下罰金。」

## Foreign statutes (comparison only)
- 한국 민법 제1026조 제1호 (law.go.kr DRF, 시행 2026-03-17): 「상속인이 상속재산에 대한 처분행위를 한 때」 단순승인을 한 것으로 본다. https://www.law.go.kr/법령/민법/제1026조 (ko only)
- 日本 民法第921条第1号 (e-Gov): 「相続人が相続財産の全部又は一部を処分したとき」単純承認をしたものとみなす（保存行為等を除く）。 https://laws.e-gov.go.jp/law/129AC0000000089#Mp-At_921 (ja only)

## Judgments
### 最高法院 112年度台上字第1703號 刑事判決 (2023-05-04), final (third instance)
https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=TPSM%2C112%2C%E5%8F%B0%E4%B8%8A%2C1703%2C20230504%2C1
- Father died 105-07-29; son's spouse withdrew 12萬 at 中壢郵局 (共同), son withdrew 12萬5,000 on 105-08-01 at 峨眉郵局, both with the father's seal on withdrawal slips → "NT$245,000 in two withdrawals".
- 2nd instance (臺灣高等法院 111年度上更一字第60號) reversed the first-instance sentencing judgment and convicted (共同)行使偽造私文書, 3 months each, 應執行 5 months, 易科罰金 → "five months in total". Supreme Court: 上訴駁回.
- 「父親醫療及喪禮收支明細表」 prepared by the appellant → "kept a tally".
- Appellant's argument (zh opening, attributed): 全體繼承人於死亡當日齊聚老家，均同意暫緩對外公布死訊，以利提領存款…顯已默示同意.
- Holding: 「行為人在他人之生前，獲得該他人…之授權，一旦該他人死亡…原授權關係即當然歸於消滅…縱然原先獲授權之人為享有遺產繼承權之人，仍無不同」; 「一旦父母死亡之後，子女即不得再以父母名義製作提款文書領取款項（只能在全體繼承權人同意下，以全體繼承人名義為之），至於所提領之款項是否使用於支付被繼承人醫藥費、喪葬費之用，要屬行為人對於父母之存款有無不法所有意圖之問題，與行使偽造私文書罪該當與否不生影響」; 「沉默…原則上不生法律效果…不能以他人之單純沉默，據以推論他人已表示同意」.
### 臺灣桃園地方法院 114年度訴字第2074號 刑事判決 (2026-06-29), first instance
https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=TYDM%2C114%2C%E8%A8%B4%2C2074%2C20260629%2C1
- Son died 105-08-20 after a traffic accident; heirs: his two sons (born 2008, 2011); father used son's seal on a CTBC transaction slip, NT$6,000,000 remitted to father's account.
- 主文: 行使偽造私文書罪，有期徒刑伍月，易科罰金…緩刑貳年，保護管束，法治教育; money returned → no confiscation.
- Narrow exception (民法550但書): 「僅限於不抵觸遺囑及不侵害其他繼承人繼承權，且用於處理對死者有重大意義的事項，並應一併考量提領之必要性及急迫性」; funeral costs 「當無爭議」; but estate (CTBC deposit 2,353,252 + listed shares) could pay → 「難認被告有何將款項…匯款…之急迫性、必要性」.
- Bank route: 「銀行存款戶亡故後，其繼承人欲提領被繼承人之存款時，應由申請人提示存款證明、存款人死亡證明書、戶籍謄本、遺產稅繳清證明書、可確認為合法繼承人之證明，繼承存款申請書、繼承系統表、繼承人印鑑證明，若繼承人有一人以上，而委任一人代表領款，除上述文件外，應另提出全體繼承人簽章之委託書或拋棄繼承權聲明書」 → described in drafts as the court's account.
### 臺灣臺北地方法院 114年度易字第1349號 刑事判決 (2026-07-23), first instance
https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=TPDM%2C114%2C%E6%98%93%2C1349%2C20260723%2C1
- 被告 = 前為同居情侶關係; deceased died 112-12-22; heirs = deceased's two sons; ATM withdrawals with the deceased's card.
- 主文: 以不正方法由自動付款設備取得他人之物罪，有期徒刑5月…未扣案犯罪所得新臺幣373,608元沒收.
### 臺灣新北地方法院 115年度審簡字第523號 刑事判決 (2026-06-03), first instance (簡易)
https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=PCDM%2C115%2C%E5%AF%A9%E7%B0%A1%2C523%2C20260603%2C1
- Deceased died 111-06-05; defendant = 前妻; 「徐永文之其餘法定繼承人即陳佩璋與徐永文之子女徐弘宙、徐曉玲均拋棄繼承」 → sole heir = daughter 徐藝 (告訴人); defendant used deceased's seal on withdrawal slips.
- 主文: 應執行有期徒刑陸月…緩刑貳年. Indictment (incorporated) cites 最高法院112年度台上字第1703號.
### 臺灣臺中地方法院 115年度家聲字第28號 民事裁定 (2026-05-26), first instance
https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=TCDU%2C115%2C%E5%AE%B6%E8%81%B2%2C28%2C20260526%2C1
- Deceased died 114-03-16 owing 勞工紓困貸款 103,784元; one heir renounced; respondent alone inherited real property; no inventory; registered 114-08-04; 支付命令 served 114-11-24 (寄存送達); transfer by sale (registered 114-12-08; application 114-12-01); proceeds not used to pay.
- Holding: 第1163條第3款 applies → 「相對人不得對於被繼承人陳靜茹之遺產享有限定繼承之利益」; also: 未陳報遺產清冊 「並不當然喪失限定繼承之利益」 (citing the 98-06-10 legislative reason), concealment not found because registration is public.

## Other
- Internal links: none. External links checked (research/bin/links.py) BAD 0.
- Office/email as in A1.
