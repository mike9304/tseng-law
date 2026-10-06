# REWORK ORDER — G2 sentence-variety rework (2026-10-06, user instruction)

G2 passed Fable r1 at 13:03, but that review ran before the sentence-variety rule existed. The column reads exactly the way the user
complained about: almost every paragraph is claim + (statute link) + caveat, sentences of the same length, dense. This round is a
variety rewrite of ALL FOUR languages (ko, ja, en, zh-hant). The facts were already verified in r1 — do not re-research them unless you
find an error; your job is the writing.

Reference (the r1 PASS version, read-only): /Users/son7/tseng-gap-1006-work/backups/G2-r1-pass-20261006-1303/drafts-G2/{ko,ja,en,zh-hant}.md, its review /Users/son7/tseng-gap-1006-work/reviews/G2/r1-pass/final-fable-r1.md
and your r1 notes /Users/son7/tseng-gap-1006-work/reviews/G2/r1-pass/fix1-notes.md. Variety checker on the r1 text: /Users/son7/tseng-gap-1006-work/backups/G2-r1-pass-20261006-1303/variety-before-*.txt
(ko: len_cv 0.41, very short 3.8%, 58% of sentences end in a statute parenthesis; ja: len_cv 0.36, no short sentence; en: 3 paragraphs
open with the same word; zh-hant: 58% of sentences end in a statute parenthesis, 62% end in '）。').

Do:
1. Keep every fact: every legal statement, condition, exception, period/deadline (hours, days), number, article number, the
   hypothetical label, every MUST VERIFY item if topics/G2.md has one, the sources section (all its URLs) and the check date.
   Before finishing, compare each language with the r1 reference and confirm in your notes, item by item, that nothing was dropped
   or changed in meaning.
2. Fewer inline statute links per paragraph is fine and wanted, AS LONG AS the sources section keeps every article link.
   Put citations in different positions (as the subject, at the front, grouped once for a paragraph) instead of a parenthesis at the
   end of sentence after sentence. At least one body paragraph with no citation at all.
3. Rhythm: vary sentence length; include a few very short sentences (at least 2 per language); split dense sentences; not every
   paragraph opening the same way (no 3 paragraphs starting with the same word, no 3 claim-statute-caveat paragraphs in a row).
4. Open with a concrete scene or a striking line (rule section 2-4) — not a stock hypothetical opener (가령 / 例えば…とします /
   Suppose / 假設) and not a generic intro. If you use a scene, keep it clearly marked as hypothetical, no real names.
5. Ending: the last body paragraph ends on this column's facts. After it only the brief's required items: the single email contact
   line and, at the very end, the single general-information line with the check date (brief-BATCH rule 12). No other formula closing,
   no "depends on the facts / contact a lawyer" sentence in the body.
6. Native voice: ko 합니다체 throughout (no 해라체 '~다.' mixing), ja です・ます throughout, zh-hant Taiwan usage, en plain active.
   No bold, no invented first person, no checklist headings. Keep the format limits (lint) and the front matter keys
   (you may adjust summary/FAQ wording only if the body change requires it; keep slug, topic, featured_image).
7. Self-check (SENTENCE-VARIETY-RULE.md section 5) and run, for every language, until clean:
   python3 /Users/son7/tseng-gap-1006-work/lint.py /Users/son7/tseng-gap-1006-work/drafts/G2/<lang>.md <lang> taken-taiwan-police-station-first-24-hours-not-release   (must print OK)
   python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-gap-1006-work/drafts/G2/<lang>.md --lang <lang>   (no FAIL)
