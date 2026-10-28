# CROSS-opusA — G4 物損 사고·수리비 (작성 opusB)

검수자: opusA(교차 검수, 작성 세션과 별개 주제). 시각: 2026-10-28 09:55 KST. 초안은 고치지 않았다.
대상 SHA256:
- ko.md 4a7ca93e50adba86ca005eac037d6784b71371b8c8a2f48a32ac2146c7628f74
- zh.md bb64df24f08e0b06d4e069b28cbbb3487e264937147d5e6f9e499b93a826e4ab
- ja.md 8129730f6c59ee8bf64304c371d52538f072b42093f329cda7ed5632cad705cd
- en.md 3eebb15b85dd1af3defd2a7f8a2df8e285d811b343dfd70507572ba0acdeed68
- es.md 2104cf395a973b28ad49efe2da1c820fa62c2aa21ee1de959a92bdb97731012f

## 다시 확인해 문제없던 것
- 조문(research/law 원문 대조): 道路交通事故處理辦法 3①1·①4·①5·②, 4(100/80/50/30/5m·우천·다방향), 9①9(G4-lawall-D0080090.html, 113.02.17 修正), 10③(7일 補製), 13(現場 登記聯單·7일 現場圖·照片·30일 初判表) / 處罰條例 62①(1,000~3,000, 逃逸 吊扣 1~3월)·62②(600~1,800, 駕駛人) / 保險法 53①②·58(5일)·93(但書 포함)·94①②·95 / 強制汽車責任保險法 13 / 民法 184①②·191-2·196·197①·213①③·216·217① / 民訴 436-8①④. 다섯 판의 번호·항·款·금액·기간이 원문과 맞다. 適用/準用 혼동 없음.
- 판결(~/tseng-columns-1021/research/fjud 사본, sha256 앞자리 b6304d78e2=a705a49b…, a0dc8f48f6=41093f40…, c4ccc6f4be=f6a4d3e8…): 桃園 114小上37(114.9.30, 「本判決不得上訴」, 112.2.21 18:40 中美醫院 停車場, 右後保險桿→右前保險桿, 112.4.15 입고=53일, 52,089 청구, 1심 전액, 당일 晚間 通訊軟體 사진, 「左前」 2항목 13,335·4,001+營業稅 제외 → 33,887, 無更換零件 → 無折舊, 184①前段·191-2·213①③) / 基隆 基小952(114.6.18 1심 小額, 一造辯論, 51,894=工資16,960+零件34,934, 108.6 出廠→4년11월11일, 耐用年數 5년, 定率 0.369, 殘值 3,494, 認容 20,454, 53① 債權移轉 한도, 소유자 黃進益≠운전자 黃彥傑) / 基隆 小上27 裁定(114.9.23, 上訴不合法 駁回, 「本件裁定不得抗告」). 심급·확정·숫자 다섯 판 일치.
- Taipei Times 10/28(research/web/G4-taipeitimes.html): 吳東凌 직함, 인용문 문구, 「secondary collisions … six such incidents reported in August」 그대로. en판에만 나온다(ko·zh·ja·es에 계기 없음).
- 일본 道路交通法 72①(e-Gov XML): 「損壊した物及びその損壊の程度」 보고 의무 인용 정확(ja:23, 단 ja:61은 아래 9).
- 형식: tags 다섯 판 모두 "traffic-accidents"+좁은 분류(FRONTMATTER 116행 충족), published/lastmod 2026-10-28, audience, featured_image "TBD", author "legal-ai-assistant"(main 952~957과 같음), zh categories 「台灣車禍法律」(main zh 교통 칼럼 28건과 같음), 굵은 글씨·이모지·바이라인·전화번호 0, 이메일·타이베이 주소(ja는 1027 main 관례 「台北市大同区承徳路一段35号7階の2（…）」) 있음, en "English-speaking lawyer in Taipei" 있음.
- variety: ko·zh·ja·en(variety_metrics.py)·es(variety_metrics_es.py --lang es) FAIL 0(ko 어미 WARN만).
- 링크: tools/links.py 외부 25개 중 judicial.gov.tw 3개만 000(오늘 사이트 불통, 같은 URL이 라이브 642 출처에 있음). 내부 링크 MISSING 표시 3개(/ko·/ja·/en/columns/taiwan-small-claims-appeal-from-abroad-deadline-violation-of-law)와 services/civil 4개는 curl로 라이브 200 확인.
- 중복: 003(Q1 한 문단에 이동 규정), 050(경찰 자료 신청), 051(좌회전 과실·53조 대위), 079, zh 081·086·189(링크로 넘김), 642(같은 두 판결을 '상소 절차'로 씀), 1021~1027 drafts, ~/tseng-issues-1028(TASK 4행에서 영어권 1번 物損 사전 제외)과 독자 질문이 겹치지 않는다.

