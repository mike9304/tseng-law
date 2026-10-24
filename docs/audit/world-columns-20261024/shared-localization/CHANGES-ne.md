
## Korea-frame localization — ne

Sentences changed: 4. FAQ and body occurrences are counted separately; a sentence spanning several paragraphs is counted once.

### 1. shared/ne/008-taiwan-labor-severance-law.md

Original (exact):

```text
केही क्षेत्राधिकारबाट भिन्न — उदाहरणका लागि कोरिया — ताइवानमा कम्पनीले कर्मचारीलाई बर्खास्त गरेमा मात्र विच्छेद भत्ता (資遣費) दिने दायित्व जन्मन्छ; कर्मचारी आफैंले राजीनामा दिए कम्पनीले विच्छेद भत्ता दिनु पर्दैन।
```

Replacement (exact):

```text
ताइवानमा कम्पनीले कर्मचारीलाई बर्खास्त गरेमा मात्र विच्छेद भत्ता (資遣費) दिने दायित्व जन्मन्छ; कर्मचारी आफैंले राजीनामा दिए कम्पनीले विच्छेद भत्ता दिनु पर्दैन।
```

Reason: The FAQ introduces Taiwan's rule through an irrelevant Korea comparison.

Taiwan legal meaning unchanged: The dismissal condition and voluntary-resignation rule are unchanged, and the following Article 14 exception remains intact.

### 2. shared/ne/008-taiwan-labor-severance-law.md

Original (exact):

```text
केही मुलुकमा, उदाहरणका लागि कोरियामा, कर्मचारी आफैंले कम्पनी छाडे पनि कम्पनीले विच्छेद भत्ता दिनुपर्छ।
```

Replacement (exact):

```text
ताइवानमा विच्छेद भत्ता पाउने अधिकार रोजगारी अन्त्य हुनुको कारणमा निर्भर हुन्छ।
```

Reason: Replace the foreign-law example with a Taiwan-only introduction to the rules that follow.

Taiwan legal meaning unchanged: The next paragraphs' employer-dismissal requirement, voluntary-resignation rule and Article 14 exception are untouched.

### 3. shared/ne/008-taiwan-labor-severance-law.md

Original (exact):

```text
ताइवानको व्यवस्था भने केही क्षेत्राधिकार (उदाहरणका लागि कोरिया) बाट फरक छ:
```

Replacement (exact):

```text
यससम्बन्धी सामान्य नियम यस्तो छ:
```

Reason: The comparative transition repeats the Korea frame.

Taiwan legal meaning unchanged: This remains an introduction to the same Taiwan rule; the following legal statements are unchanged.

### 4. shared/ne/009-taiwan-voluntary-resignation-severance.md

Original (exact):

```text
विशेष गरी कर्मचारी आफैंले राजीनामा (自請離職) दिएमा,

विच्छेद भत्ता (資遣費) पाइँदैन (श्रम मापदण्ड ऐनको धारा 18),

केही अन्य क्षेत्राधिकार (उदाहरणका लागि कोरिया) भन्दा ताइवानको व्यवस्था फरक छ।
```

Replacement (exact):

```text
विशेष गरी कर्मचारी आफैंले राजीनामा (自請離職) दिएमा,

ताइवानमा विच्छेद भत्ता (資遣費) पाइँदैन

(श्रम मापदण्ड ऐनको धारा 18)।
```

Reason: Remove the Korea comparison while retaining the Taiwan rule across the same paragraph breaks.

Taiwan legal meaning unchanged: The voluntary-resignation condition and Article 18 citation remain; all subsequent exceptions and deadlines are untouched.

Verification: exact replacements only; all other bytes, numbers, links, headings, line breaks, formatting, dates and non-FAQ frontmatter preserved. Files without Korea references are byte-identical.

Sentence-variety rule §5 self-check (scoped to these edits): removed Korea comparisons without adding a repeated rhetorical pattern; kept the existing register and did not add stock openings, closing formulas, bold, invented facts, or first-person claims. Article numbers, conditions, exceptions and source links are preserved. Unrelated openings, paragraph rhythms and endings remain outside this brief’s permitted edit scope.

Required variety_metrics.py check was run for all three files. The tool supports only ko/ja/en/zh-hant and falls back to ko for this locale, so its diagnostics are not a valid locale-specific pass/fail assessment:

- 007-taiwan-divorce-lawsuit-qna.md: detected ko; exit 1; 4 uncalibrated FAIL diagnostics.

- 008-taiwan-labor-severance-law.md: detected ko; exit 1; 3 uncalibrated FAIL diagnostics.

- 009-taiwan-voluntary-resignation-severance.md: detected ko; exit 0; 0 uncalibrated FAIL diagnostics.
