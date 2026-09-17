# Hub copy — Taiwan semiconductor supplier legal

Status: **COPY FOR IMPLEMENTATION · attorney-review-required · do not publish unreviewed**  
Date: 2026-09-16  
Slug: `taiwan-semiconductor-supplier-legal`  
**Codex has already landed this slug in `src/data/intent-pages.ts` (local dirty, 2026-09-16).** This file is copy 정본 + a DIFF against that implementation. Do not overwrite Codex’s file from this agent.

Legend for every sentence:

| Tag | Meaning |
|---|---|
| `[EXISTING-FAQ]` | Restates a FAQ already published on tseng-law.com (cited). |
| `[EXISTING-PAGE]` | Restates non-FAQ copy already published on the allowed EN pages (cited). |
| `[NEW][attorney-review-required]` | New overlay, combination, or audience naming. Must not go live without attorney sign-off. |

Allowed fact sources (live, 2026-09-16): `/en/taiwan-company-setup-lawyer`, `/en/taiwan-litigation-lawyer`, `/en/pricing`, `/en/services`, `/en/services/investment`, `/en/services/labor`, `/en/services/ip`, `/en/services/civil`, plus the matching KO/JA/ZH-Hant pricing and company-setup pages for localization of the same facts. EN `/en/taiwan-lawyer` FAQ is used only for the already-published “NT$3,000 / setup from NT$50,000 for standard cases” sentence.

Not used: science-park procedures, export control, TSMC/foundry relationships, win rates, case names, gym-injury award, complete-guide extras (minimum capital, VAT rates, Korean-bank remittance).

---

## Codex / implementation status (do not fight)

| Surface | 2026-09-16 fact |
|---|---|
| `src/data/intent-pages.ts` | **Slug present** in all four locales (Codex local dirty, +337/−8). See **§13 DIFF**. Do not overwrite that file from this agent. |
| `src/data/site-content.ts` | **Dirty local diff** (Codex): footer/nav links in ko / zh-hant / en / ja to `/{locale}/taiwan-semiconductor-supplier-legal`. |
| Live `https://tseng-law.com/en/taiwan-semiconductor-supplier-legal` | **404** (not deployed). |
| This file | Copy 정본 + gap list. Attorney reviews §3–§6; implementer patches only the gaps in §13. |

Recommended `IntentPageContent` extras (not user-facing copy; needed by the type):

```
slug: 'taiwan-semiconductor-supplier-legal'
label: SEARCH GUIDE / 검색 가이드 / 検索ガイド / 搜尋指南
serviceSlugs: ['investment', 'labor', 'civil', 'ip']
columnSlugs: [
  'taiwan-company-establishment-basics',
  'taiwan-company-subsidiary-vs-branch',
  'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
  'taiwan-logistics-business-setup',
]
```

Reuse existing company-setup columns only. Do not invent a semiconductor column.

EN/JA localization gates already in tests: EN copy must not address a Korea-only audience; JA copy must not contain Hangul or “韓国のクライアント” framing.

---

## 1. Diagnosis (lock before paste)

| Lock | One line | evidence \| assumption |
|---|---|---|
| **Audience** | Overseas materials / equipment / parts suppliers whose HQ is outside Taiwan and who now need a Taiwan subsidiary, branch, or representative office, plus labor, trademarks, or unpaid-invoice work after they are here. | evidence: live site has no semiconductor token (hub 404); existing company-setup + litigation pages already speak to overseas parents and unpaid invoices. assumption: these firms search “Taiwan company setup” before “semiconductor lawyer” — 미측정. |
| **Offer** | Same published services (setup, labor, civil collections, trademarks), named for that supplier situation. Not a semiconductor-IP boutique. | evidence: `/en/services`, `/en/services/investment`, `/en/services/labor`, `/en/services/ip`, `/en/taiwan-litigation-lawyer` unpaid-invoice FAQ, `/en/pricing`. assumption: the firm will actually take these matters for supplier clients — attorney confirm. |
| **Channel** | Owned hub, one URL × four locales. Paid held. | evidence: company-setup cluster already live; paid ads held in `WEEKLY-LOG.md`. assumption: nav link + this hub is enough discovery until index exists. |
| **Constraint** | Attorney review; Taiwan lawyer advertising rules; no invented park/export-control copy; inquiry ledger has **0 industry rows (미측정)**; Codex owns `intent-pages.ts`. | evidence: `docs/seo/taiwan-lawyer-ad-rules-2026-08-18.md`; `INQUIRY-LEDGER.csv`; git dirty `site-content.ts`. |

Offer one-liner (for the page, not a slogan): overseas suppliers use the same Taiwan setup / labor / collections / trademark work, in EN/ZH/JA/KO, in person or by video, at the published fee table.

---

## 2. Regulation gate

- **업종/관할:** Taiwan law firm, official website, four languages, overseas B2B audience. Taiwan rules apply to all languages (no language exception). Korean advertising rules apply in parallel to KO copy. Japanese/US target-country advertising extras: 미확인 beyond the conservative line below.
- **확인한 조문:** 律師法 §40 (誇大不實·不正當); 律師倫理規範 §12; 律師推展業務規範 §2 (official site exempt from 「廣告」 label, still must show name/office/address/phone on the site generally), §3 (3-year ad file), §4 (歪曲·省略·誤認·過度期待), §5①1 勝訴率 absolute ban, §5①2–4 past/current matters unless exception, §7 referral consideration. Korea 변협 2025: 제4조 12호 결과 예측, 제4조 7호 사건·의뢰인, 제9조 ② 최고·유일, 제10조 ① 무료상담 광고, 제4조 10·11호 보수 표방 한정어. Sources: `docs/seo/taiwan-lawyer-ad-rules-2026-08-18.md`; vault `전문직서비스-마케팅-법률-딥리서치-2026-09-03`; `포지셔닝-메시징-오퍼설계-서비스-딥리서치-2026-09-03` §6.
- **준수선 used in this copy:** no win rate, no result promise, no TSMC mandate, no science-park intake, no export-control practice claim, no “semiconductor specialist” certification, no free consult, no gym case reused as supplier proof, no fee figure without the published conditions (omit = §4 省略 risk).
- **미확인 (do not write into the hub):** whether the office files science-park tenancy, factory/chemical registrations, or export-control opinions.

---

## 3. EN copy

`locale: en` · path `/en/taiwan-semiconductor-supplier-legal`

### title

Taiwan Semiconductor Supplier Legal \| Company Setup, Labor, Collections

`[NEW][attorney-review-required]` Audience name “Semiconductor Supplier” is not on the live site. “Company Setup, Labor, Collections” maps to published services only.

### description

A guide for overseas companies supplying into Taiwan: entity choice (subsidiary, branch, representative office), investment review, labor, trademarks, and unpaid invoices. Consultations in English, Chinese, Korean, and Japanese — in person or by video.

- `[NEW][attorney-review-required]` “supplying into Taiwan” / supplier framing.
- `[EXISTING-PAGE]` subsidiary / branch / representative office — `/en/taiwan-company-setup-lawyer`, `/en/services/investment`.
- `[EXISTING-PAGE]` labor, trademarks — `/en/services`, `/en/services/labor`, `/en/services/ip`.
- `[EXISTING-FAQ]` unpaid invoices — `/en/taiwan-litigation-lawyer`.
- `[EXISTING-PAGE]` four languages, in person or by video — `/en/pricing`, `/en/taiwan-company-setup-lawyer`.

