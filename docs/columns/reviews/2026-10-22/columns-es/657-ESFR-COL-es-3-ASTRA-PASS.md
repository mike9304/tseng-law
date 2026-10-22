# ASTRA-PASS — es / COL-es-3 (taiwan-spanish-document-legalization-taipei-office)

검수 시각: 2026-10-23 00:45 KST (gate: Claude Code Opus 5.5, Astra limited until 10/27)
3회차 독립 최종 검수다. 작성 세션(grok → 22:45부터 Claude가 grok 역할), 교차 검수 세션(opus), 앞선 게이트 세션들과는 별개인 새 Claude Code 세션이다. 판정은 MAJOR 0, MINOR 0이다. 원고는 수정하지 않았다. 2회차 지적 파일은 `.ASTRA-FAIL-fixed-2.md`로 이름을 바꿨다.
대상 SHA-256: `6cca2e934de180d2a2cbd6e36eb325720d44593fde40c77f7f3590371d3c6b97`. READY에 적힌 값과 같고, 검수 시작(00:33)과 판정 직전(00:43)에 다시 계산해도 같았다.

## 확인한 범위

- 2회차 게이트 지적(`.ASTRA-FAIL-fixed-2.md`, MINOR 2)은 반영됐다.
  - 41행은 「el sello de la oficina de Taipéi es el último de la cadena」다. 45·49행 인증 경로와 맞는다.
  - 77·78행 출처에 대표처 두 페이지의 게시일·갱신일이 들어갔다(post/99 2023-03-21·2023-07-12, post/168 2023-05-09·2024-04-30).
- 1회차 지적(`.ASTRA-FAIL-fixed-1.md`, 「la página」 과다)은 반영된 채 남아 있다.
- 교차 검수: `.WROTE-grok`, 비작성자 `.CROSS-opus.md`(MAJOR 1·MINOR 5), `.CROSS-opus-response.md`가 있다. 원고에 남아 있는 것은 아래와 같다.
  - 공증 위임장 경로(49행): Colegio Notarial → Ministerio de Presidencia, Justicia… → Exteriores → 대표처
  - 등기소·상업 서류 경로(51행)
  - 두 신분 서류 목록의 논리(59·61행), 국내 번역 공증(69행)
  - 領事事務局(65행, FAQ 3), 작성 메모 문장 삭제, 도치 정리
- 원문 직접 대조(이 세션에서 새로 받았다, `reviews/gate-esfr-20261022-r6/sources/`, 모두 HTTP 200)
  - roc-taiwan es_es/post/99는 아래 내용이 모두 일치한다.
    - 「Todo documento público español si va a ser entregado en un organismo de Taiwán, debe ser legalizado…」, MAEUEC 선행 인증
    - 서류 4종(양식은 이메일로 요청, 원본과 사본, DNI 또는 NIE와 여권, 대리인 것 포함)
    - 14/21유로, 평일(공휴일 제외) 9:30~13:30, esp@mofa.gov.tw, Rosario Pino 14-16 Piso 18 Dcha. Torre Rioja 28020
  - roc-taiwan es/post/168도 일치한다.
    - 문서 종류 목록, 「僅驗證西班牙外交部簽字官之簽字署實」
    - Registro Civil 경로(Tribunal Superior → 司法部 → 外交部 → 本處), Título oficial(Ministerio de Universidades), Título propio(公證人 → 公會 → 司法部 → 外交部 → 本處)
    - 國人 본인 출석(授權書·遺產繼承權拋棄書·外籍配偶中文姓名聲明書), 「駐外領務人員辦理公證事務辦法」에 따른 대체 경로와 우편·대리
    - 「申請人(及代理人)西班牙DNI/NIE及臺灣護照資料頁影本」, 「規費以西國外交部驗證章數計算（僅收現金）」
  - exteriores.gob.es 「Legalización y apostilla」도 일치한다.
    - firma ológrafa·calidad·sello, 내용·이후 용도 무책임
    - 「Como regla general…」, 원본 또는 같은 기관 발행 인증 사본·firma manuscrita, 전자서명 불인정
    - 아포스티유(sustituye)·런던 협약(suprime)
    - 3.2.2 documentos notariales(「siempre que no se refieran a documentos públicos que tengan su propia vía」, Colegio Notarial, Ministerio de Presidencia, Justicia y Relaciones con las Cortes), registradores, mercantiles(Cámara provincial, Consejo Superior)
  - eyes.mofa.gov.tw FAQ 7454도 일치한다.
    - 發布 106-08-07, 更新 115-08-19, 「本局…複驗文件，依法並無辦理翻譯業務之權限」, 사용 기관이 결정
    - 국내 공증처·민간 공증인, 해외 두 방법, 「不負責審核中譯文」, 「原文件未經驗證，不得僅申請中文譯本驗證」
  - 「Ministerio de Universidades」는 두 공식 페이지가 지금도 쓰는 이름이고, 45행은 대표처 페이지에 귀속해 옮겼다.
- 판결·조문 인용이 없다. 스페인 제도는 스페인 외교부 공식 페이지로만 설명했다. 대만이 협약 당사국인지 단정하지 않고, 대표처가 공표한 조건으로만 쓴다.
- 형식
  - columns-es 652와 키가 같다(tags·caption 포함). featured_image "TBD", caption 「Escena ficticia」다.
  - alt(종이 묶음·리본·글자 없는 도장, 오후 창가)는 `images/COL-es-3-hero.jpg`와 맞는다. 글자·로고·사람은 없다.
  - FAQ 3개에 링크가 없다. 「Fuentes oficiales」 다음 확인일 줄 배치는 652와 같다.
- 연락: abogada Wei Tseng (曾雋崴), Hovering International Law Firm (昊鼎國際法律事務所), mailto, 두 주소(「35號7樓之2」, 「19號6樓之1」)가 맞다.
  - 대표처 페이지의 전화번호는 옮기지 않았다.
  - 바이라인·서명·AI 표시·검토 완료 주장은 없다.
- 중복·번역
  - ja 545(일본 법인 서류 인증), ko·zh·ja 233(일본 거주 상속포기 인증), ko·zh 022(혼인 서류)와 나라·경로·질문이 다르다.
  - es에는 같은 글이 없다. fr 세트와 겹치지 않고 번역본도 아니다.
- 문체
  - 아포스티유와 대비해 여는 두 문장 도입, 질문 1개(49행), 짧은 문장이 있다.
  - 대비 틀은 원문 기준 1회(71행)다. 명령형·체크리스트형 소제목, 굵은 글씨, 이모지는 없다.
  - 스페인 독자에게 자연스러운 행정 용어(DNI, NIE, vía ordinaria/urgente, Colegio Notarial)를 쓴다.
- 도구(이 세션 재실행, `reviews/gate-esfr-20261022-r6/tools.out`)
  - esfr_variety OK(cv 0.583, short 0.089, consec 2/2)
  - variety_metrics(--lang en 근사)는 위반이 없다.
  - hygiene_col·hygiene OK, links 4개 bad 0, 굵은 글씨 0

대조 자료: `reviews/gate-esfr-20261022-r6/` (inputs.sha256, sources/roc99·roc168·exteriores·mofa7454, tools.out).
