# SEA B2B(①회사설립·투자 / ⑤계약·미수금·소송) SEO·GEO 진단 — 2026-09-11 (S7-R1)

작성: 2026-09-11 · 작성자: seo-geo-expert 서브에이전트 · 워크트리 `~/Projects/tseng-law-sea-b2b-20260911`
범위: 의도 ①·⑤만. 대상 VN·ID·PH(상세) + TH·MY·SG(요약). 의도 ②③(이주노동자·ARC 등)은 별도 트랙 — 이 문서에서 다루지 않는다.
전제 문서: `docs/seo/sea-geo-plan/PROMPT.md` §4 하드룰, `docs/seo/sea-intent-map-2026-09.md`, `docs/seo/FROM-GROK-BOT-SEA-2026-09.md`(GSC 베이스라인 2026-09-09), `docs/seo/taiwan-lawyer-ad-rules-2026-08-18.md`, `docs/seo/SEO-DIAGNOSIS-2026-08-18.md`, `docs/seo/sea-b2b-plan/GOAL.md`.
코퍼스 부팅: 옵시디언 `40-Resources/SEO-GEO-전문지식/🗺️ SEO-GEO-전문지식.md` → 본문 완독 8편(국제-다국어 / YMYL-법률 / GEO-개념-학술 / AI-검색표면별 / 구조화데이터 / 로컬-GBP / GEO-측정도구-KPI / SEO-거부된-폴클로어) + 엔티티-브랜드 노트 요약부. 이하 “[코퍼스: 노트명 §]”로 인용.

**이 문서가 하지 않는 것.** 트래픽·점유율·ROI 예측치를 만들지 않는다. 검색량을 적지 않는다. 승소율·최고·유일 표현을 쓰지 않는다. vi/id/th/fil 상담 가능을 암시하지 않는다(상담 언어는 EN/ZH/JA/KO만). `src/` 변경 없음, 이 파일 1개만 생성.
**표기.** 각 진술은 **확정**(1차 자료·자사 실측) / **추정**(간접 근거) / **미확인**(근거 없음)으로 구분. 증거등급 A=1차 공식·법령·자사 실측, B=벤더 공식 문서·대형 기관 조사, C=업계 단일 실측(방법론 공개), D=전문가 의견·재인용, E=가설.

---

## 1. 진단 요약 (5줄)

1. **①⑤가 VN/ID/PH 검색·AI에 안 보이는 1차 원인은 “콘텐츠 부재”가 아니라 “색인 부재”다.** 4로케일 핵심 40 URL 중 검사된 14건 전부 “URL not known to Google”, 사이트 전체 미색인 148(발견-미크롤 127) [A: FROM-GROK-BOT 2026-09-09]. 그런데 라이브 확인 결과 `/vi|id|th|fil/columns/`에 **①(회사설립) 현지어 장문 칼럼이 이미 17편×4로케일 존재**한다(예: `/vi/columns/taiwan-company-establishment-basics` 5,788어, `lang=vi`, index,follow, Article JSON-LD, sitemap hreflang 8로케일+x-default) [A: 2026-09-11 curl]. 색인 안 된 페이지는 Google AIO/AI Mode 후보군에 들어갈 수 없고, Perplexity 인용의 65%가 Google 상위10과 겹치므로 AI 표면에서도 동시에 사라진다 [코퍼스: AI-검색표면별 §확정].
2. **⑤(미수금·계약·소송)는 현지어 표면이 0이다.** 4로케일 칼럼 17편 슬러그에 채권추심·계약분쟁 주제가 없고, 4로케일에는 임의 슬러그를 만들 수 없어(`GUIDANCE_CORE_ROUTE_KEYS` 10개만 통과) ⑤는 `/{l}/services` 한 페이지의 H2 한 줄로만 존재한다 [A: `src/lib/public-guidance.ts`, `/vi/services` curl]. EN 랜딩 `/en/taiwan-litigation-lawyer`가 ⑤의 하나뿐인 표면이며 hreflang 클러스터는 ko·zh-Hant·en·ja+x-default=en으로 SEA 로케일 변형이 없다(존재하지 않으므로 정상).
3. **6개국 모두 Google이 절대 지배 엔진**(VN 94.72 / ID 93.07 / PH 90.74 / TH 99.48 / MY 92.99 / SG 92.61%, StatCounter 2026-08, 조회 2026-09-11) [B]. 따라서 “SEA-Bing” 류 우회는 없고(기각안 재검토 금지), 승부는 Google 색인→순위→AIO/AI Mode 자격 한 줄로 수렴한다. Google AI Mode는 Indonesian·Thai·Vietnamese·Filipino·Malay와 6개국 전부에서 제공 중이다 [B: Google Help 16011537, 조회 2026-09-11].
4. **질의 언어 가설의 근거는 나라마다 다르다.** PH는 헌법상 영어가 공용어(A), SG는 영어가 행정언어(B, 조문 본문 미열람), MY는 말레이어 국어+영어 상용(D). 그런데 **자사 GSC에서 SG 단 하나의 노출은 간체 중국어 질의(`台湾公司设立`·`台湾注册公司`)로 zh-Hant 가이드에 걸린 것**이어서 “SG=영어” 가설은 부분 반증 상태다 [A: sea-intent-map §SG]. 국가별 **법률·비즈니스 검색의 언어 분포 실측치는 미확인**이다.
5. **GEO 관점의 결손은 “마크업”이 아니라 “인용 단위·엔티티 일관성·오프사이트 권위”다.** FAQ 리치결과는 2026-05-07 종료(마크업 자체는 무해) [코퍼스: 구조화데이터]; AI 인용 단위는 “서술형 소제목+첫 문장”이고 FAQ는 인용의 1.08% [코퍼스: YMYL-법률]; 법률 AI 질의는 디렉터리가 지배(Perplexity 첫 인용의 77.8%) [코퍼스: YMYL-법률]. 자사 표면에는 Person `knowsLanguage`에 English가 빠져 ContactPoint(`en` 포함)와 어긋나고, vi 칼럼의 FAQPage가 `inLanguage: en`이며 H2에 “대만–한국 조세조약”이 남아 있는 등 SEA 독자 기준 **엔티티·사실 정합성 결손**이 관찰된다 [A: 2026-09-11 curl].