### heroPoints (4)

1. Consultations are available in English, Chinese, Korean, and Japanese, in person or by video. `[EXISTING-PAGE]` `/en/pricing`; `/en/taiwan-company-setup-lawyer`.
2. Entity choice, investment approval, capital remittance, and registration should be reviewed as one process — including the choice among a Taiwan subsidiary, a branch, and a representative office. `[EXISTING-PAGE]` `/en/taiwan-company-setup-lawyer`; `/en/services/investment`.
3. Company registration alone is usually not enough. Banking, tax-accounting assistance, residence-permit assistance, trademarks, labor arrangements, and industry permits often follow immediately after registration. `[EXISTING-FAQ]` `/en/taiwan-company-setup-lawyer` “Is company registration alone enough?”
4. After setup, the same firm can review employment issues, trademark filing, and civil claims such as unpaid invoices or contract breaches — these are existing services, not a separate semiconductor product. `[EXISTING-PAGE]` `/en/services/labor`, `/en/services/ip`, `/en/taiwan-litigation-lawyer`. `[NEW][attorney-review-required]` last clause (“not a separate semiconductor product”).

### idealFor (4)

1. Overseas companies that need a Taiwan subsidiary, branch, or representative office in order to operate or contract locally. `[EXISTING-PAGE]` `/en/taiwan-company-setup-lawyer` idealFor. `[NEW][attorney-review-required]` if implementers add “materials or equipment supplier” here — allowed wording: “including materials or equipment suppliers” only after attorney review.
2. Teams comparing branch versus subsidiary setup against the parent’s commercial goal. `[EXISTING-PAGE]` `/en/taiwan-company-setup-lawyer`.
3. Clients who want setup, trademarks, and employment issues reviewed together. `[EXISTING-PAGE]` `/en/taiwan-company-setup-lawyer`.
4. Overseas companies with unpaid invoices or contract breaches by a Taiwanese counterparty. `[EXISTING-PAGE]` `/en/taiwan-litigation-lawyer` idealFor.

### reviewPoints (4)

1. Investment approval and capital-remittance steps are often the most timing-sensitive. `[EXISTING-PAGE]` `/en/taiwan-company-setup-lawyer`.
2. Business address, industry code, and actual operating model need to match. `[EXISTING-PAGE]` `/en/taiwan-company-setup-lawyer`.
3. Regulated sectors require more than incorporation alone. Cosmetics and logistics are published examples; other businesses are assessed against the actual model in consultation. `[EXISTING-PAGE]` `/en/taiwan-company-setup-lawyer` reviewPoints + cautionPoints. `[NEW][attorney-review-required]` “other businesses” overlay — do not name science-park, factory, or export-control permits here.
4. Contracts, labor structure, and trademarks should be considered at the setup stage. `[EXISTING-PAGE]` `/en/taiwan-company-setup-lawyer`. First-to-file trademark timing is also on `/en/services/ip` if a later line is needed; do not add it unless the attorney wants a fifth point.

### processFlow (3)

1. Compare subsidiary, branch, and representative-office structures based on the commercial goal and revenue flow of the overseas parent or investor. `[EXISTING-PAGE]` `/en/taiwan-company-setup-lawyer`.
2. Confirm investment review needs, capital amount, shareholder structure, and business address before filing. `[EXISTING-PAGE]` `/en/taiwan-company-setup-lawyer`.
3. Map the sequence after registration as well, including banking, tax-accounting assistance, residence-permit assistance, trademarks, employment documents, and any industry permit already identified. `[EXISTING-PAGE]` `/en/taiwan-company-setup-lawyer`. Do not insert unpublished permit names.

### prepareChecklist (4)

1. Overseas parent or investor registry documents, shareholder structure, and director details. `[EXISTING-PAGE]` `/en/taiwan-company-setup-lawyer`.
2. Planned business scope, operating model, and candidate Taiwan address. `[EXISTING-PAGE]` `/en/taiwan-company-setup-lawyer`.
3. Expected capital amount, remittance plan, and hiring plan in Taiwan. `[EXISTING-PAGE]` `/en/taiwan-company-setup-lawyer`.
4. Any permit, product, or sector-specific regulatory information already identified — do not send originals, passport numbers, or bank-account details in the first email. `[EXISTING-PAGE]` `/en/taiwan-company-setup-lawyer` checklist + first-email notice.

### cautionPoints (4)

1. If the industry code does not match the real business model, permit work may stall later. `[EXISTING-PAGE]` `/en/taiwan-company-setup-lawyer`.
2. Bank account opening often takes longer than clients expect, even after registration is done. `[EXISTING-PAGE]` `/en/taiwan-company-setup-lawyer`.
3. Cosmetics, logistics, food, platform, and similar sectors may require additional approvals. Whether another sector needs extra permits is a facts-and-model question, not something this page lists. `[EXISTING-PAGE]` first sentence `/en/taiwan-company-setup-lawyer`. `[NEW][attorney-review-required]` second sentence.
4. If visas and labor structuring are treated as an afterthought, the launch timeline usually slips. `[EXISTING-PAGE]` `/en/taiwan-company-setup-lawyer`.

### faq (6)

**Q1. How long does Taiwan company setup usually take?**  
A. A common planning assumption is around three months, but the timeline depends on investment review, capital timing, and sector-specific permits.  
`[EXISTING-FAQ]` `/en/taiwan-company-setup-lawyer`.

**Q2. Which is more common: branch or subsidiary? What about a representative office?**  
A. That depends on liability structure, tax considerations, and expansion plans. Subsidiaries are common for independent local operations, while branches can fit direct parent-company control. A representative office is a third published option; entity choice among subsidiary, branch, and representative office is reviewed against the commercial goal.  
`[EXISTING-FAQ]` first two sentences `/en/taiwan-company-setup-lawyer`. `[EXISTING-PAGE]` representative-office option `/en/services/investment`, `/en/taiwan-company-setup-lawyer`. `[NEW][attorney-review-required]` stitching them into one answer.

**Q3. Is company registration enough to start doing business in Taiwan?**  
A. Usually not. Banking, tax-accounting assistance, residence-permit assistance, trademarks, labor arrangements, and industry permits often follow immediately after registration. Cosmetics and logistics are published examples where incorporation does not complete sector requirements. Other businesses are reviewed against the actual operating model in consultation.  
`[EXISTING-FAQ]` first two sentences `/en/taiwan-company-setup-lawyer`. `[EXISTING-PAGE]` cosmetics/logistics pattern, same URL + related columns. `[NEW][attorney-review-required]` last sentence. Do not add science-park or export-control examples.

**Q4. What languages do you consult in, and can it be remote? What does a consultation cost?**  
A. Consultations are available in English, Chinese, Korean, and Japanese, in person or by video. A general legal consultation is NT$3,000 per hour. Initial review can begin by email or video from outside Taiwan; local filings are mapped after that first consultation.  
`[EXISTING-PAGE]` languages/format `/en/pricing`. `[EXISTING-FAQ]` NT$3,000 `/en/taiwan-lawyer` and `/en/taiwan-litigation-lawyer`. `[EXISTING-FAQ]` remote start `/en/taiwan-company-setup-lawyer` “Can company setup review start while the parent is still outside Taiwan?”

