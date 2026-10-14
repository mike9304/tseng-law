# C1 문체 검수 — GPT-6 Sol

범위: 네 언어의 제목·요약·FAQ·본문·마무리. 아래 수정안은 문체 제안이며, 각 인용의 사실·조건·숫자·가상 표시를 유지합니다. 조문과 링크는 원문 위치에 그대로 남겨야 합니다. 다양성 검사 네 파일 모두 FAIL 0개입니다(ko·ja는 문말 반복 WARN). 따라서 자동 검사에 따른 MONOTONY 판정은 없습니다. 자기 점검 5절의 정형 마무리 항목은 네 언어 모두 보완이 필요합니다. 본문에 である調 혼용이나 번체본의 간체자·뚜렷한 중국 대륙 어휘는 보이지 않았습니다.

## ko — 한국어 독자

- 원문: “영업은 이어지고 있습니다. 그런 사용자의 월급 연체만으로는 이 조가 열리지 않습니다.” → 문제: 갑자기 장면이 바뀌고, 법 조항이 ‘열린다’는 말이 번역투입니다. → 수정안: “회사가 계속 영업 중이라면 월급이 밀렸다는 사정만으로는 제28조의 요건을 충족하지 않습니다.”
- 원문: “누구의 빚인지는 [같은 법 제2조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=2)의 정의로 돌아갑니다.” → 문제: ‘정의로 돌아간다’는 영어식 논리 전환입니다. → 수정안: “누가 임금 채무를 지는지는 [같은 법 제2조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=2)의 사용자 정의를 보면 알 수 있습니다.”
- 원문: “외국인이라는 점만으로 노동자가 되지는 않고, 도급이라는 이름만으로 노동자가 되지도 않습니다.” → 문제: 같은 구조의 부정을 겹쳐 한국어 호흡이 무겁습니다. → 수정안: “외국인도 고용관계와 종속성이 있어야 노동자에 해당합니다. 계약서에 ‘도급’이라고 적혀 있어도 실제 관계를 따져야 합니다.”
- 원문: “노동자퇴직금조례는 자견비 자리에서만 등장합니다.” → 문제: ‘자리에서 등장한다’는 조문 항목을 설명하는 말로 부자연스럽습니다. → 수정안: “제28조에서 노동자퇴직금조례는 자견비의 근거로만 언급됩니다.”
- 원문: “일수나 시간, 건수로 임금을 정하는 경우에는 바닥이 있습니다.” → 문제: ‘바닥’은 영어 *floor*를 옮긴 듯하고 뒤에서 반복됩니다. → 수정안: “일수·시간·건수에 따라 임금을 정하는 경우에는 평균임금의 하한이 적용됩니다.” 뒤의 “바닥은 그 경우의 이야기입니다.”도 “이 하한은 일수·시간·건수로 임금을 정하는 경우에 적용됩니다.”로 맞추면 자연스럽습니다.
- 원문: “대지급에는 앞선 행위가 하나 있습니다.” → 문제: 내용을 예고하는 추상적인 문장입니다. → 수정안: “기금이 대지급하려면 노동자가 먼저 사용자에게 청구하고도 변제받지 못해야 합니다.”
- 원문: “임금 쪽은 6개월 미만인 부분이 비율 변제와 기금의 임금 대지급에 함께 올라갑니다. 퇴직급여와 자견비도 그 순위에 오르고, 기금이 대신 내는 둘의 합계는 평균임금 6개월분에서 멈춥니다. 청구했으나 받지 못했을 때의 일입니다.” → 문제: 바로 앞 표와 본문을 다시 압축한 정형 마무리이며 ‘오르다/멈추다’가 부자연스럽습니다. → 수정안: “타이중의 가상 사례에서 사장에게 청구한 뒤에도 받지 못했다면, 밀린 임금 중 6개월 미만인 부분은 비율 변제 대상이자 기금 대지급 대상입니다. 퇴직급여와 자견비도 같은 변제 순위를 가지며, 기금이 대신 지급하는 두 항목의 합계는 평균임금 6개월분을 넘지 않습니다.”

문장 다양성: `cv=0.497`, 짧은 문장 `24.1%`, 검사 FAIL 0개. “~니다” 문말 `95%` WARN은 합니다체 자체가 문제라는 뜻은 아닙니다. 특히 “~에 오릅니다/있습니다/아닙니다”의 연속은 위처럼 동작을 구체화하는 편이 낫습니다. 5절 자기 점검에서 정형 마무리 1건만 미충족으로 보아 별도 MONOTONY FAIL은 부여하지 않습니다.

## ja — 日本語読者

