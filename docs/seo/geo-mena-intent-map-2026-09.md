# MENA 7국 × 6의도 인텐트 지도 — 2026-09 (M1)

작성: 2026-09-16 · 워크오더 `docs/seo/mena-plan/WO-M1-INTENT.txt` · 작업트리 `tseng-law-mena-20260916`
목적: AE·SA·QA·KW·BH·OM·EG 사용자가 대만 법률 문제를 검색·질의할 때의 의도를 42셀로 고정하고, 각 셀에 **실존하는** 대응 URL과 **A/B 출처가 붙은** 우선순위를 붙인다.

## 1. 요약

1. **A급 체류 통계는 결론을 한 방향으로 못 박는다.** 2026-07-31 기준 대만의 유효 외국인 거류증 보유자 중 이 7국 국적자는 **埃及 277 · 沙烏地阿拉伯 5 · 巴林 3 · 阿曼 2 · 阿拉伯聯合大公國 1**이다(S1). **卡達·科威特는 원표의 국적 항목 자체가 없어 "미확인"이며 0으로 단정하지 않는다.** 확인된 5국 합계는 288명이다. 같은 표의 비교값은 土耳其 487 · 伊朗 318 · 以色列 233 · 約旦 165다. 동남아 레인의 같은 표 값(印尼 383,535 · 越南 355,203, `docs/seo/sea-intent-map-2026-09.md` §2.1)과 비교하면 **세 자릿수 대 여섯 자릿수**, 즉 1/1,000 수준이다.
2. 따라서 **"사람이 대만 안에 있어야 성립하는 의도"(④ 비자·거류·취업 / ⑤ 상속·가족 / ⑥ 형사·사고)에는 A급 규모 근거로 H를 줄 수 없다.** 이 세 의도에서 H는 埃及 ④ 한 셀뿐이며, 그 H도 "7국 범위 안에서의 상대 1위(체류 277·學生 44·外籍配偶 47, 전부 S1·S2)"라는 뜻이지 절대 규모가 크다는 뜻이 아니다.
3. **순위를 세울 수 있는 유일한 축은 B급 무역이다.** 2025년 대만의 **해당국向 수출**은 AE 15.85억 → SA 약 9.35억 → EG 3억1,186만 → KW 1억3,266만 → QA 약 6,800만 → BH 3,325만 미국달러 순이고 **OM은 외교부 페이지가 품목만 싣고 금액을 싣지 않아 미확인**이다(S3). 반대 방향(대만의 수입)은 SA 약 73.26억 · QA 약 55.57억 · AE 45.04억으로 훨씬 크지만 **원유·LNG 중심의 에너지 조달**이라 민간 법률수요의 대리지표로 쓰지 않았다(S3 각국 `主要輸出項目`). H 7셀 중 6셀(AE ①②③ · SA ①②③)은 이 수출 순위 1·2위에만 부여했다.
4. **아랍어 표면은 42셀 전부 0이다.** `ar`는 코드 어디에도 로케일로 존재하지 않는다 — `src/lib/public-guidance.ts` 13–23 `PUBLIC_LOCALES_8`(ko·zh-hant·en·ja·vi·id·th·fil), `src/middleware.ts` 318–319 matcher `(vi|id|th|fil)`. 따라서 §2 `현재 대응 URL` 열에 적힌 URL은 **전부 영어 표면**이며, 아랍어 사용자가 자기 질문 언어로 읽을 수 있는 페이지는 이 문서 작성 시점에 **한 장도 없다**.
5. `현재 대응 URL`이 **"없음"인 셀은 10개**다 — ② 중재·외국판정 집행을 대표 질문으로 둔 3셀(AE·SA·QA)과 ④ 비자·거류·취업 7셀 전부다. 앞의 3셀은 `grep -rli "arbitrat" src/` = **0건**, `grep -rl "仲裁" src/` = **0건**이라는 사실이 근거고, 뒤의 7셀은 비자·거류를 **주제로 하는 전용 페이지**가 `intentPageSlugs`·`GUIDANCE_CORE_ROUTE_KEYS`·`STATIC_PATHS` 어디에도 없다는 사실이 근거다(§4.7).
6. **"없음 + H"는 3셀**(AE ② · SA ② · EG ④)이고 여기서 신규 페이지 후보 **4개**가 나온다(§3). **E등급(추정) 근거로 H를 준 셀은 0이다** — H 7셀의 근거는 전부 A(S1·S2) 또는 B(S3)다.

### 이 문서가 주장하지 않는 것

- **검색량·CTR·트래픽 수치는 한 건도 적지 않는다**(WO 금지 항목). `검색 표면` 열은 실측이 아니라 **가설**이며, 거기 붙은 점유율은 검색엔진 시장점유(S5, C등급)일 뿐 이 사무소의 유입이 아니다.
- **아랍어권 사용자의 영어 검색 병용 비율은 미확인이다.** A/B급 출처를 찾지 못했다. "걸프 지역은 영어가 통하니 EN 페이지로 충분하다"류의 명제를 우선순위 근거로 쓰지 않았다.
- **중동의 AI 검색(챗봇·생성형 답변) 사용 비율도 미확인이다.** S5는 전통 검색엔진 점유만 제공한다. `검색 표면` 열의 `AI 미확인`은 그 뜻이다.
- **經濟部 투자심의司의 국가별 투자통계는 확인하지 못했다** — 통계 링크 페이지(`moea.gov.tw/Mns/dos/content/ContentLink.aspx?menu_id=6848`)가 2026-09-16 조회 시 HTTP 403을 반환했다. 따라서 "MENA 자본의 대만 투자 건수·금액"은 이 문서 어디에도 숫자로 나오지 않는다.
- 승소율·성공 보장 표현은 이 문서와 신규 페이지 초안 어디에도 쓰지 않았다. WO 금지 토큰의 실제 출현 횟수와 그 성격은 §7에 **세어서** 적었다(0건이라고 뭉뚱그리지 않았다).

### 언어 계약 (이 문서 전체에 적용)

`ar`는 **안내(guidance) 언어**다. `대표 질문(아랍어 MSA)` 열은 **사용자가 검색창·AI에 입력할 문장**이지 사무소가 그 언어로 상담한다는 표시가 아니다. **변호사 상담 언어는 English / Chinese / Japanese / Korean 뿐이다.** 사이트의 기존 문장 그대로다 — `src/data/intent-pages.ts` 436·530·621 "The firm provides consultations in English, Chinese, Korean, and Japanese, in person or by video." 자기점검은 §7.

### 표 읽는 규칙 (§2 전체에 적용)

- **`현재 대응 URL` = 그 셀의 대표 질문에 실제로 답하는 실존 URL.** 로케일은 묻지 않는다. `ar` 페이지는 0장이므로(§1-4) 여기 적히는 것은 전부 영어 표면이다. 영어 표면조차 그 질문에 답하지 않으면 **"없음"**이다. 실존 판정 근거는 §4.
- **`우선순위`는 이 문서 7국 범위 안에서의 상대 순위다.** H가 "절대 규모가 크다"는 뜻이 아니다(§1-1·§1-2).
- **`이유` 열의 출처 코드**(S1~S6)는 §5 출처 표를 가리킨다. 코드 없는 규모·비율은 쓰지 않았다.
- **아랍어 문장은 MSA(현대표준아랍어) 검색어 어투로 작성했고, 원어민 검수는 받지 않았다.** GOAL.md 보드의 M1-c(Grok 검수) 대상이다.

## 2. 매트릭스 (7국 × 6의도 = 42셀)

의도 코드: ① 회사설립·투자·대만 진출 · ② 소송·계약분쟁 · ③ 미수금·채권회수 · ④ 비자·거류·취업 · ⑤ 상속·가족 · ⑥ 형사·사고

