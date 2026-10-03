# Eight Central and Southeastern European locales: traffic films

Sixteen pages now have localized long films in Polish, Czech, Slovak, Hungarian, Croatian, Slovenian, Serbian and Bulgarian. Accident procedure is 80 seconds / eight scenes; overtaking is 100 seconds / ten scenes. Each page has one MP4 assembled from the previously reviewed native ten-second Codex-reference/Grok 4.7 scenes. Translated burned-in captions and synchronized page text describe the article-specific sequence. No looping, slowing or still-frame padding.

All eight overtaking articles and the film-relevant general sections 1, 2, 5, 6, 7, 8 and 11 were read. General reference-link lists were omitted from the extracts. Copy was compared with the verified core films and prior primary-source review, including Article 101. Source hashes remain unchanged. This is Codex review, not native-speaker or lawyer certification. Review scope and hashes are in `qa/general-euro3-content-review.json` and `qa/overtaking-euro3-content-review.json` under `/Users/son7/tseng-law-traffic-films`.

The general film retains police analysis as non-final, treatment necessity and causation, actual income-loss evidence, and payment timing, insurance, waived and reserved claims and future treatment before settlement. The overtaking film preserves the two-or-more vehicles ahead prohibition, two short horn signals OR one headlight signal where permitted, yielding without repeated compulsion, left signal/pass with at least 0.5 m, and safe distance before the right signal and return to the original lane. It is an independent fictional two-car illustration, separate from the article's anonymous motorcycle case. Models are uncalibrated; later parking photographs are not original crash positions. Fault is not fixed by a violation alone, and the case-specific result is not generalized.

The following caption revisions preserve those conditions. The full revision ledger is `qa/euro3-caption-revisions.json`.

| Film / locale / chapter | Problem wording | Reason | Revised wording | Meaning preserved |
| --- | --- | --- | --- | --- |
| general / pl / 7 | Zestaw dokumenty medyczne, obecności, nieobecności i płac. | Use a natural parallel list while retaining medical, attendance, leave and payroll evidence. | Porównaj dokumenty medyczne, obecność, urlopy i dane o płacach. | Yes |
| general / cs / 7 | Porovnejte zdravotní, docházkové, mzdové doklady a absence. | Use parallel concrete evidence categories. | Porovnejte lékařské zprávy, docházku, absence a mzdové doklady. | Yes |
| general / sk / 7 | Porovnajte zdravotné, dochádzkové, mzdové doklady a absencie. | Use parallel concrete evidence categories. | Porovnajte lekárske správy, dochádzku, absencie a mzdové doklady. | Yes |
| general / bg / 8 | Проверете плащането, застраховката и отказа от претенции. | Name payment timing explicitly rather than payment alone. | Проверете срока за плащане, застраховката и отказа от претенции. | Yes |
| overtaking / pl / 1 | Nie wyprzedzaj przy ruchu z naprzeciwka lub co najmniej dwóch autach w rzędzie. | Restore explicit ahead position of the two-or-more vehicles. | Nie wyprzedzaj przy ruchu z naprzeciwka lub co najmniej dwóch autach w rzędzie z przodu. | Yes |
| overtaking / pl / 3 | Po uzyskaniu bezpiecznej odległości: prawy kierunkowskaz i powrót. | Keep safe distance before right signal and explicit return to original lane. | Po bezpiecznym oddaleniu: prawy kierunkowskaz i powrót na pierwotny pas. | Yes |
| overtaking / cs / 3 | Po získání bezpečné vzdálenosti dejte znamení vpravo a vraťte se. | Name original lane in the return sequence. | Při bezpečné vzdálenosti: znamení vpravo a návrat do původního pruhu. | Yes |
| overtaking / hr / 2 | Gdje je dopušteno: dva kratka zvuka trube ili jedan bljesak svjetala. | Specify vehicle headlights rather than an unspecified light. | Gdje je dopušteno: dva kratka zvuka trube ili jedan bljesak dugih svjetala. | Yes |
| overtaking / hu / 9 | Vizsgálja a látást, időt, elkerülhetőséget és a kedvezőtlen bizonyítékot is. | Use the view from the road rather than eyesight. | Vizsgálja a kilátást, időt, elkerülhetőséget és a kedvezőtlen bizonyítékot is. | Yes |
| overtaking / bg / 2 | Където е позволено: два кратки клаксона или едно премигване с фаровете. | Specify two short horn signals rather than plural devices. | Където е позволено: два кратки сигнала с клаксон или един с фаровете. | Yes |
| overtaking / pl / 1 | Nie wyprzedzaj przy ruchu z naprzeciwka lub co najmniej dwóch autach w rzędzie z przodu. | Shorten for readable type while keeping prohibition, approaching traffic, at least two and ahead in a line. | Nie wyprzedzaj: ruch z naprzeciwka lub co najmniej 2 auta w rzędzie przed tobą. | Yes |
| overtaking / bg / 9 | Оценете видимостта, времето, възможността за избягване и неблагоприятните данни. | Shorten inflections to preserve all evidence categories at readable type size. | Оценете видимост, време, възможност за избягване и неблагоприятни данни. | Yes |

