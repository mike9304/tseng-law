'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { DecorativeVideoControlLabels } from './decorative-video-controls';

type Props = {
  mp4Src: string; webmSrc: string; mobileMp4Src: string; mobileWebmSrc: string;
  poster: string; mobilePoster: string; mobileMediaQuery: string;
  width: number; height: number; alt: string; posterAlt?: string; sizes: string;
  controlLabels: DecorativeVideoControlLabels;
  playbackTools?: boolean;
  describedBy?: string;
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
  const [looping, setLooping] = useState(false);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);

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
      setPlaying(false); setReady(false); setRequested(false); setTime(0);
    };
    const preferenceChanged = () => { if (motion.matches || connection?.saveData) reset(); };
    const visibilityChanged = () => { if (document.hidden) video.current?.pause(); };
    const stages = frame.current?.closest('figure')?.querySelector('details');
    const stagesChanged = () => { if (stages?.open) video.current?.pause(); };
    stages?.addEventListener('toggle', stagesChanged);
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
      stages?.removeEventListener('toggle', stagesChanged);
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
  const restart = () => {
    if (!requested) { toggle(); return; }
    if (video.current) { video.current.currentTime = 0; void video.current.play().catch(() => setPlaying(false)); }
  };
  return (
    <div ref={frame} className="decorative-autoplay-video" data-manual-video
      data-video-mounted={requested ? 'true' : 'false'} data-video-ready={ready ? 'true' : 'false'}>
      <picture>
        <source media={props.mobileMediaQuery} srcSet={props.mobilePoster} />
        <Image src={props.poster} alt={props.posterAlt ?? props.alt} width={props.width} height={props.height}
          sizes={props.sizes} loading="lazy" className="decorative-autoplay-video__poster" />
      </picture>
      {requested ? <video ref={video} className="decorative-autoplay-video__video"
        aria-label={props.alt} aria-describedby={props.describedBy} tabIndex={-1} muted playsInline loop={props.playbackTools ? looping : true} autoPlay preload="none"
        onLoadedMetadata={() => setDuration(video.current?.duration ?? 0)}
        onTimeUpdate={() => setTime(video.current?.currentTime ?? 0)}
        onEnded={() => setPlaying(false)}
        onPlaying={() => {
          if (document.hidden || !inViewport.current) { video.current?.pause(); return; }
          setReady(true); setPlaying(true);
        }}
        onPause={() => setPlaying(false)}
        onError={event => {
          // React also delivers <source> errors here. Let the browser try the
          // next source before returning to the poster; unmounting on a WebM
          // failure would cancel an otherwise playable MP4 fallback.
          if (event.target !== event.currentTarget && event.target !== event.currentTarget.lastElementChild) return;
          setReady(false); setPlaying(false); setRequested(false);
        }}>
        <source src={mobile ? props.mobileWebmSrc : props.webmSrc} type="video/webm" />
        <source src={mobile ? props.mobileMp4Src : props.mp4Src} type="video/mp4" />
      </video> : null}
      <div className={props.playbackTools ? 'traffic-manual-tools' : undefined}>
      <button type="button" className="decorative-autoplay-video__control" aria-label={label} onClick={toggle}>
        <span aria-hidden="true" className="decorative-autoplay-video__control-icon">{playing ? 'Ⅱ' : '▶'}</span>
        <span>{label}</span>
      </button>
      {props.playbackTools ? <>
        <button type="button" onClick={restart}>從頭播放</button>
        <label><input type="checkbox" checked={looping} onChange={event => setLooping(event.target.checked)} /> 重複播放</label>
        <label className="traffic-manual-tools__seek">影片時間
          <input type="range" aria-label="影片時間" min={0} max={duration || 1} step={0.1} value={time} disabled={!requested || !duration}
            onChange={event => { const next=Number(event.target.value); if(video.current) video.current.currentTime=next; setTime(next); }} />
          <output>{Math.floor(time)} / {Math.round(duration)} 秒</output>
        </label>
      </> : null}
      </div>
    </div>
  );
}
