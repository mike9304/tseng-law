# CROSS-opusB — G3 (노동: 외국인 근로자의 고용주 변경·이직 증명·공백 기간) 교차 검수

- 검수자: opusB (Claude Opus 5.5, 작성자 opusA와 별개 세션) · 2026-10-22 10:03 KST
- 대상: drafts/gap/G3/{ko,zh,ja,en,es}.md — WROTE-opusA의 sha256과 검수 시점 해시 일치(5개 모두).
- 판정: MAJOR 1 · MINOR 5. 모두 반영한 뒤 READY.

## 검수자가 직접 확인한 것

- 조문(law.moj.gov.tw LawSingle, opusB가 2026-10-22 다시 조회): 就業服務法 43·46·53·56·57·59·63·68·73·74, 勞動基準法 14·19·79, 轉換雇主或工作程序準則 2·11, 外國專業人才延攬及僱用法 9, 入出國及移民法 31. 본문의 조·항·호와 금액은 원문과 맞음(2만~30만 = 勞基法 79조 3항에 19조 포함, 3만~15만 = 就服法 68조 1항, 15만~75만 = 63조, 60일+1회 60일 = 準則 11조 1항, 30일 = 移民法 31조 6항). 아래 지적 2만 예외.
- 개정일: LawAll 헤더 N0090001 修正 114-01-20, N0090023 修正 115-04-11 — 출처 목록 표기와 같음.
- 공식 영문(law.moj.gov.tw/ENG): 勞基法 제19조 영문 "Upon termination of a labor contract, neither an employer nor the employer's agent shall reject a request from the worker for proof of service record." — en 34 인용과 같음. 準則 영문명("Regulations Governing Employment Transfer Procedures and Employment Qualifications for Foreigners Engaging in the Jobs Specified in Subparagraph 8 to 11 …"), "Act for the Recruitment and Employment of Foreign Professionals", "Employment Service Act"도 en 표기와 같음.
- 이민서 FAQ(news.immigration.gov.tw, Employment Gold Card: Work-Related FAQs): "If you hold an Employment Gold Card, it acts as an individual work permit, and you do not need a new employer to apply for a hiring permit. If the hiring permit was applied for by an employer, any new employer must apply…" — 다섯 판의 골드카드 서술과 같음.
- 자동 검사(opusB 실행): variety_metrics FAIL 0 ×5, 길이 OK, hygiene OK. 내부 링크(ko·ja·en 예고 기간 칼럼, ja·en 골드카드 칼럼) 라이브 200이고 링크 문구가 라이브 h1과 맞음. 굵은 글씨·저자줄·AI 표기·전화번호 없음.
- 중복: selfcheck의 점검(228·027/168·202·634, 1021 이슈 vi04)과 같은 결론. 53조 1항 새 고용주 신청·勞基法 19조·공백 위험을 중심으로 한 글은 없음.

## 지적

