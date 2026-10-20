# R8B 완료 — 카드 1 장면 훅 재설계 · P3 대비 결말 · P1 귀책 귀속 (Studio Opus)

2026-10-21 07:14 KST. 근거: shared/R8B-BRIEF.md(나머지 규칙은 R8-BRIEF 그대로). r8 파일은 건드리지 않았다(r8b 폴더 새로 만듦, alt는 opus/pkg/r8b/). 게시·전송·소리 재생 없음.

## 카드 1 문구 (결과·판결 없음, 9장 재렌더)

### P1 집 계약금
- KO · 머리표 ‘대만 법원 1심 · 집 계약금’ · 제목 ‘서명은 아직인데, / 계약금은 벌써 보냈어요.’ · 그림: 임대차 계약서(서명 전) + 쪽지 ‘집 보고 보낸 계약금 21,800元’ · 아래 ‘2025년 11월 28일, 타이베이에서 집을 보고 오후 2시 51분에 관리회사로 보낸 돈이에요. / 그리고 그날, 마음이 바뀌었대요.’
- JA · 머리표 ‘台湾の一審・部屋の手付金’ · 제목 ‘サインはまだなのに、 / 手付金はもう振り込んでいた。’ · 그림: 賃貸借契約書(署名前) + 쪽지 ‘振り込んだ手付金 21,800元’ · 아래 ‘2025年11月28日、台北で部屋を見て、 午後2時51分に管理会社へ振り込んだお金です。 / そしてその日、気が変わったそうです。’
- EN · 머리표 ‘Taiwan trial court · rental deposit’ · 제목 ‘Lease not signed yet. / Deposit already wired.’ · 그림: Lease(Not signed) + 쪽지 ‘Deposit wired NT$21,800’ · 아래 ‘Nov 28, 2025, Taipei: wired at 2:51 p.m. after viewing the unit. / Then, that same day, the renter backed out.’

### P2 협의이혼 증인
- KO · 머리표 ‘대만 법원 1심 · 협의이혼’ · 제목 ‘증인 두 명의 서명을 받아 / 이혼 등록까지 마쳤어요.’ · 그림: 이혼 합의서(도장 ‘이혼 등록 완료’) + 큰 숫자 2(증인 서명) · 아래 ‘그런데 남편은 증인이 누군지도 몰랐대요.’
- JA · 머리표 ‘台湾の一審・協議離婚’ · 제목 ‘証人2人のサインをそろえ、 / 離婚届も出した。’ · 그림: 離婚協議書(도장 ‘離婚登記済み’) + 큰 숫자 2(証人のサイン) · 아래 ‘ところが夫は、証人が誰かも知らなかったそうです。’
- EN · 머리표 ‘Taiwan trial court · divorce by agreement’ · 제목 ‘Two witnesses signed. / The divorce was registered.’ · 그림: Divorce agreement(도장 ‘Registered’) + 큰 숫자 2(Witness signatures) · 아래 ‘But the husband said he didn't even know who they were.’

### P3 버스 사고 배상
- KO · 머리표 ‘대만 법원 1심 · 버스 신호위반 사고’ · 제목 ‘한 사고로 두 사람이 / 각각 배상을 청구했어요.’ · 그림: 청구서 두 장 — 뒤에 탄 아이: 앞으로 들 앞니 치료비 343,000元 / 오토바이 운전자: 다쳐서 일 못 한 손해 385,022元 · 아래 ‘2020년 10월 26일 타이베이, 빨간불에 들어온 버스에 오토바이가 부딪혔어요. / 두 청구에 붙은 서류는 달랐어요.’
- JA · 머리표 ‘台湾の一審・バスの信号無視事故’ · 제목 ‘1つの事故で、 / 2人がそれぞれ賠償を求めました。’ · 그림: 청구서 두 장 — 後ろに乗っていた子ども: これからの 前歯の治療費 343,000元 / バイクの運転者: けがで 働けなかった損害 385,022元 · 아래 ‘2020年10月26日の台北、赤信号で入ってきた バスにバイクがぶつかりました。 / 2つの請求に添えた資料は違いました。’
- EN · 머리표 ‘Taiwan trial court · bus ran a red light’ · 제목 ‘Two people sued / over one crash.’ · 그림: 청구서 두 장 — The kid behind: Future dental work NT$343,000 / The scooter rider: Income lost while hurt NT$385,022 · 아래 ‘Oct 26, 2020, Taipei: a bus ran a red light and a scooter hit its side. / The papers behind each claim differed.’

