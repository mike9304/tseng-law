# CROSS-opusB — G1 플랫폼 판매자의 대만 실체·영업세 등록 (검수자 opusB, 2026-10-28 09:58 KST)

판정: REQUEST_CHANGES (FAIL 8: MAJOR 1·MINOR 7, 권고 4). 부모 세션이 7번(勞工退休金條例 제7조 원문 research/law/N0030020-7.txt: 적용 대상은 本國籍·국민 배우자로 거류 허가·영주 허가 외국인)과 8번(ko:23 원문)을 다시 확인함. 5번은 '확인 필요'(투심회 FAQ 403) 포함 — 확인 못 하면 지점에 투자 허가가 필요하다고 읽히는 문장을 조건문으로 낮추는 쪽을 권함.
대상 SHA256(검수 시점, WROTE-opusA 09:40 이후 변경 없음):
- 93f40573b97cceb831896a17746909405c7ace2270099c39fa496711e76959f8  ko.md
- 1c263de7b73a731afff4addc95a35e8df2dcf50d4e72c60df3ef0da39c68daed  zh.md
- 4282427f0a2d3bf3f3726612ef7ef7509c84fde61d0c33269b3776f3509d6f5c  ja.md
- a67352d3b3d3cd32a13d189378c2abaaa309a31ce140901a54355eaae8939688  en.md
- dd42b68ee2610f2b6d78e24b1f55debc894c87ba552d106db0d33eeb1fcc522b  es.md

