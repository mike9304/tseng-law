# review-r1 — fact-taiwan-mandatory-employment-period-2 (Claude Fable final review)

Reviewed 2026-10-12. Column taiwan-mandatory-employment-period, ko / ja / en / zh-hant.
Inputs read in full: issues.md, triage.md, verify.md, guard.txt, tests.patch, tests.txt, all four orig/draft pairs.

## Verdict

PASS. The only change in every language is the source-list link target for the Ministry of Labor letter (plus lastmod in ja and zh-hant). The old link opens an unrelated letter; the new link is the ministry database's own page for 勞動關2字第1150141814號函. Every statement the column makes about the letter and about Articles 15, 15-1 and 16 matches the official text I opened.

## How the official pages were reached

- law.moj.gov.tw: fetched directly (Articles 15, 15-1, 16). Footer 法規整編資料截止日：民國 115 年 10 月 02 日.
- www.mol.gov.tw press release: fetched directly.
- sa.hl.gov.tw (花蓮縣政府社會處 repost) and its PDF: fetched directly; PDF text extracted locally (2 pages).
- laws.mol.gov.tw: direct connection refused from this machine (`connect ECONNREFUSED 124.199.82.82:443`, same as verify.md reports). I read the new link, its print view and the old link through the reader proxy r.jina.ai. The text obtained that way is word-for-word identical to the directly fetched PDF and press release, so I accept it. A person inside Taiwan should still click the new link once after publishing (same open point verify.md raised; not blocking).

## Issue 1 — content attributed to 勞動關2字第1150141814號函 (2026-06-05)

Verdict in verify.md: ORIGINAL-RIGHT. I agree.

URLs opened and statute sentences checked:

- https://sa.hl.gov.tw/Upload/202606160816307999131.pdf (direct, text extracted). 發文日期：中華民國115年6月5日 / 發文字號：勞動關2字第1150141814號 / 主旨：有關勞動基準法第15條之1最低服務年限約定及違約金返還事項，請協助轉知轄內事業單位依法辦理.
  - 說明二(二)：「如屬例行性教育訓練、一般在職訓練、新進人員業務熟悉訓練，或依法應辦理之法定訓練所生費用，雇主均不得據以與勞工約定最低服務年限，亦不得作為請求違約金或返還費用之依據。」
  - 說明二(三)：「雇主如以留任獎金、簽約金或其他預付性給付，作為最低服務年限約定之合理補償，應明確告知；勞工於約定期限屆滿前離職時，倘雇主要求勞工返還之金額，應依尚未履行服務期間按比例計算，不得要求全額返還。」
- https://sa.hl.gov.tw/Detail_sp/ec6094058f1642e8be7d325366e97361 (direct): 【轉知】勞動部函釋有關勞動基準法第15條之1…, 2026/06/16, 勞資科, attachment 勞動部函釋.pdf = the PDF above.
- https://www.mol.gov.tw/1607/1632/1633/90890/ (direct): 發布日期 2026-06-05, items (一)(二)(三) identical to the PDF.
- https://laws.mol.gov.tw/FLAW/FLAWDOC03.aspx?datatype=etype&N2=1150141814&cnt=1&now=1&lnabndn=1&recordno=1 and PrintFLAWDOC03 with the same query (via reader): 發文字號 勞動關 2字第 1150141814 號函, 發文日期 民國 115 年 06 月 05 日, 相關法條 勞動基準法 第 15-1 條, 共 1 筆 / 現在第 1 筆, 說明 identical to the PDF.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=15-1 (direct): the four paragraphs quoted in verify.md are the current text (two alternative grounds in ¶1, four factors in ¶2, 「違反前二項規定者，其約定無效」 ¶3, ¶4 on termination not attributable to the worker).

Per-language result (no text changed; checked that the live wording is right):