**Q5. What does Taiwan company setup cost?**  
A. The Service Fees page lists Taiwan company setup from NT$50,000 for standard cases. The published standard-case conditions are: capital under NTD 4 million, single shareholder, and inclusion of investment permit, registration, and business license. Bank accompaniment and ARC (residence permit) processing are additional. Higher capital, multiple shareholders, or special entities (branch, JV, and similar) require a separate quote. Exact fees are provided in writing after the initial consultation.  
`[EXISTING-FAQ]` “from NT$50,000 for standard cases” `/en/taiwan-lawyer`. `[EXISTING-PAGE]` conditions `/en/pricing`. Do not drop the conditions.

**Q6. How do you handle unpaid invoices or contract breaches by a Taiwanese counterparty?**  
A. We start from the contract, invoices, and correspondence to assess liability and the recoverable amount, then compare a negotiated settlement, civil action, and enforcement options before recommending a path. In many civil matters the early phase — document review, demand letters, and settlement contact — can be handled remotely with a power of attorney. Whether court appearance is needed depends on the procedure and its stage.  
`[EXISTING-FAQ]` `/en/taiwan-litigation-lawyer` (unpaid invoices FAQ + remote civil-matter FAQ).

### EN keywords / searchTerms (implementation only)

keywords: `Taiwan semiconductor supplier legal`, `Taiwan company setup lawyer`, `Taiwan subsidiary branch representative office`, `Taiwan unpaid invoices lawyer`, `Taiwan employment lawyer`, `Taiwan trademark filing`  
searchTerms: `Taiwan semiconductor supplier legal`, `Taiwan company setup lawyer`, `Taiwan materials equipment company setup`  
`[NEW][attorney-review-required]` semiconductor / materials tokens. Do not add TSMC, foundry, science park, or export control.

---

## 4. KO copy

`locale: ko` · path `/ko/taiwan-semiconductor-supplier-legal`  
Audience may be Korean HQ. Do not claim a Korea-only practice; facts stay Taiwan-law.

### title

대만 반도체 소재·장비 공급사 법무 \| 법인설립·노무·미수금

`[NEW][attorney-review-required]` 업종 호명. 내비 초안 라벨과 정합.

### description

대만에 납품하거나 현지 거점이 필요한 해외 본사(소재·장비 공급사 포함)를 위한 안내입니다. 자회사·지사·연락사무소 선택, 투자 검토, 노무, 상표, 미수금·계약분쟁을 한국어·영어·중국어·일본어로 상담합니다. 대면 또는 화상.

- `[NEW][attorney-review-required]` 공급사 호명.
- 나머지 사실은 `[EXISTING-PAGE]` `/ko/taiwan-company-setup-lawyer`, `/ko/pricing`, `/en/taiwan-litigation-lawyer` 대응 서비스.

### heroPoints (4)

1. 상담은 한국어·영어·중국어·일본어로, 대면 또는 화상으로 진행합니다. `[EXISTING-PAGE]` `/ko/pricing`.
2. 법인 형태 선택, 투자 승인, 자본금 송금, 등기를 한 흐름으로 검토합니다. 자회사·지사·연락사무소 차이를 포함합니다. `[EXISTING-PAGE]` `/ko/taiwan-company-setup-lawyer`.
3. 회사설립만으로 끝나지 않는 경우가 많습니다. 은행, 세무·회계 보조, 거류 관련 절차, 상표, 근로계약, 업종별 허가가 등기 직후에 이어지는 경우가 많습니다. `[EXISTING-FAQ]` `/ko/taiwan-company-setup-lawyer` 「회사설립만 맡기면 끝나는 건가요?」
4. 설립 이후 노무, 상표, 미수금·계약분쟁은 이미 공개된 서비스로 이어서 검토할 수 있습니다. `[EXISTING-PAGE]` `/ko/services` 계열. `[NEW][attorney-review-required]` “이미 공개된 서비스로” 한정 문구.

### idealFor (4)

1. 대만 자회사·지사·연락사무소가 필요한 해외 본사(소재·장비 공급 포함). `[EXISTING-PAGE]` 형태 선택. `[NEW][attorney-review-required]` 괄호 안 업종.
2. 지사와 자회사 중 어느 형태가 맞는지 비교가 필요한 경우. `[EXISTING-PAGE]` `/ko/taiwan-company-setup-lawyer`.
3. 설립과 상표, 근로계약을 같이 보고 싶은 경우. `[EXISTING-PAGE]` `/ko/taiwan-company-setup-lawyer`.
4. 대만 상대방의 미수금·계약 위반을 다뤄야 하는 경우. `[EXISTING-PAGE]` EN litigation idealFor 현지화.

### reviewPoints (4)

1. 투자 승인과 자본금 송금 단계는 일정과 서류 누락에 민감합니다. `[EXISTING-PAGE]` `/ko/taiwan-company-setup-lawyer`.
2. 영업 주소, 업종 코드, 실질 운영 구조가 맞지 않으면 후속 절차가 지연될 수 있습니다. `[EXISTING-PAGE]` `/ko/taiwan-company-setup-lawyer`.
3. 특수 업종은 회사설립만으로 끝나지 않고 별도 허가가 필요합니다. 화장품·물류가 공개된 사례이며, 다른 업종은 실제 사업 내용을 상담에서 확인합니다. `[EXISTING-PAGE]` + `[NEW][attorney-review-required]` 마지막 절. 과학원구·수출통제 예시 금지.
4. 회사설립 후 계약·노무·상표 전략까지 같이 설계해야 운영 리스크가 줄어듭니다. `[EXISTING-PAGE]` `/ko/taiwan-company-setup-lawyer`.

### processFlow (3)

1. 진출 목적과 매출 구조를 기준으로 자회사·지사·연락사무소 중 어떤 형태가 맞는지 먼저 비교합니다. `[EXISTING-PAGE]`
2. 투자 승인 필요 여부, 자본금 규모, 주주 구조, 영업 주소를 정리해 설립 전제조건을 확정합니다. `[EXISTING-PAGE]`
3. 등기 이후 은행, 세무, 거류 관련 절차, 상표, 고용계약, 이미 파악된 업종 허가까지 이어지는 일정을 한 번에 설계합니다. `[EXISTING-PAGE]` (거류 표현은 EN live “residence-permit assistance”에 맞춤; 과학원구 일정 삽입 금지)

### prepareChecklist (4)

1. 해외 본사 등기서류, 주주구조, 대표자 정보. `[EXISTING-PAGE]` `/ko/taiwan-company-setup-lawyer` (한국 본사 → 해외 본사로 일반화: `[NEW][attorney-review-required]` 한 단어. 한국 본사만 쓰는 것도 가능하나 EN 허브와 대칭이 깨짐.)
2. 예상 업종, 영업모델, 대만 영업주소 후보. `[EXISTING-PAGE]`
3. 예상 자본금, 송금 계획, 현지 인력 채용 여부. `[EXISTING-PAGE]`
4. 필요한 인허가 또는 제품·서비스 규제 정보. 첫 메일에는 개요와 연락처만, 여권번호·계좌·원본 신분증은 넣지 않습니다. `[EXISTING-PAGE]`

### cautionPoints (4)

