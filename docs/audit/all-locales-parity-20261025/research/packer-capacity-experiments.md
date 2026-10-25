# Packer·Worker·자산·사이트맵 용량 실험

작성·실측일: 2026-10-25 KST. 담당: /root/column_deploy. 현재 공개 배포 `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`, builtAt `2026-10-25T02:45:26.159Z`의 공개 HTML 표본을 사용했다. 원격 동작은 GET뿐이다. 운영 packer·Worker·인프라 설정은 수정하지 않았으며 build/push/deploy도 실행하지 않았다.

## 결론

페이지별 압축만으로는 목표량 수용 근거가 부족하다. 147개 표본에서 개별 Brotli quality 11을 적용해도 49 × 286편의 전문 칼럼만 259.82 MiB로 외삽된다. 현재 상한은 256 MiB다.

동일 HTML 조각을 공유 저장하는 방식은 더 큰 절감 가능성을 보였다. nominal 64 B content-defined chunk 사전과 페이지 차분을 Brotli quality 9로 압축한 147개 합계는 1,930,992 B다. 개별 Node gzip의 4,561,429 B보다 57.7% 작았고, 전부 원래 UTF-8 HTML과 바이트 단위로 일치하게 복원했다.

같은 표본 분포·공통 사전 크기·옛 비칼럼 페이지를 유지한다는 조건에서 전체 패키지 약 241.24 MiB라는 시나리오가 나온다. 그러나 별도로 남겨 둔 상위 크기 표본에 고정 사전을 적용한 시나리오는 311.35 MiB다. 따라서 241 MiB 수치를 최종 수용 증명으로 쓰면 안 된다. 실제 완성된 원고 전체, 미러 데이터, 새 사이트맵과 최종 codec으로 pack한 expandedBytes가 마지막 판단 기준이다.

## 입력과 재현

- 공개 원문 캐시: `/private/tmp/tseng-packer-experiment-20261025/<locale>/*.html`.
- 입력 목록: 같은 폴더 manifest.json. SHA-256 `c0e61611d7bef4902208780db2cc800dbee1c4b3f311d7f589f90d1b34e4cb50`.
- 원문 147개, 49언어별 3개. 초기 baseline git tree의 Markdown byte 크기 25·50·75 분위 표본이며 랜덤 표본이 아니다. [기초 조사](./deployment-capacity.md)에 첫 측정의 147개 파일명·URL 유도 규칙이 있다.
- 이번 캡처 HTML 합계 20,886,464 B. 모든 GET 200, 캡처 전과 실험 후 공개 build-info가 위 커밋과 시각으로 같았다.
- 공개 GET: `User-Agent: tseng-law-authorized-capacity-audit/1.0`, `Accept-Encoding: gzip`. 전송 압축을 풀고 저장했다. 첫 동시 GET은 일시 DNS 오류여서 중단됐고, 동시성 3 및 최대 3회 재시도한 캡처는 147개 전부 성공했다.
- 마지막 재현 출력: `/private/tmp/tseng-packer-experiment-20261025/reproduced-result.json`, SHA-256 `5d05f0c91dc6b91ffc1f42255d515a29297182d6a447593c6a70b15358437b51`. 요약은 [packer-capacity-results.json](./packer-capacity-results.json)에 보존했다.
- 재현 코드: [packer-capacity-experiment.mjs](./packer-capacity-experiment.mjs), SHA-256 `ff74c7eb8db87aafbfa50f6c23337b589a9c97670948f519b7f8c0f7d2625be2`.
- 압축 런타임: Node 24.14.1, zlib 1.3.1-e00f703, Brotli 1.2.0. Air의 실제 런타임 버전은 확인하지 못했다.

실행은 저장소 루트에서 아래와 같다. 스크립트는 입력을 읽고 stdout에 JSON을 내보내며, 운영 파일·원격 서비스에 쓰지 않는다. 지정한 캡처 폴더와 옛 static 입력이 있어야 동일 입력으로 재현할 수 있다.

```sh
/Users/son7/.nvm/versions/node/v24.14.1/bin/node \
  docs/audit/all-locales-parity-20261025/research/packer-capacity-experiment.mjs \
  /private/tmp/tseng-packer-experiment-20261025 \
  /Users/son7/Projects/tseng-law-traffic-scenes-20261014/.next-static/static
```

