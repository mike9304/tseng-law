import type { Locale } from '@/lib/locales';
import type { ComponentDesignPresetKey } from '@/lib/builder/site/component-design-presets';

export interface DesignerPresetDisplayCopy {
  label: string;
  description: string;
  recommendation: string;
  finish: string;
  rhythm: string;
  accent: string;
}

const DESIGN_PRESET_DISPLAY_COPY: Record<Locale, Record<ComponentDesignPresetKey, DesignerPresetDisplayCopy>> = {
  ko: {
    classic: {
      label: '기본형 시스템',
      description: '테두리 카드, 단단한 버튼, 표준 입력 필드로 정돈합니다.',
      recommendation: '깔끔한 기준선으로 버튼, 카드, 필드를 먼저 정렬합니다.',
      finish: '정돈된 기본형',
      rhythm: '구조적 행',
      accent: '솔리드 CTA',
    },
    soft: {
      label: '부드러운 시스템',
      description: '차분한 카드, 부드러운 필드, 낮은 압박의 보조 액션입니다.',
      recommendation: '서비스형 페이지처럼 부담 낮은 카드와 필드 리듬을 맞춥니다.',
      finish: '차분한 서비스형',
      rhythm: '소프트 그룹',
      accent: '저압 CTA',
    },
    editorial: {
      label: '에디토리얼 시스템',
      description: '얇은 프레임 카드, 밑줄 필드, 텍스트 중심 액션입니다.',
      recommendation: '텍스트 중심 섹션에 얇은 카드 리듬을 맞춥니다.',
      finish: '매거진 신뢰감',
      rhythm: '얇은 구분선',
      accent: '텍스트 CTA',
    },
    conversion: {
      label: '전환형 시스템',
      description: '떠 있는 카드, 강한 CTA 버튼, 폼 강조를 우선합니다.',
      recommendation: '폼 완료와 CTA 강조가 필요한 영역을 빠르게 정리합니다.',
      finish: '전환 최적화',
      rhythm: 'CTA 스택',
      accent: '섀도 CTA',
    },
    studio: {
      label: '스튜디오 시스템',
      description: '스포트라이트 카드, 화살표 CTA, 고급 페이지 리듬입니다.',
      recommendation: '히어로 카드, CTA 리듬, 폼 질감을 고급 페이지 기준으로 맞춥니다.',
      finish: '스튜디오 강조',
      rhythm: '히어로 카드',
      accent: '화살표 CTA',
    },
  },
  'zh-hant': {
    classic: {
      label: '基礎型系統',
      description: '以邊框卡片、實心按鈕與標準欄位整理版面。',
      recommendation: '用乾淨基準先對齊按鈕、卡片與欄位。',
      finish: '乾淨基準',
      rhythm: '結構列',
      accent: '實心 CTA',
    },
    soft: {
      label: '柔和型系統',
      description: '使用柔和卡片、淡色欄位與低壓輔助動作。',
      recommendation: '以低壓服務節奏整理卡片與欄位。',
      finish: '平靜服務感',
      rhythm: '柔和群組',
      accent: '低壓 CTA',
    },
    editorial: {
      label: '編輯型系統',
      description: '細框卡片、底線欄位與文字導向動作。',
      recommendation: '為文字導向區段套用細框卡片節奏。',
      finish: '雜誌信任感',
      rhythm: '細線層級',
      accent: '文字 CTA',
    },
    conversion: {
      label: '轉換型系統',
      description: '提高卡片層級、CTA 與表單完成動線。',
      recommendation: '快速強化表單完成率與 CTA 重點。',
      finish: '高轉換',
      rhythm: 'CTA 堆疊',
      accent: '陰影 CTA',
    },
    studio: {
      label: '工作室系統',
      description: '聚焦卡片、箭頭 CTA 與高端頁面節奏。',
      recommendation: '以高端頁面標準對齊主視覺卡片、CTA 與表單質感。',
      finish: '工作室聚焦',
      rhythm: '主視覺卡片',
      accent: '箭頭 CTA',
    },
  },
  en: {
    classic: {
      label: 'Classic system',
      description: 'Bordered cards, solid buttons, and classic form fields.',
      recommendation: 'Use Classic system as a clean baseline.',
      finish: 'clean baseline',
      rhythm: 'structured rows',
      accent: 'solid primary CTA',
    },
    soft: {
      label: 'Soft system',
      description: 'Muted cards, soft fields, and quieter secondary actions.',
      recommendation: 'Use Soft system to keep service pages calm and low-pressure.',
      finish: 'calm service',
      rhythm: 'soft grouped panels',
      accent: 'low-pressure CTA',
    },
    editorial: {
      label: 'Editorial system',
      description: 'Thin framed cards, underline fields, and text-led actions.',
      recommendation: 'Use Editorial system for text-led card rhythm.',
      finish: 'magazine trust',
      rhythm: 'thin-rule hierarchy',
      accent: 'text-led CTA',
    },
    conversion: {
      label: 'Conversion system',
      description: 'Elevated cards, CTA buttons, and full-form emphasis.',
      recommendation: 'Use Conversion system to tighten forms and CTA emphasis.',
      finish: 'high-conversion',
      rhythm: 'featured CTA stack',
      accent: 'shadow CTA',
    },
    studio: {
      label: 'Studio system',
      description: 'Spotlight cards, arrow CTAs, and branded form rhythm for high-end pages.',
      recommendation: 'Use Studio system to align hero cards, CTA rhythm, and form finish.',
      finish: 'studio spotlight',
      rhythm: 'hero-card-cta',
      accent: 'arrow CTA',
    },
  },
};