1. 업종 코드와 실제 사업 내용이 다르면 허가 단계에서 지연될 수 있습니다. `[EXISTING-PAGE]`
2. 은행 계좌 개설은 설립 완료와 별개로 시간이 더 걸릴 수 있습니다. `[EXISTING-PAGE]`
3. 화장품·물류·식품·플랫폼 업종은 추가 규제가 붙을 수 있습니다. 그 밖의 업종 허가는 이 페이지가 목록화하지 않으며 상담에서 확인합니다. `[EXISTING-PAGE]` + `[NEW][attorney-review-required]`
4. 비자와 노동계약을 나중에 따로 보면 일정이 늘어집니다. `[EXISTING-PAGE]`

### faq (6)

**Q1. 대만 회사설립은 보통 얼마나 걸리나요?**  
A. 일반적으로 약 3개월 전후를 예상하지만, 투자 승인 대상 여부, 자본금 송금 시점, 업종별 허가 필요성에 따라 달라질 수 있습니다.  
`[EXISTING-FAQ]` `/ko/taiwan-company-setup-lawyer`.

**Q2. 지사와 자회사 중 어느 쪽이 더 많이 선택되나요? 연락사무소는요?**  
A. 책임 구조, 세무, 향후 투자 계획에 따라 달라집니다. 독립 운영과 현지 확장을 고려하면 자회사를, 본사 직결 구조를 원하면 지사를 검토하는 경우가 많습니다. 연락사무소는 공개된 세 번째 선택지이며, 세 형태를 사업 목적에 맞춰 비교합니다.  
`[EXISTING-FAQ]` + `[EXISTING-PAGE]` + `[NEW][attorney-review-required]` 연결 문장.

**Q3. 회사설립만 맡기면 끝나는 건가요?**  
A. 실무상은 그렇지 않습니다. 법인등기 이후 은행, 세무, 거류 관련 절차, 상표, 근로계약, 업종별 인허가까지 이어지는 경우가 많습니다. 화장품·물류는 법인 등기만으로 업종 절차가 끝나지 않는 공개 사례입니다. 다른 업종은 실제 사업 내용을 상담에서 확인합니다.  
`[EXISTING-FAQ]` + `[NEW][attorney-review-required]` 마지막 두 문장.

**Q4. 상담 언어와 방식, 상담 비용은요?**  
A. 한국어·영어·중국어·일본어로 대면 또는 화상 상담이 가능합니다. 일반 법률상담은 1시간 NT$3,000입니다. 본사가 대만 밖이어도 이메일·화상으로 초기 검토를 시작할 수 있습니다.  
`[EXISTING-PAGE]` `/ko/pricing`. `[EXISTING-FAQ]` EN lawyer/litigation fee FAQ 현지화. `[EXISTING-FAQ]` 원격 개시 EN company-setup.

**Q5. 대만 회사설립 비용은 얼마인가요?**  
A. 비용안내 페이지의 표준 사안은 NT$50,000부터입니다. 공개된 기준은 자본금 400만 NTD 이하, 단일 주주, 투자 허가+법인 등기+사업자 등록 포함입니다. 은행 동행과 거류증(ARC) 대행은 추가입니다. 자본금 초과·복수 주주·특수 법인(지사, 합자 등)은 별도 견적입니다. 정확한 비용은 초기 상담 후 서면으로 안내합니다.  
`[EXISTING-FAQ]` EN “standard cases”. `[EXISTING-PAGE]` `/ko/pricing` 조건. 조건 생략 금지.

**Q6. 대만 거래처 미수금·계약 위반은 어떻게 다루나요?**  
A. 계약서·청구서·주고받은 기록을 기준으로 책임과 회수 가능액을 본 뒤, 협상·민사 절차·집행 선택지를 비교해 안내합니다. 많은 민사 사안에서 초기 단계(문서 검토, 내용증명·최고, 화해 접촉)는 위임장으로 원격 진행이 가능합니다. 출석이 필요한지는 절차와 단계에 따라 다릅니다.  
`[EXISTING-FAQ]` `/en/taiwan-litigation-lawyer` 현지화.

---

## 5. JA copy

`locale: ja` · path `/ja/taiwan-semiconductor-supplier-legal`  
Address Japanese / overseas companies. **No Hangul. No 「韓国のクライアント」.**  
Use 子会社・支店・駐在員事務所 (JA company-setup description) and 連絡事務所 only if matching the existing JA hero synonym — here use **子会社・支店・駐在員事務所** consistently, with 連絡事務所 in parentheses on first mention.

### title

台湾の半導体材料・装置サプライヤー法務｜会社設立・労務・売掛

`[NEW][attorney-review-required]` ナビ草案ラベルと整合.

### description

台湾で現地法人や契約対応が必要な海外企業（材料・装置のサプライヤーを含む）向けの案内です。子会社・支店・駐在員事務所（連絡事務所）の選択、投資審査、労務、商標、未払い・契約紛争を、日本語・英語・中国語・韓国語で、対面またはオンライン（ビデオ）でご相談いただけます。

- `[NEW][attorney-review-required]` サプライヤー呼称。
- 言語・対面/ビデオ `[EXISTING-PAGE]` `/ja/pricing`.
- 形態 `[EXISTING-PAGE]` `/ja/taiwan-company-setup-lawyer`.

### heroPoints (4)

1. ご相談は日本語・英語・中国語・韓国語に対応し、対面またはオンライン（ビデオ）で行います。 `[EXISTING-PAGE]` `/ja/pricing`. 語順を日本語先頭にした点は `[NEW][attorney-review-required]`（事実は同一）.
2. 法人形態の選択、投資承認、資本金送金、登記を一つの流れで検討します。子会社・支店・駐在員事務所の違いを含みます。 `[EXISTING-PAGE]` `/ja/taiwan-company-setup-lawyer`.
3. 会社設立だけで終わらないことが多くあります。登記後に銀行、税務・会計の補助、居留関連、商標、雇用契約、業種別の許可が続く場合があります。 `[EXISTING-FAQ]` `/ja/taiwan-company-setup-lawyer` 「会社設立だけ依頼すれば終わりですか？」
4. 設立後の労務、商標、売掛・契約紛争は、既に公開しているサービスとして続けて検討できます。 `[EXISTING-PAGE]` `/ja/services` 系. `[NEW][attorney-review-required]` 「既に公開している」限定.

### idealFor (4)

1. 台湾に子会社・支店・駐在員事務所を置く必要がある海外企業（材料・装置サプライヤーを含む）。 `[EXISTING-PAGE]` + `[NEW][attorney-review-required]` 括弧.
2. 支店と子会社のどちらが適切か比較が必要な場合。 `[EXISTING-PAGE]`
3. 設立と商標、労働契約をあわせて検討したい場合。 `[EXISTING-PAGE]`
4. 台湾の取引先からの未払い・契約違反に対応する必要がある場合。 `[EXISTING-FAQ]` `/ja/taiwan-litigation-lawyer` 未払いFAQの対象.

### reviewPoints (4)

