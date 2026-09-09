# 독립 검토 — `docs/seo/sea-intent-map-2026-09.md` (WO-S1-review)

검토자: Grok 4.6 · 날짜: 2026-09-09 · 작업트리 `tseng-law-sea-seo-20260909`  
원본: `docs/seo/sea-intent-map-2026-09.md` — **수정하지 않음.** 본 파일만 신규 작성.  
방법: Read/Grep만. 셸·HTTP fetch·테스트·커밋 없음. 원 ODS(S1/S2/S3)는 이 레포에 없어 **원표 칸값은 미검증**.

판정 규칙: 완료 기준 6항을 느슨하게 바꾸지 않는다. 근거는 원본 줄번호 + 코드 경로.

---

## 1. 출처 표 URL·등급 vs 본문 주장 — **FAIL**

### 맞는 것

- S1·S3을 이민서 공식통계 **A**, S2를 노동부 개방자료 **A**로 둔 등급 자체는 WO 척도(A 공식통계)와 맞다. URL 도메인(`immigration.gov.tw`, `data.gov.tw`, `apiservice.mol.gov.tw`)도 그 등급과 모순되지 않는다.
- S4를 **A\***로 분리하고 “S4 단독으로 H를 준 셀은 없다”(원본 181)고 적은 것은 과대 표기를 피하려는 조치다. SG ①의 클릭 1·노출 16, 쿼리 `台湾公司设立`(0/8)·`台湾注册公司`(0/7)는 `docs/seo/EN-SEA-BASELINE-2026-09-01.md` 43·48행과 일치한다.
- §2.1 합계 검산(문서가 준 남녀 합·직업 합만): VN 商務+工程 514+1,518=2,032, ID 509+1,582=2,091, PH 217+2,254=2,471, TH 232+189=421, MY 1,348+2,384=3,732 — 표와 맞음. VN 배우자/TH 배우자 30,007/9,231≈3.25배(원본 42의 3.2배)도 맞음.

### 적발

**(a) 본문 비율이 같은 문서의 표와 불일치 — 과대 축소**

원본 8: “VN·ID·TH·PH 체류자의 **70~82%**가 이주노동자다(S1 직업별).”  
§2.1 S1 移工/체류:

| 국 | 移工 / 체류 | 비율 |
|---|---|---|
| VN | 250,882 / 355,203 | 70.6% |
| ID | 315,394 / 383,535 | 82.2% |
| TH | 74,628 / 92,666 | 80.5% |
| PH | 190,032 / 221,082 | **86.0%** |

PH가 70~82 구간 밖이다. 범위를 70~82로 쓰면 PH를 잘라 낸 과소 표기다.

- **수정안:** “VN·ID·TH·PH 체류자 중 移工 소계 비율은 70.6%~86.0%(S1).” 또는 PH를 빼지 말고 네 값을 각각 적을 것.

**(b) 출처 표 “이 문서에서 쓴 값”이 본문 숫자를 커버하지 않음**

S1 쓴 값(원본 173)은 체류 계·移工 계·學生·商務人員·工程師뿐인데, 매트릭스 이유 열은 같은 S1 A로 다음을 쓴다.

- 40: 製造業技工 206,007
- 48: 監護工 192,962
- 54: 製造業技工 57,028 · 營建業技工 14,866
- 62: 製造業技工 163,764 · 監護工 21,213
- 68: 기타 유업자 11,147

이 칸값의 원표 대조는 본 검토에서 **못 했다**(ODS 없음·fetch 금지). 출처 표가 본문 주장을  backing하지 못하면 독자는 전부 A로 읽게 된다.

- **수정안:** S1 “쓴 값”에 직업 세목(技工·監護工·기타 유업자)을 명시하거나, 세목을 이유 열에서 빼거나 `[원표 세목 · 레포 미수록]`로 강등.

**(c) A급 규모를 산재 위험 주장으로 연장 — 등급 과대**

