'use client';

import { useEffect, useState } from 'react';
import {
  DEFAULT_EDITOR_PREFS,
  loadEditorPreferences,
  saveAndBroadcastEditorPreferences,
  type CustomKeybinding,
} from '@/lib/builder/canvas/editor-prefs';
import { DEFAULT_KEYBINDINGS } from '@/lib/builder/canvas/shortcuts';

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Phase 28 W219 — Keybinding mapping modal.
 *
 * Stores user-defined combo overrides in editor preferences. Runtime
 * keyboard handlers should call resolveKeybinding(action) (helper to be
 * wired into existing shortcut listeners) instead of hard-coding combos.
 */
export default function KeybindingsModal({ open, onClose }: Props) {
  const [bindings, setBindings] = useState<CustomKeybinding[]>(
    () => DEFAULT_KEYBINDINGS.map((binding) => ({ action: binding.action, combo: binding.combo })),
  );

  useEffect(() => {
    if (!open) return;
    const prefs = loadEditorPreferences();
    const map = new Map<string, string>();
    for (const b of DEFAULT_KEYBINDINGS) map.set(b.action, b.combo);
    for (const b of prefs.customKeybindings) map.set(b.action, b.combo);
    setBindings(DEFAULT_KEYBINDINGS.map((d) => ({ action: d.action, combo: map.get(d.action) ?? d.combo })));
  }, [open]);

  function updateCombo(action: string, combo: string) {
    setBindings((prev) => prev.map((b) => (b.action === action ? { ...b, combo } : b)));
  }

  function persist() {
    const prefs = loadEditorPreferences() ?? DEFAULT_EDITOR_PREFS;
    const overrides = bindings.filter((b) => {
      const def = DEFAULT_KEYBINDINGS.find((d) => d.action === b.action);
      return b.combo.trim() && def?.combo !== b.combo.trim();
    });
    saveAndBroadcastEditorPreferences({ ...prefs, customKeybindings: overrides });
    onClose();
  }

  function reset() {
    setBindings(DEFAULT_KEYBINDINGS.map((binding) => ({ action: binding.action, combo: binding.combo })));
  }

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keybindings"
      data-builder-keybindings-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: 12,
          padding: 24,
          width: 480,
          maxWidth: '92vw',
          maxHeight: '85vh',
          overflow: 'auto',
          boxShadow: '0 28px 80px rgba(0,0,0,0.32)',
        }}
      >
        <h2 style={{ margin: '0 0 12px', fontSize: 16 }}>단축키 매핑</h2>
        <p style={{ margin: '0 0 16px', fontSize: 12, color: '#64748b' }}>
          Mod = Cmd (macOS) / Ctrl (Windows). 변경 후 저장하면 다음 단축키 처리 시
          반영됩니다.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 6, color: '#475569' }}>액션</th>
              <th style={{ textAlign: 'left', padding: 6, color: '#475569' }}>설명</th>
              <th style={{ textAlign: 'left', padding: 6, color: '#475569' }}>단축키</th>
            </tr>
          </thead>
          <tbody>
            {bindings.map((b) => (
              <tr key={b.action}>
                <td style={{ padding: 6, fontFamily: 'ui-monospace, Menlo, monospace' }}>{b.action}</td>
                <td style={{ padding: 6, color: '#475569' }}>
                  {DEFAULT_KEYBINDINGS.find((binding) => binding.action === b.action)?.label ?? b.action}
                </td>
                <td style={{ padding: 6 }}>
                  <input
                    type="text"
                    data-builder-keybinding-input={b.action}
                    value={b.combo}
                    onChange={(event) => updateCombo(b.action, event.target.value)}
                    style={{
                      width: '100%',
                      padding: '4px 8px',
                      border: '1px solid #cbd5e1',
                      borderRadius: 6,
                      fontFamily: 'ui-monospace, Menlo, monospace',
                      fontSize: 12,
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button
            type="button"
            onClick={reset}
            style={{ marginRight: 'auto', padding: '8px 14px', border: '1px solid #cbd5e1', background: '#ffffff', borderRadius: 8, cursor: 'pointer' }}
          >
            기본값
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: '8px 14px', border: '1px solid #cbd5e1', background: '#ffffff', borderRadius: 8, cursor: 'pointer' }}
          >
            취소
          </button>
          <button
            type="button"
            onClick={persist}
            style={{ padding: '8px 14px', border: 0, background: '#0f172a', color: '#ffffff', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

export function resolveKeybinding(action: string): string {
  const prefs = loadEditorPreferences();
  const override = prefs.customKeybindings.find((b) => b.action === action);
  if (override) return override.combo;
  const fallback = DEFAULT_KEYBINDINGS.find((b) => b.action === action);
  return fallback?.combo ?? '';
}
