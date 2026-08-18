'use client';

import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import AssetLibraryModal from '@/components/builder/editor/AssetLibraryModal';
import BuilderDatasetSeedAction from '@/components/builder/datasets/BuilderDatasetSeedAction';
import { CmsDynamicListPageAction } from '@/components/builder/cms/CmsDynamicListPageAction';
import SourceRecordInlineEditor from '@/components/builder/cms/SourceRecordInlineEditor';
import {
  createBuilderCmsRecordSavedView,
  normalizeBuilderCmsRecordSavedViews,
  queryBuilderCmsRecords,
  type BuilderCmsRecordFilter,
  type BuilderCmsRecordFilterOperator,
  type BuilderCmsRecordSavedView,
} from '@/lib/builder/cms-record-query';
import {
  getBuilderCmsPublishCandidateRecordIds,
  summarizeBuilderCmsPublishReadiness,
} from '@/lib/builder/cms-publish-readiness';
import { resolveCmsRecordSelectionRange } from '@/lib/builder/cms-record-selection';
import {
  buildBuilderCollectionHref,
  buildBuilderCmsRecordHref,
  buildBuilderPageDatasetHref,
} from '@/lib/builder/hrefs';
import {
  builderCmsFieldTypes,
  builderCmsPermissionActors,
  builderCmsRecordStatuses,
  type BuilderCmsCollectionDetail,
  type BuilderCmsCollectionSummary,
  type BuilderCmsFieldDefinition,
  type BuilderCmsFieldType,
  type BuilderCmsImageValue,
  type BuilderCmsIndexDefinition,
  type BuilderCmsIndexSortDirection,
  type BuilderCmsModerationEvent,
  type BuilderCmsPermissionActor,
  type BuilderCmsPermissions,
  type BuilderCmsRecord,
  type BuilderCmsRecordRevision,
  type BuilderCmsRecordStatus,
} from '@/lib/builder/cms-types';
import { CMS_ACTOR_HEADER } from '@/lib/builder/cms-route-actor';
import type { BuilderAssetListItem } from '@/lib/builder/assets';
import type {
  BuilderCollectionDetail as BuilderSourceCollectionDetail,
  BuilderCollectionRecordPreview,
  BuilderCollectionSummary,
} from '@/lib/builder/cms';
import type { Locale } from '@/lib/locales';

type ApiCollectionList = {
  ok: boolean;
  collections: BuilderSourceCollectionDetail[];
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
  redirectCreated?: boolean;
  redirectWarnings?: string[];
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
  initialSourceCollections: BuilderSourceCollectionDetail[];
  initialEditableCollections: BuilderCmsCollectionSummary[];
};

type RecordFormValue = string | boolean | BuilderCmsImageValue;
type RecordFormState = Record<string, RecordFormValue>;
type RecordSortDirection = 'asc' | 'desc';
type RecordGridDensity = 'compact' | 'comfortable';
type RecordGridPreviewFieldCount = 2 | 4 | 6;
type CsvImportMode = 'append' | 'replace';
type CmsPermissionOperation = keyof BuilderCmsPermissions;

interface DynamicItemPageReference {
  pageId: string;
  slug: string;
  locale: Locale;
  dynamicItem?: {
    collectionId: string; cmsCollectionId?: string;
    slugField: string;
  };
}

const DEFAULT_RECORD_PAGE_SIZE = 10;
const RECORD_VIEW_STORAGE_PREFIX = 'builder-cms-record-views';
const RECORD_GRID_DENSITY_STORAGE_PREFIX = 'builder-cms-record-grid-density';
const RECORD_GRID_PREVIEW_FIELD_COUNT_STORAGE_PREFIX = 'builder-cms-record-grid-preview-field-count';

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

const recordStatusActionLabels: Record<BuilderCmsRecordStatus, string> = {
  draft: 'move to draft',
  pending: 'mark pending',
  approved: 'approve',
  rejected: 'reject',
  published: 'publish',
  archived: 'archive',
};

const recordStatusActions: Array<{ status: BuilderCmsRecordStatus; label: string }> = [
  { status: 'pending', label: 'Pending' },
  { status: 'approved', label: 'Approve' },
  { status: 'rejected', label: 'Reject' },
  { status: 'published', label: 'Publish' },
  { status: 'draft', label: 'Draft' },
  { status: 'archived', label: 'Archive' },
];

const recordGridDensityLabels: Record<RecordGridDensity, string> = {
  compact: 'Compact rows',
  comfortable: 'Expanded rows',
};

const recordGridPreviewFieldCountLabels: Record<RecordGridPreviewFieldCount, string> = {
  2: '2 columns',
  4: '4 columns',
  6: '6 columns',
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

const helperTextStyle = {
  color: '#64748b',
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1.4,
  overflowWrap: 'anywhere',
} satisfies React.CSSProperties;

const warningTextStyle = {
  ...helperTextStyle,
  color: '#b45309',
} satisfies React.CSSProperties;

const slugHelperCardStyle = {
  border: '1px solid #dbeafe',
  borderRadius: 10,
  background: 'linear-gradient(135deg, #f8fbff 0%, #ffffff 58%, #f0f9ff 100%)',
  boxShadow: '0 10px 24px rgba(15, 23, 42, 0.06)',
  display: 'grid',
  gap: 8,
  marginTop: 2,
  padding: 10,
} satisfies React.CSSProperties;

const slugHelperHeaderStyle = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  justifyContent: 'space-between',
} satisfies React.CSSProperties;

const slugHelperPillStyle = {
  border: '1px solid #bfdbfe',
  borderRadius: 999,
  background: '#eff6ff',
  color: '#1d4ed8',
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: 0,
  padding: '3px 7px',
  whiteSpace: 'nowrap',
} satisfies React.CSSProperties;

const slugHelperWarningPillStyle = {
  ...slugHelperPillStyle,
  borderColor: '#fde68a',
  background: '#fffbeb',
  color: '#92400e',
} satisfies React.CSSProperties;

const sourceLifecycleCardStyle = {
  border: '1px solid #dbeafe',
  borderRadius: 10,
  background: 'linear-gradient(135deg, #f8fbff 0%, #ffffff 64%, #f0fdfa 100%)',
  display: 'grid',
  gap: 8,
  marginTop: 10,
  padding: 10,
} satisfies React.CSSProperties;

const sourceLifecycleHeaderStyle = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  justifyContent: 'space-between',
} satisfies React.CSSProperties;

const sourceLifecycleStatusStyle = {
  border: '1px solid #bbf7d0',
  borderRadius: 999,
  background: '#ecfdf3',
  color: '#047857',
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: 0,
  padding: '3px 7px',
  whiteSpace: 'nowrap',
} satisfies React.CSSProperties;

const sourceLifecyclePendingStyle = {
  ...sourceLifecycleStatusStyle,
  borderColor: '#fde68a',
  background: '#fffbeb',
  color: '#92400e',
} satisfies React.CSSProperties;

const sourceOverviewGridStyle = {
  display: 'grid',
  gap: 8,
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  marginTop: 10,
} satisfies React.CSSProperties;

const sourceOverviewPanelStyle = {
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  background: '#ffffff',
  display: 'grid',
  gap: 6,
  padding: 10,
} satisfies React.CSSProperties;

const sourceChipListStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
} satisfies React.CSSProperties;

const sourceChipStyle = {
  border: '1px solid #e2e8f0',
  borderRadius: 999,
  color: '#334155',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 0,
  padding: '3px 7px',
  maxWidth: '100%',
  overflowWrap: 'anywhere',
  whiteSpace: 'normal',
} satisfies React.CSSProperties;

const sourceRecordPreviewStyle = {
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  background: '#ffffff',
  display: 'grid',
  gap: 8,
  marginTop: 10,
  padding: 10,
} satisfies React.CSSProperties;

const sourceRecordRowStyle = {
  display: 'grid',
  gap: 8,
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  alignItems: 'start',
  borderTop: '1px solid #f1f5f9',
  paddingTop: 8,
} satisfies React.CSSProperties;

const sourceRecordCellStyle = {
  display: 'grid',
  gap: 3,
  minWidth: 0,
} satisfies React.CSSProperties;

const sourceRecordRouteStyle = {
  color: '#1d4ed8',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 0,
  overflowWrap: 'anywhere',
} satisfies React.CSSProperties;

const editableRecordSummaryStyle = {
  border: '1px solid #dbeafe',
  borderRadius: 10,
  background: '#f8fbff',
  display: 'grid',
  gap: 10,
  marginBottom: 12,
  padding: 10,
} satisfies React.CSSProperties;

const editableRecordMetricGridStyle = {
  display: 'grid',
  gap: 8,
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
} satisfies React.CSSProperties;

const editableRecordMetricStyle = {
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  background: '#ffffff',
  display: 'grid',
  gap: 2,
  minWidth: 0,
  padding: 8,
} satisfies React.CSSProperties;

const editableRecordRouteStyle = {
  border: '1px solid #dbeafe',
  borderRadius: 8,
  background: '#eff6ff',
  color: '#1d4ed8',
  display: 'block',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 0,
  marginTop: 8,
  overflowWrap: 'anywhere',
  padding: '6px 8px',
} satisfies React.CSSProperties;

const editableRecordFieldGridStyle = {
  display: 'grid',
  gap: 8,
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  marginTop: 8,
} satisfies React.CSSProperties;

const editableRecordGridHeaderStyle = {
  border: '1px solid #dbeafe',
  borderRadius: 8,
  background: '#ffffff',
  display: 'grid',
  gap: 8,
  marginTop: 8,
  padding: 8,
} satisfies React.CSSProperties;

const editableRecordGridHeaderChipRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
} satisfies React.CSSProperties;

const editableRecordCompactActionsStyle = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  justifyContent: 'space-between',
} satisfies React.CSSProperties;

const editableRecordCompactPrimaryActionsStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
} satisfies React.CSSProperties;

const editableRecordCompactFieldsGridStyle = {
  display: 'grid',
  gap: 8,
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  marginTop: 4,
} satisfies React.CSSProperties;

const editableRecordCompactFieldCellStyle = {
  display: 'grid',
  gap: 3,
  minWidth: 0,
  padding: '6px 8px',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  background: '#f8fafc',
} satisfies React.CSSProperties;

const editableRecordCompactFieldValueStyle = {
  color: '#0f172a',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 0,
  minWidth: 0,
  overflowWrap: 'anywhere',
} satisfies React.CSSProperties;

const editableRecordRowSummaryStyle = {
  border: '1px solid #dbeafe',
  borderRadius: 8,
  background: '#ffffff',
  display: 'grid',
  gap: 8,
  marginTop: 8,
  padding: 8,
} satisfies React.CSSProperties;

const editableRecordCompactGridColumns = 'minmax(220px, 2.1fr) 120px 100px 100px minmax(130px, 0.9fr)';

const editableRecordCompactHeaderStyle = {
  alignItems: 'center',
  display: 'grid',
  gap: 8,
  gridTemplateColumns: editableRecordCompactGridColumns,
  padding: '0 8px',
} satisfies React.CSSProperties;

const editableRecordCompactHeaderCellStyle = {
  color: '#64748b',
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: 0.02,
  textTransform: 'uppercase',
} satisfies React.CSSProperties;

const editableRecordRowSummaryGridStyle = {
  display: 'grid',
  gap: 8,
  gridTemplateColumns: editableRecordCompactGridColumns,
} satisfies React.CSSProperties;

const editableRecordRowSummaryCellStyle = {
  display: 'grid',
  gap: 3,
  minWidth: 0,
} satisfies React.CSSProperties;

const editableRecordRowSummaryValueStyle = {
  color: '#0f172a',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 0,
  minWidth: 0,
  overflowWrap: 'anywhere',
} satisfies React.CSSProperties;

const editableRecordFieldCellStyle = {
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  background: '#ffffff',
  display: 'grid',
  gap: 5,
  minWidth: 0,
  padding: 8,
} satisfies React.CSSProperties;

const editableRecordFieldValueStyle = {
  color: '#0f172a',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 0,
  minWidth: 0,
  overflowWrap: 'anywhere',
} satisfies React.CSSProperties;

const inlineRecordFieldEditorStyle = {
  display: 'grid',
  gap: 8,
  minWidth: 0,
  padding: 8,
  border: '1px solid rgba(17, 109, 255, 0.18)',
  borderRadius: 10,
  background: 'rgba(239, 246, 255, 0.78)',
} satisfies React.CSSProperties;

const inlineModalOverlayStyle = {
  alignItems: 'center',
  background: 'rgba(15, 23, 42, 0.38)',
  bottom: 0,
  display: 'flex',
  justifyContent: 'center',
  left: 0,
  padding: 20,
  position: 'fixed',
  right: 0,
  top: 0,
  zIndex: 80,
} satisfies React.CSSProperties;

