# I6 final review (Claude Fable 5.1, round 1) — us-living-trust-will-taiwan-property

Date: 2026-10-05. Reviewer did not write the column.

## Verdict

PASS. All four languages (ko, ja, en, zh-hant) are publishable as they now stand. Two minor wording edits were applied (listed below); no facts, numbers, citations or legal meaning were changed. Image: OK.

## Scope checked

- Read in full: brief-SERIES.md, brief-EDITORIAL-VOICE.md, COLUMN-VOICE-RULE.md, topics/I6.md, drafts/I6/{ko,ja,en,zh-hant}.md, drafts/I6/facts.md, research/statutes.md (730 lines), judgments/TPHV-111-家上-312.txt, judgments/TYDV-112-家繼訴-31.txt, reviews/I6/voice-grok.md, reviews/I6/fix1-notes.md, images/I6.webp.
- Opened on 2026-10-05 (WebFetch) to check items not in statutes.md or flagged by the fact sheet: 民法第758條, 涉外民事法律適用法第38條, 信託法第1條, 土地登記規則第123條, 民法第1223條 single-article page and 民法 LawAll page (修正日期 115-08-17; 「一百十五年八月十七日修正公布第1223條條文，自公布六個月後施行」, 尚未生效), 遺產及贈與稅法 LawAll (修正日期 115-09-11) and 第6條 (第4項 遺囑執行人 text; 第59條 本法自公布日施行), MOF 115年 amounts announcement (2025-11-27) and 北區國稅局 2026-05-21 page (免稅額 1,333萬元), MOF 2026-09-11 press release, etax Q&A 3108 (臺北國稅局 for 經常居住國外之國民及外國人) and 3111 (國外出具之證明文件應經我國當地駐外機構簽證並檢附中文翻譯版本).
- Lint: all four files OK before and after my edits (ko 3,487 chars; ja 4,061; en 1,587 words; zh-hant 2,695). lint.py also verifies that each internal `/<lang>/columns/<slug>` link exists in the repo for that language, so link existence is confirmed.
- Grep for `**`, `__`, `<b>`, `<strong>`, phone patterns, LINE/Kakao, address fragments: no matches in any file.

## 1. Law and facts (per language)

Every statement below was traced to the source; the four versions agree with each other on the law.

