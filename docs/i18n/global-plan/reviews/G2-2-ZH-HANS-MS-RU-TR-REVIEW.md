# G2-2 독립검토 — zh-hans · ms · ru · tr 안내 로케일 (커밋 f82be715)

> **기계 게이트 (원어민 검수 아님).** Opus/Fable 한도로 이 레인에서 독립 원어민 검토는 돌리지 않는다. 문법·관용·정서법 품질은 본 문서의 범위가 아니다.

검토자: 독립 리뷰어(구현자 아님) · 기계 게이트만
대상: `f82be715` on `i18n/global-picker-20260918`
워크트리: `/Users/son7/Projects/tseng-law-global-picker-20260918` (dirty — G2-4 병렬 구현 중. `src/` 미수정)
방법: `git show f82be715:path` · `git diff 95f6b205 f82be715` 만. 워크트리 파일·vitest 미실행
기준: `docs/i18n/global-plan/WO-G2-2.txt` · `docs/i18n/global-plan/reviews/G2-1-FR-PT-REVIEW.md` 형식
검토일: 2026-09-19 · 파일 수정: 본 리뷰 문서만

---

## (A) 판정

**PASS — 블로킹 0건.**

상담 언어 잠금(EN/ZH/JA/KO)은 깨지지 않았다. `availableLanguage`와 `siteLocales`/`locales`는 확대되지 않았다. zh-hans 언어 FAQ는 WO 명세대로 **긍정(`可以。`)** 이고, ms/ru/tr은 **부정(`Tidak.` / `Нет.` / `Hayır.`)** 으로 시작한다. 금지 광고 토큰(승소율·보장·최상급·24/7·무료 상담)은 신규 4로케일 본문에서 긍정 주장으로 나타나지 않았다. Wei Tseng 여성 일치는 로케일 관례(zh-hans 무표지 / ms·tr 성중립 / ru 여성 술어·대명사)를 지킨다. zh-hans에 `中国台湾`·`台湾省`·`大陆`·`营业执照`·`工商局`은 0건이다.