const DESIGN_CATEGORY_LABELS: Record<Locale, Record<string, string>> = {
  ko: { button: '버튼', card: '카드', field: '필드', submit: '제출 버튼' },
  'zh-hant': { button: '按鈕', card: '卡片', field: '欄位', submit: '提交按鈕' },
  en: { button: 'button', card: 'card', field: 'field', submit: 'submit' },
};

const DESIGN_VALUE_LABELS: Record<Locale, Record<string, string>> = {
  ko: {
    'primary-solid': '기본 솔리드',
    'primary-outline': '기본 아웃라인',
    'primary-ghost': '기본 고스트',
    'primary-link': '기본 링크',
    'secondary-solid': '보조 솔리드',
    'secondary-outline': '보조 아웃라인',
    'cta-shadow': '강조 섀도 CTA',
    'cta-arrow': '화살표 CTA',
    flat: '플랫 카드',
    elevated: '살짝 띄운 카드',
    floating: '부유형 카드',
    glass: '글래스 카드',
    split: '분할 카드',
    editorial: '에디토리얼 카드',
    compact: '컴팩트 카드',
    spotlight: '스포트라이트 카드',
    outline: '아웃라인 카드',
    timeline: '타임라인 카드',
    soft: '소프트 카드',
    contrast: '대비 카드',
    default: '기본 필드',
    underline: '밑줄 필드',
    filled: '채운 필드',
    primary: '기본 제출',
    secondary: '보조 제출',
    ghost: '고스트 제출',
  },
  'zh-hant': {
    'primary-solid': '主要實心',
    'primary-outline': '主要外框',
    'primary-ghost': '主要淡色',
    'primary-link': '主要文字',
    'secondary-solid': '次要實心',
    'secondary-outline': '次要外框',
    'cta-shadow': '強調陰影 CTA',
    'cta-arrow': '箭頭 CTA',
    flat: '扁平卡片',
    elevated: '微浮卡片',
    floating: '浮動卡片',
    glass: '玻璃卡片',
    split: '分割卡片',
    editorial: '編輯卡片',
    compact: '精簡卡片',
    spotlight: '聚焦卡片',
    outline: '外框卡片',
    timeline: '時間軸卡片',
    soft: '柔和卡片',
    contrast: '對比卡片',
    default: '標準欄位',
    underline: '底線欄位',
    filled: '填色欄位',
    primary: '主要提交',
    secondary: '次要提交',
    ghost: '淡色提交',
  },
  en: {
    'primary-solid': 'Primary solid',
    'primary-outline': 'Primary outline',
    'primary-ghost': 'Primary ghost',
    'primary-link': 'Primary link',
    'secondary-solid': 'Secondary solid',
    'secondary-outline': 'Secondary outline',
    'cta-shadow': 'CTA shadow',
    'cta-arrow': 'CTA arrow',
    flat: 'Flat card',
    elevated: 'Elevated card',
    floating: 'Floating card',
    glass: 'Glass card',
    split: 'Split card',
    editorial: 'Editorial card',
    compact: 'Compact card',
    spotlight: 'Spotlight card',
    outline: 'Outline card',
    timeline: 'Timeline card',
    soft: 'Soft card',
    contrast: 'Contrast card',
    default: 'Default field',
    underline: 'Underline field',
    filled: 'Filled field',
    primary: 'Primary submit',
    secondary: 'Secondary submit',
    ghost: 'Ghost submit',
  },
};