| 국가 | 의도 | 대표 질문(아랍어 MSA) | 대표 질문(영어) | 검색 표면(가설) | 현재 대응 URL | 우선순위 | 이유(1줄) |
|---|---|---|---|---|---|---|---|
| AE | ① 회사설립·투자 | كيف أؤسس شركة في تايوان وأنا في الإمارات وما المستندات المطلوبة؟ / ما الفرق بين الشركة التابعة والفرع عند دخول السوق التايواني؟ | How do I set up a company in Taiwan from the UAE and what documents are required? / Subsidiary or branch — which is used to enter the Taiwanese market? | 구글 95.8% · Bing 2.37%(S5, 2026-08) · AI 미확인 | https://tseng-law.com/en/taiwan-company-setup-lawyer | H | 2025년 대만→UAE 수출 15.85억 미국달러로 7국 1위(S3) · 我 駐杜拜臺北商務辦事處 소재(S3·S4) · 아랍어 표면 0 |
| AE | ② 소송·계약분쟁 | عقدنا مع شركة تايوانية ينص على التحكيم في دبي، فكيف ننفذ حكم التحكيم في تايوان؟ / هل تعترف المحاكم التايوانية بأحكام التحكيم الأجنبية؟ | Our contract with a Taiwanese company provides for arbitration in Dubai — how is the award enforced in Taiwan? / Do Taiwanese courts recognise foreign arbitral awards? | 구글 95.8% · Bing 2.37%(S5) · AI 미확인 | 없음 | H | 수출 1위(S3)의 계약 분쟁인데 **중재·외국판정 집행 문서가 사이트 전체에 0건**(S6: `grep -rli "arbitrat" src/`=0, `仲裁`=0) |
| AE | ③ 미수금·채권회수 | شركة تايوانية لم تسدد الفواتير المستحقة، كيف أحصل على مستحقاتي؟ / ما خطوات تحصيل الدين التجاري من شركة في تايوان؟ | A Taiwanese company has not paid the outstanding invoices — how do I recover the amount? / What are the steps to collect a commercial debt from a company in Taiwan? | 구글 95.8% · Bing 2.37%(S5) · AI 미확인 | https://tseng-law.com/en/taiwan-litigation-lawyer | H | 수출 1위(S3) · EN 랜딩 FAQ가 미수금·계약위반을 직접 다룸(S6: `intent-pages.ts` 630·687) · 아랍어 표면 0 |
| AE | ④ 비자·거류·취업 | ما شروط الحصول على تصريح إقامة في تايوان بعد تأسيس شركة؟ / هل تسجيل الشركة في تايوان يمنح الإقامة تلقائيا؟ | What are the requirements for a Taiwan residence permit after setting up a company? / Does registering a company in Taiwan automatically grant residence? | 구글 95.8% · Bing 2.37%(S5) · AI 미확인 | 없음 | M | 직접 모수는 대만 내 UAE 국적 거류자 **1명**(S1)뿐 — M은 ①(B급 무역)에서 파생한 가설이지 A급 체류 근거가 아니다 · 비자·거류 전용 페이지 0(§4.7) |
| AE | ⑤ 상속·가족 | كيف توزع تركة شخص توفي وله أموال أو أسهم في تايوان؟ / هل تعترف تايوان بوصية محررة خارجها؟ | How is the estate of a person who died leaving assets or shares in Taiwan distributed? / Does Taiwan recognise a will made abroad? | 구글 95.8% · Bing 2.37%(S5) · AI 미확인 | https://tseng-law.com/en/columns/taiwan-inheritance-custody-analysis | L | 대만 내 UAE 국적 거류 1명(S1), 외국인 배우자는 원표 국적 항목 없음(S2 미확인) · 해외 유언·외국판결 승인은 EN 칼럼 §8이 이미 다룸 |
| AE | ⑥ 형사·사고 | ماذا أفعل إذا استدعتني الشرطة في تايوان؟ / ما حقوق الأجنبي أثناء التحقيق في تايوان؟ | What should I do if the police in Taiwan summon me? / What rights does a foreign national have during questioning in Taiwan? | 구글 95.8% · Bing 2.37%(S5) · AI 미확인 | https://tseng-law.com/en/services/criminal | L | 대만 내 UAE 국적 거류 1명(S1) · 국적별 사건 발생 통계 미확인 · (범위 안내) |
| SA | ① 회사설립·투자 | ما إجراءات تأسيس شركة في تايوان لمستثمر سعودي وكم تستغرق؟ / هل يحتاج المستثمر الأجنبي إلى موافقة استثمار قبل التسجيل في تايوان؟ | What is the procedure and timeline for a Saudi investor to set up a company in Taiwan? / Does a foreign investor need investment approval before company registration in Taiwan? | 구글 95.76% · Bing 2.82%(S5, 2026-08) · AI 미확인 | https://tseng-law.com/en/taiwan-company-setup-lawyer | H | 2025년 대만→사우디 수출 약 9.35억 미국달러로 7국 2위(S3) · 我 駐沙烏地阿拉伯王國臺北經濟文化代表處 + 吉達분처(S3·S4) · 아랍어 표면 0 |
| SA | ② 소송·계약분쟁 | شرط التحكيم في عقد التوريد مع مورد تايواني، أين نرفع النزاع؟ / هل يمكن تنفيذ حكم صادر خارج تايوان ضد شركة تايوانية؟ | Our supply contract with a Taiwanese supplier has an arbitration clause — where do we bring the dispute? / Can a judgment issued outside Taiwan be enforced against a Taiwanese company? | 구글 95.76% · Bing 2.82%(S5) · AI 미확인 | 없음 | H | 수출 2위(S3)의 계약 분쟁인데 **중재·외국판정 집행 문서 0건**(S6: `grep` 결과 §4.7) |
| SA | ③ 미수금·채권회수 | دفعنا مقدما لمورد تايواني ولم نستلم البضاعة، كيف نسترد المبلغ؟ / هل يمكن الحجز التحفظي على أموال الشركة التايوانية قبل الحكم؟ | We paid a Taiwanese supplier in advance and never received the goods — how do we recover the money? / Can the Taiwanese company's assets be provisionally attached before judgment? | 구글 95.76% · Bing 2.82%(S5) · AI 미확인 | https://tseng-law.com/en/taiwan-litigation-lawyer | H | 수출 2위(S3) · EN 랜딩 FAQ가 미수금·집행 선택지를 다룸(S6: `intent-pages.ts` 687) · 보전처분 전용 문서는 없음 · 아랍어 표면 0 |
| SA | ④ 비자·거류·취업 | كيف يحصل موظف منتدب إلى تايوان على تصريح عمل وبطاقة إقامة؟ / أين أقدم طلب تأشيرة تايوان من السعودية؟ | How does an employee assigned to Taiwan obtain a work permit and residence card? / Where do I apply for a Taiwan visa from Saudi Arabia? | 구글 95.76% · Bing 2.82%(S5) · AI 미확인 | 없음 | M | 직접 모수는 대만 내 사우디 국적 거류자 **5명**(S1) — M은 ①(B급 무역) 파생 가설 · 비자·거류 전용 페이지 0(§4.7) |
| SA | ⑤ 상속·가족 | ما إجراءات نقل ملكية عقار أو حصة شركة في تايوان إلى الورثة؟ / ما المستندات المطلوبة لإثبات صفة الوارث أمام الجهات التايوانية؟ | What is the procedure to transfer Taiwanese property or a company share to the heirs? / What documents prove heirship before Taiwanese authorities? | 구글 95.76% · Bing 2.82%(S5) · AI 미확인 | https://tseng-law.com/en/columns/taiwan-inheritance-custody-analysis | L | 대만 내 사우디 국적 거류 5명·외국인 배우자 3명(S1·S2) · 해외 유언·상속 절차는 EN 칼럼 §2·§8이 이미 다룸 |
| SA | ⑥ 형사·사고 | هل أحتاج محاميا عند التحقيق في مطار أو جمارك تايوان؟ / ما إجراءات الإفراج بكفالة في تايوان؟ | Do I need a lawyer when questioned at a Taiwanese airport or by customs? / What is the bail procedure in Taiwan? | 구글 95.76% · Bing 2.82%(S5) · AI 미확인 | https://tseng-law.com/en/services/criminal | L | 대만 내 사우디 국적 거류 5명(S1) · 국적별 사건 발생 통계 미확인 · (범위 안내) |
| QA | ① 회사설립·투자 | هل يمكن لشركة قطرية فتح فرع لها في تايوان؟ / ما الحد الأدنى لرأس المال لتأسيس شركة في تايوان؟ | Can a Qatari company open a branch in Taiwan? / What is the minimum capital to establish a company in Taiwan? | 구글 95.63% · Bing 3.28%(S5, 2026-08) · AI 미확인 | https://tseng-law.com/en/taiwan-company-setup-lawyer | M | 2025년 대만→카타르 수출 약 6,800만 미국달러로 7국 5위(S3) — 수입 약 55.57억은 LNG 조달이라 대리지표로 쓰지 않음 · 아랍어 표면 0 |
| QA | ② 소송·계약분쟁 | ما المحكمة المختصة في نزاع تجاري مع شركة تايوانية إذا لم يحدد العقد؟ / كيف ينفذ حكم التحكيم الدولي في تايوان؟ | Which court has jurisdiction over a commercial dispute with a Taiwanese company when the contract is silent? / How is an international arbitral award enforced in Taiwan? | 구글 95.63% · Bing 3.28%(S5) · AI 미확인 | 없음 | M | 중재·국제재판관할 문서 0건(S6)이나 수출 규모가 5위(S3)라 H를 주지 않음 |
| QA | ③ 미수금·채권회수 | ما مدة التقادم للمطالبة بدين تجاري في تايوان؟ / هل خطاب الإنذار القانوني خطوة ضرورية قبل رفع الدعوى في تايوان؟ | What is the limitation period for a commercial debt claim in Taiwan? / Is a formal demand letter a necessary step before filing suit in Taiwan? | 구글 95.63% · Bing 3.28%(S5) · AI 미확인 | https://tseng-law.com/en/taiwan-litigation-lawyer | M | 수출 5위(S3) · EN 랜딩 FAQ가 미수금과 소 제기 전 사전 통지·합의 단계를 다룸(S6: `intent-pages.ts` 687) · 아랍어 표면 0 |
| QA | ④ 비자·거류·취업 | أين أقدم طلب تأشيرة تايوان وأنا في قطر؟ / ما الفرق بين تأشيرة الزيارة وتصريح الإقامة في تايوان؟ | Where do I apply for a Taiwan visa from Qatar? / What is the difference between a visitor visa and a residence permit in Taiwan? | 구글 95.63% · Bing 3.28%(S5) · AI 미확인 | 없음 | L | 我 공관이 카타르에 없고 駐沙烏地阿拉伯代表處가 兼轄(S3·S4)이라 질문 자체는 실재하나, 대만 내 카타르 국적 거류 통계는 **원표 국적 항목 없음 → 미확인**(S1)이므로 규모로 올리지 않음 |
| QA | ⑤ 상속·가족 | هل يعترف القانون التايواني بالطلاق الصادر خارج تايوان؟ / ما القانون الواجب التطبيق على الميراث إذا كان المتوفى أجنبيا؟ | Does Taiwanese law recognise a divorce granted outside Taiwan? / Which law applies to succession when the deceased was a foreign national? | 구글 95.63% · Bing 3.28%(S5) · AI 미확인 | https://tseng-law.com/en/columns/taiwan-divorce-lawsuit-qna | L | 체류·외국인 배우자 모두 원표 국적 항목 없음(S1·S2 미확인) · 외국 이혼 승인·준거법은 EN 칼럼이 이미 다룸 |
| QA | ⑥ 형사·사고 | تعرضت لحادث مروري في تايوان، ما الإجراءات والتعويض؟ / هل ترفع الدعوى الجنائية والمدنية معا بعد الحادث في تايوان؟ | I was in a traffic accident in Taiwan — what are the procedures and compensation? / Are criminal and civil claims pursued together after an accident in Taiwan? | 구글 95.63% · Bing 3.28%(S5) · AI 미확인 | https://tseng-law.com/en/columns/taiwan-traffic-accident-procedure | L | 체류 통계 미확인(S1) · 국적별 사고 통계 미확인 · 교통사고 절차 EN 칼럼 2편이 이미 존재 |
| KW | ① 회사설립·투자 | ما خطوات تسجيل شركة في تايوان لمستثمر كويتي؟ / هل يشترط وجود شريك محلي أو مدير مقيم لتأسيس شركة في تايوان؟ | What are the steps for a Kuwaiti investor to register a company in Taiwan? / Does a Taiwan company require a local partner or a resident director? | 구글 95.22% · Bing 3.64%(S5, 2026-08) · AI 미확인 | https://tseng-law.com/en/taiwan-company-setup-lawyer | M | 2025년 대만→쿠웨이트 수출 1억3,266만 미국달러로 7국 4위, 양방향 총액 29억1,869만(대만 제27대 교역상대, S3) · 아랍어 표면 0 |
| KW | ② 소송·계약분쟁 | هل يمكن مقاضاة شركة تايوانية دون السفر إلى تايوان؟ / ما خيارات تسوية النزاع التجاري مع طرف تايواني قبل التقاضي؟ | Can a Taiwanese company be sued without travelling to Taiwan? / What settlement options exist before litigating a commercial dispute with a Taiwanese party? | 구글 95.22% · Bing 3.64%(S5) · AI 미확인 | https://tseng-law.com/en/taiwan-litigation-lawyer | M | 이 대표 질문(원격 진행·사전 합의)은 EN 랜딩 FAQ가 직접 답함(S6: `intent-pages.ts` 683·687) · 수출 4위(S3) |
| KW | ③ 미수금·채권회수 | كيف أتحقق من ملاءة شركة تايوانية قبل التقاضي؟ / ما تكلفة تحصيل الدين من شركة تايوانية مقارنة بقيمة المطالبة؟ | How do I check whether a Taiwanese company can actually pay before litigating? / How does the cost of recovering a debt in Taiwan compare with the claim value? | 구글 95.22% · Bing 3.64%(S5) · AI 미확인 | https://tseng-law.com/en/taiwan-litigation-lawyer | M | 수출 4위(S3) · 회수 실익 판단은 EN 랜딩 FAQ가 다룸(S6) · 아랍어 표면 0 |
| KW | ④ 비자·거류·취업 | ما أنواع تأشيرات تايوان ومدة كل منها؟ / هل يمكن تحويل تأشيرة الزيارة إلى إقامة داخل تايوان؟ | What types of Taiwan visas exist and how long is each valid? / Can a visitor visa be converted into residence inside Taiwan? | 구글 95.22% · Bing 3.64%(S5) · AI 미확인 | 없음 | L | 대만 내 쿠웨이트 국적 거류 통계는 **원표 국적 항목 없음 → 미확인**(S1) · 비자·거류 전용 페이지 0(§4.7) |
| KW | ⑤ 상속·가족 | ما حقوق الزوج الأجنبي في الميراث بتايوان؟ / هل يجب تصديق وثيقة الزواج الأجنبية لاستخدامها في تايوان؟ | What are a foreign spouse's inheritance rights in Taiwan? / Must a foreign marriage certificate be legalised for use in Taiwan? | 구글 95.22% · Bing 3.64%(S5) · AI 미확인 | https://tseng-law.com/en/columns/taiwan-divorce-lawsuit-qna | L | 체류·외국인 배우자 모두 미확인(S1·S2) · 외국 혼인문서 인증은 EN 칼럼이 이미 다룸 |
| KW | ⑥ 형사·사고 | ما عقوبة مخالفة أنظمة التصدير أو الجمارك في تايوان؟ / كيف أوكل محاميا في تايوان وأنا خارجها في قضية جنائية؟ | What penalties apply for breaching Taiwanese export or customs rules? / How do I instruct a lawyer in Taiwan from abroad in a criminal matter? | 구글 95.22% · Bing 3.64%(S5) · AI 미확인 | https://tseng-law.com/en/services/criminal | L | 체류 미확인(S1) · 수출관리·관세 형사 주제 전용 문서는 없고 (범위 안내)만 존재 |
| BH | ① 회사설립·투자 | كيف تسجل شركة بحرينية شركة تابعة في تايوان؟ / ما تكلفة ومدة تأسيس شركة في تايوان؟ | How does a Bahraini company register a subsidiary in Taiwan? / What does Taiwan company setup cost and how long does it take? | 구글 97.33% · Bing 2.05%(S5, 2026-08) · AI 미확인 | https://tseng-law.com/en/taiwan-company-setup-lawyer | L | 2025년 대만→바레인 수출 3,325만 미국달러로 7국 최소 구간(S3) · 대만 내 바레인 국적 거류 3명(S1) · 아랍어 표면 0 |
| BH | ② 소송·계약분쟁 | كم تستغرق الدعوى التجارية أمام المحاكم التايوانية؟ / ما القانون الواجب التطبيق على عقد مع شركة تايوانية؟ | How long does a commercial case take in the Taiwanese courts? / Which law governs a contract with a Taiwanese company? | 구글 97.33% · Bing 2.05%(S5) · AI 미확인 | https://tseng-law.com/en/taiwan-litigation-lawyer | L | 수출 규모가 7국 최소 구간(S3) · 소요기간·준거법 질문은 EN 랜딩이 다루는 범위 안 |
| BH | ③ 미수금·채권회수 | شركة تايوانية متأخرة عن السداد، ما خياراتي القانونية؟ / هل يمكن تحصيل الدين وديا دون رفع دعوى في تايوان؟ | A Taiwanese company is in default on payment — what are my legal options? / Can the debt be settled amicably without filing a case in Taiwan? | 구글 97.33% · Bing 2.05%(S5) · AI 미확인 | https://tseng-law.com/en/taiwan-litigation-lawyer | L | 수출 3,325만(S3)로 모수 최소 · EN 랜딩 FAQ가 합의·소송 비교를 다룸(S6) |
| BH | ④ 비자·거류·취업 | ما مستندات طلب تأشيرة العمل في تايوان؟ / كم تستغرق إجراءات تصريح الإقامة في تايوان؟ | What documents are required for a Taiwan work visa? / How long does the Taiwan residence permit procedure take? | 구글 97.33% · Bing 2.05%(S5) · AI 미확인 | 없음 | L | 대만 내 바레인 국적 거류 3명(S1) · 비자·거류 전용 페이지 0(§4.7) |
| BH | ⑤ 상속·가족 | كيف تثبت الوصية الأجنبية أمام المحاكم التايوانية؟ / ما مدة إجراءات الميراث في تايوان للورثة المقيمين بالخارج؟ | How is a foreign will proved before Taiwanese courts? / How long do Taiwanese inheritance procedures take for heirs living abroad? | 구글 97.33% · Bing 2.05%(S5) · AI 미확인 | https://tseng-law.com/en/columns/taiwan-inheritance-custody-analysis | L | 대만 내 바레인 국적 거류 3명·외국인 배우자 1명(S1·S2) · 해외 유언 입증은 EN 칼럼 §8이 이미 다룸 |
| BH | ⑥ 형사·사고 | هل يمكن تسوية القضية الجنائية صلحا في تايوان؟ / ما مدة إجراءات التحقيق الجنائي في تايوان؟ | Can a criminal case in Taiwan be settled by agreement? / How long does a criminal investigation take in Taiwan? | 구글 97.33% · Bing 2.05%(S5) · AI 미확인 | https://tseng-law.com/en/services/criminal | L | 대만 내 바레인 국적 거류 3명(S1) · 국적별 사건 통계 미확인 · (범위 안내) |
| OM | ① 회사설립·투자 | ما إجراءات تسجيل شركة في تايوان لمستثمر أجنبي؟ / هل يمكن إنهاء إجراءات التأسيس في تايوان دون السفر إليها؟ | What is the registration procedure for a foreign investor to set up a company in Taiwan? / Can Taiwan company setup be completed without travelling to Taiwan? | 구글 95.07% · Bing 4.07%(S5, 2026-08) · AI 미확인 | https://tseng-law.com/en/taiwan-company-setup-lawyer | L | **대만-오만 쌍방 무역액은 외교부 페이지가 품목만 싣고 금액을 싣지 않아 미확인**(S3) · 대만 내 오만 국적 거류 2명(S1) · 미확인은 H·M의 근거가 되지 못함 |
| OM | ② 소송·계약분쟁 | ما الإجراءات القانونية ضد مورد تايواني لم يسلم البضاعة؟ / هل يمكن فسخ العقد والمطالبة بالتعويض وفق القانون التايواني؟ | What legal action is available against a Taiwanese supplier that failed to deliver? / Can the contract be terminated and damages claimed under Taiwanese law? | 구글 95.07% · Bing 4.07%(S5) · AI 미확인 | https://tseng-law.com/en/taiwan-litigation-lawyer | L | 무역 규모 미확인(S3) · 미이행·손해배상 질문은 EN 랜딩이 다루는 범위 안 |
| OM | ③ 미수금·채권회수 | كيف أطالب بقيمة الشحنة غير المسلمة من شركة تايوانية؟ / ما المستندات المطلوبة لإثبات الدين أمام المحاكم التايوانية؟ | How do I claim the value of an undelivered shipment from a Taiwanese company? / What documents are needed to prove the debt in Taiwanese proceedings? | 구글 95.07% · Bing 4.07%(S5) · AI 미확인 | https://tseng-law.com/en/taiwan-litigation-lawyer | L | 무역 규모 미확인(S3) · EN 랜딩 FAQ가 계약·송장·연락기록 기준 검토를 다룸(S6: `intent-pages.ts` 687) |
| OM | ④ 비자·거류·취업 | كيف أجدد بطاقة الإقامة في تايوان قبل انتهائها؟ / ماذا يحدث لتصريح الإقامة عند تغيير صاحب العمل في تايوان؟ | How do I renew a Taiwan residence card before it expires? / What happens to the residence permit when the employer changes in Taiwan? | 구글 95.07% · Bing 4.07%(S5) · AI 미확인 | 없음 | L | 대만 내 오만 국적 거류 2명(S1) · 갱신·고용주 변경 주제는 동남아 레인 후보(S6: `sea-intent-map-2026-09.md` §3 C1)와 같은 공백이며 이 레인 규모로는 우선순위가 서지 않음 |
| OM | ⑤ 상속·가족 | هل يمكن التنازل عن الإرث في تايوان وما مهلته؟ / كيف تعالج ديون التركة في تايوان؟ | Can an inheritance be waived in Taiwan and what is the deadline? / How are the debts of an estate handled in Taiwan? | 구글 95.07% · Bing 4.07%(S5) · AI 미확인 | https://tseng-law.com/en/columns/taiwan-inheritance-custody-analysis | L | 대만 내 오만 국적 거류 2명·외국인 배우자 1명(S1·S2) · 상속 포기·상속 채무는 EN 칼럼 §4가 이미 다룸 |
| OM | ⑥ 형사·사고 | كيف أطالب بالتعويض بعد إصابة في تايوان؟ / ما المستندات المطلوبة لإثبات الضرر أمام المحاكم التايوانية؟ | How do I claim compensation after an injury in Taiwan? / What documents are needed to prove the loss before Taiwanese courts? | 구글 95.07% · Bing 4.07%(S5) · AI 미확인 | https://tseng-law.com/en/columns/taiwan-traffic-accident-procedure | L | 대만 내 오만 국적 거류 2명(S1) · 상해 배상 절차 EN 칼럼 2편이 이미 존재 |
| EG | ① 회사설립·투자 | كيف أسجل شركة في تايوان وأنا مقيم في مصر؟ / ما المستندات المصرية المطلوبة وهل تحتاج تصديقا لاستخدامها في تايوان؟ | How do I register a company in Taiwan while resident in Egypt? / Which Egyptian documents are needed and do they require legalisation for use in Taiwan? | 구글 95.37% · Bing 3.29%(S5, 2026-08) · AI 미확인 | https://tseng-law.com/en/taiwan-company-setup-lawyer | M | 2025년 대만→이집트 수출 3억1,186만 미국달러로 7국 3위(S3)이면서 대만 내 체류 277명으로 7국 1위(S1) — 두 근거가 겹치는 유일한 국가 · 我 공관 없음, 駐約旦代表處 兼轄(S3) · 아랍어 표면 0 |
| EG | ② 소송·계약분쟁 | كيف أقاضي شركة تايوانية بسبب بضاعة مخالفة للمواصفات؟ / هل يعتد بالمراسلات والبريد الإلكتروني كدليل أمام المحاكم التايوانية؟ | How do I sue a Taiwanese company over goods that do not meet specification? / Are emails and correspondence accepted as evidence in Taiwanese courts? | 구글 95.37% · Bing 3.29%(S5) · AI 미확인 | https://tseng-law.com/en/taiwan-litigation-lawyer | M | 수출 3위(S3) · 계약·이메일 등 증거 기준 검토는 EN 랜딩 FAQ가 다룸(S6: `intent-pages.ts` 687) |
| EG | ③ 미수금·채권회수 | شركة تايوانية لم تسدد قيمة الشحنة، ماذا أفعل قانونيا؟ / هل يمكن توكيل محام في تايوان لتحصيل الدين نيابة عني؟ | A Taiwanese company has not paid for the shipment — what can I do legally? / Can I appoint a lawyer in Taiwan to pursue the debt on my behalf? | 구글 95.37% · Bing 3.29%(S5) · AI 미확인 | https://tseng-law.com/en/taiwan-litigation-lawyer | M | 수출 3위(S3) · 위임장 기반 원격 진행은 EN 랜딩 FAQ가 직접 답함(S6: `intent-pages.ts` 683) |
| EG | ④ 비자·거류·취업 | أين أقدم طلب تأشيرة تايوان من مصر ولا توجد بعثة تايوانية فيها؟ / ما شروط تأشيرة الدراسة في تايوان والعمل أثناء الدراسة؟ | Where do I apply for a Taiwan visa from Egypt when there is no Taiwanese mission there? / What are the requirements for a Taiwan student visa and for working while studying? | 구글 95.37% · Bing 3.29%(S5) · AI 미확인 | 없음 | H | 대만 내 이집트 국적 거류 277명(7국 1위)이고 그중 學生 44·未滿15歲 52·商務人員 30(S1), 외국인 배우자 47(S2) — 7국에서 A급 모수가 유일하게 확인되는 셀 · 我 공관 없음, 駐約旦代表處 兼轄(S3)이라 신청 창구 질문이 실재 · 비자·거류 전용 페이지 0(§4.7) |
| EG | ⑤ 상속·가족 | الزواج من مواطنة تايوانية، ما إجراءات التسجيل والحضانة بعد الطلاق؟ / هل يعتد بحكم حضانة أجنبي أمام المحاكم التايوانية؟ | Marriage to a Taiwanese national — what are the registration steps and custody rules after divorce? / Is a foreign custody judgment given effect by Taiwanese courts? | 구글 95.37% · Bing 3.29%(S5) · AI 미확인 | https://tseng-law.com/en/columns/taiwan-divorce-lawsuit-qna | M | 이집트 국적 외국인 배우자 47명(7국 1위)·未滿15歲 아동 52명(S1·S2) · 외국 양육권 판결 승인은 EN 칼럼 §8이 이미 다룸 |
| EG | ⑥ 형사·사고 | أوقفتني الشرطة في تايوان بسبب نزاع عمل، ماذا أفعل؟ / هل يؤثر البلاغ الجنائي على تصريح الإقامة في تايوان؟ | The police in Taiwan stopped me over a workplace dispute — what should I do? / Does a criminal complaint affect a Taiwan residence permit? | 구글 95.37% · Bing 3.29%(S5) · AI 미확인 | https://tseng-law.com/en/services/criminal | M | 대만 내 이집트 국적 거류 277명 중 其他(有業者) 101·家務 8(S1) · 국적별 사건 발생 통계는 미확인이라 규모 이상으로 올리지 않음 · (범위 안내) |

