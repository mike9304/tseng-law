# PIPELINE v2 (19:5x KST 10/20, BRIEF.md보다 우선) — 5개 모델 협업, GitHub 브랜치 동기화

## 목표 산출물
완성 Threads 글 소수: 먼저 KO 3편(P1·P2·P3), 그다음 같은 3건의 JA·EN. 각 편 = 카드 PNG(1080×1350) + 본문 + 첫 댓글 + 한국어 뜻풀이(JA/EN). 완성본 경로와 상태는 STATUS.md '최신 산출물'에.

## 동기화
- 두 맥 모두 ~/threads-collab-1020. sync.sh(5분 루프)가 브랜치 threads-collab-1020(mike9304/tseng-law, 사이트 콘텐츠 아님)으로 자기 소유 폴더만 push하고 상대 폴더를 pull. 상대 폴더는 수정해도 덮어써진다 = 수정 금지.
- Studio 소유: astra/ opus/ grok/ review-studio/ STATUS.md HANDOFF-studio.md BRIEF.md PIPELINE.md shared/
- Air 소유: air-astra/ air-opus/ review-air/ HANDOFF-air.md
- 요청은 자기 기계의 HANDOFF-*.md에 append. ('HANDOFF.md', 'review/' 대신 이 이름을 쓴다.)
- STATUS.md 갱신은 Studio Astra(조정자)가 한다. 다른 모델은 자기 폴더의 NOTES.md에 상태를 적고 Astra가 모은다.

## 역할
- Studio Codex Astra (tmux threads-astra-1020) = 조정자: 리서치·참여 분석(prior-astra-1007의 고참여 게시물 1,000+/1,500+ 연구, prior-codex-1018 market-analysis/research 재사용), 주제 3건 선정과 사실 팩(판결 원문 요지·조문 law.moj.gov.tw 대조·인용 가능한 문장) → shared/topics/P1..P3/FACTS.md. 원어민 톤 비평, 라운드 채점, 승자 선정, STATUS 관리.
- Air Codex Astra (air-astra/) = 두 번째 비평가/JA·EN 원어민 톤 비평. 칼럼 배포 게이트·gapfill 우선, 남는 용량만.
- Studio Opus (opus/), Air Opus (air-opus/), Studio Grok 4.7 (grok/, tmux threads-grok-1020) = 경쟁 초안. 같은 주제를 각자 따로 쓴다(best-of-3). 경로: <폴더>/P1/r<N>/{body.md,first-comment.md,cards.md}
- 교차 비평: 각 작성자는 다른 두 작성자의 같은 라운드 초안을 비평(review-studio/ 또는 review-air/에 <비평자>-on-<작성자>-P1-r1.md).
- 카드 렌더·시각 확인: Studio Opus(prior-opus-1019 렌더러 재사용), 승자 확정 후. 직접 열어 겹침·잘림 확인.

## 라운드
1. Astra가 FACTS 작성 → 2. 작성자 3명 초안 r1 → 3. 교차 비평 + Astra 채점 → 4. Astra가 승자(또는 섞을 부분) 지정, 작성자들이 r2 → … 루브릭 PASS까지 반복 → 5. 렌더 → 6. Astra 최종 검수 → STATUS에 READY-FOR-GROK-BOT. Grok Bot 검수 전엔 사용자에게 가지 않는다.

## 루브릭 (전 항목 통과해야 PASS)
- 첫 두 줄: 무슨 일이고 결론이 뭔지 일상어로(사용자 반려 "읽으면서 뭔 내용인지 모르겠어").
- 본문이 사실관계와 판결 이유를 끝까지 설명. 공개 판결만, 조문 원문 대조, 과장 0, 사실 오류 0.
- 화자 = 대만 로펌 한국인 사무장 손정민이 옆에서 지켜본 이야기. 변호사 아님. 변호사명 曾雋崴.
- AI티 0: 매끈한 요약 톤, 법률 요약문, 붙인 자기소개 마무리, 훈계조 "저라면…" 마무리, 명령조, 같은 문장 틀 반복.
- 훅: 대만 거주 한국인(JA/EN판은 일본인·미국인)이 멈춰 읽을 이유.
- 참여 유도는 본문 끝이나 첫 댓글에만.
- 마지막 카드는 유용한 정보(체크리스트·기한·서류 등).
- AI 표시 0(본문·이미지·alt·메타데이터), '변호사/원어민 검수' 허위 표기 0. 500자 이하.

## 자원 규칙
- Air의 Astra·Opus는 칼럼 배포 게이트·gapfill이 우선. 그쪽이 돌 때는 대기, 번갈아.
- Studio Opus는 이슈 칼럼 레인과 같은 계정. 한도 경고가 보이면 NOTES에 적고 쉰다.
- grokgoal 세션(트레이딩)은 절대 건드리지 않는다.
- 게시·전송·소리 재생 금지. ~/Projects/tseng-law 금지. 사용자 결정 3건(서명 줄·사무장 반응 줄·C09 가족관계) 건드리지 않음.
