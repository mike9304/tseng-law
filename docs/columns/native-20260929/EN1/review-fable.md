# EN1 최종검수 (Fable 5.1) — taiwan-exit-ban-foreigners (통합 시 032)

검수일 2026-09-29 10:58. 대상: draft.md(r2 반영 최종본), dossier.md, review-opus-r1/r2.md, CHANGES-r1.md.
방법: 조문은 전부 `curl -sL 'https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=…&flno=…'` 로 받아 태그 제거 후 원문 대조(WebFetch 요약 미사용). legal.judicial.gov.tw·egate·immigration.gov.tw·mojlaw는 브라우저 UA/Accept 헤더 붙인 curl로 HTTP 200 확인.

verdict: **APPROVE**

blocking: 없음 (0건)

## 재확인 결과 (본문 주장 전수)

| 본문 주장 | 출처(curl 원문) | 결과 |
|---|---|---|
| NIA는 사법기관 통지·재정/권책기관 법률상 통지 두 경우에 출국을 "應禁止", 查驗時 當場 서면 교부·이유 고지 | 入出國及移民法 §21 | 일치 |
| 출국금지 외국인 출국 방조 금지 / 1년 이상 7년 이하 징역 | §21-1 (1)(2), §72-1 (1) | 일치 (併科 100만 벌금은 본문 생략, 문제 없음) |
| 체류 만료 전 연장 신청(1항) / 거류 사유 소멸해도 §21(1) 출국금지자는 계속 거류 허가 가능(4항 8호) | §31 | 일치 |
| 查驗 시 暫時留置, 외국인 6시간 이내 | §64 (2) | 일치 |
| (참고) 逾期 과태료 1만~5만 | §74-1 (2) | 본문 미인용, 확인만 |
| 逕行限制出境 요건 3호·拘役/專科罰金 사건 제외·서면 5항목·6개월 내 통지·訊問 시 當庭 고지·서면 교부 청구 | 刑事訴訟法 §93-2 | 일치 |
| 偵查 8월, 20일 전 법원 청구, 연장 4월+2월(2회 한), 審判 每次 8월·累計 5년/10년, 연장 전 陳述 기회 | §93-3 | 일치 |
| 不起訴·緩起訴·無罪·免訴·免刑·緩刑·罰金 등 視為撤銷, 상소 중 계속 가능 | §93-4 | 일치 |
| 피고·변호인이 검사/법원에 撤銷·變更 聲請 | §93-5 | 일치 |
| 具保·責付·限制住居 시 함께 限制出境 가능, 93-2(2)·93-3~93-5 準用 | §93-6, §228 (4), §101-2 | 일치 |
| 抗告 대상(限制出境 명시)·10일·送達 기산·집행 부정지 | §404, §406, §409 | 일치 |
| 準抗告 10일, 處分日 또는 送達日 기산 | §416 (3) | 일치 |
| 개인 100만/영리사업 200만, 救濟 중 150만/300만, 負責人 제한, 보전조치 선행 但書, 서면·救濟 附記·送達, NIA 제한일부터 5년 한도, 해제 사유(완납·담보·撤銷·미달 등) | 稅捐稽徵法 §24 (3)(4) | 일치 |
| 救濟 중 금액에 罰鍰 불산입 / 2년 내 출국 8회 / 1년 내 연속 183일 / 보전조치 미실시 시 限制 불가 | 財政部 限制及解除欠稅人…出境規範 GL009873 第2·3·4점 | 일치 |
| 개인 1,000만(미확정 1,500만)·영리사업 2,000만(미확정 3,000만) 이상은 즉시 報請 가능, 行蹤不明 요소 | eTax Q&A 0320 | 일치 |
| 訴願 30일(達到 翌日 기산) → 행정법원 撤銷訴訟 | 訴願法 §14 (1), 行政訴訟法 §4 (1) | 일치 |
| 집행법원 擔保/限期履行 명령 요건 2호, 逃匿之虞 "或其他必要事由" 시 限制住居, 담보·사유소멸·집행완결 시 應解除, 채무자·유관기관 통지 | 強制執行法 §22 (1)(2)(3) | 일치 |
| 限制住居에 禁止出境 포함, 入出境管理機關 통지, 해제 시 동일 | 司法院 辦理強制執行事件應行注意事項 第11점(三) — legal.judicial.gov.tw FL001393, UA 헤더 curl HTTP 200 (242,906 bytes) 원문 확인 | 일치 |
| 聲明異議는 집행 종료 전, 집행 부정지 | 強制執行法 §12 | 일치 |
| 법인 負責人·독자상호 經理人 적용, 解任 후에도 재직 중 사유면 가능 | §25 (2)(4)(3) | 일치 |
| 行政執行處 限制住居 사유, 10만 미만 불가·출국 2회 예외 | 行政執行法 §17 (1)(2)(1) | 일치 |
| 限制住居에 出境·出海 포함(실무), 조세 출국금지와 별개·연동 해제 불가 | 法務部行政執行署 §17 해석례 목록(mojlaw FL000565, HTTP 200): "限制出境，依其性質，係執行限制住居方法之一種", "二種限制出境規範的案件範圍不同…尚不得比附援引" | 일치 |
| 聲明異議 집행기관에, 원칙 집행 부정지 | 行政執行法 §9 | 일치 |
| 온라인 조회: 統一證號+護照號碼+自然人憑證(카드/行動) | egate personVoucherForeign (HTTP 200) 화면 문구 | 일치 |
| 외국인 서비스站 본인/위임 조회, 무료, 평일 08:00–17:00, 타인 조회는 위임 없이는 불가 | immigration.gov.tw 16511 (HTTP 200) | 일치 |
| 1990 외국인 생활상담 핫라인 | immigration.gov.tw/5475 "Foreigners In Taiwan Hotline : Domestic 1990" | 일치 |
| 法扶는 합법 거주 외국인에게 적용 | 法律扶助法 §14 (1)(1) | 일치 |
| 내부 링크 `/en/columns/taiwan-police-questioning-foreigner-rights` | 이 워크트리 `src/content/columns-en/033-taiwan-police-questioning-foreigner-rights.md` 실존 | 유효 |

