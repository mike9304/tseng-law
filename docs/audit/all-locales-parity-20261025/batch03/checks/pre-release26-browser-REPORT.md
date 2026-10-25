# Batch03 최종 정적 산출물 브라우저·Sites 패키지 검증

검증일: 2026-10-25 KST. 담당: `column_deploy`. 결과: 실제 브라우저 62/62 PASS, 패키지 전수 바이트 검증 PASS. 이 보고서는 로컬 최종 산출물 검증이며 공개 배포 완료 기록이 아니다.

## 고정한 산출물

- R: `/Users/son7/Projects/tseng-law-all-locales-20261025`
- 산출물: `R/out-all-locales-batch03`
- HEAD 및 `build-info.json` commit: `47ad0c93b3235fd8a5d7af41511f75014931e7e2`
- `builtAt`: `2026-10-25T14:37:02.637Z`
- 파일 5,343개, 462,293,841 bytes. 산출물 파일 목록·크기·SHA의 정규화 트리 SHA: `c67550aa465fca77497e8534f8cc7e8af4e724ebcd233a1f7cc1acb10b383e1b`.
- R 전체 Markdown 2,208개의 정규화 트리 SHA: `32ec7b71db9dd969b83f64e61182ed44649fefe707d2dd36f9d65b96005b5c8c`.
- 시작 snapshot `2026-10-25T14:48:58.897936+00:00`, 종료 snapshot `2026-10-25T14:51:02.917396+00:00`. B3/R의 대상 21개 원고, R 전체 Markdown, 모든 산출물 파일, HEAD/build-info, 기존 B2/rebased 증거 9개가 동일하다.

원고 SHA 21개와 HTML SHA 21개는 [브라우저 원자료](./browser-arc-results.json), 전체 파일 동결·전후 비교는 [시작 snapshot](./browser-snapshot-before.json)과 [종료 snapshot](./browser-snapshot-after.json)에 있다. 원고·R 앱·공유 도구를 바꾸거나 재빌드·커밋·푸시·배포하지 않았다.

## 실행과 최초 실패 보존

B2/rebased의 기존 `browser-arc.mjs`, `pack-verify.mjs`, `snapshot.py`를 B3의 독립 경로로 복사·적응했다. 대상 언어는 `bg ca el hr hu is sk`, ARC 번역 묶음은 35개, 홈 메뉴는 49개다. 기존 KO 0513 경로는 `/ko/columns/taiwan-left-turn-vs-straight-motorcycle`과 기존 번역 3개를 확인한다.

최초 브라우저 명령은 샌드박스의 `listen EPERM 127.0.0.1` 때문에 서버 시작 전에 exit1이었다. [최초 실패 로그](./browser-run-initial.log)를 보존했다. 검사 실패를 무시하거나 체크를 삭제하지 않고, 승인된 로컬 브라우저 QA에 필요한 loopback 실행 권한으로 같은 스크립트를 다시 실행했다. 이후 명령은 exit0이다.

```text
/Users/son7/.nvm/versions/node/v24.14.1/bin/node verification/browser-arc.mjs
/Users/son7/.nvm/versions/node/v24.14.1/bin/node R/scripts/static-site/sites-pack.mjs --out=R/out-all-locales-batch03 --dist=B3/pack
/Users/son7/.nvm/versions/node/v24.14.1/bin/node verification/pack-verify.mjs R/out-all-locales-batch03
```

위 `R`, `B3`는 설명용 경로 약칭이다. 실제 pack 명령과 검증 명령에는 절대 경로를 사용했다. 실행 스크립트는 [verification/browser-arc.mjs](../verification/browser-arc.mjs), [verification/pack-verify.mjs](../verification/pack-verify.mjs), [verification/snapshot.py](../verification/snapshot.py)다. 기존 보고서가 있으면 덮어쓰지 않는 보호를 둔다.

## 브라우저 결과

실제 실행: `2026-10-25T14:49:46.747Z`부터 `14:50:57.551Z`까지. Node v24.14.1, Playwright 1.59.1, 설치되어 있던 격리 Chromium 캐시 `chromium-1248`의 실제 브라우저 버전 `156.0.8078.4`, headless 임시 프로필, 동시성 2를 사용했다. 사용자 Chrome·로그인 프로필은 사용하지 않았다. 페이지와 언어 메뉴 모두 `document.fonts.ready`와 `networkidle`을 기다린 뒤 조작했다.

| 사례 | 실제 결과 |
|---|---|
| 신규 21편 desktop 1440×1000 | 21/21 PASS |
| 신규 21편 mobile 390×900 | 21/21 PASS |
| 각 언어 704의 slow HTML | 7/7 PASS |
| 각 언어 704의 JavaScript 비활성화 | 7/7 PASS |
| 홈/기존 KO0513 × desktop/mobile/slow | 6/6 PASS |
| 합계 | 62/62 PASS |

현재 원고의 문단·제목·표 셀·목록을 Markdown AST로 추출한 969개 블록을 각 실행에 해당하는 렌더링과 대조했다. 총 비교 2,576건, 누락 0이다. FAQ 본문/JSON-LD, H1·SEO title·description·OG·Article JSON-LD의 제목/요약/날짜/언어, canonical, 허구 캡션, alt, 이미지 정체성을 원고와 대조했다. FAQ 비교 168건과 실제 이미지 `decode()` 56건이 모두 통과했다. 장식적인 육안 표본 확인만으로 본문 전체 검증을 대신하지 않았다.

