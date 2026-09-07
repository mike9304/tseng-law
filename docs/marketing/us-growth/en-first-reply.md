# First English reply — template (not sent)

Internal acknowledgement for a **received** inquiry. Not a newsletter. Not a fee quote. Not an SLA. Customer-facing body states confirmed Taiwan-law services only — no unconfirmed credential lines, no internal ledger jargon.

Mailbox: wei@hoveringlaw.com.tw  
Signer: **pending** → keep `[reviewing attorney]`. Do not invent a name.

## Subject

`Re: {their subject}`  
If they used the site template, that subject is already `[tseng-law.com Consultation] Taiwan Legal and Corporate Services`.

## Body

```
Dear {name or "Counsel" / "Hello"},

Thank you for writing to wei@hoveringlaw.com.tw. We have received your message. [reviewing attorney] will review whether this is a Taiwan-law matter we can assist with, including conflict and capacity.

English-speaking attorneys are available. This office assists with Taiwan company formation, litigation across practice areas under Taiwan law, residence permit assistance, and tax and accounting assistance.

What we have from you so far:
- Name or company: {as written, or "not yet provided"}
- Type of inquiry: {formation / litigation / residence-permit assistance / tax-accounting assistance / other / not yet clear}
- Taiwan connection: {counterparty, entity, property, residence, other — or "not yet provided"}
- Deadline or key dates: {or "none stated"}
- Preferred language: {or "not yet provided"}
- How we may reach you: {optional location / method, or "email only"}

Please do not send further documents until [reviewing attorney] asks.

For an initial inquiry, please provide only a brief matter or business overview and your contact details. Do not send passport or identification numbers, bank account details, or original identity documents by email or through the general inquiry form. Provide sensitive materials only through a secure method after receiving instructions from the attorney.

[next step]
{Choose one after the reviewing attorney decides; delete the others. Do not fill with a clock.}
- If we still need a Taiwan connection, dates, or a reachable contact method: "To continue, please reply with the missing items above — still without identity or bank documents."
- If the matter is being conflict- and capacity-checked: "We will write again when that review is complete."
- If we will not open a file: "We will not open a file on this inquiry. You may wish to consult other counsel if you need a different service."
- If a consult is offered: describe only the actual next contact method the attorney has approved. Do not add a price or a time guarantee unless a later ledger row confirms it.

Regards,
[reviewing attorney]
Hovering International Law Firm
Attorney Tseng
wei@hoveringlaw.com.tw
https://tseng-law.com/en
https://tseng-law.com/en/contact
```

## Operator checklist before any send

- [ ] A real inbound message exists (`inquiry-ledger.csv` `record_kind=real`; compose-click alone is not enough).
- [ ] Ledger has unique `inquiry_id`; no client identifiers or case contents in the CSV.
- [ ] Body has no SLA, fee numbers, outcome/permit/tax-result promises, or unconfirmed individual-credential sentences.
- [ ] Sensitive-information paragraph kept verbatim.
- [ ] `[reviewing attorney]` replaced only with a confirmed name, otherwise left for an attorney to fill.
- [ ] Still **not sent** from this kit; sending is a live-matter act.
