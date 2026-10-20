# A3: note to the gate on Astra r2 findings 3 and 4

## Finding 3: judgment verification blocker (five decisions)
The finding asks to "obtain readable official records and independently confirm the factual descriptions, amounts and dispositions before publication."

All five decisions were re-opened live on 2026-10-20 at 20:13 KST. Every description, amount and disposition in ko/ja/en/zh was checked against the text. Details are in facts.md under "Astra r2 fix log".
- judgment.judicial.gov.tw printData, the URLs cited in the drafts: all five texts are identical to the cached copies the reviewer read.
- Judicial Yuan open-data PDFs, which need no session cookie. Four of the five decisions are available there:
  - https://data.judicial.gov.tw/opendl/JDocFile/TPSM/112%2C%E5%8F%B0%E4%B8%8A%2C1703%2C20230504%2C1.pdf
  - https://data.judicial.gov.tw/opendl/JDocFile/TYDM/114%2C%E8%A8%B4%2C2074%2C20260629%2C1.pdf
  - https://data.judicial.gov.tw/opendl/JDocFile/TPDM/114%2C%E6%98%93%2C1349%2C20260723%2C1.pdf
  - https://data.judicial.gov.tw/opendl/JDocFile/PCDM/115%2C%E5%AF%A9%E7%B0%A1%2C523%2C20260603%2C1.pdf
  The PDF text matches the print view apart from layout artifacts. SHA-256 hashes are in facts.md. The family ruling (臺中地院115家聲28) is not served by that endpoint ("arguments error!"), so printData is its only official copy.
- The re-read turned up one imprecision, which has been corrected: in 112台上1703, the first withdrawal was made by the son's wife acting with him and the second by the son alone.

The reviewer could not open these pages because judgment.judicial.gov.tw answers any request without its session cookie with a bot-defense page. The r2 review ran read-only, with approval set to "never" and no shell network. The open-data PDF URLs above can be fetched without a cookie.

## Finding 4: Japanese Civil Code Arts. 921 and 602, current text
These are now verified against the current official text through the e-Gov API:
- API v1 article endpoint.
- API v2 law_data for the revision marked "CurrentEnforced", 129AC0000000089_20260624_508AC0000000045 (令和8年法律第45号, enforced 2026-06-24).

Art. 921(1) with its proviso 「ただし、保存行為及び第六百二条に定める期間を超えない賃貸をすることは、この限りでない。」 and Art. 602 (短期賃貸借) read as the ja draft describes them. Quotes and endpoint URLs are in facts.md under "Foreign statutes". No text change was needed.
