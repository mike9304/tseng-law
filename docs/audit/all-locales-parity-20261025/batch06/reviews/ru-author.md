# Batch06 러시아어 6편 저자 기록

작성·동결일: 2026-10-26 KST. 이 기록은 AI 저자의 실제 집필·자체 의미 검토와 기계검사를 구분한다. 사람·원어민·변호사 검수나 게시 승인을 뜻하지 않는다.

## 현재 결과와 소유권

러시아어 915·916·918·919·920·921 여섯 편을 직접 작성하고 동결했다. `published`와 `lastmod`는 `2026-10-26`, 공개 날짜는 `26 октября 2026 года`, audience는 `ru`, 내부 author는 `legal-ai-assistant`, 이미지 caption은 정확히 `Вымышленная сцена`다. FAQ 17개, 공식 출처 URL, 원문 이미지 경로를 유지했다. 공개 저자·AI 작성자·검수자 이름이나 굵은 강조는 넣지 않았다.

최종 공유 러시아어 검사는 실제 exit 0, FAIL 0이다. 본문 추출 문장 255개를 읽고, 마지막 수정으로 바뀐 6개 추출 문장도 별도로 대조했다. 본문·FAQ의 법률 의미 검토는 기계 PASS와 별개로 아래에 기록한다. 독립 검수와 릴리즈 통합·렌더링·공개 확인은 아직 이 저자 기록의 완료 범위가 아니다.

원본 공용 구조 검사 결과는 오류 2개를 그대로 유지한다. 모두 정상 공개 `/en/contact`를 catch-all 경로에서 찾지 못한 `internal-link-missing`이다. 실제 응답·코드·같은 옵션의 DE/RU 재현으로 오탐을 확인했지만 오류를 삭제하거나 PASS로 바꾸지 않았다. 부모가 별도 담당자에게 격리된 도구 수정을 배정했다. 원고 링크·공용 검사기·R은 이 문제를 피하려고 수정하지 않았다.

수정 소유 범위는 batch06의 `src/content/columns-ru/` 여섯 파일, 이 보고서와 `checks/ru-*`다. 다른 작성자의 원고·검수 기록, R, 공유 도구를 변경하지 않았고 커밋·push·게시를 하지 않았다.

## 집필 입력과 실제 읽은 범위

`research/bundle-manifest.json`의 동결 SHA는 `d56dfa2dd03c0e93c5f3576ee119c508f07daf24eb7412123aadc42e49bf3192`다. 아래 현재 정본 6편을 frontmatter·본문·FAQ·출처까지 모두 읽었다. source-freeze는 기존 승인본과 현재본을 구분한다. ZH918·920·921의 현재 metadata 교정은 topic과 lastmod에 관한 것이며 본문을 다른 판결로 바꾸지 않았다.

| 정본 | 전체 SHA-256 |
|---|---|
| `zh-919-taiwan-workplace-bullying-investigation-hearing-judgment.md` | `9696db15f3510d1f1d5b3f0dda3f0471d2e70a25b1bce625ca2fb3a49cceb390` |
| `zh-921-taiwan-online-game-coins-refund-judgment.md` | `d7783b6cebeb410766a692fa2eebf3bd3b12bff48bd2615f6468cfd09f8b9484` |
| `zh-920-taiwan-apartment-ev-charger-common-area-judgment.md` | `59fb9c0ff8d1c5760300cd7e525ef3fd2c8c1bbd4327c589786ba9e4bca2f582` |
| `zh-918-taiwan-presale-mortgage-notice-handover-judgment.md` | `43949fd463c3c6a7612dd98d6ffb1007925bc5032a0f3967fe181c1e16fdaa4b` |
| `en-915-taiwan-public-contract-mediation-arbitration-same-claim.md` | `dbc06e56df75f67e92e9fceef19ad1b7c3db4b9ff9396256d3d2d2e043d1966d` |
| `en-916-taiwan-parent-company-pollution-liability-us-investor.md` | `167addba353f1b6c7cfa3f530bc6aeb34b3c1871b33043de35203e9920817cb1` |

BRIEF, 프로젝트 AGENTS, source-freeze, six-source-facts, source-register, authoring-contract-draft, 저장소 EDITORIAL-VOICE, COLUMN-VOICE-RULE, SENTENCE-VARIETY-RULE, LESSONS 전문을 읽었다. 최초 합본 출력에서 잘린 부분은 개별 파일/구간으로 다시 읽었다. 마지막 계약의 919 신고인 의사에 따른 조율 가능성과 불성립 시 조사 속행, FAQ 보호 의무도 다시 대조했다. 모든 읽기 SHA는 [ru-inputs.json](../checks/ru-inputs.json)에 있고 최종 검사 때 바뀌지 않았음을 확인했다.

홈 공통 파일 `/Users/son7/agent-library/knowledge/editorial-voice.md`는 존재하지 않았다. 이를 읽었다고 표시하지 않았으며, 프로젝트가 지정한 문체 정본과 COLUMN-VOICE-RULE을 적용했다. Fable의 폐기된 필수 하청·고정 게이트를 다시 적용하지 않았다. 마무리에는 verification-before-completion 스킬의 실제 명령→출력→범위 확인 절차를 사용했으며 추가 승인 절차를 만들지 않았다.

최근 러시아어 3편은 실제 발행일 순의 ARC 704·705·706을 전문으로 읽었다. 해당 원고의 자연스러운 러시아어 설명, 질문·조건 표현을 참고하되 ARC의 첫 문장·제목·결말을 이번 사건 칼럼에 복사하지 않았다.

