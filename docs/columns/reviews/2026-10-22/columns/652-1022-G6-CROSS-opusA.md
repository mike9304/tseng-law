# CROSS-opusA — G6 (의료분쟁: 병원에서 가족이 숨졌을 때 — 검시·부검·조정·고소) 교차 검수

- 검수자: opusA (Claude Opus 5.5, 작성자 opusB와 별개 세션) · 2026-10-22 09:55 KST
- 대상: drafts/gap/G6/{ko,zh,ja,en,es}.md — WROTE-opusB의 sha256과 검수 시점 해시 일치.
- 판정: MAJOR 1 · MINOR 6. 모두 반영한 뒤 READY.

## 검수자가 직접 확인한 것

- 조문(law.moj.gov.tw LawSingle 2026-10-22 재조회, research/opusA/law/): 醫療事故預防及爭議處理法 6·7·10·13·14·15·16·28·30, 醫療爭議調解會組織及運作辦法 7, 刑事訴訟法 213·218·233·256, 法醫師法 10, 醫師法 16, 醫療法 82·98, 刑法 276·287, 民法 192·194. 번호·항·호·숫자(5영업일, 7영업일, 45일·3개월·연장, 10일, 무료) 일치. 시행일 2024-01-01(행정원 공보 evidence/gazette-145697.html) 일치.
- 판결: 新竹地院 113醫2(2024-12-31) — 2022-08-22 낙상, 다음 날 사망, 相驗屍體證明書 사인 문구, 간호사 등 불기소·再議 기각 확정, 70만 청구 기각, 억제 필요성·침대 난간 증언(증인 재신문 불가) 판단 — 원문 일치. 판결문 끝에 '송달 후 20일 내 상소' 안내, GetJudHistory 기록 0건. 嘉義地院 113醫4 — 2024-10-18 조정 없이 제소, 2026-05-07 再開辯論 裁定(이미 변론종결·宣判期日 지정 상태), 嘉義縣 衛生局 조정 불성립, 醫審會 鑑定 의견을 근거로 2026-09-09 기각(청구 120만으로 감축), 2026-10-05 항소 재판비 보정 裁定 → 1심·미확정 — 원문 일치.
- 자동 검사: variety_metrics FAIL 0 ×5, hygiene OK(zh의 '曾' 경고는 "曾依本法" 오탐), 외부 링크 31개 non-200 0, 내부 링크 5개 라이브 200.
- 중복: ko·zh·en 056은 相驗·解剖·16조를 다루지 않음 → 사망 사건 각도는 새로움. ja 269는 15·16·14·28·30조(조정 전치·형사 조정·기간·효력·무료)와 '귀국 후 조정 참여' FAQ를 이미 다룸(지적 5).

## 지적

1. MAJOR — es.md ↔ en.md — es가 en의 번역으로 읽힘
   - 근거(문장 단위 대응): 제목 en 2 "A Family Member Dies in a Taiwan Hospital: Autopsy Requests, Criminal Complaints and Mandatory Mediation" = es 2 "Muerte de un familiar en un hospital de Taiwán: autopsia, denuncia penal y mediación obligatoria"; seoTitle en 3 = es 3; 요약 en 4 = es 4(네 문장 같은 순서, "A court-approved mediation ends both civil and criminal routes, and a certificate stating the cause of death does not by itself prove negligence." = "Una mediación homologada por el tribunal cierra las vías civil y penal, y un certificado con la causa de la muerte no prueba por sí solo la negligencia."); FAQ 세 개 질문·답이 en 16–21 = es 16–21("Yes, within limits. After the body is examined…" = "Sí, con límites. Tras el examen del cadáver…"); 본문 en 44 = es 50(신주), en 46 = es 52("The legal bar is specific." = "El listón legal es concreto." 이하 82·98·287·256 네 문장 같은 순서), en 50 = es 46(자이), en 52 = es 54, en 54 = es 56.
   - 이유: 2026-10-21 08:22 지시·GATE-PROMPT — 번역처럼 읽히는 판은 FAIL. es 고유 부분은 28 첫 문단(16조로 시작)과 30·38행뿐.
   - 수정: es를 스페인어권 유족 상황에서 다시 씀. 제목·요약·FAQ를 en과 다른 질문으로(예: 시신 본국 송환·화장 일정과 부검 요청의 선후, 스페인어 통역 — 6조 3항 '언어·문화로 소통이 어려우면 훈련받은 사람이 돕는다'는 en·zh에만 있음, 해외 유족의 대리인 선임 서류). 본문 문단 순서와 문장도 새로 짜고, 신주·자이 사건 요약과 '법적 기준' 문단은 en 문장을 옮기지 말 것. 본국 제도와 비교하려면 BOE 등 공식 출처를 열어 확인한 것만.
   - 보존: 대만 조문·숫자·판결 서술(1심, 자이 미확정)은 그대로.

