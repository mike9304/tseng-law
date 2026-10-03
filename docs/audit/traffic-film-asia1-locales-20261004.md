# Six Asian locales: accident procedure and overtaking films

Twelve pages now have localized long films in Filipino, Indonesian, Malay, Vietnamese, Mongolian and Simplified Chinese. Accident procedure is 80 seconds / eight scenes; overtaking is 100 seconds / ten scenes. Each page uses one MP4 assembled from previously reviewed native ten-second Codex-reference/Grok 4.7 scenes, with burned-in captions and synchronized page text. No looping, slowing or still-frame padding.

All six overtaking articles and substantive general sections 1, 2, 5, 6, 7, 8 and 11 were read; general reference lists were omitted from extracts. The twelve source hashes remain unchanged. Copy was compared with the verified core films and prior primary Article 101 review. This is Codex review, not native-speaker or lawyer certification. Review scope and source hashes: `qa/general-asia1-content-review.json` and `qa/overtaking-asia1-content-review.json` under `/Users/son7/tseng-law-traffic-films`.

The general film preserves non-final police analysis, treatment necessity and causation, actual income-loss evidence, payment timing, insurance, waived and reserved claims, and future treatment before settlement. The overtaking film retains approaching opposite traffic OR two or more vehicles in line ahead, two short horn signals OR one headlight signal where allowed, yielding without repeated compulsion, left signal/pass with at least 0.5 m, and safe distance before right signal/return. The fictional two-car collision is separate from the anonymous motorcycle case. Models are uncalibrated and later parking photos do not show original crash positions. A violation alone fixes no fault share; conclusions remain case-specific.

| Film / locale / chapter | Problem wording | Reason | Revised wording | Meaning preserved |
| --- | --- | --- | --- | --- |
| general / mn / 3 | Ослын газрын зураг | Specify photographs rather than a map. | Ослын газрын гэрэл зураг | Yes |
| general / id / 8 | Sebelum tanda tangan, periksa tuntutan cadangan dan perawatan mendatang. | Use claims reserved in the agreement rather than backup claims. | Sebelum tanda tangan, cek tuntutan yang dicadangkan dan pengobatan mendatang. | Yes |
| general / fil / 2 | Ang paglipat ng sasakyan ay depende sa pinsala at kalagayan sa lugar. | Specify bodily injury rather than damage generally. | Paglipat ng sasakyan: ayon sa pinsala sa katawan at kalagayan sa lugar. | Yes |
| general / fil / 8 | Suriin ang oras ng bayad, seguro at mga paghahabol na tatalikuran. | Make payment deadline explicit rather than hour of payment. | Suriin ang takdang bayaran, seguro at mga paghahabol na tatalikuran. | Yes |
| overtaking / fil / 6 | Maaaring mawala ang naunang senyas at galaw kung bangga lang ang putol. | Describe the limited footage naturally while preserving omitted signals and motion. | Kung banggaan lang ang kuha, maaaring mawala ang naunang senyas at galaw. | Yes |
| overtaking / mn / 2 | Зөвшөөрсөн үед: дуут дохиог хоёр богино, эсвэл урд гэрлийг нэг удаа өгнө. | Name a headlight signal naturally and retain two short horn signals OR one headlight signal. | Зөвшөөрсөн үед: хоёр богино дуут дохио эсвэл урд гэрлээр нэг дохио. | Yes |
| overtaking / ms / 1 | Semak larangan memotong, tanda, jalan dan lalu lintas. | Split the prohibitions across two readable lines. | Semak larangan, tanda dan jalan; jika kenderaan lawan mendekat, jangan potong. | Yes |
| overtaking / ms / 1 | Dilarang jika kenderaan bertentangan mendekat atau sekurangnya 2 berderet di depan. | Keep at least two vehicles in a line ahead explicit in natural Malay. | Memotong juga dilarang apabila 2 atau lebih kenderaan berderet di hadapan. | Yes |
| overtaking / fil / disclosure | Mga kathang tao, sasakyan at dokumentong ginawa ng AI. Hiwalay ang pagdikit ng dalawang kotse sa anonimong kaso ng motorsiklo sa artikulo. Hindi ito patunay ng pagsunod sa senyas, pagbibigay-daan at distansya; hindi kinakalibrang panukat ang mga modelo. Kinukuhanan ang pinsala sa paradahan kalaunan, hindi sa orihinal na posisyon noong aksidente. Ilang kundisyon ng Artikulo 101 at pagsusuri ng ebidensya lang ang buod; nasa artikulo at opisyal na tuntunin ang lahat ng kundisyon. | State uncalibrated models directly rather than calling them measuring instruments. | Mga kathang tao, sasakyan at dokumentong ginawa ng AI. Hiwalay ang pagdikit ng dalawang kotse sa anonimong kaso ng motorsiklo sa artikulo. Hindi ito patunay ng pagsunod sa senyas, pagbibigay-daan at distansya; hindi naka-calibrate ang mga modelo. Kinukuhanan ang pinsala sa paradahan kalaunan, hindi sa orihinal na posisyon noong aksidente. Ilang kundisyon ng Artikulo 101 at pagsusuri ng ebidensya lang ang buod; nasa artikulo at opisyal na tuntunin ang lahat ng kundisyon. | Yes |
| overtaking / mn / 1 | Эсрэг машин ойртох, эсвэл урд 2 ба түүнээс олон машин дараалан явахад гүйцэхгүй. | Use a shorter natural at-least-two phrase; preserve approaching opposing vehicle OR at least two vehicles moving in line ahead and the prohibition. | Эсрэг машин ойртвол, эсвэл урд дор хаяж 2 машин цуварвал гүйцэхгүй. | Yes |

