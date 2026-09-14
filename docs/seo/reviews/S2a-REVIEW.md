# 독립 검토 — 답변형 블록 (WO-S2a-review)

검토자: Grok 4.6 · 날짜: 2026-09-09 · 작업트리 `tseng-law-sea-seo-20260909`  
대상: `src/data/international-guidance-answers.ts`, `src/components/InternationalGuidance.tsx` — **원본 수정하지 않음.** 본 파일만 신규 작성.  
방법: Read/Grep만. 셸·HTTP fetch·vitest·커밋 없음. 본문 대조 원본은 `src/data/international-guidance-content.ts`.

판정 규칙: 완료 기준 5항을 느슨하게 바꾸지 않는다. 근거는 파일:줄번호.

---

## 1. 24개 답변 자연스러움 + 해당 페이지 본문 사실 일치 — **FAIL**

커버리지: 4로케일 × 6키(`services`·`about`·`lawyers`·`pricing`·`contact`·`faq`) = 24. `home`·`privacy`·`disclaimer`·`columns`는 키 없음(의도와 일치).

자연스러움은 대체로 본문 레지스터와 맞다(vi `tư vấn`/`luật sư`, id `Tionghoa`/`advokat`, th `ท่าน`, fil `Tsino`/`abogado`). **FAIL 이유는 허위 법률 주장이 아니라, services 4건이 그 페이지 본문이 아닌 FAQ 문장을 옮겨 온 것**이다. WO-S2a와 answers 파일 머리말(7–8행)은 `guidanceContent[locale].pages[key]`의 사실만 요약하라고 못 박는다.

### 적발 — services 4건: “수리 여부” ≠ 해당 페이지의 “범위 확정”

| 답변 | 답변 문장(요약) | 그 페이지 본문 | 같은 로케일 FAQ(출처로 보임) |
|---|---|---|---|
| vi/services `answers.ts` 46 | “Có nhận một vụ việc hay không được quyết định sau khi luật sư xem xét” | **188**: “Phạm vi cụ thể của từng vụ việc được xác nhận riêng sau khi luật sư xem xét nội dung bạn gửi.” | **357**: “Việc có nhận một vụ việc cụ thể hay không được quyết định sau khi xem xét nội dung.” |
| id/services `answers.ts` 78 | “Diterima atau tidaknya suatu perkara diputuskan setelah advokat meninjau…” (+ 이어서 범위 확정) | **659**: “Lingkup setiap perkara dipastikan tersendiri setelah advokat meninjau isi pesan Anda.” (수리 여부 문장 없음) | **828**: “Diterima atau tidaknya suatu perkara diputuskan setelah isinya ditinjau.” |
| th/services `answers.ts` 110 | “ส่วนการจะรับเรื่องใดเรื่องหนึ่งหรือไม่ พิจารณาหลังจากทนายความตรวจสอบ…” | **1130**: “ส่วนขอบเขตของแต่ละเรื่องจะได้รับการยืนยันเป็นการเฉพาะ หลังจากทนายความตรวจสอบเนื้อหาที่ท่านส่งมาแล้ว” | **1299**: “ส่วนการจะรับเรื่องใดเรื่องหนึ่งหรือไม่ จะพิจารณาหลังตรวจสอบเนื้อหาแล้ว” |
| fil/services `answers.ts` 142 | “Napagpapasyahan ang pagtanggap sa isang usapin matapos suriin ng abogado…” | **1601**: “Hiwalay na kinukumpirma ang saklaw ng bawat usapin matapos suriin ng abogado ang ipinadala mo.” | **1770**: “Ang pagtanggap sa isang tiyak na usapin ay napagpapasyahan pagkatapos suriin ang nilalaman nito.” |

id/services만 본문 659의 범위 확정을 뒤에 붙였고, 앞 절반은 여전히 FAQ 828이다. 수리 여부와 업무 범위 확정은 같은 문장이 아니다. `/vi/services`를 인용하는 엔진이 FAQ 문장을 services 직접답으로 가져가게 된다.

- **수정안 (vi/services 46행을 본문 188에 맞춤):**  
  `Phạm vi cụ thể của từng vụ việc được xác nhận riêng sau khi luật sư xem xét nội dung bạn gửi.`  
  수리 여부 문장은 `/vi/faq` 답변에만 둘 것. id/th/fil도 각각 659·1130·1601 동사(lingkup / ขอบเขต / saklaw)로 교체.