원본 54: “製造業技工 57,028·營建業技工 14,866로 **산재 노출 업종 집중**.”  
원본 186: 국적별 직업재해 건수는 **미확인**이라 ③의 산재 우선순위를 규모 이상으로 올리지 않았다고 했다.  
직업 구성(A) → “산재 노출 집중”(E/미확인)은 같은 셀의 H 이유에 섞이면 과대다. H 자체는 移工 74,628만으로도 규칙(원본 26)을 만족할 수 있다.

- **수정안:** “산재 노출 업종 집중” 삭제. “제조·건설 技工이 移工의 대부분(S1 직업 세목). 국적별 산재 건수는 미확인.”

**(d) S4 조회일**

원본 176: 조회일 2026-09-09. 인용 파일의 GSC 실측일은 **2026-09-02**(기간 2026-08-03~08-30). A\* 남용으로 H를 준 것은 아니나, 조회일을 원 실측일과 구분하지 않으면 A급 1차 관측처럼 읽힌다.

- **수정안:** “조회일 2026-09-09(레포 파일 재확인) / 원 실측 2026-09-02.”

S4의 `A*`는 WO A~E 밖이다. 문서가 스스로 그 점을 적었으므로 **별도 FAIL 항으로 쌓지 않는다.** 다만 표의 등급칸에 A를 남기지 말고 `1차(자사 GSC, 척도 외)`로 쓰는 편이 안전하다.

---

## 2. 현지어 질문 자연스러움 — **FAIL**

vi/id/th/fil 각 3개 이상. 검색창 문장 기준으로 본다. 대부분 자연스러우나 **TH ④가 영어 열과 다른 법률 개념**이라 항목 FAIL.

### vi (3+)

| 줄 | 원문 | 판정 | 교정 |
|---|---|---|---|
| 38 | Người Việt Nam muốn thành lập công ty tại Đài Loan thì cần thủ tục và giấy tờ gì? | 자연 | — |
| 39 | Giấy phép lao động sắp hết hạn thì gia hạn thẻ cư trú (ARC) ở Đài Loan thế nào? | 거의 자연. 노동허가 만료와 ARC 연장을 `thì`로 한 질문에 묶음 | Giấy phép lao động và thẻ cư trú (ARC) sắp hết hạn thì gia hạn thế nào ở Đài Loan? |
| 40 | … thì **lao động Việt** khiếu nại ở đâu? | 헤드라인체. 검색어로는 쓰이지만 문장으로는 어색 | … thì người lao động Việt Nam khiếu nại ở đâu? |
| 41 | Ly hôn với **chồng** người Đài Loan… | 자연이나 성별 고정(대만 남편). S3 외국인 배우자 구성과 맞을 수는 있음 | Ly hôn với vợ/chồng người Đài Loan thì quyền nuôi con và tư cách cư trú của tôi ra sao? |

### id (3+)

| 줄 | 원문 | 판정 | 교정 |
|---|---|---|---|
| 46 | Orang Indonesia mendirikan perusahaan di Taiwan, apa saja syarat dan tahapannya? | 자연(검색체) | (선택) Orang Indonesia yang ingin mendirikan… |
| 48 | Gaji tidak dibayar penuh dan paspor ditahan majikan, ke mana saya melapor di Taiwan? | 자연. 여권 압수는 인도네시아 이주노동 맥락에 맞음 | — |
| 49 | Menikah dengan warga Taiwan lalu bercerai, bagaimana hak asuh anak dan izin tinggal saya? | 자연 | — |
| 50 | …tidak membayar **invoice** kami… | 비즈니스 인도네시아에서 통함 | (선택) faktur / tagihan |

### th (3+) — 여기가 FAIL 원인

