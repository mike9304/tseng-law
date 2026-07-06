import type { Locale } from '@/lib/locales';

type CountdownVariant = 'card' | 'compact' | 'inline';
type BackToTopIcon = 'arrow-up' | 'chevron-up' | 'rocket';
type BackToTopPlacement = 'bottom-right' | 'bottom-left' | 'bottom-center';
type BackToTopVariant = 'circle' | 'pill' | 'square';
type ProgressVariant = 'bar' | 'ring' | 'segments';
type RatingVariant = 'stars' | 'hearts' | 'dots';

export interface InteractiveWidgetsCopy {
  countdown: {
    defaultLabel: string;
    defaultExpiredText: string;
    segments: {
      days: string;
      hours: string;
      minutes: string;
      seconds: string;
    };
    inspector: {
      targetAt: string;
      label: string;
      expiredText: string;
      style: string;
      showDays: string;
      showHours: string;
      showMinutes: string;
      showSeconds: string;
      variantOptions: Record<CountdownVariant, string>;
    };
  };
  backToTop: {
    defaultLabel: string;
    inspector: {
      label: string;
      showAfterPx: string;
      icon: string;
      placement: string;
      variant: string;
      iconOptions: Record<BackToTopIcon, string>;
      placementOptions: Record<BackToTopPlacement, string>;
      variantOptions: Record<BackToTopVariant, string>;
    };
  };
  progress: {
    defaultLabel: string;
    ariaLabel: (label: string, value: number) => string;
    inspector: {
      label: string;
      value: string;
      style: string;
      color: string;
      trackColor: string;
      showPercent: string;
      variantOptions: Record<ProgressVariant, string>;
    };
  };
  rating: {
    defaultLabel: string;
    ariaLabel: (value: number, max: number) => string;
    inspector: {
      label: string;
      value: string;
      max: string;
      style: string;
      color: string;
      showValue: string;
      variantOptions: Record<RatingVariant, string>;
    };
  };
}

export const INTERACTIVE_WIDGETS_LEGACY_DEFAULTS = {
  countdownLabel: '카운트다운',
  countdownExpiredText: '마감되었습니다',
  backToTopLabel: '맨 위로',
  progressLabel: '진행률',
  ratingLabel: '별점',
} as const;

export function localizedInteractiveWidgetText(
  value: string | undefined,
  localized: string,
  legacyDefault: string,
): string {
  const current = value ?? '';
  return current === legacyDefault ? localized : current;
}