## 지적

### 1. MUST(MAJOR급) — en판이 ko판을 절 순서만 바꿔 옮긴 것처럼 읽힌다(번역 금지)
두 판의 절 흐름이 [桃園 사진 ↔ 이동 규정] 두 절만 자리를 바꾸고 나머지(과실 → 경찰/화해 → 보험·952 → 시효·소액)는 같은 순서다. 그 안에서 문장 단위 대응이 네 군데다.
- (a) 규정·과태료: ko:35→37→39 = en:27→29→31. 내부 순서 3①4+3② → 62②(600~1,800) → 62①(1,000~3,000·吊扣) → 9①9 → 3①1 → 4조 거리 → 우천이 같고, 주제문도 같다(ko:37 「옮기지 않으면 과태료(罰鍰)가 있습니다.」 = en:29 "Ignoring this costs money."). self-G4 비교표 '규정 문단 내부 순서'에도 ko와 en이 같다고 적혀 있다.
- (b) 桃園 재서술: ko:25~29 = en:37~39. 고른 사실과 순서가 같다(병원 주차장 후진 → 「가해 측: 함께 보고 경찰 부르고 이의 없이 헤어짐」 = "By the reversing driver's account, both sides looked, called the police and parted without objection" → 53일·타이중·52,089 → 계속 탔으니 무관 → 당일 밤 메신저 사진·위치 일치 → 경미·다른 사고 없음·지연만으로 부정 못 함 → 「사고 장소 근처 정비소에서 고쳐야 한다는 규정도 없다」 = "Nothing required the owner to use a shop near the crash site" → 왼쪽 펜더 제외 → 33,887).
- (c) 과실: ko:41 = en:43(191-2 → 217① → 마지막 문장 「…진행 방향과 충돌 각도를 보여 줄 수 있는 것이 사진과 블랙박스 영상뿐인 경우가 많습니다」 = "Which lane each car was in, and at what angle they met, usually has to be proved from photos and dashcam footage…").
- (d) 경찰/화해: ko:45~49 = en:47~51(「…원칙입니다. …예외입니다. 연락처와 합의 내용만 주고받고 헤어져도 신고 의무 위반은 아니라는 뜻입니다.」 = "…is the default. There is one exception… Swapping contact details and agreeing on an amount, then driving away, does not breach the reporting rule." → 「그렇다면 경찰을 부르지 않아 잃는 것은 무엇일까요?」 = "What do you give up?" → 13조 서류 → 050 링크 → 10③).
수정: ko는 桃園을 중심 예시로 두고 유지한다. en은 도입(교통부 국장의 '찍고 옮긴 뒤 신고하라')의 축으로 다시 쓴다.
- en:29 삭제. 62②·9①9는 en FAQ1에 이미 있다. FAQ1 답 끝에 "Failing to handle a no-injury crash as the rules require is a separate fine of NT$1,000 to NT$3,000, and driving off adds a one- to three-month license suspension (Article 62(1))."를 붙인다.
- en:37~39를 결과부터 세 문장 안팎으로 줄인다. 예: "The Taoyuan District Court had a parking-lot scrape in front of it that was not repaired until 53 days later (114 Hsiao-Shang No. 37, September 30, 2025, final). Photos sent by messaging app that evening showed the right front bumper and fender damaged where both drivers said the cars had touched; with no sign of another accident in between, the delay did not break the link. Two items for the left front fender were not in those photos, and the NT$52,089 claim became an NT$33,887 award."
- en:43 마지막 문장 삭제(사진 논점은 en:35에 있다).
- en:47~51은 보험사부터 쓴다. 93조(+但書)·58조 → 3①5 예외 → 13조 서류 순서로 바꾸고, "What do you give up? Police paperwork."와 "Swapping contact details…" 문장은 없앤다.

