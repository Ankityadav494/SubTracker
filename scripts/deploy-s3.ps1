param(
  [string]$Bucket = $env:S3_BUCKET,
  [string]$DistributionId = $env:CLOUDFRONT_DISTRIBUTION_ID
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Frontend = Join-Path $Root "apps\frontend"

if (-not $Bucket) {
  Write-Host "Set S3_BUCKET environment variable or pass -Bucket"
  exit 1
}

Write-Host "Building frontend..."
Push-Location $Frontend
npm run build
Pop-Location

$Dist = Join-Path $Frontend "dist"
Write-Host "Syncing $Dist to s3://$Bucket ..."
aws s3 sync $Dist "s3://$Bucket" --delete

if ($DistributionId) {
  Write-Host "Invalidating CloudFront distribution $DistributionId ..."
  aws cloudfront create-invalidation --distribution-id $DistributionId --paths "/*"
}

Write-Host "Deploy complete."
