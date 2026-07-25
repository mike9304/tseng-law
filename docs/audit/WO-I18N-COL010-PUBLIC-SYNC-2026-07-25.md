# WO-I18N-COL010-PUBLIC-SYNC — Gym injury guide public-surface synchronization

Date: 2026-07-25 KST  
Manager: Codex `/root`  
Unit: `010-taiwan-gym-injury-lawsuit`

## Goal

Synchronize the accepted four-locale article titles with every active public
listing, search result, civil-service related card, and attorney-profile
internal link. Replace the stale case-only summaries with concise descriptions
of the guide's actual scope: case study, deadlines, evidence, damages, and
insurance qualification.

This lane must preserve the separately verified representative-case result.
It must not turn a rounded first-instance result into a final appellate result
or present media-reported settlement information as an official judgment fact.

## Owned files

The implementation worker owns only:

- `src/data/insights-archive.ts`
- `src/data/site-content.ts`
- `src/data/attorney-profiles.ts`
- `src/data/service-details.ts`, only the `civil` intros and key points defined
  exactly below
- `src/data/__tests__/column-010-public-reference-sync.test.ts` (new)
- `src/data/__tests__/attorney-profiles-ja.test.ts`, only if its exact internal
  link assertion must follow the accepted Japanese title

Do not edit:

- any of the four accepted article Markdown files;
- `src/data/blog-posts.ts`, whose legacy records are not imported by a public
  runtime route and whose body would require a separate legal rewrite;
- `src/content/column-embeddings.json`; it is a generated semantic-retrieval
  artifact and must only be rebuilt through its canonical generation path;
- historical representative-matter, home-results, or test-fixture text that
  accurately says the firm obtained a rounded TWD 1.57 million first-instance
  judgment;
- builder-only fixture copy.

## Exact titles

- KO: `대만 헬스장 부상 손해배상: 1심 사례·청구기한·증거·배상항목`
- ZH-Hant: `台灣健身房受傷求償：一審案例、期限、證據與賠償項目`
- EN: `Taiwan Gym Injury Claims: Case Study, Deadlines, Evidence, and Damages`
- JA: `台湾のジム事故損害賠償：一審事例・期限・証拠・賠償項目`

Use the exact title for:

- the four civil-service related cards in `site-content.ts`;
- the three archive/search records in `insights-archive.ts`;
- the matching internal link in each localized attorney profile.

## Archive and search copy

Keep the existing archive id, canonical alias href, category, date, and image.
Set the localized reading time to the accepted article metadata: KO `7분`,
ZH-Hant `7分`, EN `7 min`.

Use these exact summaries and keywords:

- KO summary:
  `대만 헬스장 부상 1심 사례를 바탕으로 형사 고소기간, 민사 청구기한, 증거보전, 배상항목과 보험 확인 사항을 정리합니다.`
- KO keywords:
  `['헬스장 부상', '손해배상', '청구기한', '증거보전', '배상항목']`
- ZH-Hant summary:
  `以台灣健身房受傷的一審案例為基礎，整理刑事告訴與民事求償的期限、證據保存、賠償項目及保險確認事項。`
- ZH-Hant keywords:
  `['健身房受傷', '損害賠償', '求償期限', '證據保存', '賠償項目']`
- EN summary:
  `Using a first-instance Taiwan gym injury case, this guide explains deadlines for criminal complaints and civil claims, evidence preservation, damages, and insurance checks.`
- EN keywords:
  `['gym injury', 'damages', 'claim deadlines', 'evidence preservation', 'insurance']`

`src/lib/search.ts` must remain unchanged. It already derives insight titles,
descriptions, and tags from `insightsArchive` and rewrites the alias href to
the canonical `/columns/taiwan-gym-injury-lawsuit` route.

## Civil service factual boundary

The exact article result is TWD 1,579,589 plus the interest stated in the
Taichung District Court's 2022-01-24 first-instance judgment,
`109年度消字第7號`.

Rounded TWD 1.57 million wording may remain in short representative-case
surfaces only when it expressly says `first-instance`. Remove unsupported
`Taiwan's largest gym` / `台灣最大健身房` wording. Do not expand the file scope
beyond the exact `civil` copy below.

Use these exact intros:

- KO:
  `법무법인 호정은 계약 분쟁, 손해배상, 소비자 피해 등 민사 사건 전반을 대응합니다. 한국 유학생 헬스장 부상 사건에서 1심 157만 TWD 손해배상 판결을 이끌어낸 실적이 있으며, 외국인 의뢰인의 대만 소송 절차를 한국어로 밀착 지원합니다.`
- ZH-Hant:
  `昊鼎處理契約爭議、損害賠償及消費者權益等民事案件，曾代理韓國留學生健身房受傷案，於一審獲判新臺幣157萬元賠償，並以中韓雙語支援外國當事人在台灣的訴訟程序。`
