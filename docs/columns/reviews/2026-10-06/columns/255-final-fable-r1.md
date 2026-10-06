# C6 final review (Fable 5.1, round 1) — taiwan-copyright-employee-freelancer-work-ownership

Date: 2026-10-06. Reviewer: Claude Fable 5.1 (final gate). Files reviewed: drafts/C6/ko.md, ja.md, en.md, zh-hant.md; facts.md (not trusted, re-checked); research/C6-statutes.md; images/C6.webp. research/judgments/ is empty and no judgment is cited in any version, so no judgment check was needed.

## Verdict

PASS. All four versions are publishable now. Image OK. Two minor sourced qualifiers were applied by me (ko, ja: Trade Secrets Act Art. 3 proviso); lint is OK on all four after the edits. One process note for the publisher on the Trade Secrets Act link form (not a blocker).

## Scope checked

1. Law and facts — every statutory statement, article number, amount, date and TIPO description, in all four languages, compared with the official text. Sources opened on 2026-10-06:
   - 著作權法 (law.moj.gov.tw, 修正日期 民國111年6月15日; notice that the 111-05-04 amendments to §91, 91-1, 100, 117 and deletion of §98, 98-1 are not yet in force — the column cites none of those): §3, §5, §10, §10-1, §11, §12, §15, §16, §17, §21, §22, §28, §36, §37, §84, §88 from research/C6-statutes.md and re-confirmed §36 III, §37 I/III/IV, §88 III on the LawAll page; §30 and §33 fetched from the single-article pages.
   - 營業秘密法 §2, §3, §4 fetched from law.moj.gov.tw (both the plain `pcode=J0080028` URL and the column's `pcode=J008%30028` URL return the identical §4 page, HTTP 200, same title and text).
   - 涉外民事法律適用法 §42 fetched.
   - TIPO pages 209-21674 (更新日期 114-05-13), 209-21673 (114-05-13), 773-4960 (114-09-16) fetched; ERP example, the company-as-contractor two-step sequence, the "不能直接約定員工的創作屬於出資人公司所有" sentence, the 1998-01-21 deletion of registration, the burden-of-proof sentence and the holiday-photo example all confirmed verbatim.
   - Korean 저작권법 제9조 fetched from law.go.kr (iframe content): header 「[시행 2026. 8. 11.] [법률 제21336호, 2026. 2. 10., 일부개정]」, text as quoted in facts.md.
   - Japanese 著作権法 第15条 ①② fetched from the e-Gov law API; text as quoted in facts.md.
2. Citations — every inline statute link points to the correct single-article URL; TIPO links resolve to the pages described; sources sections complete with check date 2026-10-06 in each language; internal links exist in the repo in the right language (ko 053/091/116, ja 001/117, en 053/170, zh-hant 175/137 — files present under src/content, lint OK).
3. Rules — no private-party names (TIPO's fictional 李四/快樂科技/阿元 are not reproduced); no bold; no phone numbers; no street address; email-only contact once near the end; author legal-ai-assistant; no lawyer- or native-review claim; hypotheticals marked (가령 / 例えば…とします / Suppose / 假設); foreign-law notes limited to one sourced statutory sentence (ko: KR Art. 9; ja: JP Art. 15) or a general caution (en: work-made-for-hire); frontmatter per brief; en summary 150–160 chars, seoTitle 30–45 chars (lint OK).
4. Voice — read each version in full; see notes below.
5. Image — opened images/C6.webp.

## Issues

### 1. ko §69 / ja §69 — Trade Secrets Act Art. 3 stated without its proviso (minor, applied)

- Original (ko): 「직원이 직무상 연구·개발한 영업비밀은 회사에 속합니다([제3조]…)」. Original (ja): 「従業員が職務上研究・開発した営業秘密は会社に帰属します（[第3条]…）」.
- Problem & reason: 營業秘密法 第3條 第1項 reads 「受雇人於職務上研究或開發之營業秘密，歸雇用人所有。但契約另有約定者，從其約定。」 The en ("unless the contract says otherwise") and zh-hant (「契約另有約定者從其約定」) versions carry the proviso; ko and ja stated the rule as absolute, so the four versions were not identical on this point.
- Fix (applied): ko → 「직원이 직무상 연구·개발한 영업비밀은 계약에 다른 약정이 없으면 회사에 속합니다」; ja → 「従業員が職務上研究・開発した営業秘密は、契約に別段の定めがなければ会社に帰属します」.
- Facts preserved: subject (employee, in the course of duties), default owner (employer), citation and link unchanged; only the statutory proviso was added, word-for-word from the official text. Lint re-run: ko OK (3312 chars), ja OK (3865 chars).

### 2. All four — Trade Secrets Act links written as `pcode=J008%30028` (process note, not a blocker)

- Original: every 營業秘密法 link uses `pcode=J008%30028` instead of the plain `pcode=J0080028`.
- Problem & reason: facts.md explains this is a workaround because lint.py's phone-number regex matches the substring `0800` inside the law code. I verified that the encoded URL returns the identical page (HTTP 200, same title 「營業秘密法§4-全國法規資料庫」, same article text), so the links work. However, the 125 existing Trade Secrets Act links in the published repo all use the plain form, and the encoded form is unusual for readers who copy the URL.
- Fix (required of the publisher, optional): at publication, either restore the plain `pcode=J0080028` form (and accept or adjust the lint false positive, which is a law code, not a phone number), or leave as is. Legal content is unaffected either way.
- Facts preserved: n/a.

### 3. ko / zh-hant — Art. 33 stated without the "unpublished within 50 years" proviso (minor, not changed)

- Original (ko): 「법인이 저작자이면 공표 후 50년까지 존속합니다」; (zh-hant) 「法人為著作人的，存續至公開發表後五十年」; en and ja are phrased the same way.
- Problem & reason: 第33條 但書 adds that a work not published within 50 years of completion is protected for 50 years from completion. The columns give only the main rule.
- Fix: none required. The sentence is framed as the general rule (ko/zh-hant/ja qualify the natural-person term with 원칙적으로/原則上/原則として in the same sentence) and the proviso is irrelevant to the column's question. Noted for completeness only.
- Facts preserved: unchanged.

No major issues found. No contradictions between the four versions on §11, §12, §15 III, §16 IV, §21, §36 III, §37 I/III/IV, §84, §88 III, 營業秘密法 §2–4 or 涉外民事法律適用法 §42 II. Amounts (NT$10,000–1,000,000; up to NT$5,000,000 for intentional and serious infringement), dates (1998-01-21 deletion of registration; 2022-06-15 last amendment; KR 2026-08-11 in force; checked 2026-10-06) and terms (life + 50 years; 50 years after publication for a juristic-person author) are correct in every version.

## Voice notes (no edits needed)

- ko: title is a concrete noun-phrase question; the first paragraph gives the answer (freelancer keeps economic rights, company may only use; employee case differs). Natural 합니다체; no 예고 sentence, no checklist headings, no bold. The opening conditional sentence is long but reads cleanly and keeps the hypothetical marker 가령 (batch rule 7).
- ja: natural です・ます; opening 「例えば…とします」 marks the hypothetical; headings are declarative and specific; the Japanese-law note is one sourced sentence plus "日本の専門家にお尋ねください". Kanji 智慧財産局 (Japanese form) used consistently.
- en: plain, active; "Suppose" retained as the hypothetical marker required by batch rule 7; the work-made-for-hire paragraph is a general caution only. One semicolon in the franchise sentence is acceptable column prose.
- zh-hant: Taiwan usage throughout (智慧局, 接案設計師, 通訊軟體, 加盟店, 開源套件); no mainland vocabulary or simplified characters (lint and manual check). Title 「員工寫的程式、外包做的Logo，著作權算誰的？」 is specific and natural.
- Deletion test on the first two paragraphs of each version: removing any sentence loses a fact (who is author, who holds economic rights, what the paying party may do), so nothing is filler.

## Minor edits applied by me

1. drafts/C6/ko.md, source-code section: added 「계약에 다른 약정이 없으면」 to the 營業秘密法 第3條 sentence (see issue 1).
2. drafts/C6/ja.md, source-code section: added 「、契約に別段の定めがなければ」 to the 營業秘密法 第3條 sentence (see issue 1).

No other wording was changed. en.md and zh-hant.md were not edited.

Lint after edits (python3 lint.py <file> <lang> taiwan-copyright-employee-freelancer-work-ownership):
- ko: OK [length 3312 chars (no spaces/URLs)]
- ja: OK [length 3865 chars (no spaces/URLs)]
- en: OK [length 1585 words]
- zh-hant: OK [length 2689 chars (no spaces/URLs)]

## Image verdict

OK. images/C6.webp shows a desk from above with pencil sketches of leaves and ornamental curves, a tablet with a blank screen, a stylus, a coffee cup and a small succulent. It fits a column about designers and illustrators making work for a company. No faces, no readable text, no logos, no flags, no identifiable documents or people; respectful and neutral.

## Review limits

This is a model review against official sources, not a review by a licensed Taiwan lawyer or a native speaker of any of the four languages. How Taiwan courts treat a "non-exercise of moral rights" clause and the exact scope of the commissioning party's right to "use" under §12 III are not stated in the column and were not verified beyond TIPO's explanation; the column correctly limits itself to the statute and TIPO.
