# C6 문체 검수 — GPT-6 Sol

범위: 원어민 독자에게 들리는 문체·번역투·구성만 검토했습니다. 아래 수정안은 뜻과 사실을 유지하는 문장 제안이며, 법률 내용이나 출처의 적정성을 판정하지 않습니다. 문장 다양성 검사에서는 네 파일 모두 FAIL 0개였습니다(ko·ja는 어미 반복 WARN만 표시). 5절 자기 점검에서도 어느 언어도 2개 이상의 미충족 항목이 확인되지 않아 `MONOTONY` 판정은 없습니다.

## ko — FIX

- 원문 `겨울방학과 여름방학을 뺀 기간에, 공립이거나 이미 인가된 사립 대학·전문대학의 외국인 유학생을 고용할 때의 상한이지요.` → 문제: 문두의 긴 수식어 뒤에 “상한이지요”가 매달려 번역문처럼 읽히고, 본문의 합니다체에서 어조가 튑니다. → 수정안 `공립 대학·전문대학이나 인가된 사립 대학·전문대학의 외국인 유학생에게는 겨울·여름방학을 제외하고 주 20시간의 근로 상한이 적용됩니다.` (학교 범위·방학 예외·20시간 보존)
- 원문 `타이베이 대학 부설 어학당의 한국인 학생이 학교 앞 카페 주말 시프트를 제안받았습니다.` → 문제: “주말 시프트”는 영어를 그대로 옮긴 말투입니다. → 수정안 `타이베이의 대학 부설 어학당에 다니는 한국인 학생이 학교 앞 카페에서 주말 근무를 제안받았습니다.` (가상 사례의 장소·학생·제안 보존; 뒤의 가상 표시 유지)
- 원문 `학교의 제2호 인정이 없으면 제1항은 열리지 않습니다.` → 문제: 조문이 “열린다”는 은유가 한국어 법률 안내에 어색합니다. → 수정안 `학교가 제2호에 따른 사실을 인정하지 않았다면 제1항의 요건을 충족하지 못합니다.` (학교 인정 요건 보존)
- 원문 `제2항은 시간의 다른 숫자를 적지 않습니다.` → 문제: “시간의 다른 숫자”는 중국어식 명사 연결입니다. → 수정안 `제2항은 별도의 주당 근로시간을 정하지 않습니다.` (별도 시간 규정이 없다는 뜻 보존)
- 원문 `영수증은 원본입니다.` → 문제: 앞 문장의 “영수증 원본”을 거의 그대로 반복해 기계적인 짧은 문장으로 보입니다. → 수정안 `제53조는 영수증 원본을 요구합니다.` (원본 요건 보존; 뒤의 전산 입력 시 원본 첨부 예외도 유지)
- 원문 `온라인 신청은 [관리방법 제7조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=7)입니다.` → 문제: 신청이 조문 “이다”라는 연결은 직역투입니다. → 수정안 `온라인 신청 방식은 [관리방법 제7조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=7)에 규정돼 있습니다.` (조문 링크 보존)
- 원문 `외교거류증은 이 조의 취업허가가 아닙니다.` → 문제: “외교거류증”은 앞뒤 문맥의 외국인 학생 거류증을 가리키는 말로 읽히지 않아 한국어 독자를 멈추게 합니다. → 수정안 `외국인거류증은 이 조에 따른 취업허가를 대신하지 않습니다.` (거류증과 취업허가의 구별 보존; 증명서의 정확한 한국어 명칭은 원어와 대조 필요)
- 원문 `카페 시프트의 날짜와 학생 신분은 호정(昊鼎)국제법률사무소 wei@hoveringlaw.com.tw 로 적어 두면 됩니다. 방학을 뺀 주는 20시간, 허가의 최장은 1년입니다.` → 문제: “시프트”와 “이메일로 적어 두면”이 어색하고, 맺음말이 문의 유도 뒤 도입부의 숫자를 다시 읊는 정형 문장입니다. → 수정안 `카페 근무 예정일과 학생 신분에 관해 문의하려면 호정(昊鼎)국제법률사무소(wei@hoveringlaw.com.tw)에 이메일을 보낼 수 있습니다. 방학을 제외한 주당 상한은 20시간이고 취업허가 기간은 최장 1년입니다.` (연락처·20시간·1년 보존; 가능하면 마지막 사실 문장을 해당 설명 문단으로 옮겨 반복을 줄일 것)

