# AR-LOCALE-INVENTORY — `ar`(아랍어, RTL) 안내 로케일 추가 지점 인벤토리

WO: `docs/seo/mena-plan/WO-M0-INVENTORY.txt` / 작업트리 `~/Projects/tseng-law-mena-20260916` / 읽기 전용 조사.
모든 행은 실제 `grep`/`sed` 출력에서 뽑은 `파일:줄` 근거만 싣는다. 코드 수정·커밋·빌드·테스트 실행 없음.

---

## §1 요약 (10줄)

1. `vi/id/th/fil` 4개 안내 로케일이 건드린 실지점은 **비테스트 소스 파일 40개 + 테스트/스크립트-테스트 파일 34개**다(§2·§4). `ar` 추가는 같은 40개를 그대로 다시 건드린다.
2. 단일 진입점은 `src/lib/public-guidance.ts:9`(`GUIDANCE_LOCALES_4`)·`:13`(`PUBLIC_LOCALES_8`)·`:83`(경로 정규식)·`:97`(`isGuidanceLocale4`) 네 줄이며, 여기만 늘리면 sitemap·llms.txt·스위처·layout `generateStaticParams`가 자동으로 따라온다.
3. 자동으로 따라오지 **않는** 하드코딩 지점이 5곳: `src/middleware.ts:318-319` 매처, `src/app/sitemap.ts:83` 로케일 리터럴, `src/lib/llms-txt.ts:354` `!== 4` 하드 가드, `src/app/fonts.ts:108` 폰트 분기, `src/lib/seo.ts:143` og:locale 맵.
4. **최대 리스크 = RTL**: 레포 전체에 `dir` 속성도 `rtl` 문자열도 **0건**이다(`grep -rnw "rtl" src scripts tests` → 무출력, `grep -rn "dir=" src --include="*.tsx"` → 무출력). `src/app/layout.tsx:65`의 `<html lang=… >`에는 `dir`이 없고, `src/components/DocumentLocaleSync.tsx:56`은 `root.lang`만 갱신한다.
5. 공개 CSS의 좌우 하드코딩은 **globals.css 단독 336건**(논리속성은 `margin-inline` 21 + `padding-inline` 40뿐, `inset-inline`/`border-inline`/`text-align:start`는 **0건**). 공개 모듈 CSS까지 합치면 **388건**(§3).
6. 폰트: `src/app/fonts.ts`는 KR/TC/JP/Thai/Latin 5종만 로드하며 아랍 문자 글립을 **전혀 로드하지 않는다**. `globals.css:177-178`의 `--font-body-latin`/`--font-body-th` 패턴대로 `--font-body-ar` 신설 + `html[lang='ar']` 바인딩이 필요하다(커밋 `3f0c5e1f`가 고친 "Times 폴백으로 통째 드롭" 결함이 아랍어에서 재현될 자리).
7. 콘텐츠 분량: `src/data/international-guidance-content.ts`의 로케일 블록은 각 **≈495줄**(`:117 vi` / `:612 id` / `:1107 th` / `:1602 fil`), 페이지키 **10개**(`src/lib/public-guidance.ts:25-36`), FAQ **로케일당 8문항**(`:430/:925/:1420/:1915` 각 블록 8 `question:`).
8. 테스트 카운트 갱신: `toHaveLength(8)`/`toHaveLength(4)` 형태의 하드 카운트가 **최소 14곳**(§4). 특히 `src/components/__tests__/guidance-home-design-parity.test.tsx:208`의 `availableLanguage … toHaveLength(4)`는 **바꾸면 안 되는** 함정이다(상담 언어 4개 고정).
9. **절대 넓히면 안 되는 계약 2개**: `src/lib/seo.ts:836 GUIDANCE_CONSULTATION_LANGUAGES`와 `src/lib/consultation/intake-language-contract.ts:15 CONSULTATION_LANGUAGES`. 안내 언어(페이지 언어)와 상담 언어(en/zh-Hant/ja/ko)는 분리 유지.
10. 칼럼은 phase 2로 미뤄도 안전함이 코드로 확인됨: `src/lib/columns.ts:75-77`이 안내 로케일에 한해 디렉터리 부재 시 `null`을 반환(다른 로케일은 `throw`), `src/lib/column-locales.ts:20 OPTIONAL_COLUMN_LOCALES`가 안내 로케일을 선택적으로 표시. 단 `src/lib/column-locales.ts:9`가 `Record<PublicLocale8, string>`이라 **`ar:` 키 자체는 반드시 추가**해야 컴파일된다.

---

## §2 변경 지점 표

담당 WO 표기: **M2**=라우팅/상수, **M3**=콘텐츠, **M2-SEO**=SEO 표면, **M3-폼**=문의 폼/스키마, **M2-RTL**=RTL 신규 작업.

### A. 코어 상수·타입 (`src/lib/public-guidance.ts`)

