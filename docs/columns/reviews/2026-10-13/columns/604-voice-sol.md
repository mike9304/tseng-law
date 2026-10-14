# C4 문체 검수 — GPT-6 Sol

범위: 네 언어의 제목·요약·FAQ·본문에서 원어민 독자에게 어색한 문장과 반복되는 구성만 검토했습니다. 아래 수정안은 문체 제안이며, 조문·기한·금액·링크·가상 사례 표시는 원문에 남겨야 합니다. 원문 인용은 파일의 해당 부분을 그대로 옮겼습니다.

문장 다양성 검사: `ko` 0 FAIL, 1 WARN(문장 끝 `니다.` 95%); `ja` 0 FAIL, 1 WARN(です・ます 종결 96%); `en` 0 FAIL; `zh-hant` 0 FAIL. 네 파일 모두 아주 짧은 문장 2개 이상, 비정형 도입, 인용 없는 문단을 갖추었습니다. 동일 단어로 시작하는 문단 3개, 연속된 주장·조문·단서 문단 3개, 대비 틀 4개 이상, 명백한 문체 혼용은 확인되지 않았습니다. 따라서 규칙 5–6절의 `MONOTONY` 반려 요건에는 해당하지 않습니다. 다만 아래의 상투적 요약·메타 문장은 개별 문체 수정이 필요합니다.

## ko — FIX

