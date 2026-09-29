# EN1 중간검수 r2 (Opus 5.5) — taiwan-exit-ban-foreigners

검수일 2026-09-29. 대상: 수정된 draft.md와 CHANGES-r1.md. 조문은 law.moj.gov.tw `LawAll.aspx`를 이번 라운드에 다시 curl로 받아 원문으로 대조했다(刑事訴訟法 115.05.13, 入出國及移民法 112.06.28, 強制執行法 108.05.29, 法律扶助法 104.07.01 현행).

verdict: **PASS** (P0 0 · P1 0 · P2 6)

---

## 1. r1 P0/P1 반영 확인

| r1 항목 | 반영 위치 | 결과 |
|---|---|---|
| P0-1 強制執行法 22 "공식 근거 없음" 문장 | "Debts and fines" 첫 문단 | 해결. 注意事項 11(3) 링크·요지, "or another necessary reason", 해제 3사유(22조 2항 단서), 12조 이의·집행 불정지가 모두 조문과 일치한다. 行政執行法 문단에도 "in its practice that includes an exit ban"과 조세 출국금지와 별개라는 문장이 들어갔다(法務部行政執行署 결정 취지와 일치). |
| P1-1 93-6 누락 | "A criminal case" 첫 문단 | 해결. 두 경로(93-2 신문 전 직접 부과, 신문 후 보석·限制住居와 함께 93-6)와 "Both routes follow the same time limits and remedies"가 들어갔다. 93-6이 93-3~93-5를 준용하고, 416·404는 限制出境 자체를 대상으로 하므로 맞다. 93-2 제3항 단서(신문 시 당정 고지·서면 교부)도 반영됐다. |
| P1-2 入出國及移民法 31 설명 오류 | "Who actually stops you" 마지막 문단 | 해결. 방문자는 만료 전 연장(31조 1항), ARC 보유자는 거류 사유가 소멸해도 계속 거류 허가 가능(31조 4항 8호)으로 정확히 구분했다. 21-1과 72-1(1–7년)도 추가됐다. |
| P1-3 민사 집행 해제·불복 누락 | P0-1 문단 | 해결(위와 같음). |
| r1 P2 1–12 | 전반 | 모두 반영됐다. 1인칭 "I" 0건, 모바일 인증서, 93-4 결과 구체화, FAQ 3 수치, 보전조치 선행 요건, 財政部 규범 수치(8회/2년, 183일/1년, 1,000만/2,000만, 미확정 1,500만/3,000만, 미확정 금액은 벌금 제외), "most often" 삭제, 25조 문장, 1990·법률구조 문장, 확인일 별도 문단. |

## 2. 새 내용 원문 대조 (curl verbatim)

- **刑事訴訟法 93-6** (https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=C0010001): "依本章以外規定得命具保、責付或限制住居者，亦得命限制出境、出海，並準用第九十三條之二第二項及第九十三條之三至第九十三條之五之規定。" → 본문 "Article 93-6 allows an exit ban at the same time… Both routes follow the same time limits and remedies"와 일치.
- **刑事訴訟法 228(4)**: "被告經傳喚、自首或自行到場者，檢察官於訊問後，認有第一百零一條第一項各款或第一百零一條之一第一項各款所定情形之一而無聲請羈押之必要者，得命具保、責付或限制住居。" → "if the prosecutor or judge releases you on bail or with restricted residence"와 일치(법관 쪽 근거는 101-2 "得逕命具保、責付或限制住居").
  - 참고: "so a minor case is not automatically safe"는 법적으로 틀리지 않다. 228(4)·101-2가 요구하는 101조 1항 1·2호(도주·증거인멸 우려)에는 법정형 제한이 없고, 刑訴法 전문을 "拘役或專科罰金"으로 검색해도 具保·限制住居를 금지하는 규정은 없다. 다만 표현은 P2-4 참조.
