'use client';

import ModalShell from './ModalShell';

interface ShortcutGroup {
  title: string;
  items: Array<{ keys: string; description: string }>;
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform);
const mod = isMac ? '⌘' : 'Ctrl';

const groups: ShortcutGroup[] = [
  {
    title: '편집',
    items: [
      { keys: `${mod}+Z`, description: '실행 취소' },
      { keys: `${mod}+Shift+Z`, description: '다시 실행' },
      { keys: `${mod}+C`, description: '복사' },
      { keys: `${mod}+X`, description: '잘라내기' },
      { keys: `${mod}+V`, description: '붙여넣기' },
      { keys: `${mod}+D`, description: '복제' },
      { keys: 'Delete / Backspace', description: '삭제' },
      { keys: `${mod}+A`, description: '전체 선택' },
      { keys: 'Esc', description: '선택 해제 / 그룹 나가기' },
    ],
  },
  {
    title: '그룹',
    items: [
      { keys: `${mod}+G`, description: '그룹 만들기' },
      { keys: `${mod}+Shift+G`, description: '그룹 해제' },
      { keys: 'Double-click', description: '컨테이너 진입 / 텍스트 편집' },
    ],
  },
  {
    title: 'Z-order',
    items: [
      { keys: `${mod}+]`, description: '한 단계 앞으로' },
      { keys: `${mod}+[`, description: '한 단계 뒤로' },
      { keys: `${mod}+Shift+]`, description: '맨 앞으로' },
      { keys: `${mod}+Shift+[`, description: '맨 뒤로' },
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
      { keys: `${mod}+ +`, description: '확대' },
      { keys: `${mod}+-`, description: '축소' },
      { keys: `${mod}+0`, description: '100%' },
      { keys: `${mod}+휠`, description: '마우스 휠 줌' },
    ],
  },
  {
    title: '도움말',
    items: [
      { keys: `${mod}+/ 또는 ?`, description: '이 도움말 열기/닫기' },
    ],
  },
];

export default function ShortcutsHelpModal({ onClose }: { onClose: () => void }) {
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
