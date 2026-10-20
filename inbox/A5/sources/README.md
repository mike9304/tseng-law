# A5 judgment sources: official PDFs supplied for the gate (Astra r3 finding 1)

The four PDFs in this folder are the Judicial Yuan open-data copies, downloaded on 2026-10-21 at 01:14 KST with plain `curl` (no session cookie) from data.judicial.gov.tw/opendl/JDocFile. Each file's byte size and SHA-256 are identical to the values recorded in ../facts.md at the r1 fix (2026-10-20 20:21 KST), so the official file has not changed between the two downloads.

The .txt files are `pdftotext -layout -enc UTF-8` output of the PDF next to them (/opt/homebrew/bin/pdftotext, available read-only on this machine). To re-check: `shasum -a 256 *.pdf` and `pdftotext -layout -enc UTF-8 <file>.pdf - | diff - <file>.txt`.

| File | Court / case | Source URL | Bytes | SHA-256 |
|---|---|---|---|---|
| TPSV-113-台上-101-20240131.pdf | 最高法院113年度台上字第101號民事判決 (2024-01-31) | https://data.judicial.gov.tw/opendl/JDocFile/TPSV/113%2C%E5%8F%B0%E4%B8%8A%2C101%2C20240131%2C1.pdf | 380,409 | 48453f8ba8b4995068344dc09bb12dfa4243ba74ac00bb7e2486b65f741043e5 |
| TPHV-115-勞上-39-20260818.pdf | 臺灣高等法院115年度勞上字第39號民事判決 (2026-08-18) | https://data.judicial.gov.tw/opendl/JDocFile/TPHV/115%2C%E5%8B%9E%E4%B8%8A%2C39%2C20260818%2C1.pdf | 1,020,057 | a53bf54fb22c417c7fbc44a24d7984b73a83d2e3ce0c96f9fc248986629e0898 |
| KSHV-115-勞上易-11-20261007.pdf | 臺灣高等法院高雄分院115年度勞上易字第11號民事判決 (2026-10-07) | https://data.judicial.gov.tw/opendl/JDocFile/KSHV/115%2C%E5%8B%9E%E4%B8%8A%E6%98%93%2C11%2C20261007%2C1.pdf | 678,233 | adb10f3918b6244ba9dd2decbe7da51e81806ef6baa26a6cf63b56c6d6701baa |
| TPHV-115-勞上-92-20260901.pdf | 臺灣高等法院115年度勞上字第92號民事判決 (2026-09-01), cited in zh only | https://data.judicial.gov.tw/opendl/JDocFile/TPHV/115%2C%E5%8B%9E%E4%B8%8A%2C92%2C20260901%2C1.pdf | 758,362 | a471215f6d41f7d8ea27d4285758a7ad96d5cb1d1ff62c7e83fe5bd29aca2f6f |

The links in the column body point to the same judgments on judgment.judicial.gov.tw (printData). That site returns a bot-defense page to requests without its session cookie; the open-data PDF URLs above do not.

## Where each statement in the drafts is found (line numbers = `grep -n` in the .txt)

最高法院113年度台上字第101號 (TPSV-113-台上-101-20240131.txt)
- 主文 上訴駁回: line 13.
- Reasonable probation clause; employer may observe ability, conduct (操守), fit with corporate culture and attitude; if unsuitable, may terminate during or after probation; lawful if the right is not abused: lines 116-118.
- Termination during labor-dispute mediation is unlawful under 勞資爭議處理法第8條: line 103. Later termination after mediation failed (調解不成立後) for inability to do the job: line 127.

臺灣高等法院115年度勞上字第39號 (TPHV-115-勞上-39-20260818.txt)
- Employer 佑全藥品股份有限公司, worker hired as 藥局門市人員: lines 4, 29-31, 76.
- 主文 上訴及擴張之訴均駁回 (dismissal upheld): line 15.
- Three interviews (113-07-29, 08-08, 08-15), both sides signed every record: lines 85-87.
- Assessment score 17.5 against the 80-point threshold, probation failed: lines 93-95.
- Court's own reasoning (四、本院得心證之理由 starts at line 103): during probation 「大致不能勝任」 is enough, not limited by 「解僱最後手段性原則」: lines 253-256; repeated at lines 380-383.

臺灣高等法院高雄分院115年度勞上易字第11號 (KSHV-115-勞上易-11-20261007.txt)
- 主文 上訴駁回 (first-instance judgment for the driver upheld): line 12.
- Pingtung 復康巴士 driver; fixed-term contract 114-01-01 to 114-12-31; probation 114-01-01 to 03-31 (three months): lines 15-18, 45-46, 82.
- 114-02-07 bus parked with engine off, struck from behind by a third party's vehicle: lines 19-22.
- 114-02-19 oral notice of termination effective 114-02-28: lines 27, 84.
- LINE report to the dispatch center (行控中心) and manager on the day: lines 24, 49, 96, 162, 172.
- Court's reasoning (六、…本院之判斷 starts at line 115): probation assessment must rest on objective facts reasonably connected with ability, attitude or fitness, bound by good faith and the ban on abuse of rights: lines 126-128.
- No serious failure in handling the accident's aftermath: lines 176-181.
- No evidence in the file of earlier traffic-safety, duty, complaint or insubordination records: lines 198-199 (page 6, lines 01-02 of the judgment).
- After probation the probation clause simply stops applying; the original contract continues without a new contract or a further expression of intent: lines 213-219.

臺灣高等法院115年度勞上字第92號 (TPHV-115-勞上-92-20260901.txt; zh only)
- Respondent 新北市政府環境保護局; worker a 儲備清潔隊員: lines 5, 20-21.
- 主文 上訴駁回: line 15.
- Probation 113-08-30 to 113-11-30: lines 21, 66, 102.
- Repeated lateness shown by swipe-card records; several interviews and written warnings (書面告誡): lines 112-116, 165.
- Part-time work outside working hours (兼職) affecting the contract: lines 152-159, 165.
- 113-11-26 interview: oral notice that the worker did not qualify for regular employment: lines 170, 184, 272.
- 113-12-12 written notice of termination on 113-12-26 for inability to do the job: lines 42-44, 171-172.
- Court's reasoning (五、本院之判斷 starts at line 87): absent abuse of rights the employer may terminate during or after probation: lines 180-181.
