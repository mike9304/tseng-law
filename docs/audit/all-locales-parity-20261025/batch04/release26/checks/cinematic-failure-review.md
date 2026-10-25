# B4 빌드 대기 중 cinematic-opening 실패 조사

확인 시각 `2026-10-25T15:54:35.182953+00:00`. 읽기 전용 조사이며 테스트 재실행·코드 수정은 하지 않았다.

판정: 이 한 실패는 B4 21편의 내용·날짜·출처 변경을 원인으로 하는 주장이 아니다. 기존 테스트가 locale layout 파일에서 Next `headers` import 문자열을 전면 금지하지만, 기준 커밋의 해당 파일에도 이미 그 import가 있다. 동일한 단정과 동일한 입력 문자열이 현재에도 존재한다. 이로부터 기준 코드에도 이 단정이 맞지 않는다는 것은 확인할 수 있지만, 기준 커밋의 전체 테스트를 별도로 실행했다고 주장하지 않는다.

실제 root 로그의 실패는 `cinematic opening layout integration > uses a pathname-aware client boundary and keeps footer outside suppression`이며, 금지한 `headers } from 'next/headers'`를 layout 문자열이 포함한다는 메시지다. 해당 suite는 73개 중 1개 실패로 보고된다. 관측 시점의 관련 로그 구간만 `cinematic-failure-log-excerpt.txt`에 보존했다. 아직 실행 중인 전체 npm 작업의 종료값은 root가 수집하며 이 보고서가 대신 판정하지 않는다.

## 코드와 주장

- `src/components/__tests__/cinematic-opening.test.tsx:327`는 `layoutSource` 전체에 `headers } from 'next/headers'`가 없어야 한다고 단정한다. 이 테스트 본문은 layout 및 route shell의 소스 문자열을 읽으며 B4 원고 본문·front matter를 읽지 않는다.
- `src/app/[locale]/layout.tsx:3`에 해당 import가 있고, 121–124행에서 `IS_STATIC_SITE`일 때 `x-tseng-pathname`을 `publicColumnSwitcherData`의 `staticPathname` 옵션에 전달한다. 현재 글만 담는 정적 언어전환 index를 만들기 위한 분기이며 opening gate의 경로 판단으로 사용하지 않는다.
- `src/components/CinematicRouteShell.tsx`는 여전히 `visibleCinematicPathname(usePathname())`로 경로를 읽고, `CINEMATIC_OPENING_ENABLED = false`이며 footer는 `data-cinematic-chrome` suppression 표시 밖에 있다. 따라서 현재 `headers` 사용을 곧바로 client-route gate의 회귀라고 해석할 근거는 이 실패 메시지에 없다.
- 이 결과는 앱 전체가 오류 없다는 승인이나 실패 무시 지시가 아니다. root가 기존 계약 정리와 릴리즈 판단을 별도로 맡으며, 이번 작업자는 수정·재실행 없이 증거만 전달한다.

## 기준 커밋과 현재 파일의 바이트 비교

기준: `3b5ea95061d61a6b9a0e94eb61438be843fdd63c`. 아래 9개 파일은 `git show <기준>:<경로>` 결과와 현재 파일 바이트가 전부 같다. 시작·종료 해시도 동일하다.

| 파일 | 기준 = 현재 SHA-256 |
|---|---|
| `src/app/[locale]/layout.tsx` | `2062a9982bb7a38cbdd2660fd407300e6ea30b744894214a18fe0791139f698a` |
| `src/components/__tests__/cinematic-opening.test.tsx` | `bfa672efd329fd32b180d9643ed7527d06cb17e27ea4d6c2e12e8836efe93d5b` |
| `src/components/CinematicRouteShell.tsx` | `df1977e285667df04250172de3bc06d19e589b733b839aa5a34d32533ea941e0` |
| `src/components/CinematicOpening.tsx` | `e7103fc83e80513f3eab05e91ebf029e9ab97b1f8c0b40c31745f63ad80e8fbd` |
| `src/components/CinematicOpening.module.css` | `5e727a2b248fe2506d574b13290900c03bfd50a059faeee466a7dd13500111fd` |
| `src/app/layout.tsx` | `077ec5fbc9619d1781473647aa9bcc9c626562c4117554ecc0f9d8c93bb170b8` |
| `src/lib/column-language-links.ts` | `33acd15dd6d28dbd124c423552ab3a51633d3af559f504b46706e1186f29b8ad` |
| `src/lib/column-list-items.ts` | `2dc379238c6643b0d47771070a4c63c923ef65f219054b67f28e659fef417e35` |
| `src/lib/columns.ts` | `3ba567a0a9aaecd6070247bfc193980f1aef2b752a6fbcdca767afd48fe8b2f5` |

JSON 증거 SHA-256: `0b06f7817f2fd39d2488172e81a6538dc6737625b68331374f29b72b12fd793c`. 로그 발췌 SHA-256: `65127e8e120741ce18839ab0c34fb1db4351142b77ce374fb106a9afafc84fda`.
