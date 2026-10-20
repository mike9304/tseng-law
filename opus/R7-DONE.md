# R7 완료 — 사용자 결정 10/21 반영 (Studio Opus)

2026-10-21 00:48 KST. 근거: shared/USER-DECISIONS-1021.md. 게시·전송·소리 재생 없음.

## 결정 반영

1. 서명 줄 없음, 2. 사무장 반응·감정 줄 없음: 현행판(KO r6·JA·EN 최신판)에 원래 없었다. 아홉 판의 본문·첫 댓글·첨부·alt·카드 원본에서 서명·변호사 이름·사무장·AI 표기가 0건인지 다시 검사했다.
3. P3 가족관계 표기 금지: 부모/親/parent 계열을 모두 사실 표현으로 바꿨다. KO ‘오토바이 운전자·운전자·뒤에 탄 아이’, JA ‘バイクの運転者·運転者·後ろに乗っていた子ども’(버스 쪽 ‘運転手’와 한 문장에 나오면 ‘バイクの運転者’), EN ‘scooter rider·rider’(버스는 그대로 the driver). 첨부의 간병인 표현 ‘가족·지인 / 家族・知人 / family and friends’도 ‘가까운 사람들 / 身近な人 / people close to the rider’로 바꿨다(판결 원문 표현은 親友). 아이를 가리키는 ‘아이·子ども·kid’는 결정문 예시대로 유지.
P1·P2는 r6(JA r2·EN r4)를 그대로 복사했다. 게시 구성 파일(threads-ready-*.md)만 경로·머리말이 바뀌었고, 본문·댓글·첨부·카드 PNG는 원본과 바이트 동일.

## 확인한 것

- 글자 수(유니코드 코드포인트): 본문 모두 500 이하, 첫 댓글 500 이하. 아래 표.
- P3 본문·첨부의 숫자와 링크 목록이 이전 판과 같다(Counter 대조).
- P3 카드: 세 언어 모두 1·2·3·5번만 다시 렌더, 4·6번은 이전 판과 픽셀 동일. 렌더 점검 문제 0, 최소 글자 32px. 바뀐 12장을 직접 열어 겹침·잘림 없음 확인. PNG 청크는 IHDR·bKGD·IDAT·IEND뿐(텍스트·EXIF 없음).
- 게시 구성 9개의 코드 블록(본문·첫 댓글·첨부)이 원본 파일과 바이트 일치, alt 표가 opus/pkg/alt-<lang>.json과 일치.
- KO P3 카드 6번은 정본 r6 문구(‘…버스 쪽도 인정한 금액으로 정했어요.’)로 렌더해 r6 PNG와 픽셀 동일. 예전 선택안 r7(카드 6에 ‘이만큼은’)은 opus/P3/r7-option-card6/으로 옮겨 보존.

## 참고: 판결 원문 표현

판결 이유 4의 사고 경위에는 ‘原告甲○○騎乘…機車…，搭載未成年子女即原告林○瑄’(미성년 자녀를 태웠다)라는 표현이 있다(사법원 111年度士簡字第875號, 10/21 원문 재확인). 결정문의 ‘판결로 확인 안 됨’과는 다르지만, 가족관계 표기를 빼도 남은 문장이 사실과 어긋나지 않으므로 결정대로 적용했다. 판단은 사용자 몫으로 남긴다.

## 게시 구성 9개

| 판 | 게시 구성 | 본문 | 첫 댓글 | 첨부 | 카드 | 이전 판 대비 |
|---|---|---:|---:|---:|---:|---|
| P1 KO | opus/P1/r7/threads-ready-ko.md | 488 | 166 | 2258 | 6 | P1/r6 대비 본문·댓글·첨부·카드 모두 동일 |
| P2 KO | opus/P2/r7/threads-ready-ko.md | 494 | 144 | 2816 | 5 | P2/r6 대비 본문·댓글·첨부·카드 모두 동일 |
| P3 KO | opus/P3/r7/threads-ready-ko.md | 464 | 161 | 3387 | 6 | P3/r6 대비 바뀐 파일: body.md, attachment-v2.md · 바뀐 카드: 01, 02, 03, 05 |
| P1 JA | opus/P1/ja/r7/threads-ready-ja.md | 481 | 173 | 2059 | 6 | P1/ja/r2 대비 본문·댓글·첨부·카드 모두 동일 |
| P1 EN | opus/P1/en/r7/threads-ready-en.md | 493 | 215 | 4379 | 6 | P1/en/r4 대비 본문·댓글·첨부·카드 모두 동일 |
| P2 JA | opus/P2/ja/r7/threads-ready-ja.md | 482 | 140 | 1995 | 5 | P2/ja/r2 대비 본문·댓글·첨부·카드 모두 동일 |
| P2 EN | opus/P2/en/r7/threads-ready-en.md | 498 | 213 | 4060 | 5 | P2/en/r4 대비 본문·댓글·첨부·카드 모두 동일 |
| P3 JA | opus/P3/ja/r7/threads-ready-ja.md | 413 | 159 | 2780 | 6 | P3/ja/r3 대비 바뀐 파일: body.md, attachment.md · 바뀐 카드: 01, 02, 03, 05 |
| P3 EN | opus/P3/en/r7/threads-ready-en.md | 500 | 229 | 6096 | 6 | P3/en/r4 대비 바뀐 파일: body.md, attachment.md · 바뀐 카드: 01, 02, 03, 05 |