---

## 2. 국가별 검색 표면

공통 출처: StatCounter Global Stats “Search Engine Market Share — {국가} — August 2026”(전 플랫폼), 조회 2026-09-11 [B; StatCounter는 자사 추적코드 설치 사이트 표본 — 데스크톱 과대표집 가능, 코퍼스 국제-다국어 노트의 동일 경고]. Google AI Mode 제공 국가·언어: Google Search Help 16011537(조회 2026-09-11) [B]. 생성형 AI 이용: Reuters Institute DNR 2026(YouGov 온라인 패널, **뉴스 목적** 주간 이용률 — 법률 질의 이용률이 아님; Reporting ASEAN 2차 요약, 조회 2026-09-11) [B/C]. 자사 GSC: FROM-GROK-BOT 2026-09-09, 28일 웹 [A].

### 2.1 베트남 (VN) — 상세
- **엔진(확정)**: Google 94.72 · Cốc Cốc 4.44 · Bing 0.47 · Yahoo 0.27%. Cốc Cốc은 자체 엔진이지만 점유가 작고 Google 색인과 무관하게 별도 대응할 근거 없음.
- **비즈니스·법률 질의 언어(추정)**: 베트남어 우세. 근거: (i) 베트남어 “thành lập công ty tại Đài Loan” 검색에서 상위가 **베트남 로펌의 베트남어 페이지**(Luật Việt An·Siglaw·Luật Tư Vấn)로 채워짐 [A: 2026-09-11 검색·URL 200 확인] — 현지어 공급이 형성돼 있다는 것은 현지어 수요의 간접 증거. (ii) AMTA RCT에서 **베트남어 사용자의 브라우저 자동번역 이용률이 가장 높음(14.8%)** → 영어 원문을 만나도 번역해 읽는 습성 [코퍼스: 국제-다국어 §2]. 실측 언어 분포: **미확인**.
- **생성형 AI(미확인)**: DNR 2026은 VN 미조사. Google AI Mode 베트남어·베트남 제공 [B]. ChatGPT 국가별 이용 통계 공개 없음.
- **자사 베이스라인(확정)**: 클릭 0 / 노출 1 / 평균순위 11. 검사된 4로케일 URL 전부 미색인.
- **구조 특이점(확정)**: 베트남 투자자는 자국 “해외투자등록증(Giấy chứng nhận đăng ký đầu tư ra nước ngoài)” 절차를 먼저 밟는다(2026-04-03부터 재무부 관할, Nghị định 103/2026/NĐ-CP) [B: baochinhphu.vn 2026-04-04, 조회 2026-09-11]. 베트남 로펌 페이지는 이 “베트남 쪽 다리”를 팔고, **대만 쪽 다리(투심사 허가·자본검증·등기)는 대만 변호사 영역**이다. 자사 표면은 후자만 정확히 다루면 되고 베트남법을 서술하면 안 된다(관할 외).

### 2.2 인도네시아 (ID) — 상세
- **엔진(확정)**: Google 93.07 · Bing 2.84 · DuckDuckGo 1.73 · Yahoo 1.71%.
- **질의 언어(추정, 약함)**: 인도네시아어 검색 “mendirikan perusahaan di Taiwan …”의 상위 결과가 **영어·번체중문 페이지**(대만 회계법인·EOR 업체)였고 인도네시아어 전용 경쟁 페이지를 1회 검색에서 찾지 못함 [A: 2026-09-11, 단일 검색 — 표본 1]. 해석 두 갈래: (a) 인도네시아어 수요가 얇다, (b) 수요는 있으나 공급 공백 = 선점 여지. 어느 쪽인지 **미확인** → 12주 GSC로 판정(§7).
- **생성형 AI(확정, 뉴스 한정)**: AI 챗봇 뉴스 이용 주간 12%(5개 SEA 조사국 중 가장 높음), AI 답변 신뢰 22% [B/C: DNR 2026 via Reporting ASEAN]. Google AI Mode 인도네시아어 제공(2025-09 최초 비영어 5언어 중 하나) [B].
- **자사 베이스라인(확정)**: 클릭 0 / 노출 1 / 평균순위 8.

### 2.3 필리핀 (PH) — 상세
- **엔진(확정)**: Google 90.74 · Bing 6.14 · Yahoo 2.45%. Bing이 6개국 중 가장 높지만 한 자릿수 — 별도 전술 근거 없음.
- **질의 언어(확정+추정)**: 1987 헌법 제14장 §7 “official languages … are Filipino and, until otherwise provided by law, English” [A: lawphil.net 원문, 조회 2026-09-11]. 필리핀어(타갈로그) 질의 “paano magtayo ng kumpanya sa Taiwan”의 상위 결과가 **전부 영어·중문**이고 필리핀어 전용 페이지 0 [A: 2026-09-11 단일 검색]. → **PH 비즈니스·법률 질의는 영어 우세**로 추정(등급 B). fil 페이지의 역할은 “검색 진입”보다 “진입 후 이해 보조”에 가깝다(코퍼스 AMTA RCT: 번역 제공은 체류·참여를 높임 [코퍼스: 국제-다국어]).
- **생성형 AI(확정, 뉴스 한정)**: 주간 9%(전년 동일), 신뢰 15%(5개국 최저). 용도는 요약 52%·후속질문 48%·출처 확인 39% [B/C: DNR 2026]. Google AI Mode Filipino 제공 [B].
- **자사 베이스라인(확정)**: 클릭 0 / 노출 1 / 평균순위 86.

