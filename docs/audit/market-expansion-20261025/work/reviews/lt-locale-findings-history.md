# Lithuanian locale review: bounded findings history

Reviewer: `/root/expand_locale_lt`, independent AI locale reviewer, not the author. These are internal review records, not claims of human native-speaker or lawyer review. No manuscript was edited by this reviewer.

The initial prose review occurred before the author freeze. Exact original passages and the repair direction were sent to `/root/expand_author_lt` and root. The final legal reviewer was separately notified about the FAQ scope.

| Original location | Exact passage | Finding | Proposed rewrite or direction | Meaning |
|---|---|---|---|---|
| 945:20, FAQ 3 | `Ar neišimtinę licenciją turinti įmonė gali ją perduoti kitam priežiūros vykdytojui?` | The question asks about transfer of the licence itself; its answer and Article 37 concern a sublicense. | `Ar neišimtinę licenciją turinti įmonė gali suteikti sublicenciją kitam priežiūros vykdytojui?` | Narrows the question to the existing answer. It does not treat assignment and sublicensing as equivalent. |
| 945:48, H2 | `Pirminis kodas turi būti tinkamas perimti darbą` | The grammar makes the code appear to take over the work. | `Kodas ir dokumentai, reikalingi priežiūrai perimti` | Preserves the deliverables and maintenance-transfer decision. |
| 944:19,48 and 945:17 | `priklausomybę` / `priklausomybės` in ownership wording | Abstract wording can suggest dependence rather than who holds the rights or secret. | Use `kam priklauso paslaptis` / `kam priklauso turtinės teisės`. | Preserves contractual priority, default holder and the commissioning party's use right. |
| 944:56, before targeted repair | `Sutartimi gautos komercinės paslapties naudojimas ar atskleidimas netinkamais būdais patenka į ... 10 straipsnį.` | `patenka į straipsnį` is an awkward translation-like expression; the next sentence immediately supplies examples of the same statutory conduct. | Connect the two statements: `Pagal [10 straipsnį] netinkamas sutartimi gautos komercinės paslapties naudojimas ar atskleidimas laikomas pažeidimu; prie netinkamų būdų priskiriami ir neleistinas kopijavimas bei konfidencialumo pareigos pažeidimas.` | Keeps improper use/disclosure and both examples. The separate fact-and-proof sentence remains. |

All proposed wording changes above were implemented by the author and re-read. The 945 employment-duty and private-international-law corrections came from the separate final legal reviewer, not from a self-review. This locale reviewer re-read those changed paragraphs and their source-list additions.

944's last targeted prose repair did not satisfy the candidate CV rule: the author reported CV 0.444, FAIL 1. Its naturalness improvement is not represented as a numerical pass. The author preserved `lt-author-944-pre-locale-repair.md` and `lt-author-944-r1-held.md`. No artificial sentence was proposed merely to cross the threshold. Final approved-method execution and hash-bound verdicts belong in `lt-locale.md/json`.

## Second and final bounded repair

After the r1 REQUEST_CHANGES report was preserved, root authorized one final repair cycle. The author proposed removing the pre-heading NDA preview and replacing the following definition paragraph with one actual explanation of the NDA role and Article 2 conditions. This reviewer assessed the text before application: the joined relative clauses preserve non-public status, economic value from secrecy and the holder’s reasonable protection measures, all cumulatively. The production/sales/business scope and the exact official link remain. It removes repetition rather than adding a short filler sentence.

The author applied exactly that block and reported its first approved-wrapper execution at CV 0.490, exit 0. This reviewer then read the full new file and the actual diff, repeated the first-two-paragraph deletion test at lines 24/28 and section 5 review, and independently executed the approved wrapper on SHA `1599708a692f0654296ccb9794c9916e5482b6308ba10bf4c2cde2ccceccae9b`: 43 sentences, CV 0.490, short share 0.233, zero HARD failures, exit 0. The original shared checker still returns unsupported exit 2. The earlier failure is retained and is not relabeled as passed. Two independent directed cycles total: first failed, second succeeded.
