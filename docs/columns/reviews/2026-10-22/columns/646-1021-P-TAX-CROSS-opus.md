# CROSS-opus — P-TAX

검수: 2026-10-21 09:19 KST. 작성자 astra, 교차 검수자 opus. 판정: REQUEST_CHANGES — MAJOR 3, MINOR 12.
이 문서는 작성자 간 교차 검수이며 별도 새 Astra max 최종 게이트를 대신하지 않는다. 원고와 WROTE 표시는 수정하지 않았다.
기준: TASK.md(08:22 변경 포함), ISSUE-SPEC(이슈), gapfill TASK·FRONTMATTER(갭), EDITORIAL-VOICE, SENTENCE-VARIETY-RULE, LESSONS, SUPERVISOR-NOTE-0835/0905.

대상 SHA-256:
- `drafts/gap/P-TAX/ko.md` `c2a642853e1ae5a79868d1b7516b8b3763e9975f435a4adc30a5fa7e70820b21`
- `drafts/gap/P-TAX/zh.md` `63bab72a16f5a2b21189d42a572abe28645bca3bce0f1a909acc2ecfdd24ed02`
- `drafts/gap/P-TAX/ja.md` `117151513a9ef6fef43f29737926857c3bc897fed79e5eaa30c53ae72af23746`
- `drafts/gap/P-TAX/en.md` `f39499af75c738c4d7a48082f886e999f4cf03c9b5fe070ef2e5020790ede495`
- `drafts/gap/P-TAX/es.md` `fc793eabd102b3bb205bbd87ed3e2988b60e52914e2093e19e391e8efbdd0871`

## 리드 확인 메모

- MAJOR 1: SUPERVISOR-NOTE-0905-title.md(09:06) 4항 — WROTE-astra(09:04) 이후 도착해 미반영. ko 제목·H1 그대로임을 리드가 확인.
- MAJOR 2·3: 리드가 다섯 판의 문단 첫머리를 나란히 읽어 확인. ja는 zh와 같은 도입(거래처가 보낸 거주자증명서가 지급 처리를 끝내지 못함)과 23→25→"어느 서류를 요청할지"→8(6)/13→4→4·10→예시 순서를 따르고, es는 ko의 네 절 구성·인용 순서(25가 23보다 앞, 34가 92보다 앞)·문단 대응을 따름. 다섯 판 모두 같은 증빙 예시와 같은 "승인된 배분 예가 아님" 단서.
- MINOR 4·5의 외국 조세협정 사실은 MOF 원문(목록 페이지·한국 협정 통합본 PDF)을 연 결과이며 증거 사본은 reviews/opus-cross-work/P-TAX-evidence-*. 넣을 경우 출처 목록에 그 공식 URL을 함께 둘 것(08:22 규칙).

작성자는 각 지적을 직접 확인해 반영하거나, 틀린 지적이면 같은 폴더(이슈는 파일 옆)에 근거를 담은 rebuttal.md를 남긴 뒤 검사를 다시 돌리고 READY를 만든다.

## Findings

1. [MAJOR] ko.md:2 and ko.md:26 — 「한국 업체의 기술지원비, 대만 팀의 참여를 어디까지 볼까」 — Supervisor note 0905 point 4 (drafts/gap/P-TAX/SUPERVISOR-NOTE-0905-title.md:11) requires this title to be rewritten so it shows who worries about what. It is unchanged (WROTE-astra 09:04 predates the 09:06 note). The title still does not say that the reader is the Taiwan payer deciding how much to withhold, or that the question is how the Taiwan team's share of the work is proved. — Fix: rewrite title (line 2 and H1 line 26) to name the payer and the issue, e.g. 「한국 업체에 기술지원비를 보낼 때, 대만 팀이 한 일은 원천징수에 어떻게 반영될까」 or 「한국 본사 기술지원비 원천징수, 대만 팀 작업분을 어떻게 입증할까」. Keep seoTitle consistent. — Preserve: no new legal claim in the title; no claim that a specific allocation is approved.

