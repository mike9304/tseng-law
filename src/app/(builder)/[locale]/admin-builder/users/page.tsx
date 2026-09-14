import { requireBuilderPagePermission } from '@/lib/builder/security/page-permission';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import UsersAdmin from '@/components/builder/users/UsersAdmin';
import {
  listUserRoles,
  BUILDER_ROLE_NAMES,
} from '@/lib/builder/security/user-role-store';
import { resolveUserRole } from '@/lib/builder/security/resolve-permission';
import { BUILDER_PERMISSIONS } from '@/lib/builder/security/permissions';
import { rolePermissionMatrix } from '@/lib/builder/security/role-permissions';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';
import { getUsersAdminCopy } from '@/components/builder/users/users-copy';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const copy = getUsersAdminCopy(locale);
  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/admin-builder/users',
    alternateLocales: locales,
    noindex: true,
  });
}

export default async function BuilderUsersAdminPage(
  props: {
    params: Promise<{ locale: Locale }>;
  }
) {
  const actor = await requireBuilderPagePermission('manage-roles');
  const params = await props.params;
  const locale = normalizeLocale(params.locale);

  const users = await listUserRoles();
  if (!users.length) {
    // ensureSeed should always have inserted the configured owner; if it
    // hasn't, the env is misconfigured and we should not render.
    notFound();
  }

  const matrix = rolePermissionMatrix(BUILDER_PERMISSIONS);
  const initialActorRole = await resolveUserRole(actor.username);

  return (
    <UsersAdmin
      locale={locale}
      initialUsers={users}
      roles={[...BUILDER_ROLE_NAMES]}
      permissions={[...BUILDER_PERMISSIONS]}
      matrix={matrix}
      actorRole={initialActorRole}
    />
  );
}
