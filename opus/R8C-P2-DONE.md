# R8C-P2 완료 — P2 증인 진술 정밀화 (Studio Opus)

2026-10-21 08:07 KST. 근거: shared/R8C-P2.md(판결 이유 三(三) 증인 진술 「約於5年前曾在朋友聚會上看被告夫妻一起出現過」「於簽署系爭離婚協議書之前後均不曾遇到原告…沒有原告的電話…也不曾與原告確認過離婚之事實」「兩造就證人甲○○前開所證內容均無意見」). r8b 폴더 안에서 고쳤다. P1·P3, 첫 댓글은 건드리지 않았다. 게시·전송·소리 재생 없음.

## 본문 (KO 488 · JA 454 · EN 499자)

- KO: ‘지인의 법정 증언도 같았어요. 서명 전에도 후에도 남편은 만난 적이 없고 연락처도 몰랐다는 이 증언을, 부부 둘 다 다투지 않았어요.’ → ‘지인은 법정에서 5년쯤 전 친구 모임에서 부부를 본 적은 있대요. 하지만 서명 무렵엔 남편을 만난 적도 연락한 적도 없고, 이혼할 건지 확인한 적도 없다고 했어요. 이 증언엔 남편도 아내도 이의를 달지 않았어요.’ 판사 문장은 ‘그래서 1심 판사는 이 지인을 증인으로 인정하지 않았어요.’(이유가 바로 앞 증언에 있어 반복 삭제), 문장 길이 조정으로 ‘다른 한 명을 인정해도 둘이 안 돼요.’
- JA: ‘知人は法廷で、5年ほど前に友人の集まりで夫婦を見たことはあると話しました。ただ、サインの前後には夫に会ったことも連絡したこともなく、離婚するのか確かめたこともないそうです。この証言には、夫も妻も異議を唱えませんでした。’ 판사 문장 ‘そのため一審の裁判官は、この知人を証人と認めませんでした。’
- EN: ‘The friend saw the couple at a gathering five years before but testified to never meeting, contacting or asking him then. Neither spouse objected.’ 500자에 맞추느라 판사 문장의 ‘who never confirmed his wish firsthand’(바로 앞 증언과 중복)와 ‘just the two of them’을 덜었고, 첫 줄은 증언의 ‘12월쯤’에 맞춰 ‘About Dec 2023’.

## 카드 03 (세 언어 재렌더)

- KO 항목: ‘5년쯤 전 모임에서 부부를 본 적은 있음 / 서명 무렵 전후로는 남편을 못 만남 / 남편한테 이혼할 건지 확인한 적 없음’, 아래 ‘이 증언엔 남편도 아내도 이의를 달지 않았어요.’
- JA 항목: ‘5年ほど前の集まりで夫婦を見たことはある / サインの前後には夫に会っていない / 夫に離婚するのか確かめたことはない’, 아래 ‘この証言に、夫も妻も異議を唱えませんでした。’
- EN 항목: ‘Saw the couple at a gathering five years before / Didn't meet the husband around the signing / Never asked him if he wanted a divorce’, 아래 ‘Neither spouse objected to this testimony.’
- 세 칸이라 ‘이혼 등록하는 날도 안 감’ 항목은 카드에서 빠지고 첨부에 그대로 있다. 말풍선 ‘남편분 연락처는 없어요’는 유지.
- 카드 03만 다시 렌더(01은 r8b 장면 훅, 02·04·05는 r8과 바이트 동일), 세 장 직접 열어 겹침·잘림 없음, 점검 문제 0·최소 32px.

## alt 03 · 첨부

- alt 03 세 언어를 카드 03과 같은 내용으로(opus/pkg/r8b/alt-<lang>.json).
- 첨부(이미 5년 전 모임을 적고 있어 시점 한정만 맞춤): KO ‘서명 전에도 후에도’→‘서명 무렵 전후로는’, ‘부부 둘 다 이 증언엔 이의가 없었어요’→‘이 증언엔 남편도 아내도 이의를 달지 않았어요’, ‘양쪽 다 다투지 않았고’→‘양쪽 다 이의가 없었고’(2,820자). JA ‘サインの前にも後にも夫には会っていない’→‘サインの前後には夫に会っていない’(1,992자). EN ‘The friend never ran into the husband before or after signing.’→‘Around the signing, the friend never ran into the husband.’(4,056자). 숫자·링크 동일.

## 확인

- 본문 500자 이하, 문장 다양성 도구 FAIL 0. 게시 구성 3개 코드 블록(본문·첫 댓글·첨부)=원본, alt 표=pkg JSON 일치. 옛 표현(‘다투지 않았’, ‘서명 전에도 후에도’, ‘before or after signing’ 등) 공개 문안에 0. 서명·사무장·AI 표기 0.

## 바뀐 파일

- opus/P2/r8b/body.md · attachment-v2.md · cards.md · images/ko/card-03.png · ko-overview.png · _review/ · threads-ready-ko.md
- opus/P2/ja/r8b/body.md · attachment.md · cards.md · images/ja/card-03.png · ja-overview.png · _review/ · ko-meaning.md · threads-ready-ja.md
- opus/P2/en/r8b/body.md · attachment.md · cards.md · images/en/card-03.png · en-overview.png · _review/ · ko-meaning.md · threads-ready-en.md
- 공용: opus/render/copy/p2-<ko|ja|en>.json(카드 3), opus/pkg/r8b/alt-<ko|ja|en>.json(P2 alt 03)
- 백업: opus/render/copy/archive/p2-<lang>-before-r8c-20261021.json, 수정 전 본문·첨부·alt 사본은 세션 scratchpad(r8c/)
