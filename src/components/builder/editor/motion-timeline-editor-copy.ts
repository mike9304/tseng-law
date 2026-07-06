import type { Locale } from '@/lib/locales';

export type MotionTimelineEditorCopy = {
  scrollBoundLabel: string;
  durationLabel: string;
  millisecondsLabel: string;
  removeTimelineLabel: string;
  trackAddTitle: string;
  emptyTrackLabel: string;
  markerTitle: (index: number, offset: string) => string;
  markerAriaLabel: (index: number) => string;
  transformPlaceholder: string;
  offsetAriaLabel: (index: number) => string;
  transformAriaLabel: (index: number) => string;
  opacityAriaLabel: (index: number) => string;
  easingAriaLabel: (index: number) => string;
  removeKeyframeAriaLabel: (index: number) => string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', MotionTimelineEditorCopy> = {
  ko: {
    scrollBoundLabel: '스크롤 연동',
    durationLabel: '재생 시간',
    millisecondsLabel: 'ms',
    removeTimelineLabel: '타임라인 제거',
    trackAddTitle: '클릭해서 키프레임 추가',
    emptyTrackLabel: '트랙을 클릭해 키프레임 추가',
    markerTitle: (index, offset) => `#${index} · 오프셋 ${offset}`,
    markerAriaLabel: (index) => `키프레임 ${index} 위치`,
    transformPlaceholder: 'transform 예: translateY(-20px) scale(1.05)',
    offsetAriaLabel: (index) => `키프레임 ${index} 오프셋`,
    transformAriaLabel: (index) => `키프레임 ${index} transform`,
    opacityAriaLabel: (index) => `키프레임 ${index} 투명도`,
    easingAriaLabel: (index) => `키프레임 ${index} 이징`,
    removeKeyframeAriaLabel: (index) => `키프레임 ${index} 제거`,
  },
  'zh-hant': {
    scrollBoundLabel: '連動捲動',
    durationLabel: '播放時間',
    millisecondsLabel: 'ms',
    removeTimelineLabel: '移除時間軸',
    trackAddTitle: '點擊以新增關鍵影格',
    emptyTrackLabel: '點擊軌道以新增關鍵影格',
    markerTitle: (index, offset) => `#${index} · 位移 ${offset}`,
    markerAriaLabel: (index) => `關鍵影格 ${index} 位置`,
    transformPlaceholder: 'transform 範例：translateY(-20px) scale(1.05)',
    offsetAriaLabel: (index) => `關鍵影格 ${index} 位移`,
    transformAriaLabel: (index) => `關鍵影格 ${index} transform`,
    opacityAriaLabel: (index) => `關鍵影格 ${index} 不透明度`,
    easingAriaLabel: (index) => `關鍵影格 ${index} 緩動`,
    removeKeyframeAriaLabel: (index) => `移除關鍵影格 ${index}`,
  },
  en: {
    scrollBoundLabel: 'Scroll-bound',
    durationLabel: 'Duration',
    millisecondsLabel: 'ms',
    removeTimelineLabel: 'Remove timeline',
    trackAddTitle: 'Click to add a keyframe',
    emptyTrackLabel: 'Click the track to add a keyframe',
    markerTitle: (index, offset) => `#${index} · offset ${offset}`,
    markerAriaLabel: (index) => `Keyframe ${index} position`,
    transformPlaceholder: 'transform e.g. translateY(-20px) scale(1.05)',
    offsetAriaLabel: (index) => `Offset keyframe ${index}`,
    transformAriaLabel: (index) => `Transform keyframe ${index}`,
    opacityAriaLabel: (index) => `Opacity keyframe ${index}`,
    easingAriaLabel: (index) => `Easing keyframe ${index}`,
    removeKeyframeAriaLabel: (index) => `Remove keyframe ${index}`,
  },
};

export function getMotionTimelineEditorCopy(locale: Locale): MotionTimelineEditorCopy {
  return COPY[locale] ?? COPY.en;
}
