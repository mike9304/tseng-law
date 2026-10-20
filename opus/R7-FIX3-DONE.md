# R7 수정3 완료 — Astra 3차 검수(review-studio/ASTRA-R7-FIX2-20261021.md) MINOR 3건 반영 (Studio Opus)

2026-10-21 01:33 KST. r7 폴더 안에서 고쳤다. 게시·전송·소리 재생 없음. 본문·첫 댓글과 P2·P3는 그대로(P1 본문 488·481·493, 첫 댓글 166·173·215).

## 반영 내용

1. P1 첨부의 옛 카드 참조(KO·JA·EN): 지금 카드 6에는 0元·2배 비교가 없으므로, 그 문장을 첨부 안의 249조 설명을 가리키게 바꿨다. 249조 1~4호 조건·예외·출처 링크는 그대로.
   - KO ‘마지막 카드의 0元·2배는 … 비교한 거라’ → ‘위 249조의 0元·두 배는 계약금을 얼마 돌려주느냐만 정한 거라, 다른 손해배상까지 계산한 숫자가 아니에요.’
   - JA ‘カードの0元・2倍は…比べたもので’ → ‘上の第249条の0元・2倍は、定金をいくら返すかだけを決めたもので、損害賠償全体の金額ではありません。’
   - EN ‘The "0" and "2x" on the cards only compare …’ → ‘The zero and double under Art. 249 above cover only how the earnest money itself comes back, not total damages.’
2. P1 JA 카드 06·alt: 오른쪽 칸 본문 → ‘会社の責任で契約を / 履行できなくなった / ことを示す資料’(Astra 제안문 그대로). 세 줄이 들어가도록 칸 제목을 ‘会社の責任の証拠’로 줄여 한 줄로 만들었다.
3. P1 EN 카드 06·alt: 왼쪽 칸 ‘The judge saw it as / The renter's side’ → ‘The judge's finding / The renter was responsible.’(Astra 제안문 그대로).

## 렌더

- opus/render/c03_r16.py의 proof 레이아웃: 칸 본문을 최대 3줄까지 허용하고(본문이 라벨과 겹치지 않게 높이 검사), 판단 값이 두 줄이면 라벨을 조금 올리고 상태 줄을 조금 내린다. 처음 렌더에서 EN ‘responsible.’이 체크 표시·‘On record’와 겹친 것을 직접 보고 고쳤다(자동 점검은 이 겹침을 잡지 못했다).
- KO 카드 06은 픽셀 동일(바꾸지 않음). JA·EN은 06만 교체, 01~05 픽셀 동일. 두 장 직접 열어 겹침·잘림 없음. 점검 문제 0, 최소 32px. PNG 텍스트·EXIF 청크 없음.
- 게시 구성 3개: 코드 블록(본문·첫 댓글·첨부)=원본 바이트 일치, alt 표=opus/pkg/alt-<lang>.json 일치. 공개 문안 서명·사무장·변호사·AI 표기·굵은 강조 0. 첨부 숫자 변화는 옛 카드 표기(0元·2배, "0"·"2x")를 바꾸고 ‘249’를 넣은 것뿐이며 판결 금액·링크는 같다.

## 바뀐 파일

- opus/P1/r7/attachment-v2.md (2,275자 유지) · opus/P1/ja/r7/attachment.md (2,059 → 2,063자) · opus/P1/en/r7/attachment.md (4,407 → 4,416자)
- opus/P1/ja/r7/images/ja/card-06.png · opus/P1/en/r7/images/en/card-06.png, 두 폴더의 <lang>-overview.png·_review/render-audit-<lang>.json
- opus/P1/r7/threads-ready-ko.md · opus/P1/ja/r7/threads-ready-ja.md · opus/P1/en/r7/threads-ready-en.md (첨부 블록·alt 06·머리말)
- opus/P1/ja/r7/cards.md · opus/P1/en/r7/cards.md
- opus/P1/ja/r7/ko-meaning.md · opus/P1/en/r7/ko-meaning.md (카드 6 뜻풀이·첨부 글자 수)
- opus/render/copy/p1-ja.json · p1-en.json (카드 6)
- opus/render/c03_r16.py (proof 레이아웃 간격)
- opus/pkg/alt-ja.json · alt-en.json (P1 alt 06)
- 백업: opus/render/copy/archive/p1-<ja|en>-before-r7fix3-20261021.json, opus/pkg/alt-<ja|en>-before-r7fix3.json