Titles and endings are direct and factual, with no decorative bold, promotional filler, invented facts or human-review claims. All 144 final chapter samples across sixteen contact sheets were visually inspected. Minimum general body size is 36px except Bulgarian at 32px. Overtaking minimums: PL 33, CS 33, SK 33, HU 32, HR 35, SL 36, SR 36, BG 33px. Diacritics and Cyrillic render correctly; captions remain within the frame.

Browser screenshots inspected: general PL mobile/ch8, CS desktop/ch7, SK mobile/ch5, HU desktop/ch4; overtaking HR mobile/ch2, SL desktop/ch3, SR mobile/ch9, BG desktop/ch9. Native controls when focused can cover burned-in captions; separate synchronized page captions remain readable at at least 16px. The existing language-suggestion toast can overlap the lower disclosure.

All 441 tests in 29 files and the clean `.next-euro3-films` production build passed. Thirty-two complete normal-speed journeys at desktop and mobile sizes passed: start without a gesture, mute/inline playback, manual pause retained after scrolling, native seeking, all chapters, correct document language, no page errors or overflow, exact file hashes and HTTP 206 ranges. Reduced-motion manual playback passed. Reports: `qa/local-general-euro3/report.json` and `qa/local-overtaking-euro3/report.json`.

All assets fully decode as silent H.264 1280×720 at 24fps, with 1,920 or 2,400 frames. The previous 81 registry entries and source articles remain unchanged. Codex local final review passed. Production remains pending after automatic approval review rejected the main push; no publication is claimed.

| Film | Locale | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| general | pl | 9380375 | `9eace19511cf9216ee2461996f494a4a23e66796c77798772f83ddaa794ae2e5` |
| general | cs | 9379016 | `f59da1981c7a9844359fd8d83cddae99b274d562a677be38bfbe5b8649c1ae09` |
| general | sk | 9383492 | `4430696c6b95871d4559a52018ed7bd5af0edba1369e02ca96044bfcfe44a5f9` |
| general | hu | 9405035 | `a63e21e51e8c22070b234116350ca497638459c48bb97c459371a2c7909759e1` |
| general | hr | 9361628 | `4c7d1e6b2286a60ac5f54039dcc2acab0a40a33a814f0b51546958eefd68d2fc` |
| general | sl | 9382944 | `761a8d531f85e6d672dbcace1f68417c705974664ef84885e5db84be61fada99` |
| general | sr | 9358685 | `f917e35b8af1420c1eceddf4d2e4a4102d21dc2e19d3c00602629d60c49ccf3b` |
| general | bg | 9378210 | `70f5718d78a1e2f91735029f98d21aa25c40da2e64ae20d29af0474f82ef566f` |
| overtaking | pl | 10088693 | `4bdef158297922b7438d2c569ba046e887ac9183e1c4cc811b0bee857e4c6727` |
| overtaking | cs | 10145013 | `18295f82b242e6b477f30c8178f69a1790c56e36e1e4fdfe4e5220e4e1c2e782` |
| overtaking | sk | 10151014 | `6ef029c0bda0ddc3b26dbf00163f38b22f272f60a88722ff093d224c14cab0d0` |
| overtaking | hu | 10093774 | `7f6f9e38d7bec713ba655e77aaa468d35956ed3edd7d248dc569f7f4e6ba5bd4` |
| overtaking | hr | 10053234 | `e39594c8c23800e1e5c6696d6386c18bce0e58043c6c49b4911d9eb829a95ab5` |
| overtaking | sl | 10144047 | `ea2f5c136752cdd9daded0fb7a3ed4a10e1bac3dceb0b501c460d0fd31aed63c` |
| overtaking | sr | 10045045 | `cfaae57a80a76f20899f11918c8b06fe184a3f5eeda269c70291a5bde51d3949` |
| overtaking | bg | 10058263 | `b0f55edd9da6972e9b05be0df86753bcd34187d7ec8d7e5968e51600b21ff63f` |