- ko: number 勞動關2字第1150141814號, date 2026년 6월 5일; four types 정례 교육 / 일반적인 직무교육 / 신입사원의 업무 적응 교육 / 법률상 실시해야 하는 의무교육 with consequence 최소 근무기간 약정이나 위약금·비용 반환 청구의 근거로 삼을 수 없다; 고지 duty; 미이행 기간 비례, 전액 반환 불가. Matches 說明二(二)(三). Art. 15-1 ¶1–¶4 statements match.
- ja: 勞動關2字第1150141814號, 2026年6月5日付; 定例研修 / 一般的な職務研修 / 新入社員の業務適応研修 / 法令上実施しなければならない義務研修; 告知; 未履行期間に応じて計算、全額返還不可. Matches. Art. 15-1 statements match.
- en: Letter No. 勞動關2字第1150141814號, June 5, 2026; routine education / ordinary on-the-job training / new-hire adaptation training / legally required training; disclosure; proportional to the unserved period, no full repayment. Matches. Art. 15-1 statements match.
- zh-hant: 勞動關2字第1150141814號函, 2026年6月5日; 例行教育訓練 / 一般在職訓練 / 新進人員熟悉工作環境與流程的訓練 / 法令要求雇主辦理的訓練 (paraphrase of 新進人員業務熟悉訓練 and 依法應辦理之法定訓練, same category, same consequence); 揭示其作用; 按尚未履行期間比例, 不得要求全額返還. Matches. Art. 15-1 statements match.

Also checked, because the column states them: Article 15 (直接 fetched) 「特定性定期契約期限逾三年者，於屆滿三年後，勞工得終止契約。但應於三十日前預告雇主。不定期契約，勞工終止契約時，應準用第十六條第一項規定期間預告雇主。」 and Article 16 ¶1 (10 / 20 / 30 days by 3 months–1 year / 1–3 years / 3 years+). All four languages state these correctly, including that Art. 16 governs employer termination and applies to resignation through Art. 15.

## Issue 2 — the MOL source link

Verdict in verify.md: CONFIRMED-ERROR (link only). I agree.

- Old link https://laws.mol.gov.tw/FLAW/FLAWDOC03.aspx?cnt=926&datatype=etype&edate=99991231&lnabndn=1&now=1&recordno=10&sdate=20180000 (via reader): single-document page titled 勞動部勞動法令查詢系統-判解函釋, but the document is a reply to 美字第11504001號函 about agency service fees for foreign workers (要旨「雇主自願代為負擔外國人應給付予私立就業服務機構之「服務費」…」). It does not mention 最低服務年限 or 第15條之1. The address is a list position (record 10 of 926), so it drifts as new letters are added.
- New link (via reader, see Issue 1): the letter itself, keyed by document number (N2=1150141814), 共 1 筆.
- Per language: ko, ja, en, zh-hant all replace exactly this target; every label is unchanged and still describes the letter correctly. REMOVED-URL line is present in verify.md and explains the replacement.

## Scope (diff of each pair)

- ko: one hunk, link target only. lastmod already "2026-10-12" in orig.
- ja: lastmod "2026-10-06" → "2026-10-12"; link target. Nothing else.
- en: one hunk, link target only. lastmod already "2026-10-12" in orig.
- zh-hant: lastmod "2026-07-25" → "2026-10-12"; link target. Nothing else.
- No new facts, no removed source entries, no wording changes. factguard: PASS (re-run by me, output identical to guard.txt).

## Language

No sentence was edited, so nothing to assess. The four link labels are unchanged and read natively.

## Tests (tests.patch)

- Only re-anchors: the four officialLinks arrays (URL swap, labels unchanged), ja and zh lastmod / date expectations, and three content digests.
- I recomputed the digests against the drafts: ja immutable prefix (first 4,418 bytes) sha256 e83db8e0…475db ✓; ja tail from 「## 最低勤務期間条項が有効になる条件」 length 24,075 (old 24,094; the new URL is 19 bytes shorter) sha256 c39b97ce…de3a3 ✓; zh-hant whole-file sha256 268d6553…114f9 ✓.
- No `.skip` / `.only`. The fact-locking assertions (official URL list, frontmatter, digests) still lock the corrected text. tests.txt: 80 test files passed after re-anchoring.

Tests verdict: PASS.

## Tiny edits made by the reviewer

None.

## Non-blocking notes

- variety_metrics: ko WARN, ja WARN, en OK, zh-hant 3 FAIL (len_cv 0.438, short_share 0.047, contrast 6). The zh-hant output is byte-identical for orig and draft, i.e. the FAILs are in the live text and predate this job. Rewording is outside a fact fix's scope, so I did not touch it; it belongs in a separate editorial job for the zh-hant column.
- Someone with direct access to laws.mol.gov.tw should open the new link once in a browser after publishing. Everything it shows through the reader proxy matches the directly fetched PDF and press release word for word.

VERDICT: PASS
