# CROSS-opusB — G3 증권·선물사 주문 시스템 오류 손실 청구 (검수자 opusB, 2026-10-28 09:57 KST)

판정: REQUEST_CHANGES (FAIL 10: MAJOR 2~3·MINOR 7, 권고 7). 부모 세션이 M3(G0380226-11-3 원문 ②항 '前項懲罰性賠償請求權')·M5(G0400106 제52조 '次月五日前填製')·M4(中央社 원문 '媒體詢問…')를 원문으로 다시 확인함.
대상 SHA256(검수 시점, WROTE-opusA 09:40 이후 변경 없음):
- 54314e042fb9840c5fd75e336fc0a1ac70d326980d76b01d1a46e8d1f125cd94  ko.md
- 168e9a40906f978acedde4e01af4e0ce5ac9ffaa210a7171f1ac610c13a285b7  zh.md
- c497cc5773818a9017c2f3537d80788e54d117289b3ee311d5a7eff36a90eeff  ja.md
- 7deb499784f8c0a684b5f584f25b0df785525c03b8b8198c334a9c4d4e4ae38f  en.md
- 2a977fe59e7b094a1a880258971c2ba6e2721744236cc4ca9584536d89acbbcb  es.md


검수 범위: 다섯 판 전문, slug.txt, images/G3-brief.txt, reviews/self-G3*.md, research/G3-facts.md, 원문 대조(research/law/G0400106-all.txt·G0400106-36/37·G0400100-119·G0400001-178-1·G0400072-all.txt·G0380226-11-3 외, research/G3-cna-202610270272.html, research/G3-fsc-20220318.html, research/web/G3s/37dffd81.html), compare.py, verify.sh, bare.py, links2.py, 배포본 952~957 front matter·연락처 표기.

## 지적

