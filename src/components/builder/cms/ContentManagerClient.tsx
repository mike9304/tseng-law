'use client';

import { useEffect, useMemo, useState } from 'react';
import AssetLibraryModal from '@/components/builder/editor/AssetLibraryModal';
import {
  createBuilderCmsRecordSavedView,
  normalizeBuilderCmsRecordSavedViews,
  queryBuilderCmsRecords,
  type BuilderCmsRecordFilter,
  type BuilderCmsRecordFilterOperator,
  type BuilderCmsRecordSavedView,
} from '@/lib/builder/cms-record-query';
import {
  builderCmsFieldTypes,
  builderCmsPermissionActors,
  type BuilderCmsCollectionDetail,
  type BuilderCmsCollectionSummary,
  type BuilderCmsFieldDefinition,
  type BuilderCmsFieldType,
  type BuilderCmsImageValue,
  type BuilderCmsIndexDefinition,
  type BuilderCmsIndexSortDirection,
  type BuilderCmsPermissionActor,
  type BuilderCmsPermissions,
  type BuilderCmsRecord,
  type BuilderCmsRecordRevision,
  type BuilderCmsRecordStatus,
} from '@/lib/builder/cms-types';
import type { BuilderAssetListItem } from '@/lib/builder/assets';
import type { BuilderCollectionSummary } from '@/lib/builder/cms';
import type { Locale } from '@/lib/locales';

type ApiCollectionList = {
  ok: boolean;
  collections: BuilderCollectionSummary[];
  editableCollections: BuilderCmsCollectionSummary[];
  error?: string;
};

type ApiCollectionDetail = {
  ok: boolean;
  detail?: BuilderCmsCollectionDetail;
  error?: string;
  issues?: string[];
};

type ApiRecordMutation = {
  ok: boolean;
  record?: BuilderCmsRecord;
  error?: string;
  issues?: string[];
};

type ApiBulkRecordMutation = {
  ok: boolean;
  action?: string;
  status?: BuilderCmsRecordStatus;
  requested?: number;
  updated?: number;
  deleted?: number;
  records?: BuilderCmsRecord[];
  missingRecordIds?: string[];
  error?: string;
  issues?: string[];
};

type ApiCsvImport = {
  ok: boolean;
  imported?: number;
  summary?: {
    headers: string[];
    mappedColumns: { target: string; source: string }[];
    skippedColumns: string[];
  };
  error?: string;
  issues?: string[];
};

type ContentManagerClientProps = {
  locale: Locale;
  siteId: string;
  initialSourceCollections: BuilderCollectionSummary[];
  initialEditableCollections: BuilderCmsCollectionSummary[];
};

type RecordFormValue = string | boolean | BuilderCmsImageValue;
type RecordFormState = Record<string, RecordFormValue>;
type RecordSortDirection = 'asc' | 'desc';
type CsvImportMode = 'append' | 'replace';
type CmsPermissionOperation = keyof BuilderCmsPermissions;

const DEFAULT_RECORD_PAGE_SIZE = 10;
const RECORD_VIEW_STORAGE_PREFIX = 'builder-cms-record-views';

const cmsPermissionOperations: { action: CmsPermissionOperation; label: string; hint: string }[] = [
  { action: 'read', label: 'Read records', hint: 'Allows viewing and export.' },
  { action: 'create', label: 'Create records', hint: 'Allows new records, duplicates, and CSV append.' },
  { action: 'update', label: 'Update records', hint: 'Allows edits and revision restores.' },
  { action: 'delete', label: 'Delete records', hint: 'Allows deletes and CSV replace.' },
];

const cmsPermissionActorLabels: Record<BuilderCmsPermissionActor, string> = {
  public: 'Public',
  member: 'Member',
  staff: 'Staff',
  admin: 'Admin',
};

const cmsFieldTypeLabels: Record<BuilderCmsFieldType, string> = {
  text: 'Text',
  'rich-text': 'Rich text',
  slug: 'Slug',
  number: 'Number',
  boolean: 'Boolean',
  date: 'Date',
  image: 'Image',
  email: 'Email',
  url: 'URL',
  'string-list': 'Tags / string list',
  reference: 'Reference',
};

const panelStyle = {
  display: 'grid',
  gridTemplateColumns: 'minmax(220px, 280px) minmax(0, 1fr)',
  gap: 16,
  alignItems: 'start',
} satisfies React.CSSProperties;

const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 12,
} satisfies React.CSSProperties;

const inputStyle = {
  width: '100%',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  padding: '9px 10px',
  fontSize: 13,
  color: '#0f172a',
  background: '#ffffff',
} satisfies React.CSSProperties;

const labelStyle = {
  display: 'grid',
  gap: 6,
  color: '#475569',
  fontSize: 12,
  fontWeight: 700,
} satisfies React.CSSProperties;

