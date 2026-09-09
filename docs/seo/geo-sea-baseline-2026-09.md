# GEO 동남아 인용 베이스라인 — 2026-09 (S0d)

작성: 2026-09-09 · 워크오더 WO-S0d · 작업트리 `tseng-law-sea-seo-20260909`
목적: 동남아 사용자가 대만 법률 문제를 생성형 AI에 물을 때 `tseng-law.com`이 인용되는지를 **분모부터 고정**한다. 이 문서는 채점표이며, 결과 칸은 실측 전까지 전부 비어 있다.
재실측 예정일: **2026-12-02**(작성일 +12주). 같은 문항·같은 판정 기준으로 1회 더 돌린다.

## 0. 이 문서가 주장하지 않는 것

- 검색량·트래픽·점유율·ROI 수치는 **한 건도 적지 않는다**(WO 금지 항목). 이 문서에 숫자가 없는 것은 누락이 아니라 규칙이다.
- 인용 결과는 **미리 채우지 않는다**. `인용 여부` / `인용 순위·문맥` / `테스트일` 칸이 비어 있는 것이 정상 상태다.
- 엔진 접근 조건(로그인·지역 제한 등)은 2026-09-09 시점 **미검증**이다. §2 표의 해당 칸은 실측 1회차에 실제로 확인한 뒤 갱신한다.

## 1. 언어 계약 (이 문서 전체에 적용)

- `vi` / `id` / `th` / `fil` 은 **안내(guidance) 언어**다. 해당 언어 페이지는 정보 안내만 제공한다.
- **변호사 상담 언어는 English / Chinese / Japanese / Korean 뿐이다.** 이 문서의 어떤 행도 vi·id·th·fil 로 상담·통역이 가능하다는 뜻이 아니다.
- 표의 `질문 현지어` 칸은 **사용자가 AI에 입력할 문장**이지, 사무소가 그 언어로 상담한다는 표시가 아니다. 이 구분을 흐리는 문구를 이 문서·메타·JSON-LD 어디에도 추가하지 않는다.
- 근거: `src/lib/public-guidance.ts`(GUIDANCE_LOCALES_4 = vi·id·th·fil, PUBLIC_LOCALES_8), `src/data/international-guidance-content.ts` 헤더 주석("consultations with an attorney are handled only in English, Chinese, Japanese and Korean").

## 2. 실측 절차

### 2.1 엔진과 접근 방법

| 코드 | 엔진 | 접근 경로 | 로그인 필요 여부 | 비고 |
|---|---|---|---|---|
| CG | ChatGPT | chatgpt.com 웹 | **확인 필요**(실측 1회차에 기록) | 웹 검색 도구 사용 여부를 응답마다 기록 |
| GM | Gemini | gemini.google.com 웹 | **확인 필요** | 응답에 붙는 출처 카드까지 기록 |
| PP | Perplexity | perplexity.ai 웹 | **확인 필요** | 출처 목록이 명시되므로 순위 기록이 가장 쉬움 |
| CL | Claude | claude.ai 웹 | **확인 필요** | 웹 검색이 꺼진 상태면 그 사실을 함께 기록 |
| GR | Grok | grok.com 또는 X 내 Grok | **확인 필요** | 접근 불가 시 "미실측(접근 불가)" |
| AIO | Google AI Overviews / AI Mode | google.com 검색 결과 상단 | 로그인 없이 관측 가능한 범위만 | **발동 자체가 조건부** — 미발동이면 "미실측(AIO 미발동)" |

### 2.2 실행 규칙

1. **문항 1개 = 엔진 1개 = 새 대화 1회.** 대화를 이어서 재질문하지 않는다(직전 응답이 다음 응답을 오염시킨다).
2. 입력은 표의 `질문 현지어`를 **그대로 복사**한다. 오타·구어체를 교정하지 않는다. 같은 행의 `질문 영어 변형`은 **별도 런**으로 돌리고, 두 결과를 각각 기록한다.
3. 개인화 제거: 시크릿/게스트 창 또는 새 프로필. 국가 가정(VN/ID/TH/PH/MY/SG)은 **질문 문장 안에 명시**하며, VPN·지역 위장은 하지 않는다(재현 불가능해진다).
4. 같은 문항을 여러 번 돌려 "좋은 결과"를 고르지 않는다. 1회 결과가 그 회차의 값이다.
5. 실측일(YYYY-MM-DD)과 엔진 코드를 반드시 함께 적는다. 날짜 없는 결과는 무효로 취급한다.