### 2.4 태국 (TH) — 요약
- Google 99.48%(6개국 중 가장 높은 집중) [B]. AI 챗봇 뉴스 이용 8%, 신뢰 31%(5개국 중 가장 높음) [B/C]. AI Mode Thai 제공 [B]. 자사 노출 0/0 [A]. 태국어 법률 질의 언어 분포 **미확인**(태국어 우세 추정 E). ①⑤ 태국어 경쟁 표면 미조사.

### 2.5 말레이시아 (MY) — 요약
- Google 92.99 · Bing 4.42%. AI 챗봇 뉴스 11%, 신뢰 18% [B/C]. AI Mode Malay 제공 [B]. 헌법 152조 말레이어 국어(D: 조문 미열람) + 영어 비즈니스 상용(D). 자사 노출 0/7, 평균순위 3.1 — **노출 7건은 EN 표면**으로 추정(페이지 미분해, sea-intent-map “MY/SG는 EN 표면 사용”) [A/추정]. 사이트에 `ms` 로케일 없음 → MY는 EN 표면으로만 잡는다(§6 (c)).

### 2.6 싱가포르 (SG) — 요약
- Google 92.61 · Bing 3.61 · Cốc Cốc 1.06%(재싱 베트남 인구 흔적 추정 E). AI 챗봇 뉴스 11%(7%→11%, 최대 증가), 신뢰 18% [B/C]. 영어=행정언어(B: 헌법 153A, sso.agc.gov.sg 본문 curl 403 → **미열람**). **자사 실측**: 클릭 2/노출 20, 평균순위 49.7, 단일 페이지 `/zh-hant/guides/taiwan-company-setup`, 질의는 **간체** `台湾公司设立`·`台湾注册公司` [A]. → SG 사업주의 일부는 중국어로 검색하고, 자사 zh-Hant 표면이 간체 질의에도 걸린다(Google의 간·번체 교차 매칭, 순위 49.7=2페이지 밖). SG를 “영어만”으로 보면 실측을 버리는 것.

---

## 3. 질의 클러스터 (전부 **가설** — 검색량 없음, 12주 GSC 질의 리포트로 검증)

형식: 현지어 / English. ①=회사설립·투자, ⑤=계약·미수금·소송.

### VN
①: `thành lập công ty tại Đài Loan` · `mở công ty con ở Đài Loan` · `chi nhánh hay công ty con Đài Loan` · `thủ tục đầu tư vào Đài Loan người nước ngoài` · `luật sư thành lập công ty Đài Loan` / `set up a company in Taiwan from Vietnam` · `Taiwan subsidiary vs branch for Vietnamese company` · `Taiwan foreign investment approval MOEA`
⑤: `công ty Đài Loan không trả tiền hàng` · `đòi nợ đối tác Đài Loan` · `kiện công ty Đài Loan vi phạm hợp đồng` · `luật sư Đài Loan tranh chấp thương mại` · `lệnh thanh toán Đài Loan (支付命令)` / `Taiwan company refuses to pay invoice` · `sue a Taiwanese company from Vietnam` · `Taiwan debt recovery lawyer`

### ID
①: `mendirikan perusahaan di Taiwan` · `cara buka PT di Taiwan untuk WNI` · `anak perusahaan vs kantor cabang Taiwan` · `izin investasi asing Taiwan MOEA` · `pengacara pendirian perusahaan Taiwan` / `Indonesian company opening Taiwan subsidiary` · `Taiwan company registration for foreigners` · `Taiwan branch office registration`
⑤: `perusahaan Taiwan tidak bayar` · `menagih piutang ke perusahaan Taiwan` · `sengketa kontrak dengan perusahaan Taiwan` · `gugat perusahaan Taiwan` · `pengacara litigasi Taiwan` / `Taiwan supplier dispute lawyer` · `unpaid invoice Taiwan company legal action` · `Taiwan civil lawsuit foreign company power of attorney`

### PH
①: `paano magbukas ng kumpanya sa Taiwan` · `magtayo ng negosyo sa Taiwan Pilipino` · `Taiwan subsidiary para sa Philippine company` · `abogado sa Taiwan para sa kumpanya` · `Taiwan company registration requirements Filipino` / `Philippine company set up branch in Taiwan` · `Taiwan company setup lawyer English` · `how long to register a company in Taiwan` · `Taiwan foreign investment approval timeline`
⑤: `Taiwan company hindi nagbayad` · `paano maningil sa Taiwan company` · `kaso laban sa Taiwan supplier` / `Taiwan company not paying Philippine supplier` · `collect debt from Taiwanese company` · `Taiwan contract dispute lawyer English-speaking` · `Taiwan payment order procedure` · `Taiwan litigation without visiting`

### TH (요약)
①: `จดทะเบียนบริษัทในไต้หวัน` · `ตั้งบริษัทลูกไต้หวัน` · `ขออนุมัติการลงทุนต่างชาติไต้หวัน` · `ทนายไต้หวัน ตั้งบริษัท` / `Thai company set up in Taiwan`
⑤: `บริษัทไต้หวันไม่จ่ายเงิน` · `ทวงหนี้บริษัทไต้หวัน` · `ฟ้องบริษัทไต้หวัน` · `ทนายคดีสัญญาไต้หวัน` / `Taiwan debt collection lawyer Thailand`

