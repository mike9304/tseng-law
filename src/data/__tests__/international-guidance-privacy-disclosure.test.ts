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
  ar: /في انتظار .{0,20}تأكيد|بانتظار تأكيد المكتب|لم يتأكّد المكتب بعد/,
  de: /steht noch aus|ausstehende Bestätigung|noch nicht bestätigt durch die Kanzlei/,
  es: /pendiente de confirmación|aún no confirmad/,
  fr: /en attente de confirmation|pas encore confirmé par le cabinet/,
  pt: /pendente de confirmação|ainda não confirmad/,
  'zh-hans': /待事务所确认|尚待办公室确认|细节仍待确认/,
  ms: /menunggu pengesahan pejabat|butiran itu belum disahkan oleh pejabat/,
  ru: /ожидает подтверждения бюро|ещё не подтверждено бюро/,
  tr: /büro onayı bekleniyor|büro henüz doğrulamamış/,
  it: /in attesa di conferma dello studio|non ancora confermato dallo studio/,
  nl: /wacht op bevestiging door het kantoor|nog niet bevestigd door het kantoor/,
  pl: /oczekuje potwierdzenia kancelarii|nie zostało jeszcze potwierdzone przez kancelarię/,
  hi: /कार्यालय की पुष्टि की प्रतीक्षा|अभी कार्यालय द्वारा पुष्ट नहीं/,
  sv: /väntar på byråns bekräftelse|ännu inte bekräftat av byrån/,
  da: /venter på kontorets bekræftelse|endnu ikke bekræftet af kontoret/,
  nb: /venter på kontorets bekreftelse|ennå ikke bekreftet av kontoret/,
  fi: /odottaa toimiston vahvistusta|ei ole vielä vahvistettu toimiston toimesta/,
  cs: /není zatím potvrzeno|čeká na potvrzení/i,
  hu: /még nincs megerősítve|megerősítésre vár/i,
  ro: /nu este încă confirmată|așteaptă confirmarea/i,
  uk: /ще не підтверджено|очікує підтвердження/i,
  el: /δεν έχει ακόμη επιβεβαιωθεί|αναμένει επιβεβαίωση/i,
  he: /טרם אושרה|ממתין לאישור/,
  bn: /কার্যালয়ের নিশ্চিতকরণের অপেক্ষা|কার্যালয় এখনও নিশ্চিত করেনি/,
  ur: /دفتر کی تصدیق کا انتظار|دفتر نے ابھی تصدیق نہیں کی/,
  fa: /در انتظار .{0,20}تأیید|در انتظار تأیید دفتر|دفتر هنوز تأیید نکرده/,
  my: /รอการยืนยัน|ยังไม่ได้รับการยืนยัน/, // SCAFFOLD(th)
  ta: /அலுவலக உறுதிப்பாட்டுக்காகக் காத்திருக்கிறது|அலுவலகம் இன்னும் உறுதிப்படுத்தவில்லை/,
  ne: /कार्यालयको पुष्टिको प्रतीक्षा|कार्यालयद्वारा अझै पुष्टि भएको छैन/,
  km: /รอการยืนยัน|ยังไม่ได้รับการยืนยัน/, // SCAFFOLD(th)
  mn: /ожидает подтверждения бюро|ещё не подтверждено бюро/, // SCAFFOLD(ru)
  sk: /zatiaľ nie je potvrdené kanceláriou|čaká na potvrdenie kancelárie/i,
  bg: /очаква потвърждение от кантората|все още не е потвърдено от кантората/,
  hr: /čeka potvrdu ureda|još nije potvrđeno od strane ureda/i,
  sr: /čeka potvrdu kancelarije|kancelarija još nije potvrdila|detalji politike još nisu potvrđeni/i,
  sl: /še ni potrjeno s strani pisarne|čaka na potrditev pisarne/,
  lt: /laukia kontoros patvirtinimo|kontora dar nepatvirtino/i,
  lv: /gaida biroja apstiprinājumu|birojs vēl nav apstiprinājis|není zatím potvrzeno|čeká na potvrzení/i,
  et: /büroo kinnitust oodates|büroo ei ole veel kinnitanud|ootab büroo kinnitust/i,
  ca: /pendent de confirmació|encara no confirmat/i,
  is: /bíður staðfestingar skrifstofunnar|ekki enn staðfest af skrifstofunni/i,
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
      hosting: /Situs ini diselenggarakan di Vercel/,
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
    {
      locale: 'ar',
      heading: 'مكان تخزين البيانات ومقدّمو الخدمات',
      hosting: /هذا الموقع مستضاف على Vercel/,
      deletion: /تُحذَف المعلومات دون تأخير/,
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
