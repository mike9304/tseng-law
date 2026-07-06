import type { Locale } from '@/lib/locales';

export interface RepeaterTemplateCopy {
  childBadge: {
    ariaLabel: string;
    duplicateGroupActionAriaLabel: (recordNumber: number) => string;
    duplicateGroupActionLabel: string;
    groupSiblingsActionAriaLabel: (count: number, recordNumber: number) => string;
    groupSiblingsActionLabel: string;
    label: string;
    lockActionAriaLabel: (recordNumber: number) => string;
    lockActionLabel: string;
    lockedLabel: string;
    previewEmptyValue: string;
    previewValueLabel: string;
    recordPrefix: string;
    renameGroupAriaLabel: (recordNumber: number) => string;
    renameGroupPlaceholder: string;
    selectParentAriaLabel: (recordNumber: number) => string;
    ungroupActionAriaLabel: (recordNumber: number) => string;
    ungroupActionLabel: string;
    unlockActionAriaLabel: (recordNumber: number) => string;
    unlockActionLabel: string;
  };
  warning: {
    ariaLabel: string;
    label: string;
  };
  hud: {
    statusBound: (bound: number, total: number) => string;
    recordOf: (recordNumber: number, total: number) => string;
    noMatchingRecords: string;
    checkFilters: string;
    fieldMappingsAriaLabel: string;
    loadingRecords: string;
    lockedLabel: string;
    selectFieldChildAriaLabel: (kindLabel: string, fieldId: string) => string;
    previousRecordAriaLabel: string;
    nextRecordAriaLabel: string;
    selectFirstBoundChildAriaLabel: string;
    duplicateChildAriaLabel: string;
    addTextAriaLabel: string;
    addImageAriaLabel: string;
    addButtonAriaLabel: string;
    addGalleryAriaLabel: string;
    prev: string;
    next: string;
    edit: string;
    duplicate: string;
    text: string;
    image: string;
    button: string;
    gallery: string;
  };
  fallbackText: string;
}

