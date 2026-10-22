# CROSS-opus — P-CORP

검수: 2026-10-21 09:19 KST. 작성자 astra, 교차 검수자 opus. 판정: REQUEST_CHANGES — MAJOR 2, MINOR 12 (+1 optional note).
이 문서는 작성자 간 교차 검수이며 별도 새 Astra max 최종 게이트를 대신하지 않는다. 원고와 WROTE 표시는 수정하지 않았다.
기준: TASK.md(08:22 변경 포함), ISSUE-SPEC(이슈), gapfill TASK·FRONTMATTER(갭), EDITORIAL-VOICE, SENTENCE-VARIETY-RULE, LESSONS, SUPERVISOR-NOTE-0835/0905.

대상 SHA-256:
- `drafts/gap/P-CORP/ko.md` `950080da80a1dc72eb04f3daee269b480eced58c2800300c977f4f5f67875f06`
- `drafts/gap/P-CORP/zh.md` `7ffd9db4b4d1644fc2ad00c603011df5c7e7eeec50d6f5c34ba59cbeba8a88c2`
- `drafts/gap/P-CORP/ja.md` `9fdef4937731e164924bfca0c400eab07ed21e70f5de89eb597b4faede219451`
- `drafts/gap/P-CORP/en.md` `8d2d16300e2c674130177bf78eca6f4bc198e68ce5207ac5adce7e6437c210bb`
- `drafts/gap/P-CORP/es.md` `345f7987d6465783b9b1515843d6ed71e878f21a0f87bd52bdd08c2e2e70a6b1`

## 리드 확인 메모

- MAJOR 1 (193조 2항 "불참"): LawSingle J0080001-193 원문 「參與決議之董事，對於公司負賠償之責；但經表示異議之董事…免其責任」을 리드가 다시 열어 확인. 불참 이사는 결의 참여자가 아니므로 단서가 필요 없는데, 다섯 언어 모두 "침묵·불참"을 단서 미충족 사례로 묶어 책임 범위를 잘못 안내함. facts.md:14의 「曾表示異議」 인용도 원문은 「經表示異議」 — 내부 파일이지만 같이 고칠 것.
- MAJOR 2 (es≈en): 리드가 en/es 본문을 문단 단위로 나란히 읽음. 도입(監察人/"supervisor" 직함 오해) → 218/218-2 → "본사 보고만으로는 통지 의무 충족 아님" → 224/226/8 → 8(3) → 193 → 23(2) 블록과 문장 쌍이 대응(예: "Ownership alone does not answer that question" ↔ «Ser accionista no basta»). 08:22 규칙상 게이트 FAIL 사유.
- MINOR 7: GetJudHistory(SCDV,108,金,5,20240503,4) 리드 재조회 — 臺灣高等法院113年度審金上字第30號(114.01.09), 114年度金上字第2號 계속 중 확인.
- 항목 5(사무소 주소 없음)는 gapfill TASK가 "office address, if used"로 정하므로 결함이 아니라 형식 통일 권고(optional)로 낮춤.

작성자는 각 지적을 직접 확인해 반영하거나, 틀린 지적이면 같은 폴더(이슈는 파일 옆)에 근거를 담은 rebuttal.md를 남긴 뒤 검사를 다시 돌리고 READY를 만든다.

## Findings

1. [MAJOR] ko.md:35, zh.md:43, ja.md:53, en.md:45, es.md:59 (and facts.md:14): absence is treated as failing the dissent proviso.
   - Quoted: ko 「침묵이나 불참만으로는 반대 의사를 표시했다는 요건을 대신하지 못하며」 / zh 「只有沉默或沒有出席，並不符合條文明定的異議條件」 / ja 「沈黙や欠席だけを異議の表示と扱う規定ではなく」 / en "Silence and absence alone do not establish the required objection" / es "El silencio o la ausencia no equivalen por sí solos a esa oposición". facts.md:14 says 「침묵·불참 자체…에 포괄 면책을 부여하지 않음」.
   - Problem: the statute puts liability under 193(2) only on directors who took part in the resolution: 「董事會之決議，違反前項規定，致公司受損害時，參與決議之董事，對於公司負賠償之責；但經表示異議之董事，有紀錄或書面聲明可證者，免其責任。」 (LawSingle J0080001 flno=193, opened 09:12). An absent director did not take part in the resolution, so the proviso is never needed for them. Putting "absence" next to "silence" as something that fails the proviso tells readers that absent directors are inside 193(2) and need the exemption. That misstates who the provision makes liable. All five versions carry it.
   - Fix: remove "absence / 불참 / 沒有出席 / 欠席 / ausencia" from these sentences and keep only silence. If the context helps, say that the proviso concerns a director who attended and took part in the vote (e.g. ko 「결의에 참여하면서 침묵만 했다면 이 단서의 반대로 보기 어렵습니다」). Do not add a new claim about absent directors' liability under Art. 23 unless it is sourced.
   - Preserve: proof is not limited to the minutes (record or written statement); the exemption covers only the liability for that resolution, not separate unlawful execution.