function localizeDesignerCategory(locale: Locale, category: string): string {
  return DESIGN_CATEGORY_LABELS[locale][category] ?? category;
}

function localizeDesignerValue(locale: Locale, value: string): string {
  return DESIGN_VALUE_LABELS[locale][value] ?? value;
}

function isComponentDesignPresetKey(value: string): value is ComponentDesignPresetKey {
  return value in DESIGN_PRESET_DISPLAY_COPY.en;
}

function localizeDesignerQualitySignal(locale: Locale, signal: string): string {
  if (signal === 'no-targets') {
    if (locale === 'ko') return '대상 없음';
    if (locale === 'zh-hant') return '無目標';
    return 'No targets';
  }
  if (signal === 'all-components-match') {
    if (locale === 'ko') return '전체 일치';
    if (locale === 'zh-hant') return '全部符合';
    return 'All components match';
  }
  const [kind, value, count] = signal.split(':');
  if (kind === 'preset' && value && isComponentDesignPresetKey(value)) {
    return DESIGN_PRESET_DISPLAY_COPY[locale][value].label;
  }
  if ((kind === 'change' || kind === 'matched') && value) {
    const action = kind === 'change'
      ? locale === 'ko'
        ? '변경'
        : locale === 'zh-hant'
          ? '變更'
          : 'change'
      : locale === 'ko'
        ? '일치'
        : locale === 'zh-hant'
          ? '符合'
          : 'matched';
    return `${localizeDesignerCategory(locale, value)} ${action}${count ? ` ${count}` : ''}`;
  }
  return signal;
}

export interface SandboxEditorRailCopy {
  rail: {
    pages: string;
    add: string;
    design: string;
    layers: string;
    navigation: string;
    columns: string;
    contentManager: string;
    appMarket: string;
    ai: string;
    history: string;
  };
  design: {
    templates: string;
    sectionDesign: string;
    sectionList: string;
    sectionDescription: string;
    overviewDescription: string;
    openTemplates: (count: number) => string;
    sectionTemplateTargetSummary: (count: number, description: string) => string;
    siteSettings: string;
    siteSettingsDescription: string;
    open: string;
    designer: string;
    polishPresets: string;
    audit: string;
    components: (count: number) => string;
    recommendation: string;
    previewEmpty: string;
    previewSynced: string;
    previewPending: (changes: number, matched: number) => string;
    fit: (score: number) => string;
    noComponentTargets: string;
    allTargetsAligned: string;
    partialSystemFit: string;
    systemUpdateNeeded: string;
    recommendedSuffix: string;
    closestSuffix: string;
    presets: Record<ComponentDesignPresetKey, DesignerPresetDisplayCopy>;
    currentFitLeader: string;
    currentFitLeaderNote: string;
    currentFitApply: (label: string) => string;
    currentFitApplied: string;
    applyRecommendation: (label: string) => string;
    recommendationApplied: string;
    changesLabel: string;
    qualitySignal: (signal: string) => string;
    buttons: string;
    cards: string;
    fields: string;
    submit: string;
    buttonsChange: (count: number) => string;
    cardsChange: (count: number) => string;
    fieldsChange: (count: number) => string;
    submitChange: (count: number) => string;
    changeTo: (category: string, nextValue: string) => string;
    priorityReason: (category: string) => string;
    moreChanges: (count: number) => string;
    priority: string;
    morePriorities: (count: number) => string;
    currentFit: string;
    currentFitLeaderSummary: (label: string, score: number, changes: number) => string;
    recommendedIsCurrentFitLeader: string;
    recommendedChangeDelta: (label: string, delta: number) => string;
    recommended: string;
    closest: string;
  };
  columns: {
    blog: string;
    writing: string;
    description: string;
    canvasLabel: string;
    currentOpen: string;
    openFirstClick: string;
    syncing: string;
    connected: (count: number) => string;
    loading: string;
    checkNeeded: string;
    connectedCount: (count: number) => string;
    reload: string;
    recentColumns: string;
    edit: string;
    newPost: string;
    postList: string;
    pageLookupPending: string;
    openPublicColumns: string;
  };
  history: {
    history: string;
    versionHistory: string;
    open: string;
    description: string;
  };
}