export function getRepeaterTemplateCopy(locale: Locale): RepeaterTemplateCopy {
  if (locale === 'ko') {
    return {
      childBadge: {
        ariaLabel: '리피터 템플릿 자식',
        duplicateGroupActionAriaLabel: (recordNumber) => `템플릿 필드 그룹 복제, 레코드 ${recordNumber}`,
        duplicateGroupActionLabel: '그룹 복제',
        groupSiblingsActionAriaLabel: (count, recordNumber) =>
          `잠금 해제된 템플릿 자식 ${count}개 묶기, 레코드 ${recordNumber}`,
        groupSiblingsActionLabel: '필드 묶기',
        label: '템플릿 자식',
        lockActionAriaLabel: (recordNumber) => `템플릿 자식 잠금, 레코드 ${recordNumber}`,
        lockActionLabel: '잠금',
        lockedLabel: '잠김',
        previewEmptyValue: '비어 있음',
        previewValueLabel: '미리보기',
        recordPrefix: '상위 데이터의 레코드',
        renameGroupAriaLabel: (recordNumber) => `템플릿 필드 그룹 이름 변경, 레코드 ${recordNumber}`,
        renameGroupPlaceholder: '그룹 이름',
        selectParentAriaLabel: (recordNumber) => `상위 리피터 선택, 레코드 ${recordNumber}`,
        ungroupActionAriaLabel: (recordNumber) => `묶인 템플릿 자식 그룹 해제, 레코드 ${recordNumber}`,
        ungroupActionLabel: '그룹 해제',
        unlockActionAriaLabel: (recordNumber) => `템플릿 자식 잠금 해제, 레코드 ${recordNumber}`,
        unlockActionLabel: '해제',
      },
      warning: {
        ariaLabel: '데이터셋 바인딩 주의 필요',
        label: '데이터셋 필드 누락',
      },
      hud: {
        statusBound: (bound, total) => `템플릿 ${bound}/${total}개 연결됨`,
        recordOf: (recordNumber, total) => `레코드 ${recordNumber} / ${total}`,
        noMatchingRecords: '일치하는 레코드가 없습니다',
        checkFilters: '데이터셋 필터와 CMS 레코드를 확인하세요',
        fieldMappingsAriaLabel: '리피터 템플릿 필드 매핑',
        loadingRecords: 'CMS 레코드를 불러오는 중',
        lockedLabel: '잠김',
        selectFieldChildAriaLabel: (kindLabel, fieldId) => `${kindLabel} ${fieldId} 템플릿 자식 선택`,
        previousRecordAriaLabel: '이전 데이터셋 레코드 미리보기',
        nextRecordAriaLabel: '다음 데이터셋 레코드 미리보기',
        selectFirstBoundChildAriaLabel: '첫 번째 바인딩된 템플릿 자식 선택',
        duplicateChildAriaLabel: '첫 번째 바인딩된 템플릿 자식 복제',
        addTextAriaLabel: '리피터 템플릿에 바인딩 텍스트 추가',
        addImageAriaLabel: '리피터 템플릿에 바인딩 이미지 추가',
        addButtonAriaLabel: '리피터 템플릿에 바인딩 버튼 추가',
        addGalleryAriaLabel: '리피터 템플릿에 바인딩 갤러리 추가',
        prev: '이전',
        next: '다음',
        edit: '편집',
        duplicate: '복제',
        text: '텍스트',
        image: '이미지',
        button: '버튼',
        gallery: '갤러리',
      },
      fallbackText: '바인딩 텍스트',
    };
  }
  if (locale === 'zh-hant') {
    return {
      childBadge: {
        ariaLabel: '重複器範本子項',
        duplicateGroupActionAriaLabel: (recordNumber) => `複製記錄 ${recordNumber} 的範本欄位群組`,
        duplicateGroupActionLabel: '複製群組',
        groupSiblingsActionAriaLabel: (count, recordNumber) =>
          `群組記錄 ${recordNumber} 的 ${count} 個未鎖定範本子項`,
        groupSiblingsActionLabel: '群組欄位',
        label: '範本子項',
        lockActionAriaLabel: (recordNumber) => `鎖定記錄 ${recordNumber} 的範本子項`,
        lockActionLabel: '鎖定',
        lockedLabel: '鎖定',
        previewEmptyValue: '空白',
        previewValueLabel: '預覽',
        recordPrefix: '來自父層的記錄',
        renameGroupAriaLabel: (recordNumber) => `重新命名記錄 ${recordNumber} 的範本欄位群組`,
        renameGroupPlaceholder: '群組名稱',
        selectParentAriaLabel: (recordNumber) => `選取父層重複器，記錄 ${recordNumber}`,
        ungroupActionAriaLabel: (recordNumber) => `取消群組記錄 ${recordNumber} 的範本子項`,
        ungroupActionLabel: '取消群組',
        unlockActionAriaLabel: (recordNumber) => `解除鎖定記錄 ${recordNumber} 的範本子項`,
        unlockActionLabel: '解除',
      },
      warning: {
        ariaLabel: '資料集綁定需注意',
        label: '缺少資料集欄位',
      },
      hud: {
        statusBound: (bound, total) => `範本已連結 ${bound}/${total} 個`,
        recordOf: (recordNumber, total) => `記錄 ${recordNumber} / ${total}`,
        noMatchingRecords: '沒有相符的記錄',
        checkFilters: '請檢查資料集篩選條件與 CMS 記錄',
        fieldMappingsAriaLabel: '重複器範本欄位對應',
        loadingRecords: '正在載入 CMS 記錄',
        lockedLabel: '鎖定',
        selectFieldChildAriaLabel: (kindLabel, fieldId) => `選取 ${kindLabel} ${fieldId} 範本子項`,
        previousRecordAriaLabel: '預覽前一筆資料集記錄',
        nextRecordAriaLabel: '預覽下一筆資料集記錄',
        selectFirstBoundChildAriaLabel: '選取第一個已綁定的範本子項',
        duplicateChildAriaLabel: '複製第一個已綁定的範本子項',
        addTextAriaLabel: '將綁定文字加入重複器範本',
        addImageAriaLabel: '將綁定圖片加入重複器範本',
        addButtonAriaLabel: '將綁定按鈕加入重複器範本',
        addGalleryAriaLabel: '將綁定圖庫加入重複器範本',
        prev: '上一筆',
        next: '下一筆',
        edit: '編輯',
        duplicate: '複製',
        text: '文字',
        image: '圖片',
        button: '按鈕',
        gallery: '圖庫',
      },
      fallbackText: '綁定文字',
    };
  }
  return {
    childBadge: {
      ariaLabel: 'Repeater template child',
      duplicateGroupActionAriaLabel: (recordNumber) => `Duplicate template field group for Record ${recordNumber}`,
      duplicateGroupActionLabel: 'Duplicate group',
      groupSiblingsActionAriaLabel: (count, recordNumber) =>
        `Group ${count} unlocked template children for Record ${recordNumber}`,
      groupSiblingsActionLabel: 'Group fields',
      label: 'Template child',
      lockActionAriaLabel: (recordNumber) => `Lock template child for Record ${recordNumber}`,
      lockActionLabel: 'Lock',
      lockedLabel: 'Locked',
      previewEmptyValue: 'Empty',
      previewValueLabel: 'Preview',
      recordPrefix: 'Record',
      renameGroupAriaLabel: (recordNumber) => `Rename template field group for Record ${recordNumber}`,
      renameGroupPlaceholder: 'Group name',
      selectParentAriaLabel: (recordNumber) => `Select parent repeater for Record ${recordNumber}`,
      ungroupActionAriaLabel: (recordNumber) => `Ungroup template children for Record ${recordNumber}`,
      ungroupActionLabel: 'Ungroup',
      unlockActionAriaLabel: (recordNumber) => `Unlock template child for Record ${recordNumber}`,
      unlockActionLabel: 'Unlock',
    },
    warning: {
      ariaLabel: 'Dataset binding needs attention',
      label: 'Dataset field missing',
    },
    hud: {
      statusBound: (bound, total) => `Template ${bound}/${total} bound`,
      recordOf: (recordNumber, total) => `Record ${recordNumber} of ${total}`,
      noMatchingRecords: 'No matching records',
      checkFilters: 'Check dataset filters and CMS records',
      fieldMappingsAriaLabel: 'Repeater template field mappings',
      loadingRecords: 'Loading CMS records',
      lockedLabel: 'Locked',
      selectFieldChildAriaLabel: (kindLabel, fieldId) => `Select ${kindLabel} ${fieldId} template child`,
      previousRecordAriaLabel: 'Preview previous dataset record',
      nextRecordAriaLabel: 'Preview next dataset record',
      selectFirstBoundChildAriaLabel: 'Select first bound template child',
      duplicateChildAriaLabel: 'Duplicate first bound template child',
      addTextAriaLabel: 'Add bound text to repeater template',
      addImageAriaLabel: 'Add bound image to repeater template',
      addButtonAriaLabel: 'Add bound button to repeater template',
      addGalleryAriaLabel: 'Add bound gallery to repeater template',
      prev: 'Prev',
      next: 'Next',
      edit: 'Edit',
      duplicate: 'Duplicate',
      text: 'Text',
      image: 'Image',
      button: 'Button',
      gallery: 'Gallery',
    },
    fallbackText: 'Bound text',
  };
}