| # | 파일 | 줄 | 현재 코드 | ar 추가 시 변경 | 위험 | WO |
|---|------|----|-----------|----------------|------|-----|
| 1 | src/lib/public-guidance.ts | 9 | `export const GUIDANCE_LOCALES_4 = ['vi', 'id', 'th', 'fil'] as const;` | `'ar'` 추가(4→5). 상수명이 실제와 어긋남 → 개명 여부는 §5 미확인 | H | M2 |
| 2 | src/lib/public-guidance.ts | 13-22 | `PUBLIC_LOCALES_8 = ['ko','zh-hant','en','ja','vi','id','th','fil']` | `'ar'` 추가(8→9). 스위처·sitemap·`generateStaticParams`가 여기서 파생 | H | M2 |
| 3 | src/lib/public-guidance.ts | 61-70 | `PUBLIC_LANGUAGE_AUTONYMS: Record<PublicLocale8, string>` (`fil: 'Filipino'`) | `ar: 'العربية'` 추가. 미추가 시 타입 에러 | M | M3 |
| 4 | src/lib/public-guidance.ts | 72-80 | `type PublicDocumentLanguage = 'ko' \| … \| 'fil'` | `\| 'ar'` 추가 | M | M2 |
| 5 | src/lib/public-guidance.ts | 83 | `const PUBLIC_LOCALE_PATH_RE = /^\/(ko\|zh-hant\|en\|ja\|vi\|id\|th\|fil)(?=\/\|$)/i;` | `\|ar` 추가. 누락 시 `stripPublicLocaleFromPath`가 `/ar` 접두를 못 떼어 스위처 링크가 `/ko/ar/...`류로 깨짐 | H | M2 |
| 6 | src/lib/public-guidance.ts | 97-99 | `isGuidanceLocale4(value) { return value === 'vi' \|\| … \|\| value === 'fil'; }` | `\|\| value === 'ar'` 추가. 미들웨어 리라이트·chrome 분기·컬럼 선택성 전부가 이 함수 하나에 달림 | H | M2 |
| 7 | src/lib/public-guidance.ts | 101-109 | `isPublicLocale8` 이 `isGuidanceLocale4(value)` 로 위임 | 코드 변경 불필요(#6로 자동). 이름만 어긋남 | L | M2 |
| 8 | src/lib/public-guidance.ts | 115-117 | `publicDocumentLanguage: zh-hant→'zh-Hant', 그 외 그대로` | 변경 불필요(`ar`→`'ar'` 통과) | L | — |
| 9 | src/lib/public-guidance.ts | 363-365 | `hreflangTagForPublicLocale: zh-hant→'zh-Hant', 그 외 그대로` | 변경 불필요(`ar` BCP47 그대로). 지역 하위태그(`ar-AE` 등) 쓸지는 §5 | L | M2-SEO |
| 10 | src/lib/public-guidance.ts | 367-386 | `buildGuidanceCoreLanguageAlternates` 가 `PUBLIC_LOCALES_8` 순회 | 자동(9언어 + x-default). x-default 로직(383행 `en`/`ko`)은 그대로 | M | M2-SEO |

### B. 라우팅

| # | 파일 | 줄 | 현재 코드 | ar 추가 시 변경 | 위험 | WO |
|---|------|----|-----------|----------------|------|-----|
| 11 | src/middleware.ts | 318-319 | `'/:locale(vi\|id\|th\|fil)'`, `'/:locale(vi\|id\|th\|fil)/:path*'` | 두 줄 모두 `\|ar`. **누락 시 `/ar/*`가 미들웨어를 안 타 리라이트 없이 KO 폴드/404** | H | M2 |
| 12 | src/middleware.ts | 285-295 | `resolveGuidanceMiddlewareRewrite(pathname)` 호출부 | 변경 불필요(#6로 자동) | L | M2 |
| 13 | src/app/[locale]/layout.tsx | 62 | `return PUBLIC_LOCALES_8.map((locale) => ({ locale }));` | 자동(#2). 단 118행 `isGuidanceLocale4` 분기가 `guidanceContent[publicLocale]`(70행)을 읽으므로 **ar 콘텐츠 팩이 없으면 런타임 크래시** | H | M3 |
| 14 | src/app/[locale]/[[...slug]]/page.tsx | 60, 106, 142 | `buildGuidancePageMetadata(locale: GuidanceLocale4, …)` / `isGuidanceLocale4(params.locale)` | 자동(#6 + `GuidanceLocale` 유니온 #22) | L | M2 |
| 15 | src/app/[locale]/columns/page.tsx | 106, 147 | `if (isGuidanceLocale4(params.locale))` → `guidanceContent[locale].pages.columns` | 자동(#6) + ar 팩 필요 | M | M3 |
| 16 | src/app/[locale]/columns/[slug]/page.tsx | 80, 136, 162 | `isGuidanceLocale4(rawLocale)` / `guidanceContent[guidanceLocale]` | 자동(#6) + ar 팩 필요 | M | M3 |

### C. 폰트 · html lang/dir · RTL 신규

| # | 파일 | 줄 | 현재 코드 | ar 추가 시 변경 | 위험 | WO |
|---|------|----|-----------|----------------|------|-----|
| 17 | src/app/fonts.ts | 82 | `export type DocumentLanguage = 'ko' \| … \| 'fil';` | `\| 'ar'` 추가 | M | M2 |
| 18 | src/app/fonts.ts | 1-10, 67-80 | `next/font/google` 에서 KR/JP/TC/Thai/Latin 만 import. 아랍 글립 **0** | `Noto_Sans_Arabic`(또는 `Noto_Naskh_Arabic`) import + `--font-noto-sans-arabic-loaded` 변수 신설 | H | M3 |
| 19 | src/app/fonts.ts | 98-113 | `getLocaleFontClassName`: `th` → thai, `vi\|id\|fil` → latin, 그 외 KR | `if (language === 'ar') return arabicFontClassName;` 분기 추가. 누락 시 KR 페어로 폴백 → 아랍 글립 미로딩 | H | M3 |
| 20 | src/app/fonts.ts | 115-127 | `getManagedLocaleFontClassNames()` 배열 5종 | arabic 클래스 추가. `src/app/__tests__/fonts.test.ts:67-68`의 `toHaveLength(8)`가 깨짐 | M | M2 |
| 21 | src/app/globals.css | 177-178 | `--font-body-latin: var(--font-noto-sans-latin-loaded, 'Noto Sans'), …;` `--font-body-th: …` | 같은 패턴으로 `--font-body-ar` / `--font-heading-ar` 신설(**인라인 폴백 필수** — 커밋 `3f0c5e1f`가 고친 결함) | H | M3 |
| 22 | src/app/globals.css | 209-218 | `html[lang='vi'], html[lang='id'], html[lang='fil'] { --font-body: var(--font-body-latin); … }` | `html[lang='ar'] { … }` 블록 신설(6개 토큰 재바인딩) | H | M3 |
| 23 | src/app/globals.css | 597-605 | `.site[data-locale='vi'], … { --font-body: … }` | `.site[data-locale='ar'] { … }` 블록 신설 | H | M3 |
| 24 | src/app/globals.css | 5819-5860 | 안내 4언어 한정 데스크톱 헤더 압축(`html[lang='vi'\|'id'\|'th'\|'fil'] .header-main-inner / .nav-list / .nav-link / .header-actions / .nav-cta.button`) | ar 헤더 폭 실측 후 합류 여부 결정(아랍어 메뉴 길이 미측정) | M | M2-RTL |
| 25 | **src/app/layout.tsx** | **65** | `<html lang={language} className={fontClassName} suppressHydrationWarning>` — **`dir` 속성 없음** | `dir={language === 'ar' ? 'rtl' : 'ltr'}` 추가. **신규 작업, 선례 0** | H | M2-RTL |
| 26 | **src/components/DocumentLocaleSync.tsx** | **56** | `root.lang = nextState.language;` — `root.dir` 미설정 | 클라이언트 전환 시에도 `root.dir` 동기화 필요. 미적용 시 안내 로케일 간 이동에서 dir가 고착 | H | M2-RTL |
| 27 | src/components/CinematicRouteShell.tsx | 43-48 | `<div className="site" data-locale={locale} …>` | `dir` 2차 앵커를 둘지(= CSS 셀렉터 기준을 `html[dir]`로 할지 `.site[dir]`로 할지) 결정 필요 | M | M2-RTL |

### D. Chrome · 스위처 · 라벨

| # | 파일 | 줄 | 현재 코드 | ar 추가 시 변경 | 위험 | WO |
|---|------|----|-----------|----------------|------|-----|
| 28 | src/lib/public-site-chrome.ts | 30-32 | `chromeSiteLocale = isGuidanceLocale4(locale) ? 'en' : locale` | 자동(#6). ar도 영어 chrome 구조 차용 | L | M2 |
| 29 | src/lib/public-site-chrome.ts | 60-91, 94-104, 115-121, 124-133, 140-146, 149-160 | 6개 함수 전부 `guidanceContent[locale]` / `guidanceFooterCopy[locale]` 참조 | 코드 변경 불필요, **ar 데이터 팩이 전제** | H | M3 |
| 30 | src/data/international-guidance-content.ts | 20 | `export type GuidanceLocale = 'vi' \| 'id' \| 'th' \| 'fil';` | `\| 'ar'` 추가 | H | M3 |
| 31 | src/data/international-guidance-content.ts | 116 (+ 신규 블록) | `guidanceContent: Record<GuidanceLocale, GuidanceLocaleContent>` — 로케일당 ≈495줄(`:117/:612/:1107/:1602`) | `ar:` 블록 신설. 필드: `languageName`·`nav`(10키)·`contactCta`·`footerNotice`·`skipLink`·`menuLabel`·`languageLabel`·`mega`(5키×2)·`notFoundTitle`·`notFoundText`·`backHomeLabel`·`readSourceLabel`·`home`(16필드, 인터페이스 63-86)·`pages`(10키, 각 eyebrow/title/description/intro/sections/faqs) + **FAQ 8문항** | H | M3 |
| 32 | src/data/international-guidance-offices.ts | 41 | `guidanceOfficeCopy: Record<GuidanceLocale, GuidanceOfficeCopy>` (`:42 vi … :117 fil`) | `ar:` 블록(≈25줄) 추가 | M | M3 |
| 33 | src/data/international-guidance-offices.ts | 166 | `guidanceFooterCopy: Record<GuidanceLocale, GuidanceFooterCopy>` (`:167 vi … :200 fil`) | `ar:` 블록(≈11줄) 추가 | M | M3 |
| 34 | src/data/international-guidance-team.ts | 126 | `guidanceTeamCopy: Record<GuidanceLocale, GuidanceTeamCopy>` (`:127/:155/:183/:211`) | `ar:` 블록(≈28줄) 추가 | M | M3 |
| 35 | src/data/international-guidance-team.ts | 250-254 | `guidanceLanguageNames: Record<GuidanceLocale, Record<string,string>>` | `ar: { Korean:…, Chinese:…, Japanese:… }` 추가 | M | M3 |
| 36 | src/data/international-guidance-team.ts | 276 | `guidancePracticeAreaNames: Record<GuidanceLocale, …>` (`:277/:285/:293/:301`) | `ar:` 블록 추가 | M | M3 |
| 37 | src/data/international-guidance-team.ts | 364-368 | `guidanceTeamBios: Record<…>` (`:368 vi … :545 fil`, 로케일당 ≈59줄) | `ar:` 블록 추가 | M | M3 |
| 38 | src/data/international-guidance-answers.ts | 39-42 | `guidanceAnswers: Record<GuidanceLocale, Partial<Record<GuidancePageKey, GuidanceAnswer>>>` (`:43 vi … :139 fil`) | `ar:` 블록 추가(answer 40-80단어 + sources) | M | M3 |
| 39 | src/data/international-inquiry-copy.ts | 15-23 | `type InquiryCopyLocale = 'ko' \| … \| 'fil'` | `\| 'ar'` 추가 | H | M3-폼 |
| 40 | src/data/international-inquiry-copy.ts | 81/171/220/269/319/369/418 | 로케일별 카피 블록 (ko/en/ja/vi/id/th/fil — **zh-hant 키 없음**) | `ar:` 블록(≈50줄) 추가. `unavailableLanguageNotice`(스위처가 `PublicLanguageSwitcher.tsx:42-45`, `LocaleFlagSwitcher.tsx:63`에서 읽음) 포함 필수 | H | M3-폼 |
| 41 | src/data/team-name.ts | 21-29 | `TEAM_NAME_BY_LOCALE: Record<PublicLocale8, string>` | `ar:` 키 추가(미추가 시 타입 에러) | L | M3 |
| 42 | src/components/decorative-video-controls.ts | 9-53 | `DECORATIVE_VIDEO_CONTROL_LABELS … satisfies Record<PublicLocale8, DecorativeVideoControlLabels>` (`:48 fil`) | `ar:` 블록 추가(미추가 시 **컴파일 에러**) | M | M3 |
| 43 | src/components/CinematicOpening.tsx | 418-429 (`:496 fil`) | `CINEMATIC_OPENING_COPY: Record<PublicLocale8, {primary,secondary,scroll,skip,mediaAlt,service,contact}>` | `ar:` 블록 추가(7필드). 오프닝 애니메이션은 `CinematicRouteShell.tsx:40`에서 전 로케일 홈에 적용 | M | M3 |
| 44 | src/components/LocaleFlagSwitcher.tsx | 29-32 | `LOCALE_FLAG_OPTIONS = PUBLIC_LOCALES_8.map(…)` | 자동(#2). 드롭다운 항목 9개로 증가 → 레이아웃 실측 필요 | M | M2 |
| 45 | src/components/LocaleFlagSwitcher.tsx | 46-51 | `switcherGroupLabel`: guidance면 `guidanceContent[locale].languageLabel`, 아니면 `switcherLabels[locale]`(SiteLocale 4개) | 자동(#6 + ar 팩) | L | M3 |
| 46 | src/components/PublicLanguageSwitcher.tsx | 32-45 | `PUBLIC_LOCALES_8.map(…)` + `internationalInquiryCopy[locale].unavailableLanguageNotice` | 자동(#2, #40) | M | M3 |
| 47 | src/components/Header.tsx | 258-259, 306, 442-445, 495, 520, 764 | `isGuidanceLocale4(locale)` 분기 6곳 | 자동(#6) | L | M2 |
| 48 | src/components/Footer.tsx | 85-86, 99-100, 131 | `publicSiteContent` / `guidanceFooterCopy[locale]` / `guidanceOfficeCopy[locale]` | 자동(#6, #32, #33) | L | M2 |
| 49 | src/components/MobileNavDrawer.tsx | 47-48 | `publicSiteContent(locale)` / `isGuidanceLocale4(locale)` | 자동. 단 드로어 슬라이드 방향이 RTL에서 반전 필요 | M | M2-RTL |

### E. SEO

| # | 파일 | 줄 | 현재 코드 | ar 추가 시 변경 | 위험 | WO |
|---|------|----|-----------|----------------|------|-----|
| 50 | src/app/sitemap.ts | 81-84 | `isGuidanceLocaleHreflang: lower === 'vi' \|\| 'id' \|\| 'th' \|\| 'fil'` | `\|\| lower === 'ar'` 추가. 누락 시 `reconcileGuidanceLanguageAlternates`(110-152)가 존재하지 않는 ar 대체 URL을 거르지 못함 | H | M2-SEO |
| 51 | src/app/sitemap.ts | 86-103 | `appendGuidanceLocaleSitemapEntries` 가 `GUIDANCE_LOCALES_4 × GUIDANCE_PAGE_KEYS` 순회 | 자동(#1) → +10 URL | L | M2-SEO |
| 52 | src/app/sitemap.ts | 53, 66, 246, 251 | `PublicLocale8` / `isPublicLocale8` 사용 | 자동(#2,#6) | L | M2-SEO |
| 53 | src/lib/seo.ts | 143-148 | `guidanceOpenGraphLocale: Record<string, string> = { vi:'vi_VN', id:'id_ID', th:'th_TH', fil:'fil_PH' }` | `ar: 'ar_AE'` 등 추가. `Record<string,…>`라 타입 에러는 안 나고 **조용히 `en_US`로 폴백**(156행) — 무증상 결함 | M | M2-SEO |
| 54 | src/lib/seo.ts | 207-210 | `getLocaleLanguageTag` | 변경 불필요 | L | M2-SEO |
| 55 | src/lib/seo.ts | 252-259 | `getLanguageAlternates` → 코어 경로면 `buildGuidanceCoreLanguageAlternates` | 자동(#10) | L | M2-SEO |
| 56 | **src/lib/seo.ts** | **836** | `GUIDANCE_CONSULTATION_LANGUAGES = ['en','zh-Hant','ja','ko']` (주석 830-835: "must never grow to include a guidance locale") | **변경 금지.** `ar` 추가는 답변엔진에 "아랍어 상담 가능" 약속으로 읽힘 | H | — |
| 57 | src/lib/seo.ts | 168 | `organizationLanguageTags = ['ko','zh-Hant','en','ja']` | 변경 금지(동일 사유) | H | — |
| 58 | src/lib/llms-txt.ts | 334-339 | `GUIDANCE_CATALOG_LANGUAGE_NAMES: Record<GuidanceLocale4, string>` | `ar: 'Arabic'` 추가(미추가 시 타입 에러) | M | M2-SEO |
| 59 | **src/lib/llms-txt.ts** | **354-356** | `if (localeEntries.length !== 4 \|\| guidanceEntries.length !== 4) { throw new Error('… exactly four site locale catalogs and four guidance catalogs'); }` | **하드 4 가드 → 5로 갱신 필수. 미갱신 시 루트 llms.txt 생성이 런타임 throw** | H | M2-SEO |
| 60 | src/lib/llms-txt.ts | 487-534 | `GUIDANCE_LLMS_NOTICES: Record<GuidanceLocale4, GuidanceLlmsNotices>` (`:488 vi … :512 fil`) | `ar:` 3문(consultation/discovery/confidential) 추가. `buildGuidanceLlmsTxt`(531-536)가 없으면 throw | M | M2-SEO |
| 61 | src/app/[locale]/llms.txt/route.ts | 16-25 | `contentLanguage: Record<PublicLocale8, string>` | `ar: 'ar'` 추가(미추가 시 타입 에러) | M | M2-SEO |
| 62 | src/app/[locale]/llms.txt/route.ts | 29-31 | `generateStaticParams` = `[...siteLocales, ...GUIDANCE_LOCALES_4]` | 자동(#1) | L | M2-SEO |
| 63 | src/lib/guidance-structured-data.ts | 54, 81-93 | `buildGuidancePersonJsonLd(locale: GuidanceLocale)` / `guidanceTeamCopy[locale]` | 자동(#30, #34) | L | M2-SEO |
| 64 | src/app/robots.ts | 54, 80-87 | 로케일 목록은 `locales`(빌더 3종)만 사용, 안내 로케일 언급 없음 | 변경 불필요 | L | — |
| 65 | src/app/sitemap-lastmod.ts | 80-82 | `guidancePageKeyToStaticPath(pageKey)` — 로케일 무관 | 변경 불필요 | L | — |

### F. 칼럼 (phase 2 — 동작만 확인)

| # | 파일 | 줄 | 현재 코드 | ar 추가 시 변경 | 위험 | WO |
|---|------|----|-----------|----------------|------|-----|
| 66 | src/lib/column-locales.ts | 9-18 | `COLUMN_CONTENT_DIR_BY_LOCALE: Record<PublicLocale8, string>` (`fil: 'src/content/columns-fil'`) | `ar: 'src/content/columns-ar'` **키만 추가**(타입 강제). 디렉터리는 안 만들어도 됨 | M | M2 |
| 67 | src/lib/column-locales.ts | 20 | `OPTIONAL_COLUMN_LOCALES = GUIDANCE_LOCALES_4` | 자동(#1) → ar이 선택적 로케일로 편입 | L | M2 |
| 68 | src/lib/columns.ts | 68-85 | `getColumnsDir`: `isGuidanceLocale4(locale)` 이면 `fs.existsSync(dir) ? dir : null`, 아니면 부재 시 `throw` | **변경 불필요 — "파일 없으면 노출 안 됨"이 코드로 보장됨** | L | — |
| 69 | src/lib/columns.ts | 333-336, 343 | `publicColumnSlugsByLocale(): Record<PublicLocale8, string[]>` = `PUBLIC_LOCALES_8` 순회 | 자동 → ar은 빈 배열 | L | — |
| 70 | src/content/ | — | `columns-{en,fil,id,ja,th,vi,zh}` 7개 존재, `columns-ar` **없음** | phase 2까지 생성 안 함 | L | phase2 |

### G. 상담 / 문의 폼

| # | 파일 | 줄 | 현재 코드 | ar 추가 시 변경 | 위험 | WO |
|---|------|----|-----------|----------------|------|-----|
| 71 | src/lib/consultation/intake-language-contract.ts | 4-13 | `PUBLIC_INQUIRY_LOCALES = ['ko','zh-hant','en','ja','vi','id','th','fil']` | `'ar'` 추가. 22행 `uiLocale: z.enum(PUBLIC_INQUIRY_LOCALES)` → **미추가 시 /ar 폼 제출이 400** | H | M3-폼 |
| 72 | **src/lib/consultation/intake-language-contract.ts** | **15** | `CONSULTATION_LANGUAGES = ['en','zh-hant','ja','ko']` (24-27행 `preferredConsultationLanguage` enum 소스) | **변경 금지** | H | — |
| 73 | src/lib/consultation/international-inquiry-store.ts | 55, 63 | `internationalInquiryInputSchema` / `storedPayloadSchema` 가 `inquiryLanguageSchema` 파생 | 자동(#71) | L | M3-폼 |
| 74 | src/app/api/consultation/international/route.ts | 6-11 | 스토어 스키마 재사용, 자체 로케일 리터럴 없음 | 변경 불필요 | L | — |
| 75 | src/components/InternationalInquiryForm.tsx | 14, 55, 62, 145, 208, 214, 489 | `InquiryCopyLocale` 타입 + `lang={locale}` 속성 | 타입은 자동(#39). **`lang`만 있고 `dir` 없음 → 아랍어 입력 필드 정렬 반전 필요** | M | M3-폼 / M2-RTL |
| 76 | src/lib/consultation/public-contact.ts | 12, 99-160 | `Record<SiteLocale, …>` 4언어 전용, `getConsultationCtaLabel` 등 ko/zh-hant/ja 분기 후 영어 폴백 | 변경 불필요(ar은 `chromeSiteLocale`→`en` 폴백) | L | — |

### H. 검증 스크립트

| # | 파일 | 줄 | 현재 코드 | ar 추가 시 변경 | 위험 | WO |
|---|------|----|-----------|----------------|------|-----|
| 77 | scripts/verify-multilingual-live.mjs | 25-34 | `PUBLIC_LOCALES_8 = Object.freeze([… 'fil'])` (TS 미임포트, **값 인라인 복제**) | `'ar'` 추가 — 소스와 수동 동기화 필요 | M | M2-SEO |
| 78 | scripts/verify-multilingual-live.mjs | 37 | `GUIDANCE_LOCALES_4 = Object.freeze(['vi','id','th','fil'])` | `'ar'` 추가 | M | M2-SEO |
| 79 | scripts/verify-multilingual-live.mjs | 437 | `c_hreflang: emptyCheck('c', 'hreflang 8 locales + x-default')` | 라벨 9로 갱신. 실제 기대치는 116-118행에서 배열 파생이라 자동 | L | M2-SEO |
| 80 | scripts/verify-multilingual-live.mjs | 80-84, 509-516 | `hreflangTagForPublicLocale` / `publicDocumentLanguage` 로컬 복제 | ar 통과 확인만(zh-hant 외 패스스루) | L | M2-SEO |
| 81 | scripts/check-column-translation.mjs | 27 | `export const GUIDANCE_LANGS = ['vi','id','th','fil'];` | phase 2에서 `'ar'` 추가 | M | phase2 |
| 82 | scripts/check-column-translation.mjs | 83, 127, 134, 152, 186, 219, 235, 246, 1386, 1494 | `fil:` 키를 가진 언어별 테이블 10종(국적어·언어명 정규식·구분자·불용어·근사어·대수 정규식·서수 등) | 각각 `ar:` 엔트리 필요 | M | phase2 |
| 83 | scripts/check-column-translation.mjs | 495-500 | `WORD_NUMERAL_LEXICONS = { vi: buildViLexicon(), id:…, th:…, fil: buildFilLexicon() }` (빌더 `:276/:321/:368/:422`) | `buildArLexicon()` 신설. **아랍-인도 숫자(٠-٩) 처리는 선례 없음** | M | phase2 |
| 84 | scripts/check-column-translation.mjs | 33-34 | `HAN_RE = /\p{Script=Han}/u`, `LATIN_LETTER_RE = /\p{Script=Latin}/u` — **Arabic 스크립트 정규식 없음** | `/\p{Script=Arabic}/u` 추가 필요 | M | phase2 |
| 85 | scripts/check-column-translation.mjs | 1233 | `if (lang === 'fil') return warn('english', details);` — 라틴 표기 언어 완화 | ar은 비라틴 → 영어 혼입 검출이 엄격 적용됨(완화 불필요) | L | phase2 |
| 86 | scripts/check-column-translation.d.ts:15 / .d.mts:15 | 15 | `export type ColumnTranslationLang = 'vi' \| 'id' \| 'th' \| 'fil';` | 두 파일 모두 `\| 'ar'` | L | phase2 |
| 87 | scripts/check-guidance-country-mentions.mjs | 47 | `export const GUIDANCE_LOCALES = ['vi','id','th','fil'];` | `'ar'` 추가 | M | M3 |
| 88 | scripts/check-guidance-country-mentions.mjs | 36-45, 58-70 | `GUIDANCE_DATA_FILES` 5개 + `GUIDANCE_COUNTRY_TOKENS`(독자 국가명을 4개 안내언어+영어로 나열) | 독자 국가 토큰의 **아랍어 표기** 추가 + ar 독자 국가(§5 미확정) 추가 | M | M3 |
| 89 | scripts/check-guidance-country-mentions.d.ts:9 / .d.mts:9 | 9 | `export type GuidanceLocale = 'vi' \| 'id' \| 'th' \| 'fil';` | 두 파일 모두 `\| 'ar'` | L | M3 |

**표 합계: 89행** (WO 완료 기준 30행 초과).

---

## §3 RTL 실태

### 3.1 dir 설정 현황 — **전무 (0건)**

| 근거 명령 | 결과 |
|---|---|
| `grep -rnw "rtl" src scripts tests` | **무출력** |
| `grep -rn 'dir="\|dir={' src --include="*.tsx"` | **무출력** |
| `grep -rn "direction:" src/app/globals.css` | 전부 `flex-direction` (`:1043`, `:1496`, `:1598`, `:1753` …). CSS `direction` 속성 사용 **0건** |
| `src/app/layout.tsx:65` | `<html lang={language} className={fontClassName} suppressHydrationWarning>` — `dir` 없음 |
| `src/components/DocumentLocaleSync.tsx:56-57` | `root.lang = …; root.className = …;` — `root.dir` 없음 |
| `src/components/LocaleSetter.tsx:8` | `document.documentElement.lang = …` — `dir` 없음 |
| `src/components/CinematicRouteShell.tsx:43-48` | `.site` 래퍼에 `data-locale`만, `dir` 없음 |

즉 `ar` 추가 시 RTL은 **기존 패턴 차용이 불가능한 신규 작업**이다.

### 3.2 좌우 하드코딩 개수 (공개 표면 CSS)

`grep -c` 실측. `left:`/`right:` 는 `(^|[;{ ])left:` 패턴(= `flex`/`border-left` 오탐 제외).

| 파일 | `text-align:left` | `text-align:right` | `margin-left` | `margin-right` | `padding-left` | `padding-right` | `border-left` | `border-right` | `left:` | `right:` | 합계 | `translateX` |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| src/app/globals.css (26,073줄) | 35 | 2 | 34 | 25 | 27 | 10 | 18 | 5 | 102 | 78 | **336** | 34 |
| src/components/HomeEditorial.module.css | 3 | 0 | 1 | 1 | 0 | 0 | 1 | 0 | 4 | 5 | 15 | 0 |
| src/components/PublicChrome.module.css | 0 | 0 | 3 | 6 | 0 | 0 | 0 | 0 | 1 | 0 | 10 | 0 |
| src/components/PricingCards.module.css | 5 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 1 | 0 | 7 | 0 |
| src/components/IntentLandingPage.module.css | 5 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 6 | 0 |
| src/components/ColumnsGrid.module.css | 2 | 0 | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 4 | 0 |
| src/components/InternationalInquiryForm.module.css | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 0 | 3 | 0 |
| src/components/LocaleFlagSwitcher.module.css | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 2 | 3 | 0 |
| src/app/[locale]/columns/[slug]/ColumnDetail.module.css | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 2 | 0 |
| src/components/InternationalGuidance.module.css | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| src/components/FAQAccordion.module.css | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| src/components/Breadcrumbs.module.css | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| src/app/column-typography.css | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **합계(위 13개 파일)** | 52 | 2 | 38 | 32 | 31 | 11 | 23 | 5 | 109 | 85 | **388** | 34 |

### 3.3 논리속성 도입 현황 (globals.css)

| 속성 | 건수 |
|---|---|
| `margin-inline` | 21 |
| `padding-inline` | 40 |
| `inset-inline` | **0** |
| `border-inline` | **0** |
| `text-align: start` | **0** |

→ 인라인 마진/패딩은 부분적으로 논리속성이 들어와 있으나, **위치(`left:`/`right:`)·테두리·정렬은 논리속성 전환이 전혀 시작되지 않았다.**

### 3.4 최소 대응안 (추정 — 실측 렌더 없이 산정)

| 단계 | 범위 | 근거/규모 |
|---|---|---|
| R0 (필수) | `src/app/layout.tsx:65`에 `dir` 추가 + `src/components/DocumentLocaleSync.tsx:56`에서 `root.dir` 동기화 | 2파일·2줄. 이것만으로 본문 텍스트 흐름·목록 마커·기본 폼 정렬은 브라우저가 반전 |
| R1 (텍스트 정렬) | `text-align: left` **52건** → `text-align: start`, `text-align: right` **2건** → `end` | 전량 기계적 치환 가능. 단 의도적 좌정렬(숫자/코드)은 개별 판정 필요 |
| R2 (인라인 여백·테두리) | `margin-left/right` **70건** → `margin-inline-start/end`, `padding-left/right` **42건** → `padding-inline-*`, `border-left/right` **28건** → `border-inline-*` | 합계 **140건**. 대부분 globals.css(34+25+27+10+18+5=119건) |
| R3 (절대위치) | `left:`/`right:` **194건** → `inset-inline-start/end` | 가장 큰 덩어리. 전량 전환 대신 **`[dir='rtl']` 오버라이드 블록으로 국소 대응**이 현실적 — 실제 깨지는 건 헤더/드로어/스위처/스크롤탑/FAQ 화살표처럼 화면 가장자리에 고정된 소수 |
| R4 (변환) | `translateX` **34건**(globals.css) | RTL에서 방향 반전 필요 여부를 케이스별 판정. 슬라이드 인/아웃 애니메이션(모바일 드로어 `MobileNavDrawer.tsx`)이 주 대상 |
| R5 (제외) | `src/components/builder/**` CSS(예: `SandboxPage.module.css` 10,510줄) | 빌더/관리 화면은 안내 로케일 공개 표면이 아님. **미조사 — §5** |

**추정 최소 범위**: R0(2줄) + R1(54건) + R2 중 헤더/푸터/카드/폼 한정분 + R3의 `[dir='rtl']` 국소 오버라이드. 전면 논리속성 전환(388건 전량)은 아랍어 1개 로케일 대비 과투자로 보이나, **실제 필요 범위는 렌더 실측 없이는 확정 불가**(§5).

---

## §4 테스트 갱신 목록

로케일 집합/카운트를 단언하는 파일 **34개**(`grep -rln "GUIDANCE_LOCALES_4\|PUBLIC_LOCALES_8\|isPublicLocale8\|GuidanceLocale\|'fil'" src scripts tests | grep -E "__tests__|\.test\.|playwright"`).

### 4.1 하드 카운트 (반드시 숫자 갱신)

| 파일 | 줄 | 현재 단언 | ar 후 |
|---|---|---|---|
| src/lib/__tests__/public-guidance.test.ts | 49 | `expect(PUBLIC_LOCALES_8).toHaveLength(8)` | 9 |
| src/lib/__tests__/public-guidance.test.ts | 50 | `expect(GUIDANCE_LOCALES_4).toEqual(['vi','id','th','fil'])` | +`'ar'` |
| src/lib/__tests__/public-guidance.test.ts | 74-75 | `autonyms).toHaveLength(8)` / `new Set(autonyms).size).toBe(8)` | 9 / 9 |
| src/lib/__tests__/public-guidance.test.ts | 457-458 | `isPublicLocale8('fil')).toBe(true)` / `('fr')).toBe(false)` | `'ar'` true 케이스 추가 |
| src/app/__tests__/sitemap.test.ts | 507 | `expect(GUIDANCE_LOCALES_4).toHaveLength(4)` | 5 |
| src/app/__tests__/sitemap.test.ts | 406-407 | `['ko','zh-hant','en','ja','vi','id','th','fil']` 순회 + `toHaveLength(8)` | 9 |
| src/app/__tests__/sitemap.test.ts | 429 | 7언어 리스트 (en 제외) | +ar |
| src/app/__tests__/sitemap.test.ts | 40 | `['vi','id','th','fil'].reduce(...)` 번역 칼럼 카운트 | +ar (phase2) |
| src/app/__tests__/sitemap.test.ts | 323, 496 | `.not.toHaveProperty('fil')` | ar 동등 단언 추가 |
| src/app/__tests__/fonts.test.ts | 67-68 | `managed).toHaveLength(8)` / `Set(managed).size).toBe(8)` | 아랍 폰트 변수 수만큼 증가 |
| src/app/__tests__/fonts.test.ts | 102, 104-105 | `getLocaleFontClassName('fil')` / `documentLanguages … toHaveLength(8)` | ar 케이스 + 9 |
| src/components/__tests__/reveal-lifecycle.test.ts | 344-347 | `managed).toHaveLength(8)` / `documentLanguages).toHaveLength(8)` | 동일 갱신 |
| src/lib/__tests__/global-seo-locale-integrity.test.ts | 143-146 | 동일 패턴 | 동일 갱신 |
| src/app/[locale]/__tests__/llms-discovery.test.tsx | 231-233 | `catalogUrls).toHaveLength(8)` (루트 llms.txt 카탈로그) | 9 |
| src/lib/__tests__/multilingual-seo.test.ts | 21 | `Object.keys(expected).filter(tag => tag!=='x-default')).toHaveLength(8)` | 9 |
| src/lib/__tests__/multilingual-seo.test.ts | 66 | `.not.toHaveProperty('fil')` | ar 동등 단언 |
| src/lib/__tests__/international-guidance-answers.test.ts | 156 | `expect(GUIDANCE_LOCALES_4).toHaveLength(4)` | 5 |
| src/components/__tests__/locale-flag-switcher.test.tsx | 120, 148 | `links).toHaveLength(PUBLIC_LOCALES_8.length)` | 자동 |
| src/components/__tests__/locale-flag-switcher.test.tsx | 217 | `fallbackLinks).toHaveLength(4)` | 5 |
| src/lib/consultation/__tests__/intake-language-contract.test.ts | 33 | `uiLocales).toEqual(['ko','zh-hant','en','ja','vi','id','th','fil'])` | +`'ar'` |

### 4.2 함정 — **바꾸면 안 되는 카운트**

| 파일 | 줄 | 단언 | 이유 |
|---|---|---|---|
| src/components/__tests__/guidance-home-design-parity.test.tsx | 208 | `expect(availableLanguage, \`${locale} consultation language count\`).toHaveLength(4)` | 상담 언어 4개(en/zh-Hant/ja/ko) 고정. `src/lib/seo.ts:836` 계약 |
| src/lib/llms-txt.ts | 354 | `localeEntries.length !== 4` (사이트 로케일) | 사이트 로케일은 계속 4개. **guidance 쪽 `!== 4`만** 5로 |

### 4.3 로케일 배열 리터럴 (`'ar'` 추가)

| 파일 | 줄 |
|---|---|
| src/lib/__tests__/guidance-chrome-language.test.ts | 7 (`const GUIDANCE = ['vi','id','th','fil']`) |
| src/data/__tests__/guidance-disclosure-parity.test.ts | 39 |
| src/data/__tests__/guidance-team-bios.test.ts | 58 |
| src/data/__tests__/guidance-office-facts-sync.test.ts | 38 |
| src/data/__tests__/international-guidance-privacy-disclosure.test.ts | 13 (`PENDING_CONFIRMATION: Record<GUIDANCE_LOCALES_4[number], RegExp>`), 72 |
| src/data/__tests__/guidance-country-mentions.test.ts | 61, 77, 81, 98, 112 |
| src/data/__tests__/site-remediation-content.test.ts | 228 |
| src/data/__tests__/column-alternate-expectations.ts | 24-33 (`HREFLANG_TAG_BY_LOCALE: Record<PublicLocale8,…>` — 타입 강제), 72 |
| src/lib/__tests__/columns-new-four-locales.test.ts | 124, 143, 151, 169 |
| src/components/__tests__/public-module-locale-switcher.test.tsx | 41, 112 |
| src/components/__tests__/consultation-email-cta.test.tsx | 218 |
| src/components/__tests__/header-mega-intro.test.tsx | 70 |
| src/components/__tests__/locale-flag-switcher.test.tsx | 68 (`['fil','Filipino']`), 117, 122, 223, 269 |
| src/app/[locale]/llms.txt/__tests__/route.test.ts | 128-130, 265 |
| src/app/api/consultation/international/__tests__/route.test.ts | 197, 212, 243 (`uiLocale: 'fil'` 픽스처) |
| src/lib/__tests__/guidance-jsonld.test.ts | 86-301 (전부 `it.each(GUIDANCE_LOCALES_4)` — 자동 확장) |

### 4.4 Playwright

| 파일 | 줄 | 내용 |
|---|---|---|
| tests/builder-editor/international-guidance.playwright.ts | 928-937 | `EXPECTED_OG_LOCALE: Record<PublicLocale8, string>` (`fil:'fil_PH'`) → `ar:` 필요(#53과 일치) |
| tests/builder-editor/international-guidance.playwright.ts | 190-192, 368, 397, 424, 443…1327 | `PUBLIC_LOCALES_8` / `GUIDANCE_LOCALES_4` 순회 20+곳 — 자동 확장(케이스 수 급증) |
| tests/builder-editor/locale-flag-switcher-visibility.playwright.ts | 78, 88 | `toHaveCount(PUBLIC_LOCALES_8.length)` — 자동 |
| tests/builder-editor/international-inquiry.playwright.ts | 40, 132, 177 | `InquiryCopy = typeof internationalInquiryCopy[PublicLocale8]` — 자동 |
| tests/builder-editor/new-four-columns.playwright.ts | 134, 156 | `['vi','id','th','fil']` 리터럴 — phase 2 |

### 4.5 스크립트 테스트

| 파일 | 줄 | 내용 |
|---|---|---|
| scripts/verify-multilingual-live.test.mjs | 69, 110, 217, 229, 272 | `PUBLIC_LOCALES_8` / `GUIDANCE_LOCALES_4` 순회 — #77/#78 갱신에 자동 연동 |
| scripts/check-column-translation.test.mjs | 137, 290-333, 555, 607-627, 693, 743 | `['vi','id','th','fil']` 리터럴 6곳 + `lang:'fil'` 픽스처 — phase 2 |

**신규 필요 테스트(제안, RTL)**: `dir='rtl'` 단언(레이아웃 렌더), 아랍 폰트 클래스 단언(`fonts.test.ts`), `ar` og:locale 단언. 현재 레포에 선례 없음.

---

## §5 미확인 항목

1. **`ar` 독자 국가/지역**: `scripts/check-guidance-country-mentions.mjs:58-70`의 `GUIDANCE_COUNTRY_TOKENS`는 독자 국가(베트남/인니/태국/필리핀/미국)를 4언어+영어로 나열한다. 아랍어권은 국가가 다수(UAE/사우디/이집트/…)라 **어느 국가를 "독자 국가"로 등록할지 정책 결정 필요**. 코드에서 결정 불가.
2. **og:locale 지역 하위태그**: `src/lib/seo.ts:143-148`은 `vi_VN`/`id_ID`/`th_TH`/`fil_PH`처럼 1언어=1국가. 아랍어는 `ar_AE`/`ar_SA`/`ar_EG` 중 선택 근거가 레포에 없음.
3. **hreflang 태그 형태**: `ar` 단독인지 `ar-AE` 등 지역 포함인지. `hreflangTagForPublicLocale`(`src/lib/public-guidance.ts:363-365`)는 `zh-hant→zh-Hant` 외 패스스루라 어느 쪽이든 동작하지만 정책 미정.
4. **아랍어 폰트 선택 및 next/font/google 가용성**: `Noto_Sans_Arabic` / `Noto_Naskh_Arabic` / `Noto_Kufi_Arabic` 중 어느 것인지, 설치된 next 버전의 `next/font/google`이 해당 폰트를 노출하는지 **빌드 금지라 미검증**. `src/app/fonts.ts:1-10`에는 아랍 폰트 import가 전혀 없다.
5. **상수 개명 여부**: `GUIDANCE_LOCALES_4`/`PUBLIC_LOCALES_8`/`isPublicLocale8`/`GuidanceLocale4`를 그대로 둘지(이름-실제 불일치) 개명할지. 개명 시 §4의 34개 테스트 파일 + `src` 비테스트 40개 파일의 **임포트까지 전부 touch** → 변경 범위가 수배로 커짐. 사용자/상위 WO 결정 필요.
6. **RTL 실제 파손 범위**: §3.4의 R1~R4 수치는 `grep -c` 정적 집계일 뿐, 실제로 아랍어 렌더에서 깨지는 지점은 **브라우저 렌더 없이 확정 불가**(본 WO는 빌드·실행 금지).
7. **빌더/관리 CSS**: `src/components/builder/**`(예: `SandboxPage.module.css` 10,510줄, `AiGeneratorWizard.module.css` 3,618줄)의 좌우 하드코딩은 **미집계**. 안내 로케일이 빌더 발행 페이지를 쓰는지 여부를 확인하지 않았다.
8. **아랍-인도 숫자 처리**: `scripts/check-column-translation.mjs`의 숫자 어휘집(`:495-500`)과 서수/대수 정규식(`:246`)은 라틴/태국 숫자만 가정. `٠١٢٣…` 표기를 쓸지 미정(phase 2).
9. **`zh-hant` 부재 패턴**: `src/data/international-inquiry-copy.ts`의 로케일 키는 ko/en/ja/vi/id/th/fil **7개**로 `zh-hant`가 빠져 있다(`:81/:171/:220/:269/:319/:369/:418`). 타입(`:15-23`)에는 `'zh-hant'`가 있는데 값이 없는 이유를 확인하지 않았다 — `ar` 추가 시 같은 함정에 빠질 수 있음.
10. **`GUIDANCE_PAGE_KEYS` 확장 여부**: MENA 대상으로 페이지 10개를 그대로 갈지, 추가/축소할지 미정(`src/lib/public-guidance.ts:25-36`).

---

## 부록 — 실행한 grep (재현용)

```
grep -rn "GUIDANCE_LOCALES_4\|PublicLocale8\|PUBLIC_LOCALES_8\|isPublicLocale8" src scripts tests
grep -rn "'fil'" src scripts tests
grep -rn "^\s*fil:" src scripts tests
grep -rn "Record<GuidanceLocale\|Record<PublicLocale8\|Record<PublicDocumentLanguage\|Record<InquiryLocale\|Record<DocumentLanguage" src scripts tests
grep -rnw "rtl" src scripts tests                       # 무출력
grep -rn 'dir="\|dir={' src --include="*.tsx"           # 무출력
grep -rn "direction:" src/app/globals.css               # flex-direction 만
grep -rn "html\[lang=\|data-locale=" src/app/globals.css
grep -c 'text-align:\s*left|right' / 'margin-left|right' / 'padding-left|right' /
        'border-left|right' / -E '(^|[;{ ])left:|right:' / 'margin-inline' /
        'padding-inline' / 'inset-inline' / 'border-inline' / 'translateX'   (파일별, §3.2)
grep -rln "GUIDANCE_LOCALES_4\|PUBLIC_LOCALES_8\|isPublicLocale8\|GuidanceLocale\|'fil'" src scripts tests | grep -E "__tests__|\.test\.|playwright"   # 34개
grep -rn "toHaveLength(8)\|toHaveLength(4)\|toBe(8)\|toBe(4)" src scripts tests
git show --stat 3f0c5e1f                                # 동남아 4언어 Times 폰트 복구 커밋
```
