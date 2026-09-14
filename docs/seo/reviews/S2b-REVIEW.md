# 독립 검토 — GEO 구조 (WO-S2b-review)

검토자: Grok 4.6 · 날짜: 2026-09-09 · 작업트리 `tseng-law-sea-seo-20260909`  
대상: `src/lib/llms-txt.ts`, `src/lib/seo.ts`, `src/components/InternationalGuidance.tsx` — **원본 수정하지 않음.** 본 파일만 신규 작성.  
방법: Read/Grep만. 셸·HTTP fetch·vitest·커밋 없음. FAQ 대조 원본은 `src/data/international-guidance-content.ts`.

판정 규칙: 완료 기준 5항을 느슨하게 바꾸지 않는다. 근거는 파일:줄번호.

---

## 1. availableLanguage 에 vi/id/th/fil 또는 언어명 없음 (llms.txt 주의문 포함) — **PASS**

JSON-LD `availableLanguage`는 고정 4개 BCP-47만 쓴다. 안내 로케일 코드·언어명은 이 배열에 없다.

- `src/lib/seo.ts` **719**: `GUIDANCE_CONSULTATION_LANGUAGES = ['en', 'zh-Hant', 'ja', 'ko']`
- 같은 파일 **780**: `availableLanguage: [...GUIDANCE_CONSULTATION_LANGUAGES]`
- `InternationalGuidance.tsx` **52–58**: LegalService만 이 빌더를 호출. FAQPage 빌더(`743–754`)는 `availableLanguage` 키를 만들지 않는다.

`availableLanguage` 값 점검:

| 값 | 있는가 |
|---|---|
| `vi` / `id` / `th` / `fil` | 없음 |
| `Vietnamese` / `Indonesian` / `Thai` / `Filipino` / `Tagalog` | 없음 |
| `tiếng Việt` / `bahasa Indonesia` / `ภาษาไทย` | 없음 |
| `en` / `zh-Hant` / `ja` / `ko` | 이 4개만 |

`inLanguage`는 페이지 언어(`publicDocumentLanguage` → `vi`/`id`/`th`/`fil`)이고, WO-S2b가 페이지 로케일로 지정한 필드다. 상담 가능 언어가 아니다.

llms.txt 주의문(상담 언어 목록):

- 안내 4로케일 `GUIDANCE_LLMS_NOTICES.*.consultationNotice`(**489–514**): 페이지가 해당 언어로 쓰였다고 말한 뒤, 상담은 영·중·일·한만이라고 **부정**한다. 통역 가능을 암시하지 않는다. 문장은 각 로케일 FAQ 답의 부분 문자열이다(아래 표).
- 루트 카탈로그 주석(**351**): `Consultations are conducted only in English, Chinese, Japanese, and Korean.` 영어 표기는 언어 계약과 같다.
- `discoveryNotice` 4언어(**491–516**)는 순위·추천·노출을 약속하지 않는다고 적는다. `availableLanguage` 배열이 아니다.

루트 카탈로그가 `Vietnamese` 등 영어 언어명을 쓰는 곳(**334–338, 351**)은 “안내 카탈로그의 읽기 언어” 라벨이다. 같은 줄이 상담 언어를 4개로 한정한다. `availableLanguage`에 넣지 않았다.

FAQ JSON-LD가 `tiếng Việt` 등을 포함하는 것은 본문 FAQ를 축자 복사한 결과(항목 2)이며, Question/Answer 텍스트이지 `availableLanguage`가 아니다.

---

## 2. FAQPage Question/Answer 가 content faqs 와 글자 그대로 같은가 — **PASS** (코드 경로; vitest 미실행)

faqs가 있는 페이지는 로케일당 `pages.faq` 하나뿐이다(content **353, 824, 1295, 1766**). 각 8문항, 합 32. `question`/`answer` 빈 문자열 없음.

경로:

