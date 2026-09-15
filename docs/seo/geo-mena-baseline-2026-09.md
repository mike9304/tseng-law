> **초안 · 총괄 미승인 · 실측 0회**

# GEO 중동 인용 베이스라인 — 2026-09 (M2b)

작성: 2026-09-16 · 워크오더 WO-M2b · 작업트리 `tseng-law-mena-content-20260916` · 브랜치 `mena/ar-content-20260916` (`origin/main` `8b23eb18`)
목적: 중동 사용자가 대만 법률 문제를 생성형 AI에 물을 때 `tseng-law.com`이 인용되는지를 **분모부터 고정**한다. 이 문서는 채점표다. 작성 시점 **실측 0회** — 결과 칸은 인용 관측이 아니라 `미실측(미실시)`다.
재실측 예정일: **2026-12-09**(작성일 +12주). 같은 문항·같은 판정 기준으로 1회 돌린다.

## 0. 이 문서가 주장하지 않는 것

- 검색량·트래픽·점유율·ROI 수치는 **한 건도 적지 않는다**(WO 금지 항목). 출처 없는 시장 규모는 **미확인**이다. 이 문서에 그런 숫자가 없는 것은 누락이 아니라 규칙이다.
- 인용 결과는 **미리 채우지 않는다**. `인용 여부` / `인용 순위·문맥` / `테스트일` 칸에는 실제로 관측한 값 또는 `미실측(사유)` 만 들어간다. 작성 시점은 실측 0회이므로 `인용 여부`는 전 엔진 `미실측(미실시)`이고, `인용 순위·문맥`·`테스트일`은 빈칸이다. 이는 “인용되지 않았다”(N)가 아니다.
- 엔진 접근 조건(로그인·지역 제한·CAPTCHA 등)은 이 문서 작성 시점 **미검증**이다. §2 표의 해당 칸은 실측 1회차에 실제로 확인한 뒤 갱신한다.
- `ar` 페이지가 이미 라이브라거나, 아랍어로 변호사 상담·통역이 가능하다는 뜻을 **주장하지 않는다.**
- 승소율·최고·유일·보장 표현을 쓰지 않는다. 문항 문장에 그런 수식어를 넣지 않았다.

## 1. 언어 계약 (이 문서 전체에 적용)

- `ar`(Arabic, MSA) 은 **안내(guidance) 언어**다. 해당 언어 페이지가 생기면 정보 안내만 제공한다.
- **변호사 상담 언어는 English / Chinese / Japanese / Korean 뿐이다.** 이 문서의 어떤 행도 아랍어로 상담·통역이 가능하다는 뜻이 아니다.
- 표의 `질문 아랍어` 칸은 **사용자가 검색창·생성형 AI에 입력할 문장**이지, 사무소가 그 언어로 상담한다는 표시가 아니다. 이 구분을 흐리는 문구를 이 문서·메타·JSON-LD 어디에도 추가하지 않는다.
- 이 브랜치 코드의 안내 4언어는 아직 `vi` / `id` / `th` / `fil` 이다. `ar` 은 MENA 레인의 **예정** 안내 로케일이며, 작성 시점 `GUIDANCE_LOCALES_4`·`PUBLIC_LOCALES_8`에 들어 있지 않다.
- 근거: `src/lib/public-guidance.ts`(`GUIDANCE_LOCALES_4` = vi·id·th·fil, `PUBLIC_LOCALES_8`), `src/data/international-guidance-content.ts` 헤더 주석("consultations with an attorney are handled only in English, Chinese, Japanese and Korean"), `src/data/attorney-profiles.ts` 영어 프로필(consultations in English, Chinese, Korean, and Japanese).

## 2. 실측 절차

### 2.1 엔진과 접근 방법