## ja — FIX

- 원문 `学生の路線では、本人が書類を出します。居留証は、その就労許可の紙ではありません。` → 문제: 「路線」「許可の紙」는 일본어 법률 안내보다 다른 언어를 직역한 느낌이 강합니다. → 수정안 `留学生の場合、就労許可は学生本人が申請します。居留証は就労許可証の代わりにはなりません。` (신청 주체·증서 구별 보존)
- 원문 `[第2条](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=H0110001&flno=2)の一つの筋は` → 문제: 「一つの筋」는 자격 요건의 한 유형을 설명하는 일본어로 부자연스럽습니다. → 수정안 `[第2条](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=H0110001&flno=2)に定める対象の一つは` (제2조의 한 유형·조문 링크·이어지는 국적·이력·배정 조건 유지)
- 원문 `今回開いた条文には、お金の有無で仕事を分ける文がありません。` → 문제: 「今回開いた」「文がありません」은 조사 메모를 직역한 듯합니다. → 수정안 `ここで確認した条文は、報酬の有無だけで仕事に当たるかどうかを区別していません。` (검토한 조문 범위와 유급·무급의 불확실성 보존)
- 원문 `始める前に、学校の国際担当か[労働部労働力発展署](https://ezworktaiwan.wda.gov.tw/cp.aspx?n=99329239A3FBA2BB)へ、その仕事そのものを聞きます。` → 문제: 「その仕事そのものを聞きます」의 목적어와 동사가 맞지 않습니다. → 수정안 `始める前に、その家庭教師の仕事が許可を要するか、学校の国際担当窓口か[労働部労働力発展署](https://ezworktaiwan.wda.gov.tw/cp.aspx?n=99329239A3FBA2BB)に確認します。` (시작 전 확인·문의처·해당 일의 범위 보존)
- 원문 `第2項は、週の時間の別の数字を書きません。` → 문제: 「週の時間の別の数字」는 번역투이고 조문 설명이 잇달아 「書く」로 끝납니다. → 수정안 `第2項に、別の週当たり労働時間の上限は定められていません。` (별도 숫자가 없다는 뜻 보존)
- 원문 `休暇中の別の時間数は、二つの条文が置いていません。` → 문제: 조문이 숫자를 「置く」라는 표현은 일본어 독자에게 어색합니다. → 수정안 `この二つの条文は、冬休み・夏休み中の別の時間数を定めていません。` (두 조문·방학·별도 시간수 보존)
- 원문 `原本です。` → 문제: 바로 앞의 「領収書原本」을 반복하는 고립된 한 문장입니다. → 수정안 `第53条は領収書の原本を求めています。` (원본 요건 보존; 뒤의 전산 입력 시 첨부 생략과 재제출 가능성 유지)
- 원문 `日本、韓国、米国の学生の就労ルールは、この文章が定めません。` → 문제: 글이 다른 나라의 규칙을 “정한다”는 동사 선택이 부자연스럽고 범위 고지처럼 튀어나옵니다. → 수정안 `ここで扱うのは台湾の制度で、日本・韓国・米国の学生の就労ルールは対象に含めていません。` (범위 제한 보존)
- 원문 `家庭教師の曜日と在学の状態は、昊鼎国際法律事務所の wei@hoveringlaw.com.tw へ書けます。休みを除いた週は20時間、許可の最長は1年です。` → 문제: 「曜日と在学の状態を書く」는 사무소 문의 문장으로 어색하고, 마지막 숫자 요약은 도입부를 기계적으로 되풀이합니다. → 수정안 `家庭教師を始める曜日や在学状況について相談する場合は、昊鼎国際法律事務所（wei@hoveringlaw.com.tw）にメールで問い合わせられます。冬休み・夏休みを除く週の上限は20時間、許可の有効期間は最長1年です。` (문의처·방학 예외·20시간·1년 보존; 가능하면 마지막 수치 문장을 본문 해당 절로 옮길 것)

