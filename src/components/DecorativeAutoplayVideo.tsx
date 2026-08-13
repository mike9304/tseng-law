'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { SiteLocale } from '@/lib/locales';

type DataSavingConnection = {
  saveData?: boolean;
  addEventListener?: (type: 'change', listener: () => void) => void;
  removeEventListener?: (type: 'change', listener: () => void) => void;
};

type NavigatorWithConnection = Navigator & {
  connection?: DataSavingConnection;
};

export type DecorativeAutoplayVideoProps = {
  webmSrc: string;
  mp4Src: string;
  poster: string;
  mobileWebmSrc?: string;
  mobileMp4Src?: string;
  mobilePoster?: string;
  mobileMediaQuery?: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  videoClassName?: string;
  sizes?: string;
  /**
   * Mount the video immediately after reduced-motion/save-data checks pass.
   * This is independent from `priority`, which only controls poster loading.
   */
  eagerVideoMount?: boolean;
  /**
   * For above-the-fold media, wait for a mobile poster paint before mounting
   * the video. Defaults to false so below-fold consumers keep their behavior.
   */
  deferVideoUntilPosterPaint?: boolean;
  priority?: boolean;
  width?: number;
  height?: number;
  rootMargin?: string;
  loop?: boolean;
  controlLabels: DecorativeVideoControlLabels;
};

export type DecorativeVideoControlLabels = {
  pause: string;
  play: string;
  replay: string;
};

export const DECORATIVE_VIDEO_CONTROL_LABELS = {
  ko: {
    pause: '영상 일시정지',
    play: '영상 재생',
    replay: '영상 다시 보기',
  },
  'zh-hant': {
    pause: '暫停影片',
    play: '播放影片',
    replay: '重新播放影片',
  },
  en: {
    pause: 'Pause video',
    play: 'Play video',
    replay: 'Replay video',
  },
  ja: {
    pause: '動画を一時停止',
    play: '動画を再生',
    replay: '動画をもう一度再生',
  },
} as const satisfies Record<SiteLocale, DecorativeVideoControlLabels>;

export type DecorativeVideoPlaybackState = {
  userPaused: boolean;
  ended: boolean;
};

export type DecorativeVideoControlActivation = {
  state: DecorativeVideoPlaybackState;
  restartFromBeginning: boolean;
};

export function activateDecorativeVideoControl(
  state: DecorativeVideoPlaybackState,
): DecorativeVideoControlActivation {
  if (state.ended) {
    return {
      state: { userPaused: false, ended: false },
      restartFromBeginning: true,
    };
  }

  return {
    state: { ...state, userPaused: !state.userPaused },
    restartFromBeginning: false,
  };
}

export function resolveDecorativeVideoControlLabel(
  state: DecorativeVideoPlaybackState,
  labels: DecorativeVideoControlLabels = DECORATIVE_VIDEO_CONTROL_LABELS.ko,
): string {
  if (state.ended) return labels.replay;
  return state.userPaused ? labels.play : labels.pause;
}

export function syncDecorativeVideoPlayback(
  video: Pick<HTMLVideoElement, 'pause' | 'play'>,
  {
    inViewport,
    userPaused,
    ended,
  }: DecorativeVideoPlaybackState & { inViewport: boolean },
): void {
  if (!inViewport || userPaused || ended) {
    video.pause();
    return;
  }

  void video.play().catch(() => {
    // The poster remains visible until a later successful canplay/play cycle.
  });
}

export function runDecorativeVideoControlActivation(
  video: Pick<HTMLVideoElement, 'currentTime' | 'pause' | 'play'>,
  state: DecorativeVideoPlaybackState,
  inViewport: boolean,
): DecorativeVideoPlaybackState {
  const activation = activateDecorativeVideoControl(state);
  if (activation.restartFromBeginning) {
    video.currentTime = 0;
  }
  syncDecorativeVideoPlayback(video, {
    inViewport,
    ...activation.state,
  });
  return activation.state;
}

export function shouldEnableDecorativeVideo(
  reducedMotion: boolean,
  saveData: boolean | undefined,
) {
  return !reducedMotion && saveData !== true;
}

export function shouldMountDecorativeVideo({
  enabled,
  eagerVideoMount,
  idleReady,
  nearViewport,
  inViewport,
  waitForPosterPaint = false,
}: {
  enabled: boolean;
  eagerVideoMount: boolean;
  idleReady: boolean;
  nearViewport: boolean;
  inViewport: boolean;
  waitForPosterPaint?: boolean;
}): boolean {
  return (
    enabled
    && !waitForPosterPaint
    && (
      eagerVideoMount
      || (nearViewport && (idleReady || inViewport))
    )
  );
}