1. 投資承認と資本金送金の段階はスケジュールと書類の漏れに敏感です。 `[EXISTING-PAGE]`
2. 営業住所、業種コード、実質的な運営構造が合わないと後続手続きが遅れることがあります。 `[EXISTING-PAGE]`
3. 特殊業種は会社設立だけで終わらず、別途許可が必要です。化粧品・物流は公開済みの例です。その他の業種は実際の事業内容を相談で確認します。 `[EXISTING-PAGE]` + `[NEW][attorney-review-required]`. 科学園区・輸出管理の例示はしない.
4. 会社設立後の契約・労務・商標まであわせて設計すると運営リスクが減ります。 `[EXISTING-PAGE]`

### processFlow (3)

1. 進出目的と売上構造を基準に、子会社・支店・駐在員事務所のどの形態が適切か先に比較します。 `[EXISTING-PAGE]`
2. 投資承認の要否、資本金規模、株主構成、営業住所を整理して設立の前提条件を確定します。 `[EXISTING-PAGE]`
3. 登記後の銀行、税務、居留関連、商標、雇用契約、すでに把握している業種許可まで続くスケジュールを一度に設計します。 `[EXISTING-PAGE]` 科学園区工程は入れない.

### prepareChecklist (4)

1. 海外本社（日本本社を含む）の登記書類、株主構成、代表者情報。 `[EXISTING-PAGE]` 「日本本社」は JA 既存. 「海外本社」一般化は `[NEW][attorney-review-required]`.
2. 予定業種、営業モデル、台湾の営業住所候補。 `[EXISTING-PAGE]`
3. 予定資本金、送金計画、現地人材採用の有無。 `[EXISTING-PAGE]`
4. 必要な許認可または製品・サービス規制情報。初回メールには概要と連絡先のみ。旅券番号・口座・身分証明書の原本は送らないでください。 `[EXISTING-PAGE]`

### cautionPoints (4)

1. 業種コードと実際の事業内容が異なると許可段階で遅れることがあります。 `[EXISTING-PAGE]`
2. 銀行口座の開設は設立完了とは別にさらに時間がかかることがあります。 `[EXISTING-PAGE]`
3. 化粧品・物流・食品・プラットフォーム業種は追加規制が付くことがあります。それ以外の許可の要否は本ページでは列挙せず、相談で確認します。 `[EXISTING-PAGE]` + `[NEW][attorney-review-required]`
4. ビザと労働契約を後で別に検討するとスケジュールが長くなります。 `[EXISTING-PAGE]`

### faq (6)

**Q1. 台湾の会社設立は通常どのくらいかかりますか？**  
A. 一般的に約3ヶ月前後を見込みますが、投資承認の対象かどうか、資本金送金の時期、業種別許可の必要性によって変わることがあります。  
`[EXISTING-FAQ]` `/ja/taiwan-company-setup-lawyer`. ガイドにある「就労許可・居留証に約1ヶ月」はこの6件には入れない（company-setup FAQの別項目・ガイド由来. このハブの許容ソース外に寄せない）.

**Q2. 支店と子会社のどちらが多く選ばれますか？駐在員事務所は？**  
A. 責任構造、税務、今後の投資計画によって異なります。独立運営と現地拡張を考える場合は子会社を、本社直結の構造を希望する場合は支店を検討するケースが多いです。駐在員事務所（連絡事務所）は公開されている第三の選択肢で、事業目的に沿って三形態を比較します。  
`[EXISTING-FAQ]` + `[EXISTING-PAGE]` + `[NEW][attorney-review-required]`

**Q3. 会社設立だけ依頼すれば終わりですか？**  
A. 実務上はそうではありません。法人登記後に銀行、税務、居留関連、商標、労働契約、業種別許認可まで続く場合が多くあります。化粧品・物流は、設立だけでは業種側の手続が終わらない公開例です。その他の業種は実際の事業内容を相談で確認します。  
`[EXISTING-FAQ]` + `[NEW][attorney-review-required]` 後半.

**Q4. 相談の言語・方法と、相談料は？**  
A. 日本語・英語・中国語・韓国語で、対面またはオンライン（ビデオ）の相談が可能です。一般法律相談は1時間NT$3,000です。日本からでも、メールまたはビデオで初期の検討を始められます。  
`[EXISTING-PAGE]` `/ja/pricing`. `[EXISTING-FAQ]` `/ja/taiwan-lawyer` 相談料. `[EXISTING-FAQ]` リモート開始.

**Q5. 会社設立の費用はいくらですか？**  
A. 費用のご案内ページでは、標準的な台湾会社設立はNT$50,000からです。公開されている条件は、資本金400万NTD以下、株主1名、投資許可・会社登記・営業登記を含む、です。銀行への同行と居留証（ARC）申請代行は別途です。資本金超過、株主複数、支店・合弁など通常と異なる形態は別途見積りです。正確な費用は初回相談後に書面でご案内します。  
`[EXISTING-FAQ]` `/ja/taiwan-lawyer` 「NT$50,000から」. `[EXISTING-PAGE]` `/ja/pricing` 条件.

**Q6. 台湾の取引先からの未払い・契約違反にはどう対応しますか？**  
A. 契約書・請求書・やり取りをもとに責任と回収可能額を検討し、交渉による和解、民事訴訟、強制執行の選択肢を比較してご提案します。多くの民事案件では、初期（文書検討、請求通知、和解の接触）は委任状により遠隔で進められます。出廷の要否は手続と段階によります。  
`[EXISTING-FAQ]` `/ja/taiwan-litigation-lawyer` + EN remote civil FAQ の現地化.

---

## 6. ZH-Hant copy

`locale: zh-hant` · path `/zh-hant/taiwan-semiconductor-supplier-legal`  
Do **not** copy the live ZH company-setup Korea-first framing (「以韓國客戶角度」). Address 海外企業.

### title

台灣半導體材料與設備供應商法務｜公司設立、勞動、應收帳款

`[NEW][attorney-review-required]` 與導覽草案標籤對齊.

### description

供需要在台灣設立據點或處理在地契約的海外企業（含材料、設備供應商）參考：子公司、分公司與代表人辦事處（聯絡處）的選擇、投資審查、勞動、商標，以及未付款、契約爭議。可以英語、中文、韓語、日語，面談或視訊諮詢.

- `[NEW][attorney-review-required]` 供應商稱呼、語序不以韓語領先.
- 其餘 `[EXISTING-PAGE]` `/zh-hant/pricing`, `/zh-hant/taiwan-company-setup-lawyer`.

### heroPoints (4)

1. 諮詢可以英語、中文、韓語、日語進行，採面談或視訊。 `[EXISTING-PAGE]` `/zh-hant/pricing`.
2. 從公司型態選擇、投資核准、資本匯入到登記，採同一流程檢視，並比較子公司、分公司與代表人辦事處。 `[EXISTING-PAGE]` `/zh-hant/taiwan-company-setup-lawyer` + `/en/services/investment`.
3. 通常不是完成公司登記就結束。銀行、稅務會計協助、居留相關程序、商標、勞動安排與產業許可，常在登記後立刻接續。 `[EXISTING-FAQ]` `/zh-hant/taiwan-company-setup-lawyer` 「只處理公司登記就夠了嗎？」
4. 設立後的勞動、商標、應收帳款與契約爭議，可依本所既有服務繼續檢視，並非另開一套半導體產品。 `[EXISTING-PAGE]` + `[NEW][attorney-review-required]` 末句.

### idealFor (4)

