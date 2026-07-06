import type { Locale } from '@/lib/locales';

export interface CanvasEditorPrefsCopy {
  buttonTitle: string;
  dialogLabel: string;
  heading: string;
  rulers: string;
  outlineView: string;
  outlineHideContent: string;
  pixelGrid: string;
  gridSize: string;
  shortcutMap: string;
}

export interface CanvasKeybindingsCopy {
  ariaLabel: string;
  title: string;
  description: string;
  action: string;
  descriptionHeading: string;
  shortcutHeading: string;
  reset: string;
  cancel: string;
  save: string;
  closeHint: string;
  modExplanation: string;
}

export interface CanvasShortcutsHelpCopy {
  title: string;
  description: string;
  ariaLabel: string;
  closeHint: string;
  groups: Array<{
    title: string;
    items: Array<{ keys: string; description: string }>;
  }>;
}

export interface CanvasNodeBadgeCopy {
  locked: string;
  sticky: (position: 'top' | 'bottom', offset: number) => string;
  anchor: (anchorName: string) => string;
  animation: string;
  link: (href: string, shortcutLabel: string) => string;
  shortcutFallback: string;
}

export function getCanvasEditorPrefsCopy(locale: Locale): CanvasEditorPrefsCopy {
  if (locale === 'zh-hant') {
    return {
      buttonTitle: '編輯器偏好設定',
      dialogLabel: '編輯器偏好設定',
      heading: '編輯器',
      rulers: '標尺',
      outlineView: '外框檢視',
      outlineHideContent: '隱藏內容',
      pixelGrid: '像素格線與貼齊',
      gridSize: '格線大小',
      shortcutMap: '快捷鍵對照表',
    };
  }
  if (locale === 'en') {
    return {
      buttonTitle: 'Editor preferences',
      dialogLabel: 'Editor preferences',
      heading: 'Editor',
      rulers: 'Rulers',
      outlineView: 'Outline view',
      outlineHideContent: 'Hide content',
      pixelGrid: 'Pixel grid + snap',
      gridSize: 'Grid size',
      shortcutMap: 'Shortcut map',
    };
  }
  return {
    buttonTitle: '편집기 설정',
    dialogLabel: '편집기 설정',
    heading: '편집기',
    rulers: '눈금자',
    outlineView: '윤곽선 보기',
    outlineHideContent: '콘텐츠 숨기기',
    pixelGrid: '픽셀 그리드 + 스냅',
    gridSize: '그리드 크기',
    shortcutMap: '단축키 표',
  };
}

export function getCanvasKeybindingsCopy(locale: Locale): CanvasKeybindingsCopy {
  if (locale === 'zh-hant') {
    return {
      ariaLabel: '快捷鍵對照表',
      title: '快捷鍵對照表',
      description: 'Mod = Cmd（macOS）/ Ctrl（Windows）。儲存後，新的快捷鍵組合會立即生效。',
      action: '動作',
      descriptionHeading: '說明',
      shortcutHeading: '快捷鍵',
      reset: '重設',
      cancel: '取消',
      save: '儲存',
      closeHint: '按 Esc 或點擊外部即可關閉',
      modExplanation: 'Mod = Cmd（macOS）/ Ctrl（Windows）。',
    };
  }
  if (locale === 'en') {
    return {
      ariaLabel: 'Keybindings',
      title: 'Keybindings',
      description: 'Mod = Cmd (macOS) / Ctrl (Windows). Save to apply the override map the next time shortcuts run.',
      action: 'Action',
      descriptionHeading: 'Description',
      shortcutHeading: 'Shortcut',
      reset: 'Reset',
      cancel: 'Cancel',
      save: 'Save',
      closeHint: 'Press Esc or click outside to close',
      modExplanation: 'Mod = Cmd (macOS) / Ctrl (Windows).',
    };
  }
  return {
    ariaLabel: '단축키 매핑',
    title: '단축키 매핑',
    description: 'Mod = Cmd (macOS) / Ctrl (Windows). 저장하면 다음 단축키 처리부터 반영됩니다.',
    action: '액션',
    descriptionHeading: '설명',
    shortcutHeading: '단축키',
    reset: '기본값',
    cancel: '취소',
    save: '저장',
    closeHint: 'Esc 또는 바깥쪽 클릭으로 닫기',
    modExplanation: 'Mod = Cmd (macOS) / Ctrl (Windows).',
  };
}

