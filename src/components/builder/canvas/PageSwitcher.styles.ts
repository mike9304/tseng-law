import type { CSSProperties } from 'react';

export const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: '10px 8px 12px',
};

export const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 2px 2px',
  marginBottom: 2,
};

export const headerLabelStyle: CSSProperties = {
  fontSize: '0.76rem',
  fontWeight: 850,
  letterSpacing: 0,
  color: '#1f2a44',
};

export const addButtonStyle: CSSProperties = {
  minHeight: 28,
  padding: '0 11px',
  fontSize: '0.75rem',
  fontWeight: 850,
  border: '1px solid #c7d7ee',
  borderRadius: 8,
  background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
  color: '#0f3d78',
  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
  cursor: 'pointer',
};

export function pageRowStyle(active: boolean): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'stretch',
    gap: 6,
    minHeight: 50,
    padding: '5px 6px',
    borderRadius: 9,
    border: active ? '1px solid rgba(17, 109, 255, 0.52)' : '1px solid rgba(203, 213, 225, 0.78)',
    background: active
      ? 'linear-gradient(180deg, #f7fbff 0%, #eef6ff 100%)'
      : 'linear-gradient(180deg, #ffffff 0%, #fbfcfe 100%)',
    boxShadow: active
      ? '0 1px 0 rgba(255, 255, 255, 0.94) inset, 0 9px 20px rgba(17, 109, 255, 0.1)'
      : '0 1px 0 rgba(255, 255, 255, 0.9) inset',
    transition: 'background 140ms ease, border-color 140ms ease, box-shadow 140ms ease, transform 140ms ease',
    position: 'relative',
  };
}

export function pageButtonStyle(active: boolean): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'stretch',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 3,
    minWidth: 0,
    flex: 1,
    padding: '5px 2px 5px 0',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '0.78rem',
    fontWeight: active ? 750 : 650,
    lineHeight: 1.2,
    color: active ? '#092e66' : '#25324a',
    textAlign: 'left',
  };
}

export const moreButtonBaseStyle: CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 6,
  border: 'none',
  background: 'transparent',
  color: '#64748b',
  cursor: 'pointer',
  fontSize: '1rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 120ms ease, background 120ms ease',
};

export function pageDragHandleStyle(dragging: boolean): CSSProperties {
  return {
    width: 24,
    height: 34,
    border: 'none',
    borderRadius: 8,
    background: dragging ? '#dbeafe' : 'transparent',
    color: dragging ? '#116dff' : '#7c8aa3',
    cursor: 'grab',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background 120ms ease, color 120ms ease',
  };
}

export function pageMoreButtonStyle(visible: boolean, active: boolean): CSSProperties {
  return {
    ...moreButtonBaseStyle,
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none',
    background: active ? '#e2e8f0' : 'transparent',
  };
}

export const pageRowControlIconStyle: CSSProperties = {
  width: 16,
  height: 16,
  flexShrink: 0,
};

export const menuStyle: CSSProperties = {
  position: 'absolute',
  top: '100%',
  right: 0,
  marginTop: 6,
  minWidth: 178,
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.16)',
  padding: 4,
  zIndex: 30,
};

export function menuItemStyle(destructive = false, disabled = false): CSSProperties {
  return {
    width: '100%',
    padding: '8px 10px',
    border: 'none',
    borderRadius: 8,
    background: 'transparent',
    color: disabled ? '#94a3b8' : destructive ? '#b91c1c' : '#334155',
    fontSize: '0.8rem',
    fontWeight: 500,
    textAlign: 'left',
    cursor: disabled ? 'not-allowed' : 'pointer',
  };
}

export const menuGroupLabelStyle: CSSProperties = {
  padding: '7px 10px 4px',
  color: '#64748b',
  fontSize: '0.66rem',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

export const editContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  width: '100%',
  padding: '8px 6px',
};

export const editInputStyle: CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  fontSize: '0.82rem',
  color: '#0f172a',
  outline: 'none',
  boxSizing: 'border-box',
};