2. MINOR — 다섯 판 공통(ko 32–34·40, zh 36–38·44, ja 38–40·48, en 30·34·46, es 34–36·52) — 같은 모양의 두 문단
   - 근거: ① '검시(218조)·의사 신고(醫師法 16)·고소권자(233조 2항)' 다음에 "부검 요청권의 범위는 더 좁습니다." / "能請求解剖的人比較少。" / "解剖を求められる人は、もっと限られます。" / "Para la autopsia, la lista es más corta." / en "A sister is not on that list."가 이어지는 같은 전개. ko·en·es는 '형제(자매)가 먼저 도착'이라는 같은 예시까지 씀. ② '의료법 82조 3항 → 98조 1항 4호 → 형법 287조 → 형소 256조' 네 문장이 다섯 판에서 같은 순서.
   - 이유: 지적 1과 같은 번역 금지 기준. 사실은 같아도 전개·예시까지 같으면 번역 흔적으로 읽힘.
   - 수정: 지적 1의 es 재작성과 별도로 ko·zh·ja 가운데 최소 두 판에서 전개를 바꿈. 예: zh는 형제 예시 없이 '화장 일정' 쪽에서 부검 요청 범위를 설명, ja는 82조를 신주 사건 설명 안에 녹이고 287·256조를 고소 절에 둠, ko는 형제 예시를 유지하되 '법적 기준' 문단 순서를 고소→재의→82조로.
   - 보존: 조문·숫자.

3. MINOR — ko 44·zh 42·ja 46·en 44·es 50 — 신주 1심 판결의 상소 여부 미기재
   - 이유: TASK('1심은 상소 가능 명시')와 LESSONS 4. 판결문은 송달 후 20일 내 상소 가능하다고 안내하고, 판결서 검색시스템에는 이후 기록이 없음(GetJudHistory 0건). 지금은 '1심'만 적혀 확정 여부를 알 수 없음. G2에서 같은 작성자가 쓴 방식("판결서 검색시스템에는 이 판결 뒤의 재판 기록이 나오지 않습니다")과도 맞지 않음.
   - 수정: 각 판 신주 문단 끝에 "1심 판결이며, 판결서 검색시스템에는 이후 심급 기록이 나오지 않습니다(확정 여부는 확인하지 못함)"에 해당하는 문장을 언어별로 추가.
   - 보존: 판결 내용.

4. MINOR — ko 12·zh 12·ja 12 tags — 폐지된 죄명
   - 원문: ko "업무상과실치사", zh "業務過失致死", ja "業務上過失致死".
   - 이유: 현행 형법 276조는 "因過失致人於死者，處五年以下有期徒刑…" 한 항뿐이고 업무상 과실 가중 조항은 2019년 개정으로 삭제됨(2026-10-22 LawSingle 확인). 본문은 '과실치사/過失致死(276조)'로 정확하니 태그만 어긋남.
   - 수정: ko "과실치사", zh "過失致死", ja "過失致死".
   - 보존: 없음.

