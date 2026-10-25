# B5 통합 실행 계획

작성: 2026-10-26T02:09:00.949659+09:00. 현재 R HEAD `435e9dd8a2f465c238c6f58716246058bb3981f8`, status clean. B4 push 후 root의 통합 승인을 받았으며 커밋·빌드는 HEAD 조율 뒤 root가 담당한다.

21편 준비 및 별도 DE704 교정본 총22개를 현재 바이트로 확인했다. readiness에 연결된45개 경로/SHA는 모두 일치한다. KM R2 종료가 반영된21ready manifest를 기준으로 삼고, 이전18ready 검사 기록은 보존한다. 사람 원어민·변호사 승인이나 게시 완료로 표시하지 않는다.

## 통합 범위

신규 km/mn/sr/sl/lt/lv/et704–706은 날짜2026-10-26 그대로 복사한다. R 목적지21곳은 아직 없다. DE704는 학생 전자 ARC6개월 이하·납부 후 다운로드와 인쇄 의무를 보완하고 lastmod만26일로 바꾼 사본이다. 원 publication24일·표시일·FAQ·이미지·출처를 유지하며, 두 치환 역복원으로 현행 R 원본 SHA와 정확히 일치한다. 현행 공유 DE 검사도 exit0/FAIL0,60단위/CV0.466이다.

| 파일 | SHA-256 |
|---|---|
| km704 | `8ae680254e50bf202d7a3ebe1f886de19264a22251bdda5effbdc9c74b649b53` |
| km705 | `f3b6eec9bcd2559f10f6e9fd05d74c8040d1a65ccda1fdcb79632961ad58aeba` |
| km706 | `d1a5eff1eb9fed410075031876b059d635ac4c9de9cd75a61c5a2ac540371286` |
| mn704 | `c33ec471bf92fd0d55977d3e5e40dde1fed5130d73645c3836c43895b1f918de` |
| mn705 | `d54e05e91c9d6e9da6ee536009c01b9d44d34b0a78e74dbe07b2e294dde261ac` |
| mn706 | `f3ced3a9c5be6948ce8ead66d0110be0a8e8309f39f414712f24bff50de965a4` |
| sr704 | `15229f8e599464d507976f6d91818d441c6a1c8be1448af31f79fd79b8730dac` |
| sr705 | `9057c2a83ef6e71ab6f576702943fdf604ae345b627b94d98986baf4a6b7d6b2` |
| sr706 | `1e5a3547ce8437f9ddb4f3a3b61dd62261a4a1dccaa63683d43d9692b73331d9` |
| sl704 | `a87a3ac1137b0012120a56629dccc0e0d64dcbb55a2e2a6110e2be213cde6bd6` |
| sl705 | `90d5e07a124a7b1c6aeb46a5be8293a44007a58f6e2dad2593c96b1067834932` |
| sl706 | `d5b7581f6dcff33cdcb5b65e1b46bd0654e050acb94434bbdaab68222c0aca5b` |
| lt704 | `f46f3545e94950ba11cb30f118689721608e6f9593a088a40b10f3b8618a35a9` |
| lt705 | `33b0cc65e3720963cac03710365c44c3c8a88a953309b38314680bca963c14c5` |
| lt706 | `4b2d935fa2496bf95b6e304f976e937221a6ab696ab9aa7cf526e2811c7cf1c6` |
| lv704 | `f47d6be694c2e9601fa457d64598379b5065fa48a94937d5ff11a76d3637c810` |
| lv705 | `de24030f670164d376227740b49a16a3e1883fa29def34a483fda0672a529102` |
| lv706 | `e5b600ba790cdbcd9f225c1703c81e28e7ab49974d504b4ba77b1070d48e700d` |
| et704 | `f15069557979333b4febbff860e45755472675d20f056ac2d05664f788eaea96` |
| et705 | `6bf9a4fca0d1b90d3bf0e4f46e4c87ba43cb5c4b32989ab3e98eaed52955acc8` |
| et706 | `dce0dce717cd732bce40b187f43ef31cbcf0758d71256c129263c23fc7da856a` |
| DE704 교정본 | `e4088a2d7a48a32b0f63c7642fc4557e537c7db6d840daa69dec09329d200ce2` |

## Registry와 검사