export const editHintStyle: CSSProperties = {
  fontSize: '0.72rem',
  color: '#64748b',
};

export const statusMessageStyle: CSSProperties = {
  padding: '0 8px 4px',
  fontSize: '0.75rem',
  color: '#b91c1c',
};

export const warningMessageStyle: CSSProperties = {
  margin: '0 8px 4px',
  padding: '7px 9px',
  border: '1px solid #fbbf24',
  borderRadius: 8,
  background: '#fffbeb',
  color: '#92400e',
  fontSize: '0.75rem',
  lineHeight: 1.4,
  overflowWrap: 'anywhere',
};

export const emptyStateStyle: CSSProperties = {
  display: 'grid',
  gap: 8,
  margin: '2px 0',
  padding: 12,
  border: '1px dashed #cbd5e1',
  borderRadius: 10,
  background: '#f8fafc',
  color: '#334155',
};

export const emptyStateTitleStyle: CSSProperties = {
  fontSize: '0.82rem',
  fontWeight: 800,
  color: '#0f172a',
};

export const emptyStateCopyStyle: CSSProperties = {
  fontSize: '0.73rem',
  lineHeight: 1.45,
  color: '#64748b',
};

export const titleTextStyle: CSSProperties = {
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const pagePrimaryLineStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  minWidth: 0,
  gap: 6,
};

export const pageMetaLineStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  minWidth: 0,
  gap: 6,
  color: '#64748b',
};

export const homeBadgeStyle: CSSProperties = {
  fontSize: '0.6rem',
  color: '#0f3d78',
  fontWeight: 800,
  padding: '1px 4px',
  borderRadius: 999,
  background: '#dbeafe',
  border: '1px solid #bfdbfe',
  flexShrink: 0,
};

export const memberAccessBadgeStyle: CSSProperties = {
  fontSize: '0.62rem',
  color: '#7c2d12',
  fontWeight: 800,
  padding: '1px 5px',
  borderRadius: 999,
  background: '#ffedd5',
  border: '1px solid #fed7aa',
  flexShrink: 0,
};

export const unpublishedChangesBadgeStyle: CSSProperties = {
  fontSize: '0.6rem',
  color: '#92400e',
  fontWeight: 850,
  padding: '1px 5px',
  borderRadius: 999,
  background: '#fffbeb',
  border: '1px solid #fbbf24',
  flexShrink: 0,
};

export const memberAccessDialogOverlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 18,
  background: 'rgba(15, 23, 42, 0.42)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  zIndex: 10000,
};

export const memberAccessDialogPanelStyle: CSSProperties = {
  width: 'min(460px, 92vw)',
  maxHeight: 'min(760px, calc(100vh - 48px))',
  display: 'grid',
  gap: 14,
  overflow: 'hidden auto',
  padding: 22,
  border: '1px solid rgba(203, 213, 225, 0.9)',
  borderRadius: 14,
  background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
  boxShadow: '0 24px 70px rgba(15, 23, 42, 0.24)',
};

export const memberAccessDialogHeaderStyle: CSSProperties = {
  display: 'grid',
  gap: 5,
  paddingBottom: 2,
};

export const memberAccessDialogTitleStyle: CSSProperties = {
  color: '#0f172a',
  fontSize: '0.98rem',
  fontWeight: 900,
  lineHeight: 1.25,
};

export const memberAccessDialogDescriptionStyle: CSSProperties = {
  color: '#64748b',
  fontSize: '0.77rem',
  fontWeight: 650,
  lineHeight: 1.45,
};

export const memberAccessFieldStyle: CSSProperties = {
  display: 'grid',
  gap: 6,
  color: '#334155',
  fontSize: '0.77rem',
  fontWeight: 850,
};

export const memberAccessHintStyle: CSSProperties = {
  color: '#64748b',
  fontSize: '0.71rem',
  fontWeight: 700,
  lineHeight: 1.4,
};

export const memberAccessPagePickerStyle: CSSProperties = {
  display: 'grid',
  gap: 8,
};

