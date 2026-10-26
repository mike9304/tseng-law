# B3–B6 공개 검증 — 2026-10-26

실제 공개 커밋 `f66daa9f153537c000d23486e8be638472251012`에서 칼럼 195편의 원문 대비 내용을 확인했다. B3·B4·B5 신규 각21편과 B6 신규42편, 기존 수정7편, 비교용 기존83편이다. 배포 완료 판단은 push가 아니라 공개 HTTP 응답에 근거한다. 이 커밋이 B3–B6 main push의 후손이라는 점도 각각 실제 `git merge-base --is-ancestor` exit0으로 확인했다.

공개 build-info의 builtAt은 `2026-10-26T06:42:32.834Z`다. HTTP 검증은 15:59:24–16:00:22 KST, 대표 브라우저 검증은 16:06:59–16:08:03 KST에 수행했고, 두 실행 모두 시작·종료 커밋이 같았다. Root의15:45 최초 관찰은 f0dd7cb였으나, 첫 검증 GET에서 f66daa9f로 바뀐 것을 발견해 기사 요청 전에 중단했다. 새 커밋의 `git show`로 기대값을 다시 고정했다. 두 커밋의 대상195원고 해시 목록은 바이트 단위로 동일하다. 현재 R 작업트리의 내용을 기대값으로 쓰지 않았다.

## 본문·FAQ·메타·이미지

- 195/195 HTTP200. 해당 언어의 제목과 본문7,703블록, FAQ577항목, 출처·내부 링크6,082회분을 각 동결 원문과 대조했다. 제목만 번역되거나 영어 본문으로 fallback된 페이지를 해당 언어 완료로 세지 않았다.
- canonical, html lang/content language, SEO/OG 메타, 공개·수정일, 본문 FAQ와 FAQ JSON-LD, 이미지 URL·alt·허구 캡션, 공개 작성자 및 장식용 굵은 강조 부재를 확인했다.
- ARC147편은 각49개 언어의3묶음, 판례48편은 각8개 언어의6묶음이다. 9개 묶음의 상호 언어 링크7,587개(자기 링크 포함)와 hreflang을 확인했다. 홈페이지 언어 링크49개와 x-default 포함 hreflang50개가 일치한다.
- 9개 고유 히어로 이미지는 실제 공개 응답 HTTP200, image MIME, WebP signature 및 동결 git 이미지 SHA가 모두 일치한다. 대표 브라우저 페이지에서는 실제 decode와 자연 크기, 표시 및 캡션을 별도로 확인했다.
- 기존 수정7편은 DE/FIL/MS/NL704와 ZH918/920/921이다. FIL/MS/NL704의 전자 ARC 다운로드·인쇄 의무 동사, published25/lastmod26도 확인했다. DE704는 published24/lastmod26으로 원문과 일치한다.

## 목록과 대표 브라우저

31개 언어 목록 중30개는 최초 HTML의 대상 카드가 일치했다. ZH-Hant는 기존 주제별 ‘전체 보기’ UI 때문에918 카드가 최초 DOM에 없었다. 공개 브라우저에서 실제 확장 버튼을 눌러 번체중문 제목·요약을 읽고 기사로 이동했다. ZH 목록의 optional `meta content-language`는 없으나 `html lang=zh-Hant`, 제목·canonical·상호언어 링크는 맞다.

공개 격리 Chromium37/37건 PASS, 실행 exit0. B3–B6 신규28개 언어의 모바일 대표 페이지, 데스크톱2건, HTTPS 저속 프록시1건, JavaScript 비활성1건, 홈/기존 KO051의 데스크톱·모바일 언어 메뉴4건, ZH 확장 목록1건이다. 원본 harness의 폰트 대기를 유지했다. 실제 같은 slug 언어 클릭, 새 document 이동과 목적지 제목, 본문·FAQ·SEO·이미지, RTL 숫자/식별자와 표 방향, 가로 넘침·RSC/API 오류를 검사했다. 사용자 Chrome이나 로그인 프로필은 사용하지 않았다.

별도로 PNG7장을 직접 열어 AR/HE의 RTL 표·숫자·식별자, KM/HI 글꼴과 본문, AR 히어로, ZH918 확장 카드를 확인했다. 보이는 범위에서 제목 잘림·누락 글리프·가로 넘침은 찾지 않았다. 단, AR921와 HE706 표 위 공용 가로 스크롤 안내는 영어로 남아 있다. ZH 목록 카드의 이미지 영역은 회색 그라데이션 placeholder로 보인다. 따라서 전체 공용 UI의 완전 번역이나 모든 목록 썸네일 표시를 통과로 주장하지 않는다.

## 최초 실패와 재판정 보존

원래 엄격 비교 결과는 `passed:false`로 그대로 보존했다. 66편의 mailto가 동일 수신자에 언어별 subject/body query를 추가한 실제 serializer 차이였고,15편의 lastmod는 동일 날짜의 UTC 자정 ISO 형식이었다. 저장된 응답만 재독해 수신자·fragment 동일 및 query key 제한, 정확한 동일 날짜만 허용했다. 다른 href는 계속 exact 비교했다. 재판정의 네트워크 요청은0회이며 메일 전송도 없었다.

재판정 파일도 ZH 최초 HTML 한계를 표시한 `passed:false`를 유지한다. 위 실제 확장 클릭을 합친 최종 인도 판정은 `public-verification.json`의 `articleDeliveryVerified:true`다. 이는 공용 UI의 모든 문자열이 현지어라는 뜻이 아니다. 초기 sandbox DNS 실패와 커밋 변경으로 실행을 멈춘 응답도 원자료와 함께 남겨 두었다.

## 범위와 한계

195편 모두 HTTP 원문 내용 대조를 받았으나 모든 페이지의 모든 기기 시각 검수는 아니다. 대표 브라우저37건 범위를 넘는 표시를 주장하지 않는다. 외부 법률출처 URL은 본문 보존을 확인했고 외부기관 전체 링크의 현재 가용성을 재조사하지 않았다. 이번 검증은 검토된 원문과 공개 결과의 일치 확인이며 새 법률감수·사람 원어민 감수는 아니다. 직접 배포, Air 큐 실행, 인프라 변경, 고객정보 접근·전송, 폼 제출은 하지 않았다. Air 자체 상태의 과거 접근 제한과 현재 공개 도달 여부를 혼동하지 않는다.

주요 증거: `public-verification.json`, `bindings/f66daa9f153537c000d23486e8be638472251012/source-manifest.json`, `runs/20261026T065924226319Z/results.json`, `results-serializer-reassessed.json`, 원응답·개별기사 검사, `browser/results-f66daa9f.json`, `browser/execution.json`, `browser/visual-review.json`.