기초 조사의 Python gzip과 Node packer의 gzip은 같은 level 9여도 zlib 버전 차이 때문에 크기가 같지 않다. 이번 비교는 모든 후보를 같은 Node 런타임과 동일 캡처 bytes로 짝지었다. 별도로 확인한 zh-hant704 사례에서 Python zlib 1.2.12는 34,605 B, Node zlib 1.3.1-e00f703는 35,299 B였다. 이 개별 사례는 pipeline 담당의 동일 파일 비교로 확인했다.

공개 응답에는 CDN이 덧붙인 challenge 스크립트가 있다. ar 표본을 다시 받았을 때 길이 109,653 B는 그대로였지만 14 B가 달라졌으며, 차이는 끝부분 `window.__CF$cv$params`의 r/t 값 부근이었다. 이 때문에 처음 감사의 해시와 이번 147개 해시는 달랐다. 실험에서는 이 삽입물까지 제거하지 않고 통째로 보존했다. 서버에서 생성한 원본 out/ 파일과 정확히 같은 입력이라고 주장하지 않는다. 나중 공개 GET으로 재수집하면 작은 차이가 다시 생길 수 있다.

## 현재 packer와 Worker의 동작

`scripts/static-site/sites-pack.mjs`는 HTML만 개별 gzip level 9로 `client/__p/<path>.html.gz`에 저장한다. JS·CSS·폰트·XML 등은 그대로 복사한다. dist 전체 파일의 실제 byte 합계가 268,435,456 이상이면 거부한다. 바깥 tar.gz를 작게 만드는 것은 이 합계를 줄이지 않는다.

`scripts/static-site/sites-worker.js:126–145`는 ASSETS 바인딩으로 압축 페이지를 하나 읽어 gzip 지원 요청에는 그대로 전송하고, 그 밖에는 DecompressionStream('gzip')으로 풀어 보낸다. 페이지의 MIME, 캐시·보안 헤더, 비정규 도메인의 noindex, HEAD 처리가 이 함수에 모여 있다. `/__p`는 외부 요청에서 차단되고 root 언어 선택·리디렉션·언어별 404도 Worker가 처리한다. 나머지 일반 자산은 현재 assets-first 경로에서 Worker 전에 제공된다.

이 구조 안에서 압축 표현만 바꾸는 설계는 기존 host·도메인·Site·R2를 유지할 수 있는 후보지만, 실제 코드 및 HTTP 검증이 필요하다. 이번 실험 파일은 운영 codec이 아니다.

## 개별 HTML 압축 실측

| 방법 | 표본 147개 합계 B | 페이지 평균 B | 14,014편 전문 칼럼 외삽 MiB |
|---|---:|---:|---:|
| gzip level 9 | 4,561,429 | 31030.1 | 414.71 |
| Brotli quality 9 | 3,128,547 | 21282.6 | 284.44 |
| Brotli quality 11 | 2,857,748 | 19440.5 | 259.82 |

Brotli11 단독으로도 전문 칼럼만 상한을 넘는다. gzip/br를 둘 다 정적 파일로 저장하면 두 표현이 합산되므로 저장 용량 해결책으로 계산하지 않았다. 캐시 전송압축과 Sites 내부 파일 저장압축도 구별한다.

## 조각 공유 실험의 정확한 방법

