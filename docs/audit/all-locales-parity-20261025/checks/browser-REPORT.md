# ARC 21개 로컬 정적 산출물 브라우저 검증

검증일: 2026-10-25. 결과: 62개 시나리오 중 62개 통과. 이는 로컬 `out-all-locales` 검증이며 공개 배포 확인이 아니다. `build-info`는 미커밋 변경 전 base `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`를 가리키므로 원고 SHA-256과 실제 HTML SHA-256으로 대상을 특정했다.

`frozen prod-mirror`가 이 기계에 없어 `data:null` 상태다. 신규 7언어 × 704–706번 21개 글은 file-backed이므로 아래 원고 대조를 수행할 수 있었다. 기존 CMS 미러와의 일치까지 인증한 결과는 아니다.

## 검증 범위와 결과

| 시나리오 | 건수 | 결과 |
| --- | ---: | --- |
| RU/MS/FIL/TR/NL/ZH-HANS/SV의 704–706, desktop 1440×1000 | 21 | PASS |
| 같은 21 URL, mobile 390×900 | 21 | PASS |
| 신규 7언어 704, 느린 HTML 전송 | 7 | PASS |
| 신규 7언어 704, JavaScript 비활성화 | 7 | PASS |
| `/en` 홈의 49언어 메뉴, desktop/mobile/slow | 3 | PASS |
| 기존 KO051의 KO/ZH-HANT/EN 3언어 메뉴, desktop/mobile/slow | 3 | PASS |

42개 일반 기사 검사는 각각 다음을 확인했다.

- 실제 표시된 제목, 문서 언어, 원고의 모든 문단·제목·표 셀·목록 텍스트. 21개 원고에서 추출한 951개 블록이 모두 DOM에 존재했다. FAQ 질문·답변 3개, 이미지 경로·현지어 alt·캡션도 원고와 일치했다.
- 대표 이미지의 load 완료 및 실제 픽셀 크기, 문서 가로 overflow 없음, 정확한 canonical과 21개 언어의 hreflang.
- 헤더 언어 메뉴와 footer에 기존 14 + 신규 7 = 21개의 같은 full slug 링크만 표시.
- 실제 언어 링크 클릭 후 HTTP document 요청·새 `performance.timeOrigin`·이전 window 표식 소실·목적지 언어 제목을 확인. 42번 모두 새 문서로 이동했고 `_rsc` 요청은 없었다.
- 일반/slow 시나리오의 browser console/page error, HTTP 오류·실패 요청 0건.

느린 전송은 원본 HTML을 1,024바이트씩 12ms 간격으로 전달했다. 본문이 처음 나타난 뒤 사라짐·본문 노드 교체를 MutationObserver로 관찰했으며 7개 모두 0회였다. 메뉴를 열고 닫은 뒤 본문 DOM도 유지됐다. 이 실험은 HTML stream 지연이며 모든 자산에 통신망 지연을 적용한 모바일 회선 측정은 아니다.

JavaScript 비활성화 상태에서는 현지어 본문·FAQ·이미지와 native footer 언어 dropdown이 정상 동작했다. 첫 실행의 7개 실패는 Chromium이 실행 금지된 webpack preload를 `csp`로 보고한 것만을 일반 요청 실패로 센 검사기 오류였다. 동일 URL을 활성/비활성 컨텍스트에서 비교해 활성 시 HTTP 200, 비활성 시 script/csp 차단, 별도 HTTP GET 200·6,032바이트, 문서 CSP 헤더 없음, 동일 본문 길이를 확인했다. 이 예상 차단만 별도 기록하도록 바꿔 no-JS 7개를 재실행했다. 제품 코드는 변경하지 않았다.

## 추적성과 증거

- [최종 62개 결과](browser-arc-results.json): 최초 55개 통과와 no-JS 7개 재실행을 합친 결과. 각 원고·HTML SHA, 제목·FAQ·alt·메뉴 href·실제 navigation 기록 포함.
- [최초 실행](browser-arc-initial-results.json), [no-JS 재실행](browser-nojs-results.json), [동일 URL 활성/비활성 진단](browser-nojs-diagnosis.json).
- [동결 목록](batch01-manifest.json)의 21개 원고 SHA가 최초 실행, 재실행, 마지막 파일 확인과 21/21 일치했다. FIL/TR 및 ZH-HANS706의 최종 본문도 951개 블록 대조에 포함된다. 21개 HTML 합계 2,485,658바이트이며 두 실행 사이 SHA 변경 0건.
- [보충 메뉴·사진 관찰](browser-detail-views.json): 이전 공개 HTML의 SHA를 검증한 뒤 sidebar 상태와 비교했다.