- EN:
  `We handle civil disputes including breach of contract, tort, and consumer claims. In a Korean student gym injury case, we obtained a TWD 1.57 million first-instance damages award and provide multilingual support throughout Taiwan litigation.`

Use these exact six key points per locale:

```ts
ko: [
  '배상 항목에는 의료비, 필요한 간호·돌봄비와 교통비, 회복 기간 중 입증된 소득 상실, 지속적 장해와 자료가 확인되는 경우의 노동능력 상실, 개별 사정에 따라 산정되는 비재산적 손해가 포함될 수 있으며, 소비자보호법 제51조의 징벌적 손해배상은 해당 법률과 법정 요건이 적용되는 경우 법원의 판단에 따라 고의는 손해액의 최대 5배, 중과실은 최대 3배, 과실은 최대 1배 범위에서 청구할 수 있습니다.',
  'CCTV, 의무기록, 영수증, 대화 기록, 목격자 진술과 트레이닝 기록은 원본과 작성 시점을 확인할 수 있는 형태로 확보하는 것이 중요하며, 정식 서면 보전요청이나 변호사 명의의 요청서는 무엇을 언제 요청했는지 남기는 수단일 뿐 보전을 강제하거나 삭제를 막거나 자동으로 불리한 추정을 발생시키지 않고, 범죄 가능성이 있으면 신속한 신고를 통해 수사기관이 적법한 확보·보전 근거를 판단하게 할 수 있으나 경찰의 CCTV 확보를 단정할 수 없습니다.',
  '소비자보호법 제7조는 사업자가 서비스를 제공할 때 당시의 전문·기술 수준에서 합리적으로 기대되는 안전성을 갖추도록 요구하지만 모든 헬스장 부상이 곧바로 책임으로 이어지는 것은 아니며, 구체적 책임은 안전의무, 위반, 인과관계, 손해, 항변과 증거를 종합해 판단하고 초기분석이나 과실감정 의견도 최종 책임을 자동으로 결정하지 않습니다.',
  '형법 제287조에 따라 제284조의 과실상해는 고소가 있어야 공소를 제기할 수 있고 형사소송법 제237조상 고소는 원칙적으로 범인을 안 날부터 6개월 안에 해야 하며, 민법 제197조상 불법행위 손해배상청구권은 손해와 배상의무자를 안 날부터 2년 또는 불법행위 시점부터 10년이 지나면 원칙적으로 소멸하고, 다른 청구원인과 기간 규칙은 사실관계에 따라 달라지며 형사부대민사소송도 형사사건과 청구의 관련성 등 요건과 절차 단계가 맞는 경우에만 이용할 수 있어 비용 취급까지 개별 확인해야 합니다.',
  '화해 전에는 대상 청구, 권리포기 범위, 지급 조건과 불이행 시 조치를 확인해야 하며, 치료가 계속되거나 장래 손해가 아직 확정되지 않았다면 그 범위까지 검토해야 하고 서명 뒤에는 합의 내용을 번복하기 어려울 수 있습니다.',
  '대만 타이중지방법원 109年度消字第7號 판결은 트레이너의 지도로 데드리프트를 하던 한국인 유학생이 다친 사건에서 1심이 TWD 1,579,589의 배상을 명한 사례이고 공식 판결문에는 曾雋崴 변호사가 원고 소송대리인으로 기재되어 있으며, 이후 항소심에서 당사자들이 화해했다는 내용은 언론 보도에 따른 것입니다.',
],
'zh-hant': [
  '可能主張的損害項目包括醫療費用、必要的看護或照護費用、必要交通費用、復原期間有證明的收入損失、持續性障礙及相關證據成立時的勞動能力減損，以及依個案情形酌定的非財產上損害；消費者保護法第51條的懲罰性賠償，則須以該法及法定要件適用為前提，並由法院依個案判斷，故意為損害額五倍以下、重大過失為三倍以下、過失為一倍以下。',
  'CCTV、病歷、收據、通訊紀錄、證人陳述及訓練紀錄宜以可確認原始來源與時間的形式保存；正式書面保全請求或律師函只能記錄請求內容與時間，不能強制對方保存、阻止刪除或當然產生不利推定，如事實可能涉及犯罪，及時報案可由偵查機關判斷是否具備合法調取或保全影像的依據，但不能斷定警方一定會取得CCTV。',
  '消費者保護法第7條要求提供服務的企業經營者確保其服務符合當時科技或專業水準可合理期待的安全性，但健身房發生受傷事故不當然成立責任，仍須綜合判斷安全義務、違反情形、因果關係、損害、抗辯與證據，初步研判或過失鑑定意見也不會自動決定最終責任。',
  '依刑法第287條，第284條過失傷害罪屬告訴乃論，刑事訴訟法第237條原則上要求告訴權人自知悉犯人時起六個月內提出告訴；依民法第197條，侵權行為損害賠償請求權原則上自知有損害及賠償義務人時起二年、最長自侵權行為時起十年不行使而消滅，其他請求權基礎與期間規則須依個案確認，而刑事附帶民事訴訟也僅能在與刑事案件的關聯性等法定要件及程序階段均符合時利用，費用效果亦應個別確認。',
  '和解前應確認納入的請求、權利拋棄範圍、付款條件及違約處理方式；如治療仍在進行或將來損害尚未明確，亦應一併評估，因簽署後可能難以推翻或另行主張已納入和解範圍的權利。',
  '臺灣臺中地方法院109年度消字第7號判決涉及一名韓國留學生在教練指導下進行硬舉訓練時受傷，一審判命賠償新臺幣1,579,589元，官方判決並記載曾雋崴律師為原告訴訟代理人；其後雙方於上訴程序成立和解之說法則僅依媒體報導。',
],
en: [
  'Potential damages may include medical expenses, necessary nursing or care costs, necessary transportation, documented earnings lost during recovery, loss of earning capacity where lasting impairment and supporting evidence are established, and non-pecuniary loss assessed from the individual circumstances; punitive damages under Consumer Protection Act Article 51 require the Act and its statutory conditions to apply and remain subject to court assessment, with ceilings of five times the proven loss for intent, three times for gross negligence, and one time for negligence.',
  'CCTV, medical records, receipts, communications, witness accounts, and training records should be retained in a form that preserves their source and timing; a formal written preservation request or counsel’s letter records what was requested and when but does not compel preservation, prevent deletion, or automatically create an adverse inference, and although a prompt report of potentially criminal conduct allows investigators to assess whether lawful grounds exist to obtain or preserve footage, police acquisition of CCTV cannot be assumed.',
  'Consumer Protection Act Article 7 requires a business operator providing services to ensure that the service meets the safety reasonably expected under the professional or technical standard prevailing at the time, but a gym injury does not by itself establish liability, which depends on the applicable duty, breach, causation, damage, defenses, and evidence, while a preliminary assessment or fault-appraisal opinion does not automatically determine final responsibility.',
  'Under Criminal Code Article 287, negligent injury under Article 284 is prosecutable only upon complaint, and Code of Criminal Procedure Article 237 generally requires the complaint within six months after the entitled complainant learns the offender’s identity; under Civil Code Article 197, a tort claim generally expires two years after the claimant learns both of the injury and the person liable, subject to a ten-year longstop from the wrongful act, while other causes of action and timing rules remain fact-dependent and an ancillary civil action is available only when its relationship to the criminal case and other procedural requirements are satisfied, with its cost treatment requiring individual review.',
  'Before settling, the parties should identify the claims covered, the scope of any release, payment terms, and remedies for breach, and ongoing treatment or unresolved future loss should be considered because undoing the agreement or pursuing rights already released may be difficult after signature.',
  'In Taichung District Court case 109年度消字第7號, a Korean student was injured while performing a trainer-led deadlift, and the first-instance court awarded exactly TWD 1,579,589; the official judgment identifies Attorney 曾雋崴 as the plaintiff’s litigation representative, while the statement that the parties later settled on appeal is attributable only to media reports.',
],
```