### 2.3 인용 판정 기준

- **인용(Y)**: 응답 본문·출처 목록·각주 어디에든 `tseng-law.com` 도메인 링크가 있거나, 링크 없이도 사무소명(Hovering International Law Firm / 昊鼎國際法律事務所 / 법무법인 호정)이나 소속 변호사명이 **명시적으로** 언급된 경우.
- **미인용(N)**: 응답에 다른 법무법인·정부·미디어 도메인만 인용된 경우. 경쟁 도메인만 인용된 것도 미인용이다.
- **부분(P)**: 사이트 문장이 인용된 정황은 있으나 도메인·사무소명이 특정되지 않아 귀속을 확정할 수 없는 경우. P는 인용률 계산에서 **미인용으로 처리**하고, 판정 근거를 문맥 칸에 남긴다.
- **미실측**: 판정 자체가 불가능한 경우. 반드시 사유를 괄호로 적는다 — 예) `미실측(AIO 미발동)`, `미실측(엔진 접근 불가)`, `미실측(해당 언어 입력 거부)`, `미실측(응답에 출처 표기 없음)`.
- `인용 순위·문맥` 칸 기록 형식: `출처목록 3/8 · 회사설립 절차 문단` 처럼 **순위 + 어느 맥락에서 인용됐는지** 한 줄. 순위 표기가 없는 엔진이면 `순위없음`.

### 2.4 기록 형식

`인용 여부` 칸에는 엔진별로 `CG=Y GM=N PP=Y CL=N GR=미실측(접근 불가) AIO=미실측(AIO 미발동)` 형태로 6개 값을 모두 적는다. 하나라도 빠지면 그 행은 미완으로 본다.

## 3. 문항 세트 (31행 · 5언어 × 6주제)

엔진 코드: **CG**=ChatGPT · **GM**=Gemini · **PP**=Perplexity · **CL**=Claude · **GR**=Grok · **AIO**=Google AI Overviews. 모든 행은 6엔진 전부를 대상으로 한다.

