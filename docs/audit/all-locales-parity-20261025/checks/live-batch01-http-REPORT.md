# 첫 배치 공개 배포 HTTP 검증

판정: 요청된 HTTP·공개 HTML·원고 추적 검증 PASS. 실제 브라우저 렌더링 확인은 주 에이전트가 별도로 보완한다.

- 목표 및 실공개 커밋: `5e2d0f5df8c75eb4aca8304b7d9f5110ac422f90` — 정확히 일치, descendant 추정 없음.
- 최초 목표 커밋 응답: 2026-10-25 22:11:55 KST. 마지막 이전 커밋 응답: 2026-10-25 22:07:43 KST.
- 전체 검사 구간: 2026-10-25 22:12:12 KST–2026-10-25 22:12:21 KST. 검사 전후 공개 build-info 커밋 동일.
- build-info의 builtAt: `2026-10-25T12:58:24.800Z` = 2026-10-25 21:58:24 KST. 빌드 생성 시각이며 실제 게시 시각으로 단정하지 않는다.
- 요청마다 고유 `live-audit` 쿼리와 no-cache 헤더를 사용했다. 실제 응답의 `CF-Cache-Status: HIT`도 보존했으며 CDN 원점 직접 확인으로 주장하지 않는다.

## 확인 범위와 결과

| 항목 | 실제 공개 응답 결과 |
|---|---|
| 신규 칼럼 | 7개 언어 × 3편, 21/21 HTTP 200 |
| 각 언어 본문 | 원고의 문단·제목·표 셀 951/951개 일치; 모든 원고 본문 링크 존재 |
| FAQ | 63개 질문·답변이 본문 HTML과 FAQ JSON-LD에 각각 일치 |
| 칼럼 목록 | 7/7 HTTP 200, 각 목록에 해당 언어의 704–706 제목과 링크 존재 |
| 홈 언어 선택 | 영어 홈의 footer 언어 선택 49개 링크, hreflang 49언어 + x-default |
| ARC 언어 선택 | 신규 21편 모두 실제 번역 경로 21개 링크, hreflang 21언어 + x-default |
| 기존 영어 상호 연결 | EN704–706 3편의 21개 언어 링크와 hreflang도 일치; 영어 본문/FAQ 추가 대조 PASS |
| 메타데이터 | 모든 신규 상세의 자기 canonical, 현지어 H1·title·description, html lang·content-language, index 허용 확인 |
| 이미지 | 상세 21편의 hero src·현지어 alt·caption 일치; 이미지 3개 200 image/webp, 실제 파일 SHA-256도 target 원본과 일치 |
| 공개 작성자 | 상세·목록의 author/article:author 메타, JSON-LD author, 알려진 공개 byline DOM·문구 없음 |
| 본문 굵은 강조 | 신규 상세 21편의 markdown DOM에 strong/b 없음 |
| 저장 응답 무결성 | 최종 검사 응답 파일 38개의 저장 SHA-256 재계산 일치 |

200 응답만으로 번역 완료를 판정하지 않았다. 각 페이지에서 해당 언어의 소스 H1, 전체 본문 블록, FAQ, 출처 링크까지 확인했으므로 영어 대체 페이지는 이 결과에 포함되지 않는다.

## 언어별 실제 공개 예시

아래는 704의 실제 HTML H1 및 원고와 일치한 공개 본문 첫 부분이다. 705·706도 같은 방식으로 전수 확인했다.

### ru