### 2. MUST(MAJOR급) — '경찰 없이 화해' 단락이 ko·zh·en 세 판에서 같은 세 문장이다(ja·es 일부 포함)
ko:45 = zh:45 「報警並配合調查是原則。無人受傷或死亡、雙方當場自行和解的，不在此限。換句話說，交換聯絡方式、談好金額就離開，並沒有違反通知警察的規定。」 = en:47. 다음 단락도 ko:47 = zh:47(「代價是警方資料。」) = en:49 = ja:35 = es:51이다. 모두 13조 서류 셋을 나열한 뒤 050 칼럼 링크를 단다. ja는 같은 13조 문장을 본문 ja:35와 FAQ1 답에 두 번 쓴다.
수정: zh는 대만 독자에게 핵심이므로 유지한다. 1번대로 en을 고친다. ko는 FAQ1이 3①5를 이미 다루므로 ko:45~47을 한 단락으로 줄인다. 예: 「다친 사람이 없고 그 자리에서 화해했다면 경찰을 부르지 않아도 신고 의무 위반은 아닙니다(처리판법 제3조 제1항 제5호). 다만 그 경우 현장에서 받는 당사자 등록연락서도, 나중에 신청할 현장도와 초보분석판정표도 생기지 않습니다(제13조).」 그 뒤에 050 링크와 10③을 붙이고, 수사 의문문 「그렇다면 … 무엇일까요?」는 뺀다. ja FAQ1 답의 첫 문장(13조 나열)은 「警察が処理していない事故には、警察の資料がありません（本文と同じく処理弁法第13条）。」 정도로 줄이고, 둘째 문장(직접 남길 기록)을 중심으로 쓴다.

### 3. MUST(MINOR급) — 사진 목록이 ko·es·zh 세 곳에서 같은 세 항목·같은 순서다
ko:31 「두 차가 멈춘 자리와 차선의 관계, 부딪힌 부위의 근접 사진, 노면에 떨어진 파편이 같은 날짜로」 = es:29 «dónde quedaron los coches respecto a las líneas del carril, los primeros planos del golpe y los restos en el asfalto, todas del mismo día» = zh FAQ1 「兩車停止位置與車道標線關係的遠景、撞擊部位的近照，以及地上的碎片與刮痕」.
수정: zh FAQ1(질문 자체가 標繪 사진 범위)만 유지한다. ko:31은 桃園에 묶어 다시 쓴다. 예: 「이 사건에서 결과를 가른 것은 사진이 몇 장이었는지가 아니라 어디를 찍었는지였습니다. 그날 밤 사진에는 오른쪽 앞이 있었고 왼쪽 펜더는 없었습니다.」 es:29는 도입 장면에 맞춰 바꾸거나 지운다. 예: «En la escena del aparcamiento de Kaohsiung, la foto que más pesará después es la que muestra dónde quedó cada coche antes de moverlo.»