## 파일 목록

- opus/P1/r7/attachment-v2.md
- opus/P1/r7/body.md
- opus/P1/r7/cards.md
- opus/P1/r7/first-comment.md
- opus/P1/r7/images/ko/card-01.png
- opus/P1/r7/images/ko/card-02.png
- opus/P1/r7/images/ko/card-03.png
- opus/P1/r7/images/ko/card-04.png
- opus/P1/r7/images/ko/card-05.png
- opus/P1/r7/images/ko/card-06.png
- opus/P1/r7/threads-ready-ko.md
- opus/P2/r7/attachment-v2.md
- opus/P2/r7/body.md
- opus/P2/r7/cards.md
- opus/P2/r7/first-comment.md
- opus/P2/r7/images/ko/card-01.png
- opus/P2/r7/images/ko/card-02.png
- opus/P2/r7/images/ko/card-03.png
- opus/P2/r7/images/ko/card-04.png
- opus/P2/r7/images/ko/card-05.png
- opus/P2/r7/threads-ready-ko.md
- opus/P3/r7/_review/render-audit-ko.json
- opus/P3/r7/attachment-v2.md
- opus/P3/r7/body.md
- opus/P3/r7/cards.md
- opus/P3/r7/first-comment.md
- opus/P3/r7/images/ko/card-01.png
- opus/P3/r7/images/ko/card-02.png
- opus/P3/r7/images/ko/card-03.png
- opus/P3/r7/images/ko/card-04.png
- opus/P3/r7/images/ko/card-05.png
- opus/P3/r7/images/ko/card-06.png
- opus/P3/r7/ko-overview.png
- opus/P3/r7/threads-ready-ko.md
- opus/P1/ja/r7/attachment.md
- opus/P1/ja/r7/body.md
- opus/P1/ja/r7/cards.md
- opus/P1/ja/r7/first-comment.md
- opus/P1/ja/r7/images/ja/card-01.png
- opus/P1/ja/r7/images/ja/card-02.png
- opus/P1/ja/r7/images/ja/card-03.png
- opus/P1/ja/r7/images/ja/card-04.png
- opus/P1/ja/r7/images/ja/card-05.png
- opus/P1/ja/r7/images/ja/card-06.png
- opus/P1/ja/r7/ja-overview.png
- opus/P1/ja/r7/ko-meaning.md
- opus/P1/ja/r7/threads-ready-ja.md
- opus/P1/en/r7/attachment.md
- opus/P1/en/r7/body.md
- opus/P1/en/r7/cards.md
- opus/P1/en/r7/en-overview.png
- opus/P1/en/r7/first-comment.md
- opus/P1/en/r7/images/en/card-01.png
- opus/P1/en/r7/images/en/card-02.png
- opus/P1/en/r7/images/en/card-03.png
- opus/P1/en/r7/images/en/card-04.png
- opus/P1/en/r7/images/en/card-05.png
- opus/P1/en/r7/images/en/card-06.png
- opus/P1/en/r7/ko-meaning.md
- opus/P1/en/r7/threads-ready-en.md
- opus/P2/ja/r7/attachment.md
- opus/P2/ja/r7/body.md
- opus/P2/ja/r7/cards.md
- opus/P2/ja/r7/first-comment.md
- opus/P2/ja/r7/images/ja/card-01.png
- opus/P2/ja/r7/images/ja/card-02.png
- opus/P2/ja/r7/images/ja/card-03.png
- opus/P2/ja/r7/images/ja/card-04.png
- opus/P2/ja/r7/images/ja/card-05.png
- opus/P2/ja/r7/ja-overview.png
- opus/P2/ja/r7/ko-meaning.md
- opus/P2/ja/r7/threads-ready-ja.md
- opus/P2/en/r7/_review/render-audit-en.json
- opus/P2/en/r7/attachment.md
- opus/P2/en/r7/body.md
- opus/P2/en/r7/cards.md
- opus/P2/en/r7/en-overview.png
- opus/P2/en/r7/first-comment.md
- opus/P2/en/r7/images/en/card-01.png
- opus/P2/en/r7/images/en/card-02.png
- opus/P2/en/r7/images/en/card-03.png
- opus/P2/en/r7/images/en/card-04.png
- opus/P2/en/r7/images/en/card-05.png
- opus/P2/en/r7/ko-meaning.md
- opus/P2/en/r7/threads-ready-en.md
- opus/P3/ja/r7/_review/render-audit-ja.json
- opus/P3/ja/r7/attachment.md
- opus/P3/ja/r7/body.md
- opus/P3/ja/r7/cards.md
- opus/P3/ja/r7/first-comment.md
- opus/P3/ja/r7/images/ja/card-01.png
- opus/P3/ja/r7/images/ja/card-02.png
- opus/P3/ja/r7/images/ja/card-03.png
- opus/P3/ja/r7/images/ja/card-04.png
- opus/P3/ja/r7/images/ja/card-05.png
- opus/P3/ja/r7/images/ja/card-06.png
- opus/P3/ja/r7/ja-overview.png
- opus/P3/ja/r7/ko-meaning.md
- opus/P3/ja/r7/threads-ready-ja.md
- opus/P3/en/r7/_review/render-audit-en.json
- opus/P3/en/r7/attachment.md
- opus/P3/en/r7/body.md
- opus/P3/en/r7/cards.md
- opus/P3/en/r7/en-overview.png
- opus/P3/en/r7/first-comment.md
- opus/P3/en/r7/images/en/card-01.png
- opus/P3/en/r7/images/en/card-02.png
- opus/P3/en/r7/images/en/card-03.png
- opus/P3/en/r7/images/en/card-04.png
- opus/P3/en/r7/images/en/card-05.png
- opus/P3/en/r7/images/en/card-06.png
- opus/P3/en/r7/ko-meaning.md
- opus/P3/en/r7/threads-ready-en.md