export function getInteractiveWidgetsCopy(locale: Locale): InteractiveWidgetsCopy {
  if (locale === 'zh-hant') {
    return {
      countdown: {
        defaultLabel: '倒數計時',
        defaultExpiredText: '已截止',
        segments: {
          days: '天',
          hours: '時',
          minutes: '分',
          seconds: '秒',
        },
        inspector: {
          targetAt: '目標時間 (ISO)',
          label: '標籤',
          expiredText: '結束文字',
          style: '樣式',
          showDays: '顯示天數',
          showHours: '顯示小時',
          showMinutes: '顯示分鐘',
          showSeconds: '顯示秒數',
          variantOptions: {
            card: '卡片',
            compact: '精簡',
            inline: '行內',
          },
        },
      },
      backToTop: {
        defaultLabel: '回到頂端',
        inspector: {
          label: '標籤',
          showAfterPx: '顯示起點 (px)',
          icon: '圖示',
          placement: '位置',
          variant: '形狀',
          iconOptions: {
            'arrow-up': '向上箭頭',
            'chevron-up': '上 Chevron',
            rocket: '火箭',
          },
          placementOptions: {
            'bottom-right': '右下',
            'bottom-left': '左下',
            'bottom-center': '底部置中',
          },
          variantOptions: {
            circle: '圓形',
            pill: '膠囊',
            square: '方形',
          },
        },
      },
      progress: {
        defaultLabel: '進度',
        ariaLabel: (label, value) => `${label}：${value}%`,
        inspector: {
          label: '標籤',
          value: '數值 (0-100)',
          style: '樣式',
          color: '前景色',
          trackColor: '軌道色',
          showPercent: '顯示百分比',
          variantOptions: {
            bar: '橫條',
            ring: '圓環',
            segments: '分段',
          },
        },
      },
      rating: {
        defaultLabel: '評分',
        ariaLabel: (value, max) => `評分 ${value} / ${max}`,
        inspector: {
          label: '標籤',
          value: '數值',
          max: '最大值',
          style: '樣式',
          color: '顏色',
          showValue: '顯示數字',
          variantOptions: {
            stars: '星星',
            hearts: '愛心',
            dots: '圓點',
          },
        },
      },
    };
  }

  if (locale === 'en') {
    return {
      countdown: {
        defaultLabel: 'Countdown',
        defaultExpiredText: 'Closed',
        segments: {
          days: 'days',
          hours: 'hrs',
          minutes: 'min',
          seconds: 'sec',
        },
        inspector: {
          targetAt: 'Target time (ISO)',
          label: 'Label',
          expiredText: 'Expired text',
          style: 'Style',
          showDays: 'Show days',
          showHours: 'Show hours',
          showMinutes: 'Show minutes',
          showSeconds: 'Show seconds',
          variantOptions: {
            card: 'Card',
            compact: 'Compact',
            inline: 'Inline',
          },
        },
      },
      backToTop: {
        defaultLabel: 'Back to top',
        inspector: {
          label: 'Label',
          showAfterPx: 'Show after (px)',
          icon: 'Icon',
          placement: 'Position',
          variant: 'Shape',
          iconOptions: {
            'arrow-up': 'Arrow',
            'chevron-up': 'Chevron',
            rocket: 'Rocket',
          },
          placementOptions: {
            'bottom-right': 'Bottom right',
            'bottom-left': 'Bottom left',
            'bottom-center': 'Bottom center',
          },
          variantOptions: {
            circle: 'Circle',
            pill: 'Pill',
            square: 'Square',
          },
        },
      },
      progress: {
        defaultLabel: 'Progress',
        ariaLabel: (label, value) => `${label}: ${value}%`,
        inspector: {
          label: 'Label',
          value: 'Value (0-100)',
          style: 'Style',
          color: 'Foreground color',
          trackColor: 'Track color',
          showPercent: 'Show percent',
          variantOptions: {
            bar: 'Bar',
            ring: 'Ring',
            segments: 'Segments',
          },
        },
      },
      rating: {
        defaultLabel: 'Rating',
        ariaLabel: (value, max) => `Rating ${value} / ${max}`,
        inspector: {
          label: 'Label',
          value: 'Value',
          max: 'Max value',
          style: 'Style',
          color: 'Color',
          showValue: 'Show number',
          variantOptions: {
            stars: 'Stars',
            hearts: 'Hearts',
            dots: 'Dots',
          },
        },
      },
    };
  }

  return {
    countdown: {
      defaultLabel: INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.countdownLabel,
      defaultExpiredText: INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.countdownExpiredText,
      segments: {
        days: '일',
        hours: '시',
        minutes: '분',
        seconds: '초',
      },
      inspector: {
        targetAt: '대상 시각 (ISO)',
        label: '라벨',
        expiredText: '만료 텍스트',
        style: '스타일',
        showDays: '일 표시',
        showHours: '시간 표시',
        showMinutes: '분 표시',
        showSeconds: '초 표시',
        variantOptions: {
          card: '카드',
          compact: '컴팩트',
          inline: '인라인',
        },
      },
    },
    backToTop: {
      defaultLabel: INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.backToTopLabel,
      inspector: {
        label: '라벨',
        showAfterPx: '표시 시작 (px)',
        icon: '아이콘',
        placement: '위치',
        variant: '모양',
        iconOptions: {
          'arrow-up': '화살표',
          'chevron-up': '셰브론',
          rocket: '로켓',
        },
        placementOptions: {
          'bottom-right': '오른쪽 아래',
          'bottom-left': '왼쪽 아래',
          'bottom-center': '아래 중앙',
        },
        variantOptions: {
          circle: '원형',
          pill: '필',
          square: '사각형',
        },
      },
    },
    progress: {
      defaultLabel: INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.progressLabel,
      ariaLabel: (label, value) => `${label}: ${value}%`,
      inspector: {
        label: '라벨',
        value: '값 (0~100)',
        style: '스타일',
        color: '전경색',
        trackColor: '트랙색',
        showPercent: '퍼센트 표시',
        variantOptions: {
          bar: '바',
          ring: '링',
          segments: '세그먼트',
        },
      },
    },
    rating: {
      defaultLabel: INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.ratingLabel,
      ariaLabel: (value, max) => `별점 ${value} / ${max}`,
      inspector: {
        label: '라벨',
        value: '값',
        max: '최대값',
        style: '스타일',
        color: '색',
        showValue: '숫자 표시',
        variantOptions: {
          stars: '별',
          hearts: '하트',
          dots: '점',
        },
      },
    },
  };
}
