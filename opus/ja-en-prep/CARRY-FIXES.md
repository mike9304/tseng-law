# JA·EN 단계 준비 — 이전 PASS판(10/19)에서 고쳐야 할 곳

2026-10-20 20:04 KST · Studio Opus · KO 승자 확정 뒤 JA·EN을 쓸 때 쓰는 메모. 아직 JA·EN 원고를 새로 쓰지 않았다.

## 이전 JA·EN에 남아 있는 문제 (prior-opus-1019/out 기준, grep으로 찾음)

| 건 | 위치 | 지금 문장 | 문제 | 고칠 방향 |
|---|---|---|---|---|
| P1 C03 | EN 본문 1줄 | then wanted out hours later | ‘몇 시간 뒤(오후 5시쯤·3시간 안)’는 세입자 주장(FACTS P1 취소 이유). KO r1은 ‘같은 날’로 고침 | the same day / that same afternoon, by their account |
| P1 C03 | JA 본문 4줄 | 数時間後にはLINEで… | 위와 같음 | その日のうちにLINEで…(借り手の話では) |
| P1 C03 | EN 카드1 제목·아래 | still lost the deposit / Hours after paying, the renter backed out. | 실제 환불로 읽힘(미확인) + 세입자 주장 단정. KO r2에서 같은 이유로 고침 | lost the suit to get the deposit back / Same day, the renter backed out. |
| P1 C03 | JA 카드1 제목·아래 | 手付金は戻らなかった / 借り手は振り込んだ数時間後に… | 위와 같음 | 手付金の返還を求めた裁判で負けた / その日のうちに… |
| P2 C13 | EN 본문 4줄 | never met the husband before or after | ‘서명 전후’ 기준 빠짐. 5년 전 모임에서 부부를 본 증언과 충돌하게 읽힘(Astra BASELINE) | never met the husband before or after signing / never checked with the husband |
| P3 C09 | EN 본문 1줄 | A district court gave the kid… The parent got under a tenth… | 판결상 인정액을 실제 수령으로 읽힘(Astra BASELINE, FACTS P3) | The court awarded / allowed |
| P3 C09 | JA·EN 카드6 | 최종 금액 계산 카드 | KO r1에서 정보 카드(진단서 ↔ 소득 자료)로 바꿈. JA·EN도 같은 구성으로 | docs 레이아웃 재사용 |

첨부(EN·JA text-attachment)의 ‘By their account … around 5 p.m.’, ‘借り手の話では … 夕方5時ごろ’는 주장으로 귀속돼 있어 그대로 둬도 된다.

## C13 JA 첨부의 일본 민법 비교 — e-Gov 원문 다시 확보 (Astra BASELINE 보류 항목)

- 10/20 20:03 KST e-Gov 법령 API로 민법(明治二十九年法律第八十九号) 739조·764조 원문을 받았다. v1 `https://laws.e-gov.go.jp/api/1/articles;lawId=129AC0000000089;article=739`(764도 같은 방식), v2 `https://laws.e-gov.go.jp/api/2/law_data/129AC0000000089?elm=…Article_739`. 두 응답의 739조 문언이 같고, v2 개정 정보는 `129AC0000000089_20260624_508AC0000000045`(2026-06-24 시행판). 받은 원본: sources/egov-minpo-739-20261020.xml, sources/egov-minpo-764-20261020.xml.
- 739조: 「婚姻は、戸籍法（昭和二十二年法律第二百二十四号）の定めるところにより届け出ることによって、その効力を生ずる。２　前項の届出は、当事者双方及び成年の証人二人以上が署名した書面で、又はこれらの者から口頭で、しなければならない。」
- 764조: 「第七百三十八条、第七百三十九条及び第七百四十七条の規定は、協議上の離婚について準用する。」
- 이전 JA 첨부가 ‘서면으로 낼 때’로 한정한 처리(구두 신고도 허용)는 이 원문과 맞는다. JA 재제작 때 이 원문 기준으로 다시 대조한다. 일본법 쪽 증인의 ‘직접 확인’ 요건 같은 해석은 이번에 확인하지 않았으니 쓰지 않는다.

## 그대로 이어 쓸 것
- JA·EN 화자·서명: 사용자 결정 대기(JA·EN은 첨부 끝 한 줄 서명이 이전 방식). 새로 정하지 않는다.
- 렌더: opus/render/copy/c03·c13·c09-ja/en.json이 이전 카드 문구. 승자 KO 구성에 맞춰 p1·p2·p3-ja/en.json으로 만든다.
