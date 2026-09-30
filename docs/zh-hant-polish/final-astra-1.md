- src/data/faq-content.ts:147 | Changes the explicitly locked consultation-method answer from「韓語、中文、日語、英語」to「韓文、中文、日文、英文」, diverging from home-zh-hant-parity.ts’s exact comparison string. | Restore the locked answer verbatim and resync the FAQ test hash.
- src/app/[locale]/guides/taiwan-company-setup/content.ts:259 | Changes matters investors “need to confirm” into mandatory personal counter remittance and reporting requirements. The same strengthening appears in src/data/service-details.ts:43. | Preserve the previous qualification in both locations; defer substantive requirements to lawyer review.
- src/components/consultation/AiConsultationSection.tsx:123 |「文章內容為最新」introduces an unsupported assurance. “fresh” only checks whether the article date is within 365 days; it does not verify current legal accuracy. | Restore the previous qualified wording pending review.
- src/data/team-name.ts:24 | Renames the canonical team from「昊鼎韓國台灣團隊」to「昊鼎韓台團隊」despite the no-name-changes constraint. | Restore the original name and corresponding expectations.

Non-blocking note: Static comparison found no non-zh locale edits, code-structure changes, or weakened test logic. URLs, emails and numeric facts were preserved apart from permitted date formatting.

VERDICT: REQUEST_CHANGES