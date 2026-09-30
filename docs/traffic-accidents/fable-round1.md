# Fable 5.1 publication review — round 1

Actual model: `claude-fable-5-1`; terminal result: success; tools disabled; public copy only. This is AI editorial review, not attorney approval.

# Verdict: REQUEST_CHANGES

Three text fixes and two confirmations are needed before release; the rest of the packet is consistent across locales. I worked only from the packet text and my own knowledge of Taiwan law, opened no sources, and this is AI editorial review, not attorney approval.

## Blocking

**1. 003 Q3 misstates the Article 503 trigger (all four locales).**
- The drafts say the criminal case is "dismissed" (`기각되고` / `遭駁回` / `dismissed` / `棄却され`).
- As I recall the provision, it applies when the criminal judgment is an acquittal, 免訴 or 不受理. The court then dismisses the attached civil claim unless the plaintiff asks for transfer, and transferred cases must pay court fees.
- Acquittal is the common scenario and the current wording hides it. Suggested replacements:
  - **zh:** 例如，刑事訴訟諭知無罪、免訴或不受理判決時，如依原告聲請將附帶民事訴訟移送民事庭，依刑事訴訟法第503條應繳納訴訟費用
  - **en:** "if the criminal judgment is an acquittal, or the prosecution is barred or not entertained (免訴/不受理), and the attached civil action is transferred to the civil division at the plaintiff's request, court fees are payable"
  - **ko:** 형사판결이 무죄·면소·불수리로 선고되고 원고의 신청으로 민사부에 이송되면
  - **ja:** 刑事判決が無罪・免訴・不受理となり、原告の申立てにより民事庭へ移送された場合

**2. 012 has an orphaned "omitted signal" sentence (all four locales).**
- The sentence says the result does not mean "one omitted signal will always determine liability", but the account no longer says anyone omitted a signal. This looks like residue of the removed appraisal analysis, and it implies an unsupported fact about A.
- Suggested replacement: "does not mean that any single factor will always determine liability" (zh: 並不表示任何單一因素必然決定過失歸屬, and equivalents).

**3. 012 case claim needs firm confirmation, not rewording by AI.**
- The heading and text say the firm handled the case, while the result is attributed to "the original case account" (`원래 칼럼의 사례 설명에 따르면` / `依原文的案例敘述`). Readers cannot see any "original", and the second-hand hedge sits awkwardly next to a first-hand claim.
- A responsible attorney should confirm two things:
  - The firm did handle the matter.
  - Publishing a fatal case with these details (mountain road, passenger death, the rider found primarily at fault) is consistent with client confidentiality and consent.
- If confirmed, attribute the result to the firm's own account. If not, drop "handled by the firm" from the heading and text.

**4. 003 Q15 compulsory-insurance figures need one direct re-check.**
- I cannot confirm from my own knowledge the 2026-05-29 amendment, the 2026-07-01 effective date, or the amounts (death TWD 3,000,000; disability 80,000–3,000,000; combined 3,200,000).
- They differ from the long-standing standard I know (death 2,000,000; disability 50,000–2,000,000; combined 2,200,000).
- These are the highest-consequence numbers in the packet. Have a human read the promulgation date, effective date and amounts off the linked FSC text before release. If they match, no text change is needed.

**5. Two wording defects that change meaning.**
- **zh 003 Q6:** 「事故發生後6個月內，當事人通常應提出直接申請」 reads as if parties should apply, which contradicts "not a mandatory stage" just above. Suggested: 「當事人直接申請者，原則上應於事故發生後6個月內提出」.
- **ja 003 Q5:** 「取り下げられ、その後は再び告訴できない」 can be read as "after the close of argument". Suggested: 「取り下げた者は再び告訴できません」, as Q18 already says.

## Non-blocking

- **Dates (003/012):** the display date is 13 September 2025, but 003 cites a 2026 amendment. Show the updated date so the article does not look anachronistic.
- **Appraisal citations (003 Q6):** the inline text cites Articles 10 and 11, while the source list cites Articles 11–15 at a different host and under a different name (ko 절차 규정 vs 규칙). Reconcile them.
- **Article 62 on moving vehicles (003 Q1):** as I recall, when all parties to an injury accident agree, the vehicles shall (應) be marked and moved. zh says 應; ko/en/ja say "may". Align them.
- **Hub illustration:** it uses the same cast (car 1, car 2, motorcycle A) as the real fatal case in 012, where A was found primarily at fault. The caption is accurate, but relabeling the vehicles would avoid readers mapping one onto the other.
- **049 deadlines:** the "before leaving" article gives no pointer to the six-month complaint and two-year civil periods. One link to 003 Q3 would cover a material condition for departing readers.
- **049 byline:** the body has no AI-authorship statement. Confirm the rendered byline shows it in every locale.
- **Locale drift:**
  - zh 003 alone has the Q20 line naming the lawyer.
  - ko 003 Q3 alone cites Article 144.
  - 049 ko/zh include "write your own account" but lack the "not an exhaustive list of legal requirements" sentence that en/ja have.
  - 049 en omits the scheduled-attendance check.
- **Naming and links:**
  - en "Traffic Act Article 62" should use the full statute name.
  - ko 「대만 소방서」 reads as a local fire station; add 消防署.
  - The National Police Agency FAQ uses two hosts (`wwwcdn` and `www`).
  - The hub's Taiwan link has no locale prefix, unlike the article links.
- **Japan card:** unlike the US card, it does not say the Osaka page is one prefecture's guidance.

## Checked, no issue found

These match my knowledge of the provisions:
- Criminal Code Articles 185-4, 276, 284, 287 and 41.
- Code of Criminal Procedure Articles 208 (party-commissioned appraisal), 237, 238, 487, 488 and 504.
- Civil Code Articles 184, 188, 192–197, 216, 217, 736 and 737.
- The 7-day and 30-day police record timing, and the 110/119/112 routing.
- The Article 101 overtaking rules in 012.
- The special-authority and complainant-attendance points in 049.

The California-only caveat, the hypothetical-illustration captions and the no-guarantee language are adequate.