### 2.1 셀 수 검증

- 총 42셀 = 7국 × 6의도. 검증 명령: `grep -c "^| \(AE\|SA\|QA\|KW\|BH\|OM\|EG\) " docs/seo/geo-mena-intent-map-2026-09.md` → **42**.
- 우선순위 분포: **H 7** (AE ①②③ · SA ①②③ · EG ④) / **M 13** (QA ①②③ · KW ①②③ · EG ①②③⑤⑥ · AE ④ · SA ④) / **L 22**.
- `현재 대응 URL` = "없음" **10셀**: AE ② · SA ② · QA ② · AE ④ · SA ④ · QA ④ · KW ④ · BH ④ · OM ④ · EG ④.
- **"없음 + H" 3셀**: AE ② · SA ② · EG ④ → §3.

### 2.2 국가별 근거 요약표

| 코드 | 2025 대만→해당국 수출(S3, B) | 2025 대만←해당국 수입(S3, B) | 대만 거류자 2026-07-31(S1, A) | 외국인 배우자(S2, A) | 我 공관(S3·S4, B) | 검색엔진(S5, C, 2026-08) |
|---|---|---|---|---|---|---|
| AE(UAE) | 15.85억 미국달러 | 45.04억 | 1 | 원표 국적 항목 없음 → 미확인 | 駐杜拜臺北商務辦事處(이란·소말리아·에리트레아 兼轄) | 구글 95.8 / Bing 2.37 |
| SA(사우디) | 약 9.35억 | 약 73.26억 | 5 | 3 | 駐沙烏地阿拉伯王國臺北經濟文化代表處 + 吉達분처(카타르 등 兼轄) | 구글 95.76 / Bing 2.82 |
| QA(카타르) | 약 6,800만 | 약 55.57억 | 원표 국적 항목 없음 → 미확인 | 원표 국적 항목 없음 → 미확인 | 我 공관 없음 — 駐沙烏地阿拉伯代表處 兼轄 | 구글 95.63 / Bing 3.28 |
| KW(쿠웨이트) | 1억3,266만 | 27억8,603만(총 29억1,869만·제27대 교역상대) | 원표 국적 항목 없음 → 미확인 | 원표 국적 항목 없음 → 미확인 | 駐科威特台北商務代表處 | 구글 95.22 / Bing 3.64 |
| BH(바레인) | 3,325만 | 5,041만 | 3 | 1 | 駐巴林代表處(台灣駐巴林商務代表團) | 구글 97.33 / Bing 2.05 |
| OM(오만) | **미확인**(품목만 게재) | **미확인**(품목만 게재) | 2 | 1 | 駐阿曼王國台北經濟文化辦事處 | 구글 95.07 / Bing 4.07 |
| EG(이집트) | 3억1,186만 | 6,329만 | 277 | 47 | 我 공관 없음 — 駐約旦代表處 兼轄 + 開羅臺灣貿易中心(외무협) | 구글 95.37 / Bing 3.29 |

