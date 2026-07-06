import type {
  AnimationEasing,
  ClickAnimationPreset,
  EntrancePreset,
  ExitPreset,
  HoverAnimationPreset,
  LoopPreset,
  ScrollEffect,
} from '@/lib/builder/animations/presets';
import type { Locale } from '@/lib/locales';

export type AnimationPresetLabels = {
  entrance: Record<EntrancePreset, string>;
  exit: Record<ExitPreset, string>;
  loop: Record<LoopPreset, string>;
  scroll: Record<ScrollEffect, string>;
  hover: Record<HoverAnimationPreset, string>;
  click: Record<ClickAnimationPreset, string>;
  easing: Record<AnimationEasing, string>;
};

export type AnimationsTabCopy = {
  sections: {
    entrance: string;
    exit: string;
    loop: string;
    scroll: string;
    hover: string;
    click: string;
    motionTimeline: string;
    lottie: string;
  };
  previewButtonLabel: string;
  presetLabel: string;
  effectLabel: string;
  durationLabel: string;
  delayLabel: string;
  triggerOnceLabel: string;
  intensityLabel: string;
  transitionLabel: string;
  easingLabel: string;
  customEasingLabel: string;
  customEasingOptionLabel: string;
  resetButtonLabel: string;
  aria: {
    entrancePreset: string;
    exitPreset: string;
    loopPreset: string;
    scrollEffect: string;
    hoverPreset: string;
    clickPreset: string;
  };
  hints: {
    exit: string;
    loop: string;
    scroll: string;
    hover: string;
    click: string;
    motionTimeline: string;
  };
  lottie: {
    introBeforeWidget: string;
    widgetName: string;
    introAfterWidget: string;
    supportedHosts: string;
    exampleLabel: string;
    exampleUrl: string;
    iframeSandboxLabel: string;
    iframeSandboxValue: string;
  };
  labels: AnimationPresetLabels;
};

const KO_LABELS: AnimationPresetLabels = {
  entrance: {
    none: '없음',
    'fade-in': '페이드 인',
    'slide-up': '위로 슬라이드',
    'slide-down': '아래로 슬라이드',
    'slide-left': '왼쪽으로 슬라이드',
    'slide-right': '오른쪽으로 슬라이드',
    'zoom-in': '확대 등장',
    'zoom-out': '축소 등장',
    'expand-in': '확장 등장',
    'expand-from-left': '왼쪽에서 확장',
    'expand-from-right': '오른쪽에서 확장',
    'bounce-in': '바운스 등장',
    'flip-x': 'X축 플립',
    'flip-y': 'Y축 플립',
    'reveal-left': '왼쪽에서 드러내기',
    'reveal-right': '오른쪽에서 드러내기',
    'spin-in': '회전 등장',
    'float-up': '떠오르기',
  },
  exit: {
    none: '없음',
    'fade-out': '페이드 아웃',
    'slide-up': '위로 슬라이드',
    'slide-down': '아래로 슬라이드',
    'slide-left': '왼쪽으로 슬라이드',
    'slide-right': '오른쪽으로 슬라이드',
    'zoom-out': '축소 퇴장',
    collapse: '접히며 퇴장',
  },
  loop: {
    none: '없음',
    pulse: '펄스',
    float: '플로트',
    bounce: '바운스',
    sway: '스웨이',
    wiggle: '위글',
    breath: '브레스',
  },
  scroll: {
    none: '없음',
    'parallax-y': 'Y축 패럴랙스',
    'background-parallax': '배경 패럴랙스',
    'fade-on-scroll': '스크롤 페이드',
    'scale-on-scroll': '스크롤 스케일',
    'rotate-on-scroll': '스크롤 회전',
    pin: '고정',
    'scrub-translate': '스크럽 이동',
    'scrub-opacity': '스크럽 투명도',
    'scrub-rotate': '스크럽 회전',
  },
  hover: {
    none: '없음',
    lift: '들어 올리기',
    pulse: '펄스',
    glow: '글로우',
    'rotate-3d': '3D 회전',
    tint: '틴트',
    fade: '페이드',
  },
  click: {
    none: '없음',
    pulse: '펄스',
    bounce: '바운스',
    shake: '흔들기',
    flash: '플래시',
  },
  easing: {
    ease: '기본 이즈',
    'ease-in': '느린 시작',
    'ease-out': '느린 끝',
    'ease-in-out': '느린 시작/끝',
    linear: '선형',
    elastic: '탄성',
  },
};