| id | 언어 | 국가 가정 | 주제 | 질문 현지어 | 질문 영어 변형 | 기대 타깃 URL | 엔진 | 인용 여부 | 인용 순위·문맥 | 테스트일 |
|---|---|---|---|---|---|---|---|---|---|---|
| S0-01 | en | SG | 회사설립·투자 | How do I set up a Taiwan subsidiary from Singapore, and do I need a local lawyer? | Setting up a Taiwan subsidiary as a Singapore company — is a Taiwanese lawyer required? | https://tseng-law.com/en/taiwan-company-setup-lawyer | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-02 | en | MY | 취업·거류비자 | If my company opens a Taiwan branch, does that automatically get me a work permit? | Does registering a Taiwan branch give the founder a work permit and residence status? | https://tseng-law.com/en/columns/taiwan-company-establishment-basics | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-03 | en | PH | 이주노동자 권리 | I am a Filipino worker in Taiwan and my employer terminated me — am I entitled to severance? | Severance pay rules in Taiwan for a foreign employee dismissed by the employer | https://tseng-law.com/en/columns/taiwan-labor-severance-law | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-04 | en | SG | 국제결혼·가족·상속 | My father died in Taiwan and I live in Singapore — how does Taiwanese inheritance work for foreign heirs? | Taiwan inheritance procedure when the heirs live outside Taiwan | https://tseng-law.com/en/columns/taiwan-inheritance-custody-analysis | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-05 | en | MY | 계약·미수금 | A Taiwanese supplier will not pay our invoice — can we sue them in Taiwan from Malaysia? | Suing a Taiwanese company for unpaid invoices as an overseas creditor | https://tseng-law.com/en/taiwan-litigation-lawyer | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-06 | en | PH | 형사·사고 | I was in a scooter accident in Taiwan and received a police summons — what happens next? | Taiwan traffic accident procedure for a foreigner who received a police summons | https://tseng-law.com/en/columns/taiwan-traffic-accident-procedure | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-07 | en | SG | 취업·거류비자 | Is there an English-speaking lawyer in Taiwan who handles expat employment problems? | English-speaking law firm in Taiwan for expatriate employment matters | https://tseng-law.com/en/taiwan-lawyer | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-08 | vi | VN | 회사설립·투자 | Người Việt muốn mở công ty ở Đài Loan cần luật sư không? | Does a Vietnamese founder need a lawyer to open a company in Taiwan? | https://tseng-law.com/vi/services | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-09 | vi | VN | 취업·거류비자 | Trước khi hỏi luật sư Đài Loan về giấy tờ cư trú và giấy phép lao động thì cần chuẩn bị gì? | What should I prepare before asking a Taiwanese lawyer about residence and work permit paperwork? | https://tseng-law.com/vi/faq | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-10 | vi | VN | 이주노동자 권리 | Lao động Việt ở Đài Loan bị nợ lương, thuê luật sư tốn khoảng bao nhiêu? | How is a lawyer's fee decided for a Vietnamese worker in Taiwan chasing unpaid wages? | https://tseng-law.com/vi/pricing | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-11 | vi | VN | 국제결혼·가족·상속 | Ly hôn với chồng người Đài Loan thì quyền nuôi con và chia tài sản thế nào? | Divorce from a Taiwanese spouse — how are custody and property division handled? | https://tseng-law.com/vi/services | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-12 | vi | VN | 계약·미수금 | Công ty Đài Loan không trả tiền hàng, liên hệ văn phòng luật sư ở Đài Loan kiểu gì? | A Taiwanese company will not pay for goods — how do I contact a law office in Taiwan? | https://tseng-law.com/vi/contact | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-13 | vi | VN | 형사·사고 | Bị tai nạn giao thông ở Đài Loan và nhận giấy triệu tập, luật sư nào bên đó nhận vụ hình sự? | Which lawyer in Taiwan takes criminal matters after a traffic accident summons? | https://tseng-law.com/vi/lawyers | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-14 | id | ID | 회사설립·투자 | Orang Indonesia mau buka perusahaan di Taiwan, perlu pengacara Taiwan nggak? | Does an Indonesian founder need a Taiwanese lawyer to open a company in Taiwan? | https://tseng-law.com/id/services | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-15 | id | ID | 취업·거류비자 | Sebelum tanya pengacara soal izin kerja dan izin tinggal di Taiwan, dokumen apa yang harus disiapkan? | What documents should I prepare before asking a lawyer about a Taiwan work and residence permit? | https://tseng-law.com/id/faq | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-16 | id | ID | 이주노동자 권리 | Pekerja migran Indonesia di Taiwan diberhentikan sepihak, pesangonnya gimana? | An Indonesian migrant worker in Taiwan was dismissed — what about severance? | https://tseng-law.com/id/services | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-17 | id | ID | 국제결혼·가족·상속 | Kantor hukum di Taiwan mana yang biasa menangani klien asing untuk perceraian dan waris? | Which law firm in Taiwan regularly handles divorce and inheritance for foreign clients? | https://tseng-law.com/id/about | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-18 | id | ID | 계약·미수금 | Nagih utang ke perusahaan Taiwan lewat pengacara, biayanya dihitung gimana? | How is the fee calculated when a lawyer pursues a debt against a Taiwanese company? | https://tseng-law.com/id/pricing | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-19 | id | ID | 형사·사고 | Saya kena kasus kecelakaan di Taiwan, gimana cara menghubungi pengacara di sana? | I am involved in an accident case in Taiwan — how do I reach a lawyer there? | https://tseng-law.com/id/contact | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-20 | th | TH | 회사설립·투자 | คนไทยจะไปเปิดบริษัทที่ไต้หวัน ต้องจ้างทนายไต้หวันไหม | Does a Thai founder have to hire a Taiwanese lawyer to open a company in Taiwan? | https://tseng-law.com/th/services | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-21 | th | TH | 취업·거류비자 | เปิดบริษัทที่ไต้หวันแล้วได้วีซ่าทำงานกับใบถิ่นที่อยู่เลยไหม | After registering a company in Taiwan, do I automatically get a work visa and residence permit? | https://tseng-law.com/th/services | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-22 | th | TH | 이주노동자 권리 | แรงงานไทยในไต้หวันโดนค้างค่าจ้าง จ้างทนายคิดค่าใช้จ่ายยังไง | A Thai worker in Taiwan has unpaid wages — how are lawyer's fees determined? | https://tseng-law.com/th/pricing | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-23 | th | TH | 국제결혼·가족·상속 | แต่งงานกับคนไต้หวันแล้วจะหย่า ลูกกับทรัพย์สินแบ่งยังไง | Divorcing a Taiwanese spouse — how are the children and the property dealt with? | https://tseng-law.com/th/services | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-24 | th | TH | 계약·미수금 | บริษัทไต้หวันไม่จ่ายค่าสินค้า จะติดต่อสำนักงานทนายที่ไต้หวันทางไหน | A Taiwanese company has not paid for goods — how do I contact a law office in Taiwan? | https://tseng-law.com/th/contact | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-25 | th | TH | 형사·사고 | โดนหมายเรียกจากตำรวจไต้หวันเรื่องอุบัติเหตุ ต้องเตรียมเอกสารอะไรก่อนคุยกับทนาย | I received a Taiwanese police summons about an accident — what should I prepare before talking to a lawyer? | https://tseng-law.com/th/faq | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-26 | fil | PH | 회사설립·투자 | Gusto kong magtayo ng kumpanya sa Taiwan, kailangan ko ba ng abogado doon? | I want to set up a company in Taiwan — do I need a lawyer there? | https://tseng-law.com/fil/services | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-27 | fil | PH | 취업·거류비자 | Bago ako magtanong sa abogado tungkol sa work permit at ARC sa Taiwan, ano ang ihahanda ko? | What do I prepare before asking a lawyer about a Taiwan work permit and ARC? | https://tseng-law.com/fil/faq | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-28 | fil | PH | 이주노동자 권리 | OFW ako sa Taiwan at bigla akong tinanggal, may separation pay ba ako? | I am an OFW in Taiwan and was suddenly dismissed — do I get separation pay? | https://tseng-law.com/fil/services | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-29 | fil | PH | 국제결혼·가족·상속 | Sino ang abogado sa Taiwan na humahawak ng diborsyo at kustodiya para sa mga dayuhan? | Which lawyer in Taiwan handles divorce and child custody for foreigners? | https://tseng-law.com/fil/lawyers | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-30 | fil | PH | 계약·미수금 | Magkano ang abogado sa Taiwan kapag sinisingil ang isang kumpanyang Taiwanese? | How is a lawyer's fee set in Taiwan when collecting from a Taiwanese company? | https://tseng-law.com/fil/pricing | CG·GM·PP·CL·GR·AIO |  |  |  |
| S0-31 | fil | PH | 형사·사고 | Naaksidente ako sa Taiwan at tinawagan ako ng pulis, paano ako makakakuha ng abogado doon? | I had an accident in Taiwan and the police called me — how do I get a lawyer there? | https://tseng-law.com/fil/contact | CG·GM·PP·CL·GR·AIO |  |  |  |