- 원문: “1년은 제1항입니다.” → 문제: 계약기간을 조문 번호와 바로 등치한 압축문이라 구어와 법률문 사이에서 어색합니다. → 수정안: “1년짜리 임대차에는 제1항이 적용됩니다.” (기간과 항 번호 보존)
- 원문: “단서의 주어는 임대인입니다.” → 문제: 글쓴이가 조문 문법을 해설하는 메타 문장처럼 튑니다. → 수정안: “이 단서에 따른 통지 의무는 임대인에게 있습니다.” (의무 주체 보존)
- 원문: “조례가 모든 집에 닿지는 않습니다.” → 문제: ‘닿다’가 적용 범위의 번역투 비유로 들립니다. → 수정안: “이 조례가 모든 주택 임대에 적용되는 것은 아닙니다.” (적용 제외의 뜻 보존)
- 원문: “고친 부분은 제18점이고, 번호는 台內地字第1140113583號이며, 그날 시행입니다.” → 문제: ‘고친 부분’, ‘번호’, ‘그날’이 조사 메모를 그대로 이어 붙인 듯합니다. → 수정안: “개정 대상은 제18점이며, 공고 문서번호는 台內地字第1140113583號입니다. 개정 내용은 공고 당일 시행됐습니다.” (제18점·문서번호·시행 시점 보존)
- 원문: “그래도 나가는 일은 약정을 어기는 쪽이고, 뒤의 돈은 계약에 적힌 문언과 임대인과의 합의에 남습니다.” → 문제: ‘나가는 일은 … 쪽’, ‘뒤의 돈’, ‘합의에 남는다’가 다른 언어의 문장 구조를 옮긴 듯합니다. → 수정안: “그런데도 임차인이 나가면 계약 위반 문제가 생깁니다. 부담할 금액은 계약 문구와 이후 임대인과의 합의에 따라 정해집니다.” (무단 퇴거·계약 문구·추후 합의 보존)
- 원문: “통지 문장은 조문마다 따로 있습니다.” → 문제: 독자에게 필요한 통지 요건보다 글의 편집 구조를 말합니다. → 수정안: “조례와 민법은 각각 통지 요건을 두고 있습니다.” (두 근거의 구별 보존)
- 원문: “존증신함(存證信函)은 부쳤다는 사실을 남기려고 흔히 쓰는 우편입니다.” → 문제: 한자어 음역이 한국어 독자에게 생소하고, ‘부쳤다는 사실’도 구어적으로 걸립니다. → 수정안: “대만의 存證信函은 발송 기록을 남기기 위해 흔히 이용하는 우편입니다.” (제도 명칭과 발송 기록의 뜻 보존)
- 원문: “계약서의 칸과 통지 기록을 보내 주실 일은 호정(昊鼎)국제법률사무소 메일 wei@hoveringlaw.com.tw 로 받습니다.” → 문제: ‘보내 주실 일은 … 메일로 받습니다’의 호응이 맞지 않고 상담 문구가 불쑥 등장합니다. → 수정안: “계약서에서 선택한 칸과 통지 기록은 호정(昊鼎)국제법률사무소 이메일 wei@hoveringlaw.com.tw로 보내실 수 있습니다.” (보낼 자료·사무소·주소 보존)
- 원문: “칸이 득이면 [제14점](https://www.ey.gov.tw/Page/DFB720D019CCCB0A/478917df-7599-418f-8715-fd2716b623b4)의 한 달 통지가 있고, 그 통지를 빠뜨린 위약금만 한 달 치를 넘기지 못합니다. 부득이면 상한 숫자가 그 점에 없습니다.” → 문제: 대만 계약서의 `得/不得`를 음독만 해 마무리에서 독자가 뜻을 다시 풀어야 합니다. 두 문장도 앞부분의 요약을 반복합니다. → 수정안: “계약서가 임의 종료를 허용하는 ‘得’을 선택했다면 [제14점](https://www.ey.gov.tw/Page/DFB720D019CCCB0A/478917df-7599-418f-8715-fd2716b623b4)에 따라 적어도 한 달 전에 통지해야 합니다. 그 통지를 빠뜨린 경우에만 위약금 상한이 한 달 치 임대료이고, 허용하지 않는 ‘不得’에는 그 상한액이 적혀 있지 않습니다.” (선택지·기간·상한의 적용 조건·링크 보존)

## ja — FIX

- 原文: “上限として書かれているのは、通知を飛ばしたときの話です。” → problem: 「通知を飛ばす」「ときの話」 are too casual for the surrounding legal prose. → suggested rewrite: “家賃1か月分という上限は、所定の事前通知をせずに解約した場合に限られます。” (cap and condition retained)
- 原文: “1年と書いた住宅を期限前に出るとき、通知とお金はこの欄で分かれます。” → problem: 「1年と書いた住宅」「通知とお金は分かれる」 sound translated. → suggested rewrite: “契約期間が1年の住宅を途中で退去する場合、通知期間と違約金はこの欄の選択によって変わります。” (one-year term and checkbox retained)
- 原文: “主語は貸主です。” → problem: grammatical commentary interrupts the explanation of who must give notice. → suggested rewrite: “この規定で通知義務を負うのは貸主です。” (duty holder retained)
- 原文: “公告された応記載事項は、契約書に落ちていても契約の内容になります。” → problem: 「契約書に落ちていても」 is a calque; an item may be omitted *from* the contract. → suggested rewrite: “公告された記載必須事項は、契約書に書かれていなくても契約内容になります。” (announced mandatory term and effect retained)
- 原文: “直したのは第18点で、番号は台內地字第1140113583号、その日から施行です。” → problem: sounds like an editor's note; 「番号」 lacks a referent. → suggested rewrite: “改正されたのは第18点です。公告番号は台內地字第1140113583号で、改正は公告当日に施行されました。” (point, announcement number, effective timing retained)
- 原文: “事前に知らせずただちに終了する側は相手へ違約金を賠償し、その違約金は家賃1か月分を超えてはなりません。” → problem: 「違約金を賠償」 is unnatural Japanese collocation. → suggested rewrite: “事前に通知せずに契約を終了する側は相手方に違約金を支払います。その額は家賃1か月分を超えません。” (notice condition and cap retained)
- 原文: “それでも出ることは約定に反する側になり、その後のお金は契約の文言と貸主との合意に残ります。” → problem: subject and predicate do not fit; 「お金が合意に残る」 is a literal translation. → suggested rewrite: “それでも退去すれば契約違反の問題が生じます。負担する金額は契約の文言と、その後の貸主との合意によって決まります。” (breach, contract wording, later agreement retained)
- 原文: “## 賠償を請求できない事由は、別の記事と第18点です” → problem: 「別の記事」 can mean another website article, while the body is discussing a statutory provision. → suggested rewrite: “## 賠償なしで終了できる事由：条例第11条と第18点” (the two named provisions retained)
- 原文: “四つと、直して家賃から差し引く手順は[押金が返ってこないとき](/ja/columns/taiwan-rental-deposit-refund-two-months)にすでに書いてあります。ここでは通知の長さと、2025年の改正を足します。” → problem: repeats the outline and describes what this writer will ‘add’; the cross-reference can stand on its own. → suggested rewrite: “四つの事由と、修繕費を家賃から差し引く手順は[押金が返ってこないとき](/ja/columns/taiwan-rental-deposit-refund-two-months)で扱っています。” (link and the subjects it covers retained; the following paragraphs still give the notice period and 2025 amendment)
- 原文: “通知の文は条文ごとに別です。” → problem: an editorial comment about wording rather than a natural description of the requirements. → suggested rewrite: “通知については、条例と民法がそれぞれ定めています。” (separate statutory bases retained)
- 原文: “[民法第424条](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=424)と同じ方向です。” → problem: 「同じ方向」 is vague translationese. → suggested rewrite: “住宅その他の居住用建物については、[民法第424条](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=424)にも同様の規定があります。” (residential scope and link retained)
- 原文: “その書面が解約の効力まで持つかは、ここでは言いません。” → problem: 「ここでは言いません」 sounds abrupt and evasive. → suggested rewrite: “存證信函を送った場合の解約の効力については、ここでは断定しません。” (no claim of automatic legal effect)
- 原文: “契約書の欄と通知の記録を送っていただくときは、昊鼎国際法律事務所のメール wei@hoveringlaw.com.tw で受けます。” → problem: 「メールで受けます」 is an unnatural closing formula. → suggested rewrite: “契約書で選んだ欄と通知の記録は、昊鼎国際法律事務所のメールアドレス wei@hoveringlaw.com.tw に送れます。” (materials, firm and address retained)

## en — FIX

- Original: “## A fixed term ends when the term ends” → problem: tautological heading sounds generated and does not tell readers which issue the section resolves. → suggested rewrite: “## What a one-year term means for early termination” (one-year scope and early-termination issue retained)
- Original: “Four arrangements sit outside the Act” → problem: “arrangements sit outside” is an awkward calque in otherwise plain English. → suggested rewrite: “The Act does not apply to four types of housing” (the four exclusions and citation in the rest of the sentence remain)
- Original: “The contract's effect follows the preceding article.” → problem: “effect follows” sounds like a word-for-word rendering of a statute. → suggested rewrite: “The preceding article governs the contract's legal effect.” (reference to the preceding article retained)
- Original: “One month of rent is the cap. It attaches only to an ending that skipped the notice.” → problem: repeats the preceding paragraph in two clipped, impersonal sentences. → suggested rewrite: “The one-month rent cap applies only if a party ends the lease without the required notice.” (amount and notice condition retained)
- Original: “A signed note of the end date, the sum, and the deposit set-off is what fixes the money.” → problem: “is what fixes the money” is unnatural and vague. → suggested rewrite: “The parties can record the agreed end date, amount, and deposit set-off in a document they both sign.” (all three details and both signatures retained)
- Original: “Each article writes its own notice.” → problem: statutes do not “write” notices; this is a direct-translation feel. → suggested rewrite: “The two provisions set out their notice requirements separately.” (distinct notice requirements retained)
- Original: “[Article 424](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=424) runs in that direction for a house or other residence.” → problem: “runs in that direction” is vague and unnatural. → suggested rewrite: “[Article 424](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=424) contains a similar rule for a house or other residence.” (residential scope and link retained)
- Original: “The deposit comes back in full, or as what remains after lease debts are set off, once the dwelling is returned and those debts are paid ([Article 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060125&flno=7), paragraph 2).” → problem: “or as what remains” makes the return condition hard to parse. → suggested rewrite: “Once the tenant returns the dwelling and pays the lease debts, the deposit is returned in full or after those debts are set off ([Article 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060125&flno=7), paragraph 2).” (return, debt, set-off and citation retained)
- Original: “A home rented in one of those places is a question for someone there.” → problem: evasive and unnatural closing of a jurisdictional note. → suggested rewrite: “For a home rented in Korea, Japan, or a U.S. state, check the local rules on ending a lease early.” (named jurisdictions and scope retained)
- Original: “Keys pass after the joint check.” → problem: “keys pass” is unnatural and ends the piece on a procedural fragment. → suggested rewrite: “The keys are handed over after the parties check the home together.” (sequence and joint inspection retained)

## zh-hant — FIX

- 原文: “換工作、人要搬到另一個縣市，一年的住宅租約能在期限前結束嗎？” → 問題: 「換工作、人要搬」的頓號式接法不自然。→ 建議: “因換工作要搬到另一個縣市，一年的住宅租約能提前結束嗎？”（換工作、跨縣市及一年租期保留）
- 原文: “定有期限的，期限屆滿就消滅。” → 問題: 省掉「租賃關係」後像法條摘記，並與標題重複。→ 建議: “定有期限的租賃關係，於期限屆滿時消滅。”（定期租賃與屆滿效果保留；下句民法第450條第1項連結照留）
- 原文: “一年走第1項。” → 問題: 「走第1項」是生硬的口語套法。→ 建議: “一年期租約適用第1項。”（期間與項次保留）
- 原文: “第3項先依習慣通知。” → 問題: 「先依習慣通知」省略太多，像逐字縮寫。→ 建議: “第3項先以習慣決定預告期間。”（習慣與先期通知的關係保留）
- 原文: “主詞是出租人。” → 問題: 突然評論法條的文法，打斷讀者對通知義務的理解。→ 建議: “依這段規定，負通知義務的是出租人。”（義務主體保留）
- 原文: “上限是一個月。只掛在沒有先期通知的終止。” → 問題: 「只掛在」是翻譯腔；兩個短句又機械地重述上一段。→ 建議: “一個月租金的上限，只適用於未依規定提前通知就終止租約的情形。”（金額及適用條件保留）
- 原文: “減不減，條文沒有保證。” → 問題: 過度口語，且「條文保證」搭配不自然。→ 建議: “法院得酌減，但不表示每件案件都會減少。”（法院裁量及不保證結果保留；前句第252條連結照留）
- 原文: “人要換到另一個縣市上班，家裡的一年租約還剩半年（虛構情境）。行李還在。” → 問題: 「人要換到」「家裡的租約」與孤立的「行李還在」組成生硬的場景模板。→ 建議: “一名承租人因換工作要搬到外縣市，家中的一年期租約還有半年，行李也仍在屋內（虛構情境）。”（工作變動、地點、剩餘期間、行李及虛構標示保留）
- 原文: “通知各寫各的。” → 問題: 口語省略過度，讀者難看出指的是兩項規定。→ 建議: “條例與民法各自訂有通知規定。”（兩套規定的區別保留）
- 原文: “兩條都在，哪一條優先，這裡不另斷。” → 問題: 「兩條都在」和「不另斷」像草稿筆記；語氣忽然從口語跳到文言。→ 建議: “這兩項規定如何適用、何者優先，本文不進一步判斷。”（不判斷優先順序的限制保留）
- 原文: “韓國、日本和美國各州的中途結束，這裡不斷定。房子若租在那些地方，問當地。” → 問題: 「中途結束」「問當地」是直譯式省略，也讓結尾顯得敷衍。→ 建議: “韓國、日本及美國各州的租約提前終止規則，本文不作判斷。在這些地方租屋，仍須依當地規定確認。”（司法管轄範圍與未作判斷保留）
- 原文: “半年不是[條例第11條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060125&flno=11)第1項的事由。” → 問題: 真正要說的是換工作不在列舉事由內；把「半年」當成主詞，是跨語言摘要留下的錯位。→ 建議: “因換工作搬遷、租約還有半年，並不屬於[條例第11條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060125&flno=11)第1項所列事由。”（工作變動、剩餘期間、條文連結保留）

VOICE ko: FIX
VOICE ja: FIX
VOICE en: FIX
VOICE zh-hant: FIX