export function getCanvasShortcutsHelpCopy(locale: Locale): CanvasShortcutsHelpCopy {
  if (locale === 'zh-hant') {
    return {
      title: '鍵盤快捷鍵',
      description: '這些是你可直接在編輯器中使用的編輯、群組、圖層順序與移動快捷鍵。',
      ariaLabel: '鍵盤快捷鍵',
      closeHint: '按 Esc 或點擊外部即可關閉',
      groups: [
        {
          title: '編輯',
          items: [
            { keys: '↶', description: '復原' },
            { keys: '↷', description: '重做' },
            { keys: '⌘/Ctrl+C', description: '複製' },
            { keys: '⌘/Ctrl+X', description: '剪下' },
            { keys: '⌘/Ctrl+V', description: '貼上' },
            { keys: '⌘/Ctrl+D', description: '複製一份' },
            { keys: '⌦ / Delete', description: '刪除' },
            { keys: '⌘/Ctrl+A', description: '全選' },
            { keys: 'Esc', description: '取消選取 / 退出群組' },
          ],
        },
        {
          title: '群組',
          items: [
            { keys: '⌘/Ctrl+G', description: '建立群組' },
            { keys: 'Shift+⌘/Ctrl+G', description: '取消群組' },
            { keys: '雙擊', description: '進入容器 / 編輯文字' },
          ],
        },
        {
          title: '圖層順序',
          items: [
            { keys: '⌘/Ctrl+]', description: '向前移一層' },
            { keys: '⌘/Ctrl+[', description: '向後移一層' },
            { keys: 'Shift+⌘/Ctrl+]', description: '移到最前' },
            { keys: 'Shift+⌘/Ctrl+[', description: '移到最後' },
          ],
        },
        {
          title: '移動',
          items: [
            { keys: '↑ ↓ ← →', description: '移動 1px' },
            { keys: 'Shift+箭頭', description: '移動 10px' },
            { keys: 'Alt+點擊', description: '選取父容器' },
            { keys: 'Space+拖曳', description: '平移畫布' },
          ],
        },
        {
          title: '縮放',
          items: [
            { keys: '⌘/Ctrl++', description: '放大' },
            { keys: '⌘/Ctrl+-', description: '縮小' },
            { keys: '⌘/Ctrl+0', description: '100%' },
            { keys: '⌘/Ctrl+滾輪', description: '滑鼠滾輪縮放' },
          ],
        },
        {
          title: '說明',
          items: [
            { keys: 'Shift+? / ?', description: '開啟或關閉此說明' },
          ],
        },
      ],
    };
  }
  if (locale === 'en') {
    return {
      title: 'Keyboard shortcuts',
      description: 'These are the edit, group, stacking, and movement shortcuts available directly in the editor.',
      ariaLabel: 'Keyboard shortcuts',
      closeHint: 'Press Esc or click outside to close',
      groups: [
        {
          title: 'Editing',
          items: [
            { keys: '↶', description: 'Undo' },
            { keys: '↷', description: 'Redo' },
            { keys: '⌘/Ctrl+C', description: 'Copy' },
            { keys: '⌘/Ctrl+X', description: 'Cut' },
            { keys: '⌘/Ctrl+V', description: 'Paste' },
            { keys: '⌘/Ctrl+D', description: 'Duplicate' },
            { keys: '⌦ / Delete', description: 'Delete' },
            { keys: '⌘/Ctrl+A', description: 'Select all' },
            { keys: 'Esc', description: 'Deselect / exit group' },
          ],
        },
        {
          title: 'Grouping',
          items: [
            { keys: '⌘/Ctrl+G', description: 'Group' },
            { keys: 'Shift+⌘/Ctrl+G', description: 'Ungroup' },
            { keys: 'Double click', description: 'Enter container / edit text' },
          ],
        },
        {
          title: 'Stacking',
          items: [
            { keys: '⌘/Ctrl+]', description: 'Bring forward' },
            { keys: '⌘/Ctrl+[', description: 'Send backward' },
            { keys: 'Shift+⌘/Ctrl+]', description: 'Bring to front' },
            { keys: 'Shift+⌘/Ctrl+[', description: 'Send to back' },
          ],
        },
        {
          title: 'Movement',
          items: [
            { keys: '↑ ↓ ← →', description: 'Move 1px' },
            { keys: 'Shift+arrow', description: 'Move 10px' },
            { keys: 'Alt+click', description: 'Select parent container' },
            { keys: 'Space+drag', description: 'Pan the canvas' },
          ],
        },
        {
          title: 'Zoom',
          items: [
            { keys: '⌘/Ctrl++', description: 'Zoom in' },
            { keys: '⌘/Ctrl+-', description: 'Zoom out' },
            { keys: '⌘/Ctrl+0', description: '100%' },
            { keys: '⌘/Ctrl+wheel', description: 'Zoom with mouse wheel' },
          ],
        },
        {
          title: 'Help',
          items: [
            { keys: 'Shift+? / ?', description: 'Open or close this help' },
          ],
        },
      ],
    };
  }
  return {
    title: '키보드 단축키',
    description: '에디터에서 바로 사용할 수 있는 편집, 그룹, z-order, 이동 단축키입니다.',
    ariaLabel: '키보드 단축키',
    closeHint: 'Esc 또는 바깥쪽 클릭으로 닫기',
    groups: [
      {
        title: '편집',
        items: [
          { keys: '↶', description: '실행 취소' },
          { keys: '↷', description: '다시 실행' },
          { keys: '⌘/Ctrl+C', description: '복사' },
          { keys: '⌘/Ctrl+X', description: '잘라내기' },
          { keys: '⌘/Ctrl+V', description: '붙여넣기' },
          { keys: '⌘/Ctrl+D', description: '복제' },
          { keys: '⌦ / Delete', description: '삭제' },
          { keys: '⌘/Ctrl+A', description: '전체 선택' },
          { keys: 'Esc', description: '선택 해제 / 그룹 나가기' },
        ],
      },
      {
        title: '그룹',
        items: [
          { keys: '⌘/Ctrl+G', description: '그룹 만들기' },
          { keys: 'Shift+⌘/Ctrl+G', description: '그룹 해제' },
          { keys: 'Double click', description: '컨테이너 진입 / 텍스트 편집' },
        ],
      },
      {
        title: 'Z-order',
        items: [
          { keys: '⌘/Ctrl+]', description: '한 단계 앞으로' },
          { keys: '⌘/Ctrl+[', description: '한 단계 뒤로' },
          { keys: 'Shift+⌘/Ctrl+]', description: '맨 앞으로' },
          { keys: 'Shift+⌘/Ctrl+[', description: '맨 뒤로' },
        ],
      },
      {
        title: '이동',
        items: [
          { keys: '↑ ↓ ← →', description: '1px 이동' },
          { keys: 'Shift+화살표', description: '10px 이동' },
          { keys: 'Alt+클릭', description: '부모 컨테이너 선택' },
          { keys: 'Space+드래그', description: '캔버스 패닝' },
        ],
      },
      {
        title: '확대/축소',
        items: [
          { keys: '⌘/Ctrl++', description: '확대' },
          { keys: '⌘/Ctrl+-', description: '축소' },
          { keys: '⌘/Ctrl+0', description: '100%' },
          { keys: '⌘/Ctrl+휠', description: '마우스 휠 줌' },
        ],
      },
      {
        title: '도움말',
        items: [
          { keys: 'Shift+? / ?', description: '이 도움말 열기/닫기' },
        ],
      },
    ],
  };
}