언어별 행수: en 7 · vi 6 · id 6 · th 6 · fil 6 = **31행**. 주제별 행수: 회사설립·투자 5 · 취업·거류비자 6 · 이주노동자 권리 5 · 국제결혼·가족·상속 5 · 계약·미수금 5 · 형사·사고 5.

## 4. URL 확인 (각 URL이 어느 파일·규칙에서 나오는가)

기준 오리진: `https://tseng-law.com` — `src/lib/seo.ts:90` `DEFAULT_SITE_URL`(환경변수 미설정 시 `getSiteUrl()`의 최종 폴백).

### 4.1 EN 랜딩 (3개)

- `https://tseng-law.com/en/taiwan-lawyer` — `src/app/sitemap.ts` `STATIC_PATHS`에 `/taiwan-lawyer` 포함 → `locales`(ko·zh-hant·en) 루프의 `createEntry` → `getLocalizedPath('en', …)`; 라우트 실체는 `src/app/[locale]/taiwan-lawyer/`, 콘텐츠는 `src/data/intent-pages.ts` `en['taiwan-lawyer']`. `isEnglishNoindexPath` 대상 아님 → `applyLocaleIndexabilityRules`에서 제거되지 않음.
- `https://tseng-law.com/en/taiwan-company-setup-lawyer` — 위와 동일 규칙(`STATIC_PATHS`의 `/taiwan-company-setup-lawyer`), 라우트 `src/app/[locale]/taiwan-company-setup-lawyer/`, 콘텐츠 `intent-pages.ts` `en['taiwan-company-setup-lawyer']`.
- `https://tseng-law.com/en/taiwan-litigation-lawyer` — 위와 동일 규칙(`STATIC_PATHS`의 `/taiwan-litigation-lawyer`), 라우트 `src/app/[locale]/taiwan-litigation-lawyer/`, 콘텐츠 `intent-pages.ts` `en['taiwan-litigation-lawyer']`.