| 줄 | 원문 | 판정 | 교정 |
|---|---|---|---|
| 52 | คนไทยจะจดทะเบียนบริษัทที่ไต้หวัน ต้องใช้เอกสารอะไรและมีขั้นตอนอย่างไร | 검색 질의로 자연. 물음표 없음은 허용 | (선택) …ต้องใช้เอกสารอะไรบ้าง และมีขั้นตอนอย่างไร |
| 54 | นายจ้างที่ไต้หวันค้างค่าจ้างและค่าล่วงเวลา แรงงานไทยร้องเรียนที่ไหน | 자연 | — |
| 55 | แต่งงานกับคนไต้หวันแล้วหย่า **สิทธิเลี้ยงดูบุตร**และสิทธิพำนักของฉันเป็นอย่างไร | **비자연+의미 오류.** `สิทธิเลี้ยงดูบุตร` = 양육비(child support). 영어 열(55)은 custody | แต่งงานกับคนไต้หวันแล้วหย่า สิทธิปกครองบุตรและสิทธิพำนักของฉันเป็นอย่างไร |
| 57 | ขับรถจักรยานยนต์ชนที่ไต้หวัน… | 거의 자연 | ขับรถจักรยานยนต์ชนกันที่ไต้หวัน และได้รับหมายเรียกจากตำรวจ ต้องทำอย่างไร |

### fil (3+)

| 줄 | 원문 | 판정 | 교정 |
|---|---|---|---|
| 59 | Paano magparehistro ng kumpanya sa Taiwan bilang Pilipino, at anong mga dokumento ang kailangan? | 자연 | — |
| 61 | Kinakaltasan ang sahod ko at hindi binabayaran ang overtime sa Taiwan — saan ako pwedeng magreklamo? | 자연(Taglish 허용) | — |
| 62 | …paano ang **kustodiya** ng anak at ang residence status ko? | 이해 가능하나 법률 스페인어투. 구어는 custody / pangangalaga | …paano ang custody ng anak at ang residence status ko? |
| 64 | Nadisgrasya ako sa motor… ano ang susunod? | 거의 자연. `susunod`가 빈약 | …ano ang susunod na hakbang? |

**수정안(필수):** TH ④ `สิทธิเลี้ยงดูบุตร` → `สิทธิปกครองบุตร`(또는 `สิทธิในการดูแลบุตร`). 나머지 교정은 권고.

---

## 3. 대응 URL 실존 (public-guidance / sitemap / intent-pages) — **FAIL**

규칙상 **적어 넣은 URL은 실존**한다. FAIL 이유는 (1) `없음`이 거짓인 셀, (2) “비자·거류 페이지 0” 과대, (3) §4.4 편수 불일치.

### 적어 넣은 URL — 규칙상 존재 (PASS 부분)

| 원본이 든 URL | 규칙 |
|---|---|
| `/{vi,id,th,fil}/services` | `GUIDANCE_LOCALES_4` × `GUIDANCE_PAGE_KEYS`에 `services` 포함. `guidancePublicPath` = `/{locale}/services`. `appendGuidanceLocaleSitemapEntries()`가 전조합 발행. `resolveGuidanceMiddlewareRewrite`에서 `services` ∈ `GUIDANCE_CORE_ROUTE_KEYS` → allowed. 본문: `guidanceContent.{vi,id,th,fil}.pages.services` 존재(vi title 원본 135 인용과 `international-guidance-content.ts` 137행 일치). |
| `/en/taiwan-company-setup-lawyer`, `/en/taiwan-litigation-lawyer` | `sitemap.ts` `STATIC_PATHS` 35–36행. `locales` = ko·zh-hant·en (`src/lib/locales.ts` 2행) 루프 + ja는 339–348행 별도 push. 라우트 `src/app/[locale]/taiwan-company-setup-lawyer/page.tsx`, `taiwan-litigation-lawyer/page.tsx`. `intentPageSlugs`에 두 슬러그 존재. `getLocalizedPath('en', …)` → `/en/…`. `DEFAULT_SITE_URL` `https://tseng-law.com` (`seo.ts` 90, `public-guidance.ts` 82). `isEnglishNoindexPath` 대상 아님. |
| `/en/services/labor` | `service-details.ts` slug `labor`. sitemap `serviceAreaRecords` 루프 + ja 399행. 라우트 `src/app/[locale]/services/[slug]/page.tsx`. |
| EN 칼럼 7편 | `slugFromFilename`이 `^\d{3}-` 제거 → `taiwan-labor-severance-law` 등. ko·en 파일 쌍 존재. 008 EN title “Is Severance Pay Hard to Get in Taiwan??”는 `columns-en/008-…md` 2행과 일치. 파일백킹 칼럼은 `isEnglishNoindexPath`에서 제외. |
| `/en/faq`를 안 씀 | `isEnglishNoindexPath`: `path === '/faq'` → EN 행 삭제. 원본 163 판단 맞음. |
| `/{locale}/services/<영역>`, `/{locale}/columns/<slug>` 안 씀 | 코어 키에 없음 → unavailable. 원본 164–165 맞음. |
| C2–C5 `/vi/work-permit` 등 | **현재는 없음.** `isGuidanceCoreSlugPath('work-permit')` false. §3.1이 이 제약을 맞게 적음. 후보이지 현재 대응 URL이 아님. |

