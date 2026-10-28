# CROSS-opusA — G2 (배우자·가족이 나를 피보험자로 든 보험)

검수자: opusA(포크). 검수 시각: 2026-10-28 09:52 KST. 초안은 고치지 않았다.
대상 SHA256:
- cc010248fbd96a493d0aaacaa50b056379dd15c4cb683bf6586adafd707282c2 ko.md
- f10cbcfac3cc3d37c49ec19174f13f998badc3e5745757588fd4483defe6eefe zh.md
- ea3213d9c20408ca549316091679d12de0745477c1ba5b31e2d9f23aeac0e172 ja.md
- 4faaa4f8d6a14f8a664852d2b9f538b230875ba8287b1ccf3fcd945a52ec1b6d en.md
- 606c281ae22dad257a6477a9b183a8d84ec83a68cba1309ceff4f1ee89780240 es.md
- 739a51e0b74155264141178b1a9df83136e2bfe67b4b82e27af9f3f7bc72dae8 images/G2-brief.txt

## 다시 확인해 문제없던 것
- 保險法 16·17·105①②③·106·110·111·112·113·134·135(準用 목록 102~105, 107, 107-1, 110~116, 123, 124, 125②), 民法 3·1122·1123, 涉外民事法律適用法 58: research/law 원문과 다섯 판 문구·항 번호 일치. 135는 다섯 판 모두 準用(en "with the necessary changes", es «con los ajustes necesarios»)으로 썼고 適用 혼동 없음.
- 河口湖 사건은 zh·en에만 나온다(ko·ja·es 없음). 中央社 202610270031(19일 富士河口湖町 飯店 遭刺身亡, 日警 楊女 逮捕, 台南地檢 初步認定 使公務員登載不實·共同殺人·詐欺取財未遂 犯罪嫌疑重大, 台南地院 26일 羈押禁見, 旅平險 最大 2筆 1000萬·2000萬)·202610270261(蔡火炎 副局長 例行記者會, 16·105, 3관문, 偵查不公開 不便說明)·TVBS 4042016 표 「李男否認犯行」과 대조 일치. 위장결혼(虛偽結婚)·本票·수익자 변경 보도는 쓰지 않음. 무죄추정 zh:23·en:21 명시. 이름 없음.
- 壽險公會 478·479·480: 조회 범위(要保人·被保險人, 有效·失效 2년 내, 會員公司 上傳 자료), 결과표 항목, 우편(申請表·證明文件·劃撥收據)/방문, 전화 조회 불가, 최장 10 工作天, 신청인 범위, 「配偶都是最近順位法定繼承人」, 債權人 불가, 保險存摺, 昏迷 시 監護·輔助 선정, 戶政 通報 뒤 보험사 주동 통지·公文 회신 — 다섯 판 일치. 수수료 금액 안 씀.
- 일본 保険法 38·45(e-Gov XML), 스페인 Ley 50/1980 art. 83(셋째 문단 «En los seguros para caso de muerte… salvo que pueda presumirse…»)·84(BOE) 원문 일치. 한국·미국 비교 없음.
- variety: ko·ja WARN만, zh·en·es OK, FAIL 0. 굵은 글씨·이모지·바이라인 0, 전화번호 없음(phone 표시는 '전화 조회 불가' 문장). 이메일·타이베이 주소(ja는 「台北市大同区承徳路一段35号7階の2（臺北市大同區承德路一段35號7樓之2）」 main 관례대로) 다섯 판 있음. published·lastmod 2026-10-28, audience, author "legal-ai-assistant"(main과 같음), featured_image "TBD", topic "family"(main에 68건) 정상.
- 링크: 외부 22개 200. 내부 /ko/columns/issues/taiwan-life-policyholder-gift-estate-tax(links.py는 MISSING이나 라이브 200), /ko/columns/taiwanese-spouse-divorce-agreement-registration, /es/columns/spain-resident-taiwan-divorce-property, /{ko,zh-hant,ja,en}/services/family, /es/services 모두 라이브 200.
- 중복: repo src/content(issues 포함)·sitemap·1021~1027·es-fr-1022·gapfill-1020·tseng-issues-*·~/tseng-issues-1028에 保險法 105조 피보험자 동의·철회를 다룬 글 없음(gapfill A6는 강제차량보험, ko issue 1016은 계약자 변경 증여세 — 질문이 다름). 이슈 루틴 TASK.md 4행이 G2 사건을 제외함.