| 코드 | 엔진 | 접근 경로 | 로그인 필요 여부 | 비고 |
|---|---|---|---|---|
| CG | ChatGPT | chatgpt.com 웹 | **확인 필요** — 이 문서 작성 시점 사람 브라우저 미검증 | 웹 검색 도구 사용 여부를 응답마다 기록 |
| GM | Gemini | gemini.google.com 웹 | **확인 필요** — 이 문서 작성 시점 사람 브라우저 미검증 | 응답에 붙는 출처 카드까지 기록 |
| PP | Perplexity | perplexity.ai 웹 | **확인 필요** — 이 문서 작성 시점 사람 브라우저 미검증 | 출처 목록이 명시되므로 순위 기록이 가장 쉬움 |
| CL | Claude | claude.ai 웹 | **확인 필요** — 이 문서 작성 시점 사람 브라우저 미검증 | 웹 검색이 꺼진 상태면 그 사실을 함께 기록 |
| GR | Grok | grok.com 또는 X 내 Grok | **확인 필요** — 이 문서 작성 시점 사람 브라우저 미검증 | 접근 불가 시 "미실측(접근 불가)" |
| AIO | Google AI Overviews / AI Mode | google.com 검색 결과 상단 | **확인 필요** — 발동 여부 미검증 | **발동 자체가 조건부** — 미발동이면 "미실측(AIO 미발동)" |

비브라우저 HTTP로 엔진 페이지를 치는 방법은 이 채점표의 실행 경로가 **아니다.** 1회차는 손빗이 **사람 브라우저**로 §2.2를 따른다(동남아 GEO 채점표와 동일).

### 2.2 실행 규칙

1. **문항 1개 = 엔진 1개 = 새 대화 1회.** 대화를 이어서 재질문하지 않는다(직전 응답이 다음 응답을 오염시킨다).
2. 입력은 표의 `질문 아랍어`를 **그대로 복사**한다. 오타·구어체·MSA를 교정하지 않는다. 같은 행의 `질문 영어 변형`은 **별도 런**으로 돌리고, 두 결과를 각각 기록한다.
3. 개인화 제거: 시크릿/게스트 창 또는 새 프로필. 국가 가정(AE/SA/QA/KW/BH/OM/EG)은 **질문 문장 안에 명시**하며, VPN·지역 위장은 하지 않는다(재현 불가능해진다).
4. 같은 문항을 여러 번 돌려 "좋은 결과"를 고르지 않는다. 1회 결과가 그 회차의 값이다.
5. 실측일(YYYY-MM-DD)과 엔진 코드를 반드시 함께 적는다. 날짜 없는 결과는 무효로 취급한다.

### 2.3 인용 판정 기준

- **인용(Y)**: 응답 본문·출처 목록·각주 어디에든 `tseng-law.com` 도메인 링크가 있거나, 링크 없이도 사무소명(Hovering International Law Firm / 昊鼎國際法律事務所 / 법무법인 호정)이나 소속 변호사명(Wei Tseng / 曾雋崴)이 **명시적으로** 언급된 경우.
- **미인용(N)**: 응답에 다른 법무법인·정부·미디어 도메인만 인용된 경우. 경쟁 도메인만 인용된 것도 미인용이다.
- **부분(P)**: 사이트 문장이 인용된 정황은 있으나 도메인·사무소명이 특정되지 않아 귀속을 확정할 수 없는 경우. P는 인용률 계산에서 **미인용으로 처리**하고, 판정 근거를 문맥 칸에 남긴다.
- **미실측**: 판정 자체가 불가능한 경우. 반드시 사유를 괄호로 적는다 — 예) `미실측(AIO 미발동)`, `미실측(엔진 접근 불가)`, `미실측(해당 언어 입력 거부)`, `미실측(응답에 출처 표기 없음)`, `미실측(미실시)`.
- `인용 순위·문맥` 칸 기록 형식: `출처목록 3/8 · 회사설립 절차 문단` 처럼 **순위 + 어느 맥락에서 인용됐는지** 한 줄. 순위 표기가 없는 엔진이면 `순위없음`.

### 2.4 기록 형식