1. MAJOR — ja.md·en.md ↔ ko.md, es.md ↔ en.md — 다섯 판 가운데 네 판이 같은 문단 묶음을 오프닝만 바꿔 옮긴 형태임(zh만 독자적)
   - 근거(문장 단위 대응):
     - 서면 요청 문장: ko 36 "요청은 날짜가 남는 이메일이나 서면으로 하는 편이 낫습니다. 새 고용주의 신청에 어떤 문서를 낼지는 그 회사 인사 담당과 함께 노동부 신청 요건에 맞춰 준비합니다." = ja 42 "請求は日付の残るメールか書面で。新しい雇用主の申請にどの書類を添えるかは、その会社の人事担当と労働部の申請要件に沿って詰めることになります。" = en 34 "Ask in writing, by email or letter, so the date is on record. Which document goes into the new application is something to settle with the new employer's HR team against the ministry's filing requirements." = es 38 "Pídalo por escrito. Un correo electrónico basta para dejar constancia de la fecha. Qué documento se adjunta … conviene cerrar con el departamento de personal de la nueva empresa, según los requisitos del Ministerio."
     - 공백 문단: ko 42 = ja 34 = en 44 = es 42(56조 3일 통보 → 73조 3호 → 74조 1항, 세 문장 같은 순서). 거류 문단: ko 44 "거류도 흔들립니다." = ja 36 "居留も同じ方向に動きます。" = en 46 "Residence follows the same path." = es 44 "La residencia sigue el mismo camino." 뒤에 31조 4항 → 5·6호 예외 → 6항 30일 순서까지 같음.
     - 세 날짜 문장: ko 46 "퇴사일, 새 회사의 신청일, 허가일. 세 날짜의 간격이 핵심입니다." = ja 38 "退職日と新しい許可の日付をどう近づけるか。" = en 48 "Three dates matter most…" = es 48 "Último día, solicitud, permiso: cuanto más cerca estén esas tres fechas, mejor."
     - 골드카드 문단: ko 50 = ja 48 = en 52 = es 32(9조 → 이민서 FAQ → "고용주가 신청해 받은 허가라면 새 고용주가 다시 신청" 마지막 문장까지 같음). 이주노동자 문단: ko 54 = ja 52–54 = en 56–58 = es 52(46조 8~11호 → 53조 4항 → 59조 네 사유 → 準則 2조 → 53조 3항).
     - 변호사 문단과 마지막 문장: ko 58 = ja 58 = en 62 = es 56(서면 요구 → 조정·소송 → 신청 일정·거류 등록, 마무리는 '서비스 증명서 요청 날짜가 첫 증거'). es 56 "Guarde el correo con el que pidió el certificado de servicios: es la primera prueba si la empresa anterior se demora." = en 62 "The date you asked for proof of service record is worth keeping; it is the first thing to show if the old employer stalls."
     - 요약·FAQ: es 4 = en 4(같은 문장 순서), es FAQ 1~3 = en FAQ 1~3(질문과 답 모두). ja FAQ 1~3도 ko FAQ 1~3과 같은 질문·같은 답 구조.
   - 판마다 독자적인 부분은 오프닝(ko 신주 엔지니어 장면, ja 53조 사실, en 오해 반박, es 조문 인용)과 일부 절 위치(es 골드카드 먼저, ja 勞基法 19조 뒤로)뿐임. 나머지는 같은 문장을 언어만 바꾼 것으로 읽힘. selfcheck 표의 '절 순서'도 절 이름만 다를 뿐 문단 내용은 위와 같이 짝이 맞음.
   - 이유: 2026-10-21 08:22 지시와 GATE-PROMPT는 번역처럼 읽히는 판(같은 예시·같은 문단 순서를 옮긴 것)을 FAIL로 정함. opusA가 G2 지적 12(es↔en)와 G4 지적 1(ja↔ko)에 적용한 기준과 같음.
   - 수정: zh는 고용주·인사 담당 관점이라 그대로 둠. ko·ja·en·es 가운데 하나만 지금 골격을 쓰고, 나머지 세 판은 그 독자가 실제로 마주치는 상황에서 출발하는 다른 구성으로 다시 씀. 예시:
     - ja: 일본 본사에서 대만 법인으로 와 대만 법인 명의 취업허가로 일하다 대만 안에서 다른 회사로 옮기는 경우나, 대만 현지 채용 일본인처럼 일본 독자가 실제로 겪는 경로에서 시작함. 퇴직 통보 → 마지막 출근일 → 새 회사 신청 → 허가라는 일정 순서로 조문을 배치함.
     - en: 미국식 'at-will' 감각이나 'two weeks' notice' 같은 독자의 기대에서 출발할 수 있음. 다만 미국 제도를 언급하려면 공식 출처(DOL 등)를 열어 확인한 뒤에만 쓰고, 확인하지 못하면 비교 없이 질문형으로 씀.
     - es: 스페인·중남미 출신 거주자(예: 학위 후 대만 취업, 영어 교사)의 상황을 질문 순서로 구성함. en의 요약·FAQ·문단 문장을 옮기지 말 것.
     - 같은 내용이라도 '서면 요청+인사 담당과 조율' 두 문장, '세 날짜' 문장, '서비스 증명서 요청 날짜가 첫 증거' 마무리는 판마다 하나만 남기거나 다른 사실로 바꿈.
   - 보존: 조문·금액·기간(53조 1항, 勞基法 19·79조 3항, 56·73·74·68·57·63조, 移民法 31조 4~6항, 59조, 準則 2·11조, 專才法 9조), 이민서 FAQ 서술, 1개 판 이상에 들어 있는 사실은 모든 판에서 같게.