42번의 언어 전환은 같은 full slug를 유지하며 모두 새 document navigation이었다. 새 `performance.timeOrigin`과 이전 문서 토큰 소멸, HTTP200을 확인했다. ARC 메뉴 49회는 선택지 35개와 정확한 집합을 유지했고, 본문 56회에서 footer/hreflang도 해당 35개 묶음과 일치했다. 홈은 49개, 기존 KO0513은 3개 언어만 표시했다.

slow HTML은 1,024 bytes마다 12ms를 두고 전송했다. 7개 언어 모두 초기 본문이 나타난 뒤 hydration/메뉴 조작 중 본문 소멸 0, 본문 노드 교체 0이었다. JavaScript 없는 7개에서는 실제 본문·FAQ·이미지와 native footer 언어 목록이 사용 가능했다.

page error 0, console error 0, HTTP/asset 실패 0, RSC 요청 0, 가로 overflow 0이다. JavaScript를 끈 시험에서 Chromium이 스크립트 preload에 기록한 예상 `csp` 차단 7건은 원자료의 `expectedDisabledScriptBlocks`에 별도 보존했다. 다른 요청 오류를 이 예외에 포함하지 않는다.

요약: [browser-run-summary.json](./browser-run-summary.json). 실행 로그: [browser-run.log](./browser-run.log).

## 스크린샷 실제 열람

90개 화면을 저장했다. 아래 8개를 직접 열어 제목/문자, 여백·줄바꿈, 이미지·캡션, 보이는 본문 배치를 확인했다. 글자 깨짐이나 화면 밖 잘림을 발견하지 않았다. 이는 해당 언어 전체의 원어민 교정 승인과 다르다.

- [BG mobile 704 본문](./browser-screenshots/mobile-bg-704-body.png)
- [CA mobile 705 hero](./browser-screenshots/mobile-ca-705-hero.png)
- [EL mobile 706 본문](./browser-screenshots/mobile-el-706-body.png)
- [HR mobile 704 본문](./browser-screenshots/mobile-hr-704-body.png)
- [HU mobile 705 본문](./browser-screenshots/mobile-hu-705-body.png)
- [IS mobile 705 본문](./browser-screenshots/mobile-is-705-body.png)
- [SK mobile 706 본문](./browser-screenshots/mobile-sk-706-body.png)
- [EL desktop 704 hero](./browser-screenshots/desktop-el-704-hero.png)

## 실제 Sites 패키지

현재 R의 변경하지 않은 `sites-pack.mjs`를 사용해 B3 소유 경로 `batch03/pack`에만 생성했다. Node v24.14.1 / zlib `1.3.1-e00f703`로 측정했다.

| 항목 | 실측 |
|---|---:|
| HTML | 2,974개 |
| HTML 원본 | 374,793,329 B |
| HTML gzip9 | 78,924,445 B |
| 일반 자산 | 2,366개 / 87,485,886 B |
| 패키지 전체 파일 | 5,344개 |
| 전체 expanded bytes | 166,436,294 B = 158.72601890563965 MiB |
| Sites 한도 | 268,435,456 B = 256 MiB |
| 남은 용량 | 101,999,162 B = 97.27398109436035 MiB |

HTML gzip 2,974개를 모두 압축 해제해 원본과 byte-for-byte 일치를 확인했다. 일반 자산 2,366개도 모두 동일하며 `_headers`가 같다. 검증 실패 0이다. [pack 원자료](./browser-pack-report.json), [pack 실행 로그](./pack-run.log), [전수 비교 로그](./pack-verification.log)를 보존했다.

Packer SHA `c983e275e92ef2aff523f6307069ca54121fc79400e9c247fa02f7c1b73d85e7`, Worker template SHA `1d822b535ea1011a27fd037cfb2f9cef9245aacb0cc541b26d926c55923998b9`, 생성 Worker SHA `84711e76427f7a5ae35a8be8e2c872adfba9b7291f76566eac99ffe4836d74ff`, wrangler 설정 SHA `5b4cb5e98934bf6b8df0273cb93eed501b3dfe4eadcab2ad075b61e90e85dbe3`.

이 수치는 현재 완성된 B3 산출물의 실제 패키지이며 49×286 전체 목표의 크기 보장이 아니다. 로컬 브라우저는 정적 산출물을 제공한 서버를 검증했고, 패키지는 압축 복원/자산/크기를 검증했다. Sites 운영 Worker 게시·원격 Air 실행·공개 URL 반영이나 core CMS prod-mirror의 완전한 동일성까지 주장하지 않는다. 원고의 언어·법률 독립 검수는 각각의 리뷰 기록에 남는다.

## 주요 증거 SHA-256

| 파일 | SHA-256 |
|---|---|
| `browser-arc-results.json` | `c6488628d9976535a5a68ef73b593ac0a5e2c35bd869f1cdbb5fa01bda7716ec` |
| `browser-run-summary.json` | `5cb8f03fd0b4c22f38f0f7939f550089dd34cd8c2ff837bb3852a83755d1266d` |
| `browser-pack-report.json` | `310e50aa2bc7184c1ea20f3df98f194892b894dd578e1a8e8c9158c2d8a6bdb1` |
| `browser-snapshot-before.json` | `fff1e3223f765e3a7792d0813fcc1cd7af216bd83b5372463dfb1850a3b47c8c` |
| `browser-snapshot-after.json` | `cdff4c0d9356bf39d84fb1b5e8696b4859a81bdf73beacfe32879bf11744125d` |

보고서·스크립트·로그·스크린샷 해시는 [browser-evidence-sha256.json](./browser-evidence-sha256.json)에 별도로 기록한다.
