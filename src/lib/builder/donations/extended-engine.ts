/**
 * Phase 19 — Extended Modules (Donations + Online Programs + File Share + Restaurant).
 *
 * These four modules are combined into one file because the law firm
 * may only need a subset. Basic structures are provided for Wix parity.
 *
 * EXT-01: Donations — donation link model (amount presets, custom, payment redirect)
 * EXT-02: Online Programs — program model (title, schedule, enrollment)
 * EXT-03: File Share — shared file model (name, url, size, downloadCount, accessLevel)
 * EXT-04: Restaurant — basic menu item model (Wix parity, not law-firm specific)
 */

import type { Locale } from '@/lib/locales';
import { get, put, list } from '@vercel/blob';

// ═══════════════════════════════════════════════════════════════════
// SECTION 1: Donations
// ═══════════════════════════════════════════════════════════════════

export interface DonationLink {
  donationId: string;
  title: string;
  description?: string;
  currency: string;
  amountPresets: number[];     // e.g. [10000, 50000, 100000]
  allowCustomAmount: boolean;
  minAmount?: number;
  maxAmount?: number;
  paymentUrl: string;          // redirect URL for payment
  imageUrl?: string;
  active: boolean;
  locale: Locale;
  createdAt: string;
  updatedAt: string;
}

export interface DonationRecord {
  recordId: string;
  donationId: string;
  donorName?: string;
  donorEmail?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  transactionRef?: string;
  donatedAt: string;
}

const DONATIONS_PREFIX = 'builder-donations/links/';
const DONATION_RECORDS_PREFIX = 'builder-donations/records/';

export async function saveDonationLink(link: DonationLink): Promise<void> {
  await put(`${DONATIONS_PREFIX}${link.donationId}.json`, JSON.stringify(link), {
    access: 'private', allowOverwrite: true, contentType: 'application/json',
  });
}

export async function loadDonationLink(donationId: string): Promise<DonationLink | null> {
  try {
    const result = await get(`${DONATIONS_PREFIX}${donationId}.json`, { access: 'private', useCache: false });
    if (result?.statusCode === 200 && result.stream) {
      return JSON.parse(await new Response(result.stream).text()) as DonationLink;
    }
  } catch { /* empty */ }
  return null;
}

export async function listDonationLinks(): Promise<DonationLink[]> {
  try {
    const result = await list({ prefix: DONATIONS_PREFIX });
    const links: DonationLink[] = [];
    for (const blob of result.blobs) {
      try {
        const res = await get(blob.pathname, { access: 'private', useCache: false });
        if (res?.statusCode === 200 && res.stream) {
          links.push(JSON.parse(await new Response(res.stream).text()) as DonationLink);
        }
      } catch { /* skip */ }
    }
    return links;
  } catch { return []; }
}

export async function saveDonationRecord(record: DonationRecord): Promise<void> {
  const dateKey = record.donatedAt.slice(0, 10);
  await put(
    `${DONATION_RECORDS_PREFIX}${record.donationId}/${dateKey}/${record.recordId}.json`,
    JSON.stringify(record),
    { access: 'private', allowOverwrite: true, contentType: 'application/json' },
  );
}

export async function listDonationRecords(donationId: string): Promise<DonationRecord[]> {
  try {
    const result = await list({ prefix: `${DONATION_RECORDS_PREFIX}${donationId}/` });
    const records: DonationRecord[] = [];
    for (const blob of result.blobs) {
      try {
        const res = await get(blob.pathname, { access: 'private', useCache: false });
        if (res?.statusCode === 200 && res.stream) {
          records.push(JSON.parse(await new Response(res.stream).text()) as DonationRecord);
        }
      } catch { /* skip */ }
    }
    return records.sort((a, b) => b.donatedAt.localeCompare(a.donatedAt));
  } catch { return []; }
}

