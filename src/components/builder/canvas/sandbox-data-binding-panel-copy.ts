import type { BuilderDataBindingFieldMap } from '@/lib/builder/canvas/types';
import type { BuilderDatasetSortDirection } from '@/lib/builder/types';
import type { Locale } from '@/lib/locales';

export type DataBindingBindableNodeKind = 'text' | 'heading' | 'image' | 'button' | 'gallery' | 'container';

export interface DataBindingFieldControl {
  key: keyof BuilderDataBindingFieldMap;
  label: string;
  hint: string;
}

export type SandboxDataBindingPanelCopy = {
  fieldControlsByKind: Record<DataBindingBindableNodeKind, DataBindingFieldControl[]>;
  sectionLabel: string;
  sectionTitle: string;
  staleNotice: string;
  enabledNotice: string;
  disabledNotice: string;
  connectedTo: (targetTitle: string) => string;
  collectionSummary: (collectionId: string) => string;
  limitSummary: (limit: number | undefined) => string;
  filterSummary: (summary: string) => string;
  sortSummary: (summary: string) => string;
  publishedRuntimeApplied: string;
  staleWarningTitle: string;
  staleWarningBody: string;
  useDataLabel: string;
  useDataHint: string;
  toggleBindingAriaLabel: string;
  datasetLabel: string;
  datasetHint: string;
  previewLabel: string;
  previewHint: string;
  previewHelper: string;
  recordLabel: string;
  recordHint: string;
  recordNumberAriaLabel: string;
  previewModeInherited: string;
  previewModeDirect: string;
  recordPosition: (recordNumber: number, total: number) => string;
  emptyValue: string;
  noSampleRecordsNotice: string;
  repeaterPreviewTitle: string;
  repeaterPreviewEnabledDescription: string;
  repeaterPreviewDisabledDescription: string;
  repeaterPreviewLoadingStatus: string;
  repeaterPreviewLoadingAriaLabel: string;
  repeaterPreviewEmptyMessage: string;
  repeaterPreviewVisibleSummary: (visibleCount: number, totalCount: number) => string;
  repeaterPreviewSwitcherAriaLabel: string;
  repeaterComparisonAriaLabel: string;
  repeaterComparisonTitle: string;
  repeaterComparisonPrimaryFallback: string;
  notBoundOption: string;
  missingFieldOption: (fieldId: string) => string;
  repeaterTemplateReadyNotice: (count: number) => string;
  repeaterTemplateEmptyNotice: string;
  repeaterTemplateBoundStatus: (count: number) => string;
  repeaterTemplateUnboundStatus: string;
  repeaterChildBindingMapAriaLabel: string;
  replaceChildTemplateBindingsLabel: string;
  bindChildTemplateLabel: string;
  fieldFallbackLabel: string;
  noneSummary: string;
  activeFilterSummary: (count: number) => string;
  containsOperatorLabel: string;
  sortRuleSummary: (count: number) => string;
  sortDirectionLabel: (direction: BuilderDatasetSortDirection) => string;
  childMappingTextLabel: string;
  childMappingImageSourceLabel: string;
  childMappingLinkLabel: string;
  childMappingCopyLabel: string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', SandboxDataBindingPanelCopy> = {
  ko: {
    fieldControlsByKind: {
      text: [
        { key: 'text', label: '텍스트', hint: '콘텐츠' },
        { key: 'href', label: '링크', hint: 'href' },
      ],
      heading: [
        { key: 'text', label: '텍스트', hint: '콘텐츠' },
      ],
      image: [
        { key: 'src', label: '이미지', hint: 'src' },
        { key: 'alt', label: '대체 텍스트', hint: '텍스트' },
        { key: 'href', label: '링크', hint: 'href' },
      ],
      gallery: [
        { key: 'src', label: '이미지', hint: 'src' },
        { key: 'alt', label: '대체 텍스트', hint: '텍스트' },
        { key: 'caption', label: '캡션', hint: '텍스트' },
      ],
      container: [
        { key: 'title', label: '아이템 제목', hint: '텍스트' },
        { key: 'description', label: '아이템 본문', hint: '텍스트' },
        { key: 'src', label: '아이템 이미지', hint: 'src' },
      ],
      button: [
        { key: 'label', label: '라벨', hint: '텍스트' },
        { key: 'href', label: '링크', hint: 'href' },
      ],
    },
    sectionLabel: '데이터',
    sectionTitle: '필드 바인딩',
    staleNotice: '게시 전 데이터셋 바인딩 확인이 필요합니다.',
    enabledNotice: '이 요소는 게시/런타임에서 데이터셋 필드를 사용합니다.',
    disabledNotice: '이 요소를 홈 인사이트 또는 서비스 레코드에 연결합니다.',
    connectedTo: (targetTitle) => `연결됨: ${targetTitle}`,
    collectionSummary: (collectionId) => `컬렉션: ${collectionId}`,
    limitSummary: (limit) => `제한: ${limit ?? '전체'}`,
    filterSummary: (summary) => `필터: ${summary}`,
    sortSummary: (summary) => `정렬: ${summary}`,
    publishedRuntimeApplied: '게시 런타임: 적용됨',
    staleWarningTitle: '누락되었거나 호환되지 않는 필드',
    staleWarningBody: '아래에서 대체 필드를 선택하거나 해당 행을 바인딩 안 함으로 설정하세요.',
    useDataLabel: '데이터 사용',
    useDataHint: '데이터셋',
    toggleBindingAriaLabel: '데이터셋 필드 바인딩 토글',
    datasetLabel: '데이터셋',
    datasetHint: '소스',
    previewLabel: '미리보기',
    previewHint: '레코드',
    previewHelper: '에디터 미리보기 레코드만 전환합니다. CMS 데이터는 편집하지 않습니다.',
    recordLabel: '레코드',
    recordHint: '행',
    recordNumberAriaLabel: '데이터셋 레코드 번호',
    previewModeInherited:
      '부모 리피터에서 상속한 CMS 레코드 데이터를 미리보는 중입니다. 템플릿 콘텐츠는 계속 편집할 수 있으며, 레코드 데이터는 여기서 읽기 전용입니다.',
    previewModeDirect:
      'CMS 레코드 데이터를 미리보는 중입니다. 템플릿 콘텐츠는 계속 편집할 수 있으며, 레코드 데이터는 여기서 읽기 전용입니다.',
    recordPosition: (recordNumber, total) => `레코드 ${recordNumber} / ${total}`,
    emptyValue: '비어 있음',
    noSampleRecordsNotice: '이 데이터셋 미리보기에 사용할 샘플 레코드가 없습니다.',
    repeaterPreviewTitle: '리피터 미리보기',
    repeaterPreviewEnabledDescription: '리피터 템플릿을 편집하기 전에 가까운 CMS 레코드를 오가며 확인합니다.',
    repeaterPreviewDisabledDescription: '리피터 레코드를 확인하려면 데이터셋을 켜세요.',
    repeaterPreviewLoadingStatus: 'CMS 레코드를 불러오는 중입니다...',
    repeaterPreviewLoadingAriaLabel: '리피터 미리보기 로딩',
    repeaterPreviewEmptyMessage: '이 컬렉션에 표시할 레코드가 없습니다. CMS에서 레코드를 추가하면 미리보기가 나타납니다.',
    repeaterPreviewVisibleSummary: (visibleCount, totalCount) => `${totalCount}개 레코드 중 ${visibleCount}개 표시`,
    repeaterPreviewSwitcherAriaLabel: '리피터 미리보기 레코드 전환',
    repeaterComparisonAriaLabel: '리피터 레코드 비교',
    repeaterComparisonTitle: '레코드 비교',
    repeaterComparisonPrimaryFallback: '기본',
    notBoundOption: '바인딩 안 함',
    missingFieldOption: (fieldId) => `누락된 필드: ${fieldId}`,
    repeaterTemplateReadyNotice: (count) => `이 리피터에는 데이터셋 바인딩 준비가 된 템플릿 자식 ${count}개가 있습니다.`,
    repeaterTemplateEmptyNotice: '반복 가능한 템플릿을 만들려면 이 리피터 안에 자식 요소를 추가하세요.',
    repeaterTemplateBoundStatus: (count) => `템플릿 자식 ${count}개 바인딩됨`,
    repeaterTemplateUnboundStatus: '아직 바인딩된 템플릿 자식이 없습니다',
    repeaterChildBindingMapAriaLabel: '리피터 자식 바인딩 맵',
    replaceChildTemplateBindingsLabel: '자식 템플릿 바인딩 교체',
    bindChildTemplateLabel: '자식 템플릿 바인딩',
    fieldFallbackLabel: '필드',
    noneSummary: '없음',
    activeFilterSummary: (count) => `${count}개 활성`,
    containsOperatorLabel: '포함',
    sortRuleSummary: (count) => `${count}개 규칙`,
    sortDirectionLabel: (direction) => direction === 'asc' ? '오름차순' : '내림차순',
    childMappingTextLabel: '텍스트 / 제목 / 버튼 라벨',
    childMappingImageSourceLabel: '이미지 소스',
    childMappingLinkLabel: '버튼 / 이미지 링크',
    childMappingCopyLabel: '카드 본문 / 갤러리 캡션',
  },
  'zh-hant': {
    fieldControlsByKind: {
      text: [
        { key: 'text', label: '文字', hint: '內容' },
        { key: 'href', label: '連結', hint: 'href' },
      ],
      heading: [
        { key: 'text', label: '文字', hint: '內容' },
      ],
      image: [
        { key: 'src', label: '圖片', hint: 'src' },
        { key: 'alt', label: '替代文字', hint: '文字' },
        { key: 'href', label: '連結', hint: 'href' },
      ],
      gallery: [
        { key: 'src', label: '圖片', hint: 'src' },
        { key: 'alt', label: '替代文字', hint: '文字' },
        { key: 'caption', label: '說明文字', hint: '文字' },
      ],
      container: [
        { key: 'title', label: '項目標題', hint: '文字' },
        { key: 'description', label: '項目內文', hint: '文字' },
        { key: 'src', label: '項目圖片', hint: 'src' },
      ],
      button: [
        { key: 'label', label: '標籤', hint: '文字' },
        { key: 'href', label: '連結', hint: 'href' },
      ],
    },
    sectionLabel: '資料',
    sectionTitle: '欄位綁定',
    staleNotice: '發布前需要檢查資料集綁定。',
    enabledNotice: '此元素會在發布或執行時使用資料集欄位。',
    disabledNotice: '將此元素綁定到首頁洞察或服務記錄。',
    connectedTo: (targetTitle) => `已連線至：${targetTitle}`,
    collectionSummary: (collectionId) => `集合：${collectionId}`,
    limitSummary: (limit) => `限制：${limit ?? '全部'}`,
    filterSummary: (summary) => `篩選：${summary}`,
    sortSummary: (summary) => `排序：${summary}`,
    publishedRuntimeApplied: '發布執行時：已套用',
    staleWarningTitle: '缺少或不相容的欄位',
    staleWarningBody: '請在下方選擇替代欄位，或將該列設為未綁定。',
    useDataLabel: '使用資料',
    useDataHint: '資料集',
    toggleBindingAriaLabel: '切換資料集欄位綁定',
    datasetLabel: '資料集',
    datasetHint: '來源',
    previewLabel: '預覽',
    previewHint: '記錄',
    previewHelper: '只會切換編輯器預覽記錄，不會編輯 CMS 資料。',
    recordLabel: '記錄',
    recordHint: '列',
    recordNumberAriaLabel: '資料集記錄編號',
    previewModeInherited:
      '正在預覽從父層重複器繼承的 CMS 記錄資料。範本內容仍可編輯；此處的記錄資料為唯讀。',
    previewModeDirect:
      '正在預覽 CMS 記錄資料。範本內容仍可編輯；此處的記錄資料為唯讀。',
    recordPosition: (recordNumber, total) => `記錄 ${recordNumber} / ${total}`,
    emptyValue: '空白',
    noSampleRecordsNotice: '此資料集預覽沒有可用的範例記錄。',
    repeaterPreviewTitle: '重複器預覽',
    repeaterPreviewEnabledDescription: '編輯重複器範本前，可先切換附近的 CMS 記錄查看。',
    repeaterPreviewDisabledDescription: '啟用資料集即可檢查重複器記錄。',
    repeaterPreviewLoadingStatus: '正在載入 CMS 記錄...',
    repeaterPreviewLoadingAriaLabel: '重複器預覽載入中',
    repeaterPreviewEmptyMessage: '此集合沒有可顯示的記錄。請在 CMS 新增記錄後再預覽。',
    repeaterPreviewVisibleSummary: (visibleCount, totalCount) => `顯示 ${totalCount} 筆記錄中的 ${visibleCount} 筆`,
    repeaterPreviewSwitcherAriaLabel: '切換重複器預覽記錄',
    repeaterComparisonAriaLabel: '重複器記錄比較',
    repeaterComparisonTitle: '記錄比較',
    repeaterComparisonPrimaryFallback: '主要',
    notBoundOption: '未綁定',
    missingFieldOption: (fieldId) => `缺少欄位：${fieldId}`,
    repeaterTemplateReadyNotice: (count) => `此重複器有 ${count} 個範本子元素已準備好進行資料集綁定。`,
    repeaterTemplateEmptyNotice: '請在此重複器中加入子元素，以建立可重複的範本。',
    repeaterTemplateBoundStatus: (count) => `已綁定 ${count} 個範本子元素`,
    repeaterTemplateUnboundStatus: '尚未綁定任何範本子元素',
    repeaterChildBindingMapAriaLabel: '重複器子元素綁定對應',
    replaceChildTemplateBindingsLabel: '取代子範本綁定',
    bindChildTemplateLabel: '綁定子範本',
    fieldFallbackLabel: '欄位',
    noneSummary: '無',
    activeFilterSummary: (count) => `${count} 個啟用中`,
    containsOperatorLabel: '包含',
    sortRuleSummary: (count) => `${count} 個規則`,
    sortDirectionLabel: (direction) => direction === 'asc' ? '遞增' : '遞減',
    childMappingTextLabel: '文字 / 標題 / 按鈕標籤',
    childMappingImageSourceLabel: '圖片來源',
    childMappingLinkLabel: '按鈕 / 圖片連結',
    childMappingCopyLabel: '卡片內文 / 圖庫說明',
  },
  en: {
    fieldControlsByKind: {
      text: [
        { key: 'text', label: 'Text', hint: 'content' },
        { key: 'href', label: 'Link', hint: 'href' },
      ],
      heading: [
        { key: 'text', label: 'Text', hint: 'content' },
      ],
      image: [
        { key: 'src', label: 'Image', hint: 'src' },
        { key: 'alt', label: 'Alt', hint: 'text' },
        { key: 'href', label: 'Link', hint: 'href' },
      ],
      gallery: [
        { key: 'src', label: 'Images', hint: 'src' },
        { key: 'alt', label: 'Alt', hint: 'text' },
        { key: 'caption', label: 'Caption', hint: 'text' },
      ],
      container: [
        { key: 'title', label: 'Item title', hint: 'text' },
        { key: 'description', label: 'Item copy', hint: 'text' },
        { key: 'src', label: 'Item image', hint: 'src' },
      ],
      button: [
        { key: 'label', label: 'Label', hint: 'text' },
        { key: 'href', label: 'Link', hint: 'href' },
      ],
    },
    sectionLabel: 'Data',
    sectionTitle: 'Field binding',
    staleNotice: 'Dataset binding needs attention before publishing.',
    enabledNotice: 'This element uses dataset fields at publish/runtime.',
    disabledNotice: 'Bind this element to home insights or service records.',
    connectedTo: (targetTitle) => `Connected to: ${targetTitle}`,
    collectionSummary: (collectionId) => `Collection: ${collectionId}`,
    limitSummary: (limit) => `Limit: ${limit ?? 'all'}`,
    filterSummary: (summary) => `Filter: ${summary}`,
    sortSummary: (summary) => `Sort: ${summary}`,
    publishedRuntimeApplied: 'Published runtime: applied',
    staleWarningTitle: 'Missing or incompatible field',
    staleWarningBody: 'Choose a replacement field below, or set the row to Not bound.',
    useDataLabel: 'Use data',
    useDataHint: 'dataset',
    toggleBindingAriaLabel: 'Toggle dataset field binding',
    datasetLabel: 'Dataset',
    datasetHint: 'source',
    previewLabel: 'Preview',
    previewHint: 'record',
    previewHelper: 'Switches only the editor preview record. It does not edit CMS data.',
    recordLabel: 'Record',
    recordHint: 'row',
    recordNumberAriaLabel: 'Dataset record number',
    previewModeInherited:
      'Previewing CMS record data inherited from the parent repeater. Template content remains editable; record data is read-only here.',
    previewModeDirect:
      'Previewing CMS record data. Template content remains editable; record data is read-only here.',
    recordPosition: (recordNumber, total) => `Record ${recordNumber} of ${total}`,
    emptyValue: 'Empty',
    noSampleRecordsNotice: 'No sample records are available for this dataset preview.',
    repeaterPreviewTitle: 'Repeater preview',
    repeaterPreviewEnabledDescription: 'Switch across nearby CMS records before editing the repeater template.',
    repeaterPreviewDisabledDescription: 'Enable the dataset to inspect repeater records.',
    repeaterPreviewLoadingStatus: 'Loading CMS records...',
    repeaterPreviewLoadingAriaLabel: 'Repeater preview loading',
    repeaterPreviewEmptyMessage: 'No records are available for this collection. Add records in the CMS to preview them here.',
    repeaterPreviewVisibleSummary: (visibleCount, totalCount) => `${visibleCount} of ${totalCount} records shown`,
    repeaterPreviewSwitcherAriaLabel: 'Switch repeater preview record',
    repeaterComparisonAriaLabel: 'Repeater record comparison',
    repeaterComparisonTitle: 'Record comparison',
    repeaterComparisonPrimaryFallback: 'Primary',
    notBoundOption: 'Not bound',
    missingFieldOption: (fieldId) => `Missing field: ${fieldId}`,
    repeaterTemplateReadyNotice: (count) =>
      `This repeater has ${count} template child${count === 1 ? '' : 'ren'} ready for dataset binding.`,
    repeaterTemplateEmptyNotice: 'Add child elements inside this repeater to create a repeatable template.',
    repeaterTemplateBoundStatus: (count) => `${count} template child${count === 1 ? '' : 'ren'} bound`,
    repeaterTemplateUnboundStatus: 'No template children bound yet',
    repeaterChildBindingMapAriaLabel: 'Repeater child binding map',
    replaceChildTemplateBindingsLabel: 'Replace child template bindings',
    bindChildTemplateLabel: 'Bind child template',
    fieldFallbackLabel: 'field',
    noneSummary: 'none',
    activeFilterSummary: (count) => `${count} active`,
    containsOperatorLabel: 'contains',
    sortRuleSummary: (count) => `${count} rules`,
    sortDirectionLabel: (direction) => direction.toUpperCase(),
    childMappingTextLabel: 'Text / heading / button label',
    childMappingImageSourceLabel: 'Image source',
    childMappingLinkLabel: 'Button / image link',
    childMappingCopyLabel: 'Card copy / gallery caption',
  },
};

export function getSandboxDataBindingPanelCopy(locale: Locale): SandboxDataBindingPanelCopy {
  return COPY[locale] ?? COPY.en;
}