export default function ContentManagerClient({
  locale,
  siteId,
  initialSourceCollections,
  initialEditableCollections,
}: ContentManagerClientProps) {
  const [sourceCollections, setSourceCollections] = useState(initialSourceCollections);
  const [collections, setCollections] = useState(initialEditableCollections);
  const [selectedCollectionId, setSelectedCollectionId] = useState(collections[0]?.collectionId ?? '');
  const [detail, setDetail] = useState<BuilderCmsCollectionDetail | null>(null);
  const [permissionDraft, setPermissionDraft] = useState<BuilderCmsPermissions>(() => defaultCmsPermissionDraft());
  const [recordForm, setRecordForm] = useState<RecordFormState>({});
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [recordQuery, setRecordQuery] = useState('');
  const [recordSortBy, setRecordSortBy] = useState('updatedAt');
  const [recordSortDirection, setRecordSortDirection] = useState<RecordSortDirection>('desc');
  const [recordFilters, setRecordFilters] = useState<BuilderCmsRecordFilter[]>([]);
  const [recordFilterField, setRecordFilterField] = useState('status');
  const [recordFilterOperator, setRecordFilterOperator] = useState<BuilderCmsRecordFilterOperator>('is');
  const [recordFilterValue, setRecordFilterValue] = useState('published');
  const [recordPage, setRecordPage] = useState(1);
  const [recordPageSize, setRecordPageSize] = useState(DEFAULT_RECORD_PAGE_SIZE);
  const [savedViews, setSavedViews] = useState<BuilderCmsRecordSavedView[]>([]);
  const [selectedViewId, setSelectedViewId] = useState('');
  const [newViewName, setNewViewName] = useState('');
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);
  const [csvImportText, setCsvImportText] = useState('');
  const [csvImportMode, setCsvImportMode] = useState<CsvImportMode>('append');
  const [csvColumnMap, setCsvColumnMap] = useState<Record<string, string>>({});
  const [csvImportSummary, setCsvImportSummary] = useState<ApiCsvImport['summary'] | null>(null);
  const [assetFieldKey, setAssetFieldKey] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedSummary = useMemo(
    () => collections.find((collection) => collection.collectionId === selectedCollectionId) ?? null,
    [collections, selectedCollectionId],
  );
  const referenceCollectionOptions = useMemo(() => {
    const options = [
      ...sourceCollections.map((collection) => ({
        collectionId: collection.id,
        name: collection.title,
      })),
      ...collections.map((collection) => ({
        collectionId: collection.collectionId,
        name: collection.name,
      })),
    ];
    const seen = new Set<string>();
    return options.filter((option) => {
      if (seen.has(option.collectionId)) return false;
      seen.add(option.collectionId);
      return true;
    });
  }, [collections, sourceCollections]);

  const indexDraft = useMemo(() => {
    if (!detail) return [];
    return detail.indexes.map((index) => ({
      ...index,
      fields: index.fields.map((field) => ({ ...field })),
    }));
  }, [detail]);

  const effectiveRecordSortBy = useMemo(() => {
    if (!detail) return recordSortBy;
    const isSystemSort = systemRecordSortOptions.some((option) => option.value === recordSortBy);
    const isFieldSort = detail.fields.some((field) => field.key === recordSortBy);
    return isSystemSort || isFieldSort ? recordSortBy : 'updatedAt';
  }, [detail, recordSortBy]);

  const recordQueryResult = useMemo(() => {
    if (!detail) {
      return {
        records: [],
        total: 0,
        page: 1,
        pageSize: recordPageSize,
        pageCount: 1,
        filteredRecordIds: [],
      };
    }
    return queryBuilderCmsRecords(detail.records, detail.fields, {
      query: recordQuery,
      filters: recordFilters,
      sortBy: effectiveRecordSortBy,
      sortDirection: recordSortDirection,
      page: recordPage,
      pageSize: recordPageSize,
    });
  }, [detail, effectiveRecordSortBy, recordFilters, recordPage, recordPageSize, recordQuery, recordSortDirection]);

  const visibleRecords = recordQueryResult.records;
  const selectedRecordIdSet = useMemo(() => new Set(selectedRecordIds), [selectedRecordIds]);
  const visibleRecordIds = useMemo(() => visibleRecords.map((record) => record.recordId), [visibleRecords]);
  const allVisibleRecordsSelected = visibleRecordIds.length > 0
    && visibleRecordIds.every((recordId) => selectedRecordIdSet.has(recordId));
  const csvHeaders = useMemo(() => parseCsvHeaderRow(csvImportText), [csvImportText]);
  const csvTargetColumns = useMemo(() => {
    if (!detail) return [];
    return ['recordId', 'status', 'locale', ...detail.fields.map((field) => field.key)];
  }, [detail]);
  const effectiveCsvColumnMap = useMemo(() => {
    const headerSet = new Set(csvHeaders);
    return Object.fromEntries(csvTargetColumns.map((target) => [
      target,
      csvColumnMap[target] ?? (headerSet.has(target) ? target : ''),
    ]));
  }, [csvColumnMap, csvHeaders, csvTargetColumns]);

  useEffect(() => {
    setPermissionDraft(detail ? normalizePermissionDraft(detail.permissions) : defaultCmsPermissionDraft());
  }, [detail]);

  useEffect(() => {
    if (!detail) {
      setSavedViews([]);
      setSelectedViewId('');
      return;
    }
    const nextFilterField = defaultRecordFilterField(detail.fields);
    const nextFilterOperator = recordFilterOperatorsForField(detail.fields, nextFilterField)[0]?.value ?? 'contains';
    setRecordPage(1);
    setRecordFilterField(nextFilterField);
    setRecordFilterOperator(nextFilterOperator);
    setRecordFilterValue(defaultRecordFilterValue(nextFilterField, nextFilterOperator));
    setSelectedRecordIds([]);
    if (typeof window === 'undefined') return;
    setSavedViews(readSavedRecordViews(siteId, locale, detail.collectionId));
    setSelectedViewId('');
  }, [detail?.collectionId, detail, locale, siteId]);

  useEffect(() => {
    if (recordQueryResult.page !== recordPage) setRecordPage(recordQueryResult.page);
  }, [recordPage, recordQueryResult.page]);

  async function refreshCollections(nextSelectedId?: string) {
    const response = await fetch(`${apiBase(siteId)}?locale=${locale}`, { credentials: 'same-origin' });
    const payload = await response.json() as ApiCollectionList;
    if (!response.ok || !payload.ok) throw new Error(payload.error ?? 'Failed to refresh collections.');
    setSourceCollections(payload.collections ?? []);
    setCollections(payload.editableCollections ?? []);
    if (nextSelectedId) setSelectedCollectionId(nextSelectedId);
  }

  async function loadDetail(collectionId = selectedCollectionId) {
    if (!collectionId) {
      setDetail(null);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`${apiBase(siteId)}/${encodeURIComponent(collectionId)}?locale=${locale}`, {
        credentials: 'same-origin',
      });
      const payload = await response.json() as ApiCollectionDetail;
      if (!response.ok || !payload.ok || !payload.detail) {
        throw new Error(payload.error ?? 'Failed to load collection.');
      }
      setDetail(payload.detail);
      setRecordForm(createEmptyRecordForm(payload.detail.fields));
      setEditingRecordId(null);
      setCsvColumnMap({});
      setCsvImportSummary(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load collection.');
    } finally {
      setBusy(false);
    }
  }

  async function createCollection(formData: FormData) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const payload = {
        name: String(formData.get('name') ?? ''),
        collectionId: String(formData.get('collectionId') ?? ''),
        description: String(formData.get('description') ?? ''),
        localized: formData.get('localized') === 'on',
      };
      const response = await fetch(`${apiBase(siteId)}?locale=${locale}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as ApiCollectionDetail;
      if (!response.ok || !result.ok || !result.detail) {
        throw new Error(result.issues?.join('\n') || result.error || 'Failed to create collection.');
      }
      await refreshCollections(result.detail.collectionId);
      setDetail(result.detail);
      setRecordForm(createEmptyRecordForm(result.detail.fields));
      setMessage(`Created ${result.detail.name}.`);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to create collection.');
    } finally {
      setBusy(false);
    }
  }

  async function deleteCollection(collectionId: string) {
    if (!collectionId || !window.confirm(`Delete ${collectionId}?`)) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`${apiBase(siteId)}/${encodeURIComponent(collectionId)}?locale=${locale}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      const result = await response.json() as ApiCollectionDetail;
      if (!response.ok || !result.ok) throw new Error(result.error ?? 'Failed to delete collection.');
      await refreshCollections();
      setSelectedCollectionId('');
      setDetail(null);
      setMessage(`Deleted ${collectionId}.`);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete collection.');
    } finally {
      setBusy(false);
    }
  }

  async function savePermissions() {
    if (!detail) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}?locale=${locale}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: permissionDraft }),
      });
      const result = await response.json() as ApiCollectionDetail;
      if (!response.ok || !result.ok || !result.detail) {
        throw new Error(result.issues?.join('\n') || result.error || 'Failed to save permissions.');
      }
      setDetail(result.detail);
      setPermissionDraft(normalizePermissionDraft(result.detail.permissions));
      await refreshCollections(result.detail.collectionId);
      setMessage('Permissions updated.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save permissions.');
    } finally {
      setBusy(false);
    }
  }

  function togglePermissionActor(
    action: CmsPermissionOperation,
    actor: BuilderCmsPermissionActor,
    enabled: boolean,
  ) {
    setPermissionDraft((current) => togglePermissionActorValue(current, action, actor, enabled));
  }

  function addRecordFilter() {
    if (!detail) return;
    const operator = recordFilterOperator;
    const fieldKey = recordFilterField || defaultRecordFilterField(detail.fields);
    const value = operator === 'empty' || operator === 'not-empty' ? undefined : recordFilterValue;
    setRecordFilters((current) => [
      ...current,
      {
        filterId: `filter-${Date.now()}-${current.length + 1}`,
        fieldKey,
        operator,
        value,
      },
    ]);
    setRecordPage(1);
    setSelectedViewId('');
  }

  function removeRecordFilter(filterId: string) {
    setRecordFilters((current) => current.filter((filter) => filter.filterId !== filterId));
    setRecordPage(1);
    setSelectedViewId('');
  }

  function clearRecordFilters() {
    setRecordQuery('');
    setRecordFilters([]);
    setRecordPage(1);
    setSelectedViewId('');
  }

  function toggleRecordSelection(recordId: string, selected: boolean) {
    setSelectedRecordIds((current) => {
      if (selected) return current.includes(recordId) ? current : [...current, recordId];
      return current.filter((candidate) => candidate !== recordId);
    });
  }

  function toggleVisibleRecordSelection(selected: boolean) {
    setSelectedRecordIds((current) => {
      const visibleIdSet = new Set(visibleRecordIds);
      if (!selected) return current.filter((recordId) => !visibleIdSet.has(recordId));
      const next = new Set(current);
      for (const recordId of visibleRecordIds) next.add(recordId);
      return [...next];
    });
  }

  function applyRecordSavedView(viewId: string) {
    const view = savedViews.find((candidate) => candidate.viewId === viewId);
    if (!view) {
      setSelectedViewId('');
      return;
    }
    setSelectedViewId(view.viewId);
    setRecordQuery(view.query);
    setRecordFilters(view.filters);
    setRecordSortBy(view.sortBy);
    setRecordSortDirection(view.sortDirection);
    setRecordPageSize(view.pageSize);
    setRecordPage(1);
  }

  function saveRecordView() {
    if (!detail) return;
    try {
      const view = createBuilderCmsRecordSavedView({
        name: newViewName || `${detail.name} view`,
        query: recordQuery,
        filters: recordFilters,
        sortBy: effectiveRecordSortBy,
        sortDirection: recordSortDirection,
        pageSize: recordPageSize,
      });
      const nextViews = [
        view,
        ...savedViews.filter((candidate) => candidate.name.toLowerCase() !== view.name.toLowerCase()),
      ].slice(0, 12);
      setSavedViews(nextViews);
      writeSavedRecordViews(siteId, locale, detail.collectionId, nextViews);
      setSelectedViewId(view.viewId);
      setNewViewName('');
      setMessage(`Saved view "${view.name}".`);
      setError(null);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save view.');
    }
  }

  function deleteRecordSavedView(viewId: string) {
    if (!detail) return;
    const nextViews = savedViews.filter((view) => view.viewId !== viewId);
    setSavedViews(nextViews);
    writeSavedRecordViews(siteId, locale, detail.collectionId, nextViews);
    if (selectedViewId === viewId) setSelectedViewId('');
    setMessage('Saved view deleted.');
  }

  async function addCollectionField(formData: FormData) {
    if (!detail) return;
    const type = normalizeCmsFieldType(formData.get('type'));
    const relationCollectionId = type === 'reference'
      ? String(formData.get('relationCollectionId') ?? '').trim() || undefined
      : undefined;
    const nextField: BuilderCmsFieldDefinition = {
      fieldId: `field-${Date.now().toString(36)}`,
      key: String(formData.get('key') ?? '').trim(),
      label: String(formData.get('label') ?? '').trim(),
      type,
      localized: formData.get('localized') === 'on',
      repeated: formData.get('repeated') === 'on',
      required: formData.get('required') === 'on',
      unique: formData.get('unique') === 'on',
      helpText: String(formData.get('helpText') ?? '').trim() || undefined,
      defaultValue: defaultValueFromFieldForm(formData),
      validation: validationFromFieldForm(formData),
      relationCollectionId,
    };
    await saveCollectionFields([...detail.fields, nextField]);
  }

  async function saveCollectionFields(fields: BuilderCmsCollectionDetail['fields']) {
    if (!detail) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}?locale=${locale}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
      });
      const result = await response.json() as ApiCollectionDetail;
      if (!response.ok || !result.ok || !result.detail) {
        throw new Error(result.issues?.join('\n') || result.error || 'Failed to save fields.');
      }
      setDetail(result.detail);
      setRecordForm((current) => ({
        ...createEmptyRecordForm(result.detail!.fields),
        ...current,
      }));
      await refreshCollections(result.detail.collectionId);
      setMessage('Fields updated.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save fields.');
    } finally {
      setBusy(false);
    }
  }

  async function addCollectionIndex(formData: FormData) {
    if (!detail) return;
    const fieldKeys = String(formData.get('fields') ?? '')
      .split(',')
      .map((field) => field.trim())
      .filter(Boolean);
    if (fieldKeys.length === 0) {
      setError('Index fields are required.');
      return;
    }
    const fieldKeySet = new Set(detail.fields.map((field) => field.key));
    const unknownField = fieldKeys.find((field) => !fieldKeySet.has(field));
    if (unknownField) {
      setError(`Unknown index field: ${unknownField}`);
      return;
    }
    const direction: BuilderCmsIndexSortDirection = formData.get('direction') === 'desc' ? 'desc' : 'asc';
    const nextIndex: BuilderCmsIndexDefinition = {
      indexId: `idx-${fieldKeys.join('-')}-${Date.now()}`,
      name: String(formData.get('name') ?? '').trim() || `${fieldKeys.join(', ')} index`,
      fields: fieldKeys.map((fieldKey) => ({
        fieldKey,
        direction,
      })),
      unique: formData.get('unique') === 'on',
      createdAt: new Date().toISOString(),
    };
    await saveCollectionIndexes([...indexDraft, nextIndex]);
  }

  async function deleteCollectionIndex(indexId: string) {
    if (!detail) return;
    await saveCollectionIndexes(indexDraft.filter((index) => index.indexId !== indexId));
  }

  async function saveCollectionIndexes(indexes: BuilderCmsCollectionDetail['indexes']) {
    if (!detail) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}?locale=${locale}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ indexes }),
      });
      const result = await response.json() as ApiCollectionDetail;
      if (!response.ok || !result.ok || !result.detail) {
        throw new Error(result.issues?.join('\n') || result.error || 'Failed to save indexes.');
      }
      setDetail(result.detail);
      await refreshCollections(result.detail.collectionId);
      setMessage('Indexes updated.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save indexes.');
    } finally {
      setBusy(false);
    }
  }

  async function saveRecord() {
    if (!detail) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const endpoint = editingRecordId
        ? `${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}/records/${encodeURIComponent(editingRecordId)}?locale=${locale}`
        : `${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}/records?locale=${locale}`;
      const response = await fetch(endpoint, {
        method: editingRecordId ? 'PATCH' : 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: recordForm }),
      });
      const result = await response.json() as {
        ok: boolean;
        record?: BuilderCmsRecord;
        error?: string;
        issues?: string[];
      };
      if (!response.ok || !result.ok || !result.record) {
        throw new Error(result.issues?.join('\n') || result.error || 'Failed to save record.');
      }
      await loadDetail(detail.collectionId);
      await refreshCollections(detail.collectionId);
      setMessage(editingRecordId ? 'Record updated.' : 'Record created.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save record.');
    } finally {
      setBusy(false);
    }
  }

  async function deleteRecord(recordId: string) {
    if (!detail || !window.confirm(`Delete ${recordId}?`)) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(
        `${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}/records/${encodeURIComponent(recordId)}?locale=${locale}`,
        { method: 'DELETE', credentials: 'same-origin' },
      );
      const result = await response.json() as { ok: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error ?? 'Failed to delete record.');
      await loadDetail(detail.collectionId);
      await refreshCollections(detail.collectionId);
      setSelectedRecordIds((current) => current.filter((candidate) => candidate !== recordId));
      setMessage('Record deleted.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete record.');
    } finally {
      setBusy(false);
    }
  }

  async function duplicateRecord(recordId: string) {
    if (!detail) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(
        `${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}/records/${encodeURIComponent(recordId)}/duplicate?locale=${locale}`,
        { method: 'POST', credentials: 'same-origin' },
      );
      const result = await response.json() as ApiRecordMutation;
      if (!response.ok || !result.ok || !result.record) {
        throw new Error(result.issues?.join('\n') || result.error || 'Failed to duplicate record.');
      }
      await loadDetail(detail.collectionId);
      await refreshCollections(detail.collectionId);
      setMessage('Record duplicated.');
    } catch (duplicateError) {
      setError(duplicateError instanceof Error ? duplicateError.message : 'Failed to duplicate record.');
    } finally {
      setBusy(false);
    }
  }

  async function bulkUpdateSelectedRecordsStatus(status: BuilderCmsRecordStatus) {
    if (!detail || selectedRecordIds.length === 0) return;
    const actionLabel = status === 'published' ? 'publish' : status === 'draft' ? 'move to draft' : 'archive';
    if (!window.confirm(`${actionLabel} ${selectedRecordIds.length} selected records?`)) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(
        `${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}/records/bulk?locale=${locale}`,
        {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'status', status, recordIds: selectedRecordIds }),
        },
      );
      const result = await response.json() as ApiBulkRecordMutation;
      if (!response.ok || !result.ok) {
        throw new Error(result.issues?.join('\n') || result.error || 'Failed to update selected records.');
      }
      await loadDetail(detail.collectionId);
      await refreshCollections(detail.collectionId);
      setSelectedRecordIds([]);
      const missing = result.missingRecordIds?.length ? ` ${result.missingRecordIds.length} missing.` : '';
      setMessage(`Updated ${result.updated ?? 0} selected records.${missing}`);
    } catch (bulkError) {
      setError(bulkError instanceof Error ? bulkError.message : 'Failed to update selected records.');
    } finally {
      setBusy(false);
    }
  }

  async function bulkDeleteSelectedRecords() {
    if (!detail || selectedRecordIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedRecordIds.length} selected records?`)) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(
        `${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}/records/bulk?locale=${locale}`,
        {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', recordIds: selectedRecordIds }),
        },
      );
      const result = await response.json() as ApiBulkRecordMutation;
      if (!response.ok || !result.ok) {
        throw new Error(result.issues?.join('\n') || result.error || 'Failed to delete selected records.');
      }
      await loadDetail(detail.collectionId);
      await refreshCollections(detail.collectionId);
      setSelectedRecordIds([]);
      const missing = result.missingRecordIds?.length ? ` ${result.missingRecordIds.length} missing.` : '';
      setMessage(`Deleted ${result.deleted ?? 0} selected records.${missing}`);
    } catch (bulkError) {
      setError(bulkError instanceof Error ? bulkError.message : 'Failed to delete selected records.');
    } finally {
      setBusy(false);
    }
  }

  async function exportCsv() {
    if (!detail) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(
        `${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}/records/csv?locale=${locale}`,
        { credentials: 'same-origin' },
      );
      if (!response.ok) {
        const result = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(result?.error ?? 'Failed to export CSV.');
      }
      const csv = await response.text();
      const filename = filenameFromContentDisposition(response.headers.get('content-disposition'))
        ?? `${detail.slug || detail.collectionId}-records.csv`;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
      setMessage('CSV exported.');
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : 'Failed to export CSV.');
    } finally {
      setBusy(false);
    }
  }

  async function importCsv() {
    if (!detail) return;
    if (!csvImportText.trim()) {
      setError('CSV text is required.');
      return;
    }
    if (csvImportMode === 'replace' && !window.confirm(`Replace all records in ${detail.collectionId}?`)) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(
        `${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}/records/csv?locale=${locale}`,
        {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ csv: csvImportText, mode: csvImportMode, columnMap: effectiveCsvColumnMap }),
        },
      );
      const result = await response.json() as ApiCsvImport;
      if (!response.ok || !result.ok) {
        throw new Error(result.issues?.join('\n') || result.error || 'Failed to import CSV.');
      }
      await loadDetail(detail.collectionId);
      await refreshCollections(detail.collectionId);
      setCsvImportText('');
      setCsvColumnMap({});
      setCsvImportSummary(result.summary ?? null);
      const skipped = result.summary?.skippedColumns.length ? ` Skipped ${result.summary.skippedColumns.length} columns.` : '';
      setMessage(`Imported ${result.imported ?? 0} records.${skipped}`);
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : 'Failed to import CSV.');
    } finally {
      setBusy(false);
    }
  }

  async function restoreRevision(recordId: string, revisionId: string) {
    if (!detail || !window.confirm(`Restore revision ${revisionId}?`)) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(
        `${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}/records/${encodeURIComponent(recordId)}/revisions/${encodeURIComponent(revisionId)}/restore?locale=${locale}`,
        { method: 'POST', credentials: 'same-origin' },
      );
      const result = await response.json() as ApiRecordMutation;
      if (!response.ok || !result.ok || !result.record) {
        throw new Error(result.issues?.join('\n') || result.error || 'Failed to restore revision.');
      }
      await loadDetail(detail.collectionId);
      await refreshCollections(detail.collectionId);
      setMessage('Revision restored.');
    } catch (restoreError) {
      setError(restoreError instanceof Error ? restoreError.message : 'Failed to restore revision.');
    } finally {
      setBusy(false);
    }
  }

  function beginEditRecord(record: BuilderCmsRecord) {
    if (!detail) return;
    setEditingRecordId(record.recordId);
    setRecordForm(createRecordFormFromRecord(detail.fields, record));
  }

  return (
    <>
      <div style={panelStyle}>
        <section className="builder-preview-inspector-card builder-dashboard-sidebar">
        <h2>CMS</h2>
        <div className="builder-dashboard-nav-list">
          {collections.map((collection) => (
            <button
              key={collection.collectionId}
              type="button"
              className={`builder-dashboard-nav-card${collection.collectionId === selectedCollectionId ? ' is-active' : ''}`}
              style={{ textAlign: 'left' }}
              onClick={() => {
                setSelectedCollectionId(collection.collectionId);
                void loadDetail(collection.collectionId);
              }}
            >
              <strong>{collection.name}</strong>
              <span>{collection.recordCount} records</span>
              <small>{collection.collectionId}</small>
            </button>
          ))}
          {collections.length === 0 ? (
            <article className="builder-dashboard-nav-card">
              <strong>No editable CMS collections</strong>
              <span>Create one below</span>
            </article>
          ) : null}
        </div>
      </section>

      <div className="builder-dashboard-grid">
        <section className="builder-preview-inspector-card">
          <h2>New collection</h2>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void createCollection(new FormData(event.currentTarget));
            }}
            style={{ display: 'grid', gap: 14 }}
          >
            <div style={formGridStyle}>
              <label style={labelStyle}>
                Name
                <input name="name" type="text" style={inputStyle} placeholder="Testimonials" disabled={busy} />
              </label>
              <label style={labelStyle}>
                ID
                <input name="collectionId" type="text" style={inputStyle} placeholder="testimonials" disabled={busy} />
              </label>
              <label style={labelStyle}>
                Description
                <input name="description" type="text" style={inputStyle} placeholder="Client quotes" disabled={busy} />
              </label>
              <label style={{ ...labelStyle, alignContent: 'end' }}>
                <span>Localized</span>
                <input name="localized" type="checkbox" disabled={busy} />
              </label>
            </div>
            <div className="builder-dashboard-page-actions">
              <button type="submit" className="builder-action-btn builder-action-btn--primary" disabled={busy}>
                Create collection
              </button>
            </div>
          </form>
        </section>

        {message ? (
          <section className="builder-preview-inspector-card" aria-live="polite">
            <h2>Status</h2>
            <p>{message}</p>
          </section>
        ) : null}

        {error ? (
          <section className="builder-preview-inspector-card" aria-live="assertive">
            <h2>Error</h2>
            <p style={{ whiteSpace: 'pre-line', color: '#b91c1c' }}>{error}</p>
          </section>
        ) : null}

        <section className="builder-preview-inspector-card">
          <h2>Static source collections</h2>
          <div className="builder-dashboard-page-list">
            {sourceCollections.map((collection) => (
              <article key={collection.id} className="builder-dashboard-page-card">
                <div className="builder-dashboard-page-head">
                  <div>
                    <strong>{collection.title}</strong>
                    <span>{collection.sourceLabel}</span>
                  </div>
                  <span className="builder-stage-pill">read-only</span>
                </div>
                <div className="builder-dashboard-page-meta">
                  <span>{collection.recordCount} records</span>
                  <span>{collection.fieldCount} fields</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {selectedSummary && !detail ? (
          <section className="builder-preview-inspector-card">
            <h2>{selectedSummary.name}</h2>
            <div className="builder-dashboard-page-actions">
              <button
                type="button"
                className="builder-action-btn builder-action-btn--primary"
                onClick={() => void loadDetail(selectedSummary.collectionId)}
                disabled={busy}
              >
                Open collection
              </button>
              <button
                type="button"
                className="builder-action-btn"
                onClick={() => void deleteCollection(selectedSummary.collectionId)}
                disabled={busy}
              >
                Delete
              </button>
            </div>
          </section>
        ) : null}

        {detail ? (
          <>
            <section className="builder-preview-inspector-card">
              <h2>{detail.name}</h2>
              <div className="builder-dashboard-kpi-grid">
                <article className="builder-dashboard-kpi-card">
                  <strong>{detail.records.length}</strong>
                  <span>Records</span>
                </article>
                <article className="builder-dashboard-kpi-card">
                  <strong>{detail.fields.length}</strong>
                  <span>Fields</span>
                </article>
                <article className="builder-dashboard-kpi-card">
                  <strong>{detail.indexes.length}</strong>
                  <span>Indexes</span>
                </article>
                <article className="builder-dashboard-kpi-card">
                  <strong>{detail.localized ? 'Locale' : 'Shared'}</strong>
                  <span>Mode</span>
                </article>
              </div>
              <div className="builder-dashboard-page-actions">
                <button
                  type="button"
                  className="builder-action-btn"
                  onClick={() => void deleteCollection(detail.collectionId)}
                  disabled={busy}
                >
                  Delete collection
                </button>
              </div>
            </section>

            <section className="builder-preview-inspector-card">
              <h2>Permissions</h2>
              <div className="builder-dashboard-page-list">
                {cmsPermissionOperations.map((operation) => (
                  <article key={operation.action} className="builder-dashboard-page-card">
                    <div className="builder-dashboard-page-head">
                      <div>
                        <strong>{operation.label}</strong>
                        <span>{operation.hint}</span>
                      </div>
                      <span className="builder-stage-pill">
                        {permissionDraft[operation.action].join(', ')}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                        gap: 8,
                        marginTop: 10,
                      }}
                    >
                      {builderCmsPermissionActors.map((actor) => (
                        <label
                          key={`${operation.action}-${actor}`}
                          style={{
                            alignItems: 'center',
                            border: '1px solid #e2e8f0',
                            borderRadius: 8,
                            color: '#334155',
                            display: 'flex',
                            gap: 8,
                            padding: '8px 10px',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={permissionDraft[operation.action].includes(actor)}
                            disabled={busy || actor === 'admin'}
                            onChange={(event) => {
                              togglePermissionActor(operation.action, actor, event.target.checked);
                            }}
                          />
                          <span>{cmsPermissionActorLabels[actor]}</span>
                        </label>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <div className="builder-dashboard-page-actions" style={{ marginTop: 12 }}>
                <button
                  type="button"
                  className="builder-action-btn builder-action-btn--primary"
                  onClick={() => void savePermissions()}
                  disabled={busy}
                >
                  Save permissions
                </button>
                <span style={{ color: '#64748b', fontSize: 12 }}>Admin remains locked on.</span>
              </div>
            </section>

            <section className="builder-preview-inspector-card">
              <h2>Schema</h2>
              <div className="builder-dashboard-page-list">
                {detail.fields.map((field) => (
                  <article key={field.fieldId} className="builder-dashboard-page-card">
                    <div className="builder-dashboard-page-head">
                      <div>
                        <strong>{field.label}</strong>
                        <span>{field.key}</span>
                      </div>
                      <span className="builder-stage-pill">{field.type}</span>
                    </div>
                    <div className="builder-dashboard-page-meta">
                      <span>{field.required ? 'Required' : 'Optional'}</span>
                      <span>{field.unique ? 'Unique' : 'Not unique'}</span>
                      <span>{field.localized ? 'Localized' : 'Shared'}</span>
                      {field.defaultValue !== undefined ? <span>Default: {formatValue(field.defaultValue)}</span> : null}
                      {field.validation?.min !== undefined ? <span>Min: {field.validation.min}</span> : null}
                      {field.validation?.max !== undefined ? <span>Max: {field.validation.max}</span> : null}
                      {field.validation?.pattern ? <span>Regex: {field.validation.pattern}</span> : null}
                      {field.validation?.options?.length ? (
                        <span>Options: {field.validation.options.join(', ')}</span>
                      ) : null}
                      {field.helpText ? <span>Help: {field.helpText}</span> : null}
                    </div>
                  </article>
                ))}
              </div>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void addCollectionField(new FormData(event.currentTarget));
                  event.currentTarget.reset();
                }}
                style={{ display: 'grid', gap: 10, marginTop: 12 }}
              >
                <div style={formGridStyle}>
                  <label style={labelStyle}>
                    Field label
                    <input name="label" type="text" style={inputStyle} placeholder="Summary" disabled={busy} />
                  </label>
                  <label style={labelStyle}>
                    Field key
                    <input name="key" type="text" style={inputStyle} placeholder="summary" disabled={busy} />
                  </label>
                  <label style={labelStyle}>
                    Type
                    <select name="type" style={inputStyle} defaultValue="text" disabled={busy}>
                      {builderCmsFieldTypes.map((type) => (
                        <option key={type} value={type}>{cmsFieldTypeLabels[type]}</option>
                      ))}
                    </select>
                  </label>
                  <label style={labelStyle}>
                    Reference collection
                    <select name="relationCollectionId" style={inputStyle} defaultValue="" disabled={busy}>
                      <option value="">None</option>
                      {referenceCollectionOptions.map((collection) => (
                        <option key={collection.collectionId} value={collection.collectionId}>
                          {collection.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label style={labelStyle}>
                    Default value
                    <input name="defaultValue" type="text" style={inputStyle} placeholder="Optional default" disabled={busy} />
                  </label>
                  <label style={labelStyle}>
                    Help text
                    <input name="helpText" type="text" style={inputStyle} placeholder="Shown under the field" disabled={busy} />
                  </label>
                  <label style={labelStyle}>
                    Min
                    <input name="validationMin" type="number" style={inputStyle} placeholder="Min value or length" disabled={busy} />
                  </label>
                  <label style={labelStyle}>
                    Max
                    <input name="validationMax" type="number" style={inputStyle} placeholder="Max value or length" disabled={busy} />
                  </label>
                  <label style={labelStyle}>
                    Regex pattern
                    <input name="validationPattern" type="text" style={inputStyle} placeholder="^[A-Z].+" disabled={busy} />
                  </label>
                  <label style={labelStyle}>
                    Allowed options
                    <textarea
                      name="validationOptions"
                      style={{ ...inputStyle, minHeight: 72, resize: 'vertical' }}
                      placeholder="One option per line"
                      disabled={busy}
                    />
                  </label>
                </div>
                <div className="builder-dashboard-page-actions">
                  <label style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
                    <input name="required" type="checkbox" disabled={busy} />
                    Required
                  </label>
                  <label style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
                    <input name="unique" type="checkbox" disabled={busy} />
                    Unique
                  </label>
                  <label style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
                    <input name="localized" type="checkbox" disabled={busy} />
                    Localized
                  </label>
                  <label style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
                    <input name="repeated" type="checkbox" disabled={busy} />
                    Repeated
                  </label>
                  <button type="submit" className="builder-action-btn builder-action-btn--primary" disabled={busy}>
                    Add field
                  </button>
                </div>
              </form>
              <h3 style={{ color: '#0f172a', fontSize: 14, margin: '16px 0 8px' }}>Indexes</h3>
              <div className="builder-dashboard-page-list">
                {detail.indexes.map((index) => (
                  <article key={index.indexId} className="builder-dashboard-page-card">
                    <div className="builder-dashboard-page-head">
                      <div>
                        <strong>{index.name}</strong>
                        <span>{index.fields.map((field) => `${field.fieldKey} ${field.direction}`).join(', ')}</span>
                      </div>
                      <span className="builder-stage-pill">{index.unique ? 'unique' : 'index'}</span>
                    </div>
                    <div className="builder-dashboard-page-actions">
                      <button
                        type="button"
                        className="builder-action-btn"
                        onClick={() => void deleteCollectionIndex(index.indexId)}
                        disabled={busy}
                      >
                        Delete index
                      </button>
                    </div>
                  </article>
                ))}
                {detail.indexes.length === 0 ? (
                  <article className="builder-dashboard-page-card">
                    <div className="builder-dashboard-page-head">
                      <div>
                        <strong>No indexes</strong>
                        <span>Add a field index below</span>
                      </div>
                    </div>
                  </article>
                ) : null}
              </div>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void addCollectionIndex(new FormData(event.currentTarget));
                  event.currentTarget.reset();
                }}
                style={{ display: 'grid', gap: 10, marginTop: 12 }}
              >
                <div style={formGridStyle}>
                  <label style={labelStyle}>
                    Index name
                    <input name="name" type="text" style={inputStyle} placeholder="Published lookup" disabled={busy} />
                  </label>
                  <label style={labelStyle}>
                    Fields
                    <input name="fields" type="text" style={inputStyle} placeholder="slug, status" disabled={busy} />
                  </label>
                  <label style={labelStyle}>
                    Direction
                    <select name="direction" style={inputStyle} defaultValue="asc" disabled={busy}>
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </label>
                  <label
                    style={{
                      alignItems: 'center',
                      color: '#475569',
                      display: 'flex',
                      fontSize: 12,
                      fontWeight: 700,
                      gap: 8,
                    }}
                  >
                    <input name="unique" type="checkbox" disabled={busy} />
                    Unique
                  </label>
                </div>
                <div className="builder-dashboard-page-actions">
                  <button type="submit" className="builder-action-btn builder-action-btn--primary" disabled={busy}>
                    Add index
                  </button>
                </div>
              </form>
            </section>

            <section className="builder-preview-inspector-card">
              <h2>{editingRecordId ? `Edit ${editingRecordId}` : 'New record'}</h2>
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={formGridStyle}>
                  {detail.fields.map((field) => (
                    <CmsFieldInput
                      key={field.fieldId}
                      field={field}
                      value={recordForm[field.key]}
                      disabled={busy}
                      onChange={(value) => setRecordForm((current) => ({ ...current, [field.key]: value }))}
                      onRequestAssetLibrary={
                        field.type === 'image' ? () => setAssetFieldKey(field.key) : undefined
                      }
                    />
                  ))}
                </div>
                <div className="builder-dashboard-page-actions">
                  <button
                    type="button"
                    className="builder-action-btn builder-action-btn--primary"
                    onClick={() => void saveRecord()}
                    disabled={busy}
                  >
                    {editingRecordId ? 'Save record' : 'Create record'}
                  </button>
                  {editingRecordId ? (
                    <button
                      type="button"
                      className="builder-action-btn"
                      onClick={() => {
                        setEditingRecordId(null);
                        setRecordForm(createEmptyRecordForm(detail.fields));
                      }}
                      disabled={busy}
                    >
                      Cancel edit
                    </button>
                  ) : null}
                </div>
              </div>
            </section>

            <section className="builder-preview-inspector-card">
              <h2>Records</h2>
              <div style={{ ...formGridStyle, marginBottom: 12 }}>
                <label style={labelStyle}>
                  Search
                  <input
                    type="search"
                    style={inputStyle}
                    value={recordQuery}
                    placeholder="Record ID, status, value"
                    disabled={busy}
                    onChange={(event) => {
                      setRecordQuery(event.target.value);
                      setRecordPage(1);
                      setSelectedViewId('');
                    }}
                  />
                </label>
                <label style={labelStyle}>
                  Sort by
                  <select
                    style={inputStyle}
                    value={effectiveRecordSortBy}
                    disabled={busy}
                    onChange={(event) => {
                      setRecordSortBy(event.target.value);
                      setRecordPage(1);
                      setSelectedViewId('');
                    }}
                  >
                    <optgroup label="Record">
                      {systemRecordSortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Fields">
                      {detail.fields.map((field) => (
                        <option key={field.fieldId} value={field.key}>
                          {field.label}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </label>
                <label style={labelStyle}>
                  Direction
                  <select
                    style={inputStyle}
                    value={recordSortDirection}
                    disabled={busy}
                    onChange={(event) => {
                      setRecordSortDirection(event.target.value === 'asc' ? 'asc' : 'desc');
                      setRecordPage(1);
                      setSelectedViewId('');
                    }}
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </label>
                <label style={labelStyle}>
                  Page size
                  <select
                    style={inputStyle}
                    value={recordPageSize}
                    disabled={busy}
                    onChange={(event) => {
                      setRecordPageSize(Number(event.target.value));
                      setRecordPage(1);
                    }}
                  >
                    {[5, 10, 25, 50].map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div style={{ display: 'grid', gap: 10, marginBottom: 12 }}>
                <div style={{ ...formGridStyle, alignItems: 'end' }}>
                  <label style={labelStyle}>
                    Filter field
                    <select
                      style={inputStyle}
                      value={recordFilterField}
                      disabled={busy}
                      onChange={(event) => {
                        const nextField = event.target.value;
                        const nextOperator = recordFilterOperatorsForField(detail.fields, nextField)[0]?.value ?? 'contains';
                        setRecordFilterField(nextField);
                        setRecordFilterOperator(nextOperator);
                        setRecordFilterValue(defaultRecordFilterValue(nextField, nextOperator));
                      }}
                    >
                      {recordFilterFieldOptions(detail.fields).map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </label>
                  <label style={labelStyle}>
                    Operator
                    <select
                      style={inputStyle}
                      value={recordFilterOperator}
                      disabled={busy}
                      onChange={(event) => {
                        const nextOperator = event.target.value as BuilderCmsRecordFilterOperator;
                        setRecordFilterOperator(nextOperator);
                        setRecordFilterValue(defaultRecordFilterValue(recordFilterField, nextOperator));
                      }}
                    >
                      {recordFilterOperatorsForField(detail.fields, recordFilterField).map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </label>
                  <label style={labelStyle}>
                    Value
                    <input
                      type={recordFilterInputType(detail.fields, recordFilterField)}
                      style={inputStyle}
                      value={recordFilterValue}
                      disabled={busy || recordFilterOperator === 'empty' || recordFilterOperator === 'not-empty'}
                      placeholder={recordFilterOperator === 'empty' || recordFilterOperator === 'not-empty' ? 'No value' : 'Filter value'}
                      onChange={(event) => setRecordFilterValue(event.target.value)}
                    />
                  </label>
                  <button
                    type="button"
                    className="builder-action-btn builder-action-btn--primary"
                    onClick={addRecordFilter}
                    disabled={busy}
                  >
                    Add filter
                  </button>
                </div>
                {recordFilters.length > 0 ? (
                  <div className="builder-dashboard-page-actions">
                    {recordFilters.map((filter) => (
                      <button
                        key={filter.filterId}
                        type="button"
                        className="builder-action-btn"
                        onClick={() => removeRecordFilter(filter.filterId)}
                        disabled={busy}
                      >
                        {formatRecordFilter(detail.fields, filter)} x
                      </button>
                    ))}
                    <button type="button" className="builder-action-btn" onClick={clearRecordFilters} disabled={busy}>
                      Clear filters
                    </button>
                  </div>
                ) : null}
                <div style={{ ...formGridStyle, alignItems: 'end' }}>
                  <label style={labelStyle}>
                    Saved views
                    <select
                      style={inputStyle}
                      value={selectedViewId}
                      disabled={busy}
                      onChange={(event) => applyRecordSavedView(event.target.value)}
                    >
                      <option value="">Select view</option>
                      {savedViews.map((view) => (
                        <option key={view.viewId} value={view.viewId}>{view.name}</option>
                      ))}
                    </select>
                  </label>
                  <label style={labelStyle}>
                    View name
                    <input
                      type="text"
                      style={inputStyle}
                      value={newViewName}
                      placeholder="Published Korean items"
                      disabled={busy}
                      onChange={(event) => setNewViewName(event.target.value)}
                    />
                  </label>
                  <button
                    type="button"
                    className="builder-action-btn builder-action-btn--primary"
                    onClick={saveRecordView}
                    disabled={busy}
                  >
                    Save view
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    onClick={() => deleteRecordSavedView(selectedViewId)}
                    disabled={busy || !selectedViewId}
                  >
                    Delete view
                  </button>
                </div>
                <p style={{ color: '#64748b', fontSize: 12, margin: 0 }}>
                  Showing {visibleRecords.length} of {recordQueryResult.total} matching records from {detail.records.length} total.
                  Page {recordQueryResult.page} of {recordQueryResult.pageCount}.
                </p>
                <div className="builder-dashboard-page-actions" style={{ justifyContent: 'space-between' }}>
                  <label
                    style={{
                      alignItems: 'center',
                      color: '#475569',
                      display: 'flex',
                      fontSize: 12,
                      fontWeight: 700,
                      gap: 8,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={allVisibleRecordsSelected}
                      disabled={busy || visibleRecordIds.length === 0}
                      onChange={(event) => toggleVisibleRecordSelection(event.target.checked)}
                    />
                    Select visible
                  </label>
                  <span style={{ color: '#64748b', fontSize: 12 }}>
                    {selectedRecordIds.length} selected
                  </span>
                  <button
                    type="button"
                    className="builder-action-btn"
                    onClick={() => void bulkUpdateSelectedRecordsStatus('published')}
                    disabled={busy || selectedRecordIds.length === 0}
                  >
                    Publish
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    onClick={() => void bulkUpdateSelectedRecordsStatus('draft')}
                    disabled={busy || selectedRecordIds.length === 0}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    onClick={() => void bulkUpdateSelectedRecordsStatus('archived')}
                    disabled={busy || selectedRecordIds.length === 0}
                  >
                    Archive
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    onClick={() => void bulkDeleteSelectedRecords()}
                    disabled={busy || selectedRecordIds.length === 0}
                  >
                    Delete selected
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    onClick={() => setSelectedRecordIds([])}
                    disabled={busy || selectedRecordIds.length === 0}
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div style={{ display: 'grid', gap: 10, marginBottom: 12 }}>
                <label style={labelStyle}>
                  CSV
                  <textarea
                    style={{ ...inputStyle, minHeight: 92, resize: 'vertical', fontFamily: 'monospace' }}
                    value={csvImportText}
                    placeholder="recordId,status,locale,title,slug"
                    disabled={busy}
                    onChange={(event) => {
                      setCsvImportText(event.target.value);
                      setCsvImportSummary(null);
                    }}
                  />
                </label>
                {csvHeaders.length > 0 ? (
                  <div style={{ display: 'grid', gap: 10 }}>
                    <p style={{ color: '#64748b', fontSize: 12, margin: 0 }}>
                      CSV preview: {Math.max(0, csvImportText.trim().split(/\r?\n/).length - 1)} rows,
                      {' '}{csvHeaders.length} columns.
                    </p>
                    <div style={formGridStyle}>
                      {csvTargetColumns.map((target) => (
                        <label key={target} style={labelStyle}>
                          {target}
                          <select
                            style={inputStyle}
                            value={effectiveCsvColumnMap[target] ?? ''}
                            disabled={busy}
                            onChange={(event) => {
                              setCsvColumnMap((current) => ({ ...current, [target]: event.target.value }));
                            }}
                          >
                            <option value="">Not mapped</option>
                            {csvHeaders.map((header) => (
                              <option key={`${target}-${header}`} value={header}>{header}</option>
                            ))}
                          </select>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : null}
                {csvImportSummary ? (
                  <p style={{ color: '#64748b', fontSize: 12, margin: 0 }}>
                    Imported with {csvImportSummary.mappedColumns.length} mapped columns
                    {csvImportSummary.skippedColumns.length
                      ? `; skipped ${csvImportSummary.skippedColumns.join(', ')}`
                      : '; no skipped columns'}.
                  </p>
                ) : null}
                <div className="builder-dashboard-page-actions">
                  <select
                    aria-label="CSV import mode"
                    style={{ ...inputStyle, width: 140 }}
                    value={csvImportMode}
                    disabled={busy}
                    onChange={(event) => setCsvImportMode(event.target.value === 'replace' ? 'replace' : 'append')}
                  >
                    <option value="append">Append</option>
                    <option value="replace">Replace</option>
                  </select>
                  <button
                    type="button"
                    className="builder-action-btn builder-action-btn--primary"
                    onClick={() => void importCsv()}
                    disabled={busy || !csvImportText.trim()}
                  >
                    Import CSV
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    onClick={() => void exportCsv()}
                    disabled={busy}
                  >
                    Export CSV
                  </button>
                </div>
              </div>
              <div className="builder-dashboard-page-list">
                {visibleRecords.map((record) => (
                  <article key={record.recordId} className="builder-dashboard-page-card">
                    <div className="builder-dashboard-page-head">
                      <label
                        style={{
                          alignItems: 'flex-start',
                          display: 'flex',
                          gap: 10,
                          minWidth: 0,
                        }}
                      >
                        <input
                          type="checkbox"
                          aria-label={`Select ${record.recordId}`}
                          checked={selectedRecordIdSet.has(record.recordId)}
                          disabled={busy}
                          onChange={(event) => toggleRecordSelection(record.recordId, event.target.checked)}
                        />
                        <span style={{ display: 'grid', minWidth: 0 }}>
                          <strong>{record.fields.title ? String(record.fields.title) : record.recordId}</strong>
                          <span>{record.recordId}</span>
                        </span>
                      </label>
                      <span className="builder-stage-pill">{record.status}</span>
                    </div>
                    <div className="builder-dashboard-page-meta">
                      {detail.fields.slice(0, 4).map((field) => (
                        <span key={field.fieldId}>
                          {field.label}: {formatValue(record.fields[field.key])}
                        </span>
                      ))}
                      <span>{record.revisions?.length ?? 0} revisions</span>
                    </div>
                    <div className="builder-dashboard-page-actions">
                      <button
                        type="button"
                        className="builder-action-btn builder-action-btn--primary"
                        onClick={() => beginEditRecord(record)}
                        disabled={busy}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="builder-action-btn"
                        onClick={() => void duplicateRecord(record.recordId)}
                        disabled={busy}
                      >
                        Duplicate
                      </button>
                      <button
                        type="button"
                        className="builder-action-btn"
                        onClick={() => void deleteRecord(record.recordId)}
                        disabled={busy}
                      >
                        Delete
                      </button>
                    </div>
                    {record.revisions?.length ? (
                      <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
                        {latestRevisions(record.revisions).map((revision) => (
                          <div
                            key={revision.revisionId}
                            style={{ borderTop: '1px solid #e2e8f0', display: 'grid', gap: 8, paddingTop: 10 }}
                          >
                            <div className="builder-dashboard-page-head">
                              <div>
                                <strong>{revision.action === 'restore' ? 'Restore snapshot' : 'Update snapshot'}</strong>
                                <span>{formatDateTime(revision.createdAt)} by {revision.authorLabel}</span>
                              </div>
                              <span className="builder-stage-pill">{revision.status}</span>
                            </div>
                            <div className="builder-dashboard-page-meta">
                              {detail.fields.slice(0, 3).map((field) => (
                                <span key={field.fieldId}>
                                  {field.label}: {formatValue(revision.fields[field.key])}
                                </span>
                              ))}
                            </div>
                            <div className="builder-dashboard-page-actions">
                              <button
                                type="button"
                                className="builder-action-btn"
                                onClick={() => void restoreRevision(record.recordId, revision.revisionId)}
                                disabled={busy}
                              >
                                Restore
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </article>
                ))}
                {detail.records.length === 0 ? (
                  <article className="builder-dashboard-page-card">
                    <div className="builder-dashboard-page-head">
                      <div>
                        <strong>No records</strong>
                        <span>{detail.collectionId}</span>
                      </div>
                    </div>
                  </article>
                ) : null}
                {detail.records.length > 0 && visibleRecords.length === 0 ? (
                  <article className="builder-dashboard-page-card">
                    <div className="builder-dashboard-page-head">
                      <div>
                        <strong>No matching records</strong>
                        <span>{detail.collectionId}</span>
                      </div>
                    </div>
                  </article>
                ) : null}
              </div>
              <div className="builder-dashboard-page-actions" style={{ marginTop: 12 }}>
                <button
                  type="button"
                  className="builder-action-btn"
                  onClick={() => setRecordPage((page) => Math.max(1, page - 1))}
                  disabled={busy || recordQueryResult.page <= 1}
                >
                  Previous
                </button>
                <span style={{ color: '#64748b', fontSize: 12 }}>
                  {recordQueryResult.page} / {recordQueryResult.pageCount}
                </span>
                <button
                  type="button"
                  className="builder-action-btn"
                  onClick={() => setRecordPage((page) => Math.min(recordQueryResult.pageCount, page + 1))}
                  disabled={busy || recordQueryResult.page >= recordQueryResult.pageCount}
                >
                  Next
                </button>
              </div>
            </section>
          </>
        ) : null}
      </div>
      </div>
      {assetFieldKey ? (
        <AssetLibraryModal
          open
          locale={locale}
          selectedUrl={imageValueFromForm(recordForm[assetFieldKey])?.url ?? null}
          initialFolder="uploads"
          autoFolderOnSelect="uploads"
          autoTagOnSelect="cms"
          onClose={() => setAssetFieldKey(null)}
          onSelect={(asset) => {
            setRecordForm((current) => ({
              ...current,
              [assetFieldKey]: imageValueFromAsset(asset),
            }));
            setAssetFieldKey(null);
            setMessage('Image selected from Asset Library.');
          }}
          onToast={(toastMessage, tone) => {
            if (tone === 'error') setError(toastMessage);
            else setMessage(toastMessage);
          }}
        />
      ) : null}
    </>
  );
}

function CmsFieldInput({
  field,
  value,
  disabled,
  onChange,
  onRequestAssetLibrary,
}: {
  field: BuilderCmsFieldDefinition;
  value: RecordFormValue | undefined;
  disabled: boolean;
  onChange: (value: RecordFormValue) => void;
  onRequestAssetLibrary?: () => void;
}) {
  if (field.type === 'boolean') {
    return (
      <label style={labelStyle}>
        {field.label}
        {field.helpText ? <span style={{ color: '#64748b', fontWeight: 500 }}>{field.helpText}</span> : null}
        <select
          style={inputStyle}
          value={value === true ? 'true' : value === false ? 'false' : ''}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value === '' ? '' : event.target.value === 'true')}
        >
          <option value="">Select</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </label>
    );
  }

  if (field.type === 'rich-text') {
    return (
      <label style={labelStyle}>
        {field.label}
        {field.helpText ? <span style={{ color: '#64748b', fontWeight: 500 }}>{field.helpText}</span> : null}
        <textarea
          style={{ ...inputStyle, minHeight: 118, resize: 'vertical' }}
          value={typeof value === 'string' ? value : ''}
          disabled={disabled}
          placeholder="Formatted text or HTML"
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
    );
  }

  if (field.type === 'reference') {
    return (
      <label style={labelStyle}>
        {field.label}
        {field.helpText ? <span style={{ color: '#64748b', fontWeight: 500 }}>{field.helpText}</span> : null}
        <input
          type="text"
          style={inputStyle}
          value={typeof value === 'string' ? value : ''}
          disabled={disabled}
          placeholder={field.relationCollectionId ? `Record ID from ${field.relationCollectionId}` : 'Referenced record ID'}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
    );
  }

  if (field.repeated || field.type === 'string-list') {
    return (
      <label style={labelStyle}>
        {field.label}
        {field.helpText ? <span style={{ color: '#64748b', fontWeight: 500 }}>{field.helpText}</span> : null}
        <textarea
          style={{ ...inputStyle, minHeight: 82, resize: 'vertical' }}
          value={typeof value === 'string' ? value : ''}
          disabled={disabled}
          placeholder="One value per line"
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
    );
  }

  if (field.type === 'image') {
    const imageValue = imageValueFromForm(value) ?? { url: '', altText: '', focalPoint: { x: 0.5, y: 0.5 } };
    return (
      <div style={labelStyle}>
        <span>{field.label}</span>
        {field.helpText ? <span style={{ color: '#64748b', fontWeight: 500 }}>{field.helpText}</span> : null}
        <input
          type="url"
          style={inputStyle}
          value={imageValue.url}
          placeholder="/api/builder/assets/ko/example.webp"
          disabled={disabled}
          onChange={(event) => onChange({
            ...imageValue,
            url: event.target.value,
            assetId: undefined,
            filename: undefined,
          })}
        />
        <input
          type="text"
          style={inputStyle}
          value={imageValue.altText ?? ''}
          placeholder="Alt text"
          disabled={disabled}
          onChange={(event) => onChange({ ...imageValue, altText: event.target.value })}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input
            type="number"
            min={0}
            max={1}
            step={0.01}
            aria-label={`${field.label} focal X`}
            style={inputStyle}
            value={imageValue.focalPoint?.x ?? 0.5}
            disabled={disabled}
            onChange={(event) => onChange({
              ...imageValue,
              focalPoint: {
                x: Number(event.target.value),
                y: imageValue.focalPoint?.y ?? 0.5,
              },
            })}
          />
          <input
            type="number"
            min={0}
            max={1}
            step={0.01}
            aria-label={`${field.label} focal Y`}
            style={inputStyle}
            value={imageValue.focalPoint?.y ?? 0.5}
            disabled={disabled}
            onChange={(event) => onChange({
              ...imageValue,
              focalPoint: {
                x: imageValue.focalPoint?.x ?? 0.5,
                y: Number(event.target.value),
              },
            })}
          />
        </div>
        <button
          type="button"
          className="builder-action-btn"
          onClick={onRequestAssetLibrary}
          disabled={disabled}
        >
          Asset Library
        </button>
      </div>
    );
  }

  const inputType = field.type === 'number'
    ? 'number'
    : field.type === 'date'
      ? 'date'
      : field.type === 'email'
        ? 'email'
        : field.type === 'url'
          ? 'url'
          : 'text';

  return (
    <label style={labelStyle}>
      {field.label}
      {field.helpText ? <span style={{ color: '#64748b', fontWeight: 500 }}>{field.helpText}</span> : null}
      <input
        type={inputType}
        style={inputStyle}
        value={typeof value === 'string' ? value : ''}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function defaultCmsPermissionDraft(): BuilderCmsPermissions {
  return {
    read: ['admin'],
    create: ['admin'],
    update: ['admin'],
    delete: ['admin'],
  };
}

function normalizePermissionDraft(permissions: BuilderCmsPermissions): BuilderCmsPermissions {
  return {
    read: orderPermissionActors(permissions.read),
    create: orderPermissionActors(permissions.create),
    update: orderPermissionActors(permissions.update),
    delete: orderPermissionActors(permissions.delete),
  };
}

function togglePermissionActorValue(
  permissions: BuilderCmsPermissions,
  action: CmsPermissionOperation,
  actor: BuilderCmsPermissionActor,
  enabled: boolean,
): BuilderCmsPermissions {
  const actors = new Set<BuilderCmsPermissionActor>(permissions[action]);
  if (enabled) actors.add(actor);
  else actors.delete(actor);
  actors.add('admin');
  return {
    ...permissions,
    [action]: orderPermissionActors(actors),
  };
}

function orderPermissionActors(actors: Iterable<BuilderCmsPermissionActor>): BuilderCmsPermissionActor[] {
  const actorSet = new Set<BuilderCmsPermissionActor>(actors);
  actorSet.add('admin');
  return builderCmsPermissionActors.filter((actor) => actorSet.has(actor));
}

function normalizeCmsFieldType(input: FormDataEntryValue | null): BuilderCmsFieldType {
  return typeof input === 'string' && builderCmsFieldTypes.includes(input as BuilderCmsFieldType)
    ? input as BuilderCmsFieldType
    : 'text';
}

function defaultValueFromFieldForm(formData: FormData): string | undefined {
  const value = String(formData.get('defaultValue') ?? '').trim();
  return value || undefined;
}

function validationFromFieldForm(formData: FormData): BuilderCmsFieldDefinition['validation'] {
  const min = optionalNumberFromForm(formData.get('validationMin'));
  const max = optionalNumberFromForm(formData.get('validationMax'));
  const pattern = String(formData.get('validationPattern') ?? '').trim();
  const options = String(formData.get('validationOptions') ?? '')
    .split('\n')
    .map((option) => option.trim())
    .filter(Boolean);
  const validation: NonNullable<BuilderCmsFieldDefinition['validation']> = {};
  if (min !== undefined) validation.min = min;
  if (max !== undefined) validation.max = max;
  if (pattern) validation.pattern = pattern;
  if (options.length > 0) validation.options = [...new Set(options)];
  return Object.keys(validation).length > 0 ? validation : undefined;
}

function optionalNumberFromForm(value: FormDataEntryValue | null): number | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

function parseCsvHeaderRow(csv: string): string[] {
  const firstLine = csv.split(/\r?\n/).find((line) => line.trim());
  if (!firstLine) return [];
  const headers: string[] = [];
  let cell = '';
  let inQuotes = false;
  for (let index = 0; index < firstLine.length; index += 1) {
    const char = firstLine[index];
    if (inQuotes) {
      if (char === '"' && firstLine[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      headers.push(cell.trim());
      cell = '';
    } else {
      cell += char;
    }
  }
  headers.push(cell.trim());
  return headers.filter(Boolean);
}

function apiBase(siteId: string) {
  return `/api/builder/sites/${encodeURIComponent(siteId)}/collections`;
}

function filenameFromContentDisposition(header: string | null): string | null {
  const match = header?.match(/filename="([^"]+)"/);
  return match?.[1] ?? null;
}

function latestRevisions(revisions: BuilderCmsRecordRevision[]): BuilderCmsRecordRevision[] {
  return [...revisions]
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
    .slice(0, 3);
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

const systemRecordSortOptions = [
  { value: 'updatedAt', label: 'Updated' },
  { value: 'createdAt', label: 'Created' },
  { value: 'recordId', label: 'Record ID' },
  { value: 'status', label: 'Status' },
];

function createEmptyRecordForm(fields: BuilderCmsFieldDefinition[]): RecordFormState {
  return Object.fromEntries(fields.map((field) => [field.key, recordFormValueFromField(field, field.defaultValue)]));
}

function createRecordFormFromRecord(
  fields: BuilderCmsFieldDefinition[],
  record: BuilderCmsRecord,
): RecordFormState {
  return Object.fromEntries(fields.map((field) => {
    const value = record.fields[field.key];
    return [field.key, recordFormValueFromField(field, value)];
  }));
}

function recordFormValueFromField(
  field: BuilderCmsFieldDefinition,
  value: unknown,
): RecordFormValue {
  if (field.type === 'image' && imageValueFromForm(value)) return imageValueFromForm(value)!;
  if (Array.isArray(value)) return value.join('\n');
  if (typeof value === 'boolean') return value;
  return value === undefined || value === null ? '' : String(value);
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (isImageValue(value)) return value.altText ? `${value.url} (${value.altText})` : value.url;
  if (value === undefined || value === null || value === '') return '-';
  return String(value);
}

function imageValueFromAsset(asset: BuilderAssetListItem): BuilderCmsImageValue {
  return {
    url: asset.url,
    assetId: asset.pathname,
    filename: asset.filename,
    altText: asset.filename,
    focalPoint: { x: 0.5, y: 0.5 },
  };
}

function imageValueFromForm(value: unknown): BuilderCmsImageValue | null {
  if (isImageValue(value)) return value;
  if (typeof value === 'string' && value.trim()) return { url: value.trim() };
  return null;
}

function isImageValue(value: unknown): value is BuilderCmsImageValue {
  return Boolean(value && typeof value === 'object' && 'url' in value && typeof value.url === 'string');
}

function recordFilterFieldOptions(fields: BuilderCmsFieldDefinition[]): { value: string; label: string }[] {
  return [
    { value: 'status', label: 'Status' },
    { value: 'locale', label: 'Locale' },
    { value: 'recordId', label: 'Record ID' },
    { value: 'createdAt', label: 'Created' },
    { value: 'updatedAt', label: 'Updated' },
    ...fields.map((field) => ({ value: field.key, label: field.label })),
  ];
}

function defaultRecordFilterField(fields: BuilderCmsFieldDefinition[]): string {
  return fields[0]?.key ?? 'status';
}

function recordFilterOperatorsForField(
  fields: BuilderCmsFieldDefinition[],
  fieldKey: string,
): { value: BuilderCmsRecordFilterOperator; label: string }[] {
  const field = fields.find((candidate) => candidate.key === fieldKey);
  const type = field?.type ?? (fieldKey === 'createdAt' || fieldKey === 'updatedAt' ? 'date' : 'text');
  if (type === 'number') {
    return [
      { value: 'is', label: 'is' },
      { value: 'is-not', label: 'is not' },
      { value: 'gt', label: 'greater than' },
      { value: 'gte', label: 'at least' },
      { value: 'lt', label: 'less than' },
      { value: 'lte', label: 'at most' },
      { value: 'empty', label: 'is empty' },
      { value: 'not-empty', label: 'is not empty' },
    ];
  }
  if (type === 'boolean') {
    return [
      { value: 'is', label: 'is' },
      { value: 'is-not', label: 'is not' },
      { value: 'empty', label: 'is empty' },
      { value: 'not-empty', label: 'is not empty' },
    ];
  }
  if (type === 'date') {
    return [
      { value: 'is', label: 'is' },
      { value: 'before', label: 'before' },
      { value: 'after', label: 'after' },
      { value: 'empty', label: 'is empty' },
      { value: 'not-empty', label: 'is not empty' },
    ];
  }
  if (type === 'string-list' || field?.repeated) {
    return [
      { value: 'includes', label: 'includes' },
      { value: 'contains', label: 'contains text' },
      { value: 'empty', label: 'is empty' },
      { value: 'not-empty', label: 'is not empty' },
    ];
  }
  return [
    { value: 'contains', label: 'contains' },
    { value: 'not-contains', label: 'does not contain' },
    { value: 'is', label: 'is' },
    { value: 'is-not', label: 'is not' },
    { value: 'empty', label: 'is empty' },
    { value: 'not-empty', label: 'is not empty' },
  ];
}

function recordFilterInputType(fields: BuilderCmsFieldDefinition[], fieldKey: string): string {
  const field = fields.find((candidate) => candidate.key === fieldKey);
  if (field?.type === 'number') return 'number';
  if (field?.type === 'date' || fieldKey === 'createdAt' || fieldKey === 'updatedAt') return 'date';
  return 'text';
}

function defaultRecordFilterValue(fieldKey: string, operator: BuilderCmsRecordFilterOperator): string {
  if (operator === 'empty' || operator === 'not-empty') return '';
  if (fieldKey === 'status') return 'published';
  if (fieldKey === 'locale') return 'ko';
  return '';
}

function formatRecordFilter(fields: BuilderCmsFieldDefinition[], filter: BuilderCmsRecordFilter): string {
  const fieldLabel = recordFilterFieldOptions(fields).find((field) => field.value === filter.fieldKey)?.label ?? filter.fieldKey;
  const operatorLabel = recordFilterOperatorsForField(fields, filter.fieldKey)
    .find((operator) => operator.value === filter.operator)?.label ?? filter.operator;
  const suffix = filter.operator === 'empty' || filter.operator === 'not-empty'
    ? ''
    : ` ${formatValue(filter.value)}`;
  return `${fieldLabel} ${operatorLabel}${suffix}`;
}

function recordViewsStorageKey(siteId: string, locale: Locale, collectionId: string): string {
  return `${RECORD_VIEW_STORAGE_PREFIX}:${siteId}:${locale}:${collectionId}`;
}

function readSavedRecordViews(siteId: string, locale: Locale, collectionId: string): BuilderCmsRecordSavedView[] {
  if (typeof window === 'undefined') return [];
  try {
    return normalizeBuilderCmsRecordSavedViews(
      JSON.parse(window.localStorage.getItem(recordViewsStorageKey(siteId, locale, collectionId)) ?? '[]'),
    );
  } catch {
    return [];
  }
}

function writeSavedRecordViews(
  siteId: string,
  locale: Locale,
  collectionId: string,
  views: BuilderCmsRecordSavedView[],
) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(
    recordViewsStorageKey(siteId, locale, collectionId),
    JSON.stringify(normalizeBuilderCmsRecordSavedViews(views)),
  );
}