## 지적

### 번역형 대응 (M1~M6). 1027 게이트가 summary·FAQ·변호사 단락 병렬까지 MAJOR로 잡은 유형이다. 조문 내용은 같아도 되지만, 아래는 같은 순서·같은 주제문·같은 맺음 문장이 판을 건너 문장 단위로 대응한다.

1. MUST — 철회 절이 zh·en·es에서 세 문단 연속으로 같은 문장을 쓴다(ko·ja도 일부 공유).
   - 대응: zh:49 「不必等離婚判決，也不必說明理由」 = en:43 "to wait for a divorce, or to state a reason" = es:51 «no tiene que esperar a la sentencia o al convenio de divorcio. Tampoco necesita alegar motivos.» / en:43 "What matters is that both letters arrive and that he can prove it." = es:51 «Basta con que las dos cartas lleguen y con poder demostrarlo» / en:43 "A letter to only one of them does not follow the statute." = zh:49 「只寄其中一方，就不是條文要求的方式」 = ko:47 「한 곳에만 보내면 조문이 정한 방식이 아닙니다」 = ja:47 「一方にだけ送ったのでは、条文の方式になりません」 / en:45 "Revocation ends the whole policy. If the goal is to keep the cover and change who gets paid, that has to go through the policyholder." = es:53 «La revocación termina la póliza entera. Quien quiera mantener la cobertura y solo cambiar al beneficiario necesita que lo haga el tomador.» = zh:51 「撤銷會讓整張契約終止。想保留保障、只換受益人的話…要回到要保人那一端處理」 / en:14 FAQ2 "Separation, divorce talks or simply not wanting to remain the insured person all fit within 'at any time.'" = zh:49 「分居中、正在談離婚，或只是不想再當這張保單的被保險人，都可以用」.
   - 수정: zh는 그대로 두고 en·es를 새로 쓴다. ja:47 마지막 문장은 FAQ2와 겹치므로 삭제.
     - en:43 → "Nothing in the article ties the revocation to where he lives. It fixes the form and the addressees, one written notice to the insurer and one to his wife as policyholder, and it does not make him wait for the divorce."
     - en:45 → "He should expect the policy to end, not to change. Article 105(3) treats his revocation as his wife terminating the contract, and Articles 110 and 111 give the insured person no way to keep the cover while taking her name off as beneficiary."
     - en:14 FAQ2 마지막 문장 삭제 → "Nor does the article say the insured person must still be married to, or living with, the policyholder." 로 교체.
     - es:51 → «Para quien se separa de su pareja taiwanesa, la fecha la elige el asegurado: el artículo no menciona sentencia, convenio ni causa. Conviene, eso sí, poder probar qué se envió y cuándo llegó; en Taiwán sirve para eso el 存證信函, una carta certificada de Chunghwa Post (中華郵政) que deja constancia del contenido.»
     - es:53 앞 두 문장 삭제(같은 내용이 es:14 FAQ2와 es:63 맺음에 이미 있다). 링크 문장만 남긴다. es:14 FAQ2 마지막 문장 «No hace falta esperar al divorcio ni explicar los motivos.»도 es:51과 겹치므로 삭제.