1. 需要在台灣設立子公司、分公司或代表人辦事處的海外企業（含材料、設備供應商）。 `[EXISTING-PAGE]` + `[NEW][attorney-review-required]`
2. 正在比較分公司與子公司、需對照母公司商業目的的團隊。 `[EXISTING-PAGE]`
3. 希望把設立、商標與勞動契約一併規劃的情形。 `[EXISTING-PAGE]`
4. 面對台灣相對人未付款或契約違反的海外公司。 `[EXISTING-PAGE]` EN litigation 對譯.

### reviewPoints (4)

1. 投資核准與資本匯入常是最容易延誤的環節。 `[EXISTING-PAGE]`
2. 營業地址、行業別與實際營運模式若不一致，後續流程可能受阻。 `[EXISTING-PAGE]`
3. 特殊產業不是完成登記就結束，還有額外許可要處理。化妝品、物流是已公開的例子；其他產業依實際營業內容在諮詢中確認。 `[EXISTING-PAGE]` + `[NEW][attorney-review-required]`. 不寫科學園區或出口管制.
4. 若能在設立階段就考慮契約、勞動與商標，營運風險會較低。 `[EXISTING-PAGE]`

### processFlow (3)

1. 先依進入台灣市場的目的與營收結構，比較子公司、分公司與代表人辦事處。 `[EXISTING-PAGE]`
2. 確認投資核准、資本額、股東結構與營業地址後，再安排設立順序。 `[EXISTING-PAGE]`
3. 把登記後的銀行、稅務、居留相關、商標、勞動流程，以及已經知道的產業許可，一起排進時程。 `[EXISTING-PAGE]` 不插入園區流程.

### prepareChecklist (4)

1. 海外母公司的登記文件、股權結構、代表人資訊。 `[EXISTING-PAGE]` （將「韓國母公司」改為海外：`[NEW][attorney-review-required]`）
2. 預計經營項目、商業模式、台灣營業地址候選。 `[EXISTING-PAGE]`
3. 預計資本額、匯款安排、是否招募在地人員。 `[EXISTING-PAGE]`
4. 需要的產業許可或產品服務法規資訊。第一次郵件只提供概要與聯絡方式，不要寄護照號碼、帳戶或證件正本。 `[EXISTING-PAGE]`

### cautionPoints (4)

1. 若行業別和實際營運內容不一致，後續許可可能被卡住。 `[EXISTING-PAGE]`
2. 銀行開戶常與公司設立完成時間不同步，需預留時間。 `[EXISTING-PAGE]`
3. 化妝品、物流、食品、平台等產業常有附加規範。其他產業是否另有許可，本頁不列清單，於諮詢確認。 `[EXISTING-PAGE]` + `[NEW][attorney-review-required]`
4. 若把簽證與勞動安排延後處理，整體上線時間會被拉長。 `[EXISTING-PAGE]`

### faq (6)

**Q1. 台灣公司設立通常需要多久？**  
A. 一般約 3 個月左右，但仍需視投資審查、資本匯入時間與產業許可需求而定。  
`[EXISTING-FAQ]` `/zh-hant/taiwan-company-setup-lawyer`.

**Q2. 分公司與子公司，哪一種更常見？代表人辦事處呢？**  
A. 取決於責任結構、稅務與未來投資規劃。若想獨立營運與擴張，常考慮子公司；若想維持母公司直接延伸，則可能考慮分公司。代表人辦事處（聯絡處）是已公開的第三種選擇，三種型態依商業目的比較。  
`[EXISTING-FAQ]` + `[EXISTING-PAGE]` + `[NEW][attorney-review-required]`

**Q3. 只處理公司登記就夠了嗎？**  
A. 通常不夠。完成登記後，銀行、稅務、居留相關、商標、勞動契約與產業許可常需要接續處理。化妝品、物流是「設立不等于產業程序完成」的公開例子。其他產業依實際營業內容在諮詢中確認。  
`[EXISTING-FAQ]` + `[NEW][attorney-review-required]` 後半. 不寫科學園區.

**Q4. 諮詢語言、方式與諮詢費用？**  
A. 可以英語、中文、韓語、日語，面談或視訊。一般法律諮詢為每小時 NT$3,000。母公司仍在海外時，也可先以電子郵件或視訊開始初步檢視。  
`[EXISTING-PAGE]` `/zh-hant/pricing`. `[EXISTING-FAQ]` 費用與遠端啟動.

**Q5. 台灣公司設立費用是多少？**  
A. 服務費用頁就標準案件列出台灣公司設立自 NT$50,000 起。已公開條件為：資本額 400萬 NTD 以下、單一股東，含投資許可、公司登記與營業登記。銀行陪同與居留證（ARC）代辦另計。資本額超過、多位股東或特殊法人（分公司、合資等）需另行詢價。確切費用於初次諮詢後以書面提供。  
`[EXISTING-FAQ]` EN standard cases. `[EXISTING-PAGE]` `/zh-hant/pricing`. 不得省略條件.

**Q6. 台灣相對人未付款或違約，如何處理？**  
A. 先依契約、發票與往來紀錄評估責任與可請求金額，再比較協商和解、民事程序與執行途徑。許多民事案件的前期（文件檢視、催告、和解接觸）可在委任後遠端進行。是否需要到庭，視程序與階段而定。  
`[EXISTING-FAQ]` EN litigation 對譯.

---

## 7. Forbidden-phrase checklist (grep before merge)

Do not ship the hub if any of these strings appear (any locale). Implementer should run a case-insensitive search on the new object.

### Result / ranking / specialist

- win rate, 勝訴率, 승소율, 勝率
- guarantee, 보장, 必ず認められる, 保證勝訴, 結果を保証
- No. 1 / 1위 / 第一 / 唯一 / 最高 / 專精半導體律師 / semiconductor specialist / certified semiconductor
- 無料相談 / 免費諮詢 / 무료 상담 / free consultation (do not add; not on the fee table)

### Invented practice (not on allowed pages)

- TSMC, UMC, ASE, foundry qualification, vendor code, 台積電委任, 台積電指定律師
- science park, 科學園區, 科学園区, 과학원구, Hsinchu Park application, 園區進駐代辦
- export control, dual-use, EAR, 出口管制, 出口管理, CHIPS Act
- patent-litigation boutique, ITC, 專利訴訟專門 (IP page may mention patent strategy generally — **do not escalate** on this hub; trademarks only unless attorney expands)
- factory registration, 工廠登記代辦, chemical registration, 化學物質登記 as a listed service

### Cases / clients

- gym, 1.57 million, 1,579,589, 109年度消字第7號 (do not reuse as supplier proof)
- named clients, 顧問對象, 委任人名單
- “we act for [foundry] suppliers”

### Fee omission / comparison

- NT$50,000 without the published conditions (capital / single shareholder / what is included)
- cheapest, 最低價, 원가, 환불, 할인쿠폰
- setup “from NT$50,000” as if it covers branch/JV/bank/ARC

### Localization defects

- JA: 韓国のクライアント, Hangul, /ko/ links inside JA strings
- EN: Korea-only audience (“Korean headquarters must…”) as the default reader
- ZH: 以韓國客戶角度 as the hub’s point of view

### Folklore already rejected

- stuffing “semiconductor” into existing `/taiwan-company-setup-lawyer` titles
- thin extra locales (vi/id/th/fil/ar/zh-hans) for this hub
- review incentives, paid referral, directory blast

