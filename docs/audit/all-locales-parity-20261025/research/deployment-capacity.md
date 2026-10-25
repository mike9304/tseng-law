# 전체 언어 칼럼 동등량 목표의 정적 배포 용량 조사

조사일: 2026-10-25 KST. 담당: /root/column_deploy. 범위는 읽기 전용 조사와 설계 위험 기록이다. 인프라·배포 설정·콘텐츠 축소·push·배포를 수행하지 않았다.

## 결론과 판단 범위

현재 HTML을 페이지별 gzip 파일로 포장하는 방식 그대로 49개 언어에 전문 칼럼 286편씩 제공하면, 256 MiB 패키지 제한을 넘을 가능성이 높다. 공개 HTML 147개를 실제 받아 같은 gzip level 9로 다시 압축한 표본의 언어별 평균을 적용하면 전문 칼럼 14,014개의 HTML 압축분만 411.87 MiB다. 기존 비HTML 자산까지 고정해 더한 추정치는 494.67 MiB이며, 여기에 비칼럼 페이지와 사이트맵 증가분이 더해진다.

이는 14,014편을 실제 작성하고 전체 빌드한 결과가 아니다. 표본은 각 언어 기존 Markdown 크기의 25·50·75 분위에 해당하는 3편으로 고른 탐색 표본이다. 미작성 주제의 길이, 공통 메뉴·번역 링크 수, CMS 데이터, 향후 코드 변화와 압축률의 분포를 통제하지 못하므로 예산 추정이지 확정 크기나 통계적 신뢰구간이 아니다. 그래도 현재 한도에 들어간다는 가정으로 대량 제작·마지막 배포를 진행하기에는 차이가 크다.

## 실제 배포 경로와 변경 권한

현행 AGENTS.md와 scripts/static-site/air-deployer.sh, codex-sites-deploy.sh를 대조했다. main push → MacBook Air 자동 정적 빌드 → 기존 Codex Site가 현재 허용된 경로다. 공개 /build-info.json의 커밋과 GitHub main을 읽기 전용으로 대조했다. 조사 당시 둘 다 `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`, 공개 builtAt은 `2026-10-25T02:45:26.159Z`였다. 실제 배포 대상은 기존 Codex Site `appgprj_6acd9a1a4ce4819184cc51672a764431`이며 미디어는 기존 R2의 media.tseng-law.com 경로를 사용한다.

사용자의 칼럼 작성·배포 요청은 검수된 콘텐츠를 이 기존 경로로 게시할 승인이다. 이를 별도 인프라 이전, Site 재생성, 직접 Sites/wrangler/Vercel 배포, DNS·도메인·R2 설정 변경의 승인으로 확대하지 않는다. 이 작업자는 조사와 담당 원고만 맡았으므로 실제 통합·push는 주 담당이 한다. 과거 Fable 고정 하청·검수 규칙은 2026-10-15 사용자 결정으로 폐기됐다.

Mac Air SSH는 읽기 전용 접속에서 permission denied였다. 현재 Sites 연결 도구의 get_site 역시 해당 프로젝트에 NOT_FOUND를 반환했다. 공개 사이트가 존재한다는 HTTP 확인과 이 연결 실패를 구별한다. Air의 현재 실행 로그·실시간 여유 디스크·메모리·최근 정확한 패키지 합계는 확인하지 못했다. 이를 이유로 새로운 Site를 만들거나 우회 배포하지 않았다. 비밀값을 출력하지 않았다.

## 저장된 실제 패키지 자료

출처: `docs/audit/traffic-action-20261015/sites-pack-summary.json`. 2026-10-15 보고서이며 현재 배포 커밋의 패키지 측정값으로 표현하지 않는다.

| 항목 | 실제 기록 |
|---|---:|
| HTML 페이지 | 2,448 |
| HTML 압축 전 바이트 | 332,133,848 |
| HTML gzip 바이트 | 72,044,770 |
| 나머지 자산 수 | 2,369 |
| 나머지 자산 바이트 | 86,822,096 |
| expandedBytes | 158,892,829 (151.53 MiB) |
| 상한 | 268,435,456 (256 MiB) |
| 당시 여유 | 109,542,627 (104.47 MiB) |
| 루트 언어 | 49 |
| 리디렉션 | 162 |

동일 시기 파일별 실제 크기는 `/Users/son7/tseng-traffic-action-next-20261015/qa/previous-build-metadata/sites-pack-manifest.json`에서 합산했다. 이 manifest의 buildInfo는 `7389db25f316051336da0491acb1ef7c54e7ecae`, `2026-10-15T09:07:05.969Z`다. 주요 합계: client/__p 72,044,770 B, client/fonts 61,342,804 B, client/_next 15,953,872 B, client/sitemap.xml 8,240,485 B, client/images 859,240 B. 본 보고서가 이 외부 폴더를 변경하지 않았다.

관련 `/Users/son7/tseng-traffic-action-next-20261015/qa/static-site-report.json`은 생성시각 2026-10-15T12:31:03.921Z, out 4,828파일/420,299,790 B/HTML 2,456개, sitemap 2,259개, brokenRefs·oversize·sitemapMissing 0을 기록한다. data:null이므로 현재 Air의 prod-mirror 입력을 재현한 완전한 운영 빌드라고 간주하지 않는다. out 원본 크기와 Sites packed expandedBytes는 서로 다른 지표다.

## 현행 코드가 실제로 제한하는 것

- `scripts/static-site/sites-pack.mjs:17`: SITES_EXPANDED_LIMIT = 256 × 1024 × 1024.
- 같은 파일 :100: 각 HTML을 gzip level 9로 개별 압축해 client/__p에 저장한다. 나머지 파일은 이 단계에서 그대로 포함한다.
- 같은 파일 :142–153: dist 내부 실제 파일 크기 합계를 expandedBytes로 계산하며 상한 이상이면 실패한다. 전체 tar.gz를 더 작게 압축하는 것만으로 이 조건을 해소할 수 없다.
- `scripts/static-site/verify.mjs:6`: 단일 파일 25 MiB를 초과하면 oversize에 넣는다. 단일 sitemap.xml은 gzip으로 바꾸지 않는 자산이므로 이 제한도 확인해야 한다.
- `scripts/static-site/crawl.mjs:42,95`: 동시 요청 기본 6, 요청별 timeout 120초. 전체 작업의 고정 timeout으로 혼동하지 않는다.
- `scripts/static-site/build.mjs`: Next production build → 로컬 서버 → 크롤링 → 정적 결과 검증. 기존 .env류 파일이 있으면 거부하며, 운영 미러는 지정된 --data 경로로 읽는다. 이번 조사는 이를 실행하지 않았다.
- `src/lib/columns.ts:363–381,574–581`: 프로덕션에는 언어/디렉터리별 파싱 결과 캐시가 있다. 모든 요청이 전체 Markdown을 다시 읽는다고 가정한 O(N²) 추정은 근거가 없다. 반면 최초 파싱 비용과 메모리 상주량은 원고 수와 함께 늘 수 있다.
- `scripts/static-site/air-deployer.sh:31` 부근: 잠금과 3시간 초과 잠금 정리가 있다. 향후 실행이 3시간을 넘으면 오래된 잠금으로 판단될 수 있다는 설계 검토 항목이며 현재 그런 중복 실행이 발생했다는 관측은 없다.

