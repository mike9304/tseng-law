# 호정(昊鼎) Threads 마케팅 협업 레인 — 2026-10-20 시작 (Codex Astra + Claude Opus 5.5, 맥스튜디오)

## 목표
대만 거주 한국인(그다음 일본인·미국인)이 읽고 저장·공유하는 Threads 글+카드뉴스("오늘의 판결")를 계속 연구·작성·검수한다. 처음부터 다시 하지 말고 이어서 한다.

## 이어갈 출발점 (읽기 전용 참고)
- prior-opus-1019/out/STATUS.md, out/{r16,c13-r3,c09-r2}/README.md: C03·C13·C09 네 언어 재작업 PASS(10/19 21:5x). 사용자 결정 3건 대기(서명 줄, 사무장 반응 줄, C09 가족관계 표기). 이 결정은 Grok Bot이 사용자에게 묻는다. 너희가 정하지 말 것.
- prior-codex-1018/: CARDNEWS-BRIEF-20261018.md(반려 규칙), ROLE-SPLIT-20261018.md, drafts-for-review/20261018-cardnews-r8~r15, c09-r1, c13-r1, research/, voice-lab/, market-analysis-20261018/.
- prior-astra-1007/: COLUMN-VOICE-RULE.md, POSTS.md, REPORT*.md.
- 사용자 반려 기록: "읽으면서 뭔 내용인지 모르겠어"(10/19 20:19). 첫 두 줄에 무슨 일·결론을 일상어로.

## 역할
- Codex Astra (tmux threads-astra-1020): 리서치·데이터·패턴 분석(훅, 참여 유도, 경쟁 계정, 공개 판결 후보 발굴과 law.moj.gov.tw·judgment.judicial.gov.tw 대조), 그리고 Opus 산출물 엄격 검수(AI티·사실·과장). 쓰는 곳: astra/, review/ASTRA-*.md
- Claude Opus (tmux threads-opus-goal-1020): 카드뉴스·본문·첫 댓글 작성과 재작성, 카드 렌더. Astra 리서치 산출물 검수(review/OPUS-*.md). 쓰는 곳: opus/
- 서로의 폴더는 수정 금지. 요청은 HANDOFF.md에 한 줄 추가(append만).
- STATUS.md는 섹션별로 자기 섹션만 고친다.
- prior-* 폴더는 읽기만. 필요한 파일은 자기 폴더로 복사해서 쓴다.

## 규칙 (위반 시 반려)
- Threads에 게시·전송·예약 금지. 외부 이메일·메시지 금지. 결과물은 파일로만.
- 화자: 대만 로펌의 한국인 사무장 손정민. 옆에서 지켜본 판결 이야기. 변호사 아님. 변호사 이름은 曾雋崴. 사무소 주소 표기는 「19號6樓之1」.
- 공개 판결만. 조문은 law.moj.gov.tw 원문과 대조.
- AI티 금지: 매끈한 요약 톤, 법률 요약문, 붙여 넣은 자기소개 마무리, 훈계조 "저라면…" 마무리, 명령조.
- 마지막 카드는 유용한 정보. 참여 유도는 본문 끝이나 첫 댓글. 본문은 사실관계와 판결 이유를 끝까지 설명.
- AI 표시 금지(본문·이미지·캡션·alt·메타데이터). '변호사/원어민 검수' 허위 표기 금지.
- 소리 재생 금지(afplay·say·TTS 등).
- ~/Projects/tseng-law 절대 건드리지 않음. ~/Projects/tseng-threads 원본도 수정 금지(읽기만).
- 사용자에게 가기 전에 Grok Bot이 엄격 검수한다. 사용자에게 직접 묻지 말고 STATUS.md '열린 질문'에 적는다.
- Grok Bot이 30분마다 STATUS.md를 보고 방향을 고친다. HANDOFF.md에 [GROK] 줄이 오면 최우선으로 따른다.

## 루프
작업 → 상대 검수 요청(HANDOFF) → 검수(PASS 기준: AI티 0, 사실 오류 0, 과장 0, 첫 두 줄 테스트 통과) → 고침 → STATUS 갱신 → 다음 건. 멈추지 말고 계속. 한도에 걸리면 STATUS에 적고 대기.