Opus r1 P0-1·P1-1·P1-2·P1-3, r2 P2 1–5 모두 최종본에 반영된 것을 본문에서 확인했다(注意事項 11(3) 링크·해제 3사유·§12, 93-2/93-6 두 경로, §31 1항/4항 8호 구분·§72-1, "Three points", §25 단일 문장, 行政執行法 문장 분리, "does not rule out a ban in every case", "Photograph that notice").

## 직접 수정한 표현 (draft.md, 사실 변경 아님)

1. §21(2) 원문 "當場以書面交付當事人，並告知其禁止出國之理由"에 맞춤
   - before: `…it must hand you a written notice on the spot stating why.`
   - after: `…it must hand you a written notice on the spot and tell you the reason.`
2. §93-2(1)(3) "勾串共犯或證人" — 공범 누락 보완
   - before: `…destruction of evidence or collusion with witnesses.`
   - after: `…destruction of evidence or collusion with co-defendants or witnesses.`
3. §24(4)(3) 但書(일부 撤銷 후 잔액이 기준 이상이거나 재산 은닉 징후면 해제 안 함)를 감안한 헤지
   - before: `if the underlying assessment is set aside in an appeal, if the ban has run five years,`
   - after: `if the underlying assessment is set aside in an appeal (subject to exceptions), if the ban has run five years,`

수정 후 본문 1,847 words(한도 1,900). summary 155자·줄임표 없음, title+" | Hovering Law" 76자 → seoTitle 42자·seoTitle+접미 57자(테스트 `column-seo-title-frontmatter.test.ts` 기준 ≤60, ≥30, title과 다름) 충족. 공식 링크 10개, 내부 링크 1개, 금지어·em dash·굵은 글씨·불릿·1인칭 본문 0건. frontmatter 순서 BRIEF와 동일(`published`는 033에서 이미 쓰이고 `columns.ts:376`이 파싱).

## non-blocking (발행 후 개선 가능·통합 단계 사항)

- 통합 시 파일명·`featured_image` 경로를 `032-taiwan-exit-ban-foreigners`로 갱신하고(현재 024), `column-summary-frontmatter.test.ts`·`column-seo-title-frontmatter.test.ts`의 `toHaveLength(23)`을 총괄이 조정할 것. NOTES.md는 낡음(지시대로 무시).
- §64는 "有事實足認…" 사유가 있을 때의 留置이며 본문은 "may hold a person…to investigate"로 충분히 조건부다. 추가 수정 불필요.
- "Under Article 64 of the same Act" 문단이 한 문장짜리로 짧다. 문체상 앞 문단에 붙여도 되지만 현 상태도 자연스러워 두었다.
- 조세 해제 사유 중 "confirmed amount falls below the threshold"는 §24(4)(4) "經行政救濟及處罰程序終結" 후 기준이라는 조건이 생략되어 있으나 독자 불이익 방향이 아니므로 유지.
- 행정집행 "in its practice that includes an exit ban"의 근거(行政執行署 해석례)는 본문에 링크가 없다. 링크 10개 한도 때문이며, dossier에 URL이 있으니 문의 시 제시 가능.

재확인한 주장 수 28 / 공식 출처 수 14 (law.moj.gov.tw 8개 법령 27개 조문 LawSingle 원문, 財政部 GL009873, eTax 0320, 司法院 FL001393, 法務部 mojlaw FL000565, NIA egate·16511·5475)
