import { ACTION_ITEMS, actionItem } from './action-item-catalog.mjs';
import { hasEnv, missingKeys } from './env.mjs';
import { addResult } from './reporting.mjs';

function addRequiredKeys(results, env, label, keys, metadataBase) {
  const missing = missingKeys(env, keys);
  const ok = missing.length === 0;
  addResult(
    results,
    ok ? 'PASS' : 'OPEN',
    ok ? `provider ${label}` : `provider ${label} missing ${missing.join(', ')}`,
    ok,
    actionItem(metadataBase, missing),
  );
}

function addCalendar(results, env, label, keys, metadataBase) {
  const missing = missingKeys(env, keys);
  const hasStateSecret = hasEnv(env, 'OAUTH_STATE_SECRET') || hasEnv(env, 'CRON_SECRET');
  const ok = missing.length === 0 && hasStateSecret;
  if (!hasStateSecret) missing.push('OAUTH_STATE_SECRET or CRON_SECRET');
  addResult(
    results,
    ok ? 'PASS' : 'OPEN',
    ok ? `provider ${label}` : `provider ${label} missing ${missing.join(', ')}`,
    ok,
    actionItem(metadataBase, missing),
  );
}

function addBookingMail(results, env) {
  const resendReady = hasEnv(env, 'RESEND_API_KEY');
  const smtpKeys = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
  const smtpMissing = missingKeys(env, smtpKeys);
  const smtpReady = smtpMissing.length === 0;
  const ready = resendReady || smtpReady;

  if (ready) {
    const via = [
      resendReady ? 'RESEND_API_KEY' : '',
      smtpReady ? 'SMTP_HOST/SMTP_USER/SMTP_PASS' : '',
    ].filter(Boolean).join(' and ');
    addResult(results, 'PASS', `provider Booking/form mail ready via ${via}`, true);
  } else {
    addResult(
      results,
      'OPEN',
      'provider Booking/form mail missing either RESEND_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS',
      false,
      actionItem(ACTION_ITEMS.bookingFormMail, [
        'RESEND_API_KEY',
        'SMTP_HOST/SMTP_USER/SMTP_PASS',
      ]),
    );
  }

  addResult(
    results,
    resendReady ? 'PASS' : ready ? 'WARN' : 'OPEN',
    resendReady
      ? 'provider Booking/form mail Resend alternate ready'
      : 'provider Booking/form mail Resend alternate missing RESEND_API_KEY',
    ready || resendReady,
    actionItem(ACTION_ITEMS.bookingFormMailResendAlternate, resendReady ? [] : ['RESEND_API_KEY']),
  );
  addResult(
    results,
    smtpReady ? 'PASS' : ready ? 'WARN' : 'OPEN',
    smtpReady
      ? 'provider Booking/form mail SMTP alternate ready'
      : `provider Booking/form mail SMTP alternate missing ${smtpMissing.join(', ')}`,
    ready || smtpReady,
    actionItem(ACTION_ITEMS.bookingFormMailSmtpAlternate, smtpMissing),
  );
}

function addAnyKey(results, env, label, keys, metadataBase) {
  const present = keys.find((key) => hasEnv(env, key));
  addResult(
    results,
    present ? 'PASS' : 'OPEN',
    present ? `provider ${label} ready via ${present}` : `provider ${label} missing one of ${keys.join(', ')}`,
    Boolean(present),
    actionItem(metadataBase, present ? [] : keys),
  );
}

export function checkProviders(env, results) {
  addRequiredKeys(
    results,
    env,
    'Stripe booking/payment',
    ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
    ACTION_ITEMS.stripeBookingPayment,
  );
  addRequiredKeys(
    results,
    env,
    'Zoom',
    ['ZOOM_ACCOUNT_ID', 'ZOOM_CLIENT_ID', 'ZOOM_CLIENT_SECRET'],
    ACTION_ITEMS.zoom,
  );
  addCalendar(
    results,
    env,
    'Google calendar',
    ['GOOGLE_OAUTH_CLIENT_ID', 'GOOGLE_OAUTH_CLIENT_SECRET', 'GOOGLE_OAUTH_REDIRECT_URI'],
    ACTION_ITEMS.googleCalendar,
  );
  addCalendar(
    results,
    env,
    'Outlook calendar',
    ['MS_OAUTH_CLIENT_ID', 'MS_OAUTH_CLIENT_SECRET', 'MS_OAUTH_REDIRECT_URI'],
    ACTION_ITEMS.outlookCalendar,
  );
  addBookingMail(results, env);
  addAnyKey(
    results,
    env,
    'Marketing mail',
    ['RESEND_API_KEY', 'MAILCHIMP_TRANSACTIONAL_API_KEY', 'MANDRILL_API_KEY'],
    ACTION_ITEMS.marketingMail,
  );
  addRequiredKeys(
    results,
    env,
    'Translation/AI OpenAI',
    ['OPENAI_API_KEY'],
    ACTION_ITEMS.translationAiOpenai,
  );
  addRequiredKeys(
    results,
    env,
    'Translation/AI DeepL',
    ['DEEPL_API_KEY'],
    ACTION_ITEMS.translationAiDeepl,
  );
  addRequiredKeys(
    results,
    env,
    'Upstash rate limit',
    ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'],
    ACTION_ITEMS.upstashRateLimit,
  );
  addRequiredKeys(
    results,
    env,
    'Blob persistence',
    ['BLOB_READ_WRITE_TOKEN'],
    ACTION_ITEMS.blobPersistence,
  );
}