const inlineModalCardStyle = {
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 28px 80px rgba(15, 23, 42, 0.24)',
  display: 'grid',
  gap: 12,
  maxHeight: 'min(82vh, 780px)',
  maxWidth: 860,
  minWidth: 320,
  overflow: 'auto',
  padding: 20,
  width: 'min(860px, 96vw)',
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
  const [cmsActor, setCmsActor] = useState<BuilderCmsPermissionActor>('admin');
  const [recordForm, setRecordForm] = useState<RecordFormState>({});
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [focusedRecordFieldKey, setFocusedRecordFieldKey] = useState<string | null>(null);
  const [recordQuery, setRecordQuery] = useState('');
  const [recordSortBy, setRecordSortBy] = useState('updatedAt');
  const [recordSortDirection, setRecordSortDirection] = useState<RecordSortDirection>('desc');
  const [recordFilters, setRecordFilters] = useState<BuilderCmsRecordFilter[]>([]);
  const [recordFilterField, setRecordFilterField] = useState('status');
  const [recordFilterOperator, setRecordFilterOperator] = useState<BuilderCmsRecordFilterOperator>('is');
  const [recordFilterValue, setRecordFilterValue] = useState('published');
  const [moderationReason, setModerationReason] = useState('');
  const [recordPage, setRecordPage] = useState(1);
  const [recordPageSize, setRecordPageSize] = useState(DEFAULT_RECORD_PAGE_SIZE);
  const [savedViews, setSavedViews] = useState<BuilderCmsRecordSavedView[]>([]);
  const [selectedViewId, setSelectedViewId] = useState('');
  const [newViewName, setNewViewName] = useState('');
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);
  const [recordGridDensity, setRecordGridDensity] = useState<RecordGridDensity>('compact');
  const [recordGridPreviewFieldCount, setRecordGridPreviewFieldCount] = useState<RecordGridPreviewFieldCount>(4);
  const [csvImportText, setCsvImportText] = useState('');
  const [csvImportMode, setCsvImportMode] = useState<CsvImportMode>('append');
  const [csvColumnMap, setCsvColumnMap] = useState<Record<string, string>>({});
  const [csvImportSummary, setCsvImportSummary] = useState<ApiCsvImport['summary'] | null>(null);
  const [assetFieldKey, setAssetFieldKey] = useState<string | null>(null);
  const [referenceFieldKey, setReferenceFieldKey] = useState<string | null>(null);
  const [referencePickerCollectionId, setReferencePickerCollectionId] = useState<string | null>(null);
  const [referencePickerCollectionName, setReferencePickerCollectionName] = useState('');
  const [referencePickerCollectionDetail, setReferencePickerCollectionDetail] = useState<BuilderCmsCollectionDetail | null>(null);
  const [referencePickerRecords, setReferencePickerRecords] = useState<BuilderCmsRecord[]>([]);
  const [referencePickerQuery, setReferencePickerQuery] = useState('');
  const [referencePickerActiveRecordId, setReferencePickerActiveRecordId] = useState<string | null>(null);
  const [referencePickerLoading, setReferencePickerLoading] = useState(false);
  const [referencePickerError, setReferencePickerError] = useState<string | null>(null);
  const [dynamicItemPages, setDynamicItemPages] = useState<DynamicItemPageReference[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const queryCollectionId = searchParams.get('collectionId')?.trim() ?? '';
  const queryRecordId = searchParams.get('recordId')?.trim() ?? '';
  const cmsQueryOpenKeyRef = useRef<string | null>(null);
  const inlineNavigationFocusRef = useRef<{
    fromFieldKey: string;
    fromRecordId: string;
    toFieldKey: string;
    toRecordId: string;
  } | null>(null);
  const selectionAnchorRecordIdRef = useRef<string | null>(null);
  const selectionRangeShiftKeyRef = useRef(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Shift') {
        selectionRangeShiftKeyRef.current = true;
      }
    }
    function handleKeyUp(event: KeyboardEvent) {
      if (event.key === 'Shift') {
        selectionRangeShiftKeyRef.current = false;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const selectedSummary = useMemo(
    () => collections.find((collection) => collection.collectionId === selectedCollectionId) ?? null,
    [collections, selectedCollectionId],
  );
  const selectedSourceSummary = useMemo(
    () => sourceCollections.find((collection) => collection.id === queryCollectionId) ?? null,
    [queryCollectionId, sourceCollections],
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
  const referencePickerFilteredRecords = useMemo(() => {
    const query = referencePickerQuery.trim().toLowerCase();
    if (!query) return referencePickerRecords;
    return referencePickerRecords.filter((record) => {
      const haystack = [
        record.recordId,
        record.status,
        record.locale ?? '',
        ...Object.values(record.fields).map((value) => formatValue(value)),
      ].join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }, [referencePickerQuery, referencePickerRecords]);

  useEffect(() => {
    if (!referenceFieldKey || referencePickerLoading || referencePickerError) return;
    if (referencePickerFilteredRecords.length === 0) {
      setReferencePickerActiveRecordId(null);
      return;
    }
    setReferencePickerActiveRecordId((current) => {
      if (current && referencePickerFilteredRecords.some((record) => record.recordId === current)) {
        return current;
      }
      const selectedRecordId = String(recordForm[referenceFieldKey] ?? '').trim();
      if (selectedRecordId && referencePickerFilteredRecords.some((record) => record.recordId === selectedRecordId)) {
        return selectedRecordId;
      }
      return referencePickerFilteredRecords[0]?.recordId ?? null;
    });
  }, [
    recordForm,
    referenceFieldKey,
    referencePickerActiveRecordId,
    referencePickerError,
    referencePickerFilteredRecords,
    referencePickerLoading,
  ]);

  const indexDraft = useMemo(() => {
    if (!detail) return [];
    return (detail.indexes ?? []).map((index) => ({
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
  const publishReadiness = useMemo(
    () => (detail ? summarizeBuilderCmsPublishReadiness(detail.records) : null),
    [detail],
  );
  const visiblePublishCandidateIds = useMemo(
    () => (detail ? getBuilderCmsPublishCandidateRecordIds(visibleRecords) : []),
    [detail, visibleRecords],
  );
  const matchingPublishCandidateIds = useMemo(
    () => (detail
      ? getBuilderCmsPublishCandidateRecordIds(detail.records, { recordIds: recordQueryResult.filteredRecordIds })
      : []),
    [detail, recordQueryResult.filteredRecordIds],
  );
  const selectedPublishCandidateIds = useMemo(
    () => (detail
      ? getBuilderCmsPublishCandidateRecordIds(detail.records, { recordIds: selectedRecordIds })
      : []),
    [detail, selectedRecordIds],
  );
  const publishableRecordFilterActive = useMemo(
    () => recordFilters.length === 2
      && recordFilters.every((filter) => filter.fieldKey === 'status' && filter.operator === 'is-not')
      && recordFilters.some((filter) => filter.value === 'published')
      && recordFilters.some((filter) => filter.value === 'archived'),
    [recordFilters],
  );
  const activeRecordViewName = useMemo(
    () => savedViews.find((view) => view.viewId === selectedViewId)?.name ?? '',
    [savedViews, selectedViewId],
  );
  const recordViewChips = useMemo(() => {
    const chips: string[] = [];
    if (activeRecordViewName) chips.push(`View: ${activeRecordViewName}`);
    if (recordQuery.trim()) chips.push(`Search: "${recordQuery.trim()}"`);
    if (publishableRecordFilterActive) {
      chips.push('Filters: publishable only');
    } else if (recordFilters.length > 0) {
      chips.push(`Filters: ${recordFilters.length}`);
    }
    chips.push(`Sort: ${effectiveRecordSortBy} ${recordSortDirection === 'asc' ? '↑' : '↓'}`);
    if (recordGridPreviewFieldCount !== 4) chips.push(`Preview fields: ${recordGridPreviewFieldCount}`);
    if (recordPageSize !== DEFAULT_RECORD_PAGE_SIZE) chips.push(`Page size: ${recordPageSize}`);
    if (recordPage > 1) chips.push(`Page ${recordPage}`);
    return chips;
  }, [
    activeRecordViewName,
    effectiveRecordSortBy,
    publishableRecordFilterActive,
    recordFilters.length,
    recordPage,
    recordPageSize,
    recordQuery,
    recordSortDirection,
    recordGridPreviewFieldCount,
  ]);
  const recordViewResettable = Boolean(
    recordQuery.trim()
    || recordFilters.length > 0
    || recordSortBy !== 'updatedAt'
    || recordSortDirection !== 'desc'
    || recordPageSize !== DEFAULT_RECORD_PAGE_SIZE
    || recordPage > 1
    || selectedViewId
    || selectedRecordIds.length > 0
    || recordGridPreviewFieldCount !== 4,
  );
  const editingRecordLiveRoute = useMemo(
    () => (detail && editingRecordId ? buildEditingRecordLiveRoute(detail, locale, recordForm) : null),
    [detail, editingRecordId, locale, recordForm],
  );
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
      setRecordGridDensity('compact');
      setRecordGridPreviewFieldCount(4);
      return;
    }
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(recordGridDensityStorageKey(siteId, locale, detail.collectionId));
      setRecordGridDensity(stored === 'comfortable' ? 'comfortable' : 'compact');
    } catch {
      setRecordGridDensity('compact');
    }
  }, [detail, locale, siteId]);

  useEffect(() => {
    if (!detail || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        recordGridDensityStorageKey(siteId, locale, detail.collectionId),
        recordGridDensity,
      );
    } catch {
      // Ignore storage errors; the toggle is still usable for the current session.
    }
  }, [detail, locale, recordGridDensity, siteId]);

  useEffect(() => {
    if (!detail) {
      setRecordGridPreviewFieldCount(4);
      return;
    }
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(
        recordGridPreviewFieldCountStorageKey(siteId, locale, detail.collectionId),
      );
      setRecordGridPreviewFieldCount(
        stored === '2' || stored === '4' || stored === '6' ? Number(stored) as RecordGridPreviewFieldCount : 4,
      );
    } catch {
      setRecordGridPreviewFieldCount(4);
    }
  }, [detail, locale, siteId]);

  useEffect(() => {
    if (!detail || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        recordGridPreviewFieldCountStorageKey(siteId, locale, detail.collectionId),
        String(recordGridPreviewFieldCount),
      );
    } catch {
      // Ignore storage errors; the control is still usable for the current session.
    }
  }, [detail, locale, recordGridPreviewFieldCount, siteId]);

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
    clearRecordSelection();
    if (typeof window === 'undefined') return;
    setSavedViews(readSavedRecordViews(siteId, locale, detail.collectionId));
    setSelectedViewId('');
  }, [detail?.collectionId, detail, locale, siteId]);

  useEffect(() => {
    if (recordQueryResult.page !== recordPage) setRecordPage(recordQueryResult.page);
  }, [recordPage, recordQueryResult.page]);

  useEffect(() => {
    if (!editingRecordId || !focusedRecordFieldKey || typeof document === 'undefined') return;
    const target = Array.from(document.querySelectorAll<HTMLElement>('[data-cms-record-field-input]'))
      .find((element) => element.dataset.cmsRecordFieldInput === focusedRecordFieldKey);
    if (!target) return;
    target.focus();
    target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    setFocusedRecordFieldKey(null);
  }, [editingRecordId, focusedRecordFieldKey, recordForm]);

  useEffect(() => {
    let ignore = false;
    async function loadDynamicItemPages() {
      try {
        const response = await fetch(`/api/builder/site/pages?locale=${locale}`, {
          credentials: 'same-origin',
        });
        if (!response.ok) return;
        const payload = await response.json() as { pages?: DynamicItemPageReference[] };
        if (ignore) return;
        setDynamicItemPages((payload.pages ?? []).filter((page) => Boolean(page.dynamicItem)));
      } catch {
        if (!ignore) setDynamicItemPages([]);
      }
    }
    void loadDynamicItemPages();
    return () => {
      ignore = true;
    };
  }, [locale]);

  function setRecordSelection(recordIds: string[], anchorRecordId: string | null = recordIds[0] ?? null) {
    selectionAnchorRecordIdRef.current = anchorRecordId;
    setSelectedRecordIds(recordIds);
  }

  function clearRecordSelection() {
    selectionAnchorRecordIdRef.current = null;
    setSelectedRecordIds([]);
  }

  async function refreshCollections(nextSelectedId?: string) {
    const response = await fetch(`${apiBase(siteId)}?locale=${locale}`, { credentials: 'same-origin' });
    const payload = await response.json() as ApiCollectionList;
    if (!response.ok || !payload.ok) throw new Error(payload.error ?? 'Failed to refresh collections.');
    setSourceCollections(payload.collections ?? []);
    setCollections(payload.editableCollections ?? []);
    if (nextSelectedId) setSelectedCollectionId(nextSelectedId);
  }

  const updateCmsQueryState = useCallback((next: {
    collectionId?: string | null;
    recordId?: string | null;
    replace?: boolean;
  }) => {
    const params = new URLSearchParams(searchParamsString);
    if (next.collectionId !== undefined) {
      if (next.collectionId) params.set('collectionId', next.collectionId);
      else params.delete('collectionId');
    }
    if (next.recordId !== undefined) {
      if (next.recordId) params.set('recordId', next.recordId);
      else params.delete('recordId');
    }
    const nextQuery = params.toString();
    if (nextQuery === searchParamsString) return;
    const url = nextQuery ? `${pathname}?${nextQuery}` : pathname;
    const navigate = next.replace ? router.replace : router.push;
    navigate(url, { scroll: false });
  }, [pathname, router, searchParamsString]);

  function copyBuilderRoute(route: string) {
    void navigator.clipboard?.writeText(route).catch(() => undefined);
    setMessage(`Copied route: ${route}`);
  }

  function normalizeClipboardCell(value: unknown) {
    return String(value ?? '')
      .replace(/\r?\n/g, ' ')
      .replace(/\t/g, ' ')
      .trim();
  }

  function buildSelectedRecordsClipboardText() {
    if (!detail) return '';
    const headers = ['Record ID', 'Status', 'Locale', ...detail.fields.map((field) => field.label)];
    // Selection persists across pagination (selectMatchingRecords selects the
    // full filtered result), and cut deletes the entire selection. Build the
    // clipboard from the complete record set, not just the visible page, so a
    // cut can never delete rows it failed to copy (silent data loss).
    const rows = detail.records
      .filter((record) => selectedRecordIdSet.has(record.recordId))
      .map((record) => [
        record.recordId,
        record.status,
        record.locale ?? locale,
        ...detail.fields.map((field) => formatValue(record.fields[field.key])),
      ].map(normalizeClipboardCell).join('\t'));
    return [headers.join('\t'), ...rows].join('\n');
  }

  function escapeClipboardCsvCell(value: string) {
    return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
  }

  function parseClipboardTable(text: string): string[][] {
    return text
      .split(/\r?\n/)
      .filter((line) => line.trim().length > 0)
      .map((line) => line.split('\t'));
  }

  function buildClipboardImportPayload(text: string): { columnMap: Record<string, string>; csv: string } | null {
    if (!detail) return null;
    const table = parseClipboardTable(text);
    if (table.length === 0) return null;
    const headers = table[0].map((header) => header.trim()).filter(Boolean);
    if (headers.length === 0) return null;
    const headerMap = new Map<string, string>();
    headerMap.set('record id', 'recordId');
    headerMap.set('recordid', 'recordId');
    headerMap.set('status', 'status');
    headerMap.set('locale', 'locale');
    for (const field of detail.fields) {
      headerMap.set(field.key.trim().toLowerCase(), field.key);
      headerMap.set(field.label.trim().toLowerCase(), field.key);
    }
    const columnMap = Object.fromEntries(headers.flatMap((header) => {
      const target = headerMap.get(header.toLowerCase());
      return target ? [[target, header]] : [];
    }));
    if (Object.keys(columnMap).length === 0) return null;
    const csv = `${table.map((row) => row.map(escapeClipboardCsvCell).join(',')).join('\n')}\n`;
    return { columnMap, csv };
  }

  async function copySelectedRowsTsv() {
    if (!detail || selectedRecordIds.length === 0) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const text = buildSelectedRecordsClipboardText();
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', 'true');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const copied = document.execCommand('copy');
        textarea.remove();
        if (!copied) {
          throw new Error('Clipboard is not available.');
        }
      }
      setMessage(`Selected rows copied (${selectedRecordIds.length}).`);
    } catch (copyError) {
      setError(copyError instanceof Error ? copyError.message : 'Failed to copy selected rows.');
    } finally {
      setBusy(false);
    }
  }

  async function cutSelectedRowsTsv() {
    if (!detail || selectedRecordIds.length === 0) return;
    const selectedCount = selectedRecordIds.length;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const text = buildSelectedRecordsClipboardText();
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', 'true');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const copied = document.execCommand('copy');
        textarea.remove();
        if (!copied) {
          throw new Error('Clipboard is not available.');
        }
      }
      await bulkDeleteSelectedRecords();
      setMessage(`Cut selected rows (${selectedCount}).`);
    } catch (cutError) {
      setError(cutError instanceof Error ? cutError.message : 'Failed to cut selected rows.');
    } finally {
      setBusy(false);
    }
  }

  async function pasteClipboardRows() {
    if (!detail) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const clipboardText = await navigator.clipboard?.readText();
      if (!clipboardText?.trim()) {
        throw new Error('Clipboard is empty.');
      }
      const payload = buildClipboardImportPayload(clipboardText);
      if (!payload) {
        throw new Error('Clipboard text is not a recognized TSV table.');
      }
      const response = await fetch(
        `${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}/records/csv?locale=${locale}`,
        {
          credentials: 'same-origin',
          headers: cmsActorJsonHeaders(cmsActor),
          method: 'POST',
          body: JSON.stringify({
            csv: payload.csv,
            mode: 'append',
            columnMap: payload.columnMap,
            duplicateMode: true,
          }),
        },
      );
      if (!response.ok) {
        const result = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(result?.error ?? 'Failed to paste clipboard rows.');
      }
      const result = await response.json() as { imported?: number };
      await loadDetail(detail.collectionId, { preserveEditingState: true });
      setMessage(`Pasted clipboard rows.${typeof result.imported === 'number' ? ` Imported ${result.imported} records.` : ''}`);
    } catch (pasteError) {
      setError(pasteError instanceof Error ? pasteError.message : 'Failed to paste clipboard rows.');
    } finally {
      setBusy(false);
    }
  }

  const loadDetail = useCallback(async (
    collectionId: string,
    options?: { preserveEditingState?: boolean },
  ) => {
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
      if (!options?.preserveEditingState) {
        setRecordForm(createEmptyRecordForm(payload.detail.fields));
        setEditingRecordId(null);
      }
      setCsvColumnMap({});
      setCsvImportSummary(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load collection.');
    } finally {
      setBusy(false);
    }
  }, [locale, siteId]);

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

  function resetRecordView() {
    if (!detail) return;
    const nextFilterField = defaultRecordFilterField(detail.fields);
    const nextFilterOperator = recordFilterOperatorsForField(detail.fields, nextFilterField)[0]?.value ?? 'contains';
    setRecordQuery('');
    setRecordFilters([]);
    setRecordSortBy('updatedAt');
    setRecordSortDirection('desc');
    setRecordPageSize(DEFAULT_RECORD_PAGE_SIZE);
    setRecordPage(1);
    setSelectedViewId('');
    clearRecordSelection();
    setRecordFilterField(nextFilterField);
    setRecordFilterOperator(nextFilterOperator);
    setRecordFilterValue(defaultRecordFilterValue(nextFilterField, nextFilterOperator));
    setRecordGridDensity('compact');
    setRecordGridPreviewFieldCount(4);
    setMessage('Record view reset.');
  }

  function applyModerationStatusFilter(status: BuilderCmsRecordStatus | 'all') {
    setRecordFilters((current) => {
      const withoutModerationFilter = current.filter((filter) => filter.filterId !== 'moderation-status');
      if (status === 'all') return withoutModerationFilter;
      return [
        ...withoutModerationFilter,
        {
          filterId: 'moderation-status',
          fieldKey: 'status',
          operator: 'is',
          value: status,
        },
      ];
    });
    setRecordPage(1);
    setSelectedViewId('');
  }

  function applyRecordStatusFilter(status: BuilderCmsRecordStatus | 'all') {
    setRecordFilters((current) => {
      const withoutStatusFilter = current.filter((filter) => !filter.filterId.startsWith('record-status'));
      if (status === 'all') return withoutStatusFilter;
      return [
        ...withoutStatusFilter,
        {
          filterId: 'record-status',
          fieldKey: 'status',
          operator: 'is',
          value: status,
        },
      ];
    });
    setRecordPage(1);
    setSelectedViewId('');
  }

  function applyPublishableRecordFilter() {
    setRecordFilters((current) => {
      const withoutStatusFilters = current.filter((filter) => !filter.filterId.startsWith('record-status'));
      return [
        ...withoutStatusFilters,
        {
          filterId: 'record-status-publishable-published',
          fieldKey: 'status',
          operator: 'is-not',
          value: 'published',
        },
        {
          filterId: 'record-status-publishable-archived',
          fieldKey: 'status',
          operator: 'is-not',
          value: 'archived',
        },
      ];
    });
    setRecordPage(1);
    setSelectedViewId('');
  }

  function toggleRecordSelection(recordId: string, selected: boolean, options?: { shiftKey?: boolean }) {
    const next = resolveCmsRecordSelectionRange({
      anchorRecordId: selectionAnchorRecordIdRef.current,
      currentSelectedRecordIds: selectedRecordIds,
      selected,
      shiftKey: Boolean(options?.shiftKey),
      targetRecordId: recordId,
      visibleRecordIds,
    });
    selectionAnchorRecordIdRef.current = next.nextAnchorRecordId;
    setSelectedRecordIds(next.nextSelectedRecordIds);
  }

  function extendRecordSelectionByKeyboard(recordId: string, direction: -1 | 1) {
    const currentIndex = visibleRecordIds.indexOf(recordId);
    if (currentIndex < 0) return;
    const targetRecordId = visibleRecordIds[currentIndex + direction];
    if (!targetRecordId) return;
    toggleRecordSelection(targetRecordId, true, { shiftKey: true });
    const targetCheckbox = document.querySelector<HTMLInputElement>(`[aria-label="Select ${CSS.escape(targetRecordId)}"]`);
    targetCheckbox?.focus();
  }

  function handleRecordSelectionKeyDown(
    event: ReactKeyboardEvent<HTMLInputElement>,
    recordId: string,
  ) {
    if (event.key === 'Escape') {
      event.preventDefault();
      clearRecordSelection();
      return;
    }
    if ((event.key === 'Delete' || event.key === 'Backspace') && selectedRecordIds.length > 0) {
      event.preventDefault();
      void bulkDeleteSelectedRecords();
      return;
    }
    if (event.shiftKey && (event.metaKey || event.ctrlKey) && event.key === 'Enter' && selectedPublishCandidateIds.length > 0) {
      event.preventDefault();
      void bulkPublishSelectedRecords();
      return;
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'a') {
      event.preventDefault();
      toggleVisibleRecordSelection(true);
      return;
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'c' && selectedRecordIds.length > 0) {
      event.preventDefault();
      void copySelectedRowsTsv();
      return;
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'x' && selectedRecordIds.length > 0) {
      event.preventDefault();
      void cutSelectedRowsTsv();
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      const record = detail?.records.find((candidate) => candidate.recordId === recordId);
      if (record) beginEditRecord(record);
      return;
    }
    if (!event.shiftKey) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      extendRecordSelectionByKeyboard(recordId, 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      extendRecordSelectionByKeyboard(recordId, -1);
    }
  }

  function handleRecordGridKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'v') {
      event.preventDefault();
      void pasteClipboardRows();
    }
  }

  function toggleVisibleRecordSelection(selected: boolean) {
    selectionAnchorRecordIdRef.current = selected ? visibleRecordIds[0] ?? null : null;
    setSelectedRecordIds((current) => {
      const visibleIdSet = new Set(visibleRecordIds);
      if (!selected) return current.filter((recordId) => !visibleIdSet.has(recordId));
      const next = new Set(current);
      for (const recordId of visibleRecordIds) next.add(recordId);
      return [...next];
    });
  }

  function selectVisiblePublishCandidates() {
    setRecordSelection(visiblePublishCandidateIds);
  }

  function selectMatchingRecords() {
    setRecordSelection(recordQueryResult.filteredRecordIds);
  }

  function selectSelectedPublishableRecords() {
    setRecordSelection(selectedPublishCandidateIds);
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
        headers: cmsActorJsonHeaders(cmsActor),
        body: JSON.stringify({ fields: recordForm }),
      });
      const result = await response.json() as {
        ok: boolean;
        record?: BuilderCmsRecord;
        redirectCreated?: boolean;
        redirectWarnings?: string[];
        error?: string;
        issues?: string[];
      };
      if (!response.ok || !result.ok || !result.record) {
        throw new Error(result.issues?.join('\n') || result.error || 'Failed to save record.');
      }
      await loadDetail(detail.collectionId);
      await refreshCollections(detail.collectionId);
      setMessage(buildRecordSaveMessage(editingRecordId ? 'Record updated.' : 'Record created.', result));
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save record.');
    } finally {
      setBusy(false);
    }
  }

  function handleRecordEditorKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 's') return;
    event.preventDefault();
    void saveRecord();
  }

  async function openReferencePicker(field: BuilderCmsFieldDefinition) {
    const relationCollectionId = field.relationCollectionId?.trim();
    if (!detail || !relationCollectionId) return;
    setReferenceFieldKey(field.key);
    setReferencePickerCollectionId(relationCollectionId);
    setReferencePickerCollectionName('');
    setReferencePickerCollectionDetail(null);
    setReferencePickerRecords([]);
    setReferencePickerQuery('');
    setReferencePickerActiveRecordId(null);
    setReferencePickerError(null);
    setReferencePickerLoading(true);
    try {
      if (relationCollectionId === detail.collectionId) {
        setReferencePickerCollectionName(detail.name);
        setReferencePickerCollectionDetail(detail);
        setReferencePickerRecords(detail.records);
      } else {
        const response = await fetch(`${apiBase(siteId)}/${encodeURIComponent(relationCollectionId)}?locale=${locale}`, {
          credentials: 'same-origin',
        });
        const payload = await response.json() as ApiCollectionDetail;
        if (!response.ok || !payload.ok || !payload.detail) {
          throw new Error(payload.error ?? 'Failed to load reference records.');
        }
        setReferencePickerCollectionName(payload.detail.name);
        setReferencePickerCollectionDetail(payload.detail);
        setReferencePickerRecords(payload.detail.records ?? []);
        const selectedRecordId = String(recordForm[field.key] ?? '').trim();
        const nextActiveRecordId = payload.detail.records?.some((record) => record.recordId === selectedRecordId)
          ? selectedRecordId
          : payload.detail.records?.[0]?.recordId ?? null;
        setReferencePickerActiveRecordId(nextActiveRecordId);
      }
    } catch (pickerError) {
      setReferencePickerError(pickerError instanceof Error ? pickerError.message : 'Failed to load reference records.');
    } finally {
      setReferencePickerLoading(false);
    }
  }

  function closeReferencePicker() {
    setReferenceFieldKey(null);
    setReferencePickerCollectionId(null);
    setReferencePickerCollectionName('');
    setReferencePickerCollectionDetail(null);
    setReferencePickerRecords([]);
    setReferencePickerQuery('');
    setReferencePickerActiveRecordId(null);
    setReferencePickerError(null);
    setReferencePickerLoading(false);
  }

  function clearReferenceSelection() {
    if (!referenceFieldKey) return;
    setRecordForm((current) => ({ ...current, [referenceFieldKey]: '' }));
    setMessage('Reference cleared.');
    closeReferencePicker();
  }

  function handleReferencePickerSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeReferencePicker();
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (referencePickerFilteredRecords.length === 0) return;
      const currentIndex = Math.max(
        0,
        referencePickerFilteredRecords.findIndex((record) => record.recordId === referencePickerActiveRecordId),
      );
      const nextIndex = event.key === 'ArrowDown'
        ? Math.min(referencePickerFilteredRecords.length - 1, currentIndex + 1)
        : Math.max(0, currentIndex - 1);
      setReferencePickerActiveRecordId(referencePickerFilteredRecords[nextIndex]?.recordId ?? null);
      return;
    }
    if (event.key !== 'Enter') return;
    const recordToUse = referencePickerFilteredRecords.find((record) => record.recordId === referencePickerActiveRecordId)
      ?? referencePickerFilteredRecords[0];
    if (!recordToUse) return;
    event.preventDefault();
    pickReferenceRecord(recordToUse.recordId);
  }

  function pickReferenceRecord(recordId: string) {
    if (!referenceFieldKey) return;
    setRecordForm((current) => ({ ...current, [referenceFieldKey]: recordId }));
    setMessage('Reference selected from record picker.');
    closeReferencePicker();
  }

  async function saveInlineRecordField(
    record: BuilderCmsRecord,
    field: BuilderCmsFieldDefinition,
    value: RecordFormValue,
  ) {
    if (!detail) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(
        `${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}/records/${encodeURIComponent(record.recordId)}?locale=${locale}`,
        {
          method: 'PATCH',
          credentials: 'same-origin',
          headers: cmsActorJsonHeaders(cmsActor),
          body: JSON.stringify({
            fields: {
              ...record.fields,
              [field.key]: value,
            },
          }),
        },
      );
      const result = await response.json() as ApiRecordMutation;
      if (!response.ok || !result.ok || !result.record) {
        throw new Error(result.issues?.join('\n') || result.error || 'Failed to save inline field.');
      }
      await loadDetail(detail.collectionId);
      await refreshCollections(detail.collectionId);
      setMessage(buildRecordSaveMessage(`Inline field saved: ${field.label}.`, result));
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save inline field.');
      throw saveError;
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
        { method: 'DELETE', credentials: 'same-origin', headers: cmsActorHeaders(cmsActor) },
      );
      const result = await response.json() as { ok: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error ?? 'Failed to delete record.');
      await loadDetail(detail.collectionId);
      await refreshCollections(detail.collectionId);
      setSelectedRecordIds((current) => current.filter((candidate) => candidate !== recordId));
      if (editingRecordId === recordId) {
        updateCmsQueryState({
          collectionId: detail.collectionId,
          recordId: null,
          replace: true,
        });
      }
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
        { method: 'POST', credentials: 'same-origin', headers: cmsActorHeaders(cmsActor) },
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

  async function bulkDuplicateSelectedRecords() {
    if (!detail || selectedRecordIds.length === 0) return;
    if (!window.confirm(`Duplicate ${selectedRecordIds.length} selected records?`)) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const duplicatedRecordIds: string[] = [];
      for (const recordId of selectedRecordIds) {
        const response = await fetch(
          `${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}/records/${encodeURIComponent(recordId)}/duplicate?locale=${locale}`,
          { method: 'POST', credentials: 'same-origin', headers: cmsActorHeaders(cmsActor) },
        );
        const result = await response.json() as ApiRecordMutation;
        if (!response.ok || !result.ok || !result.record) {
          throw new Error(result.issues?.join('\n') || result.error || 'Failed to duplicate selected records.');
        }
        duplicatedRecordIds.push(result.record.recordId);
      }
      await loadDetail(detail.collectionId);
      await refreshCollections(detail.collectionId);
      clearRecordSelection();
      setMessage(`Duplicated ${duplicatedRecordIds.length} selected records.`);
    } catch (duplicateError) {
      setError(duplicateError instanceof Error ? duplicateError.message : 'Failed to duplicate selected records.');
    } finally {
      setBusy(false);
    }
  }

  async function bulkUpdateRecordsStatus(
    recordIds: string[],
    status: BuilderCmsRecordStatus,
    options?: { confirmMessage?: string },
  ) {
    if (!detail || recordIds.length === 0) return;
    const actionLabel = recordStatusActionLabels[status];
    const reason = moderationReason.trim();
    const reasonSuffix = reason ? `\nReason: ${reason}` : '';
    const confirmMessage = options?.confirmMessage ?? `${actionLabel} ${recordIds.length} selected records?${reasonSuffix}`;
    if (!window.confirm(confirmMessage)) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(
        `${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}/records/bulk?locale=${locale}`,
        {
          method: 'POST',
          credentials: 'same-origin',
          headers: cmsActorJsonHeaders(cmsActor),
          body: JSON.stringify({
            action: 'status',
            status,
            recordIds,
            ...(reason ? { moderationReason: reason } : {}),
          }),
        },
      );
      const result = await response.json() as ApiBulkRecordMutation;
      if (!response.ok || !result.ok) {
        throw new Error(result.issues?.join('\n') || result.error || 'Failed to update selected records.');
      }
      await loadDetail(detail.collectionId);
      await refreshCollections(detail.collectionId);
      clearRecordSelection();
      setModerationReason('');
      const missing = result.missingRecordIds?.length ? ` ${result.missingRecordIds.length} missing.` : '';
      setMessage(`Updated ${result.updated ?? 0} selected records.${missing}`);
    } catch (bulkError) {
      setError(bulkError instanceof Error ? bulkError.message : 'Failed to update selected records.');
    } finally {
      setBusy(false);
    }
  }

  async function bulkUpdateSelectedRecordsStatus(status: BuilderCmsRecordStatus) {
    await bulkUpdateRecordsStatus(selectedRecordIds, status);
  }

  async function bulkPublishVisibleRecords() {
    await bulkUpdateRecordsStatus(visiblePublishCandidateIds, 'published', {
      confirmMessage: `Publish ${visiblePublishCandidateIds.length} publishable records from the visible page?`,
    });
  }

  async function bulkPublishMatchingRecords() {
    await bulkUpdateRecordsStatus(matchingPublishCandidateIds, 'published', {
      confirmMessage: `Publish ${matchingPublishCandidateIds.length} publishable records from the full filtered result set?`,
    });
  }

  async function bulkPublishSelectedRecords() {
    await bulkUpdateRecordsStatus(selectedPublishCandidateIds, 'published', {
      confirmMessage: `Publish ${selectedPublishCandidateIds.length} publishable records from the current selection?`,
    });
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
          headers: cmsActorJsonHeaders(cmsActor),
          body: JSON.stringify({ action: 'delete', recordIds: selectedRecordIds }),
        },
      );
      const result = await response.json() as ApiBulkRecordMutation;
      if (!response.ok || !result.ok) {
        throw new Error(result.issues?.join('\n') || result.error || 'Failed to delete selected records.');
      }
      await loadDetail(detail.collectionId);
      await refreshCollections(detail.collectionId);
      clearRecordSelection();
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
        { credentials: 'same-origin', headers: cmsActorHeaders(cmsActor) },
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

  async function exportSelectedCsv() {
    if (!detail || selectedRecordIds.length === 0) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const params = new URLSearchParams({ locale });
      selectedRecordIds.forEach((recordId) => params.append('recordIds', recordId));
      const response = await fetch(
        `${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}/records/csv?${params.toString()}`,
        { credentials: 'same-origin', headers: cmsActorHeaders(cmsActor) },
      );
      if (!response.ok) {
        const result = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(result?.error ?? 'Failed to export selected CSV.');
      }
      const csv = await response.text();
      const filename = filenameFromContentDisposition(response.headers.get('content-disposition'))
        ?? `${detail.slug || detail.collectionId}-selected-records.csv`;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
      setMessage('Selected CSV exported.');
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : 'Failed to export selected CSV.');
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
          headers: cmsActorJsonHeaders(cmsActor),
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
        { method: 'POST', credentials: 'same-origin', headers: cmsActorHeaders(cmsActor) },
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

  const beginEditRecord = useCallback((record: BuilderCmsRecord, focusFieldKey?: string) => {
    if (!detail) return;
    setEditingRecordId(record.recordId);
    setRecordForm(createRecordFormFromRecord(detail.fields, record));
    setFocusedRecordFieldKey(focusFieldKey ?? null);
    updateCmsQueryState({
      collectionId: detail.collectionId,
      recordId: record.recordId,
    });
  }, [detail, updateCmsQueryState]);

  useEffect(() => {
    if (!queryCollectionId || busy) return;
    const sourceCollection = sourceCollections.find((collection) => collection.id === queryCollectionId);
    if (sourceCollection) {
      setSelectedCollectionId('');
      setDetail(null);
      setEditingRecordId(null);
      setFocusedRecordFieldKey(null);
      cmsQueryOpenKeyRef.current = null;
      return;
    }
    if (selectedCollectionId !== queryCollectionId) {
      setSelectedCollectionId(queryCollectionId);
    }
    if (!detail || detail.collectionId !== queryCollectionId) {
      void loadDetail(queryCollectionId, { preserveEditingState: Boolean(queryRecordId) });
    }
  }, [
    busy,
    detail,
    loadDetail,
    queryCollectionId,
    queryRecordId,
    selectedCollectionId,
    sourceCollections,
  ]);

  useLayoutEffect(() => {
    if (!detail || !queryCollectionId || !queryRecordId) {
      cmsQueryOpenKeyRef.current = null;
      return;
    }
    if (detail.collectionId !== queryCollectionId) return;
    const syncKey = `${queryCollectionId}:${queryRecordId}`;
    if (cmsQueryOpenKeyRef.current === syncKey) return;
    const record = detail.records.find((candidate) => candidate.recordId === queryRecordId);
    if (!record || editingRecordId === record.recordId) return;
    cmsQueryOpenKeyRef.current = syncKey;
    beginEditRecord(record);
  }, [beginEditRecord, detail, editingRecordId, queryCollectionId, queryRecordId]);

  return (
    <>
      <div style={panelStyle} data-cms-content-manager>
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
                updateCmsQueryState({
                  collectionId: collection.collectionId,
                  recordId: null,
                  replace: true,
                });
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
                <input name="name" type="text" style={inputStyle} placeholder="컬렉션 표시 이름 · 예: Testimonials" disabled={busy} />
              </label>
              <label style={labelStyle}>
                ID
                <input name="collectionId" type="text" style={inputStyle} placeholder="컬렉션 ID · 영문 소문자·숫자·하이픈, 2~63자 · 예: testimonials" disabled={busy} />
              </label>
              <label style={labelStyle}>
                Description
                <input name="description" type="text" style={inputStyle} placeholder="컬렉션 설명 · 예: Client quotes" disabled={busy} />
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
          <article key={collection.id} className="builder-dashboard-page-card" data-cms-source-collection={collection.id}>
                <div className="builder-dashboard-page-head">
                  <div>
                    <strong>{collection.title}</strong>
                    <span>{collection.sourceLabel}</span>
                  </div>
                  <span className="builder-stage-pill">{getSourceCollectionStatus(collection.id).label}</span>
                </div>
                <div className="builder-dashboard-page-meta">
                  <span>{collection.recordCount} records</span>
                  <span>{collection.fieldCount} fields</span>
                  <span>{collection.routeBindings.length} routes</span>
                </div>
                <SourceCollectionOverview collection={collection} locale={locale} siteId={siteId} />
        <SourceCollectionRecordPreviewTable
          collection={collection}
          locale={locale}
          onCopyRoute={copyBuilderRoute}
          onSourceRecordSaved={() => refreshCollections()}
        />
                <SourceCollectionLifecycleCard collection={collection} locale={locale} />
          </article>
        ))}
      </div>
    </section>

        {selectedSourceSummary ? (
          <section className="builder-preview-inspector-card" data-cms-source-collection-focus={selectedSourceSummary.id}>
            <h2>{selectedSourceSummary.title}</h2>
            <p>{selectedSourceSummary.description}</p>
            <SourceCollectionOverview collection={selectedSourceSummary} locale={locale} siteId={siteId} />
            <SourceCollectionRecordPreviewTable
              collection={selectedSourceSummary}
              locale={locale}
              onCopyRoute={copyBuilderRoute}
              onSourceRecordSaved={() => refreshCollections()}
            />
            <SourceCollectionLifecycleCard collection={selectedSourceSummary} locale={locale} />
            {selectedSourceSummary.bindableTargets.length ? (
              <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
                <strong style={helperTextStyle}>Bindable targets</strong>
                <div className="builder-dashboard-page-actions">
                  {selectedSourceSummary.bindableTargets.map((target) => (
                    <Link
                      key={target.targetId}
                      href={buildBuilderPageDatasetHref(locale, target.pageKey, { targetId: target.targetId })}
                      className="builder-action-btn"
                      data-cms-source-target-link={target.targetId}
                    >
                      {target.title}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

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
              {publishReadiness ? (
                <div className="builder-dashboard-kpi-grid" style={{ marginTop: 12 }}>
                  <article className="builder-dashboard-kpi-card">
                    <strong>{publishReadiness.publishable}</strong>
                    <span>Publishable</span>
                  </article>
                  <article className="builder-dashboard-kpi-card">
                    <strong>{publishReadiness.published}</strong>
                    <span>Published</span>
                  </article>
                  <article className="builder-dashboard-kpi-card">
                    <strong>{publishReadiness.draft + publishReadiness.pending}</strong>
                    <span>Awaiting publish</span>
                  </article>
                  <article className="builder-dashboard-kpi-card">
                    <strong>{publishReadiness.archived}</strong>
                    <span>Archived</span>
                  </article>
                </div>
              ) : null}
              <CmsDynamicListPageAction
                locale={locale}
                siteId={siteId}
                collection={detail}
                disabled={busy}
              />
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
              <div style={{ ...formGridStyle, marginBottom: 12 }}>
                <label style={labelStyle}>
                  Record actor
                  <select
                    value={cmsActor}
                    onChange={(event) => setCmsActor(event.target.value as BuilderCmsPermissionActor)}
                    style={inputStyle}
                    disabled={busy}
                  >
                    {builderCmsPermissionActors.map((actor) => (
                      <option key={actor} value={actor}>{cmsPermissionActorLabels[actor]}</option>
                    ))}
                  </select>
                </label>
                <article className="builder-dashboard-page-card">
                  <div className="builder-dashboard-page-head">
                    <div>
                      <strong>{cmsPermissionActorLabels[cmsActor]}</strong>
                      <span>Active record request actor</span>
                    </div>
                    <span className="builder-stage-pill">{cmsActor}</span>
                  </div>
                </article>
              </div>
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
                    <input name="label" type="text" style={inputStyle} placeholder="필드 표시 이름 · 예: Summary" disabled={busy} />
                  </label>
                  <label style={labelStyle}>
                    Field key
                    <input name="key" type="text" style={inputStyle} placeholder="필드 키 · 영문·숫자·밑줄, 1~63자 · 예: summary" disabled={busy} />
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
                    <input name="defaultValue" type="text" style={inputStyle} placeholder="선택 기본값" disabled={busy} />
                  </label>
                  <label style={labelStyle}>
                    Help text
                    <input name="helpText" type="text" style={inputStyle} placeholder="필드 아래 도움말 · 예: 필수 입력 항목입니다" disabled={busy} />
                  </label>
                  <label style={labelStyle}>
                    Min
                    <input name="validationMin" type="number" style={inputStyle} placeholder="최소값/최소 길이" disabled={busy} />
                  </label>
                  <label style={labelStyle}>
                    Max
                    <input name="validationMax" type="number" style={inputStyle} placeholder="최대값/최대 길이" disabled={busy} />
                  </label>
                  <label style={labelStyle}>
                    Regex pattern
                    <input name="validationPattern" type="text" style={inputStyle} placeholder="정규식 · 예: ^[A-Z].+" disabled={busy} />
                  </label>
                  <label style={labelStyle}>
                    Allowed options
                    <textarea
                      name="validationOptions"
                      style={{ ...inputStyle, minHeight: 72, resize: 'vertical' }}
                      placeholder="한 줄에 한 옵션"
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
                    <input name="name" type="text" style={inputStyle} placeholder="인덱스 이름 · 예: Published lookup" disabled={busy} />
                  </label>
                  <label style={labelStyle}>
                    Fields
                    <input name="fields" type="text" style={inputStyle} placeholder="인덱스 필드 · 쉼표 구분 · 예: slug, status" disabled={busy} />
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
              {editingRecordLiveRoute ? (
                <div className="builder-dashboard-page-meta" style={{ marginBottom: 12 }}>
                  <Link
                    href={editingRecordLiveRoute}
                    data-cms-record-live-route-link={editingRecordId ?? ''}
                    className="builder-link-inline"
                  >
                    Open live route
                  </Link>
                </div>
              ) : null}
              <div data-cms-record-editor style={{ display: 'grid', gap: 12 }} onKeyDown={handleRecordEditorKeyDown}>
                <div style={formGridStyle}>
                  {detail.fields.map((field) => (
                    <CmsFieldInput
                      key={field.fieldId}
                      field={field}
                      value={recordForm[field.key]}
                      collectionSlug={detail.slug}
                      duplicateRecordId={findDuplicateFieldRecord(
                        detail.records,
                        field,
                        recordForm[field.key],
                        editingRecordId,
                      )}
                      dynamicItemUrlBases={dynamicItemPages
                        .filter((page) => (
                          (page.dynamicItem?.cmsCollectionId ?? page.dynamicItem?.collectionId) === detail.collectionId
                          && page.dynamicItem?.slugField === field.key
                        ))
                        .map((page) => `/${page.locale}/${page.slug}`)}
                      locale={locale}
                      disabled={busy}
                      onChange={(value) => setRecordForm((current) => ({ ...current, [field.key]: value }))}
                      onRequestAssetLibrary={
                        field.type === 'image' ? () => setAssetFieldKey(field.key) : undefined
                      }
                      onRequestRecordPicker={
                        field.type === 'reference' ? () => void openReferencePicker(field) : undefined
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
                        updateCmsQueryState({
                          collectionId: detail.collectionId,
                          recordId: null,
                          replace: true,
                        });
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
                {publishReadiness ? (
                  <div className="builder-dashboard-page-actions" data-cms-status-filters>
                    <span style={{ color: '#64748b', fontSize: 12, fontWeight: 700 }}>Record status</span>
                    <button
                      type="button"
                      className={`builder-action-btn${publishableRecordFilterActive ? ' builder-action-btn--primary' : ''}`}
                      data-cms-status-filter="publishable"
                      onClick={() => applyPublishableRecordFilter()}
                      disabled={busy}
                    >
                      Publishable only ({publishReadiness.publishable})
                    </button>
                    {builderCmsRecordStatuses.map((status) => (
                      <button
                        key={status}
                        type="button"
                        className="builder-action-btn"
                        data-cms-status-filter={status}
                        onClick={() => applyRecordStatusFilter(status)}
                        disabled={busy}
                      >
                        {status} ({publishReadiness[status]})
                      </button>
                    ))}
                    <button
                      type="button"
                      className="builder-action-btn"
                      data-cms-status-filter="all"
                      onClick={() => applyRecordStatusFilter('all')}
                      disabled={busy}
                    >
                      All
                    </button>
                  </div>
                ) : null}
                <div className="builder-dashboard-page-actions" data-cms-moderation-filters>
                  <span style={{ color: '#64748b', fontSize: 12, fontWeight: 700 }}>Moderation</span>
                  {(['pending', 'approved', 'rejected'] as BuilderCmsRecordStatus[]).map((status) => (
                    <button
                      key={status}
                      type="button"
                      className="builder-action-btn"
                      data-cms-moderation-filter={status}
                      onClick={() => applyModerationStatusFilter(status)}
                      disabled={busy}
                    >
                      {status}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="builder-action-btn"
                    data-cms-moderation-filter="all"
                    onClick={() => applyModerationStatusFilter('all')}
                    disabled={busy}
                  >
                    All
                  </button>
                </div>
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
                <EditableRecordGridSummary
                  detail={detail}
                  filterCount={recordFilters.length}
                  matchingCount={recordQueryResult.total}
                  page={recordQueryResult.page}
                  pageCount={recordQueryResult.pageCount}
                  selectedCount={selectedRecordIds.length}
                  viewChips={recordViewChips}
                  viewResettable={recordViewResettable}
                  onResetView={() => resetRecordView()}
                  density={recordGridDensity}
                  onDensityChange={setRecordGridDensity}
                  previewFieldCount={recordGridPreviewFieldCount}
                  onPreviewFieldCountChange={setRecordGridPreviewFieldCount}
                  visibleCount={visibleRecords.length}
                />
                {recordGridDensity === 'compact' ? (
                  <div style={editableRecordCompactHeaderStyle} data-cms-record-grid-column-header>
                    <span style={editableRecordCompactHeaderCellStyle}>Record</span>
                    <span style={editableRecordCompactHeaderCellStyle}>Status</span>
                    <span style={editableRecordCompactHeaderCellStyle}>Locale</span>
                    <span style={editableRecordCompactHeaderCellStyle}>Revisions</span>
                    <span style={editableRecordCompactHeaderCellStyle}>Preview</span>
                  </div>
                ) : null}
                {publishReadiness ? (
                  <div className="builder-dashboard-kpi-grid" style={{ marginTop: 12 }}>
                    <article className="builder-dashboard-kpi-card">
                      <strong>{publishReadiness.publishable}</strong>
                      <span>Publishable</span>
                    </article>
                    <article className="builder-dashboard-kpi-card">
                      <strong>{publishReadiness.published}</strong>
                      <span>Published</span>
                    </article>
                    <article className="builder-dashboard-kpi-card">
                      <strong>{publishReadiness.draft + publishReadiness.pending}</strong>
                      <span>Awaiting publish</span>
                    </article>
                    <article className="builder-dashboard-kpi-card">
                      <strong>{publishReadiness.archived}</strong>
                      <span>Archived</span>
                    </article>
                  </div>
                ) : null}
                <label style={labelStyle}>
                  Moderation reason
                  <textarea
                    data-cms-moderation-reason-input
                    style={{ ...inputStyle, minHeight: 74, resize: 'vertical' }}
                    value={moderationReason}
                    maxLength={500}
                    placeholder="Reason saved with pending/approve/reject history"
                    disabled={busy}
                    onChange={(event) => setModerationReason(event.target.value)}
                  />
                </label>
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
                  <button
                    type="button"
                    className="builder-action-btn"
                    onClick={() => selectVisiblePublishCandidates()}
                    disabled={busy || visiblePublishCandidateIds.length === 0}
                  >
                    Select unpublished ({visiblePublishCandidateIds.length})
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    onClick={() => selectMatchingRecords()}
                    disabled={busy || recordQueryResult.filteredRecordIds.length === 0}
                  >
                    Select matching ({recordQueryResult.filteredRecordIds.length})
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    onClick={() => selectSelectedPublishableRecords()}
                    disabled={busy || selectedPublishCandidateIds.length === 0}
                  >
                    Keep publishable selected ({selectedPublishCandidateIds.length})
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn builder-action-btn--primary"
                    onClick={() => void bulkPublishVisibleRecords()}
                    disabled={busy || visiblePublishCandidateIds.length === 0}
                  >
                    Publish visible ({visiblePublishCandidateIds.length})
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn builder-action-btn--primary"
                    onClick={() => void bulkPublishMatchingRecords()}
                    disabled={busy || matchingPublishCandidateIds.length === 0}
                  >
                    Publish matching ({matchingPublishCandidateIds.length})
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn builder-action-btn--primary"
                    onClick={() => void bulkPublishSelectedRecords()}
                    disabled={busy || selectedPublishCandidateIds.length === 0}
                  >
                    Publish selected publishable ({selectedPublishCandidateIds.length})
                  </button>
                  <span style={{ color: '#64748b', fontSize: 12 }}>
                    {selectedRecordIds.length} selected
                  </span>
                  {recordStatusActions.map((action) => (
                    <button
                      key={action.status}
                      type="button"
                      className="builder-action-btn"
                      onClick={() => void bulkUpdateSelectedRecordsStatus(action.status)}
                      disabled={busy || selectedRecordIds.length === 0}
                    >
                      {action.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="builder-action-btn"
                    onClick={() => void copySelectedRowsTsv()}
                    disabled={busy || selectedRecordIds.length === 0}
                  >
                    Copy selected TSV ({selectedRecordIds.length})
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    onClick={() => void cutSelectedRowsTsv()}
                    disabled={busy || selectedRecordIds.length === 0}
                  >
                    Cut selected ({selectedRecordIds.length})
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    onClick={() => void pasteClipboardRows()}
                    disabled={busy}
                  >
                    Paste clipboard TSV
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    onClick={() => void bulkDuplicateSelectedRecords()}
                    disabled={busy || selectedRecordIds.length === 0}
                  >
                    Duplicate selected
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    onClick={() => void exportSelectedCsv()}
                    disabled={busy || selectedRecordIds.length === 0}
                  >
                    Export selected ({selectedRecordIds.length})
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
                    onClick={() => selectVisiblePublishCandidates()}
                    disabled={busy || visiblePublishCandidateIds.length === 0}
                  >
                    Select unpublished
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    onClick={() => clearRecordSelection()}
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
              <div
                className="builder-dashboard-page-list"
                data-cms-record-grid
                tabIndex={0}
                onKeyDown={handleRecordGridKeyDown}
              >
                {visibleRecords.map((record, recordIndex) => (
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
                          onMouseDown={(event) => {
                            const nativeEvent = event.nativeEvent as MouseEvent;
                            selectionRangeShiftKeyRef.current = Boolean(
                              nativeEvent.shiftKey || nativeEvent.getModifierState?.('Shift'),
                            );
                          }}
                          onClick={(event) => toggleRecordSelection(
                            record.recordId,
                            !selectedRecordIdSet.has(record.recordId),
                            {
                              shiftKey: selectionRangeShiftKeyRef.current
                                || Boolean((event.nativeEvent as MouseEvent).shiftKey)
                                || Boolean((event.nativeEvent as MouseEvent).getModifierState?.('Shift')),
                            },
                          )}
                          onKeyDown={(event) => handleRecordSelectionKeyDown(event, record.recordId)}
                          onChange={() => undefined}
                        />
                        <span style={{ display: 'grid', minWidth: 0 }}>
                          <strong>{record.fields.title ? String(record.fields.title) : record.recordId}</strong>
                          <span>{record.recordId}</span>
                        </span>
                      </label>
                      <span className="builder-stage-pill">{record.status}</span>
                    </div>
                    <EditableRecordSpreadsheetRow
                      detail={detail}
                      previewFieldCount={recordGridPreviewFieldCount}
                      record={record}
                    />
                    {recordGridDensity === 'comfortable' ? (
                      <>
                        <EditableRecordRoutePreview detail={detail} locale={locale} record={record} onCopyRoute={copyBuilderRoute} />
                        <EditableRecordGridHeader detail={detail} />
                        <EditableRecordFieldGrid
                          busy={busy}
                          detail={detail}
                          locale={locale}
                          inlineNavigationFocusRef={inlineNavigationFocusRef}
                          onEditField={(fieldKey) => beginEditRecord(record, fieldKey)}
                          onSaveField={(field, value) => saveInlineRecordField(record, field, value)}
                          onToast={(message, tone) => {
                            if (tone === 'error') setError(message);
                            else setMessage(message);
                          }}
                          record={record}
                          recordIndex={recordIndex}
                        />
                      </>
                    ) : null}
                    <div
                      style={recordGridDensity === 'compact' ? editableRecordCompactActionsStyle : undefined}
                      className="builder-dashboard-page-actions"
                    >
                      <div style={recordGridDensity === 'compact' ? editableRecordCompactPrimaryActionsStyle : undefined}>
                        <Link
                          href={buildRecordRoutePreviewPath(
                            detail,
                            locale,
                            formatValue(record.fields[detail.fields.find((field) => field.type === 'slug')?.key ?? '']),
                            record.locale ?? undefined,
                          ) ?? '#'}
                          data-cms-record-live-route-card-link={record.recordId}
                          className="builder-link-inline"
                          style={{ alignSelf: 'center' }}
                          >
                            Open live route
                          </Link>
                        <button
                          type="button"
                          className="builder-link-inline"
                          data-cms-record-live-route-copy={record.recordId}
                          onClick={() => copyBuilderRoute(
                            buildRecordRoutePreviewPath(
                              detail,
                              locale,
                              formatValue(record.fields[detail.fields.find((field) => field.type === 'slug')?.key ?? '']),
                              record.locale ?? undefined,
                            ) ?? '',
                          )}
                        >
                          Copy route
                        </button>
                        <a
                          href={buildBuilderCmsRecordHref(locale, detail.collectionId, record.recordId)}
                          data-cms-record-open-link={record.recordId}
                          className="builder-link-inline"
                          style={{ alignSelf: 'center' }}
                        >
                          Open record link
                        </a>
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
                      {recordGridDensity === 'compact' ? (
                        <span style={helperTextStyle} data-cms-record-row-actions={record.recordId}>
                          {record.moderation?.history?.length ? `${record.moderation.history.length} moderation events` : 'No moderation history'}
                        </span>
                      ) : null}
                    </div>
                    {recordGridDensity === 'comfortable' && record.moderation?.history?.length ? (
                      <div
                        data-cms-moderation-history={record.recordId}
                        style={{ borderTop: '1px solid #e2e8f0', display: 'grid', gap: 6, marginTop: 10, paddingTop: 10 }}
                      >
                        {latestModerationEvents(record.moderation.history).map((event) => (
                          <div
                            key={`${event.status}-${event.createdAt}-${event.authorLabel}`}
                            className="builder-dashboard-page-meta"
                          >
                            <span>{event.status}</span>
                            <span>{formatDateTime(event.createdAt)} by {event.authorLabel}</span>
                            {event.reason ? <span>Reason: {event.reason}</span> : null}
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {recordGridDensity === 'comfortable' && record.revisions?.length ? (
                      <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
                        {latestRevisions(record.revisions).map((revision) => (
                          <div
                            key={revision.revisionId}
                            style={{ borderTop: '1px solid #e2e8f0', display: 'grid', gap: 8, paddingTop: 10 }}
                          >
                            <div className="builder-dashboard-page-head">
                              <div>
                                <strong>{revision.name}</strong>
                                <span>{formatDateTime(revision.createdAt)} by {revision.authorLabel}</span>
                              </div>
                              <span className="builder-stage-pill">{revision.status}</span>
                            </div>
                            {(() => {
                              const diffItems = revisionDiffItems(revision, detail.fields);
                              return diffItems.length ? (
                                <div className="builder-dashboard-page-meta">
                                  {diffItems.map((item) => (
                                    <span key={item}>{item}</span>
                                  ))}
                                </div>
                              ) : (
                                <div className="builder-dashboard-page-meta">
                                  {detail.fields.slice(0, 3).map((field) => (
                                    <span key={field.fieldId}>
                                      {field.label}: {formatValue(revision.fields[field.key])}
                                    </span>
                                  ))}
                                </div>
                              );
                            })()}
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
      {referenceFieldKey && referencePickerCollectionId ? (
        <div
          role="dialog"
          aria-label="Record picker"
          data-cms-reference-picker-dialog="true"
          style={inlineModalOverlayStyle}
          onClick={closeReferencePicker}
        >
          <div
            style={inlineModalCardStyle}
            data-cms-reference-picker-card="true"
            onClick={(event) => event.stopPropagation()}
          >
            {(() => {
              const selectedRecordId = String(recordForm[referenceFieldKey] ?? '').trim();
              const selectedRecord = selectedRecordId
                ? referencePickerRecords.find((record) => record.recordId === selectedRecordId)
                : null;
              return selectedRecord ? (
                <div
                  data-cms-reference-picker-selected={selectedRecord.recordId}
                  style={{
                    display: 'grid',
                    gap: 8,
                    padding: 12,
                    borderRadius: 12,
                    background: 'rgba(15, 23, 42, 0.04)',
                    marginBottom: 12,
                  }}
                >
                  <strong>Selected record</strong>
                  <span style={helperTextStyle}>
                    {selectedRecord.fields.title ? String(selectedRecord.fields.title) : selectedRecord.recordId}
                  </span>
                  <span style={helperTextStyle}>
                    {selectedRecord.recordId} · {selectedRecord.status}
                  </span>
                  <button
                    type="button"
                    className="builder-action-btn builder-action-btn--ghost"
                    data-cms-reference-picker-clear-record
                    onClick={clearReferenceSelection}
                  >
                    Clear selection
                  </button>
                </div>
              ) : null;
            })()}
            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'grid', gap: 4 }}>
                <strong>Pick record</strong>
                <span style={helperTextStyle}>
                  {referencePickerCollectionName || referencePickerCollectionId}
                </span>
              </div>
              <button type="button" className="builder-action-btn" onClick={closeReferencePicker}>
                Close
              </button>
            </div>
            <input
              aria-label="Search records"
              type="search"
              value={referencePickerQuery}
              style={inputStyle}
              placeholder="Filter by record ID, title, or value"
              onChange={(event) => setReferencePickerQuery(event.target.value)}
              onKeyDown={handleReferencePickerSearchKeyDown}
            />
            <span style={helperTextStyle} data-cms-reference-picker-count>
              Showing {referencePickerFilteredRecords.length} of {referencePickerRecords.length} records
            </span>
            {referencePickerLoading ? <span style={helperTextStyle}>Loading records…</span> : null}
            {referencePickerError ? <span role="alert" style={warningTextStyle}>{referencePickerError}</span> : null}
            {!referencePickerLoading && !referencePickerError ? (
              <div style={{ display: 'grid', gap: 8 }}>
                {referencePickerFilteredRecords
                  .slice(0, 24)
                  .map((record) => (
                    <div
                      key={record.recordId}
                      data-cms-reference-picker-row={record.recordId}
                      data-cms-reference-picker-row-active={record.recordId === referencePickerActiveRecordId ? 'true' : undefined}
                      style={{
                        display: 'grid',
                        gap: 8,
                        padding: 12,
                        outline: record.recordId === referencePickerActiveRecordId ? '2px solid #2563eb' : '1px solid rgba(148, 163, 184, 0.18)',
                        borderRadius: 12,
                        background: 'rgba(255, 255, 255, 0.72)',
                      }}
                    >
                      <span style={{ display: 'grid', textAlign: 'left', gap: 2 }}>
                        <strong>{record.fields.title ? String(record.fields.title) : record.recordId}</strong>
                        <span style={helperTextStyle}>{record.recordId} · {record.status}</span>
                        <span style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {referencePickerCollectionDetail ? (
                            <Link
                              href={buildRecordRoutePreviewPath(
                                referencePickerCollectionDetail,
                                locale,
                                formatValue(record.fields[referencePickerCollectionDetail.fields.find((field) => field.type === 'slug')?.key ?? '']),
                                record.locale ?? undefined,
                              ) || '#'}
                              className="builder-link-inline"
                              data-cms-reference-picker-live-route={record.recordId}
                              onClick={(event) => event.stopPropagation()}
                            >
                              Open live route
                            </Link>
                          ) : null}
                          <Link
                            href={buildBuilderCmsRecordHref(locale, referencePickerCollectionId, record.recordId)}
                            className="builder-link-inline"
                            data-cms-reference-picker-record-link={record.recordId}
                            onClick={(event) => event.stopPropagation()}
                          >
                            Open record link
                          </Link>
                        </span>
                      </span>
                      <button
                        type="button"
                        className="builder-action-btn"
                        data-cms-reference-picker-use-record={record.recordId}
                        onClick={() => pickReferenceRecord(record.recordId)}
                      >
                        Use record
                      </button>
                    </div>
                  ))}
                {referencePickerRecords.length === 0 ? (
                  <span style={helperTextStyle}>No records available in this collection.</span>
                ) : referencePickerFilteredRecords.length === 0 ? (
                  <span style={helperTextStyle}>No matching records found.</span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

function CmsFieldInput({
  field,
  value,
  collectionSlug,
  duplicateRecordId,
  dynamicItemUrlBases,
  locale,
  disabled,
  onChange,
  onRequestAssetLibrary,
  onRequestRecordPicker,
}: {
  field: BuilderCmsFieldDefinition;
  value: RecordFormValue | undefined;
  collectionSlug: string;
  duplicateRecordId?: string | null;
  dynamicItemUrlBases?: string[];
  locale: Locale;
  disabled: boolean;
  onChange: (value: RecordFormValue) => void;
  onRequestAssetLibrary?: () => void;
  onRequestRecordPicker?: () => void;
}) {
  if (field.type === 'boolean') {
    return (
      <label style={labelStyle}>
        {field.label}
        {field.helpText ? <span style={{ color: '#64748b', fontWeight: 500 }}>{field.helpText}</span> : null}
        <select
          data-cms-record-field-input={field.key}
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
          data-cms-record-field-input={field.key}
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
          data-cms-record-field-input={field.key}
          type="text"
          style={inputStyle}
          value={typeof value === 'string' ? value : ''}
          disabled={disabled}
          placeholder={field.relationCollectionId ? `Record ID from ${field.relationCollectionId}` : 'Referenced record ID'}
          onChange={(event) => onChange(event.target.value)}
        />
        {onRequestRecordPicker ? (
          <button
            type="button"
            className="builder-action-btn"
            onClick={onRequestRecordPicker}
            disabled={disabled}
          >
            Pick record
          </button>
        ) : null}
      </label>
    );
  }

  if (field.repeated || field.type === 'string-list') {
    return (
      <label style={labelStyle}>
        {field.label}
        {field.helpText ? <span style={{ color: '#64748b', fontWeight: 500 }}>{field.helpText}</span> : null}
        <textarea
          data-cms-record-field-input={field.key}
          style={{ ...inputStyle, minHeight: 82, resize: 'vertical' }}
          value={typeof value === 'string' ? value : ''}
          disabled={disabled}
                  placeholder="한 줄에 한 값"
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
          data-cms-record-field-input={field.key}
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
        data-cms-record-field-input={field.key}
        type={inputType}
        style={inputStyle}
        value={typeof value === 'string' ? value : ''}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
      {field.type === 'slug' ? (
        <CmsSlugFieldHelper
          collectionSlug={collectionSlug}
          duplicateRecordId={duplicateRecordId}
          dynamicItemUrlBases={dynamicItemUrlBases ?? []}
          field={field}
          locale={locale}
          value={value}
        />
      ) : null}
    </label>
  );
}

function SourceCollectionLifecycleCard({
  collection,
  locale,
}: {
  collection: BuilderCollectionSummary;
  locale: Locale;
}) {
  const slugField = collection.fields.find((field) => field.type === 'slug');
  const itemRoute = collection.routeBindings.find((binding) => binding.kind === 'item');
  const status = getSourceCollectionStatus(collection.id);
  const routePreview = itemRoute?.pathPattern.replace('[slug]', `{${slugField?.key ?? 'slug'}}`)
    ?? `/${locale}/${collection.id}/{${slugField?.key ?? 'slug'}}`;

  return (
    <div
      data-cms-source-lifecycle={collection.id}
      data-cms-source-lifecycle-status={status.kind}
      style={sourceLifecycleCardStyle}
    >
      <div style={sourceLifecycleHeaderStyle}>
        <span style={helperTextStyle}>
          Record URL: <strong>{routePreview}</strong>
        </span>
        <span style={status.kind === 'read-only' ? sourceLifecyclePendingStyle : sourceLifecycleStatusStyle}>
          {status.label}
        </span>
      </div>
      <span style={helperTextStyle}>
        Slug field: <strong>{slugField?.key ?? 'none'}</strong>. {status.body}
      </span>
      {status.href ? (
        <a
          className="builder-action-btn"
          href={`/${locale}/admin-builder${status.href}`}
          style={{ justifySelf: 'start', textDecoration: 'none' }}
        >
          {status.actionLabel}
        </a>
      ) : null}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
        <a
          className="builder-action-btn"
          href={buildBuilderCollectionHref(locale, collection.id)}
          data-cms-source-inventory-link={collection.id}
          style={{ textDecoration: 'none' }}
        >
          Open source inventory
        </a>
      </div>
    </div>
  );
}

function SourceCollectionOverview({
  collection,
  locale,
  siteId,
}: {
  collection: BuilderCollectionSummary;
  locale: Locale;
  siteId: string;
}) {
  const status = getSourceCollectionStatus(collection.id);
  const fieldPreview = collection.fields.slice(0, 7);

  return (
    <div style={sourceOverviewGridStyle} data-cms-source-overview={collection.id}>
      <div style={sourceOverviewPanelStyle}>
        <strong style={helperTextStyle}>Editable surface</strong>
        <span style={helperTextStyle} data-cms-source-surface={collection.id}>{status.surface}</span>
      </div>
      <div style={sourceOverviewPanelStyle}>
        <strong style={helperTextStyle}>Key fields</strong>
        <div style={sourceChipListStyle} data-cms-source-fields={collection.id}>
          {fieldPreview.map((field) => (
            <span key={field.key} style={sourceChipStyle}>{field.key}</span>
          ))}
          {collection.fields.length > fieldPreview.length ? (
            <span style={sourceChipStyle}>+{collection.fields.length - fieldPreview.length}</span>
          ) : null}
        </div>
      </div>
      <div style={sourceOverviewPanelStyle}>
        <strong style={helperTextStyle}>Routes</strong>
        <div style={sourceChipListStyle} data-cms-source-routes={collection.id}>
          {collection.routeBindings.map((binding) => (
            <span key={`${binding.kind}-${binding.pathPattern}`} style={sourceChipStyle}>
              {binding.kind}: {binding.pathPattern}
            </span>
          ))}
        </div>
      </div>
      <div style={sourceOverviewPanelStyle}>
        <strong style={helperTextStyle}>Bindable targets</strong>
        <div style={sourceChipListStyle} data-cms-source-bindable-targets={collection.id}>
          {collection.bindableTargets.length > 0 ? (
            collection.bindableTargets.map((target) => (
              <Link
                key={target.targetId}
                href={buildBuilderPageDatasetHref(locale, target.pageKey, { targetId: target.targetId })}
                data-cms-source-target-chip-link={target.targetId}
                style={{
                  ...sourceChipStyle,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {target.title} · {target.pageKey}/{target.sectionKey}
              </Link>
            ))
          ) : (
            <span style={helperTextStyle}>No live dataset targets.</span>
          )}
        </div>
        {collection.bindableTargets.length > 0 ? (
          <div style={{ display: 'grid', gap: 8 }}>
            <Link
              href={buildBuilderPageDatasetHref(locale, collection.bindableTargets[0].pageKey, {
                targetId: collection.bindableTargets[0].targetId,
              })}
              className="builder-action-btn builder-action-btn--primary"
              data-cms-source-target-primary-link={collection.bindableTargets[0].targetId}
              style={{ justifySelf: 'start', textDecoration: 'none' }}
            >
              Open {collection.bindableTargets[0].title}
            </Link>
            <div data-cms-source-target-seed={collection.bindableTargets[0].targetId}>
              <BuilderDatasetSeedAction
                locale={locale}
                siteId={siteId}
                pageKey={collection.bindableTargets[0].pageKey}
                targetId={collection.bindableTargets[0].targetId}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SourceCollectionRecordPreviewTable({
  collection,
  locale,
  onCopyRoute,
  onSourceRecordSaved,
}: {
  collection: BuilderSourceCollectionDetail;
  locale: Locale;
  onCopyRoute: (route: string) => void;
  onSourceRecordSaved: () => Promise<void>;
}) {
  const previewRecords = collection.sampleRecords.slice(0, 3);
  const remainingCount = Math.max(0, collection.sampleRecords.length - previewRecords.length);

  return (
    <div style={sourceRecordPreviewStyle} data-cms-source-record-preview={collection.id}>
      <div style={sourceLifecycleHeaderStyle}>
        <strong style={helperTextStyle}>Record preview</strong>
        <span style={helperTextStyle}>
          {collection.sampleRecords.length} sampled
        </span>
      </div>
      {previewRecords.length > 0 ? previewRecords.map((record) => (
        <SourceCollectionRecordPreviewRow
          key={record.recordId}
          collectionId={collection.id}
          locale={locale}
          onCopyRoute={onCopyRoute}
          onSourceRecordSaved={onSourceRecordSaved}
          record={record}
        />
      )) : (
        <span style={helperTextStyle}>No source records available.</span>
      )}
      {remainingCount > 0 ? (
        <span style={helperTextStyle}>+{remainingCount} more sample records available in the source collection.</span>
      ) : null}
    </div>
  );
}

function SourceCollectionRecordPreviewRow({
  collectionId,
  locale,
  onCopyRoute,
  onSourceRecordSaved,
  record,
}: {
  collectionId: BuilderSourceCollectionDetail['id'];
  locale: Locale;
  onCopyRoute: (route: string) => void;
  onSourceRecordSaved: () => Promise<void>;
  record: BuilderCollectionRecordPreview;
}) {
  return (
    <div style={sourceRecordRowStyle} data-cms-source-record-row={record.recordId}>
      <div style={sourceRecordCellStyle}>
        <strong style={{ ...helperTextStyle, color: '#0f172a' }}>{record.primaryLabel}</strong>
        <span style={helperTextStyle}>{record.secondaryLabel}</span>
        <Link
          href={record.routePath}
          data-cms-source-record-route-link={record.recordId}
          className="builder-link-inline"
          style={{ marginTop: 6 }}
        >
          Open route
        </Link>
        <button
          type="button"
          className="builder-link-inline"
          data-cms-source-record-route-copy={record.recordId}
          onClick={() => onCopyRoute(record.routePath)}
        >
          Copy route
        </button>
        <Link
          href={buildBuilderCollectionHref(locale, collectionId)}
          data-cms-source-record-inventory-link={record.recordId}
          className="builder-link-inline"
          style={{ marginTop: 6 }}
        >
          Open source inventory
        </Link>
        <SourceRecordInlineEditor
          collectionId={collectionId}
          locale={locale}
          onSaved={onSourceRecordSaved}
          record={record}
        />
      </div>
      <div style={sourceRecordCellStyle}>
        <strong style={helperTextStyle}>Route</strong>
        <span style={sourceRecordRouteStyle} data-cms-source-record-route={record.recordId}>
          {record.routePath}
        </span>
      </div>
      <div style={sourceRecordCellStyle} data-cms-source-record-seo={record.recordId}>
        <strong style={helperTextStyle}>SEO</strong>
        <span style={helperTextStyle}>{record.seo.title}</span>
        <span style={helperTextStyle}>
          {record.seo.noIndex ? 'Noindex' : 'Indexable'} · {record.seo.keywords.slice(0, 2).join(', ')}
        </span>
      </div>
    </div>
  );
}

function EditableRecordGridSummary({
  detail,
  filterCount,
  matchingCount,
  page,
  pageCount,
  density,
  previewFieldCount,
  selectedCount,
  viewChips,
  viewResettable,
  onResetView,
  onDensityChange,
  onPreviewFieldCountChange,
  visibleCount,
}: {
  detail: BuilderCmsCollectionDetail;
  filterCount: number;
  matchingCount: number;
  page: number;
  pageCount: number;
  density: RecordGridDensity;
  previewFieldCount: RecordGridPreviewFieldCount;
  selectedCount: number;
  viewChips: string[];
  viewResettable: boolean;
  onResetView: () => void;
  onDensityChange: (density: RecordGridDensity) => void;
  onPreviewFieldCountChange: (count: RecordGridPreviewFieldCount) => void;
  visibleCount: number;
}) {
  const statusCounts = countRecordsByStatus(detail.records);

  return (
    <div style={editableRecordSummaryStyle} data-cms-record-grid-summary>
      <div style={sourceLifecycleHeaderStyle}>
        <strong style={helperTextStyle}>Record grid</strong>
        <span style={helperTextStyle}>
          {visibleCount} visible · {matchingCount} matching · page {page}/{pageCount}
        </span>
      </div>
      <div style={editableRecordMetricGridStyle}>
        <div style={editableRecordMetricStyle}>
          <strong>{detail.records.length}</strong>
          <span style={helperTextStyle}>Total records</span>
        </div>
        <div style={editableRecordMetricStyle} data-cms-record-grid-selected>
          <strong>{selectedCount}</strong>
          <span style={helperTextStyle}>Selected</span>
        </div>
        <div style={editableRecordMetricStyle}>
          <strong>{filterCount}</strong>
          <span style={helperTextStyle}>Active filters</span>
        </div>
        <div style={editableRecordMetricStyle}>
          <strong>{detail.fields.length}</strong>
          <span style={helperTextStyle}>Fields</span>
        </div>
      </div>
      <div style={sourceLifecycleHeaderStyle} data-cms-record-grid-current-view>
        <strong style={helperTextStyle}>Current view</strong>
        <div className="builder-dashboard-page-actions">
          <button
            type="button"
            className={`builder-action-btn${density === 'compact' ? ' builder-action-btn--primary' : ''}`}
            onClick={() => onDensityChange('compact')}
          >
            {recordGridDensityLabels.compact}
          </button>
          <button
            type="button"
            className={`builder-action-btn${density === 'comfortable' ? ' builder-action-btn--primary' : ''}`}
            onClick={() => onDensityChange('comfortable')}
          >
            {recordGridDensityLabels.comfortable}
          </button>
          {([2, 4, 6] as RecordGridPreviewFieldCount[]).map((count) => (
            <button
              key={count}
              type="button"
              className={`builder-action-btn${previewFieldCount === count ? ' builder-action-btn--primary' : ''}`}
              onClick={() => onPreviewFieldCountChange(count)}
              disabled={density !== 'compact'}
              title={density === 'compact' ? undefined : 'Preview field count only applies to compact rows'}
            >
              {recordGridPreviewFieldCountLabels[count]}
            </button>
          ))}
          {viewResettable ? (
            <button
              type="button"
              className="builder-action-btn"
              onClick={onResetView}
            >
              Reset view
            </button>
          ) : null}
        </div>
      </div>
      <div style={sourceChipListStyle}>
        {viewChips.length > 0 ? viewChips.map((chip, index) => (
          <span key={`${chip}-${index}`} style={sourceChipStyle}>{chip}</span>
        )) : (
          <span style={sourceChipStyle}>Default view</span>
        )}
      </div>
      <div style={sourceChipListStyle} data-cms-record-grid-status-counts>
        {builderCmsRecordStatuses.map((status) => (
          <span key={status} style={sourceChipStyle}>{status}: {statusCounts[status]}</span>
        ))}
      </div>
    </div>
  );
}

function EditableRecordRoutePreview({
  detail,
  locale,
  onCopyRoute,
  record,
}: {
  detail: BuilderCmsCollectionDetail;
  locale: Locale;
  onCopyRoute: (route: string) => void;
  record: BuilderCmsRecord;
}) {
  const slugField = detail.fields.find((field) => field.type === 'slug');
  if (!slugField) return null;

  const routePreview = buildRecordRoutePreviewPath(
    detail,
    locale,
    formatValue(record.fields[slugField.key]),
    record.locale ?? undefined,
  );

  return (
    <span style={editableRecordRouteStyle} data-cms-record-route-preview={record.recordId}>
      URL preview: {routePreview}{' '}
      <Link href={routePreview} data-cms-record-live-route-link={record.recordId} className="builder-link-inline">
        Open live route
      </Link>
      {' '}
      <button
        type="button"
        className="builder-link-inline"
        data-cms-record-live-route-copy={record.recordId}
        onClick={() => onCopyRoute(routePreview)}
      >
        Copy route
      </button>
    </span>
  );
}

function buildRecordRoutePreviewPath(
  detail: BuilderCmsCollectionDetail,
  locale: Locale,
  slugValue: string,
  recordLocale?: string,
): string {
  const slugField = detail.fields.find((field) => field.type === 'slug');
  if (!slugField) return '';

  const previewSlug = slugValue === '-' ? `{${slugField.key}}` : slugValue;
  return `/${recordLocale ?? locale}/${detail.slug || detail.collectionId}/${previewSlug}`;
}

function buildEditingRecordLiveRoute(
  detail: BuilderCmsCollectionDetail,
  locale: Locale,
  recordForm: RecordFormState,
): string | null {
  const slugField = detail.fields.find((field) => field.type === 'slug');
  if (!slugField) return null;
  return buildRecordRoutePreviewPath(detail, locale, formatValue(recordForm[slugField.key]));
}

function buildRecordSaveMessage(baseMessage: string, result: { redirectCreated?: boolean; redirectWarnings?: string[] }) {
  const redirectParts: string[] = [];
  if (result.redirectCreated) {
    redirectParts.push('301 redirect created.');
  }
  if (result.redirectWarnings?.length) {
    redirectParts.push(result.redirectWarnings[0]);
  }
  return redirectParts.length > 0 ? `${baseMessage} ${redirectParts.join(' ')}` : baseMessage;
}

function EditableRecordGridHeader({ detail }: { detail: BuilderCmsCollectionDetail }) {
  const previewFields = detail.fields.slice(0, 6);
  const remainingFields = Math.max(0, detail.fields.length - previewFields.length);

  return (
    <div style={editableRecordGridHeaderStyle} data-cms-record-grid-columns>
      <div style={sourceLifecycleHeaderStyle}>
        <strong style={helperTextStyle}>Columns</strong>
        <span style={helperTextStyle}>{detail.fields.length} total fields</span>
      </div>
      <div style={editableRecordGridHeaderChipRowStyle}>
        {previewFields.map((field) => (
          <span key={field.fieldId} style={sourceChipStyle}>
            {field.label} · {field.type}
          </span>
        ))}
        {remainingFields > 0 ? (
          <span style={sourceChipStyle}>+{remainingFields} more</span>
        ) : null}
      </div>
      <span style={helperTextStyle}>
        The record cards below repeat these columns in the same order, so the list reads like a compact spreadsheet.
      </span>
    </div>
  );
}

function EditableRecordSpreadsheetRow({
  detail,
  previewFieldCount,
  record,
}: {
  detail: BuilderCmsCollectionDetail;
  previewFieldCount: RecordGridPreviewFieldCount;
  record: BuilderCmsRecord;
}) {
  const moderationReason = record.moderation?.reason?.trim();
  const updatedAtLabel = formatDateTime(record.updatedAt);
  const previewFields = detail.fields.slice(0, previewFieldCount);

  return (
    <div style={editableRecordRowSummaryStyle} data-cms-record-grid-row-summary={record.recordId}>
      <div style={editableRecordRowSummaryGridStyle}>
        <div style={editableRecordRowSummaryCellStyle}>
          <strong style={helperTextStyle}>Record</strong>
          <span style={editableRecordRowSummaryValueStyle}>{record.recordId}</span>
        </div>
        <div style={editableRecordRowSummaryCellStyle}>
          <strong style={helperTextStyle}>Status</strong>
          <span style={editableRecordRowSummaryValueStyle}>{record.status}</span>
        </div>
        <div style={editableRecordRowSummaryCellStyle}>
          <strong style={helperTextStyle}>Locale</strong>
          <span style={editableRecordRowSummaryValueStyle}>{record.locale ?? 'default'}</span>
        </div>
        <div style={editableRecordRowSummaryCellStyle}>
          <strong style={helperTextStyle}>Revisions</strong>
          <span style={editableRecordRowSummaryValueStyle}>{record.revisions?.length ?? 0}</span>
        </div>
        <div style={editableRecordRowSummaryCellStyle}>
          <strong style={helperTextStyle}>Updated</strong>
          <span style={editableRecordRowSummaryValueStyle}>{updatedAtLabel}</span>
        </div>
      </div>
      <div style={editableRecordCompactFieldsGridStyle}>
        {previewFields.map((field) => (
          <div key={field.fieldId} style={editableRecordCompactFieldCellStyle}>
            <strong style={helperTextStyle}>{field.label}</strong>
            <span style={editableRecordCompactFieldValueStyle}>{formatValue(record.fields[field.key])}</span>
          </div>
        ))}
        {record.moderation?.history?.length ? (
          <div style={editableRecordCompactFieldCellStyle}>
            <strong style={helperTextStyle}>Moderation events</strong>
            <span style={editableRecordCompactFieldValueStyle}>{record.moderation.history.length}</span>
          </div>
        ) : null}
        {moderationReason ? (
          <div style={editableRecordCompactFieldCellStyle} data-cms-moderation-latest-reason={record.recordId}>
            <strong style={helperTextStyle}>Moderation reason</strong>
            <span style={editableRecordCompactFieldValueStyle}>{moderationReason}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function EditableRecordFieldGrid({
  busy,
  detail,
  locale,
  onEditField,
  onSaveField,
  onToast,
  inlineNavigationFocusRef,
  record,
  recordIndex,
}: {
  busy: boolean;
  detail: BuilderCmsCollectionDetail;
  locale: Locale;
  inlineNavigationFocusRef: React.MutableRefObject<{
    fromFieldKey: string;
    fromRecordId: string;
    toFieldKey: string;
    toRecordId: string;
  } | null>;
  onEditField: (fieldKey: string) => void;
  onSaveField: (field: BuilderCmsFieldDefinition, value: RecordFormValue) => Promise<void>;
  onToast?: (message: string, tone: 'success' | 'error') => void;
  record: BuilderCmsRecord;
  recordIndex: number;
}) {
  const fields = detail.fields.slice(0, 6);
  const [inlineFieldKey, setInlineFieldKey] = useState<string | null>(null);
  const [inlineDraftValue, setInlineDraftValue] = useState<RecordFormValue>('');
  const [inlineSavingFieldKey, setInlineSavingFieldKey] = useState<string | null>(null);
  const [inlineAssetFieldKey, setInlineAssetFieldKey] = useState<string | null>(null);
  const inlineRichTextTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  if (fields.length === 0) return null;

  function handleInlineRichTextFormat(tag: InlineRichTextTag) {
    const selection = inlineRichTextTextareaRef.current
      ? {
          start: inlineRichTextTextareaRef.current.selectionStart,
          end: inlineRichTextTextareaRef.current.selectionEnd,
        }
      : null;
    setInlineDraftValue((current) => formatInlineRichTextDraft(
      typeof current === 'string' ? current : String(current ?? ''),
      tag,
      selection,
    ));
  }

  function handleInlineRichTextHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
    const textarea = inlineRichTextTextareaRef.current;
    if (!textarea) return;
    const selection = {
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
    };
    setInlineDraftValue((current) => formatInlineRichTextHeadingDraft(
      typeof current === 'string' ? current : String(current ?? ''),
      level,
      selection,
    ));
  }

  function handleInlineRichTextLink() {
    const textarea = inlineRichTextTextareaRef.current;
    if (!textarea) return;
    const selection = {
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
    };
    const existingLink = findInlineRichTextLinkSelection(
      typeof inlineDraftValue === 'string' ? inlineDraftValue : String(inlineDraftValue ?? ''),
      selection,
    );
    const href = window.prompt('Link URL', existingLink?.href ?? 'https://')?.trim();
    if (!href) return;
    setInlineDraftValue((current) => formatInlineRichTextLinkDraft(
      typeof current === 'string' ? current : String(current ?? ''),
      href,
      selection,
    ));
  }

  function handleInlineRichTextBlockquote() {
    const textarea = inlineRichTextTextareaRef.current;
    if (!textarea) return;
    const selection = {
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
    };
    setInlineDraftValue((current) => formatInlineRichTextBlockquoteDraft(
      typeof current === 'string' ? current : String(current ?? ''),
      selection,
    ));
  }

  function handleInlineRichTextList(listTag: InlineRichTextListTag) {
    const textarea = inlineRichTextTextareaRef.current;
    if (!textarea) return;
    const selection = {
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
    };
    setInlineDraftValue((current) => formatInlineRichTextListDraft(
      typeof current === 'string' ? current : String(current ?? ''),
      listTag,
      selection,
    ));
  }

  function handleInlineRichTextClear() {
    const textarea = inlineRichTextTextareaRef.current;
    if (!textarea) return;
    const selection = {
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
    };
    setInlineDraftValue((current) => formatInlineRichTextClearDraft(
      typeof current === 'string' ? current : String(current ?? ''),
      selection,
    ));
  }

  function handleInlineImageAssetSelect(asset: BuilderAssetListItem) {
    setInlineDraftValue(imageValueFromAsset(asset));
    setInlineAssetFieldKey(null);
    onToast?.('Image selected from Asset Library.', 'success');
  }

  function closeInlineRecordFieldEditor() {
    setInlineFieldKey(null);
    setInlineAssetFieldKey(null);
  }

  async function commitInlineRecordField(
    field: BuilderCmsFieldDefinition,
    value: RecordFormValue,
    options?: { focusFieldKey?: string | null; focusRecordId?: string | null },
  ) {
    const inlineValidationMessage = getInlineRecordFieldValidationMessage(field, value, detail, record.recordId);
    if (inlineValidationMessage) return;
    setInlineSavingFieldKey(field.key);
    try {
      if (options?.focusFieldKey) {
        closeInlineRecordFieldEditor();
      }
      await onSaveField(field, value);
      if (!options?.focusFieldKey) {
        closeInlineRecordFieldEditor();
      }
      if (options?.focusFieldKey) {
        window.setTimeout(() => {
          const focusRecordId = options.focusRecordId ?? record.recordId;
          if (focusRecordId === record.recordId) {
            const targetField = fields.find((candidate) => candidate.key === options.focusFieldKey);
            if (targetField && supportsInlineRecordFieldEdit(targetField)) {
              setInlineAssetFieldKey(null);
              setInlineFieldKey(targetField.key);
              setInlineDraftValue(inlineRecordFieldDraftValue(targetField, record.fields[targetField.key]));
              return;
            }
            const sameRecordGrid = document.querySelector<HTMLElement>(
              `[data-cms-record-field-grid="${record.recordId}"]`,
            );
            const sameRecordButton = sameRecordGrid
              ? Array.from(sameRecordGrid.querySelectorAll<HTMLButtonElement>('[data-cms-record-field-edit]'))
                .find((button) => button.dataset.cmsRecordFieldEdit?.endsWith(`:${options.focusFieldKey}`))
              : null;
            sameRecordButton?.focus();
            return;
          }
          const focusRecordGrid = document.querySelector<HTMLElement>(
            `[data-cms-record-field-grid="${focusRecordId}"]`,
          );
          if (!focusRecordGrid) return;
          const nextInlineButton = Array.from(
            focusRecordGrid.querySelectorAll<HTMLButtonElement>('[data-cms-record-field-inline-edit]'),
          ).find((button) => button.dataset.cmsRecordFieldInlineEdit?.endsWith(`:${options.focusFieldKey}`));
          if (nextInlineButton) {
            nextInlineButton.click();
            return;
          }
          const nextButton = Array.from(
            focusRecordGrid.querySelectorAll<HTMLButtonElement>('[data-cms-record-field-edit]'),
          ).find((button) => button.dataset.cmsRecordFieldEdit?.endsWith(`:${options.focusFieldKey}`));
          nextButton?.focus();
        }, 0);
      }
    } finally {
      setInlineSavingFieldKey(null);
    }
  }

  function handleInlineRecordFieldKeyDown(
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: BuilderCmsFieldDefinition,
    fieldIndex: number,
  ) {
    if (field.type === 'rich-text' && (event.metaKey || event.ctrlKey)) {
      const shortcut = event.key.toLowerCase();
      if (shortcut === 'b') {
        event.preventDefault();
        handleInlineRichTextFormat('strong');
        return;
      }
      if (shortcut === 'i') {
        event.preventDefault();
        handleInlineRichTextFormat('em');
        return;
      }
      if (shortcut === '1') {
        event.preventDefault();
        handleInlineRichTextHeading(1);
        return;
      }
      if (shortcut === '2') {
        event.preventDefault();
        handleInlineRichTextHeading(2);
        return;
      }
      if (shortcut === '3') {
        event.preventDefault();
        handleInlineRichTextHeading(3);
        return;
      }
      if (shortcut === '4') {
        event.preventDefault();
        handleInlineRichTextHeading(4);
        return;
      }
      if (shortcut === '5') {
        event.preventDefault();
        handleInlineRichTextHeading(5);
        return;
      }
      if (shortcut === '6') {
        event.preventDefault();
        handleInlineRichTextHeading(6);
        return;
      }
      if (shortcut === 'u') {
        event.preventDefault();
        handleInlineRichTextFormat('u');
        return;
      }
      if (shortcut === 'k') {
        event.preventDefault();
        handleInlineRichTextLink();
        return;
      }
      if (event.shiftKey && (shortcut === '7' || shortcut === '&')) {
        event.preventDefault();
        handleInlineRichTextList('orderedList');
        return;
      }
      if (event.shiftKey && (shortcut === '8' || shortcut === '*')) {
        event.preventDefault();
        handleInlineRichTextList('bulletList');
        return;
      }
      if (shortcut === '`') {
        event.preventDefault();
        handleInlineRichTextFormat('code');
        return;
      }
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      closeInlineRecordFieldEditor();
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      const nextFieldIndex = event.shiftKey ? fieldIndex - 1 : fieldIndex + 1;
      const nextFieldKey = fields[nextFieldIndex]?.key ?? null;
      if (nextFieldKey) {
        void commitInlineRecordField(field, inlineDraftValue, { focusFieldKey: nextFieldKey, focusRecordId: record.recordId });
        return;
      }
      if (event.shiftKey) {
        const navigationSource = inlineNavigationFocusRef.current;
        if (
          navigationSource
          && navigationSource.toRecordId === record.recordId
          && navigationSource.toFieldKey === field.key
        ) {
          void commitInlineRecordField(field, inlineDraftValue, {
            focusFieldKey: navigationSource.fromFieldKey,
            focusRecordId: navigationSource.fromRecordId,
          });
          return;
        }
      }
      const nextRecordIndex = event.shiftKey ? recordIndex - 1 : recordIndex + 1;
      const nextRecordFieldKey = event.shiftKey
        ? fields[fields.length - 1]?.key ?? null
        : fields[0]?.key ?? null;
      if (!event.shiftKey) {
        inlineNavigationFocusRef.current = {
          fromFieldKey: field.key,
          fromRecordId: record.recordId,
          toFieldKey: nextRecordFieldKey ?? '',
          toRecordId: nextRecordIndex >= 0 && nextRecordIndex < detail.records.length
            ? detail.records[nextRecordIndex]?.recordId ?? ''
            : '',
        };
      }
      void commitInlineRecordField(field, inlineDraftValue, {
        focusFieldKey: nextRecordFieldKey,
        focusRecordId: nextRecordIndex >= 0 && nextRecordIndex < detail.records.length
          ? detail.records[nextRecordIndex]?.recordId ?? null
          : null,
      });
      return;
    }
    if (event.key !== 'Enter') return;
    if (isInlineRecordFieldMultiline(field) && !event.metaKey && !event.ctrlKey) return;
    event.preventDefault();
    void commitInlineRecordField(field, inlineDraftValue);
  }

  function inlineDraftText(field: BuilderCmsFieldDefinition, value: RecordFormValue): string {
    if (field.type === 'image') return imageValueFromForm(value)?.url ?? '';
    return typeof value === 'string' ? value : String(value ?? '');
  }

  function inlineImageDraftValue(value: RecordFormValue): BuilderCmsImageValue {
    return imageValueFromForm(value) ?? {
      url: '',
      altText: '',
      focalPoint: { x: 0.5, y: 0.5 },
    };
  }

  return (
    <div
      style={editableRecordFieldGridStyle}
      data-cms-record-field-grid={record.recordId}
      data-cms-record-field-grid-index={recordIndex}
    >
      {fields.map((field, fieldIndex) => {
        const inlineValidationMessage = inlineFieldKey === field.key
          ? getInlineRecordFieldValidationMessage(field, inlineDraftValue, detail, record.recordId)
          : null;
        const inlineSlugRedirectReview = inlineFieldKey === field.key
          ? getInlineSlugRedirectReview(detail, record, field, inlineDraftText(field, inlineDraftValue))
          : null;
        const inlineImageValue = field.type === 'image'
          ? inlineImageDraftValue(inlineDraftValue)
          : null;
        return (
          <div key={field.fieldId} style={editableRecordFieldCellStyle} data-cms-record-field-cell={`${record.recordId}:${field.key}`}>
          <div style={sourceLifecycleHeaderStyle}>
            <strong style={helperTextStyle}>{field.label}</strong>
            <span style={helperTextStyle}>{field.type}</span>
          </div>
          <span style={editableRecordFieldValueStyle} data-cms-record-field-value={`${record.recordId}:${field.key}`}>
            {formatValue(record.fields[field.key])}
          </span>
          {inlineFieldKey === field.key ? (
            <div style={inlineRecordFieldEditorStyle} data-cms-record-field-inline-editor={`${record.recordId}:${field.key}`}>
              {field.type === 'image' ? (() => {
                const imageDraftValue = inlineImageValue ?? inlineImageDraftValue('');
                return (
                  <>
                    <input
                      aria-label={`Inline ${field.label}`}
                      data-cms-record-field-inline-input={`${record.recordId}:${field.key}`}
                      type="url"
                      style={inputStyle}
                      value={imageDraftValue.url}
                      aria-invalid={inlineValidationMessage ? 'true' : undefined}
                      disabled={busy || inlineSavingFieldKey === field.key}
                      placeholder="/api/builder/assets/ko/example.webp"
                      onChange={(event) => setInlineDraftValue({
                        ...imageDraftValue,
                        url: event.target.value,
                        assetId: undefined,
                        filename: undefined,
                      })}
                      onKeyDown={(event) => handleInlineRecordFieldKeyDown(event, field, fieldIndex)}
                    />
                    <input
                      type="text"
                      style={inputStyle}
                      value={imageDraftValue.altText ?? ''}
                      placeholder="Alt text"
                      disabled={busy || inlineSavingFieldKey === field.key}
                      onChange={(event) => setInlineDraftValue({
                        ...imageDraftValue,
                        altText: event.target.value,
                      })}
                      onKeyDown={(event) => handleInlineRecordFieldKeyDown(event, field, fieldIndex)}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.01}
                        aria-label={`Inline ${field.label} focal X`}
                        style={inputStyle}
                        value={imageDraftValue.focalPoint?.x ?? 0.5}
                        disabled={busy || inlineSavingFieldKey === field.key}
                        onChange={(event) => setInlineDraftValue({
                          ...imageDraftValue,
                          focalPoint: {
                            x: Number(event.target.value),
                            y: imageDraftValue.focalPoint?.y ?? 0.5,
                          },
                        })}
                        onKeyDown={(event) => handleInlineRecordFieldKeyDown(event, field, fieldIndex)}
                      />
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.01}
                        aria-label={`Inline ${field.label} focal Y`}
                        style={inputStyle}
                        value={imageDraftValue.focalPoint?.y ?? 0.5}
                        disabled={busy || inlineSavingFieldKey === field.key}
                        onChange={(event) => setInlineDraftValue({
                          ...imageDraftValue,
                          focalPoint: {
                            x: imageDraftValue.focalPoint?.x ?? 0.5,
                            y: Number(event.target.value),
                          },
                        })}
                        onKeyDown={(event) => handleInlineRecordFieldKeyDown(event, field, fieldIndex)}
                      />
                    </div>
                    <button
                      type="button"
                      className="builder-action-btn"
                      data-cms-record-field-inline-asset-library={`${record.recordId}:${field.key}`}
                      disabled={busy || inlineSavingFieldKey === field.key}
                      onClick={() => setInlineAssetFieldKey(field.key)}
                    >
                      Asset Library
                    </button>
                  </>
                );
              })() : isInlineRecordFieldMultiline(field) ? (
                <textarea
                  ref={field.type === 'rich-text' ? inlineRichTextTextareaRef : undefined}
                  aria-label={`Inline ${field.label}`}
                  data-cms-record-field-inline-input={`${record.recordId}:${field.key}`}
                  style={{ ...inputStyle, minHeight: 78, resize: 'vertical' }}
                  value={inlineDraftText(field, inlineDraftValue)}
                  aria-invalid={inlineValidationMessage ? 'true' : undefined}
                  disabled={busy || inlineSavingFieldKey === field.key}
          placeholder="한 줄에 한 값"
                  onChange={(event) => setInlineDraftValue(event.target.value)}
                  onKeyDown={(event) => handleInlineRecordFieldKeyDown(event, field, fieldIndex)}
                />
              ) : (
                <input
                  aria-label={`Inline ${field.label}`}
                  data-cms-record-field-inline-input={`${record.recordId}:${field.key}`}
                  type={inlineRecordFieldInputType(field)}
                  style={inputStyle}
                  value={inlineDraftText(field, inlineDraftValue)}
                  aria-invalid={inlineValidationMessage ? 'true' : undefined}
                  disabled={busy || inlineSavingFieldKey === field.key}
                  onChange={(event) => setInlineDraftValue(event.target.value)}
                  onKeyDown={(event) => handleInlineRecordFieldKeyDown(event, field, fieldIndex)}
                />
              )}
              {field.type === 'rich-text' ? (
                <div
                  className="builder-dashboard-page-actions"
                  data-cms-record-field-rich-text-toolbar={`${record.recordId}:${field.key}`}
                >
                  <button
                    type="button"
                    className="builder-action-btn"
                    data-cms-record-field-rich-text-format="h1"
                    disabled={busy || inlineSavingFieldKey === field.key}
                    aria-pressed={isInlineRichTextHeadingActive(inlineDraftValue, 1) ? 'true' : 'false'}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleInlineRichTextHeading(1)}
                  >
                    H1
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    data-cms-record-field-rich-text-format="h2"
                    disabled={busy || inlineSavingFieldKey === field.key}
                    aria-pressed={isInlineRichTextHeadingActive(inlineDraftValue, 2) ? 'true' : 'false'}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleInlineRichTextHeading(2)}
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    data-cms-record-field-rich-text-format="h3"
                    disabled={busy || inlineSavingFieldKey === field.key}
                    aria-pressed={isInlineRichTextHeadingActive(inlineDraftValue, 3) ? 'true' : 'false'}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleInlineRichTextHeading(3)}
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    data-cms-record-field-rich-text-format="h4"
                    disabled={busy || inlineSavingFieldKey === field.key}
                    aria-pressed={isInlineRichTextHeadingActive(inlineDraftValue, 4) ? 'true' : 'false'}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleInlineRichTextHeading(4)}
                  >
                    H4
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    data-cms-record-field-rich-text-format="h5"
                    disabled={busy || inlineSavingFieldKey === field.key}
                    aria-pressed={isInlineRichTextHeadingActive(inlineDraftValue, 5) ? 'true' : 'false'}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleInlineRichTextHeading(5)}
                  >
                    H5
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    data-cms-record-field-rich-text-format="h6"
                    disabled={busy || inlineSavingFieldKey === field.key}
                    aria-pressed={isInlineRichTextHeadingActive(inlineDraftValue, 6) ? 'true' : 'false'}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleInlineRichTextHeading(6)}
                  >
                    H6
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    data-cms-record-field-rich-text-format="strong"
                    disabled={busy || inlineSavingFieldKey === field.key}
                    aria-pressed={isInlineRichTextFormatActive(inlineDraftValue, 'strong') ? 'true' : 'false'}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleInlineRichTextFormat('strong')}
                  >
                    B
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    data-cms-record-field-rich-text-format="em"
                    disabled={busy || inlineSavingFieldKey === field.key}
                    aria-pressed={isInlineRichTextFormatActive(inlineDraftValue, 'em') ? 'true' : 'false'}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleInlineRichTextFormat('em')}
                  >
                    I
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    data-cms-record-field-rich-text-format="u"
                    disabled={busy || inlineSavingFieldKey === field.key}
                    aria-pressed={isInlineRichTextFormatActive(inlineDraftValue, 'u') ? 'true' : 'false'}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleInlineRichTextFormat('u')}
                  >
                    U
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    data-cms-record-field-rich-text-format="s"
                    disabled={busy || inlineSavingFieldKey === field.key}
                    aria-pressed={isInlineRichTextFormatActive(inlineDraftValue, 's') ? 'true' : 'false'}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleInlineRichTextFormat('s')}
                  >
                    S
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    data-cms-record-field-rich-text-format="link"
                    disabled={busy || inlineSavingFieldKey === field.key}
                    aria-pressed={isInlineRichTextFormatActive(inlineDraftValue, 'link') ? 'true' : 'false'}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleInlineRichTextLink()}
                  >
                    Link
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    data-cms-record-field-rich-text-format="code"
                    disabled={busy || inlineSavingFieldKey === field.key}
                    aria-pressed={isInlineRichTextFormatActive(inlineDraftValue, 'code') ? 'true' : 'false'}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleInlineRichTextFormat('code')}
                  >
                    Code
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    data-cms-record-field-rich-text-format="bullet-list"
                    disabled={busy || inlineSavingFieldKey === field.key}
                    aria-pressed={isInlineRichTextListActive(inlineDraftValue, 'bulletList') ? 'true' : 'false'}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleInlineRichTextList('bulletList')}
                  >
                    -
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    data-cms-record-field-rich-text-format="ordered-list"
                    disabled={busy || inlineSavingFieldKey === field.key}
                    aria-pressed={isInlineRichTextListActive(inlineDraftValue, 'orderedList') ? 'true' : 'false'}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleInlineRichTextList('orderedList')}
                  >
                    1.
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    data-cms-record-field-rich-text-format="blockquote"
                    disabled={busy || inlineSavingFieldKey === field.key}
                    aria-pressed={isInlineRichTextBlockquoteActive(inlineDraftValue) ? 'true' : 'false'}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleInlineRichTextBlockquote()}
                  >
                    Quote
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    data-cms-record-field-rich-text-format="clear"
                    disabled={busy || inlineSavingFieldKey === field.key}
                    aria-pressed={isInlineRichTextClearActive(inlineDraftValue) ? 'true' : 'false'}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleInlineRichTextClear()}
                  >
                    Clear
                  </button>
                </div>
              ) : null}
              {inlineValidationMessage ? (
                <span
                  role="alert"
                  style={warningTextStyle}
                  data-cms-record-field-inline-validation={`${record.recordId}:${field.key}`}
                >
                  {inlineValidationMessage}
                </span>
              ) : null}
              {field.type === 'slug' ? (
                <span
                  style={helperTextStyle}
                  data-cms-record-field-inline-url-preview={`${record.recordId}:${field.key}`}
                >
                  Inline URL preview: /{record.locale ?? 'ko'}/{detail.slug || detail.collectionId}/{normalizeCmsSlugPreview(inlineDraftText(field, inlineDraftValue)) || `{${field.key}}`}
                </span>
              ) : field.type === 'image' ? (
                <span
                  style={helperTextStyle}
                  data-cms-record-field-inline-image-preview={`${record.recordId}:${field.key}`}
                >
                  Inline image preview: {inlineImageValue?.url || `{${field.key}}`}
                </span>
              ) : null}
              {inlineSlugRedirectReview ? (
                <span
                  style={slugHelperCardStyle}
                  data-cms-record-field-inline-redirect-review={`${record.recordId}:${field.key}`}
                >
                  <span style={slugHelperHeaderStyle}>
                    <span style={helperTextStyle}>Redirect review</span>
                    <span style={slugHelperWarningPillStyle}>301 redirect on save</span>
                  </span>
                  <span style={helperTextStyle}>Current: {inlineSlugRedirectReview.currentPath}</span>
                  <span style={helperTextStyle}>New: {inlineSlugRedirectReview.nextPath}</span>
                  <span style={helperTextStyle}>Saving this slug will create the redirect automatically.</span>
                </span>
              ) : null}
              <div className="builder-dashboard-page-actions">
                <button
                  type="button"
                  className="builder-action-btn builder-action-btn--primary"
                  data-cms-record-field-inline-save={`${record.recordId}:${field.key}`}
                  disabled={busy || inlineSavingFieldKey === field.key || Boolean(inlineValidationMessage)}
                  onClick={() => {
                    void commitInlineRecordField(field, inlineDraftValue);
                  }}
                >
                  {inlineSavingFieldKey === field.key ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  className="builder-action-btn"
                  disabled={busy || inlineSavingFieldKey === field.key}
                  onClick={() => {
                    setInlineFieldKey(null);
                    setInlineAssetFieldKey(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
          {field.type === 'image' && inlineAssetFieldKey === field.key ? (
            <AssetLibraryModal
              open
              locale={locale}
              selectedUrl={inlineImageValue?.url ?? null}
              initialFolder="uploads"
              autoFolderOnSelect="uploads"
              autoTagOnSelect="cms"
              onClose={() => setInlineAssetFieldKey(null)}
              onSelect={handleInlineImageAssetSelect}
              onToast={onToast}
            />
          ) : null}
          {field.required || field.unique ? (
            <div style={sourceChipListStyle}>
              {field.required ? <span style={sourceChipStyle}>required</span> : null}
              {field.unique ? <span style={sourceChipStyle}>unique</span> : null}
            </div>
          ) : null}
          <button
            type="button"
            className="builder-action-btn"
            data-cms-record-field-edit={`${record.recordId}:${field.key}`}
            data-cms-record-field-edit-index={fieldIndex}
            data-cms-record-field-edit-record-index={recordIndex}
            onKeyDown={handleRecordFieldGridKeyDown}
            onClick={() => onEditField(field.key)}
          >
            Edit cell
          </button>
          {supportsInlineRecordFieldEdit(field) ? (
            <button
              type="button"
              className="builder-action-btn"
              data-cms-record-field-inline-edit={`${record.recordId}:${field.key}`}
              disabled={busy}
              onClick={() => {
                setInlineAssetFieldKey(null);
                setInlineFieldKey(field.key);
                setInlineDraftValue(inlineRecordFieldDraftValue(field, record.fields[field.key]));
              }}
            >
              Inline edit
            </button>
          ) : null}
        </div>
        );
      })}
      {detail.fields.length > fields.length ? (
        <div style={editableRecordFieldCellStyle}>
          <strong style={helperTextStyle}>More fields</strong>
          <span style={editableRecordFieldValueStyle}>+{detail.fields.length - fields.length}</span>
        </div>
      ) : null}
    </div>
  );
}

function handleRecordFieldGridKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
  const grid = event.currentTarget.closest('[data-cms-record-field-grid]');
  if (!grid) return;

  const buttons = Array.from(grid.querySelectorAll<HTMLButtonElement>('[data-cms-record-field-edit]'));
  if (buttons.length === 0) return;

  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    const gridListRoot = grid.closest('.builder-dashboard-page-list') ?? document;
    const grids = Array.from(gridListRoot.querySelectorAll<HTMLElement>('[data-cms-record-field-grid]'));
    if (grids.length <= 1) return;

    const currentGridIndex = Math.max(0, grids.indexOf(grid as HTMLElement));
    const targetGridIndex = event.key === 'ArrowDown'
      ? Math.min(grids.length - 1, currentGridIndex + 1)
      : Math.max(0, currentGridIndex - 1);
    const fieldIndex = Number(event.currentTarget.dataset.cmsRecordFieldEditIndex ?? '0');
    const targetButtons = Array.from(grids[targetGridIndex]?.querySelectorAll<HTMLButtonElement>('[data-cms-record-field-edit]') ?? []);
    const targetButton = targetButtons[Math.min(Math.max(0, fieldIndex), Math.max(0, targetButtons.length - 1))];
    if (!targetButton) return;

    event.preventDefault();
    targetButton.focus();
    return;
  }

  if (buttons.length <= 1) return;

  event.preventDefault();
  const currentIndex = Math.max(0, buttons.indexOf(event.currentTarget));
  const nextIndex = event.key === 'Home'
    ? 0
    : event.key === 'End'
      ? buttons.length - 1
      : event.key === 'ArrowRight'
        ? Math.min(buttons.length - 1, currentIndex + 1)
        : Math.max(0, currentIndex - 1);
  buttons[nextIndex]?.focus();
}

function supportsInlineRecordFieldEdit(field: BuilderCmsFieldDefinition): boolean {
  return field.repeated || ['text', 'rich-text', 'slug', 'number', 'date', 'email', 'url', 'string-list', 'reference', 'image'].includes(field.type);
}

function isInlineRecordFieldMultiline(field: BuilderCmsFieldDefinition): boolean {
  return field.repeated || field.type === 'rich-text' || field.type === 'string-list';
}

function inlineRecordFieldInputType(field: BuilderCmsFieldDefinition): React.HTMLInputTypeAttribute {
  if (field.type === 'number') return 'number';
  if (field.type === 'date') return 'date';
  if (field.type === 'email') return 'email';
  if (field.type === 'url' || field.type === 'image') return 'url';
  return 'text';
}

function inlineRecordFieldDraftValue(field: BuilderCmsFieldDefinition, value: unknown): RecordFormValue {
  return recordFormValueFromField(field, value);
}

type InlineRichTextTag = 'strong' | 'em' | 'u' | 's' | 'code';
type InlineRichTextHeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type InlineRichTextListTag = 'bulletList' | 'orderedList';
type InlineRichTextSelection = { start: number; end: number } | null;
type InlineRichTextLinkSelection = {
  openStart: number;
  openEnd: number;
  closeStart: number;
  closeEnd: number;
  href: string;
} | null;

function escapeInlineRichTextAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function isInlineRichTextFormatActive(value: RecordFormValue, tag: InlineRichTextTag | 'link'): boolean {
  const text = typeof value === 'string' ? value : String(value ?? '');
  if (tag === 'link') return /<a\b[^>]*href="/i.test(text);
  return new RegExp(`<${tag}\\b`, 'i').test(text);
}

function isInlineRichTextBlockquoteActive(value: RecordFormValue): boolean {
  const text = typeof value === 'string' ? value : String(value ?? '');
  return /<blockquote\b/i.test(text);
}

function isInlineRichTextHeadingActive(value: RecordFormValue, level: 1 | 2 | 3 | 4 | 5 | 6): boolean {
  const text = typeof value === 'string' ? value : String(value ?? '');
  return new RegExp(`<h${level}\\b`, 'i').test(text);
}

function isInlineRichTextClearActive(value: RecordFormValue): boolean {
  const text = typeof value === 'string' ? value : String(value ?? '');
  return !/<(?:strong|em|u|s|link|code|a|blockquote|h1|h2|h3|h4|h5|h6|ul|ol|li)\b/i.test(text);
}

function formatInlineRichTextDraft(
  value: string,
  tag: InlineRichTextTag | InlineRichTextHeadingTag,
  selection?: InlineRichTextSelection,
): string {
  const openTag = `<${tag}>`;
  const closeTag = `</${tag}>`;
  if (
    selection &&
    Number.isInteger(selection.start) &&
    Number.isInteger(selection.end) &&
    selection.start >= 0 &&
    selection.end > selection.start &&
    selection.end <= value.length
  ) {
    return `${value.slice(0, selection.start)}${openTag}${value.slice(selection.start, selection.end)}${closeTag}${value.slice(selection.end)}`;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) return `${openTag}${closeTag}`;
  if (trimmedValue.startsWith(openTag) && trimmedValue.endsWith(closeTag)) {
    const startIndex = value.indexOf(trimmedValue);
    const before = value.slice(0, startIndex);
    const after = value.slice(startIndex + trimmedValue.length);
    return `${before}${trimmedValue.slice(openTag.length, -closeTag.length)}${after}`;
  }
  return `${openTag}${value}${closeTag}`;
}

function stripInlineRichTextHeadingMarkup(value: string): string {
  return value
    .replace(/<\/?(?:h1|h2|h3|h4|h5|h6)\b[^>]*>/gi, '')
    .trim();
}

function formatInlineRichTextHeadingDraft(
  value: string,
  level: 1 | 2 | 3 | 4 | 5 | 6,
  selection?: InlineRichTextSelection,
): string {
  const openTag = `<h${level}>`;
  const closeTag = `</h${level}>`;
  const wrapSelection = (selected: string): string => {
    const plain = stripInlineRichTextHeadingMarkup(selected);
    return plain ? `${openTag}${plain}${closeTag}` : `${openTag}${closeTag}`;
  };

  if (
    selection &&
    Number.isInteger(selection.start) &&
    Number.isInteger(selection.end) &&
    selection.start >= 0 &&
    selection.end > selection.start &&
    selection.end <= value.length
  ) {
    const selected = value.slice(selection.start, selection.end);
    const selectedTrimmed = selected.trim();
    if (selectedTrimmed.startsWith(openTag) && selectedTrimmed.endsWith(closeTag)) {
      return `${value.slice(0, selection.start)}${stripInlineRichTextHeadingMarkup(selected)}${value.slice(selection.end)}`;
    }
    return `${value.slice(0, selection.start)}${wrapSelection(selected)}${value.slice(selection.end)}`;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) return `${openTag}${closeTag}`;
  if (trimmedValue.startsWith(openTag) && trimmedValue.endsWith(closeTag)) {
    const startIndex = value.indexOf(trimmedValue);
    const before = value.slice(0, startIndex);
    const after = value.slice(startIndex + trimmedValue.length);
    return `${before}${stripInlineRichTextHeadingMarkup(trimmedValue)}${after}`;
  }
  return wrapSelection(value);
}

function findInlineRichTextLinkSelection(
  value: string,
  selection?: InlineRichTextSelection,
): InlineRichTextLinkSelection {
  if (
    !selection ||
    !Number.isInteger(selection.start) ||
    !Number.isInteger(selection.end) ||
    selection.start < 0 ||
    selection.end <= selection.start ||
    selection.end > value.length
  ) {
    return null;
  }

  const openStart = value.lastIndexOf('<a ', selection.start);
  if (openStart < 0) return null;
  const openEnd = value.indexOf('>', openStart);
  if (openEnd < 0 || openEnd >= selection.start) return null;
  const closeStart = value.indexOf('</a>', selection.end);
  if (closeStart < 0) return null;
  const closeEnd = closeStart + '</a>'.length;
  if (selection.end > closeStart) return null;
  const openTag = value.slice(openStart, openEnd + 1);
  const hrefMatch = openTag.match(/href="([^"]*)"/);
  if (!hrefMatch) return null;
  return {
    openStart,
    openEnd,
    closeStart,
    closeEnd,
    href: hrefMatch[1],
  };
}

function formatInlineRichTextLinkDraft(
  value: string,
  href: string,
  selection?: InlineRichTextSelection,
): string {
  const safeHref = escapeInlineRichTextAttribute(href);
  const openTag = `<a href="${safeHref}">`;
  const closeTag = '</a>';
  const existingLink = findInlineRichTextLinkSelection(value, selection);
  if (existingLink) {
    return `${value.slice(0, existingLink.openStart)}${openTag}${value.slice(existingLink.openEnd + 1, existingLink.closeStart)}${closeTag}${value.slice(existingLink.closeEnd)}`;
  }
  if (
    selection &&
    Number.isInteger(selection.start) &&
    Number.isInteger(selection.end) &&
    selection.start >= 0 &&
    selection.end > selection.start &&
    selection.end <= value.length
  ) {
    return `${value.slice(0, selection.start)}${openTag}${value.slice(selection.start, selection.end)}${closeTag}${value.slice(selection.end)}`;
  }
  return value;
}

function formatInlineRichTextBlockquoteDraft(
  value: string,
  selection?: InlineRichTextSelection,
): string {
  const openTag = '<blockquote>';
  const closeTag = '</blockquote>';
  if (
    selection &&
    Number.isInteger(selection.start) &&
    Number.isInteger(selection.end) &&
    selection.start >= 0 &&
    selection.end > selection.start &&
    selection.end <= value.length
  ) {
    const selected = value.slice(selection.start, selection.end);
    if (selected.startsWith(openTag) && selected.endsWith(closeTag)) {
      return `${value.slice(0, selection.start)}${selected.slice(openTag.length, -closeTag.length)}${value.slice(selection.end)}`;
    }
    return `${value.slice(0, selection.start)}${openTag}${selected}${closeTag}${value.slice(selection.end)}`;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) return `${openTag}${closeTag}`;
  if (trimmedValue.startsWith(openTag) && trimmedValue.endsWith(closeTag)) {
    const startIndex = value.indexOf(trimmedValue);
    const before = value.slice(0, startIndex);
    const after = value.slice(startIndex + trimmedValue.length);
    return `${before}${trimmedValue.slice(openTag.length, -closeTag.length)}${after}`;
  }
  return `${openTag}${value}${closeTag}`;
}

function isInlineRichTextListActive(value: RecordFormValue, tag: InlineRichTextListTag): boolean {
  const text = typeof value === 'string' ? value : String(value ?? '');
  return new RegExp(`<${tag === 'bulletList' ? 'ul' : 'ol'}\\b`, 'i').test(text);
}

function stripInlineRichTextListMarkup(value: string): string {
  return value
    .replace(/<\/li>/gi, '\n')
    .replace(/<li\b[^>]*>/gi, '')
    .replace(/<\/?(?:ul|ol)\b[^>]*>/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function formatInlineRichTextListDraft(
  value: string,
  tag: InlineRichTextListTag,
  selection?: InlineRichTextSelection,
): string {
  const openTag = tag === 'bulletList' ? '<ul>' : '<ol>';
  const closeTag = tag === 'bulletList' ? '</ul>' : '</ol>';

  const wrapSelection = (selected: string): string => {
    const plain = stripInlineRichTextListMarkup(selected);
    const lines = plain
      .split(/\r\n?|\n/g)
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length === 0) {
      return `${openTag}<li></li>${closeTag}`;
    }
    return `${openTag}${lines.map((line) => `<li>${line}</li>`).join('')}${closeTag}`;
  };

  if (
    selection &&
    Number.isInteger(selection.start) &&
    Number.isInteger(selection.end) &&
    selection.start >= 0 &&
    selection.end > selection.start &&
    selection.end <= value.length
  ) {
    const selected = value.slice(selection.start, selection.end);
    const selectedTrimmed = selected.trim();
    if (
      selectedTrimmed.startsWith(openTag)
      && selectedTrimmed.endsWith(closeTag)
    ) {
      return `${value.slice(0, selection.start)}${stripInlineRichTextListMarkup(selected)}${value.slice(selection.end)}`;
    }
    return `${value.slice(0, selection.start)}${wrapSelection(selected)}${value.slice(selection.end)}`;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) return `${openTag}<li></li>${closeTag}`;
  if (trimmedValue.startsWith(openTag) && trimmedValue.endsWith(closeTag)) {
    const startIndex = value.indexOf(trimmedValue);
    const before = value.slice(0, startIndex);
    const after = value.slice(startIndex + trimmedValue.length);
    return `${before}${stripInlineRichTextListMarkup(trimmedValue)}${after}`;
  }
  return wrapSelection(value);
}

function formatInlineRichTextClearDraft(
  value: string,
  selection?: InlineRichTextSelection,
): string {
  const stripTags = (input: string): string => input
    .replace(/<\/?(?:strong|em|u|s|code|blockquote|h1|h2|h3|h4|h5|h6)\b[^>]*>/gi, '')
    .replace(/<a\b[^>]*>/gi, '')
    .replace(/<\/a>/gi, '')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li\b[^>]*>/gi, '')
    .replace(/<\/?(?:ul|ol)\b[^>]*>/gi, '')
    .replace(/\n{3,}/g, '\n\n');

  if (
    selection &&
    Number.isInteger(selection.start) &&
    Number.isInteger(selection.end) &&
    selection.start >= 0 &&
    selection.end > selection.start &&
    selection.end <= value.length
  ) {
    return `${value.slice(0, selection.start)}${stripTags(value.slice(selection.start, selection.end))}${value.slice(selection.end)}`;
  }
  return stripTags(value);
}

function getInlineRecordFieldValidationMessage(
  field: BuilderCmsFieldDefinition,
  value: RecordFormValue,
  detail: BuilderCmsCollectionDetail,
  recordId: string,
): string | null {
  if (field.required && !comparableFieldValue(field, value)) {
    return `${field.label} is required before save.`;
  }
  const typeValidationMessage = getInlineRecordFieldTypeValidationMessage(field, value, detail);
  if (typeValidationMessage) return typeValidationMessage;
  const duplicateRecordId = findDuplicateFieldRecord(detail.records, field, value, recordId);
  if (duplicateRecordId) {
    return `This ${field.label} is already used by record ${duplicateRecordId}. Choose a unique value before save.`;
  }
  return null;
}

function getInlineRecordFieldTypeValidationMessage(
  field: BuilderCmsFieldDefinition,
  value: RecordFormValue,
  detail: BuilderCmsCollectionDetail,
): string | null {
  const trimmedValue = comparableFieldValue(field, value);
  if (!trimmedValue) return null;

  if (field.repeated || field.type === 'string-list') {
    const items = trimmedValue
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
    const listLengthMessage = getInlineFieldMinMaxValidationMessage(field, items.length);
    if (listLengthMessage) return listLengthMessage;
    if (field.validation?.options?.length) {
      const invalid = items.find((item) => !field.validation?.options?.includes(item));
      if (invalid) return `${field.label} includes an unsupported option before save: ${invalid}.`;
    }
    return null;
  }

  switch (field.type) {
    case 'number': {
      const numericValue = Number(trimmedValue);
      if (!Number.isFinite(numericValue)) return `${field.label} must be a number before save.`;
      return getInlineFieldMinMaxValidationMessage(field, numericValue);
    }
    case 'date':
      return Number.isFinite(Date.parse(trimmedValue)) ? null : `${field.label} must be a date before save.`;
    case 'email':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
        return `${field.label} must be an email before save.`;
      }
      return getInlineTextValidationMessage(field, trimmedValue);
    case 'url':
      if (!/^https?:\/\//.test(trimmedValue) && !trimmedValue.startsWith('/')) {
        return `${field.label} must be a URL before save.`;
      }
      return getInlineTextValidationMessage(field, trimmedValue);
    case 'image':
      if (!/^https?:\/\//.test(trimmedValue) && !trimmedValue.startsWith('/')) {
        return `${field.label} must be an image URL before save.`;
      }
      return getInlineTextValidationMessage(field, trimmedValue);
    case 'reference': {
      const textMessage = getInlineTextValidationMessage(field, trimmedValue);
      if (textMessage) return textMessage;
      if (
        field.relationCollectionId === detail.collectionId &&
        !detail.records.some((record) => record.recordId === trimmedValue)
      ) {
        return `${field.label} must reference an existing ${detail.name} record before save.`;
      }
      return null;
    }
    case 'rich-text':
    case 'text':
    case 'slug':
      return getInlineTextValidationMessage(field, field.type === 'slug' ? normalizeCmsSlugPreview(trimmedValue) : trimmedValue);
    default:
      return null;
  }
}

function getInlineTextValidationMessage(field: BuilderCmsFieldDefinition, value: string): string | null {
  const lengthMessage = getInlineFieldMinMaxValidationMessage(field, value.length);
  if (lengthMessage) return lengthMessage;
  if (field.validation?.pattern) {
    const pattern = new RegExp(field.validation.pattern);
    if (!pattern.test(value)) return `${field.label} does not match its pattern before save.`;
  }
  if (field.validation?.options?.length && !field.validation.options.includes(value)) {
    return `${field.label} must be one of: ${field.validation.options.join(', ')} before save.`;
  }
  return null;
}

function getInlineFieldMinMaxValidationMessage(field: BuilderCmsFieldDefinition, value: number): string | null {
  if (typeof field.validation?.min === 'number' && value < field.validation.min) {
    return `${field.label} must be at least ${field.validation.min} before save.`;
  }
  if (typeof field.validation?.max === 'number' && value > field.validation.max) {
    return `${field.label} must be at most ${field.validation.max} before save.`;
  }
  return null;
}

function getInlineSlugRedirectReview(
  detail: BuilderCmsCollectionDetail,
  record: BuilderCmsRecord,
  field: BuilderCmsFieldDefinition,
  value: string,
): { currentPath: string; nextPath: string } | null {
  if (field.type !== 'slug') return null;
  const currentSlug = normalizeCmsSlugPreview(String(record.fields[field.key] ?? ''));
  const nextSlug = normalizeCmsSlugPreview(value);
  if (!currentSlug || !nextSlug || currentSlug === nextSlug) return null;
  const basePath = `/${record.locale ?? 'ko'}/${detail.slug || detail.collectionId}`;
  return {
    currentPath: `${basePath}/${currentSlug}`,
    nextPath: `${basePath}/${nextSlug}`,
  };
}

function getSourceCollectionStatus(collectionId: BuilderCollectionSummary['id']) {
  switch (collectionId) {
    case 'columns':
      return {
        kind: 'protected',
        label: 'Publish-protected',
        href: '/columns',
        actionLabel: 'Open Columns editor',
        surface: 'Native editor with draft, publish, and slug redirect lifecycle.',
        body: 'Native Columns editor slug changes are saved as drafts and create 301 redirects when republished.',
      };
    case 'service-areas':
      return {
        kind: 'backend-ready',
        label: 'Backend-ready',
        href: '/services',
        actionLabel: 'Open service source editor',
        surface: 'Source editor with live slug overrides, reset, and redirect review.',
        body: 'Service source overrides can update live detail slugs and create 301 redirects through the builder services API.',
      };
    case 'attorney-profiles':
      return {
        kind: 'backend-ready',
        label: 'Backend-ready',
        href: '/lawyers',
        actionLabel: 'Open lawyer source editor',
        surface: 'Source editor plus dynamic list/item page bindings.',
        body: 'Lawyer source overrides can update live profile slugs and create 301 redirects through the builder lawyers API.',
      };
    default:
      return {
        kind: 'read-only',
        label: 'Read-only source',
        href: '',
        actionLabel: '',
        surface: 'Data-file backed source without a visible editor yet.',
        body: 'Redirect computation supports this source, but record slug rename UI is still data-file backed and read-only.',
      };
  }
}

function CmsSlugFieldHelper({
  collectionSlug,
  duplicateRecordId,
  dynamicItemUrlBases,
  field,
  locale,
  value,
}: {
  collectionSlug: string;
  duplicateRecordId?: string | null;
  dynamicItemUrlBases: string[];
  field: BuilderCmsFieldDefinition;
  locale: Locale;
  value: RecordFormValue | undefined;
}) {
  const slugPreview = normalizeCmsSlugPreview(value) || '{slug}';
  const previewBases = dynamicItemUrlBases.length > 0
    ? dynamicItemUrlBases
    : [`/${locale}/${collectionSlug || 'collection'}`];
  const hasDynamicItemBinding = dynamicItemUrlBases.length > 0;
  return (
    <span
      data-cms-slug-helper-card={field.key}
      data-cms-slug-helper-mode={hasDynamicItemBinding ? 'dynamic' : 'potential'}
      style={slugHelperCardStyle}
    >
      <span style={slugHelperHeaderStyle}>
        <span style={helperTextStyle} data-cms-slug-helper={field.key}>
          {hasDynamicItemBinding ? 'Dynamic URL' : 'Potential dynamic URL'}:{' '}
          {previewBases.map((base, index) => (
            <span key={`${base}-${index}`}>
              {index > 0 ? ', ' : null}
              {base}/{slugPreview}
            </span>
          ))}
        </span>
        <span
          data-cms-slug-redirect-status={field.key}
          style={hasDynamicItemBinding ? slugHelperWarningPillStyle : slugHelperPillStyle}
        >
          {hasDynamicItemBinding ? '301 redirect on save' : 'Manual redirect required'}
        </span>
      </span>
      <span style={helperTextStyle}>
        {hasDynamicItemBinding
          ? 'This slug is used by dynamic item pages. Slug changes create 301 redirects for linked URLs on save.'
          : 'No dynamic item page is bound to this slug field yet. If a live URL changes later, add a 301 redirect manually.'}
      </span>
      {field.unique ? (
        <span style={helperTextStyle}>Unique slug. Duplicate values are blocked before save.</span>
      ) : null}
      {duplicateRecordId ? (
        <span style={warningTextStyle} role="alert" data-cms-slug-duplicate={field.key}>
          This slug is already used by record {duplicateRecordId}. Choose a unique slug before save.
        </span>
      ) : null}
    </span>
  );
}

function normalizeCmsSlugPreview(value: RecordFormValue | undefined): string {
  return String(typeof value === 'string' ? value : '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function comparableFieldValue(
  field: BuilderCmsFieldDefinition,
  value: unknown,
): string {
  if (field.type === 'slug') return normalizeCmsSlugPreview(String(value ?? ''));
  if (field.type === 'image') return imageValueFromForm(value)?.url ?? '';
  return String(value ?? '').trim();
}

function findDuplicateFieldRecord(
  records: BuilderCmsRecord[],
  field: BuilderCmsFieldDefinition,
  value: RecordFormValue | undefined,
  editingRecordId: string | null,
): string | null {
  if (!field.unique) return null;
  const nextValue = comparableFieldValue(field, value);
  if (!nextValue) return null;
  const duplicate = records.find((record) => (
    record.recordId !== editingRecordId
    && comparableFieldValue(field, record.fields[field.key]) === nextValue
  ));
  return duplicate?.recordId ?? null;
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

function cmsActorHeaders(actor: BuilderCmsPermissionActor): HeadersInit {
  return { [CMS_ACTOR_HEADER]: actor };
}

function cmsActorJsonHeaders(actor: BuilderCmsPermissionActor): HeadersInit {
  return { 'Content-Type': 'application/json', ...cmsActorHeaders(actor) };
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

function latestModerationEvents(events: BuilderCmsModerationEvent[]): BuilderCmsModerationEvent[] {
  return [...events]
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
    .slice(0, 5);
}

function revisionDiffItems(
  revision: BuilderCmsRecordRevision,
  fields: BuilderCmsFieldDefinition[],
): string[] {
  const fieldLabels = new Map(fields.map((field) => [field.key, field.label]));
  const items: string[] = [];
  if (revision.diff.status) {
    items.push(`Status: ${revision.diff.status.before} -> ${revision.diff.status.after}`);
  }
  if (revision.diff.locale) {
    items.push(`Locale: ${revision.diff.locale.before ?? '-'} -> ${revision.diff.locale.after ?? '-'}`);
  }
  for (const change of revision.diff.fields.slice(0, 4)) {
    items.push(`${fieldLabels.get(change.fieldKey) ?? change.fieldKey}: ${formatValue(change.before)} -> ${formatValue(change.after)}`);
  }
  if (revision.diff.fields.length > 4) {
    items.push(`+${revision.diff.fields.length - 4} more field changes`);
  }
  return items;
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function countRecordsByStatus(records: BuilderCmsRecord[]): Record<BuilderCmsRecordStatus, number> {
  const counts = Object.fromEntries(
    builderCmsRecordStatuses.map((status) => [status, 0]),
  ) as Record<BuilderCmsRecordStatus, number>;
  for (const record of records) {
    counts[record.status] = (counts[record.status] ?? 0) + 1;
  }
  return counts;
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

function recordGridDensityStorageKey(siteId: string, locale: Locale, collectionId: string): string {
  return `${RECORD_GRID_DENSITY_STORAGE_PREFIX}:${siteId}:${locale}:${collectionId}`;
}

function recordGridPreviewFieldCountStorageKey(siteId: string, locale: Locale, collectionId: string): string {
  return `${RECORD_GRID_PREVIEW_FIELD_COUNT_STORAGE_PREFIX}:${siteId}:${locale}:${collectionId}`;
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
