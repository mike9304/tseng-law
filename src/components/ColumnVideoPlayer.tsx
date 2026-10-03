'use client';

import { useEffect, useRef, useState, type VideoHTMLAttributes } from 'react';
import type { ColumnVideoChapter } from '@/data/column-generated-videos';
import { autoplayColumnVideoWhenVisible } from './column-video-autoplay';
import styles from './ColumnGeneratedVideo.module.css';

type Props = VideoHTMLAttributes<HTMLVideoElement> & { startWhenVisible: boolean; chapters?: ColumnVideoChapter[] };

export default function ColumnVideoPlayer({ startWhenVisible, chapters, ...props }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [chapterIndex, setChapterIndex] = useState(0);
  useEffect(() => {
    if (!startWhenVisible || !ref.current) return;
    return autoplayColumnVideoWhenVisible(ref.current);
  }, [startWhenVisible, props.src]);

  const updateChapter = (time: number) => {
    if (chapters?.length) setChapterIndex(Math.max(0, chapters.findLastIndex(chapter => chapter.start <= time)));
  };
  const chapter = chapters?.[chapterIndex];
  return <>
    <video {...props} ref={ref}
      onTimeUpdate={event => { updateChapter(event.currentTarget.currentTime); props.onTimeUpdate?.(event); }}
      onSeeked={event => { updateChapter(event.currentTarget.currentTime); props.onSeeked?.(event); }}
      onLoadedMetadata={event => { updateChapter(event.currentTarget.currentTime); props.onLoadedMetadata?.(event); }}
    />
    {chapter ? <div className={styles.chapter} data-column-video-chapter={chapterIndex + 1}>
      <span className={styles.chapterHeading}>{String(chapterIndex + 1).padStart(2, '0')} / {chapters?.length} · {chapter.title}</span>
      <span>{chapter.text}</span>
    </div> : null}
  </>;
}