### M1. FAIL(MAJOR) — ja·en·es가 서로의 번역처럼 읽힌다 (도입·절 순서만 다르고, 블록 안은 문장 단위로 같은 순서·같은 주제문)
self-G3-jaenes.md 4절은 ja·en·es를 ko·zh와만 대조했고 세 판끼리는 대조하지 않았다. 1027 게이트 G1 MAJOR 1(「es판이 en판의 번역처럼 읽힌다(절 순서만 바꿈)」)·G5 MAJOR 1(요약 첫 문장 공유)과 같은 유형이다.
- summary 첫 문장: ja:4 「…注文が通らなかった、約定の表示が実際と違ったという場合、請求の根拠は口座開設時の受託契約、民法、金融消費者保護法です」 = en:4 "When a Taiwan futures broker's system delays an order or reports fills that do not match the exchange, a claim for the loss rests on the account agreement, the Civil Code and the Financial Consumer Protection Act." = es:4 «Si el sistema … retrasa una orden o muestra ejecuciones que no coinciden con las del mercado, el cliente reclama con el contrato de intermediación, el Código Civil y la Ley de Protección del Consumidor Financiero». 세 판 모두 30일→60일 절차로 끝난다.
- 行紀 블록과 판결 미확인 문장: ja:37 「…判決は、今回確認できていません」 = en:43 "No Taiwan judgment classifying a futures account this way was found for this article." = es:45 «Para este artículo no se ha localizado ninguna sentencia que encaje así la cuenta de intermediación».
- 일반 채무불이행 블록, 같은 조문 순서 220→227→224: ja:39 「そこで一般の債務不履行の規定も並べておきます」 = en:45 "Even without that label, the general rules lead to a similar place." = es:47 «También sirven las reglas generales de las obligaciones».
- 면책 조항 블록: ja:45~47 「…何か書かれていることが多いはずです。…この記事では特定の約款を確認していません。効力の上限は法律が決めています」 = en:51 "…often say something about outages. No particular broker's wording was reviewed here… Taiwan law caps what such a clause can do." = es:51 «Muchos contratos … dicen algo… Aquí no se ha examinado… Lo que sí está en la ley es el límite». 이어서 셋 다 222→247-1(→7②).
- 과태료 블록 맺음 두 문장: ja:59 「どちらの条文にも、罰鍰を顧客に配る仕組みはありません。処分が出るかどうかと、賠償を受けられるかどうかは、別々に決まります」 = en:55 "Neither provision sends money to customers. Whether a firm is penalized and whether you are paid are decided in separate proceedings." = es:55 «Ninguno de los dos artículos destina ese dinero a los clientes. La sanción y la indemnización van por caminos distintos».
- 절차 블록 13②→24②(세 가지 불수리 사유를 같은 순서로)→29②→공고→30→투보센터 648 링크: ja:63~65 = en:59~61 = es:59.
- 시효 블록 125→197→11-3(같은 오류 포함, M3): ja:67 「訴訟の期限はもっと長めです」 = en:63 "Court deadlines run longer." = es:61 «En los tribunales…».
- 기록 블록(en↔es): en:27 "Yours disappear first. Screenshots that show the device clock, push notifications, emails, a note of each call and whether it got through" = es:35 «Las suyas no las guarda nadie más. Capturas con la hora del dispositivo, notificaciones, correos, el registro de llamadas … y si llegaron a contestar»; en:29 "The broker's records follow fixed rules." = es:37 «Las de la empresa tienen reglas.»; en:31 "A dated written query also shows when the dispute began" = es:39 «Fija cuándo empezó la controversia» (ja:55도 같은 문장).
- 변호사 문단: ja:75 「最初の段階で頼めるのは…222条・247条の1…読むこと、そして中国語で会社への申立書と記録の開示請求を書くこと…その後は、売買報告書や取引明細から損害額を組み立て、評議の申請や投保センターの調処、訴訟の代理まで」 = en:71 "Most of the early work is reading … against Civil Code Articles 222 and 247-1, and drafting the written complaint and records request in Chinese… After that comes the loss calculation…, the Ombudsman application or SFIPC mediation, and, if those fail, a lawsuit" = es:69 «Al principio, la lectura… frente a los artículos 222 y 247-1…, y la redacción en chino de la queja y de la petición de registros. Después, el cálculo del daño…, la solicitud ante el centro de evaluación o la mediación del SFIPC y, si no prosperan, la demanda».
- 외국인 블록(ja↔es): ja:71 국적 요건 없음→제외 대상→제4조→제3자 접속이면 947 링크 = es:65 같은 네 단계.
- FAQ: ko FAQ1(ko:14) = ja FAQ3 = es FAQ3(국적 요건 없음 → 전문투자기관·일정 재력 제외 → (ko·ja) 먼저 민원 30일); ja FAQ2 = es FAQ1 = zh FAQ2(「それだけで終わるとは限りません / Puede intentarlo / 可以爭執」 → 222 → 247-1 → 7조).
수정안: 세 판 중 적어도 두 판(예: en·es)의 summary 첫 문장, 위 블록의 순서·주제문·맺음 문장, 변호사 문단, FAQ를 그 언어 독자 기준으로 다시 짠다. ja는 현물주 매도 불통(所失利益·立証)이 축이므로 일반 채무불이행·면책·시효를 그 예시에 붙여 압축하고, en은 기록·취소 예시·FINRA 비교를 축으로, es는 숫자 오프닝·지연 주문 축으로 각 블록의 들어가는 문장과 순서를 바꾼다. 판결 미확인·약관 미검토 문장은 M8대로 빼거나 판마다 다르게.
해당 판: ja·en·es(+ FAQ는 ko·zh 포함).

