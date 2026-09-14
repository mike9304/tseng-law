import { describe, expect, it } from 'vitest';
import { guidanceContent } from '@/data/international-guidance-content';
import { GUIDANCE_LOCALES_4 } from '@/lib/public-guidance';

/**
 * Owner decision (2026-09-09): the guidance privacy pages are published client
 * facing policy. The section that used to say "these details are still pending
 * confirmation by the office" is now a normal storage-and-providers section:
 * it states what the firm has confirmed (Vercel hosting with private object
 * storage, the office mail path, deletion once the purpose is met, and the
 * privacy contact) and invents nothing to fill the remaining gaps.
 */
const PENDING_CONFIRMATION: Record<(typeof GUIDANCE_LOCALES_4)[number], RegExp> = {
  vi: /chờ .{0,40}xác nhận|đang chờ văn phòng/i,
  id: /menunggu konfirmasi|rincian itu belum dikonfirmasi/i,
  th: /รอการยืนยัน|ยังไม่ได้รับการยืนยัน/,
  fil: /hinihintay pang kumpirmahin|hindi pa nakukumpirma ang mga detalye/i,
};

const GENERIC_PENDING = /pending confirmation|operator confirmation|confirmed by the operator/i;

/** No mail vendor, analytics vendor, storage region or extra retention period. */
const INVENTED_OPERATIONAL_DETAIL =
  /SMTP|SendGrid|Mailgun|Postmark|Amazon SES|\bAWS\b|Google Analytics|Google Cloud|Azure|Cloudflare|us-east|ap-northeast|\b(?:7|14|30|60|90|180|365)\s*(?:day|days|hari|วัน|araw|ngày)\b/i;

describe('international guidance privacy pages', () => {
  it('never tells the reader that a policy detail is pending confirmation by the office', () => {
    for (const locale of GUIDANCE_LOCALES_4) {
      const text = JSON.stringify(guidanceContent[locale].pages.privacy);

      expect(text, `pending-confirmation copy left in ${locale}`).not.toMatch(
        PENDING_CONFIRMATION[locale],
      );
      expect(text, `pending-confirmation copy left in ${locale}`).not.toMatch(GENERIC_PENDING);
    }
  });

  it('closes every privacy page with a storage, provider and contact section', () => {
    for (const locale of GUIDANCE_LOCALES_4) {
      const privacy = guidanceContent[locale].pages.privacy;
      const section = privacy.sections.at(-1);
      const text = [section?.heading ?? '', ...(section?.paragraphs ?? [])].join(' ');

      expect(section, `missing closing section for ${locale}`).toBeDefined();
      expect(section?.heading ?? '').not.toBe('');
      expect(section?.paragraphs.length ?? 0).toBeGreaterThanOrEqual(2);
      expect(text, `hosting fact missing in ${locale}`).toContain('Vercel');
      expect(text, `privacy contact missing in ${locale}`).toContain('wei@hoveringlaw.com.tw');
    }
  });

  it.each([
    {
      locale: 'vi',
      heading: 'Nơi lưu trữ dữ liệu và các nhà cung cấp dịch vụ',
      hosting: /Trang web này được lưu trữ trên Vercel/,
      deletion: /thông tin được xóa không chậm trễ/,
    },
    {
      locale: 'id',
      heading: 'Tempat penyimpanan data dan penyedia layanan',
      hosting: /Situs ini dihosting di Vercel/,
      deletion: /data dihapus tanpa penundaan/,
    },
    {
      locale: 'th',
      heading: 'สถานที่จัดเก็บข้อมูลและผู้ให้บริการ',
      hosting: /เว็บไซต์นี้ใช้บริการโฮสติงของ Vercel/,
      deletion: /ข้อมูลจะถูกลบโดยไม่ชักช้า/,
    },
    {
      locale: 'fil',
      heading: 'Saan nakaimbak ang impormasyon at ang mga tagapaglaan ng serbisyo',
      hosting: /Naka-host sa Vercel ang website na ito/,
      deletion: /binubura ang impormasyon nang walang pagkaantala/,
    },
  ] as const)('states hosting, storage location and deletion in plain policy language in $locale', ({ locale, heading, hosting, deletion }) => {
    const section = guidanceContent[locale].pages.privacy.sections.at(-1);
    const text = [section?.heading ?? '', ...(section?.paragraphs ?? [])].join(' ');

    expect(section?.heading).toBe(heading);
    expect(text).toMatch(hosting);
    expect(text).toMatch(deletion);
  });

  it('keeps the disclosure honest — no unsupported vendor, region or retention period', () => {
    for (const locale of GUIDANCE_LOCALES_4) {
      const text = JSON.stringify(guidanceContent[locale].pages.privacy);

      expect(text, `unsupported operational detail in ${locale}`).not.toMatch(
        INVENTED_OPERATIONAL_DETAIL,
      );
    }
  });
});