- **入出國及移民法 31** (https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080132): 1항 "外國人停留或居留期限屆滿前，有繼續停留或居留之必要時，應向移民署申請延期。" / 4항 "…居留原因消失者，廢止其居留許可…但有下列各款情形之一者，得准予繼續居留：…八、依第二十一條第一項規定禁止出國。" → 새 문장과 일치.
- **入出國及移民法 72-1**: "違反第七條之一第一款、第二款、第二十一條之一第一項或第二項準用第一項第二款規定者，處一年以上七年以下有期徒刑，得併科新臺幣一百萬元以下罰金。" → "one to seven years' imprisonment" 일치(21-1 1항 2호 "使受禁止出國處分之外國人出國" 포함).
- **入出國及移民法 74-1(2)**: "臺灣地區無戶籍國民或外國人，逾期停留或居留者，處新臺幣一萬元以上五萬元以下罰鍰。" → 본문에는 인용되지 않았다. 확인만 했고 문제 없다.
- **法律扶助法 14(1)(1)** (https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=A0030157): "非中華民國國民符合下列情形之一者，本法之扶助規定亦適用之：一、合法居住於中華民國境內之人民。" → "can assist foreign nationals lawfully living in Taiwan who meet its criteria" 일치.
- **司法院 辦理強制執行事件應行注意事項 11(3)**: https://legal.judicial.gov.tw/FLAW/dat02.aspx?lsid=FL001393 는 **브라우저 헤더(UA·Accept·Accept-Language)를 붙인 curl로 HTTP 200, 242,906 bytes, 제목 "所有條文-辦理強制執行事件應行注意事項"가 열린다.** 헤더 없이 보내면 bot-defense 거부 페이지가 나오는데, 일반 브라우저 사용자에게는 영향이 없다. 修正日期 民國115年05月25日. 원문: "十一、關於第二十二條部分：…（三）本法第二十二條第二項之限制住居，包括禁止出境在內。執行法院為此處分時，應通知該管戶政、警察機關限制債務人遷徙，通知入出境管理機關限制其出境，並同時通知債務人。解除其限制時，亦同。" → 본문 "restricted residence includes a ban on leaving the country, and that the court must notify the immigration authority when it imposes or lifts one"와 일치. (law.judicial.gov.tw 도메인은 이 기기에서 연결 자체가 안 된다. 링크는 지금처럼 legal.judicial.gov.tw를 유지할 것.)

## 3. 형식

- summary 155자(150–160), 줄임표 없음. title+" | Hovering Law" 76자 → seoTitle 42자(30–45, title과 다름). 충족.
- 본문 약 1,849 words(1,900 이내, 내 계산 기준). 공식 링크 10개와 내부 링크 1개. 금지어·em dash·굵은 글씨·1인칭 0건.
- 내부 링크 `/en/columns/taiwan-police-questioning-foreigner-rights`는 COORD.md에 사전 합의된 EN1↔EN2 상호 링크다(EN2 = 033). 통합 시 상대 파일이 있을 때만 활성화하면 된다.

---

## P2 (문체·다듬기) — 6건. PASS에 지장 없음

1. **개수 불일치** — "Two points are easy to miss. First… Second… Third…" → "Three points are easy to miss."
2. **25조 문단 중복** — 같은 내용을 두 번 말한다. 두 문장을 하나로 합칠 것:
   > The provision reaches beyond the debtor. Article 25 applies these measures to the responsible person of a legal entity and to a sole proprietorship's manager, so a foreign director or company representative who steps down may still be covered if the grounds arose while they were in office.
3. **行政執行法 문장 분리** — "…and in its practice that includes an exit ban, but not where the total owed is under NT$100,000 unless…"는 한 문장에 너무 많이 담겼다. →
   > The Administrative Enforcement Agency (法務部行政執行署) may restrict residence in listed situations, and in its practice that includes an exit ban. It may not do so where the total owed is under NT$100,000, unless the person has already left the country twice.
4. **공포 뉘앙스 완화** — "so a minor case is not automatically safe" → "so the limit for fine-only offenses does not rule out a ban in every case."
5. **대명사 선행사** — 앞 문단 마지막 "written notice"와 문단이 갈려서 "Photograph it"의 대상이 흐리다. → "Photograph that notice, note the name of the authority and any case or document number, and do not sign anything you cannot read."
6. **부속 파일 정리(본문 외)** — NOTES.md 1행은 아직 "file 024"이고, 5행 Uncertainties는 r1 이전 상태다(Art. 22 연결·1990·법률구조·21-1 벌칙 모두 해결됨). COORD.md 기준 번호는 **032**다. 따라서 파일명과 `featured_image: "../images/032-taiwan-exit-ban-foreigners/featured-01.webp"` 반영 여부를 통합 단계에서 총괄이 정해야 한다. dossier 37행 "1990…弱確認"도 해결됨으로 고칠 것(47행에는 이미 "已解決"로 적혀 있다).

검증한 주장 수: 신규·변경 22 (누적 66) / 공식 출처 재확인 수: 이번 라운드 6
(law.moj.gov.tw 刑事訴訟法·入出國及移民法·法律扶助法·強制執行法 LawAll 재수집, legal.judicial.gov.tw FL001393 curl 원문, 앞 라운드의 財政部 GL009873·eTax 0320·法務部 mojlaw 대조 결과를 새 수치 문장에 재적용)