주석:
- S1의 직업 세목(埃及 기준): 商務人員 30 · 工程師 10 · 教師 8 · 醫師 3 · 其他(有業者) 101 · 失業 10 · 家務 8 · 學生 44 · 其他(無業者) 11 · 未滿十五足歲兒童 52. 남녀 합계는 원표의 男/女 두 칸을 더한 파생값이다(원표에는 국적별 합계 칸이 없다).
- **卡達·科威特·阿拉伯聯合大公國 일부는 원표 국적 항목 자체가 없다.** S1 시트 `07`의 국적 헤더 블록 전수를 확인했고 卡達·科威特는 어느 블록에도 나오지 않았으며, S2 시트 `27`의 국적 헤더에는 阿拉伯聯合大公國·卡達·科威特 셋 다 없다. **"항목 없음"은 "0명"이 아니다** — 0으로 바꿔 쓰지 않았다.
- AE·SA·QA의 대만 수입액이 수출액보다 한 자릿수 큰 것은 원유·LNG 조달 때문이다(S3 각국 `主要輸出項目`: 원유·천연가스·석유화학). 이 문서는 그 금액을 민간 법률수요의 대리지표로 쓰지 않았다.

## 3. "없음 + H" 셀 → 신규 페이지 후보

후보 규칙: §2에서 `현재 대응 URL` = "없음"이면서 `우선순위` = H인 셀만 후보로 만든다. 해당 셀은 **AE ② · SA ② · EG ④** 3개이고, 주제는 두 덩어리(중재·외국판정 집행 / 비자·거류)다. 로케일은 각각 en과 ar 두 벌을 제안한다 → **후보 4개**.