`src/lib/__tests__/native-locale-columns.ts`의 ARC 목록에7개 언어를 추가하고42→49 설명만 갱신한다. 기존42개·세 파일명·assertion은 보존한다. 런타임 locale 목록은 이미49개이므로 앱 변경이 필요하지 않다. 현재126개 ARC 파일은 통합 후147개가 된다.

이 helper의 slug-only 날짜 함수는 원래24일 기준이고 일부 후기 언어의 실제 날짜를 나타내지 않는다. 전체를26일로 바꾸지 않는다. 현재 날짜 소비자는 기존/core 언어에 한정돼 있고 신규7언어의26일·정렬은 실제 loader/산출물로 확인한다. 상세 소비자와 실행 인자는 JSON에 있다.

관련 검사 27 suites를 실행한다: 기존10개 게시 검사,19개 직접 helper 소비자, topic 검사의 중복 제거 집합이다. B4의 cinematic 전용 소스 검사는 이번 콘텐츠 변경 범위에서 제외한다. 전체 테스트 통과로 확대하지 않는다.

Root가 소유한 content-audit todo/contact 및 DE 경계 미러 설치와 충돌하지 않는다. 공유 DE 모듈은4af341…4de이고 R 미러는 아직128fe…106이다. 원 교정 기록의 옛 도구 SHA는 역사 기록이며 원고 불일치가 아니다. Root 설치 완료 후 최종 도구 SHA를 기록하고 통합21편은 publicationDate26, DE704는 publicationDate24/lastmod26으로 나눠 구조 검증한다.

## 빌드와 최종 검증

Root가 통합 결과를 검토해 커밋한 뒤 아래 기존 빌더를 Node24로 전체 실행한다. 포트4638은 실행 시 비어 있는지 확인한다.

```sh
node scripts/static-site/build.mjs --out=out-all-locales-batch05-release26 --port=4638 --media-origin=https://media.tseng-law.com
```

`--media-origin`은 필수다. 기존 packer는 HTML만gzip하고 다른 자산을 그대로 복사한다. B4 최초 옵션 누락 때 원본이3,576,761,792B로 커졌으며 기존2146개 미디어 분리로 정상화했다. 제외 규칙·인프라·미디어 정책 변경은 필요하지 않다. Air의 기존 배포는 추가로 `--data=~/tseng-static-deploy/data/prod-mirror`를 쓰므로 로컬 fallback 검증을 운영 CMS 동일성으로 주장하지 않는다.

최소 브라우저 본검증은64건이다: 신규21편 desktop/mobile42건,7slow,7no-JS,home49/legacyKO3의6navigation,기존 DE704 desktop/mobile2건. 별도로 최근 수정한 HE706의390px 실제 표1건을 확인하고23-1이 한 줄/LTR로 읽히는 실제 캡처를 남긴다. ARC 언어 목록은 정확49, home49를 유지한다. 전147 ARC HTML의 canonical/hreflang/reciprocal/Article·FAQ/sitemap도 정적으로 검증한다.

원고22개 전체본문블록·FAQ·원본이미지 decode·실제 AST table 수·날짜·공개 byline·메뉴/본문 overflow 및 hydration을 검사한다. 메뉴를 열고도 fonts.ready+networkidle을 기다린다. 첫 실패와 수정 후 결과를 구별해 보존한다. 기존 B3/B4 기록은 덮어쓰지 않고 B5/release26 아래 새 증거를 남긴다.

기존 sites-pack.mjs로 B5/release26/pack에만 묶고 모든 HTML gzip 역변환/나머지 자산/headers·redirects를 대조한다. 256MiB(268,435,456B) 실제 여유를 기록한다. B4 최종167,300,148B와 여유101,135,308B는 참고 실측일 뿐 B5 실측이 아니다.

## 인계·완료 범위

실행 순서는 SHA 고정→22개 통합·registry→최종 root 도구의 구조 검사/관련 tests/inventory→감사자료 복사 manifest→root 커밋/HEAD 동결→전체 build→64+1 browser/전수 pack→root push 및 실제 공개 build-info 확인이다. 통합·검사 결과를 먼저 보고하며 임의로 build/commit/push하지 않는다.

현재 실측은 전문2100편/로컬표시1833편/전49언어 공통18slug다. 21편 통합 예상은2121/1854/공통21이며 실제 통합 후 재집계한다. 286편/언어 부족량 예상은파일11897·표시12164로 남는다. ARC3편49언어 완비를 전체 목표 완료로 표시하지 않는다.