2. [MAJOR] es.md vs en.md: es reads as a reordered adaptation of en (08:22 rule: same opening idea, same examples, same first-section order).
   - Opening: both start from the word 監察人/"supervisor" being misread by a foreign reader (en:27 "The title needs care… this is not the employee's line manager" / es:27 「traducirlo simplemente como «supervisor» puede dejar una duda」).
   - The first section uses the same three-paragraph block in the same order: trigger and powers under 218-2/218, then "commercial disagreement is not the trigger", then "who received it / reporting only to head office is not necessarily enough" (en:33–37 / es:33–37).
   - Sentence pairs that are near translations:
     - en:33 "Mere disagreement with a commercial decision is not the wording of this provision." ↔ es:35 「Un desacuerdo comercial, por sí solo, no es el supuesto descrito en esa norma.」
     - en:37 "Reporting only to US head office does not necessarily satisfy a duty whose specified recipient is the Taiwan board or director." ↔ es:37 「…no necesariamente acredita la notificación exigida al órgano o administrador taiwanés.」
     - en:41 "A board member may have opposed the same transaction before the supervisor intervened." ↔ es:57 「Un administrador pudo haberse opuesto a la operación antes de que interviniera el supervisor.」
     - en:51 "Ownership alone does not answer that question… nor one isolated email establishes the entire case" ↔ es:51 「Ser accionista no basta… Una recomendación aislada no permite reconstruir toda la relación.」
     - en:53 ↔ es:53: the same three sentences (same civil/criminal/administrative liability, each liability keeps its own elements, the government-director exception does not cover ordinary foreign-parent instructions).
     - en:59 "It presupposes liability on both sides." ↔ es:43 「La norma parte de que ambos tengan responsabilidad」.
   - The es text also never names a situation specific to Spanish-speaking residents ("una persona hispanohablante que participa en una sociedad taiwanesa" is generic).
   - Fix: rewrite es from a different real situation that Spanish-speaking readers run into in Taiwan (for example, a nominee of a Spanish or Latin American investor in a Taiwanese joint venture who is asked to sign or approve a transaction, or who receives board papers in Chinese only). Use its own section order and its own examples, and do not reuse the en sentences listed above. A home-country comparison is optional and needs an official source (BOE / national gazette); otherwise leave it out.
   - Preserve: all Taiwan statute content (8, 8(3) with the government exception, 23(1)(2), 193, 218, 218-2, 224, 226), the scope (股份有限公司 with board and 監察人), and the hedges ("no necesariamente", each liability keeps its own requirements).

3. [MINOR] All five versions: the 193 example paragraph is the same block in every language.
   - Locations: ko:33–35, zh:41–45, ja:51–53, en:41–45, es:57–59.
   - The same three evidence items appear everywhere (written statement + delivery record + agenda/proposal), followed by the same two caveats (silence/absence; later separate unlawful execution). ko:35 and ja:53 are almost sentence-for-sentence (「의사록만 인정되는 것은 아닙니다. 당시 제출한 반대 성명과 발송 내역, 안건 자료…」 ↔ 「議事録だけに限りません。反対声明と送付記録、当日の議案を…」).
   - Fix: keep the legal elements but tie the example to each reader's practice: ko, a Korean-language memo or email to Korean HQ legal; ja, a 稟議 or an approval email from Japan versus the Taiwan minutes; zh, the local 議事錄 sign-off and correction practice; en/es, as rewritten under item 2.
   - Preserve: the record or written statement rule and the limit of the exemption.

4. [MINOR] ko.md:27 vs zh.md:27: both versions open on the same hook. Each asks what record a dissenting director can rely on when the minutes miss the dissent, and answers with 193's 「有紀錄或書面聲明可證」.
   - Fix: zh should open from a Taiwanese reader's own position. For example, a Taiwanese person serving as local 董事 or 監察人 of a 外商子公司 who receives instructions or a report request from overseas HQ.
   - Preserve: the 193 content.

5. [NOTE — optional, not a defect] Contact line: all five versions give the email only and leave out the office address.
   - Locations: ko:57, zh:59, ja:61, en:63, es:63.
   - The gapfill format this lane must follow (e.g. ~/tseng-gapfill-1020/drafts/S1/ko.md:62, en.md:62) gives the email plus the Taichung office: 40453 臺中市北區館前路19號6樓之1. In en the format is "6F-1, No. 19, Guanqian Rd., North Dist., Taichung City 40453 (40453 臺中市北區館前路19號6樓之1)".
   - Fix: add the address in the same one-sentence contact line. No lawyer name or title in the body.