### M2. FAIL(MAJOR 또는 MINOR, 판정 위임) — ko와 zh 본문 가운데 세 절과 변호사 문단이 문장 단위로 대응
도입·FAQ·맺음은 다르지만 '계약 책임 → 면책 → 손해' 구간이 같은 순서·같은 주제문이다(1027 G4 MINOR 4는 부분 대응을 MINOR로, G1 MAJOR 2는 '도입·소제목만 새로 쓴' 판을 MAJOR로 봤다).
- ko:43 「고의나 중대한 과실의 책임은 미리 면제할 수 없습니다(222). 회사가 같은 종류의 계약에 쓰려고 미리 만든 약관이…무효(247-1). 금융소비자보호법 제7조 제2항은 여기에 한 가지를 더합니다」 = zh:49 「故意或重大過失的責任，不得預先免除（222）。期貨商預先擬好、用於同類契約的條款…那一部分無效（247-1）。金融消費者保護法第7條第2項另外規定…」
- ko:45 「그래서 다툼은 결국 사실로 갑니다. 오류가 왜 생겼는지, 회사가 평소에 어떤 점검을 했는지, 언제 알아채고 언제 고객에게 알렸는지입니다. 선물사는 법령·정관·내부통제제도에 따라…(제2조), 감독기관 점검에서 내부통제 결함이 확인되면 민사의 과실 판단에도 중요한 자료가 됩니다」 = zh:51 「真正的爭點會落在事實：系統為什麼出錯，公司事前做了哪些檢查，出錯後多久發現、多久通知客戶。期貨商必須依法令、章程與內部控制制度經營業務（第2條），查核報告若認定內控有缺失，對民事上的過失判斷也會是重要資料」
- ko:49 「…두 번째 체결을 정리하면서 생긴 가격 차이와 수수료·거래세는 앞의 것에 속해 계산이 비교적 분명합니다」 = zh:55 「…平倉後的價差、手續費與交易稅，屬於所受損害，計算相對直接」
- ko:53 「본인의 대응도 계산에 들어갑니다. …(217). 화면이 이상하다는 것을 알고도 회사 확인 없이 주문을 거듭했다면, 그 뒤에 커진 손실은 깎일 수 있습니다」 = zh:57 「法院也會看投資人自己。…（217）。明明已經發現回報異常，還在無法確認的情況下反覆加碼或反向操作，損失擴大的那一段可能被打折」
- 변호사 문단: ko:77 (기록 맞춰 시간순 정리 → 면책 조항 검토 → 손해액 계산 → 중국어 민원서·평의 신청서 → 소송 대리) = zh:77 (같은 다섯 항목, 같은 순서).
수정안: zh는 대만 투자자 기준으로 國票 사례의 '回報 vs 真實成交' 구분에서 면책·손해를 풀어 가고 있으므로, ko 쪽(거류 한국인·증권 계좌 중심)의 면책·손해 절 주제문과 예시, 변호사 문단 항목 순서를 바꾸는 편이 수정 범위가 작다.
해당 판: ko·zh.

### M3. FAIL(MAJOR) — 金融消費者保護法 제11조의3 제2항의 2년·5년을 '金保法 위반 손해배상 청구 전체'의 기간으로 썼다 (ja·en·es; ko·zh와 불일치)
- 원문(research/law/G0380226-11-3.txt): 제2항 「前項懲罰性賠償請求權，自請求權人知有得受賠償之原因時起二年間不行使而消滅；自賠償原因發生之日起逾五年者，亦同。」 — 대상은 징벌적 배상 청구권뿐이다.
- ja:67 「同法の損害賠償請求として、原因を知った時から2年、原因の発生から5年の期間があり」
- en:63 "Where the loss comes from a violation of the Financial Consumer Protection Act itself, damages claims run two years from learning of the cause and five years from when it arose"; en:14 FAQ3 "A damages claim based on a violation of the Financial Consumer Protection Act expires two years after you learn of the cause, or five years after it arose (Article 11-3(2))."
- es:61 «esa indemnización prescribe a los dos años desde que se conoce la causa y a los cinco desde que se produjo»
- ko:69 「이 청구권(징벌적 배상)은 안 때부터 2년, 원인이 생긴 날부터 5년」, zh:71 「請求權自知有得受賠償之原因起二年、自賠償原因發生起五年消滅」은 맞다.
수정안: 세 판 모두 '징벌적 배상 청구권'의 기간으로 고친다. 예) en "…a court may add punitive damages of up to the amount of the loss for negligence (three times for intent); that punitive claim expires two years after you learn of the grounds and five years after they arose (Article 11-3)." en FAQ3 문장도 같은 범위로. ja·es도 동일.
해당 판: ja·en·es.

### M4. FAIL(MINOR) — zh:59가 기자의 질문 전제를 中央社가 보도한 사실로 바꿨다
- zh:59 「中央社報導，當天營業員通知客戶可以來電確認，客戶卻打不進去；黃厚銘表示，期交所查察時會一併了解人力配置。」
- 원문(research/G3-cna-202610270272.html): 「媒體詢問，當天營業員通知客戶可致電期貨商確認，但客戶打電話卻打不進去，是否會要求期貨商配置足夠人力。黃厚銘說，對期貨商營業原則就是要配置適足、適任的業務員，針對此狀況，期交所前往查察時也會一併了解。」
수정안: 「記者會上有媒體提問：當天營業員通知客戶可以來電確認，客戶卻打不進去。黃厚銘回應，期貨商原則上要配置適足、適任的業務員，期交所查察時也會一併了解。」
해당 판: zh.

