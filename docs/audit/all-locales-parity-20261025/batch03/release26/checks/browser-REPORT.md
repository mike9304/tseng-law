# B3 release26 — 최종 정적 산출물 68건 브라우저·패키지 검증

검수자: column_deploy. 2026-10-26 KST. 결과: 실제 Chromium 68/68 PASS, 패키지 전수 대조 오류0. R 앱·원고·정적 산출물을 변경하거나 재빌드·배포하지 않았다. 작업 출력은 `batch03/release26/{verification,checks,pack}`에만 생성했다.

## 검증한 입력

- R HEAD 및 build-info commit: `3b4cc3f4793e1b3593c9621cc8733019a8078e5d`.
- 산출물: `/Users/son7/Projects/tseng-law-all-locales-20261025/out-all-locales-batch03-release26`.
- build-info builtAt: `2026-10-25T15:21:25.133Z`.
- 산출물 5,347파일, 463,006,310바이트. 트리 SHA256: `dec8c3e69f2763b85d6f3e48a79778be853908d927f709292ca73d6cf864dec1`.
- 전체 R Markdown 2,208파일 트리 SHA256: `46e00ee6bfd9cd7db66797b9b1e43a60e37aa2af50e4be28625a67c925968aaa`.
- 대상 원고: bg/ca/el/hr/hu/is/sk의704–706 21편과 수정된 ms/fil/nl704 3편. 원고24편과 대응 HTML의 전체 SHA는 실제 [브라우저 결과](browser-arc-results.json)의 sourceManifest/artifactManifest 및 전후 스냅샷에 있다.

[시작 스냅샷](browser-snapshot-before.json)은15:26:42.516Z, [종료 스냅샷](browser-snapshot-after.json)은15:29:48.800Z에 생성했다. 대상24편·전체2,208원고·산출물전부·HEAD·build-info·이전B3브라우저/패키지/검사기 증거5,446파일이 모두 바이트 단위로 동일하다. 새21편의 R/B3 사본도 동일하다. 추가3편은 R 원고를 직접 입력으로 읽었고 B3 원고 사본을 임의 생성하지 않았다.

## 실제 브라우저 실행

Node24.14.1, Playwright1.59.1, 격리 Chromium1248 설치의 실제 버전156.0.8078.4, 동시성2. 사용자 Chrome·사용자 프로필·계정은 사용하지 않았다. Loopback 서버를 허용한 첫 실행이 exit0이며 실패 case는 없다. 기존 B3 첫 실행의 sandbox EPERM 및 원래62건 증거는 보존됐다. root의 새 빌드 최초crawl 전 EPERM/공식 skip-build 재시작 영수증은 root 빌드 증거이며 이번 브라우저 실행과 혼동하지 않는다.

실행 시각은15:27:14.229Z–15:28:32.697Z이다. [원문 실행 로그](browser-run.log), [요약](browser-run-summary.json), [검사기 변경 기록](browser-adaptation.json)을 남겼다. 기존 검사기에서 대상 원고3개와6case를 추가했으며 ARC cluster35/새언어7은 그대로다. 원래 결과 파일은 덮어쓰지 않았다.

| 구분 | 건수 | 결과 |
|---|---:|---|
| Desktop, 1440×1000 | 24 | 24 PASS |
| Mobile, 390×900 | 24 | 24 PASS |
| 느린 HTML, 새7언어704 | 7 | 7 PASS |
| JavaScript 비활성, 새7언어704 | 7 | 7 PASS |
| 홈49언어 + 기존 KO0513 3언어, desktop/mobile/slow | 6 | 6 PASS |
| 합계 | 68 | 68 PASS / 실패0 / fatal0 |

MS/FIL/NL704의 desktop/mobile 여섯 case도 각각 현재 원고와 대조했다. 메뉴에서 같은 전체slug의 BG로 이동했으며 여섯 번 모두 새 document navigation이었다. 추가3편 때문에 slow/nojs 또는 언어 클러스터를 중복 확장하지 않았다.

원고24편의 제목·요약·FAQ·본문·이미지·메타데이터를 실제 DOM과 비교했다. 서로 다른 원고 블록1,112개에 대해 렌더링된 문단·소제목·표·목록2,862회 대조, 누락0이다. FAQ186답변과 FAQ JSON-LD, Article JSON-LD 제목·설명·날짜·언어, canonical/hreflang35, 이미지경로·alt·가상캡션, 공개author누출도 검사했다. 원어 법률 감수24편을 새로 수행했다는 뜻이 아니다.

이미지 `decode()`62건 모두 성공. 언어메뉴55건에서35개 동일slug 선택지를 확인했고 desktop/mobile48번 모두 실제 문서 이동이었다. 본문뿐 아니라 열린 메뉴에서도 `document.fonts.ready`와 `networkidle`을 기다렸다. 폰트 취소를 무시하는 필터를 추가하지 않았다. page error0, console error0, 실패HTTP/자산요청0, RSC요청0. 느린1024바이트/12ms HTML의 본문 노드교체·사라짐 모두0이다.