2. MINOR — ko.md:19·46, zh.md:46, ja.md:19·38, en.md:19·40, es.md:19·48 — 68조 3항의 제재를 절반만 씀
   - 원문: ko "3만~15만 대만달러의 과태료와 출국 명령 대상", zh "並應即令出國", ja "出国を命じられます", en "ordered to leave Taiwan", es "orden de salida del país".
   - 이유: 就服法 68조 3항 원문은 "違反第四十三條規定之外國人，應即令其出國，不得再於中華民國境內工作。"임. '허가 전에 먼저 출근해도 되나'라는 독자의 판단에서 가장 무거운 결과인 '다시 대만에서 일할 수 없다'가 빠져 있음(조문 문구·법적 결과 보존, LESSONS 1·2).
   - 수정: 각 판에서 68조 3항을 인용하는 곳에 후단을 더함. 예: ko "…출국 명령을 받고, 조문상 다시 대만에서 일할 수 없게 됩니다(같은 조 제3항)" / zh "…應即令出國，且不得再於我國境內工作（第68條第3項）" / ja "…出国を命じられ、条文上、台湾で再び働くことはできません" / en "…ordered to leave, and the provision adds that the person may not work in Taiwan again" / es "…orden de salida y, según el mismo apartado, la prohibición de volver a trabajar en Taiwán". 74조 1항 인용도 원문은 "應即令其出國，不得再於中華民國境內工作"이므로 같은 방식으로 맞추거나, 74조 1항은 '법에 다른 규정이 없으면'이라는 단서가 핵심이므로 적어도 68조 3항은 고칠 것.
   - 보존: 3만~15만, 출국 명령, 43조 위반 요건.

3. MINOR — ko.md:4 — 요약의 '벌금'
   - 원문: "새 허가 전에 일을 시작하면 벌금과 출국 명령 대상입니다."
   - 이유: 68조 1항은 罰鍰(행정상 과태료)이고 형사 벌금이 아님. 본문(19·46행)은 '과태료'로 정확히 썼음.
   - 수정: "…과태료와 출국 명령 대상입니다"(지적 2를 반영하면 "…다시 대만에서 일할 수 없게 될 수 있습니다"까지).
   - 보존: 허가 전 근무 금지.

4. MINOR — en.md:38·40 — 명령형 소제목과 명령문
   - 원문: 소제목 "Do not start early", 본문 "Starting at the new company before the permit arrives is tempting. Resist it."
   - 이유: LESSONS 8과 EDITORIAL-VOICE는 AI식 명령형 소제목·훈계형 문장을 피하라고 함. 'tempting'도 독자 심리를 대신 말하는 문장임.
   - 수정: 소제목 "Starting before the permit issues" 같은 쟁점형으로 바꾸고, 두 문장은 지운 뒤 "Working without a permit breaches Article 43…"로 바로 시작함.
   - 보존: 43·68·57·63조 내용과 금액.

5. MINOR — zh.md:28 — 가상 장면 표시 없음과 출처 없는 일반화
   - 원문: "外籍工程師遞了辭呈，要去隔壁園區的競爭對手。主管第一個念頭往往是：離職證明先不要開，看他怎麼轉。"
   - 이유: 장면 오프닝은 가상이라고 표시해야 함(LESSONS 10, SENTENCE-VARIETY 2-4). ko 28은 "(가상의 사례입니다)"로 표시했음. '往往'은 관리자들의 반응을 일반화한 사실 주장인데 근거가 없음.
   - 수정: "外籍工程師遞了辭呈，要去隔壁園區的競爭對手。主管想到的第一招：離職證明先不要開，看他怎麼轉（虛構情境）。這一招擋得住嗎？"
   - 보존: 질문형 오프닝, '很難'이라는 답.

6. MINOR — 지적 1과 별개로, ko·ja·en·es 네 판의 마지막 문장이 같은 소재(서비스 증명서 요청 날짜, ja는 세 날짜)를 씀
   - 이유: G1 지적 6과 같은 유형임. 지적 1을 고치면 함께 해결되도록 각 판의 마무리를 그 판에서만 다룬 사실로 끝낼 것(SENTENCE-VARIETY 2-7).
   - 수정: 지적 1의 재작성에 포함. es의 "Guarde…" 명령문도 이때 사실 문장으로 바꿈.
   - 보존: 연락처 문장.

## 참고 의견 (차단 아님)

- es.md에 내부 링크가 없음. /es/services(라이브 200)를 한 번 거는 방안은 opusA가 이미 계획함. /es/services 상담 언어에 스페인어가 없다는 opusA 메모도 참고할 것.
- ja 출처 목록의 準則 항목은 제2조만 있음. ja 본문이 제11조를 쓰지 않으므로 오류는 아님.
- 74조 1항 '법에 다른 규정이 없으면'과 53조 이직 허가의 관계(공백 중 출국 명령이 언제 실제로 나오는지)는 조문만으로 단정하기 어려움. 지금처럼 '유예 기간이 있다'고 쓰지 않는 방식이 맞음.
