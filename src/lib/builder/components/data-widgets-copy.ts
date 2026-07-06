import type {
  BuilderBarChartCanvasNode,
  BuilderCounterCanvasNode,
  BuilderLineChartCanvasNode,
  BuilderPieChartCanvasNode,
} from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';

type ChartPoint = BuilderBarChartCanvasNode['content']['points'][number];
type LinePoint = BuilderLineChartCanvasNode['content']['points'][number];
type PieSlice = BuilderPieChartCanvasNode['content']['slices'][number];

export interface DataWidgetsCopy {
  chart: {
    barAria: string;
    lineAria: string;
    pieAria: string;
    empty: string;
    defaults: {
      barTitle: string;
      barPoints: ChartPoint[];
      lineTitle: string;
      linePoints: LinePoint[];
      pieTitle: string;
      pieSlices: PieSlice[];
    };
    inspector: {
      title: string;
      points: string;
      slices: string;
      color: string;
      showValueLabels: string;
      smoothCurve: string;
      showPoints: string;
      showLegend: string;
      donut: string;
    };
  };
  counter: {
    defaultTitle: string;
    defaultSuffix: string;
    inspector: {
      title: string;
      target: string;
      prefixSuffix: string;
      prefixPlaceholder: string;
      suffixPlaceholder: string;
      decimals: string;
      animationMs: string;
    };
  };
}

export const DATA_WIDGETS_LEGACY_DEFAULTS = {
  barTitle: '월별 자문 건수',
  barPoints: [
    { label: 'Jan', value: 32 },
    { label: 'Feb', value: 28 },
    { label: 'Mar', value: 40 },
    { label: 'Apr', value: 35 },
    { label: 'May', value: 46 },
    { label: 'Jun', value: 52 },
  ],
  lineTitle: '연간 자문 추세',
  linePoints: [
    { label: '2021', value: 120 },
    { label: '2022', value: 154 },
    { label: '2023', value: 168 },
    { label: '2024', value: 195 },
    { label: '2025', value: 230 },
  ],
  pieTitle: '분야별 자문',
  pieSlices: [
    { label: '기업', value: 38 },
    { label: '이민', value: 24 },
    { label: '소송', value: 18 },
    { label: '가사', value: 12 },
    { label: '기타', value: 8 },
  ],
  counterTitle: '누적 자문',
  counterSuffix: '+ 건',
} as const satisfies {
  barTitle: string;
  barPoints: readonly ChartPoint[];
  lineTitle: string;
  linePoints: readonly LinePoint[];
  pieTitle: string;
  pieSlices: readonly PieSlice[];
  counterTitle: BuilderCounterCanvasNode['content']['title'];
  counterSuffix: BuilderCounterCanvasNode['content']['suffix'];
};

function clonePoints<T extends { label: string; value: number }>(points: readonly T[]): T[] {
  return points.map((point) => ({ ...point }));
}

function samePoints(left: readonly { label: string; value: number }[], right: readonly { label: string; value: number }[]): boolean {
  return left.length === right.length
    && left.every((point, index) => point.label === right[index]?.label && point.value === right[index]?.value);
}

function sameSlices(left: readonly PieSlice[], right: readonly PieSlice[]): boolean {
  return left.length === right.length
    && left.every((slice, index) => (
      slice.label === right[index]?.label
      && slice.value === right[index]?.value
      && (slice.color ?? '') === (right[index]?.color ?? '')
    ));
}

export function localizedDataWidgetText(
  value: string | undefined,
  localized: string,
  legacyDefault: string,
): string {
  const current = value ?? '';
  return current === legacyDefault ? localized : current;
}

export function localizedDataWidgetPoints<T extends { label: string; value: number }>(
  points: T[],
  localized: T[],
  legacyDefault: readonly T[],
): T[] {
  return samePoints(points, legacyDefault) ? localized : points;
}

export function localizedDataWidgetSlices(
  slices: PieSlice[],
  localized: PieSlice[],
): PieSlice[] {
  return sameSlices(slices, DATA_WIDGETS_LEGACY_DEFAULTS.pieSlices) ? localized : slices;
}