FIX는 배포 차단이 아니다. GEO 답변 블록·문의 카피의 배타 한정어 누락(G2-1 FIX #15와 동형), 칼럼 체커 테이블 미충전(G2-1 FIX #17과 동형), 금지 토큰 테스트가 `免费咨询`만 보는 구멍이 남는다.

집계: BLOCK 0 · FIX 4 · NOTE 5

---

## (B) 발견 사항

### 상담 잠금 표면 (FAQ 본문은 통과, GEO/문의 카피는 배타어 약함)

| # | 등급 | 파일:줄 | 인용 | 문제 | 수정안 |
|---|---|---|---|---|---|
| 1 | FIX | `src/data/international-guidance-answers.ts:366,371,376,381,386,391` (ms 6키) · `:398,403,408,413,418,423` (ru 6키) · `:430,435,440,445,450,455` (tr 6키) | ms `'… Perundingan dijalankan dalam bahasa Inggeris, Cina, Jepun dan Korea.'` · ru `'… Консультация проводится на английском, китайском, японском и корейском языках.'` · tr `'… Görüşme İngilizce, Çince, Japonca ve Korece yapılır.'` | 같은 커밋의 언어 FAQ·llms 공지는 배타 한정어를 쓴다(ms `hanya` `:816`, ru `только` `international-guidance-western.ts:2282`, tr `yalnızca` `:2770`, llms `llms-txt.ts:598,606,614`). 답변 블록 18문장은 한정어가 없어, 생성형 검색이 이 표면만 인용하면 안내 로케일 상담이 가능한 것처럼 읽힌다. G2-1 pt FIX #15와 동형. zh-hans `:334` 등 `'咨询以英语、中文、日语和韩语进行'` 는 WO 긍정 문안과 같아 **제외** | ms 6키 `'… Perundingan hanya dijalankan dalam bahasa Inggeris, Cina, Jepun dan Korea.'` / ru `'… проводится только на …'` / tr `'… yalnızca … yapılır.'` |
| 2 | FIX | `src/data/international-inquiry-copy.ts:781` (ms) · `:831` (ru) · `:881` (tr) | ms `'Perundingan dijalankan dalam empat bahasa: Inggeris, Cina (中文), Jepun dan Korea.'` · ru `'Консультация проводится на четырёх языках: …'` · tr `'Görüşme dört dilde yapılır: …'` | #1과 같은 구멍. 문의 폼 상단 `consultationNotice`는 상담 언어를 네 개로 나열만 하고 배타하지 않는다. zh-hans `:731` `'咨询以四种语言进行：英语、中文（中文）、日语和韩语。'` 는 긍정 로케일이라 제외 | ms `hanya dijalankan dalam empat bahasa` / ru `только на четырёх языках` / tr `yalnızca dört dilde` |

### 테스트·체커

| # | 등급 | 파일:줄 | 인용 | 문제 | 수정안 |
|---|---|---|---|---|---|
| 3 | FIX | `scripts/check-column-translation.mjs:27` vs `:52–` `FORBIDDEN_PHRASES` · `:827–836` `WORD_NUMERAL_LEXICONS` | `GUIDANCE_LANGS = […, 'zh-hans', 'ms', 'ru', 'tr']` 인데 `FORBIDDEN_PHRASES` 키는 `vi…pt` 9개뿐, `WORD_NUMERAL_LEXICONS`도 `fr`/`pt` 빈 배열에서 멈춤 | WO §3이 금지 토큰·국적어·수사 어휘집을 4로케일에 채우라고 했고, 로케일만 GUIDANCE_LANGS에 넣으면 칼럼 체커는 `FORBIDDEN_PHRASES[lang] ?? []`로 빈 검사를 통과한다. 지금 `columns-{zh-hans,ms,ru,tr}`는 `.gitkeep`뿐이라 영향 0. 후속 칼럼 WO가 광고 금지·수사 충실성 없이 통과한다. G2-1 FIX #17과 동형 | G2-3(`7a138084`)이 이 표를 채웠는지와 별개로, **이 SHA만** 보면 4로케일 체커는 비활성. 칼럼 WO 전에 충전 |
| 4 | FIX | `src/lib/__tests__/guidance-zh-hans-ms-ru-tr-content.test.ts:30-37` | `['免费咨询', /免费咨询/]` · `['保证', /保证/]` · `['24小时', /24小时/]` | `免费咨询`만 금지하면 `'首次咨询免费'`·`'咨询免费'`는 통과한다. 본 커밋 팩에는 `免费` 0건이라 현재는 통과. 후속 편집 구멍. `保证`는 팩이 `不承诺`으로 우회해 맞지만, 부정문 `不保证`가 들어오면 테스트가 실패하도록 짜여 있어 G2-1 fr `gratuit` 회피 전략과 같다 | 언어 FAQ 질문이 아닌 긍정 무료 주장만 잡도록 `免费` 어근 + 부정 문맥 면제. 최소: `/免费咨询|咨询免费|首次.*免费/` |

### NOTE

| # | 등급 | 파일:줄 | 인용 | 관찰 |
|---|---|---|---|---|
| 5 | NOTE | `src/data/international-guidance-western.ts:1966-1974` | `'Направления работы'` (18자) · `'Объём и стоимость'` · `'Конфиденциальность'` (18) · `'Отказ от ответственности'` (24) | 커밋 메시지가 이미 1440px에서 `mobile-nav-forced`를 미결로 적었다. 제품 잠금 위반은 아님. G2-3 it/nl/pl은 nav ≤14자 테스트를 넣었다 |
| 6 | NOTE | `src/data/international-guidance-team.ts:1236` (zh-hans) · `:1295` (ms) · `:1354` (ru) · `:1413` (tr) | `'… 并取得新台币 157 万元的一审判决。'` / `'… TWD 1.57M.'` | de/es/fr/pt 승인 팩과 동일 사건·금액. 이 커밋이 만든 주장이 아님. 광고규정 일괄 판단 사안(G2-1 NOTE #21과 동일) |
| 7 | NOTE | `src/lib/columns.ts:108` vs `:167` | `FORMATION_CATEGORY_PHRASES` `'公司登记'` · 라벨 `{ formation: '在台湾设立公司', legal: '台湾法律资讯', case: '案例分析' }` | 대만 용어 간체 `公司登记`는 프레이즈 목록에 있고, 화면 라벨은 `在台湾设立公司`. PRC `营业执照`가 아님. 불일치는 매칭 키 vs 표시명 |
| 8 | NOTE | `src/lib/__tests__/guidance-zh-hans-ms-ru-tr-content.test.ts:105-118` | `packStrings()` 소스 10개 | 금지 토큰 스캔에 `public-language-registry.ts` 피커 카피·컴포넌트가 빠짐(G2-1 NOTE #25과 동일). 현재 짧은 UI 라벨뿐 |
| 9 | NOTE | `src/app/fonts.ts:58-70,151-152` vs `src/app/globals.css` (이 커밋 미변경) | SC 로더 `--font-noto-sans-sc-loaded` / `--font-noto-serif-sc-loaded` | WO-G2-2 허용 파일에 `globals.css`가 없다. html[lang] 바인딩은 G2-3 범위. 이 SHA의 zh-hans 페이지는 한국어 폰트 폴백이 남을 수 있다 |

---

## (C) 확인하여 정상인 항목

### 하드 룰 1 — 상담 언어 잠금

- `GUIDANCE_CONSULTATION_LANGUAGES`는 `src/lib/seo.ts:847`에서 `['en', 'zh-Hant', 'ja', 'ko']` 고정. 이 커밋의 `seo.ts` diff는 `guidanceOpenGraphLocale`에 `zh-hans: 'zh_SG'` · `ms: 'ms_MY'` · `ru: 'ru_RU'` · `tr: 'tr_TR'` 네 줄만(`git diff 95f6b205 f82be715 -- src/lib/seo.ts`). JSON-LD `availableLanguage`(`:915`, `:923`)는 `[...GUIDANCE_CONSULTATION_LANGUAGES]` 그대로.
- `organizationLanguageTags`(`seo.ts:179`) = `['ko', 'zh-Hant', 'en', 'ja']`. 확대 없음.
- `CONSULTATION_LANGUAGES`(`intake-language-contract.ts:24`) = `['en', 'zh-hant', 'ja', 'ko']`. `PUBLIC_INQUIRY_LOCALES`에만 zh-hans/ms/ru/tr 추가(`:18-21`).
- `locales` / `siteLocales` (`src/lib/locales.ts:2,7`) = `['ko','zh-hant','en']` / `['ko','zh-hant','en','ja']`. `git diff 95f6b205 f82be715 -- src/lib/locales.ts` 공백. 라우팅 테스트 `guidance-zh-hans-ms-ru-tr-routing.test.ts:29-30`이 동일 배열을 핀한다.
- `GUIDANCE_CONSULTATION_LANGUAGE_LOCALES`(`public-guidance.ts:37`) = `['zh-hans']` only. 테스트 `:148-154`가 ms/ru/tr은 `false`.
- 문의 폼 `languageOptions` 키는 4로케일 모두 `en` / `zh-hant` / `ja` / `ko` / `needs-method-confirmation` 다섯 개뿐(`international-inquiry-copy.ts:769-773,819-823,869-873,919-923`). ms/ru/tr 키 없음(테스트 `:156-163`).

#### 언어 FAQ 문답 원문 (f82be715 블롭)

**zh-hans** (`international-guidance-asia.ts:326-328`) — 긍정:

- Q: `'可以用中文咨询吗？'`
- A: `'可以。律师咨询以英语、中文、日语和韩语进行。本页面以简体中文撰写，咨询时使用的中文包括普通话与书面中文。本页不承诺口译。书面翻译是另一回事：您写下的原文会按原样保存，不会被自动翻译。'`

본문 잠금 (`:92-95`): `'本页面以简体中文撰写。律师咨询以英语、中文、日语和韩语进行。咨询时使用的中文包括普通话与书面中文。…'` / `'本页不承诺口译、回复时限或预约。'`

**ms** (`international-guidance-asia.ts:814-816`) — 부정:

- Q: `'Bolehkah saya berunding dalam bahasa Melayu?'`
- A: `'Tidak. Maklumat ini ditulis dalam bahasa Melayu, tetapi perundingan dengan peguam hanya dijalankan dalam bahasa Inggeris, Cina (中文), Jepun dan Korea. Kami juga tidak menjanjikan jurubahasa. Terjemahan bertulis ialah perkara lain: teks asal yang anda tulis disimpan sebagaimana adanya dan tidak diterjemah secara automatik.'`

**ru** (`international-guidance-western.ts:2280-2282`) — 부정:

- Q: `'Возможна ли консультация на русском языке?'`
- A: `'Нет. Эти сведения написаны на русском языке, но консультация с адвокатом проводится только на английском, китайском (中文), японском и корейском языках. Мы также не обещаем переводчика. Письменный перевод — другое: исходный текст, который Вы пишете, сохраняется как есть и автоматически не переводится.'`

**tr** (`international-guidance-western.ts:2768-2770`) — 부정:

- Q: `'Türkçe danışma mümkün mü?'`
- A: `'Hayır. Bu bilgiler Türkçe yazılmıştır; ancak avukatla görüşme yalnızca İngilizce, Çince (中文), Japonca ve Korece yapılır. Tercüman da vaat etmeyiz. Yazılı çeviri başka bir şeydir: yazdığınız özgün metin olduğu gibi saklanır ve kendiliğinden çevrilmez.'`

llms 공지(`llms-txt.ts:590` zh-hans 긍정 문안, `:598` ms `hanya`, `:606` ru `только`, `:614` tr `yalnızca`)도 같은 계약이다.

### 하드 룰 2 — 대만 변호사 광고 규정

신규 4로케일 팩·답변·팀·문의·llms를 토큰 스캔한 결과:

- zh-hans (`asia.ts` 9–496): `胜诉率` `保证` `最佳` `唯一` `免费咨询` `免费` `24小时` `24/7` **0건**. 결과 부인은 `不承诺` (`answers.ts:339` `'事务所不承诺结果。'`).
- ms (`asia.ts` 497–): `kadar kejayaan` `terbaik` `satu-satunya` `percuma` `24 jam` **0건**. `jaminan teknikal` (`:851`)는 「기술적 보증이 아니다」부정.
- ru (`western.ts` 1963–2450): `процент выигранных` `гарант*` `лучш*` `единственн*` `бесплатн*` `круглосуточн*` **0건**. FAQ 질문 `:2280`만 `консультация на русском`(허용).
- tr (`western.ts` 2451–): `ücretsiz` 2건 모두 부정 — `:2686` `'Bu sayfa ilk konuşmanın ücretsiz olduğunu söylemez…'` · `:2790` `'… ilk konuşmanın ücretsiz olduğunu söylemez.'`. `Türkçe danışma`는 FAQ 질문 `:2768`뿐.

`[변호사 검수 필요]` 마커 0건(asia/western 신규 구간).

### 하드 룰 3 — zh-hans 정치·용어

`git show f82be715:src/data/international-guidance-asia.ts` 및 연계 모듈에서 `中国台湾` `台湾省` `大陆` `营业执照` `工商局` **0건**. 지명은 `台湾`. 고유명 번체 1줄(`:191` `國立臺灣大學` · `昊鼎國際法律事務所`)은 원형 유지. 대만 용어 간체: `居留证`(`:133`), `智慧财产`(6곳), `公司登记`(columns 프레이즈 `:108`). PRC `知识产权` 0건.

### 하드 룰 4 — Wei Tseng 여성

- zh-hans: `主持律师` (`team.ts:384,396,400`), `律师曾雋崴` (`asia.ts:66` `columnsReviewLabel: '由律师曾雋崴审阅'`). 중국어 성별 표지 없음. 남성 단정 0.
- ms: `Peguam` 성중립 (`team.ts:412,421,424,428`). `beliau` (`answers.ts:376`).
- ru: 직함 명사 `адвокат` + 여성 술어·대명사. `qualificationSentence` `:452` `'{name} уполномочена практиковать на Тайване и является руководящим адвокатом {firm}.'` · bio `:1354` `'Она представляла…'` · `:1359` `'Студентка по обмену…'` · answers `:408` `'уполномочена'` / `'она работает'`.
- tr: `Avukat` 성중립 (`team.ts:468,477,480,484`).

### 하드 룰 5 — 격식·레지스트리 (기계)

- ru 비격식 `ты/тебя/тебе` 0건. `Вы` 정중체.
- tr 비격식 `sen` 0건(본문). `siz` 사용.
- ms `anda` 소문자(WO).
- autonym: `public-guidance.ts:136-139` `'简体中文'` · `'Bahasa Melayu'` · `'Русский'` · `'Türkçe'`.
- 레지스트리 region/englishName: zh-hans asia-pacific / Simplified Chinese · ms asia-pacific / Malay · ru europe / Russian · tr europe / Turkish (`public-language-registry.ts:103-124`).
- og: `zh_SG` `ms_MY` `ru_RU` `tr_TR`. hreflang zh-hans → `zh-Hans` (`public-guidance.ts:238,494`).
- 카테고리 ms/ru/tr는 WO와 바이트 일치 (`columns.ts:168-170`).

### 하드 룰 6 — 기존 로케일 팩 불변

`git diff 95f6b205 f82be715 -- src/data/international-guidance-western.ts`: 삭제 라인은 파일 헤더 주석뿐. de/es/fr/pt 본문 불변. ru/tr 팩은 파일 하단에 **추가**. `locales.ts` 0줄. `intent-pages` / `site-content` / Header/Footer 미변경.

answers.ts 삭제 1줄은 pt 블록 닫는 `sources` 들여쓰기. pt 문장 불변.

### 하드 룰 7 — 테스트 유효성 (정적)

실행하지 않음(워크트리 dirty, G2-4 병렬). 블롭만 읽음.

의미 있는 단정: `shapeOf(guidanceContent[locale]) === shapeOf(guidanceContent.de)` (`content.test.ts:183-191`) — 섹션·FAQ 수 동형. zh-hans FAQ `^可以。` + `普通话与书面中文` (`:218-226`). ms/ru/tr `^Tidak.` / `^Нет.` / `^Hayır.` + 4언어 정규식 (`:228-246`). `GUIDANCE_CONSULTATION_LANGUAGE_LOCALES` 핀. 문의 폼에 ms/ru/tr 키 없음. 금지 토큰 스캔은 언어 FAQ **질문**만 면제.

약점: #4(무료 어근), #3(체커 빈 표), #8(스캔 범위).

### 기타

- 폰트: `Noto_Sans_SC`/`Noto_Serif_SC` (`fonts.ts:58-70`), latin subsets에 `cyrillic` (`:106`), zh-Hans → SC 클래스 (`:151-152`).
- 빈 칼럼: `src/content/columns-{zh-hans,ms,ru,tr}/.gitkeep`.
- 피커 카피 zh-hans `{ open: '选择地区与语言', title: '请选择您的地区与语言', close: '关闭', current: '目前语言' }` (`public-language-registry.ts:332-336`).

---

## 후속 권고

1. FIX #1–#2는 GEO 표면 배타 한정어. G2-1-R1 `apenas`와 같이 답변 6키+문의 공지를 한 커밋으로 닫을 수 있다.
2. FIX #3은 G2-3 체커 충전이 후속 SHA에서 닫았을 수 있다. **이 문서의 대상은 f82be715뿐** — 그 SHA에서는 비활성.
3. 원어민 검수(ms 표준 vs 인도네시아어 누수, ru 격변화, tr 음운, 간체 문기)는 본 게이트 밖. Opus/Fable 한도로 돌리지 않았다.

---

판정 라인: **PASS — 블로킹 0건 (FIX 4 · NOTE 5) · 기계 게이트 (원어민 검수 아님)**