설계: P1은 기존 그림(서명 전 계약서 + 송금 쪽지)을 살리고 제목·아래 문장만 장면으로. P2는 ‘무효’ 도장이 결과를 드러내서 새 레이아웃 core_hook(opus/render/c13_r3.py — 등록 도장 찍힌 합의서 + 증인 서명 2)으로 교체. P3는 인정 비율 막대가 결과 자체라 새 레이아웃 core_claims(opus/render/c09_r2.py — 두 사람의 청구서 두 장, 청구액만)로 교체. 아래 마지막 줄은 다음 카드로 넘기는 열린 문장(P1 그날 마음이 바뀜, P2 남편은 증인을 몰랐다는 주장 ‘~대요’, P3 두 청구에 붙은 서류가 달랐음).
P2 제목은 처음에 ‘증인 두 명이 서명했고, 같은 날 이혼 등록까지’로 썼다가, 지인은 등록일 전에 식당에서 서명했으므로 ‘같은 날’이 증인 서명에도 걸려 읽혀 ‘증인 두 명의 서명을 받아 이혼 등록까지 마쳤어요’(JA·EN도 같은 취지)로 고쳤다.

## 본문

- P1 (KO 436 · JA 395 · EN 498자): ‘좁아서 그만둔 건 세입자 책임이에요’ → ‘좁아서 그만둔 것도 판사는 세입자 책임으로 봤어요’. JA ‘狭いからやめたのも、裁判官は借り手側の責任と見ました。’ EN ‘It put backing out over space on the renter, with no company fault shown.’(It = 앞 문장의 the trial court).
- P3 (KO 499 · JA 462 · EN 497자): 버스 쪽 주장(치과 12만~15만 방안, 아침밥 가게 일은 아르바이트생이 대신했으니 시급으로 27,808)을 청구 문단으로 옮겨 ‘맞섰어요/主張しました/the defense said’로 귀속. 마지막 문단은 대비로 끝냄 — KO ‘아이는 청구한 343,000대만달러를 다 인정받았어요. 운전자가 인정받은 건 385,022대만달러 중 27,808대만달러였어요. 소득 자료를 안 냈거든요.’ JA ‘結果は分かれました。子どもは請求した343,000元が全額認められました。運転者は385,022元のうち、27,808元だけでした。収入の資料を出していなかったからです。’ EN ‘The kid won all NT$343,000. The rider, lacking income records, was awarded NT$27,808.’(EN은 500자 안에 맞추느라 385,022는 앞 청구 문단에만 있다.) 사고 당시 미성년·씹는 기능·외관·성년 뒤 계획(KO·JA)은 유지.
- P2: 본문·첫 댓글 모두 r8과 같음(카드 1과 충돌 없음).

## 확인

- 카드: 세 사건×세 언어 모두 카드 01만 r8과 다르고 02~06은 바이트 동일. 새 카드 1 아홉 장 직접 열어 겹침·잘림 없음, 점검 문제 0·최소 32px. 카드 1 문구와 alt 01에 결과 표현(졌/무효/인정/lost the case/void/awarded 등) 0. PNG 텍스트·EXIF 청크 없음.
- 본문·첫 댓글 모두 500자 이하, 문장 다양성 도구 FAIL 0(JA는 です・ます 어미 비율 경고만). 서술어 없는 문장은 첫 장면 줄 하나.
- 게시 구성 9개: 코드 블록(본문·첫 댓글·첨부)=원본 바이트 일치, alt 표=opus/pkg/r8b/alt-<lang>.json 일치. 서명·사무장·변호사·AI 표기·굵은 강조 0, P3 가족 호칭 0. 첫 댓글·첨부는 r8과 같음.

## 바뀐 파일

- 새 폴더: opus/P1/r8b, opus/P2/r8b, opus/P3/r8b, opus/P{1,2,3}/ja/r8b, opus/P{1,2,3}/en/r8b (각 body.md · first-comment.md · attachment(-v2).md · cards.md · images/<lang>/card-01~ · <lang>-overview.png · _review/ · threads-ready-<lang>.md, JA·EN은 ko-meaning.md)
- r8 대비 내용이 바뀐 것: 아홉 폴더의 images/<lang>/card-01.png·overview·cards.md·threads-ready, P1·P3 세 언어 body.md, JA·EN ko-meaning.md(카드 1 줄, P1·P3 본문 뜻풀이)
- 공용: opus/render/copy/p1|p2|p3-<ko|ja|en>.json(카드 1), opus/render/c13_r3.py(core_hook 추가), opus/render/c09_r2.py(core_claims 추가), opus/pkg/r8b/alt-<ko|ja|en>.json(alt 01)
- 백업: opus/render/copy/archive/<case>-<lang>-before-r8b-20261021.json, 렌더러 수정 전 사본은 세션 scratchpad