256 MiB는 현재 저장소 packer와 기존 보고서로 직접 확인된 운영 한도다. 이번 연결 실패 상태에서 외부 서비스 전체 상품의 최신 일반 한도를 별도로 인증했다고 주장하지 않는다.

## 2026-10-25 공개 HTML 실측

기준은 BRIEF의 초기 커밋 `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`에 존재하는 파일 기반 전문 칼럼 1,976편이다. 언어별 디렉터리의 git blob byte 순서로 정렬하고 25·50·75 분위 인덱스의 원고를 골랐다. 파일 크기가 곧 품질이나 본문 길이의 정답이라는 뜻은 아니다.

각 공개 URL을 Accept-Encoding:gzip, 고정 감사 User-Agent로 GET한 뒤 필요하면 전송 압축을 풀고, 받은 HTML 전체를 gzip level 9로 다시 압축했다. cookie·로그인·비밀 키를 사용하지 않았다. Node packer와 같은 압축 수준이며, Python/zlib 버전 차이나 gzip 헤더에 따른 작은 차이는 남을 수 있다.

- 측정 시작/기록 UTC: `2026-10-25T11:23:00.400312+00:00` (KST 20:23 무렵).
- 49언어 × 3편 = 147편, 전부 HTTP 200.
- 측정 전후 /build-info.json 커밋·builtAt이 같았다.
- HTML 평균 142084.79 B.
- 로컬 재압축 평균 30817.73 B, 최솟값 21288 B, 최댓값 46571 B.
- 요청 동시성 6, 전체 공개 GET 약 13.996초. CDN 읽기 시간이며 로컬 정적 생성 성능 측정이 아니다.
- 각 표본의 원본 파일명·바이트·결과 HTML SHA-256은 아래 부록에 남겼다. 공개 배포 이후 달라질 수 있으므로 나중 GET의 값과 자동으로 같다고 보지 않는다.

| 언어 | 초기 전문 칼럼 | 286까지 부족 | 표본 평균 gzip B | 표본 최소–최대 B | 추가분 추정 MiB |
|---|---:|---:|---:|---:|---:|
| ar | 26 | 260 | 30036 | 22970–37926 | 7.45 |
| bg | 21 | 265 | 34054 | 24649–43546 | 8.61 |
| bn | 21 | 265 | 32565 | 24161–40923 | 8.23 |
| ca | 21 | 265 | 30612 | 22318–39311 | 7.74 |
| cs | 21 | 265 | 31015 | 24385–37829 | 7.84 |
| da | 21 | 265 | 29886 | 22017–37688 | 7.55 |
| de | 26 | 260 | 28019 | 22672–36598 | 6.95 |
| el | 21 | 265 | 35943 | 25672–46571 | 9.08 |
| en | 208 | 78 | 31615 | 28196–35483 | 2.35 |
| es | 46 | 240 | 24743 | 22389–27217 | 5.66 |
| et | 21 | 265 | 30215 | 23534–37431 | 7.64 |
| fa | 21 | 265 | 31857 | 25516–38666 | 8.05 |
| fi | 21 | 265 | 30256 | 22412–38145 | 7.65 |
| fil | 26 | 260 | 28087 | 23290–36899 | 6.96 |
| fr | 29 | 257 | 27814 | 22393–35231 | 6.82 |
| he | 21 | 265 | 30965 | 24953–37965 | 7.83 |
| hi | 26 | 260 | 31949 | 25024–40109 | 7.92 |
| hr | 21 | 265 | 30326 | 23961–36545 | 7.66 |
| hu | 21 | 265 | 31950 | 24633–40001 | 8.07 |
| id | 31 | 255 | 26388 | 22409–33097 | 6.42 |
| is | 21 | 265 | 30506 | 22695–38626 | 7.71 |
| it | 26 | 260 | 27266 | 21288–36346 | 6.76 |
| ja | 220 | 66 | 34623 | 32120–37504 | 2.18 |
| km | 21 | 265 | 34717 | 26881–43309 | 8.77 |
| ko | 207 | 79 | 33802 | 31306–35831 | 2.55 |
| lt | 21 | 265 | 30202 | 22537–37098 | 7.63 |
| lv | 21 | 265 | 29790 | 22500–36967 | 7.53 |
| mn | 21 | 265 | 31557 | 23922–38745 | 7.98 |
| ms | 21 | 265 | 29000 | 22317–35373 | 7.33 |
| my | 21 | 265 | 33860 | 24937–42428 | 8.56 |
| nb | 21 | 265 | 29844 | 22067–37593 | 7.54 |
| ne | 21 | 265 | 32692 | 24180–41377 | 8.26 |
| nl | 21 | 265 | 30785 | 23972–38027 | 7.78 |
| pl | 21 | 265 | 31386 | 24459–38523 | 7.93 |
| pt | 26 | 260 | 27347 | 21425–36712 | 6.78 |
| ro | 21 | 265 | 30947 | 24122–38004 | 7.82 |
| ru | 21 | 265 | 34900 | 25266–44817 | 8.82 |
| sk | 21 | 265 | 31216 | 24652–37839 | 7.89 |
| sl | 21 | 265 | 30277 | 23850–36771 | 7.65 |
| sr | 21 | 265 | 30124 | 23695–36180 | 7.61 |
| sv | 21 | 265 | 29488 | 21930–36513 | 7.45 |
| ta | 21 | 265 | 33877 | 24734–42818 | 8.56 |
| th | 31 | 255 | 29698 | 24346–39194 | 7.22 |
| tr | 21 | 265 | 30358 | 24252–36133 | 7.67 |
| uk | 21 | 265 | 35146 | 26730–44517 | 8.88 |
| ur | 21 | 265 | 30759 | 23827–37282 | 7.77 |
| vi | 43 | 243 | 25312 | 21406–31185 | 5.87 |
| zh-hans | 26 | 260 | 26933 | 22851–34134 | 6.68 |
| zh-hant | 286 | 0 | 35361 | 32788–38691 | 0.00 |

## 계산식과 불확실성

목표 N = 49 × 286 = 14,014. 초기 전문 칼럼 1,976. 추가 필요 12,038. 언어별 현재 개수 n_l, 3편 표본 gzip 평균 g_l로 계산했다.

