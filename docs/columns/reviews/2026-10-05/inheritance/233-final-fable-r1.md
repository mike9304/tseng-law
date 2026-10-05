# I5 final review r1 — Claude Fable 5.1 (final gate)

Column: taiwan-parent-debt-renunciation-heir-in-japan (ko / ja / en / zh-hant)
Date: 2026-10-05

## Verdict

PASS. All four language versions are publishable as they now stand (after the two minor wording edits listed below). Image OK.

## Scope checked

Read in full: brief-SERIES.md, brief-EDITORIAL-VOICE.md, COLUMN-VOICE-RULE.md, topics/I5.md, drafts/I5/{ko,ja,en,zh-hant}.md, drafts/I5/facts.md (treated as a claim list, not as evidence), research/statutes.md (all 730 lines), judgments/PCDV-114-家聲抗-120.txt, TPDV-112-司繼-3207.txt, TPDV-115-司繼-236.txt, reviews/I5/voice-grok.md, reviews/I5/fix1-notes.md, lint.py, images/I5.webp.

Opened on 2026-10-05 to verify claims not covered by statutes.md:
- roc-taiwan.org/jpyok/post/13404.html (Yokohama branch: 「原則上授權人/拋棄人本人須親自至橫濱分處櫃檯辦理申請」, 「審查期間：一般為3-5個工作天」, page covers 授權書/委任書/拋棄繼承權聲明書) — matches all four versions.
- roc-taiwan.org/jp/post/22.html — lists Tokyo 代表處, 橫濱分處, 台北駐大阪經濟文化辦事處, 福岡分處, 那霸分處 (2007), 札幌分處 (2009) — matches the six cities named.
- boca.gov.tw page for 台北駐日經濟文化代表處 — 轄區「東京都、青森縣、岩手縣、宮城縣、秋田縣、福島縣、茨城縣、栃木縣、群馬縣、埼玉縣、千葉縣、新潟縣、山形縣、山梨縣及長野縣」 = Tokyo + 14 prefectures — matches ja.
- The sample 拋棄繼承權聲明書 PDF (read directly): has 「知悉得繼承日期：中華民國　年　月　日」, a 法定代理人 signature box, and a 備註 citing 民法 §1174 and §1176 — matches the claim in all four versions. The sample's filled-in names/address are template placeholders, not cited in the columns.
- e-Gov API: 通則法 §36「相続は、被相続人の本国法による。」; 民法 §915 I incl. ただし書 (家庭裁判所において伸長することができる); 民法 §938「…家庭裁判所に申述しなければならない。」 — all match ja/ko/en/zh-hant statements.
- law.moj.gov.tw §1174 live page — text identical to statutes.md.
- 繼承登記法令補充規定 第54點: glrs.moi.gov.tw and land.moi.gov.tw both refused the connection in this run. A search snippet from the official 地政司/glrs page returns the identical wording the ruling quotes (「繼承開始於民國74年6月5日以後者，旅外繼承人拋棄繼承權…逕寄其國內代理人向法院陳報」). Wording is therefore confirmed; the point number (54) rests on the ruling's citation (which calls it 第54條第2項) and on research/statutes.md. Every language's sources section already discloses that the text follows the ruling's quotation, so this stays a note, not a defect.
- Internal link targets confirmed present in the repo: columns/016-…custody-analysis.md and 031-hire-taiwan-lawyer-from-abroad.md in ko/ja/en/zh; columns-zh/060-taiwan-inheritance-renunciation-debt.md (zh-hant only, used only in zh-hant).

## 1. Law and facts (checked per language against the sources)

All of the following were traced to the source text and are correctly stated in every version where they appear:

- 涉外民事法律適用法 §58: connecting factor = decedent's nationality at death; heir's nationality/residence irrelevant. Correct in all four. (The §58 proviso about ROC-national heirs and Taiwan-situs estate is not needed for this scenario and is not misstated.)
- 民法 §1174 I/II/III: may renounce; written statement to court within 3 months of 知悉其得繼承; written notice to those who become heirs, unless impossible. Correct in all four; no extension clause (ja's §915 contrast is accurate).
- §1175 retroactive effect. §1148 II estate-limited liability. §1148-1 two-year gifts 視為所得遺產 (ko/ja/en; zh-hant omits it, which is not a contradiction). §1156 I/II (inventory within 3 months; court may extend on heir's application if necessary). §1162-1 I (proportional payment even without inventory). §1162-2 I/II (shortfall liability beyond estate; exception for 無行為能力人/限制行為能力人). All correct, including the AND/OR and the exception.
- §1176 I, V, VI, VII and §1138 (spouse outside the ranks). Correct in all four; the versions correctly say grandchildren take only when all children renounce, and the next rank only when the whole prior rank renounces.
- 家事事件法 §127 I(3) exclusive jurisdiction of the decedent's domicile court at opening of succession; §132 I items, II 備查/通知/公告, III 裁定駁回. Correct.
- 文件證明條例 §10 (apply to the mission with jurisdiction over the place the document was made). Correct, stated as 原則/as a rule.
- 新北 114家聲抗120 (2025-12-29 / 民國114年12月29日, 合議庭): heirs in the US; argued distance to the Denver office and notaries' doubts; court: 補充規定 route is for convenience only, no special rule on the period, §1174 II governs; 知悉 does not require knowing whether there is an estate; ignorance/misunderstanding of law irrelevant; 抗告駁回. All four versions state this accurately and as a district-court ruling.
- 臺北 112司繼3207 (2024-01-30 / 民國113年1月30日, 司法事務官): 知悉 = knowing death + having become an heir under §1138; death-certificate/Toronto-office delay rejected; 3 months = 除斥期間; knew on 111-12-11, filed 112-11-27 (eleven-plus months) — dismissed. Arithmetic checked: 2022-12-11 → 2023-11-27 = 11 months 16 days. Correct in all four.
- 臺北 115司繼236 (2026-03-11 / 民國115年3月11日, 司法事務官): mission-verified statement + 授權書 filed; statement's own 知悉得繼承日期 114-09-17 → deadline 114-12-17; filed 115-01-22; dismissed; documents listed 戶籍謄本、除戶謄本、繼承系統表. Arithmetic Sept 17 → Dec 17 correct. Correct in all four.
- "Court measured from the 收狀日期戳記/收狀戳": present in all three rulings. Correct.
- Japanese law: only §36 通則法, §938, and (ja) §915 — all quoted accurately, framed as general notes, with "ask a Japanese professional". No Japanese court practice asserted.
- 2026 figures / 2026-09-11 amendment: not relevant to this column and not mentioned; nothing outdated.
- No contradictions between the four versions on any point of law. Dates are Gregorian in ko/ja/en and ROC in zh-hant, each correct.

No major issue found.

## 2. Citations

- Inline links sit directly after the claims; statute links use the right pcode/flno (B0000001 民法, B0000007 涉外, B0010048 家事事件法, E0030012 文件證明條例) and the right article in every instance checked.
- Judgment links in all four files are byte-identical to the OFFICIAL URL on line 1 of each .txt.
- Sources sections list every source used in that version (zh-hant correctly omits §1148-1; ja correctly adds the BOCA page and §915) and carry the 2026-10-05 check date in the page language.
- Internal links exist in each language (lint OK; repo files confirmed).

## 3. Rules

- No private-party names in any version (checked against the names visible in the .txt files).
- No bold, no phone, no street address; one soft contact paragraph with the firm name and wei@hoveringlaw.com.tw only; author legal-ai-assistant; no lawyer-review or native-review claim.
- Hypotheticals marked 가령 / 例えば / Suppose / 假設; JP–TW pair kept in all four.
- Frontmatter per brief. en: title + " | Hovering Law" = 88 chars → seoTitle present (42 chars, differs from title); summary 160 chars, no forbidden characters. ko/ja/zh-hant seoTitle present and different from title.

## 4. Voice

- ko: calm 합니다체 throughout; title is a specific noun phrase; first paragraph states the rule, the second gives the hypothetical; no 예고 sentence; "먼저/다음으로" marks a real sequence. Reads as Korean, not translated.
- ja: consistent です・ます; opening contrasts with Japanese 熟慮期間 in a way a Japanese reader will immediately use; no 「〜について解説します」; headings specific. Natural.
- en: plain, active, must/may distinguished; no "navigate", "it is important to note"; romanised case numbers with Chinese in parentheses are consistent.
- zh-hant: Taiwan usage only (戶籍謄本, 除戶謄本, 地方法院, 聲請, 收狀); 家庭裁判所/申述 appear only as the Japanese institution's own names with an explanation; no simplified characters or mainland vocabulary (lint confirms). The 補充規定 quotation is verbatim from the ruling.
- None of the four repeats the 도입→세 가지→체크리스트 template; headings are column-specific; no closing recap.

## Issues (Original → problem & reason → fix → facts preserved)

1. ko, 「일본에서 준비하는 순서」: 「위 타이베이 사건의 신청인들은 호적등본…을 냈습니다.」 → Two Taipei rulings were just discussed (3207 and 236); "위 타이베이 사건" is ambiguous, and the document list is drawn from both. Minor clarity. → Applied: 「위 타이베이 두 사건의 신청인들은 …」 (ja/en already say 二つの事件 / two Taipei cases). → Documents, courts, dates unchanged.

2. en, 「Authentication in Japan does not stop the clock」: "…Representative Office in Japan (台北駐日經濟文化代表處) in Tokyo, with offices in Yokohama, Osaka, Fukuoka, Naha and Sapporo" → "with offices in" reads as if all five are branches of the Tokyo office; the official page shows Osaka (and Fukuoka) belong to a separate 台北駐大阪經濟文化辦事處. Minor accuracy of description, not of law. → Applied: "…in Tokyo, and Taiwan also has offices in Yokohama, Osaka, Fukuoka, Naha and Sapporo". → Same six cities, same link, no change to the §10 jurisdiction sentence.

3. All versions, 繼承登記法令補充規定 第54點 → Official text page could not be opened in this run (connection refused twice); wording independently confirmed via an official-page search snippet; point number rests on the ruling (第54條第2項) and research notes. → No change required: every sources section already discloses that the wording follows the ruling's quotation. → Noted here for the record only.

No major issues. Nothing else required.

## Minor edits applied

- drafts/I5/ko.md: 「위 타이베이 사건의 신청인들은」 → 「위 타이베이 두 사건의 신청인들은」.
- drafts/I5/en.md: "with offices in Yokohama, Osaka, Fukuoka, Naha and Sapporo" → "and Taiwan also has offices in Yokohama, Osaka, Fukuoka, Naha and Sapporo".
- ja.md and zh-hant.md: no edits.

Lint after edits (all four): OK — ko 3,055 chars, ja 3,551 chars, en 1,503 words, zh-hant 2,510 chars.

## Image verdict

OK. images/I5.webp shows a person seen from behind, seated at a low table in a tatami room with shoji, holding a blank sealed envelope beside a cup of tea at dusk. No face, no readable text, no logos, no flags, no identifiable document. It fits the column (a child in Japan receiving word from Taiwan and facing a deadline) and is respectful in tone.

## Limits of this review

Style judgments are a model's, not a native speaker's or a lawyer's. The official page of 繼承登記法令補充規定 was not reachable in this run (see issue 3).
