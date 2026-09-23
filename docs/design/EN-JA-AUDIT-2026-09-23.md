# EN·JA 라이브 감사 — 2026-09-23 (GOAL-EN-JA-2026 G1)

라이브 tseng-law.com, 1440/390 실측. 원자료·스크린샷은 로컬 `.design-audit/{en,ja}-audit/`(git 제외). 두 감사 모두 읽기 전용.

- Part A: EN (22건)
- Part B: JA (31건)

---

# Part A — EN


- 대상: https://tseng-law.com/en/* (라이브). 읽기 전용 감사로, 레포와 사이트는 수정하지 않았다.
- 측정: Playwright(chromium-1234), 1440×900과 390×844(DPR1, mobile UA), locale en-US, TZ America/New_York.
  - EN 페이지 46개 전수 스캔: sitemap의 `/en` 44개에 `/en/faq`(sitemap 누락)와 `/en/taiwan-debt-recovery-lawyer`(noindex)를 더했다.
  - 스크린샷 22개 표면 × 2개 뷰포트: 풀페이지와 fold.
- 스크립트:
  - `audit.mjs`: 전수 스캔(한글·CJK·Korea 언급·오버플로·잘림·대비·CTA·폼·메타)
  - `fold.mjs`: 새로고침 직후 첫 화면과 fold CTA
  - `probe*.mjs`: 개별 확인
  - 링크 검사: `linkcheck.json`, `ext-nonok.txt`
- 산출 위치: `/Users/son7/projects/tseng-law/.design-audit/en-audit/`
  - `data/*.json`: 페이지×뷰포트 원자료
  - `text/*.txt`: 1440 innerText
  - `shots/`
- 페르소나:
  - **P1**: 미국 중견 제조사(반도체 부품) 법무·운영 담당. 대만 자회사·공급계약을 검토 중(E2).
  - **P2**: 타이베이 거주 미국인(Gold Card). 고용분쟁·이혼·상속(E1).
  - **P3**: 대만 거래처 미수금이 있는 영어권 SME 대표(E2).
- "새 사실 필요" 열 표기:
  - `—`: 기존 ko/en/zh 원문의 사실을 재배치하거나 카피·디자인만 바꾸면 되는 제안.
  - `[변호사/사용자 확인 필요]`: 공개 전에 사실 확인이 있어야 하는 제안.

---

## 요약: 상위 10개 문제 (영향 큰 순서)

1. **(P0) EN 사이트 전체가 "대표 변호사는 영어를 직접 하지 않는다"고 먼저 말한다.**
   - 문구: "Attorney Wei Tseng works with clients directly in **Korean, Chinese, and Japanese**."
   - 노출 위치: 홈 히어로 첫 문단, 프로필, 팀 페이지("CONSULTATION LANGUAGES: Korean, Chinese, Japanese"), 인텐트 랜딩 3종, 미수금 랜딩.
   - 미수금 랜딩에는 방어적인 문장이 더 붙어 있다: "English consultation at the office is not the same as a claim that every attorney personally handles every matter in English."
   - 제목이 "Hovering **English** Team"인 팀 페이지에도 영어 담당자가 한 명도 표시되지 않는다.
   - 결과: P1·P2·P3 모두 "누가 나와 영어로 얘기하나?"라는 질문에 답을 얻지 못하고 이탈한다.
2. **(P0) 공개 페이지에서 링크된 미수금 페이지에 "미공개 초안" 문구가 노출된다.**
   - 문구: "This English draft is for local unpublished review. Service-scope, language, and legal wording require attorney review before any public release."
   - `/en/taiwan-debt-recovery-lawyer`는 noindex지만, `/en/taiwan-litigation-lawyer`(링크 2개)와 `/en/services/civil`에서 보이는 링크로 연결된다.
   - P3에게 유일한 "collections" 진입점이면서, 신뢰와 광고규정 양쪽에 위험하다.
3. **(P1) 홈의 유일한 사례와 신뢰 수치가 한국 중심이다.** 해당 요소:
   - 사례 "Korean Student Gym Injury Case"
   - About 문단 "Represented a Korean student…"
   - 통계 "2 Top-Level Language Qualifications (TOPIK 6, JLPT N1)"
   - 홈 전폭 "Korea Office" 카드(한국 휴대폰 번호, Naver Map)
   - FAQ "What procedures does a **Korean national** need for divorce in Taiwan?"

   미국 방문자에게 이 사이트는 "한국인을 위한 대만 로펌"으로 읽힌다.
4. **(P1) E2(미국 기업)의 핵심 과업이 정보 구조에 드러나지 않는다.**
   - `/en/services` 카드 6개에 "Contracts / Collections" 카드가 없다.
   - 반도체 공급사 랜딩은 푸터 "Popular topics"로만 1클릭 도달한다.
   - 미수금 랜딩은 홈에서 2클릭이고 초안 상태다.
   - 히어로 경로 버튼은 "Set up / Resolve a dispute" 2개뿐이다.
5. **(P1) 다크 CTA 박스 안의 링크가 보이지 않는다(대비 1.0:1).** 배경과 글자가 같은 색 `rgb(22,46,36)`이다.
   - 가이드 `/en/guides/taiwan-company-setup`의 "Email wei@hoveringlaw.com.tw"
   - 미수금 랜딩의 "Explore Other Civil Litigation Services · Back to Taiwan litigation guidance"
6. **(P1) 전화·시간대·응답 기대치가 없다.**
   - Taipei 사무소는 전화번호가 없다. 원본에서도 "Taipei publishes no phone"으로 되어 있다.
   - 타 사무소 번호는 국내형(`04-2326-1862`)이라 미국에서 그대로 걸 수 없다.
   - 사무소 시간대(Taipei, GMT+8), US 시간대 화상상담 가능 여부, 첫 회신 기한은 어디에도 없다.
   - 홈 CTA는 "Talk to us **now**" / "We **quickly** route…"라고 약속하는데 근거가 없다.
7. **(P1) 수임료가 NT$로만 표기되고 해외 결제 안내가 없다.**
   - `/en/pricing`에는 NT$3,000/1h, NT$50,000(설립), NT$50,000/yr만 있다.
   - USD 참고 환산, 결제수단(해외송금·카드), 화상상담 요금 동일 여부가 없다.
8. **(P2) SEO·내부 라벨이 사용자에게 노출된다.**
   - 프로필 "COMMON SEARCH TOPICS" 칩: "Taiwan lawyer for Korean clients" 등
   - 프로필 문장: "Attorney Wei Tseng's identity is corroborated across … Naver Blog"
   - 랜딩 eyebrow "SEARCH GUIDE"
   - 가이드 eyebrow "INFORMATION GUIDE"
   - 푸터 "Real Estate & Construction": `/en/services#real-estate`로 가지만 빈 alias span(높이 0)이라 해당 서비스가 없다.
9. **(P2) 홈 히어로 CTA 계층이 흐리다.**
   - 첫 화면에 동급에 가까운 행동 유도가 6개 있다: 아웃라인 2, 텍스트링크 1, 프라이머리 1, 아웃라인 1, 텍스트링크 1.
   - 신뢰 신호(대만 변호사, Google 5.0·17 reviews, 화상상담)는 fold 아래 사무소 카드에만 있다.
   - 390에서는 헤더 CTA가 사라지고, 서브페이지 대부분이 fold 안에 CTA 0개다.
10. **(P2) 문의 폼·연락 페이지가 다국어 공용 폼이라 영어 사용자에게 군더더기가 많다.**
    - "Language you are writing in"(placeholder: Vietnamese, Indonesian, Thai…)
    - 4개 언어 안내 문단이 같은 페이지에 2회 중복된다.
    - "What You Can Ask by Email: … Litigation and dispute booking / Official email intake"는 어색한 직역이다.
    - 회사명·국가/시간대·사안 유형 필드가 없다.
    - 전송 후 기대치 안내가 없다.

