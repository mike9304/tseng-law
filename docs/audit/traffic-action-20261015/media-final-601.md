# 601 final render independent QA — PASS

The current Korean and Traditional Chinese local final files and posters pass the requested final-render checks. Root retains final approval and public/browser playback verification. The accepted raw source-motion review was not repeated.

The requested `qa/601-media.json` does not exist; the actual producer manifest is `qa/uturn-action-20261015-v1-media.json`. Its exact paths were used. The actual selection SHA matches that manifest: `4ae9abe4a16183e17a765593ba8247d359b64c109a83a22dcf29447a4b6a1127`.

## Directly inspected

Independent extraction from each final file produced the complete1fps timeline plus last frame, and cut-adjacent raw frames at24fps. All6 whole-timeline sheets, all6 cut sheets, and both full-resolution posters were opened. Every one of the8 shots has its start/end checked; there are7 internal transitions. This is frame inspection, not a claim of real-time/public browser playback or audio listening.

Both versions show persistent AI fictional/nonactual-footage disclosure. Every shot starts with its own separate-view reconstruction caption. The Korean and Traditional Chinese captions match their camera/action, retain the intended meaning, and show no clipping or missing glyphs in inspected frames. Scene headings summarize each complete shot; they do not claim a measured brake-on or first-touch timestamp.

The two posters depict the initial silver dash approach with a distant blue vehicle and continuous double yellow. They include the AI/nonactual disclosure and the corresponding separate-view title. These are approach posters, not collision stills; they are consistent with the video opening and fictional article premise.

## Approved trim mapping

| Shot | Source | Source interval | Final interval | Frame interval (inclusive) |
|---|---|---:|---:|---:|
| 1 | uturn-dash-turn-01.mp4 | 0–7.5 | 0–7.5 | 0–179 |
| 2 | uturn-wide-03.mp4 | 0–4 | 7.5–11.5 | 180–275 |
| 3 | uturn-dash-contact-02.mp4 | 0–5.75 | 11.5–17.25 | 276–413 |
| 4 | uturn-high-contact-01.mp4 | 0–4.25 | 17.25–21.5 | 414–515 |
| 5 | uturn-top-contact-01.mp4 | 0–4.75 | 21.5–26.25 | 516–629 |
| 6 | uturn-wide-contact-01.mp4 | 0–3.75 | 26.25–30.0 | 630–719 |
| 7 | uturn-low-contact-01.mp4 | 0–4 | 30.0–34.0 | 720–815 |
| 8 | uturn-dash-contact-01.mp4 | 0–5.25 | 34.0–39.25 | 816–941 |

Internal cuts:7.5,11.5,17.25,21.5,26.25,30,34 seconds (frames180,276,414,516,630,720,816). Two preceding and first two following frames at each cut carry the correct caption for the corresponding view. No black/mixed frame, prior-scene caption lag, or excluded source tail was observed. Distance/damage resets occur only at disclosed separate-view changes.

The last two frames940–941 remain the damaged blue-front-side/silver-hood aftermath. Final frame941 is at39.208333s and ends at39.25s. No black terminal slate or padded hold was added beyond the selected endpoint.

## Media verification

Each file is1280×720,24fps,942frames,39.25s. Independent full decode returned0. Each has one video stream and no audio stream. Hashes were checked again after visual inspection; neither finals nor posters changed during review.

- ko video SHA-256: `e92c1e62bbe44cf5be68531d9fa7794ad92a888a899998958bf1cf8cbf97b967`
- ko poster SHA-256: `c58f71aa4d26308a91f3a3b654aabb84a5e3eda1c6610d2d0b042173b99382f3`
- zh-hant video SHA-256: `8cf35c94ca91e696595c52fc5e80779479947f0b755a16d37bbef63679b2e6ec`
- zh-hant poster SHA-256: `2e8bfaf4a8f88c3f80cd35ededa11f23f1fa723bba814f855b892c332309bc1c`

## Article fit and scope

Both601 articles were read for the fictional premise: a blue vehicle crosses continuous double yellow into the silver straight-ahead vehicle path. The render and posters agree with this premise and retain AI/nonactual status. They do not state real-event provenance, a fixed liability ratio, measured speed/force, or certified contact timing. Source-specific limitations from prior QA remain; this report does not certify synchronized multicamera or physical measurement accuracy. This is not a new legal/prose audit.

No unresolved findings within this scope. Public deployment, actual desktop/mobile browser playback and page-level layout remain with root.

`manifest.json` preserves actual paths, SHA, probe and decode evidence. `review.json` contains structured findings and timeline. Full-resolution frame sets and timestamp indexes are in `ko/` and `zh-hant/`; sheets/poster copies sit beside this report. Only this QA directory was written; source media, final videos, posters, selections, articles and repository were not changed.