### 4. MUST(MINOR급) — 952 뒤의 216조 문장이 네 판에서 같은 자리·같은 문장이다
ko:57 「수리 기간의 렌트비나 수리 뒤의 시세 하락을 더 청구하려면, 그 손해가 실제로 생겼다는 것을 따로 증명하게 됩니다」 = ja:47 = en:59 = es:47. 네 판 모두 952 계산 바로 뒤에 놓였다. 「공임은 감가하지 않음」도 ko:57·en:57("labor was not")·es:43·ja FAQ2에 같은 자리로 붙어 있다.
수정: ko는 유지한다. ja:47은 삭제하고 FAQ2 답 끝으로 옮긴다(「代車費用や評価額の下落は、別の損害として実際に生じたことを示す必要があります（民法第216条）。」). en:59는 FAQ2 답 끝으로 옮긴다("A rental car or lost resale value is a separate loss you would have to prove (Civil Code Article 216)."). es:47 둘째 문장은 'Si el coche es de otra persona' 절로 옮겨, 차를 빌려준 소유자가 차를 쓰지 못한 손해를 청구할 때 증명할 것으로 바꿔 쓴다.

### 5. MUST(MAJOR급) — 변호사 문단이 같은 항목을 같은 순서로 나열한다
zh:77·ja:59·es:59는 [청구·견적 대조 → 대위 소송 답변(감가·수리 항목·과실상계) → 현장 화해서·메시지 검토 → 경찰 자료 → 소액소송]으로 순서가 거의 같다. zh 「就折舊、修理項目與與有過失答辯」 = es «discutiendo la depreciación, las partidas del presupuesto y la culpa concurrente» = en:67 "contesting depreciation, repair items and comparative fault"로 같은 세 낱말 묶음이다. ko:63과 en:67은 둘 다 「현장 화해 문구·메신저가 무엇을 인정했는지」로 시작한다. 1027 게이트는 변호사 문장 병렬을 MAJOR로 잡았다(1026 G1 지적 유형).
수정: zh는 유지한다.
- ja는 귀국 일정을 축으로 쓴다. 예: 「帰国の日が決まっているなら、その前に台湾の弁護士に頼めるのは、警察資料（現場図・初歩分析研判表）の申請と、その場で書いた和解書やメッセージが何を認めたことになるかの確認です。日本に戻ったあとも、委任状があれば、見積書と事故当日の写真の照合、少額訴訟の提起、保険会社からの代位請求への応訴を任せられます。」
- es는 빌린 차·회사 차를 축으로 쓴다. 예: «Si el coche era prestado, alquilado o de la empresa, lo primero que puede aclarar un abogado en Taiwán es quién figura como propietario y quién como asegurado, porque de eso depende quién reclama y si la aseguradora puede dirigirse contra usted (artículo 53, apartado 2).» 뒤의 서류·소송은 다른 순서와 낱말로 쓴다.
- en은 세 낱말 묶음을 바꾸고 시작점도 바꾼다. 예: 경찰 자료 신청부터 시작하고, 대위 소송은 "where the depreciation of replaced parts is usually the first number to test"로 쓴다.

### 6. MUST(MAJOR급) — summary 첫 문장이 ko·zh·en·es에서 같은 명제·같은 순서다
네 판 모두 [다친 사람 없음·주행 가능 → 위치·흔적을 사진/영상으로 기록 → 통행 방해 없는 곳으로 이동]으로 시작한다. zh·en·es는 같은 문장에 600~1,800(zh '最高1,800') 벌금까지 붙인다(ko:4, zh:4, en:4, es:4). 1027 게이트는 summary 병렬을 MAJOR로 잡았다(1027 G3 지적 1·2). self-G4도 이 점을 '남은 우려'로 적었다.
수정: zh는 유지한다. 나머지는 각 판의 도입 축으로 첫 문장을 바꾼다.
- ko:4 → 「타오위안 지방법원은 사고 53일 뒤 수리한 차의 수리비 52,089대만달러 가운데, 그날 밤 사진의 충돌 위치와 맞지 않는 반대쪽 펜더 항목을 빼고 33,887대만달러를 인정했습니다. 대만에서는 다친 사람 없이 차만 부서졌고 차가 움직이면 위치와 흔적을 사진이나 영상으로 남기고 차를 옮기는 것이 규정이라, 옮긴 뒤의 다툼은 그 기록으로 갈립니다. 경찰 없이 그 자리에서 화해하면 경찰 자료가 남지 않고, 보험계약에 따라서는 보험사가 그 화해에 묶이지 않습니다.」
- es:4 → «Si el coche dañado no es de quien lo conducía, la reparación la reclama el propietario o, después de pagar, su aseguradora; en un caso de Keelung la aseguradora recuperó 20.454 de los 51.894 dólares taiwaneses pagados, porque las piezas nuevas se depreciaron y no podía cobrar más que el propietario. Antes de eso, si nadie está herido y los coches pueden circular, hay que registrar su posición y las huellas, con fotos o vídeo si se quiere, y apartarlos; dejarlos bloqueando el tráfico cuesta entre 600 y 1.800 dólares taiwaneses.»
- en:4 → "Taiwan's road-safety chief has urged drivers in crashes with only property damage to photograph the scene and move their cars before reporting, and the Road Traffic Accident Handling Regulations already require that when no one is hurt and the cars can still be driven; leaving a car where it blocks traffic can bring a fine of NT$600 to NT$1,800. …" 뒤 두 문장(강제보험·桃園)은 유지한다.