1. HTML UTF-8 bytes를 변경하지 않고, SHA-256(byte)의 첫 little-endian uint32로 만든 256개 Gear 표와 `rolling = ((rolling << 1) + gear[byte]) >>> 0`를 사용했다.
2. 조각 최소 길이는 nominal/4, 최대 기준은 nominal×4다. ASCII byte 뒤에서만 자르고 `rolling & (nominal-1) == 0`이거나 최대 기준에 도달하면 경계를 만든다. 비ASCII 연속 구간 때문에 실제 길이가 최대 기준을 넘을 수 있다. nominal은 평균 크기 보장이 아니다.
3. 서로 다른 페이지 둘 이상에 등장한 동일 문자열만 공유 사전에 넣었다. 한 페이지 안의 자체 반복만으로 공통 조각으로 분류하지 않았다.
4. 공유 사전은 문자열 JSON 배열 하나다. 페이지별 JSON 배열에는 공통 조각의 숫자 인덱스 또는 그 페이지 고유 문자열을 저장했다. 사전과 페이지 차분을 각각 gzip9 또는 Brotli9로 압축했다.
5. 실제 압축을 풀어 JSON을 읽고 문자열 순서대로 조립한 뒤, 원본 Buffer와 비교했다. 경계 분할과 최종 조립 모두에서 불일치 시 즉시 오류가 나도록 했다.
6. 모든 크기 후보에서 147/147 exact-byte round-trip이 통과했다. HTML 태그·본문·링크·RSC·script·JSON-LD를 파싱해서 지우거나 고치지 않았다. 브라우저가 여러 gzip member를 합쳐 해석한다는 가정도 사용하지 않았다.

| nominal B | 공유 사전 항목 | 사전 gzip B | 페이지 차분 gzip B | gzip 총합 B | Brotli9 총합 B | 전문 칼럼 Brotli 외삽 MiB |
|---|---:|---:|---:|---:|---:|---:|
| 64 | 15145 | 281,329 | 2,306,437 | 2,587,766 | 1,930,992 | 159.26 |
| 128 | 9937 | 314,474 | 2,342,616 | 2,657,090 | 1,939,876 | 161.31 |
| 256 | 6106 | 374,781 | 2,504,225 | 2,879,006 | 2,011,087 | 169.58 |
| 512 | 3327 | 385,789 | 2,783,688 | 3,169,477 | 2,154,475 | 184.01 |
| 1024 | 1099 | 288,215 | 3,498,375 | 3,786,590 | 2,496,876 | 217.58 |
| 2048 | 284 | 129,525 | 4,018,904 | 4,148,429 | 2,850,675 | 252.50 |
| 4096 | 137 | 92,391 | 4,121,923 | 4,214,314 | 2,918,575 | 259.57 |

64 B 사례의 사전 원문은 1,659,066 B, 사전 Brotli는 181,143 B, 페이지 차분 Brotli 합계는 1,749,849 B다. 128 B 사례도 거의 같은 표본 합계지만 Worker 메모리·작은 조각 개수·추가 데이터 구조 비용은 다르므로, 가장 작은 수치 하나만 보고 production 방식을 확정할 수 없다.

### 표본 분포와 사전 재사용의 민감도

언어별 첫 두 분위(25·50), 총 98편만 사전 학습에 사용하고 나머지 75분위 49편은 사전에 넣지 않은 채 처리했다. 고정 사전 Brotli 161,463 B, 49편 차분 840,399 B, exact round-trip 49/49였다.

동일한 그 49편을 전체 147편에서 만든 사전으로 처리하면 764,462 B다. 고정 사전은 같은 페이지에 대해 약 9.9% 더 컸다. 전체 표본의 평균 차분 11,903.7 B와 보류 49편의 평균 17,151.0 B 차이에는 글 크기 분포 자체가 다른 효과도 있으므로, 그 차이를 모두 사전 일반화 실패로 설명하지 않는다. 보류 49편의 원래 HTML 합계는 8,658,276 B이며 기존 gzip 합계 1,878,920 B였다.

이 보류 표본 평균을 14,014편에 적용하면 전문 칼럼만 240,515,577 B, 229.37 MiB다. 단순히 표본 수를 늘려 사전이 더 잘 맞을 것이라고 낙관하거나, 반대로 이 보류 결과를 미래 파일의 확정 하한으로 쓰지 않는다. 실제 최종 pack은 전체 완성 원고로 사전을 새로 만들 것이므로 현재 고정 사전과도 다르다.

## 자산 압축과 중복 파일

실제 읽은 자산은 현재 worktree의 public/fonts와 2026-10-15 빌드가 남은 `/Users/son7/Projects/tseng-law-traffic-scenes-20261014/.next-static/static`이다. 2,346개 파일의 gzip/Brotli 압축 후 복원 byte 비교를 통과했다. CSS/JS는 현재 운영 빌드 전체와 동일하다고 주장하지 않는다.

