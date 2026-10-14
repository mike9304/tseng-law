import IntlHeroFilm from '@/components/intl-design/IntlHeroFilm';
import { INTL_HERO_MEDIA, intlHeroAiCaption } from '@/data/intl-design-site';
import type { IntlDesignLocale } from '@/lib/intl-design-locales';

/**
 * Folio home hero plate (DIRECTION §5): a framed still of a generic city by day, never with text on it. The still is
 * server-rendered as the likely LCP (eager, high priority); the 5 s film is injected on the client after load by
 * IntlHeroFilm, so the server HTML carries no <video>. The image itself is decorative (alt=""); the caption under the
 * frame says, in the page language, that the scene is AI-generated. Styled structurally under the Folio root
 * (`.folio [data-intl-hero-plate] …`), so the markup carries no class names.
 */
export default function IntlHeroPlate({ locale }: { locale: IntlDesignLocale }) {
  return (
    <figure data-intl-hero-plate="">
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element -- fixed 2-size srcset; next/image would add a loader URL per width */}
        <img
          src={INTL_HERO_MEDIA.still1280}
          srcSet={`${INTL_HERO_MEDIA.still640} 640w, ${INTL_HERO_MEDIA.still1280} 1280w`}
          sizes="(min-width: 75rem) 690px, 100vw"
          width={INTL_HERO_MEDIA.width}
          height={INTL_HERO_MEDIA.height}
          alt=""
          fetchPriority="high"
          decoding="async"
        />
        <IntlHeroFilm />
      </div>
      <figcaption>{intlHeroAiCaption[locale]}</figcaption>
    </figure>
  );
}