- Original: “営業は続いています。その状態で給料が遅れているだけでは、この条は開きません。” → 문제: 앞의 청산 통지 사례에서 설명 없이 영업 중인 회사로 전환하고, 「条が開く」는 직역투입니다. → 수정안: “一方、会社が営業を続けている場合、給料の遅れだけでは第28条の適用要件を満たしません。” FAQ의 “ときに開きます”도 “ときに適用されます”가 자연스럽습니다.
- Original: “誰の債務かは[同じ法第2条](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=2)の定義に戻ります。” → 문제: 「定義に戻る」는 영어식 전환입니다. → 수정안: “未払い賃金を誰が支払うのかは、[同じ法第2条](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=2)の使用者の定義から判断します。”
- Original: “賃金債権だけが先に満額を取る図にはなりません。” → 문제: 「図にはなりません」가 어색하고 사물을 사람처럼 표현합니다. → 수정안: “賃金債権だけが、同じ順位の担保債権より先に全額弁済されるわけではありません。”
- Original: “労働基準法または労工退休金条例が支払いを求めているのに使用者が出していない資遣費が、順位に乗ります。” → 문제: 「順位に乗る」와 「出していない」는 법률 설명에서 가볍고 번역된 느낌입니다. → 수정안: “労働基準法または労工退休金条例に基づく資遣費が未払いの場合、その債権にこの弁済順位が適用されます。” 같은 문단의 退休金 문장도 같은 어휘로 다듬을 수 있습니다.
- Original: “日数、時間または出来高で賃金を定める場合には、床があります。” → 문제: 영어 *floor*의 직역인 「床」은 일본어 독자에게 뜻이 전달되지 않습니다. → 수정안: “日数、時間または出来高で賃金を定める場合、平均賃金には下限が設けられています。” 뒤의 “床があるのは、その場合です。”도 “この下限は、その場合に限って適用されます。”로 바꾸면 됩니다.
- Original: “申請の窓口と審査の日数も、その手続の定めの側です。” → 문제: 「定めの側」는 일본어 문장이 아닙니다. → 수정안: “申請窓口や審査に要する日数も、その手続を定める規則で確認する事項です。”
- Original: “扉を閉める前に、賃金額そのものを争うときの労働局の調解と裁判所の労働調解の違いは、[別の記事](/ja/columns/taiwan-labor-dispute-mediation-bureau-vs-court)にあります。” → 문제: 「扉を閉める前に」는 폐업의 직역 비유로 읽히며 연결도 느슨합니다. → 수정안: “会社が廃業する前に賃金額を争う場合については、労働局の調解と裁判所の労働調解の違いを[別の記事](/ja/columns/taiwan-labor-dispute-mediation-bureau-vs-court)で説明しています。”
- Original: “賃金債務と資遣費債務があるかどうかは、契約とそれぞれの支払条文が残しています。” → 문제: 계약과 조문이 판단을 ‘남긴다’는 구조가 부자연스럽습니다. → 수정안: “賃金と資遣費の支払義務があるかどうかは、契約とそれぞれの給付を定める条文に照らして確認する必要があります。”
- Original: “賃金の側は、六か月未満の部分が割合弁済と基金の賃金立替の両方に乗ります。退休金と資遣費もその順位に乗り、基金が代わりに出す二つの合計は平均賃金の六か月分で止まります。請求して、受けられなかったときの話です。” → 문제: 「乗る/止まる」의 반복과 앞 내용을 다시 요약하는 정형 마무리입니다. → 수정안: “高雄の架空の例で、会社に請求しても支払われなかった場合、未払い賃金の六か月未満の部分は按分弁済と基金による立替の対象です。退休金と資遣費にも同じ弁済順位が適用されますが、基金が立て替える二つの合計は平均賃金の六か月分が上限です。”

문장 다양성: `cv=0.482`, 짧은 문장 `18.2%`, 검사 FAIL 0개. です・ます 문말 `98%` WARN이나 である調 혼용은 없습니다. “順位に乗る”와 “第…項にあります”의 반복, 정형 마무리는 고칠 만하지만 5절 항목 두 개 이상 위반으로 판정하지는 않습니다.

## en — English readers