### MY (요약, EN 중심 + ms)
①: `set up company in Taiwan from Malaysia` · `Taiwan subsidiary Malaysian Sdn Bhd` · `Taiwan investment approval foreign` · `tubuhkan syarikat di Taiwan` · `Taiwan company registration lawyer`
⑤: `Taiwan company owe payment Malaysia` · `Taiwan supplier dispute lawyer` · `sue Taiwan company` · `syarikat Taiwan tidak bayar` · `Taiwan payment order foreign creditor`

### SG (요약, EN + 중문 병기)
①: `set up Taiwan subsidiary Singapore company` · `Taiwan company incorporation lawyer` · `台湾公司设立 新加坡` · `台湾注册公司 外资` · `Taiwan branch vs subsidiary tax`
⑤: `Taiwan counterparty refuses to pay` · `Taiwan debt recovery Singapore creditor` · `Taiwan commercial litigation lawyer English` · `台湾公司欠款 追讨` · `enforce judgment in Taiwan`

---

## 4. GEO(AI 인용) 관점: 지금 표면에 없는 것

전제 사실(코퍼스): Google AI 기능은 특별 마크업·llms.txt 불필요, 일반 SEO 기초 그대로(ai-optimization-guide 2026-07-10) [코퍼스: AI-검색표면별]; AI 인용 결정 요인은 **주제 일치·핵심 사실·최신성·순위**이고 포맷·스키마 효과는 통계적으로 null(Ahrefs 1,885페이지 DiD) [코퍼스: GEO-개념-학술]; 법률 AI 인용은 디렉터리 편중, 인용 단위는 “서술형 소제목+첫 문장”, FAQ는 1.08% [코퍼스: YMYL-법률]; 브랜드 멘션 상관 ρ≈0.66(백링크 0.22)은 상관이지 인과가 아님 [코퍼스: 엔티티-브랜드 §14-15].

| # | 결손 | 관찰(2026-09-11) | 왜 인용에 걸리나 | 등급 |
|---|---|---|---|---|
| G1 | **검색 자격(retrieval eligibility) 자체 부재** | 4로케일 핵심 URL 미색인, 사이트 148 미색인·127 발견-미크롤; GSC 생성형 AI 34노출/0클릭(어느 페이지인지 미분해) | 색인 없으면 AIO/AI Mode 후보군 밖. Perplexity·ChatGPT도 검색엔진 상위와 겹침 | A |
| G2 | **답변 블록(인용 단위) 부재** | vi 칼럼 H2는 “1. Hình thức hiện diện…” 번호형, 첫 문장은 서술 도입부. EN 랜딩은 hero+FAQ 구조 | AI 발췌는 “질문형 소제목 직후 1~2문장 직답”을 집는다. 첫 문장이 도입부면 인용 단위가 없다 | C |
| G3 | **엔티티 정합성 균열** | Person `knowsLanguage: Korean·Chinese·Japanese`(English 없음) vs LegalService `availableLanguage: en·zh-Hant·ja·ko`; vi 칼럼 FAQPage `inLanguage: en`, H2 “Frequently Asked Questions” 영어 그대로 | YMYL 책임 식별·언어 능력의 자기모순은 신뢰 신호를 깎는다(QRG “responsibility identification”) | A(관찰)/D(효과) |
| G4 | **SEA 독자 기준 핵심 사실 불일치** | vi/id/fil ① 칼럼에 “Thuế và Hiệp định thuế thu nhập Đài Loan–Hàn Quốc”(대만–한국 조세조약) 섹션 잔존(ko 원문 번역) | “핵심 사실 일치”가 인용 1순위 요인. 베트남 독자 질의에 한국 조약 문단은 비일치 신호. 수정은 **기존 본문 변경 금지 룰**과 충돌 → 신규 페이지에서만 바로잡는다 | A(관찰) |
| G5 | **오프사이트 권위·멘션 부족** | 백링크·제3자 멘션 희소(8-18 진단). 법률 AI 인용은 디렉터리·정부·위키 지배 | 자사 페이지 단독으로는 “다른 곳에도 있는 사실”이 되기 어렵다. SEA-AUTHORITY-CANDIDATES(30행)는 발송 0건 — 사용자 승인 대기 | C |
| G6 | **⑤ 현지어 인용 표면 0** | 4로케일에 채권추심·계약분쟁 페이지 없음 | 질의 언어가 vi/id면 인용 후보가 없다 | A |
| G7 | 마크업 과투자 위험 | GOAL S7-C1에 FAQPage JSON-LD·llms.txt 포함 | 둘 다 위생 수준. FAQ 리치결과 종료(2026-05-07), llms.txt는 Google 레버 아님. **효과 기대치 0으로 두고 비용 최소화** | B |

**GEO 처방 방향(요약)**: G1을 풀지 않으면 G2~G7은 무의미. 순서는 색인 → 인용 단위 → 엔티티 정합 → 오프사이트 멘션.

---

## 5. 경쟁 표면 (URL 실확인분만; 조회 2026-09-11, HTTP 200 확인)