`service-details-ja.ts` is not part of this lane. Its separately approved
Japanese civil-service copy is already legally cautious; adding case-specific
detail or changing its five-point structure requires an independent Japanese
service-parity work order and regression review rather than incidental edits
in a title-synchronization lane.

## Regression-test contract

The focused test must assert:

1. exact titles in the three archive records and four related cards;
2. exact localized summaries, keywords, read times, image, and retained alias
   archive hrefs;
3. exact title labels and canonical hrefs in all four attorney profiles;
4. search results inherit the exact archive title and summary and point to the
   canonical column route;
5. all four accepted Markdown frontmatter titles match the public titles;
6. the permanent `/columns/gym-injury-lawsuit` and
   `/insights/gym-injury-lawsuit` aliases exist for all four public locales;
7. stale titles are absent from the synchronized runtime files;
8. exact three-locale civil intros and six-point legal arrays are present, and
   `대만 최대 헬스장`, `台灣最大健身房`, `major Taiwan gym`, unconditional
   court-fee waiver, and settlement-finality claims are absent;
9. `src/lib/search.ts` and `src/content/column-embeddings.json` are not edited
   by this lane.

## Gates

1. focused regression tests pass;
2. independent implementation-scope review passes;
3. independent native-copy review passes for KO, ZH-Hant, EN, and JA labels
   and archive copy;
4. independent legal review passes for every civil-service fact changed;
5. TypeScript typecheck, targeted ESLint, and `git diff --check` pass;
6. real-browser desktop and mobile checks confirm the four column/archive
   surfaces, civil-service related cards, attorney links, canonical URLs,
   correct `html lang`, 🇰🇷 KR / 🇯🇵 JP / 🇹🇼 TW / 🇺🇸 EN switchers, no
   horizontal overflow, and no console/page/request errors;
7. a clean production build passes before the lane is committed.

Do not push or deploy.
