# ASTRA-PASS — es / COL-es-1 (taiwan-one-shareholder-limited-company-director)

검수 시각: 2026-10-23 00:18 KST (gate: Claude Code Opus 5.5, Astra limited until 10/27)
2회차 독립 최종 검수다. 작성 세션(grok → 22:45부터 Claude가 grok 역할), 교차 검수 세션(opus), 1회차 게이트 세션과는 별개인 새 Claude Code 세션이다. 판정은 MAJOR 0, MINOR 0이다. 원고는 수정하지 않았다. 1회차 지적 파일은 `.ASTRA-FAIL-fixed-1.md`로 이름을 바꿨다.
대상 SHA-256: `a9e1ce03f7fb93d59473daf147e094e0471360fd4169609630ca9fb34c913d99`. READY에 적힌 값과 같고, 검수를 시작한 00:00과 판정 직전인 00:13에 다시 계산해도 같았다.

## 확인한 범위

- 1회차 게이트 지적(`.ASTRA-FAIL-fixed-1.md`, MINOR 1)은 반영됐다. 67행은 公司法 제109조 제3항 「規避、妨礙或拒絕」에 맞춰 「Eludir, obstaculizar o rechazar esa vigilancia」로 고쳐졌다.
- 교차 검수: `.WROTE-grok`, 비작성자 `.CROSS-opus.md`(MAJOR 1·MINOR 7), `.CROSS-opus-response.md`가 있고 8건 모두 원고에 남아 있다.
  - 경제부 해석 경로(55행), 3인 상한 비단정(57행)
  - 감찰권 결론을 자연인 단독사원·제27조 제1항의 경우로 한정(63·65행, summary·FAQ 2)
  - 제48조 내용(61행), 「supervisor (監察人)」, 제108조 주어·과반수(41·45행)
  - 就業服務法 제46조(47행), FIA 절 축소(73행), 스페인어 표현 8건
- 조문: 이 세션에서 LawSingle을 새로 열어 대조했다(`reviews/gate-esfr-20261022-r5/law/col-es-1.txt`).
  - 公司法 제27·48·98·108·109·128-1조가 맞다. 제108조 제1~3항(1~3인, 表決權 3분의 2, 有行為能力之股東, 董事過半數 互選, 股東 대리, 경업 3분의 2)도 맞다. 109조 제1~3항(監察權, 律師·會計師, 規避·妨礙·拒絕에 2만~10만 罰鍰)도 맞다. 128-1조의 지정 규정은 현행 제4항이 맞다.
  - 就業服務法 제46조 제1항 제2호·제2항, 外國人投資條例 제8조도 맞다. 外國人投資條例 LawAll의 修正日期는 民國 86-11-19로, 그 뒤 개정이 없다.
- 경제부 해석 經商字第10502411030號: 작성자가 받은 gcis API 원문(`research/claude/gcis-8825.json`)을 대조했다. 날짜 105-04-25, 128-1조(당시 제2항) 유추, 法人股東 직접 지정, 27조 제1·2항 등기 이사가 아님, 108조 제1항 불적용이 확인된다. 링크는 200이다.
- 판결·수사 사건이 없고, 스페인·중남미 제도 비교도 없다.
- 형식
  - columns-es 652와 키가 같다(tags·caption 포함). audience ["es"], topic company, featured_image "TBD", caption 「Escena ficticia」다.
  - alt는 가상의 빈 의자·펜·닫힌 폴더 장면이다. `images/COL-es-1-hero.jpg`와 맞고, 글자·로고가 없다.
  - FAQ 3개에 마크다운 링크가 없다. 「## Fuentes oficiales」 다음에 확인일 줄을 두는 배치는 652와 같다.
- 연락: abogada Wei Tseng (曾雋崴), Hovering International Law Firm (昊鼎國際法律事務所), mailto 상담 링크, 두 주소(「35號7樓之2」, 「19號6樓之1」)가 맞다. 전화번호·바이라인·서명·AI 표시·검토 완료 주장은 없다.
- 내부 링크 `/es/columns/taiwan-company-establishment-basics`는 columns-es 001이다.
- 중복·번역
  - es 001·004·013·643, zh 183, 4개 언어 610과 질문이 다르다. 번역본도 아니다.
  - fr 세트와 겹치지 않는다.
- 문체
  - 질문으로 여는 도입, 「Cabe uno solo.」 같은 짧은 문장이 있는 자연스러운 스페인어다. 소제목에 명령형·체크리스트형이 없고, 굵은 글씨·이모지도 없다.
  - 대비 틀은 3회다(63·69·73행). 한도 안이다.
  - 같은 배치의 마무리 공식 「Para … sirven/bastan N datos」가 COL-es-2·ISSUE-16에도 있다. 그 두 건은 각 파일의 ASTRA-FAIL에서 고치게 했다. 이 글(75행)은 남는 한 건이라 반려 사유로 보지 않는다.
- 도구(이 세션 재실행, `reviews/gate-esfr-20261022-r5/tools.out`): esfr_variety --lang es OK(cv 0.454, short 0.104, contrast 0), 공용 variety_metrics(--lang en 근사) 위반 없음, hygiene_col·hygiene OK, links 9개 bad 0, 굵은 글씨 0.

대조 자료: `reviews/gate-esfr-20261022-r5/` (inputs.sha256, law/col-es-1.txt, tools.out).
