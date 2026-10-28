PASS (gate runner: Claude Code Opus 5.5, fresh session; Codex Astra usage-limited)

G2 배우자·가족이 나를 피보험자로 든 보험(保險法 105조 서면 동의·철회, 수익자, 투보 기록 조회). 2026-10-28 10:56 KST 판정. MAJOR 0, MINOR 0.

검수 대상 SHA-256(READY 10:39 기록과 같음, 게이트 시작 10:47 이후 변경 없음):
- 5dada78c20e5400c95fead48f922fb565685d02e3cdedb47a02309571bb5362f ko.md
- ab522725f221629a1c41360c25570a58286f1f72fdccdcc3084cf1b99c71fa81 zh.md
- 5cc121964c4855b2d61f7b94c725cc81b8f89499326090596d06726d2edc17d1 ja.md
- 48078162691c95a8411b888e1184f5d8cb4e1f8607b2c67bd43f5a056a610c19 en.md
- d914cbe59b239d385e9932effabe9eb8df802a1cb0dc1b0e2bdaeb657bd64c9d es.md

## 이번 게이트에서 확인한 것
- 1차 게이트(10:27) MINOR 3건 반영: research/opusB-astra1/G2/before/와 diff. 바뀐 곳은 ko:63(맺음을 ko:39 '한국의 부모를 수익자로' 질문으로 돌림, 保險法 110·111과 일치, ko:51 반복 해소)과 ja:23(예고 문장 삭제)뿐이고 zh·en·es는 그대로.
- 문장 다양성: 다섯 판 FAIL 0(ko·zh-hant·ja·en은 ~/tseng-lanes-shared/variety/variety_metrics.py, es는 tools/variety_metrics_es.py --lang es, 종료 코드 0). ko의 「이혼」 시작 문단 2개로 줄어듦.
- 조문: 保險法 16·17·105①②③·106·110·111·112·113·135(準用 범위 102~105·110~116 포함), 民法 3·1122·1123을 LawSingle 문구와 ko 본문 대조, 일치.
- 河口湖 사건(zh:23·25, en:21): 中央社 202610270031 원문을 이번에 다시 받아 대조 — 19일 富士河口湖町 호텔에서 피살, 日警이 대만 국적 楊 모 씨 체포, 台南地檢 初步認定 犯罪嫌疑重大(使公務員登載不實·共同殺人·詐欺取財未遂), 26일 羈押禁見, 旅平險 최대 2건 1000萬·2000萬. en의 NT$30 million은 두 금액의 합으로 원문 범위. 혐의 부인(TVBS)·羈押은 유죄 판결이 아님·무죄추정·수사 중이 명시되어 있고, 보도에 있는 '虛偽結婚' 등 혐의 사실은 단정하지 않음. ko·ja·es에는 사건 없음(TASK대로 zh·en만).
- 형식: front matter(1027 배포본·FRONTMATTER.md 형식), audience 각 판, published·lastmod 2026-10-28, author 내부 토큰, featured_image "TBD", alt가 images/G2-brief.txt·G2-hero.webp 장면과 일치(가상, 사람·로고·읽히는 글자 없음). 굵은 글씨·이모지·전화번호·AI 표시·바이라인·'검토 완료' 없음. 이메일 wei@hoveringlaw.com.tw와 타이베이 주소(각 언어 표기) 다섯 판 모두 있음.
- 링크: 다섯 판 외부·내부 링크 전부 HTTP 200(이번 게이트 재확인).
- 교차 검수: CROSS-fixed-opusA.md(비작성자 opusA, MUST 8·SHOULD 8) 존재, 반영 기록 reviews/self-G2.md 81행 이하.
- 1차 게이트가 '확인했고 문제없던 것'으로 기록한 항목(壽險公會 478·480 조회 안내, 일본 保険法·스페인 Ley 50/1980 비교, 판 사이 번역형 대응 없음, 중복 없음)은 해당 판이 바뀌지 않아 그대로 유효.

## 변호사 확인 권장(게시 차단 사유 아님)
- zh·en의 河口湖 사건은 수사 중(羈押禁見 단계)이다. 기소·불기소 등 진행이 생기면 해당 문단의 시점 표현을 다시 볼 것.
- 수익자 변경에 피보험자 동의를 요구하는 표준 약관(人壽保險單示範條款) 문구는 작성 단계에서 원문을 확보하지 못해 본문에 쓰지 않았다. 본문은 조문(110·111) 범위로만 말하고 있어 오류는 아니다.