`인용 여부` 칸에는 엔진별로 `CG=Y GM=N PP=Y CL=N GR=미실측(접근 불가) AIO=미실측(AIO 미발동)` 형태로 6개 값을 모두 적는다. 하나라도 빠지면 그 행은 미완으로 본다.

### 2.5 실측 시도 로그

미실시(작성 시점 실측 0회)

## 3. 문항 세트 (18행 · 아랍어 MSA + 영어 변형 × 6주제)

엔진 코드: **CG**=ChatGPT · **GM**=Gemini · **PP**=Perplexity · **CL**=Claude · **GR**=Grok · **AIO**=Google AI Overviews. 모든 행은 6엔진 전부를 대상으로 한다.

- 1차 입력 언어는 **아랍어 MSA**(검색창·AI에 붙여 넣을 자연문). 방언(걸프 구어 등)으로 고치지 않는다.
- 국가 가정은 문장 안에 명시한다. 주제당 **AE · SA + 1개**(QA/KW/BH/OM/EG 중 택1).
- `기대 인용 URL`은 **현재 실존하는 EN 표면만** 적는다. `ar 표면` 열은 아직 코드·라이브에 없는 안내 경로이므로 항상 `예정(/ar/…)`이다. 예정 경로를 실측 타깃으로 쓰지 않는다.
- 아랍어 문항은 종교·정치·특정 국적 비하 없이 대만 법률 절차를 묻는 중립문이다. “아랍어 상담 가능”을 묻거나 단정하지 않는다.