- URL: [Первая ARC на Тайване: срок подачи и документы](https://tseng-law.com/ru/columns/taiwan-arc-first-application)
- `html lang=ru`, `content-language=ru`
- 본문: 30 дней отводится на первое заявление об ARC, если Вы въехали на Тайвань по резидентской визе и получили разрешение на проживание. Отсчёт начинается на следующий день после въезда. По статье 22 Закона об иммиграции заявление принимает Национальное иммиграционное агентство (NIA); выданная карточка Alien Resident Certificate подтверждает разрешённое проживание иностранца.

### ms

- URL: [ARC pertama di Taiwan: tarikh permohonan, dokumen dan pengambilan kad](https://tseng-law.com/ms/columns/taiwan-arc-first-application)
- `html lang=ms`, `content-language=ms`
- 본문: Pemegang visa kediaman yang masuk ke Taiwan dan mendapat kebenaran menetap mesti memohon kad kediaman warga asing (Alien Resident Certificate, ARC) dalam masa 30 hari, dikira mulai hari selepas ketibaan. Permohonan dibuat kepada Agensi Imigresen Kebangsaan (NIA). Perkara 22 Akta Imigresen Taiwan menetapkan kewajipan ini serta pengecualian bagi pemegang dokumen sah yang sudah merangkumi fungsi ARC, seperti Kad Emas Pekerjaan.

### fil

- URL: [Unang ARC sa Taiwan: petsa ng aplikasyon, mga dokumento at bayad](https://tseng-law.com/fil/columns/taiwan-arc-first-application)
- `html lang=fil`, `content-language=fil`
- 본문: Sa araw pagkaraan ng pagdating sa Taiwan nagsisimula ang 30 araw para sa unang Alien Resident Certificate o ARC, kung pumasok ka na may visa para sa paninirahan at pinahintulutang manirahan. National Immigration Agency (NIA) ang tatanggap ng aplikasyon. Itinatakda ito ng Artikulo 22 ng Immigration Act; ang kard ang magiging katibayan ng inaprubahang paninirahan.

### tr

- URL: [Tayvan’da ilk ARC başvurusu: süre, belgeler ve kartın teslimi](https://tseng-law.com/tr/columns/taiwan-arc-first-application)
- `html lang=tr`, `content-language=tr`
- 본문: Tayvan’a oturma vizesiyle girip ikamet izni aldıysanız ilk yabancı ikamet kartı, yani ARC için otuz gününüz vardır. Göç Kanunu’nun 22. maddesi bu süreyi girişin ertesi gününden başlatır. Başvuru Ulusal Göç İdaresine (NIA) yapılır. Geçerli Gold Card gibi ARC işlevini içeren birleşik belge sahiplerinin ayrıca ARC başvurusu yapması gerekmez.

### nl

- URL: [Uw eerste ARC in Taiwan: aanvraagtermijn, documenten en afhalen](https://tseng-law.com/nl/columns/taiwan-arc-first-application)
- `html lang=nl`, `content-language=nl`
- 본문: Met een verblijfsvisum binnengekomen en toestemming tot verblijf gekregen? Dan moet u binnen 30 dagen een Alien Resident Certificate, kortweg ARC, aanvragen. De termijn begint de dag na aankomst. Artikel 22 van de Taiwanese immigratiewet legt die verplichting vast. Aanvragen doet u bij de National Immigration Agency (NIA).

### zh-hans

- URL: [首次申请台湾ARC：30天期限、材料与领证流程](https://tseng-law.com/zh-hans/columns/taiwan-arc-first-application)
- `html lang=zh-Hans`, `content-language=zh-Hans`
- 본문: 30天，从哪一天算起？持居留签证来台并取得居留许可的人，应从入境次日起算，向内政部移民署申请外侨居留证（ARC）。《入出國及移民法》第22条第2项规定了这项期限。已经持有有效就业金卡等包含ARC功能的证件，属于免另行申请的例外。

### sv

- URL: [Första ARC-kortet i Taiwan: ansökningsdag, handlingar och avgift](https://tseng-law.com/sv/columns/taiwan-arc-first-application)
- `html lang=sv`, `content-language=sv`
- 본문: 30 dagar från dagen efter inresan: så räknas ansökningsfristen för ett första Alien Resident Certificate, ARC, när du reser in i Taiwan med uppehållsvisum och beviljas uppehåll. Ansökan ska lämnas till National Immigration Agency, NIA, enligt immigrationslagens artikel 22. Kortet styrker det beviljade uppehållet.

## 원고에서 실공개 응답까지의 추적

기준 원고는 현재 작업 파일이 아닌 `git show 5e2d0f5df8c75eb4aca8304b7d9f5110ac422f90:<path>`에서 읽었다. 21개 원고가 푸시된 커밋 안의 manifest SHA-256과 모두 일치했다. 그 원고에서 추출한 내용과 실제 공개 HTML의 `.column-markdown` 및 FAQ를 대조했다. 공개 HTML은 렌더링 산출물이므로 원고 Markdown 바이트 해시와 같다고 주장하지 않는다.

- manifest SHA-256: `320fc0738ed3cd811a75dbe91329ed8978fee5aa562e9c630ca163870cfe678c`
- 최종 results.json SHA-256: `f7cfd502a762cfdda1e64bb7ac30e549bbc82cffde6fd9a89cdeb6491792d160`
- 공개 HTML과 이미지 파일의 전체 응답 해시는 `results.json`의 각 `http.body_sha256` 및 `response-integrity.json`에 있다.

| 언어 | 원고 | 본문 블록 | FAQ | target 원고 SHA-256 |
|---|---|---:|---:|---|
| ru | [704](https://tseng-law.com/ru/columns/taiwan-arc-first-application) | 45/45 | 3 | `eb6556aa6226a2d2394a9c4d126246ef142e943a633c1cb1b3ae9a826684e69f` |
| ru | [705](https://tseng-law.com/ru/columns/taiwan-visa-residence-work-study-family) | 35/35 | 3 | `067ccea7c153d2531333702b913001e39f01d200f3202e4fda0be5a0eb387b53` |
| ru | [706](https://tseng-law.com/ru/columns/taiwan-arc-renewal-changes-reentry) | 51/51 | 3 | `36debf5bfdd7138c98528d06dd8ea85b5724008d791df2d8263ac5f5becc49c9` |
| ms | [704](https://tseng-law.com/ms/columns/taiwan-arc-first-application) | 47/47 | 3 | `f6b3b37c9ca2eb9a3e8972998c932ee8422372f7ccdabb6382ce6269825c6945` |
| ms | [705](https://tseng-law.com/ms/columns/taiwan-visa-residence-work-study-family) | 35/35 | 3 | `ed821ce519c4fe273addbc34381bcdc5b9ce7c40e0710924a6d0d042d12c877a` |
| ms | [706](https://tseng-law.com/ms/columns/taiwan-arc-renewal-changes-reentry) | 54/54 | 3 | `a63acbaa0fe59bc7bcffc6a3b537a28222b07c5659bcb44c41be84cff97e8cd1` |
| fil | [704](https://tseng-law.com/fil/columns/taiwan-arc-first-application) | 45/45 | 3 | `6aced8364c167eb06beca783345171616aa5d9f9d8b4a11d612321628ebe51b7` |
| fil | [705](https://tseng-law.com/fil/columns/taiwan-visa-residence-work-study-family) | 37/37 | 3 | `b3d5a3132b260ef14653bab7ea8e40ce303817b76365d22d29c2df62fc93e70e` |
| fil | [706](https://tseng-law.com/fil/columns/taiwan-arc-renewal-changes-reentry) | 54/54 | 3 | `8efd98ba2187a676ad7965d9b5d9281897522599b54f4795ba29fa621426ffae` |
| tr | [704](https://tseng-law.com/tr/columns/taiwan-arc-first-application) | 49/49 | 3 | `eae17b5cd8d03c42697698a996d5566d016c04070716da27655cd365be1e0d8a` |
| tr | [705](https://tseng-law.com/tr/columns/taiwan-visa-residence-work-study-family) | 40/40 | 3 | `3310f47c1ef54d7e6567af7d5dcbdb49318148fbfee47d71e18746d821f2d2d0` |
| tr | [706](https://tseng-law.com/tr/columns/taiwan-arc-renewal-changes-reentry) | 52/52 | 3 | `cf143d1db6bf28bc9771ec0bf6e5a505b112bcf00779b0b0e901c3cada6901fb` |
| nl | [704](https://tseng-law.com/nl/columns/taiwan-arc-first-application) | 51/51 | 3 | `47cb7de8d15fbbbdffe9d0bb2a0ea27e74a313e051a6ebaf8ba72455c0aab3c6` |
| nl | [705](https://tseng-law.com/nl/columns/taiwan-visa-residence-work-study-family) | 41/41 | 3 | `a38063b5a16d9f5b4d44b0a5c1fffdb8b6b3c1de7ca8ab178966a1213135bae7` |
| nl | [706](https://tseng-law.com/nl/columns/taiwan-arc-renewal-changes-reentry) | 52/52 | 3 | `788fcd4f71b5b453c921edb514b48ebe678ca123d9bfac90482b269968b0c37d` |
| zh-hans | [704](https://tseng-law.com/zh-hans/columns/taiwan-arc-first-application) | 43/43 | 3 | `bc621dfb4edc8838994318847fa914dc48e2f33512d5406aa1c2d8c06384b7f0` |
| zh-hans | [705](https://tseng-law.com/zh-hans/columns/taiwan-visa-residence-work-study-family) | 37/37 | 3 | `59b439ddf643b0c46b36672a5844bcb0aee8f5f1b155e263fac762959da4ccf2` |
| zh-hans | [706](https://tseng-law.com/zh-hans/columns/taiwan-arc-renewal-changes-reentry) | 57/57 | 3 | `fe7738b6f822c3b1dc28508e43fb4df3c073fcdc8be6a5f70cadf98cce7d2d19` |
| sv | [704](https://tseng-law.com/sv/columns/taiwan-arc-first-application) | 40/40 | 3 | `367126180229208d662621ab42add0ad7498ba8496abf4f188f76e70d0b3f569` |
| sv | [705](https://tseng-law.com/sv/columns/taiwan-visa-residence-work-study-family) | 34/34 | 3 | `ed8011bbf7d82dc23c5136c026111c3da76f96478344e6fc0835abaa2ca37204` |
| sv | [706](https://tseng-law.com/sv/columns/taiwan-arc-renewal-changes-reentry) | 52/52 | 3 | `54420eac11065722ae23083e98432813f9ffd50d82491bbbf78d33c8bb7ebe1c` |

## 공개 이미지 파일

| 실제 src | HTTP / MIME | 원본과 일치한 SHA-256 |
|---|---|---|
| [taiwan-arc-first-application-20261024-v2.webp](https://media.tseng-law.com/images/columns/taiwan-arc-first-application-20261024-v2.webp) | 200 / image/webp | `e33f7f381d597a9ae5b3693d7c4f887a29d7420b1b4ae3c98db664a06dceae31` |
| [taiwan-visa-residence-work-study-family-20261024-v2.webp](https://media.tseng-law.com/images/columns/taiwan-visa-residence-work-study-family-20261024-v2.webp) | 200 / image/webp | `0f9d9a4041f5978119b71a6c89ba1a9b01e2643871143163a4bc4d8f792a7e84` |
| [taiwan-arc-renewal-changes-reentry-20261024-v2.webp](https://media.tseng-law.com/images/columns/taiwan-arc-renewal-changes-reentry-20261024-v2.webp) | 200 / image/webp | `9933406b2c0c64af337aaf443c6c5e1ed4afb94e9ed7ab5a5e3635a2b940f16f` |

## 증거 파일

- `build-probes.jsonl`, `responses/*-build-info.body`: 배포 대기 중의 실제 공개 커밋 응답과 시각.
- `manifest-at-target.json`, `expected.json`: 불변 target 커밋의 원고·이미지 SHA 및 내용 비교 기준.
- `runs/20261025T131212662659Z/results.json`: 최종 상세 검사 결과.
- `runs/20261025T131212662659Z/responses/`: 실제 공개 HTML·이미지·build-info·robots 응답 원본. gzip 전송인 경우 wire 응답도 별도 보존.
- `runs/20261025T131212662659Z/response-integrity.json`: 저장된 최종 응답의 SHA 재검산.
- `prepare_expected.mjs`, `probe_build.py`, `audit_public.py`: 재현 가능한 읽기 전용 검사 스크립트.

## 한계와 판정 경계

- 이 검사는 공개 HTTP·서버 HTML DOM·이미지 파일 검증이다. CSS 적용 뒤의 실제 화면, 모바일 레이아웃, 이미지 naturalWidth와 화면 표시, 헤더 언어 dialog 클릭 동작은 이 보고서에서 완료로 주장하지 않는다. 주 에이전트의 격리 브라우저 검사로 보완한다.
- Chrome browser-client는 `Browser is not available: chrome`, 연결 목록 `[]`를 반환했다. 브라우저 계정·프로필·쿠키·고객 데이터는 읽지 않았다.
- 본문 비교 시 Unicode NFC와 공백만 정규화했다. 법률·언어 품질에 대한 새 전문 감정이 아니라, 이미 검수한 원고가 공개 페이지에 보존되었는지 확인한 것이다.
- 기준선에서 사용하던 legacy 언어 선택 selector가 실제 footer와 달라 최초 결과의 0개 카운트는 검사기 문제였다. 실제 DOM을 확인해 `.locale-flag-switcher`로 고쳤으며, 보정 결과와 최초 결과를 모두 보존했다. 최종 결과에는 이 문제가 없다.
- 사이트 게시, Air 강제 실행, 인프라/도메인 변경, 폼 제출, 계정 작업, 커밋 및 push를 수행하지 않았다. 쓰기는 지정 live-batch01 감사 폴더에만 했다.