### 거짓 `없음` / 과대 공백

**(a) MY ② 68행, SG ② 74행 — `현재 대응 URL = 없음`이 문서 자신의 규칙(21행)과 모순**

두 셀의 질문은 “회사 설립 후 노동허가·ARC가 자동인가”.  
`intentPages.en['taiwan-company-setup-lawyer']`가 그 질문을 이미 다룬다.

- keywords: `Taiwan residence permit assistance` (`intent-pages.ts` 520)
- hero: “After registration, the firm can assist with residence-permit procedures…” (526)
- FAQ: “Do you assist with residence permits after company setup?” (591–593)
- FAQ: “Is company registration alone enough?” → banking, residence-permit assistance… (581–583)

MY는 ms 로케일이 없어 EN 표면이 이 열에 들어간다는 규칙(24행)대로면 대응 URL은  
`https://tseng-law.com/en/taiwan-company-setup-lawyer` 이어야 한다. SG ②도 같다.

- **수정안:** MY ②·SG ② `현재 대응 URL`을 위 URL로 바꾸고 우선순위 이유에서 “페이지 없음”을 삭제. (전용 비자 페이지가 없다는 말은 이유 열에 “전용 페이지 없음, 설립 랜딩 FAQ로만 부분 대응”으로.)

**(b) 원본 9·46 등 “어느 언어에도 비자·거류 페이지 없음”**

안내 4언어 `/services` 투자 절이 이미 설립≠거류·취업허가라고 적는다.

- vi `international-guidance-content.ts` 147
- id 618
- th 1089
- fil 1560

“전용 페이지 0”은 참, “다루는 페이지 0”은 거짓. ② H셀(노동허가·ARC **갱신**)의 공백은 여전히 참이다.

- **수정안:** “이주노동자 ARC·노동허가 갱신을 주제로 하는 전용 페이지는 0. 설립≠거류 한 문장은 `/services` 투자 절과 EN 설립 랜딩에 있다.”

**(c) 원본 149 “인용한 5편” vs 실제 7편 나열(153–159)**

존재 여부와 별개인 문서 오류.

- **수정안:** “§2에서 인용한 7편” 또는 이유 열 전용 2편(012, 015)을 각주로 분리.

라이브 HTTP 200은 **확인하지 않았다**(fetch 금지). 위는 코드 규칙상 실존이다.

---

## 4. 언어 계약 (vi/id/th/fil 상담·통역 암시) — **PASS**

원본에서 안내 4언어로 **상담·통역이 가능하다**고 한 문장은 0이다.

- 28–30, 192–194: 안내 언어 vs 상담 언어(English / Chinese / Japanese / Korean)를 분리.
- `availableLanguage` 확대 제안 없음(195).
- C2–C5 초안은 “묻기 전에 준비할 것”이지 해당 언어 상담 제공이 아님.
- 대표 질문 열은 사용자 입력 문장으로 명시(30).

잔여 리스크(S3 본문 단계, 이번 문서 FAIL 아님): C2 `hỏi luật sư`, C4 `ปรึกษาทนายความ`를 해당 언어 페이지에 그대로 올리면 상담 언어로 오인될 수 있다. 기존 vi FAQ는 오히려 “Tôi có thể được tư vấn bằng tiếng Việt không? → Không”(guidance 365–368)이다. S3 초안은 그 거절 문장을 유지해야 한다.

