import type { Locale } from '@/lib/locales';
import type { AspectRatioKey } from '@/lib/builder/canvas/crop';

type FocalPresetLabelKey = 'topLeft' | 'top' | 'topRight' | 'left' | 'center' | 'right' | 'bottomLeft' | 'bottom' | 'bottomRight';
type FilterPresetLabelKey = 'original' | 'bw' | 'vintage' | 'bright' | 'highContrast' | 'soft';
type SvgShapeLabels = {
  scales: string;
  shield: string;
  building: string;
  spark: string;
  'service-0': string;
  'service-1': string;
  'service-2': string;
  'service-3': string;
  'service-4': string;
  'service-5': string;
  'pricing-consultation': string;
  'pricing-litigation': string;
  'pricing-company': string;
  'pricing-retainer': string;
};

export interface ImageEditCopy {
  runtime: {
    fallbackAlt: string;
    imagePlaceholder: string;
    clickToAddImage: string;
    changeImageOverlay: string;
    beforeAfterComparison: string;
    beforeImageAlt: (imageAlt: string) => string;
    afterImageAlt: (imageAlt: string) => string;
    svgIconLabels: SvgShapeLabels;
    imageDetailFallback: string;
    popupContentFallback: string;
    closeLightbox: string;
    closePopup: string;
    popupDialogLabel: (imageAlt: string) => string;
  };
  inspector: {
    openAssetLibrary: string;
    openImageEditor: string;
    sourceUrl: string;
    sourceUrlPlaceholder: string;
    altText: string;
    fit: string;
    fitCover: string;
    fitContain: string;
    clickAction: string;
    none: string;
    link: string;
    lightbox: string;
    popup: string;
    mediaInteractions: string;
    hoverSwapImage: string;
    hoverSwapImagePlaceholder: string;
    hotspots: string;
    hotspotsPlaceholder: string;
    beforeAfter: string;
    enableCompareSlider: string;
    beforeImage: string;
    afterImage: string;
    position: string;
    svgGif: string;
    inlineSvgIcon: string;
    svgShape: string;
    svgShapes: SvgShapeLabels;
    svgColor: string;
    svgColorPlaceholder: string;
    gifProvider: string;
    manualGifUrl: string;
    giphySearchNote: string;
    gifSearchQuery: string;
    gifSearchQueryPlaceholder: string;
    cropLabel: string;
  };
  dialog: {
    ariaLabel: string;
    eyebrow: string;
    title: string;
    close: string;
    noImageSource: string;
    filterPanelTitle: string;
    tabs: {
      crop: string;
      filter: string;
      alt: string;
      ai: string;
    };
    crop: {
      modalTitle: string;
      modalDescription: string;
      modalAriaLabel: string;
      previewAlt: string;
      noImage: string;
      cancel: string;
      apply: string;
      aspectRatio: string;
      aspectRatioLabels: Record<AspectRatioKey, string>;
      focalPoint: string;
      focalPointPresets: string;
      focalPointX: string;
      focalPointY: string;
      focalPresetLabels: Record<FocalPresetLabelKey, string>;
      focalPresetAriaLabel: (label: string) => string;
    };
    filterPresets: {
      brightness: string;
      contrast: string;
      saturation: string;
      blur: string;
      bw: string;
      sepia: string;
    };
    filterPresetLabels: Record<FilterPresetLabelKey, string>;
    alt: {
      text: string;
      placeholder: string;
    };
    ai: {
      sectionTitle: string;
      sectionEyebrow: string;
      subtitle: string;
      body: string;
      previewAltFallback: string;
      previewFrame: string;
      previewFrameDialog: string;
      editPrompt: string;
      promptPlaceholder: string;
      promptPresets: string;
      reviewRestored: (filename?: string) => string;
      imageEditFailed: string;
      editedImageReady: (filename: string) => string;
      brushMaskDescription: string;
      maskArea: string;
      maskPresets: string;
      fullImage: string;
      brushArea: string;
      feather: string;
      edge: string;
      add: string;
      erase: string;
      brushSize: string;
      undoStroke: string;
      clearBrush: string;
      requiresAssetLibrary: string;
      generating: string;
      generate: string;
      selectedEdit: string;
      original: string;
      undoReview: string;
      redoReview: string;
      clearAiEdit: string;
      clearedNotice: string;
      current: string;
      applyWillReplace: (filename: string) => string;
      apply: string;
      cancel: string;
      previewDesktop: string;
      previewMobile: string;
      presetLabels: {
        premiumBright: string;
        editorialCalm: string;
        modernContrast: string;
      };
      presetPrompts: {
        premiumBright: string;
        editorialCalm: string;
        modernContrast: string;
      };
      maskLabels: {
        centerFocus: string;
        topBand: string;
        bottomBand: string;
        leftDetail: string;
        rightDetail: string;
      };
      maskDescriptions: {
        centerFocus: string;
        topBand: string;
        bottomBand: string;
        leftDetail: string;
        rightDetail: string;
      };
    };
  };
}