const ZH_HANT_LABELS: AnimationPresetLabels = {
  entrance: {
    none: '無',
    'fade-in': '淡入',
    'slide-up': '向上滑入',
    'slide-down': '向下滑入',
    'slide-left': '向左滑入',
    'slide-right': '向右滑入',
    'zoom-in': '放大進場',
    'zoom-out': '縮小進場',
    'expand-in': '展開進場',
    'expand-from-left': '由左展開',
    'expand-from-right': '由右展開',
    'bounce-in': '彈跳進場',
    'flip-x': 'X 軸翻轉',
    'flip-y': 'Y 軸翻轉',
    'reveal-left': '由左揭示',
    'reveal-right': '由右揭示',
    'spin-in': '旋轉進場',
    'float-up': '向上浮現',
  },
  exit: {
    none: '無',
    'fade-out': '淡出',
    'slide-up': '向上滑出',
    'slide-down': '向下滑出',
    'slide-left': '向左滑出',
    'slide-right': '向右滑出',
    'zoom-out': '縮小離場',
    collapse: '收合離場',
  },
  loop: {
    none: '無',
    pulse: '脈衝',
    float: '漂浮',
    bounce: '彈跳',
    sway: '擺動',
    wiggle: '晃動',
    breath: '呼吸',
  },
  scroll: {
    none: '無',
    'parallax-y': 'Y 軸視差',
    'background-parallax': '背景視差',
    'fade-on-scroll': '捲動淡化',
    'scale-on-scroll': '捲動縮放',
    'rotate-on-scroll': '捲動旋轉',
    pin: '釘選',
    'scrub-translate': '捲動位移',
    'scrub-opacity': '捲動不透明度',
    'scrub-rotate': '捲動旋轉同步',
  },
  hover: {
    none: '無',
    lift: '抬升',
    pulse: '脈衝',
    glow: '光暈',
    'rotate-3d': '3D 旋轉',
    tint: '色調',
    fade: '淡化',
  },
  click: {
    none: '無',
    pulse: '脈衝',
    bounce: '彈跳',
    shake: '震動',
    flash: '閃爍',
  },
  easing: {
    ease: '預設緩動',
    'ease-in': '慢速開始',
    'ease-out': '慢速結束',
    'ease-in-out': '慢速開始與結束',
    linear: '線性',
    elastic: '彈性',
  },
};

const EN_LABELS: AnimationPresetLabels = {
  entrance: {
    none: 'None',
    'fade-in': 'Fade in',
    'slide-up': 'Slide up',
    'slide-down': 'Slide down',
    'slide-left': 'Slide left',
    'slide-right': 'Slide right',
    'zoom-in': 'Zoom in',
    'zoom-out': 'Zoom out',
    'expand-in': 'Expand in',
    'expand-from-left': 'Expand from left',
    'expand-from-right': 'Expand from right',
    'bounce-in': 'Bounce in',
    'flip-x': 'Flip X',
    'flip-y': 'Flip Y',
    'reveal-left': 'Reveal left',
    'reveal-right': 'Reveal right',
    'spin-in': 'Spin in',
    'float-up': 'Float up',
  },
  exit: {
    none: 'None',
    'fade-out': 'Fade out',
    'slide-up': 'Slide up',
    'slide-down': 'Slide down',
    'slide-left': 'Slide left',
    'slide-right': 'Slide right',
    'zoom-out': 'Zoom out',
    collapse: 'Collapse',
  },
  loop: {
    none: 'None',
    pulse: 'Pulse',
    float: 'Float',
    bounce: 'Bounce',
    sway: 'Sway',
    wiggle: 'Wiggle',
    breath: 'Breath',
  },
  scroll: {
    none: 'None',
    'parallax-y': 'Parallax Y',
    'background-parallax': 'Background parallax',
    'fade-on-scroll': 'Fade on scroll',
    'scale-on-scroll': 'Scale on scroll',
    'rotate-on-scroll': 'Rotate on scroll',
    pin: 'Pin',
    'scrub-translate': 'Scrub translate',
    'scrub-opacity': 'Scrub opacity',
    'scrub-rotate': 'Scrub rotate',
  },
  hover: {
    none: 'None',
    lift: 'Lift',
    pulse: 'Pulse',
    glow: 'Glow',
    'rotate-3d': 'Rotate 3D',
    tint: 'Tint',
    fade: 'Fade',
  },
  click: {
    none: 'None',
    pulse: 'Pulse',
    bounce: 'Bounce',
    shake: 'Shake',
    flash: 'Flash',
  },
  easing: {
    ease: 'ease',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
    linear: 'linear',
    elastic: 'Elastic',
  },
};

