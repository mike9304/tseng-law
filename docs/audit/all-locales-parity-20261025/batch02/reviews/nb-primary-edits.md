# NB 704–706 — Kimi 초안에 대한 root 직접 수정

2026-10-25 KST. Kimi Code `kimi-code/k3.1-pro`가 승인된 입력 묶음으로 작성한 원고 3편을 root가 전문으로 읽고 직접 편집했다. 원본은 `kimi-work/output-nb/`에 보존되어 있다. 원본·수정본 SHA와 전체 diff는 `../checks/nb-primary-diff-manifest.json`에 연결한다. Kimi 작성과 root 수정의 기여를 구별한다.

## 지적 해결

| 문제 문장 | 이유·출처 | 실제 수정 방향 | 의미 보존 |
|---|---|---|---|
| 705 `Helsidestudenter` | 잘못된 학생 용어 | `Utenlandske heltidsstudenter` | 외국인 정규 학생이라는 대상 유지. |
| 705 `20 timer ... utenom ferier, med ... unntak ... artikkel 53` | [취업서비스법 50조](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=N0090001)의 예외는 여름·겨울 방학. 53조는 이 한도의 일반 예외가 아님. | `høyst 20 timer i uken utenom sommer- og vinterferien` | 해당 50조 학생 범위와 별도 취업허가 유지. |
| 705 성년 자녀 `ikke kan forsørge seg selv` | [인재법 16조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16)의 self-care를 경제적 부양으로 오독할 수 있음. | 장애 때문에 `ikke er i stand til å ta vare på seg selv` | 장애·성년 자녀·자기돌봄 불가, 일반/특정인재 OR와 공통 NIA 허가, 가족 자신의 입국조건 유지. |
| 706 새/추가 고용주 모두에 종전 고용 종료 증명 | [취업서비스법 53조](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=N0090001)는 이직에만 종료 증명을 요구 | 새/추가 고용주의 일반 허가와 이직 때 종료증명을 나눔 | 복수 고용 자체에 종료 의무를 만들지 않으며 개인허가·법정예외·이주노동자 제한 유지. |
| 706 `Nytt oppholdsvisum fra BOCA innen 15 dager` | [거류규칙 7조](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129)는 발급 완료가 아닌 신청 | 표·본문에 BOCA/분소로 15일 내 신청, 이후 NIA 절차라고 명시 | 발생일부터 기산, 23-1 대상 30일 경로와 구별. |
| 705 반복 `Et`, `Artikkel`, `Den`, 706 문단 첫말 `Ved` | MONOTONY: 실제 동일 시작·문단 첫말 실패 | 방문비자·장기거류·BOCA 학생제도·새 고용주·카드 분실이라는 주어로 정리 | 조문·예외·조건을 지우지 않음. 검사기 미수정. |

직접 웹 재확인 범위는 현행 취업서비스법 전문의 50·53조, 인재법 16조 중문, 거류규칙 전문의 7조다. 단일 조문 페이지 일부의 접근 오류는 전문 열람으로 해결했다. 모든 법령·관보를 이번 편집 단계에서 새로 전수 조사했다고 표시하지 않는다.

## 추가 명료화와 출처

704·705 끝 목록에 원문에 있는 인재법 영문 전문 URL을 복구했다. 706의 34조 query 순서를 원문과 맞췄으며 같은 법 조문이다. 불필요하게 추가된 영어 연락처 페이지 링크는 삭제하고 원문의 이메일과 실제 상담 언어 안내는 남겼다. `norsk konsultasjon er ikke tilbudt`라는 새 부정 약속도 제거했다. 새 노르웨이어 상담 제공을 주장하지 않는다.