| id | 주제 | 국가 가정 | 질문 아랍어 | 질문 영어 변형 | 기대 인용 URL (EN 실존) | ar 표면 | 엔진 | 인용 여부 | 인용 순위·문맥 | 테스트일 |
|---|---|---|---|---|---|---|---|---|---|---|
| M0-01 | 대만 회사설립·투자(외국인 지분·대표자 거류) | AE | أنا مستثمر مقيم في الإمارات وأريد تأسيس شركة في تايوان. هل يجوز للأجانب تملك الحصص بالكامل، وهل يُشترط أن يقيم الممثل القانوني في تايوان؟ | I am an investor residing in the UAE and want to set up a company in Taiwan. May foreigners own all of the shares, and must the legal representative reside in Taiwan? | https://tseng-law.com/en/taiwan-company-setup-lawyer | 예정(/ar/services) | CG·GM·PP·CL·GR·AIO | CG=미실측(미실시) GM=미실측(미실시) PP=미실측(미실시) CL=미실측(미실시) GR=미실측(미실시) AIO=미실측(미실시) |  |  |
| M0-02 | 대만 회사설립·투자(외국인 지분·대표자 거류) | SA | أسكن في السعودية وأفكر في فتح شركة تابعة في تايوان. ما قواعد تملك الأجانب للأسهم، وهل يجب أن يقيم ممثل الشركة في تايوان؟ | I live in Saudi Arabia and am considering a Taiwan subsidiary. What are the foreign shareholding rules, and must the company representative reside in Taiwan? | https://tseng-law.com/en/columns/taiwan-company-establishment-basics | 예정(/ar/services) | CG·GM·PP·CL·GR·AIO | CG=미실측(미실시) GM=미실측(미실시) PP=미실측(미실시) CL=미실측(미실시) GR=미실측(미실시) AIO=미실측(미실시) |  |  |
| M0-03 | 대만 회사설립·투자(외국인 지분·대표자 거류) | QA | شركة مسجّلة في قطر تريد الاستثمار في تايوان عبر شركة تابعة أو فرع. ما الفرق، وهل يمكن للأجانب تملك الشركة بالكامل؟ | A company registered in Qatar wants to invest in Taiwan through a subsidiary or a branch. What is the difference, and can foreigners wholly own the company? | https://tseng-law.com/en/columns/taiwan-company-subsidiary-vs-branch | 예정(/ar/services) | CG·GM·PP·CL·GR·AIO | CG=미실측(미실시) GM=미실측(미실시) PP=미실측(미실시) CL=미실측(미실시) GR=미실측(미실시) AIO=미실측(미실시) |  |  |
| M0-04 | 대만 소송·계약분쟁·미수금 | AE | أنا في الإمارات وشركة تايوانية لم تسدّد فاتورتنا. هل يمكن رفع دعوى في تايوان من خارج البلاد؟ | I am in the UAE and a Taiwanese company has not paid our invoice. Can we file a lawsuit in Taiwan from abroad? | https://tseng-law.com/en/taiwan-litigation-lawyer | 예정(/ar/services) | CG·GM·PP·CL·GR·AIO | CG=미실측(미실시) GM=미실측(미실시) PP=미실측(미실시) CL=미실측(미실시) GR=미실측(미실시) AIO=미실측(미실시) |  |  |
| M0-05 | 대만 소송·계약분쟁·미수금 | SA | نعيش في السعودية ولدينا نزاع تعاقدي مع شركة تايوانية. كيف تُباشَر قضايا العقود والمتأخرات في تايوان؟ | We live in Saudi Arabia and have a contract dispute with a Taiwanese company. How are contract and unpaid-debt cases started in Taiwan? | https://tseng-law.com/en/taiwan-litigation-lawyer | 예정(/ar/services) | CG·GM·PP·CL·GR·AIO | CG=미실측(미실시) GM=미실측(미실시) PP=미실측(미실시) CL=미실측(미실시) GR=미실측(미실시) AIO=미실측(미실시) |  |  |
| M0-06 | 대만 소송·계약분쟁·미수금 | KW | من الكويت نتعامل مع شركة في تايوان لم تدفع ثمن البضاعة. هل يمكن تحصيل المستحقات عبر دعوى في تايوان؟ | From Kuwait we deal with a company in Taiwan that has not paid for goods. Can the debt be collected through a lawsuit in Taiwan? | https://tseng-law.com/en/taiwan-litigation-lawyer | 예정(/ar/services) | CG·GM·PP·CL·GR·AIO | CG=미실측(미실시) GM=미실측(미실시) PP=미실측(미실시) CL=미실측(미실시) GR=미실측(미실시) AIO=미실측(미실시) |  |  |
| M0-07 | 취업·거류(ARC·고용주 변경) | AE | أعمل على خطة للانتقال من الإمارات إلى تايوان لإدارة شركة. هل تأسيس الشركة يمنح تصريح عمل أو بطاقة إقامة أجنبية (ARC) تلقائياً؟ | I am planning a move from the UAE to Taiwan to manage a company. Does forming the company automatically grant a work permit or an Alien Resident Certificate (ARC)? | https://tseng-law.com/en/columns/taiwan-company-establishment-basics | 예정(/ar/faq) | CG·GM·PP·CL·GR·AIO | CG=미실측(미실시) GM=미실측(미실시) PP=미실측(미실시) CL=미실측(미실시) GR=미실측(미실시) AIO=미실측(미실시) |  |  |
| M0-08 | 취업·거류(ARC·고용주 변경) | SA | أنا من السعودية وأعمل في تايوان بتصريح عمل وبطاقة إقامة أجنبية (ARC). إذا انتقلت إلى صاحب عمل آخر في تايوان، هل أحتاج إجراءات إقامة جديدة؟ | I am from Saudi Arabia and work in Taiwan on a work permit and ARC. If I move to another employer in Taiwan, do I need new residence procedures? | https://tseng-law.com/en/taiwan-lawyer | 예정(/ar/faq) | CG·GM·PP·CL·GR·AIO | CG=미실측(미실시) GM=미실측(미실시) PP=미실측(미실시) CL=미실측(미실시) GR=미실측(미실시) AIO=미실측(미실시) |  |  |
| M0-09 | 취업·거류(ARC·고용주 변경) | EG | أنا من مصر وأفكر في العمل في تايوان. ما الفرق بين تصريح العمل وبطاقة الإقامة الأجنبية (ARC)، وماذا أجهّز قبل سؤال محامٍ؟ | I am from Egypt and considering work in Taiwan. What is the difference between a work permit and an ARC, and what should I prepare before asking a lawyer? | https://tseng-law.com/en/columns/taiwan-company-establishment-basics | 예정(/ar/faq) | CG·GM·PP·CL·GR·AIO | CG=미실측(미실시) GM=미실측(미실시) PP=미실측(미실시) CL=미실측(미실시) GR=미실측(미실시) AIO=미실측(미실시) |  |  |
| M0-10 | 국제결혼·가족·상속 | AE | أنا مقيم في الإمارات ومتزوج من شخص تايواني. إذا انفصلنا، كيف تُعالَج الحضانة وتقسيم الأموال في تايوان؟ | I reside in the UAE and am married to a Taiwanese spouse. If we separate, how are custody and property division handled in Taiwan? | https://tseng-law.com/en/columns/taiwan-divorce-lawsuit-qna | 예정(/ar/services) | CG·GM·PP·CL·GR·AIO | CG=미실측(미실시) GM=미실측(미실시) PP=미실측(미실시) CL=미실측(미실시) GR=미실측(미실시) AIO=미실측(미실시) |  |  |
| M0-11 | 국제결혼·가족·상속 | SA | والدي توفي في تايوان وأنا أسكن في السعودية. كيف تسير إجراءات الميراث في تايوان للورثة المقيمين خارج تايوان؟ | My father died in Taiwan and I live in Saudi Arabia. How does Taiwan inheritance procedure work for heirs living outside Taiwan? | https://tseng-law.com/en/columns/taiwan-inheritance-custody-analysis | 예정(/ar/services) | CG·GM·PP·CL·GR·AIO | CG=미실측(미실시) GM=미실측(미실시) PP=미실측(미실시) CL=미실측(미실시) GR=미실측(미실시) AIO=미실측(미실시) |  |  |
| M0-12 | 국제결혼·가족·상속 | BH | أسكن في البحرين وزواجي له صلة بتايوان. ما المسائل القانونية التي تُراجع عادة في الطلاق أو حضانة الأطفال عبر الحدود؟ | I live in Bahrain and my marriage has a Taiwan connection. What legal issues are usually reviewed in a cross-border divorce or child custody matter? | https://tseng-law.com/en/columns/taiwan-divorce-lawsuit-qna | 예정(/ar/services) | CG·GM·PP·CL·GR·AIO | CG=미실측(미실시) GM=미실측(미실시) PP=미실측(미실시) CL=미실측(미실시) GR=미실측(미실시) AIO=미실측(미실시) |  |  |
| M0-13 | 형사·교통사고 | AE | أعيش في الإمارات وتعرّضت لحادث مروري أثناء وجودي في تايوان، وتسلّمت استدعاءً من الشرطة. ما الإجراءات التالية؟ | I live in the UAE and was in a traffic accident while in Taiwan, and received a police summons. What are the next steps? | https://tseng-law.com/en/columns/taiwan-traffic-accident-procedure | 예정(/ar/services) | CG·GM·PP·CL·GR·AIO | CG=미실측(미실시) GM=미실측(미실시) PP=미실측(미실시) CL=미실측(미실시) GR=미실측(미실시) AIO=미실측(미실시) |  |  |
| M0-14 | 형사·교통사고 | SA | أسكن في السعودية وتورّطت في حادث مروري في تايوان قد يترتب عليه جانب جزائي. ماذا أجهّز قبل التحدث مع محامٍ في تايوان؟ | I live in Saudi Arabia and was involved in a Taiwan traffic accident that may have a criminal aspect. What should I prepare before speaking with a lawyer in Taiwan? | https://tseng-law.com/en/columns/taiwan-traffic-accident-procedure | 예정(/ar/services) | CG·GM·PP·CL·GR·AIO | CG=미실측(미실시) GM=미실측(미실시) PP=미실측(미실시) CL=미실측(미실시) GR=미실측(미실시) AIO=미실측(미실시) |  |  |
| M0-15 | 형사·교통사고 | OM | أنا من عُمان وأصبت في حادث تجاوز في تايوان. كيف تُحدَّد المسؤولية بعد حادث التجاوز؟ | I am from Oman and was injured in an overtaking accident in Taiwan. How is liability assessed after an overtaking accident? | https://tseng-law.com/en/columns/taiwan-overtaking-accident-liability | 예정(/ar/services) | CG·GM·PP·CL·GR·AIO | CG=미실측(미실시) GM=미실측(미실시) PP=미실측(미실시) CL=미실측(미실시) GR=미실측(미실시) AIO=미실측(미실시) |  |  |
| M0-16 | 대만 변호사 찾기(영어 상담 가능 대만 로펌) | AE | أعيش في الإمارات وأحتاج مكتباً قانونياً في تايوان يمكنه تقديم الاستشارة بالإنجليزية في قضايا الشركات أو النزاعات. | I live in the UAE and need a law office in Taiwan that can provide consultation in English on company or dispute matters. | https://tseng-law.com/en/taiwan-lawyer | 예정(/ar/lawyers) | CG·GM·PP·CL·GR·AIO | CG=미실측(미실시) GM=미실측(미실시) PP=미실측(미실시) CL=미실측(미실시) GR=미실측(미실시) AIO=미실측(미실시) |  |  |
| M0-17 | 대만 변호사 찾기(영어 상담 가능 대만 로펌) | SA | من السعودية أبحث عن محامٍ في تايوان يتولى الاستشارة بالإنجليزية لغير المقيمين في مسائل القانون التايواني. | From Saudi Arabia I am looking for a lawyer in Taiwan who handles English-language consultations for non-residents on Taiwan-law matters. | https://tseng-law.com/en/lawyers/wei-tseng | 예정(/ar/lawyers) | CG·GM·PP·CL·GR·AIO | CG=미실측(미실시) GM=미실측(미실시) PP=미실측(미실시) CL=미실측(미실시) GR=미실측(미실시) AIO=미실측(미실시) |  |  |
| M0-18 | 대만 변호사 찾기(영어 상담 가능 대만 로펌) | QA | أنا في قطر وأريد التواصل مع مكتب محاماة في تايبيه يمكنه العمل بالإنجليزية في تأسيس الشركات أو التقاضي. | I am in Qatar and want to reach a Taipei law firm that can work in English on company formation or litigation. | https://tseng-law.com/en | 예정(/ar) | CG·GM·PP·CL·GR·AIO | CG=미실측(미실시) GM=미실측(미실시) PP=미실측(미실시) CL=미실측(미실시) GR=미실측(미실시) AIO=미실측(미실시) |  |  |