export function memberAccessControlStyle(disabled: boolean): CSSProperties {
  return {
    ...editInputStyle,
    background: disabled ? '#f1f5f9' : '#fff',
    opacity: disabled ? 0.62 : 1,
  };
}

export function memberAccessListboxStyle(disabled: boolean): CSSProperties {
  return {
    display: 'grid',
    gap: 5,
    maxHeight: 174,
    overflowY: 'auto',
    padding: 5,
    border: '1px solid #dbe5f0',
    borderRadius: 10,
    background: '#f8fafc',
    opacity: disabled ? 0.62 : 1,
  };
}

export function memberAccessPageChoiceStyle(selected: boolean, disabled: boolean): CSSProperties {
  return {
    display: 'grid',
    gap: 3,
    padding: '8px 10px',
    border: `1px solid ${selected ? '#116dff' : '#e5edf6'}`,
    borderRadius: 8,
    background: selected ? '#eff6ff' : '#fff',
    color: '#0f172a',
    textAlign: 'left',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: selected ? '0 0 0 2px rgba(17, 109, 255, 0.1)' : 'none',
  };
}

export const memberAccessPageChoiceTitleStyle: CSSProperties = {
  color: '#0f172a',
  fontSize: '0.77rem',
  fontWeight: 850,
  lineHeight: 1.25,
};

export const memberAccessPageChoicePathStyle: CSSProperties = {
  color: '#64748b',
  fontSize: '0.71rem',
  fontWeight: 750,
  lineHeight: 1.25,
};

export const memberAccessEmptyChoiceStyle: CSSProperties = {
  padding: '10px',
  color: '#64748b',
  fontSize: '0.75rem',
  fontWeight: 750,
};

export const memberAccessDialogActionsStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 8,
  paddingTop: 2,
};

export const memberAccessPrimaryButtonStyle: CSSProperties = {
  ...addButtonStyle,
  borderColor: '#116dff',
  background: '#116dff',
  color: '#fff',
};

export const slugPromptOverlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 18,
  background: 'rgba(15, 23, 42, 0.42)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  zIndex: 10000,
};

export const slugPromptDialogStyle: CSSProperties = {
  width: 'min(440px, 92vw)',
  display: 'grid',
  gap: 14,
  padding: 24,
  border: '1px solid rgba(203, 213, 225, 0.9)',
  borderRadius: 14,
  background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
  boxShadow: '0 24px 70px rgba(15, 23, 42, 0.24)',
  outline: 'none',
};

export const slugPromptTitleStyle: CSSProperties = {
  color: '#0f172a',
  fontSize: '1rem',
  fontWeight: 900,
  lineHeight: 1.25,
};

export const slugPromptDescriptionStyle: CSSProperties = {
  color: '#64748b',
  fontSize: '0.78rem',
  fontWeight: 650,
  lineHeight: 1.45,
};

export const slugPromptErrorStyle: CSSProperties = {
  padding: '8px 10px',
  border: '1px solid #fecaca',
  borderRadius: 8,
  background: '#fef2f2',
  color: '#b91c1c',
  fontSize: '0.78rem',
  fontWeight: 750,
  lineHeight: 1.35,
};

export const slugPromptInputStyle: CSSProperties = {
  width: '100%',
  minHeight: 38,
  padding: '8px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  background: '#fff',
  color: '#0f172a',
  fontSize: '0.86rem',
  fontWeight: 700,
  outline: 'none',
  boxSizing: 'border-box',
};

export const slugPromptNavigationLabelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 8,
  padding: '9px 10px',
  border: '1px solid #dbe4ee',
  borderRadius: 10,
  background: '#f8fafc',
  color: '#334155',
  fontSize: '0.78rem',
  fontWeight: 800,
  lineHeight: 1.35,
  cursor: 'pointer',
};

export const slugPromptCheckboxStyle: CSSProperties = {
  marginTop: 2,
};

export const slugPromptNavigationTextStyle: CSSProperties = {
  display: 'grid',
  gap: 2,
};

