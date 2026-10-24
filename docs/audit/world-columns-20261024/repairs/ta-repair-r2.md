# ta repair round 2 — response to reviews/codex-ta-r2.md

Checked 24 October 2026 with `python3 tools/law.py A0030295 6 24` and `python3 tools/law.py N0030020 11 12`. Edited only `drafts/ta/831-…` and `drafts/ta/832-…` and this file. 833 was PASS and is untouched.

Result: 831 M1 ACCEPTED. 832 M1 ACCEPTED.

---

## 831 M1 — FPA art. 6 does not exclude licensed occupations — ACCEPTED

Statute (A0030295 art. 6): "外國人取得國內外大學之碩士以上學位，或教育部公告世界大學排名前一千五百名大學之學士以上學位者，受聘僱在我國從事就業服務法第四十六條第一項第一款專門性或技術性工作，除應取得執業資格、符合一定執業方式及條件者，及應符合中央目的事業主管機關所定之法令規定外，無須具備一定期間工作經驗。"

The exception clause lists what still applies (obtaining the practice qualification, meeting the practice method and conditions, complying with sector-authority law); the only thing waived is the period of work experience. My r1 sentence said the waiver "does not apply to jobs that need a licence", which turned the carve-out into an exclusion. The reviewer's replacement matches the text, so I used it.

- Old: "தொழில் உரிமம் தேவைப்படும் பணிகளுக்கும் துறைசார் சட்டத் தேவைகளுக்கும் இந்தத் தளர்வு பொருந்தாது."
- New: "இருப்பினும், தொழில் புரிவதற்குத் தேவையான தகுதியைப் பெறுதல், அதற்கான முறைகள் மற்றும் நிபந்தனைகளைப் பூர்த்தி செய்தல், துறைசார் சட்ட விதிகளைக் கடைப்பிடித்தல் ஆகிய கடமைகள் தொடர்கின்றன."
- Unchanged: the degree criteria (master's or higher from any university; bachelor's or higher from a Ministry of Education top-1,500 university), the experience waiver, the salary sentence (N0090031 art. 8). The FAQ does not mention art. 6, so no FAQ change.

---

## 832 M1 — preserved old-system service is not "everything before 1 January 2026" — ACCEPTED

Statute text read:
- A0030295 art. 24(1) proviso: the election to stay on the Labor Standards Act (LSA) rules is open to those "於本法中華民國一百十四年八月二十九日修正之條文施行前已受僱且仍服務於同一事業單位", within six months of commencement.
- Art. 24(3): "依第一項規定適用勞工退休金條例退休金制度者，其適用前之工作年資依該條例第十一條規定辦理" — the preserved service is service before the new system became applicable to that person ("適用前").
- Art. 24(5): "第一項外國專業人才及外國特定專業人才於本法……修正之條文施行前已適用勞工退休金條例，或已依法向雇主表明繼續適用勞動基準法之退休金制度者，仍依各該規定辦理，不適用前四項規定" — those already in the new system before commencement, and those who had validly elected the old system, continue as before.
- Art. 24(6): where the old-system election window under the earlier rules had not yet expired at commencement, the six-month period still runs; if no election is made, the employer must contribute retroactively "自其取得永久居留許可之日起" — i.e. a person's actual transition date can lie before 1 Jan 2026.
- N0030020 art. 11(2): preserved service is paid "以契約終止時之平均工資，計給該保留年資之資遣費或退休金，並於終止勞動契約後三十日內發給".
- N0030020 art. 12(2): "依前項規定計算之資遣費，應於終止勞動契約後三十日內發給" (this is the new-system severance, so the 30-day rule is not only for the old formula).
- N0030020 art. 12(3): those who stay on the LSA pension rules are paid severance under LSA art. 17 (LSA art. 17(2): payable within 30 days).

My r1 text said that anyone who was already at the employer before 1 January 2026 has the earlier service computed under LSA art. 17, which is wrong for a person who was already in the new system before that date and for a person whose actual transition date differs. The reviewer is right on the substance.

