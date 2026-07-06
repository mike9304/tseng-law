import type { Locale } from '@/lib/locales';

export interface InspectorControlsCopy {
  mixedValuesLabel: string;
  mixedValuesTitle: string;
  viewportOverrideTitle: string;
  colorPicker: string;
  adjustValue: string;
  decrease: string;
  increase: string;
  disableSetting: string;
  enableSetting: string;
  advanced: string;
  hide: string;
  show: string;
  mixed: string;
  themeBinding: string;
  linked: string;
  detached: string;
  custom: string;
  detachedColor: string;
  customColor: string;
  boundTo: (token: string, changeHint: boolean) => string;
}

export function getInspectorControlsCopy(locale: Locale): InspectorControlsCopy {
  if (locale === 'zh-hant') {
    return {
      mixedValuesLabel: '混合',
      mixedValuesTitle: '多個已選值不同。輸入新值會套用到所有已選元素。',
      viewportOverrideTitle: '視窗覆寫',
      colorPicker: '開啟色彩選擇器',
      adjustValue: '調整數值',
      decrease: '減少',
      increase: '增加',
      disableSetting: '停用設定',
      enableSetting: '啟用設定',
      advanced: '進階',
      hide: '隱藏',
      show: '顯示',
      mixed: '混合',
      themeBinding: '主題綁定',
      linked: '已連結',
      detached: '已分離',
      custom: '自訂',
      detachedColor: '已分離顏色',
      customColor: '自訂顏色',
      boundTo: (token, changeHint) => `已綁定至 ${token}${changeHint ? '。點擊可變更。' : ''}`,
    };
  }
  if (locale === 'en') {
    return {
      mixedValuesLabel: 'Mixed',
      mixedValuesTitle: 'Multiple selected values differ. Entering a new value applies it to all selected elements.',
      viewportOverrideTitle: 'Viewport override',
      colorPicker: 'Open color picker',
      adjustValue: 'Adjust value',
      decrease: 'Decrease',
      increase: 'Increase',
      disableSetting: 'Disable setting',
      enableSetting: 'Enable setting',
      advanced: 'Advanced',
      hide: 'Hide',
      show: 'Show',
      mixed: 'Mixed',
      themeBinding: 'Theme binding',
      linked: 'Linked',
      detached: 'Detached',
      custom: 'Custom',
      detachedColor: 'Detached color',
      customColor: 'Custom color',
      boundTo: (token, changeHint) => `Bound to ${token}${changeHint ? '. Click to change.' : ''}`,
    };
  }
  return {
    mixedValuesLabel: '혼합',
    mixedValuesTitle: '여러 선택값이 서로 다릅니다. 새 값을 입력하면 선택된 모든 요소에 적용됩니다.',
    viewportOverrideTitle: '뷰포트 재정의',
    colorPicker: '색상 선택기 열기',
    adjustValue: '값 조정',
    decrease: '줄이기',
    increase: '늘리기',
    disableSetting: '설정 끄기',
    enableSetting: '설정 켜기',
    advanced: '고급',
    hide: '숨기기',
    show: '보이기',
    mixed: '혼합',
    themeBinding: '테마 바인딩',
    linked: '연결됨',
    detached: '분리됨',
    custom: '사용자 지정',
    detachedColor: '분리된 색상',
    customColor: '사용자 지정 색상',
    boundTo: (token, changeHint) => `다음에 바인딩됨: ${token}${changeHint ? '. 클릭해서 변경하세요.' : ''}`,
  };
}