const dataWidgetsCopy: Record<Locale, DataWidgetsCopy> = {
  ko: {
    chart: {
      barAria: '막대 차트',
      lineAria: '선 차트',
      pieAria: '원형 차트',
      empty: '데이터 없음',
      defaults: {
        barTitle: DATA_WIDGETS_LEGACY_DEFAULTS.barTitle,
        barPoints: clonePoints(DATA_WIDGETS_LEGACY_DEFAULTS.barPoints),
        lineTitle: DATA_WIDGETS_LEGACY_DEFAULTS.lineTitle,
        linePoints: clonePoints(DATA_WIDGETS_LEGACY_DEFAULTS.linePoints),
        pieTitle: DATA_WIDGETS_LEGACY_DEFAULTS.pieTitle,
        pieSlices: clonePoints(DATA_WIDGETS_LEGACY_DEFAULTS.pieSlices),
      },
      inspector: {
        title: '제목',
        points: '데이터 (label | value)',
        slices: '슬라이스 (label | value | color)',
        color: '색상',
        showValueLabels: '값 라벨 표시',
        smoothCurve: '부드러운 곡선',
        showPoints: '포인트 표시',
        showLegend: '범례 표시',
        donut: '도넛 모양',
      },
    },
    counter: {
      defaultTitle: DATA_WIDGETS_LEGACY_DEFAULTS.counterTitle,
      defaultSuffix: DATA_WIDGETS_LEGACY_DEFAULTS.counterSuffix,
      inspector: {
        title: '제목',
        target: '목표값',
        prefixSuffix: '접두/접미',
        prefixPlaceholder: '접두',
        suffixPlaceholder: '접미',
        decimals: '소수점 자릿수',
        animationMs: '애니메이션 (ms)',
      },
    },
  },
  'zh-hant': {
    chart: {
      barAria: '長條圖',
      lineAria: '折線圖',
      pieAria: '圓餅圖',
      empty: '沒有資料',
      defaults: {
        barTitle: '每月諮詢件數',
        barPoints: [
          { label: '1月', value: 32 },
          { label: '2月', value: 28 },
          { label: '3月', value: 40 },
          { label: '4月', value: 35 },
          { label: '5月', value: 46 },
          { label: '6月', value: 52 },
        ],
        lineTitle: '年度諮詢趨勢',
        linePoints: clonePoints(DATA_WIDGETS_LEGACY_DEFAULTS.linePoints),
        pieTitle: '各領域諮詢',
        pieSlices: [
          { label: '企業', value: 38 },
          { label: '移民', value: 24 },
          { label: '訴訟', value: 18 },
          { label: '家事', value: 12 },
          { label: '其他', value: 8 },
        ],
      },
      inspector: {
        title: '標題',
        points: '資料（label | value）',
        slices: '切片（label | value | color）',
        color: '顏色',
        showValueLabels: '顯示數值標籤',
        smoothCurve: '平滑曲線',
        showPoints: '顯示節點',
        showLegend: '顯示圖例',
        donut: '甜甜圈樣式',
      },
    },
    counter: {
      defaultTitle: '累積諮詢',
      defaultSuffix: '+ 件',
      inspector: {
        title: '標題',
        target: '目標值',
        prefixSuffix: '前綴 / 後綴',
        prefixPlaceholder: '前綴',
        suffixPlaceholder: '後綴',
        decimals: '小數位數',
        animationMs: '動畫 (ms)',
      },
    },
  },
  en: {
    chart: {
      barAria: 'Bar chart',
      lineAria: 'Line chart',
      pieAria: 'Pie chart',
      empty: 'No data',
      defaults: {
        barTitle: 'Monthly advisory matters',
        barPoints: clonePoints(DATA_WIDGETS_LEGACY_DEFAULTS.barPoints),
        lineTitle: 'Annual advisory trend',
        linePoints: clonePoints(DATA_WIDGETS_LEGACY_DEFAULTS.linePoints),
        pieTitle: 'Advisory by practice area',
        pieSlices: [
          { label: 'Corporate', value: 38 },
          { label: 'Immigration', value: 24 },
          { label: 'Litigation', value: 18 },
          { label: 'Family', value: 12 },
          { label: 'Other', value: 8 },
        ],
      },
      inspector: {
        title: 'Title',
        points: 'Data (label | value)',
        slices: 'Slices (label | value | color)',
        color: 'Color',
        showValueLabels: 'Show value labels',
        smoothCurve: 'Smooth curve',
        showPoints: 'Show points',
        showLegend: 'Show legend',
        donut: 'Donut shape',
      },
    },
    counter: {
      defaultTitle: 'Total consultations',
      defaultSuffix: '+ matters',
      inspector: {
        title: 'Title',
        target: 'Target value',
        prefixSuffix: 'Prefix/suffix',
        prefixPlaceholder: 'prefix',
        suffixPlaceholder: 'suffix',
        decimals: 'Decimal places',
        animationMs: 'Animation (ms)',
      },
    },
  },
};

export function getDataWidgetsCopy(locale: Locale): DataWidgetsCopy {
  return dataWidgetsCopy[locale] ?? dataWidgetsCopy.en;
}
