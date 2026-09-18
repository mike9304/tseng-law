# `/en/faq` noindex 정책 — 2026-09-06

GROWTH 공용판이 SEO 팀에 FAQ 색인 검토를 맡긴 항목. **이번 사이클은 정책을 뒤집지 않는다.** 유지 근거와 해제 조건을 코드에 맞춰 고정한다.

## 현재 동작 [확정, 소스]

| 층 | 동작 | 위치 |
|---|---|---|
| 경로 분류 | `/faq`는 영어만 noindex 경로 | `src/lib/seo-visibility.ts` `isEnglishNoindexPath` |
| hreflang | `/faq`에서 `en` alternate 제거, x-default=`/ko/faq` | `src/lib/seo.ts` `getLanguageAlternates` |
| sitemap | 영어 FAQ URL 제외 | `src/app/sitemap.ts` |
| 페이지 메타 | JA는 파일 백 FAQ를 색인. EN fallback은 `noindex: locale === 'en'` | `src/app/[locale]/faq/page.tsx` `generateMetadata` |
| 빌더 게시본 | EN에 published FAQ가 있으면 **그 메타데이터가 fallback noindex보다 먼저** 반환됨 | 같은 파일 57–58행 |

즉 사이트맵·hreflang은 EN FAQ를 광고하지 않지만, 빌더가 `/en/faq`를 게시하면 robots noindex가 빠질 수 있다. 라이브 IndexNow에서도 GROWTH가 `/en/faq`를 제외했다(2026-09-06).

## 왜 영어만 막았나 [확정]

- JA `/ja/faq`는 파일 백 13문항·사실 테스트(`faq-content-ja-factual-consistency.test.ts`)가 있는 공개 페이지.
- EN `/faq`는 역사적으로 한·중 상담 카피 잔여·빌더 FAQ 초안과 겹쳐 **얇거나 로케일 불일치**로 분류된 English-noindex 집합(`/portfolio` `/events` `/store`와 같이)에 들어 있다. WO#3 주석: noindex URL을 hreflang에 넣으면 모순 신호.

## 2026-09 카피 품질 [확정, 이 브랜치]

`src/data/faq-content.ts` EN은 더 이상 “Korean national” 이혼 FAQ가 아니고, 상담 답에 English가 명시된다. 전용 한국어 랜딩(`/en/korean-lawyer-in-taiwan`)과 분리된 상태다. **품질이 나아졌다고 해서 색인이 자동으로 이득인 것은 아니다.** FAQPage 스키마를 영어 홈·인텐트 랜딩이 이미 쓰고, 별도 `/en/faq`를 열면 중복 FAQ 클러스터 위험이 있다.

## 판정 (이번 사이클)

**유지: `/en/faq` noindex.** 해제하려면 사용자 결정 + 빌더 게시 메타가 robots를 우회하지 않는지 확인 + sitemap/hreflang/IndexNow를 한 세트로 바꿔야 한다. 이 문서와 `isEnglishNoindexPath('/faq') === true` 테스트가 그 게이트다.

## 검증

```
npx vitest run src/lib/__tests__/seo-hreflang-locales.test.ts src/data/__tests__/en-faq-noindex-policy.test.ts
```
