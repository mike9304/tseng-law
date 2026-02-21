# Typography Parity Spec

## Font Choices
- Korean UI/body: Pretendard Variable (primary).
- Korean headings: Nanum Myeongjo for serif editorial rhythm.
- Chinese (zh-Hant) body: Noto Sans TC system stack.
- Chinese (zh-Hant) headings: Noto Serif TC system stack.

## Scale (Responsive Targets)
- H1: clamp(2.4rem, 3vw + 1.4rem, 4.2rem), line-height 1.1
- H2: clamp(1.8rem, 1.2vw + 1.4rem, 2.6rem), line-height 1.2
- H3: 1.15–1.3rem, line-height 1.3
- Body: 1rem–1.1rem, line-height 1.65–1.75
- Small/meta: 0.75–0.9rem, line-height 1.4

## Spacing Rhythm
- Section padding: 6–9rem top/bottom depending on viewport.
- Editorial spacing: titles separated by 0.8–1.6rem; list rows by 0.6–1.2rem.
- Hairline dividers between list items and module blocks.

## Locale Notes
- KO: keep tracking slightly negative (-0.01em) to avoid looseness.
- zh-Hant: use Noto Serif TC for headings to keep editorial tone; maintain generous line-height.

## Verification
- These targets are set for parity feel and should be verified against Sejong’s computed styles when direct devtools access is available.
- In network-restricted build environments, avoid `next/font/google` fetch-time dependencies.
