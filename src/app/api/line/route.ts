import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// ── ENV ──
const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || '';
const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || '';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'wei@hoveringlaw.com.tw';
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';

// ── 인사말 템플릿 ──
const GREETING_MESSAGE = `안녕하세요! 법무법인 호정(昊鼎國際法律事務所)입니다 🏛️

상담 예약을 원하시면 아래 정보를 남겨주세요:

1️⃣ 성함
2️⃣ 연락처 (전화번호 또는 이메일)
3️⃣ 문의 분야 (법인설립/소송/이혼/노동법/기타)
4️⃣ 간단한 문의 내용

영업시간: 평일 09:00~18:00 (Asia/Taipei)
담당자 확인 후 빠르게 연락드리겠습니다.

您好！歡迎來到昊鼎國際法律事務所 🏛️
如需預約諮詢，請留下以下資訊：姓名、聯絡方式、諮詢領域、簡述問題。`;

const AUTO_REPLY = `감사합니다! 메시지가 접수되었습니다 ✅
담당자가 확인 후 빠르게 연락드리겠습니다.

收到您的訊息了 ✅ 我們會盡快與您聯繫。`;

// ── 서명 검증 ──
function verifySignature(body: string, signature: string): boolean {
  if (!CHANNEL_SECRET) return false;
  const hash = crypto
    .createHmac('SHA256', CHANNEL_SECRET)
    .update(body)
    .digest('base64');
  return hash === signature;
}

// ── LINE Reply API ──
async function replyMessage(replyToken: string, text: string): Promise<void> {
  await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: 'text', text }],
    }),
  });
}

// ── 이메일 알림 ──
async function sendEmailNotification(userId: string, userText: string): Promise<void> {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn('[LINE] SMTP 설정 없음 - 이메일 알림 건너뜀');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Taipei' });

  await transporter.sendMail({
    from: `"호정 LINE Bot" <${SMTP_USER}>`,
    to: NOTIFY_EMAIL,
    subject: `[LINE 상담문의] 새 메시지 접수 - ${now}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <h2 style="color:#6b46c1;border-bottom:2px solid #6b46c1;padding-bottom:10px;">
          📩 LINE 새 상담 문의
        </h2>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr>
            <td style="padding:8px 12px;background:#f7f7f7;font-weight:bold;width:120px;">접수 시간</td>
            <td style="padding:8px 12px;">${now}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;background:#f7f7f7;font-weight:bold;">사용자 ID</td>
            <td style="padding:8px 12px;font-family:monospace;font-size:13px;">${userId}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;background:#f7f7f7;font-weight:bold;">메시지 내용</td>
            <td style="padding:8px 12px;white-space:pre-wrap;">${userText}</td>
          </tr>
        </table>
        <p style="color:#888;font-size:12px;">
          이 메일은 LINE Messaging API 웹훅에서 자동 발송되었습니다.
        </p>
      </div>
    `,
  });

  console.log(`[LINE] 이메일 알림 전송 완료 → ${NOTIFY_EMAIL}`);
}

// ── Webhook GET (LINE 검증용) ──
export async function GET() {
  return NextResponse.json({ status: 'ok' });
}

// ── Webhook POST (메시지 수신) ──
export async function POST(req: NextRequest) {
  const body = await req.text();

  // 서명 검증
  const signature = req.headers.get('x-line-signature') || '';
  if (CHANNEL_SECRET && !verifySignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  }

  let parsed: { events?: Array<{
    type: string;
    replyToken?: string;
    source?: { userId?: string; type?: string };
    message?: { type?: string; text?: string };
  }> };

  try {
    parsed = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const events = parsed.events || [];

  for (const event of events) {
    try {
      // 친구 추가 시 인사말 전송
      if (event.type === 'follow' && event.replyToken) {
        await replyMessage(event.replyToken, GREETING_MESSAGE);
        continue;
      }

      // 텍스트 메시지 수신 시 자동 답변
      if (event.type === 'message' && event.message?.type === 'text' && event.replyToken) {
        const userText = event.message.text || '';
        const userId = event.source?.userId || 'unknown';

        // 로그 + 이메일 알림
        console.log(`[LINE] User ${userId}: ${userText}`);

        // 이메일 알림 (비동기, 실패해도 자동답변은 보냄)
        sendEmailNotification(userId, userText).catch((err) =>
          console.error('[LINE] 이메일 알림 실패:', err)
        );

        await replyMessage(event.replyToken, AUTO_REPLY);
        continue;
      }
    } catch (err) {
      console.error('[LINE] Event processing error:', err);
    }
  }

  return NextResponse.json({ status: 'ok' });
}