## en — FIX

- Original `The mix-up starts with the alien resident certificate.` → problem: Invents a reader's mistake as a generic hook; the next sentence already supplies the concrete distinction. → suggested rewrite `An alien resident certificate does not authorize a foreign student to work.` (certificate and work authorization distinction preserved)
- Original `Fetched articles do not sort work by whether money changes hands.` → problem: “Fetched articles” sounds like a research log, and “sort work” is not idiomatic here. → suggested rewrite `The provisions cited here do not say that payment alone determines whether an activity counts as work.` (limited scope and unpaid-work uncertainty preserved)
- Original `Tuesday's lessons sit against those conditions.` → problem: “Sit against” is an unnatural calque for applying the rules to the invented example. → suggested rewrite `Those conditions also matter to the proposed Tuesday lessons.` (the hypothetical lesson and conditions preserved)
- Original `No new weekly number is written there.` → problem: Compressed, mechanical phrasing makes the reader work out the referent. → suggested rewrite `Paragraph 2 does not set a different weekly hour limit.` (paragraph and absence of a separate limit preserved)
- Original `That foreigner applies.` → problem: Staccato repetition of the preceding sentence and an impersonal “that foreigner” where the student is the subject. → suggested rewrite `The student applies for this permit personally.` (applicant preserved)
- Original `The receipt is an original.` → problem: Repeats “original fee receipt” from the previous sentence and reads like a literal translation. → suggested rewrite `Article 53 requires the original receipt.` (original-receipt requirement preserved; keep the subsequent online-filing exception)
- Original `Professional hires, the [Employment Gold Card](/en/columns/taiwan-employment-gold-card), and [hiring without a local entity](/en/columns/hiring-in-taiwan-without-local-entity-eor-pe-work-permits) sit outside this category-4 file.` → problem: “Sit outside this file” is office shorthand, not reader-facing English. → suggested rewrite `Category 4 here does not cover professional hires, the [Employment Gold Card](/en/columns/taiwan-employment-gold-card), or [hiring without a local entity](/en/columns/hiring-in-taiwan-without-local-entity-eor-pe-work-permits).` (all exclusions and links preserved)
- Original `Student-work rules in the United States, Korea, and Japan are outside this column. Within the United States they are not one state rule.` → problem: The second sentence is an abrupt aside and “not one state rule” is unidiomatic. → suggested rewrite `This column covers Taiwan; it does not address student-work rules in the United States, Korea, or Japan, including differences among U.S. states.` (country scope and state variation preserved)
- Original `Tuesday's rate and the enrollment letter can go to Hovering International Law Firm at wei@hoveringlaw.com.tw. Outside the long breaks the week is still twenty hours. The permit still ends at one year.` → problem: The email sentence has an unnatural subject, “long breaks” is vague, and the repeated clipped summary sounds templated. “Ends at one year” also reads as a fixed expiry rather than a maximum. → suggested rewrite `For a question about Tuesday's proposed pay and the student's enrollment letter, contact Hovering International Law Firm at wei@hoveringlaw.com.tw. Outside winter and summer vacation, the weekly cap is twenty hours; a permit may last up to one year.` (hypothetical details, contact, vacation exception, cap, and maximum preserved; move the repeated figures into the relevant section if restructuring)

## zh-hant — FIX