---

## 8. Sentence inventory (FAQ vs new)

Count is for the four locale blocks above. “NEW” means at least one `[NEW]` tag on that field.

| Field | EXISTING-FAQ restatement | EXISTING-PAGE restatement | NEW overlay (attorney-review-required) |
|---|---|---|---|
| title | 0 | 0 | 4/4 locales — supplier naming |
| description | unpaid invoices via litigation FAQ (partial) | languages, entity trio, labor, trademarks | supplier naming; JA/ZH language order |
| hero 1 | | languages + in-person/video | JA/ZH lead-language order only |
| hero 2 | | entity + investment + capital + registration | none if wording stays as source |
| hero 3 | company-setup “registration not enough” | | none if no extra permit names |
| hero 4 | | labor, IP, litigation services | “not a separate semiconductor product” |
| idealFor 1 | | entity choice | “materials/equipment supplier” |
| idealFor 2–3 | | company-setup idealFor | none |
| idealFor 4 | | litigation unpaid-invoice audience | none |
| reviewPoints 1–2, 4 | | company-setup | none |
| reviewPoint 3 | | cosmetics/logistics pattern | “other businesses in consultation” |
| processFlow 1–3 | | company-setup flow | none if no park steps |
| prepareChecklist | | company-setup list + first-email rule | KO/ZH “해외/海外母公司” vs 한국/韓國母公司 |
| caution 1, 2, 4 | | company-setup | none |
| caution 3 | | cosmetics/logistics/food/platform | “this page does not list other permits” |
| FAQ1 | timeline ~3 months | | none |
| FAQ2 | branch vs subsidiary | representative office on pages | combining into one answer |
| FAQ3 | registration not enough | cosmetics/logistics columns/pages | “other sectors in consultation” |
| FAQ4 | fee NT$3,000; remote start | languages; video | none |
| FAQ5 | from NT$50,000 standard cases | pricing conditions | none if conditions kept |
| FAQ6 | unpaid invoices + remote civil | | none |

**Rule for Codex:** paste EXISTING strings as-is where the table says so. Do not “improve” them with park/export-control examples. Every `[NEW]` line stays behind attorney review even if the rest of the page is a restatement.

---

## 9. Prescription for this asset only (0원 / 유료)

유료 트랙: **do not prescribe.** Conversion definition and stop-rules for ads are not opened. Paid remains held (`WEEKLY-LOG.md`).

| P | Lever | Evidence | Effort `[저자 설계값]` | Risk |
|---|---|---|---|---|
| **P0** | Attorney review of §3–§6. Reject any line that adds park/export-control/TSMC. | 推展業務規範 §4 省略·§5 | 60 min attorney | Unreviewed hub = do not merge to production |
| **P0** | Inquiry ledger columns `industry` / `hq_country` / `intent` | 분모 미측정 | 1 h | Without this, “supplier hub works” cannot be judged |
| **P1** | Implement slug in `intent-pages.ts` **after** review, 4 locales, fields above. Do not retitle existing company-setup pages. | Pattern = cosmetics/logistics overlay; seo-geo: don’t stuff old titles | Codex, after this file | Mid-edit collision — wait if Codex is in `intent-pages.ts` |
| **P1** | Keep Codex nav links; do not add vi/id/th/fil/zh-hans copies | Folklore: thin locale fan-out | 0 | Index debt |
| **P2** | Internal `<a href>` from company-setup + investment + labor + civil + ip to the hub, after live 200 | Inflow plan | half day | Only after attorney-approved copy is in the data file |
| **P3** | No new semiconductor column until a reviewed outline exists | Scaled-content trap | — | Skip |
| **P4** | Paid search: not in this document | No experiment design | — | Held |

---

## 10. Measurement (this hub)

분모: `docs/marketing/INQUIRY-LEDGER.csv` — **currently no industry rows (미측정)**. Add `industry=semiconductor*` before claiming effect.

| Layer | KPI | Source | Window | Falsify |
|---|---|---|---|---|
| Business | Inquiries tagged semiconductor / materials / equipment / supplier | ledger | 12 weeks from first live 200 | 0 inquiries **and** sessions-only traffic → rewrite CTA/scope, do not add pages |
| Leading | Hub URLs indexed (en/zh-hant/ja/ko) | GSC | week 8 | <2/4 indexed → stop new copy, only internal links + index request |
| Leading | Existing setup URLs still indexed (no title-stuff regression) | GSC | weekly | setup URL drops index → revert title/nav experiments |
| Authority | Not this copy file | — | — | — |

Do not forecast traffic, share, or conversion rate.

---

## 11. First 2 weeks + 12-week pointer

Capacity `[저자 설계값]`: attorney review 2 h / week; operator 3 h / week. Do not stack a new column in the same weeks.

| Week | Action | Owner |
|---|---|---|
| W1 | Attorney marks §3–§6 **and** §13 G1–G10 accept / edit / delete. Ledger fields. | Attorney + operator |
| W1–2 | Codex (or whoever owns `intent-pages.ts`) **patches gaps in §13 only**. Do not rewrite the object from this markdown. | Codex |
| W2 | Grep §7 forbidden list on the PR. EN Korea-residue test + JA Hangul test extended to the new slug. | Implementer |
| W3–12 | Follow `docs/marketing` sister plan `SEMICONDUCTOR-SUPPLY-INFLOW-PLAN-2026-09.md` (other worktree) for index, internal links, earned. Do not start paid. |

Weekly 30-minute dashboard: live 200 or 404; GSC coverage of the four URLs; ledger count; any forbidden-phrase regression.

State files: this document (copy 정본 until merge); `WEEKLY-LOG.md`; inquiry ledger; `src/data/intent-pages.ts` after Codex lands the slug.

---

## 12. 미확인 · 한계

- Science-park tenancy, factory/chemical filings, export-control opinions: **미확인** whether the office does them. Copy assumes **no**.
- Whether “materials or equipment supplier” is an acceptable public audience label under 推展業務規範 §4 (오인): attorney. Marked NEW.
- Representative-office vs liaison vs 連絡事務所 vs 駐在員事務所: published pages use several synonyms. This file picks one per locale; attorney may unify.
- Live EN company-setup is already longer than `intent-pages.ts` EN (extra FAQs, residence/tax). This hub follows the **live** FAQ facts listed in the allowed URLs, not the shorter local EN object.
- Inquiry volume by industry: **미측정**.
- Competitor SERP claims (Acclime, 理律, etc.) are not copied and are not performance forecasts.

### User decisions still needed (one bundle)

1. Accept or rewrite every `[NEW][attorney-review-required]` line, especially titles and “supplier” naming.  
2. Slug is already `taiwan-semiconductor-supplier-legal` in Codex’s local file — confirm that over `/industries/taiwan-semiconductor-foreign-company`.  
3. Confirm the hub will **not** describe science-park, factory, or export-control work.  
4. Confirm KO/ZH may say 해외/海外母公司 instead of 한국/韓國母公司 on this page.  
5. Keep or drop Codex extras: installation/after-sales model, warranty/하자, “representative office cannot trade” (G6–G8). Default in this file: **drop**.

Until those four are signed, treat §3–§6 as draft strings, not production copy.

---