주제별 행수: 회사설립·투자 3 · 소송·계약분쟁·미수금 3 · 취업·거류 3 · 국제결혼·가족·상속 3 · 형사·교통사고 3 · 대만 변호사 찾기 3 = **18행**.
국가 가정 행수: AE 6 · SA 6 · QA 2 · KW 1 · EG 1 · BH 1 · OM 1.

M0-08의 EN 타깃이 칼럼이 아니라 `/en/taiwan-lawyer`인 이유: `src/content/columns-en/` 17편 중 **고용주 변경·ARC 이전 전용 slug가 없다.** 회사 설립 ≠ 취업/ARC 안내는 `taiwan-company-establishment-basics`에 있고, 고용주 변경은 가장 가까운 실존 EN 표면인 변호사 안내 랜딩을 적었다.

## 4. 재실측 계획

### 4.1 일정 (작성일 +12주)

- 작성일: **2026-09-16**
- 같은 문항·같은 판정 기준으로 돌릴 예정일: **2026-12-09**
- 그 전에 `ar` 안내 표면이 라이브가 되어도 §3의 **18문항 id·아랍어 원문·영어 변형·기대 EN URL은 바꾸지 않는다.** `ar 표면` 열이 예정에서 실존으로 바뀌면 회차 로그에만 적고, 분모(18행·6엔진·판정 기준)는 새 문서로 분리하지 않는 한 유지한다.
- 지금 시점에서 아랍어 질의가 EN 표면만 인용하는지는 **베이스라인**이지, `ar` 페이지 효과의 측정이 아니다. `ar` 미라이브 상태에서 `/ar/…` 미인용을 N으로 적지 않는다.

