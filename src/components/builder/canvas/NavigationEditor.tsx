'use client';

import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { normalizeLocale, type Locale } from '@/lib/locales';
import type { BuilderNavItem } from '@/lib/builder/site/types';
import { getNavigationCopy } from './navigation-copy';
import styles from './SandboxPage.module.css';

type NavigationIconName = 'plus' | 'up' | 'down' | 'edit' | 'trash' | 'link' | 'save' | 'close';

function NavigationIcon({ name }: { name: NavigationIconName }) {
  let icon: ReactNode;

  switch (name) {
    case 'plus':
      icon = (
        <>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </>
      );
      break;
    case 'up':
      icon = <path d="m7 11 5-5 5 5M12 6v12" />;
      break;
    case 'down':
      icon = <path d="m7 13 5 5 5-5M12 18V6" />;
      break;
    case 'edit':
      icon = (
        <>
          <path d="M5 18.5h4.2L18.4 9.3a2 2 0 0 0 0-2.8l-.9-.9a2 2 0 0 0-2.8 0L5.5 14.8 5 18.5Z" />
          <path d="m13.7 6.7 3.6 3.6" />
        </>
      );
      break;
    case 'trash':
      icon = (
        <>
          <path d="M5.5 7h13" />
          <path d="M9 7V5.5h6V7" />
          <path d="M7.5 7.5 8.2 19h7.6l.7-11.5" />
          <path d="M10.5 10.5v5" />
          <path d="M13.5 10.5v5" />
        </>
      );
      break;
    case 'link':
      icon = (
        <>
          <path d="M9.5 14.5 14.5 9.5" />
          <path d="M10.5 7.5 12 6a3.5 3.5 0 0 1 5 5l-1.5 1.5" />
          <path d="M13.5 16.5 12 18a3.5 3.5 0 0 1-5-5l1.5-1.5" />
        </>
      );
      break;
    case 'save':
      icon = (
        <>
          <path d="M5 5h11l3 3v11H5V5Z" />
          <path d="M8 5v5h7V5" />
          <path d="M8 19v-5h8v5" />
        </>
      );
      break;
    case 'close':
      icon = (
        <>
          <path d="M7 7l10 10" />
          <path d="M17 7 7 17" />
        </>
      );
      break;
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {icon}
    </svg>
  );
}

function labelForLocale(item: BuilderNavItem, locale: Locale): string {
  if (typeof item.label === 'string') return item.label;
  return item.label[locale] || item.label.ko || item.label.en || item.label['zh-hant'] || '';
}

function localizedLabel(
  currentLabel: BuilderNavItem['label'],
  locale: Locale,
  nextLabel: string,
): BuilderNavItem['label'] {
  if (typeof currentLabel === 'string') return nextLabel;
  return {
    ...currentLabel,
    [locale]: nextLabel,
  };
}

function updateNavigationItem(
  items: BuilderNavItem[],
  itemId: string,
  updater: (item: BuilderNavItem) => BuilderNavItem,
): BuilderNavItem[] {
  return items.map((item) => {
    if (item.id === itemId) return updater(item);
    if (!item.children?.length) return item;
    return {
      ...item,
      children: updateNavigationItem(item.children, itemId, updater),
    };
  });
}

function findNavigationItem(items: BuilderNavItem[], itemId: string): BuilderNavItem | undefined {
  for (const item of items) {
    if (item.id === itemId) return item;
    const child = item.children?.length ? findNavigationItem(item.children, itemId) : undefined;
    if (child) return child;
  }
  return undefined;
}

function removeNavigationItem(items: BuilderNavItem[], itemId: string): BuilderNavItem[] {
  return items
    .filter((item) => item.id !== itemId)
    .map((item) => (
      item.children?.length
        ? { ...item, children: removeNavigationItem(item.children, itemId) }
        : item
    ));
}

function moveNavigationItem(
  items: BuilderNavItem[],
  itemId: string,
  direction: 'up' | 'down',
): BuilderNavItem[] {
  const index = items.findIndex((item) => item.id === itemId);
  if (index >= 0) {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return items;
    const next = [...items];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    return next;
  }

  return items.map((item) => (
    item.children?.length
      ? { ...item, children: moveNavigationItem(item.children, itemId, direction) }
      : item
  ));
}

function countNavigationItems(items: BuilderNavItem[]): number {
  let count = 0;
  for (const item of items) {
    count += 1;
    if (item.children?.length) count += countNavigationItems(item.children);
  }
  return count;
}