1. `InternationalGuidance.tsx` **61–63**: `page.faqs`를 그대로 `buildGuidanceFaqJsonLd`에 전달.
2. `seo.ts` **747–750**: `{ question, answer }` → `{ q, a }` 필드명만 바꿈. 문자열을 요약·트림·번역하지 않음.
3. `seo.ts` **630–646**: `String(item.q)` / `String(item.a)` 후 `name` / `acceptedAnswer.text`. 원문이 이미 string이면 `String()`은 항등.
4. 빈 `q`/`a`만 필터(**631**). 현재 32건은 통과.

`guidance-jsonld.test.ts` **59–65**가 같은 등호를 단언한다. 이 검토는 그 테스트를 실행하지 않았다. 정적 대조는 `/th/faq` 8문항을 content **1297–1335**와 빌더 출력 형태로 재구성해 일치함을 확인했다.

`/th/faq` FAQPage (빌더가 만드는 객체; `inLanguage`는 **753**에서 추가):

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "สำนักงานรับเรื่องประเภทใดบ้าง",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "สำนักงานรับงาน 6 กลุ่ม ได้แก่ การลงทุนและการจัดตั้งบริษัทในไต้หวัน ข้อพิพาททางแพ่งและการเรียกค่าเสียหาย คดีครอบครัวและมรดก ข้อพิพาทแรงงาน คดีอาญา และทรัพย์สินทางปัญญา ส่วนการจะรับเรื่องใดเรื่องหนึ่งหรือไม่ จะพิจารณาหลังตรวจสอบเนื้อหาแล้ว"
      }
    },
    {
      "@type": "Question",
      "name": "ควรเตรียมอะไรก่อนติดต่อ",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "โปรดเตรียมสรุปสั้น ๆ เกี่ยวกับลำดับเหตุการณ์ สิ่งที่ท่านต้องการ ความเกี่ยวข้องของเรื่องกับไต้หวัน และกำหนดเวลาหากมี หากมีหมายหรือหนังสือจากศาลหรือหน่วยงานของรัฐแล้ว โปรดแจ้งวันที่ในเอกสารด้วย ในขั้นนี้ยังไม่จำเป็นต้องส่งเอกสารแสดงตนหรือพยานหลักฐานทั้งหมด"
      }
    },
    {
      "@type": "Question",
      "name": "ปรึกษาเป็นภาษาไทยได้หรือไม่",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ไม่ได้ ข้อมูลแนะนำส่วนนี้จัดทำเป็นภาษาไทย แต่การปรึกษากับทนายความดำเนินการเฉพาะภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี ทั้งนี้ เราไม่รับประกันว่าจะจัดล่ามให้ด้วย"
      }
    },
    {
      "@type": "Question",
      "name": "หากไม่สะดวกทั้ง 4 ภาษานั้นจะทำอย่างไร",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "โปรดเลือก “ต้องยืนยันวิธีติดต่อ” เมื่อส่งเรื่องเข้ามา เราจะตอบกลับเพื่อยืนยันวิธีสื่อสารที่เป็นไปได้ร่วมกับท่าน ขั้นตอนนี้เป็นการยืนยัน ไม่ใช่คำมั่นว่าเราจะให้บริการเป็นภาษาอื่นได้"
      }
    },
    {
      "@type": "Question",
      "name": "ข้อความที่เขียนเป็นภาษาไทยจะถูกจัดการอย่างไร",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ข้อความต้นฉบับที่ท่านเขียนจะถูกเก็บไว้ตามเดิมและไม่มีการแปลโดยอัตโนมัติ หากจำเป็น ภาษาที่จะใช้สื่อสารในขั้นถัดไปจะยืนยันร่วมกับท่าน"
      }
    },
    {
      "@type": "Question",
      "name": "ส่งเรื่องแล้วถือว่าได้รับคำปรึกษาแล้วหรือไม่",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ยังไม่ถือว่าได้รับ เรื่องที่ส่งแล้วคือเรื่องที่รอทนายความตรวจสอบ ไม่ใช่ความเห็นทางกฎหมาย ไม่ใช่การนัดหมายที่ยืนยันแล้ว และการส่งเรื่องเองก็ไม่ได้ทำให้เกิดความสัมพันธ์ระหว่างทนายความกับลูกความ"
      }
    },
    {
      "@type": "Question",
      "name": "ค่าใช้จ่ายคิดอย่างไร",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "จะกำหนดขอบเขตงานก่อน จากนั้นจำนวนเงินและวิธีคิดค่าใช้จ่ายจะได้รับการยืนยันกับท่านก่อนเริ่มงาน หน้านี้ไม่ได้แสดงตัวเลข และไม่ได้ระบุว่าการปรึกษาครั้งแรกไม่เสียค่าใช้จ่าย"
      }
    },
    {
      "@type": "Question",
      "name": "หากเรื่องของข้าพเจ้าเร่งด่วนมากจะทำอย่างไร",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "โปรดระบุกำหนดเวลา หรือวันที่ที่ปรากฏในเอกสารทางการ ไว้ตั้งแต่ต้นของสรุปเรื่อง เพื่อให้เห็นได้ทันทีเมื่อมีการตรวจสอบ ทั้งนี้ หน้านี้ไม่มีสายด่วนและไม่รับประกันระยะเวลาตอบกลับ หากเรื่องเร่งด่วนจนรอไม่ได้ ท่านควรหาช่องทางอื่นในพื้นที่ของท่านควบคู่ไปด้วย"
      }
    }
  ],
  "inLanguage": "th"
}
```

`about` 등 faqs 없는 페이지는 FAQPage를 내지 않는다(`InternationalGuidance.tsx` **62**, 테스트 **76–80**).

---

## 3. 새 @id 생성 없는가 — **PASS**

S2b가 추가한 JSON-LD에서 새로 만든 `@id` 문자열은 없다.

| 노드 | `@id` | 출처 |
|---|---|---|
| LegalService | `https://tseng-law.com/#organization` | 기존 `ORGANIZATION_ID` (`seo.ts` **100**, 재사용 **774**). 같은 값이 기존 `buildLegalServiceJsonLd` **366**에도 있음 |
| provider Person | `https://tseng-law.com/#person-tseng-chun-wei` | 기존 `ATTORNEY_PERSON_ID` (**107**, 재사용 **783**) |
| FAQPage / Question / Answer | 없음 | `buildFaqJsonLd` **636–646**에 `@id` 키 없음 |