| 최근 읽은 원고 | 전체 SHA-256 |
|---|---|
| `704-taiwan-arc-first-application.md` | `ab1ee7e62195d68ae6042a3ca8746ec910543fb3b321f3fd62978954a8a6e71a` |
| `705-taiwan-visa-residence-work-study-family.md` | `7cb92723448d3558487e297b6b89f62d3ab52955fac77bdfd651a80d49d33cdb` |
| `706-taiwan-arc-renewal-changes-reentry.md` | `b9caf2c6328c7d328f376f9cecdaef142e265fa451a49a5c370edf2f177ffe28` |

공식자료의 열람 수준은 다음과 같다.

- 919·920·915·916: 보관된 실제 공식 회신 네 파일을 전문으로 읽었다. 26일 연구 담당자의 법원 재접속 실패를 새로운 판결문 전체 열람으로 표시하지 않는다. 919는 공식 설명, 920는 실제 보관 회신 L32–53(정식 첫 주문·마지막 상소 안내 일부 없음), 915는 공식 설명 L0–56, 916는 해당 사건 공식 회신 L24–40이다. 후속 소송 전체를 확인하지 않았다.
- 918·921: 현재 정본 전체와 연구 담당자가 새로 확인한 PDF 선택 행·범위에 관한 source-register/facts를 사용했다. 이 저자가 416쪽 PDF 또는 선택 행 두 파일 전체를 새로 읽었다고 주장하지 않는다. 이번 작성에서 빠진 PDF 행을 추정해 채우지 않았다.
- 이 저자는 26일 웹 도구의 MOJ 직안법 22-2·조달법 85-1·회사법 154와 USTR 2026년 2월 fact sheet의 새 회신을 직접 읽고 [ru-official-current-01.json](../checks/ru-official-current-01.json)에 보존했다. 나머지 현행 조항·공고는 동결 연구의 실제 공식 회신과 정본 범위를 대조했다. MOJ의 법규 정비 기준 2026-10-16 이후 모든 관보를 전수 조사한 것으로 쓰지 않는다.
- 공개 본문은 `25–26 октября 2026 года`의 확인일과 각 사건에 필요한 한계를 남긴다. 919 상소 가능, 920 확정 미확인, 916 전체 관련 소송 미종결 및 USTR 문서만으로 협정 전체 발효를 판정할 수 없다는 범위를 보존했다. 915·918·921은 확인된 각각의 절차상 최종성만 기술한다.

## 법률 명제·조건·FAQ 대조