자동 스캔 결론(아래 상세):
- 실제 한글 잔존 0. 언어 스위처의 endonym "한국어"와 상담언어 옵션 "Korean (한국어)"는 정상이다.
- 가로 오버플로 0/92.
- 내부 `/en` 링크 49개 전부 200.
- 실제 대비 결함 2종. 1.0:1 링크와 12px 배지 3.62:1이다.
- 콘솔 오류 1건(React #418 hydration, 칼럼 1개, 1회).

---

## 상세 표

| ID | 심각도 | 페르소나 | 표면(URL·뷰포트) | 문제 | 증거 | 원인 추정 file:line | 제안(문구 초안 포함) | 새 사실 필요 |
|---|---|---|---|---|---|---|---|---|
| EN-01 | P0 | P1·P2·P3 | `/en` 히어로(1440·390), `/en/lawyers/wei-tseng`, `/en/lawyers`, `/en/taiwan-lawyer`, `/en/taiwan-company-setup-lawyer`, `/en/taiwan-litigation-lawyer`, `/en/taiwan-debt-recovery-lawyer` | 영어 방문자에게 첫 문장부터 "변호사 본인은 영어를 하지 않는다"로 읽힌다. 팀 페이지("Hovering English Team")에도 영어 담당자가 표시되지 않는다 | 히어로 인용: "Office consultations are available in English… Attorney Wei Tseng works with clients directly in Korean, Chinese, and Japanese." `/en/lawyers` "CONSULTATION LANGUAGES: Korean, Chinese, Japanese". 미수금 페이지: "English consultation at the office is not the same as a claim that every attorney personally handles every matter in English." 스샷 `shots/fold_en-1440.jpg`, `shots/fold_en_lawyers_wei-tseng-1440.jpg`. ko/zh 원문(attorney-profiles.ts:103,174)도 같은 사실이다(변호사 직접=ko/zh/ja, 영어=사무소 상담) | `src/data/en-service-scope.ts:6`; `src/data/attorney-profiles.ts:214,249,263`; `src/data/intent-pages.ts:696,790,881`; `src/app/[locale]/taiwan-debt-recovery-lawyer/content.ts:139`; `src/data/team-name.ts:25` | (a) 부정형 문장을 EN 히어로와 랜딩에서 빼고, 긍정형 사무소 사실로 대체한다: "**English-language consultations** — in person in Taipei or by video (Zoom / Google Meet)." (b) 변호사 언어는 프로필에만 둔다: "Attorney Wei Tseng also works directly in Chinese, Japanese and Korean." (c) 영어 상담을 누가 어떻게 진행하는지(담당자 또는 통역 체계)를 팀 페이지에 이름으로 명시한다. (d) 미수금 페이지의 방어 문장은 삭제한다 | (a)(b)(d) — / (c) **[변호사/사용자 확인 필요: 영어 상담 실제 담당자·방식]** |
| EN-02 | P0 | P3·P1 | `/en/taiwan-debt-recovery-lawyer`(1440·390). 유입: `/en/taiwan-litigation-lawyer` 링크 2개, `/en/services/civil` 링크 1개 | "미공개 초안·변호사 검수 전" 문구가 공개 페이지에 노출된다. noindex지만 보이는 내부링크로 도달한다 | 인용: "This English draft is for local unpublished review. Service-scope, language, and legal wording require attorney review before any public release." `<meta name="robots" content="noindex, nofollow">`. 링크 그래프상 홈에서 2클릭, 보이는 inlink 3개(`links.txt`) | `src/app/[locale]/taiwan-debt-recovery-lawyer/content.ts:35`; 링크 원천 `src/components/CivilCommercialBlock.tsx:12`, `src/components/IntentLandingPage.tsx:343,592` | 선택지 둘. ① 변호사 검수 완료 전까지 두 링크를 숨기고, 기존 검수본인 `/en/services/civil`과 `/en/taiwan-litigation-lawyer`로 유도한다. ② 검수 후 초안 문구를 제거하고 공개한다. 동시에 `organise/enquiry`(영국식)를 `organize/inquiry`(미국식, 사이트 다른 곳과 통일)로 바꾼다 | ② 공개는 **[변호사 검수 필요]** (GOAL 하드룰) |
| EN-03 | P1 | P1·P2·P3 | `/en` 1440·390(About, Case Study, 통계, FAQ, Offices) | 홈의 신뢰 요소가 한국 중심이다. 유일한 사례가 "Korean Student", 통계가 TOPIK·JLPT, 전폭 Korea Office 카드(+82 휴대폰·Naver Map), FAQ가 "Korean national" 이혼 | 스샷 `shots/seg-_en-1440-01.jpg`, `-02.jpg`, `-04.jpg`. home Korea 언급: 보이는 것 11건(`data/_en-1440.json` `.korea`) | `src/data/site-content.ts:2242`(case title), `:2015`(통계 라벨); `src/data/team-members.ts:218`; `src/components/OfficeMapTabs.tsx:64,178`(Korea office); `src/data/faq-content.ts:201` | 사례는 사실은 유지하고 국적을 헤드라인에서 뺀다: "**Gym Injury Claim — TWD 1.57M First-Instance Ruling, Settled on Appeal**". 본문은 "A university student…"로, 국적은 칼럼 상세에 남긴다. 통계 4번째는 "2 languages certified at the highest level"을 빼고 이미 있는 사실로 교체: "**Video consultations** · Zoom / Google Meet". Korea Office 카드는 EN에서 접힘/보조 링크로 강등한다("Also: liaison office in Korea →"). FAQ 질문은 "What are the divorce procedures in Taiwan for a foreign national?"으로 바꾼다. 답변 사실은 동일하게 유지하고 국적 일반화가 법적 서술을 바꾸는지만 확인한다 | 사례·통계·Korea 카드 — / FAQ 일반화는 **[변호사 확인 필요: 답변이 한국인 한정 사실을 포함하는지]** |
| EN-04 | P1 | P1·P3 | `/en/services`, `/en` 히어로 경로, 푸터 | E2의 "entity setup / contracts / collections / employment" 중 contracts·collections가 서비스 목록에 없다. 반도체 공급사 랜딩은 푸터에서만, 미수금은 2클릭(초안) | 링크 BFS(`links.txt`): semiconductor-supplier dist 1(푸터 "Popular topics"만), debt-recovery dist 2, `/en/semiconductor` dist 2. `/en/services` 카드: Investment·Civil·Family·Labor·Criminal·IP. 계약검토는 카드 밑 한 줄 텍스트("Taiwan Corporate Legal Advisory — Contract review…") | `src/data/site-content.ts`(EN services 목록), `src/data/en-international-paths.ts:14,24`, 홈 경로 버튼(DS1-C 레인 소유 — GOAL Open 참조) | ① 홈 히어로 아래에 "**For overseas companies**" 줄을 추가한다. 링크 4개: "Set up a Taiwan entity" → `/en/taiwan-company-setup-lawyer` · "Review a supply contract" → `/en/taiwan-lawyer#corporate-advisory` · "Hire staff in Taiwan" → `/en/services/labor` · "Semiconductor suppliers" → `/en/taiwan-semiconductor-supplier-legal`. ② `/en/services`에 "Corporate Advisory & Contracts" 카드를 추가한다(기존 corporate-advisory 문구 재사용). ③ Collections 링크는 EN-02 해결 후 추가 | ①② — / ③ EN-02 선결 |
| EN-05 | P1 | 전원 | `/en/guides/taiwan-company-setup`(1440·390), `/en/taiwan-debt-recovery-lawyer` | 다크 CTA 박스 안 보조 링크가 보이지 않는다(대비 1.0:1) | probe: `color rgb(22,46,36)` on `bg rgb(22,46,36)`. 스샷 `shots/probe-guide-link-8.jpg`, `shots/probe-debt-link-1.jpg`(버튼 아래 점 하나만 보임) | `src/app/[locale]/guides/taiwan-company-setup/guide.module.css:252` (`.relatedLink{color:var(--navy)}`)를 `.cta{background:var(--navy)}`(:264) 안에서 사용. 사용처 `guides/taiwan-company-setup/page.tsx:283`, `taiwan-debt-recovery-lawyer/page.tsx:155,159` | `.cta .relatedLink { color:#fff; }` 등 CTA 컨텍스트 전용 색. 목표 대비 ≥4.5:1 | — |
| EN-06 | P1 | P1·P3(미국 거주), P2 | `/en/contact`, `/en` 사무소·CTA, 전 페이지 | 전화 없음(Taipei), 국제형 번호 없음, 시간대·상담 가능 시간·첫 회신 기대치 없음. 대신 "Talk to us now", "We quickly route" 같은 근거 없는 긴급성 문구 | contact 텍스트: Taichung "Tel: 04-2326-1862"(국내형). Taipei 전화 없음. 스캔 `tz`·`resp` 결과 0건. 레포 테스트 `src/lib/consultation/__tests__/public-contact-growth.test.ts:103`가 "within N/business day" 문구를 의도적으로 금지 | `src/data/office-locations.ts:77,86,95`(국내형 표기), `:128`("Taipei publishes no phone"); `src/data/site-content.ts:2502`, `src/lib/builder/canvas/decompose-contact.ts:44`("We quickly route") | ① EN 표시만 E.164로 바꾼다: "+886 4 2326 1862". 같은 파일 `:153`에 이미 `+886-4-2326-1862`가 있다. ② "Office time zone: Taipei (GMT+8). Video consultations by appointment." ③ "We quickly route…"를 "Every inquiry is read by the firm before a consultation is scheduled."로 바꾼다(contact 기존 문구 "An attorney reviews what you send before the next step" 재사용). ④ US 업무시간 대응과 회신 기한은 확정되면 추가한다 | ①②③ — / ④ **[사용자 확인 필요: US 시간대 상담 가능 여부·회신 기한]**, Taipei 전화 공개 여부도 사용자 결정 |
| EN-07 | P1 | P1·P3 | `/en/pricing`(1440·390) | NT$만 표기. USD 참고치·해외 결제수단·화상 동일요금 여부가 없다 | 스샷 `shots/fold_en_pricing-390.jpg`. 스캔 money: NT$ 3,000 / 50,000 / 50,000만. "Exact fees will be provided in writing after the initial consultation." | `src/data/site-content.ts`(EN pricing 블록) | 카드마다 "NT$3,000 / hour (≈ US$__; indicative, billed in NTD)". 요금 문단 아래: "Payment from overseas: ___". 화상상담 적용 여부 표기("Same fee in person or by video" — 카드에 이미 "In-person or video consultation"이 있으므로 문장화만 한다) | USD 환산·결제수단 **[사용자 확인 필요]**. 화상 동일요금 문장 — |
| EN-08 | P2 | P1 | `/en/lawyers/wei-tseng`(1440·390), `/en/taiwan-semiconductor-supplier-legal`, `/en/taiwan-lawyer`, `/en/guides/taiwan-company-setup`, 푸터 | SEO·내부 라벨이 UI에 노출되어 광고성이나 기계적 느낌을 준다 | 프로필 텍스트: "COMMON SEARCH TOPICS / Taiwan lawyer for Korean clients / Wei Tseng company setup lawyer". "Attorney Wei Tseng's identity is corroborated across the Hovering profile, personal site, YouTube channel, and Naver Blog." eyebrow "SEARCH GUIDE"(스샷 `shots/fold_en_taiwan-semiconductor-supplier-legal-1440.jpg`). 푸터 "Real Estate & Construction" → `#real-estate`가 `span.services-anchor-alias` 높이 0(probe3) | `src/data/attorney-profiles.ts:247`(searchTerms 렌더), `:252`; `src/data/intent-pages.ts:688,967`; `src/data/site-content.ts:1813`(푸터), `:2376`("In Preparation") | searchTerms 칩은 EN에서 숨기고 메타에만 쓴다. "identity is corroborated" 문장은 "**Also on:** Hovering firm profile · YouTube (WEI Lawyer)"로 바꾼다. EN에서 Naver Blog는 후순위로 둔다. eyebrow는 "FOR SEMICONDUCTOR SUPPLIERS" / "COMPANY SETUP GUIDE"로 바꾼다. 푸터 Real Estate 링크는 EN에서 제거하거나 "Contracts & Corporate Advisory"로 교체한다 | — |
| EN-09 | P2 | 전원 | `/en` 히어로 1440·390, 서브페이지 390 | CTA 계층이 흐리다. 히어로 fold 안에 CTA 6개가 동급으로 있다. 신뢰 신호는 fold 밖. 390 서브페이지는 fold 안 CTA 0 | `fold.json`: `/en` 1440 foldCtas 4개 + 텍스트링크 2개. 390에서 `/en/services`, `/en/services/investment`, `/en/lawyers`, `/en/lawyers/wei-tseng`, `/en/pricing`, `/en/columns`, `/en/guides/…`, `/en/taiwan-debt-recovery-lawyer`의 foldCtas가 `[]`. 390 헤더에는 검색·메뉴만 있고 Email 버튼 없음(`shots/fold_en_pricing-390.jpg`). Google "5.0 · 17 reviews"는 홈 사무소 카드에만(`seg-_en-1440-04.jpg`) | 홈 히어로 컴포넌트(DS1-C 레인 소유: globals.css `.hero … .en-home-paths` — GOAL Open 레인 주의) | 1차 = "Request a consultation"(프라이머리 1개), 2차 = 경로 버튼 2개, 나머지("Services", "View Insights", "Read the Company Setup Guide")는 제거하거나 한 줄 텍스트 링크로 둔다. 히어로 아래 trust strip(기존 사실만): "Taiwan-licensed attorneys · Taipei office + 3 Taiwan offices · English consultations in person or by video · Google 5.0 (17 reviews)". 390은 sticky 하단 "Email us" 바 또는 헤더 아이콘 버튼 | trust strip — (리뷰 수는 라이브 데이터 동기화 필요). 레인 조율 필요 |
| EN-10 | P2 | P1·P2·P3 | `/en/contact`(1440·390) | 다국어 공용 폼과 중복·직역 문구 | 폼 필드(`probe.mjs`): name, email, originalLanguage(placeholder "For example: Vietnamese, Indonesian, Thai, Filipino…"), preferredConsultationLanguage, originalText, consent. 전 필드 `required=false`. 4개 언어 안내 문단이 상단과 폼 안에 2회. "What You Can Ask by Email: … Litigation and dispute booking / Official email intake". "Business & Investment / Media / Recruitment / General" 4행 전부 같은 이메일. 스샷 `shots/seg-_en_contact-390-00.jpg`, `-01.jpg` | `src/components/MessengerChatSection.tsx:44`; contact 폼 `InternationalInquiryForm`; `src/data/contact-page-content.ts` | EN에서는 "Language you are writing in"을 숨기고 기본값을 English로 둔다. 선택 필드를 추가한다: "Company (optional)", "Country / time zone (optional)"(두 항목 모두 이미 mailto 템플릿에 있음), "Matter type: Company setup / Contract / Unpaid invoice / Employment / Family / Other". 중복 문단은 1회로 줄인다. "Litigation and dispute booking"은 "Litigation and disputes"로, "Official email intake"는 삭제한다. 4개 문의유형 행은 "One inbox for all inquiries: wei@…" 한 줄로 합친다. 전송 버튼 아래: "After you send: the firm reviews your summary and replies by email to discuss next steps and the consultation fee (NT$3,000/hour)." | 회신 기한 문구는 **[사용자 확인 필요]**. 나머지 — |
| EN-11 | P2 | P2 | `/en/services/family` | 가사 서비스 첫 문장이 한국 전제 | 인용: "As Korea-Taiwan marriages increase, disputes on divorce, custody, and inheritance are growing." | `src/data/service-details.ts:126` | "Cross-border marriages bring divorce, custody, and inheritance questions that involve more than one country's law. We combine Taiwan family procedure with private international law analysis…" (후반부는 원문 유지) | — (통계적 주장 "increase"를 빼므로 새 주장 아님) |
| EN-12 | P2 | P1·P2 | `/en/lawyers`(1440·390) | 팀 페이지 제목 "Hovering English Team"인데 영어 담당자가 없고, 역할 "Korea Operations Manager", "Coordinates … for Korean clients"가 전면에 나온다. 대표 변호사 카드의 소개 2줄 중 1줄이 한국 학생 사건 | `text/_en_lawyers.txt` | `src/data/team-name.ts:25`; `src/data/team-members.ts:218` | 제목은 "Our Team"(네비와 동일)으로 바꾼다. 대표 소개 2번째 줄은 기존 프로필 사실로 교체: "Advises overseas companies on Taiwan company setup, investment, contracts and employment." 한국 담당 매니저는 EN에서 순서를 뒤로 둔다 | — (영어 담당자 표기는 EN-01(c)) |
| EN-13 | P2 | P1 | `/en/lawyers/wei-tseng`, 전 페이지 | 자격 신호가 약하다. "qualified Taiwan attorney"만 있고 소속 변호사회·등록 정보가 없다. 미국 법무팀은 확인 가능한 등록 근거를 찾는다 | `/en/lawyers` Key Facts: "Attorney Wei Tseng is a qualified Taiwan attorney and the managing attorney…". src 전체 grep `Bar Association|律師公會|admission` 0건 | `src/data/attorney-profiles.ts`(EN block ~200–270) | "Licensed to practice in Taiwan (member, ___ Bar Association, since ___)" 한 줄과 공개 조회 링크 | **[변호사 확인 필요]** |
| EN-14 | P2 | 전원 | `/en` 홈 CTA 섹션, contact | 개인정보·비밀유지 안내가 "민감정보 보내지 말라"는 금지형뿐. 비밀유지·이해충돌 확인 안내가 없다 | contact 인용: "Please exclude sensitive information." / "Do not send passport or identification numbers…" | `src/data/contact-page-content.ts` | 긍정형 한 줄 + 링크: "How we handle what you send → Privacy Policy". 비밀유지 의무 문구는 변호사 확인 후에 쓴다 | 링크 — / 비밀유지·이해충돌 문구 **[변호사 확인 필요]** |
| EN-15 | P2 | P1·P3 | 칼럼 11개(`/en/columns/*` 고정 blockquote), `/en/taiwan-company-setup-lawyer`, `/en/korean-lawyer-in-taiwan` | 영어 칼럼 끝 관련 링크에 "Korean-Speaking Taiwan Lawyer"가 고정된다. `/en/korean-lawyer-in-taiwan`이 EN sitemap에 있고 inlink 11개 | Korea 스캔: advanced-1, advanced-2, gym-injury 등 blockquote `a.link-underline` "Korean-Speaking Lawyer in Taiwan". BFS inlinks(vis)=11 | 칼럼 공통 관련링크 컴포넌트(확인 필요: `src/lib/column-post.ts` 또는 칼럼 렌더러) | EN 칼럼 고정 링크를 E1/E2 경로로 교체한다: "English-language consultation in Taipei" → `/en/taiwan-lawyer`, "Company setup for overseas businesses" → `/en/taiwan-company-setup-lawyer`. 한국어 화자 랜딩은 사이트맵에는 남기고 본문 고정 노출만 뺀다 | — (정확한 렌더 위치는 확인 필요) |
| EN-16 | P2 | P1 | `/en` Case Study → "View Case Studies →" | 링크가 칼럼 목록 전체(`/en/columns`)로 간다. "사례" 기대와 어긋난다 | home links: "View Case Studies →" → `/en/columns` | `src/components/HomeCaseResultsSplit.tsx:68` 주변 | 기존 사례 칼럼으로 연결하고 라벨을 바꾼다: "Read the case write-up →" → `/en/columns/taiwan-gym-injury-lawsuit` | — |
| EN-17 | P3 | P1 | 헤더 전 페이지 | 공개 헤더의 "Log in"과 "Media Center"(실제 Videos)는 미국 B2B 방문자에게 목적이 불명확하다. "Contact / Offices / Locations"가 중복된다(Offices와 Locations 모두 `/en/contact#offices`) | home links 목록 | 헤더 nav 데이터 `src/data/site-content.ts`(EN nav) | "Media Center"는 "Videos"로 바꾼다. "Locations"와 "Offices" 중 하나를 제거한다. "Log in"은 EN 공개 헤더에서 푸터로 옮긴다 | — (로그인 용도는 사용자 확인) |
| EN-18 | P3 | 전원 | EN 전 페이지 제목·본문 | EN이 Noto Serif KR / Noto Sans KR 쌍을 사용한다(의도적: fonts.ts 주석). 라틴 글리프 품질 결함은 스샷상 관측되지 않음 | fold.json h1Font `52px "Noto Serif KR"`, bodyFont `"Noto Sans KR"` | `src/app/fonts.ts:23`("EN intentionally shares the KR pair"), `:43` | 영향이 작아 유지를 권한다. 페이로드 절감이 필요하면 EN만 latin subset serif로 분리하는 방안 검토 | — |
| EN-19 | P3 | P1 | `/en/taiwan-semiconductor-supplier-legal` 1440 | H1이 5줄(52px, 문장형 대문자)이고 우측 절반이 빈 공간. 중복 문장: 리드 끝 "Consultations are in English, Chinese, Korean, and Japanese." 직후 같은 내용 한 줄 더 | fold.json h1Top 277 → h1Bottom 578. 스샷 `shots/fold_en_taiwan-semiconductor-supplier-legal-1440.jpg` | `src/data/intent-pages.ts`(semiconductor 항목) | H1 단축: "**Taiwan Legal Counsel for Semiconductor Suppliers**". 리드의 언어 문장을 삭제하고 아래 라벨 한 줄만 남긴다 | — |
| EN-20 | P3 | 전원 | EN 43개 페이지 `<title>` | 35개가 66–115자라 SERP에서 잘린다 | `data/*-1440.json` `.title` 길이. 예: semiconductor-supplier 115자, 칼럼 대부분 90–104자 | 각 페이지 메타(`src/data/intent-pages.ts`, 칼럼 frontmatter) | 60자 이내로 줄이고 브랜드 접미사는 "| Hovering Law"로 줄인다 | — |
| EN-21 | P3 | P2 | 홈·About `/en/about` | 홈 About 문단이 사실 나열형("The firm supports…", "Represented…", "With experience…") | `text/_en.txt` | `src/data/team-members.ts:218` 등 | 스캔 가능한 3불릿: "English consultations in Taipei or by video / Company setup, contracts, employment and disputes / Legal commentary for SBS News; WEI Lawyer channel" | — |
| EN-22 | P3 | — | `/en/columns/taiwan-inheritance-custody-analysis` 1440 | React hydration 오류 #418 1회(390 재현 안 됨) | `data/_en_columns_taiwan-inheritance-custody-analysis-1440.json` `.errors` | 확인 필요 | 재현 후 서버/클라이언트 불일치 텍스트(날짜 포맷 등) 추적 | — |

---

## 자동 스캔 결과

기준: 46개 경로 × 2 뷰포트 = 92개 측정(`data/*.json`). 네 가지 스캔 모두 skip-intro 후 300px 단위 느린 스크롤로 리빌을 트리거한 뒤 수행했다.

### 한글 잔존 (U+AC00–D7AF, 자모 포함)

- 텍스트 노드:
  - 모든 페이지에 1건씩 있다. 언어 스위처의 "한국어"(endonym, 정상).
  - `/en/contact`에 1건 더 있다. 상담언어 select 옵션 "Korean (한국어)"(정상).
- 속성(alt/aria-label/title/placeholder): **0건**.
- 결론: **실제 잔존 0건.**
- 참고: 외부 링크 URL "View on Naver Map"은 한글 쿼리를 인코딩한 것이다. 화면에 보이지 않는다.

### "Korea/Korean" 언급 (G3 대상)

- 스캔한 EN 페이지 대부분에 있다(칼럼 포함). 페이지별 목록은 `data/*.json`의 `.korea` 필드에 있다.
- **전환 표면에서 제거·재배치할 대상**:

  | 표면 | 보이는 언급 수 |
  |---|---|
  | `/en` | 11 |
  | `/en/lawyers/wei-tseng` | 9 |
  | `/en/lawyers` | 5 |
  | `/en/services/family` | 1 |
  | `/en/services/civil` | 2 |
  | 인텐트 랜딩 | 각 1~2 |

- **정당한 맥락(유지 가능)**:
  - 한·대 조세조약 칼럼
  - 마사지 비교법 칼럼
  - 퇴직금 비교 칼럼
  - 가이드 `/en/guides/taiwan-company-setup`의 "Korea: …" 국가별 섹션

  이 섹션들은 "country-specific"으로 라벨링되어 있다.

### 오버플로·잘림

- 문서 가로 오버플로: **0/92**. `docOverflow=0`.
- 요소 오버플로:
  - 모든 페이지 1건씩 = `a.skip-link`(left:-999, 의도된 숨김).
  - 실제 결함 0.
- 텍스트 잘림(ellipsis·hidden): `/en/videos`의 "Pause video" 라벨 1건. 아이콘 버튼 내부 라벨로 보이며 **확인 필요**.
- 헤딩 위도우(마지막 줄 18% 미만): 홈 0건.

### 대비 (WCAG AA, 단색 배경 기준 근사)

- 실결함:
  - EN-05의 1.0:1 링크 3개.
  - `span.blog-category-badge` 12px 3.62:1: 칼럼 상세 36개 측정에서 반복.
  - `span.guide_label` / `landing_label` 12.48px 3.08:1.
  - `a.guide_ctaButton` 17px 4.18:1: 금색 버튼 위 짙은 글자, 경계선.
  - 별점 3.46:1: 16px 장식이라 경미.
- 오탐으로 제외:
  - 스위처 드롭다운 항목 1.0~1.18: 닫힌 `<details>` 내부라 계산 오류.
  - 비디오 위 "Pause video": 배경 이미지라 측정 불가.

### 링크

- 내부 `/en`·루트 링크 49개: **전부 200**.
  - `/` → `/ko`로 리다이렉트된다. 푸터 "Website" 링크가 영어 사용자를 한국어 홈으로 보내는지 **확인 필요**. 링크 텍스트는 "Website", href는 `/`.
- 앵커: 푸터 `/en/services#real-estate`는 존재하지만 높이 0 alias이고 대응 서비스가 없다(EN-08).
- 외부 링크 131개. curl 브라우저 UA 재시도 기준:
  - 200: 118개(최초 Python SSL 오류는 대만 정부 인증서 체인 문제로, curl에서는 200).
  - 403: 7개(`law.moea.gov.tw` ×3, `mnscdn.moea.gov.tw` ×2, `www.moea.gov.tw` ×1, `blog.udn.com` ×1). WAF나 봇 차단으로 추정되며 **확인 필요**.
  - 연결 실패(000): 5개(`laws.mol.gov.tw` ×3, `www.mvdis.gov.tw` ×2). 지역 차단으로 추정된다. 미국 방문자 기준으로도 열리지 않는다면 이는 사용자 문제다. **확인 필요: US IP에서 재측정.**
  - 500: 1개(`lawdb.tw/2023/04/12/…`, gym-injury 칼럼). 죽은 링크 후보다.
  - 목록: `ext-nonok.txt`.

### 기타

- 콘솔 오류: 1건(EN-22).
- `<img>` alt 누락: 0.
- 12px 미만 텍스트: 0.
- 390 소형 탭타깃(<32px 높이, <200px 폭): 홈 8, 프로필 9, contact 5, pricing 2. 상세 위치는 `data/*-390.json` `.smallTaps`(개수만 기록). **확인 필요**.
- 메타·언어:
  - 전 페이지 `lang=en`.
  - hreflang 50개.
  - JSON-LD `WebSite(en)`, `LegalService`, `Person`, `FAQPage(en)`.
  - `<title>` 66자 초과가 35개(EN-20).
  - description 160자 초과가 `/en/taiwan-semiconductor-supplier-legal`(255), `/en/lawyers/wei-tseng`(237), `/en/ai-intake`(228), `/en/korean-lawyer-in-taiwan`(227).
- sitemap: `/en/faq`가 sitemap에 없다(라이브 200). **확인 필요**: 의도적 제외인지.

---

## 페르소나별 요약 판정

| 질문 | P1 미국 제조사(반도체) | P2 타이베이 거주 미국인 | P3 미수금 SME |
|---|---|---|---|
| 나를 위한 곳인가 | 부분적. 반도체 랜딩 내용은 구체적이고 좋다("vendor registration pack", "OSAT"). 다만 홈에서 보이지 않고, 홈은 한국 사례 중심 | 약함. 가사 서비스 첫 문장이 "Korea-Taiwan marriages", FAQ가 "Korean national" | 약함. 전용 페이지가 초안 표시 상태이고 서비스 목록에 collections가 없다 |
| 믿을 만한가 | 변호사 자격 근거 약함(EN-13), 영어 담당자 불명(EN-01), 가격 NT$만 | 리뷰 5.0/17은 fold 아래에 있음. 영어 직접 상담 여부 불명 | "draft… require attorney review" 문구가 신뢰를 직접 훼손(EN-02) |
| 다음 행동이 명확한가 | 이메일 CTA 경로는 완결됨(영어 mailto 템플릿 양호: subject "[tseng-law.com Consultation] …", 시간대·연락수단 항목 포함). 다만 회신 기대치·시간대가 없다 | 390에서 서브페이지 fold CTA 0 | 페이지 하단 CTA 대비는 정상이지만 보조링크가 보이지 않는다(EN-05) |

강점(유지):
- 영어 문장 자체의 문법·법률용어 품질은 대체로 높다(노동법 서비스 상세, 반도체 랜딩).
- mailto 템플릿이 영어로 완결되어 있다.
- 준비물 안내가 구체적이다(contact "Useful materials to prepare", 반도체 랜딩 체크리스트).
- 광고규정 준수 문구가 있다("Outcomes depend on the specific facts…").
- 모바일 레이아웃 오버플로 0.

## 레인·규칙 주의

- 홈 히어로 경로 버튼 CSS(DS1-C)는 GOAL Open에 따라 `fix/home-paths-layout-20260923` 레인 소유다. EN-04①과 EN-09의 히어로 변경은 그 레인과 조율해야 한다.
- 모든 "새 사실 필요" 항목은 공개 전에 변호사·사용자 확인이 필요하다(GOAL 하드룰).


---

# Part B — JA


- 감사자: audit-ja (일본 기업·재대만 일본인 관점) · 읽기 전용(코드/레포 변경 없음, 외부 발송 없음)
- 대상 페르소나: **P1** 대만 진출 검토 중인 일본 중견 제조사(반도체 부재 포함) 해외사업부·법무(품의 자료 작성) / **P2** 타이베이 주재 일본계 관리부장(노무·계약 분쟁) / **P3** 재대만 일본인 개인(이혼·상속·교통사고)
- 측정 도구(재실행 가능): `audit.mjs`(1440×900·390×844, DPR1, `data-skip` 클릭, 300px 단계 스크롤 리빌, 폰트/줄바꿈/오버플로/한글 스캔, CDP `CSS.getPlatformFontsForNode`), `texts.mjs`(전문 innerText + 링크 613개 상태 점검), `wb-trace.mjs`(칼럼 H2 word-break 규칙 추적). 원자료: `results.json`, `summary.txt`, `texts/*.txt|json`, `links.json`, 스크린샷 `shots/`(전체+상단, 23페이지×2뷰포트), 슬라이스 `slices/`.
- 표기: `[변호사/사용자 확인 필요]` = 사이트에 없는 새 사실이 필요한 항목(공개 전 확인). "확인 필요" = 이번 측정으로 단정 못 한 항목.

---

## 요약 — 상위 10개 문제 (영향 순)

1. **[P0] JA 홈 핵심 섹션이 여전히 "한국 고객용" 사이트로 읽힌다.** `/ja`에서 「韓国」이 11회 나온다: 대표 사례 섹션 H2 「韓国人留学生のジム負傷事件」, 「韓国事務所」 카드(京畿道 주소·+82 휴대폰·「NAVERマップで見る」), FAQ 「韓国人が台湾で離婚するには…」, 민사 서비스 카드. 푸터 일러스트는 서울 경복궁·N서울타워 + 타이베이다. EN 홈도 같은 구조다(Korean 11회). WO-JA-1은 랜딩만 고쳤고 홈과 공통 컴포넌트는 그대로 남아 있다.
2. **[P0] 내비 「日本チーム」(H1 「昊鼎日本語チーム」)의 내용이 명칭과 맞지 않는다.** 이 페이지 구성원 중 한 명이 「韓国事務長」이고 경력란은 「韓国業務チーム」, 소개는 「韓国のクライアントからのお問い合わせ対応」다. 대표 변호사 기본정보의 「相談言語」는 「韓国語、中国語、日本語」로, 사이트 다른 곳의 4개 언어(영어 포함) 표기와도 어긋난다. P1이 "일본어 팀이 실재하는가"를 확인하려 여는 페이지가 오히려 반대 증거를 보여 준다.
3. **[P1] 전화 연락처는 사실상 한국 휴대폰 하나뿐이다.** 페이지의 유일한 `tel:` 링크가 `tel:+821029929304`(`/ja`, `/ja/contact`, `/en`)다. 일본어 담당 변호사가 있는 **台北事務所에는 전화번호가 없다**(`office-locations.ts:128` 「Taipei publishes no phone」). 台中·高雄·屏東에는 번호가 있다. 일본 법무 담당자는 대표번호를 기본 신뢰 신호로 보는데, 결과적으로 한국 번호가 대표 연락처처럼 보인다.
4. **[P1] 일본어 역량이라는 가장 강한 신뢰 신호가 묻혀 있다.** JLPT N1은 26개 JA 페이지 가운데 홈 통계 블록에서 **한 번만** 나온다(프로필·팀·랜딩 0회). 「神戸大学・早稲田大学への交換留学」은 학력 목록 3번째 줄에만 있다. 반대로 모든 서비스·칼럼 페이지의 저자 박스(`attorney-profiles.ts:285`)는 「韓国・日本のクライアント」라고 쓰고, 언어 칩과 목록도 「韓国語」가 맨 앞이다(`attorney-profiles.ts:289`, `PricingCards.tsx:219`).
5. **[P1] 전환 경로에 일본 기업이 기대하는 운영 정보가 없다.** 영업시간, 시차(대만 UTC+8 / 일본 UTC+9), 회신 목표 시간, 회신 언어 명시가 26페이지 전체에서 **0건**이다. 홈 히어로에는 동급 CTA 6개(버튼 4·텍스트 링크 2)가 병렬로 놓여 주 행동이 불분명하다. 문의 폼의 「ご記入に使う言語」 예시는 「ベトナム語、インドネシア語、タイ語、フィリピン語など」로, 다국어 공통 폼 문구가 그대로 노출된다(`international-inquiry-copy.ts:284`).
6. **[P1] 품의(稟議)에 쓸 자료가 없다.** 요금은 NTD 표기만 있고(엔화 참고 없음, 세금·지불 방법·해외송금 가부 없음) PDF/개요 자료는 0건이다(`hasPdf=false`, 전 페이지). P1은 일본 사내에 "비용·범위·기간·사무소 개요" 한 장짜리를 올려야 한다.
7. **[P1] 칼럼·가이드·서비스 본문이 한국 기준으로 쓰였다.** 노동 칼럼은 도입부와 meta description이 「比較のため、韓国の退職金制度に触れると…」로 시작한다. 회사설립 칼럼에는 H2 「5. 税金と台湾・韓国所得税協定（韓国関連）」, 가이드에는 「国・地域別の例外」에 韓国 2항목만 있고, `/ja/services/investment`에는 「韓国からの送金である場合に限り…」가 있다. 일본 기업에 필요한 일본 측 정보(송금·조세 취급)가 비어 있다 → `[변호사 검수 필요]`.
8. **[P2] 용어 표기가 흔들린다.** 就業許可(37회)와 就労許可(10회, 가이드·韓国語 랜딩). 投資審議司(서비스·랜딩)와 가이드의 投審会/投資審議委員会(구 명칭 계열). 代表者事務所·駐在員事務所·連絡事務所가 같은 개념에 혼용된다. 통화는 新台湾ドル/ニュー台湾ドル/NTD/NT$/TWD/台湾ドル/元 7가지다. 법무 담당자가 읽으면 정확성 신뢰가 떨어진다.
9. **[P2] 링크·내비 결함.**
   - 푸터 아이콘 「公式サイト」가 `https://tseng-law.com/`을 가리키고, 이 주소는 308로 `/ko`(한국어 홈)에 떨어진다(`Footer.tsx:166` 부근, 전 JA 페이지).
   - 푸터 「不動産・建設」는 서비스가 없는 `#real-estate` 별칭이라 실제로는 민사 카드로 간다(`ServicesBento.tsx:58`).
   - JA 랜딩의 「あわせて読みたいガイド」가 `/ja/korean-lawyer-in-taiwan`(한국어 상담 랜딩, JA sitemap 등재)으로 보낸다.
   - 칼럼의 労働部(WDA) SOP 링크는 점검 페이지로 302된다.
10. **[P2] 신원 표기의 읽기와 검증 가능성이 낮다.** 사무소명 「昊鼎」과 변호사명 「曾雋崴」은 일본인이 읽을 수 없다. 사이트에 있는 영문명(Hovering International Law Firm / Wei Tseng)이 JA 헤더·프로필 H1에 병기되지 않는다. 소속 律師公会·등록 정보가 없고 `[변호사 확인 필요]`, 이메일 도메인(hoveringlaw.com.tw)과 사이트 도메인(tseng-law.com)도 다르다.

**양호한 점(측정 근거):**
- 전 JA 페이지가 `html lang="ja"`이고, 렌더 폰트가 Noto Serif JP / Noto Sans JP뿐이다(KR·SC·TC 글리프 혼입 0).
- 가로 오버플로 0(46회 측정), 금칙 위반(행두 「、。」」ー」 등) 0, 한글 잔존은 문의 폼 셀렉트 「韓国語（한국어）」 1건뿐(의도된 언어명).
- JA 홈 정보량은 EN 대비 부족하지 않다(아래 §자동 스캔 D). J1 핵심 주제(설립·투자심사·노무·계약)는 홈에서 **1클릭**으로 닿는다.

---

## 결함 표

| ID | 심각도 | 페르소나 | 표면(URL·뷰포트) | 문제 | 증거 | 원인 추정 file:line | 제안(日本語コピー案 포함) | 새 사실 |
|---|---|---|---|---|---|---|---|---|
| J01 | P0 | P1·P2·P3 | `/ja` 1440/390 「事例紹介」 섹션 | 홈 유일의 사례가 「韓国人留学生のジム負傷事件　一審157万TWD判決後、控訴審で和解」. 일본 고객에게 "한국인용 사무소"라는 신호이고 금액 제시형 과거 사건이라 광고 규범상 절제 대상. 1440에서 H2 마지막 줄 「和解」만 남는 고아 행 | `shots/_ja-1440.jpeg`(slices `_ja-1440_2.jpg`), H2 텍스트 측정 | `HomeCaseResultsSplit.tsx:76-80`, `site-content.ts:3023-3025` | 홈에서 이 섹션을 **J1용 "取扱テーマ" 카드로 교체**(기존 칼럼 재배치): 「台湾子会社・支店・駐在員事務所の選び方」「投資審議から銀行口座開設まで」「解雇・資遣費の判断基準」. 사례를 남기려면 국적 표기 제거안: 「台湾のジムでの負傷事故に関する損害賠償請求（一審判決後、控訴審で和解）」 — 게재 여부는 `[변호사 확인 필요]`(대만 律師 광고 규범 §과거사건) | 표기 변경은 불필요, 게재 판단은 필요 |
| J02 | P0 | P1·P3 | `/ja`, `/ja/contact` 1440/390 사무소 섹션 | 대만 4개 사무소 탭 아래 별도 「韓国事務所」 카드(京畿道楊州市 주소, 電話 +82-10-2992-9304, 「NAVERマップで見る」) | slices `_ja-1440_4.jpg`, `tel:+821029929304` 링크 | `OfficeMapTabs.tsx:72-74,177` | JA 로캘에서는 한국 사무소 카드를 **숨기거나 푸터 한 줄로 축소**. 그 자리에 「台北事務所（日本語対応の曾雋崴弁護士が在籍）」 강조 | 불필요 |
| J03 | P0 | P3 | `/ja` FAQ, `/ja/faq` | FAQ 「韓国人が台湾で離婚するには、どのような手続きが必要ですか？」 답변도 「韓国・台湾間の国際離婚では…」 | `summary.txt` /ja·/ja/faq headings | `faq-content.ts:274-276` | 「日本人が台湾で離婚する場合、どのような手続きが必要ですか？」로 바꾸고 답변의 「韓国・台湾間」 → 「日本・台湾間」. 일본 측 届出 절차 서술은 `[변호사 검수 필요]`. 최소안: 「外国籍の方が台湾で離婚する場合…」(국적 중립, 기존 답변 사실만 사용) | 일본 특칙 추가 시 필요 |
| J04 | P0 | P1 | `/ja/lawyers`, `/ja/about` 1440 (내비 「日本チーム」) | H1 「昊鼎日本語チーム」인데 구성원 소개가 「孫貞旻 韓国事務長」「韓国のクライアントからのお問い合わせ対応」「昊鼎国際法律事務所 韓国業務チーム」. 기본정보 「相談言語　韓国語、中国語、日本語」(영어 누락, 韓国語가 첫째) | slices `_ja_lawyers-1440_0/1.jpg`, text `texts/_ja_lawyers.txt` | `team-name.ts:26`, `team-members.ts:303,344,353`, `attorney-profiles.ts:289`, `Header.tsx:264` | 내비 라벨을 「弁護士・スタッフ」로, H1을 「弁護士・スタッフ紹介」로. 기본정보: 「相談言語：日本語・中国語・英語・韓国語」(순서만 변경, 4개 언어는 기존 사실). 한국 사무장 카드는 JA에서 「スタッフ」 하위로 순서를 뒤로 | 불필요 |
| J05 | P1 | P1·P2 | 전 서비스·칼럼·랜딩 저자 박스, `/ja/lawyers/wei-tseng` | 「曾雋崴弁護士は、韓国・日本のクライアントによる台湾での投資…」가 22개 페이지에 반복. 프로필 언어 칩 「韓国語／中国語／日本語」. 「主な取扱業務・実績」 둘째 항목이 「韓国企業による台湾での会社設立…を支援」 | `texts/_ja_services_*.txt` 42행 등, slices `_ja_lawyers_wei-tseng-1440_0.jpg` | `attorney-profiles.ts:281-289,317-334` | 저자 박스: 「曾雋崴弁護士は、日本企業・在台日本人の方をはじめ、外国からのクライアントによる台湾での投資、会社設立、訴訟、知的財産、ビザおよび法的リスクの検討を支援しています。」 칩 순서: 「日本語・中国語・英語・韓国語」 | 불필요(순서·범위 서술 변경) |
| J06 | P1 | P1 | `/ja/lawyers/wei-tseng`, `/ja/lawyers`, 전 랜딩 | JLPT N1이 홈 통계에만 1회(프로필·팀·랜딩 0). 「神戸大学・早稲田大学への交換留学」은 학력 3번째 줄에만 있음 | 페이지별 카운트(§자동 스캔 E) | `site-content.ts:2779-2789`(홈에만 존재) | 프로필 H1 아래 리드에 추가: 「日本語能力試験（JLPT）N1取得。神戸大学・早稲田大学への交換留学経験があり、日本語で直接ご相談いただけます。」 랜딩 히어로 아래 신뢰 배지: 「JLPT N1｜台湾弁護士｜台北事務所」 | 불필요(기존 사실) |
| J07 | P1 | P1·P2·P3 | `/ja/contact`, 헤더·푸터, 문의 CTA 전반 | 페이지의 유일한 tel 링크가 한국 휴대폰 +82. 台北事務所 전화 없음(台中·高雄·屏東은 있음) | `results.json` tels, slices `_ja_contact-1440_1.jpg` | `office-locations.ts:120-128`, `OfficeMapTabs.tsx:72` | JA에서는 +82 번호 비노출. 台北 대표번호 또는 「お電話でのご相談は台中事務所（04-2326-1862）で受け付けます」류 안내 — 운용 가능 여부는 `[사용자 확인 필요]` | 필요(전화 운용) |
| J08 | P1 | P1·P2 | `/ja/contact`, `/ja/pricing`, 전 CTA | 영업시간·시차·회신 목표·회신 언어 0건. 「確認後ご案内します」만 있음 | grep `営業時間|受付時間|時差|日本時間` 전 페이지 0 | `contact-page-content.ts:87-100`, `international-inquiry-copy.ts:265` | 문의 블록 공통 문구(시간·목표는 확인 후): 「受付：メールは24時間受付。台湾時間（日本時間−1時間）の平日[要確認]に順次返信します。返信は日本語で行います。」 | 필요(영업시간·회신 목표) |
| J09 | P1 | P1 | `/ja/contact` 폼 | 「ご記入に使う言語」 placeholder가 「例：ベトナム語、インドネシア語、タイ語、フィリピン語など」. 폼 상단 안내 「このページは日本語による一般的なご案内です」 등 다국어 공통 문구가 일본 사용자에게 불필요한 마찰 | slices `_ja_contact-1440_0.jpg`, `texts/_ja_contact.json` forms | `international-inquiry-copy.ts:265-284` | JA: 「ご記入に使う言語」 필드 기본값을 「日本語」로 두고 숨김/접기. placeholder 「例：日本語」. 안내문은 「日本語でそのままご記入ください。」 한 줄로 | 불필요 |
| J10 | P1 | P1·P2 | `/ja` 히어로 1440/390 | CTA 6개 병렬(「台湾での会社設立を相談する」「台湾でのトラブルを相談する」「台湾会社設立ガイドを読む」「メール相談を申し込む」「取扱業務」「コラムを見る」). 390에서는 히어로 이미지 전에 버튼 5개가 쌓임 | slices `_ja-1440_0.jpg`, `_ja-390_sheet.jpg` | `site-content.ts:2659-2675`, `HeroSearch.tsx:51,118` | 1차 CTA 1개(「日本語でメール相談する」) + 경로 2개(「会社設立・進出」「紛争・労務トラブル」)로 축소, 「取扱業務」「コラム」는 내비에 맡김 | 불필요 |
| J11 | P1 | P1 | `/ja` 히어로 H1·리드 | H1 「台湾法を、分かりやすく。」와 리드 「多言語対応の法律チームが…」가 J1 오퍼(日本語で直接相談)를 말하지 않음. EN H1은 대상 명시(「Taiwan Legal Support for International Businesses and Individuals」) | `summary.txt` headings | `site-content.ts:2659-2661` | H1: 「台湾の会社設立・労務・紛争を、日本語で。」 리드: 「台北の台湾弁護士・曾雋崴（JLPT N1）が、日本企業の台湾進出から現地の契約・労務トラブル、在台日本人の方の家事・交通事故まで、日本語で直接ご相談を承ります。」(INFLOW-PLAN §1 오퍼 문구 재사용) | 불필요 |
| J12 | P1 | P1 | `/ja/pricing` 1440 | NTD만(엔 참고 없음), 세금 포함 여부·지불 방법(해외송금·통화)·견적서 발행 언어 없음. 「韓国語・英語・中国語・日本語での相談に対応」(韓国語 첫째) | slices `_ja_pricing-1440_0.jpg` | `PricingCards.tsx:209-260` | 언어 순서 「日本語・中国語・英語・韓国語」. 주석 추가: 「料金は新台湾ドル（NT$）建てです。日本円でのお見積り・お支払い、税の取扱いについてはお問い合わせください。」 세금/엔 지불 가부는 `[사용자 확인 필요]` | 필요(세금·지불) |
| J13 | P1 | P1 | 전 사이트 | 품의용 PDF/사무소 개요 자료 0건 | `hasPdf=false`(46회 측정) | — | 「事務所概要・費用のご案内（PDF）」 1장: 사무소명(和·英)·소재지 4곳·대표 변호사 자격/JLPT N1·취급 업무·요금표·연락처 — 기존 사실만으로 구성 가능. 소속 律師公会 기재는 `[변호사 확인 필요]` | 소속회만 필요 |
| J14 | P1 | P2 | `/ja/columns/taiwan-labor-severance-law` + meta description, `/ja/services/labor`, `/ja/taiwan-semiconductor-supplier-legal` 관련 칼럼 | 도입부 「こんにちは、曾雋崴弁護士（Wei Tseng）です。今日は皆さんと…」 뒤에 「比較のため、韓国の退職金制度に触れると…」. 검색 스니펫(desc)에도 韓国가 들어감. 제목 「…受け取りにくい？？」는 이중 물음표 | `summary.txt` desc, `texts/_ja_columns_taiwan-labor-severance-law.txt` | `src/content/columns-ja/008-taiwan-labor-severance-law.md:29` | 한국 비교 단락 삭제(대만법 설명만 남김). 제목: 「台湾の退職金（資遣費）：会社都合の契約終了で支払いが必要な場合と不要な場合」. 일본 제도 비교를 넣으려면 `[변호사 검수 필요]` | 삭제는 불필요, 일본 비교는 필요 |
| J15 | P1 | P1 | `/ja/columns/taiwan-company-establishment-basics`, `/ja/guides/taiwan-company-setup`, `/ja/services/investment` | 조세·송금 섹션이 韓国 전용(H2 「5. 税金と台湾・韓国所得税協定（韓国関連）」, 가이드 「国・地域別の例外」에 韓国 2항목만, 투자 서비스 「韓国からの送金である場合に限り…」). 일본 기업이 가장 궁금한 부분에 일본 정보가 없음 | 韓国 출현: 칼럼 11, 가이드 9, 투자 8 | 칼럼 md(columns-ja 회사설립 기초), `guides/taiwan-company-setup/content.ts`, `service-details-ja.ts:29` | 단기: 韓国 섹션을 「送金元の国・地域の手続（例：韓国）」로 접고 일반론을 먼저. 중기: 일본-대만 조세 취급·일본 측 해외투자 절차 섹션 신설 `[변호사 검수 필요]` | 일본 섹션은 필요 |
| J16 | P2 | P1 | 가이드·韓国語 랜딩 vs 서비스·칼럼 | 就業許可 37 vs 就労許可 10. 投資審議司(서비스/랜딩) vs 投審会·投資審議委員会(가이드). 代表者事務所 27 / 駐在員事務所 4 / 連絡事務所 9 | §자동 스캔 F | `guides/taiwan-company-setup/content.ts:516-649`, `korean-lawyer-in-taiwan/content.ts:283-311`, `intent-pages.ts:1156,1172` | 용어 사전 고정: 「就業許可」「居留証（ARC）」「経済部投資審議司（旧・投資審議委員会）」「代表者事務所（いわゆる駐在員事務所）」. 가이드의 「投審会承認」 → 「投資審議司の投資許可」(명칭 현행성 `[변호사 확인 필요]`) | 명칭 현행성만 확인 |
| J17 | P2 | 전원 | 통화 표기 | 新台湾ドル/ニュー台湾ドル/NTD/NT$/TWD/台湾ドル/元 7종 | §자동 스캔 F | `PricingCards.tsx:210`, `site-content.ts:2943,3023`, 칼럼 md | 첫 등장 「新台湾ドル（NT$）」, 이후 「NT$」로 통일 | 불필요 |
| J18 | P2 | P1·P3 | 전 JA 페이지 푸터 | 「公式サイト」 아이콘 → `https://tseng-law.com/` → **308 → /ko** | `links.json`, `texts/_ja.json` footer | `Footer.tsx:162-173` | JA에서는 href를 `/ja`로(또는 아이콘 제거) | 불필요 |
| J19 | P2 | P1·P3 | 전 JA 페이지 푸터 일러스트 | 서울 경복궁·N서울타워 + 중정기념당·타이베이 101 | slices `_ja-1440_5.jpg` | `Footer.tsx:180` `/images/footer-ground-skyline-v2.webp` | JA는 대만 랜드마크만 있는 크롭/변형 이미지 사용 | 불필요 |
| J20 | P2 | P1 | 푸터 「取扱業務」 | 「不動産・建設」 → `/ja/services#real-estate`(서비스 없음, 민사 카드 별칭). 노무(労働・雇用)는 푸터 목록에 없음 | `curl /ja/services` id 목록, `ServicesBento.tsx:58` | `site-content.ts`(JA 푸터 링크 블록 3284~3300 부근) | 푸터: 「投資・会社設立」「労働・雇用」「民事・契約紛争」「家事事件」 | 불필요 |
| J21 | P2 | P1 | `/ja/taiwan-lawyer`, `/ja/taiwan-company-setup-lawyer`, `/ja/taiwan-litigation-lawyer` 「あわせて読みたいガイド」 | 「韓国語対応可能な台湾弁護士」 → `/ja/korean-lawyer-in-taiwan`(JA sitemap 등재, 韓国 17회) | `texts/_ja_taiwan-lawyer.json` | `IntentLandingPage.tsx`(가이드 링크 목록), `korean-lawyer-in-taiwan/content.ts` | JA 랜딩에서 이 링크 제거. `/ja/korean-lawyer-in-taiwan`은 noindex 또는 JA sitemap 제외 검토(hreflang 영향은 SEO 레인과 조율) | 불필요 |
| J22 | P2 | P1 | JA 헤더 로고·프로필 H1 | 「昊鼎国際法律事務所」「曾雋崴」 읽기 불가, 영문명 병기 없음(영문명은 `/ja/korean-lawyer-in-taiwan` desc에만: 「昊鼎国際法律事務所（Hovering International Law Firm）」) | 헤더 스크린샷, `summary.txt` desc | `Header.tsx`, `attorney-profiles.ts:281` | 헤더 서브라벨: 「Hovering International Law Firm」. 프로필 H1: 「曾雋崴（Wei Tseng）台湾弁護士」. 가나 읽기(ソウ・シュンワイ 등)는 본인 확인 `[변호사 확인 필요]` | 가나 읽기만 필요 |
| J23 | P2 | P1 | `/ja/lawyers/wei-tseng` 「よく検索されるテーマ」 칩 | 「曾雋崴台湾弁護士」「日本語対応の台湾弁護士」「韓国語対応の台湾弁護士」「台湾会社設立弁護士 曾雋崴」 — SEO 키워드가 UI로 노출돼 일본 비즈니스 관점에서 비전문적 | slices `_ja_lawyers_wei-tseng-1440_0.jpg` | `app/[locale]/lawyers/[slug]/page.tsx:85`, `attorney-profiles.ts:317-318` | 칩 제거 또는 「ご相談の多いテーマ：台湾会社設立／投資審議／労務・解雇／民事紛争」(링크형 내비)로 전환 | 불필요 |
| J24 | P2 | P1 | `/ja` 소개 섹션 | 「SBSニュースに法律上の意見・解説を提供」 — SBS(한국 방송사)는 일본 독자에게 무명이고 한국 매체 신호 | slices `_ja-1440_1.jpg` | `HomeAttorneySplit.tsx:47`, `site-content.ts:3018` | 「韓国の放送局SBSのニュース番組で…」로 정확히 풀어 쓰거나 JA에서는 생략하고 JLPT N1·교환유학으로 대체 | 불필요 |
| J25 | P2 | 전원 | `/ja/columns/taiwan-company-establishment-basics` 390 | 칼럼 H2가 단어 중간에서 끊김: 「4. 就業許可・居留資格・資|本金」「2. 台湾子会社設立の主要な|手続」, H3 「…就業許|可」. 전역의 `auto-phrase`가 덮어쓰기로 무효화됨(computed `word-break: normal`) | `results.json` orphans(390), `wb-trace.mjs` 출력 | `ColumnDetail.module.css:151-163`(column-faq-heading/blog-heading `word-break: normal`), `globals.css:25099-25105`(`:lang(ja) h2 … normal`)가 `globals.css:25255-25259` auto-phrase를 이김 | 칼럼 H2/H3에도 `@supports (word-break: auto-phrase)` 적용(DS 레인에 WO) | 불필요 |
| J26 | P2 | P1 | `/ja/semiconductor` title, 반도체 칼럼 본문 | 「台湾進出の架構」 — 「架構」는 중국어 용법(일본어로는 스킴/체제 의미로 쓰지 않음) | title 측정, `columns-ja/018…md:26,32` | `semiconductor-public.ts:104`, `columns-ja/018-taiwan-semiconductor-market-entry.md:26,32` | 「台湾進出スキームの設計」 또는 「台湾進出の体制づくり」 | 불필요 |
| J27 | P3 | P1 | `/ja` 연락 섹션, `/ja/contact`, `/ja/ai-intake` | AI 접수 안내가 직역투: 「この事務所に接続・設定されたAIサービスの初期質問と確認用メール草稿についての案内です。一般のAIチャットから自動利用はできません。」 홈 연락 리드 「ビジネス、訴訟、会社設立のご相談を案件種別に迅速に振り分けます。」도 부자연 | slices `_ja-1440_4.jpg` | `lib/ai-intake/discovery.ts:34`, `site-content.ts:3284` | 「AIアシスタント経由でのご相談受付について（当事務所が設定した窓口のみ対応）」 / 「企業法務・紛争・会社設立など、ご相談内容に応じて担当弁護士がご案内します。」 | 불필요 |
| J28 | P3 | 전원 | `/ja` 통계 블록 | 「公式プロフィールで見る国際業務の基盤」「2 最上位級の語学資格」「当事務所では英語・中国語・韓国語・日本語の4言語」(일본어가 마지막) | `summary.txt` | `site-content.ts:2779-2789` | H2 「数字で見る昊鼎」, 라벨 「語学資格（JLPT N1・TOPIK 6級）」, 순서 「日本語・中国語・英語・韓国語」 | 불필요 |
| J29 | P3 | P1 | `/ja/columns/taiwan-company-establishment-basics` 공식자료 | 労働部 WDA SOP 링크 → `maintain.wda.gov.tw`(점검 페이지)로 302. MOEA 링크 2개는 403(봇 차단 가능성, 확인 필요) | `links.json` | 칼럼 md 공식자료 목록 | 링크 교체 또는 재확인 | 불필요 |
| J30 | P3 | P1 | `/ja/faq` hreflang | `/ja/faq`의 hreflang 목록에 `en`이 없음(ko,zh-Hant,ja,vi…). `/en/faq`는 200 | `summary.txt` /ja/faq hreflang | FAQ 페이지 alternates 생성부(확인 필요) | SEO 레인(G7)에 전달 | 불필요 |
| J31 | P3 | P1 | 메일 CTA 전반 | mailto 본문 「ご希望の言語：日本語 / 中文 / 한국어 / English」(한글 1건). 연락 이메일 도메인 hoveringlaw.com.tw ≠ 사이트 도메인 | `results.json` ctas | `public-contact.ts:86` | JA 템플릿: 「ご希望の言語：日本語」 기본 기입. 도메인 차이는 「当事務所の公式ドメイン（hoveringlaw.com.tw）」 한 줄로 설명 | 불필요 |

---

## 자동 스캔

### A. 한글(Hangul) 잔존 — Unicode `[가-힣ᄀ-ᇿ㄰-㆏]`, body 전체
- 23개 URL × 2뷰포트: **히트 1건**(`/ja/contact` 폼 셀렉트 「韓国語（한국어）」 — 의도된 언어명). 가시 텍스트 외에는 mailto 본문 「한국어」(J31)와 Google Maps 장소명 URL의 한글(링크 대상, 비가시)이 있다.
- 「韓国/Korea」 전제 문구(가시 텍스트) 출현 수: `/ja` 11, `/ja/korean-lawyer-in-taiwan` 17, `/ja/columns/taiwan-company-establishment-basics` 11, `/ja/lawyers/wei-tseng` 11, `/ja/about` 9, `/ja/guides/taiwan-company-setup` 9, `/ja/services/investment` 8, `/ja/lawyers` 8, `/ja/contact` 7, `/ja/columns` 7, 랜딩 3종 4~6. 공통 푸터 문구 「日本語・英語・韓国語・中国語で…」 1회는 모든 페이지에 들어간다.

### B. 폰트·글리프 (lang / computed font-family / CDP 실렌더 폰트)
- `html lang`: 전 JA 페이지 `ja`. 하위 `[lang]` 이탈 요소 없음(langAttrs = ['ja']).
- computed: 제목 `"Noto Serif JP", "Noto Serif JP Fallback", "Yu Min…"`, 본문 `"Noto Sans JP", …, "Hiragino…"`.
- CDP 실렌더(`getPlatformFontsForNode`): main h1/h2/p/li, header nav, footer 모두 **Noto Serif JP / Noto Sans JP만** 쓴다. KR·SC·TC 폰트 혼입 0 → 간체/번체 글리프 혼입 없음.
  - 참고: 플랫폼 폰트명이 「Noto Sans JP Thin」「Noto Serif JP ExtraLight」로 찍힌다. 가변 폰트의 기본 인스턴스명일 가능성이 높지만 실제 굵기가 얇게 렌더되는지는 **확인 필요**.
  - 대조: `/en`은 Noto Sans KR / Noto Serif KR로 렌더된다(EN 레인 참고용).
- 명조/고딕 혼용: 페이지 H1과 홈 H2는 명조, 하위 H2/H3·본문은 고딕 — 일관된 규칙이라 결함으로 보지 않는다. `/ja/ai-intake` 본문 p만 명조 12.48px로 작고 행간 21.8px이다(P3).
- 본문 크기·행간: p 16.3~18px / line-height 1.66~1.85, 칼럼 17px/1.85 — 일본어 가독 범위 안.
- 줄바꿈 속성: 전역 `line-break: strict`(금칙 강함), 제목 `word-break: auto-phrase`(단 칼럼 H2/H3는 덮어쓰기로 normal → J25).

### C. 오버플로·금칙·고아 행
- 가로 오버플로(`scrollWidth − clientWidth`, 비클리핑 요소의 right > viewport): **0 / 46 측정**.
- 행두 금칙 위반(행 첫 글자가 `、。，．・：；？！」』）】〕ー々` 또는 작은 가나): **0**(블록 요소 최대 260개/페이지, 글자별 Range rect로 행 복원).
- 제목 고아 행(마지막 줄 ≤2자):
  - 1440: `/ja` H2 「…控訴審で和解」 → 「和解」, `/ja/taiwan-semiconductor-supplier-legal` H1 → 「案内」.
  - 390: 칼럼 H2 2건·H3 1건(J25).

### D. 정보량 — JA 홈 vs EN 홈 (라이브, main 요소 기준)

| 지표 | `/ja` | `/en` | 비고 |
|---|---|---|---|
| 본문 문자 수(공백 제외) | 3,438 | 5,421 | 스크립트가 달라 직접 비교 불가 |
| CJK 문자 / 영어 단어 | 2,930 | 907 | 영→일 통상 환산(1단어≈2~3자) 기준 EN 상당량 ≈ 1,800~2,700자 → **JA가 동등 이상**. 과거 「280어」 격차는 해소됨 |
| section 수 | 9 | 10 | EN에만 「Guides for overseas clients」 블록(`EnAcquisitionGuideLinks.tsx:4`) |
| main 내 링크 | 34 | 38 | |
| 고유 내부 링크(페이지 전체) | 88 | 88 | |
| 페이지 높이 1440 / 390 | 9,900 / 14,405 | 10,303 / 14,521 | |

→ 정보량보다 **내용의 대상**(한국 전제, J01~J05)이 문제다. EN의 가이드 링크 블록에 해당하는 JA 블록(「日本企業の方へ：台湾進出ガイド」)이 홈에 없다(G6 진입점 후보).

### E. 신뢰 신호 출현(26개 JA 페이지 전문 grep)
- JLPT: 홈 1 / 나머지 0.
- 神戸·早稲田: `/ja/lawyers`, `/ja/lawyers/wei-tseng`, `/ja/about`에서만 2회씩.
- 営業時間·受付時間·時差·日本時間: 전 페이지 0.
- 円 환산: 0.
- 守秘·秘密保持·機密: `/ja/semiconductor` 2, `/ja/services/ip` 1, `/ja/ai-intake` 1 — 문의 페이지에는 없다. 문의 페이지의 「機微情報は…送らないでください」는 민감정보 안내이지 비밀유지 의무 명시가 아니다.
- 律師公会·弁護士会: 0 `[변호사 확인 필요]`.
- 사무소 개요: 설립(2016)·공동설립자는 `/ja/about`에 있고, 소재지는 푸터·문의에 있다.

### F. 용어 표기 흔들림(JA 전 페이지 출현 수)

| 개념 | 표기(출현 수) |
|---|---|
| 취업허가 | 就業許可 37 / 就労許可 10(가이드·韓国語 랜딩) |
| 투자심사 기관 | 経済部投資審議司 6·投資審議司 6 / 投審会 8·投資審議委員会 3(가이드·韓国語 랜딩) |
| 연락사무소 | 代表者事務所 27 / 連絡事務所 9 / 駐在員事務所 4 |
| 통화 | 台湾ドル 25 / 新台湾ドル 15 / TWD 9 / 元 7 / NTD 3 / ニュー台湾ドル 1 / NT$(요금표) |

### G. 링크 상태(JA 26 + EN 3 페이지에서 수집한 고유 URL 613개)
- 비200: 5건.
  - `https://tseng-law.com/` → 308 `/ko`(JA 푸터, J18).
  - Google Maps 단축 URL → 302(정상 리다이렉트).
  - WDA SOP → 302 점검 페이지(J29).
  - `law.moea.gov.tw` · `mnscdn.moea.gov.tw` → 403(봇 차단 추정, 확인 필요).
- 사이트 내부 404: 0.

### H. 전환 경로(JA로 완결되는가)
- 메일 CTA: 제목 「【tseng-law.com ご相談】台湾法務・企業業務に関するご相談」, 본문 템플릿 일본어 — 양호(단 J31).
- 폼(`/ja/contact`): 라벨·동의·오류 문구가 일본어 — 양호. 단 원문 언어 필드(J09), 회신 언어·시간 부재(J08). 제출은 이번 감사 범위 밖(발송 제외)이라 미실행.
- CTA 문구 혼재: 「メールで相談」「メール相談を申し込む」「相談を申し込む」「お問い合わせ」「相談する」「曾雋崴弁護士にメールで相談」「メールで相談日程を問い合わせる」 7종 → 「日本語でメール相談」 1종 + 보조 「お問い合わせ」로 통일 권장.

### I. 구조 — J1 도달성(홈 기준 클릭 수)
- 회사설립: 히어로 「台湾での会社設立を相談する」 → `/ja/taiwan-company-setup-lawyer`, 1클릭.
- 투자심사: 서비스 카드 → `/ja/services/investment`(経済部投資審議司 서술), 1클릭.
- 노무: 서비스 카드 「労働・雇用」, 1클릭.
- 계약분쟁: 히어로 「台湾でのトラブルを相談する」 → `/ja/taiwan-litigation-lawyer`, 1클릭.
- **전 항목 3클릭 이내 충족.** 다만 내비에 「日系企業の方へ」 같은 대상별 진입점이 없고, `/ja/taiwan-lawyer`(日本企業·在台日本人 대상 허브)는 푸터 「人気トピック」에서만 노출된다(G6).

---

## 권장 배치(참고, 새 사실 불필요분 우선)
1. **WO-JA-2(카피·데이터, P0/P1)**: J01~J06, J09~J11, J14(한국 비교 단락 삭제), J16·J17(용어 사전), J18~J24, J26~J28, J31. 전부 기존 사실의 재배치·표현 변경이다.
2. **WO-DS-JA(조판)**: J25(칼럼 H2/H3 auto-phrase), 1440 고아 행 2건.
3. **사용자·변호사 확인 후**: J07(전화), J08(영업시간·회신 목표), J12(세금·엔 지불), J13(PDF 개요의 소속 律師公会), J15(일본 관련 조세·송금 섹션), J22(가나 읽기), J01 사례 게재 여부.
