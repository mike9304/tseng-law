# World columns 2026-10-24 — author brief

## Why this batch exists

tseng-law.com (a Taipei law practice: partner attorney Wei Tseng and team) publishes in 49 languages. Korean, Japanese, English and Taiwanese Chinese have hundreds of columns; Vietnamese plus nine markets (th, id, hi, fr, de, it, es, pt, ar) now have columns written for their readers. The remaining 35 languages only carry 18 generic translations (001–018), several of which assume a Korean reader (Korea–Taiwan tax treaty, Korean banks, a Korean student's gym case). A reader from Poland, Mongolia or Greece finds nothing written for their actual Taiwan problem.

Your job: write three new columns per assigned language that a reader from that country would actually search for when they have a Taiwan-related legal problem, and that lets them recognise their issue and prepare a credible first inquiry. Translation alone is not the task; each article answers a concrete question that people from that country face with Taiwan.

## Read before writing (full text, not skimming)

Repository snapshot: `REPO` = the `repo/` folder next to this brief (read-only for you).

1. `REPO/docs/columns/EDITORIAL-VOICE.md` — house style. It is written in Korean; read it fully. Its rules apply to every language.
2. `rules/SENTENCE-VARIETY-RULE.md` and `rules/LESSONS.md` — the 25 mistakes reviewers keep finding (wrong citations, deadlines, monotony, frontmatter/FAQ mismatch, contact rules, AI-style headings, law version, invented scenes, unsupported claims…). Avoid all of them.
3. `REPO/docs/columns/FRONTMATTER.md`.
4. Three existing columns in your language under `REPO/src/content/columns-<locale>/` (e.g. 008, 014, 016) — for register, the exact `categories` string your locale uses, and `read_time` / `date_display` style.
5. The structural source columns named for your topic in `ASSIGNMENTS.md` (English or another language). They passed legal review; reuse their verified legal structure and citations, but re-check every citation yourself and rewrite for your reader.
6. `research/country-facts.md` (if present) — verified country-specific facts (visa-free days, working-holiday program, tax treaty, marriage interview list, land reciprocity, migrant-worker source status). Use only facts marked verified there, or verify yourself from an official Taiwanese government page and cite it.

## Legal accuracy (the reason reviewers reject articles)

- Every consequential legal statement needs an inline link to the official source that supports it, normally `https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=<PCODE>&flno=<ARTICLE>`. Before citing, fetch the article text: `python3 tools/law.py <PCODE> <art> [<art> …]` prints the current text (it caches pages). Confirm the article number, paragraph and subparagraph match your sentence exactly.
- Trap: a LawSingle page may display an amendment that is promulgated but not yet in force. `tools/law.py` prints `!!! 部分條文尚未生效` when the law carries that banner — then check the effective date before relying on the text, and say "as of 24 October 2026".
- Preserve 得 (may / discretionary) vs 應·須 (must). A discretionary fine is "may be fined up to", never "will be fined". Keep AND/OR conditions, exceptions, start dates of periods, amounts and units exactly as the statute says. Examples in a statute (如/等) are not a closed list.
- Country-specific facts (visa-free days, working-holiday program, tax treaty, marriage interview, land reciprocity, licence recognition) must come from an official Taiwanese government page or `research/country-facts.md`. If you cannot verify, do not state it; write around it.
- Foreign law (the reader's home country) is out of scope except to say that local counsel is needed there. Never claim that Taiwan courts have recognised judgments from that country unless you have the actual court decision; reciprocity is decided case by case.
- Do not invent court cases, statistics, client stories, demand figures or the firm's experience. A hypothetical scene must be marked as hypothetical in the sentence itself. No first-person lawyer narration.
- Taiwan is the jurisdiction. For mainland-China readers (zh-hans) the governing law is the Act Governing Relations between the People of the Taiwan Area and the Mainland Area (pcode Q0010001) and its regulations, not the foreigner rules.

Useful verified pcodes: Civil Code B0000001 · Code of Civil Procedure B0010001 · Act Governing the Choice of Law in Civil Matters Involving Foreign Elements B0000007 · Immigration Act D0080132 · Land Act D0060001 · Cross-Strait Act Q0010001. Confirm any other pcode by fetching it with `tools/law.py` and checking the printed title.

## Firm facts you may use (nothing else)

- Email: `wei@hoveringlaw.com.tw`. Contact page: `/<locale>/contact`. No phone numbers, hotlines, WhatsApp or addresses beyond these.
- Consultations are conducted in English, Chinese, Japanese or Korean. Writing in the reader's language does not promise consultation in it; say the language arrangement is agreed first.
- First inquiry: a non-sensitive summary, the other party's name for a conflict check, the Taiwan connection and any deadline. Do not ask for ID copies, bank details or full original documents in the first email. An email does not create a lawyer–client relationship.
- Never invent attorney credentials, foreign qualifications, offices, past cases, results or awards. Never claim lawyer review or native-speaker review of the article.

## Shape of each article

- Length: about 650–950 words for space-separated languages; zh-hans 1,600–2,600 characters; for Thai-like or Indic/Burmese/Khmer scripts, equivalent useful depth (roughly the same amount of content as 700–900 English words). Do not pad.
- Start with the reader's concrete fact or question — no "In this article we will…", no restating the title, no generic background on Taiwan. Run the first-two-paragraph deletion test (EDITORIAL-VOICE) and cut sentences that add nothing.
- 3–5 `##` subheadings that name this article's own issues. Not imperative checklists, not all questions, not the same three-part pattern as the other two articles.
- No bold anywhere (`**`, `__`, `<strong>`, `<b>`). No H1 in the body. No author footer.
- One restrained contact paragraph near the end (email + contact page + language arrangement + what to send first). Do not end with a summary of the article.
- At least one internal link to an existing column in your language (`/<locale>/columns/<slug>`), using only slugs that exist in `REPO/src/content/columns-<locale>/` (the 18 shared ones) or your own new slugs. Avoid linking 001, 004, 005, 006, 010 (they assume a Korean reader).
- End with `## <"Sources" in your language>`: a line "Checked on 24 October 2026" (localized), then a bulleted list of every source linked in the body (law name + article, linked), plus any official non-statute page used.

## Frontmatter (exact fields, in this order)

```yaml
---
title: "…"                # the article's own subject and issue; ≤ 70 characters if possible
seoTitle: "…"             # 30–60 characters, includes Taiwan + the issue in reader's words
summary: "…"              # 110–170 characters, concrete; no hype
published: "2026-10-24"
lastmod: "2026-10-24"
date_display: "…"         # 24 October 2026 written the way existing <locale> columns write dates
read_time: "… "           # same pattern as existing <locale> columns
categories: ["…"]         # the exact category string used by existing <locale> columns
topic: "…"                # one of: litigation, company, visa, labor, family, inheritance, criminal, tax, other
tags: ["…", "…", "…"]     # 3–5 short tags in your language; criminal topics must also include "criminal-litigation"
featured_image: "…"       # from briefs/IMAGE-MENU.md
featured_image_alt: "…"   # translated description from the menu
featured_image_caption: "…"
faq:
  - q: "…"
    a: "…"                 # 3 FAQ entries, consistent with the body, with the same conditions
audience: ["<locale>"]
author: "legal-ai-assistant"
---
```

File name: `drafts/<locale>/<NNN>-<slug>.md` with the number assigned to you. Slug: lowercase ASCII, hyphens, 4–9 words, English words (transliteration is fine), must include a country or nationality cue (e.g. `polish-exporter-taiwan-unpaid-invoice`, `mongolian-student-taiwan-part-time-work-permit`) so it is unique across the whole site. Do not reuse any existing slug.

## Work note (required)

Write `work/<locale>-author.md` with, per article: the reader and trigger; why this topic fits this country (evidence or labelled hypothesis); overlap with existing columns and your new angle; a claim → source table (statute article, URL, the Chinese text excerpt you checked); the first-two-paragraph deletion test (sentences cut/kept and why); comparison with three existing same-language columns (openings, headings, endings) and what you changed to avoid the same pattern; word/character count; any statement you dropped because you could not verify it.

## Boundaries

- Write only inside `drafts/<locale>/` and `work/<locale>-author.md` for your assigned locales. Never edit `REPO/`, other locales or other agents' files.
- Do not run git, do not publish, do not install anything.
- If a recommended topic turns out to be wrong for the country (e.g. the fact it relies on is false), replace it with another topic from the same reader group and explain why in the work note.
