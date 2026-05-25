# Paste your Brevo API key (xkeysib-...) after creating it at:
# https://app.brevo.com/settings/keys/api
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "`n=== SubTracker OTP email setup ===" -ForegroundColor Cyan
Write-Host "1. Opening Brevo API keys page..."
Start-Process "https://app.brevo.com/settings/keys/api"

Write-Host "`n2. Click Generate API key -> Transactional -> Copy the key (starts with xkeysib-)"
$key = Read-Host "`n3. Paste your Brevo API key here"

if (-not $key -or $key -notmatch '^xkeysib-') {
  Write-Host "Invalid key. Must start with xkeysib- (NOT xsmtpsib- SMTP key)." -ForegroundColor Red
  exit 1
}

node scripts/setup-brevo-api-key.js $key.Trim()
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "`n=== RENDER (required for live signup) ===" -ForegroundColor Yellow
Write-Host "Open: https://dashboard.render.com"
Write-Host "Service: subtracker-api -> Environment -> Add:"
Write-Host "  BREVO_API_KEY = $key"
Write-Host "Then click Manual Deploy.`n"

Start-Process "https://dashboard.render.com"