const COPY: Record<'ko' | 'zh-hant' | 'en', AnimationsTabCopy> = {
  ko: {
    sections: {
      entrance: '등장',
      exit: '퇴장',
      loop: '반복',
      scroll: '스크롤',
      hover: '호버',
      click: '클릭',
      motionTimeline: '모션 타임라인',
      lottie: 'Lottie 애니메이션',
    },
    previewButtonLabel: '미리보기 재생',
    presetLabel: '프리셋',
    effectLabel: '효과',
    durationLabel: '시간',
    delayLabel: '지연',
    triggerOnceLabel: '한 번만 실행',
    intensityLabel: '강도',
    transitionLabel: '전환',
    easingLabel: '이징',
    customEasingLabel: '사용자 지정',
    customEasingOptionLabel: '사용자 cubic-bezier',
    resetButtonLabel: '애니메이션 초기화',
    aria: {
      entrancePreset: '등장 프리셋',
      exitPreset: '퇴장 프리셋',
      loopPreset: '반복 프리셋',
      scrollEffect: '스크롤 효과',
      hoverPreset: '호버 프리셋',
      clickPreset: '클릭 프리셋',
    },
    hints: {
      exit: '퇴장 애니메이션은 게시된 페이지에서 요소가 뷰포트를 벗어날 때 실행됩니다.',
      loop: '반복 프리셋은 게시된 페이지에서 계속 실행되며 모션 줄이기 설정을 존중합니다.',
      scroll: '스크롤 효과는 게시된 페이지에서 실행됩니다. 에디터에는 런타임 설정으로 저장됩니다.',
      hover: '호버 프리셋은 스타일 탭의 호버 컨트롤과 별개이며 함께 레이어링할 수 있습니다.',
      click: '클릭 트리거는 게시된 요소를 클릭할 때마다 한 번씩 다시 재생됩니다.',
      motionTimeline:
        '키프레임은 0~1 범위입니다. scroll-bound를 켜면 스크롤 진행률에 맞춰 보간하고, 끄면 durationMs 동안 시간 기반으로 재생합니다.',
    },
    lottie: {
      introBeforeWidget: '더 정교한 벡터 애니메이션이 필요하면 좌측 Add 패널의 ',
      widgetName: 'Media -> Lottie',
      introAfterWidget:
        ' 위젯을 캔버스에 추가하세요. LottieFiles 공식 임베드 URL을 붙여넣으면 재생, 속도, 루프를 위젯 인스펙터에서 제어할 수 있습니다.',
      supportedHosts: '지원 호스트: lottie.host / lottiefiles.com (CSP 허용 완료)',
      exampleLabel: '예',
      exampleUrl: 'https://lottie.host/embed/<id>/<hash>.lottie',
      iframeSandboxLabel: 'iframe 격리',
      iframeSandboxValue: 'sandbox="allow-scripts allow-same-origin"',
    },
    labels: KO_LABELS,
  },
  'zh-hant': {
    sections: {
      entrance: '進場',
      exit: '離場',
      loop: '循環',
      scroll: '捲動',
      hover: 'Hover',
      click: '點擊',
      motionTimeline: '動態時間軸',
      lottie: 'Lottie 動畫',
    },
    previewButtonLabel: '播放預覽',
    presetLabel: '預設',
    effectLabel: '效果',
    durationLabel: '時間',
    delayLabel: '延遲',
    triggerOnceLabel: '只觸發一次',
    intensityLabel: '強度',
    transitionLabel: '轉場',
    easingLabel: '緩動',
    customEasingLabel: '自訂',
    customEasingOptionLabel: '自訂 cubic-bezier',
    resetButtonLabel: '重設動畫',
    aria: {
      entrancePreset: '進場預設',
      exitPreset: '離場預設',
      loopPreset: '循環預設',
      scrollEffect: '捲動效果',
      hoverPreset: 'Hover 預設',
      clickPreset: '點擊預設',
    },
    hints: {
      exit: '離場動畫會在已發布頁面中，當元素離開視窗時執行。',
      loop: '循環預設會在已發布頁面中持續執行，並尊重減少動態效果設定。',
      scroll: '捲動效果會在已發布頁面中執行；編輯器會將它保存為執行階段設定。',
      hover: 'Hover 預設與樣式分頁的 hover 控制分開，並可與其疊加使用。',
      click: '點擊觸發會在已發布元素每次被點擊時重新播放一次。',
      motionTimeline:
        '關鍵影格範圍為 0 到 1。開啟 scroll-bound 時會依捲動進度插值；關閉時會在 durationMs 期間以時間播放。',
    },
    lottie: {
      introBeforeWidget: '如需更精細的向量動畫，請從左側新增面板加入 ',
      widgetName: 'Media -> Lottie',
      introAfterWidget:
        ' 小工具到畫布。貼上 LottieFiles 官方嵌入 URL 後，即可在小工具檢查器控制播放、速度與循環。',
      supportedHosts: '支援主機：lottie.host / lottiefiles.com（CSP 已允許）',
      exampleLabel: '範例',
      exampleUrl: 'https://lottie.host/embed/<id>/<hash>.lottie',
      iframeSandboxLabel: 'iframe 隔離',
      iframeSandboxValue: 'sandbox="allow-scripts allow-same-origin"',
    },
    labels: ZH_HANT_LABELS,
  },
  en: {
    sections: {
      entrance: 'Entrance',
      exit: 'Exit',
      loop: 'Loop',
      scroll: 'Scroll',
      hover: 'Hover',
      click: 'Click',
      motionTimeline: 'Motion timeline',
      lottie: 'Lottie animation',
    },
    previewButtonLabel: 'Play preview',
    presetLabel: 'Preset',
    effectLabel: 'Effect',
    durationLabel: 'Duration',
    delayLabel: 'Delay',
    triggerOnceLabel: 'Trigger once',
    intensityLabel: 'Intensity',
    transitionLabel: 'Transition',
    easingLabel: 'Easing',
    customEasingLabel: 'Custom',
    customEasingOptionLabel: 'Custom cubic-bezier',
    resetButtonLabel: 'Reset animations',
    aria: {
      entrancePreset: 'Entrance preset',
      exitPreset: 'Exit preset',
      loopPreset: 'Loop preset',
      scrollEffect: 'Scroll effect',
      hoverPreset: 'Hover preset',
      clickPreset: 'Click preset',
    },
    hints: {
      exit: 'Exit runs when the element leaves the viewport on the published page.',
      loop: 'Loop presets run continuously on the published page and respect reduced motion.',
      scroll: 'Scroll effects run on the published page; the editor keeps this as a runtime setting.',
      hover: 'Hover presets are separate from the Style tab hover controls and can be layered with them.',
      click: 'Click trigger replays once every time the published element is clicked.',
      motionTimeline:
        'Keyframes use the 0-1 range. Enable scroll-bound to interpolate by scroll progress, or disable it to play over durationMs.',
    },
    lottie: {
      introBeforeWidget: 'For more precise vector motion, add the ',
      widgetName: 'Media -> Lottie',
      introAfterWidget:
        ' widget from the left Add panel. Paste a LottieFiles official embed URL to control playback, speed, and loop settings from the widget inspector.',
      supportedHosts: 'Supported hosts: lottie.host / lottiefiles.com (CSP allowed)',
      exampleLabel: 'Example',
      exampleUrl: 'https://lottie.host/embed/<id>/<hash>.lottie',
      iframeSandboxLabel: 'iframe isolation',
      iframeSandboxValue: 'sandbox="allow-scripts allow-same-origin"',
    },
    labels: EN_LABELS,
  },
};

export function getAnimationsTabCopy(locale: Locale): AnimationsTabCopy {
  return COPY[locale] ?? COPY.en;
}
