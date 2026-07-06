#!/bin/zsh
# QA harness server — production build with deterministic local backends and
# test-friendly secrets. Used by the Playwright suite runs.
# Usage: ./scripts/start-qa-server.sh   (foreground; Ctrl-C to stop)
cd "$(dirname "$0")/.."

# Kill-switch: blank the Blob token so EVERY store module (site, pages,
# bookings, commerce, revisions, forms, ...) falls back to local files.
# Next.js env loading does not override variables already set in the
# environment, so this beats .env.local.
export BLOB_READ_WRITE_TOKEN=
export BUILDER_SITE_BACKEND=local
export CONSULTATION_LOG_BACKEND=local
export BOOKING_PAYMENT_ALLOW_STUB=1
export BUILDER_ZOOM_MOCK_ALLOW=1
export BOOKING_STRIPE_WEBHOOK_ALLOW_UNSIGNED=1
export BILLING_DOCUMENT_STRIPE_WEBHOOK_ALLOW_UNSIGNED=1
export COMMERCE_PAYMENT_WEBHOOK_SECRET=local-commerce-webhook-secret
export BILLING_DOCUMENT_SHARE_SECRET=local-billing-share-secret
export CRON_SECRET=local-cron-secret
export BUILDER_MUTATION_RATE_LIMIT=2000
export BUILDER_PUBLISH_RATE_LIMIT=500
export BUILDER_ASSET_RATE_LIMIT=500

exec npm run start