export default function NavigationEditor({
  locale,
  focusItemId,
  addChildParentId,
  onFocusHandled,
  onAddChildHandled,
  onNavigationChange,
}: {
  locale: string;
  focusItemId?: string | null;
  addChildParentId?: string | null;
  onFocusHandled?: () => void;
  onAddChildHandled?: () => void;
  onNavigationChange?: (items: BuilderNavItem[]) => void;
}) {
  const editorLocale = normalizeLocale(locale);
  const copy = getNavigationCopy(editorLocale);
  const labelInputRef = useRef<HTMLInputElement | null>(null);
  const addChildRequestRef = useRef<string | null>(null);
  const [items, setItems] = useState<BuilderNavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editHref, setEditHref] = useState('');
  const navigationItemCount = countNavigationItems(items);
  const navigationStatusLabel = loading ? copy.loading : copy.itemCountLabel(navigationItemCount);

  const fetchNav = useCallback(async () => {
    try {
      const res = await fetch(`/api/builder/site/navigation?locale=${locale}`, {
        credentials: 'same-origin',
      });
      if (res.ok) {
        const data = (await res.json()) as { navigation: BuilderNavItem[] };
        setItems(data.navigation);
        onNavigationChange?.(data.navigation);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [locale, onNavigationChange]);

  useEffect(() => {
    fetchNav();
  }, [fetchNav]);

  const saveNav = useCallback(
    async (nextItems: BuilderNavItem[]) => {
      setSaving(true);
      setSaveError(null);
      onNavigationChange?.(nextItems);
      try {
        const response = await fetch('/api/builder/site/navigation', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            locale,
            navigation: nextItems,
          }),
        });
        if (!response.ok) throw new Error(copy.titles.saveError);
        const payload = (await response.json().catch(() => null)) as { navigation?: BuilderNavItem[] } | null;
        if (Array.isArray(payload?.navigation)) {
          setItems(payload.navigation);
          onNavigationChange?.(payload.navigation);
        }
      } catch {
        setSaveError(copy.titles.saveError);
      } finally {
        setSaving(false);
      }
    },
    [copy.titles.saveError, locale, onNavigationChange],
  );

  const handleAdd = () => {
    const id = `nav-${Date.now().toString(36)}`;
    const next = [
      ...items,
      {
        id,
        label: { ko: copy.titles.newItem, 'zh-hant': copy.titles.newItem, en: copy.titles.newItem },
        href: '/',
        pageId: `external-${id}`,
      },
    ];
    setItems(next);
    saveNav(next);
  };

  const handleAddChild = useCallback((parentId: string) => {
    const id = `${parentId}-child-${Date.now().toString(36)}`;
    const child: BuilderNavItem = {
      id,
      label: { ko: copy.titles.newSubmenu, 'zh-hant': copy.titles.newSubmenu, en: copy.titles.newSubmenu },
      href: '/',
      pageId: `external-${id}`,
    };
    const next = updateNavigationItem(items, parentId, (item) => ({
      ...item,
      children: [...(item.children ?? []), child],
    }));
    setItems(next);
    setEditingId(id);
    setEditLabel(labelForLocale(child, editorLocale));
    setEditHref(child.href);
    saveNav(next);
    window.setTimeout(() => labelInputRef.current?.focus(), 0);
  }, [copy.titles.newSubmenu, editorLocale, items, saveNav]);

  const handleDelete = (id: string) => {
    const next = removeNavigationItem(items, id);
    setItems(next);
    saveNav(next);
  };

  const handleMove = (id: string, direction: 'up' | 'down') => {
    const next = moveNavigationItem(items, id, direction);
    if (next === items) return;
    setItems(next);
    saveNav(next);
  };

  const startEdit = useCallback((item: BuilderNavItem) => {
    setEditingId(item.id);
    setEditLabel(labelForLocale(item, editorLocale));
    setEditHref(item.href);
    window.setTimeout(() => labelInputRef.current?.focus(), 0);
  }, [editorLocale]);

  useEffect(() => {
    if (!focusItemId || loading) return;
    const item = findNavigationItem(items, focusItemId);
    if (!item) {
      onFocusHandled?.();
      return;
    }
    startEdit(item);
    onFocusHandled?.();
  }, [focusItemId, items, loading, onFocusHandled, startEdit]);

  useEffect(() => {
    if (!addChildParentId) {
      addChildRequestRef.current = null;
      return;
    }
    if (loading || addChildRequestRef.current === addChildParentId) return;
    addChildRequestRef.current = addChildParentId;
    const parent = findNavigationItem(items, addChildParentId);
    if (parent) {
      handleAddChild(addChildParentId);
    }
    onAddChildHandled?.();
  }, [addChildParentId, handleAddChild, items, loading, onAddChildHandled]);

  const commitEdit = () => {
    if (!editingId) return;
    const nextLabel = editLabel.trim() || copy.titles.newItem;
    const nextHref = editHref.trim() || '/';
    const next = updateNavigationItem(
      items,
      editingId,
      (item) => ({
        ...item,
        label: localizedLabel(item.label, editorLocale, nextLabel),
        href: nextHref,
      }),
    );
    setItems(next);
    saveNav(next);
    setEditingId(null);
  };

  const renderEditForm = (itemId: string) => (
    <div key={itemId} className={styles.navigationEditForm} data-builder-nav-edit-id={itemId}>
      <label className={styles.navigationEditRow}>
        <span>{copy.labels.label}</span>
        <input
          type="text"
          value={editLabel}
          ref={labelInputRef}
          placeholder={copy.placeholders.label}
          onChange={(e) => setEditLabel(e.target.value)}
        />
      </label>
      <label className={styles.navigationEditRow}>
        <span>{copy.labels.href}</span>
        <input
          type="text"
          value={editHref}
          placeholder={copy.placeholders.href}
          onChange={(e) => setEditHref(e.target.value)}
        />
      </label>
      <div className={styles.navigationEditActions}>
        <button
          type="button"
          className={styles.navigationTextButton}
          onClick={() => setEditingId(null)}
        >
          <NavigationIcon name="close" />
          {copy.actions.cancel}
        </button>
        <button
          type="button"
          className={`${styles.navigationTextButton} ${styles.navigationTextButtonPrimary}`}
          onClick={commitEdit}
        >
          <NavigationIcon name="save" />
          {copy.actions.save}
        </button>
      </div>
    </div>
  );

  const renderItemRow = (item: BuilderNavItem, isChild = false) => {
    const label = labelForLocale(item, editorLocale) || copy.titles.untitled;
    return (
      <div
        key={item.id}
        className={styles.navigationItemRow}
        data-builder-nav-item-row={item.id}
        data-depth={isChild ? 'child' : 'root'}
      >
        <div className={styles.navigationItemTop}>
          <div className={styles.navigationItemText}>
            <span className={styles.navigationItemTitleLine}>
              {isChild ? <span className={styles.navigationItemBadge}>{copy.titles.megaBadge}</span> : null}
              <strong className={styles.navigationItemTitle}>{label}</strong>
            </span>
            <span className={styles.navigationItemPath} title={item.href} aria-label={`${copy.labels.path}: ${item.href}`}>
              <NavigationIcon name="link" />
              <span>{item.href}</span>
            </span>
          </div>
          <div className={styles.navigationItemActions}>
            <button
              type="button"
              className={styles.navigationIconButton}
              onClick={() => handleMove(item.id, 'up')}
              title={isChild ? `${copy.titles.megaBadge} ${copy.titles.moveUp}` : copy.titles.moveUp}
              aria-label={isChild ? `${copy.titles.megaBadge} ${copy.titles.moveUp}` : copy.titles.moveUp}
            >
              <NavigationIcon name="up" />
            </button>
            <button
              type="button"
              className={styles.navigationIconButton}
              onClick={() => handleMove(item.id, 'down')}
              title={isChild ? `${copy.titles.megaBadge} ${copy.titles.moveDown}` : copy.titles.moveDown}
              aria-label={isChild ? `${copy.titles.megaBadge} ${copy.titles.moveDown}` : copy.titles.moveDown}
            >
              <NavigationIcon name="down" />
            </button>
            {!isChild ? (
              <button
                type="button"
                className={styles.navigationIconButton}
                onClick={() => handleAddChild(item.id)}
                title={copy.titles.addChild}
                aria-label={copy.titles.addChild}
              >
                <NavigationIcon name="plus" />
              </button>
            ) : null}
            <button
              type="button"
              className={styles.navigationIconButton}
              onClick={() => startEdit(item)}
              title={copy.titles.edit}
              aria-label={copy.titles.edit}
            >
              <NavigationIcon name="edit" />
            </button>
            <button
              type="button"
              className={`${styles.navigationIconButton} ${styles.navigationIconButtonDanger}`}
              onClick={() => handleDelete(item.id)}
              title={isChild ? `${copy.titles.megaBadge} ${copy.titles.delete}` : copy.titles.delete}
              aria-label={isChild ? `${copy.titles.megaBadge} ${copy.titles.delete}` : copy.titles.delete}
            >
              <NavigationIcon name="trash" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={styles.navigationEditor}
      data-builder-navigation-editor="true"
      data-builder-navigation-loading={loading ? 'true' : 'false'}
      data-builder-navigation-count={navigationItemCount}
      aria-busy={loading ? 'true' : 'false'}
    >
      <div className={styles.navigationEditorHeader}>
        <div>
          <span>{copy.title}</span>
          <strong>{navigationStatusLabel}</strong>
        </div>
        <button
          type="button"
          className={styles.navigationAddButton}
          onClick={handleAdd}
          disabled={saving}
        >
          <NavigationIcon name="plus" />
          {copy.addButton}
        </button>
      </div>

      {loading ? (
        <p className={styles.navigationEditorState}>{copy.loading}</p>
      ) : items.length === 0 ? (
        <p className={styles.navigationEditorState}>{copy.emptyState}</p>
      ) : (
        <div className={styles.navigationItemList}>
          {items.map((item) => (
            <div key={item.id} className={styles.navigationItemGroup}>
              {editingId === item.id ? renderEditForm(item.id) : renderItemRow(item)}
              {item.children?.length ? (
                <div className={styles.navigationChildList}>
                  {item.children.map((child) => (
                    editingId === child.id ? renderEditForm(child.id) : renderItemRow(child, true)
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {saving && (
        <p className={styles.navigationEditorSaving}>{copy.titles.saving}</p>
      )}
      {saveError ? (
        <p role="alert" className={styles.navigationEditorError}>{saveError}</p>
      ) : null}
    </div>
  );
}
