# R7 수정2 완료 — Astra 재검수(review-studio/ASTRA-R7-FIX1-20261021.md) 반영 (Studio Opus)

2026-10-21 01:14 KST. r7 폴더 안에서 고쳤다. 게시·전송·소리 재생 없음. 바뀐 것은 P1 카드 06과 alt 06(KO·JA·EN)뿐이고, 본문·첫 댓글·첨부와 P2·P3는 그대로다(P1 본문 488·481·493, 첫 댓글 166·173·215).

## 반영 내용

P1 마지막 카드를 249조 일반 반환 기준 비교표(0元/2배 봉투)에서 이 사건 입증 상황으로 바꿨다. 249조 1~4호 일반 기준은 첨부에 그대로 있다(KO·JA·EN 첨부 모두 249조 조문 설명과 링크 보존).

| | KO | JA | EN |
|---|---|---|---|
| 머리표 | 이 사건 1심 판단 | この事件の一審判断 | This case · trial court |
| 제목 | 회사 탓이라는 건 / 세입자가 증명해야 했어요. | 会社の責任は、/ 借り手が証明する必要があった。 | Proving the company's fault / was up to the renter. |
| 왼쪽 종이(있음) | 세입자가 댄 이유: 돈 보낸 뒤 보니 짐이 다 안 들어감 · 판사 판단: 세입자 쪽 사정 · 기록에 있음 | 借り手の理由：振り込んだあと荷物が入りきらない · 裁判官の判断：借り手側の事情 · 記録にある | The renter's own reason: After paying, their stuff wouldn't fit · The judge saw it as: The renter's side · On record |
| 오른쪽 점선(없음) | 회사 탓이라는 증거: 회사 때문에 계약을 못 지키게 됐다는 자료 · 증명할 사람: 세입자 · 안 냄 | 会社の責任を示す証拠：会社のせいで契約を果たせなくなった資料 · 証明する人：借り手 · 出していない | Proof of company fault: The company caused the deal to fail · Who had to show it: The renter · None filed |
| 아래 | 그래서 21,800元과 이자 청구는 모두 받아들여지지 않았어요. | そのため、21,800元と利息の請求はどちらも認められませんでした。 | So the claim for the NT$21,800 and interest was rejected. |

판결 대조(사법원 115年度士小字第864號, 10/21 원문 재확인, 이유 三): ‘原告請求依民法第249條第3款規定返還定金者，自應證明被告有可歸責之事由致系爭契約不能履行’(회사 책임 증명은 세입자 몫), ‘原告自陳係因交付定金後始認為房屋空間不足以容納其基本生活物品…核屬可歸責原告致契約不能履行之事由’(세입자 스스로 말한 이유, 세입자 쪽 사정), ‘原告亦未…提出任何證據以證明之’(증거를 내지 않음), 주문 ‘原告之訴駁回’.

## 렌더

- 새 레이아웃 proof를 opus/render/c03_r16.py에 추가(P3 카드 06의 두 문서 레이아웃과 같은 구조, 마지막 카드라 화살표 없음). 기존 deposit_rule 레이아웃은 남겨 둠. 수정 전 사본은 세션 scratchpad.
- P1 세 언어 6장씩 다시 렌더해 카드 01~05는 이전 r7과 픽셀 동일, 06만 교체. 점검 문제 0, 최소 32px. 06 세 장을 직접 열어 겹침·잘림 없음(JA 왼쪽 제목은 접힌 모서리와 가까워 ‘借り手の理由’로 줄임). PNG 텍스트·EXIF 청크 없음.
- 게시 구성 3개: 코드 블록(본문·첫 댓글·첨부)=원본 바이트 일치, alt 표=opus/pkg/alt-<lang>.json 일치. 공개 문안 서명·사무장·변호사·AI 표기·굵은 강조 0, 카드·alt에 옛 일반 비교 문구 0.

## 바뀐 파일

- opus/P1/r7/images/ko/card-06.png · opus/P1/ja/r7/images/ja/card-06.png · opus/P1/en/r7/images/en/card-06.png
- opus/P1/r7/ko-overview.png · opus/P1/ja/r7/ja-overview.png · opus/P1/en/r7/en-overview.png, 각 _review/render-audit-<lang>.json
- opus/P1/r7/threads-ready-ko.md · opus/P1/ja/r7/threads-ready-ja.md · opus/P1/en/r7/threads-ready-en.md (alt 06·머리말)
- opus/P1/r7/cards.md · opus/P1/ja/r7/cards.md · opus/P1/en/r7/cards.md
- opus/P1/ja/r7/ko-meaning.md · opus/P1/en/r7/ko-meaning.md (카드 6 뜻풀이)
- opus/render/copy/p1-ko.json · p1-ja.json · p1-en.json (카드 6)
- opus/render/c03_r16.py (proof 레이아웃 추가)
- opus/pkg/alt-ko.json · alt-ja.json · alt-en.json (P1 alt 06)
- 백업: opus/render/copy/archive/p1-<lang>-before-r7fix2-20261021.json, opus/pkg/alt-<lang>-before-r7fix2.json

## 추가 (10-21 01:23, Grok 교차 비평 review-studio/grok-on-opus-r7-fix1.md)

- P3 KO·JA 카드 06 진단서 칸: ‘법원이 본 것 / 4주 쉬어야 했다는 점’, ‘4週間休む必要があったこと’가 법원이 휴식을 명한 것처럼 읽힌다는 지적 반영 → ‘진단서에 적힌 휴양 기간’, ‘診断書にある / 休養期間’. 같은 칸 위에 ‘수술 뒤 4주 휴양 / 手術後4週間の休養’이 있어 4주는 되풀이하지 않음. EN 칸(‘The court used it for / The 4 weeks of rest’)은 그대로.
- 바뀐 파일: opus/P3/r7/images/ko/card-06.png · opus/P3/ja/r7/images/ja/card-06.png, 두 폴더의 overview·_review 점검 파일, opus/render/copy/p3-ko.json · p3-ja.json, opus/pkg/alt-ko.json · alt-ja.json(P3 alt 06), opus/P3/r7/threads-ready-ko.md · opus/P3/ja/r7/threads-ready-ja.md(alt 표), opus/P3/r7/cards.md · opus/P3/ja/r7/cards.md, opus/P3/ja/r7/ko-meaning.md. 백업: opus/render/copy/archive/p3-<ko|ja>-before-r7fix2b-20261021.json.
- 카드 01~05 픽셀 동일, 06 두 장 직접 확인(JA는 ‘書か/れた’ 줄 갈림을 피해 줄을 직접 나눔), 점검 문제 0·최소 32px. 게시 구성 코드 블록·alt 표 일치.