2. MUST — 수익자 절이 다섯 판 모두 110 → 111 → '피보험자에게 변경 권한 없음' → '약관은 보험사에 확인' → 113 → 112의 같은 순서다(조문 순서라면 112 → 113인데 다섯 판이 모두 113을 먼저 둔다). en·es는 문장 단위 대응.
   - 대응: en:59 "An insured person who is not the policyholder has no power in these two articles to change the beneficiary. Whether a given policy's terms also ask for the insured person's signature on a change is a question for that insurer." = es:27 «Estos dos artículos no dan al asegurado que no es tomador ninguna facultad para cambiar al beneficiario. Si las condiciones de una póliza concreta piden además la firma del asegurado para un cambio, eso hay que preguntarlo a la aseguradora.» = ja:37 끝 두 문장 = ko:41 첫·끝 문장. en:61 = es:29 = ko:43 = ja:39 = zh:59(113 → 112).
   - 수정: es(수익자가 도입 축)와 zh(繼承人 관점 문장이 붙음)는 둔다.
     - en:59 마지막 두 문장 → "That is the gap in the record search: the name that matters is in the policyholder's notice to the insurer, and the insured person has no part in it under these two articles." en:61 삭제(113·112는 다른 판에 있고 en 독자 질문과 거리가 있다). Sources의 Article 112·113 줄도 함께 삭제.
     - ko:39~43 → 41의 질문(한국 부모로 바꾸고 싶을 때)을 절 첫 문단으로 올리고, 41 끝의 약관 문장 삭제. 43 → 「수익자를 지정해 두면 그 사망보험금은 피보험자의 유산이 아니고(제112조), 아무도 지정하지 않았다면 유산이 되어 상속인에게 갑니다(제113조).」
     - ja:37 끝 「個々の保険の約款が…確かめることになります。」 삭제. ja:39 삭제하고 112를 FAQ3 답 첫 문장 뒤에 「受取人が指定されていれば、その保険金は遺産に入りません（第112条）。」로 옮긴다(Sources에 112 이미 있음).

3. MUST — 같은 예시: ko:47, ja:47, en:41이 '배우자가 요보인 겸 수익자인 종신보험의 피보험자가 별거·이혼 협의 중'이라는 같은 틀에 국적만 바꿨다.
   - 수정: en(미국으로 돌아간 뒤라는 독자 축)은 둔다.
     - ko:47 첫 문장(가상의 예) 삭제 → 「이혼 협의 중이라면 피보험자 쪽에서 쓸 수 있는 조문은 보험법 제105조 제2항입니다.」로 시작.
     - ja:47 → 「義母が要保人、夫が受益人になっている傷害保険で、日本人の妻が被保険者になっている場合（架空の例です）、撤回の書面を送る相手は保険会社と義母です。受益人である夫は、第105条第2項の通知先に入っていません。」(ja 제목·FAQ1의 義母 축과 맞고, 105② 「通知保險人及要保人」을 다른 각도에서 보여 준다. 傷害保険이면 135 準用이므로 ja:51과도 이어진다.)

4. MUST — en:31 "three entries carry the weight for the insured person: whose life is covered, the sum insured, and the beneficiary." = ko:33 「눈여겨볼 칸은 셋입니다. 피보험자 이름, 보험금액, 수익자입니다.」(같은 장치, 같은 세 항목, 같은 순서).
   - 수정: en:31 삭제(en FAQ1과 en:63이 중문 서류 문제를 이미 다룬다).

5. MUST — 105① → '두 요건 모두' → 民法3 → '배우자가 대신 쓴 동의서는 요건 미달'이 다섯 판에 같은 맺음 문장으로 들어 있고, zh·en·es는 연속 두 문단이 문장 단위로 같다.
   - 대응: zh:31 「兩個條件缺一不可。」 = en:27 "Both conditions have to be met." = es:33 «Los dos tienen que cumplirse.» / zh:33 「另一半代簽的同意書，不符合這個要求。」 = en:29 "A form your spouse signed in your name does not meet that test." = es:35 «Un formulario en chino firmado por la pareja con el nombre de usted no cumple ese requisito.» = ko:31 = ja:29.
   - 수정: zh·ko는 둔다. en:27 "Both conditions have to be met." 삭제, en:29 마지막 문장 삭제(en FAQ1 "The signature has to be your own"이 같은 말을 한다). es:33 «Los dos tienen que cumplirse.» 삭제, es:35 마지막 문장 삭제. ja:29 마지막 문장 삭제.

