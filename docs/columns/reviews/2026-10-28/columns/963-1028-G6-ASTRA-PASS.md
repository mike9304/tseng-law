PASS (gate runner: Claude Code Opus 5.5, fresh session; Codex Astra usage-limited)

G6 대만 법인의 외국인 관리자·전문직과 勞動基準法 제84조의1(책임제). 2026-10-28 10:56 KST 판정. MAJOR 0, MINOR 0.

검수 대상 SHA-256(READY 10:39 기록과 같음, 게이트 시작 10:47 이후 변경 없음):
- 23aea57c72a3f83b0f08c4e6942a8d3809b4a6e2651e7e38b615dacabb24c976 ko.md
- 781299252fb72f96e0c5abbb0c338df0f2a25be3403fe4c94fe27e95b7db0745 zh.md
- 37ff76ce17ac8f0d72632d2a92d84edbb1dc42b7084af117a4b57b0fab1237b6 ja.md
- 270507da875231474cc9662a335a0976f78b11361c499f198052d9a0c30ca39c en.md
- df4442c16adff2da17118d253aa60d2ca4198fdc5bbc68e9500dbc22e15dbef7 es.md

## 이번 게이트에서 확인한 것
- 1차 게이트(10:27) MINOR 3건 반영: research/opusB-astra1/G6/before/와 diff.
  - es 제목(2행·19행) «… para quedar fuera de la jornada ordinaria» — 84-1이 배제하는 것은 30·32·36·37·49조이고 24조(연장근로임금)는 배제하지 않는다는 본문과 맞음.
  - es:41 «La solicitud de aprobación va acompañada del acuerdo escrito, que debe recoger …» — 施行細則 50-2(核備 때 서면 약정 내용) 원문 범위, 요건을 넓히지 않음. es:57 «Reclamarlas tiene plazo: … artículo 126 … prescribe a los cinco años» — 民法 126과 일치.
  - ja:23 예고 문장 → 「一つ目の要件、つまり管理職が公告された職種に当たるかどうかは、勞動部の一覧表と労働基準法施行細則第50条の1第1号の定義で決まります。」 사실 문장, 施行細則 50-1 제1호와 일치(ja 본문의 勞動部 표기와도 통일).
  - ko·zh·en은 그대로.
- 문장 다양성: 다섯 판 FAIL 0(es는 --lang es, 「Para」·「El」 시작 문단 각 2개 이하).
- ko 본문 다시 읽음: 84-1①②, 施行細則 50-1①, 勞基法 79①②(2만~100만, 30⑤ 위반 9만~45만), 民法 126 서술, 노동부 목록(2019-05-23 월 15만 감독관리인원 항목, 업종 지정 항목: 資訊服務業·法律服務業·廣告業), 가상 예(반도체 부품 제조 법인 과장 월 12만, 가상 표시 있음)와 맺음 문장이 서로 맞음(목록에 제조업 관리자 항목 없음). es:43 타이베이 일람표 상한, es:55 32② 46/54/138시간 원문 일치.
- 외국 비교: ko 연합뉴스 AKR20261027096151530(국감 답변 인용), en 미국 DOL Fact Sheet #17A — 1차 게이트가 원문 대조, 해당 판 변경 없음. dol.gov는 봇 차단 403(링크 자체는 공식 주소).
- 형식: front matter, audience·published 2026-10-28, author 내부 토큰, featured_image "TBD", alt가 images/G6-brief.txt 장면과 일치(사람·로고·읽히는 글자 없음). 굵은 글씨·이모지·전화번호·AI 표시·바이라인 없음, 이메일·타이베이 주소 다섯 판.
- 링크: dol.gov 403 외 모두 200(이번 게이트 재확인).
- 교차 검수: CROSS-fixed-opusA.md(비작성자 opusA, MUST 7·SHOULD 3) 존재, 반영 기록 reviews/self-G6.md 86행 이하.

## 변호사 확인 권장(게시 차단 사유 아님)
- 임금 청구권 시효를 民法 126조 5년으로 '보는 것이 일반적'이라고만 썼다(판결 원문 미인용). 표현 강도는 적절하나 실무 확인 대상.
- 한국 화이트칼라 이그젬션 논의(ko)와 미국 FLSA 기준액(en, 2019 규칙 $684/주)은 시점에 따라 바뀔 수 있다.
