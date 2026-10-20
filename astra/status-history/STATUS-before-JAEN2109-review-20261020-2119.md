# STATUS — threads-collab-1020
갱신: 2026-10-20 21:10 KST · PIPELINE v2 + Grok Bot 20:10·20:40·21:00 적용

## 현재 단계
- **KO r6 진행 중 · READY 0/3.** Grok Bot21:00 검수로 r5 READY를 철회했다. Studio 선정은 Opus 세 편을 유지하되, 21:06 제출본은 도입/메타/직역/치아는 수정과 변경PNG3장·묶음 일치에 대해 Astra PASS. Grok 변경 교차 비평이 아직 없어 r6 진행 중을 유지한다.
- JA·EN 제작·검수는 병행한다. JA P1·P2의 이전 문안PASS도21:00 구조/메타 수정 전 기록이다. EN P1·P2 r2 및6편 첨부·alt·묶음이 도착했고, P3 JA의 의미/조건과 두 언어PNG12장 배치는 통과. P3 EN은 성년 뒤 치료 조건·금액 표현·의사 소견/판단 주어 수정 요청. JA READY0/3, EN READY0/3.
- 공통 최신 기준: shared/topics/README.md의21:00 절. 앞선 ‘읽는 화자 메타 문장을 넣기’ 처방은 철회하고 사건 자체를 전하는 문장으로 바꾼다. 기존 의미 보존 지적은 유지한다.
- Air 도착을 기다리지 않는다. 사용자 결정3건도 제작 대기 조건으로 삼지 않는다.

## Bot 최종 컨펌
서명 줄·사무장 실제 반응 줄·P3(C09) 가족관계 표기는 Grok Bot이 최종 컨펌 때 사용자에게 확인한다. 현재는 서명/반응 없는 판, P3는 임시 ‘부모·아이’다. 이를 확정하거나 지금 제작의 대기 조건으로 삼지 않는다.

## Astra 검수·선정
- 공통 기준은 shared/topics/README.md. 본문 생략 종결 최대1, 같은 위치 어미 틀 해소, 읽는 화자 비교판, 꾸민 경험/감정 금지, 대만 거주 독자의 한 줄 경험 질문, P2 미판단 증인 조건 보존을 적용했다.
- r5 이력의 KO 본문은 495/499/497자, 첫 댓글은166/144/161자. 첨부는2258/2816/3367자. 숫자·조건·주장 귀속 대조와 교차 비평을 닫았다.
- r5 이력 카드17장(6+5+6) 1080×1350. P2 카드5는 새 PNG 직접 확인, 나머지16장은 앞서 직접 확인한 PNG와 바이트 동일. 눈에 띄는 겹침/잘림 없음. 실제 휴대전화 피드 테스트는 하지 않았다. PNG 텍스트 메타데이터 없음(bKGD는 존재).
- P3 ‘다투지 않은 금액’ 복원을 수용했다. 초기20:43 감사 뒤 변경을 r5 최종 해시 검사에서 확인하고 새 사본으로 재검수했다. r5 당시 근거는2046 감사이며,21:00 뒤에는 r6 재검수가 필요하다.
- Grok r6도20:40 필수 수정 PASS. 기본/시점489/500씩, 댓글163/143/159. P2 댓글 부담/P3 사고 범위는 선택 비교 의견이며 추가 KO 라운드를 요구하지 않는다. 비선정·미렌더 후보를 READY로 세지 않는다.
- P2 선택 한국 비교는 민법836·가족관계등록법75/76 공식 원문 확인 후 첨부에만 반영. JA·EN에서 한국 비교를 그대로 옮기지 않는다.
- 기존 연구·초안·검수 기록은 보존했다. 쓰기 경로는 astra/·shared/·review-studio/ASTRA-*·HANDOFF-studio.md·STATUS.md. PIPELINE v2가 옛 BRIEF/goal 경로보다 우선한다.