### 적발 — vi/services 그룹명 축약 (불일치, 허위는 아님)

`answers.ts` 46: “tranh chấp dân sự, hôn nhân gia đình và thừa kế”  
본문 제목 **150**: “Tranh chấp dân sự **và yêu cầu bồi thường**”; **158**: “Hôn nhân**,** gia đình và thừa kế”.  
id 78·th 110·fil 142는 배상/상속까지 본문 제목과 맞춘다. vi만 민사 배상과 쉼표를 빠뜨림.

- **수정안:** `tranh chấp dân sự và yêu cầu bồi thường, hôn nhân, gia đình và thừa kế`

### 권고 — lawyers 4언어 문장이 웨이 변호사 바로 뒤에 붙어 영어 상담으로 오독될 여지

본문 vi **239**: Wei Tseng 교환 언어는 중·일·한(영어 없음). 사무실 4언어는 **245**.  
vi/lawyers 56·fil/lawyers 152는 고객(한·일) 문장 다음에 바로 “상담은 영·중·일·한”이라, 인용 블록만 보면 Wei Tseng이 영어 상담을 하는 것처럼 이어 읽힌다. id 88·th 120은 “lingkup kantor secara keseluruhan” / “ของสำนักงาน”로 사무실 범위임을 명시해 본문 716·1187과 맞다.

- **수정안 (vi):** 상담 문장 앞에 본문 245를 축약해 넣기 — `Đây là phạm vi của cả văn phòng, không phải năng lực của một luật sư.` fil도 1658행(“Saklaw ito ng buong tanggapan”)을 한 절 넣을 것.

### 24건 대조 (불일치만 줄번호, 나머지는 본문과 부분집합으로 일치)

| # | 키 | 자연 | 사실 | 비고 |
|---|---|---|---|---|
| 1 | vi/services | 거의 | **불일치** | 위 적발. “nhóm việc”→본문은 “nhóm công việc”(139) |
| 2 | vi/about | 자연 | 일치 | 2016·NTU(205), 카오슝/타이중/핑둥(206), 2020 회계(207). 타이중 한·일(206)과 결과 비보장(221)은 생략 |
| 3 | vi/lawyers | 자연 | 일치(오독 위험) | 해외 접수·자동배정 없음(232), 2024 합류·한일 고객(237–238), 사무실 4언어(245) |
| 4 | vi/pricing | 자연 | 일치 | 표 없음(264), 범위 선확정(269–270), 개시 전 수수료(276), 법원·공공 납부(291). 유료 상담(283)은 생략 — id/th/fil pricing는 포함 |
| 5 | vi/contact | 자연 | 일치 | 요약 항목(325), 초기에 신분·증거 전부 불필요(326≈FAQ 362), 회신 시간 비약정(332). 예약 미확정·통역 부재(332)는 생략 |
| 6 | vi/faq | 자연 | 일치 | 일반정보(344), 6그룹·준비·비용·요청 의미(353–382) |
| 7 | id/services | 자연 | **불일치** | 6그룹은 613–651과 일치. 수리 문장만 FAQ 이식 |
| 8 | id/about | 자연 | 일치 | 2016·NTU(676), 3지점(677), 2020 회계(678), 타이중 한·일(677/684), 결과 비약속(692) |
| 9 | id/lawyers | 자연 | 일치 | 703–716을 거의 축자 요약. 사무실 범위 명시 |
| 10 | id/pricing | 자연 | 일치 | 표 없음(733), 범위→금액(746), 유료 상담 가능(754), 법원·정부 수수료(762) |
| 11 | id/contact | 자연 | 일치 | 796, 797, 803(회신·예약 둘 다) |
| 12 | id/faq | 자연 | 일치 | 815, 851–853 |
| 13 | th/services | 자연 | **불일치** | 6그룹은 1086–1123과 일치. รับเรื่อง 문장만 FAQ 이식 |
| 14 | th/about | 자연 | 일치 | 1147–1149, 타이중 한·일(1148/1155) |
| 15 | th/lawyers | 자연 | 일치 | 1174, 1179–1180, 1187(สำนักงาน) |
| 16 | th/pricing | 자연 | 일치 | 1204, 1218, 1225, 1233 |
| 17 | th/contact | 자연 | 일치 | 1267, 1268, 1274 |
| 18 | th/faq | 자연 | 일치 | 1286, 1324 |
| 19 | fil/services | 자연 | **불일치** | 6그룹은 1557–1594·FAQ 1770과 일치. pagtanggap만 FAQ 이식 |
| 20 | fil/about | 자연 | 일치 | 1618–1620, 타이중 한·일(1619/1626) |
| 21 | fil/lawyers | 자연 | 일치(오독 위험) | 1645, 1650–1651, 1658. 사무실 범위 절 없음 |
| 22 | fil/pricing | 자연 | 일치 | 1675, 1689, 1696, 1704 |
| 23 | fil/contact | 자연 | 일치 | 1738, 1739, 1745 |
| 24 | fil/faq | 자연 | 일치 | 1757, 1795 |