**언어 계약 원칙(착수 조건):** 아래 초안 어디에도 아랍어 상담·통역 제공, 회신 시간, 예약, 비용 금액, 결과 보장을 적지 않았다. 각 초안에는 **상담 언어가 English / Chinese / Japanese / Korean 넷뿐**이라는 기존 문장을 그대로 넣는다(`src/data/intent-pages.ts` 436·530·621). M1-b(WO-M3-AR-CONTENT)에서 이 문장을 약화·삭제하지 않는 것이 후보 착수의 전제다.

| # | 슬러그 | 로케일 | 커버 셀 | 1줄 답변 초안 | 근거 |
|---|---|---|---|---|---|
| C1 | `/taiwan-arbitration-award-enforcement-lawyer` | en (기존 4벌 계약상 ko·zh-hant·ja도 동시 작성, §3.1-3) | AE ②(H) · SA ②(H) — 부수적으로 QA ②(M) | "If your contract with a Taiwanese counterparty has an arbitration clause, whether the award or judgment can be given effect in Taiwan is reviewed separately from the merits of the dispute. **[변호사 검수 필요]** The firm provides consultations in English, Chinese, Korean, and Japanese, in person or by video." | 대만→AE 수출 15.85억·→SA 약 9.35억 미국달러(S3, 7국 1·2위) · 사이트 전체 중재·외국판정 집행 문서 0건(S6: `grep -rli "arbitrat" src/`=0, `grep -rl "仲裁" src/`=0) |
| C2 | 안내 코어 키 확장 필요 — 잠정 `arbitration`(경로는 `/ar/<key>`) | ar | AE ②(H) · SA ②(H) · QA ②(M) | "إذا كان عقدك مع طرف تايواني يتضمن شرط تحكيم، فإن الاعتراف بالحكم وتنفيذه في تايوان يخضع لفحص منفصل عن موضوع النزاع. **[변호사 검수 필요]** لغات الاستشارة: الإنجليزية والصينية واليابانية والكورية فقط." | C1과 동일 · `ar` 표면 0(§1-4)이라 아랍어 질문자에게 답하는 페이지가 현재 없음 |
| C3 | `/taiwan-visa-residence-lawyer` | en (동상) | EG ④(H) — 부수적으로 AE ④·SA ④(M) | "Taiwan residence and work status are applied for separately from company registration, and the application channel depends on which overseas mission covers your country. **[변호사 검수 필요]** The firm provides consultations in English, Chinese, Korean, and Japanese, in person or by video." | 대만 내 이집트 국적 거류 277·學生 44·外籍配偶 47(S1·S2, 7국 1위) · 이집트에 我 공관 없음, 駐約旦代表處 兼轄(S3·S4) · 비자·거류 전용 페이지 0(§4.7) |
| C4 | 안내 코어 키 확장 필요 — 잠정 `visa-residence`(경로는 `/ar/<key>`) | ar | EG ④(H) | "الإقامة وتصريح العمل في تايوان يقدَّم لهما طلب منفصل عن تسجيل الشركة، وجهة تقديم الطلب تتبع البعثة التي تشمل بلدك. **[변호사 검수 필요]** لغات الاستشارة: الإنجليزية والصينية واليابانية والكورية فقط." | C3과 동일 · `ar` 표면 0 |

**`[변호사 검수 필요]` 마커의 뜻:** 위 네 초안은 사이트에 현재 게재되지 않은 법률 서술(중재판정의 승인·집행이 본안과 별개라는 점, 거류·취업 자격 신청이 회사 등기와 별개라는 점)을 담는다. 이 문서는 그 명제의 근거 조문을 제시하지 않으며, 본문 단계에서 근거 확인과 변호사 검수를 거치기 전에는 발행하지 않는다.

### 3.1 후보를 그대로 만들 수 없게 만드는 코드 제약

1. **`ar` 로케일 자체가 없다.** `src/lib/public-guidance.ts` 13–23 `PUBLIC_LOCALES_8`에 `ar`가 없고, 9행 `GUIDANCE_LOCALES_4`는 `['vi','id','th','fil']`이며, `src/middleware.ts` 318–319 matcher도 `(vi|id|th|fil)`만 잡는다. **C2·C4는 GOAL.md 보드의 M1-a(WO-M2-AR-ROUTING)가 선행되지 않으면 착수 자체가 불가능하다.**
2. **안내 로케일에는 임의 슬러그를 추가할 수 없다.** `src/lib/public-guidance.ts` 40행 `GUIDANCE_CORE_ROUTE_KEYS` 10개(`''`·services·about·lawyers·pricing·contact·faq·privacy·disclaimer·columns) 외의 슬러그는 `resolveGuidanceMiddlewareRewrite()`가 `__public-guidance-unavailable`로 보낸다. C2·C4는 `GUIDANCE_CORE_ROUTE_KEYS`·`GUIDANCE_PAGE_KEYS`(25행) 확장이 선행되어야 하고, 확장하는 순간 `src/app/sitemap.ts` 86–99 `appendGuidanceLocaleSitemapEntries()`가 안내 로케일 × 새 키 전조합을 사이트맵에 올린다 — 즉 **vi·id·th·fil 본문도 같이 있어야 빈 페이지가 발행되지 않는다.**
3. **EN 인텐트 랜딩은 4벌 동시 작성이다.** `src/data/intent-pages.ts` 34행 타입이 `Record<SiteLocale, Record<IntentPageSlug, IntentPageContent>>`이므로 ko·zh-hant·en·ja 네 벌이 모두 있어야 타입이 통과한다. 추가로 `src/app/sitemap.ts` 31–50 `STATIC_PATHS`와 `src/app/[locale]/<슬러그>/` 라우트가 필요하다(기존 3개 인텐트 페이지와 같은 패턴).
4. **EN 전용 칼럼은 만들 수 없다.** `src/app/sitemap.ts`의 칼럼 루프가 `getAllColumnPosts('ko')`를 돌기 때문에, 한국어 파일이 없는 슬러그는 어느 로케일에서도 사이트맵에 나오지 않는다. C1·C3을 칼럼으로 대체하려면 `src/content/columns/`(ko)와 `src/content/columns-en/`에 같은 파일명이 동시에 필요하다.
5. **`src/data/international-guidance-content.ts`는 M1-b 소유다.** C2·C4의 아랍어 본문이 들어갈 자리가 그 파일이므로, 이 문서는 **제안만** 하고 파일을 수정하지 않는다. 소유권 충돌을 피하려면 (a) M1-b가 코어 10키를 끝낸 뒤 확장하거나 (b) 동남아 레인이 기록한 대안(주제 본문만 별도 데이터 파일에 두고 코어 키 1개만 확장해 병합 조회, `docs/seo/sea-intent-map-2026-09.md` §3.1-4) 중 하나를 M2 착수 시 결정한다.

