# B5 커밋 전 통합 결과

2026-10-26 KST. Root가 B4 audit commit435e9dd8a2f465c238c6f58716246058bb3981f8의 main push 종료 후 승인한 범위를 통합했다. HEAD는 그대로이며 이 작업에서 build/commit/push/deploy는 실행하지 않았다.

신규7언어 km/mn/sr/sl/lt/lv/et의704–70621편과 기존DE704 교정본1편을 R에 반영했다. 전22개가 동결된 저자·독립 검수본과 바이트 단위로 일치한다. 신규21편 published/lastmod는26일, 명시audience·내부author·FAQ3개·캡션·이미지·원문 출처는 보존됐다. 모든 원고SHA·본문/FAQ별SHA·메타데이터는 [최종 원고 manifest](integration-final-manuscript-manifest.json)에 있다.

DE704는6개월 이하 학생 전자 ARC의 납부 후 다운로드·출력 의무 한 문장과 lastmod만 변경했다. 두 치환 역복원이 기존 R 원본07b02d98…a306과 정확히 같고 수정본은e4088a2d…0ce2다. 원 publication2026-10-24, 표시24.Oktober2026, 다른frontmatter·FAQ·URL집합·나머지본문은 같다. 신규21편의 날짜와 혼합하지 않았다.

ARC 테스트 registry는42→49다. 기존42개·세 파일명·모든assertion을 유지하고7개항목과 설명만 추가했다. [정확한 patch](integration-registry.patch)와 역복원 기록이 있다. 런타임 앱은 수정하지 않았다. 실제 inventory에서 세 slug 각각49개/누락0, 전문2121편·로컬표시1854편·전언어공통21slug를 확인했다. 별도issue125편은 전문칼럼에 더하지 않았다. 목표286/언어 부족은 파일11897편·표시12164편으로 남는다.

## 실제 검사

- 관련27 suites,747/747 tests PASS, exit0. 기존10개 게시 검사와19개 직접helper소비자 및topic검사의 중복 제거 범위이며 전체 저장소 검사로 주장하지 않는다. [명령/시간/해시](integration-affected-tests-command.json), [원로그](integration-affected-tests.log), [요약](integration-tests-summary.json)을 보존했다.
- Root 최종 content-audit3926a274…faf4b로 신규21편과DE704를 각각 실행해 두 그룹 모두exit0/errors0. 도구·원고는 실행 전후 같았다. 도구의 REVIEW_REQUIRED와publicationReady:false를 유지했다. [최종 실행 영수증](integration-content-audit-final-runs.json).
- 최초 DE검사는 새EN번역과 동일publication/lastmod를 요구하는 입력 기준으로4오류가 났다. 기존DE에 없던EN URL3개와 의도된24/26일 차이다. [최초 결과와 범위 정정](integration-content-audit-initial-scope-mismatch.json)을 보존했다. Root가 승인한 기존 DE before SHA를 명시source-map으로 고정하고, 재검사에서 통합 날짜 옵션을 생략했다. 날짜는 실제metadata24/26을 별도검증했다. 내용·도구·임계값은 통과를 위해 바꾸지 않았다.
- 공유DE 경계 수정본4af341…4de에서 교정본 검사는exit0/FAIL0,60단위/CV0.466. 새21편은 기존 readiness의 각 언어exit0/FAIL0와 검수SHA가 그대로다. 이번에 그21개의 언어 검사를 다시 했다고 표시하지 않는다. Root 소유 도구설치 테스트와 본작업 결과를 구별한다.
- 기존src/scripts6926파일 중 지정DE704와registry 외 변경0, Markdown2229→2250의 정확한21개증가, 삭제0. B3/B4의 기존감사327파일을SHA로 재대조해 변경0이다. [원본보존 증명](integration-source-proof.json). B3/B4 아티팩트에는 쓰기 작업을 수행하지 않았으며 이번 통합에서 그 다중GB 전체를 재해시했다고 주장하지 않는다.

## 다음 실행

감사자료는 A/batch05로 복사하고 [복사목록](integration-audit-copy-manifest.json)에 각SHA를 남긴다. 실제 원고는src/content에 있으며, 중복된1930개 회귀입력 원문 묶음·신규src복사본·pack/빌드 산출물은 감사복사에서 제외한다. 동결입력 manifest·neutral fixture·원로그·원review·실패 기록은 남긴다.

커밋 전 Root는 자신의 도구설치 영수증과 본 manifest를 함께 검토하고 HEAD를 확정한다. 전체 빌드는 `node scripts/static-site/build.mjs --out=out-all-locales-batch05-release26 --port=4638 --media-origin=https://media.tseng-law.com`이며 기존media-origin을 반드시 포함한다. 아직 B5 build/browser/pack 또는 공개 검증 결과는 없다.

빌드 후 계획은 신규21편desktop/mobile42+7slow+7noJS+6navigation+DE704desktop/mobile2=64 browser cases, 별도HE706390px표1회, 전147 ARC49클러스터·metadata·사이트맵·원고대조 및 전체pack무결성이다. [계획](integration-plan.md)과 [기계 판독 계획](integration-plan.json)에 정확한 범위가 있다. 기존 B4 실제62/62 및pack결과를 B5결과로 재사용하지 않는다. 사람 원어민·변호사 승인, 게시완료, 전체49×286목표 달성을 주장하지 않는다.