숫자 2016·2020·2024·6그룹·4언어·3지점은 모두 해당 페이지에 이미 있다. 출처 없는 신규 통계 없음. 새 법률 주장 없음.

로케일 간 about 밀도 차이(vi는 타이중 한·일·결과 비보장 없음, id만 결과 비보장)는 거짓이 아니라 요약 두께 차이. 항목 FAIL로 쌓지 않는다. 맞추려면 vi/about에 본문 206·221을 한 문장 보강.

40–80단어 / 태국 120–400자 창은 테스트 미실행. 손으로 vi/services ≈78어, vi/about ≈66어, vi/contact ≈72어. 나머지는 **미검증**.

---

## 2. 언어 계약 위반 0 — **PASS**

대상 파일 본문(주석 제외)에 안내 언어명·통역 제안이 없다.

- `Vietnamese` / `Indonesian` / `Thai` / `Filipino` / `Tagalog` / `tiếng Việt` / `bahasa Indonesia` / `ภาษาไทย`: answers 본문에 0건. 주석 12–15행만 계약 설명.
- 상담 언어는 각 안내 언어로 네 개만: vi `tiếng Anh/Trung/Nhật/Hàn`, id `Inggris/Tionghoa/Jepang/Korea`, th `ภาษาอังกฤษ/จีน/ญี่ปุ่น/เกาหลี`, fil `Ingles/Tsino/Hapon/Koreano`. WO-S2a “각 언어로 English/Chinese/Japanese/Korean 의미”와 본문 311·782·1253·1724와 같음.
- `tư vấn` / `konsultasi` / `ปรึกษา` / `konsultasyon`은 네 상담 언어와만 결합. 안내 언어 + 상담/통역 “가능” 결합 0.
- `InternationalGuidance.tsx`에 JSON-LD·`availableLanguage` 없음. 메타는 `page.tsx`가 content의 title/description만 씀(67–71행). 답변 블록이 스키마를 넓히지 않음.

---

## 3. 광고 규정 위반 0 — **PASS**

answers 본문에서 승소율·성공 보장·최고/유일 표현 0 (`terbaik` / `duy nhất` / `ที่สุด` / `pinakamahusay` / win rate 등 무).

반대 방향 문장만 있음: id/about 83 “kami tidak menjanjikan hasil”(본문 692); 회신·예약 비약속(vi 66, id 98, th 130, fil 162). 유료 상담 가능(id/th/fil pricing)은 본문 754·1225·1696의 “무료 초회” 부정과 같고, 성공 보장이 아니다.

---

## 4. sources 링크 실존 — **PASS**

24개 모두 `sources` 길이 2, `/`로 시작, 같은 로케일 안내 경로. 자가 인용 없음.

공통 맵:

| 페이지 | sources |
|---|---|
| services | `/{loc}/faq`, `/{loc}/contact` |
| about | `/{loc}/lawyers`, `/{loc}/services` |
| lawyers | `/{loc}/about`, `/{loc}/contact` |
| pricing | `/{loc}/contact`, `/{loc}/faq` |
| contact | `/{loc}/faq`, `/{loc}/pricing` |
| faq | `/{loc}/contact`, `/{loc}/services` |

실존 근거(HTTP 미실행):