- Original: “Closure, liquidation, or adjudicated bankruptcy puts wages under six months on a first mortgage's rank.” → problem: “puts ... on a ... rank” and “a first mortgage's rank” are calques in the summary. → Suggested rewrite: “After closure, liquidation, or an adjudication of bankruptcy, wages owed under the labor contract for less than six months share the rank of claims secured by a first-priority mortgage, pledge, or lien.”
- Original: “That is the wage slice [Article 28 of the Labor Standards Act](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=28) puts on a special repayment rank when the employer has closed, entered liquidation, or been adjudicated bankrupt.” → problem: “wage slice” and “puts on a rank” sound manufactured. → Suggested rewrite: “[Article 28 of the Labor Standards Act](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=28) gives wages owed for less than six months a specified repayment rank when the employer has closed, entered liquidation, or been adjudicated bankrupt.”
- Original: “The business is still running. Late salary alone does not open this article.” → problem: the scene switches abruptly, and “open this article” is a calque. → Suggested rewrite: “If the business is still operating, late pay alone does not bring Article 28 into play.” The FAQ’s “opens the priority” needs the same treatment.
- Original: “Whether a Taiwan branch or a foreign head office did the hiring is the same definition.” → problem: the sentence lacks a natural predicate. → Suggested rewrite: “The same definition determines whether the Taiwan branch or the foreign head office was the employer.”
- Original: “A labor contract is a contract that agrees an employment relationship and has subordination.” → problem: “agrees an employment relationship” and “has subordination” read as word-for-word translation. → Suggested rewrite: “A labor contract establishes an employment relationship characterized by subordination.”
- Original: “Repayment rank sits in paragraph 1.” → problem: the abstract noun “sits” in a statutory location sounds mechanical. → Suggested rewrite: “Paragraph 1 sets out the order of repayment.”
- Original: “That floor belongs to that case.” → problem: the referent is vague and the phrase sounds translated. → Suggested rewrite: “That 60 percent floor applies only when wages are calculated by days, hours, or pieces.”
- Original: “One act comes before the advance.” → problem: a generic preview sentence delays the actual condition. → Suggested rewrite: “Before the fund advances payment, the worker must demand payment from the employer and remain unpaid.”
- Original: “The counter that receives an application, and the number of days for a decision, sit with those procedural rules.” → problem: “counter” and “sit with” are unnatural administrative English. → Suggested rewrite: “Those procedural rules also govern where applications are filed and how long decisions take.”
- Original: “Silence after that demand is the front half of the advance condition.” → problem: “front half” reduces a legal condition to an awkward metaphor. → Suggested rewrite: “The unanswered demand satisfies only the initial part of the condition for an advance.”
- Original: “On the wage side, the portion under six months enters both the proportional repayment and the fund's wage advance. Retirement pay and severance enter that rank as well, and the sum the fund advances for the two of them stops at six months of average wage. This is what happens after a demand goes unpaid.” → problem: formulaic recap; “enters” and “stops at” repeat the same abstract motion used throughout. → Suggested rewrite: “In the invented Taoyuan example, an unanswered demand could lead to a fund advance for wages owed for less than six months, which also share the proportional repayment rank. Retirement pay and severance share that rank; the fund's advance for those two claims together is capped at six months of average wage.”

Sentence variety: `cv=0.573`, short sentences `29.5%`, no checker FAIL. The closing recap misses the column-specific ending self-check, but no second unmet item was found; no MONOTONY FAIL.

## zh-hant — 台灣繁體中文讀者

- Original: “帳冊主人是受這家台中公司僱用的外籍員工，向負責人要過錢，沒有下文。” → 문제: 「帳冊主人」不像台灣人談薪資冊的說法，主語也難以辨認。 → 建議: “薪資冊記載的是這家台中公司一名外籍員工的薪資；他曾向負責人追討欠款，卻未獲回覆。” 虛構情境標示照原文保留。
- Original: “退休金也沒有付出。” → 문제: 「付出」在這裡像外語直譯。 → 建議: “退休金也尚未給付。”
- Original: “營業還在。只是薪水晚發，這條不開。” → 문제: 「營業還在」「這條不開」都不像台灣法律文章的自然說法。 → 建議: “如果公司仍在營業，單憑薪水遲發，還不符合第28條的適用要件。”
- Original: “工資債權不會先把自己的數字拿滿。” → 문제: 債權被擬人化，「自己的數字拿滿」也不自然。 → 建議: “工資債權不會先於同順位的擔保債權獲得全額清償。”
- Original: “第1項並不另行創造資遣費債權。” → 문제: 「創造債權」像英文 *create a claim* 的直譯。 → 建議: “第1項沒有另行規定資遣費的給付義務。”
- Original: “墊償前面有一個行為。” → 문제: 空泛的預告句，沒有台灣讀者需要的資訊。 → 建議: “基金墊償前，勞工須先向雇主請求給付，卻仍未獲清償。”
- Original: “2026年10月14日，這項寫的是那個範圍。” → 문제: 「那個範圍」指向不清，日期銜接生硬。 → 建議: “截至2026年10月14日，第4項只規定費率不得超過萬分之十五。”
- Original: “工資這一側，未滿六個月的部分同時進入比例受償和基金的工資墊償。退休金和資遣費也進入那個順位，基金代墊的兩者合計停在六個月平均工資。那是請求了、卻沒有拿到的時候。” → 문제: 重複用「進入／停在」搬運抽象名詞，結尾又把正文濃縮一次。 → 建議: “回到台中那名虛構的外籍員工：若向雇主請求後仍未獲清償，積欠未滿六個月的工資可依比例受償，也屬基金墊償範圍。退休金與資遣費有同一受償順位；基金墊償這兩項的合計上限是六個月平均工資。”

문장 다양성: `cv=0.564`, 짧은 문장 `28.2%`, 검사 FAIL 0개. 간체자나 뚜렷한 중국 대륙식 어휘는 발견하지 못했습니다. 정형 마무리 1건 외에 5절의 두 번째 미충족 항목은 없어 MONOTONY FAIL은 아닙니다.

VOICE ko: FIX
VOICE ja: FIX
VOICE en: FIX
VOICE zh-hant: FIX