export function getSandboxEditorRailCopy(locale: Locale): SandboxEditorRailCopy {
  if (locale === 'zh-hant') {
    return {
      rail: {
        pages: '頁面',
        add: '新增',
        design: '設計',
        layers: '圖層',
        navigation: '導覽',
        columns: '專欄',
        contentManager: '內容管理器',
        appMarket: '應用市集',
        ai: 'AI',
        history: '歷史',
      },
      design: {
        templates: '範本',
        sectionDesign: '區段設計',
        sectionList: '區段清單',
        sectionDescription: '保留此區段的文字、網址與連結資料，僅更換設計樣式。',
        overviewDescription: '選取區段後，可立即套用該區塊的 12 種設計變化。',
        openTemplates: (count) => `查看全部頁面範本 ${count} 個`,
        sectionTemplateTargetSummary: (count, description) => `${count} 種設計範本 · ${description}`,
        siteSettings: '網站設定',
        siteSettingsDescription: '品牌、聯絡資訊、Logo、favicon 等 site-level 設定在此 modal 中編輯。',
        open: '開啟',
        designer: '設計師',
        polishPresets: '精修預設',
        audit: '設計師審核',
        components: (count) => `${count} 個元件`,
        recommendation: '建議：',
        previewEmpty: '套用前預覽：沒有可變更的項目',
        previewSynced: '套用前預覽：已與建議系統完全一致 · 無需額外變更',
        previewPending: (changes, matched) => `套用前預覽：預計 ${changes} 項變更 · ${matched} 項已符合`,
        fit: (score) => `適配 ${score}%`,
        noComponentTargets: '沒有元件目標',
        allTargetsAligned: '所有目標已對齊',
        partialSystemFit: '部分系統符合',
        systemUpdateNeeded: '需要更新系統',
        recommendedSuffix: ' · 建議',
        closestSuffix: ' · 最接近',
        presets: DESIGN_PRESET_DISPLAY_COPY['zh-hant'],
        currentFitLeader: '目前最接近',
        currentFitLeaderNote: '建議的系統也是最接近的選項',
        currentFitApply: (label) => `套用目前最接近：${label}`,
        currentFitApplied: '目前最接近的系統已套用',
        applyRecommendation: (label) => `套用建議：${label}`,
        recommendationApplied: '建議系統已套用',
        changesLabel: '變更',
        qualitySignal: (signal) => localizeDesignerQualitySignal('zh-hant', signal),
        buttons: '按鈕',
        cards: '卡片',
        fields: '欄位',
        submit: '提交',
        buttonsChange: (count) => `按鈕變更 ${count}`,
        cardsChange: (count) => `卡片變更 ${count}`,
        fieldsChange: (count) => `欄位變更 ${count}`,
        submitChange: (count) => `提交變更 ${count}`,
        changeTo: (category, nextValue) => `${localizeDesignerCategory('zh-hant', category)} → ${localizeDesignerValue('zh-hant', nextValue)}`,
        priorityReason: (category) => {
          if (category === 'card') return '先建立視覺層級';
          if (category === 'button') return '接著對齊 CTA 節奏';
          if (category === 'field') return '版面後同步欄位質感';
          if (category === 'submit') return '保持提交動作一致';
          return '維持系統一致性';
        },
        moreChanges: (count) => `另外 ${count} 項`,
        priority: '設計優先順序',
        morePriorities: (count) => `另外 ${count} 個優先順序`,
        currentFit: '目前最接近',
        currentFitLeaderSummary: (label, score, changes) => `${label} · ${score}% · ${changes} 項變更`,
        recommendedIsCurrentFitLeader: '建議系統也是最接近的選項',
        recommendedChangeDelta: (label, delta) => `建議 ${label} 為意圖導向 · ${delta > 0 ? '+' : ''}${delta} 項變更差`,
        recommended: '建議',
        closest: '最接近',
      },
      columns: {
        blog: '部落格',
        writing: '寫作',
        description: '只需輸入標題與內文，摘要會自動補齊。頁面編輯可透過獨立按鈕進入。',
        canvasLabel: '畫布',
        currentOpen: '目前開啟',
        openFirstClick: '首次點擊即可開啟',
        syncing: '同步中',
        connected: (count) => `已連結 ${count} 個`,
        loading: '載入專欄中',
        checkNeeded: '需要確認專欄連結',
        connectedCount: (count) => `已連結 ${count} 個專欄`,
        reload: '請重新開啟列表或重新整理後再試。',
        recentColumns: '最近專欄',
        edit: '編輯',
        newPost: '撰寫新文章',
        postList: '文章列表',
        pageLookupPending: '頁面確認中...',
        openPublicColumns: '查看公開專欄',
      },
      history: {
        history: '歷史',
        versionHistory: '版本歷史',
        open: '開啟',
        description: '查看已儲存版本，並在確認後還原需要的時間點。',
      },
    };
  }

  if (locale === 'en') {
    return {
      rail: {
        pages: 'Pages',
        add: 'Add',
        design: 'Design',
        layers: 'Layers',
        navigation: 'Navigation',
        columns: 'Columns',
        contentManager: 'Content Manager',
        appMarket: 'App Market',
        ai: 'AI',
        history: 'History',
      },
      design: {
        templates: 'Templates',
        sectionDesign: 'Section design',
        sectionList: 'Section list',
        sectionDescription: 'Swap the design variant while keeping the section’s text, URLs, and links intact.',
        overviewDescription: 'Select a section and apply one of its 12 design variants instantly.',
        openTemplates: (count) => `View all page templates ${count}`,
        sectionTemplateTargetSummary: (count, description) => `${count} design variants · ${description}`,
        siteSettings: 'Site settings',
        siteSettingsDescription: 'Brand, contact, logo, and favicon settings are edited in this modal.',
        open: 'Open',
        designer: 'Designer',
        polishPresets: 'Polish presets',
        audit: 'Designer audit',
        components: (count) => `${count} components`,
        recommendation: 'Recommendation:',
        previewEmpty: 'Preview before apply: nothing to change',
        previewSynced: 'Preview before apply: fully aligned with the recommendation system · no extra changes',
        previewPending: (changes, matched) => `Preview before apply: ${changes} changes planned · ${matched} already aligned`,
        fit: (score) => `Fit ${score}%`,
        noComponentTargets: 'No component targets',
        allTargetsAligned: 'All targets aligned',
        partialSystemFit: 'Partial system fit',
        systemUpdateNeeded: 'System update needed',
        recommendedSuffix: ' · recommended',
        closestSuffix: ' · closest',
        presets: DESIGN_PRESET_DISPLAY_COPY.en,
        currentFitLeader: 'Current-fit leader',
        currentFitLeaderNote: 'Recommended system is also the closest fit',
        currentFitApply: (label) => `Apply current-fit: ${label}`,
        currentFitApplied: 'Current-fit system applied',
        applyRecommendation: (label) => `Apply recommendation: ${label}`,
        recommendationApplied: 'Recommendation system applied',
        changesLabel: 'changes',
        qualitySignal: (signal) => localizeDesignerQualitySignal('en', signal),
        buttons: 'Buttons',
        cards: 'Cards',
        fields: 'Fields',
        submit: 'Submit',
        buttonsChange: (count) => `Buttons change ${count}`,
        cardsChange: (count) => `Cards change ${count}`,
        fieldsChange: (count) => `Fields change ${count}`,
        submitChange: (count) => `Submit change ${count}`,
        changeTo: (category, nextValue) => `${localizeDesignerCategory('en', category)} → ${localizeDesignerValue('en', nextValue)}`,
        priorityReason: (category) => {
          if (category === 'card') return 'Set visual hierarchy first';
          if (category === 'button') return 'Align CTA rhythm next';
          if (category === 'field') return 'Match field finish after layout';
          if (category === 'submit') return 'Keep submit action consistent';
          return 'Keep system consistency';
        },
        moreChanges: (count) => `+${count} more`,
        priority: 'Designer priority',
        morePriorities: (count) => `+${count} more priorities`,
        currentFit: 'Current-fit',
        currentFitLeaderSummary: (label, score, changes) => `${label} · ${score}% · ${changes} changes`,
        recommendedIsCurrentFitLeader: 'Recommended system is also the closest fit',
        recommendedChangeDelta: (label, delta) => `Recommended ${label} is intent-led · ${delta > 0 ? '+' : ''}${delta} change delta`,
        recommended: 'recommended',
        closest: 'closest',
      },
      columns: {
        blog: 'Blog',
        writing: 'Writing',
        description: 'Type the title and body and the summary will be filled automatically. Page editing opens from a separate button.',
        canvasLabel: 'Canvas',
        currentOpen: 'Currently open',
        openFirstClick: 'Open on first click',
        syncing: 'Syncing',
        connected: (count) => `${count} connected`,
        loading: 'Loading columns',
        checkNeeded: 'Column link needs attention',
        connectedCount: (count) => `${count} columns connected`,
        reload: 'Reopen the list or refresh and try again.',
        recentColumns: 'Recent columns',
        edit: 'Edit',
        newPost: 'Write new post',
        postList: 'Post list',
        pageLookupPending: 'Checking page…',
        openPublicColumns: 'View public columns',
      },
      history: {
        history: 'History',
        versionHistory: 'Version history',
        open: 'Open',
        description: 'Review saved versions and restore a point in time after confirmation.',
      },
    };
  }

  return {
    rail: {
      pages: '페이지',
      add: '추가',
      design: '디자인',
      layers: '레이어',
      navigation: '내비게이션',
      columns: '칼럼',
      contentManager: '콘텐츠 관리자',
      appMarket: '앱 마켓',
      ai: 'AI',
      history: '히스토리',
    },
    design: {
      templates: '템플릿',
      sectionDesign: '섹션 디자인',
      sectionList: '섹션 목록',
      sectionDescription: '이 섹션의 텍스트, URL, 링크 데이터는 유지한 채 디자인 변형만 바꿉니다.',
      overviewDescription: '섹션을 선택하면 해당 영역의 12개 디자인 변형을 바로 적용할 수 있습니다.',
      openTemplates: (count) => `전체 페이지 템플릿 ${count}개 보기`,
      sectionTemplateTargetSummary: (count, description) => `${count}개 디자인 템플릿 · ${description}`,
      siteSettings: '사이트 설정',
      siteSettingsDescription: '브랜드, 연락처, 로고, 파비콘 같은 설정은 이 modal에서 편집합니다.',
      open: '열기',
      designer: '디자이너',
      polishPresets: '정리 프리셋',
      audit: '디자이너 검토',
      components: (count) => `${count}개 컴포넌트`,
      recommendation: '추천:',
      previewEmpty: '적용 전 미리보기: 변경 대상 없음',
      previewSynced: '적용 전 미리보기: 추천 시스템과 모두 일치 · 추가 변경 없음',
      previewPending: (changes, matched) => `적용 전 미리보기: ${changes}개 변경 예정 · ${matched}개 이미 일치`,
      fit: (score) => `적합도 ${score}%`,
      noComponentTargets: '컴포넌트 대상 없음',
      allTargetsAligned: '모든 대상이 정렬됨',
      partialSystemFit: '부분 시스템 적합',
      systemUpdateNeeded: '시스템 업데이트 필요',
      recommendedSuffix: ' · 추천',
      closestSuffix: ' · 최근접',
      presets: DESIGN_PRESET_DISPLAY_COPY.ko,
      currentFitLeader: '현재 최근접',
      currentFitLeaderNote: '추천 시스템도 가장 근접한 선택입니다',
      currentFitApply: (label) => `현재 최근접 적용: ${label}`,
      currentFitApplied: '현재 최근접 시스템이 적용됨',
      applyRecommendation: (label) => `추천 적용: ${label}`,
      recommendationApplied: '추천 시스템이 적용됨',
      changesLabel: '변경',
      qualitySignal: (signal) => localizeDesignerQualitySignal('ko', signal),
      buttons: '버튼',
      cards: '카드',
      fields: '필드',
      submit: '제출',
      buttonsChange: (count) => `버튼 변경 ${count}`,
      cardsChange: (count) => `카드 변경 ${count}`,
      fieldsChange: (count) => `필드 변경 ${count}`,
      submitChange: (count) => `제출 변경 ${count}`,
      changeTo: (category, nextValue) => `${localizeDesignerCategory('ko', category)} → ${localizeDesignerValue('ko', nextValue)}`,
      priorityReason: (category) => {
        if (category === 'card') return '시각 위계를 먼저 정리';
        if (category === 'button') return 'CTA 리듬을 다음으로 맞춤';
        if (category === 'field') return '레이아웃 후 필드 질감 동기화';
        if (category === 'submit') return '제출 액션 일관성 유지';
        return '시스템 일관성 유지';
      },
      moreChanges: (count) => `+${count}개 더`,
      priority: '디자이너 우선순위',
      morePriorities: (count) => `우선순위 ${count}개 더`,
      currentFit: '현재 최근접',
      currentFitLeaderSummary: (label, score, changes) => `${label} · ${score}% · ${changes}개 변경`,
      recommendedIsCurrentFitLeader: '추천 시스템도 가장 근접한 선택입니다',
      recommendedChangeDelta: (label, delta) => `추천 ${label}은 의도 중심입니다 · ${delta > 0 ? '+' : ''}${delta}개 변경 차이`,
      recommended: '추천',
      closest: '최근접',
    },
    columns: {
      blog: '블로그',
      writing: '글쓰기',
      description: '제목과 본문만 쓰면 요약은 자동으로 채워집니다. 페이지 편집은 별도 버튼으로 이동합니다.',
      canvasLabel: '캔버스',
      currentOpen: '현재 열림',
      openFirstClick: '첫 클릭으로 열기',
      syncing: '동기화 중',
      connected: (count) => `${count}개 연결`,
      loading: '칼럼 불러오는 중',
      checkNeeded: '칼럼 연결 확인 필요',
      connectedCount: (count) => `${count}개 칼럼 연결됨`,
      reload: '목록을 다시 열거나 새로고침 후 확인하세요.',
      recentColumns: '최근 칼럼',
      edit: '수정',
      newPost: '새 글 쓰기',
      postList: '글 목록',
      pageLookupPending: '페이지 확인 중...',
      openPublicColumns: '공개 칼럼 보기',
    },
    history: {
      history: '히스토리',
      versionHistory: '버전 히스토리',
      open: '열기',
      description: '저장된 버전을 확인하고 필요한 시점으로 복원합니다.',
    },
  };
}