| 계산 | 결과 | 용도와 한계 |
|---|---:|---|
| Σ (286 − n_l) × g_l | 368751377 B = 351.67 MiB | 미작성 추가분 추정. 주제·길이 분포 변화 미반영 |
| Σ 286 × g_l | 431879639 B = 411.87 MiB | 목표 전문 칼럼의 압축 HTML 추정 |
| 목표 전문 칼럼 추정 + 옛 비HTML 자산 | 518701735 B = 494.67 MiB | 비칼럼 HTML·사이트맵 증가분 제외 |
| 옛 전체 pack + 추가분 추정 | 527644206 B = 503.20 MiB | 서로 다른 날짜를 합친 거친 시나리오, 현재 pack 예측 확정치 아님 |
| 모든 목표 칼럼이 관측 최소 21,288 B라고 가정 + 옛 자산 | 367.31 MiB | 낙관적 민감도 예시. 모든 미래 파일의 하한이라는 뜻 아님 |
| 옛 자산을 고정하고 비칼럼 HTML을 0으로 둔 허용 평균 | 12959.42 B/칼럼 | 현실보다 유리한 예산. 현재 표본 평균의 약 42.1% |

목표 칼럼의 압축 전 HTML 합계도 같은 평균을 적용하면 약 1.85 GiB다. 빌드 디렉터리·정적 out·pack·archive가 함께 존재할 때의 디스크와 피크 RSS는 별도 실측이 필요하다. 이 추정으로 RAM 사용량을 숫자로 단정하지 않는다.

49언어가 같은 주제를 채우면서 hreflang·언어 선택 링크가 늘면 현재 표본의 gzip 크기도 변할 수 있다. 기존 페이지의 증가분은 위 추가분 모델에 포함되지 않는다. 큰 글이나 긴 slug 비율이 달라지는 효과도 남는다.

## 사이트맵의 별도 크기 위험

2026-10-25 같은 공개 배포에서 GET한 /sitemap.xml: HTTP 200, 전송 gzip 402,621 B, 압축을 푼 XML 8,571,028 B, URL 2,674개. 그중 /<locale>/columns/<slug> 행 2,108개, 해당 행 평균 3,021.9967 B, 행당 xhtml:link 평균 23.3074개/최대 50개, 최대 행 8,414 B였다. 이 2,108은 파일 기반 전문 칼럼 1,976과 같은 집계가 아니다. 이슈·미러 데이터 등 나머지 경로를 이번 조사에서 전수 재분류하지 않았다.

현재 칼럼 행 평균만 14,014개에 적용해도 40.39 MiB이며 비칼럼 행은 별도다. 따라서 현재 형태의 단일 XML은 25 MiB 파일 제한에 먼저 걸릴 수 있다. 모든 언어에 같은 286 주제가 생겨 대체 언어 링크가 최대치에 가까워지는 경우에는 더 커질 수 있다. 이는 URL·alternate 구성 가정에 의존하는 추정이며 최종 XML 실측은 아니다. 첫 User-Agent 없는 접근은 403이었고, 명시한 감사 User-Agent로 재요청하여 위 수치를 얻었다.

## 빌드 시간의 실제 근거

`docs/audit/arc-visas-20261024/checks/static-build-final.log`의 실제 기록은 “crawled 2517 pages, 9 files, 0 redirects in 68s”다. 정적 결과는 5,099파일/431.9 MB/HTML 2,728개, sitemap 2,512/2,512였다. 이 로그에는 당시 broken references 7개와 미디어 누락도 기록되어 있다. 그 뒤 수정 커밋이 있으므로 이를 현재 배포 결함으로 재사용하지 않는다.

현재 공개 sitemap 2,674에 추가 전문 칼럼 12,038을 단순히 더하면 14,712 URL이다. 같은 환경·페이지당 비용·동시성을 가정해 68 × 14,712 / 2,517 = 397.5초, 약 6.6분이라는 크롤 단계의 선형 시나리오를 얻는다. Next 컴파일·의존성 설치·cold parse·미디어 처리·gzip 포장·업로드·게시·공개 검증 시간을 포함하지 않는다. 기존 68초 로그가 현재 Air와 동일한 하드웨어인지도 인증하지 않았다. 이를 전체 배포 완료 시간으로 제시할 수 없다.

Air의 10분 주기와 문서의 통상 20–40분 대기 안내는 예약·운영 설명이다. 14,000편 목표의 처리시간 보장은 아니다. 잠들어 있거나 접근 불가한 Air에서 이번 전체 목표 스트레스 테스트는 수행하지 않았다.

## 통합 담당에게 넘길 검증 항목

1. 소규모 원고 배치마다 실제 운영 미러 입력을 사용하는 전체 build와 pack 보고서를 남겨 증가량을 누적한다. 페이지 수·sitemap 누락·압축 HTML·비HTML·expandedBytes·headroom·단일 최대 파일·build/crawl/pack 각 시간을 분리한다.
2. 검증 exit 0만으로 완료 처리하지 않는다. build.mjs는 sitemapMissing/oversize/flightErrors 등의 조건으로 실패하지만 brokenRefs·crawlmissing 등 모든 보고 항목이 자동 실패는 아니다. browser-check.mjs 역시 오류 집계를 읽어야 한다.
3. 전체 목표를 수용하려면 공통 HTML 중복과 응답 구조, 자산 포함량, 사이트맵 분할 등 현재 배포를 유지한 코드 설계의 효과를 실제 pack으로 입증해야 한다. 공통 파일화가 정적 SEO 본문·접근성·hreflang·라우팅을 훼손하지 않는지도 검증한다. 한 줄 설정이나 바깥 tar 압축만으로 해결됐다고 주장하지 않는다.
4. 인프라 변경이 필요하다는 결론이 나더라도 별도 결정 사항으로 다룬다. 이번 승인 범위에서 타 호스트로 이전하거나 기존 Site·DNS·R2를 건드리지 않는다.
5. 용량을 맞추려고 본문을 요약본으로 대체하거나 번역 없는 영어 fallback, 빈 페이지, 중복 주제, 검색에만 보이는 우회 페이지를 완료량으로 계산하지 않는다. BRIEF의 실질 칼럼 조건은 유지된다.

## 재현 표본 부록

후속 압축 실험: [packer-capacity-experiments.md](./packer-capacity-experiments.md)와 [재현 스크립트](./packer-capacity-experiment.mjs). 동일 배포의 147개 공개 응답을 다시 캡처해 Node v24.14.1/zlib 1.3.1-e00f703로 짝비교했다. 원래 이 문서의 Python/zlib 표본값과 달리 Node gzip9 합계는 4,561,429 B이며 목표 전문 칼럼 단순 외삽은 434,856,231 B, 약 414.71 MiB다. 압축기 버전 차이가 있으므로 운영 Air의 실제 런타임 결과가 최종 기준이다. 새 응답의 총 HTML 바이트는 같지만 끝부분 Cloudflare challenge 스크립트의 응답별 r/t 값 때문에 해시는 달라졌다. 원고나 공개 배포 커밋이 달라졌다는 증거로 해석하지 않았다. 아래 부록은 최초 측정 기록으로 보존한다.