Changes (body, three places; FAQ 2):
- Severance paragraph in the dismissal section: "2026 ஜனவரி 1-க்குப் பிந்தைய நிபுணர் பணிக்காலத்துக்கு வேறு சூத்திரம்…" → "புதிய ஓய்வூதிய முறைக்குரிய பணிக்காலத்துக்கு வேறு சூத்திரம் பொருந்தும் (அடுத்த பகுதி)."
- Pension-section paragraph: old "தெரிவிக்காதவரின் முந்தைய பணிக்காலம் பாதுகாக்கப்பட்டு, வேலை முடியும் நாளின் சராசரி ஊதியத்தில் பழைய விதிப்படி தனியாகக் கணக்கிடப்படுகிறது (ஓய்வூதியச் சட்டம் பிரிவு 11)" → "2026 ஜனவரி 1-க்கு முன்பே புதிய முறையில் இருந்தவருக்கு அந்த முறை தொடரும் (பிரிவு 24 ஐந்தாம் பத்தி). புதிய முறை தன்மீது பொருந்தத் தொடங்குவதற்கு முன் அதே நிறுவனத்தில் பழைய முறையில் செய்த பாதுகாக்கப்பட்ட பணிக்காலத்துக்கு மட்டுமே பிரிவு 17-இன் கணக்கீடு பொருந்தும்; அது வேலை முடியும் நாளின் சராசரி ஊதியத்தில் தனியாகக் கணக்கிடப்படுகிறது (ஓய்வூதியச் சட்டம் பிரிவு 11)."
- Summary paragraph: old "ஆகவே 2026 ஜனவரி 1-க்குப் பிறகு சேர்ந்த நிபுணருக்கு முழு நஷ்டஈடும் அரை மாதச் சூத்திரத்தில் வரும்; அதற்கு முன் சேர்ந்தவருக்கு இரு பகுதிகள் இருக்கலாம்…" → "ஆகவே புதிய முறைக்குரிய பணிக்காலத்துக்கு அரை மாதச் சூத்திரம்; பாதுகாக்கப்பட்ட பழைய பணிக்காலத்துக்கு மட்டும் ஒரு மாதச் சூத்திரம்; பழைய முறையைச் செல்லுபடியாகத் தேர்ந்தவருக்கு முழுவதும் ஒரு மாதச் சூத்திரம். எந்த முறையிலும் நஷ்டஈடு வேலை முடிந்த 30 நாளுக்குள் வழங்கப்பட வேண்டும் (ஓய்வூதியச் சட்டம் பிரிவு 11, 12-இன் இரண்டாம் பத்திகள்; தொழிலாளர் தரநிலைச் சட்டம் பிரிவு 17 இரண்டாம் பத்தி)." The 30-day deadline is now stated for every branch, not only the old formula. The sentence about the average-wage definition and the "ask which article each part rests on" sentence are unchanged.
- FAQ 2: the "முந்தைய பணிக்காலம்" sentence replaced with "புதிய முறை பொருந்தத் தொடங்குவதற்கு முன் அதே நிறுவனத்தில் பழைய முறையில் செய்த பாதுகாக்கப்பட்ட பணிக்காலத்துக்கு மட்டுமே தொழிலாளர் தரநிலைச் சட்டம் பிரிவு 17-இன் கணக்கீடு (முழு ஆண்டுக்கு ஒரு மாதம்) பொருந்தும் (ஓய்வூதியச் சட்டம் பிரிவு 11). 2026 ஜனவரி 1-க்கு முன்பே புதிய முறையில் இருந்தவருக்கு அந்த முறை தொடரும்; அவரது எல்லா முந்தைய ஆண்டுகளுக்கும் ஒரு மாதச் சூத்திரத்தைப் பயன்படுத்தக்கூடாது." and the closing "இரு பகுதிகளுக்கும் நஷ்டஈடு வேலை முடிந்த 30 நாளுக்குள் வழங்கப்பட வேண்டும் (ஓய்வூதியச் சட்டம் பிரிவு 11, 12)."
- Kept: the half-month formula and six-month cap (art. 12(1)), the 30 June 2026 election window and that the election cannot be changed (art. 24(1)–(2); BLI notice).

I did not copy the reviewer's FAQ paragraph verbatim; its content (only the preserved old-system service takes art. 17; pre-2026 new-system persons continue; art. 12 for new-system service; valid prior election continues; 30-day payment) is all in the text, except that I kept the existing sentences on the amounts and the election deadline.

Checks: front matter parses as YAML; every statute link exists in the fetched pages; body links and source lists match; `variety_metrics.py --lang hi` (proxy): no FAIL. Main-text size now: 831 831 words / 7,353 characters; 832 1,033 words / 8,779 characters (832 was 8,413 after round 1; the added statement of the transition rule and the 30-day deadline accounts for the growth).
