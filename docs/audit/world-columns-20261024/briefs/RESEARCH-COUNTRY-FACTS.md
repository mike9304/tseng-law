# Task: verified country-facts ledger for Taiwan (research only)

You are a legal researcher. Build a ledger of country-specific Taiwan rules that later column authors will cite. Accuracy matters more than coverage: a fact you cannot confirm from an official Taiwanese source is marked UNVERIFIED, never guessed.

Work directory: the current directory. Write ONLY these two files:
- `research/country-facts.md` (human-readable, one section per fact family, then one row per country)
- `research/country-facts.json` (same data: {country: {fact_key: {value, source_url, quote, checked}}})

Use `curl -sL -m 30` (network is enabled) against official sources. Record the exact URL you fetched, a short verbatim quote (original Chinese/English) that supports the value, and the check date 2026-10-24. If an English page and a Chinese page disagree, report both. If a list page links to a PDF, fetch the PDF (`curl -o` into `research/raw/`, then `pdftotext` if available, or python) and quote it.

Countries (ordinary passport holders; use the country, not the language):
Philippines, People's Republic of China (note: cross-strait rules apply, not the foreigner rules — just record that and the governing statute name), Malaysia, Singapore, Myanmar, Cambodia, Mongolia, Nepal, Bangladesh, Pakistan, Iran, Afghanistan, India, Sri Lanka, Russia, Kazakhstan, Turkey, Ukraine, Netherlands, Sweden, Denmark, Norway, Finland, Iceland, Spain, Andorra, Greece, Israel, Poland, Czech Republic, Slovakia, Hungary, Romania, Bulgaria, Croatia, Serbia, Slovenia, Lithuania, Latvia, Estonia.

Fact families:
1. `visa_free`: whether Taiwan grants visa-free entry and for how many days (Bureau of Consular Affairs, boca.gov.tw, visa-exempt list; note pilot/temporary programs and their end dates). Also note eVisa / landing visa / ROC-TAIWAN Travel Authorization Certificate availability if the official page states it.
2. `working_holiday`: whether Taiwan has a youth mobility / working holiday program with that country (BOCA or MOFA official page), age range and quota if stated.
3. `tax_treaty`: whether a comprehensive income tax agreement with Taiwan is in force (Ministry of Finance, Taxation Administration official list, e.g. www.dot.gov.tw), and the effective year. Distinguish "signed" vs "in force" and shipping/air-only agreements.
4. `marriage_interview`: whether a foreign spouse from that country must pass an overseas interview at the Taiwan mission before the spouse/family visa (BOCA list of countries subject to 境外面談 / interview requirement).
5. `land_reciprocity`: whether nationals of that country may acquire land/real estate rights in Taiwan under Land Act art. 18 reciprocity (Ministry of the Interior, Department of Land Administration list 外國人在我國取得或設定土地權利互惠國家一覽表). Record the status words used (e.g. 平等互惠 / 有條件 / 不互惠).
6. `migrant_worker_source`: for Asian countries only — whether Taiwan's Ministry of Labor admits blue-collar migrant workers (Employment Service Act art. 46(1)(8)-(11)) from that country, with the official page or notice.
7. `driving_licence`: whether Taiwan recognizes that country's international driving permit or allows licence exchange on a reciprocity basis (Highway Bureau / MOTC official list), if you can find the official list quickly; otherwise mark UNVERIFIED.

Rules:
- Do not use Wikipedia, travel blogs, or news as the source of a value. You may use them only to find the official page, then cite the official page.
- Keep quotes short (≤ 200 characters each).
- At the top of `country-facts.md`, list every official source URL you used and whether it fetched (HTTP status).
- At the end, list facts that stayed UNVERIFIED and why.
- Do not edit anything outside `research/`.