검수자: opusB 포크(G1 담당). 대상: drafts/gap/G1/{ko,zh,ja,en,es}.md, slug.txt, images/G1-brief.txt, reviews/self-G1*.md. drafts는 읽기만 했음.
대조 원문: research/law/*.txt(LawSingle 저장본), research/G1-src/gcis-t70049.txt, research/G1-genews.html, 財政部 稅務入口網 4개 페이지(09:48 KST 재수집, /tmp/opusB-G1/{import-notice,import-case,notice,case}.html), research/law/N0030020-7.txt(이번에 새로 받음).

## 지적

### 1. FAIL(MAJOR) — ja판과 en판이 서로의 번역처럼 읽힌다(도입·절 순서만 다름)
- 파일:줄 — ja.md 4·14·27~29·35·41~45·49~53·57~61·65~67·73·75 ↔ en.md 4·14·29·33~37·41~45·49~53·57~61·67~69·73·75
- 문제: 1027 1차 게이트 G1 지적 1("es판이 en판의 번역처럼 읽힌다(절 순서만 바꿈)")과 같은 유형. 오프닝(ja:21~23 오해 한 줄 / en:21~23 371조 벌칙)과 절 배열만 다르고, 그 밖의 블록은 단락 단위로 같은 문장·같은 순서다.
  - summary: ja:4 「直送→収貨人が税関に納付 → 倉庫出荷は国内販売・営業開始前の税籍登記 → 371条 → 子会社は8条核准 → 固定営業場所は条文になく国税局確認」 ↔ en:4 같은 다섯 요소 같은 순서(en은 2,000元만 추가).
  - FAQ: 세 질문이 같은 주제·같은 순서(직송 세금 / 물류창고 재고면 등록? / 辦事處로 팔 수 있나). 답도 평행: ja FAQ1 「…第2条第2号。税関が代わりに徴収し（第41条）、財政部の越境EC向けの案内も同じ整理です。郵便小包や速達便は…2,000…除かれ…6回…」 ↔ en FAQ1 「…(Article 2, item 2) and collected by customs (Article 41). The Ministry of Finance's guidance … says the same. Parcels and express shipments … NT$2,000 … except tobacco … six times」.
  - 창고 절: ja:49 「注文を受けたのが日本のサーバーでも、条文が見るのは荷物がどこから出たかです」 ↔ en:33 「The article does not ask where the order was taken.」; ja:51 「国内で売る者は営業人です。第6条は…固定営業場所を含めています（第3号）。…税籍登記をする決まりです（第28条）」 ↔ en:35 「Selling in Taiwan makes someone a business entity. Article 6, item 3, includes … (Article 28)」; ja:53(질문 → 条文はそこまで書いていない → 今回確認した範囲では財政部の解釈も見つかっていない → 倉庫契約と受注・出荷の指示 → 国税局) ↔ en:37(질문 → The statute does not answer → No published MOF ruling … turned up → warehouse contract and order flow → NTB).
  - 직송 절: ja:57(第1条 → 第2条第2号 → 第41条) ↔ en:41 같은 순서; ja:59 「財政部の税務入口網も…同じように整理…5％…この形なら、日本の出店者が台湾の税務署に申告する場面は出てきません」 ↔ en:43 「The MOF's notes … apply the same rule … 5% … The US seller files nothing in Taiwan in that scenario.」; ja:61 ↔ en:45(2,000 → 제외 품목 → 초과분 전액 → 6회 → 快遞 분할 금지).
  - 지점·자회사·辦事處: ja:41(372① → 반환 시 5년 이하 → 經濟部 서류 안내) ↔ en:49 같은 순서; ja:43 「子会社を設けると、手続の入口が変わります。第4条…第8条第1項…1か月以内…2か月以内（同条第3項）」 ↔ en:51 「Investment approval comes first for a subsidiary. … Article 4 … Article 8, paragraph 1 … one month … two months (paragraph 3)」; ja:45 「駐在員事務所（辦事處）は、販売の拠点にはなりません。第386条の辦事處は…意思のない外国会社が…。辦事處の税務上の扱いは[…]」 ↔ en:53 「Representative offices do not fit a seller. Under Article 386 … no intention … What such an office may and may not do for tax purposes is in […]」.
  - 371조: ja:35(行為者 → 1년·15만·併科 → 民事責任·連帯 → 「台湾の倉庫に在庫を置き、日本の会社の名前で…」) ↔ en:29(Whoever acts → prison/fine → civil liability jointly → 「For a US brand running Taiwan stock in the parent's name…」).
  - 소비자: ja:65(2条2号 → 9条 → 「直送なら輸入するのは買い手ですが、在庫を…誰の名義で輸入したのか」) ↔ en:57~59(Article 2 item 2 → Article 9 → 「When a consumer orders directly from the US, the consumer is the importer. Bulk stock is another story. Someone's name goes on the import declaration…」); ja:67 ↔ en:61(財政部 단체구매 플랫폼 두 방식 → 주문 확인 화면에 누가 판매자로 나오나 → 반품 창구).
  - 인력: ja:27(就業服務法43 → 「誰が雇用主として申請するのか。そこが先です。」) ↔ en:67(… 「Someone has to be that employer.」); ja:29 ↔ en:69(勞保 6 → 勞退 6).
  - 변호사 단락: ja:73 「出店契約と物流倉庫の契約を読み…輸入者・売主として名前が出る場面 → 国税局への照会文 → 支店か子会社かの比較と投資申請書・投資計画 → 会社登記と税籍登記 → 就業許可と雇用契約 → 消費者…請求への対応」 ↔ en:73 같은 여섯 업무 같은 순서.
  - 맺음: ja:75 「物流倉庫との契約書に書かれた在庫の搬入開始日は…営業税法第28条が求めているのは、営業を始める前の税籍登記です。」 ↔ en:75 「The warehouse contract will carry a date for the first inbound delivery. Article 28 asks for tax registration before business begins, so that date is the one to plan around.」
- 근거: TASK.md '번역 금지'(같은 도입·같은 예시·같은 문단 순서를 옮긴 판은 FAIL), ~/tseng-columns-1027/drafts/gap/G1/ASTRA-FAIL-fixed-1.md 1번(절 순서만 바꾼 번역형 = MAJOR), G2/ASTRA-FAIL-fixed-1.md 1번(summary·FAQ 3개·변호사 업무 문장 번역형 = MAJOR). reviews/self-G1-jaenes.md 4절은 오프닝·절 순서만 비교했고 단락 내용은 대조하지 않았다.
- 수정안: 둘 중 한 판(예: en)을 미국 판매자 독자의 질문 순서로 다시 쓴다. summary·FAQ 세 개·변호사 단락·맺음 줄을 새로 쓰고, 창고 절·직송 절·지점/자회사/辦事處 절·소비자 절의 단락 안 문장 순서와 장치(「주문 받은 곳은 묻지 않는다」, 「財政部도 같은 정리」, 「판매자는 아무것도 신고하지 않는다」, 「누군가 그 고용주가 돼야」, 「창고 계약의 입고일 = 제28조」)를 바꾼다. 예: en은 FAQ를 '미국 LLC가 대만 지점을 내면 미국 쪽 책임은?'·'플랫폼이 수입자가 되면 내 의무는?' 같은 다른 질문으로, 맺음은 en만의 사실(예: 372② 자금 반환 형사책임 또는 371② 행위자 개인 책임)로. 대만 사실·조문·숫자는 그대로 둔다.
- 해당 판: ja, en(둘 중 하나 이상 재작성)

### 2. FAIL(MINOR) — es판 몇 단락과 FAQ 하나가 en판을 문장 단위로 옮겼다
- 파일:줄 — es.md 43 ↔ en.md 63, es.md 49 ↔ en.md 29, es.md 37 ↔ en.md 45, es.md 14(FAQ2 답) ↔ en.md 14(FAQ1 답), es.md 51 ↔ en.md 49+53
- 원문 인용: es:43 «El comprador puede resolver el contrato en los siete días… sin dar razones ni pagar gastos; el Yuan Ejecutivo fija las excepciones razonables. Si el vendedor no informó de ese derecho, los siete días corren desde el día siguiente a que lo haga, pero el derecho se extingue cuando han pasado cuatro meses desde que empezó el plazo original (artículo 19). Las demandas de consumo pueden presentarse ante el tribunal del lugar donde nació la relación de consumo (artículo 47).» ↔ en:63 "Online buyers in Taiwan can cancel within seven days … without giving a reason or paying a fee, subject to reasonable exceptions set by the Executive Yuan. If the seller never told the buyer about that right, the seven days run from the day after it does, but the right expires four months after the original period began (Article 19). A consumer lawsuit may be filed in the court where the consumer relationship arose (Article 47)." / es:49 «Quien carga con la sanción es la persona que actúa… Esa persona responde además civilmente por su cuenta, de forma solidaria si son varias, y la autoridad prohíbe el uso del nombre… En el esquema descrito, la persona que actúa en Taiwán es usted.» ↔ en:29 "Whoever acts faces … That person also bears civil liability personally, jointly with any others who acted, and the authority will bar use of the foreign company's name. For a US brand … that exposure falls on whoever conducts the business in Taiwan for the parent."
- 문제: es 전체는 오프닝(財政部 안내 인용)·첫 절(起徵點)·가족 회사·체류 절이 달라 번역판은 아니지만, 위 단락은 en 문장 순서·장치를 그대로 따른다(1027 G5/ASTRA-FAIL-fixed-5.md 1번 '한 단락 단위의 평행' 유형, MINOR).
- 근거: TASK.md 번역 금지, 1027 G5/ASTRA-FAIL-fixed-5.md 1번.
- 수정안: es:43은 스페인어권 거주 판매자 시점(예: 반송 비용을 누가 대는지, 커피·식품처럼 합리적 예외가 문제 될 상품)에서 순서를 바꿔 쓰고, es:49는 가족 회사 장면에 붙여 벌칙→민사책임 순서를 바꾸거나 한 문장으로 줄인다. es FAQ2 답은 en FAQ1과 다른 각도(본인이 수하인으로 들여올 때)로.
- 해당 판: es

### 3. FAIL(MINOR) — 같은 FAQ·같은 변호사 업무 목록이 여러 판에 반복된다
- 파일:줄 — ko.md 14(FAQ2) · zh.md 14(FAQ3) · ja.md 14(FAQ2) · en.md 14(FAQ2); ko.md 77 · ja.md 73 · en.md 73 (es.md 61도 거의 같은 순서)
- 원문 인용: ko FAQ2 「대만 창고에서 출고되는 판매는 영업세법 제4조 제1항 제1호에 따라 대만 안의 판매입니다. …회사법 제371조의 지점 등록이 문제 됩니다. 제3자 물류창고가 외국 판매자의 고정 영업장소인지는 조문에 바로 적혀 있지 않아 관할 국세국에 확인할 대목입니다.」 / zh FAQ3 「從台灣倉庫出貨，起運地在境內，依營業稅法第4條屬於境內銷售。公司法第371條規定…。至於委託第三方物流的倉庫是否構成…宜向主管國稅局確認。」 — 질문(창고 재고면 지점/등기가 필요?)과 답 순서(4조 → 371조 → 3PL 고정 영업장소 미정 → 국세국)가 네 판에서 같다. 변호사 단락은 ko:77 「입점 계약과 판매자 약관…검토 → 국세국 질의서 → 자회사나 지점 설립과 외국인투자 신청 → 세적등록 → 대만 직원 고용 계약 → 소비자 반품 분쟁·제조자 책임」, ja:73·en:73이 같은 항목·같은 순서.
- 문제: 1027 G6/ASTRA-FAIL-fixed-1.md 2번('FAQ3이 ko·en·es에서 같은 질문·같은 문장 순서')·1번('맺음 대만 변호사에게 맡길 수 있는 일이 ko·zh에서 같은 다섯 항목·같은 순서')과 같은 유형.
- 수정안: 지적 1에서 en(또는 ja)을 고칠 때 함께 바꾸고, ko FAQ2나 zh FAQ3 중 하나는 다른 질문(예: ko '플랫폼이 수입자가 되면 한국 셀러에게 남는 의무는?', zh '代理商進口時，國外原廠也要負責嗎？')으로 바꾼다. ko 변호사 단락은 한국 셀러에게 먼저 필요한 일(입점 계약의 판매자·수입자 조항, 대만 창고 이전 전 질의)부터 다른 순서·다른 묶음으로.
- 해당 판: ko·zh·ja·en(·es)

### 4. FAIL(MINOR) — ko·zh 단락이 문장 단위로 평행(지점·자회사 선택지)
- 파일:줄 — ko.md 55~57 ↔ zh.md 61
- 원문 인용: ko:55 「남는 선택지는 셋입니다. 대만 자회사를 세우는 것, 한국 회사의 대만 지점을 등기하는 것, 아니면 대만의 수입·유통업자에게 팔아…. 외국인투자조례 제4조는… 제8조는… 1개월 안에(…2개월 안에)」 + ko:57 「지점은…(제372조). 경제부의…30%…투자허가부터…. 자회사와 지점의 책임·세금 차이는 [링크]」 ↔ zh:61 「國外品牌可以選的路有三條：設立台灣子公司、辦理在台分公司登記，或者把貨賣給台灣的進口商…。外國人投資條例第4條…第8條…一個月內…兩個月內…。分公司要專撥營業資金…（第372條）。經濟部…30%…投資許可…。子公司與分公司的差別，請見[링크]」
- 문제: 세 선택지 순서 → 4조 → 8조 기한 → 372조 → 經濟部 30% → 링크까지 같은 여섯 단계. 1027 G6/ASTRA-FAIL-fixed-1.md 4번('허가 절차 단락이 ko·zh·ja에서 같은 네 문장·같은 순서') 유형.
- 수정안: zh는 대만 수입·유통업자 독자 시점이니 '把貨賣給台灣的進口商' 선택지를 앞에 두고 經銷 계약 쪽으로 풀거나, 4조·8조·372조 설명을 한 문장으로 줄이고 링크로 넘긴다. ko는 한국 셀러 시점을 유지.
- 해당 판: ko 또는 zh

### 5. FAIL(MINOR) — 지점에 外國人投資條例 제8조 허가가 필요한지 판끼리 다르게 읽힌다(확인 필요 포함)
- 파일:줄 — ko.md 55, zh.md 61 ↔ ja.md 4·43·FAQ3, en.md 4·51·FAQ3, es.md 55
- 원문 인용: ko:55 「외국인투자조례 제4조는 대만 회사의 지분을 갖는 것과 대만에 지점을 세우는 것을 모두 투자로 정의합니다. 같은 조례 제8조는 투자 신청서와 투자계획을 내 주관기관의 허가를 받게 하고」(zh:61 같은 구조) ↔ ja:4 「子会社なら外国人投資条例第8条の核准が先に来ます」, en:51 "Investment approval comes first for a subsidiary.", ja/en FAQ3 「支店登記（第371条・第372条）か、外国人投資条例第8条の核准を得て子会社」.
- 문제: ko·zh는 4조(지점 포함) 바로 뒤에 8조 허가를 붙여 '지점도 8조 허가를 받는다'로 읽히고, ja·en은 8조 허가를 자회사에만 붙인다. 같은 대만 사실이 판마다 다르다. 또 ko:57·zh:61이 인용한 經濟部 지점 서류 안내(research/G1-src/gcis-t70049.txt 9~14행)는 「經濟部投資審議司投資許可函影本」을 '대륙 자본 30% 초과·지배력' 회사에만 요구한다. 일반 외국 회사 지점이 8조 허가를 받아야 한다면 이 특칙을 따로 둘 이유가 없어, ko·zh 서술과 같은 단락의 經濟部 안내가 서로 긴장한다. 작성자 facts E4도 "지점의 FIA 신청 여부는 D5 문구 범위에서만"이라고 정해 두었다. 실무에서 일반 외국 회사 지점이 투자심의사 허가 없이 등기되는지는 투자심의사 FAQ(403)로 확인하지 못했다 → 확인 필요.
- 근거: research/law/J0040002-4.txt(4조 2호 「在中華民國境內設立分公司」), J0040002-8.txt, research/G1-src/gcis-t70049.txt, research/G1-facts.md E4.
- 수정안: 다섯 판을 facts E4 범위로 맞춘다. ko 예: 「대만 자회사의 지분을 갖는 것은 외국인투자조례 제4조의 투자이고, 제8조에 따라 투자 신청서와 투자계획을 내 허가를 받습니다(…1개월/2개월). 지점은 회사법에 따라 경제부에 등기하는데, 경제부 첨부서류 안내는 대륙 자본이 30%를 넘거나 지배력을 가진 외국 회사에만 등기 전 투자심의사 허가를 요구합니다.」 4조 2호를 계속 쓰려면 투자심의사 실무를 원문으로 확인한 뒤에.
- 해당 판: ko·zh(문구), ja·en·es(일치 여부 확인)

### 6. FAIL(MINOR) — 법 이름 없이 조문 번호만 써서 앞 단락의 다른 법 조문으로 읽힌다
- 파일:줄 — ko.md 57 「([제372조](…J0080001&flno=372))」(바로 앞 ko:55 마지막 법은 외국인투자조례 제8조), ja.md 45 「[第386条](…J0080001&flno=386)の辦事處は」(바로 앞 ja:43은 外国人投資条例第4条・第8条), en.md 49 「([Article 372](…J0080001…), paragraph 1)」(앞 법 이름은 en:41 Business Tax Act; Company Act는 en:29가 마지막), en.md 53 「Under [Article 386](…J0080001…)」(바로 앞 en:51은 Statute for Investment by Foreign Nationals Article 4·8)
- 문제: 1027 G2/ASTRA-FAIL-fixed-1.md 2번과 같은 유형(링크는 맞지만 外國人投資條例·營業稅法에는 372·386조가 없다).
- 수정안: ko:57 「회사법 제372조」, ja:45 「会社法第386条」, en:49 「Company Act Article 372」, en:53 「Company Act Article 386」.
- 해당 판: ko·ja·en

### 7. FAIL(MINOR) — ko: 노동자퇴직금 적립을 적용 대상 조건 없이 써서 외국인 직원에게도 붙는 것처럼 읽힌다
- 파일:줄 — ko.md 61
- 원문 인용: 「…재직 중인 외국인 직원도 포함합니다. 퇴직금도 있습니다. 고용주는 [노동자퇴직금조례 제6조]에 따라 매월 퇴직금을 적립합니다.」
- 문제: 勞工退休金條例 제6조는 「雇主應為適用本條例之勞工」이고, 적용 대상은 제7조가 본국적 근로자와 국민 배우자로 거류 허가를 받은 외국인, 영주권 외국인 등으로 한정한다. '외국인 직원도 포함'(노동보험) 바로 뒤에 조건 없이 이어져, 일반 외국인 직원도 노동퇴직금 적립 대상인 것처럼 읽힌다. ja:29 「対象となる労働者」, en:69 "each covered worker's"는 한정어를 둔다. 1027 G2/ASTRA-FAIL-fixed-4.md 2번(勞退條例 7조 '호적이 있는 국민' 조건 누락)과 같은 유형.
- 근거: research/law/N0030020-6.txt, research/law/N0030020-7.txt(이번에 저장, 제1항 제1~4호).
- 수정안: 「퇴직금도 있습니다. 대만 국적 직원처럼 노동자퇴직금조례가 적용되는 근로자라면 고용주가 매월 퇴직금을 적립합니다(제6조, 적용 대상은 제7조).」 출처 목록에 제7조 추가.
- 해당 판: ko

### 8. FAIL(MINOR) — ko: 작성 지시가 본문에 드러난 예고 문장
- 파일:줄 — ko.md 23
- 원문 인용: 「셀러와 플랫폼이 어떤 계약을 맺는지는 기사에 없습니다. 그래서 이 글도 특정 플랫폼의 구조를 짐작하지 않습니다.」
- 문제: 둘째 문장은 TASK 지시('쿠팡 내부 계약 구조는 추측하지 않는다')를 독자에게 그대로 알리는 글 운영 예고다. 1027 G1/ASTRA-FAIL-fixed-5.md 2번('작성 지시가 본문에 그대로 드러난 문장'), EDITORIAL-VOICE '글을 어떻게 전개할지 예고하는 문장은 생략'.
- 수정안: 둘째 문장을 지운다. 첫 문장만으로 '기사에 없음'이 전해진다(의미 손실 없음).
- 해당 판: ko

### 9. 권고 — en: 근거 없는 일반화와 371조 적용을 단정하는 문장
- 파일:줄 — en.md 23, en.md 29(마지막 문장)
- 원문 인용: en:23 "Most US brands selling into Taiwan through a marketplace never come near it, because an order shipped from the US is the buyer's import." / en:29 "For a US brand running Taiwan stock in the parent's name, that exposure falls on whoever conducts the business in Taiwan for the parent."
- 문제: 'Most US brands'는 출처 없는 통계성 일반화(1027 G6/ASTRA-FAIL-fixed-1.md 8번 'es에 근거 없는 일반화' 유형). en:29는 '모회사 이름으로 대만 재고를 운영'이 곧 371조의 境內 營業이라고 전제한다. 이 글 스스로 제3자 창고가 고정 영업장소인지 미정이라고 쓰고(en:37), ja:35는 「どう説明するかを避けて通れません」, ko:51은 '회사법도 따로 묻습니다'로 열어 둔다 — en만 단정이 강하다. es:49 「En el esquema descrito, la persona que actúa en Taiwán es usted.」도 같은 방향(가족 회사가 청구하고 본인이 대만에서 판매를 관리하는 장면이라 근거는 더 있음).
- 수정안: en:23 "A US brand that ships each order from the US does not come near it, because…". en:29 "If running Taiwan stock in the parent's name counts as doing business in Taiwan, the exposure falls on whoever conducts that business for the parent." es:49는 «…lo más probable es que la persona que actúa en Taiwán sea usted» 정도로.
- 해당 판: en(·es)

### 10. 권고 — ko 숫자·표기 세부
- ko.md 21 「1만 곳을 넘는다고」 — 원문(research/G1-genews.html) "1만 곳 이상이다". '넘는다'와 '이상'은 범위가 다르다 → 「1만 곳 이상이라고」.
- ko.md 73 「통일영수증(統一發票)를 쓰며」 — 조사 오류. 사이트 ko 관례도 「통일영수증(統一發票)을」(ship 리포 columns/ grep 6건 모두 '을/은') → 「통일영수증(統一發票)을」.
- ko.md 61 「5명 이상을 고용한 회사의 직원을 고용주를 보험 가입 단위(投保單位)로 해 노동보험에 가입시키고」 — 목적격 '을/를' 두 번이 겹쳐 읽기 어렵다 → 「5명 이상을 고용한 회사의 직원은 고용주를 가입 단위(投保單位)로 노동보험에 가입하고」.
- ko 「~할 수 있습니다」 5회(SENTENCE-VARIETY 3절 ko 메모 '각각 한 편에 4번까지') — 하나를 다른 어미로(예: ko:69 「소비자 소송은 소비관계가 생긴 곳의 법원에도 낼 수 있습니다」 → 「…법원도 관할합니다」).

### 11. 권고 — ja 용어·표기와 기존 ja 348 겹침
- ja.md 14·61 「速達便（快遞）」 — 일본어 '速達'은 우편 속달(郵便)로 읽혀, 財政部가 郵包와 따로 다루는 快遞(특송·쿠리어)과 섞인다 → 「国際宅配便（快遞）」 또는 「クーリエ便（快遞）」. es 「envíos urgentes」도 우편 속달로 읽힐 수 있어 «envíos por mensajería urgente (快遞)»가 낫다.
- ja.md 59 「台湾の税務署に申告する場面」 — 대만 기관은 본문 다른 곳처럼 「国税局」.
- ja.md 「2,000台湾元」「15万台湾元」 — 최근 ja 배포본 952~957은 「台湾ドル」만 18회 사용(ship 리포 columns-ja grep). 표기 통일 권고.
- ja.md 61 소액 면세 단락은 ja 348(https://tseng-law.com/ja/columns/taiwan-cross-border-ecommerce-consumer-protection-japanese-sellers 「関税と通関：購入者側に起きること」, 2,000·半年度 6回)과 같은 내용 → 한 문장으로 줄이고 348 링크로 넘기면 겹침이 준다(지적 1 수정과 함께).

### 12. 권고 — zh 도입·맺음의 가상 장면 표시
- 파일:줄 — zh.md 21, 73
- 원문 인용: zh:21 「在購物平台向海外賣家買的保養品，用了之後皮膚出問題，該找平台…？」 / zh:73 「回到那瓶保養品。」
- 문제: 도입은 일반 질문형이지만 맺음이 「那瓶保養品」으로 돌아가 특정 장면처럼 된다. 1027 G1/ASTRA-FAIL-fixed-1.md 8번(zh 도입 장면과 마무리 회수에 가상 표시 없음, MINOR)과 같은 모양. 게이트가 같은 기준을 쓰면 걸릴 수 있다.
- 수정안: zh:21 문장 끝에 「（虛構情境）」를 붙이거나, zh:73을 「回到開頭的問題」처럼 장면이 아닌 질문으로 회수.
- 해당 판: zh

## 점검했고 문제 없음
- 조문 원문 대조: 營業稅法 1·2(1·2호)·4①1·6(3·4호)·28·41, 公司法 371①②(벌칙·併科·민사·연대)·372①②(5년, 50만~250만)·386①, 外國人投資條例 4·8①③(1개월/2개월), 消保法 2(2·10호)·7(무과실 감경)·9·18(①·②)·19(①③ 7일·다음 날·4개월)·47, 勞保條例 6①2·③, 就業服務法 43·48①2 — 다섯 판 모두 문구·번호 일치(지적 5·7 제외).
- 財政部 稅務入口網 4개 페이지 재수집 대조: 2,000元·菸酒/관세할당 제외·郵包 收件人 半年度 逾6次·快遞 納稅義務人 第7次起·同批 分開申報 금지, 5% 세액식, 起徵點 10만/5만(114.1.1부터), 20만 미만 1% 按季, 20만 초과 統一發票 5% 2개월, 營利所得 합산, 小玉 사례(2만→1,000, 統一發票 營業人 전액 扣抵), 團購網 買進賣出/代銷手續費 — 모두 원문대로. 갱신일(115-09-11, 115-09-15, 114-02-05)도 출처 목록과 일치.
- 經濟部 gcis t70049: 대륙 자본 30% 초과·지배력 → 지점 신청 전 投資審議司 허가 — 원문대로.
- 뉴스: 1만 곳·타오위안 4번째 스마트 물류센터·약 70% 지역 주말 익일배송·통관·배송·마케팅 지원 — 원문 대조 일치(지적 10 '넘는다' 제외). 쿠팡·글로벌이코노믹 언급은 ko에만 있음(zh·ja·en·es grep 0). 쿠팡 계약 구조 추측 없음.
- 본국 제도 비교: ja·en·es 모두 본국 법 주장 없음(출처 없는 본국 법 단정 0).
- 연락처: 다섯 판 wei@hoveringlaw.com.tw 1회, 주소 台北市/臺北市大同區承德路一段35號7樓之2(각 언어 표기, en·es 103 포함), 昊鼎國際法律事務所·Hovering International Law Firm 표기가 952~957 배포본 관례와 같음, 전화번호 없음(verify.sh phone 카운트는 消保法 18조의 '전화/電話' 언급), en "English-speaking lawyer in Taipei" 있음. 曾雋崴 이름은 쓰지 않음(문제 아님).
- 바이라인·저자 줄·AI 표시·'변호사 검토 완료' 없음, 볼드·이모지 0, author "legal-ai-assistant"만.
- front matter: verify.sh 필수 키 누락 0, published·lastmod 2026-10-28, featured_image "TBD"(1027 초안과 같은 방식; featured_image_caption은 배포본에만 있고 1027 초안에도 없었음), audience ko/zh-hant/ja/en/es, FAQ 3개, topic "company"(배포본 26편 사용), date_display·read_time·categories 형식이 954 배포본과 같음.
- variety_metrics: 다섯 판 FAIL 0(ko WARN '니다.' 75%만).
- 링크: links2.py 49개 모두 200, 내부 링크 모두 같은 언어(/ko·/zh-hant·/ja·/en·/es) 칼럼·서비스 페이지.
- 이미지: /tmp/opusB-hero/G1.png 실물(빈 라벨 상자 더미, 나무 작업대, 추상 그래프 노트북, 디지털 저울, 투명 테이프·커터, 펜 올린 흰 종이, 금속 선반의 서류철·화분, 창밖 건물·나무)과 다섯 판 alt·images/G1-brief.txt 일치. 노트북 화면의 작은 선은 읽히는 글자 아님.
- 중복: ko 001·004·256·381·325, zh 384·539, ja 348과 같은 독자 질문 아님(링크로 넘김; ja 348과의 부분 겹침은 지적 11). ~/tseng-issues-1028 TASK가 G1 주제(쿠팡)를 사전 제외, 이슈 초안에 같은 주제 없음.
- 투자 권유·결과 보장 문구 없음. slug 이상 없음.