## 13. DIFF — Codex `intent-pages.ts` vs this copy

Read 2026-09-16 local `src/data/intent-pages.ts` objects at `taiwan-semiconductor-supplier-legal` (ko ~226, zh-hant ~503, en ~811, ja ~1093). **Do not revert Codex wholesale.** Patch only the rows below after attorney review.

### 13.1 Aligns (keep)

| Item | Codex | This copy |
|---|---|---|
| Slug | `taiwan-semiconductor-supplier-legal` | same |
| `serviceSlugs` | `investment`, `civil`, `labor`, `ip` | same |
| `columnSlugs` | four existing company-setup columns; no new semiconductor column | same |
| Entity trio | subsidiary / branch / representative office (locale synonyms) | same |
| Languages + NT$3,000 + in-person/video | present, usually as “4 languages” | same facts; this copy **names** EN/ZH/JA/KO |
| ~3 months setup | present | same `[EXISTING-FAQ]` |
| Unpaid invoices as a theme | present in description / review / caution | same `[EXISTING-FAQ]` |
| EN audience | overseas suppliers, no Korea-only residue | same |
| JA Hangul | none in the JA hub object | same |

### 13.2 Field-count gaps (user spec)

| Field | Spec | Codex EN/KO/ZH/JA | Gap |
|---|---|---|---|
| heroPoints | 4 | **3** | add a fourth: trademarks as an existing service, **or** name the four languages instead of “four languages” |
| faq | 6 | **4** | missing (5) setup fee NT$50,000 **with published conditions**; missing (6) unpaid-invoice path copied from litigation FAQ |
| idealFor / reviewPoints / processFlow / prepare / caution | 4 / 4 / 3 / 4 / 4 | match | counts OK |

### 13.3 Fact / regulation gaps (patch, don’t rewrite)

| # | Codex string (problem) | Why it is a gap | Patch from this file |
|---|---|---|---|
| G1 | FAQ1 answer drops “sector-specific permits” → “stated business scope” / 「업종 표기」 / 「業種の記載」 / 「營業項目」 | Drifts from live `[EXISTING-FAQ]` `/en/taiwan-company-setup-lawyer`. Permit language is the cosmetics/logistics pattern the user allowed. | Restore: “investment review, capital timing, and sector-specific permits.” |
| G2 | No FAQ for setup **NT$50,000 standard cases + conditions** | EN FAQ already publishes “from NT$50,000 for standard cases”; pricing publishes capital < NTD 4M, single shareholder, included filings, bank/ARC extra. Omitting conditions = 推展業務規範 §4 省略 risk if NT$50,000 is shown as the supplier price. | Add FAQ5 from §3–§6. |
| G3 | No dedicated collections FAQ | User required civil collections as a service. Codex only alludes in body copy. Live litigation FAQ is ready to reuse. | Add FAQ6 from §3–§6 (contract, invoices, correspondence → settlement / civil / enforcement; remote POA). |
| G4 | “four languages” never lists English, Chinese, Korean, Japanese | Live `/en/pricing` names them. Naming is the published fact; “four” is a paraphrase. | Replace with the named list in hero1 and FAQ4. |
| G5 | Trademarks weak or absent in hero/FAQ (only `ip` in serviceSlugs) | User: labor, civil collections, **trademarks** exist as services. `/en/services/ip` first-to-file is published. | Use this copy’s hero4 / reviewPoint 4. Do not escalate to patent litigation. |
| G6 | Invented operating model: “direct sales, distributor, installation, after-sales”; “sell, install, or service”; 「설치·유지보수」; 「据付・保守」; 「安裝或售後」 | Not on allowed pages. Looks like semiconductor-procedure copy. | Replace processFlow1 / idealFor with the published commercial-goal + entity-compare wording. Installation/warranty stay out until attorney adds them. |
| G7 | 「하자 책임」 / 「瑕疵責任」 / “warranty allocation” in idealFor | Not on company-setup / litigation / pricing / services as a listed offering. | Drop. Contract disputes / unpaid invoices stay. |
| G8 | Caution: “A representative office often cannot carry on full commercial activity” / 「연락사무소는 영업 활동 범위가 제한」 / 「駐在員事務所は営業活動の範囲が限られる」 / 「聯絡處能從事的商業活動範圍通常較有限」 | Stronger than live `/en/services/investment` (“entity choice … affects legal personality and responsibility”). Legal conclusion. | `[NEW][attorney-review-required]`. Prefer this copy’s caution set (industry-code mismatch, bank delay, cosmetics/logistics pattern, visa/labor later). If attorney keeps a liaison limit, qualify “confirm in consultation,” do not state as a rule. |
| G9 | KO/JA hub titles the reader as 「한국 반도체…」 / 「日本の半導体…」 only | KO/JA targeting is allowed; EN correctly says overseas. Fine for KO/JA **if** attorney wants a national HQ. This copy uses 해외/海外 on ZH and overseas on EN; KO may keep 한국 본사. | Attorney pick. Do not let JA say 韓国. |
| G10 | Codex title/description omit “in person or by video” in some locales (KO description) | Live pricing always pairs NT$3,000 with 대면/화상. | Add the pair wherever the fee is mentioned. |

### 13.4 Do not ship — stuffing the existing company-setup pages

Codex also edited **`taiwan-company-setup-lawyer`** in all four locales:

- idealFor: “cosmetics, logistics, **or semiconductor materials and equipment**”
- cautionPoints: “cosmetics, logistics, food, platform, **semiconductor materials and equipment**”

This is the inflow-plan ban: **do not stuff “semiconductor” into existing setup titles/body.** Cosmetics/logistics are published sector examples; semiconductor permits are **not** a published sector list. Treating materials/equipment as a regulated sector like cosmetics/logistics is a new legal claim (`[NEW][attorney-review-required]`) and it pollutes the already-indexed setup URL.

**Disposition:** revert those two strings on `taiwan-company-setup-lawyer` to the cosmetics/logistics-only published wording. Point to the new hub with a one-line internal link **after** the hub copy is attorney-approved — do not merge the industries in the old bullets.

### 13.5 Nice-to-have, not blockers

- Codex EN title is longer (“Taiwan Legal Support for Overseas Semiconductor Materials and Equipment Suppliers”) vs this file’s shorter title. Either is fine if G4–G6 are fixed.
- Nav JA in `site-content.ts` uses 材料・装置; Codex JA hub uses 素材・装置. Pick one after attorney review.
- Codex FAQ3 is a valid restatement of “registration is not enough” but drops the cosmetics/logistics pattern sentence. Add that sentence so the hub does not invent semiconductor permits.

### 13.6 Implementer checklist (after attorney)

1. Do not rewrite Codex’s object from scratch.  
2. Revert company-setup stuffing (13.4).  
3. FAQ: restore permits in Q1; add Q5 fees-with-conditions; add Q6 collections.  
4. heroPoints: 4 items; name the four languages; mention trademarks without patent-boutique claims.  
5. Strip installation / warranty / after-sales / “rep office cannot trade” unless attorney initials them.  
6. Grep §7 forbidden list on the PR.  
7. Extend `intent-pages-en.test.ts` / `intent-pages-ja.test.ts` to the new slug (EN no Korea-only audience; JA no Hangul). Codex may already be adding tests — do not fight; only add pins for the attorney-accepted strings.