## 작성자·비평가 상태
- Studio Opus: KO r5 최종 묶음 완료, P1·P2·P3 JA·EN r1 제출, EN 후속 수정 진행. 본문/댓글/cards/뜻풀이/이미지 도착. JA·EN 첨부·alt·최종 묶음은 후속 확인 대상이다.
- Studio Grok: KO r6 새 필수 수정 완료, Opus r5 교차 비평 종결. 20:50 JA·EN 작성·교차 비평 인계. 실제 새 언어 제출은 아직 확인되지 않음.
- Air Opus·Air Astra: 로컬 폴더·HANDOFF-air·review-air 미도착. 수신 확인 미완료를 Studio 대기로 바꾸지 않는다. 자원 우선순위 유지·중복 세션 기동 없음.
- 동기화 관측은 이전 인계에 보존. tmux 조회의 sandbox 거부는 세션 중단/verified wait의 증거가 아니다. Studio 작업 진척은 실제 제출 파일로 확인한다.

## 최신 산출물
| 편 | KO 최종 묶음 | PNG | 본문/댓글 | 상태 |
|---|---|---|---|---|
| P1 C03 | opus/P1/r6/threads-ready-ko.md | opus/P1/r6/images/ko/ 6장 |488/166|r6 Astra PASS·교차 비평 전|
| P2 C13 | opus/P2/r6/threads-ready-ko.md | opus/P2/r6/images/ko/ 5장 |491/144|r6 Astra PASS·교차 비평 전|
| P3 C09 | opus/P3/r6/threads-ready-ko.md | opus/P3/r6/images/ko/ 6장 |460/161|r6 Astra PASS·교차 비평 전|

- KO r6 변경 검수: review-studio/ASTRA-on-opus-KO-r6.md · astra/KO-r6-AUDIT-20261020-2106.json
- 이전 r5 검수 색인(현행READY아님): astra/KO-READY-20261020.md · opus/KO-BOT-PACKAGE.md
- r5 검수 이력: review-studio/ASTRA-FINAL-KO-r5-20261020.md
- r5 감사 이력: astra/FINAL-KO-r5-AUDIT-20261020-2046.json(20:46 P3 복원 반영)
- 선정/비평 판정: review-studio/ASTRA-STUDIO-SELECTION-20261020.md · ASTRA-CROSS-REVIEW-DECISIONS-20261020.md · ASTRA-on-grok-r6.md
- P3 JA·EN 검수: review-studio/ASTRA-on-opus-P3-JAEN-r1.md · astra/P3-JAEN-r1-AUDIT-20261020-2058.json
- P2 JA·EN 검수: review-studio/ASTRA-on-opus-P2-JAEN-r1.md · astra/P2-JAEN-r1-AUDIT-20261020-2055.json
- P1 JA·EN 검수: review-studio/ASTRA-on-opus-P1-JAEN-r1.md · astra/P1-JAEN-r1-PNG-AUDIT-20261020.json
- JA·EN 검수 입력: opus/P1/ja/r1/ · opus/P1/en/r1/ · opus/P2/ja/r1/ · opus/P2/en/r1/ (완성 승인 전)
- 사실 팩: shared/topics/P1..P3/FACTS.md · shared/topics/P2/KOREA-COMPARISON.md
- 공통 문체: shared/rules/EDITORIAL-VOICE.md · 검수 사본/해시: astra/review-inputs/
- 이전 STATUS: astra/status-history/. 게시·전송·소리 재생 없음.

## 다음 작업
KO r6 네 필수 수정·변경 부분 교차 비평/최종 검수, 같은 변경의JA·EN 전파. P3 JA·EN 및 P1·P2 EN 수정본·첨부 검수를 병행. Bot의 KO 추가 수정이 오면 해당 번역에 전파한다. 새 사용자 질문 없음. 목표는 JA·EN까지 이어지므로 active 유지.
