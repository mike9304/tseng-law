import { describe, expect, it } from 'vitest';
import { getInspectorControlsCopy } from '../inspector-controls-copy';

describe('getInspectorControlsCopy', () => {
  it('localizes the shared inspector chrome', () => {
    expect(getInspectorControlsCopy('ko')).toMatchObject({
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
    });
    expect(getInspectorControlsCopy('ko').boundTo('theme-color', true)).toBe(
      '다음에 바인딩됨: theme-color. 클릭해서 변경하세요.'
    );

    expect(getInspectorControlsCopy('zh-hant')).toMatchObject({
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
    });
    expect(getInspectorControlsCopy('zh-hant').boundTo('theme-color', false)).toBe('已綁定至 theme-color');
  });
});
