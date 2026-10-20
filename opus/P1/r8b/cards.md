# P1 KO 카드 문구 · r8b (6장, 렌더: opus/P1/r8b/images/ko/)

r8b(shared/R8B-BRIEF.md): 카드 1을 결과·판결 없는 장면 훅으로 다시 설계해 재렌더. 나머지 카드는 r8과 같은 파일. 렌더 원본: opus/render/copy/p1-ko.json

## 1 · core
- headline: 서명은 아직인데, / 계약금은 벌써 보냈어요.
- kicker: 대만 법원 1심 · 집 계약금
- paper_title: 임대차 계약서
- unsigned: 서명 전
- amount_label: 집 보고 보낸 계약금
- amount: 21,800元
- foot 1: 2025년 11월 28일, 타이베이에서 집을 보고 / 오후 2시 51분에 관리회사로 보낸 돈이에요.
- foot 2: 그리고 그날, 마음이 바뀌었대요.

## 2 · space (세입자 주장 · 가상의 장면)
- speaker: 집 보러 간 세입자 · 익명
- headline: 짐 다 넣기엔 좁겠어요. 안 할게요.
- foot 1: 세입자는 LINE으로 취소하고 돈을 돌려 달라고 했어요.
- foot 2: 관리회사는 거절했어요.

## 3 · agreement (관리회사 주장 · 가상의 장면)
- speaker: 관리회사
- headline: 조건 다 보고 보낸 돈이잖아요.
- terms: 집 · 월세 · 최소 기간
- rent: 월세
- unit: 元
- min: 최소
- year: 년
- memo_note: 뒤에 볼 세 팀도 취소했어요.
- foot 2: 세입자가 직접 보낸 LINE도 남아 있었어요.

## 4 · message (판결 속 메시지 · 뜻풀이)
- headline: ‘임차 계약금’으로 / 송금했습니다.
- context: 세입자가 송금하고 회사에 남긴 LINE
- amount: 21,800元
- mark: 0
- note: 원문은 중국어 · 뜻풀이
- foot 1: 이 LINE, 세입자가 재판에 직접 낸 증거예요.

## 5 · judgment (이 사건 1심 판단)
- headline: 회사는 안 돌려줘도 된대요.
- contract: 계약서 (서명 전)
- agreed: 집 볼 때 말로 맞춘 조건
- rent: 월 21,800元
- period: 최소 1년
- message: LINE: ‘임차 계약금’
- foot 1: 집 보던 날 이미 계약이 됐고,
- foot 2: 좁아서 취소한 건 세입자 책임이라고 봤어요.

## 6 · proof (이 사건 1심 판단)
- headline: 회사 탓이라는 건 / 세입자가 증명해야 했어요.
- docs: [{"title": "세입자가 댄 이유", "body": "돈 보낸 뒤 보니 짐이 다 안 들어감", "proves_label": "판사 판단", "proves": "세입자 책임", "status": "기록에 있음", "kind": "ok"}, {"title": "회사 탓이라는 증거", "body": "회사 때문에 계약을 못 지키게 됐다는 자료", "proves_label": "증명할 사람", "proves": "세입자", "status": "안 냄", "kind": "x"}]
- foot 1: 그래서 21,800元과 이자 청구는 / 모두 받아들여지지 않았어요.