export function getCanvasNodeBadgeCopy(locale: Locale): CanvasNodeBadgeCopy {
  if (locale === 'zh-hant') {
    return {
      locked: '已鎖定',
      sticky: (position, offset) => `已釘選 ${position === 'bottom' ? '底部' : '頂部'} +${offset}px`,
      anchor: (anchorName) => `錨點：#${anchorName}`,
      animation: '動畫',
      link: (href, shortcutLabel) => `連結：${href}\n點擊或使用 ${shortcutLabel} 編輯`,
      shortcutFallback: '快捷鍵',
    };
  }
  if (locale === 'en') {
    return {
      locked: 'locked',
      sticky: (position, offset) => `Pinned ${position} +${offset}px`,
      anchor: (anchorName) => `Anchor: #${anchorName}`,
      animation: 'anim',
      link: (href, shortcutLabel) => `Link: ${href}\nClick or use ${shortcutLabel} to edit`,
      shortcutFallback: 'shortcut',
    };
  }
  return {
    locked: '잠김',
    sticky: (position, offset) => `고정됨 ${position === 'bottom' ? '하단' : '상단'} +${offset}px`,
    anchor: (anchorName) => `앵커: #${anchorName}`,
    animation: '애니',
    link: (href, shortcutLabel) => `링크: ${href}\n클릭하거나 ${shortcutLabel}로 편집`,
    shortcutFallback: '단축키',
  };
}