## 함께 바뀐 공용 파일

- opus/render/copy/p3-ko.json · p3-ja.json · p3-en.json (카드 1·2·3·5 문구, KO 카드 6은 r6 문구로 되돌림)
- opus/pkg/alt-ko.json · alt-ja.json · alt-en.json (P3 alt 01·02·03·05)
- 백업: opus/render/copy/archive/p3-<lang>-before-r7-20261021.json, opus/pkg/alt-<lang>-before-r7.json
- 이동: opus/P3/r7 (옛 선택안) → opus/P3/r7-option-card6/

## 후속 수정 (10-21 00:53, Grok 교차 비평 review-studio/grok-on-opus-P3-r7-1021.md)

- EN 본문 첫 줄: ‘a scooter with a rider and kid hit its side’ → ‘a scooter rider with a kid behind hit its side’(아이가 뒤에 탔다는 사실을 본문에도). 497 → 500자. 뜻풀이 본문 줄도 맞춤. 숫자·링크 그대로.
- KO alt 06: 카드 6 PNG(r6 문구, 픽셀 동일)와 맞게 ‘버스 쪽도 이만큼은 인정한 금액’ → ‘버스 쪽도 인정한 금액’. opus/pkg/alt-ko.json과 opus/P3/r7/threads-ready-ko.md 표를 함께 고침.
- 두 게시 구성 파일의 코드 블록=원본, alt 표=pkg JSON 일치 재확인. 카드 PNG는 바뀌지 않음.

## 수정1
Astra r7 검수 반영은 opus/R7-FIX1-DONE.md. 첨부 글자 수 변경: P1 KO 2,275 · P1 EN 4,407.

## 수정2
Astra 재검수 반영은 opus/R7-FIX2-DONE.md(P1 카드 06·alt만).

## 수정3
Astra 3차 MINOR 반영은 opus/R7-FIX3-DONE.md(P1 첨부 세 언어, JA·EN 카드 06·alt).
