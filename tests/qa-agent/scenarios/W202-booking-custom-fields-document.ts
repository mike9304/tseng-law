const baseStyle = {
  backgroundColor: 'transparent',
  borderColor: '#cbd5e1',
  borderStyle: 'solid',
  borderWidth: 0,
  borderRadius: 0,
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowSpread: 0,
  shadowColor: 'rgba(15, 23, 42, 0.16)',
  opacity: 100,
};

export const caseSummaryLabel = 'W202 사건 개요';
export const attachmentLinksLabel = 'W202 증빙 링크';
export const customFieldOneLabel = 'W202 희망 상담 언어';
export const customFieldTwoLabel = 'W202 상대방 이름';

export function bookingCustomFieldsDocument(token: string, serviceId: string, staffId: string): Record<string, unknown> {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `w202-booking-custom-fields-${token}`,
    stageWidth: 1280,
    stageHeight: 820,
    nodes: [
      {
        id: `root-${token}`,
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 820 },
        style: baseStyle,
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'W202 booking form root',
          background: '#ffffff',
          borderColor: 'transparent',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: 0,
          padding: 0,
          layoutMode: 'absolute',
          as: 'main',
        },
      },
      {
        id: `heading-${token}`,
        kind: 'text',
        parentId: `root-${token}`,
        rect: { x: 72, y: 38, width: 820, height: 58 },
        style: baseStyle,
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: `W202 예약 커스텀 필드 ${token}`,
          fontSize: 34,
          color: '#172033',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.2,
          letterSpacing: 0,
          fontFamily: 'system-ui',
          verticalAlign: 'top',
          textTransform: 'none',
          as: 'h1',
        },
      },
      {
        id: `booking-${token}`,
        kind: 'booking-widget',
        parentId: `root-${token}`,
        rect: { x: 72, y: 118, width: 900, height: 680 },
        style: baseStyle,
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          eyebrow: 'Bookings',
          title: 'W202 custom booking form fields',
          locale: 'ko',
          serviceId,
          staffId,
          successMessage: `W202 예약 완료 ${token}`,
          redirectAfterBooking: '',
          showCaseSummary: true,
          caseSummaryLabel,
          showAttachmentLinks: true,
          attachmentLinksLabel,
          customFieldLabels: `${customFieldOneLabel}\n${customFieldTwoLabel}`,
        },
      },
    ],
  };
}