JSON-LD는 이 WO가 건드리지 않았다고 했고, 본 검토도 사이트 JSON-LD를 열지 않았다.

---

## 5. 광고 규정 — **FAIL**

승소율·성공 보장·유일·사무소 최고 주장은 없다. C1–C5도 결과 보장이 없다. “6국 1위/2위/최다/최소”는 출처 통계의 국가 순위다.

그러나 WO 공통 규칙은 **「최고/유일 표현 금지」**이고, 원본 18·196은 `"최고"·"유일" 표현 0건`이라고 자기점검했다.

- **원본 69:** “체류 총계 대비 비중은 **6국 최고**.”

토큰 `최고`가 1건 있다. 지시 대상은 사무소가 아니어도, 금지 표현 0건 기준과 자기점검이 깨진다.

- **수정안:** “馬來西亞 외국인 배우자 6,463(S3)은 6국 3위. 체류 계 대비 비율 6,463/27,448(S1·S3).” (`최고` 삭제)

`1위`(46–48)는 WO 문구 목록에 없고, 통계 순위라 이 항목의 추가 FAIL로 쌓지 않는다. 다만 196의 “1위 표현 0건”은 사실 오서술이므로 함께 고칠 것.

---

## 6. 신규 페이지 후보 vs 기존 페이지 중복 — **FAIL**

후보 5개 슬러그는 지금 `intentPageSlugs`·`GUIDANCE_PAGE_KEYS`에 없다. **URL 키 충돌은 0.** FAIL은 내용·질문이 기존 페이지와 겹치고, H셀 공백을 안 덮기 때문이다.

### C1 `/taiwan-work-permit-residence-lawyer`

1줄 초안(108): 설립·합류가 거류·노동허가를 자동으로 주지 않는다.  
기존 EN 설립 랜딩 FAQ·hero가 같은 명제다(§3에서 인용한 `intent-pages.ts` 526, 581–593).  
`/en/guides/taiwan-company-setup`도 STATIC_PATHS에 있다(sitemap 37).

MY ②·SG ②(M)를 C1이 커버한다고 한 것(108)은 기존 페이지 복제다.

### C2–C5 `/{vi,id,th,fil}/work-permit`

1줄 초안(109–112)은 `/services` 투자 절과 거의 같다.

| 후보 | 기존 문장 |
|---|---|
| C2 | vi 147: “Việc thành lập công ty không tự động đem lại quyền cư trú hay giấy phép lao động…” |
| C3 | id 618: “Pendirian perusahaan tidak dengan sendirinya menghasilkan izin tinggal atau izin kerja…” |
| C4 | th 1089: “การจัดตั้งบริษัทไม่ได้ทำให้ได้สิทธิพำนักหรือใบอนุญาตทำงานโดยอัตโนมัติ…” |
| C5 | fil 1560: “Hindi awtomatikong nagbibigay ng karapatang manirahan o permiso sa trabaho ang pagtatatag ng kompanya…” |

원본 193도 초안이 기존 두 문장 범위 안이라고 인정한다. 그러면 **신규 페이지가 아니라 `/services` 문장 복제**다.

### H셀 질문과 후보 불일치 (중복과 별개의 공백)

② H 4셀(39, 47, 53, 60)의 대표 질문은 **만료 임박 노동허가·ARC 갱신**이다.  
C1–C5 초안은 **설립 ≠ 자동 거류**이다. 후자는 ①·MY/SG ②이지 H 공백이 아니다.

원본 124가 인정한 ③ 임금체불·산재 문서 공백은 “없음+H” 규칙상 후보가 아닌 것은 맞다. 그 규칙을 느슨하게 바꾸라고 하지 않는다. 문제는 **규칙으로 고른 4셀을 다른 질문의 초안으로 채운 것**이다.