const IMAGE_EDIT_COPY: Record<Locale | 'en', ImageEditCopy> = {
  ko: {
    runtime: {
      fallbackAlt: '이미지',
      imagePlaceholder: '이미지 자리 표시자',
      clickToAddImage: '이미지를 추가하려면 클릭',
      changeImageOverlay: '이미지 변경',
      beforeAfterComparison: '전/후 비교',
      beforeImageAlt: (imageAlt) => `${imageAlt} 이전`,
      afterImageAlt: (imageAlt) => `${imageAlt} 이후`,
      svgIconLabels: {
        scales: '저울 아이콘',
        shield: '방패 아이콘',
        building: '건물 아이콘',
        spark: '스파크 아이콘',
        'service-0': '성장 차트 아이콘',
        'service-1': '문서 아이콘',
        'service-2': '분쟁 화살표 아이콘',
        'service-3': '보호 방패 아이콘',
        'service-4': '체크 방패 아이콘',
        'service-5': '사무소 아이콘',
        'pricing-consultation': '상담 아이콘',
        'pricing-litigation': '소송 아이콘',
        'pricing-company': '법인설립 아이콘',
        'pricing-retainer': '법률고문 아이콘',
      },
      imageDetailFallback: '이미지 상세',
      popupContentFallback: '미디어 팝업 콘텐츠',
      closeLightbox: '라이트박스 닫기',
      closePopup: '팝업 닫기',
      popupDialogLabel: (imageAlt) => `${imageAlt} 팝업`,
    },
    inspector: {
      openAssetLibrary: '자산 라이브러리 열기',
      openImageEditor: '자르기 / 필터 / Alt',
      sourceUrl: '원본 URL',
      sourceUrlPlaceholder: 'https://example.com/image.jpg',
      altText: '대체 텍스트',
      fit: '맞춤',
      fitCover: '채우기',
      fitContain: '맞춤 유지',
      clickAction: '클릭 동작',
      none: '없음',
      link: '링크',
      lightbox: '라이트박스',
      popup: '팝업',
      mediaInteractions: '미디어 상호작용',
      hoverSwapImage: '호버 시 이미지 교체',
      hoverSwapImagePlaceholder: '/images/hover.jpg',
      hotspots: '핫스팟',
      hotspotsPlaceholder: '42, 55, 상담 예약, /ko/contact',
      beforeAfter: '비교 전/후',
      enableCompareSlider: '비교 슬라이더 사용',
      beforeImage: '이전 이미지',
      afterImage: '이후 이미지',
      position: '위치',
      svgGif: 'SVG / GIF',
      inlineSvgIcon: '인라인 SVG 아이콘',
      svgShape: 'SVG 모양',
      svgShapes: {
        scales: '저울',
        shield: '방패',
        building: '건물',
        spark: '스파크',
        'service-0': '서비스: 성장 차트',
        'service-1': '서비스: 문서',
        'service-2': '서비스: 분쟁 화살표',
        'service-3': '서비스: 보호 방패',
        'service-4': '서비스: 체크 방패',
        'service-5': '서비스: 사무소',
        'pricing-consultation': '가격: 상담',
        'pricing-litigation': '가격: 소송',
        'pricing-company': '가격: 법인설립',
        'pricing-retainer': '가격: 법률고문',
      },
      svgColor: 'SVG 색상',
      svgColorPlaceholder: '#116dff 또는 프리셋의 테마 토큰',
      gifProvider: 'GIF 공급자',
      manualGifUrl: '수동 GIF URL',
      giphySearchNote: 'Giphy 검색 메모',
      gifSearchQuery: 'GIF 검색어',
      gifSearchQueryPlaceholder: '법률 사무소',
      cropLabel: '자르기:',
    },
    dialog: {
      ariaLabel: '자르기, 필터, 대체 텍스트',
      eyebrow: '이미지 설정',
      title: '자르기 / 필터 / Alt 편집',
      close: '닫기',
      noImageSource: '이미지 원본이 없습니다.',
      filterPanelTitle: '이미지 필터',
      tabs: {
        crop: '자르기',
        filter: '필터',
        alt: '대체 텍스트',
        ai: 'AI',
      },
      crop: {
        modalTitle: '이미지 자르기',
        modalDescription: '이 이미지의 미리보기 비율을 선택하세요.',
        modalAriaLabel: '이미지 자르기',
        previewAlt: '자르기 미리보기',
        noImage: '이미지 없음',
        cancel: '취소',
        apply: '적용',
        aspectRatio: '비율',
        aspectRatioLabels: {
          free: '자유',
          square: '1:1',
          fourThree: '4:3',
          threeTwo: '3:2',
          sixteenNine: '16:9',
          twoThree: '2:3',
          threeFour: '3:4',
          nineSixteen: '9:16',
        },
        focalPoint: '초점',
        focalPointPresets: '초점 프리셋',
        focalPointX: '초점 X',
        focalPointY: '초점 Y',
        focalPresetLabels: {
          topLeft: '왼쪽 위',
          top: '위',
          topRight: '오른쪽 위',
          left: '왼쪽',
          center: '가운데',
          right: '오른쪽',
          bottomLeft: '왼쪽 아래',
          bottom: '아래',
          bottomRight: '오른쪽 아래',
        },
        focalPresetAriaLabel: (label) => `초점 ${label}`,
      },
      filterPresets: {
        brightness: '밝기',
        contrast: '대비',
        saturation: '채도',
        blur: '흐림',
        bw: '흑백',
        sepia: '세피아',
      },
      filterPresetLabels: {
        original: '원본',
        bw: '흑백',
        vintage: '빈티지',
        bright: '밝게',
        highContrast: '고대비',
        soft: '부드럽게',
      },
      alt: {
        text: '대체 텍스트',
        placeholder: '접근성과 SEO를 위해 이미지를 설명하세요',
      },
      ai: {
        sectionTitle: 'Image 2.0 편집',
        sectionEyebrow: 'Image 2.0 편집',
        subtitle: '프롬프트로 새 버전 만들기',
        body: '현재 빌더 자산을 기반으로 새 이미지를 만들고, 적용을 누르면 이 이미지로 교체됩니다.',
        previewAltFallback: '이미지 미리보기',
        previewFrame: '미리보기 프레임',
        previewFrameDialog: 'AI 이미지 미리보기 프레임',
        editPrompt: '편집 프롬프트',
        promptPlaceholder: '예: 더 밝고 고급스러운 법률사무소 히어로 이미지로 바꾸고, 텍스트는 넣지 마세요.',
        promptPresets: '프롬프트 프리셋',
        reviewRestored: (filename?: string) => filename ? `검토가 복원되었습니다: ${filename}` : '현재 이미지로 검토가 복원되었습니다.',
        imageEditFailed: '이미지 편집에 실패했습니다.',
        editedImageReady: (filename: string) => `편집한 이미지가 준비되었습니다: ${filename}`,
        brushMaskDescription: '브러시 마스크',
        maskArea: '마스크 영역',
        maskPresets: 'AI 편집 마스크 프리셋',
        fullImage: '전체 이미지',
        brushArea: '브러시 영역',
        feather: '페더',
        edge: '엣지',
        add: '추가',
        erase: '지우기',
        brushSize: '브러시 크기',
        undoStroke: '스트로크 실행 취소',
        clearBrush: '브러시 지우기',
        requiresAssetLibrary: 'AI 편집은 빌더 자산 라이브러리의 이미지가 필요합니다. 먼저 업로드한 에셋으로 이 이미지를 교체하세요.',
        generating: '생성 중...',
        generate: '편집 생성',
        selectedEdit: '선택한 편집본',
        original: '원본',
        undoReview: '검토 되돌리기',
        redoReview: '검토 다시하기',
        clearAiEdit: 'AI 편집 지우기',
        clearedNotice: 'AI 편집 선택이 지워졌습니다. 적용하면 현재 이미지를 유지합니다.',
        current: '현재',
        applyWillReplace: (filename: string) => `적용하면 이미지 소스를 ${filename}으로 교체합니다.`,
        apply: '적용',
        cancel: '취소',
        previewDesktop: '데스크톱',
        previewMobile: '모바일',
        presetLabels: {
          premiumBright: '프리미엄 밝음',
          editorialCalm: '에디토리얼 차분',
          modernContrast: '모던 대비',
        },
        presetPrompts: {
          premiumBright: '텍스트 없이 현실적인 사무실 조명으로 더 밝고 고급스러운 법률 웹사이트 히어로 이미지로 만드세요.',
          editorialCalm: '텍스트 없이 세련된 대비와 따뜻하고 전문적인 조명을 갖춘 차분한 에디토리얼 버전으로 만드세요.',
          modernContrast: '텍스트 없이 정돈된 법률 브랜드 분위기의 현대적이고 대비감 있는 웹사이트 이미지로 만드세요.',
        },
        maskLabels: {
          centerFocus: '중앙 초점',
          topBand: '상단 영역',
          bottomBand: '하단 영역',
          leftDetail: '왼쪽 영역',
          rightDetail: '오른쪽 영역',
        },
        maskDescriptions: {
          centerFocus: '중앙 초점 마스크',
          topBand: '상단 영역 마스크',
          bottomBand: '하단 영역 마스크',
          leftDetail: '왼쪽 영역 마스크',
          rightDetail: '오른쪽 영역 마스크',
        },
      },
    },
  },
  'zh-hant': {
    runtime: {
      fallbackAlt: '圖片',
      imagePlaceholder: '圖片預留位置',
      clickToAddImage: '點擊以新增圖片',
      changeImageOverlay: '更換圖片',
      beforeAfterComparison: '前後比較',
      beforeImageAlt: (imageAlt) => `${imageAlt} 前圖`,
      afterImageAlt: (imageAlt) => `${imageAlt} 後圖`,
      svgIconLabels: {
        scales: '天秤圖示',
        shield: '盾牌圖示',
        building: '建築圖示',
        spark: '星芒圖示',
        'service-0': '成長圖表圖示',
        'service-1': '文件圖示',
        'service-2': '爭議箭頭圖示',
        'service-3': '保護盾牌圖示',
        'service-4': '勾選盾牌圖示',
        'service-5': '辦公室圖示',
        'pricing-consultation': '諮詢圖示',
        'pricing-litigation': '訴訟圖示',
        'pricing-company': '公司設立圖示',
        'pricing-retainer': '法律顧問圖示',
      },
      imageDetailFallback: '圖片詳細資訊',
      popupContentFallback: '媒體彈出內容',
      closeLightbox: '關閉燈箱',
      closePopup: '關閉彈出視窗',
      popupDialogLabel: (imageAlt) => `${imageAlt} 彈出視窗`,
    },
    inspector: {
      openAssetLibrary: '開啟素材庫',
      openImageEditor: '裁切 / 篩選 / Alt',
      sourceUrl: '來源 URL',
      sourceUrlPlaceholder: 'https://example.com/image.jpg',
      altText: '替代文字',
      fit: '符合',
      fitCover: '填滿',
      fitContain: '保持比例',
      clickAction: '點擊動作',
      none: '無',
      link: '連結',
      lightbox: '燈箱',
      popup: '彈出視窗',
      mediaInteractions: '媒體互動',
      hoverSwapImage: '滑過時切換圖片',
      hoverSwapImagePlaceholder: '/images/hover.jpg',
      hotspots: '熱點',
      hotspotsPlaceholder: '42, 55, 預約諮詢, /zh-hant/contact',
      beforeAfter: '前 / 後',
      enableCompareSlider: '啟用比較滑桿',
      beforeImage: '前圖',
      afterImage: '後圖',
      position: '位置',
      svgGif: 'SVG / GIF',
      inlineSvgIcon: '內嵌 SVG 圖示',
      svgShape: 'SVG 形狀',
      svgShapes: {
        scales: '天秤',
        shield: '盾牌',
        building: '建築',
        spark: '星芒',
        'service-0': '服務：成長圖表',
        'service-1': '服務：文件',
        'service-2': '服務：爭議箭頭',
        'service-3': '服務：保護盾牌',
        'service-4': '服務：勾選盾牌',
        'service-5': '服務：辦公室',
        'pricing-consultation': '費用：諮詢',
        'pricing-litigation': '費用：訴訟',
        'pricing-company': '費用：公司設立',
        'pricing-retainer': '費用：法律顧問',
      },
      svgColor: 'SVG 顏色',
      svgColorPlaceholder: '#116dff 或預設的主題權杖',
      gifProvider: 'GIF 來源',
      manualGifUrl: '手動 GIF URL',
      giphySearchNote: 'Giphy 搜尋備註',
      gifSearchQuery: 'GIF 搜尋字詞',
      gifSearchQueryPlaceholder: '法律辦公室',
      cropLabel: '裁切：',
    },
    dialog: {
      ariaLabel: '裁切、篩選與替代文字',
      eyebrow: '圖片設定',
      title: '裁切 / 篩選 / Alt 編輯',
      close: '關閉',
      noImageSource: '沒有圖片來源。',
      filterPanelTitle: '圖片篩選',
      tabs: {
        crop: '裁切',
        filter: '篩選',
        alt: '替代文字',
        ai: 'AI',
      },
      crop: {
        modalTitle: '裁切圖片',
        modalDescription: '選擇此圖片的預覽長寬比。',
        modalAriaLabel: '裁切圖片',
        previewAlt: '裁切預覽',
        noImage: '沒有圖片',
        cancel: '取消',
        apply: '套用',
        aspectRatio: '長寬比',
        aspectRatioLabels: {
          free: '自由',
          square: '1:1',
          fourThree: '4:3',
          threeTwo: '3:2',
          sixteenNine: '16:9',
          twoThree: '2:3',
          threeFour: '3:4',
          nineSixteen: '9:16',
        },
        focalPoint: '焦點',
        focalPointPresets: '焦點預設',
        focalPointX: '焦點 X',
        focalPointY: '焦點 Y',
        focalPresetLabels: {
          topLeft: '左上',
          top: '上方',
          topRight: '右上',
          left: '左側',
          center: '中央',
          right: '右側',
          bottomLeft: '左下',
          bottom: '下方',
          bottomRight: '右下',
        },
        focalPresetAriaLabel: (label) => `焦點${label}`,
      },
      filterPresets: {
        brightness: '亮度',
        contrast: '對比',
        saturation: '飽和度',
        blur: '模糊',
        bw: '黑白',
        sepia: '褐色',
      },
      filterPresetLabels: {
        original: '原始',
        bw: '黑白',
        vintage: '復古',
        bright: '明亮',
        highContrast: '高對比',
        soft: '柔和',
      },
      alt: {
        text: '替代文字',
        placeholder: '請描述圖片以利無障礙與 SEO',
      },
      ai: {
        sectionTitle: 'Image 2.0 編輯',
        sectionEyebrow: 'Image 2.0 編輯',
        subtitle: '用提示詞建立新版本',
        body: '根據目前的建站素材建立新圖片，按下套用後會以此圖片替換。',
        previewAltFallback: '圖片預覽',
        previewFrame: '預覽框',
        previewFrameDialog: 'AI 圖片預覽框',
        editPrompt: '編輯提示詞',
        promptPlaceholder: '例如：改成更明亮、更有高級感的法律事務所首屏圖片，且不要加入文字。',
        promptPresets: '提示詞預設',
        reviewRestored: (filename?: string) => filename ? `檢視已還原：${filename}` : '檢視已還原為目前圖片。',
        imageEditFailed: '圖片編輯失敗。',
        editedImageReady: (filename: string) => `編輯後的圖片已準備好：${filename}`,
        brushMaskDescription: '筆刷遮罩',
        maskArea: '遮罩區域',
        maskPresets: 'AI 編輯遮罩預設',
        fullImage: '整張圖片',
        brushArea: '筆刷區域',
        feather: '羽化',
        edge: '邊緣',
        add: '加入',
        erase: '擦除',
        brushSize: '筆刷大小',
        undoStroke: '復原筆觸',
        clearBrush: '清除筆刷',
        requiresAssetLibrary: 'AI 編輯需要來自建站素材庫的圖片。請先以已上傳的素材替換此圖片。',
        generating: '生成中...',
        generate: '生成編輯',
        selectedEdit: '已選擇的編輯',
        original: '原始',
        undoReview: '復原檢視',
        redoReview: '重做檢視',
        clearAiEdit: '清除 AI 編輯',
        clearedNotice: 'AI 編輯選取已清除。按下套用會保留目前圖片。',
        current: '目前',
        applyWillReplace: (filename: string) => `按下套用後，圖片來源將會替換為 ${filename}。`,
        apply: '套用',
        cancel: '取消',
        previewDesktop: '桌面',
        previewMobile: '行動裝置',
        presetLabels: {
          premiumBright: '高級明亮',
          editorialCalm: '編輯感平靜',
          modernContrast: '現代對比',
        },
        presetPrompts: {
          premiumBright: '請將圖片改成更明亮、更有高級感的法律網站首屏圖片，使用真實辦公室光線，且不要加入文字。',
          editorialCalm: '請建立一個平靜、具編輯感的版本，使用精緻對比、溫暖專業光線，且不要加入文字。',
          modernContrast: '請建立一張現代高對比網站圖片，呈現精緻的法律品牌氛圍，且不要加入文字。',
        },
        maskLabels: {
          centerFocus: '中央焦點',
          topBand: '上方區塊',
          bottomBand: '下方區塊',
          leftDetail: '左側細節',
          rightDetail: '右側細節',
        },
        maskDescriptions: {
          centerFocus: '中央焦點遮罩',
          topBand: '上方區塊遮罩',
          bottomBand: '下方區塊遮罩',
          leftDetail: '左側細節遮罩',
          rightDetail: '右側細節遮罩',
        },
      },
    },
  },
  en: {
    runtime: {
      fallbackAlt: 'Image',
      imagePlaceholder: 'Image placeholder',
      clickToAddImage: 'Click to add image',
      changeImageOverlay: 'Change image',
      beforeAfterComparison: 'Before after comparison',
      beforeImageAlt: (imageAlt) => `${imageAlt} before`,
      afterImageAlt: (imageAlt) => `${imageAlt} after`,
      svgIconLabels: {
        scales: 'Scales icon',
        shield: 'Shield icon',
        building: 'Building icon',
        spark: 'Spark icon',
        'service-0': 'Growth chart icon',
        'service-1': 'Document icon',
        'service-2': 'Dispute arrows icon',
        'service-3': 'Protection shield icon',
        'service-4': 'Check shield icon',
        'service-5': 'Office icon',
        'pricing-consultation': 'Consultation icon',
        'pricing-litigation': 'Litigation icon',
        'pricing-company': 'Company setup icon',
        'pricing-retainer': 'Retainer icon',
      },
      imageDetailFallback: 'Image detail',
      popupContentFallback: 'Media popup content',
      closeLightbox: 'Close lightbox',
      closePopup: 'Close popup',
      popupDialogLabel: (imageAlt) => `${imageAlt} popup`,
    },
    inspector: {
      openAssetLibrary: 'Open asset library',
      openImageEditor: 'Crop / Filter / Alt',
      sourceUrl: 'Source URL',
      sourceUrlPlaceholder: 'https://example.com/image.jpg',
      altText: 'Alt text',
      fit: 'Fit',
      fitCover: 'Cover',
      fitContain: 'Contain',
      clickAction: 'Click action',
      none: 'None',
      link: 'Link',
      lightbox: 'Lightbox',
      popup: 'Popup',
      mediaInteractions: 'Media interactions',
      hoverSwapImage: 'Hover swap image',
      hoverSwapImagePlaceholder: '/images/hover.jpg',
      hotspots: 'Hotspots',
      hotspotsPlaceholder: '42, 55, schedule consultation, /en/contact',
      beforeAfter: 'Before / after',
      enableCompareSlider: 'Enable compare slider',
      beforeImage: 'Before image',
      afterImage: 'After image',
      position: 'Position',
      svgGif: 'SVG / GIF',
      inlineSvgIcon: 'Inline SVG icon',
      svgShape: 'SVG shape',
      svgShapes: {
        scales: 'Scales',
        shield: 'Shield',
        building: 'Building',
        spark: 'Spark',
        'service-0': 'Service: growth chart',
        'service-1': 'Service: document',
        'service-2': 'Service: dispute arrows',
        'service-3': 'Service: protection shield',
        'service-4': 'Service: check shield',
        'service-5': 'Service: office',
        'pricing-consultation': 'Pricing: consultation',
        'pricing-litigation': 'Pricing: litigation',
        'pricing-company': 'Pricing: company setup',
        'pricing-retainer': 'Pricing: retainer',
      },
      svgColor: 'SVG color',
      svgColorPlaceholder: '#116dff or theme token via preset',
      gifProvider: 'GIF provider',
      manualGifUrl: 'Manual GIF URL',
      giphySearchNote: 'Giphy search note',
      gifSearchQuery: 'GIF search query',
      gifSearchQueryPlaceholder: 'law office',
      cropLabel: 'Crop:',
    },
    dialog: {
      ariaLabel: 'Crop, filter, and alt text',
      eyebrow: 'Image settings',
      title: 'Crop / Filter / Alt edit',
      close: 'Close',
      noImageSource: 'No image source.',
      filterPanelTitle: 'Image filter',
      tabs: {
        crop: 'crop',
        filter: 'filter',
        alt: 'alt',
        ai: 'ai',
      },
      crop: {
        modalTitle: 'Crop image',
        modalDescription: 'Choose a preview aspect ratio for this image.',
        modalAriaLabel: 'Crop image',
        previewAlt: 'Crop preview',
        noImage: 'No image',
        cancel: 'Cancel',
        apply: 'Apply',
        aspectRatio: 'Aspect ratio',
        aspectRatioLabels: {
          free: 'Free',
          square: '1:1',
          fourThree: '4:3',
          threeTwo: '3:2',
          sixteenNine: '16:9',
          twoThree: '2:3',
          threeFour: '3:4',
          nineSixteen: '9:16',
        },
        focalPoint: 'Focal point',
        focalPointPresets: 'Focal point presets',
        focalPointX: 'Focal point X',
        focalPointY: 'Focal point Y',
        focalPresetLabels: {
          topLeft: 'Top left',
          top: 'Top',
          topRight: 'Top right',
          left: 'Left',
          center: 'Center',
          right: 'Right',
          bottomLeft: 'Bottom left',
          bottom: 'Bottom',
          bottomRight: 'Bottom right',
        },
        focalPresetAriaLabel: (label) => `Focal point ${label}`,
      },
      filterPresets: {
        brightness: 'Brightness',
        contrast: 'Contrast',
        saturation: 'Saturation',
        blur: 'Blur',
        bw: 'B&W',
        sepia: 'Sepia',
      },
      filterPresetLabels: {
        original: 'Original',
        bw: 'B&W',
        vintage: 'Vintage',
        bright: 'Bright',
        highContrast: 'High contrast',
        soft: 'Soft',
      },
      alt: {
        text: 'Alt text',
        placeholder: 'Describe the image for accessibility and SEO',
      },
      ai: {
        sectionTitle: 'Image 2.0 edit',
        sectionEyebrow: 'Image 2.0 edit',
        subtitle: 'Create a new version from a prompt',
        body: 'Create a new image from the current builder asset, then click Apply to replace this image.',
        previewAltFallback: 'Image preview',
        previewFrame: 'Preview frame',
        previewFrameDialog: 'AI image preview frame',
        editPrompt: 'Edit prompt',
        promptPlaceholder: 'Example: make this a brighter premium law office hero image, with no text.',
        promptPresets: 'Prompt presets',
        reviewRestored: (filename?: string) => filename ? `Review restored: ${filename}` : 'Review restored to the current image.',
        imageEditFailed: 'Image edit failed.',
        editedImageReady: (filename: string) => `Edited image ready: ${filename}`,
        brushMaskDescription: 'Brush mask',
        maskArea: 'Mask area',
        maskPresets: 'AI edit mask presets',
        fullImage: 'Full image',
        brushArea: 'Brush area',
        feather: 'Feather',
        edge: 'Edge',
        add: 'Add',
        erase: 'Erase',
        brushSize: 'Brush size',
        undoStroke: 'Undo stroke',
        clearBrush: 'Clear brush',
        requiresAssetLibrary: 'AI edit requires an image from the builder asset library. Replace this image with an uploaded asset first.',
        generating: 'Generating...',
        generate: 'Generate edit',
        selectedEdit: 'Selected edit',
        original: 'Original',
        undoReview: 'Undo review',
        redoReview: 'Redo review',
        clearAiEdit: 'Clear AI edit',
        clearedNotice: 'AI edit selection cleared. Apply will keep the current image.',
        current: 'Current',
        applyWillReplace: (filename: string) => `Apply will replace the image source with ${filename}.`,
        apply: 'Apply',
        cancel: 'Cancel',
        previewDesktop: 'Desktop',
        previewMobile: 'Mobile',
        presetLabels: {
          premiumBright: 'Premium bright',
          editorialCalm: 'Editorial calm',
          modernContrast: 'Modern contrast',
        },
        presetPrompts: {
          premiumBright: 'Make this a brighter premium legal website hero image with realistic office lighting and no text.',
          editorialCalm: 'Create a calm editorial version with refined contrast, warm professional lighting, and no text.',
          modernContrast: 'Create a modern high-contrast website image with polished legal brand atmosphere and no text.',
        },
        maskLabels: {
          centerFocus: 'Center focus',
          topBand: 'Top band',
          bottomBand: 'Bottom band',
          leftDetail: 'Left detail',
          rightDetail: 'Right detail',
        },
        maskDescriptions: {
          centerFocus: 'Center focus mask',
          topBand: 'Top band mask',
          bottomBand: 'Bottom band mask',
          leftDetail: 'Left detail mask',
          rightDetail: 'Right detail mask',
        },
      },
    },
  },
} as const;

export function getImageEditCopy(locale?: Locale | string | null): ImageEditCopy {
  if (locale === 'ko') return IMAGE_EDIT_COPY.ko;
  if (locale === 'zh-hant') return IMAGE_EDIT_COPY['zh-hant'];
  return IMAGE_EDIT_COPY.en;
}
