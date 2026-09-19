# G2-3 독립검토 — it · nl · pl 안내 로케일 (커밋 7a138084 + 6bb3e839)

> **기계 게이트 (원어민 검수 아님).** Opus/Fable 한도로 이 레인에서 독립 원어민 검토는 돌리지 않는다. 문법·관용·정서법 품질은 본 문서의 범위가 아니다.

검토자: 독립 리뷰어(구현자 아님) · 기계 게이트만
대상: `7a138084` (본문) + `6bb3e839` (it/nl/pl 긍정 무료-전송 문장 삭제) on `i18n/global-picker-20260918`
워크트리: `/Users/son7/Projects/tseng-law-global-picker-20260918` (dirty — G2-4 병렬 구현 중. `src/` 미수정)
방법: `git show <sha>:path` · `git diff 93b9445b 7a138084` · `git show 6bb3e839`. 워크트리 파일·vitest 미실행
기준: `docs/i18n/global-plan/WO-G2-3.txt` · `docs/i18n/global-plan/reviews/G2-1-FR-PT-REVIEW.md` 형식
검토일: 2026-09-19 · 파일 수정: 본 리뷰 문서만

줄 번호: 팩 파일 `international-guidance-it-nl-pl.ts`는 쌍의 종점 `6bb3e839` 블롭(3문장만 줄었고 이후 줄 번호는 동일). 그 외 파일은 `7a138084`(6bb3e839가 만지지 않음). 삭제된 긍정 문장은 `7a138084` 블롭으로 인용.

---

## (A) 판정

**PASS — 블로킹 0건 (두 커밋을 한 세트로 볼 때).**

`7a138084` 단독이면 it `:242` / nl `:730` / pl `:1218`의 「문의 전송도 무료」가 **긍정 무료 주장**이라 광고규정 BLOCK 후보였다. `6bb3e839`가 세 문장을 잘랐고, 남은 `gratuito` / `kosteloos` / `bezpłatna`는 모두 「첫 상담이 무료라고 말하지 않는다」부정문이다. 상담 언어 잠금·`availableLanguage`·`siteLocales`는 확대되지 않았다. 언어 FAQ 답은 세 로케일 모두 부정으로 시작한다.

FIX는 (1) 그 긍정 문장을 테스트·칼럼 체커가 못 잡는 토큰 구멍 — 재발 가능 (2) 문의 `consultationNotice`의 배타 한정어 누락 (3) pl 직함 형용사 성 불일치 (4) 체커가 zh-hans 긍정 FAQ 문안을 칼럼에서 금지하는 충돌.

집계: BLOCK 0 · FIX 4 · NOTE 4

---

## (B) 발견 사항

### 6bb3e839가 닫은 긍정 무료-전송 (검증)

`git show 6bb3e839` — `src/data/international-guidance-it-nl-pl.ts` 3곳만 교체.

| 로케일 | `7a138084` (삭제됨) | `6bb3e839` (잔존) |
|---|---|---|
| it `:242` | `'Questa pagina non è un’offerta di prezzo e non crea un obbligo di pagamento. L’invio di una richiesta tramite questa pagina è altresì gratuito.'` | `'Questa pagina non è un’offerta di prezzo e non crea un obbligo di pagamento.'` |
| nl `:730` | `'Deze pagina is geen prijsvoorstel en schept geen betalingsplicht. Het sturen van een verzoek via deze pagina is eveneens kosteloos.'` | `'Deze pagina is geen prijsvoorstel en schept geen betalingsplicht.'` |
| pl `:1218` | `'Ta strona nie jest ofertą cenową i nie tworzy obowiązku zapłaty. Wysłanie wniosku za pośrednictwem tej strony jest również bezpłatne.'` | `'Ta strona nie jest ofertą cenową i nie tworzy obowiązku zapłaty.'` |

잔존 부정문(허용): it `:248` `'Questa pagina non dice che il primo colloquio è gratuito…'` · nl `:736` `'Deze pagina zegt niet dat het eerste gesprek kosteloos is…'` · pl `:1224` `'Ta strona nie mówi, że pierwsza rozmowa jest bezpłatna…'`.

### 테스트·체커가 그 BLOCK 후보를 통과시킨 구멍

