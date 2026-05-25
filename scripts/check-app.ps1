# SubTracker health check — run from project root: .\scripts\check-app.ps1
$api = "https://subtracker-1-tsuh.onrender.com/api"
Write-Host "`n=== SubTracker health check ===" -ForegroundColor Cyan

try {
  $health = Invoke-RestMethod -Uri "$api/health" -TimeoutSec 60
  Write-Host "[OK] API health:" ($health | ConvertTo-Json -Compress) -ForegroundColor Green
} catch {
  Write-Host "[FAIL] API not reachable (Render may be waking up — wait 1-2 min)" -ForegroundColor Red
  Write-Host $_.Exception.Message
}

try {
  $email = Invoke-RestMethod -Uri "$api/health/email" -TimeoutSec 60
  if ($email.ok) {
    Write-Host "[OK] Email:" $email.via -ForegroundColor Green
  } else {
    Write-Host "[WARN] Email:" ($email | ConvertTo-Json -Compress) -ForegroundColor Yellow
  }
} catch {
  Write-Host "[WARN] Email health check failed" -ForegroundColor Yellow
}

$localPort = 5173
foreach ($p in 5173, 5174, 5175, 5176) {
  try {
    $r = Invoke-WebRequest -Uri "http://localhost:$p/api/health" -TimeoutSec 3 -UseBasicParsing
    if ($r.StatusCode -eq 200) {
      $localPort = $p
      Write-Host "[OK] Local Vite proxy on port $p" -ForegroundColor Green
      break
    }
  } catch { }
}
if ($localPort -eq 5173) {
  $tested = $false
  foreach ($p in 5173, 5174, 5175, 5176) {
    try {
      Invoke-WebRequest -Uri "http://localhost:$p/api/health" -TimeoutSec 2 -UseBasicParsing | Out-Null
      $tested = $true
      break
    } catch { }
  }
  if (-not $tested) {
    Write-Host "[INFO] Local dev not running — start with: npm run dev" -ForegroundColor Gray
  }
}

Write-Host "`nNext: npm run dev  →  open http://localhost:5173" -ForegroundColor Cyan
Write-Host "Guide: SETUP-GUIDE.md`n"