### 4.2 EN 칼럼 (4개)

규칙: `src/app/sitemap.ts`의 `for (const post of columns) … createEntry(locale, '/columns/' + post.slug)`. `columns = getAllColumnPosts('ko')`, `slug = slugFromFilename(파일명)`(`src/lib/columns.ts:124` — `.md` 제거 + 선행 `NNN-` 제거). EN 행이 살아남는 조건은 `isEnglishNoindexPath(path, isFileBackedEnglishColumnPath)`가 false인 것, 즉 해당 slug가 파일 기반 칼럼일 것 — `src/content/columns-en/`에 동일 파일명이 존재한다(EN 17편 / KO 17편).

- `https://tseng-law.com/en/columns/taiwan-company-establishment-basics` — `src/content/columns-en/001-taiwan-company-establishment-basics.md`(title: "Setting Up a Company in Taiwan: Subsidiaries, Branches, Representative Offices, Procedures, and Work Permits").
- `https://tseng-law.com/en/columns/taiwan-labor-severance-law` — `src/content/columns-en/008-taiwan-labor-severance-law.md`.
- `https://tseng-law.com/en/columns/taiwan-inheritance-custody-analysis` — `src/content/columns-en/016-taiwan-inheritance-custody-analysis.md`.
- `https://tseng-law.com/en/columns/taiwan-traffic-accident-procedure` — `src/content/columns-en/003-taiwan-traffic-accident-procedure.md`.

### 4.3 안내 4언어 코어 페이지 (19개)

공통 규칙: `src/app/sitemap.ts` `appendGuidanceLocaleSitemapEntries()` → `GUIDANCE_LOCALES_4`(vi·id·th·fil) × `GUIDANCE_PAGE_KEYS`(home·services·about·lawyers·pricing·contact·faq·privacy·disclaimer·columns) 전조합을 `guidanceCanonicalUrl(locale, pageKey, siteUrl)`로 생성. 경로 형태는 `src/lib/public-guidance.ts`의 `guidancePublicPath()` = `/{locale}/{pageKey}`. 각 페이지 본문은 `src/data/international-guidance-content.ts`의 `guidanceContent[locale].pages[pageKey]`.

