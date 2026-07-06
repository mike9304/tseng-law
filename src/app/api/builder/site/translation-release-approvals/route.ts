import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { createNotification } from '@/lib/builder/notifications/notification-store';
import {
  getLatestTranslationReleaseApprovalForContext,
  listTranslationReleaseApprovals,
  requestTranslationReleaseApproval,
} from '@/lib/builder/publish-gate/translation-release-approval-store';
import {
  TRANSLATION_RELEASE_APPROVAL_STATUSES,
  summarizeTranslationReleaseApproval,
  type TranslationReleaseApprovalContext,
  type TranslationReleaseApprovalStatus,
} from '@/lib/builder/publish-gate/translation-release-approval-model';
import {
  summarizeTranslationReleaseApprovalReviewerReport,
} from '@/lib/builder/publish-gate/translation-release-approval-report';
import {
  readTranslationReleasePolicy,
} from '@/lib/builder/publish-gate/translation-release-policy';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import { resolveUserRole } from '@/lib/builder/security/resolve-permission';
import { listUserRoles } from '@/lib/builder/security/user-role-store';
import { locales } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const summarySchema = z.object({
  sourceLocale: z.enum(locales),
  syncedAt: z.string().datetime({ offset: true }),
  totalCount: z.number().int().nonnegative(),
  currentPageCount: z.number().int().nonnegative(),
  otherPageCount: z.number().int().nonnegative(),
  warningCount: z.number().int().nonnegative(),
  errorCount: z.number().int().nonnegative(),
  reviewHref: z.string().trim().min(1).max(320),
  warningFingerprint: z.string().trim().min(1).max(80),
}).strict();

const requestSchema = z.object({
  pageId: z.string().trim().min(1).max(180),
  locale: z.enum(locales),
  summary: summarySchema,
  comment: z.string().trim().max(500).optional(),
}).strict();

function isTranslationReleaseApprovalStatus(
  value: string,
): value is TranslationReleaseApprovalStatus {
  return TRANSLATION_RELEASE_APPROVAL_STATUSES.some((candidate) => candidate === value);
}

export async function GET(request: NextRequest) {
  const auth = guardBuilderRead(request);
  if (auth instanceof NextResponse) return auth;

  const pageId = request.nextUrl.searchParams.get('pageId') ?? undefined;
  const localeParam = request.nextUrl.searchParams.get('locale') ?? undefined;
  const warningFingerprint =
    request.nextUrl.searchParams.get('warningFingerprint') ?? undefined;
  const locale = locales.find((candidate) => candidate === localeParam);
  const statusParam = request.nextUrl.searchParams.get('status');
  let status: TranslationReleaseApprovalStatus | undefined;
  if (statusParam) {
    if (!isTranslationReleaseApprovalStatus(statusParam)) {
      return NextResponse.json(
        { ok: false, error: 'unknown_approval_status' },
        { status: 400 },
      );
    }
    status = statusParam;
  }

  const context: TranslationReleaseApprovalContext | undefined =
    pageId && locale && warningFingerprint
      ? {
        siteId: DEFAULT_BUILDER_SITE_ID,
        pageId,
        locale,
        warningFingerprint,
      }
      : undefined;

  const approvals = await listTranslationReleaseApprovals(context ? { context } : undefined);
  const filteredApprovals = status
    ? approvals.filter((approval) => approval.status === status)
    : approvals;
  const reviewerCandidates = (await listUserRoles()).map((user) => ({
    username: user.username,
    role: user.role,
  }));

  return NextResponse.json({
    ok: true,
    approvals: filteredApprovals.map(summarizeTranslationReleaseApproval),
    total: filteredApprovals.length,
    currentActor: { username: auth.username },
    report: summarizeTranslationReleaseApprovalReviewerReport(
      approvals,
      new Date(),
      reviewerCandidates,
    ),
  });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, {
    bucket: 'publish',
    permission: 'publish',
  });
  if (auth instanceof NextResponse) return auth;

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Invalid translation release approval request.' },
      { status: 400 },
    );
  }

  const policy = await readTranslationReleasePolicy(DEFAULT_BUILDER_SITE_ID);
  const requestedRole = await resolveUserRole(auth.username);
  const required =
    policy.mode === 'acknowledge-other-page-warnings'
    && policy.approvalRequiredForRoles.includes(requestedRole)
    && parsed.data.summary.otherPageCount > 0;

  if (!required) {
    return NextResponse.json(
      { ok: false, error: 'translation_release_approval_not_required' },
      { status: 409 },
    );
  }

  const context = {
    siteId: DEFAULT_BUILDER_SITE_ID,
    pageId: parsed.data.pageId,
    locale: parsed.data.locale,
    warningFingerprint: parsed.data.summary.warningFingerprint,
  };
  const latest = await getLatestTranslationReleaseApprovalForContext(context);
  if (latest?.status === 'pending' || latest?.status === 'approved') {
    return NextResponse.json({
      ok: true,
      approval: summarizeTranslationReleaseApproval(latest),
    });
  }

  const approval = await requestTranslationReleaseApproval({
    ...context,
    summary: parsed.data.summary,
    requestedBy: auth.username,
    requestedRole,
    ...(parsed.data.comment ? { comment: parsed.data.comment } : {}),
  });
  await createNotification({
    kind: 'approval',
    subject: `Translation release approval requested for ${parsed.data.pageId}`,
    body: `${auth.username} requested approval for ${parsed.data.summary.otherPageCount} other-page translation warnings.`,
    audience: { role: 'owner' },
    link: parsed.data.summary.reviewHref,
  });
  return NextResponse.json({
    ok: true,
    approval: summarizeTranslationReleaseApproval(approval),
  }, { status: 201 });
}
