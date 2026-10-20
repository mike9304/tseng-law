# A1 facts — claim → source (checked 2026-10-20 KST; re-verified 2026-10-20 ~19:00 KST for Astra r1 fix)

All statute texts fetched from law.moj.gov.tw LawSingle pages on 2026-10-20 (cached copies: research/law/<pcode>-<flno>.txt). Judgments opened in the Judicial Yuan database on 2026-10-20 (cached: research/jud/*.txt).
Astra r1 fix: I0030062 Art. 2/4/6, 刑訴 487/488, 民法 184/185/273 re-fetched live from LawSingle (text identical to cache; I0030062 LawAll 修正日期 民國114年05月01日). Both judgments re-fetched live from printData.aspx (byte-identical to cache).

## Statutes

### 洗錢防制法 (G0380131) — current text, 修正日期 民國113年07月31日 (沿革 #11: 113-07-31 全文31條修正公布，除第6、11條外自公布日施行). Database 整編截止日 115-10-08.
- Art. 22 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0380131&flno=22
  > 任何人不得將自己或他人向金融機構申請開立之帳戶、向提供虛擬資產服務或第三方支付服務之事業或人員申請之帳號交付、提供予他人使用。但符合一般商業、金融交易習慣，或基於親友間信賴關係或其他正當理由者，不在此限。
  > 違反前項規定者，由直轄市、縣（市）政府警察機關裁處告誡。經裁處告誡後逾五年再違反前項規定者，亦同。
  > 違反第一項規定而有下列情形之一者，處三年以下有期徒刑、拘役或科或併科新臺幣一百萬元以下罰金：一、期約或收受對價而犯之。二、交付、提供之帳戶或帳號合計三個以上。三、經直轄市、縣（市）政府警察機關依前項或第四項規定裁處後，五年以內再犯。
  > 前項第一款或第二款情形，應依第二項規定，由該管機關併予裁處之。
  > 違反第一項規定者，金融機構、提供虛擬資產服務及第三方支付服務之事業或人員，應對其已開立之帳戶、帳號，或欲開立之新帳戶、帳號，於一定期間內，暫停或限制該帳戶、帳號之全部或部分功能，或逕予關閉。
  > 前項帳戶、帳號之認定基準，暫停、限制功能或逕予關閉之期間、範圍、程序、方式、作業程序之辦法，由法務部會同中央目的事業主管機關定之。
  - Used for: prohibition + 3 exceptions (ko/en body, FAQ1); 告誡 (ko/en); 3 criminal triggers, penalty ≤3 yrs/拘役/≤NT$1M fine, 併科 (ko/en, FAQ1); "promise is enough" = 期約 (ko/en hypothetical, FAQ1); bank restrictions basis (para 5–6).
- Art. 2 (洗錢 definition), Art. 19 (洗錢罪: 3–10 yrs + fine ≤NT$100M; <NT$100M: 6 months–5 yrs + fine ≤NT$50M) https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0380131&flno=19 — cited only as the money-laundering offence that an aider may be linked to (ko/en). No penalty figures from Art. 19 are stated in the drafts.

### 洗錢防制法第二十二條第六項帳戶帳號暫停限制功能或逕予關閉管理辦法 (I0030062) — 修正日期 民國114年05月01日
- Art. 2 (行為人 = person given 告誡) https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0030062&flno=2 (not linked in drafts; supports "after 告誡")
- Art. 4 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0030062&flno=4
  > 本辦法所為帳戶、帳號暫停、限制功能或逕予關閉等措施之效力，自直轄市、縣（市）政府警察機關裁處告誡之日起算五年。
  - Used for: "5 years from the admonition date" (ko/en).
- Art. 6 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0030062&flno=6
  > 金融機構對於行為人之金融帳戶，除繳交公用事業費用（如水、電、瓦斯）、稅款、罰金、罰鍰、滯納金外，應為下列限制：
  > 一、每個帳戶之晶片金融卡於自動化服務設備（含實體／網路ATM）每日轉帳（含約定、非約定交易）、提領金額上限各為等值新臺幣一萬元整；晶片金融卡消費扣款（含行動金融卡）與前述額度併計。
  > 二、禁止使用網路銀行（含行動銀行）、電話（語音）銀行及將存款帳戶連結各式支付平台（含電子支付、第三方支付、行動支付或開放銀行TSP業者等）及其他類似之電子銀行業務辦理支付或轉帳服務。
  > 三、臨櫃辦理提領、轉帳或匯出匯款時，金融機構為執行加強行為人身分確認或持續審查措施，得要求其提供交易相關資料，證明交易之合理性，如無法提出合理說明時，金融機構得拒絕其交易。
  > （第2項：電子支付帳戶 每月付款NT$3萬、每日小額匯兌NT$1萬）
  - Used for (ko/en, revised r1): ATM transfer and withdrawal each capped NT$10,000/day per account; payments/transfers via online banking (incl. mobile), telephone banking, or an account linked to a payment platform barred; exceptions stated: utility bills (water, electricity, gas), taxes, 罰金 (criminal fines), 罰鍰 (administrative fines), 滯納金 (late charges). Not stated: debit-purchase aggregation, counter-justification rule (item 三), e-payment-account limits (para 2) — omitted for length; nothing in the drafts contradicts them.

### 中華民國刑法 (C0000001)
- Art. 13 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=13 — 第2項「行為人對於構成犯罪之事實，預見其發生而其發生並不違背其本意者，以故意論。」 → dolus eventualis sentence (ko/en).
- Art. 30 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=30 — 幫助犯 → aiding (ko/en).
- Art. 339 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=339 — 詐欺 → aiding fraud (ko/en).

### 民法 (B0000001)
- Art. 184 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=184 — 第1項「因故意或過失，不法侵害他人之權利者，負損害賠償責任。…」 → liability for negligent as well as intentional harm (all four, FAQ). Not presented as sufficient on its own: see causation requirement under Art. 185.
- Art. 185 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=185 — 「數人共同不法侵害他人之權利者，連帶負損害賠償責任。…／造意人及幫助人，視為共同行為人。」 → joint liability, aider deemed joint actor (all four).
  - r1 fix: aider requirements stated in all four bodies — fault (intent or negligence) in the aiding act AND adequate causation between the aiding act and the victim's loss. Source: Hualien judgment 「民法第185條第2項所稱幫助人…幫助人對於幫助之行為須有故意或過失，且被害人所受之損害與幫助行為亦具有相當因果關係，始可視為共同行為人而須與行為人連帶負損害賠償責任（最高法院110年度台上字第204號民事判決意見）」; Taipei judgment applied the same test (quote below). Drafts say 'both judgments below use this framework'.
- Art. 273 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=273 — 第1項「連帶債務之債權人，得對於債務人中之一人或數人或其全體，同時或先後請求全部或一部之給付。」 → once the Art. 185 requirements are met, the victim may claim the whole of the loss caused by that tort from the holder alone (all four; r1 wording).
- Art. 197 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=197 — 第1項「…自請求權人知有損害及賠償義務人時起，二年間不行使而消滅，自有侵權行為時起，逾十年者亦同。」 → 2 yrs / 10 yrs (all four, FAQ3).
- Art. 217 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=217 — 與有過失 (court may reduce) → cited where Taipei court refused reduction.
- Art. 218 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=218 — 「損害非因故意或重大過失所致者，如其賠償致賠償義務人之生計有重大影響時，法院得減輕其賠償金額。」 → cited where Taipei court found no evidence.

### 刑事訴訟法 (C0010001)
- Art. 487 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=487 — 「因犯罪而受損害之人，於刑事訴訟程序得附帶提起民事訴訟，對於被告及依民法負賠償責任之人，請求回復其損害。／前項請求之範圍，依民法之規定。」
  - r1 fix: body and FAQ in all four now state the eligibility condition — available only where the holder is indicted AND the victim's loss arose from the crime charged (「因犯罪而受損害之人」). No claim that any account-related indictment opens the route.
  - Supporting public judgment (opened 2026-10-20 ~18:59 KST, fixer session 64898; cached research/jud/TPDM-115-簡附民-131-20260811-1.txt; not cited in drafts): 臺灣臺北地方法院115年度簡附民字第131號刑事判決 (2026-08-11) https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=TPDM%2C115%2C%E7%B0%A1%E9%99%84%E6%B0%91%2C131%2C20260811%2C1 — 「其請求回復之損害，以被告被訴犯罪事實所生者為限…（最高法院111年度台附字第3號判決意旨參照）」; defendant charged/convicted only under 洗錢防制法第22條第3項第2款 (幫助詐欺・幫助洗錢 不另為不起訴) → fraud victim is an indirect victim, incidental action dismissed as 不合法 under 刑訴§502(1), 「不影響原告另依民事訴訟程序請求之權利」. Confirms the r1 condition is correct and that an Art. 22-only indictment does not open the incidental route.
- Art. 488 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=488 — 「提起附帶民事訴訟，應於刑事訴訟起訴後第二審辯論終結前為之。但在第一審辯論終結後提起上訴前，不得提起。」 (timing stated in zh body; ko/ja/en cite only)
- Art. 503 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=503 — 第1項「刑事訴訟諭知無罪、免訴或不受理之判決者，應以判決駁回原告之訴。但經原告聲請時，應將附帶民事訴訟移送管轄法院之民事庭。」 → drafts mention the acquittal case only (subset, accurate).

## Judgments (public, opened 2026-10-20)

### 臺灣臺北地方法院 114年度簡上字第212號 民事判決 (2026-09-30), second instance of 臺北簡易庭 114年度北簡更一字第2號 (2025-03-11)
https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=TPDV%2C114%2C%E7%B0%A1%E4%B8%8A%2C212%2C20260930%2C1
- 主文: 原判決廢棄。被上訴人應給付上訴人新臺幣15萬元及利息 → "NT$150,000 plus interest"; first instance had rejected the victim's claim (原判決廢棄 on the victim's appeal).
- Holder's arguments: 「本件事發當時，被上訴人為21歲」; trusted loan offer (「誤信…可協助被上訴人辦理貸款，遂出於辦理貸款之目的，將系爭帳戶提供予詐欺集團」) → "said they were 21 and tricked while seeking a loan" (presented as the holder's claim).
- 不起訴: 「臺灣臺中地方檢察署113年度偵字第11828號為不起訴處分，復經臺灣高等檢察署臺中檢察分署113年度上聲議字第1186號處分書駁回上訴人再議之聲請」 → prosecutors declined; victim's 再議 rejected (ja/zh mention 再議).
- Duty: 「一般人自負有謹慎保管自身帳戶資料，不得任意提供予他人使用之注意義務。」
- Instructions: 「詐欺集團要求被上訴人謊稱其為不認識之「李正之」之子、款項匯入系爭帳戶當日旋即領出、要求被上訴人以現金而非匯款之方式返還款項等情…顯與一般商業及交易習慣不符」 (name not used in drafts).
- Withdrew and handed over: 「復遭被上訴人提領、轉交予真實姓名年籍不詳之詐欺集團成員」. Victim's transfer 111-12-23 12:48; holder withdrew 13:10–13:27 the same day, total 13萬5,000元, 「再轉交予真實姓名年籍不詳之詐欺集團成員」 → ja/zh 'withdrew cash on the day of the deposit and handed it to the other side'.
- r1 fix: the judgment mentions NO transfer to another account; it describes cash withdrawal + handover and the instruction 「以現金而非匯款之方式返還款項」. Removed 'sent to another account' (ja 別の口座へ送った / ko 다른 계좌로 보내는 / zh 轉走 / en 'forwarding') in all four.
- Causation: 「被上訴人提供系爭帳戶、提領轉交上訴人匯款之過失幫助行為，與詐欺集團成員詐騙上訴人之故意行為，均為上訴人受有本件損害15萬元之共同原因，自具相當因果關係。」; 「客觀上有幫助行為，且主觀上有過失，被上訴人之幫助行為與上訴人之損害間，亦具有相當因果關係，依民法第185條第2項規定，被上訴人與詐欺集團成員為共同行為人」 → 'court treated providing the account + withdrawal/handover as negligent aiding with adequate causation' (all four).
- Non-prosecution vs negligence: 「…不起訴處分…然此僅就被上訴人有無直接或間接故意為認定，與構成民事侵權行為責任之過失情形，尚有不同…」
- 217: 「如損害之發生，因加害人一方之故意不法行為引起，被害人縱未採取相當防範措施或迴避手段，不能因此認被害人對損害之發生亦與有過失」; 「上訴人未能及時察覺有異以避免受騙，難認其對所受損害亦與有過失。」
- 218: 「遍查卷內並無證據證明被上訴人賠償上訴人之損害對其生計有何重大影響，本院自無從依上開規定減輕賠償金額。」
- Basis: 「依民法第184條第1項前段、第185條第2項規定…洵屬正當」.

### 臺灣高等法院花蓮分院 115年度上易字第12號 民事判決 (2026-07-29), appeal from 臺灣花蓮地方法院 114年度訴更一字第1號 (2025-12-17)
https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=HLHV%2C115%2C%E4%B8%8A%E6%98%93%2C12%2C20260729%2C1
- 主文: 上訴駁回 (victim lost).
- Claim: 「依序匯款新臺幣32萬元、30萬元至系爭帳戶…而受有62萬元之損害」, transfers on 113-05-22 and 05-24 → "NT$620,000".
- 不起訴: 「經臺灣臺中地方檢察官以113年度偵字第49189號處分書，處分不起訴…再議…駁回」 (not stated in drafts' Hualien paragraph beyond FAQ framing).
- Standard quoted (verbatim): 「幫助人對於幫助之行為須有故意或過失，且被害人所受之損害與幫助行為亦具有相當因果關係，始可視為共同行為人而須與行為人連帶負損害賠償責任（最高法院110年度台上字第204號民事判決意見）」.
- Evidence used: chat records (對話紀錄) with 「大 ○」, partner's online profile, account statements → supports 'messages / account usage' as records both courts examined.
- Relationship: 「被上訴人與「大○」之人互相以老公、老婆稱呼」; 「為幫助對方事業需求而提供帳戶」; 「戀愛關係中，是否能就對方提出之任何請求，均以理性方式分析評估，甚而…聯想至有無可能遭詐欺集團利用作為犯罪工具，實有疑義」.
- Normal account: 「帳戶餘額約有3至4萬餘元，供作汽車貸款扣款、電信費用扣款、消費扣款之用…為正常使用之帳戶」 → "car loan and phone bill".
- Own money: 「原帳戶內本身之存款約17,000元亦於同年月18日遭「大○」轉出」, plaintiff's transfer 「同年月22日」 → "about NT$17,000, four days before the victim's first transfer".
- Holder's defence: 「並以其亦為被害人置辯」 → zh "主張自己也是被害人".
- Online: 「被上訴人網路交友對象」.

## Other
- Address 40453 臺中市北區館前路19號6樓之1 and email wei@hoveringlaw.com.tw: as used in existing site columns (ref/src/content/columns-ja/310-…, issues/zh-hant/ISSUE-20261018-05-…).
- English law names from law.moj.gov.tw/ENG: Money Laundering Control Act; Civil Code; Criminal Code of the Republic of China; Code of Criminal Procedure. I0030062 has no ENG page → described in en sources with the Chinese title.
- Internal links: /ja/columns/japanese-resident-taiwan-account-lending-crime (ref columns-ja/218-…), /zh-hant/columns/account-lending-prosecutor-summons-money-laundering-taiwan (ref columns-zh/223-…). Link check: research/bin/links.py → BAD total 0.
- Hypothetical: ko/en NT$5,000 account sale before going home — labelled 「(가상의 예입니다)」 / "(an invented example)".
- r1 fix — scammer identity: removed categorical/prevalence claims (ko 대개 이름조차 / ja たいてい / en "Scammers don't leave their names" / zh 多半查不到). Replaced with a conditional statement (if the scammer's identity stays unknown, the receiving account's holder may be the identifiable defendant); no factual or statistical claim made.
- Finality (observation only, drafts unchanged): both judgment texts end with 「本判決不得上訴」（臺北）/「本件不得上訴」（花蓮）. The drafts keep the conservative line that finality was not separately checked; not part of the r1 findings.
