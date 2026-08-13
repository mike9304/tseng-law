'use client';

import DecorativeAutoplayVideo, {
  DECORATIVE_VIDEO_CONTROL_LABELS,
} from '@/components/DecorativeAutoplayVideo';
import type { SiteLocale } from '@/lib/locales';

type HeroMediaSlide = {
  image: string;
  mp4: string;
  webm: string;
  mobileImage: string;
  mobileMp4: string;
  mobileWebm: string;
};

const defaultSlides: HeroMediaSlide[] = [
  {
    image: '/images/editorial/taichung-courthouse-civic-daylight-v2.webp',
    mp4: '/videos/taichung-courthouse-civic-daylight-v2.mp4',
    webm: '/videos/taichung-courthouse-civic-daylight-v2.webm',
    mobileImage:
      '/images/editorial/taichung-courthouse-civic-daylight-v2-mobile.webp',
    mobileMp4:
      '/videos/taichung-courthouse-civic-daylight-v2-mobile.mp4',
    mobileWebm:
      '/videos/taichung-courthouse-civic-daylight-v2-mobile.webm',
  },
];

// 전 로케일 공통: ko 사이트 기준 로테이터 (2026-07-28 사용자 지시 — zh-hant 야경 단일컷 예외 폐지)
const slidesByLocale: Partial<Record<SiteLocale, HeroMediaSlide[]>> = {};

export default function HeroMediaBackground({ locale }: { locale?: SiteLocale } = {}) {
  const slides = (locale && slidesByLocale[locale]) || defaultSlides;
  const slide = slides[0];

  return (
    <div className="hero-media">
      <div className="hero-media-item" data-active="true">
        <div className="hero-media-fallback">
          <DecorativeAutoplayVideo
            className="hero-media-video-shell"
            imageClassName="hero-media-image"
            videoClassName="hero-media-video"
            poster={slide.image}
            mp4Src={slide.mp4}
            webmSrc={slide.webm}
            mobilePoster={slide.mobileImage}
            mobileMp4Src={slide.mobileMp4}
            mobileWebmSrc={slide.mobileWebm}
            alt=""
            sizes="100vw"
            rootMargin="-1px 0px"
            controlLabels={
              DECORATIVE_VIDEO_CONTROL_LABELS[locale ?? 'ko']
            }
          />
        </div>
      </div>
    </div>
  );
}