The revision ledger is `qa/asia1-caption-revisions.json`. Titles and captions state concrete facts and limitations without decorative bold or promotional framing. Removing the opening event or its evidentiary limitation would lose information. The endings retain settlement conditions or case-specific review.

All 108 final chapter samples across twelve contact sheets were visually inspected. Arial is used for five locales and PingFang SC for Simplified Chinese. General minimum body sizes: FIL 34, ID 31, MS 33, VI 36, MN 32, ZH-HANS 36px. Overtaking minimums: FIL 31, ID 34, MS 31, VI 35, MN 34, ZH-HANS 36px. Vietnamese marks, Mongolian Cyrillic and Chinese glyphs render without clipping.

Browser screenshots inspected: general FIL mobile/ch8, ID desktop/ch7, MS mobile/ch2; overtaking VI desktop/ch3, MN mobile/ch1, ZH-HANS desktop/ch2. Focused native controls can cover burned-in captions; synchronized page captions remain readable at at least 16px. The existing language-suggestion toast can overlap the lower disclosure.

All 455 tests in 29 files and clean `.next-asia1-films` build passed. Twenty-four complete normal-speed desktop/mobile journeys passed: no-gesture automatic start, mute and inline playback, retained manual pause after scrolling, native seeking, every chapter, correct document language, no page errors/overflow, exact media SHA-256 and HTTP 206 ranges. Reduced-motion manual playback passed. Reports: `qa/local-general-asia1/report.json` and `qa/local-overtaking-asia1/report.json`.

All assets fully decode as silent 1280×720 H.264 at 24fps, with 1,920 or 2,400 frames. The previous 113 registry entries remain unchanged. Codex local final review passed. Publication remains pending after automatic approval review rejected the main push; these films are not claimed live.

| Film | Locale | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| general | fil | 9386453 | `0db5e902c08346cc08a7b57bb609eddf26198ebbc77acd61c85e9fc13fb919b9` |
| general | id | 9381625 | `d9b1f50efd26289bc32e9d12a8e5aea558c2c33efff22a967709f92ea2dbda96` |
| general | ms | 9381024 | `4e4b4ff7a407302ee40995f4e8e325c4c9ac84352207e56ef540ca6b0adc87fa` |
| general | vi | 9371457 | `c1725e767a9ea1a9cdbfcab1c975fcc9c8b4c200b4644ef01b373b63ee3c8fca` |
| general | mn | 9386793 | `421325752e8f789e9dc70ae1ad1aa1cbd7911411e70759a1af0a2fc1cbad074d` |
| general | zh-hans | 9434615 | `747a24cab8cc28282ff8619b17fb214a62624228ac4845edf6142ac65046dc9a` |
| overtaking | fil | 10024882 | `b11aef6b96e1b810c42acc1683cc1724422e37b1cbb33ae0ccde9f620e756a11` |
| overtaking | id | 10084030 | `dddaa093c51486a5e0af37d29396c8c45ab9025256a20f07547e3601e104f7a3` |
| overtaking | ms | 10127094 | `a7200851cd4e6ff6f7da6d70cf90aa87b42bc614db5c8770a77d3bd345be222a` |
| overtaking | vi | 10100544 | `f2fda7ac4be1c3291267c4ba0394447fcb1d50014adc9bce4ae7a9694b6bda94` |
| overtaking | mn | 10130178 | `b2b1d4877f65855021d9060f0479609f9afd5dc6fd72f9d9edd679ae523b91d8` |
| overtaking | zh-hans | 10338182 | `1c8f1335a14b4aa0cc134b209c7f5be3e6cdbd8cd66e193ffe5c8c7ed5cef630` |