- 原文 `不滿六個月就還沒有這一款；滿了六個月，仍要有同項第2款經學校認定的事實。` → 문제: FAQ의 「還沒有這一款」은 조문이 없다는 뜻처럼 들리고, 직역한 문장 구조입니다. → 수정안 `語文課程未滿六個月，尚未符合第51條第1項第1款的條件；滿六個月後，仍須符合同項第2款的學校認定要件。` (6개월·제1款·제2款의 학교 인정 보존)
- 원문 `這次讀到的條文，沒有用有沒有領錢來劃分。` → 문제: 「這次讀到的」는 자료 수집 메모 같고, 무엇을 구분하는지 빠져 있습니다. → 수정안 `這裡引用的條文，沒有單憑是否領取報酬來區分哪些活動屬於工作。` (인용한 조문 범위·무급 활동의 불확실성 보존)
- 원문 `本法第50條第2款的僑生、華裔學生，由[管理辦法第52條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=52)接到僑生回國就學及輔導辦法、香港澳門居民來臺就學辦法，以及僑務主管機關舉辦的技術訓練班。` → 문제: 법 조항을 다른 규정에 「接到」라고 하는 것은 어색한 번역투입니다. → 수정안 `至於本法第50條第2款的僑生及華裔學生，[管理辦法第52條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=52)分別援引僑生回國就學及輔導辦法、香港澳門居民來臺就學辦法，以及僑務主管機關舉辦的技術訓練班。` (대상·세 근거·링크 보존)
- 원문 `學校沒有做出第2款的認定，第1項就不打開。` → 문제: 「第1項就不打開」는 조문 적용을 물리적 동작처럼 말하는 직역투입니다. → 수정안 `即使讀滿六個月，學校若未作出第2款要求的認定，仍不符合第1項的條件。` (6개월·학교 인정·제1항 조건 보존)
- 원문 `收據是正本。` → 문제: 바로 앞의 「審查費收據正本」을 고립된 짧은 문장으로 되풀이합니다. → 수정안 `第53條要求檢附審查費收據正本。` (원본 요건 보존; 뒤의 전산 입력 후 첨부 예외 유지)
- 원문 `[第54條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=54)第1項把有效期間的上限寫死。` → 문제: 「寫死」는 대만 구어에서는 쓰이지만 법률사무소 칼럼의 차분한 문체와 어긋납니다. → 수정안 `[第54條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=54)第1項將工作許可的有效期間上限定為一年。` (조항·링크·유효기간·1년 보존)
- 원문 `[第36條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=36)第2項第4款用得，把強制驅逐、限令出國，以及逾期未出國再驅逐，交給移民署。` → 문제: 「用得」는 문법상 끊긴 표현이고, 「交給」도 권한 설명으로 어색합니다. → 수정안 `[第36條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=36)第2項第4款規定，移民署得強制驅逐出國，也得限令十日內出國；逾期未出國者，得再予強制驅逐。` (得의 재량·강제 출국·10일 기한·기한 초과 시 조치 보존; 바로 뒤의 10일 문장은 합칠 것)
- 원문 `班表的日期和學生身分，可以寄到昊鼎國際法律事務所 wei@hoveringlaw.com.tw。寒暑假以外每週仍是二十小時，許可最長一年。` → 문제: 날짜와 신분을 「寄到」 하는 목적어 연결이 어색하고, 문의 유도 후 도입부의 숫자로 끝나는 방식이 정형적입니다. → 수정안 `若要詢問排班日期與學生身分是否符合規定，可寄信至昊鼎國際法律事務所（wei@hoveringlaw.com.tw）。寒暑假以外的每週工作上限仍為二十小時，工作許可有效期間最長一年。` (문의처·방학 예외·20시간·1년 보존; 가능하면 마지막 사실 문장을 본문 해당 절로 옮길 것)

VOICE ko: FIX
VOICE ja: FIX
VOICE en: FIX
VOICE zh-hant: FIX
