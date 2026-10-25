# B5 최종 로컬 산출물 검증

내용 커밋 `63f5fad925cba35d71c44d37fd48071c3409c862`의 전체 빌드와 검증을 완료했다. R은 clean이고 HEAD·원고·산출물 SHA가 검증 전후 같다. 이 작업은 소스 수정·commit·push·공개 배포를 수행하지 않았다.

## 빌드

Node24.14.1에서 기존 `build.mjs --out=out-all-locales-batch05-release26 --port=4638 --media-origin=https://media.tseng-law.com`을 전체 실행해 exit0. 2026-10-26 02:22:14–02:24:42 KST, build-info builtAt2026-10-25T17:24:38.995Z다. `--data` 없는 local fallback이므로 Air의 운영CMS mirror와 동일하다고 주장하지 않는다.

실측: crawl2824, HTML3016, 전체5385파일/469,679,857B, sitemap2819/2819. 깨진참조·누락·초과크기·Flight오류0. 기존media-origin으로2146미디어/3,108,691,513B를 분리했고1334참조의 로컬 원본누락0이다. [명령·시간·exit](../../checks/static-build-release26-command.json), [빌드 로그](../../checks/static-build-release26.log), [빌드 report](../../checks/static-build-release26-report.json), [미디어 manifest](../../checks/static-build-release26-media.json)를 보존했다.

## 실제 검증 결과

| 범위 | 결과 |
|---|---|
| 신규21 desktop1440/mobile390 + DE704 desktop/mobile | 44/44 PASS |
| 신규7언어 slow HTML / no-JS | 14/14 PASS |
| home49 / 기존KO051의 desktop·mobile·slow 메뉴 | 6/6 PASS |
| 본검증 합계 | 64/64 PASS, exit0 |
| 기존HE706 mobile390 회귀 | 별도1/1 PASS, exit0 |
| ARC49언어×3편 정적 source/metadata/cluster | 147/147 PASS,6553본문블록 순서·문자열 일치 |
| 패키지 HTML gzip역변환 / 일반자산 | 3016/3016 및2366/2366 byte동일 |

[64건 브라우저 결과](browser-arc-results.json)는 제목·요약·원고전체본문블록·FAQ·이미지decode/alt/caption·메타·날짜·실제AST표수·언어전환·가로넘침을 검사한다. 본문과 열린메뉴 모두fonts.ready/networkidle을 기다렸다. 기사 사례에서 예상치 못한 HTTP/자산 실패·콘솔/page 오류·RSC/API 요청은0이며, slow7건의 본문 제거/노드 교체도0이다. no-JS의예상된script CSP차단은 원자료에 별도 보존한다. 검증은 격리Chromium1248이고 사용자Chrome/계정을 사용하지 않았다.

[HE 별도결과](browser-he706-results.json)는 실제최종아티팩트의23-1 네 곳 모두visible/sameLine/LTR임을 확인했다. [모바일표 캡처](browser-screenshots/mobile-he-706-rtl-table.png)를 직접 열어 두행 조문번호가 끊기지 않는 것을 확인했다. B5 산출물에서 새로 캡처했으며, 화면 내용이 그대로여서 PNG SHA는 B4 최종 캡처와 같다. 가상 DOM 미리보기가 아니다. 새7언어에서 각1개 대표 모바일 화면도 확인했고 [시각 검수 기록](visual-review.json)에 실제 본 파일만 남겼다. 이는 원어민·법률승인이 아니다.

[147편 정적최종결과](static-arc147-r2.json)는 각자 원고의metadata/FAQ/본문순서/표/이미지와canonical·HTML/footer49언어·sitemap49+x-default의상호참조를 대조한다. 주언어4개의기존브랜드제목과ko/en/zh-hant의기존ISO lastmod형식을 구분했다. DE704의원publication24일/lastmod26일을보존했다.

정적검사 최초실행은147건 모두 두검사기기대값에서FAIL이었다: 원래media-origin으로이동되는hero를로컬out에요구했고, sitemap의기존x-default를빼고49개만요구했다. 본문6553블록및다른항목은일치했다. [최초결과](static-arc147.json)·최초script/로그를그대로보존했고, [정확한정정](static-harness-corrections.json)은기존assemble/sitemap/seo코드와실제media manifest를근거로한다. R2는hero의정확media-origin URL·원본파일SHA/크기·의도된로컬제외와49개언어+정확한영문x-default를확인한다. 사이트·원고·제외정책을바꾸지않았다.

## 패키지와 보존

[전체패키지검증](browser-pack-report.json): 168,180,980B =160.389881MiB,256MiB까지100,254,476B =95.610119MiB 여유. 기존packer/Workertemplate바이트를유지했다. gzip3,016개역변환과자산2,366개가원본동일,headers동일,검증실패0. [설정검증](pack-config-verify.json)은packedWorker전체가그대로의template+이번artifact설정과일치하고,49root언어·155exact+7pattern리디렉션·8보안헤더·기존assetbinding이일치함을확인한다. Cloudflare에실제로배포하거나Worker를원격실행한검사는아니다.

[원본보존증명](final-source-proof.json): R Markdown2250개,이번out5385개,선택22편과HE706,이전B3/B4파일61101개가SHA동일하다. 이전아티팩트·증거의추가/삭제/변경0. sourceTree SHA`76e7164836f3ee9ce75e21b021ab198e2098387ea9d902071de55ad3362b7f62`,artifactTree SHA`695ac6a83f247b7de62838f0f36cadd3c4be2d3f6d5860ed35ec623ca0a96211`. 빌드중Next가일시갱신한tsconfig/next-env는기존빌더finally복원후clean확인했다.

산출물은 `R/out-all-locales-batch05-release26`, 패키지는 `Base/batch05/release26/pack`에 있다. root가 감사자료를 검토하고 커밋·main push 및 기존 Air 배포의 실제 public build-info를 확인하면 된다. 이 보고서는 공개 게시 완료나49×286 칼럼 목표 달성을 뜻하지 않는다.