2. [MAJOR] es.md (whole body) vs ko.md — translation-like structure (08:22 rule: "같은 문단 순서를 옮긴 것"). Paragraph-level citation map (script run on the bodies):
   - ko: p13 73/88 | 8(6) p13 - | p4 p4/10 EX | 20% a25 a23 | a34 a92 mail
   - es: -   73/88 | 8(6) p13 - | p4 - p4/10 EX - | 20% a25 a23 | a34 a92 mail
   Same four sections in the same order with the same allocation of topics (ko 「계약에서 권리와 작업을 구분하는 이유」 ↔ es «Lo que se está pagando dentro del contrato»; 「해외 작업과 대만의 참여」 ↔ «El trabajo se hizo fuera…»; 「한 계약에서 갈리는 감면 서류」 ↔ «La retención y el convenio dependen del perceptor»; 「서류가 늦게 도착한 지급 건」 ↔ «Cuando falta un documento…»), the same unusual order 25 before 23 and 34 before 92, and paragraph-for-paragraph parallels: ko:38 「견적서부터… 나중에 … 용역비 비중만 늘린 표로는…」 ↔ es:38 «Dividir el precio en dos líneas… Una distribución preparada después del pago…»; ko:46 ↔ es:48 (same example and same "example, not an approved allocation" caveat). Only the opening (es:28 bookkeeper/perceptor question) is new. — Fix: rebuild es for Spanish-speaking residents of Taiwan with its own order and its own concrete situation (for example start from the perceptor question it already opens with, then go to the treaty/no-treaty question that a Spanish or Latin American supplier actually faces — see finding 5 — before the contract-classification material; or put the 10-day deadline first as ja does). Do not reuse the ko example paragraph. — Preserve: all Taiwan statutes, the 20% scope limits, 23 vs 25 difference, 2026-only 10-year rule, 10-day/5-day extension, e-service carve-out.

3. [MAJOR] ja.md vs zh.md — translation-like opening and body sequence. Both open with the same device: a residence certificate arrives from the foreign vendor but does not settle the payment (zh:28 「國外廠商寄來居住者證明…證明書能說明稅務居住身分，卻還不能單獨決定…」 ↔ ja:28 「日本の取引先から居住者証明書が届いても…」). After ja moves the 20%/10-day block forward, the remaining nine paragraphs follow zh exactly: zh a23 a25 「拿到證明就能付款嗎？要先辨明這次用哪個程序」 | 8(6) p13 報價依據 | p4 p4/10 EX ↔ ja a23 a25 「どちらの書類を依頼するのか。その判断には契約の中身が要ります」 | 8(6)+p13 二行の請求書 | p4 p4/10 EX. — Fix: give ja its own entry point and order for a Japanese reader (e.g. a Japanese subsidiary in Taiwan paying its Japanese parent, starting from the Japan–Taiwan 取決め question in finding 5, or from the 10-day payment deadline it already has), and drop the shared "which document to request" bridge paragraph. — Preserve: same Taiwan law content as listed in finding 2.

   Related (all five, counted under 2 and 3, fix together): the evidence example and its disclaimer are the same paragraph in every version — ko:46 「한국 팀의 분석과 대만 팀의 시험 결과… 이는 증빙을 정리하는 예시이며 특정 배분율이 승인된 사례는 아닙니다」, ja:58 「日本側の設計報告と台湾側の検証記録… これは資料整理の例で、承認済みの配分例ではありません」, en:42 「pair the US team's analysis with the Taiwan team's test records… That is an evidence-organizing example, not an approved allocation method」, es:48, zh:54. Each version should use a situation its own readers actually meet (only the team nationality changes now).