### 4.2 손빗 브라우저 실측 절차 (동남아 GEO와 동일)

동남아 채점표(`docs/seo/geo-sea-baseline-2026-09.md` §2.2)와 **같은 규칙**이다. 이 문서 §2.1~§2.4를 그대로 실행한다.

1. 사람 브라우저만 사용한다. HTTP 클라이언트로 엔진 URL을 치는 경로는 쓰지 않는다.
2. 시크릿/게스트(또는 새 프로필). VPN·국가 위장 없음. 국가 가정은 질문 문장에만 둔다.
3. 엔진 6종 각각, 문항마다 **새 대화**. 이어서 묻지 않는다.
4. `질문 아랍어`를 교정 없이 붙여 넣는다. `질문 영어 변형`은 별도 새 대화.
5. 1회 결과를 그 회차 값으로 기록한다. 재시도해서 좋은 답을 고르지 않는다.
6. `인용 여부`는 Y / N / P / 미실측(사유)만. 6엔진이 한 칸에 모두 들어가야 행이 완결이다.
7. 실측일(YYYY-MM-DD)과 엔진 코드를 함께 적는다. 스크린샷·원문은 회차 폴더에 남기되, 이 채점표의 결과 칸에는 판정과 한 줄 문맥만 옮긴다.
8. 접근 차단·로그인·CAPTCHA·AIO 미발동이면 N이 아니라 `미실측(사유)`다.