6. [MINOR] Front matter: `tags:` is missing in all five files. Every READY gapfill draft (S1–S8) and the opus P-* drafts carry `tags: [...]` in the language of the file.
   - Fix: add `tags` (e.g. ko ["대만 회사법", "이사회 결의", "監察人", "외국인 투자 자회사"]; en/es equivalents).

7. [MINOR] ja.md:35, 69: appeal status of the cited judgment can be stated precisely.
   - The draft says 「上訴し得る判決であり、ここでは確定したとは扱いません」.
   - The Judicial Yuan case history (GetJudHistory for SCDV,108,金,5,20240503,4, fetched 09:12 KST) lists 臺灣高等法院113年度審金上字第30號 (114.01.09) and 臺灣高等法院114年度金上字第2號, with no appellate judgment text listed. In other words, the case is on appeal.
   - Fix: e.g. 「一審判決で、臺灣高等法院に控訴審が係属しています（114年度金上字第2號）」 plus "as of 2026-10-21". Alternatively keep the current wording but add 確認日.
   - The description of the holding is accurate. Checked against the judgment text (data.aspx, fetched 09:12 KST, HTTP 200):
     - 「不得單以公司法第27條第3項賦予法人股東改派代表人補足任期之權限」 — the power to replace the representative is not enough.
     - 「被告東芝公司係由日本總公司決定晶片之價格…並無任何證據顯示…實質控制…而實質指揮董事執行業務」.
     - The pre-2018 「公開發行股票之公司」 limit.
     - The appeal notice 「判決送達後20日內」.
   - Nit: the price evidence concerned chips (晶片). 「部品価格」 is acceptable; 「チップの価格」 would be closer.

8. [MINOR] ja.md:20 (FAQ 3) is stronger than the body and the other versions.
   - FAQ: 「本社への報告だけで、この通知を済ませたことにはなりません。」 Body ja:43: 「…果たしたとは限りません」. zh 「未必」, en "does not necessarily", es "no necesariamente".
   - The hedge matters: if the HQ recipient is also a Taiwan director, a report could reach a statutory addressee (218-2: 「通知董事會或董事」).
   - Fix: 「…済ませたことになるとは限りません」.

9. [MINOR] ko.md:39 and ja.md:41: supervision is presented as one of the things a supervisor "can" do.
   - ko: 「감사는 회사의 업무 집행을 감독하고, … 보고 요구를 할 수 있습니다」. ja: 「業務執行を監督し、…報告要求ができ」.
   - 218(1) makes supervision a duty (「監察人應監督公司業務之執行，並得隨時調查…」); facts.md itself says 「감독은 의무, 개별 조사 수단은 得」. zh, en and es keep the duty.
   - Fix: ko 「감사는 업무 집행을 감독해야 하고, 그 과정에서 … 할 수 있습니다」; ja 「業務執行を監督する義務があり、そのために…できます」.

10. [MINOR] ko terminology. 負責人 is left untranslated in Korean prose (ko:47 「회사의 負責人에게」「이사는 負責人이고」, ko:55, ko:61), and 經理人 appears as bare 「경리인」 (ko:39).
    - Existing ko columns write 「책임자(負責人)」 and 「경리인(經理人)」 (e.g. ref columns/067, 305, 610). Bare 경리인 reads as "bookkeeping clerk" to Korean readers.
    - Fix: 「책임자(負責人)」 on first use and 「경리인(經理人)」.

