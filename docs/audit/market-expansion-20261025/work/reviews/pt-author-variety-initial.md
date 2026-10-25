# Initial author measurements — 2026-10-25

Before the author self-check repair, the original shared CLI returned:

```
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-pt/938-brazil-coffee-taiwan-border-reinspection.md --lang pt
exit 1
sentences=37 mean=17.9 cv=0.535 short=0.27 run3=0.0 opener_rep=0.154 cite_end=0.0 cite_para=0.615 contrast=0 caveat=0 q=1
FAIL top_opener_n=3 (limit <= 2)

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-pt/939-brazil-organic-coffee-taiwan-label-certification.md --lang pt
exit 0
sentences=40 mean=18.1 cv=0.497 short=0.2 run3=0.0 opener_rep=0.231 cite_end=0.0 cite_para=0.462 contrast=0 caveat=0 q=3
OK — no variety limit violated
```

938 repair: removed the redundant short sentence 'O aviso pode chegar eletronicamente.' and integrated 'eletrônica' into the following sentence. The second paragraph now begins with the cited article. Electronic delivery, system issuance, presumption, and the supplier's later receipt remain intact. This is an author self-check, not an independent reviewer PASS.

939 subsequent substantive update: direct AFA country-list read allowed replacing the unanswered Brazil-equivalence question with the bounded observation that Brazil does not appear in that list as viewed on 2026-10-25. The alternative route remains conditional; no certifier eligibility is asserted.

That update initially introduced a third paragraph beginning with 'Na'. The original CLI returned exit 1, sentences=39 mean=18.9 cv=0.48 short=0.205 run3=0.027 opener_rep=0.231 cite_end=0.0 cite_para=0.462 contrast=0 caveat=0 q=2, FAIL top_opener_n=3. The paragraph was then reordered to start with the concrete subject 'O Brasil'. During the same author self-check, Article16 was added to the certification-chain passage so that Article13's permitted contractual scope is not read as a sufficient certification of all stages by itself. No independent reviewer has yet certified these drafts.

Final opening-deletion check removed939's opening question and put the actual two-route legal condition first. This introduced a third 'O' paragraph: exit1, sentences37 mean19.5 cv.454 short.189 run3.029 opener_rep.308 cite_end0 cite_para.462 contrast0 caveat0 q1, FAIL top_opener_n3. The labeling paragraph now directly starts with its concrete subject 'Embalagens ou recipientes'. Original tool recheck exit0, same substantive metrics, opener_rep.231 and0FAIL. All final commands/output and SHA bindings are in pt-author.json. No scorer was altered.