### 7. (철회, opusA 본인 확인 09:57) — alt 지적 철회
포크 초안의 'alt가 실물과 다르다' 지적은 철회한다. 위 SHA의 현재 판(09:48:55 opusB 수정본) 다섯 판 13행 alt는 이미 실물(흐린 날 도시 도로 가장자리, 비상등 켠 승용차 두 대가 앞뒤로 정차, 가까운 은색 차 뒤 범퍼 모서리 찌그러짐, 옆 차로 빨간 삼각 경고판, 사람·번호판 글자·로고 없음)과 맞고 images/G4-brief.txt도 같다. 고칠 것 없음.

### 8. MUST(MINOR급) — ja FAQ3의 상소 제한에 근거 조문이 없다
ja:14 FAQ3 「少額事件の第一審判決には、法令違反を理由にしなければ上訴できません。」는 내용은 맞다. 民事訴訟法 第436條之24 第2項 「對於前項第一審裁判之上訴或抗告，非以其違背法令為理由，不得為之。」(research/law/B0010001-436-24.txt, 오늘 tools/law.py로 받음, 小上27 裁定도 같은 조문 인용). 다만 글 어디에도 이 조문이 인용돼 있지 않다.
수정: 이 문장 끝에 「（民事訴訟法第436条の24第2項）」를 붙이고, 출처 목록에 [民事訴訟法第436条の24](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=436-24)를 더한다.

### 9. MUST(MAJOR급, 본국 법 비교) — ja:61 마무리가 일본 72조를 실제와 다르게 단순화한다
ja:61 「日本なら警察への報告から始まる物損事故も、台湾では、けが人がいなければ記録して車をどかすところから始まります。」 일본 道路交通法 72① 전단은 보고보다 먼저 「直ちに車両等の運転を停止して、負傷者を救護し、道路における危険を防止する等必要な措置を講じなければならない」를 요구한다(research/web/G4-jp-dourokoutsuhou-72.xml). 따라서 일본도 '보고부터 시작'하지 않고, 대만과의 차이는 순서가 아니라 '물손 사고 보고 의무에 예외가 있느냐'다.
수정: 「日本の第72条は物損だけの事故でも警察官への報告を求めます。台湾で警察に知らせずに済むのは、けが人がなく、その場で当事者が和解したときだけで、その前に記録して車をどかす手順は変わりません。」

### 10. MUST(MINOR급) — ko:25 「공임을 포함한 수리비 52,089대만달러」
판결: 「支付拆工、塗裝等修復工資含稅共52,089元（即工資共49,609元，含稅後為52,089元）」, 「因無更換零件」. 52,089는 공임 전부이고 세금이 포함된 금액이며, 부품은 없었다. '공임을 포함한'은 부품비가 따로 있었던 것처럼 읽힌다.
수정: 「공임(세금 포함) 52,089대만달러를 청구했습니다. 부품 교환은 없었습니다.」