| # | 등급 | 파일:줄 | 인용 | 문제 | 수정안 |
|---|---|---|---|---|---|
| 1 | FIX | `src/lib/__tests__/guidance-it-nl-pl-content.test.ts:34,44,54` · `scripts/check-column-translation.mjs:191,201,211` (`7a138084`) | 테스트 `['consulenza gratuita', /consulenza gratuita/i]` · `['gratis consultatie', /gratis consultatie/i]` · `['bezpłatna konsultacja', /bezpłatna konsultacja/i]` / 체커 `it-free-consult` `/consulenza gratuita\|primo colloquio gratuito/` · `nl-free-consult` `/gratis consultatie\|kosteloos eerste gesprek/` · `pl-free-consult` `/bezpłatna konsultacja\|darmowa porada/` | `7a138084`의 긍정 문장은 `gratuito` / `kosteloos` / `bezpłatne`이지 `consulenza gratuita`가 아니다. 단위 테스트와 칼럼 체커 **둘 다** 통과한 채로 커밋됐다. `6bb3e839`가 카피를 고쳤을 뿐 게이트는 그대로라, 같은 문장을 다시 넣어도 녹색이다 | 긍정 무료 전송·`gratuito`/`kosteloos`/`bezpłatn*`를 잡고, 기존 8언어처럼 「첫 상담이 무료라고 말하지 않는다」부정문만 면제. 테스트에 `7a138084` 원문 문자열이 **없어야** 함을 핀 |
| 2 | FIX | `src/data/international-inquiry-copy.ts:934` (it) · `:984` (nl) · `:1034` (pl) (`7a138084`) | `'La consulenza si svolge in quattro lingue: inglese, cinese (中文), giapponese e coreano.'` · `'De consultatie vindt plaats in vier talen: …'` · `'Konsultacja odbywa się w czterech językach: …'` | FAQ·llms·answers는 배타어를 쓴다(it `soltanto` `it-nl-pl.ts:332` / `llms-txt.ts:625` / `answers.ts:462`). 문의 상단 공지만 「네 언어로 한다」나열. G2-1 FIX #15 · G2-2 FIX #2와 동형 | it `soltanto in quattro lingue` / nl `alleen in vier talen` / pl `wyłącznie w czterech językach` |
| 3 | FIX | `src/data/international-guidance-team.ts:552` vs `:564` (`7a138084`) | `representativeTitle: 'Adwokat kierująca'` · `qualificationSentence: '{name} jest uprawniona … i jest adwokatem kierującym {firm}.'` | WO: pl 직함은 `adwokat`(남성형 명사) + 여성 동사·대명사, `adwokatka` 금지. `uprawniona`·bio `'Reprezentowała'`(`:1701`)·`'Studentka'`(`:1706`)·`Sprawdziła`(`it-nl-pl.ts:1046`)는 여성으로 맞다. 같은 직함을 `:552`는 여성 분사 `kierująca`, `:564`는 남성 분사 `kierującym`으로 쓴다. `adwokatka` 0건 | 직함 형용사를 한쪽으로. WO 직함 유지면 `Adwokat kierujący` + 여성 동사만, 또는 표지 분사를 `kierująca`로 통일하고 도구격도 `adwokat kierująca`(명사 불변 + 여성 분사) |
| 4 | FIX | `scripts/check-column-translation.mjs:143-144` (`7a138084`) | `{ id: 'zh-hans-consult-lang', re: /可以用中文咨询\|提供中文咨询\|中文咨询服务/u, note: 'zh-hans 상담 가능 (FAQ 질문 외)' }` | zh-hans는 상담 언어와 페이지 언어가 겹친다. WO-G2-2가 FAQ 답을 `'可以。律师咨询以英语、中文…'`로 **요구**한다. 이 정규식은 그 진실한 문장을 칼럼에서 금지한다. 지금은 `columns-zh-hans`가 비어 영향 0. G2-C 칼럼이 FAQ를 반복하면 체커가 거짓 실패하거나, 반대로 중문 상담 가능 사실을 칼럼에서 지우게 된다 | zh-hans 상담-가능 패턴을 삭제하거나, `提供中文咨询服务` 같은 **과장 광고**만 남긴다. `可以用中文咨询`는 금지 대상이 아님 |

### NOTE

| # | 등급 | 파일:줄 | 인용 | 관찰 |
|---|---|---|---|---|
| 5 | NOTE | `7a138084` `it-nl-pl.ts:242,730,1218` → `6bb3e839` 동일 줄 | 위 표 | 구현 SHA가 긍정 무료-전송을 넣었고 바로 다음 커밋이 삭제. 세트 판정은 PASS. `7a138084`만 배포하면 BLOCK |
| 6 | NOTE | `src/data/international-guidance-team.ts:1583` (it) · `:1642` (nl) · `:1701` (pl) (`7a138084`) | `'… sentenza di primo grado di TWD 1.57M.'` / `'… vonnis in eerste aanleg van TWD 1.57M.'` / `'… wyrok pierwszej instancji na TWD 1.57M.'` | de/es/fr/pt/G2-2와 동일 수치. 광고규정 일괄 판단 사안 |
| 7 | NOTE | `src/lib/__tests__/guidance-it-nl-pl-content.test.ts:233-237` | nl 금지 스캔: `if (isLanguageFaqQuestion) continue` — 질문이면 **모든** 토큰 면제 | it/pl은 `consulenza in italiano` / `konsultacja po polsku` 라벨만 면제. nl FAQ 질문 `'Kan ik in het Nederlands worden geadviseerd?'`는 `advies in het Nederlands`를 포함하지 않아 면제가 사실상 죽은 분기 |
| 8 | NOTE | `src/lib/__tests__/guidance-it-nl-pl-content.test.ts:173-176` | nav 라벨 `<= 14` | it/nl/pl nav는 WO 예와 일치(`Servizi`/`Lo studio`/`Avvocati`/`Costi`/`Contatti`/`Domande`/`Privacy`/`Avvertenze`/`Articoli` 등, `it-nl-pl.ts:15-25,503-513,991-1001`). ru 장문 네비(G2-2 NOTE)는 이 커밋이 고치지 않음 |