### M5. FAIL(MINOR) — 對帳單 기한을 '5일 전 발송·도착'으로 썼다 (ko·zh; ja·en·es는 맞음)
- 원문(G0400106-all.txt 제52조): 「期貨商應按月編製對帳單一式二份，並於次月五日前填製，一份送交期貨交易人，一份由期貨商保存。」 — 5일은 작성(填製) 기한이다.
- ko:59 「매달 거래명세서(對帳單)를 다음 달 5일 전에 보내며」, ko:79 「이번 달 거래명세서는 다음 달 5일 전에 도착합니다」(맺음 문장이 이 사실에 기대고 있다), zh:31 「次月五日前送交」.
- self-G3.md 73행은 「'5일까지 발송'으로 쓰지 않음」이라고 적었으나 ko·zh 본문과 다르다.
수정안: ko:59 「다음 달 5일 전에 작성해 한 부를 고객에게 보내고」, ko:79 「선물 계좌라면 이번 달 거래명세서는 다음 달 5일 전에 작성됩니다. 받은 명세서의 줄이 그날 밤 캡처한 화면과 어긋난다면…」, zh:31 「次月五日前填製，一份送交投資人」.
해당 판: ko·zh.

### M6. FAIL(MINOR) — 약관 면책 조항이 '많다'는 근거 없는 일반화 (다섯 판)
- research/G3-facts.md '미확인'절: 「期貨 受託契約 표준 약관의 시스템 장애 면책 문구 내용 — 미확인. "약관에 면책 조항이 있을 수 있다"는 일반론 + 조문으로만.」
- ko:41 「…조항이 들어 있는 경우가 많습니다」, zh:47 「很多受託契約或電子下單約定都有系統風險的條款」, ja:45 「…何か書かれていることが多いはずです。文言は会社ごとに違い」, en:51 "Electronic-trading terms often say something about outages. … and it varies.", es:51 «Muchos contratos de negociación electrónica dicen algo…».
수정안: '들어 있을 수 있습니다 / 可能有 / 書かれていることがあります / may say something / Puede que el contrato diga algo' 수준으로. ja '会社ごとに違い', en 'it varies'는 삭제.
해당 판: 다섯 판.

### M7. FAIL(MINOR) — 다른 법 바로 뒤에 법 이름 없는 조문 번호 (링크는 맞음)
- ko:35 「배상 근거는 [제544조]가 정합니다」 — 바로 앞 문장(ko:33 끝)이 금융소비자보호법 제7조 → 「민법 제544조」로.
- ko:49 「([제216조])」 — 앞 문단 마지막 인용이 선물사 관리규칙 제2조 → 「민법 제216조」로.
- ko:14 FAQ3 「(제29조 제2항)」·「(제30조)」 — 이 FAQ 답 안에 법 이름이 한 번도 없다(FAQ는 따로 노출됨) → 첫 인용을 「금융소비자보호법 제29조 제2항」으로.
- ja:14 FAQ1 「…（民事訴訟法第222条第2項）。…第217条により減額」 → 민사소송법 제217조로 읽힌다 → 「民法第217条」.
- en:41 "([Article 30])", "([Article 2])" — 앞 문단(en:37) 마지막 인용이 Civil Code Article 217 → "Article 30 of the Regulations Governing Futures Commission Merchants" 등으로.
- es:37 «([artículo 52])» — 바로 앞 인용이 Reglamento de las sociedades de valores 제42조 → «artículo 52 del reglamento de futuros». 같은 문단 끝 «Tampoco puede dejar…»는 주어가 없어 누구의 의무인지 흐리다 → «La sociedad de futuros tampoco puede…».
- es:59 «([artículo 13.2])» — 앞 절(es:55) 마지막 인용이 Ley de Valores y Bolsa 제178-1조 → «artículo 13.2 de la Ley de Protección del Consumidor Financiero».
- (경미) ko:61 「관리규칙이 금지합니다([제55조] 제8호)」 — 바로 앞 문단 마지막 인용이 증권사 관리규칙 → 「선물사 관리규칙」으로 명시.
해당 판: ko·ja·en·es.