`landingvisum`은 `visum ved ankomst`, 졸업 예정자로 읽힐 `avgangsstudent`는 학위를 이미 취득한 `nyutdannet`, `hjemreisen`는 `returen til Taiwan`으로 고쳤다. FAQ의 새 고용주가 임의로 허가를 요구한다는 형태는 새 고용에 별도 허가가 필요할 수 있다는 문장으로 정리했다. 종료사업 창구는 현재 거류 만료 전 세 달, 계속사업·Gold Card는 만료 전 네 달로 명시했다. 중국대륙·홍콩·마카오 구별은 출생지 일반 대신 법적 주민 지위로 한정했다. 분실/훼손 증빙은 사건에 맞는 대안이며 경찰 신고를 공통 필수로 만들지 않는다.

## §5와 검증

첫 두 문단은 각각 30일 기산, 입국 경로의 차이, 카드 날짜보다 앞선 사유 소멸 질문으로 시작한다. 빈 예고·가상 의뢰인을 덧붙이지 않았다. 짧은 법적 제한·자료 확인 문장과 긴 조건 설명을 섞고, 학생·가족·이직 단락은 실질 주어로 연결했다. 704·705·706의 실질 결말은 발급 후 변경, 새 목적의 자격, 귀환일의 문서다. 같은 홍보 결말을 반복하지 않았다. 법적 부정과 출처는 보존하고 장식용 굵은 강조는 없다.

공유 `--lang nb` 최종 검사 세 편 FAIL 0, CV .453/.543/.476. 전체 21편 overlay 자동 내용 검사 오류 0이며 semantic status는 여전히 별도 검토를 요구한다. 원본에서 처음 발견한 오류를 숨기지 않고 `nb-independent.md`를 보존했다. 다른 에이전트가 전체 수정 diff와 최종 세 원고를 다시 확인한 `nb-independent-r2.md`에서 필수 지적 해결을 확인했다. 인간 원어민·변호사 감수나 실제 공개 확인으로 표시하지 않는다.

## 최종 SHA 및 실제 검사 출력

| 파일 | SHA-256 |
|---|---|
| 704-taiwan-arc-first-application.md | `43eae981b3999cf13b943e69d789dcea616ba7519bbcaa97b7b9aa8dffcf5251` |
| 705-taiwan-visa-residence-work-study-family.md | `12e38bdc71537107ea3667130075331efbc1c4f375ea424fa97a2f0309161571` |
| 706-taiwan-arc-renewal-changes-reentry.md | `fadba2c1f345db167feb99eae18e6f509d9fe419feb71bd13cf1af65d5d4bf03` |

```text
/Users/son7/tseng-all-language-columns-20261025/batch02/src/content/columns-nb/704-taiwan-arc-first-application.md [nb] sentences=67 mean=12.7 cv=0.453 short=0.284 run3=0.031 opener_rep=0.1 cite_end=0.0 cite_para=0.3 contrast=1 caveat=0 q=0
  OK — no variety limit violated
/Users/son7/tseng-all-language-columns-20261025/batch02/src/content/columns-nb/705-taiwan-visa-residence-work-study-family.md [nb] sentences=75 mean=13.7 cv=0.543 short=0.24 run3=0.068 opener_rep=0.083 cite_end=0.0 cite_para=0.5 contrast=0 caveat=0 q=1
  OK — no variety limit violated
/Users/son7/tseng-all-language-columns-20261025/batch02/src/content/columns-nb/706-taiwan-arc-renewal-changes-reentry.md [nb] sentences=92 mean=13.5 cv=0.476 short=0.261 run3=0.056 opener_rep=0.083 cite_end=0.0 cite_para=0.542 contrast=0 caveat=0 q=1
  OK — no variety limit violated
```


## Repository caption normalization — 2026-10-25

Root normalized the three fictional labels from `Fiktiv scene` to the exact existing Norwegian label `Oppdiktet scene`. Both mean a fictional scene; no factual image claim changed. Full exact diffs and pre/post SHA are in ../checks/nb-caption-normalization.json. Article bodies, FAQs, image alt text and references are byte-identical. The preceding independent semantic review binds the unchanged body; it is not relabeled as a new review of these caption hashes. Final build/browser checks will use the normalized version.