`#legal-service-guidance`, `#faq-vi` 같은 신규 프래그먼트는 세 대상 파일에 없다.

---

## 4. llms.txt 4로케일 설명문 자연스러움 + 추천·보장 뉘앙스 0 — **PASS**

10키 주석(`annotation`)은 `page.description` 재사용(`llms-txt.ts` **543–547**). 제목은 `page.title`. 해당 언어의 이미 게재된 한 줄이라 레지스터가 본문과 같다(vi `tư vấn`/`luật sư`, id `advokat`/`Tionghoa`, th `ท่าน`/`ข้อมูลแนะนำ`, fil `abogado`/`konsultasyon`).

40개 description을 읽었다. 승소율·성공 보장·최고/유일 표현 없음. “보장”이 나오는 줄은 모두 부정이다.

- vi/contact **300**: “những điều không được bảo đảm”
- id/contact **771**: “hal-hal yang tidak dijamin”
- th/contact **1242**: “สิ่งที่ไม่ได้รับประกัน”
- fil/contact **1713**: “mga bagay na hindi ginagarantiya”

`discoveryNotice` 4언어(**491–516**)는 기존 en/ko/zh/ja 주의문과 같은 방향이다. “khuyến nghị / rekomendasi / การแนะนำโดย AI / rekomendasyon”은 **하지 않는다**는 서술이다. 추천·순위·노출을 약속하는 문장이 아니다.

