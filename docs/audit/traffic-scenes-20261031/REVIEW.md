# 975 traffic column editorial and scene review — 2026-10-31

Scenario: a fictional car stops beyond a signalized junction's stop line, then reverses toward a stationary scooter ridden by a foreign resident. No real case, person, place, plate, company, judgment, fault percentage, speed or measured distance is used. The illustrated contact has no assumed personal injury.

## Sources and cross-language meaning

The four individual statutory articles were opened at law.moj.gov.tw and recorded in `~/tseng-traffic-lane/runs/20261031-0447/SOURCES.md`: Road Traffic Safety Rules 110(1)–(2), Road Traffic Management and Penalty Act 50(2), Civil Code 184(1) and 217(1). Ko, zh-hant and en all distinguish (a) listed restricted reversing locations and the rule's exception, without claiming that every junction prohibits reversing; (b) signaling from checking for traffic behind; (c) an administrative fine from civil damages; (d) possible contributory fault from a preset ratio. They all identify the film and cover as fictional. The video itself and its localized player disclosure identify AI generation; the public article byline, image caption and alt text do not assign an AI or human author.

## Opening and native-voice check

The three prior published columns in each language were 949 (national park filming), 950 (listed-share estate valuation), and 951 (subcontractor occupational accident). Their openings use, respectively, a penalty amount or public news, a stock-valuation comparison or question, and insurance or worker-liability exposition. This column opens with the car's position and reversing lamps (ko/zh/en); it does not copy their question-led or law-first framing.

The first two paragraphs in all three files were tested sentence by sentence for deletion. The first contains the vehicle position plus the operative reversing duty; removing it would lose the legal premise. The second supplies the fictional vehicle movement, lack of assumed injury, and media disclosure; removing it would turn an illustration into an unexplained factual account. No sentence could be dropped without losing one of those facts or conditions.

| Original or flagged phrase | Issue | Revision | Meaning retained? |
|---|---|---|---|
| `정지선 앞에서 차가 후진등을 켰습니다.` and the first title | “Ahead of the stop line” could mean before, rather than beyond, the line. | `정지선을 넘은 차가 후진등을 켰습니다.` and `대만 정지선을 넘은 차가 후진하다 오토바이와 접촉` | Yes; matches all three versions and the scene. |
| Ko continuous medium-length sentences around the vehicle stop and evidence sections | Monotonous sentence length; tool found two FAILs. | Added `두 차는 멈춥니다.`, `순서가 관건입니다.`, `실측값이 없습니다.` in their factual contexts. | Yes; no new legal claim or measurement. |
| Zh continuous medium-length sentences around the vehicle stop and evidence sections | Monotonous sentence length; tool found two FAILs. | Split the stop event and added `倒車燈亮了。`, `畫面沒有量尺。` where those statements are supported. | Yes; no signal duty or measurement changed. |
| `후진등은 뒤차에 움직임을 알리는 신호이지…` | The Korean body had no reader question and almost every sentence had the same formal ending. | Added `후진등을 켰다면 뒤쪽 확인도 끝난 걸까요?` before the existing answer. | Yes; the signal and lookout duties remain distinct. |

Final variety_metrics check: ko, zh-hant, en all exit 0 / FAIL 0. Section 5 self-check: no stock hypothetical opener; at least two short sentences; no triple repeated paragraph opening; no three consecutive citation–caveat paragraphs; paragraph without citation present; contrast template count 0; final substantive paragraph returns to original footage of the reverse movement; ko remains formal 합니다체; no decorative bold, fabricated first person or checklist headings; statutes, links, fiction and video AI media labels remain present. The ko tool emits a nonblocking formal-ending warning; natural 합니다체 was retained.

## Generated scenes

The initial reference image is `references/reverse-scooter-reference.png` in the run folder. Every Grok 4.7 `reference_to_video` invocation has a unique prompt, streaming receipt, stderr, state and QA JSON in that folder. `qa/scene-review-1.md` records the visible reasons for rejecting original 02/03 and replay v2. The final four source scenes are establishment 01, stationary pre-movement 04, reverse/contact 02-v2, and close stationary aftermath 03-v3. The 04 prompt described aftermath, but the reviewed visual is stationary before the close approach; assembly uses the image shown, with no claim of exact continuous timing across shots. The montage and localized labels are editorial illustration, not evidence. Source frames show no visible person, plate, company mark or recognizable incident location.

The embedded labels read “AI 가상 재연 · 실제 사고 아님”, “AI虛構再現 · 非真實事故”, and “AI FICTIONAL REENACTMENT”. Player descriptions independently disclose separate generation and the absence of measurements.