| 국가/언어 | 주체 | URL | 성격 | 시사점 |
|---|---|---|---|---|
| VN / vi | Công ty luật Việt An(베트남 로펌) | https://luatvietan.vn/dieu-kien-thanh-lap-cong-ty-tai-dai-loan.html | ① 조건·비자·MOECIC 허가 개요(베트남어) | 베트남어 ① SERP는 **베트남 로펌**이 점유. 이들은 대만 등기를 직접 수행하지 않는다 → “대만 쪽 다리”를 대만 변호사가 현지어로 설명하는 자리는 비어 있음 |
| VN / vi | Siglaw(베트남 로펌) | https://siglaw.com.vn/thanh-lap-cong-ty-tai-dai-loan.html | ① 해외투자등록증→대만 MOEA 접수 2단계 서술 | 동일 |
| VN / vi | Luật Tư Vấn | https://luattuvan.vn/thu-tuc-xin-giay-chung-nhan-dau-tu-sang-dai-loan-a2230.html | 베트남 해외투자등록 대행 | 동일(대만법 서술 없음) |
| VN / vi ⑤ | — | — | **미확인**: 베트남어 “đòi nợ công ty Đài Loan” 검색 상위가 대만 로펌 중문 페이지·판결문이었고 베트남어 ⑤ 페이지는 검색 1회에서 발견 못함 | 공급 공백(가설) |
| ID / id | — | — | **미확인**: 인도네시아어 ① 검색 상위에 인도네시아어 전용 페이지 없음(영·중문만) | 공급 공백 또는 수요 얇음 — 12주 판정 |
| PH / fil | — | — | **미확인**: 필리핀어 ① 검색 상위 전부 영·중문 | PH는 EN 표면 경쟁으로 봄 |
| EN(전역) ① | LY CPA Firm(대만 회계법인) | https://lytax.com.tw/eng-services/eng-business-registration/ | 영문 ① 서비스+FAQ(1–3개월, 최소자본 없음 등) | EN ①은 **회계법인·EOR·법인설립 대행**이 다수. 변호사 관점(분쟁 예방·계약·POA)이 차별 축 |
| EN ① | Statrys(핀테크 미디어) | https://statrys.com/blog/taiwan-company-setup | 절차형 가이드 | AI 인용 친화 구조(단계별 H2+직답) — 자사 답변 블록의 참조 형식 |
| EN ① | Hawksford(법인서비스) | https://www.hawksford.com/corporate-services/taiwan/starting-a-business | 구조·자본·승인 요약 | 동일 |
| EN ① | Healy Consultants | https://www.healyconsultants.com/taiwan-company-registration/incorporation-steps/ | 단계 서술 | curl 403(WAF) — 검색결과로만 존재 확인 |
| EN ⑤ | 富達法律事務所(대만 로펌) | https://fdlaw.com.tw/en/blog/taiwan-debt-collection-lawyer/ | “Taiwan Company Refuses to Pay?” 영어권 외국 채권자 대상 | **직접 경쟁**. 질문형 제목+상황 서술+절차 옵션(demand letter·provisional attachment) 구조. 자사 EN 소송 랜딩은 hero+FAQ라 서술 밀도가 낮음 |
| EN ⑤ | Grandliga | https://www.grandliga.com/debt-collection-in-taiwan/ | 절차 백과형(지급명령·집행·외국판결 승인) | 절차 어휘(payment order, provisional attachment, enforcement)가 EN ⑤ 인용 어휘 |
| zh-Hant ① | 益群聯合會計師事務所 | https://www.yih-chyun.com.tw/foreign-investment/ | 외자 설립 FAQ(1~1.5개월 등) | SG 간체 질의에 이런 대만 중문 페이지가 경쟁 |

미조사: TH·MY 현지어 경쟁, EN ① 로펌(Lexology·Legal500 게재 로펌은 디렉터리 경유라 자사 페이지 경쟁으로 분류하지 않음).

---

## 6. 처방 순위표

열: 증거등급 / 비용 / 하드룰 충돌 / 담당(코드·콘텐츠·사용자). “효과”는 방향만 적고 수치는 적지 않는다.