6. MUST — 사건 계기 두 문단이 zh·en에서 같은 순서·같은 장치다: 사건 사실 → TVBS 부인 → 무죄추정 → 「同一天」/"On the same day" 金管會 副局長 → 16·105 → 偵查不公開 → 독자로 넘어가는 다리 문장(zh:25 「下面談的是這兩條條文落到一般家庭時…」 = en:23 "Those two articles matter to anyone in Taiwan whose spouse or in-laws want a policy on their life.").
   - 수정: zh는 둔다. en:23 삭제, FSC 발언은 en:37로 합친다.
     - en:21 뒤 새 다리 문장(en:23 자리) → "Behind the case sits a rule that applies to every family in Taiwan: a death policy on someone else's life needs that person's written consent."
     - en:37 → "Insurers also run their own checks. Asked on October 27 how the system guards against insurance fraud, the Financial Supervisory Commission's Insurance Bureau [cited](https://www.cna.com.tw/news/afe/202610270261.aspx) Articles 16 and 105 and described the underwriting step: the insurer queries an industry reporting system for the cover the insured person already holds with other companies and with the same company, and above certain amounts it reviews whether the cover fits the applicant's finances. The deputy director-general who spoke declined to discuss the policies in this case, citing the confidentiality of the investigation."

### 사실·정확성

7. MUST — 대만 사실이 판마다 다르다: ko:27은 상해보험 準用을 '상해보험으로 짜여 있다면 피보험자의 서면 동의가 필요'로 써서, 다른 네 판(zh:41 「第三人投保、含身故給付的傷害保險」, ja:51 「第三者が死亡給付付きで掛けるなら」, en:49 "with a death benefit and someone else takes it out on you", es:43 «con prestación por fallecimiento y contratado por otra persona»)과 facts.md('사망 보험금이 붙은 상해보험이라면 조건문으로만')의 조건이 빠졌다.
   - 수정: ko:27 끝 → 「…여행 중 사고를 보장하는 상품이라도 사망 보험금이 붙은 상해보험으로 짜여 있고 다른 사람이 계약자라면 피보험자의 서면 동의가 필요합니다.」

8. MUST — ja의 일본 법 비교가 원문보다 좁거나 부정확하다(본국 법 비교 정확성).
   - ja:43: 日本 保険法 58条1項에는 3号 「保険契約者と被保険者との間の親族関係の終了その他の事情により、被保険者が第三十八条の同意をするに当たって基礎とした事情が著しく変更した場合」가 있다(research/web/G2-egov-hokenho.xml). 이혼·별거를 다루는 ja판에서 가장 가까운 대응 조항인데 2号만 쓰고 「など」로 넘겼다. 수정: ja:43 둘째 문장 → 「保険契約者や受取人への信頼を損ない、契約の存続を困難にする重大な事由があるときのほか、保険契約者と被保険者の親族関係の終了その他の事情で、第38条の同意の基礎とした事情が著しく変わったときも含まれます（同条第1項第3号）。離婚による親族関係の終了は、この第3号に書かれています。」
   - ja:51: 67条 단서는 「被保険者（被保険者の死亡に関する保険給付にあっては、被保険者又はその相続人）が保険金受取人である場合」이고, 2項은 「給付事由が傷害疾病による死亡のみである傷害疾病定額保険契約については、適用しない」. ja:51은 '被保険者やその相続人が受取人である場合を除外'으로 뭉뚱그리고 2項을 뺐다. 旅行 사망 보험을 다루는 절이라 2項이 직접 관련된다. 수정: ja:51 첫 문장 → 「傷害疾病定額保険について、日本の保険法第67条は被保険者の同意を求めつつ、被保険者（死亡給付については被保険者またはその相続人）が受取人である場合を除いています。ただし、給付事由が傷害疾病による死亡だけの契約には、この例外は使えません（同条第2項）。」

