export type ColumnVideoSource = 'column' | 'issue';

export type ColumnGeneratedVideoAsset = {
  id: string;
  src: string;
  poster: string;
  width: number;
  height: number;
  title: string;
  description: string;
  disclosure: string;
};

/** Only reviewed article/language pairs belong here. Never infer coverage from a shared slug. */
const REVIEWED_COLUMN_VIDEOS: Readonly<Record<string, ColumnGeneratedVideoAsset>> = {
  'column/ko/taiwan-traffic-accident-procedure': {
    id: 'rear-end-simulation-v2-ko',
    src: '/videos/columns/rear-end-simulation-v2-ko.mp4',
    poster: '/images/column-videos/rear-end-simulation-v2-ko.jpg',
    width: 1280,
    height: 720,
    title: '멈춰 있는 앞차에 뒤차가 닿는 장면',
    description: '남색 승용차가 왼쪽에서 다가와 정차한 흰색 승용차의 뒷범퍼에 접촉하고 멈춥니다. 소리가 없는 7초 영상입니다.',
    disclosure: 'AI로 만든 가상 장면이며 실제 사고 기록이 아닙니다. 도로·속도·거리·접촉 시점은 설명을 위한 설정으로, 특정 사건의 과실을 판단하는 자료로 쓸 수 없습니다.',
  },
};

export function getColumnGeneratedVideo(
  locale: string,
  slug: string,
  source: ColumnVideoSource = 'column',
): ColumnGeneratedVideoAsset | null {
  return REVIEWED_COLUMN_VIDEOS[`${source}/${locale}/${slug}`] ?? null;
}