4. [MINOR] ko.md (whole), localization gap with a verified official source available — the ko piece is about paying a Korean vendor and explains treaty procedures (23/25/34) but never tells Korean readers that a Taiwan–Korea comprehensive agreement exists and applies. MOF agreement list (https://www.mof.gov.tw/singlehtml/191?cntId=63930, page updated 2026-09-04) lists 韓國(原協定) and 韓國(修正協議); the MOF consolidated text (https://www.mof.gov.tw/download/ea19d023141d4d3dbfbd122d99081c86) states the original agreement entered into force 2023-12-27 (signed 2021-11-17) and the amending agreement 2026-08-04; Art. 28(2)(1): withholding taxes apply to amounts payable on or after 1 January of the year after entry into force (i.e. from 2024-01-01); Art. 12(2): tax on royalties beneficially owned by a Korean resident may not exceed 10% of the gross amount. — Fix: add one short paragraph in ko (with both sources in the source list) saying the Taiwan–Korea agreement has applied to withholding since 2024-01-01 and caps royalties at 10% subject to the Art. 25 documents; keep the business-profit route under Art. 23. If the writer cannot verify, leave it out (do not guess). — Preserve: no claim about Korean domestic tax credit unless verified on a Korean official site.

5. [MINOR] ja.md / es.md — same kind of localization gap (optional but useful; 08:22 rule allows only verified comparisons). MOF list: Japan comprehensive agreement signed 2015-11-26, effective 2016-06-13 (Japan side calls it 日台民間租税取決め); Spain is not on either list; Paraguay is on the comprehensive list. es:56 «Hablar español no determina el convenio» would be more concrete with "Spain and most Latin American countries have no agreement with Taiwan on the MOF list; Paraguay does" (checked date). ja could name the Japan–Taiwan 取決め instead of the generic 「適用できる取決めがあることを前提に」. Any rate stated must be read from the agreement text itself.

6. [MINOR] ko.md:34 — 「계약상 사용 범위, 기간, 재허락 권한은 어떤 권리를 받았는지 설명하는 자료입니다. 작업도 입증합니다.」 — the last sentence has no subject and reads as if the licence terms also prove the work, which contradicts the next section. — Fix: 「작업은 작업 보고서와 산출물로 따로 입증합니다.」 — Preserve: 8(6) scope.

7. [MINOR] ko.md:44 — 「…대만 귀속 이익을 세무기관이 확인해 산정하도록 합니다」 — point 10(3) is permissive: 「得由稽徵機關核實計算及認定」 and only where the enterprise can provide such documents. — Fix: 「…증빙을 낼 수 있으면 세무기관이 대만 귀속 이익을 실제에 맞게 계산해 인정할 수 있습니다」. ja:56/en:40/es:46/zh:52 already use may/得/可/permiten — leave them.

8. [MINOR] ko.md:46, en.md:38, es.md:50, zh.md:56 — 「플랫폼·자동 전자서비스」 / "Platforms and electronically supplied services" / «Las plataformas…» / 「平台及其他電子勞務」 — the source (point 4 para 2; point 10 para 2) speaks of 電子勞務 supplied from abroad via download, online use or other electronic means; "platform"/"automatic" are not its categories, and the sentence has no citation. — Fix: ko 「인터넷 등 전자적 방식으로 해외에서 제공하는 용역(전자용역)은 인정원칙 제4점 제2항에 따로 정해져 있습니다」, en "Services supplied electronically from abroad (download or online use) are covered separately by point 4, paragraph 2", es/zh likewise (zh 「境外以網路或電子方式提供的電子勞務，另依第4點第2項認定」). ja:58 「電子的役務」 is fine; add the point reference.

9. [MINOR] en.md:36, es.md:42 — "comes within the source rules" / «entra en juego la fuente taiwanesa» — vaguer than the source, which says such remuneration IS Taiwan-source (point 4(1)(二)(三): 「需在中華民國境內及境外進行始可完成者」「須經由…參與及協助始可完成者」). ko:42, zh:50, ja:54 state it correctly. — Fix: en "is Taiwan-source income"; es «es renta de fuente taiwanesa».

10. [MINOR] ko.md:19, ko.md:52 — 「적용 심사준칙」 is not an understandable Korean name for 適用所得稅協定查核準則. — Fix: first mention 「소득세협정 적용 심사준칙(適用所得稅協定查核準則)」, then 「심사준칙」.

11. [MINOR] ko.md:60 — 「공제일부터 10일 안에 납부·영수증 신고 확인·교부를 요구합니다」 — compressed noun string, hard to read; 扣繳憑單 is called 원천징수영수증 at ko:21/58. — Fix: 「원천징수한 날부터 10일 안에 세금을 국고에 내고, 원천징수영수증을 세무기관에 신고해 확인받은 뒤 소득자에게 발급해야 합니다」. — Preserve: 10 days from withholding, 3+ consecutive holidays → +5 days.

12. [MINOR] ja.md:30 — 「以下は、この外国企業への支払を中心に扱います。」 — a preview sentence (EDITORIAL-VOICE: 예고 문장 생략); deleting it loses nothing because ja:36 handles individuals separately. — Fix: delete. Also ja.md:62 uses 「扣繳憑單」 while ja:21/38 use 「源泉徴収票」 — use one term (e.g. 「源泉徴収票（扣繳憑單）」 at first mention, then 源泉徴収票).

13. [MINOR] en.md:30 — "The supplier's work still needs examining." — filler sentence that repeats the opening question; the paragraph starts better with the Article 73 rule. — Fix: delete or replace with a fact.

14. [MINOR] es.md natural Spanish — es:30 «las rentas taiwanesas comprendidas en el artículo 88» (→ «las rentas de fuente taiwanesa comprendidas en el artículo 88»); es:36 «se valoran bajo el artículo 8, número 9» (anglicism → «se califican conforme al artículo 8, número 9»); es:56 «Debe faltar un establecimiento permanente o base fija en Taiwán, o faltar la vinculación efectiva del derecho con ellos» (awkward → «El perceptor no debe tener establecimiento permanente ni base fija en Taiwán, o el derecho no debe estar vinculado efectivamente con ellos»); «cánones» is the Spain term — for Latin American readers add «(regalías)» at first mention.

15. [MINOR] Overlap with existing 303 (taiwan-withholding-tax-payments-to-foreign-companies, ko/ja/en/zh): 303 already explains point 4 in full (three cases, 參與協助 definition, basic-information exclusion), the 20% rates, and the 23/25/34 files (e.g. columns/303:33, columns-en/303:35). P-TAX's new material is point 10(3) relative-contribution evidence and the point 13 本業/8(9) branch. The narrowed angle is acceptable, but ko/ja/en/zh should link to the 303 column in their language (/ko|ja|en|zh-hant/columns/taiwan-withholding-tax-payments-to-foreign-companies; files exist in ref) for the general background and keep the repeated background short. es has no 303 counterpart on the live list, so no link there.

## Verified OK

- 所得稅法 8 (items 6, 9), 73(1), 88, 92(2) — fetched LawSingle (tools/law.py, HTTP 200): 73 covers non-resident individuals and enterprises with neither fixed place nor agent; 92(2) 「代扣稅款之日起算十日內…遇連續三日以上國定假日者…延長五日」 matches all five versions.
- 各類所得扣繳率標準 3 — item 6 royalties 20%, item 10 other income of enterprise without fixed place and agent 20%, item 2 salary 18%/6%, item 8 professional fees 20%: drafts' "20% for royalties and ordinary service income, not universal for individuals" is accurate in all five.
- 適用所得稅協定查核準則 23 (residence certificate + no PE / not through PE + income documents; 給付人所在地 tax office; 副知扣繳義務人免予扣繳), 25 (cap at payment; residence + beneficial owner; para 4 「授權或技術服務合約（含中譯本）、計算權利金…之明細」; no PE/fixed base or no 實際關聯), 34 (所得人或扣繳義務人, 至遲自繳納之日起算十年內, 證明文件及扣繳憑單; para 3 transition for the 2025-04-08 amendment — so limiting the 10-year statement to tax paid in 2026 is correct; para 5 協定另有規定者從其規定) — all five versions match.
- 所得稅法第八條規定中華民國來源所得認定原則 (live, 修正日期 民國112年10月13日 = 2023-10-13): point 4 para 1 (二)(三), para 3 (設備、人力、專門知識或技術; excludes 基本背景相關資訊及應行通知或確認之聯繫事項), para 5 (一) exclusion, para 6 準用 point 10(3); point 10(3) list 會計師查核簽證報告、移轉訂價證明文件、工作計畫紀錄或報告; point 13 (釐清所得態樣; 本業 → 8(9); otherwise 劃分所得類別). Drafts' statements match (except wording points in findings 7–9). No headcount ratio exists in the text — drafts' statement correct.
- en.md:56 — MOF list (https://www.mof.gov.tw/singlehtml/191?cntId=63930) has no comprehensive US agreement; US appears only in the shipping/air list (海空運 S&A, 1988-05-31). Accurate and sourced in en.md:76.
- No judgments cited. No byline, signature, AI label, "lawyer reviewed", bold (`**`, `__`, `<strong>`, `<b>`) or emoji in any version. author: "legal-ai-assistant" only. No lawyer name or address used (address optional per gapfill TASK line 14). featured_image "TBD"; alt texts are generic fictional desk scenes.
- Front matter keys match gapfill S1 (title, seoTitle, summary, published, lastmod, date_display, read_time, categories, topic, tags, featured_image, featured_image_alt, faq ×3, audience, author); topic "tax" + tags ["tax-accounting"] per FRONTMATTER.md:102; zh audience ["zh-hant"]; es = en structure with audience ["es"], «Información jurídica de Taiwán», «5 min de lectura», «Fuentes oficiales», «Hovering International Law Firm» — matches live es columns (research/es/*.html).
- FAQ answers consistent with bodies in all five.
- Links: tools/links.py — external 10, non-200 0; no internal links.
- Variety: variety_metrics.py — ko FAIL 0 (WARN 87% 니다), zh-hant FAIL 0, ja FAIL 0 (WARN 88% desu-masu), en FAIL 0, es (--lang en) FAIL 0. Manual read: no checklist headings, no imperatives beyond legal duties, contrast templates within limits, last paragraphs tie to the payment facts.
- Overlap with live es list (18 slugs): none on withholding/treaty.