- `https://tseng-law.com/vi/services` — guidancePublicPath('vi','services') · 본문 `guidanceContent.vi.pages.services`("Các lĩnh vực văn phòng nhận xử lý").
- `https://tseng-law.com/vi/faq` — guidancePublicPath('vi','faq') · 본문 `guidanceContent.vi.pages.faq`.
- `https://tseng-law.com/vi/pricing` — guidancePublicPath('vi','pricing') · 본문 `guidanceContent.vi.pages.pricing`.
- `https://tseng-law.com/vi/contact` — guidancePublicPath('vi','contact') · 본문 `guidanceContent.vi.pages.contact`.
- `https://tseng-law.com/vi/lawyers` — guidancePublicPath('vi','lawyers') · 본문 `guidanceContent.vi.pages.lawyers`.
- `https://tseng-law.com/id/services` — guidancePublicPath('id','services') · 본문 `guidanceContent.id.pages.services`.
- `https://tseng-law.com/id/faq` — guidancePublicPath('id','faq') · 본문 `guidanceContent.id.pages.faq`.
- `https://tseng-law.com/id/about` — guidancePublicPath('id','about') · 본문 `guidanceContent.id.pages.about`.
- `https://tseng-law.com/id/pricing` — guidancePublicPath('id','pricing') · 본문 `guidanceContent.id.pages.pricing`.
- `https://tseng-law.com/id/contact` — guidancePublicPath('id','contact') · 본문 `guidanceContent.id.pages.contact`.
- `https://tseng-law.com/th/services` — guidancePublicPath('th','services') · 본문 `guidanceContent.th.pages.services`.
- `https://tseng-law.com/th/faq` — guidancePublicPath('th','faq') · 본문 `guidanceContent.th.pages.faq`.
- `https://tseng-law.com/th/pricing` — guidancePublicPath('th','pricing') · 본문 `guidanceContent.th.pages.pricing`.
- `https://tseng-law.com/th/contact` — guidancePublicPath('th','contact') · 본문 `guidanceContent.th.pages.contact`.
- `https://tseng-law.com/fil/services` — guidancePublicPath('fil','services') · 본문 `guidanceContent.fil.pages.services`.
- `https://tseng-law.com/fil/faq` — guidancePublicPath('fil','faq') · 본문 `guidanceContent.fil.pages.faq`.
- `https://tseng-law.com/fil/pricing` — guidancePublicPath('fil','pricing') · 본문 `guidanceContent.fil.pages.pricing`.
- `https://tseng-law.com/fil/contact` — guidancePublicPath('fil','contact') · 본문 `guidanceContent.fil.pages.contact`.
- `https://tseng-law.com/fil/lawyers` — guidancePublicPath('fil','lawyers') · 본문 `guidanceContent.fil.pages.lawyers`.

### 4.4 의도적으로 타깃에서 뺀 URL

- `https://tseng-law.com/en/faq` — `src/lib/seo-visibility.ts` `isEnglishNoindexPath`가 `/faq`를 EN noindex로 분류하므로 사이트맵의 EN 행이 삭제된다. 타깃으로 쓰지 않는다.
- `/{vi|id|th|fil}` 홈·`/columns`·`/privacy`·`/disclaimer` — 사이트맵에는 존재하지만 WO가 허용한 타깃 목록(services·faq·contact·pricing·lawyers·about)에 없어 제외.
- `https://tseng-law.com/en/korean-lawyer-in-taiwan` — 실존 URL(STATIC_PATHS)이나 이 세트의 동남아 국가 가정과 의도가 맞지 않아 사용하지 않았다.

## 5. 채점 방법 (12주 뒤)

- **분모**: 31행 × 6엔진 = 186 관측. 미실측 관측은 분모에서 제외하고, 제외 건수와 사유를 함께 적는다(분모를 조용히 줄이지 않는다).
- **1차 지표**: 인용률 = 인용(Y) ÷ (판정 가능 관측). 언어별·주제별·엔진별로 분해.
- **2차 지표**: 인용된 URL 분포(어느 페이지가 실제로 집히는가), 동반 인용 도메인 목록(경쟁·정부·미디어).
- **반증 조건 초안**: 2026-12-02 회차에서 안내 4언어(vi·id·th·fil) 행의 인용이 **0으로 유지**되면 "안내 언어 페이지 → 현지어 AI 질의 인용" 가설을 기각하고, 동남아 축의 투자를 EN 표면(랜딩·칼럼)과 인용원 확보로 재배분한다. 확정 문구는 1회차 실측 후 수치를 보고 고정한다.
- 이 문서의 분모(31행·6엔진·판정 기준)는 1회차 실측 이후 **변경하지 않는다**. 바꿔야 할 사유가 생기면 새 문서로 분리하고 이 문서는 원형 보존한다.

## 6. 변경 이력

- 2026-09-09 — 최초 작성(WO-S0d). 결과 칸 전부 공란, 실측 0회.