export function validateDonationLink(link: Partial<DonationLink>): string[] {
  const errors: string[] = [];
  if (!link.title?.trim()) errors.push('기부 제목을 입력하세요.');
  if (!link.paymentUrl?.trim()) errors.push('결제 URL을 입력하세요.');
  if (!link.currency?.trim()) errors.push('통화를 입력하세요.');
  if (link.amountPresets && link.amountPresets.some((a) => a <= 0)) {
    errors.push('금액 프리셋은 0보다 커야 합니다.');
  }
  return errors;
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 2: Online Programs
// ═══════════════════════════════════════════════════════════════════

export type ProgramStatus = 'draft' | 'published' | 'archived';

export interface OnlineProgram {
  programId: string;
  title: string;
  description: string;
  schedule: string;            // free-text schedule description
  startDate?: string;
  endDate?: string;
  instructor?: string;
  capacity?: number;
  enrolledCount: number;
  price?: number;
  currency?: string;
  status: ProgramStatus;
  imageUrl?: string;
  locale: Locale;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramEnrollment {
  enrollmentId: string;
  programId: string;
  name: string;
  email: string;
  phone?: string;
  enrolledAt: string;
  status: 'active' | 'completed' | 'cancelled';
}

const PROGRAMS_PREFIX = 'builder-programs/programs/';
const ENROLLMENTS_PREFIX = 'builder-programs/enrollments/';

export async function saveProgram(program: OnlineProgram): Promise<void> {
  await put(`${PROGRAMS_PREFIX}${program.programId}.json`, JSON.stringify(program), {
    access: 'private', allowOverwrite: true, contentType: 'application/json',
  });
}

export async function loadProgram(programId: string): Promise<OnlineProgram | null> {
  try {
    const result = await get(`${PROGRAMS_PREFIX}${programId}.json`, { access: 'private', useCache: false });
    if (result?.statusCode === 200 && result.stream) {
      return JSON.parse(await new Response(result.stream).text()) as OnlineProgram;
    }
  } catch { /* empty */ }
  return null;
}

export async function listPrograms(): Promise<OnlineProgram[]> {
  try {
    const result = await list({ prefix: PROGRAMS_PREFIX });
    const programs: OnlineProgram[] = [];
    for (const blob of result.blobs) {
      try {
        const res = await get(blob.pathname, { access: 'private', useCache: false });
        if (res?.statusCode === 200 && res.stream) {
          programs.push(JSON.parse(await new Response(res.stream).text()) as OnlineProgram);
        }
      } catch { /* skip */ }
    }
    return programs;
  } catch { return []; }
}

export async function enrollInProgram(
  programId: string,
  data: { name: string; email: string; phone?: string },
): Promise<ProgramEnrollment> {
  const program = await loadProgram(programId);
  if (!program) throw new Error('프로그램을 찾을 수 없습니다.');
  if (program.capacity && program.enrolledCount >= program.capacity) {
    throw new Error('등록이 마감되었습니다.');
  }

  const enrollment: ProgramEnrollment = {
    enrollmentId: `enroll-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    programId,
    name: data.name,
    email: data.email.toLowerCase().trim(),
    phone: data.phone,
    enrolledAt: new Date().toISOString(),
    status: 'active',
  };

  await put(
    `${ENROLLMENTS_PREFIX}${programId}/${enrollment.enrollmentId}.json`,
    JSON.stringify(enrollment),
    { access: 'private', allowOverwrite: true, contentType: 'application/json' },
  );

  program.enrolledCount += 1;
  program.updatedAt = new Date().toISOString();
  await saveProgram(program);

  return enrollment;
}

export async function listEnrollments(programId: string): Promise<ProgramEnrollment[]> {
  try {
    const result = await list({ prefix: `${ENROLLMENTS_PREFIX}${programId}/` });
    const enrollments: ProgramEnrollment[] = [];
    for (const blob of result.blobs) {
      try {
        const res = await get(blob.pathname, { access: 'private', useCache: false });
        if (res?.statusCode === 200 && res.stream) {
          enrollments.push(JSON.parse(await new Response(res.stream).text()) as ProgramEnrollment);
        }
      } catch { /* skip */ }
    }
    return enrollments;
  } catch { return []; }
}

export function filterProgramsByStatus(programs: OnlineProgram[], status: ProgramStatus): OnlineProgram[] {
  return programs.filter((p) => p.status === status);
}

export function sortProgramsByDate(programs: OnlineProgram[], direction: 'asc' | 'desc' = 'desc'): OnlineProgram[] {
  return [...programs].sort((a, b) =>
    direction === 'desc'
      ? (b.startDate || b.createdAt).localeCompare(a.startDate || a.createdAt)
      : (a.startDate || a.createdAt).localeCompare(b.startDate || b.createdAt),
  );
}

export function validateProgram(program: Partial<OnlineProgram>): string[] {
  const errors: string[] = [];
  if (!program.title?.trim()) errors.push('프로그램 제목을 입력하세요.');
  if (!program.description?.trim()) errors.push('프로그램 설명을 입력하세요.');
  if (!program.schedule?.trim()) errors.push('일정을 입력하세요.');
  return errors;
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 3: File Share
// ═══════════════════════════════════════════════════════════════════

export type FileAccessLevel = 'public' | 'members' | 'admin';

export interface SharedFile {
  fileId: string;
  name: string;
  url: string;
  mimeType?: string;
  size: number;                // bytes
  downloadCount: number;
  accessLevel: FileAccessLevel;
  category?: string;
  description?: string;
  uploadedBy: string;
  locale: Locale;
  createdAt: string;
  updatedAt: string;
}

const FILES_PREFIX = 'builder-files/shared/';

export async function saveSharedFile(file: SharedFile): Promise<void> {
  await put(`${FILES_PREFIX}${file.fileId}.json`, JSON.stringify(file), {
    access: 'private', allowOverwrite: true, contentType: 'application/json',
  });
}

export async function loadSharedFile(fileId: string): Promise<SharedFile | null> {
  try {
    const result = await get(`${FILES_PREFIX}${fileId}.json`, { access: 'private', useCache: false });
    if (result?.statusCode === 200 && result.stream) {
      return JSON.parse(await new Response(result.stream).text()) as SharedFile;
    }
  } catch { /* empty */ }
  return null;
}

export async function listSharedFiles(): Promise<SharedFile[]> {
  try {
    const result = await list({ prefix: FILES_PREFIX });
    const files: SharedFile[] = [];
    for (const blob of result.blobs) {
      try {
        const res = await get(blob.pathname, { access: 'private', useCache: false });
        if (res?.statusCode === 200 && res.stream) {
          files.push(JSON.parse(await new Response(res.stream).text()) as SharedFile);
        }
      } catch { /* skip */ }
    }
    return files;
  } catch { return []; }
}

export async function incrementDownloadCount(fileId: string): Promise<void> {
  const file = await loadSharedFile(fileId);
  if (file) {
    file.downloadCount += 1;
    file.updatedAt = new Date().toISOString();
    await saveSharedFile(file);
  }
}

export function filterFilesByAccess(files: SharedFile[], level: FileAccessLevel): SharedFile[] {
  return files.filter((f) => f.accessLevel === level);
}

export function sortFilesByDate(files: SharedFile[], direction: 'asc' | 'desc' = 'desc'): SharedFile[] {
  return [...files].sort((a, b) =>
    direction === 'desc' ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt),
  );
}

export function sortFilesByDownloads(files: SharedFile[], direction: 'asc' | 'desc' = 'desc'): SharedFile[] {
  return [...files].sort((a, b) =>
    direction === 'desc' ? b.downloadCount - a.downloadCount : a.downloadCount - b.downloadCount,
  );
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function validateSharedFile(file: Partial<SharedFile>): string[] {
  const errors: string[] = [];
  if (!file.name?.trim()) errors.push('파일 이름을 입력하세요.');
  if (!file.url?.trim()) errors.push('파일 URL을 입력하세요.');
  if (file.size != null && file.size < 0) errors.push('파일 크기가 올바르지 않습니다.');
  return errors;
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 4: Restaurant (Wix parity — basic structure only)
// ═══════════════════════════════════════════════════════════════════

export interface MenuItem {
  itemId: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  category: string;
  imageUrl?: string;
  available: boolean;
  tags?: string[];             // e.g. 'vegetarian', 'spicy', 'gluten-free'
  locale: Locale;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenuSection {
  sectionId: string;
  name: string;
  description?: string;
  items: MenuItem[];
  order: number;
  locale: Locale;
}

const MENU_PREFIX = 'builder-restaurant/menu/';

export async function saveMenuItem(item: MenuItem): Promise<void> {
  await put(`${MENU_PREFIX}${item.itemId}.json`, JSON.stringify(item), {
    access: 'private', allowOverwrite: true, contentType: 'application/json',
  });
}

export async function loadMenuItem(itemId: string): Promise<MenuItem | null> {
  try {
    const result = await get(`${MENU_PREFIX}${itemId}.json`, { access: 'private', useCache: false });
    if (result?.statusCode === 200 && result.stream) {
      return JSON.parse(await new Response(result.stream).text()) as MenuItem;
    }
  } catch { /* empty */ }
  return null;
}

export async function listMenuItems(): Promise<MenuItem[]> {
  try {
    const result = await list({ prefix: MENU_PREFIX });
    const items: MenuItem[] = [];
    for (const blob of result.blobs) {
      try {
        const res = await get(blob.pathname, { access: 'private', useCache: false });
        if (res?.statusCode === 200 && res.stream) {
          items.push(JSON.parse(await new Response(res.stream).text()) as MenuItem);
        }
      } catch { /* skip */ }
    }
    return items;
  } catch { return []; }
}

export function filterMenuByCategory(items: MenuItem[], category: string): MenuItem[] {
  return items.filter((i) => i.category === category);
}

export function filterAvailableItems(items: MenuItem[]): MenuItem[] {
  return items.filter((i) => i.available);
}

export function sortMenuByOrder(items: MenuItem[]): MenuItem[] {
  return [...items].sort((a, b) => a.order - b.order);
}

export function sortMenuByPrice(items: MenuItem[], direction: 'asc' | 'desc' = 'asc'): MenuItem[] {
  return [...items].sort((a, b) => direction === 'asc' ? a.price - b.price : b.price - a.price);
}

export function groupMenuBySections(items: MenuItem[], locale: Locale): MenuSection[] {
  const map = new Map<string, MenuItem[]>();
  for (const item of items) {
    if (item.locale !== locale) continue;
    const arr = map.get(item.category) || [];
    arr.push(item);
    map.set(item.category, arr);
  }

  const sections: MenuSection[] = [];
  let sectionOrder = 0;
  for (const [category, categoryItems] of map.entries()) {
    sections.push({
      sectionId: `section-${category}`,
      name: category,
      items: sortMenuByOrder(categoryItems),
      order: sectionOrder++,
      locale,
    });
  }
  return sections;
}

export function validateMenuItem(item: Partial<MenuItem>): string[] {
  const errors: string[] = [];
  if (!item.name?.trim()) errors.push('메뉴 이름을 입력하세요.');
  if (item.price == null || item.price < 0) errors.push('가격은 0 이상이어야 합니다.');
  if (!item.category?.trim()) errors.push('카테고리를 입력하세요.');
  return errors;
}
