import DecorativeAutoplayVideo from '@/components/DecorativeAutoplayVideo';
import { DECORATIVE_VIDEO_CONTROL_LABELS } from '@/components/decorative-video-controls';
import { ZH_VIDEO_CONTROL_ICONS } from '@/components/zh-hant-icons/ZhHantMonoIcon';
import styles from '../ZhHantDesign.module.css';

/**
 * zh-hant home first screen: a full-bleed dawn cloud sea over the Central Mountain Range behind the headline
 * (decorative; generated imagery and seamless 8.6s landscape/portrait loops, no people or text). The still is the poster and
 * stays for reduced-motion and save-data visitors; phones get a portrait frame whose dark sky carries the
 * headline. Passed to HeroSearch through its optional `media` slot, so the shared hero markup is unchanged.
 */
export const ZH_HANT_HERO_MEDIA = {
  poster: '/images/editorial/taiwan-dawn-cloud-sea-hero.webp',
  mobilePoster: '/images/editorial/taiwan-dawn-cloud-sea-hero-portrait.webp',
  mp4: '/videos/taiwan-dawn-cloud-sea-hero.mp4',
  webm: '/videos/taiwan-dawn-cloud-sea-hero.webm',
  mobileMp4: '/videos/taiwan-dawn-cloud-sea-hero-portrait.mp4',
  mobileWebm: '/videos/taiwan-dawn-cloud-sea-hero-portrait.webm',
  mobileMediaQuery: '(max-width: 767px)',
};

export default function ZhHantHeroMedia() {
  return (
    <div className={styles.heroBackdrop}>
      <DecorativeAutoplayVideo
        className={styles.heroBackdropPlayer}
        imageClassName={styles.heroBackdropImage}
        videoClassName={styles.heroBackdropImage}
        poster={ZH_HANT_HERO_MEDIA.poster}
        mobilePoster={ZH_HANT_HERO_MEDIA.mobilePoster}
        mp4Src={ZH_HANT_HERO_MEDIA.mp4}
        webmSrc={ZH_HANT_HERO_MEDIA.webm}
        mobileMp4Src={ZH_HANT_HERO_MEDIA.mobileMp4}
        mobileWebmSrc={ZH_HANT_HERO_MEDIA.mobileWebm}
        mobileMediaQuery={ZH_HANT_HERO_MEDIA.mobileMediaQuery}
        alt=""
        sizes="100vw"
        priority
        deferVideoUntilPosterPaint
        deferVideoUntilPosterPaintOnAllViewports
        rootMargin="0px"
        controlLabels={DECORATIVE_VIDEO_CONTROL_LABELS['zh-hant']}
        controlIcons={ZH_VIDEO_CONTROL_ICONS}
      />
    </div>
  );
}