- 涉外民事法律適用法 §60 I/II (formation/effect at making; revocation at revocation), §61 (form: national law or place of making / domicile at death / situs for real estate), §2 (closest nationality), §5 (country with regional laws: that country's conflict rules, else most closely connected law), §58 and proviso, §38 I (物權依物之所在地法): correctly stated in ko/ja/en/zh-hant. The en gloss "What a given state's law says is a question for a U.S. attorney" states no US law.
- 信託法 §1 (definition) and §4 I (registrable property: no 對抗 without trust registration) / §4 III (shares: notice to issuing company): correct in all four; zh-hant omits §1 and its source list correctly omits it.
- 民法 §758 I: correct. The conclusion "no transfer/trust registration → apartment still the decedent's at death" follows from §758 + §38 and is phrased as a consequence of the statutes, not as land-office practice.
- 桃園地院 112年度家繼訴字第31號 (2024-07-22): dual Canadian–ROC; will made in Canada 2002 (91-01-04); moved back to Taoyuan; no exit after 2018 (107年) entry; closest nationality ROC → ROC law for formation/effect; no 駐加拿大辦事處 authentication → no presumption of genuineness; signatures of testator and witnessing lawyer not found genuine; §1190/§1194 requirements not met; distribution by will rejected; estate divided by 應繼分 (after deducting advanced funeral/care costs — the columns' "by statutory shares" is an accurate summary). All four mark it as a district-court ruling. No party named.
- 臺灣高等法院 111年度家上字第312號 (2023-01-31): ROC national, will made in the US; bank refused payment citing inability to judge validity/executor appointment; §60 I → ROC law; 代筆遺囑 with three witnesses, one as scribe; 駐洛杉磯台北經濟文化辦事處 certified the signatures; presumed genuine (民訴§356); formally meets §1194; original judgment reversed; appellant (次女) confirmed as executor. The columns say "child/子/子女/자녀" only. None of the versions claims that form alone decided the executor question (the court also found the testator's intent), so the summaries stay within the text.
- 民法 §1189, §1190, §1191 (incl. II: 僑民 before consul), §1194 (three or more witnesses), §1187, §1225: correct. "A typed will signed before two witnesses is not holographic and is short of the three witnesses a dictated will needs" is a literal application of §1190/§1194 and is stated as such.
- 民法 §1223: the column states only the spouse / lineal-descendant figure (one half), which holds under both the amended text (not yet in force) and the pre-amendment text applied in 桃園31 (特留分 1/6 = half of 1/3). Amendment date 2026-08-17 and "six months after promulgation" match law.moj.gov.tw. Telling readers to check the text in force on the date of death for other heirs is the right caution. No calendar in-force date is asserted (page says 未定).
- 遺產及贈與稅法 §1 II, §4 III/IV (domicile within 2 years, or residence + >365 days in 2 years), §3-1, §23 I (six months from the day after death) and II + Q&A 3108 (臺北國稅局), Q&A 3111 (TECO certification + Chinese translation), §18 II (exemption applies alike) with the 2026 figure NT$13.33 million (1,333萬) dated to 2026, §17 II (items 1–7 not applicable; spouse/children/parents named as examples — those are items 1–3), §8 I, §42: all correct in all four. §6 IV (executor may file/pay for the heirs and legatees) correctly tied to the 2026-09-11 amendment; the amended act is in force from promulgation (§59), and the columns do not misstate this.
- 土地登記規則 §119 (documents), §123 I (heirs register first then apply with legatee; executor registered then applies with legatee), §124 (definition of trust registration): correct. 外交部及駐外館處文件證明條例 §10: correct.
- Arithmetic: no worked example with figures beyond the exemption amount; nothing to recompute.
- Foreign law: ko only a 유류분 gloss; ja one "consult a Japanese professional" sentence; en/zh-hant one US-tax caution each. No foreign court practice stated.
- Summary/FAQ: no claim wider than the body. The ko/ja/zh-hant summaries say inheritance registration needs the tax-paid or exemption certificate "etc." (matches §42/§119 rather than overstating §8).

Result: no major issue in any language.

## 2. Citations

- Inline links sit right after each claim; each statute link points to the article it supports (checked every flno in all four files against the claim).
- Judgment links are exactly the OFFICIAL URL on line 1 of each .txt.
- Sources sections list every source used, headings in the page language, check date 2026-10-05 in all four.
- Internal links: ko/ja: foreign-heir-taiwan-succession-law-land, taiwan-estate-tax-foreign-decedent; en: those two plus taiwan-bank-inheritance-us-power-of-attorney (allowed by the topic brief); zh-hant: those two plus reserved-share-will-inheritance-dispute. All exist per lint; none is from this batch.

## 3. Rules

- No private-party names (court, case number, date, holding only). No bold or bold workarounds. No phone, LINE/Kakao, or street address. Email-only contact paragraph with the correct firm name per language, one short paragraph before the sources. `author: "legal-ai-assistant"` in all four. No lawyer-review or native-review claim. Hypotheticals marked 가령 / 例えば / Suppose / 假設 and the US–TW pair kept in every language. Frontmatter keys per brief; en seoTitle 41 chars (title + " | Hovering Law" exceeds 60); en summary within limits (lint OK).

## 4. Voice

- ko: 합니다체 throughout; title names the actual question; the opening gives the hypothetical and the conclusion within two paragraphs; headings are specific; no checklist or template. Nothing to change.
- ja: natural です・ます; no 「解説します」 openers; glosses (日本の遺留分にあたる制度, 日本の法務局にあたる窓口, 日本の地方裁判所にあたる) read naturally. Nothing to change.
- en: plain, active; one clipped sentence fixed (below).
- zh-hant: Taiwan usage only (地政事務所, 臺北國稅局, 駐外館處, 資訊); no simplified characters or mainland terms found; one unclear pronoun fixed (below).

## Issues found (format: original → problem & reason → fix → facts preserved)

1. en, section "Questions to raise while the plan is still being drafted":
   `And actually holding the Taipei apartment in trust means a trust registration in Taiwan (…) and a separate look at the tax consequences.`
   → "And actually" opens the sentence like spoken filler and the bare present "means" reads as a rule rather than a consequence of a choice. Minor.
   → Applied: `Actually placing the Taipei apartment in trust would also mean a trust registration in Taiwan (…) and a separate look at the tax consequences.`
   → Preserved: trust registration requirement (土地登記規則 §124 link unchanged), tax consequences flagged as a separate question, no guarantee.

2. zh-hant, section 遺產稅申報與繼承登記:
   `免稅額對兩者比照適用（第18條）`
   → "兩者" refers back two sentences to 「經常居住境外的國民與外國人」; after the intervening sentence on foreign documents the referent is unclear. Minor.
   → Applied: `免稅額對經常居住境外的國民與外國人也比照適用（第18條）`
   → Preserved: §18 II scope (both groups), "比照" wording, the 1,333萬 figure and 2026 dating, §17 II exclusion that follows.

No major issues. Nothing requires a rewrite.

## Minor edits applied

- en.md: "And actually holding … means" → "Actually placing … would also mean" (1 sentence). Lint OK, 1,587 words.
- zh-hant.md: "免稅額對兩者比照適用" → "免稅額對經常居住境外的國民與外國人也比照適用". Lint OK, 2,695 chars.
- ko.md, ja.md: no edits.

## Notes for the operator (not blocking)

- fix1-notes already flags the ko/ja term choice 「상시 거주/常時居住(經常居住)」 and 「세무포털/税務ポータル(稅務入口網)」 versus column 025's 「경상거주/経常居住」 and 「세무입구망/税務入口網」. Both are understandable with the original in brackets; site-wide consistency is a separate decision.
- The ko closing "미국 세무 전문가에게 확인하세요" is a polite imperative inside 합니다체 prose; it matches ja 「確かめてください」 and is acceptable as practical guidance. Left as is.

## Image verdict

OK. images/I6.webp shows a closed leather document folder, two key rings and reading glasses on a wooden desk, with a suburban house and tree seen through a window. It fits the column (a US home, keys to property, estate papers kept at home). No faces, no readable text, no logos, flags or legible documents; the key tags are blank colour tabs. Respectful and fictional.

VERDICT: PASS