### 3.2 후보에 넣지 않았지만 기록해 두는 관찰

- **이슬람법(샤리아) 기반 신분·상속 관계의 대만 승인.** `grep -rli "sharia\|islamic\|伊斯蘭" src/` = **0건**이다. 그러나 ⑤ 셀의 대표 질문(해외 유언의 효력, 외국 이혼·양육권 판결의 승인, 외국 혼인문서 인증)은 EN 칼럼 두 편이 이미 일반론으로 다룬다 — `016-taiwan-inheritance-custody-analysis.md` §2(Wills and Identifying the Estate)·§8(Cross-Border Family Issues, "For a will made abroad, its form and substantive effect, translation and authentication, and probate or enforcement procedures must be examined")과 `007-taiwan-divorce-lawsuit-qna.md` 56·151·269행. 따라서 ⑤는 "없음"이 아니며 후보 규칙상 후보가 되지 않는다. **다만 "아랍권 독자를 향해 쓰인" 문서는 0장**이고, 이 공백은 규칙을 느슨하게 바꾸지 않고 그대로 남겨 M2·M3의 판단에 넘긴다.
- **할랄 인증·대리점 계약.** `grep -rli "halal\|清真" src/` = **0건**. 다만 이 주제의 규모 근거(대만-MENA 식품·화장품 교역의 국가별 값)를 A/B급으로 확인하지 못했다 → **미확인**이라 후보로 올리지 않았다.
- **자유무역지대(JAFZA·DMCC 등) 법인이 대만 자회사의 주주가 될 때의 투자심의.** `/en/taiwan-company-setup-lawyer`가 investment approval을 일반론으로 다루므로 "없음"이 아니다. 지역 특유 쟁점의 실재 여부는 經濟部 투자심의司 국가별 통계가 확인되지 않아(§1) **미확인**이다.

## 4. 대응 URL 실존 확인

기준 오리진 `https://tseng-law.com` — `src/lib/public-guidance.ts` 78행 `DEFAULT_SITE_URL`. 이 절의 판정은 전부 **코드 규칙**에 근거하며, 라이브 HTTP 상태코드는 치지 않았다.

### 4.1 `ar` 페이지는 0장이다 (이 문서의 전제)

- `src/lib/public-guidance.ts` 13–23 `PUBLIC_LOCALES_8` = ko·zh-hant·en·ja·vi·id·th·fil. `ar` 없음.
- 같은 파일 9행 `GUIDANCE_LOCALES_4` = vi·id·th·fil. 79행 `PUBLIC_LOCALE_PATH_RE` = `/^\/(ko|zh-hant|en|ja|vi|id|th|fil)(?=\/|$)/i`.
- `src/middleware.ts` 314–320 matcher에 `/:locale(vi|id|th|fil)` 두 줄만 있고 `ar` 없음.
- `src/lib/locales.ts` 2행 `locales` = ko·zh-hant·en, 7행 `siteLocales` = ko·zh-hant·en·ja.
- 확인 명령: `grep -rn "'ar'" src/lib/public-guidance.ts src/lib/locales.ts src/middleware.ts` → **출력 0줄**.
- 결론: `https://tseng-law.com/ar/...` 형태의 URL은 존재하지 않는다. §2 `현재 대응 URL` 열은 전부 영어 표면이다.

### 4.2 EN 인텐트 랜딩 (실존 4종 중 3종을 §2에서 인용)

- `src/app/sitemap.ts` 31–50 `STATIC_PATHS`에 `/taiwan-lawyer`(41) · `/taiwan-company-setup-lawyer`(42) · `/taiwan-litigation-lawyer`(43) · `/korean-lawyer-in-taiwan`(45) 포함 → `locales`(ko·zh-hant·en) 루프의 `createEntry` → `getLocalizedPath('en', …)`.
- 라우트 실체: `src/app/[locale]/taiwan-lawyer/` · `taiwan-company-setup-lawyer/` · `taiwan-litigation-lawyer/` · `korean-lawyer-in-taiwan/` 네 디렉터리 모두 존재.
- 콘텐츠: `src/data/intent-pages.ts` 425–705의 `en` 블록(3 슬러그). `korean-lawyer-in-taiwan`은 `src/app/[locale]/korean-lawyer-in-taiwan/content.ts`가 따로 갖는다.
- `src/lib/seo-visibility.ts` `isEnglishNoindexPath` 대상이 아니므로 사이트맵의 `applyLocaleIndexabilityRules`에서 제거되지 않는다.
- **`/en/korean-lawyer-in-taiwan`은 §2에 쓰지 않았다** — 한국어 사용자 대상 랜딩이라 MENA 셀의 대응 URL로 부적절하다. 실존 4종 중 3종만 인용한 이유가 이것이다.

### 4.3 EN 가이드 — `/en/guides/taiwan-company-setup`

- `src/app/sitemap.ts` 44행 `STATIC_PATHS`에 `/guides/taiwan-company-setup` 포함, 라우트 실체 `src/app/[locale]/guides/taiwan-company-setup/`(`content.ts`·`page.tsx`).
- §2 표에는 직접 쓰지 않았고(①의 대응 URL은 랜딩으로 통일) §3 C1·C3의 인접 표면으로만 언급한다.

### 4.4 EN 서비스 영역 — `/en/services/criminal` 등

- `src/app/sitemap.ts`의 `for (const area of serviceAreaRecords) … createEntry(locale, '/services/' + area.slug)`. 소스 슬러그는 `src/data/service-details.ts`의 6개 — `investment`(16) · `civil`(70) · `family`(116) · `labor`(160) · `criminal`(205) · `ip`(243).
- 라우트 실체: `src/app/[locale]/services/[slug]/`.
- §2에서 쓴 것은 `/en/services/criminal` 하나다. 이 URL을 쓴 셀의 `이유` 열에는 `(범위 안내)`를 붙여, 질문에 답하는 문서가 아니라 업무 범위 안내임을 표시했다.

### 4.5 EN 칼럼 (§2에서 인용한 3편)

규칙: 사이트맵의 칼럼 루프가 `getAllColumnPosts('ko')`를 돌고, EN 행은 `isEnglishNoindexPath(path, isFileBackedEnglishColumnPath)`가 거짓일 때만 살아남는다 — 즉 `src/content/columns-en/`에 같은 파일명이 있어야 한다. `src/content/columns/`(ko) 17편과 `src/content/columns-en/` 17편은 파일명이 1:1로 일치한다.

- `/en/columns/taiwan-inheritance-custody-analysis` — `016-taiwan-inheritance-custody-analysis.md` (EN 제목 "Taiwan Inheritance and Parental Rights: A Guide for Surviving Families")
- `/en/columns/taiwan-divorce-lawsuit-qna` — `007-taiwan-divorce-lawsuit-qna.md` ("Taiwan Divorce Q&A: Mediation, Litigation, Property, and Children")
- `/en/columns/taiwan-traffic-accident-procedure` — `003-taiwan-traffic-accident-procedure.md`

### 4.6 의도적으로 쓰지 않은 URL

- `https://tseng-law.com/en/faq` — `src/lib/seo-visibility.ts` `isEnglishNoindexPath`가 `/faq`를 EN noindex로 분류해 사이트맵의 EN 행이 삭제된다. 대응 URL로 쓰지 않았다.
- `https://tseng-law.com/ar/...` — §4.1대로 존재하지 않는다.
- `/{vi|id|th|fil}/...` — 실존하지만 아랍어 사용자의 질문 언어가 아니므로 MENA 셀의 대응 URL로 쓰지 않았다.
- `/{locale}/services/<영역>` 형태의 안내 로케일 경로 — `GUIDANCE_CORE_ROUTE_KEYS`에 없어 `__public-guidance-unavailable`로 간다. 존재하지 않으므로 쓰지 않았다.

### 4.7 "없음"의 정확한 범위 (과대 서술 방지)

