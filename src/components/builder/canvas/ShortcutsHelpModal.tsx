'use client';

import { useMemo } from 'react';
import { useShortcutLabels, type ShortcutAction } from '@/components/builder/canvas/hooks/useShortcutLabels';
import ModalShell from './ModalShell';

interface ShortcutGroup {
  title: string;
  items: Array<{ keys: string; description: string }>;
}

const SHORTCUT_ACTIONS: ShortcutAction[] = [
  'undo',
  'redo',
  'copy',
  'cut',
  'paste',
  'duplicate',
  'delete',
  'selectAll',
  'deselect',
  'group',
  'ungroup',
  'bringForward',
  'sendBackward',
  'bringToFront',
  'sendToBack',
  'nudgeUp',
  'nudgeDown',
  'nudgeLeft',
  'nudgeRight',
  'nudgeUpLarge',
  'zoomIn',
  'zoomOut',
  'zoomReset',
  'showHelp',
];

export default function ShortcutsHelpModal({ onClose }: { onClose: () => void }) {
  const shortcutLabels = useShortcutLabels(SHORTCUT_ACTIONS);
  const shortcut = (action: ShortcutAction, fallback = '') => shortcutLabels.get(action)?.glyph || fallback;
  const groups: ShortcutGroup[] = useMemo(() => [
    {
      title: '편집',
      items: [
        { keys: shortcut('undo'), description: '실행 취소' },
        { keys: shortcut('redo'), description: '다시 실행' },
        { keys: shortcut('copy'), description: '복사' },
        { keys: shortcut('cut'), description: '잘라내기' },
        { keys: shortcut('paste'), description: '붙여넣기' },
        { keys: shortcut('duplicate'), description: '복제' },
        { keys: `${shortcut('delete')} / Delete`, description: '삭제' },
        { keys: shortcut('selectAll'), description: '전체 선택' },
        { keys: shortcut('deselect'), description: '선택 해제 / 그룹 나가기' },
      ],
    },
    {
      title: '그룹',
      items: [
        { keys: shortcut('group'), description: '그룹 만들기' },
        { keys: shortcut('ungroup'), description: '그룹 해제' },
        { keys: 'Double-click', description: '컨테이너 진입 / 텍스트 편집' },
      ],
    },
    {
      title: 'Z-order',
      items: [
        { keys: shortcut('bringForward'), description: '한 단계 앞으로' },
        { keys: shortcut('sendBackward'), description: '한 단계 뒤로' },
        { keys: shortcut('bringToFront'), description: '맨 앞으로' },
        { keys: shortcut('sendToBack'), description: '맨 뒤로' },
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
        { keys: shortcut('zoomIn'), description: '확대' },
        { keys: shortcut('zoomOut'), description: '축소' },
        { keys: shortcut('zoomReset'), description: '100%' },
        { keys: 'Mod+휠', description: '마우스 휠 줌' },
      ],
    },
    {
      title: '도움말',
      items: [
        { keys: `${shortcut('showHelp')} 또는 ?`, description: '이 도움말 열기/닫기' },
      ],
    },
  ], [shortcutLabels]);

  return (
    <ModalShell
      title="키보드 단축키"
      description="에디터에서 바로 사용할 수 있는 편집, 그룹, z-order, 이동 단축키입니다."
      ariaLabel="키보드 단축키"
      size="lg"
      onClose={onClose}
    >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 24,
          }}
        >
          {groups.map((group) => (
            <section key={group.title}>
              <h3
                style={{
                  margin: '0 0 8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#64748b',
                }}
              >
                {group.title}
              </h3>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {group.items.map((item) => (
                  <li
                    key={item.keys}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '6px 0',
                      borderBottom: '1px dashed #e2e8f0',
                    }}
                  >
                    <span style={{ fontSize: '0.82rem', color: '#0f172a' }}>{item.description}</span>
                    <kbd
                      style={{
                        fontSize: '0.72rem',
                        fontFamily: 'system-ui',
                        color: '#475569',
                        background: '#f1f5f9',
                        padding: '2px 8px',
                        borderRadius: 6,
                        border: '1px solid #e2e8f0',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.keys}
                    </kbd>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div style={{ marginTop: 20, fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
          Esc 또는 화면 바깥 클릭으로 닫기
        </div>
    </ModalShell>
  );
}