11. [MINOR] es.md:29: link label and target do not match. 「[Ley de Sociedades (公司法)](…pcode=J0080001&flno=218)」 labels the whole Act but points to Article 218 (LESSONS #1).
    - Fix: drop the link here (the articles are linked later), or link the Act to https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080001. Live es columns write 「Ley de Sociedades de Taiwán (公司法)」.
    - Related: es.md:33 「Conforme al artículo 218, el supervisor societario debe supervisar… Le permite investigar…」 — 「Le permite」 has no clear subject. Fix: 「La misma norma le permite…」.

12. [MINOR / MONOTONY] Supervisor note 0835 item 2 was only partly addressed. The paragraph-final verdict lines the note quoted are still there, reworded.
    - "Head-office approval does not exempt": en:55 "Approval from the parent does not discharge those duties.", ja:49 「本社の承認があっても、この義務は残ります。」, es:49 「La aprobación de la matriz no elimina esos deberes.」, zh:37 「母公司同意，不能直接回答董事是否盡責。」
    - "Loss alone is not enough": ko:55 「거래에서 손실이 났다는 사실만으로 이 요건이 채워지지는 않습니다.」, zh:57 「一筆交易虧損，尚不足以回答這些問題。」, en:61 "A transaction losing money is not enough to establish those conditions."
    - en is the strongest case. Six of fifteen paragraphs end on a negative verdict sentence: 33, 45, 53, 55, 59 ("It presupposes liability on both sides."), 61.
    - zh closes most paragraphs on a short didactic line (33, 37, 43 「免責範圍也有限。」, 49 「監督可以從具體資料開始。」, 53 「不能省略各自成立責任的前提。」, 57).
    - MONOTONY: paragraph endings — quoted above — move the point into the flow (cause → consequence), cut the formulaic closers, and keep each closer only where it carries a fact.

13. [MINOR] zh voice (Taiwanese reader). Several lines read as translated or official in tone:
    - 「以下的董事會與監察人程序，以採這種組織的股份有限公司為範圍。」 (29; a scope announcement → fold it into the previous sentence: 「…以設董事會與監察人的股份有限公司為例」)
    - 「母公司同意，不能直接回答董事是否盡責。」 (37), 「尚不足以回答這些問題」 (57). 「回答…問題」 is translationese; use e.g. 「母公司點頭，不代表董事就已盡到義務。」
    - 「要逐一接得起來」 (57)
    - 「授權表」 (35); 「核決權限表」 is the usual Taiwanese term.
    - Preserve the 應/得 distinctions.

14. [MINOR] ko voice:
    - ko:27 「…가정해 보겠습니다」 and ko:29 「위 상황은 설명을 위한 가정이며, 여기서는 … 다룹니다」 label the same hypothetical twice and add a scope announcement (SENTENCE-VARIETY 2-4, EDITORIAL 예고문). Keep one label, e.g. 「(가정한 사례입니다)」 after the scene, and fold the scope into the next sentence.
    - 「도움이 됩니다」 ×2 (35, 57). EDITORIAL-VOICE: say what it helps with.
    - ko:57 「이사는 반대 표시를, 감사는 중지 통지를 설명해야 할 수 있습니다.」 is vague.

15. [MINOR] en voice:
    - en:27 "a 監察人 holds a corporate oversight office; this is not the employee's line manager" — no antecedent for "the employee". Suggest "…is a statutory oversight officer, not anyone's line manager".
    - en:33 "Mere disagreement with a commercial decision is not the wording of this provision" is unidiomatic. Suggest "The provision is triggered by a violation, not by disagreement with a business call".

## Verified OK (evidence)

- Statutes, opened via `python3 tools/law.py J0080001 8 23 193 218 218-2 224 226` at 09:12 KST (all HTTP 200):
  - 8(1)(2)(3) incl. the government-director exception; 23(1)(2); 193(1)(2); 218(1)(2); 218-2(2); 224; 226.
  - Every claim in the five versions matches the article text except item 1 (and the nuance in item 9).
  - Every inline link's pcode/flno matches the article named, except es:29 (item 11).
- Judgment 新竹地方法院108年度金字第5號 (113-05-03):
  - Fetched directly from judgment.judicial.gov.tw (data.aspx, HTTP 200) and cross-checked with research/astra/judgment-web-evidence.json L778–781.
  - ja describes the holding correctly as first instance.
  - No party names: the judgment's parties (a Japanese electronics group and a Taiwanese listed company) are not named.
  - The 2018 amendment that deleted 「公開發行股票之」 is correctly stated.
- Foreign-law comparisons: none in any version (no Japan 会社法, US/Delaware, Korea 상법 or Spanish law claims), so there is nothing to source. ja:39 only says not to equate titles.
- Hygiene, all five versions:
  - No bold, emoji, byline, author line, AI label or "reviewed by a lawyer" claim. `author: "legal-ai-assistant"` is the only author token.
  - featured_image "TBD"; alt texts are generic fictional scenes.
  - es front matter matches the en structure with audience ["es"]. Category 「Información jurídica de Taiwán」 and 「5 min de lectura」 match the live es pages (research/es/*.html).
  - date_display, read_time and categories match the gapfill format per language.
  - No lawyer name. No internal links. `tools/links.py`: 8 external URLs, non-200 = 0.
- Variety (`variety_metrics.py check`): ko FAIL 0 (WARN 86% 니다), zh-hant OK, ja FAIL 0 (WARN 78% です・ます), en OK, es (run as en) OK.
- Overlap:
  - grep of ref columns{,-ja,-en,-zh}: no column cites 218-2 or 監察人 stop notices.
  - 8(3) is covered only by 067 (general responsible-person liability, ko/ja/zh).
  - flno=193 hits are unrelated civil-procedure articles; astra also reported a single paragraph in JA 036.
  - The narrowed angle (193 dissent proof + 218-2 notice addressee + 8(3) HQ control) is new.
  - Live es list (18 columns): nothing on directors or supervisors.

## Notes (not findings)

- Only ja cites the Hsinchu judgment. Nothing contradicts it elsewhere, so this is consistent. Adding it to en or zh is optional.
- The ko/ja WARN on sentence endings comes from the register and is not a FAIL.