export function shouldWaitForDecorativeVideoPosterPaint({
  deferVideoUntilPosterPaint,
  mobileViewport,
  posterPainted,
  pageLoadPainted = true,
}: {
  deferVideoUntilPosterPaint: boolean;
  mobileViewport: boolean;
  posterPainted: boolean;
  pageLoadPainted?: boolean;
}): boolean {
  return (
    deferVideoUntilPosterPaint
    && mobileViewport
    && (!posterPainted || !pageLoadPainted)
  );
}

function joinClassNames(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function DecorativeAutoplayVideo({
  webmSrc,
  mp4Src,
  poster,
  mobileWebmSrc,
  mobileMp4Src,
  mobilePoster,
  mobileMediaQuery = '(max-width: 640px)',
  alt = '',
  className,
  imageClassName,
  videoClassName,
  sizes = '100vw',
  eagerVideoMount = false,
  deferVideoUntilPosterPaint = false,
  priority = false,
  width,
  height,
  rootMargin = '320px 0px',
  loop = true,
  controlLabels = DECORATIVE_VIDEO_CONTROL_LABELS.ko,
}: DecorativeAutoplayVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [mobileViewport, setMobileViewport] = useState(false);
  const [posterPainted, setPosterPainted] = useState(
    !deferVideoUntilPosterPaint,
  );
  const [pageLoadPainted, setPageLoadPainted] = useState(
    !deferVideoUntilPosterPaint,
  );
  const [idleReady, setIdleReady] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);
  const [inViewport, setInViewport] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [playbackState, setPlaybackState] =
    useState<DecorativeVideoPlaybackState>({
      userPaused: false,
      ended: false,
    });

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as NavigatorWithConnection).connection;
    const updatePreference = () => {
      setEnabled(
        shouldEnableDecorativeVideo(
          motionQuery.matches,
          connection?.saveData,
        ),
      );
    };

    updatePreference();
    motionQuery.addEventListener('change', updatePreference);
    connection?.addEventListener?.('change', updatePreference);

    return () => {
      motionQuery.removeEventListener('change', updatePreference);
      connection?.removeEventListener?.('change', updatePreference);
    };
  }, []);

  useEffect(() => {
    if (!deferVideoUntilPosterPaint) {
      setMobileViewport(false);
      setPosterPainted(true);
      setPageLoadPainted(true);
      return;
    }

    const mobileQuery = window.matchMedia(mobileMediaQuery);
    const updateMobileViewport = () => {
      setMobileViewport(mobileQuery.matches);
    };

    updateMobileViewport();
    mobileQuery.addEventListener('change', updateMobileViewport);
    return () => mobileQuery.removeEventListener('change', updateMobileViewport);
  }, [deferVideoUntilPosterPaint, mobileMediaQuery]);

  useEffect(() => {
    if (!deferVideoUntilPosterPaint) return;

    let secondFrame = 0;
    const markAfterPageLoadPaint = () => {
      const firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          setPageLoadPainted(true);
        });
      });
      return () => window.cancelAnimationFrame(firstFrame);
    };

    let cancelFirstFrame = () => {};
    if (document.readyState === 'complete') {
      cancelFirstFrame = markAfterPageLoadPaint();
    } else {
      const handleLoad = () => {
        cancelFirstFrame = markAfterPageLoadPaint();
      };
      window.addEventListener('load', handleLoad, { once: true });
      return () => {
        window.removeEventListener('load', handleLoad);
        cancelFirstFrame();
        if (secondFrame) window.cancelAnimationFrame(secondFrame);
      };
    }

    return () => {
      cancelFirstFrame();
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [deferVideoUntilPosterPaint]);

  const waitForPosterPaint = shouldWaitForDecorativeVideoPosterPaint({
    deferVideoUntilPosterPaint,
    mobileViewport,
    posterPainted,
    pageLoadPainted,
  });

  useEffect(() => {
    if (!waitForPosterPaint || !posterRef.current?.complete) return;

    const firstFrame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setPosterPainted(true));
    });
    return () => window.cancelAnimationFrame(firstFrame);
  }, [waitForPosterPaint]);

  useEffect(() => {
    if (!enabled || eagerVideoMount) {
      setIdleReady(false);
      return;
    }

    if (typeof window.requestIdleCallback === 'function') {
      const idleId = window.requestIdleCallback(
        () => setIdleReady(true),
        { timeout: 1200 },
      );
      return () => window.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(() => setIdleReady(true), 1200);
    return () => window.clearTimeout(timeoutId);
  }, [eagerVideoMount, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    if (typeof IntersectionObserver === 'undefined') {
      setNearViewport(true);
      setInViewport(true);
      return;
    }

    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setNearViewport(true);
        nearObserver.disconnect();
      },
      { rootMargin },
    );
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => setInViewport(Boolean(entry?.isIntersecting)),
      { threshold: 0 },
    );

    nearObserver.observe(container);
    visibilityObserver.observe(container);

    return () => {
      nearObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [enabled, rootMargin]);

  const shouldMountVideo = shouldMountDecorativeVideo({
    enabled,
    eagerVideoMount,
    idleReady,
    nearViewport,
    inViewport,
    waitForPosterPaint,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!shouldMountVideo || !video) return;

    syncDecorativeVideoPlayback(video, {
      inViewport,
      ...playbackState,
    });
  }, [inViewport, playbackState, shouldMountVideo]);

  const imageSizing =
    typeof width === 'number' && typeof height === 'number'
      ? { width, height }
      : { fill: true as const };
  const isVideoReady = shouldMountVideo && videoReady;
  const controlLabel = resolveDecorativeVideoControlLabel(
    playbackState,
    controlLabels,
  );

  const handleControlClick = () => {
    const video = videoRef.current;
    if (!video) return;

    setPlaybackState(
      runDecorativeVideoControlActivation(video, playbackState, inViewport),
    );
  };

  return (
    <div
      ref={containerRef}
      className={joinClassNames('decorative-autoplay-video', className)}
      data-video-mounted={shouldMountVideo ? 'true' : 'false'}
      data-video-ready={isVideoReady ? 'true' : 'false'}
    >
      <picture>
        {mobilePoster ? (
          <source
            media={mobileMediaQuery}
            srcSet={mobilePoster}
            type="image/webp"
          />
        ) : null}
        <Image
          ref={posterRef}
          {...imageSizing}
          src={poster}
          alt={alt}
          sizes={sizes}
          // Next/Image's priority preload cannot carry the responsive
          // <picture> source media condition, so it would request the desktop
          // fallback even when mobilePoster is selected. Keep the opening
          // poster eager/high-priority without emitting that unconditional
          // preload.
          priority={false}
          fetchPriority={priority ? 'high' : undefined}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => {
            if (!deferVideoUntilPosterPaint) return;
            window.requestAnimationFrame(() => {
              window.requestAnimationFrame(() => setPosterPainted(true));
            });
          }}
          className={joinClassNames(
            'decorative-autoplay-video__poster',
            imageClassName,
          )}
        />
      </picture>
      {shouldMountVideo ? (
        <video
          ref={videoRef}
          className={joinClassNames(
            'decorative-autoplay-video__video',
            videoClassName,
          )}
          aria-hidden="true"
          muted
          autoPlay
          loop={loop}
          playsInline
          controls={false}
          tabIndex={-1}
          preload="metadata"
          onCanPlay={() => {
            setVideoReady(true);
            if (!inViewport) {
              videoRef.current?.pause();
            }
          }}
          onEnded={() => {
            if (!loop) {
              setPlaybackState({ userPaused: false, ended: true });
            }
          }}
          onError={() => setVideoReady(false)}
        >
          {mobileMp4Src ? (
            <source
              media={mobileMediaQuery}
              src={mobileMp4Src}
              type="video/mp4"
            />
          ) : null}
          {mobileWebmSrc ? (
            <source
              media={mobileMediaQuery}
              src={mobileWebmSrc}
              type="video/webm"
            />
          ) : null}
          <source src={mp4Src} type="video/mp4" />
          <source src={webmSrc} type="video/webm" />
        </video>
      ) : null}
      {isVideoReady ? (
        <button
          type="button"
          className="decorative-autoplay-video__control"
          aria-label={controlLabel}
          onClick={handleControlClick}
        >
          <span aria-hidden="true" className="decorative-autoplay-video__control-icon">
            {playbackState.ended ? '↻' : playbackState.userPaused ? '▶' : 'Ⅱ'}
          </span>
          <span>{controlLabel}</span>
        </button>
      ) : null}
    </div>
  );
}

export default DecorativeAutoplayVideo;