### M8. FAIL(MINOR) — 작성 과정 메모가 본문에 드러난다 (ja·en·es)
- ja:37 「台湾の裁判所が証券の受託売買をこう位置づけた判決は、今回確認できていません」, ja:45 「この記事では特定の約款を確認していません」, en:43 "…was found for this article. So read the label as a likely route.", en:51 "No particular broker's wording was reviewed here", es:45 «Para este artículo no se ha localizado ninguna sentencia…», es:51 «Aquí no se ha examinado el de ninguna empresa concreta».
- 1027 게이트 G6 MINOR 2(작성 지시가 본문에 드러난 문장)와 같은 유형. 불확실성은 법 문장의 조건으로 남기면 된다(ko:33 「같은 모양입니다」, zh:39 「接近民法的行紀」처럼).
수정안: 예) en "A broker that trades in its own name for the customer's account and for a fee resembles what Article 576 calls a commission agency (行紀); if a court treats it that way, the rules on mandate apply (Article 577)…" 후 'was found for this article' 문장 삭제. 약관 문장은 M6 수정안으로 대체.
해당 판: ja·en·es.

### M9. FAIL(MINOR) — ja·en·es featured_image_alt가 images/G3-hero.webp 실물과 다르다
- 실물(/tmp/opusB-hero/G3.png): 모니터 두 대 모두 켜짐 — 왼쪽 숫자 없는 푸른 캔들 차트와 파형, 오른쪽 차트 위 빈 회색 팝업 창. 앞에 화면 꺼진 스마트폰, 펜 올린 스프링 메모장, 검은 머그, 작은 화분, 헤드폰, 스탠드, 왼쪽 창밖 도시 불빛. ko:13·zh:13·images/G3-brief.txt는 이와 맞다.
- ja:13 「同じ形の灰色の棒が二重に重なって繰り返す抽象的な模様、右の画面は消えている。伏せたスマートフォン、折りたたんだ数枚の紙…冷めた湯のみ」, en:13 "repeated gray bars and the other switched off, a face-down smartphone, a few folded sheets of paper… a cold cup of tea", es:13 «barras grises repetidas y otro apagado, un móvil boca abajo, unas hojas dobladas… una taza de té frío» — 꺼진 모니터·접힌 종이·찻잔은 실물에 없다. research/G3-facts.md 'UPDATED 09:31'은 「ja·en·es alt도 이 요소로」라고 적었으나 반영되지 않았다.
수정안: ko/zh alt 요소로 세 판을 다시 쓴다(가상 표시, 인물·로고·읽히는 글자 없음 유지).
해당 판: ja·en·es.

### M10. FAIL(MINOR) — es summary가 제29조 제2항의 전제(회사의 사전 동의)를 뺐다
- es:4 «…cuyas decisiones la empresa debe aceptar hasta 120.000 dólares taiwaneses en la intermediación ordinaria» — 원문 29②는 「金融服務業於事前以書面同意或於其商品、服務契約或其他文件中表明願意適用本法之爭議處理程序者」에 한한다. es:21 본문은 «si se ha sometido de antemano al procedimiento»로 조건을 적었다.
수정안: «…cuyas decisiones, si la empresa aceptó de antemano el procedimiento, debe acatar hasta 120.000…».
해당 판: es.

## 권고 (반려 사유는 아님)
- R1. ko 범위: 제목·FAQ는 '증권사 앱'인데, ko:35와 ko FAQ2가 '두 번째 거래는 맡긴 범위 밖'의 근거로 선물사 관리규칙 제37조만 든다. 주식 계좌 독자에게는 선물사 규칙이 근거가 되지 않는다 → 「선물 계좌라면」으로 범위를 밝히거나 증권사 쪽 근거를 따로(원문 확인 후) 쓴다.
- R2. ko:4 summary 「민법 제544조가 직접 다루고」 — 544조는 위임(수임인) 규정이고 증권사·선물사에 닿는 것은 行紀(576·577) 경로를 거칠 때다(facts L23: 판례 미확인, 조건부로만). '직접'을 빼고 「위임 규정(민법 제544조)에 따라」 정도로.
- R3. zh:21 「初步統計影響116戶，沒有重複成交」 — 원문상 '沒有重複成交狀況'은 黃厚銘의 회사 통보 기반 발언이고 期交所가 「是否有重複成交」를 점검할 예정이다. 「黃厚銘說，依初步統計…沒有重複成交」처럼 발언으로 귀속하면 zh:23·zh:79와 더 잘 맞는다.
- R4. ja:67 「訴訟の期限はもっと長めです」 — 일본어로 어색(비교 대상 불명, 「もっと長め」). 「裁判で請求する場合の期間は、評議よりずっと長くなります」 등. (M3 수정 때 함께)
- R5. en:73 "the first dated email to the broker … starts the firm's 30-day reply period" — 13②의 30일은 申訴(complaint)를 받은 날부터다. "the first dated written complaint"로.
- R6. en:67 "get a disclosure about outages" — FINRA 4370(e)는 BCP가 'significant business disruption'에 어떻게 대응하는지 공시하게 한다(research/web/G3s/37dffd81.html). "a disclosure of how the firm's business continuity plan handles significant business disruptions"가 원문 범위에 맞다.
- R7. 중복 인용: zh:43 「民法第224條規定…（[民法第224條]）」, ja:27 「民法第216条は…（[民法第216条]）」, ja:41 「金融消費者保護法第7条第3項は…（[金融消費者保護法第7条]）」 — 문장 주어로 이미 쓴 조문을 괄호로 다시 단다. 주어 쪽에 링크를 걸고 괄호를 뺀다.