### 11. MUST(MINOR급) — zh:41 「駕駛人或車主不移、也移不動」은 조건을 '둘 다'로 바꾼다
處理辦法 9①9 「其駕駛人或所有人不予或不能即時移置，致妨礙交通者，得由警察機關逕行移置」. '不予或不能'은 둘 중 하나면 된다는 뜻이다.
수정: 「駕駛人或車主不移或移不動，車子擋在路上妨礙交通時，警察機關可以逕行移置」

### 12. MUST(MINOR급) — ko 사건번호 한글 독음 「기소자」「소상자」
ko:21·55·FAQ2에 「114년도 기소자 제952호」「소상자 제37호·제27호」가 있다. 「기소자」는 한국 독자가 起訴(기소)로 읽기 쉬운 민사 사건번호이고, 라이브 642 ko판은 같은 사건을 「114年度基小字第952號」 「114年度小上字第27號」로 원문 표기했다.
수정: 본문·FAQ의 사건번호를 「114年度基小字第952號」 「114年度小上字第37號」 「114年度小上字第27號」로 바꾼다. 예: 「타오위안 지방법원 114年度小上字第37號 판결」.

### 13. MUST(MINOR급) — es:43 «cuatro años y once meses en circulación»
판결은 車籍資料의 「108年6月出廠」(출고, 제조)에서 기산했다. 'en circulación'(운행·등록 시점)과는 기준일이 다르다.
수정: «el coche había salido de fábrica cuatro años y once meses antes del accidente»

## 권고(SHOULD)
- S1 es:35 «Lo confirma una sentencia…» → «Así lo aplicó una sentencia…». 952는 '누가 청구권자인가'를 쟁점으로 판단하지 않았고, 「被告自應依法對系爭Ｂ車之所有人即訴外人黃進益負損害賠償責任」라고만 썼다.
- S2 es:41 «Aquel propietario de Keelung» → «El propietario del caso de Keelung». 판결에 소유자 주소가 없다.
- S3 zh:21 「很多人第一個反應是守在車旁等警察」는 근거 없는 일반화다. → 「小擦撞之後，守在車旁等警察是常見的直覺。」 또는 이 문장을 빼고 첫 따옴표 문장에서 바로 「法規寫的順序剛好相反」로 잇는다.
- S4 zh에는 003 Q&A(/zh-hant/columns/taiwan-traffic-accident-procedure, 현장 처치 한 문단)와 642(소액 상소, zh:75 근처) 내부 링크가 없다. 다른 판은 642를 링크한다. 겹침을 밝히는 뜻에서 두 링크를 더하길 권한다.
- S5 es:21 도입 장면은 독자(후진하던 쪽)가 잘못한 쪽으로 읽힌다. 그런데 마지막 질문 «¿Y quién reclamará después la reparación, usted o su compañero?»는 빌린 차의 수리비 청구자를 묻는다. 본문 es:37은 상대 차 손해가 독자(운전자)에게 청구된다고 답해 질문과 어긋난다. → «¿Y a quién reclamará el otro conductor la aleta, a usted o a su compañero?»로 바꾸거나, 두 질문을 다 두고 es:35·37이 각각 답하게 맞춘다.
- S6 952는 피고 결석의 一造辯論 판결이었고, 피고는 상소에서 상대 차가 황색 신호에 진입했다고 다퉜지만 부적법 각하됐다(小上27). 과실 판단이 다툼 없이 내려진 점을 한 구절 밝히면 정확하다(예: ko:55 「오토바이 운전자가 출석하지 않은 1심에서」).

## 요약
MUST 12(번역형 6건 1~6, 그중 1·2·5·6은 MAJOR급 / 본국 법 비교 9는 MAJOR급 / 형식·정확성 8·10·11·12·13은 MINOR급; 7 alt 지적은 철회), SHOULD 6. 조문·금액·판결 숫자·Taipei Times 인용 등 대만 사실 자체는 다섯 판 모두 원문과 맞다. 문제는 판 사이의 병렬(특히 ko↔en)과 ja 마무리의 일본법 단순화다.