| 순위 | 처방 | 근거 | 등급 | 비용 | 하드룰 충돌 | 담당 |
|---|---|---|---|---|---|---|
| **P1** | **기존 4로케일 ① 칼럼(17×4=68 URL) 색인 상태 전수 확인 + 미색인 URL GSC 색인 요청**. 특히 `taiwan-company-establishment-basics`·`taiwan-company-subsidiary-vs-branch`·`withdraw-capital-taiwan-company`·`establishment-advanced-1/2` × vi/id/th/fil | 현지어 ① 콘텐츠는 이미 있음. 색인만 없다(§1-1). 신규 페이지보다 먼저 | A | 0원 | 없음 | 사용자(GSC) |
| **P2** | **4로케일 내부링크 보강**: `/{l}` 홈이 칼럼 4편만 링크(관찰). ① 칼럼 5편+`services` 투자 섹션↔칼럼 상호링크, `services` ⑤ H2에서 EN 소송 랜딩으로 언어 표시 링크(“English page”) | 발견-미크롤 127건의 통상 원인은 내부링크·크롤 우선순위. 코퍼스: 소형 사이트 크롤예산 공포 금지 — 예산이 아니라 **링크 그래프** 문제 | A(관찰)/B | 0원 | §4-7 “기술 SEO 재작업 금지”와 경계 — 링크 추가는 재작업 아님(확인 요) | 코드 |
| **P3** | **(a-2) `debt-collection` × vi/id/th/fil 신규 안내 페이지**(`GUIDANCE_EXTRA_PAGE_KEYS` 경로). 내용 = `/en/taiwan-litigation-lawyer` 기게재 사실만 번역(원격 착수·POA로 방문 없이 진행·지급명령/소송 순서·NT$3,000/시간 상담·미수금 절차). 구조 = 질문형 H2 + 첫 문장 직답 + 하단 “상담 언어는 English/中文/日本語/한국어” 명시. 새 법률 주장 0 | ⑤ 현지어 표면 0(G6). EN 랜딩에 사실이 이미 검수돼 있어 신규 주장 없이 만들 수 있음 | A(공백)/E(효과) | 0원(번역 레인) | 언어 계약 준수 필수: 메타·FAQ·JSON-LD `availableLanguage`에 vi/id/th/fil 금지. 승소율·보장 0 | 코드+콘텐츠 |
| **P4** | **(a-1) `company-setup` × 4로케일은 “장문 재번역”이 아니라 “허브+답변 블록”으로**: EN 랜딩 사실(약 3개월·지사 vs 자회사·등기≠체류·원격 착수) 8~12문장 직답 + 기존 ① 칼럼 5편 링크 + 소송 페이지 링크 | 장문은 이미 칼럼에 있음 → 중복 위험. 허브는 인용 단위(G2)와 링크 그래프(P2)를 동시에 만든다 | B | 0원 | `international-guidance-content.ts` 수정 금지 → 별도 데이터 파일(GOAL S7-C1 설계와 일치) | 코드+콘텐츠 |
| **P5** | **(d) hreflang·x-default·sitemap**: 신규 4로케일 페이지는 **EN 랜딩과 같은 클러스터**에 넣는다(`company-setup`→`/en/taiwan-company-setup-lawyer`·ko/zh/ja 인텐트 페이지, `debt-collection`→`/en/taiwan-litigation-lawyer`), x-default=en 유지, 사이트맵 단일 방식 유지(HTML head 중복 구현 금지), 상호참조 완비, lastmod 실제값 | 현 구현(사이트맵 전용·상호참조·x-default=en)은 정상 [A]. hreflang은 순위 신호가 아니라 URL 교체 신호 — “동일 콘텐츠의 언어판”일 때만 클러스터 [코퍼스: 국제-다국어]. 한 방식만 사용 원칙 | B | 0원 | §4-7 재작업 금지 — 신규 URL 추가만 | 코드 |
| **P6** | **(c) PH·MY·SG는 EN 표면으로 포착 — 단 SG는 zh-Hant 병행**: 신규 EN 페이지·en-SG hreflang 만들지 않음(기각안). `/zh-hant/guides/taiwan-company-setup`이 이미 SG 간체 질의에 걸리므로 그 페이지의 색인·내부링크만 점검 | PH 영어 공용어(A), SG 실측은 간체 질의(A), MY EN 노출 7(A/추정) | A/B | 0원 | 없음 | 사용자(관측) |
| **P7** | **(b) EN 랜딩에 SEA 맥락 추가 vs 신규 EN 페이지 → 둘 다 지금은 하지 않음.** 대신 EN 랜딩은 그대로 두고 P3·P4 신규 4로케일 페이지의 x-default를 EN 랜딩으로 묶어 “SEA 언어판이 있는 EN 페이지”로 만든다. SEA 특화 사실(베트남 해외투자등록증 등)은 **관할 외 외국법**이라 대만 변호사 페이지에 쓰지 않는다 | 기존 `intent-pages.ts` 본문 변경 금지(§4-3). 신규 EN 페이지는 ko·zh-hant·ja 동시 필요(타입 제약) → 비용 대비 근거 E. “SEA 맥락이 인용을 높인다”는 근거 없음 | E | — | §4-3 충돌 회피 | — |
| **P8** | **엔티티 정합 위생**: Person `knowsLanguage`에 English 추가(ContactPoint·상담언어 4와 일치), 신규 4로케일 페이지 FAQPage `inLanguage`를 해당 로케일로 | G3. 스키마는 순위 요인이 아니라 해석 장치 — 모순 제거 목적 [코퍼스: 엔티티-브랜드 §1] | A(관찰)/D | 0원 | `availableLanguage`는 건드리지 않음(언어 계약) | 코드 |
| **P9** | **(e) 0원 권위 신호**: ① Google Business Profile 보유 여부 확인 → 있으면 클레임·정합(주소·전화·8언어 안내≠상담언어 문구), 없으면 실주소 기반 개설. 리뷰 유도 금지. ② Bing WMT Citation Share 관측 시작. ③ SEA-AUTHORITY-CANDIDATES 30행은 **사용자 승인 후**에만 발송(재질문 금지 항목) | GBP는 2022-09 이후 남은 지오타게팅 신호이자 AI Mode 자기인용(google.com 인용의 36.1%=GBP) [코퍼스: 로컬-GBP·AI-검색표면별]. 크로스보더 로컬팩은 구조적으로 불가 — 기대치를 로컬팩에 두지 않음 | B | 0원 | 리뷰 인센티브 정책·推展業務規範 §2③ 연락처 표기 | 사용자 |
| P10 | **FAQPage JSON-LD·llms.txt는 위생만**: 만들되 효과 기대 0. FAQ 마크업은 화면에 보이는 문답에만(숨김 금지) | FAQ 리치결과 종료(2026-05-07), llms.txt Google 미채택 [코퍼스: 구조화데이터·AI-검색표면별] | B | 0원 | 숨김 FAQ 금지 | 코드 |
| P11 | **Wikidata 항목(사무소·변호사) 0원 생성 검토** — 위키피디아는 시도하지 않음 | Wikidata는 기준 ② 하나로 진입 가능, 위키피디아는 홍보성 배제·유상편집 금지 [코퍼스: 엔티티-브랜드 §11-13]. LLM 학습 인과 증명 불가 → 기대치 낮음 | D/E | 0원 | 사실만 기재 | 사용자 |
| 보류 | 유료 광고·유료 디렉터리·번역 확대(ms 추가) | 재질문 금지 항목/근거 부족 | — | 유료 | §4-9 | — |
| 관찰만 | vi/id/fil ① 칼럼의 “대만–한국 조세조약” 섹션(G4) | 기존 본문 변경 금지 → **콘텐츠 오너에게 관찰 보고만**. 수정 시 `[변호사 검수 필요]` | A(관찰) | — | §4-3 | 콘텐츠(보고) |