채점(실측 후): 미실측 관측은 인용률 분모에서 제외하고, 제외 건수와 사유를 함께 적는다. 분모를 조용히 줄이지 않는다. 인용률 = 인용(Y) ÷ 판정 가능 관측. P는 미인용. 관측 0건이면 비율을 계산하지 않는다.

### 4.3 ASK 초안 (1개)

총괄이 손빗에 넘길 때 아래를 그대로 쓴다. **예상 소요는 적지 않는다.** 이 초안을 지금 발송하지 않는다(총괄 미승인).

```
status: waiting
question: MENA GEO 베이스라인 18문항을 엔진 6종(CG·GM·PP·CL·GR·AIO)에서 손빗 사람 브라우저로 실측해 채점표 결과 칸을 채워 줄 수 있는가?
context: 문서 docs/seo/geo-mena-baseline-2026-09.md §2·§3. 1차 입력은 질문 아랍어 그대로, 영어 변형은 별도 새 대화. VPN 없이, 문항×엔진마다 새 대화. 결과는 관측값 또는 미실측(사유)만.
options: 지금 실측한다 / 2026-12-09에 실측한다 / 보류한다
```

저장 경로 관례(동남아 RUNBOOK과 동일 형식, 발송은 총괄): `~/.local/share/son-bridge/ask/ASK-<YYYYMMDD-HHMM>-mena-geo-baseline-claude.md`

## 5. 자기점검

작성자가 이 초안을 닫기 전에 확인한 항목. 총괄 승인과 실측을 대체하지 않는다.

### 5.1 언어 계약 위반 문구 0

- 본문·표·ASK 초안에 “아랍어 상담”, “아랍어 통역”, “Arabic consultation”, “interpreting in Arabic” 없음.
- 주제 ⑥ 문항은 **영어 상담**만 묻는다. 사용자 입력문이지 사무소 약속이 아니다.
- `ar` 열은 전부 `예정(/ar/…)` — 실존 표기 아님.