Chromium 156.0.8078.4를 독립 임시 프로필로 실행했다. 프로젝트 Playwright는 1.59.1이다. 연결 browser 앱 목록은 비어 있었으며, 설치된 Chromium 1248 캐시를 명시해 standalone fallback을 사용했다. Firefox/WebKit은 설치돼 있지 않아 다른 엔진이나 실제 iOS 기기 검증을 주장하지 않는다. 각 실행의 임시 localhost 서버·브라우저는 종료했다. root의 빌드 서버를 조작하거나 배포하지 않았다.

## 화면 확인과 남은 관찰

21개 URL 모두 desktop/mobile에서 생성한 화면을 실제로 열어 제목 줄바꿈·사진·본문 시작부·링크·가로 배치를 확인했다. 각 조합에 hero/body 캡처를 남겼고, 일부 URL은 두 캡처 중 본문과 제목이 함께 보이는 화면을 검토했다. ARC 21언어, 홈 49언어, KO051 3언어의 열린 메뉴도 직접 확인했다. 이 검사는 번역의 법률 의미를 다시 승인하는 검수가 아니다.

root 재검토용 화면:

- [SV704 desktop](browser-screenshots/desktop-sv-704-hero.png)
- [ZH-HANS706 mobile](browser-screenshots/mobile-zh-hans-706-body.png)
- [NL705 desktop](browser-screenshots/desktop-nl-705-body.png), [NL705 mobile](browser-screenshots/mobile-nl-705-body.png)
- [ARC mobile 메뉴](browser-screenshots/mobile-zh-hans-706-picker.png), [ARC desktop 메뉴](browser-screenshots/desktop-sv-704-picker.png), [홈 메뉴](browser-screenshots/desktop-home-picker.png), [KO051 메뉴](browser-screenshots/mobile-ko051-picker.png)

관찰한 기존 상태와 검사 한계:

1. MS/FIL/TR/ZH-HANS sidebar의 `Book Consultation`, `Consulting Attorney`는 이번 배치 전 공개 HTML에도 존재한다. 비교 URL은 [MS012](https://tseng-law.com/ms/columns/taiwan-overtaking-accident-liability), [FIL012](https://tseng-law.com/fil/columns/taiwan-overtaking-accident-liability), [TR013](https://tseng-law.com/tr/columns/taiwan-company-establishment-advanced-1), [ZH-HANS019](https://tseng-law.com/zh-hans/columns/taiwanese-spouse-divorce-agreement-registration)이며 SHA는 보충 JSON에 있다. 이번 칼럼/언어 index 변경의 새 리그레션이 아니다. ZH-HANS 표 스크롤 안내도 영어로 보였으므로 사이트 UI 전체가 현지어라고 표현하면 안 된다.
2. NL705의 sidebar 사진 영역은 회색으로 보였다. 동일 사진 URL과 markup이 [이전 공개 NL013](https://tseng-law.com/nl/columns/taiwan-company-establishment-advanced-1)에 있고, 로컬 NL013도 같은 상태였다. 이미지 HTTP 200, decode 완료, 자연 크기 1760×2640, visible·opacity 1·양수 bounding box까지 확인했다. 관련 뷰/CSS 소스에 이번 변경은 없다. 새 오류라는 근거는 없으며, 실제 사진이 보인다고 인증하지 않는다. [신규 글 관찰](browser-screenshots/desktop-nl-705-authority-loaded.png), [기존 글 관찰](browser-screenshots/desktop-nl-013-authority-loaded.png).
3. 보충 FAQ 캡처 두 장은 메뉴 닫기 직후 스크롤이 viewport에 도달하지 않아 흰 화면으로 저장됐다. 이 파일들은 시각적 FAQ 통과 증거로 사용하지 않는다. FAQ 검증 근거는 21개 글의 실제 DOM 질문·답변 원문 대조다. 부모 지시에 따라 추가 진단을 확장하지 않고 이 한계를 보존했다.

스크린샷과 raw HTML은 감사 폴더 `.gitignore`에 따라 로컬 보존하며, JSON·검사기·이 보고서는 버전 관리 대상이다.

## 재현

완료된 정적 산출물을 준비한 후 저장소 루트에서 실행한다. 빌드·배포 기능은 없다.

```sh
/Users/son7/.nvm/versions/node/v24.14.1/bin/node docs/audit/all-locales-parity-20261025/verification/browser-arc.mjs
```

`--phase=desktop|mobile|slow|nojs|navigation`, `--out=out-all-locales`, `--report=경로`, `--concurrency=2`로 범위를 제한할 수 있다. 실제 브라우저와 localhost bind가 허용된 환경이 필요하다. 보충 `browser-detail-views.mjs`는 앞선 공개 표본의 `/private/tmp/tseng-packer-experiment-20261025/manifest.json`이 있는 이 기계의 관찰 재현용이다.
