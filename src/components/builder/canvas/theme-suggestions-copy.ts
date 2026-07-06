import type { Locale } from '@/lib/locales';
import type {
  ThemeSuggestionRadiusPreset,
  ThemeSuggestionShadowPreset,
  ThemeVibe,
} from '@/lib/builder/ai-generator/theme-suggestions';

export interface ThemeSuggestionsCopy {
  heading: string;
  promptLabel: string;
  promptPlaceholder: string;
  suggest: string;
  suggesting: string;
  apply: string;
  error: string;
  emptyPrompt: string;
  labels: {
    palette: string;
    radius: string;
    shadow: string;
    base: string;
    scale: string;
  };
  vibes: Record<ThemeVibe, string>;
  rationales: Record<ThemeVibe, string>;
  radiusPresets: Record<ThemeSuggestionRadiusPreset, string>;
  shadowPresets: Record<ThemeSuggestionShadowPreset, string>;
}

export function getThemeSuggestionsCopy(locale: Locale): ThemeSuggestionsCopy {
  if (locale === 'zh-hant') {
    return {
      heading: 'AI 主題建議',
      promptLabel: '品牌描述',
      promptPlaceholder: '例如：premium international law firm with gold accents',
      suggest: '產生主題',
      suggesting: '產生中...',
      apply: '套用至目前主題',
      error: '無法產生主題建議。',
      emptyPrompt: '請輸入品牌描述。',
      labels: {
        palette: '色彩',
        radius: '圓角',
        shadow: '陰影',
        base: '基準',
        scale: '比例',
      },
      vibes: {
        modern: '現代',
        warm: '溫暖',
        professional: '專業',
        playful: '活潑',
        luxury: '奢華',
        minimal: '極簡',
      },
      rationales: {
        modern: '俐落藍色主色與中性色階，適合現代科技感。',
        warm: '赭色與陶土色讓品牌更親切、有人味。',
        professional: '保守海軍藍與精緻灰階，適合法律與金融品牌。',
        playful: '粉紅與紫色搭配明亮重點色，呈現友善活力。',
        luxury: '深炭背景與金色重點，營造高端定位。',
        minimal: '嚴謹單色系搭配單一重點色，讓內容優先。',
      },
      radiusPresets: {
        sharp: '銳利',
        medium: '適中',
        soft: '柔和',
      },
      shadowPresets: {
        none: '無',
        soft: '柔和',
        medium: '適中',
        strong: '強',
      },
    };
  }

  if (locale === 'en') {
    return {
      heading: 'AI theme suggestion',
      promptLabel: 'Brand brief',
      promptPlaceholder: 'Example: premium international law firm with gold accents',
      suggest: 'Suggest theme',
      suggesting: 'Suggesting...',
      apply: 'Apply to current theme',
      error: 'Could not create a theme suggestion.',
      emptyPrompt: 'Enter a brand brief.',
      labels: {
        palette: 'Palette',
        radius: 'Radius',
        shadow: 'Shadow',
        base: 'Base',
        scale: 'Scale',
      },
      vibes: {
        modern: 'Modern',
        warm: 'Warm',
        professional: 'Professional',
        playful: 'Playful',
        luxury: 'Luxury',
        minimal: 'Minimal',
      },
      rationales: {
        modern: 'Sharp blue primary with neutral grays for a contemporary tech feel.',
        warm: 'Earthy ochre and terracotta tones for an approachable, human feel.',
        professional: 'Conservative navy primary with refined grays for legal and finance brands.',
        playful: 'Vibrant pink and violet with a sunny accent for a friendly, energetic feel.',
        luxury: 'Deep charcoal background with gold accent for premium positioning.',
        minimal: 'Strict monochrome with a single accent for content-first design.',
      },
      radiusPresets: {
        sharp: 'Sharp',
        medium: 'Medium',
        soft: 'Soft',
      },
      shadowPresets: {
        none: 'None',
        soft: 'Soft',
        medium: 'Medium',
        strong: 'Strong',
      },
    };
  }

  return {
    heading: 'AI 테마 제안',
    promptLabel: '브랜드 설명',
    promptPlaceholder: '예: premium international law firm with gold accents',
    suggest: '테마 제안',
    suggesting: '제안 중...',
    apply: '현재 테마에 적용',
    error: '테마 제안을 만들 수 없습니다.',
    emptyPrompt: '브랜드 설명을 입력하세요.',
    labels: {
      palette: '팔레트',
      radius: '라운드',
      shadow: '그림자',
      base: '기준',
      scale: '스케일',
    },
    vibes: {
      modern: '모던',
      warm: '따뜻함',
      professional: '전문적',
      playful: '활동적',
      luxury: '럭셔리',
      minimal: '미니멀',
    },
    rationales: {
      modern: '선명한 블루와 중립 회색으로 현대적인 기술 감각을 만듭니다.',
      warm: '오커와 테라코타 계열로 친근하고 사람 중심의 인상을 줍니다.',
      professional: '차분한 네이비와 정제된 회색으로 법률, 금융 브랜드에 맞습니다.',
      playful: '핑크와 바이올렛에 밝은 포인트를 더해 친근하고 활기찬 분위기를 만듭니다.',
      luxury: '짙은 차콜 배경과 골드 포인트로 고급스러운 인상을 만듭니다.',
      minimal: '단색 중심 팔레트와 하나의 포인트 컬러로 콘텐츠를 앞세웁니다.',
    },
    radiusPresets: {
      sharp: '각진',
      medium: '보통',
      soft: '부드러운',
    },
    shadowPresets: {
      none: '없음',
      soft: '약함',
      medium: '보통',
      strong: '강함',
    },
  };
}
