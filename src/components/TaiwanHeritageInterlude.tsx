import DecorativeAutoplayVideo, {
  DECORATIVE_VIDEO_CONTROL_LABELS,
} from '@/components/DecorativeAutoplayVideo';
import type { SiteLocale } from '@/lib/locales';

export const TAIWAN_HERITAGE_INTERLUDE_MEDIA = {
  poster: '/images/editorial/taiwan-sanheyuan-modern-daylight-v2.webp',
  webmSrc: '/videos/taiwan-sanheyuan-modern-daylight-v2.webm',
  mp4Src: '/videos/taiwan-sanheyuan-modern-daylight-v2.mp4',
  mobilePoster:
    '/images/editorial/taiwan-sanheyuan-modern-daylight-v2-mobile.webp',
  mobileWebmSrc:
    '/videos/taiwan-sanheyuan-modern-daylight-v2-mobile.webm',
  mobileMp4Src:
    '/videos/taiwan-sanheyuan-modern-daylight-v2-mobile.mp4',
} as const;

const PUBLISHED_HOME_INSERTION_NODE_IDS = [
  'home-attorney-root',
  'home-attorney',
] as const;

export function resolveHeritageInterludeInsertionNodeId(
  isHomePage: boolean,
  nodeIds: readonly string[],
): string | null {
  if (!isHomePage) return null;
  return PUBLISHED_HOME_INSERTION_NODE_IDS.find((nodeId) => nodeIds.includes(nodeId))
    ?? null;
}

const copyByLocale = {
  ko: {
    mediaAlt: '밝은 대만 전통 산허위안과 현대식 파빌리온이 어우러진 풍경',
  },
  'zh-hant': {
    mediaAlt: '明亮的臺灣傳統三合院與當代亭閣相映成景',
  },
  en: {
    mediaAlt: 'Bright Taiwanese sanheyuan and contemporary pavilion',
  },
  ja: {
    mediaAlt: '明るい台湾の伝統的な三合院と現代的なパビリオン',
  },
} as const satisfies Record<
  SiteLocale,
  {
    mediaAlt: string;
  }
>;

export default function TaiwanHeritageInterlude({
  locale,
}: {
  locale: SiteLocale;
}) {
  const copy = copyByLocale[locale];

  return (
    <div
      className="taiwan-heritage-interlude"
      data-home-heritage-interlude="true"
    >
      <DecorativeAutoplayVideo
        {...TAIWAN_HERITAGE_INTERLUDE_MEDIA}
        alt={copy.mediaAlt}
        className="taiwan-heritage-interlude__media"
        imageClassName="taiwan-heritage-interlude__poster"
        videoClassName="taiwan-heritage-interlude__video"
        sizes="100vw"
        priority={false}
        rootMargin="240px 0px"
        controlLabels={DECORATIVE_VIDEO_CONTROL_LABELS[locale]}
      />
    </div>
  );
}