export const slugPromptNavigationHintStyle: CSSProperties = {
  color: '#64748b',
  fontSize: '0.72rem',
  fontWeight: 650,
};

export const slugPromptActionsStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  gap: 8,
};

export const slugPromptBackButtonStyle: CSSProperties = {
  ...addButtonStyle,
  borderColor: '#bfdbfe',
  background: '#eff6ff',
  color: '#123b63',
};

export const slugPromptCancelButtonStyle: CSSProperties = {
  ...addButtonStyle,
  borderColor: '#cbd5e1',
  background: '#f8fafc',
  color: '#334155',
};

export function slugPromptCreateButtonStyle(disabled: boolean): CSSProperties {
  return {
    ...addButtonStyle,
    borderColor: '#116dff',
    background: '#116dff',
    color: '#fff',
    opacity: disabled ? 0.72 : 1,
    cursor: disabled ? 'wait' : 'pointer',
  };
}

export const slugStyle: CSSProperties = {
  minWidth: 0,
  overflow: 'hidden',
  fontSize: '0.69rem',
  color: '#64748b',
  fontWeight: 700,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const statusDotStyle = (published: boolean): CSSProperties => ({
  width: 7,
  height: 7,
  borderRadius: '50%',
  background: published ? '#22c55e' : '#e2e8f0',
  boxShadow: published ? '0 0 0 3px rgba(34, 197, 94, 0.12)' : 'inset 0 0 0 1px rgba(148, 163, 184, 0.5)',
  flexShrink: 0,
});

export const treeLoadingStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  minHeight: 44,
  margin: '2px 0',
  padding: '0 11px',
  border: '1px solid #e2e8f0',
  borderRadius: 9,
  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
  color: '#64748b',
  fontSize: '0.78rem',
  fontWeight: 750,
};

export const treeContainerStyle: CSSProperties = {
  display: 'grid',
  gap: 4,
};

export const clipboardPillStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  alignSelf: 'flex-start',
  gap: 6,
  minHeight: 24,
  margin: '0 8px 8px',
  padding: '0 9px',
  border: '1px solid #bfdbfe',
  borderRadius: 999,
  background: '#eff6ff',
  color: '#1d4ed8',
  fontSize: '0.72rem',
  fontWeight: 800,
};

export const missingPageCardStyle: CSSProperties = {
  display: 'grid',
  gap: 8,
  margin: '0 8px 10px',
  padding: 10,
  border: '1px solid #fbbf24',
  borderRadius: 10,
  background: '#fffbeb',
  color: '#334155',
};

export const missingPageTitleStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  color: '#92400e',
  fontSize: '0.78rem',
  fontWeight: 850,
};

export const missingPageCopyStyle: CSSProperties = {
  color: '#475569',
  fontSize: '0.72rem',
  lineHeight: 1.45,
};

export const missingPageActionStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  justifySelf: 'start',
  minHeight: 28,
  padding: '0 10px',
  border: '1px solid #f59e0b',
  borderRadius: 8,
  background: '#fff7ed',
  color: '#92400e',
  fontSize: '0.74rem',
  fontWeight: 850,
  cursor: 'pointer',
};

export const columnsQuickCardStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 8,
  margin: '0 8px 10px',
  padding: 10,
  border: '1px solid #bfdbfe',
  borderRadius: 10,
  background: '#eff6ff',
  color: '#0f172a',
};

export const columnsQuickTitleStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  fontSize: '0.8rem',
  fontWeight: 800,
};

export const columnsQuickMetaStyle: CSSProperties = {
  color: '#475569',
  fontSize: '0.72rem',
  fontWeight: 600,
};

export const columnsQuickActionsStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 6,
};

export const columnsQuickButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 30,
  padding: '0 8px',
  border: '1px solid #93c5fd',
  borderRadius: 8,
  background: '#fff',
  color: '#1d4ed8',
  fontSize: '0.73rem',
  fontWeight: 800,
  textDecoration: 'none',
  cursor: 'pointer',
};
