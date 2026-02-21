# Typography Spec

## Font Choices
- Korean UI/body: Pretendard Variable (CDN temporary, recommend self-host later)
- Korean headings: Nanum Myeongjo (`400/700/800`) for editorial authority
- zh-Hant body: Noto Sans TC system stack (`Noto Sans TC`, `PingFang TC`, `Microsoft JhengHei`)
- zh-Hant headings: Noto Serif TC system stack (`Noto Serif TC`, `Songti TC`, `PMingLiU`)

## Scale (Responsive)
- H1: `clamp(2.4rem, 2vw + 2rem, 3.8rem)`
- H2: `clamp(1.8rem, 1.2vw + 1.4rem, 2.6rem)`
- H3: `clamp(1.4rem, 0.8vw + 1.2rem, 2rem)`
- Body: `clamp(1rem, 0.2vw + 0.95rem, 1.1rem)`
- Small/label: `0.78rem – 0.9rem` with tracking

## Line-Height
- Body: 1.72 (CJK-friendly)
- Headings: 1.15–1.25 based on size

## Locale Notes
- ko: Pretendard body + Nanum Myeongjo headings to create formal law-firm tone
- zh-Hant: Serif headings to add editorial tone; generous letter spacing in labels

## Examples
- H1: Heavy weight, compact line-height, used in hero
- H2: Section titles paired with small-caps label
- Body: 1.65 line-height, neutral tone for editorial readability

## Implementation Notes
- Pretendard is included via CDN CSS for now due to offline environment.
- Nanum Myeongjo / Noto Sans TC / Noto Serif TC / Cormorant Garamond are loaded via Google Fonts CSS import.
- Replace with self-hosted files via `next/font/local` when font files are available.
- `next/font/google` was removed for zh-Hant in this workspace because sandbox DNS blocks Google Fonts during `next build`.