JavaScript를 끈7건에는 의도적으로 차단된 Next script preload `csp` 요청이 각1개씩 있다. 이7건은 원래 검사기의 엄격한 동일origin·script·Nextchunk·csp 분기로 별도 보존했다. HTTP 오류나 다른 실패 요청을 이 예외로 숨기지 않았다. JS 없이도 네이티브 언어 메뉴를 열 수 있었다.

## 대표 화면 직접 확인

102개 스크린샷 중 아래12개를 직접 열었다. 새7언어의 본문·히어로, 수정3언어의 모바일을 포함한다. 글·가상캡션·사진이 보이고 관찰한 화면에서 글자 깨짐이나 가로 넘침을 발견하지 못했다. BG704는 body 화면과 초기hero 화면을 둘 다 보았으며 hero에서26일 표시와 원본HTML의`<time>26 октомври 2026 г.</time>`를 확인했다. MS/FIL의 기존 어두운테마와 NL/새7언어의 흰테마를 동일레이아웃으로 간주하지 않았다.

- [HU704 desktop hero](browser-screenshots/desktop-hu-704-hero.png), [HU704 mobile body](browser-screenshots/mobile-hu-704-body.png).
- [MS704 mobile](browser-screenshots/mobile-ms-704-body.png), [FIL704 mobile](browser-screenshots/mobile-fil-704-body.png), [NL704 mobile](browser-screenshots/mobile-nl-704-body.png).
- [BG704 mobile body](browser-screenshots/mobile-bg-704-body.png), [BG704 mobile hero](browser-screenshots/mobile-bg-704-hero.png).
- [CA705 mobile](browser-screenshots/mobile-ca-705-body.png), [EL706 mobile](browser-screenshots/mobile-el-706-body.png), [HR704 mobile](browser-screenshots/mobile-hr-704-body.png), [IS705 mobile](browser-screenshots/mobile-is-705-body.png), [SK706 mobile](browser-screenshots/mobile-sk-706-body.png).

나머지 저장된 스크린샷90개를 모두 사람이 하나씩 본 것처럼 표현하지 않는다. 전체 case의 텍스트·이미지·화면폭 검사는 실제 자동 DOM 검사로 수행했다.

## 기존 packer 전수 확인

R의 변경 없는 `scripts/static-site/sites-pack.mjs`를 새 `batch03/release26/pack` 경로로 실행했다. [packer 로그](browser-pack-run.log)와 [전수 검증 로그](browser-pack-verify.log), [전수 report](browser-pack-report.json)에 결과가 있다. Node zlib은1.3.1-e00f703이다.

| 항목 | 실제 값 |
|---|---:|
| HTML | 2,974개 |
| 원본 HTML | 375,496,362B |
| gzip HTML | 79,111,352B |
| 변경 없이 복사한 자산 | 2,370개 / 87,495,322B |
| Worker·설정·headers 포함 전체 패키지 | 5,348파일 / 166,632,637B |
| 256 MiB 한도 대비 | 158.913266 MiB |
| 남은 용량 | 101,802,819B / 97.086734 MiB |
| gzip 해제 후 원본과 일치 | 2,974/2,974 |
| 자산 바이트 일치 | 2,370/2,370 |
| headers 일치·검증 실패 | true / 0 |

packer SHA256 `c983e275e92ef2aff523f6307069ca54121fc79400e9c247fa02f7c1b73d85e7`, Worker template `1d822b535ea1011a27fd037cfb2f9cef9245aacb0cc541b26d926c55923998b9`, 생성 Worker `84711e76427f7a5ae35a8be8e2c872adfba9b7291f76566eac99ffe4836d74ff`. 압축 전후 수치와 원본 바이트 확인이며 배포된 Worker runtime 실행, 실제 공개 도메인 HTTP 확인 또는49×286최종규모의 수용 보장이 아니다.

## 경계와 재현

다시 실행할 때는 기존 증거를 덮지 않도록 새 output/report 경로가 필요하다. 브라우저는 [browser-arc.mjs](../verification/browser-arc.mjs), 패키지 대조는 [pack-verify.mjs](../verification/pack-verify.mjs), 입력 동결은 [snapshot.py](../verification/snapshot.py)다. root가 보고한 crawl2782/sitemap2777/2777/502repositorytests는 이번 담당자가 다시 빌드하거나 실행한 수치가 아니다.

이 보고서는 명시한 최종 산출물의 로컬 기능·내용표시·패키지 검증을 완료한다. 실제 main push·Sites 공개 반영 확인은 root가 별도 수행한다. HE R2와 LT 미지원프로필 검사는 이68건의 결과에 포함하지 않았다.