| 확장자 | 파일 수 | 원본 B | gzip9 B | Brotli B (quality) |
|---|---:|---:|---:|---:|
| .woff2 | 1667 | 59,739,760 | 59,790,564 | 59,742,633 (4) |
| .md | 1 | 999 | 593 | 535 (9) |
| .txt | 30 | 131,513 | 59,124 | 53,380 (9) |
| .css | 95 | 4,304,228 | 900,281 | 733,499 (9) |
| .js | 553 | 13,050,475 | 3,645,951 | 3,214,999 (9) |

WOFF2 1,667개는 이미 압축된 글꼴이다. gzip으로 50,804 B, Brotli4로 2,873 B 오히려 늘어 글꼴 재압축은 수용하지 않는 것이 합리적이다. 사용 여부를 전수 확인하지 않고 폰트를 제거하면 49언어 표시를 해칠 수 있으므로 삭제 실험은 하지 않았다.

텍스트 자산 JS/CSS/TXT/MD 합계 17,487,215 B는 gzip 4,605,949 B, Brotli9 4,002,413 B가 됐다. Brotli 기준 약 12.86 MiB 절감 가능성이다. 압축한 자산의 원래 URL에서 올바른 Content-Type·Cache-Control·보안 헤더를 돌려줘야 한다. 일반 파일을 삭제한 채 Worker가 모두 HTML로 답하면 JS/CSS가 깨지므로 기존 pageResponse를 그대로 재사용하는 것은 구현안이 아니다.

이전 pack manifest의 파일 SHA를 묶으면 84개 중복 집단, 중복분 1,092,264 B였다. 큰 집단은 2,309 B짜리 빈 route chunk 368개(중복분 847,403 B), 동일 seal 이미지 둘(169,517 B), 라이선스 텍스트 등이다. 약 1.04 MiB에 불과하며 URL별 모듈 참조·라이선스가 있어 임의 삭제하지 않았다.

