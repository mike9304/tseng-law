# 980 Opus r1 FIX 반영 (cols-c, 06:3x)
| # | 지적 | 조치 |
|---|---|---|
| MINOR1 | KO short_share 0.075 FAIL | 짧은 문장 추가("나머지 세 항목은 크게 깎였습니다." "문구가 갈랐습니다.") → FAIL 0 |
| NIT2 | 가해자가 '진단서 날짜'를 들었다는 추론 | 3언어 "퇴원 반년 뒤에야 치매 진단을 받았다고 주장" |
| NIT3 | 조정 성립·지급은 법원 인정, 항변은 '더 낼 필요 없음' | 3언어에서 인정 사실과 항변을 분리 |
| NIT4 | alt '진료 서류' vs 빈 폴더 | KO 빈 서류 폴더 / ZH 空白文件夾 / EN blank file folders |
| NIT5 | 병원명 | 3언어에서 奇美 표기 삭제("10월 13일에 진단") |
| NIT6 | 번호 980 충돌 가능성 | ASSIGN 70행 'ZH는 Kimi(980)' 메모 확인 필요 — cols-c 980 사용 중임을 ASSIGN에 재기재 |
variety: ko FAIL 0(WARN), zh OK, en OK.