분위는 Markdown byte 순서 기준이다. URL은 `https://tseng-law.com/<언어>/columns/<아래 파일명의 .md 제거>`다. ko 파일은 columns, zh-hant는 columns-zh, 나머지는 columns-<언어>에 있다. gzip 값은 받은 전체 HTML을 로컬 gzip level 9로 재압축한 바이트다. 해시는 압축 전 HTML SHA-256이다.

| 언어 | 분위 | 파일명 | Markdown B | 공개 HTML B | gzip9 B | HTML SHA-256 |
|---|---:|---|---:|---:|---:|---|
| ar | 0.25 | `701-uae-court-judgment-taiwan-enforcement.md` | 10637 | 109653 | 22970 | `0b78d0f62bc28aa7cbd8c0cf7583c0a8014d7de007e11fa18b4a9502d2952d47` |
| ar | 0.5 | `008-taiwan-labor-severance-law.md` | 16512 | 144150 | 29213 | `914f66815e698d6bc519369416cd7a1006a7b0844f78c9b6b20cdc41b0fc9e58` |
| ar | 0.75 | `001-taiwan-company-establishment-basics.md` | 34976 | 185019 | 37926 | `786639fca774f3c38036d38a286c38a1baf01699b9f8bd9af7472a8b131483c8` |
| bg | 0.25 | `012-taiwan-overtaking-accident-liability.md` | 12167 | 119689 | 24649 | `fb79a7ed5a7e6cf33e291fc7049f3f9684cf70aa7e1ff4bf412d9d64a71f3c22` |
| bg | 0.5 | `010-taiwan-gym-injury-lawsuit.md` | 30700 | 156938 | 33966 | `3b320331185ddad0ebc8e73100b0295ee142bac3e816fdd13adf43689c56c303` |
| bg | 0.75 | `003-taiwan-traffic-accident-procedure.md` | 53613 | 208134 | 43546 | `ec700d0774625d08353eca19142b5c09617e863af888510a290bb7e203de3215` |
| bn | 0.25 | `012-taiwan-overtaking-accident-liability.md` | 12550 | 127228 | 24161 | `3937f17be1183f60b8705e5c6d003c34d5e186e8e485c9886626a728ca7f5ef8` |
| bn | 0.5 | `010-taiwan-gym-injury-lawsuit.md` | 31916 | 166823 | 32610 | `242dfaefdbb8f955ac7a870937aff375c5851eb71b8526b896a9d6b73c26b6cb` |
| bn | 0.75 | `003-taiwan-traffic-accident-procedure.md` | 57485 | 223678 | 40923 | `a64153de6b638b77cda9c2a2c8f3a141155c24cfd0cdeafce4bbc0a193d31e3d` |
| ca | 0.25 | `012-taiwan-overtaking-accident-liability.md` | 7047 | 101236 | 22318 | `6b2790e3e4ff3760e2f697ef5c3b23604727b9acbbd70b597a3a95767ec1d9cb` |
| ca | 0.5 | `018-taiwan-semiconductor-market-entry.md` | 16792 | 130923 | 30208 | `ef18aa840987edd1e0e127e6df4ec09bc8fc8343c1b0fa9d27c3b2f6c4d5308d` |
| ca | 0.75 | `003-taiwan-traffic-accident-procedure.md` | 32818 | 158823 | 39311 | `14f5628332c46bc7350424ff6c543e5de9d5a6ef93aa7704a3e3d3e70a447f09` |
| cs | 0.25 | `013-taiwan-company-establishment-advanced-1.md` | 6420 | 108179 | 24385 | `914705f27adb622b182d3d30ff754499c3132ccc526a26ff428f0dd8bdc980cd` |
| cs | 0.5 | `018-taiwan-semiconductor-market-entry.md` | 16452 | 130939 | 30831 | `025f6f027b18ce5abb0058df6765001c9e874bf77f7ee4844585fddc9287800e` |
| cs | 0.75 | `014-taiwan-mandatory-employment-period.md` | 29969 | 163134 | 37829 | `b0cd8ad95496287778b03edafa55f1d4eb5b3e1ddd0b48323f1159286707b874` |
| da | 0.25 | `012-taiwan-overtaking-accident-liability.md` | 6655 | 99938 | 22017 | `061d034c47e08fedaca1400fc5c940b4b0b8808b0b999026027f2670e581a101` |
| da | 0.5 | `018-taiwan-semiconductor-market-entry.md` | 16436 | 129505 | 29954 | `795a4252bcbac027e61ce155b45a05a5dd7631ff96238f15bb3d13c7a5ded125` |
| da | 0.75 | `003-taiwan-traffic-accident-procedure.md` | 29696 | 152139 | 37688 | `536a8302d5a28b1922b871cd4ff948751fe7a011b36f81a62ee0825a9fdd2272` |
| de | 0.25 | `680-taiwan-bauteile-maengelruege-pruefmuster.md` | 9485 | 94820 | 22672 | `a4d6a92a50748a45a22d339b05a43e6aa6fe5ce18622c4c5fb68ccd3188ad93f` |
| de | 0.5 | `706-taiwan-arc-renewal-changes-reentry.md` | 13442 | 109683 | 24787 | `927120286119b86d30cbd648db3e5f870fd53ab0c295654f74673607e26193c0` |
| de | 0.75 | `001-taiwan-company-establishment-basics.md` | 29086 | 158986 | 36598 | `e037b0d8cbb648c78610b701d9f75c0d903bcbbd3eb8b2c537cf976439583a94` |
| el | 0.25 | `012-taiwan-overtaking-accident-liability.md` | 12055 | 120026 | 25672 | `1535af0faff160d66abb4236b7214bddb2bb1e041ae1b395013dac43bd9571b4` |
| el | 0.5 | `010-taiwan-gym-injury-lawsuit.md` | 31198 | 159409 | 35586 | `57f1b8c632cc610aea60b02553b0f356205e91634b14a4fbe7996a18ce452c8c` |
| el | 0.75 | `003-taiwan-traffic-accident-procedure.md` | 55425 | 213393 | 46571 | `e8cea542c7de7d9d110de11fce0fbd1ffb963573ed0657e4487d33aaff43cd20` |
| en | 0.25 | `493-us-ai-chip-taiwan-packaging-capacity-prepayment-refund.md` | 8584 | 116311 | 28196 | `af606be8f9c14a492e91c22862d86f3edb717810c9d4fb6a814383dc1f6b4ef4` |
| en | 0.5 | `644-taiwan-criminal-exit-ban-foreign-defendant-temporary-travel.md` | 12281 | 131593 | 31166 | `8ee1b67c61cb815ba172c293e35aa7bb9c2c24d4433edd79e04f8b8ea52d97d4` |
| en | 0.75 | `010-taiwan-gym-injury-lawsuit.md` | 16615 | 148812 | 35483 | `aa814f89f0bbcb8bc9571b84fbd24e542e293e714588204e6b1891d87daff028` |
| es | 0.25 | `689-spain-exporter-taiwan-unpaid-invoices.md` | 9312 | 99598 | 22389 | `bbd86e0ca5f5d4799f54adca7ae87819b473b41b5072c3dad92e11915e5290eb` |
| es | 0.5 | `704-taiwan-arc-first-application.md` | 11698 | 108052 | 24623 | `d5d248d486d3cbe71fb4db7f92b7410c9882013f8d33b30a6ac194bb21e8d9c0` |
| es | 0.75 | `648-taiwan-securities-broker-employee-dispute-sfipc-mediation-foreign-investor.md` | 15257 | 120722 | 27217 | `d9d4fd2a1ce9d9ff7429653ce75a549662bcc9d0165230bd64cfc2311c256aec` |
| et | 0.25 | `013-taiwan-company-establishment-advanced-1.md` | 6065 | 106247 | 23534 | `a1311f84ee05465d7cbb3284abd2a5ec9c874dd3d104c9b3326ccaa39c7a2093` |
| et | 0.5 | `018-taiwan-semiconductor-market-entry.md` | 15571 | 127492 | 29679 | `ae598d31ea8e6de64780b49ef79823f7d46cb1dbf3ca60ec7d3325ebf7ffadcf` |
| et | 0.75 | `016-taiwan-inheritance-custody-analysis.md` | 28342 | 157685 | 37431 | `229778df2cd379ebd5bc01c27e7e589e5e9beeb4b274dfff35097ef6a4d93da2` |
| fa | 0.25 | `013-taiwan-company-establishment-advanced-1.md` | 9100 | 122842 | 25516 | `8be0f64ec3368e92005b980904d8406ce6c4e8669c7d8daacd20ca4419239fad` |
| fa | 0.5 | `010-taiwan-gym-injury-lawsuit.md` | 22058 | 141731 | 31388 | `b2a45e85b844cc995684a5e8a4bc39f975a8532ea1197d0df354dd1676070f6c` |
| fa | 0.75 | `014-taiwan-mandatory-employment-period.md` | 38641 | 191216 | 38666 | `c23c93ee7f7aa0d0ebd55a29392e3174c54b5010afdcea4cc0651218f46c82ab` |
| fi | 0.25 | `012-taiwan-overtaking-accident-liability.md` | 6509 | 99943 | 22412 | `4492912b93f27620357eb8bff4801362201ee31c5a77037392b06dc755bc7473` |
| fi | 0.5 | `018-taiwan-semiconductor-market-entry.md` | 16621 | 130437 | 30212 | `390184d9bd4e8906bb870e10e075b6c904570dc7019cd142339cdf56ce1a27d7` |
| fi | 0.75 | `003-taiwan-traffic-accident-procedure.md` | 30250 | 153781 | 38145 | `d2d0c9c026ff5f4515560c23899cd6724e9f14a36be2e85e1fdbaf12818b2065` |
| fil | 0.25 | `012-taiwan-overtaking-accident-liability.md` | 7705 | 105961 | 23290 | `7c10b3d45690e3642222423ab0d0c3541088ff37b82a3514e068d23ae8b4e18f` |
| fil | 0.5 | `802-filipino-factory-worker-taiwan-overtime-deductions-broker-fee.md` | 12086 | 107625 | 24071 | `f6d947f8e1017b03b9053daeca5de4ce18e57a445b4abd288050859fb593cf4f` |
| fil | 0.75 | `001-taiwan-company-establishment-basics.md` | 31073 | 167744 | 36899 | `6013562688153b89af377bf14dd97d24da0c92fd4ecc4a7d30ec01455f1a7bde` |
| fr | 0.25 | `676-french-supplier-taiwan-distributor-termination-stock-online-accounts.md` | 9082 | 98068 | 22393 | `2bfd8e7b8f10e0f0a67fcd4cf9a4fc26294503da30f752eecc209dc14f0bf340` |
| fr | 0.5 | `653-taiwan-business-takeover-shares-or-assets-foreign-buyer.md` | 14166 | 113644 | 25818 | `f48faf4163d02629fd73a2e82c384faf90936ad55d11924f5cd413be67b741b3` |
| fr | 0.75 | `017-taiwan-logistics-business-setup.md` | 29386 | 166191 | 35231 | `81177b6ba148c3261cb35d01a2826b469b2bef5480bd6c00c39690308bd909fa` |
| he | 0.25 | `013-taiwan-company-establishment-advanced-1.md` | 7813 | 118669 | 24953 | `7d27bf886d06cd804abd86ff2f6b2457ae375700c1e64617d752df6aed6a428d` |
| he | 0.5 | `010-taiwan-gym-injury-lawsuit.md` | 19353 | 135556 | 29978 | `443226c0c1b456cb12a34ab9a660294cbbedbf40ba12a0c75b8d55a54ade98a1` |
| he | 0.75 | `014-taiwan-mandatory-employment-period.md` | 35794 | 183416 | 37965 | `40c8f88f66748d68a24d856555b96480ca300e890dfb64cce3c6a04ade2e8615` |
| hi | 0.25 | `672-indian-resident-taiwan-rental-deposit-handover.md` | 16883 | 132688 | 25024 | `511b963f6babc1b24920df338740bdcbce93392a091d604d2851613506fead61` |
| hi | 0.5 | `008-taiwan-labor-severance-law.md` | 25194 | 172933 | 30715 | `0d3b68b8abafbd924adb9ecd40d161a896078fae219cf73e1117c1179559be8c` |
| hi | 0.75 | `001-taiwan-company-establishment-basics.md` | 50777 | 227523 | 40109 | `afb71114cef92eed43e031fe61e7038ffa6c0b8285d21deef465817c6426d107` |
| hr | 0.25 | `013-taiwan-company-establishment-advanced-1.md` | 6132 | 106846 | 23961 | `8057d3f40492dc750eb1e0d8a3572180cb53e658e6d3a38e828d49dd67b50226` |
| hr | 0.5 | `018-taiwan-semiconductor-market-entry.md` | 16202 | 129403 | 30472 | `c11caef6d0be11f863cdbee50a2c10875756a46761ab5bb44e7343bb4cdffc20` |
| hr | 0.75 | `014-taiwan-mandatory-employment-period.md` | 28090 | 157971 | 36545 | `8d5df9959a74d41252ba3b2de35f678fceaece6480af4789cee755c0b60a8188` |
| hu | 0.25 | `013-taiwan-company-establishment-advanced-1.md` | 6905 | 109147 | 24633 | `3035f3d627e7490323c5641dc9da342360f4ce53a71072c6412be78578edf14f` |
| hu | 0.5 | `018-taiwan-semiconductor-market-entry.md` | 18632 | 135524 | 31216 | `0bf044424e344f28f08669bc528287100d20ffe7c38425cdd87e1b96ad8fd6c5` |
| hu | 0.75 | `003-taiwan-traffic-accident-procedure.md` | 33461 | 160810 | 40001 | `cc2101af37286b3586726ec7e0804139a0856cf1630c29d86ce58cbe9a2c570d` |
| id | 0.25 | `013-taiwan-company-establishment-advanced-1.md` | 7315 | 107895 | 23658 | `051da52d7ea229728709726b09c52c642f54d1104d21e950d4aced9efa99504f` |
| id | 0.5 | `668-indonesian-buyer-taiwan-machinery-defect-notice.md` | 10671 | 99735 | 22409 | `ace1aecb95adfb45b7be5679a3c8026c35dcb30fe55c29da7a8a840daec9b1b0` |
| id | 0.75 | `011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md` | 23793 | 154762 | 33097 | `4401eef70bf21c01d12dc1e293c108c8ffcd4ba920bce64986d09e5d3d7bd789` |
| is | 0.25 | `012-taiwan-overtaking-accident-liability.md` | 6460 | 101240 | 22695 | `2f2f039f19155ee7601b404d44471eb5c097b6edbadf59e360d2f663daf057e2` |
| is | 0.5 | `018-taiwan-semiconductor-market-entry.md` | 16000 | 129546 | 30198 | `c9a848c74c7af2aca4888ee17e5f6075bcae56990bf5407c074c861759a805eb` |
| is | 0.75 | `003-taiwan-traffic-accident-procedure.md` | 29505 | 153527 | 38626 | `2b0e4f35171d091c51eb3fefc392f47bf3dbc7297c9688a531814ce7157f60ae` |
| it | 0.25 | `685-italian-brand-taiwan-distributor-trademark-registration.md` | 8667 | 94907 | 21288 | `6f6c5ccd139a23a06a37774f0aabe6a06ff23b912f0cf581609afb565f154ace` |
| it | 0.5 | `706-taiwan-arc-renewal-changes-reentry.md` | 11901 | 106617 | 24165 | `b1cf76a554f0a8f1ea485a2330c69d1419121aa294a4e1ffd8073b3ffc7808f1` |
| it | 0.75 | `001-taiwan-company-establishment-basics.md` | 29594 | 161396 | 36346 | `61a5e52420037a8717663dc109cf646ebb722179832eae66f2c603d053adf64d` |
| ja | 0.25 | `429-taiwan-assault-damages-attached-civil-action-japanese.md` | 9725 | 132398 | 32120 | `c3d800e9c4df5c0a3b849b022ecc5af329cc97477f32192a3dbcfc80940704c0` |
| ja | 0.5 | `026-foreign-heir-taiwan-succession-law-land.md` | 14344 | 143783 | 34244 | `32fa64b5b5ecfabcf45598878f9b96d079b27920ca00f7cc11cbe79daf89d98d` |
| ja | 0.75 | `047-foreigner-buy-sell-taiwan-real-estate-tax.md` | 18830 | 156099 | 37504 | `d71de9c9a2a240ef747d007ac4cb01fcb1e18c9648f10749ef2dfd51d6ce6f64` |
| km | 0.25 | `013-taiwan-company-establishment-advanced-1.md` | 15207 | 145346 | 26881 | `414873f1807a315b78f1fbfd087c72c5aa8842f77646122ef5d89a58005935b3` |
| km | 0.5 | `010-taiwan-gym-injury-lawsuit.md` | 38177 | 182013 | 33961 | `ca358a36a23a07ccc216d297d3233330845db15d5f5f6ece130500915a6bdae8` |
| km | 0.75 | `003-taiwan-traffic-accident-procedure.md` | 69817 | 252117 | 43309 | `cbd08d8f03ca08dc4b07c1e9df781e6398ed0b4c996ae8e3c9852a3623fb0f6e` |
| ko | 0.25 | `659-taiwan-visitor-commercial-activity-deportation-entry-ban.md` | 9219 | 137564 | 31306 | `a6b09a8a0237506c49bf4d0fe71f5fbfe63b0826714e442433a49f0f82526b15` |
| ko | 0.5 | `517-taiwan-bankruptcy-creditor-claim-filing-korean.md` | 12844 | 141964 | 34270 | `09ce6e7125c90971f8be5f9b817eec61a0ea552f89855d21f2017b2e0b7965ce` |
| ko | 0.75 | `257-taiwan-naturalization-keep-original-nationality.md` | 17570 | 158184 | 35831 | `4fdf2b15c10772f62a1ba2ba9e18dc97f277fcec804b71b041dca0414dc29f16` |
| lt | 0.25 | `012-taiwan-overtaking-accident-liability.md` | 6692 | 100902 | 22537 | `a74a1f476533a180102ad198d8663ae5d9660a22794979a30806f41385ebed70` |
| lt | 0.5 | `018-taiwan-semiconductor-market-entry.md` | 17112 | 131645 | 30972 | `d5164d7dc702dca669d49b538b1be874c05ae4356646da7d0721d2814682cd50` |
| lt | 0.75 | `014-taiwan-mandatory-employment-period.md` | 30010 | 163019 | 37098 | `64a99291ce215119d69a7cab2067f8b5b3fbccfe849399bdfbfdfa11f254546e` |
| lv | 0.25 | `012-taiwan-overtaking-accident-liability.md` | 6666 | 101468 | 22500 | `9cad2181a5704b52e96d3d965018d4e25a5053806b62652bb889bc96dc32b573` |
| lv | 0.5 | `018-taiwan-semiconductor-market-entry.md` | 16389 | 130037 | 29902 | `25b76f75cde444b66c227865b53f97e74fed4eef03a56c2c46bf63de821f5466` |
| lv | 0.75 | `014-taiwan-mandatory-employment-period.md` | 30526 | 163854 | 36967 | `37d1d670500e8a0a9dc7a0c9ca39e06525fed95ca643ca7e73e3263373de9125` |
| mn | 0.25 | `012-taiwan-overtaking-accident-liability.md` | 10160 | 118899 | 23922 | `ac88cb41c6c560304cf3d438a76a052f35d77d176b56f8f2044baf4e9ee27ef6` |
| mn | 0.5 | `010-taiwan-gym-injury-lawsuit.md` | 26132 | 151371 | 32004 | `bdde28a2d834f810e5e2f7eb8d8f4159b64715df01e06aef93b0279d9ed31dc2` |
| mn | 0.75 | `014-taiwan-mandatory-employment-period.md` | 47260 | 213351 | 38745 | `5a1bcb4e7f7b7449e78772655f8eef342528fa99802382975d4f2596ab81149f` |
| ms | 0.25 | `012-taiwan-overtaking-accident-liability.md` | 6693 | 103537 | 22317 | `5f25400bf6d45efa7b85d8262d77150539a10d9d081d6bd90caf527c9521e797` |
| ms | 0.5 | `018-taiwan-semiconductor-market-entry.md` | 16191 | 131709 | 29310 | `a55fcfc38c21fbff5996915ad90ca54f428cd9609cc00456eb233dbae1b96a82` |
| ms | 0.75 | `014-taiwan-mandatory-employment-period.md` | 29590 | 163335 | 35373 | `ed9989546ea759b702a71d22f1d347c46095eaf8a885a4c3facc076c08c3acf8` |
| my | 0.25 | `012-taiwan-overtaking-accident-liability.md` | 15907 | 139300 | 24937 | `0437f8582e4ba74e97e46c8665c9914e05012f4488f1ca3f07c7b92b3c2d153d` |
| my | 0.5 | `010-taiwan-gym-injury-lawsuit.md` | 42897 | 193429 | 34214 | `f025ef52ea980ba367cee330987b850e761fd219c5714a0f036b3e4cb14f4d81` |
| my | 0.75 | `003-taiwan-traffic-accident-procedure.md` | 72005 | 258206 | 42428 | `bd2304fa0ba49f9eb57d75e65f77409b1e1664803b2eca273a44b0642e397820` |
| nb | 0.25 | `012-taiwan-overtaking-accident-liability.md` | 6700 | 100766 | 22067 | `08c4167403b5da923e6e8e67820e2106e94dba56f3e0f81eec28c639717012b5` |
| nb | 0.5 | `018-taiwan-semiconductor-market-entry.md` | 16484 | 129511 | 29872 | `38dcc260497bb6371133718130f6f20ad24ac346f576e426be26995689fe2b76` |
| nb | 0.75 | `003-taiwan-traffic-accident-procedure.md` | 29077 | 151908 | 37593 | `1e5d74ee54da68fae8ed8735b7fd559ec78c4f29499bc29bc8bb021583fc2468` |
| ne | 0.25 | `012-taiwan-overtaking-accident-liability.md` | 12385 | 126982 | 24180 | `3e7fb1404272d914bfa3ccceb454d5d156e00dc3783b7b2eadd477484d7b1ca3` |
| ne | 0.5 | `010-taiwan-gym-injury-lawsuit.md` | 31779 | 165957 | 32520 | `2365673d449e701ede4175af467dbee97bf9b99d3d75015717e0e46d07c13331` |
| ne | 0.75 | `003-taiwan-traffic-accident-procedure.md` | 56337 | 221182 | 41377 | `7e23b1b299444a39874c8117badbeb6dc9b77d99cfae6f5107e15aaa25047d9c` |
| nl | 0.25 | `013-taiwan-company-establishment-advanced-1.md` | 6999 | 108449 | 23972 | `cf63be4d39c824f41f34904c965b36f12738babe690f4f8c875969d1afab4dad` |
| nl | 0.5 | `018-taiwan-semiconductor-market-entry.md` | 18063 | 133332 | 30356 | `8e60a774bfb45a1b7c2880ec623975c14300691f156c55b64c1872570dfc3168` |
| nl | 0.75 | `003-taiwan-traffic-accident-procedure.md` | 31633 | 156331 | 38027 | `d6961c052445ead89018bfde11f91de7fe80a3df5123ece45ec78d8a643089f8` |
| pl | 0.25 | `013-taiwan-company-establishment-advanced-1.md` | 6475 | 108009 | 24459 | `790fd17f723a99a63a5dd4e24dca56296f7e0852aa4bcf145526e5a4442ddeb4` |
| pl | 0.5 | `018-taiwan-semiconductor-market-entry.md` | 16781 | 131190 | 31177 | `d63ae176aeacd55dc2c572643bbe34b215b9b6acc48c0c085469536cc36ceb05` |
| pl | 0.75 | `014-taiwan-mandatory-employment-period.md` | 30836 | 164455 | 38523 | `08017bbd8845b7aba47e2fec9ef95a64b00738feb4f79a7628bd4ed1b4fb88ab` |
| pt | 0.25 | `696-portugal-sentenca-arbitral-bens-taiwan.md` | 7858 | 92505 | 21425 | `c863551dc6bb0afdb62334077772b416f21d68a3cf1e305db1ff44b0a8453f21` |
| pt | 0.5 | `705-taiwan-visa-residence-work-study-family.md` | 11044 | 105985 | 23903 | `913b4f9ab3f72d663149ea118c312202fcc905407aa9f8e1b23d38882cc3742d` |
| pt | 0.75 | `001-taiwan-company-establishment-basics.md` | 29597 | 162360 | 36712 | `f3bc2bdf3916f0bcbb40c6724796d638768e48b07ec8bcd5cc1daba544b84a2b` |
| ro | 0.25 | `013-taiwan-company-establishment-advanced-1.md` | 6925 | 109380 | 24122 | `3b514f54d6317692fbdaf03554084460e52185d607d878e82f727d2d1630fa60` |
| ro | 0.5 | `018-taiwan-semiconductor-market-entry.md` | 17440 | 132730 | 30715 | `ef190c427849f6539b7a16ab9abf85bdaadff92d29450e94dd35941d8dd92c30` |
| ro | 0.75 | `014-taiwan-mandatory-employment-period.md` | 32553 | 168581 | 38004 | `06b6a3ab05861b97346116f0737dbf024eebbe94aeaaf6dbc00c63f5d07d24ac` |
| ru | 0.25 | `012-taiwan-overtaking-accident-liability.md` | 11821 | 119420 | 25266 | `24f782913bf056ec127032cfe97886c2890a4acc7b65ff42d931c6661a440d2c` |
| ru | 0.5 | `010-taiwan-gym-injury-lawsuit.md` | 30082 | 155761 | 34616 | `4386bc1961f36f50852ce0de9daffa23a644fcbc09fa0f4d11a2ee019f3482ac` |
| ru | 0.75 | `003-taiwan-traffic-accident-procedure.md` | 53198 | 208507 | 44817 | `ba304fa5bca99ffc02ab57b41f9ae43bd93fb5d39dff6acb3d71474ad9bf3b25` |
| sk | 0.25 | `013-taiwan-company-establishment-advanced-1.md` | 6403 | 108403 | 24652 | `6906f435e17bcd954411616f9de8ce8acf674f482d07b8ba8b0bb620e3de9ddd` |
| sk | 0.5 | `018-taiwan-semiconductor-market-entry.md` | 16467 | 131087 | 31156 | `a18c9ec398bee6baf819d24c25cd8059e6c0b1c005edb5b26a1aafe700b4462a` |
| sk | 0.75 | `014-taiwan-mandatory-employment-period.md` | 29790 | 162754 | 37839 | `92dc80ea7c18d178dd031d3c830f363420b02c4998ecb7ba61c9a0f3507fa2e9` |
| sl | 0.25 | `013-taiwan-company-establishment-advanced-1.md` | 6038 | 106616 | 23850 | `696c5631176a1b3817c5b95bc2f0d9f47bd30182d509b80172b3235de7c6cd1d` |
| sl | 0.5 | `018-taiwan-semiconductor-market-entry.md` | 15608 | 128156 | 30211 | `82e4c23bb3cff4365d65065f6c5caffa9ae7269f31f7814feb7356b190947245` |
| sl | 0.75 | `014-taiwan-mandatory-employment-period.md` | 29527 | 161565 | 36771 | `1d9ad4d6a73518d664838f7ad5c8383de82a483ad0b2a369b4332ca8b36e3357` |
| sr | 0.25 | `013-taiwan-company-establishment-advanced-1.md` | 6083 | 106420 | 23695 | `879d6d0358e9eeb9a8bc11475a1ac16b090f3b4223323c4d752ea9d4c4182df4` |
| sr | 0.5 | `018-taiwan-semiconductor-market-entry.md` | 15695 | 128627 | 30497 | `f0334442515327bd9164c19e9b8d74e62d1e7e954b9b80f5576698f70e6405d3` |
| sr | 0.75 | `014-taiwan-mandatory-employment-period.md` | 27329 | 155726 | 36180 | `e5e9fc87f93bd10c1b486bcdb733028b1a831ba271c138caaff65812a7958100` |
| sv | 0.25 | `012-taiwan-overtaking-accident-liability.md` | 6217 | 99105 | 21930 | `feb499d955c943290075f09e0a0d2e25688fb8bd70907b1c24adb4cc3a074a9e` |
| sv | 0.5 | `018-taiwan-semiconductor-market-entry.md` | 16619 | 129676 | 30020 | `abf24f75392fcaf70486ede6a72b84c322f3393c1231a4060fd2f864cf96e0d4` |
| sv | 0.75 | `014-taiwan-mandatory-employment-period.md` | 30562 | 163009 | 36513 | `61a5b87b46922aad00e80346ad44f3f25bbd37328b0b5042c6f408be75a68e6a` |
| ta | 0.25 | `012-taiwan-overtaking-accident-liability.md` | 15899 | 138376 | 24734 | `51aba2c923014e939dd066a03679c8497e3d9f5e46d1f4d4b9e2841079a517b1` |
| ta | 0.5 | `018-taiwan-semiconductor-market-entry.md` | 40341 | 205485 | 34078 | `5c9858c033853164757185ef09a733510ddf8bb5fa0fa03f605a8ca46acdbf67` |
| ta | 0.75 | `003-taiwan-traffic-accident-procedure.md` | 70840 | 254169 | 42818 | `445f77548426547080bdf0ecb15b3149c09bc9cbcacc41c095d313ae42ab8c6b` |
| th | 0.25 | `020-taiwanese-spouse-divorce-from-abroad.md` | 15624 | 128326 | 24346 | `17956030b497240051a80a6fb364f65dea5057f385ef2c7be17bad2fef6b738c` |
| th | 0.5 | `663-thai-supplier-taiwan-buyer-unpaid-invoice.md` | 20657 | 141083 | 25554 | `7f237fc08c51c04bee8f3760a77559fa5079496fbf3a1f25b6a9aa9ddb687ef4` |
| th | 0.75 | `011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md` | 55247 | 242117 | 39194 | `624eb514d4d1f13751dcd60a0644e6f05a54f0204e28ea21318cd3ba20b02b6f` |
| tr | 0.25 | `013-taiwan-company-establishment-advanced-1.md` | 6261 | 109778 | 24252 | `2afdc1088d058a6eec175e0753a5df0b98520d5e6d679ff08bfbd58c0a0ec315` |
| tr | 0.5 | `018-taiwan-semiconductor-market-entry.md` | 16235 | 132356 | 30689 | `6cb9ab5f6d03bbc23ec93f3d7e590f700e78bad42871f1c8e9bed700fdcb22c0` |
| tr | 0.75 | `014-taiwan-mandatory-employment-period.md` | 28678 | 161860 | 36133 | `38b871c7ce6241760ba033805059b2f3e405300448ca918365a65b3574521f4d` |
| uk | 0.25 | `013-taiwan-company-establishment-advanced-1.md` | 10774 | 125155 | 26730 | `0c2e258c3a882ca81c8a4f56a66062dd8115d305679d69a6d5e72f77a2a1e95e` |
| uk | 0.5 | `010-taiwan-gym-injury-lawsuit.md` | 28543 | 151785 | 34192 | `649ab87a4f6d2b211161c8a494c24bf7a4ffaa276243c0bb2997d814908d1c81` |
| uk | 0.75 | `003-taiwan-traffic-accident-procedure.md` | 50486 | 202242 | 44517 | `4d8678445eaba10bda76317e37cda581c182bb7edd1408a0411fbcf5b9f61506` |
| ur | 0.25 | `012-taiwan-overtaking-accident-liability.md` | 8613 | 114144 | 23827 | `4b2b4fb49bbc7ea1fb759e6b694af8c3f805fd52217f5589b9beb06ddd6138c8` |
| ur | 0.5 | `010-taiwan-gym-injury-lawsuit.md` | 22181 | 141925 | 31168 | `65feb738a733e55d4dd44cf6be22666c4648cbc16898b2407ec79389db999a81` |
| ur | 0.75 | `014-taiwan-mandatory-employment-period.md` | 36982 | 188006 | 37282 | `1b8768c5939afe6101d988f9685674e6dac9c35e10d39aa66d13f774eafc2691` |
| vi | 0.25 | `403-taiwan-non-prosecution-reconsideration-deadline.md` | 8624 | 103045 | 21406 | `ff9d618bbd876f07185122867913f2f6e1273bcdc943b9119550c7f0d0a08d32` |
| vi | 0.5 | `023-baby-taiwan-nationality-birth-registration.md` | 10577 | 108564 | 23346 | `73fa0aac9ddaab5952867f23a5507326ec3a79f4e5187288df8d7be8ad825bd3` |
| vi | 0.75 | `018-taiwan-semiconductor-market-entry.md` | 19191 | 144934 | 31185 | `6120cd1ce7db4734d5aef426d15c7df17e1d778c8c060ec0d30db63f4c539d3b` |
| zh-hans | 0.25 | `019-taiwanese-spouse-divorce-agreement-registration.md` | 5924 | 95530 | 22851 | `53ba7d9c7bda12eca7fe0f93f8998116d14fd57d675683e849559d88a243d4a3` |
| zh-hans | 0.5 | `806-mainland-chinese-judgment-arbitral-award-taiwan-recognition.md` | 9995 | 105883 | 23814 | `0f080831d5bb114bfe5a77c35cd48401ed1b585170ec8218608b587c3976e280` |
| zh-hans | 0.75 | `001-taiwan-company-establishment-basics.md` | 18647 | 143594 | 34134 | `bce29be23d00bfad9fa223d1ee321c455479cc229a504ce61449d33ad4ab5fea` |
| zh-hant | 0.25 | `626-taiwan-red-signal-straight-stop-line-collision.md` | 7887 | 136990 | 32788 | `702316612032c78ddf447467103dacc0eae79bcb51624d5fe06a73f1e2258e8f` |
| zh-hant | 0.5 | `704-taiwan-arc-first-application.md` | 10598 | 146942 | 34604 | `1d860e15629fcb945ad715f19f5e404a02dd767e762722a8d6086fcd42fa59e3` |
| zh-hant | 0.75 | `083-taiwan-accident-assessment-secondary-cause-compensation-ratio.md` | 14244 | 147949 | 38691 | `9a37f6b8ae18ad3d57ad0307a8b194defb4e9723fe15586aca3cf80dd0856b4b` |