| 원고 | 본문에서 보존한 구체 범위 | FAQ 의미 확인 |
|---|---|---|
| 919 | 공무원의 원처분·행정 재심 결정 취소. 1회 2대과 면직, 발표→상급기관→소속기관의 뒤집힌 순서, 적절한 출석 통지·진술 기회 결여, 보고서 모순, 사후 재심으로 치유되지 않음. 2026-09-03과 상소 가능을 보존하고 복직·괴롭힘 부존재로 단정하지 않았다. 민간의 2026-07-01 시행 규칙은 이전 공무원 사건에 소급하지 않는다. 피해 근로자의 신고로 알게 된 경우 재발 방지·수요와 사정을 고려한 상담/도움/보호·조사 의무, 신고인 의사에 따른 조율 MAY, 합의 불성립 시 조사 계속 MUST, 당사자 설명 기회·회피를 유지했다. | Q1 취소≠모든 행위 부존재, 상소·복직 한계. Q2 조사 전 보호 가능성과 법적 의무·신고 및 수요/사정 조건. Q3 공무원과 민간의 적용법 구별. |
| 921 | NT$243 548는 청구액이다. 미사용 유료 포인트가 남지 않았다는 불쟁사실과 대결용 칩인 금화의 기능을 유지했다. 현금 전환의 도박 문제는 이 게임의 이유이며 모든 가상재산을 배제하지 않는다. 이용자 자신의 종료 의사로 종료를 인정할 수 있었던 것을 운영자의 모든 과거 제재 정당성으로 넓히지 않았다. 현행 18점의 언제든 통지 종료, 미사용 포인트 OR 게임료, 필요 비용 공제, 종료일부터 30일 OR 쌍방 합의 방식을 보존했다. 4점은 게임 시작 후 7일 안 서면 무이유·무비용 해제다. 9점은 최소 30일 보관/요청 수령 후 7일 제공이며 금지6의 사업자 기록 독점 금지를 유지했다. 2023-01-01 현행본을 2021 사건에 소급하지 않는다. 2025 최초 신고 온라인게임 2위·전년 대비 감소를 2026 통계나 증가로 바꾸지 않았다. | Q1 명칭만으로 반환 여부 결정 불가. Q2 7일 해제와 이후 언제든 종료 구별 및 30일/합의 조건. Q3 운영자 기록만 허용하는 계약 금지와 이용자 증빙. |
| 920 | 2022-06-22 항소기각과 철거·원상회복, 벽·천장·공용 전기함·개인 계량기 경로를 유지했다. 개인 주차 권리는 공용 부분 공사 동의가 아니다. 법률11의 회의 결의와 해당 단지 규약15의 관리위원회 허가 AND 전력회사 안전검사를 구별했다. 6(1)(5) 위반·협의 후 불이행→6(3) 법원 구제 가능의 순서와 6(1)(4) 항변이 받아들여지지 않은 범위를 보존했다. 전원 차단/잠금/열쇠 제공은 거주자 주장이고, 법원의 가정적 판단을 확정사실로 바꾸지 않았다. 가오슝 지원은 공동구역 충전 선로 트레이이며 2026-09-30 공고 기한이 지났고 개별 설치허가를 대신하지 않는다. | Q1 전체 배선 경로와 실제 권리·규약 필요. Q2 주장을 가정해도 이 사건 철거 의무는 남는다는 제한. Q3 지원·동의 구별, 트레이 대상과 공고 기한 경과. |
| 918 | 2022-02-09 개발업자 항소·추가청구 기각, 지연이자 유지, 더 상소 불가. 2019-02-23 대출 안내, 뒤늦은 수도·전기, 7월 하자·미설치 승강기, 8월 조기 수리/청소 출입, 11월5일 대금 지급·11월28일 보증문서 인도일을 구별했다. 사건 약정 4개월과 현행15점 6개월은 사용허가 수령부터 통지할 기한이며 보편적 인도 완료 기한으로 쓰지 않았다. 약정 단계 지급·인도 전 완납과 14점의 구매자 협조/지급 의무를 보존해 무조건 지급중단 권리로 만들지 않았다. 2025 점검은 은행 확인/지급 기간을 6개월 통지 기산에서 빼는 부당 조항에 관한 것이다. 현행 중앙은행본은 2026-09-18 시행이며 2019 사건에 소급하거나 LTV·국적 자격을 만들지 않았다. | Q1 문서 내용·주택 상태에 따른 통지 판단. Q2 사건4/현행6, 사용허가 수령 기산과 계약 당시 규칙. Q3 미지급 대출이 모든 의무를 멈추게 하지 않음. |
| 915 | 금전→기간 연장→기간 권고에 기관 반대→금전 재청구이지만 그 돈에 관한 권고/안 없음. NT$44 417 150은 취소된 중재판정이며 현재 지급액을 뜻하지 않는다. 2017-07-12 상고기각·취소 확정과 하급심 신구법 이유 정정을 유지했다. 공급자 조정 신청에 기관이 거부 불가. 공사 OR 기술서비스, 구체 분쟁에 관한 권고 OR 안, 기관 부동의로 조정 불성립이라는 조건에서 중재 거부 불가. 독립 중재합의는 별도 가능. 40(1)(2)는 이 사건의 합의 부존재 근거만 설명하며 다른 사유·시점을 불완전한 일반 목록으로 쓰지 않았다. ITA는 미국 공급자용 예정 조달 전망이며 개시된 입찰·참가 자격·계약 분류 확정이 아니다. | Q1 조정 실패 자동 중재를 부정하고 법정 요건·별도 합의 구별. Q2 모든 금액·법적 주장 변경을 새 분쟁으로 단정하지 않음. 원문대로 2개 유지. |
| 916 | 단순 주식 소유가 아니라 지배·오염 인지·미조치/미고지·책임 회피 목적의 감자/해외 송금과 자산 감소를 보존했다. 2018-08-16 판단의 246 부분 취소·환송과 262 관련 상고기각을 구분하고, 후자를 262 원청구 전부 기각으로 바꾸지 않았다. 회사법154 기본 출자의무 한도와 법인격 남용→특정 채무 발생→명백한 상환 곤란 AND 중대한 사정·필요성이라는 누적 요건을 유지했다. 2018 사건의 모든 역사적 행위를 현행154 하나로 설명하지 않는다. USTR는 2026년2월 의향·적용법·미국 민간 파트너·금융지원 고려이며 러시아 투자자의 자동 혜택/자격이 아니다. 보고서 수령자·후속 질문/조치·자산 승인/분석을 남기는 실무 설명과 단순 저장만으로 준법이 되지 않는 한계를 유지했다. | Q1 소유만으로 책임 확정 불가. Q2 246/262의 다른 절차 결과와 전체 분쟁 종결 아님. Q3 보고서·수령자·질문·근로자 노출/오염 조치·자산 이전 승인과 재무분석 보존, 저장만으로 준법 아님. |

러시아어 독자를 러시아 국적자로 가정하거나 대만법을 러시아법으로 치환하지 않았다. 러시아어 상담을 보장하지 않았고, 이 사무소가 해당 사건을 수행했다는 주장도 넣지 않았다. 916의 관련 회사 칼럼은 실제 존재하는 `/ru/columns/taiwan-company-subsidiary-vs-branch`로 옮겼다. 915·916 문의 링크는 영어 원문 경로를 보존하며 `страницу контактов на английском языке`로 목적 언어를 명시했다.

## 실제 수정 이력

아래는 실제 파일에 먼저 존재했던 문장과 실제 반영된 수정이다. 가상의 사전 실패나 역산한 초안을 만들지 않았다. r1·r2·r3와 이미지 수정의 전후 SHA·전체 diff·리터럴 역복원은 각각 [r1](../checks/ru-prose-edits-r1.json), [r2](../checks/ru-prose-edits-r2.json), [r3](../checks/ru-prose-edits-r3.json), [이미지/alt](../checks/ru-image-inspection-and-alt-edits.json)에 있다. 최종 파일에서 단계를 역순으로 되돌려 최초 6개 SHA를 모두 실제 재구성했다. 이는 검증용 메모리에서만 수행했으며 디스크 원고를 과거 버전으로 덮어쓰지 않았다.

### R01 — 916

이전: Для проверки сделки эта последовательность даёт конкретные ориентиры. Перечень получателей отчёта помогает установить, кто знал о проблеме. Протоколы совета директоров и управленческие указания показывают, кто мог принять меры. Последующие разрешения на переводы средств приходится сопоставлять с обоими видами документов. Раздельное хранение этих материалов затрудняет восстановление собственных решений группы.

수정: Для проверки сделки эта последовательность даёт конкретные ориентиры. Перечень получателей отчёта помогает установить, кто знал о проблеме, а протоколы совета директоров и управленческие указания — кто мог принять меры. Оба вида документов сопоставляют с последующими разрешениями на переводы средств. Раздельное хранение затрудняет восстановление решений группы.