th 제목·본문의 `ข้อมูลแนะนำ`은 이 사이트가 쓰는 “안내 정보” 역어이지, “이 사무소를 추천한다”가 아니다. 게재 본문(예: home title **1034**)과 같다.

상담 주의문은 FAQ에서 잘라 온 문장이다(테스트가 substring으로 단언, `llms-discovery.test.tsx` **123–124**). 정적 확인:

| 로케일 | notice (`llms-txt.ts`) | FAQ 답 안의 동일 구간 (content) |
|---|---|---|
| vi | **489–490** | **367** (앞의 `Không. `와 뒤 통역 문장 제외) |
| id | **497–498** | **838** |
| th | **505–506** | **1309** |
| fil | **513–514** | **1780** |

기밀 주의문은 privacy 본문과 축자 일치: vi **424** = **493–494**, id **895** = **501–502**, th **1366** = **509–510**, fil **1837** = **517–518**.

---

## 5. `</script>` 이스케이프 안전 — **PASS**

안내 페이지 JSON-LD는 전부 `JsonLd`를 탄다(`InternationalGuidance.tsx` **123–124**).

`src/components/JsonLd.tsx` **14–20**: `JSON.stringify` 후 `<` `>` `&`를 `\u003c` `\u003e` `\u0026`로 바꾸고 U+2028/U+2029도 이스케이프. `</script>`는 `\u003c/script\u003e`가 되어 인라인 스크립트를 닫지 못한다.

FAQ 원문에 `</script>`가 없어도 경로는 동일하다. `guidance-jsonld.test.ts` **94–105**가 질문 문자열에 `</script><script>`를 넣고 마크업에 그 연속이 없음을 단언한다. 이 검토는 그 테스트를 실행하지 않았다. 이스케이프 함수 자체는 읽어서 확인했다.

LegalService `description`도 같은 `JsonLd`를 탄다. 별도 `JSON.stringify` 후 raw `<script>` 삽입은 세 대상 파일에 없다.

---

## 보고

### (1) 변경 파일 목록

- `docs/seo/reviews/S2b-REVIEW.md` (신규, 본 검토)
- 대상 원본 `src/lib/llms-txt.ts` / `src/lib/seo.ts` / `src/components/InternationalGuidance.tsx` 및 content·intent·columns **미수정**

### (2) 실행한 명령과 마지막 출력 3줄

WO-S2b-review: **Bash 금지.** 명령을 실행하지 않았다.  
`npx vitest run src/lib/__tests__/guidance-jsonld.test.ts 'src/app/[locale]/__tests__/llms-discovery.test.tsx'` **미실행** — 통과 여부를 이 검토에서 주장하지 않는다.

### (3) 완료 기준 항목별 PASS/FAIL

1. availableLanguage 에 vi/id/th/fil 또는 언어명 없음 (llms.txt 주의문 포함) — **PASS**
2. FAQPage Question/Answer 가 faqs 와 글자 그대로 같음 — **PASS** (코드 경로; vitest 미실행)
3. 새 @id 생성 없음 — **PASS**
4. llms.txt 4로케일 설명문 자연 + 추천·보장 뉘앙스 0 — **PASS**
5. `</script>` 이스케이프 안전 — **PASS** (코드 리딩; vitest 미실행)

### (4) 미해결·못 한 것

- 지정 vitest 2파일을 돌리지 못했다(Bash 금지). FAQ 축자 일치와 이스케이프는 코드·본문 대조로만 봤다.
- `/th/faq` HTML을 브라우저에서 받아 JSON-LD를 파싱하지 못했다. 위 JSON은 빌더가 content 문자열을 그대로 넣었을 때의 재구성이다.
- 루트 `/llms.txt`와 `/{vi,id,th,fil}/llms.txt` HTTP GET을 하지 못했다.

총평 PASS (FAIL 0건 / 항목 5)