9. (철회, opusA 본인 확인 09:55) — 포크 초안의 'alt·brief가 실물과 다르다' 지적은 철회한다. 위 SHA의 현재 판(09:48:55 opusB 수정본) 다섯 판 13행 alt와 images/G2-brief.txt는 이미 실물(식탁, 종이 몇 장을 끼운 갈색/크라프트 서류철, 만년필, 작은 접시의 금반지 두 개, 커피 머그 두 개, 창밖 흐린 도시 불빛, 사람·로고·읽히는 글자 없음)과 맞다. 고칠 것 없음.

### 권고

10. SHOULD — zh:21~23: 첫 질문(「要保書上被保險人欄位的簽名，是你自己簽的嗎？」) 바로 뒤의 「這個問題這幾天被河口湖命案推到眼前」은 이 사건에서 서명 위조가 문제 된 것처럼 읽힐 수 있다. 보도에는 서명 관련 사실이 없다(金管會가 105조를 일반론으로 언급했을 뿐). G2 게이트 규칙('보도에 없는 세부 = MAJOR') 위험. 수정: zh:23 첫 문장 → 「河口湖命案發生後，被保險人書面同意這條規定也被拿出來討論。」
11. SHOULD — en:21 "Prosecutors in Tainan say the husband is strongly suspected…": 원문은 「初步認定」. → "Prosecutors in Tainan say their initial finding is that the husband is strongly suspected of offences including joint homicide and attempted fraud".
12. SHOULD — en:53 "The application forms are in Chinese.": 479는 서식 이름만 확인되고 서식 내용은 안 열었다. 확인하지 않았다면 삭제.
13. SHOULD — zh:37 「債務人親筆的同意」: 民法3②은 蓋章도 서명과 같다고 하므로(zh:33에서 직접 설명) '親筆'은 좁다. → 「債務人本人簽名或蓋章的書面同意」.
14. SHOULD — ko:4 summary 첫 문장(「…내 서면 동의와 보험금액 약정이 함께 있어야 하고, 하나라도 없으면 계약은 무효입니다」)이 ja:4 첫 문장(「…被保険者の書面による同意と保険金額の約定がそろわなければ契約は無効です」)과 같다. 둘째 문장부터는 달라 MAJOR까지는 아니지만, ko는 이혼 축으로 시작하면 겹침이 사라진다: 「대만에서 배우자가 나를 피보험자로 든 사망보험은, 이혼이 끝나기 전이라도 보험사와 계약자 두 곳에 서면으로 알려 동의를 철회하면 계약자가 계약을 끝낸 것으로 봅니다.」로 시작하고 무효 요건 문장을 그 뒤로.
15. SHOULD — 조회 절 ko:55~59, ja:55~57, es:57~59가 같은 순서(범위 → 결과표 → 방법 → 전화 불가 → 10근무일 → 신청인 → 배우자)로 문단 단위 대응한다. 공회 안내문 순서를 따른 공통 뼈대라 1027 게이트가 허용한 유형이지만, es는 신청인·배우자 문장을 먼저 두고(별거·사망 상황의 독자), 방법을 뒤로 돌리면 안전하다.
16. SHOULD — 변호사 단락 en:63 ↔ es:61이 같은 항목 순서(중문 철회서·存證信函 → 서명 사본 → 이혼 합의/상속 청구)다. es는 상속인 조회·청구나 별거 합의부터 시작하도록 순서를 바꾼다.
17. SHOULD — zh:79·en:73 TVBS 제목이 줄여 적혔다. 원제 「河口湖命案懶人包》丈夫涉殺人詐保遭羈押、最新時間軸與疑點整理」(2026-10-27). 출처 목록은 원제로.

MUST 8건(번역형 6, 사실 일치 1, 일본 법 비교 1), SHOULD 8건. (9번 alt·brief 지적은 철회 — 09:48 수정본이 실물과 일치)