## 점검했고 문제 없음
- 國票期貨 사건은 zh에만 있다(ko·ja·en·es에 國票·116·中央社·期交所 언급 없음). zh는 점검 결과·실제 손실을 미정으로 쓴다(zh:23·79), 회사 책임을 단정하지 않는다. 116户·12만~240만·28日 查核·黃厚銘 발언(「下單1筆…回報成交2筆」「誤以為…按錯」)은 원문과 같다(M4·R3 제외).
- 조문 대조(원문과 같음): 民法 125·197(2년·10년)·216·217·220·222·224·227·247-1·535·544·576·577(適用, 準用 아님); 金保法 4·7②③·13②(30일·60일)·24②·29②·30(90일, 확정판결 효력); 期貨商管理規則 2·30·33③·36(1년·분쟁 시 해소까지)·37·39·55⑧; 期貨交易法 119①(2)(12만~240만)·56⑤; 證券交易法 178-1①(4)(30만~600만); 證券商管理規則 2·42(①단서 金融機構兼營 예외, ③ 簽章 면제); 民事訴訟法 222②·277. 金管會 2022-03-18 公告(120만 열거 14항목, 그 밖 12만; 거래소 상장 주식·선물 위탁매매는 열거 밖) — ko·zh·ja·en·es 모두 맞다.
- 648(직원 임의매매)·947(해외 FX 해킹)과 다른 질문(회사 시스템 오류)이고 다섯 판 모두 두 글로 링크만 넘긴다. 투자 권유 문장 없음.
- 본국 비교: en FINRA Rule 4370(a)(e)는 원문과 맞다(R6 표현 제외). ja·es는 본국 비교를 쓰지 않았다(출처 없는 본국 법 단정 없음).
- 연락처: 다섯 판 모두 wei@hoveringlaw.com.tw + 타이베이 주소(배포본 952~957과 같은 각 언어 표기), 전화번호 없음(verify.sh의 phone 카운트는 '휴대전화·전화·phone' 일반 단어), 타이중 주소 없음. en "English-speaking lawyer in Taipei" 있음. 사무소명 昊鼎國際法律事務所 표기 맞음. 바이라인·저자 줄·AI 표시·'변호사 검토' 표기·굵은 글씨·이모지 없음.
- front matter: verify.sh — 필수 15키 모두, published·lastmod 2026-10-28, featured_image "TBD", audience ko/zh-hant/ja/en/es, faq 3개, H1 1개, 출처 절 1개. 배포본 952~957과 키·형식 같음. slug.txt 정상.
- variety: ko·zh·ja·en(variety_metrics.py)·es(variety_metrics_es.py) FAIL 0.
- 링크: links2.py 51개 non-200 0. 내부 링크는 모두 같은 언어 경로(/ko·/zh-hant·/ja·/en·/es)이고 링크 문구가 대상 글 제목과 맞다. /ja/services/civil·/en/services/civil·/es/services 200.
- 무죄추정: 형사 사건 아님(해당 없음).

## 검수 한계
- 金管會 2022-03-18 공고 이후 一定額度를 다시 바꾼 공고가 있는지는 확인하지 않았다(작성 쪽 facts도 2022 공고만 근거).
- ja·es 문장의 자연스러움은 모델 판단이며 원어민 검수가 아니다.