- `guidancePublicPath(locale, key)` → `/{locale}/{key}` (`public-guidance.ts` 156–157).
- 슬러그 `faq|contact|lawyers|services|about|pricing`는 `GUIDANCE_CORE_ROUTE_KEYS`(40–51) → `classifyGuidanceSlug`가 `kind: 'page'` → `[[...slug]]/page.tsx` 123–128이 `InternationalGuidance` 렌더.
- `sitemap.ts` 81–90: `GUIDANCE_LOCALES_4` × `GUIDANCE_PAGE_KEYS`에 `guidanceCanonicalUrl` 항목 추가. 위 6키는 그 집합의 부분집합.
- 렌더 시 `GUIDANCE_PAGE_KEYS.find` + `guidancePublicPath`로 nav 라벨을 붙임(`InternationalGuidance.tsx` 104–110). 위 href는 모두 히트. 폴백 raw href는 현재 데이터에서 안 탐.

`/en/` 랜딩은 안 썼고, WO가 허용한 “같은 로케일 안내 페이지”만 사용.

---

## 5. 답변 없을 때 렌더 영향 0 — **PASS** (코드 리딩)

`InternationalGuidance.tsx` 37–39:

```ts
const answer = pageKey && !isNotFound ? guidanceAnswers[locale][pageKey] : undefined;
```

98–118: `{answer ? ( <section className={styles.answerBlock} …> … </section> ) : null}`  
본문 `<article>`(120+)·notice·CTA·폼은 `answer`와 무관하게 기존과 같이 렌더.

| 경우 | 동작 |
|---|---|
| `home`·`privacy`·`disclaimer`·`columns` | Partial 맵에 키 없음 → `undefined` → 섹션 0. 주석 37–38과 동일 |
| `unavailable` / `!pageKey` (not-found) | `isNotFound`라 `answer` 계산 안 함. 답변 섹션은 else 가지(96+)에만 있음. not-found UI(81–95)에 블록 없음. `not-found.tsx` 42는 `unavailable`만 전달 |
| `page` 없음 | `isNotFound \|\| !page` 참 → not-found 가지, 답변 섹션 미마운트 |
| `sources.length === 0` | 단락은 렌더, 리스트만 생략(101–116). 현재 24건은 길이 2 |

CSS `.answerBlock .paragraph` / `.sourceList`는 `.answerBlock` 자식에만 적용(`InternationalGuidance.module.css` 315–332). 블록이 없으면 기사 쪽 `.paragraph`·`.sourceList`(columns)에 영향 없음.

---

## 수정 우선순위

1. **치명 아님 / 항목1 FAIL 원인:** services 4건의 수리-여부 문장을 그 페이지 범위-확정 문장으로 교체.
2. **중간:** vi/services 그룹명 본문 150·158에 맞추기; vi·fil lawyers에 사무실 범위 한 절.
3. **낮음:** vi/about·vi/pricing·vi/contact를 id/th/fil 두께에 맞출지(사실 오류 아님).

---

## 보고

### (1) 변경 파일 목록

- `docs/seo/reviews/S2a-REVIEW.md` (신규, 본 검토)
- 대상 원본 `international-guidance-answers.ts` / `InternationalGuidance.tsx` / content·intent·columns **미수정**

### (2) 실행한 명령과 마지막 출력 3줄

WO-S2a-review: **Bash 금지.** 명령을 실행하지 않았다.  
`npx vitest run src/lib/__tests__/international-guidance-answers.test.ts` **미실행** — 통과 여부를 이 검토에서 주장하지 않는다.

### (3) 완료 기준 항목별 PASS/FAIL

1. 24개 답변 자연 + 해당 페이지 본문 사실 일치 — **FAIL** (services 4건 FAQ 이식; vi/services 그룹명 축약)
2. 언어 계약 위반 0 — **PASS**
3. 광고 규정 위반 0 — **PASS**
4. sources 링크 실존 — **PASS** (라우트·sitemap 코드 대조; HTTP 미확인)
5. 답변 없을 때 렌더 영향 0 — **PASS** (코드 리딩)

### (4) 미해결·못 한 것

- vitest 길이·금지패턴 스위트를 돌리지 못했다(Bash 금지). 40–80어/태국 문자수 창은 샘플 3건만 수동 합산.
- sources URL에 HTTP GET을 하지 못했다. 라우팅·sitemap으로만 실존을 봤다.
- 브라우저에서 home/columns vs services 렌더 차이를 보지 못했다.
- 원본 4파일은 WO가 고쳐 금해 수정안만 적었다.

총평 FAIL (FAIL 1건 / 항목 5)
