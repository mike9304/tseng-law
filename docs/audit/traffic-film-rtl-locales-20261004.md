# Arabic, Persian, Hebrew and Urdu traffic films

Eight pages have locally reviewed films: accident procedure is 80 seconds / eight scenes and overtaking is 100 seconds / ten scenes. Each locale has one silent MP4 made from reviewed native ten-second Codex-reference/Grok 4.7 clips. No repeated clip within a film, slow motion or still padding is used.

All four complete overtaking articles, substantive general sections 1, 2, 5, 6, 7, 8 and 11, and their reference lists were read. Eight article hashes are unchanged. Official Articles 101 and 62 were rechecked on 2026-10-04 KST. Captions preserve the conditions and alternatives in the verified core films, the non-final nature of police analysis, actual-loss evidence, settlement scope and the overtaking film's independent fictional two-car scenario. They do not reconstruct the article's anonymous motorcycle case or assign percentages of fault. This is Codex review, not native-speaker or lawyer certification.

| Wording | Reason | Revision | Meaning preserved |
| --- | --- | --- | --- |
| Persian general chapter 8, nominal claims wording | Name the claims being given up directly. | زمان پرداخت، بیمه و مطالباتی را که از آن‌ها می‌گذرید بررسی کنید. | Yes: payment timing, insurance and waived claims remain. |
| Persian overtaking chapter 6, longer wording about omitted prior activity | Make the limitation of the collision excerpt clear and readable. | کلیپِ برخورد ممکن است علامت‌ها و حرکت‌های قبلی را حذف کند. | Yes: earlier signals and movements may be omitted. |

The full prior and revised wording is in `qa/rtl-caption-revisions.json` under `/Users/son7/tseng-law-traffic-films`. No decorative bold appears in the public copy. All 72 final chapter samples were visually read. RTL text is right-aligned without mirroring the road or evidence images; Geeza Pro renders Arabic, Persian and Urdu, and Arial Hebrew renders Hebrew. Body text stays at 36px in the 1280px video and the synchronized page captions stay at least 16px. The taller-script layout is retained. Forty-eight earlier Asia1 general overlays remained byte-identical after the renderer changes.

The player now uses a logical start border and isolates the current/total chapter counter as left-to-right text. This corrects the previously reversed counter order in RTL pages while retaining their right-to-left chapter prose. The QA script checks the actual chapter direction and border side. Final screenshots of Arabic mobile, Persian desktop, Hebrew mobile, Urdu desktop and English mobile chapter 3 were visually inspected after the correction; counters and text direction are correct. Focused native media controls can overlap burned-in captions; the synchronized page captions remain readable. The existing language suggestion toast can overlap lower text.

Validation: 477 tests in 31 files passed before the counter markup correction; 339 component/autoplay tests passed after it. Both clean RTL production builds passed. Sixteen complete normal-speed PC/mobile film journeys passed before the markup-only counter correction, including no-gesture autoplay, mute, playsInline, persistent manual pause, seek, every chapter, document language, no overflow or page errors, exact MP4 hashes and HTTP 206 ranges. Reduced-motion manual playback also passed. These reports are `qa/local-general-rtl/report.json` and `qa/local-overtaking-rtl/report.json`.

After the counter correction, the final build received a targeted browser check on all eight RTL pages plus both English pages at two viewport widths: 20 views / 180 chapters, no-gesture autoplay, real counter glyph order, isolated LTR counter, correct chapter direction and border, no overflow or page errors. This was not a second whole-playback run; see `qa/local-rtl-final-layout/report.json`.

All eight assets fully decode as silent H.264, 1280×720 at 24fps, with 1,920 or 2,400 frames. Eight source hashes and output hashes were checked again at final review; all previous 139 registry entries are unchanged. The merged production base remains 2dde9f99f. Codex local final review passed. These eight films have not been published; the separate work-loss approval was already fulfilled and does not include them.

| Film | Locale | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| general | ar | 7940474 | `b7dda25b1a26f986ad2b8a3fb8ca829df0644b7620ac2789dc1f3c5e3bc26540` |
| general | fa | 7980098 | `16177bd8852c70895f84b47329ee09eee0a140f6dcd8e7c21b42f23001cfb368` |
| general | he | 7975890 | `32a205db5650163c10146bd8344927c699a3665c602a3befb0ef223881480eaa` |
| general | ur | 8002539 | `b9ce8936799c5669e0336a528c122e5784510926fb6bcba07793b787e7c92ae8` |
| overtaking | ar | 8503207 | `684cdd30a8531899f21335f994c8578d24ec334116b9bf0767f254ce6a329a92` |
| overtaking | fa | 8574545 | `cda721388bfbb7fc28cdcc7595531076a23d7e75114018f62d4487fc01ebde9a` |
| overtaking | he | 8548581 | `fa5a7c7b8f11d821fc6e551a3e893d53171264209166a88b771118fd5974463e` |
| overtaking | ur | 8616788 | `410474db34cf73324922a8f564694a1cfdd3f82500ef4f6cb15b4bb60fb1b813` |
