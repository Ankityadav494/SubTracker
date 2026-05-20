#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND="$ROOT/apps/frontend"
BUCKET="${S3_BUCKET:-}"
DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID:-}"

if [ -z "$BUCKET" ]; then
  echo "Set S3_BUCKET environment variable"
  exit 1
fi

echo "Building frontend..."
npm run build --prefix "$FRONTEND"

echo "Syncing to s3://$BUCKET ..."
aws s3 sync "$FRONTEND/dist" "s3://$BUCKET" --delete

if [ -n "$DISTRIBUTION_ID" ]; then
  echo "Invalidating CloudFront $DISTRIBUTION_ID ..."
  aws cloudfront create-invalidation \
    --distribution-id "$DISTRIBUTION_ID" \
    --paths "/*"
fi

echo "Deploy complete."