| 명제 | 판정 | 근거 |
|---|---|---|
| 중재 합의·중재판정의 승인·집행을 다루는 문서가 사이트에 있다 | **없음 (0)** | `grep -rli "arbitrat" src/` → 0건 · `grep -rl "仲裁" src/` → 0건 (2026-09-16 실행) |
| 외국 판결의 승인·집행을 언급하는 문서가 있다 | **있음 (단, 가족·상속 맥락 한정)** | `src/content/columns-en/007-…md` 56·151·269행, `016-…md` §8(112·116행). 상사 채권 맥락의 문서는 없다 |
| 미수금·계약위반을 다루는 영어 표면이 있다 | **있음** | `src/data/intent-pages.ts` 630(idealFor) · 683 · 687(FAQ) — `/en/taiwan-litigation-lawyer` |
| 비자·거류·취업을 **주제로 하는 전용 페이지**가 있다 | **없음 (0)** | `intentPageSlugs`(`intent-pages.ts` 4–8) 3개 · `GUIDANCE_CORE_ROUTE_KEYS`(`public-guidance.ts` 40–50) 10개 · `STATIC_PATHS`(`sitemap.ts` 31–50) 어디에도 해당 키 없음 |
| 거류허가 지원이 업무 범위라는 **문장**이 어딘가에 있다 | **있음** | `src/data/intent-pages.ts` 505–507("Do you assist with Taiwan residence permits? Yes…") · 597–599 · `src/data/en-service-scope.ts` 4·7·10행 |
| 이슬람법(샤리아) 관련 서술이 있다 | **없음 (0)** | `grep -rli "sharia\|islamic\|伊斯蘭" src/` → 0건 |
| 할랄 관련 서술이 있다 | **없음 (0)** | `grep -rli "halal\|清真" src/` → 0건 |

따라서 ④ 7셀의 "없음"이 주장하는 것은 **"비자·거류를 주제로 하는 전용 페이지 0"**이지 "거류를 언급하는 문장 0"이 아니다. 두 번째 명제는 거짓이며(위 표 5행), §2 ④ 셀의 `이유` 열도 "전용 페이지 0"으로만 썼다.

## 5. 출처 표

조회일은 전부 **2026-09-16**(KST). 등급 기준은 WO 공통 규칙 — A 공식통계 / B 정부·협회 / C 업계리서치 / D 언론 / E 추정. **S6는 자사 레포 코드이므로 A~E 척도를 쓰지 않고 `1차(자사 코드, 척도 외)`로 표기한다.**

| # | 출처 | URL | 조회일 | 등급 | 이 문서에서 쓴 값 |
|---|---|---|---|---|---|
| S1 | 內政部移民署 『外僑居留人數統計表 11507』 시트 `07_現持有效居留證(按國籍及職業)` — 자료 기준일 115년 7월 31일(2026-07-31), 자료출처 移民事務組 | 목록 https://www.immigration.gov.tw/5385/7344/7350/%E5%A4%96%E5%83%91%E5%B1%85%E7%95%99/?alias=settledown · 파일 https://www.immigration.gov.tw/media/121153/外僑居留人數統計表11507.ods | 2026-09-16 | **A** | 7국 국적 거류자 수(埃及 277·沙烏地阿拉伯 5·巴林 3·阿曼 2·阿拉伯聯合大公國 1) · 埃及 직업 세목(§2.2 주석) · 卡達·科威特 국적 항목 부재 · 비교값 土耳其 487·伊朗 318·以色列 233·約旦 165. 파일을 내려받아 `content.xml`을 직접 파싱해 읽었고, 국적 헤더 블록 전수(행 3·37·71·…·887)를 확인했다 |
| S2 | 같은 파일 시트 `27_現持有效外僑居留證之外籍配偶（按國籍及區域）` — 같은 기준일 | (S1과 동일 파일) | 2026-09-16 | **A** | 외국인 배우자 수(埃及 47 = 男36+女11 · 沙烏地阿拉伯 3 · 巴林 1 · 阿曼 1) · 阿拉伯聯合大公國·卡達·科威特 국적 항목 부재 · 비교값 土耳其 190·伊朗 53·以色列 51 |
| S3 | 中華民國外交部 국가별 정보 페이지 7건(亞西地區 6 + 非洲地區 1). 각 페이지 갱신일: AE 2026-08-22, 그 외 6건 2026-09-15 | AE https://www.mofa.gov.tw/CountryInfo.aspx?CASN=3&n=162&sms=33&s=5 · SA …&s=100 · QA …&s=92 · KW …&s=98 · BH …&s=84 · OM …&s=81 · EG https://www.mofa.gov.tw/CountryInfo.aspx?CASN=2&n=163&sms=33&s=179 | 2026-09-16 | **B** | 2025년 쌍방 무역액(§2.2 표) · 我 공관·兼轄 관계 · 주요 수출입 품목. 원문 그대로: AE `我對該國輸出： 15.85億美元(2025年) / 我自該國輸入： 45.04億美元(2025年)`, SA `約9.35億美元 (2025年) / 約73.26億美元 (2025年)`, QA `2025年我對卡達出口總額約6,800萬美元 / 2025我自卡達進口總額約55.57億美元`, KW `我國對科威特2025年出口總額為1億3,266萬美元 / 2025年我自科國進口總額為27億8,603萬美元 / 2025年臺科雙邊貿易總額約29億1,869萬美元，為我第27大貿易夥伴`, BH `3,325萬美元（2025年，經濟部國際貿易署） / 5,041萬美元（2025年，經濟部國際貿易署）`, EG `3億1,186萬美元。（2025年） / 6,329萬美元。（2025年）`, OM은 품목만 게재 → **미확인** |
| S4 | 外交部領事事務局 『駐館位置及聯絡資訊』 · 駐阿曼王國台北經濟文化辦事處 홈페이지 | https://www.boca.gov.tw/sp-foof-countrylp-02-1.html · http://www.roc-taiwan.org/om/index.html | 2026-09-16 | **B** | 관할(兼轄) 관계 교차확인 — 駐沙烏地阿拉伯代表處가 卡達 등 兼轄, 駐杜拜臺北商務辦事處가 이란·소말리아·에리트레아 兼轄, 駐阿曼王國台北經濟文化辦事處 관할은 `阿曼全境` |
| S5 | Statcounter Global Stats, Search Engine Market Share (all platforms), **2026년 8월** | https://gs.statcounter.com/search-engine-market-share/all/united-arab-emirates (및 /saudi-arabia · /qatar · /kuwait · /bahrain · /oman · /egypt · /turkey) | 2026-09-16 | **C** | §2 `검색 표면` 열의 구글·Bing 점유율 7국 + §6의 터키 값(구글 82.32 / Yandex 15.98 / Bing 0.88) |
| S6 | 이 레포의 코드(`tseng-law-mena-20260916` 워크트리) | (사내) `src/lib/public-guidance.ts` · `src/middleware.ts` · `src/app/sitemap.ts` · `src/data/intent-pages.ts` · `src/data/service-details.ts` · `src/lib/seo-visibility.ts` · `src/content/columns{,-en}/` | 2026-09-16 | **1차(자사 코드, 척도 외)** | §4 전체(URL 실존·"없음" 판정) · §3.1 제약 · §2 `이유` 열의 파일:줄 인용 |

### 5.1 출처 표에 대한 주석 (등급 과대 표기 방지)

- **S1·S2는 같은 파일의 다른 시트다.** 서로 독립적인 두 출처가 아니다.
- **S3은 A가 아니라 B다.** 외교부 국가별 페이지는 정부 간행물이지만 무역 수치의 1차 통계 발표(經濟部國際貿易署 貿易統計)가 아니라 그것을 인용한 안내 페이지다. BH 항목만 원문에 `經濟部國際貿易署` 출처가 병기돼 있고 나머지는 병기가 없다. **1차 통계로 직접 대조하지 못했다** — 經濟部國際貿易署 통계 조회 시스템(`publicinfo.trade.gov.tw/cuswebo/FSC3010F`)은 2026-09-16 조회 시 POST 요청이 302로 되돌아가 CAPTCHA 없이는 결과를 얻을 수 없었다. 이 문서의 무역 수치는 그래서 전부 B이며, **B급만으로 H를 준 셀이 6개(AE ①②③·SA ①②③)**라는 사실을 여기 명시한다. WO 완료 기준은 `E등급으로 H 준 셀 0`이므로 위반은 아니지만, 이 6셀의 근거 강도는 A급이 아니다.
- **S5는 C다.** 검색엔진 점유율은 업계 측정이며 이 문서의 어떤 H·M도 S5만으로 주지 않았다. `검색 표면` 열은 가설이다.
- **S6은 A~E 척도 밖이다.** 자사 코드에 대한 1차 확인이므로 외부 통계 척도에 얹으면 오표기가 된다.
- **다음 항목은 이 문서에서 확인하지 못했다 → 미확인.**
  - **대만-오만 쌍방 무역액**(S3 페이지가 품목만 게재). OM 6셀을 전부 L로 둔 직접 이유다.
  - **대만 내 卡達·科威特 국적 거류자·외국인 배우자 수**(S1·S2 원표에 국적 항목 자체가 없음). QA ④⑤·KW ④⑤를 L로 둔 직접 이유이며, **0명으로 바꿔 쓰지 않았다.**
  - **經濟部 투자심의司의 국가별 僑外投資·對外投資 통계**. 통계 링크 페이지가 HTTP 403을 반환했다. MENA 자본의 대만 투자 규모를 숫자로 쓰지 않은 이유다.
  - **아랍어권 사용자의 영어 검색 병용 비율**. A/B급 출처 없음. "걸프는 영어가 통한다"류 명제를 우선순위 근거로 쓰지 않았다.
  - **중동의 AI 검색(생성형 답변) 사용 비율**. A/B/C 어느 등급으로도 찾지 못했다. `검색 표면` 열 42셀 전부 `AI 미확인`으로 적었다.
  - **국적별 교통사고·형사사건·직업재해 발생 건수**. ⑥의 우선순위를 체류 규모 이상으로 올리지 않은 이유다.
  - **국적별 검색량·검색 점유율**. WO 금지 항목이자 A/B 출처 없음 — 한 건도 쓰지 않았다.
  - **아랍어 문장의 원어민 검수**. §2의 84개 아랍어 문장은 MSA 검색어 어투로 작성한 초안이며 검수 전이다(M1-c 대상).

