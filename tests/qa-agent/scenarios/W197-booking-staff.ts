import { expect } from '@playwright/test';

import type { CheckpointDefinition, CheckpointFinding } from '../types';
import {
  cleanupFiles,
  createServiceFixture,
  createValues,
  fillStaffForm,
  goServiceEditor,
  goStaffPage,
  headersFor,
  saveServiceDialog,
  saveStaffDialog,
  staffCard,
  updateValues,
  waitForService,
  waitForStaff,
} from './W197-booking-staff-helpers';

function blocker(summary: string): CheckpointFinding {
  return { severity: 'blocker', summary };
}

export const checkpoint: CheckpointDefinition = {
  id: 'W197',
  title: 'Staff profile and service assignment',
  verification: 'Admin Bookings Staff UI에서 담당자 생성/편집/비활성화 후 Services UI에서 해당 담당자를 서비스에 배정',
  async run({ page, baseUrl, recordEvidence }) {
    const findings: CheckpointFinding[] = [];
    const token = Date.now().toString(36);
    const headers = headersFor(token);
    let staffId: string | null = null;
    let serviceId: string | null = null;

    try {
      const createdValues = createValues(token);
      await goStaffPage(page, baseUrl, token);
      await page.getByRole('button', { name: '새 담당자' }).click();
      await fillStaffForm(page, createdValues);
      await saveStaffDialog(page, '새 담당자');
      const created = await waitForStaff(page, {
        headers,
        match: (staff) => staff.name.ko === createdValues.nameKo && staff.email === createdValues.email && staff.isActive === true,
      });
      if (!created) {
        findings.push(blocker('담당자 생성 후 API 저장값을 확인하지 못했습니다.'));
        return { findings };
      }
      const createdStaffId = created.staffId;
      staffId = createdStaffId;
      await recordEvidence('W197 staff profile created through admin UI and persisted via API', page);

      const updatedValues = updateValues(token);
      await staffCard(page, token).getByRole('button', { name: '편집' }).click();
      await fillStaffForm(page, updatedValues);
      await saveStaffDialog(page, '담당자 편집');
      const updated = await waitForStaff(page, {
        headers,
        match: (staff) =>
          staff.staffId === createdStaffId &&
          staff.name.ko === updatedValues.nameKo &&
          staff.title.ko === updatedValues.titleKo &&
          staff.bio.ko === updatedValues.bioKo &&
          staff.email === updatedValues.email &&
          staff.photo === updatedValues.photo,
      });
      if (!updated) {
        findings.push(blocker('담당자 편집 후 API 저장값을 확인하지 못했습니다.'));
        return { findings };
      }
      await recordEvidence('W197 staff profile edited through admin UI and persisted via API', page);

      const service = await createServiceFixture(page, token, headers);
      if (!service) {
        findings.push(blocker('서비스 배정 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      const assignmentServiceId = service.serviceId;
      serviceId = assignmentServiceId;
      await goServiceEditor(page, baseUrl, token, assignmentServiceId);
      const staffCheckbox = page.getByLabel(updatedValues.nameKo, { exact: true });
      await staffCheckbox.check();
      await expect(staffCheckbox).toBeChecked();
      await saveServiceDialog(page);
      const assigned = await waitForService(page, {
        headers,
        match: (item) => item.serviceId === assignmentServiceId && item.staffIds.includes(createdStaffId),
      });
      if (!assigned) {
        findings.push(blocker('서비스 편집 UI 저장 후 담당자 배정 API 저장값을 확인하지 못했습니다.'));
        return { findings };
      }
      await recordEvidence('W197 staff assigned to service through services UI and persisted via API', page);

      await goStaffPage(page, baseUrl, token);
      await staffCard(page, token).getByRole('button', { name: '비활성화' }).click();
      const inactive = await waitForStaff(page, {
        headers,
        match: (staff) => staff.staffId === createdStaffId && staff.isActive === false,
      });
      if (!inactive) {
        findings.push(blocker('담당자 비활성화 후 API에서 isActive=false 상태를 확인하지 못했습니다.'));
      }
      await recordEvidence('W197 staff deactivated through admin UI and persisted via API', page);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      findings.push(blocker(`담당자/서비스 배정 검증 중 예외가 발생했습니다: ${detail}`));
    } finally {
      await cleanupFiles({ staffId, serviceId });
    }

    return { findings };
  },
};
