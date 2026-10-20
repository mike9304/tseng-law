# R8 수정1 완료 — Astra r8 최종 검수(review-studio/ASTRA-R8-FINAL-20261021.md) 반영 (Studio Opus)

2026-10-21 06:58 KST. r8 안에서 고쳤다. 게시·전송·소리 재생 없음.

참고: Astra 검수 표의 글자 수(P1 EN 492, P3 EN 499)는 Grok 지적을 반영하기 전 판 기준이다. 그 사이 r8 본문은 Grok 교차 비평 반영으로 한 번 바뀌었고(opus/R8-DONE.md 후속 절), 아래 수정은 지금 r8 문장에 넣었다.

## 반영 내용

1. MAJOR · P3 EN 본문: 법원 판단 문장을 Astra 수정안 그대로 — ‘The trial court allowed the kid's full sum, citing age at the crash and teeth's role in chewing and looks.’ (직전 판은 ‘as the kid was a minor when hurt …’였다.) 본문 492자.
2. MINOR 1 · P1 EN 본문: ‘The company said no.’ → ‘The firm refused a refund.’(거절 대상이 반환 요구임을 명시). Grok 지적으로 되살린 ‘with no company fault shown’ 때문에 Astra 계산(498자)보다 길어져, ‘one-year’→‘1-year’, ‘found the terms’→‘found terms’로 6자를 덜어 499자.
3. MINOR 2 · P2 첫 댓글 질문(출처 문구·링크 유지):
   - KO ‘대만에서 이혼 합의서에 증인 서명해 본 분, 두 사람의 뜻은 어떻게 확인했어요?’ (150자)
   - JA ‘台湾で離婚協議書の証人としてサインした方、2人の意思はどう確かめましたか？’ (147자)
   - EN ‘Witnessed a divorce agreement in Taiwan? How did you confirm both spouses wanted to divorce?’ (215자)

## 확인

- 본문·첫 댓글 모두 500자 이하. P1 EN·P3 EN 문장 다양성 도구 FAIL 0.
- 게시 구성 9개: 코드 블록(본문·첫 댓글·첨부)=원본 바이트 일치, alt 표=opus/pkg/r8/alt-<lang>.json 일치. 공개 문안 금지 표기 0. ‘minor then’ 문구 없음.
- 카드·alt·첨부 변화 없음.

## 바뀐 파일

- opus/P3/en/r8/body.md · threads-ready-en.md · ko-meaning.md(본문 뜻풀이)
- opus/P1/en/r8/body.md · threads-ready-en.md · ko-meaning.md
- opus/P2/r8/first-comment.md · threads-ready-ko.md
- opus/P2/ja/r8/first-comment.md · threads-ready-ja.md · ko-meaning.md(첫 댓글 뜻풀이)
- opus/P2/en/r8/first-comment.md · threads-ready-en.md · ko-meaning.md
- 수정 전 사본: 세션 scratchpad(r8fix1/)
