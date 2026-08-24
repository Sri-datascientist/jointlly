# Quick local DB setup when you know MySQL root password (no service restart).
# Usage:
#   .\scripts\setup_local_db.ps1 -RootPassword "your-root-password"
#
# Or if jointlly_user already works:
#   .\scripts\setup_local_db.ps1 -SkipUserSetup

param(
    [string]$RootPassword = "",
    [switch]$SkipUserSetup
)

$ErrorActionPreference = "Stop"
$MysqlBin = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
if (-not (Test-Path $MysqlBin)) { $MysqlBin = "mysql" }

$BackendRoot = Split-Path $PSScriptRoot -Parent
$DumpFile = Join-Path $BackendRoot "jointlly_dump.sql"
$SetupSql = Join-Path $PSScriptRoot "setup_jointlly_db.sql"

function Test-JointllyUser {
    & $MysqlBin -u jointlly_user "-pJointlly2026_secure" -h 127.0.0.1 -e "SELECT 1" 2>$null
    return $LASTEXITCODE -eq 0
}

if (Test-JointllyUser) {
    Write-Host "jointlly_user already connects."
} elseif (-not $SkipUserSetup) {
    if (-not $RootPassword) {
        Write-Host "jointlly_user cannot connect."
        Write-Host "Either:"
        Write-Host "  1) Run as Admin: .\scripts\reset_and_import_as_admin.ps1"
        Write-Host "  2) Or: .\scripts\setup_local_db.ps1 -RootPassword `"your-mysql-root-password`""
        exit 1
    }
    Write-Host "Creating database and jointlly_user..."
    Get-Content $SetupSql -Raw -Encoding UTF8 | & $MysqlBin -u root "-p$RootPassword" -h 127.0.0.1 --default-character-set=utf8mb4
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

if (-not (Test-Path $DumpFile)) {
    Write-Warning "Dump not found at $DumpFile — skipping import."
    exit 0
}

$tableCount = & $MysqlBin -u jointlly_user "-pJointlly2026_secure" -h 127.0.0.1 jointlly -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='jointlly';" 2>$null
if ($tableCount -and [int]$tableCount -gt 5) {
    Write-Host "Database already has $tableCount tables — skipping import."
} else {
    Write-Host "Importing jointlly_dump.sql..."
    Get-Content $DumpFile -Raw -Encoding UTF8 | & $MysqlBin -u jointlly_user "-pJointlly2026_secure" -h 127.0.0.1 --default-character-set=utf8mb4 jointlly
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host "Seeding local admin (admin@jointlly.local / Admin@12345)..."
Push-Location $BackendRoot
python scripts/seed_admin_dummy.py
Pop-Location

Write-Host "Done. Restart uvicorn and log in with admin@jointlly.local / Admin@12345"