---

## (C) 확인하여 정상인 항목

### 하드 룰 1 — 상담 언어 잠금

- `GUIDANCE_CONSULTATION_LANGUAGES` `src/lib/seo.ts:850` = `['en', 'zh-Hant', 'ja', 'ko']`. `7a138084`의 `seo.ts` diff는 og `it_IT`/`nl_NL`/`pl_PL` 세 줄만. `availableLanguage`(`:918`, `:926`) 불변.
- `CONSULTATION_LANGUAGES` `intake-language-contract.ts:27` = `['en', 'zh-hant', 'ja', 'ko']`. 문의 로케일에만 it/nl/pl 추가.
- `locales` / `siteLocales` (`src/lib/locales.ts:2,7`) 불변. `git diff 93b9445b 7a138084 -- src/lib/locales.ts` 공백. 라우팅 테스트 `:29-30`이 `['ko','zh-hant','en']` / `['ko','zh-hant','en','ja']` 핀.
- `GUIDANCE_CONSULTATION_LANGUAGE_LOCALES` (`public-guidance.ts:41`) 여전히 `['zh-hans']`. 테스트가 it/nl/pl `isGuidanceConsultationLanguageLocale === false`.
- 문의 `languageOptions` 키: it/nl/pl 모두 `en`/`zh-hant`/`ja`/`ko`/`needs-method-confirmation` (`inquiry-copy.ts:972-976,1022-1026,1072-1076`). it/nl/pl 키 없음.

#### 언어 FAQ 문답 원문 (`6bb3e839` = `7a138084`, FAQ 줄 불변)

**it** (`international-guidance-it-nl-pl.ts:330-332`):

- Q: `'È possibile una consulenza in italiano?'`
- A: `'No. Queste indicazioni sono scritte in italiano, ma la consulenza con un’avvocata o un avvocato si svolge soltanto in inglese, cinese (中文), giapponese e coreano. Non promettiamo nemmeno un interprete. La traduzione scritta è un’altra cosa: il testo originale che scrive viene conservato così e non viene tradotto automaticamente.'`

본문 `:96-99`: `'Questa pagina è scritta in italiano, ma la consulenza … si svolge soltanto nelle quattro lingue di consulenza inglese, cinese (中文), giapponese e coreano. … Non promettiamo un interprete, un termine di risposta né un appuntamento…'`

**nl** (`:818-820`):

- Q: `'Kan ik in het Nederlands worden geadviseerd?'`
- A: `'Nee. Deze toelichting is in het Nederlands geschreven, maar het gesprek met een advocaat vindt alleen plaats in het Engels, Chinees (中文), Japans en Koreaans. Wij beloven ook geen tolk. Schriftelijke vertaling is iets anders: de oorspronkelijke tekst die u schrijft, wordt zo bewaard en niet automatisch vertaald.'`

**pl** (`:1306-1308`):

- Q: `'Czy możliwa jest konsultacja po polsku?'`
- A: `'Nie. Te informacje są napisane po polsku, ale konsultacja z adwokatem odbywa się wyłącznie w języku angielskim, chińskim (中文), japońskim i koreańskim. Nie obiecujemy też tłumacza ustnego. Tłumaczenie pisemne to coś innego: oryginalny tekst, który Państwo napiszą, jest zapisywany tak i nie jest tłumaczony automatycznie.'`

llms (`llms-txt.ts:625,633,641`)와 answers 6키(it `:462` `soltanto` · nl `:494` `alleen` · pl `:526` `wyłącznie`)도 배타. 문의 상단만 #2.

### 하드 룰 2 — 광고 규정 (`6bb3e839` 이후)

it/nl/pl 팩 토큰 스캔:

- it `gratuit*`: `:248`, `:352` 부정만. `tasso di successo` 0. `garant*`는 `non è garantita` / `non garantisce` 부정(`:283`, `:337`, `:486`).
- nl `kosteloos`/`gratis`: `:736`, `:840` 부정만. `we garanderen` 0. `garantie`는 「기술 보증이 아니다」(`:855`, `:884`).
- pl `bezpłatn*`: `:1224`, `:1328` 부정만. `gwarantujemy` 0. `jedynie` (`:1005`)는 「일반 정보일 뿐」한정.

`[변호사 검수 필요]` 신규 0.

### 하드 룰 3 — Wei Tseng 여성

- it: `Avvocata dirigente` (`team.ts:496,505,508,512`). `abilitata` (`:508`). `columnsReviewLabel` `'Verificato dall’avvocata Wei Tseng'` (`it-nl-pl.ts:70`). bio `'Studentessa in scambio…'` (`team.ts:1588`). 남성 동료 `'chang-rongxuan': 'Avvocato a Taiwan'` (`:513`). `avvocato Wei Tseng` 0.
- nl: 공성 `advocaat` + 여성 대명사. `'Zij vertegenwoordigde…'` (`:1642`) · `'Uitwisselingsstudente…'` (`:1647`) · answers `:504` `'zij werkt'`.
- pl: `adwokatka` 0. 여성 동사 `uprawniona` (`:564`) · `Reprezentowała` (`:1701`) · `Studentka` (`:1706`) · `Sprawdziła adwokat Wei Tseng` (`it-nl-pl.ts:1046`). 직함 분사만 #3.

### 하드 룰 4 — 격식·카테고리·폰트 바인딩 (기계)

- it `Lei`/`Sua` 정중체. `tu` 0.
- nl `u`. `jij`/`jouw` 0.
- pl `Państwo` 정중 복수 (`answers.ts:536` 등).
- 카테고리 WO 바이트 일치 (`columns.ts:177-179`): it `'Costituzione di società a Taiwan'` · nl `'Oprichting van een vennootschap in Taiwan'` · pl `'Zakładanie spółki na Tajwanie'`.
- autonym `Italiano` / `Nederlands` / `Polski` (`public-guidance.ts:147-149`). region europe, englishName Italian/Dutch/Polish.
- og `it_IT` `nl_NL` `pl_PL`.
- **폰트 바인딩 (WO §2):** `globals.css`가 `html[lang=de,es,fr,pt,ms,ru,tr,it,nl,pl]`을 latin 변수에 묶고 (`7a138084` diff), `html[lang='zh-Hans'], html[lang='zh-hans']`에 SC 변수 `--font-noto-sans-sc-loaded` / `--font-noto-serif-sc-loaded`. `.site[data-locale=…]` 동일. `locale-font-bindings.test.ts` 추가.

### 하드 룰 5 — 기존 팩 불변 (`7a138084` vs parent `93b9445b`)

`western.ts` diff는 헤더 주석 + it/nl/pl re-export 8줄. de/es/fr/pt/ru/tr 본문 0. `asia.ts` 0. `locales.ts` 0.

(참고: `f82be715..7a138084` 구간에는 중간에 `69330894` G2-1-R1 fr/pt 수정이 들어 있다. G2-3 커밋 자체가 기존 문장을 고친 것은 아님.)

### 하드 룰 6 — 테스트 유효성 (정적)

미실행(워크트리 dirty). 블롭:

- `shapeOf` de 동형 (`content.test.ts:163-171`).
- FAQ `^No.` / `^Nee.` / `^Nie.` + 4언어 (`:198-216`).
- 문의 폼 it/nl/pl 키 없음 (`:136-142`).
- nav ≤14 (`:173-176`).
- 금지 스캔은 #1 구멍.

체커: `GUIDANCE_LANGS`에 7언어, `FORBIDDEN_PHRASES`·lexicon 충전 (`check-column-translation.mjs:27,143-212,1251-1257`). G2-2에서 비어 있던 표는 이 커밋에서 채워졌다. #4만 zh-hans 상담-가능 패턴이 과잉.

### 기타

- 빈 칼럼 `columns-{it,nl,pl}/.gitkeep`.
- it 홈 CTA `'Inviare una richiesta di consulenza'` 등은 전송 요청이지 무료 상담이 아님.

---

## 후속 권고

1. FIX #1이 재발 방지의 핵심이다. `6bb3e839`만으로는 테스트가 같은 문장을 다시 통과시킨다.
2. FIX #2는 G2-2 FIX #1–#2와 같이 문의 `consultationNotice`에 배타어를 넣으면 닫힌다.
3. 원어민 검수(it `Lei` 조응, nl 어순, pl 격변화)는 본 게이트 밖. Opus/Fable 한도로 돌리지 않았다.

---

판정 라인: **PASS — 블로킹 0건 (FIX 4 · NOTE 4) · 7a138084+6bb3e839 세트 · 기계 게이트 (원어민 검수 아님)**