**판단 요약 (a)~(e)**
- (a) `debt-collection` 4로케일 = **가치 높음(현지어 표면 0)**, 리스크는 언어 계약·새 주장 유입 → EN 랜딩 사실만, 검수 마커. `company-setup` 4로케일 = **허브형으로 축소**(장문은 칼럼이 이미 담당, 중복 회피).
- (b) EN 랜딩 수정·신규 EN 페이지 **둘 다 보류**. SEA 맥락은 4로케일 신규 페이지+x-default 클러스터로 흡수.
- (c) PH·MY·SG = EN 표면 + **SG는 zh-Hant 병행**(실측 근거). en-SG hreflang·areaServed·SEA-Bing 재검토 없음.
- (d) 현 hreflang 구현 정상. 신규 페이지는 EN 랜딩 클러스터에 편입, x-default=en, 사이트맵 단일 방식, lastmod 실값.
- (e) 0원: GSC 색인 요청(P1) > 내부링크(P2) > GBP 정합(P9) > Bing Citation 관측 > Wikidata. 권위 등재 발송은 사용자 승인 대기.

---

## 7. 측정 설계

**분모 고정.** 베이스라인 = FROM-GROK-BOT 2026-09-09(28일 웹): VN 0/1, ID 0/1, TH 0/0, PH 0/1, MY 0/7, SG 2/20, 생성형 AI 34노출/0클릭. 판정일 **2026-12-02**(PROMPT §7·geo-sea-baseline과 동일).

### 7.1 GSC
1. **색인 층(L0)**: URL 검사 — 4로케일 ① 칼럼 68 URL + 신규 `company-setup`·`debt-collection` 8 URL + `/{l}/services` 4 URL. 주 1회 “색인됨/미색인(사유)” 기록. 사이트맵 리포트에서 발견-미크롤 수 추적.
2. **노출 층(L1)**: 실적 → 검색유형 웹 → 국가 필터 VN/ID/PH/TH/MY/SG 각각 × 페이지 필터(위 URL 군 + EN 랜딩 2 + `/zh-hant/guides/taiwan-company-setup`) → 질의 탭 내보내기. **질의 언어를 손으로 태깅**(현지어/영어/중문) — §2 언어 가설의 하나뿐인 직접 검증 수단.
3. **생성형 AI 층**: “Search generative AI” 포함 토글 → 노출만 제공(AIO+AI Mode 합산, 클릭 없음) [코퍼스: GEO-측정도구]. 페이지·국가 분해 저장. 34노출의 페이지 귀속을 첫 주에 확정.
4. 순위 평균은 노출 5 미만 셀에서 해석 금지(표본 노이즈).

### 7.2 Bing WMT
- Citation Share(벤더 1차 인용 지표) 월 1회 스냅샷. 색인 130 → 신규 URL 반영 여부.

### 7.3 생성형 AI 수동 관측
- `docs/seo/geo-sea-baseline-2026-09.md` 31문항을 **사람 브라우저**로 실행(비브라우저 접근은 2026-09-09 전부 403). 문항당 **7런**, 2~4주 롤링, 인용 Y/N/P를 CI로 보고(Jaccard 0.32–0.43의 확률분포 [코퍼스: GEO-측정도구]). 미실측은 사유 병기.

### 7.4 12주 반증 조건 (2026-12-02 판정)
- **F1 색인 가설**: P1·P2 후 4로케일 ① 칼럼 68 URL 중 색인된 비율이 베이스라인(0/14 검사)과 다르지 않으면 → “내부링크·색인요청으로 풀린다” 가설 기각, 크롤 차단 요인(렌더링·중복 판정) 재조사.
- **F2 현지어 수요 가설(국가별)**: 신규 `debt-collection`/`company-setup` 4로케일 페이지가 색인된 뒤 6주 이상 지나도 해당 국가 필터에서 **해당 언어 질의 노출이 1건도 없으면** 그 언어의 ①⑤ 검색 수요 가설을 기각(ID·TH가 가장 먼저 기각될 후보; VN이 가장 늦게).
- **F3 EN 표면 가설(PH·MY·SG)**: EN 랜딩 2·zh-Hant 가이드에 PH/MY/SG 필터 노출이 베이스라인(PH 1·MY 7·SG 20) 대비 증가하지 않고 질의 언어가 영어가 아니면 → “EN으로 포착” 가설 기각, SG는 zh-Hant 가설로 대체.
- **F4 GEO 가설**: 색인 확보 후에도 GSC 생성형 AI 노출이 4로케일·EN 랜딩 페이지에 0이고 수동 7런 인용률 CI 하한 0이면 → 인용 단위(P4)·엔티티(P8)만으로 부족, 오프사이트 멘션(P9 승인 항목) 없이는 진전 없음으로 판정.
- **F5 안전 조건**: 12주 내 GSC/검색결과에서 vi/id/th/fil 상담 가능으로 읽히는 스니펫·AI 요약이 관측되면 즉시 문안 점검(언어 계약 위반 방지).
- 어느 조건도 **트래픽·클릭 목표치를 두지 않는다**. 판정은 “0 → 비0”, “베이스라인 대비 증감”, “질의 언어 분포”의 3종만.

---

## 8. 출처 표