문제·의미 보존: MONOTONY: four adjacent medium-length statements are a document list; connect the paired knowledge/control evidence and keep asset authorizations as the next step. All record types and evidentiary roles preserved.

### R02 — 916

이전: В [информационном материале USTR за февраль 2026 года](https://ustr.gov/about/policy-offices/press-office/fact-sheets/2026/february/fact-sheet-us-taiwan-agreement-reciprocal-trade) США и Тайвань заявили о намерении содействовать трансграничным инвестициям.

수정: Февральский [информационный материал USTR за 2026 год](https://ustr.gov/about/policy-offices/press-office/fact-sheets/2026/february/fact-sheet-us-taiwan-agreement-reciprocal-trade) описывает намерение США и Тайваня содействовать трансграничным инвестициям.

문제·의미 보존: MONOTONY: paragraph opener В repeats three times. Make the cited fact sheet the subject without changing US/Taiwan actors, date, intention status or the following conditional financing limits.

### R03 — 918

이전: В августе покупатель подписал согласие на ранний вход для ремонта и уборки.

수정: Августовское согласие, подписанное покупателем, касалось раннего входа для ремонта и уборки.

문제·의미 보존: MONOTONY: four paragraphs start В. Lead with the document whose meaning the court assessed; retain month, signature, early access and both purposes.

### R04 — 918

이전: В рассматриваемом договоре уведомление требовалось направить в течение четырёх месяцев после получения разрешения на эксплуатацию.

수정: Договор требовал направить уведомление в течение четырёх месяцев после получения разрешения на эксплуатацию.

문제·의미 보존: MONOTONY: use the contract as subject. Retain four months, permit-receipt trigger and notice rather than completed handover; the immediately following current six-month rule remains separate.

### R05 — 920

이전: Одного номера парковочного места в смете недостаточно. Проект может показать расположение зарядного блока, каждую стену или колонну на пути кабеля, потолочный участок и точку подключения к щиту. Затем схему сопоставляют с документами о правах на имущество, правилами дома и уже принятыми решениями собраний. У отдельных участков маршрута может быть разный режим использования.

수정: Сметы с номером парковочного места недостаточно. Чтобы сопоставить схему с документами о правах на имущество, правилами дома и принятыми решениями собраний, в проекте можно показать зарядный блок, каждую стену или колонну на пути кабеля, потолочный участок и точку подключения к щиту. Участки маршрута могут иметь разный режим использования.

문제·의미 보존: MONOTONY: similar medium-length project/check sentences obscure why the route detail is needed. Connect purpose and optional practical method in one sentence, with short surrounding statements. Retain every route element, every comparison document and possible differing property status; no statutory duty is added.

### R06 — 916

이전: В отношении 246 заявителей Верховный суд отменил соответствующие части решения и направил их на новое рассмотрение. Жалобы, касавшиеся 262 заявителей, были отклонены. Основания направления включали недостатки анализа вреда, доказательств и полномочий на предъявление требований. Эти числа и процессуальные результаты приведены в [резолютивном обзоре суда](https://jirs.judicial.gov.tw/GNNWS/NNWSS002.asp?id=359523).

수정: Верховный суд отменил части решения, касавшиеся 246 заявителей, и направил их на новое рассмотрение, указав, в частности, на недостатки анализа вреда, доказательств и полномочий на предъявление требований. Жалобы, касавшиеся 262 заявителей, были отклонены. Эти числа и процессуальные результаты приведены в [резолютивном обзоре суда](https://jirs.judicial.gov.tw/GNNWS/NNWSS002.asp?id=359523).

문제·의미 보존: MONOTONY and coherence: attach the non-exhaustive remand grounds to the 246-claimant disposition, then contrast the separate 262-appeal result. Both counts, vacatur/remand, dismissal, all three grounds and source remain; no claim that the 262 underlying claims were denied.

### R07 — 919

이전: Увольнение сопровождалось одновременным назначением двух серьёзных дисциплинарных взысканий.

수정: Два серьёзных дисциплинарных взыскания назначили одним решением, повлекшим увольнение (一次記二大過免職).

문제·의미 보존: Accuracy: make the single disciplinary decision and resulting dismissal explicit, retaining the Taiwan term rather than suggesting two independent sanctions merely accompanied dismissal.

### R08 — 919

이전: Решение по делу 114年度訴字第869號 вынесла палата высшего административного судопроизводства 3 сентября 2026 года.

수정: Дело 114年度訴字第869號 рассмотрела палата высшего административного судопроизводства. Решение вынесено 3 сентября 2026 года.

문제·의미 보존: Section 5 numeric readability: separate the formal case identifier from the calendar date; court division, identifier and date all preserved.

### R09 — 919

이전: Если оно не состоялось, расследование необходимо продолжить.

수정: Если согласие не достигнуто, расследование необходимо продолжить.

문제·의미 보존: Accuracy: clarify that unsuccessful coordination/agreement, not merely an event failing to occur, triggers continuing investigation. The preceding claimant willingness and may coordinate condition remain unchanged.

### R10 — 921

이전: Районный суд Килунга отклонил апелляцию игрока 13 сентября 2021 года по делу 109年度消簡上字第1號.

수정: Районный суд Килунга отклонил апелляцию игрока по делу 109年度消簡上字第1號. Решение вынесено 13 сентября 2021 года.

문제·의미 보존: Section 5 numeric readability: separate exact identifier and date without changing court, appellant or dismissal; the next sentence retains non-appealability.

### R11 — 915

이전: в конце 2026 года и в 2027 году.

수정: в конце того же года и в 2027 году.

문제·의미 보존: Section 5 numeric readability: the same sentence already dates the ITA review 30 September 2026. Refer back to that year instead of repeating it; both forecast periods remain 2026 late/2027.

### R12 — 915

이전: При подготовке заявки категория закупки и условие о разрешении споров входят в первоначальную проверку договора. После возникновения задержки вопрос меняется: просьба сдвинуть график может перерасти в требование компенсировать дополнительные расходы. Для проектной команды это одна коммерческая проблема, но документы процедуры могут фиксировать разные способы защиты.

수정: При подготовке заявки проверяют категорию закупки и условие о разрешении споров. После задержки просьба сдвинуть график может перерасти в требование компенсировать дополнительные расходы; для проектной команды это одна коммерческая проблема, но документы процедуры могут фиксировать разные способы защиты.

문제·의미 보존: MONOTONY: three consecutive sentences have identical 15-unit lengths and prepositional openings. Connect the evolving claim with the commercial/procedural distinction; retain initial classification/dispute-clause check, possible time-to-money change and distinction between remedies.

### R13 — 920

이전: Нарушение статьи 11 и этих правил суд связал с обязанностью соблюдать иные нормы и правила дома по [пункту 5 части 1 статьи 6](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0070118&flno=6).

수정: Суд установил нарушение статьи 11 и правил дома. Обязанность соблюдать эти требования он связал с [пунктом 5 части 1 статьи 6](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0070118&flno=6).

문제·의미 보존: Section 5 numeric readability: separate the violated rule from the statutory duty incorporating it, so 11/5/1/6 do not crowd one sentence. Every reference, breach and link remains; failed coordination and possible court remedy remain immediately afterward.

### R14 — 921

이전: Срок хранения ограничен.

수정: Это минимальный срок хранения.

문제·의미 보존: Accuracy: the rule requires at least 30 days, not a mandatory maximum or automatic deletion deadline. The prior minimum, request-receipt trigger and seven-day production duty remain; early request advice unchanged.

### R15 — 918

이전: Документы, конверт без надписей и коробки для переезда в новой квартире

수정: Документы, конверт без надписей и коробка для переезда в новой квартире

문제·의미 보존: Direct image inspection: One moving box is visible, not multiple boxes. Image path, fictional caption, legal body and FAQ unchanged.

### R16 — 919

이전: Круглый стол, папки без надписей и три стула в пустой переговорной

수정: Круглый стол, папка без надписей и три стула в пустой переговорной

문제·의미 보존: Direct image inspection: One unmarked folder is visible, not multiple folders. Image path, fictional caption, legal body and FAQ unchanged.

## 실제 공유 검사와 문장 경계

명령은 Node24 PATH와 `PYTHONDONTWRITEBYTECODE=1` 환경에서 `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <여섯 실제 원고> --lang ru`였다. [실행·추출기](../checks/ru-run-variety.py)는 명령 원문·exit·stdout·stderr·도구와 프로필 SHA·전체 문장 배열을 보존한다. 다른 언어로 검사하지 않았다. 현행 DE 날짜 전용 변경 후 실행한 결과이며 RU 단위/분기/임계치를 수정하지 않았다.

실패 이력도 보존했다. [initial](../checks/ru-variety-initial.json)은 915·919·921 PASS, 916 길이 CV .443/동일 문단 시작 3회, 918 동일 문단 시작 4회, 920 CV .426 FAIL이었다. [prose-r1](../checks/ru-variety-prose-r1.json)에서 916 CV .447만 FAIL로 남았다. [prose-r2](../checks/ru-variety-prose-r2.json)에서 6편 모두 PASS였으며, 이후 실제 문맥·숫자/참조·최소 보관기간과 alt를 고친 뒤 최종 SHA로 [freeze](../checks/ru-variety-freeze.json)를 실행했다.

| ID | 문장 | CV | 짧은 문장 비율 | 비슷한 길이 3연속 | 최다 문단 시작 횟수 | 같은 시작 연속 | 최종 |
|---|---:|---:|---:|---:|---:|---:|---|
| 915 | 41 | 0.536 | 0.293 | 0.077 | 1 | 0 | FAIL 0 |
| 916 | 44 | 0.459 | 0.227 | 0.071 | 2 | 0 | FAIL 0 |
| 918 | 42 | 0.479 | 0.238 | 0.000 | 2 | 0 | FAIL 0 |
| 919 | 43 | 0.470 | 0.233 | 0.000 | 1 | 0 | FAIL 0 |
| 920 | 41 | 0.484 | 0.317 | 0.103 | 2 | 0 | FAIL 0 |
| 921 | 44 | 0.519 | 0.341 | 0.024 | 2 | 0 | FAIL 0 |

전체 255개 본문 문장 배열을 실제로 읽었다. 날짜와 중국어 사건번호는 각각 완결문 안에 남고, 22-2·85-1·기산일·금액·조건의 일부가 점에서 분리되지 않았다. 915·921의 표, frontmatter/FAQ와 출처 목록은 본문 리듬 점수 대상과 구별해 사람이 아닌 AI 저자가 별도로 의미 검토했다. 도구의 단위 수는 통계적 글쓰기 보조이며 러시아어 문법·법률 승인이나 원어민 자연스러움의 보증이 아니다.

## §5 자기 점검

| 항목 | 실제 확인 |
|---|---|
| 1 기계검사 | 최종 여섯 파일로 실제 exit 0, FAIL 0. 최초 실패와 각 수정 단계 보존. |
| 2 첫 문장/배치 | 915는 요구 변경 순서, 916는 환경조사가 증거가 된 사실, 918은 2월 대출 안내와 주택 상태, 919는 법원의 취소 판단, 920은 주차권 독자의 질문, 921은 청구액 하나로 시작한다. 범용 가정형 문구나 이번 글에서 설명하겠다는 도입 없음. 사실 전개 3편/판결 결과 1편/질문 1편/금액 1편으로 다른 진입점을 두었다. 허구 인물·증언을 만들지 않았다. |
| 3 길이 | 모두 아주 짧은 문장이 2개 이상. 915 법정 조건·919 신고 후 의무·920 배선 대조처럼 긴 문장은 필요 관계를 한 문장에 보존하고 뒤에 짧은 문장을 둔다. 한 문단에 긴 문장을 연속해서 쌓지 않았다. |
| 4 문단 시작 | 실제 배열을 세로로 읽었다. 916의 В, 918의 В 반복을 수정해 최다 1~2회이며 같은 시작 연속도 허용 범위다. |
| 5 인용 리듬 | 조문을 주어·문두·문장 안·문단 결론에 배치하고 출처 없는 사실/실무/질문 문단을 뒀다. 주장(조문)→단서가 세 문단 연속하지 않는다. 링크 자체는 삭제하지 않았다. |
| 6 대비 | 점수상 대비 0~1, 수동으로도 사건과 현행법·소유와 행위·지급과 통지처럼 독자가 실제 오해할 법적 구분에 제한했다. 원문이 요구한 범위 한정을 문체 점수 때문에 지우지 않았다. 추상적인 반박 공식을 연속 사용하지 않는다. |
| 7 결말 | 915는 요구 변경의 작업 기록, 916는 최초 발견과 후속 자산 승인, 918은 문서별 의무를 구분한 연표, 919는 결과 발표 전 진술·증거 평가, 920은 설치계약의 허가/비용 분쟁, 921은 금액의 구매·교환·사용 기록으로 끝난다. 그 뒤 확인일·사건 범위·출처는 LESSONS의 필요한 구조적 꼬리이며 판촉형 결말이 아니다. |
| 8 문체/표시 | 러시아어 설명문 문체를 유지했다. 한국어/일본어 종결형 규칙은 해당 없음. 굵은 강조·지어낸 1인칭·명령형 체크리스트 제목·공개 byline 없음. |
| 9 의미·숫자·출처 | 정확한 사건번호·날짜·기한·금액·조문·AND/OR·must/may·FAQ를 위 표와 대조했다. 동일 URL 순서와 최초 FAQ 내용은 최종까지 유지했다. 915의 같은 문장에 반복된 2026은 ‘того же года’로 연결했으며 전망 연도는 유지했다. 919·921은 사건번호와 날짜를 나눴고 920은 11조와 6조 항·호를 두 문장에 나눴다. |

## 구조 검사와 경로 오탐의 재현

[초기 구조 결과](../checks/ru-content-audit-initial.json)의 오류는 8건이었다. 6건은 저자의 sourceMap wrapper가 `zh-919-…`/`en-915-…` 연구 스냅샷 이름을 직접 넘겨, 숫자 접두사로부터 slug를 만드는 공용 도구와 맞지 않았던 호출 오류다. [wrapper 수정 기록](../checks/ru-audit-wrapper-correction.json)은 이전 코드·SHA·diff를 보존한다. 동결 스냅샷의 SHA를 확인한 뒤 실제 canonical basename으로 소유 checks 폴더에 symlink를 만들어 해결했다. 원문과 공용 도구는 변경하지 않았다.

최종 호출은 repoRoot=`/Users/son7/Projects/tseng-law-all-locales-20261025`, contentRoot=`batch06/checks/ru-overlay-content`, publicationDate=`2026-10-26`이다. 해당 overlay는 RU 신작 6개와 R의 기존 콘텐츠를 읽기 전용 symlink로 제공한다. sourceLocale은 ZH 네 편에 `zh-hant`, EN 두 편에 `en`; sourceMap은 `ru:<full-slug>`→`checks/ru-frozen-source-aliases/<canonical-name>`이다. [실행 코드](../checks/ru-audit.mjs)와 [최종 원본 결과](../checks/ru-content-audit-freeze.json)를 함께 보존했다.

남은 두 오류는 915 L59와 916 L58의 `/en/contact`, text=`страницу контактов на английском языке`, code=`internal-link-missing`, message=`No public route found in the App Router tree`다. 이것을 0개로 표시하지 않았다.

[같은 옵션의 실제 RU915/DE915 재현](../checks/ru-route-diagnostic.json)에서 RU는 이 링크 오류 1개, DE는 오류 0개다. repoRoot/source/publicationDate는 동일하고 입력 SHA도 기록했다. 원인은 공용 도구가 staticPagePatterns에서 `...` catch-all을 제외하면서 guidance locale의 `/de/contact`는 별도 GUIDANCE_CORE_ROUTE_KEYS로 허용하는 데 있다. 영어는 그 guidance 분기를 지나지 않는다. 실제 `src/app/[locale]/[[...slug]]/page.tsx`가 `renderLegacyPage`를 호출하고 `(legacy)/index.tsx`의 contact 분기가 페이지를 렌더한다. [공개 GET](../checks/ru-contact-public.json)은 2026-10-26 01:54:56 KST에 200, 최종 URL 동일이었다. [본문 메타 추출](../checks/ru-contact-public-parsed.json)은 lang=en, canonical=`https://tseng-law.com/en/contact`, title=`Contact & Inquiry | Hovering Law`, H1=`Contact & Inquiry`다. 단순 200 fallback으로 판단하지 않았다. 폼을 제출하지 않았다.

## 이미지와 최종 동결

원본 webp 6개를 view_image로 실제 열었다. 915 안전모·설계도·바인더·교량 모형, 916 토양 용기·노트·접이식 탁자·공장, 918 서류·빈 봉투·이사 상자 1개, 919 원탁·파일철 1개·의자 3개, 920 기둥 충전기·차량·상부 배선, 921 게임 화면·컨트롤러·토큰·노트가 alt에 대응한다. 918·919의 복수 표현을 단수로 고쳤고 정확한 허구 caption은 유지했다. 실제 당사자 사진으로 소개하지 않았고 이미지 자체는 편집하지 않았다.

[최종 검증](../checks/ru-final-verification.json)은 11개 파일별 수정 단계의 역복원, 최초 6 SHA 일치, 현재 6 SHA, FAQ 총17, 공식 출처 집합·최종 출처 절 전체 포함, 최초 대비 링크 순서 불변, 원본 이미지 SHA, 읽은 입력 SHA와 동결 연구 SHA를 실제로 재확인했다. 구조 오탐 2건은 이 기록에도 그대로 남았다.

| 원고 | 최종 SHA-256 |
|---|---|
| [915-taiwan-public-contract-mediation-arbitration-same-claim.md](../src/content/columns-ru/915-taiwan-public-contract-mediation-arbitration-same-claim.md) | `0d332f323ff63eb0bd79fb3b02383499f23bc5375c17a8177ef637f567d1e50b` |
| [916-taiwan-parent-company-pollution-liability-us-investor.md](../src/content/columns-ru/916-taiwan-parent-company-pollution-liability-us-investor.md) | `a5e367a361efa6bc898ce8a47d7bd47d9cc25e62cc6a094ee37adf6ebd310b00` |
| [918-taiwan-presale-mortgage-notice-handover-judgment.md](../src/content/columns-ru/918-taiwan-presale-mortgage-notice-handover-judgment.md) | `63ac4498dccfa6d3027dc7b91b180a8a8ada6e7dc885340cfe09a25928143862` |
| [919-taiwan-workplace-bullying-investigation-hearing-judgment.md](../src/content/columns-ru/919-taiwan-workplace-bullying-investigation-hearing-judgment.md) | `51278b88f3b5b2e591596bba78a998114dcca23e55e1ab04143b629b4b623508` |
| [920-taiwan-apartment-ev-charger-common-area-judgment.md](../src/content/columns-ru/920-taiwan-apartment-ev-charger-common-area-judgment.md) | `3755ded080555521a143d6ff1b683003515fad545bc33bc6a87a6dfbb965be5e` |
| [921-taiwan-online-game-coins-refund-judgment.md](../src/content/columns-ru/921-taiwan-online-game-coins-refund-judgment.md) | `650eda56f924953b185a7283c8f498ad62422723155925ab9c5f222e153ede33` |

공개 렌더링의 줄바꿈·폰트·카드·JSON-LD·실제 배포는 이 작성 작업에서 검사하지 않았다. 영어 문의 페이지의 공개 확인과 새 러시아어 칼럼의 게시 상태를 혼동하지 않는다. 다음 독립 검수는 위 동결 SHA를 기준으로 진행할 수 있다.


## 독립 R1 반영 후 최신 저자 상태 — 2026-10-26

이 절이 현재 상태다. 앞의 저자 동결 기록 37,689바이트는 한 글자도 바꾸지 않고 보존했다(SHA `f1e047a69ca37dbf388f78a2db20469cb4548db9776db70af5907d82839aab19`). 원래 manifest도 [별도 원본](../checks/ru-author-final-manifest-before-r1.json)에 그대로 보존했다. 독립 R1 [보고서](ru-independent.md) SHA `d4fa8790d959cb3d9733f888461f2bdd1b7399ad94834e9c7d38188eb18d990e`와 그 manifest는 수정하지 않았다.

Root R1의 필수 M01/M02와 선택 S01을 수용해 919·920·921 세 파일만 수정했다. 915·916·918은 기존 동결 SHA 그대로다. 변경은 본문3문장과921 FAQ2의 한 구절, 총4개 리터럴 치환이다. 독립 검수자의 수정 확인은 아직 별도이며 이 저자 기록은 반영 결과를 보고한다.

### M01 — 919

이전: та же статья обязывает предотвратить повторение травли

수정: та же статья обязывает принять меры для предотвращения повторной травли

이유·의미 보존: Root R1 M01: correct the object of the statutory duty to taking preventive measures. Victim-complaint trigger, needs/circumstances, counselling/help/protection/investigation, optional coordination and mandatory continuation remain unchanged. FAQ already states measures and is unchanged.

### S01 — 920

이전: Тогда нерешённый маршрут кабеля не превращается ещё и в отдельный спор об уже уплаченной цене монтажа.

수정: Это помогает заранее определить, кто несёт расходы, если маршрут кабеля согласовать не удастся.

이유·의미 보존: Accept optional Root R1 S01: contract preparation helps allocate expenses if the cable route is not approved; it does not guarantee that an additional dispute cannot arise. The preceding pre-installation permission and cost clauses remain optional practical advice, not a new statutory duty.

### M02-body — 921

이전: оператор обязан вернуть неиспользованные платные баллы или плату за игру в течение 30 дней

수정: оператор обязан вернуть неиспользованные платные баллы или неиспользованную часть платы за игру в течение 30 дней

이유·의미 보존: Root R1 M02: explicitly restrict the game-fee alternative to its unused portion as well as unused paid points. Necessary cost deduction, termination trigger, 30 days and mutually agreed alternative remain unchanged.

### M02-FAQ2 — 921

이전: Неиспользованные платные баллы или плату за игру после вычета необходимых расходов должны вернуть

수정: Неиспользованные платные баллы или неиспользованную часть платы за игру после вычета необходимых расходов должны вернуть

이유·의미 보존: Apply the same unused condition to both FAQ2 refund alternatives without changing notice termination at any time, cost deduction, 30 days, mutual agreement or the separate first-seven-days rule.

정확성 대조: 919의 신고 인지 조건·상담/필요 지원/보호/조사·조율 may/불성립 후 계속 must를 유지하고 의무의 대상을 예방 조치로 명확히 했다. 921은 포인트와 게임료 양쪽의 미사용 범위를 명시하면서 필요비용 공제·계약 종료 기산·30일·쌍방 합의 대안·언제든 통지 종료/7일 해제 구별을 유지했다. 920은 계약 준비의 도움으로 한정해 분쟁이 생기지 않는다는 효과 보장을 없앴다.

[실제 diff와 전후 SHA](../checks/ru-independent-r1-edits.json), [역복원·metadata·링크 검증](../checks/ru-independent-r1-verification.json), [실제 경계 대조](../checks/ru-independent-r1-boundary-check.json)를 보존했다. 수정 후 원고에서 독립R1 당시6SHA를 모두 복원하고, 그 뒤 원래 자체 수정 이력까지 거슬러 최초6SHA도 일치시켰다. 총14개 파일별 단계의 전후 SHA가 일치했다. 복원은 메모리 안에서만 했으며 실제 원고를 되돌리지 않았다.

Frontmatter 변화는921 FAQ2의 답변뿐이다. 그 질문, 다른16개 FAQ, 나머지 metadata, 이미지/alt/caption, 발행/수정일, 내부 author, URL 순서는 독립R1 당시와 같다. 공개 byline·굵은 강조는 없다.

변경한3편만 실제 shared `--lang ru`로 재실행했다([원로그](../checks/ru-variety-independent-r1.json)). 모두 exit0/FAIL0이다. 문장 수는43/41/44로 이전과 같다. 변한 본문3문장과 FAQ2를 실제 읽었고, 그3편의 나머지125개 분절 문자열은 위치까지 동일했다. 바뀌지 않은915·916·918은 이전 PASS 원고 SHA 및 도구/프로필 SHA까지 동일함을 확인했으며, 이3편을 이번에 재실행했다고 주장하지 않는다.

| ID | 현재 CV | 현재 검증 근거 |
|---|---:|---|
| 915 | .536 | 기존 freeze PASS, 원고·도구 SHA 불변 |
| 916 | .459 | 기존 freeze PASS, 원고·도구 SHA 불변 |
| 918 | .479 | 기존 freeze PASS, 원고·도구 SHA 불변 |
| 919 | .485 | 수정 후 실제 재실행 exit0/FAIL0 |
| 920 | .486 | 수정 후 실제 재실행 exit0/FAIL0 |
| 921 | .525 | 수정 후 실제 재실행 exit0/FAIL0 |

§5의 첫 문장·문단 시작·질문·인용·숫자·조문은 그대로다. 919의 긴 조건문은 여전히 한 문장으로 추출되고 뒤의 짧은 조율 설명이 남는다. 920의 실질 결말은 승인 거절 시 비용배분이라는 해당 글의 사실에 연결된다. 921의 길어진 반환 대상도 같은 한 문장 안에서30일·합의 대안과 연결된다. 새로운 MONOTONY 항목이나 조건 유실을 만들지 않았음을 변경 범위에서 확인했다.

공용 구조 도구가 별도 담당자에 의해 수정된 뒤 [최종 구조 결과](../checks/ru-content-audit-independent-r1.json)는 같은6파일·동결 sourceMap·발행일 옵션으로 오류0이다. semanticStatus는 여전히 REVIEW_REQUIRED이며 자동 검사로 법률 승인을 주장하지 않는다. 원래 contact 오류2개가 있던 freeze 결과와 진단은 삭제하거나 고치지 않았다. 원고의 `/en/contact` URL과 영어 목적지 표시는 그대로다. 실제 사용한 수정 도구 SHA는 새 검증 JSON에 기록했다.

| 원고 | 현재 SHA-256 |
|---|---|
| `915-taiwan-public-contract-mediation-arbitration-same-claim.md` | `0d332f323ff63eb0bd79fb3b02383499f23bc5375c17a8177ef637f567d1e50b` |
| `916-taiwan-parent-company-pollution-liability-us-investor.md` | `a5e367a361efa6bc898ce8a47d7bd47d9cc25e62cc6a094ee37adf6ebd310b00` |
| `918-taiwan-presale-mortgage-notice-handover-judgment.md` | `63ac4498dccfa6d3027dc7b91b180a8a8ada6e7dc885340cfe09a25928143862` |
| `919-taiwan-workplace-bullying-investigation-hearing-judgment.md` | `548b8ca01b038849253985b6acaacd427b9791f19a1dd034a4a0af0684271906` |
| `920-taiwan-apartment-ev-charger-common-area-judgment.md` | `0245e109b5976dce38bd36c60235aa90cd2a3acdadebd87ab8887f4d11e01435` |
| `921-taiwan-online-game-coins-refund-judgment.md` | `cd67ec2c2e63c22704b7f0c2a210ff6cfe5a4209898bbd578802af30b770e4a4` |

위 수정 반영 후 원고를 다시 동결했다. R·다른 원고·독립 보고서·공유 도구를 수정하지 않았고 커밋·push·게시를 하지 않았다. Root가 실제 diff를 확인할 수 있도록 현재 manifest에 새 SHA와 이전 동결 영수증을 함께 연결한다.
