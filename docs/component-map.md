# Component Map

## Global
- `Header`: Two-tier global navigation (utility bar + mega menu), sliding indicator, search button, CTA, mobile drawer trigger
- `Footer`: Skyline + dark footer bar with office links, legal links, social links
- `SearchOverlay`: Global search overlay with tabs and suggestions
- `MobileNavDrawer`: Mobile navigation with focus trap
- `ScrollTopButton`: Global fixed return-to-top button (500px trigger)
- `ScrollProgressLine`: Global top progress indicator (scroll-linked 2px bar)
- `QuickContactWidget`: Floating quick-contact panel with phone/email/CTA
- `Reveal`: Scroll reveal wrapper (prefers-reduced-motion aware)
- `SectionDotNav`: Right-side section progress/navigation dots on homepage
- `LocaleSetter`: Sets `html[lang]` on the client for locale accuracy
- `SmartLink`: Internal/external link helper
- `EditorialSection`: Section wrapper for editorial layout
- `ListModule`: List layout wrapper for module lists

## Homepage
- `HeroSearch`: Hero headline + search bar
- `HeroMediaBackground`: Rotating hero video/poster background with fallback
- `HeroTypingLine`: Hero rotating typing phrase line
- `KeywordChips`: Recommended keyword chips under search
- `HeroHighlightsCarousel`: Under-search image carousel of key content
- `HomeAttorneySplit`: Asymmetric split (image-left) attorney section on homepage
- `HomeCaseResultsSplit`: Asymmetric split (image-right) case results section on homepage
- `HomeStatsSection`: Scroll-triggered stats counter grid
- `ScrollHighlightText`: Scroll reveal/highlight text treatment for philosophy copy
- `MajorNewsSection`: Featured + list layout for major news
- `AchievementsCarousel`: Horizontal key-results track with arrow controls
- `FirmUpdatesSection`: Tabbed firm updates list (news/media/seminars)
- `VideoChannel`: Featured video + thumbnail list
- `InsightsArchiveSection`: Editorial archive view for 호정칼럼 (featured + list)
- `HomeContactCta`: Dark full-width contact CTA section
- `CaseGuidesSection`: Case guides / practice guides list
- `NewsletterSection`: Newsletter list module
- `WarningBannerSection`: Security notice banner
- `SectionLabel`: Editorial small-cap section label
- `OrnamentDivider`: Thin line + ornament SVG
- `PageHeader`: Shared page heading block
- `Breadcrumbs`: Interior page breadcrumb (Home > Current)
- `ContactBlocks`: Structured contact group cards
- `OfficeMapTabs`: Office tabs + Google Maps embed panel
- `AttorneyProfileSection`: Split attorney profile module
- `FAQAccordion`: One-open-at-a-time FAQ list with micro animation + aria controls

## Shared UI
- `Button`: Primary/secondary button styles (CSS)
- `Card`: Base card surface with hover elevation (CSS)
- `Link underline`: Animated underline on links (CSS)
- `UpdatesTabs`: Tabbed updates list used on About/Lawyers/Insights pages

## Utilities
- `search` (lib): Search index + filter utilities
- `path-utils` (lib): Locale-prefix path normalization for language switch links
- `faq-content` (data): locale FAQ content for accordion + JSON-LD

## Pages
- `/[locale]/page`: Homepage composition
- `/[locale]/search`: Search results page
- `/[locale]/contact`: Contact blocks
- `/[locale]/services`: Services index
- `/[locale]/insights`: Insights index
- `/[locale]/videos`: Video index
- `/[locale]/faq`: FAQ index
- `/[locale]/lawyers`: Lawyers index