기존 `/__p/` 내부에 압축 자산을 저장하고 원래 공개 URL을 Worker가 매핑하는 방식이라면 새 외부 스토리지를 만들 필요는 없다. 원래 URL에 plain 파일을 함께 남기면 assets-first 경로가 그 파일을 제공하고 패키지에도 둘 다 들어가므로 절감값이 사라진다. ASSETS 바인딩은 정적 파일을 Worker 내부에서 읽을 수 있다는 [공식 동작](https://developers.cloudflare.com/workers/static-assets/binding/)을 확인했다. 구체적인 내부 경로·헤더 매핑은 아직 구현하지 않았다.

## 사이트맵: 압축뿐 아니라 분할 필요

현재 공개 XML은 8,571,028 B, 이 Node 런타임 gzip9는 401,328 B다. 현재 packer는 이 XML을 plain 자산으로 넣는다.

크기 모형에서는 baseline의 zh-hant 전문 칼럼 파일명 286개를 문자열 자료로만 사용하고 49언어 경로와 각 50개 alternate(49언어+x-default)를 구성했다. 이 다른 언어 글들이 이미 존재한다고 주장하지 않았으며 해당 XML을 사이트에 쓰지 않았다. 기존 언어별 고유 주제·이슈·CMS 경로를 이 모형으로 대체하라는 뜻도 아니다.

| 크기 모형 | 실제 생성 바이트 |
|---|---:|
| 가정 URL 수 | 14,014 |
| 모든 전문 칼럼을 단일 XML로 생성 | 96,398,598 B |
| 그 XML의 gzip9 | 3,429,713 B |
| 언어별 49개로 분할한 XML 합계 | 96,405,942 B |
| 언어별 단일 XML 최대 | 1,968,834 B |
| 49개 gzip9 합계 | 3,456,107 B |

분할해도 각 행의 전체 50개 alternate를 유지했다. XML wrapper 때문에 증가한 원문은 7,344 B뿐이다. 압축한 자식 사이트맵과 sitemap index를 함께 제공하면 원문 URL·hreflang를 줄이지 않고 크기 제한을 피할 여지가 있다.

[Google 지침](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)은 단일 sitemap의 압축 전 50 MB 또는 50,000 URL 한도를 정한다. 현재 저장소의 25 MiB 자산 검증은 이보다 낮은 별도 제한이다. 96 MB XML을 gzip만 해서 놓아도 Google의 압축 전 한도 문제는 남는다. [sitemap index 지침](https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps)은 같은 사이트의 자식 sitemap을 index로 나열하는 방식을 지원한다. 여기서 사용할 미래 날짜·실제 lastmod 정책은 현재 크기 모형의 고정 날짜 문자열로 결정하지 않는다.

분할 시 함께 고쳐야 할 현재 코드의 실제 의존성이 있다.

- `src/app/sitemap.ts`: 현재 단일 MetadataRoute.Sitemap을 반환한다. 실제로 존재하고 indexable한 대체 URL만 유지하는 기존 필터를 보존해야 한다.
- `scripts/static-site/crawl.mjs:24,63–68,124–138`: 처음 /sitemap.xml의 loc만 seed로 쓰며, 내려받은 자식 XML에서 loc를 재귀 수집하지 않는다. index만 바꾸면 일부 페이지를 누락할 수 있다.
- `scripts/static-site/verify.mjs:52–60`: root XML의 loc만 세므로 index 도입 후에는 자식 XML 파일만 검사하고 실제 페이지 coverage를 잘못 통과시킬 수 있다. 재귀 URL 수집·중복·누락·alternate 검증이 필요하다.
- `scripts/static-site/compare-live.mjs:71–72`: 단일 sitemap에서 페이지 목록을 뽑는다. 새 자식 목록을 같은 규칙으로 펼쳐야 한다.
- `src/app/robots.ts:68`: /sitemap.xml을 광고한다. 이 주소를 index로 유지하면 진입점 자체는 보존할 수 있다.
- `verify.mjs`의 25 MiB 검사는 pack 전 out에도 적용된다. pack 단계에서 마지막에 XML만 gzip하는 것은 분할을 대신하지 못한다.

## 256 MiB 시나리오의 계산

기초 조사의 옛 assetBytes 86,822,096 B에서 위 텍스트 자산의 Brotli 절감분을 빼고, 옛 XML 8,240,485 B를 합성 분할 XML gzip 3,456,107 B로 치환하면 68,552,916 B (65.38 MiB)다. 서로 다른 날짜의 입력을 결합한 시나리오이며 실제 최종 pack 합계가 아니다.

| 항목 | 조건부 시나리오 B |
|---|---:|
| 147표본 분포 기반 CDC64+Brotli9 전문 칼럼 14,014편 및 공유 사전 | 167,000,081 |
| 위와 같이 치환한 비HTML 자산 | 68,552,916 |
| 옛 pack의 비칼럼상세 HTML 747개 gzip 합계 | 17,401,112 |
| 합계 | 252,954,109 (241.24 MiB) |
| 한도와의 차이 | 15,481,347 (14.76 MiB) |

옛 비칼럼상세 HTML은 manifest의 client/__p 경로에서 /columns/<slug>.html.gz가 아닌 파일을 직접 합산했다. 옛 칼럼상세 1,701개는 54,643,658 B였다. 이 747개/17.4 MB를 현재 비칼럼 전체의 정확한 크기로 사용하지 않는다.

위 합계에는 현재 이슈·전문 칼럼 외의 column-detail, CMS 미러만의 추가 페이지, 앞으로 늘어날 공유 사전, codec/routing metadata, sitemap index, 기존 페이지의 언어 메뉴 증가, 향후 자산 증가가 모두 확정 반영된 것이 아니다. 따라서 약 14.76 MiB의 계산상 여유를 실제 headroom으로 보고하면 안 된다.

보류 q75 표본 평균을 대신 사용하면 전문 칼럼 240,515,577 B + 위 자산 + 옛 비상세 HTML = 311.35 MiB다. 더 긴 글의 비중, 사전이 고정되는 조건에 따라 결론이 달라진다. pipeline 담당의 RSC props 축소도 같은 반복 bytes를 줄일 수 있으므로 그 절감값을 이 CDC 절감액에 단순 합산할 수 없다. 두 방법을 적용한 실제 결과를 다시 측정해야 한다.

## Worker에서 확인해야 하는 기술 조건

현재 Worker의 DecompressionStream은 gzip을 사용한다. Cloudflare의 [Compression Streams 문서](https://developers.cloudflare.com/workers/runtime-apis/web-standards/#compression-streams)는 deflate/deflate-raw/gzip을 명시하므로 `new DecompressionStream('br')`를 당연히 쓸 수 있다고 가정하지 않는다. [node:zlib 문서](https://developers.cloudflare.com/workers/runtime-apis/nodejs/zlib/)는 Brotli를 지원하고 2026-08-04 이후 compatibility date의 Node 호환 기본 동작을 안내한다. 현재 생성 config는 2026-09-01이지만 실제 Sites 빌드 번들러·배포 런타임에서 해당 import와 응답이 동작하는지는 아직 시험하지 않았다.

이번 Node 재현의 nominal64 warm 디코드·JSON조립·Buffer 생성 평균은 gzip 0.475 ms, Brotli 0.528 ms였다. cold 공유 사전의 해제·파싱·재직렬화 byte 검증은 각각 7.552 / 10.581 ms였다. 이는 Mac Studio Node의 단일 실험이며 네트워크, 응답 재압축, 병렬 요청, isolate cold start 비용을 포함하지 않는다. 특히 cold 값에는 검증용 재직렬화 비용도 포함한다. Worker CPU 성능값으로 쓰지 않는다.

Cloudflare의 [런타임 제한](https://developers.cloudflare.com/workers/platform/limits/)은 isolate 메모리 128 MB와 요금제별 CPU 한도를 구분한다. 기존 Codex Site의 실제 적용 CPU·동시성 한도는 확인하지 못했다. 사전은 모든 페이지를 합친 HTML 전체가 아니라 작은 공유 문자열 표로 유지하고, 버전별 캐시를 무제한 쌓지 않는 설계가 필요하다. 이 연구에서 CPU 한도를 늘리거나 상품 설정을 바꾸지 않았다.

## 구현 전후의 구체적 검증 순서

1. 현재 전체 운영 입력으로 out 생성. 커밋·미러 시각·모든 경로와 SHA를 고정한다.
2. 생성된 동일 out을 기존 packer와 후보 codec 모두에 넣어 expandedBytes, 파일 수·단일 최대 크기·공유 사전 크기·페이지별 차분 분포를 비교한다. 인덱스와 비칼럼·이슈도 합계에 포함한다.
3. 실제 전체 HTML·JS·CSS를 codec으로 복원해 byte/SHA가 전부 같은지 확인한다. 글 본문, JSON-LD, canonical/hreflang, RSC text-row 길이는 이 바이트 검증의 대상이다.
4. 로컬 실제 Worker 런타임에서 경로·정규 도메인·예고 도메인 noindex·root 언어 선택·alias/슬래시 redirect·언어별404·HEAD를 검사한다. 내부 `/__p`의 직접 외부 접근도 계속 차단한다.
5. identity/gzip/br, q=0을 포함한 Accept-Encoding, Content-Type, Cache-Control, ETag/조건부 요청, 보안 헤더를 확인한다. 특히 JS/CSS 압축 표현에서 MIME을 HTML로 잘못 돌려주지 않는다. 브라우저 multi-member gzip 동작은 이 실험에서 검증하지 않았다.
6. 한국어·영어·중국어·터키어·RTL·남아시아 문자 페이지를 실제 브라우저로 열어 hydration 오류, 검색·목록·언어 메뉴, 이미지와 글꼴 표시를 확인한다. 같은 bytes 복원은 강한 보존 근거지만 HTTP 전송·런타임 통합 테스트를 대체하지 않는다.
7. 사전 cold/warm, 동시 요청, 최대 페이지를 사용해 Worker CPU·메모리·TTFB를 측정하고 한도와 비교한다. 문서의 일반 한도만으로 배포 성능을 확정하지 않는다.
8. sitemap index와 자식 XML의 재귀 coverage·중복·실제 indexable URL·대체 언어 상호성을 검증한 뒤 기존 main push → Air 배포 경로로 통합한다. 공개 build-info와 실제 페이지·검색·헤더·사이트맵을 다시 확인한다.

이 단계의 결과는 후보 간 크기 비교와 실행 가능한 검증 항목이다. 운영 코드 구현 또는 게시 완료가 아니며, 다른 host로 옮기는 제안도 실행하지 않았다.
