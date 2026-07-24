# WO-I18N-CLIENT-DOCUMENT-LOCALE-SYNC — 국기 전환 후 문서 언어·폰트 동기화

Date: 2026-07-25 KST  
Manager: Codex `/root`

## 문제

직접 요청한 `/ko`, `/ja`, `/zh-hant`, `/en` 페이지는 request-aware root
layout 덕분에 올바른 `<html lang>`과 locale font class를 받는다. 그러나
Next.js `<Link>`로 국기 전환을 하면 root layout이 다시 마운트되지 않아,
본문과 URL만 바뀌고 이전 locale의 `lang` 및 font class가 남는다.

재현:

- KO → JP 클릭: URL/H1은 일본어지만 `<html lang="ko">`
- KO → TW 클릭: URL/H1은 번체중문이지만 `lang="ko"`이고 KO font classes

## 목표

- 모든 공개 locale layout 변경 뒤 `<html lang>`을 `ko`, `ja`,
  `zh-Hant`, `en` 중 현재 locale과 일치시킨다.
- locale별 next/font class도 현재 locale 쌍으로 교체한다.
- root SSR의 request-aware 초기값은 그대로 유지한다.
- unrelated `<html>` class는 보존하고, 관리하는 locale font class만
  제거·추가한다.
- 국기 순서·아이콘·코드·href·링크 동작은 변경하지 않는다.

## 허용 파일

1. `src/components/DocumentLocaleSync.tsx` (new)
2. `src/app/[locale]/layout.tsx`
3. `src/app/fonts.ts`
4. `src/components/__tests__/document-locale-sync.test.ts` (new)
5. `src/data/__tests__/site-remediation-content.test.ts`

작업자는 위 다섯 파일만 수정한다. stage, commit, push, deploy, 서버 조작을
하지 않는다.

## 구현 계약

- client component는 locale layout이 전달한 document language, target font
  classes, 전체 managed font classes를 `useEffect`에서 동기화한다.
- font class 변경은 KO/EN/JA 공용 KR pair와 ZH-Hant TC pair를 모두 알고
  이전 pair만 제거한 뒤 target pair를 추가한다.
- 기존에 `<html>`에 있던 locale font 이외 class는 보존한다.
- 중복 class를 만들지 않는다.
- `LocaleSetter`를 다시 사용하지 않는다. SSR 언어 처리를 대체하지 않고
  client navigation만 보완한다.
- locale layout은 `SiteLocale`을 올바른 BCP 47 document language로
  변환하여 component에 전달한다.

## 테스트 계약

- 순수 동기화 함수가 KO → ZH-Hant 전환 시 `lang`과 font pair를 교체한다.
- JA/EN/KO의 정확한 `lang`, 공용 KR pair, unrelated class 보존, 중복 제거를
  검증한다.
- locale layout wiring과 root request-aware SSR 계약이 함께 유지됨을
  검증한다.
- 기존 flag switcher 테스트와 site remediation 테스트를 회귀 통과한다.

## 검증

1. `npx vitest run src/components/__tests__/document-locale-sync.test.ts src/components/__tests__/locale-flag-switcher.test.tsx src/data/__tests__/site-remediation-content.test.ts`
2. `npm run -s typecheck`
3. 허용 implementation/test 파일 scoped ESLint
4. 허용 파일과 본 작업명세 `git diff --check`
5. manager Playwright:
   - desktop/mobile KO 017에서 네 flag href/텍스트 확인
   - JP 클릭 후 URL, 일본어 H1, `lang="ja"` 확인
   - TW 클릭 후 URL, 번체중문 H1, `lang="zh-Hant"` 및 TC font class 확인
   - 직접 로드와 client 전환의 `<html>` class가 동일한지 확인
   - console/page error 0

