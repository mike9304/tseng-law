'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { DecorativeVideoControlLabels } from './decorative-video-controls';

type Props = {
  mp4Src: string; webmSrc: string; mobileMp4Src: string; mobileWebmSrc: string;
  poster: string; mobilePoster: string; mobileMediaQuery: string;
  width: number; height: number; alt: string; sizes: string;
  controlLabels: DecorativeVideoControlLabels;
};

/** User-initiated diagrams: no media source or request before explicit play. */
export default function TrafficManualVideo(props: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const inViewport = useRef(true);
  const [requested, setRequested] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const viewport = window.matchMedia(props.mobileMediaQuery);
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: {
      saveData?: boolean;
      addEventListener?: (event: 'change', fn: () => void) => void;
      removeEventListener?: (event: 'change', fn: () => void) => void;
    } }).connection;
    const reset = () => {
      video.current?.pause();
      setPlaying(false); setReady(false); setRequested(false);
    };
    const preferenceChanged = () => { if (motion.matches || connection?.saveData) reset(); };
    const visibilityChanged = () => { if (document.hidden) video.current?.pause(); };
    const observer = new IntersectionObserver(([entry]) => {
      inViewport.current = entry.isIntersecting;
      if (!entry.isIntersecting) video.current?.pause();
    }, { threshold: 0.05 });
    if (frame.current) observer.observe(frame.current);
    viewport.addEventListener('change', reset);
    motion.addEventListener('change', preferenceChanged);
    connection?.addEventListener?.('change', preferenceChanged);
    document.addEventListener('visibilitychange', visibilityChanged);
    return () => {
      observer.disconnect();
      viewport.removeEventListener('change', reset);
      motion.removeEventListener('change', preferenceChanged);
      connection?.removeEventListener?.('change', preferenceChanged);
      document.removeEventListener('visibilitychange', visibilityChanged);
    };
  }, [props.mobileMediaQuery]);

  const toggle = () => {
    if (!requested) {
      setMobile(window.matchMedia(props.mobileMediaQuery).matches);
      setReady(false); setRequested(true);
    } else if (video.current?.paused) {
      void video.current.play().catch(() => setPlaying(false));
    } else {
      video.current?.pause();
    }
  };
  const label = playing ? props.controlLabels.pause : props.controlLabels.play;
  return (
    <div ref={frame} className="decorative-autoplay-video" data-manual-video
      data-video-mounted={requested ? 'true' : 'false'} data-video-ready={ready ? 'true' : 'false'}>
      <picture>
        <source media={props.mobileMediaQuery} srcSet={props.mobilePoster} type="image/webp" />
        <Image src={props.poster} alt={props.alt} width={props.width} height={props.height}
          sizes={props.sizes} loading="lazy" className="decorative-autoplay-video__poster" />
      </picture>
      {requested ? <video ref={video} className="decorative-autoplay-video__video"
        aria-hidden="true" tabIndex={-1} muted playsInline loop autoPlay preload="none"
        onPlaying={() => {
          if (document.hidden || !inViewport.current) { video.current?.pause(); return; }
          setReady(true); setPlaying(true);
        }}
        onPause={() => setPlaying(false)}
        onError={() => { setReady(false); setPlaying(false); setRequested(false); }}>
        <source src={mobile ? props.mobileWebmSrc : props.webmSrc} type="video/webm" />
        <source src={mobile ? props.mobileMp4Src : props.mp4Src} type="video/mp4" />
      </video> : null}
      <button type="button" className="decorative-autoplay-video__control" aria-label={label} onClick={toggle}>
        <span aria-hidden="true" className="decorative-autoplay-video__control-icon">{playing ? 'Ⅱ' : '▶'}</span>
        <span>{label}</span>
      </button>
    </div>
  );
}