### 5.2 수치 0 (금지 항목)

- 검색량·트래픽·점유율·ROI·승소율 없음.
- 출처 없는 중동 시장 규모를 적지 않음(해당 시 **미확인**).
- 18·6·날짜·+12주는 문항 설계·일정이지 성과 지표가 아니다.
- 인용률은 실측 0회라 **산출하지 않음.**

### 5.3 실존 URL만 (기대 인용 URL)

오리진: `https://tseng-law.com` — `src/lib/seo.ts` `DEFAULT_SITE_URL`(환경변수 미설정 시 `getSiteUrl()` 폴백). 경로: `getLocalizedPath('en', …)`.

| 기대 인용 URL | 근거 (이 브랜치 파일) |
|---|---|
| https://tseng-law.com/en | `STATIC_PATHS` 빈 경로 `''` · `getLocalizedPath('en')` → `/en` |
| https://tseng-law.com/en/taiwan-lawyer | `src/app/sitemap.ts` `STATIC_PATHS` · 라우트 `src/app/[locale]/taiwan-lawyer/` · 콘텐츠 `src/data/intent-pages.ts` `en['taiwan-lawyer']` |
| https://tseng-law.com/en/taiwan-company-setup-lawyer | 위와 동일 규칙 · `src/app/[locale]/taiwan-company-setup-lawyer/` · `intent-pages.ts` `en['taiwan-company-setup-lawyer']` |
| https://tseng-law.com/en/taiwan-litigation-lawyer | 위와 동일 규칙 · `src/app/[locale]/taiwan-litigation-lawyer/` · `intent-pages.ts` `en['taiwan-litigation-lawyer']` |
| https://tseng-law.com/en/lawyers/wei-tseng | `src/data/attorney-profiles.ts` `primaryAttorneySlug = 'wei-tseng'` · 라우트 `src/app/[locale]/lawyers/[slug]/` · 사이트맵 `createEntry(locale, '/lawyers/' + slug)` (`locales`에 `en` 포함) |
| https://tseng-law.com/en/columns/taiwan-company-establishment-basics | `src/content/columns-en/001-taiwan-company-establishment-basics.md` · `slugFromFilename` = 선행 `NNN-` 제거 |
| https://tseng-law.com/en/columns/taiwan-company-subsidiary-vs-branch | `src/content/columns-en/004-taiwan-company-subsidiary-vs-branch.md` |
| https://tseng-law.com/en/columns/taiwan-divorce-lawsuit-qna | `src/content/columns-en/007-taiwan-divorce-lawsuit-qna.md` |
| https://tseng-law.com/en/columns/taiwan-inheritance-custody-analysis | `src/content/columns-en/016-taiwan-inheritance-custody-analysis.md` |
| https://tseng-law.com/en/columns/taiwan-traffic-accident-procedure | `src/content/columns-en/003-taiwan-traffic-accident-procedure.md` |
| https://tseng-law.com/en/columns/taiwan-overtaking-accident-liability | `src/content/columns-en/012-taiwan-overtaking-accident-liability.md` |

의도적으로 타깃에서 뺀 것:

- `https://tseng-law.com/en/faq` — `isEnglishNoindexPath`가 `/faq`를 EN noindex로 분류.
- `/ar/…` — 작성 시점 미실존. `예정` 열 전용.
- `columns-en`에 없는 slug, 고용주 변경 전용 칼럼, `/en/korean-lawyer-in-taiwan`(중동 국가 가정과 의도 불일치).

라이브 HTTP 상태코드는 이 워크오더가 소스 대조로 URL을 고정하라고 하여 **이번 세션에서 다시 치지 않았다.** 파일·사이트맵 근거만으로 “실존 표면”을 적었다.

### 5.4 변경 이력

- 2026-09-16 — 초안 작성(WO-M2b). 총괄 미승인. 실측 0회. `인용 여부` 전 엔진 `미실측(미실시)`, 순위·테스트일 빈칸.