- **수정안:**
  1. C1를 설립 랜딩 확장(기존 FAQ 강화)으로 내리거나, 슬러그를 쓰려면 **ARC·노동허가 갱신**(이직, 고용주 변경, 만료)만 다루고 설립≠거류 문장은 `/taiwan-company-setup-lawyer`로 링크만.
  2. C2–C5를 쓰려면 같은 갱신 질문에 답하는 안내 본문. 설립 문장 복제 금지. `GUIDANCE_CORE_ROUTE_KEYS` 확장 + 번역 레인 제약은 §3.1 그대로.
  3. MY ②·SG ②는 후보에서 빼고 기존 EN 설립 랜딩을 대응 URL로 고정.

---

## 총평

**FAIL · FAIL 건수 5** (항목 1·2·3·5·6 FAIL, 4 PASS).

H 9셀 배정 논리(체류자 주체 + S1/S2 직접 모수 + 현지어 공백), ⑦ 부동산 제외, E로 H를 준 셀 0, 검색량 미기재는 유지할 만하다. 반려 이유는 출처 표·본문 불일치, TH ④ 의미 오류, `없음`/비자페이지 과대, `최고` 토큰, 후보가 기존 `/services`·설립 랜딩을 복제하고 H 갱신 질문을 안 덮는 점이다.

---

## 보고 (WO 형식)

### (1) 변경 파일 목록

- `docs/seo/sea-intent-map-2026-09.REVIEW.md` (신규)
- 원본 `docs/seo/sea-intent-map-2026-09.md` 및 금지 파일: 변경 없음

### (2) 실행한 명령과 마지막 출력 3줄

WO: Bash 실행 없이 파일 읽기·grep만. 셸 명령 **0건**. 테스트·build·playwright **0건**.

사용한 것: Cursor Read / Grep / Glob. 대상은 원본, `src/lib/public-guidance.ts`, `src/app/sitemap.ts`, `src/data/intent-pages.ts`, `src/lib/locales.ts`, `src/lib/seo-visibility.ts`, `src/lib/seo.ts`, `src/lib/columns.ts`, `src/data/service-details.ts`, `src/data/international-guidance-content.ts`(읽기만), `src/content/columns-en/008-taiwan-labor-severance-law.md`, `docs/seo/EN-SEA-BASELINE-2026-09-01.md`.

마지막 출력에 해당하는 확인(grep `fil` services 블록):

```
src/data/international-guidance-content.ts
  1548:      services: {
```

(제목 1550: `Mga usaping hinahawakan ng tanggapan` — 원본 135는 fil 제목을 인용하지 않음.)

### (3) 완료 기준 항목별 PASS/FAIL

| # | 항목 | 결과 |
|---|---|---|
| 1 | 출처 표 URL·등급이 본문 주장과 맞는가 | **FAIL** |
| 2 | 현지어 질문 자연스러움 (vi/id/th/fil 각 3+) | **FAIL** |
| 3 | 대응 URL이 세 파일 규칙상 실존하는가 | **FAIL** |
| 4 | 언어 계약 위반 0 | **PASS** |
| 5 | 광고 규정 위반 0 | **FAIL** |
| 6 | 신규 후보가 기존 페이지와 중복되지 않는가 | **FAIL** |

### (4) 미해결·못 한 것

- S1/S3 ODS·S2 CSV를 열지 못해 직업 세목(技工·監護工 등)과 S2 766,212 등 **원표 칸값을 확인하지 못했다.** 이민서 URL이 2026-09-09에도 살아 있는지도 확인하지 못했다.
- `https://tseng-law.com/...` 라이브 HTTP 상태코드를 치지 않았다. 실존은 코드 규칙만.
- 사이트 JSON-LD `availableLanguage` 실값을 이 검토에서 파싱하지 않았다(원본이 이 WO에서 안 건드렸다고 한 범위).
- 원어민 검수자(vi/id/th/fil)에게 질문을 돌리지 않았다. 2항은 검토자 판단이다.
- 원본을 고치지 않았다. FAIL 수정은 WO-S1-R1 범위다.

총평 FAIL · FAIL 건수 5
