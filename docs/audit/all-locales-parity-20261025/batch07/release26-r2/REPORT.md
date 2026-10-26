B7 수정본의 지정된 로컬 검증이 모두 통과했다. 검증 커밋은 `51286ef9817aab5178b9237fa2041877d4df7c4a`, 산출물은 `R/out-all-locales-batch07-release26-r2`다. 최초 `release26` 산출물과98/104 브라우저 결과는 그대로 보존했다.

| 항목 | 실제 결과 |
| --- | --- |
| Node24 전체 빌드 | exit0, 151초 |
| 산출물 | 5,509파일 / 485,401,297바이트 / 3,136 HTML |
| 수집·사이트맵 | crawl2,944 / sitemap2,939중2,939 |
| 깨진 참조·초과크기·누락·Flight 오류 | 모두0 |
| 기존 미디어 origin | 2,164파일 분리 / 참조1,346 / 누락0 |
| 사례15언어 클러스터 | 90/90 PASS, 원문 본문 블록2,164개 |
| ARC49언어 회귀 | 147/147 PASS, 원문 본문 블록6,553개 |
| 주 브라우저 | 104/104 PASS, exit0 |
| 별도 HE706 모바일 | 1/1 PASS, exit0 |
| 최초/수정본 본문 DOM 비교 | 237/237 PASS |
| 기본 패키지 | 171,814,908바이트 = 163.8555MiB |
| 256MiB 한도 여유 | 96,620,548바이트 = 92.1445MiB |
| 패키지 무결성 | HTML3,136 gzip 역복원 동일 / 기타 자산2,370 동일 / 실패0 |

브라우저104건은 새42편의 desktop1440px·mobile390px 각각42건, slow7건, JavaScript 비활성7건, home49/legacyKO3의 메뉴6건이다. 본문 모든 블록, FAQ, 이미지 decode, 메타데이터, 날짜, 실제15언어 메뉴와 문서 전환, 소스AST의 표 수를 확인했다. article과 열린 메뉴는 각각 폰트 준비·network idle을 기다렸다. 실제 브라우저는 격리 Chromium156.0.8078.4이며 Playwright1.59.1을 사용했다. 사용자 브라우저나 계정은 사용하지 않았다.

처음 실패했던 FA915의 desktop/mobile/slow/nojs와 FA919의 desktop/mobile 여섯 경우가 같은 검사 기준으로 모두 통과했다. FA 숫자·식별자·표와 HE706의23-1은 실제 DOM Range 좌표로 확인했다. page/console/HTTP/자산/RSC 오류는0이다. JavaScript 비활성으로 예상된 로컬 script preload CSP 차단7건은 별도로 보존했다.

수정본에 대해 임시 DOM 변경 없이 FA915/919를1440px·390px에서 다시 열었다. 두 글의 링크2개씩 총8관측에서 원문 숫자 순서가 LTR이고 모두 한 줄이었다. 공식URL과 링크 textContent·원고는 최초 증거와 동일하다. [실제 R2 좌표·HTML·SHA](checks/fa-identifier-diagnostic/observations.json)에 기록했고, 다음 실제 화면을 직접 열어 확인했다.

- [FA85-1 모바일](checks/fa-identifier-diagnostic/390-fa-915-link1.png)
- [FA22-2 모바일](checks/fa-identifier-diagnostic/390-fa-919-link1.png)
- [기존HE706 모바일 표](checks/browser-screenshots/mobile-he-706-rtl-table.png)

최초/수정본의 사례90+ARC147페이지를 비교했을 때59페이지에 법령ID126개의 `bdi dir="ltr"`가 추가됐다. 그 정확한 래핑만 제거하면 본문 DOM이 동일하다. 본문 textContent, FAQ DOM, href, 구조화 데이터, canonical/title/언어클러스터 및237개 해당 원고SHA도 동일하다. [비교 결과](checks/static-dom-r1-r2-corrected.json)는 원어민·법률 감수가 아닌 렌더링 변경 범위 검증이다.

DOM 비교기의 첫 실행235/237 결과도 보존했다. 비교기가 entity로 직렬화한 원래 Persian 숫자와 bdi 제거 시 넣은 raw Unicode를 달리 비교한 오류였다. 별도 수정본에서는 같은 serializer로 text child를 직렬화하도록 한 줄을 바꿨다. Persian·Arabic-Indic·ASCII 중립 숫자3개로 원인을 재현하고 검증했으며, 원래 검사 기준은 그대로다. 결과 경로 변경과 그 한 줄만 역복원하면 최초 스크립트와 바이트가 같다는 기록이 [수정 영수증](checks/dom-comparator-correction.json)에 있다. 최초235/237 로그·스크립트·결과는 덮어쓰지 않았다.

기본 packer/Worker는 B6와 동일한 소스 해시다. emitted Worker는 최초 산출물과도 같은 `84711e76427f7a5ae35a8be8e2c872adfba9b7291f76566eac99ffe4836d74ff`이고, 설정·ASSETS 바인딩·헤더도 정확히 일치한다. 패키지5,510파일 전체 해시는 `f8ae37d63482c87c3db078151c233861bfb29b8994596590d65e3c54dd393b31`이다. 신규 shared-gzip 용량 후보는 포함하지 않았다.

종료 snapshot에서 R은 clean이고 HEAD는 검증 커밋 그대로다. 새42편·정본6편·전체 원고2,370개, tracked src/scripts 및R2 산출물 전체가 이 빌드의 시작값과 같다. 원고 전체는 renderer 수정 전 최초 산출물 시점과도 같다. 최초 산출물5,505파일, 최초 패키지5,506파일과 최초보고서가 묶은 증거파일도 다시 대조해 변경이 없음을 확인했다. [보존 영수증](checks/first-artifact-preservation.json).

검증 대상 해시:

- R2 산출물 전체: `4b250bc6f2ed758cd51e0de0589897cd0f11c7255fc282e9b2d127222a8209f6`
- 전체 원고: `8677aa9b34121952ce1d89329b8668cfd720ddef5417002757882b7cdcfb86b9`
- 최종 판정 JSON: [FINAL.json](checks/FINAL.json), SHA `b36b877692c9d23bec7267f4a180bca89f9a419af4f56c34176b8ec9a3ea6711`

실제 명령·시간·exit·로그는 각 command 영수증과 `batch07/checks/static-build-release26-r2-*`에 있다. 이 작업자는 R 코드·원고·공유도구를 수정하거나 commit/push/deploy하지 않았다. root의 renderer 수정은 별도 커밋으로 구별했다. 데이터 모드는 기존 media-origin을 유지한 local fallback이며 Air production CMS mirror와의 일치를 증명하지 않는다. 현재 패키지의 한도 통과를 최종49×286편의 용량 입증으로 확대하지 않는다. 이전 B6·B7 최초 증거와 별도 용량 후보는 보존했다.