## 6. phase 2 언어 후보 (tr / fa / he) — 근거 1쪽

`ar` 다음 순서를 정하기 위한 **제안**이며, 이 문서는 어느 것도 착수를 요청하지 않는다. 판단축 셋: (a) 대만과의 관계, (b) 대만 내 체류 규모, (c) 검색 언어 관행.

| 후보 | (a) 대만 관계 | (b) 대만 내 체류 규모 (2026-07-31) | (c) 검색 언어 관행 | 종합 |
|---|---|---|---|---|
| **tr** (터키어, LTR) | 駐土耳其代表處 존재(S4 목록에 `駐土耳其代表處 / Economic and Cultural Delegation, Ankara`). **대만-터키 무역액은 이 문서에서 확인하지 않음 → 미확인** | **土耳其 487명**(S1) — 이 문서 7국 확인분 합계(288)보다 크고 埃及(277)보다 큼. 외국인 배우자 **190명**(S2)으로 埃及(47)의 4배 | **검색 표면이 다르다** — 터키는 구글 82.32% / **Yandex 15.98%** / Bing 0.88%(S5, 2026-08). 7국 어디에도 없는 얀덱스 비중이며, 색인·검증 절차가 달라진다 | **1순위 후보.** A급 체류·배우자 규모가 세 후보 중 최대이고 공관도 있다. 단 (a)의 무역 근거와 얀덱스 색인 절차가 **미확인**이라 착수 전 보강 필요 |
| **fa** (페르시아어, RTL) | 이란에 我 공관 없음 — **駐杜拜臺北商務辦事處가 兼轄**(S4). 이 관할 구조 자체가 UAE 레인과 겹쳐 운영상 인접 | **伊朗 318명**(S1), 외국인 배우자 **53명**(S2). 직업 세목은 學生 83 · 教師 36 · 商務人員 19 · 工程師 11 | 이란 국내 검색 점유는 이 문서에서 확인하지 않음 → **미확인**. RTL은 `ar`와 공유하므로 M1-a의 RTL 작업을 재사용할 수 있다(추가 비용 낮음) | **2순위.** 체류 규모는 he보다 크고 RTL 자산을 `ar`와 공유한다. 다만 **제재·결제 관련 수임 가능성 검토가 선행 항목이며 이 문서는 그 검토를 하지 않았다 → 미확인** |
| **he** (히브리어, RTL) | 駐以色列代表處 존재(S4, Tel Aviv) | **以色列 233명**(S1), 외국인 배우자 **51명**(S2). 직업 세목은 商務人員 40 · 工程師 16 · 學生 18 | 이스라엘 국내 검색 점유는 이 문서에서 확인하지 않음 → **미확인** | **3순위.** 공관이 있고 商務人員 비중(40/233)이 세 후보 중 가장 높아 ①②③ 의도와 맞지만, 절대 규모가 tr의 절반 이하 |

**이 절이 주장하지 않는 것:** 세 후보 모두 무역액 근거를 확인하지 않았다. 따라서 위 순위는 **(b) A급 체류 규모 + (a) 공관 유무**만으로 세운 것이고, `ar`을 1순위로 정한 근거(B급 무역, §1-3)와 **다른 축**이다. 축이 다르므로 "tr이 ar보다 낫다/못하다"는 비교는 이 표로 할 수 없다. phase 2 착수 전 각 후보의 (a) 무역·투자 근거와 (c) 검색 점유를 A/B/C급으로 채우는 것이 선행 작업이다.

## 7. 언어 계약·광고 규정 자기점검

**언어 계약**

- 이 문서 전체에서 **아랍어(ar)로 상담·통역이 가능하다는 서술은 0건이다.** §2의 `대표 질문(아랍어 MSA)` 열은 사용자가 검색창·AI에 입력할 문장이며, 그 뜻을 §1 「언어 계약」과 「표 읽는 규칙」에 명시했다.
- **상담 언어 표기는 "English / Chinese / Japanese / Korean"만 사용했다.** §1 언어 계약 절, §3 후보표의 C1·C3 초안(영어 원문 그대로: "The firm provides consultations in English, Chinese, Korean, and Japanese, in person or by video."), C2·C4 초안(아랍어: `لغات الاستشارة: الإنجليزية والصينية واليابانية والكورية فقط.` = 상담 언어는 영어·중국어·일본어·한국어뿐). **다른 조합을 쓴 곳은 없고, 아랍어가 상담 언어 목록에 들어간 곳도 없다.**
- §3 후보 초안 어디에도 아랍어 상담·통역 제공, 회신 시간, 예약 가능 여부, 비용 금액, 거류·소송 결과 보장을 적지 않았다.
- JSON-LD·메타 태그는 이 워크오더에서 건드리지 않았다. `availableLanguage`(`src/lib/seo.ts` 836 `GUIDANCE_CONSULTATION_LANGUAGES` = en·zh-Hant·ja·ko)를 넓히는 제안도 하지 않았다.

**광고 규정**

아래 셈은 **이 §7 자기점검 절 밖**(§1~§6·§8)의 출현만 센 것이다. 자기점검 절은 토큰을 인용해 설명하므로 스스로를 세면 수치가 자기참조로 흔들린다 — 그래서 절 밖만 세고, 절 안에도 같은 토큰이 인용 형태로 들어 있다는 사실을 여기 밝힌다. 재현 명령: `python3 -c "…"`로 줄 단위 카운트(작성 시 실행한 결과가 아래 수치다).

- **승소율·성공을 보장하는 서술 0건.** "승소"는 §1의 부정문 1회뿐이고, "보장" 2회도 §1·§3의 "보장을 적지 않았다"는 부정문과 착수 조건 문장이다.
- **WO 금지 토큰 "최고" — §7 밖 출현 0건.** 초판에는 §2 QA ③ 이유 열에 법률 용어 「최고서」가 1건 있었다(광고 표현이 아니라 催告 통지를 가리켰다). 토큰 0건 기준을 지키기 위해 "소 제기 전 사전 통지"로 **교체했다.**
- **WO 금지 토큰 "유일" — §7 밖 출현 3건.** §1-3("순위를 세울 수 있는 유일한 축"), §2 EG ① 이유 열("두 근거가 겹치는 유일한 국가"), §2 EG ④ 이유 열("A급 모수가 유일하게 확인되는 셀"). 셋 다 사무소가 아니라 **이 문서의 데이터 상태**를 가리키므로 유지한다. **초판 자기점검이 "최고 0건 / 유일 3건"이라고만 적고 실제로 세지 않았던 것은 오서술이며, 그때 「최고서」 1건을 놓쳤다.** 이 줄이 그 수정이다.
- **"1위"는 0건이 아니다 — §7 밖 8회 출현.** §1-2, §2 AE ①②③·EG ①④⑤ 이유 열, §3 C3 근거. "2위" 5회(§1-3, §2 SA ①②③, §3 C1), "3위" 3회(§2 EG ①②③), "4위" 3회(§2 KW ①②③), "5위" 3회(§2 QA ①②③)도 있다. **전부 출처 통계에서의 국가 간 순위**(S1·S2·S3)이며 사무소의 순위가 아니다. 동남아 레인의 처리(`sea-intent-map-2026-09.md` §8.1-3)와 같은 기준으로 존재를 명시하고 유지한다.
- 숫자·통계는 전부 S1~S5 코드가 붙어 있고, 출처가 없는 것은 "미확인"으로 적었다. **검색량 수치는 0건.**

**새 법률 주장**

- §1·§2·§4·§5의 법적 서술은 전부 사이트에 이미 게재된 문장 또는 A/B급 통계에서 왔다.
- §3의 C1~C4 초안 4건은 **사이트에 없는 새 법률 서술**(중재판정의 승인·집행이 본안과 별개라는 점, 거류·취업 자격 신청이 회사 등기와 별개라는 점)을 담는다. 네 초안 전부에 **`[변호사 검수 필요]` 마커를 붙였다.** 이 문서는 그 명제의 근거 법령을 제시하지 않으며, 본문 단계의 근거 확인과 변호사 검수 전에는 발행하지 않는다.

## 8. 변경 이력

- 2026-09-16 — 최초 작성(WO-M1-INTENT). 42셀, H 7 / M 13 / L 22, "없음" 10셀, 신규 페이지 후보 4개, 출처 6건(A 2 · B 2 · C 1 · 척도 외 1), 미확인 8항목.
