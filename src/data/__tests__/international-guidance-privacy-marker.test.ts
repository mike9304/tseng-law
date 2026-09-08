import { describe, expect, it } from 'vitest';
import { guidanceContent } from '@/data/international-guidance-content';
import { GUIDANCE_LOCALES_4 } from '@/lib/public-guidance';

/**
 * The four existing locales mark unconfirmed operator facts with an explicit
 * "requires operator confirmation" phrase (see
 * `privacy-policy-operational-facts.test.ts`). The four guidance locales must
 * carry an equivalent marker so their thinner privacy page never reads as if
 * the collecting entity, retention rule, processors and storage region were
 * settled facts.
 */
describe('international guidance privacy — pending operator confirmation marker', () => {
  it('places the marker as a dedicated section on every guidance locale privacy page', () => {
    for (const locale of GUIDANCE_LOCALES_4) {
      const privacy = guidanceContent[locale].pages.privacy;
      const marker = privacy.sections.at(-1);

      expect(marker, `missing marker section for ${locale}`).toBeDefined();
      expect(marker?.paragraphs.length ?? 0).toBeGreaterThanOrEqual(2);
    }
  });

  it.each([
    {
      locale: 'vi',
      heading: 'Những chi tiết còn chờ văn phòng xác nhận',
      pending: /đang chờ văn phòng vận hành trang này xác nhận/,
      askFirst: /hãy hỏi trước qua địa chỉ thư điện tử trên trang liên hệ rồi mới gửi thông tin nhạy cảm/,
    },
    {
      locale: 'id',
      heading: 'Rincian yang masih menunggu konfirmasi kantor',
      pending: /masih menunggu konfirmasi dari kantor yang mengelola situs ini/,
      askFirst: /tanyakan lebih dahulu melalui alamat surel pada halaman kontak sebelum Anda mengirimkan informasi yang bersifat sensitif/,
    },
    {
      locale: 'th',
      heading: 'รายละเอียดที่ยังรอการยืนยันจากสำนักงาน',
      pending: /ยังรอการยืนยันจากสำนักงานที่ดูแลเว็บไซต์นี้/,
      askFirst: /โปรดสอบถามทางอีเมลตามที่อยู่ในหน้าติดต่อก่อน แล้วจึงส่งข้อมูลที่มีความอ่อนไหว/,
    },
    {
      locale: 'fil',
      heading: 'Mga detalyeng hinihintay pang kumpirmahin ng tanggapan',
      pending: /Hinihintay pang kumpirmahin ang mga detalyeng ito ng tanggapang nagpapatakbo ng website na ito/,
      askFirst: /magtanong ka muna sa pamamagitan ng email address na nasa pahina ng kontak bago ka magpadala ng sensitibong impormasyon/,
    },
  ] as const)('states the pending facts and the ask-first instruction in $locale', ({ locale, heading, pending, askFirst }) => {
    const section = guidanceContent[locale].pages.privacy.sections.at(-1);
    const text = [section?.heading ?? '', ...(section?.paragraphs ?? [])].join(' ');

    expect(section?.heading).toBe(heading);
    expect(text).toMatch(pending);
    expect(text).toMatch(askFirst);
  });

  it('keeps the marker honest — no retention period, processor name or storage region is asserted', () => {
    for (const locale of GUIDANCE_LOCALES_4) {
      const text = JSON.stringify(guidanceContent[locale].pages.privacy);

      expect(text).not.toMatch(/Vercel|OpenAI|Amazon|AWS|Google Cloud|Azure|SMTP/i);
      expect(text).not.toMatch(/\b(?:30|60|90|180|365)\s*(?:day|days|hari|วัน|araw|ngày)\b/i);
    }
  });
});