| # | 출처 | URL | 조회일 | 등급 | 비고 |
|---|---|---|---|---|---|
| 1 | StatCounter Search Engine Market Share — Viet Nam, Aug 2026 | https://gs.statcounter.com/search-engine-market-share/all/viet-nam | 2026-09-11 | B | `/vietnam` 슬러그는 표 미출력, `/viet-nam` 정상 |
| 2 | StatCounter — Indonesia / Philippines / Thailand / Malaysia / Singapore, Aug 2026 | https://gs.statcounter.com/search-engine-market-share/all/{indonesia,philippines,thailand,malaysia,singapore} | 2026-09-11 | B | 추적코드 표본 편향 경고 |
| 3 | Google Search Help — AI Mode availability(국가·언어 목록) | https://support.google.com/websearch/answer/16011537 | 2026-09-11 | B | Indonesia·Malaysia·Philippines·Singapore·Thailand·Vietnam / Filipino·Indonesian·Malay·Thai·Vietnamese |
| 4 | Google Blog — AI Mode expands languages/locations (2025-10-07) | https://blog.google/products-and-platforms/products/search/ai-mode-expands-languages-locations/ | 2026-09-11 | B | |
| 5 | Google Blog — AI Overviews 200+ countries, 40+ languages (2025-05-20) | https://blog.google/products-and-platforms/products/search/ai-overview-expansion-may-2025-update/ | 2026-09-11 | B | Malay 포함 |
| 6 | Reuters Institute DNR 2026(PDF) + Reporting ASEAN 요약 | https://reutersinstitute.politics.ox.ac.uk/sites/default/files/2026-06/DNR%202026%20FINAL_2.pdf · https://www.reportingasean.net/news-trust-weakens-as-southeast-asians-lean-further-into-platforms/ | 2026-09-11 | B/C | YouGov 온라인 패널, **뉴스 목적** AI 이용률. VN 미조사 |
| 7 | 1987 필리핀 헌법 Art. XIV §7 | https://lawphil.net/consti/cons1987.html | 2026-09-11 | A | 원문 확인 |
| 8 | 싱가포르 헌법 Art. 153A | https://sso.agc.gov.sg/Act/CONS1963 | 2026-09-11 | B(미열람) | curl 403, 본문 미확인 |
| 9 | baochinhphu.vn — Nghị định 103/2026/NĐ-CP 해외투자 절차(2026-04-04) | https://baochinhphu.vn/dieu-kien-thu-tuc-cap-giay-chung-nhan-dang-ky-dau-tu-ra-nuoc-ngoai-102260404174512658.htm | 2026-09-11 | B | 베트남 정부 포털. 자사 페이지에 서술하지 않음(관할 외) |
| 10 | Luật Việt An / Siglaw / Luật Tư Vấn ① 베트남어 페이지 | §5 표 | 2026-09-11 | A(존재) | HTTP 200 |
| 11 | LY CPA · Statrys · Hawksford · Healy(403) · 益群 · 富達(fdlaw) · Grandliga | §5 표 | 2026-09-11 | A(존재) | 내용 진위는 미검증 |
| 12 | tseng-law.com 라이브: `/vi/services`, `/en/taiwan-company-setup-lawyer`, `/en/taiwan-litigation-lawyer`, `/vi/columns/taiwan-company-establishment-basics`, `/id/columns/taiwan-company-subsidiary-vs-branch`, `/fil/columns/…basics`, `/vi`, `/vi/guides/taiwan-company-setup`(404), `sitemap.xml`(275 URL), `robots.txt`, `llms.txt` | https://tseng-law.com/… | 2026-09-11 | A | HTML hreflang 0·Link 헤더 없음 → 사이트맵 전용 구현 |
| 13 | 레포: `docs/seo/FROM-GROK-BOT-SEA-2026-09.md`(GSC 2026-09-09) · `sea-intent-map-2026-09.md` · `sea-geo-plan/PROMPT.md` · `taiwan-lawyer-ad-rules-2026-08-18.md` · `SEO-DIAGNOSIS-2026-08-18.md` · `sea-b2b-plan/GOAL.md` · `docs/marketing/SEA-AUTHORITY-CANDIDATES-2026-09.md` · `src/lib/public-guidance.ts` · `src/data/intent-pages.ts` | 워크트리 | 2026-09-11 | A | 읽기만 |
| 14 | 옵시디언 SEO-GEO 코퍼스: 국제-다국어-SEO-현행 / YMYL-법률-SEO-GEO-플레이북 / GEO-개념-학술연구-현황 / AI-검색표면별-현행-지도 / 구조화데이터-스키마-현행 / 로컬-SEO-GBP-현행 / GEO-측정도구-KPI / SEO-거부된-랭킹요인-폴클로어 / 엔티티-브랜드-지식그래프 (전부 2026-08 딥리서치) | `~/Library/Mobile Documents/com~apple~CloudDocs/Obsidian-Vault/40-Resources/SEO-GEO-전문지식/` | 2026-09-11 | B~C(노트별 표기 따름) | 2차 인용 수치(Ahrefs DiD·Perplexity 77.8%·Jaccard 등)의 1차 출처는 각 노트 출처표 |

규제 게이트: 업종=대만 변호사 광고 / 관할=대만 — 확인 조문=律師推展業務規範 §2③④·§3·§4·§5①(승소율 절대 금지), 函釋 108031號(수임료 표시 가능) — 미확인=없음(이 문서는 표면·측정 처방만, 신규 법률 주장 0) — 준수선=자사 사이트 廣告 표기 면제·제3자 매체 廣告 표기·상담 언어 4개만·승소율/최고/유일 0.