5. MINOR — ja.md 28–34 — 기존 ja 269와 겹치는 내용으로 시작
   - 근거: ja 269("台湾の病院で治療後に損害が出たとき：カルテ開示・調解前置・賠償")가 이미 15조 1·2항(민사 조정 전치·이송), 16조 1항(형사 조정), 14조(45일·3개월·연장), 28조, 30조(무료), FAQ "日本に帰国した後でも、台湾の医療紛争調解に参加できますか？"를 다룸. G6 ja는 嘉義 裁定 인용으로 시작해 첫 절 전체("民事も刑事も、まず調解")를 이 내용에 쓰고, 사망 사건 고유의 相驗·解剖는 두 번째 절로 밀림. FAQ 2도 269 FAQ와 같은 질문.
   - 이유: TASK '기존 칼럼과 겹치면 더 좁은 각도로' — 일본 독자에게 새 정보(사망·부검·화장·遺体搬送 전 결정)가 뒤로 감.
   - 수정: ja 첫머리와 첫 절을 사망 사건 고유 쟁점(화장·일본 搬送 전에 부검을 요청할 수 있는 사람, 相験)으로 바꾸고, 조정 전치는 짧게 줄여 269 링크로 넘김(嘉義 再開 裁定은 짧은 사례로 유지 가능). FAQ 2는 辦法 7조(대만 내 주소 있는 대리인 필수)처럼 269에 없는 내용으로 질문을 바꿈.
   - 보존: 15·16조, 嘉義 사건의 1심·미확정 표시.

6. MINOR — ko 40·zh 44·ja 48·es 52 — 재의 신청 주체 누락
   - 원문: ko "불기소처분을 받으면 10일 안에 재의를 신청할 수 있습니다", zh "不服不起訴處分，可以依…聲請再議", ja "不起訴処分には、受け取ってから10日以内に再議を申し立てられます", es "Contra el archivo cabe pedir revisión en 10 días".
   - 이유: 刑訴 256조 1항은 "告訴人"에게만 재의 신청권을 줌. 병원 사망에서는 고소 없이 검사가 相驗으로 사건을 여는 경우가 있어, 고소하지 않은 유족도 재의할 수 있는 것처럼 읽히면 안 됨. en 46은 "A complainant who receives…"로 정확함.
   - 수정: ko "고소인은 불기소처분서를 받은 날부터 10일 안에…", zh "告訴人不服不起訴處分，可以在收到處分書後10日內…", ja "告訴人は、不起訴処分書を受け取ってから10日以内に…", es "Quien presentó la denuncia puede pedir la revisión del archivo en los 10 días siguientes a recibir la resolución".
   - 보존: 10일, 기산점(처분서 수령), 緩起訴 포함 여부는 원문대로.

7. MINOR — es.md:30 — 전개 예고 문장
   - 원문: "¿Qué hacer entonces con el cuerpo, la denuncia y la reclamación? Vamos por partes."
   - 이유: EDITORIAL-VOICE '글의 전개를 예고하는 문장은 생략' — 지워도 정보 손실 없음.
   - 수정: 문단 삭제(지적 1 재작성 때 함께).
   - 보존: 없음.

## 참고 의견 (차단 아님)

- es 54의 내부 링크(체육관 부상 칼럼)는 관련성이 약함. 라이브 200을 확인한 [/es/services](https://tseng-law.com/es/services)(Litigios civiles y daños, Asuntos penales)가 더 맞을 수 있음.
- ko 46 "선고는 9월로 미뤄졌습니다" — 원래 宣判期日은 판결서로 확인되지 않음. "판결은 9월에야 나왔습니다" 정도가 더 안전함.
- en 38 'Mediation comes before the investigation' 소제목 — 16조 1항은 '수사 중인 사건을 먼저 조정에 보내고 그동안 수사를 멈춘다'는 구조이고, 相驗·부검은 그 전에도 진행됨. 'Mediation pauses the investigation' 쪽이 정확함.
